// ===============================
// EXAMS MODULE (DEMO WORKING)
// ===============================

state.exams = state.exams || [];

function initExamsModule() {
  if (state.exams.length === 0) seedDemoExams();
  renderExams();
  bindClick("btnAddExam", addExam);
}

function seedDemoExams() {
  state.exams = [
    { id: 1, name: "Mid Term", class: "Class 8", subject: "Math", date: "2025-02-15" },
    { id: 2, name: "Final Term", class: "O-Level", subject: "Physics", date: "2025-04-10" }
  ];
  saveState();
}

function renderExams() {
  const list = document.getElementById("examList");
  if (!list) return;

  list.innerHTML = "";

  state.exams.forEach(e => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <strong>${e.name}</strong>
      <div class="muted">${e.class} • ${e.subject} • ${e.date}</div>
    `;
    list.appendChild(div);
  });
}

function addExam() {
  state.exams.push({
    id: Date.now(),
    name: "Surprise Test",
    class: "Class 9",
    subject: randomFrom(["Math","CS","Chemistry"]),
    date: "2025-03-01"
  });
  saveState();
  renderExams();
  toast("Exam added (demo) ✅");
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
