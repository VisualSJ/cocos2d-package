var _p=cc.inputManager;_p.setAccelerometerEnabled=function(a){var b=this;if(b._accelEnabled!==a){b._accelEnabled=a;var c=cc.director.getScheduler();b._accelEnabled?(b._accelCurTime=0,c.scheduleUpdate(b)):(b._accelCurTime=0,c.scheduleUpdate(b))}},_p.setAccelerometerInterval=function(a){this._accelInterval!==a&&(this._accelInterval=a)},_p._registerKeyboardEvent=function(){cc._canvas.addEventListener("keydown",function(a){cc.eventManager.dispatchEvent(new cc.EventKeyboard(a.keyCode,!0)),a.stopPropagation(),a.preventDefault()},!1),cc._canvas.addEventListener("keyup",function(a){cc.eventManager.dispatchEvent(new cc.EventKeyboard(a.keyCode,!1)),a.stopPropagation(),a.preventDefault()},!1)},_p._registerAccelerometerEvent=function(){var a=window,b=this;b._acceleration=new cc.Acceleration,b._accelDeviceEvent=a.DeviceMotionEvent||a.DeviceOrientationEvent,cc.sys.browserType===cc.sys.BROWSER_TYPE_MOBILE_QQ&&(b._accelDeviceEvent=window.DeviceOrientationEvent);var c=b._accelDeviceEvent===a.DeviceMotionEvent?"devicemotion":"deviceorientation",d=navigator.userAgent;(/Android/.test(d)||/Adr/.test(d)&&cc.sys.browserType===cc.BROWSER_TYPE_UC)&&(b._minus=-1),a.addEventListener(c,b.didAccelerate.bind(b),!1)},_p.didAccelerate=function(a){var b=this,c=window;if(b._accelEnabled){var d,e,f,g=b._acceleration;if(b._accelDeviceEvent===window.DeviceMotionEvent){var h=a.accelerationIncludingGravity;d=b._accelMinus*h.x*.1,e=b._accelMinus*h.y*.1,f=.1*h.z}else d=a.gamma/90*.981,e=.981*-(a.beta/90),f=a.alpha/90*.981;g.x=d,g.y=e,g.z=f,g.timestamp=a.timeStamp||Date.now();var i=g.x;c.orientation===cc.UIInterfaceOrientationLandscapeRight?(g.x=-g.y,g.y=i):c.orientation===cc.UIInterfaceOrientationLandscapeLeft?(g.x=g.y,g.y=-i):c.orientation===cc.UIInterfaceOrientationPortraitUpsideDown&&(g.x=-g.x,g.y=-g.y)}},delete _p,cc.vertexLineToPolygon=function(a,b,c,d,e){if(e+=d,!(1>=e)){b*=.5;for(var f,g=e-1,h=d;e>h;h++){f=2*h;var i,j=cc.p(a[2*h],a[2*h+1]);if(0===h)i=cc.pPerp(cc.pNormalize(cc.pSub(j,cc.p(a[2*(h+1)],a[2*(h+1)+1]))));else if(h===g)i=cc.pPerp(cc.pNormalize(cc.pSub(cc.p(a[2*(h-1)],a[2*(h-1)+1]),j)));else{var k=cc.p(a[2*(h-1)],a[2*(h-1)+1]),l=cc.p(a[2*(h+1)],a[2*(h+1)+1]),m=cc.pNormalize(cc.pSub(l,j)),n=cc.pNormalize(cc.pSub(k,j)),o=Math.acos(cc.pDot(m,n));i=o<cc.degreesToRadians(70)?cc.pPerp(cc.pNormalize(cc.pMidpoint(m,n))):o<cc.degreesToRadians(170)?cc.pNormalize(cc.pMidpoint(m,n)):cc.pPerp(cc.pNormalize(cc.pSub(l,k)))}i=cc.pMult(i,b),c[2*f]=j.x+i.x,c[2*f+1]=j.y+i.y,c[2*(f+1)]=j.x-i.x,c[2*(f+1)+1]=j.y-i.y}for(d=0===d?0:d-1,h=d;g>h;h++){f=2*h;var p=f+2,q=cc.vertex2(c[2*f],c[2*f+1]),r=cc.vertex2(c[2*(f+1)],c[2*(f+1)+1]),s=cc.vertex2(c[2*p],c[2*p]),t=cc.vertex2(c[2*(p+1)],c[2*(p+1)+1]),u=!cc.vertexLineIntersect(q.x,q.y,t.x,t.y,r.x,r.y,s.x,s.y);u.isSuccess||(u.value<0||u.value>1)&&(u.isSuccess=!0),u.isSuccess&&(c[2*p]=t.x,c[2*p+1]=t.y,c[2*(p+1)]=s.x,c[2*(p+1)+1]=s.y)}}},cc.vertexLineIntersect=function(a,b,c,d,e,f,g,h){var i,j,k,l;if(a===c&&b===d||e===g&&f===h)return{isSuccess:!1,value:0};if(c-=a,d-=b,e-=a,f-=b,g-=a,h-=b,i=Math.sqrt(c*c+d*d),j=c/i,k=d/i,l=e*j+f*k,f=f*j-e*k,e=l,l=g*j+h*k,h=h*j-g*k,g=l,f===h)return{isSuccess:!1,value:0};var m=(g+(e-g)*h/(h-f))/i;return{isSuccess:!0,value:m}},cc.vertexListIsClockwise=function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b],e=a[(b+1)%c],f=a[(b+2)%c];if(cc.pCross(cc.pSub(e,d),cc.pSub(f,e))>0)return!1}return!0},cc.CGAffineToGL=function(a,b){b[2]=b[3]=b[6]=b[7]=b[8]=b[9]=b[11]=b[14]=0,b[10]=b[15]=1,b[0]=a.a,b[4]=a.c,b[12]=a.tx,b[1]=a.b,b[5]=a.d,b[13]=a.ty},cc.GLToCGAffine=function(a,b){b.a=a[0],b.c=a[4],b.tx=a[12],b.b=a[1],b.d=a[5],b.ty=a[13]},cc.EventAcceleration=cc.Event.extend({_acc:null,ctor:function(a){cc.Event.prototype.ctor.call(this,cc.Event.ACCELERATION),this._acc=a}}),cc.EventKeyboard=cc.Event.extend({_keyCode:0,_isPressed:!1,ctor:function(a,b){cc.Event.prototype.ctor.call(this,cc.Event.KEYBOARD),this._keyCode=a,this._isPressed=b}}),cc._EventListenerAcceleration=cc.EventListener.extend({_onAccelerationEvent:null,ctor:function(a){this._onAccelerationEvent=a;var b=this,c=function(a){b._onAccelerationEvent(a._acc,a)};cc.EventListener.prototype.ctor.call(this,cc.EventListener.ACCELERATION,cc._EventListenerAcceleration.LISTENER_ID,c)},checkAvailable:function(){return cc.assert(this._onAccelerationEvent,cc._LogInfos._EventListenerAcceleration_checkAvailable),!0},clone:function(){return new cc._EventListenerAcceleration(this._onAccelerationEvent)}}),cc._EventListenerAcceleration.LISTENER_ID="__cc_acceleration",cc._EventListenerAcceleration.create=function(a){return new cc._EventListenerAcceleration(a)},cc._EventListenerKeyboard=cc.EventListener.extend({onKeyPressed:null,onKeyReleased:null,ctor:function(){var a=this,b=function(b){b._isPressed?a.onKeyPressed&&a.onKeyPressed(b._keyCode,b):a.onKeyReleased&&a.onKeyReleased(b._keyCode,b)};cc.EventListener.prototype.ctor.call(this,cc.EventListener.KEYBOARD,cc._EventListenerKeyboard.LISTENER_ID,b)},clone:function(){var a=new cc._EventListenerKeyboard;return a.onKeyPressed=this.onKeyPressed,a.onKeyReleased=this.onKeyReleased,a},checkAvailable:function(){return null===this.onKeyPressed&&null===this.onKeyReleased?(cc.log(cc._LogInfos._EventListenerKeyboard_checkAvailable),!1):!0}}),cc._EventListenerKeyboard.LISTENER_ID="__cc_keyboard",cc._EventListenerKeyboard.create=function(){return new cc._EventListenerKeyboard},cc.AtlasNode=cc.Node.extend({textureAtlas:null,quadsToDraw:0,_itemsPerRow:0,_itemsPerColumn:0,_itemWidth:0,_itemHeight:0,_opacityModifyRGB:!1,_blendFunc:null,_ignoreContentScaleFactor:!1,_className:"AtlasNode",_texture:null,_textureForCanvas:null,ctor:function(a,b,c,d){cc.Node.prototype.ctor.call(this),this._blendFunc={src:cc.BLEND_SRC,dst:cc.BLEND_DST},this._ignoreContentScaleFactor=!1,void 0!==d&&this.initWithTileFile(a,b,c,d)},_createRenderCmd:function(){cc._renderType===cc.game.RENDER_TYPE_CANVAS?this._renderCmd=new cc.AtlasNode.CanvasRenderCmd(this):this._renderCmd=new cc.AtlasNode.WebGLRenderCmd(this)},updateAtlasValues:function(){cc.log(cc._LogInfos.AtlasNode_updateAtlasValues)},getColor:function(){return this._opacityModifyRGB?this._renderCmd._colorUnmodified:cc.Node.prototype.getColor.call(this)},setOpacityModifyRGB:function(a){var b=this.color;this._opacityModifyRGB=a,this.setColor(b)},isOpacityModifyRGB:function(){return this._opacityModifyRGB},getBlendFunc:function(){return this._blendFunc},setBlendFunc:function(a,b){void 0===b?this._blendFunc=a:this._blendFunc={src:a,dst:b}},setTextureAtlas:function(a){this.textureAtlas=a},getTextureAtlas:function(){return this.textureAtlas},getQuadsToDraw:function(){return this.quadsToDraw},setQuadsToDraw:function(a){this.quadsToDraw=a},initWithTileFile:function(a,b,c,d){if(!a)throw new Error("cc.AtlasNode.initWithTileFile(): title should not be null");var e=cc.textureCache.addImage(a);return this.initWithTexture(e,b,c,d)},initWithTexture:function(a,b,c,d){return this._renderCmd.initWithTexture(a,b,c,d)},setColor:function(a){this._renderCmd.setColor(a)},setOpacity:function(a){this._renderCmd.setOpacity(a)},getTexture:function(){return this._texture},setTexture:function(a){this._texture=a},_setIgnoreContentScaleFactor:function(a){this._ignoreContentScaleFactor=a}});var _p=cc.AtlasNode.prototype;cc.defineGetterSetter(_p,"opacity",_p.getOpacity,_p.setOpacity),cc.defineGetterSetter(_p,"color",_p.getColor,_p.setColor),_p.texture,cc.defineGetterSetter(_p,"texture",_p.getTexture,_p.setTexture),_p.textureAtlas,_p.quadsToDraw,cc.EventHelper.prototype.apply(_p),cc.AtlasNode.create=function(a,b,c,d){return new cc.AtlasNode(a,b,c,d)},function(){cc.AtlasNode.CanvasRenderCmd=function(a){cc.Node.CanvasRenderCmd.call(this,a),this._needDraw=!1,this._colorUnmodified=cc.color.WHITE,this._textureToRender=null};var a=cc.AtlasNode.CanvasRenderCmd.prototype=Object.create(cc.Node.CanvasRenderCmd.prototype);a.constructor=cc.AtlasNode.CanvasRenderCmd,a.initWithTexture=function(a,b,c,d){var e=this._node;return e._itemWidth=b,e._itemHeight=c,e._opacityModifyRGB=!0,e._texture=a,e._texture?(this._textureToRender=a,this._calculateMaxItems(),e.quadsToDraw=d,!0):(cc.log(cc._LogInfos.AtlasNode__initWithTexture),!1)},a.setColor=function(a){var b=this._node,c=b._realColor;c.r===a.r&&c.g===a.g&&c.b===a.b||(this._colorUnmodified=a,this._changeTextureColor())},a._changeTextureColor=function(){var a=this._node,b=a._texture,c=this._colorUnmodified,d=b.getHtmlElementObj(),e=cc.rect(0,0,d.width,d.height);b===this._textureToRender?this._textureToRender=b._generateColorTexture(c.r,c.g,c.b,e):b._generateColorTexture(c.r,c.g,c.b,e,this._textureToRender.getHtmlElementObj())},a.setOpacity=function(a){var b=this._node;cc.Node.prototype.setOpacity.call(b,a)},a._calculateMaxItems=function(){var a=this._node,b=a._texture,c=b.getContentSize();a._itemsPerColumn=0|c.height/a._itemHeight,a._itemsPerRow=0|c.width/a._itemWidth}}(),cc.TextureAtlas=cc.Class.extend({dirty:!1,texture:null,_indices:null,_buffersVBO:null,_capacity:0,_quads:null,_quadsArrayBuffer:null,_quadsWebBuffer:null,_quadsReader:null,ctor:function(a,b){this._buffersVBO=[],cc.isString(a)?this.initWithFile(a,b):a instanceof cc.Texture2D&&this.initWithTexture(a,b)},getTotalQuads:function(){return this._totalQuads},getCapacity:function(){return this._capacity},getTexture:function(){return this.texture},setTexture:function(a){this.texture=a},setDirty:function(a){this.dirty=a},isDirty:function(){return this.dirty},getQuads:function(){return this._quads},setQuads:function(a){this._quads=a},_copyQuadsToTextureAtlas:function(a,b){if(a)for(var c=0;c<a.length;c++)this._setQuadToArray(a[c],b+c)},_setQuadToArray:function(a,b){var c=this._quads;return c[b]?(c[b].bl=a.bl,c[b].br=a.br,c[b].tl=a.tl,void(c[b].tr=a.tr)):void(c[b]=new cc.V3F_C4B_T2F_Quad(a.tl,a.bl,a.tr,a.br,this._quadsArrayBuffer,b*cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT))},description:function(){return"<cc.TextureAtlas | totalQuads ="+this._totalQuads+">"},_setupIndices:function(){if(0!==this._capacity)for(var a=this._indices,b=this._capacity,c=0;b>c;c++)cc.TEXTURE_ATLAS_USE_TRIANGLE_STRIP?(a[6*c+0]=4*c+0,a[6*c+1]=4*c+0,a[6*c+2]=4*c+2,a[6*c+3]=4*c+1,a[6*c+4]=4*c+3,a[6*c+5]=4*c+3):(a[6*c+0]=4*c+0,a[6*c+1]=4*c+1,a[6*c+2]=4*c+2,a[6*c+3]=4*c+3,a[6*c+4]=4*c+2,a[6*c+5]=4*c+1)},_setupVBO:function(){var a=cc._renderContext;this._buffersVBO[0]=a.createBuffer(),this._buffersVBO[1]=a.createBuffer(),this._quadsWebBuffer=a.createBuffer(),this._mapBuffers()},_mapBuffers:function(){var a=cc._renderContext;a.bindBuffer(a.ARRAY_BUFFER,this._quadsWebBuffer),a.bufferData(a.ARRAY_BUFFER,this._quadsArrayBuffer,a.DYNAMIC_DRAW),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this._buffersVBO[1]),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this._indices,a.STATIC_DRAW)},initWithFile:function(a,b){var c=cc.textureCache.addImage(a);return c?this.initWithTexture(c,b):(cc.log(cc._LogInfos.TextureAtlas_initWithFile,a),!1)},initWithTexture:function(a,b){cc.assert(a,cc._LogInfos.TextureAtlas_initWithTexture),b=0|b,this._capacity=b,this._totalQuads=0,this.texture=a,this._quads=[],this._indices=new Uint16Array(6*b);var c=cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;if(this._quadsArrayBuffer=new ArrayBuffer(c*b),this._quadsReader=new Uint8Array(this._quadsArrayBuffer),(!this._quads||!this._indices)&&b>0)return!1;for(var d=this._quads,e=0;b>e;e++)d[e]=new cc.V3F_C4B_T2F_Quad(null,null,null,null,this._quadsArrayBuffer,e*c);return this._setupIndices(),this._setupVBO(),this.dirty=!0,!0},updateQuad:function(a,b){cc.assert(a,cc._LogInfos.TextureAtlas_updateQuad),cc.assert(b>=0&&b<this._capacity,cc._LogInfos.TextureAtlas_updateQuad_2),this._totalQuads=Math.max(b+1,this._totalQuads),this._setQuadToArray(a,b),this.dirty=!0},insertQuad:function(a,b){if(cc.assert(b<this._capacity,cc._LogInfos.TextureAtlas_insertQuad_2),this._totalQuads++,this._totalQuads>this._capacity)return void cc.log(cc._LogInfos.TextureAtlas_insertQuad);var c=cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,d=this._totalQuads-1-b,e=b*c,f=d*c;this._quads[this._totalQuads-1]=new cc.V3F_C4B_T2F_Quad(null,null,null,null,this._quadsArrayBuffer,(this._totalQuads-1)*c),this._quadsReader.set(this._quadsReader.subarray(e,e+f),e+c),this._setQuadToArray(a,b),this.dirty=!0},insertQuads:function(a,b,c){c=c||a.length,cc.assert(b+c<=this._capacity,cc._LogInfos.TextureAtlas_insertQuads);var d=cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;if(this._totalQuads+=c,this._totalQuads>this._capacity)return void cc.log(cc._LogInfos.TextureAtlas_insertQuad);var e,f=this._totalQuads-1-b-c,g=b*d,h=f*d,i=this._totalQuads-1-c;for(e=0;c>e;e++)this._quads[i+e]=new cc.V3F_C4B_T2F_Quad(null,null,null,null,this._quadsArrayBuffer,(this._totalQuads-1)*d);for(this._quadsReader.set(this._quadsReader.subarray(g,g+h),g+d*c),e=0;c>e;e++)this._setQuadToArray(a[e],b+e);this.dirty=!0},insertQuadFromIndex:function(a,b){if(a!==b){cc.assert(b>=0||b<this._totalQuads,cc._LogInfos.TextureAtlas_insertQuadFromIndex),cc.assert(a>=0||a<this._totalQuads,cc._LogInfos.TextureAtlas_insertQuadFromIndex_2);var c,d,e=cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,f=this._quadsReader,g=f.subarray(a*e,e);a>b?(c=b*e,d=(a-b)*e,f.set(f.subarray(c,c+d),c+e),f.set(g,c)):(c=(a+1)*e,d=(b-a)*e,f.set(f.subarray(c,c+d),c-e),f.set(g,b*e)),this.dirty=!0}},removeQuadAtIndex:function(a){cc.assert(a<this._totalQuads,cc._LogInfos.TextureAtlas_removeQuadAtIndex);var b=cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT;if(this._totalQuads--,this._quads.length=this._totalQuads,a!==this._totalQuads){var c=(a+1)*b,d=(this._totalQuads-a)*b;this._quadsReader.set(this._quadsReader.subarray(c,c+d),c-b)}this.dirty=!0},removeQuadsAtIndex:function(a,b){if(cc.assert(a+b<=this._totalQuads,cc._LogInfos.TextureAtlas_removeQuadsAtIndex),this._totalQuads-=b,a!==this._totalQuads){var c=cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,d=(a+b)*c,e=(this._totalQuads-a)*c,f=a*c;this._quadsReader.set(this._quadsReader.subarray(d,d+e),f)}this.dirty=!0},removeAllQuads:function(){this._quads.length=0,this._totalQuads=0},_setDirty:function(a){this.dirty=a},resizeCapacity:function(a){if(a===this._capacity)return!0;var b=cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,c=this._capacity;this._totalQuads=Math.min(this._totalQuads,a),this._capacity=0|a;var d,e=this._capacity,f=this._totalQuads;if(null===this._quads)for(this._quads=[],this._quadsArrayBuffer=new ArrayBuffer(b*e),this._quadsReader=new Uint8Array(this._quadsArrayBuffer),d=0;e>d;d++)this._quads=new cc.V3F_C4B_T2F_Quad(null,null,null,null,this._quadsArrayBuffer,d*b);else{var g,h,i=this._quads;if(e>c){for(g=[],h=new ArrayBuffer(b*e),d=0;f>d;d++)g[d]=new cc.V3F_C4B_T2F_Quad(i[d].tl,i[d].bl,i[d].tr,i[d].br,h,d*b);for(;e>d;d++)g[d]=new cc.V3F_C4B_T2F_Quad(null,null,null,null,h,d*b);this._quadsReader=new Uint8Array(h),this._quads=g,this._quadsArrayBuffer=h}else{var j=Math.max(f,e);for(g=[],h=new ArrayBuffer(b*e),d=0;j>d;d++)g[d]=new cc.V3F_C4B_T2F_Quad(i[d].tl,i[d].bl,i[d].tr,i[d].br,h,d*b);this._quadsReader=new Uint8Array(h),this._quads=g,this._quadsArrayBuffer=h}}if(null===this._indices)this._indices=new Uint16Array(6*e);else if(e>c){var k=new Uint16Array(6*e);k.set(this._indices,0),this._indices=k}else this._indices=this._indices.subarray(0,6*e);return this._setupIndices(),this._mapBuffers(),this.dirty=!0,!0},increaseTotalQuadsWith:function(a){this._totalQuads+=a},moveQuadsFromIndex:function(a,b,c){if(void 0===c){if(c=b,b=this._totalQuads-a,cc.assert(c+(this._totalQuads-a)<=this._capacity,cc._LogInfos.TextureAtlas_moveQuadsFromIndex),0===b)return}else if(cc.assert(c+b<=this._totalQuads,cc._LogInfos.TextureAtlas_moveQuadsFromIndex_2),cc.assert(a<this._totalQuads,cc._LogInfos.TextureAtlas_moveQuadsFromIndex_3),a===c)return;var d,e,f=cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,g=a*f,h=b*f,i=this._quadsReader,j=i.subarray(g,g+h),k=c*f;a>c?(d=(a-c)*f,e=c*f,i.set(i.subarray(e,e+d),e+h)):(d=(c-a)*f,e=(a+b)*f,i.set(i.subarray(e,e+d),g)),i.set(j,k),this.dirty=!0},fillWithEmptyQuadsFromIndex:function(a,b){for(var c=b*cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,d=new Uint8Array(this._quadsArrayBuffer,a*cc.V3F_C4B_T2F_Quad.BYTES_PER_ELEMENT,c),e=0;c>e;e++)d[e]=0},drawQuads:function(){this.drawNumberOfQuads(this._totalQuads,0)},_releaseBuffer:function(){var a=cc._renderContext;this._buffersVBO&&(this._buffersVBO[0]&&a.deleteBuffer(this._buffersVBO[0]),this._buffersVBO[1]&&a.deleteBuffer(this._buffersVBO[1])),this._quadsWebBuffer&&a.deleteBuffer(this._quadsWebBuffer)}});var _p=cc.TextureAtlas.prototype;_p.totalQuads,cc.defineGetterSetter(_p,"totalQuads",_p.getTotalQuads),_p.capacity,cc.defineGetterSetter(_p,"capacity",_p.getCapacity),_p.quads,cc.defineGetterSetter(_p,"quads",_p.getQuads,_p.setQuads),cc.TextureAtlas.create=function(a,b){return new cc.TextureAtlas(a,b)},cc.TextureAtlas.createWithTexture=cc.TextureAtlas.create,cc.game.addEventListener(cc.game.EVENT_RENDERER_INITED,function(){cc._renderType===cc.game.RENDER_TYPE_WEBGL&&(cc.assert(cc.isFunction(cc._tmp.WebGLTextureAtlas),cc._LogInfos.MissingFile,"TexturesWebGL.js"),cc._tmp.WebGLTextureAtlas(),delete cc._tmp.WebGLTextureAtlas)}),cc.assert(cc.isFunction(cc._tmp.PrototypeTextureAtlas),cc._LogInfos.MissingFile,"TexturesPropertyDefine.js"),cc._tmp.PrototypeTextureAtlas(),delete cc._tmp.PrototypeTextureAtlas,cc.PI2=2*Math.PI,cc.DrawingPrimitiveCanvas=cc.Class.extend({_cacheArray:[],_renderContext:null,ctor:function(a){this._renderContext=a},drawPoint:function(a,b){b||(b=1);var c=cc.view.getScaleX(),d=cc.view.getScaleY(),e=cc.p(a.x*c,a.y*d),f=this._renderContext.getContext();f.beginPath(),f.arc(e.x,-e.y,b*c,0,2*Math.PI,!1),f.closePath(),f.fill()},drawPoints:function(a,b,c){if(null!=a){c||(c=1);var d=this._renderContext.getContext(),e=cc.view.getScaleX(),f=cc.view.getScaleY();d.beginPath();for(var g=0,h=a.length;h>g;g++)d.arc(a[g].x*e,-a[g].y*f,c*e,0,2*Math.PI,!1);d.closePath(),d.fill()}},drawLine:function(a,b){var c=this._renderContext.getContext(),d=cc.view.getScaleX(),e=cc.view.getScaleY();c.beginPath(),c.moveTo(a.x*d,-a.y*e),c.lineTo(b.x*d,-b.y*e),c.closePath(),c.stroke()},drawRect:function(a,b){this.drawLine(cc.p(a.x,a.y),cc.p(b.x,a.y)),this.drawLine(cc.p(b.x,a.y),cc.p(b.x,b.y)),this.drawLine(cc.p(b.x,b.y),cc.p(a.x,b.y)),this.drawLine(cc.p(a.x,b.y),cc.p(a.x,a.y))},drawSolidRect:function(a,b,c){var d=[a,cc.p(b.x,a.y),b,cc.p(a.x,b.y)];this.drawSolidPoly(d,4,c)},drawPoly:function(a,b,c,d){if(d=d||!1,null!=a){if(a.length<3)throw new Error("Polygon's point must greater than 2");var e=a[0],f=this._renderContext.getContext(),g=cc.view.getScaleX(),h=cc.view.getScaleY();f.beginPath(),f.moveTo(e.x*g,-e.y*h);for(var i=1,j=a.length;j>i;i++)f.lineTo(a[i].x*g,-a[i].y*h);c&&f.closePath(),d?f.fill():f.stroke()}},drawSolidPoly:function(a,b,c){this.setDrawColor(c.r,c.g,c.b,c.a),this.drawPoly(a,b,!0,!0)},drawCircle:function(a,b,c,d,e){e=e||!1;var f=this._renderContext.getContext(),g=cc.view.getScaleX(),h=cc.view.getScaleY();f.beginPath();var i=c-2*Math.PI;f.arc(0|a.x*g,0|-(a.y*h),b*g,-c,-i,!1),e&&f.lineTo(0|a.x*g,0|-(a.y*h)),f.stroke()},drawQuadBezier:function(a,b,c,d){var e=this._cacheArray;e.length=0;for(var f=0,g=0;d>g;g++){var h=Math.pow(1-f,2)*a.x+2*(1-f)*f*b.x+f*f*c.x,i=Math.pow(1-f,2)*a.y+2*(1-f)*f*b.y+f*f*c.y;e.push(cc.p(h,i)),f+=1/d}e.push(cc.p(c.x,c.y)),this.drawPoly(e,d+1,!1,!1)},drawCubicBezier:function(a,b,c,d,e){var f=this._cacheArray;f.length=0;for(var g=0,h=0;e>h;h++){var i=Math.pow(1-g,3)*a.x+3*Math.pow(1-g,2)*g*b.x+3*(1-g)*g*g*c.x+g*g*g*d.x,j=Math.pow(1-g,3)*a.y+3*Math.pow(1-g,2)*g*b.y+3*(1-g)*g*g*c.y+g*g*g*d.y;f.push(cc.p(i,j)),g+=1/e}f.push(cc.p(d.x,d.y)),this.drawPoly(f,e+1,!1,!1)},drawCatmullRom:function(a,b){this.drawCardinalSpline(a,.5,b)},drawCardinalSpline:function(a,b,c){cc._renderContext.setStrokeStyle("rgba(255,255,255,1)");var d=this._cacheArray;d.length=0;for(var e,f,g=1/a.length,h=0;c+1>h;h++){var i=h/c;1===i?(e=a.length-1,f=1):(e=0|i/g,f=(i-g*e)/g);var j=cc.CardinalSplineAt(cc.getControlPointAt(a,e-1),cc.getControlPointAt(a,e-0),cc.getControlPointAt(a,e+1),cc.getControlPointAt(a,e+2),b,f);d.push(j)}this.drawPoly(d,c+1,!1,!1)},drawImage:function(a,b,c,d,e){var f=arguments.length,g=this._renderContext.getContext();switch(f){case 2:var h=a.height;g.drawImage(a,b.x,-(b.y+h));break;case 3:g.drawImage(a,b.x,-(b.y+c.height),c.width,c.height);break;case 5:g.drawImage(a,b.x,b.y,c.width,c.height,d.x,-(d.y+e.height),e.width,e.height);break;default:throw new Error("Argument must be non-nil")}},drawStar:function(a,b,c){var d=a||this._renderContext,e=d.getContext();b*=cc.view.getScaleX();var f="rgba("+(0|c.r)+","+(0|c.g)+","+(0|c.b);d.setFillStyle(f+",1)");var g=b/10;e.beginPath(),e.moveTo(-b,b),e.lineTo(0,g),e.lineTo(b,b),e.lineTo(g,0),e.lineTo(b,-b),e.lineTo(0,-g),e.lineTo(-b,-b),e.lineTo(-g,0),e.lineTo(-b,b),e.closePath(),e.fill();var h=e.createRadialGradient(0,0,g,0,0,b);h.addColorStop(0,f+", 1)"),h.addColorStop(.3,f+", 0.8)"),h.addColorStop(1,f+", 0.0)"),d.setFillStyle(h),e.beginPath();var i=0,j=cc.PI2;e.arc(0,0,b-g,i,j,!1),e.closePath(),e.fill()},drawColorBall:function(a,b,c){var d=a||this._renderContext,e=d.getContext();b*=cc.view.getScaleX();var f="rgba("+(0|c.r)+","+(0|c.g)+","+(0|c.b),g=b/10,h=e.createRadialGradient(0,0,g,0,0,b);h.addColorStop(0,f+", 1)"),h.addColorStop(.3,f+", 0.8)"),h.addColorStop(.6,f+", 0.4)"),h.addColorStop(1,f+", 0.0)"),d.setFillStyle(h),e.beginPath();var i=0,j=cc.PI2;e.arc(0,0,b,i,j,!1),e.closePath(),e.fill()},fillText:function(a,b,c){this._renderContext.getContext().fillText(a,b,-c)},setDrawColor:function(a,b,c,d){this._renderContext.setFillStyle("rgba("+a+","+b+","+c+","+d/255+")"),this._renderContext.setStrokeStyle("rgba("+a+","+b+","+c+","+d/255+")")},setPointSize:function(a){},setLineWidth:function(a){this._renderContext.getContext().lineWidth=a*cc.view.getScaleX()}});