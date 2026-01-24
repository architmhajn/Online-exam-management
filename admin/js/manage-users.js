console.log("MANAGE USERS JS LOADED");

document.addEventListener("DOMContentLoaded", loadUsers);

async function loadUsers() {
    const res = await fetch(
        "http://localhost:5000/api/admin/users",
        {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    );

    const users = await res.json();
    const tbody = document.getElementById("usersTableBody");
    tbody.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.active ? "Active" : "Blocked"}</td>
            <td>
                <button onclick="toggleUser(${user.id}, ${user.active})">
                    ${user.active ? "Block" : "Unblock"}
                </button>
                <button onclick="deleteUser(${user.id})">
                    Delete
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

/* BLOCK / UNBLOCK */
async function toggleUser(id, currentStatus) {
    console.log("TOGGLING USER:", id, "FROM:", currentStatus);

    const res = await fetch(
        `http://localhost:5000/api/admin/user-status/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                active: currentStatus ? 0 : 1
            })
        }
    );

    const data = await res.json();
    console.log("STATUS UPDATE RESPONSE:", data);

    loadUsers(); // refresh table
}


/* DELETE USER */
async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    await fetch(
        `http://localhost:5000/api/admin/user/${id}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }
    );

    loadUsers();
}
