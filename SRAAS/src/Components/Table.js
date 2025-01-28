import React from "react";

const Table = ({ columns, data, className = "", rowClassName = "", emptyMessage = "No records available." }) => {
  return (
    <div className={`table-container ${className}`}>
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="table-header">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx} className={`table-row ${rowClassName}`}>
                {row.map((cell, index) => (
                  <td key={index} className="table-cell">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="empty-state">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
