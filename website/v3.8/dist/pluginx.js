!function(){if(void 0!==cc){var config=cc.game.config.plugin||{},PluginManager=function(){};PluginManager.prototype={constructor:PluginManager,getInstance:function(){return this},loadPlugin:function(a){},unloadPlugin:function(a){}};var PluginAssembly=function(){};PluginAssembly.prototype={constructor:PluginAssembly,setDebugMode:function(a){},startSession:function(a){},setCaptureUncaughtException:function(a){},callFuncWithParam:function(a){return"function"==typeof this[a]?this[a].apply(this,Array.prototype.splice.call(arguments,1)):void cc.log("function is not define")},callStringFuncWithParam:function(a){this.callFuncWithParam.apply(arguments)},getPluginName:function(){return this._name},getPluginVersion:function(){return this._version}},PluginAssembly.extend=function(name,porp){var p,prototype={};for(p in PluginAssembly.prototype)prototype[p]=PluginAssembly.prototype[p];for(p in porp)prototype[p]=porp[p];var tmp=eval("(function "+name+"Plugin(){})");return prototype.constructor=tmp,tmp.prototype=prototype,tmp};var Param=function(a,b){var c,d=plugin.PluginParam.ParamType;switch(a){case d.TypeInt:c=parseInt(b);break;case d.TypeFloat:c=parseFloat(b);break;case d.TypeBool:c=Boolean(b);break;case d.TypeString:c=String(b);break;case d.TypeStringMap:c=b;break;default:c=b}return c};Param.ParamType={TypeInt:1,TypeFloat:2,TypeBool:3,TypeString:4,TypeStringMap:5},Param.AdsResultCode={AdsReceived:0,FullScreenViewShown:1,FullScreenViewDismissed:2,PointsSpendSucceed:3,PointsSpendFailed:4,NetworkError:5,UnknownError:6},Param.PayResultCode={PaySuccess:0,PayFail:1,PayCancel:2,PayTimeOut:3},Param.ShareResultCode={ShareSuccess:0,ShareFail:1,ShareCancel:2,ShareTimeOut:3};var PluginList={},Plugin={extend:function(a,b){PluginList[a]=new(PluginAssembly.extend(a,b)),"function"==typeof PluginList[a].ctor&&PluginList[a].ctor(config[a])},PluginList:PluginList,PluginParam:Param,PluginManager:new PluginManager};window.plugin=Plugin}}();