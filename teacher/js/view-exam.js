document.addEventListener("DOMContentLoaded", loadExams);

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
    const tbody = document.getElementById("examTableBody");
    tbody.innerHTML = "";

    if (exams.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">No exams found</td>
            </tr>
        `;
        return;
    }

    exams.forEach(exam => {
        tbody.innerHTML += `
            <tr>
                <td>${exam.title}</td>
                <td>${exam.duration}</td>
                <td>${exam.total_marks}</td>
                <td>${exam.created_at}</td>
            </tr>
        `;
    });
}
