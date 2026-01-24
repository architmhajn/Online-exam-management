async function loadCheatingLogs() {

    const res = await fetch(
        "http://localhost:5000/api/exams/cheat-logs",
        {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    );

    const logs = await res.json();
    const tbody = document.getElementById("cheatTableBody");
    tbody.innerHTML = "";

    logs.forEach(log => {
        tbody.innerHTML += `
            <tr>
                <td>${log.student}</td>
                <td>${log.exam}</td>
                <td>${log.type}</td>
                <td>${log.created_at}</td>
            </tr>
        `;
    });
}

document.addEventListener("DOMContentLoaded", loadCheatingLogs);
