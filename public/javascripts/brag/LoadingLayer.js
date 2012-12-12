
var LoadingLayer = cc.LayerColor.extend({

    statusLabel: null,
    cancelButton: null,
    
    initWithColor: function(color, width, height) {
        if (!this._super(color, width, height)) {
            return false;
        }

        var menu;

        this.cancelButton = cc.MenuItemFont.create('取消');
        this.cancelButton.setPosition(new cc.Point(240, 160));

        this.statusLabel = cc.LabelTTF.create('', 'Times New Roman', 16, cc.size(200, 30), cc.TEXT_ALIGNMENT_CENTER);
        this.statusLabel.setPosition(new cc.Point(240, 200));

        menu = cc.Menu.create(this.cancelButton);
        menu.setAnchorPoint(cc.PointZero());
        menu.setPosition(cc.PointZero());

        this.addChild(menu);
        this.addChild(this.statusLabel);

        return true;
    }
});

LoadingLayer.create = function() {
    var layer = new LoadingLayer();

    if (layer && layer.initWithColor(new cc.Color4B(0,0,0,255), 480, 320)) {
        return layer;
    }

    return null;
};
