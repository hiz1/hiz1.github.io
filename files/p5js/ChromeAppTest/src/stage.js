function Stage(st) {
  this.scrollSpeed = 0.3334;
}

Stage.prototype = {
  setup : function(st) {
    this.state = st;
    this.subRoutines = [];
    this.count = 0;
  },
  // 指定した敵を指定した座標に追加
  addEnemy : function(enemyId, xi, yi) {
    this.state.addEnemy(enemyId, xi, yi);
  },
  // 指定した敵を指定した座標範囲に追加
  addEnemies : function(enemyId, range) {
    for(var i=0,len=range.length;i<len;i++) {
      this.addEnemy(enemyId, range[i][0], range[i][1]);
    }
  },
  // 座標xi, yiを起点として複数フレームに渡る敵出現処理のクロージャを返す
  addEnemyPattern : function(ptn, xi0, yi0) {
    var stage   = this;
    var count   = 0;
    var pattern = ptn;
    var xi      = xi0;
    var yi      = yi0;
    return function() {
      if(count >= pattern.length) return true;
      for(var i=0,len=pattern[count].length;i<len;i++) {
        if(pattern[count][i] != null) {
          stage.addEnemy(pattern[count][i], xi, yi + i);
        }
      }
      count ++;
      return false;
    }
  },
  // 更新処理
  update : function() {
    if(this.state.dx > -GameState.tileWidth * this.state.scrollSpeed) {
      this.count ++;
      // 並列処理
      for(var i=0,len=this.subRoutines.length;i<len;i++) {
        if(this.subRoutines[i]()) {
          this.subRoutines.splice(i, 1);
          if(i<this.subRoutines.length)i--;
        }
      }

      var upd = this.updateImpl();
      if(upd != null) {
        // ステージ毎の更新処理
        var rand = random(100);
        for(var i=0;i<upd.length;i++) {
          var rate = upd[i].rate;
          if(rand < rate) {
            // クロージャを返した場合、以降並列処理
            var sub = upd[i].func();
            if(sub !== undefined && sub != null) this.subRoutines.push(sub);
            break;
          }
          rand -= rate;
        }
      }
    }
  },
  // X座標の乱数値を取得（マイナス値の場合、右から数えた値）
  randX: function(min, max) {
    if(min < 0) min += GameState.tileCol;
    if(max < 0) max += GameState.tileCol;
    return min + Math.floor(random(max - min));
  },
  // Y座標の乱数値を取得（マイナス値の場合、下から数えた値）
  randY : function(min, max) {
    if(min < 0) min += GameState.tileRow;
    if(max < 0) max += GameState.tileRow;
    return min + Math.floor(random(max - min));
  }
}