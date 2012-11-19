
var utils = require('../lib/utils');
var Cards = require('../models/cards');
var exception = require('../lib/exception');

exports.Brag = Brag;

function Brag(seating, chip) {
    if (arguments.length !== 2) 
        return;

    this.seating = seating;
    this.chip = chip;
    this.playing = false;
    this.operator = -1;

    this._pool = [];
    this._cards = [];
    this._startCount = 0;
}

Brag.prototype = {
    constructor: Brag,

    distribute: function() {
        var sLen = this.seating,
            cLen = Cards.length(),
            indexs = [],
            i, index;

        if (this.playing) 
            throw new utils.Error('Brag.prototype.distribute', 220, '游戏中');

        for (i = 0; i < sLen; i++)
            this._cards[i] = [];

        for (i = 0; i < cLen; i++) 
            indexs[i] = i;

        while(indexs.length) {
            index = indexs.splice(utils.random(0, indexs.length-1), 1)[0];
            this._cards[indexs.length % sLen].push(index);
        }

        console.log('alloc cards complete: ', this._cards);
    },

    start: function() {
        if (this.playing) 
            throw new utils.Error('Brag.prototype.distribute', 220, '游戏中');

        if (++this._startCount !== this.seating) 
            return false;

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
            throw new utils.Error('Brag.prototype.start', 220, '卡片数据错误');
        }

        this.playing = true;

        return true;
    },
    operate: function() {
        if (!this.playing) 
            return false;

    },
    over: function(message) {
        this.playing = false;
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


