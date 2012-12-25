
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
    _clockTimeLabel: null,

    init: function() {
        if (!this._super()) {
            return false;
        }

        //this._clockSprite = cc.Sprite.create();

        var backgroundSprite;

        backgroundSprite = cc.Sprite.create(s_bg);
        backgroundSprite.setAnchorPoint(cc.PointZero());

        this._clockSprite = cc.Sprite.create(s_clock);
        this._clockSprite.setVisible(false);

        this._clockTimeLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(80, 20), cc.TEXT_ALIGNMENT_CENTER);
        this._clockTimeLabel.setVisible(false);

        this.addChild(backgroundSprite);
        this.addChild(this._clockSprite);
        this.addChild(this._clockTimeLabel);

        return true;
    },

    setClockVisible: function(visible) {
        this._clockSprite.setVisible(visible);
        this._clockTimeLabel.setVisible(visible);
    },

    setClockPosition: function(position) {
        this._clockSprite.setPosition(position);
        this._clockTimeLabel.setPosition(position);
    },

    setClockTime: function(time) {
        this._clockTimeLabel.setString(''+time);
    }
});

TablesLayer.create = function() {
    var layer = new TablesLayer();

    if (layer && layer.init()) {
        return layer;
    }

    return null;
};
