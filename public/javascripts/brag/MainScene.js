
/**
 *  MainScene.js
 *  Brag
 *
 *  description: 主场景
 *
 *  Create by taber on 2012-12-20
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Main Scene
 * @class
 * @extends cc.Scene
 */
var MainScene = cc.Scene.extend({

    init: function() {
        this._super();

        var user = App.user,
            types = ['游客登录','QQ登录','微博登录'];

        var accountLayer = AccountLayer.create();
        accountLayer.scene = this;
        accountLayer.setNickname(user.nickname);
        accountLayer.setScore(user.score);
        accountLayer.setStatus(types[user.account_type-1]);
        accountLayer.setAvatar(user.avatar_url);

        var mainMenu = MainMenu.create();
        mainMenu.scene = this;
        mainMenu.setAnchorPoint(cc.PointZero());
        mainMenu.setPosition(cc.PointZero());

        this.addChild(accountLayer);
        this.addChild(mainMenu);
    },

    runSettingsScene: function() {
        /*var director = cc.Director.getInstance();
        var settingsScene = SettingsScene.create();
        director.replaceScene(settingsScene);*/
    },

    runGameScene: function(venueID, roomID, password) {
        if (!venueID) {
            // 未选择场馆直接进入新手场
            venueID = 1;
        }

        var director = cc.Director.getInstance();
        var gameScene = GameScene.create(venueID, roomID, password);
        director.replaceScene(gameScene);
    },

    showNotice: function() {
    }
});

/**
 * Create a lobby scene
 * @return {LobbyScene}
 */
MainScene.create = function() {
    var scene = new MainScene();
    scene.init();
    return scene;
};
