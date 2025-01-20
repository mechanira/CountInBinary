let goal = 1;
let isCompleted = true;
let timer = 0;
let running = false;
let timerInterval = 60000;

function toggleCheckbox(element) {
    if (!running) {
        startTimer();
    }

    element.classList.toggle("active");
    element.textContent = element.classList.contains("active") ? "1" : "0";
    updateSum();
}

let bits = document.querySelectorAll('.bit');

bits.forEach(el => el.addEventListener('mousedown', event => {
    toggleCheckbox(el);
}));

function updateSum() {
    let sum = 0;
    document.querySelectorAll('.bit.active').forEach(checkbox => {
        sum += parseInt(checkbox.getAttribute("data-value"));
    });
    document.getElementById("sum").textContent = sum;
    
    bg = document.getElementById("site-container")

    if (sum === goal) {
        bg.style.backgroundColor = "#103010";
        setTimeout(() => {
            bg.style.backgroundColor = "#101010";
        }, 100);

        if (sum == 255) {
            running = false;
            alert("You completed the challenge!")
            return;
        }

        goal++;
        document.getElementById("goal").textContent = goal;
    }
}

function startTimer() {
    if (!running) {
        running = true;
        startTime = performance.now();
        timerInterval = setInterval(updateTimer, 1);
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

function resetTimer() {
    goal = 1;
    document.getElementById("goal").textContent = goal;
    document.querySelectorAll('.bit.active').forEach(bit => {
        bit.classList.remove("active")
    });
    document.getElementById("sum").textContent = "0";
    clearInterval(timerInterval);
    running = false;
    document.getElementById("timer").textContent = "0.";
    document.getElementById("timer-ms").textContent = "000";
}