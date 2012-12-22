
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
    _cardsBox: null,

    _CARD_BASE_TAG: 200,

    index: -1,

    init: function() {
        this._super();
        
        this._nameLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(60,20), cc.TEXT_ALIGNMENT_CENTER);
        this._messageLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(120,30), cc.TEXT_ALIGNMENT_CENTER);
        this._cardCountLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(50,20), cc.TEXT_ALIGNMENT_LEFT);
        this._readySprite = cc.Sprite.create(s_ready);
        this._cardThumbSprite = cc.Sprite.create(s_card_thumb);
        this._cardThumbSprite.setVisible(false);
        this._avatarBackgroundSprite = cc.Sprite.create(s_avatar_bg);
        this._cardsBox = cc.Menu.create();

        this.addChild(this._nameLabel);
        this.addChild(this._messageLabel);
        this.addChild(this._cardCountLabel);
        this.addChild(this._readySprite);
        this.addChild(this._cardThumbSprite);
        this.addChild(this._avatarBackgroundSprite);
        this.addChild(this._cardsBox);
    },

    setReady: function(isReady) {
        this._readySprite.setVisible(isReady);
    },

    setNickname: function(name) {
        this._nameLabel.setString(name);
    },

    setMessage: function(message) {
        this._messageLabel.setString(message);
    },

    setAvatar: function(url) {
        if (this._avatarSprite) {
            this.removeAvatar();
        }

        var pos = this._avatarBackgroundSprite.getPosition();
        this._avatarSprite = AvatarSprite.create(url);
        this._avatarSprite.setPosition(pos);
        this.addChild(this._avatarSprite);
    },

    removeAvatar: function() {
        this.removeChild(this._avatarSprite, true);
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

    setCards: function(number) {
        if (!number || typeof number !== 'number') 
            return;

        var i = 0,
            padding = this._countCardsInterval(number);

        for ( ; i < number; i++) {
            this._insertCard(i);
        }

        this._cardsBox.alignItemsHorizontallyWithPadding(padding);
    },

    turnonCard: function(index, card, target, callback) {

    },

    moveCardsToFrame: function(frame, overlying, callback) {
    },

    disabledCards: function() {
        this.cards.forEach(function(card) {
            card.setEnabled(false);
        });
    },

    enabledCards: function() {
        this.cards.forEach(function(card) {
            card.setEnabled(true);
        });
    },

    _insertCard: function(index) {
        var cardItem = cc.MenuItemSprite.create(s_card_normal, s_card_selected, s_card_disabled, this, this._onSelectedCard);
        cardItem.setTag(this._CARD_BASE_TAG + index);
        this.cards.push(cardItem);
        this._cardsBox.addChild(cardItem);
    },

    _countCardsInterval: function(number) {
        var boxSize = this._cardsBox.getContentSize(),
            cardSize = 30;

        return (boxSize - cardSize * number) / (number - 1);
    },

    _onSelectedCard: function(target) {
        var tag = target.getTag() - this._CARD_BASE_TAG;

        target.selected();

        this.scene && this.scene.selectedCard(this.index, tag);
    }
});


/**
 * Upper Player Layer
 * @class
 * @extends PlayerLayer
 */
var UpperPlayerLayer = PlayerLayer.extend({

    init: function() {
        this._super();

        this._avatarBackgroundSprite.setPosition(cc.p(35,275));

        this._cardThumbSprite.setPosition(cc.p(10,240));

        this._readySprite.setPosition(cc.p(80,260));

        this._nameLabel.setPosition(cc.p(35,310));
        this._nameLabel.setContentSize(cc.size(60,20));

        this._messageLabel.setPosition(cc.p(35, 240));
        this._messageLabel.setAnchorPoint(cc.p(0, 1));
        this._messageLabel.setContentSize(cc.size(100, 20));
        this._messageLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);

        this._cardCountLabel.setPosition(cc.p(40, 240));

        this._cardsBox.setPosition(cc.p(150, 220));
        this._cardsBox.setContentSize(cc.size(160, 40));
    }
});

UpperPlayerLayer.create = function() {
    var layer = new UpperPlayerLayer();
    layer.init();
    return layer;
};


/**
 * Lower Player Layer
 * @class
 * @extends PlayerLayer
 */
var LowerPlayerLayer = PlayerLayer.extend({

    init: function() {
        this._super();
    }
});

LowerPlayerLayer.create = function() {
    var layer = new LowerPlayerLayer();
    layer.init();
    return layer;
};


/**
 * Myself Layer
 * @class
 * @extends PlayerLayer
 */
var MyselfLayer = PlayerLayer.extend({

    init: function() {
        this._super();
    }
});

MyselfLayer.create = function() {
    var layer = new MyselfLayer();
    layer.init();
    return layer;
};
