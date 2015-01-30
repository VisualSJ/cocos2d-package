(function(){
    sp.Skeleton.WebGLRenderCmd = function (renderableObject) {
        cc.Node.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this.setShaderProgram(cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR));
    };
    var proto = sp.Skeleton.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = sp.Skeleton.WebGLRenderCmd;
    proto.rendering = function (ctx) {
        var node = this._node;
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
        var color = node.getColor(), locSkeleton = node._skeleton;
        locSkeleton.r = color.r / 255;
        locSkeleton.g = color.g / 255;
        locSkeleton.b = color.b / 255;
        locSkeleton.a = node.getOpacity() / 255;
        if (node._premultipliedAlpha) {
            locSkeleton.r *= locSkeleton.a;
            locSkeleton.g *= locSkeleton.a;
            locSkeleton.b *= locSkeleton.a;
        }
        var additive, textureAtlas, attachment, slot, i, n,
            quad = new cc.V3F_C4B_T2F_Quad();
        var locBlendFunc = node._blendFunc;
        for (i = 0, n = locSkeleton.slots.length; i < n; i++) {
            slot = locSkeleton.drawOrder[i];
            if (!slot.attachment || slot.attachment.type != sp.ATTACHMENT_TYPE.REGION)
                continue;
            attachment = slot.attachment;
            var regionTextureAtlas = node.getTextureAtlas(attachment);
            if (slot.data.additiveBlending != additive) {
                if (textureAtlas) {
                    textureAtlas.drawQuads();
                    textureAtlas.removeAllQuads();
                }
                additive = !additive;
                cc.glBlendFunc(locBlendFunc.src, additive ? cc.ONE : locBlendFunc.dst);
            } else if (regionTextureAtlas != textureAtlas && textureAtlas) {
                textureAtlas.drawQuads();
                textureAtlas.removeAllQuads();
            }
            textureAtlas = regionTextureAtlas;
            var quadCount = textureAtlas.getTotalQuads();
            if (textureAtlas.getCapacity() == quadCount) {
                textureAtlas.drawQuads();
                textureAtlas.removeAllQuads();
                if (!textureAtlas.resizeCapacity(textureAtlas.getCapacity() * 2))
                    return;
            }
            sp._regionAttachment_updateQuad(attachment, slot, quad, node._premultipliedAlpha);
            textureAtlas.updateQuad(quad, quadCount);
        }
        if (textureAtlas) {
            textureAtlas.drawQuads();
            textureAtlas.removeAllQuads();
        }
        if (node._debugBones || node._debugSlots) {
            cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
            cc.current_stack.stack.push(cc.current_stack.top);
            cc.current_stack.top = this._stackMatrix;
            var drawingUtil = cc._drawingUtil;
            if (node._debugSlots) {
                drawingUtil.setDrawColor(0, 0, 255, 255);
                drawingUtil.setLineWidth(1);
                for (i = 0, n = locSkeleton.slots.length; i < n; i++) {
                    slot = locSkeleton.drawOrder[i];
                    if (!slot.attachment || slot.attachment.type != sp.ATTACHMENT_TYPE.REGION)
                        continue;
                    attachment = slot.attachment;
                    quad = new cc.V3F_C4B_T2F_Quad();
                    sp._regionAttachment_updateQuad(attachment, slot, quad);
                    var points = [];
                    points.push(cc.p(quad.bl.vertices.x, quad.bl.vertices.y));
                    points.push(cc.p(quad.br.vertices.x, quad.br.vertices.y));
                    points.push(cc.p(quad.tr.vertices.x, quad.tr.vertices.y));
                    points.push(cc.p(quad.tl.vertices.x, quad.tl.vertices.y));
                    drawingUtil.drawPoly(points, 4, true);
                }
            }
            if (node._debugBones) {
                var bone;
                drawingUtil.setLineWidth(2);
                drawingUtil.setDrawColor(255, 0, 0, 255);
                for (i = 0, n = locSkeleton.bones.length; i < n; i++) {
                    bone = locSkeleton.bones[i];
                    var x = bone.data.length * bone.m00 + bone.worldX;
                    var y = bone.data.length * bone.m10 + bone.worldY;
                    drawingUtil.drawLine(cc.p(bone.worldX, bone.worldY), cc.p(x, y));
                }
                drawingUtil.setPointSize(4);
                drawingUtil.setDrawColor(0, 0, 255, 255);
                for (i = 0, n = locSkeleton.bones.length; i < n; i++) {
                    bone = locSkeleton.bones[i];
                    drawingUtil.drawPoint(cc.p(bone.worldX, bone.worldY));
                    if (i == 0) {
                        drawingUtil.setDrawColor(0, 255, 0, 255);
                    }
                }
            }
            cc.kmGLPopMatrix();
        }
    };
    proto._createChildFormSkeletonData = function(){};
    proto._updateChild = function(){};
})();
