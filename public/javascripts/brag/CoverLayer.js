
/**
 *  CoverLayer.js
 *  Brag
 *
 *  description: 遮罩层
 *
 *  Create by taber on 2012-12-17
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Cover Layer
 * @class
 * @extends cc.LayerColor
 */
var CoverLayer = cc.LayerColor.extend({

    _statusLabel: null,
    _cancelButton: null,
    
    init: function() {
        var winSize = cc.Director.getInstance().getWinSize();
        var color = cc.c4(0, 0, 0, 0);

        this.initWithColor(color, winSize.width, winSize.height);

        this._statusLabel = cc.LabelTTF.create('', 'Times New Roman', 16, cc.size(460, 30), cc.TEXT_ALIGNMENT_CENTER);
        this._statusLabel.setColor(cc.c3(255,255,255));
        this._statusLabel.setPosition(cc.p(winSize.width/2, winSize.height/2));

        cc.MenuItemFont.setFontSize(18);
        this._cancelButton = cc.MenuItemFont.create('取消', this, this.onCancel);
        this._cancelButton.setPosition(cc.p(winSize.width/2, winSize.height/2-30));
        this._cancelButton.setVisible(false);

        var menu = cc.Menu.create(this._cancelButton);
        menu.setAnchorPoint(cc.PointZero());
        menu.setPosition(cc.PointZero());

        this.addChild(this._statusLabel);
        this.addChild(menu);
    },

    show: function() {
        this.runAction(cc.Sequence.create(cc.FadeTo.create(0.3, 255)));
    },

    hide: function() {
        this.runAction(cc.Sequence.create(cc.FadeTo.create(0.2, 0)));
        this.setStatus('');
        this.visibleCancel(false);
    },

    setStatus: function(string) {
        this._statusLabel.setString(string);
    },

    setCancelVisible: function(visible) {
        this._cancelButton.setVisible(visible);
    },

    onCancel: function(target) {
        this.hide();

        if (this.scene && this.scene.cancel) {
            this.scene.cancel();
        }
    }
});

CoverLayer.create = function() {
    var layer = new CoverLayer();
    layer.init();
    return layer;
};
