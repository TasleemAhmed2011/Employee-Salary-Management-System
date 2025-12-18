const tourSteps = [
  { title: "Welcome", text: "This is EduCore Nexus – your education ERP." },
  { title: "Setup", text: "Start by adding institution, campuses, classes." },
  { title: "Employees", text: "Add teachers & staff here." },
  { title: "Students", text: "Manage admissions and profiles." },
  { title: "Attendance", text: "Mark attendance with smart calendar." },
  { title: "Finance", text: "Fees, expenses, payroll managed here." }
];

let tourIndex = 0;

function showTour() {
  $("tour").classList.add("show");
  renderTour();
}

function renderTour() {
  $("tourTitle").innerText = tourSteps[tourIndex].title;
  $("tourText").innerText = tourSteps[tourIndex].text;
  $("tourStep").innerText = `${tourIndex + 1}/${tourSteps.length}`;
  $("tourBar").style.width = ((tourIndex + 1) / tourSteps.length) * 100 + "%";
}

$("btnTutorial").onclick = showTour;
$("btnTutorial2").onclick = showTour;

$("btnTourNext").onclick = () => {
  if (tourIndex < tourSteps.length - 1) tourIndex++;
  else $("tour").classList.remove("show");
  renderTour();
};

$("btnTourPrev").onclick = () => {
  if (tourIndex > 0) tourIndex--;
  renderTour();
};

$("btnTourClose").onclick = () => $("tour").classList.remove("show");

if (!localStorage.getItem("tourDone")) showTour();
bindClick("btnTourClose", () => document.getElementById("tour")?.classList.remove("show"));
bindClick("btnTourPrev", () => typeof renderTour === "function" && (tourIndex = Math.max(0, tourIndex - 1), renderTour()));
bindClick("btnTourNext", () => typeof renderTour === "function" && (tourIndex = Math.min(tourSteps.length - 1, tourIndex + 1), renderTour()));
