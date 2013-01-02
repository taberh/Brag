
/**
 *  CardMenuItem.js
 *  Brag
 *
 *  description: 扑克卡片精灵
 *
 *  Create by taber on 2012-12-27
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Card Menu Item
 * @class
 * @extends cc.MenuItemSprite
 */
var CardMenuItem = cc.MenuItemSprite.extend({

    init: function(card) {
        var normalSprite = cc.Sprite.create(s_card_bg);

        this.initWithNormalSprite(normalSprite);
        this.setCallback(this, this.onSelected);

        var s_r = cc.rect((card.suit-1) * 20, 0, 20, 19);
        var v_r = cc.rect((card.value-1) * 40, 0, 40, 40);
        var suitSprite = cc.Sprite.create(s_card_suit, s_r);
        var valueSprite = cc.Sprite.create(s_card_value, v_r);

        suitSprite.setPosition(cc.p(30, 10));
        valueSprite.setPosition(cc.p(20, 30));

        this.addChild(suitSprite);
        this.addChild(valueSprite);

        this.index = card.index;
    },

    onSelected: function(target) {
        this.toggle();
    },

    toggle: function() {
        var pos = this.getPosition();

        if (this._selected) {
            this._selected = false;
            this.setPosition(cc.p(pos.x, pos.y-10));
        }
        else {
            this._selected = true;
            this.setPosition(cc.p(pos.x, pos.y+10));
        }

        console.log(this.index);
    }
});

CardMenuItem.create = function(card) {
    var sprite = new CardMenuItem();
    sprite.init(card);
    return sprite;
};
