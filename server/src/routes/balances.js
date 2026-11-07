import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { simplifyDebts } from '../services/balanceService.js';

const router = express.Router();

router.get('/group/:groupId', authenticateToken, async (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    const [members] = await db.query(
      `SELECT u.user_id, u.name FROM Group_Members gm JOIN Users u ON gm.user_id = u.user_id WHERE gm.group_id = ?`,
      [groupId]
    );

    const [paidSums] = await db.query(
      `SELECT paid_by AS user_id, SUM(amount) AS total_paid FROM Expenses WHERE group_id = ? GROUP BY paid_by`,
      [groupId]
    );

    const [shareSums] = await db.query(
      `SELECT es.user_id, SUM(es.share_amount) AS total_share 
       FROM Expense_Splits es 
       JOIN Expenses e ON es.expense_id = e.expense_id 
       WHERE e.group_id = ? 
       GROUP BY es.user_id`,
      [groupId]
    );

    const [settlementPaid] = await db.query(
      `SELECT paid_by AS user_id, SUM(amount) AS total_settled FROM Settlements WHERE group_id = ? GROUP BY paid_by`,
      [groupId]
    );

    const [settlementReceived] = await db.query(
      `SELECT received_by AS user_id, SUM(amount) AS total_received FROM Settlements WHERE group_id = ? GROUP BY received_by`,
      [groupId]
    );

    const netBalances = {};
    members.forEach((m) => (netBalances[m.user_id] = 0));

    paidSums.forEach((row) => (netBalances[row.user_id] = (netBalances[row.user_id] || 0) + parseFloat(row.total_paid)));
    shareSums.forEach((row) => (netBalances[row.user_id] = (netBalances[row.user_id] || 0) - parseFloat(row.total_share)));
    settlementPaid.forEach((row) => (netBalances[row.user_id] = (netBalances[row.user_id] || 0) + parseFloat(row.total_settled)));
    settlementReceived.forEach((row) => (netBalances[row.user_id] = (netBalances[row.user_id] || 0) - parseFloat(row.total_received)));

    const simplified = simplifyDebts(netBalances);

    res.json({ netBalances, simplifiedSettlements: simplified, members });
  } catch (err) {
    next(err);
  }
});

export default router;