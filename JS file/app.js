window.appLoaded = true;

loadState();

// ---------- SAFE BIND HELPERS (prevents everything breaking) ----------
function bindClick(id, fn) {
  const el = document.getElementById(id);
  if (el) el.onclick = fn;
}
function bindChange(id, fn) {
  const el = document.getElementById(id);
  if (el) el.onchange = fn;
}

// make accessible to other files if needed
window.bindClick = bindClick;
window.bindChange = bindChange;

// ---------- GLOBAL TOP BAR ----------
bindClick("btnReset", () => {
  if (confirm("Reset ALL data?")) {
    localStorage.removeItem(STORE_KEY);
    location.reload();
  }
});

bindClick("btnExport", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "educore-backup.json";
  a.click();
});

bindChange("importFile", e => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    Object.assign(state, JSON.parse(reader.result));
    saveState();
    location.reload();
  };
  reader.readAsText(file);
});

bindClick("btnTutorial", () => typeof showTour === "function" && showTour());
bindClick("btnTutorial2", () => typeof showTour === "function" && showTour());
bindClick("btnCommand", () => {
  const m = document.getElementById("cmdModal");
  if (m) m.classList.add("show");
});

// ---------- MODULE INIT ROUTER ----------
function initView(view) {
  // Setup
  if (view === "setup") {
    bindClick("btnAddInstitution", () => typeof addInstitution === "function" && addInstitution());
    bindClick("btnAddCampus", () => typeof addCampus === "function" && addCampus());
    bindClick("btnAddClass", () => typeof addClass === "function" && addClass());
    bindClick("btnAddSection", () => {
      // IMPORTANT: section library version
      if (typeof addLibrarySection === "function") addLibrarySection();
      else if (typeof addSection === "function") addSection();
    });
    bindClick("btnAddSubject", () => typeof addSubject === "function" && addSubject());

    if (typeof renderInstitutions === "function") renderInstitutions();
    if (typeof renderCampuses === "function") renderCampuses();
    if (typeof renderClasses === "function") renderClasses();
    if (typeof renderSectionsForSelectedClass === "function") renderSectionsForSelectedClass();
    if (typeof renderSubjects === "function") renderSubjects();
  }

  // Employees (HR)
  if (view === "employees") {
    if (typeof initEmployeesModule === "function") initEmployeesModule();
    if (typeof initEmployeesActions === "function") initEmployeesActions();
  }

  // Students
  if (view === "students") {
    if (typeof initStudentsModule === "function") initStudentsModule();
  }

  // Fees
  if (view === "fees") {
    if (typeof initFeesModule === "function") initFeesModule();
  }

  // Expenses
  if (view === "expenses") {
    if (typeof initExpensesModule === "function") initExpensesModule();
  }

  // Events
  if (view === "events") {
    if (typeof initEventsModule === "function") initEventsModule();
  }

  // Attendance
  if (view === "attendance") {
    if (typeof initAttendanceModule === "function") initAttendanceModule();
  }

  // Payroll
  if (view === "payroll") {
    if (typeof initPayrollModule === "function") initPayrollModule();
  }

  // Reports
  if (view === "reports") {
    if (typeof initReportsModule === "function") initReportsModule();
  }

  saveState();
}

// ---------- SIDEBAR NAV ----------
document.querySelectorAll(".navItem").forEach(btn => {
  btn.onclick = () => {
    const view = btn.dataset.view;
    switchView(view);
    initView(view);
  };
});

// ---------- START APP ----------
switchView(state.ui.currentView || "dashboard");
initView(state.ui.currentView || "dashboard");
  // Dashboard shortcuts
  if (view === "dashboard") {
    if (typeof initDashboardModule === "function") initDashboardModule();
  }

  // Timetable
  if (view === "timetable") {
    if (typeof initTimetableModule === "function") initTimetableModule();
  }

  // Settings
  if (view === "settings") {
    if (typeof initSettingsModule === "function") initSettingsModule();
  }
  if (view === "students") {
  if (typeof initStudentsModule === "function") initStudentsModule();
}


