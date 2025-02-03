// src/pages/Reports.js
import React from "react";
import Button from "../components/common/Button";

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-xl font-bold mb-4">Download Attendance Reports</h2>
        <div className="space-y-2">
          <Button label="Download PDF" />
          <Button label="Download Excel" />
        </div>
      </div>
    </div>
  );
};

export default Reports;
