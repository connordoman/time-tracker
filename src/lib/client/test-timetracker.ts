import TimeTracker from "../timetracker";

function updateDOM() {
    const test = document.getElementById("time-tracker-test");
    if (test)
        test.innerText = timeTracker.toJSON(true);
}

const timeTracker = new TimeTracker();
const id1 = timeTracker.addPunchCard();
const id2 = timeTracker.addPunchCard();

timeTracker.punchIn(id1);
updateDOM();

for (let i = 0; i < 4; i++) {
    timeTracker.punchIn(id2);
    updateDOM();
    timeTracker.punchOut(id2);
    updateDOM();
}

const interval = window.setInterval(() => {
    timeTracker.punchIn(id1);
    updateDOM()

    // stop if there are 5 work periods on any card
    if (timeTracker.longestCardLength() >= 5) {
        window.clearInterval(interval);
    }

    window.setTimeout(() => {
        timeTracker.punchOut(id1);
        updateDOM()
    }, 500);
}, 1000);
