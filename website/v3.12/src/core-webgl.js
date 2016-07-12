cc.game.addEventListener(cc.game.EVENT_RENDERER_INITED, function () {
    if (cc._renderType !== cc.game.RENDER_TYPE_WEBGL) {
        return;
    }
    cc.DirectorDelegate = cc.Class.extend({
        updateProjection: function () {
        }
    });
    var _p = cc.Director.prototype;
    var recursiveChild = function(node){
        if(node && node._renderCmd){
            node._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
            var i, children = node._children;
            for(i=0; i<children.length; i++){
                recursiveChild(children[i]);
            }
        }
    };
    cc.eventManager.addCustomListener(cc.Director.EVENT_PROJECTION_CHANGED, function(){
        var director = cc.director;
        var stack = cc.director._scenesStack;
        for(var  i=0; i<stack.length; i++)
            recursiveChild(stack[i]);
    });
    _p.setProjection = function (projection) {
        var _t = this;
        var size = _t._winSizeInPoints;
        _t.setViewport();
        var view = _t._openGLView,
            ox = view._viewPortRect.x / view._scaleX,
            oy = view._viewPortRect.y / view._scaleY;
        switch (projection) {
            case cc.Director.PROJECTION_2D:
                cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
                cc.kmGLLoadIdentity();
                var orthoMatrix = cc.math.Matrix4.createOrthographicProjection(
                    0,
                    size.width,
                    0,
                    size.height,
                    -1024, 1024);
                cc.kmGLMultMatrix(orthoMatrix);
                cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
                cc.kmGLLoadIdentity();
                break;
            case cc.Director.PROJECTION_3D:
                var zeye = _t.getZEye();
                var matrixPerspective = new cc.math.Matrix4(), matrixLookup = new cc.math.Matrix4();
                cc.kmGLMatrixMode(cc.KM_GL_PROJECTION);
                cc.kmGLLoadIdentity();
                matrixPerspective = cc.math.Matrix4.createPerspectiveProjection(60, size.width / size.height, 0.1, zeye * 2);
                cc.kmGLMultMatrix(matrixPerspective);
                cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
                cc.kmGLLoadIdentity();
                var eye = new cc.math.Vec3(-ox + size.width / 2, -oy + size.height / 2, zeye);
                var center = new cc.math.Vec3( -ox + size.width / 2, -oy + size.height / 2, 0.0);
                var up = new cc.math.Vec3( 0.0, 1.0, 0.0);
                matrixLookup.lookAt(eye, center, up);
                cc.kmGLMultMatrix(matrixLookup);
                break;
            case cc.Director.PROJECTION_CUSTOM:
                if (_t._projectionDelegate)
                    _t._projectionDelegate.updateProjection();
                break;
            default:
                cc.log(cc._LogInfos.Director_setProjection);
                break;
        }
        _t._projection = projection;
        cc.eventManager.dispatchEvent(_t._eventProjectionChanged);
        cc.setProjectionMatrixDirty();
        cc.renderer.childrenOrderDirty = true;
    };
    _p.setDepthTest = function (on) {
        cc.renderer.setDepthTest(on);
    };
    _p.setClearColor = function (clearColor) {
        cc.renderer._clearColor = clearColor;
    };
    _p.setOpenGLView = function (openGLView) {
        var _t = this;
        _t._winSizeInPoints.width = cc._canvas.width;
        _t._winSizeInPoints.height = cc._canvas.height;
        _t._openGLView = openGLView || cc.view;
        var conf = cc.configuration;
        conf.gatherGPUInfo();
        conf.dumpInfo();
        _t.setGLDefaultValues();
        if (cc.eventManager)
            cc.eventManager.setEnabled(true);
    };
    _p._clear = function () {
        var gl = cc._renderContext;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
    _p.getVisibleSize = function () {
        return this._openGLView.getVisibleSize();
    };
    _p.getVisibleOrigin = function () {
        return this._openGLView.getVisibleOrigin();
    };
    _p.getZEye = function () {
        return (this._winSizeInPoints.height / 1.1566 );
    };
    _p.setViewport = function () {
        var view = this._openGLView;
        if (view) {
            var locWinSizeInPoints = this._winSizeInPoints;
            view.setViewPortInPoints(-view._viewPortRect.x/view._scaleX, -view._viewPortRect.y/view._scaleY, locWinSizeInPoints.width, locWinSizeInPoints.height);
        }
    };
    _p.getOpenGLView = function () {
        return this._openGLView;
    };
    _p.getProjection = function () {
        return this._projection;
    };
    _p.setAlphaBlending = function (on) {
        if (on)
            cc.glBlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        else
            cc.glBlendFunc(cc._renderContext.ONE, cc._renderContext.ZERO);
    };
    _p.setGLDefaultValues = function () {
        var _t = this;
        _t.setAlphaBlending(true);
        _t.setProjection(_t._projection);
        cc._renderContext.clearColor(0.0, 0.0, 0.0, 0.0);
    };
});
cc.configuration = {
	ERROR:0,
	STRING:1,
	INT:2,
	DOUBLE:3,
	BOOLEAN:4,
    _maxTextureSize:0,
    _maxModelviewStackDepth:0,
    _supportsPVRTC:false,
    _supportsNPOT:false,
    _supportsBGRA8888:false,
    _supportsDiscardFramebuffer:false,
    _supportsShareableVAO:false,
    _maxSamplesAllowed:0,
    _maxTextureUnits:0,
    _GlExtensions:"",
    _valueDict:{},
	_inited: false,
	_init:function () {
		var locValueDict = this._valueDict;
		locValueDict["cocos2d.x.version"] = cc.ENGINE_VERSION;
		locValueDict["cocos2d.x.compiled_with_profiler"] = false;
		locValueDict["cocos2d.x.compiled_with_gl_state_cache"] = cc.ENABLE_GL_STATE_CACHE;
		this._inited = true;
	},
    getMaxTextureSize:function () {
        return this._maxTextureSize;
    },
    getMaxModelviewStackDepth:function () {
        return this._maxModelviewStackDepth;
    },
    getMaxTextureUnits:function () {
        return this._maxTextureUnits;
    },
    supportsNPOT:function () {
        return this._supportsNPOT;
    },
    supportsPVRTC: function () {
        return this._supportsPVRTC;
    },
	supportsETC: function() {
		return false;
	},
	supportsS3TC: function() {
		return false;
	},
	supportsATITC: function() {
		return false;
	},
    supportsBGRA8888:function () {
        return this._supportsBGRA8888;
    },
    supportsDiscardFramebuffer:function () {
        return this._supportsDiscardFramebuffer;
    },
    supportsShareableVAO:function () {
        return this._supportsShareableVAO;
    },
    checkForGLExtension:function (searchName) {
        return this._GlExtensions.indexOf(searchName) > -1;
    },
    getValue: function(key, default_value){
	    if(!this._inited)
		    this._init();
        var locValueDict = this._valueDict;
        if(locValueDict[key])
            return locValueDict[key];
        return default_value;
    },
    setValue: function(key, value){
        this._valueDict[key] = value;
    },
    dumpInfo: function(){
         if(cc.ENABLE_GL_STATE_CACHE === 0){
             cc.log("");
             cc.log(cc._LogInfos.configuration_dumpInfo);
             cc.log("")
         }
    },
    gatherGPUInfo: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return;
	    if(!this._inited)
		    this._init();
        var gl = cc._renderContext;
        var locValueDict = this._valueDict;
        locValueDict["gl.vendor"] = gl.getParameter(gl.VENDOR);
        locValueDict["gl.renderer"] = gl.getParameter(gl.RENDERER);
        locValueDict["gl.version"] = gl.getParameter(gl.VERSION);
        this._GlExtensions = "";
        var extArr = gl.getSupportedExtensions();
        for (var i = 0; i < extArr.length; i++)
            this._GlExtensions += extArr[i] + " ";
        this._maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        locValueDict["gl.max_texture_size"] = this._maxTextureSize;
        this._maxTextureUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        locValueDict["gl.max_texture_units"] = this._maxTextureUnits;
        this._supportsPVRTC = this.checkForGLExtension("GL_IMG_texture_compression_pvrtc");
        locValueDict["gl.supports_PVRTC"] = this._supportsPVRTC;
        this._supportsNPOT = false;
        locValueDict["gl.supports_NPOT"] = this._supportsNPOT;
        this._supportsBGRA8888 = this.checkForGLExtension("GL_IMG_texture_format_BGRA888");
        locValueDict["gl.supports_BGRA8888"] = this._supportsBGRA8888;
        this._supportsDiscardFramebuffer = this.checkForGLExtension("GL_EXT_discard_framebuffer");
        locValueDict["gl.supports_discard_framebuffer"] = this._supportsDiscardFramebuffer;
        this._supportsShareableVAO = this.checkForGLExtension("vertex_array_object");
        locValueDict["gl.supports_vertex_array_object"] = this._supportsShareableVAO;
        cc.checkGLErrorDebug();
    },
    loadConfigFile: function( url){
	    if(!this._inited)
		    this._init();
        var dict = cc.loader.getRes(url);
        if(!dict) throw new Error("Please load the resource first : " + url);
        cc.assert(dict, cc._LogInfos.configuration_loadConfigFile_2, url);
        var getDatas = dict["data"];
        if(!getDatas){
            cc.log(cc._LogInfos.configuration_loadConfigFile, url);
            return;
        }
        for(var selKey in getDatas)
            this._valueDict[selKey] = getDatas[selKey];
    }
};
cc.rendererWebGL = (function () {
var _batchedInfo = {
        texture: null,
        blendSrc: null,
        blendDst: null,
        shader: null
    },
    _quadIndexBuffer = null,
    _quadVertexBuffer = null,
    _vertexSize = 0,
    _batchingSize = 0,
    _sizePerVertex = 6,
    _vertexData = null,
    _vertexDataSize = 0,
    _vertexDataF32 = null,
    _vertexDataUI32 = null,
    _IS_IOS = false;
function updateQuadBuffer (numQuads) {
    var gl = cc._renderContext;
    if (_quadIndexBuffer) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _quadIndexBuffer);
        var indices = new Uint16Array(numQuads * 6);
        var currentQuad = 0;
        for (var i = 0, len = numQuads * 6; i < len; i += 6) {
            indices[i] = currentQuad + 0;
            indices[i + 1] = currentQuad + 1;
            indices[i + 2] = currentQuad + 2;
            indices[i + 3] = currentQuad + 1;
            indices[i + 4] = currentQuad + 2;
            indices[i + 5] = currentQuad + 3;
            currentQuad += 4;
        }
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }
    if (_quadVertexBuffer) {
        _vertexDataSize = numQuads * 4 * _sizePerVertex;
        var byteLength = _vertexDataSize * 4;
        _vertexData = new ArrayBuffer(byteLength);
        _vertexDataF32 = new Float32Array(_vertexData);
        _vertexDataUI32 = new Uint32Array(_vertexData);
        gl.bindBuffer(gl.ARRAY_BUFFER, _quadVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, _vertexDataF32, gl.DYNAMIC_DRAW);
    }
    _vertexSize = numQuads * 4;
}
function initQuadBuffer (numQuads) {
    var gl = cc._renderContext;
    if (_quadIndexBuffer === null) {
        _quadVertexBuffer = gl.createBuffer();
        _quadIndexBuffer = gl.createBuffer();
        updateQuadBuffer(numQuads);
    }
    else {
        updateQuadBuffer(numQuads);
    }
}
return {
    mat4Identity: null,
    childrenOrderDirty: true,
    assignedZ: 0,
    assignedZStep: 1/100,
    _transformNodePool: [],
    _renderCmds: [],
    _isCacheToBufferOn: false,
    _cacheToBufferCmds: {},
    _cacheInstanceIds: [],
    _currentID: 0,
    _clearColor: cc.color(),
    init: function () {
        var gl = cc._renderContext;
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
        this.mat4Identity = new cc.math.Matrix4();
        this.mat4Identity.identity();
        initQuadBuffer(2000);
        if (cc.sys.os === cc.sys.OS_IOS) {
            _IS_IOS = true;
        }
    },
    getVertexSize: function () {
        return _vertexSize;
    },
    getRenderCmd: function (renderableObject) {
        return renderableObject._createRenderCmd();
    },
    _turnToCacheMode: function (renderTextureID) {
        this._isCacheToBufferOn = true;
        renderTextureID = renderTextureID || 0;
        if (!this._cacheToBufferCmds[renderTextureID]) {
            this._cacheToBufferCmds[renderTextureID] = [];
        }
        else {
            this._cacheToBufferCmds[renderTextureID].length = 0;
        }
        if (this._cacheInstanceIds.indexOf(renderTextureID) === -1) {
            this._cacheInstanceIds.push(renderTextureID);
        }
        this._currentID = renderTextureID;
    },
    _turnToNormalMode: function () {
        this._isCacheToBufferOn = false;
    },
    _removeCache: function (instanceID) {
        instanceID = instanceID || this._currentID;
        var cmds = this._cacheToBufferCmds[instanceID];
        if (cmds) {
            cmds.length = 0;
            delete this._cacheToBufferCmds[instanceID];
        }
        var locIDs = this._cacheInstanceIds;
        cc.arrayRemoveObject(locIDs, instanceID);
    },
    _renderingToBuffer: function (renderTextureId) {
        renderTextureId = renderTextureId || this._currentID;
        var locCmds = this._cacheToBufferCmds[renderTextureId];
        var ctx = cc._renderContext;
        this.rendering(ctx, locCmds);
        this._removeCache(renderTextureId);
        var locIDs = this._cacheInstanceIds;
        if (locIDs.length === 0)
            this._isCacheToBufferOn = false;
        else
            this._currentID = locIDs[locIDs.length - 1];
    },
    resetFlag: function () {
        if (this.childrenOrderDirty) {
            this.childrenOrderDirty = false;
        }
        this._transformNodePool.length = 0;
    },
    transform: function () {
        var locPool = this._transformNodePool;
        locPool.sort(this._sortNodeByLevelAsc);
        var i, len, cmd;
        for (i = 0, len = locPool.length; i < len; i++) {
            cmd = locPool[i];
            cmd.updateStatus();
        }
        locPool.length = 0;
    },
    transformDirty: function () {
        return this._transformNodePool.length > 0;
    },
    _sortNodeByLevelAsc: function (n1, n2) {
        return n1._curLevel - n2._curLevel;
    },
    pushDirtyNode: function (node) {
        this._transformNodePool.push(node);
    },
    clearRenderCommands: function () {
        this._renderCmds.length = 0;
    },
    clear: function () {
        var gl = cc._renderContext;
        gl.clearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearColor.a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    },
    setDepthTest: function (enable){
        var gl = cc._renderContext;
        if(enable){
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
        }
        else{
            gl.disable(gl.DEPTH_TEST);
        }
    },
    pushRenderCommand: function (cmd) {
        if(!cmd.needDraw())
            return;
        if (this._isCacheToBufferOn) {
            var currentId = this._currentID, locCmdBuffer = this._cacheToBufferCmds;
            var cmdList = locCmdBuffer[currentId];
            if (cmdList.indexOf(cmd) === -1)
                cmdList.push(cmd);
        } else {
            if (this._renderCmds.indexOf(cmd) === -1) {
                this._renderCmds.push(cmd);
            }
        }
    },
    _increaseBatchingSize: function (increment) {
        _batchingSize += increment;
    },
    _uploadBufferData: function (cmd) {
        if (_batchingSize >= _vertexSize) {
            this._batchRendering();
        }
        var texture = cmd._node._texture;
        var blendSrc = cmd._node._blendFunc.src;
        var blendDst = cmd._node._blendFunc.dst;
        var shader = cmd._shaderProgram;
        if (_batchedInfo.texture !== texture ||
            _batchedInfo.blendSrc !== blendSrc ||
            _batchedInfo.blendDst !== blendDst ||
            _batchedInfo.shader !== shader) {
            this._batchRendering();
            _batchedInfo.texture = texture;
            _batchedInfo.blendSrc = blendSrc;
            _batchedInfo.blendDst = blendDst;
            _batchedInfo.shader = shader;
        }
        var len = cmd.uploadData(_vertexDataF32, _vertexDataUI32, _batchingSize * _sizePerVertex);
        if (len > 0) {
            _batchingSize += len;
        }
    },
    _batchRendering: function () {
        if (_batchingSize === 0 || !_batchedInfo.texture) {
            return;
        }
        var gl = cc._renderContext;
        var texture = _batchedInfo.texture;
        var shader = _batchedInfo.shader;
        var count = _batchingSize / 4;
        if (shader) {
            shader.use();
            shader._updateProjectionUniform();
        }
        cc.glBlendFunc(_batchedInfo.blendSrc, _batchedInfo.blendDst);
        cc.glBindTexture2DN(0, texture);
        var _bufferchanged = !gl.bindBuffer(gl.ARRAY_BUFFER, _quadVertexBuffer);
        if (_batchingSize > _vertexSize * 0.5) {
            gl.bufferData(gl.ARRAY_BUFFER, _vertexDataF32, gl.DYNAMIC_DRAW);
        }
        else {
            var view = _vertexDataF32.subarray(0, _batchingSize * _sizePerVertex);
            gl.bufferData(gl.ARRAY_BUFFER, view, gl.DYNAMIC_DRAW);
        }
        if (_bufferchanged) {
            gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
            gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_COLOR);
            gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_TEX_COORDS);
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, 0);
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 24, 16);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _quadIndexBuffer);
        gl.drawElements(gl.TRIANGLES, count * 6, gl.UNSIGNED_SHORT, 0);
        cc.g_NumberOfDraws++;
        _batchingSize = 0;
    },
    rendering: function (ctx, cmds) {
        var locCmds = cmds || this._renderCmds,
            i, len, cmd, next, batchCount,
            context = ctx || cc._renderContext;
        context.bindBuffer(gl.ARRAY_BUFFER, null);
        for (i = 0, len = locCmds.length; i < len; ++i) {
            cmd = locCmds[i];
            if (cmd.uploadData) {
                this._uploadBufferData(cmd);
            }
            else {
                if (_batchingSize > 0) {
                    this._batchRendering();
                }
                cmd.rendering(context);
            }
        }
        this._batchRendering();
        _batchedInfo.texture = null;
    }
};
})();
(function() {
    cc.Node.WebGLRenderCmd = function (renderable) {
        cc.Node.RenderCmd.call(this, renderable);
        this._shaderProgram = null;
    };
    var proto = cc.Node.WebGLRenderCmd.prototype = Object.create(cc.Node.RenderCmd.prototype);
    proto.constructor = cc.Node.WebGLRenderCmd;
    proto._updateColor = function(){};
    proto.setShaderProgram = function (shaderProgram) {
        this._shaderProgram = shaderProgram;
    };
    proto.getShaderProgram = function () {
        return this._shaderProgram;
    };
})();
(function(){
    cc.Layer.WebGLRenderCmd = function(renderable){
        cc.Node.WebGLRenderCmd.call(this, renderable);
    };
    var proto = cc.Layer.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.Layer.WebGLRenderCmd;
    proto.bake = function(){};
    proto.unbake = function(){};
    proto._bakeForAddChild = function(){};
})();
(function(){
    cc.LayerColor.WebGLRenderCmd = function(renderable){
        cc.Layer.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
        this._matrix = new cc.math.Matrix4();
        this._matrix.identity();
        var _t = this;
        _t._squareVerticesAB = new ArrayBuffer(48);
        _t._squareColorsAB = new ArrayBuffer(16);
        var locSquareVerticesAB = _t._squareVerticesAB, locSquareColorsAB = _t._squareColorsAB;
        var locVertex3FLen = cc.Vertex3F.BYTES_PER_ELEMENT, locColorLen = cc.Color.BYTES_PER_ELEMENT;
        _t._squareVertices = [new cc.Vertex3F(0, 0, 0, locSquareVerticesAB, 0),
            new cc.Vertex3F(0, 0, 0, locSquareVerticesAB, locVertex3FLen),
            new cc.Vertex3F(0, 0, 0, locSquareVerticesAB, locVertex3FLen * 2),
            new cc.Vertex3F(0, 0, 0, locSquareVerticesAB, locVertex3FLen * 3)];
        _t._squareColors = [cc.color(0, 0, 0, 255, locSquareColorsAB, 0),
            cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen),
            cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen * 2),
            cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen * 3)];
        _t._verticesFloat32Buffer = cc._renderContext.createBuffer();
        _t._colorsUint8Buffer = cc._renderContext.createBuffer();
        this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_COLOR);
    };
    var proto = cc.LayerColor.WebGLRenderCmd.prototype = Object.create(cc.Layer.WebGLRenderCmd.prototype);
    proto.constructor = cc.LayerColor.WebGLRenderCmd;
    proto.rendering = function (ctx) {
        var context = ctx || cc._renderContext;
        var node = this._node;
        var wt = this._worldTransform;
        this._matrix.mat[0] = wt.a;
        this._matrix.mat[4] = wt.c;
        this._matrix.mat[12] = wt.tx;
        this._matrix.mat[1] = wt.b;
        this._matrix.mat[5] = wt.d;
        this._matrix.mat[13] = wt.ty;
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._matrix);
        context.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        context.enableVertexAttribArray(cc.VERTEX_ATTRIB_COLOR);
        cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
        context.bindBuffer(context.ARRAY_BUFFER, this._verticesFloat32Buffer);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, context.FLOAT, false, 0, 0);
        context.bindBuffer(context.ARRAY_BUFFER, this._colorsUint8Buffer);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, context.UNSIGNED_BYTE, true, 0, 0);
        context.drawArrays(context.TRIANGLE_STRIP, 0, this._squareVertices.length);
    };
    proto.transform = function (parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        var node = this._node,
            width = node._contentSize.width,
            height = node._contentSize.height;
        var locSquareVertices = this._squareVertices;
        locSquareVertices[1].x = width;
        locSquareVertices[2].y = height;
        locSquareVertices[3].x = width;
        locSquareVertices[3].y = height;
        locSquareVertices[0].z =
        locSquareVertices[1].z =
        locSquareVertices[2].z =
        locSquareVertices[3].z = node._vertexZ;
        this._bindLayerVerticesBufferData();
    };
    proto._updateColor = function(){
        var locDisplayedColor = this._displayedColor, locDisplayedOpacity = this._displayedOpacity,
            locSquareColors = this._squareColors;
        for (var i = 0; i < 4; i++) {
            locSquareColors[i].r = locDisplayedColor.r;
            locSquareColors[i].g = locDisplayedColor.g;
            locSquareColors[i].b = locDisplayedColor.b;
            locSquareColors[i].a = locDisplayedOpacity;
        }
        this._bindLayerColorsBufferData();
    };
    proto._bindLayerVerticesBufferData = function(){
        var glContext = cc._renderContext;
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this._verticesFloat32Buffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, this._squareVerticesAB, glContext.DYNAMIC_DRAW);
    };
    proto._bindLayerColorsBufferData = function(){
        var glContext = cc._renderContext;
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this._colorsUint8Buffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, this._squareColorsAB, glContext.STATIC_DRAW);
    };
    proto.updateBlendFunc = function(blendFunc){};
})();
(function(){
    cc.LayerGradient.WebGLRenderCmd = function(renderable){
        cc.LayerColor.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
        this._clipRect = new cc.Rect();
        this._clippingRectDirty = false;
    };
    var proto = cc.LayerGradient.WebGLRenderCmd.prototype = Object.create(cc.LayerColor.WebGLRenderCmd.prototype);
    proto.constructor = cc.LayerGradient.WebGLRenderCmd;
    proto.updateStatus = function () {
        var flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        if (locFlag & flags.gradientDirty) {
            this._dirtyFlag |= flags.colorDirty;
            this._updateVertex();
            this._dirtyFlag = locFlag & flags.gradientDirty ^ locFlag;
        }
        cc.Node.RenderCmd.prototype.updateStatus.call(this);
    };
    proto._syncStatus = function (parentCmd) {
        var flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        if (locFlag & flags.gradientDirty) {
            this._dirtyFlag |= flags.colorDirty;
            this._updateVertex();
            this._dirtyFlag = locFlag & flags.gradientDirty ^ locFlag;
        }
        cc.Node.RenderCmd.prototype._syncStatus.call(this, parentCmd);
    };
    proto.transform = function (parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        this._updateVertex();
    };
    proto._updateVertex = function () {
        var node = this._node, stops = node._colorStops;
        if(!stops || stops.length < 2)
            return;
        this._clippingRectDirty = true;
        var stopsLen = stops.length, verticesLen = stopsLen * 2, i, contentSize = node._contentSize;
        var locVertices = this._squareVertices;
        if (locVertices.length < verticesLen) {
            this._squareVerticesAB = new ArrayBuffer(verticesLen * 12);
            locVertices.length = 0;
            var locSquareVerticesAB = this._squareVerticesAB;
            var locVertex3FLen = cc.Vertex3F.BYTES_PER_ELEMENT;
            for(i = 0; i < verticesLen; i++){
                locVertices.push(new cc.Vertex3F(0, 0, 0, locSquareVerticesAB, locVertex3FLen * i));
            }
        }
        var angle = Math.PI + cc.pAngleSigned(cc.p(0, -1), node._alongVector), locAnchor = cc.p(contentSize.width/2, contentSize.height /2);
        var degrees = Math.round(cc.radiansToDegrees(angle));
        var transMat = cc.affineTransformMake(1, 0, 0, 1, locAnchor.x, locAnchor.y);
        transMat = cc.affineTransformRotate(transMat, angle);
        var a, b;
        if(degrees < 90) {
            a = cc.p(-locAnchor.x, locAnchor.y);
            b = cc.p(locAnchor.x, locAnchor.y);
        } else if(degrees < 180) {
            a = cc.p(locAnchor.x, locAnchor.y);
            b = cc.p(locAnchor.x, -locAnchor.y);
        } else if(degrees < 270) {
            a = cc.p(locAnchor.x, -locAnchor.y);
            b = cc.p(-locAnchor.x, -locAnchor.y);
        } else {
            a = cc.p(-locAnchor.x, -locAnchor.y);
            b = cc.p(-locAnchor.x, locAnchor.y);
        }
        var sin = Math.sin(angle), cos = Math.cos(angle);
        var tx = Math.abs((a.x * cos - a.y * sin)/locAnchor.x), ty = Math.abs((b.x * sin + b.y * cos)/locAnchor.y);
        transMat = cc.affineTransformScale(transMat, tx, ty);
        for (i = 0; i < stopsLen; i++) {
            var stop = stops[i], y = stop.p * contentSize.height ;
            var p0 = cc.pointApplyAffineTransform(- locAnchor.x , y - locAnchor.y, transMat);
            locVertices[i * 2].x = p0.x;
            locVertices[i * 2].y = p0.y;
            locVertices[i * 2].z = node._vertexZ;
            var p1 = cc.pointApplyAffineTransform(contentSize.width - locAnchor.x, y - locAnchor.y, transMat);
            locVertices[i * 2 + 1].x = p1.x;
            locVertices[i * 2 + 1].y = p1.y;
            locVertices[i * 2 + 1].z = node._vertexZ;
        }
        this._bindLayerVerticesBufferData();
    };
    proto._updateColor = function() {
        var node = this._node, stops = node._colorStops;
        if(!stops || stops.length < 2)
            return;
        var stopsLen = stops.length;
        var locColors = this._squareColors, verticesLen = stopsLen * 2;
        if (locColors.length < verticesLen) {
            this._squareColorsAB = new ArrayBuffer(verticesLen * 4);
            locColors.length = 0;
            var locSquareColorsAB = this._squareColorsAB;
            var locColorLen = cc.Color.BYTES_PER_ELEMENT;
            for(i = 0; i < verticesLen; i++){
                locColors.push(cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen * i));
            }
        }
        var opacityf = this._displayedOpacity / 255.0;
        for(i = 0; i < stopsLen; i++){
            var stopColor = stops[i].color, locSquareColor0 = locColors[i * 2], locSquareColor1 = locColors[i * 2 + 1];
            locSquareColor0.r = stopColor.r;
            locSquareColor0.g = stopColor.g;
            locSquareColor0.b = stopColor.b;
            locSquareColor0.a = stopColor.a * opacityf;
            locSquareColor1.r = stopColor.r;
            locSquareColor1.g = stopColor.g;
            locSquareColor1.b = stopColor.b;
            locSquareColor1.a = stopColor.a * opacityf;
        }
        this._bindLayerColorsBufferData();
    };
    proto.rendering = function (ctx) {
        var context = ctx || cc._renderContext, node = this._node;
        var clippingRect = this._getClippingRect();
        context.enable(context.SCISSOR_TEST);
        cc.view.setScissorInPoints(clippingRect.x, clippingRect.y, clippingRect.width, clippingRect.height);
        var wt = this._worldTransform;
        this._matrix.mat[0] = wt.a;
        this._matrix.mat[4] = wt.c;
        this._matrix.mat[12] = wt.tx;
        this._matrix.mat[1] = wt.b;
        this._matrix.mat[5] = wt.d;
        this._matrix.mat[13] = wt.ty;
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._matrix);
        context.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        context.enableVertexAttribArray(cc.VERTEX_ATTRIB_COLOR);
        cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
        context.bindBuffer(context.ARRAY_BUFFER, this._verticesFloat32Buffer);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, context.FLOAT, false, 0, 0);
        context.bindBuffer(context.ARRAY_BUFFER, this._colorsUint8Buffer);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, context.UNSIGNED_BYTE, true, 0, 0);
        context.drawArrays(context.TRIANGLE_STRIP, 0, this._squareVertices.length);
        context.disable(context.SCISSOR_TEST);
    };
    proto._getClippingRect = function(){
        if(this._clippingRectDirty){
            var node = this._node;
            var rect = cc.rect(0, 0, node._contentSize.width, node._contentSize.height);
            var trans = node.getNodeToWorldTransform();
            this._clipRect = cc._rectApplyAffineTransformIn(rect, trans);
        }
        return this._clipRect;
    };
})();
(function() {
    cc.Sprite.WebGLRenderCmd = function (renderable) {
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
        this._vertices = [
            {x: 0, y: 0, u: 0, v: 0},
            {x: 0, y: 0, u: 0, v: 0},
            {x: 0, y: 0, u: 0, v: 0},
            {x: 0, y: 0, u: 0, v: 0}
        ];
        this._color = new Uint32Array(1);
        this._dirty = false;
        this._recursiveDirty = false;
        this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST);
    };
    var proto = cc.Sprite.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.Sprite.WebGLRenderCmd;
    proto.updateBlendFunc = function (blendFunc) {};
    proto.setDirtyFlag = function(dirtyFlag){
        cc.Node.WebGLRenderCmd.prototype.setDirtyFlag.call(this, dirtyFlag);
        this._dirty = true;
    };
    proto.setDirtyRecursively = function (value) {
        this._recursiveDirty = value;
        this._dirty = value;
        var locChildren = this._node._children, child, l = locChildren ? locChildren.length : 0;
        for (var i = 0; i < l; i++) {
            child = locChildren[i];
            (child instanceof cc.Sprite) && child._renderCmd.setDirtyRecursively(value);
        }
    };
    proto._setBatchNodeForAddChild = function (child) {
        var node = this._node;
        if (node._batchNode) {
            if (!(child instanceof cc.Sprite)) {
                cc.log(cc._LogInfos.Sprite_addChild);
                return false;
            }
            if (child.texture._webTextureObj !== node.textureAtlas.texture._webTextureObj)
                cc.log(cc._LogInfos.Sprite_addChild_2);
            node._batchNode.appendChild(child);
            if (!node._reorderChildDirty)
                node._setReorderChildDirtyRecursively();
        }
        return true;
    };
    proto._handleTextureForRotatedTexture = function (texture) {
        return texture;
    };
    proto.isFrameDisplayed = function (frame) {
        var node = this._node;
        return (cc.rectEqualToRect(frame.getRect(), node._rect) && frame.getTexture().getName() === node._texture.getName()
            && cc.pointEqualToPoint(frame.getOffset(), node._unflippedOffsetPositionFromCenter));
    };
    proto._updateForSetSpriteFrame = function () {};
    proto._spriteFrameLoadedCallback = function (spriteFrame) {
        this.setTextureRect(spriteFrame.getRect(), spriteFrame.isRotated(), spriteFrame.getOriginalSize());
        this.dispatchEvent("load");
    };
    proto._textureLoadedCallback = function (sender) {
        if (this._textureLoaded)
            return;
        this._textureLoaded = true;
        var locRect = this._rect;
        if (!locRect) {
            locRect = cc.rect(0, 0, sender.width, sender.height);
        } else if (cc._rectEqualToZero(locRect)) {
            locRect.width = sender.width;
            locRect.height = sender.height;
        }
        this.texture = sender;
        this.setTextureRect(locRect, this._rectRotated);
        this.setBatchNode(this._batchNode);
        this.dispatchEvent("load");
        cc.renderer.childrenOrderDirty = true;
    };
    proto._setTextureCoords = function (rect, needConvert) {
        if (needConvert === undefined)
            needConvert = true;
        if (needConvert)
            rect = cc.rectPointsToPixels(rect);
        var node = this._node;
        var tex = node._batchNode ? node.textureAtlas.texture : node._texture;
        var uvs = this._vertices;
        if (!tex)
            return;
        var atlasWidth = tex.pixelsWidth;
        var atlasHeight = tex.pixelsHeight;
        var left, right, top, bottom, tempSwap;
        if (node._rectRotated) {
            if (cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL) {
                left = (2 * rect.x + 1) / (2 * atlasWidth);
                right = left + (rect.height * 2 - 2) / (2 * atlasWidth);
                top = (2 * rect.y + 1) / (2 * atlasHeight);
                bottom = top + (rect.width * 2 - 2) / (2 * atlasHeight);
            } else {
                left = rect.x / atlasWidth;
                right = (rect.x + rect.height) / atlasWidth;
                top = rect.y / atlasHeight;
                bottom = (rect.y + rect.width) / atlasHeight;
            }
            if (node._flippedX) {
                tempSwap = top;
                top = bottom;
                bottom = tempSwap;
            }
            if (node._flippedY) {
                tempSwap = left;
                left = right;
                right = tempSwap;
            }
            uvs[0].u = right;
            uvs[0].v = top;
            uvs[1].u = left;
            uvs[1].v = top;
            uvs[2].u = right;
            uvs[2].v = bottom;
            uvs[3].u = left;
            uvs[3].v = bottom;
        } else {
            if (cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL) {
                left = (2 * rect.x + 1) / (2 * atlasWidth);
                right = left + (rect.width * 2 - 2) / (2 * atlasWidth);
                top = (2 * rect.y + 1) / (2 * atlasHeight);
                bottom = top + (rect.height * 2 - 2) / (2 * atlasHeight);
            } else {
                left = rect.x / atlasWidth;
                right = (rect.x + rect.width) / atlasWidth;
                top = rect.y / atlasHeight;
                bottom = (rect.y + rect.height) / atlasHeight;
            }
            if (node._flippedX) {
                tempSwap = left;
                left = right;
                right = tempSwap;
            }
            if (node._flippedY) {
                tempSwap = top;
                top = bottom;
                bottom = tempSwap;
            }
            uvs[0].u = left;
            uvs[0].v = top;
            uvs[1].u = left;
            uvs[1].v = bottom;
            uvs[2].u = right;
            uvs[2].v = top;
            uvs[3].u = right;
            uvs[3].v = bottom;
        }
    };
    proto._setColorDirty = function () {};
    proto._updateBlendFunc = function () {
        if (this._batchNode) {
            cc.log(cc._LogInfos.Sprite__updateBlendFunc);
            return;
        }
        var node = this._node,
            blendFunc = node._blendFunc;
        if (!node._texture || !node._texture.hasPremultipliedAlpha()) {
            if (blendFunc.src === cc.ONE && blendFunc.dst === cc.BLEND_DST) {
                blendFunc.src = cc.SRC_ALPHA;
            }
            node.opacityModifyRGB = false;
        } else {
            if (blendFunc.src === cc.SRC_ALPHA && blendFunc.dst === cc.BLEND_DST) {
                blendFunc.src = cc.ONE;
            }
            node.opacityModifyRGB = true;
        }
    };
    proto._setTexture = function (texture) {
        var node = this._node;
        if (node._batchNode) {
            if(node._batchNode.texture !== texture){
                cc.log(cc._LogInfos.Sprite_setTexture);
                return;
            }
        } else {
            if(node._texture !== texture){
                node._textureLoaded = texture ? texture._textureLoaded : false;
                node._texture = texture;
                this._updateBlendFunc();
                if (node._textureLoaded) {
                    cc.renderer.childrenOrderDirty = true;
                }
            }
        }
    };
    proto._checkTextureBoundary = function (texture, rect, rotated) {
        if (texture && texture.url) {
            var _x, _y;
            if (rotated) {
                _x = rect.x + rect.height;
                _y = rect.y + rect.width;
            } else {
                _x = rect.x + rect.width;
                _y = rect.y + rect.height;
            }
            if (_x > texture.width) {
                cc.error(cc._LogInfos.RectWidth, texture.url);
            }
            if (_y > texture.height) {
                cc.error(cc._LogInfos.RectHeight, texture.url);
            }
        }
    };
    proto.transform = function (parentCmd, recursive) {
        this.originTransform(parentCmd, recursive);
        var node = this._node,
            lx = node._offsetPosition.x, rx = lx + node._rect.width,
            by = node._offsetPosition.y, ty = by + node._rect.height,
            wt = this._worldTransform;
        var vertices = this._vertices;
        vertices[0].x = lx * wt.a + ty * wt.c + wt.tx;
        vertices[0].y = lx * wt.b + ty * wt.d + wt.ty;
        vertices[1].x = lx * wt.a + by * wt.c + wt.tx;
        vertices[1].y = lx * wt.b + by * wt.d + wt.ty;
        vertices[2].x = rx * wt.a + ty * wt.c + wt.tx;
        vertices[2].y = rx * wt.b + ty * wt.d + wt.ty;
        vertices[3].x = rx * wt.a + by * wt.c + wt.tx;
        vertices[3].y = rx * wt.b + by * wt.d + wt.ty;
    };
    proto.needDraw = function () {
        var node = this._node, locTexture = node._texture;
        return (this._needDraw && locTexture);
    };
    proto.uploadData = function (f32buffer, ui32buffer, vertexDataOffset) {
        var node = this._node, locTexture = node._texture;
        if (!(locTexture && locTexture._textureLoaded && node._rect.width && node._rect.height) || !this._displayedOpacity)
            return false;
        var opacity = this._displayedOpacity;
        var r = this._displayedColor.r,
            g = this._displayedColor.g,
            b = this._displayedColor.b;
        if (node._opacityModifyRGB) {
            var a = opacity / 255;
            r *= a;
            g *= a;
            b *= a;
        }
        this._color[0] = ((opacity<<24) | (b<<16) | (g<<8) | r);
        var z = node._vertexZ;
        var vertices = this._vertices;
        var i, len = vertices.length, vertex, offset = vertexDataOffset;
        for (i = 0; i < len; ++i) {
            vertex = vertices[i];
            f32buffer[offset] = vertex.x;
            f32buffer[offset + 1] = vertex.y;
            f32buffer[offset + 2] = z;
            ui32buffer[offset + 3] = this._color[0];
            f32buffer[offset + 4] = vertex.u;
            f32buffer[offset + 5] = vertex.v;
            offset += 6;
        }
        return len;
    };
})();
(function() {
    cc.LabelTTF.WebGLRenderCmd = function (renderable) {
        cc.Sprite.WebGLRenderCmd.call(this, renderable);
        cc.LabelTTF.CacheRenderCmd.call(this);
    };
    var proto = cc.LabelTTF.WebGLRenderCmd.prototype = Object.create(cc.Sprite.WebGLRenderCmd.prototype);
    cc.inject(cc.LabelTTF.CacheRenderCmd.prototype, proto);
    proto.constructor = cc.LabelTTF.WebGLRenderCmd;
    proto._updateColor = function () {};
})();
cc.DrawingPrimitiveWebGL = cc.Class.extend({
    _renderContext:null,
    _initialized:false,
    _shader: null,
    _colorLocation: "u_color",
    _colorArray: null,
    _pointSizeLocation: "u_pointSize",
    _pointSize:-1,
    ctor:function (ctx) {
        if (ctx == null)
            ctx = cc._renderContext;
        if (!ctx instanceof  WebGLRenderingContext)
            throw new Error("Can't initialise DrawingPrimitiveWebGL. context need is WebGLRenderingContext");
        this._renderContext = ctx;
        this._colorArray = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    },
    lazy_init:function () {
        var _t = this;
        if (!_t._initialized) {
            _t._shader = cc.shaderCache.programForKey(cc.SHADER_POSITION_UCOLOR);
            _t._shader._addUniformLocation(this._colorLocation);
            _t._shader._addUniformLocation(this._pointSizeLocation);
            _t._initialized = true;
        }
    },
    drawInit:function () {
        this._initialized = false;
    },
    drawPoint:function (point) {
        this.lazy_init();
        var glContext = this._renderContext;
        this._shader.use();
        this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
        glContext.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        this._shader.setUniformLocationWith4fv(this._colorLocation, this._colorArray);
        this._shader.setUniformLocationWith1f(this._pointSizeLocation, this._pointSize);
        var pointBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array([point.x, point.y]), glContext.STATIC_DRAW);
        glContext.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, glContext.FLOAT, false, 0, 0);
        glContext.drawArrays(glContext.POINTS, 0, 1);
        glContext.deleteBuffer(pointBuffer);
        cc.incrementGLDraws(1);
    },
    drawPoints:function (points, numberOfPoints) {
        if (!points || points.length === 0)
            return;
        this.lazy_init();
        var glContext = this._renderContext;
        this._shader.use();
        this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
        glContext.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        this._shader.setUniformLocationWith4fv(this._colorLocation, this._colorArray);
        this._shader.setUniformLocationWith1f(this._pointSizeLocation, this._pointSize);
        var pointBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, this._pointsToTypeArray(points), glContext.STATIC_DRAW);
        glContext.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, glContext.FLOAT, false, 0, 0);
        glContext.drawArrays(glContext.POINTS, 0, points.length);
        glContext.deleteBuffer(pointBuffer);
        cc.incrementGLDraws(1);
    },
    _pointsToTypeArray:function (points) {
        var typeArr = new Float32Array(points.length * 2);
        for (var i = 0; i < points.length; i++) {
            typeArr[i * 2] = points[i].x;
            typeArr[i * 2 + 1] = points[i].y;
        }
        return typeArr;
    },
    drawLine:function (origin, destination) {
        this.lazy_init();
        var glContext = this._renderContext;
        this._shader.use();
        this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
        glContext.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        this._shader.setUniformLocationWith4fv(this._colorLocation, this._colorArray);
        var pointBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, this._pointsToTypeArray([origin, destination]), glContext.STATIC_DRAW);
        glContext.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, glContext.FLOAT, false, 0, 0);
        glContext.drawArrays(glContext.LINES, 0, 2);
        glContext.deleteBuffer(pointBuffer);
        cc.incrementGLDraws(1);
    },
    drawRect:function (origin, destination) {
        this.drawLine(cc.p(origin.x, origin.y), cc.p(destination.x, origin.y));
        this.drawLine(cc.p(destination.x, origin.y), cc.p(destination.x, destination.y));
        this.drawLine(cc.p(destination.x, destination.y), cc.p(origin.x, destination.y));
        this.drawLine(cc.p(origin.x, destination.y), cc.p(origin.x, origin.y));
    },
    drawSolidRect:function (origin, destination, color) {
        var vertices = [
            origin,
            cc.p(destination.x, origin.y),
            destination,
            cc.p(origin.x, destination.y)
        ];
        this.drawSolidPoly(vertices, 4, color);
    },
    drawPoly:function (vertices, numOfVertices, closePolygon) {
        this.lazy_init();
        var glContext = this._renderContext;
        this._shader.use();
        this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
        glContext.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        this._shader.setUniformLocationWith4fv(this._colorLocation, this._colorArray);
        var pointBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, this._pointsToTypeArray(vertices), glContext.STATIC_DRAW);
        glContext.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, glContext.FLOAT, false, 0, 0);
        if (closePolygon)
            glContext.drawArrays(glContext.LINE_LOOP, 0, vertices.length);
        else
            glContext.drawArrays(glContext.LINE_STRIP, 0, vertices.length);
        glContext.deleteBuffer(pointBuffer);
        cc.incrementGLDraws(1);
    },
    drawSolidPoly:function (poli, numberOfPoints, color) {
        this.lazy_init();
        if (color)
            this.setDrawColor(color.r, color.g, color.b, color.a);
        var glContext = this._renderContext;
        this._shader.use();
        this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
        glContext.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        this._shader.setUniformLocationWith4fv(this._colorLocation, this._colorArray);
        var pointBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, this._pointsToTypeArray(poli), glContext.STATIC_DRAW);
        glContext.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, glContext.FLOAT, false, 0, 0);
        glContext.drawArrays(glContext.TRIANGLE_FAN, 0, poli.length);
        glContext.deleteBuffer(pointBuffer);
        cc.incrementGLDraws(1);
    },
    drawCircle:function (center, radius, angle, segments, drawLineToCenter) {
        this.lazy_init();
        var additionalSegment = 1;
        if (drawLineToCenter)
            additionalSegment++;
        var coef = 2.0 * Math.PI / segments;
        var vertices = new Float32Array((segments + 2) * 2);
        if (!vertices)
            return;
        for (var i = 0; i <= segments; i++) {
            var rads = i * coef;
            var j = radius * Math.cos(rads + angle) + center.x;
            var k = radius * Math.sin(rads + angle) + center.y;
            vertices[i * 2] = j;
            vertices[i * 2 + 1] = k;
        }
        vertices[(segments + 1) * 2] = center.x;
        vertices[(segments + 1) * 2 + 1] = center.y;
        var glContext = this._renderContext;
        this._shader.use();
        this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
        glContext.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        this._shader.setUniformLocationWith4fv(this._colorLocation, this._colorArray);
        var pointBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, vertices, glContext.STATIC_DRAW);
        glContext.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, glContext.FLOAT, false, 0, 0);
        glContext.drawArrays(glContext.LINE_STRIP, 0, segments + additionalSegment);
        glContext.deleteBuffer(pointBuffer);
        cc.incrementGLDraws(1);
    },
    drawQuadBezier:function (origin, control, destination, segments) {
        this.lazy_init();
        var vertices = new Float32Array((segments + 1) * 2);
        var t = 0.0;
        for (var i = 0; i < segments; i++) {
            vertices[i * 2] = Math.pow(1 - t, 2) * origin.x + 2.0 * (1 - t) * t * control.x + t * t * destination.x;
            vertices[i * 2 + 1] = Math.pow(1 - t, 2) * origin.y + 2.0 * (1 - t) * t * control.y + t * t * destination.y;
            t += 1.0 / segments;
        }
        vertices[segments * 2] = destination.x;
        vertices[segments * 2 + 1] = destination.y;
        var glContext = this._renderContext;
        this._shader.use();
        this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
        glContext.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        this._shader.setUniformLocationWith4fv(this._colorLocation, this._colorArray);
        var pointBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, vertices, glContext.STATIC_DRAW);
        glContext.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, glContext.FLOAT, false, 0, 0);
        glContext.drawArrays(glContext.LINE_STRIP, 0, segments + 1);
        glContext.deleteBuffer(pointBuffer);
        cc.incrementGLDraws(1);
    },
    drawCubicBezier:function (origin, control1, control2, destination, segments) {
        this.lazy_init();
        var vertices = new Float32Array((segments + 1) * 2);
        var t = 0;
        for (var i = 0; i < segments; i++) {
            vertices[i * 2] = Math.pow(1 - t, 3) * origin.x + 3.0 * Math.pow(1 - t, 2) * t * control1.x + 3.0 * (1 - t) * t * t * control2.x + t * t * t * destination.x;
            vertices[i * 2 + 1] = Math.pow(1 - t, 3) * origin.y + 3.0 * Math.pow(1 - t, 2) * t * control1.y + 3.0 * (1 - t) * t * t * control2.y + t * t * t * destination.y;
            t += 1.0 / segments;
        }
        vertices[segments * 2] = destination.x;
        vertices[segments * 2 + 1] = destination.y;
        var glContext = this._renderContext;
        this._shader.use();
        this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
        glContext.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        this._shader.setUniformLocationWith4fv(this._colorLocation, this._colorArray);
        var pointBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, vertices, glContext.STATIC_DRAW);
        glContext.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, glContext.FLOAT, false, 0, 0);
        glContext.drawArrays(glContext.LINE_STRIP, 0, segments + 1);
        glContext.deleteBuffer(pointBuffer);
        cc.incrementGLDraws(1);
    },
    drawCatmullRom:function (points, segments) {
        this.drawCardinalSpline(points, 0.5, segments);
    },
    drawCardinalSpline:function (config, tension, segments) {
        this.lazy_init();
        var vertices = new Float32Array((segments + 1) * 2);
        var p, lt, deltaT = 1.0 / config.length;
        for (var i = 0; i < segments + 1; i++) {
            var dt = i / segments;
            if (dt === 1) {
                p = config.length - 1;
                lt = 1;
            } else {
                p = 0 | (dt / deltaT);
                lt = (dt - deltaT * p) / deltaT;
            }
            var newPos = cc.cardinalSplineAt(
                cc.getControlPointAt(config, p - 1),
                cc.getControlPointAt(config, p),
                cc.getControlPointAt(config, p + 1),
                cc.getControlPointAt(config, p + 2),
                tension, lt);
            vertices[i * 2] = newPos.x;
            vertices[i * 2 + 1] = newPos.y;
        }
        var glContext = this._renderContext;
        this._shader.use();
        this._shader.setUniformForModelViewAndProjectionMatrixWithMat4();
        glContext.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        this._shader.setUniformLocationWith4fv(this._colorLocation, this._colorArray);
        var pointBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, pointBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, vertices, glContext.STATIC_DRAW);
        glContext.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, glContext.FLOAT, false, 0, 0);
        glContext.drawArrays(glContext.LINE_STRIP, 0, segments + 1);
        glContext.deleteBuffer(pointBuffer);
        cc.incrementGLDraws(1);
    },
    setDrawColor:function (r, g, b, a) {
        this._colorArray[0] = r / 255.0;
        this._colorArray[1] = g / 255.0;
        this._colorArray[2] = b / 255.0;
        this._colorArray[3] = a / 255.0;
    },
    setPointSize:function (pointSize) {
        this._pointSize = pointSize * cc.contentScaleFactor();
    },
    setLineWidth:function (width) {
        if(this._renderContext.lineWidth)
            this._renderContext.lineWidth(width);
    }
});
