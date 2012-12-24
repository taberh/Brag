
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

    turnonButton: null,
    believeButton: null,
    followButton: null,
    readyButton: null,

    initMenu: function() {

        cc.MenuItemFont.setFontSize(16);

        var backButton = cc.MenuItemFont.create('返回', this, this.onBack);
        backButton.setPosition(cc.p(140, 300));

        var switchRoomButton = cc.MenuItemFont.create('换桌', this, this.onSwitchRoom);
        switchRoomButton.setPosition(cc.p(190, 300));

        var toggleSoundButton = cc.MenuItemFont.create('声音', this, this.onToggleSound);
        toggleSoundButton.setPosition(cc.p(280, 300));

        var toggleFaceButton= cc.MenuItemFont.create('表情', this, this.onToggleFace);
        toggleFaceButton.setPosition(cc.p(330, 300));

        this.turnonButton = cc.MenuItemFont.create('翻牌', this, this.onTurnon);
        this.turnonButton.setPosition(cc.p(100, 65));

        this.believeButton = cc.MenuItemFont.create('相信', this, this.onBelieve);
        this.believeButton.setPosition(cc.p(150, 65));

        this.followButton = cc.MenuItemFont.create('出牌', this, this.onFollow);
        this.followButton.setPosition(cc.p(200, 65));

        this.readyButton = cc.MenuItemFont.create('准备', this, this.onReady);
        this.readyButton.setPosition(cc.p(250, 65));

        this.visibleKeyboard(false);
        this.readyButton.setVisible(false);
        
        this.initWithArray([backButton, switchRoomButton, toggleSoundButton, toggleFaceButton, this.turnonButton, this.believeButton, this.followButton, this.readyButton]);
    },

    onBack: function(target) {
        this.scene && this.scene.back && this.scene.back();
    },

    onSwitchRoom: function(target) {
        this.scene && this.scene.switchRoom && this.scene.switchRoom();
    },

    onToggleSound: function(target) {
        this.scene && this.scene.toggleSound && this.scene.toggleSound();
    },

    onToggleFace: function(target) {
        // show or hide face panel
    },

    onTurnon: function() {
        this.scene && this.scene.turnon && this.scene.turnon();
    },

    onBelieve: function() {
        this.scene && this.scene.believe && this.scene.believe();
    },

    onFollow: function() {
        this.scene && this.scene.follow && this.scene.follow();
    },

    onReady: function() {
        this.scene && this.scene.ready && this.scene.ready();
    },

    visibleKeyboard: function(visible) {
        this.turnonButton.setVisible(visible);
        this.believeButton.setVisible(visible);
        this.followButton.setVisible(visible);
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
