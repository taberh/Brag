
var socket_io = require('socket.io')
  , config = require('./config').config
  , cookie = require('express/node_modules/cookie')
  , connect = require('express/node_modules/connect')
  , parseCookies = connect.utils.parseSignedCookies
  , player = require('./controllers/player')
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

        if (client.handshake.user) {
            client.handshake.user['status'] = PLAYER_STATUS_NONE;
        }

        client.on('room create', room.create);
        client.on('room enter', room.enter);
        client.on('room leave', room.leave);
        client.on('player ready', player.ready);
        client.on('player operate', player.operate);
        client.on('player trusteeship', player.trusteeship);
        client.on('player cancel trusteeship', player.cancelTrusteeship);
        client.on('disconnect', function () {
            if (client.handshake.user) {
                switch(client.handshake.user['status']) {
                    case PLAYER_STATUS_PLAYING:
                        player.trusteeship(function(){});
                        break;
                    case PLAYER_STATUS_WAIT:
                    case PLAYER_STATUS_READY:
                        room.leave.call(this, function(){});
                        break;
                    default:
                        break;
                }
            }
        });
    });
};
