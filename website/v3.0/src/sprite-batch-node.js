cc.DEFAULT_SPRITE_BATCH_CAPACITY = 29;
cc.SpriteBatchNode = cc.Node.extend({
    textureAtlas: null,
    _blendFunc: null,
    _descendants: null,
    _className: "SpriteBatchNode",
    addSpriteWithoutQuad: function (child, z, aTag) {
        cc.assert(child, cc._LogInfos.SpriteBatchNode_addSpriteWithoutQuad_2);
        if (!(child instanceof cc.Sprite)) {
            cc.log(cc._LogInfos.SpriteBatchNode_addSpriteWithoutQuad);
            return null;
        }
        child.atlasIndex = z;
        var i = 0, locDescendants = this._descendants;
        if (locDescendants && locDescendants.length > 0) {
            for (var index = 0; index < locDescendants.length; index++) {
                var obj = locDescendants[index];
                if (obj && (obj.atlasIndex >= z))
                    ++i;
            }
        }
        locDescendants.splice(i, 0, child);
        cc.Node.prototype.addChild.call(this, child, z, aTag);
        this.reorderBatch(false);
        return this;
    },
    getTextureAtlas: function () {
        return this.textureAtlas;
    },
    setTextureAtlas: function (textureAtlas) {
        if (textureAtlas != this.textureAtlas) {
            this.textureAtlas = textureAtlas;
        }
    },
    getDescendants: function () {
        return  this._descendants;
    },
    initWithFile: function (fileImage, capacity) {
        var texture2D = cc.textureCache.getTextureForKey(fileImage);
        if (!texture2D)
            texture2D = cc.textureCache.addImage(fileImage);
        return this.initWithTexture(texture2D, capacity);
    },
    _setNodeDirtyForCache: function () {
        this._cacheDirty = true;
    },
    init: function (fileImage, capacity) {
        var texture2D = cc.textureCache.getTextureForKey(fileImage);
        if (!texture2D)
            texture2D = cc.textureCache.addImage(fileImage);
        return this.initWithTexture(texture2D, capacity);
    },
    increaseAtlasCapacity: function () {
        var locCapacity = this.textureAtlas.capacity;
        var quantity = Math.floor((locCapacity + 1) * 4 / 3);
        cc.log(cc._LogInfos.SpriteBatchNode_increaseAtlasCapacity, locCapacity, quantity);
        if (!this.textureAtlas.resizeCapacity(quantity)) {
            cc.log(cc._LogInfos.SpriteBatchNode_increaseAtlasCapacity_2);
        }
    },
    removeChildAtIndex: function (index, doCleanup) {
        this.removeChild(this._children[index], doCleanup);
    },
    rebuildIndexInOrder: function (pobParent, index) {
        var children = pobParent.children;
        if (children && children.length > 0) {
            for (var i = 0; i < children.length; i++) {
                var obj = children[i];
                if (obj && (obj.zIndex < 0)) {
                    index = this.rebuildIndexInOrder(obj, index);
                }
            }
        }
        if (!pobParent == this) {
            pobParent.atlasIndex = index;
            index++;
        }
        if (children && children.length > 0) {
            for (i = 0; i < children.length; i++) {
                obj = children[i];
                if (obj && (obj.zIndex >= 0)) {
                    index = this.rebuildIndexInOrder(obj, index);
                }
            }
        }
        return index;
    },
    highestAtlasIndexInChild: function (sprite) {
        var children = sprite.children;
        if (!children || children.length == 0)
            return sprite.atlasIndex;
        else
            return this.highestAtlasIndexInChild(children[children.length - 1]);
    },
    lowestAtlasIndexInChild: function (sprite) {
        var children = sprite.children;
        if (!children || children.length == 0)
            return sprite.atlasIndex;
        else
            return this.lowestAtlasIndexInChild(children[children.length - 1]);
    },
    atlasIndexForChild: function (sprite, nZ) {
        var selParent = sprite.parent;
        var brothers = selParent.children;
        var childIndex = brothers.indexOf(sprite);
        var ignoreParent = selParent == this;
        var previous = null;
        if (childIndex > 0 && childIndex < cc.UINT_MAX)
            previous = brothers[childIndex - 1];
        if (ignoreParent) {
            if (childIndex == 0)
                return 0;
            return this.highestAtlasIndexInChild(previous) + 1;
        }
        if (childIndex == 0) {
            if (nZ < 0)
                return selParent.atlasIndex;
            else
                return selParent.atlasIndex + 1;
        } else {
            if ((previous.zIndex < 0 && nZ < 0) || (previous.zIndex >= 0 && nZ >= 0))
                return this.highestAtlasIndexInChild(previous) + 1;
            return selParent.atlasIndex + 1;
        }
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
        return this._blendFunc;
    },
    reorderChild: function (child, zOrder) {
        cc.assert(child, cc._LogInfos.SpriteBatchNode_reorderChild_2);
        if (this._children.indexOf(child) === -1) {
            cc.log(cc._LogInfos.SpriteBatchNode_reorderChild);
            return;
        }
        if (zOrder === child.zIndex)
            return;
        cc.Node.prototype.reorderChild.call(this, child, zOrder);
        this.setNodeDirty();
    },
    removeChild: function (child, cleanup) {
        if (child == null)
            return;
        if (this._children.indexOf(child) === -1) {
            cc.log(cc._LogInfos.SpriteBatchNode_removeChild);
            return;
        }
        this.removeSpriteFromAtlas(child);
        cc.Node.prototype.removeChild.call(this, child, cleanup);
    },
    _mvpMatrix: null,
    _textureForCanvas: null,
    _useCache: false,
    _originalTexture: null,
    ctor: null,
    _ctorForCanvas: function (fileImage, capacity) {
        cc.Node.prototype.ctor.call(this);
        var texture2D;
        capacity = capacity || cc.DEFAULT_SPRITE_BATCH_CAPACITY;
        if (cc.isString(fileImage)) {
            texture2D = cc.textureCache.getTextureForKey(fileImage);
            if (!texture2D)
                texture2D = cc.textureCache.addImage(fileImage);
        }
        else if (fileImage instanceof cc.Texture2D)
            texture2D = fileImage;
        texture2D && this.initWithTexture(texture2D, capacity);
    },
    _ctorForWebGL: function (fileImage, capacity) {
        cc.Node.prototype.ctor.call(this);
        this._mvpMatrix = new cc.kmMat4();
        var texture2D;
        capacity = capacity || cc.DEFAULT_SPRITE_BATCH_CAPACITY;
        if (cc.isString(fileImage)) {
            texture2D = cc.textureCache.getTextureForKey(fileImage);
            if (!texture2D)
                texture2D = cc.textureCache.addImage(fileImage);
        }
        else if (fileImage instanceof cc.Texture2D)
            texture2D = fileImage;
        texture2D && this.initWithTexture(texture2D, capacity);
    },
    updateQuadFromSprite: null,
    _updateQuadFromSpriteForCanvas: function (sprite, index) {
        cc.assert(sprite, cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite_2);
        if (!(sprite instanceof cc.Sprite)) {
            cc.log(cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite);
            return;
        }
        sprite.batchNode = this;
        sprite.atlasIndex = index;
        sprite.dirty = true;
        sprite.updateTransform();
    },
    _updateQuadFromSpriteForWebGL: function (sprite, index) {
        cc.assert(sprite, cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite);
        if (!(sprite instanceof cc.Sprite)) {
            cc.log(cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite);
            return;
        }
        var locCapacity = this.textureAtlas.capacity;
        while (index >= locCapacity || locCapacity == this.textureAtlas.totalQuads) {
            this.increaseAtlasCapacity();
        }
        sprite.batchNode = this;
        sprite.atlasIndex = index;
        sprite.dirty = true;
        sprite.updateTransform();
    },
    _swap: function (oldIndex, newIndex) {
        var locDescendants = this._descendants;
        var locTextureAtlas = this.textureAtlas;
        var quads = locTextureAtlas.quads;
        var tempItem = locDescendants[oldIndex];
        var tempIteQuad = cc.V3F_C4B_T2F_QuadCopy(quads[oldIndex]);
        locDescendants[newIndex].atlasIndex = oldIndex;
        locDescendants[oldIndex] = locDescendants[newIndex];
        locTextureAtlas.updateQuad(quads[newIndex], oldIndex);
        locDescendants[newIndex] = tempItem;
        locTextureAtlas.updateQuad(tempIteQuad, newIndex);
    },
    insertQuadFromSprite: null,
    _insertQuadFromSpriteForCanvas: function (sprite, index) {
        cc.assert(sprite, cc._LogInfos.CCSpriteBatchNode_insertQuadFromSprite_2);
        if (!(sprite instanceof cc.Sprite)) {
            cc.log(cc._LogInfos.CCSpriteBatchNode_insertQuadFromSprite);
            return;
        }
        sprite.batchNode = this;
        sprite.atlasIndex = index;
        sprite.dirty = true;
        sprite.updateTransform();
        sprite._setCachedParent(this);
        this._children.splice(index, 0, sprite);
    },
    _insertQuadFromSpriteForWebGL: function (sprite, index) {
        cc.assert(sprite, cc._LogInfos.Sprite_insertQuadFromSprite_2);
        if (!(sprite instanceof cc.Sprite)) {
            cc.log(cc._LogInfos.Sprite_insertQuadFromSprite);
            return;
        }
        var locTextureAtlas = this.textureAtlas;
        while (index >= locTextureAtlas.capacity || locTextureAtlas.capacity === locTextureAtlas.totalQuads)
            this.increaseAtlasCapacity();
        sprite.batchNode = this;
        sprite.atlasIndex = index;
        locTextureAtlas.insertQuad(sprite.quad, index);
        sprite.dirty = true;
        sprite.updateTransform();
    },
    _updateAtlasIndex: function (sprite, curIndex) {
        var count = 0;
        var pArray = sprite.children;
        if (pArray)
            count = pArray.length;
        var oldIndex = 0;
        if (count === 0) {
            oldIndex = sprite.atlasIndex;
            sprite.atlasIndex = curIndex;
            sprite.arrivalOrder = 0;
            if (oldIndex != curIndex)
                this._swap(oldIndex, curIndex);
            curIndex++;
        } else {
            var needNewIndex = true;
            if (pArray[0].zIndex >= 0) {
                oldIndex = sprite.atlasIndex;
                sprite.atlasIndex = curIndex;
                sprite.arrivalOrder = 0;
                if (oldIndex != curIndex)
                    this._swap(oldIndex, curIndex);
                curIndex++;
                needNewIndex = false;
            }
            for (var i = 0; i < pArray.length; i++) {
                var child = pArray[i];
                if (needNewIndex && child.zIndex >= 0) {
                    oldIndex = sprite.atlasIndex;
                    sprite.atlasIndex = curIndex;
                    sprite.arrivalOrder = 0;
                    if (oldIndex != curIndex) {
                        this._swap(oldIndex, curIndex);
                    }
                    curIndex++;
                    needNewIndex = false;
                }
                curIndex = this._updateAtlasIndex(child, curIndex);
            }
            if (needNewIndex) {
                oldIndex = sprite.atlasIndex;
                sprite.atlasIndex = curIndex;
                sprite.arrivalOrder = 0;
                if (oldIndex != curIndex) {
                    this._swap(oldIndex, curIndex);
                }
                curIndex++;
            }
        }
        return curIndex;
    },
    _updateBlendFunc: function () {
        if (!this.textureAtlas.texture.hasPremultipliedAlpha()) {
            this._blendFunc.src = cc.SRC_ALPHA;
            this._blendFunc.dst = cc.ONE_MINUS_SRC_ALPHA;
        }
    },
    initWithTexture: null,
    _initWithTextureForCanvas: function (tex, capacity) {
        this._children = [];
        this._descendants = [];
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        this._originalTexture = tex;
        this._textureForCanvas = tex;
        return true;
    },
    _initWithTextureForWebGL: function (tex, capacity) {
        this._children = [];
        this._descendants = [];
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        capacity = capacity || cc.DEFAULT_SPRITE_BATCH_CAPACITY;
        this.textureAtlas = new cc.TextureAtlas();
        this.textureAtlas.initWithTexture(tex, capacity);
        this._updateBlendFunc();
        this.shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
        return true;
    },
    insertChild: function (sprite, index) {
        sprite.batchNode = this;
        sprite.atlasIndex = index;
        sprite.dirty = true;
        var locTextureAtlas = this.textureAtlas;
        if (locTextureAtlas.totalQuads >= locTextureAtlas.capacity)
            this.increaseAtlasCapacity();
        locTextureAtlas.insertQuad(sprite.quad, index);
        this._descendants.splice(index, 0, sprite);
        var i = index + 1, locDescendant = this._descendants;
        if (locDescendant && locDescendant.length > 0) {
            for (; i < locDescendant.length; i++)
                locDescendant[i].atlasIndex++;
        }
        var locChildren = sprite.children, child;
        if (locChildren) {
            for (i = 0, l = locChildren.length || 0; i < l; i++) {
                child = locChildren[i];
                if (child) {
                    var getIndex = this.atlasIndexForChild(child, child.zIndex);
                    this.insertChild(child, getIndex);
                }
            }
        }
    },
    appendChild: null,
    _appendChildForCanvas: function (sprite) {
        this._reorderChildDirty = true;
        sprite.batchNode = this;
        sprite.dirty = true;
        this._descendants.push(sprite);
        var index = this._descendants.length - 1;
        sprite.atlasIndex = index;
        var children = sprite.children;
        for (var i = 0, l = children.length || 0; i < l; i++)
            this.appendChild(children[i]);
    },
    _appendChildForWebGL: function (sprite) {
        this._reorderChildDirty = true;
        sprite.batchNode = this;
        sprite.dirty = true;
        this._descendants.push(sprite);
        var index = this._descendants.length - 1;
        sprite.atlasIndex = index;
        var locTextureAtlas = this.textureAtlas;
        if (locTextureAtlas.totalQuads == locTextureAtlas.capacity)
            this.increaseAtlasCapacity();
        locTextureAtlas.insertQuad(sprite.quad, index);
        var children = sprite.children;
        for (var i = 0, l = children.length || 0; i < l; i++)
            this.appendChild(children[i]);
    },
    removeSpriteFromAtlas: null,
    _removeSpriteFromAtlasForCanvas: function (sprite) {
        sprite.batchNode = null;
        var locDescendants = this._descendants;
        var index = locDescendants.indexOf(sprite);
        if (index != -1) {
            locDescendants.splice(index, 1)
            var len = locDescendants.length;
            for (; index < len; ++index) {
                var s = locDescendants[index];
                s.atlasIndex--;
            }
        }
        var children = sprite.children;
        if (children) {
            for (var i = 0, l = children.length || 0; i < l; i++)
                children[i] && this.removeSpriteFromAtlas(children[i]);
        }
    },
    _removeSpriteFromAtlasForWebGL: function (sprite) {
        this.textureAtlas.removeQuadAtIndex(sprite.atlasIndex);
        sprite.batchNode = null;
        var locDescendants = this._descendants;
        var index = locDescendants.indexOf(sprite);
        if (index != -1) {
            locDescendants.splice(index, 1);
            var len = locDescendants.length;
            for (; index < len; ++index) {
                var s = locDescendants[index];
                s.atlasIndex--;
            }
        }
        var children = sprite.children;
        if (children) {
            for (var i = 0, l = children.length || 0; i < l; i++)
                children[i] && this.removeSpriteFromAtlas(children[i]);
        }
    },
    getTexture: null,
    _getTextureForCanvas: function () {
        return this._textureForCanvas;
    },
    _getTextureForWebGL: function () {
        return this.textureAtlas.texture;
    },
    setTexture: null,
    _setTextureForCanvas: function (texture) {
        this._textureForCanvas = texture;
        var locChildren = this._children;
        for (var i = 0; i < locChildren.length; i++)
            locChildren[i].texture = texture;
    },
    _setTextureForWebGL: function (texture) {
        this.textureAtlas.texture = texture;
        this._updateBlendFunc();
    },
    visit: null,
    _visitForCanvas: function (ctx) {
        var context = ctx || cc._renderContext;
        if (!this._visible)
            return;
        context.save();
        this.transform(ctx);
        var i, locChildren = this._children;
        if (locChildren) {
            this.sortAllChildren();
            for (i = 0; i < locChildren.length; i++) {
                if (locChildren[i])
                    locChildren[i].visit(context);
            }
        }
        context.restore();
    },
    _visitForWebGL: function (ctx) {
        var gl = ctx || cc._renderContext;
        if (!this._visible)
            return;
        cc.kmGLPushMatrix();
        var locGrid = this.grid;
        if (locGrid && locGrid.isActive()) {
            locGrid.beforeDraw();
            this.transformAncestors();
        }
        this.sortAllChildren();
        this.transform(gl);
        this.draw(gl);
        if (locGrid && locGrid.isActive())
            locGrid.afterDraw(this);
        cc.kmGLPopMatrix();
        this.arrivalOrder = 0;
    },
    addChild: null,
    _addChildForCanvas: function (child, zOrder, tag) {
        cc.assert(child != null, cc._LogInfos.CCSpriteBatchNode_addChild_3);
        if (!(child instanceof cc.Sprite)) {
            cc.log(cc._LogInfos.CCSpriteBatchNode_addChild);
            return;
        }
        zOrder = (zOrder == null) ? child.zIndex : zOrder;
        tag = (tag == null) ? child.tag : tag;
        cc.Node.prototype.addChild.call(this, child, zOrder, tag);
        this.appendChild(child);
        this.setNodeDirty();
    },
    _addChildForWebGL: function (child, zOrder, tag) {
        cc.assert(child != null, cc._LogInfos.Sprite_addChild_6);
        if (!(child instanceof cc.Sprite)) {
            cc.log(cc._LogInfos.Sprite_addChild_4);
            return;
        }
        if (child.texture != this.textureAtlas.texture) {
            cc.log(cc._LogInfos.Sprite_addChild_5);
            return;
        }
        zOrder = (zOrder == null) ? child.zIndex : zOrder;
        tag = (tag == null) ? child.tag : tag;
        cc.Node.prototype.addChild.call(this, child, zOrder, tag);
        this.appendChild(child);
        this.setNodeDirty();
    },
    removeAllChildren: null,
    _removeAllChildrenForCanvas: function (cleanup) {
        var locDescendants = this._descendants;
        if (locDescendants && locDescendants.length > 0) {
            for (var i = 0, len = locDescendants.length; i < len; i++) {
                if (locDescendants[i])
                    locDescendants[i].batchNode = null;
            }
        }
        cc.Node.prototype.removeAllChildren.call(this, cleanup);
        this._descendants.length = 0;
    },
    _removeAllChildrenForWebGL: function (cleanup) {
        var locDescendants = this._descendants;
        if (locDescendants && locDescendants.length > 0) {
            for (var i = 0, len = locDescendants.length; i < len; i++) {
                if (locDescendants[i])
                    locDescendants[i].batchNode = null;
            }
        }
        cc.Node.prototype.removeAllChildren.call(this, cleanup);
        this._descendants.length = 0;
        this.textureAtlas.removeAllQuads();
    },
    sortAllChildren: null,
    _sortAllChildrenForCanvas: function () {
        if (this._reorderChildDirty) {
            var i, j = 0, locChildren = this._children;
            var length = locChildren.length, tempChild;
            for (i = 1; i < length; i++) {
                var tempItem = locChildren[i];
                j = i - 1;
                tempChild = locChildren[j];
                while (j >= 0 && ( tempItem._localZOrder < tempChild._localZOrder ||
                    ( tempItem._localZOrder == tempChild._localZOrder && tempItem.arrivalOrder < tempChild.arrivalOrder ))) {
                    locChildren[j + 1] = tempChild;
                    j = j - 1;
                    tempChild = locChildren[j];
                }
                locChildren[j + 1] = tempItem;
            }
            if (locChildren.length > 0) {
                this._arrayMakeObjectsPerformSelector(locChildren, cc.Node._StateCallbackType.sortAllChildren);
            }
            this._reorderChildDirty = false;
        }
    },
    _sortAllChildrenForWebGL: function () {
        if (this._reorderChildDirty) {
            var childrenArr = this._children;
            var i, j = 0, length = childrenArr.length, tempChild;
            for (i = 1; i < length; i++) {
                var tempItem = childrenArr[i];
                j = i - 1;
                tempChild = childrenArr[j];
                while (j >= 0 && ( tempItem._localZOrder < tempChild._localZOrder ||
                    ( tempItem._localZOrder == tempChild._localZOrder && tempItem.arrivalOrder < tempChild.arrivalOrder ))) {
                    childrenArr[j + 1] = tempChild;
                    j = j - 1;
                    tempChild = childrenArr[j];
                }
                childrenArr[j + 1] = tempItem;
            }
            if (childrenArr.length > 0) {
                this._arrayMakeObjectsPerformSelector(childrenArr, cc.Node._StateCallbackType.sortAllChildren);
                var index = 0;
                for (i = 0; i < childrenArr.length; i++)
                    index = this._updateAtlasIndex(childrenArr[i], index);
            }
            this._reorderChildDirty = false;
        }
    },
    draw: null,
    _drawForWebGL: function () {
        if (this.textureAtlas.totalQuads === 0)
            return;
        this._shaderProgram.use();
        this._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4();
        this._arrayMakeObjectsPerformSelector(this._children, cc.Node._StateCallbackType.updateTransform);
        cc.glBlendFunc(this._blendFunc.src, this._blendFunc.dst);
        this.textureAtlas.drawQuads();
    }
});
var _p = cc.SpriteBatchNode.prototype;
if (cc._renderType === cc._RENDER_TYPE_WEBGL) {
    _p.ctor = _p._ctorForWebGL;
    _p.updateQuadFromSprite = _p._updateQuadFromSpriteForWebGL;
    _p.insertQuadFromSprite = _p._insertQuadFromSpriteForWebGL;
    _p.initWithTexture = _p._initWithTextureForWebGL;
    _p.appendChild = _p._appendChildForWebGL;
    _p.removeSpriteFromAtlas = _p._removeSpriteFromAtlasForWebGL;
    _p.getTexture = _p._getTextureForWebGL;
    _p.setTexture = _p._setTextureForWebGL;
    _p.visit = _p._visitForWebGL;
    _p.addChild = _p._addChildForWebGL;
    _p.removeAllChildren = _p._removeAllChildrenForWebGL;
    _p.sortAllChildren = _p._sortAllChildrenForWebGL;
    _p.draw = _p._drawForWebGL;
} else {
    _p.ctor = _p._ctorForCanvas;
    _p.updateQuadFromSprite = _p._updateQuadFromSpriteForCanvas;
    _p.insertQuadFromSprite = _p._insertQuadFromSpriteForCanvas;
    _p.initWithTexture = _p._initWithTextureForCanvas;
    _p.appendChild = _p._appendChildForCanvas;
    _p.removeSpriteFromAtlas = _p._removeSpriteFromAtlasForCanvas;
    _p.getTexture = _p._getTextureForCanvas;
    _p.setTexture = _p._setTextureForCanvas;
    _p.visit = _p._visitForCanvas;
    _p.removeAllChildren = _p._removeAllChildrenForCanvas;
    _p.addChild = _p._addChildForCanvas;
    _p.sortAllChildren = _p._sortAllChildrenForCanvas;
    _p.draw = cc.Node.prototype.draw;
}
cc.defineGetterSetter(_p, "texture", _p.getTexture, _p.setTexture);
_p.descendants;
cc.defineGetterSetter(_p, "descendants", _p.getDescendants);
cc.SpriteBatchNode.create = function (fileImage, capacity) {
    return new cc.SpriteBatchNode(fileImage, capacity);
};
cc.SpriteBatchNode.createWithTexture = cc.SpriteBatchNode.create;
