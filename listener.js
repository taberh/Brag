
var socket_io = require('socket.io')
  , config = require('./config').config
  , cookie = require('express/node_modules/cookie')
  , connect = require('express/node_modules/connect')
  , parseCookies = connect.utils.parseSignedCookies
  , Player = require('./controllers/player')
  , Room = require('./controllers/room')
  , User = require('./models').User;

exports.listen = function(httpServer, sessionStore) {
    var io = socket_io.listen(httpServer);

    io.set('authorization', function(data, callback) {
        if (data.query && data.query.openid) {
            data.user = User.findOne({ 'openid': data.query.openid }, function(err, user) {
                if (err || !user) callback('Socket handshake error, not found user', false);

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

        callback('Socket handshake error, SessionID not found.', false);
    });

    io.of('/game').on('connection', function(client) {

        if (client.handshake.user) {
            client.handshake.user['status'] = PLAYER_STATUS_NONE;
        }

        client.on('room create', Room.create);
        client.on('room enter', Room.enter);
        client.on('room leave', Room.leave);
        client.on('player ready', Player.ready);
        client.on('player start', Player.start);
        client.on('player operate', Player.operate);
        //client.on('player trusteeship', Player.trusteeship);
        //client.on('player cancel trusteeship', Player.cancelTrusteeship);
        client.on('disconnect', function () {
            if (client.handshake.user) {
                switch(client.handshake.user['status']) {
                    case PLAYER_STATUS_PLAYING:
                        //Player.trusteeship.call(this, function(){});
                        Room.leave.call(this, function() {});
                        break;
                    case PLAYER_STATUS_WAIT:
                    case PLAYER_STATUS_READY:
                        Room.leave.call(this, function(){});
                        break;
                    default:
                        break;
                }
            }
        });
    });
};
