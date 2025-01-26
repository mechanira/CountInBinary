let goal = 0;
let isCompleted = false;
let timer = 0;
let running = false;
let timerInterval;
let mode = "speedrun"
let points = 0;

const timerModeSeconds = 600
setGoal(1)

// handles drag clicking
let enableDragClicking = false;
let mousedown = false;
let lastToggledElement = null;
let dragEnable = true;

document.addEventListener("mousedown", (event) => {
    if (event.target.classList.contains("bit")) {
        if (enableDragClicking) {
            mousedown = true;
        }
        if (event.target.classList.contains("active")) {
            dragEnable = false; // if an active bit is clicked, only other active ones will be affected by dragging
        } else {
            dragEnable = true;
        }

        toggleBit(event.target);
        lastToggledElement = event.target;
    }
});

document.addEventListener("mouseup", () => {
    mousedown = false;
    lastToggledElement = null;
});

document.addEventListener("mousemove", (event) => {
    if (mousedown && event.target.classList.contains("bit") && event.target !== lastToggledElement) {
        if (event.target.classList.contains("active")) {
            if (!dragEnable) {
                toggleBit(event.target);
                lastToggledElement = event.target;
            }
        } else if (!event.target.classList.contains("active")) {
            if (dragEnable) {
                toggleBit(event.target);
                lastToggledElement = event.target;
            }
        }
    }
});

let modeBtns = document.querySelectorAll('.mode-btn');
modeBtns.forEach(el => el.addEventListener('mouseup', event => {
    if (running) {
        return;
    }

    modeBtns.forEach(btn => btn.classList.remove("active"));

    el.classList.add("active");

    if (el.id == "speedrun-mode" && mode != "speedrun") {
        mode = "speedrun";

        document.getElementById("stopwatch").style.display = "block";
        document.getElementById("timer-ms").style.display = "inline";
        document.getElementById("goal").style.display = "inline";
        document.getElementById("goal-prepend").style.display = "inline";
        document.getElementById("points").style.display = "none";

        resetGame()

    } else if (el.id == "timer-mode" && mode != "timer") {
        mode = "timer";

        document.getElementById("stopwatch").style.display = "block";
        document.getElementById("timer-ms").style.display = "none";
        document.getElementById("goal").style.display = "inline";
        document.getElementById("goal-prepend").style.display = "inline";
        document.getElementById("points").style.display = "block";

        setPoints(0)
        resetGame()

    } else if (el.id == "free-mode" && mode != "free") {
        mode = "free";

        document.getElementById("stopwatch").style.display = "none";
        document.getElementById("goal").style.display = "none";
        document.getElementById("goal-prepend").style.display = "none";
        document.getElementById("points").style.display = "none";
    }
}));

function toggleBit(element) {
    if (!running && !isCompleted && mode != "free") {
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

    setSum(sum);
    
    
    if (sum === goal && !isCompleted && mode != "free") {
        bgFlash("#103010", 100)
        
        if (mode == "speedrun") {
            if (sum == 255) {
                running = false;
                isCompleted = true;
                document.getElementById("timer").style.color = "#0a0"
                document.getElementById("timer-ms").style.color = "#0a0";
            } else {
                setGoal(goal + 1);
            }
        } else if (mode == "timer") {
            setPoints(points + 1)
            setGoal(parseInt(Math.random() * 255));
        }
    }
}

function bgFlash(color, interval) {
    bg = document.getElementById("site-container")
    bg.style.backgroundColor = color;
        setTimeout(() => {
            bg.style.backgroundColor = "#101010";
        }, interval);
}

function setGoal(value) {
    goal = value
    document.getElementById("goal").textContent = value;
    document.getElementById("goal-prepend").textContent = `/ ${"0".repeat(3 - value.toString().length)}`;
}

function setSum(value) {
    document.getElementById("sum").textContent = value;
    document.getElementById("sum-prepend").textContent = "0".repeat(3 - value.toString().length);
}

function setPoints(value) {
    points = value;
    document.getElementById("point-span").textContent = value;
}

function startTimer() {
    if (running) return;

    running = true;

    if (mode === "speedrun") {
        startTime = performance.now();
        timerInterval = setInterval(updateTimer, 1);
    } else if (mode === "timer") {
        timerInterval = setInterval(() => {
            if (timer > 0) {
                timer--;
                updateTimerDisplay();

                if (timer < 10) {
                    bgFlash("#201010", 200)
                }
            } else {
                clearInterval(timerInterval);
                running = false;
                isCompleted = true;
                document.getElementById("timer").textContent = "Time's up!";
            }
        }, 1000);
    }
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

function updateTimerDisplay() {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;

    document.getElementById("timer").textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
    if (mode == "speedrun") {
        document.getElementById("timer").textContent += ".";
        document.getElementById("timer-ms").textContent = "000";
    }
}

function resetGame() {
    document.querySelectorAll('.bit.active').forEach(bit => {
        bit.classList.remove("active");
        bit.textContent = "0";
    });

    updateSum();
    setPoints(0)

    clearInterval(timerInterval);
    running = false;
    isCompleted = false;

    if (mode == "speedrun") {
        setGoal(1);
        timer = 0;
    } else if (mode === "timer") {
        timer = timerModeSeconds;
        updateTimerDisplay();
        setGoal(parseInt(Math.random() * 255));
    }
    
    if (mode == "speedrun") {
        document.getElementById("timer").textContent = "0.";
        document.getElementById("timer-ms").textContent = "000";
    }

    document.getElementById("timer").style.color = "#fff"
    document.getElementById("timer-ms").style.color = "#fff"
}