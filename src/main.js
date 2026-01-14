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

    const targetId = this.dataset.target;
    const targetValue = this.dataset.value;

    const input = document.getElementById(targetId);
    input.value = targetValue;

    counterButtons.forEach((btn) => {
      if (btn.dataset.target === targetId) btn.classList.remove("active");
    });

    this.classList.add("active");
  });
});

// RECORD CYCLE LOGIC ---------------------
recordCycleButton.forEach((button) => {
  button.addEventListener("click", function () {
    const phase = this.dataset.phase;

    const shotsMadeInput = document.getElementById(`${phase}_balls_made`);
    const attemptedShotsInput = document.getElementById(`${phase}_balls_attempted`);

    const shotsMade = parseInt(shotsMadeInput.value);
    const attemptedShots = parseInt(attemptedShotsInput.value);

    if (shotsMade === 0 && attemptedShots === 0) return;

    const now = Date.now();
    const timestampSec = (now - matchStartTime) / 1000;
    const cycleTimeSec = (now - lastCycleTime) / 1000;

    matchTimeline.push({
      phase: phase,
      timestamp: timestampSec,
      cycle_time: cycleTimeSec,
      shots_made: shotsMade,
      shots_attempted: attemptedShots,
    });

    shotsMadeInput.value = 0;
    attemptedShotsInput.value = 0;
    lastCycleTime = now;

    counterButtons.forEach((btn) => {
      if (btn.dataset.target.includes(phase)) btn.classList.remove("active");
    });
  });
});

// FORM SUBMISSION ---------------------
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(form);
  const matchInfo = Object.fromEntries(formData.entries());

  const fullMatchData = {
    details: matchInfo,
    cycles: matchTimeline,
  };

  const storageKey = `scout_m${matchInfo.match_number}_t${matchInfo.team_number}`;
  localStorage.setItem(storageKey, JSON.stringify(fullMatchData));

  form.reset();
});
