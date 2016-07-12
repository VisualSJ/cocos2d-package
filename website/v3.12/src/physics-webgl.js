(function(){
    cc.PhysicsDebugNode.WebGLRenderCmd = function (renderableObject) {
        cc.Node.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._matrix = new cc.math.Matrix4();
        this._matrix.identity();
    };
    cc.PhysicsDebugNode.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    cc.PhysicsDebugNode.WebGLRenderCmd.prototype.constructor = cc.PhysicsDebugNode.WebGLRenderCmd;
    cc.PhysicsDebugNode.WebGLRenderCmd.prototype.rendering = function (ctx) {
        var node = this._node;
        if (!node._space)
            return;
        node._space.eachShape(cc.DrawShape.bind(node));
        node._space.eachConstraint(cc.DrawConstraint.bind(node));
        var wt = this._worldTransform;
        this._matrix.mat[0] = wt.a;
        this._matrix.mat[4] = wt.c;
        this._matrix.mat[12] = wt.tx;
        this._matrix.mat[1] = wt.b;
        this._matrix.mat[5] = wt.d;
        this._matrix.mat[13] = wt.ty;
        cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._matrix);
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
    proto.spUploadData = cc.Sprite.WebGLRenderCmd.prototype.uploadData;
    proto.uploadData = function (f32buffer, ui32buffer, vertexDataOffset) {
        var node  = this._node;
        node._syncPosition();
        if(!node._ignoreBodyRotation)
            node._syncRotation();
        this.transform(this.getParentRenderCmd(), true);
        return this.spUploadData(f32buffer, ui32buffer, vertexDataOffset);
    };
})();
