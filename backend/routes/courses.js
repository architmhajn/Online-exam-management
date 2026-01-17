const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  if (req.user.role === 'student') return res.status(403).json({ msg: 'Access denied' });
  const { name, code } = req.body;
  try {
    const [result] = await pool.execute('INSERT INTO courses (name, code, instructorId) VALUES (?, ?, ?)', [name, code, req.user.id]);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(400).json({ msg: 'Error creating course' });
  }
});

router.get('/', auth, async (req, res) => {
  let query = 'SELECT c.*, u.name AS instructorName FROM courses c LEFT JOIN users u ON c.instructorId = u.id';
  let params = [];
  if (req.user.role === 'instructor') {
    query += ' WHERE c.instructorId = ?';
    params.push(req.user.id);
  } else if (req.user.role === 'student') {
    query += ' WHERE c.id IN (SELECT courseId FROM course_students WHERE studentId = ?)';
    params.push(req.user.id);
  }
  const [rows] = await pool.execute(query, params);
  res.json(rows);
});

module.exports = router;