document.addEventListener('DOMContentLoaded', function () {
  // Sections
  const sections = {
    home: document.getElementById('homeSection'),
    fillRecords: document.getElementById('fillRecordsSection'),
    studentRecords: document.getElementById('studentRecordsSection'),
    teacherRecords: document.getElementById('teacherRecordsSection'),
    attendance: document.getElementById('attendanceSection'),
    attendanceTable: document.getElementById('attendanceTableSection'),
    login: document.getElementById('loginSection'),
    signup: document.getElementById('signupSection'),
    loggedIn: document.getElementById('loggedInSection'),
    studentProfile: document.getElementById('studentProfileSection'),
    teacherProfile: document.getElementById('teacherProfileSection'),
  };

  let isEditing = false;
  let currentEditingRoll = '';

  // Utility: Show specific section
  function showSection(sectionKey) {
    Object.values(sections).forEach(section => {
      if (section) {
        section.style.display = 'none';
      }
    });

    if (sections[sectionKey]) {
      sections[sectionKey].style.display = 'block';
    }
  }

  // Event listeners for navigation
  const navLinks = {
    homeLink: 'home',
    fillRecordsLink: 'fillRecords',
    studentRecordsLink: 'studentRecords',
    teacherRecordsLink: 'teacherRecords',
    attendanceLink: 'attendance',
    loginLink: 'login',
    signupLink: 'signup',
    logOutLink: 'loggedIn',
  };

  Object.keys(navLinks).forEach(linkId => {
    const sectionKey = navLinks[linkId];
    const linkElement = document.getElementById(linkId);
    if (linkElement) {
      linkElement.addEventListener('click', () => showSection(sectionKey));
    }
  });

  // Form handling
  function handleFormSubmission(formId, storageKeyPrefix) {
    const form = document.getElementById(formId);

    if (!form) return; // Ensure the form exists

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = new FormData(form);
      const record = Object.fromEntries(formData.entries());
      record.image = form.elements['image'] && form.elements['image'].files[0]
        ? URL.createObjectURL(form.elements['image'].files[0])
        : null;

      const rollKey = `${storageKeyPrefix}-${record.roll}`;
      if (!isEditing && localStorage.getItem(rollKey)) {
        alert('Roll number already exists!');
        return;
      }

      localStorage.setItem(rollKey, JSON.stringify(record));
      isEditing = false;
      currentEditingRoll = '';
      form.reset();
      alert('Record saved successfully!');
    });
  }

  handleFormSubmission('studentForm', 'student');
  handleFormSubmission('teacherForm', 'teacher');

  // Display records (reusable)
  function displayRecordList(storageKeyPrefix, listElementId, profileSectionKey) {
    const listElement = document.getElementById(listElementId);
    if (!listElement) return;

    listElement.innerHTML = '';
    const records = Object.keys(localStorage)
      .filter(key => key.startsWith(storageKeyPrefix))
      .map(key => JSON.parse(localStorage.getItem(key)));

    records.forEach(record => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span>${record.name} (Roll: ${record.roll})</span>
        <button onclick="viewRecord('${storageKeyPrefix}', '${record.roll}', '${profileSectionKey}')">View</button>
        <button onclick="editRecord('${storageKeyPrefix}', '${record.roll}')">Edit</button>
        <button onclick="deleteRecord('${storageKeyPrefix}', '${record.roll}')">Delete</button>
      `;
      listElement.appendChild(listItem);
    });
  }

  // View record
  window.viewRecord = function (storageKeyPrefix, roll, profileSectionKey) {
    const record = JSON.parse(localStorage.getItem(`${storageKeyPrefix}-${roll}`));
    if (record) {
      Object.keys(record).forEach(key => {
        const element = document.getElementById(`${storageKeyPrefix}${key.charAt(0).toUpperCase() + key.slice(1)}`);
        if (element) element.textContent = record[key];
      });
      showSection(profileSectionKey);
    } else {
      alert('Record not found!');
    }
  };

  // Edit record
  window.editRecord = function (storageKeyPrefix, roll) {
    const record = JSON.parse(localStorage.getItem(`${storageKeyPrefix}-${roll}`));
    if (record) {
      Object.keys(record).forEach(key => {
        const input = document.querySelector(`#${storageKeyPrefix}Form [name="${key}"]`);
        if (input) input.value = record[key];
      });
      isEditing = true;
      currentEditingRoll = roll;
      showSection('fillRecords');
    }
  };

  // Delete record
  window.deleteRecord = function (storageKeyPrefix, roll) {
    localStorage.removeItem(`${storageKeyPrefix}-${roll}`);
    alert('Record deleted successfully!');
    displayRecordList(storageKeyPrefix, `${storageKeyPrefix}List`, `${storageKeyPrefix}Profile`);
  };

  // Initialization: Show home section by default
  showSection('home');

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
   
});
  
     
    
      