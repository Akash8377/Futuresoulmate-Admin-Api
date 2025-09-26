const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "future_soulmate",
});

conn.connect((err) => {
    if (err) {
        console.error("Database connection failed. Error:", err.message);
        return;
    }
    console.log("Connected to MySql database");
});

module.exports = conn;