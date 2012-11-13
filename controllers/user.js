var models = require('../models'),
    User = models.User;

var config = require('../config').config,
    crypto = require('crypto');

exports.info = function(req, res, next) {
    var method = req.method.toLowerCase(),
        uid, openid;

    if (method != 'get') {
        return next();
    }

    uid = req.params.uid;
    openid = req.params.openid;

    if (!uid && !openid) {
        res.json(200, {
            'status': 111,
            'message': '用户ID或OpenID为空'
        });
        return;
    }

    User.findOne(uid ? { '_id': uid } : { 'openid': openid }, function(err, user) {
        if (err) return next(err);
        if (!user) {
            res.json(200, {
                'status': 103,
                'message': '用户不存在'
            });
            return;
        }

        res.json(200, {
            'status': 0,
            'message': '获取用户信息成功',
            'data': user
        });
    });
};
