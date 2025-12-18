// ===============================
// STUDENTS MODULE (FINAL WORKING)
// ===============================

function _stuEls() {
  return {
    inst: document.getElementById("stuInstitution"),
    campus: document.getElementById("stuCampus"),
    cls: document.getElementById("stuClass"),
    sec: document.getElementById("stuSection"),
    list: document.getElementById("studentList"),
    search: document.getElementById("searchStudent"),
    filterClass: document.getElementById("filterStuClass"),
    filterSection: document.getElementById("filterStuSection")
  };
}
function getStudentById(id) {
  return (state.students || []).find(s => s.id === id);
}

function initStudentsModule() {
  // Ensure arrays exist
  state.students = state.students || [];
  state.sectionLibrary = state.sectionLibrary || [];

  // Populate dropdown chain
  renderStudentInstitutions();

  const { inst, campus, cls, sec, search, filterClass, filterSection } = _stuEls();

  if (inst) inst.onchange = () => {
    state.ui.selectedInstitution = Number(inst.value) || null;
    state.ui.selectedCampus = null;
    saveState();
    renderStudentCampuses();
    renderStudentClasses();
    renderStudentSections();
    renderStudentDirectory();
  };

  if (campus) campus.onchange = () => {
    state.ui.selectedCampus = Number(campus.value) || null;
    saveState();
    renderStudentClasses();
    renderStudentSections();
    renderStudentDirectory();
  };

  if (cls) cls.onchange = () => {
    renderStudentSections();
    renderStudentDirectory();
  };

  if (sec) sec.onchange = () => renderStudentDirectory();

  if (search) search.oninput = () => renderStudentDirectory();
  if (filterClass) filterClass.onchange = () => renderStudentDirectory();
  if (filterSection) filterSection.onchange = () => renderStudentDirectory();

  // Buttons
  bindClick("btnClearStudent", clearStudentForm);
  bindClick("btnSaveStudent", addStudent);
  bindClick("btnAddStudent", () => toast("Fill form → click Save Student"));

  // Initial directory render
  renderStudentDirectory();
}

function renderStudentInstitutions() {
  const { inst, campus, cls, sec } = _stuEls();
  if (!inst || !campus || !cls || !sec) return;

  inst.innerHTML = `<option value="">Select Institution</option>`;
  state.institutions.forEach(i => {
    const opt = document.createElement("option");
    opt.value = i.id;
    opt.textContent = i.name;
    inst.appendChild(opt);
  });

  campus.innerHTML = `<option value="">Select Campus</option>`;
  cls.innerHTML = `<option value="">Select Class</option>`;
  sec.innerHTML = `<option value="">Select Section</option>`;

  // Auto-select last used
  if (state.ui.selectedInstitution) {
    inst.value = String(state.ui.selectedInstitution);
    renderStudentCampuses();

    if (state.ui.selectedCampus) {
      campus.value = String(state.ui.selectedCampus);
    }

    renderStudentClasses();
    renderStudentSections();
  }

  // Filters
  renderStudentFilters();
}

function renderStudentCampuses() {
  const { inst, campus } = _stuEls();
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

function renderStudentClasses() {
  const { inst, campus, cls } = _stuEls();
  if (!inst || !campus || !cls) return;

  cls.innerHTML = `<option value="">Select Class</option>`;

  const instId = Number(inst.value);
  const campusId = Number(campus.value);

  const institution = state.institutions.find(i => i.id === instId);
  const campusObj = institution?.campuses.find(c => c.id === campusId);
  if (!campusObj) return;

  campusObj.classes.forEach(cl => {
    const opt = document.createElement("option");
    opt.value = cl.id;
    opt.textContent = cl.name;
    cls.appendChild(opt);
  });

  renderStudentFilters();
}

function renderStudentSections() {
  const { inst, campus, cls, sec } = _stuEls();
  if (!inst || !campus || !cls || !sec) return;

  sec.innerHTML = `<option value="">Select Section</option>`;

  const instId = Number(inst.value);
  const campusId = Number(campus.value);
  const classId = Number(cls.value);

  const institution = state.institutions.find(i => i.id === instId);
  const campusObj = institution?.campuses.find(c => c.id === campusId);
  const classObj = campusObj?.classes.find(cl => cl.id === classId);

  if (!classObj) return;

  const assignedIds = classObj.sectionIds || [];
  const assignedSections = state.sectionLibrary.filter(s => assignedIds.includes(s.id));

  assignedSections.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    sec.appendChild(opt);
  });

  renderStudentFilters();
}

// ---------- Student CRUD ----------
function addStudent() {
  const instId = Number(document.getElementById("stuInstitution")?.value);
  const campusId = Number(document.getElementById("stuCampus")?.value);
  const classId = Number(document.getElementById("stuClass")?.value);
  const sectionId = Number(document.getElementById("stuSection")?.value);

  if (!instId || !campusId || !classId || !sectionId) {
    toast("Select Institution, Campus, Class and Section");
    return;
  }

  const name = document.getElementById("stuName").value.trim();
  if (!name) return toast("Student name is required");

  const student = {
    id: Date.now(),
    institutionId: instId,
    campusId,
    classId,
    sectionId,
    name,
    roll: document.getElementById("stuRoll").value.trim(),
    age: document.getElementById("stuAge").value,
    admissionDate: document.getElementById("stuAdmissionDate").value,
    guardian: document.getElementById("stuGuardian").value.trim(),
    guardianPhone: document.getElementById("stuGuardianPhone").value.trim(),
    address: document.getElementById("stuAddress").value.trim()
  };

  state.students.push(student);
  saveState();

  renderStudentDirectory();
  clearStudentForm(false); // keep dropdown selections
  toast("Student saved ✅");
  const editingId = state.ui.editingStudentId;

if (editingId) {
  const idx = state.students.findIndex(x => x.id === editingId);
  if (idx === -1) return toast("Student not found");

  state.students[idx] = { ...state.students[idx], ...student };
  state.ui.editingStudentId = null;
  document.getElementById("btnSaveStudent").textContent = "Save Student";
  toast("Student updated ✅");
} else {
  state.students.push(student);
  toast("Student saved ✅");
}

}

function clearStudentForm(resetDropdowns = false) {
  [
    "stuName","stuRoll","stuAge","stuAdmissionDate",
    "stuGuardian","stuGuardianPhone","stuAddress"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  if (resetDropdowns) {
    ["stuInstitution","stuCampus","stuClass","stuSection"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  }
}

// ---------- Directory ----------
function renderStudentDirectory() {
  const { list, search, filterClass, filterSection } = _stuEls();
  if (!list) return;

  let rows = (state.students || []).slice();
<button class="iconBtn" onclick="editStudent(${s.id})">Edit</button>

  // scope by selected institution/campus if chosen
  const instSel = Number(document.getElementById("stuInstitution")?.value) || null;
  const campusSel = Number(document.getElementById("stuCampus")?.value) || null;

  if (instSel) rows = rows.filter(s => s.institutionId === instSel);
  if (campusSel) rows = rows.filter(s => s.campusId === campusSel);

  // filters
  const q = (search?.value || "").trim().toLowerCase();
  if (q) rows = rows.filter(s => (s.name || "").toLowerCase().includes(q) || (s.roll || "").toLowerCase().includes(q));

  const fc = Number(filterClass?.value) || null;
  if (fc) rows = rows.filter(s => s.classId === fc);

  const fs = Number(filterSection?.value) || null;
  if (fs) rows = rows.filter(s => s.sectionId === fs);

  list.innerHTML = "";

  if (rows.length === 0) {
    list.innerHTML = `<div class="muted">No students found</div>`;
    return;
  }

  rows.forEach(s => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${s.name}</div>
        <div class="itemSub">${s.roll || "—"} · Age ${s.age || "—"}</div>
      </div>
      <div class="itemActions">
        <button class="iconBtn danger" onclick="deleteStudent(${s.id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function deleteStudent(id) {
  if (!confirm("Delete this student?")) return;
  state.students = (state.students || []).filter(s => s.id !== id);
  saveState();
  renderStudentDirectory();
}

// ---------- Filters dropdowns ----------
function renderStudentFilters() {
  const { filterClass, filterSection, inst, campus } = _stuEls();
  if (!filterClass || !filterSection || !inst || !campus) return;

  filterClass.innerHTML = `<option value="">All Classes</option>`;
  filterSection.innerHTML = `<option value="">All Sections</option>`;

  const instId = Number(inst.value);
  const campusId = Number(campus.value);

  const institution = state.institutions.find(i => i.id === instId);
  const campusObj = institution?.campuses.find(c => c.id === campusId);

  (campusObj?.classes || []).forEach(cl => {
    const opt = document.createElement("option");
    opt.value = cl.id;
    opt.textContent = cl.name;
    filterClass.appendChild(opt);
  });

  // Fill sections filter if a class is selected (best UX)
  const classId = Number(document.getElementById("stuClass")?.value);
  const classObj = campusObj?.classes.find(cl => cl.id === classId);

  const ids = classObj?.sectionIds || [];
  state.sectionLibrary.filter(s => ids.includes(s.id)).forEach(sec => {
    const opt = document.createElement("option");
    opt.value = sec.id;
    opt.textContent = sec.name;
    filterSection.appendChild(opt);
  });
}
function editStudent(id) {
  const s = getStudentById(id);
  if (!s) return;

  state.ui.editingStudentId = id;
  saveState();

  document.getElementById("stuInstitution").value = String(s.institutionId);
  renderStudentCampuses();
  document.getElementById("stuCampus").value = String(s.campusId);

  renderStudentClasses();
  document.getElementById("stuClass").value = String(s.classId);

  renderStudentSections();
  document.getElementById("stuSection").value = String(s.sectionId);

  document.getElementById("stuName").value = s.name || "";
  document.getElementById("stuRoll").value = s.roll || "";
  document.getElementById("stuAge").value = s.age || "";
  document.getElementById("stuAdmissionDate").value = s.admissionDate || "";
  document.getElementById("stuGuardian").value = s.guardian || "";
  document.getElementById("stuGuardianPhone").value = s.guardianPhone || "";
  document.getElementById("stuAddress").value = s.address || "";

  document.getElementById("btnSaveStudent").textContent = "Update Student";
}
