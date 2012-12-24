
/**
 *  TablesLayer.js
 *  Brag
 *
 *  description: 赌桌场
 *
 *  Create by taber on 2012-12-20
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Tables Layer
 * @class
 * @extends cc.Layer
 */
var TablesLayer = cc.Layer.extend({

    _clockSprite: null,

    init: function() {
        if (!this._super()) {
            return false;
        }

        //this._clockSprite = cc.Sprite.create();

        var backgroundSprite;

        backgroundSprite = cc.Sprite.create(s_bg);
        backgroundSprite.setAnchorPoint(cc.PointZero());

        this.addChild(backgroundSprite);

        return true;
    }
});

TablesLayer.create = function() {
    var layer = new TablesLayer();

    if (layer && layer.init()) {
        return layer;
    }

    return null;
};
