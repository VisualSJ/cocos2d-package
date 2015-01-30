(function(){
    cc.RenderTexture.WebGLRenderCmd = function(renderableObject){
        cc.Node.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._fBO = null;
        this._oldFBO = null;
        this._textureCopy = null;
        this._depthRenderBuffer = null;
    };
    var proto = cc.RenderTexture.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.RenderTexture.WebGLRenderCmd;
    proto.rendering = function (ctx) {
        var gl = ctx || cc._renderContext;
        var node = this._node;
        if (node.autoDraw) {
            node.begin();
            var locClearFlags = node.clearFlags;
            if (locClearFlags) {
                var oldClearColor = [0.0, 0.0, 0.0, 0.0];
                var oldDepthClearValue = 0.0;
                var oldStencilClearValue = 0;
                if (locClearFlags & gl.COLOR_BUFFER_BIT) {
                    oldClearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);
                    gl.clearColor(node._clearColor.r / 255, node._clearColor.g / 255, node._clearColor.b / 255, node._clearColor.a / 255);
                }
                if (locClearFlags & gl.DEPTH_BUFFER_BIT) {
                    oldDepthClearValue = gl.getParameter(gl.DEPTH_CLEAR_VALUE);
                    gl.clearDepth(node.clearDepthVal);
                }
                if (locClearFlags & gl.STENCIL_BUFFER_BIT) {
                    oldStencilClearValue = gl.getParameter(gl.STENCIL_CLEAR_VALUE);
                    gl.clearStencil(node.clearStencilVal);
                }
                gl.clear(locClearFlags);
                if (locClearFlags & gl.COLOR_BUFFER_BIT)
                    gl.clearColor(oldClearColor[0], oldClearColor[1], oldClearColor[2], oldClearColor[3]);
                if (locClearFlags & gl.DEPTH_BUFFER_BIT)
                    gl.clearDepth(oldDepthClearValue);
                if (locClearFlags & gl.STENCIL_BUFFER_BIT)
                    gl.clearStencil(oldStencilClearValue);
            }
            node.sortAllChildren();
            var locChildren = node._children;
            for (var i = 0; i < locChildren.length; i++) {
                var getChild = locChildren[i];
                if (getChild != node.sprite){
                    getChild._renderCmd.visit(node.sprite._renderCmd);
                }
            }
            node.end();
        }
    };
    proto.clearStencil = function(stencilValue) {
        var gl = cc._renderContext;
        var stencilClearValue = gl.getParameter(gl.STENCIL_CLEAR_VALUE);
        gl.clearStencil(stencilValue);
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.clearStencil(stencilClearValue);
    };
    proto.cleanup = function(){
        var node = this._node;
        this._textureCopy = null;
        var gl = cc._renderContext;
        gl.deleteFramebuffer(this._fBO);
        if (this._depthRenderBuffer)
            gl.deleteRenderbuffer(this._depthRenderBuffer);
    };
    proto.updateClearColor = function(clearColor){ };
    proto.initWithWidthAndHeight = function(width, height, format, depthStencilFormat){
        var node = this._node;
        if(format == cc.Texture2D.PIXEL_FORMAT_A8)
            cc.log( "cc.RenderTexture._initWithWidthAndHeightForWebGL() : only RGB and RGBA formats are valid for a render texture;");
        var gl = cc._renderContext, locScaleFactor = cc.contentScaleFactor();
        width = 0 | (width * locScaleFactor);
        height = 0 | (height * locScaleFactor);
        this._oldFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        var powW , powH;
        if (cc.configuration.supportsNPOT()) {
            powW = width;
            powH = height;
        } else {
            powW = cc.NextPOT(width);
            powH = cc.NextPOT(height);
        }
        var dataLen = powW * powH * 4;
        var data = new Uint8Array(dataLen);
        for (var i = 0; i < powW * powH * 4; i++)
            data[i] = 0;
        this._pixelFormat = format;
        var locTexture = node._texture = new cc.Texture2D();
        if (!node._texture)
            return false;
        locTexture.initWithData(data, node._pixelFormat, powW, powH, cc.size(width, height));
        var oldRBO = gl.getParameter(gl.RENDERBUFFER_BINDING);
        if (cc.configuration.checkForGLExtension("GL_QCOM")) {
            this._textureCopy = new cc.Texture2D();
            if (!this._textureCopy)
                return false;
            this._textureCopy.initWithData(data, node._pixelFormat, powW, powH, cc.size(width, height));
        }
        this._fBO = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fBO);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, locTexture._webTextureObj, 0);
        if (depthStencilFormat != 0) {
            this._depthRenderBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, depthStencilFormat, powW, powH);
            if(depthStencilFormat === gl.DEPTH_STENCIL)
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this._depthRenderBuffer);
            else if(depthStencilFormat === gl.STENCIL_INDEX || depthStencilFormat === gl.STENCIL_INDEX8)
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.RENDERBUFFER, this._depthRenderBuffer);
            else if(depthStencilFormat === gl.DEPTH_COMPONENT16)
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthRenderBuffer);
        }
        if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
            cc.log("Could not attach texture to the framebuffer");
        locTexture.setAliasTexParameters();
        var locSprite = node.sprite = new cc.Sprite(locTexture);
        locSprite.scaleY = -1;
        locSprite.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.bindRenderbuffer(gl.RENDERBUFFER, oldRBO);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._oldFBO);
        node.autoDraw = false;
        node.addChild(locSprite);
        return true;
    };
    proto.begin = function(){
        var node = this._node;
        cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
        cc.kmGLPushMatrix();
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.kmGLPushMatrix();
        var director = cc.director;
        director.setProjection(director.getProjection());
        var texSize = node._texture.getContentSizeInPixels();
        var size = cc.director.getWinSizeInPixels();
        var widthRatio = size.width / texSize.width;
        var heightRatio = size.height / texSize.height;
        var gl = cc._renderContext;
        gl.viewport(0, 0, texSize.width, texSize.height);
        var orthoMatrix = new cc.kmMat4();
        cc.kmMat4OrthographicProjection(orthoMatrix, -1.0 / widthRatio, 1.0 / widthRatio,
                -1.0 / heightRatio, 1.0 / heightRatio, -1, 1);
        cc.kmGLMultMatrix(orthoMatrix);
        this._oldFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fBO);//Will direct drawing to the frame buffer created above
        if (cc.configuration.checkForGLExtension("GL_QCOM")) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._textureCopy._webTextureObj, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, node._texture._webTextureObj, 0);
        }
    };
    proto._beginWithClear = function(r, g, b, a, depthValue, stencilValue, flags){
        r = r / 255;
        g = g / 255;
        b = b / 255;
        a = a / 255;
        var gl = cc._renderContext;
        var clearColor = [0.0, 0.0, 0.0, 0.0];
        var depthClearValue = 0.0;
        var stencilClearValue = 0;
        if (flags & gl.COLOR_BUFFER_BIT) {
            clearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);
            gl.clearColor(r, g, b, a);
        }
        if (flags & gl.DEPTH_BUFFER_BIT) {
            depthClearValue = gl.getParameter(gl.DEPTH_CLEAR_VALUE);
            gl.clearDepth(depthValue);
        }
        if (flags & gl.STENCIL_BUFFER_BIT) {
            stencilClearValue = gl.getParameter(gl.STENCIL_CLEAR_VALUE);
            gl.clearStencil(stencilValue);
        }
        gl.clear(flags);
        if (flags & gl.COLOR_BUFFER_BIT)
            gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
        if (flags & gl.DEPTH_BUFFER_BIT)
            gl.clearDepth(depthClearValue);
        if (flags & gl.STENCIL_BUFFER_BIT)
            gl.clearStencil(stencilClearValue);
    };
    proto.end = function(){
        var node = this._node;
        cc.renderer._renderingToBuffer(node.__instanceId);
        var gl = cc._renderContext;
        var director = cc.director;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._oldFBO);
        director.setViewport();
        cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
        cc.kmGLPopMatrix();
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.kmGLPopMatrix();
    };
    proto.clearRect = function(x, y, width, height){
    };
    proto.clearDepth = function(depthValue){
        var node = this._node;
        node.begin();
        var gl = cc._renderContext;
        var depthClearValue = gl.getParameter(gl.DEPTH_CLEAR_VALUE);
        gl.clearDepth(depthValue);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.clearDepth(depthClearValue);
        node.end();
    };
    proto.visit = function(parentCmd){
        var node = this._node;
        if (!node._visible)
            return;
        cc.kmGLPushMatrix();
        this._syncStatus(parentCmd);
        cc.renderer.pushRenderCommand(this);
        node.sprite.visit(this);
        this._dirtyFlag = 0;
        cc.kmGLPopMatrix();
    };
})();
