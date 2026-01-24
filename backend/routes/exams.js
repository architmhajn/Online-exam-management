const express = require("express");
const db = require("../db");
const router = express.Router();

/**
 * CREATE EXAM (Teacher)
 */
router.post("/create", (req, res) => {
    const { title, description, duration, totalMarks, teacherId } = req.body;

    if (!title || !duration || !totalMarks || !teacherId) {
        return res.status(400).json({ message: "All fields required" });
    }

    const sql = `
        INSERT INTO exams (title, description, duration, total_marks, teacher_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, description, duration, totalMarks, teacherId],
        (err, result) => {
            if (err) return res.status(500).json({ message: "DB error" });

            res.json({
                message: "Exam created",
                examId: result.insertId
            });
        }
    );
});

/**
 * ADD QUESTION
 */
router.post("/add-question", (req, res) => {
    const {
        examId,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption
    } = req.body;

    const sql = `
        INSERT INTO questions
        (exam_id, question, option_a, option_b, option_c, option_d, correct_option)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [examId, question, optionA, optionB, optionC, optionD, correctOption],
        (err) => {
            if (err) return res.status(500).json({ message: "DB error" });

            res.json({ message: "Question added" });
        }
    );
});

module.exports = router;
