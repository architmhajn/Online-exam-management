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

/**
 * STUDENT → START EXAM
 */
router.post("/start", (req, res) => {
    const { examId, studentId } = req.body;

    const sql = `
        INSERT INTO attempts (exam_id, student_id)
        VALUES (?, ?)
    `;

    db.query(sql, [examId, studentId], (err) => {

        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res
                  .status(403)
                  .json({ message: "Already attempted" });
            }

            return res.status(500).json({ message: "DB error" });
        }

        res.json({ message: "Exam started" });
    });
});


/* STUDENT → SUBMIT EXAM */
router.post("/submit", (req, res) => {
    const { examId, studentId, score } = req.body;

    const sql = `
        UPDATE attempts
        SET score = ?, submitted = 1, submitted_at = NOW()
        WHERE exam_id = ? AND student_id = ?
    `;

    db.query(sql, [score, examId, studentId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Attempt not found" });
        }

        res.json({ message: "Exam submitted successfully" });
    });
});

async function submitExam(score) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const examId = localStorage.getItem("attemptExamId");

    const res = await fetch(
        "http://localhost:5000/api/exams/submit",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                examId,
                studentId: user.id,
                score
            })
        }
    );

    const data = await res.json();
    alert(data.message);

    localStorage.removeItem("attemptExamId");
    window.location.href = "dashboard.html";
}

/* ADMIN / TEACHER → VIEW RESULTS */
router.get("/results", (req, res) => {
    const sql = `
        SELECT 
            a.id,
            u.email AS student,
            e.title AS exam,
            a.score,
            a.submitted_at
        FROM attempts a
        JOIN users u ON a.student_id = u.id
        JOIN exams e ON a.exam_id = e.id
        WHERE a.submitted = 1
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});


/* ADMIN / TEACHER → RESET ATTEMPT */
router.delete("/reset-attempt/:id", (req, res) => {
    const attemptId = req.params.id;

    const sql = "DELETE FROM attempts WHERE id = ?";

    db.query(sql, [attemptId], (err) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json({ message: "Attempt reset successfully" });
    });
});

