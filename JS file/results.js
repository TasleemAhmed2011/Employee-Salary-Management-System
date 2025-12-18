state.results = state.results || [];

function initResultsModule(){
  if (!state.results.length) seedResultsFromStudents();
  renderResults();
}

function seedResultsFromStudents(){
  const students = state.students || [];
  if (!students.length) {
    // demo fallback if no students exist
    state.results = [
      { id: Date.now()+1, student: "Ali", subject: "Math", marks: 85 },
      { id: Date.now()+2, student: "Ahmed", subject: "Physics", marks: 72 }
    ];
    saveState();
    return;
  }

  const subjects = ["Math","Physics","CS","English","Chemistry"];
  state.results = students.slice(0, 12).map(st => ({
    id: Date.now() + Math.random(),
    studentId: st.id,
    student: st.name,
    subject: subjects[Math.floor(Math.random()*subjects.length)],
    marks: Math.floor(50 + Math.random()*50)
  }));

  saveState();
}

function renderResults(){
  const list = document.getElementById("resultsList");
  if (!list) return;
  list.innerHTML = "";

  state.results.forEach(r => {
    const div = document.createElement("div");
    div.className = "listItem";
    div.innerHTML = `
      <div class="itemMain">
        <div class="itemTitle">${r.student}</div>
        <div class="muted">${r.subject} • ${r.marks} marks</div>
      </div>
      <div class="itemActions">
        <button class="iconBtn" onclick="editResult('${r.id}')">Edit</button>
        <button class="iconBtn danger" onclick="deleteResult('${r.id}')">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function deleteResult(id){
  if(!confirm("Delete result?")) return;
  state.results = state.results.filter(r => String(r.id) !== String(id));
  saveState();
  renderResults();
}

function editResult(id){
  const r = state.results.find(x => String(x.id) === String(id));
  if (!r) return;
  const newMarks = prompt("Enter new marks:", r.marks);
  if (newMarks === null) return;
  r.marks = Number(newMarks) || r.marks;
  saveState();
  renderResults();
}
