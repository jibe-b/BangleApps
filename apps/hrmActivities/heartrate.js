const Storage = require("Storage")



const HEIGHT = g.getHeight();
const WIDTH = g.getWidth();

/*g.setFontVector(20);

var draw = () => {
  g.drawString("80", 100,100,true);
  g.fillCircle(g.getWidth()/2,g.getHeight()/2,5);

  var xoffset = 60;
  for(x=1;x<3;x++)   {
    g.drawLine(x*xoffset,0,x*xoffset,g.getHeight());

          g.drawLine(0,x*xoffset,g.getWidth(),x*xoffset)           ;

                     }
/*
// or draw an image directly from Storage
g.drawImage(require("Storage").read("myimage.img"), 10, 10);

*/
/* 
};
g.clear();
draw();*/

Bangle.on('swipe', (left_right, up_down) => {

  g.clear();

  g.setFontAlign(0, 0);

  g.setFontVector(40);

  g.drawLine(0, 175 / 3, 175, 175 / 3);
  g.drawLine(0, 175 / 3 * 2, 175, 175 / 3 * 2);
  g.drawLine(175 / 3, 0, 175 / 3, 175);
  g.drawLine(175 / 3 * 2, 0, 175 / 3 * 2, 175);

  g.drawString('a', 20, 10);
  g.drawString('b', 20 + 175 / 3, 10);
  g.drawString('c', 20 + 2 * 175 / 3, 10);

});

Bangle.on('touch', (button, xy) => {

  let app = '';
  if (0 <= xy.x && xy.x < 175 / 3) {
    app = Date.now().toString();
  }
  else if (175 / 3 <= xy.x && xy.x < 175 / 3 * 2) app = 'B';
  else app = 'C';

  g.drawString(app, WIDTH / 2, HEIGHT / 2, true);

});

Bangle.on('HRM-ra', (value) => {
  g.clear();
  g.setFontVector(40);
  g.drawString(value);
  console.log(value);
});




















/*


var getNewHR = (lastHr, time)=> {
  var increment = (-0.5 + Math.random()) * 10 + (-0.5 + Math.sin(time/50) ) * 10  + (-0.5 + Math.sin(time/10) ) * 20;
  return Math.round(lastHr + increment);
};

var build_initial_hrHistory = (lastHr) => {
 var res = [];
  for(let i=0;i<60;i++){
    var hr = getNewHR(lastHr, i);
    res.push(hr);
    lastHr = hr;
 }
  return res;
};

var lastHr = 100;
var hrHistory = build_initial_hrHistory(lastHr);
var new_hr;
var actualTime = 0;

var fontSize = 30;
g.setFont("6x8");
g.setColor(g.theme.fg);
g.setFontVector(fontSize);
g.setFontAlign(0,0);

var max_length = 60;
var diameter = 1;
var min_hr = 50;



// Draw on every second if unlocked or charging, minute otherwise, start at with seconds on load
var drawTimeout;
var drawInterval = 1000;

// schedule a draw for the next interval
function queueDraw() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    draw();
  }, drawInterval - (Date.now() % drawInterval));
}

function draw() {

  actualTime += 1;
  new_hr = getNewHR(lastHr, actualTime);
  hrHistory.push(new_hr);

  if (hrHistory.length > max_length) hrHistory = hrHistory.splice(-max_length);

  g.clear();
  for (let i=0;i<hrHistory.length;i++){
    var time = i;
    var hr = hrHistory[i];

    
    g.drawString(new_hr, g.getWidth()/2, 24 + fontSize/2, true);

    
    g.fillCircle(time * g.getWidth()/60, g.getHeight() + (min_hr - hr) * 1.5 , diameter);
    
    queueDraw();
  }
}

g.clear();
draw();

*/




if (process.env.HWVERSION == 1) {
  Bangle.setLCDPower(1);
  Bangle.setLCDTimeout(0);
}

Bangle.setHRMPower(1);


var sum = function (array) {
  var total = 0;
  for (var i = 0; i < array.length; i++) {
    total += array[i];
  }
  return total;
};

var mean = (array) => {
  return sum(array) / array.length;
};

var min = (array) => {
  var sorted_array = array.sort((a, b) => a - b)
  return sorted_array[0]
}

var max = (array) => {
  var sorted_array = array.sort((a, b) => b - a)
  return sorted_array[0]
}

/*
var median = (array) => {
  array = array.sort();
  if (array.length % 2 === 0) { // array with even number elements
    return (array[array.length/2] + array[(array.length / 2) - 1]) / 2;
  }
  else {
    return array[(array.length - 1) / 2]; // array with odd number elements
  }
};
*/


var hrmInfo = {}
var hrmOffset = 0;
var hrmInterval;
var btm = g.getHeight() - 1;
var lastHrmPt = []; // last xy coords we draw a line to

var hrHistory = [];

g.setColor(g.theme.fg);
g.reset().setFont("6x8", 2).setFontAlign(0, -1);

function onHRM(heartRate) {
  hrmInfo = heartRate;

  updateHrm();
}


Bangle.on('HRM', onHRM);

var timeSincePushToBaserow = 0
function updateHrm() {

  if (timeSincePushToBaserow < 10) { timeSincePushToBaserow += 1 }
  else {
    timeSincePushToBaserow = 0;
    //const base_url = "https://trigger.macrodroid.com/369536eb-701d-43c7-ba63-b31106eca988/notification-recue?text="

    const table_id = "481734"
    const baserow_url = `https://api.baserow.io/api/database/rows/table/${table_id}/`
    const headers = {
      "Authorization": "Token Qf6SYdzFNmP7oDtWJ6iWTcb75dcZkuzD",
      "Content-Type": "application/json"
    }
    const body = {
      "field_3790524": "from hrmAndActivities", //Date.now().toString(),
      "field_3790525": "[82,83,84]"
    }
    Bangle.http(
      // base_url + 'tiptop_from_bangleJS', {
      baserow_url, {
      method: 'POST',
      headers,
      body
    }).then(response => {
      console.log("Response received:", response);
    }).catch(error => {
      console.error("Error sending data:", error);
    });

  }

  if (hrmInfo.bpm) {
    hrHistory = hrHistory.concat([hrmInfo.bpm])
  }

  var maxHistoryLength = 60 / 2
  if (hrHistory.length > maxHistoryLength) {
    hrHistory = hrHistory.splice(-maxHistoryLength)
  }

  var px = g.getWidth() / 2;
  g.setFontAlign(0, -1);
  g.clearRect(0, 24, g.getWidth(), g.getHeight());
  //g.setFont("6x8").drawString(/*LANG*/"Confidence "+(hrmInfo.confidence || "--")+"%", px, 70);

  g.setFontAlign(0, 0);
  var str = hrmInfo.bpm || "";
  var fontSize = 60;
  var py = g.getHeight() / 2;

  g.setFontVector(fontSize)
    .setColor(hrmInfo.confidence > 50 ? g.theme.fg : "#888")
    .drawString(timeSincePushToBaserow.toString(), px, py); //

  px += g.stringWidth(str) / 2;
  //py += g.stringHeight(str)/2;

  g.setFont("6x8")
    .setColor(g.theme.fg);

  g.drawString(/*LANG*/"BPM", px + 25, py);

  if (hrHistory.length > 0) {
    var meanHrHistory = Math.round(mean(hrHistory)) // Math.trunc(
    var minHrHistory = min(hrHistory)
    var maxHrHistory = max(hrHistory)

    g.setFontVector(15)
    g.drawString(meanHrHistory.toString(), g.getWidth() / 2 - 30, g.getHeight() - 30)

    g.drawString(maxHrHistory.toString(), g.getWidth() / 2 - 60, g.getHeight() - 40)
    g.drawString(minHrHistory.toString(), g.getWidth() / 2 - 60, g.getHeight() - 20)

  }
}


var onHRMraw = function (heartRate) {

  var rawMax = 0;
  var scale = 2000;
  hrmOffset++;
  if (hrmOffset > g.getWidth()) {
    let thousands = Math.round(rawMax / 1000) * 1000;
    if (thousands > scale) scale = thousands;

    g.clearRect(0, 24, g.getWidth(), g.getHeight());

    hrmOffset = 0;
    lastHrmPt = [-100, 0];
  }
  if (rawMax < heartRate.raw) {
    rawMax = heartRate.raw;
  }
  let y = E.clip(btm - (8 + heartRate.filt / 3000), btm - 24, btm);
  //g.setColor(1,0,0).fillRect(hrmOffset,btm, hrmOffset, y);
  y = E.clip(btm - (heartRate.raw / scale * 84), 84, btm);
  //g.setColor(g.theme.fg).drawLine(lastHrmPt[0],lastHrmPt[1],hrmOffset, y);
  lastHrmPt = [hrmOffset, y];
  if (counter !== undefined) {
    counter = undefined;
    g.clearRect(0, 24, g.getWidth(), g.getHeight());
    updateHrm();
  }
}

Bangle.on('HRM-raw', onHRMraw);


Bangle.setUI({
  mode: "clock",
  remove: function () {
    Bangle.removeListener('HRM', onHRM)
    Bangle.removeListener('HRM-raw', onHRMraw)
    g.clear();
    delete hrmInfo
  }
});


Bangle.loadWidgets();
Bangle.drawWidgets();
