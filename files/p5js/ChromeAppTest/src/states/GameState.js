var GameState = function() {
  this.tile              = null;
  this.dx                = 0;
  this.seqs              = null;
  this.seqIdx            = 0;
  this.subSeqs           = [];
};

//
// グローバル定数
//

GameState.tileWidth         = 60;
GameState.tileHeight        = 50;
GameState.tileAngle         = -10;
GameState.tileCol           = 13;
GameState.tileRow           = 7;

//
// グローバル関数
//

// タイルの座標取得
GameState.getTilePos = function(xi, yi) {
  return [(xi+1)*GameState.tileWidth+24, yi*GameState.tileHeight+70];
};

// キャラクタの座標取得
GameState.getCharaPos = function(xi, yi) {
  return [(xi+1.5)*GameState.tileWidth + (yi * GameState.tileHeight * tan(-PI*10.0/180.0)) + 12, (yi + 0.5)*GameState.tileHeight+70];
};

// 文字色設定
GameState.textColor = function () {
  // textStyle(BOLD);
  // strokeWeight(1);
  noStroke(122);
  fill(0);
};

// 攻撃範囲などの描画
GameState.drawRange = function(cxi, cyi, range, col, stCol, dsize, penetrate) {
  if(dsize === undefined)dsize = 0;
  push();
  shearX(GameState.tileAngle * PI / 180.0);

  var rangeLength = range.length;
  for(var i=0;i<rangeLength;i++) {
    var xi = cxi+range[i][0];
    var yi = cyi+range[i][1];
    if(xi <  0 ) continue;
    if(xi >  (GameState.tileCol-1)) continue;
    if(yi <  0 ) continue;
    if(yi >  (GameState.tileRow-1) ) continue;
    var pos = GameState.getTilePos(xi, yi);
    strokeWeight(2);
    stroke(stCol[0], stCol[1],stCol[2],stCol[3]);
    fill(col[0],col[1],col[2],col[3]);
    if(penetrate) {
      rect(pos[0]-1-dsize + GameState.tileWidth*0.2, pos[1]-1-dsize + GameState.tileHeight*0.2, GameState.tileWidth*0.6+dsize*2, GameState.tileHeight*0.6+dsize*2);
    } else {
      rect(pos[0]-1-dsize + GameState.tileWidth*0.3, pos[1]-1-dsize + GameState.tileHeight*0.3, GameState.tileWidth*0.4+dsize*2, GameState.tileHeight*0.4+dsize*2);
      noFill();
      rect(pos[0]-1-dsize + GameState.tileWidth*0.2, pos[1]-1-dsize + GameState.tileHeight*0.2, GameState.tileWidth*0.6+dsize*2, GameState.tileHeight*0.6+dsize*2);
    }
  }
  pop();
};

// 移動先の描画
GameState.drawMoveDist = function(cxi, cyi, range, jump, col, stCol, dsize) {
  if(dsize === undefined)dsize = 0;
  push();
  shearX(GameState.tileAngle * PI / 180.0);
  strokeWeight(2);
  stroke(stCol[0], stCol[1],stCol[2],stCol[3]);

  var rangeLength = range.length;
  for(var i=0;i<rangeLength;i++) {
    fill(col[0],col[1],col[2],col[3]);

    var dx = range[i][0];
    var dy = range[i][1];
    var xi = cxi+dx;
    var yi = cyi+dy;
    if(jump) {
      // ジャンプ
      var pos = GameState.getTilePos(cxi + dx, cyi + dy);
      push();
      translate(pos[0] + GameState.tileWidth/2, pos[1] +  GameState.tileHeight/2);
      ellipseMode(CENTER);
      ellipse(0, 0, GameState.tileWidth * 0.75, GameState.tileHeight * 0.75*0.8);
      pop();

      var pos0 = GameState.getTilePos(cxi, cyi);
      ellipse(pos0[0] + GameState.tileWidth/2, pos0[1] + GameState.tileHeight/2,
      GameState.tileWidth * 0.25, GameState.tileHeight * 0.25*0.8);
      noFill();
      bezier(pos0[0] + GameState.tileWidth/2, pos0[1] +  GameState.tileHeight/2,
          (pos0[0] * 0.8 + pos[0] * 0.2) + GameState.tileWidth/2, pos0[1] - GameState.tileHeight / 4,
          (pos0[0] * 0.2 + pos[0] * 0.8) + GameState.tileWidth/2,  pos[1] - GameState.tileHeight / 4,
           pos[0]  + GameState.tileWidth/2, pos[1] +  GameState.tileHeight/2);
    } else {
      // 走る
      var v0 = [0,0];
      var v  = [0,0];

      var pos = GameState.getTilePos(cxi + dx, cyi + dy);
      push();
      translate(pos[0] + GameState.tileWidth/2, pos[1] +  GameState.tileHeight/2);
      ellipseMode(CENTER);
      ellipse(0, 0, GameState.tileWidth * 0.75, GameState.tileHeight * 0.75*0.8);
      pop();

      var pos0 = GameState.getTilePos(cxi, cyi);
      ellipse(pos0[0] + GameState.tileWidth/2, pos0[1] + GameState.tileHeight/2,
      GameState.tileWidth * 0.25, GameState.tileHeight * 0.25*0.8);
      noFill();
      line(pos0[0] + GameState.tileWidth/2, pos0[1] +  GameState.tileHeight/2,
           pos[0]  + GameState.tileWidth/2, pos[1] +  GameState.tileHeight/2);

    }

  }
  pop();
};

// 召還範囲の描画
GameState.drawSummonRange = function(cxi, cyi, range, col, stCol, dsize) {
  if(dsize === undefined)dsize = 0;
  push();
  shearX(GameState.tileAngle * PI / 180.0);
  strokeWeight(2);
  stroke(stCol[0], stCol[1],stCol[2],stCol[3]);
  fill(col[0],col[1],col[2],col[3]);
  ellipseMode(CENTER);
  var rangeLength = range.length;
  for(var i=0;i<rangeLength;i++) {
    var xi = cxi+range[i][0];
    var yi = cyi+range[i][1];
    if(xi <  0 ) continue;
    if(xi >  (GameState.tileCol-1)) continue;
    if(yi <  0 ) continue;
    if(yi >  (GameState.tileRow-1) ) continue;
    var pos = GameState.getTilePos(xi, yi);
    ellipse(pos[0]+ GameState.tileWidth/2, pos[1]+ GameState.tileHeight/2, GameState.tileWidth+dsize*2, GameState.tileHeight*0.8+dsize*2);
  }
  pop();
};

// 防御範囲の描画
GameState.drawGuardRange = function(cxi, cyi, range, col, stCol, dsize) {
  if(dsize === undefined)dsize = 0;
  push();
  shearX(GameState.tileAngle * PI / 180.0);
  strokeWeight(2);
  stroke(stCol[0], stCol[1],stCol[2],stCol[3]);
  fill(col[0],col[1],col[2],col[3]);
  var rangeLength = range.length;
  for(var i=0;i<rangeLength;i++) {
    var dx = range[i][0];
    var dy = range[i][1];
    var xi = cxi+dx;
    var yi = cyi+dy;
    if(xi <  0 ) continue;
    if(xi >  (GameState.tileCol-1)) continue;
    if(yi <  0 ) continue;
    if(yi >  (GameState.tileRow-1) ) continue;
    var pos = GameState.getTilePos(xi, yi);
    // 矢印表示
    push();
    translate(pos[0] + GameState.tileWidth/2, pos[1] +  GameState.tileHeight * (0.5) );
    if(     dx < 0) {
      if(     dy > 0) {
        rotate( PI*3/4);
        translate(-GameState.tileWidth*0.4,0);
      } else if(dy < 0) {
        rotate(-PI*3/4);
        translate(-GameState.tileWidth*0.4,0);
      } else {
        rotate(-PI);
      }
    } else if(dx > 0) {
      if(     dy > 0) {
        rotate( PI/4);
        translate(-GameState.tileWidth*0.4,0);
      } else if(dy < 0) {
        rotate(-PI/4);
        translate(-GameState.tileWidth*0.4,0);
      }
    } else {
      if(     dy > 0) {
        rotate( PI/2);
      } else if(dy < 0) {
        rotate(-PI/2);
      }
    }
    beginShape();
    vertex(-GameState.tileWidth*0.2-dsize  , -GameState.tileHeight*0.4-dsize);
    vertex(-GameState.tileWidth*0.2-dsize  ,  GameState.tileHeight*0.4+dsize);
    vertex(-GameState.tileWidth*0.2+5+dsize,  GameState.tileHeight*0.3);
    vertex(-GameState.tileWidth*0.2+5+dsize, -GameState.tileHeight*0.3);
    endShape(CLOSE);
    pop();
  }
  pop();
};

// 武器情報描画
GameState.drawWeaponInfo = function (weapon, x, y, bgCol) {
  var drawInfo = function(name, amount, icon, pos) {
    noStroke();
    fill(80);
    textSize(16);
    text(name, pos[0], pos[1]);
    push();
    translate(pos[0]+20, pos[1]+10);
    scale(1.2, 1.2);
    imageMode(CENTER);
    for(var i=0;i<amount;i++) {
      image(iconImage(icon), i*12, 0);
    }
    pop();
  }
  if(weapon != null) {
    push();
    translate(x, y);


    if(bgCol    !== undefined) fill(bgCol[0], bgCol[1], bgCol[2], bgCol[3]);
    else fill(255);
    stroke(0);
    rectRounded(-18,-16,620,72, 8);

    line(-14,15, 598,15);

    textSize(18);
    textAlign(LEFT);
    noStroke();
    // textStyle(BOLD);
    fill(0);

    // 武器名
    push();
    scale(1.2, 1.2);
    imageMode(CENTER);
    image(iconImage(weapon.icon), 0, 0);
    pop();
    text(weapon.name, 24, 5);
    // 説明
    textSize(14);
    textStyle(NORMAL);

    // fill(222);
    if(weapon.desc !== undefined)text(weapon.desc, 200, 4);

    translate(0, 30);
    var x = 0;
    // 威力
    if(weapon.power > 0) {
      drawInfo("威力", weapon.power, 417, [x, 0]);
      x+=80;
    }
    // ウェイト
    if(weapon.wait  > 0) {
      drawInfo("溜め", weapon.wait,  551, [x, 0]);
      x+=80;
    }
    // ビジー
    if(weapon.busy  > 0) {
      drawInfo("隙", weapon.busy,  552, [x, 0]);
      x+=80;
    }
    // ノックバック
    // スタン
    if (weapon.impact !== undefined ? weapon.impact : false) {
      drawInfo("スタン",weapon.impact !== undefined ? weapon.impact : 0,  317, [x,0]);
      x += 100;
    }
    if(weapon.knockback !== undefined ? weapon.knockback : false){
      drawInfo("吹き飛ばし",weapon.knockback !== undefined ? weapon.knockback : 0,  332, [x, 0]);
      x += 100;
    }
    // 非貫通
    if(weapon.penetrate !== undefined ? !weapon.penetrate : false) {
      drawInfo("非貫通",weapon.penetrate !== undefined ? !weapon.penetrate : 0,  298, [x,0]);
      x += 80;
    }
    // キャンセル不可
    var cancel = weapon.cancel === undefined || !weapon.cancel ? 1 : 0;
    if(cancel) {
      drawInfo("怯み無効",cancel,  324, [x, 0]);
      x += 80;
    }
    // ガード無効
    var cantGuard = weapon.canGuard !== undefined && !weapon.canGuard;
    if(cantGuard) {
      drawInfo("防御無効", cantGuard ? 1 : 0,  297, [x, 0]);
    }
    pop();
  }
};

// アクセサリ情報描画
GameState.drawAccessoryInfo = function (acc, x, y, bgCol) {
  var drawInfo = function(name, amount, icon, pos) {
    noStroke();
    fill(80);
    textSize(16);
    text(name, pos[0], pos[1]);
    push();
    translate(pos[0]+20, pos[1]+10);
    scale(1.2, 1.2);
    imageMode(CENTER);
    for(var i=0;i<amount;i++) {
      image(iconImage(icon), i*12, 0);
    }
    pop();
  }
  if(acc != null) {
    push();
    translate(x, y);

    stroke(0);
    if(bgCol    !== undefined) fill(bgCol[0], bgCol[1], bgCol[2], bgCol[3]);
    else fill(255);
    rectRounded(-18,-16,620,30, 8);

    textSize(18);
    textAlign(LEFT);
    noStroke();
    // textStyle(BOLD);
    fill(0);

    // アクセサリ名
    push();
    scale(1.2, 1.2);
    imageMode(CENTER);
    image(iconImage(acc.icon), 0, 0);
    pop();
    text(acc.name, 24, 5);
    // 説明
    textSize(14);
    textStyle(NORMAL);
    noStroke();
    if(acc.desc !== undefined)text(acc.desc, 200, 4);

    pop();
  }
};

// 所持アイテムの表示
GameState.drawItem = function(item, keyDisp, x, y, selected) {
  if(keyDisp.size === undefined)keyDisp.size = 20;
  push();
  translate(x, y);
  // 枠表示
  if(selected) {
    fill(255);
  } else fill(220);
  stroke(0);
  rectRounded(0,0,30,30,4);
  fill(255);
  // アイコン表示
    if(item != null) {
    imageMode(CENTER);
    push();
    translate(15,15);
    if(selected) {
      scale(2,2);
      tint(255);
    } else tint(220);
    image(iconImage(item.icon),0,0);
    pop();
  }
  imageMode(CORNER);
  // キー表示
  textAlign(CENTER);
  this.textColor();
  textSize(keyDisp.size);
  text(keyDisp.key, 17, 40);
  pop();
}

//
// GameState本体
//
GameState.prototype = {
  // セットアップ
  setup:function(parm) {
    this.charaMap = {};
    this.dx   = 0;
    this.seqs = [
      this.seqInput(this, ['z'.charCodeAt(0), 'Z'.charCodeAt(0)]),
      this.seqPlayerAction(this),
      // this.seqGetItem(this),
      this.seqEnemyAction(this),
      this.seqTileMove(this),
      this.seqAddEnemy(this)
      ];
    this.player = new GameState.Player();
    this.player.setup(this, parm.player);
    this.enemies = [];
    this.items   = [];

    this.up    = false;
    this.down  = false;
    this.left  = false;
    this.right = false;
    this.zKey  = false;
    this.xKey  = false;
    this.ctrl  = false;
    this.shift = false;

    this.lifeCount = 0; // ライフアイテム出現までのカウント

    this.seqIdx = 0;
    this.seqs[this.seqIdx].init(this);

    // ステージ
    this.stage = new Stage1();
    this.stage.setup(this);

    this.thinkTime = parm.thinkTime;

    this.tile = imageCache(this.stage.tile);
    this.bgm = C.bgms[this.stage.bgm];
    this.bgm.setVolume(0.2);
    this.bgm.loop();
    this.bg = imageCache("assets/backgrounds/" + this.stage.bg);

    this.scrollSpeed = this.stage.scrollSpeed;

    this.gameoverCount = -1;

    this.score = 0;
  },
  initSeq : function(parm) {
    var go = this.seqs[this.seqIdx].init(parm);
    if(go !== undefined && go != null) {
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
    this.scrollSpeed = this.stage.scrollSpeed;
    var parm = this.seqs[this.seqIdx].update();
    if(parm.finish) {
      this.seqIdx ++;
      if(this.seqIdx >= this.seqs.length) {
        this.seqIdx = 0;
      }
      this.initSeq(parm);
    }
    for(var i=0;i<this.subSeqs.length;i++) {
      var parm = this.subSeqs[i].update();
      if(parm.finish) this.subSeqs.splice(i,1);
    }
    // プレイヤーのHPが0になったらステート遷移
    if(this.gameoverCount == 0) {
      return {
        finish:true,
        next  :SelectStageState,
        parm  :{
          score:this.score
        }
      };
    } else if(this.gameoverCount > 0) {
      this.gameoverCount --;
    } else if(this.player.hp <= 0) {
      this.bgm.stop();
      playSE("gameover");
      this.gameoverCount = 30;

    }

    // 背景描画
    push();
    tint(255);
    scale(800/640,600/480);
    image(this.bg,0,0);
    pop();

    // タイル・範囲描画
    push();
    translate(this.dx,0);
    this.drawTile();
    if(this.seqIdx == 0 || this.player.actionTurn > 0) {
      this.player.drawRange();
    }
    for(var i=0;i<this.enemies.length;i++) {
      if(this.seqIdx == 0 || this.enemies[i].actionTurn > 0) {
        this.enemies[i].drawRange();
      }
    }

    // アイテム描画
    for(var i=0;i<this.items.length;i++) {
      this.items[i].draw();
    }
    // キャラクタ描画
    for(var yi=0;yi<GameState.tileRow;yi++) {
      if(this.player.yi == yi) this.player.draw();
      for(var i=0;i<this.enemies.length;i++) {
        if(this.enemies[i].yi == yi && !this.enemies[i].through)this.enemies[i].draw();
      }
      for(var i=0;i<this.enemies.length;i++) {
        if(this.enemies[i].yi == yi && this.enemies[i].through)this.enemies[i].draw();
      }
    }
    for(var i=0;i<this.enemies.length;i++) {
      this.enemies[i].drawStatus();
    }
    pop();

    // アニメーション描画
    push();
    drawAnimation();
    pop();

    // ステータス描画
    this.player.drawStatus(10, 450);

    // スコア描画
    stroke(0)
    fill(255);
    textAlign(RIGHT);
    textSize(30);
    strokeWeight(1);
    text("Score:", 120, 30);
    text("" + ("00000"+this.score).slice(-5), 280, 30);

    // Seq描画
    if(this.seqs[this.seqIdx].draw !== undefined) {
      this.seqs[this.seqIdx].draw();
    }

    // ゲームオーバー時の暗転
    if(this.gameoverCount >= 0) {
      noStroke();
      fill(0,0,0,255 * (30 - this.gameoverCount) / 30);
      rect(0,0,800,600);
    }

    return {finish:false};
  },
  // キー入力時処理
  keyPressed:function() {
    if(keyCode == CONTROL || keyCode == 91 || keyCode == 93 || keyCode == ALT)this.ctrl = true;
    // アクセサリ選択
    if(keyCode == SHIFT) this.shift = true;
    // アイテム選択
    var key =  String.fromCharCode(keyCode).toUpperCase();
    if(key == 'A' && this.player.weapons[0] != null) {
      this.player.weaponIdx = 0;
    } else if(key == 'S' && this.player.weapons[1] != null) {
      this.player.weaponIdx = 1;
    } else if(key == 'D' && this.player.weapons[2] != null) {
      this.player.weaponIdx = 2;
    } else if(key == 'F' && this.player.weapons[3] != null) {
      this.player.weaponIdx = 3;
    }
    if(key == 'Z') this.zKey = true;
    if(key == 'X') this.xKey = true;
    // 方向キー
    if(     keyCode == UP_ARROW    ) this.up    = true;
    else if(keyCode == DOWN_ARROW  ) this.down  = true;
    else if(keyCode == LEFT_ARROW  ) this.left  = true;
    else if(keyCode == RIGHT_ARROW ) this.right = true;

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
  },
  // タイル移動Sequence
  seqTileMove: function(st) {
    var state = st;
    var nextdx = 0;
    return {
      init:function(param) {
        nextdx = state.dx - GameState.tileWidth * state.scrollSpeed;
        return null;
      },
      update:function() {

        state.dx -=GameState.tileWidth * state.scrollSpeed / 1;
        if(state.dx<=nextdx){
          state.dx = nextdx;
          if(state.dx<=-GameState.tileWidth){
            state.score ++;
            state.dx += GameState.tileWidth;
            state.player.setPos(state.player.xi-1, state.player.yi);
            state.player.prevXi -= 1;
            if(state.player.xi < 0) {
                state.player.damage(9999);
              }
            for(var i=0;i<state.enemies.length;i++) {
              state.enemies[i].setPos(state.enemies[i].xi-1, state.enemies[i].yi);
              state.enemies[i].prevXi -= 1;
              if(state.enemies[i].xi < 0) {
                state.enemies[i].vanish();
                state.enemies.splice(i, 1);
                i --;
              }
            }
            for(var i=0;i<state.items.length;i++) {
              state.items[i].xi -= 1;
              if(state.items[i].xi < 0) {
                state.items.splice(i, 1);
                i --;
              }
            }
          }
          return {finish:true};
        }
        return {finish:false};
      }
    }
  },
  // 入力Sequence
  seqInput:function(st, acceptKeys) {
    var state = st;
    var itemIdx = -1;
    var startTime = +new Date();
    var xPressed;
    return {
      init:function(param) {
        itemIdx = -1;
        for(var i=0;i<state.items.length;i++) {
          if(state.player.xi == state.items[i].xi && state.player.yi == state.items[i].yi) {
            itemIdx = i;
            var item = state.items[itemIdx];
            switch(item.type) {
              case "life":
                state.player.heal(1);
                state.items.splice(itemIdx, 1);
                playSE("heal");
                return 1;
              case "weapon":
                 for(var j=0;j<state.player.weapons.length;j++) {
                   if(state.player.weapons[j] == null) {
                     state.player.weapons[j] = item.id;
                     state.items.splice(itemIdx, 1);
                     playSE("get");
                     return 1;
                   } else if(state.player.weapons[j] == item.id) {
                     itemIdx = -1;
                     break;
                   }
                 }
                 break;
              case "accessory":
                var accId = state.player.accessory;
                if(accId == null) {
                  state.player.accessory = item.id;
                  state.items.splice(itemIdx, 1);
                  playSE("get");
                  return 1;
                } else if(state.player.accessory == item.id) {
                  itemIdx = -1;
                  break;
                }
                break;

            }
          }
        }
        if(param.resettime !== undefined && param.resettime) {
          startTime = +new Date();
        }
         xPressed = false;
         if(state.xKey) xPressed = true;


        return null;
      },
      update:function() {
        if((new Date() - startTime) > state.thinkTime) return {finish:true, zKey:state.zKey, up:state.up, down:state.down, left:state.left, right:state.right,
            ctrl:state.ctrl, shift:state.shift};
        if(state.player.isBusy()) return {finish:true};

        if(xPressed) {
          if(!state.xKey)xPressed = false;
        }
        if(!xPressed && state.xKey && itemIdx >= 0) {
          xPressed = true;
          var item = state.items[itemIdx];
          switch(item.type) {
            case "weapon":
              var weaponId = state.player.weapons[state.player.weaponIdx];
              state.player.weapons[state.player.weaponIdx] = item.id;
              state.items.splice(itemIdx, 1);
              playSE("get");
              if(weaponId != null) state.addItem("weapon",weaponId, state.player.xi, state.player.yi);
              break;
            case "accessory":
              var accId = state.player.accessory;
              state.player.accessory = item.id;
              state.items.splice(itemIdx, 1);
              playSE("get");
              if(accId != null)state.addItem("accessory",accId, state.player.xi, state.player.yi);
          }
        }

        if(state.zKey || state.up || state.down || state.left || state.right) {
          if(state.ctrl) {
            // 向き変更
            if(     state.up   )state.player.aim = AIM.UP;
            else if(state.down )state.player.aim = AIM.DOWN;
            else if(state.left )state.player.aim = AIM.LEFT;
            else if(state.right)state.player.aim = AIM.RIGHT;

            return {finish:false};
          }
          // if(state.shift) {
          //   // アクセサリ処理
          //   if(!((state.up || state.down) && (state.left || state.right)))return {finish:false};
          // }
          return {finish:true, zKey:state.zKey, up:state.up, down:state.down, left:state.left, right:state.right,
            ctrl:state.ctrl, shift:state.shift};
        }

        return {finish:false};
      },
      draw:function() {
        push();
        var pos = GameState.getCharaPos(state.player.xi, state.player.yi);
        translate(pos[0] + state.dx, pos[1]);
        stroke(0);
        fill(255);
        rect(-40,18, (state.thinkTime - (new Date() - startTime)) / state.thinkTime * 64, 4);
        pop();

        if(state.player.isBusy()) return;
        if(itemIdx < 0) return;
        var item = state.items[itemIdx];
        if(item.type != "weapon" && item.type != "accessory") return;

        switch(item.type) {
          case "weapon":
            var weapon = state.player.getWeapon();
            // 拾った武器の範囲描画
            push();
            translate(state.dx,0);
            var xi = state.player.xi;
            var yi = state.player.yi;
            for(var i=0,len=C.weapons[item.id].actions.length;i<len;i++) {
              var act = C.weapons[item.id].actions[i];
              switch(act.type) {
                case "attack":
                  GameState.drawRange(xi, yi, act.range ,[0,0,0,0], [0,0,255,180], -4, act.penetrate !== undefined ? act.penetrate : true);
                  break;
                case "move":
                  GameState.drawMoveDist(xi, yi, [[act.vel[0], act.vel[1]]], act.jump ,[0,0,0,0],  [0,0,255,180], -4);
                  xi += act.vel[0];
                  yi += act.vel[1];
                  break;
                case "summon":
                  GameState.drawSummonRange(xi, yi, act.range ,[0,0,0,0], [0,0,255,180], -4);
                  break;
              }
            }
            pop();
            // 拾う武器の説明表示
            GameState.drawWeaponInfo(C.weapons[item.id], 190, 450+80-4, [140,140,255,255]);
            break;
          case "accessory":
            // 現在のアクセサリ対象範囲描画
            push();
            translate(state.dx,0);
            // 拾ったアクセサリの範囲描画
            if(C.accessories[item.id].type == "move") {
              GameState.drawMoveDist(state.player.xi, state.player.yi, C.accessories[item.id].dest, C.accessories[item.id].jump, [0,0,0,0], [0,0,255,220]);
            } else if(C.accessories[item.id].type == "guard") {
              GameState.drawGuardRange(state.player.xi, state.player.yi,  C.accessories[item.id].range, [0,0,0,0], [0,0,255,220]);
            }
            pop();

            // 拾うアクセサリの説明表示
            GameState.drawAccessoryInfo(C.accessories[item.id], 190, 450+80+40-4, [140,140,255,255]);
            break;
        }
        // 選択ウインドウ表示
        push();
        var pos = GameState.getCharaPos(state.player.xi, state.player.yi);
        translate(pos[0]+state.dx, pos[1]-68);
        fill(255);
        stroke(0);
        strokeWeight(1);
        rectRounded(-36, 0, 72,22,8);
        noStroke();
        fill(0);
        textAlign(CENTER);
        strokeWeight(1);
        textSize(16);
        text("X:取得", 0,18);
        pop();
      }
    };
  },
  // プレイヤー動作Sequence
  seqPlayerAction:function(st) {
    var state = st;

    var frameCount;
    var frameNum = 1;
    var attack   = false;
    return {

      init:function(param) {
        attack = false;
        frameCount = 0;
        if(param !== undefined) {
          if(param.zKey) {
            var weapon = state.player.getWeapon();
            if(weapon != null) {
              state.player.setAction(weapon);
            }
            return null;
          }
          var jump = false;
          if(param.shift) {
            var acc = C.accessories[state.player.accessory];
            if(acc != null && acc.type == "move" && acc.jump !== undefined) {
              jump = acc.jump;
            }
          }
          var vel = this.getVel(param);
          if(vel == null) return -1;
          if((vel[0] != 0 || vel[1] != 0) ) {
            var v  = [0,0];
            var dist = Math.max(Math.abs(vel[0]), Math.abs(vel[1]));
            for(var i=1;i<=dist;i++) {
              if(Math.abs(vel[0]) > Math.abs(vel[1])) {
                if(vel[0] > 0) v = [ i, vel[1] * i / dist];
                else           v = [-i, vel[1] * i / dist];
              } else {
                if(vel[1] > 0) v = [vel[0] * i / dist,  i];
                else           v = [vel[0] * i / dist, -i];
              }
              if(state.validPos(state.player.xi + v[0],  state.player.yi + v[1])) {
                state.player.setAction({"actions":[{"type":"move","vel":vel, "jump":jump}]});
                return null;
              }
            }
            // 入力Seqに戻る
            return -1;
          }
          state.player.setAction({"actions":[{"type":"move","vel":vel, "jump":jump}]});
          return null;
        }
        state.player.setAction({"actions":[{"type":"move","vel":[0,0], "jump":jump}]});
        return null;
      },
      getVel : function(param) {
        if(param.up === undefined) return [0,0];
        var dest = [[-1,0],[1,0],[0,-1],[0,1]];
        if(param.shift) {
          var acc = C.accessories[state.player.accessory];
          if(acc != null && acc.type == "move") {
            dest = acc.dest;
          }
        }

        // 八方向の入力と移動先の対応付け
        var destMap = {};
        for(var i=0;i<dest.length;i++) {
          var aim = 5;
          if(     dest[i][0] < 0) aim --;
          else if(dest[i][0] > 0) aim ++;
          if(     dest[i][1] < 0) aim += 3;
          else if(dest[i][1] > 0) aim -= 3;
          destMap[aim] = dest[i];
        }
        // マップに無い方向キーの場合、nullを返す
        var aim = 5;
        if(     param.left   ) aim --;
        else if(param.right  ) aim ++;
        if(     param.up     ) aim += 3;
        else if(param.down   ) aim -= 3;
        if(aim == 5) return [0,0];
        if(destMap[aim] === undefined) return null;
        return destMap[aim];
      },
      update:function() {
        state.player.update();
        return {finish:true};
      }
    }
  },
  // 敵動作Sequence
  seqEnemyAction:function(st) {
    var state = st;
    return {
      init:function(param) {
        for(var i=0;i<state.enemies.length;i++) {
          if(!state.enemies[i].fixed) {
            state.enemies[i].updateAction();
          }
        }
        return null;
      },
      update:function() {
        for(var i=0;i<state.enemies.length;i++) {
          state.enemies[i].update();
        }
        // 左端以降に移動した敵を消去
        for(var i=0;i<state.enemies.length;i++) {
          if(state.enemies[i].xi < 0) {
            state.enemies[i].vanish();
            state.enemies.splice(i, 1);
            i --;
          }
        }
        return {finish:true};
      }
    }
  },
  // 敵追加Sequence
  seqAddEnemy:function(st) {
    var state = st;
    var count = 0;
    return {
      init:function(param) {
        return null;
      },
      update:function() {
        state.stage.update();
        return {finish:true, resettime:true};
      }
    }
  },
  // タイル描画処理
  drawTile: function() {
    push();
    shearX(GameState.tileAngle * PI / 180.0)
    for(var xi=-2;xi<14;xi++) {
      for(var yi=0;yi<7;yi++) {
        if(xi<0 || xi >= 12) tint(122);
        else tint(255);
        var pos = GameState.getTilePos(xi, yi);
        copy(this.tile,0,0,32,32,pos[0], pos[1], GameState.tileWidth-2, GameState.tileHeight-2);
        if(xi<0 || xi >= 12) {
          noStroke();
          fill(0,0,0,122);
          rect(pos[0], pos[1], GameState.tileWidth-2, GameState.tileHeight-2);
        }
      }
    }
    pop();
  },
  // 座標の移動可能チェック
  validPos : function(xi, yi) {
    if(xi <  0 ) return false;
    if(xi >  (GameState.tileCol-2)) return false;
    if(yi <  0 ) return false;
    if(yi >  (GameState.tileRow-1) ) return false;
    var charas = this.charaMap[[xi, yi]];
    if(charas !== undefined && charas.length > 0) {
      for(var i=charas.length-1;i>=0;i--) {
        if(!charas[i].through) return false;
      }
    }
    return true;
  },
  // アイテム設置
  addItem : function(type, id, xi, yi) {
    var dx;
    if(xi <=(GameState.tileRow-1)/2) dx = 1;
    else dx = -1;
    var count = 0;
    // 重なっている場合、位置をずらす
    do {
      var valid = true;
      for(var i=0,len= this.items.length;i<len;i++) {
        var item = this.items[i];
        if(item.xi == xi && item.yi == yi) {
          valid = false;
          xi += dx;
          count ++;
          if(count > 3) return;
          break;
        }
      }
    } while(!valid);
    var item = new GameState.Item(this, type, id, xi, yi);
    this.items.push(item);
  },
  // 指定した敵を指定した座標に追加
  addEnemy : function(enemyId, xi, yi, aim, friend) {
    if(xi <  0) xi += GameState.tileCol;
    if(yi <  0) yi += GameState.tileCol;
    if(yi >= GameState.tileCol) yi -= GameState.tileCol;

    var EnemyDef = GameState.getEnemyDef(enemyId);
    var enemy = new EnemyDef();
    enemy.setup(this, xi, yi);
    if(friend !== undefined)enemy.friend = friend;
    if(aim    !== undefined)enemy.aim    = aim;

    if(!enemy.through) {
      // 敵が重なった場合、追加しない
      for(var i=this.enemies.length-1;i>=0;i--) {
        var ene = this.enemies[i];
        if(ene.xi == xi && ene.yi == yi) {
          enemy.vanish();
          return;
        }
      }
    }

    this.enemies.push(enemy);
  }
};

//
// アイテム
//

GameState.Item = function(st, type, id, xi, yi) {
  this.state = st;
  this.type = type;
  this.id = id;
  this.xi = xi;
  this.yi = yi;
  this.count = 0;
}

GameState.Item.prototype = {
  draw: function(st) {
    state = st;
    var pos = GameState.getCharaPos(this.xi, this.yi);

    push();
    translate(pos[0]-6, pos[1]-6);

    scale(1.2);
    // 影
    ellipseMode(CENTER);
    noStroke();
    fill(0,0,0,120);
    ellipse( 0, 10, 32,12)

    // アイコン
    imageMode(CENTER);
    if(this.count < 8) {
      translate(0,-sin((0.5 - this.count / 16) * PI) * 20);
    }
    tint(300);

    if(this.type == "life") {
      image(iconImage(223), 0, 0);
    } else if(this.type == "weapon") {
      image(iconImage(C.weapons[this.id].icon), 0, 0);
    } else if(this.type == "accessory") {
      image(iconImage(C.accessories[this.id].icon), 0, 0);
    }
    pop();

    this.count++;
  }
};
