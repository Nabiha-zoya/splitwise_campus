import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { calculateSplits } from '../services/splitService.js';

const router = express.Router();

// Add Expense (Database Transaction)
router.post('/', authenticateToken, async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    const { group_id, paid_by, category_id, description, amount, expense_date, split_type, participants, custom_splits } = req.body;

    const splits = calculateSplits(split_type, amount, participants, custom_splits);

    await connection.beginTransaction();

    const [expenseResult] = await connection.query(
      `INSERT INTO Expenses (group_id, paid_by, category_id, description, amount, expense_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [group_id, paid_by, category_id, description, amount, expense_date]
    );

    const expenseId = expenseResult.insertId;

    for (const split of splits) {
      await connection.query(
        `INSERT INTO Expense_Splits (expense_id, user_id, share_amount) VALUES (?, ?, ?)`,
        [expenseId, split.user_id, split.share_amount]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Expense added successfully', expenseId });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
});

// Get group expenses
router.get('/group/:groupId', authenticateToken, async (req, res, next) => {
  try {
    const [expenses] = await db.query(
      `SELECT e.*, u.name AS paid_by_name, c.category_name
       FROM Expenses e
       JOIN Users u ON e.paid_by = u.user_id
       JOIN Categories c ON e.category_id = c.category_id
       WHERE e.group_id = ?
       ORDER BY e.expense_date DESC`,
      [req.params.groupId]
    );
    res.json(expenses);
  } catch (err) {
    next(err);
  }
});

export default router;