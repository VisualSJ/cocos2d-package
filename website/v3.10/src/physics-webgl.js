(function(){
    cc.PhysicsDebugNode.WebGLRenderCmd = function (renderableObject) {
        cc.Node.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
    };
    cc.PhysicsDebugNode.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    cc.PhysicsDebugNode.WebGLRenderCmd.prototype.constructor = cc.PhysicsDebugNode.WebGLRenderCmd;
    cc.PhysicsDebugNode.WebGLRenderCmd.prototype.rendering = function (ctx) {
        var node = this._node;
        if (!node._space)
            return;
        node._space.eachShape(cc.DrawShape.bind(node));
        node._space.eachConstraint(cc.DrawConstraint.bind(node));
        cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
        node._render();
        node.clear();
    };
})();
(function(){
    cc.PhysicsSprite.WebGLRenderCmd = function(renderableObject){
        cc.Sprite.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
    };
    var proto = cc.PhysicsSprite.WebGLRenderCmd.prototype = Object.create(cc.Sprite.WebGLRenderCmd.prototype);
    proto.constructor = cc.PhysicsSprite.WebGLRenderCmd;
    proto.rendering = function(ctx){
        var node  = this._node;
        node._syncPosition();
        if(!node._ignoreBodyRotation)
            node._syncRotation();
        this.transform(this.getParentRenderCmd(), true);
        cc.Sprite.WebGLRenderCmd.prototype.rendering.call(this, ctx);
    };
    proto.getNodeToParentTransform = function(){
        var node = this._node;
        var locBody = node._body, locAnchorPIP = this._anchorPointInPoints, locScaleX = node._scaleX, locScaleY = node._scaleY;
        var x = locBody.p.x;
        var y = locBody.p.y;
        if (this._ignoreAnchorPointForPosition) {
            x += locAnchorPIP.x;
            y += locAnchorPIP.y;
        }
        var radians = locBody.a, c = 1, s=0;
        if (radians && !node._ignoreBodyRotation) {
            c = Math.cos(radians);
            s = Math.sin(radians);
        }
        if (!cc._rectEqualToZero(locAnchorPIP)) {
            x += c * -locAnchorPIP.x * locScaleX + -s * -locAnchorPIP.y * locScaleY;
            y += s * -locAnchorPIP.x * locScaleX + c * -locAnchorPIP.y * locScaleY;
        }
        this._transform = cc.affineTransformMake(c * locScaleX, s * locScaleX,
                -s * locScaleY, c * locScaleY, x, y);
        return this._transform;
    };
    proto.updateTransform = function(){
        var node = this._node;
        var dirty = node.isDirty();
        if(dirty){
            var cmd = node._renderCmd;
            cmd && cmd.setDirtyRecursively(true);
        }
        cc.Sprite.WebGLRenderCmd.prototype.updateTransform.call(this);
    };
})();
