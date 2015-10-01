//
// Charactor
//

GameState.Charactor = function() {
  // this.MAX_MOVEFRAME = 5;
}


GameState.Charactor.MAX_MOVEFRAME = 3;

var AIM = {
  UP:0,DOWN:1,LEFT:2,RIGHT:3
};

GameState.Charactor.prototype = {
  // セットアップ処理
  setup: function(state, fixed) {
    this.state     = state;
    this.fixed     = fixed !== undefined ? fixed : false;
    this.setPos(0,0);
    this.hp        = 0;
    this.act       = null;
    this.actionTurn = 0;
    this.damageFrame = 0;
    this.healFrame   = 0;
    this.aim     = RIGHT;
    this.through   = false; // すり抜け
    this.invinsible= false; // 無敵
    this.friend    = false;
  },
  // 更新処理
  update: function() {
    if(this.fixed          ) return;
    if(this.actionTurn != 0) return;
    if(this.act !== undefined && this.act != null) {
      for(var ai=0,len=this.act.actions.length;ai<len;ai++) {
        var act = this.act.actions[ai];
        switch(act.type) {
          case "move":
            var vel = act.vel.slice(0);
            if(act.aim !== undefined && act.aim) {
              vel = this.rotateRange([vel], this.aim)[0];
            }
            if(act.jump !== undefined && act.jump) {
              // ジャンプ
              var v  = [vel[0],vel[1]];
              var dist = Math.max(Math.abs(vel[0]), Math.abs(vel[1]));
              for(var i=dist;i>=1;i--) {
                if(Math.abs(vel[0]) > Math.abs(vel[1])) {
                  if(vel[0] > 0) v = [ i, vel[1] * i / dist];
                  else           v = [-i, vel[1] * i / dist];
                } else {
                  if(vel[1] > 0) v = [vel[0] * i / dist,  i];
                  else           v = [vel[0] * i / dist, -i];
                }
                if(this.through || this.state.validPos(this.xi + v[0],  this.yi + v[1])) {
                  this.move(v[0], v[1]);
                  break;
                }
              }
            } else {
              // 走る
              var v0 = [0,0];
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
                if(this.through || this.state.validPos(this.xi + v[0],  this.yi + v[1])) {
                  v0 = v;
                } else break;
              }
              this.move(v0[0], v0[1]);
            }
            break;
          case "attack":
            var angle = 0;
            switch(this.aim) {
              case AIM.UP   : angle = -90;break;
              case AIM.DOWN : angle = 90;break;
              case AIM.LEFT : angle = 180;break;
              case AIM.RIGHT: angle =   0;break;
              default: break
            }
            var range = this.attack(act);
            addAnimation(act.anim, [this.xi, this.yi], range, [this.state.dx-GameState.tileWidth * this.state.scrollSpeed, 0], angle);

            break;
          case "summon":
            var range = this.rotateRange(act.range, this.aim);
            addAnimation("summon", [this.xi, this.yi], range, [this.state.dx-GameState.tileWidth * this.state.scrollSpeed, 0]);
            playSE("summon");
            for(var i=range.length-1;0<=i;i--) {
              // if(!this.state.validPos(this.xi + range[i][0], this.yi + range[i][1])) continue;
              this.state.addEnemy(act.id, this.xi + range[i][0], this.yi + range[i][1], this.aim, this.friend);
            }
            break;
          case "vanish":
            // 自分自身を消去
            this.setPos(-1000,0);
            return;
        }
      }
    }
    if(this.xi <  0 ) this.xi = 0;
    if(this.xi >  (GameState.tileCol-1)) this.xi = GameState.tileCol-1;
    if(this.yi <  0 ) this.yi = 0;
    if(this.yi >  (GameState.tileRow-1) ) this.yi = GameState.tileRow-1;
  },
  // 描画処理
  draw : function() {
    var dispXi, dispYi;
    if(this.moveFrame > 0) {
      var maxFrame = GameState.Charactor.MAX_MOVEFRAME;
      dispXi = (this.prevXi * this.moveFrame + this.xi * (maxFrame -this.moveFrame)) / maxFrame;
      dispYi = (this.prevYi * this.moveFrame + this.yi * (maxFrame - this.moveFrame)) / maxFrame;
      // ジャンプ
      dispYi -= (maxFrame * this.moveFrame - this.moveFrame * this.moveFrame) / (maxFrame * maxFrame) / 4 * 3;
      this.moveFrame --;
    } else {
      dispXi = this.xi;
      dispYi = this.yi;
      this.prevXi = this.xi;
      this.prevYi = this.yi;
    }

    push();
    imageMode(CENTER);
    var pos = GameState.getCharaPos(dispXi, dispYi);
    translate(pos[0], pos[1] - this.img.height/2 + GameState.tileHeight / 4);
    if(this.actionTurn > 0) translate(0,4);
    else if(this.act != null && this.act.busy > 0 && this.actionTurn <= 0 && -this.actionTurn < this.act.busy) translate(0,-2);
    if(this.actionTurn > 0) tint(400,255,255);
    else if(this.act != null && this.act.busy > 0 && this.actionTurn <= 0 && -this.actionTurn < this.act.busy ) {
      tint(255, 400, 255);
    } else tint(255);
    if(this.damageFrame > 20) {
      translate(sin((this.damageFrame-20) / 2 * PI) * (this.damageFrame - 20) , 0);
      tint(255+(this.damageFrame-20) * 1000/10,255,255);
    }
    if(!this.friend)scale(-1,1);
    //image(this.img, 0, 0);
    copy(this.img, 0, 0, this.img.width, this.img.height, - this.img.width / 2, - this.img.height/2 , this.img.width, this.img.height)
    pop();

    push();
    var pos = GameState.getCharaPos(dispXi, dispYi);
    translate(pos[0], pos[1]);
    imageMode(CENTER);
    // ウエイト
    if(this.actionTurn > 0) {
      for(var i=this.act.wait-1;i>=0;i--) {
        if(this.act.cancel !== undefined && this.act.cancel) {
          if(this.actionTurn > i) image(imageCache("assets/system/ring_yellow.png"),0,22-i*10);
        } else {
          if(this.actionTurn > i) image(imageCache("assets/system/ring_red.png"),0,22-i*10);
        }
      }
    }
    //ビジー
    if(this.act != null && this.act.busy > 0 && this.actionTurn <= 0 && -this.actionTurn < this.act.busy ) {
      for(var i=this.act.busy-1;i>=0;i--) {
        if(-(this.actionTurn) >= i) image(imageCache("assets/system/ring_green.png"),0,22-i*10);
      }
    }
    pop();

    this.damageFrame --;
    this.healFrame   --;
  },
  // updateで実行するアクションの設定
  setAction: function(action) {
    // 固定物は行動しない
    if(this.fixed) return;
    this.actionTurn --;
    var busy = (this.act != null && this.act.busy !== undefined) ? this.act.busy : 0

    if(this.actionTurn >= -busy) return;
    // if(this.act != null && this.act.force !== undefined && this.act.force && this.actionTurn >= -1) return;
    this.act = action;
    if(this.act.actions === undefined) {
      this.act.actions = [this.act];
    }
    this.actionTurn = 0;
    if(this.act.wait !== undefined) {
      this.actionTurn += this.act.wait;
    }
    if((this.act.type == "attack" || this.act.type == "summon") && this.act.wait > 0) {
      // C.ses["prepare"].setVolume(0.2);
      playSE("prepare");
    }
  },
  // 回復処理
  heal : function(amount) {
    // 固定物は回復しない
    if(this.fixed) return;
    if(this.hp < this.maxHp && amount !=  0)this.healFrame = 10;
    this.hp += amount;
    if(this.hp >= this.maxHp) {
      this.hp = this.maxHp;
    }
  },
  // ダメージ処理
  damage : function(amount, impact, aim, knockback, canGuard) {
    // 無敵の場合、ダメージ処理スキップ
    if(this.invinsible) return;

    if(canGuard === undefined) canGuard = true;

    // 防御処理
    var guard = null;
    var tempGuard = this.guardInfo();
    if(tempGuard != null && aim != null) {
      var range = this.rotateRange(tempGuard.range, this.aim);
      for(var i=0,len=range.length;i<len;i++) {
        if(range[i][0] == -aim[0] && range[i][1] == -aim[1]) {
          guard = tempGuard;
          break;
        }
      }
    }

    if(guard != null && canGuard) {
      amount *= guard.rate / 100;
      if(guard.knockback > 0) {
        var kbDist = null;
        if(Math.abs(aim[0]) < Math.abs(aim[1])) {
          if(aim[1] < 0)kbDist = [0,-guard.knockback];
          else          kbDist = [0, guard.knockback];
        } else {
          if(aim[0]< 0)kbDist = [-guard.knockback,0];
          else         kbDist = [ guard.knockback,0];
        }
        knockback = kbDist;
      }
    }

    this.hp -= amount;
    if(this.hp < 0) this.hp = 0;
    if(this.hp <= 0) {
      this.destroy();
      return true;
    }

    if(amount > 0)this.damageFrame = 30;

    // 固定物の処理はここまで
    if(this.fixed) return;

    // 行動キャンセル
    if(this.act != null && this.act.cancel !== undefined && this.act.cancel && this.actionTurn >= 0) {
      this.act       = null;
      this.actionTurn = 0;
    }
    // 衝撃ダメージ
    if(!(guard != null && guard.nostan && canGuard) && (impact !== undefined && impact != null && impact > 0)) {
      this.act = {"actions":[{"type":"move","vel":[0,0], wait:impact, busy:0}]};
      this.actionTurn = impact;
    }
    // 吹き飛ばし
    if(!(guard != null && guard.noknockback && canGuard) && (knockback !== undefined && knockback != null)) {
      this.act = {"actions":[{"type":"move","vel":knockback, wait:1, busy:0}]};
      this.actionTurn = 1;
    }

    return false;
  },
  // 消滅処理
  vanish:function() {
    var charas = this.state.charaMap[[this.xi,this.yi]];
    for(var i=charas.length-1;i>=0;i--) {
      if(charas[i] === this) {
        charas.splice(i, 1);
        break;
      }
    }
  },
  // 死亡時処理
  destroy : function() {
    this.vanish();
  },
  // 攻撃後の隙状態か否か
  isBusy : function() {
    var busy = (this.act != null && this.act.busy !== undefined) ? this.act.busy : 0;
    if(this.actionTurn > -busy) {
      return true;
    }
    return false;
  },
  // 位置の設定（アニメーションなし）
  setPos : function(xi, yi) {
    var charas = this.state.charaMap[[this.xi,this.yi]];
    if(charas !== undefined) {
      for(var i=charas.length-1;i>=0;i--) {
        if(charas[i] === this) {
          charas.splice(i, 1);
          break;
        }
      }
    }
    this.xi        = xi;
    this.yi        = yi;
    if(this.state.charaMap[[this.xi,this.yi]] === undefined) {
      this.state.charaMap[[this.xi,this.yi]] = [];
    }
    this.state.charaMap[[this.xi,this.yi]].push(this);

    this.prevXi    = xi;
    this.prevYi    = yi;
    this.moveFrame = 0;
  },
  // 移動（アニメーションあり）
  move : function(dxi, dyi) {
    var charas = this.state.charaMap[[this.xi,this.yi]];
    if(charas !== undefined) {
      for(var i=charas.length-1;i>=0;i--) {
        if(charas[i] === this) {
          charas.splice(i, 1);
          break;
        }
      }
    }
    this.xi       += dxi;
    this.yi       += dyi;
    if(this.state.charaMap[[this.xi,this.yi]] === undefined) {
      this.state.charaMap[[this.xi,this.yi]] = [];
    }
    this.state.charaMap[[this.xi,this.yi]].push(this);
    this.moveFrame = GameState.Charactor.MAX_MOVEFRAME;
  },

  rotateRange:function(range0, aim) {
    var range = range0.slice(0);
    if(aim == AIM.RIGHT) return range;
    if(aim == AIM.LEFT) {
      for(var i=0;i<range.length;i++) {
        range[i] = [-range[i][0], range[i][1]];
      }
      return range;
    }
    if(aim == AIM.UP) {
      for(var i=0;i<range.length;i++) {
        range[i] = [range[i][1], -range[i][0]];
      }
      return range;
    }
    if(aim == AIM.DOWN) {
      for(var i=0;i<range.length;i++) {
        range[i] = [-range[i][1], range[i][0]];
      }
      return range;
    }
    return range;
  },
  // 攻撃処理
  attack:function(act) {
    var range = this.rotateRange(act.range, this.aim);
    for(var ri=0,len=range.length;ri<len;ri++) {
      var charas = this.state.charaMap[[this.xi + range[ri][0], this.yi + range[ri][1]]];
      if(charas === undefined || charas.length == 0)continue;
      var through = true;
      for(var i=0;i<charas.length;i++) {
        if(this.friend) {
          // 敵陣営のみ攻撃
          if(!charas[i].fixed &&  charas[i].friend) continue;
        } else {
          // 味方陣営のみ攻撃
          if(!charas[i].fixed && !charas[i].friend) continue;
        }
        var target = charas[i];
        var dx = target.xi - this.xi;
        var dy = target.yi - this.yi;
        var aim = [dx != 0 ? dx / Math.abs(dx) : 0, dy != 0 ? dy / Math.abs(dy) : 0];
        var kbDist = null;
        if(act.knockback !== undefined && act.knockback > 0) {
          if(Math.abs(dx) < Math.abs(dy)) {
            if(dy < 0)kbDist = [0,-act.knockback];
            else      kbDist = [0, act.knockback];
          } else {
            if(dx < 0)kbDist = [-act.knockback,0];
            else      kbDist = [ act.knockback,0];
          }
        }
        if(target.damage(act.power, act.impact !== undefined ? act.impact : 0, aim, kbDist, act.canGuard))i --;
        if(!target.through)through = false;
      }
      // 貫通しない攻撃・かつ対象がすり抜けでない場合、当たった時点で判定を終了
      if(act.penetrate !== undefined && !act.penetrate && !through) return range.slice(0, ri+1);
    }
    return range;
  },
  // 防御情報
  guardInfo : function() {
    return null;
    // {
    //   "range"     : [],
    //   "rate"      : 100,
    //   "knockback" : 0,
    //   "noknockack":true,
    //   "nonstan":true
    // };
  }
};


//
// Player
//

GameState.Player = function() {
  this.img = imageCache("assets/charactors/mon_042.png");
};

// PlayerはCharactorを継承
extend(GameState.Player, GameState.Charactor);

// セットアップ処理
GameState.Player.prototype.setup =  function(state, status) {
  GameState.Charactor.prototype.setup.call(this, state, 0, 0);
  this.setPos(3,3);
  this.maxHp     = status.hp;
  this.hp        = status.hp;
  this.weapons   = status.weapons;
  this.weaponIdx = 0;
  this.accessory = status.accessory;
  this.aim       = AIM.RIGHT;
  this.friend    = true
};

// ステータス描画
GameState.Player.prototype.drawStatus = function (x, y) {
  noStroke();
  rectMode(CORNER);
  // fill(0, 0, 0, 122);
  // rect(0, 420, 800, 175);

  push();
  translate(x, y);
  textSize(20);

  stroke(0);
  fill(255);
  rectRounded(-4,-20,150,52, 8);

  // HP
  imageMode(CENTER);
  GameState.textColor();
  text("HP", 0, 4);
  for(var i=this.maxHp-1;i>=0;i--) {
    var x = 48 + (i % 5) * 20;
    var y = Math.floor(i / 5) * 22-4;
    if(i<this.hp     ) {
      if(i<this.hp-0.5) image(iconImage(901), x, y);
      else image(iconImage(903), x, y);
    } else image(iconImage(902), x, y);
  }
  // WEAPON
  GameState.textColor();
  // text("ITEMS", 0, 30);
  GameState.drawItem(C.weapons[this.weapons[0]] , {key:"A"             }, 0  , 46, this.weaponIdx == 0);
  GameState.drawItem(C.weapons[this.weapons[1]] , {key:"S"             }, 35 , 46, this.weaponIdx == 1);
  GameState.drawItem(C.weapons[this.weapons[2]] , {key:"D"             }, 70 , 46, this.weaponIdx == 2);
  GameState.drawItem(C.weapons[this.weapons[3]] , {key:"F"             }, 105, 46, this.weaponIdx == 3);
  GameState.drawItem(C.accessories[this.accessory ] , {key:"Shift", size:8 }, 0, 96, this.accessory != null && C.accessories[this.accessory].type != "guard" && this.state.shift);

  // 説明
  GameState.drawWeaponInfo(this.getWeapon(), 180, -4);
  GameState.drawAccessoryInfo(C.accessories[this.accessory], 180, 78);

  pop();

  // ダメージ時・回復時にプレイヤー位置にライフ表示
  if(this.damageFrame > 0 || this.healFrame > 0) {
    var pos = GameState.getCharaPos(this.xi, this.yi);
    push();
    translate(pos[0] + this.state.dx, pos[1]);

    var hp = Math.ceil(this.hp-1);
    var    life = this.hp;
    var mx = life * 14;

    scale(0.8,0.8);
    tint(255);
    for(var i=Math.ceil(this.maxHp-1);i>=0;i--) {
      mx -= 14;
      if(i<this.hp     ) {
        if(i<life-0.5) image(iconImage(901), -30+mx, 2);
        else image(iconImage(903), -30+mx, 2);
      } else image(iconImage(902), -30+mx, 2);
    }
    pop();
  }


};

// 攻撃範囲表示
GameState.Player.prototype.drawRange = function() {
  // 攻撃範囲描画
  if(this.weapons[this.weaponIdx] != null) {
    var weapon = C.weapons[this.weapons[this.weaponIdx]];
    var color = [255,0,0,122];
    if(weapon.cancel !== undefined && weapon.cancel) color = [190,190,0,122];

    var xi = this.xi;
    var yi = this.yi;
    for(var i=0,len=weapon.actions.length;i<len;i++) {
      var act = weapon.actions[i];
      switch(act.type) {
      case "attack":
        var color = [255,0,0,60];
        if(act.cancel !== undefined && act.cancel) color = [190,190,0,60];
        GameState.drawRange(xi, yi, this.rotateRange(act.range, this.aim) ,color, [0,0,255,180], 0, act.penetrate !== undefined ? act.penetrate : true);
        break;
      case "move":
        var vel = [[act.vel[0], act.vel[1]]];
        if(act.aim !== undefined && act.aim) {
          vel = this.rotateRange(vel, this.aim)
        }
        GameState.drawMoveDist(xi, yi, vel, act.jump, [0,190,190,60], [0,0,255,180], -4);
        xi += vel[0][0];
        yi += vel[0][1];
        break;
      case "summon":
        GameState.drawSummonRange(xi, yi, this.rotateRange(act.range, this.aim) ,[190,0,190,60], [0,0,255,180], -4);
        break;
      }
    }
  }

  // アクセサリ対象範囲描画
  var acc = C.accessories[this.accessory];
  if(acc != null) {
    if(acc.type == "move") {
      if(this.state.shift) GameState.drawMoveDist(this.xi, this.yi, acc.dest, acc.jump, [0,190,190,122], [0,0,255,180]);
    }
    if(acc.type == "guard") {
      // 防御範囲と分かるように表示
      GameState.drawGuardRange(this.xi, this.yi, this.rotateRange(acc.range, this.aim), [0,255,0,180], [0,0,255,220]);
    }
  }
};

// 選択中の武器取得
GameState.Player.prototype.getWeapon = function() {
  if(this.weapons[this.weaponIdx] == null) return null;
  return C.weapons[this.weapons[this.weaponIdx]];
};

// 防御情報
GameState.Player.prototype.guardInfo = function() {
  if(this.accessory == null || C.accessories[this.accessory].type != "guard") return null;
  return C.accessories[this.accessory];
};

//
// Enemy
//

// 敵IDと敵クラスの対応付け
GameState.EnemyDefs = {};
GameState.addEnemyDef = function(ene, id) {
  GameState.EnemyDefs[id] = ene;
};
GameState.getEnemyDef = function(id) {
  return GameState.EnemyDefs[id];
};

GameState.Enemy = function() {
};

// EnemyはCharactorを継承
extend(GameState.Enemy, GameState.Charactor);

// セットアップ処理
GameState.Enemy.prototype.setup = function(state, xi, yi, fixed) {
  GameState.Charactor.prototype.setup.call(this, state, fixed);
  this.setPos(xi,yi);
  this.power     = 0;
  this.reverse   = !fixed;
  this.aim       = AIM.LEFT;
  this.anim      = "slash";
  this.cnt       = 0;
  this.friend    = false;
  this.score     = 0;

  this.initAction(this);
};

// 行動の更新処理
GameState.Enemy.prototype.updateAction = function() {
  if(this.fixed) return;
  this.actionTurn --;
  var busy = (this.act != null && this.act.busy !== undefined) ? this.act.busy : 0

  if(this.actionTurn >= -busy) return;

  var minDist = 100;
  var target = this.state.player;
  if(this.friend) {
    // 最も近くの敵
    // TODO:charaMapを使って処理を軽量化
    for(var i=this.state.enemies.length-1;i>=0;i--) {
      var chara = this.state.enemies[i];
      if(!chara.friend && !chara.fixed) {
        var dpos = relativePos(this, chara);
        var dist = Math.abs(dpos[0]) + Math.abs(dpos[1]);
        if(dist < minDist) {
          target = chara;
          minDist = dist;
        }
      }
    }

  } else {
    // 最も近くの味方
    // TODO:charaMapを使って処理を軽量化
    target = this.state.player;
    var dpos = relativePos(this, this.state.player);
    minDist = Math.abs(dpos[0]) + Math.abs(dpos[1]);
    for(var i=this.state.enemies.length-1;i>=0;i--) {
      var chara = this.state.enemies[i];
      if(chara.friend && !chara.fixed) {
        var dpos = relativePos(this, chara);
        var dist = Math.abs(dpos[0]) + Math.abs(dpos[1]);
        if(dist < minDist) {
          target = chara;
          minDist = dist;
        }
      }
    }

  }
  this.setAction(this.action(target));
  this.cnt ++;
}

// ステータス描画
GameState.Enemy.prototype.drawStatus = function () {
  // 小ライフ
  if(this.damageFrame > 0) {
    var pos = GameState.getCharaPos(this.xi, this.yi);
    push();
    translate(pos[0], pos[1]);
    textSize(10);

    // HP
    var hp = Math.ceil(this.hp-1);
    var bigLife = Math.floor(this.hp / 5);
    var    life = this.hp % 5;
    var mx = bigLife * 14 + life * 14;
    scale(1,1);
    if(this.damageFrame > 0) tint(255,255,255,255);
    else tint(255,255,255,140);
    for(var i=Math.ceil(life-1);i>=0;i--) {
      mx -= 14;
      if(i<life-0.5) image(iconImage(901), -30+mx, 2);
      else image(iconImage(903), -30+mx, 2);
    }

    // 大ライフ
    scale(1.6,1.6);
    for(var i=bigLife-1;i>=0;i--) {
      mx -= 14;
      image(iconImage(901), -30+mx, -4);
    }

    pop();
  }
};

// 攻撃範囲表示
GameState.Enemy.prototype.drawRange = function() {
  // 固定物の処理はここまで
  if(this.fixed) return;

  if(this.actionTurn > 0) {
    var xi = this.xi;
    var yi = this.yi;
    var strokeCol, dsize;
    if(this.friend) {
      strokeCol = [0,0,255,180];
      dsize = -4;
    } else {
      strokeCol = [80,0,0,180];
      dsize = 0;
    }
    for(var i=0,len=this.act.actions.length;i<len;i++) {
      var act = this.act.actions[i];
      switch(act.type) {
        case "attack":
          var color = [255,0,0,122];
          if(act.cancel !== undefined && act.cancel) color = [190,190,0,122];
          GameState.drawRange(xi, yi, this.rotateRange(act.range, this.aim) ,color, strokeCol, 4 + dsize, act.penetrate !== undefined ? act.penetrate : true);
          break;
        case "move":
          GameState.drawMoveDist(xi, yi, [[act.vel[0], act.vel[1]]], act.jump,[0,190,190,122], strokeCol, -2 + dsize);
          xi += act.vel[0];
          yi += act.vel[1];
          break;
        case "summon":
          GameState.drawSummonRange(xi, yi, this.rotateRange(act.range, this.aim) ,[190,0,190,122], strokeCol, -2 + dsize);
          break;
      }
    }

  }
  var guardInfo = this.guardInfo();
    if(guardInfo != null) {
      GameState.drawGuardRange(this.xi, this.yi, this.rotateRange(guardInfo.range, this.aim), [0,255,0,180], [80,0,0,220]);
    }
};

// 死亡時処理
GameState.Enemy.prototype.destroy = function() {
  this.vanish();
  // エフェクト
  addAnimation("destroy", [this.xi, this.yi], [[0, 0]], [this.state.dx-GameState.tileWidth * this.state.scrollSpeed, 0]);
  playSE("knockdown");

  // 消滅
  for(var i=0;i<this.state.enemies.length;i++) {
    if(this.state.enemies[i] === this) {
      this.state.enemies.splice(i,1);
      break;
    }
  }

  // スコア加算
  if(!this.friend) this.state.score += this.score;

  // 固定物の処理はここまで
  if(this.fixed) return;

  // アイテムドロップ
  this.state.lifeCount ++;
  if(this.state.lifeCount > 10) {
    this.state.lifeCount -= 10;
    this.state.addItem("life","", this.xi, this.yi);
  } else {
    var rand = random(100);
    var keys = Object.keys(this.drop);
    for(var i=0;i<keys.length;i++) {
      var rate = this.drop[keys[i]];
      if(rand < rate) {
        if(C.weapons[keys[i]] !== undefined) {
          this.state.addItem("weapon",keys[i], this.xi, this.yi);
        } else if(C.accessories[keys[i]] !== undefined) {
          this.state.addItem("accessory",keys[i], this.xi, this.yi);
        }
        break;
      }
      rand -= rate;
    }
  }
};

GameState.Enemy.prototype.initAction = function(self) {
  return function() {
    return {"type":"move","vel":[0,0]};
  }
}

// ランダムでアクションを返す
GameState.Enemy.prototype.randomAction = function(actions) {
  return function(tgt) {
    var rand = random(100);
    for (var i = 0, len = actions.length; i < len; i++) {
      var act = actions[i];
      if(rand < act.rate) {
        return act.action(tgt);
      }
      rand -=  act.rate;
    }
    return {"type":"move","vel":[0,0]};
  }
}

// 順番にアクションを行う
GameState.Enemy.prototype.seqAction = function(actions) {
  var seqCnt = 0;
  return function(tgt) {
    var act = actions[seqCnt % actions.length];
    seqCnt ++;
    if(act == null) return {"type":"move","vel":[0,0]};
    return act(tgt);
  }
}

// 前方に移動する
GameState.Enemy.prototype.moveForward = function(vel0, wait, busy, cancel) {
  var vel = this.rotateRange([vel0], this.aim)[0];
  if(wait   === undefined) wait = 0;
  if(busy   === undefined) busy = 0;
  if(cancel === undefined) cancel = false;
  return {"type":"move","vel":vel, "wait":wait, "busy":busy, "cancel":cancel};
}

// ターゲットの方を向く
GameState.Enemy.prototype.aimToTarget = function(target) {
  var dpos = relativePos(target, this);
  var dx   = dpos[0];
  var dy   = dpos[1];
  if(Math.abs(dx) >= Math.abs(dy)) {
    if(     dx < 0) this.aim = AIM.LEFT;
    else if(dx > 0) this.aim = AIM.RIGHT;
  } else {
    if(     dy < 0) this.aim = AIM.UP;
    else if(dy > 0) this.aim = AIM.DOWN;
  }
}