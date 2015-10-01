//
// 継承
//
function extend(child, _super) {
  function ctor() {this.constructor = child;}
  ctor.prototype = _super.prototype;
  child.prototype = new ctor();
  child.prototype._superclass = _super;
  child.prototype._super = function() {
    this._prevctor = (this._prevctor) ? this.prevctor.prototype._superclass : _super;
    this._prevctor.apply(this, arguments);
  }
}

//
// 画像のキャッシュ
//
var imageCache_cache = {}
function imageCache(imagePath, callback) {
  if(imageCache_cache[imagePath] === undefined) {
    var image = loadImage(imagePath, callback);
    imageCache_cache[imagePath] = loadImage(imagePath, callback);
  }
  return imageCache_cache[imagePath];
}

// アイコン画像取得
function iconImage(iconId) {
  return imageCache("assets/icons/icon"+ ('000' + iconId).slice(-3) +".png");
}

//
// アニメーション
//
var anim_cache =  {}
function getAnimation(imagePath, col, row, interval, range, dpos, radian) {
  var w, h;
  if(radian === undefined || radian == null) radian = 0;
  if(anim_cache[imagePath] === undefined) {
    imageCache(imagePath, function(image){
      anim_cache[imagePath] = image;
    });
  }
  var count = 0;
  return function() {
    if(anim_cache[imagePath] === undefined) return false;
    if(w == undefined) w = anim_cache[imagePath].width / col;
    if(h == undefined) h = anim_cache[imagePath].height / row;
    var idx = Math.floor(count / interval);
    var xi = idx % col;
    var yi = Math.floor(idx / col);

    for(var i=range.length-1;i>=0;i--) {
      var x = range[i][0] + dpos[0];
      var y = range[i][1] + dpos[1];
      if(radian == 0) {
        copy(anim_cache[imagePath], w * xi, h * yi, w, h, x-w/2, y-h/2, w, h);
      } else {
        push();
        translate(x, y);
        rotate(radian);
        translate(-w/2, -h/2);
        copy(anim_cache[imagePath], w * xi, h * yi, w, h, 0, 0, w, h);
        pop();
      }
    }
    count ++;
    if(count >= interval * col * row) return true;
    return false;
  }
}

var seqAnimation_anims = [];
function clearAnimation() {
  seqAnimation_anims = [];
}
function addAnimation(animId, basePos, range, dpos, angle) {
  var anim = C.anims[animId];
  if(anim.dpos !== undefined) {
    dpos[0] += anim.dpos[0];
    dpos[1] += anim.dpos[1];
  }
  if(anim.se !== undefined) playSE(anim.se);
  var radian = 0;
  if(anim.rotate !== undefined && anim.rotate != null && anim.rotate && angle !== undefined) radian = angle * PI / 180.0;
  var posRange = [];
  for(var i=range.length-1;0<=i;i--) {
    posRange.push(GameState.getCharaPos(basePos[0] + range[i][0], basePos[1] + range[i][1]));
  }
  seqAnimation_anims.push(getAnimation("assets/animations/"+anim.file, anim.col, anim.row, anim.interval, posRange, dpos, radian));
}
function drawAnimation() {
  tint(255);
  imageMode(CENTER);
  for(var i=0;i<seqAnimation_anims.length;i++) {
    if(seqAnimation_anims[i]()) {
      seqAnimation_anims.splice(i,1);
      i--;
    }
  }
}

//
// SE管理（効果音が重ならないように調整）
//
var playedSE = {};
function updateSE() {
  playedSE = {};
}
function playSE(seId) {
  if(playedSE[seId] !== undefined) return;
  C.ses[seId].play();
  playedSE[seId] = true;
}

//
// 共通Sequence
//
function seqWait(waitFrame) {
  var count = 0;
  return {
    init:function(param) {
      count = 0;
      return null;
    },
    update:function() {
      count ++;
      if(count > waitFrame) return {finish:true};
      return {finish:false};
    }
  };
}

function seqInput(acceptKeys) {
  return {
    init:function(param) {
      return null;
    },
    update:function() {
      if(keyIsPressed && acceptKeys.indexOf(keyCode) >= 0) {
        return {finish:true, key:keyCode};
      }
      return {finish:false};
    }
  };
}
//
// 描画関数
//
var kappa = 0.55228474983;
function rectRounded(x, y, width, height, radius) {
  beginShape();
  vertex(x + radius        , y);
  vertex(x + width - radius, y);
  bezierVertex(x + width - radius * (1-kappa), y,
               x + width                     , y + radius * (1-kappa),
               x + width                     , y + radius);
  vertex(x + width         , y + height - radius);
  bezierVertex(x + width                     , y + height - radius * (1-kappa),
               x + width - radius * (1-kappa), y + height,
               x + width - radius            , y + height);
  vertex(x + radius        , y + height);
  bezierVertex(x + radius * (1 - kappa)      , y + height,
               x                             , y + height - radius * (1 - kappa),
               x                             , y + height - radius);
  vertex(x                 , y + radius);
  bezierVertex(x                             , y + radius * (1 - kappa),
               x + radius * (1-kappa)        , y,
               x + radius                    , y);

  endShape(CLOSE);
}


//
// コモン関数
//

// 指定キャラクタの相対座標を返す
function relativePos(dst, src) {
  return [dst.xi - src.xi, dst.yi - src.yi];
}

// rangeの全座標をずらす
function movedRange(range, dpos) {
  var moved = [];
  for(var i=0, len=range.length;i<len;i++) {
    moved.push([range[i][0]+dpos[0], range[i][1]+dpos[1]]);
  }
  return moved;
}

// 範囲内チェック
function inRange(xi0, yi0, xi1, yi1, range) {
  for(var i=0;i<range.length;i++) {
    var pos = range[i];
    if(xi0 + pos[0] == xi1 && yi0 + pos[1] == yi1) return true;
  }
  return false;
}
