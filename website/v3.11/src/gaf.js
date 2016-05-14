var gaf = gaf || {};
gaf.COMPRESSION_NONE = 0x00474146;
gaf.COMPRESSION_ZIP = 0x00474143;
gaf.IDNONE = 0xffffffff;
gaf.FIRST_FRAME_INDEX = 0;
gaf.EFFECT_DROP_SHADOW = 0;
gaf.EFFECT_BLUR = 1;
gaf.EFFECT_GLOW = 2;
gaf.EFFECT_COLOR_MATRIX = 6;
gaf.ACTION_STOP = 0;
gaf.ACTION_PLAY = 1;
gaf.ACTION_GO_TO_AND_STOP = 2;
gaf.ACTION_GO_TO_AND_PLAY = 3;
gaf.ACTION_DISPATCH_EVENT = 4;
gaf.PI_FRAME = 0;
gaf.PI_EVENT_TYPE = 0;
gaf.TYPE_TEXTURE = 0;
gaf.TYPE_TEXT_FIELD = 1;
gaf.TYPE_TIME_LINE = 2;
gaf.UNIFORM_BLUR_TEXEL_OFFSET = "u_step";
gaf.UNIFORM_GLOW_TEXEL_OFFSET = "u_step";
gaf.UNIFORM_GLOW_COLOR = "u_glowColor";
gaf.UNIFORM_ALPHA_TINT_MULT = "colorTransformMult";
gaf.UNIFORM_ALPHA_TINT_OFFSET = "colorTransformOffsets";
gaf.UNIFORM_ALPHA_COLOR_MATRIX_BODY = "colorMatrix";
gaf.UNIFORM_ALPHA_COLOR_MATRIX_APPENDIX = "colorMatrix2";
var gaf = gaf || {};
gaf._tmp = gaf._tmp || {};
gaf._initialized = false;
gaf.CCGAFLoader = function()
{
    this.load = function(realUrl, url, item, cb)
    {
        if(!gaf._initialized)
        {
            gaf._setup();
        }
        var loader = new gaf.Loader();
        loader.LoadFile(realUrl, function(data){cb(null, data)});
    };
};
gaf._setup = function()
{
    gaf._setupShaders();
    gaf._initialized = true;
};
cc.loader.register('.gaf', new gaf.CCGAFLoader());
gaf.CGAffineTransformCocosFormatFromFlashFormat = function(transform)
{
    var t = {};
    t.a = transform.a;
    t.b = -transform.b;
    t.c = -transform.c;
    t.d = transform.d;
    t.tx = transform.tx;
    t.ty = -transform.ty;
    return t;
};
gaf._AssetPreload = function()
{
    this["0"] = this.End;
    this["1"] = this.Atlases;
    this["2"] = this.AnimationMasks;
    this["3"] = this.AnimationObjects;
    this["4"] = this.AnimationFrames;
    this["5"] = this.NamedParts;
    this["6"] = this.Sequences;
    this["7"] = this.TextFields;
    this["8"] = this.Atlases;
    this["9"] = this.Stage;
    this["10"] = this.AnimationObjects;
    this["11"] = this.AnimationMasks;
    this["12"] = this.AnimationFrames;
    this["13"] = this.TimeLine;
};
gaf._AssetPreload.prototype.End = function(asset, content, timeLine){
    if(timeLine)
    {
        timeLine.getFps = function()
        {
            return asset.getSceneFps();
        };
    }
};
gaf._AssetPreload.prototype.Tag = function(asset, tag, timeLine)
{
    (this[tag.tagId]).call(this, asset, tag.content, timeLine);
};
gaf._AssetPreload.prototype.Tags = function(asset, tags, timeLine)
{
    var self = this;
    tags.forEach(function(tag)
    {
        self.Tag(asset, tag, timeLine);
    });
};
gaf._AssetPreload.prototype.AtlasCreateFrames = function(elements, asset, spriteFrames)
{
    elements.forEach(function (item) {
        var texture = asset._atlases[item.atlasId];
        var rect = cc.rect(item.origin.x, item.origin.y, item.size.x, item.size.y);
        var frame = new cc.SpriteFrame(texture, rect);
        frame._gafAnchor =
        {
            x: (0 - (0 - (item.pivot.x / item.size.x))),
            y: (0 + (1 - (item.pivot.y / item.size.y)))
        };
        spriteFrames[item.elementAtlasId] = frame;
    });
};
gaf._AssetPreload.prototype.Atlases = function(asset, content, timeLine)
{
    var spriteFrames = asset._atlasScales[content.scale] = asset._atlasScales[content.scale] || [];
    var csf = cc.Director._getInstance().getContentScaleFactor();
    content.atlases.forEach(function(item)
    {
        var atlasId = item.id;
        var finalizeLoading = function()
        {
            gaf._AssetPreload.AtlasCreateFrames(content.elements, asset, spriteFrames);
        };
        var atlasPath = "";
        item.sources.forEach(function(atlasSource)
        {
            if(atlasSource.csf === csf)
            {
                atlasPath = atlasSource.source;
            }
        });
        cc.assert(atlasPath, "GAF Error. Texture for current CSF not found. Reconvert animation with correct parameters.");
        if(asset._textureLoadDelegate)
        {
            atlasPath = asset._textureLoadDelegate(atlasPath);
        }
        var loaded = false;
        var paths = asset._getSearchPaths(atlasPath);
        for(var i = 0, len = paths.length; i < len; ++i){
            var path = paths[i];
            var atlas = cc.textureCache.getTextureForKey(path);
            if(atlas && atlas.isLoaded())
            {
                atlas.handleLoadedTexture(true);
                loaded = true;
                asset._atlases[atlasId] = atlas;
                finalizeLoading();
                break;
            }
        }
        if(!loaded)
        {
            var success = function (atlas) {
                atlas.handleLoadedTexture(true);
                asset._onAtlasLoaded(atlasId, atlas);
            };
            var fail = function () {
                cc.log("GAF Error. Couldn't find `" + atlasPath + "` required by `" + asset.getGAFFileName() + "`");
            };
            if(!asset._atlasesToLoad.hasOwnProperty(atlasId))
            {
                gaf._AtlasLoader.loadArray(paths, success, fail);
                asset._atlasesToLoad[atlasId] = {};
            }
            asset._onLoadTasks.push(finalizeLoading);
        }
    });
};
gaf._AssetPreload.prototype.AnimationObjects = function(asset, content, timeLine)
{
    content.forEach(function(item)
    {
        item.type = (item.type === undefined) ? gaf.TYPE_TEXTURE : item.type;
        timeLine._objects.push(item.objectId);
        asset._objects[item.objectId] = item;
    });
};
gaf._AssetPreload.prototype.convertTint = function(mat, alpha)
{
    if(!mat)
        return null;
    return {
        mult:
        {
            r: mat.redMultiplier * 255,
            g: mat.greenMultiplier * 255,
            b: mat.blueMultiplier * 255,
            a: alpha * 255
        },
        offset:
        {
            r: mat.redOffset * 255,
            g: mat.greenOffset * 255,
            b: mat.blueOffset * 255,
            a: mat.alphaOffset * 255
        }
    };
};
gaf._AssetPreload.prototype.convertState = function(state)
{
    return {
        hasColorTransform: state.hasColorTransform,
        hasMask: state.hasMask,
        hasEffect: state.hasEffect,
        objectIdRef: state.objectIdRef,
        depth: state.depth,
        alpha: state.alpha * 255,
        matrix: gaf.CGAffineTransformCocosFormatFromFlashFormat(state.matrix),
        colorTransform: this.convertTint(state.colorTransform, state.alpha),
        effect: state.effect,
        maskObjectIdRef: state.maskObjectIdRef
    };
};
gaf._AssetPreload.prototype.AnimationFrames = function(asset, content, timeLine)
{
    var self = this;
    cc.assert(timeLine, "Error. Time Line should not be null.");
    var statesForId = {};
    var frames = [];
    var lastFrame = {};
    for(var i = 0, len = content.length; i < len; ++i)
    {
        var frame = content[i];
        if(frame.state)
        {
            frame.state.forEach(function (state)
            {
                if (state.alpha !== 0)
                {
                    statesForId[state.objectIdRef] = self.convertState(state);
                }
                else
                {
                    statesForId[state.objectIdRef] = null;
                }
            });
        }
        var stateArray = [];
        for(var obj in statesForId){ if(statesForId.hasOwnProperty(obj) && statesForId[obj])
        {
            stateArray.push(statesForId[obj]);
        }}
        lastFrame = frame;
        frames[frame.frame - 1] = {states: stateArray, actions: frame.actions || null};
    }
    timeLine.getFrames = function(){return frames};
};
gaf._AssetPreload.prototype.NamedParts = function(asset, content, timeLine)
{
    var parts = {};
    content.forEach(function(item)
    {
        parts[item.name] = item.objectId;
    });
    timeLine.getNamedParts = function(){return parts};
};
gaf._AssetPreload.prototype.Sequences = function(asset, content, timeLine)
{
    var sequences = {};
    content.forEach(function(item){
        sequences[item.id] = {start: item.start - 1, end: item.end};
    });
    timeLine.getSequences = function(){return sequences};
};
gaf._AssetPreload.prototype.TextFields = function(asset, content, timeLine)
{
    debugger;
};
gaf._AssetPreload.prototype.Stage = function(asset, content, timeLine)
{
    asset._sceneFps = content.fps;
    asset._sceneColor = content.color;
    asset._sceneWidth = content.width;
    asset._sceneHeight = content.height;
};
gaf._AssetPreload.prototype.AnimationMasks = function(asset, content, timeLine)
{
    content.forEach(function(item)
    {
        item.type = (item.type === undefined) ? gaf.TYPE_TEXTURE : item.type;
        timeLine._objects.push(item.objectId);
        asset._masks[item.objectId] = item;
    });
};
gaf._AssetPreload.prototype.TimeLine = function(asset, content, timeLine)
{
    var result = new gaf._TimeLineProto(asset, content.animationFrameCount, content.boundingBox, content.pivotPoint, content.id, content.linkageName);
    asset._pushTimeLine(result);
    this.Tags(asset, content.tags, result);
};
gaf._AssetPreload = new gaf._AssetPreload();
var gaf = gaf || {};
gaf.Asset = cc.Class.extend
({
    _className: "GAFAsset",
    _header: null,
    _timeLines: null,
    _textFields: null,
    _protos: null,
    _objects: null,
    _masks: null,
    _rootTimeLine: null,
    _textureLoadDelegate: null,
    _sceneFps: 60,
    _sceneWidth: 0,
    _sceneHeight: 0,
    _sceneColor: 0,
    _gafData: null,
    _desiredAtlasScale: 1,
    _usedAtlasScale: 0,
    _atlases: null,
    _onLoadTasks: null,
    _atlasScales: null,
    _textureLoaded: false,
    _atlasesToLoad: null,
    _gafName: null,
    initWithGAFFile: function (filePath, textureLoadDelegate) {
        var self = this;
        this._textureLoadDelegate = textureLoadDelegate;
        this._gafName = filePath;
        var gafData = cc.loader.getRes(filePath);
        if(!gafData)
        {
            cc.loader.load(filePath, function(err, data){
                if(!err)
                {
                    self._init(data[0]);
                }
            });
        }
        else {
            return this._init(gafData);
        }
        return false;
    },
    initWithGAFBundle: function (zipFilePath, entryFile, delegate)
    {
        cc.assert(false, "initWithGAFBundle is not yet implemented");
        return false;
    },
    setRootTimelineWithName: function (name)
    {
        for(var i = 0, end = this._timeLines.length; i < end; ++i)
        {
            var object = this._timeLines[i];
            if (object && object.getLinkageName() === name)
            {
                this._setRootTimeline(object);
                return;
            }
        }
    },
    isAssetVersionPlayable: function ()
    {
        return true;
    },
    desiredAtlasScale : function(){
        return this._desiredAtlasScale;
    },
    setDesiredAtlasScale : function(desiredAtlasScale){
        this._desiredAtlasScale = desiredAtlasScale;
        for(var currentScale in this._atlasScales)if(this._atlasScales.hasOwnProperty(currentScale))
        {
            if( (this._usedAtlasScale === 0) ||
                (Math.abs(this._usedAtlasScale - desiredAtlasScale) > Math.abs(currentScale - desiredAtlasScale) ))
            {
                this._usedAtlasScale = currentScale;
            }
        }
    },
    createObject: function ()
    {
        return this._instantiateGaf(this._gafData);
    },
    createObjectAndRun: function (looped)
    {
        cc.assert(arguments.length === 1, "GAFAsset::createObjectAndRun should have one param");
        var object = this._instantiateGaf(this._gafData);
        object.setLooped(looped, true);
        object.start();
        return object;
    },
    setTextureLoadDelegate: function (delegate)
    {
        debugger;
    },
    getSceneFps: function ()
    {
        return this._sceneFps;
    },
    getSceneWidth: function ()
    {
        debugger;
    },
    getSceneHeight: function ()
    {
        debugger;
    },
    getSceneColor: function ()
    {
        debugger;
    },
    setSceneFps: function (fps)
    {
        this._sceneFps = fps;
    },
    setSceneWidth: function (width)
    {
        debugger;
    },
    setSceneHeight: function (height)
    {
        debugger;
    },
    setSceneColor: function (color4B)
    {
        debugger;
    },
    getHeader: function ()
    {
        return this._header;
    },
    getGAFFileName: function()
    {
        return this._gafName;
    },
    ctor : function()
    {
        this._header = {};
        this._timeLines = [];
        this._textFields = [];
        this._objects = [];
        this._masks = [];
        this._protos = [];
        this._atlases = {};
        this._onLoadTasks = [];
        this._atlasScales = {};
        this._atlasesToLoad = {};
        if(arguments.length > 0)
            this.initWithGAFFile.apply(this, arguments);
    },
    _getProtos: function()
    {
        return this._protos;
    },
    _setRootTimeline : function(timeLine)
    {
        this._rootTimeLine = timeLine;
        this._header.pivot = timeLine.getPivot();
        this._header.frameSize = timeLine.getRect();
    },
    _setHeader : function (gafHeader)
    {
        for(var prop in gafHeader)
        {
            if(gafHeader.hasOwnProperty(prop))
            {
                this._header[prop] = gafHeader[prop];
            }
        }
    },
    _getMajorVerison : function()
    {
        return this._header.versionMajor;
    },
    _init : function(gafData)
    {
        var self = this;
        this._gafData = gafData;
        this._setHeader(gafData.header);
        this._timeLinesToLink = [];
        if(this._getMajorVerison() < 4)
        {
            this._pushTimeLine(new gaf._TimeLineProto(this, this._header.framesCount, this._header.frameSize, this._header.pivot));
        }
        gaf._AssetPreload.Tags(this, gafData.tags, this._rootTimeLine);
        this._objects.forEach(function(item)
        {
            switch(item.type)
            {
                case gaf.TYPE_TEXTURE:
                    if(!self._protos[item.objectId])
                    {
                        self._protos[item.objectId] = new gaf._SpriteProto(self, self._atlasScales, item.elementAtlasIdRef);
                    }
                    break;
                case gaf.TYPE_TIME_LINE:
                    self._protos[item.objectId] = self._timeLines[item.elementAtlasIdRef];
                    break;
                case gaf.TYPE_TEXT_FIELD:
                    self._protos[item.objectId] = self._textFields[item.elementAtlasIdRef];
                    break;
                default:
                    cc.log("Unknown object type: " + item.type);
                    break;
            }
        });
        this._masks.forEach(function(item)
        {
            if(self._protos[item.objectId])
            {
                return;
            }
            var proto = null;
            switch(item.type)
            {
                case gaf.TYPE_TEXTURE:
                    proto = new gaf._SpriteProto(self, self._atlasScales, item.elementAtlasIdRef);
                    break;
                case gaf.TYPE_TIME_LINE:
                    proto = self._timeLines[item.elementAtlasIdRef];
                    break;
                case gaf.TYPE_TEXT_FIELD:
                    proto = self._textFields[item.elementAtlasIdRef];
                    break;
            }
            self._protos[item.objectId] = new gaf._MaskProto(self, proto, item.elementAtlasIdRef);
        });
        this.setDesiredAtlasScale(this._desiredAtlasScale);
        if(Object.keys(this._atlasesToLoad).length === 0)
        {
            this._textureLoaded = true;
            this.dispatchEvent("load");
        }
    },
    _pushTimeLine : function(timeLine)
    {
        this._timeLines[timeLine.getId()] = timeLine;
        if(timeLine.getId() === 0)
        {
            this._setRootTimeline(timeLine);
        }
    },
    _instantiateGaf : function()
    {
        var root = null;
        root = this._rootTimeLine._gafConstruct();
        return root;
    },
    _onAtlasLoaded : function(id, atlas)
    {
        this._atlases[id] = atlas;
        delete this._atlasesToLoad[id];
        if(Object.keys(this._atlasesToLoad).length === 0)
        {
            this._onLoadTasks.forEach(function(fn){fn()});
            this._onLoadTasks.length = 0;
            this._textureLoaded = true;
            this.dispatchEvent("load");
        }
    },
    isLoaded : function()
    {
        return this._textureLoaded;
    },
    _getSearchPaths: function(imageUrl)
    {
        var extendedPath = this.getGAFFileName().split('/');
        extendedPath[extendedPath.length-1] = imageUrl;
        var alternativeUrl = extendedPath.join('/');
        return [imageUrl, alternativeUrl];
    }
});
gaf.Asset.create = function (gafFilePath, delegate)
{
    return new gaf.Asset(gafFilePath, delegate);
};
gaf.Asset.createWithBundle = function (zipFilePath, entryFile, delegate)
{
    var asset = new gaf.Asset();
    asset.initWithGAFBundle(zipFilePath, entryFile, delegate);
    return asset;
};
cc.EventHelper.prototype.apply(gaf.Asset.prototype);
var gaf = gaf || {};
gaf._stateHasCtx = function(state)
{
    if( state.hasColorTransform &&
       (state.colorTransform.offset.r > 0 ||
        state.colorTransform.offset.g > 0 ||
        state.colorTransform.offset.b > 0 ||
        state.colorTransform.offset.a > 0)
    )
    {
        return true;
    }
    if(state.hasEffect)
    {
        for(var i = 0, total = state.effect.length; i < total; ++i)
        {
            if(state.effect[i].type === gaf.EFFECT_COLOR_MATRIX)
                return true;
        }
    }
    return false;
};
gaf.Object = cc.Node.extend
({
    _asset : null,
    _className : "GAFObject",
    _id : gaf.IDNONE,
    _gafproto : null,
    _parentTimeLine : null,
    _lastVisibleInFrame : 0,
    _filterStack : null,
    _cascadeColorMult : null,
    _cascadeColorOffset : null,
    _needsCtx : false,
    _usedAtlasScale: 1,
    ctor: function(scale)
    {
        if(arguments.length == 1)
        {
            this._usedAtlasScale = scale;
        }
        this._super();
        this._cascadeColorMult = cc.color(255, 255, 255, 255);
        this._cascadeColorOffset = cc.color(0, 0, 0, 0);
        this._filterStack = [];
    },
    setAnimationStartedNextLoopDelegate : function (delegate) {},
    setAnimationFinishedPlayDelegate : function (delegate) {},
    setLooped : function (looped) {},
    getBoundingBoxForCurrentFrame : function () {return null;},
    setFps : function (fps) {},
    getObjectByName : function (name) {return null;},
    clearSequence : function () {},
    getIsAnimationRunning : function () {return false;},
    getSequences : function(){return [];},
    gotoAndStop : function (value) {},
    getStartFrame : function (frameLabel) {return gaf.IDNONE;},
    setFramePlayedDelegate : function (delegate) {},
    getCurrentFrameIndex : function () {
        return gaf.IDNONE;
    },
    getTotalFrameCount : function () {return 0;},
    start : function () {},
    stop : function () {},
    isVisibleInCurrentFrame : function ()
    {
        return !(this._parentTimeLine && ((this._parentTimeLine.getCurrentFrameIndex() + 1) != this._lastVisibleInFrame));
    },
    isDone : function () {return true;},
    playSequence : function (name, looped, resume) {return false;},
    isReversed : function () {return false;},
    setSequenceDelegate : function (delegate) {},
    setFrame : function (index) {return false;},
    setControlDelegate : function (func) {},
    getEndFrame : function (frameLabel) {return gaf.IDNONE;},
    pauseAnimation : function () {},
    gotoAndPlay : function (value) {},
    isLooped : function () {return false;},
    resumeAnimation : function () {},
    setReversed : function (reversed) {},
    hasSequences : function () {return false;},
    getFps : function () {return 60;},
    setLocator : function (locator){},
    setExternalTransform : function(affineTransform)
    {
        if(!cc.affineTransformEqualToTransform(this._additionalTransform, affineTransform))
        {
            this.setAdditionalTransform(affineTransform);
        }
    },
    getExternalTransform : function()
    {
        return this._additionalTransform;
    },
    setAnimationRunning: function () {},
    _enableTick: function(val){},
    _resetState : function()
    {},
    _updateVisibility : function(state, parent)
    {
        var alphaOffset = state.hasColorTransform ? state.colorTransform.offset.a : 0;
        this.setOpacity(state.alpha + alphaOffset);
    },
    isVisible : function()
    {
        return this.getOpacity() > 0;
    },
    visit: function(parentCmd)
    {
        if(this.isVisibleInCurrentFrame())
        {
            this._super(parentCmd);
        }
    },
    _getFilters : function(){return null},
    _processAnimation : function(){},
    _applyState : function(state, parent)
    {
        this._applyStateSuper(state, parent);
    },
    _applyStateSuper : function(state, parent)
    {
        this._needsCtx = parent._needsCtx;
        this._filterStack.length = 0;
        this._parentTimeLine = parent;
        if(this._usedAtlasScale != 1)
        {
            var newMat = cc.clone(state.matrix);
            newMat.tx *= this._usedAtlasScale;
            newMat.ty *= this._usedAtlasScale;
            this.setExternalTransform(newMat);
        }
        else
        {
            this.setExternalTransform(state.matrix);
        }
        if (state.hasEffect) {
            this._filterStack = this._filterStack.concat(state.effect);
            this._needsCtx = true;
        }
        if (parent._filterStack && parent._filterStack.length > 0) {
            this._filterStack = this._filterStack.concat(parent._filterStack);
        }
        if(this._filterStack.length > 0 && this._filterStack[0].type === gaf.EFFECT_COLOR_MATRIX)
        {
            this._needsCtx = true;
        }
        if (state.hasColorTransform)
        {
            this._cascadeColorMult.r = state.colorTransform.mult.r * parent._cascadeColorMult.r / 255;
            this._cascadeColorMult.g = state.colorTransform.mult.g * parent._cascadeColorMult.g / 255;
            this._cascadeColorMult.b = state.colorTransform.mult.b * parent._cascadeColorMult.b / 255;
            this._cascadeColorMult.a = state.colorTransform.mult.a * parent._cascadeColorMult.a / 255;
            this._cascadeColorOffset.r = state.colorTransform.offset.r + parent._cascadeColorOffset.r;
            this._cascadeColorOffset.g = state.colorTransform.offset.g + parent._cascadeColorOffset.g;
            this._cascadeColorOffset.b = state.colorTransform.offset.b + parent._cascadeColorOffset.b;
            this._cascadeColorOffset.a = state.colorTransform.offset.a + parent._cascadeColorOffset.a;
        }
        else
        {
            this._cascadeColorMult.r = parent._cascadeColorMult.r;
            this._cascadeColorMult.g = parent._cascadeColorMult.g;
            this._cascadeColorMult.b = parent._cascadeColorMult.b;
            this._cascadeColorMult.a = state.alpha * (parent._cascadeColorMult.a / 255);
            this._cascadeColorOffset.r = parent._cascadeColorOffset.r;
            this._cascadeColorOffset.g = parent._cascadeColorOffset.g;
            this._cascadeColorOffset.b = parent._cascadeColorOffset.b;
            this._cascadeColorOffset.a = parent._cascadeColorOffset.a;
        }
        if (this._cascadeColorOffset.r > 0 ||
            this._cascadeColorOffset.g > 0 ||
            this._cascadeColorOffset.b > 0 ||
            this._cascadeColorOffset.a > 0)
        {
            this._needsCtx = true;
        }
    },
    _initRendererCmd: function()
    {
        this._renderCmd = cc.renderer.getRenderCmd(this);
        this._renderCmd._visit = this._renderCmd.visit;
        var self = this;
        this._renderCmd.visit = function(parentCmd) {
            if(self.isVisibleInCurrentFrame()){
                this._visit(parentCmd);
            }
        }
    },
    _getNode : function()
    {
        return this;
    },
    setAnchorPoint : function(point, y)
    {
        if (y === undefined)
        {
            this._super(point.x, point.y - 1);
        }
        else
        {
            this._super(point, y - 1);
        }
    }
});
gaf.Object._createNullObject = function()
{
    var ret = new gaf.Object();
    ret.isVisible = function(){return true};
    return ret;
};
gaf.TimeLine = gaf.Object.extend
({
    _className: "GAFTimeLine",
    _objects: null,
    _container: null,
    _animationStartedNextLoopDelegate: null,
    _animationFinishedPlayDelegate: null,
    _framePlayedDelegate: null,
    _sequenceDelegate: null,
    _fps: 60,
    _frameTime: 1/60,
    _currentSequenceStart: gaf.FIRST_FRAME_INDEX,
    _currentSequenceEnd: gaf.FIRST_FRAME_INDEX,
    _totalFrameCount: 0,
    _isRunning: false,
    _isLooped: false,
    _isReversed: false,
    _timeDelta: 0,
    _animationsSelectorScheduled: false,
    _currentFrame: gaf.FIRST_FRAME_INDEX,
    setAnimationStartedNextLoopDelegate: function (delegate)
    {
        this._animationStartedNextLoopDelegate = delegate;
    },
    setAnimationFinishedPlayDelegate: function (delegate)
    {
        this._animationFinishedPlayDelegate = delegate;
    },
    setLooped: function (looped, recursively)
    {
        this._isLooped = looped;
        if (recursively)
        {
            this._objects.forEach(function (item)
            {
                item.setLooped(looped, recursively);
            });
        }
    },
    getBoundingBoxForCurrentFrame: function ()
    {
        var result = null;//cc.rect();
        var isFirstObj = true;
        this._objects.forEach(function (item) {
            if(item.isVisibleInCurrentFrame() && item.isVisible())
            {
                var bb = item.getBoundingBoxForCurrentFrame();
                if(!bb)
                {
                    bb = item.getBoundingBox();
                }
                if (isFirstObj)
                {
                    isFirstObj = false;
                    result = bb;
                }
                else
                {
                    result = cc.rectUnion(result, bb);
                }
            }
        });
        return cc._rectApplyAffineTransformIn(result, this._container.getNodeToParentTransform());
    },
    setFps: function (fps)
    {
        cc.assert(fps !== 0, 'Error! Fps is set to zero.');
        this._fps = fps;
        this._frameTime = 1/fps;
    },
    getObjectByName: function (name)
    {
        var elements = name.split('.');
        var result = null;
        var retId = -1;
        var timeLine = this;
        var BreakException = {};
        try
        {
            elements.forEach(function(element)
            {
                var parts = timeLine._gafproto.getNamedParts();
                if(parts.hasOwnProperty(element))
                {
                    retId = parts[element];
                }
                else
                {
                    BreakException.lastElement = element;
                    throw BreakException;
                }
                result = timeLine._objects[retId];
                timeLine = result;
            });
        }
        catch (e)
        {
            if (e!==BreakException)
            {
                throw e;
            }
            cc.log("Sequence incorrect: `" + name + "` At: `" + BreakException.lastElement + "`");
            return null;
        }
        return result;
    },
    clearSequence: function ()
    {
        this._currentSequenceStart = gaf.FIRST_FRAME_INDEX;
        this._currentSequenceEnd = this._gafproto.getTotalFrames();
    },
    getIsAnimationRunning: function ()
    {
        return this._isRunning;
    },
    gotoAndStop: function (value)
    {
        var frame = 0;
        if (typeof value === 'string')
        {
            frame = this.getStartFrame(value);
        }
        else
        {
            frame = value;
        }
        if (this.setFrame(frame))
        {
            this.setAnimationRunning(false, false);
            return true;
        }
        return false;
    },
    gotoAndPlay: function (value)
    {
        var frame = 0;
        if (typeof value === 'string')
        {
            frame = this.getStartFrame(value);
        }
        else
        {
            frame = value;
        }
        if (this.setFrame(frame))
        {
            this.setAnimationRunning(true, false);
            return true;
        }
        return false;
    },
    getStartFrame: function (frameLabel)
    {
        var seq = this._gafproto.getSequences()[frameLabel];
        if (seq)
        {
            return seq.start;
        }
        return gaf.IDNONE;
    },
    getEndFrame: function (frameLabel)
    {
        var seq = this._gafproto.getSequences()[frameLabel];
        if (seq)
        {
            return seq.end;
        }
        return gaf.IDNONE;
    },
    setFramePlayedDelegate: function (delegate)
    {
        this._framePlayedDelegate = delegate;
    },
    getCurrentFrameIndex: function ()
    {
        return this._showingFrame;
    },
    getTotalFrameCount: function ()
    {
        return this._gafproto.getTotalFrames();
    },
    start: function ()
    {
        this._enableTick(true);
        if (!this._isRunning)
        {
            this._currentFrame = gaf.FIRST_FRAME_INDEX;
            this.setAnimationRunning(true, true);
        }
    },
    stop: function ()
    {
        this._enableTick(false);
        if (this._isRunning)
        {
            this._currentFrame = gaf.FIRST_FRAME_INDEX;
            this.setAnimationRunning(false, true);
        }
    },
    isDone: function ()
    {
        if (this._isLooped)
        {
            return false;
        }
        else
        {
            if (!this._isReversed)
            {
                return this._currentFrame > this._totalFrameCount;
            }
            else
            {
                return this._currentFrame < gaf.FIRST_FRAME_INDEX - 1;
            }
        }
    },
    getSequences: function()
    {
        return this._gafproto.getSequences();
    },
    playSequence: function (name, looped)
    {
        var s = this.getStartFrame(name);
        var e = this.getEndFrame(name);
        if (gaf.IDNONE === s || gaf.IDNONE === e)
        {
            return false;
        }
        this._currentSequenceStart = s;
        this._currentSequenceEnd = e;
        if (this._currentFrame < this._currentSequenceStart || this._currentFrame > this._currentSequenceEnd)
        {
            this._currentFrame = this._currentSequenceStart;
        }
        else
        {
            this._currentFrame = this._currentSequenceStart;
        }
        this.setLooped(looped, false);
        this.resumeAnimation();
        return true;
    },
    isReversed: function ()
    {
        return this._isReversed;
    },
    setSequenceDelegate: function (delegate)
    {
        this._sequenceDelegate = delegate;
    },
    setFrame: function (index)
    {
        if (index >= gaf.FIRST_FRAME_INDEX && index < this._totalFrameCount)
        {
            this._showingFrame = index;
            this._currentFrame = index;
            this._processAnimation();
            return true;
        }
        return false;
    },
    pauseAnimation: function ()
    {
        if (this._isRunning)
        {
            this.setAnimationRunning(false, false);
        }
    },
    isLooped: function ()
    {
        return this._isLooped;
    },
    resumeAnimation: function ()
    {
        if (!this._isRunning)
        {
            this.setAnimationRunning(true, false);
        }
    },
    setReversed: function (reversed)
    {
        this._isReversed = reversed;
    },
    hasSequences: function ()
    {
        return this._gafproto.getSequences().length > 0;
    },
    getFps: function ()
    {
        return this._fps;
    },
    ctor: function(gafTimeLineProto, scale)
    {
        this._super(scale);
        this._objects = [];
        cc.assert(gafTimeLineProto,  "Error! Missing mandatory parameter.");
        this._gafproto = gafTimeLineProto;
    },
    setExternalTransform: function(affineTransform)
    {
        if(!cc.affineTransformEqualToTransform(this._container._additionalTransform, affineTransform))
        {
           this._container.setAdditionalTransform(affineTransform);
        }
    },
    _init: function()
    {
        this.setContentSize(this._gafproto.getBoundingBox());
        this._currentSequenceEnd = this._gafproto.getTotalFrames();
        this._totalFrameCount = this._currentSequenceEnd;
        this.setFps(this._gafproto.getFps());
        this._container = new cc.Node();
        this.addChild(this._container);
        var self = this;
        var asset = this._gafproto.getAsset();
        this._gafproto.getObjects().forEach(function(object)
        {
            var objectProto = asset._getProtos()[object];
            cc.assert(objectProto, "Error. GAF proto for type: " + object.type + " and reference id: " + object + " not found.");
            self._objects[object] = objectProto._gafConstruct();
        });
    },
    _enableTick: function(val)
    {
        if (!this._animationsSelectorScheduled && val)
        {
            this.schedule(this._processAnimations);
            this._animationsSelectorScheduled = true;
        }
        else if (this._animationsSelectorScheduled && !val)
        {
            this.unschedule(this._processAnimations);
            this._animationsSelectorScheduled = false;
        }
    },
    _processAnimations: function (dt)
    {
        this._timeDelta += dt;
        while (this._timeDelta >= this._frameTime)
        {
            this._timeDelta -= this._frameTime;
            this._step();
        }
    },
    _step: function ()
    {
        this._showingFrame = this._currentFrame;
        if(!this.getIsAnimationRunning())
        {
            this._processAnimation();
            return;
        }
        if(this._sequenceDelegate)
        {
            var seq;
            if(!this._isReversed)
            {
                seq = this._getSequenceByLastFrame(this._currentFrame);
            }
            else
            {
                seq = this._getSequenceByFirstFrame(this._currentFrame + 1);
            }
            if (seq)
            {
                this._sequenceDelegate(this, seq);
            }
        }
        if (this._isCurrentFrameLastInSequence())
        {
            if(this._isLooped)
            {
                if(this._animationStartedNextLoopDelegate)
                    this._animationStartedNextLoopDelegate(this);
            }
            else
            {
                this.setAnimationRunning(false, false);
                if(this._animationFinishedPlayDelegate)
                    this._animationFinishedPlayDelegate(this);
            }
        }
        this._processAnimation();
        this._currentFrame = this._nextFrame();
    },
    _isCurrentFrameLastInSequence: function()
    {
        if (this._isReversed)
            return this._currentFrame == this._currentSequenceStart;
        return this._currentFrame == this._currentSequenceEnd - 1;
    },
    _nextFrame: function()
    {
        if (this._isCurrentFrameLastInSequence())
        {
            if (!this._isLooped)
                return this._currentFrame;
            if (this._isReversed)
                return this._currentSequenceEnd - 1;
            else
                return this._currentSequenceStart;
        }
        return this._currentFrame + (this._isReversed ? -1 : 1);
    },
    _processAnimation: function ()
    {
        this._realizeFrame(this._container, this._currentFrame);
        if (this._framePlayedDelegate)
        {
            this._framePlayedDelegate(this, this._currentFrame);
        }
    },
    _realizeFrame: function(out, frameIndex)
    {
        var self = this;
        var objects = self._objects;
        var frames = self._gafproto.getFrames();
        if(frameIndex > frames.length)
        {
            return;
        }
        var currentFrame = frames[frameIndex];
        if(!currentFrame)
        {
            return;
        }
        var states = currentFrame.states;
        for(var stateIdx = 0, total = states.length; stateIdx < total; ++stateIdx)
        {
            var state = states[stateIdx];
            var object = objects[state.objectIdRef];
            if(!object)
            {
                return;
            }
            if(state.alpha < 0)
            {
                object._resetState();
            }
            object._updateVisibility(state, self);
            if(!object.isVisible())
            {
                continue;
            }
            object._applyState(state, self);
            var parent = out;
            if(state.hasMask)
            {
                parent = objects[state.maskObjectIdRef]._getNode();
                cc.assert(parent, "Error! Mask not found.");
            }
            object._lastVisibleInFrame = 1 + frameIndex;
            gaf.TimeLine.rearrangeSubobject(parent, object, state.depth);
            if(object._step)
            {
                object._step();
            }
        }
    },
    setAnimationRunning: function (value, recursively)
    {
        this._isRunning = value;
        if(recursively)
        {
            this._objects.forEach(function (obj)
            {
                if (obj && obj.setAnimationRunning)
                {
                    obj.setAnimationRunning(value, recursively);
                }
            });
        }
    },
    _getSequenceByLastFrame: function(){
        var sequences = this._gafproto.getSequences();
        for(var item in sequences){
            if(sequences.hasOwnProperty(item)){
                if(sequences[item].end === frame + 1)
                {
                    return item;
                }
            }
        }
        return "";
    },
    _resetState : function()
    {
        this._super();
        this._currentFrame = this._currentSequenceStart;
    },
    _getSequenceByFirstFrame: function(){
        var sequences = this._gafproto.getSequences();
        for(var item in sequences){
            if(sequences.hasOwnProperty(item)){
                if(sequences[item].start === frame)
                {
                    return item;
                }
            }
        }
        return "";
    }
});
gaf.TimeLine.rearrangeSubobject = function(out, object, depth)
{
    var parent = object.getParent();
    if (parent !== out)
    {
        object.removeFromParent(false);
        out.addChild(object, depth);
    }
    else
    {
        object.setLocalZOrder(depth);
    }
};
gaf.TextField = gaf.Object.extend
({
    _className: "GAFTextField"
});
gaf.Sprite = gaf.Object.extend
({
    _className: "GAFSprite",
    _hasCtx: false,
    _hasFilter: false,
    ctor : function(gafSpriteProto, usedScale)
    {
        this._super(usedScale);
        cc.assert(gafSpriteProto, "Error! Missing mandatory parameter.");
        this._gafproto = gafSpriteProto;
    },
    _init : function()
    {
        var frame = this._gafproto.getFrame();
        cc.assert(frame instanceof cc.SpriteFrame, "Error. Wrong object type.");
        this._sprite = new cc.Sprite();
        this._sprite._renderCmd = this._gafCreateRenderCmd(this._sprite);
        this._sprite.initWithSpriteFrame(frame);
        this._sprite.setAnchorPoint(this._gafproto.getAnchor());
        this.addChild(this._sprite);
        this._sprite.setOpacityModifyRGB(true);
        if(cc._renderType === cc.game.RENDER_TYPE_WEBGL)
            this._sprite.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    },
    _applyState : function(state, parent)
    {
        this._applyStateSuper(state, parent);
        if(this._needsCtx)
        {
            if(!this._hasCtx)
            {
                this._enableCtx();
                this._hasCtx = true;
            }
            this._applyCtxState(state);
        }
        else
        {
            if(this._hasCtx)
            {
                this._disableCtx();
                this._hasCtx = false;
            }
            if(!cc.colorEqual(this._sprite._realColor, this._cascadeColorMult))
            {
                this._sprite.setColor(this._cascadeColorMult);
            }
            if(this._sprite.getOpacity() != this._cascadeColorMult.a)
            {
                this._sprite.setOpacity(this._cascadeColorMult.a);
            }
        }
    },
    _enableCtx: function()
    {
        this._sprite._renderCmd._enableCtx();
    },
    _disableCtx: function()
    {
        this._sprite._renderCmd._disableCtx();
    },
    _applyCtxState: function(state){
        this._sprite._renderCmd._applyCtxState(this);
    },
    getBoundingBoxForCurrentFrame: function ()
    {
        var result = this._sprite.getBoundingBox();
        return cc._rectApplyAffineTransformIn(result, this.getNodeToParentTransform());
    },
    _gafCreateRenderCmd: function(item){
        if(cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new gaf.Sprite.CanvasRenderCmd(item);
        else
            return new gaf.Sprite.WebGLRenderCmd(item);
    }
});
gaf.Mask = gaf.Object.extend
({
    _className: "GAFMask",
    _clippingNode: null,
    ctor : function(gafSpriteProto)
    {
        this._super();
        cc.assert(gafSpriteProto, "Error! Missing mandatory parameter.");
        this._gafproto = gafSpriteProto;
    },
    _init : function()
    {
        var maskNodeProto = this._gafproto.getMaskNodeProto();
        cc.assert(maskNodeProto, "Error. Mask node for id ref " + this._gafproto.getIdRef() + " not found.");
        this._maskNode = maskNodeProto._gafConstruct();
            this._clippingNode = cc.ClippingNode.create(this._maskNode);
        this._clippingNode.setAlphaThreshold(0.5);
        this.addChild(this._clippingNode);
    },
    setExternalTransform : function(affineTransform)
    {
        if(!cc.affineTransformEqualToTransform(this._maskNode._additionalTransform, affineTransform))
        {
            this._maskNode.setAdditionalTransform(affineTransform);
        }
    },
    _getNode : function()
    {
        return this._clippingNode;
    }
});
(function() {
    gaf.Sprite.CanvasRenderCmd = function (renderable) {
        cc.Sprite.CanvasRenderCmd.call(this, renderable);
        this._hasTintMult = false;
        this._hasTintOffset = false;
        this._hasCtx = false;
        this._tintMult = cc.color(255,255,255,255);
        this._tintOffset = cc.color(0,0,0,0);
        this._textureDirty = false;
    };
    var proto = gaf.Sprite.CanvasRenderCmd.prototype = Object.create(cc.Sprite.CanvasRenderCmd.prototype);
    proto.constructor = gaf.Sprite.CanvasRenderCmd;
    proto._disableCtx = function(){
        this._hasTintOffset = false;
        this._hasCtx = false;
        this._textureDirty = true;
        this.setDirtyFlag(cc.Node._dirtyFlags.colorDirty);
        this._tintMult = cc.color(255,255,255,255);
        this._tintOffset = cc.color(0,0,0,0);
    };
    proto._enableCtx = function(){
    };
    proto._applyCtxState = function(gafObject){
        var tintMult = gafObject._cascadeColorMult;
        var tintOffset = gafObject._cascadeColorOffset;
        var opacity = tintMult.a;
        if(this._node.getOpacity() != opacity)
        {
            this._node.setOpacity(opacity);
        }
        var multDirty = !cc.colorEqual(this._tintMult, tintMult);
        if(multDirty)
        {
            this._node.setColor(tintMult);
            this._tintMult = tintMult;
            this._hasTintMult =
                (tintMult.r !== 255 ||
                 tintMult.g !== 255 ||
                 tintMult.b !== 255 );
        }
        var offfsetDirty =
            (this._tintOffset.r != tintOffset.r) ||
            (this._tintOffset.g != tintOffset.g) ||
            (this._tintOffset.b != tintOffset.b) ||
            (this._tintOffset.a != tintOffset.a);
        if(offfsetDirty)
        {
            this._tintOffset = tintOffset;
            this._hasTintOffset =
                (tintOffset.r !== 0 ||
                 tintOffset.g !== 0 ||
                 tintOffset.b !== 0 ||
                 tintOffset.a !== 0 );
        }
        this._textureDirty = multDirty || offfsetDirty;
        if(this._textureDirty)
        {
            this.setDirtyFlag(cc.Node._dirtyFlags.colorDirty);
        }
        this._hasCtx = gafObject._filterStack.length > 0 && gafObject._filterStack[0].type === gaf.EFFECT_COLOR_MATRIX;
    };
    proto.rendering = function(ctx, scaleX, scaleY)
    {
        var node = this._node;
        var locTextureCoord = this._textureCoord,
            alpha = (this._displayedOpacity / 255);
        if ((node._texture && ((locTextureCoord.width === 0 || locTextureCoord.height === 0)
            || !node._texture._textureLoaded)) || alpha === 0)
            return;
        var wrapper = ctx || cc._renderContext,
            context = wrapper.getContext();
        var locX = node._offsetPosition.x,
            locHeight = node._rect.height,
            locWidth = node._rect.width,
            locY = -node._offsetPosition.y - locHeight,
            image;
        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        wrapper.setCompositeOperation(this._blendFuncStr);
        wrapper.setGlobalAlpha(alpha);
        if(node._flippedX || node._flippedY)
            wrapper.save();
        if (node._flippedX) {
            locX = -locX - locWidth;
            context.scale(-1, 1);
        }
        if (node._flippedY) {
            locY = node._offsetPosition.y;
            context.scale(1, -1);
        }
        image = node._texture._htmlElementObj;
        if (this._colorized) {
            context.drawImage(image,
                0, 0, locTextureCoord.width,locTextureCoord.height,
                locX * scaleX,locY * scaleY, locWidth * scaleX, locHeight * scaleY);
        } else {
            context.drawImage(image,
                locTextureCoord.renderX, locTextureCoord.renderY, locTextureCoord.width, locTextureCoord.height,
                locX * scaleX, locY * scaleY, locWidth * scaleX, locHeight * scaleY);
        }
        if(node._flippedX || node._flippedY)
            wrapper.restore();
        cc.g_NumberOfDraws++;
    };
    if(cc.sys._supportCanvasNewBlendModes){
        proto._updateColor = function () {
            var displayedColor = this._displayedColor, node = this._node;
            this._hasTintMult |= (displayedColor.r !== 255 || displayedColor.g !== 255 || displayedColor.b !== 255);
            if(this._textureDirty)
            {
                this._textureDirty = false;
                if (this._colorized) {
                    this._colorized = false;
                    node.texture = this._originalTexture;
                }
            }
            else
            {
                return;
            }
            var locElement, locTexture = node._texture, locRect = this._textureCoord;
            if(this._hasTintMult)
            {
                if (locTexture && locRect.validRect && this._originalTexture) {
                    locElement = locTexture.getHtmlElementObj();
                    if (!locElement)
                        return;
                    this._colorized = true;
                    if (this._hasTintOffset || this._hasCtx) displayedColor = this._tintMult;
                    locElement = cc.Sprite.CanvasRenderCmd._generateTintImageWithMultiply(this._originalTexture._htmlElementObj, displayedColor, locRect);
                    locTexture = new cc.Texture2D();
                    locTexture.initWithElement(locElement);
                    locTexture.handleLoadedTexture();
                    node.texture = locTexture;
                }
            }
            locTexture = node._texture;
            if(this._hasTintOffset)
            {
                var cacheTextureForColor = cc.textureCache.getTextureColors(this._originalTexture.getHtmlElementObj());
                if (locTexture && locRect.validRect && this._originalTexture) {
                    locElement = locTexture.getHtmlElementObj();
                    if (!locElement)
                        return;
                    if(this._colorized)
                        var texRect = cc.rect(0,0,locRect.width, locRect.height);
                    else
                        texRect = locRect;
                    locElement = this._gafGenerateTintImage(node.texture._htmlElementObj, texRect, cacheTextureForColor, this._tintOffset, locRect);
                    locTexture = new cc.Texture2D();
                    locTexture.initWithElement(locElement);
                    locTexture.handleLoadedTexture();
                    node.texture = locTexture;
                    this._colorized = true;
                }
            }
        };
        proto._gafGenerateTintImage = function(texture, texRect, tintedImgCache, color, rect, renderCanvas){
            if (!rect)
                rect = cc.rect(0, 0, texture.width, texture.height);
            var w = Math.min(rect.width, tintedImgCache[0].width);
            var h = Math.min(rect.height, tintedImgCache[0].height);
            var buff = renderCanvas, ctx;
            if (!buff) {
                buff = document.createElement("canvas");
                buff.width = w;
                buff.height = h;
                ctx = buff.getContext("2d");
            } else {
                ctx = buff.getContext("2d");
                ctx.clearRect(0, 0, w, h);
            }
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(tintedImgCache[2], rect.x, rect.y, w, h, 0, 0, w, h);
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',1)';
            ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';
            ctx.drawImage(texture, texRect.x, texRect.y, w, h, 0, 0, w, h);
            ctx.restore();
            return buff;
        };
    }
})();
gaf._TimeLineProto = function(asset, animationFrameCount, boundingBox, pivotPoint, id, linkageName)
{
    id = typeof id != 'undefined' ? id : 0;
    linkageName = linkageName || "";
    this._objects = [];
    this.getTotalFrames = function(){return animationFrameCount};
    this.getBoundingBox = function() {return boundingBox};
    this.getId = function() {return id};
    this.getLinkageName = function() {return linkageName};
    this.getPivot = function(){return pivotPoint};
    this.getRect = function(){return boundingBox};
    this.getNamedParts = function() {return {}};
    this.getSequences = function() {return {}};
    this.getFrames = function(){return []};
    this.getFps = function(){return 60};
    this.getObjects = function(){return this._objects};
    this.getAsset = function(){return asset};
    this._gafConstruct = function()
    {
        var usedScale = this.getAsset()._usedAtlasScale;
        var ret = new gaf.TimeLine(this, usedScale);
        ret._init();
        return ret;
    };
};
gaf._SpriteProto = function(asset, atlasFrames, elementAtlasIdRef)
{
    this.getFrames = function(){return atlasFrames};
    this.getIdRef = function(){return elementAtlasIdRef};
    this.getAsset = function() {return asset};
    this._gafConstruct = function()
    {
        var usedScale = this.getAsset()._usedAtlasScale;
        var ret = new gaf.Sprite(this, usedScale);
        ret._init();
        return ret;
    };
};
gaf._SpriteProto.prototype.getFrame = function()
{
    var usedScale = this.getAsset()._usedAtlasScale;
    cc.assert(usedScale, "Error. Atlas scale zero.");
    var frames = this.getFrames()[usedScale];
    cc.assert(frames, "Error. No frames found for used scale `"+usedScale+"`");
    return frames[this.getIdRef()];
};
gaf._SpriteProto.prototype.getAnchor = function()
{
    return this.getFrame()._gafAnchor;
};
gaf._MaskProto = function(asset, mask, idRef)
{
    this.getIdRef = function(){return idRef};
    this.getMaskNodeProto = function() {return mask};
    this._gafConstruct = function()
    {
        var ret = new gaf.Mask(this);
        ret._init();
        return ret;
    };
};
gaf.ReadSingleTag = function(stream){
    var tagId = stream.Ushort();
    var tag = gaf.Tags[tagId];
    var result = {};
    if(typeof tag === "undefined"){
        console.log("GAF. Non implemented tag detected.");
        gaf.Tags.Default.parse(stream, tagId);
    }
    else{
        result = tag.parse(stream, tagId);
    }
    return result;
};
gaf.ReadTags = function(stream){
    var tags = [];
    try {
        do {
            var tag = gaf.ReadSingleTag(stream);
            tags.push(tag);
        } while (tag.tagId != 0);
    }
    catch (e){
        if (e instanceof Error && e.message == "GAF format error"){
            console.log("GAF format error:\n" + e.stack);
        }
        else{
            console.log(e.stack);
            throw e;
        }
    }
    return tags;
};
gaf.Tag = function(){
    this.Default = Object.create(gaf.Tag.base);
    this["0"] = Object.create(gaf.Tag.End);
    this["1"] = Object.create(gaf.Tag.DefineAtlas);
    this["2"] = Object.create(gaf.Tag.DefineAnimationMasks);
    this["3"] = Object.create(gaf.Tag.DefineAnimationObjects);
    this["4"] = Object.create(gaf.Tag.DefineAnimationFrames);
    this["5"] = Object.create(gaf.Tag.DefineNamedParts);
    this["6"] = Object.create(gaf.Tag.DefineSequences);
    this["7"] = Object.create(gaf.Tag.DefineTextFields);
    this["8"] = Object.create(gaf.Tag.DefineAtlas2);
    this["9"] = Object.create(gaf.Tag.DefineStage);
    this["10"] = Object.create(gaf.Tag.DefineAnimationObjects2);
    this["11"] = Object.create(gaf.Tag.DefineAnimationMasks2);
    this["12"] = Object.create(gaf.Tag.DefineAnimationFrames2);
    this["13"] = Object.create(gaf.Tag.DefineTimeline);
};
gaf.Tag.base = function() {};
gaf.Tag.base.parse = function(stream, tagId){
    var size = stream.Uint();
    stream.startNestedBuffer(size);
    var result = this.doParse(stream);
    stream.endNestedBuffer();
    result.tagName = this.tagName;
    result.tagId = tagId;
    return result;
};
gaf.Tag.base.doParse = function(stream){
        return {};
    };
gaf.Tag.End = Object.create(gaf.Tag.base);
gaf.Tag.End.tagName = "TagEnd";
gaf.Tag.DefineAtlas = Object.create(gaf.Tag.base);
gaf.Tag.DefineAtlas.tagName = "TagDefineAtlas";
gaf.Tag.DefineAtlas.doParse = function (s) {
    var exec = s.fields(
        'scale', 'Float',
        'atlases', s.array('Ubyte', s.fields(
            'id', 'Uint',
            'sources', s.array('Ubyte', s.fields(
                'source', 'String',
                'csf', 'Float'
            ))
        )),
        'elements', s.array('Uint', s.fields(
            'pivot', 'Point',
            'origin', 'Point',
            'scale', 'Float',
            'size', 'Point',
            'atlasId', 'Uint',
            'elementAtlasId', 'Uint'
        ))
    );
    return {'content': exec()};
};
gaf.Tag.DefineAnimationMasks = Object.create(gaf.Tag.base);
gaf.Tag.DefineAnimationMasks.tagName = "TagDefineAnimationMasks";
gaf.Tag.DefineAnimationMasks.doParse = function (s) {
    var exec = s.array('Uint', s.fields(
            'objectId', 'Uint',
            'elementAtlasIdRef', 'Uint'
        ));
    var result = {'content': exec()};
    debugger;
    return result;
};
gaf.Tag.DefineAnimationObjects = Object.create(gaf.Tag.base);
gaf.Tag.DefineAnimationObjects.tagName = "TagDefineAnimationObjects";
gaf.Tag.DefineAnimationObjects.doParse = function (s) {
    var exec = s.array('Uint', s.fields(
        'objectId', 'Uint',
        'elementAtlasIdRef', 'Uint'
    ));
    return {'content': exec()};
};
gaf.Tag.DefineAnimationFrames = Object.create(gaf.Tag.base);
gaf.Tag.DefineAnimationFrames.tagName = "TagDefineAnimationFrames";
gaf.Tag.DefineAnimationFrames.doParse = function(s){
    var exec = s.array('Uint', s.fields(
        'frame', 'Uint',
        'state', s.array('Uint', s.fields(
            'hasColorTransform', 'Ubyte',
            'hasMask', 'Ubyte',
            'hasEffect', 'Ubyte',
            'objectIdRef', 'Uint',
            'depth', 'Int',
            'alpha', 'Float',
            'matrix', 'Matrix',
            'colorTransform', s.condition('hasColorTransform', 1, s.fields(
                'alphaOffset', 'Float',
                'redMultiplier', 'Float',
                'redOffset', 'Float',
                'greenMultiplier', 'Float',
                'greenOffset', 'Float',
                'blueMultiplier', 'Float',
                'blueOffset', 'Float'
            )),
            'effect', s.condition('hasEffect', 1, s.array('Ubyte', gaf.Tag._readFilter(s))),
            'maskObjectIdRef', s.condition('hasMask', 1, s.fields(
                'maskObjectIdRef', 'Uint'
            ))
        ))
    ));
    return {'content': exec()};
};
gaf.Tag.DefineNamedParts = Object.create(gaf.Tag.base);
gaf.Tag.DefineNamedParts.tagName = "TagDefineNamedParts";
gaf.Tag.DefineNamedParts.doParse = function(s) {
    var exec = s.array('Uint', s.fields(
        'objectId', 'Uint',
        'name', 'String'
    ));
    return {'content': exec()};
};
gaf.Tag.DefineSequences = Object.create(gaf.Tag.base);
gaf.Tag.DefineSequences.tagName = "TagDefineSequences";
gaf.Tag.DefineSequences.doParse = function(s) {
    var exec = s.array('Uint', s.fields(
        'id', 'String',
        'start', 'Ushort',
        'end', 'Ushort'
    ));
    return {'content': exec()};
};
gaf.Tag.DefineTextFields = Object.create(gaf.Tag.base);
gaf.Tag.DefineTextFields.tagName = "TagDefineTextFields";
gaf.Tag.DefineTextFields.doParse = function(s) {
    var exec = s.array('Uint', s.fields(
        'id', 'Uint',
        'pivot', 'Point',
        'end', 'Ushort',
        'width', 'Float',
        'height', 'Float',
        'text', 'String',
        'embedFonts', 'Boolean',
        'multiline', 'Boolean',
        'wordWrap', 'Boolean',
        'hasRestrict', 'Boolean',
        'restrict', s.condition('hasRestrict', 1, function (){return s['String'];}),
        'editable', 'Boolean',
        'selectable', 'Boolean',
        'displayAsPassword', 'Boolean',
        'maxChars', 'Uint',
        'align', 'Uint',
        'blockIndent', 'Uint',
        'bold', 'Boolean',
        'bullet', 'Boolean',
        'color', 'color',
        'font', 'String',
        'indent', 'Uint',
        'italic', 'Boolean',
        'kerning', 'Boolean',
        'leading', 'Uint',
        'leftMargin', 'Uint',
        'letterSpacing', 'Float',
        'rightMargin', 'Uint',
        'size', 'Uint',
        'tabStops', s.array('Uint', s.fields(
            'value', 'Uint'
        )),
        'target', 'string',
        'underline', 'Boolean',
        'url', 'String'
    ));
    return {'content': exec()};
};
gaf.Tag.DefineAtlas2 = Object.create(gaf.Tag.base);
gaf.Tag.DefineAtlas2.tagName = "TagDefineAtlas2";
gaf.Tag.DefineAtlas2.doParse = function(s) {
    var exec = s.fields(
        'scale', 'Float',
        'atlases', s.array('Ubyte', s.fields(
            'id', 'Uint',
            'sources', s.array('Ubyte', s.fields(
                'source', 'String',
                'csf', 'Float'
            ))
        )),
        'elements', s.array('Uint', s.fields(
            'pivot', 'Point',
            'origin', 'Point',
            'scale', 'Float',
            'size', 'Point',
            'atlasId', 'Uint',
            'elementAtlasId', 'Uint',
            'hasScale9Grid', 'Boolean',
            'scale9GridRect', s.condition('hasScale9Grid', 1, function(){return s.Rect();})
        ))
    );
    return {'content': exec()};
};
gaf.Tag.DefineStage = Object.create(gaf.Tag.base);
gaf.Tag.DefineStage.tagName = "TagDefineStage";
gaf.Tag.DefineStage.doParse = function(s) {
    var exec = s.fields(
        'fps', 'Ubyte',
        'color', 'color',
        'width', 'Ushort',
        'height', 'Ushort'
    );
    return {'content': exec()};
};
gaf.Tag.DefineAnimationObjects2 = Object.create(gaf.Tag.base);
gaf.Tag.DefineAnimationObjects2.tagName = "TagDefineAnimationObjects2";
gaf.Tag.DefineAnimationObjects2.doParse = function(s) {
    var exec = s.array('Uint', s.fields(
        'objectId', 'Uint',
        'elementAtlasIdRef', 'Uint',
        'type', 'Ushort'
    ));
    return {'content': exec()};
};
gaf.Tag.DefineAnimationMasks2 = Object.create(gaf.Tag.base);
gaf.Tag.DefineAnimationMasks2.tagName = "TagDefineAnimationMasks2";
gaf.Tag.DefineAnimationMasks2.doParse  = function(s) {
    var exec = s.array('Uint', s.fields(
        'objectId', 'Uint',
        'elementAtlasIdRef', 'Uint',
        'type', 'Ushort'
    ));
    return {'content': exec()};
};
gaf.Tag.DefineAnimationFrames2 = Object.create(gaf.Tag.base);
gaf.Tag.DefineAnimationFrames2.tagName = "TagDefineAnimationFrames2";
gaf.Tag.DefineAnimationFrames2.doParse = function(s) {
    var exec = s.array('Uint', s.fields(
        'frame', 'Uint',
        'hasChangesInDisplayList', 'Boolean',
        'hasActions', 'Boolean',
        'state', s.condition('hasChangesInDisplayList', 1, s.array('Uint', s.fields(
            'hasColorTransform', 'Boolean',
            'hasMask', 'Boolean',
            'hasEffect', 'Boolean',
            'objectIdRef', 'Uint',
            'depth', 'Int',
            'alpha', 'Float',
            'matrix', 'Matrix',
            'colorTransform', s.condition('hasColorTransform', 1, s.fields(
                'alphaOffset', 'Float',
                'redMultiplier', 'Float',
                'redOffset', 'Float',
                'greenMultiplier', 'Float',
                'greenOffset', 'Float',
                'blueMultiplier', 'Float',
                'blueOffset', 'Float'
            )),
            'effect', s.condition('hasEffect', 1, s.array('Ubyte', gaf.Tag._readFilter(s))),
            'maskObjectIdRef', s.condition('hasMask', 1, function(){return s.Uint()})
        ))),
        'actions',  s.condition('hasActions', 1, s.array('Uint', s.fields(
            'type', 'Uint',
            'scope', 'String',
            'params', gaf.Tag._readActionArguments(s)
        )))
    ));
    return {'content': exec()};
};
gaf.Tag.DefineTimeline = Object.create(gaf.Tag.base);
gaf.Tag.DefineTimeline.tagName = "TagDefineTimeline";
gaf.Tag.DefineTimeline.doParse = function(s) {
    var exec = s.fields(
        'id', 'Uint',
        'animationFrameCount', 'Uint',
        'boundingBox', 'Rect',
        'pivotPoint', 'Point',
        'hasLinkage', 'Boolean',
        'linkageName', s.condition('hasLinkage', 1, function () {
            return s.String();
        })
    );
    var result = {'content': exec()};
    result.content.tags = gaf.ReadTags(s);
    return result;
};
gaf.Tag._readActionArguments = function(s){
    return function(){
        var size = s.Uint();
        var ret = [];
        s.startNestedBuffer(size);
        while(s.maxOffset() < s.tell()){
            ret.push(s.String());
        }
        s.endNestedBuffer();
        return ret;
    };
};
gaf.Tag._readFilter = function(s){
    return s.fields(
        'type', 'Uint',
        'dropShadow', s.condition('type', gaf.EFFECT_DROP_SHADOW, s.fields(
            'color', 'color',
            'blurX', 'Float',
            'blurY', 'Float',
            'angle', 'Float',
            'distance', 'Float',
            'strength', 'Float',
            'inner', 'Boolean',
            'knockout', 'Boolean'
        )),
        'blur', s.condition('type', gaf.EFFECT_BLUR, s.fields(
            'blurX', 'Float',
            'blurY', 'Float'
        )),
        'glow', s.condition('type', gaf.EFFECT_GLOW, s.fields(
            'color', 'color',
            'blurX', 'Float',
            'blurY', 'Float',
            'strength', 'Float',
            'inner', 'Boolean',
            'knockout', 'Boolean'
        )),
        'colorMatrix', s.condition('type', gaf.EFFECT_COLOR_MATRIX, s.fields(
            'rr', 'Float', 'gr', 'Float', 'br', 'Float', 'ar', 'Float', 'r', 'Float',
            'rg', 'Float', 'gg', 'Float', 'bg', 'Float', 'ag', 'Float', 'g', 'Float',
            'rb', 'Float', 'gb', 'Float', 'bb', 'Float', 'ab', 'Float', 'b', 'Float',
            'ra', 'Float', 'ga', 'Float', 'ba', 'Float', 'aa', 'Float', 'a', 'Float'
        ))
    )
};
gaf.Tags = new gaf.Tag();
var gaf = gaf || {};
gaf.Loader = function(){
    var readHeaderBegin = function(stream, header){
        header.compression = stream.Uint();
        header.versionMajor = stream.Ubyte();
        header.versionMinor = stream.Ubyte();
        header.fileLength = stream.Uint();
    };
    var readHeaderEndV3 = function(stream, header) {
        header.framesCount = stream.Ushort();
        header.frameSize = stream.Rect();
        header.pivot = stream.Point();
    };
    var readHeaderEndV4 = function(stream, header){
        var scaleCount = stream.Uint();
        header.scaleValues = [];
        for(var i = 0; i < scaleCount; ++i){
            header.scaleValues.push(stream.Float());
        }
        var csfCount = stream.Uint();
        header.csfValues = [];
        for(var i = 0; i < csfCount; ++i){
            header.csfValues.push(stream.Float());
        }
    };
    this.LoadFile = function(filePath, onLoaded){
        var oReq = new XMLHttpRequest();
        oReq.open("GET", filePath, true);
        var self = this;
        oReq.responseType = "arraybuffer";
        oReq.onload = function(oEvent) {
            var gaf_data = new gaf.DataReader(oReq.response);
            var gafFile = self.LoadStream(gaf_data);
            if(onLoaded)
                onLoaded(gafFile);
        };
        oReq.send();
    };
    this.LoadStream = function(stream){
        var header = {};
        readHeaderBegin(stream, header);
        if(header.compression == gaf.COMPRESSION_NONE) {
        }
        else if(header.compression == gaf.COMPRESSION_ZIP){
            var compressed = stream.dataRaw.slice(stream.tell());
            var inflate = new window.Zlib.Inflate(new Uint8Array(compressed));
            var decompressed = inflate.decompress();
            stream = new gaf.DataReader(decompressed.buffer);
        }
        else{
            throw new Error("GAF syntax error.");
        }
        if(header.versionMajor < 4){
            readHeaderEndV3(stream, header);
        }
        else{
            readHeaderEndV4(stream, header);
        }
        var tags = gaf.ReadTags(stream);
        return {
            header: header,
            tags: tags
        };
    };
};
gaf.DataReader = function(data) {
    this.dataRaw = data;
    this.buf = new DataView(data);
    this.offset = [0];
};
gaf.DataReader.prototype.constructor = gaf.DataReader;
gaf.DataReader.prototype.newOffset = function(size){
    this.offset[this.offset.length - 1] += size;
    if(this.getOffset() > this.maxOffset()){
        throw new Error("GAF format error");
    }
    return this.offset[this.offset.length - 1] - size;
};
gaf.DataReader.prototype.maxOffset = function(){
    if(this.offset.length == 1){
        return this.buf.byteLength;
    }
    else{
        return this.offset[this.offset.length - 2];
    }
};
gaf.DataReader.prototype.getOffset = function(size){
    return this.offset[this.offset.length - 1];
};
gaf.DataReader.prototype.Ubyte = function() {
    return this.buf.getUint8(this.newOffset(1));
};
gaf.DataReader.prototype.Boolean = function() {
    var result = this.buf.getUint8(this.newOffset(1));
    if(result > 1){
        throw new Error("GAF format error");
    }
    return result;
};
gaf.DataReader.prototype.Uint = function() {
    return this.buf.getUint32(this.newOffset(4), true);
};
gaf.DataReader.prototype.Int = function() {
    return this.buf.getInt32(this.newOffset(4), true);
};
gaf.DataReader.prototype.color = function() {
    return {
        b: this.Ubyte(),
        g: this.Ubyte(),
        r: this.Ubyte(),
        a: this.Ubyte()
    };
};
gaf.DataReader.prototype.Ushort = function() {
    return this.buf.getUint16(this.newOffset(2), true);
};
gaf.DataReader.prototype.Float = function() {
    return this.buf.getFloat32(this.newOffset(4), true);
};
gaf.DataReader.prototype.String = function() {
    var strLen = this.Ushort();
    var from = this.newOffset(strLen);
    var to = this.getOffset();
    try
    {
        var str = this.dataRaw.slice(from, to);
    }
    catch(e)
    {
        if(e.message == "Object doesn't support property or method 'slice'")
        {
            str = [];
            for(var i = from; i < to; ++i)
                str.push(this.buf.getUint8(i));
        }
        else
        {
            throw(e);
        }
    }
    return decodeURIComponent(escape(String.fromCharCode.apply(null, new Uint8Array(str))));
};
gaf.DataReader.prototype.startNestedBuffer = function(length) {
    this.offset.push(this.offset[this.offset.length-1]);
    this.offset[this.offset.length-2] += length;
};
gaf.DataReader.prototype.endNestedBuffer = function() {
    if (this.offset.length == 1) throw new Error('No nested buffer available');
    this.offset.pop();
};
gaf.DataReader.prototype.Point = function(){
    return {
        x: this.Float(),
        y: this.Float()
    };
};
gaf.DataReader.prototype.Rect = function(){
    return {
        x: this.Float(),
        y: this.Float(),
        width: this.Float(),
        height: this.Float()
    };
};
gaf.DataReader.prototype.Matrix = function(){
    return {
        a: this.Float(),
        b: this.Float(),
        c: this.Float(),
        d: this.Float(),
        tx: this.Float(),
        ty: this.Float()
    };
};
gaf.DataReader.prototype.seek = function(pos){
    this.offset[this.offset.length-1] = pos;
};
gaf.DataReader.prototype.tell = function(){
    return this.offset[this.offset.length-1];
};
gaf.DataReader.prototype.fields = function(){
    var self = this;
    var arguments_ = arguments;
    return function(){
        arguments.callee.result = {};
        var i = 0;
        if(arguments_.length % 2){
            throw new Error('Number of arguments is not even');
        }
        while(i < arguments_.length){
            var field = arguments_[i++];
            var func = arguments_[i++];
            if(typeof func === 'function'){
                arguments.callee.result[field] = func();
            }
            else if (func in self && typeof self[func] === 'function'){
                arguments.callee.result[field] = self[func].call(self);
            }
            else{
                throw new Error('Object DataReader has no function `' + func + '`');
            }
        }
        return arguments.callee.result;
    }
};
gaf.DataReader.prototype.condition = function(key, value, func){
    var arguments_ = arguments;
    return function() {
        if(arguments_.length != 3){
            throw new Error('Condition function');
        }
        var parent = arguments.callee.caller;
        if(!('result' in parent)){
            throw new Error('Condition function caller has no key `result`');
        }
        var container = parent.result;
        var field = arguments_[0];
        var value = arguments_[1];
        var exec = arguments_[2];
        var evaluate = null;
        if(typeof value === 'function'){
            evaluate = function(){return value(container[field]);};
        }
        else{
            evaluate = function(){return value == container[field];};
        }
        if(evaluate()){
            return exec();
        }
        else{
            return null;
        }
    }
};
gaf.DataReader.prototype.array = function(){
    var self = this;
    var arguments_ = arguments;
    return function() {
        arguments.callee.result = [];
        var length = self[arguments_[0]].call(self);
        for (var i = 0; i < length; ++i) {
            var r = arguments_[1].call();
            arguments.callee.result.push(r);
        }
        return arguments.callee.result;
    }
};
gaf.SHADER_GAUSSIAN_BLUR_FRAG =
    "varying mediump vec2 v_texCoord;\n"
    + "uniform mediump vec2 u_step;\n"
    + "void main()\n"
    + "{ \n"
    + "    mediump vec4 sum = vec4(0.0);                                      \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 4.0) * 0.05;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 3.0) * 0.09;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 2.0) * 0.12;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 1.0) * 0.15;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 0.0) * 0.18;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 1.0) * 0.15;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 2.0) * 0.12;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 3.0) * 0.09;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 4.0) * 0.05;   \n"
    + "    gl_FragColor = sum;                                                \n"
    + "} \n";
gaf.SHADER_GLOW_FRAG =
    "varying mediump vec2 v_texCoord;\n"
    + "uniform mediump vec2 u_step;\n"
    + "uniform mediump vec4 u_glowColor;\n"
    + "void main()\n"
    + "{ \n"
    + "    mediump vec4 sum = vec4(0.0);                                      \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 4.0) * 0.05;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 3.0) * 0.09;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 2.0) * 0.12;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord - u_step * 1.0) * 0.15;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 0.0) * 0.18;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 1.0) * 0.15;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 2.0) * 0.12;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 3.0) * 0.09;   \n"
    + "    sum += texture2D(CC_Texture0, v_texCoord + u_step * 4.0) * 0.05;   \n"
    + "    gl_FragColor = sum * u_glowColor;                                  \n"
    + "} \n";
gaf.SHADER_COLOR_MATRIX_FRAG =
    "varying mediump vec2 v_texCoord;\n"
    + "varying mediump vec4 v_fragmentColor;\n"
    + "uniform mediump vec4 colorTransformMult;\n"
    + "uniform mediump vec4 colorTransformOffsets;\n"
    + "uniform mediump mat4 colorMatrix;\n"
    + "uniform mediump vec4 colorMatrix2;\n"
    + "void main()\n"
    + "{ \n"
    + "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);                          \n"
    + "    const float kMinimalAlphaAllowed = 1.0e-8;                                   \n"
    + "    if (texColor.a > kMinimalAlphaAllowed)                                       \n"
    + "    {                                                                            \n"
    + "        texColor = vec4(texColor.rgb / texColor.a, texColor.a);                  \n"
    + "        vec4 ctxColor = texColor * colorTransformMult + colorTransformOffsets;   \n"
    + "        vec4 adjustColor = colorMatrix * ctxColor + colorMatrix2;                \n"
    + "        adjustColor *= v_fragmentColor;                                          \n"
    + "        texColor = vec4(adjustColor.rgb * adjustColor.a, adjustColor.a);         \n"
    + "    }                                                                            \n"
    + "    gl_FragColor = texColor;                                                     \n"
    + "}\n";
gaf._glShaderInit = function() {
    gaf._Uniforms = {
        ColorTransformMult: -1,
        ColorTransformOffset: -1,
        ColorMatrixBody: -1,
        ColorMatrixAppendix: -1,
        BlurTexelOffset: -1,
        GlowTexelOffset: -1,
        GlowColor: -1
    };
    gaf._shaderCreate = function (fs, vs) {
        var program = new cc.GLProgram();
        var result = program.initWithVertexShaderByteArray(vs, fs);
        cc.assert(result, "Shader init error");
        program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        result = program.link();
        cc.assert(result, "Shader linking error");
        program.updateUniforms();
        return program;
    };
    gaf._shaderCreateAlpha = function () {
        var program = gaf._shaderCreate(gaf.SHADER_COLOR_MATRIX_FRAG, cc.SHADER_POSITION_TEXTURE_COLOR_VERT);
        gaf._Uniforms.ColorTransformMult = program.getUniformLocationForName(gaf.UNIFORM_ALPHA_TINT_MULT);
        gaf._Uniforms.ColorTransformOffset = program.getUniformLocationForName(gaf.UNIFORM_ALPHA_TINT_OFFSET);
        gaf._Uniforms.ColorMatrixBody = program.getUniformLocationForName(gaf.UNIFORM_ALPHA_COLOR_MATRIX_BODY);
        gaf._Uniforms.ColorMatrixAppendix = program.getUniformLocationForName(gaf.UNIFORM_ALPHA_COLOR_MATRIX_APPENDIX);
        return program;
    };
    gaf._shaderCreateBlur = function () {
        var program = gaf._shaderCreate(gaf.SHADER_GAUSSIAN_BLUR_FRAG, cc.SHADER_POSITION_TEXTURE_COLOR_VERT);
        gaf._Uniforms.BlurTexelOffset = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_BLUR_TEXEL_OFFSET);
        return program;
    };
    gaf._shaderCreateGlow = function () {
        var program = gaf._shaderCreate(gaf.SHADER_GLOW_FRAG, cc.SHADER_POSITION_TEXTURE_COLOR_VERT);
        gaf._Uniforms.GlowTexelOffset = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_GLOW_TEXEL_OFFSET);
        gaf._Uniforms.GlowColor = program._glContext.getUniformLocation(program._programObj, gaf.UNIFORM_GLOW_COLOR);
        return program;
    };
    gaf._Shaders = {
        Alpha: gaf._shaderCreateAlpha(),
        Blur: gaf._shaderCreateBlur(),
        Glow: gaf._shaderCreateGlow()
    };
};
gaf._setupShaders = function() {
    if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
        gaf._glShaderInit();
    }
    else {
        delete gaf._glShaderInit;
    }
};
gaf._AtlasLoader = {};
gaf._AtlasLoader.execute = function(condition, success, fail)
{
    condition() ? success() : fail();
};
gaf._AtlasLoader.checkAtlas = function(atlas)
{
    return function(){return atlas && typeof atlas !== "string" && atlas.isLoaded()};
};
gaf._AtlasLoader.load = function(path, success, fail)
{
    cc.textureCache.addImage(path, function(atlas){
        gaf._AtlasLoader.execute(
            gaf._AtlasLoader.checkAtlas(atlas),
            function(){success(atlas)},
            fail
        );
    });
};
gaf._AtlasLoader.loadFront = function(arr, success, fail)
{
    return function()
    {
        if (arr.length > 0){
            gaf._AtlasLoader.load(
                arr[0],
                success,
                gaf._AtlasLoader.loadFront(
                    arr.slice(1),
                    success,
                    fail
        ));}
        else
            fail();
    }
};
gaf._AtlasLoader.loadArray = function(array, success, fail)
{
    gaf._AtlasLoader.loadFront(array, success, fail)();
};
