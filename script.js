// 1. Grab DOM Elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const statusLabel = document.getElementById('status-label');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// 2. State Variables
let timerId = null;
let timeLeft = 25 * 60; // 25 minutes in seconds

// 3. Helper function to update the screen interface
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Use padStart so single digits look like "05" instead of "5"
  minutesDisplay.textContent = String(minutes).padStart(2, '0');
  secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

// 4. Timer Logic
function startTimer() {
  if (timerId !== null) return; // Prevent creating duplicate intervals

  // Disable start, enable pause
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timerId = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft === 0) {
      clearInterval(timerId);
      timerId = null;
      statusLabel.textContent = "Take a break!";
      alert("Time's up! Take a well-deserved break.");
      resetTimer();
    }
  }, 1000); // Triggers every 1000 milliseconds (1 second)
}

function pauseTimer() {
  clearInterval(timerId);
  timerId = null;
  
  // Toggle button availability
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  pauseTimer();
  timeLeft = 25 * 60;
  statusLabel.textContent = "Work Time";
  updateDisplay();
}

// 5. Attach Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);