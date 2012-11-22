var mongoose = require('mongoose');
var config = require('../config').config;
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || config.db;

mongoose.connect(mongoUri, function(err) {
    if (err) {
        console.error('connect db error: ', config.db, err.message);
        process.exit(1);
    }
});

require('./user');

exports.User = mongoose.model('User');
exports.Cards = require('./cards');
exports.Venue = require('./venue');
