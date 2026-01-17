const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const antiCheating = require('../middleware/antiCheating');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { title, courseId, questions, duration, randomizeQuestions } = req.body;
  if (req.user.role === 'student') return res.status(403).json({ msg: 'Access denied' });
  if (req.user.role === 'instructor') {
    const [courseRows] = await pool.execute('SELECT instructorId FROM courses WHERE id = ?', [courseId]);
    if (courseRows[0]?.instructorId !== req.user.id) return res.status(403).json({ msg: 'Not your course' });
  }
  try {
    const [result] = await pool.execute('INSERT INTO exams (title, courseId, questions, duration, randomizeQuestions, createdBy) VALUES (?, ?, ?, ?, ?, ?)', [title, courseId, JSON.stringify(questions), duration, randomizeQuestions, req.user.id]);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(400).json({ msg: 'Error creating exam' });
  }
});

router.post('/submit', auth, antiCheating, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ msg: 'Only students can submit' });
  const { examId, answers, cheatingFlags } = req.body;
  try {
    const [examRows] = await pool.execute('SELECT questions FROM exams WHERE id = ?', [examId]);
    const exam = examRows[0];
    let score = 0;
    exam.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });
    await pool.execute('INSERT INTO results (studentId, examId, answers, score, totalQuestions, cheatingDetected) VALUES (?, ?, ?, ?, ?, ?)', [req.user.id, examId, JSON.stringify(answers), score, exam.questions.length, req.cheatingDetected || false]);
    res.json({ msg: 'Submitted', score, cheating: req.cheatingDetected });
  } catch (err) {
    res.status(400).json({ msg: 'Error submitting exam' });
  }
});

router.get('/results/:examId', auth, async (req, res) => {
  const examId = req.params.examId;
  let query = 'SELECT r.*, u.name AS studentName FROM results r JOIN users u ON r.studentId = u.id WHERE r.examId = ?';
  let params = [examId];
  if (req.user.role === 'instructor') {
    query += ' AND r.examId IN (SELECT id FROM exams WHERE createdBy = ?)';
    params.push(req.user.id);
  } else if (req.user.role === 'student') {
    query += ' AND r.studentId = ?';
    params.push(req.user.id);
  }
  const [rows] = await pool.execute(query, params);
  res.json(rows);
});

router.put('/results/:resultId', auth, async (req, res) => {
  if (req.user.role === 'student') return res.status(403).json({ msg: 'Access denied' });
  const { score } = req.body;
  const resultId = req.params.resultId;
  if (req.user.role === 'instructor') {
    const [resultRows] = await pool.execute('SELECT e.createdBy FROM results r JOIN exams e ON r.examId = e.id WHERE r.id = ?', [resultId]);
    if (resultRows[0]?.createdBy !== req.user.id) return res.status(403).json({ msg: 'Not your exam' });
  }
  try {
    await pool.execute('UPDATE results SET score = ? WHERE id = ?', [score, resultId]);
    res.json({ msg: 'Score updated' });
  } catch (err) {
    res.status(400).json({ msg: 'Error updating score' });
  }
});

module.exports = router;