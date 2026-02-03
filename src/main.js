let matchStartTime = null;
let lastCycleTime = null;
let matchTimeline = [];

const counterButtons = document.querySelectorAll(".counter-btn");
const recordButtons = document.querySelectorAll(".record-ball-btn");
const form = document.getElementById("scout_form");

function startTimer() {
  if (!matchStartTime) {
    matchStartTime = Date.now();
    lastCycleTime = matchStartTime;
  }
}

counterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    startTimer();

    const target = btn.dataset.target;
    const value = btn.dataset.value;

    // Remove active state from all buttons in the same group
    document.querySelectorAll(`.counter-btn[data-target="${target}"]`).forEach((button) => {
      button.classList.remove("bg-violet-600", "text-white");
      button.setAttribute("data-active", "false");
    });

    // Add active state to the clicked button
    btn.classList.add("bg-violet-600", "text-white");
    btn.setAttribute("data-active", "true");
  });
});

recordButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    startTimer();

    const phase = btn.dataset.phase;
    const madeButton = document.querySelector(`.counter-btn[data-target="${phase}_balls_made"][data-active="true"]`);
    const attemptedButton = document.querySelector(`.counter-btn[data-target="${phase}_balls_attempted"][data-active="true"]`);

    const made = madeButton ? parseInt(madeButton.dataset.value) : 0;
    const attempted = attemptedButton ? parseInt(attemptedButton.dataset.value) : 0;

    if (made === 0 && attempted === 0) return;

    const now = Date.now();

    matchTimeline.push({
      phase,
      timestamp: (now - matchStartTime) / 1000,
      cycle_time: (now - lastCycleTime) / 1000,
      shots_made: made,
      shots_attempted: attempted,
    });

    lastCycleTime = now;

    // Clear active state from all buttons
    document.querySelectorAll(".counter-btn").forEach((button) => {
      button.classList.remove("bg-violet-600", "text-white");
      button.setAttribute("data-active", "false");
    });
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  const storageKey = `scout_m${data.match_number}_t${data.team_number}`;
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      details: data,
      cycles: matchTimeline,
    }),
  );

  alert("Match saved!");
  form.reset();
  matchTimeline = [];
});
