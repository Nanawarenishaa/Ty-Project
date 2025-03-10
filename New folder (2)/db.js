const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "ahsin@317",
  database: "sraasdb",
  connectionLimit: 10,  // ✅ Works with createPool()
});

module.exports = db;
