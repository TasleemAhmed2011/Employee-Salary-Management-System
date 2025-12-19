// ===============================
// EXAMS MODULE (WORKING DEMO)
<<<<<<< HEAD
// - Add/Edit/Delete exams
// - Stores exam date ranges + class scope (optional)
// - Demo "Upload Paper" (stores filename only)
// - Seeds: Mocks (9–15 Jan) + Final Term (17 May–2 Jun)
=======
// - Add / Edit / Delete exams
// - Demo seed: Mocks + Final Term
>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f
// ===============================

function initExamsModule() {
  state.exams = state.exams || [];
<<<<<<< HEAD
  seedExamsIfEmpty();

  bindClick("btnAddExam", () => openExamForm());
  renderExams();
}

function seedExamsIfEmpty() {
  if (state.exams.length) return;

  const year = new Date().getFullYear();

  state.exams.push(
    {
      id: Date.now(),
      name: "Mocks",
      startDate: `${year}-01-09`,
      endDate: `${year}-01-15`,
      classId: null,
      campusId: null,
      institutionId: null,
      subjects: ["Math","English","CS"],
      papers: []
    },
    {
      id: Date.now() + 1,
      name: "Final Term Examination",
      startDate: `${year}-05-17`,
      endDate: `${year}-06-02`,
      classId: null,
      campusId: null,
      institutionId: null,
      subjects: ["Math","English","CS","Physics","Urdu"],
      papers: []
    }
  );

  saveState?.();
}

function openExamForm(existingId = null) {
  const exam = existingId ? state.exams.find(e => e.id === existingId) : null;

  const name = prompt("Exam Name:", exam?.name || "");
  if (!name) return;

  const startDate = prompt("Start Date (YYYY-MM-DD):", exam?.startDate || "");
  if (!startDate) return;

  const endDate = prompt("End Date (YYYY-MM-DD):", exam?.endDate || "");
  if (!endDate) return;

  const subjectsRaw = prompt(
    "Subjects (comma separated):",
    (exam?.subjects || ["Math","English"]).join(", ")
  );

  const subjects = String(subjectsRaw || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (exam) {
    exam.name = name;
    exam.startDate = startDate;
    exam.endDate = endDate;
    exam.subjects = subjects;
    toast?.("Exam updated ✅");
  } else {
    state.exams.push({
      id: Date.now(),
      name,
      startDate,
      endDate,
      classId: null,
      campusId: null,
      institutionId: null,
      subjects,
      papers: []
    });
    toast?.("Exam added ✅");
  }

  saveState?.();
  renderExams();
}

function deleteExam(id) {
  if (!confirm("Delete this exam?")) return;
  state.exams = (state.exams || []).filter(e => e.id !== id);
  saveState?.();
  renderExams();
}

function uploadPaper(examId) {
  // Demo: store just a paper title/filename (real upload needs backend or FileReader storage)
  const name = prompt("Paper filename/title (demo):", "paper.pdf");
  if (!name) return;

  const exam = state.exams.find(e => e.id === examId);
  if (!exam) return;

  exam.papers = exam.papers || [];
  exam.papers.push({ id: Date.now(), name });

  saveState?.();
  renderExams();
  toast?.("Paper attached (demo) 📄");
}

function removePaper(examId, paperId) {
  const exam = state.exams.find(e => e.id === examId);
  if (!exam) return;

  exam.papers = (exam.papers || []).filter(p => p.id !== paperId);
  saveState?.();
  renderExams();
}
=======

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
>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f

  wrap.innerHTML = "";
  if (!state.exams || state.exams.length === 0) {
    wrap.innerHTML = `<div class="muted">No exams yet.</div>`;
    return;
  }

<<<<<<< HEAD
  const exams = (state.exams || []).slice().sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
  list.innerHTML = "";

  if (!exams.length) {
    list.innerHTML = `<div class="muted">No exams yet</div>`;
    return;
  }

  exams.forEach(ex => {
=======
  state.exams.forEach(ex => {
>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f
    const div = document.createElement("div");
    div.className = "listItem";

    const subjects = (ex.subjects || []).join(", ") || "—";
    const papersHtml = (ex.papers || []).map(p => `
      <div class="chip" style="display:inline-flex; gap:8px; margin-right:8px;">
        <span>${escapeHtml(p.name)}</span>
        <button class="iconBtn danger" onclick="removePaper(${ex.id}, ${p.id})">x</button>
      </div>
    `).join("");

    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${escapeHtml(ex.name)}</div>
<<<<<<< HEAD
        <div class="itemSub">${escapeHtml(ex.startDate)} → ${escapeHtml(ex.endDate)} • Subjects: ${escapeHtml(subjects)}</div>
        <div style="margin-top:8px;">${papersHtml || `<span class="muted">No papers uploaded</span>`}</div>
      </div>
      <div class="itemActions">
        <button class="iconBtn" onclick="openExamForm(${ex.id})">Edit</button>
        <button class="iconBtn" onclick="uploadPaper(${ex.id})">Upload Paper</button>
        <button class="iconBtn danger" onclick="deleteExam(${ex.id})">Delete</button>
      </div>
    `;

    list.appendChild(div);
  });
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
=======
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
>>>>>>> 0fc4791d050cdf54ab37a7545f94f7e70974907f
}
