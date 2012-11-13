
var config = require('../config').config;

var venues = [];

// init venues
for (var i = 0; i < config.venues.length; i++) {
    venues.push(Object.create(config.venues[i], {
        rooms: { writable: true, value: [] },
        online: { writable: true, value: 0 }
    }));
}

exports.venues = venues;
