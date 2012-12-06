
var SettingsLayer = cc.Layer.extend({
    
    init: function() {
        if (!this._super()) {
            return false;
        }

        cc._fontSize = 14;

        var winSize = cc.Director.getInstance().getWinSize();
        var bckgroundSprite;
        var menu, backButton;
        
        backgroundSprite = cc.Sprite.create(s_bg);
        backgroundSprite.setAnchorPoint(cc.PointZero());

        backButton = cc.MenuItemFont.create('返回', this, this.onBack);
        backButton.setPosition(new cc.Point(30, 300));

        menu = cc.Menu.create(backButton);
        menu.setAnchorPoint(cc.PointZero());
        menu.setPosition(cc.PointZero());

        this.addChild(backgroundSprite);
        this.addChild(menu);

        return true;
    },

    onBack: function() {
        cc.Director.getInstance().popScene();
    }
});

SettingsLayer.create = function() {
    var layer = new SettingsLayer();

    if (layer && layer.init()) {
        return layer;
    }

    return null;
};

SettingsLayer.scene = function() {
    var scene = cc.Scene.create();
    var layer = SettingsLayer.create();
    scene.addChild(layer);
    return scene;
};
