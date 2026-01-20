/* =========================================================
   AUTH + ADMIN USER MANAGEMENT (FINAL STABLE VERSION)
========================================================= */

/* ==========================
   ENSURE DEFAULT ADMIN
========================== */
function ensureAdmin() {
    let users = JSON.parse(localStorage.getItem("users"));
    if (!users || users.length === 0) {
        users = [{
            name: "System Admin",
            email: "admin@exam.com",
            password: "admin123",
            role: "admin",
            active: true
        }];
        localStorage.setItem("users", JSON.stringify(users));
    }
}
ensureAdmin();

/* ==========================
   LOGIN
========================== */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(
            u => u.email === email && u.password === password && u.active
        );

        if (!user) {
            alert("Unauthorized access!");
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(user));

        if (user.role === "admin") {
            window.location.href = "admin/dashboard.html";
        } else if (user.role === "teacher") {
            window.location.href = "teacher/dashboard.html";
        } else {
            window.location.href = "student/dashboard.html";
        }
    });
}

/* ==========================
   ADMIN CREATE USER
========================== */
const createUserForm = document.getElementById("createUserForm");

if (createUserForm) {
    createUserForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("cu_name").value.trim();
        const email = document.getElementById("cu_email").value.trim();
        const password = document.getElementById("cu_password").value.trim();
        const role = document.getElementById("cu_role").value;

        if (!name || !email || !password || !role) {
            alert("All fields are required!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        if (users.some(u => u.email === email)) {
            alert("User already exists!");
            return;
        }

        users.push({
            name,
            email,
            password,
            role,
            active: true
        });

        localStorage.setItem("users", JSON.stringify(users));

        alert("User created successfully!");
        window.location.href = "manage-users.html";
    });
}

/* ==========================
   MANAGE USERS (FINAL FIX)
========================== */
function renderUsers() {
    const tbody = document.getElementById("usersTableBody");
    if (!tbody) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    tbody.innerHTML = "";

    users.forEach((user, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.active ? "Active" : "Blocked"}</td>
            <td>
                <button onclick="toggleUser(${index})">
                    ${user.active ? "Block" : "Unblock"}
                </button>
                <button onclick="deleteUser(${index})">Delete</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function toggleUser(index) {
    let users = JSON.parse(localStorage.getItem("users"));
    users[index].active = !users[index].active;
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers();
}

function deleteUser(index) {
    let users = JSON.parse(localStorage.getItem("users"));

    if (users[index].role === "admin") {
        alert("Admin cannot be deleted!");
        return;
    }

    if (confirm("Are you sure?")) {
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        renderUsers();
    }
}

/* ==========================
   AUTO LOAD ON PAGE READY
========================== */
document.addEventListener("DOMContentLoaded", renderUsers);

/* ==========================
   LOGOUT
========================== */
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../login.html";
}
/* ==========================
   SESSION & ROLE PROTECTION
========================== */

function requireLogin() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
        alert("Please login first!");
        window.location.href = "../login.html";
    }
}

function requireRole(requiredRole) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
        alert("Please login first!");
        window.location.href = "../login.html";
        return;
    }

    if (user.role !== requiredRole) {
        alert("Unauthorized access!");
        window.location.href = "../login.html";
    }
}
/* ==========================
   TEACHER – CREATE EXAM
========================== */

const createExamForm = document.getElementById("createExamForm");

if (createExamForm) {
    createExamForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("exam_title").value.trim();
        const desc = document.getElementById("exam_desc").value.trim();
        const duration = document.getElementById("exam_duration").value;
        const marks = document.getElementById("exam_marks").value;

        if (!title || !desc || !duration || !marks) {
            alert("All fields are required!");
            return;
        }

        const teacher = JSON.parse(localStorage.getItem("loggedInUser"));

        let exams = JSON.parse(localStorage.getItem("exams")) || [];

        const exam = {
            examId: Date.now(),
            title: title,
            description: desc,
            duration: duration,
            totalMarks: marks,
            teacherEmail: teacher.email,
            createdAt: new Date().toLocaleString()
        };

        exams.push(exam);
        localStorage.setItem("exams", JSON.stringify(exams));

        alert("Exam created successfully!");
        createExamForm.reset();
    });
}

/* ==========================
   TEACHER – VIEW OWN EXAMS
========================== */

function renderTeacherExams() {
    const tableBody = document.getElementById("teacherExamTable");
    if (!tableBody) return;

    const exams = JSON.parse(localStorage.getItem("exams")) || [];
    const teacher = JSON.parse(localStorage.getItem("loggedInUser"));

    tableBody.innerHTML = "";

    const myExams = exams.filter(
        exam => exam.teacherEmail === teacher.email
    );

    if (myExams.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4">No exams created yet</td>
            </tr>
        `;
        return;
    }

    myExams.forEach(exam => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${exam.title}</td>
            <td>${exam.duration}</td>
            <td>${exam.totalMarks}</td>
            <td>${exam.createdAt}</td>
        `;
        tableBody.appendChild(row);
    });
}

/* Auto load on page open */
document.addEventListener("DOMContentLoaded", renderTeacherExams);
/* ==========================
   TEACHER – ADD QUESTIONS
========================== */

// Render exams with Add Question button
function renderTeacherExams() {
    const tableBody = document.getElementById("teacherExamTable");
    if (!tableBody) return;

    const exams = JSON.parse(localStorage.getItem("exams")) || [];
    const teacher = JSON.parse(localStorage.getItem("loggedInUser"));

    tableBody.innerHTML = "";

    const myExams = exams.filter(e => e.teacherEmail === teacher.email);

    myExams.forEach(exam => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${exam.title}</td>
            <td>${exam.duration}</td>
            <td>${exam.totalMarks}</td>
            <td>
                <button onclick="openAddQuestion(${exam.examId})">
                    Add Questions
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openAddQuestion(examId) {
    localStorage.setItem("currentExamId", examId);
    window.location.href = "add-questions.html";
}

/* ==========================
   SAVE QUESTION
========================== */

const questionForm = document.getElementById("questionForm");

if (questionForm) {
    const examId = localStorage.getItem("currentExamId");
    document.getElementById("examId").value = examId;

    questionForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const question = {
            questionId: Date.now(),
            examId: examId,
            questionText: document.getElementById("questionText").value.trim(),
            optionA: document.getElementById("optA").value.trim(),
            optionB: document.getElementById("optB").value.trim(),
            optionC: document.getElementById("optC").value.trim(),
            optionD: document.getElementById("optD").value.trim(),
            correctOption: document.getElementById("correctOpt").value
        };

        let questions = JSON.parse(localStorage.getItem("questions")) || [];
        questions.push(question);
        localStorage.setItem("questions", JSON.stringify(questions));

        alert("Question added successfully!");
        questionForm.reset();
    });
}

/* Auto load exams */
document.addEventListener("DOMContentLoaded", renderTeacherExams);
