
var utils = require('../lib/utils');
var exception = require('../lib/exception');
var models = require('../models');
var Cards = models.Cards;

exports.Brag = Brag;

/**
 * @class
 * @contructor
 * @prototype {Number} seating
 * @prototype {Number} chip
 * @prototype {Bool} playing
 * @prototype {Number} operator
 * @prototype {Number} winner
 * @param {Number} seating
 * @param {Number} chip
 */
function Brag(seating, chip) {
    if (arguments.length !== 2) 
        return;

    this.seating = seating;
    this.chip = chip;
    this.playing = false;
    this.operator = -1;
    this.winner = -1;

    this._pool = [];
    this._cards = [];
    this._value = 0;
}

Brag.prototype = {
    constructor: Brag,

    start: function() {
        if (this.playing) 
            throw new exception.Error('Brag.prototype.distribute', 220, '游戏中');

        distribute.call(this);
        init_operator.call(this);

        this.playing = true;
        this.winner = -1;
        this._pool = [];
        this._value = 0;

        return true;
    },
    operate: function(operator, data) {
        var result;

        if (!this.playing) 
            return false;

        if (!this._pool.length && (!data || !data.cards)) {
            throw new exception.Error('Brag.prorotype.operate', 220, '参数错误');
        }
        
        result = {
            'operate': {}
        };

        if (!data) {
            operate_believe.call(this, operator);
        } 
        else if (data.cards) {
            operate_throw.call(this, operator, data.cards, data.value);

            result.operate.cards = this._pool[this._pool.length - 1].cards.length;
        }
        else {
            result.operate.value = this._value;

            operate_turnon.call(this, operator, data.pIdx, data.cIdx);

            result.operate.card = this._card;
            delete this._card;
            result.operate.pIdx = data.pIdx;
            result.operate.cIdx = data.cIdx;
        }

        result.operator = this.operator;
        result.operate.owner = operator;
        result.value = this._value;

        if (is_over.call(this)) {
            this.over();

            result = {
                'winner': this.winner
            };
        }
        
        return result;
    },
    over: function(message) {
        this.playing = false;
        this.operator = -1;
        this._value = 0;
        this._pool = [];
        this._cards = [];
    },
    outputCards: function(index) {
        var cards = this._cards,
            result = [], i, j, len;

        for (i = 0; i < cards.length; i++) {
            if (i !== index) {
                result[i] = cards[i].length;
            }else {
                result[i] = [];

                for (j = 0; j < cards[i].length; j++) {
                    result[i][j] = Cards.get(cards[i][j]);
                }
            }
        }

        return result;
    }
};

/**
 * Process player operate of believe.
 * @function
 * @private
 * @param {Number} operator 
 */
function operate_believe(operator) {
    this._pool.push({'owner': operator});
    this.operator = ++this.operator % this.seating;

    var o = this._pool[this._pool.length - 2];

    if (o && !o.cards) {
        this._pool = [];
        this._value = 0;
    }
}

/**
 * Process player operate of turnon
 * @function
 * @private
 * @param {Number} operator 
 * @param {Number} owner
 * @param {Number} index
 */
function operate_turnon(operator, owner, index) {
    var h = owner - operator,
        o, c;

    h = h > 0 ? (3-h) : Math.abs(h);

    console.log('pool history index: ', h);

    o = this._pool[this._pool.length - h];

    if (!o.cards || !o.cards.length) {
        throw new exception.Error('operate_turnon', 220, '参数错误');
    }

    this._card = c = Cards.get(o.cards[index]);

    if (c.value === this._value) {
        transfer_cards.call(this, operator);
        this.operator = owner;
    }
    else {
        transfer_cards.call(this, owner);
        this.operator = operator;
    }

    this._pool = [];
    this._value = 0;
}

/**
 * Process player operate of throw cards
 * @function
 * @private
 * @param {Number} operator 
 * @param {Number[]} cards
 * @param {Number} value
 */
function operate_throw(operator, cards, value) {
    var _this = this;

    if (this._value === 0) {
        this._value = value;
    }

    cards = cards.filter(function(card) {
        var index = _this._cards[operator].indexOf(card);

        if (index > -1) {
            _this._cards[operator].splice(index, 1);
        }
        else {
            return false;
        }

        return true;
    });

    this._pool.push({
        'cards': cards,
        'owner': operator
    });

    this.operator = ++this.operator % this.seating;
}

/**
 * Transfer cards given player in game pool.
 * @function
 * @private
 * @param {Number} pIdx player seating index.
 */
function transfer_cards(pIdx) {
    var i, l, o,
        pool = this._pool,
        cards = this._cards;

    for (i = 0, l = pool.length; i < l; i++) {
        o = pool[i];

        if (!o.cards) continue;

        cards[pIdx] = cards[pIdx].concat(o.cards);
    }
}

/**
 * Check up game is or not over.
 * @function
 * @private
 * @param {Number} pIdx player seating index.
 * @returns {Bool}
 */
function is_over() {
    if (this._pool.length > 0) return false;

    for (var i = 0; i < this._cards.length; i++) {
        if (this._cards[i] && this._cards[i].length === 0) {
            this.winner = i;
            return true;
        }
    }

    return false;
}

/**
 * Alloc cards.
 * @function
 * @private
 */
function distribute() {
    var sLen = this.seating,
        cLen = Cards.length(),
        indexs = [],
        i, index;

    if (this.playing) 
        throw new exception.Error('Brag.prototype.distribute', 220, '游戏中');

    for (i = 0; i < sLen; i++)
        this._cards[i] = [];

    for (i = 0; i < cLen; i++) 
        indexs[i] = i;

    while(indexs.length) {
        index = indexs.splice(utils.random(0, indexs.length-1), 1)[0];
        this._cards[indexs.length % sLen].push(index);
    }

    console.log('alloc cards complete: ', this._cards);
}

/**
 * Find first operator.
 * @function
 * @private
 */
function init_operator() {
    var cards = this._cards, 
        card, i, j;
    
    for (i = 0; i < cards.length; i++) {
        if (cards[i].indexOf(2) > -1) { // 2: 红心3索引
            this.operator = i;
            break;
        }
    }

    if (this.operator < 0) {
        // throw error 没找到红心3，Brag内部数据错误
        throw new exception.Error('Brag.prototype.start', 220, '卡片数据错误');
    }
}
