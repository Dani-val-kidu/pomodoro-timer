// --- DOM Element Selection ---
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const msDisplay = document.getElementById('ms-digits');
const statusLabel = document.getElementById('status-label');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

// Mode Tab Selection Elements
const workTab = document.getElementById('work-tab');
const shortTab = document.getElementById('short-tab');
const longTab = document.getElementById('long-tab');
const sessionCountDisplay = document.getElementById('session-count');

// Modal Elements
const settingsModal = document.getElementById('settings-modal');
const settingsOpenBtn = document.getElementById('settings-open-btn');
const settingsCloseBtn = document.getElementById('settings-close-btn');
const settingsSaveBtn = document.getElementById('settings-save-btn');
const inputWork = document.getElementById('input-work');
const inputShort = document.getElementById('input-short');
const inputLong = document.getElementById('input-long');

// --- Global App Engine State Configurations ---
let timerId = null;
let currentMode = 'work'; // Options: 'work', 'short', 'long'
let completedSessions = 0;
let expectedEndTime = null; 
let pauseOffset = 0; // Tracks remaining time when paused inside millisecond units

// Configurable time limits parameters (measured inside minutes)
let timeConfig = {
  work: 25,
  short: 5,
  long: 15
};

// --- Presentation Drivers UI Layer ---
function updateDisplay(msLeft) {
  if (msLeft < 0) msLeft = 0;

  const totalSeconds = Math.floor(msLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  // Extract remaining centiseconds (00-99 range)
  const centiseconds = Math.floor((msLeft % 1000) / 10);
  
  minutesDisplay.textContent = String(minutes).padStart(2, '0');
  secondsDisplay.textContent = String(seconds).padStart(2, '0');
  msDisplay.textContent = String(centiseconds).padStart(2, '0');
}

function changeMode(mode) {
  // Clear any operational interval engines active
  pauseTimer();
  
  currentMode = mode;
  
  // Update state elements classes for aesthetic UI shifts
  document.body.className = `theme-${mode}`;
  
  workTab.classList.toggle('active', mode === 'work');
  shortTab.classList.toggle('active', mode === 'short');
  longTab.classList.toggle('active', mode === 'long');
  
  // Text Label updates
  if (mode === 'work') statusLabel.textContent = "Time to Focus!";
  else if (mode === 'short') statusLabel.textContent = "Short Break Rest";
  else statusLabel.textContent = "Extended Break Rest";

  // Re-calculate local time left states
  pauseOffset = timeConfig[mode] * 60 * 1000;
  updateDisplay(pauseOffset);
}

// --- Dynamic Countdown Timers Routines ---
function startTimer() {
  if (timerId !== null) return;

  startBtn.disabled = true;
  pauseBtn.disabled = false;

  // Establish exactly when the countdown should end relative to system clock
  expectedEndTime = Date.now() + pauseOffset;

  // Run the tick rate fast (approx every 16ms) to display fractions smoothly
  timerId = setInterval(() => {
    const msRemaining = expectedEndTime - Date.now();

    if (msRemaining <= 0) {
      clearInterval(timerId);
      timerId = null;
      pauseOffset = 0;
      updateDisplay(0);
      handleCycleCompletion();
    } else {
      updateDisplay(msRemaining);
    }
  }, 16);
}

function pauseTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
    // Cache the remaining milliseconds left so we can resume properly later
    pauseOffset = expectedEndTime - Date.now();
  }
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  pauseTimer();
  pauseOffset = timeConfig[currentMode] * 60 * 1000;
  updateDisplay(pauseOffset);
}

// Process automated transitions between workflow contexts
function handleCycleCompletion() {
  if (currentMode === 'work') {
    completedSessions++;
    sessionCountDisplay.textContent = completedSessions;
    
    if (completedSessions % 4 === 0) {
      alert("Excellent work! Four sessions complete. Take a longer break.");
      changeMode('long');
    } else {
      alert("Session complete! Time for a short breathing window.");
      changeMode('short');
    }
  } else {
    alert("Break time over! Ready to return to focus blocks?");
    changeMode('work');
  }
}

// --- Settings Modals Framework Handlers ---
function openModal() {
  inputWork.value = timeConfig.work;
  inputShort.value = timeConfig.short;
  inputLong.value = timeConfig.long;
  settingsModal.classList.remove('hidden');
}

function closeModal() {
  settingsModal.classList.add('hidden');
}

function saveSettings() {
  timeConfig.work = parseInt(inputWork.value) || 25;
  timeConfig.short = parseInt(inputShort.value) || 5;
  timeConfig.long = parseInt(inputLong.value) || 15;
  
  closeModal();
  pauseOffset = timeConfig[currentMode] * 60 * 1000;
  updateDisplay(pauseOffset);
}

// --- Wire Up Operational Event Handlers ---
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

workTab.addEventListener('click', () => changeMode('work'));
shortTab.addEventListener('click', () => changeMode('short'));
longTab.addEventListener('click', () => changeMode('long'));

settingsOpenBtn.addEventListener('click', openModal);
settingsCloseBtn.addEventListener('click', closeModal);
settingsSaveBtn.addEventListener('click', saveSettings);

// Initial Load execution trigger
pauseOffset = timeConfig[currentMode] * 60 * 1000;
updateDisplay(pauseOffset);