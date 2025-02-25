const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const SECRET_KEY = "1463292f4e054fdd6423b7e605c4d16a1550af656180a33690f3c1192a4c94c7";

app.use(cors());
app.use(express.json());

// ✅ MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ahsin@317", // Your MySQL password
    database: "sraasdb"
});

db.connect((err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("✅ Connected to MySQL database");
});

// ✅ Signup Route (Allow Only New Users)
app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const checkUserSQL = "SELECT * FROM users WHERE username = ?";
    db.query(checkUserSQL, [username], (err, results) => {
        if (err) return res.status(500).json({ message: "Server error" });

        if (results.length > 0) {
            return res.status(400).json({ message: "User already exists. Please login." });
        }

        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        db.query(sql, [username, password], (err) => {
            if (err) return res.status(500).json({ message: "Error signing up" });

            res.json({ message: "✅ User registered successfully" });
        });
    });
});

// ✅ Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ message: "Server error" });

        if (results.length === 0 || password !== results[0].password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const user = results[0];
        const token = jwt.sign({ userID: user.userID, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: "✅ Login successful", token });
    });
});

// ✅ Add Student
app.post("/add-student", (req, res) => {
    const { name, email, phone, course, image, fingerprint_template } = req.body;

    const sql = "INSERT INTO student (name, email, phone, course, image, fingerprint_template) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, email, phone, course, image, fingerprint_template], (err) => {
        if (err) return res.status(500).json({ message: "Server error" });

        res.status(201).json({ message: "✅ Student added successfully!" });
    });
});

// ✅ Add Teacher
app.post("/add-teacher", (req, res) => {
    const { name, email, phone, subject, image, joining_date, fingerprint_template } = req.body;

    const sql = "INSERT INTO teacher (name, email, phone, subject, image, joining_date, fingerprint_template) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, email, phone, subject, image, joining_date, fingerprint_template], (err) => {
        if (err) return res.status(500).json({ message: "Server error" });

        res.status(201).json({ message: "✅ Teacher added successfully!" });
    });
});

// ✅ Get Students
app.get("/api/student", (_, res) => {
    db.query("SELECT studentID AS id, name, email, phone, course FROM students", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✅ Get Teachers
app.get("/api/teacher", (_, res) => {
    db.query("SELECT teacherID AS id, name, email, phone, subject, joining_date FROM teachers", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✅ Delete Student
app.delete('/student/:id', (req, res) => {
    const studentId = req.params.id;

    db.query("DELETE FROM student WHERE studentID = ?", [studentId], (err, result) => {
        if (err) return res.status(500).json({ message: "Error deleting student" });

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "✅ Student deleted successfully." });
        } else {
            res.status(404).json({ message: "❌ Student not found." });
        }
    });
});

// ✅ Delete Teacher
app.delete('/teacher/:id', (req, res) => {
    const teacherId = req.params.id;

    db.query("DELETE FROM teacher WHERE teacherID = ?", [teacherId], (err, result) => {
        if (err) return res.status(500).json({ message: "Error deleting teacher" });

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "✅ Teacher deleted successfully." });
        } else {
            res.status(404).json({ message: "❌ Teacher not found." });
        }
    });
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
