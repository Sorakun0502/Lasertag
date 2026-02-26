const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database table
async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        dates TEXT[] NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ DB init error:', err);
  } finally {
    client.release();
  }
}

// POST /api/submit - Submit a response
app.post('/api/submit', async (req, res) => {
  const { name, dates, comment } = req.body;

  if (!name || !dates || dates.length === 0) {
    return res.status(400).json({ error: 'Name und mindestens ein Datum sind erforderlich.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO responses (name, dates, comment) VALUES ($1, $2, $3) RETURNING id',
      [name.trim(), dates, comment || '']
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: 'Fehler beim Speichern.' });
  }
});

// GET /api/results - Get all responses (admin)
app.get('/api/results', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM responses ORDER BY created_at DESC');
    
    // Aggregate date votes
    const dateCounts = {};
    result.rows.forEach(row => {
      row.dates.forEach(date => {
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      });
    });

    res.json({
      responses: result.rows,
      dateCounts,
      total: result.rows.length
    });
  } catch (err) {
    console.error('Results error:', err);
    res.status(500).json({ error: 'Fehler beim Laden.' });
  }
});

// GET /api/stats - Quick stats for frontend
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query('SELECT name, dates FROM responses');
    const dateCounts = {};
    result.rows.forEach(row => {
      row.dates.forEach(date => {
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      });
    });
    res.json({ total: result.rows.length, dateCounts });
  } catch (err) {
    res.status(500).json({ error: 'Fehler.' });
  }
});

// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
