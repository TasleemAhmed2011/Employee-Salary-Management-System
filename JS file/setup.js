// ---------- Helpers ----------
function getInst() {
  return state.institutions.find(i => i.id === state.ui.selectedInstitution) || null;
}
function getCampus(inst) {
  return inst?.campuses.find(c => c.id === state.ui.selectedCampus) || null;
}
function getClass(campus) {
  return campus?.classes.find(cl => cl.id === state.ui.selectedClass) || null;
}
function needInstitution() {
  if (!state.ui.selectedInstitution) { alert("Select an institution first."); return false; }
  return true;
}
function needCampus() {
  if (!state.ui.selectedCampus) { alert("Select a campus first."); return false; }
  return true;
}
function needClass() {
  if (!state.ui.selectedClass) { alert("Select a class first."); return false; }
  return true;
}

// ---------- Institutions ----------
function renderInstitutions() {
  const list = document.getElementById("institutionList");
  if (!list) return;
  list.innerHTML = "";

  state.institutions.forEach(inst => {
    const isSelected = inst.id === state.ui.selectedInstitution;
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${inst.name}${isSelected ? " ✓" : ""}</div>
        <div class="itemSub">${inst.type}</div>
      </div>
      <div class="itemActions">
        <button class="iconBtn" onclick="selectInstitution(${inst.id})">Select</button>
        <button class="iconBtn danger" onclick="deleteInstitution(${inst.id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function addInstitution() {
  const name = document.getElementById("instName").value.trim();
  const type = document.getElementById("instType").value;
  if (!name) return alert("Enter institution name.");

  state.institutions.push({
    id: Date.now(),
    name,
    type,
    campuses: [],
    subjects: [] // subjects live per institution
  });

  document.getElementById("instName").value = "";
  saveState();
  renderInstitutions();
}

function selectInstitution(id) {
  state.ui.selectedInstitution = id;
  state.ui.selectedCampus = null;
  state.ui.selectedClass = null;

  saveState();
  renderInstitutions();
  renderCampuses();
  renderClasses();
  renderSectionsForSelectedClass();
  renderSubjects();
}

function deleteInstitution(id) {
  if (!confirm("Delete this institution?")) return;
  state.institutions = state.institutions.filter(i => i.id !== id);

  if (state.ui.selectedInstitution === id) {
    state.ui.selectedInstitution = null;
    state.ui.selectedCampus = null;
    state.ui.selectedClass = null;
  }

  saveState();
  renderInstitutions();
  renderCampuses();
  renderClasses();
  renderSectionsForSelectedClass();
  renderSubjects();
}

// ---------- Campuses ----------
function renderCampuses() {
  const list = document.getElementById("campusList");
  if (!list) return;
  list.innerHTML = "";

  const inst = getInst();
  if (!inst) return;

  inst.campuses.forEach(c => {
    const isSelected = c.id === state.ui.selectedCampus;
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${c.name}${isSelected ? " ✓" : ""}</div>
        <div class="itemSub">Campus</div>
      </div>
      <div class="itemActions">
        <button class="iconBtn" onclick="selectCampus(${c.id})">Select</button>
        <button class="iconBtn danger" onclick="deleteCampus(${c.id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function addCampus() {
  if (!needInstitution()) return;
  const name = document.getElementById("campusName").value.trim();
  if (!name) return alert("Enter campus name.");

  const inst = getInst();
  inst.campuses.push({ id: Date.now(), name, classes: [] });

  document.getElementById("campusName").value = "";
  saveState();
  renderCampuses();
}

function selectCampus(id) {
  state.ui.selectedCampus = id;
  state.ui.selectedClass = null;
  saveState();

  renderCampuses();
  renderClasses();
  renderSectionsForSelectedClass();
}

function deleteCampus(id) {
  if (!needInstitution()) return;
  if (!confirm("Delete this campus?")) return;

  const inst = getInst();
  inst.campuses = inst.campuses.filter(c => c.id !== id);

  if (state.ui.selectedCampus === id) {
    state.ui.selectedCampus = null;
    state.ui.selectedClass = null;
  }

  saveState();
  renderCampuses();
  renderClasses();
  renderSectionsForSelectedClass();
}

// ---------- Classes ----------
function renderClasses() {
  const list = document.getElementById("classList");
  if (!list) return;
  list.innerHTML = "";

  const inst = getInst();
  if (!inst) return;
  const campus = getCampus(inst);
  if (!campus) return;

  campus.classes.forEach(cl => {
    const isSelected = cl.id === state.ui.selectedClass;
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${cl.name}${isSelected ? " ✓" : ""}</div>
        <div class="itemSub">Class / Program</div>
      </div>
      <div class="itemActions">
        <button class="iconBtn" onclick="selectClass(${cl.id})">Select</button>
        <button class="iconBtn danger" onclick="deleteClass(${cl.id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function addClass() {
  if (!needInstitution()) return;
  if (!needCampus()) return;

  const name = document.getElementById("className").value.trim();
  if (!name) return alert("Enter class name.");

  const inst = getInst();
  const campus = getCampus(inst);

  campus.classes.push({
    id: Date.now(),
    name,
    // IMPORTANT: sections now store assigned section IDs from the library
    sectionIds: []
  });

  document.getElementById("className").value = "";
  saveState();
  renderClasses();
}

function selectClass(id) {
  state.ui.selectedClass = id;
  saveState();

  renderClasses();
  renderSectionsForSelectedClass();
}

function deleteClass(id) {
  if (!needInstitution()) return;
  if (!needCampus()) return;
  if (!confirm("Delete this class?")) return;

  const inst = getInst();
  const campus = getCampus(inst);
  campus.classes = campus.classes.filter(cl => cl.id !== id);

  if (state.ui.selectedClass === id) state.ui.selectedClass = null;

  saveState();
  renderClasses();
  renderSectionsForSelectedClass();
}

// ---------- Section Library (Global) ----------
function addLibrarySection() {
  const inp = document.getElementById("sectionName");
  if (!inp) return;

  const name = inp.value.trim();
  if (!name) return alert("Enter section name.");

  // prevent duplicates
  const exists = (state.sectionLibrary || []).some(s => s.name.toLowerCase() === name.toLowerCase());
  if (exists) return alert("This section already exists in library.");

  state.sectionLibrary = state.sectionLibrary || [];
  state.sectionLibrary.push({ id: Date.now(), name });

  inp.value = "";
  saveState();
  renderSectionsForSelectedClass();
}

function deleteLibrarySection(id) {
  if (!confirm("Delete this section from library?")) return;

  state.sectionLibrary = (state.sectionLibrary || []).filter(s => s.id !== id);

  // Also remove from any class that had it assigned
  state.institutions.forEach(inst => {
    inst.campuses.forEach(c => {
      c.classes.forEach(cl => {
        cl.sectionIds = (cl.sectionIds || []).filter(x => x !== id);
      });
    });
  });

  saveState();
  renderSectionsForSelectedClass();
}

// ---------- Sections UI (Library + Assignment to selected class) ----------
function renderSectionsForSelectedClass() {
  const list = document.getElementById("sectionList");
  if (!list) return;
  list.innerHTML = "";

  // if no class selected, still show library with checkboxes disabled
  const inst = getInst();
  const campus = inst ? getCampus(inst) : null;
  const cl = campus ? getClass(campus) : null;

  const assigned = new Set(cl?.sectionIds || []);
  const library = state.sectionLibrary || [];

  // Render library items with checkbox
  library.forEach(sec => {
    const div = document.createElement("div");
    div.className = "listItem";

    const checked = assigned.has(sec.id);
    const disabled = !cl ? "disabled" : "";

    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${sec.name}</div>
        <div class="itemSub">Section Library</div>
      </div>
      <div class="itemActions">
        <label class="chip" style="cursor:${cl ? "pointer" : "not-allowed"};">
          <input type="checkbox" ${checked ? "checked" : ""} ${disabled}
            onchange="toggleSectionAssign(${sec.id}, this.checked)">
          Assign
        </label>
        <button class="iconBtn danger" onclick="deleteLibrarySection(${sec.id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });

  // If library empty message
  if (library.length === 0) {
    const msg = document.createElement("div");
    msg.className = "muted";
    msg.style.padding = "10px 4px";
    msg.innerText = "No sections in library yet. Add a fixed section name above.";
    list.appendChild(msg);
  }
}

function toggleSectionAssign(sectionId, isChecked) {
  if (!needInstitution()) return;
  if (!needCampus()) return;
  if (!needClass()) return;

  const inst = getInst();
  const campus = getCampus(inst);
  const cl = getClass(campus);

  cl.sectionIds = cl.sectionIds || [];

  if (isChecked) {
    if (!cl.sectionIds.includes(sectionId)) cl.sectionIds.push(sectionId);
  } else {
    cl.sectionIds = cl.sectionIds.filter(id => id !== sectionId);
  }

  saveState();
}

// ---------- Subjects ----------
function renderSubjects() {
  const list = document.getElementById("subjectList");
  if (!list) return;
  list.innerHTML = "";

  const inst = getInst();
  if (!inst) return;

  inst.subjects = inst.subjects || [];

  inst.subjects.forEach(sub => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${sub.name}</div>
        <div class="itemSub">${sub.code ? sub.code : "No code"}</div>
      </div>
      <div class="itemActions">
        <button class="iconBtn danger" onclick="deleteSubject(${sub.id})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function addSubject() {
  if (!needInstitution()) return;

  const name = document.getElementById("subjectName").value.trim();
  const code = document.getElementById("subjectCode").value.trim();

  if (!name) return alert("Enter subject name.");

  const inst = getInst();
  inst.subjects = inst.subjects || [];

  inst.subjects.push({ id: Date.now(), name, code });

  document.getElementById("subjectName").value = "";
  document.getElementById("subjectCode").value = "";

  saveState();
  renderSubjects();
}

function deleteSubject(id) {
  if (!needInstitution()) return;
  const inst = getInst();
  inst.subjects = (inst.subjects || []).filter(s => s.id !== id);

  saveState();
  renderSubjects();
}
