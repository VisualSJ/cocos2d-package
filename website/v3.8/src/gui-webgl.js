(function() {
    cc.Scale9Sprite.WebGLRenderCmd = function (renderable) {
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._cachedParent = null;
        this._cacheDirty = false;
    };
    var proto = cc.Scale9Sprite.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.Scale9Sprite.WebGLRenderCmd;
    proto.visit = function(parentCmd){
        var node = this._node;
        if(!node._visible)
            return;
        if (node._positionsAreDirty) {
            node._updatePositions();
            node._positionsAreDirty = false;
            node._scale9Dirty = true;
        }
        cc.Node.WebGLRenderCmd.prototype.visit.call(this, parentCmd);
    };
    proto.transform = function(parentCmd, recursive){
        var node = this._node;
        cc.Node.WebGLRenderCmd.prototype.transform.call(this, parentCmd, recursive);
        if (node._positionsAreDirty) {
            node._updatePositions();
            node._positionsAreDirty = false;
            node._scale9Dirty = true;
        }
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
    proto.setState = function (state) {
        var scale9Image = this._node._scale9Image;
        if(scale9Image === null)
            return;
        if (state === cc.Scale9Sprite.state.NORMAL) {
            scale9Image.setShaderProgram(cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR));
        } else if (state === cc.Scale9Sprite.state.GRAY) {
            scale9Image.setShaderProgram(cc.Scale9Sprite.WebGLRenderCmd._getGrayShaderProgram());
        }
    };
    cc.Scale9Sprite.WebGLRenderCmd._grayShaderProgram = null;
    cc.Scale9Sprite.WebGLRenderCmd._getGrayShaderProgram = function(){
        var grayShader = cc.Scale9Sprite.WebGLRenderCmd._grayShaderProgram;
        if(grayShader)
            return grayShader;
        grayShader = new cc.GLProgram();
        grayShader.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, cc.Scale9Sprite.WebGLRenderCmd._grayShaderFragment);
        grayShader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        grayShader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        grayShader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        grayShader.link();
        grayShader.updateUniforms();
        cc.Scale9Sprite.WebGLRenderCmd._grayShaderProgram = grayShader;
        return grayShader;
    };
    cc.Scale9Sprite.WebGLRenderCmd._grayShaderFragment =
        "precision lowp float;\n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"
        + "void main() \n"
        + "{ \n"
        + "    vec4 c = texture2D(CC_Texture0, v_texCoord); \n"
        + "    gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b); \n"
        +"     gl_FragColor.w = c.w ; \n"
        + "}";
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
