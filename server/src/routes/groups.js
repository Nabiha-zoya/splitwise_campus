// Create group (in server/src/routes/groups.js)
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
    
    // Always include the creator (Zoya) plus any selected members
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