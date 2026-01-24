const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ✅ 1. Create app FIRST
const app = express();

// ✅ 2. Middlewares
app.use(express.json());
app.use(cors());

// ✅ 3. Routes (require AFTER app exists)
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const examRoutes = require("./routes/exams");

// ✅ 4. Use routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/exams", examRoutes);

// ✅ 5. Test route
app.get("/", (req, res) => {
    res.send("Backend running with MySQL");
});

// ✅ 6. Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
