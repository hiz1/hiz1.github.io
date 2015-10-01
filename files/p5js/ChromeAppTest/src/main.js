// グローバル変数
var G = {
  currentState:null,
  scores:[]
};

// 定数
var C = {
  anims:{},
  weapons:{},
  bgms:{},
  ses:{}
};

var loaded = {
  seJson:{}
}
function preload() {
  // 定数読み込み
  C.weapons = loadJSON("datas/weapons.json");

  C.accessories = loadJSON("datas/accessories.json");
  C.anims   = loadJSON("datas/animations.json");

  // // 画像先読み
  // imageCache("assets/backgrounds/06forest.jpg");
  // imageCache("assets/backgrounds/01sougen.jpg");
  // imageCache("assets/title.png");
  // var weaponKeys = Object.keys(C.weapons);
  // for(var i=weaponKeys.length-1;0<=i;i--) {
  //   iconImage(C.weapons[weaponKeys[i]]);
  // }
  // var accessoryKeys = Object.keys(C.accessories);
  // for(var i=accessoryKeys.length-1;0<=i;i--) {
  //   iconImage(C.accessories[accessoryKeys[i]]);
  // }
  // var animKeys = Object.keys(C.anims);
  // for(var i=animKeys.length-1;0<=i;i--) {
  //   var anim = C.anims[animKeys[i]];
  //   getAnimation("assets/animations/"+anim.file, anim.col, anim.row, anim.interval, [], [], 0);
  // }
  // imageCache("assets/charactors/tree.png");
  // imageCache("assets/charactors/mon_042.png");
  // imageCache("assets/charactors/mon_032.png");
  // imageCache("assets/charactors/mon_002.png");
  // imageCache("assets/charactors/mon_008.png");
  // imageCache("assets/charactors/mon_084.png");
  // imageCache("assets/charactors/mon_247.png");
  // imageCache("assets/charactors/mon_258.png");

  // // BGM読み込み
  // C.bgms["first"] = loadSound("assets/bgms/field_douga.mp3");
  // loaded.seJson= loadJSON("datas/ses.json");

  randomSeed(+new Date());
  // frameRate(30);
  // fullscreen(true);
  createCanvas(windowWidth, windowHeight);
  G.currentState = new SelectStageState();
  G.currentState.setup(1);

  var weaponKeys = Object.keys(C.weapons)
  for(var i=weaponKeys.length-1;0<=i;i--) {
    var weapon = C.weapons[weaponKeys[i]];
    if(weapon.actions === undefined) {
      weapon.actions = [weapon];
    }
    // 効果コピー
    for(var j=weapon.actions.length-1;j>=0;j--) {
      var action = weapon.actions[j];
      if(action.anim      === undefined)action.anim      = weapon.anim;
      if(action.range     === undefined)action.range     = weapon.range;
      if(action.power     === undefined)action.power     = weapon.power;
      if(action.penetrate === undefined)action.penetrate = weapon.penetrate;
      if(action.knockback === undefined)action.knockback = weapon.knockback;
      if(action.impact    === undefined)action.impact    = weapon.impact;
      if(action.canGuard  === undefined)action.canGuard  = weapon.canGuard;
    }
  }


  var seKeys = Object.keys(loaded.seJson);
  for (var i = 0, len = seKeys.length; i < len; i++) {
    C.ses[seKeys[i]] = loadSound("assets/ses/" + loaded.seJson[seKeys[i]].file);
    C.ses[seKeys[i]].setVolume(loaded.seJson[seKeys[i]].volume);
  }
}

function setup() {
  
}

function draw() {
  var blankWidth = (windowWidth-windowHeight/600*800)/2;
  if(blankWidth < 0)blankWidth = 0;
  push();
  translate(blankWidth, 0);
  scale(windowHeight/600, windowHeight/600);
  if(G.currentState != null) {
    var result = G.currentState.draw();
    if(result.finish == true) {
      var NextState = result.next;
      G.currentState = new NextState();
      G.currentState.setup(result.parm);
    }
  }

  // 端を塗りつぶす
  pop();
  noStroke();
  fill(255);
  rect(0,0,blankWidth,windowHeight);
  rect(windowWidth-blankWidth,0,blankWidth,windowHeight);

  // // FPS表示
  // fill(0);
  // textAlign(LEFT);
  // text(""+Math.round(frameRate()), 0,10);



  // 効果音
  updateSE();
}

function keyPressed() {
  G.currentState.keyPressed();
}

function keyReleased() {
  clear();
  G.currentState.keyReleased();
}

function touchStarted() {
  G.currentState.touchStarted();
}

function touchMoved() {
  G.currentState.touchMoved();
}

function touchEnded() {
  G.currentState.touchEnded();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}