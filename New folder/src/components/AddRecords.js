import React, { useState } from "react";
import axios from "axios";

const AddRecords = () => {
  const [recordType, setRecordType] = useState("student"); // Default selection

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    class: "", // ✅ Matches the student table
    joining_date: "", // ✅ Matches the teacher table
    fingerprint_template: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      recordType === "student"
        ? "http://localhost:5000/add-student"
        : "http://localhost:5000/add-teacher";

    const requestData =
      recordType === "student"
        ? {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            class: formData.class, // ✅ Matches database field
            course: formData.course,
            fingerprint_template: formData.fingerprint_template || null,
          }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            course: formData.course,
            joining_date: formData.joining_date, // ✅ Matches database field
            fingerprint_template: formData.fingerprint_template || null,
          };

    try {
      const response = await axios.post(url, requestData);
      alert(response.data.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        course: "",
        class: "",
        joining_date: "",
        fingerprint_template: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add record.");
    }
  };

  return (
    <div className="add-record-container">
      <h2>Add {recordType === "student" ? "Student" : "Teacher"} Record</h2>

      <div>
        <label>
          <input
            type="radio"
            name="recordType"
            value="student"
            checked={recordType === "student"}
            onChange={() => setRecordType("student")}
          />
          Student
        </label>
        <label>
          <input
            type="radio"
            name="recordType"
            value="teacher"
            checked={recordType === "teacher"}
            onChange={() => setRecordType("teacher")}
          />
          Teacher
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

        <label htmlFor="phone">Phone:</label>
        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />

        <label htmlFor="course">Course:</label>
        <input type="text" id="course" name="course" value={formData.course} onChange={handleChange} required />

        {recordType === "student" && (
          <>
            <label htmlFor="class">Class:</label>
            <input type="text" id="class" name="class" value={formData.class || ""} onChange={handleChange} required />
          </>
        )}

        {recordType === "teacher" && (
          <>
            <label htmlFor="joining_date">Joining Date:</label>
            <input type="date" id="joining_date" name="joining_date" value={formData.joining_date || ""} onChange={handleChange} required />
          </>
        )}

        <label htmlFor="fingerprint_template">Fingerprint Data:</label>
        <textarea id="fingerprint_template" name="fingerprint_template" value={formData.fingerprint_template || ""} onChange={handleChange} />

        <button type="submit">Add {recordType === "student" ? "Student" : "Teacher"}</button>
      </form>
    </div>
  );
};

export default AddRecords;
