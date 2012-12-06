
var LobbyLayer = cc.Layer.extend({

    _loadingLayer: null,
    
    init: function() {
        if (!this._super()) {
            return false;
        }

        cc._fontSize = 14;

        var VENUE_BASE_TAG = 1000;
        var winSize = cc.Director.getInstance().getWinSize();
        var bckgroundSprite, titleLabel;
        var menu, backButton, settingsButton,
            venueButton1, venueButton2, venueButton3, venueButton4;
        
        backgroundSprite = cc.Sprite.create(s_bg);
        backgroundSprite.setAnchorPoint(cc.PointZero());

        titleLabel = cc.LabelTTF.create('游戏大厅', 'Times New Roman', 18, cc.size(100, 30), cc.Text_ALIGNMENT_CENTER);
        titleLabel.setPosition(new cc.Point(winSize.width/2, 295));

        backButton = cc.MenuItemFont.create('返回', this, this.onBack);
        backButton.setPosition(new cc.Point(30, 300));
        settingsButton = cc.MenuItemFont.create('设置', this, this.onSettings);
        settingsButton.setPosition(new cc.Point(450, 300));
        venueButton1 = cc.MenuItemFont.create('私人馆', this, this.onEnterVenue);
        venueButton1.setPosition(new cc.Point(135, 220));
        venueButton1.setTag(VENUE_BASE_TAG);
        venueButton2 = cc.MenuItemFont.create('平民窟', this, this.onEnterVenue);
        venueButton2.setPosition(new cc.Point(345, 220));
        venueButton2.setTag(VENUE_BASE_TAG + 1);
        venueButton3 = cc.MenuItemFont.create('公寓馆', this, this.onEnterVenue);
        venueButton3.setPosition(new cc.Point(135, 100));
        venueButton3.setTag(VENUE_BASE_TAG + 2);
        venueButton4 = cc.MenuItemFont.create('别墅楼', this, this.onEnterVenue);
        venueButton4.setPosition(new cc.Point(345, 100));
        venueButton4.setTag(VENUE_BASE_TAG + 3);

        menu = cc.Menu.create(backButton, settingsButton, venueButton1, venueButton2, venueButton3, venueButton4);
        menu.setAnchorPoint(cc.PointZero());
        menu.setPosition(cc.PointZero());

        this._loadingLayer = LoadingLayer.create();
        this._loadingLayer.cancelButton.setCallback(this, this.onCancel);

        this.addChild(backgroundSprite);
        this.addChild(menu);
        this.addChild(titleLabel);
        this.addChild(this._loadingLayer);

        this._loadingLayer.setVisible(false);

        return true;
    },

    onCancel: function(e) {
        console.log('cancel');
    },

    onBack: function(e) {
        var director = cc.Director.getInstance();
        var mainScene = MainLayer.scene();
        director.replaceScene(cc.TransitionFade.create(1.2, mainScene));
    },
    
    onSettings: function(e) {
        var director = cc.Director.getInstance();
        var settingsScene = SettingsLayer.scene();
        director.pushScene(settingsScene);
    },

    onEnterVenue: function(e) {
        var director = cc.Director.getInstance();
        var bragScene = BragLayer.scene();
        director.replaceScene(cc.TransitionFade.create(1.2, bragScene));
    }
});

LobbyLayer.create = function() {
    var layer = new LobbyLayer();

    if (layer && layer.init()) {
        return layer;
    }

    return null;
};

LobbyLayer.scene = function() {
    var scene = cc.Scene.create();
    var layer = LobbyLayer.create();
    scene.addChild(layer);
    return scene;
};
