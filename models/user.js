var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    nickname: { type: String },
    openid: { type: String, unique: true },
    account_type: { type: Number },  // 1: 游客; 2: QQ用户; 3: 微博用户
    sex: { type: Number }, // 1: men; 2: women
    avatar_url: { type: String },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    score: { type: Number, default: 0 },
    count_win: { type: Number, default: 0 },
    count_lose: { type: Number, default: 0 }
});

mongoose.model('User', UserSchema);
