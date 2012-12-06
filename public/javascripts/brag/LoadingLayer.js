
var LoadingLayer = cc.LayerColor.extend({

    cancelButton: null,
    
    initWithColor: function(color, width, height) {
        if (!this._super(color, width, height)) {
            return false;
        }

        var menu;

        this.cancelButton = cc.MenuItemFont.create('取消');
        this.cancelButton.setPosition(new cc.Point(240, 160));

        menu = cc.Menu.create(this.cancelButton);
        menu.setAnchorPoint(cc.PointZero());
        menu.setPosition(cc.PointZero());

        this.addChild(menu);

        return true;
    }
});

LoadingLayer.create = function() {
    var layer = new LoadingLayer();

    if (layer && layer.initWithColor(new cc.Color4B(255,0,0,255), 480, 320)) {
        return layer;
    }

    return null;
};
