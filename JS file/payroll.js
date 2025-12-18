function calculateSalary(emp) {
  let salary = emp.salary || 0;
  let late = emp.late || 0;
  let absent = emp.absent || 0;

  salary -= late * state.settings.latePenalty;
  salary -= absent * (salary / 30);

  return Math.max(0, Math.round(salary));
}

$("btnPayslip").onclick = () => {
  const emp = state.employees.find(e => e.id === state.ui.selectedEmployee);
  if (!emp) return toast("Select employee first");

  $("payslipText").innerText =
    `Employee: ${emp.name}\nFinal Salary: PKR ${calculateSalary(emp)}`;
  $("modal").classList.add("show");
};

$("btnCloseModal").onclick = () => $("modal").classList.remove("show");
function initPayrollModule() {
  bindClick("btnPayslip", () => {
    if (typeof generatePayslip === "function") generatePayslip();
    else if (typeof calculateSalary === "function") alert("Payroll connected, but payslip function name differs.");
  });
}
