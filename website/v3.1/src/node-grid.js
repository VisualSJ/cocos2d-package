cc.NodeGrid = cc.Node.extend({
    grid: null,
    _target: null,
    _gridBeginCommand:null,
    _gridEndCommand:null,
    ctor: function(){
        cc.Node.prototype.ctor.call(this);
        if(cc._renderType === cc._RENDER_TYPE_WEBGL){
            this._gridBeginCommand = new cc.CustomRenderCmdWebGL(this, this.onGridBeginDraw);
            this._gridEndCommand = new cc.CustomRenderCmdWebGL(this, this.onGridEndDraw);
        }
    },
    getGrid: function () {
        return this.grid;
    },
    setGrid: function (grid) {
        this.grid = grid;
    },
    setTarget: function (target) {
        this._target = target;
    },
    onGridBeginDraw: function(){
        var isWebGL = cc._renderType == cc._RENDER_TYPE_WEBGL, locGrid = this.grid;
        if (isWebGL && locGrid && locGrid._active)
            locGrid.beforeDraw();
    },
    onGridEndDraw: function(){
        var isWebGL = cc._renderType == cc._RENDER_TYPE_WEBGL, locGrid = this.grid;
        if (isWebGL && locGrid && locGrid._active)
            locGrid.afterDraw(this._target);
    },
    visit: function () {
        var self = this;
        if (!self._visible)
            return;
        var isWebGL = cc._renderType == cc._RENDER_TYPE_WEBGL, locGrid = this.grid;
        if(isWebGL){
            var currentStack = cc.current_stack;
            currentStack.stack.push(currentStack.top);
            cc.kmMat4Assign(this._stackMatrix, currentStack.top);
            currentStack.top = this._stackMatrix;
        }
        self.transform();
        if(isWebGL){
            var beforeProjectionType = cc.director.PROJECTION_DEFAULT;
            if (locGrid && locGrid._active){
                beforeProjectionType = cc.director.getProjection();
            }
            if(this._gridBeginCommand)
                cc.renderer.pushRenderCommand(this._gridBeginCommand);
            if(this._target)
                this._target.visit();
        }
        var locChildren = this._children;
        if (locChildren && locChildren.length > 0) {
            var childLen = locChildren.length;
            this.sortAllChildren();
            for (var i = 0; i < childLen; i++) {
                var child = locChildren[i];
                child && child.visit();
            }
        }
        if(isWebGL){
            if(locGrid && locGrid._active){
            }
            if(this._gridEndCommand)
                cc.renderer.pushRenderCommand(this._gridEndCommand);
            currentStack.top = currentStack.stack.pop();
        }
    },
    _transformForWebGL: function () {
        var t4x4 = this._transform4x4, topMat4 = cc.current_stack.top;
        var trans = this.nodeToParentTransform();
        var t4x4Mat = t4x4.mat;
        t4x4Mat[0] = trans.a;
        t4x4Mat[4] = trans.c;
        t4x4Mat[12] = trans.tx;
        t4x4Mat[1] = trans.b;
        t4x4Mat[5] = trans.d;
        t4x4Mat[13] = trans.ty;
        t4x4Mat[14] = this._vertexZ;
        cc.kmMat4Multiply(topMat4, topMat4, t4x4);
        if (this._camera != null && !(this.grid && this.grid.isActive())) {
            var apx = this._anchorPointInPoints.x, apy = this._anchorPointInPoints.y;
            var translate = (apx !== 0.0 || apy !== 0.0);
            if (translate) {
                if(!cc.SPRITEBATCHNODE_RENDER_SUBPIXEL) {
                    apx = 0 | apx;
                    apy = 0 | apy;
                }
                cc.kmGLTranslatef(apx, apy, 0);
                this._camera.locate();
                cc.kmGLTranslatef(-apx, -apy, 0);
            } else {
                this._camera.locate();
            }
        }
    }
});
var _p = cc.NodeGrid.prototype;
if (cc._renderType === cc._RENDER_TYPE_WEBGL) {
    _p.transform = _p._transformForWebGL;
}
_p.grid;
_p.target;
cc.defineGetterSetter(_p, "target", null, _p.setTarget);
cc.NodeGrid.create = function () {
    return new cc.NodeGrid();
};
