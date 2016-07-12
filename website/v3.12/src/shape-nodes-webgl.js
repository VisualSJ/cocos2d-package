(function(){
    cc.DrawNode.WebGLRenderCmd = function (renderableObject) {
        cc.Node.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._matrix = new cc.math.Matrix4();
        this._matrix.identity();
    };
    cc.DrawNode.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    cc.DrawNode.WebGLRenderCmd.prototype.constructor = cc.DrawNode.WebGLRenderCmd;
    cc.DrawNode.WebGLRenderCmd.prototype.rendering = function (ctx) {
        var node = this._node;
        if (node._buffer.length > 0) {
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
        }
    };
})();
