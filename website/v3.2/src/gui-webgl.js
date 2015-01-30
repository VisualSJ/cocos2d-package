(function() {
    cc.Scale9Sprite.WebGLRenderCmd = function (renderable) {
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._cachedParent = null;
        this._cacheDirty = false;
    };
    var proto = cc.Scale9Sprite.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.Scale9Sprite.WebGLRenderCmd;
    proto.addBatchNodeToChildren = function(batchNode){
        this._node.addChild(batchNode);
    };
    proto._computeSpriteScale = function (sizableWidth, sizableHeight, centerWidth, centerHeight) {
        var horizontalScale = sizableWidth / centerWidth, verticalScale = sizableHeight / centerHeight;
        var rescaledWidth = centerWidth * horizontalScale, rescaledHeight = centerHeight * verticalScale;
        var roundedRescaledWidth = Math.round(rescaledWidth);
        if (rescaledWidth !== roundedRescaledWidth) {
            rescaledWidth = roundedRescaledWidth;
            horizontalScale = rescaledWidth / centerWidth;
        }
        var roundedRescaledHeight = Math.round(rescaledHeight);
        if (rescaledHeight !== roundedRescaledHeight) {
            rescaledHeight = roundedRescaledHeight;
            verticalScale = rescaledHeight / centerHeight;
        }
        return {horizontalScale: horizontalScale, verticalScale: verticalScale,
            rescaledWidth: rescaledWidth, rescaledHeight: rescaledHeight}
    };
    proto.visit = function(parentCmd){
        var node = this._node;
        if(!node._visible){
            return;
        }
        if (node._positionsAreDirty) {
            node._updatePositions();
            node._positionsAreDirty = false;
            node._scale9Dirty = true;
        }
        cc.Node.WebGLRenderCmd.prototype.visit.call(this, parentCmd);
    };
})();
(function() {
    cc.ScrollView.WebGLRenderCmd = function(renderable){
        cc.Layer.WebGLRenderCmd.call(this, renderable);
        this._needDraw = false;
        this.startCmd = new cc.CustomRenderCmd(this, this._startCmd);
        this.endCmd = new cc.CustomRenderCmd(this, this._endCmd);
    };
    var proto = cc.ScrollView.WebGLRenderCmd.prototype = Object.create(cc.Layer.WebGLRenderCmd.prototype);
    proto.constructor = cc.ScrollView.WebGLRenderCmd;
    proto._startCmd = function(){
        var node = this._node;
        var EGLViewer = cc.view;
        var frame = node._getViewRect();
        if(EGLViewer.isScissorEnabled()){
            node._scissorRestored = true;
            node._parentScissorRect = EGLViewer.getScissorRect();
            if (cc.rectIntersection(frame, node._parentScissorRect)) {
                var locPSRect = node._parentScissorRect;
                var x = Math.max(frame.x, locPSRect.x);
                var y = Math.max(frame.y, locPSRect.y);
                var xx = Math.min(frame.x + frame.width, locPSRect.x + locPSRect.width);
                var yy = Math.min(frame.y + frame.height, locPSRect.y + locPSRect.height);
                EGLViewer.setScissorInPoints(x, y, xx - x, yy - y);
            }
        }else{
            var ctx = cc._renderContext;
            ctx.enable(ctx.SCISSOR_TEST);
            EGLViewer.setScissorInPoints(frame.x, frame.y, frame.width, frame.height);
        }
    };
    proto._endCmd = function(){
        var node = this._node;
        if (node._scissorRestored) {
            var rect = node._parentScissorRect;
            cc.view.setScissorInPoints(rect.x, rect.y, rect.width, rect.height)
        }else{
            var ctx = cc._renderContext;
            ctx.disable(ctx.SCISSOR_TEST);
        }
    };
    proto.visit = function(parendCmd){
        var node = this._node;
        var i, locChildren = node._children, selChild, childrenLen;
        cc.kmGLPushMatrix();
        this.transform(parendCmd);
        if (node._clippingToBounds) {
            cc.renderer.pushRenderCommand(this.startCmd);
        }
        if (locChildren && locChildren.length > 0) {
            childrenLen = locChildren.length;
            for (i = 0; i < childrenLen; i++) {
                selChild = locChildren[i];
                if (selChild && selChild._localZOrder < 0)
                    selChild._renderCmd.visit();
                else
                    break;
            }
            for (; i < childrenLen; i++)
                locChildren[i]._renderCmd.visit();
        }
        if (node._clippingToBounds) {
            cc.renderer.pushRenderCommand(this.endCmd);
        }
        this._dirtyFlag = 0;
        cc.kmGLPopMatrix();
    };
})();
