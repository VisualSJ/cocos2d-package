cc.IMAGE_FORMAT_JPEG=0,cc.IMAGE_FORMAT_PNG=1,cc.IMAGE_FORMAT_RAWDATA=9,cc.NextPOT=function(a){return a-=1,a|=a>>1,a|=a>>2,a|=a>>4,a|=a>>8,a|=a>>16,a+1},cc.RenderTexture=cc.Node.extend({sprite:null,clearFlags:0,clearDepthVal:0,autoDraw:!1,_texture:null,_pixelFormat:cc.Texture2D.PIXEL_FORMAT_RGBA8888,clearStencilVal:0,_clearColor:null,_className:"RenderTexture",ctor:function(a,b,c,d){cc.Node.prototype.ctor.call(this),this._cascadeColorEnabled=!0,this._cascadeOpacityEnabled=!0,this._clearColor=new cc.Color(0,0,0,255),void 0!==a&&void 0!==b&&(c=c||cc.Texture2D.PIXEL_FORMAT_RGBA8888,d=d||0,this.initWithWidthAndHeight(a,b,c,d)),this.setAnchorPoint(0,0)},_createRenderCmd:function(){return cc._renderType===cc._RENDER_TYPE_CANVAS?new cc.RenderTexture.CanvasRenderCmd(this):new cc.RenderTexture.WebGLRenderCmd(this)},cleanup:function(){cc.Node.prototype.onExit.call(this),this._renderCmd.cleanup()},getSprite:function(){return this.sprite},setSprite:function(a){this.sprite=a},setVirtualViewport:function(a,b,c){this._renderCmd.setVirtualViewport(a,b,c)},initWithWidthAndHeight:function(a,b,c,d){return this._renderCmd.initWithWidthAndHeight(a,b,c,d)},begin:function(){cc.renderer._turnToCacheMode(this.__instanceId),this._renderCmd.begin()},beginWithClear:function(a,b,c,d,e,f){var g=cc._renderContext;e=e||g.COLOR_BUFFER_BIT,f=f||g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT,this._beginWithClear(a,b,c,d,e,f,g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT|g.STENCIL_BUFFER_BIT)},_beginWithClear:function(a,b,c,d,e,f,g){this.begin(),this._renderCmd._beginWithClear(a,b,c,d,e,f,g)},end:function(){this._renderCmd.end()},clear:function(a,b,c,d){this.beginWithClear(a,b,c,d),this.end()},clearRect:function(a,b,c,d){this._renderCmd.clearRect(a,b,c,d)},clearDepth:function(a){this._renderCmd.clearDepth(a)},clearStencil:function(a){this._renderCmd.clearStencil(a)},getClearFlags:function(){return this.clearFlags},setClearFlags:function(a){this.clearFlags=a},getClearColor:function(){return this._clearColor},setClearColor:function(a){var b=this._clearColor;b.r=a.r,b.g=a.g,b.b=a.b,b.a=a.a,this._renderCmd.updateClearColor(a)},getClearDepth:function(){return this.clearDepthVal},setClearDepth:function(a){this.clearDepthVal=a},getClearStencil:function(){return this.clearStencilVal},setClearStencil:function(a){this.clearStencilVal=a},isAutoDraw:function(){return this.autoDraw},setAutoDraw:function(a){this.autoDraw=a},saveToFile:function(a,b){cc.log("saveToFile isn't supported on Cocos2d-Html5")},newCCImage:function(a){return cc.log("saveToFile isn't supported on cocos2d-html5"),null},listenToBackground:function(a){},listenToForeground:function(a){}});var _p=cc.RenderTexture.prototype;_p.clearColorVal,cc.defineGetterSetter(_p,"clearColorVal",_p.getClearColor,_p.setClearColor),cc.RenderTexture.create=function(a,b,c,d){return new cc.RenderTexture(a,b,c,d)},function(){cc.RenderTexture.CanvasRenderCmd=function(a){cc.Node.CanvasRenderCmd.call(this,a),this._needDraw=!0,this._clearColorStr="rgba(255,255,255,1)",this._cacheCanvas=cc.newElement("canvas"),this._cacheContext=new cc.CanvasContextWrapper(this._cacheCanvas.getContext("2d"))};var a=cc.RenderTexture.CanvasRenderCmd.prototype=Object.create(cc.Node.CanvasRenderCmd.prototype);a.constructor=cc.RenderTexture.CanvasRenderCmd,a.cleanup=function(){this._cacheContext=null,this._cacheCanvas=null},a.clearStencil=function(a){},a.setVirtualViewport=function(a,b,c){},a.updateClearColor=function(a){this._clearColorStr="rgba("+(0|a.r)+","+(0|a.g)+","+(0|a.b)+","+a.a/255+")"},a.initWithWidthAndHeight=function(a,b,c,d){var e=this._node,f=this._cacheCanvas,g=cc.contentScaleFactor();f.width=0|a*g,f.height=0|b*g;var h=new cc.Texture2D;h.initWithElement(f),h.handleLoadedTexture();var i=e.sprite=new cc.Sprite(h);return i.setBlendFunc(cc.ONE,cc.ONE_MINUS_SRC_ALPHA),e.autoDraw=!1,e.addChild(i),!0},a.begin=function(){},a._beginWithClear=function(a,b,c,d,e,f,g){a=a||0,b=b||0,c=c||0,d=isNaN(d)?255:d;var h=this._cacheContext.getContext(),i=this._cacheCanvas;h.setTransform(1,0,0,1,0,0),this._cacheContext.setFillStyle("rgba("+(0|a)+","+(0|b)+","+(0|c)+","+d/255+")"),h.clearRect(0,0,i.width,i.height),h.fillRect(0,0,i.width,i.height)},a.end=function(){var a=this._node,b=cc.contentScaleFactor();cc.renderer._renderingToCacheCanvas(this._cacheContext,a.__instanceId,b,b)},a.clearRect=function(a,b,c,d){this._cacheContext.clearRect(a,b,c,-d)},a.clearDepth=function(a){cc.log("clearDepth isn't supported on Cocos2d-Html5")},a.visit=function(a){var b=this._node;this._syncStatus(a),b.sprite.visit(this),this._dirtyFlag=0}}();