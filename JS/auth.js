/* =========================================================
   AUTH SYSTEM – ADMIN CONTROLLED
========================================================= */

/* ==========================
   ENSURE DEFAULT ADMIN
========================== */
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

/* ==========================
   LOGIN LOGIC
========================== */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(
            u => u.email === email && u.password === password && u.active === true
        );

        if (!user) {
            alert("Unauthorized access!");
            return;
        }

        // Save login session
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        // Redirect by role
        if (user.role === "admin") {
            window.location.href = "admin/dashboard.html";
        } else if (user.role === "teacher") {
            window.location.href = "teacher/dashboard.html";
        } else if (user.role === "student") {
            window.location.href = "student/dashboard.html";
        }
    });
}

/* ==========================
   LOGOUT
========================== */
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../login.html";
}
