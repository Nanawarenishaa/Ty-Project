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
    password: "ahsin@3765", // Your MySQL password
    database: "sraasdb"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// ✅ Signup Route (Allow Only New Users)
app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the user already exists
    const checkUserSQL = "SELECT * FROM users WHERE username = ?";
    db.query(checkUserSQL, [username], (err, results) => {
        if (err) {
            console.error("Signup error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "User already exists. Please login." });
        }

        // If user does not exist, insert into the database
        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        db.query(sql, [username, password], (err, result) => {
            if (err) {
                console.error("Signup error:", err);
                return res.status(500).json({ message: "Error signing up" });
            }
            res.json({ message: "User registered successfully" });
        });
    });
});

// ✅ Login Route (Match Credentials in Database)
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error("Login error:", err);
            return res.status(500).json({ message: "Server error" });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const user = results[0];
        
        if (password !== user.password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ userID: user.userID, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    });
});
// ✅ Insert Student Record
app.post("/add-student", (req, res) => {
    const { studentID, name, email, phone, course, image, fingerprint_template } = req.body;

    const sql = "INSERT INTO students (studentID, name, email, phone, course, image, fingerprint_template) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [studentID, name, email, phone, course, image, fingerprint_template], (err, result) => {
        if (err) {
            console.error("❌ Error inserting student:", err);
            return res.status(500).json({ message: "Server error" });
        }
        res.status(201).json({ message: "✅ Student added successfully!" });
    });
});

// ✅ Insert Teacher Record
app.post("/add-teacher", (req, res) => {
    const { teacherID, name, email, phone, subject, image, joining_date, fingerprint_template } = req.body;

    const sql = "INSERT INTO teachers (teacherID, name, email, phone, subject, image, joining_date, fingerprint_template) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [teacherID, name, email, phone, subject, image, joining_date, fingerprint_template], (err, result) => {
        if (err) {
            console.error("❌ Error inserting teacher:", err);
            return res.status(500).json({ message: "Server error" });
        }
        res.status(201).json({ message: "✅ Teacher added successfully!" });
    });
});
app.get("/api/students", (_, res) => {
    db.query("SELECT studentID AS id, name, email, phone, course FROM students", (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
});
  
app.get("/api/teachers", (_, res) => {
    db.query("SELECT teacherID AS id, name, email, phone, subject, joining_date FROM teachers", (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
});
const deleteStudentFromDB = (id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM students WHERE studentID = ?", [id], (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};

// Usage in DELETE request:
app.delete('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    console.log("Received DELETE request for student ID:", req.params.id);
    try {
        const result = await deleteStudentFromDB(studentId);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Student deleted successfully." });
        } else {
            res.status(404).json({ message: "Student not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting student", error });
    }
});
const deleteTeacherFromDB = (id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM teachers WHERE teacherID = ?", [id], (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};
  
// Usage in DELETE request:
app.delete('/teachers/:id', async (req, res) => {
    const teacherId = req.params.id;
    console.log("Received DELETE request for teacher ID:", req.params.id);
    try {
        const result = await deleteTeacherFromDB(teacherId);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "teacher deleted successfully." });
        } else {
            res.status(404).json({ message: "teacher not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting teacher", error });
    }
});
// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});