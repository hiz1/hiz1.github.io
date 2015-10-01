function setup() {
  // put setup code here
  createCanvas(640,480);
  background(122);
  frameRate(30);
}

function draw() {
  // put drawing code here
  if(mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }

  rotate(PI/8.0);
  ellipse(mouseX,mouseY,80,80);
}
