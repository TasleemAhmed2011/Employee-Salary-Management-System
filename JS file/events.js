$("btnSaveEvent").onclick = () => {
  state.events.push({
    id: Date.now(),
    title: $("eventTitle").value,
    date: $("eventDate").value
  });
  saveState();
  toast("Event added");
};
function initEventsModule() {
  bindClick("btnSaveEvent", () => {
    if (typeof addEvent === "function") addEvent();
    else alert("Events: addEvent() not found. Tell me your IDs.");
  });

  bindClick("btnAddEventQuick", () => {
    if (typeof addEvent === "function") addEvent();
  });
}
function initEventsModule() {
  bindClick("btnAddEvent", () => toast("Fill event details → click Save"));

  bindClick("btnSaveEvent", () => {
    if (typeof addEvent === "function") addEvent();
    else toast("addEvent() not found in events.js");
  });

  // Dashboard quick button also exists
  bindClick("btnAddEventQuick", () => {
    if (typeof addEventQuick === "function") addEventQuick();
    else if (typeof addEvent === "function") addEvent();
  });
}

