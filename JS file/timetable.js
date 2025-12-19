// ===============================
// TIMETABLE MODULE (WORKING DEMO)
// - Shows a timetable grid
// - Uses setup Subjects + Teacher employees if available
// - Falls back to random demo data
// ===============================

// - Class/Section dropdowns from Setup
// - Timetable per class+section
// - Click cell cycles demo entries
// ===============================

function initTimetableModule() {
  state.timetables = state.timetables || {};

  bindClick("btnSaveTimetable", saveTimetable);
  bindChange("ttClass", () => {
    fillTTSections();
    renderTimetable();
  });
  bindChange("ttSection", renderTimetable);

  fillTTClasses();
  fillTTSections();
  renderTimetable();
}

function ttEls() {
  return {
    cls: document.getElementById("ttClass"),
    sec: document.getElementById("ttSection"),
    grid: document.getElementById("timetableGrid"),
    hint: document.getElementById("ttHint")
  };
}

function fillTTClasses() {
  const { cls } = ttEls();
  if (!cls) return;

  cls.innerHTML = `<option value="">Select Class</option>`;

  const { campus, classObjList } = getSelectedSetupScope();
  if (!campus) return;

  (campus.classes || []).forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    cls.appendChild(opt);
  });

  // auto pick first class
  if (!cls.value && (campus.classes || []).length) cls.value = String(campus.classes[0].id);
}

function fillTTSections() {
  const { cls, sec } = ttEls();
  if (!cls || !sec) return;

  sec.innerHTML = `<option value="">Select Section</option>`;

  const classId = Number(cls.value);
  const { classObj } = getSelectedSetupScope(classId);
  if (!classObj) return;

  (classObj.sections || []).forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    sec.appendChild(opt);
  });

  if (!sec.value && (classObj.sections || []).length) sec.value = String(classObj.sections[0].id);
}

function ttKey(classId, sectionId) {
  return `${classId}:${sectionId}`;
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
  const { cls, sec, grid, hint } = ttEls();
  if (!grid) return;

  const classId = Number(cls?.value);
  const sectionId = Number(sec?.value);

  const subjects = getSubjectsPool();
  const teachers = getTeachersPool();

  wrap.innerHTML = "";
  if (!classId || !sectionId) {
    grid.innerHTML = `<div class="muted">Select class + section to view timetable.</div>`;
    if (hint) hint.textContent = "";
    return;
  }

  const key = ttKey(classId, sectionId);
  const table = state.timetables[key] || makeDefaultGrid();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const periods = ["08:00", "09:00", "10:00", "11:00", "12:00"];

  grid.innerHTML = "";
  grid.classList.add("ttGrid");

  // header row
  const header = document.createElement("div");
  header.className = "ttRow";
  header.innerHTML = `<div class="ttCell ttHead"></div>` + days.map(d => `<div class="ttCell ttHead">${d}</div>`).join("");
  grid.appendChild(header);

  periods.forEach((p, r) => {
    const row = document.createElement("div");
    row.className = "ttRow";
    row.innerHTML = `<div class="ttCell ttHead">${p}</div>`;

    days.forEach((d, c) => {
      const cell = document.createElement("div");
      cell.className = "ttCell";
      const v = table[r][c] || { subject: "—", teacher: "—" };
      cell.innerHTML = `<strong>${v.subject}</strong><div class="muted">${v.teacher}</div>`;

      const subject = pick(subjects);
      const teacher = pick(teachers);

      cell.innerHTML = `
        <strong>${escapeHtml(subject)}</strong>
        <div class="muted">${escapeHtml(teacher)}</div>
      `;

      col.appendChild(cell);
      cell.onclick = () => {
        const next = cycleDemoEntry(v);
        table[r][c] = next;
        state.timetables[key] = table;
        saveState();
        renderTimetable();
      };

      row.appendChild(cell);
    });

    grid.appendChild(row);
  });

  if (hint) hint.textContent = "Tip: click any cell to cycle demo subject/teacher.";
}

function makeDefaultGrid() {
  // 5 periods x 6 days
  const rows = 5, cols = 6;
  const g = [];
  for (let r = 0; r < rows; r++) {
    g[r] = [];
    for (let c = 0; c < cols; c++) g[r][c] = randomEntry();
  }
  return g;
}

function randomEntry() {
  const subjects = ["Math", "Physics", "CS", "English", "Urdu", "Islamiat"];
  const teachers = ["Sir Ahmed", "Sir Bilal", "Miss Sara", "Sir Zia", "Sir Kashif"];
  return { subject: pick(subjects), teacher: pick(teachers) };
}

function cycleDemoEntry(current) {
  const pool = [
    { subject: "Math", teacher: "Sir Ahmed" },
    { subject: "Physics", teacher: "Sir Mohsin" },
    { subject: "CS", teacher: "Sir Barra" },
    { subject: "English", teacher: "Sir Kashif" },
    { subject: "Urdu", teacher: "Sir Imran" },
    { subject: "—", teacher: "—" }
  ];
  const idx = pool.findIndex(x => x.subject === current.subject && x.teacher === current.teacher);
  return pool[(idx + 1 + pool.length) % pool.length];
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
  toast("Timetable saved ✅");
}

// ---------- Helpers: use selected institution+campus from global UI ----------
function getSelectedSetupScope(classId = null) {
  // You can tighten this later using your global top dropdown.
  const inst = state.institutions?.[0] || null;
  const campus = inst?.campuses?.[0] || null;

  let classObj = null;
  if (classId && campus) classObj = (campus.classes || []).find(c => c.id === classId);

  return { inst, campus, classObj, classObjList: campus?.classes || [] };
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
