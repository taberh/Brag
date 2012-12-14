
var RoomLayer = cc.Layer.extend({

    _leftAvatarSprite: null,
    _leftNameLabel: null,
    _leftStatusLabel: null,
    _leftCardCountLabel: null,
    _leftCardsSprite: null,

    _rightAvatarSprite: null,
    _rightNameLabel: null,
    _rightStatusLabel: null,
    _rightCardCountLabel: null,
    _rightCardsSprite: null,

    _myselfStatusLabel: null,
    _clockSprite: null,
    _loadingLayer: null,

    init: function() {
        if (!this._super()) {
            return false;
        }

        this._leftNameLabel = cc.LabelTTF.create('', 'Times New Roman', 12, cc.TEXT_ALIGNMENT_CENTER);
        this._leftNameLabel.setPosition(new cc.Point(25, 310));
        this._leftStatusLabel = cc.LabelTTF.create('', 'Times New Roman', 12, cc.TEXT_ALIGNMENT_LEFT);
        this._leftStatusLabel.setPosition(new cc.Point(60, 275));
        this._leftCardCountLabel = cc.LabelTTF.create('', 'Times New Roman', 12, cc.TEXT_ALIGNMENT_LEFT);
        this._leftCardCountLabel.setPosition(new cc.Point(25, 240));
        //this._leftCardsSprite = cc.Sprite.create();

        this._rightNameLabel = cc.LabelTTF.create('', 'Times New Roman', 12, cc.TEXT_ALIGNMENT_CENTER);
        this._rightNameLabel.setPosition(new cc.Point(455, 310));
        this._rightStatusLabel = cc.LabelTTF.create('', 'Times New Roman', 12, cc.TEXT_ALIGNMENT_RIGHT);
        this._rightStatusLabel.setPosition(new cc.Point(420, 275));
        this._rightCardCountLabel = cc.LabelTTF.create('', 'Times New Roman', 12, cc.TEXT_ALIGNMENT_LEFT);
        this._rightCardCountLabel.setPosition(new cc.Point(455, 240));
        //this._rightCardsSprite = cc.Sprite.create();

        this._myselfStatusLabel = cc.LabelTTF.create('', 'Times New Roman', 12, cc.TEXT_ALIGNMENT_LEFT);
        this._myselfStatusLabel.setPosition(new cc.Point(60, 105));
        //this._clockSprite = cc.Sprite.create();

        var backgroundSprite;
        var nameLabelMyself;
        var avatarSpriteLeftBg, avatarSpriteRightBg, avatarSpriteMyselfBg;
        var menu, backButton, changeRoomButton,
            readyButton, believeButton, throwButton;

        backgroundSprite = cc.Sprite.create(s_bg);
        backgroundSprite.setAnchorPoint(cc.PointZero());

        avatarSpriteLeftBg = cc.Sprite.create(s_avatar_bg);
        avatarSpriteLeftBg.setAnchorPoint(new cc.Point(0,1));
        avatarSpriteLeftBg.setPosition(new cc.Point(0, 300));
        avatarSpriteRightBg = cc.Sprite.create(s_avatar_bg);
        avatarSpriteRightBg.setAnchorPoint(new cc.Point(1,1));
        avatarSpriteRightBg.setPosition(new cc.Point(480, 300));
        avatarSpriteMyselfBg = cc.Sprite.create(s_avatar_bg);
        avatarSpriteMyselfBg.setAnchorPoint(cc.PointZero());
        avatarSpriteMyselfBg.setPosition(new cc.Point(0, 80));

        nameLabelMyself = cc.LabelTTF.create(User.nickname, 'Times New Roman', 12, cc.TEXT_ALIGNMENT_CENTER);
        nameLabelMyself.setPosition(new cc.Point(25, 135));

        var avatarSpriteMyself = cc.Sprite.create(User.avatar_url);
        var contentSize = avatarSpriteMyself.getContentSize();
        var sX = 50/contentSize.width;
        var sY = 50/contentSize.height;
        avatarSpriteMyself.setAnchorPoint(cc.PointZero());
        avatarSpriteMyself.setPosition(new cc.Point(0, 80));
        avatarSpriteMyself.setScale(sX, sY);
        
        backButton = cc.MenuItemFont.create('返回', this, this.onBack);
        backButton.setPosition(new cc.Point(140, 300));
        changeRoomButton = cc.MenuItemFont.create('换桌', this, this.onChangeRoom);
        changeRoomButton.setPosition(new cc.Point(190, 300));
        
        menu = cc.Menu.create(backButton, changeRoomButton);
        menu.setAnchorPoint(cc.PointZero());
        menu.setPosition(cc.PointZero());

        this._loadingLayer = LoadingLayer.create();
        this._loadingLayer.cancelButton.setCallback(this, this.onCancel);

        this.addChild(backgroundSprite);
        this.addChild(avatarSpriteLeftBg);
        this.addChild(avatarSpriteRightBg);
        this.addChild(avatarSpriteMyselfBg);
        this.addChild(menu);
        this.addChild(nameLabelMyself);
        this.addChild(avatarSpriteMyself);
        this.addChild(this._leftNameLabel);
        this.addChild(this._leftStatusLabel);
        this.addChild(this._leftCardCountLabel);
        //this.addChild(this._leftCardsSprite);
        this.addChild(this._rightNameLabel);
        this.addChild(this._rightStatusLabel);
        this.addChild(this._rightCardCountLabel);
        //this.addChild(this._rightCardsSprite);
        this.addChild(this._myselfStatusLabel);
        //this.addChild(this._clockSprite);
        this.addChild(this._loadingLayer);

        console.log('init .......');

        this._loadingLayer.statusLabel.setString('正在连接服务器...');
        this.brag = new Brag(0, this);

        return true;
    },

    onChangeRoom: function(e) {
        var _this = this;
        this.doLeave(function(result) {
            if (result.status === 0) {
                _this.doEnter();
            }
        });
    },

    onBack: function(e) {
        if (this.brag && this.brag.playing) {
            alert('游戏中，不能退出');
            return;
        }

        this.back();
    },

    onCancel: function(e) {
        this.back();
    },

    back: function() {
        var director = cc.Director.getInstance();
        var mainScene = MainLayer.scene();
        director.replaceScene(mainScene);
        this.brag.doLeave();
        io.sockets = {};
    },

    updateUI: function() {
        var _this = this,
            brag = _this.brag,
            players = brag.players,
            index = brag.index;

        if (index >= 0) {
            var lIdx = (index + 2) % 3;
            var rIdx = (index + 4) % 3;

            updateAvatar.call(_this, players[lIdx], 'left', new cc.Point(25, 275));
            updateAvatar.call(_this, players[rIdx], 'right', new cc.Point(455, 275));
        }

        function updateAvatar(player, dir, point) {
            var avatarImage;
            var avatarKey = '_' + dir + 'AvatarSprite';
            var nameKey = '_' + dir + 'NameLabel';
            var _this = this;

            if (player) {
                if (!_this[avatarKey]) {
                    avatarImage = new Image();
                    avatarImage.addEventListener('load', function() {
                        var sX = 50/avatarImage.width,
                            sY = 50/avatarImage.height;

                        cc.TextureCache.getInstance().cacheImage(player.avatar_url, avatarImage);
                        _this[avatarKey] = cc.Sprite.create(player.avatar_url);
                        _this[avatarKey].setPosition(point);

                        _this[avatarKey].setScale(sX, sY);
                        _this[nameKey].setString(player.nickname);
                        _this.addChild(_this[avatarKey]);
                    });
                    avatarImage.addEventListener('error', function() {
                        cc.log('load failure:' + player.avatar_url);
                    });
                    avatarImage.src = player.avatar_url;
                }
            }
            else {
                if (_this[avatarKey]) {
                    _this.removeChild(this[avatarKey], true);
                    _this[avatarKey] = null;
                    _this[nameKey].setString('');
                }
            }
        }
    }
});

RoomLayer.create = function() {
    var layer = new RoomLayer();

    if (layer && layer.init()) {
        return layer;
    }

    return null;
};

RoomLayer.scene = function() {
    var scene = cc.Scene.create();
    var layer = RoomLayer.create();
    scene.addChild(layer);
    return scene;
};
