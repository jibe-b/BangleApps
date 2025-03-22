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