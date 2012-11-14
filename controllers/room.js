
var venues = require('../models/venues').venues;
var player = require('./player');
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

        try {
            room.enter(this);

            players = [];

            room.clients.forEach(function(client) {
                if (client) {
                    client = player.output_user_info(client);
                }

                players.push(client);
            });

            callback && callback({
                'status': 0,
                'message': '进入房间',
                'data': {
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
        exception.can_leave('room.leave', user);

        venue = venues[user.vid];
        exception.is_exist.venue('room.venue', venue);

        room = venue.rooms[user.rid];
        exception.is_exist.room('room.leave', room);

        try {
            room.leave(this);

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
            callback && callback({
                'status': e.code,
                'message': e.message
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
        outputInfo = player.output_user_info(aClient);

        for (i = 0; i < clients.length; i++) {
            client = clients[i];

            if (client && client !== aClient) {
                client.emit('room enter', {
                    'status': 0,
                    'message': outputInfo['nickname'] + '玩家进入房间',
                    'data': {
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
            clients[index] = null;
            
            for (var i = 0; i < clients.length; i++) {
                client = clients[i];

                if (client && client !== aClient) {
                    client.emit('room leave', {
                        'status': 0,
                        'message': aClient.handshake.user['nickname'] + '玩家退出房间',
                        'data': {
                            'uid': aClient.handshake.user['_id']
                        }
                    });
                }
            }

            aClient.handshake.user['status'] = PLAYER_STATUS_NONE;

            return;
        }

        throw new exception.Error('Room.prototype.leave', 210, '该房间内未找到玩家');
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
