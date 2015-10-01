var SelectStageState = function() {
  this.seqs              = null;
  this.seqIdx            = 0;
  this.subSeqs           = [];

  this.stages = [
    "stage1",
    "stage2",
    "stage3",
    "stage4"
    ];
}

//
// State本体
//
SelectStageState.prototype = {
  // セットアップ
  setup:function(parm) {
    if(parm.score !== undefined) {
      G.scores.push(parm.score);
    }

    this.seqs = [
      seqInput(['z'.charCodeAt(0), 'Z'.charCodeAt(0)]),
      ];
    this.seqIdx = 0;
    this.seqs[this.seqIdx].init(this);

    this.up    = false;
    this.down  = false;
    this.left  = false;
    this.right = false;
    this.zKey  = false;
    this.xKey  = false;
    this.ctrl  = false;
    this.shift = false;

    this.showTitle = true;
  },
  initSeq : function(parm) {
    var go = this.seqs[this.seqIdx].init(parm);
    if(go != null) {
      this.seqIdx += go;
      while(this.seqIdx >= this.seqs.length) {
        this.seqIdx -= this.seqs.length;
      }
      while(this.seqIdx < 0) {
        this.seqIdx += this.seqs.length;
      }
      this.initSeq(parm);
    }
  },
  // 描画処理（更新処理含む）
  draw:function() {
    // メインルーチン
    var parm = this.seqs[this.seqIdx].update();
    if(parm.finish) {
      this.seqIdx ++;
      if(this.seqIdx >= this.seqs.length) {
        return {
          finish:true,
          next:GameState,
          parm:{
            stage:1,
            thinkTime:5000,
            player: {
              hp:5,
              weapons : [
                "sword",
                null,
                null,
                null,
              ],
              accessory: "shoes"
            }
          }
        };
      }
      this.initSeq(parm);
    }
    for(var i=0;i<this.subSeqs.length;i++) {
      var parm = this.subSeqs[i].update();
      if(parm.finish) this.subSeqs.splice(i,1);
    }

    fill(0);
    rect(0,0,800,600);
    if(this.showTitle) {

      stroke(0)
      fill(255);
      imageMode(CENTER);
      push();
      scale(800/640,600/480);
      image(imageCache("assets/backgrounds/06forest.jpg"), 640/2, 480/2);
      pop();
      image(imageCache("assets/title.png"), 800 / 2, 200);

      stroke(0)
      fill(255);
      textSize(60);
      textAlign(CENTER);
      strokeWeight(2);
      text("Press Z to start !", 800/2,450);
      textAlign(RIGHT);
      text("→", 800, 300);
    } else {
      noStroke();
      fill(255);
      textSize(60);
      textAlign(CENTER);
      strokeWeight(2);
      text("Scores", 800/2,50);
      textAlign(LEFT);
      text("←", 10, 300);

      textSize(20);
      textAlign(RIGHT);
      strokeWeight(1);
      for(var i=G.scores.length-1;i>=0;i--) {
        text(("00"+(i+1)).slice(-2) + " :", 120 + 220*Math.floor(i/20), 80 + 24 * (i%20));
        text(("00000"+G.scores[i]).slice(-5), 200 + 220*Math.floor(i/20), 80+ 24 * (i%20));
      }
    }

    // Seq描画
    if(this.seqs[this.seqIdx].draw !== undefined) {
      this.seqs[this.seqIdx].draw();
    }
    return {finish:false};
  },
  // キー入力時処理
  keyPressed:function() {
    if(keyCode == CONTROL || keyCode == 91 || keyCode == 93 || keyCode == ALT)this.ctrl = true;
    if(keyCode == SHIFT) this.shift = true;
    if(key == 'Z') this.zKey = true;
    if(key == 'X') this.xKey = true;
    // 方向キー
    if(     keyCode == UP_ARROW    ) this.up    = true;
    else if(keyCode == DOWN_ARROW  ) this.down  = true;
    else if(keyCode == LEFT_ARROW  ) {
      this.left  = true;
      this.showTitle = true;
    }
    else if(keyCode == RIGHT_ARROW ) {
      this.right = true;
      this.showTitle = false;
    }

    return false;
  },
  // キーリリース時処理
  keyReleased:function() {
    if(keyCode == CONTROL || keyCode == 91 || keyCode == 93 || keyCode == ALT) this.ctrl = false;
    if(keyCode == SHIFT) this.shift = false;
    if(key == 'Z') this.zKey = false;
    if(key == 'X') this.xKey = false;
    // 方向キー
    if(     keyCode == UP_ARROW    ) this.up    = false;
    else if(keyCode == DOWN_ARROW  ) this.down  = false;
    else if(keyCode == LEFT_ARROW  ) this.left  = false;
    else if(keyCode == RIGHT_ARROW ) this.right = false;

    return false;
  },
  touchStarted:function() {
  },
  touchMoved:function() {
  },
  touchEnded:function() {
  }
};
