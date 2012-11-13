var models = require('../models'),
    User = models.User;

var config = require('../config').config,
    crypto = require('crypto'),
    check = require('validator').check,
    sanitize = require('validator').sanitize;

// 注册 
exports.signup = function(req, res, next) {
    var method = req.method.toLowerCase();
    var nickname, account_type, openid, sex, avatar_url;

    if (method != 'post') {
        return next();
    }
    
    nickname = sanitize(req.body.nickname || '').trim();
    nickname = sanitize(nickname).xss();
    if (!nickname) {
        res.json(200, { 
            'status': 101, 
            'message': '昵称不能为空' 
        });
        return;
    }

    openid = sanitize(req.body.openid || '').trim();
    openid = sanitize(openid).xss();
    if (!openid) {
        res.json(200, {
            'status': 102,
            'message': 'open id 唯一标识不能为空'
        });
        return;
    }

    account_type = req.body.account_type || 1;
    sex = req.body.sex || 1;

    avatar_url = sanitize(req.body.avatar_url || '').trim();
    avatar_url = sanitize(avatar_url).xss();

    User.find({ 'openid': openid }, function(err, users) {
        if (err) return next(err);
        if (users.length > 0) {
            res.json(200, {
                'status': 103,
                'message': '账号已存在'
            });
            return;
        }

        var user = new User();
        user.nickname = nickname;
        user.openid = openid;
        user.account_type = account_type;
        user.sex = sex;
        user.avatar_url = avatar_url;
        user.save(function(err) {
            if (err) return next(err);
            res.json(200, {
                'status': 0,
                'message': '注册成功'
            });
        });
    });
};

// 登录
exports.signin = function(req, res, next) {
    var method = req.method.toLowerCase(),
        uid, openid;

    if (method != 'post') {
        return next();
    }

    uid = sanitize(req.body.uid || '').trim();
    openid = sanitize(req.body.openid || '').trim();

    if (!uid && !openid) {
        res.json(200, {
            'status': 111,
            'message': 'UID或OpenID不能为空'
        });
        return;
    }

    User.findOne(uid ? { '_id': uid } : { 'openid': openid }, function(err, user) {
        if (err) return next(err);
        if (!user) {
            res.json(200, {
                'status': 112,
                'message': '用户不存在'
            });
            return;
        }

        req.session.user = user;
        res.json(200, {
            'status': 0,
            'message': '登录成功',
            'data': user
        });
    });
};

// 退出
exports.logout = function(req, res, next) {
    var method = req.method.toLowerCase();

    if (method != 'get') {
        return next();
    }

    req.session.destroy();
    res.json(200, {
        'status': 0,
        'message': '成功退出'
    });
};
