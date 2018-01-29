/*
Decide on the task to be done.
Set durations for the Pomodoro, Short and Long rests. Traditionally these are, in minutes,  25, 3-5, and 15-30 respectiviely)
Work on the task.
End work when the timer rings and a checkmark will be placed in the appropriate repetition box
After four pomodoros, take a longer break (15–30 minutes), reset your checkmark count to zero, then go to step 1.

x. Add logoTick
x. Add pause
x. Add time display change opposite to logo
x. Add duration controls reset, unlocks dur controls//may be able to combo the resets to 1 method by sending a callback of thw rest of the functionality. unlock dur controls is part of both
x. Add Work Block reset, unlocks dur controls
x. Fix time display: keep : centered while timer ticking down
x. Add guide lines for phases
x. Add pom finished sound, min to rest end and rest end tones

should I protect against page refresh??
*/
var timerRunning = false,
    timer,
    started = false;

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
        $(".duration").attr("disabled", true);
        timer = new PomodoroTimer();
        // $("#reset").click(timer.reset);
        timer.runPhase();
        started = true;
    } else {
        //clearInterval(timer);
    }
}

function PomodoroTimer() {
    this.runPhase = runPhase;
    this.reset = reset;

    var inPomodoro,
        timeRemaining,
        rep,
        pomSeconds,
        shortSeconds,
        longSeconds,
        logoTick,
        tickInterval,
        logoHeight = $("#logo-black").height(),
        logoPomTick,
        logoShortTick,
        logoLongTick;

    function runPhase() {
        if (!rep) {
            rep = 1;
            inPomodoro = true;
            pomSeconds = $("#pom-dur").val() * 60;
            shortSeconds = $("#sht-rest-dur").val() * 60;
            longSeconds = $("#lng-rest-dur").val() * 60;
            logoPomTick = logoHeight / pomSeconds;
            logoShortTick = logoHeight / shortSeconds;
            logoLongTick = logoHeight / longSeconds;
        }

        if (rep > 4) {
            clearInterval(tickInterval);
            return;
        }

        if (inPomodoro) {
            timeRemaining = pomSeconds;
            console.log("Pomodoro time set: " + timeRemaining);
        } else if (rep < 4) {
            timeRemaining = shortSeconds;
            console.log("Short Rest time set: " + timeRemaining);
        } else {
            timeRemaining = longSeconds;
            console.log("Long Rest time set: " + timeRemaining);
        }

        console.log("Running: rep " + rep + " " + (inPomodoro ? "Pomodoro" : "Rest"));
        console.log("Time Remaining: " + timeRemaining);
        tickInterval = setInterval(tick, 1000, runPhase);
    }

    function tick(callback) {
        timeRemaining--;
        $("#timer").text(new Date(1000 * timeRemaining).toISOString().substr(14, 5));
        if (inPomodoro) {
            //inc green logo
            // console.log("height: " + $("#logo-green").height() + " logoPomTick: " + logoPomTick);
            $("#logo-black").height($("#logo-black").height() - logoPomTick);
        } else {
            //dec blue logo
            if (rep < 4) {
                $("#logo-blue").height($("#logo-blue").height() + logoShortTick);
            } else {
                $("#logo-blue").height($("#logo-blue").height() + logoLongTick);
            }
        }

        if (timeRemaining == 0) {
            clearInterval(tickInterval);
            if (!inPomodoro) {
                rep++;
                $("#logo-black").height("358px");
                $("#logo-green").height("358px");
                $("#logo-blue").height("0");
            } else {
                $("#chk-" + rep).attr("checked", true);

                //$("#logo-blue").height("358px");
                //$("#logo-green").height("0");
            }
            inPomodoro = !inPomodoro;
            callback();
        }
    }

    function reset() {
        clearInterval(tickInterval);
        //should I just nullify timer rather than the vars?
        rep = null;
        inPomodoro = null;
        timeRemaining = null;
    }
}

function updateTimeDisplay() {
    let val = $("#pom-dur").val();
    $("#timer").text(val > 9 ? val + ":00" : "0" + val + ":00");
}

/* function reset() {
    //activate duration controls.
    //should this just reset the timer or the duration values too. Maybe two different resets
    
    //set both active logos to width: 0
    //clear check marks
} */