import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { group_id, amount, budget_month } = req.body;
    await db.query(
      `INSERT INTO Budgets (group_id, amount, budget_month) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE amount = VALUES(amount)`,
      [group_id, amount, budget_month]
    );
    res.json({ message: 'Budget set successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;