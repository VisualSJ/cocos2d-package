(function(){
    cc.SpriteBatchNode.WebGLRenderCmd = function(renderable){
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
        this._textureAtlas = null;
    };
    var proto = cc.SpriteBatchNode.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.SpriteBatchNode.WebGLRenderCmd;
    proto.isValidChild = function(child){
        if (!(child instanceof cc.Sprite)) {
            cc.log(cc._LogInfos.Sprite_addChild_4);
            return false;
        }
        if (child.texture != this.getTexture()) {
            cc.log(cc._LogInfos.Sprite_addChild_5);
            return false;
        }
        return true;
    };
    proto.rendering = function () {
        var node = this._node;
        if (this._textureAtlas.totalQuads === 0)
            return;
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
        node._arrayMakeObjectsPerformSelector(node._children, cc.Node._stateCallbackType.updateTransform);
        cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
        this._textureAtlas.drawQuads();
    };
    proto.visit = function(parentCmd){
        var node = this._node;
        if (!node._visible)
            return;
        if (node._parent && node._parent._renderCmd)
            this._curLevel = node._parent._renderCmd._curLevel + 1;
        var currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        if(!(this._dirtyFlag & cc.Node._dirtyFlags.transformDirty))
            this.transform(parentCmd);
        this.updateStatus(parentCmd);
        currentStack.top = this._stackMatrix;
        node.sortAllChildren();
        cc.renderer.pushRenderCommand(this);
        this._dirtyFlag = 0;
        currentStack.top = currentStack.stack.pop();
    };
    proto.checkAtlasCapacity = function(index){
        var locAtlas = this._textureAtlas;
        while (index >= locAtlas.capacity || locAtlas.capacity == locAtlas.totalQuads) {
            this.increaseAtlasCapacity();
        }
    };
    proto.increaseAtlasCapacity = function(){
        var locCapacity = this._textureAtlas.capacity;
        var quantity = Math.floor((locCapacity + 1) * 4 / 3);
        cc.log(cc._LogInfos.SpriteBatchNode_increaseAtlasCapacity, locCapacity, quantity);
        if (!this._textureAtlas.resizeCapacity(quantity)) {
            cc.log(cc._LogInfos.SpriteBatchNode_increaseAtlasCapacity_2);
        }
    };
    proto.initWithTexture = function(texture, capacity){
        this._textureAtlas = new cc.TextureAtlas();
        this._textureAtlas.initWithTexture(texture, capacity);
        this._updateBlendFunc();
        this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
    };
    proto.insertQuad = function(sprite, index){
        var locTextureAtlas = this._textureAtlas;
        if (locTextureAtlas.totalQuads >= locTextureAtlas.capacity)
            this.increaseAtlasCapacity();
        locTextureAtlas.insertQuad(sprite.quad, index);
    };
    proto.removeQuadAtIndex = function(index){
        this._textureAtlas.removeQuadAtIndex(index);
    };
    proto.getTexture = function(){
        return this._textureAtlas.texture;
    };
    proto.setTexture = function(texture){
        this._textureAtlas.setTexture(texture);
        this._updateBlendFunc();
    };
    proto.removeAllQuads = function(){
        this._textureAtlas.removeAllQuads();
    };
    proto._swap = function (oldIndex, newIndex) {
        var locDescendants = this._node._descendants;
        var locTextureAtlas = this._textureAtlas;
        var quads = locTextureAtlas.quads;
        var tempItem = locDescendants[oldIndex];
        var tempIteQuad = cc.V3F_C4B_T2F_QuadCopy(quads[oldIndex]);
        locDescendants[newIndex].atlasIndex = oldIndex;
        locDescendants[oldIndex] = locDescendants[newIndex];
        locTextureAtlas.updateQuad(quads[newIndex], oldIndex);
        locDescendants[newIndex] = tempItem;
        locTextureAtlas.updateQuad(tempIteQuad, newIndex);
    };
    proto._updateAtlasIndex = function (sprite, curIndex) {
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
    };
    proto.updateChildrenAtlasIndex = function(children){
        var index = 0;
        for (var i = 0; i < children.length; i++)
            index = this._updateAtlasIndex(children[i], index);
    };
    proto._updateBlendFunc = function () {
        if (!this._textureAtlas.texture.hasPremultipliedAlpha()) {
            var blendFunc = this._node._blendFunc;
            blendFunc.src = cc.SRC_ALPHA;
            blendFunc.dst = cc.ONE_MINUS_SRC_ALPHA;
        }
    };
    proto.getTextureAtlas = function(){
        return this._textureAtlas;
    };
    proto.setTextureAtlas = function(textureAtlas){
        if (textureAtlas != this._textureAtlas) {
            this._textureAtlas = textureAtlas;
        }
    };
    proto.cutting = function(){};
})();
