// ===============================
// ATTENDANCE MODULE — FINAL (WITH DROPDOWNS)
// ===============================

function $(id){ return document.getElementById(id); }

state.attendance = state.attendance || {};
state.leaves = state.leaves || [];
state.ui = state.ui || {};

function initAttendanceModule() {
  renderAttendanceInstitutions();

  bindChange("attInstitution", () => {
    state.ui.attInstitution = Number($("attInstitution").value) || null;
    state.ui.attCampus = null;
    state.ui.attSector = null;
    state.ui.selectedEmployee = null;
    saveState();
    renderAttendanceCampuses();
    renderAttendanceSectors();
    renderAttendanceTeachers();
    updateAttendanceScope();
  });

  bindChange("attCampus", () => {
    state.ui.attCampus = Number($("attCampus").value) || null;
    state.ui.attSector = null;
    state.ui.selectedEmployee = null;
    saveState();
    renderAttendanceSectors();
    renderAttendanceTeachers();
    updateAttendanceScope();
  });

  bindChange("attSector", () => {
    state.ui.attSector = String($("attSector").value || "");
    saveState();
  });

  bindChange("attTeacher", () => {
    state.ui.selectedEmployee = Number($("attTeacher").value) || null;
    saveState();
    updateAttendanceScope();
    autoGenerateMonthIfEmpty();
  });

  // Month picker
  bindChange("monthPicker", (e) => {
    const emp = getSelectedEmployee();
    if (!emp) return toast("Select teacher first");
    const [y, m] = e.target.value.split("-");
    generateCalendar(+y, +m - 1);
  });

  // Bulk buttons
  bindClick("btnAllPresent", markAllPresent);
  bindClick("btnAllAbsent", markAllAbsent);

  // Leave
  bindClick("btnAddLeave", addLeave);

  // Restore saved selections
  restoreAttendanceSelections();
  updateAttendanceScope();
  renderLeaveList();
}

function restoreAttendanceSelections(){
  if ($("attInstitution") && state.ui.attInstitution) $("attInstitution").value = String(state.ui.attInstitution);
  renderAttendanceCampuses();
  if ($("attCampus") && state.ui.attCampus) $("attCampus").value = String(state.ui.attCampus);

  renderAttendanceSectors();
  if ($("attSector") && state.ui.attSector) $("attSector").value = String(state.ui.attSector);

  renderAttendanceTeachers();
  if ($("attTeacher") && state.ui.selectedEmployee) $("attTeacher").value = String(state.ui.selectedEmployee);

  autoGenerateMonthIfEmpty();
}

function autoGenerateMonthIfEmpty(){
  const mp = $("monthPicker");
  if (!mp) return;
  if (!mp.value) {
    const now = new Date();
    mp.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  }
  const [y,m] = mp.value.split("-");
  if (state.ui.selectedEmployee) generateCalendar(+y, +m-1);
}

function getSelectedEmployee() {
  const id = Number(state.ui.selectedEmployee);
  if (!id) return null;
  return (state.employees || []).find(e => e.id === id) || null;
}

// ---------- DROPDOWNS ----------
function renderAttendanceInstitutions(){
  const sel = $("attInstitution");
  if (!sel) return;

  sel.innerHTML = `<option value="">Select Institution</option>`;
  (state.institutions || []).forEach(inst => {
    const opt = document.createElement("option");
    opt.value = inst.id;
    opt.textContent = inst.name;
    sel.appendChild(opt);
  });
}

function renderAttendanceCampuses(){
  const instSel = $("attInstitution");
  const campusSel = $("attCampus");
  if (!instSel || !campusSel) return;

  campusSel.innerHTML = `<option value="">Select Campus</option>`;
  const instId = Number(instSel.value);
  const inst = (state.institutions || []).find(i => i.id === instId);
  if (!inst) return;

  (inst.campuses || []).forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    campusSel.appendChild(opt);
  });
}

function renderAttendanceSectors(){
  const sector = $("attSector");
  if (!sector) return;

  sector.innerHTML = `<option value="">All Programs</option>`;

  // We treat "Classes/Programs" in setup as sector options
  // If you stored them differently, tell me and I’ll map it.
  const instId = Number($("attInstitution")?.value);
  const campusId = Number($("attCampus")?.value);

  const inst = (state.institutions || []).find(i => i.id === instId);
  const campus = inst?.campuses?.find(c => c.id === campusId);
  const classes = campus?.classes || inst?.classes || []; // supports either storage

  // fallback demo sectors if none exist yet
  const sectors = (classes.length ? classes.map(x => x.name || x) : ["O-Level","Grade 8","Grade 9","A-Level"]);

  [...new Set(sectors)].forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    sector.appendChild(opt);
  });
}

function renderAttendanceTeachers(){
  const teacherSel = $("attTeacher");
  if (!teacherSel) return;

  teacherSel.innerHTML = `<option value="">Select Teacher</option>`;

  const instId = Number($("attInstitution")?.value);
  const campusId = Number($("attCampus")?.value);

  const teachers = (state.employees || []).filter(e =>
    e.role === "Teacher" &&
    (!instId || Number(e.institutionId) === instId) &&
    (!campusId || Number(e.campusId) === campusId)
  );

  teachers.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.name;
    teacherSel.appendChild(opt);
  });
}

// ---------- UI SCOPE ----------
function updateAttendanceScope() {
  const emp = getSelectedEmployee();
  const badge = $("attendanceScopeBadge");
  const panel = $("selectedEmployeePanel2");
  const cal = $("calendar");

  if (!emp) {
    if (badge) badge.textContent = "Scope: —";
    if (panel) panel.innerHTML = `<div class="muted">Select teacher using dropdown above.</div>`;
    if (cal) cal.innerHTML = "";
    return;
  }

  if (badge) badge.textContent = `Scope: ${emp.name}`;
  if (panel) panel.innerHTML = `<strong>${emp.name}</strong><div class="muted">${emp.role}</div>`;
}

// ---------- CALENDAR ----------
function generateCalendar(year, month) {
  const emp = getSelectedEmployee();
  if (!emp) return;

  const cal = $("calendar");
  if (!cal) return;
  cal.innerHTML = "";

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  for (let i = 0; i < firstDay; i++) cal.appendChild(document.createElement("div"));

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${emp.id}-${year}-${month}-${d}`;
    const status = state.attendance[key] || "present";

    const cell = document.createElement("div");
    cell.className = `dayCell ${status}`;
    cell.innerHTML = `<div class="dayNum">${d}</div>`;

    cell.onclick = () => {
      state.attendance[key] = nextStatus(state.attendance[key] || "present");
      saveState();
      generateCalendar(year, month);
    };

    cal.appendChild(cell);
  }
}

function nextStatus(cur){
  if (cur === "present") return "absent";
  if (cur === "absent") return "late";
  if (cur === "late") return "leave";
  return "present";
}

// ---------- BULK ----------
function bulkSet(status){
  const emp = getSelectedEmployee();
  const mp = $("monthPicker");
  if (!emp || !mp?.value) return toast("Select teacher + month");

  const [y, m] = mp.value.split("-");
  const days = new Date(+y, +m, 0).getDate();

  for (let d = 1; d <= days; d++) {
    state.attendance[`${emp.id}-${y}-${m-1}-${d}`] = status;
  }

  saveState();
  generateCalendar(+y, +m - 1);
}

function markAllPresent(){ bulkSet("present"); }
function markAllAbsent(){ bulkSet("absent"); }

// ---------- LEAVES ----------
function addLeave(){
  const emp = getSelectedEmployee();
  if (!emp) return toast("Select teacher first");

  const type = $("leaveType")?.value || "paid";
  const reason = $("leaveReason")?.value || "";
  const start = $("leaveStart")?.value;
  const end = $("leaveEnd")?.value;
  if (!start || !end) return toast("Select leave dates");

  const leave = { id: Date.now(), empId: emp.id, type, reason, start, end };
  state.leaves.push(leave);
  applyLeaveToCalendar(emp.id, start, end);
  saveState();
  renderLeaveList();
  autoGenerateMonthIfEmpty();
  toast("Leave added ✅");
}

function applyLeaveToCalendar(empId, start, end){
  const s = new Date(start);
  const e = new Date(end);
  for (let d = new Date(s); d <= e; d.setDate(d.getDate()+1)) {
    const key = `${empId}-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    state.attendance[key] = "leave";
  }
}

function renderLeaveList(){
  const list = $("leaveList");
  if (!list) return;
  list.innerHTML = "";

  const emp = getSelectedEmployee();
  if (!emp) return;

  const rows = (state.leaves || []).filter(l => l.empId === emp.id);

  if (!rows.length) {
    list.innerHTML = `<div class="muted">No leaves yet</div>`;
    return;
  }

  rows.forEach(l => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${l.type.toUpperCase()}</div>
        <div class="muted">${l.start} → ${l.end} • ${l.reason || "—"}</div>
      </div>
      <div class="itemActions">
        <button class="iconBtn danger" onclick="deleteLeave(${l.id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function deleteLeave(id){
  if (!confirm("Delete this leave?")) return;
  state.leaves = (state.leaves || []).filter(l => l.id !== id);
  saveState();
  renderLeaveList();
  autoGenerateMonthIfEmpty();
}
