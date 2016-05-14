(function(){
    cc.ParticleBatchNode.WebGLRenderCmd = function(renderable){
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
    };
    var proto = cc.ParticleBatchNode.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.ParticleBatchNode.WebGLRenderCmd;
    proto.rendering = function (ctx) {
        var _t = this._node;
        if (_t.textureAtlas.totalQuads === 0)
            return;
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
        cc.glBlendFuncForParticle(_t._blendFunc.src, _t._blendFunc.dst);
        _t.textureAtlas.drawQuads();
    };
    proto._initWithTexture = function(){
        this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
    };
    proto.visit = function(parentCmd){
        var node = this._node;
        if (!node._visible)
            return;
        var currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        this._syncStatus(parentCmd);
        currentStack.top = this._stackMatrix;
        cc.renderer.pushRenderCommand(this);
        this._dirtyFlag = 0;
        cc.kmGLPopMatrix();
    };
})();
(function(){
    cc.ParticleSystem.WebGLRenderCmd = function(renderable){
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
        this._buffersVBO = [0, 0];
        this._quads = [];
        this._indices = [];
        this._quadsArrayBuffer = null;
    };
    var proto = cc.ParticleSystem.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.ParticleSystem.WebGLRenderCmd;
    proto.getDrawMode = function(){};
    proto.setDrawMode = function(drawMode){};
    proto.getShapeType = function(){};
    proto.setShapeType = function(shapeType){};
    proto.setBatchNode = function(batchNode){
        var node = this._node;
        if (node._batchNode !== batchNode) {
            var oldBatch = node._batchNode;
            node._batchNode = batchNode;
            if (batchNode) {
                var locParticles = node._particles;
                for (var i = 0; i < node._totalParticles; i++)
                    locParticles[i].atlasIndex = i;
            }
            if (!batchNode) {
                this._allocMemory();
                this.initIndices(node._totalParticles);
                node.setTexture(oldBatch.getTexture());
                this._setupVBO();
            } else if (!oldBatch) {
                node._batchNode.textureAtlas._copyQuadsToTextureAtlas(this._quads, node.atlasIndex);
                cc._renderContext.deleteBuffer(this._buffersVBO[1]);
            }
        }
    };
    proto.initIndices = function (totalParticles) {
        var locIndices = this._indices;
        for (var i = 0, len = totalParticles; i < len; ++i) {
            var i6 = i * 6;
            var i4 = i * 4;
            locIndices[i6 + 0] = i4 + 0;
            locIndices[i6 + 1] = i4 + 1;
            locIndices[i6 + 2] = i4 + 2;
            locIndices[i6 + 5] = i4 + 1;
            locIndices[i6 + 4] = i4 + 2;
            locIndices[i6 + 3] = i4 + 3;
        }
    };
    proto.isDifferentTexture = function(texture1, texture2){
         return (texture1 === texture2);
    };
    proto.updateParticlePosition = function(particle, position){
        this.updateQuadWithParticle(particle, position);
    };
    proto.updateQuadWithParticle = function (particle, newPosition) {
        var quad = null, node = this._node;
        if (node._batchNode) {
            var batchQuads = node._batchNode.textureAtlas.quads;
            quad = batchQuads[node.atlasIndex + particle.atlasIndex];
            node._batchNode.textureAtlas.dirty = true;
        } else
            quad = this._quads[node._particleIdx];
        var r, g, b, a;
        if (node._opacityModifyRGB) {
            r = 0 | (particle.color.r * particle.color.a/255);
            g = 0 | (particle.color.g * particle.color.a/255);
            b = 0 | (particle.color.b * particle.color.a/255);
        } else {
            r = 0 | (particle.color.r );
            g = 0 | (particle.color.g );
            b = 0 | (particle.color.b );
        }
        a = 0 | (particle.color.a );
        var blColors = quad.bl.colors, brColors = quad.br.colors, tlColors = quad.tl.colors, trColors = quad.tr.colors;
        blColors.r = brColors.r = tlColors.r = trColors.r = r;
        blColors.g = brColors.g = tlColors.g = trColors.g = g;
        blColors.b = brColors.b = tlColors.b = trColors.b = b;
        blColors.a = brColors.a = tlColors.a = trColors.a = a;
        var size_2 = particle.size / 2;
        if (particle.rotation) {
            var x1 = -size_2, y1 = -size_2;
            var x2 = size_2, y2 = size_2;
            var x = newPosition.x, y = newPosition.y;
            var rad = -cc.degreesToRadians(particle.rotation);
            var cr = Math.cos(rad), sr = Math.sin(rad);
            var ax = x1 * cr - y1 * sr + x;
            var ay = x1 * sr + y1 * cr + y;
            var bx = x2 * cr - y1 * sr + x;
            var by = x2 * sr + y1 * cr + y;
            var cx = x2 * cr - y2 * sr + x;
            var cy = x2 * sr + y2 * cr + y;
            var dx = x1 * cr - y2 * sr + x;
            var dy = x1 * sr + y2 * cr + y;
            quad.bl.vertices.x = ax;
            quad.bl.vertices.y = ay;
            quad.br.vertices.x = bx;
            quad.br.vertices.y = by;
            quad.tl.vertices.x = dx;
            quad.tl.vertices.y = dy;
            quad.tr.vertices.x = cx;
            quad.tr.vertices.y = cy;
        } else {
            quad.bl.vertices.x = newPosition.x - size_2;
            quad.bl.vertices.y = newPosition.y - size_2;
            quad.br.vertices.x = newPosition.x + size_2;
            quad.br.vertices.y = newPosition.y - size_2;
            quad.tl.vertices.x = newPosition.x - size_2;
            quad.tl.vertices.y = newPosition.y + size_2;
            quad.tr.vertices.x = newPosition.x + size_2;
            quad.tr.vertices.y = newPosition.y + size_2;
        }
    };
    proto.rendering = function (ctx) {
        var node = this._node;
        if (!node._texture)
            return;
        var gl = ctx || cc._renderContext;
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
        cc.glBindTexture2D(node._texture);
        cc.glBlendFuncForParticle(node._blendFunc.src, node._blendFunc.dst);
        gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_COLOR);
        gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_TEX_COORDS);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffersVBO[0]);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 24, 16);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffersVBO[1]);
        gl.drawElements(gl.TRIANGLES, node._particleIdx * 6, gl.UNSIGNED_SHORT, 0);
    };
    proto.initTexCoordsWithRect = function(pointRect){
        var node = this._node;
        var texture = node.texture;
        var scaleFactor = cc.contentScaleFactor();
        var rect = cc.rect(
                pointRect.x * scaleFactor,
                pointRect.y * scaleFactor,
                pointRect.width * scaleFactor,
                pointRect.height * scaleFactor);
        var wide = pointRect.width;
        var high = pointRect.height;
        if (texture) {
            wide = texture.pixelsWidth;
            high = texture.pixelsHeight;
        }
        var left, bottom, right, top;
        if (cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL) {
            left = (rect.x * 2 + 1) / (wide * 2);
            bottom = (rect.y * 2 + 1) / (high * 2);
            right = left + (rect.width * 2 - 2) / (wide * 2);
            top = bottom + (rect.height * 2 - 2) / (high * 2);
        } else {
            left = rect.x / wide;
            bottom = rect.y / high;
            right = left + rect.width / wide;
            top = bottom + rect.height / high;
        }
        var temp = top;
        top = bottom;
        bottom = temp;
        var quads;
        var start = 0, end = 0;
        if (node._batchNode) {
            quads = node._batchNode.textureAtlas.quads;
            start = node.atlasIndex;
            end = node.atlasIndex + node._totalParticles;
        } else {
            quads = this._quads;
            start = 0;
            end = node._totalParticles;
        }
        for (var i = start; i < end; i++) {
            if (!quads[i])
                quads[i] = cc.V3F_C4B_T2F_QuadZero();
            var selQuad = quads[i];
            selQuad.bl.texCoords.u = left;
            selQuad.bl.texCoords.v = bottom;
            selQuad.br.texCoords.u = right;
            selQuad.br.texCoords.v = bottom;
            selQuad.tl.texCoords.u = left;
            selQuad.tl.texCoords.v = top;
            selQuad.tr.texCoords.u = right;
            selQuad.tr.texCoords.v = top;
        }
    };
    proto.setTotalParticles = function(tp){
        var node = this._node;
        if (tp > node._allocatedParticles) {
            var quadSize = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
            this._indices = new Uint16Array(tp * 6);
            var locQuadsArrayBuffer = new ArrayBuffer(tp * quadSize);
            var locParticles = node._particles;
            locParticles.length = 0;
            var locQuads = this._quads;
            locQuads.length = 0;
            for (var j = 0; j < tp; j++) {
                locParticles[j] = new cc.Particle();
                locQuads[j] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, locQuadsArrayBuffer, j * quadSize);
            }
            node._allocatedParticles = tp;
            node._totalParticles = tp;
            if (node._batchNode) {
                for (var i = 0; i < tp; i++)
                    locParticles[i].atlasIndex = i;
            }
            this._quadsArrayBuffer = locQuadsArrayBuffer;
            this.initIndices(tp);
            this._setupVBO();
            if(node._texture){
                this.initTexCoordsWithRect(cc.rect(0, 0, node._texture.width, node._texture.height));
            }
        } else
            node._totalParticles = tp;
        node.resetSystem();
    };
    proto.addParticle = function(){
        var node = this._node,
            particles = node._particles;
        return particles[node.particleCount];
    };
    proto._setupVBO = function(){
        var node = this;
        var gl = cc._renderContext;
        this._buffersVBO[0] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffersVBO[0]);
        gl.bufferData(gl.ARRAY_BUFFER, this._quadsArrayBuffer, gl.DYNAMIC_DRAW);
        this._buffersVBO[1] = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffersVBO[1]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indices, gl.STATIC_DRAW);
    };
    proto._allocMemory = function(){
        var node  = this._node;
        if(node._batchNode){
            cc.log("cc.ParticleSystem._allocMemory(): Memory should not be allocated when not using batchNode");
            return false;
        }
        var quadSize = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
        var totalParticles = node._totalParticles;
        var locQuads = this._quads;
        locQuads.length = 0;
        this._indices = new Uint16Array(totalParticles * 6);
        var locQuadsArrayBuffer = new ArrayBuffer(quadSize * totalParticles);
        for (var i = 0; i < totalParticles; i++)
            locQuads[i] = new cc.V3F_C4B_T2F_Quad(null, null, null, null, locQuadsArrayBuffer, i * quadSize);
        if (!locQuads || !this._indices) {
            cc.log("cocos2d: Particle system: not enough memory");
            return false;
        }
        this._quadsArrayBuffer = locQuadsArrayBuffer;
        return true;
    };
    proto.postStep = function(){
        var gl = cc._renderContext;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffersVBO[0]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._quadsArrayBuffer);
    };
    proto._setBlendAdditive = function(){
        var locBlendFunc = this._node._blendFunc;
        if (this._texture && !this._texture.hasPremultipliedAlpha()) {
            locBlendFunc.src = cc.SRC_ALPHA;
            locBlendFunc.dst = cc.ONE_MINUS_SRC_ALPHA;
        } else {
            locBlendFunc.src = cc.BLEND_SRC;
            locBlendFunc.dst = cc.BLEND_DST;
        }
    };
    proto._initWithTotalParticles = function(totalParticles){
        if (!this._allocMemory())
            return false;
        this.initIndices(totalParticles);
        this._setupVBO();
        this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
    };
    proto._updateDeltaColor = function (selParticle, dt) {
        selParticle.color.r += selParticle.deltaColor.r * dt;
        selParticle.color.g += selParticle.deltaColor.g * dt;
        selParticle.color.b += selParticle.deltaColor.b * dt;
        selParticle.color.a += selParticle.deltaColor.a * dt;
        selParticle.isChangeColor = true;
    };
})();
