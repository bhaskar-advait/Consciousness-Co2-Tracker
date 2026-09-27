const http = require('http');

function makeRequest(path, method, body, token) {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : '';
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function runTests() {
    console.log("=== STARTING INTEGRATION TESTS ===");

    // 1. Test Signup
    const testEmail = `bhaskar_test_${Date.now()}@example.com`;
    console.log("\n1. Testing Signup...");
    const signupRes = await makeRequest('/api/auth/signup', 'POST', {
        name: 'Bhaskar Sharma',
        email: testEmail,
        password: 'password123',
        language: 'hi',
        voice_mode: true
    });
    console.log("Signup Response Status:", signupRes.status);
    if (signupRes.status !== 200 || !signupRes.body.token) {
        throw new Error("Signup test failed: " + JSON.stringify(signupRes.body));
    }
    const token = signupRes.body.token;
    console.log("✓ Signup Successful. Token received.");

    // 2. Test Login
    console.log("\n2. Testing Login...");
    const loginRes = await makeRequest('/api/auth/login', 'POST', {
        email: testEmail,
        password: 'password123'
    });
    console.log("Login Response Status:", loginRes.status);
    if (loginRes.status !== 200 || !loginRes.body.token) {
        throw new Error("Login test failed: " + JSON.stringify(loginRes.body));
    }
    console.log("✓ Login Successful.");

    // 3. Test CO2 Calculation
    console.log("\n3. Testing CO2 Calculator...");
    const co2Res = await makeRequest('/api/co2/calculate', 'POST', {
        electricity_kwh: 200,
        food_items: { food_beef: 2, food_rice: 10, food_pulses: 5 },
        transport_items: { trans_car: 150, trans_bike: 50 },
        lpg_cylinders: 1,
        png_scm: 10
    }, token);
    console.log("CO2 Response Status:", co2Res.status);
    console.log("Total Monthly CO2e:", co2Res.body.total_co2e_monthly, "kg CO2e");
    console.log("Tree-years equivalent:", co2Res.body.tree_years_equivalent);
    if (co2Res.status !== 200 || !co2Res.body.total_co2e_monthly) {
        throw new Error("CO2 Calculation failed: " + JSON.stringify(co2Res.body));
    }
    console.log("✓ CO2 Calculation Successful.");

    // 4. Test Save Consciousness Assessment
    console.log("\n4. Testing Save Consciousness Assessment...");
    const consRes = await makeRequest('/api/consciousness/save', 'POST', {
        score: 32,
        percentage: 80,
        classification_en: 'Good Awareness',
        classification_hi: 'अच्छी जागरूकता',
        answers: [4, 1, 0, 0, 2, 4, 0, 4, 0, 4]
    }, token);
    console.log("Assessment Save Status:", consRes.status);
    if (consRes.status !== 200) {
        throw new Error("Assessment save failed: " + JSON.stringify(consRes.body));
    }
    console.log("✓ Assessment Saved Successfully.");

    // 5. Test Reflections CRUD
    console.log("\n5. Testing Reflections CRUD...");
    const refAddRes = await makeRequest('/api/reflections', 'POST', {
        text: 'Today I observed my tendency to compare myself with others and questioned why I do it.'
    }, token);
    console.log("Reflection Add Status:", refAddRes.status);
    const refId = refAddRes.body.id;

    const refGetRes = await makeRequest('/api/reflections', 'GET', null, token);
    console.log("Reflections Count:", refGetRes.body.length);

    const refEditRes = await makeRequest(`/api/reflections/${refId}`, 'PUT', {
        text: 'Updated Reflection: Questioning my conditioning brings clarity.'
    }, token);
    console.log("Reflection Edit Status:", refEditRes.status);

    console.log("✓ Reflections CRUD Successful.");

    // 6. Test Feedback Submission
    console.log("\n6. Testing Feedback Submission...");
    const fbRes = await makeRequest('/api/feedback', 'POST', {
        text: 'Great website! The CO2 tracker and self-reflection questions are very impactful.'
    }, token);
    console.log("Feedback Status:", fbRes.status);
    console.log("✓ Feedback Submission Successful.");

    // 7. Test Dashboard Aggregation
    console.log("\n7. Testing Dashboard Aggregation...");
    const dashRes = await makeRequest('/api/dashboard', 'GET', null, token);
    console.log("Dashboard Status:", dashRes.status);
    console.log("Latest CO2 in Dashboard:", dashRes.body.latest_co2.total_co2e);
    console.log("Latest Assessment Score in Dashboard:", dashRes.body.latest_consciousness.percentage, "%");
    console.log("User Reflections Count:", dashRes.body.reflections.length);
    if (dashRes.status !== 200 || !dashRes.body.latest_co2 || !dashRes.body.latest_consciousness) {
        throw new Error("Dashboard API test failed!");
    }

    console.log("\n==========================================");
    console.log("🎉 ALL INTEGRATION TESTS PASSED CLEANLY! 🎉");
    console.log("==========================================");
}

runTests().catch(err => {
    console.error("❌ TEST FAILURE:", err);
    process.exit(1);
});
