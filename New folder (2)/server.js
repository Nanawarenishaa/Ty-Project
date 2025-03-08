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

app.post("/api/valid-ids", (req, res) => {
  const { id } = req.body;

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
// ✅ API to mark attendance (Insert custom_studentID where present, keep absent by default)
app.post("/api/mark-attendance", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  let table, idColumn;
  if (id.startsWith("S")) {
    table = "student_attendance";
    idColumn = "custom_studentID";
  } else if (id.startsWith("T")) {
    table = "teacher_attendance";
    idColumn = "custom_teacherID";
  } else {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  // ✅ Insert or Update Attendance for "Present" with NULL attendanceID
  const insertOrUpdateQuery = `
    INSERT INTO ${table} (${idColumn}, attendanceID, status)
    VALUES (?, NULL, 'Present')
    ON DUPLICATE KEY UPDATE status = 'Present'
  `;

  db.query(insertOrUpdateQuery, [id], (err, result) => {
    if (err) {
      console.error("❌ Error inserting/updating attendance:", err);
      return res.status(500).json({ error: "Database operation failed" });
    }

    res.json({ success: true, message: "✅ Attendance marked successfully!" });
  });
});



// ✅ API to setup attendance (Update NULL attendanceID)
app.post("/api/setup-attendance", (req, res) => {
  const { attendanceName, date, startTime, timeUp } = req.body;

  db.query(
    "INSERT INTO attendanceTable (attendanceName, date, startTime, timeUp) VALUES (?, ?, ?, ?)",
    [attendanceName, date, startTime, timeUp],
    (error, attendanceResult) => {
      if (error) {
        console.error("❌ Error saving attendance:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      const attendanceID = attendanceResult.insertId;

      // ✅ Step 1: Assign correct attendanceID to existing "Present" records for Students
      db.query(
        `UPDATE student_attendance 
         SET attendanceID = ? 
         WHERE attendanceID IS NULL AND status = 'Present'`,
        [attendanceID],
        (updateStudentError) => {
          if (updateStudentError) {
            console.error("❌ Error updating student attendance:", updateStudentError);
            return res.status(500).json({ message: "Error updating student attendance" });
          }

          // ✅ Step 1.2: Assign correct attendanceID to existing "Present" records for Teachers
          db.query(
            `UPDATE teacher_attendance 
             SET attendanceID = ? 
             WHERE attendanceID IS NULL AND status = 'Present'`,
            [attendanceID],
            (updateTeacherError) => {
              if (updateTeacherError) {
                console.error("❌ Error updating teacher attendance:", updateTeacherError);
                return res.status(500).json({ message: "Error updating teacher attendance" });
              }

              // ✅ Step 2: Insert missing students as "Absent"
              db.query(
                `INSERT INTO student_attendance (custom_studentID, attendanceID, status)
                 SELECT s.custom_studentID, ?, 'Absent'
                 FROM student s
                 WHERE NOT EXISTS (
                   SELECT 1 FROM student_attendance sa 
                   WHERE sa.custom_studentID = s.custom_studentID 
                   AND sa.attendanceID = ?
                 )
                 ORDER BY s.custom_studentID ASC`,
                [attendanceID, attendanceID],
                (insertAbsentStudentsError) => {
                  if (insertAbsentStudentsError) {
                    console.error("❌ Error inserting absent students:", insertAbsentStudentsError);
                    return res.status(500).json({ message: "Error inserting absent students" });
                  }

                  // ✅ Step 3: Insert missing teachers as "Absent"
                  db.query(
                    `INSERT INTO teacher_attendance (custom_teacherID, attendanceID, status)
                     SELECT t.custom_teacherID, ?, 'Absent'
                     FROM teacher t
                     WHERE NOT EXISTS (
                       SELECT 1 FROM teacher_attendance ta 
                       WHERE ta.custom_teacherID = t.custom_teacherID 
                       AND ta.attendanceID = ?
                     )
                     ORDER BY t.custom_teacherID ASC`,
                    [attendanceID, attendanceID],
                    (insertAbsentTeachersError) => {
                      if (insertAbsentTeachersError) {
                        console.error("❌ Error inserting absent teachers:", insertAbsentTeachersError);
                        return res.status(500).json({ message: "Error inserting absent teachers" });
                      }

                      // ✅ Step 4: Remove leftover NULL records (No duplicates)
                      db.query(
                        `DELETE FROM student_attendance WHERE attendanceID IS NULL`,
                        (deleteStudentNullError) => {
                          if (deleteStudentNullError) {
                            console.error("❌ Error deleting NULL student records:", deleteStudentNullError);
                            return res.status(500).json({ message: "Error deleting NULL student records" });
                          }

                          db.query(
                            `DELETE FROM teacher_attendance WHERE attendanceID IS NULL`,
                            (deleteTeacherNullError) => {
                              if (deleteTeacherNullError) {
                                console.error("❌ Error deleting NULL teacher records:", deleteTeacherNullError);
                                return res.status(500).json({ message: "Error deleting NULL teacher records" });
                              }

                              res.json({ message: "✅ Attendance Setup Successful!", attendanceID });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});




  
// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));