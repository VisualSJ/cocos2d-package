cc.PointObject = cc.Class.extend({
    _ratio:null,
    _offset:null,
    _child:null,
    ctor: function(ratio, offset){
        this.initWithCCPoint(ratio, offset);
    },
    getRatio:function () {
        return this._ratio;
    },
    setRatio:function (value) {
        this._ratio = value;
    },
    getOffset:function () {
        return this._offset;
    },
    setOffset:function (value) {
        this._offset = value;
    },
    getChild:function () {
        return this._child;
    },
    setChild:function (value) {
        this._child = value;
    },
    initWithCCPoint:function (ratio, offset) {
        this._ratio = ratio;
        this._offset = offset;
        this._child = null;
        return true;
    }
});
cc.PointObject.create = function (ratio, offset) {
    return new cc.PointObject(ratio, offset);
};
cc.ParallaxNode = cc.Node.extend({
	parallaxArray:null,
    _lastPosition:null,
    _className:"ParallaxNode",
    getParallaxArray:function () {
        return this.parallaxArray;
    },
    setParallaxArray:function (value) {
        this.parallaxArray = value;
    },
    ctor:function () {
        cc.Node.prototype.ctor.call(this);
        this.parallaxArray = [];
        this._lastPosition = cc.p(-100, -100);
    },
    addChild:function (child, z, ratio, offset) {
        if (arguments.length === 3) {
            cc.log("ParallaxNode: use addChild(child, z, ratio, offset) instead");
            return;
        }
        if(!child)
            throw new Error("cc.ParallaxNode.addChild(): child should be non-null");
        var obj = new cc.PointObject(ratio, offset);
        obj.setChild(child);
        this.parallaxArray.push(obj);
	    child.setPosition(this._position.x * ratio.x + offset.x, this._position.y * ratio.y + offset.y);
        cc.Node.prototype.addChild.call(this, child, z, child.tag);
    },
    removeChild:function (child, cleanup) {
        var locParallaxArray = this.parallaxArray;
        for (var i = 0; i < locParallaxArray.length; i++) {
            var point = locParallaxArray[i];
            if (point.getChild() === child) {
                locParallaxArray.splice(i, 1);
                break;
            }
        }
        cc.Node.prototype.removeChild.call(this, child, cleanup);
    },
    removeAllChildren:function (cleanup) {
        this.parallaxArray.length = 0;
        cc.Node.prototype.removeAllChildren.call(this, cleanup);
    },
    _updateParallaxPosition: function(){
        var pos = this._absolutePosition();
        if (!cc.pointEqualToPoint(pos, this._lastPosition)) {
            var locParallaxArray = this.parallaxArray;
            for (var i = 0, len = locParallaxArray.length; i < len; i++) {
                var point = locParallaxArray[i];
                var child = point.getChild();
                child.setPosition(-pos.x + pos.x * point.getRatio().x + point.getOffset().x,
                        -pos.y + pos.y * point.getRatio().y + point.getOffset().y);
            }
            this._lastPosition = pos;
        }
    },
    _absolutePosition:function () {
        var ret = this._position;
        var cn = this;
        while (cn.parent !== null) {
            cn = cn.parent;
            ret = cc.pAdd(ret, cn.getPosition());
        }
        return ret;
    },
    _createRenderCmd: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new cc.ParallaxNode.CanvasRenderCmd(this);
        else
            return new cc.ParallaxNode.WebGLRenderCmd(this);
    }
});
cc.ParallaxNode.create = function () {
    return new cc.ParallaxNode();
};
(function(){
    cc.ParallaxNode.CanvasRenderCmd = function(renderable){
        cc.Node.CanvasRenderCmd.call(this, renderable);
        this._needDraw = false;
    };
    var proto = cc.ParallaxNode.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    proto.constructor = cc.ParallaxNode.CanvasRenderCmd;
    proto.updateStatus = function(){
        this._node._updateParallaxPosition();
        cc.Node.CanvasRenderCmd.prototype.updateStatus.call(this);
    };
    proto._syncStatus = function(parentCmd){
        this._node._updateParallaxPosition();
        cc.Node.CanvasRenderCmd.prototype._syncStatus.call(this, parentCmd);
    };
})();
cc.game.addEventListener(cc.game.EVENT_RENDERER_INITED, function () {
    if(cc._renderType !== cc.game.RENDER_TYPE_WEBGL)
        return;
    cc.ParallaxNode.WebGLRenderCmd = function(renderable){
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._needDraw = false;
    };
    var proto = cc.ParallaxNode.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.ParallaxNode.WebGLRenderCmd;
    proto.updateStatus = function(){
        this._node._updateParallaxPosition();
        cc.Node.WebGLRenderCmd.prototype.updateStatus.call(this);
    };
    proto._syncStatus = function(parentCmd){
        this._node._updateParallaxPosition();
        cc.Node.WebGLRenderCmd.prototype._syncStatus.call(this, parentCmd);
    };
});
