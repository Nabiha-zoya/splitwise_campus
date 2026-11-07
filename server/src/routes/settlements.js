import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { group_id, paid_by, received_by, amount } = req.body;
    await db.query(
      `INSERT INTO Settlements (group_id, paid_by, received_by, amount) VALUES (?, ?, ?, ?)`,
      [group_id, paid_by, received_by, amount]
    );
    res.status(201).json({ message: 'Settlement recorded successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;