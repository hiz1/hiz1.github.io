


//
// 木
//
GameState.Tree = function() {
  this.img = imageCache("assets/charactors/tree.png");
};
extend(GameState.Tree, GameState.Enemy);
GameState.addEnemyDef(GameState.Tree, "tree");

GameState.Tree.prototype.setup = function(state, xi, yi) {
  GameState.Enemy.prototype.setup.call(this, state, xi, yi, true);
  this.maxHp     = 5;
  this.hp        = this.maxHp;
};

//
// スケルトン
//
GameState.Skelton = function() {
  this.img = imageCache("assets/charactors/mon_032.png");
};
extend(GameState.Skelton, GameState.Enemy);
GameState.addEnemyDef(GameState.Skelton, "skelton");

GameState.Skelton.prototype.setup = function(state, xi, yi) {
  GameState.Enemy.prototype.setup.call(this, state, xi, yi, false);
  this.maxHp     = 2;
  this.hp        = this.maxHp;
  this.power     = 1;
  this.range     = [[1,0],[1,-1],[1,1],[0,1],[0,-1]];
  this.drop      = {"bow" : 10, "shield":10};
  this.anim      = "slash";
  this.score     = 10;
};

GameState.Skelton.prototype.initAction = function(self) {
  this.action    =  this.randomAction([
    {"rate"  :20, "action":function(tgt) { return self.moveForward([ 0,-1]) }},
    {"rate"  :20, "action":function(tgt) { return self.moveForward([ 0, 1]) }},
    {"rate"  :20, "action":function(tgt) { return self.moveForward([-1, 0])}},
    {"rate"  :20, "action":function(tgt) { return {"type":"attack",
          "power":1,
          "wait":2,
          "busy":0,
          "cancel":false,
          "range":self.range,
          "anim":self.anim,
          "knockback":1
        }
      }
    }
  ]);
}

// GameState.Skelton.prototype.guardInfo = function() {
//   return {
//     "range":[[1,0]],
//     "rate":50,
//     "knockback":0,
//     "noknockback":true,
//     "nostan":true
//   };
// }

//
// スライム
//
GameState.Slime = function() {
  this.img = imageCache("assets/charactors/mon_002.png");
};
extend(GameState.Slime, GameState.Enemy);
GameState.addEnemyDef(GameState.Slime, "slime");

GameState.Slime.prototype.setup = function(state, xi, yi) {
  GameState.Enemy.prototype.setup.call(this, state, xi, yi, false);
  this.maxHp     = 1;
  this.hp        = this.maxHp;
  this.power     = 1;
  this.range     = [[1,0]];
  this.drop      = {"backshoes":5, "slime":5};
  this.anim      = "punch";
  this.score     = 1;
};

GameState.Slime.prototype.initAction = function(self) {
  this.action = this.randomAction([
    {
      "rate"  :20, "action":function(tgt) { return self.moveForward([1, 0],1); }
    },
    {
      "rate"  :20, "action":function(tgt) {
        return {
          "type":"attack", "power":1, "wait":1, "busy":1,
          "cancel":true, "range":self.range, "anim":self.anim
        }
      }
    }
  ]);
}

//
// 猿
//
GameState.Ape = function() {
  this.img = imageCache("assets/charactors/mon_008.png");
};
extend(GameState.Ape, GameState.Enemy);
GameState.addEnemyDef(GameState.Ape, "ape");

GameState.Ape.prototype.setup = function(state, xi, yi) {
  GameState.Enemy.prototype.setup.call(this, state, xi, yi, false);
  this.maxHp     = 2;
  this.hp        = this.maxHp;
  this.power     = 1;
  this.range     = [[1,0],[1,-1],[1,1],[0,-1],[0,1],[-1,0],[-1,-1],[-1,1]];
  this.drop      = {"hummer" : 10, "scythe" : 10};
  this.anim      = "punch";
  this.score     = 5;
};

GameState.Ape.prototype.initAction = function(self) {
  this.action =  function(tgt) {
    self.aimToTarget(tgt);
    if(Math.abs(self.xi - tgt.xi) <= 1 && Math.abs(self.yi - tgt.yi) <= 1) {
      return {
        "type":"attack", "range":[[1,0],[1,-1],[1,1]],
        "power":1, "anim":self.anim, "knockback":0,
        "wait":1,"cancel":true};
    } else return self.moveForward([1,0]);
    return  {"type":"move","vel":[0,0]};
  }
}

//
// ゴースト
//
GameState.Ghost = function() {
  this.img = imageCache("assets/charactors/mon_084.png");
};
extend(GameState.Ghost, GameState.Enemy);
GameState.addEnemyDef(GameState.Ghost, "ghost");

GameState.Ghost.prototype.setup = function(state, xi, yi) {
  GameState.Enemy.prototype.setup.call(this, state, xi, yi, false);
  this.maxHp     = 2;
  this.hp        = this.maxHp;
  this.power     = 1;
  this.range     = [[1,0],[1,-1],[1,1],[0,-1],[0,1],[-1,0],[-1,-1],[-1,1]];
  this.drop      = {"scythe" : 15, "mirage": 15};
  this.anim      = "ice";
  this.through   = true;
  this.score     = 10;
};

GameState.Ghost.prototype.initAction = function(self) {
  this.action =  function(tgt) {
    self.aimToTarget(tgt);
    if(Math.abs(self.xi - tgt.xi) <= 0 && Math.abs(self.yi - tgt.yi) <= 0) {
      return {
        "type":"attack", "range":[[0,0]],
        "power":2, "anim":self.anim, "knockback":0,
        "wait":1,"cancel":false};
    } else return self.moveForward([1,0], 1);
    return  {"type":"move","vel":[0,0]};
  }
}

GameState.Wiz = function() {

  this.img = imageCache("assets/charactors/mon_247.png");
};
extend(GameState.Wiz, GameState.Enemy);
GameState.addEnemyDef(GameState.Wiz, "wiz");

GameState.Wiz.prototype.setup = function(state, xi, yi) {
  GameState.Enemy.prototype.setup.call(this, state, xi, yi, false);
  this.maxHp     = 2;
  this.hp        = this.maxHp;
  this.power     = 3;
  this.range     = [
      [-1,0],
      [ 0,0],[0,1],[0,-1],
      [1,0]
  ];
  this.drop      = {
    "fire" : 30, "wall" :20
  };
  this.anim      = "ice";
  this.score     = 20;
};

GameState.Wiz.prototype.initAction = function(self) {
  // 魔法
  var ice = function(tgt) {
    var dpos = relativePos(tgt, self);
    var range = movedRange([[0,0]], [-dpos[0], dpos[1]]);
    return {"type":"summon", "id":"ice_ball_mini",
     "wait":2, "busy":1, "cancel":false, "range":range};
  };
  var summon = function(tgt) {
    return {"type":"summon", "id":"slime",
     "wait":2, "busy":1, "cancel":true, "range":[[1,0], [-1,0], [0,1], [0,-1]]};
  };

  var back = function(tgt) {
    return {"type":"move","vel":[1,0], "wait":0};
  };

  this.action = this.seqAction([
    back,
    back,
    ice,
    back,
    back,
    back,
    summon
  ]);

}

GameState.Dragon = function() {

  this.img = imageCache("assets/charactors/mon_258.png");
};
extend(GameState.Dragon, GameState.Enemy);
GameState.addEnemyDef(GameState.Dragon, "dragon");

GameState.Dragon.prototype.setup = function(state, xi, yi) {
  GameState.Enemy.prototype.setup.call(this, state, xi, yi, false);
  this.maxHp     = 5;
  this.hp        = this.maxHp;
  this.drop      = {
    "greatsword" : 100
  };
  this.score     = 100;
};

GameState.Dragon.prototype.initAction = function(self) {
  var darkBall = function(tgt) {
    var range = [];
    for(var i=0;i<3;i++) {
      range.push([Math.floor(self.xi - random(GameState.tileCol)) , Math.floor(random(GameState.tileRow)) - self.yi]);
    }
    // range = movedRange(range, [-self.xi, -self.yi])
    return {"type":"summon", "id":"ice_ball",
     "wait":0, "busy":0, "cancel":false, "range":range};
  };
  var back = function(tgt) {
    return {"wait":0, "busy":0, "cancel":false,
      "actions": [{"type":"attack", "power":3, "range":[[-1,0],[-1,1],[-1,-1]], "anim":"punch",
        "canGuard":true, "penetrate":true},
        {"type":"move","vel":[1,0]}
    ]};
  };
  var move = this.randomAction([
    {
      "rate": 50, "action":function(tgt) {return {"type":"move","vel":[0,-1]} }
    },
    {
      "rate": 50, "action":function(tgt) {return {"type":"move","vel":[0,1]} }
    }
  ]);
  var attack = function(tgt) {
    var range = [];
    for(var xi=1;xi<=20;xi++) {
      range.push([xi, 0]);
    }
    return {"wait":3, "busy":0, "cancel":false,
      "actions": [{"type":"attack", "power":3, "range":range, "anim":"freeze",
        "canGuard":false, "penetrate":false},
        {"type":"attack", "power":3, "range":movedRange(range, [0,-1]), "anim":"freeze",
        "canGuard":false, "penetrate":false},
        {"type":"attack", "power":3, "range":movedRange(range, [0, 1]), "anim":"freeze",
        "canGuard":false, "penetrate":false}
      ]};
  };

  this.action = this.seqAction([darkBall, back, back, move, attack]);
}

//
// アイスボール（大）
//
GameState.IceBall = function() {
  this.img = imageCache("assets/charactors/ice_ball.png");
};
extend(GameState.IceBall, GameState.Enemy);
GameState.addEnemyDef(GameState.IceBall, "ice_ball");

GameState.IceBall.prototype.setup = function(state, xi, yi) {
  GameState.Enemy.prototype.setup.call(this, state, xi, yi, false);
  this.maxHp     = 1;
  this.hp        = this.maxHp;
  this.through   = true;
  this.invinsible= true;
  this.range     = [
    [1,0],[1,1],[1,-1],
    [0,0],[0,1],[0,-1],
    [-1,0],[-1,1],[-1,-1],
    ];
};

GameState.IceBall.prototype.initAction = function(self) {
  var attack =  function(tgt) {
    return {"wait":4,"busy":0,
    "actions":[{
      "type":"attack", "power":3,
      "range":self.range,
      "anim":"freeze",
      "canGuard":false
    },
      {"type":"vanish"}
    ]};
  };
  this.action = this.seqAction([attack]);
}

//
// アイスボール（小）
//
GameState.IceBallMini = function() {
  this.img = imageCache("assets/charactors/ice_ball_mini.png");
};
extend(GameState.IceBallMini, GameState.Enemy);
GameState.addEnemyDef(GameState.IceBallMini, "ice_ball_mini");

GameState.IceBallMini.prototype.setup = function(state, xi, yi) {
  GameState.Enemy.prototype.setup.call(this, state, xi, yi, false);
  this.maxHp     = 1;
  this.hp        = this.maxHp;
  this.through   = true;
  this.invinsible= true;
  this.range     = [
    [1,0],
    [0,0],[0,1],[0,-1],
    [-1,0],
    ];
};

GameState.IceBallMini.prototype.initAction = function(self) {
  var attack =  function(tgt) {
    return {"wait":2,"busy":0,
      "actions":[{
        "type":"attack", "power":2,
        "range":self.range,
        "anim":"ice",
        "canGuard":false},
      {"type":"vanish"}
    ]};
  };
  var vanish = function(tgt) {
    return {"type":"vanish"};
  }
  this.action = this.seqAction([attack, vanish]);
}
