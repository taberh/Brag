
/**
 *  Brag.js
 *  Brag
 *
 *  description: 游戏数据模型类，负责创建socket连接和数据管理
 *
 *  Create by taber on 2012-12-21(末日)
 *  Copyright 2012 TONGZI. All rights reserved.
 */

var PLAYER_STATUS_NONE = 0,
    PLAYER_STATUS_WAIT = 1,
    PLAYER_STATUS_READY = 2,
    PLAYER_STATUS_PLAYING = 3,
    PLAYER_STATUS_TRUSTEESHIP = 4;


/**
 *  Brag constructor
 *  @constructor
 *  @class
 *  @extend Object
 */
function Brag() {
    this._socket = null;
    this._cards = [];
    this._pool = [];

    this.index = -1;
    this.value = 0;
    this.players = [];
    this.connected = false; 
    this.playing = false;
    this.scene = null;
}

Brag.prototype = {
    constructor: Brag,

    init: function() {
        this._socket = io.connect('/brag');
        this._socket.on('connect', wrapFunc(this._onConnect, this));
        this._socket.on('error', wrapFunc(this._onError, this));
        this._socket.on('disconnect', wrapFunc(this._onDisconnect, this));
        this._socket.on('room enter', wrapFunc(this._onEnter, this));
        this._socket.on('room leave', wrapFunc(this._onLeave, this));
        this._socket.on('room interrupt', wrapFunc(this._onInterrupt, this));
        this._socket.on('player ready', wrapFunc(this._onReady, this));
        this._socket.on('palyer operate', wrapFunc(this._onOperate, this));
        
        function wrapFunc(func, target) {
            return function() {
                func.apply(target, arguments);
            };
        }
    },

    _onConnect: function() {
        console.log('connect...');
        this.connected = true;
        this.scene && this.scene.onConnect && this.scene.onConnect();
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

    _onEnter: function(result) {
        console.log(result.message || result.error && result.error.message);

        if (data.status === 0) {
            this.players[result.data['pIdx']] = result.data.player;
        }

        this.scene && this.scene.onEnter && this.scene.onEnter(result);
    },

    _onLeave: function(result) {
        console.log(result.message || result.error && result.error.message);

        if (data.status === 0) {
            this.players[result.data['pIdx']] = null;
        }

        this.scene && this.scene.onLeave && this.scene.onLeave(result);
    },

    _onInterrupt: function(result) {
        console.warn(result.message || '意外中断，sorry!!');
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

    /*
    // throw cards
    data = { 
        cards: [18,18,18],
        operate: {
            cards: 3,
            owner: 2
        },
        operater: 0,
        value: 3
    }
    // believe
    data = {
        cards: [18,18,18],
        operate: {
            "owner": 1
        },
        operater: 1,
        value:3
    }
    // turnon
    data = {
        cards: [18,18,18],
        operate: {
            card: {
                "index": 42,
                "suit": 4,
                "value": 4
            },
            "pIdx":0,
            "cIdx":1,
            "owner": 2
        },
        operater: 2,
        value: 0
    }
    */

    _onOperate: function(result) {
        console.log(result.message || result.error && result.error.message);

        if (result.status === 0) {
            this._pool.push(result.data);
        }

        this.scene && this.scene.onOperate && this.scene.onOperate(result);
    },

    enter: function(params, callback) {
        console.log('start enter...');

        if (!this._socket) return;

        var _this = this;

        if (params.vid === undefined) {
            console.warn('场馆ID不存在.');
            return;
        }

        _this._veneuID = params.vid;
        _this._roomID = params.rid;

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
                _this._player[index] = PLAYER_STATUS_READY;
            }
            else {
                console.warn(result.error && result.error.message || '准备操作失败');
            }

            callback && callback(result);
        });
    },

    operate: function(params, callback) {
        var _this = this;

        _this._socket.emit('player operate', params, function(result) {
            console.log(result);
            callback(result);
        });
    }
};
