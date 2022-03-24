const MODEL_URL = 'http://evaluering.eplads.dk/face-api.js/weights/'
const minConfidence = 0.05
var isRecording = false;

let forwardTimes = []
let withBoxes = true
var records = [];
var data1 = [0,0,0,0,0,0,0];


function onChangeHideBoundingBoxes(e) {
    withBoxes = !$(e.target).prop('checked')
}

function updateTimeStats(timeInMs) {
    forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
    const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
    $('#time').val(`${Math.round(avgTimeInMs)} ms`)
    $('#fps').val(`${faceapi.utils.round(1000 / avgTimeInMs)}`)
}


async function updateResults() {

    const videoEl = $('#inputVideo').get(0)
    const canvas = $('#overlay').get(0)
    const ts = Date.now()
    const displaySize = { width: videoEl.width, height: videoEl.height }

    const result = await faceapi
              .detectSingleFace(videoEl)
              .withFaceExpressions();
 

    updateTimeStats(Date.now() - ts)

    if (result) {
      const canvas = $('#overlay').get(0)
      const dims = faceapi.matchDimensions(canvas, videoEl, true)

      const resizedResult = faceapi.resizeResults(result, dims)
      const minConfidence = 0.05
      if (withBoxes) {
        faceapi.draw.drawDetections(canvas, resizedResult)
      }
      faceapi.draw.drawFaceExpressions(canvas, resizedResult, minConfidence)
      if(isRecording){
        records.push(resizedResult);
        update_data();
      }
    }

    setTimeout(() => updateResults())

  }

  async function setup() {
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    await faceapi.loadFaceExpressionModel(MODEL_URL)

    const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
    const videoEl = $('#inputVideo').get(0)
    videoEl.srcObject = stream
  }

function formatRecords() {
    return [];
  }

// error here
formatRecords = function() {
    var list_records = [];
    let temp = ['frame'];
    let emotions = ['angry', 'disgusted', 'fearful', 'happy', 'neutral', 'sad', 'surprised'];

    for (let i = 0; i < 7; i++) {
        temp.push(emotions[i]);
    }
    list_records.push(temp);

    
    records.forEach(function(frame, i) {


        temp = [i];

        emotions.forEach(function(expression) {
            temp.push(frame['expressions'][expression]);
        });
   
        list_records.push(temp);

    });
  return list_records;
};


function summary() {
  
    var key_scores = [];
    records.forEach(function(frame, i) {
      key_scores[i] = frame.length;
    });
  
    let labels = [];
    key_scores.forEach(function(val, i) {
      labels.push(i);
    });
  
    var emotions = ['angry', 'disgusted', 'fearful', 'happy', 'neutral', 'sad', 'surprised'];
  
    var data = [key_scores.reduce((a, b) => a + b, 0), 0, 0, 0, 0, 0, 0, 0]
  
    records.forEach(function(frame, i) {
        let obj = frame['expressions'];
        let emotion = Object.keys(obj).reduce(function(a, b) { return obj[a] > obj[b] ? a : b });
        data[emotions.indexOf(emotion) + 1] += 1;
    })
  
    
    document.forms['data_form'].elements['faces'].value = records.length;
    document.forms['data_form'].elements['angry'].value = data[1];
    document.forms['data_form'].elements['disgusted'].value = data[2];
    document.forms['data_form'].elements['fearful'].value = data[3];
    document.forms['data_form'].elements['happy'].value = data[4];
    document.forms['data_form'].elements['neutral'].value = data[5];
    document.forms['data_form'].elements['sad'].value = data[6];
    document.forms['data_form'].elements['surprised'].value = data[7];
    document.forms['data_form'].submit();

  };

function makeCSV(rows) {
  return rows.map(r => r.join(",")).join("\n");
}

window.onload = function () {
  
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
    records = [];
    tens = "00";
    seconds = "00";
    appendTens.innerHTML = tens;
    appendSeconds.innerHTML = seconds;
    isRecording = false;
    document.getElementById("group1").style.display = 'inline-flex';
    document.getElementById("group2").style.display = 'none';
    update_data();
    drawStuff();
 }

  buttonGraph.onclick = function() {
    drawStuff();
  }

  buttonSubmit.onclick = function() {
    summary();
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
}


$(document).ready(function() {
  setup();
  drawStuff();
})

google.charts.load('current', {'packages':['bar']});
google.charts.setOnLoadCallback(drawStuff);
    
function drawStuff() {
  var data = new google.visualization.arrayToDataTable([
        ['Humør', 'Antal observeret'],
        ['Angry', data1[1]],
        ['Disgusted', data1[2]],
        ['Fearful', data1[3]],
        ['Happy', data1[4]],
        ['Neutral', data1[5]],
        ['Sad', data1[6]],
        ['Surprised',data1[7]],
    ]);

  var options = {
    legend: { position: 'none' },
    colors: ['black'],
    chart: {
    },
    axes: {
    },
    bar: { groupWidth: "60%" },
    hAxis : { 
      textStyle : {
          fontSize: 18 // or the number you want
      }
    },
    vAxis : { 
      textStyle : {
          fontSize: 18 // or the number you want
      }
    },
  };

  var chart = new google.charts.Bar(document.getElementById("graph"));
  var title = "title..."
  console.log(title)
  // Convert the Classic options to Material options.
  chart.draw(data, google.charts.Bar.convertOptions(options));
};
$(window).resize(function(){
    drawStuff();
});

  function update_data() {
    var data = [];
    var key_scores = [];
    records.forEach(function(frame, i) {
      key_scores[i] = frame.length;
    });
  
    let labels = [];
    key_scores.forEach(function(val, i) {
      labels.push(i);
    });
  
    var emotions = ['angry', 'disgusted', 'fearful', 'happy', 'neutral', 'sad', 'surprised'];
  
    data = [key_scores.reduce((a, b) => a + b, 0), 0, 0, 0, 0, 0, 0, 0]
  
    records.forEach(function(frame, i) {
        let obj = frame['expressions'];
        let emotion = Object.keys(obj).reduce(function(a, b) { return obj[a] > obj[b] ? a : b });
        data[emotions.indexOf(emotion) + 1] += 1;
    })
  
    data1 = data;
  
    document.getElementById("angry").innerText = "Angry: " + data[1]
    document.getElementById("disgusted").innerText = "Disgusted: " + data[2]
    document.getElementById("fearful").innerText = "Fearful: " + data[3]
    document.getElementById("happy").innerText = "Happy: " + data[4]
    document.getElementById("neutral").innerText = "Neutral: " + data[5]
    document.getElementById("sad").innerText = "Sad: " + data[6]
    document.getElementById("surprised").innerText = "Surprised: " + data[7]
    // drawStuff();
  
    // document.getElementById("angry1").innerText = data[1]
    // document.getElementById("disgusted1").innerText = data[2]
    // document.getElementById("fearful1").innerText = data[3]
    // document.getElementById("happy1").innerText = data[4]
    // document.getElementById("neutral1").innerText = data[5]
    // document.getElementById("sad1").innerText = data[6]
    // document.getElementById("surprised1").innerText = data[7]
  
  }