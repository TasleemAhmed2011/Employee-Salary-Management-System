// ===============================
// EMPLOYEES MODULE (FINAL FIXED)
// - Dropdowns: Institution -> Campus
// - Save/Update Employee
// - Directory: Search + Role Filter + Scope by Inst/Campus
// - Edit + Delete
// ===============================

function _empEls() {
  return {
    inst: document.getElementById("empInstitution"),
    campus: document.getElementById("empCampus"),

    name: document.getElementById("empName"),
    age: document.getElementById("empAge"),
    role: document.getElementById("empRole"),
    salary: document.getElementById("empSalary"),
    phone: document.getElementById("empPhone"),
    email: document.getElementById("empEmail"),
    idNo: document.getElementById("empIdNo"),
    joinDate: document.getElementById("empJoinDate"),
    notes: document.getElementById("empNotes"),

    list: document.getElementById("employeeList"),
    search: document.getElementById("searchEmp"),
    filterRole: document.getElementById("filterRole"),

    btnSave: document.getElementById("btnSaveEmp"),
    btnCancelEdit: document.getElementById("btnCancelEmpEdit")
  };
}

function getEmployeeById(id) {
  return (state.employees || []).find(e => e.id === id);
}

// ---------- Dropdowns ----------
function renderEmployeeInstitutions() {
  const { inst, campus } = _empEls();
  if (!inst || !campus) return;

  inst.innerHTML = `<option value="">Select Institution</option>`;
  campus.innerHTML = `<option value="">Select Campus</option>`;

  state.institutions.forEach(i => {
    const opt = document.createElement("option");
    opt.value = i.id;
    opt.textContent = i.name;
    inst.appendChild(opt);
  });

  // restore saved selection
  if (state.ui.selectedInstitution) {
    inst.value = String(state.ui.selectedInstitution);
    renderEmployeeCampuses();

    if (state.ui.selectedCampus) {
      campus.value = String(state.ui.selectedCampus);
    }
  }
}

function renderEmployeeCampuses() {
  const { inst, campus } = _empEls();
  if (!inst || !campus) return;

  const instId = Number(inst.value);
  campus.innerHTML = `<option value="">Select Campus</option>`;

  const institution = state.institutions.find(i => i.id === instId);
  if (!institution) return;

  institution.campuses.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    campus.appendChild(opt);
  });
}

// ---------- Init ----------
function initEmployeesModule() {
  state.employees = state.employees || [];
  state.ui = state.ui || {};

  renderEmployeeInstitutions();

  const { inst, campus, search, filterRole } = _empEls();

  if (inst) {
    inst.onchange = () => {
      state.ui.selectedInstitution = Number(inst.value) || null;
      state.ui.selectedCampus = null;
      saveState();

      renderEmployeeCampuses();
      renderEmployeeDirectory();
    };
  }

  if (campus) {
    campus.onchange = () => {
      state.ui.selectedCampus = Number(campus.value) || null;
      saveState();
      renderEmployeeDirectory();
    };
  }

  // ✅ THIS WAS MISSING: search + filter bindings
  if (search) search.oninput = () => renderEmployeeDirectory();
  if (filterRole) filterRole.onchange = () => renderEmployeeDirectory();

  renderEmployeeDirectory();
}

function initEmployeesActions() {
  bindClick("btnAddEmployee", () => toast("Fill form → click Save Employee"));

  bindClick("btnClearEmp", () => {
    clearEmployeeForm(true);
    state.ui.editingEmployeeId = null;
    const { btnSave } = _empEls();
    if (btnSave) btnSave.textContent = "Save Employee";
    renderEmployeeDirectory();
  });

  bindClick("btnSaveEmp", addOrUpdateEmployee);

  // Cancel edit is optional (only if button exists)
  const { btnCancelEdit } = _empEls();
  if (btnCancelEdit) {
    btnCancelEdit.onclick = () => {
      state.ui.editingEmployeeId = null;
      saveState();
      clearEmployeeForm(false);
      const { btnSave } = _empEls();
      if (btnSave) btnSave.textContent = "Save Employee";
    };
  }
}

// ---------- Save / Update ----------
function addOrUpdateEmployee() {
  const { inst, campus, name, btnSave } = _empEls();

  const instId = Number(inst?.value);
  const campusId = Number(campus?.value);

  if (!instId || !campusId) return toast("Select Institution and Campus");

  const empName = (name?.value || "").trim();
  if (!empName) return toast("Employee name is required");

  const payload = {
    institutionId: instId,
    campusId,
    name: empName,
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
    const idx = state.employees.findIndex(e => e.id === editingId);
    if (idx === -1) return toast("Employee not found");

    state.employees[idx] = { ...state.employees[idx], ...payload };
    state.ui.editingEmployeeId = null;

    if (btnSave) btnSave.textContent = "Save Employee";
    toast("Employee updated ✅");
  } else {
    state.employees.push({ id: Date.now(), ...payload });
    toast("Employee saved ✅");
  }

  saveState();
  renderEmployeeDirectory();
  clearEmployeeForm(false);
}

// ---------- Form ----------
function clearEmployeeForm(resetDropdowns = false) {
  [
    "empName","empAge","empSalary","empPhone",
    "empEmail","empIdNo","empJoinDate","empNotes"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  // Optional: reset teacher fields too if you have them
  ["tSubjects", "tClass", "tSections"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  if (resetDropdowns) {
    const { inst, campus } = _empEls();
    if (inst) inst.value = "";
    if (campus) campus.value = "";
    state.ui.selectedInstitution = null;
    state.ui.selectedCampus = null;
    saveState();
    renderEmployeeInstitutions();
  }
}

// ---------- Directory (Search + Filter) ----------
function renderEmployeeDirectory() {
  const { list, search, filterRole, inst, campus } = _empEls();
  if (!list) return;

  let rows = (state.employees || []).slice();

  // Scope by selected inst/campus (from dropdowns on HR page)
  const instId = Number(inst?.value) || null;
  const campusId = Number(campus?.value) || null;

  if (instId) rows = rows.filter(e => Number(e.institutionId) === instId);
  if (campusId) rows = rows.filter(e => Number(e.campusId) === campusId);

  // Search
  const q = (search?.value || "").trim().toLowerCase();
  if (q) {
    rows = rows.filter(e =>
      (e.name || "").toLowerCase().includes(q) ||
      (e.email || "").toLowerCase().includes(q) ||
      (e.phone || "").toLowerCase().includes(q)
    );
  }

  // Role filter
  const role = (filterRole?.value || "").trim();
  if (role && role !== "All" && role !== "All Roles") {
    rows = rows.filter(e => (e.role || "") === role);
  }

  list.innerHTML = "";

  if (rows.length === 0) {
    list.innerHTML = `<div class="muted">No employees found</div>`;
    return;
  }

  rows.forEach(emp => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${emp.name || "Unnamed"}</div>
        <div class="itemSub">${emp.role || "—"} · PKR ${emp.salary || "—"}</div>
      </div>
      <div class="itemActions">
        <button class="iconBtn" onclick="selectEmployee(${emp.id})">Edit</button>
        <button class="iconBtn danger" onclick="deleteEmployee(${emp.id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

// ---------- Edit / Delete ----------
function selectEmployee(empId) {
  const emp = getEmployeeById(empId);
  if (!emp) return;

  state.ui.editingEmployeeId = empId;
  saveState();

  const { inst, campus, btnSave } = _empEls();

  if (inst) inst.value = String(emp.institutionId);
  renderEmployeeCampuses();
  if (campus) campus.value = String(emp.campusId);

  document.getElementById("empName").value = emp.name || "";
  document.getElementById("empAge").value = emp.age || "";
  document.getElementById("empRole").value = emp.role || "";
  document.getElementById("empSalary").value = emp.salary || "";
  document.getElementById("empPhone").value = emp.phone || "";
  document.getElementById("empEmail").value = emp.email || "";
  document.getElementById("empIdNo").value = emp.idNo || "";
  document.getElementById("empJoinDate").value = emp.joinDate || "";
  document.getElementById("empNotes").value = emp.notes || "";

  if (btnSave) btnSave.textContent = "Update Employee";
}

function deleteEmployee(id) {
  if (!confirm("Delete this employee?")) return;
  state.employees = (state.employees || []).filter(e => e.id !== id);
  saveState();
  renderEmployeeDirectory();
}
