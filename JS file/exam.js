// ===============================
// EXAMS MODULE (WORKING DEMO)
// - Add / Edit / Delete exams
// - Demo seed: Mocks + Final Term
// ===============================

function initExamsModule() {
  state.exams = state.exams || [];

  bindClick("btnAddExam", () => openExamPrompt());
  renderExamList();

  // auto seed once if empty
  if (state.exams.length === 0) {
    seedDemoExams();
    renderExamList();
  }
}

function renderExamList() {
  const wrap = document.getElementById("examList");
  if (!wrap) return;

  wrap.innerHTML = "";
  if (!state.exams || state.exams.length === 0) {
    wrap.innerHTML = `<div class="muted">No exams yet.</div>`;
    return;
  }

  state.exams.forEach(ex => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${escapeHtml(ex.name)}</div>
        <div class="itemSub">
          ${escapeHtml(ex.term || "—")} • ${escapeHtml(ex.start || "—")} → ${escapeHtml(ex.end || "—")}
          ${ex.paperFile ? " • Paper: " + escapeHtml(ex.paperFile) : ""}
        </div>
      </div>
      <div class="itemActions">
        <button class="iconBtn" onclick="editExam(${ex.id})">Edit</button>
        <button class="iconBtn danger" onclick="deleteExam(${ex.id})">Delete</button>
      </div>
    `;
    wrap.appendChild(div);
  });
}

function openExamPrompt(existing = null) {
  const name = prompt("Exam Name:", existing?.name || "Mocks");
  if (!name) return;

  const term = prompt("Term/Session:", existing?.term || "2026 Session");
  const start = prompt("Start Date (YYYY-MM-DD):", existing?.start || "2026-01-09");
  const end = prompt("End Date (YYYY-MM-DD):", existing?.end || "2026-01-15");
  const paperFile = prompt("Attach Paper Filename (demo):", existing?.paperFile || "Math_P1_2026.pdf");

  if (existing) {
    existing.name = name;
    existing.term = term;
    existing.start = start;
    existing.end = end;
    existing.paperFile = paperFile;
  } else {
    state.exams.push({
      id: Date.now(),
      name,
      term,
      start,
      end,
      paperFile
    });
  }

  saveState();
  renderExamList();
}

function editExam(id) {
  const ex = (state.exams || []).find(x => x.id === id);
  if (!ex) return toast("Exam not found");
  openExamPrompt(ex);
}

function deleteExam(id) {
  if (!confirm("Delete this exam?")) return;
  state.exams = (state.exams || []).filter(x => x.id !== id);
  saveState();
  renderExamList();
}

function seedDemoExams() {
  state.exams.push(
    {
      id: Date.now() + 1,
      name: "Mocks",
      term: "Jan 2026",
      start: "2026-01-09",
      end: "2026-01-15",
      paperFile: "Mocks_Papers.zip"
    },
    {
      id: Date.now() + 2,
      name: "Final Term Examination",
      term: "May/June 2026",
      start: "2026-05-17",
      end: "2026-06-02",
      paperFile: "FinalTerm_Papers.zip"
    }
  );
  saveState();
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
