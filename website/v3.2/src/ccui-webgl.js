(function(){
    cc.ProtectedNode.WebGLRenderCmd = function (renderable) {
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._cachedParent = null;
        this._cacheDirty = false;
    };
    var proto = cc.ProtectedNode.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    cc.inject(cc.ProtectedNode.RenderCmd, proto);
    proto.constructor = cc.ProtectedNode.WebGLRenderCmd;
    proto.visit = function(parentCmd){
         this._node.visit(parentCmd);
    };
    proto._visit = function(parentCmd){
        var node = this._node;
        if (!node._visible)
            return;
        var  i, j, currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        this._syncStatus(parentCmd);
        currentStack.top = this._stackMatrix;
        var locGrid = node.grid;
        if (locGrid && locGrid._active)
            locGrid.beforeDraw();
        var locChildren = node._children, locProtectedChildren = node._protectedChildren;
        var childLen = locChildren.length, pLen = locProtectedChildren.length;
        node.sortAllChildren();
        node.sortAllProtectedChildren();
        var pChild;
        for (i = 0; i < childLen; i++) {
            if (locChildren[i] && locChildren[i]._localZOrder < 0)
                locChildren[i].visit(this);
            else
                break;
        }
        for(j = 0; j < pLen; j++){
            pChild = locProtectedChildren[j];
            if (pChild && pChild._localZOrder < 0){
                this._changeProtectedChild(pChild);
                pChild.visit(this);
            }else
                break;
        }
        cc.renderer.pushRenderCommand(this);
        for (; i < childLen; i++) {
            locChildren[i] && locChildren[i].visit(this);
        }
        for (; j < pLen; j++) {
            pChild = locProtectedChildren[j];
            if(!pChild) continue;
            this._changeProtectedChild(pChild);
            pChild.visit(this);
        }
        if (locGrid && locGrid._active)
            locGrid.afterDraw(node);
        this._dirtyFlag = 0;
        currentStack.top = currentStack.stack.pop();
    };
    proto._changeProtectedChild = function(child){
        var cmd = child._renderCmd,
            dirty = cmd._dirtyFlag,
            flags = cc.Node._dirtyFlags;
        if(this._dirtyFlag & flags.colorDirty)
            dirty |= flags.colorDirty;
        if(this._dirtyFlag & flags.opacityDirty)
            dirty |= flags.opacityDirty;
        var colorDirty = dirty & flags.colorDirty,
            opacityDirty = dirty & flags.opacityDirty;
        if(colorDirty)
            cmd._updateDisplayColor(this._displayedColor);
        if(opacityDirty)
            cmd._updateDisplayOpacity(this._displayedOpacity);
        if(colorDirty || opacityDirty)
            cmd._updateColor();
    };
    proto.transform = function(parentCmd, recursive){
        var node = this._node;
        var t4x4 = this._transform4x4, stackMatrix = this._stackMatrix,
            parentMatrix = parentCmd ? parentCmd._stackMatrix : cc.current_stack.top;
        var trans = node.getNodeToParentTransform();
        if(node._changePosition)
            node._changePosition();
        this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.transformDirty ^ this._dirtyFlag;
        var t4x4Mat = t4x4.mat;
        t4x4Mat[0] = trans.a;
        t4x4Mat[4] = trans.c;
        t4x4Mat[12] = trans.tx;
        t4x4Mat[1] = trans.b;
        t4x4Mat[5] = trans.d;
        t4x4Mat[13] = trans.ty;
        t4x4Mat[14] = node._vertexZ;
        cc.kmMat4Multiply(stackMatrix, parentMatrix, t4x4);
        if (node._camera != null && !(node.grid != null && node.grid.isActive())) {
            var apx = this._anchorPointInPoints.x, apy = this._anchorPointInPoints.y;
            var translate = (apx !== 0.0 || apy !== 0.0);
            if (translate){
                if(!cc.SPRITEBATCHNODE_RENDER_SUBPIXEL) {
                    apx = 0 | apx;
                    apy = 0 | apy;
                }
                var translation = new cc.kmMat4();
                cc.kmMat4Translation(translation, apx, apy, 0);
                cc.kmMat4Multiply(stackMatrix, stackMatrix, translation);
                node._camera._locateForRenderer(stackMatrix);
                cc.kmMat4Translation(translation, -apx, -apy, 0);
                cc.kmMat4Multiply(stackMatrix, stackMatrix, translation);
            } else {
                node._camera._locateForRenderer(stackMatrix);
            }
        }
        var i, len, locChildren = node._children;
        if(recursive && locChildren && locChildren.length !== 0){
            for(i = 0, len = locChildren.length; i< len; i++){
                locChildren[i]._renderCmd.transform(this, recursive);
            }
        }
        locChildren = node._protectedChildren;
        if(recursive && locChildren && locChildren.length !== 0){
            for(i = 0, len = locChildren.length; i< len; i++){
                locChildren[i]._renderCmd.transform(this, recursive);
            }
        }
    };
})();
(function() {
    ccui.Scale9Sprite.WebGLRenderCmd = function (renderable) {
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._cachedParent = null;
        this._cacheDirty = false;
    };
    var proto = ccui.Scale9Sprite.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = ccui.Scale9Sprite.WebGLRenderCmd;
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
    proto._updateDisplayColor = function(parentColor){
        cc.Node.WebGLRenderCmd.prototype._updateDisplayColor.call(this, parentColor);
        var scale9Image = this._node._scale9Image;
        if(scale9Image){
            var scaleChildren = scale9Image.getChildren();
            for (var i = 0; i < scaleChildren.length; i++) {
                var selChild = scaleChildren[i];
                if (selChild){
                    selChild._renderCmd._updateDisplayColor(parentColor);
                    selChild._renderCmd._updateColor();
                }
            }
        }
    };
    proto._updateDisplayOpacity = function(parentColor){
        cc.Node.WebGLRenderCmd.prototype._updateDisplayOpacity.call(this, parentColor);
        var scale9Image = this._node._scale9Image;
        if(scale9Image){
            var scaleChildren = scale9Image.getChildren();
            for (var i = 0; i < scaleChildren.length; i++) {
                var selChild = scaleChildren[i];
                if (selChild){
                    selChild._renderCmd._updateDisplayOpacity(parentColor);
                    selChild._renderCmd._updateColor();
                }
            }
        }
    };
})();
(function(){
    ccui.Layout.WebGLRenderCmd = function(renderable){
        ccui.ProtectedNode.WebGLRenderCmd.call(this, renderable);
        this._needDraw = false;
        this._currentStencilEnabled = 0;
        this._currentStencilWriteMask = 0;
        this._currentStencilFunc = 0;
        this._currentStencilRef = 0;
        this._currentStencilValueMask = 0;
        this._currentStencilFail = 0;
        this._currentStencilPassDepthFail = 0;
        this._currentStencilPassDepthPass = 0;
        this._currentDepthWriteMask = false;
        this._mask_layer_le = 0;
        this._beforeVisitCmdStencil = new cc.CustomRenderCmd(this, this._onBeforeVisitStencil);
        this._afterDrawStencilCmd = new cc.CustomRenderCmd(this, this._onAfterDrawStencil);
        this._afterVisitCmdStencil = new cc.CustomRenderCmd(this, this._onAfterVisitStencil);
        this._beforeVisitCmdScissor = new cc.CustomRenderCmd(this, this._onBeforeVisitScissor);
        this._afterVisitCmdScissor = new cc.CustomRenderCmd(this, this._onAfterVisitScissor);
    };
    var proto = ccui.Layout.WebGLRenderCmd.prototype = Object.create(ccui.ProtectedNode.WebGLRenderCmd.prototype);
    proto.constructor = ccui.Layout.WebGLRenderCmd;
    proto._onBeforeVisitStencil = function(ctx){
        var gl = ctx || cc._renderContext;
        ccui.Layout.WebGLRenderCmd._layer++;
        var mask_layer = 0x1 << ccui.Layout.WebGLRenderCmd._layer;
        var mask_layer_l = mask_layer - 1;
        this._mask_layer_le = mask_layer | mask_layer_l;
        this._currentStencilEnabled = gl.isEnabled(gl.STENCIL_TEST);
        this._currentStencilWriteMask = gl.getParameter(gl.STENCIL_WRITEMASK);
        this._currentStencilFunc = gl.getParameter(gl.STENCIL_FUNC);
        this._currentStencilRef = gl.getParameter(gl.STENCIL_REF);
        this._currentStencilValueMask = gl.getParameter(gl.STENCIL_VALUE_MASK);
        this._currentStencilFail = gl.getParameter(gl.STENCIL_FAIL);
        this._currentStencilPassDepthFail = gl.getParameter(gl.STENCIL_PASS_DEPTH_FAIL);
        this._currentStencilPassDepthPass = gl.getParameter(gl.STENCIL_PASS_DEPTH_PASS);
        gl.enable(gl.STENCIL_TEST);
        gl.stencilMask(mask_layer);
        this._currentDepthWriteMask = gl.getParameter(gl.DEPTH_WRITEMASK);
        gl.depthMask(false);
        gl.stencilFunc(gl.NEVER, mask_layer, mask_layer);
        gl.stencilOp(gl.ZERO, gl.KEEP, gl.KEEP);
        this._drawFullScreenQuadClearStencil();
        gl.stencilFunc(gl.NEVER, mask_layer, mask_layer);
        gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);
    };
    proto._onAfterDrawStencil = function(ctx){
        var gl = ctx || cc._renderContext;
        gl.depthMask(this._currentDepthWriteMask);
        gl.stencilFunc(gl.EQUAL, this._mask_layer_le, this._mask_layer_le);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    };
    proto._onAfterVisitStencil = function(ctx){
        var gl = ctx || cc._renderContext;
        gl.stencilFunc(this._currentStencilFunc, this._currentStencilRef, this._currentStencilValueMask);
        gl.stencilOp(this._currentStencilFail, this._currentStencilPassDepthFail, this._currentStencilPassDepthPass);
        gl.stencilMask(this._currentStencilWriteMask);
        if (!this._currentStencilEnabled)
            gl.disable(gl.STENCIL_TEST);
        ccui.Layout.WebGLRenderCmd._layer--;
    };
    proto._onBeforeVisitScissor = function(ctx){
        var clippingRect = this._getClippingRect();
        var gl = ctx || cc._renderContext;
        gl.enable(gl.SCISSOR_TEST);
        cc.view.setScissorInPoints(clippingRect.x, clippingRect.y, clippingRect.width, clippingRect.height);
    };
    proto._onAfterVisitScissor = function(ctx){
        var gl = ctx || cc._renderContext;
        gl.disable(gl.SCISSOR_TEST);
    };
    proto._drawFullScreenQuadClearStencil = function(){
        cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
        cc.kmGLPushMatrix();
        cc.kmGLLoadIdentity();
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.kmGLPushMatrix();
        cc.kmGLLoadIdentity();
        cc._drawingUtil.drawSolidRect(cc.p(-1,-1), cc.p(1,1), cc.color(255, 255, 255, 255));
        cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
        cc.kmGLPopMatrix();
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.kmGLPopMatrix();
    };
    proto.rebindStencilRendering = function(stencil){};
    proto.transform = function(parentCmd, recursive){
        var node = this._node;
        ccui.ProtectedNode.WebGLRenderCmd.prototype.transform.call(this, parentCmd, recursive);
        if(node._clippingStencil)
            node._clippingStencil._renderCmd.transform(this, recursive);
    };
    proto.stencilClippingVisit = function (parentCmd) {
        var node = this._node;
        if (!node._clippingStencil || !node._clippingStencil.isVisible())
            return;
        if (ccui.Layout.WebGLRenderCmd._layer + 1 == cc.stencilBits) {
            ccui.Layout.WebGLRenderCmd._visit_once = true;
            if (ccui.Layout.WebGLRenderCmd._visit_once) {
                cc.log("Nesting more than " + cc.stencilBits + "stencils is not supported. Everything will be drawn without stencil for this node and its childs.");
                ccui.Layout.WebGLRenderCmd._visit_once = false;
            }
            cc.Node.prototype.visit.call(node, parentCmd);
            return;
        }
        cc.renderer.pushRenderCommand(this._beforeVisitCmdStencil);
        var currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        this._syncStatus(parentCmd);
        this._dirtyFlag = 0;
        currentStack.top = this._stackMatrix;
        node._clippingStencil.visit(this);
        cc.renderer.pushRenderCommand(this._afterDrawStencilCmd);
        var i = 0;
        var j = 0;
        node.sortAllChildren();
        node.sortAllProtectedChildren();
        var locChildren = node._children, locProtectChildren = node._protectedChildren;
        var iLen = locChildren.length, jLen = locProtectChildren.length, child;
        for( ; i < iLen; i++ ){
            child = locChildren[i];
            if ( child && child.getLocalZOrder() < 0 )
                child.visit(this);
            else
                break;
        }
        for( ; j < jLen; j++ ) {
            child = locProtectChildren[j];
            if ( child && child.getLocalZOrder() < 0 )
                child.visit(this);
            else
                break;
        }
        for (; i < iLen; i++)
            locChildren[i].visit(this);
        for (; j < jLen; j++)
            locProtectChildren[j].visit(this);
        cc.renderer.pushRenderCommand(this._afterVisitCmdStencil);
        currentStack.top = currentStack.stack.pop();
    };
    proto.scissorClippingVisit = function(parentCmd){
        cc.renderer.pushRenderCommand(this._beforeVisitCmdScissor);
        cc.ProtectedNode.prototype.visit.call(this._node, parentCmd);
        cc.renderer.pushRenderCommand(this._afterVisitCmdScissor);
    };
    ccui.Layout.WebGLRenderCmd._layer = -1;
    ccui.Layout.WebGLRenderCmd._visit_once = null;
})();
