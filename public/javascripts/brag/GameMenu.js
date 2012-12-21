
/**
 *  GameMenu.js
 *  Brag
 *
 *  description: 游戏场景菜单
 *
 *  Create by taber on 2012-12-20
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Game MenuLayer
 * @class
 * @extends cc.Menu
 */
var GameMenu = cc.Menu.extend({

    initMenu: function() {
        var backButton = cc.MenuItemFont.create('返回', this, this.onBack);
        backButton.setPosition(new cc.Point(140, 300));

        var changeRoomButton = cc.MenuItemFont.create('换桌', this, this.onChange);
        changeRoomButton.setPosition(new cc.Point(190, 300));

        var changeRoomButton = cc.MenuItemFont.create('声音', this, this.onToggleSound);
        changeRoomButton.setPosition(new cc.Point(190, 300));

        var changeRoomButton = cc.MenuItemFont.create('表情', this, this.onToggleFace);
        changeRoomButton.setPosition(new cc.Point(190, 300));
        
        this.initWithItems(backButton, changeRoomButton);
    },

    onBack: function(target) {
    },

    onChange: function(target) {
    },

    onToggleSound: function(target) {
    },

    onToggleFace: function(target) {
    }
});

/*
 * Create a game scene menu layer
 * @return {GameMenu}
 */
GameMenu.create = function() {
    var menu = new GameMenu();
    menu.initMenu();
    return menu;
};
