import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaSearch, FaCheck, FaTimes } from "react-icons/fa";

const AttendanceTable = () => {
  const [attendanceName, setAttendanceName] = useState("");
  const [startingPoint, setStartingPoint] = useState("");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendees, setAttendees] = useState([]);
  const [attendanceClosed, setAttendanceClosed] = useState(false);
  const [attendanceId, setAttendanceId] = useState(null);



  
  

  useEffect(() => {
    console.log("Attendance Closed:", attendanceClosed);
  }, [attendanceClosed]);

  const handleAddAttendee = () => {
    if (attendanceClosed) return;
    if (attendees.length > 0 && attendees[attendees.length - 1].id === "") {
      alert("⚠️ Please complete the current entry before adding a new one.");
      return;
    }
    setAttendees((prev) => [...prev, { id: "", userType: "", status: "Absent", isValid: null }]);
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
        console.error("❌ Error: Attendance ID is required. ID is empty or undefined.");
        return;
    }

    try {
        const payload = { id: idToCheck };
        console.log("📤 Sending payload to server:", JSON.stringify(payload));

        const response = await axios.post("http://localhost:5000/api/valid-ids", payload, {
            headers: { "Content-Type": "application/json" }
        });

        setAttendees((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            isValid: response.data.valid, // Use 'valid' instead of 'isValid'
            userType: response.data.user ? response.data.user.userType : "", // Store userType if needed
          };
          return updated;
        });
        

        console.log("✅ Response received:", response.data);
    } catch (error) {
        console.error("❌ Error checking ID:", error.response?.data || error.message);
    }
};


  
  

const markPresent = async (index) => {
  const attendee = attendees[index]; // Get the specific attendee
  if (!attendee.id) {
    alert("Please enter an ID before marking attendance.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/mark-attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: attendee.id,
        userType: attendee.userType,
        status: "Present",
        attendanceId, // Ensure attendanceId is included
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ Attendance marked for ID: ${attendee.id}`);
      
      // ✅ Update the UI to show "Present"
      setAttendees((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], status: "Present" };
        return updated;
      });

    } else {
      console.error("❌ Error updating attendance:", data);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
  }
};




  const handleSubmit = async () => {
    if (!attendanceName || !startingPoint) {
      alert("⚠️ Please fill in all fields before setting up attendance.");
      return;
    }
    try {
      const { data } = await axios.post("http://localhost:5000/api/setup-attendance", {
        attendanceName,
        date,
        startingPoint,
        attendees: [],
      });
  
      console.log("✅ Attendance Setup Successful!", data); // Log response to use it
      setAttendanceId(data.attendanceId); 
      setAttendanceClosed(false); // Open for marking attendance
    } catch (error) {
      console.error("❌ API Error:", error);
      alert("❌ Failed to setup attendance.");
    }
  };
  

  return (
    <div className="attendance-container">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>📋 Attendance Form</motion.h2>
      <input type="text" placeholder="Attendance Name" value={attendanceName} onChange={(e) => setAttendanceName(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={startingPoint} onChange={(e) => setStartingPoint(e.target.value)} />
      <input type="time"  />
      <button onClick={handleAddAttendee} disabled={attendanceClosed}>➕ Add Attendee</button>

      {attendees.map((attendee, index) => (
        <div key={index} className="attendee-row">
         <input 
  type="text" 
  value={attendee.id} 
  onChange={(e) => handleIdChange(index, e.target.value)}
  disabled={attendanceClosed} // Only disable when attendance is closed, not when "Present" is clicked
/>

    
          <button onClick={() => checkIdValidity(index)}><FaSearch /></button>
            {attendee.isValid === true ? <FaCheck color="green" /> : attendee.isValid === false ? <FaTimes color="red" /> : null}
          <button 
      onClick={() => markPresent(index)} 
     
    >
      {attendee.status === "Present" ? "✅ Present" : "Mark Present"}
    </button>

        </div>
      ))}
      <button onClick={handleSubmit} >Submit Attendance ✅</button>
    </div>
  );
};

export default AttendanceTable;