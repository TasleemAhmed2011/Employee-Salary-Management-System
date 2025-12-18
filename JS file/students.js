$("btnSaveStudent").onclick = () => {
  const s = {
    id: Date.now(),
    name: $("stuName").value,
    class: $("stuClass").value
  };
  state.students.push(s);
  saveState();
  toast("Student added");
};
function initStudentsModule() {
  // change these IDs if your HTML uses different ones
  bindClick("btnSaveStudent", () => {
    if (typeof addStudent === "function") addStudent();
    else alert("Students: addStudent() not found. Tell me your button IDs.");
  });

  bindClick("btnClearStudent", () => {
    const ids = ["stuName", "stuClass", "stuSection", "stuPhone"];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  });
}
function initStudentsModule() {
  // Dropdown population if you already have institution setup
  if (typeof renderStudentDropdowns === "function") renderStudentDropdowns();

  bindClick("btnAddStudent", () => toast("Fill form → click Save Student"));

  bindClick("btnClearStudent", () => {
    ["stuInstitution","stuCampus","stuClass","stuSection","stuName","stuRoll","stuAge","stuAdmissionDate","stuGuardian","stuGuardianPhone","stuAddress"]
      .forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  });

  bindClick("btnSaveStudent", () => {
    if (typeof addStudent === "function") addStudent();
    else toast("addStudent() not found in students.js");
  });
}
