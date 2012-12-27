
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
    _cardsPublicBox: null,

    _CARD_BASE_TAG: 200,

    index: -1,
    selectedPublicCardIndex: -1,
    publicCards: [],

    init: function() {
        this._super();
        
        this._nameLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(64,20), cc.TEXT_ALIGNMENT_CENTER);

        this._messageLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(120,20), cc.TEXT_ALIGNMENT_LEFT);
        this._messageLabel.setVisible(false);

        this._cardCountLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(50,20), cc.TEXT_ALIGNMENT_LEFT);
        this._cardCountLabel.setVisible(false);

        this._avatarBackgroundSprite = cc.Sprite.create(s_avatar_bg);

        this._cardsPublicBox = cc.Menu.create();
        this._cardsPublicBox.setContentSize(cc.size(160, 40));

        this.addChild(this._nameLabel);
        this.addChild(this._messageLabel);
        this.addChild(this._cardCountLabel);
        this.addChild(this._avatarBackgroundSprite);
        this.addChild(this._cardsPublicBox);
    },

    setReady: function(isReady) {
        if (!this._readySprite) {
            this._readySprite = cc.Sprite.create(s_ready);
            this._readySprite.setVisible(false);
            this.addChild(this._readySprite);
        }

        this._readySprite.setVisible(isReady);
    },

    setNickname: function(name) {
        this._nameLabel.setString(name);
    },

    setMessage: function(message) {
        this._messageLabel.setString(message);
        
        if (message) {
            this._messageLabel.setVisible(true);
        }
        else {
            this._messageLabel.setVisible(false);
        }
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
        if (!this._cardCountLabel)
            return;

        this._cardCountLabel.setString(''+number);

        if (!this._cardThumbSprite) {
            this._cardThumbSprite = cc.Sprite.create(s_card_thumb);
            this._cardThumbSprite.setVisible(false);
            this.addChild(this._cardThumbSprite);
        }

        if (number === '') {
            this._cardThumbSprite.setVisible(false);
            this._cardCountLabel.setVisible(false);
        }
        else {
            this._cardThumbSprite.setVisible(true);
            this._cardCountLabel.setVisible(true);
        }
    },

    setPublicCards: function(number) {
        if (!number || typeof number !== 'number') 
            return;

        if (this.publicCards.length) {
            this._moveCardsToFrame(this.publicCards, cc.p(240, 270), insert);
        }
        else {
            insert.call(this);
        }

        function insert() {
            var i = 0,
                padding = this._countCardsInterval(number, this._cardsPublicBox);

            for ( ; i < number; i++) {
                this._insertPublicCard(i);
            }

            this._cardsPublicBox.alignItemsHorizontallyWithPadding(padding);
        }
    },

    _moveCardsToPoint: function(cards, point, calback) {
        for (var i = 0, l = cards.length; i < l; i++) {
            cards[i].setPosition(point);   
        }

        callback.call(this);
    },

    turnonCard: function(index, card, target, callback, operate) {
        callback(operate);
    },

    movePublicCardsToPoint: function(point, target, callback) {
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

    unselectedCard: function() {
        if (this.selectedPublicCardIndex < 0) {
            return;
        }

        var card = this.publicCards[this.selectedPublicCardIndex];

        if (card) {
            card.unselected();
        }

        this.selectedPublicCardIndex = -1;
    },

    _insertPublicCard: function(index) {
        var cardItem = cc.MenuItemSprite.create(s_card_bg, this, this._onSelectedPublicCard);
        cardItem.setTag(this._CARD_BASE_TAG + index);
        this.publicCards.push(cardItem);
        this._cardsPublicBox.addChild(cardItem);
    },

    _countCardsInterval: function(number, box) {
        var boxSize = box.getContentSize(),
            cardSize = 30;

        return (boxSize - cardSize * number) / (number - 1);
    },

    _onSelectedPublicCard: function(target) {
        target.selected();
        this.selectedPublicCardIndex = target.getTag() - this._CARD_BASE_TAG;
        this.scene && this.scene.selectedPublicCard && this.scene.selectedPublicCard(this.index, this.selectedPublicCardIndex);
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

        this._nameLabel.setPosition(cc.p(35,310));

        this._messageLabel.setPosition(cc.p(35, 240));

        this._cardCountLabel.setPosition(cc.p(60, 240));

        this._cardsPublicBox.setPosition(cc.p(150, 220));
    },

    setReady: function(isReady) {
        this._super(isReady);
        this._readySprite.setPosition(cc.p(80,260));
    },

    setCardCount: function(number) {
        this._super(number);
        this._cardThumbSprite.setPosition(cc.p(10,240));
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

        this._avatarBackgroundSprite.setPosition(cc.p(445,275));

        this._nameLabel.setPosition(cc.p(445,310));

        this._messageLabel.setPosition(cc.p(445, 240));

        this._cardCountLabel.setPosition(cc.p(460, 240));

        this._cardsPublicBox.setPosition(cc.p(330, 220));
    },

    setReady: function(isReady) {
        this._super(isReady);
        this._readySprite.setPosition(cc.p(400,260));
    },

    setCardCount: function(number) {
        this._super(number);
        this._cardThumbSprite.setPosition(cc.p(420,240));
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

        this.removeChild(this._cardCountLabel, true);
        this.removeChild(this._cardThumbSprite, true);

        this._avatarBackgroundSprite.setPosition(cc.p(35,65));

        this._nameLabel.setPosition(cc.p(35, 100));

        this._messageLabel.setPosition(cc.p(35, 60));

        this._cardsPublicBox.setPosition(cc.p(130, 90));
    },

    setReady: function(isReady) {
        this._super(isReady);
        this._readySprite.setPosition(cc.p(70,70));
    },

    setPrivateCards: function(cards) {
    }
});

MyselfLayer.create = function() {
    var layer = new MyselfLayer();
    layer.init();
    return layer;
};
