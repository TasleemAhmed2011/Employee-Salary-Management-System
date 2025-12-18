// ===============================
// EMPLOYEES MODULE – DROPDOWNS
// ===============================

function renderEmployeeInstitutions() {
  const instSelect = document.getElementById("empInstitution");
  const campusSelect = document.getElementById("empCampus");

  if (!instSelect || !campusSelect) return;

  instSelect.innerHTML = `<option value="">Select Institution</option>`;
  campusSelect.innerHTML = `<option value="">Select Campus</option>`;

  state.institutions.forEach(inst => {
    const opt = document.createElement("option");
    opt.value = inst.id;
    opt.textContent = inst.name;
    instSelect.appendChild(opt);
  });

  // auto-select global institution if exists
  if (state.ui.selectedInstitution) {
    instSelect.value = state.ui.selectedInstitution;
    renderEmployeeCampuses();
  }
}

function renderEmployeeCampuses() {
  const instSelect = document.getElementById("empInstitution");
  const campusSelect = document.getElementById("empCampus");

  if (!instSelect || !campusSelect) return;

  const instId = Number(instSelect.value);
  campusSelect.innerHTML = `<option value="">Select Campus</option>`;

  const inst = state.institutions.find(i => i.id === instId);
  if (!inst) return;

  inst.campuses.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    campusSelect.appendChild(opt);
  });
}

function initEmployeesModule() {
  renderEmployeeInstitutions();

  const instSelect = document.getElementById("empInstitution");
  if (instSelect) {
    instSelect.onchange = () => {
      state.ui.selectedInstitution = Number(instSelect.value) || null;
      state.ui.selectedCampus = null;
      saveState();
      renderEmployeeCampuses();
    };
  }
}
