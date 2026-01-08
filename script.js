let matchStartTime = null;
let lastCycleTime = null;
let matchTimeline = [];

const counterButtons = document.querySelectorAll(".counter-btn");
const recordCycleButton = document.querySelectorAll(".record-ball-btn");
const form = document.getElementById("scout_form");

function hasStartTimer() {
  if (!matchStartTime) {
    matchStartTime = Date.now();
    lastCycleTime = matchStartTime;
  }
}

// BALL COUNTER LOGIC ---------------------
counterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    hasStartTimer();

    const targetId = this.getAttribute("data-target");
    const targetValue = this.getAttribute("data-value");

    const input = document.getElementById(targetId);
    input.value = targetValue;

    counterButtons.forEach((button) => {
      if (button.getAttribute("data-target") == targetId) {
        button.classList.remove("active");
      }
    });

    this.classList.add("active");
  });
});
// BALL COUNTER LOGIC ---------------------

recordCycleButton.forEach((button) => {
  button.addEventListener("click", function () {
    const phase = this.getAttribute("data-phase");

    const shotsMadeId = phase + "_balls_made";
    const attemptedShotsId = phase + "_balls_attempted";

    const shotsMadeInput = document.getElementById(shotsMadeId);
    const attemptedShotsInput = document.getElementById(attemptedShotsId);

    const shotsMade = parseInt(shotsMadeInput.value);
    const attemptedShots = parseInt(attemptedShotsInput.value);

    if (shotsMade == 0 && attemptedShots == 0) {
      return;
    }

    const now = Date.now();
    const timestampSec = (now - matchStartTime) / 1000;
    const cycleTimeSec = (now - lastCycleTime) / 1000;

    const cycleData = {
      phase: phase,
      timestamp: timestampSec,
      cycle_time: cycleTimeSec,
      shots_made: shotsMade,
      shots_attempted: attemptedShots,
    };

    matchTimeline.push(cycleData);

    shotsMadeInput.value = 0;
    attemptedShotsInput.value = 0;
    lastCycleTime = now;

    counterButtons.forEach((button) => {
      if (button.getAttribute("data-target").includes(phase)) {
        button.classList.remove("active");
      }
    });
  });
});

// SUBMIT LOGIC ---------------------
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(form);
  const matchInfo = Object.fromEntries(formData.entries());

  const fullMatchData = {
    details: matchInfo,
    cycles: matchTimeline,
  };

  const storageKey = "scout_m${details.match_number}_t${details.team_number}"; // example -> "scout_m2_t23346"
  const dataString = JSON.stringify(fullMatchData);
  localStorage.setItem(storageKey, dataString);

  form.reset();
});
// SUBMIT LOGIC ---------------------
