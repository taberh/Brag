
/**
 *  GameScene.js
 *  Brag
 *
 *  description: 游戏场景
 *
 *  Create by taber on 2012-12-17
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Game Scene
 * @class
 * @extends cc.Scene
 */
var GameScene = cc.Scene.extend({
    
    tablesLayer: null,
    menuLayer: null,
    upperPlayerLayer: null,
    lowerPlayerLayer: null,
    myselfLayer: null,
    coverLayer: null,
    brag: null,

    init: function(venueID, roomID, password) {
        this._super();

        this.venueID = venueID;
        this.roomID = roomID;
        this.password = password;

        this.tablesLayer = TablesLayer.create();
        this.tablesLayer.scene = this;

        this.menuLayer = GameMenu.create();
        this.menuLayer.scene = this;
        this.menuLayer.setAnchorPoint(cc.PointZero());
        this.menuLayer.setPosition(cc.PointZero());

        this.upperPlayerLayer = UpperPlayerLayer.create();
        this.upperPlayerLayer.scene = this;

        this.lowerPlayerLayer = LowerPlayerLayer.create();
        this.lowerPlayerLayer.scene = this;

        this.myselfLayer = MyselfLayer.create();
        this.myselfLayer.scene = this;

        this.coverLayer = CoverLayer.create();
        this.coverLayer.scene = this;

        this.addChild(this.tablesLayer);
        this.addChild(this.upperPlayerLayer);
        this.addChild(this.lowerPlayerLayer);
        this.addChild(this.myselfLayer);
        this.addChild(this.menuLayer);
        this.addChild(this.coverLayer);

        this._setPlayerInfo(this.myselfLayer, App.user);

        this.coverLayer.setOpacity(255);
        this.coverLayer.visibleCancel(true);
        this.coverLayer.setStatus('正在进入房间...');

        this.brag = Brag.getInstance();
        this.brag.scene = this;

        this.enter();
    },

    _setPlayerInfo: function(player, info) {
        player.setAvatar(info.avatar_url);
        player.setNickname(info.nickname);
    },

    _removePlayerInfo: function(player) {
        player.removeAvatar();
        player.setNickname('');
    },

    onReconnect: function() {
    },

    onReconnectFailed: function() {
    },

    onInterrupt: function(result) {
        // alert message
        this.back();
    },

    onEntrance: function(result) {
        if (result.status === 0) {
            if (result.data.pIdx === this.upperPlayerLayer.index) {
                this._setPlayerInfo(this.upperPlayerLayer, result.data.player);
            }
            else {
                this._setPlayerInfo(this.lowerPlayerLayer, result.data.player);
            }
        }
        else {
            // alert error message
        }
    },

    onReady: function(result) {
        if (result.status === 0) {
            if (result.data.pIdx === this.upperPlayerLayer.index) {
                this.upperPlayerLayer.setReady(true);
            }
            else {
                this.lowerPlayerLayer.setReady(true);
            }
        }
        else {
            // alert error message
        }
    },

    onLeave: function(result) {
        if (result.status === 0) {
            if (result.data.pIdx === this.upperPlayerLayer.index) {
                this._removePlayerInfo(this.upperPlayerLayer);
                this.upperPlayerLayer.setReady(false);
            }
            else {
                this._removePlayerInfo(this.lowerPlayerLayer);
                this.lowerPlayerLayer.setReady(false);
            }
        }
        else {
            // alert error message
        }
    },

    onOperate: function(result) {
    },

    selectedCard: function(playerIndex, cardIndex) {
        /*this.brag.operate({
            pIdx: playerIndex,
            cIdx: cardIndex
        }, function(result) {
        });*/
    },

    turnon: function() {
    },

    believe: function() {
    },

    follow: function() {
    },

    enter: function() {
        var _this = this;

        this.brag.enter({
            vid: this.venueID
        }, function(result) {
            _this.coverLayer.hide();

            if (result.status === 0) {
                var myIdx = result.data.pIdx,
                    upIdx = (myIdx + 2) % 3,
                    loIdx = (myIdx + 4) % 3,
                    upPlayer = result.data.players[upIdx],
                    loPlayer = result.data.players[loIdx];

                _this.myselfLayer.index = myIdx;
                _this.upperPlayerLayer.index = upIdx;
                _this.lowerPlayerLayer.index = loIdx;

                if (upPlayer) {
                    _this._setPlayerInfo(_this.upperPlayerLayer, upPlayer);
                }

                if (loPlayer) {
                    _this._setPlayerInfo(_this.lowerPlayerLayer, loPlayer);
                }

                _this.menuLayer.readyButton.setVisible(true);
            }
            else {
                // alert error
            }
        });
    },

    leave: function(reenter) {
        var _this = this;

        this._removePlayerInfo(this.upperPlayerLayer);
        this._removePlayerInfo(this.lowerPlayerLayer);

        this.upperPlayerLayer.setReady(false);
        this.lowerPlayerLayer.setReady(false);
        this.myselfLayer.setReady(false);

        this.menuLayer.readyButton.setVisible(false);

        this.brag.leave(function(result) {
            if (reenter && (result.status === 0 || result.status === 211)) {
                _this.enter();
            }
        });
    },

    ready: function() {
        var _this = this;

        this.brag.ready(function(result) {
            if (result.status === 0) {
                _this.myselfLayer.setReady(true);
            }
            else {
                // alert message
            }
        });
    },

    cancel: function() {
        this.runMainScene();
    },

    back: function() {
        if (this.brag && this.brag.playing) {
            return alert('游戏中，不能退出');
        }

        this.runMainScene();
    },

    switchRoom: function() {
        if (this.brag && !this.brag.playing) {
            this.coverLayer.setStatus('正在切换房间...');
            this.coverLayer.setOpacity(255);
            this.leave(true);
        }
        else {
            alert('正在游戏，不能换桌~.~');
        }
    },

    toggleSound: function() {
    },

    sendFace: function(face) {
    },

    runMainScene: function() {
        var director = cc.Director.getInstance();
        director.replaceScene(MainScene.create());
        this.leave();
    }
});

/**
 * Create a game scene
 * @return {GameScene}
 */
GameScene.create = function(venueID, roomID, password) {
    var scene = new GameScene();
    scene.init(venueID, roomID, password);
    return scene;
};
