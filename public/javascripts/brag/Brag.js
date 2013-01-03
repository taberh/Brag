
/**
 *  Brag.js
 *  Brag
 *
 *  description: 游戏数据模型单例类，负责创建socket连接和数据管理
 *
 *  Create by taber on 2012-12-21(末日)
 *  Copyright 2012 TONGZI. All rights reserved.
 */

/**
 * Brag single instance class
 * @class
 * @extend Object
 */
var Brag = (function() {

    this.PLAYER_STATUS_NONE = 0;
    this.PLAYER_STATUS_WAIT = 1;
    this.PLAYER_STATUS_READY = 2;
    this.PLAYER_STATUS_PLAYING = 3;
    this.PLAYER_STATUS_TRUSTEESHIP = 4;

    var instance = null;

    /**
     *  Brag constructor
     *  @constructor
     *  @class
     *  @extend Object
     */
    function Brag() {
        this._socket = null;
        this.players = [];
        this.index = -1;
        this.operator = -1;
        this.value = 0;
        this.connected = false; 
        this.reconnected = false;
        this.playing = false;
        this.scene = null;
    }

    Brag.prototype = {
        constructor: Brag,

        /**
         * init socket and listener event
         */
        init: function() {
            this._socket = io.connect('/brag');
            this._socket.on('connect', wrapFunc(this.onConnect, this));
            this._socket.on('connect_failed', wrapFunc(this.onConnectFailed, this));
            this._socket.on('reconnect', wrapFunc(this.onReconnect, this));
            this._socket.on('reconnect_failed', wrapFunc(this.onReconnectFailed, this));
            this._socket.on('error', wrapFunc(this.onError, this));
            this._socket.on('disconnect', wrapFunc(this.onDisconnect, this));
            this._socket.on('room enter', wrapFunc(this.onEntrance, this));
            this._socket.on('room leave', wrapFunc(this.onLeave, this));
            this._socket.on('room interrupt', wrapFunc(this.onInterrupt, this));
            this._socket.on('player ready', wrapFunc(this.onReady, this));
            this._socket.on('player operate', wrapFunc(this.onOperate, this));
            
            function wrapFunc(func, target) {
                return function() {
                    func.apply(target, arguments);
                };
            }
        },

        disconnect: function() {
            this._socket.disconnect();
        },

        /**
         * send enter event
         * @param {Object} params
         * @param {Function} callback
         */
        enter: function(params, callback) {
            console.log('start enter...');

            if (!this._socket) return;

            var _this = this;

            if (params.vid === undefined) {
                console.warn('场馆ID不存在.');
                return;
            }

            this._socket.emit('room enter', params, function(result) {
                console.log('room enter: ', result);

                if (result.status === 0) {
                    _this.players = result.data.players;
                    _this.index = result.data.pIdx;
                }
                else {
                    console.warn(result.error && result.error.message || '进入房间失败');
                }

                callback && callback(result);
            });
        },

        /**
         * send leave event
         * @param {Function} callback
         */
        leave: function(callback) {
            console.log('start leave...');
                     
            if (!this._socket) return;

            var _this = this;

            this._socket.emit('room leave', function(result) {
                console.log('leave room: ', result);

                if (result.status === 0) {
                    _this.players = [];
                    _this.index = -1;
                }
                else {
                    console.warn(result.error && result.error.message || '离开房间失败');
                }

                callback && callback(result);
            });
        },

        /**
         * send ready event
         * @param {Function} callback
         */
        ready: function(callback) {
            console.log('start ready...');
                     
            if (!this._socket) return;

            var _this = this;

            this._socket.emit('player ready', function(result) {
                console.log('player ready: ', result);

                if (result.status === 0) {
                    _this.players[_this.index]['status'] = PLAYER_STATUS_READY;
                }
                else {
                    console.warn(result.error && result.error.message || '准备操作失败');
                }

                callback && callback(result);
            });
        },

        /**
         * send operate event
         * @param {Object} params
         * @param {Function} callback
         */
        operate: function(params, callback) {
            console.log('start operate...');

            if (!this._socket) return;

            var _this = this;

            this._socket.emit('player operate', params, function(result) {
                console.log('player operate: ', result);

                if (result.status !== 0) {
                    console.warn(result.error && result.error.message || '操作失败.');
                }

                callback && callback(result);
            });
        },

        onConnect: function() {
            console.log('connect...');
            this.connected = true;
            this.scene && this.scene.onConnect && this.scene.onConnect();
        },

        onConnectFailed: function() {
            console.log('connect failed...');
            this.connected = false;
            this.scene && this.scene.onConnectFailed && this.scene.onConnectFailed();
        },

        onReconnect: function() {
            console.log('reconnect...');
            this.reconnect = true;
            this.scene && this.scene.onReconnect && this.scene.onReconnect();
        },

        onReconnectFailed: function() {
            console.log('reconnect failed...');
            this.reconnect = false;
            this.scene && this.scene.onReconnectFailed && this.scene.onReconnectFailed();
        },

        onDisconnect: function() {
            console.log('disconnect...');
            this.connected = false;
            this.scene && this.scene.onDisconnect && this.scene.onDisconnect();
        },

        onError: function() {
            console.log('error...');
            this.scene && this.scene.onError && this.scene.onError();
        },

        onEntrance: function(result) {
            console.log(result.message || result.error && result.error.message);

            if (result.status === 0) {
                this.players[result.data['pIdx']] = result.data.player;
            }

            this.scene && this.scene.onEntrance && this.scene.onEntrance(result);
        },

        onLeave: function(result) {
            console.log(result.message || result.error && result.error.message);

            if (result.status === 0) {
                this.players[result.data['pIdx']] = null;
            }

            this.scene && this.scene.onLeave && this.scene.onLeave(result);
        },

        onInterrupt: function(result) {
            console.warn(result.message || '意外中断，sorry!!');
            this.playing = false;
            this.scene && this.scene.onInterrupt && this.scene.onInterrupt(result);
        },

        onReady: function(result) {
            console.log(result.message || result.error && result.error.message);

            if (result.status === 0) {
                var player = this.players[result.data['pIdx']];

                if (player) {
                    player['status'] = PLAYER_STATUS_READY;
                }
                else {
                    console.log(result.data['pIdx'] + '玩家不存在');
                }
            }

            this.scene && this.scene.onReady && this.scene.onReady(result);
        },

        onOperate: function(result) {
            console.log(result.message || result.error && result.error.message);

            if (result.status === 0) {
                if (result.data.winner !== undefined) {
                    this.playing = false;
                    this.operator = -1;
                    this.value = 0;

                    this.players.forEach(function(player) {
                        player['status'] = PLAYER_STATUS_NONE;
                    });
                }
                else {
                    this.playing = true;
                    this.operator = result.data.operator;
                    this.value = result.data.value;
                }
            }

            this.scene && this.scene.onOperate && this.scene.onOperate(result);
        }
    };

    return {
        getInstance: function() {
            if (!instance) {
                instance = new Brag();
                instance.init();
            }

            return instance;
        }
    }
}());
