
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
    cardsPos: [cc.p(35, 80), cc.p(445, 285), cc.p(35, 285)],

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

        this.brag = Brag.getInstance();
        this.brag.scene = this;

        this.enter();
    },

    setMessage: function(message) {
    },

    /**
     * set player avatar, nickname
     * @param {PlayerLayer} player
     * @param {Object} info
     */
    _setPlayerInfo: function(player, info) {
        player.setAvatar(info.avatar_url);
        player.setNickname(info.nickname);
        
        if (info['status'] === PLAYER_STATUS_READY) {
            player.setReady(true);
        }
    },

    /**
     * remove player avatar and nickname
     * @param {PlayerLayer} player
     */
    _removePlayerInfo: function(player) {
        player.removeAvatar();
        player.setNickname('');
    },

    _turnonCardComplete: function(operate) {
        if (operate.value === operate.card.value) {
            this.movePublicCardsTo(operate.owner);
        }
        else {
            this.movePublicCardsTo(operate.pIdx);
        }
    },

    _movePublicCardsTo: function(playerIndex) {
        var pos;

        switch(playerIndex) {
            case this.myselfIndex:
                pos = this.cardsPos[0];
                break;
            case this.lowerIndex:
                pos = this.cardsPos[1];
                break;
            case this.upperIndex:
                pos = this.cardsPos[2];
                break;
        }

        this.upperPlayerLayer.movePublicCardsToPoint(pos);
        this.lowerPlayerLayer.movePublicCardsToPoint(pos);
        this.myselfLayer.movePublicCardsToPoint(pos);
    },

    _initPlayer: function(player) {
        player.setMessage('');
        player.removePublicCards();

        if (player instanceof MyselfLayer) {
            player.removePrivateCards();
        }
        else {
            player.setCardsVisible(false);
        }
    },

    _initOperator: function(operator, value) {
        var pos, isMyself, isNew;

        isMyself = operator === this.myselfIndex;
        isNew = value === 0;

        switch(operator) {
            case this.upperIndex:
                pos = this.clockPos[2];
                break;
            case this.lowerIndex:
                pos = this.clockPos[1];
                break;
            case this.myselfIndex:
                pos = this.clockPos[0];
                break;
        }

        this.menuLayer.setKeyboardVisible(isMyself);
        this.menuLayer.setValueItemsVisible(isMyself && isNew);

        this.tablesLayer.setClockPosition(pos);
        this.tablesLayer.setClockVisible(true);
        this._startCountDown();
    },
    
    _startCountDown: function() {
    },

    _updateCards: function(cards) {
        this.myselfLayer.setPrivateCards(cards[this.myselfIndex]);

        this.upperPlayerLayer.setCardsVisible(true);
        this.upperPlayerLayer.setCardsTotal(cards[this.upperIndex]);

        this.lowerPlayerLayer.setCardsVisible(true);
        this.lowerPlayerLayer.setCardsTotal(cards[this.lowerIndex]);
    },

    /**
     * game over
     * @param {Number} winner
     */
    _over: function(winner) {
        alert(this.brag.players[winner].nickname + '胜利');

        this._initPlayer(this.upperPlayerLayer);
        this._initPlayer(this.upperPlayerLayer);
        this._initPlayer(this.myselfLayer);

        this.menuLayer.setKeyboardVisible(false);
        this.menuLayer.readyButton.setVisible(true);

        this.tablesLayer.setClockVisible(false);
        this.tablesLayer.setCardValue('');
    },

    /**
     * start game
     * @param {Object} data
     */
    _start: function(data) {
        this.myselfLayer.setReady(false);
        this.upperPlayerLayer.setReady(false);
        this.lowerPlayerLayer.setReady(false);

        this._updateCards(data.cards);
        this._initOperator(data.operator, data.value);
    },

    /**
     * reponse throw or follow cards operate
     * @param {Object} data
     */
    _follow: function(data) {
    },

    /**
     * reponse turnon card operate
     * @param {Object} data
     */
    _turnon: function(data) {
    },

    /**
     * reponse believe operate
     * @param {Object} data
     */
    _believe: function(data) {
    },

    /**
     * append cards to game pool
     * @param {Array} cards
     */
    appendCards: function(cards) {
    },

    /**
     * selected turnon card
     * @param {Number} playerIndex
     * @param {Number} cardIndex
     */
    selectedPublicCard: function(playerIndex, cardIndex) {
        this.selectedPublicCardPlayerIndex = playerIndex;
        this.selectedPublicCardIndex = cardIndex;

        if (playerIndex === this.lowerIndex) {
            this.upperPlayerLayer.unselectedPublicCard();
        }
        else {
            this.lowerPlayerLayer.unselectedPublicCard();
        }
    },

    /**
     * selected card value
     */
    selectedCardValue: function(value) {
        this.tablesLayer.setCardValue(value);
    },

    /**
     * send turnon operate event to server
     */
    turnon: function() {
        if (this.brag.operator !== this.brag.index) {
            return;
        }

        var _this = this,
            params = {};

        params.pIdx = this.selectedPublicCardPlayerIndex;
        params.cIdx = this.selectedPublicCardIndex;

        if (typeof params.pIdx !== 'number' ||
            typeof params.cIdx !== 'number') {
                this.setMessage('请选择您的揭穿的牌');
                return;
        }

        this.menuLayer.turnonButton.selected();
        this.menuLayer.turnonButton.setEnabled(false);
        this.lowerPlayerLayer.disabledPublicCards();
        this.upperPlayerLayer.disabledPublicCards();

        this.brag.operate(params, function(result) {
            _this.menuLayer.turnonButton.setEnabled(true);
            _this.menuLayer.turnonButton.unselected();
            _this.selectedPublicCardPlayerIndex = null;
            _this.selectedPublicCardIndex = null;
            _this.lowerPlayerLayer.unselectedPublicCard();
            _this.upperPlayerLayer.unselectedPublicCard();
            
            if (result.status !== 0) {
                _this.setMessage(result.error && result.error.message || 'turnon操作失败');
            }
        });
    },

    /**
     * send follow cards operate to server
     */
    follow: function() {
        if (this.brag.operator !== this.brag.index) {
            return;
        }

        var _this = this,
            params = {};

        params.cards = this.myselfLayer.getSelectedPrivateCards();

        if (!params.cards.length) {
            this.setMessage('请选择您要出的牌');
            return;
        }

        if (!this.brag.value) {
            params.value = this.menuLayer.cardValue;

            if (!params.value) {
                this.setMessage('请选择吹的牌大小');
                return;
            }
        }

        this.menuLayer.followButton.selected();
        this.menuLayer.followButton.setEnabled(false);

        this.brag.operate(params, function(result) {
            _this.menuLayer.followButton.unselected();
            _this.menuLayer.followButton.setEnabled(true);

            if (result.status !== 0) {
                _this.setMessage(result.err && result.err.message || 'follow操作失败');
            }
        });
    },

    /**
     * send believe operate event to server
     */
    believe: function() {
        if (this.brag.operator !== this.brag.index ||
            this.brag.value === 0) {
            return;
        }

        var _this = this;

        this.menuLayer.believeButton.selected();
        this.menuLayer.believeButton.setEnabled(false);

        this.brag.operate(function(result) {
            _this.menuLayer.believeButton.unselected();
            _this.menuLayer.believeButton.setEnabled(true);

            if (result.status !== 0) {
                this.setMessage(result.err && result.err.message || 'believe 操作出错');
            }
        });
    },

    /**
     * send enter room event
     */
    enter: function() {
        if (this.brag.index > -1) {
            return;
        }

        var _this = this,
            params = {};

        params.vid = this.venueID;

        if (typeof params.vid !== 'number') {
            console.warn('emit enter room params error!');
            return;
        }

        params.rid = this.roomID;
        params.password = this.paddword;

        this.coverLayer.setOpacity(255);
        this.coverLayer.setCancelVisible(true);
        this.coverLayer.setStatus('正在进入房间...');

        this.brag.enter(params, function(result) {
            var mIdx, uIdx, lIdx, uPlayer, lPlayer;

            _this.coverLayer.hide();

            if (result.status === 0) {
                mIdx = result.data.pIdx,
                uIdx = (mIdx + 2) % 3,
                lIdx = (mIdx + 4) % 3,
                uPlayer = result.data.players[uIdx],
                lPlayer = result.data.players[lIdx];

                _this.upperIndex = uIdx;
                _this.lowerIndex = lIdx;
                _this.myselfIndex = mIdx;
                _this.myselfLayer.index = mIdx;
                _this.upperPlayerLayer.index = uIdx;
                _this.lowerPlayerLayer.index = lIdx;

                uPlayer ? _this._setPlayerInfo(_this.upperPlayerLayer, uPlayer) : 
                        void 0;
                lPlayer ? _this._setPlayerInfo(_this.lowerPlayerLayer, lPlayer) : 
                        void 0;

                _this.menuLayer.readyButton.setVisible(true);
            }
            else {
                _this.setMessage(result.error && result.error.message || '进入房间失败');
            }
        });
    },

    /**
     * send leave room event
     * @param {Boolean} reenter
     */
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

    /**
     * send ready event to server
     */
    ready: function() {
        var _this = this;

        this.menuLayer.readyButton.selected();
        this.menuLayer.readyButton.setEnabled(false);

        this.brag.ready(function(result) {
            _this.menuLayer.readyButton.unselected();
            _this.menuLayer.readyButton.setEnabled(true);

            if (result.status === 0) {
                _this.myselfLayer.setReady(true);
                _this.menuLayer.readyButton.setVisible(false);
            }
            else {
                _this.setMessage(result.error && result.error.message || '准备失败');
            }
        });
    },

    /**
     * cancel operate
     */
    cancel: function() {
        this.runMainScene();
    },

    /**
     * exit game
     */
    exit: function() {
        if (this.brag && this.brag.playing) {
            return alert('游戏中，不能退出');
        }

        this.leave(false);
        this.runMainScene();
    },

    /**
     * switch room in curren venue
     */
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

    /**
     * toggle background music and sound effect
     */
    toggleSound: function() {
    },

    /**
     * send a face message
     * @param {Number} face Face code
     */
    sendFace: function(face) {
    },

    /**
     * back to main scene
     */
    runMainScene: function() {
        var director = cc.Director.getInstance();
        director.replaceScene(MainScene.create());
    },

    onReconnect: function() {
        console.log('reconnect...');
    },

    onReconnectFailed: function() {
        console.log('reconnect failed...');
    },

    onInterrupt: function(result) {
        this.exit();
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
            console.warn(result.error && result.error.message || 'Error..');
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
            console.log(result.error && result.error.message || 'Error..');
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
            console.log(result.error && result.error.message || 'Error..');
        }
    },

    onOperate: function(result) {
        if (result.status === 0) {
            var data = result.data;

            // game over 
            if (data.winner !== undefined) {
                return this._over(data.winner);
            }

            // start game
            if (!data.operate) {
                return this._start(data);
            }
            
            // response throw or follow cards operate
            if (data.operate.cards) {
                return this._follow(data);
            }

            // response turnon card operate
            if (data.operate.card) {
                return this._turnon(data);
            }

            // response believe operate
            this._believe(data);
        }
        else {
            console.warn(result.error && result.error.message || 'Error..');
        }
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
