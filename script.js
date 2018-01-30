/*
x. Add pom finished sound, min to rest end and rest end tones
x. Fix time display: keep : centered while timer ticking down
x. Straighten logo and be sure each color is exact same shape/size
x. Fade blue logo to black
x. blue looks to be not completely covering at end of phase
x. Pomodoro, Work Block and Duration Controls resets
x. Repeat work block checkmark
x. protect against page refresh
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
            console.log("pausing timer");
            timer.pause();
        } else {
            console.log("resuming timer");
            timer.resume();
        }
    } else {
        console.log("timer started");
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

    function initPhases() {
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
        if (phases.length == 0) return; // initPhases if repeat block checked
        console.log("getting phase");
        let curPhase = phases[0];
        $("#timer").css("color", curPhase.textColor);
        tickInterval = setInterval(tick, 1000, curPhase);
    }

    function tick(phase) {
        phase.secondsRemaining = phase.secondsRemaining - 1;
        console.log("remaining: " + phase.secondsRemaining);
        $("#timer").text(new Date(1000 * phase.secondsRemaining).toISOString().substr(14, 5));
        let newHeight = eval($(phase.logoName).height() + phase.logoAction + phase.logoTick);
        $(phase.logoName).height(newHeight);

        if (phase.secondsRemaining == 0) {
            clearInterval(tickInterval);
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
        phases = null;
        //should I just nullify timer rather than the vars?
        $("#time").css("color", "black");
        updateTimeDisplay();
        $(".duration").attr("disabled", false);
    }
}

function updateTimeDisplay() {
    let val = $("#pom-dur").val();
    $("#timer").text(val > 9 ? val + ":00" : "0" + val + ":00");
}