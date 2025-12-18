$("btnCommand").onclick = () => {
  $("cmdModal").classList.add("show");
};

$("btnCmdClose").onclick = () => {
  $("cmdModal").classList.remove("show");
};
// close command modal
bindClick("btnCmdClose", () => {
  const m = document.getElementById("cmdModal");
  if (m) m.classList.remove("show");
});
