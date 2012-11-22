var mongoose = require('mongoose');
var config = require('../config').config;

mongoose.connect(config.db, function(err) {
    if (err) {
        console.error('connect db error: ', config.db, err.message);
        process.exit(1);
    }
});

require('./user');

exports.User = mongoose.model('User');
exports.Cards = require('./cards');
exports.Venue = require('./venue');
