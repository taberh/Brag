
var Brag = require('./brag');
var venues = require('../models/venues').venues;

global.PLAYER_STATUS_NONE = 0,
global.PLAYER_STATUS_WAIT = 1,
global.PLAYER_STATUS_READY = 2,
global.PLAYER_STATUS_PLAYING = 3,
global.PLAYER_STATUS_TRUSTEESHIP = 4;

exports.create = function(chip, name, password, callback) {
    var player = this.handshake.user,
        room, roomID;

    if (!callback || typeof password === 'function') {
        callback = password;
        password = undefined;
    }

    if (!error_player(player, callback)) return;

    room = new Room(chip, player['_id'], name, password);
    roomID = gen_room_id_in_venues(0);

    venues[0].rooms[roomID] = room;

    callback({
        'status': 0,
        'message': '房间创建成功',
        'data': {
            rid: roomID
        }
    });
};

exports.enter = function(venueID, roomID, password, callback) {
    var player = this.handshake.user,
        venue = venues[venueID],
        room, players;

    if (!callback && typeof roomID === 'function') {
        callback = roomID;
        roomID = undefined;
    }

    if (!error_player(player, callback)) return;
    if (!error_venue(venue, callback)) return;

    if (typeof player.vid !== 'undefined' || 
        typeof player.rid !== 'undefined') {
            return callback({
                'status': 204,
                'message': '请先退出当前房间再进入'
            });
    }

    if (typeof roomID !== 'undefined') {
        room = venue.rooms[roomID];

        if (!error_room(room, callback)) return;
    }
    else {
        roomID = alloc_room_id_in_venues(venueID);
        room = venue.rooms[roomID];

        if (!room) {
            room = new Room(venue.chip);
            venue.rooms[roomID] = room;
        }
    }

    // verify
    if (!room.password) {
        if (room.password != password) {
            return callback({
                'status': 202,
                'message': '密码错误'
            });
        }
    }

    player.vid = venueID;
    player.rid = roomID;
    venue.online++;

    try {
        room.enter(this);

        players = [];

        room.players.forEach(function(client) {
            if (client) {
                client = build_player_info_from_client(client);
            }

            players.push(client);
        });

        callback({
            'status': 0,
            'message': '进入房间',
            'data': {
                'players': players
            }
        });
    } 
    catch(e) {
        callback({
            'status': e.code,
            'message': e.message
        });
    }
};

exports.leave = function(callback) {
    var player = this.handshake.user,
        venue, room;

    if (!error_player(player, callback)) return;

    if (player['status'] === PLAYER_STATUS_PLAYING) {
        return callback({
            'status': 207,
            'message': '游戏状态不能退出'
        });
    }

    if (player['status'] === PLAYER_STATUS_NONE) {
        return callback({
            'status': 211,
            'message': '不在房间内，无需退出操作'
        });
    }

    venue = venues[player.vid];
    if (!error_venue(venue, callback)) return;
    room = venue.rooms[player.rid];
    if (!error_room(room, callback)) return;

    try {
        room.leave(this);

        if (!room.hasPlayer())
            delete venue.rooms[player.rid];

        delete player.vid;
        delete player.rid;
        venue.online--;

        callback({
            'status': 0,
            'message': '退出成功'
        });
    }
    catch(e) {
        callback({
            'status': e.code,
            'message': e.message
        });
    }
};

exports.ready = function() {
    var player = this.handshake.user,
        venue, room;

    if (!error_player(player, callback)) return;
    venue = venues[player.vid];
    if (!error_venue(venue, callback)) return;
    room = venue.rooms[player.rid];
    if (!error_room(room, callback)) return;

    try {
        room.ready(this);

        callback({
            'status': 0,
            'message': '准备成功'
        });
    }
    catch(e) {
        callback({
            'status': e.code,
            'message': e.message
        });
    }
};

exports.operate = function() {
    var player = this.handshake.user,
        venue, room;

    var callback = arguments[-1];

    if (typeof callback !== 'function') {
        return callback({
            'status': 208,
            'message': '参数错误'
        });
    }

    if (!error_player(player, callback)) return;
    venue = venues[player.vid];
    if (!error_venue(venue, callback)) return;
    room = venue.rooms[player.rid];
    if (!error_room(room, callback)) return;

    try {
        room.operate(this, arguments[0], arguments[1]);

        callback({
            'status': 0,
            'message': '操作成功'
        });
    }
    catch(e) {
        callback({
            'status': e.code,
            'message': e.message
        });
    }
};

exports.trusteeship = function(callback) {
    var player = this.handshake.user,
        venue, room;

    if (!error_player(player, callback)) return;

    if (player['status'] !== PLAYER_STATUS_PLAYING) {
        return callback({
            'status': 209,
            'message': '非游戏状态不能托管'
        });
    }

    if (player['status'] === PLAYER_STATUS_TRUSTEESHIP) {
        return callback({
            'status': 212,
            'message': '已托管，无需重复操作'
        });
    }

    venue = venues[player.vid];
    if (!error_venue(venue, callback)) return;
    room = venue.rooms[player.rid];
    if (!error_room(room, callback)) return;

    try {
        room.trusteeship(this);

        callback({
            'status': 0,
            'message': '托管成功'
        });
    }
    catch(e) {
        callback({
            'status': e.code,
            'message': e.message
        });
    }
};

exports.cancelTrusteeship = function(callback) {
    var player = this.handshake.user,
        venue, room;

    if (!error_player(player, callback)) return;

    if (player['status'] !== PLAYER_STATUS_TRUSTEESHIP) {
        return callback({
            'status': 210,
            'message': '未托管'
        });
    }

    venue = venues[player.vid];
    if (!error_venue(venue, callback)) return;
    room = venue.rooms[player.rid];
    if (!error_room(room, callback)) return;

    try {
        room.cancelTrusteeship(this);

        callback({
            'status': 0,
            'message': '取消托管成功'
        });
    }
    catch(e) {
        callback({
            'status': e.code,
            'message': e.message
        });
    }
};

function CustomError(message, code) {
    this.message = message;
    this.code = code;
}

CustomError.prototype = new Error;
CustomError.prototype.constructor = CustomError;

function Room(chip, owner, name, password) {
    this.owner = owner;
    this.chip = chip;
    this.name = name;
    this.password = password;
    this.players = [];
    this.seating = 3;
}

Room.prototype = {
    constructor: Room,
    hasSeat: function() {
        if (this.players.length < this.seating) {
            return true;
        }
        else 
        if (this.players.length === this.seating) {
            for (var i = 0; i < this.players.length; i++) {
                if (!this.players[i]) 
                    return true;
            }
        }
        
        return false;
    },
    hasPlayer: function() {
        if (!this.players.length)
            return false;

        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i]) {
                return true;
            }
        }

        return false;
    },
    enter: function(client) {
        var i, player, newPlayer
            players = this.players;

        if (!this.hasSeat()) 
            throw new CustomError('该房间座位已满', 205);

        if (players.length < 3) {
            players.push(client);
        }
        else {
            for (var i = 0; i < players.length; i++) {
                if (!players[i]) 
                    players[i](client);
            }

            if (i === players.length)
                throw new CustomError('该房间座位已满', 205);
        }

        client.handshake.user['status'] = PLAYER_STATUS_WAIT;
        newPlayer = build_player_info_from_client(client);

        for (i = 0; i < players.length; i++) {
            player = players[i];

            if (player && player !== client) {
                player.emit('room enter', {
                    'status': 0,
                    'message': newPlayer['nickname'] + '玩家进入房间',
                    'data': {
                        'player': newPlayer
                    }
                });
            }
        }
    },
    leave: function(client) {
        var i, player,
            players = this.players,
            index = players.indexOf(client);

        if (index >= 0) {
            players[index] = null;
            
            for (var i = 0; i < players.length; i++) {
                player = players[i];

                if (player && player !== client) {
                    player.emit('room leave', {
                        'status': 0,
                        'message': client['_id'] + '玩家退出房间',
                        'data': {
                            'playerID': client['_id']
                        }
                    });
                }
            }

            client.handshake.user['status'] = PLAYER_STATUS_NONE;

            return;
        }

        throw new CustomError('该房间内未找到玩家', 210);
    },
    ready: function(client) {
        client.handshake.user['status'] = PLAYER_STATUS_READY;
    },
    operate: function() {
        if (!arguments.length) {
            // cmd believe
        }

        if (typeof arguments[0] === 'string') {
            // cmd turnon
        }
        else {
            // cmd put cards
        }
    },
    trusteeship: function() {
        client.handshake.user['status'] = PLAYER_STATUS_TRUSTEESHIP;
    },
    cancelTrusteeship: function() {
        client.handshake.user['status'] = PLAYER_STATUS_PLAYING;
    }
};

/*
 *  生成房间ID: 从当前场馆中查找未被使用的房间ID
 */
function gen_room_id_in_venues(index) {
    var rooms = venues[index].rooms,
        len = rooms.length, i = 0;

    while(i < len) {
        if (typeof rooms[i] === 'undefined')
            break;
        i++;
    }

    return i;
}

/*
 *  分配房间ID: 从当前场馆中查找有空座位的房间ID，没找到则创建新房间ID
 */
function alloc_room_id_in_venues(index) {
    var rooms = venues[index].rooms,
        len = rooms.length, i = 0, room;

    while (i < len) {
        room = rooms[i];
        if (room instanceof Room && room.hasSeat())
            break;

        i++;
    }

    return i !== len ? 
                i : 
                gen_room_id_in_venues(index);
}

/*
 * Error Process Wrap
 */

function error_room(room, callback) {
    if (!room) {
        callback({
            'status': 203,
            'message': '房间不存在'
        });
        return false;
    }

    return true;
}

function error_venue(venue, callback) {
    if (!venue) {
        callback({
            'status': 206,
            'message': '场馆不存在'
        });
        return false;
    }

    return true;
}

function error_player(player, callback) {
    if (!player) {
        callback({
            'status': 201,
            'message': '玩家不存在'
        });
        return false;
    }

    return true;
}

function build_player_info_from_client(client) {
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
}
