
var errors = {
    'exist_room': {
        'code': 203,
        'message': '房间不存在'
    },
    'exist_user': {
        'code': 201,
        'message': '玩家不存在'
    },
    'exist_venue': {
        'code': 206,
        'message': '场馆不存在'
    },
    'in_room': {
        'code': 204,
        'message': '操作错误，当前位置已在房间'
    },
    'not_in_room': {
        'code': 211,
        'message': '不在房间内，无需退出操作'
    },
    'can_not_leave': {
        'code': 207,
        'message': '游戏状态不能退出'
    },
    'can_not_trusteeship': {
        'code': 209,
        'message': '非游戏状态不能托管'
    },
    'not_trusteeship': {
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
    'venue': is_exist('venue')
};

exports.is_not_in_room = function(source, user) {
    var error = errors.in_room;

    if (typeof user.vid === 'number' && 
        typeof user.rid === 'number') {
            throw new exports.Error(source, error.code, error.message);
    }
};

exports.is_in_room = function(source, user) {
    var error = errors.not_in_room;

    if (user['status'] === PLAYER_STATUS_NONE) {
        throw new exports.Error(source, error.code, error.message);
    }
};

exports.can_leave = function(source, user) {
    var error = errors.can_not_leave;

    if (user['status'] === PLAYER_STATUS_PLAYING) {
        throw new exports.Error(source, error.code, error.message);
    }
};

exports.can_trusteeship = function(source, user) {
    var error = errors.can_not_trusteeship;

    if (user['status'] === PLAYER_STATUS_PLAYING) {
        throw new exports.Error(source, error.code, error.message);
    }
};

exports.is_trusteeship = function(source, user) {
    var error = errors.not_trusteeship;

    if (user['status'] !== PLAYER_STATUS_TRUSTEESHIP) {
        throw new exports.Error(source, error.code, error.message);
    }
};

function is_exist(type) {
    type = 'exist_' + type;

    return function(source, obj) {
        console.log('type: ', type);
        var error = errors[type];
        if (!obj) {
            throw new exports.Error(source, error.code, error.message);
        }
    };
}
