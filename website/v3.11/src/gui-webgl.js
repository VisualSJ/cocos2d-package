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
        if (!node._visible) return;
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
