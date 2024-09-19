document.addEventListener('DOMContentLoaded', function () {
  // Get section elements
  const homeSection = document.getElementById('homeSection');
  const fillRecordsSection = document.getElementById('fillRecordsSection');
  const studentRecordsSection = document.getElementById('studentRecordsSection');
  const attendanceSection = document.getElementById('attendanceSection');

  // Show the default section
  showSection(homeSection);

  // Event listeners for navigation
  document.getElementById('homeLink').addEventListener('click', function () {
      showSection(homeSection);
  });
  document.getElementById('fillRecordsLink').addEventListener('click', function () {
      showSection(fillRecordsSection);
  });
  document.getElementById('studentRecordsLink').addEventListener('click', function () {
      showSection(studentRecordsSection);
  });
  document.getElementById('attendanceLink').addEventListener('click', function () {
      showSection(attendanceSection);
  });

  // Function to show only the selected section
  function showSection(sectionToShow) {
      homeSection.style.display = 'none';
      fillRecordsSection.style.display = 'none';
      studentRecordsSection.style.display = 'none';
      attendanceSection.style.display = 'none';

      // Show the selected section
      sectionToShow.style.display = 'block';
  }

  // Form handling for student records
  const studentForm = document.getElementById('studentForm');
  const successMessage = document.getElementById('successMessage');

  studentForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent page reload

      // Get input values
      const studentName = document.getElementById('studentName').value;
      const studentAge = document.getElementById('studentAge').value;
      const studentClass = document.getElementById('studentClass').value;
      const studentRoll = document.getElementById('studentRoll').value;
      const studentSubject = document.getElementById('studentSubject').value;

      // Create a student object
      const studentRecord = {
          name: studentName,
          age: studentAge,
          class: studentClass,
          roll: studentRoll,
          subject: studentSubject,
      };

      // Store the student record in localStorage
      localStorage.setItem(`student-${studentRoll}`, JSON.stringify(studentRecord));

      // Display success message
      successMessage.style.display = 'block';

      // Clear form after submission
      studentForm.reset();
  });

  // Display student records
  function displayStudentList() {
      const studentList = document.getElementById('studentList');
      studentList.innerHTML = ''; // Clear previous content

      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith('student-')) {
              const student = JSON.parse(localStorage.getItem(key));
              const listItem = document.createElement('li');

              listItem.innerHTML = `
                  <span>${student.name} (Roll: ${student.roll})</span>
                  <button class="view-btn" onclick="viewStudent('${student.roll}')">View</button>
                  <button class="edit-btn" onclick="editStudent('${student.roll}')">Edit</button>
                  <button class="delete-btn" onclick="deleteStudent('${student.roll}')">Delete</button>
              `;
              studentList.appendChild(listItem);
          }
      }
  }

  // View student record
  window.viewStudent = function (rollNumber) {
      const studentRecord = localStorage.getItem(`student-${rollNumber}`);
      if (studentRecord) {
          const student = JSON.parse(studentRecord);
          alert(`Name: ${student.name}\nAge: ${student.age}\nClass: ${student.class}\nRoll Number: ${student.roll}\nSubject: ${student.subject}`);
      }
  };

  // Edit student record
  window.editStudent = function (rollNumber) {
      const studentRecord = localStorage.getItem(`student-${rollNumber}`);
      if (studentRecord) {
          const student = JSON.parse(studentRecord);
          sessionStorage.setItem('editStudent', JSON.stringify(student));
          window.location.href = '#fillRecordsSection'; // Adjust based on how you handle internal navigation
      }
  };

  // Delete student record
  window.deleteStudent = function (rollNumber) {
      localStorage.removeItem(`student-${rollNumber}`);
      displayStudentList(); // Refresh the student list
  };

  // Search student by name
  document.getElementById('searchBar').addEventListener('input', function (event) {
      const searchTerm = event.target.value.toLowerCase();
      const students = getStudentRecords().filter(student => student.name.toLowerCase().includes(searchTerm));
      displayStudentList(students);
  });

  // Get student records from localStorage
  function getStudentRecords() {
      const students = [];
      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith('student-')) {
              students.push(JSON.parse(localStorage.getItem(key)));
          }
      }
      return students;
  }

  // Handle attendance section
  function displayAttendanceList() {
      // Add logic to display attendance records
  }

  // Handle add attendance button click
  document.getElementById('addAttendanceBtn').addEventListener('click', function () {
      // Handle adding new attendance
      window.location.href = '#'; // Replace with actual page or functionality
  });
});
document.addEventListener('DOMContentLoaded', () => {
    const attendanceList = document.getElementById('attendanceList');
    const attendanceModal = document.getElementById('attendanceModal');
    const closeModal = document.getElementById('closeModal');
    const addAttendanceBtn = document.getElementById('addAttendanceBtn');
    const attendanceForm = document.getElementById('attendanceForm');
    const attendanceNameInput = document.getElementById('attendanceName');
    const attendanceDateInput = document.getElementById('attendanceDate');
    const previousMonthBtn = document.getElementById('previousMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

    const updateAttendanceList = () => {
        attendanceList.innerHTML = ''; // Clear existing records

        attendanceRecords.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.name} (${record.date})</td>
                <td>
                    <button class="view-btn" onclick="viewAttendance('${record.name}')">View</button>
                    <button class="edit-btn" onclick="editAttendance('${record.name}')">Edit</button>
                    <button class="delete-btn" onclick="deleteAttendance('${record.name}')">Delete</button>
                </td>
            `;
            attendanceList.appendChild(row);
        });
    };

    const showModal = () => {
        attendanceModal.classList.remove('hidden');
    };

    const hideModal = () => {
        attendanceModal.classList.add('hidden');
    };

    addAttendanceBtn.addEventListener('click', showModal);
    closeModal.addEventListener('click', hideModal);

    attendanceForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const name = attendanceNameInput.value;
        const date = attendanceDateInput.value;
        const newRecord = { name, date };

        attendanceRecords.push(newRecord);
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));

        hideModal();
        updateAttendanceList();
    });

    const viewAttendance = (name) => {
        const record = attendanceRecords.find(r => r.name === name);
        alert(`Name: ${record.name}\nDate: ${record.date}`);
    };

    const editAttendance = (name) => {
        // Implement edit functionality if needed
    };

    const deleteAttendance = (name) => {
        attendanceRecords = attendanceRecords.filter(r => r.name !== name);
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        updateAttendanceList();
    };

    updateAttendanceList();
});
