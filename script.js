
document.addEventListener('DOMContentLoaded', function () {  
  // Get section elements
  const homeSection = document.getElementById('homeSection');  
  const fillRecordsSection = document.getElementById('fillRecordsSection');  
  const studentRecordsSection = document.getElementById('studentRecordsSection');  
  const attendanceSection = document.getElementById('attendanceSection');  
  const attendanceTableSection = document.getElementById('attendanceTableSection');  
  const loginSection = document.getElementById('loginSection');  
  const signupSection = document.getElementById('signupSection');  
  const studentProfileSection = document.getElementById('studentProfileSection');  
  const loggedInSection = document.getElementById('loggedInSection');  
  
  const getStartedBtn = document.querySelector('.heroButton');
    
  if (getStartedBtn) {
      getStartedBtn.addEventListener('click', function() {
          hideAllSections();
          const fillRecordsSection = document.getElementById('fillRecordsSection');
          if (fillRecordsSection) {
              fillRecordsSection.style.display = 'block'; // Show Fill Records section
          } else {
              console.error('fillRecordsSection not found');
          }
      });
  } else {
      console.error('Get Started button (.heroButton) not found');
  }
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
  document.getElementById('loginLink').addEventListener('click', function () {  
   showSection(loginSection);  
  });  
  document.getElementById('signupLink').addEventListener('click', function () {  
   showSection(signupSection);  
  });  
  document.getElementById('logOutLink').addEventListener('click', function () {  
    showSection(loggedInSection);  
   });


  // Function to show only the selected section  
  function showSection(sectionToShow) {  
    
    homeSection.style.display = 'none';
   fillRecordsSection.style.display = 'none';  
   studentRecordsSection.style.display = 'none';  
   attendanceSection.style.display = 'none';  
   attendanceTableSection.style.display = 'none';  
   loginSection.style.display = 'none';  
   signupSection.style.display = 'none';  
   loggedInSection.style.display = 'none';  
   studentProfileSection.style.display = 'none';  
   // Show the selected section  
   sectionToShow.style.display = 'block';  
  }  
  
  function hideAllSections() {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
          section.style.display = 'none';
      });
  }
  // Add Attendance button functionality  
  document.getElementById('addAttendanceBtn').addEventListener('click', function () {  
   showSection(attendanceTableSection); // Show attendance table section  
   const studentRecords = getStudentRecords();  
   createAttendanceTable(studentRecords); // Populate the table  
  });  
  
  // Back button functionality  
  document.getElementById('backBtn').addEventListener('click', function () {  
   showSection(attendanceSection); // Go back to the attendance records section  
  });  


   // Handle "Get Started" button click in hero section
  
// Add smooth scrolling behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
  
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
    const studentAddress = document.getElementById('studentAddress').value;
    const studentPhone = document.getElementById('studentPhone').value;
    const studentEmail = document.getElementById('studentEmail').value;
    const studentImage = document.getElementById('studentImage').files[0];
    // Create a student object  
    const studentRecord = {  
        name: studentName,  
        age: studentAge,  
        class: studentClass,  
        roll: studentRoll,  
        subject: studentSubject,
        address: studentAddress,
        phone: studentPhone,
        email: studentEmail,
        image: studentImage ? URL.createObjectURL(studentImage) : null
    };  

    // Check for unique roll number if not editing
    if (!isEditing && localStorage.getItem(`student-${studentRoll}`)) {
        alert('Roll number already exists! Please use a different roll number.');
        return; // Exit the function to prevent saving
    }

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
    displayStudentList(getStudentRecords());  
    const studentRecords = getStudentRecords();  
    createAttendanceTable(studentRecords); // Pass the studentRecords array as an argument  
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
  
  window.viewStudent = function(rollNumber) {
    // Get student data from localStorage using the roll number
    const studentRecord = localStorage.getItem(`student-${rollNumber}`);

    if (studentRecord) {
        const student = JSON.parse(studentRecord);

        // Populate the Student Profile section with the student's data
        document.getElementById('StudentName').textContent = student.name;
        document.getElementById('StudentAge').textContent = student.age;
        document.getElementById('StudentClass').textContent = student.class;
        document.getElementById('StudentRoll').textContent = student.roll;
        document.getElementById('StudentSubject').textContent = student.subject;
        document.getElementById('StudentAddress').textContent = student.address; // Corrected
        document.getElementById('StudentPhone').textContent = student.phone; // Corrected
        document.getElementById('StudentImage').src = student.image;
        document.getElementById('StudentImage').style.display = 'block';

        const studentImage = document.getElementById('StudentImage');
        if (student.image) {
          studentImage.src = student.image;
          studentImage.style.display = 'block';
      } else {
          studentImage.style.display = 'none';
      }
      

        // Show student profile section and hide others
        showSection(studentProfileSection);
    } else {
        alert("Student record not found!");
    }
};
function goBack() {
  showSection(studentRecordsSection); // Show the student records section
}

// Event listener for the back button
document.getElementById('BtnBack').addEventListener('click', goBack);

   
  
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
    studentForm.reset();
document.getElementById('studentImage').value = ''; // Reset image input


    // Get student records from localStorage
    function getStudentRecords() {
      const students = Object.keys(localStorage)
          .filter(key => key.startsWith('student-'))
          .map(key => JSON.parse(localStorage.getItem(key)));
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
          <td>${record.date}</td>  
          <td>  
            <button class="view-btn" onclick="viewAttendance('${record.name}', '${record.date}')">View</button>  
            <button class="edit-btn" onclick="editAttendance('${record.name}', '${record.date}')">Edit</button>  
            <button class="delete-btn" onclick="deleteAttendance('${record.name}', '${record.date}')">Delete</button>  
          </td>  
         `;  
         attendanceList.appendChild(row);  
        });  
      };
      
      // Save Attendance button functionality  
      document.getElementById('saveAttendanceBtn').addEventListener('click', function () {  
        const attendanceTableBody = document.querySelector('#attendanceTable tbody');  
        const rows = attendanceTableBody.querySelectorAll('tr');  
        const attendanceNameInput = document.getElementById('attendanceName').value;  
        const attendanceDateInput = document.getElementById('attendanceDate').value;  
        const recordsToSave = [];  
       
        recordsToSave.push({ name: attendanceNameInput, date: attendanceDateInput });  
  

       
        // Save records to localStorage  
        attendanceRecords = attendanceRecords.concat(recordsToSave);  
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));  
       
        updateAttendanceList(); // Refresh the attendance list  
        showSection(attendanceSection); // Go back to attendance section  
       });  
       
       // View Attendance Function  
       window.viewAttendance = function (attendanceName, attendanceDate) {  
        showSection(attendanceTableSection);  
       };  
       
       // Edit Attendance Function  
       window.editAttendance = function (attendanceName) {  
        const newName = prompt('Edit Attendance Name:', attendanceName);  
        if (newName) {  
         attendanceRecords = attendanceRecords.map(record =>  
           record.name === attendanceName ? { ...record, name: newName } : record  
         );  
         localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));  
         updateAttendanceList(); // Refresh the attendance list  
        }  
       }; 
       window.deleteAttendance = function (attendanceName, attendanceDate) {  
        attendanceRecords = attendanceRecords.filter(record => record.name !== attendanceName || record.date !== attendanceDate);  
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));  
        updateAttendanceList(); // Refresh the attendance list  
       };  
    
      
      function createAttendanceTable(studentRecords) {  
        const attendanceTableBody = document.querySelector('#attendanceTable tbody');  
        attendanceTableBody.innerHTML = ''; // Clear previous content  
        
        // Create header row with days of the month  
        const headerRow = document.createElement('tr');  
        headerRow.innerHTML = `  
         <th>Student Name</th>  
         ${Array.from({ length: 31 }, (_, i) => `  
          <th>${i + 1}</th>  
         `).join('')}  
        `;  
        attendanceTableBody.appendChild(headerRow);  
        
        studentRecords.forEach(student => {  
         const row = document.createElement('tr');  
         row.innerHTML = `  
          <td>${student.name}</td>  
          ${Array.from({ length: 31 }, (_, i) => `  
            <td>  
             <input type="checkbox" class="attendance-checkbox" data-day="${i + 1}">  
            </td>  
          `).join('')}  
         `;  
         attendanceTableBody.appendChild(row);  
        });  
      }
      
        
      function updateMonthYearDisplay() {  
        const monthYearDisplay = document.getElementById('currentMonthYear');  
        monthYearDisplay.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;  
      }  
        
      document.getElementById('prevMonthBtn').addEventListener('click', function () {  
        currentDate.setMonth(currentDate.getMonth() - 1);  
        updateMonthYearDisplay();  
        const studentRecords = getStudentRecords();  
        createAttendanceTable(studentRecords); // Pass the studentRecords array as an argument  
      });  
        
      document.getElementById('nextMonthBtn').addEventListener('click', function () {  
        currentDate.setMonth(currentDate.getMonth() + 1);  
        updateMonthYearDisplay();  
        const studentRecords = getStudentRecords();  
        createAttendanceTable(studentRecords); // Pass the studentRecords array as an argument  
      });  
        
      // Call this function to set the initial display  
      updateMonthYearDisplay();  
      const studentRecords = getStudentRecords();  
      createAttendanceTable(studentRecords); // Pass the studentRecords array as an argument 
      
      document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const user = storedUsers.find(user => user.username === username && user.password === password);
    
        if (user) {
            // Log the user in and redirect to the homepage
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = 'index.html'; // Redirect to the main dashboard
        } else {
            alert('Invalid username or password');
        }
    });
    
       
       // Signup functionality  
       document.getElementById('signup-form').addEventListener('submit', function(event) {  
        event.preventDefault();  
        const username = document.getElementById('username').value;  
        const email = document.getElementById('email').value;  
        const password = document.getElementById('password').value;  
        const confirmPassword = document.getElementById('confirm-password').value;  
       
        // Check if the password and confirm password match  
        if (password !== confirmPassword) {  
         alert('Passwords do not match');  
         return;  
        }  
        if (!validateEmail(email)) {
          alert('Invalid email address.');
          return;
      }
        // Check if the username is already taken  
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];  
        const user = storedUsers.find(user => user.username === username);  
       
        if (user) {  
         alert('Username is already taken');  
         return;  
        }  
       
        // Create a new user object  
        const newUser = {  
         username: username,  
         email: email,  
         password: password  
        };  
       
        // Add the new user to the stored users  
        storedUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(storedUsers));

        // Display success message and reset the form
        alert('Signup successful! You can now log in.');
        document.getElementById('signup-form').reset();
        window.location.href = 'loginLink'; // Redirect to login page after signup

    });
    
document.addEventListener('DOMContentLoaded', function() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!loggedInUser) {
    window.location.href = 'loginLink'; // Redirect to login page after signup

  }
});



    // Email validation function (moved outside the signup event listener)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}); 
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const loginSection = document.getElementById('loginSection');
  const loggedInSection = document.getElementById('loggedInSection');
  const userNameDisplay = document.getElementById('userName');
  const logOutBtn = document.getElementById('logOutBtn');

  // Check if the user is already logged in
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  
  if (loggedInUser) {
      loginSection.style.display = 'none';
      loggedInSection.style.display = 'block';
      userNameDisplay.textContent = loggedInUser.username;
  } else {
      loginSection.style.display = 'block';
      loggedInSection.style.display = 'none';
  }

  // Handle login form submission
  loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Validate input
      if (!username || !password) {
          errorMessage.textContent = "Please fill out both fields.";
          errorMessage.classList.remove('hidden');
          return;
      }

      // Simulate successful login (In real apps, this would be an API call)
      const user = { username, password };  // Example user data
      localStorage.setItem('loggedInUser', JSON.stringify(user));

      // Hide login form and show logged-in state
      loginSection.style.display = 'none';
      loggedInSection.style.display = 'block';
      userNameDisplay.textContent = username;
  });

  // Handle logout button click
  if (logOutBtn) {
      logOutBtn.addEventListener('click', function () {
          // Remove the logged-in user data from localStorage
          localStorage.removeItem('loggedInUser');

          // Hide logged-in section and show login form
          loginSection.style.display = 'block';
          loggedInSection.style.display = 'none';
      });
  }
});
   
    
     
    
      