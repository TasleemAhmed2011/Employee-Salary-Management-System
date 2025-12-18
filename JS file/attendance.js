function generateCalendar(year, month) {
  const cal = $("calendar");
  cal.innerHTML = "";

  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const cell = document.createElement("div");
    cell.className = "dayCell present";
    cell.innerHTML = `<div class="dayNum">${d}</div>`;
    cell.onclick = () => toggleDay(cell);
    cal.appendChild(cell);
  }
}

function toggleDay(cell) {
  if (cell.classList.contains("present")) {
    cell.className = "dayCell absent";
  } else if (cell.classList.contains("absent")) {
    cell.className = "dayCell late";
  } else if (cell.classList.contains("late")) {
    cell.className = "dayCell present";
  }
}

$("monthPicker").onchange = e => {
  const [y, m] = e.target.value.split("-");
  generateCalendar(+y, +m - 1);
};
function initAttendanceModule() {
  // if you have a month picker/calendar generator
  bindChange("monthPicker", (e) => {
    if (typeof generateCalendar === "function") {
      const [y, m] = e.target.value.split("-");
      generateCalendar(+y, +m - 1);
    }
  });

  bindClick("btnMarkAllPresent", () => typeof markAllPresent === "function" && markAllPresent());
  bindClick("btnMarkAllAbsent", () => typeof markAllAbsent === "function" && markAllAbsent());
}
