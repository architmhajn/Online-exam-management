require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/courses', require('./routes/courses'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await pool.getConnection();
    console.log('MySQL connected');
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error('DB connection error:', err);
  }
});