import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const ViewAttendance = () => {
    const { id } = useParams();
    const [attendance, setAttendance] = useState([]);  // ✅ Single state for attendance data
    const [attendanceType, setAttendanceType] = useState("");
    const [attendanceClosed, setAttendanceClosed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/attendanceDetails/${id}`)
            .then(response => {
                setAttendance(response.data.attendanceData);
                setAttendanceType(response.data.attendanceType);
                setAttendanceClosed(response.data.attendanceClosed);
            })
            .catch(error => console.error("Error fetching attendance:", error));
    }, [id]);

    // ✅ Sort directly in the rendering step instead of modifying state
    const sortedAttendance = [...attendance].sort((a, b) => {
        return a.custom_studentID.localeCompare(b.custom_studentID, undefined, { numeric: true });
    });

    const handleEdit = (index) => {
        if (attendanceClosed) {
            alert("Editing is not allowed after attendance is closed.");
            return;
        }

        const updatedStatus = prompt("Enter new status (Present/Absent):");
        if (!updatedStatus || !["Present", "Absent"].includes(updatedStatus)) {
            alert("Invalid status!");
            return;
        }

        const record = attendance[index];
        const id = record.custom_studentID || record.custom_teacherID;
        const attendanceId = record.attendanceID;

        if (!id || !attendanceId) {
            console.error("❌ Missing ID or AttendanceID:", record);
            alert("Error: Missing student/teacher ID or attendance ID.");
            return;
        }

        console.log("🔍 Sending Data:", { id, status: updatedStatus, attendanceId, attendanceType });

        axios
            .put("http://localhost:5000/api/update-attendance", {
                id,
                status: updatedStatus,  
                attendanceId,
                attendanceType,
            })
            .then(() => {
                setAttendance((prev) => {
                    const updatedList = [...prev];
                    updatedList[index] = { ...record, status: updatedStatus };
                    return updatedList;
                });
                alert("✅ Attendance updated successfully!");
            })
            .catch((error) => {
                console.error("❌ Error updating attendance:", error.response?.data || error);
            });
    };

    return (
        <div className="viewAttendance-container">
            <button className="viewAttendance-backButton" onClick={() => navigate(-1)}>
                <FaArrowLeft className="viewAttendance-backIcon" /> Back
            </button>
            <h2 className="viewAttendance-title">Attendance Details</h2>
            <table className="viewAttendance-table">
                <thead className="viewAttendance-thead">
                    <tr className="viewAttendance-headerRow">
                        <th className="viewAttendance-header">
                            {attendanceType === "student" ? "Student ID" : "Teacher ID"}
                        </th>
                        <th className="viewAttendance-header">Name</th>
                        <th className="viewAttendance-header">Status</th>
                        <th className="viewAttendance-header">Actions</th>
                    </tr>
                </thead>
                <tbody className="viewAttendance-tbody">
                    {sortedAttendance.map((record, index) => (
                        <tr key={index} className="viewAttendance-row">
                            <td className="viewAttendance-cell">
                                {record.custom_studentID || record.custom_teacherID}
                            </td>
                            <td className="viewAttendance-cell">{record.name}</td>
                            <td className="viewAttendance-cell">{record.status}</td>
                            <td className="viewAttendance-cell">
                                <button onClick={() => handleEdit(index)}>✏️ Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewAttendance;
