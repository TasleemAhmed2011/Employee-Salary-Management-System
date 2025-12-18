// ===============================
// TIMETABLE MODULE (DEMO WORKING)
// ===============================

function initTimetableModule() {
  renderTimetable();
  bindClick("btnSaveTimetable", saveTimetable);
}

function renderTimetable() {
  const wrap = document.getElementById("timetableGrid");
  if (!wrap) return;

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat"];
  const periods = ["8:00","9:00","10:00","11:00","12:00"];

  wrap.innerHTML = "";

  days.forEach(day => {
    const col = document.createElement("div");
    col.className = "ttCol";
    col.innerHTML = `<div class="ttHead">${day}</div>`;

    periods.forEach(p => {
      const cell = document.createElement("div");
      cell.className = "ttCell";

      // RANDOM DEMO DATA
      const teacher = randomFrom(["Ahmed","Ali","Sara","Fatima"]);
      const subject = randomFrom(["Math","Physics","CS","English"]);

      cell.innerHTML = `
        <strong>${subject}</strong>
        <div class="muted">${teacher}</div>
      `;
      col.appendChild(cell);
    });

    wrap.appendChild(col);
  });
}

function saveTimetable() {
  toast("Timetable saved (demo) ✅");
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
