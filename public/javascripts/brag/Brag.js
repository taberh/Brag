
var PLAYER_STATUS_NONE = 0,
    PLAYER_STATUS_WAIT = 1,
    PLAYER_STATUS_READY = 2,
    PLAYER_STATUS_PLAYING = 3,
    PLAYER_STATUS_TRUSTEESHIP = 4;


function Brag(venueID, aLayer) {
    this.index = -1;
    this._cards = [];
    this._pool = [];
    this._socket = null;
    this._venueID = venueID;

    this.players = [];
    this.connected = false; 
    this.playing = false;
    this.layer = aLayer;
    this.init();
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
        this.layer.updateUI();
    },

    _onDisconnect: function() {
        console.log('disconnect...');
        this.connected = false;
        this.layer.updateUI();
    },

    _onError: function() {
        console.log('error...');
    },

    _onEnter: function(data) {
        console.log(data.message || data.error && data.error.message);

        if (data.status === 0) {
            this.players[data.data['pIdx']] = data.data.player;
            this.layer.updateUI();
        }
    },

    _onLeave: function(data) {
        console.log(data.message || data.error && data.error.message);

        if (data.status === 0) {
            this.players[data.data['pIdx']] = null;
            this.layer.updateUI();
        }
    },

    _onInterrupt: function(data) {
        alert(data.message || '意外中断，sorry!!');
        this.layer.back();
    },

    _onReady: function(data) {
        console.log(data.message || data.error && data.error.message);

        if (data.status === 0) {
            var player = this.players[data.data['pIdx']];

            if (player) {
                player['status'] = PLAYER_STATUS_READY;
                this.layer.updateUI();
            }
            else {
                console.log(data.data['pIdx'] + '玩家不存在');
            }
        }
    },

    _onOperate: function(data) {
    },

    doEnter: function(callback) {
        console.log('start enter...');

        if (!this._socket) return;

        var _this = this;

        this._socket.emit('room enter', {
            'vid': _venueID
        }, function(result) {
            console.log('room enter: ', result);

            if (result.status === 0) {
                _this.players = result.data.players;
                _this.index = result.data.pIdx;
                _this.layer.updateUI();
            }
            else {
                alert(result.error && result.error.message || '进入房间失败');
            }

            callback && callback(result);
        });

    },

    doLeave: function(callback) {
        console.log('start leave...');
                 
        if (!this._socket) return;

        var _this = this;

        this._socket.emit('room leave', function(result) {
            console.log('leave room: ', result);

            if (result.status === 0) {
                _this.players = [];
                _this.index = -1;
                _this.updateUI();
            }
            else {
                alert(result.error && result.error.message || '离开房间失败');
            }

            callback && callback(result);
        });

    },

    doReady: function(callback) {
        console.log('start ready...');
                 
        if (!this._socket) return;

        var _this = this;

        this._socket.emit('player ready', function(result) {
            console.log('player ready: ', result);

            if (result.status === 0) {
                _this._player[index] = PLAYER_STATUS_READY;
                _this.updateUI();
            }

            callback && callback(result);
        });

    },

    doOperate: function(callback) {
    }
};
