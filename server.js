const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'bhaskar_consciousness_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize Database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    voice_mode INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS co2_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    input_data TEXT NOT NULL,
    total_co2e REAL NOT NULL,
    breakdown TEXT NOT NULL,
    factor_version TEXT DEFAULT '2024.1',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS consciousness_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    classification_en TEXT NOT NULL,
    classification_hi TEXT NOT NULL,
    answers TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reflections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Load Emission Factors
let emissionFactorsData = {};
try {
  const efFile = fs.readFileSync(path.join(__dirname, 'emissionFactors.json'), 'utf8');
  emissionFactorsData = JSON.parse(efFile);
} catch (e) {
  console.error("Error loading emissionFactors.json:", e);
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ---------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, language, voice_mode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'Account with this email already exists' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const preferredLang = language || 'en';
    const voiceModeVal = voice_mode ? 1 : 0;

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password_hash, language, voice_mode)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, email.toLowerCase(), password_hash, preferredLang, voiceModeVal);

    const userId = result.lastInsertRowid;
    const userPayload = { id: userId, name, email: email.toLowerCase(), language: preferredLang, voice_mode: voiceModeVal };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '30d' });

    res.json({ token, user: userPayload });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: 'Failed to create user account' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      language: user.language,
      voice_mode: user.voice_mode === 1
    };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '30d' });

    res.json({ token, user: userPayload });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Current User Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, language, voice_mode, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      language: user.language,
      voice_mode: user.voice_mode === 1,
      created_at: user.created_at
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update Profile / Settings
app.put('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const { name, language, voice_mode } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newName = name !== undefined ? name : user.name;
    const newLang = language !== undefined ? language : user.language;
    const newVoice = voice_mode !== undefined ? (voice_mode ? 1 : 0) : user.voice_mode;

    db.prepare('UPDATE users SET name = ?, language = ?, voice_mode = ? WHERE id = ?')
      .run(newName, newLang, newVoice, req.user.id);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: newName,
        email: user.email,
        language: newLang,
        voice_mode: newVoice === 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ---------------------------------------------------------
// CO2 CALCULATION & FACTORS
// ---------------------------------------------------------

app.get('/api/co2/factors', (req, res) => {
  res.json(emissionFactorsData);
});

app.post('/api/co2/calculate', authenticateToken, (req, res) => {
  try {
    const { electricity_kwh, food_items, transport_items, lpg_cylinders, lpg_days, png_scm } = req.body;

    const factorsMap = {};
    if (emissionFactorsData.factors) {
      emissionFactorsData.factors.forEach(f => {
        factorsMap[f.id] = f;
      });
    }

    const breakdown = [];
    let totalCO2e = 0;

    // A. Electricity
    const kwh = parseFloat(electricity_kwh) || 0;
    if (kwh > 0 && factorsMap['elec_india']) {
      const f = factorsMap['elec_india'];
      const emissions = kwh * f.factor;
      totalCO2e += emissions;
      breakdown.push({
        category: 'Electricity',
        item: f.item,
        quantity: kwh,
        unit: 'kWh/month',
        emissions_kg: parseFloat(emissions.toFixed(2)),
        factor_used: f.factor,
        source: f.source_org
      });
    }

    // B. Food
    if (food_items && typeof food_items === 'object') {
      let foodTotalLand = 0;
      let foodTotalWater = 0;
      let foodTotalEutro = 0;

      Object.keys(food_items).forEach(foodId => {
        const kg = parseFloat(food_items[foodId]) || 0;
        if (kg > 0 && factorsMap[foodId]) {
          const f = factorsMap[foodId];
          const emissions = kg * f.factor;
          totalCO2e += emissions;

          if (f.land_use_m2_per_kg) foodTotalLand += kg * f.land_use_m2_per_kg;
          if (f.water_use_l_per_kg) foodTotalWater += kg * f.water_use_l_per_kg;
          if (f.eutrophication_g_per_kg) foodTotalEutro += kg * f.eutrophication_g_per_kg;

          breakdown.push({
            category: 'Food',
            item: f.item,
            quantity: kg,
            unit: 'kg/month',
            emissions_kg: parseFloat(emissions.toFixed(2)),
            factor_used: f.factor,
            source: f.source_org
          });
        }
      });
    }

    // C. Transport
    if (transport_items && typeof transport_items === 'object') {
      Object.keys(transport_items).forEach(transId => {
        const distance = parseFloat(transport_items[transId]) || 0;
        if (distance > 0 && factorsMap[transId]) {
          const f = factorsMap[transId];
          const emissions = distance * f.factor;
          totalCO2e += emissions;
          breakdown.push({
            category: 'Transport',
            item: f.item,
            quantity: distance,
            unit: `${f.unit}/month`,
            emissions_kg: parseFloat(emissions.toFixed(2)),
            factor_used: f.factor,
            source: f.source_org
          });
        }
      });
    }

    // D. LPG
    let lpgCylindersCount = parseFloat(lpg_cylinders) || 0;
    if (lpg_days && parseFloat(lpg_days) > 0) {
      lpgCylindersCount = 30 / parseFloat(lpg_days);
    }
    if (lpgCylindersCount > 0 && factorsMap['lpg_cylinder']) {
      const f = factorsMap['lpg_cylinder'];
      const emissions = lpgCylindersCount * f.factor_per_cylinder;
      totalCO2e += emissions;
      breakdown.push({
        category: 'LPG',
        item: f.item,
        quantity: parseFloat(lpgCylindersCount.toFixed(2)),
        unit: 'cylinders/month',
        emissions_kg: parseFloat(emissions.toFixed(2)),
        factor_used: f.factor_per_cylinder,
        source: f.source_org
      });
    }

    // E. PNG
    const scm = parseFloat(png_scm) || 0;
    if (scm > 0 && factorsMap['png_gas']) {
      const f = factorsMap['png_gas'];
      const emissions = scm * f.factor;
      totalCO2e += emissions;
      breakdown.push({
        category: 'PNG',
        item: f.item,
        quantity: scm,
        unit: 'SCM/month',
        emissions_kg: parseFloat(emissions.toFixed(2)),
        factor_used: f.factor,
        source: f.source_org
      });
    }

    const roundedTotal = parseFloat(totalCO2e.toFixed(2));

    // Calculate percentage breakdown
    breakdown.forEach(item => {
      item.percentage = roundedTotal > 0 ? parseFloat(((item.emissions_kg / roundedTotal) * 100).toFixed(1)) : 0;
    });

    // Save CO2 record to database
    const stmt = db.prepare(`
      INSERT INTO co2_records (user_id, input_data, total_co2e, breakdown, factor_version)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(
      req.user.id,
      JSON.stringify(req.body),
      roundedTotal,
      JSON.stringify(breakdown),
      emissionFactorsData.version || '2024.1'
    );

    // Tree-equivalent absorption (1 tree absorbs ~21.77 kg CO2 / year = 1.814 kg CO2 / month)
    const treeYearsEquivalent = parseFloat((roundedTotal / 21.77).toFixed(1));

    res.json({
      total_co2e_monthly: roundedTotal,
      total_co2e_annualized: parseFloat((roundedTotal * 12).toFixed(2)),
      breakdown,
      tree_years_equivalent: treeYearsEquivalent,
      tree_note: "Your emissions are approximately equivalent to " + treeYearsEquivalent + " tree-years of CO₂ absorption. This is an illustrative equivalence, not the actual number of trees cut.",
      factor_version: emissionFactorsData.version || '2024.1'
    });
  } catch (error) {
    console.error("CO2 calculation error:", error);
    res.status(500).json({ error: 'Failed to calculate emissions' });
  }
});

// ---------------------------------------------------------
// CONSCIOUSNESS ASSESSMENT SAVE & HISTORY
// ---------------------------------------------------------

app.post('/api/consciousness/save', authenticateToken, (req, res) => {
  try {
    const { score, percentage, classification_en, classification_hi, answers } = req.body;

    const stmt = db.prepare(`
      INSERT INTO consciousness_records (user_id, score, percentage, classification_en, classification_hi, answers)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      req.user.id,
      score,
      percentage,
      classification_en || '',
      classification_hi || '',
      JSON.stringify(answers || [])
    );

    res.json({ message: 'Consciousness assessment saved successfully' });
  } catch (error) {
    console.error("Save assessment error:", error);
    res.status(500).json({ error: 'Failed to save consciousness assessment' });
  }
});

// ---------------------------------------------------------
// DASHBOARD & HISTORY API
// ---------------------------------------------------------

app.get('/api/dashboard', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;

    const user = db.prepare('SELECT id, name, email, language, voice_mode FROM users WHERE id = ?').get(userId);
    const co2History = db.prepare('SELECT * FROM co2_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 10').all(userId);
    const consciousnessHistory = db.prepare('SELECT * FROM consciousness_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 10').all(userId);
    const reflections = db.prepare('SELECT * FROM reflections WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    const feedback = db.prepare('SELECT * FROM feedback WHERE user_id = ? ORDER BY created_at DESC').all(userId);

    // Parse JSON strings in records
    co2History.forEach(r => {
      try { r.input_data = JSON.parse(r.input_data); } catch(e){}
      try { r.breakdown = JSON.parse(r.breakdown); } catch(e){}
    });

    consciousnessHistory.forEach(r => {
      try { r.answers = JSON.parse(r.answers); } catch(e){}
    });

    res.json({
      user,
      latest_co2: co2History[0] || null,
      co2_history: co2History,
      latest_consciousness: consciousnessHistory[0] || null,
      consciousness_history: consciousnessHistory,
      reflections,
      feedback
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// ---------------------------------------------------------
// REFLECTIONS CRUD
// ---------------------------------------------------------

app.get('/api/reflections', authenticateToken, (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM reflections WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch reflections' });
  }
});

app.post('/api/reflections', authenticateToken, (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Reflection text cannot be empty' });

    const stmt = db.prepare('INSERT INTO reflections (user_id, text) VALUES (?, ?)');
    const result = stmt.run(req.user.id, text.trim());
    const newRecord = db.prepare('SELECT * FROM reflections WHERE id = ?').get(result.lastInsertRowid);
    res.json(newRecord);
  } catch (e) {
    res.status(500).json({ error: 'Failed to save reflection' });
  }
});

app.put('/api/reflections/:id', authenticateToken, (req, res) => {
  try {
    const { text } = req.body;
    const refId = req.params.id;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Reflection text cannot be empty' });

    const existing = db.prepare('SELECT * FROM reflections WHERE id = ? AND user_id = ?').get(refId, req.user.id);
    if (!existing) return res.status(404).json({ error: 'Reflection not found or unauthorized' });

    db.prepare('UPDATE reflections SET text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(text.trim(), refId);
    const updatedRecord = db.prepare('SELECT * FROM reflections WHERE id = ?').get(refId);
    res.json(updatedRecord);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update reflection' });
  }
});

app.delete('/api/reflections/:id', authenticateToken, (req, res) => {
  try {
    const refId = req.params.id;
    const result = db.prepare('DELETE FROM reflections WHERE id = ? AND user_id = ?').run(refId, req.user.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Reflection not found or unauthorized' });
    res.json({ message: 'Reflection deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete reflection' });
  }
});

// ---------------------------------------------------------
// HELP US IMPROVE (FEEDBACK)
// ---------------------------------------------------------

app.post('/api/feedback', authenticateToken, (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Feedback text cannot be empty' });

    const stmt = db.prepare('INSERT INTO feedback (user_id, text) VALUES (?, ?)');
    stmt.run(req.user.id, text.trim());
    res.json({ message: 'Feedback submitted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Catch-all route to serve index.html for SPA frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Consciousness with Bhaskar server running on port ${PORT}`);
});
