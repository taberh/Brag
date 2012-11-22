
var venues = require('../models').Venue.venues;

exports.list = function(req, res, next) {
    var data = [];

    for (var i = 0; i < venues.length; i++) {
        data.push({
            'name': venues[i].name,
            'online': venues[i].online,
            'min_score': venues[i]['min_score']
        });
    }

    res.json(200, {
        'status': 0,
        'message': 'success',
        'data': data
    });
};
