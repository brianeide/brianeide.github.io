var stage = 0; // 0-indexed
var workingPeriod = 25 * 60;
var breakPeriod = 5 * 60;
var longBreakPeriod = 30 * 60;
var currentSeconds = workingPeriod;
var timer = null;
var active = false;
var onBreak = false;

function numberToString(n, padZero) {
    if (n < 10 && n > -1)
        return (padZero ? "0" : "") + n;
    return n;
}

function secondsToTime(duration) {
    if (duration / (3600 * 24) >= 1) { // days, hours, minutes, and seconds
        var seconds = duration % 60;
        var minutes = (duration % 3600 - seconds) / 60;
        var hours = (duration % (3600 * 24) - duration % 3600) / 3600;
        var days = (duration - duration % (3600 * 24)) / (3600 * 24);
        return numberToString(days, false) + ":" + numberToString(hours, true) + ": " + numberToString(minutes, true) + ":" + numberToString(seconds, true);
    } else if (duration / 3600 >= 1) { // hours, minutes, and seconds
        var seconds = duration % 60;
        var minutes = (duration % 3600 - seconds) / 60;
        var hours = (duration - duration % 3600) / 3600;
        return numberToString(hours, false) + ": " + numberToString(minutes, true) + ":" + numberToString(seconds, true);
    } else if (duration >= 60) { // minutes, seconds
        var seconds = duration % 60;
        var minutes = (duration - seconds) / 60;
        return numberToString(minutes, false) + ":" + numberToString(seconds, true);
    } else { // seconds
        return "00:" + numberToString(duration % 60, true);
    }
}

function updateDisplay() {
    document.getElementById("display").innerHTML = secondsToTime(currentSeconds);
    if (!onBreak) {
        document.getElementById("r" + stage).setAttributeNS(null, 'width', Math.ceil(42 * ((workingPeriod - currentSeconds) / (workingPeriod))));
    }
}

function tick() {
    currentSeconds--;
    if (currentSeconds == 0) {
        toggleTimer();
        document.getElementById("next").disabled = false;
        document.getElementById("start-pause").disabled = true;
    }
    updateDisplay();
}

function toggleTimer() {
    if (!active) {
        active = true;
        document.getElementById("start-pause").innerHTML = '<i class="fas fa-pause"></i>';
        document.getElementById("start-pause").title = "Pause";
        document.getElementById("reset").disabled = false;
        document.getElementById("start-pause").disabled = false;
        timer = setInterval(tick, 1000);
    } else {
        active = false;
        document.getElementById("start-pause").innerHTML = '<i class="fas fa-play"></i>';
        document.getElementById("start-pause").title = "Start";
        clearInterval(timer);
    }
}

function reset() {
    if (active) {
        toggleTimer();
    }
    if (onBreak) {
        if (stage == 3) {
            currentSeconds = breakPeriod + longBreakPeriod;
        } else {
            currentSeconds = breakPeriod;
        }
    } else {
        currentSeconds = workingPeriod
    }
    updateDisplay();
    document.getElementById("reset").disabled = true;
    document.getElementById("next").disabled = true;
    document.getElementById("start-pause").disabled = false;
}

function next() {
    if (onBreak) {
        onBreak = false;
        currentSeconds = workingPeriod;
        document.getElementById("t" + stage).classList.remove("break");
        document.getElementById("c" + stage).style.fill = '#73beff';
        if (stage == 3) {
            stage = 0;
            for (var i = 0; i < 4; i++) {
                document.getElementById("c" + i).style.fill = 'black';
                document.getElementById("r" + i).setAttributeNS(null, 'width', 0);
            }
        } else {
            stage++;
        }
    } else {
        onBreak = true;
        if (stage == 3) {
            currentSeconds = breakPeriod + longBreakPeriod;
        } else {
            currentSeconds = breakPeriod;
        }
        document.getElementById("t" + stage).classList.add("break");
    }
    updateDisplay();
    toggleTimer();
    document.getElementById("next").disabled = true;
}

function totalReset() {
    if (active) {
        toggleTimer();
    }
    if (onBreak) {
        document.getElementById("t" + stage).classList.remove("break");
        onBreak = false;
    }
    stage = 0;
    for (var i = 0; i < 4; i++) {
        document.getElementById("c" + i).style.fill = 'black';
        document.getElementById("r" + i).setAttributeNS(null, 'width', 0);
    }
    currentSeconds = workingPeriod;
    updateDisplay();
    document.getElementById("start-pause").disabled = false;
    document.getElementById("next").disabled = true;
    document.getElementById("reset").disabled = true;
}

function setPP() {
    var mins = parseInt(document.getElementById("pp1").value);
    var secs = parseInt(document.getElementById("pp2").value);
    if (Number.isNaN(mins)) mins = 0;
    if (Number.isNaN(secs)) secs = 0;
    if (mins + secs == 0) return;
    workingPeriod = mins * 60 + secs;
    document.getElementById("currentpp").textContent = secondsToTime(workingPeriod);
    if (!onBreak && currentSeconds > workingPeriod) {
        currentSeconds = workingPeriod;
        updateDisplay();
    }
}

function setSBP() {
    var mins = parseInt(document.getElementById("sbp1").value);
    var secs = parseInt(document.getElementById("sbp2").value);
    if (Number.isNaN(mins)) mins = 0;
    if (Number.isNaN(secs)) secs = 0;
    if (mins + secs == 0) return;
    breakPeriod = mins * 60 + secs;
    document.getElementById("currentsbp").textContent = secondsToTime(breakPeriod);
    if (onBreak && stage != 3 && currentSeconds > breakPeriod) {
        currentSeconds = breakPeriod;
        updateDisplay();
    }
}

function setLBP() {
    var mins = parseInt(document.getElementById("lbp1").value);
    var secs = parseInt(document.getElementById("lbp2").value);
    if (Number.isNaN(mins)) mins = 0;
    if (Number.isNaN(secs)) secs = 0;
    if (mins + secs == 0) return;
    longBreakPeriod = mins * 60 + secs;
    document.getElementById("currentlbp").textContent = secondsToTime(longBreakPeriod);
    if (onBreak && stage == 3 && currentSeconds > longBreakPeriod + breakPeriod) {
        currentSeconds = longBreakPeriod + breakPeriod;
        updateDisplay();
    }
}

window.onload = function() {
    updateDisplay();
}