let y_data; 
y_data = "{{ happy }}"

function reset_(){
    document.getElementById("sad").disabled = false;
    document.getElementById("happy").disabled = false;
    document.getElementById("neutral").disabled = false;
    document.getElementById("surprised").disabled = false;
    document.getElementById("fearful").disabled = false;
    document.getElementById("disgusted").disabled = false;
    document.getElementById("angry").disabled = false;
}
function happy(){
    y_data = "{{ happy }}"
    reset_()
    document.getElementById("happy").disabled = true;
    drawChart()
}
function angry(){
    y_data = "{{ angry }}"
    reset_()
    document.getElementById("angry").disabled = true;
    drawChart()
}
function neutral(){
    y_data = "{{ neutral }}"
    reset_()
    document.getElementById("neutral").disabled = true;
    drawChart()
}
function disgusted(){
    y_data = "{{ disgusted }}"
    reset_()
    document.getElementById("disgusted").disabled = true;
    drawChart()
}
function fearful(){
    y_data = "{{ fearful }}"
    reset_()
    document.getElementById("fearful").disabled = true;
    drawChart()
}
function sad(){
    y_data = "{{ sad }}"
    reset_()
    document.getElementById("sad").disabled = true;
    drawChart()
}
function surprised(){
    y_data = "{{ surprised }}"
    reset_()
    document.getElementById("surprised").disabled = true;
    drawChart()
}


google.charts.load('current',{packages:['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    // Set Data
    x = JSON.parse("{{ x }}")
    y = JSON.parse(y_data)
    var c = x.map(function(e, i) {
            return [e, y[i]];
        });
    var d = [['x', 'y']]
    test = d.concat(c)

    var data = google.visualization.arrayToDataTable(test);
    // Set Options
    var options = {
        backgroundColor: {
                    fill: 'black',
                    fillOpacity: 0
        },
        title: '',
        hAxis: {title: 'Klokkeslæt', gridlines: {
color: 'transparent'
}, textStyle : {
                    color: '#FFF',
                    fontSize: 18 // or the number you want
                }, titleTextStyle : {
                    color: '#FFF',
                    fontSize: 18 // or the number you want
                }},
        vAxis: {title: 'Humør i %', gridlines: {
color: 'transparent'
}, textStyle : {
                    color: '#FFF',
                    fontSize: 18 // or the number you want
                },  titleTextStyle : {
                    color: '#FFF',
                    fontSize: 18, // or the number you want,
                        
                }},
        legend: 'none',
        colors: ['blue'],
        
    };
    // Draw Chart
    var chart = new google.visualization.LineChart(document.getElementById('chart'));
    chart.draw(data, options);
}