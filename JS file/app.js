loadState();

// SAFE BIND
function bindClick(id, fn) {
  const el = document.getElementById(id);
  if (el) el.onclick = fn;
}
function bindChange(id, fn) {
  const el = document.getElementById(id);
  if (el) el.onchange = fn;
}
window.bindClick = bindClick;
window.bindChange = bindChange;

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

// MAIN INIT ROUTER
function initView(view) {
  if (view === "dashboard") {
    if (typeof initDashboardModule === "function") initDashboardModule();
  }

  if (view === "setup") {
    if (typeof initSetupModule === "function") initSetupModule();
  }

  if (view === "employees") {
    if (typeof initEmployeesModule === "function") initEmployeesModule();
    if (typeof initEmployeesActions === "function") initEmployeesActions();
  }

  if (view === "students") {
    if (typeof initStudentsModule === "function") initStudentsModule();
    if (typeof initStudentsActions === "function") initStudentsActions();
  }

  if (view === "attendance") {
    if (typeof initAttendanceModule === "function") initAttendanceModule();
  }

  if (view === "timetable") {
  if (typeof initTimetableModule === "function") initTimetableModule();
}

if (view === "exams") {
  if (typeof initExamsModule === "function") initExamsModule();
}

if (view === "results") {
  if (typeof initResultsModule === "function") initResultsModule();
}


  saveState();
}
window.initView = initView;

// SIDEBAR NAV
document.querySelectorAll(".navItem").forEach(btn => {
  btn.onclick = () => {
    const view = btn.dataset.view;
    switchView(view);
    initView(view);
  };
});

// START
switchView(state.ui.currentView || "dashboard");
initView(state.ui.currentView || "dashboard");
