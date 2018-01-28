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
    $("#timer").click(startStop); //first time this happens, change functionality to timer.pause?
    $("#pom-dur").on('keyup input change', updateTimeDisplay);
});

function PomodoroTimer(pomDuration, shortDuration, longDuration) {
    this.pomSeconds = pomDuration * 60;
    this.shortSeconds = shortDuration * 60;
    this.longSeconds = longDuration * 60;
    this.inPomodoro = true;
    this.timeRemaining = pomDuration;
    this.rep = 1;
    this.runWorkBlock = runWorkBlock();

    function runWorkBlock() {
        while (rep < 5) {
            if (rep < 4) {
                if (inPomodoro) {
                    //pomodoro
                    console.log("running pom");
                    //logoSecond
                    //setInterval(tick, 1000);
                    //inPomodoro = false;
                    //timeRemaining = shortSeconds;
                }
                //short rest
                console.log("running short rest");
                //logoSecond
                //setInterval(tick, 1000);
                //inPomodoro = true;
                //timeRemaining = pomDuration;
            } else {
                if (inPomodoro) {
                    //pomodoro
                    console.log("running pom");
                    //logoSecond
                    //setInterval(tick, 1000);
                    //inPomodoro = false;
                    //timeRemaining = longSeconds;
                }
                //long rest
                console.log("running long rest");
                //logoSecond
                //setInterval(tick, 1000);
                //inPomodoro = true;
                //timeRemaining = pomDuration;
                //-------
                //reset check marks? How do I safely loop the block? an outer while with set executions?
            }
            rep++;
        }
        //reset reps and restart workblock??
    }

    function tick() {
        //add seconds(how many times to execute) and logo pixel count(how many pixels to inc/dec per interval)
        //deduct 1 second from timer display
        timeRemaining = 0;
        //add
    }
}

function startStop() {
    //timerRunning = !timerRunning;
    if (!started) {
        //start (disable duration controls. reset re-enables) or resume??
        timer = new PomodoroTimer($("#pom-dur").val(), $("#sht-rest-dur").val(), $("#lng-rest-dur").val());
        started = true;
    } else {
        //clearInterval(timer);
    }
}

function updateTimeDisplay() {
    $("#timer").text($("#pom-dur").val() + ":00");
}

function reset() {
    //activate duration controls.
    //should this just reset the timer or the duration values too. Maybe two different resets
    clearInterval(inter);
    //set both active logos to width: 0
    //clear check marks
}