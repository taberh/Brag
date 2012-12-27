
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
        this.cards = null;
        this.index = -1;
        this.operator = -1;

        this.currentValue = 0;
        this.followCards = [];

        this.turnonPlayerIndex = -1;
        this.turnonCardIndex = -1;

        this.connected = false; 
        this.playing = false;
        this.scene = null;
    }

    Brag.prototype = {
        constructor: Brag,

        init: function() {
            this._socket = io.connect('/brag');
            this._socket.on('connect', wrapFunc(this._onConnect, this));
            this._socket.on('connect_failed', wrapFunc(this._onConnectFailed, this));
            this._socket.on('reconnect', wrapFunc(this._onReconnect, this));
            this._socket.on('reconnect_failed', wrapFunc(this._onReconnectFailed, this));
            this._socket.on('error', wrapFunc(this._onError, this));
            this._socket.on('disconnect', wrapFunc(this._onDisconnect, this));
            this._socket.on('room enter', wrapFunc(this._onEntrance, this));
            this._socket.on('room leave', wrapFunc(this._onLeave, this));
            this._socket.on('room interrupt', wrapFunc(this._onInterrupt, this));
            this._socket.on('player ready', wrapFunc(this._onReady, this));
            this._socket.on('player operate', wrapFunc(this._onOperate, this));
            
            function wrapFunc(func, target) {
                return function() {
                    func.apply(target, arguments);
                };
            }
        },

        disconnect: function() {
            this._socket.disconnect();
        },

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

        _onConnect: function() {
            console.log('connect...');
            this.connected = true;
            this.scene && this.scene.onConnect && this.scene.onConnect();
        },

        _onConnectFailed: function() {
            console.log('connect failed...');
            this.scene && this.scene.onConnectFailed && this.scene.onConnectFailed();
        },

        _onReconnect: function() {
            console.log('reconnect...');
            this.scene && this.scene.onReconnect && this.scene.onReconnect();
        },

        _onReconnectFailed: function() {
            console.log('reconnect failed...');
            this.scene && this.scene.onReconnectFailed && this.scene.onReconnectFailed();
        },

        _onDisconnect: function() {
            console.log('disconnect...');
            this.connected = false;
            this.scene && this.scene.onDisconnect && this.scene.onDisconnect();
        },

        _onError: function() {
            console.log('error...');
            this.scene && this.scene.onError && this.scene.onError();
        },

        _onEntrance: function(result) {
            console.log(result.message || result.error && result.error.message);

            if (result.status === 0) {
                this.players[result.data['pIdx']] = result.data.player;
            }

            this.scene && this.scene.onEntrance && this.scene.onEntrance(result);
        },

        _onLeave: function(result) {
            console.log(result.message || result.error && result.error.message);

            if (result.status === 0) {
                this.players[result.data['pIdx']] = null;
            }

            this.scene && this.scene.onLeave && this.scene.onLeave(result);
        },

        _onInterrupt: function(result) {
            console.warn(result.message || '意外中断，sorry!!');
            this.playing = false;
            this.scene && this.scene.onInterrupt && this.scene.onInterrupt(result);
        },

        _onReady: function(result) {
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

        _onOperate: function(result) {
            console.log(result.message || result.error && result.error.message);

            if (result.status === 0) {
                if (result.data.winner !== undefined) {
                    this.playing = false;
                    this.cards = null;
                    this.operator = -1;
                    this.currentValue = 0;
                    this.followCards = [];
                    this.turnonPlayerIndex = -1;
                    this.turnonCardIndex = -1;

                    this.players.forEach(function(player) {
                        player['status'] = PLAYER_STATUS_NONE;
                    });
                }
                else {
                    this.playing = true;
                    this.operator = result.data.operator;
                    
                    /*if (this.cards === null) {
                        this.cards = result.data.cards;
                    }
                    else {
                        this.cards.forEach(function(card, i) {
                            if (typeof card === 'number') {
                                return result.data.cards[i];
                            }
                            else {
                                return card;
                            }
                        });
                    }*/
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
