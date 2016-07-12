(function(){
    ccs.Armature.WebGLRenderCmd = function(renderableObject){
        cc.Node.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._parentCmd = null;
        this._realAnchorPointInPoints = new cc.Point(0,0);
    };
    var proto = ccs.Armature.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    cc.inject(ccs.Armature.RenderCmd, proto);
    proto.constructor = ccs.Armature.WebGLRenderCmd;
    proto.uploadData = function (f32buffer, ui32buffer, vertexDataOffset) {
        var node = this._node, cmd;
        var parentCmd = this._parentCmd || this;
        var locChildren = node._children;
        var alphaPremultiplied = cc.BlendFunc.ALPHA_PREMULTIPLIED, alphaNonPremultipled = cc.BlendFunc.ALPHA_NON_PREMULTIPLIED;
        for (var i = 0, len = locChildren.length; i < len; i++) {
            var selBone = locChildren[i];
            if (selBone && selBone.getDisplayRenderNode) {
                var selNode = selBone.getDisplayRenderNode();
                if (null === selNode)
                    continue;
                cmd = selNode._renderCmd;
                switch (selBone.getDisplayRenderNodeType()) {
                    case ccs.DISPLAY_TYPE_SPRITE:
                        if (selNode instanceof ccs.Skin) {
                            selNode.setShaderProgram(this._shaderProgram);
                            this._updateColorAndOpacity(cmd, selBone);
                            cmd.transform(parentCmd);
                            var func = selBone.getBlendFunc();
                            if (func.src !== alphaPremultiplied.src || func.dst !== alphaPremultiplied.dst)
                                selNode.setBlendFunc(selBone.getBlendFunc());
                            else {
                                if (node._blendFunc.src === alphaPremultiplied.src &&
                                    node._blendFunc.dst === alphaPremultiplied.dst &&
                                    !selNode.getTexture().hasPremultipliedAlpha()) {
                                    selNode.setBlendFunc(alphaNonPremultipled);
                                }
                                else {
                                    selNode.setBlendFunc(node._blendFunc);
                                }
                            }
                            cc.renderer._uploadBufferData(cmd);
                        }
                        break;
                    case ccs.DISPLAY_TYPE_ARMATURE:
                        selNode.setShaderProgram(this._shaderProgram);
                        cmd._parentCmd = this;
                    default:
                        if (cmd.uploadData) {
                            cc.renderer._uploadBufferData(cmd);
                        }
                        else {
                            cc.renderer._batchRendering();
                            cmd.transform(this);
                            cmd.rendering(cc._renderContext);
                        }
                        break;
                }
            } else if (selBone instanceof cc.Node) {
                selBone.setShaderProgram(this._shaderProgram);
                cmd = selBone._renderCmd;
                cmd.transform(this);
                if (cmd.uploadData) {
                    cc.renderer._uploadBufferData(cmd);
                }
                else if (cmd.rendering) {
                    cc.renderer._batchRendering();
                    cmd.rendering(cc._renderContext);
                }
            }
        }
        this._parentCmd = null;
        return 0;
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
    proto.visit = function(parentCmd){
        var node = this._node;
        if (!node._visible)
            return;
        parentCmd = parentCmd || this.getParentRenderCmd();
        if (parentCmd)
            this._curLevel = parentCmd._curLevel + 1;
        this.updateStatus(parentCmd);
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
    };
})();
