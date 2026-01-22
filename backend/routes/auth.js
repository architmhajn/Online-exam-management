const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ? AND active = 1",
        [email],
        async (err, result) => {
            if (err || result.length === 0)
                return res.status(401).json({ message: "Invalid user" });

            const user = result[0];
            const match = await bcrypt.compare(password, user.password);

            if (!match)
                return res.status(401).json({ message: "Wrong password" });

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET
            );

            res.json({
                token,
                user: {
                    email: user.email,
                    role: user.role
                }
            });
        }
    );
});

module.exports = router;
