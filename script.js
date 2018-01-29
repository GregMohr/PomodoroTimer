/*
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
$(document).ready(function() {
    logoHeight = $("#logo-black").height();
    timer = new PomodoroTimer();
    $("#timer").click(startStop);
    $("#pom-dur").on('keyup input change', updateTimeDisplay);
});

function startStop() {
    if (timer.isStarted) {
        if (!timer.isPaused) {
            console.log("pausing");
            timer.pause();
        } else {
            console.log("resuming");
            timer.resume();
        }
    } else {
        $(".duration").attr("disabled", true);
        timer.isStarted = true;
        timer.initPhases();
    }
}

function TimerPhase(chk, secondsRemaining, logo, action, textColor, endPhase) {
    this.chk = chk;
    this.secondsRemaining = secondsRemaining;
    this.logoName = logo;
    this.logoTick = logoHeight / secondsRemaining;
    this.logoAction = action;
    this.textColor = textColor;
    this.endPhase = endPhase;
}

function PomodoroTimer() {
    this.initPhases = initPhases;
    this.reset = reset;
    this.pause = pause;
    this.resume = resume;
    this.isPaused = false;
    this.isStarted = false;

    var tickInterval;
    var phases = [];

    function initPhases() { //should this be a static TimerPhase function that returns the phases object?
        console.log("initPhases");
        var newPhase;
        let chk = 1;
        for (let i = 0; i < 8; i++) {
            if (i % 2 == 0) {
                newPhase = new TimerPhase(chk, $("#pom-dur").val() * 60, "#logo-black", " - ", "#00AA0E", endPom);
                chk++;
            } else {
                let remaining = i != 7 ? $("#sht-rest-dur").val() * 60 : $("#lng-rest-dur").val() * 60;
                newPhase = new TimerPhase(chk - 1, remaining, "#logo-blue", " + ", "#0000FF", endRest);
            }
            phases.push(newPhase);
        }
        console.dir(phases);
        getPhase();
    }

    function endPom() {
        console.log("ending Pomodoro");
        let chkPhase = phases.shift();
        $("#chk-" + chkPhase.chk).attr("checked", true);
        getPhase();
    }

    function endRest() {
        console.log("ending rest");
        $("#logo-black").height("358px");
        $("#logo-green").height("358px");
        $("#logo-blue").height("0"); //can I do something like change the opacity of blue and black in opp so it looks like I'm fading from blue to black?
        phases.shift();
        getPhase();
    }

    function getPhase() {
        if (phases.length == 0) return; // initPhases
        let curPhase = phases[0];
        $("#timer").css("color", curPhase.textColor);
        tickInterval = setInterval(tick, 1000, curPhase);
    }

    function tick(phase) {
        phase.secondsRemaining = phase.secondsRemaining - 1;
        $("#timer").text(new Date(1000 * phase.secondsRemaining).toISOString().substr(14, 5));
        let newHeight = eval($(phase.logoName).height() + phase.logoAction + phase.logoTick);
        $(phase.logoName).height(newHeight);

        if (phase.secondsRemaining == 0) {
            clearInterval(tickInterval);
            console.log("endPhase");
            phase.endPhase();
        }
    }

    function pause() {
        clearInterval(tickInterval);
        this.isPaused = true;
    }

    function resume() {
        this.isPaused = false;
        getPhase();
    }

    function reset() {
        clearInterval(tickInterval);
        //should I just nullify timer rather than the vars?
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