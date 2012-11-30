
var MainLayer = cc.Layer.extend({

    _nicknameLabelTag: 100,
    _scoreLabelTag: 101,
    _statusLabelTag: 102,
    _avatarSpriteTag: 103,

    init: function() {
        if (!this._super()) {
            return false;
        }

        cc._fontSize = 14;

        var winSize = cc.Director.getInstance().getWinSize();
        var backgroundSprite, avatarBackgroundSprite;
        var nicknameLabel, scoreLabel, statusLabel;
        var nicknamePrefixLabel, scorePrefixLabel, statusPrefixLabel;
        var menu, noticeButton, settingsButton, startButton, enterButton, changeButton;

        backgroundSprite = cc.Sprite.create(s_bg);
        backgroundSprite.setAnchorPoint(new cc.Point(0, 0));
        avatarBackgroundSprite = cc.Sprite.create(s_avatar_bg);
        avatarBackgroundSprite.setPosition(new cc.Point(160, 200));

        nicknameLabel = cc.LabelTTF.create('taberh', 'Times New Roman', 14, cc.size(100, 30), cc.TEXT_ALIGNMENT_LEFT);
        nicknameLabel.setPosition(new cc.Point(285, 220));
        nicknameLabel.setTag(this._nicknameLabelTag);
        scoreLabel = cc.LabelTTF.create('1000', 'Times New Roman', 14, cc.size(100, 30), cc.TEXT_ALIGNMENT_LEFT);
        scoreLabel.setPosition(new cc.Point(285, 190));
        scoreLabel.setTag(this._scoreLabelTag);
        scoreLabel.setColor(new cc.Color3B(55, 200, 100));
        statusLabel = cc.LabelTTF.create('游客登录', 'Times New Roman', 14, cc.size(100, 30), cc.TEXT_ALIGNMENT_LEFT);
        statusLabel.setPosition(new cc.Point(285, 160));
        statusLabel.setTag(this._statusLabelTag);
        statusLabel.setColor(new cc.Color3B(90, 200, 10));

        nicknamePrefixLabel = cc.LabelTTF.create('昵称：', 'Times New Roman', 14, cc.size(50, 30), cc.TEXT_ALIGNMENT_LEFT);
        nicknamePrefixLabel.setPosition(new cc.Point(220, 220));
        scorePrefixLabel = cc.LabelTTF.create('身价：', 'Times New Roman', 14, cc.size(50, 30), cc.TEXT_ALIGNMENT_LEFT);
        scorePrefixLabel.setPosition(new cc.Point(220, 190));
        statusPrefixLabel = cc.LabelTTF.create('状态：', 'Times New Roman', 14, cc.size(50, 30), cc.TEXT_ALIGNMENT_LEFT);
        statusPrefixLabel.setPosition(new cc.Point(220, 160));

        noticeButton = cc.MenuItemFont.create('公告', this, this.onNotice);
        noticeButton.setPosition(new cc.Point(30, 300));
        settingsButton = cc.MenuItemFont.create('设置', this, this.onSettings);
        settingsButton.setPosition(new cc.Point(450, 300));
        startButton = cc.MenuItemFont.create('快速开始', this, this.onStartGame);
        startButton.setPosition(new cc.Point(200, 100));
        enterButton = cc.MenuItemFont.create('进入大厅', this, this.onEnterLobby);
        enterButton.setPosition(new cc.Point(280, 100));
        changeButton = cc.MenuItemFont.create('切换账号', this, this.onChangeAccount);
        changeButton.setPosition(new cc.Point(240, 10));

        menu = cc.Menu.create(noticeButton, settingsButton, startButton, enterButton, changeButton);
        menu.setAnchorPoint(new cc.Point(0, 0));
        menu.setPosition(new cc.Point(0, 0));

        this.addChild(backgroundSprite);
        this.addChild(avatarBackgroundSprite);
        this.addChild(nicknameLabel);
        this.addChild(scoreLabel);
        this.addChild(statusLabel);
        this.addChild(nicknamePrefixLabel);
        this.addChild(scorePrefixLabel);
        this.addChild(statusPrefixLabel);
        this.addChild(menu);
        
        return true;
    },

    onNotice: function(e) {
    },

    onSettings: function(e) {
    },

    onStartGame: function(e) {
        var director = cc.Director.getInstance();
        var bragSence = BragLayer.scene();
        director.replaceScene(cc.TransitionFade.create(1.2, bragSence));
    },

    onEnterLobby: function(e) {
    },

    onChangeAccount: function(e) {
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
