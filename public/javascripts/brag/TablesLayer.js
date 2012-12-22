
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
    /*updateUI: function() {
        var _this = this,
            brag = _this.brag,
            players = brag.players,
            index = brag.index;

        if (index >= 0) {
            var lIdx = (index + 2) % 3;
            var rIdx = (index + 4) % 3;

            updateAvatar.call(_this, players[lIdx], 'left', new cc.Point(25, 275));
            updateAvatar.call(_this, players[rIdx], 'right', new cc.Point(455, 275));
        }
    }*/
});

TablesLayer.create = function() {
    var layer = new TablesLayer();

    if (layer && layer.init()) {
        return layer;
    }

    return null;
};
