$("btnGenerateReport").onclick = () => {
  $("reportFinance").innerText =
    `Expenses: ${state.expenses.length}\nFees: ${state.fees.length}`;
};
