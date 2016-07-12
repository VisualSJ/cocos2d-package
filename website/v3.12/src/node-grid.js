cc.NodeGrid = cc.Node.extend({
    grid: null,
    _target: null,
    _gridRect:null,
    ctor: function (rect) {
        cc.Node.prototype.ctor.call(this);
        if(rect === undefined) rect = cc.rect();
        this._gridRect = rect;
    },
    getGrid: function () {
        return this.grid;
    },
    setGrid: function (grid) {
        this.grid = grid;
    },
    setGridRect: function (rect) {
        this._gridRect = rect;
    },
    getGridRect: function () {
        return this._gridRect;
    },
    setTarget: function (target) {
        this._target = target;
    },
    _createRenderCmd: function(){
        if (cc._renderType === cc.game.RENDER_TYPE_WEBGL)
            return new cc.NodeGrid.WebGLRenderCmd(this);
        else
            return new cc.Node.CanvasRenderCmd(this);
    }
});
var _p = cc.NodeGrid.prototype;
_p.grid;
_p.target;
cc.defineGetterSetter(_p, "target", null, _p.setTarget);
cc.NodeGrid.create = function () {
    return new cc.NodeGrid();
};
(function(){
    cc.NodeGrid.WebGLRenderCmd = function(renderable){
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._needDraw = false;
        this._gridBeginCommand = new cc.CustomRenderCmd(this, this.onGridBeginDraw);
        this._gridEndCommand = new cc.CustomRenderCmd(this, this.onGridEndDraw);
    };
    var proto = cc.NodeGrid.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.NodeGrid.WebGLRenderCmd;
    proto.visit = function(parentCmd) {
        var node = this._node;
        if (!node._visible)
            return;
        parentCmd = parentCmd || this.getParentRenderCmd();
        if (node._parent && node._parent._renderCmd)
            this._curLevel = node._parent._renderCmd._curLevel + 1;
        var currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        this._syncStatus(parentCmd);
        currentStack.top = this._stackMatrix;
        cc.renderer.pushRenderCommand(this._gridBeginCommand);
        if (node._target)
            node._target.visit();
        var locChildren = node._children;
        if (locChildren && locChildren.length > 0) {
            var childLen = locChildren.length;
            node.sortAllChildren();
            for (var i = 0; i < childLen; i++) {
                var child = locChildren[i];
                child && child.visit();
            }
        }
        cc.renderer.pushRenderCommand(this._gridEndCommand);
        this._dirtyFlag = 0;
        currentStack.top = currentStack.stack.pop();
    };
    proto.onGridBeginDraw = function(){
        var locGrid = this._node.grid;
        if (locGrid && locGrid._active)
            locGrid.beforeDraw();
    };
    proto.onGridEndDraw = function(){
        var locGrid = this._node.grid;
        if (locGrid && locGrid._active)
            locGrid.afterDraw(this._node);
    };
})();
