/*

	Based on Daniel Shiffmann's Nature of Code P5JS examples:
	https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js

*/

// A reference to our box2d world
var world;

var gravityX = 0;
var gravityY = 5;

// A list we'll use to track fixed objects
var boundaries = [];

// A list for all of our moving objects 
var pops = [];

var interval;
var gameOver;

var bgImage;
var dlangManImg;
function preload() {
  dlangManImg = loadImage("img/DlangMan.png");
  bgImage = loadImage("img/BG.jpg");
}

function setup() {
  createCanvas(1200,800);

  // Initialize box2d physics and create the world
  world = createWorld();

  // Add a bunch of fixed boundaries
  boundaries.push(new Boundary( width/2, height * 0.8, width*0.3, 5, 0));
  
  init();
}

function init() {
  for (var i = pops.length-1; i >= 0; i--) {
    world.DestroyBody(pops[i].body);
  }
  pops = [];
  interval = 0;
  gameOver = -1;
}

function draw() {
  imageMode(CENTER)
  image(bgImage, width/2, height/2);

  if(gameOver < 0) {
    // We must always step through time!
    var timeStep = 1.0/30;
    // 2nd and 3rd arguments are velocity and position iterations
    world.Step(timeStep,10,10);
    
    for (var i = pops.length-1; i >= 0; i--) {
      var pos = scaleToPixels(pops[i].body.GetPosition());
      if (pos.y > height) {
        gameOver = 30;
      }
    }
    
    if(interval > 0) interval --;
  } else {
    if(gameOver > 0)gameOver --;
    
  }
  
  // Display all the boundaries
  for (var i = 0; i < boundaries.length; i++) {
    boundaries[i].display();
  }

  // Display all the boxes
  for (var i = pops.length-1; i >= 0; i--) {
    pops[i].display();
    if (pops[i].done()) {
      pops.splice(i,1);
    }
  }
  strokeWeight(2);
  stroke(255,0,0);
  line(0, 200, width, 200);
  stroke(255);
  
  if(gameOver >= 0) {
    var score = pops.filter(function(elm){ 
      return elm.getScore();
    }).length;
    rectMode(CENTER);
    fill(255,255,255);
    rect(width/2, height/2-10,400,80);
    fill(0);
    textAlign(CENTER);
    textSize(32);
    var waza = "失敗！";
    if(score == 1) {
      waza = "V字バランス";
    } else if(score == 2) {
      waza = "サボテン";
    } else if(score == 3) {
      waza = "飛行機";
    } else if(score == 4) {
      waza = "肩車両側倒立";
    } else if(score == 5) {
      waza = "扇";
    } else if(score == 6 || score == 7) {
      waza = "円形とんぼ";
    } else if(score == 8) {
      waza = "つぼみ";
    } else if(score == 9) {
      waza = "塀";
    } else if(score >= 10 && score <= 14) {
      waza = "4段ピラミッド";
    } else if(score >= 15 && score <= 20) {
      waza = "5段ピラミッド";
    } else if(score >= 21 && score <= 27) {
      waza = "6段ピラミッド";
    } else if(score >= 28 && score <= 35) {
      waza = "7段ピラミッド";
    } else if(score >= 36 && score <= 44) {
      waza = "8段ピラミッド";
    } else if(score >= 44 && score <= 53) {
      waza = "9段ピラミッド";
    } else {
      waza = "10段ピラミッド";
    }
    text(waza, width/2, height/2  - 20);
    text("score " + score, width/2, height/2 + 20);
    
  }
  
  
  
}

function mousePressed() {
  if(gameOver < 0) {
    if(interval <= 0 && mouseY < 200) {
      var p = new Element(mouseX,mouseY);
      pops.push(p);
      interval = 30;
    }
  } else {
    if(gameOver === 0) {
      init();
    }
  }
  
  
}