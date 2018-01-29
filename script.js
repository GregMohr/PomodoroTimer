/*
Decide on the task to be done.
Set durations for the Pomodoro, Short and Long rests. Traditionally these are, in minutes,  25, 3-5, and 15-30 respectiviely)
Work on the task.
End work when the timer rings and a checkmark will be placed in the appropriate repetition box
After four pomodoros, take a longer break (15–30 minutes), reset your checkmark count to zero, then go to step 1.

x. Add pause
x. Add time display change opposite to logo
x. Add duration controls reset, unlocks dur controls//may be able to combo the resets to 1 method by sending a callback of thw rest of the functionality. unlock dur controls is part of both
x. Add Work Block reset, unlocks dur controls
x. Fix time display: keep : centered while timer ticking down
x. Add guide lines for phases
x. Add pom finished sound, min to rest end and rest end tones
x. Straighten logo and be sure each color is exact same shape/size
x. Fade blue logo to black
x. Create a queue of phase objects that track phase specifics. Then a pause would just update the front phase's time remaining. Remove each object once expired
x. only allow numbers within range, even when typed, in durations

should I protect against page refresh??
*/
var timerRunning = false,
    timer,
    logoHeight = $("#logo-black").height(),
    started = false;

$(document).ready(function() {

    $("#timer").click(startStop);
    $("#pom-dur").on('keyup input change', updateTimeDisplay);
    //create timer here or leave it global. Should allow for both reset to assigned in here

});

function startStop() {
    //timerRunning = !timerRunning;
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

function TimerPhase(chk, secondsRemaining, logo, action, endPhase) {
    //secondsRemaining, logo, logoTick, logoAction, callback for expiration actions and starting next phase
    this.chk = chk;
    this.secondsRemaining = secondsRemaining;
    this.endPhase = endPhase;
    var logoName = logo,
        logoTickA = logoHeight / secondsRemaining,
        logoAction = action;
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
        logoPomTick,
        logoShortTick,
        logoLongTick;

    var phases = [];

    function initPhases() {
        //timeRemaining, logo, logoTick, logoAction, callback for expiration actions and starting next phase
        for (let i = 0; i < 8; i++) {
            if (i % 2 == 0) {
                let newPhase = new TimerPhase(i + 1, $("#pom-dur").val() * 60, "#logo-black", "dec", endPom);
            } else {
                let remaining = i != 7 ? $("#sht-rest-dur").val() * 60 : $("#lng-rest-dur").val() * 60;
                let newPhase = new TimerPhase(i + 1, remaining, "#logo-blue", "inc", endRest);
            }
            phases.push(newPhase);
        }
    }

    function getPhase() {
        let curPhase = phases[0];
        tickInterval = setInterval(tick, 1000, curPhase);
    }

    function endPom() {
        let chkPhase = phases.shift();
        $("#chk-" + chkPhase.chk).attr("checked", true);
        getPhase();
    }

    function endRest() {
        $("#logo-black").height("358px");
        $("#logo-green").height("358px");
        $("#logo-blue").height("0"); //can I do something like change the opacity of blue and black in opp so it looks like I'm fading from blue to black?
        phases.shift();
        getPhase();
    }

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
            //reset
            return;
        }

        if (inPomodoro) {
            timeRemaining = pomSeconds;
            $("#timer").css("color", "#00AA0E");
            // console.log($("#timer").css("color"));
        } else {
            $("#timer").css("color", "#0000FF");
            // console.log($("#timer").css("color"));

            if (rep < 4) {
                timeRemaining = shortSeconds;
            } else {
                timeRemaining = longSeconds;
            }
        }

        console.log("Running: rep " + rep + " " + (inPomodoro ? "Pomodoro" : "Rest"));
        console.log("Time Remaining: " + timeRemaining);
        tickInterval = setInterval(tick, 1000);
        // tickInterval = setInterval(tick, 1000, runPhase);
    }

    function tick(phase) {
        phase.secondsRemaining = phase.secondsRemaining--;
        $("#timer").text(new Date(1000 * phase.secondsRemaining).toISOString().substr(14, 5));
        let newHeight = eval($(phase.logo).height() + phase.logoAction + "60");
        console.log("newHeight: " + newHeight);
        $(phase.logo).height(newHeight);

        if (secondsRemaining == 0) {
            phase.endPhase();
        }
    }
    /*     function tick() {
            //pass phase into tick and reference the properties directly. It removes the need for globals
            //is a callback necessary here? when would this callback (runPhase) be called if I referenced directly at the same point in the method
            timeRemaining--;
            $("#timer").text(new Date(1000 * timeRemaining).toISOString().substr(14, 5));
            console.log("timeRemaining: " + timeRemaining);
            if (inPomodoro) {
                $("#logo-black").height($("#logo-black").height() - logoPomTick);
            } else {
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
                    $("#logo-blue").height("0"); //can I do something like change the opacity of blue and black in opp so it looks like I'm fading from blue to black?
                } else {
                    $("#chk-" + rep).attr("checked", true);
                }
                inPomodoro = !inPomodoro;
                runPhase();
            }
        } */

    function reset() {
        clearInterval(tickInterval);
        //should I just nullify timer rather than the vars?
        rep = null;
        inPomodoro = null;
        timeRemaining = null;
        $("#time").css("color", "black");

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