const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    console.log("📩 Register body:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
