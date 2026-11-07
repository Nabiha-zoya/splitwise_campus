import express from 'express';
import db from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create group
router.post('/', authenticateToken, async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    const { group_name, members } = req.body;
    await connection.beginTransaction();

    const [groupResult] = await connection.query(
      'INSERT INTO `groups` (group_name, created_by) VALUES (?, ?)',
      [group_name, req.user.userId]
    );

    const groupId = groupResult.insertId;
    const memberSet = new Set([req.user.userId, ...(members || [])]);

    for (const userId of memberSet) {
      await connection.query(
        'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)',
        [groupId, userId]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Group created', groupId });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
});

// Get user groups
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const [groups] = await db.query(
      `SELECT g.group_id, g.group_name, g.created_at, u.name AS created_by_name
       FROM \`groups\` g
       JOIN group_members gm ON g.group_id = gm.group_id
       JOIN users u ON g.created_by = u.user_id
       WHERE gm.user_id = ?`,
      [req.user.userId]
    );
    res.json(groups);
  } catch (err) {
    next(err);
  }
});

// Add member to group
router.post('/:id/members', authenticateToken, async (req, res, next) => {
  try {
    const { user_id } = req.body;
    await db.query('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)', [
      req.params.id,
      user_id
    ]);
    res.json({ message: 'Member added' });
  } catch (err) {
    next(err);
  }
});

export default router;