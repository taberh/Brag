
var venues = require('../models/venues').venues;

exports.list = function(req, res, next) {
    var data = [];

    for (var i = 0; i < venues.length; i++) {
        data.push({
            'name': venues.name,
            'online': venues.online,
            'min_score': venues['min_score']
        });
    }

    res.json(200, {
        'status': 0,
        'message': 'success',
        'data': data
    });
};
