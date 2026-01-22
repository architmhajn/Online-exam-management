const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Archit@dbms",
    database: "online_exam"
});

module.exports = db;
