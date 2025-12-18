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
function initPayrollModule() {
  bindClick("btnPayslip", () => {
    if (typeof generatePayslip === "function") generatePayslip();
    else if (typeof calculateSalary === "function") toast("Payslip button wired ✅ (add generatePayslip() if you want a full payslip)");
    else toast("Payroll functions missing in payroll.js");
  });

  bindClick("btnCloseModal", () => {
    const m = document.getElementById("modal");
    if (m) m.classList.remove("show");
  });

  // Optional: sync policy inputs to state.settings if you want
  bindChange("latePenalty", (e) => { state.settings.latePenalty = +e.target.value || 0; saveState(); });
  bindChange("absentMode", (e) => { state.settings.absentMode = e.target.value; saveState(); });
}
