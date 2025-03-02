document.addEventListener('DOMContentLoaded', function () {
    // Navigation Links and Sections Mapping
    const navLinks = {
        homeLink: 'homeSection',
        fillRecordsLink: 'fillRecordsSection',
        studentRecordsLink: 'studentRecordsSection',
        teacherRecordsLink: 'teacherRecordsSection',
        attendanceLink: 'attendanceSection',
        logInLink : 'loginSection',
        signupLink: 'signupSection',
        logOutLink:'loggedInSection',
        loggedInLink:'logOutSection',
    };

    // Sections and Forms
    const sections = {};
    Object.values(navLinks).forEach((sectionId) => {
        sections[sectionId] = document.getElementById(sectionId);
    });

    const studentForm = document.getElementById('studentForm');
    const teacherForm = document.getElementById('teacherForm');
    const studentListContainer = document.getElementById('studentListContainer');
    const teacherListContainer = document.getElementById('teacherListContainer');
    const studentListElement = document.getElementById('studentList');
    const teacherListElement = document.getElementById('teacherList');
    const studentSearchBar = document.getElementById('studentSearchBar');
    const teacherSearchBar = document.getElementById('teacherSearchBar');
   const attendanceSection= document.getElementById('attendanceSection');
    const attendanceTableSection= document.getElementById('attendanceTableSection');
    const checkInTimeInput = document.getElementById('checkInTime');
    const checkOutTimeInput = document.getElementById('checkOutTime');
    const timeUpMessage = document.getElementById('timeUpMessage');
    const attendanceNameInput = document.getElementById("attendanceName");
    const attendanceDateInput = document.getElementById("attendanceDate");
    const attendanceDayInput = document.getElementById("attendanceDay");
    const saveAttendanceButton = document.querySelector(".save-btn");
    const attendanceList = document.getElementById("attendanceList");
   
    // Records Storage
    const studentRecords = [];
    const teacherRecords = [];
    let attendanceRecords = [];
    let attendanceActive = false;

    // Utility: Show Specific Section
    const showSection = (sectionId) => {
        Object.values(sections).forEach((section) => {
            if (section) {
                section.style.display = 'none';
            }
        });
        if (sections[sectionId]) {
            console.log('Showing section:', sectionId);  // Debugging line
            sections[sectionId].style.display = 'block';
        }
    };

    // Setup Navigation Links
    Object.keys(navLinks).forEach((linkId) => {
        const sectionId = navLinks[linkId];
        const linkElement = document.getElementById(linkId);
        if (linkElement) {
            linkElement.addEventListener('click', (e) => {
                e.preventDefault();
                showSection(sectionId);
            });
        }
    });

    // Toggle Forms (Student/Teacher)
    const toggleForm = (isStudentForm) => {
        studentForm.style.display = isStudentForm ? 'block' : 'none';
        teacherForm.style.display = isStudentForm ? 'none' : 'block';
    };

    document.getElementById('studentFormLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleForm(true);
    });

    document.getElementById('teacherFormLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleForm(false);
    });

   // Update List function to append event listener to "View" buttons
   const updateList = (records, listElement, type) => {
    listElement.innerHTML = ''; // Clear existing list
    records.forEach((record, index) => {
        const listItem = document.createElement('li');
        listItem.className = `${type}-item`;
        listItem.innerHTML = ` 
            <span class="${type}-name">${record.name} (${record.roll})</span>
            <div>
                <button class="view-btn" data-index="${index}" data-type="${type}">View</button>
                <button class="edit-btn" data-index="${index}" data-type="${type}">Edit</button>
                <button class="delete-btn" data-index="${index}" data-type="${type}">Delete</button>
            </div>
        `;
        listElement.appendChild(listItem);
    });
};

    // Form Submission Handler
    const handleFormSubmit = (isStudentForm) => {
        const nameInput = document.getElementById(isStudentForm ? 'studentName' : 'teacherName');
        const rollInput = document.getElementById(isStudentForm ? 'studentRoll' : 'teacherRoll');
        const ageInput = document.getElementById(isStudentForm ? 'studentAge' : 'teacherAge');
        const emailInput = document.getElementById(isStudentForm ? 'studentEmail' : 'teacherEmail');
        const addressInput = document.getElementById(isStudentForm ? 'studentAddress' : 'teacherAddress');
        const phoneInput = document.getElementById(isStudentForm ? 'studentPhone' : 'teacherPhone');
        const subjectInput = document.getElementById(isStudentForm ? 'studentSubject' : 'teacherSubject');
        const classInput = document.getElementById(isStudentForm ? 'studentClass' : 'teacherClass');
        
        const name = nameInput.value.trim();
        const roll = rollInput.value.trim();
        const age = ageInput?.value.trim() || '';
        const address = addressInput?.value.trim() || '';
        const subject = subjectInput?.value.trim() || '';
        const classField = classInput?.value.trim() || '';
        const phone = phoneInput?.value.trim() || ''; // This ensures an empty string if undefined
        const email = emailInput?.value.trim() || ''; // This ensures an empty string if undefined


    
        if (!name || !roll) {
            alert('Both Name and Roll are required!');
            return;
        }

        const record = { name, roll, age, email, address, phone, subject, class: classField };

        if (isStudentForm) {
            studentRecords.push(record);
            alert('Student record added!');
            updateList(studentRecords, studentListElement, 'student');
        } else {
            teacherRecords.push(record);
            alert('Teacher record added!');
            updateList(teacherRecords, teacherListElement, 'teacher');
        }

        nameInput.value = '';
        rollInput.value = '';
    };

    // Submit Button Handlers
    document.getElementById('studentSubmitBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        handleFormSubmit(true);
    });

    document.getElementById('teacherSubmitBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        handleFormSubmit(false);
    });

    // Show Lists
    document.getElementById('studentListLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        studentListContainer.style.display = 'block';
        teacherListContainer.style.display = 'none';
        updateList(studentRecords, studentListElement, 'student');
    });

    document.getElementById('teacherListLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        teacherListContainer.style.display = 'block';
        studentListContainer.style.display = 'none';
        updateList(teacherRecords, teacherListElement, 'teacher');
    });

    // Delete Record Handler
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            const type = e.target.getAttribute('data-type');

            if (type === 'student') {
                studentRecords.splice(index, 1);
                updateList(studentRecords, studentListElement, 'student');
            } else if (type === 'teacher') {
                teacherRecords.splice(index, 1);
                updateList(teacherRecords, teacherListElement, 'teacher');
            }
        }
    });
// Updated showProfile function to ensure hiding other profiles

// Function to display student or teacher profile
function showProfile(data, isStudent = true) {
    if (isStudent) {
        document.getElementById('StudentName').textContent = data.name;
        document.getElementById('StudentAge').textContent = data.age;
        document.getElementById('StudentClass').textContent = data.class;
        document.getElementById('StudentRoll').textContent = data.roll;
        document.getElementById('StudentSubject').textContent = data.subject;
        document.getElementById('StudentAddress').textContent = data.address;
        document.getElementById('StudentPhone').textContent = data.phone;
        document.getElementById('StudentEmail').textContent = data.email;

        document.getElementById('studentProfileSection').style.display = 'block';
        document.getElementById('teacherProfileSection').style.display = 'none';
    } else {
        document.getElementById('TeacherName').textContent = data.name;
        document.getElementById('TeacherAge').textContent = data.age;
        document.getElementById('TeacherClass').textContent = data.class;
        document.getElementById('TeacherRoll').textContent = data.roll;
        document.getElementById('TeacherSubject').textContent = data.subject;
        document.getElementById('TeacherAddress').textContent = data.address;
        document.getElementById('TeacherPhone').textContent = data.phone;
        document.getElementById('TeacherEmail').textContent = data.email;

        document.getElementById('teacherProfileSection').style.display = 'block';
        document.getElementById('studentProfileSection').style.display = 'none';
    }
   
    // Hide all other sections
    document.getElementById('fillRecordsSection').style.display = 'none';
    document.getElementById('studentRecordsSection').style.display = 'none';
    document.getElementById('attendanceSection').style.display = 'none';
    document.getElementById('signupSection').style.display = 'none';
}
document.addEventListener('click', (e) => {
    if (e.target.id === 'studentBackBtn') {
        document.getElementById('studentProfileSection').style.display = 'none';
        document.getElementById('studentRecordsSection').style.display = 'block';
    } else if (e.target.id === 'teacherBackBtn') {
        document.getElementById('teacherProfileSection').style.display = 'none';
        document.getElementById('studentRecordsSection').style.display = 'block';
    }
});
// Event listener for View button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-btn')) {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        const type = e.target.getAttribute('data-type');

        // Hide profiles before showing the selected one
        if (type === 'student') {
            const studentRecord = studentRecords[index];
            showProfile(studentRecord, true); // Show Student Profile
        } else if (type === 'teacher') {
            const teacherRecord = teacherRecords[index];
            showProfile(teacherRecord, false); // Show Teacher Profile
        }
    }
});
    // Search Functionality
    const filterList = (records, query, listElement, type) => {
        const filteredRecords = records.filter((record) =>
            record.name.toLowerCase().includes(query.toLowerCase())
        );
        updateList(filteredRecords, listElement, type);
    };

    studentSearchBar?.addEventListener('input', (e) => {
        filterList(studentRecords, e.target.value, studentListElement, 'student');
    });

    teacherSearchBar?.addEventListener('input', (e) => {
        filterList(teacherRecords, e.target.value, teacherListElement, 'teacher');
    });

 // Show attendance table section when the "+" button is clicked
 document.getElementById('addAttendanceBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    attendanceSection.style.display = 'none'; // Hide attendance page
    attendanceTableSection.style.display = 'block'; // Show attendance table page
});

// Back button on the attendance table section
document.getElementById('attendanceBackBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    attendanceTableSection.style.display = 'none'; // Hide attendance table page
    attendanceSection.style.display = 'block'; // Show attendance page
});

const saveAttendance = () => {
    const attendanceName = attendanceNameInput.value.trim();
    const attendanceDate = attendanceDateInput.value;
    const attendanceDay = attendanceDayInput.value.trim();

    if (!attendanceName || !attendanceDate || !attendanceDay) {
      alert("Please fill in all fields.");
      return;
    }

    // Create a new attendance record
    const newAttendance = {
      name: attendanceName,
      date: attendanceDate,
      day: attendanceDay,
    };

    // Add to the records array
    attendanceRecords.push(newAttendance);

    // Clear inputs
    attendanceNameInput.value = "";
    attendanceDateInput.value = "";
    attendanceDayInput.value = "";

    // Refresh the list
    renderAttendanceList();

    // Go back to attendance list section
    attendanceTableSection.style.display = "none";
    attendanceSection.style.display = "block";
  };
  saveAttendanceButton.addEventListener('click', saveAttendance);

  // Function to render attendance list
  const renderAttendanceList = () => {
    attendanceList.innerHTML = ""; // Clear existing list
    attendanceRecords.forEach((record, index) => {
      const listItem = document.createElement("li");
      listItem.className = "attendance-item";
      listItem.innerHTML = `
        <div>
          <strong>${record.name}</strong> 
          <p>Date: ${record.date}</p>
          <p>Day: ${record.day}</p>
        </div>
        <div>
          <button class="view-btn" data-index="${index}">View</button>
           <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </div>
      `;
      attendanceList.appendChild(listItem);
    });

    // Attach event listeners for view and delete buttons
    document.querySelectorAll(".view-btn").forEach(button =>
      button.addEventListener("click", (e) => viewAttendance(e.target.dataset.index))
    );

    document.querySelectorAll(".delete-btn").forEach(button =>
      button.addEventListener("click", (e) => deleteAttendance(e.target.dataset.index))
    );
  };

  // Function to view attendance details
  const viewAttendance = (index) => {
    const record = attendanceRecords[index];
    alert(`Attendance Name: ${record.name}\nDate: ${record.date}\nDay: ${record.day}`);
  };

  // Function to delete an attendance record
  const deleteAttendance = (index) => {
    if (confirm("Are you sure you want to delete this record?")) {
      attendanceRecords.splice(index, 1); // Remove the record
      renderAttendanceList(); // Refresh the list
    }
  };

   // Check if it's time to start or stop the attendance
const checkAttendanceTime = () => {
    const currentTime = new Date();
    const checkInTime = new Date();
    const checkOutTime = new Date();

    const [checkInHours, checkInMinutes] = checkInTimeInput.value.split(':').map(Number);
    const [checkOutHours, checkOutMinutes] = checkOutTimeInput.value.split(':').map(Number);

    // Set check-in and check-out times
    checkInTime.setHours(checkInHours, checkInMinutes, 0);
    checkOutTime.setHours(checkOutHours, checkOutMinutes, 0);

    if (currentTime >= checkInTime && currentTime <= checkOutTime) {
        if (!attendanceActive) {
            attendanceActive = true;
            alert("Attendance process started!");
        }
    } else if (currentTime > checkOutTime && attendanceActive) {
        attendanceActive = false;
        timeUpMessage.textContent = "Time's up!";
        alert("Attendance process stopped!");
    }
};

// Set up a periodic check every minute
setInterval(checkAttendanceTime, 60000);
    
  // Back button event listener
  document.getElementById("attendanceBackBtn").addEventListener("click", () => {
    attendanceTableSection.style.display = "none";
    attendanceSection.style.display = "block";
  });

  // Add Attendance button event listener
  document.getElementById("addAttendanceBtn").addEventListener("click", () => {
    attendanceSection.style.display = "none";
    attendanceTableSection.style.display = "block";
  });
  
   const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const signupUsername = document.getElementById('signup-username');
    const signupPassword = document.getElementById('signup-password');
    const signupEmail = document.getElementById('signup-email');
    const signupErrorMessage = document.getElementById('signupErrorMessage');
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const loginErrorMessage = document.getElementById('errorMessage');

  // Handle Signup Functionality
const handleSignup = (e) => {
    e.preventDefault();

    const username = signupUsername.value.trim();
    const password = signupPassword.value.trim();
    const email = signupEmail.value.trim();

    if (!username || !password) {
        alert("Username and Password are required!");
        return;
    }

    // Retrieve existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the username already exists
    const userExists = existingUsers.some((user) => user.username === username);

    if (userExists) {
        signupErrorMessage.style.display = 'block';
        signupErrorMessage.textContent = "Username already exists. Please choose a different username.";
        return;
    }

    // Save new user to localStorage
    const newUser = { username, password, email };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    alert("Signup successful! Please log in.");
    showSection('loginSection'); // Redirect to the login section
};

// Attach event listener to the signup form
signupForm.addEventListener('submit', handleSignup);

// Handle Login Functionality
const handleLogin = (e) => {
    e.preventDefault();

    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    // Check if the username and password are entered
    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    // Retrieve registered users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Find a matching user
    const loggedInUser = existingUsers.find(
        (user) => user.username === username && user.password === password
    );

    if (loggedInUser) {
        // Save the logged-in user to localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

        // Redirect to the logged-in section
        alert("Login successful!");
        showSection('loggedInSection');
    } else {
        // Show an error message for invalid credentials
        loginErrorMessage.textContent = "Invalid username or password. Please try again.";
        loginErrorMessage.style.display = 'block';
    }
};

// Attach event listener to the login form
loginForm.addEventListener('submit', handleLogin);
    // Logout Functionality
    // Check if there are registered users
const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
if (existingUsers.length === 0) {
    // If no users exist, redirect to the signup section
    showSection('signupSection');
} else {
    // If users exist, check if a user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        showSection('loggedInSection'); // Redirect to the logged-in section
    } else {
        showSection('loginSection'); // Redirect to the login section
    }
}
    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        alert("You have been logged out successfully!");
        showSection('loginSection'); // Redirect to login section
    };

    // Attach the logout functionality to the Logout link/button
    document.getElementById('logOutLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });

    // Show login or signup section based on user status
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        showSection('loggedInSection');
    } else {
        showSection('loginSection');
    }
 
    // Show Home Section by Default
    showSection('homeSection');
});


