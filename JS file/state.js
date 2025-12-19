const STORE_KEY = "educore_nexus_v1";

const state = {
  ui: {
    currentView: "dashboard",
    selectedInstitution: null,
    selectedCampus: null,
    selectedEmployee: null,
    editingEmployeeId: null,
    editingStudentId: null
  },

  institutions: [],
  employees: [],
  students: [],

  // Attendance per employee per month: attendance[empId][yyyy-mm][day]= "present|absent|late|leave|off"
  attendance: {},
  leaves: [],

  // Academic structure stored per institution
  // institution.campuses[] and institution.classes[] etc (managed in setup.js)
  events: [],
  exams: [],
  results: [],

  fees: [],
  expenses: [],

  settings: {
    latePenalty: 300,
    absentMode: "daily"
  }
};

// ---------- Storage ----------
function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) {
    const data = JSON.parse(raw);
    Object.assign(state, data);
  }
  ensureShape();
  if (!state.institutions.length) seedDemo();
  saveState();
}

function ensureShape() {
  state.ui = state.ui || {};
  state.institutions = state.institutions || [];
  state.employees = state.employees || [];
  state.students = state.students || [];
  state.attendance = state.attendance || {};
  state.leaves = state.leaves || [];
  state.events = state.events || [];
  state.exams = state.exams || [];
  state.results = state.results || [];
  state.fees = state.fees || [];
  state.expenses = state.expenses || [];
  state.settings = state.settings || { latePenalty: 300, absentMode: "daily" };
}

// ---------- Demo Seed ----------
function seedDemo() {
  const instId = Date.now();
  const campusId = instId + 1;

  state.institutions.push({
    id: instId,
    type: "School",
    name: "Benchmark School",
    campuses: [{ id: campusId, name: "O-level Campus" }],
    classes: [
      { id: 801, campusId, name: "Grade 8", sections: ["8A", "8B"] },
      { id: 901, campusId, name: "Grade 9", sections: ["9A", "9B"] },
      { id: 1001, campusId, name: "O-1", sections: ["O-1A", "O-1B"] }
    ],
    subjects: ["Math", "English", "Physics", "CS", "Urdu"]
  });

  state.ui.selectedInstitution = instId;
  state.ui.selectedCampus = campusId;

  state.employees.push(
    {
      id: instId + 11,
      institutionId: instId,
      campusId,
      name: "Sir Ahmed",
      age: "22",
      role: "Teacher",
      salary: "135000",
      phone: "0321-1234567",
      email: "ahmed@gmail.com",
      joinDate: "2024-11-11",
      notes: "Demo teacher",
      teacherMeta: { subjects: ["Math", "CS"], classes: ["Grade 8", "O-1"] }
    },
    {
      id: instId + 12,
      institutionId: instId,
      campusId,
      name: "Miss Sara",
      age: "25",
      role: "Coordinator",
      salary: "95000",
      phone: "0333-5551111",
      email: "sara@gmail.com",
      joinDate: "2023-09-01",
      notes: "Demo coordinator"
    }
  );

  state.students.push(
    { id: instId + 21, institutionId: instId, campusId, className: "Grade 8", section: "8A", name: "Ahmed Ali", roll: "8A-014", age: "14", guardian: "Liaquat Ali", phone: "03xx-xxxxxxx", admissionDate: "2024-01-10", address: "" },
    { id: instId + 22, institutionId: instId, campusId, className: "O-1", section: "O-1A", name: "Usman Khan", roll: "O1A-007", age: "15", guardian: "Hassan Khan", phone: "03xx-xxxxxxx", admissionDate: "2024-02-02", address: "" }
  );

  state.events.push(
    { id: instId + 31, title: "Mocks", start: "2026-01-09", end: "2026-01-15", scope: "Campus", campusId },
    { id: instId + 32, title: "Final Term Examination", start: "2026-05-17", end: "2026-06-02", scope: "Campus", campusId }
  );

  state.exams.push(
    { id: instId + 41, name: "Mocks 2026", className: "O-1", subjects: ["Math", "English", "CS"], start: "2026-01-09", end: "2026-01-15" }
  );

  state.results.push(
    { id: instId + 51, examId: instId + 41, studentId: instId + 22, marks: { Math: 78, English: 65, CS: 88 } }
  );
}
