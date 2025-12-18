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
