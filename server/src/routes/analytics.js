import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/group/:groupId', authenticateToken, async (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    const [categoryBreakdown] = await db.query(
      `SELECT c.category_name, SUM(e.amount) AS total_spent
       FROM Expenses e
       JOIN Categories c ON e.category_id = c.category_id
       WHERE e.group_id = ?
       GROUP BY c.category_id, c.category_name`,
      [groupId]
    );

    const [totalSpent] = await db.query(
      `SELECT SUM(amount) AS grand_total FROM Expenses WHERE group_id = ?`,
      [groupId]
    );

    res.json({
      totalSpent: totalSpent[0].grand_total || 0,
      categoryBreakdown
    });
  } catch (err) {
    next(err);
  }
});

export default router;