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

//ld cycle
let speech = "1AC";

//ld times
const ldCycle = [
    {speech: "1AC", time: 6*60},
    {speech: "CX", time: 3*60},
    {speech: "1NC", time: 7*60},
    {speech: "CX", time: 3*60},
    {speech: "1AR", time: 4*60},
    {speech: "2NR", time: 6*60},
    {speech: "2AR", time: 3*60}
]

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
    toggleOverlay();
    currentMode = type;

    if(type == "custom"){
        inputTime.style.display = "flex";
    } else if(type == "pomodoro"){
        displayTime.innerText = "00:25:00";
        clearInputFields();
    } else if(type == "ld"){
        displayTime.innerText = "00:06:00";
        clearInputFields();
    } else if(type == "pf"){

    }
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
        isRunning = false;
        switchSession(); 
        return;
    }

    displayTime.textContent = formatTime(timeLeft);
}

//next session/speech
function switchSession(){
    switch (currentMode){
        case "pomodoro":
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

            const nextPomodoro = sessionType === "work" ? pomodoroWorkDuration : sessionType === "long break" ? pomodoroLongBreak: pomodoroShortBreak;
            startTimer(nextPomodoro);
            break;
        case "ld":
            cycle++;
            startLd();
            break;
    }
}

function startTimer(durationToUse){
    duration = durationToUse;

    if(pausedTime !== null){
        timeLeft = pausedTime;
        startTime = Date.now()-(duration-timeLeft) * 1000;
        pausedTime = null;
    } else{
        timeLeft = duration;
        startTime = Date.now();
    }

    clearInterval(interval); 
    interval = setInterval(updateDisplay, 1000);
    
}

function startLd(){
    if(cycle < ldCycle.length){
        speech = ldCycle[cycle].speech;
        timeLeft = ldCycle[cycle].time;
        duration = timeLeft;
        startTimer(duration)
    } else{
        alert("debate done");
    }
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

        switch (currentMode){
            case "pomodoro":
                const pomoDuration = sessionType === "work" ? pomodoroWorkDuration : sessionType === "long break" ? pomodoroLongBreak: pomodoroShortBreak;
                startTimer(pomoDuration);
                break;
            case "ld":
                startLd();
        }
    }
    return;
}

function stopButton(){
    if(isRunning){
        clearInterval(interval);
        isRunning = false;
    }

    timeLeft = 0;
    cycle = 0;
    switch(currentMode){
        case "pomodoro":
            displayTime.innerText = formatTime(pomodoroWorkDuration);
            sessionType = "work";
            break;
        case "ld":
            displayTime.innerText = formatTime(ldCycle[0].time);
            break;
    }
    
}


function toggleOverlay() {
    const display = window.getComputedStyle(overlay).display;

    if (display === "none") {
        overlay.style.display = "flex";
        clearInterval(interval);
        isRunning = false;
        pausedTime = timeLeft;
    } else {
        overlay.style.display = "none";
    }
}

function clearInputFields(){
    inputTime.style.display = "none";
}

//shortcuts
const keysPressed = new Set();

document.addEventListener("keydown", function(event){
    keysPressed.add(event.key.toLowerCase());

    if(keysPressed.has("meta") && keysPressed.has("shift") && keysPressed.has("o")){
        event.preventDefault();
        toggleOverlay();
        keysPressed.clear();
    }
})

document.addEventListener("keyup", (event) =>{
    keysPressed.delete(event.key);
})