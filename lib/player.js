
var Brag = require('./brag').Brag;
var exception = require('../lib/exception');
var models = require('../models');
var venues = models.Venue.venues;
var User = models.User;

global.PLAYER_STATUS_NONE = 0,
global.PLAYER_STATUS_WAIT = 1,
global.PLAYER_STATUS_READY = 2,
global.PLAYER_STATUS_PLAYING = 3,
global.PLAYER_STATUS_TRUSTEESHIP = 4;

/**
 * @static
 * @param {Function} [callback]
 */
exports.ready = function(callback) {
    var user = this.handshake.user, count = 0,
        venue, room, clients, client, i, aUser;

    try {
        exception.is_exist.user('player.ready', user);
        venue = venues[user.vid];
        exception.is_exist.venue('player.ready', venue);
        room = venue.rooms[user.rid];
        exception.is_exist.room('player.ready', room);
        
        user['status'] = PLAYER_STATUS_READY;

        clients = room.clients;

        for (i = 0; i < clients.length; i++) {
            if (!(client = clients[i])) 
                continue;

            aUser = client.handshake.user;

            if (aUser['status'] === PLAYER_STATUS_READY) {
                count++;
            }

            if (client !== this) {
                client.emit('player ready', {
                    'status': 0,
                    'message': user['nickname'] + '玩家完成准备',
                    'data': {
                        'pIdx': clients.indexOf(this)
                    }
                });
            }
        }

        callback && callback({
            'status': 0,
            'message': '准备成功'
        });

        // if all client are ready, that distribute cards
        if (count === room.seating) {
            if (!room.brag) {
                room.brag = new Brag(room.seating, room.chip);
            }

            room.brag.start();
            
            for (i = 0; i < clients.length; i++) {
                if (!(client = clients[i])) {
                    room.interrupt();
                    break;
                }

                client.handshake.user['status'] = PLAYER_STATUS_PLAYING;

                client.emit('player operate', {
                    'status': 0,
                    'message': '开始游戏，player index: ' + room.brag.operator,
                    'data': {
                        'operator': room.brag.operator,
                        'cards': room.brag.outputCards(i)
                    }
                });
            }
        }
    }
    catch(e) {
        callback && callback({
            'error': e,
            'status': e.code
        });
    }
};

/**
 * @static
 * @param {Object} [data]
 * @param {Number[]} [data.cards]
 * @param {Number} [data.value]
 * @param {Number} [data.pIdx] player index.
 * @param {Number} [data.cIdx] card index.
 * @param {Function} [callback]
 */
exports.operate = function(data, callback) {
    var user = this.handshake.user,
        venue, room, index, data, i, isOver, aUser;

    try {
        exception.is_exist.user('player.operate', user);
        venue = venues[user.vid];
        exception.is_exist.venue('player.operate', venue);
        room = venue.rooms[user.rid];
        exception.is_exist.room('player.operate', room);
        brag = room.brag;
        exception.is_exist.brag('player.operate', brag);

        clients = room.clients;
        index = clients.indexOf(this);

        if (index < 0) {
            room.interrupt();
            throw new exception.Error('player.operate', 200, '未找到玩家');
        }

        if (index !== brag.operator)
            throw new exception.Error('player.operate', 200, '还未到你出牌，请==');

        data = brag.operate.call(brag, index, data);

        isOver = brag.winner > -1;

        callback && callback({
            'status': 0,
            'message': '操作成功'
        });

        for (i = 0; i < clients.length; i++) {
            if (!(client = clients[i])) {
                room.interrupt();
                throw new exception.Error('player.operate', 200, '未找到玩家');
            }

            if (!isOver) {
                data.cards = brag.outputCards(i);
                //data.cards[i] = data.cards[i].length;
            }
            else {
                aUser = client.handshake.user;
                aUser['status'] = PLAYER_STATUS_WAIT;

                if (i === brag.winner) {
                    aUser['score'] += (brag.chip*(brag.seating-1));
                    aUser['count_win'] += 1;
                }
                else {
                    aUser['score'] -= brag.chip;
                    aUser['count_lose'] -= 1;
                }

                (function(aUser) {
                    User.findOne({'openid': aUser.openid}, function(err, user) {
                        if (err) 
                            return console.log(err.message)

                        if (user) {
                            user.score = aUser.score;
                            user.count_win = aUser.count_win;
                            user.count_lose = aUser.count_lose;
                            user.save(function(err) {
                                console.log('save user info ', !err ? 'success' : 'error');    
                            });
                        }
                    });
                }(aUser));
            }

            client.emit('player operate', {
                'status': 0,
                'message': '操作成功',
                'data': data
            });
        }
    }
    catch(e) {
        callback && callback({
            'error': e,
            'status': e.code
        });
    }
};
