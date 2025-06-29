//timerSelectin overlay div
let currentMode = null;

const overlay = document.getElementById("timerSelection");
const customButton = document.getElementById("custom");
const pomodoroButton = document.getElementById("pomodoro");
const ldButton = document.getElementById("ld");
const pfButton = document.getElementById("pf");

const inputTime = document.getElementById("inputTime");

//<p> that shows 00:00:00
const displayTime = document.getElementById("displayTime");

//pomodoro cycle
let sessionType = "work";

//pomodoro times
let pomodoroWorkDuration = 25*60; //25 min
let pomodoroShortBreak = 5*60;
let pomodoroLongBreak = 15*60;

//timer stuff
let currentDuration = pomodoroWorkDuration;
let duration;
let startTime;
let timeLeft = currentDuration;
let interval = null;
let isRunning = false;
let cycle = 0;
let pausedTime = null;

//==clears overlay and sets the preset times==
function timerSelected(type){
    overlayDone();
    currentMode = type;

    if(type == "custom"){
        inputTime.style.display = "flex";
    } else if(type == "pomodoro"){
        displayTime.innerText = "00:25:00";
        clearInputFields();
    } else if(type == "ld"){
        
    } else if(type == "pf"){

    }
}

//==pomodoroTimer==
function pomodoroTimer(){
    if (sessionType === "work") {
        duration = pomodoroWorkDuration;
    } else if (sessionType === "long break") {
        duration = pomodoroLongBreak;
    } else {
        duration = pomodoroShortBreak;
    }

    if(pausedTime !== null){
        timeLeft = pausedTime;
        startTime = Date.now()-(duration-timeLeft) * 1000;
        pausedTime = null;
    } else{
        timeLeft = duration;
        startTime = Date.now();
    }

    clearInterval(interval); 
    interval = setInterval(() => {
        updateDisplay();
    }, 1000);
}

function formatTime(seconds){
    const h = Math.floor(seconds/3600)
    const m = Math.floor((seconds%3600)/60);
    const s = seconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function updateDisplay(){
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000); // in seconds
    timeLeft = duration - elapsed;

    if (timeLeft <= 0) {
        clearInterval(interval);
        displayTime.textContent = "00:00:00";
        switchSession(); 
        return;
    }

    displayTime.textContent = formatTime(timeLeft);
}

function switchSession(){
    if (sessionType === "work") {
        cycle++;
        if (cycle % 4 === 0) {
            sessionType = "long break";
        } else {
            sessionType = "short break";
        }
    } else {
        sessionType = "work";
    }

    pomodoroTimer();
}

function pauseButton(){
    if(isRunning){
        clearInterval(interval);
        isRunning = false;
        pausedTime = timeLeft;
    }
}

function startButton(){
    if(!isRunning){
        isRunning = true;

        if(currentMode === "pomodoro"){
            pomodoroTimer();
        } else if(currentMode === "ld"){

        }
    }
}

function stopButton(){
    if(isRunning){
        clearInterval(interval);
        isRunning = false;
    }

    timeLeft = 0;
    displayTime.innerText = formatTime(pomodoroWorkDuration);
    sessionType = "work";
    cycle = 0;
}

function overlayDone(){
    overlay.style.display = "none";
}

function clearInputFields(){
    inputTime.style.display = "none";
}

//shortcuts
const keysPressed = new Set();

document.addEventListener("keydown", function(event){
    keysPressed.add(event.key);

    if(keysPressed.has("Meta") && keysPressed.has("Shift") && keysPressed.has("o")){
        event.preventDefault();
        overlay.style.display = "";
        keysPressed.clear();
    }
})

document.addEventListener("keyup", (event) =>{
    keysPressed.delete(event.key);
})