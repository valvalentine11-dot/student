"use strict";

// ── Data Structure: Array of student objects ──
let students = [];
let nextId = 1;

// ── DOM Elements ──
const studentNameInput = document.getElementById("studentName");
const studentGradeInput = document.getElementById("studentGrade");
const addBtn = document.getElementById("addBtn");
const studentList = document.getElementById("studentList");
const averageGradeDisplay = document.getElementById("averageGrade");
const studentCountDisplay = document.getElementById("studentCount");
const emptyMessage = document.getElementById("emptyMessage");
const errorMessage = document.getElementById("errorMessage");

// ── Load from localStorage on page load ──
function loadFromStorage() {
  const stored = localStorage.getItem("studentTrackerData");
  if (stored) {
    try {
      const data = JSON.parse(stored);
      students = data.students || [];
      nextId = data.nextId || 1;
      renderStudents();
    } catch (e) {
      console.log("Error loading from localStorage:", e);
    }
  }
}

// ── Save to localStorage ──
function saveToStorage() {
  localStorage.setItem("studentTrackerData", JSON.stringify({ students, nextId }));
}

// ── Show error message ──
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  setTimeout(() => {
    errorMessage.classList.remove("show");
  }, 4000);
}

// ── Validate input ──
function validateInput(name, grade) {
  const nameInput = document.getElementById("studentName");
  const gradeInput = document.getElementById("studentGrade");

  nameInput.classList.remove("error");
  gradeInput.classList.remove("error");

  if (!name.trim()) {
    nameInput.classList.add("error");
    showError("Student name cannot be empty!");
    return false;
  }

  const gradeNum = parseFloat(grade);
  if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
    gradeInput.classList.add("error");
    showError("Grade must be a number between 0 and 100!");
    return false;
  }

  return true;
}

// ── Calculate average grade ──
function calculateAverage() {
  if (students.length === 0) return 0;
  const sum = students.reduce((acc, student) => acc + student.grade, 0);
  return (sum / students.length).toFixed(2);
}

// ── Update average grade display ──
function updateStats() {
  const average = calculateAverage();
  averageGradeDisplay.textContent = average;
  studentCountDisplay.textContent = `${students.length} student${students.length !== 1 ? "s" : ""}`;
}
// ── Render student list to DOM ──
function renderStudents() {
  const average = parseFloat(calculateAverage());
  studentList.innerHTML = "";

  if (students.length === 0) {
    emptyMessage.style.display = "block";
    updateStats();
    return;
  }

  emptyMessage.style.display = "none";

  students.forEach((student) => {
    const listItem = document.createElement("li");
    listItem.className = "student-item";

    if (student.grade > average) {
      listItem.className += " above-average";
    }

    listItem.innerHTML = `
      <div class="student-info">
        <span class="student-name">${student.name}</span>
        <span class="student-grade">${student.grade}%</span>
      </div>
      <button class="btn-delete" data-id="${student.id}">Delete</button>
    `;

    studentList.appendChild(listItem);
  });

  updateStats();

  // ── Add delete event listeners ──
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.getAttribute("data-id"));
      deleteStudent(id);
    });
  });
}
// ── Add student ──
function addStudent(name, grade) {
  if (!validateInput(name, grade)) {
    return;
  }

  const newStudent = {
    id: nextId++,
    name: name.trim(),
    grade: parseFloat(grade),
  };

  students.push(newStudent);
  saveToStorage();
  renderStudents();

  studentNameInput.value = "";
  studentGradeInput.value = "";
  studentNameInput.focus();
}
// ── Delete student ──
function deleteStudent(id) {
  students = students.filter((student) => student.id !== id);
  saveToStorage();
  renderStudents();
}
// ── Event listeners ──
addBtn.addEventListener("click", () => {
  addStudent(studentNameInput.value, studentGradeInput.value);
});
studentNameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addStudent(studentNameInput.value, studentGradeInput.value);
  }
});

studentGradeInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addStudent(studentNameInput.value, studentGradeInput.value);
  }
});

// ── Initialize ──
loadFromStorage();
