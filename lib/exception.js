
var error_table = {
    'does not exist user': {
        'code': 201,
        'message': '玩家不存在'
    },
    'does not exist room': {
        'code': 203,
        'message': '房间不存在'
    },
    'does not exist venue': {
        'code': 206,
        'message': '场馆不存在'
    },
    'does not exist brag': {
        'code': 224,
        'message': '游戏不存在'
    },
    'in the room': {
        'code': 204,
        'message': '操作错误，当前位置已在房间'
    },
    'not in the room': {
        'code': 211,
        'message': '不在房间内，无需退出操作'
    },
    'can not trusteeship not in playing': {
        'code': 209,
        'message': '非游戏状态不能托管'
    },
    'not trusteeship': {
        'code': 210,
        'message': '未托管'
    }
};

exports.Error = function(domain, code, message) {
    this.code = code;
    this.domain = domain;
    this.message = message;
};

exports.is_exist = {
    'user': is_exist('user'),
    'room': is_exist('room'),
    'venue': is_exist('venue'),
    'brag': is_exist('brag')
};

exports.is_not_in_room = function(source, user) {
    var error = error_table['in the room'];

    if (typeof user.vid === 'number' && 
        typeof user.rid === 'number') {
            throw new exports.Error(source, error.code, error.message);
    }
};

exports.is_in_room = function(source, user) {
    var error = error_table['not in the room'];

    if (user['status'] === PLAYER_STATUS_NONE) {
        throw new exports.Error(source, error.code, error.message);
    }
};

exports.can_trusteeship = function(source, user) {
    var error = error_table['can not trusteeship not in playing'];

    if (user['status'] === PLAYER_STATUS_PLAYING) {
        throw new exports.Error(source, error.code, error.message);
    }
};

exports.is_trusteeship = function(source, user) {
    var error = error_table['not trusteeship'];

    if (user['status'] !== PLAYER_STATUS_TRUSTEESHIP) {
        throw new exports.Error(source, error.code, error.message);
    }
};

function is_exist(type) {
    type = 'does not exist ' + type;

    return function(source, obj) {
        var error = error_table[type];
        if (!obj) {
            throw new exports.Error(source, error.code, error.message);
        }
    };
}
