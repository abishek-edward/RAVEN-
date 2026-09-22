import express from 'express';
import { query } from '../db/client.js';

const router = express.Router();

/**
 * Demo authentication only — plain credentials, no hashing, no session tokens, no production security.
 * Real deployment would require a proper auth system.
 */

// 1. POST /api/officials/login — Lightweight demo official login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const result = await query(
      'SELECT id, name, username, assigned_ward, assigned_constituency FROM government_officials WHERE username = $1 AND password = $2',
      [username.trim(), password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid demo government credentials' });
    }

    const official = result.rows[0];
    res.json({
      id: official.id,
      name: official.name,
      username: official.username,
      assignedWard: official.assigned_ward,
      assignedConstituency: official.assigned_constituency,
      demo: true
    });
  } catch (err) {
    console.error('Error during demo official login:', err);
    res.status(500).json({ error: 'Authentication service error' });
  }
});

// 2. GET /api/officials/demo-accounts — List available demo official accounts for prototype UI
// Do NOT return passwords from this endpoint.
router.get('/demo-accounts', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, username, assigned_ward, assigned_constituency FROM government_officials WHERE username IS NOT NULL AND assigned_ward IS NOT NULL ORDER BY id ASC'
    );

    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      username: row.username,
      assignedWard: row.assigned_ward,
      assignedConstituency: row.assigned_constituency
    })));
  } catch (err) {
    console.error('Error fetching demo accounts:', err);
    res.status(500).json({ error: 'Failed to retrieve demo accounts' });
  }
});

export default router;
