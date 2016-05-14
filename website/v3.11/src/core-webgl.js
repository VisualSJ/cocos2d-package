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
                    -ox,
                    size.width - ox,
                    -oy,
                    size.height - oy,
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
    _p._beforeVisitScene = function () {
        cc.kmGLPushMatrix();
    };
    _p._afterVisitScene = function () {
        cc.kmGLPopMatrix();
    };
    _p.convertToGL = function (uiPoint) {
        var transform = new cc.math.Matrix4();
        cc.GLToClipTransform(transform);
        var transformInv = transform.inverse();
        var zClip = transform.mat[14] / transform.mat[15];
        var glSize = this._openGLView.getDesignResolutionSize();
        var glCoord = new cc.math.Vec3(2.0 * uiPoint.x / glSize.width - 1.0, 1.0 - 2.0 * uiPoint.y / glSize.height, zClip);
        glCoord.transformCoord(transformInv);
        return cc.p(glCoord.x, glCoord.y);
    };
    _p.convertToUI = function (glPoint) {
        var transform = new cc.math.Matrix4();
        cc.GLToClipTransform(transform);
        var clipCoord = new cc.math.Vec3(glPoint.x, glPoint.y, 0.0);
        clipCoord.transformCoord(transform);
        var glSize = this._openGLView.getDesignResolutionSize();
        return cc.p(glSize.width * (clipCoord.x * 0.5 + 0.5), glSize.height * (-clipCoord.y * 0.5 + 0.5));
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
        _t.setDepthTest(false);
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
function removeByLastSwap (array, i) {
    var len = array.length;
    if (len > 0 && i >= 0 && i < len) {
        array[i] = array[len - 1];
        array.length--;
    }
}
var CACHING_BUFFER = true;
var ACTIVATE_AUTO_BATCH = true;
var _gbuffers = [],
    _batchedInfo = {
        texture: null,
        blendSrc: null,
        blendDst: null,
        shader: null
    },
    _currentInfo = {
        texture: null,
        blendSrc: null,
        blendDst: null,
        shader: null
    },
    _currentBuffer = null,
    _batchBufferPool = new cc.SimplePool(),
    _orderDirtyInFrame = false,
    _bufferError = false,
    _prevRenderCmds = [],
    _quadIndexBuffer = {
        buffer: null,
        maxQuads: 0
    };
function updateQuadIndexBuffer (numQuads) {
    if (!_quadIndexBuffer.buffer) {
        return;
    }
    var gl = cc._renderContext;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _quadIndexBuffer.buffer);
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
    _quadIndexBuffer.maxQuads = numQuads;
}
function getQuadIndexBuffer (numQuads) {
    if (_quadIndexBuffer.buffer === null) {
        _quadIndexBuffer.buffer = cc._renderContext.createBuffer();
    }
    if (_quadIndexBuffer.maxQuads < numQuads) {
        updateQuadIndexBuffer(numQuads);
    }
    return _quadIndexBuffer.buffer;
}
function createVirtualBuffer (buffer, vertexOffset, totalBufferSize, count, data) {
    var float32View, uint32View;
    if (data) {
        float32View = new Float32Array(data, vertexOffset, totalBufferSize / 4);
        uint32View = new Uint32Array(data, vertexOffset, totalBufferSize / 4);
    }
    else {
        float32View = new Float32Array(totalBufferSize / 4);
        uint32View = new Uint32Array(float32View.buffer);
    }
    var vBuf = {
        buffer: buffer,
        float32View: float32View,
        uint32View: uint32View,
        vertexOffset: vertexOffset,
        totalBufferSize: totalBufferSize,
        count: count,
        valid: true
    };
    return vBuf;
}
return {
    mat4Identity: null,
    childrenOrderDirty: true,
    assignedZ: 0,
    assignedZStep: 1/10000,
    _transformNodePool: [],
    _renderCmds: [],
    _isCacheToBufferOn: false,
    _cacheToBufferCmds: {},
    _cacheInstanceIds: [],
    _currentID: 0,
    _clearColor: cc.color(),
    init: function () {
        this.mat4Identity = new cc.math.Matrix4();
        this.mat4Identity.identity();
        getQuadIndexBuffer(1000);
    },
    requestBuffer: function (size) {
        var i, len = _gbuffers.length, buffer,
            gl = cc._renderContext,
            result;
        for (i = 0; i < len; ++i) {
            buffer = _gbuffers[i];
            if (buffer.gl === gl) {
                result = buffer.requestBuffer(size);
                if (result) {
                    return result;
                }
            }
        }
        if (!result) {
            buffer = new GlobalVertexBuffer(gl);
            _gbuffers.push(buffer);
            result = buffer.requestBuffer(size);
        }
        if (!result) {
            cc.error('Request WebGL buffer failed');
        }
        return result;
    },
    getRenderCmd: function (renderableObject) {
        return renderableObject._createRenderCmd();
    },
    _turnToCacheMode: function (renderTextureID) {
        this._isCacheToBufferOn = true;
        renderTextureID = renderTextureID || 0;
        this._cacheToBufferCmds[renderTextureID] = [];
        this._cacheInstanceIds.push(renderTextureID);
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
        var locCmds = this._cacheToBufferCmds[renderTextureId], i, len;
        var ctx = cc._renderContext;
        for (i = 0, len = _gbuffers.length; i < len; ++i) {
            _gbuffers[i].update();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        for (i = 0, len = locCmds.length; i < len; i++) {
            locCmds[i].rendering(ctx);
        }
        this._removeCache(renderTextureId);
        var locIDs = this._cacheInstanceIds;
        if (locIDs.length === 0)
            this._isCacheToBufferOn = false;
        else
            this._currentID = locIDs[locIDs.length - 1];
    },
    resetFlag: function () {
        if (this.childrenOrderDirty) {
            _orderDirtyInFrame = true;
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
        if (CACHING_BUFFER) {
            var locCmds = this._renderCmds;
            var i, len = locCmds.length, cmd;
            for (i = 0; i < len; ++i) {
                cmd = locCmds[i];
                cmd._currId = -1;
                _prevRenderCmds[i] = cmd;
            }
            _prevRenderCmds.length = len;
        }
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
                cmd._currId = this._renderCmds.length;
                this._renderCmds.push(cmd);
            }
        }
    },
    createBatchBuffer: function (bufferSize) {
        var arrayBuffer = gl.createBuffer();
        this.initBatchBuffers(arrayBuffer, bufferSize);
        return {arrayBuffer: arrayBuffer, bufferSize: bufferSize};
    },
    initBatchBuffers: function (arrayBuffer, bufferSize) {
        gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, bufferSize, gl.DYNAMIC_DRAW);
    },
    getBatchBuffer: function(bufferSize)
    {
        if (_batchBufferPool.size() > 0) {
            var minSize = Number.MAX_VALUE;
            var minBufIndex = -1;
            var buf = _batchBufferPool.find(function (i, buf) {
                if (buf.bufferSize >= bufferSize) {
                    return true;
                }
                if (buf.bufferSize < minSize)
                {
                    minSize = buf.bufferSize;
                    minBufIndex = i;
                }
            }, function () {
                return minBufIndex;
            });
            if (buf) {
                this.initBatchBuffers(buf.arrayBuffer, bufferSize);
                buf.bufferSize = bufferSize;
                return buf;
            }
        }
        return this.createBatchBuffer(bufferSize);
    },
    _refreshVirtualBuffers: function () {
        var renderCmds = this._renderCmds,
            len = _prevRenderCmds.length,
            currLen = renderCmds.length,
            i = 0, j = 0, end, cmd1, cmd2, next,
            newBuf, currBuf,
            startId, count, size;
        for (; i < len; ++i) {
            cmd1 = _prevRenderCmds[i];
            currBuf = cmd1._vBuffer;
            matched = false;
            if (currBuf && currBuf.valid) {
                j = cmd1._currId;
                if (j < 0 || j >= currLen) {
                    cmd1._vBuffer = null;
                    continue;
                }
                cmd1.getBatchInfo(_batchedInfo);
                startId = i;
                count = 0;
                cmd2 = renderCmds[j];
                while (cmd1 && cmd1 === cmd2 && cmd1._vBuffer === currBuf) {
                    ++count;
                    ++j;
                    cmd1 = _prevRenderCmds[i+count];
                    cmd2 = renderCmds[j];
                }
                end = i + count;
                if (count <= 1) {
                    cmd1 = _prevRenderCmds[i];
                    cmd1._vBuffer = null;
                    if (cmd2) {
                        cmd2._vBuffer = null;
                    }
                    continue;
                }
                if (cmd2 && cmd2._supportBatch) {
                    cmd2.getBatchInfo(_currentInfo);
                    if (_currentInfo.texture === _batchedInfo.texture &&
                        _currentInfo.blendSrc === _batchedInfo.blendSrc &&
                        _currentInfo.blendDst === _batchedInfo.blendDst &&
                        _currentInfo.shader === _batchedInfo.shader) {
                        for (; i < end; ++i) {
                            _prevRenderCmds[i]._vBuffer = null;
                        }
                        i--;
                        continue;
                    }
                }
                if (currBuf.count === count) {
                    i = i + count - 1;
                }
                else if (count > 1) {
                    cmd1 = _prevRenderCmds[i];
                    size = count * cmd1.bytesPerUnit;
                    newBuf = createVirtualBuffer(currBuf.buffer,
                                                 cmd1._vertexOffset * 4,
                                                 size,
                                                 count,
                                                 currBuf.float32View.buffer);
                    for (; i < end; ++i) {
                        _prevRenderCmds[i]._vBuffer = newBuf;
                    }
                    i--;
                }
            }
        }
        len = renderCmds.length;
        for (i = 0; i < len; ++i) {
            cmd1 = renderCmds[i];
            if (cmd1._vBuffer) {
                continue;
            }
            next = renderCmds[i+1];
            if (cmd1._supportBatch && next && next._supportBatch) {
                count = this._forwardBatch(i);
                if (count > 1) {
                    i += count - 1;
                    continue;
                }
            }
        }
        _prevRenderCmds.length = 0;
        _bufferError = false;
    },
    _forwardCheck: function (first) {
        var renderCmds = this._renderCmds,
            cmd = renderCmds[first],
            last = first, length = renderCmds.length,
            vbuffer = cmd._vBuffer;
        cmd.getBatchInfo(_batchedInfo);
        _currentBuffer = null;
        if (cmd._vertexOffset !== vbuffer.vertexOffset || !vbuffer.valid || !vbuffer.buffer) {
            _bufferError = true;
            return 0;
        }
        var vertexBuffer;
        for (; last < length; ++last) {
            cmd = renderCmds[last];
            if (vbuffer !== cmd._vBuffer) {
                break;
            }
            if (cmd._bufferDirty) {
                if (!vertexBuffer) {
                    vertexBuffer = vbuffer;
                    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.buffer.arrayBuffer);
                }
                cmd.batchVertexBuffer(vertexBuffer.float32View, vertexBuffer.uint32View, cmd._vertexOffset);
                cmd._bufferDirty = false;
            }
        }
        if (vertexBuffer) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertexBuffer.float32View);
        }
        var size = last - first;
        if (vbuffer.count === size) {
            _currentBuffer = vbuffer;
            return size;
        }
        else {
            for (last = first; last < first + size; ++last) {
                cmd = renderCmds[last];
                cmd._vBuffer = null;
            }
            _bufferError = true;
            return 0;
        }
    },
    _forwardBatch: function (first) {
        var renderCmds = this._renderCmds,
            cmd = renderCmds[first],
            last = first + 1, length = renderCmds.length;
        if (!cmd || !cmd._supportBatch)
            return 0;
        cmd.getBatchInfo(_batchedInfo);
        if (!_batchedInfo.texture)
            return 0;
        var totalBufferSize = cmd.bytesPerUnit;
        cmd = renderCmds[last];
        while (cmd) {
            if (cmd._supportBatch) {
                cmd.getBatchInfo(_currentInfo);
            }
            else {
                break;
            }
            if (_currentInfo.texture !== _batchedInfo.texture ||
                _currentInfo.blendSrc !== _batchedInfo.blendSrc ||
                _currentInfo.blendDst !== _batchedInfo.blendDst ||
                _currentInfo.shader !== _batchedInfo.shader) {
                break;
            }
            else {
                totalBufferSize += cmd.bytesPerUnit;
            }
            ++last;
            cmd = renderCmds[last];
        }
        var count = last - first;
        if (count <= 1) {
            return count;
        }
        var buffer = this.getBatchBuffer(totalBufferSize);
        var vbuffer = createVirtualBuffer(buffer,
                                          0,
                                          totalBufferSize,
                                          count);
        _currentBuffer = vbuffer;
        var uploadBuffer = vbuffer.float32View;
        var vertexDataOffset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer.buffer.arrayBuffer);
        var i;
        for (i = first; i < last; ++i) {
            cmd = renderCmds[i];
            cmd.batchVertexBuffer(uploadBuffer, vbuffer.uint32View, vertexDataOffset);
            if (CACHING_BUFFER) {
                cmd._vBuffer = vbuffer;
                cmd._vertexOffset = vertexDataOffset;
            }
            if (cmd._savedDirtyFlag) {
                cmd._savedDirtyFlag = false;
            }
            vertexDataOffset += cmd.vertexBytesPerUnit / 4;
        }
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, uploadBuffer);
        if (!CACHING_BUFFER) {
            _batchBufferPool.put(buffer);
        }
        return count;
    },
    _batchRendering: function () {
        var texture = _batchedInfo.texture;
        var shader = _batchedInfo.shader;
        var count = _currentBuffer.count;
        var bytesPerRow = 16;
        shader.use();
        shader._updateProjectionUniform();
        cc.glBlendFunc(_batchedInfo.blendSrc, _batchedInfo.blendDst);
        cc.glBindTexture2DN(0, texture);
        gl.bindBuffer(gl.ARRAY_BUFFER, _currentBuffer.buffer.arrayBuffer);
        gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_COLOR);
        gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_TEX_COORDS);
        var vertexOffset = _currentBuffer.vertexOffset;
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, vertexOffset);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, vertexOffset + 12);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 24, vertexOffset + 16);
        var elemBuffer = getQuadIndexBuffer(count);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
        gl.drawElements(gl.TRIANGLES, count * 6, gl.UNSIGNED_SHORT, 0);
        cc.g_NumberOfDraws++;
    },
    rendering: function (ctx) {
        var locCmds = this._renderCmds,
            i, len, cmd, next, batchCount,
            context = ctx || cc._renderContext;
        for (i = 0, len = _gbuffers.length; i < len; ++i) {
            _gbuffers[i].update();
        }
        if (ACTIVATE_AUTO_BATCH && (_orderDirtyInFrame || _bufferError)) {
            this._refreshVirtualBuffers();
        }
        context.bindBuffer(gl.ARRAY_BUFFER, null);
        for (i = 0, len = locCmds.length; i < len; ++i) {
            cmd = locCmds[i];
            next = locCmds[i+1];
            if (ACTIVATE_AUTO_BATCH) {
                if (cmd._vBuffer) {
                    batchCount = this._forwardCheck(i);
                    if (batchCount > 1) {
                        this._batchRendering();
                        i += batchCount - 1;
                        continue;
                    }
                }
            }
            cmd.rendering(context);
        }
        if (_orderDirtyInFrame) {
            _orderDirtyInFrame = false;
        }
    }
};
})();
(function() {
    cc.Node.WebGLRenderCmd = function (renderable) {
        cc.Node.RenderCmd.call(this, renderable);
        var mat4 = new cc.math.Matrix4(), mat = mat4.mat;
        mat[2] = mat[3] = mat[6] = mat[7] = mat[8] = mat[9] = mat[11] = mat[14] = 0.0;
        mat[10] = mat[15] = 1.0;
        this._transform4x4 = mat4;
        this._stackMatrix = new cc.math.Matrix4();
        this._shaderProgram = null;
        this._camera = null;
        this._currId = -1;
    };
    var proto = cc.Node.WebGLRenderCmd.prototype = Object.create(cc.Node.RenderCmd.prototype);
    proto.constructor = cc.Node.WebGLRenderCmd;
    proto._updateColor = function(){};
    proto.visit = function (parentCmd) {
        var node = this._node;
        if (!node._visible)
            return;
        parentCmd = parentCmd || this.getParentRenderCmd();
        if (node._parent && node._parent._renderCmd)
            this._curLevel = node._parent._renderCmd._curLevel + 1;
        var currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        this._syncStatus(parentCmd);
        currentStack.top = this._stackMatrix;
        this.visitChildren();
        currentStack.top = currentStack.stack.pop();
    };
    proto.transform = function (parentCmd, recursive) {
        var t4x4 = this._transform4x4, stackMatrix = this._stackMatrix, node = this._node;
        parentCmd = parentCmd || this.getParentRenderCmd();
        var parentMatrix = (parentCmd ? parentCmd._stackMatrix : cc.current_stack.top);
        var trans = this.getNodeToParentTransform();
        this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.transformDirty ^ this._dirtyFlag;
        var t4x4Mat = t4x4.mat;
        t4x4Mat[0] = trans.a;
        t4x4Mat[4] = trans.c;
        t4x4Mat[12] = trans.tx;
        t4x4Mat[1] = trans.b;
        t4x4Mat[5] = trans.d;
        t4x4Mat[13] = trans.ty;
        cc.kmMat4Multiply(stackMatrix, parentMatrix, t4x4);
        t4x4Mat[14] = node._vertexZ;
        if (node._camera !== null && !(node.grid !== null && node.grid.isActive())) {
            var apx = this._anchorPointInPoints.x, apy = this._anchorPointInPoints.y;
            var translate = (apx !== 0.0 || apy !== 0.0);
            if (translate){
                if(!cc.SPRITEBATCHNODE_RENDER_SUBPIXEL) {
                    apx = 0 | apx;
                    apy = 0 | apy;
                }
                var translation = cc.math.Matrix4.createByTranslation(apx, apy, 0, t4x4);
                stackMatrix.multiply(translation);
                node._camera._locateForRenderer(stackMatrix);
                translation = cc.math.Matrix4.createByTranslation(-apx, -apy, 0, translation);
                stackMatrix.multiply(translation);
                t4x4.identity();
            } else {
                node._camera._locateForRenderer(stackMatrix);
            }
        }
        if (!recursive || !node._children) {
            return;
        }
        var i, len, locChildren = node._children;
        for(i = 0, len = locChildren.length; i< len; i++){
            locChildren[i]._renderCmd.transform(this, recursive);
        }
    };
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
        var _t = this;
        _t._squareVerticesAB = new ArrayBuffer(32);
        _t._squareColorsAB = new ArrayBuffer(16);
        var locSquareVerticesAB = _t._squareVerticesAB, locSquareColorsAB = _t._squareColorsAB;
        var locVertex2FLen = cc.Vertex2F.BYTES_PER_ELEMENT, locColorLen = cc.Color.BYTES_PER_ELEMENT;
        _t._squareVertices = [new cc.Vertex2F(0, 0, locSquareVerticesAB, 0),
            new cc.Vertex2F(0, 0, locSquareVerticesAB, locVertex2FLen),
            new cc.Vertex2F(0, 0, locSquareVerticesAB, locVertex2FLen * 2),
            new cc.Vertex2F(0, 0, locSquareVerticesAB, locVertex2FLen * 3)];
        _t._squareColors = [cc.color(0, 0, 0, 255, locSquareColorsAB, 0),
            cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen),
            cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen * 2),
            cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen * 3)];
        _t._verticesFloat32Buffer = cc._renderContext.createBuffer();
        _t._colorsUint8Buffer = cc._renderContext.createBuffer();
    };
    var proto = cc.LayerColor.WebGLRenderCmd.prototype = Object.create(cc.Layer.WebGLRenderCmd.prototype);
    proto.constructor = cc.LayerColor.WebGLRenderCmd;
    proto.rendering = function (ctx) {
        var context = ctx || cc._renderContext;
        var node = this._node;
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
        context.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        context.enableVertexAttribArray(cc.VERTEX_ATTRIB_COLOR);
        cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
        context.bindBuffer(context.ARRAY_BUFFER, this._verticesFloat32Buffer);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, context.FLOAT, false, 0, 0);
        context.bindBuffer(context.ARRAY_BUFFER, this._colorsUint8Buffer);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, context.UNSIGNED_BYTE, true, 0, 0);
        context.drawArrays(context.TRIANGLE_STRIP, 0, this._squareVertices.length);
    };
    proto._updateSquareVertices = function(size, height){
        var locSquareVertices = this._squareVertices;
        if (height === undefined) {
            locSquareVertices[1].x = size.width;
            locSquareVertices[2].y = size.height;
            locSquareVertices[3].x = size.width;
            locSquareVertices[3].y = size.height;
        } else {
            locSquareVertices[1].x = size;
            locSquareVertices[2].y = height;
            locSquareVertices[3].x = size;
            locSquareVertices[3].y = height;
        }
        this._bindLayerVerticesBufferData();
    };
    proto._updateSquareVerticesWidth = function(width){
        var locSquareVertices = this._squareVertices;
        locSquareVertices[1].x = width;
        locSquareVertices[3].x = width;
        this._bindLayerVerticesBufferData();
    };
    proto._updateSquareVerticesHeight = function(height){
        var locSquareVertices = this._squareVertices;
        locSquareVertices[2].y = height;
        locSquareVertices[3].y = height;
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
        glContext.bufferData(glContext.ARRAY_BUFFER, this._squareVerticesAB, glContext.STATIC_DRAW);
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
    cc.inject(cc.LayerGradient.RenderCmd, proto);
    proto.constructor = cc.LayerGradient.WebGLRenderCmd;
    proto._syncStatus = function (parentCmd) {
        var flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        var parentNode = parentCmd ? parentCmd._node : null;
        if(parentNode && parentNode._cascadeColorEnabled && (parentCmd._dirtyFlag & flags.colorDirty))
            locFlag |= flags.colorDirty;
        if(parentNode && parentNode._cascadeOpacityEnabled && (parentCmd._dirtyFlag & flags.opacityDirty))
            locFlag |= flags.opacityDirty;
        if(parentCmd && (parentCmd._dirtyFlag & flags.transformDirty))
            locFlag |= flags.transformDirty;
        var colorDirty = locFlag & flags.colorDirty,
            opacityDirty = locFlag & flags.opacityDirty;
        this._dirtyFlag = locFlag;
        if (colorDirty)
            this._syncDisplayColor();
        if (opacityDirty)
            this._syncDisplayOpacity();
        this.transform(parentCmd);
        if (colorDirty || opacityDirty || (locFlag & flags.gradientDirty)){
            this._updateColor();
        }
    };
    proto._updateColor = function(){
        this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.gradientDirty ^ this._dirtyFlag;
        var node = this._node, stops = node._colorStops;
        if(!stops || stops.length < 2)
            return;
        this._clippingRectDirty = true;
        var stopsLen = stops.length, verticesLen = stopsLen * 2, i, contentSize = node._contentSize;
        this._squareVerticesAB = new ArrayBuffer(verticesLen * 8);
        this._squareColorsAB = new ArrayBuffer(verticesLen * 4);
        var locVertices = this._squareVertices, locColors = this._squareColors;
        locVertices.length = 0;
        locColors.length = 0;
        var locSquareVerticesAB = this._squareVerticesAB, locSquareColorsAB = this._squareColorsAB;
        var locVertex2FLen = cc.Vertex2F.BYTES_PER_ELEMENT, locColorLen = cc.Color.BYTES_PER_ELEMENT;
        for(i = 0; i < verticesLen; i++){
            locVertices.push(new cc.Vertex2F(0, 0, locSquareVerticesAB, locVertex2FLen * i));
            locColors.push(cc.color(0, 0, 0, 255, locSquareColorsAB, locColorLen * i))
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
            var p1 = cc.pointApplyAffineTransform(contentSize.width - locAnchor.x, y - locAnchor.y, transMat);
            locVertices[i * 2 + 1].x = p1.x;
            locVertices[i * 2 + 1].y = p1.y;
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
        this._bindLayerVerticesBufferData();
        this._bindLayerColorsBufferData();
    };
    proto.rendering = function (ctx) {
        var context = ctx || cc._renderContext, node = this._node;
        var clippingRect = this._getClippingRect();
        context.enable(context.SCISSOR_TEST);
        cc.view.setScissorInPoints(clippingRect.x, clippingRect.y, clippingRect.width, clippingRect.height);
        this._shaderProgram.use();
        this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
        context.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
        context.enableVertexAttribArray(cc.VERTEX_ATTRIB_COLOR);
        cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
        context.bindBuffer(context.ARRAY_BUFFER, this._verticesFloat32Buffer);
        context.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, context.FLOAT, false, 0, 0);
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
    var _resetPointers = true;
    cc.Sprite.WebGLRenderCmd = function (renderable) {
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
        this._vertices = [
            {x: 0, y: 0, z: 0},
            {x: 0, y: 0, z: 0},
            {x: 0, y: 0, z: 0},
            {x: 0, y: 0, z: 0}
        ];
        var length = this.vertexBytesPerUnit;
        var bufInfo = cc.renderer.requestBuffer(length);
        this._buffer = bufInfo.buffer;
        this._bufferOffset = bufInfo.offset;
        this._quad = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._buffer.data, this._bufferOffset);
        this._float32View = new Float32Array(this._buffer.data, this._bufferOffset, length / 4);
        this._uint32View = new Uint32Array(this._buffer.data, this._bufferOffset, length / 4);
        this._dirty = false;
        this._bufferDirty = false;
        this._recursiveDirty = false;
        this._vBuffer = null;
        this._vertexOffset = 0;
        if (!proto.batchShader) {
            proto.batchShader = cc.shaderCache.programForKey(cc.SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST);
        }
    };
    var proto = cc.Sprite.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.Sprite.WebGLRenderCmd;
    proto.vertexBytesPerUnit = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;
    proto.bytesPerUnit = proto.vertexBytesPerUnit;
    proto.indicesPerUnit = 6;
    proto.verticesPerUnit = 4;
    proto._supportBatch = true;
    proto.batchShader = null;
    proto.getBatchInfo = function (info) {
        info.texture = this._node._texture;
        info.blendSrc = this._node._blendFunc.src;
        info.blendDst = this._node._blendFunc.dst;
        info.shader = this.batchShader;
    };
    proto._invalidBatch = function () {
        if (this._vBuffer) {
            this._vBuffer.valid = false;
        }
    };
    proto.updateBuffer = function () {
        if (!this._buffer) {
            var length = this.vertexBytesPerUnit;
            var bufInfo = cc.renderer.requestBuffer(length);
            this._buffer = bufInfo.buffer;
            this._bufferOffset = bufInfo.offset;
            this._quad = new cc.V3F_C4B_T2F_Quad(null, null, null, null, this._buffer.data, this._bufferOffset);
            this._float32View = new Float32Array(this._quad.arrayBuffer, this._bufferOffset, length / 4);
            this._uint32View = new Uint32Array(this._quad.arrayBuffer, this._bufferOffset, length / 4);
            this._setTextureCoords(this._node._rect);
            this._updateColor();
            this._updateVertexBuffer();
        }
    };
    proto.freeBuffer = function () {
        if (this._buffer) {
            this._buffer.freeBuffer(this._bufferOffset, this.vertexBytesPerUnit);
            this._buffer = null;
            this._bufferOffset = 0;
            this._quad = null;
            this._float32View = null;
        }
    };
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
    proto._init = function () {
        this.updateBuffer();
        var tempColor = {r: 255, g: 255, b: 255, a: 255}, quad = this._quad;
        quad.bl.colors = tempColor;
        quad.br.colors = tempColor;
        quad.tl.colors = tempColor;
        quad.tr.colors = tempColor;
        this._bufferDirty = true;
        this._buffer.setDirty();
    };
    proto._resetForBatchNode = function () {
        var node = this._node;
        var x1 = node._offsetPosition.x;
        var y1 = node._offsetPosition.y;
        var x2 = x1 + node._rect.width;
        var y2 = y1 + node._rect.height;
        var vertices = this._vertices;
        vertices[0].x = x1; vertices[0].y = y2;
        vertices[1].x = x1; vertices[1].y = y1;
        vertices[2].x = x2; vertices[2].y = y2;
        vertices[3].x = x2; vertices[3].y = y1;
        this._bufferDirty = true;
        if (this._buffer) {
            this._buffer.setDirty();
        }
    };
    proto.getQuad = function () {
        return this._quad;
    };
    proto._updateForSetSpriteFrame = function () {};
    proto._spriteFrameLoadedCallback = function (spriteFrame) {
        this.setTextureRect(spriteFrame.getRect(), spriteFrame.isRotated(), spriteFrame.getOriginalSize());
        this.dispatchEvent("load");
    };
    proto._textureLoadedCallback = function (sender) {
        var renderCmd = this._renderCmd;
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
    };
    proto._setTextureCoords = function (rect, needConvert) {
        if (needConvert === undefined)
            needConvert = true;
        if (needConvert)
            rect = cc.rectPointsToPixels(rect);
        var node = this._node, locQuad = this._quad;
        var tex = node._batchNode ? node.textureAtlas.texture : node._texture;
        if (!tex || !locQuad)
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
            locQuad.bl.texCoords.u = left;
            locQuad.bl.texCoords.v = top;
            locQuad.br.texCoords.u = left;
            locQuad.br.texCoords.v = bottom;
            locQuad.tl.texCoords.u = right;
            locQuad.tl.texCoords.v = top;
            locQuad.tr.texCoords.u = right;
            locQuad.tr.texCoords.v = bottom;
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
            locQuad.bl.texCoords.u = left;
            locQuad.bl.texCoords.v = bottom;
            locQuad.br.texCoords.u = right;
            locQuad.br.texCoords.v = bottom;
            locQuad.tl.texCoords.u = left;
            locQuad.tl.texCoords.v = top;
            locQuad.tr.texCoords.u = right;
            locQuad.tr.texCoords.v = top;
        }
        this._bufferDirty = true;
        this._buffer.setDirty();
    };
    proto._updateVertexBuffer = function () {
        if (this._buffer) {
            var mat = this._stackMatrix.mat,
                vertices = this._vertices,
                buffer = this._float32View,
                i, x, y, offset = 0,
                row = cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT / 16;
            for (i = 0; i < 4; ++i) {
                x = vertices[i].x;
                y = vertices[i].y;
                buffer[offset] = x * mat[0] + y * mat[4] + mat[12];
                buffer[offset+1] = x * mat[1] + y * mat[5] + mat[13];
                buffer[offset+2] = mat[14];
                offset += row;
            }
            this._bufferDirty = true;
            this._buffer.setDirty();
        }
    };
    proto.transform = function (parentCmd, recursive) {
        cc.Node.WebGLRenderCmd.prototype.transform.call(this, parentCmd, recursive);
        this._updateVertexBuffer();
        this._dirty = true;
        this._savedDirtyFlag = true;
    };
    proto._setColorDirty = function () {};
    proto._updateColor = function () {
        var locDisplayedColor = this._displayedColor, locDisplayedOpacity = this._displayedOpacity, node = this._node;
        var color4 = {r: locDisplayedColor.r, g: locDisplayedColor.g, b: locDisplayedColor.b, a: locDisplayedOpacity};
        if (node._opacityModifyRGB) {
            color4.r *= locDisplayedOpacity / 255.0;
            color4.g *= locDisplayedOpacity / 255.0;
            color4.b *= locDisplayedOpacity / 255.0;
        }
        var locQuad = this._quad;
        if (locQuad) {
            locQuad.bl.colors = color4;
            locQuad.br.colors = color4;
            locQuad.tl.colors = color4;
            locQuad.tr.colors = color4;
            this._buffer.setDirty();
        }
        if (node._batchNode) {
            if (node.atlasIndex !== cc.Sprite.INDEX_NOT_INITIALIZED) {
                node.textureAtlas.updateQuad(locQuad, node.atlasIndex);
            } else {
                this._dirty = true;
            }
        }
        this._bufferDirty = true;
    };
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
        this._invalidBatch();
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
            }
        }
        if (texture)
            this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_SPRITE_POSITION_TEXTURECOLORALPHATEST);
        else
            this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_SPRITE_POSITION_COLOR);
    };
    proto.updateTransform = function () {
        var _t = this, node = this._node;
        if (this._dirty) {
            var locQuad = _t._quad, locParent = node._parent;
            if (!node._visible || ( locParent && locParent !== node._batchNode && locParent._shouldBeHidden)) {
                locQuad.br.vertices = locQuad.tl.vertices = locQuad.tr.vertices = locQuad.bl.vertices = {x: 0, y: 0, z: 0};
                node._shouldBeHidden = true;
            } else {
                node._shouldBeHidden = false;
                if(this._dirtyFlag !== 0){
                    this.updateStatus();
                    this._dirtyFlag = 0;
                }
                if (!locParent || locParent === node._batchNode) {
                    node._transformToBatch = _t.getNodeToParentTransform();
                } else {
                    node._transformToBatch = cc.affineTransformConcat(_t.getNodeToParentTransform(), locParent._transformToBatch);
                }
                var locTransformToBatch = node._transformToBatch;
                var rect = node._rect;
                var x1 = node._offsetPosition.x;
                var y1 = node._offsetPosition.y;
                var x2 = x1 + rect.width;
                var y2 = y1 + rect.height;
                var x = locTransformToBatch.tx;
                var y = locTransformToBatch.ty;
                var cr = locTransformToBatch.a;
                var sr = locTransformToBatch.b;
                var cr2 = locTransformToBatch.d;
                var sr2 = -locTransformToBatch.c;
                var ax = x1 * cr - y1 * sr2 + x;
                var ay = x1 * sr + y1 * cr2 + y;
                var bx = x2 * cr - y1 * sr2 + x;
                var by = x2 * sr + y1 * cr2 + y;
                var cx = x2 * cr - y2 * sr2 + x;
                var cy = x2 * sr + y2 * cr2 + y;
                var dx = x1 * cr - y2 * sr2 + x;
                var dy = x1 * sr + y2 * cr2 + y;
                var locVertexZ = node._vertexZ;
                if (!cc.SPRITEBATCHNODE_RENDER_SUBPIXEL) {
                    ax = 0 | ax;
                    ay = 0 | ay;
                    bx = 0 | bx;
                    by = 0 | by;
                    cx = 0 | cx;
                    cy = 0 | cy;
                    dx = 0 | dx;
                    dy = 0 | dy;
                }
                locQuad.bl.vertices = {x: ax, y: ay, z: locVertexZ};
                locQuad.br.vertices = {x: bx, y: by, z: locVertexZ};
                locQuad.tl.vertices = {x: dx, y: dy, z: locVertexZ};
                locQuad.tr.vertices = {x: cx, y: cy, z: locVertexZ};
            }
            node.textureAtlas.updateQuad(locQuad, node.atlasIndex);
            node._recursiveDirty = false;
            this._dirty = false;
        }
        if (node._hasChildren)
            node._arrayMakeObjectsPerformSelector(node._children, cc.Node._stateCallbackType.updateTransform);
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
    proto.needDraw = function () {
        return (this._buffer && this._node._texture);
    };
    proto.rendering = function (ctx) {
        var node = this._node, locTexture = node._texture;
        if (!this._buffer || (locTexture && (!locTexture._textureLoaded || !node._rect.width || !node._rect.height)) || !this._displayedOpacity)
            return;
        var gl = ctx || cc._renderContext;
        var program = this._shaderProgram;
        if (locTexture) {
            if (locTexture._textureLoaded) {
                program.use();
                program._updateProjectionUniform();
                cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
                cc.glBindTexture2DN(0, locTexture);
                var _bufferchanged = !gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer.vertexBuffer);
                if (_resetPointers || _bufferchanged) {
                    gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
                    gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_COLOR);
                    gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_TEX_COORDS);
                    gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, 0);
                    gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);
                    gl.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS, 2, gl.FLOAT, false, 24, 16);
                    _resetPointers = false;
                }
                gl.drawArrays(gl.TRIANGLE_STRIP, this._bufferOffset / (this.vertexBytesPerUnit/4), 4);
            }
        } else {
            program.use();
            program._updateProjectionUniform();
            cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer.vertexBuffer);
            gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_POSITION);
            gl.enableVertexAttribArray(cc.VERTEX_ATTRIB_COLOR);
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, 0);
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);
            gl.drawArrays(gl.TRIANGLE_STRIP, this._bufferOffset / (this.vertexBytesPerUnit/4), 4);
            _resetPointers = true;
        }
        cc.g_NumberOfDraws++;
        if (cc.SPRITE_DEBUG_DRAW === 0 && !node._showNode)
            return;
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.current_stack.stack.push(cc.current_stack.top);
        cc.current_stack.top = this._stackMatrix;
        if (cc.SPRITE_DEBUG_DRAW === 1 || node._showNode) {
            var vertices = this._vertices;
            var verticesG1 = [
                cc.p(vertices[0].x, vertices[0].y),
                cc.p(vertices[2].x, vertices[2].y),
                cc.p(vertices[3].x, vertices[3].y),
                cc.p(vertices[1].x, vertices[1].y)
            ];
            cc._drawingUtil.drawPoly(verticesG1, 4, true);
        } else if (cc.SPRITE_DEBUG_DRAW === 2) {
            var drawRectG2 = node.getTextureRect();
            var offsetPixG2 = node.getOffsetPosition();
            var verticesG2 = [cc.p(offsetPixG2.x, offsetPixG2.y), cc.p(offsetPixG2.x + drawRectG2.width, offsetPixG2.y),
                cc.p(offsetPixG2.x + drawRectG2.width, offsetPixG2.y + drawRectG2.height), cc.p(offsetPixG2.x, offsetPixG2.y + drawRectG2.height)];
            cc._drawingUtil.drawPoly(verticesG2, 4, true);
        }
        cc.current_stack.top = cc.current_stack.stack.pop();
    };
    proto.batchVertexBuffer = function (f32buffer, int32buffer, vertexDataOffset) {
        var float32Data = this._float32View;
        var uint32Data = this._uint32View;
        var i, len = float32Data.length, colorId = 3;
        for (i = 0; i < len; ++i) {
            if (i === colorId) {
                int32buffer[vertexDataOffset + i] = uint32Data[i];
                colorId += 6;
            }
            else {
                f32buffer[vertexDataOffset + i] = float32Data[i];
            }
        }
    };
})();
(function() {
    cc.LabelTTF.WebGLRenderCmd = function (renderable) {
        cc.Sprite.WebGLRenderCmd.call(this, renderable);
        cc.LabelTTF.CacheRenderCmd.call(this);
        this.setShaderProgram(cc.shaderCache.programForKey(cc.LabelTTF._SHADER_PROGRAM));
    };
    var proto = cc.LabelTTF.WebGLRenderCmd.prototype = Object.create(cc.Sprite.WebGLRenderCmd.prototype);
    proto._supportBatch = false;
    cc.inject(cc.LabelTTF.CacheRenderCmd.prototype, proto);
    proto.constructor = cc.LabelTTF.WebGLRenderCmd;
    proto._updateColor = function () {
        this._updateTexture();
        cc.Sprite.WebGLRenderCmd.prototype._updateColor.call(this);
    };
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
