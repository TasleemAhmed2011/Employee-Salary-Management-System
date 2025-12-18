// ===============================
// ATTENDANCE MODULE — FINAL
// ===============================

// Helpers
function $(id) {
  return document.getElementById(id);
}

// ---------- STATE ----------
state.attendance = state.attendance || {};
state.leaves = state.leaves || [];

// ---------- INIT ----------
function initAttendanceModule() {
  // Month picker
  bindChange("monthPicker", (e) => {
    const [y, m] = e.target.value.split("-");
    generateCalendar(+y, +m - 1);
  });

  // Bulk buttons
  bindClick("btnAllPresent", markAllPresent);
  bindClick("btnAllAbsent", markAllAbsent);

  // Leave
  bindClick("btnAddLeave", addLeave);

  updateAttendanceScope();
}

// ---------- EMPLOYEE SELECTION ----------
function getSelectedEmployee() {
  const empId = state.ui.selectedEmployee;
  if (!empId) return null;
  return (state.employees || []).find(e => e.id === empId);
}

function updateAttendanceScope() {
  const emp = getSelectedEmployee();
  const badge = $("attendanceScopeBadge");
  const panel = $("selectedEmployeePanel2");

  if (!emp) {
    badge.textContent = "Scope: —";
    panel.innerHTML = `<div class="muted">Select an employee in Employees module.</div>`;
    $("calendar").innerHTML = "";
    return;
  }

  badge.textContent = `Scope: ${emp.name}`;
  panel.innerHTML = `<strong>${emp.name}</strong><div class="muted">${emp.role}</div>`;
}

// ---------- CALENDAR ----------
function generateCalendar(year, month) {
  const emp = getSelectedEmployee();
  if (!emp) return toast("Select an employee first");

  const cal = $("calendar");
  cal.innerHTML = "";

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Padding
  for (let i = 0; i < firstDay; i++) {
    cal.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${emp.id}-${year}-${month}-${d}`;
    const status = state.attendance[key] || "present";

    const cell = document.createElement("div");
    cell.className = `dayCell ${status}`;
    cell.innerHTML = `<div class="dayNum">${d}</div>`;

    cell.onclick = () => {
      state.attendance[key] = nextStatus(state.attendance[key]);
      saveState();
      generateCalendar(year, month);
    };

    cal.appendChild(cell);
  }
}

function nextStatus(cur) {
  if (cur === "present") return "absent";
  if (cur === "absent") return "late";
  if (cur === "late") return "leave";
  return "present";
}

// ---------- BULK ACTIONS ----------
function markAllPresent() {
  bulkSet("present");
}
function markAllAbsent() {
  bulkSet("absent");
}

function bulkSet(status) {
  const emp = getSelectedEmployee();
  const val = $("monthPicker").value;
  if (!emp || !val) return toast("Select employee and month");

  const [y, m] = val.split("-");
  const days = new Date(+y, +m, 0).getDate();

  for (let d = 1; d <= days; d++) {
    state.attendance[`${emp.id}-${y}-${m - 1}-${d}`] = status;
  }

  saveState();
  generateCalendar(+y, +m - 1);
}

// ---------- LEAVE ----------
function addLeave() {
  const emp = getSelectedEmployee();
  if (!emp) return toast("Select employee first");

  const type = $("leaveType").value;
  const reason = $("leaveReason").value;
  const start = $("leaveStart").value;
  const end = $("leaveEnd").value;

  if (!start || !end) return toast("Select leave dates");

  state.leaves.push({
    id: Date.now(),
    empId: emp.id,
    type,
    reason,
    start,
    end
  });

  applyLeaveToCalendar(emp.id, start, end);
  saveState();
  renderLeaveList();
  toast("Leave added ✅");
}

function applyLeaveToCalendar(empId, start, end) {
  const s = new Date(start);
  const e = new Date(end);

  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    const key = `${empId}-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    state.attendance[key] = "leave";
  }
}

function renderLeaveList() {
  const list = $("leaveList");
  list.innerHTML = "";

  const emp = getSelectedEmployee();
  if (!emp) return;

  const leaves = state.leaves.filter(l => l.empId === emp.id);

  leaves.forEach(l => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <strong>${l.type}</strong>
      <div class="muted">${l.start} → ${l.end}</div>
    `;
    list.appendChild(div);
  });
}
