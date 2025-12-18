// ===============================
// EMPLOYEES MODULE (FINAL CLEAN)
// ===============================

function renderEmployeeInstitutions() {
  const instSelect = document.getElementById("empInstitution");
  const campusSelect = document.getElementById("empCampus");
  if (!instSelect || !campusSelect) return;

  instSelect.innerHTML = `<option value="">Select Institution</option>`;
  campusSelect.innerHTML = `<option value="">Select Campus</option>`;

  state.institutions.forEach(inst => {
    const opt = document.createElement("option");
    opt.value = inst.id;
    opt.textContent = inst.name;
    instSelect.appendChild(opt);
  });

  // auto select saved institution (if any)
  if (state.ui.selectedInstitution) {
    instSelect.value = String(state.ui.selectedInstitution);
    renderEmployeeCampuses();
  }
}

function renderEmployeeCampuses() {
  const instSelect = document.getElementById("empInstitution");
  const campusSelect = document.getElementById("empCampus");
  if (!instSelect || !campusSelect) return;

  const instId = Number(instSelect.value);
  campusSelect.innerHTML = `<option value="">Select Campus</option>`;

  const inst = state.institutions.find(i => i.id === instId);
  if (!inst) return;

  inst.campuses.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    campusSelect.appendChild(opt);
  });

  // auto select saved campus (if any)
  if (state.ui.selectedCampus) {
    campusSelect.value = String(state.ui.selectedCampus);
  }
}

function initEmployeesModule() {
  // 1) Fill dropdowns
  renderEmployeeInstitutions();

  // 2) When institution changes -> refresh campuses + save selection
  const instSelect = document.getElementById("empInstitution");
  const campusSelect = document.getElementById("empCampus");

  if (instSelect) {
    instSelect.onchange = () => {
      state.ui.selectedInstitution = Number(instSelect.value) || null;
      state.ui.selectedCampus = null;
      saveState();

      renderEmployeeCampuses();
    };
  }

  // 3) When campus changes -> save selection
  if (campusSelect) {
    campusSelect.onchange = () => {
      state.ui.selectedCampus = Number(campusSelect.value) || null;
      saveState();
    };
  }
}

function initEmployeesActions() {
  // NOTE: bindClick is provided by app.js (global)

  bindClick("btnAddEmployee", () => toast("Fill form → click Save Employee"));

  bindClick("btnClearEmp", () => {
    [
      "empInstitution","empCampus","empName","empAge","empRole","empSalary",
      "tSubjects","tClass","tSections",
      "empPhone","empEmail","empIdNo","empJoinDate","empNotes"
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    // reset dropdowns again
    state.ui.selectedInstitution = null;
    state.ui.selectedCampus = null;
    saveState();
    renderEmployeeInstitutions();
  });

  bindClick("btnSaveEmp", () => {
    if (typeof addEmployee === "function") addEmployee();
    else toast("✅ Save button works. Next: create addEmployee() logic.");
  });
}
