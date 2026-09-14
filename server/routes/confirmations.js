import express from 'express';
import { query } from '../db/client.js';

const router = express.Router();

// 1. GET /api/confirmations — Fetch all confirmations grouped by clusterId
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM confirmations ORDER BY timestamp DESC'
    );

    const grouped = {};
    result.rows.forEach(r => {
      if (!grouped[r.cluster_id]) {
        grouped[r.cluster_id] = [];
      }
      grouped[r.cluster_id].push({
        id: r.id,
        isStillProblem: r.is_still_problem,
        citizen: r.citizen,
        timestamp: r.timestamp
      });
    });

    res.json(grouped);
  } catch (err) {
    console.error('Error fetching confirmations:', err);
    res.status(500).json({ error: 'Failed to retrieve confirmations' });
  }
});

// 2. POST /api/confirmations — Submit confirmation response ("Is this still a problem?")
router.post('/', async (req, res) => {
  const { clusterId, isStillProblem, citizen = 'Anonymous Citizen' } = req.body;

  if (!clusterId || isStillProblem === undefined) {
    return res.status(400).json({ error: 'clusterId and isStillProblem are required' });
  }

  try {
    // Insert confirmation record into Supabase
    const insertRes = await query(
      `INSERT INTO confirmations (cluster_id, is_still_problem, citizen, timestamp)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [clusterId, Boolean(isStillProblem), citizen]
    );

    // If citizen confirms it's still a problem, increment confirmations_count on the cluster
    if (isStillProblem) {
      await query(
        `UPDATE issue_clusters
         SET confirmations_count = confirmations_count + 1
         WHERE id = $1`,
        [clusterId]
      );
    }

    const created = {
      id: insertRes.rows[0].id,
      clusterId: insertRes.rows[0].cluster_id,
      isStillProblem: insertRes.rows[0].is_still_problem,
      citizen: insertRes.rows[0].citizen,
      timestamp: insertRes.rows[0].timestamp
    };

    res.status(201).json(created);
  } catch (err) {
    console.error('Error submitting confirmation:', err);
    res.status(500).json({ error: 'Failed to persist confirmation in database' });
  }
});

export default router;
