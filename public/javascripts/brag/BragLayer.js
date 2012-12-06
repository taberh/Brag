
var BragLayer = cc.Layer.extend({
    
    init: function() {
        if (!this._super()) {
            return false;
        }

        var backgroundSprite;
        var menu, backButton, readyButton, believeButton, throwButton;

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

    onBack: function(e) {
        var director = cc.Director.getInstance();
        var lobbyScene = LobbyLayer.scene();
        director.replaceScene(cc.TransitionFade.create(1.2, lobbyScene));
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
