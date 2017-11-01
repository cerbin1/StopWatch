var soundEffect = new Audio('sound/phone_sound_effect.mp3');

var running = false;
var set = false;
var finished = true;

var interval;

var seconds, minutes, hours;

var timeToCountdownInMillis;
var timeToCountdown;
var timestampWhenPaused;

var resetClicksCount = 0;

$(document).ready(function () {
    setListeners();
});

function displayTimeToCountdown(timeToDisplay) {
    $('#timer').text(timeToDisplay);
}

function setTimeToCountdown(timeInMillis) {
    timeToCountdownInMillis = timeInMillis;
    console.log(timeToCountdownInMillis);

    seconds = Math.floor(timeToCountdownInMillis / 1000) % 60;
    minutes = Math.floor(timeToCountdownInMillis / 1000 / 60) % 60;
    hours = Math.floor(timeToCountdownInMillis / 1000 / 60 / 60);
    displayTimeToCountdown(getTimeSet());
    set = true;
}

function setTimer() {
    if (finished) {
        var secondsValue = parseInt($('#secondsInput').val(), 10);
        var minutesValue = parseInt($('#minutesInput').val(), 10);

        if (isNaN(secondsValue)) {
            secondsValue = 0;
        }
        if (isNaN(minutesValue)) {
            minutesValue = 0;
        }

        if (secondsValue < 0 || minutesValue < 0) {
            console.log("Time can not be negative");
        } else if (secondsValue === 0 && minutesValue === 0) {
            console.log("Timer can not be zero");
        } else {
            var timeInMillis = (minutesValue * 60 + secondsValue) * 1000;
            setTimeToCountdown(timeInMillis);
        }
    } else {
        console.log("Timer is running");
    }
}

function setCountdownMinutes(minutes) {
    if (finished) {
        var timeInMillis = (minutes * 60) * 1000;
        if (timeInMillis === timeToCountdownInMillis) {
            runTimer();
        }
        else {
            setTimeToCountdown(timeInMillis);
        }
    }
}

function getTimeSet() {
    return (hours < 10 ? "0" : "") + hours
        + (minutes < 10 ? ":0" : ":") + minutes
        + (seconds < 10 ? ":0" : ":") + seconds;
}

function runTimer() {
    if (finished) {
        if (set) {
            timeToCountdown = new Date().getTime() + timeToCountdownInMillis;
            $('#run-timer').text('Pause');
            startTimer();
            finished = false;
            running = true;
        } else {
            console.log("Set new timer");
        }
    }
    else {
        toggleTimer();
    }
}

function toggleTimer() {
    if (running) {
        clearInterval(interval);
        console.log("Paused");
        timestampWhenPaused = new Date().getTime();
    } else {
        startTimer();
        console.log("UnPaused");
        console.log(timeToCountdown);
        timeToCountdown += new Date().getTime() - timestampWhenPaused;
    }
    changeStatusOfTimer();
}

function changeStatusOfTimer() {
    running = !running;
    $('#run-timer').text(running ? 'Pause' : 'Resume');
}

function startTimer() {
    interval = setInterval(function () {
        var timeLeftToCountdown = timeToCountdown - new Date().getTime();
        hours = Math.floor(timeLeftToCountdown / 3600000);
        minutes = Math.floor(timeLeftToCountdown / 60000) % 60;
        seconds = Math.floor(timeLeftToCountdown / 1000) % 60;

        console.log(timeLeftToCountdown);
        displayTimeToCountdown(getTimeSet());

        if (timeLeftToCountdown <= 0) {
            console.log("Finished countdown");
            displayTimeToCountdown('00:00:00');
            stopTimer();
            soundEffect.play();
        }
    }, 100);
}

function stopTimer() {
    clearInterval(interval);
    $('#run-timer').text('Start');
    set = false;
    running = false;
    finished = true;
}

function reset() {
    function triggeredClearingInputs() {
        return resetClicksCount % 2 === 0;
    }

    if (!running) {
        stopTimer();
        $('#seconds').val(0);
        $('#minutes').val(0);
        $('#timer').text('00:00:00');
        resetClicksCount++;
        if (triggeredClearingInputs()) {
            $('#secondsInput').val('');
            $('#minutesInput').val('');
        }
    }
}

function setListeners() {
    $(document).keypress(function (key) {
        if (key.which === 32) {
            runTimer();
        }
    });

    $('#secondsInput').keypress(function (key) {
        if (key.which === 13) {
            setTimer();
        }
    });

    $('#minutesInput').keypress(function (key) {
        if (key.which === 13) {
            setTimer();
        }
    });

    $('#run-timer').on('click', function () {
        runTimer();
    });

    $('#reset').on('click', function () {
        reset();
    });

    $('#set-time').on('click', function () {
        setTimer();
    });

    $('#3-minutes').on('click', function () {
        setCountdownMinutes(3);
    });

    $('#5-minutes').on('click', function () {
        setCountdownMinutes(5);
    });

    $('#10-minutes').on('click', function () {
        setCountdownMinutes(10);
    });

    $('#30-minutes').on('click', function () {
        setCountdownMinutes(30);
    })
}
