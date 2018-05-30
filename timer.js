let soundEffect = new Audio('sound/phone_sound_effect.mp3');

let running = false;
let set = false;
let finished = true;

let interval;

let seconds, minutes, hours;

let timeToCountdownInMillis;
let timeToCountdown;
let timestampWhenPaused;

let resetClicksCount = 0;

$(document).ready(function () {
    setListeners();
});

function displayTimeToCountdown(timeToDisplay) {
    $('#timer').text(timeToDisplay);
}

function setTimeToCountdown(timeInMillis) {
    enableButton($('#run-timer'));
    timeToCountdownInMillis = timeInMillis;

    seconds = Math.floor(timeToCountdownInMillis / 1000) % 60;
    minutes = Math.floor(timeToCountdownInMillis / 1000 / 60) % 60;
    hours = Math.floor(timeToCountdownInMillis / 1000 / 60 / 60);
    displayTimeToCountdown(getTimeSet());
    set = true;
}

function setTimer() {
    if (finished) {
        let secondsInput = $('#secondsInput');
        let secondsValue = parseInt(secondsInput.val(), 10);

        let minutesInput = $('#minutesInput');
        let minutesValue = parseInt(minutesInput.val(), 10);

        if (isNaN(secondsValue)) {
            secondsValue = 0;
        }
        if (isNaN(minutesValue)) {
            minutesValue = 0;
        }
        if (secondsValue < 0) {
            secondsInput.addClass('input-error');
        }
        else if (minutesValue < 0) {
            minutesInput.addClass('input-error');
        }
        else if (secondsValue === 0 && minutesValue === 0) {
            secondsInput.addClass('input-error');
            minutesInput.addClass('input-error');
        }
        else {
            secondsInput.removeClass('input-error');
            minutesInput.removeClass('input-error');
            let timeInMillis = (minutesValue * 60 + secondsValue) * 1000;
            setTimeToCountdown(timeInMillis);
        }
    }
}

function setCountdownMinutes(minutes) {
    if (finished) {
        let timeInMillis = (minutes * 60) * 1000;
        if (timeInMillis === timeToCountdownInMillis) {
            runTimer();
        }
        else {
            setTimeToCountdown(timeInMillis);
            $('#minutesInput').val(minutes);
            $('#secondsInput').val(0);
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
            disableButton($('#reset'));
            disableButton($('#set-time'));
        }
    }
    else {
        toggleTimer();
    }
}

function toggleTimer() {
    if (running) {
        clearInterval(interval);
        timestampWhenPaused = new Date().getTime();
        enableButton($('#reset'));
    } else {
        startTimer();
        timeToCountdown += new Date().getTime() - timestampWhenPaused;
        disableButton($('#reset'));
    }
    changeStatusOfTimer();
}

function changeStatusOfTimer() {
    running = !running;
    $('#run-timer').text(running ? 'Pause' : 'Resume');
}

function startTimer() {
    interval = setInterval(function () {
        let timeLeftToCountdown = timeToCountdown - new Date().getTime();
        hours = Math.floor(timeLeftToCountdown / 3600000);
        minutes = Math.floor(timeLeftToCountdown / 60000) % 60;
        seconds = Math.floor(timeLeftToCountdown / 1000) % 60;

        displayTimeToCountdown(getTimeSet());

        if (timeLeftToCountdown <= 0) {
            displayTimeToCountdown('00:00:00');
            stopTimer();
            soundEffect.play();
        }
    }, 100);
}

function stopTimer() {
    clearInterval(interval);
    set = false;
    running = false;
    finished = true;
    timeToCountdownInMillis = 0;
    let runTimerButton = $('#run-timer');
    runTimerButton.text('Start');
    disableButton(runTimerButton);
    enableButton($('#reset'));
    enableButton($('#set-time'));
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
        enableButton($('#set-time'));
        disableButton($('#run-timer'));
        resetClicksCount++;
        if (triggeredClearingInputs()) {
            $('#secondsInput').val('');
            $('#minutesInput').val('');
            resetClicksCount = 0;
        }
    }
}

function disableButton(button) {
    button.addClass('disabled');
}

function enableButton(button) {
    button.removeClass('disabled');
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
}
