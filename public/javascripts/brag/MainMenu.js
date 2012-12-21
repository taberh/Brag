
/**
 *  MainMenu.js
 *  Brag
 *
 *  description: 主场景菜单
 *
 *  Create by taber on 2012-12-20
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Main MenuLayer
 * @class
 * @extends cc.Menu
 */
var MainMenu = cc.Menu.extend({

    initMenu: function() {
        var noticeButton = cc.MenuItemFont.create('公告', this, this.onNotice);
        noticeButton.setPosition(cc.p(30, 300));

        var settingsButton = cc.MenuItemFont.create('设置', this, this.onSettings);
        settingsButton.setPosition(cc.p(450, 300));

        var startButton = cc.MenuItemFont.create('快速开始', this, this.onStartGame);
        startButton.setPosition(cc.p(200, 100));

        this.initWithArray([noticeButton, settingsButton, startButton]);
    },

    onNotice: function(target) {
        console.log('open notice wall');
        this.scene.showNotice();
    },

    onSettings: function(target) {
        console.log('open settings wall');
        this.scene.runSettingsScene();
    },

    onStartGame: function(target) {
        console.log('start game');
        this.scene.runGameScene();
    }
});

/*
 * Create a main scene menu layer
 * @return {MainMenu}
 */
MainMenu.create = function() {
    var menu = new MainMenu();
    menu.initMenu();
    return menu;
};
