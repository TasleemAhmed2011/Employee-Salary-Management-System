function initDashboardModule() {
  renderScopeBar();
  renderDashboardStats();
  renderDashboardEvents();
  bindDashboardButtons();
}

function renderScopeBar() {
  const instSel = document.getElementById("scopeInstitution");
  const campSel = document.getElementById("scopeCampus");
  if (!instSel || !campSel) return;

  instSel.innerHTML = `<option value="">Institution —</option>`;
  state.institutions.forEach(i => {
    const o = document.createElement("option");
    o.value = i.id;
    o.textContent = i.name;
    instSel.appendChild(o);
  });

  if (state.ui.scopeInstitutionId) instSel.value = String(state.ui.scopeInstitutionId);

  instSel.onchange = () => {
    state.ui.scopeInstitutionId = Number(instSel.value) || null;
    state.ui.scopeCampusId = null;
    saveState();
    renderScopeCampuses();
    renderDashboardStats();
    renderDashboardEvents();
  };

  renderScopeCampuses();
}

function renderScopeCampuses() {
  const instSel = document.getElementById("scopeInstitution");
  const campSel = document.getElementById("scopeCampus");
  if (!instSel || !campSel) return;

  const instId = Number(instSel.value) || null;
  campSel.innerHTML = `<option value="">Campus —</option>`;

  const inst = state.institutions.find(i => i.id === instId);
  if (!inst) return;

  inst.campuses.forEach(c => {
    const o = document.createElement("option");
    o.value = c.id;
    o.textContent = c.name;
    campSel.appendChild(o);
  });

  if (state.ui.scopeCampusId) campSel.value = String(state.ui.scopeCampusId);

  campSel.onchange = () => {
    state.ui.scopeCampusId = Number(campSel.value) || null;
    saveState();
    renderDashboardStats();
    renderDashboardEvents();
  };
}

function _scopeFilter(list, keyCampus = "campusId", keyInst = "institutionId") {
  let out = list.slice();
  if (state.ui.scopeInstitutionId) out = out.filter(x => Number(x[keyInst]) === Number(state.ui.scopeInstitutionId));
  if (state.ui.scopeCampusId) out = out.filter(x => Number(x[keyCampus]) === Number(state.ui.scopeCampusId));
  return out;
}

function renderDashboardStats() {
  const emp = _scopeFilter(state.employees || []);
  const stu = _scopeFilter(state.students || []);

  setText("dashEmployees", emp.length);
  setText("dashStudents", stu.length);
  setText("dashEventsCount", (state.events || []).length);
  setText("dashInstitutions", (state.institutions || []).length);
}

function renderDashboardEvents() {
  const wrap = document.getElementById("dashEvents");
  if (!wrap) return;
  wrap.innerHTML = "";

  const events = (state.events || []).slice().sort((a,b)=>String(a.start).localeCompare(String(b.start)));
  if (events.length === 0) {
    wrap.innerHTML = `<div class="muted">No upcoming events</div>`;
    return;
  }

  events.slice(0, 4).forEach(ev => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `<strong>${ev.title}</strong><div class="muted">${ev.start} → ${ev.end}</div>`;
    wrap.appendChild(div);
  });
}

function bindDashboardButtons() {
  bindClick("dashGoEmployees", () => { switchView("employees"); initView("employees"); });
  bindClick("dashGoStudents", () => { switchView("students"); initView("students"); });
  bindClick("dashGoAttendance", () => { switchView("attendance"); initView("attendance"); });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
