/**
 * Route
 */

/**
 * Module dependencies.
 */

var sign = require('./controllers/sign');
var venue = require('./controllers/venue');

module.exports = function(app) {

    // sign
    app.post('/api/signin', sign.signin);
    app.post('/api/signup', sign.signup);
    app.get('/api/logout', sign.logout);

    // venues
    app.get('/api/venues', venue.list);
    app.post('/api/venues', venue.list);

    // *
    app.get('*', function(req, res) {
        res.render('404');
    });
};
