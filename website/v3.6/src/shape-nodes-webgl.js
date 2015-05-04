(function(){
    cc.DrawNode.WebGLRenderCmd = function (renderableObject) {
        cc.Node.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
    };
    cc.DrawNode.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    cc.DrawNode.WebGLRenderCmd.prototype.constructor = cc.DrawNode.WebGLRenderCmd;
    cc.DrawNode.WebGLRenderCmd.prototype.rendering = function (ctx) {
        var node = this._node;
        cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
        node._render();
    };
})();
