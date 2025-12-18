$("btnSaveExpense").onclick = () => {
  state.expenses.push({
    id: Date.now(),
    amount: $("expAmount").value,
    category: $("expCategory").value
  });
  saveState();
  toast("Expense saved");
};
function initExpensesModule() {
  bindClick("btnSaveExpense", () => {
    if (typeof addExpense === "function") addExpense();
    else alert("Expenses: addExpense() not found. Tell me your IDs.");
  });
}
