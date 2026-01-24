const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Archit@dbms",
    database: "online_exam" // ⚠️ must match your DB name
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err);
        return;
    }
    console.log("MySQL connected");
});

module.exports = db;
