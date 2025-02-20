import React, { useState } from "react";
import axios from "axios";

const AddRecords = () => {
  const [recordType, setRecordType] = useState("student"); // Default: Student
  const [formData, setFormData] = useState({
    studentID: "",
    teacherID: "",
    name: "",
    email: "",
    phone: "",
    course: "",
    subject: "",
    image: "",
    joining_date: "",
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

    try {
      const response = await axios.post(url, formData);
      alert(response.data.message);
      setFormData({
        studentID: "",
        teacherID: "",
        name: "",
        email: "",
        phone: "",
        course: "",
        subject: "",
        image: "",
        joining_date: "",
        fingerprint_template: "",
      });
    } catch (error) {
      console.error("Error adding record:", error);
      alert("Failed to add record.");
    }
  };

  return (
    <div className="add-record-container">
      <h2>Add {recordType === "student" ? "Student" : "Teacher"} Record</h2>

      {/* Select Record Type */}
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

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {recordType === "student" ? (
          <>
            <label htmlFor="studentID">Student ID:</label>
            <input
              type="text"
              id="studentID"
              name="studentID"
              value={formData.studentID}
              onChange={handleChange}
              required
            />

            <label htmlFor="course">Course:</label>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </>
        ) : (
          <>
            <label htmlFor="teacherID">Teacher ID:</label>
            <input
              type="text"
              id="teacherID"
              name="teacherID"
              value={formData.teacherID}
              onChange={handleChange}
              required
            />

            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <label htmlFor="joining_date">Joining Date:</label>
            <input
              type="date"
              id="joining_date"
              name="joining_date"
              value={formData.joining_date}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Common Fields */}
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="image">Image URL:</label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
        />

        <label htmlFor="fingerprint_template">Fingerprint Data:</label>
        <input
          type="text"
          id="fingerprint_template"
          name="fingerprint_template"
          value={formData.fingerprint_template}
          onChange={handleChange}
          required
        />

        <button type="submit">Add {recordType === "student" ? "Student" : "Teacher"}</button>
      </form>
    </div>
  );
};

export default AddRecords;
