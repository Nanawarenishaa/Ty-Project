let records = [
  { id: 1, name: "John Doe", role: "student", rollNumber: "S001" },
  { id: 2, name: "Jane Smith", role: "teacher", qualification: "MSc", joiningDate: "2022-01-10" },
  { id: 3, name: "Nisha", role: "student", rollNumber: "38" },
];

// Function to get initial data
export const getInitialData = () => [...records];

// Function to delete a record
export const deleteRecord = (id) => {
  records = records.filter((record) => record.id !== id);
};

// Function to update a record
export const updateRecord = (updatedRecord) => {
  records = records.map((record) =>
    record.id === updatedRecord.id ? updatedRecord : record
  );
};

// Function to add a new record
export const addRecord = (newRecord) => {
  records.push(newRecord);
};
