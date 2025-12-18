const STORE_KEY = "educore_nexus_v1";

const state = {
  sectionLibrary: [],
  institutions: [],
  employees: [],
  students: [],
  attendance: {},
  leaves: [],
  fees: [],
  expenses: [],
  events: [],
  settings: {
    latePenalty: 300,
    absentMode: "daily"
  },
ui: {
  currentView: "dashboard",
  selectedInstitution: null,
  selectedCampus: null,
  selectedClass: null,
  selectedEmployee: null,
  selectedStudent: null
}

  }


function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function loadState() {
  const data = localStorage.getItem(STORE_KEY);
  if (data) Object.assign(state, JSON.parse(data));
}
