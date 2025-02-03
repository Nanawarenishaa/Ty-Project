import React from "react";
import Input from "../Components/Input";

const AddStudentTeacher = () => {
 
 
  return (
    <div className="form-container">
      <h2 className="form-header">Add Student/Teacher Record</h2>
      <form className="AddRecordform">
        <div>
          <label className="form-label">Name</label>
          <Input
            type="text"
            name="name"
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">Role</label>
          <select
            name="role"
            className="form-select"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
            <div>
              <label className="form-label">Roll Number</label>
              <Input
                type="text"
                name="rollNumber"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Class</label>
              <Input
                type="text"
                name="class"
                className="form-input"
              />
            </div>
        

       
            <div>
              <label className="form-label">Qualification</label>
              <Input
                type="text"
                name="qualification"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Joining Date</label>
              <Input
                type="date"
                name="joiningDate"
                className="form-input"
              />
            </div>
      

        <div>
          <label className="form-label">Email</label>
          <Input
            type="email"
            name="email"
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">Phone</label>
          <Input
            type="tel"
            name="phone"
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Address</label>
          <textarea
            name="address"
            className="form-textarea"
            rows="3"
          />
        </div>
        <div>
          <label className="form-label">Date of Birth</label>
          <Input
            type="date"
            name="dob"
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Department</label>
          <Input
            type="text"
            name="department"
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Gender</label>
          <select
            name="gender"
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
        
      </div>
    </div>
  );
};

export default AddStudentTeacher;
