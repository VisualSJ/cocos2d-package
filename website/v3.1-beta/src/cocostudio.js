cc.Component = cc.Class.extend({
    _owner: null,
    _name: "",
    _enabled: true,
    ctor:function(){
        this._owner = null;
        this._name = "";
        this._enabled = true;
    },
    init:function(){
       return true;
    },
    onEnter:function(){
    },
    onExit:function(){
    },
    update:function(delta){
    },
    serialize:function( reader){
    },
    isEnabled:function(){
        return this._enabled;
    },
    setEnabled:function(enable){
        this._enabled = enable;
    },
    getName:function(){
        return this._name;
    } ,
    setName:function(name){
         this._name = name;
    } ,
    setOwner:function(owner){
        this._owner = owner;
    },
    getOwner:function(){
        return this._owner;
    }
});
cc.Component.create = function(){
    return new cc.Component();
};
cc.ComponentContainer = cc.Class.extend({
    _components:null,
    _owner:null,
    ctor:function(node){
        this._components = null;
        this._owner = node;
    },
    getComponent:function(name){
        if(!name)
            throw "cc.ComponentContainer.getComponent(): name should be non-null";
        name = name.trim();
        return this._components[name];
    },
    add:function(component){
        if(!component)
             throw "cc.ComponentContainer.add(): component should be non-null";
        if(component.getOwner()){
            cc.log("cc.ComponentContainer.add(): Component already added. It can't be added again");
            return false;
        }
        if(this._components == null){
            this._components = {};
            this._owner.scheduleUpdate();
        }
        var oldComponent = this._components[component.getName()];
        if(oldComponent){
            cc.log("cc.ComponentContainer.add(): Component already added. It can't be added again");
            return false;
        }
        component.setOwner(this._owner);
        this._components[component.getName()] = component;
        component.onEnter();
        return true;
    },
    remove:function(name){
        if(!name)
            throw "cc.ComponentContainer.remove(): name should be non-null";
        if(!this._components)
            return false;
        if(name instanceof cc.Component)
            return this._removeByComponent(name);
        else {
            name = name.trim();
            return this._removeByComponent(this._components[name]);
        }
    },
    _removeByComponent:function(component){
        if(!component)
            return false;
        component.onExit();
        component.setOwner(null);
        delete this._components[component.getName()];
        return true;
    },
    removeAll:function(){
        if(!this._components)
            return;
        var locComponents = this._components;
        for(var selKey in locComponents){
            var selComponent = locComponents[selKey];
            selComponent.onExit();
            selComponent.setOwner(null);
            delete locComponents[selKey];
        }
        this._owner.unscheduleUpdate();
        this._components = null;
    },
    _alloc:function(){
        this._components = {};
    },
    visit:function(delta){
        if(!this._components)
            return;
        var locComponents = this._components;
        for(var selKey in locComponents)
             locComponents[selKey].update(delta);
    },
    isEmpty: function () {
        if (!this._components)
            return true;
        return this._components.length == 0;
    }
});
var ccs = ccs || {};
ccs.Class = ccs.Class || cc.Class;
ccs.Class.extend = ccs.Class.extend || cc.Class.extend;
ccs.Node = ccs.Node || cc.Node;
ccs.Node.extend = ccs.Node.extend || cc.Node.extend;
ccs.Sprite = ccs.Sprite || cc.Sprite;
ccs.Sprite.extend = ccs.Sprite.extend || cc.Sprite.extend;
ccs.Component = ccs.Component || cc.Component;
ccs.Component.extend = ccs.Component.extend || cc.Component.extend;
ccs.cocostudioVersion = "v1.3.0.0";
ccs.VERSION_COMBINED = 0.30;
ccs.VERSION_CHANGE_ROTATION_RANGE = 1.0;
ccs.VERSION_COLOR_READING = 1.1;
ccs.MAX_VERTEXZ_VALUE = 5000000.0;
ccs.ARMATURE_MAX_CHILD = 50.0;
ccs.ARMATURE_MAX_ZORDER = 100;
ccs.ARMATURE_MAX_COUNT = ((ccs.MAX_VERTEXZ_VALUE) / (ccs.ARMATURE_MAX_CHILD) / ccs.ARMATURE_MAX_ZORDER);
ccs.AUTO_ADD_SPRITE_FRAME_NAME_PREFIX = false;
ccs.ENABLE_PHYSICS_CHIPMUNK_DETECT = false;
ccs.ENABLE_PHYSICS_SAVE_CALCULATED_VERTEX = false;
ccs.armatureVersion = function(){
    return "v1.1.0.0";
};
ccs.CONST_VERSION = "version";
ccs.CONST_VERSION_2_0 = 2.0;
ccs.CONST_VERSION_COMBINED = 0.3;
ccs.CONST_ARMATURES = "armatures";
ccs.CONST_ARMATURE = "armature";
ccs.CONST_BONE = "b";
ccs.CONST_DISPLAY = "d";
ccs.CONST_ANIMATIONS = "animations";
ccs.CONST_ANIMATION = "animation";
ccs.CONST_MOVEMENT = "mov";
ccs.CONST_FRAME = "f";
ccs.CONST_TEXTURE_ATLAS = "TextureAtlas";
ccs.CONST_SUB_TEXTURE = "SubTexture";
ccs.CONST_SKELETON = "skeleton";
ccs.CONST_A_NAME = "name";
ccs.CONST_A_DURATION = "dr";
ccs.CONST_A_FRAME_INDEX = "fi";
ccs.CONST_A_DURATION_TO = "to";
ccs.CONST_A_DURATION_TWEEN = "drTW";
ccs.CONST_A_LOOP = "lp";
ccs.CONST_A_MOVEMENT_SCALE = "sc";
ccs.CONST_A_MOVEMENT_DELAY = "dl";
ccs.CONST_A_DISPLAY_INDEX = "dI";
ccs.CONST_A_PLIST = "plist";
ccs.CONST_A_PARENT = "parent";
ccs.CONST_A_SKEW_X = "kX";
ccs.CONST_A_SKEW_Y = "kY";
ccs.CONST_A_SCALE_X = "cX";
ccs.CONST_A_SCALE_Y = "cY";
ccs.CONST_A_Z = "z";
ccs.CONST_A_EVENT = "evt";
ccs.CONST_A_SOUND = "sd";
ccs.CONST_A_SOUND_EFFECT = "sdE";
ccs.CONST_A_TWEEN_EASING = "twE";
ccs.CONST_A_EASING_PARAM = "twEP";
ccs.CONST_A_TWEEN_ROTATE = "twR";
ccs.CONST_A_IS_ARMATURE = "isArmature";
ccs.CONST_A_DISPLAY_TYPE = "displayType";
ccs.CONST_A_MOVEMENT = "mov";
ccs.CONST_A_X = "x";
ccs.CONST_A_Y = "y";
ccs.CONST_A_COCOS2DX_X = "cocos2d_x";
ccs.CONST_A_COCOS2DX_Y = "cocos2d_y";
ccs.CONST_A_WIDTH = "width";
ccs.CONST_A_HEIGHT = "height";
ccs.CONST_A_PIVOT_X = "pX";
ccs.CONST_A_PIVOT_Y = "pY";
ccs.CONST_A_COCOS2D_PIVOT_X = "cocos2d_pX";
ccs.CONST_A_COCOS2D_PIVOT_Y = "cocos2d_pY";
ccs.CONST_A_BLEND_TYPE = "bd";
ccs.CONST_A_BLEND_SRC = "bd_src";
ccs.CONST_A_BLEND_DST = "bd_dst";
ccs.CONST_A_ALPHA = "a";
ccs.CONST_A_RED = "r";
ccs.CONST_A_GREEN = "g";
ccs.CONST_A_BLUE = "b";
ccs.CONST_A_ALPHA_OFFSET = "aM";
ccs.CONST_A_RED_OFFSET = "rM";
ccs.CONST_A_GREEN_OFFSET = "gM";
ccs.CONST_A_BLUE_OFFSET = "bM";
ccs.CONST_A_COLOR_TRANSFORM = "colorTransform";
ccs.CONST_A_TWEEN_FRAME = "tweenFrame";
ccs.CONST_CONTOUR = "con";
ccs.CONST_CONTOUR_VERTEX = "con_vt";
ccs.CONST_FL_NAN = "NaN";
ccs.CONST_FRAME_DATA = "frame_data";
ccs.CONST_MOVEMENT_BONE_DATA = "mov_bone_data";
ccs.CONST_MOVEMENT_DATA = "mov_data";
ccs.CONST_ANIMATION_DATA = "animation_data";
ccs.CONST_DISPLAY_DATA = "display_data";
ccs.CONST_SKIN_DATA = "skin_data";
ccs.CONST_BONE_DATA = "bone_data";
ccs.CONST_ARMATURE_DATA = "armature_data";
ccs.CONST_CONTOUR_DATA = "contour_data";
ccs.CONST_TEXTURE_DATA = "texture_data";
ccs.CONST_VERTEX_POINT = "vertex";
ccs.CONST_COLOR_INFO = "color";
ccs.CONST_CONFIG_FILE_PATH = "config_file_path";
ccs.CONST_CONTENT_SCALE = "content_scale";
ccs.DataInfo = function () {
    this.asyncStruct = null;
    this.configFileQueue = [];
    this.contentScale = 1;
    this.filename = "";
    this.baseFilePath = "";
    this.flashToolVersion = 0;
    this.cocoStudioVersion = 0
};
ccs.dataReaderHelper = {
    ConfigType: {
        DragonBone_XML: 0,
        CocoStudio_JSON: 1,
        CocoStudio_Binary: 2
    },
    _configFileList: [],
    _flashToolVersion: ccs.CONST_VERSION_2_0,
    _positionReadScale: 1,
    _asyncRefCount: 0,
    _asyncRefTotalCount: 0,
    _dataQueue: null,
    setPositionReadScale: function (scale) {
        this._positionReadScale = scale;
    },
    getPositionReadScale: function () {
        return this._positionReadScale;
    },
    addDataFromFile: function (filePath) {
        if (this._configFileList.indexOf(filePath) != -1)
            return;
        this._configFileList.push(filePath);
        var basefilePath = this._initBaseFilePath(filePath);
        var str = cc.path.extname(filePath).toLowerCase();
        var dataInfo = new ccs.DataInfo();
        dataInfo.filename = filePath;
        dataInfo.basefilePath = basefilePath;
        if (str == ".xml")
            ccs.dataReaderHelper.addDataFromXML(filePath, dataInfo);
        else if (str == ".json" || str == ".exportjson")
            ccs.dataReaderHelper.addDataFromJson(filePath, dataInfo);
        else if(str == ".csb")
            ccs.dataReaderHelper.addDataFromBinaryCache(filePath, dataInfo);
    },
    addDataFromFileAsync: function (imagePath, plistPath, filePath, selector, target) {
        if (this._configFileList.indexOf(filePath) != -1) {
            if (target && selector) {
                if (this._asyncRefTotalCount == 0 && this._asyncRefCount == 0)
                    this._asyncCallBack(selector,target, 1);
                else
                    this._asyncCallBack(selector, target, (this._asyncRefTotalCount - this._asyncRefCount) / this._asyncRefTotalCount);
            }
            return;
        }
        this._asyncRefTotalCount++;
        this._asyncRefCount++;
        var self = this;
        var fun = function () {
            self.addDataFromFile(filePath);
            self._asyncRefCount--;
            self._asyncCallBack(selector,target, (self._asyncRefTotalCount - self._asyncRefCount) / self._asyncRefTotalCount);
        };
        cc.director.getScheduler().scheduleCallbackForTarget(this, fun, 0.1, false);
    },
    removeConfigFile: function (configFile) {
        var locFileList = this._configFileList;
        var len = locFileList.length;
        var it = locFileList[len];
        for (var i = 0;i<len; i++){
            if (locFileList[i] == configFile)
                it = i;
        }
        if (it != locFileList[len])
            cc.arrayRemoveObject(locFileList, configFile);
    },
    addDataFromCache: function (skeleton, dataInfo) {
        if (!skeleton) {
            cc.log("XML error  or  XML is empty.");
            return;
        }
        dataInfo.flashToolVersion = parseFloat(skeleton.getAttribute(ccs.CONST_VERSION));
        var armaturesXML = skeleton.querySelectorAll(ccs.CONST_SKELETON + " > " + ccs.CONST_ARMATURES + " >  " + ccs.CONST_ARMATURE + "");
        var armatureDataManager = ccs.armatureDataManager, i;
        for (i = 0; i < armaturesXML.length; i++) {
            var armatureData = this.decodeArmature(armaturesXML[i], dataInfo);
            armatureDataManager.addArmatureData(armatureData.name, armatureData, dataInfo.filename);
        }
        var animationsXML = skeleton.querySelectorAll(ccs.CONST_SKELETON + " > " + ccs.CONST_ANIMATIONS + " >  " + ccs.CONST_ANIMATION + "");
        for (i = 0; i < animationsXML.length; i++) {
            var animationData = this.decodeAnimation(animationsXML[i], dataInfo);
            armatureDataManager.addAnimationData(animationData.name, animationData, dataInfo.filename);
        }
        var texturesXML = skeleton.querySelectorAll(ccs.CONST_SKELETON + " > " + ccs.CONST_TEXTURE_ATLAS + " >  " + ccs.CONST_SUB_TEXTURE + "");
        for (i = 0; i < texturesXML.length; i++) {
            var textureData = this.decodeTexture(texturesXML[i], dataInfo);
            armatureDataManager.addTextureData(textureData.name, textureData, dataInfo.filename);
        }
    },
    decodeArmature: function (armatureXML, dataInfo) {
        var armatureData = new ccs.ArmatureData();
        armatureData.init();
        armatureData.name = armatureXML.getAttribute(ccs.CONST_A_NAME);
        var bonesXML = armatureXML.querySelectorAll(ccs.CONST_ARMATURE + " > " + ccs.CONST_BONE);
        for (var i = 0; i < bonesXML.length; i++) {
            var boneXML = bonesXML[i];
            var parentName = boneXML.getAttribute(ccs.CONST_A_PARENT);
            var parentXML = null;
            if (parentName) {
                for (var j = 0; j < bonesXML.length; j++) {
                    parentXML = bonesXML[j];
                    if (parentName == bonesXML[j].getAttribute(ccs.CONST_A_NAME)) {
                        break;
                    }
                }
            }
            var boneData = this.decodeBone(boneXML, parentXML, dataInfo);
            armatureData.addBoneData(boneData);
        }
        return armatureData;
    },
    decodeArmatureFromJSON: function (json, dataInfo) {
        var armatureData = new ccs.ArmatureData();
        armatureData.init();
        var name = json[ccs.CONST_A_NAME];
        if (name) {
            armatureData.name = name;
        }
        dataInfo.cocoStudioVersion = armatureData.dataVersion = json[ccs.CONST_VERSION] || 0.1;
        var boneDataList = json[ccs.CONST_BONE_DATA];
        for (var i = 0; i < boneDataList.length; i++) {
            var boneData = this.decodeBoneFromJson(boneDataList[i], dataInfo);
            armatureData.addBoneData(boneData);
        }
        return armatureData;
    },
    decodeBone: function (boneXML, parentXML, dataInfo) {
        var boneData = new ccs.BoneData();
        boneData.init();
        boneData.name = boneXML.getAttribute(ccs.CONST_A_NAME);
        boneData.parentName = boneXML.getAttribute(ccs.CONST_A_PARENT) || "";
        boneData.zOrder = parseInt(boneXML.getAttribute(ccs.CONST_A_Z)) || 0;
        var displaysXML = boneXML.querySelectorAll(ccs.CONST_BONE + " > " + ccs.CONST_DISPLAY);
        for (var i = 0; i < displaysXML.length; i++) {
            var displayXML = displaysXML[i];
            var displayData = this.decodeBoneDisplay(displayXML, dataInfo);
            boneData.addDisplayData(displayData);
        }
        return boneData;
    },
    decodeBoneFromJson: function (json, dataInfo) {
        var boneData = new ccs.BoneData();
        boneData.init();
        this.decodeNodeFromJson(boneData, json, dataInfo);
        boneData.name = json[ccs.CONST_A_NAME] || "";
        boneData.parentName = json[ccs.CONST_A_PARENT] || "";
        var displayDataList = json[ccs.CONST_DISPLAY_DATA] || [];
        for (var i = 0; i < displayDataList.length; i++) {
            var locDisplayData = this.decodeBoneDisplayFromJson(displayDataList[i], dataInfo);
            boneData.addDisplayData(locDisplayData);
        }
        return boneData;
    },
    decodeBoneDisplay: function (displayXML, dataInfo) {
        var isArmature = parseFloat(displayXML.getAttribute(ccs.CONST_A_IS_ARMATURE)) || 0;
        var displayData = null;
        if (isArmature == 1) {
            displayData = new ccs.ArmatureDisplayData();
            displayData.displayType = ccs.DISPLAY_TYPE_ARMATURE;
        } else {
            displayData = new ccs.SpriteDisplayData();
            displayData.displayType = ccs.DISPLAY_TYPE_SPRITE;
        }
        var displayName = displayXML.getAttribute(ccs.CONST_A_NAME) || "";
        if (displayName) {
            displayData.displayName = displayName;
        }
        return displayData;
    },
    decodeBoneDisplayFromJson: function (json, dataInfo) {
        var displayType = json[ccs.CONST_A_DISPLAY_TYPE] || ccs.DISPLAY_TYPE_SPRITE;
        var displayData = null;
        switch (displayType) {
            case ccs.DISPLAY_TYPE_SPRITE:
                displayData = new ccs.SpriteDisplayData();
                var name = json[ccs.CONST_A_NAME];
                if(name != null){
                    displayData.displayName =  name;
                }
                var dicArray = json[ccs.CONST_SKIN_DATA] || [];
                var dic = dicArray[0];
                if (dic) {
                    var skinData = displayData.skinData;
                    skinData.x = dic[ccs.CONST_A_X] * this._positionReadScale;
                    skinData.y = dic[ccs.CONST_A_Y] * this._positionReadScale;
                    skinData.scaleX = dic[ccs.CONST_A_SCALE_X] == null ? 1 : dic[ccs.CONST_A_SCALE_X];
                    skinData.scaleY = dic[ccs.CONST_A_SCALE_Y] == null ? 1 : dic[ccs.CONST_A_SCALE_Y];
                    skinData.skewX = dic[ccs.CONST_A_SKEW_X] == null ? 1 : dic[ccs.CONST_A_SKEW_X];
                    skinData.skewY = dic[ccs.CONST_A_SKEW_Y] == null ? 1 : dic[ccs.CONST_A_SKEW_Y];
                    skinData.x *= dataInfo.contentScale;
                    skinData.y *= dataInfo.contentScale;
                }
                break;
            case ccs.DISPLAY_TYPE_ARMATURE:
                displayData = new ccs.ArmatureDisplayData();
                var name = json[ccs.CONST_A_NAME];
                if(name != null){
                    displayData.displayName = json[ccs.CONST_A_NAME];
                }
                break;
            case ccs.DISPLAY_TYPE_PARTICLE:
                displayData = new ccs.ParticleDisplayData();
                var plist = json[ccs.CONST_A_PLIST];
                if(plist != null){
                    if(dataInfo.asyncStruct){
                        displayData.displayName = dataInfo.asyncStruct.basefilePath + plist;
                    }else{
                        displayData.displayName = dataInfo.basefilePath + plist;
                    }
                }
                break;
            default:
                displayData = new ccs.SpriteDisplayData();
                break;
        }
        displayData.displayType = displayType;
        return displayData;
    },
    decodeAnimation: function (animationXML, dataInfo) {
        var aniData = new ccs.AnimationData();
        var name = animationXML.getAttribute(ccs.CONST_A_NAME);
        var armatureData = ccs.armatureDataManager.getArmatureData(name);
        aniData.name = name;
        var movementsXML = animationXML.querySelectorAll(ccs.CONST_ANIMATION + " > " + ccs.CONST_MOVEMENT);
        var movementXML = null;
        for (var i = 0; i < movementsXML.length; i++) {
            movementXML = movementsXML[i];
            var movementData = this.decodeMovement(movementXML, armatureData, dataInfo);
            aniData.addMovement(movementData);
        }
        return aniData;
    },
    decodeAnimationFromJson: function (json, dataInfo) {
        var aniData = new ccs.AnimationData();
        var name = json[ccs.CONST_A_NAME];
        if(name){
            aniData.name = json[ccs.CONST_A_NAME];
        }
        var movementDataList = json[ccs.CONST_MOVEMENT_DATA] || [];
        for (var i = 0; i < movementDataList.length; i++) {
            var locMovementData = this.decodeMovementFromJson(movementDataList[i], dataInfo);
            aniData.addMovement(locMovementData);
        }
        return aniData;
    },
    decodeMovement: function (movementXML, armatureData, dataInfo) {
        var movementData = new ccs.MovementData();
        movementData.name = movementXML.getAttribute(ccs.CONST_A_NAME);
        var duration, durationTo, durationTween, loop, tweenEasing = 0;
        duration = movementXML.getAttribute(ccs.CONST_A_DURATION);
        movementData.duration = duration == null ? 0 : parseFloat(duration);
        durationTo = movementXML.getAttribute(ccs.CONST_A_DURATION_TO);
        movementData.durationTo = durationTo == null ? 0 : parseFloat(durationTo);
        durationTween = movementXML.getAttribute(ccs.CONST_A_DURATION_TWEEN);
        movementData.durationTween = durationTween == null ? 0 : parseFloat(durationTween);
        loop = movementXML.getAttribute(ccs.CONST_A_LOOP);
        movementData.loop = loop ? Boolean(parseFloat(loop)) : true;
        var easing = movementXML.getAttribute(ccs.CONST_A_TWEEN_EASING);
        if (easing) {
            if (easing != ccs.CONST_FL_NAN) {
                tweenEasing = easing == null ? 0 : parseFloat(easing);
                movementData.tweenEasing = tweenEasing == 2 ? ccs.TweenType.sineEaseInOut : tweenEasing;
            } else
                movementData.tweenEasing = ccs.TweenType.linear;
        }
        var movBonesXml = movementXML.querySelectorAll(ccs.CONST_MOVEMENT + " > " + ccs.CONST_BONE);
        var movBoneXml = null;
        for (var i = 0; i < movBonesXml.length; i++) {
            movBoneXml = movBonesXml[i];
            var boneName = movBoneXml.getAttribute(ccs.CONST_A_NAME);
            if (movementData.getMovementBoneData(boneName))
                continue;
            var boneData = armatureData.getBoneData(boneName);
            var parentName = boneData.parentName;
            var parentXML = null;
            if (parentName != "") {
                for (var j = 0; j < movBonesXml.length; j++) {
                    parentXML = movBonesXml[j];
                    if (parentName == parentXML.getAttribute(ccs.CONST_A_NAME))
                        break;
                }
            }
            var moveBoneData = this.decodeMovementBone(movBoneXml, parentXML, boneData, dataInfo);
            movementData.addMovementBoneData(moveBoneData);
        }
        return movementData;
    },
    decodeMovementFromJson: function (json, dataInfo) {
        var movementData = new ccs.MovementData();
        movementData.loop = json[ccs.CONST_A_LOOP] == null ? false : json[ccs.CONST_A_LOOP];
        movementData.durationTween = json[ccs.CONST_A_DURATION_TWEEN] || 0;
        movementData.durationTo = json[ccs.CONST_A_DURATION_TO] || 0;
        movementData.duration = json[ccs.CONST_A_DURATION] || 0;
        if(json[ccs.CONST_A_DURATION] == null){
            movementData.scale = 1;
        }else{
            movementData.scale = json[ccs.CONST_A_MOVEMENT_SCALE] == null ? 1 : json[ccs.CONST_A_MOVEMENT_SCALE];
        }
        movementData.tweenEasing = json[ccs.CONST_A_TWEEN_EASING] == null ? ccs.TweenType.linear : json[ccs.CONST_A_TWEEN_EASING];
        var name = json[ccs.CONST_A_NAME];
        if(name)
            movementData.name = name;
        var movementBoneList = json[ccs.CONST_MOVEMENT_BONE_DATA] || [];
        for (var i = 0; i < movementBoneList.length; i++) {
            var locMovementBoneData = this.decodeMovementBoneFromJson(movementBoneList[i], dataInfo);
            movementData.addMovementBoneData(locMovementBoneData);
        }
        return movementData;
    },
    decodeMovementBone: function (movBoneXml, parentXml, boneData, dataInfo) {
        var movBoneData = new ccs.MovementBoneData();
        movBoneData.init();
        var scale, delay;
        if (movBoneXml) {
            scale = parseFloat(movBoneXml.getAttribute(ccs.CONST_A_MOVEMENT_SCALE)) || 0;
            movBoneData.scale = scale;
            delay = parseFloat(movBoneXml.getAttribute(ccs.CONST_A_MOVEMENT_DELAY)) || 0;
            if (delay > 0)
                delay -= 1;
            movBoneData.delay = delay;
        }
        var length = 0, parentTotalDuration = 0,currentDuration = 0;
        var parentFrameXML = null,parentXMLList = [];
        if (parentXml != null) {
            var parentFramesXML = parentXml.querySelectorAll(ccs.CONST_BONE + " > " + ccs.CONST_FRAME);
            for (var i = 0; i < parentFramesXML.length; i++)
                parentXMLList.push(parentFramesXML[i]);
            length = parentXMLList.length;
        }
        movBoneData.name = movBoneXml.getAttribute(ccs.CONST_A_NAME);
        var framesXML = movBoneXml.querySelectorAll(ccs.CONST_BONE + " > " + ccs.CONST_FRAME);
        var j = 0, totalDuration = 0;
        for (var ii = 0; ii < framesXML.length; ii++) {
            var frameXML = framesXML[ii];
            if (parentXml) {
                while (j < length && (parentFrameXML ? (totalDuration < parentTotalDuration || totalDuration >= parentTotalDuration + currentDuration) : true)) {
                    parentFrameXML = parentXMLList[j];
                    parentTotalDuration += currentDuration;
                    currentDuration = parseFloat(parentFrameXML.getAttribute(ccs.CONST_A_DURATION));
                    j++;
                }
            }
            var boneFrameData = this.decodeFrame(frameXML, parentFrameXML, boneData, dataInfo);
            movBoneData.addFrameData(boneFrameData);
            boneFrameData.frameID = totalDuration;
            totalDuration += boneFrameData.duration;
            movBoneData.duration = totalDuration;
        }
        var frames = movBoneData.frameList, pi = Math.PI;
        for (var i = frames.length - 1; i >= 0; i--) {
            if (i > 0) {
                var difSkewX = frames[i].skewX - frames[i - 1].skewX;
                var difSkewY = frames[i].skewY - frames[i - 1].skewY;
                if (difSkewX < -pi || difSkewX > pi) {
                    frames[i - 1].skewX = difSkewX < 0 ? frames[i - 1].skewX - 2 * pi : frames[i - 1].skewX + 2 * pi;
                }
                if (difSkewY < -pi || difSkewY > pi) {
                    frames[i - 1].skewY = difSkewY < 0 ? frames[i - 1].skewY - 2 * pi : frames[i - 1].skewY + 2 * pi;
                }
            }
        }
        var frameData = new ccs.FrameData();
        frameData.copy(movBoneData.frameList[movBoneData.frameList.length - 1]);
        frameData.frameID = movBoneData.duration;
        movBoneData.addFrameData(frameData);
        return movBoneData;
    },
    decodeMovementBoneFromJson: function (json, dataInfo) {
        var movementBoneData = new ccs.MovementBoneData();
        movementBoneData.init();
        movementBoneData.delay = json[ccs.CONST_A_MOVEMENT_DELAY] || 0;
        var name = json[ccs.CONST_A_NAME];
        if(name)
            movementBoneData.name = name;
        var framesData = json[ccs.CONST_FRAME_DATA] || [];
        var length = framesData.length;
        for (var i = 0; i < length; i++) {
            var dic = json[ccs.CONST_FRAME_DATA][i];
            var frameData = this.decodeFrameFromJson(dic, dataInfo);
            movementBoneData.addFrameData(frameData);
            if (dataInfo.cocoStudioVersion < ccs.CONST_VERSION_COMBINED){
                frameData.frameID = movementBoneData.duration;
                movementBoneData.duration += frameData.duration;
            }
        }
        if (dataInfo.cocoStudioVersion < ccs.VERSION_CHANGE_ROTATION_RANGE) {
            var frames = movementBoneData.frameList;
            var pi = Math.PI;
            for (var i = frames.length - 1; i >= 0; i--) {
                if (i > 0) {
                    var difSkewX = frames[i].skewX - frames[i - 1].skewX;
                    var difSkewY = frames[i].skewY - frames[i - 1].skewY;
                    if (difSkewX < -pi || difSkewX > pi) {
                        frames[i - 1].skewX = difSkewX < 0 ? frames[i - 1].skewX - 2 * pi : frames[i - 1].skewX + 2 * pi;
                    }
                    if (difSkewY < -pi || difSkewY > pi) {
                        frames[i - 1].skewY = difSkewY < 0 ? frames[i - 1].skewY - 2 * pi : frames[i - 1].skewY + 2 * pi;
                    }
                }
            }
        }
        if (dataInfo.cocoStudioVersion < ccs.CONST_VERSION_COMBINED) {
            if (movementBoneData.frameList.length > 0) {
                var frameData = new ccs.FrameData();
                frameData.copy(movementBoneData.frameList[movementBoneData.frameList.length - 1]);
                movementBoneData.addFrameData(frameData);
                frameData.frameID = movementBoneData.duration;
            }
        }
        return movementBoneData;
    },
    decodeFrame: function (frameXML, parentFrameXml, boneData, dataInfo) {
        var x = 0, y = 0, scale_x = 0, scale_y = 0, skew_x = 0, skew_y = 0, tweenRotate = 0;
        var duration = 0, displayIndex = 0, zOrder = 0, tweenEasing = 0, blendType = 0;
        var frameData = new ccs.FrameData();
        frameData.strMovement = frameXML.getAttribute(ccs.CONST_A_MOVEMENT) || "";
        frameData.movement = frameData.strMovement;
        frameData.strEvent = frameXML.getAttribute(ccs.CONST_A_EVENT) || "";
        frameData.event = frameData.strEvent;
        frameData.strSound = frameXML.getAttribute(ccs.CONST_A_SOUND) || "";
        frameData.sound = frameData.strSound;
        frameData.strSoundEffect = frameXML.getAttribute(ccs.CONST_A_SOUND_EFFECT) || "";
        frameData.soundEffect = frameData.strSoundEffect;
        var isTween = frameXML.getAttribute(ccs.CONST_A_TWEEN_FRAME);
        frameData.isTween = !(isTween != undefined && isTween == "false");
        if (dataInfo.flashToolVersion >= ccs.CONST_VERSION_2_0) {
            x = frameXML.getAttribute(ccs.CONST_A_COCOS2DX_X);
            if(x){
                frameData.x = parseFloat(x);
                frameData.x *= this._positionReadScale;
            }
            y = frameXML.getAttribute(ccs.CONST_A_COCOS2DX_Y);
            if(y){
                frameData.y = -parseFloat(y);
                frameData.y *= this._positionReadScale;
            }
        } else {
            x = frameXML.getAttribute(ccs.CONST_A_X);
            if(x) {
                frameData.x = parseFloat(x);
                frameData.x *= this._positionReadScale;
            }
            y = frameXML.getAttribute(ccs.CONST_A_Y);
            if(y) {
                frameData.y = -parseFloat(y);
                frameData.y *= this._positionReadScale;
            }
        }
        scale_x = frameXML.getAttribute(ccs.CONST_A_SCALE_X);
        if( scale_x != null )
            frameData.scaleX = parseFloat(scale_x);
        scale_y = frameXML.getAttribute(ccs.CONST_A_SCALE_Y);
        if( scale_y != null )
            frameData.scaleY = parseFloat(scale_y);
        skew_x = frameXML.getAttribute(ccs.CONST_A_SKEW_X);
        if( skew_x != null )
            frameData.skewX = cc.degreesToRadians(parseFloat(skew_x));
        skew_y = frameXML.getAttribute(ccs.CONST_A_SKEW_Y);
        if( skew_y != null )
            frameData.skewY = cc.degreesToRadians(-parseFloat(skew_y));
        duration = frameXML.getAttribute(ccs.CONST_A_DURATION);
        if( duration != null )
            frameData.duration = parseFloat(duration);
        displayIndex = frameXML.getAttribute(ccs.CONST_A_DISPLAY_INDEX);
        if( displayIndex != null )
            frameData.displayIndex = parseFloat(displayIndex);
        zOrder = frameXML.getAttribute(ccs.CONST_A_Z);
        if( zOrder != null )
            frameData.zOrder = parseInt(zOrder);
        tweenRotate = frameXML.getAttribute(ccs.CONST_A_TWEEN_ROTATE);
        if( tweenRotate != null )
            frameData.tweenRotate = parseFloat(tweenRotate);
        blendType = frameXML.getAttribute(ccs.CONST_A_BLEND_TYPE);
        if ( blendType != null ) {
            var blendFunc = frameData.blendFunc;
            switch (blendType) {
                case ccs.BLEND_TYPE_NORMAL:
                    blendFunc.src = cc.BLEND_SRC;
                    blendFunc.dst = cc.BLEND_DST;
                    break;
                case ccs.BLEND_TYPE_ADD:
                    blendFunc.src = cc.SRC_ALPHA;
                    blendFunc.dst = cc.ONE;
                    break;
                case ccs.BLEND_TYPE_MULTIPLY:
                    blendFunc.src = cc.DST_COLOR;
                    blendFunc.dst = cc.ONE_MINUS_SRC_ALPHA;
                    break;
                case ccs.BLEND_TYPE_SCREEN:
                    blendFunc.src = cc.ONE;
                    blendFunc.dst = cc.ONE_MINUS_DST_COLOR;
                    break;
                default:
                    frameData.blendFunc.src = cc.BLEND_SRC;
                    frameData.blendFunc.dst = cc.BLEND_DST;
                    break;
            }
        }
        var colorTransformXML = frameXML.querySelectorAll(ccs.CONST_FRAME + " > " + ccs.CONST_A_COLOR_TRANSFORM);
        if (colorTransformXML && colorTransformXML.length > 0) {
            colorTransformXML = colorTransformXML[0];
            var alpha, red, green, blue;
            var alphaOffset, redOffset, greenOffset, blueOffset;
            alpha = parseFloat(colorTransformXML.getAttribute(ccs.CONST_A_ALPHA)) || 0;
            red = parseFloat(colorTransformXML.getAttribute(ccs.CONST_A_RED)) || 0;
            green = parseFloat(colorTransformXML.getAttribute(ccs.CONST_A_GREEN)) || 0;
            blue = parseFloat(colorTransformXML.getAttribute(ccs.CONST_A_BLUE)) || 0;
            alphaOffset = parseFloat(colorTransformXML.getAttribute(ccs.CONST_A_ALPHA_OFFSET)) || 0;
            redOffset = parseFloat(colorTransformXML.getAttribute(ccs.CONST_A_RED_OFFSET)) || 0;
            greenOffset = parseFloat(colorTransformXML.getAttribute(ccs.CONST_A_GREEN_OFFSET)) || 0;
            blueOffset = parseFloat(colorTransformXML.getAttribute(ccs.CONST_A_BLUE_OFFSET)) || 0;
            frameData.a = 2.55 * alphaOffset + alpha;
            frameData.r = 2.55 * redOffset + red;
            frameData.g = 2.55 * greenOffset + green;
            frameData.b = 2.55 * blueOffset + blue;
            frameData.isUseColorInfo = true;
        }
        var _easing = frameXML.getAttribute(ccs.CONST_A_TWEEN_EASING);
        if(_easing != null) {
            if(_easing != ccs.CONST_FL_NAN){
                tweenEasing = frameXML.getAttribute(ccs.CONST_A_TWEEN_EASING);
                if( tweenEasing )
                    frameData.tweenEasing = (tweenEasing == 2) ? ccs.TweenType.sineEaseInOut : tweenEasing;
            } else
                frameData.tweenEasing = ccs.TweenType.linear;
        }
        if (parentFrameXml) {
            var helpNode = new ccs.BaseData();
            if (dataInfo.flashToolVersion >= ccs.CONST_VERSION_2_0) {
                helpNode.x = parseFloat(parentFrameXml.getAttribute(ccs.CONST_A_COCOS2DX_X));
                helpNode.y = parseFloat(parentFrameXml.getAttribute(ccs.CONST_A_COCOS2DX_Y));
            } else {
                helpNode.x = parseFloat(parentFrameXml.getAttribute(ccs.CONST_A_X));
                helpNode.y = parseFloat(parentFrameXml.getAttribute(ccs.CONST_A_Y));
            }
            helpNode.skewX = parseFloat(parentFrameXml.getAttribute(ccs.CONST_A_SKEW_X));
            helpNode.skewY = parseFloat(parentFrameXml.getAttribute(ccs.CONST_A_SKEW_Y));
            helpNode.y = -helpNode.y;
            helpNode.skewX = cc.degreesToRadians(helpNode.skewX);
            helpNode.skewY = cc.degreesToRadians(-helpNode.skewY);
            ccs.TransformHelp.transformFromParent(frameData, helpNode);
        }
        return frameData;
    },
    decodeFrameFromJson: function (json, dataInfo) {
        var frameData = new ccs.FrameData();
        this.decodeNodeFromJson(frameData, json, dataInfo);
        frameData.tweenEasing = json[ccs.CONST_A_TWEEN_EASING] || ccs.TweenType.linear;
        frameData.displayIndex = json[ccs.CONST_A_DISPLAY_INDEX];
        var bd_src = json[ccs.CONST_A_BLEND_SRC] == null ? cc.BLEND_SRC : json[ccs.CONST_A_BLEND_SRC];
        var bd_dst = json[ccs.CONST_A_BLEND_DST] == null ? cc.BLEND_DST : json[ccs.CONST_A_BLEND_DST];
        frameData.blendFunc.src = bd_src;
        frameData.blendFunc.dst = bd_dst;
        frameData.isTween = json[ccs.CONST_A_TWEEN_FRAME] == null ? true : json[ccs.CONST_A_TWEEN_FRAME];
        var event = json[ccs.CONST_A_EVENT];
        if(event != null){
            frameData.strEvent = event;
            frameData.event = event;
        }
        if (dataInfo.cocoStudioVersion < ccs.CONST_VERSION_COMBINED)
            frameData.duration = json[ccs.CONST_A_DURATION] == null ? 1 : json[ccs.CONST_A_DURATION];
        else
            frameData.frameID = json[ccs.CONST_A_FRAME_INDEX];
        var twEPs = json[ccs.CONST_A_EASING_PARAM] || [];
        for (var i = 0; i < twEPs.length; i++) {
            frameData.easingParams[i] = twEPs[i];
        }
        return frameData;
    },
    decodeTexture: function (textureXML, dataInfo) {
        var textureData = new ccs.TextureData();
        textureData.init();
        if (textureXML.getAttribute(ccs.CONST_A_NAME)) {
            textureData.name = textureXML.getAttribute(ccs.CONST_A_NAME);
        }
        var px, py;
        if (dataInfo.flashToolVersion >= ccs.CONST_VERSION_2_0) {
            px = parseFloat(textureXML.getAttribute(ccs.CONST_A_COCOS2D_PIVOT_X)) || 0;
            py = parseFloat(textureXML.getAttribute(ccs.CONST_A_COCOS2D_PIVOT_Y)) || 0;
        } else {
            px = parseFloat(textureXML.getAttribute(ccs.CONST_A_PIVOT_X)) || 0;
            py = parseFloat(textureXML.getAttribute(ccs.CONST_A_PIVOT_Y)) || 0;
        }
        var width = parseFloat(textureXML.getAttribute(ccs.CONST_A_WIDTH)) || 0;
        var height = parseFloat(textureXML.getAttribute(ccs.CONST_A_HEIGHT)) || 0;
        var anchorPointX = px / width;
        var anchorPointY = (height - py) / height;
        textureData.pivotX = anchorPointX;
        textureData.pivotY = anchorPointY;
        var contoursXML = textureXML.querySelectorAll(ccs.CONST_SUB_TEXTURE + " > " + ccs.CONST_CONTOUR);
        for (var i = 0; i < contoursXML.length; i++) {
            textureData.addContourData(this.decodeContour(contoursXML[i], dataInfo));
        }
        return textureData;
    },
    decodeTextureFromJson: function (json) {
        var textureData = new ccs.TextureData();
        textureData.init();
        var name = json[ccs.CONST_A_NAME];
        if(name != null)
            textureData.name = name;
        textureData.width = json[ccs.CONST_A_WIDTH] || 0;
        textureData.height = json[ccs.CONST_A_HEIGHT] || 0;
        textureData.pivotX = json[ccs.CONST_A_PIVOT_X] || 0;
        textureData.pivotY = json[ccs.CONST_A_PIVOT_Y] || 0;
        var contourDataList = json[ccs.CONST_CONTOUR_DATA] || [];
        for (var i = 0; i < contourDataList.length; i++) {
            textureData.contourDataList.push(this.decodeContourFromJson(contourDataList[i]));
        }
        return textureData;
    },
    decodeContour: function (contourXML, dataInfo) {
        var contourData = new ccs.ContourData();
        contourData.init();
        var vertexDatasXML = contourXML.querySelectorAll(ccs.CONST_CONTOUR + " > " + ccs.CONST_CONTOUR_VERTEX);
        var vertexDataXML;
        for (var i = 0; i < vertexDatasXML.length; i++) {
            vertexDataXML = vertexDatasXML[i];
            var vertex = cc.p(0, 0);
            vertex.x = parseFloat(vertexDataXML.getAttribute(ccs.CONST_A_X)) || 0;
            vertex.y = parseFloat(vertexDataXML.getAttribute(ccs.CONST_A_Y)) || 0;
            vertex.y = - vertex.y;
            contourData.vertexList.push(vertex);
        }
        return contourData;
    },
    decodeContourFromJson: function (json) {
        var contourData = new ccs.ContourData();
        contourData.init();
        var vertexPointList = json[ccs.CONST_VERTEX_POINT] || [];
        var len = vertexPointList.length;
        for (var i = 0; i < len; i++) {
            var dic = vertexPointList[i];
            var vertex = cc.p(0, 0);
            vertex.x = dic[ccs.CONST_A_X] || 0;
            vertex.y = dic[ccs.CONST_A_Y] || 0;
            contourData.vertexList.push(vertex);
        }
        return contourData;
    },
    addDataFromJsonCache: function (dic, dataInfo) {
        dataInfo.contentScale = dic[ccs.CONST_CONTENT_SCALE] == null ? 1 : dic[ccs.CONST_CONTENT_SCALE];
        var armatureDataArr = dic[ccs.CONST_ARMATURE_DATA] || [], i;
        var armatureData;
        for (i = 0; i < armatureDataArr.length; i++) {
            armatureData = this.decodeArmatureFromJSON(armatureDataArr[i], dataInfo);
            ccs.armatureDataManager.addArmatureData(armatureData.name, armatureData, dataInfo.filename);
        }
        var animationDataArr = dic[ccs.CONST_ANIMATION_DATA] || [];
        var animationData;
        for (i = 0; i < animationDataArr.length; i++) {
            animationData = this.decodeAnimationFromJson(animationDataArr[i], dataInfo);
            ccs.armatureDataManager.addAnimationData(animationData.name, animationData, dataInfo.filename);
        }
        var textureDataArr = dic[ccs.CONST_TEXTURE_DATA] || [];
        var textureData;
        for (i = 0; i < textureDataArr.length; i++) {
            textureData = this.decodeTextureFromJson(textureDataArr[i], dataInfo);
            ccs.armatureDataManager.addTextureData(textureData.name, textureData, dataInfo.filename);
        }
        var autoLoad = dataInfo.asyncStruct == null ? ccs.armatureDataManager.isAutoLoadSpriteFile() : dataInfo.asyncStruct.autoLoadSpriteFile;
        if (autoLoad) {
            var configFiles = dic[ccs.CONST_CONFIG_FILE_PATH] || [];
            var locFilePath, locPos, locPlistPath, locImagePath;
            for (i = 0; i < configFiles.length; i++) {
                locFilePath = configFiles[i];
                locPos = locFilePath.lastIndexOf(".");
                locFilePath = locFilePath.substring(0, locPos);
                locPlistPath = dataInfo.basefilePath + locFilePath + ".plist";
                locImagePath = dataInfo.basefilePath + locFilePath + ".png";
                ccs.armatureDataManager.addSpriteFrameFromFile(locPlistPath, locImagePath, dataInfo.filename);
            }
        }
        armatureData = null;
        animationData = null;
    },
    decodeNodeFromJson: function (node, json, dataInfo) {
        node.x = json[ccs.CONST_A_X] * this._positionReadScale;
        node.y = json[ccs.CONST_A_Y] * this._positionReadScale;
        node.x *= dataInfo.contentScale;
        node.y *= dataInfo.contentScale;
        node.zOrder = json[ccs.CONST_A_Z];
        node.skewX = json[ccs.CONST_A_SKEW_X] || 0;
        node.skewY = json[ccs.CONST_A_SKEW_Y] || 0;
        node.scaleX = json[ccs.CONST_A_SCALE_X] == null ? 1 : json[ccs.CONST_A_SCALE_X];
        node.scaleY = json[ccs.CONST_A_SCALE_Y] == null ? 1 : json[ccs.CONST_A_SCALE_Y];
        var colorDic;
        if (dataInfo.cocoStudioVersion < ccs.VERSION_COLOR_READING) {
            colorDic = json[0];
            if (colorDic){
                node.a = colorDic[ccs.CONST_A_ALPHA] == null ? 255 : colorDic[ccs.CONST_A_ALPHA];
                node.r = colorDic[ccs.CONST_A_RED] == null ? 255 : colorDic[ccs.CONST_A_RED];
                node.g = colorDic[ccs.CONST_A_GREEN] == null ? 255 : colorDic[ccs.CONST_A_GREEN];
                node.b = colorDic[ccs.CONST_A_BLUE] == null ? 255 : colorDic[ccs.CONST_A_BLUE];
                node.isUseColorInfo = true;
            }
        } else {
            colorDic = json[ccs.CONST_COLOR_INFO] || null;
            if (colorDic){
                node.a = colorDic[ccs.CONST_A_ALPHA] == null ? 255 : colorDic[ccs.CONST_A_ALPHA];
                node.r = colorDic[ccs.CONST_A_RED] == null ? 255 : colorDic[ccs.CONST_A_RED];
                node.g = colorDic[ccs.CONST_A_GREEN] == null ? 255 : colorDic[ccs.CONST_A_GREEN];
                node.b = colorDic[ccs.CONST_A_BLUE] == null ? 255 : colorDic[ccs.CONST_A_BLUE];
                node.isUseColorInfo = true;
            }
        }
    },
    clear: function () {
        this._configFileList = [];
        this._asyncRefCount = 0;
        this._asyncRefTotalCount = 0;
    },
    _asyncCallBack: function (selector, target, percent) {
        if(selector && cc.isFunction(selector))
            selector.call(target, percent);
        if(target && selector && typeof selector === 'string')
            target[selector](percent);
    },
    _initBaseFilePath: function (filePath) {
        var path = filePath;
        var pos = path.lastIndexOf("/");
        if (pos > -1)
            path = path.substr(0, pos + 1);
        else
            path = "";
        return path;
    },
    addDataFromXML: function (xml, dataInfo) {
        var xmlStr = cc.loader.getRes(xml);
        if (!xmlStr) throw "Please load the resource first : " + xml;
        var skeletonXML = cc.saxParser.parse(xmlStr);
        var skeleton = skeletonXML.documentElement;
        if (skeleton)
            this.addDataFromCache(skeleton, dataInfo);
    },
    addDataFromJson: function (filePath, dataInfo) {
        var fileContent = cc.loader.getRes(filePath);
        this.addDataFromJsonCache(fileContent, dataInfo);
    }
};
ccs.spriteFrameCacheHelper =  {
    _textureAtlasDic:{},
    _imagePaths:[],
    addSpriteFrameFromFile:function (plistPath, imagePath) {
        cc.spriteFrameCache.addSpriteFrames(plistPath, imagePath);
    },
    getTextureAtlasWithTexture:function (texture) {
        return null;
        var textureName = texture.getName();
        var atlas = this._textureAtlasDic[textureName];
        if (atlas == null) {
            atlas = cc.TextureAtlas.create(texture, 20);
            this._textureAtlasDic[textureName] = atlas;
        }
        return atlas;
    },
	clear: function () {
		this._textureAtlasDic = {};
		this._imagePaths = [];
	}
};
ccs.TransformHelp = ccs.TransformHelp || ccs.Class.extend({});
ccs.TransformHelp.helpMatrix1 = cc.affineTransformMake(1, 0, 0, 1, 0, 0);
ccs.TransformHelp.helpMatrix2 = cc.affineTransformMake(1, 0, 0, 1, 0, 0);
ccs.TransformHelp.helpPoint1 = cc.p(0, 0);
ccs.TransformHelp.helpPoint2 = cc.p(0, 0);
ccs.TransformHelp.helpParentNode = {};
ccs.TransformHelp.transformFromParent = function (bone, parentNode) {
    this.nodeToMatrix(bone, this.helpMatrix1);
    this.nodeToMatrix(parentNode, this.helpMatrix2);
    this.helpMatrix2 = cc.affineTransformInvert(this.helpMatrix2);
    this.helpMatrix1 = cc.affineTransformConcat(this.helpMatrix1, this.helpMatrix2);
    this.matrixToNode(this.helpMatrix1, bone);
};
ccs.TransformHelp.transformToParent = function(node, parentNode){
    this.nodeToMatrix(node, this.helpMatrix1);
    this.nodeToMatrix(parentNode, this.helpMatrix2);
    this.helpMatrix1 = cc.affineTransformConcat(this.helpMatrix1, this.helpMatrix2);
    this.matrixToNode(this.helpMatrix1, node);
};
ccs.TransformHelp.transformFromParentWithoutScale = function(node, parentNode){
    for(var p in parentNode){
        this.helpParentNode[p] = parentNode[p];
    }
    this.helpParentNode.scaleX = 1;
    this.helpParentNode.scaleY = 1;
    this.nodeToMatrix(node, this.helpMatrix1);
    this.nodeToMatrix(this.helpParentNode, this.helpMatrix2);
    this.helpMatrix2 = cc.affineTransformInvert(this.helpMatrix2);
    this.helpMatrix1 = cc.affineTransformConcat(this.helpMatrix1, this.helpMatrix2);
    this.matrixToNode(this.helpMatrix1, node);
};
ccs.TransformHelp.transformToParentWithoutScale = function(node, parentNode){
    for(var p in parentNode){
        this.helpParentNode[p] = parentNode[p];
    }
    this.helpParentNode.scaleX = 1;
    this.helpParentNode.scaleY = 1;
    this.nodeToMatrix(node, this.helpMatrix1);
    this.nodeToMatrix(this.helpParentNode, this.helpMatrix2);
    this.helpMatrix1 = cc.affineTransformConcat(this.helpMatrix1, this.helpMatrix2);
    this.matrixToNode(this.helpMatrix1, node);
};
ccs.TransformHelp.nodeToMatrix = function (node, matrix) {
    if (node.skewX == -node.skewY) {
        var sine = Math.sin(node.skewX);
        var cosine = Math.cos(node.skewX);
        matrix.a = node.scaleX * cosine;
        matrix.b = node.scaleX * -sine;
        matrix.c = node.scaleY * sine;
        matrix.d = node.scaleY * cosine;
    } else {
        matrix.a = node.scaleX * Math.cos(node.skewY);
        matrix.b = node.scaleX * Math.sin(node.skewY);
        matrix.c = node.scaleY * Math.sin(node.skewX);
        matrix.d = node.scaleY * Math.cos(node.skewX);
    }
    matrix.tx = node.x;
    matrix.ty = node.y;
};
ccs.TransformHelp.matrixToNode = function (matrix, node) {
    this.helpPoint1.x = 0;
    this.helpPoint1.y = 1;
    this.helpPoint1 = cc.pointApplyAffineTransform(this.helpPoint1, matrix);
    this.helpPoint1.x -= matrix.tx;
    this.helpPoint1.y -= matrix.ty;
    this.helpPoint2.x = 1;
    this.helpPoint2.y = 0;
    this.helpPoint2 = cc.pointApplyAffineTransform(this.helpPoint2, matrix);
    this.helpPoint2.x -= matrix.tx;
    this.helpPoint2.y -= matrix.ty;
    node.skewX = -(Math.atan2(this.helpPoint1.y, this.helpPoint1.x) - 1.5707964);
    node.skewY = Math.atan2(this.helpPoint2.y, this.helpPoint2.x);
    node.scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
    node.scaleY = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
    node.x = matrix.tx;
    node.y = matrix.ty;
};
ccs.TransformHelp.nodeConcat = function (target, source) {
    target.x += source.x;
    target.y += source.y;
    target.skewX += source.skewX;
    target.skewY += source.skewY;
    target.scaleX += source.scaleX;
    target.scaleY += source.scaleY;
};
ccs.TransformHelp.nodeSub = function (target, source) {
    target.x -= source.x;
    target.y -= source.y;
    target.skewX -= source.skewX;
    target.skewY -= source.skewY;
    target.scaleX -= source.scaleX;
    target.scaleY -= source.scaleY;
};
ccs.TweenType = {
    customEasing: -1,
    linear: 0,
    sineEaseIn: 1,
    sineEaseOut: 2,
    sineEaseInOut: 3,
    quadEaseIn: 4,
    quadEaseOut: 5,
    quadEaseInOut: 6,
    cubicEaseIn: 7,
    cubicEaseOut: 8,
    cubicEaseInOut: 9,
    quartEaseIn: 10,
    quartEaseOut: 11,
    quartEaseInOut: 12,
    quintEaseIn: 13,
    quintEaseOut: 14,
    quintEaseInOut: 15,
    expoEaseIn: 16,
    expoEaseOut: 17,
    expoEaseInOut: 18,
    circEaseIn: 19,
    eircEaseOut: 20,
    circEaseInOut: 21,
    elasticEaseIn: 22,
    elasticEaseOut: 23,
    elasticEaseInOut: 24,
    backEaseIn: 25,
    backEaseOut: 26,
    backEaseInOut: 27,
    bounceEaseIn: 28,
    bounceEaseOut: 29,
    bounceEaseInOut: 30,
    tweenEasingMax: 10000
};
ccs.TweenFunction = ccs.TweenFunction || ccs.Class.extend({});
ccs.DOUBLE_PI = ccs.M_PI_X_2 = Math.PI * 2;
ccs.HALF_PI = ccs.M_PI_2 = Math.PI / 2;
ccs.M_PI = Math.PI;
ccs.TweenFunction.tweenTo = function (time, type, easingParam) {
    var delta = 0;
    switch (type) {
        case ccs.TweenType.customEasing:
            delta = this.customEase(time, easingParam);
            break;
        case ccs.TweenType.linear:
            delta = this.linear(time);
            break;
        case ccs.TweenType.sineEaseIn:
            delta = this.sineEaseIn(time);
            break;
        case ccs.TweenType.sineEaseOut:
            delta = this.sineEaseOut(time);
            break;
        case ccs.TweenType.sineEaseInOut:
            delta = this.sineEaseInOut(time);
            break;
        case ccs.TweenType.quadEaseIn:
            delta = this.quadEaseIn(time);
            break;
        case ccs.TweenType.quadEaseOut:
            delta = this.quadEaseOut(time);
            break;
        case ccs.TweenType.quadEaseInOut:
            delta = this.quadEaseInOut(time);
            break;
        case ccs.TweenType.cubicEaseIn:
            delta = this.cubicEaseIn(time);
            break;
        case ccs.TweenType.cubicEaseOut:
            delta = this.cubicEaseOut(time);
            break;
        case ccs.TweenType.cubicEaseInOut:
            delta = this.cubicEaseInOut(time);
            break;
        case ccs.TweenType.quartEaseIn:
            delta = this.quartEaseIn(time);
            break;
        case ccs.TweenType.quartEaseOut:
            delta = this.quartEaseOut(time);
            break;
        case ccs.TweenType.quartEaseInOut:
            delta = this.quartEaseInOut(time);
            break;
        case ccs.TweenType.quintEaseIn:
            delta = this.quintEaseIn(time);
            break;
        case ccs.TweenType.quintEaseOut:
            delta = this.quintEaseOut(time);
            break;
        case ccs.TweenType.quintEaseInOut:
            delta = this.quintEaseInOut(time);
            break;
        case ccs.TweenType.expoEaseIn:
            delta = this.expoEaseIn(time);
            break;
        case ccs.TweenType.expoEaseOut:
            delta = this.expoEaseOut(time);
            break;
        case ccs.TweenType.expoEaseInOut:
            delta = this.expoEaseInOut(time);
            break;
        case ccs.TweenType.circEaseIn:
            delta = this.circEaseIn(time);
            break;
        case ccs.TweenType.eircEaseOut:
            delta = this.circEaseOut(time);
            break;
        case ccs.TweenType.circEaseInOut:
            delta = this.circEaseInOut(time);
            break;
        case ccs.TweenType.elasticEaseIn:
            var period = 0.3;
            if(null != easingParam && easingParam.length > 0){
                period = easingParam[0];
            }
            delta = this.elasticEaseIn(time, period);
            break;
        case ccs.TweenType.elasticEaseOut:
            var period = 0.3;
            if(null != easingParam && easingParam.length > 0){
                period = easingParam[0];
            }
            delta = this.elasticEaseOut(time, period);
            break;
        case ccs.TweenType.elasticEaseInOut:
            var period = 0.3;
            if(null != easingParam && easingParam.length > 0){
                period = easingParam[0];
            }
            delta = this.elasticEaseInOut(time, period);
            break;
        case ccs.TweenType.backEaseIn:
            delta = this.backEaseIn(time);
            break;
        case ccs.TweenType.backEaseOut:
            delta = this.backEaseOut(time);
            break;
        case ccs.TweenType.backEaseInOut:
            delta = this.backEaseInOut(time);
            break;
        case ccs.TweenType.bounceEaseIn:
            delta = this.bounceEaseIn(time);
            break;
        case ccs.TweenType.bounceEaseOut:
            delta = this.bounceEaseOut(time);
            break;
        case ccs.TweenType.bounceEaseInOut:
            delta = this.bounceEaseInOut(time);
            break;
        default:
            delta = this.sineEaseInOut(time);
            break;
    }
    return delta;
};
ccs.TweenFunction.linear = function (time) {
    return time;
};
ccs.TweenFunction.sineEaseIn = function (time) {
    return -1 * Math.cos(time * ccs.HALF_PI) + 1;
};
ccs.TweenFunction.sineEaseOut = function (time) {
    return Math.sin(time * ccs.HALF_PI);
};
ccs.TweenFunction.sineEaseInOut = function (time) {
    return -0.5 * (Math.cos(ccs.M_PI * time) - 1);
};
ccs.TweenFunction.quadEaseIn = function (time) {
    return time * time;
};
ccs.TweenFunction.quadEaseOut = function (time) {
    return -1 * time * (time - 2);
};
ccs.TweenFunction.quadEaseInOut = function (time) {
    time = time * 2;
    if (time < 1)
        return 0.5 * time * time;
    --time;
    return -0.5 * (time * (time - 2) - 1);
};
ccs.TweenFunction.cubicEaseIn = function (time) {
    return time * time * time;
};
ccs.TweenFunction.cubicEaseOut = function (time) {
    time -= 1;
    return (time * time * time + 1);
};
ccs.TweenFunction.cubicEaseInOut = function (time) {
    time = time * 2;
    if (time < 1)
        return 0.5 * time * time * time;
    time -= 2;
    return 0.5 * (time * time * time + 2);
};
ccs.TweenFunction.quartEaseIn = function (time) {
    return time * time * time * time;
};
ccs.TweenFunction.quartEaseOut = function (time) {
    time -= 1;
    return -(time * time * time * time - 1);
};
ccs.TweenFunction.quartEaseInOut = function (time) {
    time = time * 2;
    if (time < 1)
        return 0.5 * time * time * time * time;
    time -= 2;
    return -0.5 * (time * time * time * time - 2);
};
ccs.TweenFunction.quintEaseIn = function (time) {
    return time * time * time * time * time;
};
ccs.TweenFunction.quintEaseOut = function (time) {
    time -= 1;
    return (time * time * time * time * time + 1);
};
ccs.TweenFunction.quintEaseInOut = function (time) {
    time = time * 2;
    if (time < 1)
        return 0.5 * time * time * time * time * time;
    time -= 2;
    return 0.5 * (time * time * time * time * time + 2);
};
ccs.TweenFunction.expoEaseIn = function (time) {
    return time == 0 ? 0 : Math.pow(2, 10 * (time - 1)) - 0.001;
};
ccs.TweenFunction.expoEaseOut = function (time) {
    return time == 1 ? 1 : (-Math.pow(2, -10 * time) + 1);
};
ccs.TweenFunction.expoEaseInOut = function (time) {
    time /= 0.5;
    if (time < 1) {
        time = 0.5 * Math.pow(2, 10 * (time - 1));
    }
    else {
        time = 0.5 * (-Math.pow(2, -10 * (time - 1)) + 2);
    }
    return time;
};
ccs.TweenFunction.circEaseIn = function (time) {
    return -1 * (Math.sqrt(1 - time * time) - 1);
};
ccs.TweenFunction.circEaseOut = function (time) {
    time = time - 1;
    return Math.sqrt(1 - time * time);
};
ccs.TweenFunction.circEaseInOut = function (time) {
    time = time * 2;
    if (time < 1)
        return -0.5 * (Math.sqrt(1 - time * time) - 1);
    time -= 2;
    return 0.5 * (Math.sqrt(1 - time * time) + 1);
};
ccs.TweenFunction.elasticEaseIn = function (time, easingParam) {
    var period = 0.3;
    if (easingParam.length > 0) {
        period = easingParam[0];
    }
    var newT = 0;
    if (time == 0 || time == 1) {
        newT = time;
    }
    else {
        var s = period / 4;
        time = time - 1;
        newT = -Math.pow(2, 10 * time) * Math.sin((time - s) * ccs.DOUBLE_PI / period);
    }
    return newT;
};
ccs.TweenFunction.elasticEaseOut = function (time, easingParam) {
    var period = 0.3;
    if (easingParam.length > 0) {
        period = easingParam[0];
    }
    var newT = 0;
    if (time == 0 || time == 1) {
        newT = time;
    }
    else {
        var s = period / 4;
        newT = Math.pow(2, -10 * time) * Math.sin((time - s) * ccs.DOUBLE_PI / period) + 1;
    }
    return newT;
};
ccs.TweenFunction.elasticEaseInOut = function (time, easingParam) {
    var period = 0.3;
    if (easingParam.length > 0) {
        period = easingParam[0];
    }
    var newT = 0;
    if (time == 0 || time == 1) {
        newT = time;
    }
    else {
        time = time * 2;
        if (!period) {
            period = 0.3 * 1.5;
        }
        var s = period / 4;
        time = time - 1;
        if (time < 0) {
            newT = -0.5 * Math.pow(2, 10 * time) * Math.sin((time - s) * ccs.DOUBLE_PI / period);
        } else {
            newT = Math.pow(2, -10 * time) * Math.sin((time - s) * ccs.DOUBLE_PI / period) * 0.5 + 1;
        }
    }
    return newT;
};
ccs.TweenFunction.backEaseIn = function (time) {
    var overshoot = 1.70158;
    return time * time * ((overshoot + 1) * time - overshoot);
};
ccs.TweenFunction.backEaseOut = function (time) {
    var overshoot = 1.70158;
    time = time - 1;
    return time * time * ((overshoot + 1) * time + overshoot) + 1;
};
ccs.TweenFunction.backEaseInOut = function (time) {
    var overshoot = 1.70158 * 1.525;
    time = time * 2;
    if (time < 1) {
        return (time * time * ((overshoot + 1) * time - overshoot)) / 2;
    }
    else {
        time = time - 2;
        return (time * time * ((overshoot + 1) * time + overshoot)) / 2 + 1;
    }
};
ccs.bounceTime = function (time) {
    if (time < 1 / 2.75) {
        return 7.5625 * time * time;
    } else if (time < 2 / 2.75) {
        time -= 1.5 / 2.75;
        return 7.5625 * time * time + 0.75;
    } else if (time < 2.5 / 2.75) {
        time -= 2.25 / 2.75;
        return 7.5625 * time * time + 0.9375;
    }
    time -= 2.625 / 2.75;
    return 7.5625 * time * time + 0.984375;
};
ccs.TweenFunction.bounceEaseIn = function (time) {
    return 1 - ccs.bounceTime(1 - time);
};
ccs.TweenFunction.bounceEaseOut = function (time) {
    return ccs.bounceTime(time);
};
ccs.TweenFunction.bounceEaseInOut = function (time) {
    var newT = 0;
    if (time < 0.5) {
        time = time * 2;
        newT = (1 - ccs.bounceTime(1 - time)) * 0.5;
    } else {
        newT = ccs.bounceTime(time * 2 - 1) * 0.5 + 0.5;
    }
    return newT;
};
ccs.TweenFunction.customEase = function (time, easingParam) {
    if (easingParam.length > 0) {
        var tt = 1 - time;
        return easingParam[1] * tt * tt * tt + 3 * easingParam[3] * time * tt * tt + 3 * easingParam[5] * time * time * tt + easingParam[7] * time * time * time;
    }
    return time;
};
ccs.TweenFunction.easeIn = function(time, rate){
    return Math.pow(time, rate);
};
ccs.TweenFunction.easeOut = function(time, rate){
    return Math.pow(time, 1 / rate);
};
ccs.TweenFunction.easeInOut = function(time, rate){
    time *= 2;
    if(time < 1){
        return 0.5 * Math.pow(time, rate);
    }else{
        return 1 - 0.5 * Math.pow(2 - time, rate);
    }
};
ccs.TweenFunction.quadraticIn = function(time){
    return Math.pow(time, 2);
};
ccs.TweenFunction.quadraticOut = function(time){
    return -time * (time - 2);
};
ccs.TweenFunction.bezieratFunction = function(a, b, c, d, t){
    return (Math.pow(1-t,3) * a + 3*t*(Math.pow(1-t,2))*b + 3*Math.pow(t,2)*(1-t)*c + Math.pow(t,3)*d );
};
var ENABLE_PHYSICS_DETECT = false;
ccs.fmodf = function (x, y) {
    while (x > y) {
        x -= y;
    }
    return x;
};
var CC_SAFE_RELEASE = function (obj) {
    if (obj && obj.release) {
        obj.release();
    }
};
ccs.isSpriteContainPoint = function (sprite, point, outPoint) {
    var p = sprite.convertToNodeSpace(point);
    if (outPoint) {
        outPoint.x = p.x;
        outPoint.y = p.y;
    }
    var s = sprite.getContentSize();
    return cc.rectContainsPoint(cc.rect(0, 0, s.width, s.height), p);
};
ccs.SPRITE_CONTAIN_POINT = ccs.isSpriteContainPoint;
ccs.SPRITE_CONTAIN_POINT_WITH_RETURN = ccs.isSpriteContainPoint;
ccs.extBezierTo = function (t, point1, point2, point3, point4) {
    var p = cc.p(0, 0);
    if (point3 && !point4) {
        p.x = Math.pow((1 - t), 2) * point1.x + 2 * t * (1 - t) * point2.x + Math.pow(t, 2) * point3.x;
        p.y = Math.pow((1 - t), 2) * point1.y + 2 * t * (1 - t) * point2.y + Math.pow(t, 2) * point3.y;
    }
    if (point4) {
        p.x = point1.x * Math.pow((1 - t), 3) + 3 * t * point2.x * Math.pow((1 - t), 2) + 3 * point3.x * Math.pow(t, 2) * (1 - t) + point4.x * Math.pow(t, 3);
        p.y = point1.y * Math.pow((1 - t), 3) + 3 * t * point2.y * Math.pow((1 - t), 2) + 3 * point3.y * Math.pow(t, 2) * (1 - t) + point4.y * Math.pow(t, 3);
    }
    return p;
};
ccs.extCircleTo = function (t, center, radius, fromRadian, radianDif) {
    var p = cc.p(0, 0);
    p.x = center.x + radius * Math.cos(fromRadian + radianDif * t);
    p.y = center.y + radius * Math.sin(fromRadian + radianDif * t);
    return p;
};
ccs.RelativeData = function(){
    this.plistFiles=[];
    this.armatures=[];
    this.animations=[];
    this.textures=[];
};
ccs.armatureDataManager = {
    _animationDatas: {},
    _armatureDatas: {},
    _textureDatas: {},
    _autoLoadSpriteFile: false,
    _relativeDatas: {},
    s_sharedArmatureDataManager: null,
    removeArmatureFileInfo:function(configFilePath){
        var data = this.getRelativeData(configFilePath);
        if(data){
            var i, obj;
            for (i = 0; i < data.armatures.length; i++) {
                obj = data.armatures[i];
                this.removeArmatureData(obj);
            }
            for ( i = 0; i < data.animations.length; i++) {
                obj = data.animations[i];
                this.removeAnimationData(obj);
            }
            for ( i = 0; i < data.textures.length; i++) {
                obj = data.textures[i];
                this.removeTextureData(obj);
            }
            for ( i = 0; i < data.plistFiles.length; i++) {
                obj = data.plistFiles[i];
                cc.spriteFrameCache.removeSpriteFramesFromFile(obj);
            }
            delete this._relativeDatas[configFilePath];
            ccs.dataReaderHelper.removeConfigFile(configFilePath);
        }
    },
    addArmatureData:function (id, armatureData, configFilePath) {
        var data = this.getRelativeData(configFilePath);
        if (data){
            data.armatures.push(id);
        }
        this._armatureDatas[id] = armatureData;
    },
    getArmatureData:function (id) {
        var armatureData = null;
        if (this._armatureDatas) {
            armatureData = this._armatureDatas[id];
        }
        return armatureData;
    },
    removeArmatureData:function(id){
        if (this._armatureDatas[id])
            delete this._armatureDatas[id];
    },
    addAnimationData:function (id, animationData, configFilePath) {
        var data = this.getRelativeData(configFilePath);
        if(data)
            data.animations.push(id);
        this._animationDatas[id] = animationData;
    },
    getAnimationData:function (id) {
        var animationData = null;
        if (this._animationDatas[id]) {
            animationData = this._animationDatas[id];
        }
        return animationData;
    },
    removeAnimationData:function(id){
        if (this._animationDatas[id])
            delete this._animationDatas[id];
    },
    addTextureData:function (id, textureData, configFilePath) {
        var data = this.getRelativeData(configFilePath);
        if (data) {
            data.textures.push(id);
        }
        this._textureDatas[id] = textureData;
    },
    getTextureData:function (id) {
        var textureData = null;
        if (this._textureDatas) {
            textureData = this._textureDatas[id];
        }
        return textureData;
    },
    removeTextureData:function(id){
        if (this._textureDatas[id])
            delete this._textureDatas[id];
    },
    addArmatureFileInfo:function () {
        var imagePath, plistPath, configFilePath;
        switch(arguments.length){
            case 1:
                configFilePath = arguments[0];
                this.addRelativeData(configFilePath);
                this._autoLoadSpriteFile = true;
                ccs.dataReaderHelper.addDataFromFile(configFilePath);
                break;
            case 3:
                imagePath = arguments[0];
                plistPath = arguments[1];
                configFilePath = arguments[2];
                this.addRelativeData(configFilePath);
                this._autoLoadSpriteFile = false;
                ccs.dataReaderHelper.addDataFromFile(configFilePath);
                this.addSpriteFrameFromFile(plistPath, imagePath);
        }
    },
    addArmatureFileInfoAsync:function () {
        var imagePath, plistPath, configFilePath, target, selector;
        switch(arguments.length){
            case 3:
                configFilePath = arguments[0];
                target = arguments[2];
                selector = arguments[1];
                this.addRelativeData(configFilePath);
                this._autoLoadSpriteFile = true;
                ccs.dataReaderHelper.addDataFromFileAsync("", "", configFilePath, selector,target);
                break;
            case 5:
                imagePath = arguments[0];
                plistPath = arguments[1];
                configFilePath = arguments[2];
                target = arguments[4];
                selector = arguments[3];
                this.addRelativeData(configFilePath);
                this._autoLoadSpriteFile = false;
                ccs.dataReaderHelper.addDataFromFileAsync(imagePath, plistPath, configFilePath, selector, target);
                this.addSpriteFrameFromFile(plistPath, imagePath);
        }
    },
    addSpriteFrameFromFile:function (plistPath, imagePath, configFilePath) {
        var data = this.getRelativeData(configFilePath);
        if(data)
            data.plistFiles.push(plistPath);
        ccs.spriteFrameCacheHelper.addSpriteFrameFromFile(plistPath, imagePath);
    },
    isAutoLoadSpriteFile:function(){
        return this._autoLoadSpriteFile;
    },
    getArmatureDatas:function () {
        return this._armatureDatas;
    },
    getAnimationDatas:function () {
        return this._animationDatas;
    },
    getTextureDatas:function () {
        return this._textureDatas;
    },
    addRelativeData: function (configFilePath) {
        if (!this._relativeDatas[configFilePath])
            this._relativeDatas[configFilePath] = new ccs.RelativeData();
    },
    getRelativeData: function (configFilePath) {
        return this._relativeDatas[configFilePath];
    },
    clear: function() {
        this._animationDatas = {};
        this._armatureDatas = {};
        this._textureDatas = {};
        ccs.spriteFrameCacheHelper.clear();
        ccs.dataReaderHelper.clear();
    }
};
ccs.BLEND_TYPE_NORMAL = 0;
ccs.BLEND_TYPE_LAYER = 1;
ccs.BLEND_TYPE_DARKEN = 2;
ccs.BLEND_TYPE_MULTIPLY = 3;
ccs.BLEND_TYPE_LIGHTEN = 4;
ccs.BLEND_TYPE_SCREEN = 5;
ccs.BLEND_TYPE_OVERLAY = 6;
ccs.BLEND_TYPE_HIGHLIGHT = 7;
ccs.BLEND_TYPE_ADD = 8;
ccs.BLEND_TYPE_SUBTRACT = 9;
ccs.BLEND_TYPE_DIFFERENCE = 10;
ccs.BLEND_TYPE_INVERT = 11;
ccs.BLEND_TYPE_ALPHA = 12;
ccs.BLEND_TYPE_ERASE = 13;
ccs.DISPLAY_TYPE_SPRITE = 0;
ccs.DISPLAY_TYPE_ARMATURE = 1;
ccs.DISPLAY_TYPE_PARTICLE = 2;
ccs.DISPLAY_TYPE_MAX = 3;
ccs.BaseData = ccs.Class.extend({
    x:0,
    y:0,
    zOrder:0,
    skewX:0,
    skewY:0,
    scaleX:1,
    scaleY:1,
    tweenRotate:0,
    isUseColorInfo:false,
    r:255,
    g:255,
    b:255,
    a:255,
    ctor:function () {
        this.x = 0;
        this.y = 0;
        this.zOrder = 0;
        this.skewX = 0;
        this.skewY = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.tweenRotate = 0;
        this.isUseColorInfo = false;
        this.r = 255;
        this.g = 255;
        this.b = 255;
        this.a = 255;
    },
    copy:function (node) {
        this.x = node.x;
        this.y = node.y;
        this.zOrder = node.zOrder;
        this.scaleX = node.scaleX;
        this.scaleY = node.scaleY;
        this.skewX = node.skewX;
        this.skewY = node.skewY;
        this.tweenRotate = node.tweenRotate;
        this.isUseColorInfo = node.isUseColorInfo;
        this.r = node.r;
        this.g = node.g;
        this.b = node.b;
        this.a = node.a;
    },
    setColor:function(color){
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
    },
    getColor:function(){
        return cc.color(this.r, this.g, this.b, this.a);
    },
    subtract:function (from, to, limit) {
        this.x = to.x - from.x;
        this.y = to.y - from.y;
        this.scaleX = to.scaleX - from.scaleX;
        this.scaleY = to.scaleY - from.scaleY;
        this.skewX = to.skewX - from.skewX;
        this.skewY = to.skewY - from.skewY;
        if (this.isUseColorInfo || from.isUseColorInfo || to.isUseColorInfo) {
            this.a = to.a - from.a;
            this.r = to.r - from.r;
            this.g = to.g - from.g;
            this.b = to.b - from.b;
            this.isUseColorInfo = true;
        } else {
            this.a = this.r = this.g = this.b = 0;
            this.isUseColorInfo = false;
        }
        if (limit) {
            if (this.skewX > ccs.M_PI)
                this.skewX -= ccs.DOUBLE_PI;
            if (this.skewX < -ccs.M_PI)
                this.skewX += ccs.DOUBLE_PI;
            if (this.skewY > ccs.M_PI)
                this.skewY -= ccs.DOUBLE_PI;
            if (this.skewY < -ccs.M_PI)
                this.skewY += ccs.DOUBLE_PI;
        }
        if (to.tweenRotate) {
            this.skewX += to.tweenRotate * ccs.PI * 2;
            this.skewY -= to.tweenRotate * ccs.PI * 2;
        }
    }
});
ccs.DisplayData = ccs.Class.extend({
    displayType: ccs.DISPLAY_TYPE_MAX,
    displayName: "",
    ctor: function () {
        this.displayType = ccs.DISPLAY_TYPE_MAX;
    },
    changeDisplayToTexture:function (displayName) {
        var textureName = displayName;
        var startPos = textureName.lastIndexOf(".");
        if (startPos != -1)
            textureName = textureName.substring(0, startPos);
        return textureName;
    },
    copy:function (displayData) {
        this.displayName = displayData.displayName;
        this.displayType = displayData.displayType;
    }
});
ccs.SpriteDisplayData = ccs.DisplayData.extend({
    skinData:null,
    ctor:function () {
        this.skinData = new ccs.BaseData();
        this.displayType = ccs.DISPLAY_TYPE_SPRITE;
    },
    copy:function (displayData) {
        ccs.DisplayData.prototype.copy.call(this,displayData);
        this.skinData = displayData.skinData;
    }
});
ccs.ArmatureDisplayData = ccs.DisplayData.extend({
    ctor:function () {
        this.displayName = "";
        this.displayType = ccs.DISPLAY_TYPE_ARMATURE;
    }
});
ccs.ParticleDisplayData = ccs.DisplayData.extend({
    ctor:function () {
        this.displayType = ccs.DISPLAY_TYPE_PARTICLE;
    }
});
ccs.BoneData = ccs.BaseData.extend({
    displayDataList: null,
    name: "",
    parentName: "",
    boneDataTransform: null,
    ctor: function () {
        this.displayDataList = [];
        this.name = "";
        this.parentName = "";
        this.boneDataTransform = null;
    },
    init: function () {
        this.displayDataList.length = 0;
        return true;
    },
    addDisplayData:function (displayData) {
        this.displayDataList.push(displayData);
    },
    getDisplayData:function (index) {
        return this.displayDataList[index];
    }
});
ccs.ArmatureData = ccs.Class.extend({
    boneDataDic:null,
    name:"",
    dataVersion:0.1,
    ctor:function () {
        this.boneDataDic = {};
        this.name = "";
        this.dataVersion = 0.1;
    },
    init:function () {
        return true;
    },
    addBoneData:function (boneData) {
        this.boneDataDic[boneData.name] = boneData;
    },
    getBoneDataDic:function () {
        return this.boneDataDic;
    },
    getBoneData:function (boneName) {
        return this.boneDataDic[boneName];
    }
});
ccs.FrameData = ccs.BaseData.extend({
        duration:0,
        tweenEasing:0,
        easingParamNumber: 0,
        easingParams: null,
        displayIndex:-1,
        movement:"",
        event:"",
        sound:"",
        soundEffect:"",
        blendFunc:null,
        frameID:0,
        isTween:true,
        ctor:function () {
            ccs.BaseData.prototype.ctor.call(this);
            this.duration = 1;
            this.tweenEasing = ccs.TweenType.linear;
            this.easingParamNumber = 0;
            this.easingParams = [];
            this.displayIndex = 0;
            this.movement = "";
            this.event = "";
            this.sound = "";
            this.soundEffect = "";
            this.blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
            this.frameID = 0;
            this.isTween = true;
        },
        copy:function (frameData) {
            ccs.BaseData.prototype.copy.call(this, frameData);
            this.duration = frameData.duration;
            this.displayIndex = frameData.displayIndex;
            this.tweenEasing = frameData.tweenEasing;
            this.easingParamNumber = frameData.easingParamNumber;
            if (this.easingParamNumber != 0){
                this.easingParams.length = 0;
                for (var i = 0; i<this.easingParamNumber; i++){
                    this.easingParams[i] = frameData.easingParams[i];
                }
            }
            this.blendFunc = frameData.blendFunc;
            this.isTween = frameData.isTween;
        }
    }
);
ccs.MovementBoneData = ccs.Class.extend({
    delay:0,
    scale:1,
    duration:0,
    frameList:null,
    name:"",
    ctor:function () {
        this.delay = 0;
        this.scale = 1;
        this.duration = 0;
        this.frameList = [];
        this.name = "";
    },
    init:function () {
        return true;
    },
    addFrameData:function (frameData) {
        this.frameList.push(frameData);
    },
    getFrameData:function (index) {
        return this.frameList[index];
    }
});
ccs.MovementData = function(){
    this.name = "";
    this.duration = 0;
    this.scale = 1;
    this.durationTo = 0;
    this.durationTween = 0;
    this.loop = true;
    this.tweenEasing = ccs.TweenType.linear;
    this.movBoneDataDic = {};
};
ccs.MovementData.prototype.addMovementBoneData = function(movBoneData){
    this.movBoneDataDic[ movBoneData.name] = movBoneData;
};
ccs.MovementData.prototype.getMovementBoneData = function(boneName){
    return  this.movBoneDataDic[boneName];
};
ccs.AnimationData = function(){
    this.movementDataDic = {};
    this.movementNames = [];
    this.name = "";
};
ccs.AnimationData.prototype.addMovement = function(moveData){
    this.movementDataDic[moveData.name] = moveData;
    this.movementNames.push(moveData.name);
};
ccs.AnimationData.prototype.getMovement = function(moveName){
    return this.movementDataDic[moveName];
};
ccs.AnimationData.prototype.getMovementCount = function(){
    return Object.keys(this.movementDataDic).length;
};
ccs.ContourVertex2 = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
};
ccs.ContourData = function(){
    this.vertexList = [];
};
ccs.ContourData.prototype.init = function(){
    this.vertexList.length = 0;
    return true;
};
ccs.ContourData.prototype.addVertex = function(p){
    this.vertexList.push(p);
};
ccs.TextureData = function(){
    this.height = 0;
    this.width = 0;
    this.pivotX = 0.5;
    this.pivotY = 0.5;
    this.name = "";
    this.contourDataList = [];
};
ccs.TextureData.prototype.init = function(){
    this.contourDataList.length = 0;
};
ccs.TextureData.prototype.addContourData = function(contourData){
    this.contourDataList.push(contourData);
};
ccs.TextureData.prototype.getContourData = function(index){
    return this.contourDataList[index];
};
ccs.DecorativeDisplay = ccs.Class.extend({
    _display: null,
    _colliderDetector: null,
    _displayData: null,
    ctor:function () {
        this._display = null;
        this._colliderDetector = null;
        this._displayData = null;
    },
    init:function () {
        return true;
    },
    setDisplay:function (display) {
        if(display._parent){
            display._parent.removeChild(display);
            delete display._parent;
        }
        this._display = display;
    },
    getDisplay:function () {
        return this._display;
    },
    setColliderDetector:function (colliderDetector) {
        this._colliderDetector = colliderDetector;
    },
    getColliderDetector:function () {
        return this._colliderDetector;
    },
    setDisplayData:function (displayData) {
        this._displayData = displayData;
    },
    getDisplayData:function () {
        return this._displayData;
    },
    release:function () {
        this._display = null;
        this._displayData = null;
        this._colliderDetector = null;
    }
});
ccs.DecorativeDisplay.create = function () {
    var decorativeDisplay = new ccs.DecorativeDisplay();
    if (decorativeDisplay && decorativeDisplay.init())
        return decorativeDisplay;
    return null;
};
ccs.displayFactory = {
    addDisplay: function (bone, decoDisplay, displayData) {
        switch (displayData.displayType) {
            case ccs.DISPLAY_TYPE_SPRITE:
                this.addSpriteDisplay(bone, decoDisplay, displayData);
                break;
            case ccs.DISPLAY_TYPE_PARTICLE:
                this.addParticleDisplay(bone, decoDisplay, displayData);
                break;
            case ccs.DISPLAY_TYPE_ARMATURE:
                this.addArmatureDisplay(bone, decoDisplay, displayData);
                break;
            default:
                break;
        }
    },
    createDisplay: function (bone, decoDisplay) {
        switch (decoDisplay.getDisplayData().displayType) {
            case ccs.DISPLAY_TYPE_SPRITE:
                this.createSpriteDisplay(bone, decoDisplay);
                break;
            case ccs.DISPLAY_TYPE_PARTICLE:
                this.createParticleDisplay(bone, decoDisplay);
                break;
            case ccs.DISPLAY_TYPE_ARMATURE:
                this.createArmatureDisplay(bone, decoDisplay);
                break;
            default:
                break;
        }
    },
    _helpTransform: {a:1, b:0, c:0, d:1, tx:0, ty:0},
    updateDisplay: function (bone,dt, dirty) {
        var display = bone.getDisplayRenderNode();
        if(!display)
            return;
        switch (bone.getDisplayRenderNodeType()) {
            case ccs.DISPLAY_TYPE_SPRITE:
                if (dirty)
                    display.updateArmatureTransform();
                break;
            case ccs.DISPLAY_TYPE_PARTICLE:
                this.updateParticleDisplay(bone, display, dt);
                break;
            case ccs.DISPLAY_TYPE_ARMATURE:
                this.updateArmatureDisplay(bone, display, dt);
                break;
            default:
                var transform = bone.getNodeToArmatureTransform();
                display.setAdditionalTransform(transform);
                break;
        }
        if (ccs.ENABLE_PHYSICS_CHIPMUNK_DETECT || ccs.ENABLE_PHYSICS_SAVE_CALCULATED_VERTEX) {
            if (dirty) {
                var decoDisplay = bone.getDisplayManager().getCurrentDecorativeDisplay();
                var detector = decoDisplay.getColliderDetector();
                if (detector) {
                    var node = decoDisplay.getDisplay();
                    var displayTransform = node.nodeToParentTransform();
                    var helpTransform = this._helpTransform;
                    helpTransform.a = displayTransform.a;
                    helpTransform.b = displayTransform.b;
                    helpTransform.c = displayTransform.c;
                    helpTransform.d = displayTransform.d;
                    helpTransform.tx = displayTransform.tx;
                    helpTransform.ty = displayTransform.ty;
                    var anchorPoint = cc.pointApplyAffineTransform(node.getAnchorPointInPoints(), helpTransform);
                    helpTransform.tx = anchorPoint.x;
                    helpTransform.ty = anchorPoint.y;
                    var t = cc.affineTransformConcat(helpTransform, bone.getArmature().nodeToParentTransform());
                    detector.updateTransform(t);
                }
            }
        }
    },
    addSpriteDisplay: function (bone, decoDisplay, displayData) {
        var sdp = new ccs.SpriteDisplayData();
        sdp.copy(displayData);
        decoDisplay.setDisplayData(sdp);
        this.createSpriteDisplay(bone, decoDisplay);
    },
    createSpriteDisplay: function (bone, decoDisplay) {
        var skin = null;
        var displayData = decoDisplay.getDisplayData();
        var textureName = displayData.displayName;
        var startPos = textureName.lastIndexOf(".");
        if (startPos != -1)
            textureName = textureName.substring(0, startPos);
        if (textureName == "")
            skin = ccs.Skin.create();
        else
            skin = ccs.Skin.createWithSpriteFrameName(textureName + ".png");
        decoDisplay.setDisplay(skin);
        if(skin == null)
            return;
        skin.setBone(bone);
        this.initSpriteDisplay(bone, decoDisplay, displayData.displayName, skin);
        var armature = bone.getArmature();
        if (armature) {
            if (armature.getArmatureData().dataVersion >= ccs.CONST_VERSION_COMBINED)
                skin.setSkinData(displayData.skinData);
            else
                skin.setSkinData(bone.boneData);
        }
    },
    initSpriteDisplay: function (bone, decoDisplay, displayName, skin) {
        var textureName = displayName;
        var startPos = textureName.lastIndexOf(".");
        if (startPos != -1)
            textureName = textureName.substring(0, startPos);
        var textureData = ccs.armatureDataManager.getTextureData(textureName);
        if (textureData) {
            skin.setAnchorPoint(cc.p(textureData.pivotX, textureData.pivotY));
        }
        if (ccs.ENABLE_PHYSICS_CHIPMUNK_DETECT || ccs.ENABLE_PHYSICS_SAVE_CALCULATED_VERTEX) {
            if (textureData && textureData.contourDataList.length > 0) {
                var colliderDetector = ccs.ColliderDetector.create(bone);
                colliderDetector.addContourDataList(textureData.contourDataList);
                decoDisplay.setColliderDetector(colliderDetector);
            }
        }
    },
    addArmatureDisplay: function (bone, decoDisplay, displayData) {
        var adp = new ccs.ArmatureDisplayData();
        adp.copy(displayData);
        decoDisplay.setDisplayData(adp);
        this.createArmatureDisplay(bone, decoDisplay);
    },
    createArmatureDisplay: function (bone, decoDisplay) {
        var displayData = decoDisplay.getDisplayData();
        var armature = ccs.Armature.create(displayData.displayName, bone);
        decoDisplay.setDisplay(armature);
    },
    updateArmatureDisplay: function (bone, armature, dt) {
        if (armature) {
            armature.sortAllChildren();
            armature.update(dt);
        }
    },
    addParticleDisplay: function (bone, decoDisplay, displayData) {
        var adp = new ccs.ParticleDisplayData();
        adp.copy(displayData);
        decoDisplay.setDisplayData(adp);
        this.createParticleDisplay(bone, decoDisplay);
    },
    createParticleDisplay: function (bone, decoDisplay) {
        var displayData = decoDisplay.getDisplayData();
        var system = cc.ParticleSystem.create(displayData.displayName);
        system.removeFromParent();
        system.cleanup();
        var armature = bone.getArmature();
        if (armature)
            system.setParent(bone.getArmature());
        decoDisplay.setDisplay(system);
    },
    updateParticleDisplay: function (bone, particleSystem, dt) {
        var node = new ccs.BaseData();
        ccs.TransformHelp.matrixToNode(bone.nodeToArmatureTransform(), node);
        particleSystem.setPosition(node.x, node.y);
        particleSystem.setScaleX(node.scaleX);
        particleSystem.setScaleY(node.scaleY);
        particleSystem.update(dt);
    }
};
ccs.DisplayManager = ccs.Class.extend({
    _decoDisplayList:null,
    _currentDecoDisplay:null,
    _displayRenderNode:null,
    _displayIndex: null,
    _forceChangeDisplay:false,
    _bone:null,
    _visible:true,
    _displayType: null,
    ctor:function () {
        this._decoDisplayList = [];
        this._currentDecoDisplay = null;
        this._displayRenderNode = null;
        this._displayIndex = null;
        this._forceChangeDisplay = false;
        this._bone = null;
        this._visible = true;
        this._displayType = ccs.DISPLAY_TYPE_MAX;
    },
    init:function (bone) {
        this._bone = bone;
        this.initDisplayList(bone.getBoneData());
        return true;
    },
    addDisplay: function (display, index) {
        var decoDisplay, locDisplayList = this._decoDisplayList;
        if( (index >= 0) && (index < locDisplayList.length) )
            decoDisplay = locDisplayList[index];
        else{
            decoDisplay = ccs.DecorativeDisplay.create();
            locDisplayList.push(decoDisplay);
        }
        if(display instanceof ccs.DisplayData){
            cc.displayFactory.addDisplay(this._bone, decoDisplay, display);
            if(index == this._displayIndex) {
                this._displayIndex = -1;
                this.changeDisplayWithIndex(index, false);
            }
            return;
        }
        var displayData = null;
        if (display instanceof ccs.Skin) {
            display.setBone(this._bone);
            displayData = new ccs.SpriteDisplayData();
            ccs.displayFactory.initSpriteDisplay(this._bone, decoDisplay, display.getDisplayName(), display);
            var spriteDisplayData = decoDisplay.getDisplayData();
            if (spriteDisplayData instanceof ccs.SpriteDisplayData) {
                display.setSkinData(spriteDisplayData.skinData);
                displayData.skinData = spriteDisplayData.skinData;
            } else {
                var find = false;
                for (var i = locDisplayList.length - 2; i >= 0; i--) {
                    var dd = locDisplayList[i];
                    var sdd = dd.getDisplayData();
                    if (sdd instanceof ccs.SpriteDisplayData) {
                        find = true;
                        display.setSkinData(sdd.skinData);
                        displayData.skinData = sdd.skinData;
                        break;
                    }
                }
                if (!find)
                    display.setSkinData(new ccs.BaseData());
            }
        } else if (display instanceof cc.ParticleSystem){
            displayData = new ccs.ParticleDisplayData();
            display.removeFromParent();
            display.cleanup();
            var armature = this._bone.getArmature();
            if (armature)
                display.setParent(armature);
        } else if(display instanceof ccs.Armature) {
            displayData = new ccs.ArmatureDisplayData();
            displayData.displayName = display.getName();
            display.setParentBone(this._bone);
        } else
            displayData = new ccs.DisplayData();
        decoDisplay.setDisplay(display);
        decoDisplay.setDisplayData(displayData);
        if(index == this._displayIndex) {
            this._displayIndex = -1;
            this.changeDisplayWithIndex(index, false);
        }
    },
    _addDisplayOther:function(decoDisplay,display){
        var displayData = null;
        if (display instanceof ccs.Skin){
            var skin = display;
            skin.setBone(this._bone);
            displayData = new ccs.SpriteDisplayData();
            displayData.displayName = skin.getDisplayName();
            ccs.displayFactory.initSpriteDisplay(this._bone, decoDisplay, skin.getDisplayName(), skin);
            var spriteDisplayData = decoDisplay.getDisplayData();
            if (spriteDisplayData instanceof ccs.SpriteDisplayData)
                skin.setSkinData(spriteDisplayData.skinData);
            else{
                var find = false;
                for (var i = this._decoDisplayList.length - 2; i >= 0; i--) {
                    var dd = this._decoDisplayList[i];
                    var sdd = dd.getDisplayData();
                    if (sdd) {
                        find = true;
                        skin.setSkinData(sdd.skinData);
                        displayData.skinData = sdd.skinData;
                        break;
                    }
                }
                if (!find) {
                    skin.setSkinData(new ccs.BaseData());
                }
                skin.setSkinData(new ccs.BaseData());
            }
        }
        else if (display instanceof cc.ParticleSystem){
            displayData = new ccs.ParticleDisplayData();
            displayData.displayName = display._plistFile;
        }
        else if (display instanceof ccs.Armature){
            displayData = new ccs.ArmatureDisplayData();
            displayData.displayName = display.getName();
            display.setParentBone(this._bone);
        }
        else  {
            displayData = new ccs.DisplayData();
        }
        decoDisplay.setDisplay(display);
        decoDisplay.setDisplayData(displayData);
    },
    removeDisplay:function (index) {
        this._decoDisplayList.splice(index, 1);
        if (index === this._displayIndex) {
            this.setCurrentDecorativeDisplay(null);
            this._displayIndex = -1;
        }
    },
    getDecorativeDisplayList:function(){
        return this._decoDisplayList;
    },
    changeDisplayWithIndex:function (index, force) {
        if (index >= this._decoDisplayList.length) {
            cc.log("the index value is out of range");
            return;
        }
        this._forceChangeDisplay = force;
        if (this._displayIndex == index)
            return;
        this._displayIndex = index;
        if (index < 0) {
            if(this._displayRenderNode) {
                this._displayRenderNode.removeFromParent(true);
                this.setCurrentDecorativeDisplay(null);
            }
            return;
        }
        this.setCurrentDecorativeDisplay(this._decoDisplayList[index]);
    },
    changeDisplayWithName: function (name, force) {
        var locDisplayList = this._decoDisplayList;
        for (var i = 0; i < locDisplayList.length; i++) {
            if (locDisplayList[i].getDisplayData().displayName == name) {
                this.changeDisplayWithIndex(i, force);
                break;
            }
        }
    },
    setCurrentDecorativeDisplay:function (decoDisplay) {
        var locCurrentDecoDisplay = this._currentDecoDisplay;
        if (ccs.ENABLE_PHYSICS_CHIPMUNK_DETECT || ccs.ENABLE_PHYSICS_SAVE_CALCULATED_VERTEX) {
            if (locCurrentDecoDisplay && locCurrentDecoDisplay.getColliderDetector())
                locCurrentDecoDisplay.getColliderDetector().setActive(false);
        }
        this._currentDecoDisplay = decoDisplay;
        locCurrentDecoDisplay = this._currentDecoDisplay;
        if (ccs.ENABLE_PHYSICS_CHIPMUNK_DETECT || ccs.ENABLE_PHYSICS_SAVE_CALCULATED_VERTEX) {
            if (locCurrentDecoDisplay && locCurrentDecoDisplay.getColliderDetector())
                locCurrentDecoDisplay.getColliderDetector().setActive(true);
        }
        var displayRenderNode = (!locCurrentDecoDisplay) ? null : locCurrentDecoDisplay.getDisplay();
        var locRenderNode = this._displayRenderNode, locBone = this._bone;
        if (locRenderNode) {
            if (locRenderNode instanceof ccs.Armature)
                locBone.setChildArmature(null);
            locRenderNode.removeFromParent(true);
        }
        this._displayRenderNode = displayRenderNode;
        if (displayRenderNode) {
            if (displayRenderNode instanceof ccs.Armature) {
                this._bone.setChildArmature(displayRenderNode);
                displayRenderNode.setParentBone(this._bone);
            } else if (displayRenderNode instanceof cc.ParticleSystem) {
                if (displayRenderNode instanceof ccs.Armature) {
                    locBone.setChildArmature(displayRenderNode);
                    displayRenderNode.setParentBone(locBone);
                } else if (displayRenderNode instanceof cc.ParticleSystem)
                    displayRenderNode.resetSystem();
            }
            displayRenderNode.setColor(locBone.getDisplayedColor());
            displayRenderNode.setOpacity(locBone.getDisplayedOpacity());
            this._displayRenderNode.setVisible(this._visible);
            this._displayType = this._currentDecoDisplay.getDisplayData().displayType;
        }else
            this._displayType = ccs.DISPLAY_TYPE_MAX;
        cc.renderer.childrenOrderDirty = true;
    },
    getDisplayRenderNode:function () {
        return this._displayRenderNode;
    },
    getDisplayRenderNodeType:function(){
        return this._displayType;
    },
    getCurrentDisplayIndex:function () {
        return this._displayIndex;
    },
    getCurrentDecorativeDisplay:function () {
        return this._currentDecoDisplay;
    },
    getDecorativeDisplayByIndex:function (index) {
        return this._decoDisplayList[index];
    },
    initDisplayList:function (boneData) {
        this._decoDisplayList.length = 0;
        if (!boneData)
            return;
        var displayList = boneData.displayDataList, decoList = this._decoDisplayList, locBone = this._bone;
        for (var i = 0; i < displayList.length; i++) {
            var displayData = displayList[i];
            var decoDisplay = ccs.DecorativeDisplay.create();
            decoDisplay.setDisplayData(displayData);
            ccs.displayFactory.createDisplay(locBone, decoDisplay);
            decoList.push(decoDisplay);
        }
    },
    containPoint: function (point, y) {
        if (!this._visible || this._displayIndex < 0)
            return false;
        if (y !== undefined)
            point = cc.p(point, y);
        if(this._currentDecoDisplay.getDisplayData().displayType == ccs.DISPLAY_TYPE_SPRITE){
            var sprite = this._currentDecoDisplay.getDisplay();
            sprite = sprite.getChildByTag(0);
            return ccs.SPRITE_CONTAIN_POINT_WITH_RETURN(sprite, point);
        }
        return false;
    },
    setVisible:function (visible) {
        if (!this._displayRenderNode)
            return;
        this._visible = visible;
        this._displayRenderNode.setVisible(visible);
    },
    isVisible:function () {
        return this._visible;
    },
    getContentSize:function () {
        if (!this._displayRenderNode)
            return cc.size(0, 0);
        return this._displayRenderNode.getContentSize();
    },
    getBoundingBox:function () {
        if (!this._displayRenderNode)
            return cc.rect(0, 0, 0, 0);
        return this._displayRenderNode.getBoundingBox();
    },
    getAnchorPoint:function () {
        if (!this._displayRenderNode)
            return  cc.p(0, 0);
        return this._displayRenderNode.getAnchorPoint();
    },
    getAnchorPointInPoints:function () {
        if (!this._displayRenderNode)
            return  cc.p(0, 0);
        return this._displayRenderNode.getAnchorPointInPoints();
    },
    getForceChangeDisplay:function () {
        return this._forceChangeDisplay;
    },
    release:function () {
        this._decoDisplayList = null;
        if (this._displayRenderNode) {
            this._displayRenderNode.removeFromParent(true);
            this._displayRenderNode = null;
        }
    }
});
ccs.DisplayManager.create = function (bone) {
    var displayManager = new ccs.DisplayManager();
    if (displayManager && displayManager.init(bone))
        return displayManager;
    return null;
};
ccs.Skin = ccs.Sprite.extend({
    _skinData: null,
    bone: null,
    _skinTransform: null,
    _displayName: "",
    _armature: null,
    _className: "Skin",
    ctor: function () {
        cc.Sprite.prototype.ctor.call(this);
        this._skinData = null;
        this.bone = null;
        this._displayName = "";
        this._skinTransform = cc.affineTransformIdentity();
        this._armature = null;
    },
    initWithSpriteFrameName: function (spriteFrameName) {
        if(spriteFrameName == "")
            return false;
        var pFrame = cc.spriteFrameCache.getSpriteFrame(spriteFrameName);
        var ret = true;
        if(pFrame)
            this.initWithSpriteFrame(pFrame);
        else{
            cc.log("Can't find CCSpriteFrame with %s. Please check your .plist file", spriteFrameName);
            ret = false;
        }
        this._displayName = spriteFrameName;
        return ret;
    },
    initWithFile: function (fileName) {
        var ret = cc.Sprite.prototype.initWithFile.call(this, fileName);
        this._displayName = fileName;
        return ret;
    },
    setSkinData: function (skinData) {
        this._skinData = skinData;
        this.setScaleX(skinData.scaleX);
        this.setScaleY(skinData.scaleY);
        this.setRotationX(cc.radiansToDegrees(skinData.skewX));
        this.setRotationY(cc.radiansToDegrees(-skinData.skewY));
        this.setPosition(skinData.x, skinData.y);
        var localTransform = this.getNodeToParentTransform ? this.getNodeToParentTransform() : this.nodeToParentTransform();
        var skinTransform = this._skinTransform;
        skinTransform.a = localTransform.a;
        skinTransform.b = localTransform.b;
        skinTransform.c = localTransform.c;
        skinTransform.d = localTransform.d;
        skinTransform.tx = localTransform.tx;
        skinTransform.ty = localTransform.ty;
        this.updateArmatureTransform();
    },
    getSkinData: function () {
        return this._skinData;
    },
    updateArmatureTransform: function () {
        this._transform = cc.affineTransformConcat(
            this._skinTransform,
            this.bone.getNodeToArmatureTransform()
        );
    },
    _updateTransformForWebGL: function(){
        var locQuad = this._quad;
        if( !this._visible)
            locQuad.br.vertices = locQuad.tl.vertices = locQuad.tr.vertices = locQuad.bl.vertices = {x: 0, y:0, z:0};
        else {
            var transform = this.getNodeToParentTransform ? this.getNodeToParentTransform() : this.nodeToParentTransform();
            var size = this._rect;
            var x1 = this._offsetPosition.x, y1 = this._offsetPosition.y;
            var x2 = x1 + size.width, y2 = y1 + size.height;
            var x = transform.tx, y = transform.ty;
            var cr = transform.a, sr = transform.b;
            var cr2 = transform.d, sr2 = -transform.c;
            var ax = x1 * cr - y1 * sr2 + x;
            var ay = x1 * sr + y1 * cr2 + y;
            var bx = x2 * cr - y1 * sr2 + x;
            var by = x2 * sr + y1 * cr2 + y;
            var cx = x2 * cr - y2 * sr2 + x;
            var cy = x2 * sr + y2 * cr2 + y;
            var dx = x1 * cr - y2 * sr2 + x;
            var dy = x1 * sr + y2 * cr2 + y;
            var locVertexZ = this._vertexZ;
            if(!cc.SPRITEBATCHNODE_RENDER_SUBPIXEL) {
                ax = 0 | ax;
                ay = 0 | ay;
                bx = 0 | bx;
                by = 0 | by;
                cx = 0 | cx;
                cy = 0 | cy;
                dx = 0 | dx;
                dy = 0 | dy;
            }
            this.SET_VERTEX3F(locQuad.bl.vertices,ax, ay,locVertexZ);
            this.SET_VERTEX3F(locQuad.br.vertices,bx, by,locVertexZ);
            this.SET_VERTEX3F(locQuad.tl.vertices,dx, dy,locVertexZ);
            this.SET_VERTEX3F(locQuad.tr.vertices,cx, cy,locVertexZ);
        }
        if (this._textureAtlas)
            this._textureAtlas.updateQuad(locQuad, this._textureAtlas.getTotalQuads());
        this._quadDirty = true;
    },
    SET_VERTEX3F: function(_v_, _x_, _y_, _z_){
        (_v_).x = (_x_);
        (_v_).y = (_y_);
        (_v_).z = (_z_);
    },
    RENDER_IN_SUBPIXEL: function(__ARGS__){
        if(!cc.SPRITEBATCHNODE_RENDER_SUBPIXEL)
            return Math.ceil(__ARGS__);
        else
            return __ARGS__;
    },
    getNodeToWorldTransform: function(){
        return cc.affineTransformConcat(this._transform,this.bone.getArmature().getNodeToWorldTransform());
    },
    getNodeToWorldTransformAR: function(){
        var displayTransform = this._transform;
        this._anchorPointInPoints = cc.pointApplyAffineTransform(this._anchorPointInPoints, displayTransform);
        displayTransform.tx = this._anchorPointInPoints.x;
        displayTransform.ty = this._anchorPointInPoints.y;
        return cc.affineTransformConcat( displayTransform,this.bone.getArmature().nodeToWorldTransform());
    },
    setBone: function (bone) {
        this.bone = bone;
        var armature = this.bone.getArmature();
        if(armature)
            this._armature = armature;
    },
    getBone: function () {
        return this.bone;
    },
    getDisplayName: function () {
        return this._displayName;
    }
});
if (cc._renderType == cc._RENDER_TYPE_WEBGL) {
    ccs.Skin.prototype.updateTransform = ccs.Skin.prototype._updateTransformForWebGL;
}else{
}
var _p = ccs.Skin.prototype;
_p.skinData;
cc.defineGetterSetter(_p, "skinData", _p.getSkinData, _p.setSkinData);
_p.displayName;
cc.defineGetterSetter(_p, "displayName", _p.getDisplayName);
_p = null;
ccs.Skin.create = function (fileName, rect) {
    var argnum = arguments.length;
    var skin = new ccs.Skin();
    if (argnum === 0 || fileName == null || fileName == "") {
        if (skin.init())
            return skin;
    } else {
        if(fileName[0] == "#"){
            if (skin && skin.initWithSpriteFrameName(fileName))
                return skin;
        }else{
            if (skin && skin.initWithFile(fileName, rect))
                return skin;
        }
    }
    return null;
};
ccs.Skin.createWithSpriteFrameName = function (spriteFrameName) {
    var skin = new ccs.Skin();
    if (skin && skin.initWithSpriteFrameName(spriteFrameName))
        return skin;
    return null;
};
ccs.ANIMATION_TYPE_SINGLE_FRAME = -4;
ccs.ANIMATION_TYPE_NO_LOOP = -3;
ccs.ANIMATION_TYPE_TO_LOOP_FRONT = -2;
ccs.ANIMATION_TYPE_TO_LOOP_BACK = -1;
ccs.ANIMATION_TYPE_LOOP_FRONT = 0;
ccs.ANIMATION_TYPE_LOOP_BACK = 1;
ccs.ANIMATION_TYPE_MAX = 2;
ccs.ProcessBase = ccs.Class.extend({
    _processScale: 1,
    _isComplete: true,
    _isPause: true,
    _isPlaying: false,
    _currentPercent: 0.0,
    _rawDuration: 0,
    _loopType: 0,
    _tweenEasing: 0,
    animationInternal: null,
    _currentFrame: 0,
    _durationTween: 0,
    _nextFrameIndex: 0,
    _curFrameIndex: null,
    _isLoopBack: false,
    ctor: function () {
        this._processScale = 1;
        this._isComplete = true;
        this._isPause = true;
        this._isPlaying = false;
        this._currentFrame = 0;
        this._currentPercent = 0.0;
        this._durationTween = 0;
        this._rawDuration = 0;
        this._loopType = ccs.ANIMATION_TYPE_LOOP_BACK;
        this._tweenEasing = ccs.TweenType.linear;
        this.animationInternal = 1 / 60;
        this._curFrameIndex = 0;
        this._durationTween = 0;
        this._isLoopBack = false;
    },
    pause: function () {
        this._isPause = true;
        this._isPlaying = false;
    },
    resume: function () {
        this._isPause = false;
        this._isPlaying = true;
    },
    stop: function () {
        this._isComplete = true;
        this._isPlaying = false;
    },
    play: function (durationTo, durationTween, loop, tweenEasing) {
        this._isComplete = false;
        this._isPause = false;
        this._isPlaying = true;
        this._currentFrame = 0;
        this._nextFrameIndex = durationTo;
        this._tweenEasing = tweenEasing;
    },
    update: function (dt) {
        if (this._isComplete || this._isPause)
            return;
        if (this._rawDuration <= 0 || dt > 1)
            return;
        var locNextFrameIndex = this._nextFrameIndex === undefined ? 0 : this._nextFrameIndex;
        var locCurrentFrame = this._currentFrame;
        if (locNextFrameIndex <= 0) {
            this._currentPercent = 1;
            locCurrentFrame = 0;
        } else {
            locCurrentFrame += this._processScale * (dt / this.animationInternal);
            this._currentPercent = locCurrentFrame / locNextFrameIndex;
            locCurrentFrame = ccs.fmodf(locCurrentFrame, locNextFrameIndex);
        }
        this._currentFrame = locCurrentFrame;
        this.updateHandler();
    },
    gotoFrame: function (frameIndex) {
        var locLoopType = this._loopType;
        if (locLoopType == ccs.ANIMATION_TYPE_NO_LOOP)
            locLoopType = ccs.ANIMATION_TYPE_MAX;
        else if (locLoopType == ccs.ANIMATION_TYPE_TO_LOOP_FRONT)
            locLoopType = ccs.ANIMATION_TYPE_LOOP_FRONT;
        this._loopType = locLoopType;
        this._curFrameIndex = frameIndex;
        this._nextFrameIndex = this._durationTween;
    },
    getCurrentFrameIndex: function () {
        this._curFrameIndex = (this._rawDuration - 1) * this._currentPercent;
        return this._curFrameIndex;
    },
    updateHandler: function () {
    },
    isPause: function () {
        return this._isPause;
    },
    isComplete: function () {
        return this._isComplete;
    },
    getCurrentPercent: function () {
        return this._currentPercent;
    },
    getRawDuration: function () {
        return this._rawDuration;
    },
    getLoop: function () {
        return this._loopType;
    },
    getTweenEasing: function () {
        return this._tweenEasing;
    },
    getAnimationInternal: function () {
        return this.animationInternal;
    },
    setAnimationInternal: function (animationInternal) {
        this.animationInternal = animationInternal;
    },
    getProcessScale: function () {
        return this._processScale;
    },
    setProcessScale: function (processScale) {
        this._processScale = processScale;
    },
    isPlaying: function () {
        return this._isPlaying;
    }
});
var _p = ccs.ProcessBase.prototype;
_p.currentFrameIndex;
cc.defineGetterSetter(_p, "currentFrameIndex", _p.getCurrentFrameIndex);
_p.paused;
cc.defineGetterSetter(_p, "paused", _p.isPause);
_p.completed;
cc.defineGetterSetter(_p, "completed", _p.isComplete);
_p.currentPercent;
cc.defineGetterSetter(_p, "currentPercent", _p.getCurrentPercent);
_p.rawDuration;
cc.defineGetterSetter(_p, "rawDuration", _p.getRawDuration);
_p.loop;
cc.defineGetterSetter(_p, "loop", _p.getLoop);
_p.tweenEasing;
cc.defineGetterSetter(_p, "tweenEasing", _p.getTweenEasing);
_p.playing;
cc.defineGetterSetter(_p, "playing", _p.isPlaying);
_p = null;
ccs.MovementEventType = {
    start: 0,
    complete: 1,
    loopComplete: 2
};
ccs.AnimationEvent = ccs.Class.extend({
    _arguments: null,
    _callFunc: null,
    _selectorTarget: null,
    ctor: function (callFunc,target, data) {
        this._data = data;
        this._callFunc = callFunc;
        this._selectorTarget = target;
    },
    call: function () {
        if (this._callFunc)
            this._callFunc.apply(this._selectorTarget, this._arguments);
    },
    setArguments: function (args) {
        this._arguments = args;
    }
});
ccs.MovementEvent = function () {
    this.armature = null;
    this.movementType = ccs.MovementEventType.start;
    this.movementID = "";
};
ccs.FrameEvent = function () {
    this.bone = null;
    this.frameEventName = "";
    this.originFrameIndex = 0;
    this.currentFrameIndex = 0;
};
ccs.ArmatureAnimation = ccs.ProcessBase.extend({
    _animationData: null,
    _movementData: null,
    _armature: null,
    _movementID: "",
    _toIndex: 0,
    _tweenList: null,
    _speedScale: 1,
    _ignoreFrameEvent: false,
    _frameEventQueue: null,
    _movementEventQueue: null,
    _movementList: null,
    _onMovementList: false,
    _movementListLoop: false,
    _movementIndex: 0,
    _movementListDurationTo: -1,
    _movementEventCallFunc: null,
    _frameEventCallFunc: null,
    _movementEventTarget: null,
    _frameEventTarget:null,
    _movementEventListener: null,
    _frameEventListener: null,
    ctor: function () {
        ccs.ProcessBase.prototype.ctor.call(this);
        this._tweenList = [];
        this._movementList = [];
        this._frameEventQueue = [];
        this._movementEventQueue = [];
    },
    init: function (armature) {
        this._armature = armature;
        this._tweenList.length = 0;
        return true;
    },
    pause: function () {
        var locTweenList = this._tweenList;
        for (var i = 0; i < locTweenList.length; i++)
            locTweenList[i].pause();
        ccs.ProcessBase.prototype.pause.call(this);
    },
    resume: function () {
        var locTweenList = this._tweenList;
        for (var i = 0; i < locTweenList.length; i++)
            locTweenList[i].resume();
        ccs.ProcessBase.prototype.resume.call(this);
    },
    stop: function () {
        var locTweenList = this._tweenList;
        for (var i = 0; i < locTweenList.length; i++)
            locTweenList[i].stop();
        locTweenList.length = 0;
        ccs.ProcessBase.prototype.stop.call(this);
    },
    setAnimationScale: function (animationScale) {
        this.setSpeedScale(animationScale);
    },
    getAnimationScale: function () {
        return this.getSpeedScale();
    },
    setSpeedScale: function (speedScale) {
        if (speedScale == this._speedScale)
            return;
        this._speedScale = speedScale;
        this._processScale = !this._movementData ? this._speedScale : this._speedScale * this._movementData.scale;
        var dict = this._armature.getBoneDic();
        for (var key in dict) {
            var bone = dict[key];
            bone.getTween().setProcessScale(this._processScale);
            if (bone.getChildArmature())
                bone.getChildArmature().getAnimation().setSpeedScale(this._processScale);
        }
    },
    getSpeedScale: function () {
        return this._speedScale;
    },
    play: function (animationName, durationTo, loop) {
        cc.assert(this._animationData, "this.animationData can not be null");
        this._movementData = this._animationData.getMovement(animationName);
        cc.assert(this._movementData, "this._movementData can not be null");
        durationTo = (durationTo === undefined) ? -1 : durationTo;
        loop = (loop === undefined) ? -1 : loop;
        this._rawDuration = this._movementData.duration;
        this._movementID = animationName;
        this._processScale = this._speedScale * this._movementData.scale;
        durationTo = (durationTo == -1) ? this._movementData.durationTo : durationTo;
        var durationTween = this._movementData.durationTween == 0 ? this._rawDuration : this._movementData.durationTween;
        var tweenEasing = this._movementData.tweenEasing;
        loop = (loop < 0) ? this._movementData.loop : loop;
        this._onMovementList = false;
        ccs.ProcessBase.prototype.play.call(this, durationTo, durationTween, loop, tweenEasing);
        if (this._rawDuration == 0)
            this._loopType = ccs.ANIMATION_TYPE_SINGLE_FRAME;
        else {
            this._loopType = loop ? ccs.ANIMATION_TYPE_TO_LOOP_FRONT : ccs.ANIMATION_TYPE_NO_LOOP;
            this._durationTween = durationTween;
        }
        var movementBoneData;
        this._tweenList = [];
        var map = this._armature.getBoneDic();
        for(var element in map) {
            var bone = map[element];
            movementBoneData = this._movementData.movBoneDataDic[bone.getName()];
            var tween = bone.getTween();
            if(movementBoneData && movementBoneData.frameList.length > 0) {
                this._tweenList.push(tween);
                movementBoneData.duration = this._movementData.duration;
                tween.play(movementBoneData, durationTo, durationTween, loop, tweenEasing);
                tween.setProcessScale(this._processScale);
                if (bone.getChildArmature())
                    bone.getChildArmature().getAnimation().setSpeedScale(this._processScale);
            } else {
                if(!bone.isIgnoreMovementBoneData()){
                    bone.getDisplayManager().changeDisplayWithIndex(-1, false);
                    tween.stop();
                }
            }
        }
        this._armature.update(0);
    },
    playByIndex: function (animationIndex, durationTo, durationTween, loop, tweenEasing) {
        cc.log("playByIndex is deprecated. Use playWithIndex instead.");
        this.playWithIndex(animationIndex, durationTo, loop);
    },
    playWithIndex: function (animationIndex, durationTo, loop) {
        var movName = this._animationData.movementNames;
        cc.assert((animationIndex > -1) && (animationIndex < movName.length));
        var animationName = movName[animationIndex];
        this.play(animationName, durationTo, loop);
    },
    playWithNames: function (movementNames, durationTo, loop) {
        durationTo = (durationTo === undefined) ? -1 : durationTo;
        loop = (loop === undefined) ? true : loop;
        this._movementListLoop = loop;
        this._movementListDurationTo = durationTo;
        this._onMovementList = true;
        this._movementIndex = 0;
        if(movementNames instanceof Array)
            this._movementList = movementNames;
        else
            this._movementList.length = 0;
        this.updateMovementList();
    },
    playWithIndexes: function (movementIndexes, durationTo, loop) {
        durationTo = (durationTo === undefined) ? -1 : durationTo;
        loop = (loop === undefined) ? true : loop;
        this._movementList.length = 0;
        this._movementListLoop = loop;
        this._movementListDurationTo = durationTo;
        this._onMovementList = true;
        this._movementIndex = 0;
        var movName = this._animationData.movementNames;
        for (var i = 0; i < movementIndexes.length; i++) {
            var name = movName[movementIndexes[i]];
            this._movementList.push(name);
        }
        this.updateMovementList();
    },
    gotoAndPlay: function (frameIndex) {
        if (!this._movementData || frameIndex < 0 || frameIndex >= this._movementData.duration) {
            cc.log("Please ensure you have played a movement, and the frameIndex is in the range.");
            return;
        }
        var ignoreFrameEvent = this._ignoreFrameEvent;
        this._ignoreFrameEvent = true;
        this._isPlaying = true;
        this._isComplete = this._isPause = false;
        ccs.ProcessBase.prototype.gotoFrame.call(this, frameIndex);
        this._currentPercent = this._curFrameIndex / (this._movementData.duration - 1);
        this._currentFrame = this._nextFrameIndex * this._currentPercent;
        var locTweenList = this._tweenList;
        for (var i = 0; i < locTweenList.length; i++)
            locTweenList[i].gotoAndPlay(frameIndex);
        this._armature.update(0);
        this._ignoreFrameEvent = ignoreFrameEvent;
    },
    gotoAndPause: function (frameIndex) {
        this.gotoAndPlay(frameIndex);
        this.pause();
    },
    getMovementCount: function () {
        return this._animationData.getMovementCount();
    },
    update: function (dt) {
        ccs.ProcessBase.prototype.update.call(this, dt);
        var locTweenList = this._tweenList;
        for (var i = 0; i < locTweenList.length; i++)
            locTweenList[i].update(dt);
        var frameEvents = this._frameEventQueue, event;
        while (frameEvents.length > 0) {
            event = frameEvents.shift();
            this._ignoreFrameEvent = true;
            if(this._frameEventCallFunc)
                this._frameEventCallFunc.call(this._frameEventTarget, event.bone, event.frameEventName, event.originFrameIndex, event.currentFrameIndex);
            if(this._frameEventListener)
                this._frameEventListener(event.bone, event.frameEventName, event.originFrameIndex, event.currentFrameIndex);
            this._ignoreFrameEvent = false;
        }
        var movementEvents = this._movementEventQueue;
        while (movementEvents.length > 0) {
            event = movementEvents.shift();
            if(this._movementEventCallFunc)
                this._movementEventCallFunc.call(this._movementEventTarget, event.armature, event.movementType, event.movementID);
            if (this._movementEventListener)
                this._movementEventListener(event.armature, event.movementType, event.movementID);
        }
    },
    updateHandler: function () {
        var locCurrentPercent = this._currentPercent;
        if (locCurrentPercent >= 1) {
            switch (this._loopType) {
                case ccs.ANIMATION_TYPE_NO_LOOP:
                    this._loopType = ccs.ANIMATION_TYPE_MAX;
                    this._currentFrame = (locCurrentPercent - 1) * this._nextFrameIndex;
                    locCurrentPercent = this._currentFrame / this._durationTween;
                    if (locCurrentPercent < 1.0) {
                        this._nextFrameIndex = this._durationTween;
                        this.movementEvent(this._armature, ccs.MovementEventType.start, this._movementID);
                        break;
                    }
                    break;
                case ccs.ANIMATION_TYPE_MAX:
                case ccs.ANIMATION_TYPE_SINGLE_FRAME:
                    locCurrentPercent = 1;
                    this._isComplete = true;
                    this._isPlaying = false;
                    this.movementEvent(this._armature, ccs.MovementEventType.complete, this._movementID);
                    this.updateMovementList();
                    break;
                case ccs.ANIMATION_TYPE_TO_LOOP_FRONT:
                    this._loopType = ccs.ANIMATION_TYPE_LOOP_FRONT;
                    locCurrentPercent = ccs.fmodf(locCurrentPercent, 1);
                    this._currentFrame = this._nextFrameIndex == 0 ? 0 : ccs.fmodf(this._currentFrame, this._nextFrameIndex);
                    this._nextFrameIndex = this._durationTween > 0 ? this._durationTween : 1;
                    this.movementEvent(this, ccs.MovementEventType.start, this._movementID);
                    break;
                default:
                    this._currentFrame = ccs.fmodf(this._currentFrame, this._nextFrameIndex);
                    this._toIndex = 0;
                    this.movementEvent(this._armature, ccs.MovementEventType.loopComplete, this._movementID);
                    break;
            }
            this._currentPercent = locCurrentPercent;
        }
    },
    getCurrentMovementID: function () {
        if (this._isComplete)
            return "";
        return this._movementID;
    },
    setMovementEventCallFunc: function (callFunc, target) {
        if(arguments.length == 1){
            this._frameEventListener = target;
        }else if(arguments.length == 2){
            this._movementEventTarget = target;
            this._movementEventCallFunc = callFunc;
        }
    },
    setFrameEventCallFunc: function (callFunc, target) {
        if(arguments.length == 1){
            this._frameEventListener = target;
        }else if(arguments.length == 2){
            this._frameEventTarget = target;
            this._frameEventCallFunc = callFunc;
        }
    },
    setUserObject: function (userObject) {
        this._userObject = userObject;
    },
    frameEvent: function (bone, frameEventName, originFrameIndex, currentFrameIndex) {
        if ((this._frameEventTarget && this._frameEventCallFunc) || this._frameEventListener) {
            var frameEvent = new ccs.FrameEvent();
            frameEvent.bone = bone;
            frameEvent.frameEventName = frameEventName;
            frameEvent.originFrameIndex = originFrameIndex;
            frameEvent.currentFrameIndex = currentFrameIndex;
            this._frameEventQueue.push(frameEvent);
        }
    },
    movementEvent: function (armature, movementType, movementID) {
        if ((this._movementEventTarget && this._movementEventCallFunc) || this._movementEventListener) {
            var event = new ccs.MovementEvent();
            event.armature = armature;
            event.movementType = movementType;
            event.movementID = movementID;
            this._movementEventQueue.push(event);
        }
    },
    updateMovementList: function () {
        if (this._onMovementList) {
            var movementObj, locMovementList = this._movementList;
            if (this._movementListLoop) {
                movementObj = locMovementList[this._movementIndex];
                this.play(movementObj, movementObj.durationTo, 0);
                this._movementIndex++;
                if (this._movementIndex >= locMovementList.length)
                    this._movementIndex = 0;
            } else {
                if (this._movementIndex < locMovementList.length) {
                    movementObj = locMovementList[this._movementIndex];
                    this.play(movementObj, movementObj.durationTo, 0);
                    this._movementIndex++;
                } else
                    this._onMovementList = false;
            }
            this._onMovementList = true;
        }
    },
    setAnimationData: function (data) {
        if(this._animationData != data)
            this._animationData = data;
    },
    getAnimationData: function () {
        return this._animationData;
    },
    getUserObject: function () {
        return this._userObject;
    },
    isIgnoreFrameEvent: function () {
        return this._ignoreFrameEvent;
    }
});
var _p = ccs.ArmatureAnimation.prototype;
_p.speedScale;
cc.defineGetterSetter(_p, "speedScale", _p.getSpeedScale, _p.setSpeedScale);
_p.animationScale;
cc.defineGetterSetter(_p, "animationScale", _p.getAnimationScale, _p.setAnimationScale);
_p = null;
ccs.ArmatureAnimation.create = function (armature) {
    var animation = new ccs.ArmatureAnimation();
    if (animation && animation.init(armature))
        return animation;
    return null;
};
ccs.Tween = ccs.ProcessBase.extend({
    _tweenData:null,
    _to:null,
    _from:null,
    _between:null,
    _movementBoneData:null,
    _bone:null,
    _frameTweenEasing:0,
    _betweenDuration:0,
    _totalDuration:0,
    _toIndex:0,
    _fromIndex:0,
    _animation:null,
    _passLastFrame:false,
    ctor:function () {
        ccs.ProcessBase.prototype.ctor.call(this);
        this._frameTweenEasing = ccs.TweenType.linear;
    },
    init:function (bone) {
        this._from = new ccs.FrameData();
        this._between = new ccs.FrameData();
        this._bone = bone;
        this._tweenData = this._bone.getTweenData();
        this._tweenData.displayIndex = -1;
        this._animation = this._bone.getArmature() != null ?
            this._bone.getArmature().getAnimation() :
            null;
        return true;
    },
    play:function (movementBoneData, durationTo, durationTween, loop, tweenEasing) {
        ccs.ProcessBase.prototype.play.call(this, durationTo, durationTween, loop, tweenEasing);
        this._loopType = (loop)?ccs.ANIMATION_TYPE_TO_LOOP_FRONT:ccs.ANIMATION_TYPE_NO_LOOP;
        this._totalDuration = 0;
        this._betweenDuration = 0;
        this._fromIndex = this._toIndex = 0;
        var difMovement = movementBoneData != this._movementBoneData;
        this.setMovementBoneData(movementBoneData);
        this._rawDuration = this._movementBoneData.duration;
        var nextKeyFrame = this._movementBoneData.getFrameData(0);
        this._tweenData.displayIndex = nextKeyFrame.displayIndex;
        if (this._bone.getArmature().getArmatureData().dataVersion >= ccs.CONST_VERSION_COMBINED)        {
            ccs.TransformHelp.nodeSub(this._tweenData, this._bone.getBoneData());
            this._tweenData.scaleX += 1;
            this._tweenData.scaleY += 1;
        }
        if (this._rawDuration == 0) {
            this._loopType = ccs.ANIMATION_TYPE_SINGLE_FRAME;
            if (durationTo == 0)
                this.setBetween(nextKeyFrame, nextKeyFrame);
            else
                this.setBetween(this._tweenData, nextKeyFrame);
            this._frameTweenEasing = ccs.TweenType.linear;
        }
        else if (this._movementBoneData.frameList.length > 1) {
            this._durationTween = durationTween * this._movementBoneData.scale;
            if (loop && this._movementBoneData.delay != 0)
                this.setBetween(this._tweenData, this.tweenNodeTo(this.updateFrameData(1 - this._movementBoneData.delay), this._between));
            else {
                if (!difMovement || durationTo == 0)
                    this.setBetween(nextKeyFrame, nextKeyFrame);
                else
                    this.setBetween(this._tweenData, nextKeyFrame);
            }
        }
        this.tweenNodeTo(0);
    },
    gotoAndPlay: function (frameIndex) {
        ccs.ProcessBase.prototype.gotoFrame.call(this, frameIndex);
        this._totalDuration = 0;
        this._betweenDuration = 0;
        this._fromIndex = this._toIndex = 0;
        this._isPlaying = true;
        this._isComplete = this._isPause = false;
        this._currentPercent = this._curFrameIndex / (this._rawDuration-1);
        this._currentFrame = this._nextFrameIndex * this._currentPercent;
    },
    gotoAndPause: function (frameIndex) {
        this.gotoAndPlay(frameIndex);
        this.pause();
    },
    updateHandler:function () {
        var locCurrentPercent = this._currentPercent || 1;
        var locLoopType = this._loopType;
        if (locCurrentPercent >= 1) {
            switch (locLoopType) {
                case ccs.ANIMATION_TYPE_SINGLE_FRAME:
                    locCurrentPercent = 1;
                    this._isComplete = true;
                    this._isPlaying = false;
                    break;
                case ccs.ANIMATION_TYPE_NO_LOOP:
                    locLoopType = ccs.ANIMATION_TYPE_MAX;
                    if (this._durationTween <= 0)
                        locCurrentPercent = 1;
                    else
                        locCurrentPercent = (locCurrentPercent - 1) * this._nextFrameIndex / this._durationTween;
                    if (locCurrentPercent >= 1) {
                        locCurrentPercent = 1;
                        this._isComplete = true;
                        this._isPlaying = false;
                        break;
                    } else {
                        this._nextFrameIndex = this._durationTween;
                        this._currentFrame = locCurrentPercent * this._nextFrameIndex;
                        this._totalDuration = 0;
                        this._betweenDuration = 0;
                        this._fromIndex = this._toIndex = 0;
                        break;
                    }
                case ccs.ANIMATION_TYPE_TO_LOOP_FRONT:
                    locLoopType = ccs.ANIMATION_TYPE_LOOP_FRONT;
                    this._nextFrameIndex = this._durationTween > 0 ? this._durationTween : 1;
                    if (this._movementBoneData.delay != 0) {
                        this._currentFrame = (1 - this._movementBoneData.delay) * this._nextFrameIndex;
                        locCurrentPercent = this._currentFrame / this._nextFrameIndex;
                    } else {
                        locCurrentPercent = 0;
                        this._currentFrame = 0;
                    }
                    this._totalDuration = 0;
                    this._betweenDuration = 0;
                    this._fromIndex = this._toIndex = 0;
                    break;
                case ccs.ANIMATION_TYPE_MAX:
                    locCurrentPercent = 1;
                    this._isComplete = true;
                    this._isPlaying = false;
                    break;
                default:
                    this._currentFrame = ccs.fmodf(this._currentFrame, this._nextFrameIndex);
                    break;
            }
        }
        if (locCurrentPercent < 1 && locLoopType < ccs.ANIMATION_TYPE_TO_LOOP_BACK)
            locCurrentPercent = Math.sin(locCurrentPercent * cc.PI / 2);
        this._currentPercent = locCurrentPercent;
        this._loopType = locLoopType;
        if (locLoopType > ccs.ANIMATION_TYPE_TO_LOOP_BACK)
            locCurrentPercent = this.updateFrameData(locCurrentPercent);
        if (this._frameTweenEasing != ccs.TweenType.tweenEasingMax)
            this.tweenNodeTo(locCurrentPercent);
    },
    setBetween:function (from, to, limit) {
        if(limit === undefined)
            limit = true;
        do {
            if (from.displayIndex < 0 && to.displayIndex >= 0) {
                this._from.copy(to);
                this._between.subtract(to, to, limit);
                break;
            }
            if (to.displayIndex < 0 && from.displayIndex >= 0) {
                this._from.copy(from);
                this._between.subtract(to, to, limit);
                break;
            }
            this._from.copy(from);
            this._between.subtract(from, to, limit);
        } while (0);
        if (!from.isTween){
            this._tweenData.copy(from);
            this._tweenData.isTween = true;
        }
        this.arriveKeyFrame(from);
    },
    arriveKeyFrame:function (keyFrameData) {
        if (keyFrameData) {
            var locBone = this._bone;
            var displayManager = locBone.getDisplayManager();
            var displayIndex = keyFrameData.displayIndex;
            if (!displayManager.getForceChangeDisplay())
                displayManager.changeDisplayWithIndex(displayIndex, false);
            this._tweenData.zOrder = keyFrameData.zOrder;
            locBone.updateZOrder();
            this._bone.setBlendFunc(keyFrameData.blendFunc);
            var childAramture = locBone.getChildArmature();
            if (childAramture) {
                if (keyFrameData.movement != "")
                    childAramture.getAnimation().play(keyFrameData.movement);
            }
        }
    },
    tweenNodeTo:function (percent, node) {
        if (!node)
            node = this._tweenData;
        var locFrom = this._from;
        var locBetween = this._between;
        if (!locFrom.isTween)
            percent = 0;
        node.x = locFrom.x + percent * locBetween.x;
        node.y = locFrom.y + percent * locBetween.y;
        node.scaleX = locFrom.scaleX + percent * locBetween.scaleX;
        node.scaleY = locFrom.scaleY + percent * locBetween.scaleY;
        node.skewX = locFrom.skewX + percent * locBetween.skewX;
        node.skewY = locFrom.skewY + percent * locBetween.skewY;
        this._bone.setTransformDirty(true);
        if (node && locBetween.isUseColorInfo)
            this.tweenColorTo(percent, node);
        return node;
    },
    tweenColorTo:function(percent,node){
        var locFrom = this._from;
        var locBetween = this._between;
        node.a = locFrom.a + percent * locBetween.a;
        node.r = locFrom.r + percent * locBetween.r;
        node.g = locFrom.g + percent * locBetween.g;
        node.b = locFrom.b + percent * locBetween.b;
        this._bone.updateColor();
    },
    updateFrameData:function (currentPercent) {
        if (currentPercent > 1 && this._movementBoneData.delay != 0)
            currentPercent = ccs.fmodf(currentPercent,1);
        var playedTime = (this._rawDuration-1) * currentPercent;
        var from, to;
        var locTotalDuration = this._totalDuration,locBetweenDuration = this._betweenDuration, locToIndex = this._toIndex;
        if (playedTime < locTotalDuration || playedTime >= locTotalDuration + locBetweenDuration) {
            var frames = this._movementBoneData.frameList;
            var length = frames.length;
            if (playedTime < frames[0].frameID){
                from = to = frames[0];
                this.setBetween(from, to);
                return this._currentPercent;
            }
            if (playedTime >= frames[length - 1].frameID) {
                if (this._passLastFrame) {
                    from = to = frames[length - 1];
                    this.setBetween(from, to);
                    return this._currentPercent;
                }
                this._passLastFrame = true;
            } else
                this._passLastFrame = false;
            do {
                this._fromIndex = locToIndex;
                from = frames[this._fromIndex];
                locTotalDuration = from.frameID;
                locToIndex = this._fromIndex + 1;
                if (locToIndex >= length)
                    locToIndex = 0;
                to = frames[locToIndex];
                if(from.strEvent && !this._animation.isIgnoreFrameEvent())
                    this._animation.frameEvent(this._bone, from.strEvent,from.frameID, playedTime);
                if (playedTime == from.frameID|| (this._passLastFrame && this._fromIndex == length-1))
                    break;
            } while  (playedTime < from.frameID || playedTime >= to.frameID);
            locBetweenDuration = to.frameID - from.frameID;
            this._frameTweenEasing = from.tweenEasing;
            this.setBetween(from, to, false);
            this._totalDuration = locTotalDuration;
            this._betweenDuration = locBetweenDuration;
            this._toIndex = locToIndex;
        }
        currentPercent = locBetweenDuration == 0 ? 0 : (playedTime - this._totalDuration) / this._betweenDuration;
        var tweenType = (this._frameTweenEasing != ccs.TweenType.linear) ? this._frameTweenEasing : this._tweenEasing;
        if (tweenType != ccs.TweenType.tweenEasingMax && tweenType != ccs.TweenType.linear && !this._passLastFrame) {
            currentPercent = ccs.TweenFunction.tweenTo(currentPercent, tweenType, this._from.easingParams);
        }
        return currentPercent;
    },
    setAnimation:function (animation) {
        this._animation = animation;
    },
    getAnimation:function () {
        return this._animation;
    },
    setMovementBoneData: function(data){
        this._movementBoneData = data;
    }
});
var _p = ccs.Tween.prototype;
_p.animation;
cc.defineGetterSetter(_p, "animation", _p.getAnimation, _p.setAnimation);
_p = null;
ccs.Tween.create = function (bone) {
    var tween = new ccs.Tween();
    if (tween && tween.init(bone))
        return tween;
    return null;
};
ccs.PT_RATIO = 32;
ccs.ColliderFilter = ccs.Class.extend({
    _collisionType: 0,
    _group: 0,
    _categoryBits: 0,
    _groupIndex: 0,
    _maskBits: 0,
    ctor: function (collisionType, group) {
        this._collisionType = collisionType || 0;
        this._group = group || 0;
    },
    updateShape: function (shape) {
        if(shape instanceof cp.Shape){
            shape.collision_type = this._collisionType;
            shape.group = this._group;
        }else if(shape instanceof Box2D.b2FilterData){
            var filter = new Box2D.b2FilterData();
            filter.categoryBits = this._categoryBits;
            filter.groupIndex = this._groupIndex;
            filter.maskBits = this._maskBits;
            shape.SetFilterData(filter);
        }
    }
});
ccs.ColliderBody = ccs.Class.extend({
    shape: null,
    coutourData: null,
    colliderFilter: null,
    _calculatedVertexList: null,
    ctor: function (contourData) {
        this.shape = null;
        this.coutourData = contourData;
        this.colliderFilter = new ccs.ColliderFilter();
        if (ccs.ENABLE_PHYSICS_SAVE_CALCULATED_VERTEX) {
            this._calculatedVertexList = [];
        }
    },
    getContourData: function () {
        return this.coutourData;
    },
    setColliderFilter: function (colliderFilter) {
        this.colliderFilter = colliderFilter;
    },
    getCalculatedVertexList: function () {
        return this._calculatedVertexList;
    },
    setB2Fixture: function(fixture){
        this._fixture = fixture;
    },
    getB2Fixture: function(){
        return this._fixture;
    },
    setShape: function (shape) {
        this.shape = shape;
    },
    getShape: function () {
        return this.shape;
    },
    setContourData: function (contourData) {
        this.coutourData = contourData;
    },
    getColliderFilter: function () {
        return this.colliderFilter;
    }
});
ccs.ColliderDetector = ccs.Class.extend({
    _colliderBodyList: null,
    _bone: null,
    _body: null,
    _active: false,
    _filter: null,
    helpPoint: cc.p(0, 0),
    ctor: function () {
        this._colliderBodyList = [];
        this._bone = null;
        this._body = null;
        this._active = false;
        this._filter = null;
    },
    init: function (bone) {
        this._colliderBodyList.length = 0;
        if (bone)
            this._bone = bone;
        this._filter = new ccs.ColliderFilter();
        return true;
    },
    addContourData: function (contourData) {
        var colliderBody = new ccs.ColliderBody(contourData);
        this._colliderBodyList.push(colliderBody);
        if (ccs.ENABLE_PHYSICS_SAVE_CALCULATED_VERTEX) {
            var calculatedVertexList = colliderBody.getCalculatedVertexList();
            var vertexList = contourData.vertexList;
            for (var i = 0; i < vertexList.length; i++) {
                var newVertex = new ccs.ContourVertex2(0, 0);
                calculatedVertexList.push(newVertex);
            }
        }
    },
    addContourDataList: function (contourDataList) {
        for (var i = 0; i < contourDataList.length; i++) {
            this.addContourData(contourDataList[i]);
        }
    },
    removeContourData: function (contourData) {
        var eraseList = [], i, locBodyList = this._colliderBodyList;
        for (i = 0; i < locBodyList.length; i++) {
            var body = locBodyList[i];
            if (body && body.getContourData() == contourData)
                eraseList.push(body);
        }
        for (i=0; i<eraseList.length; i++)
            cc.arrayRemoveObject(locBodyList, eraseList[i]);
    },
    removeAll: function () {
        this._colliderBodyList.length = 0;
    },
    setActive: function (active) {
        if (this._active == active)
            return;
        this._active = active;
        var locBody = this._body;
        var locShape;
        if (locBody) {
            var colliderBody = null;
            if (this._active) {
                for (var i = 0; i < this._colliderBodyList.length; i++) {
                    colliderBody = this._colliderBodyList[i];
                    locShape = colliderBody.getShape();
                    locBody.space.addShape(locShape);
                }
            } else {
                for (var i = 0; i < this._colliderBodyList.length; i++) {
                    colliderBody = this._colliderBodyList[i];
                    locShape = colliderBody.getShape();
                    locBody.space.removeShape(locShape);
                }
            }
        }
    },
    getActive: function () {
        return this._active;
    },
    getColliderBodyList: function(){
        return this._colliderBodyList;
    },
    setColliderFilter: function (filter) {
        this._filter = filter;
        var locBodyList = this._colliderBodyList;
        for(var i=0; i< locBodyList.length; i++){
            var colliderBody = locBodyList[i];
            colliderBody.setColliderFilter(filter);
            if (colliderBody.getShape())
                colliderBody.getColliderFilter().updateShape(colliderBody.getShape());
        }
    },
    getColliderFilter: function () {
        return this._filter;
    },
    updateTransform: function (t) {
        if (!this._active)
            return;
        var colliderBody = null;
        var locBody = this._body;
        var locHelpPoint = this.helpPoint;
        for (var i = 0; i < this._colliderBodyList.length; i++) {
            colliderBody = this._colliderBodyList[i];
            var contourData = colliderBody.getContourData();
            var shape = null;
            if (locBody) {
                shape = colliderBody.getShape();
            }
            var vs = contourData.vertexList;
            var cvs = colliderBody.getCalculatedVertexList();
            for (var j = 0; j < vs.length; j++) {
                locHelpPoint.x = vs[j].x;
                locHelpPoint.y = vs[j].y;
                locHelpPoint = cc.pointApplyAffineTransform(locHelpPoint, t);
                if (ccs.ENABLE_PHYSICS_SAVE_CALCULATED_VERTEX) {
                    var v = cc.p(0, 0);
                    v.x = locHelpPoint.x;
                    v.y = locHelpPoint.y;
                    cvs[j] = v;
                }
                if (shape) {
                    shape.verts[j * 2] = locHelpPoint.x;
                    shape.verts[j * 2 + 1] = locHelpPoint.y;
                }
            }
            if (shape) {
                for (var j = 0; j < vs.length; j++) {
                    var b = shape.verts[(j + 1) % shape.verts.length];
                    var n = cp.v.normalize(cp.v.perp(cp.v.sub(b, shape.verts[j])));
                    if(shape.planes){
                        shape.planes[j].n = n;
                        shape.planes[j].d = cp.v.dot(n, shape.verts[j]);
                    }
                }
            }
        }
    },
    setBody: function (body) {
        this._body = body;
        var colliderBody, locBodyList = this._colliderBodyList;
        for (var i = 0; i < locBodyList.length; i++) {
            colliderBody = locBodyList[i];
            var contourData = colliderBody.getContourData(), verts = [];
            var vs = contourData.vertexList;
            for (var j = 0; j < vs.length; j++) {
                var v = vs[j];
                verts.push(v.x);
                verts.push(v.y);
            }
            var shape = new cp.PolyShape(this._body, verts, cp.vzero);
            shape.sensor = true;
            shape.data = this._bone;
            if (this._active)
                this._body.space.addShape(shape);
            colliderBody.setShape(shape);
            colliderBody.getColliderFilter().updateShape(shape);
        }
    },
    getBody: function () {
        return this._body;
    }
});
var _p = ccs.ColliderDetector.prototype;
_p.colliderFilter;
cc.defineGetterSetter(_p, "colliderFilter", _p.getColliderFilter, _p.setColliderFilter);
_p.active;
cc.defineGetterSetter(_p, "active", _p.getActive, _p.setActive);
_p.body;
cc.defineGetterSetter(_p, "body", _p.getBody, _p.setBody);
_p = null;
ccs.ColliderDetector.create = function (bone) {
    var colliderDetector = new ccs.ColliderDetector();
    if (colliderDetector && colliderDetector.init(bone))
        return colliderDetector;
    return null;
};
ccs.Armature = ccs.Node.extend({
    animation: null,
    armatureData: null,
    batchNode: null,
    _textureAtlas: null,
    _parentBone: null,
    _boneDic: null,
    _topBoneList: null,
    _armatureIndexDic: null,
    _offsetPoint: null,
    version: 0,
    _armatureTransformDirty: true,
    _body: null,
    _blendFunc: null,
    _className: "Armature",
    _realAnchorPointInPoints: null,
    ctor: function (name, parentBone) {
        cc.Node.prototype.ctor.call(this);
        this._name = "";
        this._topBoneList = [];
        this._armatureIndexDic = {};
        this._offsetPoint = cc.p(0, 0);
        this._armatureTransformDirty = true;
        this._realAnchorPointInPoints = cc.p(0, 0);
        name && ccs.Armature.prototype.init.call(this, name, parentBone);
    },
    _initRendererCmd:function () {
        if(cc._renderType === cc._RENDER_TYPE_CANVAS){
            this._rendererStartCmd = new cc.CustomRenderCmdCanvas(this, this._startRendererCmdForCanvas);
            this._rendererEndCmd = new cc.CustomRenderCmdCanvas(this, this._endRendererCmdForCanvas);
        }else{
            this._rendererCmd = new cc.ArmatureRenderCmdWebGL(this);
        }
    },
    init: function (name, parentBone) {
        cc.Node.prototype.init.call(this);
        if (parentBone)
            this._parentBone = parentBone;
        this.removeAllChildren();
        this.animation = new ccs.ArmatureAnimation();
        this.animation.init(this);
        this._boneDic = {};
        this._topBoneList.length = 0;
        this._blendFunc = {src: cc.BLEND_SRC, dst: cc.BLEND_DST};
        this._name = name || "";
        var armatureDataManager = ccs.armatureDataManager;
        var animationData;
        if (name != "") {
            animationData = armatureDataManager.getAnimationData(name);
            cc.assert(animationData, "AnimationData not exist!");
            this.animation.setAnimationData(animationData);
            var armatureData = armatureDataManager.getArmatureData(name);
            cc.assert(armatureData, "ArmatureData not exist!");
            this.armatureData = armatureData;
            var boneDataDic = armatureData.getBoneDataDic();
            for (var key in boneDataDic) {
                var bone = this.createBone(String(key));
                do {
                    var movData = animationData.getMovement(animationData.movementNames[0]);
                    if (!movData) break;
                    var _movBoneData = movData.getMovementBoneData(bone.getName());
                    if (!_movBoneData || _movBoneData.frameList.length <= 0) break;
                    var frameData = _movBoneData.getFrameData(0);
                    if (!frameData) break;
                    bone.getTweenData().copy(frameData);
                    bone.changeDisplayWithIndex(frameData.displayIndex, false);
                } while (0);
            }
            this.update(0);
            this.updateOffsetPoint();
        } else {
            this._name = "new_armature";
            this.armatureData = ccs.ArmatureData.create();
            this.armatureData.name = this._name;
            animationData = ccs.AnimationData.create();
            animationData.name = this._name;
            armatureDataManager.addArmatureData(this._name, this.armatureData);
            armatureDataManager.addAnimationData(this._name, animationData);
            this.animation.setAnimationData(animationData);
        }
        if (cc._renderType === cc._RENDER_TYPE_WEBGL)
            this.setShaderProgram(cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR));
        this.setCascadeOpacityEnabled(true);
        this.setCascadeColorEnabled(true);
        return true;
    },
    createBone: function (boneName) {
        var existedBone = this.getBone(boneName);
        if (existedBone)
            return existedBone;
        var boneData = this.armatureData.getBoneData(boneName);
        var parentName = boneData.parentName;
        var bone = null;
        if (parentName) {
            this.createBone(parentName);
            bone = ccs.Bone.create(boneName);
            this.addBone(bone, parentName);
        } else {
            bone = ccs.Bone.create(boneName);
            this.addBone(bone, "");
        }
        bone.setBoneData(boneData);
        bone.getDisplayManager().changeDisplayWithIndex(-1, false);
        return bone;
    },
    addBone: function (bone, parentName) {
        cc.assert(bone, "Argument must be non-nil");
        var locBoneDic = this._boneDic;
        if(bone.getName())
            cc.assert(!locBoneDic[bone.getName()], "bone already added. It can't be added again");
        if (parentName) {
            var boneParent = locBoneDic[parentName];
            if (boneParent)
                boneParent.addChildBone(bone);
            else
                this._topBoneList.push(bone);
        } else
            this._topBoneList.push(bone);
        bone.setArmature(this);
        locBoneDic[bone.getName()] = bone;
        this.addChild(bone);
    },
    removeBone: function (bone, recursion) {
        cc.assert(bone, "bone must be added to the bone dictionary!");
        bone.setArmature(null);
        bone.removeFromParent(recursion);
        cc.arrayRemoveObject(this._topBoneList, bone);
        delete  this._boneDic[bone.getName()];
        this.removeChild(bone, true);
    },
    getBone: function (name) {
        return this._boneDic[name];
    },
    changeBoneParent: function (bone, parentName) {
        cc.assert(bone, "bone must be added to the bone dictionary!");
        var parentBone = bone.getParentBone();
        if (parentBone) {
            cc.arrayRemoveObject(parentBone.getChildren(), bone);
            bone.setParentBone(null);
        }
        if (parentName) {
            var boneParent = this._boneDic[parentName];
            if (boneParent) {
                boneParent.addChildBone(bone);
                cc.arrayRemoveObject(this._topBoneList, bone);
            } else
                this._topBoneList.push(bone);
        }
    },
    getBoneDic: function () {
        return this._boneDic;
    },
    updateOffsetPoint: function () {
        var rect = this.getBoundingBox();
        this.setContentSize(rect);
        var locOffsetPoint = this._offsetPoint;
        locOffsetPoint.x = -rect.x;
        locOffsetPoint.y = -rect.y;
        if (rect.width != 0 && rect.height != 0)
            this.setAnchorPoint(locOffsetPoint.x / rect.width, locOffsetPoint.y / rect.height);
    },
    setAnchorPoint: function(point, y){
        var ax, ay;
        if(y !== undefined){
            ax = point;
            ay = y;
        }else{
            ax = point.x;
            ay = point.y;
        }
        var locAnchorPoint = this._anchorPoint;
        if(ax != locAnchorPoint.x || ay != locAnchorPoint.y){
            var contentSize = this._contentSize ;
            locAnchorPoint.x = ax;
            locAnchorPoint.y = ay;
            this._anchorPointInPoints.x = contentSize.width * locAnchorPoint.x - this._offsetPoint.x;
            this._anchorPointInPoints.y = contentSize.height * locAnchorPoint.y - this._offsetPoint.y;
            this._realAnchorPointInPoints.x = contentSize.width * locAnchorPoint.x;
            this._realAnchorPointInPoints.y = contentSize.height * locAnchorPoint.y;
            this.setNodeDirty();
        }
    },
    _setAnchorX: function (x) {
        if (this._anchorPoint.x === x) return;
        this._anchorPoint.x = x;
        this._anchorPointInPoints.x = this._contentSize.width * x - this._offsetPoint.x;
        this._realAnchorPointInPoints.x = this._contentSize.width * x;
        this.setNodeDirty();
    },
    _setAnchorY: function (y) {
        if (this._anchorPoint.y === y) return;
        this._anchorPoint.y = y;
        this._anchorPointInPoints.y = this._contentSize.height * y - this._offsetPoint.y;
        this._realAnchorPointInPoints.y = this._contentSize.height * y;
        this.setNodeDirty();
    },
    getAnchorPointInPoints: function(){
        return this._realAnchorPointInPoints;
    },
    setAnimation: function (animation) {
        this.animation = animation;
    },
    getAnimation: function () {
        return this.animation;
    },
    getArmatureTransformDirty: function () {
        return this._armatureTransformDirty;
    },
    update: function (dt) {
        this.animation.update(dt);
        var locTopBoneList = this._topBoneList;
        for (var i = 0; i < locTopBoneList.length; i++)
            locTopBoneList[i].update(dt);
        this._armatureTransformDirty = false;
    },
    draw: function(ctx){
        if (this._parentBone == null && this._batchNode == null) {
        }
        var locChildren = this._children;
        var alphaPremultiplied = cc.BlendFunc.ALPHA_PREMULTIPLIED, alphaNonPremultipled = cc.BlendFunc.ALPHA_NON_PREMULTIPLIED;
        for (var i = 0, len = locChildren.length; i< len; i++) {
            var selBone = locChildren[i];
            if (selBone && selBone.getDisplayRenderNode) {
                var node = selBone.getDisplayRenderNode();
                if (null == node)
                    continue;
                if(cc._renderType === cc._RENDER_TYPE_WEBGL)
                    node.setShaderProgram(this._shaderProgram);
                switch (selBone.getDisplayRenderNodeType()) {
                    case ccs.DISPLAY_TYPE_SPRITE:
                        if(node instanceof ccs.Skin){
                            if(cc._renderType === cc._RENDER_TYPE_WEBGL){
                                node.updateTransform();
                                var func = selBone.getBlendFunc();
                                if (func.src != alphaPremultiplied.src || func.dst != alphaPremultiplied.dst)
                                    node.setBlendFunc(selBone.getBlendFunc());
                                else {
                                    if ((this._blendFunc.src == alphaPremultiplied.src && this._blendFunc.dst == alphaPremultiplied.dst)
                                        && !node.getTexture().hasPremultipliedAlpha())
                                        node.setBlendFunc(alphaNonPremultipled);
                                    else
                                        node.setBlendFunc(this._blendFunc);
                                }
                                node.draw(ctx);
                            } else{
                                node.visit(ctx);
                            }
                        }
                        break;
                    case ccs.DISPLAY_TYPE_ARMATURE:
                        node.draw(ctx);
                        break;
                    default:
                        node.visit(ctx);
                        break;
                }
            } else if(selBone instanceof cc.Node) {
                if(cc._renderType === cc._RENDER_TYPE_WEBGL)
                    selBone.setShaderProgram(this._shaderProgram);
                selBone.visit(ctx);
            }
        }
    },
    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        this.scheduleUpdate();
    },
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        this.unscheduleUpdate();
    },
    visit: null,
    _visitForCanvas: function(ctx){
        var context = ctx || cc._renderContext;
        if (!this._visible)
            return;
        context.save();
        this.transform(context);
        this.sortAllChildren();
        if(this._rendererStartCmd)
            cc.renderer.pushRenderCommand(this._rendererStartCmd);
        this.draw(ctx);
        if(this._rendererEndCmd)
            cc.renderer.pushRenderCommand(this._rendererEndCmd);
        this._cacheDirty = false;
        context.restore();
    },
    _startRendererCmdForCanvas: function(ctx, scaleX, scaleY){
        var context = ctx || cc._renderContext;
        context.save();
        this.transform(context);
        var t = this._transformWorld;
        ctx.transform(t.a, t.b, t.c, t.d, t.tx * scaleX, -t.ty * scaleY);
        var locChildren = this._children;
        for (var i = 0, len = locChildren.length; i< len; i++) {
            var selBone = locChildren[i];
            if (selBone && selBone.getDisplayRenderNode) {
                var node = selBone.getDisplayRenderNode();
                if (null == node)
                    continue;
                node._transformForRenderer();
            }
        }
    },
    _endRendererCmdForCanvas: function(ctx){
        var context = ctx || cc._renderContext;
        this._cacheDirty = false;
        context.restore();
    },
    _visitForWebGL: function(){
        if (!this._visible)
            return;
        var context = cc._renderContext, currentStack = cc.current_stack;
        currentStack.stack.push(currentStack.top);
        cc.kmMat4Assign(this._stackMatrix, currentStack.top);
        currentStack.top = this._stackMatrix;
        this.transform();
        this.sortAllChildren();
        cc.renderer.pushRenderCommand(this._rendererCmd);
        currentStack.top = currentStack.stack.pop();
    },
    getBoundingBox: function(){
        var minX, minY, maxX, maxY = 0;
        var first = true;
        var boundingBox = cc.rect(0, 0, 0, 0), locChildren = this._children;
        var len = locChildren.length;
        for (var i=0; i<len; i++) {
            var bone = locChildren[i];
            if (bone) {
                var r = bone.getDisplayManager().getBoundingBox();
                if (r.x == 0 && r.y == 0 && r.width == 0 && r.height == 0)
                    continue;
                if(first) {
                    minX = r.x;
                    minY = r.y;
                    maxX = r.x + r.width;
                    maxY = r.y + r.height;
                    first = false;
                } else {
                    minX = r.x < boundingBox.x ? r.x : boundingBox.x;
                    minY = r.y < boundingBox.y ? r.y : boundingBox.y;
                    maxX = r.x + r.width > boundingBox.x + boundingBox.width ?
                        r.x + r.width : boundingBox.x + boundingBox.width;
                    maxY = r.y + r.height > boundingBox.y + boundingBox.height ?
                        r.y + r.height : boundingBox.y + boundingBox.height;
                }
                boundingBox.x = minX;
                boundingBox.y = minY;
                boundingBox.width = maxX - minX;
                boundingBox.height = maxY - minY;
            }
        }
        return cc.rectApplyAffineTransform(boundingBox, this.getNodeToParentTransform());
    },
    getBoneAtPoint: function (x, y) {
        var locChildren = this._children;
        for (var i = locChildren.length - 1; i >= 0; i--) {
            var child = locChildren[i];
            if (child instanceof ccs.Bone && child.getDisplayManager().containPoint(x, y))
                return child;
        }
        return null;
    },
    setParentBone: function (parentBone) {
        this._parentBone = parentBone;
        var locBoneDic = this._boneDic;
        for (var key in locBoneDic) {
            locBoneDic[key].setArmature(this);
        }
    },
    getParentBone: function () {
        return this._parentBone;
    },
    drawContour: function () {
        cc._drawingUtil.setDrawColor(255, 255, 255, 255);
        cc._drawingUtil.setLineWidth(1);
        var locBoneDic = this._boneDic;
        for (var key in locBoneDic) {
            var bone = locBoneDic[key];
            var detector = bone.getColliderDetector();
            if(!detector)
                continue;
            var bodyList = detector.getColliderBodyList();
            for (var i = 0; i < bodyList.length; i++) {
                var body = bodyList[i];
                var vertexList = body.getCalculatedVertexList();
                cc._drawingUtil.drawPoly(vertexList, vertexList.length, true);
            }
        }
    },
    setBody: function (body) {
        if (this._body == body)
            return;
        this._body = body;
        this._body.data = this;
        var child, displayObject, locChildren = this._children;
        for (var i = 0; i < locChildren.length; i++) {
            child = locChildren[i];
            if (child instanceof ccs.Bone) {
                var displayList = child.getDisplayManager().getDecorativeDisplayList();
                for (var j = 0; j < displayList.length; j++) {
                    displayObject = displayList[j];
                    var detector = displayObject.getColliderDetector();
                    if (detector)
                        detector.setBody(this._body);
                }
            }
        }
    },
    getShapeList: function () {
        if (this._body)
            return this._body.shapeList;
        return null;
    },
    getBody: function () {
        return this._body;
    },
    setBlendFunc: function (blendFunc) {
        this._blendFunc = blendFunc;
    },
    getBlendFunc: function () {
        return this._blendFunc;
    },
    setColliderFilter: function (filter) {
        var locBoneDic = this._boneDic;
        for (var key in locBoneDic)
            locBoneDic[key].setColliderFilter(filter);
    },
    getArmatureData: function () {
        return this.armatureData;
    },
    setArmatureData: function (armatureData) {
        this.armatureData = armatureData;
    },
    getBatchNode: function () {
        return this.batchNode;
    },
    setBatchNode: function (batchNode) {
        this.batchNode = batchNode;
    },
    getVersion: function () {
        return this.version;
    },
    setVersion: function (version) {
        this.version = version;
    },
    _transformForRenderer: function(){
        ccs.Node.prototype._transformForRenderer.call(this);
        var locChildren = this._children;
        for (var i = 0, len = locChildren.length; i< len; i++) {
            var selBone = locChildren[i];
            if (selBone && selBone.getDisplayRenderNode) {
                var node = selBone.getDisplayRenderNode();
                if (null == node)
                    continue;
                node._transformForRenderer();
            }
        }
    }
});
if (cc._renderType == cc._RENDER_TYPE_WEBGL) {
    ccs.Armature.prototype.visit = ccs.Armature.prototype._visitForWebGL;
} else {
    ccs.Armature.prototype.visit = ccs.Armature.prototype._visitForCanvas;
}
var _p = ccs.Armature.prototype;
_p.parentBone;
cc.defineGetterSetter(_p, "parentBone", _p.getParentBone, _p.setParentBone);
_p.body;
cc.defineGetterSetter(_p, "body", _p.getBody, _p.setBody);
_p.colliderFilter;
cc.defineGetterSetter(_p, "colliderFilter", null, _p.setColliderFilter);
_p = null;
ccs.Armature.create = function (name, parentBone) {
    var armature = new ccs.Armature();
    if (armature.init(name, parentBone))
        return armature;
    return null;
};
ccs.Bone = ccs.Node.extend({
    _boneData: null,
    _armature: null,
    _childArmature: null,
    _displayManager: null,
    ignoreMovementBoneData: false,
    _tween: null,
    _tweenData: null,
    _parentBone: null,
    _boneTransformDirty: false,
    _worldTransform: null,
    _blendFunc: null,
    blendDirty: false,
    _worldInfo: null,
    _armatureParentBone: null,
    _dataVersion: 0,
    _className: "Bone",
    ctor: function () {
        cc.Node.prototype.ctor.call(this);
        this._tweenData = null;
        this._parentBone = null;
        this._armature = null;
        this._childArmature = null;
        this._boneData = null;
        this._tween = null;
        this._displayManager = null;
        this.ignoreMovementBoneData = false;
        this._worldTransform = cc.affineTransformMake(1, 0, 0, 1, 0, 0);
        this._boneTransformDirty = true;
        this._blendFunc = new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        this.blendDirty = false;
        this._worldInfo = null;
        this._armatureParentBone = null;
        this._dataVersion = 0;
    },
    init: function (name) {
        if (name)
            this._name = name;
        this._tweenData = new ccs.FrameData();
        this._tween = new ccs.Tween();
        this._tween.init(this);
        this._displayManager = new ccs.DisplayManager();
        this._displayManager.init(this);
        this._worldInfo = new ccs.BaseData();
        this._boneData = new ccs.BaseData();
        return true;
    },
    setBoneData: function (boneData) {
        cc.assert(boneData, "_boneData must not be null");
        if(this._boneData != boneData)
            this._boneData = boneData;
        this.setName(this._boneData.name);
        this._localZOrder = this._boneData.zOrder;
        this._displayManager.initDisplayList(boneData);
    },
    getBoneData: function () {
        return this._boneData;
    },
    setArmature: function (armature) {
        this._armature = armature;
        if (armature) {
            this._tween.setAnimation(this._armature.getAnimation());
            this._dataVersion = this._armature.getArmatureData().dataVersion;
            this._armatureParentBone = this._armature.getParentBone();
        } else
            this._armatureParentBone = null;
    },
    getArmature: function () {
        return this._armature;
    },
    update: function (delta) {
        if (this._parentBone)
            this._boneTransformDirty = this._boneTransformDirty || this._parentBone.isTransformDirty();
        if (this._armatureParentBone && !this._boneTransformDirty)
            this._boneTransformDirty = this._armatureParentBone.isTransformDirty();
        if (this._boneTransformDirty){
            var locTweenData = this._tweenData;
            if (this._dataVersion >= ccs.CONST_VERSION_COMBINED){
                ccs.TransformHelp.nodeConcat(locTweenData, this._boneData);
                locTweenData.scaleX -= 1;
                locTweenData.scaleY -= 1;
            }
            var locWorldInfo = this._worldInfo;
            locWorldInfo.copy(locTweenData);
            locWorldInfo.x = locTweenData.x + this._position.x;
            locWorldInfo.y = locTweenData.y + this._position.y;
            locWorldInfo.scaleX = locTweenData.scaleX * this._scaleX;
            locWorldInfo.scaleY = locTweenData.scaleY * this._scaleY;
            locWorldInfo.skewX = locTweenData.skewX + this._skewX + this._rotationX;
            locWorldInfo.skewY = locTweenData.skewY + this._skewY - this._rotationY;
            if(this._parentBone)
                this._applyParentTransform(this._parentBone);
            else {
                if (this._armatureParentBone)
                    this._applyParentTransform(this._armatureParentBone);
            }
            ccs.TransformHelp.nodeToMatrix(locWorldInfo, this._worldTransform);
            if (this._armatureParentBone)
                this._worldTransform = cc.affineTransformConcat(this._worldTransform, this._armature.getNodeToParentTransform());
        }
        ccs.displayFactory.updateDisplay(this, delta, this._boneTransformDirty || this._armature.getArmatureTransformDirty());
        for(var i=0; i<this._children.length; i++) {
            var childBone = this._children[i];
            childBone.update(delta);
        }
        this._boneTransformDirty = false;
    },
    _applyParentTransform: function (parent) {
        var locWorldInfo = this._worldInfo;
        var locParentWorldTransform = parent._worldTransform;
        var locParentWorldInfo = parent._worldInfo;
        var x = locWorldInfo.x;
        var y = locWorldInfo.y;
        locWorldInfo.x = x * locParentWorldTransform.a + y * locParentWorldTransform.c + locParentWorldInfo.x;
        locWorldInfo.y = x * locParentWorldTransform.b + y * locParentWorldTransform.d + locParentWorldInfo.y;
        locWorldInfo.scaleX = locWorldInfo.scaleX * locParentWorldInfo.scaleX;
        locWorldInfo.scaleY = locWorldInfo.scaleY * locParentWorldInfo.scaleY;
        locWorldInfo.skewX = locWorldInfo.skewX + locParentWorldInfo.skewX;
        locWorldInfo.skewY = locWorldInfo.skewY + locParentWorldInfo.skewY;
    },
    setBlendFunc: function (blendFunc, dst) {
        var locBlendFunc = this._blendFunc, srcValue, dstValue;
        if(dst === undefined){
            srcValue = blendFunc.src;
            dstValue = blendFunc.dst;
        } else {
            srcValue = blendFunc;
            dstValue = dst;
        }
        if (locBlendFunc.src != srcValue || locBlendFunc.dst != dstValue) {
            locBlendFunc.src = srcValue;
            locBlendFunc.dst = dstValue;
            this.blendDirty = true;
        }
    },
    updateDisplayedColor: function (color) {
        this._realColor = cc.color(255, 255, 255);
        cc.Node.prototype.updateDisplayedColor.call(this, color);
        this.updateColor();
    },
    updateDisplayedOpacity: function (opacity) {
        this._realOpacity = 255;
        cc.Node.prototype.updateDisplayedOpacity.call(this, opacity);
        this.updateColor();
    },
    updateColor: function () {
        var display = this._displayManager.getDisplayRenderNode();
        if (display != null) {
            display.setColor(
                cc.color(
                        this._displayedColor.r * this._tweenData.r / 255,
                        this._displayedColor.g * this._tweenData.g / 255,
                        this._displayedColor.b * this._tweenData.b / 255));
            display.setOpacity(this._displayedOpacity * this._tweenData.a / 255);
        }
    },
    updateZOrder: function () {
        if (this._armature.getArmatureData().dataVersion >= ccs.CONST_VERSION_COMBINED) {
            var zorder = this._tweenData.zOrder + this._boneData.zOrder;
            this.setLocalZOrder(zorder);
        } else {
            this.setLocalZOrder(this._tweenData.zOrder);
        }
    },
    addChildBone: function (child) {
        cc.assert(child, "Argument must be non-nil");
        cc.assert(!child.parentBone, "child already added. It can't be added again");
        if (this._children.indexOf(child) < 0) {
            this._children.push(child);
            child.setParentBone(this);
        }
    },
    removeChildBone: function (bone, recursion) {
        if (this._children.length > 0 && this._children.getIndex(bone) != -1 ) {
            if(recursion) {
                var ccbones = bone._children;
                for(var i=0; i<ccbones.length; i++){
                    var ccBone = ccbones[i];
                    bone.removeChildBone(ccBone, recursion);
                }
            }
            bone.setParentBone(null);
            bone.getDisplayManager().setCurrentDecorativeDisplay(null);
            cc.arrayRemoveObject(this._children, bone);
        }
    },
    removeFromParent: function (recursion) {
        if (this._parentBone)
            this._parentBone.removeChildBone(this, recursion);
    },
    setParentBone: function (parent) {
        this._parentBone = parent;
    },
    getParentBone: function(){
        return this._parentBone;
    },
    setChildArmature: function (armature) {
        if (this._childArmature != armature) {
            if (armature == null && this._childArmature)
                this._childArmature.setParentBone(null);
            this._childArmature = armature;
        }
    },
    getChildArmature: function () {
        return this._childArmature;
    },
    getTween: function () {
        return this._tween;
    },
    setLocalZOrder: function (zOrder) {
        if (this._localZOrder != zOrder)
            cc.Node.prototype.setLocalZOrder.call(this, zOrder);
    },
    getNodeToArmatureTransform: function(){
        return this._worldTransform;
    },
    getNodeToWorldTransform: function(){
        return cc.affineTransformConcat(this._worldTransform, this._armature.getNodeToWorldTransform());
    },
    getDisplayRenderNode: function () {
        return this._displayManager.getDisplayRenderNode();
    },
    getDisplayRenderNodeType: function () {
        return this._displayManager.getDisplayRenderNodeType();
    },
    addDisplay: function (displayData, index) {
        index = index || 0;
        return this._displayManager.addDisplay(displayData, index);
    },
    removeDisplay: function (index) {
        this._displayManager.removeDisplay(index);
    },
    changeDisplayByIndex: function (index, force) {
        cc.log("changeDisplayByIndex is deprecated. Use changeDisplayWithIndex instead.");
        this.changeDisplayWithIndex(index, force);
    },
    changeDisplayByName: function(name, force){
        cc.log("changeDisplayByName is deprecated. Use changeDisplayWithName instead.");
        this.changeDisplayWithName(name, force);
    },
    changeDisplayWithIndex: function (index, force) {
        this._displayManager.changeDisplayWithIndex(index, force);
    },
    changeDisplayWithName: function (name, force) {
        this._displayManager.changeDisplayWithName(name, force);
    },
    getColliderDetector: function(){
        var decoDisplay = this._displayManager.getCurrentDecorativeDisplay();
        if (decoDisplay){
            var detector = decoDisplay.getColliderDetector();
            if (detector)
                return detector;
        }
        return null;
    },
    setColliderFilter: function (filter) {
        var displayList = this._displayManager.getDecorativeDisplayList();
        for (var i = 0; i < displayList.length; i++) {
            var locDecoDisplay = displayList[i];
            var locDetector = locDecoDisplay.getColliderDetector();
            if (locDetector)
                locDetector.setColliderFilter(filter);
        }
    },
    getColliderFilter: function () {
        var decoDisplay = this.displayManager.getCurrentDecorativeDisplay();
        if (decoDisplay) {
            var detector = decoDisplay.getColliderDetector();
            if (detector)
                return detector.getColliderFilter();
        }
        return null;
    },
    setTransformDirty: function (dirty) {
        this._boneTransformDirty = dirty;
    },
    isTransformDirty: function () {
        return this._boneTransformDirty;
    },
    getDisplayManager: function () {
        return this._displayManager;
    },
    setIgnoreMovementBoneData: function (bool) {
        this._ignoreMovementBoneData = bool;
    },
    isIgnoreMovementBoneData: function(){
        return this._ignoreMovementBoneData;
    },
    getBlendFunc: function () {
        return this._blendFunc;
    },
    setBlendDirty: function (dirty) {
        this._blendDirty = dirty;
    },
    isBlendDirty: function () {
        return this._blendDirty;
    },
    getTweenData: function () {
        return this._tweenData;
    },
    getWorldInfo: function(){
        return this._worldInfo;
    },
    getChildrenBone: function () {
        return this._children;
    },
    nodeToArmatureTransform: function () {
        return this.getNodeToArmatureTransform();
    },
    nodeToWorldTransform: function () {
        return this.getNodeToWorldTransform();
    },
    getColliderBodyList: function () {
        var detector = this.getColliderDetector();
        if(detector)
            return detector.getColliderBodyList();
        return null;
    },
    getIgnoreMovementBoneData: function () {
        return this.isIgnoreMovementBoneData();
    }
});
var _p = ccs.Bone.prototype;
_p.boneData;
cc.defineGetterSetter(_p, "boneData", _p.getBoneData, _p.setBoneData);
_p.armature;
cc.defineGetterSetter(_p, "armature", _p.getArmature, _p.setArmature);
_p.childArmature;
cc.defineGetterSetter(_p, "childArmature", _p.getChildArmature, _p.setChildArmature);
_p.childrenBone;
cc.defineGetterSetter(_p, "childrenBone", _p.getChildrenBone);
_p.tween;
cc.defineGetterSetter(_p, "tween", _p.getTween);
_p.tweenData;
cc.defineGetterSetter(_p, "tweenData", _p.getTweenData);
_p.colliderFilter;
cc.defineGetterSetter(_p, "colliderFilter", _p.getColliderFilter, _p.setColliderFilter);
_p = null;
ccs.Bone.create = function (name) {
    var bone = new ccs.Bone();
    if (bone && bone.init(name))
        return bone;
    return null;
};
ccs.FRAME_TYPE_MOVE = 0;
ccs.FRAME_TYPE_SCALE = 1;
ccs.FRAME_TYPE_ROTATE = 2;
ccs.FRAME_TYPE_TINT = 3;
ccs.FRAME_TYPE_FADE = 4;
ccs.FRAME_TYPE_MAX = 5;
ccs.FrameEaseType = {
    Custom : -1,
    Linear : 0,
    Sine_EaseIn : 1,
    Sine_EaseOut : 2,
    Sine_EaseInOut : 3,
    Quad_EaseIn : 4,
    Quad_EaseOut : 5,
    Quad_EaseInOut : 6,
    Cubic_EaseIn : 7,
    Cubic_EaseOut : 8,
    Cubic_EaseInOut : 9,
    Quart_EaseIn : 10,
    Quart_EaseOut : 11,
    Quart_EaseInOut : 12,
    Quint_EaseIn : 13,
    Quint_EaseOut : 14,
    Quint_EaseInOut : 15,
    Expo_EaseIn : 16,
    Expo_EaseOut : 17,
    Expo_EaseInOut : 18,
    Circ_EaseIn : 19,
    Circ_EaseOut : 20,
    Circ_EaseInOut : 21,
    Elastic_EaesIn : 22,
    Elastic_EaesOut : 23,
    Elastic_EaesInOut : 24,
    Back_EaseIn : 25,
    Back_EaseOut : 26,
    Back_EaseInOut : 27,
    Bounce_EaseIn : 28,
    Bounce_EaseOut : 29,
    Bounce_EaseInOut : 30
};
ccs.ActionFrame = ccs.Class.extend({
    frameType: 0,
    easingType: 0,
    frameIndex: 0,
    _Parameter: null,
    time: 0,
    ctor: function () {
        this.frameType = 0;
        this.easingType = ccs.FrameEaseType.Linear;
        this.frameIndex = 0;
        this.time = 0;
    },
    getAction: function (duration, srcFrame) {
        cc.log("Need a definition of <getAction> for ActionFrame");
        return null;
    },
    _getEasingAction : function (action) {
        if (action === null) {
            console.error("Action cannot be null!");
            return null;
        }
        var resultAction;
        switch (this.easingType) {
            case ccs.FrameEaseType.Custom:
                break;
            case ccs.FrameEaseType.Linear:
                resultAction = action;
                break;
            case ccs.FrameEaseType.Sine_EaseIn:
                resultAction = action.easing(cc.easeSineIn());
                break;
            case ccs.FrameEaseType.Sine_EaseOut:
                resultAction = action.easing(cc.easeSineOut());
                break;
            case ccs.FrameEaseType.Sine_EaseInOut:
                resultAction = action.easing(cc.easeSineInOut());
                break;
            case ccs.FrameEaseType.Quad_EaseIn:
                resultAction = action.easing(cc.easeQuadraticActionIn());
                break;
            case ccs.FrameEaseType.Quad_EaseOut:
                resultAction = action.easing(cc.easeQuadraticActionOut());
                break;
            case ccs.FrameEaseType.Quad_EaseInOut:
                resultAction = action.easing(cc.easeQuadraticActionInOut());
                break;
            case ccs.FrameEaseType.Cubic_EaseIn:
                resultAction = action.easing(cc.easeCubicActionIn());
                break;
            case ccs.FrameEaseType.Cubic_EaseOut:
                resultAction = action.easing(cc.easeCubicActionOut());
                break;
            case ccs.FrameEaseType.Cubic_EaseInOut:
                resultAction = action.easing(cc.easeCubicActionInOut());
                break;
            case ccs.FrameEaseType.Quart_EaseIn:
                resultAction = action.easing(cc.easeQuarticActionIn());
                break;
            case ccs.FrameEaseType.Quart_EaseOut:
                resultAction = action.easing(cc.easeQuarticActionOut());
                break;
            case ccs.FrameEaseType.Quart_EaseInOut:
                resultAction = action.easing(cc.easeQuarticActionInOut());
                break;
            case ccs.FrameEaseType.Quint_EaseIn:
                resultAction = action.easing(cc.easeQuinticActionIn());
                break;
            case ccs.FrameEaseType.Quint_EaseOut:
                resultAction = action.easing(cc.easeQuinticActionOut());
                break;
            case ccs.FrameEaseType.Quint_EaseInOut:
                resultAction = action.easing(cc.easeQuinticActionInOut());
                break;
            case ccs.FrameEaseType.Expo_EaseIn:
                resultAction = action.easing(cc.easeExponentialIn());
                break;
            case ccs.FrameEaseType.Expo_EaseOut:
                resultAction = action.easing(cc.easeExponentialOut());
                break;
            case ccs.FrameEaseType.Expo_EaseInOut:
                resultAction = action.easing(cc.easeExponentialInOut());
                break;
            case ccs.FrameEaseType.Circ_EaseIn:
                resultAction = action.easing(cc.easeCircleActionIn());
                break;
            case ccs.FrameEaseType.Circ_EaseOut:
                resultAction = action.easing(cc.easeCircleActionOut());
                break;
            case ccs.FrameEaseType.Circ_EaseInOut:
                resultAction = action.easing(cc.easeCircleActionInOut());
                break;
            case ccs.FrameEaseType.Elastic_EaesIn:
                resultAction = action.easing(cc.easeElasticIn());
                break;
            case ccs.FrameEaseType.Elastic_EaesOut:
                resultAction = action.easing(cc.easeElasticOut());
                break;
            case ccs.FrameEaseType.Elastic_EaesInOut:
                resultAction = action.easing(cc.easeElasticInOut());
                break;
            case ccs.FrameEaseType.Back_EaseIn:
                resultAction = action.easing(cc.easeBackIn());
                break;
            case ccs.FrameEaseType.Back_EaseOut:
                resultAction = action.easing(cc.easeBackOut());
                break;
            case ccs.FrameEaseType.Back_EaseInOut:
                resultAction = action.easing(cc.easeBackInOut());
                break;
            case ccs.FrameEaseType.Bounce_EaseIn:
                resultAction = action.easing(cc.easeBounceIn());
                break;
            case ccs.FrameEaseType.Bounce_EaseOut:
                resultAction = action.easing(cc.easeBounceOut());
                break;
            case ccs.FrameEaseType.Bounce_EaseInOut:
                resultAction = action.easing(cc.easeBounceInOut());
                break;
        }
        return resultAction;
    },
    setEasingParameter: function(parameter){
        this._Parameter = [];
        for(var i=0;i<parameter.length;i++)
            this._Parameter.push(parameter[i]);
    },
    setEasingType: function(easingType){
        this.easingType = easingType;
    }
});
ccs.ActionMoveFrame = ccs.ActionFrame.extend({
    _position: null,
    ctor: function () {
        ccs.ActionFrame.prototype.ctor.call(this);
        this._position = cc.p(0, 0);
        this.frameType = ccs.FRAME_TYPE_MOVE;
    },
    setPosition: function (pos, y) {
        if (y === undefined) {
            this._position.x = pos.x;
            this._position.y = pos.y;
        } else {
            this._position.x = pos;
            this._position.y = y;
        }
    },
    getPosition: function () {
        return this._position;
    },
    getAction: function (duration) {
        return this._getEasingAction(cc.moveTo(duration, this._position));
    }
});
ccs.ActionScaleFrame = ccs.ActionFrame.extend({
    _scaleX: 1,
    _scaleY: 1,
    ctor: function () {
        ccs.ActionFrame.prototype.ctor.call(this);
        this._scaleX = 1;
        this._scaleY = 1;
        this.frameType = ccs.FRAME_TYPE_SCALE;
    },
    setScaleX: function (scaleX) {
        this._scaleX = scaleX;
    },
    getScaleX: function () {
        return this._scaleX;
    },
    setScaleY: function (scaleY) {
        this._scaleY = scaleY;
    },
    getScaleY: function () {
        return this._scaleY;
    },
    getAction: function (duration) {
        return this._getEasingAction(cc.scaleTo(duration, this._scaleX, this._scaleY));
    }
});
ccs.ActionRotationFrame = ccs.ActionFrame.extend({
    _rotation: 0,
    ctor: function () {
        ccs.ActionFrame.prototype.ctor.call(this);
        this._rotation = 0;
        this.frameType = ccs.FRAME_TYPE_ROTATE;
    },
    setRotation: function (rotation) {
        this._rotation = rotation;
    },
    getRotation: function () {
        return this._rotation;
    },
    getAction: function (duration, srcFrame) {
        if(srcFrame === undefined)
            return this._getEasingAction(cc.rotateTo(duration, this._rotation));
        else {
            if (!(srcFrame instanceof cc.ActionRotationFrame))
                return this.getAction(duration);
            else{
                var diffRotation = this._rotation - srcFrame._rotation;
                return this._getEasingAction(cc.rotateBy(duration,diffRotation));
            }
        }
    }
});
ccs.ActionFadeFrame = ccs.ActionFrame.extend({
    _opacity: 255,
    ctor: function () {
        ccs.ActionFrame.prototype.ctor.call(this);
        this._opacity = 255;
        this.frameType = ccs.FRAME_TYPE_FADE;
    },
    setOpacity: function (opacity) {
        this._opacity = opacity;
    },
    getOpacity: function () {
        return this._opacity;
    },
    getAction: function (duration) {
        return this._getEasingAction(cc.fadeTo(duration, this._opacity));
    }
});
ccs.ActionTintFrame = ccs.ActionFrame.extend({
    _color: null,
    ctor: function () {
        ccs.ActionFrame.prototype.ctor.call(this);
        this._color = cc.color(255, 255, 255, 255);
        this.frameType = ccs.FRAME_TYPE_TINT;
    },
    setColor: function (color) {
        var locColor = this._color;
        locColor.r = color.r;
        locColor.g = color.g;
        locColor.b = color.b;
    },
    getColor: function () {
        var locColor = this._color;
        return cc.color(locColor.r, locColor.g, locColor.b, locColor.a);
    },
    getAction: function (duration) {
        return this._getEasingAction(cc.tintTo(duration, this._color.r, this._color.g, this._color.b));
    }
});
ccs.actionManager = {
    _actionDic: {},
    initWithDictionary: function (jsonName, dic, root) {
        var path = jsonName;
        var pos = path.lastIndexOf("/");
        var fileName = path.substr(pos + 1, path.length);
        var actionList = dic["actionlist"];
        var locActionList = [];
        for (var i = 0; i < actionList.length; i++) {
            var locAction = new ccs.ActionObject();
            var locActionDic = actionList[i];
            locAction.initWithDictionary(locActionDic, root);
            locActionList.push(locAction);
        }
        this._actionDic[fileName] = locActionList;
    },
    getActionByName: function (jsonName, actionName) {
        var actionList = this._actionDic[jsonName];
        if (!actionList)
            return null;
        for (var i = 0; i < actionList.length; i++) {
            var locAction = actionList[i];
            if (actionName == locAction.getName())
                return locAction;
        }
        return null;
    },
    playActionByName: function (jsonName, actionName, fun) {
        var action = this.getActionByName(jsonName, actionName);
        if (action)
            action.play(fun);
    },
    releaseActions: function () {
        this._actionDic = {};
    },
	clear: function() {
		this._actionDic = {};
	}
};
ccs.ActionNode = ccs.Class.extend({
    _currentFrameIndex: 0,
    _destFrameIndex: 0,
    _unitTime: 0,
    _actionTag: 0,
    _object: null,
    _actionSpawn: null,
    _action: null,
    _frameArray: null,
    _frameArrayNum: 0,
    ctor: function () {
        this._currentFrameIndex = 0;
        this._destFrameIndex = 0;
        this._unitTime = 0.1;
        this._actionTag = 0;
        this._object = null;
        this._actionSpawn = null;
        this._action = null;
        this._frameArray = [];
        this._frameArrayNum = ccs.FRAME_TYPE_MAX;
        for (var i = 0; i < this._frameArrayNum; i++)
            this._frameArray.push([]);
    },
    initWithDictionary: function (dic, root) {
        this.setActionTag(dic["ActionTag"]);
        var actionFrameList = dic["actionframelist"];
        for (var i = 0; i < actionFrameList.length; i++) {
            var actionFrameDic = actionFrameList[i];
            var frameIndex = actionFrameDic["frameid"];
            var frameTweenType = actionFrameDic["tweenType"];
            if(frameTweenType == null)
                frameTweenType = 0;
            var frameTweenParameterNum = actionFrameDic["tweenParameter"];
            var frameTweenParameter = [];
            for (var j = 0; j < frameTweenParameterNum; j++){
                var value = actionFrameDic["tweenParameter"][j];
                frameTweenParameter.push(value);
            }
            var actionFrame, actionArray;
            if (actionFrameDic["positionx"] !== undefined) {
                var positionX = actionFrameDic["positionx"];
                var positionY = actionFrameDic["positiony"];
                actionFrame = new ccs.ActionMoveFrame();
                actionFrame.frameIndex = frameIndex;
                actionFrame.setEasingType(frameTweenType);
                actionFrame.setEasingParameter(frameTweenParameter);
                actionFrame.setPosition(positionX, positionY);
                actionArray = this._frameArray[ccs.FRAME_TYPE_MOVE];
                actionArray.push(actionFrame);
            }
            if (actionFrameDic["scalex"] !== undefined) {
                var scaleX = actionFrameDic["scalex"];
                var scaleY = actionFrameDic["scaley"];
                actionFrame = new ccs.ActionScaleFrame();
                actionFrame.frameIndex = frameIndex;
                actionFrame.setEasingType(frameTweenType);
                actionFrame.setEasingParameter(frameTweenParameter);
                actionFrame.setScaleX(scaleX);
                actionFrame.setScaleY(scaleY);
                actionArray = this._frameArray[ccs.FRAME_TYPE_SCALE];
                actionArray.push(actionFrame);
            }
            if (actionFrameDic["rotation"] !== undefined) {
                var rotation = actionFrameDic["rotation"];
                actionFrame = new ccs.ActionRotationFrame();
                actionFrame.frameIndex = frameIndex;
                actionFrame.setEasingType(frameTweenType);
                actionFrame.setEasingParameter(frameTweenParameter);
                actionFrame.setRotation(rotation);
                actionArray = this._frameArray[ccs.FRAME_TYPE_ROTATE];
                actionArray.push(actionFrame);
            }
            if (actionFrameDic["opacity"] !== undefined) {
                var opacity = actionFrameDic["opacity"];
                actionFrame = new ccs.ActionFadeFrame();
                actionFrame.frameIndex = frameIndex;
                actionFrame.setEasingType(frameTweenType);
                actionFrame.setEasingParameter(frameTweenParameter);
                actionFrame.setOpacity(opacity);
                actionArray = this._frameArray[ccs.FRAME_TYPE_FADE];
                actionArray.push(actionFrame);
            }
            if (actionFrameDic["colorr"] !== undefined) {
                var colorR = actionFrameDic["colorr"];
                var colorG = actionFrameDic["colorg"];
                var colorB = actionFrameDic["colorb"];
                actionFrame = new ccs.ActionTintFrame();
                actionFrame.frameIndex = frameIndex;
                actionFrame.setEasingType(frameTweenType);
                actionFrame.setEasingParameter(frameTweenParameter);
                actionFrame.setColor(cc.color(colorR, colorG, colorB));
                actionArray = this._frameArray[ccs.FRAME_TYPE_TINT];
                actionArray.push(actionFrame);
            }
            actionFrameDic = null;
        }
        this._initActionNodeFromRoot(root);
    },
    _initActionNodeFromRoot: function (root) {
        if (root instanceof ccui.Widget) {
            var widget = ccui.helper.seekActionWidgetByActionTag(root, this.getActionTag());
            if (widget)
                this.setObject(widget);
        }
    },
    setUnitTime: function (time) {
        this._unitTime = time;
        this._refreshActionProperty();
    },
    getUnitTime: function () {
        return this._unitTime;
    },
    setActionTag: function (tag) {
        this._actionTag = tag;
    },
    getActionTag: function () {
        return this._actionTag;
    },
    setObject: function (node) {
        this._object = node;
    },
    getObject: function () {
        return this._object;
    },
    getActionNode: function () {
        if (this._object instanceof cc.Node)
            return this._object;
        return null;
    },
    insertFrame: function (index, frame) {
        if (frame == null)
            return;
        var frameType = frame.frameType;
        var array = this._frameArray[frameType];
        array.splice(index, 0, frame);
    },
    addFrame: function (frame) {
        if (!frame)
            return;
        var frameType = frame.frameType;
        var array = this._frameArray[frameType];
        array.push(frame);
    },
    deleteFrame: function (frame) {
        if (frame == null)
            return;
        var frameType = frame.frameType;
        var array = this._frameArray[frameType];
        cc.arrayRemoveObject(array, frame);
    },
    clearAllFrame: function () {
        for (var i = 0; i < this._frameArrayNum; i++)
            this._frameArray[i].length = 0;
    },
    _refreshActionProperty: function () {
        if (this._object == null)
            return null;
        var locSpawnArray = [];
        for (var i = 0; i < this._frameArrayNum; i++) {
            var locArray = this._frameArray[i];
            if (locArray.length <= 0)
                continue;
            var locSequenceArray = [];
            for (var j = 0; j < locArray.length; j++) {
                var locFrame = locArray[j];
                if (j != 0) {
                    var locSrcFrame = locArray[j - 1];
                    var locDuration = (locFrame.frameIndex - locSrcFrame.frameIndex) * this.getUnitTime();
                    var locAction = locFrame.getAction(locDuration);
                    if(locAction)
                        locSequenceArray.push(locAction);
                }
            }
            if(locSequenceArray){
                var locSequence = cc.sequence(locSequenceArray);
                if (locSequence != null)
                    locSpawnArray.push(locSequence);
            }
        }
        this._action = null;
        this._actionSpawn = cc.spawn(locSpawnArray);
        return this._actionSpawn;
    },
    playAction: function (fun) {
        if (this._object == null || this._actionSpawn == null)
            return;
        if(fun)
            this._action = cc.sequence(this._actionSpawn, fun);
        else
            this._action = cc.sequence(this._actionSpawn);
        this._runAction();
    },
    _runAction: function () {
        var node = this.getActionNode();
        if (node != null && this._action != null)
            node.runAction(this._action);
    },
    stopAction: function () {
        var node = this.getActionNode();
        if (node != null && this._action != null) {
            if(!this._action.isDone())
                node.stopAction(this._action);
        }
    },
    getFirstFrameIndex: function () {
        var locFrameindex = 99999;
        var bFindFrame = false, locFrameArray = this._frameArray;
        for (var i = 0, len = this._frameArrayNum; i < len; i++) {
            var locArray = locFrameArray[i];
            if (locArray.length <= 0)
                continue;
            bFindFrame = true;
            var locFrameIndex = locArray[0].frameIndex;
            locFrameindex = locFrameindex > locFrameIndex ? locFrameIndex : locFrameindex;
        }
        if (!bFindFrame)
            locFrameindex = 0;
        return locFrameindex;
    },
    getLastFrameIndex: function () {
        var locFrameindex = -1;
        var locIsFindFrame = false ,locFrameArray = this._frameArray;
        for (var i = 0, len = this._frameArrayNum; i < len; i++) {
            var locArray = locFrameArray[i];
            if (locArray.length <= 0)
                continue;
            locIsFindFrame = true;
            var locFrame = locArray[locArray.length - 1];
            var locFrameIndex = locFrame.frameIndex;
            locFrameindex = locFrameindex < locFrameIndex ? locFrameIndex : locFrameindex;
        }
        if (!locIsFindFrame)
            locFrameindex = 0;
        return locFrameindex;
    },
    updateActionToTimeLine: function (time) {
        var locIsFindFrame = false;
        var locUnitTime = this.getUnitTime();
        for (var i = 0; i < this._frameArrayNum; i++) {
            var locArray = this._frameArray[i];
            if (locArray == null)
                continue;
            for (var j = 0; j < locArray.length; j++) {
                var locFrame = locArray[j];
                if (locFrame.frameIndex * locUnitTime == time) {
                    this._easingToFrame(1.0, 1.0, locFrame);
                    locIsFindFrame = true;
                    break;
                } else if (locFrame.frameIndex * locUnitTime > time) {
                    if (j == 0) {
                        this._easingToFrame(1.0, 1.0, locFrame);
                        locIsFindFrame = false;
                    } else {
                        var locSrcFrame = locArray[j - 1];
                        var locDuration = (locFrame.frameIndex - locSrcFrame.frameIndex) * locUnitTime;
                        var locDelaytime = time - locSrcFrame.frameIndex * locUnitTime;
                        this._easingToFrame(locDuration, 1.0, locSrcFrame);
                        this._easingToFrame(locDuration, locDelaytime / locDuration, locFrame);
                        locIsFindFrame = true;
                    }
                    break;
                }
            }
        }
        return locIsFindFrame;
    },
    _easingToFrame: function (duration, delayTime, destFrame) {
        var action = destFrame.getAction(duration);
        var node = this.getActionNode();
        if (action == null || node == null)
            return;
        action.startWithTarget(node);
        action.update(delayTime);
    },
    isActionDoneOnce: function () {
        if (this._action == null)
            return true;
        return this._action.isDone();
    }
});
ccs.ActionObject = ccs.Class.extend({
    _actionNodeList: null,
    _name: "",
    _loop: false,
    _pause: false,
    _playing: false,
    _unitTime: 0,
    _currentTime: 0,
    _scheduler:null,
    _callback: null,
    _fTotalTime: 0,
    ctor: function () {
        this._actionNodeList = [];
        this._name = "";
        this._loop = false;
        this._pause = false;
        this._playing = false;
        this._unitTime = 0.1;
        this._currentTime = 0;
        this._fTotalTime = 0;
        this._scheduler = cc.director.getScheduler();
    },
    setName: function (name) {
        this._name = name;
    },
    getName: function () {
        return this._name;
    },
    setLoop: function (loop) {
        this._loop = loop;
    },
    getLoop: function () {
        return this._loop;
    },
    setUnitTime: function (time) {
        this._unitTime = time;
        var frameNum = this._actionNodeList.length;
        for (var i = 0; i < frameNum; i++) {
            var locActionNode = this._actionNodeList[i];
            locActionNode.setUnitTime(this._unitTime);
        }
    },
    getUnitTime: function () {
        return this._unitTime;
    },
    getCurrentTime: function () {
        return this._currentTime;
    },
    setCurrentTime: function (time) {
        this._currentTime = time;
    },
    getTotalTime: function(){
        return this._fTotalTime;
    },
    isPlaying: function () {
        return this._playing;
    },
    initWithDictionary: function (dic, root) {
        this.setName(dic["name"]);
        this.setLoop(dic["loop"]);
        this.setUnitTime(dic["unittime"]);
        var actionNodeList = dic["actionnodelist"];
        var maxLength = 0;
        for (var i = 0; i < actionNodeList.length; i++) {
            var actionNode = new ccs.ActionNode();
            var actionNodeDic = actionNodeList[i];
            actionNode.initWithDictionary(actionNodeDic, root);
            actionNode.setUnitTime(this.getUnitTime());
            this._actionNodeList.push(actionNode);
            var length = actionNode.getLastFrameIndex() - actionNode.getFirstFrameIndex();
            if(length > maxLength){
                maxLength = length;
            }
        }
        this._fTotalTime = maxLength * this._unitTime;
    },
    addActionNode: function (node) {
        if (!node)
            return;
        this._actionNodeList.push(node);
        node.setUnitTime(this._unitTime);
    },
    removeActionNode: function (node) {
        if (node == null)
            return;
        cc.arrayRemoveObject(this._actionNodeList, node);
    },
    play: function (fun) {
        this.stop();
        this.updateToFrameByTime(0);
        var locActionNodeList = this._actionNodeList;
        var frameNum = locActionNodeList.length;
        for (var i = 0; i < frameNum; i++) {
            locActionNodeList[i].playAction(fun);
        }
        if (this._loop)
            this._scheduler.scheduleCallbackForTarget(this, this.simulationActionUpdate, 0, cc.REPEAT_FOREVER, 0, false);
        if(fun !== undefined)
            this._callback = fun;
    },
    pause: function () {
        this._pause = true;
    },
    stop: function () {
        var locActionNodeList = this._actionNodeList;
        for (var i = 0; i < locActionNodeList.length; i++)
            locActionNodeList[i].stopAction();
        this._scheduler.unscheduleCallbackForTarget(this, this.simulationActionUpdate);
        this._pause = false;
    },
    updateToFrameByTime: function (time) {
        this._currentTime = time;
        for (var i = 0; i < this._actionNodeList.length; i++) {
            var locActionNode = this._actionNodeList[i];
            locActionNode.updateActionToTimeLine(time);
        }
    },
    simulationActionUpdate: function (dt) {
        var isEnd = true, locNodeList = this._actionNodeList;
        for(var i = 0, len = locNodeList.length; i < len; i++) {
            if (!locNodeList[i].isActionDoneOnce()){
                isEnd = false;
                break;
            }
        }
        if (isEnd){
            if (this._callback != null)
                this._callback.execute();
            if (this._loop)
                this.play();
            else
                this._scheduler.unschedule(this.simulationActionUpdate, this);
        }
    }
});
ccs.ComAttribute = ccs.Component.extend({
    _jsonDict: null,
    _filePath: "",
    ctor: function () {
        cc.Component.prototype.ctor.call(this);
        this._jsonDict = {};
        this._filePath = "";
        this._name = "CCComAttribute";
    },
    init: function () {
        this._jsonDict = {};
        return true;
    },
    setInt: function (key, value) {
        if (!key) {
            cc.log("Argument must be non-nil");
            return;
        }
        this._jsonDict[key] = value;
    },
    setDouble: function (key, value) {
        if (!key) {
            cc.log("Argument must be non-nil");
            return;
        }
        this._jsonDict[key] = value;
    },
    setFloat: function (key, value) {
        if (!key) {
            cc.log("Argument must be non-nil");
            return;
        }
        this._jsonDict[key] = value;
    },
    setBool: function (key, value) {
        if (!key) {
            cc.log("Argument must be non-nil");
            return;
        }
        this._jsonDict[key] = value;
    },
    setString: function (key, value) {
        if (!key) {
            cc.log("Argument must be non-nil");
            return;
        }
        this._jsonDict[key] = value;
    },
    setObject: function (key, value) {
        if (!key) {
            cc.log("Argument must be non-nil");
            return;
        }
        this._jsonDict[key] = value;
    },
    getInt: function (key) {
        var ret = this._jsonDict[key];
        return parseInt(ret || 0);
    },
    getDouble: function (key) {
        var ret = this._jsonDict[key];
        return parseFloat(ret || 0.0);
    },
    getFloat: function (key) {
        var ret = this._jsonDict[key];
        return parseFloat(ret || 0.0);
    },
    getBool: function (key) {
        var ret = this._jsonDict[key];
        return Boolean(ret || false);
    },
    getString: function (key) {
        var ret = this._jsonDict[key];
        return ret || "";
    },
    getObject: function (key) {
        return this._jsonDict[key];
    },
    parse:function(filename){
        this._jsonDict = cc.loader.getRes(filename);
    }
});
ccs.ComAttribute.create = function () {
    var com = new ccs.ComAttribute();
    if (com && com.init())
        return com;
    return null;
};
ccs.ComAudio = ccs.Component.extend({
    _filePath: "",
    _loop: false,
    ctor: function () {
        cc.Component.prototype.ctor.call(this);
        this._name = "Audio";
    },
    init: function () {
        return true;
    },
    onExit: function () {
        this.stopBackgroundMusic(true);
        this.stopAllEffects();
    },
    end: function () {
        cc.audioEngine.end();
    },
    preloadBackgroundMusic: function (pszFilePath) {
        cc.loader.load(pszFilePath);
    },
    playBackgroundMusic: function (pszFilePath, loop) {
        if(pszFilePath){
            cc.audioEngine.playMusic(pszFilePath, loop);
        }else{
            cc.audioEngine.playMusic(this._filePath, this._loop);
        }
    },
    stopBackgroundMusic: function (releaseData) {
        cc.audioEngine.stopMusic(releaseData);
    },
    pauseBackgroundMusic: function () {
        cc.audioEngine.pauseMusic();
    },
    resumeBackgroundMusic: function () {
        cc.audioEngine.resumeMusic();
    },
    rewindBackgroundMusic: function () {
        cc.audioEngine.rewindMusic();
    },
    willPlayBackgroundMusic: function () {
        return cc.audioEngine.willPlayMusic();
    },
    isBackgroundMusicPlaying: function () {
        return cc.audioEngine.isMusicPlaying();
    },
    getBackgroundMusicVolume: function () {
        return cc.audioEngine.getMusicVolume();
    },
    setBackgroundMusicVolume: function (volume) {
        cc.audioEngine.setMusicVolume(volume);
    },
    getEffectsVolume: function () {
        return cc.audioEngine.getEffectsVolume();
    },
    setEffectsVolume: function (volume) {
        cc.audioEngine.setEffectsVolume(volume);
    },
    playEffect: function (pszFilePath, loop) {
        if (pszFilePath)
            return cc.audioEngine.playEffect(pszFilePath, loop);
         else
            return cc.audioEngine.playEffect(this._filePath, this._loop);
    },
    pauseEffect: function (soundId) {
        cc.audioEngine.pauseEffect(soundId);
    },
    pauseAllEffects: function () {
        cc.audioEngine.pauseAllEffects();
    },
    resumeEffect: function (soundId) {
        cc.audioEngine.resumeEffect(soundId);
    },
    resumeAllEffects: function () {
        cc.audioEngine.resumeAllEffects();
    },
    stopEffect: function (soundId) {
        cc.audioEngine.stopEffect(soundId);
    },
    stopAllEffects: function () {
        cc.audioEngine.stopAllEffects();
    },
    preloadEffect: function (pszFilePath) {
        cc.loader.getRes(pszFilePath);
        this.setFile(pszFilePath);
        this.setLoop(false);
    },
    unloadEffect: function (pszFilePath) {
        cc.audioEngine.unloadEffect(pszFilePath);
    },
    setFile: function (pszFilePath) {
        this._filePath = pszFilePath;
    },
    setLoop: function (loop) {
        this._loop = loop;
    },
    getFile: function () {
        return this._filePath;
    },
    isLoop: function () {
        return this._loop;
    }
});
ccs.ComAudio.create = function () {
    var com = new ccs.ComAudio();
    if (com && com.init())
        return com;
    return null;
};
ccs.ComController = ccs.Component.extend({
    ctor: function () {
        cc.Component.prototype.ctor.call(this);
        this._name = "ComController";
    },
    onEnter: function () {
        if (this._owner != null)
            this._owner.scheduleUpdate();
    },
    isEnabled: function () {
        return this._enabled;
    },
    setEnabled: function (bool) {
        this._enabled = bool;
    }
});
ccs.ComController.create = function () {
    var com = new ccs.ComController();
    if (com && com.init())
        return com;
    return null;
};
ccs.ComRender = ccs.Component.extend({
    _render: null,
    ctor: function (node, comName) {
        cc.Component.prototype.ctor.call(this);
        this._render = node;
        this._name = comName;
        this.isRenderer = true;
    },
    onEnter: function () {
        if (this._owner)
            this._owner.addChild(this._render);
    },
    onExit: function () {
        if (this._owner) {
            this._owner.removeChild(this._render, true);
            this._render = null;
        }
    },
    getNode: function () {
        return this._render;
    },
    setNode: function (node) {
        this._render = node;
    }
});
ccs.ComRender.create = function (node, comName) {
    var com = new ccs.ComRender(node, comName);
    if (com && com.init())
        return com;
    return null;
};
ccs.objectFactory = {
    _typeMap: {},
    createObject: function (className) {
        var o = null;
        var t = this._typeMap[className];
        if (t) {
            if(cc.isFunction(t._fun))
                o = new t._fun();
            else
                o = t._fun;
        }
        return o;
    },
    registerType: function (t) {
        this._typeMap[t._className] = t;
    },
    createGUI: function(name){
        var object = null;
        if(name === "Panel")
            name = "Layout";
        else if(name === "TextArea")
            name = "Label";
        else if(name === "TextButton")
            name = "Button";
        var t = this._typeMap[name];
        if(t && t._fun)
            object = t._fun;
        return object;
    },
    removeAll: function(){
        this._typeMap = {};
    }
};
ccs.TInfo = ccs.Class.extend({
    _className: "",
    _fun: null,
    ctor: function (c, f) {
        if (f) {
            this._className = c;
            this._fun = f;
        } else {
            this._className = c._className;
            this._fun = c._fun;
        }
        ccs.objectFactory.registerType(this);
    }
});
ccs.sendEvent = function (event) {
    var triggerObjArr = ccs.triggerManager.get(event);
    if (triggerObjArr == null)
        return;
    for (var i = 0; i < triggerObjArr.length; i++) {
        var triObj = triggerObjArr[i];
        if (triObj != null && triObj.detect())
            triObj.done();
    }
};
ccs.registerTriggerClass = function (className, func) {
    new ccs.TInfo(className, func);
};
ccs.triggerManager = {
    _eventTriggers: {},
    _triggerObjs: {},
    _movementDispatches: [],
    parse: function (triggers) {
        for (var i = 0; i < triggers.length; ++i) {
            var subDict = triggers[i];
            var triggerObj = ccs.TriggerObj.create();
            triggerObj.serialize(subDict);
            var events = triggerObj.getEvents();
            for (var j = 0; j < events.length; j++) {
                var event = events[j];
                this.add(event, triggerObj);
            }
            this._triggerObjs[triggerObj.getId()] = triggerObj;
        }
    },
    get: function (event) {
        return this._eventTriggers[event];
    },
    getTriggerObj: function (id) {
        return this._triggerObjs[id];
    },
    add: function (event, triggerObj) {
        var eventTriggers = this._eventTriggers[event];
        if (!eventTriggers)
            eventTriggers = [];
        if (eventTriggers.indexOf(triggerObj) == -1) {
            eventTriggers.push(triggerObj);
            this._eventTriggers[event] = eventTriggers;
        }
    },
    removeAll: function () {
        for (var key in this._eventTriggers) {
            var triObjArr = this._eventTriggers[key];
            for (var j = 0; j < triObjArr.length; j++) {
                var obj = triObjArr[j];
                obj.removeAll();
            }
        }
        this._eventTriggers = {};
    },
    remove: function (event, Obj) {
        if (Obj)
            return this._removeObj(event, Obj);
        var bRet = false;
        do {
            var triObjects = this._eventTriggers[event];
            if (!triObjects)
                break;
            for (var i = 0; i < triObjects.length; i++) {
                var triObject = triObjects[i];
                if (triObject)
                    triObject.removeAll();
            }
            delete this._eventTriggers[event];
            bRet = true;
        } while (0);
        return bRet;
    },
    _removeObj: function (event, Obj) {
        var bRet = false;
        do
        {
            var triObjects = this._eventTriggers[event];
            if (!triObjects) break;
            for (var i = 0; i < triObjects.length; i++) {
                var triObject = triObjects[i];
                if (triObject && triObject == Obj) {
                    triObject.removeAll();
                    triObjects.splice(i, 1);
                    break;
                }
            }
            bRet = true;
        } while (0);
        return bRet;
    },
    removeTriggerObj: function (id) {
        var obj = this.getTriggerObj(id);
        if (!obj)
            return false;
        var events = obj.getEvents();
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            this.remove(event, obj);
        }
        return true;
    },
    isEmpty: function () {
        return !this._eventTriggers || this._eventTriggers.length <= 0;
    },
    addArmatureMovementCallBack: function (armature, callFunc, target) {
        if (armature == null || target == null || callFunc == null)
            return;
        var locAmd, hasADD = false;
        for (var i = 0; i < this._movementDispatches.length; i++) {
            locAmd = this._movementDispatches[i];
            if (locAmd && locAmd[0] == armature) {
                locAmd.addAnimationEventCallBack(callFunc, target);
                hasADD = true;
            }
        }
        if (!hasADD) {
            var newAmd = new ccs.ArmatureMovementDispatcher();
            armature.getAnimation().setMovementEventCallFunc(newAmd.animationEvent, newAmd);
            newAmd.addAnimationEventCallBack(callFunc, target);
            this._movementDispatches.push([armature, newAmd]);
        }
    },
    removeArmatureMovementCallBack: function (armature, target, callFunc) {
        if (armature == null || target == null || callFunc == null)
            return;
        var locAmd;
        for (var i = 0; i < this._movementDispatches.length; i++) {
            locAmd = this._movementDispatches[i];
            if (locAmd && locAmd[0] == armature)
                locAmd.removeAnimationEventCallBack(callFunc, target);
        }
    },
    removeArmatureAllMovementCallBack: function (armature) {
        if (armature == null)
            return;
        var locAmd;
        for (var i = 0; i < this._movementDispatches.length; i++) {
            locAmd = this._movementDispatches[i];
            if (locAmd && locAmd[0] == armature) {
                this._movementDispatches.splice(i, 1);
                break;
            }
        }
    },
    removeAllArmatureMovementCallBack: function () {
        this._movementDispatches.length = 0;
    },
	version: function () {
		return "1.2.0.0";
	}
};
ccs.ArmatureMovementDispatcher = ccs.Class.extend({
    _mapEventAnimation: null,
    ctor: function () {
        this._mapEventAnimation = [];
    },
    animationEvent: function (armature, movementType, movementID) {
        var locEventAni, locTarget, locFunc;
        for (var i = 0; i < this._mapEventAnimation.length; i++) {
            locEventAni = this._mapEventAnimation[i];
            locTarget = locEventAni[0];
            locFunc = locEventAni[1];
            if (locFunc)
                locFunc.call(locTarget, armature, movementType, movementID);
        }
    },
    addAnimationEventCallBack: function (callFunc, target) {
        this._mapEventAnimation.push([target, callFunc]);
    },
    removeAnimationEventCallBack: function (callFunc, target) {
        var locEventAni;
        for (var i = 0; i < this._mapEventAnimation.length; i++) {
            locEventAni = this._mapEventAnimation[i];
            if (locEventAni[0] == target) {
                this._mapEventAnimation.splice(i, 1);
            }
        }
    }
});
ccs.BaseTriggerCondition = ccs.Class.extend({
    ctor:function(){
    },
    init: function () {
        return true;
    },
    detect: function () {
        return true;
    },
    serialize: function (jsonVal) {
    },
    removeAll: function () {
    }
});
ccs.BaseTriggerAction = ccs.Class.extend({
    ctor:function(){
    },
    init: function () {
        return true;
    },
    done: function () {
    },
    serialize: function (jsonVal) {
    },
    removeAll: function () {
    }
});
ccs.TriggerObj = ccs.Class.extend({
    _cons: null,
    _acts: null,
    _id: 0,
    _enable: true,
    _vInt: null,
    ctor: function () {
        this._id = 0;
        this._enable = true;
    },
    init: function () {
        this._cons = [];
        this._acts = [];
        this._vInt = [];
        return true;
    },
    detect: function () {
        if (!this._enable || this._cons.length == 0) {
            return true;
        }
        var ret = true;
        var obj = null;
        for (var i = 0; i < this._cons.length; i++) {
            obj = this._cons[i];
            if (obj && obj.detect)
                ret = ret && obj.detect();
        }
        return ret;
    },
    done: function () {
        if (!this._enable || this._acts.length == 0)
            return;
        var obj;
        for (var i = 0; i < this._acts.length; i++) {
            obj = this._acts[i];
            if (obj && obj.done)
                obj.done();
        }
    },
    removeAll: function () {
        var obj = null;
        for (var i = 0; i < this._cons.length; i++) {
            obj = this._cons[i];
            if (obj)
                obj.removeAll();
        }
        this._cons = [];
        for (var i = 0; i < this._acts.length; i++) {
            obj = this._acts[i];
            if (obj)
                obj.removeAll();
        }
        this._acts = [];
    },
    serialize: function (jsonVal) {
        this._id = jsonVal["id"] || 0;
        var conditions = jsonVal["conditions"] || [];
        for (var i = 0; i < conditions.length; i++) {
            var subDict = conditions[i];
            var classname = subDict["classname"];
            var con = ccs.objectFactory.createObject(classname);
            if (!con) {
                cc.log("class named classname(" + classname + ") can not implement!");
                continue;
            }
            con.serialize(subDict);
            con.init();
            this._cons.push(con);
        }
        var actions = jsonVal["actions"] || [];
        for (var i = 0; i < actions.length; i++) {
            var subDict = actions[i];
            var classname = subDict["classname"];
            var act = ccs.objectFactory.createObject(classname);
            if (!act) {
                cc.log("class named classname(" + classname + ") can not implement!");
                continue;
            }
            act.serialize(subDict);
            act.init();
            this._acts.push(act);
        }
        var events = jsonVal["events"] || [];
        for (var i = 0; i < events.length; i++) {
            var subDict = events[i];
            var event = subDict["id"];
            if (event < 0) {
                continue;
            }
            this._vInt.push(event);
        }
    },
    getId: function () {
        return this._id;
    },
    setEnable: function (enable) {
        this._enable = enable;
    },
    getEvents: function () {
        return this._vInt;
    }
});
ccs.TriggerObj.create = function () {
    var ret = new ccs.TriggerObj();
    if (ret.init())
        return ret;
    return null;
};
ccs.ButtonReader = {
    getInstance: function(){
        return ccs.ButtonReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.WidgetReader.setPropsFromJsonDictionary.call(this, widget, options);
        var jsonPath = ccs.uiReader.getFilePath();
        var button = widget;
        var scale9Enable = options["scale9Enable"];
        button.setScale9Enabled(scale9Enable);
        var normalDic = options["normalData"], normalType = normalDic["resourceType"];
        switch (normalType) {
            case 0:
                var tp_n = jsonPath;
                var normalFileName = normalDic["path"];
                var normalFileName_tp = (normalFileName && normalFileName !== "") ?
                    tp_n + normalFileName : null;
                button.loadTextureNormal(normalFileName_tp);
                break;
            case 1:
                var normalFileName = normalDic["path"];
                button.loadTextureNormal(normalFileName, 1);
                break;
            default:
                break;
        }
        var pressedDic = options["pressedData"];
        var pressedType = pressedDic["resourceType"];
        switch (pressedType) {
            case 0:
                var tp_p = jsonPath;
                var pressedFileName = pressedDic["path"];
                var pressedFileName_tp = (pressedFileName && pressedFileName !== "") ?
                    tp_p + pressedFileName : null;
                button.loadTexturePressed(pressedFileName_tp);
                break;
            case 1:
                var pressedFileName = pressedDic["path"];
                button.loadTexturePressed(pressedFileName, 1);
                break;
            default:
                break;
        }
        var disabledDic = options["disabledData"];
        var disabledType = disabledDic["resourceType"];
        switch (disabledType){
            case 0:
                var tp_d = jsonPath;
                var disabledFileName = disabledDic["path"];
                var disabledFileName_tp = (disabledFileName && disabledFileName !== "") ?
                    tp_d + disabledFileName : null;
                button.loadTextureDisabled(disabledFileName_tp);
                break;
            case 1:
                var disabledFileName = disabledDic["path"];
                button.loadTextureDisabled(disabledFileName, 1);
                break;
            default:
                break;
        }
        if (scale9Enable) {
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            button.setCapInsets(cc.rect(cx, cy, cw, ch));
            var sw = options["scale9Width"];
            var sh = options["scale9Height"];
            if (sw != null && sh != null)
                button.setSize(cc.size(sw, sh));
        }
        var text = options["text"];
        if (text != null)
            button.setTitleText(text);
        var cr = options["textColorR"];
        var cg = options["textColorG"];
        var cb = options["textColorB"];
        var cri = cr?options["textColorR"]:255;
        var cgi = cg?options["textColorG"]:255;
        var cbi = cb?options["textColorB"]:255;
        button.setTitleColor(cc.color(cri,cgi,cbi));
        var fs = options["fontSize"];
        if (fs != null)
            button.setTitleFontSize(options["fontSize"]);
        var fn = options["fontName"];
        if (fn)
            button.setTitleFontName(options["fontName"]);
        ccs.WidgetReader.setColorPropsFromJsonDictionary.call(this, widget, options);
    }
};
ccs.CheckBoxReader = {
    getInstance: function(){
        return ccs.CheckBoxReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.WidgetReader.setPropsFromJsonDictionary.call(this, widget, options);
        var checkBox = widget;
        var backGroundDic = options["backGroundBoxData"];
        var backGroundType = backGroundDic["resourceType"];
        var backGroundTexturePath = ccs.WidgetReader._getResourcePath(backGroundDic, "path", backGroundType);
        checkBox.loadTextureBackGround(backGroundTexturePath, backGroundType);
        var backGroundSelectedDic = options["backGroundBoxSelectedData"];
        var backGroundSelectedType = backGroundSelectedDic["resourceType"];
        var backGroundSelectedTexturePath = ccs.WidgetReader._getResourcePath(backGroundSelectedDic, "path", backGroundSelectedType);
        if(!backGroundSelectedTexturePath){
            backGroundSelectedType = backGroundType;
            backGroundSelectedTexturePath = backGroundTexturePath;
        }
        checkBox.loadTextureBackGroundSelected(backGroundSelectedTexturePath, backGroundSelectedType);
        var frontCrossDic = options["frontCrossData"];
        var frontCrossType = frontCrossDic["resourceType"];
        var frontCrossFileName = ccs.WidgetReader._getResourcePath(frontCrossDic, "path", frontCrossType);
        checkBox.loadTextureFrontCross(frontCrossFileName, frontCrossType);
        var backGroundDisabledDic = options["backGroundBoxDisabledData"];
        var backGroundDisabledType = backGroundDisabledDic["resourceType"];
        var backGroundDisabledFileName = ccs.WidgetReader._getResourcePath(backGroundDisabledDic, "path", backGroundDisabledType);
        if(!backGroundDisabledFileName){
            backGroundDisabledType = frontCrossType;
            backGroundDisabledFileName = frontCrossFileName;
        }
        checkBox.loadTextureBackGroundDisabled(backGroundDisabledFileName, backGroundDisabledType);
        var frontCrossDisabledDic = options["frontCrossDisabledData"];
        var frontCrossDisabledType = frontCrossDisabledDic["resourceType"];
        var frontCrossDisabledFileName = ccs.WidgetReader._getResourcePath(frontCrossDisabledDic, "path", frontCrossDisabledType);
        checkBox.loadTextureFrontCrossDisabled(frontCrossDisabledFileName, frontCrossDisabledType);
        if (options["selectedState"])
            checkBox.setSelectedState(options["selectedState"]);
        ccs.WidgetReader.setColorPropsFromJsonDictionary.call(this, widget, options);
    }
};
ccs.ImageViewReader = {
    getInstance: function(){
        return ccs.ImageViewReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.WidgetReader.setPropsFromJsonDictionary.call(this, widget, options);
        var jsonPath = ccs.uiReader.getFilePath();
        var imageView = widget;
        var imageFileNameDic = options["fileNameData"], imageFileNameType = imageFileNameDic["resourceType"];
        switch (imageFileNameType){
            case 0:
                var tp_i = jsonPath;
                var imageFileName = imageFileNameDic["path"];
                var imageFileName_tp = null;
                if (imageFileName && imageFileName !== "") {
                    imageFileName_tp = tp_i + imageFileName;
                    imageView.loadTexture(imageFileName_tp);
                }
                break;
            case 1:
                var imageFileName = imageFileNameDic["path"];
                imageView.loadTexture(imageFileName, 1);
                break;
            default:
                break;
        }
        var scale9EnableExist = options["scale9Enable"];
        var scale9Enable = false;
        if (scale9EnableExist)
        {
            scale9Enable = options["scale9Enable"];
        }
        imageView.setScale9Enabled(scale9Enable);
        if (scale9Enable)
        {
            var sw = options["scale9Width"];
            var sh = options["scale9Height"];
            if (sw && sh)
            {
                var swf = options["scale9Width"];
                var shf = options["scale9Height"];
                imageView.setSize(cc.size(swf, shf));
            }
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            imageView.setCapInsets(cc.rect(cx, cy, cw, ch));
        }
        ccs.WidgetReader.setColorPropsFromJsonDictionary.call(this, widget, options);
    }
};
ccs.LabelAtlasReader = {
    getInstance: function(){
        return ccs.LabelAtlasReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.WidgetReader.setPropsFromJsonDictionary.call(this, widget, options);
        var jsonPath = ccs.uiReader.getFilePath();
        var labelAtlas = widget;
        var sv = options["stringValue"];
        var cmf = options["charMapFileData"];
        var iw = options["itemWidth"];
        var ih = options["itemHeight"];
        var scm = options["startCharMap"];
        if (sv != null && cmf && iw != null && ih != null && scm != null){
            var cmftDic = options["charMapFileData"];
            var cmfType = cmftDic["resourceType"];
            switch (cmfType){
                case 0:
                    var tp_c = jsonPath;
                    var cmfPath = cmftDic["path"];
                    var cmf_tp = tp_c + cmfPath;
                    labelAtlas.setProperty(sv, cmf_tp, iw, ih, scm);
                    break;
                case 1:
                    cc.log("Wrong res type of LabelAtlas!");
                    break;
                default:
                    break;
            }
        }
        ccs.WidgetReader.setColorPropsFromJsonDictionary.call(this, widget, options);
    }
};
ccs.LabelBMFontReader = {
    getInstance: function(){
        return ccs.LabelBMFontReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.WidgetReader.setPropsFromJsonDictionary.call(this, widget, options);
        var jsonPath = ccs.uiReader.getFilePath();
        var labelBMFont = widget;
        var cmftDic = options["fileNameData"];
        var cmfType = cmftDic["resourceType"];
        switch (cmfType) {
            case 0:
                var tp_c = jsonPath;
                var cmfPath = cmftDic["path"];
                var cmf_tp = tp_c + cmfPath;
                labelBMFont.setFntFile(cmf_tp);
                break;
            case 1:
                cc.log("Wrong res type of LabelAtlas!");
                break;
            default:
                break;
        }
        var text = options["text"];
        labelBMFont.setString(text);
        ccs.WidgetReader.setColorPropsFromJsonDictionary.call(this, widget, options);
    }
};
ccs.LabelReader = {
    getInstance: function(){
        return ccs.LabelReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.WidgetReader.setPropsFromJsonDictionary.call(this, widget, options);
        var label = widget;
        var touchScaleChangeAble = options["touchScaleEnable"];
        label.setTouchScaleChangeEnabled(touchScaleChangeAble);
        var text = options["text"];
        label.setString(text);
        var fs = options["fontSize"];
        if (fs != null)
        {
            label.setFontSize(options["fontSize"]);
        }
        var fn = options["fontName"];
        if (fn != null)
        {
            label.setFontName(options["fontName"]);
        }
        var aw = options["areaWidth"];
        var ah = options["areaHeight"];
        if (aw != null && ah != null)
        {
            var size = cc.size(options["areaWidth"], options["areaHeight"]);
            label.setTextAreaSize(size);
        }
        var ha = options["hAlignment"];
        if (ha != null)
        {
            label.setTextHorizontalAlignment(options["hAlignment"]);
        }
        var va = options["vAlignment"];
        if (va != null)
        {
            label.setTextVerticalAlignment(options["vAlignment"]);
        }
        ccs.WidgetReader.setColorPropsFromJsonDictionary.call(this, widget, options);
    }
};
ccs.LayoutReader = {
    getInstance: function(){
        return ccs.LayoutReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.WidgetReader.setPropsFromJsonDictionary.call(this, widget, options);
        var jsonPath = ccs.uiReader.getFilePath();
        var panel = widget;
        var w = 0, h = 0;
        var adaptScreen = options["adaptScreen"];
        if (adaptScreen){
            var screenSize = cc.director.getWinSize();
            w = screenSize.width;
            h = screenSize.height;
        }else{
            w = options["width"];
            h = options["height"];
        }
        panel.setSize(cc.size(w, h));
        panel.setClippingEnabled(options["clipAble"]);
        var backGroundScale9Enable = options["backGroundScale9Enable"];
        panel.setBackGroundImageScale9Enabled(backGroundScale9Enable);
        var cr = options["bgColorR"];
        var cg = options["bgColorG"];
        var cb = options["bgColorB"];
        var scr = options["bgStartColorR"];
        var scg = options["bgStartColorG"];
        var scb = options["bgStartColorB"];
        var ecr = options["bgEndColorR"];
        var ecg = options["bgEndColorG"];
        var ecb = options["bgEndColorB"];
        var bgcv1 = options["vectorX"];
        var bgcv2 = options["vectorY"];
        panel.setBackGroundColorVector(cc.p(bgcv1, bgcv2));
        var co = options["bgColorOpacity"];
        var colorType = options["colorType"];
        panel.setBackGroundColorType(colorType);
        panel.setBackGroundColor(cc.color(scr, scg, scb), cc.color(ecr, ecg, ecb));
        panel.setBackGroundColor(cc.color(cr, cg, cb));
        panel.setBackGroundColorOpacity(co);
        var imageFileNameDic = options["backGroundImageData"];
        if(imageFileNameDic){
            var imageFileNameType = imageFileNameDic["resourceType"];
            switch (imageFileNameType)
            {
                case 0:
                {
                    var tp_b = jsonPath;
                    var imageFileName = imageFileNameDic["path"];
                    var imageFileName_tp = (imageFileName && (imageFileName !== "")) ?
                        tp_b + imageFileName :
                        null;
                    panel.setBackGroundImage(imageFileName_tp);
                    break;
                }
                case 1:
                {
                    var imageFileName = imageFileNameDic["path"];
                    panel.setBackGroundImage(imageFileName, 1);
                    break;
                }
                default:
                    break;
            }
        }
        if (backGroundScale9Enable)
        {
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            panel.setBackGroundImageCapInsets(cc.rect(cx, cy, cw, ch));
        }
        panel.setLayoutType(options["layoutType"]);
        ccs.WidgetReader.setColorPropsFromJsonDictionary.call(this, widget, options);
    }
};
ccs.ScrollViewReader = {
    getInstance: function(){
        return ccs.ScrollViewReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.LayoutReader.setPropsFromJsonDictionary.call(this, widget, options);
        var scrollView = widget;
        var innerWidth = options["innerWidth"] || 200;
        var innerHeight = options["innerHeight"] || 200;
        scrollView.setInnerContainerSize(cc.size(innerWidth, innerHeight));
        var direction = options["direction"] || 1;
        scrollView.setDirection(direction);
        scrollView.setBounceEnabled(options["bounceEnable"]);
        ccs.WidgetReader.setColorPropsFromJsonDictionary.call(this, widget, options);
    }
};
ccs.ListViewReader = {
    getInstance: function(){
        return ccs.ListViewReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.ScrollViewReader.setPropsFromJsonDictionary.call(this, widget, options);
        var listView = widget;
        var direction = options["direction"];
        listView.setDirection(direction);
        var gravity = options["gravity"];
        listView.setGravity(gravity);
        var itemMargin = options["itemMargin"];
        listView.setItemsMargin(itemMargin);
    }
};
ccs.LoadingBarReader = {
    getInstance: function(){
        return ccs.LoadingBarReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.WidgetReader.setPropsFromJsonDictionary.call(this, widget, options);
        var jsonPath = ccs.uiReader.getFilePath();
        var loadingBar = widget;
        var imageFileNameDic = options["textureData"];
        var imageFileNameType = imageFileNameDic["resourceType"];
        switch (imageFileNameType){
            case 0:
                var tp_i = jsonPath;
                var imageFileName = imageFileNameDic["path"];
                var imageFileName_tp = null;
                if (imageFileName && (imageFileName !== "")){
                    imageFileName_tp = tp_i + imageFileName;
                    loadingBar.loadTexture(imageFileName_tp);
                }
                break;
            case 1:
                var imageFileName = imageFileNameDic["path"];
                loadingBar.loadTexture(imageFileName, 1);
                break;
            default:
                break;
        }
        var scale9Enable = options["scale9Enable"];
        loadingBar.setScale9Enabled(scale9Enable);
        if (scale9Enable){
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            loadingBar.setCapInsets(cc.rect(cx, cy, cw, ch));
            var width = options["width"];
            var height = options["height"];
            loadingBar.setSize(cc.size(width, height));
        }
        loadingBar.setDirection(options["direction"]);
        loadingBar.setPercent(options["percent"]);
        ccs.WidgetReader.setColorPropsFromJsonDictionary.call(this, widget, options);
    }
};
ccs.PageViewReader = {
    getInstance: function(){
        return ccs.PageViewReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.LayoutReader.setPropsFromJsonDictionary.call(this, widget, options);
    }
};
ccs.SliderReader = {
    getInstance: function(){
        return ccs.SliderReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.WidgetReader.setPropsFromJsonDictionary.call(this, widget, options);
        var jsonPath = ccs.uiReader.getFilePath();
        var slider = widget;
        var tp = jsonPath;
        var barTextureScale9Enable = options["scale9Enable"];
        slider.setScale9Enabled(barTextureScale9Enable);
        var bt = options["barFileName"];
        var barLength = options["length"];
        var imageFileNameDic = options["barFileNameData"];
        var imageFileType = imageFileNameDic["resourceType"];
        var imageFileName = imageFileNameDic["path"];
        var imageFileName_tp;
        if(bt != null){
            if(barTextureScale9Enable){
                switch(imageFileType){
                    case 0:
                        imageFileName_tp = imageFileName ?
                            ( tp + imageFileName ) :
                            null;
                        slider.loadBarTexture(imageFileName_tp);
                        break;
                    case 1:
                        slider.loadBarTexture(imageFileName, 1 );
                        break;
                    default:
                        break;
                }
                slider.setSize(cc.size(barLength, slider.getContentSize().height));
            }
        }else{
            switch(imageFileType){
                case 0:
                    imageFileName_tp = imageFileName ?
                        tp + imageFileName :
                        null;
                        slider.loadBarTexture(imageFileName_tp);
                    break;
                case 1:
                    slider.loadBarTexture(imageFileName, 1 );
                    break;
                default:
                    break;
            }
        }
        var normalDic = options["ballNormalData"];
        var normalType = normalDic["resourceType"];
        var normalFileName = normalDic["path"];
        switch(normalType){
            case 0:
                var normalFileName_tp = normalFileName ?
                    tp + normalFileName :
                    null;
                slider.loadSlidBallTextureNormal(normalFileName_tp);
                break;
            case 1:
                slider.loadSlidBallTextureNormal(normalFileName, 1);
                break;
            default:
                break;
        }
        var pressedDic = options["ballPressedData"];
        var pressedType = pressedDic["resourceType"];
        var pressedFileName = pressedDic["path"];
        if(pressedFileName === null){
            pressedType = normalType;
            pressedFileName = normalFileName;
        }
        switch(pressedType){
            case 0:
                var pressedFileName_tp = pressedFileName ?
                    tp + pressedFileName :
                    null;
                slider.loadSlidBallTexturePressed(pressedFileName_tp);
                break;
            case 1:
                slider.loadSlidBallTexturePressed(pressedFileName, 1);
                break;
            default:
                break;
        }
        var disabledDic = options["ballDisabledData"];
        var disabledType = disabledDic["resourceType"];
        var disabledFileName = disabledDic["path"];
        switch(disabledType){
            case 0:
                var disabledFileName_tp = disabledFileName ?
                    tp + disabledFileName :
                    null;
                slider.loadSlidBallTextureDisabled(disabledFileName_tp);
                break;
            case 1:
                slider.loadSlidBallTextureDisabled(disabledFileName, 1);
                break;
            default:
                break;
        }
        var progressBarDic = options["progressBarData"];
        var progressBarType = progressBarDic["resourceType"];
        var imageProgressFileName = progressBarDic["path"];
        switch (progressBarType){
            case 0:
                var imageProgressFileName_tp = imageProgressFileName ?
                    (tp + imageProgressFileName) :
                    null;
                slider.loadProgressBarTexture(imageProgressFileName_tp);
                break;
            case 1:
                slider.loadProgressBarTexture(imageProgressFileName, 1);
                break;
            default:
                break;
        }
        ccs.WidgetReader.setColorPropsFromJsonDictionary.call(this, widget, options);
    }
};
ccs.TextFieldReader = {
    getInstance: function(){
        return ccs.TextFieldReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        ccs.WidgetReader.setPropsFromJsonDictionary.call(this, widget, options);
        var textField = widget;
        var ph = options["placeHolder"];
        if(ph)
            textField.setPlaceHolder(ph);
        textField.setString(options["text"]);
        var fs = options["fontSize1"];
        if(fs)
            textField.setFontSize(fs);
        var fn = options["fontName"];
        if(fn)
            textField.setFontName(fn);
        var tsw = options["touchSizeWidth"];
        var tsh = options["touchSizeHeight"];
        if(tsw && tsh)
            textField.setTouchSize(tsw, tsh);
        var dw = options["width"];
        var dh = options["height"];
        if(dw > 0 || dh > 0){
        }
        var maxLengthEnable = options["maxLengthEnable"];
        textField.setMaxLengthEnabled(maxLengthEnable);
        if(maxLengthEnable){
            var maxLength = options["maxLength"];
            textField.setMaxLength(maxLength);
        }
        var passwordEnable = options["passwordEnable"];
        textField.setPasswordEnabled(passwordEnable);
        if(passwordEnable)
            textField.setPasswordStyleText(options["passwordStyleText"]);
        var aw = options["areaWidth"];
        var ah = options["areaHeight"];
        if(aw && ah){
            var size = cc.size(aw, ah);
            textField.setTextAreaSize(size);
        }
        var ha = options["hAlignment"];
        if(ha)
            textField.setTextHorizontalAlignment(ha);
        var va = options["vAlignment"];
        if(va)
            textField.setTextVerticalAlignment(va);
        ccs.WidgetReader.setColorPropsFromJsonDictionary.call(this, widget, options);
    }
};
ccs.WidgetReaderProtocol = ccs.Class.extend({
    setPropsFromJsonDictionary: function(widget, options){
    }
});
ccs.WidgetReader = {
    getInstance: function(){
        return ccs.WidgetReader;
    },
    setPropsFromJsonDictionary: function(widget, options){
        var ignoreSizeExsit = options["ignoreSize"];
        if(ignoreSizeExsit != null)
            widget.ignoreContentAdaptWithSize(ignoreSizeExsit);
        widget.setSizeType(options["sizeType"]);
        widget.setPositionType(options["positionType"]);
        widget.setSizePercent(cc.p(options["sizePercentX"], options["sizePercentY"]));
        widget.setPositionPercent(cc.p(options["positionPercentX"], options["positionPercentY"]));
        var w = 0, h = 0;
        var adaptScreen = options["adaptScreen"];
        if (adaptScreen) {
            var screenSize = cc.director.getWinSize();
            w = screenSize.width;
            h = screenSize.height;
        } else {
            w = options["width"];
            h = options["height"];
        }
        widget.setContentSize(w, h);
        widget.setTag(options["tag"]);
        widget.setActionTag(options["actiontag"]);
        widget.setTouchEnabled(options["touchAble"]);
        var name = options["name"];
        var widgetName = name ? name : "default";
        widget.setName(widgetName);
        var x = options["x"];
        var y = options["y"];
        widget.setPosition(x, y);
        var sx = options["scaleX"] || 1;
        widget.setScaleX(sx);
        var sy = options["scaleY"] || 1;
        widget.setScaleY(sy);
        var rt = options["rotation"] || 0;
        widget.setRotation(rt);
        var vb = options["visible"] || false;
        if(vb != null)
            widget.setVisible(vb);
        widget.setLocalZOrder(options["ZOrder"]);
        var layout = options["layoutParameter"];
        if(layout != null){
            var layoutParameterDic = options["layoutParameter"];
            var paramType = layoutParameterDic["type"];
            var parameter = null;
            switch(paramType){
                case 0:
                    break;
                case 1:
                    parameter = new ccui.LinearLayoutParameter();
                    var gravity = layoutParameterDic["gravity"];
                    parameter.setGravity(gravity);
                    break;
                case 2:
                    parameter = new ccui.RelativeLayoutParameter();
                    var rParameter = parameter;
                    var relativeName = layoutParameterDic["relativeName"];
                    rParameter.setRelativeName(relativeName);
                    var relativeToName = layoutParameterDic["relativeToName"];
                    rParameter.setRelativeToWidgetName(relativeToName);
                    var align = layoutParameterDic["align"];
                    rParameter.setAlign(align);
                    break;
                default:
                    break;
            }
            if(parameter != null){
                var mgl = layoutParameterDic["marginLeft"]||0;
                var mgt = layoutParameterDic["marginTop"]||0;
                var mgr = layoutParameterDic["marginRight"]||0;
                var mgb = layoutParameterDic["marginDown"]||0;
                parameter.setMargin(mgl, mgt, mgr, mgb);
                widget.setLayoutParameter(parameter);
            }
        }
    },
    setColorPropsFromJsonDictionary: function(widget, options){
        var op = options["opacity"];
        if(op != null)
            widget.setOpacity(op);
        var colorR = options["colorR"];
        var colorG = options["colorG"];
        var colorB = options["colorB"];
        widget.setColor(cc.color((colorR == null) ? 255 : colorR, (colorG == null) ? 255 : colorG, (colorB == null) ? 255 : colorB));
        ccs.WidgetReader._setAnchorPointForWidget(widget, options);
        widget.setFlippedX(options["flipX"]);
        widget.setFlippedY(options["flipY"]);
    },
    _setAnchorPointForWidget: function(widget, options){
        var isAnchorPointXExists = options["anchorPointX"];
        var anchorPointXInFile;
        if (isAnchorPointXExists != null)
            anchorPointXInFile = options["anchorPointX"];
        else
            anchorPointXInFile = widget.getAnchorPoint().x;
        var isAnchorPointYExists = options["anchorPointY"];
        var anchorPointYInFile;
        if (isAnchorPointYExists != null)
            anchorPointYInFile = options["anchorPointY"];
        else
            anchorPointYInFile = widget.getAnchorPoint().y;
        if (isAnchorPointXExists != null || isAnchorPointYExists != null)
            widget.setAnchorPoint(cc.p(anchorPointXInFile, anchorPointYInFile));
    },
    _getResourcePath: function(dict, key, texType){
        var imageFileName = dict[key];
        var imageFileName_tp;
        if (null != imageFileName) {
            if (texType == 0)
                imageFileName_tp = ccs.uiReader.getFilePath() + imageFileName;
            else if(texType == 1)
                imageFileName_tp = imageFileName;
            else
                cc.assert(0, "invalid TextureResType!!!");
        }
        return imageFileName_tp;
    }
};
(function(){
    var factoryCreate = ccs.objectFactory;
    factoryCreate.registerType({_className:"ButtonReader", _fun: ccs.ButtonReader});
    factoryCreate.registerType({_className: "CheckBoxReader", _fun: ccs.CheckBoxReader});
    factoryCreate.registerType({_className: "SliderReader", _fun: ccs.SliderReader});
    factoryCreate.registerType({_className: "ImageViewReader", _fun: ccs.ImageViewReader});
    factoryCreate.registerType({_className: "LoadingBarReader", _fun: ccs.LoadingBarReader});
    factoryCreate.registerType({_className: "TextAtlasReader", _fun: ccs.LabelAtlasReader});
    factoryCreate.registerType({_className: "TextReader", _fun: ccs.LabelReader});
    factoryCreate.registerType({_className: "TextBMFontReader", _fun: ccs.LabelBMFontReader});
    factoryCreate.registerType({_className: "TextFieldReader", _fun: ccs.TextFieldReader});
    factoryCreate.registerType({_className: "LayoutReader", _fun: ccs.LayoutReader});
    factoryCreate.registerType({_className: "PageViewReader", _fun: ccs.PageViewReader});
    factoryCreate.registerType({_className: "ScrollViewReader", _fun: ccs.ScrollViewReader});
    factoryCreate.registerType({_className: "ListViewReader", _fun: ccs.ListViewReader});
    factoryCreate.registerType({_className: "WidgetReader", _fun: ccs.WidgetReader});
    factoryCreate.registerType({_className: "Button", _fun: ccui.Button});
    factoryCreate.registerType({_className: "CheckBox", _fun: ccui.CheckBox});
    factoryCreate.registerType({_className: "ImageView", _fun: ccui.ImageView});
    factoryCreate.registerType({_className: "Text", _fun: ccui.Text});
    factoryCreate.registerType({_className: "TextAtlas", _fun: ccui.TextAtlas});
    factoryCreate.registerType({_className: "TextBMFont", _fun: ccui.TextBMFont});
    factoryCreate.registerType({_className: "LoadingBar", _fun: ccui.LoadingBar});
    factoryCreate.registerType({_className: "Slider", _fun: ccui.Slider});
    factoryCreate.registerType({_className: "TextField", _fun: ccui.TextField});
    factoryCreate.registerType({_className: "Layout", _fun: ccui.Layout});
    factoryCreate.registerType({_className: "ListView", _fun: ccui.ListView});
    factoryCreate.registerType({_className: "PageView", _fun: ccui.PageView});
    factoryCreate.registerType({_className: "ScrollView", _fun: ccui.ScrollView});
})();
ccs.uiReader = {
    _filePath: "",
    _olderVersion: false,
    _fileDesignSizes: {},
    _mapObject: {},
    _mapParseSelector: {},
    getVersionInteger: function (str) {
        if(!str)
            return 0;
        var strVersion = str;
        var versionLength = strVersion.length;
        if (versionLength < 7) {
            return 0;
        }
        var pos = strVersion.indexOf(".");
        var t = strVersion.substr(0, pos);
        strVersion = strVersion.substr(pos + 1, versionLength - 1);
        pos = strVersion.indexOf(".");
        var h = strVersion.substr(0, pos);
        strVersion = strVersion.substr(pos + 1, versionLength - 1);
        pos = strVersion.indexOf(".");
        var te = strVersion.substr(0, pos);
        strVersion = strVersion.substr(pos + 1, versionLength - 1);
        pos = strVersion.indexOf(".");
        var s = (pos == -1) ? strVersion : strVersion.substr(0, pos);
        var it = parseInt(t);
        var ih = parseInt(h);
        var ite = parseInt(te);
        var is = parseInt(s);
        return (it * 1000 + ih * 100 + ite * 10 + is);
    },
    storeFileDesignSize: function (fileName, size) {
        this._fileDesignSizes[fileName] = size;
    },
    getFileDesignSize: function (fileName) {
        return this._fileDesignSizes[fileName];
    },
    widgetFromJsonFile: function (fileName) {
        var jsonDict = cc.loader.getRes(fileName);
        if(!jsonDict) throw "Please load the resource first : " + fileName;
        var tempFilePath = cc.path.dirname(fileName);
        this._filePath = tempFilePath == "" ? tempFilePath : tempFilePath + "/";
        var fileVersion = jsonDict["version"];
        var pReader, widget;
        var versionInteger = this.getVersionInteger(fileVersion);
        if (fileVersion) {
            if (versionInteger < 250) {
                pReader = new ccs.WidgetPropertiesReader0250();
                widget = pReader.createWidget(jsonDict, this._filePath, fileName);
            } else {
                pReader = new ccs.WidgetPropertiesReader0300();
                widget = pReader.createWidget(jsonDict, this._filePath, fileName);
            }
        } else {
            pReader = new ccs.WidgetPropertiesReader0250();
            widget = pReader.createWidget(jsonDict, this._filePath, fileName);
        }
        if (!fileVersion || versionInteger < 250) {
            this._olderVersion = true;
        }
        jsonDict = null;
        return widget;
    },
    clear: function () {
        this._filePath = "";
        this._olderVersion = false;
        this._fileDesignSizes = {};
    },
    registerTypeAndCallBack: function(classType, ins, object, callback){
        var factoryCreate = ccs.objectFactory;
        var t = new ccs.TInfo(classType, ins);
        factoryCreate.registerType(t);
        if(object)
            this._mapObject[classType] = object;
        if(callback)
            this._mapParseSelector[classType] = callback;
    },
    getFilePath: function(){
        return this._filePath;
    },
    setFilePath: function(path){
        this._filePath = path;
    },
    getParseObjectMap: function(){
        return this._mapObject;
    },
    getParseCallBackMap: function(){
        return this._mapParseSelector;
    }
};
ccs.WidgetPropertiesReader = ccs.Class.extend({
    _filePath: "",
    createWidget: function (jsonDict, fullPath, fileName) {
    },
    widgetFromJsonDictionary: function (data) {
    },
    _createGUI: function(className){
        var name = this._getGUIClassName(className);
        return ccs.objectFactory.createObject(name);
    },
    _getGUIClassName: function(name){
        var convertedClassName = name;
        if (name == "Panel")
            convertedClassName = "Layout";
        else if (name == "TextArea")
            convertedClassName = "Text";
        else if (name == "TextButton")
            convertedClassName = "Button";
        else if (name == "Label")
            convertedClassName = "Text";
        else if (name == "LabelAtlas")
            convertedClassName = "TextAtlas";
        else if (name == "LabelBMFont")
            convertedClassName = "TextBMFont";
        return convertedClassName;
    },
    _getWidgetReaderClassName: function(className){
        var readerName = className;
        if (readerName == "Panel")
            readerName = "Layout";
        else if (readerName == "TextArea")
            readerName = "Text";
        else if (readerName == "TextButton")
            readerName = "Button";
        else if (readerName == "Label")
            readerName = "Text";
        else if (readerName == "LabelAtlas")
            readerName = "TextAtlas";
        else if (readerName == "LabelBMFont")
            readerName = "TextBMFont";
        readerName += "Reader";
        return readerName;
    },
    _getWidgetReaderClassNameFromWidget: function(widget){
        var readerName = "";
        if (widget instanceof ccui.Button)
            readerName = "ButtonReader";
        else if (widget instanceof ccui.CheckBox)
            readerName = "CheckBoxReader";
        else if (widget instanceof ccui.ImageView)
            readerName = "ImageViewReader";
        else if (widget instanceof ccui.TextAtlas)
            readerName = "TextAtlasReader";
        else if (widget instanceof ccui.TextBMFont)
            readerName = "TextBMFontReader";
        else if (widget instanceof ccui.Text)
            readerName = "TextReader";
        else if (widget instanceof ccui.LoadingBar)
            readerName = "LoadingBarReader";
        else if (widget instanceof ccui.Slider)
            readerName = "SliderReader";
        else if (widget instanceof ccui.TextField)
            readerName = "TextFieldReader";
        else if (widget instanceof ccui.ListView)
            readerName = "ListViewReader";
        else if (widget instanceof ccui.PageView)
            readerName = "PageViewReader";
        else if (widget instanceof ccui.ScrollView)
            readerName = "ScrollViewReader";
        else if (widget instanceof ccui.Layout)
            readerName = "LayoutReader";
        else if (widget instanceof ccui.Widget)
            readerName = "WidgetReader";
        return readerName;
    },
    _createWidgetReaderProtocol: function(className){
        return ccs.objectFactory.createObject(className);
    }
});
ccs.WidgetPropertiesReader0250 = ccs.WidgetPropertiesReader.extend({
    createWidget: function (jsonDict, fullPath, fileName) {
        this._filePath = fullPath == "" ? fullPath : cc.path.join(fullPath, "/");
        var textures = jsonDict["textures"];
        for (var i = 0; i < textures.length; i++) {
            var file = textures[i];
            var tp = fullPath;
            tp += file;
            cc.spriteFrameCache.addSpriteFrames(tp);
        }
        var fileDesignWidth = jsonDict["designWidth"];
        var fileDesignHeight = jsonDict["designHeight"];
        if (fileDesignWidth <= 0 || fileDesignHeight <= 0) {
            cc.log("Read design size error!");
            var winSize = cc.director.getWinSize();
            ccs.uiReader.storeFileDesignSize(fileName, winSize);
        } else
            ccs.uiReader.storeFileDesignSize(fileName, cc.size(fileDesignWidth, fileDesignHeight));
        var widgetTree = jsonDict["widgetTree"];
        var widget = this.widgetFromJsonDictionary(widgetTree);
        var size = widget.getContentSize();
        if (size.width == 0 && size.height == 0)
            widget.setSize(cc.size(fileDesignWidth, fileDesignHeight));
        var actions = jsonDict["animation"];
        ccs.actionManager.initWithDictionary(fileName, actions, widget);
        widgetTree = null;
        actions = null;
        return widget;
    },
    widgetFromJsonDictionary: function (data) {
        var widget = null;
        var classname = data["classname"];
        var uiOptions = data["options"];
        if (classname == "Button") {
            widget = ccui.Button.create();
            this.setPropsForButtonFromJsonDictionary(widget, uiOptions);
        } else if (classname == "CheckBox") {
            widget = ccui.CheckBox.create();
            this.setPropsForCheckBoxFromJsonDictionary(widget, uiOptions);
        } else if (classname == "Label") {
            widget = ccui.Text.create();
            this.setPropsForLabelFromJsonDictionary(widget, uiOptions);
        } else if (classname == "LabelAtlas") {
            widget = ccui.TextAtlas.create();
            this.setPropsForLabelAtlasFromJsonDictionary(widget, uiOptions);
        } else if (classname == "LoadingBar") {
            widget = ccui.LoadingBar.create();
            this.setPropsForLoadingBarFromJsonDictionary(widget, uiOptions);
        } else if (classname == "ScrollView") {
            widget = ccui.ScrollView.create();
            this.setPropsForScrollViewFromJsonDictionary(widget, uiOptions);
        } else if (classname == "TextArea") {
            widget = ccui.Text.create();
            this.setPropsForLabelFromJsonDictionary(widget, uiOptions);
        } else if (classname == "TextButton") {
            widget = ccui.Button.create();
            this.setPropsForButtonFromJsonDictionary(widget, uiOptions);
        } else if (classname == "TextField") {
            widget = ccui.TextField.create();
            this.setPropsForTextFieldFromJsonDictionary(widget, uiOptions);
        } else if (classname == "ImageView") {
            widget = ccui.ImageView.create();
            this.setPropsForImageViewFromJsonDictionary(widget, uiOptions);
        } else if (classname == "Panel") {
            widget = ccui.Layout.create();
            this.setPropsForLayoutFromJsonDictionary(widget, uiOptions);
        } else if (classname == "Slider") {
            widget = ccui.Slider.create();
            this.setPropsForSliderFromJsonDictionary(widget, uiOptions);
        } else if (classname == "LabelBMFont") {
            widget = ccui.TextBMFont.create();
            this.setPropsForLabelBMFontFromJsonDictionary(widget, uiOptions);
        } else if (classname == "DragPanel") {
            widget = ccui.ScrollView.create();
            this.setPropsForScrollViewFromJsonDictionary(widget, uiOptions);
        }
        var children = data["children"];
        for (var i = 0; i < children.length; i++) {
            var subData = children[i];
            var child = this.widgetFromJsonDictionary(subData);
            if (child)
                widget.addChild(child);
            subData = null;
        }
        uiOptions = null;
        return widget;
    },
    setPropsForWidgetFromJsonDictionary: function (widget, options) {
        if (options["ignoreSize"] !== undefined)
            widget.ignoreContentAdaptWithSize(options["ignoreSize"]);
        var w = options["width"];
        var h = options["height"];
        widget.setSize(cc.size(w, h));
        widget.setTag(options["tag"]);
        widget.setActionTag(options["actiontag"]);
        widget.setTouchEnabled(options["touchAble"]);
        var name = options["name"];
        var widgetName = name ? name : "default";
        widget.setName(widgetName);
        var x = options["x"];
        var y = options["y"];
        widget.setPosition(cc.p(x, y));
        if (options["scaleX"] !== undefined) {
            widget.setScaleX(options["scaleX"]);
        }
        if (options["scaleY"] !== undefined) {
            widget.setScaleY(options["scaleY"]);
        }
        if (options["rotation"] !== undefined) {
            widget.setRotation(options["rotation"]);
        }
        if (options["visible"] !== undefined) {
            widget.setVisible(options["visible"]);
        }
        var z = options["ZOrder"];
        widget.setLocalZOrder(z);
    },
    setPropsForAllWidgetFromJsonDictionary: function(){},
    setPropsForAllCustomWidgetFromJsonDictionary: function(){},
    setColorPropsForWidgetFromJsonDictionary: function (widget, options) {
        if (options["opacity"] !== undefined) {
            widget.setOpacity(options["opacity"]);
        }
        var colorR = options["colorR"] !== undefined ? options["colorR"] : 255;
        var colorG = options["colorG"] !== undefined ? options["colorG"] : 255;
        var colorB = options["colorB"] !== undefined ? options["colorB"] : 255;
        widget.setColor(cc.color(colorR, colorG, colorB));
        var apx = options["anchorPointX"] !== undefined ? options["anchorPointX"] : ((widget.getWidgetType() == ccui.Widget.TYPE_WIDGET) ? 0.5 : 0);
        var apy = options["anchorPointY"] !== undefined ? options["anchorPointY"] : ((widget.getWidgetType() == ccui.Widget.TYPE_WIDGET) ? 0.5 : 0);
        widget.setAnchorPoint(apx, apy);
        var flipX = options["flipX"];
        var flipY = options["flipY"];
        widget.setFlippedX(flipX);
        widget.setFlippedY(flipY);
    },
    setPropsForButtonFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var button = widget;
        var scale9Enable = options["scale9Enable"];
        button.setScale9Enabled(scale9Enable);
        var normalFileName = options["normal"];
        var pressedFileName = options["pressed"];
        var disabledFileName = options["disabled"];
        var normalFileName_tp = normalFileName ? this._filePath + normalFileName : null;
        var pressedFileName_tp = pressedFileName ? this._filePath + pressedFileName : null;
        var disabledFileName_tp = disabledFileName ? this._filePath + disabledFileName : null;
        var useMergedTexture = options["useMergedTexture"];
        if (scale9Enable) {
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            if (useMergedTexture)
                button.loadTextures(normalFileName, pressedFileName, disabledFileName, ccui.Widget.PLIST_TEXTURE);
            else
                button.loadTextures(normalFileName_tp, pressedFileName_tp, disabledFileName_tp);
            if (options["scale9Width"] !== undefined && options["scale9Height"] !== undefined) {
                var swf = options["scale9Width"];
                var shf = options["scale9Height"];
                button.setSize(cc.size(swf, shf));
            }
        } else {
            if (useMergedTexture)
                button.loadTextures(normalFileName, pressedFileName, disabledFileName, ccui.Widget.PLIST_TEXTURE);
            else
                button.loadTextures(normalFileName_tp, pressedFileName_tp, disabledFileName_tp);
        }
        if (options["text"] !== undefined) {
            var text = options["text"] || "";
            if (text)
                button.setTitleText(text);
        }
        if (options["fontSize"] !== undefined) {
            button.setTitleFontSize(options["fontSize"]);
        }
        if (options["fontName"] !== undefined) {
            button.setTitleFontName(options["fontName"]);
        }
        var cr = options["textColorR"] !== undefined ? options["textColorR"] : 255;
        var cg = options["textColorG"] !== undefined ? options["textColorG"] : 255;
        var cb = options["textColorB"] !== undefined ? options["textColorB"] : 255;
        var tc = cc.color(cr, cg, cb);
        button.setTitleColor(tc);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForCheckBoxFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var checkBox = widget;
        var backGroundFileName = options["backGroundBox"];
        var backGroundSelectedFileName = options["backGroundBoxSelected"];
        var frontCrossFileName = options["frontCross"];
        var backGroundDisabledFileName = options["backGroundBoxDisabled"];
        var frontCrossDisabledFileName = options["frontCrossDisabled"];
        var locFilePath = this._filePath;
        var backGroundFileName_tp = backGroundFileName ? locFilePath + backGroundFileName : null;
        var backGroundSelectedFileName_tp = backGroundSelectedFileName ? locFilePath + backGroundSelectedFileName : null;
        var frontCrossFileName_tp = frontCrossFileName ? locFilePath + frontCrossFileName : null;
        var backGroundDisabledFileName_tp = backGroundDisabledFileName ? locFilePath + backGroundDisabledFileName : null;
        var frontCrossDisabledFileName_tp = frontCrossDisabledFileName ? locFilePath + frontCrossDisabledFileName : null;
        var useMergedTexture = options["useMergedTexture"];
        if (useMergedTexture) {
            checkBox.loadTextures(backGroundFileName, backGroundSelectedFileName, frontCrossFileName, backGroundDisabledFileName, frontCrossDisabledFileName, ccui.Widget.PLIST_TEXTURE);
        }
        else {
            checkBox.loadTextures(backGroundFileName_tp, backGroundSelectedFileName_tp, frontCrossFileName_tp, backGroundDisabledFileName_tp, frontCrossDisabledFileName_tp);
        }
        checkBox.setSelectedState(options["selectedState"] || false);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForImageViewFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var imageView = widget;
        var imageFileName = options["fileName"];
        var scale9Enable = options["scale9Enable"] || false;
        imageView.setScale9Enabled(scale9Enable);
        var tp_i = this._filePath;
        var imageFileName_tp = null;
        if (imageFileName)
            imageFileName_tp = tp_i + imageFileName;
        var useMergedTexture = options["useMergedTexture"];
        if (scale9Enable) {
            if (useMergedTexture) {
                imageView.loadTexture(imageFileName, ccui.Widget.PLIST_TEXTURE);
            }
            else {
                imageView.loadTexture(imageFileName_tp);
            }
            if (options["scale9Width"] !== undefined && options["scale9Height"] !== undefined) {
                var swf = options["scale9Width"];
                var shf = options["scale9Height"];
                imageView.setSize(cc.size(swf, shf));
            }
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            imageView.setCapInsets(cc.rect(cx, cy, cw, ch));
        }
        else {
            if (useMergedTexture) {
                imageView.loadTexture(imageFileName, ccui.Widget.PLIST_TEXTURE);
            }
            else {
                imageView.loadTexture(imageFileName_tp);
            }
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForLabelFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var label = widget;
        var touchScaleChangeAble = options["touchScaleEnable"];
        label.setTouchScaleChangeEnabled(touchScaleChangeAble);
        var text = options["text"];
        label.setString(text);
        if (options["fontSize"] !== undefined) {
            label.setFontSize(options["fontSize"]);
        }
        if (options["fontName"] !== undefined) {
            label.setFontName(options["fontName"]);
        }
        if (options["areaWidth"] !== undefined && options["areaHeight"] !== undefined) {
            var size = cc.size(options["areaWidth"], options["areaHeight"]);
            label.setTextAreaSize(size);
        }
        if (options["hAlignment"]) {
            label.setTextHorizontalAlignment(options["hAlignment"]);
        }
        if (options["vAlignment"]) {
            label.setTextVerticalAlignment(options["vAlignment"]);
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForLabelAtlasFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var labelAtlas = widget;
        var cmft = options["charMapFileData"], svValue = options["stringValue"], iwValue = options["itemWidth"];
        var ihValue = options["itemHeight"], scmValue = options["startCharMap"];
        var sv = (svValue !== undefined);
        var cmf = (cmft !== undefined);
        var iw = (iwValue !== undefined);
        var ih = (ihValue !== undefined);
        var scm = (scmValue !== undefined);
        if (sv && cmf && iw && ih && scm && cmft) {
            var cmf_tp = this._filePath + cmft;
            labelAtlas.setProperty(svValue, cmf_tp, iwValue, ihValue, scmValue);
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForLayoutFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var containerWidget = widget;
        if (!(containerWidget instanceof ccui.ScrollView) && !(containerWidget instanceof ccui.ListView)) {
            containerWidget.setClippingEnabled(options["clipAble"]);
        }
        var panel = widget;
        var backGroundScale9Enable = options["backGroundScale9Enable"];
        panel.setBackGroundImageScale9Enabled(backGroundScale9Enable);
        var cr = options["bgColorR"];
        var cg = options["bgColorG"];
        var cb = options["bgColorB"];
        var scr = options["bgStartColorR"];
        var scg = options["bgStartColorG"];
        var scb = options["bgStartColorB"];
        var ecr = options["bgEndColorR"];
        var ecg = options["bgEndColorG"];
        var ecb = options["bgEndColorB"];
        var bgcv1 = options["vectorX"];
        var bgcv2 = options["vectorY"];
        panel.setBackGroundColorVector(cc.p(bgcv1, bgcv2));
        var co = options["bgColorOpacity"];
        var colorType = options["colorType"];
        panel.setBackGroundColorType(colorType);
        panel.setBackGroundColor(cc.color(scr, scg, scb), cc.color(ecr, ecg, ecb));
        panel.setBackGroundColor(cc.color(cr, cg, cb));
        panel.setBackGroundColorOpacity(co);
        var imageFileName = options["backGroundImage"];
        var imageFileName_tp = imageFileName ? this._filePath + imageFileName : null;
        var useMergedTexture = options["useMergedTexture"];
        if (useMergedTexture) {
            panel.setBackGroundImage(imageFileName, ccui.Widget.PLIST_TEXTURE);
        }
        else {
            panel.setBackGroundImage(imageFileName_tp);
        }
        if (backGroundScale9Enable) {
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            panel.setBackGroundImageCapInsets(cc.rect(cx, cy, cw, ch));
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForScrollViewFromJsonDictionary: function (widget, options) {
        this.setPropsForLayoutFromJsonDictionary(widget, options);
        var scrollView = widget;
        var innerWidth = options["innerWidth"];
        var innerHeight = options["innerHeight"];
        scrollView.setInnerContainerSize(cc.size(innerWidth, innerHeight));
        var direction = options["direction"];
        scrollView.setDirection(direction);
        scrollView.setBounceEnabled(options["bounceEnable"]);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForContainerWidgetFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var containerWidget = widget;
        if (containerWidget instanceof ccui.ScrollView ||
            containerWidget instanceof ccui.ListView) {
            containerWidget.setClippingEnabled(options["clipAble"]);
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForSliderFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var slider = widget;
        var barTextureScale9Enable = options["barTextureScale9Enable"] || false;
        slider.setScale9Enabled(barTextureScale9Enable);
        var barLength = options["length"];
        var useMergedTexture = options["useMergedTexture"];
        var bt = (options["barFileName"] !== undefined);
        if (bt) {
            if (barTextureScale9Enable) {
                var imageFileName = options["barFileName"];
                var imageFileName_tp = imageFileName ? this._filePath + imageFileName : null;
                if (useMergedTexture) {
                    slider.loadBarTexture(imageFileName, ccui.Widget.PLIST_TEXTURE);
                } else {
                    slider.loadBarTexture(imageFileName_tp);
                }
                slider.setSize(cc.size(barLength, slider.getContentSize().height));
            } else {
                var imageFileName = options["barFileName"];
                var imageFileName_tp = imageFileName ? this._filePath + imageFileName : null;
                if (useMergedTexture) {
                    slider.loadBarTexture(imageFileName, ccui.Widget.PLIST_TEXTURE);
                } else {
                    slider.loadBarTexture(imageFileName_tp);
                }
            }
        }
        var normalFileName = options["ballNormal"];
        var pressedFileName = options["ballPressed"];
        var disabledFileName = options["ballDisabled"];
        var normalFileName_tp = normalFileName ? this._filePath + normalFileName : null;
        var pressedFileName_tp = pressedFileName ? this._filePath + pressedFileName : null;
        var disabledFileName_tp = disabledFileName ? this._filePath + disabledFileName : null;
        if (useMergedTexture) {
            slider.loadSlidBallTextures(normalFileName, pressedFileName, disabledFileName, ccui.Widget.PLIST_TEXTURE);
        } else {
            slider.loadSlidBallTextures(normalFileName_tp, pressedFileName_tp, disabledFileName_tp);
        }
        slider.setPercent(options["percent"]);
        var imageFileName = options["progressBarFileName"];
        var imageFileName_tp = imageFileName ? this._filePath + imageFileName : null;
        if (useMergedTexture) {
            slider.loadProgressBarTexture(imageFileName, ccui.Widget.PLIST_TEXTURE);
        } else {
            slider.loadProgressBarTexture(imageFileName_tp);
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForTextAreaFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var textArea = widget;
        textArea.setString(options["text"]);
        if (options["fontSize"] !== undefined) {
            textArea.setFontSize(options["fontSize"]);
        }
        var cr = options["colorR"];
        var cg = options["colorG"];
        var cb = options["colorB"];
        textArea.setColor(cc.color((cr == null) ? 255 : cr, (cg == null) ? 255 : cg, (cb == null) ? 255 : cb));
        textArea.setFontName(options["fontName"]);
        if (options["areaWidth"] !== undefined && options["areaHeight"] !== undefined) {
            var size = cc.size(options["areaWidth"], options["areaHeight"]);
            textArea.setTextAreaSize(size);
        }
        if (options["hAlignment"]) {
            textArea.setTextHorizontalAlignment(options["hAlignment"]);
        }
        if (options["vAlignment"]) {
            textArea.setTextVerticalAlignment(options["vAlignment"]);
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForTextButtonFromJsonDictionary: function (widget, options) {
        this.setPropsForButtonFromJsonDictionary(widget, options);
        var textButton = widget;
        textButton.setTitleText(options["text"] || "");
        var cri = options["textColorR"] !== undefined ? options["textColorR"] : 255;
        var cgi = options["textColorG"] !== undefined ? options["textColorG"] : 255;
        var cbi = options["textColorB"] !== undefined ? options["textColorB"] : 255;
        textButton.setTitleColor(cc.color(cri, cgi, cbi));
        if (options["fontSize"] !== undefined)
            textButton.setTitleFontSize(options["fontSize"]);
        if (options["fontName"] !== undefined)
            textButton.setTitleFontName(options["fontName"]);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForTextFieldFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var textField = widget;
        if (options["placeHolder"] !== undefined) {
            textField.setPlaceHolder(options["placeHolder"]);
        }
        textField.setString(options["text"]);
        if (options["fontSize"] !== undefined) {
            textField.setFontSize(options["fontSize"]);
        }
        if (options["fontName"] !== undefined) {
            textField.setFontName(options["fontName"]);
        }
        if (options["touchSizeWidth"] !== undefined && options["touchSizeHeight"] !== undefined) {
            textField.setTouchSize(cc.size(options["touchSizeWidth"], options["touchSizeHeight"]));
        }
        var dw = options["width"];
        var dh = options["height"];
        if (dw > 0.0 || dh > 0.0) {
        }
        var maxLengthEnable = options["maxLengthEnable"];
        textField.setMaxLengthEnabled(maxLengthEnable);
        if (maxLengthEnable) {
            var maxLength = options["maxLength"];
            textField.setMaxLength(maxLength);
        }
        var passwordEnable = options["passwordEnable"];
        textField.setPasswordEnabled(passwordEnable);
        if (passwordEnable) {
            textField.setPasswordStyleText(options["passwordStyleText"]);
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForLoadingBarFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var loadingBar = widget;
        var useMergedTexture = options["useMergedTexture"];
        var imageFileName = options["texture"];
        var imageFileName_tp = imageFileName ? this._filePath + imageFileName : null;
        if (useMergedTexture) {
            loadingBar.loadTexture(imageFileName, ccui.Widget.PLIST_TEXTURE);
        } else {
            loadingBar.loadTexture(imageFileName_tp);
        }
        loadingBar.setDirection(options["direction"]);
        loadingBar.setPercent(options["percent"]);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForListViewFromJsonDictionary: function (widget, options) {
        this.setPropsForLayoutFromJsonDictionary(widget, options);
    },
    setPropsForPageViewFromJsonDictionary: function (widget, options) {
        this.setPropsForLayoutFromJsonDictionary(widget, options);
    },
    setPropsForLabelBMFontFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var labelBMFont = widget;
        var cmft = options["fileName"];
        var cmf_tp = this._filePath + cmft;
        labelBMFont.setFntFile(cmf_tp);
        var text = options["text"];
        labelBMFont.setString(text);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    }
});
ccs.WidgetPropertiesReader0300 = ccs.WidgetPropertiesReader.extend({
    createWidget: function (jsonDict, fullPath, fileName) {
        this._filePath = fullPath == "" ? fullPath : cc.path.join(fullPath, "/");
        var textures = jsonDict["textures"];
        for (var i = 0; i < textures.length; i++) {
            var file = textures[i];
            var tp = fullPath;
            tp += file;
            cc.spriteFrameCache.addSpriteFrames(tp);
        }
        var fileDesignWidth = jsonDict["designWidth"];
        var fileDesignHeight = jsonDict["designHeight"];
        if (fileDesignWidth <= 0 || fileDesignHeight <= 0) {
            cc.log("Read design size error!");
            var winSize = cc.director.getWinSize();
            ccs.uiReader.storeFileDesignSize(fileName, winSize);
        } else
            ccs.uiReader.storeFileDesignSize(fileName, cc.size(fileDesignWidth, fileDesignHeight));
        var widgetTree = jsonDict["widgetTree"];
        var widget = this.widgetFromJsonDictionary(widgetTree);
        var size = widget.getContentSize();
        if (size.width == 0 && size.height == 0)
            widget.setSize(cc.size(fileDesignWidth, fileDesignHeight));
        var actions = jsonDict["animation"];
        ccs.actionManager.initWithDictionary(fileName, actions, widget);
        widgetTree = null;
        actions = null;
        return widget;
    },
    setPropsForAllWidgetFromJsonDictionary: function(reader, widget, options){
        if(reader && reader.setPropsFromJsonDictionary)
            reader.setPropsFromJsonDictionary(widget, options);
    },
    setPropsForAllCustomWidgetFromJsonDictionary: function(classType, widget, customOptions){
        var guiReader = ccs.uiReader;
        var object_map = guiReader.getParseObjectMap();
        var object = object_map[classType];
        var selector_map = guiReader.getParseCallBackMap();
        var selector = selector_map[classType];
        if (object && selector)
            selector.call(object, classType, widget, customOptions);
    },
    widgetFromJsonDictionary: function (data) {
        var classname = data["classname"];
        var uiOptions = data["options"];
        var widget = this._createGUI(classname);
        var readerName = this._getWidgetReaderClassName(classname);
        var reader = this._createWidgetReaderProtocol(readerName);
        if (reader){
            this.setPropsForAllWidgetFromJsonDictionary(reader, widget, uiOptions);
        } else {
            readerName = this._getWidgetReaderClassNameFromWidget(widget);
            reader = ccs.objectFactory.createObject(readerName);
            if (reader && widget) {
                this.setPropsForAllWidgetFromJsonDictionary(reader, widget, uiOptions);
                var customProperty = uiOptions["customProperty"];
                var customJsonDict = JSON.parse(customProperty);
                this.setPropsForAllCustomWidgetFromJsonDictionary(classname, widget, customJsonDict);
            }else{
                cc.log("Widget or WidgetReader doesn't exists!!!  Please check your json file.");
            }
        }
        var childrenItem = data["children"];
        for(var i=0; i<childrenItem.length; i++){
            var child = this.widgetFromJsonDictionary(childrenItem[i]);
            if(child){
                if(widget instanceof ccui.PageView)
                    widget.addPage(child);
                else {
                    if(widget instanceof ccui.ListView){
                        widget.pushBackCustomItem(child);
                    } else {
                        if(!(widget instanceof ccui.Layout)) {
                            if(child.getPositionType() == ccui.Widget.POSITION_PERCENT) {
                                var position = child.getPositionPercent();
                                var anchor = widget.getAnchorPoint();
                                child.setPositionPercent(cc.p(position.x + anchor.x, position.y + anchor.y));
                            }
                            var AnchorPointIn = widget.getAnchorPointInPoints();
                            child.setPosition(cc.p(child.getPositionX() + AnchorPointIn.x, child.getPositionY() + AnchorPointIn.y));
                        }
                        widget.addChild(child);
                    }
                }
            }
        }
        return widget;
    },
    setPropsForWidgetFromJsonDictionary: function (widget, options) {
        var name = options["name"];
        var widgetName = name ? name : "default";
        widget.setName(widgetName);
        if (options["ignoreSize"] !== undefined)
            widget.ignoreContentAdaptWithSize(options["ignoreSize"]);
        widget.setSizeType(options["sizeType"]);
        widget.setPositionType(options["positionType"]);
        widget.setSizePercent(cc.p(options["sizePercentX"], options["sizePercentY"]));
        widget.setPositionPercent(cc.p(options["positionPercentX"], options["positionPercentY"]));
        var w = options["width"];
        var h = options["height"];
        widget.setSize(cc.size(w, h));
        widget.setTag(options["tag"]);
        widget.setActionTag(options["actiontag"]);
        widget.setTouchEnabled(options["touchAble"]);
        var x = options["x"];
        var y = options["y"];
        widget.setPosition(cc.p(x, y));
        if (options["scaleX"] !== undefined)
            widget.setScaleX(options["scaleX"]);
        if (options["scaleY"] !== undefined)
            widget.setScaleY(options["scaleY"]);
        if (options["rotation"] !== undefined)
            widget.setRotation(options["rotation"]);
        if (options["visible"] !== undefined)
            widget.setVisible(options["visible"]);
        widget.setLocalZOrder(options["ZOrder"]);
        var layoutParameterDic = options["layoutParameter"];
        if (layoutParameterDic) {
            var paramType = layoutParameterDic["type"];
            var parameter;
            switch (paramType) {
                case 0:
                    break;
                case 1:
                    parameter = ccui.LinearLayoutParameter.create();
                    var gravity = layoutParameterDic["gravity"];
                    parameter.setGravity(gravity);
                    break;
                case 2:
                    parameter = ccui.RelativeLayoutParameter.create();
                    var relativeName = layoutParameterDic["relativeName"];
                    parameter.setRelativeName(relativeName);
                    var relativeToName = layoutParameterDic["relativeToName"];
                    parameter.setRelativeToWidgetName(relativeToName);
                    parameter.setAlign(layoutParameterDic["align"]);
                    break;
                default:
                    break;
            }
            var mgl = layoutParameterDic["marginLeft"];
            var mgt = layoutParameterDic["marginTop"];
            var mgr = layoutParameterDic["marginRight"];
            var mgb = layoutParameterDic["marginDown"];
            parameter.setMargin(new ccui.Margin(mgl, mgt, mgr, mgb));
            widget.setLayoutParameter(parameter);
        }
    },
    setColorPropsForWidgetFromJsonDictionary: function (widget, options) {
        if (options["opacity"] !== undefined) {
            widget.setOpacity(options["opacity"]);
        }
        var colorR = options["colorR"] !== undefined ? options["colorR"] : 255;
        var colorG = options["colorG"] !== undefined ? options["colorG"] : 255;
        var colorB = options["colorB"] !== undefined ? options["colorB"] : 255;
        widget.setColor(cc.color(colorR, colorG, colorB));
        var apx = options["anchorPointX"] !== undefined ? options["anchorPointX"] : ((widget.getWidgetType() == ccui.Widget.TYPE_WIDGET) ? 0.5 : 0);
        var apy = options["anchorPointY"] !== undefined ? options["anchorPointY"] : ((widget.getWidgetType() == ccui.Widget.TYPE_WIDGET) ? 0.5 : 0);
        widget.setAnchorPoint(apx, apy);
        var flipX = options["flipX"];
        var flipY = options["flipY"];
        widget.setFlippedX(flipX);
        widget.setFlippedY(flipY);
    },
    setPropsForButtonFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var button = widget;
        var scale9Enable = options["scale9Enable"];
        button.setScale9Enabled(scale9Enable);
        var normalDic = options["normalData"];
        var normalType = normalDic["resourceType"];
        switch (normalType) {
            case 0:
                var normalFileName = normalDic["path"];
                var normalFileName_tp = normalFileName ? this._filePath + normalFileName : null;
                button.loadTextureNormal(normalFileName_tp);
                break;
            case 1:
                var normalFileName = normalDic["path"];
                button.loadTextureNormal(normalFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        normalDic = null;
        var pressedDic = options["pressedData"];
        var pressedType = pressedDic["resourceType"];
        switch (pressedType) {
            case 0:
                var pressedFileName = pressedDic["path"];
                var pressedFileName_tp = pressedFileName ? this._filePath + pressedFileName : null;
                button.loadTexturePressed(pressedFileName_tp);
                break;
            case 1:
                var pressedFileName = pressedDic["path"];
                button.loadTexturePressed(pressedFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        pressedDic = null;
        var disabledDic = options["disabledData"];
        var disabledType = disabledDic["resourceType"];
        switch (disabledType) {
            case 0:
                var disabledFileName = disabledDic["path"];
                var disabledFileName_tp = disabledFileName ? this._filePath + disabledFileName : null;
                button.loadTextureDisabled(disabledFileName_tp);
                break;
            case 1:
                var disabledFileName = disabledDic["path"];
                button.loadTextureDisabled(disabledFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        disabledDic = null;
        if (scale9Enable) {
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            button.setCapInsets(cc.rect(cx, cy, cw, ch));
            if (options["scale9Width"] !== undefined && options["scale9Height"] !== undefined) {
                var swf = options["scale9Width"];
                var shf = options["scale9Height"];
                button.setSize(cc.size(swf, shf));
            }
        }
        if (options["text"] !== undefined) {
            var text = options["text"] || "";
            if (text)
                button.setTitleText(text);
        }
        if (options["fontSize"] !== undefined) {
            button.setTitleFontSize(options["fontSize"]);
        }
        if (options["fontName"] !== undefined) {
            button.setTitleFontName(options["fontName"]);
        }
        var cr = options["textColorR"] !== undefined ? options["textColorR"] : 255;
        var cg = options["textColorG"] !== undefined ? options["textColorG"] : 255;
        var cb = options["textColorB"] !== undefined ? options["textColorB"] : 255;
        var tc = cc.color(cr, cg, cb);
        button.setTitleColor(tc);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForCheckBoxFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var checkBox = widget;
        var backGroundDic = options["backGroundBoxData"];
        var backGroundType = backGroundDic["resourceType"];
        switch (backGroundType) {
            case 0:
                var backGroundFileName = backGroundDic["path"];
                var backGroundFileName_tp = backGroundFileName ? this._filePath + backGroundFileName : null;
                checkBox.loadTextureBackGround(backGroundFileName_tp);
                break;
            case 1:
                var backGroundFileName = backGroundDic["path"];
                checkBox.loadTextureBackGround(backGroundFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        backGroundDic = null;
        var backGroundSelectedDic = options["backGroundBoxSelectedData"];
        var backGroundSelectedType = backGroundSelectedDic["resourceType"];
        switch (backGroundSelectedType) {
            case 0:
                var backGroundSelectedFileName = backGroundSelectedDic["path"];
                var backGroundSelectedFileName_tp = backGroundSelectedFileName ? this._filePath + backGroundSelectedFileName : null;
                checkBox.loadTextureBackGroundSelected(backGroundSelectedFileName_tp);
                break;
            case 1:
                var backGroundSelectedFileName = backGroundSelectedDic["path"];
                checkBox.loadTextureBackGroundSelected(backGroundSelectedFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        backGroundSelectedDic = null;
        var frontCrossDic = options["frontCrossData"];
        var frontCrossType = frontCrossDic["resourceType"];
        switch (frontCrossType) {
            case 0:
                var frontCrossFileName = frontCrossDic["path"];
                var frontCrossFileName_tp = frontCrossFileName ? this._filePath + frontCrossFileName : null;
                checkBox.loadTextureFrontCross(frontCrossFileName_tp);
                break;
            case 1:
                var frontCrossFileName = frontCrossDic["path"];
                checkBox.loadTextureFrontCross(frontCrossFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        frontCrossDic = null;
        var backGroundDisabledDic = options["backGroundBoxDisabledData"];
        var backGroundDisabledType = backGroundDisabledDic["resourceType"];
        switch (backGroundDisabledType) {
            case 0:
                var backGroundDisabledFileName = backGroundDisabledDic["path"];
                var backGroundDisabledFileName_tp = backGroundDisabledFileName ? this._filePath + backGroundDisabledFileName : null;
                checkBox.loadTextureBackGroundDisabled(backGroundDisabledFileName_tp);
                break;
            case 1:
                var backGroundDisabledFileName = backGroundDisabledDic["path"];
                checkBox.loadTextureBackGroundDisabled(backGroundDisabledFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        backGroundDisabledDic = null;
        var frontCrossDisabledDic = options["frontCrossDisabledData"];
        var frontCrossDisabledType = frontCrossDisabledDic["resourceType"];
        switch (frontCrossDisabledType) {
            case 0:
                var frontCrossDisabledFileName = options["path"];
                var frontCrossDisabledFileName_tp = frontCrossDisabledFileName ? this._filePath + frontCrossDisabledFileName : null;
                checkBox.loadTextureFrontCrossDisabled(frontCrossDisabledFileName_tp);
                break;
            case 1:
                var frontCrossDisabledFileName = options["path"];
                checkBox.loadTextureFrontCrossDisabled(frontCrossDisabledFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        frontCrossDisabledDic = null;
        var selectedState = options["selectedState"] || false;
        widget.setSelectedState(selectedState);
        checkBox.setSelectedState(options, "selectedState");
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForImageViewFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var imageView = widget;
        var imageFileNameDic = options["fileNameData"];
        var imageFileNameType = imageFileNameDic["resourceType"];
        switch (imageFileNameType) {
            case 0:
                var tp_i = this._filePath;
                var imageFileName = imageFileNameDic["path"];
                var imageFileName_tp = null;
                if (imageFileName) {
                    imageFileName_tp = tp_i + imageFileName;
                    imageView.loadTexture(imageFileName_tp);
                }
                break;
            case 1:
                var imageFileName = imageFileNameDic["path"];
                imageView.loadTexture(imageFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        imageFileNameDic = null;
        var scale9Enable = options["scale9Enable"] || false;
        imageView.setScale9Enabled(scale9Enable);
        if (scale9Enable) {
            if (options["scale9Width"] !== undefined && options["scale9Height"] !== undefined) {
                var swf = options["scale9Width"];
                var shf = options["scale9Height"];
                imageView.setSize(cc.size(swf, shf));
            }
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            imageView.setCapInsets(cc.rect(cx, cy, cw, ch));
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForLabelFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var label = widget;
        var touchScaleChangeAble = options["touchScaleEnable"];
        label.setTouchScaleChangeEnabled(touchScaleChangeAble);
        var text = options["text"];
        label.setString(text);
        if (options["fontSize"] !== undefined) {
            label.setFontSize(options["fontSize"]);
        }
        if (options["fontName"] !== undefined) {
            label.setFontName(options["fontName"]);
        }
        if (options["areaWidth"] !== undefined && options["areaHeight"] !== undefined) {
            var size = cc.size(options["areaWidth"], options["areaHeight"]);
            label.setTextAreaSize(size);
        }
        if (options["hAlignment"]) {
            label.setTextHorizontalAlignment(options["hAlignment"]);
        }
        if (options["vAlignment"]) {
            label.setTextVerticalAlignment(options["vAlignment"]);
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForLabelAtlasFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var labelAtlas = widget;
        var sv = (options["stringValue"] !== undefined);
        var cmf = (options["charMapFile"] !== undefined);
        var iw = (options["itemWidth"] !== undefined);
        var ih = (options["itemHeight"] !== undefined);
        var scm = (options["startCharMap"] !== undefined);
        if (sv && cmf && iw && ih && scm) {
            var cmftDic = options["charMapFileData"];
            var cmfType = cmftDic["resourceType"];
            switch (cmfType) {
                case 0:
                    var cmfPath = cmftDic["path"];
                    var cmf_tp = this._filePath + cmfPath;
                    labelAtlas.setProperty(options["stringValue"], cmf_tp, options["itemWidth"], options["itemHeight"], options["startCharMap"]);
                    break;
                case 1:
                    cc.log("Wrong res type of LabelAtlas!");
                    break;
                default:
                    break;
            }
            cmftDic = null;
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForLayoutFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var panel = widget;
        if (!(panel instanceof ccui.ScrollView) && !(panel instanceof ccui.ListView)) {
            panel.setClippingEnabled(options["clipAble"]);
        }
        var backGroundScale9Enable = options["backGroundScale9Enable"];
        panel.setBackGroundImageScale9Enabled(backGroundScale9Enable);
        var cr = options["bgColorR"];
        var cg = options["bgColorG"];
        var cb = options["bgColorB"];
        var scr = options["bgStartColorR"];
        var scg = options["bgStartColorG"]
        var scb = options["bgStartColorB"];
        var ecr = options["bgEndColorR"];
        var ecg = options["bgEndColorG"];
        var ecb = options["bgEndColorB"];
        var bgcv1 = options["vectorX"];
        var bgcv2 = options["vectorY"];
        panel.setBackGroundColorVector(cc.p(bgcv1, bgcv2));
        var co = options["bgColorOpacity"];
        var colorType = options["colorType"];
        panel.setBackGroundColorType(colorType);
        panel.setBackGroundColor(cc.color(scr, scg, scb), cc.color(ecr, ecg, ecb));
        panel.setBackGroundColor(cc.color(cr, cg, cb));
        panel.setBackGroundColorOpacity(co);
        var imageFileNameDic = options["backGroundImageData"] || {};
        var imageFileNameType = imageFileNameDic["resourceType"];
        switch (imageFileNameType) {
            case 0:
                var imageFileName = imageFileNameDic["path"];
                var imageFileName_tp = imageFileName ? this._filePath + imageFileName : null;
                panel.setBackGroundImage(imageFileName_tp);
                break;
            case 1:
                var imageFileName = imageFileNameDic["path"];
                panel.setBackGroundImage(imageFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        imageFileNameDic = null;
        if (backGroundScale9Enable) {
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            panel.setBackGroundImageCapInsets(cc.rect(cx, cy, cw, ch));
        }
        panel.setLayoutType(options["layoutType"]);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForScrollViewFromJsonDictionary: function (widget, options) {
        this.setPropsForLayoutFromJsonDictionary(widget, options);
        var scrollView = widget;
        var innerWidth = options["innerWidth"];
        var innerHeight = options["innerHeight"];
        scrollView.setInnerContainerSize(cc.size(innerWidth, innerHeight));
        var direction = options["direction"];
        scrollView.setDirection(direction);
        scrollView.setBounceEnabled(options["bounceEnable"]);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForSliderFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var slider = widget;
        var barTextureScale9Enable = options["barTextureScale9Enable"] || false;
        slider.setScale9Enabled(barTextureScale9Enable);
        var barLength = options["length"];
        var bt = (options["barFileName"] !== undefined);
        if (bt) {
            if (barTextureScale9Enable) {
                var imageFileNameDic = options["barFileNameData"];
                var imageFileType = imageFileNameDic["resourceType"];
                switch (imageFileType) {
                    case 0:
                        var imageFileName = imageFileNameDic["path"];
                        var imageFileName_tp = imageFileName ? this._filePath + imageFileName : null;
                        slider.loadBarTexture(imageFileName_tp);
                        break;
                    case 1:
                        var imageFileName = imageFileNameDic["path"];
                        slider.loadBarTexture(imageFileName, ccui.Widget.PLIST_TEXTURE);
                        break;
                    default:
                        break;
                }
                slider.setSize(cc.size(barLength, slider.getContentSize().height));
                imageFileNameDic = null;
            }
            else {
                var imageFileNameDic = options["barFileNameData"];
                var imageFileType = imageFileNameDic["resourceType"];
                switch (imageFileType) {
                    case 0:
                        var imageFileName = imageFileNameDic["path"];
                        var imageFileName_tp = imageFileName ? this._filePath + imageFileName : null;
                        slider.loadBarTexture(imageFileName_tp);
                        break;
                    case 1:
                        var imageFileName = imageFileNameDic["path"];
                        slider.loadBarTexture(imageFileName, ccui.Widget.PLIST_TEXTURE);
                        break;
                    default:
                        break;
                }
                imageFileNameDic = null;
            }
        }
        var normalDic = options["ballNormalData"];
        var normalType = normalDic["resourceType"];
        switch (normalType) {
            case 0:
                var normalFileName = normalDic["path"];
                var normalFileName_tp = normalFileName ? this._filePath + normalFileName : null;
                slider.loadSlidBallTextureNormal(normalFileName_tp);
                break;
            case 1:
                var normalFileName = normalDic["path"];
                slider.loadSlidBallTextureNormal(normalFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        normalDic = null;
        var pressedDic = options["ballPressedData"];
        var pressedType = pressedDic["resourceType"];
        switch (pressedType) {
            case 0:
                var pressedFileName = pressedDic["path"];
                var pressedFileName_tp = pressedFileName ? this._filePath + pressedFileName : null;
                slider.loadSlidBallTexturePressed(pressedFileName_tp);
                break;
            case 1:
                var pressedFileName = pressedDic["path"];
                slider.loadSlidBallTexturePressed(pressedFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        pressedDic = null;
        var disabledDic = options["ballDisabledData"];
        var disabledType = disabledDic["resourceType"];
        switch (disabledType) {
            case 0:
                var disabledFileName = disabledDic["path"];
                var disabledFileName_tp = disabledFileName ? this._filePath + disabledFileName : null;
                slider.loadSlidBallTextureDisabled(disabledFileName_tp);
                break;
            case 1:
                var disabledFileName = disabledDic["path"];
                slider.loadSlidBallTextureDisabled(disabledFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        disabledDic = null;
        var progressBarDic = options["progressBarData"];
        var progressBarType = progressBarDic["resourceType"];
        switch (progressBarType) {
            case 0:
                var imageFileName = progressBarDic["path"];
                var imageFileName_tp = imageFileName ? this._filePath + imageFileName : null;
                slider.loadProgressBarTexture(imageFileName_tp);
                break;
            case 1:
                var imageFileName = progressBarDic["path"];
                slider.loadProgressBarTexture(imageFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
        slider.setPercent(options["percent"]);
    },
    setPropsForTextAreaFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var textArea = widget;
        textArea.setString(options["text"]);
        if (options["fontSize"] !== undefined)
            textArea.setFontSize(options["fontSize"]);
        var cr = options["colorR"];
        var cg = options["colorG"];
        var cb = options["colorB"];
        textArea.setColor(cc.color((cr==null)?255:cr, (cg==null)?255:cg, (cb==null)?255:cb));
        textArea.setFontName(options["fontName"]);
        if (options["areaWidth"] !== undefined && options["areaHeight"] !== undefined) {
            var size = cc.size(options["areaWidth"], options["areaHeight"]);
            textArea.setTextAreaSize(size);
        }
        if (options["hAlignment"])
            textArea.setTextHorizontalAlignment(options["hAlignment"]);
        if (options["vAlignment"])
            textArea.setTextVerticalAlignment(options["vAlignment"]);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForTextButtonFromJsonDictionary: function (widget, options) {
        this.setPropsForButtonFromJsonDictionary(widget, options);
        var textButton = widget;
        textButton.setTitleText(options["text"] || "");
        var cri = options["textColorR"] !== undefined ? options["textColorR"] : 255;
        var cgi = options["textColorG"] !== undefined ? options["textColorG"] : 255;
        var cbi = options["textColorB"] !== undefined ? options["textColorB"] : 255;
        textButton.setTitleColor(cc.color(cri, cgi, cbi));
        if (options["fontSize"] !== undefined)
            textButton.setTitleFontSize(options["fontSize"]);
        if (options["fontName"] !== undefined)
            textButton.setTitleFontName(options["fontName"]);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForTextFieldFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var textField = widget;
        if (options["placeHolder"] !== undefined) {
            textField.setPlaceHolder(options["placeHolder"]);
        }
        textField.setString(options["text"]);
        if (options["fontSize"] !== undefined) {
            textField.setFontSize(options["fontSize"]);
        }
        if (options["fontName"] !== undefined) {
            textField.setFontName(options["fontName"]);
        }
        if (options["touchSizeWidth"] !== undefined && options["touchSizeHeight"] !== undefined) {
            textField.setTouchSize(cc.size(options["touchSizeWidth"], options["touchSizeHeight"]));
        }
        var dw = options["width"];
        var dh = options["height"];
        if (dw > 0.0 || dh > 0.0) {
        }
        var maxLengthEnable = options["maxLengthEnable"];
        textField.setMaxLengthEnabled(maxLengthEnable);
        if (maxLengthEnable) {
            var maxLength = options["maxLength"];
            textField.setMaxLength(maxLength);
        }
        var passwordEnable = options["passwordEnable"];
        textField.setPasswordEnabled(passwordEnable);
        if (passwordEnable) {
            textField.setPasswordStyleText(options["passwordStyleText"]);
        }
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForLoadingBarFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var loadingBar = widget;
        var imageFileNameDic = options["textureData"];
        var imageFileNameType = imageFileNameDic["resourceType"];
        switch (imageFileNameType) {
            case 0:
                var tp_i = this._filePath;
                var imageFileName = imageFileNameDic["path"];
                var imageFileName_tp = null;
                if (imageFileName) {
                    imageFileName_tp = tp_i + imageFileName;
                    loadingBar.loadTexture(imageFileName_tp);
                }
                break;
            case 1:
                var imageFileName = imageFileNameDic["path"];
                loadingBar.loadTexture(imageFileName, ccui.Widget.PLIST_TEXTURE);
                break;
            default:
                break;
        }
        imageFileNameDic = null;
        var scale9Enable = options["scale9Enable"];
        loadingBar.setScale9Enabled(scale9Enable);
        if (scale9Enable) {
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            loadingBar.setCapInsets(cc.rect(cx, cy, cw, ch));
            var width = options["width"];
            var height = options["height"];
            loadingBar.setSize(cc.size(width, height));
        }
        loadingBar.setDirection(options["direction"]);
        loadingBar.setPercent(options["percent"]);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    },
    setPropsForListViewFromJsonDictionary: function (widget, options) {
        this.setPropsForLayoutFromJsonDictionary(widget, options);
        var innerWidth = options["innerWidth"] || 0;
        var innerHeight = options["innerHeight"] || 0;
        widget.setInnerContainerSize(cc.size(innerWidth, innerHeight));
        widget.setDirection(options["direction"] || 0);
        widget.setGravity(options["gravity"] || 0);
        widget.setItemsMargin(options["itemMargin"] || 0);
    },
    setPropsForPageViewFromJsonDictionary: function (widget, options) {
        this.setPropsForLayoutFromJsonDictionary(widget, options);
    },
    setPropsForLabelBMFontFromJsonDictionary: function (widget, options) {
        this.setPropsForWidgetFromJsonDictionary(widget, options);
        var labelBMFont = widget;
        var cmftDic = options["fileNameData"];
        var cmfType = cmftDic["resourceType"];
        switch (cmfType) {
            case 0:
                var cmfPath = cmftDic["path"];
                var cmf_tp = this._filePath + cmfPath;
                labelBMFont.setFntFile(cmf_tp);
                break;
            case 1:
                cc.log("Wrong res type of LabelAtlas!");
                break;
            default:
                break;
        }
        cmftDic = null;
        var text = options["text"];
        labelBMFont.setString(text);
        this.setColorPropsForWidgetFromJsonDictionary(widget, options);
    }
});
ccs.sceneReader = {
    _baseBath:"",
    _listener:null,
    _selector:null,
    _node: null,
    createNodeWithSceneFile: function (pszFileName) {
        this._node  = null;
        do{
            this._baseBath = cc.path.dirname(pszFileName);
            var jsonDict = cc.loader.getRes(pszFileName);
            if (!jsonDict)
                throw "Please load the resource first : " + pszFileName;
            this._node = this.createObject(jsonDict, null);
            ccs.triggerManager.parse(jsonDict["Triggers"]||[]);
        }while(0);
        return this._node;
    },
    createObject: function (inputFiles, parenet) {
        var className = inputFiles["classname"];
        if (className == "CCNode") {
            var gb = null;
            if (!parenet) {
                gb = cc.Node.create();
            }
            else {
                gb = cc.Node.create();
                parenet.addChild(gb);
            }
            this.setPropertyFromJsonDict(gb, inputFiles);
            var components = inputFiles["components"];
            for (var i = 0; i < components.length; i++) {
                var subDict = components[i];
                if (!subDict) {
                    break;
                }
                className = subDict["classname"];
                var comName = subDict["name"];
                var fileData = subDict["fileData"];
                var path = "", plistFile = "";
                var resType = 0;
                if (fileData != null) {
                    if(fileData["resourceType"] !== undefined){
                        resType = fileData["resourceType"]
                    }else{
                        resType =-1;
                    }
                    path = cc.path.join(this._baseBath, fileData["path"]);
                    plistFile = fileData["plistFile"];
                }
                var pathExtname = cc.path.extname(path);
                if (className == "CCSprite") {
                    var sprite = null;
                    if (resType == 0) {
                        if (pathExtname != ".png") continue;
                        sprite = cc.Sprite.create(path);
                    }
                    else if (resType == 1) {
                        if (pathExtname != ".plist") continue;
                        plistFile = cc.path.join(this._baseBath, plistFile);
                        var pngFile = cc.path.changeExtname(plistFile, ".png");
                        cc.spriteFrameCache.addSpriteFrames(plistFile, pngFile);
                        sprite = cc.Sprite.create("#" + fileData["path"]);
                    }
                    else {
                        continue;
                    }
                    var render = ccs.ComRender.create(sprite, "CCSprite");
                    if (comName != null) {
                        render.setName(comName);
                    }
                    gb.addComponent(render);
                    this._callSelector(sprite, subDict);
                }
                else if (className == "CCTMXTiledMap") {
                    var tmx = null;
                    if (resType == 0) {
                        if (pathExtname != ".tmx") continue;
                        tmx = cc.TMXTiledMap.create(path);
                    }
                    else {
                        continue;
                    }
                    var render = ccs.ComRender.create(tmx, "CCTMXTiledMap");
                    if (comName != null) {
                        render.setName(comName);
                    }
                    gb.addComponent(render);
                    this._callSelector(tmx, subDict);
                }
                else if (className == "CCParticleSystemQuad") {
                    if (pathExtname != ".plist") continue;
                    var particle = null;
                    if (resType == 0) {
                        particle = cc.ParticleSystem.create(path);
                    }
                    else {
                        cc.log("unknown resourcetype on CCParticleSystemQuad!");
                        continue;
                    }
                    particle.setPosition(0, 0);
                    var render = ccs.ComRender.create(particle, "CCParticleSystemQuad");
                    if (comName != null) {
                        render.setName(comName);
                    }
                    gb.addComponent(render);
                    this._callSelector(particle, subDict);
                }
                else if (className == "CCArmature") {
                    if (resType != 0) {
                        continue;
                    }
                    var jsonDict = cc.loader.getRes(path);
                    if (!jsonDict) cc.log("Please load the resource [%s] first!", path);
                    var armature_data = jsonDict["armature_data"];
                    var subData = armature_data[0];
                    var name = subData["name"];
                    ccs.armatureDataManager.addArmatureFileInfo(path);
                    var armature = ccs.Armature.create(name);
                    var render = ccs.ComRender.create(armature, "CCArmature");
                    if (comName != null) {
                        render.setName(comName);
                    }
                    gb.addComponent(render);
                    var actionName = subDict["selectedactionname"];
                    if (actionName && armature.getAnimation()) {
                        armature.getAnimation().play(actionName);
                    }
                    jsonDict = null;
                    subData = null;
                    this._callSelector(armature, subDict);
                }
                else if (className == "CCComAudio") {
                    var audio = null;
                    if (resType == 0) {
                        audio = ccs.ComAudio.create();
                    }
                    else {
                        continue;
                    }
                    audio.preloadEffect(path);
                    if (comName) {
                        audio.setName(comName);
                    }
                    gb.addComponent(audio);
                    this._callSelector(audio, subDict);
                }
                else if (className == "CCComAttribute") {
                    var attribute = null;
                    if (resType == 0) {
                        attribute = ccs.ComAttribute.create();
                        if (path != "") attribute.parse(path);
                    }
                    else {
                        cc.log("unknown resourcetype on CCComAttribute!");
                        continue;
                    }
                    if (comName) {
                        attribute.setName(comName);
                    }
                    gb.addComponent(attribute);
                    this._callSelector(attribute, subDict);
                }
                else if (className == "CCBackgroundAudio") {
                    if(!pathExtname) continue;
                    if(resType!=0) continue;
                    var audio  = ccs.ComAudio.create();
                    audio.preloadBackgroundMusic(path);
                    audio.setFile(path);
                    var bLoop = Boolean(subDict["loop"] || 0);
                    audio.setLoop(bLoop);
                    if (comName) {
                        audio.setName(comName);
                    }
                    gb.addComponent(audio);
                    audio.playBackgroundMusic(path, bLoop);
                    this._callSelector(audio, subDict);
                }
                else if (className == "GUIComponent") {
                    var widget = ccs.uiReader.widgetFromJsonFile(path);
                    var render = ccs.ComRender.create(widget, "GUIComponent");
                    if (comName != null) {
                        render.setName(comName);
                    }
                    gb.addComponent(render);
                    this._callSelector(audio, subDict);
                }
                subDict = null;
            }
            var gameobjects = inputFiles["gameobjects"];
            for (var i = 0; i < gameobjects.length; i++) {
                var subDict = gameobjects[i];
                if (!subDict)
                    break;
                this.createObject(subDict, gb);
                subDict = null;
            }
            return gb;
        }
        return null;
    },
    _nodeByTag: function (parent, tag) {
        if (parent == null)
            return null;
        var retNode = null;
        var children = parent.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child && child.getTag() == tag) {
                retNode = child;
                break;
            } else {
                retNode = this._nodeByTag(child, tag);
                if (retNode)
                    break;
            }
        }
        return retNode;
    },
    getNodeByTag: function (tag) {
        if (this._node == null)
            return null;
        if (this._node.getTag() == tag)
            return this._node;
        return this._nodeByTag(this._node, tag);
    },
    setPropertyFromJsonDict: function (node, dict) {
        var x = (cc.isUndefined(dict["x"]))?0:dict["x"];
        var y = (cc.isUndefined(dict["y"]))?0:dict["y"];
        node.setPosition(x, y);
        var bVisible = Boolean((cc.isUndefined(dict["visible"]))?1:dict["visible"]);
        node.setVisible(bVisible);
        var nTag = (cc.isUndefined(dict["objecttag"]))?-1:dict["objecttag"];
        node.setTag(nTag);
        var nZorder = (cc.isUndefined(dict["zorder"]))?0:dict["zorder"];
        node.setLocalZOrder(nZorder);
        var fScaleX = (cc.isUndefined(dict["scalex"]))?1:dict["scalex"];
        var fScaleY = (cc.isUndefined(dict["scaley"]))?1:dict["scaley"];
        node.setScaleX(fScaleX);
        node.setScaleY(fScaleY);
        var fRotationZ = (cc.isUndefined(dict["rotation"]))?0:dict["rotation"];
        node.setRotation(fRotationZ);
    },
    setTarget : function(selector,listener){
        this._listener = listener;
        this._selector = selector;
    },
    _callSelector:function(obj,subDict){
        if(this._selector)
            this._selector.call(this._listener,obj,subDict);
    },
	version: function () {
		return "1.2.0.0";
	},
    clear: function () {
	    ccs.triggerManager.removeAll();
	    cc.audioEngine.end();
    }
};
(function(studio){
    studio.ActionTimelineData = studio.Class.extend({
        _actionTag: 0,
        ctor: function(actionTag){
            this._init(actionTag);
        },
        _init: function(actionTag){
            this._actionTag = actionTag;
            return true;
        },
        setActionTag: function(actionTag){
            this._actionTag = actionTag;
        },
        getActionTag: function(){
            return this._actionTag;
        }
    });
    studio.ActionTimelineData.create = function(actionTag){
        var ret = new studio.ActionTimelineData();
        ret._init(actionTag);
        return ret;
    };
    studio.ActionTimeline = cc.Action.extend({
        _timelineMap: null,
        _timelineList: null,
        _duration: 0,
        _time: null,
        _timeSpeed: 1,
        _frameInternal: 1/60,
        _playing: false,
        _currentFrame: 0,
        _startFrame: 0,
        _endFrame: 0,
        _loop: null,
        _frameEventListener: null,
        ctor: function(){
            cc.Action.prototype.ctor.call(this);
            this._timelineMap = {};
            this._timelineList = [];
            this.init();
        },
        _gotoFrame: function(frameIndex){
            var size = this._timelineList.length;
            for(var i = 0; i < size; i++)
            {
                this._timelineList[i]._gotoFrame(frameIndex);
            }
        },
        _stepToFrame: function(frameIndex){
            var size = this._timelineList.length;
            for(var i = 0; i < size; i++){
                this._timelineList[i]._stepToFrame(frameIndex);
            }
        },
        _emitFrameEvent: function(frame){
            if(this._frameEventListener){
                this._frameEventListener(frame);
            }
        },
        init: function(){
            return true;
        },
        gotoFrameAndPlay: function(startIndex, endIndex, currentFrameIndex, loop){
            var i = 0,
                argLen = arguments.length;
            var num = [],
                bool;
            for(i; i<argLen; i++){
                if(typeof arguments[i] === "boolean"){
                    bool = arguments[i];
                }else{
                    num.push(arguments[i]);
                }
            }
            startIndex = num[0];
            endIndex = num[1] || this._duration;
            currentFrameIndex = num[2] || startIndex;
            loop = bool || true;
            this._startFrame = startIndex;
            this._endFrame = endIndex;
            this._currentFrame = currentFrameIndex;
            this._loop = loop;
            this._time = this._currentFrame * this._frameInternal;
            this.resume();
            this._gotoFrame(this._currentFrame);
        },
        gotoFrameAndPause: function(startIndex){
            this._startFrame = this._currentFrame = startIndex;
            this._time       = this._currentFrame * this._frameInternal;
            this.pause();
            this._gotoFrame(this._currentFrame);
        },
        pause: function(){
            this._playing = false;
        },
        resume: function(){
            this._playing = true;
        },
        isPlaying: function(){
            return this._playing;
        },
        setTimeSpeed: function(speed){
            this._timeSpeed = speed;
        },
        getTimeSpeed: function(){
            return this._timeSpeed;
        },
        setDuration: function(duration){
            this._duration = duration;
        },
        getDuration: function(){
            return this._duration;
        },
        getStartFrame: function(){
            return this._startFrame;
        },
        getEndFrame: function(){
            return this._endFrame;
        },
        setCurrentFrame: function(frameIndex){
            if (frameIndex >= this._startFrame && frameIndex >= this._endFrame){
                this._currentFrame = frameIndex;
                this._time = this._currentFrame * this._frameInternal;
            }else{
                cc.log("frame index is not between start frame and end frame");
            }
        },
        getCurrentFrame: function(){
            return this._currentFrame;
        },
        addTimeline: function(timeline){
            var tag = timeline.getActionTag();
            if (!this._timelineMap[tag]) {
                this._timelineMap[tag] = [];
            }
            if (!this._timelineMap[tag].some(function(item){
                if(item === timeline)
                    return true;
            })) {
                this._timelineList.push(timeline);
                this._timelineMap[tag].push(timeline);
                timeline.setActionTimeline(this);
            }
        },
        removeTimeline: function(timeline){
            var tag = timeline.getActionTag();
            if (this._timelineMap[tag]) {
                if(this._timelineMap[tag].some(function(item){
                    if(item === timeline)
                        return true;
                })) {
                    cc.arrayRemoveObject(this._timelineMap[tag], timeline);
                    cc.arrayRemoveObject(this._timelineList, timeline);
                    timeline.setActionTimeline(null);
                }
            }
        },
        getTimelines: function(){
            return this._timelineList;
        },
        setFrameEventCallFunc: function(listener){
            this._frameEventListener = listener;
        },
        clearFrameEventCallFunc: function(){
            this._frameEventListener = null;
        },
        clone: function(){
            var newAction = new studio.ActionTimeline();
            newAction.setDuration(this._duration);
            newAction.setTimeSpeed(this._timeSpeed);
            for (var a in this._timelineMap){
                var timelines = this._timelineMap[a];
                for(var b in timelines)
                {
                    var timeline = timelines[b];
                    var newTimeline = timeline.clone();
                    newAction.addTimeline(newTimeline);
                }
            }
            return newAction;
        },
        reverse: function(){
            return null;
        },
        step: function(delta){
            if (!this._playing || this._timelineMap.length == 0 || this._duration == 0)
            {
                return;
            }
            this._time += delta * this._timeSpeed;
            this._currentFrame = this._time / this._frameInternal;
            this._stepToFrame(this._currentFrame);
            if(this._time > this._endFrame * this._frameInternal){
                this._playing = this._loop;
                if(!this._playing)
                    this._time = this._endFrame * this._frameInternal;
                else
                    this.gotoFrameAndPlay(this._startFrame, this._endFrame, this._loop);
            }
        },
        _foreachNodeDescendant: function(parent, callback){
            callback(parent);
            var children = parent.getChildren();
            for (var i=0; i<children.length; i++)
            {
                var child = children[i];
                this._foreachNodeDescendant(child, callback);
            }
        },
        startWithTarget: function(target){
            cc.Action.prototype.startWithTarget.call(this, target);
            var self = this;
            var callback = function(child){
                var data = child.getUserObject();
                if(data) {
                    var actionTag = data.getActionTag();
                    if(self._timelineMap[actionTag]) {
                        var timelines = self._timelineMap[actionTag];
                        for (var i=0; i<timelines.length; i++) {
                            var timeline = timelines[i];
                            timeline.setNode(child);
                        }
                    }
                }
            };
            this._foreachNodeDescendant(target, callback);
        },
        isDone: function(){
            return false;
        }
    });
    studio.ActionTimeline.create = function(){
        return new studio.ActionTimeline();
    };
})(ccs);
(function(studio){
    var tlparam = {
        FrameType_VisibleFrame       : "VisibleFrame",
        FrameType_PositionFrame      : "PositionFrame",
        FrameType_ScaleFrame         : "ScaleFrame",
        FrameType_RotationFrame      : "RotationFrame",
        FrameType_SkewFrame          : "SkewFrame",
        FrameType_RotationSkewFrame  : "RotationSkewFrame",
        FrameType_AnchorFrame        : "AnchorFrame",
        FrameType_InnerActionFrame   : "InnerActionFrame",
        FrameType_ColorFrame         : "ColorFrame",
        FrameType_TextureFrame       : "TextureFrame",
        FrameType_EventFrame         : "EventFrame",
        FrameType_ZOrderFrame        : "ZOrderFrame",
        ACTION           : "action",
        DURATION         : "duration",
        TIMELINES        : "timelines",
        FRAME_TYPE       : "frameType",
        FRAMES           : "frames",
        FRAME_INDEX      : "frameIndex",
        TWEEN            : "tween",
        TIME_SPEED       : "speed",
        ACTION_TAG       : "actionTag",
        INNER_ACTION     : "innerActionType",
        START_FRAME      : "startFrame",
        X                : "x",
        Y                : "y",
        ROTATION         : "rotation",
        ALPHA            : "alpha",
        RED              : "red",
        GREEN            : "green",
        BLUE             : "blue",
        Value            : "value"
    };
    studio.ActionTimelineCache = {
        _FrameCreateFunc: null,
        _Pair: null,
        _funcs: null,
        _animationActions: null,
        init: function(){
            this._animationActions = {};
            this._funcs = {};
            this._funcs["VisibleFrame"]      = this._loadVisibleFrame;
            this._funcs["PositionFrame"]     = this._loadPositionFrame;
            this._funcs["ScaleFrame"]        = this._loadScaleFrame;
            this._funcs["RotationFrame"]     = this._loadRotationFrame;
            this._funcs["SkewFrame"]         = this._loadSkewFrame;
            this._funcs["RotationSkewFrame"] = this._loadRotationSkewFrame;
            this._funcs["AnchorFrame"]       = this._loadAnchorPointFrame;
            this._funcs["InnerActionFrame"]  = this._loadInnerActionFrame;
            this._funcs["ColorFrame"]        = this._loadColorFrame;
            this._funcs["TextureFrame"]      = this._loadTextureFrame;
            this._funcs["EventFrame"]        = this._loadEventFrame;
            this._funcs["ZOrderFrame"]       = this._loadZOrderFrame;
        },
        removeAction: function(fileName){
            if (this._animationActions[fileName]) {
                delete this._animationActions[fileName];
            }
        },
        createAction: function(fileName){
            var action = this._animationActions[fileName];
            if (action == null) {
                action = this.loadAnimationActionWithFile(fileName);
            }
            return action.clone();
        },
        loadAnimationActionWithFile: function(fileName){
            var contentStr = cc.loader.getRes(fileName);
            return this.loadAnimationActionWithContent(fileName, contentStr);
        },
        loadAnimationActionWithContent: function(fileName, content){
            var action = this._animationActions[fileName];
            if(action)
                return action;
            var json = content[tlparam.ACTION];
            action = new studio.ActionTimeline();
            action.setDuration(json[tlparam.DURATION]);
            action.setTimeSpeed(json[tlparam.TIME_SPEED] || 1);
            var timelineLength = json[tlparam.TIMELINES].length;
            for (var i = 0; i<timelineLength; i++)
            {
                var dic = json[tlparam.TIMELINES][i];
                var timeline = this._loadTimeline(dic);
                if(timeline)
                    action.addTimeline(timeline);
            }
            this._animationActions[fileName] = action;
            return action;
        },
        _loadTimeline: function(json){
            var timeline = null;
            var frameType = json[tlparam.FRAME_TYPE];
            if(frameType == null)
                return null;
            if(frameType && this._funcs[frameType]){
                timeline = new studio.Timeline();
                var actionTag = json[tlparam.ACTION_TAG];
                timeline.setActionTag(actionTag);
                var func = this._funcs[frameType];
                var length = json[tlparam.FRAMES].length;
                for (var i = 0; i<length; i++){
                    var dic = json[tlparam.FRAMES][i];
                    var frame = null;
                    if (func != null){
                        frame = func(dic);
                        var frameIndex = dic[tlparam.FRAME_INDEX];
                        frame.setFrameIndex(frameIndex);
                        var tween = dic[tlparam.TWEEN] || false;
                        frame.setTween(tween);
                    }
                    timeline.addFrame(frame);
                }
            }
            return timeline;
        },
        _loadVisibleFrame: function(json){
            var frame = new studio.VisibleFrame();
            var visible = json[tlparam.Value];
            frame.setVisible(visible);
            return frame;
        },
        _loadPositionFrame: function(json){
            var frame = new studio.PositionFrame();
            var x = json[tlparam.X];
            var y = json[tlparam.Y];
            frame.setPosition(cc.p(x,y));
            return frame;
        },
        _loadScaleFrame: function(json){
            var frame = new studio.ScaleFrame();
            var scalex = json[tlparam.X];
            var scaley = json[tlparam.Y];
            frame.setScaleX(scalex);
            frame.setScaleY(scaley);
            return frame;
        },
        _loadSkewFrame: function(json){
            var frame = new studio.SkewFrame();
            var skewx = json[tlparam.X];
            var skewy = json[tlparam.Y];
            frame.setSkewX(skewx);
            frame.setSkewY(skewy);
            return frame;
        },
        _loadRotationSkewFrame: function(json){
            var frame = new studio.RotationSkewFrame();
            var skewx = json[tlparam.X];
            var skewy = json[tlparam.Y];
            frame.setSkewX(skewx);
            frame.setSkewY(skewy);
            return frame;
        },
        _loadRotationFrame: function(json){
            var frame = new studio.RotationFrame();
            var rotation = json[tlparam.ROTATION];
            frame.setRotation(rotation);
            return frame;
        },
        _loadAnchorPointFrame: function(json){
            var frame = new studio.AnchorPointFrame();
            var anchorx = json[tlparam.X];
            var anchory = json[tlparam.Y];
            frame.setAnchorPoint(Point(anchorx, anchory));
            return frame;
        },
        _loadInnerActionFrame: function(json){
            var frame = new studio.InnerActionFrame();
            var type = json[tlparam.INNER_ACTION];
            var startFrame = json[tlparam.START_FRAME];
            frame.setInnerActionType(type);
            frame.setStartFrameIndex(startFrame);
            return frame;
        },
        _loadColorFrame: function(json){
            var frame = new studio.ColorFrame();
            var alpha = json[tlparam.ALPHA];
            var red   = json[tlparam.RED];
            var green = json[tlparam.GREEN];
            var blue  = json[tlparam.BLUE];
            frame.setAlpha(alpha);
            frame.setColor(cc.color(red, green, blue));
            return frame;
        },
        _loadTextureFrame: function(json){
            var frame = new studio.TextureFrame();
            var texture = json[tlparam.Value];
            if(texture != null) {
                var path = texture;
                var spriteFrame = cc.spriteFrameCache.getSpriteFrame(path);
                if(spriteFrame == null)
                {
                    var jsonPath = studio.NodeReader.getJsonPath();
                    path = jsonPath + texture;
                }
                frame.setTextureName(path);
            }
            return frame;
        },
        _loadEventFrame: function(json){
            var frame = new studio.EventFrame();
            var evnt = json[tlparam.Value];
            if(evnt != null)
                frame.setEvent(evnt);
            return frame;
        },
        _loadZOrderFrame: function(json){
            var frame = new studio.ZOrderFrame();
            var zorder = json[tlparam.Value];
            frame.setZOrder(zorder);
            return frame;
        }
    };
    studio.ActionTimelineCache.init();
    studio.ActionTimelineCache._sharedActionCache = null;
})(ccs);
ccs.Frame = ccs.Class.extend({
    _frameIndex: null,
    _tween: null,
    _timeline: null,
    _node: null,
    ctor: function(){
        this._frameIndex = 0;
        this._tween = true;
        this._timeline = null;
        this._node = null;
    },
    _emitEvent: function(){
        if (this._timeline){
            this._timeline.getActionTimeline()._emitFrameEvent(this);
        }
    },
    _cloneProperty: function(frame){
        this._frameIndex = frame.getFrameIndex();
        this._tween = frame.isTween();
    },
    setFrameIndex: function(frameIndex){
        this._frameIndex = frameIndex;
    },
    getFrameIndex: function(){
        return this._frameIndex;
    },
    setTimeline: function(timeline){
        this._timeline = timeline;
    },
    getTimeline: function(timeline){
        return this._timeline;
    },
    setNode: function(node){
        this._node = node;
    },
    getNode: function(){
        return this._node;
    },
    setTween: function(tween){
        this._tween = tween;
    },
    isTween: function(){
        return this._tween;
    },
    onEnter: function(nextFrame){
    },
    apply: function(percent){
    },
    clone: function(){
    }
});
ccs.VisibleFrame = ccs.Frame.extend({
    _visible: true,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._visible = true;
    },
    onEnter: function(nextFrame){
        this._node.setVisible(this._visible);
    },
    clone: function(){
        var frame = new ccs.VisibleFrame();
        frame.setVisible(this._visible);
        frame._cloneProperty(this);
        return frame;
    },
    setVisible: function(visible){
        this._visible = visible;
    },
    isVisible: function(){
        return this._visible;
    }
});
ccs.VisibleFrame.create = function(){
    return new ccs.VisibleFrame();
};
ccs.TextureFrame = ccs.Frame.extend({
    _sprite: null,
    _textureName: null,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._textureName = "";
    },
    setNode: function(node){
        ccs.Frame.prototype.setNode.call(this, node);
        this._sprite = node;
    },
    onEnter: function(nextFrame){
        if(this._sprite){
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(this._textureName);
            if(spriteFrame != null)
                this._sprite.setSpriteFrame(spriteFrame);
            else
                this._sprite.setTexture(this._textureName);
        }
    },
    clone: function(){
        var frame = new ccs.TextureFrame();
        frame.setTextureName(this._textureName);
        frame._cloneProperty(this);
        return frame;
    },
    setTextureName: function(textureName){
        this._textureName = textureName;
    },
    getTextureName: function(){
        return this._textureName;
    }
});
ccs.TextureFrame.create = function(){
    return new ccs.TextureFrame();
};
ccs.RotationFrame = ccs.Frame.extend({
    _rotation: null,
    _betwennRotation: null,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._rotation = 0;
    },
    onEnter: function(nextFrame){
        this._node.setRotation(this._rotation);
        if(this._tween){
            this._betwennRotation = nextFrame._rotation - this._rotation;
        }
    },
    apply: function(percent){
        if (this._tween && this._betwennRotation != 0){
            var rotation = this._rotation + percent * this._betwennRotation;
            this._node.setRotation(rotation);
        }
    },
    clone: function(){
        var frame = new ccs.RotationFrame();
        frame.setRotation(this._rotation);
        frame._cloneProperty(this);
        return frame;
    },
    setRotation: function(rotation){
        this._rotation = rotation;
    },
    getRotation: function(){
        return this._rotation;
    }
});
ccs.RotationFrame.create = function(){
    return new ccs.RotationFrame();
};
ccs.SkewFrame = ccs.Frame.extend({
    _skewX: null,
    _skewY: null,
    _betweenSkewX: null,
    _betweenSkewY: null,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._skewX = 0;
        this._skewY = 0;
    },
    onEnter: function(nextFrame){
        this._node.setSkewX(this._skewX);
        this._node.setSkewY(this._skewY);
        if(this._tween){
            this._betweenSkewX = nextFrame._skewX - this._skewX;
            this._betweenSkewY = nextFrame._skewY - this._skewY;
        }
    },
    apply: function(percent){
        if (this._tween && (this._betweenSkewX != 0 || this._betweenSkewY != 0))
        {
            var skewx = this._skewX + percent * this._betweenSkewX;
            var skewy = this._skewY + percent * this._betweenSkewY;
            this._node.setSkewX(skewx);
            this._node.setSkewY(skewy);
        }
    },
    clone: function(){
        var frame = new ccs.SkewFrame();
        frame.setSkewX(this._skewX);
        frame.setSkewY(this._skewY);
        frame._cloneProperty(this);
        return frame;
    },
    setSkewX: function(skewx){
        this._skewX = skewx;
    },
    getSkewX: function(){
        return this._skewX;
    },
    setSkewY: function(skewy){
        this._skewY = skewy;
    },
    getSkewY: function(){
        return this._skewY;
    }
});
ccs.SkewFrame.create = function(){
    return new ccs.SkewFrame();
};
ccs.RotationSkewFrame = ccs.SkewFrame.extend({
    onEnter: function(nextFrame){
        this._node.setRotationX(this._skewX);
        this._node.setRotationY(this._skewY);
        if (this._tween)
        {
            this._betweenSkewX = nextFrame._skewX - this._skewX;
            this._betweenSkewY = nextFrame._skewY - this._skewY;
        }
    },
    apply: function(percent){
        if (this._tween && (this._betweenSkewX != 0 || this._betweenSkewY != 0)){
            var skewx = this._skewX + percent * this._betweenSkewX;
            var skewy = this._skewY + percent * this._betweenSkewY;
            this._node.setRotationX(skewx);
            this._node.setRotationY(skewy);
        }
    },
    clone: function(){
        var frame = new ccs.RotationSkewFrame();
        frame.setSkewX(this._skewX);
        frame.setSkewY(this._skewY);
        frame._cloneProperty(this);
        return frame;
    }
});
ccs.RotationSkewFrame.create = function(){
    return new ccs.RotationSkewFrame();
};
ccs.PositionFrame = ccs.Frame.extend({
    _position: null,
    _betweenX: null,
    _betweenY: null,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._position = cc.p(0, 0);
    },
    onEnter: function(nextFrame){
        this._node.setPosition(this._position);
        if(this._tween){
            this._betweenX = nextFrame._position.x - this._position.x;
            this._betweenY = nextFrame._position.y - this._position.y;
        }
    },
    apply: function(percent){
        if (this._tween && (this._betweenX != 0 || this._betweenY != 0)){
            var p = cc.p(0, 0);
            p.x = this._position.x + this._betweenX * percent;
            p.y = this._position.y + this._betweenY * percent;
            this._node.setPosition(p);
        }
    },
    clone: function(){
        var frame = new ccs.PositionFrame();
        frame.setPosition(this._position);
        frame._cloneProperty(this);
        return frame;
    },
    setPosition: function(position){
        this._position = position;
    },
    getPosition: function(){
        return this._position;
    },
    setX: function(x){
        this._position.x = x;
    },
    getX: function(){
        return this._position.x;
    },
    setY: function(y){
        this._position.y = y;
    },
    getY: function(){
        return this._position.y;
    }
});
ccs.PositionFrame.create = function(){
    return new ccs.PositionFrame();
};
ccs.ScaleFrame = ccs.Frame.extend({
    _scaleX: null,
    _scaleY: null,
    _betweenScaleX: null,
    _betweenScaleY: null,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._scaleX = 1;
        this._scaleY = 1;
    },
    onEnter: function(nextFrame){
        this._node.setScaleX(this._scaleX);
        this._node.setScaleY(this._scaleY);
        if(this._tween){
            this._betweenScaleX = nextFrame._scaleX - this._scaleX;
            this._betweenScaleY = nextFrame._scaleY - this._scaleY;
        }
    },
    apply: function(percent){
        if (this._tween && (this._betweenScaleX != 0 || this._betweenScaleY != 0)){
            var scaleX = this._scaleX + this._betweenScaleX * percent;
            var scaleY = this._scaleY + this._betweenScaleY * percent;
            this._node.setScaleX(scaleX);
            this._node.setScaleY(scaleY);
        }
    },
    clone: function(){
        var frame = new ccs.ScaleFrame();
        frame.setScaleX(this._scaleX);
        frame.setScaleY(this._scaleY);
        frame._cloneProperty(this);
        return frame;
    },
    setScale: function(scale){
        this._scaleX = scale;
        this._scaleY = scale;
    },
    setScaleX: function(scaleX){
        this._scaleX = scaleX;
    },
    getScaleX: function(){
        return this._scaleX;
    },
    setScaleY: function(scaleY){
        this._scaleY = scaleY;
    },
    getScaleY: function(){
        return this._scaleY;
    }
});
ccs.ScaleFrame.create = function(){
    return new ccs.ScaleFrame();
};
ccs.AnchorPointFrame = ccs.Frame.extend({
    _anchorPoint: null,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._anchorPoint = cc.p(0, 0);
    },
    onEnter: function(nextFrame){
        this._node.setAnchorPoint(this._anchorPoint);
    },
    clone: function(){
        var frame = new ccs.AnchorPointFrame();
        frame.setAnchorPoint(this._anchorPoint);
        frame._cloneProperty(this);
        return frame;
    },
    setAnchorPoint: function(point){
        this._anchorPoint = point;
    },
    getAnchorPoint: function(){
        return this._anchorPoint;
    }
});
ccs.AnchorPointFrame.create = function(){
    return new ccs.AnchorPointFrame();
};
ccs.InnerActionType = {
    LoopAction : 0,
    NoLoopAction : 1,
    SingleFrame : 2
};
ccs.InnerActionFrame = ccs.Frame.extend({
    _innerActionType: null,
    _startFrameIndex: null,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._innerActionType = ccs.InnerActionType.LoopAction;
        this._startFrameIndex = 0;
    },
    onEnter: function(nextFrame){
    },
    clone: function(){
        var frame = new ccs.InnerActionFrame();
        frame.setInnerActionType(this._innerActionType);
        frame.setStartFrameIndex(this._startFrameIndex);
        frame._cloneProperty(this);
        return frame;
    },
    setInnerActionType: function(type){
        this._innerActionType = type;
    },
    getInnerActionType: function(){
        return this._innerActionType;
    },
    setStartFrameIndex: function(frameIndex){
        this._startFrameIndex = frameIndex;
    },
    getStartFrameIndex: function(){
        return this._startFrameIndex;
    }
});
ccs.InnerActionFrame.create = function(){
    return new ccs.InnerActionFrame();
};
ccs.ColorFrame = ccs.Frame.extend({
    _alpha: null,
    _color: null,
    _betweenAlpha: null,
    _betweenRed: null,
    _betweenGreen: null,
    _betweenBlue: null,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._alpha = 255;
        this.color = cc.color(255, 255, 255);
    },
    onEnter: function(nextFrame){
        this._node.setOpacity(this._alpha);
        this._node.setColor(this._color);
        if(this._tween){
            this._betweenAlpha = nextFrame._alpha - this._alpha;
            var color = nextFrame._color;
            this._betweenRed   = color.r - this._color.r;
            this._betweenGreen = color.g - this._color.g;
            this._betweenBlue  = color.b - this._color.b;
        }
    },
    apply: function(percent){
        if (this._tween && (this._betweenAlpha !=0 || this._betweenRed != 0 || this._betweenGreen != 0 || this._betweenBlue != 0)){
            var alpha = this._alpha + this._betweenAlpha * percent;
            var color = cc.color(255, 255, 255);
            color.r = this._color.r + this._betweenRed   * percent;
            color.g = this._color.g + this._betweenGreen * percent;
            color.b = this._color.b + this._betweenBlue  * percent;
            this._node.setOpacity(alpha);
            this._node.setColor(color);
        }
    },
    clone: function(){
        var frame = new ccs.ColorFrame();
        frame.setAlpha(this._alpha);
        frame.setColor(this._color);
        frame._cloneProperty(this);
        return frame;
    },
    setAlpha: function(alpha){
        this._alpha = alpha;
    },
    getAlpha: function(){
        return this._alpha;
    },
    setColor: function(color){
        this._color = color;
    },
    getColor: function(){
        return this._color;
    }
});
ccs.ColorFrame.create = function(){
    return new ccs.ColorFrame();
};
ccs.EventFrame = ccs.Frame.extend({
    _event: null,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._event = "";
    },
    onEnter: function(nextFrame){
        this._emitEvent();
    },
    clone: function(){
        var frame = new ccs.EventFrame();
        frame.setEvent(this._event);
        frame._cloneProperty(this);
        return frame;
    },
    setEvent: function(event){
        this._event = event;
    },
    getEvent: function(){
        return this._event;
    }
});
ccs.EventFrame.create = function(){
    return new ccs.EventFrame();
};
ccs.ZOrderFrame = ccs.Frame.extend({
    _zorder: null,
    onEnter: function(nextFrame){
        if(this._node)
            this._node.setLocalZOrder(this._zorder);
    },
    clone: function(){
        var frame = new ccs.ZOrderFrame();
        frame.setZOrder(this._zorder);
        frame._cloneProperty(this);
        return frame;
    },
    setZOrder: function(zorder){
        this._zorder = zorder;
    },
    getZOrder: function(){
        return this._zorder;
    }
});
ccs.ZOrderFrame.create = function(){
    return new ccs.ZOrderFrame();
};
(function(studio){
    var timeline = {
        ClassName_Node: "Node",
        ClassName_SubGraph: "SubGraph",
        ClassName_Sprite: "Sprite",
        ClassName_Particle: "Particle",
        ClassName_Panel: "Panel",
        ClassName_Button: "Button",
        ClassName_CheckBox: "CheckBox",
        ClassName_ImageView: "ImageView",
        ClassName_TextAtlas: "TextAtlas",
        ClassName_LabelAtlas: "LabelAtlas",
        ClassName_LabelBMFont: "LabelBMFont",
        ClassName_TextBMFont: "TextBMFont",
        ClassName_Text: "Text",
        ClassName_LoadingBar: "LoadingBar",
        ClassName_TextField: "TextField",
        ClassName_Slider: "Slider",
        ClassName_Layout: "Layout",
        ClassName_ScrollView: "ScrollView",
        ClassName_ListView: "ListView",
        ClassName_PageView: "PageView",
        ClassName_Widget: "Widget",
        ClassName_Label: "Label",
        NODE: "nodeTree",
        CHILDREN: "children",
        CLASSNAME: "classname",
        FILE_PATH: "fileName",
        PLIST_FILE: "plistFile",
        TAG: "tag",
        ACTION_TAG: "actionTag",
        OPTIONS: "options",
        WIDTH: "width",
        HEIGHT: "height",
        X: "x",
        Y: "y",
        SCALE_X: "scaleX",
        SCALE_Y: "scaleY",
        SKEW_X: "skewX",
        SKEW_Y: "skewY",
        ROTATION: "rotation",
        ROTATION_SKEW_X: "rotationSkewX",
        ROTATION_SKEW_Y: "rotationSkewY",
        ANCHOR_X: "anchorPointX",
        ANCHOR_Y: "anchorPointY",
        ALPHA: "opacity",
        RED: "colorR",
        GREEN: "colorG",
        BLUE: "colorB",
        ZORDER: "ZOrder",
        PARTICLE_NUM: "particleNum",
        FLIPX: "flipX",
        FLIPY: "flipY",
        VISIBLE: "visible",
        TEXTURES: "textures",
        TEXTURES_PNG: "texturesPng"
    };
    studio.NodeReader = {
        _funcs: null,
        _recordJsonPath: true,
        _jsonPath: "",
        _sharedNodeReader: null,
        init: function(){
            this._funcs = {};
            this._funcs[timeline.ClassName_Node] = studio.NodeReader._loadSimpleNode.bind(this);
            this._funcs[timeline.ClassName_SubGraph] = studio.NodeReader._loadSubGraph.bind(this);
            this._funcs[timeline.ClassName_Sprite] = studio.NodeReader._loadSprite.bind(this);
            this._funcs[timeline.ClassName_Particle] = studio.NodeReader._loadParticle.bind(this);
            this._funcs[timeline.ClassName_LabelAtlas] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_LabelBMFont] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_Panel] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_Button] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_CheckBox] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_ImageView] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_TextAtlas] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_TextBMFont] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_Text] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_LoadingBar] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_TextField] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_Slider] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_Layout] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_ScrollView] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_ListView] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_PageView] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_Widget] = studio.NodeReader._loadWidget.bind(this);
            this._funcs[timeline.ClassName_Label] = studio.NodeReader._loadWidget.bind(this);
        },
        createNode: function(filename){
            if(this._recordJsonPath){
                var jsonPath = filename.substr(0, filename.lastIndexOf('/') + 1);
                studio.uiReader.setFilePath(jsonPath);
                this._jsonPath = jsonPath;
            }else{
                studio.uiReader.setFilePath("");
                this._jsonPath = "";
            }
            return this.loadNodeWithFile(filename);
        },
        loadNodeWithFile: function(fileName){
            var json = cc.loader.getRes(fileName);
            var node = this.loadNodeWithContent(json);
            studio.ActionTimelineCache.loadAnimationActionWithContent(fileName, json);
            return node;
        },
        loadNodeWithContent: function(json){
            var length = json[timeline.TEXTURES].length;
            for(var i=0; i<length; i++)
            {
                var plist = json[timeline.TEXTURES][i];
                var png   = json[timeline.TEXTURES_PNG][i];
                plist = this._jsonPath + plist;
                png   = this._jsonPath + png;
                cc.spriteFrameCache.addSpriteFrames(plist, png);
            }
            var subJson = json[timeline.NODE];
            return this._loadNode(subJson);
        },
        setRecordJsonPath: function(record){
            this._recordJsonPath = record;
        },
        isRecordJsonPath: function(){
            return this._recordJsonPath;
        },
        setJsonPath: function(jsonPath){
            this._jsonPath = jsonPath;
        },
        getJsonPath: function(){
            return this._jsonPath;
        },
        _loadNode: function(json){
            var node = null;
            var nodeType = json[timeline.CLASSNAME];
            var func = this._funcs[nodeType];
            if (func != null)
            {
                var options = json[timeline.OPTIONS];
                node = func(options);
            }
            if(node)
            {
                var length = (json[timeline.CHILDREN] && json[timeline.CHILDREN].length) ? json[timeline.CHILDREN].length : 0;
                for (var i = 0; i<length; i++)
                {
                    var dic = json[timeline.CHILDREN][i];
                    var child = this._loadNode(dic);
                    if (child)
                    {
                        var widgetChild = child;
                        if (widgetChild
                            && node instanceof ccui.Widget
                            && !(node instanceof ccui.Layout))
                        {
                            if (widgetChild.getPositionType() == ccui.Widget.POSITION_PERCENT)
                            {
                                widgetChild.setPositionPercent(cc.p(widgetChild.getPositionPercent().x + node.getAnchorPoint().x, widgetChild.getPositionPercent().y + node.getAnchorPoint().y));
                            }
                            widgetChild.setPosition(cc.p(widgetChild.getPositionX() + node.getAnchorPointInPoints().x, widgetChild.getPositionY() + node.getAnchorPointInPoints().y));
                        }
                        node.addChild(child);
                    }
                }
            }
            else
            {
                cc.log("Not supported NodeType: %s", nodeType.c_str());
            }
            return node;
        },
        _initNode: function(node, json){
            var width         = json[timeline.WIDTH];
            var height        = json[timeline.HEIGHT];
            var x             = json[timeline.X];
            var y             = json[timeline.Y];
            var scalex        = json[timeline.SCALE_X] || 1;
            var scaley        = json[timeline.SCALE_Y] || 1;
            var rotation      = json[timeline.ROTATION];
            var rotationSkewX = json[timeline.ROTATION_SKEW_X];
            var rotationSkewY = json[timeline.ROTATION_SKEW_Y];
            var skewx         = json[timeline.SKEW_X];
            var skewy         = json[timeline.SKEW_Y];
            var anchorx       = json[timeline.ANCHOR_X] || 0.5;
            var anchory       = json[timeline.ANCHOR_Y] || 0.5;
            var alpha         = json[timeline.ALPHA] || 255;
            var red           = json[timeline.RED] || 255;
            var green         = json[timeline.GREEN] || 255;
            var blue          = json[timeline.BLUE] || 255;
            var zorder	      = json[timeline.ZORDER];
            var tag           = json[timeline.TAG];
            var actionTag     = json[timeline.ACTION_TAG];
            var visible       = json[timeline.VISIBLE];
            if(x && y && (x != 0 || y != 0))
                node.setPosition(x, y);
            if(scalex != 1)
                node.setScaleX(scalex);
            if(scaley != 1)
                node.setScaleY(scaley);
            if (rotation && rotation != 0)
                node.setRotation(rotation);
            if(rotationSkewX)
                node.setRotationSkewX(rotationSkewX);
            if(rotationSkewY)
                node.setRotationSkewY(rotationSkewY);
            if(skewx)
                node.setSkewX(skewx);
            if(skewy)
                node.setSkewY(skewy);
            if(anchorx != 0.5 || anchory != 0.5)
                node.setAnchorPoint(cc.p(anchorx, anchory));
            if(width && height && (width != 0 || height != 0))
                node.setContentSize(cc.size(width, height));
            if(zorder)
                node.setLocalZOrder(zorder);
            if(visible !== undefined && visible != true)
                node.setVisible(visible);
            if(alpha != 255){
                node.setOpacity(alpha);
            }
            if(red != 255 || green != 255 || blue != 255){
                node.setColor(cc.color(red, green, blue));
            }
            if(tag != null)
                node.setTag(tag);
            if(actionTag)
                node.setUserObject(new studio.ActionTimelineData(actionTag));
        },
        _loadSimpleNode: function(json){
            var node = new cc.Node();
            this._initNode(node, json);
            return node;
        },
        _loadSubGraph: function(json){
            var filePath = json[timeline.FILE_PATH];
            var node = null;
            if (filePath && "" != filePath)
            {
                node = this.createNode(filePath);
            }
            else
            {
                node = new cc.Node();
            }
            node.retain();
            this._initNode(node, json);
            return node;
        },
        _loadSprite: function(json){
            var filePath = json[timeline.FILE_PATH];
            var sprite = null;
            if(filePath != null){
                var path = filePath;
                var spriteFrame = cc.spriteFrameCache.getSpriteFrame(path);
                if(!spriteFrame){
                    path = this._jsonPath + path;
                    sprite = new cc.Sprite(path);
                }else{
                    sprite = cc.Sprite.createWithSpriteFrame(spriteFrame);
                }
                if(!sprite){
                    sprite = new cc.Sprite();
                    cc.log("filePath is empty. Create a sprite with no texture");
                }
            }else{
                sprite = new cc.Sprite();
            }
            sprite.retain();
            this._initNode(sprite, json);
            var flipX          = json[timeline.FLIPX];
            var flipY          = json[timeline.FLIPY];
            if(flipX != false)
                sprite.setFlippedX(flipX);
            if(flipY != false)
                sprite.setFlippedY(flipY);
            return sprite;
        },
        _loadParticle: function(json){
            var filePath = json[timeline.PLIST_FILE];
            var num = json[timeline.PARTICLE_NUM];
            var particle = new studio.ParticleSystemQuad(filePath);
            particle.setTotalParticles(num);
            particle.retain();
            this._initNode(particle, json);
            return particle;
        },
        _loadWidget: function(json){
            var str = json[timeline.CLASSNAME];
            if(str == null)
                return null;
            var classname = str;
            if (classname == "Panel")
            {
                classname = "Layout";
            }
            else if (classname == "TextArea")
            {
                classname = "Text";
            }
            else if (classname == "TextButton")
            {
                classname = "Button";
            }
            else if (classname == "Label")
            {
                classname = "Text";
            }
            else if (classname == "LabelAtlas")
            {
                classname = "TextAtlas";
            }
            else if (classname == "LabelBMFont")
            {
                classname = "TextBMFont";
            }
            var readerName = classname;
            readerName.append("Reader");
            var widget = studio.objectFactory.createObject(classname);
            var reader = studio.objectFactory.createObject(readerName);
            var guiReader = new studio.WidgetPropertiesReader0300();
            guiReader.setPropsForAllWidgetFromJsonDictionary(reader, widget, json);
            var actionTag = json[timeline.ACTION_TAG];
            widget.setUserObject(new studio.ActionTimelineData(actionTag));
            this._initNode(widget, json);
            return widget;
        }
    };
    studio.NodeReader.init();
})(ccs);
ccs.Timeline = ccs.Class.extend({
    _frames: null,
    _currentKeyFrame: null,
    _currentKeyFrameIndex: null,
    _fromIndex: null,
    _toIndex: null,
    _betweenDuration: null,
    _actionTag: null,
    _ActionTimeline: null,
    _node: null,
    ctor: function(){
        this._frames = [];
        this._currentKeyFrame = null;
        this._currentKeyFrameIndex = 0;
        this._fromIndex = 0;
        this._toIndex = 0;
        this._betweenDuration = 0;
        this._actionTag = 0;
        this._ActionTimeline = null;
        this._node = null;
    },
    _gotoFrame: function(frameIndex){
        if(this._frames.length == 0)
            return;
        this._binarySearchKeyFrame(frameIndex);
        this._apply(frameIndex);
    },
    _stepToFrame: function(frameIndex){
        if(this._frames.length == 0)
            return;
        this._updateCurrentKeyFrame(frameIndex);
        this._apply(frameIndex);
    },
    getFrames: function(){
        return this._frames;
    },
    addFrame: function(frame){
        this._frames.push(frame);
        frame.setTimeline(this)
    },
    insertFrame: function(frame, index){
        this._frames.splice(index, 0, frame);
        frame.setTimeline(this);
    },
    removeFrame: function(frame){
        cc.arrayRemoveObject(this._frames, frame);
        frame.setTimeline(null);
    },
    setActionTag: function(tag){
        this._actionTag = tag;
    },
    getActionTag: function(){
        return this._actionTag;
    },
    setNode: function(node){
        for (var i=0; i<this._frames.length; i++)
        {
            var frame = this._frames[i];
            frame.setNode(node);
        }
    },
    getNode: function(){
        return this._node;
    },
    setActionTimeline: function(action){
        this._ActionTimeline = action;
    },
    getActionTimeline: function(){
        return this._ActionTimeline;
    },
    clone: function(){
        var timeline = new ccs.Timeline();
        timeline._actionTag = this._actionTag;
        for (var i=0;i<this._frames.length;i++)
        {
            var frame = this._frames[i];
            var newFrame = frame.clone();
            timeline.addFrame(newFrame);
        }
        return timeline;
    },
    _apply: function(frameIndex){
        if (this._currentKeyFrame)
        {
            var currentPercent = this._betweenDuration == 0 ? 0 : (frameIndex - this._currentKeyFrameIndex) / this._betweenDuration;
            this._currentKeyFrame.apply(currentPercent);
        }
    },
    _binarySearchKeyFrame: function(frameIndex){
        var from = null;
        var to   = null;
        var length = this._frames.length;
        var needEnterFrame = false;
        do
        {
            if (frameIndex <= this._frames[0].getFrameIndex())
            {
                if(this._currentKeyFrameIndex >= this._frames[0].getFrameIndex())
                    needEnterFrame = true;
                from = to = this._frames[0];
                this._currentKeyFrameIndex = 0;
                this._betweenDuration = this._frames[0].getFrameIndex();
                break;
            }
            else if(frameIndex >= this._frames[length - 1].getFrameIndex())
            {
                from = to = this._frames[length - 1];
                this._currentKeyFrameIndex = this._frames[length - 1].getFrameIndex();
                this._betweenDuration = 0;
                break;
            }
            var target = -1;
            var low = 0,
                high = length - 1,
                mid = 0;
            while(low <= high){
                mid = Math.ceil(( low + high )/2);
                if(frameIndex >= this._frames[mid].getFrameIndex() && frameIndex < this._frames[mid + 1].getFrameIndex())
                {
                    target = mid;
                    break;
                }
                if(this._frames[mid].getFrameIndex()>frameIndex)
                    high = mid - 1;
                else
                    low = mid + 1;
            }
            from = this._frames[target];
            to   = this._frames[target+1];
            if(target == 0 && this._currentKeyFrameIndex < from.getFrameIndex())
                needEnterFrame = true;
            this._currentKeyFrameIndex = from.getFrameIndex();
            this._betweenDuration = to.getFrameIndex() - from.getFrameIndex();
        } while (0);
        if(needEnterFrame || this._currentKeyFrame != from)
        {
            this._currentKeyFrame = from;
            this._currentKeyFrame.onEnter(to);
        }
    },
    _updateCurrentKeyFrame: function(frameIndex){
        if (frameIndex < this._currentKeyFrameIndex || frameIndex >= this._currentKeyFrameIndex + this._betweenDuration)
        {
            var from = null;
            var to = null;
            do
            {
                var length = this._frames.length;
                if (frameIndex < this._frames[0].getFrameIndex())
                {
                    from = to = this._frames[0];
                    this._currentKeyFrameIndex = 0;
                    this._betweenDuration = this._frames[0].getFrameIndex();
                    break;
                }
                else if(frameIndex >= this._frames[length - 1].getFrameIndex())
                {
                    from = to = this._frames[length - 1];
                    this._currentKeyFrameIndex = this._frames[length - 1].getFrameIndex();
                    this._betweenDuration = 0;
                    break;
                }
                do{
                    this._fromIndex = this._toIndex;
                    from = this._frames[this._fromIndex];
                    this._currentKeyFrameIndex  = from.getFrameIndex();
                    this._toIndex = this._fromIndex + 1;
                    if (this._toIndex >= length)
                    {
                        this._toIndex = 0;
                    }
                    to = this._frames[this._toIndex];
                    if (frameIndex == from.getFrameIndex())
                    {
                        break;
                    }
                }while (frameIndex < from.getFrameIndex() || frameIndex >= to.getFrameIndex());
                this._betweenDuration = to.getFrameIndex() - from.getFrameIndex();
            } while (0);
            this._currentKeyFrame = from;
            this._currentKeyFrame.onEnter(to);
        }
    }
});
ccs.Timeline.create = function(){
    return new ccs.Timeline();
};
