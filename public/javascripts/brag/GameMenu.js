
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

    _valueItems: [],

    initMenu: function() {

        cc.MenuItemFont.setFontSize(16);

        var items = [];

        var backButton = cc.MenuItemFont.create('返回', this, this.onBack);
        backButton.setPosition(cc.p(140, 300));

        var switchRoomButton = cc.MenuItemFont.create('换桌', this, this.onSwitchRoom);
        switchRoomButton.setPosition(cc.p(190, 300));

        var toggleSoundButton = cc.MenuItemFont.create('声音', this, this.onToggleSound);
        toggleSoundButton.setPosition(cc.p(280, 300));

        var toggleFaceButton= cc.MenuItemFont.create('表情', this, this.onToggleFace);
        toggleFaceButton.setPosition(cc.p(330, 300));

        this.turnonButton = cc.MenuItemFont.create('翻牌', this, this.onTurnon);
        this.turnonButton.setPosition(cc.p(100, 120));

        this.believeButton = cc.MenuItemFont.create('相信', this, this.onBelieve);
        this.believeButton.setPosition(cc.p(150, 120));

        this.followButton = cc.MenuItemFont.create('出牌', this, this.onFollow);
        this.followButton.setPosition(cc.p(200, 120));

        this.readyButton = cc.MenuItemFont.create('准备', this, this.onReady);
        this.readyButton.setPosition(cc.p(250, 120));

        items.push(backButton);
        items.push(switchRoomButton);
        items.push(toggleSoundButton);
        items.push(toggleFaceButton);
        items.push(this.turnonButton);
        items.push(this.believeButton);
        items.push(this.followButton);
        items.push(this.readyButton);

        this.initWithArray(items);

        this._insertValueItems();

        this.cardValue = 0;

        this.setValueItemsVisible(false);
        this.setKeyboardVisible(false);
        this.readyButton.setVisible(false);
    },

    _insertValueItems: function() {
        for (var i = 1; i < 14; i++) {
            var item = ValueMenuItem.create(i);
            item.menu = this;
            item.setPosition(cc.p(i*30, 160));
            this._valueItems.push(item);
            this.addChild(item);
        }
    },

    onBack: function(target) {
        this.scene && this.scene.exit && this.scene.exit();
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

    selectedValue: function(value) {
        console.log('selected card value ', value);
        this.cardValue = value;
        this.scene && this.scene.selectedCardValue && this.scene.selectedCardValue(value);
    },

    setKeyboardVisible: function(visible) {
        this.turnonButton.setVisible(visible);
        this.believeButton.setVisible(visible);
        this.followButton.setVisible(visible);
    },

    setValueItemsVisible: function(visible) {
        for (var i = 0, l = this._valueItems.length; i < l; i++) {
            this._valueItems[i].setVisible(visible);
        }
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
