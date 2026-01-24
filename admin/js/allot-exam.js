console.log("✅ allot-exam.js loaded");

document.addEventListener("DOMContentLoaded", () => {

    // ---------- LOAD STUDENTS ----------
    async function loadStudents() {
        const res = await fetch(
            "http://localhost:5000/api/admin/students",
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }
        );

        const students = await res.json();
        const studentSelect = document.getElementById("studentSelect");
        studentSelect.innerHTML = "";

        students.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.id;
            opt.textContent = s.email;
            studentSelect.appendChild(opt);
        });
    }

    // ---------- LOAD EXAMS ----------
    async function loadExams() {
        const res = await fetch(
            "http://localhost:5000/api/exams",
            {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }
        );

        const exams = await res.json();
        const examSelect = document.getElementById("examSelect");
        examSelect.innerHTML = "";

        exams.forEach(e => {
            const opt = document.createElement("option");
            opt.value = e.id;
            opt.textContent = e.title;
            examSelect.appendChild(opt);
        });
    }

    // ---------- FORM SUBMIT ----------
    const allotForm = document.getElementById("allotForm");

    allotForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const examId = document.getElementById("examSelect").value;
        const studentId = document.getElementById("studentSelect").value;

        const res = await fetch(
            "http://localhost:5000/api/exams/allot",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({ examId, studentId })
            }
        );

        const data = await res.json();
        alert(data.message);
    });

    // ---------- INITIAL LOAD ----------
    loadStudents();
    loadExams();
});
