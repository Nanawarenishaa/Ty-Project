import React, { useState, useEffect } from "react";
import { getInitialData, updateRecord } from "../Data/Data";
import { useNavigate } from "react-router-dom";

const AttendancePage = ({ saveAttendance }) => {
  const [attendanceData, setAttendanceData] = useState({
    id: "",
    date: "",
    day: "",
  });

  const [timeSettings, setTimeSettings] = useState({
    checkIn: "",
    checkOut: "",
  });

  const [isTimeUp, setIsTimeUp] = useState(false);
  const [fingerprintStatus, setFingerprintStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeSettings.checkIn && timeSettings.checkOut) {
        const currentTime = new Date().toLocaleTimeString("en-US", {
          hour12: false,
        });
        if (currentTime >= timeSettings.checkOut) {
          setIsTimeUp(true);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeSettings]);

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTimeSettings({ ...timeSettings, [name]: value });
  };

  const handleNumberInput = (num) => {
    setAttendanceData((prev) => ({ ...prev, id: prev.id + num }));
  };

  const handleClearInput = () => {
    setAttendanceData({ ...attendanceData, id: "" });
  };

  const handleFingerprintScan = () => {
    const records = getInitialData();
    const record = records.find((rec) => rec.id === parseInt(attendanceData.id));

    if (!record) {
      alert("Invalid ID. Record not found.");
      return;
    }

    const isFingerprintValid = Math.random() > 0.3;
    if (isFingerprintValid) {
      const updatedRecord = { ...record, Attendance_Status: "Present" };
      updateRecord(updatedRecord);
      setFingerprintStatus("Attendance recorded successfully!");
      setAttendanceData({ id: "", date: "", day: "" });
    } else {
      setFingerprintStatus("Biometric mismatch. Try again.");
    }
  };

  const handleSave = () => {
    if (!attendanceData.id || !attendanceData.date) {
      alert("Please fill in all required fields.");
      return;
    }
    saveAttendance(attendanceData);
    alert("Attendance saved successfully!");
    navigate("/attendance-list");
  };

  return (
    <div className="attendance-container">
      <h1 className="title">Manage Attendance</h1>

      <div className="card">
        <h2 className="subtitle">Set Attendance Time</h2>
        <div className="time-settings">
          <div>
            <label>Start Time</label>
            <input
              type="time"
              name="checkIn"
              value={timeSettings.checkIn}
              onChange={handleTimeChange}
              className="input-field"
            />
          </div>
          <div>
            <label>End Time</label>
            <input
              type="time"
              name="checkOut"
              value={timeSettings.checkOut}
              onChange={handleTimeChange}
              className="input-field"
            />
          </div>
          
        </div>
        
      </div>
        
      {isTimeUp ? (
        <div className="time-up-alert">
          <strong>Times Up! Attendance period is over.</strong>
        </div>
      ) : (
        <div className="card">
          <h2 className="subtitle">Enter ID for Attendance</h2>
          <div className="input-group">
            <label>User ID</label>
            <input
              type="text"
              value={attendanceData.id}
              readOnly
              className="input-field"
            />
          </div>

          <div className="keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className="keypad-button"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClearInput}
              className="clear-button"
            >
              Clear
            </button>
          </div>

          <div>
            <button
              onClick={handleFingerprintScan}
              className="primary-button"
            >
              Scan Fingerprint
            </button>
          </div>

          {fingerprintStatus && (
            <div className="fingerprint-status">
              {fingerprintStatus}
            </div>
          )}
        </div>
      )}
      
      <div className="button-group">
        <button
          onClick={handleSave}
          className="primary-button"
        >
          Save Attendance
        </button>
        <button
          onClick={() => navigate("/attendance-list")}
          className="secondary-button"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
