const STORE_KEY = "educore_nexus_v1";

// ---------- Storage ----------
let state = {
  ui: {
    currentView: "dashboard",
    // global scope for whole app
    scopeInstitutionId: null,
    scopeCampusId: null,

    // module-specific
    selectedEmployeeId: null,
    editingEmployeeId: null,
    selectedStudentId: null,
    editingStudentId: null,

    attendanceMode: "employee", // "employee" | "student"
    attendanceMonth: null
  },

  institutions: [],   // [{id,name,type,campuses:[{id,name}], classes:[{id,name,campusId}], sections:[{id,name,classId}]}]
  subjects: [],       // [{id,name,code}]
  employees: [],      // [{id,institutionId,campusId,name,role,salary,...}]
  students: [],       // [{id,institutionId,campusId,classId,sectionId,name,roll,...}]
  attendance: {
    employee: {},     // key: empId -> { "YYYY-MM": { dayNumber: "P|A|L|LV|OFF" } }
    student: {}       // key: "classId-sectionId-YYYY-MM" -> { studentId: { day: "P|A|L|LV|OFF"} }
  },
  leaves: [],         // [{id,employeeId,type,reason,start,end}]
  timetable: [],      // [{id,classId,sectionId,grid:{...}}]
  exams: [],          // [{id,name,term,start,end,classes:[classId], subjects:[{name,maxMarks}], files:[]}]
  results: [],        // [{id,examId,classId,sectionId,marks:{studentId:{subjectName:score}}, createdAt}]
  events: []          // [{id,title,start,end,type}]
};

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
  // ensure arrays exist
  state.ui = state.ui || {};
  state.institutions = state.institutions || [];
  state.subjects = state.subjects || [];
  state.employees = state.employees || [];
  state.students = state.students || [];
  state.attendance = state.attendance || { employee: {}, student: {} };
  state.attendance.employee = state.attendance.employee || {};
  state.attendance.student = state.attendance.student || {};
  state.leaves = state.leaves || [];
  state.timetable = state.timetable || [];
  state.exams = state.exams || [];
  state.results = state.results || [];
  state.events = state.events || [];

  // seed demo if empty
  if (state.institutions.length === 0) seedDemoData();

  saveState();
}

function seedDemoData() {
  const instId = Date.now();
  const campusA = instId + 1;
  const campusB = instId + 2;

  const class8 = instId + 10;
  const classO1 = instId + 11;

  const secA = instId + 20;
  const secB = instId + 21;

  state.institutions.push({
    id: instId,
    type: "School",
    name: "Benchmark School",
    campuses: [
      { id: campusA, name: "Main Campus" },
      { id: campusB, name: "O-Level Campus" }
    ],
    classes: [
      { id: class8, name: "Grade 8", campusId: campusA },
      { id: classO1, name: "Grade O-1", campusId: campusB }
    ],
    sections: [
      { id: secA, name: "Al-Siddique", classId: class8 },
      { id: secB, name: "Al-Farooq", classId: classO1 }
    ]
  });

  state.ui.scopeInstitutionId = instId;
  state.ui.scopeCampusId = campusB;

  state.subjects = [
    { id: instId + 100, name: "Mathematics", code: "MATH" },
    { id: instId + 101, name: "Physics", code: "PHY" },
    { id: instId + 102, name: "Computer Science", code: "CS" },
    { id: instId + 103, name: "English", code: "ENG" }
  ];

  state.employees.push(
    { id: instId + 200, institutionId: instId, campusId: campusB, name: "Sir Ahmed", role: "Teacher", salary: 135000, phone: "0321-1234567", email: "ahmed@gmail.com" },
    { id: instId + 201, institutionId: instId, campusId: campusA, name: "Miss Sara", role: "Coordinator", salary: 120000, phone: "0333-5551111", email: "sara@gmail.com" }
  );

  state.students.push(
    { id: instId + 300, institutionId: instId, campusId: campusA, classId: class8, sectionId: secA, name: "Ahmed Ali", roll: "8-A-014", age: 14, guardian: "Liaquat Ali", phone: "03xx-xxxxxxx" },
    { id: instId + 301, institutionId: instId, campusId: campusB, classId: classO1, sectionId: secB, name: "Usman Khan", roll: "O1-F-007", age: 15, guardian: "Aslam Khan", phone: "03xx-xxxxxxx" }
  );

  state.events.push(
    { id: instId + 400, title: "Mock Exams", start: "2026-01-09", end: "2026-01-15", type: "exam" },
    { id: instId + 401, title: "Final Term Examination", start: "2026-05-17", end: "2026-06-02", type: "exam" }
  );
}
