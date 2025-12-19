function $(id) { return document.getElementById(id); }

function switchView(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("show"));
  const el = $("view-" + view);
  if (el) el.classList.add("show");

  document.querySelectorAll(".navItem").forEach(b => b.classList.remove("active"));
  document.querySelector(`[data-view="${view}"]`)?.classList.add("active");

  state.ui.currentView = view;
  saveState();
}

function toast(msg) {
  // replace later with fancy toast UI
  alert(msg);
}
