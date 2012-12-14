
var LoginLayer = cc.LayerColor.extend({

    _coverLayer: null,
    _statusLable: null,
    
    init: function() {
        if (!this.initWithColor(new cc.Color4B(255, 0, 0, 255), 480, 320)) {
            return false;
        }

        var winSize = cc.Director.getInstance().getWinSize();
        var menu;

        this._sLoginButton = cc.MenuItemImage.create(n_weibo_login_logo, null, this, 'doLogin');
        this._sLoginButton.setPosition(new cc.Point(203, 130));
        this._qLoginButton = cc.MenuItemImage.create(n_qzone_login_logo, null, this, 'doLogin');
        this._qLoginButton.setPosition(new cc.Point(200, 200));
        this._qLoginButton.setTag(100);

        menu = cc.Menu.create(this._sLoginButton, this._qLoginButton);
        menu.setAnchorPoint(cc.PointZero());
        menu.setPosition(cc.PointZero());

        this._coverLayer = cc.LayerColor.create(new cc.Color4B(0, 0, 0, 0), 480, 320);
        this._statusLabel = cc.LabelTTF.create('', 'Times New Roman', 16, cc.size(200, 30), cc.TEXT_ALIGNMENT_CENTER);
        this._statusLabel.setPosition(new cc.Point(240, 160));

        this.addChild(menu);
        this.addChild(this._coverLayer);
        this.addChild(this._statusLabel);

        return true;
    },

    doLogin: function(target) {
        var tag = target.getTag();
        var _this = this;

        // disabled button
        this._sLoginButton.setEnabled(false);
        this._qLoginButton.setEnabled(false);

        // show cover
        this._coverLayer.runAction(cc.Sequence.create(cc.FadeTo.create(0.3, 150)));
        this._statusLabel.setString('正在授权...');

        if (tag == 100) { // Q login
            this._loginWithQ(callback);
        }
        else {
            this._loginWithS(callback);
        }

        function callback(userinfo) {
            if (!userinfo || typeof userinfo === 'string') {
                _this._sLoginButton.setEnabled(true);
                _this._qLoginButton.setEnabled(true);
                return error(userinfo || '授权失败，请重试！');
            }

            signin();

            function signin() {
                _this._statusLabel.setString('正在登录...');

                ajax({
                    url: '/api/signin',
                    method: 'POST',
                    params: {
                        openid: userinfo.openid
                    },
                    success: function(result) {
                        if (result.status === 0) {
                            success(result.data);
                        }
                        else if (result.status === 112) {
                            signup();
                        }
                        else {
                            error('登录失败');
                        }
                    }
                });
            }

            function signup() {
                _this._statusLabel.setString('正在注册...');

                ajax({
                    url: '/api/signup',
                    method: 'POST',
                    params: userinfo,
                    success: function(result) {
                        if (result.status === 0) {
                            signin();
                        }
                        else {
                            error(result.error && result.error.message || '注册失败');
                        }
                    }
                });
            }

            function success(user) {
                var director = cc.Director.getInstance();
                window.User = user;
                director.replaceScene(MainLayer.scene());
            }

            function error(message) {
                _this._coverLayer.runAction(cc.Sequence.create(cc.FadeTo.create(0.2, 0)));
                _this._statusLabel.setString('');

                alert(message);
            }
        }
    },

    _loginWithQ: function(callback) {
        QC.Login({}, function(a,b) {
            var o = QC.Login._getTokenKeys();
            g(a, o.openid);
        }, function() {
            QC.Login.showPopup();
        });

        if (QC.Login.check()) {
            QC.Login.signOut();
        }
        else {
            QC.Login.showPopup();
        }

        function g(data, openid) {
            callback({
                nickname: data.nickname,
                avatar_url: data.figureurl_2,
                sex: data.gender === '男' ? 1 : 2,
                openid: 'QQ_' + openid,
                account_type: 2                        
            });
        }
    },

    _loginWithS: function(callback) {
        if (WB2.checkLogin()) {
            g();
        } else {
            WB2.login(function() {
                g();
            });
        }
        
        function g() {
            WB2.anyWhere(function(W) {
                W.parseCMD('/users/show.json', function(result, status) {
                    if (status) {
                        callback({
                            nickname: result.name,
                            avatar_url: result.avatar_large,
                            sex: result.gender === 'm' ? 1 : 2,
                            openid: 'WB_' + WB2.oauthData.uid,
                            account_type: 3
                        });
                    }
                    else {
                        callback(result.error || '获取个人信息失败');
                    }
                }, { 
                    uid: WB2.oauthData.uid
                }, {
                    method: 'get'
                })
            });
        }
    }
});

LoginLayer.create = function() {
    var layer = new LoginLayer();

    if (layer && layer.init()) {
        return layer;
    }

    return null;
};

LoginLayer.scene = function() {
    var scene = cc.Scene.create();
    var layer = LoginLayer.create();
    scene.addChild(layer);
    return scene;
};
