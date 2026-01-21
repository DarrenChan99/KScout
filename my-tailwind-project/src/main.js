let matchStartTime = null
let lastCycleTime = null
let matchTimeline = []

const counterButtons = document.querySelectorAll('.counter-btn')
const recordButtons = document.querySelectorAll('.record-ball-btn')
const form = document.getElementById('scout_form')

function startTimer() {
  if (!matchStartTime) {
    matchStartTime = Date.now()
    lastCycleTime = matchStartTime
  }
}

counterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    startTimer()
    const input = document.getElementById(btn.dataset.target)
    input.value = btn.dataset.value
  })
})

recordButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    startTimer()

    const phase = btn.dataset.phase
    const madeInput = document.getElementById(`${phase}_balls_made`)
    const attemptedInput = document.getElementById(`${phase}_balls_attempted`)

    const made = parseInt(madeInput.value)
    const attempted = parseInt(attemptedInput.value)

    if (made === 0 && attempted === 0) return

    const now = Date.now()

    matchTimeline.push({
      phase,
      timestamp: (now - matchStartTime) / 1000,
      cycle_time: (now - lastCycleTime) / 1000,
      shots_made: made,
      shots_attempted: attempted,
    })

    lastCycleTime = now
    
    madeInput.value = 0
    attemptedInput.value = 0
  })
})



form.addEventListener('submit', e => {
  e.preventDefault()

  const data = Object.fromEntries(new FormData(form).entries())

  const storageKey = `scout_m${data.match_number}_t${data.team_number}`
  localStorage.setItem(storageKey, JSON.stringify({
    details: data,
    cycles: matchTimeline
  }))

  alert('Match saved!')
  form.reset()
  matchTimeline = []
})