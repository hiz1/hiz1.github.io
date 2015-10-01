function Stage1() {
  this.bgm = "first";
  this.tile = "assets/t_sand.png";
  this.bg   = "01sougen.jpg";
  this.scrollSpeed = 1 / 5;// + 0.0001;
}

extend(Stage1, Stage);

Stage1.prototype.updateImpl = function(rand){
  var stage = this;

  this.scrollSpeed += 0.001;

  // stage.addEnemy("tree", -1,  0);
  // stage.addEnemy("tree", -1, -1);
  if(this.count > 150 & this.count % 30 == 1) {
    stage.addEnemy("dragon", -1, stage.randY(1, -2));
  }

  if(this.count % 5 == 4) {
      // 林を追加
      return [
        {
          "rate": 100,
          "func": function() {
            var rnd = stage.randY(0, -2);
            if(rnd <= 0) {
              return stage.addEnemyPattern(
                [
                  ["tree", null  ],
                  ["tree", "tree"],
                  ["tree", null  ]
                ],
                -1, rnd
              );
            } else if(rnd >= GameState.tileRow -2) {
              return stage.addEnemyPattern(
                [
                  [null  , "tree"],
                  ["tree", "tree"],
                  [null  , "tree"]
                ],
                -1, rnd
              );
            } else {
              return stage.addEnemyPattern(
                [
                  [null  , "tree", null  ],
                  ["tree", "tree", "tree"],
                  [null  , "tree", null  ]
                ],
                -1, rnd
              );
            }
          }
        }
      ];
  }
  if(this.count > 66 & this.count % 10 == 3) {
    return [
      {
        "rate": 100,
        "func": function() {
          stage.addEnemy("wiz", -1, stage.randY(0, -1));
        }
      }
    ];
  }
  if(this.count > 120 & this.count % 8 == 2) {
    return [
      {
        "rate": 100,
        "func": function() {
          stage.addEnemy("ghost", -1, stage.randY(0, -1));
        }
      }
    ];
  }
  if(this.count > 33 && this.count % 8 == 4) {
    return [
      {
        "rate": 100,
        "func": function() {
          stage.addEnemy("ape", -1, stage.randY(0, -1));
        }
      }
    ];
  }
  if((this.count+1) % Math.floor(Math.max((100 - this.count) / 30, 1)) == 0) {
    return [
      {
        "rate": 30,
        "func": function() {
          stage.addEnemy("skelton", -1, stage.randY(0, -1));
        }
      },
      {
        "rate": 70,
        "func": function() {
          var yi = stage.randY(1, -4);
          stage.addEnemies("slime", [[-1, yi], [-1, yi+1], [-1, yi+2]]);
        }
      },

    ];
  }
  return null;
}