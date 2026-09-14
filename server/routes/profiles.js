import express from 'express';
import { query } from '../db/client.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM profiles ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching profiles:', err);
    res.status(500).json({ error: 'Failed to retrieve profiles' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM profiles WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

export default router;
