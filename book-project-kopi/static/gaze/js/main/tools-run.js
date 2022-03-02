var one_second = 1000,
  one_minute = one_second * 60,
  one_hour = one_minute * 60,
  one_day = one_hour * 24,
  startDate;

// Recording bar elements
const recording = document.getElementById("recording"),
  time = document.getElementById('recording-bar-time'),
  upload = document.getElementById('recording-bar-upload'),
  upload_input = document.getElementById('upload_input'),
  tag = document.getElementById("recording-bar-tag"),
  tag_value = document.getElementById('recording-bar-tag-value'),
  settings_button = document.getElementById("settings-button"),
  summary_button = document.getElementById("recording-bar-summary"),
  download = document.getElementById('download'),
  download_predictions = document.getElementById('download_predictions'),
  download_video = document.getElementById('download_video'),
  overview_time = document.getElementById('time'),
  sidebar_content = document.getElementsByClassName('sidebar-content')[0];

var isMediaRecording = false;

function isRecording() {
  return isMediaRecording;
}

function insertGUI(gui) {
  document.getElementById('sidebar-content').appendChild(gui.domElement);
}

function insertStats(stats) {
  stats.showPanel(0);
  stats.dom.className = "stats";
  stats.dom.removeAttribute('style');
  document.getElementById('main-body').appendChild(stats.dom);
}

tag.onclick = function() {
  tag_value.innerText = parseInt(tag_value.innerText, 10) + 1;
}

function tag_getValue() {
  return parseInt(tag_value.innerText, 10);
}

function timerStart() {
  if (isRecording()) {
    let now = new Date(),
      elapsed = now - startDate,
      parts = [];

    parts[0] = '' + Math.floor(elapsed / one_hour);
    parts[1] = '' + Math.floor((elapsed % one_hour) / one_minute);
    parts[2] = '' + Math.floor(((elapsed % one_hour) % one_minute) / one_second);

    parts[0] = (parts[0].length == 1) ? '0' + parts[0] : parts[0];
    parts[1] = (parts[1].length == 1) ? '0' + parts[1] : parts[1];
    parts[2] = (parts[2].length == 1) ? '0' + parts[2] : parts[2];

    time.innerText = parts.join(':');
    requestAnimationFrame(timerStart);
  } else {
    return;
  }
};

settings_button.addEventListener("click", async function() {
  if (sidebar_content.classList.contains('open')) {
    sidebar_content.classList.remove("open");
  } else {
    sidebar_content.classList.add("open");
  }
})

// ------------------- Initialize -------------------
function initialize(upload=false, summary=false) {
  if (!upload) document.getElementById('recording-bar-upload').remove();
  if (!summary) document.getElementById('recording-bar-summary').remove();
}

// ------------ Recording Start and Stop ------------
function setupRealTimeRecording() {
  return;
}

function closeRealTimeRecording() {
  return;
}

function onRealTimeRecordingStart() {
  return;
}

function onRealTimeRecordingStop() {
  return;
}

function realTimeRecordingStart() {
  isMediaRecording = true;
  recording.className += " active";
  recordedChunks = [];
  mediaRecorder.start();
  recording.className += " pulse";
  startDate = new Date();
  timerStart();
  tag.disabled = false;
  settings_button.disabled = true;
  download.disabled = true;
  upload.disabled = true;
  summary_button.disabled = true;
  if (sidebar_content.classList.contains('open')) {
    sidebar_content.classList.remove("open");
  }
  onRealTimeRecordingStart();
}

function realTimeRecordingStop() {
  isMediaRecording = false;
  recording.classList.remove("active");
  mediaRecorder.stop();
  recording.classList.remove("pulse");
  if (overview_time) {
    overview_time.innerText = time.innerText;
  }
  time.innerText = '00:00:00';
  tag.disabled = true;
  tag_value.innerText = 0;
  settings_button.disabled = false;
  download.disabled = false;
  upload.disabled = false;
  summary_button.disabled = false;
  onRealTimeRecordingStop();
}

recording.addEventListener("click", function() {
  if (isUploadedMedia()) {
    hide_navbar("Accessing webcam...");
    setupRealTimeRecording();
    isUploadMedia = false;
    download_video.hidden = false;
    unhide_navbar();
  } else if (isRecording()) {
    realTimeRecordingStop();
  } else {
    realTimeRecordingStart();
  }
});

function userMediaDenied() {
  recording.disabled = true;
  time.innerText = "No camera detected";
  unhide_navbar();
}
// --------------------------------------------------

// ---------------- Uploading Media -----------------
var isUploadMedia = false;

function isUploadedMedia() {
  return isUploadMedia;
}

function onUploadedMediaRecordingStart() {
  return;
}

function onUploadedMediaRecordingStop() {
  return;
}

function uploadMediaStart() {
  hide_navbar("Uploading video...");
  settings_button.disabled = true;
  isUploadMedia = true;
  recording.classList.remove("active");
  recording.classList.remove("pulse");
  // Stop user media recording
  if (mediaStream) {
    mediaStream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  download_video.hidden = true;
}

function uploadedMediaEnd() {
  settings_button.disabled = false;
  if (overview_time) {
    overview_time.innerText = videoDownload.duration;
  }
  time.innerText = '00:00:00';
  tag.disabled = true;
  tag_value.innerText = 0;
  settings_button.disabled = false;
  download.disabled = false;
  upload.disabled = false;
  summary_button.disabled = false;
  unhide_navbar();
  onUploadedMediaRecordingStop();
}

function uploadMedia() {
  uploadMediaStart();

  var file = upload_input.files[0];
  var reader = new FileReader();

  reader.onload = async function(e) {
    var src = e.target.result;
    videoDownload.hidden = false;
    videoDownloadSource.setAttribute("src", src);
    videoDownload.load();
    
    videoDownload.onloadeddata = function() {
      hide_navbar("Analysing...");
      isMediaRecording = true;
      videoDownload.currentTime = '0';
      videoDownload.onseeked = () => {
        videoDownload.play();
        onUploadedMediaRecordingStart();
      };
    }

    videoDownload.onended = function() {
      isMediaRecording = false;
      uploadedMediaEnd();
      upload_input.value = "";
    };
  };
  reader.readAsDataURL(file);
}

upload_input.onchange = async function() {
  if (!isUploadedMedia()) {
    closeRealTimeRecording();
  }
  uploadMedia();
};
// --------------------------------------------------

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let loading_elements = ['recording-bar-loader', 'recording-bar-message'];
let recording_elements = [
  'recording',
  'recording-bar-time',
  'download',
  'recording-bar-summary',
  'recording-bar-upload',
  'recording-bar-tag',
];

function unhide_navbar() {
  document.getElementById('recording-bar-message').innerText = "Loading...";
  loading_elements.forEach(element => {
    try {
      document.getElementById(element).hidden = true;
    } catch {};
  });
  recording_elements.forEach(element => {
    try {
      document.getElementById(element).hidden = false;
    } catch {};
  });
}

function hide_navbar(message) {
  document.getElementById('recording-bar-message').innerText = message;
  loading_elements.forEach(element => {
    try {
      document.getElementById(element).hidden = false;
    } catch {};
  });
  recording_elements.forEach(element => {
    try {
      document.getElementById(element).hidden = true;
    } catch {};
  });
}

// Download Prediction Records
function formatRecords() {
  return [];
}

function makeCSV(rows) {
  return rows.map(r => r.join(",")).join("\n");
}

download_predictions.onclick = function() {
  let formattedRecords = formatRecords();
  let myBlob = new Blob([makeCSV(formattedRecords)]);
  download_predictions.href = URL.createObjectURL(myBlob);
}

// Download Webcam Video
const video = document.getElementById('video');
const videoDownload = document.getElementById('video2');
const videoDownloadSource = document.getElementById("source");

var mediaStream = null;
var mediaRecorder = null;
var recordedChunks = [];

function setupMediaRecorder(stream, type) {
  mediaStream = stream;
  let subtype;
  if (type == 'video') {
    subtype = 'webm';
  } else if (type == 'audio') {
    subtype = 'webm';
  }
  let mediaRecorderOptions = { mimeType: type+'/'+subtype };
  mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions);
  mediaRecorder.ondataavailable = handleDataAvailable;
}

function handleDataAvailable(event) {
  recordedChunks.push(event.data);
}

download_video.onclick = function() {
  var blob = new Blob(recordedChunks, {
    type: "video/webm"
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "video.webm";
  a.click();
  window.URL.revokeObjectURL(url);
}