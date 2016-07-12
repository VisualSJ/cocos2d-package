cc.DOM={},cc.DOM._addMethods=function(a){for(var b in cc.DOM.methods)a[b]=cc.DOM.methods[b];cc.defineGetterSetter(a,"x",a.getPositionX,a.setPositionX),cc.defineGetterSetter(a,"y",a.getPositionY,a.setPositionY),cc.defineGetterSetter(a,"width",a._getWidth,a._setWidth),cc.defineGetterSetter(a,"height",a._getHeight,a._setHeight),cc.defineGetterSetter(a,"anchorX",a._getAnchorX,a._setAnchorX),cc.defineGetterSetter(a,"anchorY",a._getAnchorY,a._setAnchorY),cc.defineGetterSetter(a,"scale",a.getScale,a.setScale),cc.defineGetterSetter(a,"scaleX",a.getScaleX,a.setScaleX),cc.defineGetterSetter(a,"scaleY",a.getScaleY,a.setScaleY),cc.defineGetterSetter(a,"rotation",a.getRotation,a.setRotation),cc.defineGetterSetter(a,"skewX",a.getSkewX,a.setSkewX),cc.defineGetterSetter(a,"skewY",a.getSkewY,a.setSkewY),cc.defineGetterSetter(a,"visible",a.isVisible,a.setVisible),cc.defineGetterSetter(a,"parent",a.getParent,a.setParent),cc.defineGetterSetter(a,"opacity",a.getOpacity,a.setOpacity)},cc.DOM.methods={setPosition:function(a,b){void 0===b?(this._position.x=a.x,this._position.y=a.y):(this._position.x=a,this._position.y=b),this.setNodeDirty(),this.dom.translates(this._position.x,-this._position.y)},setPositionY:function(a){this._position.y=a,this.setNodeDirty(),this.dom.translates(this._position.x,-this._position.y)},setPositionX:function(a){this._position.x=a,this.setNodeDirty(),this.dom.translates(this._position.x,-this._position.y)},setScale:function(a,b){this._scaleX=a,this._scaleY=b||a,this.setNodeDirty(),this.dom.resize(this._scaleX,this._scaleY)},setScaleX:function(a){this._scaleX=a,this.setNodeDirty(),this.dom.resize(this._scaleX,this._scaleY)},setScaleY:function(a){this._scaleY=a,this.setNodeDirty(),this.dom.resize(this._scaleX,this._scaleY)},setAnchorPoint:function(a,b){var c=this._renderCmd,d=this._anchorPoint;void 0===b?(d.x=a.x,d.y=a.y):(d.x=a,d.y=b);var e=c._anchorPointInPoints,f=this._contentSize;e.x=f.width*d.x,e.y=f.height*d.y,this.dom.style[cc.$.pfx+"TransformOrigin"]=""+e.x+"px "+-e.y+"px",this.ignoreAnchor?(this.dom.style.marginLeft=0,this.dom.style.marginBottom=0):(this.dom.style.marginLeft=this.isToggler?0:-e.x+"px",this.dom.style.marginBottom=-e.y+"px"),this.setNodeDirty()},_setAnchorX:function(a){var b=this._anchorPoint,c=this._renderCmd;if(a!==b.x){b.x=a;var d=c._anchorPointInPoints,e=this._contentSize;d.x=e.width*b.x,this.dom.style[cc.$.pfx+"TransformOrigin"]=""+d.x+"px "+-d.y+"px",this.ignoreAnchor?(this.dom.style.marginLeft=0,this.dom.style.marginBottom=0):this.dom.style.marginLeft=this.isToggler?0:-d.x+"px",this.setNodeDirty()}},_setAnchorY:function(a){var b=this._anchorPoint,c=this._renderCmd;if(a!==b.y){b.y=a;var d=c._anchorPointInPoints,e=this._contentSize;d.y=e.height*b.y,this.dom.style[cc.$.pfx+"TransformOrigin"]=""+d.x+"px "+-d.y+"px",this.ignoreAnchor?(this.dom.style.marginLeft=0,this.dom.style.marginBottom=0):this.dom.style.marginBottom=-d.y+"px",this.setNodeDirty()}},setContentSize:function(a,b){var c=this._renderCmd,d=this._contentSize;void 0===b?(d.width=a.width,d.height=a.height):(d.width=a,d.height=b);var e=c._anchorPointInPoints,f=this._anchorPoint;e.x=d.width*f.x,e.y=d.height*f.y,this.dom.width=d.width,this.dom.height=d.height,this.setAnchorPoint(this.getAnchorPoint()),this.canvas&&(this.canvas.width=d.width,this.canvas.height=d.height),this.setNodeDirty(),this.redraw()},_setWidth:function(a){var b=this._contentSize,c=this._renderCmd;if(a!==b.width){b.width=a;var d=c._anchorPointInPoints,e=this._anchorPoint;d.x=b.width*e.x,this.dom.width=b.width,this.anchorX=e.x,this.canvas&&(this.canvas.width=b.width),this.setNodeDirty(),this.redraw()}},_setHeight:function(a){var b=this._contentSize,c=this._renderCmd;if(a!==b.height){b.height=a;var d=c._anchorPointInPoints,e=this._anchorPoint;d.y=b.height*e.y,this.dom.height=b.height,this.anchorY=e.y,this.canvas&&(this.canvas.height=b.height),this.setNodeDirty(),this.redraw()}},setRotation:function(a){this._rotation!==a&&(this._rotationX=this._rotationY=a,this.setNodeDirty(),this.dom.rotate(a))},setSkewX:function(a){this._skewX=a,this.setNodeDirty(),this.dom.setSkew(this._skewX,this._skewY)},setSkewY:function(a){this._skewY=a,this.setNodeDirty(),this.dom.setSkew(this._skewX,this._skewY)},setVisible:function(a){this._visible=a,this.setNodeDirty(),this.dom&&(this.dom.style.display=a?"block":"none")},_setLocalZOrder:function(a){this._localZOrder=a,this.setNodeDirty(),this.dom&&(this.dom.zIndex=a)},setParent:function(a){this._parent=a,null!==a&&(a.setAnchorPoint(a.getAnchorPoint()),this.setNodeDirty(),cc.DOM.parentDOM(this))},resume:function(){this.getScheduler().resumeTarget(this),this.getActionManager().resumeTarget(this),cc.eventManager.resumeTarget(this),this.dom&&!this.dom.parentNode&&(this.getParent()?cc.DOM.parentDOM(this):""===this.dom.id?cc.DOM._createEGLViewDiv(this):this.dom.appendTo(cc.container)),this.dom&&(this.dom.style.visibility="visible")},pause:function(){this.getScheduler().pauseTarget(this),this.getActionManager().pauseTarget(this),cc.eventManager.pauseTarget(this),this.dom&&(this.dom.style.visibility="hidden")},cleanup:function(){this.stopAllActions(),this.unscheduleAllCallbacks(),cc.eventManager.removeListeners(this),this._arrayMakeObjectsPerformSelector(this._children,cc.Node._stateCallbackType.cleanup),this.dom&&this.dom.remove()},setOpacity:function(a){this._opacity=a,this.dom.style.opacity=a/255},redraw:function(){if(this.isSprite){var a=this._children;this._children=[],cc.Sprite.prototype.visit.call(this,this.ctx),this._children=a}else cc.Sprite.prototype.visit.call(this,this.ctx)}},cc.DOM._resetEGLViewDiv=function(){var a=cc.$("#EGLViewDiv");if(a){var b=cc.view,c=b.getDesignResolutionSize(),d=b.getViewPortRect(),e=b.getFrameSize(),f=b.getDevicePixelRatio(),g=c.width,h=c.height,i=parseInt(cc.container.style.paddingLeft),j=parseInt(cc.container.style.paddingBottom);0===c.width&&0===c.height&&(g=e.width,h=e.height);var k=d.width/f;0===d.width&&0===d.height&&(k=e.width),a.style.position="absolute",a.style.width=g+"px",a.style.maxHeight=h+"px",a.style.margin=0,a.resize(b.getScaleX()/f,b.getScaleY()/f),a.translates(i,-j),b.getResolutionPolicy()===b._rpNoBorder?(a.style.left=(b.getFrameSize().width-g)/2+"px",a.style.bottom=(b.getFrameSize().height-h*b.getScaleY()/f)/2+"px"):(a.style.left=(g*b.getScaleX()/f-g)/2+"px",a.style.bottom="0px")}},cc.DOM.parentDOM=function(a){var b=a.getParent();if(!b||!a.dom)return!1;if(b.dom||(cc.DOM.placeHolder(b),b.setParent=cc.DOM.methods.setParent),a.dom.appendTo(b.dom),b.setAnchorPoint(b.getAnchorPoint()),b.getParent())cc.DOM.parentDOM(b);else if(b.isRunning()){var c=cc.$("#EGLViewDiv");c?b.dom.appendTo(c):cc.DOM._createEGLViewDiv(b)}return!0},cc.DOM._createEGLViewDiv=function(a){var b=cc.$("#EGLViewDiv");b||(b=cc.$new("div"),b.id="EGLViewDiv");var c=cc.view,d=c.getDesignResolutionSize(),e=c.getViewPortRect(),f=c.getFrameSize(),g=c.getDevicePixelRatio(),h=d.width,i=d.height,j=parseInt(cc.container.style.paddingLeft),k=parseInt(cc.container.style.paddingBottom);0===d.width&&0===d.height&&(h=f.width,i=f.height);var l=e.width/g;0===e.width&&0===e.height&&(l=f.width),b.style.position="absolute",b.style.width=h+"px",b.style.maxHeight=i+"px",b.style.margin=0,b.resize(c.getScaleX()/g,c.getScaleY()/g),b.translates(j,-k),c.getResolutionPolicy()===c._rpNoBorder?(b.style.left=(f.width-h)/2+"px",b.style.bottom=(f.height-i*c.getScaleY()/g)/2+"px"):(b.style.left=(h*c.getScaleX()/g-h)/2+"px",b.style.bottom="0px"),a.dom.appendTo(b),b.appendTo(cc.container)},cc.DOM.setTransform=function(a){if(a.ctx)if(a.ctx.translate(a.getAnchorPointInPoints().x,a.getAnchorPointInPoints().y),a.isSprite){var b=a._children;a._children=[],cc.Sprite.prototype.visit.call(a),a._children=b}else cc.Sprite.prototype.visit.call(a);a.dom&&(a.dom.position.x=a.getPositionX(),a.dom.position.y=-a.getPositionY(),a.dom.rotation=a.getRotation(),a.dom.scale={x:a.getScaleX(),y:a.getScaleY()},a.dom.skew={x:a.getSkewX(),y:a.getSkewY()},a.setAnchorPoint&&a.setAnchorPoint(a.getAnchorPoint()),a.dom.transforms())},cc.DOM.forSprite=function(a){a.dom=cc.$new("div"),a.canvas=cc.$new("canvas");var b=a.getContentSize();a.canvas.width=b.width,a.canvas.height=b.height,a.dom.style.position="absolute",a.dom.style.bottom=0,a.ctx=a.canvas.getContext("2d"),a.dom.appendChild(a.canvas),a.getParent()&&cc.DOM.parentDOM(a),a.isSprite=!0},cc.DOM.placeHolder=function(a){a.dom=cc.$new("div"),a.placeholder=!0,a.dom.style.position="absolute",a.dom.style.bottom=0,a.dom.style.width=(a.getContentSize().width||cc.director.getWinSize().width)+"px",a.dom.style.maxHeight=(a.getContentSize().height||cc.director.getWinSize().height)+"px",a.dom.style.margin=0,cc.DOM.setTransform(a),a.dom.transforms(),cc.DOM._addMethods(a)},cc.DOM.convert=function(a){if(arguments.length>1)return void cc.DOM.convert(arguments);if(1===arguments.length&&!arguments[0].length)return void cc.DOM.convert([arguments[0]]);for(var b=arguments[0],c=0;c<b.length;c++)b[c]instanceof cc.Sprite?b[c].dom||cc.DOM.forSprite(b[c]):cc.log("DOM converter only supports sprite and menuitems yet"),cc.DOM._addMethods(b[c]),b[c].visit=function(){},b[c].transform=function(){},cc.DOM.setTransform(b[c]),b[c].setVisible(b[c].isVisible())},cc.KEYBOARD_RETURNTYPE_DEFAULT=0,cc.KEYBOARD_RETURNTYPE_DONE=1,cc.KEYBOARD_RETURNTYPE_SEND=2,cc.KEYBOARD_RETURNTYPE_SEARCH=3,cc.KEYBOARD_RETURNTYPE_GO=4,cc.EDITBOX_INPUT_MODE_ANY=0,cc.EDITBOX_INPUT_MODE_EMAILADDR=1,cc.EDITBOX_INPUT_MODE_NUMERIC=2,cc.EDITBOX_INPUT_MODE_PHONENUMBER=3,cc.EDITBOX_INPUT_MODE_URL=4,cc.EDITBOX_INPUT_MODE_DECIMAL=5,cc.EDITBOX_INPUT_MODE_SINGLELINE=6,cc.EDITBOX_INPUT_FLAG_PASSWORD=0,cc.EDITBOX_INPUT_FLAG_SENSITIVE=1,cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_WORD=2,cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE=3,cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS=4,cc.EditBoxDelegate=cc.Class.extend({editBoxEditingDidBegin:function(a){},editBoxEditingDidEnd:function(a){},editBoxTextChanged:function(a,b){},editBoxReturn:function(a){}}),cc.EditBox=cc.ControlButton.extend({_domInputSprite:null,_delegate:null,_editBoxInputMode:cc.EDITBOX_INPUT_MODE_ANY,_editBoxInputFlag:cc.EDITBOX_INPUT_FLAG_SENSITIVE,_keyboardReturnType:cc.KEYBOARD_RETURNTYPE_DEFAULT,_text:"",_placeholderText:"",_textColor:null,_placeholderColor:null,_maxLength:50,_adjustHeight:18,_edTxt:null,_edFontSize:14,_edFontName:"Arial",_placeholderFontName:"",_placeholderFontSize:14,_tooltip:!1,_className:"EditBox",_onCanvasClick:null,_inputEvent:null,_keyPressEvent:null,_focusEvent:null,_blurEvent:null,ctor:function(a,b,c,d){cc.ControlButton.prototype.ctor.call(this),this._textColor=cc.color.WHITE,this._placeholderColor=cc.color.GRAY,this.setContentSize(a);var e=this._domInputSprite=new cc.Sprite;e.draw=function(){},this.addChild(e);var f=this._edTxt=document.createElement("input");f.type="text",f.style.fontSize=this._edFontSize+"px",f.style.color="#000000",f.style.border=0,f.style.background="transparent",f.style.width="100%",f.style.height="100%",f.style.active=0,f.style.outline="medium",f.style.padding="0";var g=function(){this._edTxt.blur()};this._onCanvasClick=g.bind(this);var h=function(){this._delegate&&this._delegate.editBoxTextChanged&&this._delegate.editBoxTextChanged(this,this._edTxt.value)};this._inputEvent=h.bind(this);var i=function(a){a.keyCode===cc.KEY.enter&&(a.stopPropagation(),a.preventDefault(),this._delegate&&this._delegate.editBoxReturn&&this._delegate.editBoxReturn(this),cc._canvas.focus())};this._keyPressEvent=i.bind(this);var j=function(){this._edTxt.value===this._placeholderText&&(this._edTxt.value="",this._edTxt.style.fontSize=this._edFontSize+"px",this._edTxt.style.color=cc.colorToHex(this._textColor),this._editBoxInputFlag===cc.EDITBOX_INPUT_FLAG_PASSWORD?this._edTxt.type="password":this._edTxt.type="text"),this._delegate&&this._delegate.editBoxEditingDidBegin&&this._delegate.editBoxEditingDidBegin(this),cc._canvas.addEventListener("click",this._onCanvasClick)};this._focusEvent=j.bind(this);var k=function(){""===this._edTxt.value&&(this._edTxt.value=this._placeholderText,this._edTxt.style.fontSize=this._placeholderFontSize+"px",this._edTxt.style.color=cc.colorToHex(this._placeholderColor),this._edTxt.type="text"),this._delegate&&this._delegate.editBoxEditingDidEnd&&this._delegate.editBoxEditingDidEnd(this),cc._canvas.removeEventListener("click",this._onCanvasClick)};this._blurEvent=k.bind(this),f.addEventListener("input",this._inputEvent),f.addEventListener("keypress",this._keyPressEvent),f.addEventListener("focus",this._focusEvent),f.addEventListener("blur",this._blurEvent),cc.DOM.convert(e),e.dom.appendChild(f),e.dom.showTooltipDiv=!1,e.dom.style.width=a.width-6+"px",e.dom.style.height=a.height-6+"px",e.canvas.remove(),this.initWithSizeAndBackgroundSprite(a,b)&&(c&&this.setBackgroundSpriteForState(c,cc.CONTROL_STATE_HIGHLIGHTED),d&&this.setBackgroundSpriteForState(d,cc.CONTROL_STATE_DISABLED))},setFont:function(a,b){this._edFontSize=b,this._edFontName=a,this._setFontToEditBox()},_setFont:function(a){var b=cc.LabelTTF._fontStyleRE.exec(a);b&&(this._edFontSize=parseInt(b[1]),this._edFontName=b[2],this._setFontToEditBox())},setFontName:function(a){this._edFontName=a,this._setFontToEditBox()},setFontSize:function(a){this._edFontSize=a,this._setFontToEditBox()},_setFontToEditBox:function(){this._edTxt.value!==this._placeholderText&&(this._edTxt.style.fontFamily=this._edFontName,this._edTxt.style.fontSize=this._edFontSize+"px",this._editBoxInputFlag===cc.EDITBOX_INPUT_FLAG_PASSWORD?this._edTxt.type="password":this._edTxt.type="text")},setText:function(a){cc.log("Please use the setString"),this.setString(a)},setString:function(a){null!=a&&(""===a?(this._edTxt.value=this._placeholderText,this._edTxt.style.color=cc.colorToHex(this._placeholderColor),this._edTxt.type="text"):(this._edTxt.value=a,this._edTxt.style.color=cc.colorToHex(this._textColor),this._editBoxInputFlag===cc.EDITBOX_INPUT_FLAG_PASSWORD?this._edTxt.type="password":this._edTxt.type="text"))},setFontColor:function(a){this._textColor=a,this._edTxt.value!==this._placeholderText&&(this._edTxt.style.color=cc.colorToHex(a))},setMaxLength:function(a){!isNaN(a)&&a>0&&(this._maxLength=a,this._edTxt.maxLength=a)},getMaxLength:function(){return this._maxLength},setPlaceHolder:function(a){if(null!=a){var b=this._placeholderText;this._placeholderText=a,this._edTxt.value===b&&(this._edTxt.value=a,this._edTxt.style.color=cc.colorToHex(this._placeholderColor),this._setPlaceholderFontToEditText())}},setPlaceholderFont:function(a,b){this._placeholderFontName=a,this._placeholderFontSize=b,this._setPlaceholderFontToEditText()},_setPlaceholderFont:function(a){var b=cc.LabelTTF._fontStyleRE.exec(a);b&&(this._placeholderFontName=b[2],this._placeholderFontSize=parseInt(b[1]),this._setPlaceholderFontToEditText())},setPlaceholderFontName:function(a){this._placeholderFontName=a,this._setPlaceholderFontToEditText()},setPlaceholderFontSize:function(a){this._placeholderFontSize=a,this._setPlaceholderFontToEditText()},_setPlaceholderFontToEditText:function(){this._edTxt.value===this._placeholderText&&(this._edTxt.style.fontFamily=this._placeholderFontName,this._edTxt.style.fontSize=this._placeholderFontSize+"px",this._edTxt.type="text")},setPlaceholderFontColor:function(a){this._placeholderColor=a,this._edTxt.value===this._placeholderText&&(this._edTxt.style.color=cc.colorToHex(a))},setInputFlag:function(a){this._editBoxInputFlag=a,this._edTxt.value!==this._placeholderText&&a===cc.EDITBOX_INPUT_FLAG_PASSWORD?this._edTxt.type="password":this._edTxt.type="text"},getText:function(){return cc.log("Please use the getString"),this._edTxt.value},getString:function(){return this._edTxt.value===this._placeholderText?"":this._edTxt.value},initWithSizeAndBackgroundSprite:function(a,b){return this.initWithBackgroundSprite(b)?(this._domInputSprite.x=3,this._domInputSprite.y=3,this.setZoomOnTouchDown(!1),this.setPreferredSize(a),this.x=0,this.y=0,this._addTargetWithActionForControlEvent(this,this.touchDownAction,cc.CONTROL_EVENT_TOUCH_UP_INSIDE),!0):!1},setDelegate:function(a){this._delegate=a},getPlaceHolder:function(){return this._placeholderText},setInputMode:function(a){this._editBoxInputMode=a},setReturnType:function(a){this._keyboardReturnType=a},keyboardWillShow:function(a){var b=cc.EditBox.getRect(this);return b.y-=4,b.intersectsRect(a.end)?void(this._adjustHeight=a.end.getMaxY()-b.getMinY()):void cc.log("needn't to adjust view layout.")},keyboardDidShow:function(a){},keyboardWillHide:function(a){},keyboardDidHide:function(a){},touchDownAction:function(a,b){},initWithBackgroundColor:function(a,b){this._edWidth=a.width,this.dom.style.width=this._edWidth.toString()+"px",this._edHeight=a.height,this.dom.style.height=this._edHeight.toString()+"px",this.dom.style.backgroundColor=cc.colorToHex(b)},cleanup:function(){this._edTxt.removeEventListener("input",this._inputEvent),this._edTxt.removeEventListener("keypress",this._keyPressEvent),this._edTxt.removeEventListener("focus",this._focusEvent),this._edTxt.removeEventListener("blur",this._blurEvent),cc._canvas.removeEventListener("click",this._onCanvasClick),this._super()}});var _p=cc.EditBox.prototype;_p.font,cc.defineGetterSetter(_p,"font",null,_p._setFont),_p.fontName,cc.defineGetterSetter(_p,"fontName",null,_p.setFontName),_p.fontSize,cc.defineGetterSetter(_p,"fontSize",null,_p.setFontSize),_p.fontColor,cc.defineGetterSetter(_p,"fontColor",null,_p.setFontColor),_p.string,cc.defineGetterSetter(_p,"string",_p.getString,_p.setString),_p.maxLength,cc.defineGetterSetter(_p,"maxLength",_p.getMaxLength,_p.setMaxLength),_p.placeHolder,cc.defineGetterSetter(_p,"placeHolder",_p.getPlaceHolder,_p.setPlaceHolder),_p.placeHolderFont,cc.defineGetterSetter(_p,"placeHolderFont",null,_p._setPlaceholderFont),_p.placeHolderFontName,cc.defineGetterSetter(_p,"placeHolderFontName",null,_p.setPlaceholderFontName),_p.placeHolderFontSize,cc.defineGetterSetter(_p,"placeHolderFontSize",null,_p.setPlaceholderFontSize),_p.placeHolderFontColor,cc.defineGetterSetter(_p,"placeHolderFontColor",null,_p.setPlaceholderFontColor),_p.inputFlag,cc.defineGetterSetter(_p,"inputFlag",null,_p.setInputFlag),_p.delegate,cc.defineGetterSetter(_p,"delegate",null,_p.setDelegate),_p.inputMode,cc.defineGetterSetter(_p,"inputMode",null,_p.setInputMode),_p.returnType,cc.defineGetterSetter(_p,"returnType",null,_p.setReturnType),_p=null,cc.EditBox.getRect=function(a){var b=a.getContentSize(),c=cc.rect(0,0,b.width,b.height);return cc.rectApplyAffineTransform(c,a.getNodeToWorldTransform())},cc.EditBox.create=function(a,b,c,d){return new cc.EditBox(a,b,c,d)};