
/**
 *  PlayerLayer.js
 *  Brag
 *
 *  description: 玩家视图
 *
 *  Create by taber on 2012-12-21
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Player Layer
 * @class
 * @extends cc.Layer
 */
var PlayerLayer = cc.Layer.extend({

    _avatarBackgroundSprite: null,
    _cardThumbSprite: null,
    _avatarSprite: null,
    _readySprite: null,
    _nameLabel: null,
    _messageLabel: null,
    _cardCountLabel: null,

    init: function() {
        this._super();
        
        this._nameLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(60,20), cc.TEXT_ALIGNMENT_CENTER);
        this._messageLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(120,30), cc.TEXT_ALIGNMENT_CENTER);
        this._cardCountLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(50,20), cc.TEXT_ALIGNMENT_LEFT);
        this._readySprite = cc.Sprite.create(s_ready);
        this._cardThumbSprite = cc.Sprite.create(s_card_thumb);
        this._cardThumbSprite.setVisible(false);
        this._avatarBackgroundSprite = cc.Sprite.create(s_avatar_bg);

        this.addChild(this._nameLabel);
        this.addChild(this._messageLabel);
        this.addChild(this._cardCountLabel);
        this.addChild(this._readySprite);
        this.addChild(this._cardThumbSprite);
        this.addChild(this._avatarBackgroundSprite);
    },

    setAvatar: function(url) {
        if (this._avatarSprite) {
            this.removeChild(this._avatarSprite, true);
        }

        var pos = this._avatarBackgroundSprite.getPosition();
        this._avatarSprite = AvatarSprite.create(url);
        this._avatarSprite.setPosition(pos);
        this.addChild(this._avatarSprite);
    },

    setReady: function(isReady) {
        this._readySprite.setVisible(isReady);
    },

    setCardCount: function(number) {
        this._cardCountLabel.setString(''+number);

        if (number === '') {
            this._cardThumbSprite.setVisible(false);
        }
        else {
            this._cardThumbSprite.setVisible(true);
        }
    },

    setNickname: function(name) {
        this._nameLabel.setString(name);
    },

    setMessage: function(message) {
        this._messageLabel.setString(message);
    }
});

PlayerLayer.create = function() {
    var layer = new PlayerLayer();
    layer.init();
    return layer;
};
