document.getElementById("createUserForm")
?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        name: name.value,
        email: email.value,
        password: password.value,
        role: role.value
    };

    const res = await fetch(
        "http://localhost:5000/api/admin/create-user",
        {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        }
    );

    const data = await res.json();
    alert(data.message);
});
