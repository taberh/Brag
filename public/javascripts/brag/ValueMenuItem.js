
/**
 *  ValueMenuItem.js
 *  Brag
 *
 *  description: 牌
 *
 *  Create by taber on 2013-01-01
 *  Copyright 2013 TONGZI. All rights reserved.
 */


/**
 * Value Menu Item
 * @class
 * @extends cc.MenuItemFont
 */

var ValueMenuItem = cc.MenuItemFont.extend({

    initWithValue: function(value) {
        this.initWithString(''+value, this, this.onSelected);
        this.value = value;
    },

    onSelected: function(target) {
        if (!this.menu || !this.menu.selectedValue) {
            return;
        }

        this.menu.selectedValue(this.value);
    }
});

/*
 * Create a value menu item 
 * @return {ValueMenuItem}
 */
ValueMenuItem.create = function(value) {
    var item = new ValueMenuItem();
    item.initWithValue(value);
    return item;
};
