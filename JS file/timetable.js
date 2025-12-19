// ===============================
// TIMETABLE MODULE (WORKING DEMO)
// - Shows a timetable grid
// - Uses setup Subjects + Teacher employees if available
// - Falls back to random demo data
// ===============================

function initTimetableModule() {
  seedTimetableDemoIfEmpty();
  renderTimetable();
  bindClick("btnSaveTimetable", saveTimetable);
}

function seedTimetableDemoIfEmpty() {
  state.timetables = state.timetables || [];

  // only seed once
  if (state.timetables.length) return;

  // basic demo timetable structure (one per class/campus later)
  state.timetables.push({
    id: Date.now(),
    name: "Demo Timetable (O-Level)",
    grid: {} // day|period -> {subject, teacher}
  });

  saveState?.();
}

function renderTimetable() {
  const wrap = document.getElementById("timetableGrid");
  if (!wrap) return;

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat"];
  const periods = ["8:00","9:00","10:00","11:00","12:00"];

  const subjects = getSubjectsPool();
  const teachers = getTeachersPool();

  wrap.innerHTML = "";

  days.forEach(day => {
    const col = document.createElement("div");
    col.className = "ttCol";
    col.innerHTML = `<div class="ttHead">${day}</div>`;

    periods.forEach(p => {
      const cell = document.createElement("div");
      cell.className = "ttCell";

      const subject = pick(subjects);
      const teacher = pick(teachers);

      cell.innerHTML = `
        <strong>${escapeHtml(subject)}</strong>
        <div class="muted">${escapeHtml(teacher)}</div>
      `;

      col.appendChild(cell);
    });

    wrap.appendChild(col);
  });
}

function saveTimetable() {
  toast?.("Timetable saved (demo) ✅");
}

// ---------- Helpers ----------
function getSubjectsPool() {
  const list = (state.subjects || []).map(s => s.name).filter(Boolean);
  return list.length ? list : ["Math","Physics","CS","English","Urdu","Islamiat"];
}

function getTeachersPool() {
  const list = (state.employees || [])
    .filter(e => (e.role || "") === "Teacher")
    .map(e => e.name)
    .filter(Boolean);

  return list.length ? list : ["Ahmed","Ali","Sara","Fatima","Hassan"];
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
