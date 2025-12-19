// ===============================
// EXAMS MODULE (WORKING DEMO)
// - Add/Edit/Delete exams
// - Stores exam date ranges + class scope (optional)
// - Demo "Upload Paper" (stores filename only)
// - Seeds: Mocks (9–15 Jan) + Final Term (17 May–2 Jun)
// ===============================

function initExamsModule() {
  state.exams = state.exams || [];
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

function renderExams() {
  const list = document.getElementById("examList");
  if (!list) return;

  const exams = (state.exams || []).slice().sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
  list.innerHTML = "";

  if (!exams.length) {
    list.innerHTML = `<div class="muted">No exams yet</div>`;
    return;
  }

  exams.forEach(ex => {
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
}
