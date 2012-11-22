
var utils = require('../lib/utils');
var exception = require('../lib/exception');
var models = require('../models');
var Cards = models.Cards;

exports.Brag = Brag;

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
    operate: function() {
        var result;

        if (!this.playing) 
            return false;

        if (!this._pool.length && !arguments[1] && !arguments[1].length) {
            throw new exception.Error('Brag.prorotype.operate', 220, '参数错误');
        }

        console.log('operate: ', arguments);

        if (arguments.length === 1) {
            operate_believe.call(this, arguments[0]);
        } 
        else {
            if (typeof arguments[1] === 'number') {
                operate_turnon.apply(this, arguments);
            }
            else {
                operate_throw.apply(this, arguments);
            }
        }

        if (is_over.call(this)) {
            this.over();

            result = {
                'winner': this.winner
            };
        }
        else {
            if (this._value === 0) {
                result = {
                    'operator': this.operator
                };
            }
            else {
                result = {
                    'value': this._value,
                    'operator': this.operator,
                    'operate': this._pool[this._pool.length - 1]
                };
            }
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

function operate_believe(operator) {
    this._pool.push({'owner': operator});
    this.operator = ++this.operator % this.seating;

    var o = this._pool[this._pool.length - this.seating];

    if (o && !o.cards) {
        this._pool = [];
        this._value = 0;
    }
}

function operate_turnon(operator, owner, index) {
    var h = owner - operator,
        o, c;

    h = h > 0 ? (3-h) : Math.abs(h);

    console.log('pool history index: ', h);

    o = this._pool[this._pool.length - h];

    if (!o.cards || !o.cards.length) {
        throw new exception.Error('operate_turnon', 220, '参数错误');
    }

    c = Cards.get(o.cards[index]);

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
