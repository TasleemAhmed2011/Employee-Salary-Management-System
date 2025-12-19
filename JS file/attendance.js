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
  const cal = document.getElementById("calendar");
  if (!cal) return;
  cal.innerHTML = "";

  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const cell = document.createElement("div");
    cell.className = "dayCell present";
    cell.innerHTML = `<div class="dayNum">${d}</div>`;
    cell.onclick = () => toggleDay(cell);
    cal.appendChild(cell);
  }
}

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
