document.addEventListener("DOMContentLoaded", () => {
    loadExams();
});

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
    console.log("Exams from DB:", exams); // debug

    const tableBody = document.getElementById("examTableBody");
    tableBody.innerHTML = "";

    if (exams.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4">No exams found</td>
            </tr>
        `;
        return;
    }

    exams.forEach(exam => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${exam.title}</td>
            <td>${exam.duration}</td>
            <td>${exam.total_marks}</td>
            <td>${exam.created_at}</td>
        `;
        tableBody.appendChild(row);
    });
}
