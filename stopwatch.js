let milliseconds = 0;
let seconds = 0;
let minutes = 0;

let interval;
let running = false;

let startingTime;
let pausedTime = 0;

let numberOfLap = 0;

function toggleStopwatch() {
    if (running) {
        pausedTime = Date.now() - startingTime;
        running = false;
        clearInterval(interval);
        $('#startPause').text('Resume');
        $('#append-lap').addClass('disabled');
    }
    else {
        running = true;
        startingTime = Date.now() - pausedTime;
        runStopwatch();
        $('#startPause').text('Pause');
        $('#append-lap').removeClass('disabled');
        $('#reset').removeClass('disabled');
    }
}

function addAdditionalZeroIfNeeded(timeUnit) {
    return ((timeUnit < 10) ? '0' + timeUnit : timeUnit);
}

function runStopwatch() {
    interval = setInterval(function () {
        let timePassed = Date.now() - startingTime;
        milliseconds = timePassed % 1000;
        seconds = Math.floor(timePassed / 1000) % 60;
        minutes = Math.floor(timePassed / 1000 / 60);
        $('#timer').text(
            addAdditionalZeroIfNeeded(minutes)
            + ':' + addAdditionalZeroIfNeeded(seconds)
            + ':' + addAdditionalZeroIfNeeded(milliseconds));
    }, 10);
    $('#append-lap').removeClass('disabled');
}

function resetStopwatch() {
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    clearInterval(interval);
    running = false;
    $('#startPause').text('Start');
    $('#timer').text('00:00:00');
    $('#append-lap').addClass('disabled');
    $('#reset').addClass('disabled');
}

function appendLap() {
    numberOfLap++;
    let lap = 'Number of lap: ' + numberOfLap + ' time: ' + minutes + ':' + seconds + ':0' + milliseconds;
    $('#outputLaps').append(lap).append('<br>');
}

function resetLaps() {
    numberOfLap = 0;
    $('#outputLaps').text('');
}

$('#startPause').on('click', function () {
    toggleStopwatch();
});

$('#reset').on('click', function () {
    resetStopwatch();
});

$('#append-lap').on('click', function () {
    if (running) {
        appendLap();
    }
});

$('#resetLaps').on('click', function () {
    resetLaps();
});
