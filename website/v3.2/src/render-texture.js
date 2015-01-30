cc.IMAGE_FORMAT_JPEG = 0;
cc.IMAGE_FORMAT_PNG = 1;
cc.IMAGE_FORMAT_RAWDATA = 9;
cc.NextPOT = function (x) {
    x = x - 1;
    x = x | (x >> 1);
    x = x | (x >> 2);
    x = x | (x >> 4);
    x = x | (x >> 8);
    x = x | (x >> 16);
    return x + 1;
};
cc.RenderTexture = cc.Node.extend({
	sprite:null,
	clearFlags:0,
	clearDepthVal:0,
	autoDraw:false,
    _texture:null,
    _pixelFormat:cc.Texture2D.PIXEL_FORMAT_RGBA8888,
    clearStencilVal:0,
    _clearColor:null,
    _className:"RenderTexture",
    ctor: function(width, height, format, depthStencilFormat){
        cc.Node.prototype.ctor.call(this);
        this._cascadeColorEnabled = true;
        this._cascadeOpacityEnabled = true;
        this._clearColor = new cc.Color(0,0,0,255);
        if(width !== undefined && height !== undefined) {
            format = format || cc.Texture2D.PIXEL_FORMAT_RGBA8888;
            depthStencilFormat = depthStencilFormat || 0;
            this.initWithWidthAndHeight(width, height, format, depthStencilFormat);
        }
        this.setAnchorPoint(0,0);
    },
    _createRenderCmd: function(){
        if(cc._renderType === cc._RENDER_TYPE_CANVAS)
            return new cc.RenderTexture.CanvasRenderCmd(this);
        else
            return new cc.RenderTexture.WebGLRenderCmd(this);
    },
    cleanup: function(){
        cc.Node.prototype.onExit.call(this);
        this._renderCmd.cleanup();
    },
    getSprite:function () {
        return this.sprite;
    },
    setSprite:function (sprite) {
        this.sprite = sprite;
    },
    initWithWidthAndHeight: function(width, height, format, depthStencilFormat){
        return this._renderCmd.initWithWidthAndHeight(width, height, format, depthStencilFormat);
    },
    begin: function(){
        cc.renderer._turnToCacheMode(this.__instanceId);
        this._renderCmd.begin();
    },
    beginWithClear:function (r, g, b, a, depthValue, stencilValue) {
        var gl = cc._renderContext;
        depthValue = depthValue || gl.COLOR_BUFFER_BIT;
        stencilValue = stencilValue || (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this._beginWithClear(r , g , b , a , depthValue, stencilValue, (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT));
    },
    _beginWithClear: function(r, g, b, a, depthValue, stencilValue, flags){
        this.begin();
        this._renderCmd._beginWithClear(r, g, b, a, depthValue, stencilValue, flags);
    },
    end: function(){
        this._renderCmd.end();
    },
    clear:function (r, g, b, a) {
        this.beginWithClear(r, g, b, a);
        this.end();
    },
    clearRect: function(x, y, width, height){
        this._renderCmd.clearRect(x, y, width, height);
    },
    clearDepth: function(depthValue){
        this._renderCmd.clearDepth(depthValue);
    },
    clearStencil: function(stencilValue) {
        this._renderCmd.clearStencil(stencilValue);
    },
    getClearFlags:function () {
        return this.clearFlags;
    },
    setClearFlags:function (clearFlags) {
        this.clearFlags = clearFlags;
    },
    getClearColor:function () {
        return this._clearColor;
    },
    setClearColor: function(clearColor){
        var locClearColor = this._clearColor;
        locClearColor.r = clearColor.r;
        locClearColor.g = clearColor.g;
        locClearColor.b = clearColor.b;
        locClearColor.a = clearColor.a;
        this._renderCmd.updateClearColor(clearColor);
    },
    getClearDepth:function () {
        return this.clearDepthVal;
    },
    setClearDepth:function (clearDepth) {
        this.clearDepthVal = clearDepth;
    },
    getClearStencil:function () {
        return this.clearStencilVal;
    },
    setClearStencil:function (clearStencil) {
        this.clearStencilVal = clearStencil;
    },
    isAutoDraw:function () {
        return this.autoDraw;
    },
    setAutoDraw:function (autoDraw) {
        this.autoDraw = autoDraw;
    },
    saveToFile:function (filePath, format) {
        cc.log("saveToFile isn't supported on Cocos2d-Html5");
    },
    newCCImage:function(flipImage){
        cc.log("saveToFile isn't supported on cocos2d-html5");
        return null;
    },
    listenToBackground:function (obj) { },
    listenToForeground:function (obj) { }
});
var _p = cc.RenderTexture.prototype;
_p.clearColorVal;
cc.defineGetterSetter(_p, "clearColorVal", _p.getClearColor, _p.setClearColor);
cc.RenderTexture.create = function (width, height, format, depthStencilFormat) {
    return new cc.RenderTexture(width, height, format, depthStencilFormat);
};
(function(){
    cc.RenderTexture.CanvasRenderCmd = function(renderableObject){
        cc.Node.CanvasRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._clearColorStr = "rgba(255,255,255,1)";
        this._cacheCanvas = cc.newElement('canvas');
        this._cacheContext = new cc.CanvasContextWrapper(this._cacheCanvas.getContext('2d'));
    };
    var proto = cc.RenderTexture.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    proto.constructor = cc.RenderTexture.CanvasRenderCmd;
    proto.cleanup = function(){
        this._cacheContext = null;
        this._cacheCanvas = null;
    };
    proto.clearStencil = function (stencilValue) { };
    proto.updateClearColor = function(clearColor){
        this._clearColorStr = "rgba(" + (0 | clearColor.r) + "," + (0 | clearColor.g) + "," + (0 | clearColor.b) + "," + clearColor.a / 255 + ")";
    };
    proto.initWithWidthAndHeight = function(width, height, format, depthStencilFormat){
        var node = this._node;
        var locCacheCanvas = this._cacheCanvas, locScaleFactor = cc.contentScaleFactor();
        locCacheCanvas.width = 0 | (width * locScaleFactor);
        locCacheCanvas.height = 0 | (height * locScaleFactor);
        var texture = new cc.Texture2D();
        texture.initWithElement(locCacheCanvas);
        texture.handleLoadedTexture();
        var locSprite = node.sprite = new cc.Sprite(texture);
        locSprite.setBlendFunc(cc.ONE, cc.ONE_MINUS_SRC_ALPHA);
        node.autoDraw = false;
        node.addChild(locSprite);
        return true;
    };
    proto.begin = function(){};
    proto._beginWithClear = function(r, g, b, a, depthValue, stencilValue, flags){
        r = r || 0;
        g = g || 0;
        b = b || 0;
        a = isNaN(a) ? 1 : a;
        var context = this._cacheContext.getContext();
        var locCanvas = this._cacheCanvas;
        context.setTransform(1,0,0,1,0,0);
        this._cacheContext.setFillStyle("rgba(" + (0 | r) + "," + (0 | g) + "," + (0 | b) + "," + a / 255 + ")");
        context.clearRect(0, 0, locCanvas.width, locCanvas.height);
        context.fillRect(0, 0, locCanvas.width, locCanvas.height);
    };
    proto.end = function(){
        var node = this._node;
        var scale = cc.contentScaleFactor();
        cc.renderer._renderingToCacheCanvas(this._cacheContext, node.__instanceId, scale, scale);
    };
    proto.clearRect = function(x, y, width, height){
        this._cacheContext.clearRect(x, y, width, -height);
    };
    proto.clearDepth = function(depthValue){
        cc.log("clearDepth isn't supported on Cocos2d-Html5");
    };
    proto.visit = function(parentCmd){
        var node = this._node;
        this._syncStatus(parentCmd);
        node.sprite.visit(this);
        this._dirtyFlag = 0;
    };
})();
