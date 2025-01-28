import React, { useState } from "react";
import Input from "../Components/Input";
import { getInitialData, addRecord } from "../Data/Data";

const AddStudentTeacher = () => {
  const [formData, setFormData] = useState(getInitialData());

  const [newRecord, setNewRecord] = useState({
    name: "",
    role: "student",
    rollNumber: "",
    class: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    department: "",
    gender: "male",
    qualification: "",
    joiningDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newRecord.name || !newRecord.email) {
      alert("Please fill in all required fields.");
      return;
    }

    const record = { ...newRecord, id: Date.now() };

    // Add the new record to the Data.js collection
    addRecord(record);

    // Update local state to re-render the component with new data
    setFormData(getInitialData()); // Refresh the formData state from the updated initialData

    // Reset form
    setNewRecord({
      name: "",
      role: "student",
      rollNumber: "",
      class: "",
      email: "",
      phone: "",
      address: "",
      dob: "",
      department: "",
      gender: "male",
      qualification: "",
      joiningDate: "",
    });

    alert("Record added successfully!");
  };

  return (
    <div className="form-container">
      <h2 className="form-header">Add Student/Teacher Record</h2>
      <form onSubmit={handleSubmit} className="AddRecordform">
        <div>
          <label className="form-label">Name</label>
          <Input
            type="text"
            name="name"
            value={newRecord.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">Role</label>
          <select
            name="role"
            value={newRecord.role}
            onChange={handleChange}
            className="form-select"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {newRecord.role === "student" && (
          <>
            <div>
              <label className="form-label">Roll Number</label>
              <Input
                type="text"
                name="rollNumber"
                value={newRecord.rollNumber}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Class</label>
              <Input
                type="text"
                name="class"
                value={newRecord.class}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </>
        )}

        {newRecord.role === "teacher" && (
          <>
            <div>
              <label className="form-label">Qualification</label>
              <Input
                type="text"
                name="qualification"
                value={newRecord.qualification}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Joining Date</label>
              <Input
                type="date"
                name="joiningDate"
                value={newRecord.joiningDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </>
        )}

        <div>
          <label className="form-label">Email</label>
          <Input
            type="email"
            name="email"
            value={newRecord.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">Phone</label>
          <Input
            type="tel"
            name="phone"
            value={newRecord.phone}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Address</label>
          <textarea
            name="address"
            value={newRecord.address}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
          />
        </div>
        <div>
          <label className="form-label">Date of Birth</label>
          <Input
            type="date"
            name="dob"
            value={newRecord.dob}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Department</label>
          <Input
            type="text"
            name="department"
            value={newRecord.department}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Gender</label>
          <select
            name="gender"
            value={newRecord.gender}
            onChange={handleChange}
            className="form-select"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      <div className="record-list">
        <h3>Existing Records:</h3>
        <ul>
          {formData.map((record) => (
            <li key={record.id}>
              {record.name} - {record.role} ({record.email})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddStudentTeacher;
