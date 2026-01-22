const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const router = express.Router();

/**
 * ADMIN → CREATE USER
 */
router.post("/create-user", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields required" });
    }

    if (!["teacher", "student"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [name, email, hashedPassword, role], (err) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "User already exists" });
                }
                return res.status(500).json({ message: "Database error" });
            }

            res.json({ message: "User created successfully" });
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
