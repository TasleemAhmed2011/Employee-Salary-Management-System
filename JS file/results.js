// ===============================
// RESULTS MODULE (WORKING DEMO)
// - Add / Edit / Delete results
// - Result contains: studentName, className, examName, percentage, grade, file demo
// ===============================

function initResultsModule() {
  state.results = state.results || [];

  bindClick("btnAddResult", () => openResultPrompt());
  renderResultList();

  if (state.results.length === 0) {
    seedDemoResults();
    renderResultList();
  }
}

function renderResultList() {
  const wrap = document.getElementById("resultList");
  if (!wrap) return;

  wrap.innerHTML = "";
  if (!state.results || state.results.length === 0) {
    wrap.innerHTML = `<div class="muted">No results yet.</div>`;
    return;
  }

  state.results.forEach(r => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${escapeHtml(r.studentName)} • ${escapeHtml(r.className)}</div>
        <div class="itemSub">
          ${escapeHtml(r.examName)} • ${escapeHtml(r.percentage)}% • Grade ${escapeHtml(r.grade)}
          ${r.solvedFile ? " • Solved: " + escapeHtml(r.solvedFile) : ""}
        </div>
      </div>
      <div class="itemActions">
        <button class="iconBtn" onclick="editResult(${r.id})">Edit</button>
        <button class="iconBtn danger" onclick="deleteResult(${r.id})">Delete</button>
      </div>
    `;
    wrap.appendChild(div);
  });
}

function openResultPrompt(existing = null) {
  const studentName = prompt("Student Name:", existing?.studentName || "Ahmed Ali");
  if (!studentName) return;

  const className = prompt("Class:", existing?.className || "O-1");
  const examName = prompt("Exam:", existing?.examName || "Mocks");
  const percentage = prompt("Percentage:", existing?.percentage || "78");
  const grade = prompt("Grade:", existing?.grade || "A");
  const solvedFile = prompt("Solved Paper Filename (demo):", existing?.solvedFile || "AhmedAli_Math_Solved.pdf");

  if (existing) {
    existing.studentName = studentName;
    existing.className = className;
    existing.examName = examName;
    existing.percentage = percentage;
    existing.grade = grade;
    existing.solvedFile = solvedFile;
  } else {
    state.results.push({
      id: Date.now(),
      studentName,
      className,
      examName,
      percentage,
      grade,
      solvedFile
    });
  }

  saveState();
  renderResultList();
}

function editResult(id) {
  const r = (state.results || []).find(x => x.id === id);
  if (!r) return toast("Result not found");
  openResultPrompt(r);
}

function deleteResult(id) {
  if (!confirm("Delete this result?")) return;
  state.results = (state.results || []).filter(x => x.id !== id);
  saveState();
  renderResultList();
}

function seedDemoResults() {
  state.results.push(
    { id: Date.now() + 11, studentName: "Ahmed Ali", className: "O-1", examName: "Mocks", percentage: "78", grade: "A", solvedFile: "AhmedAli_Math_Solved.pdf" },
    { id: Date.now() + 12, studentName: "Fatima Noor", className: "Grade 8", examName: "Mocks", percentage: "85", grade: "A*", solvedFile: "Fatima_CS_Solved.pdf" },
    { id: Date.now() + 13, studentName: "Usman Khan", className: "O-2", examName: "Final Term Examination", percentage: "69", grade: "B", solvedFile: "Usman_English_Solved.pdf" }
  );
  saveState();
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
