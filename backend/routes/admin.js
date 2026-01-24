const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const router = express.Router();

router.post("/create-user", async (req, res) => {
    console.log("CREATE USER API HIT");
    console.log(req.body);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields required" });
    }

    if (!["teacher", "student"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

        db.query(sql, [name, email, hashedPassword, role], (err) => {
            if (err) {
                console.error(err);

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "User already exists" });
                }

                return res.status(500).json({ message: "Database error" });
            }

            res.json({ message: "User created successfully" });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
/**
 * ADMIN → GET ALL USERS
 */
router.get("/users", (req, res) => {
    const sql = `
        SELECT id, name, email, role, active, created_at
        FROM users
        WHERE role != 'admin'
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
});
/* GET ALL STUDENTS */
router.get("/students", (req, res) => {

    const sql = "SELECT id, email FROM users WHERE role = 'student' AND active = 1";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "DB Error" });
        }

        res.json(result);
    });
});

/**
 * ADMIN → TOGGLE USER STATUS (FIXED)
 */
router.patch("/user-status/:id", (req, res) => {
    const userId = Number(req.params.id);

    // force boolean → tinyint
    const active = req.body.active === 1 || req.body.active === true ? 1 : 0;

    console.log("TOGGLE USER:", userId, "ACTIVE:", active);

    const sql = "UPDATE users SET active = ? WHERE id = ?";

    db.query(sql, [active, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User status updated", active });
    });
});

/**
 * ADMIN → DELETE USER
 */
router.delete("/user/:id", (req, res) => {
    const userId = req.params.id;

    const sql = "DELETE FROM users WHERE id = ? AND role != 'admin'";

    db.query(sql, [userId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json({ message: "User deleted successfully" });
    });
});
