
var MainLayer = cc.Layer.extend({

    _nicknameLabel: null,
    _scoreLabel: null,
    _statusLabel: null,
    _avatarSprite: null,
    _coverLayer: null,
    _toolbarSprite: null,

    init: function() {
        if (!this._super()) {
            return false;
        }

        cc._fontSize = 14;

        var winSize = cc.Director.getInstance().getWinSize();
        var backgroundSprite, avatarBackgroundSprite;
        var nicknameLabel, scoreLabel, statusLabel;
        var nicknamePrefixLabel, scorePrefixLabel, statusPrefixLabel;
        var menu, noticeButton, settingsButton, startButton, enterButton, changeButton, 
            weiboButton, tencentButton, guestButton;

        backgroundSprite = cc.Sprite.create(s_bg);
        backgroundSprite.setAnchorPoint(new cc.Point(0, 0));
        avatarBackgroundSprite = cc.Sprite.create(s_avatar_bg);
        avatarBackgroundSprite.setPosition(new cc.Point(160, 200));

        this._nicknameLabel = cc.LabelTTF.create('taberh', 'Times New Roman', 14, cc.size(100, 30), cc.TEXT_ALIGNMENT_LEFT);
        this._nicknameLabel.setPosition(new cc.Point(285, 220));
        this._scoreLabel = cc.LabelTTF.create('1000', 'Times New Roman', 14, cc.size(100, 30), cc.TEXT_ALIGNMENT_LEFT);
        this._scoreLabel.setPosition(new cc.Point(285, 190));
        this._scoreLabel.setColor(new cc.Color3B(55, 200, 100));
        this._statusLabel = cc.LabelTTF.create('游客登录', 'Times New Roman', 14, cc.size(100, 30), cc.TEXT_ALIGNMENT_LEFT);
        this._statusLabel.setPosition(new cc.Point(285, 160));
        this._statusLabel.setColor(new cc.Color3B(90, 200, 10));

        tencentButton = cc.MenuItemFont.create('QQ登录', this, this.onLoginWithTencent);
        weiboButton = cc.MenuItemFont.create('微博登录', this, this.onLoginWithWeibo);
        guestButton = cc.MenuItemFont.create('游客登录', this, this.onLoginWithGuest);

        this._toolbarMenu = cc.Menu.create(tencentButton, weiboButton, guestButton);
        this._toolbarMenu.setContentSize(cc.size(winSize.width, 36));
        this._toolbarMenu.setPosition(new cc.Point(winSize.width/2, -18));
        this._toolbarMenu.alignItemsHorizontallyWithPadding(15);

        this._coverLayer = cc.LayerColor.create(new cc.Color4B(0, 0, 0, 0), winSize.width, winSize.height);

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
        this.addChild(nicknamePrefixLabel);
        this.addChild(scorePrefixLabel);
        this.addChild(statusPrefixLabel);
        this.addChild(menu);
        this.addChild(this._nicknameLabel);
        this.addChild(this._scoreLabel);
        this.addChild(this._statusLabel);
        this.addChild(this._coverLayer);
        this.addChild(this._toolbarMenu);

        this.setTouchEnabled(true);
        
        return true;
    },
    
    onTouchesEnded: function(touches, event) {
        var touch = touches[0];

        if (touch && this._coverLayer.isVisible() && touch.getLocation().y >= 36) {
            this._coverLayer.runAction(cc.Sequence.create(cc.FadeTo.create(0.5, 0)));
            this._toolbarMenu.runAction(cc.Sequence.create(cc.MoveTo.create(0.5, new cc.Point(240, -18))));
        }
    },

    onNotice: function(e) {
    },

    onSettings: function(e) {
        var director = cc.Director.getInstance();
        var settingsScene = SettingsLayer.scene();
        director.pushScene(cc.TransitionMoveInB.create(0.3, settingsScene));
    },

    onStartGame: function(e) {
        var director = cc.Director.getInstance();
        var bragScene = BragLayer.scene();
        director.replaceScene(cc.TransitionFade.create(1, bragScene));
    },

    onEnterLobby: function(e) {
        var director = cc.Director.getInstance();
        var lobbyScene = LobbyLayer.scene();
        director.replaceScene(cc.TransitionFade.create(1, lobbyScene));
    },

    onChangeAccount: function(e) {
        this._coverLayer.runAction(cc.Sequence.create(cc.FadeTo.create(0.5, 100)));
        this._toolbarMenu.runAction(cc.Sequence.create(cc.MoveTo.create(0.5, new cc.Point(240, 10))));
    },

    onLoginWithTencent: function(e) {
    },

    onLoginWithWeibo: function(e) {
    },

    onLoginWithGuest: function(e) {
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
