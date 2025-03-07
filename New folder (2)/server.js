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

// ✅ Signup Route (No Password Hashing)
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
  console.log("📥 Received Data:", req.body); // Debug request body

  const { name, email, phone, class: studentClass, course, fingerprint_template } = req.body;

  if (!name || !email || !phone || !studentClass || !course) {
    console.log("⚠️ Missing required fields:", req.body);
    return res.status(400).json({ message: "⚠️ Missing required fields!" });
  }

  // Get last custom_studentID and generate new one
  const getIdSql = "SELECT custom_studentID FROM student ORDER BY studentID DESC LIMIT 1";

  db.query(getIdSql, (err, result) => {
    if (err) {
      console.error("❌ SQL Error (Fetching ID):", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }

    let lastId = result.length > 0 ? parseInt(result[0].custom_studentID.substring(1)) : 0;
    let newCustomID = `S${lastId + 1}`;

    const sql =
      "INSERT INTO student (custom_studentID, name, email, phone, class, course, fingerprint_template) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [newCustomID, name, email, phone, studentClass, course, fingerprint_template || null];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("❌ SQL Error (Insert):", err);
        return res.status(500).json({ message: "❌ Server error", error: err.sqlMessage });
      }
      res.status(201).json({ message: "✅ Student added successfully!", customID: newCustomID });
    });
  });
});



// ✅ Add Teacher
app.post("/add-teacher", (req, res) => {
  const { name, email, phone, course, joining_date, fingerprint_template } = req.body;

  if (!name || !email || !phone || !course || !joining_date) {
    return res.status(400).json({ message: "⚠️ Missing required fields!" });
  }

  const getIdSql = "SELECT custom_teacherID FROM teacher ORDER BY ID DESC LIMIT 1";

  db.query(getIdSql, (err, result) => {
    if (err) {
      console.error("❌ SQL Error (Fetching ID):", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }

    let lastId = result.length > 0 ? parseInt(result[0].custom_teacherID.substring(1)) : 0;
    let newCustomID = `T${lastId + 1}`;

    const sql = "INSERT INTO teacher (custom_teacherID, name, email, phone, course, joining_date, fingerprint_template) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [newCustomID, name, email, phone, course, joining_date, fingerprint_template || null];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("❌ SQL Error (Insert):", err);
        return res.status(500).json({ message: "❌ Server error", error: err.sqlMessage });
      }
      res.status(201).json({ message: "✅ Teacher added successfully!", customID: newCustomID });
    });
  });
});
// ✅ Get All Students
app.get("/api/student", (_, res) => {
  const sql = "SELECT studentID, custom_studentID, name, email, phone, class AS studentClass, course, created_at FROM student";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Get All Teachers (Fixed)
app.get("/api/teacher", (_, res) => {
  const sql = "SELECT ID, custom_teacherID, name, email, phone, joining_date, course, created_at FROM teacher";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// ✅ Delete Student
app.delete('/student/:id', (req, res) => {
  const studentId = req.params.id;
  const sql = "DELETE FROM student WHERE studentID = ?";
  db.query(sql, [studentId], (err, result) => {
      if (err) return res.status(500).json({ message: "Error deleting student", error: err.message });
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
  db.query("DELETE FROM teacher WHERE ID = ?", [teacherId], (err, result) => {
      if (err) return res.status(500).json({ message: "Error deleting teacher" });
      if (result.affectedRows > 0) {
          res.status(200).json({ message: "✅ Teacher deleted successfully." });
      } else {
          res.status(404).json({ message: "❌ Teacher not found." });
      }
  });
});



app.post("/api/setup-attendance", (req, res) => {
  const { attendanceName, date, startingPoint, timeUp, attendees } = req.body;

  db.query(
    "INSERT INTO attendance (attendance_name, date, starting_point, time_up) VALUES (?, ?, ?, ?)",
    [attendanceName, date, startingPoint, timeUp],
    (error, attendanceResult) => {
      if (error) {
        console.error("❌ Error saving attendance:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      const attendanceId = attendanceResult.insertId;

      const attendanceRecords = attendees
        .filter((attendee) => attendee.isValid)
        .map((attendee) => [
          attendanceId,
          attendee.userType,
          attendee.userType === "Student" ? attendee.id : null,
          attendee.userType === "Teacher" ? attendee.id : null,
          "Present",
        ]);

      if (attendanceRecords.length > 0) {
        db.query(
          "INSERT INTO attendance_records (attendance_id, user_type, student_id, teacher_id, status) VALUES ?",
          [attendanceRecords],
          (err) => {
            if (err) console.error("❌ Error inserting present attendees:", err);
          }
        );
      }

      db.query(
        `INSERT INTO attendance_records (attendance_id, user_type, student_id, teacher_id, status)
         SELECT ?, 'Student', s.custom_studentID, NULL, 'Absent'
         FROM student s
         LEFT JOIN attendance_records ar ON s.custom_studentID = ar.student_id AND ar.attendance_id = ?
         WHERE ar.student_id IS NULL
         UNION
         SELECT ?, 'Teacher', NULL, t.custom_teacherID, 'Absent'
         FROM teacher t
         LEFT JOIN attendance_records ar ON t.custom_teacherID = ar.teacher_id AND ar.attendance_id = ?
         WHERE ar.teacher_id IS NULL`,
        [attendanceId, attendanceId, attendanceId, attendanceId],
        (absentError) => {
          if (absentError) {
            console.error("❌ Error marking absent:", absentError);
            return res.status(500).json({ message: "Error marking absentees" });
          }

          // 🔴 UPDATE attendance_id for records that contain NULL and have status 'Present'
          db.query(
            `UPDATE attendance_records 
             SET attendance_id = ? 
             WHERE attendance_id IS NULL AND status = 'Present'`,
            [attendanceId],
            (updateError) => {
              if (updateError) {
                console.error("❌ Error updating NULL attendance_id:", updateError);
                return res.status(500).json({ message: "Error updating attendance records" });
              }

              res.json({ message: "✅ Attendance Saved Successfully!", attendanceId });
            }
          );
        }
      );
    }
  );
});

  
  app.post("/api/valid-ids", (req, res) => {
    const { id } = req.body;  // Change "userId" to "id"

    if (!id) {
      return res.status(400).json({ message: "❌ Attendance ID is required" });
    }

    const query = `
      SELECT 'Student' AS userType, name, custom_studentID AS id FROM student WHERE custom_studentID = ?
      UNION
      SELECT 'Teacher' AS userType, name, custom_teacherID AS id FROM teacher WHERE custom_teacherID = ?
    `;

    db.query(query, [id, id], (error, results) => {
      if (error) {
        console.error("❌ Error checking user ID:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length > 0) {
        return res.json({ valid: true, user: results[0] });
      } else {
        return res.json({ valid: false, message: "❌ ID not found" });
      }
    });
});
app.post("/api/mark-attendance", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  let userType, column, table, idColumn;
  if (id.startsWith("S")) {
    userType = "Student";
    column = "student_id";
    table = "student";
    idColumn = "custom_studentID";  // ✅ Correct column
  } else if (id.startsWith("T")) {
    userType = "Teacher";
    column = "teacher_id";
    table = "teacher";
    idColumn = "custom_teacherID";  // ✅ Correct column
  } else {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  // 🔍 Debugging - Check if ID exists in the database
  let checkQuery = `SELECT * FROM ${table} WHERE ${idColumn} = ? LIMIT 1`;
  console.log("🔎 Checking ID:", checkQuery, [id]);

  db.query(checkQuery, [id], (err, result) => {
    if (err) {
      console.error("❌ Database query error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    console.log("🟢 Query Result:", result);

    if (result.length === 0) {
      return res.status(404).json({ error: `User ID ${id} not found in database` });
    }

    // 🔹 Debug: Ensure correct ID is being inserted
    console.log("✅ User Found:", result[0]);

    // Insert attendance record
    let insertQuery = `INSERT INTO attendance_records (attendance_id, user_type, ${column}, status)
                       VALUES (NULL, ?, ?, 'Present')`;

    db.query(insertQuery, [userType, id], (err, result) => {
      if (err) {
        console.error("❌ Database insert error:", err);
        return res.status(500).json({ error: "Failed to insert attendance record" });
      }

      console.log("✅ Attendance marked successfully:", result);
      res.json({ success: true, message: "Attendance marked successfully!" });
    });
  });
});




  
// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));