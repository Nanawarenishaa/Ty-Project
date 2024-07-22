import React from 'react';
import { useNavigate } from 'react-router-dom';

const ViewRecordButton = ({ studentId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/students/${studentId}`);
  };

  return (
    <button 
      onClick={handleClick} 
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      View Records
    </button>
  );
};

export default ViewRecordButton;
