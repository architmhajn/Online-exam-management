async function loadResults() {

    const res = await fetch(
        "http://localhost:5000/api/exams/results",
        {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    );

    const results = await res.json();

    const tbody = document.getElementById("resultTableBody");
    tbody.innerHTML = "";

    results.forEach(r => {

        tbody.innerHTML += `
            <tr>
                <td>${r.student}</td>
                <td>${r.exam}</td>
                <td>${r.score}</td>
                <td>${r.submitted_at}</td>
                <td>
                    <button onclick="resetAttempt(${r.id})">
                        Allow Re-attempt
                    </button>
                </td>
            </tr>
        `;
    });
}

async function resetAttempt(id) {

    await fetch(
        `http://localhost:5000/api/exams/reset-attempt/${id}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    );

    alert("Re-attempt allowed");
    loadResults();
}

document.addEventListener("DOMContentLoaded", loadResults);
