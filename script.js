/*
Decide on the task to be done.
Set durations for the Pomodoro, Short and Long rests. Traditionally these are, in minutes,  25, 3-5, and 15-30 respectiviely)
Work on the task.
End work when the timer rings and a checkmark will be placed in the appropriate repetition box
After four pomodoros, take a longer break (15–30 minutes), reset your checkmark count to zero, then go to step 1.

user sets durations
user starts timer
duration controls are locked

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
//new Date(1000 * seconds).toISOString().substr(14, 5);to get mm:ss from seconds

$(document).ready(function() {

    $("#timer").click(startStop);
    $("#pom-dur").on('keyup input change', updateTimeDisplay);

});

function startStop() {
    //timerRunning = !timerRunning;
    console.log("timer display clicked");
    if (!started) {
        console.log("starting timer");
        //start (disable duration controls. reset re-enables) or resume??
        timer = new PomodoroTimer($("#pom-dur").val(), $("#sht-rest-dur").val(), $("#lng-rest-dur").val());
        $("#reset").click(timer.reset);
        started = true;
    } else {
        //clearInterval(timer);
    }
}

function PomodoroTimer(pomDuration, shortDuration, longDuration) {
    this.pomSeconds = pomDuration * 60;
    this.shortSeconds = shortDuration * 60;
    this.longSeconds = longDuration * 60;
    console.log("pomSeconds: " + this.pomSeconds);
    var inPomodoro = true,
        timeRemaining = this.pomSeconds,
        rep = 1,
        tickInterval;
    console.log("timeRemaining: " + timeRemaining);
    this.runWorkBlock = runWorkBlock(this);

    function runWorkBlock(obj) {
        console.log("starting block");
        while (rep < 5) {
            console.log("running rep: " + rep);
            if (rep < 4) {
                if (inPomodoro) {
                    console.log("running pom");
                    //logoSecond
                    console.log("timeRemaining: " + timeRemaining);
                    tickInterval = setInterval(tick, 1000);
                    inPomodoro = false;
                    timeRemaining = obj.shortSeconds;
                    console.log("timeRemaining (short): " + timeRemaining);
                }
                //short rest
                console.log("running short rest");
                //logoSecond
                // tickInterval = setInterval(tick, 1000);
                // inPomodoro = true;
                // timeRemaining = obj.pomSeconds;
            } else {
                if (inPomodoro) {
                    //pomodoro
                    console.log("running pom");
                    //logoSecond
                    tickInterval = setInterval(tick, 1000);
                    inPomodoro = false;
                    timeRemaining = obj.longSeconds;
                }
                //long rest
                //console.log("running long rest");
                //logoSecond
                // tickInterval = setInterval(tick, 1000);
                // inPomodoro = true;
                // timeRemaining = obj.pomSeconds;
                //-------
                //reset check marks? How do I safely loop the block? an outer while with set executions?
            }
            rep++;
        }
        //reset reps and restart workblock??
    }

    function tick() {
        //add callback parameter to run once timeRemaining hits 0 that checks state and mobes to the next state and starts it accordingly
        console.log("tick: " + timeRemaining);
        if (timeRemaining > 0) {
            console.log(timeRemaining);
            timeRemaining--;
        } else {
            clearInterval(tickInterval);
        }
        //add seconds(how many times to execute) and logo pixel count(how many pixels to inc/dec per interval)
        //deduct 1 second from timer display
    }

    function reset() {
        clearInterval(tickInterval);
    }
}


function updateTimeDisplay() {
    $("#timer").text($("#pom-dur").val() + ":00");
}

/* function reset() {
    //activate duration controls.
    //should this just reset the timer or the duration values too. Maybe two different resets
    
    //set both active logos to width: 0
    //clear check marks
} */