
/**
 *  StatusBar.js
 *  Brag
 *
 *  description: 自定义状态栏，用来显示消息
 *
 *  Create by taber on 2013-01-03
 *  Copyright 2013 TONGZI. All rights reserved.
 */


/**
 * Status Bar
 * @single class
 * @extends cc.LayerColor
 */

var StatusBar = (function() {

    var instance;
    var StatusBar = cc.LayerColor.extend({
        
        init: function() {
            var director = cc.Director.getInstance();
            var winSize = director.getWinSize();
            var statusSize = cc.size(winSize.width, 20);

            this._super();
            this.setContentSize(statusSize);

            this._label = cc.LabelTTF.create('', App.NORMAL_FONT, 12, statusSize, cc.TEXT_ALIGNMENT_CENTER);
            this._label.setAnchorPoint(cc.PointZero());
            this._label.setColor(cc.white());
            this._label.setPosition(cc.PointZero());
            this.addChild(this._label);
        },

        /**
         * set message text
         * @param {String} string
         */
        setString: function(string) {
            this._label.setString(string);
        },

        /**
         * show status bar in current scene
         * @param {Boolean} animate
         */
        show: function(animate) {
            var director = cc.Director.getInstance();
            var scene = director.getRunningScene();
            var winSize = director.getWinSize();
            var statusSize = this.getContentSize();
            var point = cc.p(0, winSize.height - statusSize.height);
            var action, move;

            scene.addChild(this);

            if (animate) {
                point.y += statusSize.height;
                this.setPosition(point);
                point.y -= statusSize.height;
                move = cc.MoveTo.create(1.2, point);
                action = cc.Sequence.create([move]);
                this.runAction(action);
            }
            else {
                this.setPosition(point);
            }
        },

        /**
         * hide and remove StaturBar
         * @param {Boolean} animate
         */
        hide: function(animate) {
            var p, s, m, c, a;

            if (animate) {
                p = this.getPosition();
                s = this.getContentSize();
                p.y += s.height;
                m = cc.MoveTo.create(0.4, p);
                c = cc.CallFunc.create(this, remove);
                a = cc.Sequence.create([m, c]);
                this.runAction(a);
            }
            else {
                remove.call(this);
            }

            function remove() {
                this.removeFromParentAndCleanup(true);
            }
        }
    });

    return {
        getInstance: function() {
            if (!instance) {
                instance = new StatusBar();
                instance.init();
            }

            return instance;
        }
    }
})();
