import TimeTracker from "../timetracker";
import defaultTimeTracker from "./defaultTimetracker.json";

const timeTracker = new TimeTracker(defaultTimeTracker.settings);

function updateDOM() {
  const test = document.getElementById("time-tracker-test");
  if (test) test.innerText = timeTracker.toJSON(true);
}

timeTracker.loadPunchCards(defaultTimeTracker.punchCards);
updateDOM();
