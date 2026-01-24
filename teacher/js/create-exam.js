document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("createExamForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("exam_title").value;
        const description = document.getElementById("exam_desc").value;
        const duration = document.getElementById("exam_duration").value;
        const totalMarks = document.getElementById("exam_marks").value;

        const user = JSON.parse(localStorage.getItem("loggedInUser"));

        const res = await fetch(
            "http://localhost:5000/api/exams",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    title,
                    description,
                    duration,
                    totalMarks,
                    teacherId: user.id
                })
            }
        );

        const data = await res.json();
        alert(data.message);

        form.reset();
    });
});
