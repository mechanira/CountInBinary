let goal = 0;
let isCompleted = true;
let timer = 0;
let running = false;
let timerInterval;
let mode = "speedrun"

setGoal(parseInt(Math.random() * 255))

let bits = document.querySelectorAll('.bit');
bits.forEach(el => el.addEventListener('mousedown', event => {
    toggleCheckbox(el);
}));

let modeBtns = document.querySelectorAll('.mode-btn');
modeBtns.forEach(el => el.addEventListener('mousedown', event => {
    modeBtns.forEach(btn => btn.classList.remove("active"));

    el.classList.add("active");

    if (el.id == "speedrun-mode") {
        mode = "speedrun";
    } else if (el.id == "timer-mode") {
        mode = "timer";
    } else {
        mode = "free";
    }
}));

function toggleCheckbox(element) {
    if (!running) {
        startTimer();
    }

    element.classList.toggle("active");
    element.textContent = element.classList.contains("active") ? "1" : "0";
    updateSum();
}

function updateSum() {
    let sum = 0;

    document.querySelectorAll('.bit.active').forEach(checkbox => {
        sum += parseInt(checkbox.getAttribute("data-value"));
    });

    document.getElementById("sum").textContent = sum;
    document.getElementById("sum-prepend").textContent = "0".repeat(3 - sum.toString().length);
    
    bg = document.getElementById("site-container")
    if (sum === goal) {
        bg.style.backgroundColor = "#103010";
        setTimeout(() => {
            bg.style.backgroundColor = "#101010";
        }, 100);

        setGoal(parseInt(Math.random() * 255))
    }
}

function setGoal(value) {
    goal = value
    document.getElementById("goal").textContent = value;
    document.getElementById("goal-prepend").textContent = "0".repeat(3 - value.toString().length);
}

function startTimer() {
    if (running) {
        return;
    }
    
    running = true;
    startTime = performance.now();
    timerInterval = setInterval(updateTimer, 1);
}

function updateTimer() {
    if (running) {
        let elapsedTime = performance.now() - startTime;
        let milliseconds = Math.floor(elapsedTime % 1000);
        let seconds = Math.floor((elapsedTime / 1000) % 60);
        let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
        let hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
        
        let timeString = "";
        if (hours > 0) {
            timeString += `${hours}:`;
            timeString += `${String(minutes).padStart(2, '0')}:`;
        } else if (minutes > 0) {
            timeString += `${minutes}:`;
            timeString += `${String(seconds).padStart(2, '0')}.`;
        } else {
            timeString += `${seconds}.`;
        }
        
        document.getElementById("timer").textContent = timeString;
        document.getElementById("timer-ms").textContent = `${String(milliseconds).padStart(3, '0')}`;
    }
}

function resetTimer() {
    setGoal(parseInt(Math.random() * 255))

    document.querySelectorAll('.bit.active').forEach(bit => {
        bit.classList.remove("active")
        bit.textContent = "0"
    });

    updateSum()

    clearInterval(timerInterval);
    running = false;
    document.getElementById("timer").textContent = "0.";
    document.getElementById("timer-ms").textContent = "000";
}