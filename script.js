/* =========================================================
   CONSCIOUSNESS WITH BHASKAR
   Complete Application Script
   ========================================================= */

let currentLanguage = "en";
let voiceMode = false;
let voiceLanguage = "en";

let currentQuestion = 0;
let answers = Array(10).fill(null);
let voices = [];

let authToken = localStorage.getItem('bhaskar_token') || null;
let currentUser = null;
let latestCO2Data = null;
let latestAssessmentData = null;

/* =========================================================
   API HELPER (SERVER FIRST + STANDALONE LOCALSTORAGE FALLBACK)
   ========================================================= */

const API_BASE = (window.location.protocol === 'file:' || !window.location.origin || window.location.origin === 'null') ? 'http://localhost:3000' : '';

async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(API_BASE + endpoint, options);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'API Request Failed');
        }
        return data;
    } catch (err) {
        console.warn(`Server API call (${endpoint}) failed. Switching to local standalone engine...`, err);
        return handleLocalFallback(endpoint, method, body);
    }
}

function handleLocalFallback(endpoint, method, body) {
    let users = JSON.parse(localStorage.getItem('bhaskar_users') || '[]');
    let co2History = JSON.parse(localStorage.getItem('bhaskar_co2_history') || '[]');
    let consHistory = JSON.parse(localStorage.getItem('bhaskar_cons_history') || '[]');
    let reflections = JSON.parse(localStorage.getItem('bhaskar_reflections') || '[]');
    let feedback = JSON.parse(localStorage.getItem('bhaskar_feedback') || '[]');

    // Signup
    if (endpoint === '/api/auth/signup' && method === 'POST') {
        const { name, email, password, language, voice_mode } = body || {};
        if (!email || !password) throw new Error("Email and password are required");
        let existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) throw new Error("Account with this email already exists");

        const newUser = {
            id: Date.now(),
            name: name || 'User',
            email: email.toLowerCase(),
            password: password,
            language: language || currentLanguage || 'en',
            voice_mode: voice_mode ? true : false,
            created_at: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('bhaskar_users', JSON.stringify(users));

        const token = 'local_token_' + Date.now();
        localStorage.setItem('bhaskar_local_user', JSON.stringify(newUser));
        return { token, user: newUser };
    }

    // Login
    if (endpoint === '/api/auth/login' && method === 'POST') {
        const { email, password } = body || {};
        if (!email || !password) throw new Error("Email and password are required");
        let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            user = {
                id: Date.now(),
                name: email.split('@')[0] || 'User',
                email: email.toLowerCase(),
                password: password,
                language: currentLanguage || 'en',
                voice_mode: voiceMode || false,
                created_at: new Date().toISOString()
            };
            users.push(user);
            localStorage.setItem('bhaskar_users', JSON.stringify(users));
        } else if (user.password !== password) {
            throw new Error("Invalid email or password");
        }

        const token = 'local_token_' + Date.now();
        localStorage.setItem('bhaskar_local_user', JSON.stringify(user));
        return { token, user };
    }

    // Me
    if (endpoint === '/api/auth/me') {
        const localUser = JSON.parse(localStorage.getItem('bhaskar_local_user') || 'null');
        if (localUser) return localUser;
        throw new Error("User not found");
    }

    // Dashboard
    if (endpoint === '/api/dashboard') {
        const localUser = JSON.parse(localStorage.getItem('bhaskar_local_user') || '{"name":"User"}');
        const userCo2 = co2History.filter(r => r.user_id === localUser.id || !r.user_id);
        const userCons = consHistory.filter(r => r.user_id === localUser.id || !r.user_id);
        const userRefs = reflections.filter(r => r.user_id === localUser.id || !r.user_id);
        const userFb = feedback.filter(r => r.user_id === localUser.id || !r.user_id);

        return {
            user: localUser,
            latest_co2: userCo2[0] || null,
            co2_history: userCo2,
            latest_consciousness: userCons[0] || null,
            consciousness_history: userCons,
            reflections: userRefs,
            feedback: userFb
        };
    }

    // CO2 Calculate
    if (endpoint === '/api/co2/calculate' && method === 'POST') {
        const localUser = JSON.parse(localStorage.getItem('bhaskar_local_user') || '{}');
        const { electricity_kwh, food_items, transport_items, lpg_cylinders, lpg_days, png_scm } = body || {};
        
        let totalCO2e = 0;
        const breakdown = [];

        const factors = {
            elec_india: { item: 'Grid Electricity (India)', factor: 0.716, unit: 'kWh/month', source: 'CEA Govt. of India' },
            lpg_cylinder: { item: 'Domestic LPG Cylinder', factor: 42.36, unit: 'cylinders/month', source: 'IndianOil / IPCC' },
            png_gas: { item: 'Piped Natural Gas (PNG)', factor: 2.02, unit: 'SCM/month', source: 'PNGRB / IPCC' },
            food_beef: { item: 'Beef', factor: 99.48, source: 'Poore & Nemecek 2018' },
            food_mutton: { item: 'Lamb / Mutton', factor: 39.72, source: 'Poore & Nemecek 2018' },
            food_pork: { item: 'Pork', factor: 12.31, source: 'Poore & Nemecek 2018' },
            food_poultry: { item: 'Poultry / Chicken', factor: 9.87, source: 'Poore & Nemecek 2018' },
            food_fish: { item: 'Fish (Farmed)', factor: 13.63, source: 'Poore & Nemecek 2018' },
            food_prawns: { item: 'Prawns / Shrimp', factor: 26.87, source: 'Poore & Nemecek 2018' },
            food_eggs: { item: 'Eggs', factor: 4.67, source: 'Poore & Nemecek 2018' },
            food_milk: { item: 'Milk', factor: 3.15, source: 'Poore & Nemecek 2018' },
            food_cheese: { item: 'Cheese', factor: 23.88, source: 'Poore & Nemecek 2018' },
            food_rice: { item: 'Rice', factor: 4.45, source: 'Poore & Nemecek 2018' },
            food_wheat: { item: 'Wheat', factor: 1.57, source: 'Poore & Nemecek 2018' },
            food_pulses: { item: 'Pulses / Legumes', factor: 1.49, source: 'Poore & Nemecek 2018' },
            food_tofu: { item: 'Tofu', factor: 3.16, source: 'Poore & Nemecek 2018' },
            food_potato: { item: 'Potato', factor: 0.46, source: 'Poore & Nemecek 2018' },
            food_tomato: { item: 'Tomato', factor: 2.09, source: 'Poore & Nemecek 2018' },
            food_banana: { item: 'Banana', factor: 0.86, source: 'Poore & Nemecek 2018' },
            food_apple: { item: 'Apple', factor: 0.43, source: 'Poore & Nemecek 2018' },
            food_veggies: { item: 'Other Vegetables', factor: 0.53, source: 'Poore & Nemecek 2018' },
            food_sugar: { item: 'Sugar', factor: 3.20, source: 'Poore & Nemecek 2018' },
            trans_car: { item: 'Car', factor: 0.171, unit: 'km/month', source: 'NITI Aayog' },
            trans_bike: { item: 'Bike / Two-Wheeler', factor: 0.045, unit: 'km/month', source: 'NITI Aayog' },
            trans_auto: { item: 'Auto-Rickshaw', factor: 0.065, unit: 'km/month', source: 'MoEFCC' },
            trans_bus: { item: 'Bus', factor: 0.038, unit: 'km/month', source: 'NITI Aayog' },
            trans_train: { item: 'Train', factor: 0.028, unit: 'km/month', source: 'Indian Railways' },
            trans_flight_short: { item: 'Flight Short-haul', factor: 0.255, unit: 'km/month', source: 'ICAO' },
            trans_flight_long: { item: 'Flight Long-haul', factor: 0.195, unit: 'km/month', source: 'ICAO' }
        };

        const kwh = parseFloat(electricity_kwh) || 0;
        if (kwh > 0) {
            const em = kwh * factors.elec_india.factor;
            totalCO2e += em;
            breakdown.push({ category: 'Electricity', item: factors.elec_india.item, quantity: kwh, unit: 'kWh/month', emissions_kg: parseFloat(em.toFixed(2)), source: factors.elec_india.source });
        }

        if (food_items) {
            Object.keys(food_items).forEach(fid => {
                const kg = parseFloat(food_items[fid]) || 0;
                if (kg > 0 && factors[fid]) {
                    const em = kg * factors[fid].factor;
                    totalCO2e += em;
                    breakdown.push({ category: 'Food', item: factors[fid].item, quantity: kg, unit: 'kg/month', emissions_kg: parseFloat(em.toFixed(2)), source: factors[fid].source });
                }
            });
        }

        if (transport_items) {
            Object.keys(transport_items).forEach(tid => {
                const dist = parseFloat(transport_items[tid]) || 0;
                if (dist > 0 && factors[tid]) {
                    const em = dist * factors[tid].factor;
                    totalCO2e += em;
                    breakdown.push({ category: 'Transport', item: factors[tid].item, quantity: dist, unit: 'km/month', emissions_kg: parseFloat(em.toFixed(2)), source: factors[tid].source });
                }
            });
        }

        let lpgCount = parseFloat(lpg_cylinders) || 0;
        if (lpg_days && parseFloat(lpg_days) > 0) lpgCount = 30 / parseFloat(lpg_days);
        if (lpgCount > 0) {
            const em = lpgCount * factors.lpg_cylinder.factor;
            totalCO2e += em;
            breakdown.push({ category: 'LPG', item: factors.lpg_cylinder.item, quantity: parseFloat(lpgCount.toFixed(2)), unit: 'cylinders/month', emissions_kg: parseFloat(em.toFixed(2)), source: factors.lpg_cylinder.source });
        }

        const scm = parseFloat(png_scm) || 0;
        if (scm > 0) {
            const em = scm * factors.png_gas.factor;
            totalCO2e += em;
            breakdown.push({ category: 'PNG', item: factors.png_gas.item, quantity: scm, unit: 'SCM/month', emissions_kg: parseFloat(em.toFixed(2)), source: factors.png_gas.source });
        }

        const roundedTotal = parseFloat(totalCO2e.toFixed(2));
        breakdown.forEach(b => {
            b.percentage = roundedTotal > 0 ? parseFloat(((b.emissions_kg / roundedTotal) * 100).toFixed(1)) : 0;
        });

        const record = {
            id: Date.now(),
            user_id: localUser.id,
            total_co2e: roundedTotal,
            breakdown,
            created_at: new Date().toISOString()
        };
        co2History.unshift(record);
        localStorage.setItem('bhaskar_co2_history', JSON.stringify(co2History));

        const treeYears = parseFloat((roundedTotal / 21.77).toFixed(1));
        return {
            total_co2e_monthly: roundedTotal,
            total_co2e_annualized: parseFloat((roundedTotal * 12).toFixed(2)),
            breakdown,
            tree_years_equivalent: treeYears,
            tree_note: `Your emissions are approximately equivalent to ${treeYears} tree-years of CO₂ absorption.`
        };
    }

    // Consciousness Save
    if (endpoint === '/api/consciousness/save' && method === 'POST') {
        const localUser = JSON.parse(localStorage.getItem('bhaskar_local_user') || '{}');
        const record = {
            id: Date.now(),
            user_id: localUser.id,
            score: body.score,
            percentage: body.percentage,
            classification_en: body.classification_en,
            classification_hi: body.classification_hi,
            answers: body.answers,
            created_at: new Date().toISOString()
        };
        consHistory.unshift(record);
        localStorage.setItem('bhaskar_cons_history', JSON.stringify(consHistory));
        return { message: 'Saved successfully' };
    }

    // Reflections GET
    if (endpoint === '/api/reflections' && method === 'GET') {
        return reflections;
    }

    // Reflections POST
    if (endpoint === '/api/reflections' && method === 'POST') {
        const localUser = JSON.parse(localStorage.getItem('bhaskar_local_user') || '{}');
        const newRef = {
            id: Date.now(),
            user_id: localUser.id,
            text: body.text,
            created_at: new Date().toISOString()
        };
        reflections.unshift(newRef);
        localStorage.setItem('bhaskar_reflections', JSON.stringify(reflections));
        return newRef;
    }

    // Reflections PUT
    if (endpoint.startsWith('/api/reflections/') && method === 'PUT') {
        const refId = parseInt(endpoint.split('/').pop());
        const ref = reflections.find(r => r.id === refId);
        if (ref) {
            ref.text = body.text;
            ref.updated_at = new Date().toISOString();
            localStorage.setItem('bhaskar_reflections', JSON.stringify(reflections));
            return ref;
        }
    }

    // Reflections DELETE
    if (endpoint.startsWith('/api/reflections/') && method === 'DELETE') {
        const refId = parseInt(endpoint.split('/').pop());
        reflections = reflections.filter(r => r.id !== refId);
        localStorage.setItem('bhaskar_reflections', JSON.stringify(reflections));
        return { message: 'Deleted successfully' };
    }

    // Feedback POST
    if (endpoint === '/api/feedback' && method === 'POST') {
        const localUser = JSON.parse(localStorage.getItem('bhaskar_local_user') || '{}');
        feedback.unshift({ id: Date.now(), user_id: localUser.id, text: body.text, created_at: new Date().toISOString() });
        localStorage.setItem('bhaskar_feedback', JSON.stringify(feedback));
        return { message: 'Feedback submitted successfully' };
    }

    return {};
}

/* =========================================================
   QUESTIONS (EXISTING LOCKED ASSESSMENT)
   ========================================================= */

const questions = [

    /* -----------------------------------------------------
       Q1
    ----------------------------------------------------- */
    {
        id: 1,

        question: {
            en: "Do you often compare yourself with others?",
            hi: "क्या आप अक्सर दूसरों से अपनी तुलना करते हैं?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [-4, -2, -4, 2, 4],

        bestOption: 4,

        why: {
            en: [
                "Constant comparison can keep attention trapped in what others are doing instead of understanding oneself.",
                "Comparison can still keep the mind dependent on others for self-evaluation.",
                "This neither clearly accepts nor rejects the habit of comparison.",
                "Reducing comparison moves attention more towards self-understanding.",
                "This option rejects comparison and directs attention towards understanding oneself."
            ],

            hi: [
                "लगातार तुलना करने से ध्यान स्वयं को समझने के बजाय दूसरों पर अटक सकता है।",
                "तुलना मन को अपने मूल्यांकन के लिए दूसरों पर निर्भर रख सकती है।",
                "यह विकल्प तुलना करने की आदत को न स्पष्ट रूप से स्वीकार करता है, न अस्वीकार।",
                "तुलना को कम करना ध्यान को स्वयं को समझने की ओर ले जाता है।",
                "यह विकल्प तुलना को अस्वीकार करता है और ध्यान स्वयं को समझने की ओर ले जाता है।"
            ]
        },

        quote: {
            en: "Comparison often leads only to superficial changes.",
            hi: "तुलना अक्सर केवल सतही बदलावों तक ले जाती है।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/on-youtube/ecf4b3c"
        }
    },


    /* -----------------------------------------------------
       Q2
    ----------------------------------------------------- */
    {
        id: 2,

        question: {
            en: "\"My Life, My Choice\" — but until when?",
            hi: "\"मेरी ज़िंदगी, मेरी पसंद\" — लेकिन कब तक?"
        },

        options: {
            en: [
                "It is my life and my decisions. I should have complete freedom to live according to my choices.",
                "I should have freedom to live according to my choices as long as it does not harm others — such as the environment, animals, human health, human rights, etc.",
                "Why should we care? I should live my way and others can do whatever they want.",
                "I do not want to answer because questioning my beliefs may hurt my ego.",
                "Everyone should have freedom to live according to their own choices."
            ],

            hi: [
                "मेरी ज़िंदगी है और मेरे फैसले हैं। मुझे अपनी पसंद के अनुसार जीने की पूरी स्वतंत्रता होनी चाहिए।",
                "मुझे अपनी पसंद के अनुसार जीने की स्वतंत्रता होनी चाहिए, जब तक उससे दूसरों—जैसे पर्यावरण, पशुओं, मानव स्वास्थ्य, मानव अधिकार आदि—को नुकसान न पहुँचे।",
                "हम क्या बोलें? अपना देखो बस, दूसरे कुछ भी करें।",
                "मैं इसका उत्तर नहीं देना चाहता क्योंकि अपने विश्वासों पर सवाल करना मेरे अहंकार को चोट पहुँचा सकता है।",
                "सबको अपने हिसाब से जीने की स्वतंत्रता होनी चाहिए।"
            ]
        },

        scores: [-4, 4, -4, 2, -2],

        bestOption: 1,

        why: {
            en: [
                "Personal freedom does not automatically mean that every consequence of a choice is acceptable.",
                "This option recognises personal freedom while also considering the rights and freedom of others.",
                "Ignoring the effects of one's choices on others removes responsibility from the idea of freedom.",
                "Refusing to question one's beliefs can itself become a barrier to understanding freedom.",
                "Freedom is important, but this statement does not address the possible impact of one's choices on others."
            ],

            hi: [
                "व्यक्तिगत स्वतंत्रता का अर्थ यह अपने-आप नहीं है कि किसी भी चुनाव का हर परिणाम स्वीकार्य हो।",
                "यह विकल्प व्यक्तिगत स्वतंत्रता के साथ-साथ दूसरों के अधिकार और स्वतंत्रता को भी ध्यान में रखता है।",
                "अपने चुनावों के प्रभाव को पूरी तरह नज़रअंदाज़ करना स्वतंत्रता से जिम्मेदारी को अलग कर देता है।",
                "अपने विश्वासों पर प्रश्न करने से इनकार करना स्वयं स्वतंत्रता को समझने में बाधा बन सकता है।",
                "स्वतंत्रता महत्वपूर्ण है, लेकिन यह कथन अपने चुनावों के दूसरों पर प्रभाव की बात नहीं करता।"
            ]
        },

        personalExplanationByOption: {
            hi: {
                0: `ऐसे तो आतंकवादी भी सही है, चोर भी सही है, बलात्कारी भी सही है क्योंकि उनकी ज़िंदगी उनकी पसंद है। आतंकवादी भी हिंसा ही कर रहा है, मांस खाने वाला भी हिंसा ही कर रहा है।`
            },

            en: {
                0: `By this logic, a terrorist is also right, a thief is also right, and a rapist is also right because it is their life and their choice. A terrorist is also committing violence, and a person who eats meat is also committing violence.`
            }
        },

        quote: {
            en: "Freedom is to be free of both—firstly others and secondly, and more importantly, yourself.",
            hi: "स्वतंत्रता का अर्थ दूसरों से और उससे भी अधिक महत्वपूर्ण रूप से स्वयं से मुक्त होना है।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/en/articles/how-to-move-to-freedom-from-slavery-1_6fd7036"
        }
    },


    /* -----------------------------------------------------
       Q3
    ----------------------------------------------------- */
    {
        id: 3,

        question: {
            en: "Are you willing to change your opinion when you discover that you were wrong?",
            hi: "जब आपको पता चलता है कि आप गलत थे, क्या आप अपनी सोच बदलने के लिए तैयार रहते हैं?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [4, 2, -4, -2, -4],

        bestOption: 0,

        why: {
            en: [
                "Being willing to examine and change one's view when it is shown to be wrong requires openness to inquiry.",
                "Some openness is present, but it is weaker than a clear willingness to change when wrong.",
                "This leaves the attitude towards changing one's view undecided.",
                "Refusing to change after recognising an error can keep a mistaken belief intact.",
                "Rejecting change even after discovering an error places the belief above inquiry."
            ],

            hi: [
                "गलत होने का पता चलने पर अपनी सोच को जाँचने और बदलने की तैयारी प्रश्न करने की openness दिखाती है।",
                "कुछ openness दिखाई देती है, लेकिन गलत साबित होने पर बदलने की स्पष्ट तैयारी से कम।",
                "यह सोच बदलने के प्रति स्पष्ट रुख नहीं बताता।",
                "गलती समझ आने के बाद भी सोच न बदलना गलत विश्वास को बनाए रख सकता है।",
                "गलती पता चलने के बाद भी बदलाव को अस्वीकार करना विश्वास को प्रश्न से ऊपर रखता है।"
            ]
        },

        quote: {
            en: "How do I know? Just by enquiring; just by seeing.",
            hi: "मैं कैसे जानूँ? बस प्रश्न करके; बस देखकर।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/en/articles/in-the-middle-of-conditioning-how-do-i-get-real-freedom-with-youth-1_ab39fae"
        }
    },


    /* -----------------------------------------------------
       Q4
    ----------------------------------------------------- */
    {
        id: 4,

        question: {
            en: "Do you usually question what you hear instead of blindly believing it?",
            hi: "क्या आप सुनी हुई बातों पर आँख बंद करके विश्वास करने के बजाय उन पर प्रश्न करते हैं?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [4, 2, -4, -2, -4],

        bestOption: 0,

        why: {
            en: [
                "Questioning what you hear instead of accepting it blindly encourages inquiry and examination.",
                "This shows some willingness to question, though not consistently.",
                "This does not clearly show whether you question or blindly accept information.",
                "Accepting information without enough questioning can leave beliefs unexamined.",
                "Blindly accepting what you hear leaves little space for inquiry."
            ],

            hi: [
                "सुनी हुई बात को आँख बंद करके स्वीकार करने के बजाय प्रश्न करना जाँच और समझ की ओर ले जाता है।",
                "यह कुछ हद तक प्रश्न करने की इच्छा दिखाता है, लेकिन लगातार नहीं।",
                "यह स्पष्ट नहीं करता कि आप प्रश्न करते हैं या बिना जाँच स्वीकार करते हैं।",
                "पर्याप्त प्रश्न किए बिना बात स्वीकार करने से विश्वास बिना जाँच के रह सकता है।",
                "सुनी हुई बात को आँख बंद करके स्वीकार करना प्रश्न करने की जगह बहुत कम छोड़ता है।"
            ]
        },

        quote: {
            en: "How do I know? Just by enquiring; just by seeing.",
            hi: "मैं कैसे जानूँ? बस प्रश्न करके; बस देखकर।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/en/articles/in-the-middle-of-conditioning-how-do-i-get-real-freedom-with-youth-1_ab39fae"
        }
    },


    /* -----------------------------------------------------
       Q5
    ----------------------------------------------------- */
    {
        id: 5,

        question: {
            en: "What would you say about people who eat meat and people who, even knowing that something wrong is happening, still remain silent?",
            hi: "जो लोग मांस खाते हैं और जो लोग यह जानते हुए भी कि यह गलत हो रहा है, फिर भी चुप रहते हैं—आप उनके बारे में क्या कहना चाहेंगे?"
        },

        options: {
            en: [
                "They eat meat because of conditioning received from childhood, so they should not be blamed for eating meat.",
                "People who have families and children have to live according to their circumstances; how will they support their families?",
                "As human beings, they should try to understand their actions and their effects. If they understand the harm and still deliberately refuse to examine or change it, their behaviour goes against their capacity for human discernment.",
                "Why should we say anything about them? It is their life and they can do whatever they want.",
                "I am myself like that, so what can I say?"
            ],

            hi: [
                "वे बचपन से मिली conditioning के कारण मांस खाते हैं, इसलिए उनके मांस खाने के लिए उन्हें दोष नहीं देना चाहिए।",
                "जिन लोगों के परिवार और बच्चे हैं, उन्हें अपनी परिस्थितियों के अनुसार जीना पड़ता है; वे अपने परिवार का पालन-पोषण कैसे करेंगे?",
                "एक मनुष्य होने के नाते उन्हें अपने कर्मों और उनके प्रभाव को समझने का प्रयास करना चाहिए। यदि नुकसान को समझने के बाद भी वे जानबूझकर उस पर विचार करने या बदलने से इनकार करते हैं, तो उनका व्यवहार उनकी मानवीय विवेक-क्षमता के विरुद्ध जाता है।",
                "हम उनके बारे में क्यों कुछ कहें? उनकी ज़िंदगी है और वे जो चाहें करें।",
                "मैं स्वयं वैसा हूँ, तो मैं क्या ही बोलूँ?"
            ]
        },

        scores: [-4, -4, 4, -2, 2],

        bestOption: 2,

        why: {
            en: [
                "Conditioning can explain a behaviour, but explanation alone does not establish that the behaviour is right.",
                "Personal circumstances can influence choices, but circumstances alone do not remove the need to examine one's actions and their effects.",
                "This option asks a person to examine actions, consequences and responsibility rather than simply accepting conditioning.",
                "Freedom to choose does not automatically remove responsibility for the consequences of a choice.",
                "Recognising one's own contradiction can be honest, but stopping there does not move towards examination or change."
            ],

            hi: [
                "Conditioning किसी व्यवहार को समझा सकती है, लेकिन केवल explanation से वह व्यवहार सही सिद्ध नहीं हो जाता।",
                "व्यक्तिगत परिस्थितियाँ चुनावों को प्रभावित कर सकती हैं, लेकिन वे अपने-आप कर्मों और उनके प्रभाव को समझने की जिम्मेदारी समाप्त नहीं करतीं।",
                "यह विकल्प व्यक्ति को अपने कर्म, उनके प्रभाव और अपनी जिम्मेदारी को समझने की ओर ले जाता है।",
                "चुनाव करने की स्वतंत्रता किसी चुनाव के परिणामों की जिम्मेदारी को अपने-आप समाप्त नहीं करती।",
                "अपनी ही contradiction को स्वीकार करना ईमानदार हो सकता है, लेकिन वहीं रुक जाना समझ या बदलाव की ओर नहीं ले जाता।"
            ]
        },

        personalExplanationByOption: {

            hi: {
                0: `बचपन की conditioning यह explain कर सकती है कि कोई व्यक्ति मांस क्यों खाता है, लेकिन केवल conditioning के कारण उसका व्यवहार सही नहीं हो जाता। ऐसे तो एक terrorist को भी बचपन से लोगों को मारना सिखाया जाता है, तो क्या सिर्फ इसलिए उसका लोगों को मारना सही हो जाएगा? नहीं। इसी तरह, केवल यह कहना कि “उसे बचपन से मांस खाना सिखाया गया है” उसके व्यवहार को सही ठहराने के लिए पर्याप्त नहीं है।`
            },

            en: {
                0: `Childhood conditioning can explain why a person eats meat, but conditioning alone does not make the behaviour right. A terrorist may also be taught from childhood to kill people, but does that make killing people right simply because it was taught to him? No. Similarly, merely saying that “he was taught to eat meat from childhood” is not enough to justify his behaviour.`
            }
        },

        quote: {
            en: "Be attentive so that one knows that one is acting out of conditioning.",
            hi: "सजग रहो ताकि पता रहे कि तुम conditioning के कारण कार्य कर रहे हो।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/en/articles/how-to-move-to-freedom-from-slavery-1_6fd7036"
        }
    },


    /* -----------------------------------------------------
       Q6
    ----------------------------------------------------- */
    {
        id: 6,

        question: {
            en: "Do you find it difficult to accept that someone you love has their own freedom?",
            hi: "क्या आपके लिए यह स्वीकार करना कठिन होता है कि जिससे आप प्रेम करते हैं, उसे अपनी स्वतंत्रता है?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [-4, -2, -4, 2, 4],

        bestOption: 4,

        why: {
            en: [
                "Difficulty accepting another person's freedom can turn love into attachment or control.",
                "Some difficulty with another person's freedom can still create attachment and control.",
                "This leaves your position towards another person's freedom unclear.",
                "Accepting another person's freedom reduces the tendency to control them.",
                "This clearly accepts that someone you love is still an individual with their own freedom."
            ],

            hi: [
                "दूसरे व्यक्ति की स्वतंत्रता स्वीकार करने में कठिनाई प्रेम को attachment या control में बदल सकती है।",
                "दूसरे की स्वतंत्रता को लेकर कुछ कठिनाई भी attachment और control पैदा कर सकती है।",
                "यह दूसरे व्यक्ति की स्वतंत्रता के प्रति आपका स्पष्ट रुख नहीं बताता।",
                "दूसरे व्यक्ति की स्वतंत्रता स्वीकार करना उसे नियंत्रित करने की प्रवृत्ति को कम करता है।",
                "यह स्पष्ट रूप से स्वीकार करता है कि जिससे आप प्रेम करते हैं, उसकी अपनी स्वतंत्रता भी है।"
            ]
        },

        quote: {
            en: "Freedom is to be free of both—firstly others and secondly, and more importantly, yourself.",
            hi: "स्वतंत्रता का अर्थ दूसरों से और उससे भी अधिक महत्वपूर्ण रूप से स्वयं से मुक्त होना है।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/en/articles/how-to-move-to-freedom-from-slavery-1_6fd7036"
        }
    },


    /* -----------------------------------------------------
       Q7
    ----------------------------------------------------- */
    {
        id: 7,

        question: {
            en: "Do you regularly observe your own thoughts and emotions?",
            hi: "क्या आप नियमित रूप से अपने विचारों और भावनाओं को देखते और समझते हैं?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [4, 2, -4, -2, -4],

        bestOption: 0,

        why: {
            en: [
                "Regular observation of thoughts and emotions can help a person see their own tendencies and conditioning.",
                "Some observation is present, but it is less consistent.",
                "This does not clearly show a practice of self-observation.",
                "Avoiding observation leaves thoughts and emotions less examined.",
                "Rejecting self-observation leaves little room to understand one's own mental patterns."
            ],

            hi: [
                "विचारों और भावनाओं का नियमित observation व्यक्ति को अपनी tendencies और conditioning को देखने में मदद कर सकता है।",
                "कुछ observation मौजूद है, लेकिन यह लगातार नहीं है।",
                "यह self-observation की स्पष्ट आदत नहीं दिखाता।",
                "Observation से बचने पर विचार और भावनाएँ कम जाँची जाती हैं।",
                "Self-observation को अस्वीकार करने से अपनी मानसिक प्रवृत्तियों को समझने की संभावना कम हो जाती है।"
            ]
        },

        quote: {
            en: "By keeping a close watch on our thoughts and emotions, we can discern underlying tendencies.",
            hi: "अपने विचारों और भावनाओं पर ध्यानपूर्वक नज़र रखने से हम अपनी भीतर की प्रवृत्तियों को समझ सकते हैं।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/on-youtube/9913604"
        }
    },


    /* -----------------------------------------------------
       Q8
    ----------------------------------------------------- */
    {
        id: 8,

        question: {
            en: "Do you avoid telling the truth when it may damage your image?",
            hi: "क्या आप तब सच बोलने से बचते हैं जब उससे आपकी छवि को नुकसान पहुँच सकता है?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [-4, -2, -4, 2, 4],

        bestOption: 4,

        why: {
            en: [
                "Avoiding truth to protect an image places image above truthfulness.",
                "Choosing image over truth can keep a person dependent on external approval.",
                "This does not clearly show whether truth or image has priority.",
                "Reducing the tendency to hide truth shows greater commitment to truthfulness.",
                "Refusing to avoid truth merely to protect an image gives truthfulness priority over image."
            ],

            hi: [
                "छवि बचाने के लिए सत्य से बचना छवि को सत्य से ऊपर रखता है।",
                "सत्य के बजाय छवि चुनना व्यक्ति को बाहरी approval पर निर्भर रख सकता है।",
                "यह स्पष्ट नहीं करता कि सत्य महत्वपूर्ण है या छवि।",
                "सत्य छिपाने की प्रवृत्ति कम करना सत्य के प्रति अधिक प्रतिबद्धता दिखाता है।",
                "केवल अपनी छवि बचाने के लिए सत्य से न बचना सत्य को छवि से ऊपर रखता है।"
            ]
        },

        quote: {
            en: "Satyam — truthfulness.",
            hi: "सत्यम् — सत्य।",
            person: "Sri Krishna — Bhagavad Gita 16.2",
            url: "https://www.gitasupersite.iitk.ac.in/srimad?etgb=1&field_chapter_value=16&field_nsutra_value=2&language=dv&setgb=1"
        }
    },


    /* -----------------------------------------------------
       Q9
    ----------------------------------------------------- */
    {
        id: 9,

        question: {
            en: "Do you think about the impact of your lifestyle on animals and nature?",
            hi: "क्या आप अपने जीवन जीने के तरीके के प्रभाव के बारे में पशुओं और प्रकृति के संदर्भ में सोचते हैं?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [4, 2, -4, -2, -4],

        bestOption: 0,

        why: {
            en: [
                "Considering how one's lifestyle affects other beings and nature encourages broader awareness of consequences.",
                "Some consideration is present, though it may not be consistent.",
                "This leaves the level of consideration unclear.",
                "Ignoring such effects reduces attention to the consequences of one's lifestyle.",
                "Rejecting consideration of impacts leaves important consequences outside the reflection."
            ],

            hi: [
                "अपने जीवन के प्रभाव को दूसरे जीवों और प्रकृति के संदर्भ में देखना परिणामों के प्रति व्यापक जागरूकता दिखाता है।",
                "कुछ consideration मौजूद है, लेकिन यह लगातार नहीं भी हो सकती।",
                "यह स्पष्ट नहीं करता कि आप इन प्रभावों के बारे में कितना सोचते हैं।",
                "इन प्रभावों को नज़रअंदाज़ करना जीवनशैली के परिणामों पर ध्यान कम करता है।",
                "प्रभावों पर विचार करने से इनकार करना महत्वपूर्ण परिणामों को reflection से बाहर कर देता है।"
            ]
        },

        quote: {
            en: "He who hates no creature, who is friendly and compassionate to all.",
            hi: "जो किसी भी प्राणी से द्वेष नहीं करता और सबके प्रति मैत्रीपूर्ण तथा करुणामय है।",
            person: "Sri Krishna — Bhagavad Gita 12.13",
            url: "https://www.gitasupersite.iitk.ac.in/srimad?choose=1&field_chapter_value=12&field_nsutra_value=13&language=dv&setgb=1"
        }
    },


    /* -----------------------------------------------------
       Q10
    ----------------------------------------------------- */
    {
        id: 10,

        question: {
            en: "\"Girls are equal to boys.\" Does this sentence show women's empowerment?",
            hi: "“लड़कियाँ लड़कों के बराबर हैं।” क्या यह वाक्य महिला सशक्तिकरण को दर्शाता है?"
        },

        options: {
            en: [
                "Strongly Agree",
                "Agree",
                "Neutral",
                "Disagree",
                "Strongly Disagree"
            ],

            hi: [
                "पूरी तरह सहमत",
                "सहमत",
                "तटस्थ",
                "असहमत",
                "पूरी तरह असहमत"
            ]
        },

        scores: [-4, -4, -4, 2, 4],

        bestOption: 4,

        why: {
            en: [
                "This accepts the sentence without questioning the assumption behind the comparison.",
                "This still accepts the comparison between girls and boys as the basis of empowerment.",
                "This neither accepts nor rejects the comparison.",
                "This begins to question whether comparison with boys is the right basis for empowerment.",
                "This questions whether empowerment should be defined merely through comparison with boys."
            ],

            hi: [
                "यह वाक्य comparison के पीछे छिपी assumption को question किए बिना स्वीकार करता है।",
                "यह भी empowerment को लड़कों के साथ comparison के आधार पर स्वीकार करता है।",
                "यह comparison को न स्वीकार करता है, न अस्वीकार।",
                "यह प्रश्न उठाना शुरू करता है कि empowerment का आधार लड़कों से comparison होना चाहिए या नहीं।",
                "यह प्रश्न करता है कि empowerment को केवल लड़कों के साथ comparison से ही क्यों परिभाषित किया जाए।"
            ]
        },

        personalExplanationByOption: {

            hi: {
                0: `“लड़कियाँ लड़कों के बराबर हैं” — इस वाक्य से ही यह पता चलता है कि आप यह मान रहे हैं कि हाँ, लड़के बड़े होते हैं, मजबूत होते हैं। कोई लड़का दसवीं में असफल है, आवारा है, गुंडा है, वहीं एक लड़की एमबीबीएस डॉक्टर है, उसी उम्र की, तो अब उस लड़के और लड़की में कोई तुलना हो सकती है क्या? नहीं न? तो तुलना करनी भी है तो चेतना के स्तर पर करो। कमजोर तो कोई भी हो सकता है, लड़का भी, लड़की भी। जो अचेतन है, वह कमजोर है।`
            },

            en: {
                0: `"Girls are equal to boys" — this sentence itself shows that you are assuming that boys are bigger or stronger. Suppose a boy has failed the tenth grade and is a delinquent or a thug, while a girl of the same age is an MBBS doctor. Can there be any comparison between that boy and girl? No. So if comparison has to be made, make it at the level of consciousness. Anyone can be weak — a boy or a girl. The one who is unconscious is weak.`
            }
        },

        quote: {
            en: "The only plane where true equality exists is that of consciousness.",
            hi: "सच्ची समानता का स्तर चेतना का है।",
            person: "Acharya Prashant",
            url: "https://acharyaprashant.org/on-youtube/b1f1507"
        }
    }

];


/* =========================================================
   LANGUAGE HELPERS
   ========================================================= */

function t(obj) {
    if (!obj) return "";
    return obj[currentLanguage] || obj.en || "";
}

function getOptionText(question, index) {
    return question.options[currentLanguage][index];
}


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   INITIAL ENTRY — SCREEN 1: LANGUAGE SELECTION
   ========================================================= */

function showLanguageSelection() {

    document.body.innerHTML = `
        <div class="language-screen">

            <div class="language-card">

                <h1>Consciousness with Bhaskar</h1>

                <p>
                    Choose your language / अपनी भाषा चुनें
                </p>

                <div class="language-buttons">

                    <button onclick="selectLanguage('en', false)">
                        English
                    </button>

                    <button onclick="selectLanguage('hi', false)">
                        हिन्दी
                    </button>

                    <button onclick="showVoiceLanguageSelection()">
                        🎙️ Voice Assistant
                    </button>

                </div>

            </div>

        </div>
    `;
}


function showVoiceLanguageSelection() {

    document.body.innerHTML = `
        <div class="language-screen">

            <div class="language-card">

                <h1>🎙️ Voice Assistant</h1>

                <p>
                    Choose the language for the voice assistant / वॉइस असिस्टेंट के लिए भाषा चुनें
                </p>

                <div class="language-buttons">

                    <button onclick="selectLanguage('en', true)">
                        English Voice
                    </button>

                    <button onclick="selectLanguage('hi', true)">
                        हिन्दी Voice
                    </button>

                </div>

            </div>

        </div>
    `;
}


async function selectLanguage(language, useVoice) {

    currentLanguage = language;
    voiceMode = useVoice;
    voiceLanguage = language;

    if (voiceMode) {
        setTimeout(() => {
            speak(
                language === "en"
                    ? "Voice Assistant activated. Welcome to Consciousness with Bhaskar. Please login or create an account."
                    : "वॉइस असिस्टेंट सक्रिय है। भास्कर के साथ चेतना में आपका स्वागत है। कृपया लॉगिन करें या खाता बनाएँ।"
            );
        }, 600);
    }

    // Check if user is already logged in
    if (authToken) {
        try {
            const data = await apiCall('/api/auth/me');
            currentUser = data;
            renderWelcomeScreen();
            return;
        } catch (e) {
            authToken = null;
            localStorage.removeItem('bhaskar_token');
        }
    }

    renderAuthScreen('login');
}


/* =========================================================
   SCREEN 2: LOGIN / SIGN UP
   ========================================================= */

function renderAuthScreen(mode = 'login') {
    const isLogin = mode === 'login';

    document.body.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">

                <div class="auth-header">
                    <h1>Consciousness with Bhaskar</h1>
                    <p>
                        ${
                            currentLanguage === 'en'
                                ? 'Begin your journey of self-reflection and conscious living.'
                                : 'आत्म-चिंतन और सचेत जीवन की अपनी यात्रा शुरू करें।'
                        }
                    </p>
                </div>

                <div class="auth-tabs">
                    <button class="auth-tab ${isLogin ? 'active' : ''}" onclick="renderAuthScreen('login')">
                        ${currentLanguage === 'en' ? 'Login' : 'लॉगिन'}
                    </button>
                    <button class="auth-tab ${!isLogin ? 'active' : ''}" onclick="renderAuthScreen('signup')">
                        ${currentLanguage === 'en' ? 'Sign Up' : 'खाता बनाएँ'}
                    </button>
                </div>

                <form onsubmit="handleAuthSubmit(event, '${mode}')" class="auth-form">
                    
                    <div id="authError" class="auth-error-msg" style="display:none;"></div>

                    ${!isLogin ? `
                        <div class="form-group">
                            <label for="authName">
                                ${currentLanguage === 'en' ? 'Full Name' : 'पूरा नाम'}
                            </label>
                            <input type="text" id="authName" required placeholder="${currentLanguage === 'en' ? 'e.g. Bhaskar' : 'जैसे: भास्कर'}" class="auth-input">
                        </div>
                    ` : ''}

                    <div class="form-group">
                        <label for="authEmail">
                            ${currentLanguage === 'en' ? 'Email Address' : 'ईमेल पता'}
                        </label>
                        <input type="email" id="authEmail" required placeholder="name@example.com" class="auth-input">
                    </div>

                    <div class="form-group">
                        <label for="authPassword">
                            ${currentLanguage === 'en' ? 'Password' : 'पासवर्ड'}
                        </label>
                        <input type="password" id="authPassword" required minlength="6" placeholder="••••••••" class="auth-input">
                    </div>

                    <button type="submit" class="auth-submit-btn">
                        ${
                            isLogin
                                ? (currentLanguage === 'en' ? 'Login →' : 'लॉगिन करें →')
                                : (currentLanguage === 'en' ? 'Create Account →' : 'खाता बनाएँ →')
                        }
                    </button>
                </form>

            </div>
        </div>
    `;
}


async function handleAuthSubmit(event, mode) {
    event.preventDefault();
    const errorDiv = document.getElementById('authError');
    errorDiv.style.display = 'none';

    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const name = mode === 'signup' ? document.getElementById('authName').value : '';

    try {
        const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
        const payload = mode === 'signup' 
            ? { name, email, password, language: currentLanguage, voice_mode: voiceMode }
            : { email, password };

        const data = await apiCall(endpoint, 'POST', payload);
        
        authToken = data.token;
        localStorage.setItem('bhaskar_token', authToken);
        currentUser = data.user;

        // Persist language and voice settings from user profile if stored
        if (currentUser.language) currentLanguage = currentUser.language;
        if (currentUser.voice_mode !== undefined) voiceMode = currentUser.voice_mode;

        renderWelcomeScreen();
    } catch (err) {
        errorDiv.textContent = err.message || (currentLanguage === 'en' ? 'Authentication failed' : 'प्रमाणीकरण विफल रहा');
        errorDiv.style.display = 'block';
    }
}


/* =========================================================
   SCREEN 3: WELCOME SCREEN
   ========================================================= */

function renderWelcomeScreen() {
    const userName = currentUser ? currentUser.name : (currentLanguage === 'en' ? 'Friend' : 'मित्र');

    document.body.innerHTML = `
        <div class="welcome-container">
            <div class="welcome-card">
                <div class="welcome-badge">✦ ${currentLanguage === 'en' ? 'Consciousness with Bhaskar' : 'भास्कर के साथ चेतना'}</div>
                
                <h1>
                    ${currentLanguage === 'en' ? `Welcome, ${escapeHTML(userName)} 👋` : `स्वागत है, ${escapeHTML(userName)} 👋`}
                </h1>

                <p class="welcome-sub">
                    ${
                        currentLanguage === 'en'
                            ? 'Welcome to Consciousness with Bhaskar. Understand yourself. Question your conditioning. Live consciously.'
                            : 'भास्कर के साथ चेतना की दुनिया में आपका स्वागत है। स्वयं को समझें। अपनी conditioning पर सवाल करें। सचेत होकर जिएँ।'
                    }
                </p>

                <div class="welcome-actions">
                    <button onclick="loadDashboard()">
                        ${currentLanguage === 'en' ? 'Enter Personal Dashboard →' : 'पर्सनल डैशबोर्ड में प्रवेश करें →'}
                    </button>
                </div>
            </div>
        </div>
    `;

    if (voiceMode) {
        setTimeout(() => {
            speak(
                currentLanguage === 'en'
                    ? `Welcome, ${userName}. Welcome to Consciousness with Bhaskar. Entering your personal dashboard.`
                    : `स्वागत है, ${userName}। भास्कर के साथ चेतना में आपका स्वागत है। आपके पर्सनल डैशबोर्ड में प्रवेश कर रहे हैं।`
            );
        }, 500);
    }
}


/* =========================================================
   SCREEN 4: PERSONAL DASHBOARD
   ========================================================= */

async function loadDashboard() {
    try {
        const data = await apiCall('/api/dashboard');
        latestCO2Data = data.latest_co2;
        latestAssessmentData = data.latest_consciousness;
        renderDashboard(data);
    } catch (err) {
        alert(currentLanguage === 'en' ? 'Error loading dashboard data' : 'डैशबोर्ड डेटा लोड करने में त्रुटि');
    }
}

function renderDashboard(data) {
    const u = data.user || currentUser;
    const latestCO2 = data.latest_co2;
    const latestConsciousness = data.latest_consciousness;
    const reflections = data.reflections || [];

    document.body.innerHTML = `
        <div class="dashboard-page">
            
            <!-- HEADER NAV -->
            <header class="dashboard-nav">
                <div class="nav-brand">
                    <h1>Consciousness with Bhaskar</h1>
                </div>
                <div class="nav-user">
                    <span>👤 ${escapeHTML(u.name)}</span>
                    <button class="nav-logout-btn" onclick="handleLogout()">
                        ${currentLanguage === 'en' ? 'Logout' : 'लॉगआउट'}
                    </button>
                </div>
            </header>

            <main class="dashboard-content">
                
                <!-- DASHBOARD HERO -->
                <div class="dashboard-welcome-banner">
                    <h2>
                        ${currentLanguage === 'en' ? `Personal Dashboard — ${escapeHTML(u.name)}` : `पर्सनल डैशबोर्ड — ${escapeHTML(u.name)}`}
                    </h2>
                    <p>
                        ${
                            currentLanguage === 'en'
                                ? 'Track your environmental footprint, explore your consciousness assessment history, and write your daily reflections.'
                                : 'अपने पर्यावरण footprint को ट्रैक करें, अपनी चेतना मूल्यांकन इतिहास देखें, और अपने दैनिक चिंतन लिखें।'
                        }
                    </p>
                </div>

                <!-- 4 MAIN MODULE GRID -->
                <div class="dashboard-grid">

                    <!-- MODULE 1: CO2 TRACKER -->
                    <div class="dash-card co2-dash-card">
                        <div class="card-icon">🌱</div>
                        <h3>${currentLanguage === 'en' ? 'CO₂ Carbon Tracker' : 'CO₂ कार्बन ट्रैकर'}</h3>
                        
                        ${latestCO2 ? `
                            <div class="dash-stat">
                                <div class="stat-value">${latestCO2.total_co2e} kg CO₂e</div>
                                <div class="stat-label">${currentLanguage === 'en' ? 'Latest Monthly Footprint' : 'नवीनतम मासिक उत्सर्जन'}</div>
                            </div>
                            <div class="stat-date">📅 ${new Date(latestCO2.created_at).toLocaleDateString()}</div>
                        ` : `
                            <p class="no-data">
                                ${currentLanguage === 'en' ? 'No CO₂ calculations performed yet.' : 'अभी तक कोई CO₂ गणना नहीं की गई है।'}
                            </p>
                        `}

                        <div class="card-actions">
                            <button onclick="renderCO2Tracker()">
                                ${latestCO2 ? (currentLanguage === 'en' ? 'Calculate Again →' : 'पुनः गणना करें →') : (currentLanguage === 'en' ? 'Calculate CO₂ Footprint →' : 'CO₂ footprint की गणना करें →')}
                            </button>
                        </div>
                    </div>

                    <!-- MODULE 2: CONSCIOUSNESS LEVEL -->
                    <div class="dash-card consciousness-dash-card">
                        <div class="card-icon">🧠</div>
                        <h3>${currentLanguage === 'en' ? 'Consciousness Level' : 'चेतना स्तर'}</h3>

                        ${latestConsciousness ? `
                            <div class="dash-stat">
                                <div class="stat-value">${latestConsciousness.percentage}%</div>
                                <div class="stat-label">
                                    ${currentLanguage === 'en' ? latestConsciousness.classification_en : latestConsciousness.classification_hi}
                                </div>
                            </div>
                            <div class="stat-date">📅 ${new Date(latestConsciousness.created_at).toLocaleDateString()}</div>
                        ` : `
                            <p class="no-data">
                                ${currentLanguage === 'en' ? 'No Consciousness Assessment taken yet.' : 'अभी तक कोई चेतना मूल्यांकन नहीं किया गया है।'}
                            </p>
                        `}

                        <div class="card-actions">
                            <button onclick="startAssessmentFromDashboard()">
                                ${latestConsciousness ? (currentLanguage === 'en' ? 'Retake Assessment →' : 'पुनः मूल्यांकन करें →') : (currentLanguage === 'en' ? 'Start Consciousness Assessment →' : 'चेतना मूल्यांकन शुरू करें →')}
                            </button>
                        </div>
                    </div>

                    <!-- MODULE 3: PROFILE & SETTINGS -->
                    <div class="dash-card profile-dash-card">
                        <div class="card-icon">👤</div>
                        <h3>${currentLanguage === 'en' ? 'Profile & Preferences' : 'प्रोफ़ाइल एवं प्राथमिकताएँ'}</h3>
                        
                        <div class="profile-details">
                            <p><strong>${currentLanguage === 'en' ? 'Name:' : 'नाम:'}</strong> ${escapeHTML(u.name)}</p>
                            <p><strong>${currentLanguage === 'en' ? 'Email:' : 'ईमेल:'}</strong> ${escapeHTML(u.email)}</p>
                            <p>
                                <strong>${currentLanguage === 'en' ? 'Language:' : 'भाषा:'}</strong> 
                                ${currentLanguage === 'en' ? 'English 🇬🇧' : 'हिन्दी 🇮🇳'}
                            </p>
                            <p>
                                <strong>${currentLanguage === 'en' ? 'Voice Mode:' : 'वॉइस मोड:'}</strong> 
                                ${voiceMode ? '🔊 Active' : '🔇 Inactive'}
                            </p>
                        </div>

                        <div class="card-actions">
                            <button onclick="showLanguageSelection()" class="secondary-btn">
                                ⚙️ ${currentLanguage === 'en' ? 'Change Language / Voice Settings' : 'भाषा / वॉइस सेटिंग्स बदलें'}
                            </button>
                        </div>
                    </div>

                    <!-- MODULE 4: HELP US IMPROVE -->
                    <div class="dash-card feedback-dash-card">
                        <div class="card-icon">💡</div>
                        <h3>${currentLanguage === 'en' ? 'Help Us Improve' : 'सुधार में मदद करें'}</h3>
                        <p class="feedback-sub">
                            ${
                                currentLanguage === 'en'
                                    ? 'Share your ideas, feature requests, or what we can clarify.'
                                    : 'अपने विचार, सुझाव, या कोई भी स्पष्टीकरण यहाँ साझा करें।'
                            }
                        </p>
                        
                        <form onsubmit="handleFeedbackSubmit(event)" class="feedback-form">
                            <textarea id="feedbackText" required rows="3" placeholder="${currentLanguage === 'en' ? 'Write your feedback or suggestion here...' : 'अपना सुझाव यहाँ लिखें...'}" class="dash-textarea"></textarea>
                            <button type="submit" class="secondary-btn">
                                ${currentLanguage === 'en' ? 'Submit Feedback' : 'सुझाव भेजें'}
                            </button>
                        </form>
                    </div>

                </div>

                <!-- SECTION: MY REFLECTIONS (CRUD) -->
                <div class="reflections-section">
                    <div class="section-header">
                        <h3>📝 ${currentLanguage === 'en' ? 'My Daily Reflections' : 'मेरे दैनिक चिंतन'}</h3>
                        <p>
                            ${
                                currentLanguage === 'en'
                                    ? 'Write down your personal insights, observations of conditioning, and self-questioning notes.'
                                    : 'अपने व्यक्तिगत अनुभव, अपनी conditioning का अवलोकन, और आत्म-चिंतन के विचार यहाँ दर्ज करें।'
                            }
                        </p>
                    </div>

                    <!-- ADD REFLECTION FORM -->
                    <form onsubmit="handleAddReflection(event)" class="add-reflection-form">
                        <textarea id="newReflectionText" required rows="3" placeholder="${currentLanguage === 'en' ? 'Write a new reflection...' : 'नया चिंतन लिखें...'}" class="dash-textarea"></textarea>
                        <button type="submit">
                            + ${currentLanguage === 'en' ? 'Save Reflection' : 'चिंतन सहेजें'}
                        </button>
                    </form>

                    <!-- REFLECTION LIST -->
                    <div class="reflections-list">
                        ${reflections.length === 0 ? `
                            <p class="no-data">
                                ${currentLanguage === 'en' ? 'No reflections saved yet. Start writing your thoughts above!' : 'अभी तक कोई चिंतन नहीं लिखा गया है। ऊपर अपने विचार लिखना शुरू करें!'}
                            </p>
                        ` : reflections.map(r => `
                            <div class="reflection-item" id="ref-${r.id}">
                                <div class="ref-date">📅 ${new Date(r.created_at).toLocaleString()}</div>
                                <div class="ref-text">${escapeHTML(r.text)}</div>
                                <div class="ref-actions">
                                    <button onclick="editReflection(${r.id}, \`${escapeHTML(r.text).replace(/`/g, '\\`')}\`)" class="icon-btn">
                                        ✏️ ${currentLanguage === 'en' ? 'Edit' : 'संपादित करें'}
                                    </button>
                                    <button onclick="deleteReflection(${r.id})" class="icon-btn delete-btn">
                                        🗑️ ${currentLanguage === 'en' ? 'Delete' : 'हटाएँ'}
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

            </main>

            <footer>
                <p>Consciousness with Bhaskar</p>
            </footer>
        </div>
    `;
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('bhaskar_token');
    showLanguageSelection();
}

async function handleAddReflection(event) {
    event.preventDefault();
    const textarea = document.getElementById('newReflectionText');
    const text = textarea.value;
    try {
        await apiCall('/api/reflections', 'POST', { text });
        textarea.value = '';
        loadDashboard();
    } catch (e) {
        alert(currentLanguage === 'en' ? 'Failed to save reflection' : 'चिंतन सहेजने में त्रुटि');
    }
}

async function editReflection(id, oldText) {
    const newText = prompt(currentLanguage === 'en' ? 'Edit your reflection:' : 'अपना चिंतन संपादित करें:', oldText);
    if (newText !== null && newText.trim() !== '') {
        try {
            await apiCall(`/api/reflections/${id}`, 'PUT', { text: newText.trim() });
            loadDashboard();
        } catch (e) {
            alert(currentLanguage === 'en' ? 'Failed to update reflection' : 'अपडेट करने में त्रुटि');
        }
    }
}

async function deleteReflection(id) {
    if (confirm(currentLanguage === 'en' ? 'Are you sure you want to delete this reflection?' : 'क्या आप निश्चित रूप से इस चिंतन को हटाना चाहते हैं?')) {
        try {
            await apiCall(`/api/reflections/${id}`, 'DELETE');
            loadDashboard();
        } catch (e) {
            alert(currentLanguage === 'en' ? 'Failed to delete reflection' : 'हटाने में त्रुटि');
        }
    }
}

async function handleFeedbackSubmit(event) {
    event.preventDefault();
    const textarea = document.getElementById('feedbackText');
    const text = textarea.value;
    try {
        await apiCall('/api/feedback', 'POST', { text });
        alert(currentLanguage === 'en' ? 'Thank you! Your feedback has been submitted.' : 'धन्यवाद! आपका सुझाव प्राप्त हो गया है।');
        textarea.value = '';
    } catch (e) {
        alert(currentLanguage === 'en' ? 'Failed to submit feedback' : 'सुझाव भेजने में त्रुटि');
    }
}


/* =========================================================
   SCREEN 5: CO2 TRACKER INPUT FORM
   ========================================================= */

function renderCO2Tracker() {
    document.body.innerHTML = `
        <div class="co2-page">
            <header class="dashboard-nav">
                <div class="nav-brand">
                    <h1>🌱 CO₂ Carbon Footprint Tracker</h1>
                </div>
                <div class="nav-user">
                    <button class="nav-logout-btn" onclick="loadDashboard()">
                        ← ${currentLanguage === 'en' ? 'Back to Dashboard' : 'डैशबोर्ड पर वापस जाएँ'}
                    </button>
                </div>
            </header>

            <main class="co2-container">
                
                <div class="co2-intro">
                    <h2>${currentLanguage === 'en' ? 'Calculate Your Monthly Carbon Footprint' : 'अपने मासिक कार्बन उत्सर्जन की गणना करें'}</h2>
                    <p>
                        ${
                            currentLanguage === 'en'
                                ? 'Enter your average monthly consumption across energy, diet, and travel. All factors are sourced from verified lifecycle databases (CEA India, IPCC, Poore & Nemecek 2018, NITI Aayog).'
                                : 'ऊर्जा, भोजन और यात्रा में अपना औसत मासिक उपभोग दर्ज करें। सभी कारक सत्यापित डेटाबेस (CEA India, IPCC, Poore & Nemecek 2018, NITI Aayog) से लिए गए हैं।'
                        }
                    </p>
                </div>

                <form onsubmit="handleCO2Calculate(event)" class="co2-form">
                    
                    <!-- CATEGORY A: ELECTRICITY -->
                    <div class="co2-section">
                        <h3>⚡ A. Electricity Consumption</h3>
                        <div class="factor-info-badge">
                            ℹ️ Emission Factor: 0.716 kg CO₂e / kWh (Central Electricity Authority CEA India 2023 baseline)
                        </div>
                        <div class="form-group">
                            <label for="elecKwh">
                                ${currentLanguage === 'en' ? 'Electricity units consumed per month (kWh):' : 'प्रति माह बिजली की खपत (kWh / यूनिट्स):'}
                            </label>
                            <input type="number" id="elecKwh" min="0" step="any" placeholder="e.g. 250" class="co2-input">
                        </div>
                    </div>

                    <!-- CATEGORY B: FOOD -->
                    <div class="co2-section">
                        <h3>🥗 B. Food & Diet Consumption</h3>
                        <div class="factor-info-badge">
                            ℹ️ Sourced from Poore & Nemecek (2018) Science lifecycle database (kg CO₂e per kg consumed)
                        </div>
                        <div class="co2-food-grid">
                            
                            <div class="food-input-item">
                                <label for="food_beef">🥩 ${currentLanguage === 'en' ? 'Beef (kg/month)' : 'बीफ़ (किग्रा/माह)'}</label>
                                <input type="number" id="food_beef" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_mutton">🍖 ${currentLanguage === 'en' ? 'Lamb / Mutton (kg/month)' : 'मटन (किग्रा/माह)'}</label>
                                <input type="number" id="food_mutton" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_pork">🥓 ${currentLanguage === 'en' ? 'Pork (kg/month)' : 'पोर्क (किग्रा/माह)'}</label>
                                <input type="number" id="food_pork" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_poultry">🍗 ${currentLanguage === 'en' ? 'Poultry / Chicken (kg/month)' : 'चिकन (किग्रा/माह)'}</label>
                                <input type="number" id="food_poultry" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_fish">🐟 ${currentLanguage === 'en' ? 'Fish (kg/month)' : 'मछली (किग्रा/माह)'}</label>
                                <input type="number" id="food_fish" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_prawns">🦐 ${currentLanguage === 'en' ? 'Prawns / Shrimp (kg/month)' : 'झींगा (किग्रा/माह)'}</label>
                                <input type="number" id="food_prawns" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_eggs">🥚 ${currentLanguage === 'en' ? 'Eggs (kg/month)' : 'अंडे (किग्रा/माह)'}</label>
                                <input type="number" id="food_eggs" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_milk">🥛 ${currentLanguage === 'en' ? 'Milk (kg/month)' : 'दूध (किग्रा/माह)'}</label>
                                <input type="number" id="food_milk" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_cheese">🧀 ${currentLanguage === 'en' ? 'Cheese (kg/month)' : 'चीज़ / पनीर (किग्रा/माह)'}</label>
                                <input type="number" id="food_cheese" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_rice">🍚 ${currentLanguage === 'en' ? 'Rice (kg/month)' : 'चावल (किग्रा/माह)'}</label>
                                <input type="number" id="food_rice" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_wheat">🌾 ${currentLanguage === 'en' ? 'Wheat / Atta (kg/month)' : 'गेहूँ / आटा (किग्रा/माह)'}</label>
                                <input type="number" id="food_wheat" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_pulses">🫘 ${currentLanguage === 'en' ? 'Pulses / Legumes / Dal (kg/month)' : 'दालें / दलहन (किग्रा/माह)'}</label>
                                <input type="number" id="food_pulses" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_tofu">🧊 ${currentLanguage === 'en' ? 'Tofu (kg/month)' : 'टोफू (किग्रा/माह)'}</label>
                                <input type="number" id="food_tofu" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_potato">🥔 ${currentLanguage === 'en' ? 'Potato (kg/month)' : 'आलू (किग्रा/माह)'}</label>
                                <input type="number" id="food_potato" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_tomato">🍅 ${currentLanguage === 'en' ? 'Tomato (kg/month)' : 'टमाटर (किग्रा/माह)'}</label>
                                <input type="number" id="food_tomato" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_banana">🍌 ${currentLanguage === 'en' ? 'Banana (kg/month)' : 'केला (किग्रा/माह)'}</label>
                                <input type="number" id="food_banana" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_apple">🍎 ${currentLanguage === 'en' ? 'Apple (kg/month)' : 'सेब (किग्रा/माह)'}</label>
                                <input type="number" id="food_apple" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_veggies">🥦 ${currentLanguage === 'en' ? 'Other Vegetables (kg/month)' : 'अन्य सब्जियाँ (किग्रा/माह)'}</label>
                                <input type="number" id="food_veggies" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="food-input-item">
                                <label for="food_sugar">🍬 ${currentLanguage === 'en' ? 'Sugar (kg/month)' : 'चीनी (किग्रा/माह)'}</label>
                                <input type="number" id="food_sugar" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                        </div>
                    </div>

                    <!-- CATEGORY C: TRANSPORT -->
                    <div class="co2-section">
                        <h3>🚗 C. Transport Travel</h3>
                        <div class="factor-info-badge">
                            ℹ️ Sourced from NITI Aayog India & ICAO Aviation Conversion Factors
                        </div>
                        <div class="co2-transport-grid">

                            <div class="trans-input-item">
                                <label for="trans_car">🚘 ${currentLanguage === 'en' ? 'Car travel (km/month):' : 'कार से यात्रा (किमी/माह):'}</label>
                                <input type="number" id="trans_car" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="trans-input-item">
                                <label for="trans_bike">🛵 ${currentLanguage === 'en' ? 'Bike / Two-wheeler (km/month):' : 'बाइक / स्कूटर (किमी/माह):'}</label>
                                <input type="number" id="trans_bike" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="trans-input-item">
                                <label for="trans_auto">🛺 ${currentLanguage === 'en' ? 'Auto-rickshaw (passenger-km/month):' : 'ऑटो-रिक्शा (किमी/माह):'}</label>
                                <input type="number" id="trans_auto" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="trans-input-item">
                                <label for="trans_bus">🚌 ${currentLanguage === 'en' ? 'Bus travel (passenger-km/month):' : 'बस यात्रा (किमी/माह):'}</label>
                                <input type="number" id="trans_bus" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="trans-input-item">
                                <label for="trans_train">🚆 ${currentLanguage === 'en' ? 'Train travel (passenger-km/month):' : 'ट्रेन यात्रा (किमी/माह):'}</label>
                                <input type="number" id="trans_train" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="trans-input-item">
                                <label for="trans_flight_short">✈️ ${currentLanguage === 'en' ? 'Flight Short-haul (<1500km) (km/month):' : 'शॉर्ट-हॉल फ़्लाइट (<1500km) (किमी/माह):'}</label>
                                <input type="number" id="trans_flight_short" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                            <div class="trans-input-item">
                                <label for="trans_flight_long">🛫 ${currentLanguage === 'en' ? 'Flight Long-haul (>1500km) (km/month):' : 'लॉन्ग-हॉल फ़्लाइट (>1500km) (किमी/माह):'}</label>
                                <input type="number" id="trans_flight_long" min="0" step="any" placeholder="0" class="co2-input">
                            </div>

                        </div>
                    </div>

                    <!-- CATEGORY D: LPG -->
                    <div class="co2-section">
                        <h3>🔥 D. Domestic LPG Cylinder</h3>
                        <div class="factor-info-badge">
                            ℹ️ Standard Indian domestic cylinder = 14.2 kg LPG (42.36 kg CO₂e per cylinder)
                        </div>
                        <div class="lpg-inputs">
                            <div class="form-group">
                                <label for="lpg_cylinders">
                                    ${currentLanguage === 'en' ? 'Number of cylinders used per month:' : 'प्रति माह इस्तेमाल किए गए सिलेंडर:'}
                                </label>
                                <input type="number" id="lpg_cylinders" min="0" step="any" placeholder="e.g. 1" class="co2-input">
                            </div>
                            <div class="or-divider">${currentLanguage === 'en' ? 'OR' : 'या'}</div>
                            <div class="form-group">
                                <label for="lpg_days">
                                    ${currentLanguage === 'en' ? 'How many days one cylinder lasts:' : 'एक सिलेंडर कितने दिन चलता है:'}
                                </label>
                                <input type="number" id="lpg_days" min="0" step="any" placeholder="e.g. 45" class="co2-input">
                            </div>
                        </div>
                    </div>

                    <!-- CATEGORY E: PNG -->
                    <div class="co2-section">
                        <h3>🔥 E. Piped Natural Gas (PNG)</h3>
                        <div class="factor-info-badge">
                            ℹ️ Emission Factor: 2.02 kg CO₂e / SCM (PNGRB / IPCC natural gas baseline)
                        </div>
                        <div class="form-group">
                            <label for="png_scm">
                                ${currentLanguage === 'en' ? 'PNG consumed in SCM per month:' : 'प्रति माह पीएनजी (SCM):'}
                            </label>
                            <input type="number" id="png_scm" min="0" step="any" placeholder="e.g. 15" class="co2-input">
                        </div>
                    </div>

                    <div class="submit-btn-row">
                        <button type="submit" class="co2-submit-btn">
                            🌱 ${currentLanguage === 'en' ? 'Calculate Carbon Footprint →' : 'कार्बन उत्सर्जन की गणना करें →'}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    `;
}

async function handleCO2Calculate(event) {
    event.preventDefault();

    const food_items = {};
    const foodIds = ['food_beef', 'food_mutton', 'food_pork', 'food_poultry', 'food_fish', 'food_prawns', 'food_eggs', 'food_milk', 'food_cheese', 'food_rice', 'food_wheat', 'food_pulses', 'food_tofu', 'food_potato', 'food_tomato', 'food_banana', 'food_apple', 'food_veggies', 'food_sugar'];
    foodIds.forEach(id => {
        const val = parseFloat(document.getElementById(id).value) || 0;
        if (val > 0) food_items[id] = val;
    });

    const transport_items = {};
    const transIds = ['trans_car', 'trans_bike', 'trans_auto', 'trans_bus', 'trans_train', 'trans_flight_short', 'trans_flight_long'];
    transIds.forEach(id => {
        const val = parseFloat(document.getElementById(id).value) || 0;
        if (val > 0) transport_items[id] = val;
    });

    const body = {
        electricity_kwh: parseFloat(document.getElementById('elecKwh').value) || 0,
        food_items,
        transport_items,
        lpg_cylinders: parseFloat(document.getElementById('lpg_cylinders').value) || 0,
        lpg_days: parseFloat(document.getElementById('lpg_days').value) || 0,
        png_scm: parseFloat(document.getElementById('png_scm').value) || 0
    };

    try {
        const data = await apiCall('/api/co2/calculate', 'POST', body);
        latestCO2Data = data;
        renderCO2Result(data);
    } catch (e) {
        alert(currentLanguage === 'en' ? 'Error calculating CO2 footprint' : 'कार्बन उत्सर्जन गणना में त्रुटि');
    }
}


/* =========================================================
   SCREEN 6 & 7: CO2 CALCULATION RESULT + REFLECTION + RECOMMENDATION
   ========================================================= */

function renderCO2Result(data) {
    const totalMonthly = data.total_co2e_monthly || 0;
    const totalAnnual = data.total_co2e_annualized || 0;
    const breakdown = data.breakdown || [];
    const treeYears = data.tree_years_equivalent || 0;

    // Find highest emission item
    let highestItem = null;
    if (breakdown.length > 0) {
        highestItem = [...breakdown].sort((a, b) => b.emissions_kg - a.emissions_kg)[0];
    }

    document.body.innerHTML = `
        <div class="co2-result-page">
            
            <header class="dashboard-nav">
                <div class="nav-brand">
                    <h1>🌱 Environmental Impact Result</h1>
                </div>
                <div class="nav-user">
                    <button class="nav-logout-btn" onclick="loadDashboard()">
                        ← ${currentLanguage === 'en' ? 'Dashboard' : 'डैशबोर्ड'}
                    </button>
                </div>
            </header>

            <main class="result-main-container">
                
                <!-- MAIN RESULT BANNER -->
                <div class="co2-result-hero">
                    <h2>${currentLanguage === 'en' ? 'Your Estimated Carbon Footprint' : 'आपका अनुमानित कार्बन उत्सर्जन'}</h2>
                    
                    <div class="co2-big-number">
                        ${totalMonthly} <span class="unit">kg CO₂e / month</span>
                    </div>

                    <div class="co2-annual-sub">
                        ${currentLanguage === 'en' ? `Annualized estimate: ~${totalAnnual} kg CO₂e / year` : `वार्षिक अनुमान: ~${totalAnnual} किग्रा CO₂e / वर्ष`}
                    </div>
                </div>

                <!-- CATEGORY BREAKDOWN TABLE -->
                <div class="result-card breakdown-card">
                    <h3>📊 ${currentLanguage === 'en' ? 'Category Breakdown' : 'श्रेणीवार विवरण'}</h3>
                    
                    ${breakdown.length === 0 ? `
                        <p class="no-data">${currentLanguage === 'en' ? 'No items consumed in calculation.' : 'कोई उपभोग दर्ज नहीं किया गया।'}</p>
                    ` : `
                        <div class="breakdown-table-wrapper">
                            <table class="breakdown-table">
                                <thead>
                                    <tr>
                                        <th>${currentLanguage === 'en' ? 'Category' : 'श्रेणी'}</th>
                                        <th>${currentLanguage === 'en' ? 'Item' : 'वस्तु'}</th>
                                        <th>${currentLanguage === 'en' ? 'Quantity' : 'मात्रा'}</th>
                                        <th>${currentLanguage === 'en' ? 'Emissions (kg CO₂e)' : 'उत्सर्जन (किग्रा CO₂e)'}</th>
                                        <th>${currentLanguage === 'en' ? 'Contribution' : 'योगदान'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${breakdown.map(item => `
                                        <tr>
                                            <td><strong>${escapeHTML(item.category)}</strong></td>
                                            <td>${escapeHTML(item.item)}</td>
                                            <td>${item.quantity} ${escapeHTML(item.unit)}</td>
                                            <td><strong>${item.emissions_kg} kg</strong></td>
                                            <td>
                                                <div class="progress-bar-container">
                                                    <div class="progress-bar-fill" style="width: ${item.percentage}%"></div>
                                                    <span>${item.percentage}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>

                <!-- ENVIRONMENTAL INDICATOR: TREE ABSORPTION -->
                <div class="result-card tree-card">
                    <div class="tree-icon">🌳</div>
                    <div class="tree-content">
                        <h3>${currentLanguage === 'en' ? 'Tree-Absorption Equivalence' : 'वृक्ष-अवशोषण समतुल्यता'}</h3>
                        <p class="tree-main-text">
                            ${
                                currentLanguage === 'en'
                                    ? `Your emissions are approximately equivalent to <strong>${treeYears} tree-years</strong> of CO₂ absorption.`
                                    : `आपका उत्सर्जन लगभग <strong>${treeYears} वृक्ष-वर्ष</strong> के CO₂ अवशोषण के बराबर है।`
                            }
                        </p>
                        <p class="tree-disclaimer">
                            ⚠️ <em>${currentLanguage === 'en' ? 'This is an illustrative equivalence, not the actual number of trees cut.' : 'यह एक सांकेतिक समतुल्यता है, काटे गए पेड़ों की वास्तविक संख्या नहीं।'}</em>
                        </p>
                    </div>
                </div>

                <!-- SELF-REFLECTION QUESTION SECTION (VISUALLY DISTINCT) -->
                <div class="reflection-question-card">
                    <div class="reflection-card-symbol">✦</div>
                    <h2 class="reflection-heading">
                        ${
                            currentLanguage === 'en'
                                ? '"Is this really your necessity, or do you want this?"'
                                : '"क्या यह वास्तव में आपकी आवश्यकता है, या आप केवल इसे चाहते हैं?"'
                        }
                    </h2>
                    <p class="reflection-card-text">
                        ${
                            currentLanguage === 'en'
                                ? 'Reflect deeply on your lifestyle. Most of human consumption is driven by unexamined habit and mental conditioning rather than biological necessity.'
                                : 'अपनी जीवनशैली पर गहराई से विचार करें। मानव का अधिकांश उपभोग जैविक आवश्यकता के बजाय बिना जाँची आदत और मानसिक conditioning से प्रेरित होता है।'
                        }
                    </p>
                </div>

                <!-- RECOMMENDATION SECTION -->
                <div class="result-card recommendation-card">
                    <h3>💡 ${currentLanguage === 'en' ? 'Recommendation to Control Consumption' : 'उपभोग नियंत्रित करने की सिफारिश'}</h3>
                    
                    <h4 class="rec-title">
                        ${
                            currentLanguage === 'en'
                                ? 'You should control your consumption.'
                                : 'आपको अपने उपभोग को नियंत्रित करना चाहिए।'
                        }
                    </h4>

                    <p class="rec-body">
                        ${
                            currentLanguage === 'en'
                                ? 'Every consumption choice has consequences. Before consuming more, ask yourself whether it is truly necessary.'
                                : 'हर उपभोग के परिणाम होते हैं। अधिक उपभोग करने से पहले स्वयं से पूछें कि क्या यह वास्तव में आवश्यक है।'
                        }
                    </p>

                    ${highestItem ? `
                        <div class="highest-source-tip">
                            🎯 <strong>${currentLanguage === 'en' ? 'Actionable Insight:' : 'मुख्य कार्यबिंदु:'}</strong> 
                            ${
                                currentLanguage === 'en'
                                    ? `Your largest emission source is <strong>${escapeHTML(highestItem.item)}</strong> (${highestItem.emissions_kg} kg CO₂e / ${highestItem.percentage}% of total). Reducing or optimizing this single area will yield the biggest reduction in your footprint.`
                                    : `आपका सबसे बड़ा उत्सर्जन स्रोत <strong>${escapeHTML(highestItem.item)}</strong> (${highestItem.emissions_kg} किग्रा CO₂e / कुल का ${highestItem.percentage}%) है। इस क्षेत्र को नियंत्रित करने से आपके उत्सर्जन में सबसे बड़ा सुधार होगा।`
                            }
                        </div>
                    ` : ''}
                </div>

                <!-- WHAT-IF REDUCTION SCENARIO CALCULATOR -->
                <div class="result-card what-if-card">
                    <h3>📊 ${currentLanguage === 'en' ? 'What-If? Emission Reduction Simulator' : 'क्या होगा यदि? उत्सर्जन कमी सिमुलेटर'}</h3>
                    <p class="what-if-sub">
                        ${
                            currentLanguage === 'en'
                                ? 'See how small daily conscious choices reduce your total carbon footprint:'
                                : 'देखें कि छोटे सचेत विकल्प आपके कुल कार्बन उत्सर्जन को कैसे घटाते हैं:'
                        }
                    </p>

                    <div class="what-if-scenarios">
                        
                        <div class="scenario-item">
                            <label>⚡ ${currentLanguage === 'en' ? 'If you reduce electricity by 30 kWh/month:' : 'यदि आप बिजली 30 kWh/माह घटाते हैं:'}</label>
                            <div class="avoided-val">🌱 ${currentLanguage === 'en' ? 'Avoids ~21.5 kg CO₂e / month' : 'बचत: ~21.5 किग्रा CO₂e / माह'}</div>
                        </div>

                        <div class="scenario-item">
                            <label>🚗 ${currentLanguage === 'en' ? 'If you reduce car travel by 100 km/month:' : 'यदि आप कार यात्रा 100 किमी/माह घटाते हैं:'}</label>
                            <div class="avoided-val">🌱 ${currentLanguage === 'en' ? 'Avoids ~17.1 kg CO₂e / month' : 'बचत: ~17.1 किग्रा CO₂e / माह'}</div>
                        </div>

                        <div class="scenario-item">
                            <label>🥗 ${currentLanguage === 'en' ? 'If you swap 2 kg meat/dairy for pulses & tofu:' : 'यदि आप 2 किग्रा मांस/डेयरी को दालों और टोफू से बदलते हैं:'}</label>
                            <div class="avoided-val">🌱 ${currentLanguage === 'en' ? 'Avoids ~25.0 - 180.0 kg CO₂e / month' : 'बचत: ~25.0 - 180.0 किग्रा CO₂e / माह'}</div>
                        </div>

                    </div>
                </div>

                <!-- CTA TO EXISTING CONSCIOUSNESS ASSESSMENT -->
                <div class="assessment-cta-card">
                    <h2>🧠 ${currentLanguage === 'en' ? 'Know Your Consciousness Level' : 'अपनी चेतना का स्तर जानें'}</h2>
                    <p>
                        ${
                            currentLanguage === 'en'
                                ? 'Now that you have seen your material footprint on Earth, observe the mind and conditioning behind your choices.'
                                : 'अब जबकि आपने पृथ्वी पर अपना भौतिक प्रभाव देख लिया है, अपने चुनावों के पीछे के मन और conditioning का अवलोकन करें।'
                        }
                    </p>
                    
                    <button class="cta-assessment-btn" onclick="startAssessmentFromDashboard()">
                        🧠 ${currentLanguage === 'en' ? 'Start Consciousness Assessment' : 'Consciousness Assessment शुरू करें'}
                    </button>
                </div>

            </main>
        </div>
    `;

    if (voiceMode) {
        setTimeout(() => {
            speak(
                currentLanguage === 'en'
                    ? `Your total estimated monthly carbon footprint is ${totalMonthly} kilograms CO2 equivalent. Is this really your necessity, or do you want this? You should control your consumption. Click the button to know your consciousness level.`
                    : `आपका कुल अनुमानित मासिक कार्बन उत्सर्जन ${totalMonthly} किलोग्राम CO2 समतुल्य है। क्या यह वास्तव में आपकी आवश्यकता है, या आप केवल इसे चाहते हैं? आपको अपने उपभोग को नियंत्रित करना चाहिए।`
            );
        }, 700);
    }
}


/* =========================================================
   INTEGRATION POINT: CALL EXISTING CONSCIOUSNESS ASSESSMENT
   ========================================================= */

function startAssessmentFromDashboard() {
    currentQuestion = 0;
    answers = Array(questions.length).fill(null);
    renderQuestion();
}


/* =========================================================
   QUESTION SCREEN (EXISTING LOCKED UI & VOICE)
   ========================================================= */

function renderQuestion() {

    const q = questions[currentQuestion];

    const optionLetters = ["A", "B", "C", "D", "E"];

    document.body.innerHTML = `

        <div class="assessment-container">

            <div class="assessment-header">

                <h1>Consciousness with Bhaskar</h1>

                <div class="progress">
                    ${currentQuestion + 1} / ${questions.length}
                </div>

            </div>

            <div class="question-card">

                <h2>
                    ${escapeHTML(t(q.question))}
                </h2>

                <div class="options">

                    ${q.options[currentLanguage].map((option, index) => `

                        <button
                            class="option-button ${answers[currentQuestion] === index ? "selected" : ""}"
                            onclick="selectAnswer(${index})"
                        >

                            <span class="option-letter">
                                ${optionLetters[index]}
                            </span>

                            <span>
                                ${escapeHTML(option)}
                            </span>

                        </button>

                    `).join("")}

                </div>

            </div>

            <div class="navigation">

                <button
                    onclick="previousQuestion()"
                    ${currentQuestion === 0 ? "disabled" : ""}
                >
                    ${currentLanguage === "en" ? "← Previous" : "← पिछला"}
                </button>

                ${
                    currentQuestion === questions.length - 1

                    ? `
                        <button
                            onclick="finishAssessment()"
                            ${answers[currentQuestion] === null ? "disabled" : ""}
                        >
                            ${currentLanguage === "en" ? "See Result" : "परिणाम देखें"}
                        </button>
                    `

                    : `
                        <button
                            onclick="nextQuestion()"
                            ${answers[currentQuestion] === null ? "disabled" : ""}
                        >
                            ${currentLanguage === "en" ? "Next →" : "अगला →"}
                        </button>
                    `
                }

            </div>

            ${
                voiceMode

                ? `
                    <div class="voice-controls">

                        <p>
                            ${
                                currentLanguage === "en"
                                    ? "Voice Controls: A/B/C/D/E = Answer • N = Next • P = Previous • R = Review • Space = Repeat"
                                    : "वॉइस कंट्रोल: A/B/C/D/E = उत्तर • N = अगला • P = पिछला • R = Review • Space = दोहराएँ"
                            }
                        </p>

                        <button onclick="repeatQuestion()">
                            🔊 ${
                                currentLanguage === "en"
                                    ? "Repeat Question"
                                    : "प्रश्न दोहराएँ"
                            }
                        </button>

                    </div>
                `
                : ""
            }

        </div>
    `;

    if (voiceMode) {
        setTimeout(() => speakCurrentQuestion(), 300);
    }
}


/* =========================================================
   ANSWER SELECTION & NAVIGATION
   ========================================================= */

function selectAnswer(index) {
    answers[currentQuestion] = index;
    renderQuestion();
}

function nextQuestion() {
    if (answers[currentQuestion] === null) return;
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        finishAssessment();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}


/* =========================================================
   SCORE CALCULATIONS (EXISTING LOGIC WITH NEUTRAL -4)
   ========================================================= */

function calculateScore() {
    let total = 0;
    answers.forEach((answer, index) => {
        if (answer !== null) {
            total += questions[index].scores[answer];
        }
    });
    return total;
}

function calculatePercentage(score) {
    return Math.round((score / 40) * 100);
}

function getClassification(percentage) {
    if (percentage >= 90) {
        return {
            en: "High Awareness",
            hi: "उच्च जागरूकता"
        };
    }
    if (percentage >= 70) {
        return {
            en: "Good Awareness",
            hi: "अच्छी जागरूकता"
        };
    }
    if (percentage >= 50) {
        return {
            en: "Some Improvement Needed",
            hi: "थोड़ा सुधार चाहिए"
        };
    }
    if (percentage >= 33) {
        return {
            en: "Low Awareness",
            hi: "कम जागरूकता"
        };
    }
    if (percentage >= 0) {
        return {
            en: "Very Low Awareness",
            hi: "बहुत कम जागरूकता"
        };
    }
    return {
        en: "Unconscious",
        hi: "अचेतन"
    };
}


/* =========================================================
   FINISH ASSESSMENT & SAVE TO DATABASE
   ========================================================= */

async function finishAssessment() {

    if (answers.includes(null)) {
        alert(
            currentLanguage === "en"
                ? "Please answer all questions first."
                : "कृपया पहले सभी प्रश्नों के उत्तर दें।"
        );
        return;
    }

    const score = calculateScore();
    const percentage = calculatePercentage(score);
    const classification = getClassification(percentage);

    // Save to Database
    if (authToken) {
        try {
            await apiCall('/api/consciousness/save', 'POST', {
                score,
                percentage,
                classification_en: classification.en,
                classification_hi: classification.hi,
                answers
            });
        } catch (e) {
            console.error("Failed to save assessment to history:", e);
        }
    }

    renderResult(score, percentage, classification);

    if (voiceMode) {
        setTimeout(() => {
            speak(
                currentLanguage === "en"
                    ? `Your Consciousness Score is ${percentage} percent. Your assessment result is ${classification.en}.`
                    : `आपका Consciousness Score ${percentage} प्रतिशत है। आपका परिणाम ${classification.hi} है।`
            );
        }, 800);
    }
}


/* =========================================================
   RESULT SCREEN (EXISTING LOCKED REVIEW & GITA CTA)
   ========================================================= */

function renderResult(score, percentage, classification) {

    document.body.innerHTML = `

        <div class="result-container">

            <div class="result-header">

                <h1>
                    Consciousness with Bhaskar
                </h1>

                <h2>
                    ${
                        currentLanguage === "en"
                            ? "Your Consciousness Assessment Result"
                            : "आपका Consciousness Assessment Result"
                    }
                </h2>

            </div>


            <div class="score-card">

                <div class="score-number">
                    ${percentage}%
                </div>

                <div class="score-label">
                    ${escapeHTML(classification[currentLanguage])}
                </div>

                <div class="raw-score">
                    ${
                        currentLanguage === "en"
                            ? `Raw Score: ${score} / 40`
                            : `Raw Score: ${score} / 40`
                    }
                </div>

            </div>


            <div class="result-note">

                ${
                    currentLanguage === "en"

                    ? "This assessment is for self-reflection. It is not a scientific or clinical diagnosis."

                    : "यह assessment आत्म-चिंतन के लिए है। यह कोई वैज्ञानिक या clinical diagnosis नहीं है।"
                }

            </div>


            <div class="answer-review">

                <h2>

                    ${
                        currentLanguage === "en"
                            ? "Question-wise Reflection"
                            : "प्रश्नवार Reflection"
                    }

                </h2>


                ${questions
                    .map((q, index) =>
                        renderQuestionReview(q, index)
                    )
                    .join("")
                }

            </div>


            <div class="final-message">

                <h2>

                    ${
                        currentLanguage === "en"
                            ? "Question yourself. Observe yourself. Live consciously."
                            : "स्वयं से प्रश्न करें। स्वयं को देखें। सचेत होकर जिएँ।"
                    }

                </h2>

            </div>


            <div class="gita-community">

                <h2>

                    ${
                        currentLanguage === "en"
                            ? "Want to explore the Gita deeper?"
                            : "गीता को और गहराई से समझना चाहते हैं?"
                    }

                </h2>


                <p>

                    ${
                        currentLanguage === "en"
                            ? "Join Acharya Prashant's Gita community to know yourself."
                            : "स्वयं को जानने के लिए आचार्य प्रशांत की गीता community से जुड़ें।"
                    }

                </p>


                <a
                    href="https://acharyaprashant.org/en/gita/referral?referrerId=2131173a-44bc-4023-a22d-05d8aeb45638"
                    target="_blank"
                    rel="noopener noreferrer"
                >

                    ${
                        currentLanguage === "en"
                            ? "Join Gita Community ↗"
                            : "गीता Community से जुड़ें ↗"
                    }

                </a>

            </div>

            <!-- DASHBOARD RETURN LINK -->
            <div style="text-align: center; margin-top: 30px;">
                <button onclick="loadDashboard()" style="max-width: 300px;">
                    🏠 ${currentLanguage === 'en' ? 'Go to Personal Dashboard' : 'पर्सनल डैशबोर्ड पर जाएँ'}
                </button>
            </div>

        </div>
    `;
}


/* =========================================================
   QUESTION REVIEW (EXISTING LOCKED IMPLEMENTATION)
   ========================================================= */

function renderQuestionReview(q, index) {

    const selected = answers[index];
    const isBest = selected === q.bestOption;
    const selectedText = getOptionText(q, selected);
    const bestText = getOptionText(q, q.bestOption);

    const statusClass = isBest ? "review-correct" : "review-wrong";
    const statusIcon = isBest ? "✓" : "✕";

    const statusTitle = isBest
        ? (currentLanguage === "en" ? "More Conscious Option" : "इस मूल्यांकन में अधिक सचेत विकल्प")
        : (currentLanguage === "en" ? "Not the More Conscious Option" : "इस मूल्यांकन में अधिक सचेत विकल्प नहीं");

    const whyText = q.why[currentLanguage][selected];

    let explanationHTML = "";

    const personalExplanation =
        q.personalExplanationByOption &&
        q.personalExplanationByOption[currentLanguage] &&
        q.personalExplanationByOption[currentLanguage][selected];

    if (personalExplanation) {
        explanationHTML += `
            <div class="personal-explanation">
                <h4>
                    ${currentLanguage === "en" ? "Bhaskar's Explanation" : "भास्कर की व्याख्या"}
                </h4>
                <p>
                    ${escapeHTML(personalExplanation)}
                </p>
            </div>
        `;
    }

    const quoteText = q.quote[currentLanguage];

    explanationHTML += `
        <div class="quote-box">
            <div class="quote-text">
                “${escapeHTML(quoteText)}”
            </div>
            <div class="quote-person">
                — ${escapeHTML(q.quote.person)}
            </div>
            <div class="source-box">
                <span class="source-icon">🔗</span>
                <span>
                    ${currentLanguage === "en" ? "Source:" : "स्रोत:"}
                </span>
                <a
                    href="${q.quote.url}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${escapeHTML(q.quote.person)} ↗
                </a>
            </div>
        </div>
    `;

    return `
        <div class="review-card ${statusClass}">
            <div class="review-question-number">
                ${currentLanguage === "en" ? `Question ${q.id}` : `प्रश्न ${q.id}`}
            </div>

            <h3>
                ${escapeHTML(t(q.question))}
            </h3>

            <div class="selected-answer">
                <strong>
                    ${currentLanguage === "en" ? "Your Answer:" : "आपका उत्तर:"}
                </strong>
                <span>
                    ${escapeHTML(selectedText)}
                </span>
            </div>

            <div class="review-status">
                <span class="status-icon">
                    ${statusIcon}
                </span>
                <span>
                    ${statusTitle}
                </span>
            </div>

            <div class="why-box">
                <h4>
                    ${
                        isBest
                            ? (currentLanguage === "en" ? "Why this is considered more conscious" : "इसे अधिक सचेत विकल्प क्यों माना गया है")
                            : (currentLanguage === "en" ? "Why this answer is not considered more conscious" : "इस उत्तर को अधिक सचेत विकल्प क्यों नहीं माना गया")
                    }
                </h4>
                <p>
                    ${escapeHTML(whyText)}
                </p>
            </div>

            ${
                !isBest
                    ? `
                        <div class="more-conscious-answer">
                            <strong>
                                ${currentLanguage === "en" ? "More Conscious Option:" : "अधिक सचेत विकल्प:"}
                            </strong>
                            <span>
                                ${escapeHTML(bestText)}
                            </span>
                        </div>
                    `
                    : ""
            }

            ${explanationHTML}
        </div>
    `;
}


/* =========================================================
   VOICE SYNTHESIS & KEYBOARD HANDLER
   ========================================================= */

function loadVoices() {
    if ("speechSynthesis" in window) {
        voices = speechSynthesis.getVoices();
    }
}

if ("speechSynthesis" in window) {
    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
}

function getBestVoice(language) {
    if (!voices.length) return null;
    if (language === "hi") {
        return voices.find(v => v.lang && v.lang.toLowerCase().startsWith("hi")) || null;
    }
    return voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en")) || null;
}

function speak(text) {
    if (!voiceMode) return;

    if (!("speechSynthesis" in window)) {
        alert(currentLanguage === "en" ? "Voice synthesis is not supported in this browser." : "इस browser में voice synthesis supported नहीं है।");
        return;
    }

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage === "hi" ? "hi-IN" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voice = getBestVoice(currentLanguage);
    if (voice) {
        utterance.voice = voice;
    }

    speechSynthesis.speak(utterance);
}

function speakCurrentQuestion() {
    if (!voiceMode) return;
    const q = questions[currentQuestion];
    let text = t(q.question) + ". ";
    q.options[currentLanguage].forEach((option, index) => {
        text += `${String.fromCharCode(65 + index)}. ${option}. `;
    });
    text += currentLanguage === "en" ? "Choose your answer." : "अपना उत्तर चुनें।";
    speak(text);
}

function repeatQuestion() {
    speakCurrentQuestion();
}

function speakCurrentReview() {
    if (!voiceMode) return;
    const q = questions[currentQuestion];
    const selected = answers[currentQuestion];

    if (selected === null) {
        speak(currentLanguage === "en" ? "You have not selected an answer yet." : "आपने अभी उत्तर नहीं चुना है।");
        return;
    }

    const selectedText = getOptionText(q, selected);
    const isBest = selected === q.bestOption;

    const text = currentLanguage === "en"
        ? `Your answer is ${selectedText}. ${isBest ? "This is the more conscious option in this assessment." : "This is not the more conscious option in this assessment."}`
        : `आपका उत्तर है ${selectedText}। ${isBest ? "यह इस मूल्यांकन में अधिक सचेत विकल्प है।" : "यह इस मूल्यांकन में अधिक सचेत विकल्प नहीं है।"}`;

    speak(text);
}

document.addEventListener("keydown", function(event) {
    if (!voiceMode) return;

    const key = event.key.toLowerCase();
    const answerMap = { a: 0, b: 1, c: 2, d: 3, e: 4 };

    if (answerMap.hasOwnProperty(key)) {
        selectAnswer(answerMap[key]);
        return;
    }
    if (key === "n") {
        if (answers[currentQuestion] !== null) nextQuestion();
        return;
    }
    if (key === "p") {
        previousQuestion();
        return;
    }
    if (key === "r") {
        speakCurrentReview();
        return;
    }
    if (event.code === "Space") {
        event.preventDefault();
        repeatQuestion();
        return;
    }
});


/* =========================================================
   INITIALIZATION ON PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", function() {
    showLanguageSelection();
});
