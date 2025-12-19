// ===============================
// STUDENTS MODULE
// ===============================

function initStudentsModule() {
  renderStudentDropdowns();
  renderStudentDirectory();

  bindChange("stuInstitution", renderStudentDropdowns);
  bindChange("stuClass", renderStudentSections);
}

function initStudentsActions() {
  bindClick("btnSaveStudent", addOrUpdateStudent);
  bindClick("btnClearStudent", clearStudentForm);
}

// ---------- DROPDOWNS ----------
function renderStudentDropdowns() {
  const instSel = document.getElementById("stuInstitution");
  const classSel = document.getElementById("stuClass");
  const secSel = document.getElementById("stuSection");

  if (!instSel || !classSel || !secSel) return;

  instSel.innerHTML = `<option value="">Institution</option>`;
  classSel.innerHTML = `<option value="">Class</option>`;
  secSel.innerHTML = `<option value="">Section</option>`;

  state.institutions.forEach(i => {
    const opt = document.createElement("option");
    opt.value = i.id;
    opt.textContent = i.name;
    instSel.appendChild(opt);
  });

  const inst = state.institutions.find(i => i.id == instSel.value);
  if (!inst) return;

  inst.classes.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
    opt.textContent = c.name;
    classSel.appendChild(opt);
  });
}

function renderStudentSections() {
  const instId = document.getElementById("stuInstitution").value;
  const clsName = document.getElementById("stuClass").value;
  const secSel = document.getElementById("stuSection");

  secSel.innerHTML = `<option value="">Section</option>`;
  const inst = state.institutions.find(i => i.id == instId);
  if (!inst) return;

  const cls = inst.classes.find(c => c.name === clsName);
  if (!cls) return;

  cls.sections.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    secSel.appendChild(opt);
  });
}

// ---------- SAVE ----------
function addOrUpdateStudent() {
  const name = document.getElementById("stuName").value.trim();
  if (!name) return toast("Student name required");

  state.students.push({
    id: Date.now(),
    institutionId: document.getElementById("stuInstitution").value,
    className: document.getElementById("stuClass").value,
    section: document.getElementById("stuSection").value,
    name,
    roll: document.getElementById("stuRoll").value,
    age: document.getElementById("stuAge").value
  });

  saveState();
  renderStudentDirectory();
  clearStudentForm();
}

// ---------- LIST ----------
function renderStudentDirectory() {
  const wrap = document.getElementById("studentList");
  if (!wrap) return;

  wrap.innerHTML = "";
  state.students.forEach(s => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <strong>${s.name}</strong>
      <div class="muted">${s.className}-${s.section}</div>
    `;
    wrap.appendChild(div);
  });
}

function clearStudentForm() {
  ["stuName","stuRoll","stuAge"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}
