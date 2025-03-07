const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ahsin@317",
  database: "sraasdb"
});

db.connect((err) => {
  if (err) console.log("Database connection error:", err);
  else console.log("Connected to MySQL database");
});

module.exports = db;