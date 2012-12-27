
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
    menuLayer: null,
    upperPlayerLayer: null,
    lowerPlayerLayer: null,
    myselfLayer: null,
    coverLayer: null,
    brag: null,

    clockPos: [cc.p(80, 100), cc.p(400, 280), cc.p(80, 280)],
    movePos: [cc.p(35, 80), cc.p(445, 285), cc.p(35, 285)],

    init: function(venueID, roomID, password) {
        this._super();

        this.venueID = venueID;
        this.roomID = roomID;
        this.password = password;

        this.tablesLayer = TablesLayer.create();
        this.tablesLayer.scene = this;

        this.menuLayer = GameMenu.create();
        this.menuLayer.scene = this;
        this.menuLayer.setAnchorPoint(cc.PointZero());
        this.menuLayer.setPosition(cc.PointZero());

        this.upperPlayerLayer = UpperPlayerLayer.create();
        this.upperPlayerLayer.scene = this;

        this.lowerPlayerLayer = LowerPlayerLayer.create();
        this.lowerPlayerLayer.scene = this;

        this.myselfLayer = MyselfLayer.create();
        this.myselfLayer.scene = this;

        this.coverLayer = CoverLayer.create();
        this.coverLayer.scene = this;

        this.addChild(this.tablesLayer);
        this.addChild(this.upperPlayerLayer);
        this.addChild(this.lowerPlayerLayer);
        this.addChild(this.myselfLayer);
        this.addChild(this.menuLayer);
        this.addChild(this.coverLayer);

        this._setPlayerInfo(this.myselfLayer, App.user);

        this.coverLayer.setOpacity(255);
        this.coverLayer.visibleCancel(true);
        this.coverLayer.setStatus('正在进入房间...');

        this.brag = Brag.getInstance();
        this.brag.scene = this;

        this.enter();
    },

    _setPlayerInfo: function(player, info) {
        player.setAvatar(info.avatar_url);
        player.setNickname(info.nickname);
    },

    _removePlayerInfo: function(player) {
        player.removeAvatar();
        player.setNickname('');
    },

    onReconnect: function() {
    },

    onReconnectFailed: function() {
    },

    onInterrupt: function(result) {
        // alert message
        this.back();
    },

    onEntrance: function(result) {
        if (result.status === 0) {
            if (result.data.pIdx === this.upperIndex) {
                this._setPlayerInfo(this.upperPlayerLayer, result.data.player);
            }
            else {
                this._setPlayerInfo(this.lowerPlayerLayer, result.data.player);
            }
        }
        else {
            // alert error message
        }
    },

    onReady: function(result) {
        if (result.status === 0) {
            if (result.data.pIdx === this.upperIndex) {
                this.upperPlayerLayer.setReady(true);
            }
            else {
                this.lowerPlayerLayer.setReady(true);
            }
        }
        else {
            // alert error message
        }
    },

    onLeave: function(result) {
        if (result.status === 0) {
            if (result.data.pIdx === this.upperIndex) {
                this._removePlayerInfo(this.upperPlayerLayer);
                this.upperPlayerLayer.setReady(false);
            }
            else {
                this._removePlayerInfo(this.lowerPlayerLayer);
                this.lowerPlayerLayer.setReady(false);
            }
        }
        else {
            // alert error message
        }
    },

    onOperate: function(result) {
        if (result.status === 0) {
            var cards = result.data.cards;

            // 1.pase operate
            if (!result.data.operate) { // start 
                // remove ready 
                this.upperPlayerLayer.setReady(false);
                this.lowerPlayerLayer.setReady(false);
                this.myselfLayer.setReady(false);

            }
            else {
                var playerLayer;
                
                switch(result.data.operate.owner) {
                    case this.myselfIndex:
                        playerLayer = this.myselfLayer;
                        break;
                    case this.upperIndex:
                        playerLayer = this.upperPlayerLayer;
                        break;
                    case this.lowerIndex:
                        playerLayer = this.lowerPlayerLayer;
                        break;
                }

                if (result.data.operate.cards)  {// follow
                    playerLayer.setPublicCards(result.data.operate.cards);
                    playerLayer.setMessage(result.data.operate.cards + '个' + result.data.value);
                } // turnon
                else if (result.data.operate.card) {
                    var otherLayer;

                    switch(result.data.operate.pIdx) {
                        case this.myselfIndex:
                            otherLayer = this.myselfLayer;
                            break;
                        case this.upperIndex:
                            otherLayer = this.upperPlayerLayer;
                            break;
                        case this.lowerIndex:
                            otherLayer = this.lowerPlayerLayer;
                            break;
                    }

                    otherLayer.turnonCard(result.data.operate.cIdx, result.data.operate.card, this, this.turnonCardComplete, result.operate);
                    playerLayer.setMessage('翻牌');
                } // believe 
                else {
                    playerLayer.setMessage('我信');
                }
            }

            // set card value
            this.tablesLayer.setCardValue(result.data.value ? result.data.value : '');

            // set operator and status
            this.tablesLayer.setClockVisible(true);

            switch(result.data.operator) {
                case this.myselfIndex:
                    this.tablesLayer.setClockPosition(this.clockPos[0]);
                    break;
                case this.upperIndex:
                    this.tablesLayer.setClockPosition(this.clockPos[2]);
                    break;
                case this.lowerIndex:
                    this.tablesLayer.setClockPosition(this.clockPos[1]);
                    break;
            }
            
            if (result.data.operator === this.myselfIndex) {
                this.menuLayer.setKeyboardVisible(true);

                if (!result.data.operate || result.data.operate.card) {
                    this.menuLayer.setValueItemsVisible(true);
                }
            }

            // set cards
            this.upperPlayerLayer.setCardCount(cards[this.upperIndex]);
            this.lowerPlayerLayer.setCardCount(cards[this.lowerIndex]);
            this.myselfLayer.setPrivateCards(cards[this.myselfIndex]);
        }
        else {
            // alert error message
        }

        console.log(this.brag);
    },

    turnonCardComplete: function(operate) {
        if (operate.value === operate.card.value) {
            this.movePublicCardsTo(operate.owner);
        }
        else {
            this.movePublicCardsTo(operate.pIdx);
        }
    },

    movePublicCardsTo: function(playerIndex) {
        switch(playerIndex) {
            case this.myselfIndex:
                    this.upperPlayerLayer.movePublicCardsToPoint(this.movePos[0]);
                    this.lowerPlayerLayer.movePublicCardsToPoint(this.movePos[0]);
                    this.myselfLayer.movePublicCardsToPoint(this.movePos[0]);
                break;
            case this.lowerIndex:
                    this.upperPlayerLayer.movePublicCardsToPoint(this.movePos[1]);
                    this.lowerPlayerLayer.movePublicCardsToPoint(this.movePos[1]);
                    this.myselfLayer.movePublicCardsToPoint(this.movePos[1]);
                break;
            case this.upperIndex:
                    this.upperPlayerLayer.movePublicCardsToPoint(this.movePos[2]);
                    this.lowerPlayerLayer.movePublicCardsToPoint(this.movePos[2]);
                    this.myselfLayer.movePublicCardsToPoint(this.movePos[2]);
                break;
        }
    },

    selectedFollowCard: function() {

    },

    selectedTurnonCard: function(playerIndex, cardIndex) {
        this.brag.turnonCardIndex = cardIndex;
        this.brag.turnonPlayerIndex = playerIndex;

        if (playerIndex === this.upperIndex) {
            this.lowerPlayerLayer.unselectedCard();
        }
        else {
            this.upperPlayerLayer.unselectedCard();
        }
    },

    turnon: function() {
        if (this.brag.turnonPlayerIndex < 0 || 
            this.brag.turnonCardIndex < 0 ||
            this.brag.operator !== this.brag.index) {
            return;
        }

        var _this = this;

        this.brag.operate({
            'pIdx': this.brag.turnonPlayerIndex,
            'cIdx': this.brag.turnonCardIndex
        }, function(result) {
            if (result.status === 0) {
                _this.turnonButton.unselected();
            }
            else {
                // alert error message
            }
        });
    },

    follow: function() {
        if (this.brag.followCards.length === 0 || 
            this.brag.currentValue < 1 ||
            this.brag.operator !== this.brag.index) {
            return;
        }

        var _this = this;

        this.brag.operate({
            'cards': this.brag.followCards,
            'value': this.brag.currentValue
        }, function(result) {
            if (result.status === 0) {
                _this.followButton.unselected();
            }
            else {
                // alert error message
            }
        });
    },

    believe: function() {
        if (this.brag.operator !== this.brag.index) {
            return;
        }

        var _this = this;

        this.brag.operate(function(result) {
            if (result.status === 0) {
                _this.believeButton.unselected();
            }
            else {
                // alert error message
            }
        });
    },

    enter: function() {
        var _this = this;

        this.brag.enter({
            vid: this.venueID
        }, function(result) {
            _this.coverLayer.hide();

            if (result.status === 0) {
                var myIdx = result.data.pIdx,
                    upIdx = (myIdx + 2) % 3,
                    loIdx = (myIdx + 4) % 3,
                    upPlayer = result.data.players[upIdx],
                    loPlayer = result.data.players[loIdx];

                _this.myselfLayer.index = myIdx;
                _this.upperPlayerLayer.index = upIdx;
                _this.lowerPlayerLayer.index = loIdx;
                _this.upperIndex = upIdx;
                _this.lowerIndex = loIdx;
                _this.myselfIndex = myIdx;

                if (upPlayer) {
                    _this._setPlayerInfo(_this.upperPlayerLayer, upPlayer);

                    if (upPlayer.status === PLAYER_STATUS_READY) {
                        _this.upperPlayerLayer.setReady(true);
                    }
                }

                if (loPlayer) {
                    _this._setPlayerInfo(_this.lowerPlayerLayer, loPlayer);

                    if (loPlayer.status === PLAYER_STATUS_READY) {
                        _this.lowerPlayerLayer.setReady(true);
                    }
                }

                _this.menuLayer.readyButton.setVisible(true);
            }
            else {
                // alert error
            }
        });
    },

    leave: function(reenter) {
        var _this = this;

        this._removePlayerInfo(this.upperPlayerLayer);
        this._removePlayerInfo(this.lowerPlayerLayer);

        this.upperPlayerLayer.setReady(false);
        this.lowerPlayerLayer.setReady(false);
        this.myselfLayer.setReady(false);

        this.menuLayer.readyButton.setVisible(false);

        this.brag.leave(function(result) {
            if (reenter && (result.status === 0 || result.status === 211)) {
                _this.enter();
            }
        });
    },

    ready: function() {
        var _this = this;

        this.brag.ready(function(result) {
            if (result.status === 0) {
                _this.myselfLayer.setReady(true);
                _this.menuLayer.readyButton.setVisible(false);
            }
            else {
                // alert message
            }
        });
    },

    cancel: function() {
        this.runMainScene();
    },

    back: function() {
        if (this.brag && this.brag.playing) {
            return alert('游戏中，不能退出');
        }

        this.runMainScene();
    },

    switchRoom: function() {
        if (this.brag && !this.brag.playing) {
            this.coverLayer.setStatus('正在切换房间...');
            this.coverLayer.setOpacity(255);
            this.leave(true);
        }
        else {
            alert('正在游戏，不能换桌~.~');
        }
    },

    toggleSound: function() {
    },

    sendFace: function(face) {
    },

    runMainScene: function() {
        var director = cc.Director.getInstance();
        director.replaceScene(MainScene.create());
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
