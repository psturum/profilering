const MODEL_URL = 'http://evaluering.eplads.dk/face-api.js/weights/'
const minConfidence = 0.05
var isRecording = false;

let forwardTimes = []
let withBoxes = true
var records = [];

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

    const result = await faceapi.detectSingleFace(videoEl).withFaceExpressions()

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
        console.log(records)
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
    console.log(records.length)
  
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
    console.log(data)
  
    
    document.forms['data_form'].elements['faces'].value = records.length
    document.forms['data_form'].elements['angry'].value = data[1]
    document.forms['data_form'].elements['disgusted'].value = data[2]
    document.forms['data_form'].elements['fearful'].value = data[3]
    document.forms['data_form'].elements['happy'].value = data[4]
    document.forms['data_form'].elements['neutral'].value = data[5]
    document.forms['data_form'].elements['sad'].value = data[6]
    document.forms['data_form'].elements['surprised'].value = data[7]
    document.forms['data_form'].submit();
  };

function makeCSV(rows) {
  return rows.map(r => r.join(",")).join("\n");
}

function stop(){
    formatted_records = formatRecords();
    console.log("formatted_records: " + formatted_records);
    // let myBlob = new Blob([makeCSV(formattedRecords)]);
    summary()
}

const watch = document.querySelector("#stopwatch");
      let millisecound = 0;
      let timer;

function timeStart(){
  isRecording = true;
  watch.style.color = "#0f62fe";
  clearInterval(timer);
  timer = setInterval(() => {
    millisecound += 10;

    let dateTimer = new Date(millisecound);

    watch.innerHTML = 
    ('0'+dateTimer.getUTCHours()).slice(-2) + ':' +
    ('0'+dateTimer.getUTCMinutes()).slice(-2) + ':' +
    ('0'+dateTimer.getUTCSeconds()).slice(-2) + ':' +
    ('0'+dateTimer.getUTCMilliseconds()).slice(-3,-1);
  }, 10);
}


function timePaused() {
  isRecording = false;
  watch.style.color = "red";
  clearInterval(timer);
}

function timeReset(){
  isRecording = false;
  setInterval(timer)
  millisecound = 0;
  watch.innerHTML = "00:00:00:00";
}

document.addEventListener('click', (e) => {
  const el = e.target;

  if(el.id === 'start') timeStart();
  if(el.id === 'pause') timePaused();
})


$(document).ready(function() {
    setup()
})