
/**
 *  SignScene.js
 *  Brag
 *
 *  description: 登录/注册场景
 *
 *  Create by taber on 2012-12-17
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Sign Scene
 * @class
 * @extends cc.Scene
 */
var SignScene = cc.Scene.extend({

    signinLayer: null,

    init: function() {
        this._super();
        this.signinLayer = SigninLayer.create();
        this.signinLayer.scene = this;
        this.signinLayer.setCoverLayerScene(this);
        this.addChild(this.signinLayer);
    },

    runLobbyScene: function() {
        if (this.lock) return;

        var director = cc.Director.getInstance();
        director.replaceScene(MainScene.create());
    },

    // auth with qq
    authWithQ: function() {
        var _this = this;

        this.lock = false;

        QC.Login({}, function(a,b) { // login success callback
            var o = QC.Login._getTokenKeys();
            success(a, o.openid);
        }, function() { // logout success callback
            QC.Login.showPopup();
        });

        if (QC.Login.check()) {
            QC.Login.signOut();
        }
        else {
            QC.Login.showPopup();
        }

        function success(data, openid) {
            _this._authComplete({
                nickname: data.nickname,
                avatar_url: data.figureurl_2,
                sex: data.gender === '男' ? 1 : 2,
                openid: 'QQ_' + openid,
                account_type: 2                        
            });
        }
    },

    // auth with sina weibo
    authWithW: function() {
        var _this = this;

        this.lock = false;

        if (WB2.checkLogin()) {
            success();
        } else {
            WB2.login(function() {
                success();
            });
        }
        
        function success() {
            WB2.anyWhere(function(W) {
                W.parseCMD('/users/show.json', function(result, status) {
                    if (status) {
                        _this._authComplete({
                            nickname: result.name,
                            avatar_url: result.avatar_large,
                            sex: result.gender === 'm' ? 1 : 2,
                            openid: 'WB_' + WB2.oauthData.uid,
                            account_type: 3
                        });
                    }
                    else {
                        _this._authComplete(result.error || '获取个人信息失败');
                    }
                }, { 
                    uid: WB2.oauthData.uid
                }, {
                    method: 'get'
                })
            });
        }
    },

    _signin: function(userInfo, callback) {
        var _this = this;

        this.signinLayer.setStatus('正在登录...');
        
        ajax({
            url: '/api/signin',
            method: 'POST',
            params: {
                openid: userInfo.openid
            },
            success: function(result) {
                if (_this.lock) return;

                if (result.status === 0) {
                    callback(result.data); // return user data
                }
                else if (result.status === 112) {
                    _this._signup(userInfo, callback);
                }
                else {
                    callback('登录失败');
                }
            },
            error: function(err) {
                if (_this.lock) return;

                if (err && err.message) {
                    callback(err.message);
                }
                else {
                    callback('登录失败');
                }
            }
        });
    },

    _signup: function(userInfo, callback) {
        var _this = this;

        this.signinLayer.setStatus('貌似这是您第一次来, 正在为您创建账号. 完成后将自动登录...');

        ajax({
            url: '/api/signup',
            method: 'POST',
            params: userInfo,
            success: function(result) {
                if (_this.lock) return;

                if (result.status === 0) {
                    _this._signin(userInfo, callback);
                }
                else {
                    callback(result.error && result.error.message || '注册失败');
                }
            },
            error: function(err) {
                if (_this.lock) return;

                if (err && err.message) {
                    callback(err.message);
                }
                else {
                    callback('注册失败');
                }
            }
        });
    },

    _authComplete: function(userInfo) {
        if (this.lock) return;

        var _this = this;

        if (!userInfo || typeof userinfo === 'string') {
            console.warn('Auth error!!!');
            return callback('授权失败，请重试！');
        }

        console.log('Auth success!!!');

        this._signin(userInfo, callback);

        function callback(user) {
            if (!user || typeof user === 'string') {
                _this._signinError(user);
            }
            else {
                _this._signinSuccess(user);
            }
        }
    },

    _signinSuccess: function(user) {
        console.log('Signin success: ', user);
        App.user = user;

        this.signinLayer.setStatus('正在与服务器建立连接...');
        var brag = Brag.getInstance();
        brag.scene = this;
    },

    _signinError: function(message) {
        console.warn('Signin Error: ', message);
        this.signinLayer.hideCover();
        alert(message);
    },

    onConnect: function() {
        this.runLobbyScene();
    },

    onConnectFailed: function() {
        alert('建立socket连接失败');
    },

    cancel: function() {
        this.lock = true;
        this.signinLayer.hideCover();
    }
});

/**
 * Create a sign scene
 * @return {SignScene}
 */
SignScene.create = function() {
    var scene = new SignScene();
    scene.init();
    return scene;
};
