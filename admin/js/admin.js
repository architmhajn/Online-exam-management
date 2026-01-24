console.log("ADMIN.JS LOADED");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM READY");

    const form = document.getElementById("createUserForm");

    if (!form) {
        console.error("createUserForm NOT FOUND");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("FORM SUBMITTED");

        const payload = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            role: document.getElementById("role").value
        };

        console.log("PAYLOAD:", payload);

        const res = await fetch(
            "http://localhost:5000/api/admin/create-user",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await res.json();
        console.log("RESPONSE:", data);
        alert(data.message);
    });
});
