$("btnGenerateFees").onclick = () => {
  state.students.forEach(s => {
    state.fees.push({
      studentId: s.id,
      amount: 10000,
      status: "Unpaid"
    });
  });
  saveState();
  toast("Fees generated");
};
function initFeesModule() {
  bindClick("btnGenerateFees", () => {
    if (typeof generateFees === "function") generateFees();
    else alert("Fees: generateFees() not found. Tell me your IDs.");
  });

  bindClick("btnMarkPaid", () => {
    if (typeof markSelectedFeePaid === "function") markSelectedFeePaid();
  });
}
