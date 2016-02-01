/*:
 *
 * @plugindesc 会話シーン作成のヘルパープラグイン
 *  @help
 *  
 *  会話シーン作成を楽にするプラグインです。
 *  使用する場合は、img/picturesフォルダにサイズ816x624の真っ黒な画像Black.pngを用意して下さい。
 *  背景を指定しない場合の会話シーンの背景と、画面下部の黒帯に使用されます。
 *  
 * プラグイン コマンド:
 *   HZTALK INIT height              # ピクチャ表示部分の高さを[height]として、会話シーンを開始します
 *   HZTALK END                      # 会話シーンを終了します
 *   HZTALK SHOWBG bgImage           # img/picturesフォルダ内の[bgImage].pngを背景として表示します
 *   HZTALK CHANGEBG bgImage         # img/picturesフォルダ内の[bgImage].pngを背景に変更します（透明度・着色等は変更しない）
 *   HZTALK ADD id image x [turnFlg] # ピクチャ番号を[id]、画像をimg/picturesフォルダ内の[image].png、初期位置をxとして、登場人物のピクチャを追加します。
 *                                   # turnFlgがtrueの場合、画像を左右反転して表示します。ピクチャ番号は3以上を指定して下さい。
 *   HZTALK SELECT id                # ピクチャ番号[id]のピクチャを選択状態として明るく表示します。
 *   HZTALK MOVE id x [duration]     # ピクチャ番号[id]のピクチャをX座標[x]の位置に[duration]フレーム（デフォルトは30フレーム）かけて移動します。
 *   HZTALK TURN id turnFlg          # ピクチャ番号[id]のピクチャをturnFlgがtrueであれば左右反転、そうでなければ本来の向きで表示します。
 *   HZTALK CHANGE id image          # ピクチャ番号[id]のピクチャの画像をimg/picturesフォルダ内の[image]に変更します。
 *      
 *    会話シーン中、以下のピクチャ番号を使用します。
 *      1:マップを隠す黒画面
 *      2:背景ピクチャ
 *      100:画面下部の黒帯ピクチャ
 *    
 *    登場人物のピクチャ番号は、3以上を指定してください。
 */

(function() {
    function cnvEsc(txt) {
        if(txt == null) return txt;
        return Window_Base.prototype.convertEscapeCharacters(txt);
    };
    
    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        if (command.toUpperCase() === 'HZTALK') {
            if(args[0].toUpperCase() === 'INIT') {
                var height = Number(cnvEsc(args[1]));
                HzTalk.init(height);
            } else if(args[0].toUpperCase() === 'END') {
                HzTalk.end();
            } else if(args[0].toUpperCase() === 'SHOWBG') {
                var bgName = cnvEsc(args[1]);
                HzTalk.showBackground(bgName);
            } else if(args[0].toUpperCase() === 'CHANGEBG') {
                var bgName = cnvEsc(args[1]);
                HzTalk.changeBackground(bgName);
            } else if(args[0].toUpperCase() === 'ADD') {
                var id      = Number(cnvEsc(args[1]));
                var imgName = cnvEsc(args[2]);
                var x       = Number(cnvEsc(args[3]));
                var turnFlg = cnvEsc(args[4]) === 'true' ? true : false;
                HzTalk.addCharacter(id, imgName, x, turnFlg);
            } else if(args[0].toUpperCase() === 'SELECT') {
                var id      = Number(cnvEsc(args[1]));
                HzTalk.selectCharacter(id);
            } else if(args[0].toUpperCase() === 'MOVE') {
                var id      = Number(cnvEsc(args[1]));
                var x       = Number(cnvEsc(args[2]));
                var duration= args[3] != null ? Number(cnvEsc(args[3])) : undefined;
                HzTalk.moveCharacter(id, x, duration);
            } else if(args[0].toUpperCase() === 'TURN') {
                var id      = Number(cnvEsc(args[1]));
                var turnFlg = cnvEsc(args[2]) === 'true' ? true : false;
                var duration= args[3] != null ? Number(cnvEsc(args[3])) : undefined;
                HzTalk.turnCharacter(id, turnFlg, duration);
            } else if(args[0].toUpperCase() === 'CHANGE') {
                var id      = Number(cnvEsc(args[1]));
                var imgName = cnvEsc(args[2]);
                HzTalk.changeImage(id, imgName);
            }
        }
    };
    
    Sprite_Picture.prototype.updateOrigin = function() {
        // 会話シーンの登場人物用にorigin=2（中央下）を追加
        var picture = this.picture();
        if (picture.origin() === 0) {
            this.anchor.x = 0;
            this.anchor.y = 0;
        } else if (picture.origin() === 2) {
            // 2:中央下
            this.anchor.x = 0.5;
            this.anchor.y = 1;
        } else {
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }
    };
    
    Game_Picture.prototype.move = function(origin, x, y, scaleX, scaleY,
                                       opacity, blendMode, duration) {
        // ※ origin=2（中央下）の場合、originは変更しない
        if(this._origin !== 2)this._origin = origin;
        this._targetX = x;
        this._targetY = y;
        this._targetScaleX = scaleX;
        this._targetScaleY = scaleY;
        this._targetOpacity = opacity;
        this._blendMode = blendMode;
        this._duration = duration;
    };
})();

function HzTalk() {
}

HzTalk.height = 450;
HzTalk.charas = [];



/**
 * 初期化
 * @param {type} height
 * @returns {undefined}
 */
HzTalk.init = function(height) {
    // 初期化
    HzTalk.height = height;
    HzTalk.charas = [];
    // 黒帯作成
    $gameScreen.showPicture($gameScreen.maxPictures(), "Black",0, 0, height,100,100,255,0);
    $gameScreen.showPicture(1, "Black", 0, 0, 0 ,100,100,255,0);
};

/**
 * 終了処理
 * @returns {undefined}
 */
HzTalk.end = function() {
    // 登場人物削除
    for(var idx=0;idx<HzTalk.charas.length;idx++) {
        $gameScreen.erasePicture(HzTalk.charas[idx]);
    }
    // 背景削除
    $gameScreen.erasePicture(1);
    $gameScreen.erasePicture(2);
    // 黒帯削除
    $gameScreen.erasePicture($gameScreen.maxPictures());
};

/**
 * 背景の設定
 * @param {type} bgName
 * @returns {undefined}
 */
HzTalk.showBackground = function(bgName) {
    $gameScreen.showPicture(2, bgName, 0, 0, 0 ,100,100,255,0);
};

/**
 * 背景画像の変更（着色・透明度・位置などは変更しない）
 * @param {type} bgName
 * @returns {undefined}
 */
HzTalk.changeBackground = function(bgName) {
    $gameScreen.picture(2)._name = bgName;
};

/**
 * 登場人物の追加
 */
HzTalk.addCharacter = function(id, imgName, x, turnFlg) {
    var bitmap = ImageManager.loadPicture(imgName);
    // キャラクタのピクチャ作成
    var scaleX = turnFlg ? -100 : 100;
    $gameScreen.showPicture(id, imgName, 2, x, HzTalk.height ,scaleX,100,255,0);
    $gameScreen.tintPicture(id, [-68,-68,-68,0], 0);
    HzTalk.charas.push(id);
};

/**
 * アクティブな登場人物の選択
 * @param {type} selectedId
 * @returns {undefined}
 */
HzTalk.selectCharacter = function(selectedId) {
    for(var idx=0;idx<HzTalk.charas.length;idx++) {
        var id = HzTalk.charas[idx];
        if(id === selectedId) {
            $gameScreen.tintPicture(id, [0,0,0,0], 10);
        } else {
            $gameScreen.tintPicture(id, [-68,-68,-68,0], 10);
        }
    }
};

/**
 * 登場人物の移動
 * @param {type} selectedId
 * @param {type} x
 * @param {type} duration
 * @returns {undefined}
 */
HzTalk.moveCharacter = function(id, x, duration) {
    if(duration === undefined) duration = 30;
    var picture = $gameScreen.picture(id);
    $gameScreen.movePicture(id, picture.origin(), x, picture.y() ,picture.scaleX(),picture.scaleY(),picture.opacity(),picture.blendMode(),duration);
};

/**
 * 登場人物の回転
 * @param {type} selectedId
 * @param {type} x
 * @param {type} duration
 * @returns {undefined}
 */
HzTalk.turnCharacter = function(id, turnFlg, duration) {
    if(duration === undefined) duration = 10;
    var scaleX = turnFlg ? -100 : 100;
    var picture = $gameScreen.picture(id);
    $gameScreen.movePicture(id, picture.origin(), picture.x(), picture.y() ,scaleX,picture.scaleY(),picture.opacity(),picture.blendMode(),duration);
};

/**
 * 登場人物の画像変更
 * @param {type} id
 * @param {type} imgName
 * @returns {undefined}
 */
HzTalk.changeImage = function(id, imgName) {
    $gameScreen.picture(id)._name = imgName;
};

/**
 * 登場人物の削除
 * @param {type} id
 * @returns {undefined}
 */
HzTalk.eraseCharacter = function(id) {
    $gameScreen.erasePicture(id);
};