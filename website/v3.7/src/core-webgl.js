if (cc._renderType === cc._RENDER_TYPE_WEBGL) {
    (function () {
        cc.DirectorDelegate = cc.Class.extend({
            updateProjection: function () {
            }
        });
        var _p = cc.Director.prototype;
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
            var loc_gl = cc._renderContext;
            if (on) {
                loc_gl.clearDepth(1.0);
                loc_gl.enable(loc_gl.DEPTH_TEST);
                loc_gl.depthFunc(loc_gl.LEQUAL);
            } else {
                loc_gl.disable(loc_gl.DEPTH_TEST);
            }
        };
        _p.setOpenGLView = function (openGLView) {
            var _t = this;
            _t._winSizeInPoints.width = cc._canvas.width;
            _t._winSizeInPoints.height = cc._canvas.height;
            _t._openGLView = openGLView || cc.view;
            var conf = cc.configuration;
            conf.gatherGPUInfo();
            conf.dumpInfo();
            _t._createStatsLabel();
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
        _p._createStatsLabel = function () {
            var _t = this;
            if (!cc.LabelAtlas){
                _t._createStatsLabelForCanvas();
                return
            }
            if ((cc.Director._fpsImageLoaded == null) || (cc.Director._fpsImageLoaded === false))
                return;
            var texture = new cc.Texture2D();
            texture.initWithElement(cc.Director._fpsImage);
            texture.handleLoadedTexture();
            var factor = cc.view.getDesignResolutionSize().height / 320.0;
            if (factor === 0)
                factor = _t._winSizeInPoints.height / 320.0;
            var tmpLabel = new cc.LabelAtlas();
            tmpLabel._setIgnoreContentScaleFactor(true);
            tmpLabel.initWithString("00.0", texture, 12, 32, '.');
            tmpLabel.scale = factor;
            _t._FPSLabel = tmpLabel;
            tmpLabel = new cc.LabelAtlas();
            tmpLabel._setIgnoreContentScaleFactor(true);
            tmpLabel.initWithString("0.000", texture, 12, 32, '.');
            tmpLabel.scale = factor;
            _t._SPFLabel = tmpLabel;
            tmpLabel = new cc.LabelAtlas();
            tmpLabel._setIgnoreContentScaleFactor(true);
            tmpLabel.initWithString("000", texture, 12, 32, '.');
            tmpLabel.scale = factor;
            _t._drawsLabel = tmpLabel;
            var locStatsPosition = cc.DIRECTOR_STATS_POSITION;
            _t._drawsLabel.setPosition(locStatsPosition.x, 34 * factor + locStatsPosition.y);
            _t._SPFLabel.setPosition(locStatsPosition.x, 17 * factor + locStatsPosition.y);
            _t._FPSLabel.setPosition(locStatsPosition);
        };
        _p._createStatsLabelForCanvas = function () {
            var _t = this;
            var fontSize = 0;
            if (_t._winSizeInPoints.width > _t._winSizeInPoints.height)
                fontSize = 0 | (_t._winSizeInPoints.height / 320 * 24);
            else
                fontSize = 0 | (_t._winSizeInPoints.width / 320 * 24);
            _t._FPSLabel = new cc.LabelTTF("000.0", "Arial", fontSize);
            _t._SPFLabel = new cc.LabelTTF("0.000", "Arial", fontSize);
            _t._drawsLabel = new cc.LabelTTF("0000", "Arial", fontSize);
            var locStatsPosition = cc.DIRECTOR_STATS_POSITION;
            _t._drawsLabel.setPosition(_t._drawsLabel.width / 2 + locStatsPosition.x, _t._drawsLabel.height * 5 / 2 + locStatsPosition.y);
            _t._SPFLabel.setPosition(_t._SPFLabel.width / 2 + locStatsPosition.x, _t._SPFLabel.height * 3 / 2 + locStatsPosition.y);
            _t._FPSLabel.setPosition(_t._FPSLabel.width / 2 + locStatsPosition.x, _t._FPSLabel.height / 2 + locStatsPosition.y);
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
            cc._renderContext.clearColor(0.0, 0.0, 0.0, 1.0);
        };
    })();
}
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
        if(cc._renderType === cc._RENDER_TYPE_CANVAS)
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
        if(!dict) throw "Please load the resource first : " + url;
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
cc.rendererWebGL = {
    childrenOrderDirty: true,
    _transformNodePool: [],
    _renderCmds: [],
    _isCacheToBufferOn: false,
    _cacheToBufferCmds: {},
    _cacheInstanceIds: [],
    _currentID: 0,
    getRenderCmd: function (renderableObject) {
        return renderableObject._createRenderCmd();
    },
    rendering: function (ctx) {
        var locCmds = this._renderCmds,
            i,
            len;
        var context = ctx || cc._renderContext;
        for (i = 0, len = locCmds.length; i < len; i++) {
            locCmds[i].rendering(context);
        }
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
    _renderingToBuffer: function (renderTextureId) {
        renderTextureId = renderTextureId || this._currentID;
        var locCmds = this._cacheToBufferCmds[renderTextureId], i, len;
        var ctx = cc._renderContext, locIDs = this._cacheInstanceIds;
        for (i = 0, len = locCmds.length; i < len; i++) {
            locCmds[i].rendering(ctx);
        }
        locCmds.length = 0;
        delete this._cacheToBufferCmds[renderTextureId];
        cc.arrayRemoveObject(locIDs, renderTextureId);
        if (locIDs.length === 0)
            this._isCacheToBufferOn = false;
        else
            this._currentID = locIDs[locIDs.length - 1];
    },
    resetFlag: function () {
        this.childrenOrderDirty = false;
        this._transformNodePool.length = 0;
    },
    transform: function () {
        var locPool = this._transformNodePool;
        locPool.sort(this._sortNodeByLevelAsc);
        for (var i = 0, len = locPool.length; i < len; i++) {
             locPool[i].updateStatus();
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
    pushRenderCommand: function (cmd) {
        if(!cmd._needDraw)
            return;
        if (this._isCacheToBufferOn) {
            var currentId = this._currentID, locCmdBuffer = this._cacheToBufferCmds;
            var cmdList = locCmdBuffer[currentId];
            if (cmdList.indexOf(cmd) === -1)
                cmdList.push(cmd);
        } else {
            if (this._renderCmds.indexOf(cmd) === -1)
                this._renderCmds.push(cmd);
        }
    }
};
if (cc._renderType === cc._RENDER_TYPE_WEBGL)
    cc.renderer = cc.rendererWebGL;
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
    };
    var proto = cc.Node.WebGLRenderCmd.prototype = Object.create(cc.Node.RenderCmd.prototype);
    proto.constructor = cc.Node.WebGLRenderCmd;
    proto.getNodeToParentTransform = function () {
        var node = this._node;
        if (node._usingNormalizedPosition && node._parent) {
            var conSize = node._parent._contentSize;
            node._position.x = node._normalizedPosition.x * conSize.width;
            node._position.y = node._normalizedPosition.y * conSize.height;
            node._normalizedPositionDirty = false;
        }
        if (this._dirtyFlag & cc.Node._dirtyFlags.transformDirty) {
            var x = node._position.x, y = node._position.y;
            var apx = this._anchorPointInPoints.x, napx = -apx;
            var apy = this._anchorPointInPoints.y, napy = -apy;
            var scx = node._scaleX, scy = node._scaleY;
            var rotationRadiansX = node._rotationX * 0.017453292519943295;
            var rotationRadiansY = node._rotationY * 0.017453292519943295;
            if (node._ignoreAnchorPointForPosition) {
                x += apx;
                y += apy;
            }
            var cx = 1, sx = 0, cy = 1, sy = 0;
            if (node._rotationX !== 0 || node._rotationY !== 0) {
                cx = Math.cos(-rotationRadiansX);
                sx = Math.sin(-rotationRadiansX);
                cy = Math.cos(-rotationRadiansY);
                sy = Math.sin(-rotationRadiansY);
            }
            var needsSkewMatrix = ( node._skewX || node._skewY );
            if (!needsSkewMatrix && (apx !== 0 || apy !== 0)) {
                x += cy * napx * scx + -sx * napy * scy;
                y += sy * napx * scx + cx * napy * scy;
            }
            var t = this._transform;
            t.a = cy * scx;
            t.b = sy * scx;
            t.c = -sx * scy;
            t.d = cx * scy;
            t.tx = x;
            t.ty = y;
            if (needsSkewMatrix) {
                t = cc.affineTransformConcat({a: 1.0, b: Math.tan(cc.degreesToRadians(node._skewY)),
                    c: Math.tan(cc.degreesToRadians(node._skewX)), d: 1.0, tx: 0.0, ty: 0.0}, t);
                if (apx !== 0 || apy !== 0)
                    t = cc.affineTransformTranslate(t, napx, napy);
            }
            if (node._additionalTransformDirty) {
                t = cc.affineTransformConcat(t, node._additionalTransform);
                node._additionalTransformDirty = false;
            }
            this._transform = t;
        }
        return this._transform;
    };
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
        if(colorDirty || opacityDirty)
            this._updateColor();
        this.transform(parentCmd);
    };
    proto._updateColor = function(){};
    proto.visit = function (parentCmd) {
        var node = this._node;
        if (!node._visible)
            return;
        parentCmd = parentCmd || this.getParentRenderCmd();
        if (node._parent && node._parent._renderCmd)
            this._curLevel = node._parent._renderCmd._curLevel + 1;
        var i, currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        this._syncStatus(parentCmd);
        currentStack.top = this._stackMatrix;
        var locChildren = node._children;
        if (locChildren && locChildren.length > 0) {
            var childLen = locChildren.length;
            node.sortAllChildren();
            for (i = 0; i < childLen; i++) {
                if (locChildren[i] && locChildren[i]._localZOrder < 0)
                    locChildren[i]._renderCmd.visit(this);
                else
                    break;
            }
            cc.renderer.pushRenderCommand(this);
            for (; i < childLen; i++) {
                if (locChildren[i])
                    locChildren[i]._renderCmd.visit(this);
            }
        } else
            cc.renderer.pushRenderCommand(this);
        this._dirtyFlag = 0;
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
        t4x4Mat[14] = node._vertexZ;
        cc.kmMat4Multiply(stackMatrix, parentMatrix, t4x4);
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
        if(!recursive || !node._children || node._children.length === 0)
            return;
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
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR);
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
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR);
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
    cc.Sprite.WebGLRenderCmd = function (renderable) {
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
        this._quad = new cc.V3F_C4B_T2F_Quad();
        this._quadWebBuffer = cc._renderContext.createBuffer();
        this._quadDirty = true;
        this._dirty = false;
        this._recursiveDirty = false;
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
    proto._init = function () {
        var tempColor = {r: 255, g: 255, b: 255, a: 255}, quad = this._quad;
        quad.bl.colors = tempColor;
        quad.br.colors = tempColor;
        quad.tl.colors = tempColor;
        quad.tr.colors = tempColor;
        this._quadDirty = true;
    };
    proto._resetForBatchNode = function () {
        var node = this._node;
        var x1 = node._offsetPosition.x;
        var y1 = node._offsetPosition.y;
        var x2 = x1 + node._rect.width;
        var y2 = y1 + node._rect.height;
        var locQuad = this._quad;
        locQuad.bl.vertices = {x: x1, y: y1, z: 0};
        locQuad.br.vertices = {x: x2, y: y1, z: 0};
        locQuad.tl.vertices = {x: x1, y: y2, z: 0};
        locQuad.tr.vertices = {x: x2, y: y2, z: 0};
        this._quadDirty = true;
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
        renderCmd._quadDirty = true;
        this.dispatchEvent("load");
    };
    proto._setTextureCoords = function (rect, needConvert) {
        if (needConvert === undefined)
            needConvert = true;
        if (needConvert)
            rect = cc.rectPointsToPixels(rect);
        var node = this._node;
        var tex = node._batchNode ? node.textureAtlas.texture : node._texture;
        if (!tex)
            return;
        var atlasWidth = tex.pixelsWidth;
        var atlasHeight = tex.pixelsHeight;
        var left, right, top, bottom, tempSwap, locQuad = this._quad;
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
        this._quadDirty = true;
    };
    proto.transform = function(parentCmd, recursive){
        cc.Node.WebGLRenderCmd.prototype.transform.call(this, parentCmd, recursive);
        this._dirty = true;
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
        locQuad.bl.colors = color4;
        locQuad.br.colors = color4;
        locQuad.tl.colors = color4;
        locQuad.tr.colors = color4;
        if (node._batchNode) {
            if (node.atlasIndex !== cc.Sprite.INDEX_NOT_INITIALIZED) {
                node.textureAtlas.updateQuad(locQuad, node.atlasIndex)
            } else {
                this._dirty = true;
            }
        }
        this._quadDirty = true;
    };
    proto._updateBlendFunc = function () {
        if (this._batchNode) {
            cc.log(cc._LogInfos.Sprite__updateBlendFunc);
            return;
        }
        var node = this._node;
        if (!node._texture || !node._texture.hasPremultipliedAlpha()) {
            node._blendFunc.src = cc.SRC_ALPHA;
            node._blendFunc.dst = cc.ONE_MINUS_SRC_ALPHA;
            node.opacityModifyRGB = false;
        } else {
            node._blendFunc.src = cc.BLEND_SRC;
            node._blendFunc.dst = cc.BLEND_DST;
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
        }else{
            if(node._texture !== texture){
                node._textureLoaded = texture ? texture._textureLoaded : false;
                node._texture = texture;
                this._updateBlendFunc();
            }
        }
        if (texture)
            this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR);
        else
            this._shaderProgram = cc.shaderCache.programForKey(cc.SHADER_POSITION_COLOR);
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
    proto.rendering = function (ctx) {
        var node = this._node, locTexture = node._texture;
        if ((locTexture &&!locTexture._textureLoaded) || this._displayedOpacity === 0)
            return;
        var gl = ctx || cc._renderContext ;
        if (locTexture) {
            if (locTexture._textureLoaded) {
                this._shaderProgram.use();
                this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
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
        } else {
            this._shaderProgram.use();
            this._shaderProgram._setUniformForMVPMatrixWithMat4(this._stackMatrix);
            cc.glBlendFunc(node._blendFunc.src, node._blendFunc.dst);
            cc.glBindTexture2D(null);
            cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._quadWebBuffer);
            if (this._quadDirty) {
                gl.bufferData(gl.ARRAY_BUFFER, this._quad.arrayBuffer, gl.STATIC_DRAW);
                this._quadDirty = false;
            }
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 3, gl.FLOAT, false, 24, 0);
            gl.vertexAttribPointer(cc.VERTEX_ATTRIB_COLOR, 4, gl.UNSIGNED_BYTE, true, 24, 12);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        cc.g_NumberOfDraws++;
        if (cc.SPRITE_DEBUG_DRAW === 0 && !node._showNode)
            return;
        cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
        cc.current_stack.stack.push(cc.current_stack.top);
        cc.current_stack.top = this._stackMatrix;
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
        cc.current_stack.top = cc.current_stack.stack.pop();
    };
})();
(function() {
    cc.LabelTTF.WebGLRenderCmd = function (renderable) {
        cc.Sprite.WebGLRenderCmd.call(this, renderable);
        cc.LabelTTF.RenderCmd.call(this);
        this.setShaderProgram(cc.shaderCache.programForKey(cc.LabelTTF._SHADER_PROGRAM));
    };
    var proto = cc.LabelTTF.WebGLRenderCmd.prototype = Object.create(cc.Sprite.WebGLRenderCmd.prototype);
    cc.inject(cc.LabelTTF.RenderCmd.prototype, proto);
    proto.constructor = cc.LabelTTF.WebGLRenderCmd;
    proto._setColorsString = function () {
        this.setDirtyFlag(cc.Node._dirtyFlags.textDirty);
        var node = this._node;
        var locStrokeColor = node._strokeColor, locFontFillColor = node._textFillColor,
            locShadowColor = node._shadowColor || this._displayedColor;
        this._shadowColorStr = "rgba(" + (0 | locShadowColor.r) + "," + (0 | locShadowColor.g) + "," + (0 | locShadowColor.b) + "," + node._shadowOpacity + ")";
        this._fillColorStr = "rgba(" + (0 | locFontFillColor.r) + "," + (0 | locFontFillColor.g) + "," + (0 | locFontFillColor.b) + ", 1)";
        this._strokeColorStr = "rgba(" + (0 | locStrokeColor.r) + "," + (0 | locStrokeColor.g) + "," + (0 | locStrokeColor.b) + ", 1)";
    };
    proto.updateStatus = function () {
        var flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        var colorDirty = locFlag & flags.colorDirty,
            opacityDirty = locFlag & flags.opacityDirty;
        if (colorDirty)
            this._updateDisplayColor();
        if (opacityDirty)
            this._updateDisplayOpacity();
        if(colorDirty || opacityDirty){
            this._setColorsString();
            this._updateColor();
            this._updateTexture();
        }else if(locFlag & flags.textDirty)
            this._updateTexture();
        if (this._dirtyFlag & flags.transformDirty){
            this.transform(this.getParentRenderCmd(), true);
            this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.transformDirty ^ this._dirtyFlag;
        }
    };
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
        if(colorDirty || opacityDirty){
            this._setColorsString();
            this._updateColor();
            this._updateTexture();
        }else if(locFlag & flags.textDirty)
            this._updateTexture();
        this.transform(parentCmd);
    };
})();
cc.DrawingPrimitiveWebGL = cc.Class.extend({
    _renderContext:null,
    _initialized:false,
    _shader: null,
    _colorLocation:-1,
    _colorArray: null,
    _pointSizeLocation:-1,
    _pointSize:-1,
    ctor:function (ctx) {
        if (ctx == null)
            ctx = cc._renderContext;
        if (!ctx instanceof  WebGLRenderingContext)
            throw "Can't initialise DrawingPrimitiveWebGL. context need is WebGLRenderingContext";
        this._renderContext = ctx;
        this._colorArray = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    },
    lazy_init:function () {
        var _t = this;
        if (!_t._initialized) {
            _t._shader = cc.shaderCache.programForKey(cc.SHADER_POSITION_UCOLOR);
            _t._colorLocation = _t._renderContext.getUniformLocation(_t._shader.getProgram(), "u_color");
            _t._pointSizeLocation = _t._renderContext.getUniformLocation(_t._shader.getProgram(), "u_pointSize");
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
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
        glContext.uniform4fv(this._colorLocation, this._colorArray);
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
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
        glContext.uniform4fv(this._colorLocation, this._colorArray);
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
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
        glContext.uniform4fv(this._colorLocation, this._colorArray);
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
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
        glContext.uniform4fv(this._colorLocation, this._colorArray);
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
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
        glContext.uniform4fv(this._colorLocation, this._colorArray);
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
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
        glContext.uniform4fv(this._colorLocation, this._colorArray);
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
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
        glContext.uniform4fv(this._colorLocation, this._colorArray);
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
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
        glContext.uniform4fv(this._colorLocation, this._colorArray);
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
        cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION);
        glContext.uniform4fv(this._colorLocation, this._colorArray);
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
