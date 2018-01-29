/*
Decide on the task to be done.
Set durations for the Pomodoro, Short and Long rests. Traditionally these are, in minutes,  25, 3-5, and 15-30 respectiviely)
Work on the task.
End work when the timer rings and a checkmark will be placed in the appropriate repetition box
After four pomodoros, take a longer break (15–30 minutes), reset your checkmark count to zero, then go to step 1.

x. Add logoTick
x. Add pause
x. Add time display change opposite to logo
x. Add duration controls reset
x. Add Work Block reset
x. Fix time display: keep : centered while timer ticking down
x. Add guide lines for phases

user sets durations
user starts timer
duration controls are locked
timer is created with durations set
runPhase is called
-phase is initialized and run passing needed arguments to tick, including itself as a callback after timeRem hits 0

A
pomodoro starts
-timer dec
-green logo inc
pomodoro ends
place checkmark
short rest starts
-green logo height: 0, blue logo height: 100%
-timer dec
-blue logo dec
(repeat A 2x more, then go B)

B
pomodoro starts
-timer dec
-green logo inc
pomodoro ends
place checkmark
long rest starts
-timer dec
-blue logo inc/dec
reset checks
return to A

*/
var timerRunning = false,
    timer,
    started = false;
//should I protect against page refresh??

$(document).ready(function() {

    $("#timer").click(startStop);
    $("#pom-dur").on('keyup input change', updateTimeDisplay);
    //create timer here or leave it global. Should allow for both reset to assigned in here

});

function startStop() {
    //timerRunning = !timerRunning;
    console.log("timer display clicked");
    if (!started) {
        console.log("starting timer");
        //start (disable duration controls. reset re-enables) or resume??
        timer = new PomodoroTimer();
        // $("#reset").click(timer.reset);
        timer.runPhase();
        started = true;
    } else {
        //clearInterval(timer);
    }
}

function PomodoroTimer() {
    var inPomodoro,
        timeRemaining,
        rep,
        logoTick,
        tickInterval;

    this.runPhase = runPhase;
    this.reset = reset;

    function runPhase() {
        if (!rep) {
            rep = 1;
            inPomodoro = true;
        }

        if (rep > 4) {
            clearInterval(tickInterval);
            return;
        }

        if (inPomodoro) {
            timeRemaining = $("#pom-dur").val() * 60;
            logoTick = 3;
            console.log("Pomodoro time set: " + timeRemaining);
        } else if (rep < 4) {
            timeRemaining = $("#sht-rest-dur").val() * 60;
            console.log("Short Rest time set: " + timeRemaining);
        } else {
            timeRemaining = $("#lng-rest-dur").val() * 60;
            console.log("Long Rest time set: " + timeRemaining);
        }

        console.log("Running: rep " + rep + " " + (inPomodoro ? "Pomodoro" : "Rest"));
        console.log("Time Remaining: " + timeRemaining);
        tickInterval = setInterval(tick, 1000, runPhase);
    }

    function tick(callback) {
        //$("#timer").text(new Date(1000 * timeRemaining).toISOString().substr(14, 5));

        if (timeRemaining > 0) {
            //$("#timer").text(new Date(1000 * timeRemaining).toISOString().substr(14, 5));
            console.log(timeRemaining);
            timeRemaining--;
        } else {
            //$("#timer").text(new Date(1000 * timeRemaining).toISOString().substr(14, 5));
            clearInterval(tickInterval);
            if (!inPomodoro) {
                rep++;
            } else {
                $("#chk-" + rep).attr("checked", true);
            }
            inPomodoro = !inPomodoro;
            callback();
        }
        $("#timer").text(new Date(1000 * timeRemaining).toISOString().substr(14, 5));
    }

    function reset() {
        clearInterval(tickInterval);
        //reset vars
        rep = null;
        inPomodoro = null;
        timeRemaining = null;
    }
}

function updateTimeDisplay() {
    let val = $("#pom-dur").val();
    $("#timer").text(val > 9 ? val + ":00" : "0" + val + ":00");
    // $("#timer").text($("#pom-dur").val() + ":00");
}

/* function reset() {
    //activate duration controls.
    //should this just reset the timer or the duration values too. Maybe two different resets
    
    //set both active logos to width: 0
    //clear check marks
} */