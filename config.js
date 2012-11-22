/**
 * config
 */

var path = require('path');

exports.config = {
    // application config
    debug: true,
    name: '吹牛皮',
    description: '筒子娱乐是一个以棋牌为主的游戏社区',
    version: '0.0.1',

    // site settings
    hostname: '127.0.0.1',
    site_headers: [
        '<meta name="author" content="taber.huang" />'
    ],

    db: 'mongodb://127.0.0.1/brag_game_dev',
    session_secret: 'tongzi_brag_game',
    auth_cookie_name: 'tongzi_brag_game',
    port: 3000,

    // game config
    cards_pair_number: 1,
    venues: [
        {
            name: '自由区',
            min_score: 0
        },
        {
            name: '新手区',
            min_score: 0,
            chip: 1
        },
        {
            name: '初级场', 
            min_score: 10,
            chip: 3
        }
    ]
};
