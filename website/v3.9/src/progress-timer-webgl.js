(function(){
    cc.ProgressTimer.WebGLRenderCmd = function(renderableObject){
        cc.Node.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._vertexWebGLBuffer = cc._renderContext.createBuffer();
        this._vertexDataCount = 0;
        this._vertexData = null;
        this._vertexArrayBuffer = null;
        this._vertexDataDirty = false;
    };
    var proto = cc.ProgressTimer.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.ProgressTimer.WebGLRenderCmd;
    proto.rendering = function (ctx) {
        var node = this._node;
        var context = ctx || cc._renderContext;
        if (!this._vertexData || !node._sprite)
            return;
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
        var blendFunc = node._sprite._blendFunc;
        cc.glBlendFunc(blendFunc.src, blendFunc.dst);
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX);
        cc.glBindTexture2D(node._sprite.texture);
        context.bindBuffer(context.ARRAY_BUFFER, this._vertexWebGLBuffer);
        if (this._vertexDataDirty) {
            context.bufferData(context.ARRAY_BUFFER, this._vertexArrayBuffer, context.DYNAMIC_DRAW);
            this._vertexDataDirty = false;
        }
        var locVertexDataLen = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, context.FLOAT, false, locVertexDataLen, 0);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, context.UNSIGNED_BYTE, true, locVertexDataLen, 8);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, context.FLOAT, false, locVertexDataLen, 12);
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
        this.transform(parentCmd);
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
    };
    proto.releaseData = function(){
        if (this._vertexData) {
            this._vertexData = null;
            this._vertexArrayBuffer = null;
            this._vertexDataCount = 0;
        }
    };
    proto.initCmd = function(){
        this._vertexData = null;
        this._vertexArrayBuffer = null;
        this._vertexDataCount = 0;
        this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
    };
    proto._updateProgress = function(){
        var node = this._node;
        var locType = node._type;
        if(locType === cc.ProgressTimer.TYPE_RADIAL)
            this._updateRadial();
        else if(locType === cc.ProgressTimer.TYPE_BAR)
            this._updateBar();
        this._vertexDataDirty = true;
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
            if (!this._vertexData) {
                this._vertexDataCount = 4;
                var vertexDataLen = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT, locCount = 4;
                this._vertexArrayBuffer = new ArrayBuffer(locCount * vertexDataLen);
                this._vertexData = [];
                for (i = 0; i < locCount; i++)
                    this._vertexData[i] = new cc.V2F_C4B_T2F(null, null, null, this._vertexArrayBuffer, i * vertexDataLen);
            }
            locVertexData = this._vertexData;
            locVertexData[0].texCoords = this._textureCoordFromAlphaPoint(cc.p(min.x, max.y));
            locVertexData[0].vertices = this._vertexFromAlphaPoint(cc.p(min.x, max.y));
            locVertexData[1].texCoords = this._textureCoordFromAlphaPoint(cc.p(min.x, min.y));
            locVertexData[1].vertices = this._vertexFromAlphaPoint(cc.p(min.x, min.y));
            locVertexData[2].texCoords = this._textureCoordFromAlphaPoint(cc.p(max.x, max.y));
            locVertexData[2].vertices = this._vertexFromAlphaPoint(cc.p(max.x, max.y));
            locVertexData[3].texCoords = this._textureCoordFromAlphaPoint(cc.p(max.x, min.y));
            locVertexData[3].vertices = this._vertexFromAlphaPoint(cc.p(max.x, min.y));
        } else {
            if (!this._vertexData) {
                this._vertexDataCount = 8;
                var rVertexDataLen = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT, rLocCount = 8;
                this._vertexArrayBuffer = new ArrayBuffer(rLocCount * rVertexDataLen);
                var rTempData = [];
                for (i = 0; i < rLocCount; i++)
                    rTempData[i] = new cc.V2F_C4B_T2F(null, null, null, this._vertexArrayBuffer, i * rVertexDataLen);
                rTempData[0].texCoords = this._textureCoordFromAlphaPoint(cc.p(0, 1));
                rTempData[0].vertices = this._vertexFromAlphaPoint(cc.p(0, 1));
                rTempData[1].texCoords = this._textureCoordFromAlphaPoint(cc.p(0, 0));
                rTempData[1].vertices = this._vertexFromAlphaPoint(cc.p(0, 0));
                rTempData[6].texCoords = this._textureCoordFromAlphaPoint(cc.p(1, 1));
                rTempData[6].vertices = this._vertexFromAlphaPoint(cc.p(1, 1));
                rTempData[7].texCoords = this._textureCoordFromAlphaPoint(cc.p(1, 0));
                rTempData[7].vertices = this._vertexFromAlphaPoint(cc.p(1, 0));
                this._vertexData = rTempData;
            }
            locVertexData = this._vertexData;
            locVertexData[2].texCoords = this._textureCoordFromAlphaPoint(cc.p(min.x, max.y));
            locVertexData[2].vertices = this._vertexFromAlphaPoint(cc.p(min.x, max.y));
            locVertexData[3].texCoords = this._textureCoordFromAlphaPoint(cc.p(min.x, min.y));
            locVertexData[3].vertices = this._vertexFromAlphaPoint(cc.p(min.x, min.y));
            locVertexData[4].texCoords = this._textureCoordFromAlphaPoint(cc.p(max.x, max.y));
            locVertexData[4].vertices = this._vertexFromAlphaPoint(cc.p(max.x, max.y));
            locVertexData[5].texCoords = this._textureCoordFromAlphaPoint(cc.p(max.x, min.y));
            locVertexData[5].vertices = this._vertexFromAlphaPoint(cc.p(max.x, min.y));
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
            this._vertexData = null;
            this._vertexArrayBuffer = null;
            this._vertexDataCount = 0;
        }
        if (!this._vertexData) {
            this._vertexDataCount = index + 3;
            var locCount = this._vertexDataCount, vertexDataLen = cc.V2F_C4B_T2F.BYTES_PER_ELEMENT;
            this._vertexArrayBuffer = new ArrayBuffer(locCount * vertexDataLen);
            var locData = [];
            for (i = 0; i < locCount; i++)
                locData[i] = new cc.V2F_C4B_T2F(null, null, null, this._vertexArrayBuffer, i * vertexDataLen);
            this._vertexData = locData;
            if(!this._vertexData){
                cc.log( "cc.ProgressTimer._updateRadial() : Not enough memory");
                return;
            }
        }
        this._updateColor();
        var locVertexData = this._vertexData;
        if (!sameIndexCount) {
            locVertexData[0].texCoords = this._textureCoordFromAlphaPoint(locMidPoint);
            locVertexData[0].vertices = this._vertexFromAlphaPoint(locMidPoint);
            locVertexData[1].texCoords = this._textureCoordFromAlphaPoint(topMid);
            locVertexData[1].vertices = this._vertexFromAlphaPoint(topMid);
            for (i = 0; i < index; i++) {
                var alphaPoint = this._boundaryTexCoord(i);
                locVertexData[i + 2].texCoords = this._textureCoordFromAlphaPoint(alphaPoint);
                locVertexData[i + 2].vertices = this._vertexFromAlphaPoint(alphaPoint);
            }
        }
        locVertexData[this._vertexDataCount - 1].texCoords = this._textureCoordFromAlphaPoint(hit);
        locVertexData[this._vertexDataCount - 1].vertices = this._vertexFromAlphaPoint(hit);
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
    proto._textureCoordFromAlphaPoint = function (alpha) {
        var locSprite = this._node._sprite;
        if (!locSprite) {
            return {u:0, v:0};
        }
        var quad = locSprite.quad;
        var min = cc.p(quad.bl.texCoords.u, quad.bl.texCoords.v);
        var max = cc.p(quad.tr.texCoords.u, quad.tr.texCoords.v);
        if (locSprite.textureRectRotated) {
            var temp = alpha.x;
            alpha.x = alpha.y;
            alpha.y = temp;
        }
        return {u: min.x * (1 - alpha.x) + max.x * alpha.x, v: min.y * (1 - alpha.y) + max.y * alpha.y};
    };
    proto._vertexFromAlphaPoint = function (alpha) {
        var locSprite = this._node._sprite;
        if (!locSprite) {
            return {x: 0, y: 0};
        }
        var quad = locSprite.quad;
        var min = cc.p(quad.bl.vertices.x, quad.bl.vertices.y);
        var max = cc.p(quad.tr.vertices.x, quad.tr.vertices.y);
        return {x: min.x * (1 - alpha.x) + max.x * alpha.x, y: min.y * (1 - alpha.y) + max.y * alpha.y};
    };
    proto._updateColor = function(){
        var node = this._node;
        if (!node._sprite || !this._vertexData)
            return;
        var sc = node._sprite.quad.tl.colors;
        var locVertexData = this._vertexData;
        for (var i = 0, len = this._vertexDataCount; i < len; ++i)
            locVertexData[i].colors = sc;
        this._vertexDataDirty = true;
    };
})();
