<<<<<<< HEAD
window.appLoaded = true;
loadState();

// ---------- SAFE BIND HELPERS ----------
=======
loadState();

// SAFE BIND
>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f
function bindClick(id, fn) {
  const el = document.getElementById(id);
  if (el) el.onclick = fn;
}
function bindChange(id, fn) {
  const el = document.getElementById(id);
  if (el) el.onchange = fn;
}
<<<<<<< HEAD
function bindInput(id, fn) {
  const el = document.getElementById(id);
  if (el) el.oninput = fn;
}
=======
>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f
window.bindClick = bindClick;
window.bindChange = bindChange;
window.bindInput = bindInput;

<<<<<<< HEAD
// ---------- TOP BAR ----------
=======
>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f
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

<<<<<<< HEAD
bindClick("btnTutorial", () => typeof showTour === "function" && showTour());
bindClick("btnCommand", () => {
  const m = document.getElementById("cmdModal");
  if (m) m.classList.add("show");
});

// ---------- GLOBAL SCOPE DROPDOWNS ----------
function renderGlobalScope() {
  const instSel = document.getElementById("globalInstitution");
  const campusSel = document.getElementById("globalCampus");
  if (!instSel || !campusSel) return;

  instSel.innerHTML = `<option value="">Institution —</option>`;
  campusSel.innerHTML = `<option value="">Campus —</option>`;

  state.institutions.forEach(i => {
    const opt = document.createElement("option");
    opt.value = i.id;
    opt.textContent = i.name;
    instSel.appendChild(opt);
  });

  if (state.ui.selectedInstitution) {
    instSel.value = String(state.ui.selectedInstitution);
    const inst = state.institutions.find(x => x.id === state.ui.selectedInstitution);
    if (inst) {
      inst.campuses.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        campusSel.appendChild(opt);
      });
    }
  }
  if (state.ui.selectedCampus) campusSel.value = String(state.ui.selectedCampus);

  instSel.onchange = () => {
    state.ui.selectedInstitution = Number(instSel.value) || null;
    state.ui.selectedCampus = null;
    saveState();
    renderGlobalScope();
    refreshAllViews();
  };

  campusSel.onchange = () => {
    state.ui.selectedCampus = Number(campusSel.value) || null;
    saveState();
    refreshAllViews();
  };
}

function refreshAllViews() {
  initView(state.ui.currentView || "dashboard");
}

// ---------- VIEW INIT ----------
function initView(view) {
  if (view === "dashboard") {
    if (typeof initReportsModule === "function") initReportsModule();
    if (typeof initEventsModule === "function") initEventsModule(true);
=======
// MAIN INIT ROUTER
function initView(view) {
  if (view === "dashboard") {
    if (typeof initDashboardModule === "function") initDashboardModule();
>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f
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
<<<<<<< HEAD
    if (typeof initTimetableModule === "function") initTimetableModule();
  }

  if (view === "exams") {
    if (typeof initExamsModule === "function") initExamsModule();
    if (typeof initResultsModule === "function") initResultsModule();
  }
=======
  if (typeof initTimetableModule === "function") initTimetableModule();
}

if (view === "exams") {
  if (typeof initExamsModule === "function") initExamsModule();
}

if (view === "results") {
  if (typeof initResultsModule === "function") initResultsModule();
}

>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f

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

<<<<<<< HEAD
// ---------- START ----------
renderGlobalScope();
=======
// START
>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f
switchView(state.ui.currentView || "dashboard");
initView(state.ui.currentView || "dashboard");
