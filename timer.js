let soundEffect = new Audio('sound/phone_sound_effect.mp3');

let running = false;
let set = false;
let finished = true;

let interval;

let timeToCountdownInMillis = 0;
let timeToCountdown;
let timestampWhenPaused;

let resetClicksCount = 0;

$(document).ready(function () {
    setListeners();
});

function displayTimeToCountdown(timeToDisplay) {
    $('#timer').text(timeToDisplay);
}

function getSeconds() {
    return Math.floor(timeToCountdownInMillis / 1000) % 60;
}

function getMinutes() {
    return Math.floor(timeToCountdownInMillis / 1000 / 60) % 60;
}

function getHours() {
    return Math.floor(timeToCountdownInMillis / 1000 / 60 / 60);
}

function addTimeToCountdown(timeInMillis) {
    enableButton($('#runTimer'));
    if (timeToCountdownInMillis === 0) {
        timeToCountdownInMillis = timeInMillis;
    }
    else {
        timeToCountdownInMillis += timeInMillis;
    }

    displayTimeToCountdown(getTimeSet());
    set = true;
}

function setTimeToCountdown(timeInMillis) {
    enableButton($('#runTimer'));
    timeToCountdownInMillis = timeInMillis;

    displayTimeToCountdown(getTimeSet());
    set = true;
}

function setTimer() {
    if (finished) {
        let secondsInput = $('#secondsInput');
        let minutesInput = $('#minutesInput');

        let secondsValue = parseInt(secondsInput.val(), 10);
        let minutesValue = parseInt(minutesInput.val(), 10);

        if (isNaN(secondsValue)) {
            secondsValue = 0;
        }
        if (isNaN(minutesValue)) {
            minutesValue = 0;
        }

        let labelForSeconds = $('#labelForSeconds');
        let labelForMinutes = $('#labelForMinutes');

        secondsInput.removeClass('is-invalid');
        minutesInput.removeClass('is-invalid');
        labelForSeconds.removeClass('text-danger');
        labelForMinutes.removeClass('text-danger');

        if (secondsValue === 0 && minutesValue === 0) {
            labelForSeconds.addClass('text-danger');
            labelForMinutes.addClass('text-danger');
            secondsInput.addClass('is-invalid');
            minutesInput.addClass('is-invalid');
            return;
        }
        if (secondsValue < 0 || minutesValue < 0) {
            secondsInput.addClass(secondsValue < 0 ? 'is-invalid' : '');
            minutesInput.addClass(minutesValue < 0 ? 'is-invalid' : '');

            labelForSeconds.addClass(secondsValue < 0 ? 'text-danger' : '');
            labelForMinutes.addClass(minutesValue < 0 ? 'text-danger' : '');
        }
        else {
            let timeInMillis = (minutesValue * 60 + secondsValue) * 1000;
            setTimeToCountdown(timeInMillis);
        }
    }
}

function setCountdownMinutes(minutes) {
    if (finished) {
        let timeInMillis = (minutes * 60) * 1000;

        addTimeToCountdown(timeInMillis);
        $('#minutesInput').val(Math.floor(timeToCountdownInMillis / 1000 / 60));
    }
}

function getTimeSet() {
    let hours = getHours();
    let minutes = getMinutes();
    let seconds = getSeconds();
    return (hours < 10 ? "0" : "") + hours
        + (minutes < 10 ? ":0" : ":") + minutes
        + (seconds < 10 ? ":0" : ":") + seconds;
}

function runTimer() {
    if (finished) {
        if (set) {
            timeToCountdown = new Date().getTime() + timeToCountdownInMillis;
            $('#runTimer').text('Pause');
            startTimer();
            finished = false;
            running = true;
            disableButton($('#reset'));
            disableButton($('#setTime'));
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
    $('#runTimer').text(running ? 'Pause' : 'Resume');
}

function startTimer() {
    interval = setInterval(function () {
        timeToCountdownInMillis = timeToCountdown - new Date().getTime();

        displayTimeToCountdown(getTimeSet());

        if (timeToCountdownInMillis <= 0) {
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
    let runTimerButton = $('#runTimer');
    runTimerButton.text('Start');
    disableButton(runTimerButton);
    enableButton($('#reset'));
    enableButton($('#setTime'));
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
        enableButton($('#setTime'));
        disableButton($('#runTimer'));
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
