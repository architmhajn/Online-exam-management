const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
    res.send("Backend running with MySQL");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
