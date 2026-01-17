const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.put('/assign-role/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  const { role } = req.body;
  try {
    await pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ msg: 'Role updated' });
  } catch (err) {
    res.status(400).json({ msg: 'Error updating role' });
  }
});

router.get('/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  const [rows] = await pool.execute('SELECT id, name, email, role, batch FROM users');
  res.json(rows);
});

router.delete('/users/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(400).json({ msg: 'Error deleting user' });
  }
});

module.exports = router;