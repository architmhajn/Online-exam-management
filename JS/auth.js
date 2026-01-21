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
            <td>
                <button onclick="openAddQuestion(${exam.examId})">
                    Add Questions
                </button>
                <button onclick="openViewQuestions(${exam.examId})">
                    View Questions
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
/* ==========================
   TEACHER – VIEW QUESTIONS
========================== */

function openViewQuestions(examId) {
    localStorage.setItem("viewExamId", examId);
    window.location.href = "view-questions.html";
}

function renderQuestions() {
    const tableBody = document.getElementById("questionTable");
    if (!tableBody) return;

    const examId = localStorage.getItem("viewExamId");
    const questions = JSON.parse(localStorage.getItem("questions")) || [];

    tableBody.innerHTML = "";

    const examQuestions = questions.filter(
        q => q.examId == examId
    );

    if (examQuestions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="3">No questions added yet</td>
            </tr>
        `;
        return;
    }

    examQuestions.forEach((q, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${q.questionText}</td>
            <td>${q.correctOption}</td>
        `;
        tableBody.appendChild(row);
    });
}

/* Auto load on page open */
document.addEventListener("DOMContentLoaded", renderQuestions);

/* ==========================
   STUDENT – VIEW ALLOTTED EXAMS ONLY
========================== */

function renderStudentExams() {
    const tableBody = document.getElementById("studentExamTable");
    if (!tableBody) return;

    const student = JSON.parse(localStorage.getItem("loggedInUser"));
    const exams = JSON.parse(localStorage.getItem("exams")) || [];
    const allotments = JSON.parse(localStorage.getItem("examAllotments")) || [];

    tableBody.innerHTML = "";

    // find exam IDs allotted to this student
    const myExamIds = allotments
        .filter(a => a.studentEmail === student.email)
        .map(a => a.examId);

    const myExams = exams.filter(exam =>
        myExamIds.includes(exam.examId)
    );

    if (myExams.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4">No exams allotted to you</td>
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
            <td>
                <button onclick="startExam(${exam.examId})">
                    Start Exam
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function startExam(examId) {
    localStorage.setItem("attemptExamId", examId);
    window.location.href = "attempt-exam.html";
}


/* Auto load */
document.addEventListener("DOMContentLoaded", renderStudentExams);
/* ==========================
   STUDENT – LOAD EXAM & QUESTIONS
========================== */

function loadExamQuestions() {
    const container = document.getElementById("questionContainer");
    if (!container) return;

    const examId = localStorage.getItem("attemptExamId");
    const exams = JSON.parse(localStorage.getItem("exams")) || [];
    const questions = JSON.parse(localStorage.getItem("questions")) || [];

    const exam = exams.find(e => e.examId == examId);
    if (!exam) {
        container.innerHTML = "<p>Exam not found</p>";
        return;
    }

    document.getElementById("examTitle").innerText = exam.title;

    const examQuestions = questions.filter(q => q.examId == examId);

    if (examQuestions.length === 0) {
        container.innerHTML = "<p>No questions available</p>";
        return;
    }

    container.innerHTML = "";

    examQuestions.forEach((q, index) => {
        const div = document.createElement("div");
        div.style.marginBottom = "20px";

        div.innerHTML = `
            <p><strong>Q${index + 1}. ${q.questionText}</strong></p>

            <label>
                <input type="radio" name="q_${q.questionId}" value="A"> ${q.optionA}
            </label><br>

            <label>
                <input type="radio" name="q_${q.questionId}" value="B"> ${q.optionB}
            </label><br>

            <label>
                <input type="radio" name="q_${q.questionId}" value="C"> ${q.optionC}
            </label><br>

            <label>
                <input type="radio" name="q_${q.questionId}" value="D"> ${q.optionD}
            </label>
        `;

        container.appendChild(div);
    });
}

/* Load when page opens */
document.addEventListener("DOMContentLoaded", loadExamQuestions);
/* ==========================
   ADMIN – ALLOT EXAM TO STUDENT
========================== */

function loadAllotExamData() {
    const examSelect = document.getElementById("examSelect");
    const studentSelect = document.getElementById("studentSelect");

    if (!examSelect || !studentSelect) return;

    const exams = JSON.parse(localStorage.getItem("exams")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Load exams
    exams.forEach(exam => {
        const opt = document.createElement("option");
        opt.value = exam.examId;
        opt.textContent = exam.title;
        examSelect.appendChild(opt);
    });

    // Load students only
    users
        .filter(u => u.role === "student" && u.active)
        .forEach(student => {
            const opt = document.createElement("option");
            opt.value = student.email;
            opt.textContent = student.email;
            studentSelect.appendChild(opt);
        });
}

/* Handle allotment */
const allotForm = document.getElementById("allotExamForm");

if (allotForm) {
    loadAllotExamData();

    allotForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const examId = document.getElementById("examSelect").value;
        const studentEmail = document.getElementById("studentSelect").value;

        if (!examId || !studentEmail) {
            alert("Please select exam and student");
            return;
        }

        let allotments = JSON.parse(localStorage.getItem("examAllotments")) || [];

        // prevent duplicate allotment
        const exists = allotments.some(
            a => a.examId == examId && a.studentEmail === studentEmail
        );

        if (exists) {
            alert("Exam already allotted to this student");
            return;
        }

        allotments.push({
            examId: Number(examId),
            studentEmail: studentEmail
        });

        localStorage.setItem("examAllotments", JSON.stringify(allotments));

        alert("Exam allotted successfully!");
        allotForm.reset();
    });
}
