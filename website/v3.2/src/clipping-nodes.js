cc.stencilBits = -1;
cc.ClippingNode = cc.Node.extend({
    alphaThreshold: 0,
    inverted: false,
    _stencil: null,
    _className: "ClippingNode",
    ctor: function (stencil) {
        stencil = stencil || null;
        cc.Node.prototype.ctor.call(this);
        this._stencil = stencil;
        this.alphaThreshold = 1;
        this.inverted = false;
        this._renderCmd.initStencilBits();
    },
    /**
     * Initialization of the node, please do not call this function by yourself, you should pass the parameters to constructor to initialize it .
     * @function
     * @param {cc.Node} [stencil=null]
     */
    init: function (stencil) {
        this._stencil = stencil;
        this.alphaThreshold = 1;
        this.inverted = false;
        this._renderCmd.initStencilBits();
        return true;
    },
    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        this._stencil.onEnter();
    },
    onEnterTransitionDidFinish: function () {
        cc.Node.prototype.onEnterTransitionDidFinish.call(this);
        this._stencil.onEnterTransitionDidFinish();
    },
    onExitTransitionDidStart: function () {
        this._stencil.onExitTransitionDidStart();
        cc.Node.prototype.onExitTransitionDidStart.call(this);
    },
    onExit: function () {
        this._stencil.onExit();
        cc.Node.prototype.onExit.call(this);
    },
    getAlphaThreshold: function () {
        return this.alphaThreshold;
    },
    setAlphaThreshold: function (alphaThreshold) {
        this.alphaThreshold = alphaThreshold;
    },
    isInverted: function () {
        return this.inverted;
    },
    setInverted: function (inverted) {
        this.inverted = inverted;
    },
    getStencil: function () {
        return this._stencil;
    },
    setStencil: function (stencil) {
        if(this._stencil == stencil)
            return;
        this._renderCmd.setStencil(stencil);
    },
    _createRenderCmd: function(){
        if(cc._renderType === cc._RENDER_TYPE_CANVAS)
            return new cc.ClippingNode.CanvasRenderCmd(this);
        else
            return new cc.ClippingNode.WebGLRenderCmd(this);
    }
});
var _p = cc.ClippingNode.prototype;
cc.defineGetterSetter(_p, "stencil", _p.getStencil, _p.setStencil);
_p.stencil;
cc.ClippingNode.create = function (stencil) {
    return new cc.ClippingNode(stencil);
};
(function(){
    cc.ClippingNode.CanvasRenderCmd = function(renderable){
        cc.Node.CanvasRenderCmd.call(this, renderable);
        this._needDraw = false;
        this._godhelpme = false;
        this._clipElemType = false;
        this._rendererSaveCmd = new cc.CustomRenderCmd(this, this._saveCmdCallback);
        this._rendererClipCmd = new cc.CustomRenderCmd(this, this._clipCmdCallback);
        this._rendererRestoreCmd = new cc.CustomRenderCmd(this, this._restoreCmdCallback);
    };
    var proto = cc.ClippingNode.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    proto.constructor = cc.ClippingNode.CanvasRenderCmd;
    proto.initStencilBits = function(){};
    proto.setStencil = function(stencil){
        if(stencil == null)
            return;
        this._node._stencil = stencil;
        if (stencil instanceof cc.DrawNode) {
            if(stencil._buffer){
                for(var i=0; i<stencil._buffer.length; i++){
                    stencil._buffer[i].isFill = false;
                    stencil._buffer[i].isStroke = false;
                }
            }
            stencil._renderCmd.rendering = function (ctx, scaleX, scaleY) {
                scaleX = scaleX || cc.view.getScaleX();
                scaleY = scaleY ||cc.view.getScaleY();
                var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
                var t = this._transform;
                wrapper.save();
                context.transform(t.a, t.b, t.c, t.d, t.tx * scaleX, -t.ty * scaleY);
                context.beginPath();
                for (var i = 0; i < stencil._buffer.length; i++) {
                    var vertices = stencil._buffer[i].verts;
                    var firstPoint = vertices[0];
                    context.moveTo(firstPoint.x * scaleX, -firstPoint.y * scaleY);
                    for (var j = 1, len = vertices.length; j < len; j++)
                        context.lineTo(vertices[j].x * scaleX, -vertices[j].y * scaleY);
                }
                wrapper.restore();
            };
        }else{
            stencil._parent = this._node;
        }
    };
    proto._saveCmdCallback  = function(ctx, scaleX, scaleY) {
        var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
        if (this._clipElemType) {
            var locCache = cc.ClippingNode.CanvasRenderCmd._getSharedCache();
            var canvas = context.canvas;
            locCache.width = canvas.width;
            locCache.height = canvas.height;
            var locCacheCtx = locCache.getContext("2d");
            locCacheCtx.drawImage(canvas, 0, 0);
        } else {
            wrapper.save();
            wrapper.save();
            wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        }
    };
    proto._setStencilCompositionOperation = function(stencil){
         if(!stencil)
            return;
        var node = this._node;
        if(stencil._renderCmd && stencil._renderCmd._setBlendFuncStr)
            stencil._renderCmd._setBlendFuncStr(node.inverted ? "destination-out" : "destination-in");
        if(!stencil._children)
            return;
        var children = stencil._children;
        for(var i = 0, len = children.length; i < len; i++){
             this._setStencilCompositionOperation(children[i]);
        }
    };
    proto._clipCmdCallback = function(ctx) {
        var node = this._node;
        var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
        if (this._clipElemType) {
            this._setStencilCompositionOperation(node._stencil);
        } else {
            wrapper.restore();
            if (node.inverted) {
                var canvas = context.canvas;
                wrapper.save();
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.moveTo(0, 0);
                context.lineTo(0, canvas.height);
                context.lineTo(canvas.width, canvas.height);
                context.lineTo(canvas.width, 0);
                context.lineTo(0, 0);
                wrapper.restore();
            }
            context.closePath();
            context.clip();
        }
    };
    proto._restoreCmdCallback = function (ctx) {
        var locCache = cc.ClippingNode.CanvasRenderCmd._getSharedCache();
        var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
        if (this._clipElemType) {
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.globalCompositeOperation = "destination-over";
            context.drawImage(locCache, 0, 0);
            context.restore();
            this._dirtyFlag = 0;
        } else {
            wrapper.restore();
        }
    };
    proto.transform = function(parentCmd, recursive){
        cc.Node.CanvasRenderCmd.prototype.transform.call(this, parentCmd, recursive);
        var node = this._node;
        if(node._stencil && node._stencil._renderCmd)
            node._stencil._renderCmd.transform(this, recursive);
    };
    proto._cangodhelpme = function (godhelpme) {
        if (godhelpme === true || godhelpme === false)
            cc.ClippingNode.CanvasRenderCmd.prototype._godhelpme = godhelpme;
        return cc.ClippingNode.CanvasRenderCmd.prototype._godhelpme;
    };
    proto.visit = function(parentCmd){
        var node = this._node;
        if (!node._visible)
            return;
        parentCmd = parentCmd || this.getParentRenderCmd();
        if( parentCmd)
            this._curLevel = parentCmd._curLevel + 1;
        var transformRenderCmd = (node._stencil instanceof cc.Sprite) ? this : null;
        this._clipElemType = (this._cangodhelpme() || node._stencil instanceof cc.Sprite);
        if (!node._stencil || !node._stencil.visible) {
            if (this.inverted)
                cc.Node.CanvasRenderCmd.prototype.visit.call(this, parentCmd);
            return;
        }
        this._syncStatus(parentCmd);
        cc.renderer.pushRenderCommand(this._rendererSaveCmd);
        if(this._clipElemType){
            cc.Node.CanvasRenderCmd.prototype.visit.call(this, parentCmd);
        }else{
            node._stencil.visit(this);
        }
        cc.renderer.pushRenderCommand(this._rendererClipCmd);
        if(this._clipElemType){
            node._stencil.visit(transformRenderCmd);
        }else{
            var i, children = node._children;
            this._cangodhelpme(true);
            var len = children.length;
            if (len > 0) {
                node.sortAllChildren();
                for (i = 0; i < len; i++)
                    children[i]._renderCmd.visit(this);
            }
            this._cangodhelpme(false);
        }
        cc.renderer.pushRenderCommand(this._rendererRestoreCmd);
        this._dirtyFlag = 0;
    };
    cc.ClippingNode.CanvasRenderCmd._sharedCache = null;
    cc.ClippingNode.CanvasRenderCmd._getSharedCache = function () {
        return (cc.ClippingNode.CanvasRenderCmd._sharedCache) || (cc.ClippingNode.CanvasRenderCmd._sharedCache = document.createElement("canvas"));
    };
})();
