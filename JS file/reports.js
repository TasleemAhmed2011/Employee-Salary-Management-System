$("btnGenerateReport").onclick = () => {
  $("reportFinance").innerText =
    `Expenses: ${state.expenses.length}\nFees: ${state.fees.length}`;
};
function initReportsModule() {
  bindClick("btnGenerateReport", () => {
    if (typeof generateReport === "function") generateReport();
    else toast("generateReport() not found in reports.js");
  });
}
