import TimeTracker from "./timetracker";

function updateDOM() {
    const test = document.getElementById("time-tracker-test");
    if (test)
        test.innerText = timeTracker.toJSON(true);
}

const timeTracker = new TimeTracker();
const id1 = timeTracker.addPunchCard();

timeTracker.punchIn(id1);
updateDOM();

window.setTimeout(() => {
    timeTracker.punchOut(id1); updateDOM()
}, 1500);