(function(){
    var MAX_VERTEX_COUNT = 8;
    cc.ProgressTimer.WebGLRenderCmd = function(renderableObject){
        cc.Node.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._progressDirty = true;
        this.initCmd();
    };
    var proto = cc.ProgressTimer.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.ProgressTimer.WebGLRenderCmd;
    proto.transform = function (parentCmd, recursive) {
        cc.Node.WebGLRenderCmd.prototype.transform.call(this, parentCmd, recursive);
        this._node._sprite._renderCmd.transform(this, recursive);
    };
    proto.rendering = function (ctx) {
        var node = this._node;
        var context = ctx || cc._renderContext;
        if (this._vertexDataCount === 0 || !node._sprite)
            return;
        this._shaderProgram.use();
        this._shaderProgram._updateProjectionUniform();
        var blendFunc = node._sprite._blendFunc;
        cc.glBlendFunc(blendFunc.src, blendFunc.dst);
        cc.glBindTexture2D(node._sprite.texture);
        context.bindBuffer(context.ARRAY_BUFFER, this._vertexWebGLBuffer);
        context.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        context.enableVertexAttribArray(cc.VERTEX_ATTRIB_COLOR);
        context.enableVertexAttribArray(cc.VERTEX_ATTRIB_TEX_COORDS);
        if (this._vertexDataDirty) {
            context.bufferSubData(context.ARRAY_BUFFER, 0, this._float32View);
            this._vertexDataDirty = false;
        }
        var locVertexDataLen = cc.V3F_C4B_T2F.BYTES_PER_ELEMENT;
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, context.FLOAT, false, locVertexDataLen, 0);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, context.UNSIGNED_BYTE, true, locVertexDataLen, 12);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, context.FLOAT, false, locVertexDataLen, 16);
        if (node._type === cc.ProgressTimer.TYPE_RADIAL)
            context.drawArrays(context.TRIANGLE_FAN, 0, this._vertexDataCount);
        else if (node._type === cc.ProgressTimer.TYPE_BAR) {
            if (!node._reverseDirection)
                context.drawArrays(context.TRIANGLE_STRIP, 0, this._vertexDataCount);
            else {
                context.drawArrays(context.TRIANGLE_STRIP, 0, this._vertexDataCount / 2);
                context.drawArrays(context.TRIANGLE_STRIP, 4, this._vertexDataCount / 2);
                cc.g_NumberOfDraws++;
            }
        }
        cc.g_NumberOfDraws++;
    };
    proto._syncStatus = function (parentCmd) {
        var node = this._node;
        if(!node._sprite)
            return;
        var flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        var parentNode = parentCmd ? parentCmd._node : null;
        if(parentNode && parentNode._cascadeColorEnabled && (parentCmd._dirtyFlag & flags.colorDirty))
            locFlag |= flags.colorDirty;
        if(parentNode && parentNode._cascadeOpacityEnabled && (parentCmd._dirtyFlag & flags.opacityDirty))
            locFlag |= flags.opacityDirty;
        if(parentCmd && (parentCmd._dirtyFlag & flags.transformDirty))
            locFlag |= flags.transformDirty;
        this._dirtyFlag = locFlag;
        var spriteCmd = node._sprite._renderCmd;
        var spriteFlag = spriteCmd._dirtyFlag;
        var colorDirty = spriteFlag & flags.colorDirty,
            opacityDirty = spriteFlag & flags.opacityDirty;
        if (colorDirty){
            spriteCmd._syncDisplayColor();
        }
        if (opacityDirty){
            spriteCmd._syncDisplayOpacity();
        }
        if(colorDirty || opacityDirty){
            spriteCmd._updateColor();
            this._updateColor();
        }
        if (locFlag & flags.transformDirty) {
            this.transform(parentCmd);
        }
        if (locFlag & flags.textureDirty) {
            this._updateProgressData();
            this._dirtyFlag = this._dirtyFlag & flags.textureDirty ^ this._dirtyFlag;
        }
        spriteCmd._dirtyFlag = 0;
    };
    proto.updateStatus = function () {
        var node = this._node;
        if(!node._sprite)
            return;
        var flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        var spriteCmd = node._sprite._renderCmd;
        var spriteFlag = spriteCmd._dirtyFlag;
        var colorDirty = spriteFlag & flags.colorDirty,
            opacityDirty = spriteFlag & flags.opacityDirty;
        if(colorDirty){
            spriteCmd._updateDisplayColor();
            this._dirtyFlag = this._dirtyFlag & flags.colorDirty ^ this._dirtyFlag;
        }
        if(opacityDirty){
            spriteCmd._updateDisplayOpacity();
            this._dirtyFlag = this._dirtyFlag & flags.opacityDirty ^ this._dirtyFlag;
        }
        if(colorDirty || opacityDirty){
            spriteCmd._updateColor();
            this._updateColor();
        }
        if(locFlag & flags.transformDirty){
            this.transform(this.getParentRenderCmd(), true);
        }
        if (locFlag & flags.orderDirty) {
            this._dirtyFlag = this._dirtyFlag & flags.orderDirty ^ this._dirtyFlag;
        }
        if (locFlag & flags.textureDirty) {
            this._updateProgressData();
            this._dirtyFlag = this._dirtyFlag & flags.textureDirty ^ this._dirtyFlag;
        }
    };
    proto.releaseData = function(){
        if (this._vertexData) {
            var webglBuffer = this._vertexWebGLBuffer;
            setTimeout(function () {
                cc._renderContext.deleteBuffer(webglBuffer);
            }, 0.1);
            this._vertexWebGLBuffer = null;
            this._vertexData = null;
            this._float32View = null;
            this._vertexArrayBuffer = null;
            this._vertexDataCount = 0;
        }
    };
    proto.initCmd = function () {
        if (!this._vertexData) {
            this._vertexWebGLBuffer = cc._renderContext.createBuffer();
            var vertexDataLen = cc.V3F_C4B_T2F.BYTES_PER_ELEMENT;
            this._vertexArrayBuffer = new ArrayBuffer(MAX_VERTEX_COUNT * vertexDataLen);
            this._float32View = new Float32Array(this._vertexArrayBuffer);
            this._vertexData = [];
            for (i = 0; i < MAX_VERTEX_COUNT; i++) {
                this._vertexData[i] = new cc.V3F_C4B_T2F(null, null, null, this._vertexArrayBuffer, i * vertexDataLen);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexWebGLBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this._float32View, gl.DYNAMIC_DRAW);
            this._vertexDataCount = 0;
            this._vertexDataDirty = true;
            this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_SPRITE_POSITION_TEXTURECOLOR);
        }
    };
    proto.resetVertexData = function () {
        this._vertexDataCount = 0;
    };
    proto._updateProgressData = function () {
        var node = this._node;
        var locType = node._type;
        if(locType === cc.ProgressTimer.TYPE_RADIAL)
            this._updateRadial();
        else if(locType === cc.ProgressTimer.TYPE_BAR)
            this._updateBar();
        this._vertexDataDirty = true;
    };
    proto._updateProgress = function () {
        this.setDirtyFlag(cc.Node._dirtyFlags.textureDirty);
    };
    proto._updateBar = function(){
        var node = this._node;
        if (!node._sprite)
            return;
        var i, alpha = node._percentage / 100.0;
        var locBarChangeRate = node._barChangeRate;
        var alphaOffset = cc.pMult(cc.p((1.0 - locBarChangeRate.x) + alpha * locBarChangeRate.x,
                (1.0 - locBarChangeRate.y) + alpha * locBarChangeRate.y), 0.5);
        var min = cc.pSub(node._midPoint, alphaOffset), max = cc.pAdd(node._midPoint, alphaOffset);
        if (min.x < 0) {
            max.x += -min.x;
            min.x = 0;
        }
        if (max.x > 1) {
            min.x -= max.x - 1;
            max.x = 1;
        }
        if (min.y < 0) {
            max.y += -min.y;
            min.y = 0;
        }
        if (max.y > 1) {
            min.y -= max.y - 1;
            max.y = 1;
        }
        var locVertexData;
        if (!this._reverseDirection) {
            if (!this._vertexDataCount) {
                this._vertexDataCount = 4;
            }
            locVertexData = this._vertexData;
            this._textureCoordFromAlphaPoint(locVertexData[0].texCoords, min.x, max.y);
            this._vertexFromAlphaPoint(locVertexData[0].vertices, min.x, max.y);
            this._textureCoordFromAlphaPoint(locVertexData[1].texCoords, min.x, min.y);
            this._vertexFromAlphaPoint(locVertexData[1].vertices, min.x, min.y);
            this._textureCoordFromAlphaPoint(locVertexData[2].texCoords, max.x, max.y);
            this._vertexFromAlphaPoint(locVertexData[2].vertices, max.x, max.y);
            this._textureCoordFromAlphaPoint(locVertexData[3].texCoords, max.x, min.y);
            this._vertexFromAlphaPoint(locVertexData[3].vertices, max.x, min.y);
        } else {
            locVertexData = this._vertexData;
            if (!this._vertexDataCount) {
                this._vertexDataCount = 8;
                this._textureCoordFromAlphaPoint(locVertexData[0].texCoords, 0, 1);
                this._vertexFromAlphaPoint(locVertexData[0].vertices, 0, 1);
                this._textureCoordFromAlphaPoint(locVertexData[1].texCoords, 0, 0);
                this._vertexFromAlphaPoint(locVertexData[1].vertices, 0, 0);
                this._textureCoordFromAlphaPoint(locVertexData[6].texCoords, 1, 1);
                this._vertexFromAlphaPoint(locVertexData[6].vertices, 1, 1);
                this._textureCoordFromAlphaPoint(locVertexData[7].texCoords, 1, 0);
                this._vertexFromAlphaPoint(locVertexData[7].vertices, 1, 0);
            }
            this._textureCoordFromAlphaPoint(locVertexData[2].texCoords, min.x, max.y);
            this._vertexFromAlphaPoint(locVertexData[2].vertices, min.x, max.y);
            this._textureCoordFromAlphaPoint(locVertexData[3].texCoords, min.x, min.y);
            this._vertexFromAlphaPoint(locVertexData[3].vertices, min.x, min.y);
            this._textureCoordFromAlphaPoint(locVertexData[4].texCoords, max.x, max.y);
            this._vertexFromAlphaPoint(locVertexData[4].vertices, max.x, max.y);
            this._textureCoordFromAlphaPoint(locVertexData[5].texCoords, max.x, min.y);
            this._vertexFromAlphaPoint(locVertexData[5].vertices, max.x, min.y);
        }
        this._updateColor();
    };
    proto._updateRadial = function () {
        var node = this._node;
        if (!node._sprite)
            return;
        var i, locMidPoint = node._midPoint;
        var alpha = node._percentage / 100;
        var angle = 2 * (cc.PI) * ( node._reverseDirection ? alpha : 1.0 - alpha);
        var topMid = cc.p(locMidPoint.x, 1);
        var percentagePt = cc.pRotateByAngle(topMid, locMidPoint, angle);
        var index = 0;
        var hit;
        if (alpha === 0) {
            hit = topMid;
            index = 0;
        } else if (alpha === 1) {
            hit = topMid;
            index = 4;
        } else {
            var min_t = cc.FLT_MAX;
            var locProTextCoordsCount = cc.ProgressTimer.TEXTURE_COORDS_COUNT;
            for (i = 0; i <= locProTextCoordsCount; ++i) {
                var pIndex = (i + (locProTextCoordsCount - 1)) % locProTextCoordsCount;
                var edgePtA = this._boundaryTexCoord(i % locProTextCoordsCount);
                var edgePtB = this._boundaryTexCoord(pIndex);
                if (i === 0)
                    edgePtB = cc.pLerp(edgePtA, edgePtB, 1 - locMidPoint.x);
                else if (i === 4)
                    edgePtA = cc.pLerp(edgePtA, edgePtB, 1 - locMidPoint.x);
                var retPoint = cc.p(0, 0);
                if (cc.pLineIntersect(edgePtA, edgePtB, locMidPoint, percentagePt, retPoint)) {
                    if ((i === 0 || i === 4)) {
                        if (!(0 <= retPoint.x && retPoint.x <= 1))
                            continue;
                    }
                    if (retPoint.y >= 0) {
                        if (retPoint.y < min_t) {
                            min_t = retPoint.y;
                            index = i;
                        }
                    }
                }
            }
            hit = cc.pAdd(locMidPoint, cc.pMult(cc.pSub(percentagePt, locMidPoint), min_t));
        }
        var sameIndexCount = true;
        if (this._vertexDataCount !== index + 3) {
            sameIndexCount = false;
            this._vertexDataCount = index + 3;
        }
        this._updateColor();
        var locVertexData = this._vertexData;
        if (!sameIndexCount) {
            this._textureCoordFromAlphaPoint(locVertexData[0].texCoords, locMidPoint.x, locMidPoint.y);
            this._vertexFromAlphaPoint(locVertexData[0].vertices, locMidPoint.x, locMidPoint.y);
            this._textureCoordFromAlphaPoint(locVertexData[1].texCoords, topMid.x, topMid.y);
            this._vertexFromAlphaPoint(locVertexData[1].vertices, topMid.x, topMid.y);
            for (i = 0; i < index; i++) {
                var alphaPoint = this._boundaryTexCoord(i);
                this._textureCoordFromAlphaPoint(locVertexData[i + 2].texCoords, alphaPoint.x, alphaPoint.y);
                this._vertexFromAlphaPoint(locVertexData[i + 2].vertices, alphaPoint.x, alphaPoint.y);
            }
        }
        this._textureCoordFromAlphaPoint(locVertexData[this._vertexDataCount - 1].texCoords, hit.x, hit.y);
        this._vertexFromAlphaPoint(locVertexData[this._vertexDataCount - 1].vertices, hit.x, hit.y);
    };
    proto._boundaryTexCoord = function (index) {
        if (index < cc.ProgressTimer.TEXTURE_COORDS_COUNT) {
            var locProTextCoords = cc.ProgressTimer.TEXTURE_COORDS;
            if (this._node._reverseDirection)
                return cc.p((locProTextCoords >> (7 - (index << 1))) & 1, (locProTextCoords >> (7 - ((index << 1) + 1))) & 1);
            else
                return cc.p((locProTextCoords >> ((index << 1) + 1)) & 1, (locProTextCoords >> (index << 1)) & 1);
        }
        return cc.p(0,0);
    };
    proto._textureCoordFromAlphaPoint = function (coords, ax, ay) {
        var locSprite = this._node._sprite;
        if (!locSprite) {
            coords.u = 0;
            coords.v = 0;
            return;
        }
        var quad = locSprite.quad;
        var min = cc.p(quad.bl.texCoords.u, quad.bl.texCoords.v);
        var max = cc.p(quad.tr.texCoords.u, quad.tr.texCoords.v);
        if (locSprite.textureRectRotated) {
            var temp = alpha.x;
            alpha.x = alpha.y;
            alpha.y = temp;
        }
        coords.u = min.x * (1 - ax) + max.x * ax;
        coords.v = min.y * (1 - ay) + max.y * ay;
    };
    proto._vertexFromAlphaPoint = function (vertex, ax, ay) {
        var spriteCmd = this._node._sprite._renderCmd;
        if (!spriteCmd) {
            vertex.x = 0;
            vertex.y = 0;
            return;
        }
        var quad = spriteCmd._quad;
        var min = cc.p(quad.bl.vertices.x, quad.bl.vertices.y);
        var max = cc.p(quad.tr.vertices.x, quad.tr.vertices.y);
        vertex.x = min.x * (1 - ax) + max.x * ax;
        vertex.y = min.y * (1 - ay) + max.y * ay;
        vertex.z = quad.bl.vertices.z;
    };
    proto._updateColor = function(){
        var node = this._node;
        if (!node._sprite || !this._vertexDataCount)
            return;
        var sc = node._sprite.quad.tl.colors;
        var locVertexData = this._vertexData;
        for (var i = 0, len = this._vertexDataCount; i < len; ++i)
            locVertexData[i].colors = sc;
        this._vertexDataDirty = true;
    };
})();
