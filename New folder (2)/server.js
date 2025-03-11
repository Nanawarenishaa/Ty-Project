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
  const { attendanceName, date, startTime, timeUp, attendanceType } = req.body;

  db.beginTransaction((transactionErr) => {
    if (transactionErr) {
      console.error("❌ Transaction error:", transactionErr);
      return res.status(500).json({ message: "Transaction Error" });
    }

    // ✅ Step 1: Insert Attendance Session
    db.query(
      "INSERT INTO attendanceTable (attendanceName, date, startTime, timeUp, attendanceType) VALUES (?, ?, ?, ?, ?)",
      [attendanceName, date, startTime, timeUp, attendanceType],
      (error, attendanceResult) => {
        if (error) {
          return rollbackTransaction(res, "Error saving attendance", error);
        }

        const attendanceID = attendanceResult.insertId;

        // ✅ Step 2: Update Attendance ID for Present Students
        db.query(
          `UPDATE student_attendance SET attendanceID = ? WHERE attendanceID IS NULL AND status = 'Present'`,
          [attendanceID],
          (updateStudentError) => {
            if (updateStudentError) {
              return rollbackTransaction(res, "Error updating student attendance", updateStudentError);
            }

            // ✅ Step 3: Update Attendance ID for Present Teachers
            db.query(
              `UPDATE teacher_attendance SET attendanceID = ? WHERE attendanceID IS NULL AND status = 'Present'`,
              [attendanceID],
              (updateTeacherError) => {
                if (updateTeacherError) {
                  return rollbackTransaction(res, "Error updating teacher attendance", updateTeacherError);
                }

                // ✅ Step 4: Insert Absent Students
                if (attendanceType === "Student") {
                  db.query(
                    `INSERT INTO student_attendance (custom_studentID, attendanceID, status)
                     SELECT s.custom_studentID, ?, 'Absent'
                     FROM student s
                     WHERE NOT EXISTS (
                       SELECT 1 FROM student_attendance sa 
                       WHERE sa.custom_studentID = s.custom_studentID 
                       AND sa.attendanceID = ?
                     )`,
                    [attendanceID, attendanceID],
                    (insertAbsentStudentsError) => {
                      if (insertAbsentStudentsError) {
                        return rollbackTransaction(res, "Error inserting absent students", insertAbsentStudentsError);
                      }

                      commitTransaction(res, attendanceID);
                    }
                  );
                } 
                // ✅ Step 5: Insert Absent Teachers
                else if (attendanceType === "Teacher") {
                  db.query(
                    `INSERT INTO teacher_attendance (custom_teacherID, attendanceID, status)
                     SELECT t.custom_teacherID, ?, 'Absent'
                     FROM teacher t
                     WHERE NOT EXISTS (
                       SELECT 1 FROM teacher_attendance ta 
                       WHERE ta.custom_teacherID = t.custom_teacherID 
                       AND ta.attendanceID = ?
                     )`,
                    [attendanceID, attendanceID],
                    (insertAbsentTeachersError) => {
                      if (insertAbsentTeachersError) {
                        return rollbackTransaction(res, "Error inserting absent teachers", insertAbsentTeachersError);
                      }

                      commitTransaction(res, attendanceID);
                    }
                  );
                } 
                else {
                  // ✅ If attendance type is unknown, just commit
                  commitTransaction(res, attendanceID);
                }
              }
            );
          }
        );
      }
    );
  });
});

// 🔄 Utility function to commit transaction
function commitTransaction(res, attendanceID) {
  db.commit((commitErr) => {
    if (commitErr) {
      return rollbackTransaction(res, "Error committing transaction", commitErr);
    }
    res.json({ message: "✅ Attendance Setup Successful!", attendanceID });
  });
}


app.get("/api/attendance", (req, res) => {
  const query = "SELECT * FROM attendanceTable";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
app.delete("/api/attendance/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM attendanceTable WHERE attendanceID = ?";
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.json({ message: "Attendance record deleted successfully" });
  });
});
app.get("/api/attendance/:id", (req, res) => {
  const { id } = req.params;

  // Get the attendance type (student/teacher)
  const typeQuery = "SELECT attendanceType FROM attendanceTable WHERE attendanceID = ?";
  
  db.query(typeQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    const attendanceType = result[0].attendanceType;

    // Select the correct table
    let attendanceQuery = "";
    if (attendanceType === "student") {
      attendanceQuery = `
        SELECT s.name, sa.custom_studentID, sa.status 
        FROM student_attendance sa
        JOIN student s ON sa.custom_studentID = s.custom_studentID
        WHERE sa.attendanceID = ?
      `;
    } else {
      attendanceQuery = `
        SELECT t.name, ta.custom_teacherID, ta.status 
        FROM teacher_attendance ta
        JOIN teacher t ON ta.custom_teacherID = t.custom_teacherID
        WHERE ta.attendanceID = ?
      `;
    }

    db.query(attendanceQuery, [id], (err, attendanceResult) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json(attendanceResult);
    });
  });
});
app.put("/api/update-attendance", (req, res) => {
  const { id, status, attendanceId, attendanceType } = req.body;

  console.log("🔍 Received Data:", req.body);

  if (!id || !status || !attendanceId || !attendanceType) {
      return res.status(400).json({ error: "Missing required fields!" });
  }

  const parsedAttendanceId = parseInt(attendanceId, 10);
  if (isNaN(parsedAttendanceId)) {
      return res.status(400).json({ error: "Invalid attendanceId format" });
  }

  const tableName = attendanceType === "student" ? "student_attendance" : "teacher_attendance";
  const idColumn = attendanceType === "student" ? "custom_studentID" : "custom_teacherID";

  const query = `UPDATE ${tableName} SET status = ? WHERE ${idColumn} = ? AND attendanceID = ?`;

  db.query(query, [status, id, parsedAttendanceId], (err, result) => {
      if (err) {
          console.error("❌ MySQL Error:", err);
          return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "✅ Attendance updated successfully!" });
  });
});

app.get("/attendanceDetails/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Fetching attendance details for ID: ${id}`); // Debug log

  // First, fetch the attendanceType
  db.query(
      "SELECT attendanceType FROM attendanceTable WHERE attendanceID = ?", 
      [id],
      (err, attendanceRecord) => {
          if (err) {
              console.error("Error fetching attendance type:", err);
              return res.status(500).json({ message: "Internal server error" });
          }

          if (attendanceRecord.length === 0) {
              console.log(`Attendance record not found for ID: ${id}`); // Debug log
              return res.status(404).json({ message: "Attendance record not found" });
          }

          const attendanceType = attendanceRecord[0].attendanceType;
          console.log("Attendance Type:", attendanceType); // Debug log

          let query = "";
          if (attendanceType === "student") {
              query = `
                  SELECT sa.custom_studentID, sa.attendanceID, s.name, sa.status
                  FROM student_attendance sa
                  JOIN student s ON sa.custom_studentID = s.custom_studentID
                  WHERE sa.attendanceID = ?`;
          } else {
              query = `
                  SELECT ta.custom_teacherID, ta.attendanceID, t.name, ta.status
                  FROM teacher_attendance ta
                  JOIN teacher t ON ta.custom_teacherID = t.custom_teacherID
                  WHERE ta.attendanceID = ?`;
          }

          // Fetch attendance details
          db.query(query, [id], (err, attendanceData) => {
              if (err) {
                  console.error("Error fetching attendance details:", err);
                  return res.status(500).json({ message: "Internal server error" });
              }

            
              res.json({ attendanceType, attendanceData });
          });
      }
  );
});

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nanawarenisha909@gmail.com", // Your email
    pass: "nisha@317", // Your email password or app password
  },
});

// Function to Calculate Attendance and Send Warnings
const checkAndNotifyAttendance = () => {
  const attendanceThreshold = 75; // Set threshold (e.g., 75%)

  // Query for students
  db.query("SELECT studentID, custom_studentID, email FROM student", (err, students) => {
    if (err) throw err;

    students.forEach((student) => {
      db.query(
        `SELECT COUNT(*) AS total, 
         SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS present
         FROM student_attendance WHERE custom_studentID = ?`,
        [student.custom_studentID],
        (err, result) => {
          if (err) throw err;

          const totalSessions = result[0].total || 1; // Prevent division by zero
          const presentSessions = result[0].present || 0;
          const attendancePercentage = (presentSessions / totalSessions) * 100;

          if (attendancePercentage < attendanceThreshold) {
            sendEmail(student.email, student.custom_studentID, attendancePercentage);
          }
        }
      );
    });
  });

  // Query for teachers
  db.query("SELECT ID, custom_teacherID, email FROM teacher", (err, teachers) => {
    if (err) throw err;

    teachers.forEach((teacher) => {
      db.query(
        `SELECT COUNT(*) AS total, 
         SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS present
         FROM teacher_attendance WHERE custom_teacherID = ?`,
        [teacher.custom_teacherID],
        (err, result) => {
          if (err) throw err;

          const totalSessions = result[0].total || 1;
          const presentSessions = result[0].present || 0;
          const attendancePercentage = (presentSessions / totalSessions) * 100;

          if (attendancePercentage < attendanceThreshold) {
            sendEmail(teacher.email, teacher.custom_teacherID, attendancePercentage);
          }
        }
      );
    });
  });
};

// Function to Send Email
const sendEmail = (email, userID, percentage) => {
  const mailOptions = {
    from: "nanawarenisha909@gmail.com",
    to: email,
    subject: "Attendance Warning",
    text: `Dear ${userID},\n\nYour attendance is currently at ${percentage.toFixed(2)}%, which is below the required threshold. Please ensure regular attendance to avoid consequences.\n\nBest regards,\nAdmin`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log(`Warning email sent to ${email}`);
    }
  });
};

// Run Attendance Check Periodically (e.g., Every Day at 8 AM)
setInterval(checkAndNotifyAttendance, 24 * 60 * 60 * 1000); // Run every 24 hours
// API to get total student and teacher count
app.get("/api/totalCounts", (req, res) => {
  const studentQuery = "SELECT COUNT(*) AS totalStudents FROM student";
  const teacherQuery = "SELECT COUNT(*) AS totalTeachers FROM teacher";

  db.query(studentQuery, (err, studentResult) => {
    if (err) return res.status(500).send(err);
    db.query(teacherQuery, (err, teacherResult) => {
      if (err) return res.status(500).send(err);
      res.json({
        totalStudents: studentResult[0].totalStudents,
        totalTeachers: teacherResult[0].totalTeachers,
      });
    });
  });
});

// API to get student or teacher details with attendance percentage
app.get("/api/getDetails/:type/:months", (req, res) => {
  const { type, months } = req.params;
  const table = type === "student" ? "student_attendance" : "teacher_attendance";
  const idField = type === "student" ? "custom_studentID" : "custom_teacherID";
  const nameTable = type === "student" ? "student" : "teacher";
  
  const query = `
  SELECT s.${idField} AS id, s.name, 
    ROUND((SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) / COUNT(a.status)) * 100, 2) AS attendancePercentage
  FROM ${nameTable} s
  JOIN ${table} a ON s.${idField} = a.${idField}
  JOIN attendanceTable at ON a.attendanceID = at.attendanceID
  WHERE STR_TO_DATE(at.date, '%Y-%m-%d') >= DATE_SUB(NOW(), INTERVAL ? MONTH)
  GROUP BY s.${idField}, s.name
`;

db.query(query, [months], (err, results) => {
  if (err) return res.status(500).send(err);
  res.json(results);
});
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));