
var socket_io = require('socket.io')
  , config = require('./config').config
  , cookie = require('express/node_modules/cookie')
  , connect = require('express/node_modules/connect')
  , parseCookies = connect.utils.parseSignedCookies
  , room = require('./controllers/room')
  , Brag = require('./controllers/brag');

exports.listen = function(httpServer, sessionStore) {
    var io = socket_io.listen(httpServer);

    io.set('authorization', function(data, callback) {
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

        callback('Socket handshake error, SessionID not found.', false);
    });

    io.of('/game').on('connection', function(client) {
        client.on('room create', room.create);
        client.on('room enter', room.enter);
        client.on('room leave', room.leave);
        client.on('room ready', room.ready);
        client.on('room operate', room.operate);
        client.on('room trusteeship', room.trusteeship);
        client.on('disconnect', room.trusteeship);
        client.on('room cancel trusteeship', room.cancelTrusteeship);
    });
};
