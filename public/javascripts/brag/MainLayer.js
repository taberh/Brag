
var MainLayer = cc.Layer.extend({

    _nicknameLabel: null,
    _scoreLabel: null,
    _statusLabel: null,
    _avatarSprite: null,
    _coverLayer: null,

    init: function() {
        if (!this._super()) {
            return false;
        }

        cc._fontSize = 14;

        var _this = this;
        var winSize = cc.Director.getInstance().getWinSize();
        var backgroundSprite, avatarBackgroundSprite;
        var nicknameLabel, scoreLabel, statusLabel;
        var nicknamePrefixLabel, scorePrefixLabel, statusPrefixLabel;
        var menu, noticeButton, settingsButton, startButton, enterButton, changeButton;

        backgroundSprite = cc.Sprite.create(s_bg);
        backgroundSprite.setAnchorPoint(new cc.Point(0, 0));
        avatarBackgroundSprite = cc.Sprite.create(s_avatar_bg);
        avatarBackgroundSprite.setPosition(new cc.Point(160, 200));

        nicknamePrefixLabel = cc.LabelTTF.create('昵称：', 'Times New Roman', 14, cc.size(50, 30), cc.TEXT_ALIGNMENT_LEFT);
        nicknamePrefixLabel.setPosition(new cc.Point(220, 220));
        scorePrefixLabel = cc.LabelTTF.create('身价：', 'Times New Roman', 14, cc.size(50, 30), cc.TEXT_ALIGNMENT_LEFT);
        scorePrefixLabel.setPosition(new cc.Point(220, 190));
        statusPrefixLabel = cc.LabelTTF.create('状态：', 'Times New Roman', 14, cc.size(50, 30), cc.TEXT_ALIGNMENT_LEFT);
        statusPrefixLabel.setPosition(new cc.Point(220, 160));

        this._nicknameLabel = cc.LabelTTF.create(User.nickname, 'Times New Roman', 14, cc.size(100, 30), cc.TEXT_ALIGNMENT_LEFT);
        this._nicknameLabel.setPosition(new cc.Point(285, 220));
        this._scoreLabel = cc.LabelTTF.create('' + User.score, 'Times New Roman', 14, cc.size(100, 30), cc.TEXT_ALIGNMENT_LEFT);
        this._scoreLabel.setPosition(new cc.Point(285, 190));
        this._scoreLabel.setColor(new cc.Color3B(55, 200, 100));
        this._statusLabel = cc.LabelTTF.create('', 'Times New Roman', 14, cc.size(100, 30), cc.TEXT_ALIGNMENT_LEFT);
        this._statusLabel.setPosition(new cc.Point(285, 160));
        this._statusLabel.setColor(new cc.Color3B(90, 200, 10));

        switch(User.account_type) {
            case 1: 
                this._statusLabel.setString('游客登录');
                break;
            case 2:
                this._statusLabel.setString('QQ登录');
                break;
            case 3:
                this._statusLabel.setString('微博登录');
                break;
        }

        var avatarImage = new Image();
        avatarImage.addEventListener('load', function() {
            cc.TextureCache.getInstance().cacheImage(User.avatar_url, avatarImage);
            _this._avatarSprite = cc.Sprite.create(User.avatar_url);
            _this._avatarSprite.setPosition(new cc.Point(160, 200));

            var sX = 50/avatarImage.width,
                sY = 50/avatarImage.height;
            _this._avatarSprite.setScale(sX, sY);
            
            _this.addChild(_this._avatarSprite);
        });
        avatarImage.addEventListener('error', function() {
            cc.log('load failure:' + User.avatar_url);
        });
        avatarImage.src = User.avatar_url;

        noticeButton = cc.MenuItemFont.create('公告', this, this.onNotice);
        noticeButton.setPosition(new cc.Point(30, 300));
        settingsButton = cc.MenuItemFont.create('设置', this, this.onSettings);
        settingsButton.setPosition(new cc.Point(450, 300));
        startButton = cc.MenuItemFont.create('快速开始', this, this.onStartGame);
        startButton.setPosition(new cc.Point(200, 100));

        menu = cc.Menu.create(noticeButton, settingsButton, startButton);
        menu.setAnchorPoint(new cc.Point(0, 0));
        menu.setPosition(new cc.Point(0, 0));

        this.addChild(backgroundSprite);
        this.addChild(avatarBackgroundSprite);
        this.addChild(nicknamePrefixLabel);
        this.addChild(scorePrefixLabel);
        this.addChild(statusPrefixLabel);
        this.addChild(menu);
        this.addChild(this._nicknameLabel);
        this.addChild(this._scoreLabel);
        this.addChild(this._statusLabel);

        return true;
    },
    
    onNotice: function(e) {
    },

    onSettings: function(e) {
        var director = cc.Director.getInstance();
        var settingsScene = SettingsLayer.scene();
        director.pushScene(settingsScene);
    },

    onStartGame: function(e) {
        var director = cc.Director.getInstance();
        var bragScene = BragLayer.scene();
        director.replaceScene(bragScene);
    }

});

MainLayer.create = function() {
    var layer = new MainLayer();
    if (layer && layer.init()) {
        return layer;
    }
    return null;
};

MainLayer.scene = function() {
    var scene = cc.Scene.create();
    var layer = MainLayer.create();
    scene.addChild(layer, 1);
    return scene;
};
