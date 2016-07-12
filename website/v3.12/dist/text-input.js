cc.IMEKeyboardNotificationInfo=function(a,b,c){this.begin=a||cc.rect(0,0,0,0),this.end=b||cc.rect(0,0,0,0),this.duration=c||0},cc.IMEDelegate=cc.Class.extend({ctor:function(){cc.imeDispatcher.addDelegate(this)},removeDelegate:function(){cc.imeDispatcher.removeDelegate(this)},attachWithIME:function(){return cc.imeDispatcher.attachDelegateWithIME(this)},detachWithIME:function(){return cc.imeDispatcher.detachDelegateWithIME(this)},canAttachWithIME:function(){return!1},didAttachWithIME:function(){},canDetachWithIME:function(){return!1},didDetachWithIME:function(){},insertText:function(a,b){},deleteBackward:function(){},getContentText:function(){return""},keyboardWillShow:function(a){},keyboardDidShow:function(a){},keyboardWillHide:function(a){},keyboardDidHide:function(a){}}),cc.IMEDispatcher=cc.Class.extend({_domInputControl:null,impl:null,_currentInputString:"",_lastClickPosition:null,ctor:function(){this.impl=new cc.IMEDispatcher.Impl,this._lastClickPosition=cc.p(0,0)},init:function(){if(!cc.sys.isMobile){this._domInputControl=cc.$("#imeDispatcherInput"),this._domInputControl||(this._domInputControl=cc.$new("input"),this._domInputControl.setAttribute("type","text"),this._domInputControl.setAttribute("id","imeDispatcherInput"),this._domInputControl.resize(0,0),this._domInputControl.translates(0,0),this._domInputControl.style.opacity="0",this._domInputControl.style.fontSize="1px",this._domInputControl.setAttribute("tabindex",2),this._domInputControl.style.position="absolute",this._domInputControl.style.top=0,this._domInputControl.style.left=0,document.body.appendChild(this._domInputControl));var a=this;this._domInputControl.addEventListener("input",function(){a._processDomInputString(a._domInputControl.value)},!1),this._domInputControl.addEventListener("keydown",function(b){b.keyCode===cc.KEY.tab?(b.stopPropagation(),b.preventDefault()):b.keyCode===cc.KEY.enter&&(a.dispatchInsertText("\n",1),b.stopPropagation(),b.preventDefault())},!1),/msie/i.test(navigator.userAgent)&&this._domInputControl.addEventListener("keyup",function(b){b.keyCode===cc.KEY.backspace&&a._processDomInputString(a._domInputControl.value)},!1),window.addEventListener("mousedown",function(b){var c=b.pageX||0,d=b.pageY||0;a._lastClickPosition.x=c,a._lastClickPosition.y=d},!1)}},_processDomInputString:function(a){var b,c,d=this._currentInputString.length<a.length?this._currentInputString.length:a.length;for(c=0;d>c&&a[c]===this._currentInputString[c];c++);var e=this._currentInputString.length-c,f=a.length-c;for(b=0;e>b;b++)this.dispatchDeleteBackward();for(b=0;f>b;b++)this.dispatchInsertText(a[c+b],1);this._currentInputString=a},dispatchInsertText:function(a,b){!this.impl||!a||0>=b||this.impl._delegateWithIme&&this.impl._delegateWithIme.insertText(a,b)},dispatchDeleteBackward:function(){this.impl&&this.impl._delegateWithIme&&this.impl._delegateWithIme.deleteBackward()},getContentText:function(){if(this.impl&&this.impl._delegateWithIme){var a=this.impl._delegateWithIme.getContentText();return a?a:""}return""},dispatchKeyboardWillShow:function(a){if(this.impl)for(var b=0;b<this.impl._delegateList.length;b++){var c=this.impl._delegateList[b];c&&c.keyboardWillShow(a)}},dispatchKeyboardDidShow:function(a){if(this.impl)for(var b=0;b<this.impl._delegateList.length;b++){var c=this.impl._delegateList[b];c&&c.keyboardDidShow(a)}},dispatchKeyboardWillHide:function(a){if(this.impl)for(var b=0;b<this.impl._delegateList.length;b++){var c=this.impl._delegateList[b];c&&c.keyboardWillHide(a)}},dispatchKeyboardDidHide:function(a){if(this.impl)for(var b=0;b<this.impl._delegateList.length;b++){var c=this.impl._delegateList[b];c&&c.keyboardDidHide(a)}},addDelegate:function(a){a&&this.impl&&(this.impl._delegateList.indexOf(a)>-1||this.impl._delegateList.splice(0,0,a))},attachDelegateWithIME:function(a){if(!this.impl||!a)return!1;if(-1===this.impl._delegateList.indexOf(a))return!1;if(this.impl._delegateWithIme){if(!this.impl._delegateWithIme.canDetachWithIME()||!a.canAttachWithIME())return!1;var b=this.impl._delegateWithIme;return this.impl._delegateWithIme=null,b.didDetachWithIME(),this._focusDomInput(a),!0}return a.canAttachWithIME()?(this._focusDomInput(a),!0):!1},_focusDomInput:function(a){if(cc.sys.isMobile){this.impl._delegateWithIme=a,a.didAttachWithIME(),this._currentInputString=a.string||"";var b,c=a.getTipMessage?a.getTipMessage():"please enter your word:",d=window.Window;b=d&&d.prototype.prompt&&d.prototype.prompt!=prompt?d.prototype.prompt.call(window,c,this._currentInputString):prompt(c,this._currentInputString),null!=b&&this._processDomInputString(b),this.dispatchInsertText("\n",1)}else this.impl._delegateWithIme=a,this._currentInputString=a.string||"",a.didAttachWithIME(),this._domInputControl.focus(),this._domInputControl.value=this._currentInputString,this._domInputControlTranslate()},_domInputControlTranslate:function(){/msie/i.test(navigator.userAgent)?(this._domInputControl.style.left=this._lastClickPosition.x+"px",this._domInputControl.style.top=this._lastClickPosition.y+"px"):this._domInputControl.translates(this._lastClickPosition.x,this._lastClickPosition.y)},detachDelegateWithIME:function(a){return this.impl&&a?this.impl._delegateWithIme!==a?!1:a.canDetachWithIME()?(this.impl._delegateWithIme=null,a.didDetachWithIME(),cc._canvas.focus(),!0):!1:!1},removeDelegate:function(a){this.impl&&a&&-1!==this.impl._delegateList.indexOf(a)&&(this.impl._delegateWithIme&&a===this.impl._delegateWithIme&&(this.impl._delegateWithIme=null),cc.arrayRemoveObject(this.impl._delegateList,a))},processKeycode:function(a){32>a?a===cc.KEY.backspace?this.dispatchDeleteBackward():a===cc.KEY.enter?this.dispatchInsertText("\n",1):a===cc.KEY.tab||a===cc.KEY.escape:255>a&&this.dispatchInsertText(String.fromCharCode(a),1)}}),cc.IMEDispatcher.Impl=cc.Class.extend({_delegateWithIme:null,_delegateList:null,ctor:function(){this._delegateList=[]},findDelegate:function(a){for(var b=0;b<this._delegateList.length;b++)if(this._delegateList[b]===a)return b;return null}}),cc.imeDispatcher=new cc.IMEDispatcher,document.body?cc.imeDispatcher.init():window.addEventListener("load",function(){cc.imeDispatcher.init()},!1),cc.TextFieldDelegate=cc.Class.extend({onTextFieldAttachWithIME:function(a){return!1},onTextFieldDetachWithIME:function(a){return!1},onTextFieldInsertText:function(a,b,c){return!1},onTextFieldDeleteBackward:function(a,b,c){return!1},onDraw:function(a){return!1}}),cc.TextFieldTTF=cc.LabelTTF.extend({delegate:null,colorSpaceHolder:null,_colorText:null,_lens:null,_inputText:"",_placeHolder:"",_charCount:0,_className:"TextFieldTTF",ctor:function(a,b,c,d,e){this.colorSpaceHolder=cc.color(127,127,127),this._colorText=cc.color(255,255,255,255),cc.LabelTTF.prototype.ctor.call(this),void 0!==e?(this.initWithPlaceHolder("",b,c,d,e),a&&this.setPlaceHolder(a)):void 0===d&&void 0!==c&&(this.initWithString("",arguments[1],arguments[2]),a&&this.setPlaceHolder(a))},onEnter:function(){cc.LabelTTF.prototype.onEnter.call(this),cc.imeDispatcher.addDelegate(this)},onExit:function(){cc.LabelTTF.prototype.onExit.call(this),cc.imeDispatcher.removeDelegate(this)},getDelegate:function(){return this.delegate},setDelegate:function(a){this.delegate=a},getCharCount:function(){return this._charCount},getColorSpaceHolder:function(){return cc.color(this.colorSpaceHolder)},setColorSpaceHolder:function(a){this.colorSpaceHolder.r=a.r,this.colorSpaceHolder.g=a.g,this.colorSpaceHolder.b=a.b,this.colorSpaceHolder.a=cc.isUndefined(a.a)?255:a.a,this._inputText.length||this.setColor(this.colorSpaceHolder)},setTextColor:function(a){this._colorText.r=a.r,this._colorText.g=a.g,this._colorText.b=a.b,this._colorText.a=cc.isUndefined(a.a)?255:a.a,this._inputText.length&&this.setColor(this._colorText)},initWithPlaceHolder:function(a,b,c,d,e){switch(arguments.length){case 5:return a&&this.setPlaceHolder(a),this.initWithString(this._placeHolder,d,e,b,c);case 3:return a&&this.setPlaceHolder(a),this.initWithString(this._placeHolder,arguments[1],arguments[2]);default:throw new Error("Argument must be non-nil ")}},setString:function(a){a=String(a),this._inputText=a||"",this._inputText.length?(cc.LabelTTF.prototype.setString.call(this,this._inputText),this.setColor(this._colorText)):(cc.LabelTTF.prototype.setString.call(this,this._placeHolder),this.setColor(this.colorSpaceHolder)),cc._renderType===cc.game.RENDER_TYPE_CANVAS&&this._renderCmd._updateTexture(),this._charCount=this._inputText.length},getString:function(){return this._inputText},setPlaceHolder:function(a){this._placeHolder=a||"",this._inputText.length||(cc.LabelTTF.prototype.setString.call(this,this._placeHolder),this.setColor(this.colorSpaceHolder))},getPlaceHolder:function(){return this._placeHolder},draw:function(a){var b=a||cc._renderContext;this.delegate&&this.delegate.onDraw(this)||cc.LabelTTF.prototype.draw.call(this,b)},visit:function(a){this._super(a)},attachWithIME:function(){return cc.imeDispatcher.attachDelegateWithIME(this)},detachWithIME:function(){return cc.imeDispatcher.detachDelegateWithIME(this)},canAttachWithIME:function(){return this.delegate?!this.delegate.onTextFieldAttachWithIME(this):!0},didAttachWithIME:function(){},canDetachWithIME:function(){return this.delegate?!this.delegate.onTextFieldDetachWithIME(this):!0},didDetachWithIME:function(){},deleteBackward:function(){var a=this._inputText.length;if(0!==a){var b=1;if(!this.delegate||!this.delegate.onTextFieldDeleteBackward(this,this._inputText[a-b],b))return b>=a?(this._inputText="",this._charCount=0,cc.LabelTTF.prototype.setString.call(this,this._placeHolder),void this.setColor(this.colorSpaceHolder)):void(this.string=this._inputText.substring(0,a-b))}},removeDelegate:function(){cc.imeDispatcher.removeDelegate(this)},_tipMessage:"please enter your word:",setTipMessage:function(a){null!=a&&(this._tipMessage=a)},getTipMessage:function(){return this._tipMessage},insertText:function(a,b){var c=a,d=c.indexOf("\n");if(d>-1&&(c=c.substring(0,d)),c.length>0){if(this.delegate&&this.delegate.onTextFieldInsertText(this,c,c.length))return;var e=this._inputText+c;this._charCount=e.length,this.string=e}-1!==d&&(this.delegate&&this.delegate.onTextFieldInsertText(this,"\n",1)||this.detachWithIME())},getContentText:function(){return this._inputText},keyboardWillShow:function(a){},keyboardDidShow:function(a){},keyboardWillHide:function(a){},keyboardDidHide:function(a){}});var _p=cc.TextFieldTTF.prototype;_p.charCount,cc.defineGetterSetter(_p,"charCount",_p.getCharCount),_p.placeHolder,cc.defineGetterSetter(_p,"placeHolder",_p.getPlaceHolder,_p.setPlaceHolder),cc.TextFieldTTF.create=function(a,b,c,d,e){return new cc.TextFieldTTF(a,b,c,d,e)};