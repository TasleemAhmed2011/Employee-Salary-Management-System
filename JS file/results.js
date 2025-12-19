// ===============================
// RESULTS MODULE (WORKING DEMO)
// - Add/Edit/Delete results per student
// - Links to Exam + Student
// - Stores marks by subject
// - Demo "Attach solved paper" (stores filename only)
// ===============================

function initResultsModule() {
  state.results = state.results || [];
  seedResultsIfPossible();

  bindClick("btnAddResult", () => openResultForm());
  renderResults();
}

function seedResultsIfPossible() {
  // only seed once
  if (state.results.length) return;

  const students = state.students || [];
  const exams = state.exams || [];

  if (!students.length || !exams.length) return;

  // random results for first few students
  const pickN = students.slice(0, Math.min(6, students.length));

  pickN.forEach((stu, i) => {
    const ex = exams[i % exams.length];
    const subjects = (ex.subjects || ["Math","English"]);

    const marks = {};
    subjects.forEach(s => {
      marks[s] = rand(55, 95);
    });

    state.results.push({
      id: Date.now() + i,
      examId: ex.id,
      studentId: stu.id,
      marks,
      attachment: null // demo
    });
  });

  saveState?.();
}

function openResultForm(existingId = null) {
  const r = existingId ? state.results.find(x => x.id === existingId) : null;

  const exams = state.exams || [];
  const students = state.students || [];

  if (!exams.length) return toast?.("Add an exam first (Exams module).");
  if (!students.length) return toast?.("Add students first (Students module).");

  // simple prompt-based form (fast + works with your UI)
  const examId = Number(prompt(
    `Exam ID:\n${exams.map(e => `${e.id} — ${e.name}`).join("\n")}`,
    r?.examId || exams[0].id
  ));

  const studentId = Number(prompt(
    `Student ID:\n${students.map(s => `${s.id} — ${s.name}`).join("\n")}`,
    r?.studentId || students[0].id
  ));

  const exam = exams.find(e => e.id === examId);
  const student = students.find(s => s.id === studentId);
  if (!exam || !student) return toast?.("Invalid Exam or Student ID.");

  const subjects = (exam.subjects || ["Math","English"]);
  const marks = {};

  subjects.forEach(sub => {
    const val = prompt(`Marks for ${sub} (0-100):`, r?.marks?.[sub] ?? rand(50, 95));
    marks[sub] = clamp(Number(val), 0, 100);
  });

  if (r) {
    r.examId = examId;
    r.studentId = studentId;
    r.marks = marks;
    toast?.("Result updated ✅");
  } else {
    state.results.push({
      id: Date.now(),
      examId,
      studentId,
      marks,
      attachment: null
    });
    toast?.("Result added ✅");
  }

  saveState?.();
  renderResults();
}

function attachSolvedPaper(resultId) {
  const name = prompt("Solved paper filename/title (demo):", "solved-paper.pdf");
  if (!name) return;

  const r = state.results.find(x => x.id === resultId);
  if (!r) return;

  r.attachment = { id: Date.now(), name };
  saveState?.();
  renderResults();
  toast?.("Attachment saved (demo) 📎");
}

function deleteResult(id) {
  if (!confirm("Delete this result?")) return;
  state.results = (state.results || []).filter(r => r.id !== id);
  saveState?.();
  renderResults();
}

function renderResults() {
  const list = document.getElementById("resultOps");
  if (!list) return;

  const results = (state.results || []).slice();
  list.innerHTML = "";

  if (!results.length) {
    list.innerHTML = `<div class="muted">No results yet</div>`;
    return;
  }

  results.forEach(r => {
    const ex = (state.exams || []).find(e => e.id === r.examId);
    const stu = (state.students || []).find(s => s.id === r.studentId);

    const marksText = Object.entries(r.marks || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join(" • ");

    const div = document.createElement("div");
    div.className = "listItem";

    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${escapeHtml(stu?.name || "Unknown Student")}</div>
        <div class="itemSub">
          Exam: ${escapeHtml(ex?.name || "Unknown Exam")} • ${escapeHtml(marksText || "—")}
        </div>
        <div style="margin-top:8px;">
          ${r.attachment ? `<span class="chip">📎 ${escapeHtml(r.attachment.name)}</span>` : `<span class="muted">No attachment</span>`}
        </div>
      </div>
      <div class="itemActions">
        <button class="iconBtn" onclick="openResultForm(${r.id})">Edit</button>
        <button class="iconBtn" onclick="attachSolvedPaper(${r.id})">Attach Paper</button>
        <button class="iconBtn danger" onclick="deleteResult(${r.id})">Delete</button>
      </div>
    `;

    list.appendChild(div);
  });
}

// ---------- Helpers ----------
function rand(a, b) {
  return Math.floor(a + Math.random() * (b - a + 1));
}
function clamp(n, a, b) {
  n = Number.isFinite(n) ? n : 0;
  return Math.max(a, Math.min(b, n));
}
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
