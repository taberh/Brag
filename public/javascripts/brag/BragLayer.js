
var BragLayer = cc.Layer.extend({

    _avatarSpriteLeft: null,
    _avatarSpriteRight: null,
    _avatarSpriteMyself: null,
    _loadingLayer: null,
    _socket: null,
    _room: {
        players: [],
        index: -1
    },
    
    init: function() {
        if (!this._super()) {
            return false;
        }

        var backgroundSprite;
        var avatarSpriteLeftBg, avatarSpriteRightBg, avatarSpriteMyselfBg;
        var menu, backButton, changeRoomButton,
            readyButton, believeButton, throwButton;

        backgroundSprite = cc.Sprite.create(s_bg);
        backgroundSprite.setAnchorPoint(cc.PointZero());

        avatarSpriteLeftBg = cc.Sprite.create(s_avatar_bg);
        avatarSpriteLeftBg.setAnchorPoint(new cc.Point(0,1));
        avatarSpriteLeftBg.setPosition(new cc.Point(0, 320));
        avatarSpriteRightBg = cc.Sprite.create(s_avatar_bg);
        avatarSpriteRightBg.setAnchorPoint(new cc.Point(1,1));
        avatarSpriteRightBg.setPosition(new cc.Point(480, 320));
        avatarSpriteMyselfBg = cc.Sprite.create(s_avatar_bg);
        avatarSpriteMyselfBg.setAnchorPoint(cc.PointZero());
        avatarSpriteMyselfBg.setPosition(new cc.Point(0, 80));
        
        backButton = cc.MenuItemFont.create('返回', this, this.onBack);
        backButton.setPosition(new cc.Point(140, 300));
        changeRoomButton = cc.MenuItemFont.create('换桌', this, this.onChangeRoom);
        changeRoomButton.setPosition(new cc.Point(190, 300));
        
        menu = cc.Menu.create(backButton, changeRoomButton);
        menu.setAnchorPoint(cc.PointZero());
        menu.setPosition(cc.PointZero());

        this._loadingLayer = LoadingLayer.create();
        this._loadingLayer.cancelButton.setCallback(this, this.onCancel);
        this._loadingLayer.statusLabel.setString('正在连接服务器...');

        this.addChild(backgroundSprite);
        this.addChild(avatarSpriteLeftBg);
        this.addChild(avatarSpriteRightBg);
        this.addChild(avatarSpriteMyselfBg);
        this.addChild(menu);
        this.addChild(this._loadingLayer);

        this._socket = io.connect('/brag');
        this._socket.on('connect', wrapFunc(this.connect, this));
        this._socket.on('error', wrapFunc(this.error, this));
        this._socket.on('disconnect', wrapFunc(this.disconnect, this));
        this._socket.on('room enter', wrapFunc(this.roomEnter, this));
        this._socket.on('room leave', wrapFunc(this.roomLeave, this));
        this._socket.on('room interrupt', wrapFunc(this.roomInterrupt, this));
        this._socket.on('player ready', wrapFunc(this.playerReady, this));
        this._socket.on('palyer operate', wrapFunc(this.playerOperate, this));

        function wrapFunc(func, target) {
            return function() {
                func.apply(target, arguments);
            };
        }

        console.log('init .......');
        return true;
    },

    updateAvatar: function() {
        for (var i = 0; i < this._room.players.length; i++) {
        }
    },

    onBack: function(e) {
        if (this._Brag && this._Brag.playing) {
            alert('游戏中，不能退出');
            return;
        }

        this.onCancel();
    },

    onChangeRoom: function(e) {
        var _this = this;
        this.doLeave(function(result) {
            _this.removeChild(_this.avatarSpriteLeft, true);
            _this.removeChild(_this.avatarSpriteRight, true);
            _this.avatarSpriteLeft = null;
            _this.avatarSpriteRight = null;

            if (result.status === 0) {
                _this.doEnter();
            }
        });
    },

    onCancel: function(e) {
        var director = cc.Director.getInstance();
        var mainScene = MainLayer.scene();
        director.replaceScene(mainScene);
        this.doLeave();
        this._socket.disconnect();
        io.sockets = {};
    },

    connect: function() {
        console.log('connect...');
        this._loadingLayer.statusLabel.setString('正在进入房间...');

        this.doEnter();
    },

    disconnect: function() {
        console.log('disconnect...');
    },

    error: function() {
        console.log('error...');
    },

    roomEnter: function(data) {

    },

    roomLeave: function(data) {
    },

    roomInterrupt: function(data) {
    },

    playerReady: function(data) {
    },

    playerOperate: function(data) {
    },

    doEnter: function(callback) {
        if (!this._socket) return;

        var _this = this;

        this._socket.emit('room enter', {
            'vid': 1
        }, function(result) {
            if (result.status === 0) {
                _this._room.players = result.data.players;
                _this._room.index = result.data.pIdx;
                _this.updateAvatar();
            }
            else {
                alert(result.error && result.error.message || '进入房间失败');
            }

            _this.removeChild(_this._loadingLayer, true);

            console.log('room enter: ', result);
            callback && callback(result);
        });
    },

    doLeave: function(callback) {
        if (!this._socket) return;

        this._socket.emit('room leave', callback || function(result) {
            console.log('leave room: ', result);
        });
    },

    doReady: function(callback) {
        if (!this._socket) return;

        var _this = this;

        this._socket.emit('player ready', function(result) {
            if (result.status === 0) {
                _this._room.player[index] = 2;
            }

            console.log('player ready: ', result);
            callback && callback(result);
        });
    },

    doOperate: function(callback) {
    }
});

BragLayer.create = function() {
    var layer = new BragLayer();

    if (layer && layer.init()) {
        return layer;
    }

    return null;
};

BragLayer.scene = function() {
    var scene = cc.Scene.create();
    var layer = BragLayer.create();
    scene.addChild(layer);
    return scene;
};
