// ===============================
// SETUP MODULE
// ===============================

function initSetupModule() {
  renderInstitutions();
  bindClick("btnAddInstitution", addInstitution);
  bindClick("btnAddCampus", addCampus);
  bindClick("btnAddClass", addClass);
  bindClick("btnAddSection", addSection);
  bindClick("btnAddSubject", addSubject);
}

// ---------- INSTITUTIONS ----------
function renderInstitutions() {
  const wrap = document.getElementById("institutionList");
  if (!wrap) return;

  wrap.innerHTML = "";

  state.institutions.forEach(inst => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <strong>${inst.name}</strong>
      <div class="muted">${inst.type}</div>
    `;
    div.onclick = () => {
      state.ui.selectedInstitution = inst.id;
      state.ui.selectedCampus = null;
      saveState();
      renderCampuses();
      renderClasses();
    };
    wrap.appendChild(div);
  });
}

function addInstitution() {
  const name = document.getElementById("instName").value.trim();
  const type = document.getElementById("instType").value;
  if (!name) return toast("Institution name required");

  state.institutions.push({
    id: Date.now(),
    name,
    type,
    campuses: [],
    classes: [],
    subjects: []
  });

  saveState();
  renderInstitutions();
}

// ---------- CAMPUSES ----------
function renderCampuses() {
  const wrap = document.getElementById("campusList");
  if (!wrap) return;

  wrap.innerHTML = "";
  const inst = state.institutions.find(i => i.id === state.ui.selectedInstitution);
  if (!inst) return;

  inst.campuses.forEach(c => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.textContent = c.name;
    div.onclick = () => {
      state.ui.selectedCampus = c.id;
      saveState();
      renderClasses();
    };
    wrap.appendChild(div);
  });
}
function selectCampus(campusId) {
  state.ui.selectedCampus = campusId;
  state.ui.selectedClass = null; // reset downstream
  saveState();
  renderClasses();
  renderSections();
}


function addCampus() {
  const name = document.getElementById("campusName").value.trim();
  const inst = state.institutions.find(i => i.id === state.ui.selectedInstitution);
  if (!inst || !name) return toast("Select institution & enter campus");

  inst.campuses.push({ id: Date.now(), name });
  saveState();
  renderCampuses();
}

// ---------- CLASSES ----------
function renderClasses() {
  const wrap = document.getElementById("classList");
  if (!wrap) return;

  wrap.innerHTML = "";
  const inst = state.institutions.find(i => i.id === state.ui.selectedInstitution);
  if (!inst) return;

  inst.classes.forEach(cls => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <strong>${cls.name}</strong>
      <div class="muted">${cls.sections.join(", ")}</div>
    `;
    wrap.appendChild(div);
  });
}
function selectClass(classId) {
  state.ui.selectedClass = classId;
  saveState();
  renderSections();
}


function addClass() {
  const name = document.getElementById("className").value.trim();
  const inst = state.institutions.find(i => i.id === state.ui.selectedInstitution);
  if (!inst || !name) return toast("Select institution & enter class");

  inst.classes.push({
    id: Date.now(),
    name,
    sections: []
  });

  saveState();
  renderClasses();
}

// ---------- SECTIONS ----------
function addSection() {
  const classId = state.ui.selectedClass;
  if (!classId) return toast("Select a class first");

  const name = document.getElementById("newSectionName").value.trim();
  if (!name) return toast("Enter section name");

  const cls = findClassById(classId);
  cls.sections.push({
    id: Date.now(),
    name
  });

  saveState();
  renderSections();
}


// ---------- SUBJECTS ----------
function addSubject() {
  const name = document.getElementById("subjectName").value.trim();
  const inst = state.institutions.find(i => i.id === state.ui.selectedInstitution);
  if (!inst || !name) return toast("Select institution & subject");

  inst.subjects.push(name);
  saveState();
  toast("Subject added ✅");
}
