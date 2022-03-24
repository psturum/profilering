var check = 0;
var data_scatter = [];
var isRecording = false;
window.onload = async function() {

    webgazer.params.showVideoPreview = true;
    //start the webgazer tracker
    await webgazer.setRegression('ridge') /* currently must set regression and tracker */
        //.setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
            // console.log(data);
            if(data != null){
                document.getElementById("pred-x").innerText = "Prediction-X: " + parseInt(data.x);
                document.getElementById("pred-y").innerText = "Prediction-Y: " + parseInt(data.y);
            }
            if(isRecording){
                data_scatter.push([data.x, data.y])
            }
            
             /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
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
        canvas.style.top = '0px';
    };
    setup();
    var seconds = 00; 
  var tens = 00; 
  var appendTens = document.getElementById("tens")
  var appendSeconds = document.getElementById("seconds")
  var buttonStart = document.getElementById('button-start');
  var buttonStop = document.getElementById('button-stop');
  var buttonReset = document.getElementById('button-reset');
  var buttonGraph = document.getElementById('button-graph');
  var buttonSubmit = document.getElementById('button-submit');
  var Interval ;

  buttonStart.onclick = function() {
    document.getElementById("button-start").disabled = true;
    document.getElementById("button-stop").disabled = false;
    isRecording = true;
    clearInterval(Interval);
    Interval = setInterval(startTimer, 10);
  }
  
  buttonStop.onclick = function() {
    document.getElementById("group1").style.display = 'none';
    document.getElementById("group2").style.display = 'inline-flex';
    document.getElementById("button-start").disabled = false;
    document.getElementById("button-stop").disabled = true;
    isRecording = false;
    clearInterval(Interval);
  }

  buttonReset.onclick = function() {
    clearInterval(Interval);
    data_scatter = [];
    tens = "00";
    seconds = "00";
    appendTens.innerHTML = tens;
    appendSeconds.innerHTML = seconds;
    isRecording = false;
    document.getElementById("group1").style.display = 'inline-flex';
    document.getElementById("group2").style.display = 'none';
    drawChart();
 }

  buttonGraph.onclick = function() {
    drawChart();
  }

  buttonSubmit.onclick = function() {
  }

  
   
  
  function startTimer () {
    tens++; 
    
    if(tens <= 9){
      appendTens.innerHTML = "0" + tens;
    }
    
    if (tens > 9){
      appendTens.innerHTML = tens;
      
    } 
    
    if (tens > 99) {
      console.log("seconds");
      seconds++;
      appendSeconds.innerHTML = "0" + seconds;
      tens = 0;
      appendTens.innerHTML = "0" + 0;
    }
    
    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }
  
  }
    

};



// Set to true if you want to save the data even if you reload the page.
window.saveDataAcrossSessions = false;

window.onbeforeunload = function() {
    webgazer.end();
}

/**
 * Restart the calibration process by clearing the local storage and reseting the calibration point
 */
function Restart(){
    // document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
    webgazer.clearData();
    ClearCalibration();
    PopUpInstruction();
}
google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'x');
    data.addColumn('number', 'y');
    data.addRows(data_scatter);

    var options = {
        hAxis: {title: 'Prediction-X', minValue: 0, maxValue: 15},
        vAxis: {title: 'Prediction-Y', minValue: 0, maxValue: 15},
        legend: 'none'
    };

    var chart = new google.visualization.ScatterChart(document.getElementById('chart'));
    chart.draw(data, options);
}
$(window).resize(function(){
    console.log(data_scatter)
    drawChart();
});


