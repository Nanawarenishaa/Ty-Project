document.addEventListener('DOMContentLoaded', function () {
  // Navigation Links and Sections Mapping
  const navLinks = {
      homeLink: 'homeSection',
      fillRecordsLink: 'fillRecordsSection',
      studentRecordsLink: 'studentRecordsSection',
      teacherRecordsLink: 'teacherRecordsSection',
      attendanceLink: 'attendanceSection',
      loginLink: 'loginSection',
      signupLink: 'signupSection',
  };

  // Sections
  const sections = {};
  Object.values(navLinks).forEach((sectionId) => {
      sections[sectionId] = document.getElementById(sectionId);
  });

  // Forms and UI Elements
  const studentForm = document.getElementById('studentForm');
  const teacherForm = document.getElementById('teacherForm');
  const studentListContainer = document.getElementById('studentListContainer');
  const teacherListContainer = document.getElementById('teacherListContainer');
  const studentListElement = document.getElementById('studentList');
  const teacherListElement = document.getElementById('teacherList');
  const studentSearchBar = document.getElementById('studentSearchBar');
  const teacherSearchBar = document.getElementById('teacherSearchBar');
  const submitButton = document.querySelector('.submit-btn');


  // Data Storage
  let studentRecords = [];
  let teacherRecords = [];

  // Utility: Show Specific Section
  function showSection(sectionId) {
      Object.values(sections).forEach((section) => {
          if (section) {
              section.style.display = 'none';
          }
      });
      if (sections[sectionId]) {
          sections[sectionId].style.display = 'block';
      }
  }

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
  document.getElementById('studentFormLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      studentForm.style.display = 'block';
      teacherForm.style.display = 'none';
  });

  document.getElementById('teacherFormLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      studentForm.style.display = 'none';
      teacherForm.style.display = 'block';
  });

  // Update Records List
  function updateList(records, listElement, type) {
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
  }

  // Form Submit Handler for Both Student and Teacher
  function handleFormSubmit(isStudentForm) {
      const nameInput = document.getElementById(isStudentForm ? 'studentName' : 'teacherName');
      const rollInput = document.getElementById(isStudentForm ? 'studentRoll' : 'teacherRoll');

      const name = nameInput.value.trim();
      const roll = rollInput.value.trim();

      if (!name || !roll) {
          alert('Both Name and Roll are required!');
          return;
      }

      const record = { name, roll };

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
  }

  // Submit Button Event for Student and Teacher Form
  submitButton?.addEventListener('click', (e) => {
      e.preventDefault();

      const isStudentFormVisible = studentForm.style.display === 'block';
      handleFormSubmit(isStudentFormVisible);
  });

  // Show List Handler
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
  document.getElementById('studentSubmitBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    handleFormSubmit(true); // Student form
});

document.getElementById('teacherSubmitBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    handleFormSubmit(false); // Teacher form
});

  // Search Functionality
  function filterList(records, query, listElement, type) {
      const filteredRecords = records.filter((record) =>
          record.name.toLowerCase().includes(query.toLowerCase())
      );
      updateList(filteredRecords, listElement, type);
  }

  studentSearchBar?.addEventListener('input', (e) => {
      filterList(studentRecords, e.target.value, studentListElement, 'student');
  });

  teacherSearchBar?.addEventListener('input', (e) => {
      filterList(teacherRecords, e.target.value, teacherListElement, 'teacher');
  });

  // Show Home Section by Default
  showSection('homeSection');
});
