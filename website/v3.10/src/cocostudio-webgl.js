(function(){
    ccs.Skin.WebGLRenderCmd = function(renderable){
        cc.Sprite.WebGLRenderCmd.call(this, renderable);
    };
    var proto = ccs.Skin.WebGLRenderCmd.prototype = Object.create(cc.Sprite.WebGLRenderCmd.prototype);
    cc.inject(ccs.Skin.RenderCmd, proto);
    proto.constructor = ccs.Skin.WebGLRenderCmd;
    proto.updateTransform = function(){
        var node = this._node;
        var locQuad = this._quad;
        if( !node._visible)
            locQuad.br.vertices = locQuad.tl.vertices = locQuad.tr.vertices = locQuad.bl.vertices = {x: 0, y: 0, z: 0};
        else {
            var transform = this.getNodeToParentTransform();
            var size = node._rect;
            var x1 = node._offsetPosition.x, y1 = node._offsetPosition.y;
            var x2 = x1 + size.width, y2 = y1 + size.height;
            var x = transform.tx, y = transform.ty;
            var cr = transform.a, sr = transform.b;
            var cr2 = transform.d, sr2 = -transform.c;
            var ax = x1 * cr - y1 * sr2 + x;
            var ay = x1 * sr + y1 * cr2 + y;
            var bx = x2 * cr - y1 * sr2 + x;
            var by = x2 * sr + y1 * cr2 + y;
            var cx = x2 * cr - y2 * sr2 + x;
            var cy = x2 * sr + y2 * cr2 + y;
            var dx = x1 * cr - y2 * sr2 + x;
            var dy = x1 * sr + y2 * cr2 + y;
            var locVertexZ = node._vertexZ;
            if(!cc.SPRITEBATCHNODE_RENDER_SUBPIXEL) {
                ax = 0 | ax;
                ay = 0 | ay;
                bx = 0 | bx;
                by = 0 | by;
                cx = 0 | cx;
                cy = 0 | cy;
                dx = 0 | dx;
                dy = 0 | dy;
            }
            this.SET_VERTEX3F(locQuad.bl.vertices,ax, ay,locVertexZ);
            this.SET_VERTEX3F(locQuad.br.vertices,bx, by,locVertexZ);
            this.SET_VERTEX3F(locQuad.tl.vertices,dx, dy,locVertexZ);
            this.SET_VERTEX3F(locQuad.tr.vertices,cx, cy,locVertexZ);
        }
        if (node.textureAtlas)
            node.textureAtlas.updateQuad(locQuad, node.textureAtlas.getTotalQuads());
        this._quadDirty = true;
    };
    proto.SET_VERTEX3F = function(_v_, _x_, _y_, _z_){
        (_v_).x = (_x_);
        (_v_).y = (_y_);
        (_v_).z = (_z_);
    };
    proto.rendering = function(ctx){
        var node = this._node;
        if (!node._textureLoaded)
            return;
        var gl = ctx || cc._renderContext, locTexture = node._texture;
        if (locTexture && locTexture._textureLoaded) {
            this._shaderProgram.use();
            this._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4();
            cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
            cc.glBindTexture2DN(0, locTexture);
            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._quadWebBuffer);
            if (this._quadDirty) {
                gl.bufferData(gl.ARRAY_BUFFER, this._quad.arrayBuffer, gl.DYNAMIC_DRAW);
                this._quadDirty = false;
            }
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
            gl.vertexAttribPointer(1, 4, gl.UNSIGNED_BYTE, true, 24, 12);
            gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 24, 16);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        cc.g_NumberOfDraws++;
        if (cc.SPRITE_DEBUG_DRAW === 0 && !node._showNode)
            return;
        if (cc.SPRITE_DEBUG_DRAW === 1 || node._showNode) {
            var locQuad = this._quad;
            var verticesG1 = [
                cc.p(locQuad.tl.vertices.x, locQuad.tl.vertices.y),
                cc.p(locQuad.bl.vertices.x, locQuad.bl.vertices.y),
                cc.p(locQuad.br.vertices.x, locQuad.br.vertices.y),
                cc.p(locQuad.tr.vertices.x, locQuad.tr.vertices.y)
            ];
            cc._drawingUtil.drawPoly(verticesG1, 4, true);
        } else if (cc.SPRITE_DEBUG_DRAW === 2) {
            var drawRectG2 = node.getTextureRect();
            var offsetPixG2 = node.getOffsetPosition();
            var verticesG2 = [cc.p(offsetPixG2.x, offsetPixG2.y), cc.p(offsetPixG2.x + drawRectG2.width, offsetPixG2.y),
                cc.p(offsetPixG2.x + drawRectG2.width, offsetPixG2.y + drawRectG2.height), cc.p(offsetPixG2.x, offsetPixG2.y + drawRectG2.height)];
            cc._drawingUtil.drawPoly(verticesG2, 4, true);
        }
    };
})();
(function(){
    ccs.Armature.WebGLRenderCmd = function(renderableObject){
        cc.Node.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._realAnchorPointInPoints = new cc.Point(0,0);
    };
    var proto = ccs.Armature.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    cc.inject(ccs.Armature.RenderCmd, proto);
    proto.constructor = ccs.Armature.WebGLRenderCmd;
    proto.rendering = function (ctx, dontChangeMatrix) {
        var node = this._node;
        if(!dontChangeMatrix){
            cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
            cc.kmGLPushMatrix();
            cc.kmGLLoadMatrix(this._stackMatrix);
        }
        var locChildren = node._children;
        var alphaPremultiplied = cc.BlendFunc.ALPHA_PREMULTIPLIED, alphaNonPremultipled = cc.BlendFunc.ALPHA_NON_PREMULTIPLIED;
        for (var i = 0, len = locChildren.length; i < len; i++) {
            var selBone = locChildren[i];
            if (selBone && selBone.getDisplayRenderNode) {
                var selNode = selBone.getDisplayRenderNode();
                if (null === selNode)
                    continue;
                selNode.setShaderProgram(this._shaderProgram);
                switch (selBone.getDisplayRenderNodeType()) {
                    case ccs.DISPLAY_TYPE_SPRITE:
                        if (selNode instanceof ccs.Skin) {
                            this._updateColorAndOpacity(selNode._renderCmd, selBone);
                            selNode.updateTransform();
                            var func = selBone.getBlendFunc();
                            if (func.src !== alphaPremultiplied.src || func.dst !== alphaPremultiplied.dst)
                                selNode.setBlendFunc(selBone.getBlendFunc());
                            else {
                                if ((node._blendFunc.src === alphaPremultiplied.src && node._blendFunc.dst === alphaPremultiplied.dst)
                                    && !selNode.getTexture().hasPremultipliedAlpha())
                                    selNode.setBlendFunc(alphaNonPremultipled);
                                else
                                    selNode.setBlendFunc(node._blendFunc);
                            }
                            selNode._renderCmd.rendering(ctx);
                        }
                        break;
                    case ccs.DISPLAY_TYPE_ARMATURE:
                        selNode._renderCmd.rendering(ctx, true);
                        break;
                    default:
                        selNode._renderCmd.transform();
                        selNode._renderCmd.rendering(ctx);
                        break;
                }
            } else if (selBone instanceof cc.Node) {
                selBone.setShaderProgram(this._shaderProgram);
                selBone._renderCmd.transform();
                if(selBone._renderCmd.rendering)
                    selBone._renderCmd.rendering(ctx);
            }
        }
        if(!dontChangeMatrix)
            cc.kmGLPopMatrix();
    };
    proto.initShaderCache = function(){
        this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
    };
    proto.setShaderProgram = function(shaderProgram){
        this._shaderProgram = shaderProgram;
    };
    proto._updateColorAndOpacity = function(skinRenderCmd, bone){
        var parentColor = bone._renderCmd._displayedColor, parentOpacity = bone._renderCmd._displayedOpacity;
        var flags = cc.Node._dirtyFlags, locFlag = skinRenderCmd._dirtyFlag;
        var colorDirty = locFlag & flags.colorDirty,
            opacityDirty = locFlag & flags.opacityDirty;
        if(colorDirty)
            skinRenderCmd._updateDisplayColor(parentColor);
        if(opacityDirty)
            skinRenderCmd._updateDisplayOpacity(parentOpacity);
        if(colorDirty || opacityDirty)
            skinRenderCmd._updateColor();
    };
    proto.updateChildPosition = function(ctx, dis, selBone, alphaPremultiplied, alphaNonPremultipled){
        var node = this._node;
        dis.updateTransform();
        var func = selBone.getBlendFunc();
        if (func.src !== alphaPremultiplied.src || func.dst !== alphaPremultiplied.dst)
            dis.setBlendFunc(selBone.getBlendFunc());
        else {
            if ((node._blendFunc.src === alphaPremultiplied.src && node_blendFunc.dst === alphaPremultiplied.dst)
                && !dis.getTexture().hasPremultipliedAlpha())
                dis.setBlendFunc(alphaNonPremultipled);
            else
                dis.setBlendFunc(node._blendFunc);
        }
        dis.rendering(ctx);
    };
    proto.updateStatus = function () {
        var flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        var colorDirty = locFlag & flags.colorDirty,
            opacityDirty = locFlag & flags.opacityDirty;
        if(colorDirty)
            this._updateDisplayColor();
        if(opacityDirty)
            this._updateDisplayOpacity();
        if(colorDirty || opacityDirty)
            this._updateColor();
        if (locFlag & flags.orderDirty)
            this._dirtyFlag = this._dirtyFlag & flags.orderDirty ^ this._dirtyFlag;
        this.transform(this.getParentRenderCmd(), true);
    };
    proto.visit = function(parentCmd){
        var node = this._node;
        if (!node._visible)
            return;
        var currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        this.updateStatus(parentCmd);
        currentStack.top = this._stackMatrix;
        node.sortAllChildren();
        cc.renderer.pushRenderCommand(this);
        this._dirtyFlag = 0;
        currentStack.top = currentStack.stack.pop();
    };
})();
