document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const inputs = registerForm.querySelectorAll("input");
            const password = inputs[2].value;
            const confirmPassword = inputs[3].value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            alert("Registration successful (backend will be added later)");
        });
    }

});
