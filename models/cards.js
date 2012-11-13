
var config = require('../config').config;

/*
 * card = {
 *   suit: 1(Heart) || 2(Spade) || 3(Club) || 4(Diamond)
 *   value: 1~13(A-K) 14-15(Jokers)
 * }
 */
var n = config['cards_pair_number'] || 1,
    cards = [],
    i, j, k;

var cards = []

for (i = 0; i < n; i++) {
    for (j = 1; j <= 4; j++) {
        for (k = 1; k <= 13; k++) {
            cards.push({
                suit: j,
                value: k
            });
        }
    }

    cards.push({ suit: 0, value: 14 });
    cards.push({ suit: 0, value: 15 });
}

exports.length = function() {
    return cards.length;
};
exports.get = function(index) {
    return cards[index];
};
