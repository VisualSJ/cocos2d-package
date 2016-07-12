cc.SpriteBatchNode = cc.Node.extend({
    _blendFunc: null,
    _texture: null,
    _className: "SpriteBatchNode",
    ctor: function (fileImage) {
        cc.Node.prototype.ctor.call(this);
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        var texture2D;
        if (cc.isString(fileImage)) {
            texture2D = cc.textureCache.getTextureForKey(fileImage);
            if (!texture2D)
                texture2D = cc.textureCache.addImage(fileImage);
        }else if (fileImage instanceof cc.Texture2D)
            texture2D = fileImage;
        texture2D && this.initWithTexture(texture2D);
    },
    addSpriteWithoutQuad: function (child, z, aTag) {
        this.addChild(child, z, aTag);
        return this;
    },
    getTextureAtlas: function () {
        return null;
    },
    setTextureAtlas: function (textureAtlas) {},
    getDescendants: function () {
        return this._children;
    },
    initWithFile: function (fileImage, capacity) {
        var texture2D = cc.textureCache.getTextureForKey(fileImage);
        if (!texture2D)
            texture2D = cc.textureCache.addImage(fileImage);
        return this.initWithTexture(texture2D, capacity);
    },
    init: function (fileImage, capacity) {
        var texture2D = cc.textureCache.getTextureForKey(fileImage);
        if (!texture2D)
            texture2D = cc.textureCache.addImage(fileImage);
        return this.initWithTexture(texture2D, capacity);
    },
    increaseAtlasCapacity: function () {},
    removeChildAtIndex: function (index, doCleanup) {
        this.removeChild(this._children[index], doCleanup);
    },
    rebuildIndexInOrder: function (pobParent, index) {
        return index;
    },
    highestAtlasIndexInChild: function (sprite) {
        var children = sprite.children;
        if (!children || children.length === 0)
            return sprite.zIndex;
        else
            return this.highestAtlasIndexInChild(children[children.length - 1]);
    },
    lowestAtlasIndexInChild: function (sprite) {
        var children = sprite.children;
        if (!children || children.length === 0)
            return sprite.zIndex;
        else
            return this.lowestAtlasIndexInChild(children[children.length - 1]);
    },
    atlasIndexForChild: function (sprite) {
        return sprite.zIndex;
    },
    reorderBatch: function (reorder) {
        this._reorderChildDirty = reorder;
    },
    setBlendFunc: function (src, dst) {
        if (dst === undefined)
            this._blendFunc = src;
        else
            this._blendFunc = {src: src, dst: dst};
    },
    getBlendFunc: function () {
        return new cc.BlendFunc(this._blendFunc.src,this._blendFunc.dst);
    },
    updateQuadFromSprite: function (sprite, index) {
        cc.assert(sprite, cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite_2);
        if (!(sprite instanceof cc.Sprite)) {
            cc.log(cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite);
            return;
        }
        sprite.dirty = true;
        sprite._renderCmd.transform(this._renderCmd, true);
    },
    insertQuadFromSprite: function (sprite, index) {
        this.addChild(sprite, index);
    },
    insertChild: function (sprite, index) {
        this.addChild(sprite, index);
    },
    appendChild: function (sprite) {
        this.sortAllChildren();
        var lastLocalZOrder = this._children[this._children.length-1]._localZOrder;
        this.addChild(sprite. lastLocalZOrder + 1);
    },
    removeSpriteFromAtlas: function (sprite, cleanup) {
        this.removeChild(sprite, cleanup);
    },
    initWithTexture: function (tex) {
        this.setTexture(tex);
        return true;
    },
    getTexture: function () {
        return this._texture;
    },
    setTexture: function(texture){
        this._texture = texture;
        if (texture._textureLoaded) {
            var children = this._children, i, len = children.length;
            for (i = 0; i < len; ++i) {
                children[i].setTexture(texture);
            }
        }
        else {
            texture.addEventListener("load", function(){
                var children = this._children, i, len = children.length;
                for (i = 0; i < len; ++i) {
                    children[i].setTexture(texture);
                }
            }, this);
        }
    },
    setShaderProgram: function (newShaderProgram) {
        this._renderCmd.setShaderProgram(newShaderProgram);
        var children = this._children, i, len = children.length;
        for (i = 0; i < len; ++i) {
            children[i].setShaderProgram(newShaderProgram);
        }
    },
    addChild: function (child, zOrder, tag) {
        cc.assert(child !== undefined, cc._LogInfos.CCSpriteBatchNode_addChild_3);
        if(!this._isValidChild(child))
            return;
        zOrder = (zOrder === undefined) ? child.zIndex : zOrder;
        tag = (tag === undefined) ? child.tag : tag;
        cc.Node.prototype.addChild.call(this, child, zOrder, tag);
        if (this._renderCmd._shaderProgram) {
            child.shaderProgram = this._renderCmd._shaderProgram;
        }
    },
    _isValidChild: function (child) {
        if (!(child instanceof cc.Sprite)) {
            cc.log(cc._LogInfos.Sprite_addChild_4);
            return false;
        }
        if (child.texture !== this._texture) {
            cc.log(cc._LogInfos.Sprite_addChild_5);
            return false;
        }
        return true;
    }
});
var _p = cc.SpriteBatchNode.prototype;
cc.defineGetterSetter(_p, "texture", _p.getTexture, _p.setTexture);
cc.defineGetterSetter(_p, "shaderProgram", _p.getShaderProgram, _p.setShaderProgram);
cc.SpriteBatchNode.create = function (fileImage) {
    return new cc.SpriteBatchNode(fileImage);
};
cc.SpriteBatchNode.createWithTexture = cc.SpriteBatchNode.create;
