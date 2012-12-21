
/**
 *  SigninLayer.js
 *  Brag
 *
 *  description: 登录层
 *
 *  Create by taber on 2012-12-17
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Signin Layer
 * @class
 * @extends cc.LayerColor
 */
var SigninLayer = cc.LayerColor.extend({

    _sLoginButton: null,
    _qLoginButton: null,
    _coverLayer: null,

    _QQ_LOGIN_BUTTON_TAG: 100,
    
    init: function() {
        var winSize = cc.Director.getInstance().getWinSize();

        if (!this.initWithColor(cc.c4(255, 0, 0, 255), winSize.width, winSize.height)) {
            return false;
        }

        this._coverLayer = CoverLayer.create();

        this._sLoginButton = cc.MenuItemImage.create(n_weibo_login_logo, null, this, this.doLogin);
        this._sLoginButton.setPosition(cc.p(203, 130));

        this._qLoginButton = cc.MenuItemImage.create(n_qzone_login_logo, null, this, this.doLogin);
        this._qLoginButton.setPosition(cc.p(200, 200));
        this._qLoginButton.setTag(this._QQ_LOGIN_BUTTON_TAG);

        var menu = cc.Menu.create(this._sLoginButton, this._qLoginButton);
        menu.setAnchorPoint(cc.PointZero());
        menu.setPosition(cc.PointZero());

        this.addChild(menu);
        this.addChild(this._coverLayer);

        return true;
    },

    disableButton: function() {
        this._sLoginButton.setEnabled(false);
        this._qLoginButton.setEnabled(false);
    },

    enabledButton: function() {
        this._sLoginButton.setEnabled(true);
        this._qLoginButton.setEnabled(true);
    },

    showCover: function() {
        this.disableButton();
        this._coverLayer.show();
        this._coverLayer.setStatus('授权中，请稍等...');
    },

    hideCover: function() {
        this.enabledButton();
        this._coverLayer.hide();
        this._coverLayer.setStatus('');
    },

    setStatus: function(message) {
        this._coverLayer.setStatus(message);
    },

    doLogin: function(target) {
        var tag = target.getTag();

        this.showCover();

        if (tag === this._QQ_LOGIN_BUTTON_TAG) {
            this.scene.authWithQ();
        }
        else {
            this.scene.authWithW();
        }
    }
});

/**
 *  Create a signin layer
 *  @return {SigninLayer}
 */
SigninLayer.create = function() {
    var layer = new SigninLayer();

    if (layer && layer.init()) {
        return layer;
    }

    return null;
};
