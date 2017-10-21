var soundEffect = new Audio('sound/phone_sound_effect.mp3');

var running = false;
var countDownSet = false;
var finished = true;

var interval;

var seconds, minutes, hours;

var timeToCountDownInMillis;
var timeToCountDown;
var timestampWhenPaused;

var resetClicksCount = 0;

$(document).ready(function () {
    setListeners();
});

function displayTime(timeToDisplay) {
    $('#timer').text(timeToDisplay);
}

function displayTimeToCountdown() {
    seconds = Math.floor(timeToCountDownInMillis / 1000) % 60;
    minutes = Math.floor(timeToCountDownInMillis / 1000 / 60) % 60;
    hours = Math.floor(timeToCountDownInMillis / 1000 / 60 / 60);
    displayTime(getTimeSet());
}

function setCountdown() {
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
            timeToCountDownInMillis = (minutesValue * 60 + secondsValue) * 1000;
            console.log(timeToCountDownInMillis);

            displayTimeToCountdown();
            countDownSet = true;
        }
    } else {
        console.log("Timer is running");
    }
}

function setCountdownMinutes(minutes) {
    if (finished) {
        if ((minutes * 60) * 1000 === timeToCountDownInMillis) {
            runTimer();
        }
        else {
            timeToCountDownInMillis = (minutes * 60) * 1000;
            console.log(timeToCountDownInMillis);

            displayTimeToCountdown();
            countDownSet = true;
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
        if (countDownSet) {
            timeToCountDown = new Date().getTime() + timeToCountDownInMillis;
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
        console.log(timeToCountDown);
        timeToCountDown += new Date().getTime() - timestampWhenPaused;
    }
    changeStatusOfTimer();
}

function changeStatusOfTimer() {
    running = !running;
    $('#run-timer').text(running ? 'Pause' : 'Resume');
}

function startTimer() {
    interval = setInterval(function () {
        var timeLeftToCountDown = timeToCountDown - new Date().getTime();
        hours = Math.floor(timeLeftToCountDown / 3600000);
        minutes = Math.floor(timeLeftToCountDown / 60000) % 60;
        seconds = Math.floor(timeLeftToCountDown / 1000) % 60;

        console.log(timeLeftToCountDown);
        displayTime(getTimeSet());

        if (timeLeftToCountDown <= 0) {
            console.log("Finished countdown");
            displayTime('00:00:00');
            stopTimer();
            soundEffect.play();
        }
    }, 100);
}

function stopTimer() {
    clearInterval(interval);
    $('#run-timer').text('Start');
    countDownSet = false;
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
            setCountdownMinutes();
        }
    });

    $('#minutesInput').keypress(function (key) {
        if (key.which === 13) {
            setCountdownMinutes();
        }
    });

    $('#run-timer').on('click', function () {
        runTimer();
    });

    $('#reset').on('click', function () {
        reset();
    });

    $('#set-time').on('click', function () {
        setCountdown();
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
