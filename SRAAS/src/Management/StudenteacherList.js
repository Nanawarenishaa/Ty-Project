import React, { useState } from "react";
import Table from "../Components/Table";
import Button from "../Components/Button";
import Input from "../Components/Input"; // Import Input component
import { getInitialData, deleteRecord, updateRecord } from "../Data/Data";

const StudentTeacherList = () => {
  const [records, setRecords] = useState(getInitialData());
  const [editingRecord, setEditingRecord] = useState(null); // Track the record being edited

  const handleDelete = (id) => {
    const updatedRecords = records.filter((record) => record.id !== id);
    setRecords(updatedRecords);
    deleteRecord(id);
    alert("Record deleted successfully!");
  };

  // Handle edit (open form with pre-filled data)
  const handleEdit = (record) => {
    setEditingRecord(record);
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingRecord({ ...editingRecord, [name]: value });
  };

  // Handle update record submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateRecord(editingRecord);
    setRecords(getInitialData()); // Refresh records
    setEditingRecord(null); // Close form
    alert("Record updated successfully!");
  };


  const studentColumns = ["ID", "Name", "Role", "Actions", "Roll Number"];
  const teacherColumns = ["ID", "Name", "Role", "Actions", "Qualification", "Joining Date"];

  const studentTableData = records
    .filter((r) => r.role === "student")
    .map((record) => [
      record.id,
      record.name,
      record.role,
      <div key={record.id} className="flex gap-2">
        <Button text={"Edit"} onClick={() => handleEdit(record)} />
        <Button text={"Delete"} variant="danger" onClick={() => handleDelete(record.id)} />
      </div>,
      record.rollNumber,
    ]);

  const teacherTableData = records
    .filter((r) => r.role === "teacher")
    .map((record) => [
      record.id,
      record.name,
      record.role,
      <div key={record.id} className="flex gap-2">
        <Button text={"Edit"} onClick={() => handleEdit(record)} />
        <Button text={"Delete"} variant="danger" onClick={() => handleDelete(record.id)} />
      </div>,
      record.qualification,
      record.joiningDate,
    ]);

  return (
    <div className="page-container">
      <h1 className="page-heading">Student/Teacher List</h1>

      {/* Student Table */}
      {studentTableData.length > 0 && (
        <div className="table-container">
          <h2>Students</h2>
          <Table columns={studentColumns} data={studentTableData} />
        </div>
      )}

      {/* Teacher Table */}
      {teacherTableData.length > 0 && (
        <div className="table-container">
          <h2>Teachers</h2>
          <Table columns={teacherColumns} data={teacherTableData} />
        </div>
      )}

        {/* Edit Form (Only visible when editing) */}
        {editingRecord && (
        <div className="edit-form">
          <h2>Edit Record</h2>
          <form onSubmit={handleSubmit}>
            <Input type="text" name="name" value={editingRecord.name} onChange={handleChange} required />
            <Input type="email" name="email" value={editingRecord.email} onChange={handleChange} required />
            {editingRecord.role === "student" && (
              <Input type="text" name="rollNumber" value={editingRecord.rollNumber} onChange={handleChange} />
            )}
            {editingRecord.role === "teacher" && (
              <>
                <Input type="text" name="qualification" value={editingRecord.qualification} onChange={handleChange} />
                <Input type="date" name="joiningDate" value={editingRecord.joiningDate} onChange={handleChange} />
              </>
            )}
            <button type="submit">Update</button>
            <button type="button" onClick={() => setEditingRecord(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentTeacherList;
