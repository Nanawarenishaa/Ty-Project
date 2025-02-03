import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AttendancePage = () => {
  const navigate = useNavigate();
  const [timeSettings, setTimeSettings] = useState({
    checkIn: "",
    checkOut: "",
  });

  const [isTimeUp, setIsTimeUp] = useState(false);
  const [userId, setUserId] = useState(""); // To handle user ID input

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
    setUserId((prevUserId) => prevUserId + num);
  };

  const handleClearInput = () => {
    setUserId("");
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

      <div className="card">
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            className="input-field"
          />
        </div>
        <div>
          <label>Role (Student/Teacher)</label>
          <input
            type="text"
            name="role"
            placeholder="Enter Role"
            className="input-field"
          />
        </div>
        <div>
          <label>Date</label>
          <input
            type="date"
            name="date"
            className="input-field"
          />
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
              value={userId} // Displaying the user input
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
            <button onClick={handleClearInput} className="clear-button">
              Clear
            </button>
          </div>

          <div>
            <button className="primary-button">
              Scan Fingerprint
            </button>
          </div>

          <div className="fingerprint-status"></div>
        </div>
      )}

      <div className="button-group">
        <button className="primary-button">Save Attendance</button>
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
