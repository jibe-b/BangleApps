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

function updateHrm() {

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
    .drawString(str, px, py);

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
