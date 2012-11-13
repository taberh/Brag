/**
 * Brag - route.js
 * Copyright(c) 2012 taber.huang <taber.huang@gmail.com>
 */

/**
 * Module dependencies.
 */

var sign = require('./controllers/sign');
var user = require('./controllers/user');

module.exports = function(app) {

    // api
    app.post('/api/signin', sign.signin);
    app.post('/api/signup', sign.signup);
    app.get('/api/logout', sign.logout);
    app.get('/api/user/info', user.info);

    app.get('*', function(req, res) {
            console.log(req.headers);
            console.log(req.session);
        res.render('404');
    });
};
