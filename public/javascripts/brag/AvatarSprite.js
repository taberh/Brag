
/**
 *  AvatarSprite.js
 *  Brag
 *
 *  description: 头像精灵
 *
 *  Create by taber on 2012-12-20
 *  Copyright 2012 TONGZI. All rights reserved.
 */


/**
 * Avatar Sprite
 * @class
 * @extends cc.Sprite
 */
var AvatarSprite = cc.Sprite.extend({

    init: function(url) {

        var image = new Image(),
            _this = this;

        image.addEventListener('load', function() {
            var sX = 50/image.width,
                sY = 50/image.height;

            cc.TextureCache.getInstance().cacheImage(url, image);
            _this.initWithFile(url);
            _this.setScale(sX, sY);
        });
        image.addEventListener('error', function() {
            cc.log('load failure:' + url);
        });
        image.src = url;
    }
});

AvatarSprite.create = function(url) {
    var sprite = new AvatarSprite();
    sprite.init(url);
    return sprite;
};
