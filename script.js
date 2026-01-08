// 1. Select elements matching YOUR current HTML
const counterButtons = document.querySelectorAll('.counter-btn');
const resetButtons = document.querySelectorAll('.reset-btn'); 
const sendBallButton = document.querySelectorAll('sendball-btn')
const form = document.getElementById('scout_form');

// 2. The Logic to Update the Count
function updateCount(event) {
  const btn = event.target;
  const targetId = btn.getAttribute('data-target'); // e.g., "auto_balls"
  const input = document.getElementById(targetId);

  // Parse the numbers
  const changeValue = parseInt(btn.getAttribute('data-change'));
  let currentValue = parseInt(input.value);

  // Safety: Treat empty inputs as 0
  if (isNaN(currentValue)) currentValue = 0;

  let newValue = currentValue + changeValue;

  // Prevent negative numbers
  if (newValue < 0) newValue = 0;

  input.value = newValue;
}

// 3. The Logic to Reset to 0
function resetCount(event) {
  const btn = event.target;
  const targetId = btn.getAttribute('data-target');
  const input = document.getElementById(targetId);
  input.value = 0;
}



// 4. Attach the Logic to the Buttons
counterButtons.forEach(button => {
  button.addEventListener('click', updateCount);
});

resetButtons.forEach(button => {
  button.addEventListener('click', resetCount);
});

sendBallButton.forEach(button => {
    button.addEventListener('click', resetCount);
});


// 5. Submit Handler (Basic Version)
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  console.log("Form Data:", data);
  alert(`Submitted! Match: ${data.match_number}, Team: ${data.team_number}`);
  
  // Optional: Clear form after submit
  // form.reset(); 
});