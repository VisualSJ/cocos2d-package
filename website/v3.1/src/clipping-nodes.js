cc.stencilBits = -1;
cc.ClippingNode = cc.Node.extend({
    alphaThreshold: 0,
    inverted: false,
    _rendererSaveCmd: null,
    _rendererClipCmd: null,
    _rendererRestoreCmd: null,
    _beforeVisitCmd: null,
    _afterDrawStencilCmd: null,
    _afterVisitCmd: null,
    _stencil: null,
    _godhelpme: false,
    _clipElemType: null,
    _currentStencilFunc: null,
    _currentStencilRef: null,
    _currentStencilValueMask: null,
    _currentStencilFail: null,
    _currentStencilPassDepthFail: null,
    _currentStencilPassDepthPass:null,
    _currentStencilWriteMask:null,
    _currentStencilEnabled:null,
    _currentDepthWriteMask: null,
    _mask_layer_le: null,
    ctor: function (stencil) {
        cc.Node.prototype.ctor.call(this);
        this._stencil = null;
        this.alphaThreshold = 0;
        this.inverted = false;
        stencil = stencil || null;
        cc.ClippingNode.prototype.init.call(this, stencil);
    },
    _initRendererCmd: function(){
        if(cc._renderType === cc._RENDER_TYPE_CANVAS){
            this._rendererSaveCmd = new cc.ClippingNodeSaveRenderCmdCanvas(this);
            this._rendererClipCmd = new cc.ClippingNodeClipRenderCmdCanvas(this);
            this._rendererRestoreCmd = new cc.ClippingNodeRestoreRenderCmdCanvas(this);
        }else{
            this._beforeVisitCmd = new cc.CustomRenderCmdWebGL(this, this._onBeforeVisit);
            this._afterDrawStencilCmd  = new cc.CustomRenderCmdWebGL(this, this._onAfterDrawStencil);
            this._afterVisitCmd = new cc.CustomRenderCmdWebGL(this, this._onAfterVisit);
        }
    },
    /**
     * Initialization of the node, please do not call this function by yourself, you should pass the parameters to constructor to initialize it .
     * @function
     * @param {cc.Node} [stencil=null]
     */
    init: null,
    _className: "ClippingNode",
    _initForWebGL: function (stencil) {
        this._stencil = stencil;
        this.alphaThreshold = 1;
        this.inverted = false;
        cc.ClippingNode._init_once = true;
        if (cc.ClippingNode._init_once) {
            cc.stencilBits = cc._renderContext.getParameter(cc._renderContext.STENCIL_BITS);
            if (cc.stencilBits <= 0)
                cc.log("Stencil buffer is not enabled.");
            cc.ClippingNode._init_once = false;
        }
        return true;
    },
    _initForCanvas: function (stencil) {
        this._stencil = stencil;
        this.alphaThreshold = 1;
        this.inverted = false;
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
    visit: null,
    _visitForWebGL: function (ctx) {
        var gl = ctx || cc._renderContext;
        if (cc.stencilBits < 1) {
            cc.Node.prototype.visit.call(this, ctx);
            return;
        }
        if (!this._stencil || !this._stencil.visible) {
            if (this.inverted)
                cc.Node.prototype.visit.call(this, ctx);
            return;
        }
        if (cc.ClippingNode._layer + 1 == cc.stencilBits) {
            cc.ClippingNode._visit_once = true;
            if (cc.ClippingNode._visit_once) {
                cc.log("Nesting more than " + cc.stencilBits + "stencils is not supported. Everything will be drawn without stencil for this node and its childs.");
                cc.ClippingNode._visit_once = false;
            }
            cc.Node.prototype.visit.call(this, ctx);
            return;
        }
        cc.renderer.pushRenderCommand(this._beforeVisitCmd);
        var currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        cc.kmMat4Assign(this._stackMatrix, currentStack.top);
        currentStack.top = this._stackMatrix;
        this.transform();
        this._stencil.visit();
        cc.renderer.pushRenderCommand(this._afterDrawStencilCmd);
        var locChildren = this._children;
        if (locChildren && locChildren.length > 0) {
            var childLen = locChildren.length;
            this.sortAllChildren();
            for (var i = 0; i < childLen; i++) {
                if (locChildren[i] && locChildren[i]._localZOrder < 0)
                    locChildren[i].visit();
                else
                    break;
            }
            if(this._rendererCmd)
                cc.renderer.pushRenderCommand(this._rendererCmd);
            for (; i < childLen; i++) {
                if (locChildren[i]) {
                    locChildren[i].visit();
                }
            }
        } else{
            if(this._rendererCmd)
                cc.renderer.pushRenderCommand(this._rendererCmd);
        }
        cc.renderer.pushRenderCommand(this._afterVisitCmd);
        currentStack.top = currentStack.stack.pop();
    },
    _onBeforeVisit: function(ctx){
        var gl = ctx || cc._renderContext;
        cc.ClippingNode._layer++;
        var mask_layer = 0x1 << cc.ClippingNode._layer;
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
        gl.stencilOp(!this.inverted ? gl.ZERO : gl.REPLACE, gl.KEEP, gl.KEEP);
        this._drawFullScreenQuadClearStencil();
        gl.stencilFunc(gl.NEVER, mask_layer, mask_layer);
        gl.stencilOp(!this.inverted ? gl.REPLACE : gl.ZERO, gl.KEEP, gl.KEEP);
        if (this.alphaThreshold < 1) {
            var program = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLORALPHATEST);
            var alphaValueLocation = gl.getUniformLocation(program.getProgram(), cc.UNIFORM_ALPHA_TEST_VALUE_S);
            cc.glUseProgram(program.getProgram());
            program.setUniformLocationWith1f(alphaValueLocation, this.alphaThreshold);
            cc.setProgram(this._stencil, program);
        }
    },
    _drawFullScreenQuadClearStencil: function () {
        cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
        cc.kmGLPushMatrix();
        cc.kmGLLoadIdentity();
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.kmGLPushMatrix();
        cc.kmGLLoadIdentity();
        cc._drawingUtil.drawSolidRect(cc.p(-1, -1), cc.p(1, 1), cc.color(255, 255, 255, 255));
        cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
        cc.kmGLPopMatrix();
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.kmGLPopMatrix();
    },
    _onAfterDrawStencil: function(ctx){
        var gl = ctx || cc._renderContext;
        gl.depthMask(this._currentDepthWriteMask);
        gl.stencilFunc(gl.EQUAL, this._mask_layer_le, this._mask_layer_le);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    },
    _onAfterVisit: function(ctx){
        var gl = ctx || cc._renderContext;
        gl.stencilFunc(this._currentStencilFunc, this._currentStencilRef, this._currentStencilValueMask);
        gl.stencilOp(this._currentStencilFail, this._currentStencilPassDepthFail, this._currentStencilPassDepthPass);
        gl.stencilMask(this._currentStencilWriteMask);
        if (!this._currentStencilEnabled)
            gl.disable(gl.STENCIL_TEST);
        cc.ClippingNode._layer--;
    },
    _visitForCanvas: function (ctx) {
        this._clipElemType = (this._cangodhelpme() || this._stencil instanceof cc.Sprite);
        var context = ctx || cc._renderContext;
        var i, children = this._children, locChild;
        if (!this._stencil || !this._stencil.visible) {
            if (this.inverted)
                cc.Node.prototype.visit.call(this, ctx);
            return;
        }
        if(this._rendererSaveCmd)
            cc.renderer.pushRenderCommand(this._rendererSaveCmd);
        if(this._clipElemType){
            cc.Node.prototype.visit.call(this, context);
        }else{
            this._stencil.visit(context);
        }
        if(this._rendererClipCmd)
            cc.renderer.pushRenderCommand(this._rendererClipCmd);
        this.transform();
        if(this._clipElemType){
            this._stencil.visit();
        }else{
            this._cangodhelpme(true);
            var len = children.length;
            if (len > 0) {
                this.sortAllChildren();
                for (i = 0; i < len; i++) {
                    locChild = children[i];
                    if (locChild._localZOrder < 0)
                        locChild.visit(context);
                    else
                        break;
                }
                if(this._rendererCmd)
                    cc.renderer.pushRenderCommand(this._rendererCmd);
                for (; i < len; i++) {
                    children[i].visit(context);
                }
            } else
            if(this._rendererCmd)
                cc.renderer.pushRenderCommand(this._rendererCmd);
            this._cangodhelpme(false);
        }
        if(this._rendererRestoreCmd)
            cc.renderer.pushRenderCommand(this._rendererRestoreCmd);
    },
    getStencil: function () {
        return this._stencil;
    },
    setStencil: null,
    _setStencilForWebGL: function (stencil) {
        if(this._stencil == stencil)
            return;
        if(this._stencil)
            this._stencil._parent = null;
        this._stencil = stencil;
        if(this._stencil)
            this._stencil._parent = this;
    },
    _setStencilForCanvas: function (stencil) {
        this._stencil = stencil;
        if(stencil._buffer){
            for(var i=0; i<stencil._buffer.length; i++){
                stencil._buffer[i].isFill = false;
                stencil._buffer[i].isStroke = false;
            }
        }
        var locContext = cc._renderContext;
        if (stencil instanceof cc.DrawNode) {
            stencil._rendererCmd.rendering = function (ctx, scaleX, scaleY) {
                scaleX = scaleX || cc.view.getScaleX();
                scaleY = scaleY ||cc.view.getScaleY();
                var context = ctx || cc._renderContext;
                var t = this._node._transformWorld;
                context.save();
                context.transform(t.a, t.b, t.c, t.d, t.tx * scaleX, -t.ty * scaleY);
                context.beginPath();
                for (var i = 0; i < stencil._buffer.length; i++) {
                    var vertices = stencil._buffer[i].verts;
                    var firstPoint = vertices[0];
                    context.moveTo(firstPoint.x * scaleX, -firstPoint.y * scaleY);
                    for (var j = 1, len = vertices.length; j < len; j++)
                        context.lineTo(vertices[j].x * scaleX, -vertices[j].y * scaleY);
                }
                context.restore();
            };
        }
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
    _cangodhelpme: function (godhelpme) {
        if (godhelpme === true || godhelpme === false)
            cc.ClippingNode.prototype._godhelpme = godhelpme;
        return cc.ClippingNode.prototype._godhelpme;
    },
    _transformForRenderer: function(parentMatrix){
        cc.Node.prototype._transformForRenderer.call(this, parentMatrix);
        if(this._stencil)
            this._stencil._transformForRenderer(this._stackMatrix);
    }
});
var _p = cc.ClippingNode.prototype;
if (cc._renderType === cc._RENDER_TYPE_WEBGL) {
    _p.init = _p._initForWebGL;
    _p.visit = _p._visitForWebGL;
    _p.setStencil = _p._setStencilForWebGL;
} else {
    _p.init = _p._initForCanvas;
    _p.visit = _p._visitForCanvas;
    _p.setStencil = _p._setStencilForCanvas;
}
cc.defineGetterSetter(_p, "stencil", _p.getStencil, _p.setStencil);
_p.stencil;
cc.ClippingNode._init_once = null;
cc.ClippingNode._visit_once = null;
cc.ClippingNode._layer = -1;
cc.ClippingNode._sharedCache = null;
cc.ClippingNode._getSharedCache = function () {
    return (cc.ClippingNode._sharedCache) || (cc.ClippingNode._sharedCache = document.createElement("canvas"));
};
cc.ClippingNode.create = function (stencil) {
    return new cc.ClippingNode(stencil);
};
