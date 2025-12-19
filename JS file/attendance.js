<<<<<<< HEAD
// ===============================
// ATTENDANCE MODULE
// ===============================

function initAttendanceModule() {
  renderTeacherDropdown();

  bindChange("monthPicker", e => {
    const [y, m] = e.target.value.split("-");
    generateCalendar(+y, +m - 1);
  });

  bindClick("btnAllPresent", () => markAll("present"));
  bindClick("btnAllAbsent", () => markAll("absent"));
}

// ---------- TEACHERS ----------
function renderTeacherDropdown() {
  const sel = document.getElementById("attTeacher");
  if (!sel) return;

  sel.innerHTML = `<option value="">Select Teacher</option>`;

  state.employees
    .filter(e => e.role === "Teacher")
    .forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.name;
      sel.appendChild(opt);
    });
}

// ---------- CALENDAR ----------
function generateCalendar(year, month) {
=======
function initAttendanceModule() {
  // default month
  const mp = document.getElementById("monthPicker");
  if (mp && !mp.value) {
    const now = new Date();
    mp.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  }
  state.ui.attendanceMonth = mp?.value || state.ui.attendanceMonth || null;

  bindChange("monthPicker", (e) => {
    state.ui.attendanceMonth = e.target.value;
    saveState();
    renderAttendance();
  });

  bindClick("btnAllPresent", () => markAll("P"));
  bindClick("btnAllAbsent", () => markAll("A"));
  bindClick("btnAddLeave", addLeave);

  bindChange("attMode", (e) => {
    state.ui.attendanceMode = e.target.value; // employee|student
    saveState();
    renderAttendance();
  });

  bindChange("attEmployee", () => {
    state.ui.selectedEmployeeId = Number(document.getElementById("attEmployee").value) || null;
    saveState();
    renderAttendance();
  });

  bindChange("attClass", () => {
    renderAttSections();
    renderAttendance();
  });

  bindChange("attSection", () => renderAttendance());

  renderAttSelectors();
  renderAttendance();
}

// ---------- SELECTORS ----------
function renderAttSelectors() {
  // mode selector (create if not in HTML)
  const mode = document.getElementById("attMode");
  if (mode) {
    mode.innerHTML = `
      <option value="employee">Teachers/Employees</option>
      <option value="student">Students (Class-wise)</option>
    `;
    mode.value = state.ui.attendanceMode || "employee";
  }

  renderAttEmployees();
  renderAttClasses();
  renderAttSections();
}

function renderAttEmployees() {
  const sel = document.getElementById("attEmployee");
  if (!sel) return;

  sel.innerHTML = `<option value="">Select Employee</option>`;
  let rows = (state.employees || []).slice();
  rows = scopeFilter(rows);

  rows.forEach(e => {
    const o = document.createElement("option");
    o.value = e.id;
    o.textContent = `${e.name} (${e.role})`;
    sel.appendChild(o);
  });

  if (state.ui.selectedEmployeeId) sel.value = String(state.ui.selectedEmployeeId);
}

function renderAttClasses() {
  const cSel = document.getElementById("attClass");
  if (!cSel) return;

  cSel.innerHTML = `<option value="">Select Class</option>`;
  const inst = getScopedInstitution();
  if (!inst) return;

  const campusId = state.ui.scopeCampusId;
  let classes = inst.classes || [];
  if (campusId) classes = classes.filter(c => Number(c.campusId) === Number(campusId));

  classes.forEach(c => {
    const o = document.createElement("option");
    o.value = c.id;
    o.textContent = c.name;
    cSel.appendChild(o);
  });
}

function renderAttSections() {
  const sSel = document.getElementById("attSection");
  const cSel = document.getElementById("attClass");
  if (!sSel || !cSel) return;

  const classId = Number(cSel.value) || null;
  sSel.innerHTML = `<option value="">Select Section</option>`;

  const inst = getScopedInstitution();
  if (!inst || !classId) return;

  (inst.sections || []).filter(s => Number(s.classId) === classId).forEach(s => {
    const o = document.createElement("option");
    o.value = s.id;
    o.textContent = s.name;
    sSel.appendChild(o);
  });
}

// ---------- RENDER MAIN ----------
function renderAttendance() {
  const mode = state.ui.attendanceMode || "employee";
  const hint = document.getElementById("calHint");
  if (hint) hint.textContent = "";

  // toggle panels if you added them
  const empPanel = document.getElementById("attendanceEmployeePanel");
  const stuPanel = document.getElementById("attendanceStudentPanel");
  if (empPanel) empPanel.style.display = mode === "employee" ? "block" : "none";
  if (stuPanel) stuPanel.style.display = mode === "student" ? "block" : "none";

  if (!state.ui.attendanceMonth) return;

  if (mode === "employee") {
    renderEmployeeCalendar();
  } else {
    renderStudentAttendance();
  }
}

// ---------- EMPLOYEE CALENDAR ----------
function renderEmployeeCalendar() {
  const empId = state.ui.selectedEmployeeId;
>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f
  const cal = document.getElementById("calendar");
  if (!cal) return;
  cal.innerHTML = "";

<<<<<<< HEAD
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const cell = document.createElement("div");
    cell.className = "dayCell present";
    cell.innerHTML = `<div class="dayNum">${d}</div>`;
    cell.onclick = () => toggleDay(cell);
=======
  if (!empId) {
    cal.innerHTML = `<div class="muted">Select an employee to view calendar.</div>`;
    return;
  }

  const [year, month] = state.ui.attendanceMonth.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  const keyMonth = state.ui.attendanceMonth;
  state.attendance.employee[empId] = state.attendance.employee[empId] || {};
  state.attendance.employee[empId][keyMonth] = state.attendance.employee[empId][keyMonth] || {};

  for (let d = 1; d <= daysInMonth; d++) {
    const st = state.attendance.employee[empId][keyMonth][d] || "P";
    const cell = document.createElement("div");
    cell.className = `dayCell ${statusClass(st)}`;
    cell.innerHTML = `<div class="dayNum">${d}</div>`;
    cell.onclick = () => {
      const next = nextStatus(st);
      state.attendance.employee[empId][keyMonth][d] = next;
      saveState();
      renderEmployeeCalendar();
    };
>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f
    cal.appendChild(cell);
  }

  renderLeaveList();
}

<<<<<<< HEAD
function toggleDay(cell) {
  const order = ["present","absent","late"];
  const cur = order.find(i => cell.classList.contains(i));
  const next = order[(order.indexOf(cur) + 1) % order.length];
  cell.className = "dayCell " + next;
}

function markAll(type) {
  document.querySelectorAll(".dayCell").forEach(c => {
    c.className = "dayCell " + type;
  });
}
=======
function markAll(code) {
  const mode = state.ui.attendanceMode || "employee";
  if (!state.ui.attendanceMonth) return;

  if (mode === "employee") {
    const empId = state.ui.selectedEmployeeId;
    if (!empId) return toast("Select an employee first");
    const [year, month] = state.ui.attendanceMonth.split("-").map(Number);
    const days = new Date(year, month, 0).getDate();

    state.attendance.employee[empId] = state.attendance.employee[empId] || {};
    state.attendance.employee[empId][state.ui.attendanceMonth] = state.attendance.employee[empId][state.ui.attendanceMonth] || {};

    for (let d=1; d<=days; d++) state.attendance.employee[empId][state.ui.attendanceMonth][d] = code;
    saveState();
    renderEmployeeCalendar();
    return;
  }

  // student mark all (only present/absent)
  renderStudentAttendanceMarkAll(code);
}

// ---------- LEAVES ----------
function addLeave() {
  const empId = state.ui.selectedEmployeeId;
  if (!empId) return toast("Select an employee first");

  const type = document.getElementById("leaveType")?.value || "paid";
  const reason = document.getElementById("leaveReason")?.value || "";
  const start = document.getElementById("leaveStart")?.value;
  const end = document.getElementById("leaveEnd")?.value;
  if (!start || !end) return toast("Select start & end date");

  const leave = { id: Date.now(), employeeId: empId, type, reason, start, end };
  state.leaves.push(leave);

  // auto apply leave to calendar
  applyLeaveToEmployeeCalendar(leave);

  saveState();
  renderEmployeeCalendar();
  toast("Leave added ✅");
}

function applyLeaveToEmployeeCalendar(leave) {
  const empId = leave.employeeId;
  const start = new Date(leave.start);
  const end = new Date(leave.end);

  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate()+1)) {
    const ym = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}`;
    const day = dt.getDate();

    state.attendance.employee[empId] = state.attendance.employee[empId] || {};
    state.attendance.employee[empId][ym] = state.attendance.employee[empId][ym] || {};
    state.attendance.employee[empId][ym][day] = "LV";
  }
}

function renderLeaveList() {
  const wrap = document.getElementById("leaveList");
  if (!wrap) return;
  const empId = state.ui.selectedEmployeeId;

  const rows = (state.leaves || []).filter(l => l.employeeId === empId);
  wrap.innerHTML = rows.length ? "" : `<div class="muted">No leaves</div>`;

  rows.forEach(l => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <strong>${l.type.toUpperCase()}</strong>
      <div class="muted">${l.start} → ${l.end} · ${l.reason || ""}</div>
      <button class="btn danger small" data-id="${l.id}">Delete</button>
    `;
    div.querySelector("button").onclick = () => {
      state.leaves = state.leaves.filter(x => x.id !== l.id);
      saveState();
      renderEmployeeCalendar();
    };
    wrap.appendChild(div);
  });
}

// ---------- STUDENT ATTENDANCE ----------
function renderStudentAttendance() {
  const cSel = document.getElementById("attClass");
  const sSel = document.getElementById("attSection");
  const cal = document.getElementById("calendar");
  if (!cSel || !sSel || !cal) return;

  const classId = Number(cSel.value) || null;
  const sectionId = Number(sSel.value) || null;

  if (!classId || !sectionId) {
    cal.innerHTML = `<div class="muted">Select class + section to take student attendance.</div>`;
    return;
  }

  const key = `${classId}-${sectionId}-${state.ui.attendanceMonth}`;
  state.attendance.student[key] = state.attendance.student[key] || {};

  const students = scopeFilter(state.students || []).filter(s => Number(s.classId)===classId && Number(s.sectionId)===sectionId);

  // grid: student list with day circles (simple version)
  const [year, month] = state.ui.attendanceMonth.split("-").map(Number);
  const days = new Date(year, month, 0).getDate();

  let html = `<div class="muted" style="margin-bottom:10px;">Click a circle to toggle: Present → Absent → Late</div>`;
  html += `<div class="stuAtt">`;

  students.forEach(st => {
    state.attendance.student[key][st.id] = state.attendance.student[key][st.id] || {};
    html += `<div class="stuRow">
      <div class="stuName"><strong>${st.name}</strong><div class="muted">${st.roll || ""}</div></div>
      <div class="stuDays">`;

    for (let d=1; d<=days; d++) {
      const stt = state.attendance.student[key][st.id][d] || "P";
      html += `<button class="dotBtn ${statusClass(stt)}" data-sid="${st.id}" data-day="${d}">${d}</button>`;
    }

    html += `</div></div>`;
  });

  html += `</div>`;
  cal.innerHTML = html;

  cal.querySelectorAll(".dotBtn").forEach(btn => {
    btn.onclick = () => {
      const sid = Number(btn.dataset.sid);
      const day = Number(btn.dataset.day);
      const current = state.attendance.student[key][sid][day] || "P";
      const next = nextStatus(current);
      state.attendance.student[key][sid][day] = next;
      saveState();
      renderStudentAttendance();
    };
  });
}

function renderStudentAttendanceMarkAll(code) {
  const cSel = document.getElementById("attClass");
  const sSel = document.getElementById("attSection");
  if (!cSel || !sSel) return;

  const classId = Number(cSel.value) || null;
  const sectionId = Number(sSel.value) || null;
  if (!classId || !sectionId) return toast("Select class + section first");

  const key = `${classId}-${sectionId}-${state.ui.attendanceMonth}`;
  state.attendance.student[key] = state.attendance.student[key] || {};

  const [year, month] = state.ui.attendanceMonth.split("-").map(Number);
  const days = new Date(year, month, 0).getDate();

  const students = scopeFilter(state.students || []).filter(s => Number(s.classId)===classId && Number(s.sectionId)===sectionId);

  students.forEach(st => {
    state.attendance.student[key][st.id] = state.attendance.student[key][st.id] || {};
    for (let d=1; d<=days; d++) state.attendance.student[key][st.id][d] = code;
  });

  saveState();
  renderStudentAttendance();
}

// ---------- HELPERS ----------
function nextStatus(st) {
  if (st === "P") return "A";
  if (st === "A") return "L";
  if (st === "L") return "P";
  if (st === "LV") return "LV";
  if (st === "OFF") return "OFF";
  return "P";
}
function statusClass(st) {
  if (st === "P") return "present";
  if (st === "A") return "absent";
  if (st === "L") return "late";
  if (st === "LV") return "leave";
  return "off";
}

function getScopedInstitution() {
  const instId = state.ui.scopeInstitutionId;
  return state.institutions.find(i => Number(i.id) === Number(instId)) || null;
}

function scopeFilter(list) {
  let out = list.slice();
  if (state.ui.scopeInstitutionId) out = out.filter(x => Number(x.institutionId) === Number(state.ui.scopeInstitutionId));
  if (state.ui.scopeCampusId) out = out.filter(x => Number(x.campusId) === Number(state.ui.scopeCampusId));
  return out;
}
>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f
