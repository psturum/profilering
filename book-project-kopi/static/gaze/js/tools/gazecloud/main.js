initialize(false, true);

var my_width = 100;
var gui;

function setupDatGui() {
  // gui = new dat.GUI({ autoPlace: false });
  gui = new dat.GUI();

  let guiState = {
    showHeatMap: true,
    uploadBackgroundImage: function() {
      let input = document.getElementById('img-path');
      input.addEventListener('change', function(e) {
        if (e.handled !== true && input.files.length > 0) {
          try {
            var file = input.files.item(0);
            var reader = new FileReader();
            reader.onloadend = function() {
              my_width = 100;
              document.body.style.backgroundSize = my_width.toString() + "vw auto";
              document.body.style.backgroundImage = "url(" + reader.result + ")";
              document.body.style.backgroundRepeat = "no-repeat";
              // document.getElementById('background-image').src = reader.result;
            }
            if (file) {
              reader.readAsDataURL(file);
            }
          } catch (err) {
            document.body.style.background = 'none';
            console.log('error uploading file');
          }
          e.handled = true;
        }
      });
      input.click();
    },
    zoomIn: function() {
      my_width = my_width + 10;
      document.body.style.backgroundSize = my_width.toString() + "vw auto";
    },
    zoomOut: function() {
      my_width = my_width - 10;
      document.body.style.backgroundSize = my_width.toString() + "vw auto";
    },
    clearBackgroundImage: function() {
      document.body.style.background = 'none';
    }
  };

  let background_Image = gui.addFolder('BackgroundImage');
  background_Image.add(guiState, 'uploadBackgroundImage');
  background_Image.add(guiState, 'zoomIn');
  background_Image.add(guiState, 'zoomOut');
  background_Image.add(guiState, 'clearBackgroundImage');
  background_Image.open();

  let heatmap_display = gui.addFolder('HeatMap');
  heatmap_display.add(guiState, 'showHeatMap')
    .onChange(async s => {
      if (s == true) {
        ShowHeatMap();
        document.getElementById("gaze").style.display = "none";
      } else {
        RemoveHeatMap();
      }
    });
  heatmap_display.open();
}

start();
unhide_navbar();

var output = [];
var frame = 0;

function PlotGaze(GazeData) {
  document.getElementById("GazeData").innerHTML = "GazeX: " + GazeData.GazeX + " GazeY: " + GazeData.GazeY;

  if (GazeData.state == 0) {
    // compute the location of the gaze on the screen
    var x = GazeData.docX;
    var y = GazeData.docY;
    var gaze = document.getElementById("gaze");
    x -= gaze.clientWidth / 2;
    y -= gaze.clientHeight / 2;

    // Save the data to the csv file
    if (isRecording()) {
      output.push([GazeData.time, frame, tag_getValue(), x, y]);
      frame += 1;
    }

    // plot the gaze point on the webpage
    gaze.style.left = x + "px";
    gaze.style.top = y + "px";

    if (GazeData.state != 0) {
      if (gaze.style.display == 'block')
        gaze.style.display = 'none';
    } else {
      if (gaze.style.display == 'none')
        gaze.style.display = 'block';
    }
  }
}

//////set callbacks/////////
GazeCloudAPI.OnCalibrationComplete = function() {
  ShowHeatMap();
  console.log('gaze Calibration Complete');
  setupDatGui();
  insertGUI(gui);
}
GazeCloudAPI.OnCamDenied = function() {
  console.log('camera  access denied')
}
GazeCloudAPI.OnError = function(msg) {
  console.log('err: ' + msg)
}
GazeCloudAPI.UseClickRecalibration = true;
GazeCloudAPI.OnResult = PlotGaze;

ShowHeatMap();
document.getElementById("gaze").style.display = 'none';

function start() {
  GazeCloudAPI.StartEyeTracking();
  GazeCloudAPI.SetFps(100);
}

onRealTimeRecordingStart = function() {
  output = [];
  frame = 0;
  Clearheatmap();
}

onRealTimeRecordingStop = function() {
  console.log('records', output);
  summary();
}

formatRecords = function() {
  var list_records = [
    ['timestamp_world', 'frame', 'tag', 'x', 'y']
  ];
  list_records = list_records.concat(output);
  return list_records;
}

function summary() { 
  document.getElementById('frames').innerText = output.length;
  var points = [];
  output.forEach(function(gaze) {
    var currpoint = {};
    currpoint = {
      x: gaze[3],
      y: gaze[4]
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
            suggestedMax: parseInt(document.getElementsByClassName('heatmap-canvas')[0].width, 10)
              // max: 1700,
              // min: -205
          }
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            reverse: true,
            suggestedMin: 0,
            suggestedMax: parseInt(document.getElementsByClassName('heatmap-canvas')[0].height, 10)
              // max: 1400,
              // min: -270
          }
        }]
      }
    }
  });
  document.getElementById('documentation_div').hidden = false;
};