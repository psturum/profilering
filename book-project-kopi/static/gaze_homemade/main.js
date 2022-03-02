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
}
