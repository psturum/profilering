initialize(true, true);

var stream = null;
var interval = null;
var canvas = null;

const stats = new Stats();
insertStats(stats);

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user'
    },
  });
  video.srcObject = stream;
  setupMediaRecorder(stream, 'video');

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadVideo() {
  const video = await setupCamera();
  video.play();
  return video;
}

const main =
  async() => {
    let video;
    try {
      video = await loadVideo();
      setupRealTimeRecording();
    } catch (e) {
      userMediaDenied();
    }
  }

setupRealTimeRecording = async function() {
  unhide_navbar();
  stats.begin();
  canvas = document.getElementById('output');
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  interval = setInterval(async() => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    if (isRecording()) {
      records.push(resizedDetections);
      world_timestamps.push(Date.now());
      tag_records.push(tag_getValue());
    }
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    stats.end();
  }, 100)
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/static/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/static/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/static/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/static/models')
]).then(main())

var records = [];
var world_timestamps = [];
var video_timestamps = [];
var tag_records = [];

onRealTimeRecordingStart = function() {
  records = [];
  tag_records = [];
  world_timestamps = [];
  video_timestamps = [];
}

onRealTimeRecordingStop = function() {
  console.log('records', records);
  summary();
}

closeRealTimeRecording = function() {
  clearInterval(interval);
}

onUploadedMediaRecordingStop = function() {
  clearInterval(interval);
  console.log('records', records);
  summary();
}

onUploadedMediaRecordingStart = function() {
  records = [];
  tag_records = [];
  world_timestamps = [];
  video_timestamps = [];
  stats.begin();
  canvas = document.getElementById('output');
  const displaySize = { width: videoDownload.width, height: videoDownload.height }
  faceapi.matchDimensions(canvas, displaySize)
  interval = setInterval(async() => {
    const detections = await faceapi.detectAllFaces(videoDownload, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    if (isRecording()) {
      records.push(resizedDetections);
      world_timestamps.push(Date.now());
      video_timestamps.push(videoDownload.currentTime);
      tag_records.push(tag_getValue());
    }
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    canvas.getContext('2d').drawImage(videoDownload, 0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    stats.end();
  }, 100)
}

formatRecords = function() {
  var list_records = [];

  if (!isUploadedMedia()) {
    let temp = ['frame', 'timestamp_world', 'person'];
    let emotions = ['angry', 'disgusted', 'fearful', 'happy', 'neutral', 'sad', 'surprised'];

    for (let i = 0; i < 7; i++) {
      temp.push(emotions[i]);
    }
    temp.push('tag')
    list_records.push(temp);

    var tag_counter = 0

    records.forEach(function(frame, i) {
      if (frame.length == 0) {
        temp = [i, world_timestamps[i]];
        list_records.push(temp);
      }

      frame.forEach(function(person, j) {
        temp = [i, world_timestamps[i], j];

        emotions.forEach(function(expression) {
          temp.push(person['expressions'][expression]);
        });
        temp.push(tag_records[tag_counter])
        list_records.push(temp);
        tag_counter += 1
      });
    });
  } else {
    let temp = ['frame', 'timestamp_world', 'timestamp_video', 'person'];
    let emotions = ['angry', 'disgusted', 'fearful', 'happy', 'neutral', 'sad', 'surprised'];

    for (let i = 0; i < 7; i++) {
      temp.push(emotions[i]);
    }
    temp.push('tag')
    list_records.push(temp);

    var tag_counter = 0

    records.forEach(function(frame, i) {
      if (frame.length == 0) {
        temp = [i, world_timestamps[i], video_timestamps[i]];
        list_records.push(temp);
      }

      frame.forEach(function(person, j) {
        temp = [i, world_timestamps[i], video_timestamps[i], j];

        emotions.forEach(function(expression) {
          temp.push(person['expressions'][expression]);
        });
        temp.push(tag_records[tag_counter])
        list_records.push(temp);
        tag_counter += 1
      });
    });
  }
  return list_records;
};

function summary() {
  let colors = [
    '#62D1D3', '#326B9C', '#4EA9D9', '#5DC7E3', '#6BE0BF', '#7443BA', '#A355C8', '#CB59AE', '#DA608C', '#DC7A6E', '#E6A893', '#B1332C', '#CF5D3A', '#E18345', '#E39D4E', '#E4BE55', '#E7E268'
  ];

  document.getElementById('frames').innerText = records.length;

  var key_scores = [];
  records.forEach(function(frame, i) {
    key_scores[i] = frame.length;
  });
  if (key_scores.length != 0) {
    var avg = key_scores.reduce((a, b) => a + b, 0) / key_scores.length;
    document.getElementById("people").innerText = Math.round(avg * 100) / 100;
  } else {
    document.getElementById("people").innerText = 0;
  }

  let labels = [];
  key_scores.forEach(function(val, i) {
    labels.push(i);
  });

  var emotions = ['angry', 'disgusted', 'fearful', 'happy', 'neutral', 'sad', 'surprised'];

  var data = [key_scores.reduce((a, b) => a + b, 0), 0, 0, 0, 0, 0, 0, 0]

  records.forEach(function(frame, i) {
    frame.forEach(function(person, j) {
      let obj = person['expressions'];
      let emotion = Object.keys(obj).reduce(function(a, b) { return obj[a] > obj[b] ? a : b });
      data[emotions.indexOf(emotion) + 1] += 1;
    });
  })

  
  document.forms['data_form'].elements['faces'].value = data[0]
  document.forms['data_form'].elements['angry'].value = data[1]
  document.forms['data_form'].elements['disgusted'].value = data[2]
  document.forms['data_form'].elements['fearful'].value = data[3]
  document.forms['data_form'].elements['happy'].value = data[4]
  document.forms['data_form'].elements['neutral'].value = data[5]
  document.forms['data_form'].elements['sad'].value = data[6]
  document.forms['data_form'].elements['surprised'].value = data[7]
  document.forms['data_form'].submit();

  document.getElementById('documentation_div').hidden = false;
};