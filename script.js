document.addEventListener('DOMContentLoaded', function () {
    // Get section elements
    const homeSection = document.getElementById('homeSection');
    const fillRecordsSection = document.getElementById('fillRecordsSection');
    const studentRecordsSection = document.getElementById('studentRecordsSection');
    const attendanceSection = document.getElementById('attendanceSection');
    const attendanceTableSection = document.getElementById('attendanceTableSection');

    // Initialize currentDate
    let currentDate = new Date(); // This variable will track the current date for attendance

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
        displayStudentList(getStudentRecords());
    });
    document.getElementById('attendanceLink').addEventListener('click', function () {
        showSection(attendanceSection);
        updateAttendanceList();
    });

    // Function to show only the selected section
    function showSection(sectionToShow) {
        homeSection.style.display = 'none';
        fillRecordsSection.style.display = 'none';
        studentRecordsSection.style.display = 'none';
        attendanceSection.style.display = 'none';
        attendanceTableSection.style.display = 'none';

        // Show the selected section
        sectionToShow.style.display = 'block';
    }

    // Add Attendance button functionality
    document.getElementById('addAttendanceBtn').addEventListener('click', function () {
        showSection(attendanceTableSection); // Show attendance table section
        populateAttendanceTable(); // Populate the table
    });

    // Back button functionality
    document.getElementById('backBtn').addEventListener('click', function () {
        showSection(attendanceSection); // Go back to the attendance records section
    });

    // Form handling for student records
    const studentForm = document.getElementById('studentForm');
    const successMessage = document.getElementById('successMessage');
    let isEditing = false;
    let currentEditingRoll = '';

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

        if (isEditing) {
            // Update existing record
            localStorage.setItem(`student-${currentEditingRoll}`, JSON.stringify(studentRecord));
            isEditing = false; // Reset editing state
        } else {
            // Store the student record in localStorage
            localStorage.setItem(`student-${studentRoll}`, JSON.stringify(studentRecord));
        }

        // Display success message
        successMessage.style.display = 'block';

        // Clear form after submission
        studentForm.reset();
        displayStudentList(getStudentRecords()); // Refresh the student list
    });

    // Display student records
    function displayStudentList(students) {
        const studentList = document.getElementById('studentList');
        studentList.innerHTML = ''; // Clear previous content

        students.forEach(student => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${student.name} (Roll: ${student.roll})</span>
                <button class="view-btn" onclick="viewStudent('${student.roll}')">View</button>
                <button class="edit-btn" onclick="editStudent('${student.roll}')">Edit</button>
                <button class="delete-btn" onclick="deleteStudent('${student.roll}')">Delete</button>
            `;
            studentList.appendChild(listItem);
        });
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

            // Set the form fields with the student data
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentAge').value = student.age;
            document.getElementById('studentClass').value = student.class;
            document.getElementById('studentRoll').value = student.roll;
            document.getElementById('studentSubject').value = student.subject;

            // Show the fill records section
            showSection(fillRecordsSection);

            // Set editing state
            isEditing = true;
            currentEditingRoll = rollNumber; // Keep track of the current roll number
        }
    };

    // Delete student record
    window.deleteStudent = function (rollNumber) {
        localStorage.removeItem(`student-${rollNumber}`);
        displayStudentList(getStudentRecords()); // Refresh the student list
    };

    // Search student by name
    document.getElementById('searchBar').addEventListener('input', function (event) {
        const searchTerm = event.target.value.toLowerCase();
        const students = getStudentRecords();
        const filteredStudents = searchTerm
            ? students.filter(student => student.name.toLowerCase().includes(searchTerm))
            : students;
        displayStudentList(filteredStudents);
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

    // Attendance handling
    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

    const updateAttendanceList = () => {
        const attendanceList = document.getElementById('attendanceList');
        attendanceList.innerHTML = ''; // Clear existing records
    
        attendanceRecords.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.name}</td>
                <td>
                    <button class="view-btn" onclick="viewAttendance('${record.name}')">View</button>
                    <button class="edit-btn" onclick="editAttendance('${record.name}')">Edit</button>
                    <button class="delete-btn" onclick="deleteAttendance('${record.name}')">Delete</button>
                </td>
            `;
            attendanceList.appendChild(row);
        });
    };
    

    // Save Attendance button functionality
    document.getElementById('saveAttendanceBtn').addEventListener('click', function () {
        const attendanceTableBody = document.querySelector('#attendanceTable tbody');
        const rows = attendanceTableBody.querySelectorAll('tr');

        const recordsToSave = [];

        rows.forEach(row => {
            const studentName = row.cells[0].textContent;
            const checkboxes = row.querySelectorAll('.attendance-checkbox');
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const day = checkbox.getAttribute('data-day');
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString();
                    recordsToSave.push({ name: studentName, date: date });
                }
            });
        });

        // Save records to localStorage
        attendanceRecords = attendanceRecords.concat(recordsToSave);
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));

        updateAttendanceList(); // Refresh the attendance list
        showSection(attendanceSection); // Go back to attendance section
    });

    // View Attendance Function
    window.viewAttendance = function (name, date) {
        showSection(attendanceTableSection);
    };

   // Edit Attendance Function
window.editAttendance = function (name) {
    const newName = prompt('Edit Attendance Name:', name);
    if (newName) {
        attendanceRecords = attendanceRecords.map(record => 
            record.name === name ? { ...record, name: newName } : record
        );
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        updateAttendanceList(); // Refresh the attendance list
    }
};


    // Delete Attendance Function
    window.deleteAttendance = function (name, date) {
        attendanceRecords = attendanceRecords.filter(record => !(record.name === name && record.date === date));
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        updateAttendanceList(); // Refresh the attendance list
    };

    // Populate Attendance Table Function
    function createAttendanceTable(studentName) {  
        const attendanceTableBody = document.querySelector('#attendanceTable tbody');  
        const row = document.createElement('tr');  
        row.innerHTML = `  
         <td>${studentName}</td>  
         ${Array.from({ length: 31 }, (_, i) => `  
          <td>  
            <input type="checkbox" class="attendance-checkbox" data-day="${i + 1}">  
          </td>  
         `).join('')}  
        `;  
        attendanceTableBody.appendChild(row);  
      }

    function updateMonthYearDisplay() {
        const monthYearDisplay = document.getElementById('currentMonthYear');
        monthYearDisplay.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
    }

    document.getElementById('prevMonthBtn').addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthYearDisplay();
        createAttendanceTable(); // Refresh the attendance table
    });

    document.getElementById('nextMonthBtn').addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthYearDisplay();
        createAttendanceTable(); // Refresh the attendance table
    });

    // Call this function to set the initial display
    updateMonthYearDisplay();
    createAttendanceTable(); // Call this on load to populate the initial table
});