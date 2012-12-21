
/**
 *  AccountLayer.js
 *  Brag
 *
 *  description: 账号信息层
 *
 *  Create by taber on 2012-12-20
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Account Layer
 * @class
 * @extends cc.Layer
 */
var AccountLayer = cc.Layer.extend({

    _nicknameLabel: null,
    _scoreLabel: null,
    _statusLabel: null,
    _avatarSprite: null,

    init: function() {
        if (!this._super()) {
            return false;
        }

        var winSize = cc.Director.getInstance().getWinSize();
        cc._fontSize = 14;

        var backgroundSprite = cc.Sprite.create(s_bg);
        backgroundSprite.setAnchorPoint(cc.PointZero());

        var avatarBackgroundSprite = cc.Sprite.create(s_avatar_bg);
        avatarBackgroundSprite.setPosition(cc.p(160, 200));

        var nicknamePrefixLabel = cc.LabelTTF.create('昵称：', App.NORMAL_FONT, 14, cc.size(50, 30), cc.TEXT_ALIGNMENT_LEFT);
        nicknamePrefixLabel.setPosition(cc.p(220, 220));

        var scorePrefixLabel = cc.LabelTTF.create('身价：', App.NORMAL_FONT, 14, cc.size(50, 30), cc.TEXT_ALIGNMENT_LEFT);
        scorePrefixLabel.setPosition(cc.p(220, 190));

        var statusPrefixLabel = cc.LabelTTF.create('状态：', App.NORMAL_FONT, 14, cc.size(50, 30), cc.TEXT_ALIGNMENT_LEFT);
        statusPrefixLabel.setPosition(cc.p(220, 160));

        this._nicknameLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 14, cc.size(100, 30), cc.TEXT_ALIGNMENT_LEFT);
        this._nicknameLabel.setPosition(cc.p(285, 220));

        this._scoreLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 14, cc.size(100, 30), cc.TEXT_ALIGNMENT_LEFT);
        this._scoreLabel.setPosition(cc.p(285, 190));

        this._scoreLabel.setColor(cc.c3(55, 200, 100));
        this._statusLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 14, cc.size(100, 30), cc.TEXT_ALIGNMENT_LEFT);

        this._statusLabel.setPosition(cc.p(285, 160));
        this._statusLabel.setColor(cc.c3(90, 200, 10));

        this.addChild(backgroundSprite);
        this.addChild(avatarBackgroundSprite);
        this.addChild(nicknamePrefixLabel);
        this.addChild(scorePrefixLabel);
        this.addChild(statusPrefixLabel);
        this.addChild(this._nicknameLabel);
        this.addChild(this._scoreLabel);
        this.addChild(this._statusLabel);

        return true;
    },

    setNickname: function(name) {
        this._nicknameLabel.setString(name);
    },

    setScore: function(number) {
        this._scoreLabel.setString(''+number);
    },

    setStatus: function(string) {
        this._statusLabel.setString(string);
    },

    setAvatar:function(url) {
        if (this._avatarSprite) {
            this.removeChild(this._avatarSprite, true);
        }

        this._avatarSprite = AvatarSprite.create(url);
        this._avatarSprite.setPosition(cc.p(160, 200));
        this.addChild(this._avatarSprite);
    }

});

/*
 * Create a account layer
 * @return {AccountLayer}
 */
AccountLayer.create = function() {
    var layer = new AccountLayer();
    if (layer && layer.init()) {
        return layer;
    }
    return null;
};
