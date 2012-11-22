
var models = require('../models');
var venues = models.Venue.venues;
var exception = require('../lib/exception');

exports.create = function(chip, name, password, callback) {
    var user = this.handshake.user,
        room, roomID;

    if (!callback && typeof password === 'function') {
        callback = password;
        password = undefined;
    }

    try {
        exception.is_exist.user('room.create', user);

        room = new Room(chip, user['_id'], name, password);
        roomID = gen_room_id_in_venues(0);
        venues[0].rooms[roomID] = room;

        callback && callback({
            'status': 0,
            'message': '房间创建成功',
            'data': {
                rid: roomID
            }
        });
    }
    catch(e) {
        callback && callback({
            'error': e,
            'status': e.code
        });
    }
};

exports.enter = function(venueID, roomID, password, callback) {
    var user = this.handshake.user,
        venue = venues[venueID],
        room, players;

    if (!callback && typeof roomID === 'function') {
        callback = roomID;
        roomID = undefined;
    }

    try {
        exception.is_exist.user('room.enter', user);
        exception.is_not_in_room('room.enter', user);
        exception.is_exist.venue('room.enter', venue);
        
        if (typeof roomID !== 'undefined') {
            room = venue.rooms[roomID];
            exception.is_exist.room('room.enter', room);
        }
        else {
            roomID = alloc_room_id_in_venues(venueID);
            room = venue.rooms[roomID];

            if (!room) {
                room = new Room(venue.chip);
                venue.rooms[roomID] = room;
            }
        }

        if (!room.password) {
            if (room.password != password) {
                return callback && callback({
                    'status': 202,
                    'message': '房间密码不正确'
                });
            }
        }

        user.vid = venueID;
        user.rid = roomID;
        venue.online++;

        room.enter(this);

        players = [];

        room.clients.forEach(function(client) {
            if (client) {
                client = output_user_info(client);
            }

            players.push(client);
        });

        callback && callback({
            'status': 0,
            'message': '进入房间',
            'data': {
                'pIdx': room.clients.indexOf(this),
                'players': players
            }
        });
    }
    catch(e) {
        callback && callback({
            'error': e,
            'status': e.code
        });
    }
};

exports.leave = function(callback) {
    var user = this.handshake.user,
        venue, room;

    try {
        exception.is_exist.user('room.leave', user);
        exception.is_in_room('room.leave', user);

        venue = venues[user.vid];
        exception.is_exist.venue('room.venue', venue);

        room = venue.rooms[user.rid];
        exception.is_exist.room('room.leave', room);

        room.leave(this);

        if (room.brag && room.brag.playing)
            venue.online -= 2;

        if (!room.hasPlayer())
            delete venue.rooms[user.rid];

        delete user.vid;
        delete user.rid;
        venue.online--;

        callback && callback({
            'status': 0,
            'message': '退出成功'
        });
    }
    catch(e) {
        console.log(e, e.domain);
        callback && callback({
            'error': e,
            'status': e.code
        });
    }
};

function Room(chip, owner, name, password) {
    this.owner = owner;
    this.chip = chip;
    this.name = name;
    this.password = password;
    this.clients = [];
    this.seating = 3;
}

Room.prototype = {
    constructor: Room,

    hasSeat: function() {
        if (this.clients.length < this.seating) {
            return true;
        }
        else 
        if (this.clients.length === this.seating) {
            for (var i = 0; i < this.clients.length; i++) {
                if (!this.clients[i]) 
                    return true;
            }
        }
        
        return false;
    },

    hasPlayer: function() {
        if (!this.clients.length)
            return false;

        for (var i = 0; i < this.clients.length; i++) {
            if (this.clients[i]) {
                return true;
            }
        }

        return false;
    },

    enter: function(aClient) {
        var i, client, outputInfo, 
            clients = this.clients;

        if (!this.hasSeat()) 
            throw new exception.Error('Room.prototype.enter', 205, '该房间座位已满');

        if (clients.length < 3) {
            clients.push(aClient);
        }
        else {
            for (var i = 0; i < clients.length; i++) {
                if (!clients[i]) {
                    clients[i] = aClient;
                    break;
                }
            }

            if (i === clients.length)
                throw new exception.Error('Room.prototype.enter', 205, '该房间座位已满');
        }

        aClient.handshake.user['status'] = PLAYER_STATUS_WAIT;
        outputInfo = output_user_info(aClient);

        for (i = 0; i < clients.length; i++) {
            client = clients[i];

            if (client && client !== aClient) {
                client.emit('room enter', {
                    'status': 0,
                    'message': outputInfo['nickname'] + '玩家进入房间',
                    'data': {
                        'pIdx': clients.indexOf(aClient),
                        'player': outputInfo
                    }
                });
            }
        }
    },

    leave: function(aClient) {
        var i, client,
            clients = this.clients,
            index = clients.indexOf(aClient);

        if (index >= 0) {
            if (this.brag && this.brag.playing) {
                this.interrupt(aClient);
                return;
            }

            aClient.handshake.user['status'] = PLAYER_STATUS_NONE;
            clients[index] = null;
            
            for (i = 0; i < clients.length; i++) {
                client = clients[i];

                if (client && client !== aClient) {
                    client.emit('room leave', {
                        'status': 0,
                        'message': aClient.handshake.user['nickname'] + '玩家退出房间',
                        'data': {
                            'pIdx': index
                        }
                    });
                }
            }

            return;
        }

        throw new exception.Error('Room.prototype.leave', 210, '该房间内未找到玩家');
    },
    
    interrupt: function(aClient) {
        var clients = this.clients,
            client, i, index;

        index = clients.indexOf(aClient);

        for (i = 0; i < clients.length; i++) {
            client = clients[i];

            if (client && client !== aClient) {
                client.handshake.user['status'] = PLAYER_STATUS_NONE;
                delete client.handshake.user['rid'];
                delete client.handshake.user['vid'];

                client.emit('room interrupt', {
                    'status': 0,
                    'message': aClient.handshake.user['nickname'] + '玩家强行退出，游戏中断',
                    'data': {
                        'pIdx': index
                    }
                });
            }
        }

        this.clients = [];
    }
};

/*
 *  生成房间ID: 从当前场馆中查找未被使用的房间ID
 */
function gen_room_id_in_venues(index) {
    var rooms = venues[index].rooms,
        i = 0,
        l = rooms.length;

    while(i < l) {
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
        room,
        i = 0,
        l = rooms.length;

    while (i < l) {
        room = rooms[i];

        if (room instanceof Room && room.hasSeat())
            break;

        i++;
    }

    return i !== l ? 
            i : 
            gen_room_id_in_venues(index);
}

function output_user_info(client) {
    var user = client.handshake.user;

    if (!user) return null;

    return {
        'id': user['_id'],
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
