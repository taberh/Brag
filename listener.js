
var socket_io = require('socket.io'),
    cookie = require('express/node_modules/cookie'),
    connect = require('express/node_modules/connect'),
    parseCookies = connect.utils.parseSignedCookies,
    config = require('./config').config,
    Player = require('./lib/player'),
    Room = require('./lib/room'),
    User = require('./models').User;

exports.register = function(httpServer, sessionStore) {
    var io = socket_io.listen(httpServer);

    io.configure(function() {
        io.set('transports', ['xhr-polling', 'websocket']);
        io.set('polling duration', 10);
    });

    io.configure('production', function() {
        io.enable('browser client etag');
        io.enable('browser client gzip');
        io.enable('browser client minification');

    });

    io.set('authorization', function(data, callback) {
        if (data.query && data.query.openid) {
            data.user = User.findOne({ 
                'openid': data.query.openid 
            }, function(err, user) {
                if (err || !user) 
                    callback('Handshake Error, Not found user', false);

                data.user = user;
                callback(null, true);
            });
            return;
        }

        data.cookies = cookie.parse(data.headers.cookie || '');
        data.cookies = parseCookies(data.cookies, config.session_secret);
        data.sessionID = data.cookies['connect.sid'];

        if (data.sessionID) {
            sessionStore.get(data.sessionID, function(err, session) {
                if (err) {
                    return callback(err.message, false);
                }
                else if (!session) {
                    return callback('Session not found.', false);
                }

                data.user = session.user;
                callback(null, true);
            });
            return;
        }

        callback('SessionID not found.', false);
    });

    io.of('/brag').on('connection', function(client) {
        if (client.handshake.user) {
            client.handshake.user['status'] = PLAYER_STATUS_NONE;
        }

        client.on('room create', Room.create);
        client.on('room enter', Room.enter);
        client.on('room leave', Room.leave);
        client.on('player ready', Player.ready);
        client.on('player operate', Player.operate);
        client.on('disconnect', function () {
            if (client.handshake.user) {
                Room.leave.call(this, function() {
                    console.log(arguments);
                });
            }
        });
    });
};
