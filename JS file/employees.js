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
function getEmployeeById(id) {
  return (state.employees || []).find(e => e.id === id);
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
  renderEmployeeDirectory();

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
  });
  bindClick("btnCancelEmpEdit", () => {
  state.ui.editingEmployeeId = null;
  saveState();
  document.getElementById("btnSaveEmp").textContent = "Save Employee";
  clearEmployeeForm(false);
});

}
function addEmployee() {
  const instId = Number(document.getElementById("empInstitution")?.value);
  const campusId = Number(document.getElementById("empCampus")?.value);
  if (!instId || !campusId) return toast("Select Institution and Campus");

  const name = document.getElementById("empName").value.trim();
  if (!name) return toast("Employee name is required");

  state.employees = state.employees || [];

  const payload = {
    institutionId: instId,
    campusId,
    name,
    age: document.getElementById("empAge").value,
    role: document.getElementById("empRole").value,
    salary: document.getElementById("empSalary").value,
    phone: document.getElementById("empPhone").value,
    email: document.getElementById("empEmail").value,
    idNo: document.getElementById("empIdNo").value,
    joinDate: document.getElementById("empJoinDate").value,
    notes: document.getElementById("empNotes").value
  };

  const editingId = state.ui.editingEmployeeId;

  if (editingId) {
    // UPDATE
    const idx = state.employees.findIndex(e => e.id === editingId);
    if (idx === -1) return toast("Employee not found");

    state.employees[idx] = { ...state.employees[idx], ...payload };
    state.ui.editingEmployeeId = null;

    document.getElementById("btnSaveEmp").textContent = "Save Employee";
    toast("Employee updated ✅");
  } else {
    // CREATE
    state.employees.push({ id: Date.now(), ...payload });
    toast("Employee saved ✅");
  }

  saveState();
  renderEmployeeDirectory();
  clearEmployeeForm(false);
}

function clearEmployeeForm() {
  [
    "empName","empAge","empSalary","empPhone",
    "empEmail","empJoinDate","empNotes"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}
function renderEmployeeDirectory() {
  const wrap = document.getElementById("employeeList");
  if (!wrap) return;

  wrap.innerHTML = "";

  if (!state.employees || state.employees.length === 0) {
    wrap.innerHTML = `<div class="muted">No employees yet</div>`;
    return;
  }

  state.employees.forEach(emp => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <strong>${emp.name}</strong>
      <div class="muted">${emp.role} · PKR ${emp.salary}</div>
    `;

    div.onclick = () => selectEmployee(emp.id);
    wrap.appendChild(div);
  });
}
function selectEmployee(empId) {
  state.ui.selectedEmployee = empId;
  saveState();
  toast("Employee selected");
}


function selectEmployee(empId) {
  const emp = getEmployeeById(empId);
  if (!emp) return;

  state.ui.editingEmployeeId = empId;
  saveState();

  // fill form
  document.getElementById("empInstitution").value = String(emp.institutionId);
  renderEmployeeCampuses();
  document.getElementById("empCampus").value = String(emp.campusId);

  document.getElementById("empName").value = emp.name || "";
  document.getElementById("empAge").value = emp.age || "";
  document.getElementById("empRole").value = emp.role || "";
  document.getElementById("empSalary").value = emp.salary || "";
  document.getElementById("empPhone").value = emp.phone || "";
  document.getElementById("empEmail").value = emp.email || "";
  document.getElementById("empIdNo").value = emp.idNo || "";
  document.getElementById("empJoinDate").value = emp.joinDate || "";
  document.getElementById("empNotes").value = emp.notes || "";

  // UI: change button text
  document.getElementById("btnSaveEmp").textContent = "Update Employee";
}