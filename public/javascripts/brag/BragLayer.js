
var BragLayer = cc.Layer.extend({
    
    init: function() {
        if (!this._super()) {
            return false;
        }

        var backgroundSprite = cc.Sprite.create(s_bg);
        backgroundSprite.setAnchorPoint(new cc.Point(0, 0));

        this.addChild(backgroundSprite);

        return true;
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
