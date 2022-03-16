window.onload = async function() {

    webgazer.params.showVideoPreview = true;
    //start the webgazer tracker
    await webgazer.setRegression('ridge') /* currently must set regression and tracker */
        //.setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
          //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
          //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
        })
        .saveDataAcrossSessions(false)
        .begin();
        webgazer.showVideoPreview(true) /* shows all video previews */
            .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
            .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

    //Set up the webgazer video feedback.
    var setup = function() {

        //Set up the main canvas. The main canvas is used to calibrate the webgazer.
        var canvas = document.getElementById("plotting_canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
    };
    setup();

};

var gazes = [];
var frame = 0;
var isRecording = false;
var up = 0;
var screen = 0;
var down = 0;

function start(){
  isRecording = true;
  recordGaze();
  gazes = [];
  frame = 0;
}

// start recording
function recordGaze() {
    webgazer
      .setGazeListener(function(data, elapsedTime) {
        if (isRecording) {
          if (data == null) {
            return;
          }
  
          var timestamp = Date.now();
          var xprediction = data.x;
          var yprediction = data.y;
  
          gazes.push([timestamp, frame, xprediction, yprediction]);
        //   console.log(gazes);
          frame += 1;
          if (yprediction > 1000){
            down += 1;
          }
          if (yprediction > 100 && yprediction < 1000){
            screen += 1;
          }
          if (yprediction < 100){
            up += 1;
          }
        }
      })
  }

// Set to true if you want to save the data even if you reload the page.
window.saveDataAcrossSessions = false;

window.onbeforeunload = function() {
    webgazer.end();
}

/**
 * Restart the calibration process by clearing the local storage and reseting the calibration point
 */
function Restart(){
    document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
    webgazer.clearData();
    isRecording = false;
    ClearCalibration();
    PopUpInstruction();
}

function submit(){
    document.forms['data_form'].elements['size'].value = frame
    document.forms['data_form'].elements['up'].value = up
    document.forms['data_form'].elements['screen'].value = screen
    document.forms['data_form'].elements['down'].value = down
    document.forms['data_form'].submit();
}

function stop(){
    isRecording = false;
}

function summary() {
    console.log(frame)
    // document.getElementById('frames').innerText = frame;
    var points = [];
    gazes.forEach(function(gaze) {
      var currpoint = {};
      currpoint = {
        x: gaze[2],
        y: gaze[3]
      };
      points.push(currpoint);
    });
  
    document.getElementById("chartContainer").innerHTML = '<canvas id="myChart"></canvas>';
    var ctx = document.getElementById("myChart").getContext("2d");
  
    new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Gaze Targets',
          data: points,
          pointBackgroundColor: '#DA608C',
          showLine: false
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom',
            ticks: {
              suggestedMin: 0,
              suggestedMax: parseInt(document.getElementById('plotting_canvas').width, 10)
                // max: 1700,
                // min: -205
            }
          }],
          yAxes: [{
            type: 'linear',
            ticks: {
              suggestedMin: 0,
              suggestedMax: parseInt(document.getElementById('plotting_canvas').height, 10),
              reverse: true
                // max: 1400,
                // min: -270
            }
          }]
        }
      }
    });
  
  };
