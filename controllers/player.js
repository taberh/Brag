
var venues = require('../models/venues');
var exception = require('../lib/exception');

global.PLAYER_STATUS_NONE = 0,
global.PLAYER_STATUS_WAIT = 1,
global.PLAYER_STATUS_READY = 2,
global.PLAYER_STATUS_PLAYING = 3,
global.PLAYER_STATUS_TRUSTEESHIP = 4;

exports.ready = function() {
    var user = this.handshake.user,
        venue, room;

    try {
        exception.is_exist.user('player.ready', user);
        venue = venues[user.vid];
        exception.is_exist.venue('player.ready', venue);
        room = venue.rooms[user.rid];
        exception.is_exist.room('player.ready', room);
        
        try {
            user['status'] = PLAYER_STATUS_READY;

            // tell other clients in this room and launch game

            callback && callback({
                'status': 0,
                'message': '准备成功'
            });
        }
        catch(e) {
            callback && callback({
                'error': e,
                'status': e.code
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

exports.operate = function() {
    var user = this.handshake.user,
        venue, room;

    var callback = arguments[-1];

    try {
        exception.is_exist.user('player.operate', user);
        venue = venues[user.vid];
        exception.is_exist.venue('player.operate', venue);
        room = venue.rooms[user.rid];
        exception.is_exist.room('player.operate', room);
        
        try {
            if (!arguments.length) {
                // process believe
            }

            if (typeof arguments[0] === 'string') {
                // process turnon
            }
            else {
                // process put cards
            }

            callback && callback({
                'status': 0,
                'message': '操作成功'
            });
        }
        catch(e) {
            callback && callback({
                'error': e,
                'status': e.code
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

exports.trusteeship = function(callback) {
    var user = this.handshake.user,
        venue, room;

    try {
        exception.is_exist.user('player.trusteeship', user);

        if (user['status'] === PLAYER_STATUS_TRUSTEESHIP) 
            return;

        exception.can_trusteeship('player.trusteeship', user);
        
        venue = venues[user.vid];
        exception.is_exist.venue('player.trusteeship', venue);

        room = venue.rooms[user.rid];
        exception.is_exist.room('player.trusteeship', room);

        try {
            user['status'] = PLAYER_STATUS_TRUSTEESHIP;

            // tell other clients in this room

            callback && callback({
                'status': 0,
                'message': '托管成功'
            });
        }
        catch(e) {
            callback && callback({
                'error': e,
                'status': e.code
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

exports.cancelTrusteeship = function(callback) {
    var user = this.handshake.user,
        venue, room;

    try {
        exception.is_exist.user('player.cancelTrusteeship', user);
        exception.is_trusteeship('player.cancelTrusteeship', user);

        venue = venues[user.vid];
        exception.is_exist.venue('player.cancelTrusteeship', venue);

        room = venue.rooms[user.rid];
        exception.is_exist.room('player.cancelTrusteeship', room);
        
        try {
            user['status'] = PLAYER_STATUS_PLAYING;

            // tell other clients in this room

            callback && callback({
                'status': 0,
                'message': '取消托管成功'
            });
        }
        catch(e) {
            callback && callback({
                'error': e,
                'status': e.code
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

exports.output_user_info = function(client) {
    var user = client.handshake.user;

    if (!user) return null;

    return {
        '_id': user['_id'],
        'nickname': user['nickname'],
        'openid': user['openid'],
        'sex': user['sex'],
        'avatar_url': user['avatar_url'],
        'score': user['score'],
        'count_win': user['count_win'],
        'count_lose': user['count_lost'],
        'status': user['status']
    }
};
