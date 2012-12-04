
var SettingsLayer = cc.Layer.extend({
    
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
