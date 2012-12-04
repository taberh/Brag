
var LobbyLayer = cc.Layer.extend({
    
    init: function() {
        if (!this._super()) {
            return false;
        }

        cc._fontSize = 14;

        var winSize = cc.Director.getInstance().getWinSize();
        var bckgroundSprite;
        
        backgroundSprite = cc.Sprite.create(s_bg);
        backgroundSprite.setAnchorPoint(new cc.Point(0, 0));

        this.addChild(backgroundSprite);

        return true;
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
