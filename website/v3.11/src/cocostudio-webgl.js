(function(){
    ccs.Skin.WebGLRenderCmd = function(renderable){
        cc.Sprite.WebGLRenderCmd.call(this, renderable);
    };
    var proto = ccs.Skin.WebGLRenderCmd.prototype = Object.create(cc.Sprite.WebGLRenderCmd.prototype);
    cc.inject(ccs.Skin.RenderCmd, proto);
    proto.constructor = ccs.Skin.WebGLRenderCmd;
    proto.vertexBytesPerUnit = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    proto.bytesPerUnit = proto.vertexBytesPerUnit;
    proto.indicesPerUnit = 6;
    proto.verticesPerUnit = 4;
    proto._supportBatch = true;
    proto.batchShader = null;
    proto.updateTransform = function(){
        var node = this._node;
        var locQuad = this._quad;
        var vertices = this._vertices;
        if (this._buffer) {
            var transform = this.getNodeToParentTransform();
            var buffer = this._float32View,
                i, x, y, offset = 0,
                row = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT / 16,
                parentCmd = this.getParentRenderCmd(),
                parentMatrix = (parentCmd ? parentCmd._stackMatrix : cc.current_stack.top),
                t4x4 = this._transform4x4, stackMatrix = this._stackMatrix,
                mat = t4x4.mat;
            mat[0] = transform.a;
            mat[4] = transform.c;
            mat[12] = transform.tx;
            mat[1] = transform.b;
            mat[5] = transform.d;
            mat[13] = transform.ty;
            cc.kmMat4Multiply(stackMatrix, parentMatrix, t4x4);
            mat[14] = node._vertexZ;
            mat = stackMatrix.mat;
            for (i = 0; i < 4; ++i) {
                x = vertices[i].x;
                y = vertices[i].y;
                z = vertices[i].z;
                buffer[offset] = x * mat[0] + y * mat[4] + mat[12];
                buffer[offset+1] = x * mat[1] + y * mat[5] + mat[13];
                buffer[offset+2] = mat[14];
                offset += row;
            }
            if (node.textureAtlas) {
                node.textureAtlas.updateQuad(locQuad, node.textureAtlas.getTotalQuads());
            }
            cc._renderContext.bindBuffer(gl.ARRAY_BUFFER, this._buffer.vertexBuffer);
            cc._renderContext.bufferSubData(gl.ARRAY_BUFFER, this._bufferOffset, this._float32View);
            cc._renderContext.bindBuffer(gl.ARRAY_BUFFER, null);
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
                switch (selBone.getDisplayRenderNodeType()) {
                    case ccs.DISPLAY_TYPE_SPRITE:
                        if (selNode instanceof ccs.Skin) {
                            selNode.setShaderProgram(this._shaderProgram);
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
                        selNode.setShaderProgram(this._shaderProgram);
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
        this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_SPRITE_POSITION_TEXTURECOLOR);
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
        var renderer = cc.renderer,
            children = node._children, child,
            i, len = children.length;
        for (i = 0; i < len; i++) {
            child = children[i];
            if (child._localZOrder < 0) {
                if (isNaN(child._customZ)) {
                    child._vertexZ = renderer.assignedZ;
                    renderer.assignedZ += renderer.assignedZStep;
                }
            }
            else {
                break;
            }
        }
        if (isNaN(node._customZ)) {
            node._vertexZ = renderer.assignedZ;
            renderer.assignedZ += renderer.assignedZStep;
        }
        renderer.pushRenderCommand(this);
        for (; i < len; i++) {
            child = children[i];
            if (isNaN(child._customZ)) {
                child._vertexZ = renderer.assignedZ;
                renderer.assignedZ += renderer.assignedZStep;
            }
        }
        this._dirtyFlag = 0;
        currentStack.top = currentStack.stack.pop();
    };
})();
