
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
    _cardsThumbSprite: null,
    _avatarSprite: null,
    _readySprite: null,
    _nameLabel: null,
    _messageLabel: null,
    _cardsTotalLabel: null,
    _publicCardsBox: null,

    _CARD_BASE_TAG: 200,

    CARD_SPRITE_WIDTH: 40,
    CARD_SPRITE_HEIGHT: 50,

    index: -1,
    selectedPublicCardIndex: -1,

    init: function() {
        this._super();
        
        this._nameLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(64,20), cc.TEXT_ALIGNMENT_CENTER);
        this._nameLabel.setVisible(false);

        this._messageLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(120,20), cc.TEXT_ALIGNMENT_LEFT);
        this._messageLabel.setVisible(false);

        this._cardsTotalLabel = cc.LabelTTF.create('', App.NORMAL_FONT, 12, cc.size(50,20), cc.TEXT_ALIGNMENT_LEFT);
        this._cardsTotalLabel.setVisible(false);

        this._publicCardsBox = cc.Menu.create();
        this._publicCardsBox.setContentSize(cc.size(150, 50));
        this._publicCardsBox.setAnchorPoint(cc.PointZero());
        this._publicCardsBox.setVisible(false);

        this._avatarBackgroundSprite = cc.Sprite.create(s_avatar_bg);

        this.addChild(this._nameLabel);
        this.addChild(this._messageLabel);
        this.addChild(this._cardsTotalLabel);
        this.addChild(this._publicCardsBox);
        this.addChild(this._avatarBackgroundSprite);
    },

    /**
     * set ready sprite visible
     * @param {Boolean} isReady
     */
    setReady: function(isReady) {
        if (!this._readySprite) {
            this._readySprite = cc.Sprite.create(s_ready);
            this._readySprite.setVisible(false);
            this.addChild(this._readySprite);
        }

        this._readySprite.setVisible(isReady);
    },

    /**
     * set nickname label string
     * @param {String} name
     */
    setNickname: function(name) {
        this._nameLabel.setString(name);
        this._nameLabel.setVisible(!!name);
    },

    /**
     * set message label string
     * @param {String} message
     */
    setMessage: function(message) {
        this._messageLabel.setString(message);
        this._messageLabel.setVisible(!!message);
    },

    /**
     * set avatar sprite
     * @param {String} url
     */
    setAvatar: function(url) {
        if (this._avatarSprite) {
            this.removeAvatar();
        }

        var pos = this._avatarBackgroundSprite.getPosition();
        this._avatarSprite = AvatarSprite.create(url);
        this._avatarSprite.setPosition(pos);
        this.addChild(this._avatarSprite);
    },

    /**
     * remove avatar sprite
     */
    removeAvatar: function() {
        this.removeChild(this._avatarSprite, true);
    },

    /**
     * set cards total
     * @param {Number} number
     */
    setCardsTotal: function(number) {
        this._cardsTotalLabel.setString(''+number);
    },

    /**
     * set cards visible
     * @param {Boolean} visible
     */
    setCardsVisible: function(visible) {
        if (!this._cardsThumbSprite) {
            this._cardsThumbSprite = cc.Sprite.create(s_card_thumb);
            this.addChild(this._cardsThumbSprite);
        }

        this._cardsTotalLabel.setVisible(visible);
        this._cardsThumbSprite.setVisible(visible);
    },

    /**
     * set public cards
     * @param {Number} amount
     */
    setPublicCards: function(amount) {
        if (!amount || typeof amount !== 'number') 
            return;

        var _this = this;
        var padding, i, item;

        if (this._publicCardsBox.getChildrenCount()) {
            this.scene.appendCards(this._publicCardsBox.getChildren(), function() {
                _this.removePublicCards();
                _this.setPublicCards(amount);
            });
            return;
        }

        padding = this._countCardsInterval(amount, this._publicCardsBox);

        for (i = 0; i < amount; i++) {
            item = cc.MenuItemImage.create(s_card_bg, s_card_bg, s_card_bg, this, this.onSelectedPublicCard);
            item.setTag(this._CARD_BASE_TAG + i);
            item.setPosition(cc.p((this.CARD_SPRITE_WIDTH+padding)*i-padding, this.CARD_SPRITE_HEIGHT/2));
            this._publicCardsBox.addChild(item);
        }

        this._publicCardsBox.setVisible(true);
    },

    /**
     * remove public cards
     */
    removePublicCards: function() {
        this._publicCardsBox.removeAllChildrenWithCleanup();
        this._publicCardsBox.setVisible(false);
    },

    /**
     * turnon a card
     * @param {Number} index
     * @param {Object} card
     * @param {Function} callback
     */
    turnonCard: function(index, card, callback) {
        console.log('turnon card', arguments);

        var newCard = CardMenuItem.create(card);
        var cards = this._publicCardsBox.getChildren();
        var oldCard = cards[index];

        newCard.setPosition(oldCard.getPosition());
        newCard.setEnabled(false);

        this._publicCardsBox.addChild(newCard);
        this._publicCardsBox.removeChild(oldCard, true);

        callback();
    },

    /**
     * move public cards to point
     * @param {cc.Point} point
     * @param {Function} callback
     */
    movePublicCardsToPoint: function(point, callback) {
        var cards = this._publicCardsBox.getChildren(),
            i = d = 0, 
            l = cards.length,
            t = 1/l,
            a, m, c;

        t = t > 0.1 ? 0.1 : t;
        point = this._publicCardsBox.convertToNodeSpaceAR(point);

        for ( ; i < l; i++) {
            m = cc.MoveTo.create((i+1)*t, point);
            c = cc.CallFunc.create(this, done);
            a = cc.Sequence.create([m, c]);
            cards[i].runAction(a);
        }
        
        function done() {
            if (++d === l) {
                callback();
            }
        }
    },

    disabledPublicCards: function() {
        var cards = this._publicCardsBox.getChildren();

        cards.forEach(function(card) {
            card.setEnabled(false);
        });
    },

    enabledPublicCards: function() {
        var cards = this._publicCardsBox.getChildren();

        cards.forEach(function(card) {
            card.setEnabled(true);
        });
    },

    /**
     * unselected public card
     */
    unselectedPublicCard: function() {
        if (this.selectedPublicCardIndex < 0) {
            return;
        }

        var cards = this._publicCardsBox.getChildren();
        var card = cards[this.selectedPublicCardIndex];

        this.selectedPublicCardIndex = -1;

        if (card) {
            card.unselected();
        }
    },

    /**
     * selected public card
     * @param {cc.MenuItemImage} card
     */
    selectedPublicCard: function(card) {
        card.selected();
        this.selectedPublicCardIndex = card.getTag() - this._CARD_BASE_TAG;
    },

    /**
     * selected public card event handle
     * @param {cc.MenuItemImage} target
     */
    onSelectedPublicCard: function(target) {
        this.selectedPublicCard(target);

        if (this.scene && this.scene.selectedPublicCard) {
            this.scene.selectedPublicCard(this.index, this.selectedPublicCardIndex);
        }
    },

    /**
     * 计算纸牌的间隔
     * @param {Number} amount
     * @param {cc.Node} box
     */
    _countCardsInterval: function(amount, box) {
        var boxSize = box.getContentSize();
        return (boxSize.width - this.CARD_SPRITE_WIDTH * amount) / (amount - 1);
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

        this._cardsTotalLabel.setPosition(cc.p(60, 240));

        this._publicCardsBox.setPosition(cc.p(150, 220));
    },

    setReady: function(isReady) {
        this._super(isReady);
        this._readySprite.setPosition(cc.p(80,260));
    },

    setCardsVisible: function(visible) {
        this._super(visible);
        this._cardsThumbSprite.setPosition(cc.p(10,240));
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

        this._messageLabel.setPosition(cc.p(405, 280));

        this._cardsTotalLabel.setPosition(cc.p(460, 240));

        this._publicCardsBox.setPosition(cc.p(280, 220));
    },

    setReady: function(isReady) {
        this._super(isReady);
        this._readySprite.setPosition(cc.p(400,260));
    },

    setCardsVisible: function(visible) {
        this._super(visible);
        this._cardsThumbSprite.setPosition(cc.p(420,240));
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

        this.removeChild(this._cardsTotalLabel, true);

        this._avatarBackgroundSprite.setPosition(cc.p(35,65));

        this._nameLabel.setPosition(cc.p(35, 100));

        this._messageLabel.setPosition(cc.p(35, 60));

        this._publicCardsBox.setPosition(cc.p(130, 90));

        this._privateCardsBox = cc.Menu.create();
        this._privateCardsBox.setContentSize(cc.size(400, 50));
        this._privateCardsBox.setAnchorPoint(cc.PointZero());
        this._privateCardsBox.setPosition(cc.p(60, 10));
        this.addChild(this._privateCardsBox);
    },

    setReady: function(isReady) {
        this._super(isReady);
        this._readySprite.setPosition(cc.p(70,70));
    },

    /**
     * remove private cards sprite
     */
    removePrivateCards: function() {
        this._privateCardsBox.removeAllChildrenWithCleanup(true);
    },

    /**
     * set private cards sprite
     * @param {Array} cards
     */
    setPrivateCards: function(cards) {
        var padding = this._countCardsInterval(cards.length, this._privateCardsBox);
        var i, l, item;

        for (i = 0, l = cards.length; i < l; i++) {
            item = CardMenuItem.create(cards[i]);
            item.setAnchorPoint(cc.PointZero());
            item.setPosition(cc.p((padding+40)*i-padding, 25));
            this._privateCardsBox.addChild(item);
        }
    },

    /**
     * get selected private cards index
     * @return {Array[Number]}
     */
    getSelectedPrivateCards: function() {
        var cards = this._privateCardsBox.getChildren(),
            result = [],
            i, l, card;

        for (i = 0, l = cards.length; i < l; i++) {
            card = cards[i];

            if (card && card._selected) {
                result.push(card.index);
            }
        }

        return result;
    }
});

MyselfLayer.create = function() {
    var layer = new MyselfLayer();
    layer.init();
    return layer;
};
