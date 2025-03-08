import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaSearch, FaCheck, FaTimes } from "react-icons/fa";

const AttendanceTable = () => {
  const [attendanceName, setAttendanceName] = useState("");
  const [startingPoint, setStartingPoint] = useState("");
  const [timeUp, setTimeUp] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendees, setAttendees] = useState([]);
  const [attendanceClosed, setAttendanceClosed] = useState(false);
  const [attendanceId, setAttendanceId] = useState(null);

  useEffect(() => {
    const checkAttendanceStatus = () => {
      if (!timeUp) return; // Ensure timeUp is set before checking
  
      const now = new Date();
      const [hours, minutes] = timeUp.split(":").map(Number);
  
      const closingTime = new Date();
      closingTime.setHours(hours, minutes, 0, 0); // Set hours & minutes
  
      if (now >= closingTime) {
        setAttendanceClosed(true);
        console.log("⏳ Attendance is now closed!");
      } else {
        setAttendanceClosed(false);
      }
    };
  
    checkAttendanceStatus();
    const interval = setInterval(checkAttendanceStatus, 10000); // Check every 10 sec
  
    return () => clearInterval(interval);
  }, [timeUp]);
  
  useEffect(() => {
    console.log("Attendance Closed:", attendanceClosed);
  }, [attendanceClosed]);

  const handleAddAttendee = () => {
    if (attendanceClosed) return;

    // Prevent adding multiple empty entries
    if (attendees.length > 0 && attendees[attendees.length - 1].id === "") {
      alert("⚠️ Please complete the current entry before adding a new one.");
      return;
    }

    setAttendees((prev) => [
      ...prev,
      { id: "", userType: "", status: "Absent", isValid: null },
    ]);
  };

  const handleIdChange = (index, value) => {
    if (attendanceClosed) return;
    setAttendees((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], id: value.toUpperCase(), isValid: null };
      return updated;
    });
  };

  const checkIdValidity = async (index) => {
    const idToCheck = attendees[index].id.trim();

    if (!idToCheck) {
      console.error("❌ Error: Attendance ID is required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/valid-ids",
        { id: idToCheck },
        { headers: { "Content-Type": "application/json" } }
      );

      setAttendees((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          isValid: response.data.valid,
          userType: response.data.user ? response.data.user.userType : "",
        };
        return updated;
      });

      console.log("✅ Response received:", response.data);
    } catch (error) {
      console.error("❌ Error checking ID:", error.response?.data || error.message);
    }
  };

  const markPresent = async (index) => {
    const attendee = attendees[index];
  
    if (!attendee.id) {
      alert("Please enter an ID before marking attendance.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/mark-attendance",
        {
          id: attendee.id,
          userType: attendee.userType,
          status: "Present",
          attendanceId: attendanceId || null, // Set null if attendance is not yet set up
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.status === 200) {
        console.log(`✅ Attendance marked for ID: ${attendee.id}`);
  
        setAttendees((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], status: "Present" };
          return updated;
        });
  
        // If attendanceId was null, update it from response
        if (!attendanceId && response.data.attendanceId) {
          setAttendanceId(response.data.attendanceId);
          console.log("📌 Attendance ID updated:", response.data.attendanceId);
        }
      } else {
        console.error("❌ Error updating attendance:", response.data);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
    }
  };
  
  const handleSubmit = async () => {
    console.log("📌 Submitted start time:", startingPoint); // Debug log

    if (!attendanceName || !startingPoint || !timeUp) {
        alert("⚠️ Please fill in all fields before setting up attendance.");
        return;
    }
    
    try {
        const { data } = await axios.post("http://localhost:5000/api/setup-attendance", {
            attendanceName,
            date,
            startTime: startingPoint, 
            timeUp,
            attendees,
        });

        console.log("✅ Attendance Setup Successful!", data);
        setAttendanceId(data.attendanceId);
        setAttendanceClosed(false);
    } catch (error) {
        console.error("❌ API Error:", error);
        alert("❌ Failed to setup attendance.");
    }
};



  return (
    <div className="attendance-container">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        📋 Attendance Form
      </motion.h2>
      <input
        type="text"
        placeholder="Attendance Name"
        value={attendanceName}
        onChange={(e) => setAttendanceName(e.target.value)}
      />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={startingPoint} onChange={(e) => setStartingPoint(e.target.value)} />
      <input type="time" value={timeUp} onChange={(e) => setTimeUp(e.target.value)} />
      <button onClick={handleAddAttendee} disabled={attendanceClosed}>
        ➕ Add Attendee
      </button>

      {attendees.map((attendee, index) => (
        <div key={index} className="attendee-row">
          <input
            type="text"
            value={attendee.id}
            onChange={(e) => handleIdChange(index, e.target.value)}
            disabled={attendanceClosed}
          />
          <button onClick={() => checkIdValidity(index)}>
            <FaSearch />
          </button>
          {attendee.isValid === true ? <FaCheck color="green" /> : attendee.isValid === false ? <FaTimes color="red" /> : null}
          <button onClick={() => markPresent(index)} disabled={attendanceClosed}>
            {attendee.status === "Present" ? "✅ Present" : "Mark Present"}
          </button>
        </div>
      ))}
      <button onClick={handleSubmit} disabled={attendanceClosed}>
        Submit Attendance ✅
      </button>
    </div>
  );
};

export default AttendanceTable;
