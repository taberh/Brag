
/**
 *  GameScene.js
 *  Brag
 *
 *  description: 游戏场景
 *
 *  Create by taber on 2012-12-17
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Game Scene
 * @class
 * @extends cc.Scene
 */
var GameScene = cc.Scene.extend({
    
    tablesLayer: null,
    upperPlayerLayer: null,
    lowerPlayerLayer: null,
    myselfLayer: null,
    coverLayer: null,
    brag: null,

    init: function(venueID, roomID, password) {
        this._super();

        this.venueID = venueID;
        this.roomID = roomID;
        this.password = password;

        this.tablesLayer = TablesLayer.create();

        this.upperPlayerLayer = UpperPlayerLayer.create();
        this.upperPlayerLayer.index = 1;
        this.upperPlayerLayer.setNickname(App.user.nickname);
        this.upperPlayerLayer.setMessage('test message');
        this.upperPlayerLayer.setReady(true);
        this.upperPlayerLayer.setAvatar(App.user.avatar_url);
        this.upperPlayerLayer.setCardCount(18);

        this.addChild(this.tablesLayer);
        this.addChild(this.upperPlayerLayer);

        //this.brag = new Brag();
        //this.brag.init();
    },

    backLobbyScene: function() {
        var director = cc.Director.getInstance();
        director.replaceScene(LobbyScene.create());
    }
});

/**
 * Create a game scene
 * @return {GameScene}
 */
GameScene.create = function(venueID, roomID, password) {
    var scene = new GameScene();
    scene.init(venueID, roomID, password);
    return scene;
};
