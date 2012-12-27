
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
        this._super(s_card_bg);

        var s_r = cc.rect((card.suit-1) * 20, 0, 20, 19);
        var v_r = cc.rect((card.value-1) * 50, 0, 50, 40);
        var suit = cc.Sprite.create(s_card_suit, s_r);
        var value = cc.Sprite.create(s_card_value, v_r);

        suit.setPosition(cc.p(40, 30));

        this.addChild(suit);
        this.addChild(value);
    }
});

CardMenuItem.create = function(card) {
    var sprite = new CardMenuItem();
    sprite.init(card);
    return sprite;
};
