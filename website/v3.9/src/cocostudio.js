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
ccui.LayoutComponent_ReferencePoint = {
    BOTTOM_LEFT: 0,
    TOP_LEFT: 1,
    BOTTOM_RIGHT: 2,
    TOP_RIGHT: 3
};
ccui.LayoutComponent_PositionType = {
    Position: 0,
    RelativePosition: 1,
    PreRelativePosition: 2,
    PreRelativePositionEnable: 3
};
ccui.LayoutComponent_SizeType = {
    Size: 0,
    PreSize: 1,
    PreSizeEnable: 2
};
ccui.LayoutComponent = cc.Component.extend({
    _horizontalEdge: 0,
    _verticalEdge: 0,
    _leftMargin: 0,
    _rightMargin: 0,
    _bottomMargin: 0,
    _topMargin: 0,
    _usingPositionPercentX: false,
    _positionPercentX: 0,
    _usingPositionPercentY: false,
    _positionPercentY: 0,
    _usingStretchWidth: false,
    _usingStretchHeight: false,
    _percentWidth: 0,
    _usingPercentWidth: false,
    _percentHeight: 0,
    _usingPercentHeight: false,
    _actived: true,
    _isPercentOnly: false,
    ctor: function () {
        this._name = ccui.LayoutComponent.NAME;
    },
    init: function () {
        var ret = true;
        if (!cc.Component.prototype.init.call(this)) {
            return false;
        }
        return ret;
    },
    getPercentContentSize: function () {
        return cc.p(this._percentWidth, this._percentHeight);
    },
    setPercentContentSize: function (percent) {
        this.setPercentWidth(percent.x);
        this.setPercentHeight(percent.y);
    },
    setUsingPercentContentSize: function (isUsed) {
        this._usingPercentWidth = this._usingPercentHeight = isUsed;
    },
    SetActiveEnable: function (enable) {
        this._actived = enable;
    },
    getUsingPercentContentSize: function () {
        return this._usingPercentWidth && this._usingPercentHeight;
    },
    getAnchorPosition: function () {
        return this._owner.getAnchorPoint();
    },
    setAnchorPosition: function (point, y) {
        var oldRect = this._owner.getBoundingBox();
        this._owner.setAnchorPoint(point, y);
        var newRect = this._owner.getBoundingBox();
        var offSetX = oldRect.x - newRect.x, offSetY = oldRect.y - newRect.y;
        var ownerPosition = this._owner.getPosition();
        ownerPosition.x += offSetX;
        ownerPosition.y += offSetY;
        this.setPosition(ownerPosition);
    },
    getPosition: function () {
        return this._owner.getPosition();
    },
    setPosition: function (position, y) {
        var parent = this._getOwnerParent(), x;
        if (parent != null) {
            if (y === undefined) {
                x = position.x;
                y = position.y;
            } else
                x = position;
            var parentSize = parent.getContentSize();
            if (parentSize.width !== 0)
                this._positionPercentX = x / parentSize.width;
            else {
                this._positionPercentX = 0;
                if (this._usingPositionPercentX)
                    x = 0;
            }
            if (parentSize.height !== 0)
                this._positionPercentY = y / parentSize.height;
            else {
                this._positionPercentY = 0;
                if (this._usingPositionPercentY)
                    y = 0;
            }
            this._owner.setPosition(x, y);
            this._refreshHorizontalMargin();
            this._refreshVerticalMargin();
        } else
            this._owner.setPosition(position, y);
    },
    isPositionPercentXEnabled: function () {
        return this._usingPositionPercentX;
    },
    setPositionPercentXEnabled: function (isUsed) {
        this._usingPositionPercentX = isUsed;
        if (this._usingPositionPercentX)
            this._horizontalEdge = ccui.LayoutComponent.horizontalEdge.NONE;
    },
    getPositionPercentX: function () {
        return this._positionPercentX;
    },
    setPositionPercentX: function (percentMargin) {
        this._positionPercentX = percentMargin;
        var parent = this._getOwnerParent();
        if (parent !== null) {
            this._owner.setPositionX(parent.width * this._positionPercentX);
            this._refreshHorizontalMargin();
        }
    },
    isPositionPercentYEnabled: function () {
        return this._usingPositionPercentY;
    },
    setPositionPercentYEnabled: function (isUsed) {
        this._usingPositionPercentY = isUsed;
        if (this._usingPositionPercentY)
            this._verticalEdge = ccui.LayoutComponent.verticalEdge.NONE;
    },
    getPositionPercentY: function () {
        return this._positionPercentY;
    },
    setPositionPercentY: function (percentMargin) {
        this._positionPercentY = percentMargin;
        var parent = this._getOwnerParent();
        if (parent !== null) {
            this._owner.setPositionY(parent.height * this._positionPercentY);
            this._refreshVerticalMargin();
        }
    },
    getHorizontalEdge: function () {
        return this._horizontalEdge;
    },
    setHorizontalEdge: function (hEdge) {
        this._horizontalEdge = hEdge;
        if (this._horizontalEdge !== ccui.LayoutComponent.horizontalEdge.NONE)
            this._usingPositionPercentX = false;
        var parent = this._getOwnerParent();
        if (parent !== null) {
            var ownerPoint = this._owner.getPosition();
            var parentSize = parent.getContentSize();
            if (parentSize.width !== 0)
                this._positionPercentX = ownerPoint.x / parentSize.width;
            else {
                this._positionPercentX = 0;
                ownerPoint.x = 0;
                if (this._usingPositionPercentX)
                    this._owner.setPosition(ownerPoint);
            }
            this._refreshHorizontalMargin();
        }
    },
    getVerticalEdge: function () {
        return this._verticalEdge;
    },
    setVerticalEdge: function (vEdge) {
        this._verticalEdge = vEdge;
        if (this._verticalEdge !== ccui.LayoutComponent.verticalEdge.NONE)
            this._usingPositionPercentY = false;
        var parent = this._getOwnerParent();
        if (parent !== null) {
            var ownerPoint = this._owner.getPosition();
            var parentSize = parent.getContentSize();
            if (parentSize.height !== 0)
                this._positionPercentY = ownerPoint.y / parentSize.height;
            else {
                this._positionPercentY = 0;
                ownerPoint.y = 0;
                if (this._usingPositionPercentY)
                    this._owner.setPosition(ownerPoint);
            }
            this._refreshVerticalMargin();
        }
    },
    getLeftMargin: function () {
        return this._leftMargin;
    },
    setLeftMargin: function (margin) {
        this._leftMargin = margin;
    },
    getRightMargin: function () {
        return this._rightMargin;
    },
    setRightMargin: function (margin) {
        this._rightMargin = margin;
    },
    getTopMargin: function () {
        return this._topMargin;
    },
    setTopMargin: function (margin) {
        this._topMargin = margin;
    },
    getBottomMargin: function () {
        return this._bottomMargin;
    },
    setBottomMargin: function (margin) {
        this._bottomMargin = margin;
    },
    getSize: function () {
        return this.getOwner().getContentSize();
    },
    setSize: function (size) {
        var parent = this._getOwnerParent();
        if (parent !== null) {
            var ownerSize = size, parentSize = parent.getContentSize();
            if (parentSize.width !== 0)
                this._percentWidth = ownerSize.width / parentSize.width;
            else {
                this._percentWidth = 0;
                if (this._usingPercentWidth)
                    ownerSize.width = 0;
            }
            if (parentSize.height !== 0)
                this._percentHeight = ownerSize.height / parentSize.height;
            else {
                this._percentHeight = 0;
                if (this._usingPercentHeight)
                    ownerSize.height = 0;
            }
            this._owner.setContentSize(ownerSize);
            this._refreshHorizontalMargin();
            this._refreshVerticalMargin();
        }
        else
            this._owner.setContentSize(size);
    },
    isPercentWidthEnabled: function () {
        return this._usingPercentWidth;
    },
    setPercentWidthEnabled: function (isUsed) {
        this._usingPercentWidth = isUsed;
        if (this._usingPercentWidth)
            this._usingStretchWidth = false;
    },
    getSizeWidth: function () {
        return this._owner.width;
    },
    setSizeWidth: function (width) {
        var ownerSize = this._owner.getContentSize();
        ownerSize.width = width;
        var parent = this._getOwnerParent();
        if (parent !== null) {
            var parentSize = parent.getContentSize();
            if (parentSize.width !== 0)
                this._percentWidth = ownerSize.width / parentSize.width;
            else {
                this._percentWidth = 0;
                if (this._usingPercentWidth)
                    ownerSize.width = 0;
            }
            this._owner.setContentSize(ownerSize);
            this._refreshHorizontalMargin();
        } else
            this._owner.setContentSize(ownerSize);
    },
    getPercentWidth: function () {
        return this._percentWidth;
    },
    setPercentWidth: function (percentWidth) {
        this._percentWidth = percentWidth;
        var parent = this._getOwnerParent();
        if (parent !== null) {
            var ownerSize = this._owner.getContentSize();
            ownerSize.width = parent.width * this._percentWidth;
            this._owner.setContentSize(ownerSize);
            this._refreshHorizontalMargin();
        }
    },
    isPercentHeightEnabled: function () {
        return this._usingPercentHeight;
    },
    setPercentHeightEnabled: function (isUsed) {
        this._usingPercentHeight = isUsed;
        if (this._usingPercentHeight)
            this._usingStretchHeight = false;
    },
    getSizeHeight: function () {
        return this._owner.height;
    },
    setSizeHeight: function (height) {
        var ownerSize = this._owner.getContentSize();
        ownerSize.height = height;
        var parent = this._getOwnerParent();
        if (parent !== null) {
            var parentSize = parent.getContentSize();
            if (parentSize.height !== 0)
                this._percentHeight = ownerSize.height / parentSize.height;
            else {
                this._percentHeight = 0;
                if (this._usingPercentHeight)
                    ownerSize.height = 0;
            }
            this._owner.setContentSize(ownerSize);
            this._refreshVerticalMargin();
        }
        else
            this._owner.setContentSize(ownerSize);
    },
    getPercentHeight: function () {
        return this._percentHeight;
    },
    setPercentHeight: function (percentHeight) {
        this._percentHeight = percentHeight;
        var parent = this._getOwnerParent();
        if (parent !== null) {
            var ownerSize = this._owner.getContentSize();
            ownerSize.height = parent.height * this._percentHeight;
            this._owner.setContentSize(ownerSize);
            this._refreshVerticalMargin();
        }
    },
    isStretchWidthEnabled: function () {
        return this._usingStretchWidth;
    },
    setStretchWidthEnabled: function (isUsed) {
        this._usingStretchWidth = isUsed;
        if (this._usingStretchWidth)
            this._usingPercentWidth = false;
    },
    isStretchHeightEnabled: function () {
        return this._usingStretchHeight;
    },
    setStretchHeightEnabled: function (isUsed) {
        this._usingStretchHeight = isUsed;
        if (this._usingStretchHeight)
            this._usingPercentHeight = false;
    },
    setPercentOnlyEnabled: function(enable){
        this._isPercentOnly = enable;
    },
    setActiveEnabled: function (enable) {
        this._actived = enable;
    },
    refreshLayout: function () {
        if(!this._actived)
            return;
        var parent = this._getOwnerParent();
        if (parent === null)
            return;
        var parentSize = parent.getContentSize(), locOwner = this._owner;
        var ownerAnchor = locOwner.getAnchorPoint(), ownerSize = locOwner.getContentSize();
        var ownerPosition = locOwner.getPosition();
        switch (this._horizontalEdge) {
            case ccui.LayoutComponent.horizontalEdge.NONE:
                if (this._usingStretchWidth && !this._isPercentOnly) {
                    ownerSize.width = parentSize.width * this._percentWidth;
                    ownerPosition.x = this._leftMargin + ownerAnchor.x * ownerSize.width;
                } else {
                    if (this._usingPositionPercentX)
                        ownerPosition.x = parentSize.width * this._positionPercentX;
                    if (this._usingPercentWidth)
                        ownerSize.width = parentSize.width * this._percentWidth;
                }
                break;
            case ccui.LayoutComponent.horizontalEdge.LEFT:
                if(this._isPercentOnly)
                    break;
                if (this._usingPercentWidth || this._usingStretchWidth)
                    ownerSize.width = parentSize.width * this._percentWidth;
                ownerPosition.x = this._leftMargin + ownerAnchor.x * ownerSize.width;
                break;
            case ccui.LayoutComponent.horizontalEdge.RIGHT:
                if(this._isPercentOnly)
                    break;
                if (this._usingPercentWidth || this._usingStretchWidth)
                    ownerSize.width = parentSize.width * this._percentWidth;
                ownerPosition.x = parentSize.width - (this._rightMargin + (1 - ownerAnchor.x) * ownerSize.width);
                break;
            case ccui.LayoutComponent.horizontalEdge.CENTER:
                if(this._isPercentOnly)
                    break;
                if (this._usingStretchWidth) {
                    ownerSize.width = parentSize.width - this._leftMargin - this._rightMargin;
                    if (ownerSize.width < 0)
                        ownerSize.width = 0;
                    ownerPosition.x = this._leftMargin + ownerAnchor.x * ownerSize.width;
                } else {
                    if (this._usingPercentWidth)
                        ownerSize.width = parentSize.width * this._percentWidth;
                    ownerPosition.x = parentSize.width * this._positionPercentX;
                }
                break;
            default:
                break;
        }
        switch (this._verticalEdge) {
            case ccui.LayoutComponent.verticalEdge.NONE:
                if (this._usingStretchHeight && !this._isPercentOnly) {
                    ownerSize.height = parentSize.height * this._percentHeight;
                    ownerPosition.y = this._bottomMargin + ownerAnchor.y * ownerSize.height;
                } else {
                    if (this._usingPositionPercentY)
                        ownerPosition.y = parentSize.height * this._positionPercentY;
                    if (this._usingPercentHeight)
                        ownerSize.height = parentSize.height * this._percentHeight;
                }
                break;
            case ccui.LayoutComponent.verticalEdge.BOTTOM:
                if(this._isPercentOnly)
                    break;
                if (this._usingPercentHeight || this._usingStretchHeight)
                    ownerSize.height = parentSize.height * this._percentHeight;
                ownerPosition.y = this._bottomMargin + ownerAnchor.y * ownerSize.height;
                break;
            case ccui.LayoutComponent.verticalEdge.TOP:
                if(this._isPercentOnly)
                    break;
                if (this._usingPercentHeight || this._usingStretchHeight)
                    ownerSize.height = parentSize.height * this._percentHeight;
                ownerPosition.y = parentSize.height - (this._topMargin + (1 - ownerAnchor.y) * ownerSize.height);
                break;
            case ccui.LayoutComponent.verticalEdge.CENTER:
                if(this._isPercentOnly)
                    break;
                if (this._usingStretchHeight) {
                    ownerSize.height = parentSize.height - this._topMargin - this._bottomMargin;
                    if (ownerSize.height < 0)
                        ownerSize.height = 0;
                    ownerPosition.y = this._bottomMargin + ownerAnchor.y * ownerSize.height;
                } else {
                    if(this._usingPercentHeight)
                        ownerSize.height = parentSize.height * this._percentHeight;
                    ownerPosition.y = parentSize.height * this._positionPercentY;
                }
                break;
            default:
                break;
        }
        locOwner.setPosition(ownerPosition);
        locOwner.setContentSize(ownerSize);
        if(locOwner instanceof ccui.PageView){
            locOwner.forceDoLayout();
            var layoutVector = locOwner.getPages();
            for(var i=0; i<layoutVector.length; i++){
                ccui.helper.doLayout(layoutVector[i]);
            }
        }else{
            ccui.helper.doLayout(locOwner);
        }
    },
    _getOwnerParent: function () {
        return this._owner ? this._owner.getParent() : null;
    },
    _refreshHorizontalMargin: function () {
        var parent = this._getOwnerParent();
        if (parent === null)
            return;
        var ownerPoint = this._owner.getPosition(), ownerAnchor = this._owner.getAnchorPoint();
        var ownerSize = this._owner.getContentSize(), parentSize = parent.getContentSize();
        this._leftMargin = ownerPoint.x - ownerAnchor.x * ownerSize.width;
        this._rightMargin = parentSize.width - (ownerPoint.x + (1 - ownerAnchor.x) * ownerSize.width);
    },
    _refreshVerticalMargin: function () {
        var parent = this._getOwnerParent();
        if (parent === null)
            return;
        var ownerPoint = this._owner.getPosition(), ownerAnchor = this._owner.getAnchorPoint();
        var ownerSize = this._owner.getContentSize(), parentSize = parent.getContentSize();
        this._bottomMargin = ownerPoint.y - ownerAnchor.y * ownerSize.height;
        this._topMargin = parentSize.height - (ownerPoint.y + (1 - ownerAnchor.y) * ownerSize.height);
    }
});
ccui.LayoutComponent.horizontalEdge = {NONE: 0, LEFT: 1, RIGHT: 2, CENTER: 3};
ccui.LayoutComponent.verticalEdge = {NONE: 0, BOTTOM: 1, TOP: 2, CENTER: 3};
ccui.LayoutComponent.NAME = "__ui_layout";
ccui.LayoutComponent.bindLayoutComponent = function (node) {
    var layout = node.getComponent(ccui.LayoutComponent.NAME);
    if (layout !== undefined)
        return layout;
    layout = new ccui.LayoutComponent();
    if (layout && layout.init()) {
        node.addComponent(layout);
        return layout;
    }
    return null;
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
            throw new Error("cc.ComponentContainer.getComponent(): name should be non-null");
        name = name.trim();
        if(!this._components){
            this._components = {};
        }
        return this._components[name];
    },
    add:function(component){
        if(!component)
             throw new Error("cc.ComponentContainer.add(): component should be non-null");
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
            throw new Error("cc.ComponentContainer.remove(): name should be non-null");
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
        return this._components.length === 0;
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
        if (this._configFileList.indexOf(filePath) !== -1)
            return;
        this._configFileList.push(filePath);
        var basefilePath = this._initBaseFilePath(filePath);
        var str = cc.path.extname(filePath).toLowerCase();
        var dataInfo = new ccs.DataInfo();
        dataInfo.filename = filePath;
        dataInfo.basefilePath = basefilePath;
        if (str === ".xml")
            ccs.dataReaderHelper.addDataFromXML(filePath, dataInfo);
        else if (str === ".json" || str === ".exportjson")
            ccs.dataReaderHelper.addDataFromJson(filePath, dataInfo);
        else if(str === ".csb")
            ccs.dataReaderHelper.addDataFromBinaryCache(filePath, dataInfo);
    },
    addDataFromFileAsync: function (imagePath, plistPath, filePath, selector, target) {
        if (this._configFileList.indexOf(filePath) !== -1) {
            if (target && selector) {
                if (this._asyncRefTotalCount === 0 && this._asyncRefCount === 0)
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
        cc.director.getScheduler().schedule(fun, this, 0.1, false, 0, false, "armatrueDataHelper");
    },
    removeConfigFile: function (configFile) {
        var locFileList = this._configFileList;
        var len = locFileList.length;
        var it = locFileList[len];
        for (var i = 0;i<len; i++){
            if (locFileList[i] === configFile)
                it = i;
        }
        if (it !== locFileList[len])
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
        if (isArmature === 1) {
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
                movementData.tweenEasing = tweenEasing === 2 ? ccs.TweenType.SINE_EASEINOUT : tweenEasing;
            } else
                movementData.tweenEasing = ccs.TweenType.LINEAR;
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
            if (parentName !== "") {
                for (var j = 0; j < movBonesXml.length; j++) {
                    parentXML = movBonesXml[j];
                    if (parentName === parentXML.getAttribute(ccs.CONST_A_NAME))
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
        movementData.tweenEasing = json[ccs.CONST_A_TWEEN_EASING] == null ? ccs.TweenType.LINEAR : json[ccs.CONST_A_TWEEN_EASING];
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
        frameData.isTween = !(isTween != undefined && isTween === "false");
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
                    frameData.tweenEasing = (tweenEasing === 2) ? ccs.TweenType.SINE_EASEINOUT : tweenEasing;
            } else
                frameData.tweenEasing = ccs.TweenType.LINEAR;
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
        frameData.tweenEasing = json[ccs.CONST_A_TWEEN_EASING] || ccs.TweenType.LINEAR;
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
        if (!xmlStr) throw new Error("Please load the resource first : " + xml);
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
            atlas = new cc.TextureAtlas(texture, 20);
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
    if (node.skewX === -node.skewY) {
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
    CUSTOM_EASING: -1,
    LINEAR: 0,
    SINE_EASEIN: 1,
    SINE_EASEOUT: 2,
    SINE_EASEINOUT: 3,
    QUAD_EASEIN: 4,
    QUAD_EASEOUT: 5,
    QUAD_EASEINOUT: 6,
    CUBIC_EASEIN: 7,
    CUBIC_EASEOUT: 8,
    CUBIC_EASEINOUT: 9,
    QUART_EASEIN: 10,
    QUART_EASEOUT: 11,
    QUART_EASEINOUT: 12,
    QUINT_EASEIN: 13,
    QUINT_EASEOUT: 14,
    QUINT_EASEINOUT: 15,
    EXPO_EASEIN: 16,
    EXPO_EASEOUT: 17,
    EXPO_EASEINOUT: 18,
    CIRC_EASEIN: 19,
    CIRC_EASEOUT: 20,
    CIRC_EASEINOUT: 21,
    ELASTIC_EASEIN: 22,
    ELASTIC_EASEOUT: 23,
    ELASTIC_EASEINOUT: 24,
    BACK_EASEIN: 25,
    BACK_EASEOUT: 26,
    BACK_EASEINOUT: 27,
    BOUNCE_EASEIN: 28,
    BOUNCE_EASEOUT: 29,
    BOUNCE_EASEINOUT: 30,
    TWEEN_EASING_MAX: 10000
};
ccs.TweenFunction = ccs.TweenFunction || ccs.Class.extend({});
ccs.DOUBLE_PI = ccs.M_PI_X_2 = Math.PI * 2;
ccs.HALF_PI = ccs.M_PI_2 = Math.PI / 2;
ccs.M_PI = Math.PI;
ccs.TweenFunction.tweenTo = function (time, type, easingParam) {
    var delta = 0;
    switch (type) {
        case ccs.TweenType.CUSTOM_EASING:
            delta = this.customEase(time, easingParam);
            break;
        case ccs.TweenType.LINEAR:
            delta = this.linear(time);
            break;
        case ccs.TweenType.SINE_EASEIN:
            delta = this.sineEaseIn(time);
            break;
        case ccs.TweenType.SINE_EASEOUT:
            delta = this.sineEaseOut(time);
            break;
        case ccs.TweenType.SINE_EASEINOUT:
            delta = this.sineEaseInOut(time);
            break;
        case ccs.TweenType.QUAD_EASEIN:
            delta = this.quadEaseIn(time);
            break;
        case ccs.TweenType.QUAD_EASEOUT:
            delta = this.quadEaseOut(time);
            break;
        case ccs.TweenType.QUAD_EASEINOUT:
            delta = this.quadEaseInOut(time);
            break;
        case ccs.TweenType.CUBIC_EASEIN:
            delta = this.cubicEaseIn(time);
            break;
        case ccs.TweenType.CUBIC_EASEOUT:
            delta = this.cubicEaseOut(time);
            break;
        case ccs.TweenType.CUBIC_EASEINOUT:
            delta = this.cubicEaseInOut(time);
            break;
        case ccs.TweenType.QUART_EASEIN:
            delta = this.quartEaseIn(time);
            break;
        case ccs.TweenType.QUART_EASEOUT:
            delta = this.quartEaseOut(time);
            break;
        case ccs.TweenType.QUART_EASEINOUT:
            delta = this.quartEaseInOut(time);
            break;
        case ccs.TweenType.QUINT_EASEIN:
            delta = this.quintEaseIn(time);
            break;
        case ccs.TweenType.QUINT_EASEOUT:
            delta = this.quintEaseOut(time);
            break;
        case ccs.TweenType.QUINT_EASEINOUT:
            delta = this.quintEaseInOut(time);
            break;
        case ccs.TweenType.EXPO_EASEIN:
            delta = this.expoEaseIn(time);
            break;
        case ccs.TweenType.EXPO_EASEOUT:
            delta = this.expoEaseOut(time);
            break;
        case ccs.TweenType.EXPO_EASEINOUT:
            delta = this.expoEaseInOut(time);
            break;
        case ccs.TweenType.CIRC_EASEIN:
            delta = this.circEaseIn(time);
            break;
        case ccs.TweenType.CIRC_EASEOUT:
            delta = this.circEaseOut(time);
            break;
        case ccs.TweenType.CIRC_EASEINOUT:
            delta = this.circEaseInOut(time);
            break;
        case ccs.TweenType.ELASTIC_EASEIN:
            var period = 0.3;
            if(null != easingParam && easingParam.length > 0){
                period = easingParam[0];
            }
            delta = this.elasticEaseIn(time, period);
            break;
        case ccs.TweenType.ELASTIC_EASEOUT:
            var period = 0.3;
            if(null != easingParam && easingParam.length > 0){
                period = easingParam[0];
            }
            delta = this.elasticEaseOut(time, period);
            break;
        case ccs.TweenType.ELASTIC_EASEINOUT:
            var period = 0.3;
            if(null != easingParam && easingParam.length > 0){
                period = easingParam[0];
            }
            delta = this.elasticEaseInOut(time, period);
            break;
        case ccs.TweenType.BACK_EASEIN:
            delta = this.backEaseIn(time);
            break;
        case ccs.TweenType.BACK_EASEOUT:
            delta = this.backEaseOut(time);
            break;
        case ccs.TweenType.BACK_EASEINOUT:
            delta = this.backEaseInOut(time);
            break;
        case ccs.TweenType.BOUNCE_EASEIN:
            delta = this.bounceEaseIn(time);
            break;
        case ccs.TweenType.BOUNCE_EASEOUT:
            delta = this.bounceEaseOut(time);
            break;
        case ccs.TweenType.BOUNCE_EASEINOUT:
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
    return time === 0 ? 0 : Math.pow(2, 10 * (time - 1)) - 0.001;
};
ccs.TweenFunction.expoEaseOut = function (time) {
    return time === 1 ? 1 : (-Math.pow(2, -10 * time) + 1);
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
    if (time === 0 || time === 1) {
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
    if (time === 0 || time === 1) {
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
    if (time === 0 || time === 1) {
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
        if (startPos !== -1)
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
            this.tweenEasing = ccs.TweenType.LINEAR;
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
            if (this.easingParamNumber !== 0){
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
    this.tweenEasing = ccs.TweenType.LINEAR;
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
    return new ccs.DecorativeDisplay();
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
                    var displayTransform = node.getNodeToParentTransform();
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
                    var t = cc.affineTransformConcat(helpTransform, bone.getArmature().getNodeToParentTransform());
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
        if (startPos !== -1)
            textureName = textureName.substring(0, startPos);
        if (textureName === "")
            skin = new ccs.Skin();
        else
            skin = new ccs.Skin("#" + textureName + ".png");
        decoDisplay.setDisplay(skin);
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
        if (startPos !== -1)
            textureName = textureName.substring(0, startPos);
        var textureData = ccs.armatureDataManager.getTextureData(textureName);
        if (textureData) {
            skin.setAnchorPoint(cc.p(textureData.pivotX, textureData.pivotY));
        }
        if (ccs.ENABLE_PHYSICS_CHIPMUNK_DETECT || ccs.ENABLE_PHYSICS_SAVE_CALCULATED_VERTEX) {
            if (textureData && textureData.contourDataList.length > 0) {
                var colliderDetector = new ccs.ColliderDetector(bone);
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
        var armature = new ccs.Armature(displayData.displayName, bone);
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
        var system = new cc.ParticleSystem(displayData.displayName);
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
    ctor:function (bone) {
        this._decoDisplayList = [];
        this._currentDecoDisplay = null;
        this._displayRenderNode = null;
        this._displayIndex = null;
        this._forceChangeDisplay = false;
        this._bone = null;
        this._visible = true;
        this._displayType = ccs.DISPLAY_TYPE_MAX;
        bone && ccs.DisplayManager.prototype.init.call(this, bone);
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
            decoDisplay = new ccs.DecorativeDisplay();
            locDisplayList.push(decoDisplay);
        }
        if(display instanceof ccs.DisplayData){
            ccs.displayFactory.addDisplay(this._bone, decoDisplay, display);
            if(index === this._displayIndex) {
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
        if(index === this._displayIndex) {
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
        if (this._displayIndex === index)
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
            if (locDisplayList[i].getDisplayData().displayName === name) {
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
            var decoDisplay = new ccs.DecorativeDisplay();
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
        if(this._currentDecoDisplay.getDisplayData().displayType === ccs.DISPLAY_TYPE_SPRITE){
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
    return new ccs.DisplayManager(bone);
};
ccs.Skin = ccs.Sprite.extend({
    _skinData: null,
    bone: null,
    _skinTransform: null,
    _displayName: "",
    _armature: null,
    _className: "Skin",
    ctor: function (fileName, rect) {
        cc.Sprite.prototype.ctor.call(this);
        this._skinData = null;
        this.bone = null;
        this._displayName = "";
        this._skinTransform = cc.affineTransformIdentity();
        this._armature = null;
        if (fileName == null || fileName === "") {
            ccs.Skin.prototype.init.call(this);
        } else {
            if(fileName[0] === "#"){
                ccs.Skin.prototype.initWithSpriteFrameName.call(this, fileName.substr(1));
            } else {
                ccs.Skin.prototype.initWithFile.call(this, fileName, rect);
            }
        }
    },
    initWithSpriteFrameName: function (spriteFrameName) {
        if(spriteFrameName === "")
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
    initWithFile: function (fileName, rect) {
        var ret = rect ? cc.Sprite.prototype.initWithFile.call(this, fileName, rect)
                       : cc.Sprite.prototype.initWithFile.call(this, fileName);
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
        this._renderCmd.updateArmatureTransform();
    },
    getNodeToWorldTransform: function(){
        return this._renderCmd.getNodeToWorldTransform();
    },
    getNodeToWorldTransformAR: function(){
        return this._renderCmd.getNodeToWorldTransformAR();
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
    },
    _createRenderCmd: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new ccs.Skin.CanvasRenderCmd(this);
        else
            return new ccs.Skin.WebGLRenderCmd(this);
    }
});
var _p = ccs.Skin.prototype;
_p.skinData;
cc.defineGetterSetter(_p, "skinData", _p.getSkinData, _p.setSkinData);
_p.displayName;
cc.defineGetterSetter(_p, "displayName", _p.getDisplayName);
_p = null;
ccs.Skin.create = function (fileName, rect) {
    return new ccs.Skin(fileName, rect);
};
ccs.Skin.createWithSpriteFrameName = function (spriteFrameName) {
    return new ccs.Skin("#" + spriteFrameName);
};
(function(){
    ccs.Skin.RenderCmd = {
        updateArmatureTransform: function () {
            var node = this._node;
            this._transform = cc.affineTransformConcat(
                node._skinTransform,
                node.bone.getNodeToArmatureTransform()
            );
            this._dirtyFlag = this._dirtyFlag & cc.Node._dirtyFlags.transformDirty ^ this._dirtyFlag;
        },
        getNodeToWorldTransform: function () {
            return cc.affineTransformConcat(this._transform, this._node.bone.getArmature().getNodeToWorldTransform());
        },
        getNodeToWorldTransformAR: function () {
            var displayTransform = this._transform, node = this._node;
            this._anchorPointInPoints = cc.pointApplyAffineTransform(this._anchorPointInPoints, displayTransform);
            displayTransform.tx = this._anchorPointInPoints.x;
            displayTransform.ty = this._anchorPointInPoints.y;
            return cc.affineTransformConcat(displayTransform, node.bone.getArmature().getNodeToWorldTransform());
        }
    };
    ccs.Skin.CanvasRenderCmd = function(renderable){
        cc.Sprite.CanvasRenderCmd.call(this, renderable);
        this._needDraw = true;
    };
    var proto = ccs.Skin.CanvasRenderCmd.prototype = Object.create(cc.Sprite.CanvasRenderCmd.prototype);
    cc.inject(ccs.Skin.RenderCmd, proto);
    proto.constructor = ccs.Skin.CanvasRenderCmd;
})();
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
        this._tweenEasing = ccs.TweenType.LINEAR;
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
        if (locLoopType === ccs.ANIMATION_TYPE_NO_LOOP)
            locLoopType = ccs.ANIMATION_TYPE_MAX;
        else if (locLoopType === ccs.ANIMATION_TYPE_TO_LOOP_FRONT)
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
    ctor: function (armature) {
        ccs.ProcessBase.prototype.ctor.call(this);
        this._tweenList = [];
        this._movementList = [];
        this._frameEventQueue = [];
        this._movementEventQueue = [];
        this._armature = null;
        armature && ccs.ArmatureAnimation.prototype.init.call(this, armature);
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
        if (speedScale === this._speedScale)
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
        durationTo = (durationTo === -1) ? this._movementData.durationTo : durationTo;
        var durationTween = this._movementData.durationTween === 0 ? this._rawDuration : this._movementData.durationTween;
        var tweenEasing = this._movementData.tweenEasing;
        loop = (loop < 0) ? this._movementData.loop : loop;
        this._onMovementList = false;
        ccs.ProcessBase.prototype.play.call(this, durationTo, durationTween, loop, tweenEasing);
        if (this._rawDuration === 0)
            this._loopType = ccs.ANIMATION_TYPE_SINGLE_FRAME;
        else {
            this._loopType = loop ? ccs.ANIMATION_TYPE_TO_LOOP_FRONT : ccs.ANIMATION_TYPE_NO_LOOP;
            this._durationTween = durationTween;
        }
        this._tweenList.length = 0;
        var movementBoneData, map = this._armature.getBoneDic();
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
                    this._currentFrame = this._nextFrameIndex === 0 ? 0 : ccs.fmodf(this._currentFrame, this._nextFrameIndex);
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
        if(arguments.length === 1){
            this._movementEventListener = callFunc;
        }else if(arguments.length === 2){
            this._movementEventTarget = target;
            this._movementEventCallFunc = callFunc;
        }
    },
    setFrameEventCallFunc: function (callFunc, target) {
        if(arguments.length === 1){
            this._frameEventListener = callFunc;
        }else if(arguments.length === 2){
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
        if(this._animationData !== data)
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
    return new ccs.ArmatureAnimation(armature);
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
    ctor:function (bone) {
        ccs.ProcessBase.prototype.ctor.call(this);
        this._frameTweenEasing = ccs.TweenType.LINEAR;
        ccs.Tween.prototype.init.call(this, bone);
    },
    init:function (bone) {
        this._from = new ccs.FrameData();
        this._between = new ccs.FrameData();
        this._bone = bone;
        this._tweenData = this._bone.getTweenData();
        this._tweenData.displayIndex = -1;
        this._animation = (this._bone !== null && this._bone.getArmature() !== null) ?
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
        var difMovement = movementBoneData !== this._movementBoneData;
        this.setMovementBoneData(movementBoneData);
        this._rawDuration = this._movementBoneData.duration;
        var nextKeyFrame = this._movementBoneData.getFrameData(0);
        this._tweenData.displayIndex = nextKeyFrame.displayIndex;
        if (this._bone.getArmature().getArmatureData().dataVersion >= ccs.CONST_VERSION_COMBINED)        {
            ccs.TransformHelp.nodeSub(this._tweenData, this._bone.getBoneData());
            this._tweenData.scaleX += 1;
            this._tweenData.scaleY += 1;
        }
        if (this._rawDuration === 0) {
            this._loopType = ccs.ANIMATION_TYPE_SINGLE_FRAME;
            if (durationTo === 0)
                this.setBetween(nextKeyFrame, nextKeyFrame);
            else
                this.setBetween(this._tweenData, nextKeyFrame);
            this._frameTweenEasing = ccs.TweenType.LINEAR;
        }
        else if (this._movementBoneData.frameList.length > 1) {
            this._durationTween = durationTween * this._movementBoneData.scale;
            if (loop && this._movementBoneData.delay !== 0)
                this.setBetween(this._tweenData, this.tweenNodeTo(this.updateFrameData(1 - this._movementBoneData.delay), this._between));
            else {
                if (!difMovement || durationTo === 0)
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
        var locCurrentPercent = this._currentPercent == null ? 1 : this._currentPercent;
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
                    if (this._movementBoneData.delay !== 0) {
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
        if (this._frameTweenEasing !== ccs.TweenType.TWEEN_EASING_MAX)
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
                if (keyFrameData.movement !== "")
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
        if (currentPercent > 1 && this._movementBoneData.delay !== 0)
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
                if (playedTime === from.frameID|| (this._passLastFrame && this._fromIndex === length-1))
                    break;
            } while  (playedTime < from.frameID || playedTime >= to.frameID);
            locBetweenDuration = to.frameID - from.frameID;
            this._frameTweenEasing = from.tweenEasing;
            this.setBetween(from, to, false);
            this._totalDuration = locTotalDuration;
            this._betweenDuration = locBetweenDuration;
            this._toIndex = locToIndex;
        }
        currentPercent = locBetweenDuration === 0 ? 0 : (playedTime - this._totalDuration) / this._betweenDuration;
        var tweenType = (this._frameTweenEasing !== ccs.TweenType.LINEAR) ? this._frameTweenEasing : this._tweenEasing;
        if (tweenType !== ccs.TweenType.TWEEN_EASING_MAX && tweenType !== ccs.TweenType.LINEAR && !this._passLastFrame) {
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
    return new ccs.Tween(bone);
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
    ctor: function (bone) {
        this._colliderBodyList = [];
        this._bone = null;
        this._body = null;
        this._active = false;
        this._filter = null;
        ccs.ColliderDetector.prototype.init.call(this, bone);
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
            if (body && body.getContourData() === contourData)
                eraseList.push(body);
        }
        for (i=0; i<eraseList.length; i++)
            cc.arrayRemoveObject(locBodyList, eraseList[i]);
    },
    removeAll: function () {
        this._colliderBodyList.length = 0;
    },
    setActive: function (active) {
        if (this._active === active)
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
    return new ccs.ColliderDetector(bone);
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
    ctor: function (name, parentBone) {
        cc.Node.prototype.ctor.call(this);
        this._name = "";
        this._topBoneList = [];
        this._armatureIndexDic = {};
        this._offsetPoint = cc.p(0, 0);
        this._armatureTransformDirty = true;
        this._blendFunc = {src: cc.BLEND_SRC, dst: cc.BLEND_DST};
        name && ccs.Armature.prototype.init.call(this, name, parentBone);
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
        var armatureDataManager = ccs.armatureDataManager;
        var animationData;
        if (name !== "") {
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
            name = "new_armature";
            this.armatureData = new ccs.ArmatureData();
            this.armatureData.name = name;
            animationData = new ccs.AnimationData();
            animationData.name = name;
            armatureDataManager.addArmatureData(name, this.armatureData);
            armatureDataManager.addAnimationData(name, animationData);
            this.animation.setAnimationData(animationData);
        }
        this._renderCmd.initShaderCache();
        this.setCascadeOpacityEnabled(true);
        this.setCascadeColorEnabled(true);
        return true;
    },
    addChild: function (child, localZOrder, tag) {
        if(child instanceof ccui.Widget){
            cc.log("Armature doesn't support to add Widget as its child, it will be fix soon.");
            return;
        }
        cc.Node.prototype.addChild.call(this, child, localZOrder, tag);
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
            bone = new ccs.Bone(boneName);
            this.addBone(bone, parentName);
        } else {
            bone = new ccs.Bone(boneName);
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
        if (rect.width !== 0 && rect.height !== 0)
            this.setAnchorPoint(locOffsetPoint.x / rect.width, locOffsetPoint.y / rect.height);
    },
    getOffsetPoints: function(){
        return {x: this._offsetPoint.x, y: this._offsetPoint.y};
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
    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        this.scheduleUpdate();
    },
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        this.unscheduleUpdate();
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
                if (r.x === 0 && r.y === 0 && r.width === 0 && r.height === 0)
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
        if (this._body === body)
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
    setBlendFunc: function (blendFunc, dst) {
        if(dst === undefined){
            this._blendFunc.src = blendFunc.src;
            this._blendFunc.dst = blendFunc.dst;
        } else {
            this._blendFunc.src = blendFunc;
            this._blendFunc.dst = dst;
        }
    },
    getBlendFunc: function () {
        return new cc.BlendFunc(this._blendFunc.src, this._blendFunc.dst);
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
    _createRenderCmd: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new ccs.Armature.CanvasRenderCmd(this);
        else
            return new ccs.Armature.WebGLRenderCmd(this);
    }
});
var _p = ccs.Armature.prototype;
_p.parentBone;
cc.defineGetterSetter(_p, "parentBone", _p.getParentBone, _p.setParentBone);
_p.body;
cc.defineGetterSetter(_p, "body", _p.getBody, _p.setBody);
_p.colliderFilter;
cc.defineGetterSetter(_p, "colliderFilter", null, _p.setColliderFilter);
_p = null;
ccs.Armature.create = function (name, parentBone) {
    return new ccs.Armature(name, parentBone);
};
(function(){
    ccs.Armature.RenderCmd = {
        _updateAnchorPointInPoint: function(){
            var node = this._node;
            var contentSize = node._contentSize, anchorPoint = node._anchorPoint, offsetPoint = node._offsetPoint;
            this._anchorPointInPoints.x = contentSize.width * anchorPoint.x - offsetPoint.x;
            this._anchorPointInPoints.y = contentSize.height * anchorPoint.y - offsetPoint.y;
            this._realAnchorPointInPoints.x = contentSize.width * anchorPoint.x;
            this._realAnchorPointInPoints.y = contentSize.height * anchorPoint.y;
            this.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        },
        getAnchorPointInPoints: function(){
            return cc.p(this._realAnchorPointInPoints);
        }
    };
})();
(function(){
    ccs.Armature.CanvasRenderCmd = function(renderableObject){
        cc.Node.CanvasRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._realAnchorPointInPoints = new cc.Point(0,0);
        this._startRenderCmd = new cc.CustomRenderCmd(this, this._startCmdCallback);
        this._RestoreRenderCmd = new cc.CustomRenderCmd(this, this._RestoreCmdCallback);
    };
    var proto = ccs.Armature.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    cc.inject(ccs.Armature.RenderCmd, proto);
    proto.constructor = ccs.Armature.CanvasRenderCmd;
    proto._startCmdCallback = function(ctx, scaleX, scaleY){
        var node = this._node, parent = node._parent;
        this.transform(parent ? parent._renderCmd : null);
        var wrapper = ctx || cc._renderContext;
        wrapper.save();
        wrapper._switchToArmatureMode(true, this._worldTransform, scaleX, scaleY);
    };
    proto.transform = function(parentCmd, recursive){
        ccs.Node.CanvasRenderCmd.prototype.transform.call(this, parentCmd, recursive);
        var locChildren = this._node._children;
        for (var i = 0, len = locChildren.length; i< len; i++) {
            var selBone = locChildren[i];
            if (selBone && selBone.getDisplayRenderNode) {
                var selNode = selBone.getDisplayRenderNode();
                if (selNode && selNode._renderCmd){
                    var cmd = selNode._renderCmd;
                    cmd.transform(null);
                    var parentColor = selBone._renderCmd._displayedColor, parentOpacity = selBone._renderCmd._displayedOpacity;
                    var flags = cc.Node._dirtyFlags, locFlag = cmd._dirtyFlag;
                    var colorDirty = locFlag & flags.colorDirty,
                        opacityDirty = locFlag & flags.opacityDirty;
                    if(colorDirty)
                        cmd._updateDisplayColor(parentColor);
                    if(opacityDirty)
                        cmd._updateDisplayOpacity(parentOpacity);
                }
            }
        }
    };
    proto._RestoreCmdCallback = function(wrapper){
        this._cacheDirty = false;
        wrapper._switchToArmatureMode(false);
        wrapper.restore();
    };
    proto.initShaderCache = function(){};
    proto.setShaderProgram = function(){};
    proto.updateChildPosition = function(ctx, dis){
        cc.renderer.pushRenderCommand(dis._renderCmd);
    };
    proto.rendering = function(ctx, scaleX, scaleY){
        var node = this._node;
        var locChildren = node._children;
        var alphaPremultiplied = cc.BlendFunc.ALPHA_PREMULTIPLIED, alphaNonPremultipled = cc.BlendFunc.ALPHA_NON_PREMULTIPLIED;
        for (var i = 0, len = locChildren.length; i< len; i++) {
            var selBone = locChildren[i];
            if (selBone && selBone.getDisplayRenderNode) {
                var selNode = selBone.getDisplayRenderNode();
                if (null === selNode)
                    continue;
                switch (selBone.getDisplayRenderNodeType()) {
                    case ccs.DISPLAY_TYPE_SPRITE:
                        if(selNode instanceof ccs.Skin)
                            this.updateChildPosition(ctx, selNode, selBone, alphaPremultiplied, alphaNonPremultipled);
                        break;
                    case ccs.DISPLAY_TYPE_ARMATURE:
                        selNode._renderCmd.rendering(ctx, scaleX, scaleY);
                        break;
                    default:
                        selNode.visit(this);
                        break;
                }
            } else if(selBone instanceof cc.Node) {
                this._visitNormalChild(selBone);
            }
        }
    };
    proto._visitNormalChild = function(childNode){
        if(childNode == null)
            return;
        var cmd = childNode._renderCmd;
        if (!childNode._visible)
            return;
        cmd._curLevel = this._curLevel + 1;
        var i, children = childNode._children, child;
        cmd._syncStatus(this);
        cmd.transform(null);
        var len = children.length;
        if (len > 0) {
            childNode.sortAllChildren();
            for (i = 0; i < len; i++) {
                child = children[i];
                if (child._localZOrder < 0)
                    child._renderCmd.visit(cmd);
                else
                    break;
            }
            cc.renderer.pushRenderCommand(cmd);
            for (; i < len; i++)
                children[i]._renderCmd.visit(cmd);
        } else {
            cc.renderer.pushRenderCommand(cmd);
        }
        this._dirtyFlag = 0;
    };
    proto.visit = function(parentCmd){
        var node = this._node;
        if (!node._visible)
            return;
        this.updateStatus(parentCmd);
        node.sortAllChildren();
        cc.renderer.pushRenderCommand(this._startRenderCmd);
        this.rendering();
        cc.renderer.pushRenderCommand(this._RestoreRenderCmd);
        this._cacheDirty = false;
    };
})();
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
    ctor: function (name) {
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
        ccs.Bone.prototype.init.call(this, name);
    },
    init: function (name) {
        if (name)
            this._name = name;
        this._tweenData = new ccs.FrameData();
        this._tween = new ccs.Tween(this);
        this._displayManager = new ccs.DisplayManager(this);
        this._worldInfo = new ccs.BaseData();
        this._boneData = new ccs.BaseData();
        return true;
    },
    setBoneData: function (boneData) {
        cc.assert(boneData, "_boneData must not be null");
        if(this._boneData !== boneData)
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
            locWorldInfo.skewX = locTweenData.skewX + this._skewX + cc.degreesToRadians(this._rotationX);
            locWorldInfo.skewY = locTweenData.skewY + this._skewY - cc.degreesToRadians(this._rotationY);
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
        if (locBlendFunc.src !== srcValue || locBlendFunc.dst !== dstValue) {
            locBlendFunc.src = srcValue;
            locBlendFunc.dst = dstValue;
            this.blendDirty = true;
        }
    },
    updateColor: function () {
        var display = this._displayManager.getDisplayRenderNode();
        if (display !== null) {
            var cmd = this._renderCmd;
            display.setColor(
                cc.color(
                        cmd._displayedColor.r * this._tweenData.r / 255,
                        cmd._displayedColor.g * this._tweenData.g / 255,
                        cmd._displayedColor.b * this._tweenData.b / 255));
            display.setOpacity(cmd._displayedOpacity * this._tweenData.a / 255);
        }
    },
    updateZOrder: function () {
        if (this._armature.getArmatureData().dataVersion >= ccs.CONST_VERSION_COMBINED) {
            this.setLocalZOrder(this._tweenData.zOrder + this._boneData.zOrder);
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
        if (this._children.length > 0 && this._children.getIndex(bone) !== -1 ) {
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
        if (this._childArmature !== armature) {
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
        if (this._localZOrder !== zOrder)
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
        return new cc.BlendFunc(this._blendFunc.src, this._blendFunc.dst);
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
    },
    _createRenderCmd: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new ccs.Bone.CanvasRenderCmd(this);
        else
            return new ccs.Bone.WebGLRenderCmd(this);
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
    return new ccs.Bone(name);
};
ccs.Bone.RenderCmd = {
    _updateColor: function(){
        var node = this._node;
        var display = node._displayManager.getDisplayRenderNode();
        if (display !== null) {
            var displayCmd = display._renderCmd;
            display.setColor(cc.color( node._tweenData.r, node._tweenData.g, node._tweenData.g));
            display.setOpacity(node._tweenData.a);
            displayCmd._syncDisplayColor(this._displayedColor);
            displayCmd._syncDisplayOpacity(this._displayedOpacity);
            displayCmd._updateColor();
        }
    }
};
(function(){
    ccs.Bone.CanvasRenderCmd  = function(renderable){
        cc.Node.CanvasRenderCmd.call(this, renderable);
        this._needDraw = false;
    };
    var proto = ccs.Bone.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    cc.inject(ccs.Bone.RenderCmd, proto);
    proto.constructor = ccs.Bone.CanvasRenderCmd;
})();
(function(){
    if(!cc.Node.WebGLRenderCmd)
        return;
    ccs.Bone.WebGLRenderCmd = function(renderable){
        cc.Node.WebGLRenderCmd.call(this, renderable);
        this._needDraw = false;
    };
    var proto = ccs.Bone.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    cc.inject(ccs.Bone.RenderCmd, proto);
    proto.constructor = ccs.Bone.WebGLRenderCmd;
})();
ccs.FRAME_TYPE_MOVE = 0;
ccs.FRAME_TYPE_SCALE = 1;
ccs.FRAME_TYPE_ROTATE = 2;
ccs.FRAME_TYPE_TINT = 3;
ccs.FRAME_TYPE_FADE = 4;
ccs.FRAME_TYPE_MAX = 5;
ccs.FrameEaseType = {
    CUSTOM : -1,
    LINEAR : 0,
    SINE_EASEIN : 1,
    SINE_EASEOUT : 2,
    SINE_EASEINOUT : 3,
    QUAD_EASEIN : 4,
    QUAD_EASEOUT : 5,
    QUAD_EASEINOUT : 6,
    CUBIC_EASEIN : 7,
    CUBIC_EASEOUT : 8,
    CUBIC_EASEINOUT : 9,
    QUART_EASEIN : 10,
    QUART_EASEOUT : 11,
    QUART_EASEINOUT : 12,
    QUINT_EASEIN : 13,
    QUINT_EASEOUT : 14,
    QUINT_EASEINOUT : 15,
    EXPO_EASEIN : 16,
    EXPO_EASEOUT : 17,
    EXPO_EASEINOUT : 18,
    CIRC_EASEIN : 19,
    CIRC_EASEOUT : 20,
    CIRC_EASEINOUT : 21,
    ELASTIC_EASEIN : 22,
    ELASTIC_EASEOUT : 23,
    ELASTIC_EASEINOUT : 24,
    BACK_EASEIN : 25,
    BACK_EASEOUT : 26,
    BACK_EASEINOUT : 27,
    BOUNCE_EASEIN : 28,
    BOUNCE_EASEOUT : 29,
    BOUNCE_EASEINOUT : 30,
    TWEEN_EASING_MAX: 1000
};
ccs.ActionFrame = ccs.Class.extend({
    frameType: 0,
    easingType: 0,
    frameIndex: 0,
    _Parameter: null,
    time: 0,
    ctor: function () {
        this.frameType = 0;
        this.easingType = ccs.FrameEaseType.LINEAR;
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
            case ccs.FrameEaseType.CUSTOM:
                break;
            case ccs.FrameEaseType.LINEAR:
                resultAction = action;
                break;
            case ccs.FrameEaseType.SINE_EASEIN:
                resultAction = action.easing(cc.easeSineIn());
                break;
            case ccs.FrameEaseType.SINE_EASEOUT:
                resultAction = action.easing(cc.easeSineOut());
                break;
            case ccs.FrameEaseType.SINE_EASEINOUT:
                resultAction = action.easing(cc.easeSineInOut());
                break;
            case ccs.FrameEaseType.QUAD_EASEIN:
                resultAction = action.easing(cc.easeQuadraticActionIn());
                break;
            case ccs.FrameEaseType.QUAD_EASEOUT:
                resultAction = action.easing(cc.easeQuadraticActionOut());
                break;
            case ccs.FrameEaseType.QUAD_EASEINOUT:
                resultAction = action.easing(cc.easeQuadraticActionInOut());
                break;
            case ccs.FrameEaseType.CUBIC_EASEIN:
                resultAction = action.easing(cc.easeCubicActionIn());
                break;
            case ccs.FrameEaseType.CUBIC_EASEOUT:
                resultAction = action.easing(cc.easeCubicActionOut());
                break;
            case ccs.FrameEaseType.CUBIC_EASEINOUT:
                resultAction = action.easing(cc.easeCubicActionInOut());
                break;
            case ccs.FrameEaseType.QUART_EASEIN:
                resultAction = action.easing(cc.easeQuarticActionIn());
                break;
            case ccs.FrameEaseType.QUART_EASEOUT:
                resultAction = action.easing(cc.easeQuarticActionOut());
                break;
            case ccs.FrameEaseType.QUART_EASEINOUT:
                resultAction = action.easing(cc.easeQuarticActionInOut());
                break;
            case ccs.FrameEaseType.QUINT_EASEIN:
                resultAction = action.easing(cc.easeQuinticActionIn());
                break;
            case ccs.FrameEaseType.QUINT_EASEOUT:
                resultAction = action.easing(cc.easeQuinticActionOut());
                break;
            case ccs.FrameEaseType.QUINT_EASEINOUT:
                resultAction = action.easing(cc.easeQuinticActionInOut());
                break;
            case ccs.FrameEaseType.EXPO_EASEIN:
                resultAction = action.easing(cc.easeExponentialIn());
                break;
            case ccs.FrameEaseType.EXPO_EASEOUT:
                resultAction = action.easing(cc.easeExponentialOut());
                break;
            case ccs.FrameEaseType.EXPO_EASEINOUT:
                resultAction = action.easing(cc.easeExponentialInOut());
                break;
            case ccs.FrameEaseType.CIRC_EASEIN:
                resultAction = action.easing(cc.easeCircleActionIn());
                break;
            case ccs.FrameEaseType.CIRC_EASEOUT:
                resultAction = action.easing(cc.easeCircleActionOut());
                break;
            case ccs.FrameEaseType.CIRC_EASEINOUT:
                resultAction = action.easing(cc.easeCircleActionInOut());
                break;
            case ccs.FrameEaseType.ELASTIC_EASEIN:
                resultAction = action.easing(cc.easeElasticIn());
                break;
            case ccs.FrameEaseType.ELASTIC_EASEOUT:
                resultAction = action.easing(cc.easeElasticOut());
                break;
            case ccs.FrameEaseType.ELASTIC_EASEINOUT:
                resultAction = action.easing(cc.easeElasticInOut());
                break;
            case ccs.FrameEaseType.BACK_EASEIN:
                resultAction = action.easing(cc.easeBackIn());
                break;
            case ccs.FrameEaseType.BACK_EASEOUT:
                resultAction = action.easing(cc.easeBackOut());
                break;
            case ccs.FrameEaseType.BACK_EASEINOUT:
                resultAction = action.easing(cc.easeBackInOut());
                break;
            case ccs.FrameEaseType.BOUNCE_EASEIN:
                resultAction = action.easing(cc.easeBounceIn());
                break;
            case ccs.FrameEaseType.BOUNCE_EASEOUT:
                resultAction = action.easing(cc.easeBounceOut());
                break;
            case ccs.FrameEaseType.BOUNCE_EASEINOUT:
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
        var path = jsonName;
        var pos = path.lastIndexOf("/");
        var fileName = path.substr(pos + 1, path.length);
        var actionList = this._actionDic[fileName];
        if (!actionList)
            return null;
        for (var i = 0; i < actionList.length; i++) {
            var locAction = actionList[i];
            if (actionName === locAction.getName())
                return locAction;
        }
        return null;
    },
    playActionByName: function (jsonName, actionName, fun) {
        var action = this.getActionByName(jsonName, actionName);
        if (action)
            action.play(fun);
    },
    stopActionByName: function (jsonName, actionName) {
        var action = this.getActionByName(jsonName, actionName);
        if (action)
            action.stop();
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
        if (this._object === null)
            return null;
        var locSpawnArray = [];
        for (var i = 0; i < this._frameArrayNum; i++) {
            var locArray = this._frameArray[i];
            if (locArray.length <= 0)
                continue;
            var locSequenceArray = [];
            for (var j = 0; j < locArray.length; j++) {
                var locFrame = locArray[j];
                var locAction = null;
                if (j !== 0) {
                    var locSrcFrame = locArray[j - 1];
                    var locDuration = (locFrame.frameIndex - locSrcFrame.frameIndex) * this.getUnitTime();
                    locAction = locFrame.getAction(locDuration);
                }
                else {
                    locAction = locFrame.getAction(0);
                }
                if(locAction)
                    locSequenceArray.push(locAction);
            }
            if(locSequenceArray){
                var locSequence = cc.sequence(locSequenceArray);
                if (locSequence !== null)
                    locSpawnArray.push(locSequence);
            }
        }
        this._action = null;
        this._actionSpawn = cc.spawn(locSpawnArray);
        return this._actionSpawn;
    },
    playAction: function (fun) {
        if (this._object === null || this._actionSpawn === null)
            return;
        if(fun)
            this._action = cc.sequence(this._actionSpawn, fun);
        else
            this._action = cc.sequence(this._actionSpawn);
        this._runAction();
    },
    _runAction: function () {
        var node = this.getActionNode();
        if (node !== null && this._action !== null)
            node.runAction(this._action);
    },
    stopAction: function () {
        var node = this.getActionNode();
        if (node !== null && this._action !== null) {
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
            if (locArray === null)
                continue;
            for (var j = 0; j < locArray.length; j++) {
                var locFrame = locArray[j];
                if (locFrame.frameIndex * locUnitTime === time) {
                    this._easingToFrame(1.0, 1.0, locFrame);
                    locIsFindFrame = true;
                    break;
                } else if (locFrame.frameIndex * locUnitTime > time) {
                    if (j === 0) {
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
        if (this._action === null)
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
            this._scheduler.schedule(this.simulationActionUpdate, this, 0, cc.REPEAT_FOREVER, 0, false, this.__instanceId + "");
        if(fun !== undefined)
            this._callback = fun;
    },
    pause: function () {
        this._pause = true;
        this._playing = false;
    },
    stop: function () {
        var locActionNodeList = this._actionNodeList;
        for (var i = 0; i < locActionNodeList.length; i++)
            locActionNodeList[i].stopAction();
        this._scheduler.unschedule(this.simulationActionUpdate, this);
        this._pause = false;
        this._playing = false;
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
            if (this._callback !== null)
                this._callback.execute();
            if (this._loop)
                this.play();
            else{
                this._playing = false;
                this._scheduler.unschedule(this.simulationActionUpdate, this);
            }
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
        ccs.ComAttribute.prototype.init.call(this);
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
    return new ccs.ComAttribute();
};
ccs.ComAudio = ccs.Component.extend({
    _filePath: "",
    _loop: false,
    ctor: function () {
        cc.Component.prototype.ctor.call(this);
        this._name = "Audio";
        ccs.ComAudio.prototype.init.call(this);
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
    return new ccs.ComAudio();
};
ccs.ComController = ccs.Component.extend({
    ctor: function () {
        cc.Component.prototype.ctor.call(this);
        this._name = "ComController";
        ccs.ComController.prototype.init.call(this);
    },
    onEnter: function () {
        if (this._owner !== null)
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
    return new ccs.ComController();
};
ccs.ComRender = ccs.Component.extend({
    _render: null,
    ctor: function (node, comName) {
        cc.Component.prototype.ctor.call(this);
        this._render = node;
        this._name = comName;
        this.isRenderer = true;
        ccs.ComRender.prototype.init.call(this);
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
    return new ccs.ComRender(node, comName);
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
            var triggerObj = new ccs.TriggerObj();
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
        if (eventTriggers.indexOf(triggerObj) === -1) {
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
            if (locAmd && locAmd[0] === armature) {
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
            if (locAmd && locAmd[0] === armature)
                locAmd.removeAnimationEventCallBack(callFunc, target);
        }
    },
    removeArmatureAllMovementCallBack: function (armature) {
        if (armature == null)
            return;
        var locAmd;
        for (var i = 0; i < this._movementDispatches.length; i++) {
            locAmd = this._movementDispatches[i];
            if (locAmd && locAmd[0] === armature) {
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
            if (locEventAni[0] === target) {
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
        ccs.TriggerObj.prototype.init.call(this);
    },
    init: function () {
        this._cons = [];
        this._acts = [];
        this._vInt = [];
        return true;
    },
    detect: function () {
        if (!this._enable || this._cons.length === 0) {
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
        if (!this._enable || this._acts.length === 0)
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
    return new ccs.TriggerObj();
};
ccs.ActionTimelineData = ccs.Class.extend({
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
ccs.AnimationInfo = function(name, start, end){
    this.name = name;
    this.startIndex = start;
    this.endIndex = end;
};
ccs.ComExtensionData = ccs.Component.extend({
    _customProperty: null,
    _timelineData: null,
    _name: "ComExtensionData",
    ctor: function(){
        this._customProperty = "";
        this._timelineData = new ccs.ActionTimelineData(0);
        return true;
    },
    setActionTag: function(actionTag){
        this._timelineData.setActionTag(actionTag);
    },
    getActionTag: function(){
        return this._timelineData.getActionTag();
    },
    setCustomProperty: function(customProperty){
        this._customProperty = customProperty;
    },
    getCustomProperty: function(){
        return this._customProperty;
    }
});
ccs.ComExtensionData.create = function(){
    return new ccs.ComExtensionData();
};
ccs.ActionTimelineData.create = function(actionTag){
    return new ccs.ActionTimelineData(actionTag);
};
ccs.ActionTimeline = cc.Action.extend({
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
    _animationInfos: null,
    _lastFrameListener: null,
    ctor: function(){
        cc.Action.prototype.ctor.call(this);
        this._timelineMap = {};
        this._timelineList = [];
        this._animationInfos = {};
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
        endIndex = num[1] !== undefined ? num[1] : this._duration;
        currentFrameIndex = num[2] || startIndex;
        loop = bool!=null ? bool : true;
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
        if (frameIndex >= this._startFrame && frameIndex <= this._endFrame){
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
        if (this._timelineMap[tag].indexOf(timeline) === -1) {
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
        var newAction = new ccs.ActionTimeline();
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
        if (!this._playing || this._timelineMap.length === 0 || this._duration === 0)
        {
            return;
        }
        this._time += delta * this._timeSpeed;
        var endoffset = this._time - this._endFrame * this._frameInternal;
        if(endoffset < this._frameInternal){
            this._currentFrame = this._time / this._frameInternal;
            this._stepToFrame(this._currentFrame);
            if(endoffset >= 0 && this._lastFrameListener)
                this._lastFrameListener();
        }else{
            this._playing = this._loop;
            if(!this._playing){
                this._time = this._endFrame * this._frameInternal;
                if (this._currentFrame != this._endFrame){
                    this._currentFrame = this._endFrame;
                    this._stepToFrame(this._currentFrame);
                    if(this._lastFrameListener)
                        this._lastFrameListener();
                }
            }else
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
            var data = child.getComponent("ComExtensionData");
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
    },
    play: function(name, loop){
        var info = this._animationInfos[name];
        if (!info)
            return cc.log("Can't find animation info for %s", name);
        this.gotoFrameAndPlay(info.startIndex, info.endIndex, loop);
    },
    addAnimationInfo: function(info){
        this._animationInfos[info.name] = info;
    },
    removeAnimationInfo: function(name){
        delete this._animationInfos[name];
    },
    isAnimationInfoExists: function(name){
        return this._animationInfos[name];
    },
    getAnimationInfo: function(name){
        return this._animationInfos[name];
    },
    setLastFrameCallFunc: function(listener){
        this._lastFrameListener = listener;
    },
    clearLastFrameCallFunc: function(){
        this._lastFrameListener = null;
    }
});
ccs.ActionTimeline.create = function(){
    return new ccs.ActionTimeline();
};
ccs.Frame = ccs.Class.extend({
    _frameIndex: null,
    _tween: null,
    _timeline: null,
    _node: null,
    _tweenType: null,
    _easingParam: null,
    _enterWhenPassed: null,
    ctor: function(){
        this._frameIndex = 0;
        this._tween = true;
        this._timeline = null;
        this._node = null;
        this._enterWhenPassed = false;
        this._easingParam = [];
    },
    _emitEvent: function(){
        if (this._timeline){
            this._timeline.getActionTimeline()._emitFrameEvent(this);
        }
    },
    _cloneProperty: function(frame){
        this._frameIndex = frame.getFrameIndex();
        this._tween = frame.isTween();
        this._tweenType = frame.getTweenType();
        this.setEasingParams(frame.getEasingParams());
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
        if(!this._tween)
            return;
        if(this._tweenType !== ccs.FrameEaseType.TWEEN_EASING_MAX  && this._tweenType !==  ccs.FrameEaseType.LINEAR)
            percent = this.tweenPercent(percent);
        this._onApply(percent);
    },
    _onApply: function(percent){
    },
    clone: function(){
    },
    tweenPercent: function(percent){
        var func = ccs.Frame.tweenToMap[this._tweenType];
        if(func)
            return func(percent, this._easingParam);
        else
            return percent;
    },
    setEasingParams: function(easingParams){
        if(easingParams){
            this._easingParam.length = 0;
            for(var i=0; i<easingParams.length; i++)
                this._easingParam[i] = easingParams[i];
        }
    },
    getEasingParams: function(){
        return this._easingParam;
    },
    setTweenType: function(tweenType){
        this._tweenType = tweenType;
    },
    getTweenType: function(){
        return this._tweenType;
    },
    isEnterWhenPassed: function(){
        return this._enterWhenPassed;
    }
});
ccs.Frame.tweenToMap = {
    "-1": function(time, easingParam){
        if (easingParam)
        {
            var tt = 1 - time;
            return easingParam[1]*tt*tt*tt + 3*easingParam[3]*time*tt*tt + 3*easingParam[5]*time*time*tt + easingParam[7]*time*time*time;
        }
        return time;
    },
    1: cc._easeSineInObj.easing,//Sine_EaseIn
    2: cc._easeSineOutObj.easing,//Sine_EaseOut
    3: cc._easeSineInOutObj.easing,//Sine_EaseInOut
    4: cc._easeQuadraticActionIn.easing,//Quad_EaseIn
    5: cc._easeQuadraticActionOut.easing,//Quad_EaseOut
    6: cc._easeQuadraticActionInOut.easing,//Quad_EaseInOut
    7: cc._easeCubicActionIn.easing,
    8: cc._easeCubicActionOut.easing,//Cubic_EaseOut
    9: cc._easeCubicActionInOut.easing,//Cubic_EaseInOut
    10: cc._easeCubicActionIn.easing,//Cubic_EaseIn
    11: cc._easeCubicActionOut.easing,//Cubic_EaseOut
    12: cc._easeCubicActionInOut.easing,//Cubic_EaseInOut
    13: cc._easeQuinticActionIn.easing,//Quint_EaseIn
    14: cc._easeQuinticActionOut.easing,//Quint_EaseOut
    15: cc._easeQuinticActionInOut.easing,//Quint_EaseInOut
    16: cc._easeExponentialInObj.easing,//Expo_EaseIn
    17: cc._easeExponentialOutObj.easing,//Expo_EaseOut
    18: cc._easeExponentialInOutObj.easing,//Expo_EaseInOut
    19: cc._easeCircleActionIn.easing,//Circ_EaseIn
    20: cc._easeCircleActionOut.easing,//Circ_EaseOut
    21: cc._easeCircleActionInOut.easing,//Circ_EaseInOut
    22: function(time, easingParam){
        var period = 0.3;
        easingParam != null && ( period = easingParam[0] );
        return cc.easeElasticIn(period).easing(time);
    },//Elastic_EaesIn
    23: function(time, easingParam){
        var period = 0.3;
        easingParam != null && ( period = easingParam[0] );
        return cc.easeElasticOut(period).easing(time);
    },//Elastic_EaesOut
    24: function(time, easingParam){
        var period = 0.3;
        easingParam != null && ( period = easingParam[0] );
        return cc.easeElasticInOut(period).easing(time);
    },//Elastic_EaesInOut
    25: cc._easeBackInObj.easing,
    26: cc._easeBackOutObj.easing,
    27: cc._easeBackInOutObj.easing,
    28: cc._easeBounceInObj.easing,
    29: cc._easeBounceOutObj.easing,
    30: cc._easeBounceInOutObj.easing
};
ccs.VisibleFrame = ccs.Frame.extend({
    _visible: true,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._visible = true;
    },
    onEnter: function(nextFrame){
        if(this._node)
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
            var spriteBlendFunc = this._sprite.getBlendFunc();
            var spriteFrame = cc.spriteFrameCache._spriteFrames[this._textureName];
            if(spriteFrame != null)
                this._sprite.setSpriteFrame(spriteFrame);
            else
                this._sprite.setTexture(this._textureName);
            if(this._sprite.getBlendFunc() !== spriteBlendFunc)
                this._sprite.setBlendFunc(spriteBlendFunc);
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
        if(!this._node)
            return;
        this._node.setRotation(this._rotation);
        if(this._tween){
            this._betwennRotation = nextFrame._rotation - this._rotation;
        }
    },
    _onApply: function(percent){
        if (this._betwennRotation !== 0){
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
        if(!this._node)
            return;
        this._node.setSkewX(this._skewX);
        this._node.setSkewY(this._skewY);
        if(this._tween){
            this._betweenSkewX = nextFrame._skewX - this._skewX;
            this._betweenSkewY = nextFrame._skewY - this._skewY;
        }
    },
    _onApply: function(percent){
        if (this._betweenSkewX !== 0 || this._betweenSkewY !== 0)
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
        if(!this._node)
            return;
        this._node.setRotationX(this._skewX);
        this._node.setRotationY(this._skewY);
        if (this._tween){
            this._betweenSkewX = nextFrame._skewX - this._skewX;
            this._betweenSkewY = nextFrame._skewY - this._skewY;
        }
    },
    _onApply: function(percent){
        if (this._node && (this._betweenSkewX !== 0 || this._betweenSkewY !== 0)){
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
        if(!this._node)
            return;
        this._node.setPosition(this._position);
        if(this._tween){
            this._betweenX = nextFrame._position.x - this._position.x;
            this._betweenY = nextFrame._position.y - this._position.y;
        }
    },
    _onApply: function(percent){
        if (this._node && (this._betweenX !== 0 || this._betweenY !== 0)){
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
        if(!this._node)
            return;
        this._node.setScaleX(this._scaleX);
        this._node.setScaleY(this._scaleY);
        if(this._tween){
            this._betweenScaleX = nextFrame._scaleX - this._scaleX;
            this._betweenScaleY = nextFrame._scaleY - this._scaleY;
        }
    },
    _onApply: function(percent){
        if (this._node && (this._betweenScaleX !== 0 || this._betweenScaleY !== 0)){
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
        if(this._node)
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
    _endFrameIndex:0,
    _singleFrameIndex: 0,
    _enterWithName: null,
    _animationName: "",
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._enterWithName = false;
        this._innerActionType = ccs.InnerActionType.LoopAction;
        this._startFrameIndex = 0;
    },
    onEnter: function(nextFrame){
        if(!this._node)  return;
        var innerActiontimeline = this._node.getActionByTag(this._node.getTag());
        if(!innerActiontimeline) return;
        if (ccs.InnerActionType.SingleFrame === this._innerActionType){
            innerActiontimeline.gotoFrameAndPause(this._singleFrameIndex);
            return;
        }
        var innerStart = this._startFrameIndex;
        var innerEnd = this._endFrameIndex;
        if (this._enterWithName){
            if (this._animationName === "-- ALL --"){
                innerStart = 0;
                innerEnd = innerActiontimeline.getDuration();
            } else if(innerActiontimeline.isAnimationInfoExists(this._animationName)) {
                var info = innerActiontimeline.getAnimationInfo(this._animationName);
                innerStart = info.startIndex;
                innerEnd = info.endIndex;
            }else{
                cc.log("Animation %s not exists!", this._animationName);
            }
        }
        var duration = this._timeline.getActionTimeline().getDuration();
        var odddiff = duration - this._frameIndex - innerEnd + innerStart;
        if (odddiff < 0){
            innerEnd += odddiff;
        }
        if (ccs.InnerActionType.NoLoopAction === this._innerActionType){
            innerActiontimeline.gotoFrameAndPlay(innerStart, innerEnd, false);
        }else if (ccs.InnerActionType.LoopAction === this._innerActionType){
            innerActiontimeline.gotoFrameAndPlay(innerStart, innerEnd, true);
        }
    },
    setAnimationName: function(animationName){
        this._animationName = animationName;
    },
    setSingleFrameIndex: function(frameIndex){
        this._singleFrameIndex = frameIndex;
    },
    getSingleFrameIndex: function(){
        return this._startFrameIndex;
    },
    setEnterWithName: function(isEnterWithName){
        this._enterWithName = isEnterWithName;
    },
    getEnterWithName: function(){
        return this._enterWithName;
    },
    clone: function(){
        var frame = new ccs.InnerActionFrame();
        frame.setInnerActionType(this._innerActionType);
        frame.setStartFrameIndex(this._startFrameIndex);
        frame.setEnterWithName(this._enterWithName);
        frame.setAnimationName(this._animationName);
        frame.setSingleFrameIndex(this._singleFrameIndex);
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
        this._color = cc.color(255, 255, 255);
    },
    onEnter: function(nextFrame){
        if(!this._node)
            return;
        this._node.setColor(this._color);
        if(this._tween){
            var color = nextFrame._color;
            this._betweenRed   = color.r - this._color.r;
            this._betweenGreen = color.g - this._color.g;
            this._betweenBlue  = color.b - this._color.b;
        }
    },
    _onApply: function(percent){
        if (this._node && this._tween && (this._betweenAlpha !== 0 || this._betweenRed !== 0 || this._betweenGreen !== 0 || this._betweenBlue !== 0)){
            var color = cc.color(255, 255, 255);
            color.r = this._color.r + this._betweenRed   * percent;
            color.g = this._color.g + this._betweenGreen * percent;
            color.b = this._color.b + this._betweenBlue  * percent;
            this._node.setColor(color);
            if(this._alpha !== null){
                var alpha = this._alpha + this._betweenAlpha * percent;
                this._node.setOpacity(alpha);
            }
        }
    },
    clone: function(){
        var frame = new ccs.ColorFrame();
        frame.setColor(this._color);
        frame._cloneProperty(this);
        return frame;
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
ccs.AlphaFrame = ccs.Frame.extend({
    _alpha: null,
    _betweenAlpha: null,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._alpha = 255;
    },
    onEnter: function(nextFrame){
        if(!this._node)
            return;
        this._node.setOpacity(this._alpha);
        if(this._tween){
            this._betweenAlpha = nextFrame._alpha - this._alpha;
        }
    },
    _onApply: function(percent){
        if(!this._node)
            return;
        var alpha = this._alpha + this._betweenAlpha * percent;
        this._node.setOpacity(alpha);
    },
    setAlpha: function(alpha){
        this._alpha = alpha;
    },
    getAlpha: function(){
        return this._alpha;
    },
    clone: function(){
        var frame = new ccs.AlphaFrame();
        frame.setAlpha(this._alpha);
        frame._cloneProperty(this);
        return frame;
    }
});
ccs.EventFrame = ccs.Frame.extend({
    _event: null,
    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._event = "";
        this._enterWhenPassed = true;
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
ccs.BlendFuncFrame = ccs.Frame.extend({
    onEnter: function(nextFrame, currentFrameIndex){
        if(this._node)
            this._node.setBlendFunc(this._blendFunc);
    },
    clone: function(){
        var frame = new ccs.BlendFuncFrame();
        frame.setBlendFunc(this._blendFunc);
        frame._cloneProperty(this);
        return frame;
    },
    setBlendFunc: function(blendFunc){
        this._blendFunc = blendFunc;
    },
    getBlendFunc: function(){
        return this._blendFunc;
    }
});
ccs.BlendFuncFrame.create = function(){
    return new ccs.BlendFuncFrame();
};
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
        if(this._frames.length === 0)
            return;
        this._binarySearchKeyFrame(frameIndex);
        this._apply(frameIndex);
    },
    _stepToFrame: function(frameIndex){
        if(this._frames.length === 0)
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
        for (var i=0; i<this._frames.length; i++){
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
            var currentPercent = this._betweenDuration <= 0 ? 0 : (frameIndex - this._currentKeyFrameIndex) / this._betweenDuration;
            this._currentKeyFrame.apply(currentPercent);
        }
    },
    _binarySearchKeyFrame: function(frameIndex){
        var from = null;
        var to   = null;
        var length = this._frames.length;
        var needEnterFrame = false;
        do{
            if (frameIndex < this._frames[0].getFrameIndex()){
                if(this._currentKeyFrameIndex >= this._frames[0].getFrameIndex())
                    needEnterFrame = true;
                this._fromIndex = 0;
                this._toIndex = 0;
                from = to = this._frames[0];
                this._currentKeyFrameIndex = 0;
                this._betweenDuration = this._frames[0].getFrameIndex();
                break;
            }else if(frameIndex >= this._frames[length - 1].getFrameIndex()){
                this._fromIndex = length - 1;
                this._toIndex = 0;
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
            this._fromIndex = target;
            if(length > 1)
                this._toIndex = (target + 1) | 0;
            else
                this._toIndex = (target) | 0;
            from = this._frames[this._fromIndex];
            to   = this._frames[this._toIndex];
            from = this._frames[target];
            to   = this._frames[target+1];
            if(target === 0 && this._currentKeyFrameIndex < from.getFrameIndex())
                needEnterFrame = true;
            this._currentKeyFrameIndex = from.getFrameIndex();
            this._betweenDuration = to.getFrameIndex() - from.getFrameIndex();
        } while (0);
        if(needEnterFrame || this._currentKeyFrame != from) {
            this._currentKeyFrame = from;
            this._currentKeyFrame.onEnter(to);
        }
    },
    _updateCurrentKeyFrame: function(frameIndex){
        if(frameIndex > 60)
            var a = 0;
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
                    var lastFrameIndex = this._frames[length - 1].getFrameIndex();
                    if(this._currentKeyFrameIndex >= lastFrameIndex)
                        return;
                    frameIndex = lastFrameIndex;
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
                    if (frameIndex === from.getFrameIndex())
                        break;
                    if(frameIndex > from.getFrameIndex() && frameIndex < to.getFrameIndex())
                        break;
                    if(from.isEnterWhenPassed())
                        from.onEnter(to);
                }while (true);
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
ccs.SkinNode = (function(){
    var Node = cc.Node;
    var proto = {
    };
    var SkinNode = Node.extend(proto);
    SkinNode.create = function(){};
    return SkinNode;
})();
ccs.BoneNode = (function () {
    var Node = cc.Node;
    var SkinNode = ccs.SkinNode;
    var BlendFunc = cc.BlendFunc;
    var type = {
        p: cc.p,
        size: cc.size,
        rect: cc.rect
    };
    var debug = {
        log: cc.log,
        assert: cc.assert
    };
    var BoneNode = Node.extend({
        _customCommand: null,
        _blendFunc: null,
        _rackColor: null,
        _rackLength: null,
        _rackWidth: null,
        _childBones: null,
        _boneSkins: null,
        _rootSkeleton: null,
        _squareVertices: null,
        _squareColors: null,
        _noMVPVertices: null,
        ctor: function (length) {
            Node.prototype.ctor.call(this);
            if (this._squareVertices === null)
                this._squareVertices = [
                    {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}
                ];
            this._rackColor = cc.color.WHITE;
            this._blendFunc = BlendFunc.ALPHA_NON_PREMULTIPLIED;
            this._childBones = [];
            this._boneSkins = [];
            this._rackLength = length === undefined ? 50 : length;
            this._rackWidth = 20;
            this._updateVertices();
        },
        addSkin: function (skin, display, hideOthers) {
            var boneSkins = this._boneSkins;
            debug.assert(skin != null, "Argument must be non-nil");
            if (hideOthers) {
                for (var i = 0; i < boneSkins.length; i++) {
                    boneSkins[i].setVisible(false);
                }
            }
            Node.prototype.addChild.call(this, skin);
            this._boneSkins.push(skin);
            skin.setVisible(display);
        },
        getChildBones: function () {
            return this._childBones;
        },
        getSkins: function () {
            return this._boneSkins;
        },
        displaySkin: function (skin, hideOthers) {
            var boneSkins = this._boneSkins;
            var boneSkin, i;
            if (typeof skin === "string") {
                for (i = 0; i < boneSkins.length; i++) {
                    boneSkin = boneSkins[i];
                    if (skin == boneSkin.getName()) {
                        boneSkin.setVisible(true);
                    } else if (hideOthers) {
                        boneSkin.setVisible(false);
                    }
                }
            } else {
                for (i = 0; i < boneSkins.length; i++) {
                    boneSkin = boneSkins[i];
                    if (boneSkin == skin) {
                        boneSkin.setVisible(true);
                    } else if (hideOthers) {
                        boneSkin.setVisible(false);
                    }
                }
            }
        },
        getVisibleSkins: function () {
            var displayingSkins = [];
            var boneSkins = this._boneSkins;
            for (var boneSkin, i = 0; i < boneSkins.length; i++) {
                boneSkin = boneSkins[i];
                if (boneSkin.isVisible()) {
                    displayingSkins.push(boneSkin);
                }
            }
            return displayingSkins;
        },
        getRootSkeletonNode: function () {
            return this._rootSkeleton;
        },
        getAllSubBones: function () {
            var allBones = [];
            var boneStack = [];
            var childBones = this._childBones;
            for (var i = 0; i < childBones.length; i++) {
                boneStack.push(childBones[i]);
            }
            while (boneStack.length > 0) {
                var top = boneStack.pop();
                allBones.push(top);
                var topChildren = top.getChildBones();
                for (var j = 0; j < topChildren; j++) {
                    boneStack.push(topChildren[j]);
                }
            }
            return allBones;
        },
        getAllSubSkins: function () {
            var allBones = this.getAllSubBones();
            var allSkins = [];
            for (var i = 0; i < allBones.length; i++) {
                var skins = allBones[i].getSkins();
                for (var j = 0; j < skins.length; j++) {
                    allSkins.push(skins[i]);
                }
            }
            return allSkins;
        },
        addChild: function (child, localZOrder, tag) {
            Node.prototype.addChild.call(this, child, localZOrder, tag);
            this._addToChildrenListHelper(child);
        },
        removeChild: function (child, cleanup) {
            if(this._children.indexOf(child) !== -1){
                Node.prototype.removeChild.call(this, child, cleanup);
                this._removeFromChildrenListHelper(child);
            }
        },
        setBlendFunc: function (blendFunc) {
            var ob = this._blendFunc;
            if(blendFunc && ob.src !== blendFunc.src && ob.dst !== blendFunc.dst){
                this._blendFunc = blendFunc;
                var boneSkins = this._boneSkins;
                for (var boneSkin, i = 0; i < boneSkins.length; i++) {
                    boneSkin = boneSkins[i];
                    boneSkin.setBlendFunc(blendFunc);
                }
            }
        },
        getBlendFunc: function () {
            return this._blendFunc;
        },
        setDebugDrawLength: function (length) {
            this._rackLength = length;
            this._updateVertices();
        },
        getDebugDrawLength: function () {
            return this._rackLength;
        },
        setDebugDrawWidth: function (width) {
            this._rackWidth = width;
            this._updateVertices();
        },
        getDebugDrawWidth: function () {
            return this._rackWidth;
        },
        setDebugDrawEnabled: function (isDebugDraw) {
            var renderCmd = this._renderCmd;
            if (renderCmd._debug === isDebugDraw)
                return;
            renderCmd._debug = isDebugDraw;
            cc.renderer.childrenOrderDirty = true;
            if(this._visible && null != this._rootSkeleton){
                this._rootSkeleton._subBonesDirty = true;
                this._rootSkeleton._subBonesOrderDirty = true;
            }
        },
        isDebugDrawEnabled: function () {
            return this._renderCmd._debug;
        },
        setDebugDrawColor: function (color) {
            this._rackColor = color;
        },
        getDebugDrawColor: function () {
            return this._rackColor;
        },
        getVisibleSkinsRect: function () {
            var minx, miny, maxx, maxy = 0;
            minx = miny = maxx = maxy;
            var first = true;
            var displayRect = type.rect(0, 0, 0, 0);
            if (this._renderCmd._debug && this._rootSkeleton != null && this._rootSkeleton._renderCmd._debug) {
                maxx = this._rackWidth;
                maxy = this._rackLength;
                first = false;
            }
            var boneSkins = this._boneSkins;
            for (var skin, i = 0; i < boneSkins.length; i++) {
                skin = boneSkins[i];
                var r = skin.getBoundingBox();
                if (!skin.isVisible() || (r.x === 0 && r.y === 0 && r.width === 0 && r.height === 0))
                    continue;
                if (first) {
                    minx = cc.rectGetMinX(r);
                    miny = cc.rectGetMinY(r);
                    maxx = cc.rectGetMaxX(r);
                    maxy = cc.rectGetMaxY(r);
                    first = false;
                } else {
                    minx = Math.min(cc.rectGetMinX(r), minx);
                    miny = Math.min(cc.rectGetMinY(r), miny);
                    maxx = Math.max(cc.rectGetMaxX(r), maxx);
                    maxy = Math.max(cc.rectGetMaxY(r), maxy);
                }
                displayRect.setRect(minx, miny, maxx - minx, maxy - miny);
            }
            return displayRect;
        },
        getBoundingBox: function () {
            var boundingBox = this.getVisibleSkinsRect();
            return cc.rectApplyAffineTransform(boundingBox, this.getNodeToParentAffineTransform());
        },
        batchBoneDrawToSkeleton: function (bone) {},
        setLocalZOrder: function (localZOrder) {
            Node.prototype.setLocalZOrder.call(this, localZOrder);
            if (this._rootSkeleton != null)
                this._rootSkeleton._subBonesOrderDirty = true;
        },
        setName: function (name) {
            var rootSkeleton = this._rootSkeleton;
            var oldName = this.getName();
            Node.prototype.setName.call(this, name);
            if (rootSkeleton != null) {
                var oIter = rootSkeleton._subBonesMap[oldName];
                var nIter = rootSkeleton._subBonesMap[name];
                if (oIter && !nIter) {
                    delete rootSkeleton._subBonesMap[oIter];
                    rootSkeleton._subBonesMap[name] = oIter;
                }
            }
        },
        setContentSize: function(contentSize){
            Node.prototype.setContentSize.call(this, contentSize);
            this._updateVertices();
        },
        setAnchorPoint: function(anchorPoint){
            Node.prototype.setAnchorPoint.call(this, anchorPoint);
            this._updateVertices();
        },
        setVisible: function (visible) {
            if (this._visible == visible)
                return;
            Node.prototype.setVisible.call(this, visible);
            if (this._rootSkeleton != null){
                this._rootSkeleton._subBonesDirty = true;
                this._rootSkeleton._subBonesOrderDirty = true;
            }
        },
        _addToChildrenListHelper: function (child) {
            if (child instanceof BoneNode) {
                this._addToBoneList(child);
            } else {
                    this._addToSkinList(child);
            }
        },
        _removeFromChildrenListHelper: function (child) {
            if (child instanceof BoneNode) {
                this._removeFromBoneList(child);
            }else{
                if (child instanceof SkinNode)
                    this._removeFromSkinList(skin);
            }
        },
        _removeFromBoneList: function (bone) {
            if(
                this._rootSkeleton != null &&
                bone instanceof ccs.SkeletonNode &&
                bone._rootSkeleton === this._rootSkeleton
            ){
                bone._rootSkeleton = null;
                var subBones = bone.getAllSubBones();
                subBones.push(bone);
                for (var subBone, i = 0; i < subBones.length; i++) {
                    subBone = subBones[i];
                    subBone._rootSkeleton = null;
                    delete this._rootSkeleton._subBonesMap[subBone.getName()];
                    this._rootSkeleton._subBonesDirty = true;
                    this._rootSkeleton._subBonesOrderDirty = true;
                }
            }else{
                this._rootSkeleton._subBonesDirty = true;
                this._rootSkeleton._subBonesOrderDirty = true;
            }
            cc.arrayRemoveObject(this._childBones, bone);
        },
        _setRootSkeleton: function(rootSkeleton){
            this._rootSkeleton = rootSkeleton;
            var subBones = this.getAllSubBones();
            for (var i = 0; i < subBones.length; i++) {
                this._addToBoneList(subBones[i]);
            }
        },
        _addToBoneList: function (bone) {
            if(this._childBones.indexOf(bone) === -1)
                this._childBones.push(bone);
            if (this._rootSkeleton != null) {
                var skeletonNode = bone;
                if (!(skeletonNode instanceof SkinNode) && !bone._rootSkeleton) {// not nest skeleton
                    var subBones = bone.getAllSubBones();
                    subBones.push(bone);
                    for (var subBone, i = 0; i < subBones.length; i++) {
                        subBone = subBones[i];
                        subBone._setRootSkeleton(this._rootSkeleton);
                        var bonename = subBone.getName();
                        if (!this._rootSkeleton._subBonesMap[bonename]){
                            this._rootSkeleton._subBonesMap[subBone.getName()] = subBone;
                            this._rootSkeleton._subBonesDirty = true;
                            this. _rootSkeleton._subBonesOrderDirty = true;
                        }else{
                            cc.log("already has a bone named %s in skeleton %s", bonename, this._rootSkeleton.getName());
                            this._rootSkeleton._subBonesDirty = true;
                            this. _rootSkeleton._subBonesOrderDirty = true;
                        }
                    }
                }
            }
        },
        _visitSkins: function(){
            var cmd = this._renderCmd;
            if (!this._visible)
                return;
            var parentCmd = cmd.getParentRenderCmd();
            if (parentCmd)
                cmd._curLevel = parentCmd._curLevel + 1;
            var i, children = this._boneSkins, child;
            cmd._syncStatus(parentCmd);
            var len = children.length;
            if (len > 0) {
                this.sortAllChildren();
                for (i = 0; i < len; i++) {
                    child = children[i];
                    if (child._localZOrder < 0)
                        child._renderCmd.visit(cmd);
                    else
                        break;
                }
                for (; i < len; i++)
                    children[i]._renderCmd.visit(cmd);
            }
            cmd._dirtyFlag = 0;
        },
        _addToSkinList: function (skin) {
            this._boneSkins.push(skin);
            if (skin.getBlendFunc){
                var blendFunc = skin.getBlendFunc();
                if(this._blendFunc.src !== blendFunc.src && this._blendFunc.dst !== blendFunc.dst)
                    skin.setBlendFunc(this._blendFunc);
            }
        },
        _removeFromSkinList: function (skin) {
            cc.arrayRemoveObject(this._boneSkins, skin);
        },
        sortAllChildren: function () {
            this._sortArray(this._childBones);
            this._sortArray(this._boneSkins);
            Node.prototype.sortAllChildren.call(this);
        },
        _sortArray: function (array) {
            if (!array)
                return;
            var len = array.length, i, j, tmp;
            for (i = 1; i < len; i++) {
                tmp = array[i];
                j = i - 1;
                while (j >= 0) {
                    if (tmp._localZOrder < array[j]._localZOrder) {
                        array[j + 1] = array[j];
                    } else if (tmp._localZOrder === array[j]._localZOrder && tmp.arrivalOrder < array[j].arrivalOrder) {
                        array[j + 1] = array[j];
                    } else {
                        break;
                    }
                    j--;
                }
                array[j + 1] = tmp;
            }
        },
        _updateVertices: function () {
            var squareVertices = this._squareVertices,
                  anchorPointInPoints = this._renderCmd._anchorPointInPoints;
            if (this._rackLength != squareVertices[2].x - anchorPointInPoints.x ||
                squareVertices[3].y != this._rackWidth / 2  - anchorPointInPoints.y) {
                squareVertices[1].x = squareVertices[1].y = squareVertices[3].y = 0;
                squareVertices[0].x = squareVertices[2].x = this._rackLength * .1;
                squareVertices[2].y = this._rackWidth * .5;
                squareVertices[0].y = -squareVertices[2].y;
                squareVertices[3].x = this._rackLength;
                for(var i=0; i<squareVertices.length; i++){
                    squareVertices[i].x += anchorPointInPoints.x;
                    squareVertices[i].y += anchorPointInPoints.y;
                }
                this._renderCmd.updateDebugPoint(squareVertices);
            }
        },
        _createRenderCmd: function () {
            if (cc._renderType === cc.game.RENDER_TYPE_CANVAS)
                return new BoneNodeCanvasCmd(this);
            else
                return new BoneNodeWebGLCmd(this);
        }
    });
    BoneNode.create = function (length, color) {
        return new ccui.BoneNode(length, color);
    };
    var BoneNodeCanvasCmd = (function () {
        var BoneNodeCanvasCmd = function (node) {
            Node.CanvasRenderCmd.call(this, node);
            this._debug = false;
            this._color = cc.color.WHITE;
            this._drawNode = new cc.DrawNode();
        };
        var proto = BoneNodeCanvasCmd.prototype = Object.create(Node.CanvasRenderCmd.prototype);
        proto.constructor = BoneNodeCanvasCmd;
        proto.visit = function (parentCmd) {
            var node = this._node;
            node._visit && node._visit(parentCmd);
        };
        proto.updateDebugPoint = function (points) {
            this._drawNode.clear();
            this._drawNode.drawPoly(points, this._color, 0, this._color);
        };
        proto.transform = function (parentCmd, recursive) {
            var rootSkeleton = this._node._rootSkeleton;
            Node.CanvasRenderCmd.prototype.transform.call(this, parentCmd, recursive);
            if (rootSkeleton && rootSkeleton._renderCmd._debug) {
                this._drawNode._renderCmd.transform(this);
            }
        };
        return BoneNodeCanvasCmd;
    })();
    var BoneNodeWebGLCmd = (function () {
        var BoneNodeWebGLCmd = function (node) {
            Node.WebGLRenderCmd.call(this, node);
            this._debug = false;
            this._color = cc.color.WHITE;
            this._drawNode = new cc.DrawNode();
        };
        var proto = BoneNodeWebGLCmd.prototype = Object.create(Node.WebGLRenderCmd.prototype);
        proto.constructor = BoneNodeWebGLCmd;
        proto.visit = function (parentCmd) {
            var node = this._node;
            node._visit && node._visit(parentCmd);
        };
        proto.updateDebugPoint = function (points) {
            this._drawNode.clear();
            this._drawNode.drawPoly(points, this._color, 0, this._color);
        };
        proto.transform = function (parentCmd, recursive) {
            var rootSkeleton = this._node._rootSkeleton;
            Node.WebGLRenderCmd.prototype.transform.call(this, parentCmd, recursive);
            if (rootSkeleton && rootSkeleton._renderCmd._debug) {
                this._drawNode._renderCmd.transform(this);
            }
        };
        return BoneNodeWebGLCmd;
    })();
    return BoneNode;
})();
ccs.SkeletonNode = (function(){
    var BoneNode = ccs.BoneNode;
    var type = {
        p: cc.p,
        size: cc.size,
        rect: cc.rect
    };
    var SkeletonNode = BoneNode.extend({
        _subBonesMap: null,
        _squareVertices: null,
        _squareColors: null,
        _noMVPVertices: null,
        _skinGroupMap: null,
        _sortedAllBonesDirty: false,
        _sortedAllBones: null,
        _batchedBoneVetices: null,
        _batchedBoneColors: null,
        _batchedVeticesCount: null,
        _batchBoneCommand: null,
        _subOrderedAllBones: null,
        ctor: function(){
            this._squareVertices = [
                {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0},
                {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}
            ];
            this._rootSkeleton = this;
            BoneNode.prototype.ctor.call(this);
            this._subBonesMap = {};
            this._subOrderedAllBones = [];
            this._skinGroupMap = {};
            this._rackLength = this._rackWidth = 20;
            this._updateVertices();
        },
        getBoneNode: function(boneName){
            var item = this._subBonesMap[boneName];
            if(item)
                return item;
            return null;
        },
        getAllSubBonesMap: function(){
            return this._subBonesMap;
        },
        changeSkins: function(boneSkinNameMap){
            if(typeof boneSkinNameMap === "object"){
                var boneSkin;
                for(var name in boneSkinNameMap){
                    boneSkin = boneSkinNameMap[name];
                    var bone = this.getBoneNode(name);
                    if(null !== bone)
                        bone.displaySkin(boneSkin, true);
                }
            }else{
                var suit = this._suitMap[boneSkinNameMap];
                if (suit)
                    this.changeSkins(suit, true);
            }
        },
        addSkinGroup: function(groupName, boneSkinNameMap){
            this._skinGroupMap[groupName] = boneSkinNameMap;
        },
        getBoundingBox: function(){
            var minx, miny, maxx, maxy = 0;
            minx = miny = maxx = maxy;
            var boundingBox = this.getVisibleSkinsRect();
            var first = true;
            if(boundingBox.x !== 0 || boundingBox.y !== 0 || boundingBox.width !== 0 || boundingBox.height !== 0){
                minx = cc.rectGetMinX(boundingBox);
                miny = cc.rectGetMinY(boundingBox);
                maxx = cc.rectGetMaxX(boundingBox);
                maxy = cc.rectGetMaxY(boundingBox);
                first = false;
            }
            var allBones = this.getAllSubBones();
            for(var bone, i=0; i<allBones.length; i++){
                bone = allBones[i];
                var r = cc.rectApplyAffineTransform(bone.getVisibleSkinsRect(), bone.getNodeToParentTransform(bone.getRootSkeletonNode()));
                if (r.x === 0 && r.y === 0 && r.width === 0 && r.height === 0)
                    continue;
                if(first){
                    minx = cc.rectGetMinX(r);
                    miny = cc.rectGetMinY(r);
                    maxx = cc.rectGetMaxX(r);
                    maxy = cc.rectGetMaxY(r);
                    first = false;
                }else{
                    minx = Math.min(cc.rectGetMinX(r), minx);
                    miny = Math.min(cc.rectGetMinY(r), miny);
                    maxx = Math.max(cc.rectGetMaxX(r), maxx);
                    maxy = Math.max(cc.rectGetMaxY(r), maxy);
                }
            }
            boundingBox.x = minx;
            boundingBox.y = miny;
            boundingBox.width = maxx - minx;
            boundingBox.height = maxy - miny;
            return cc.rectApplyAffineTransform(boundingBox, this.getNodeToParentTransform());
        },
        _visit: function(parentCmd){
            if(!this._visible)
                return;
            var cmd = this._renderCmd;
            parentCmd = parentCmd || cmd.getParentRenderCmd();
            cmd._syncStatus(parentCmd);
            var i, node;
            if(this._children.length !== 0){
                for (i=0; i < this._children.length; i++){
                    node = this._children[i];
                    node._renderCmd.visit(cmd);
                }
            }
            this._checkSubBonesDirty();
            var subOrderedAllBones = this._subOrderedAllBones,
                subOrderedBone, subOrderedBoneCmd;
            for (i=0; i<subOrderedAllBones.length; i++){
                subOrderedBone = subOrderedAllBones[i];
                subOrderedBone._visitSkins();
            }
            if(cmd._debug)
                for (i=0; i<subOrderedAllBones.length; i++){
                    subOrderedBoneCmd = subOrderedAllBones[i]._renderCmd;
                    cc.renderer.pushRenderCommand(subOrderedBoneCmd._drawNode._renderCmd);
                }
            this._dirtyFlag = 0;
        },
        _checkSubBonesDirty: function(){
            if (this._subBonesDirty){
                this._updateOrderedAllbones();
                this._subBonesDirty = false;
            }
            if (this._subBonesOrderDirty){
                this._sortOrderedAllBones();
                this._subBonesOrderDirty = false;
            }
        },
        _updateOrderedAllbones: function(){
            this._subOrderedAllBones.length = 0;
            var boneStack = [];
            var childBones = this._childBones;
            for (var bone, i=0; i<childBones.length; i++){
                bone = childBones[i];
                if (bone.isVisible())
                    boneStack.push(bone);
            }
            while(boneStack.length > 0){
                var top = boneStack.pop();
                var topCmd = top._renderCmd;
                topCmd._syncStatus(topCmd.getParentRenderCmd());
                this._subOrderedAllBones.push(top);
                var topChildren = top.getChildBones();
                for (var childbone, i=0; i<topChildren.length; i++){
                    childbone = topChildren[i];
                    if (childbone.isVisible())
                        boneStack.push(childbone);
                }
            }
        },
        _sortOrderedAllBones: function(){
            this._sortArray(this._subOrderedAllBones);
        },
        _updateVertices: function(){
            var squareVertices = this._squareVertices,
                anchorPointInPoints = this._renderCmd._anchorPointInPoints;
            if(this._rackLength != squareVertices[6].x - anchorPointInPoints.x ||
                this._rackWidth != squareVertices[3].y - anchorPointInPoints.y){
                var radiusl = this._rackLength * .5;
                var radiusw = this._rackWidth * .5;
                var radiusl_2 = radiusl * .25;
                var radiusw_2 = radiusw * .25;
                squareVertices[5].y = squareVertices[2].y = squareVertices[1].y = squareVertices[6].y
                    = squareVertices[0].x = squareVertices[4].x = squareVertices[7].x = squareVertices[3].x = .0;
                squareVertices[5].x = -radiusl; squareVertices[0].y = -radiusw;
                squareVertices[6].x = radiusl;  squareVertices[3].y = radiusw;
                squareVertices[1].x = radiusl_2; squareVertices[7].y = radiusw_2;
                squareVertices[2].x = -radiusl_2; squareVertices[4].y = -radiusw_2;
                for(var i=0; i<squareVertices.length; i++){
                    squareVertices[i].x += anchorPointInPoints.x;
                    squareVertices[i].y += anchorPointInPoints.y;
                }
            }
        },
        _updateAllDrawBones: function(){
            this._subDrawBones = {};
            for(var name in this._subBonesMap){
                var bone = this._subBonesMap[name];
                if (bone.isVisible() && bone.isDebugDrawEnabled())
                    this._subDrawBones.push(bone);
            }
            this._sortArray(this._sortedAllBones);
            this._subDrawBones = false;
        }
    });
    SkeletonNode.create = function(){
        return new SkeletonNode;
    };
    return SkeletonNode;
})();
ccs._load = (function(){
    var load = function(file, type, path){
        var json = cc.loader.getRes(file);
        if(!json)
            return cc.log("%s does not exist", file);
        var ext = extname(file).toLocaleLowerCase();
        if(ext !== "json" && ext !== "exportjson")
            return cc.log("%s load error, must be json file", file);
        var parse;
        if(!type){
            if(json["widgetTree"])
                parse = parser["ccui"];
            else if(json["nodeTree"])
                parse = parser["timeline"];
            else if(json["Content"] && json["Content"]["Content"])
                parse = parser["timeline"];
            else if(json["gameobjects"])
                parse = parser["scene"];
        }else{
            parse = parser[type];
        }
        if(!parse){
            cc.log("Can't find the parser : %s", file);
            return new cc.Node();
        }
        var version = json["version"] || json["Version"];
        if(!version && json["armature_data"]){
            cc.warn("%s is armature. please use:", file);
            cc.warn("    ccs.armatureDataManager.addArmatureFileInfoAsync(%s);", file);
            cc.warn("    var armature = new ccs.Armature('name');");
            return new cc.Node();
        }
        var currentParser = getParser(parse, version);
        if(!currentParser){
            cc.log("Can't find the parser : %s", file);
            return new cc.Node();
        }
        return currentParser.parse(file, json, path) || null;
    };
    var parser = {
        "ccui": {},
        "timeline": {},
        "action": {},
        "scene": {}
    };
    load.registerParser = function(name, version, target){
        if(!name || !version || !target)
            return cc.log("register parser error");
        if(!parser[name])
            parser[name] = {};
        parser[name][version] = target;
    };
    load.getParser = function(name, version){
        if(name && version)
            return parser[name] ? parser[name][version] : undefined;
        if(name)
            return parser[name];
        return parser;
    };
    var extname = function(fileName){
        var arr = fileName.match(extnameReg);
        return ( arr && arr[1] ) ? arr[1] : null;
    };
    var extnameReg = /\.([^\.]+)$/;
    var parserReg = /([^\.](\.\*)?)*$/;
    var getParser = function(parser, version){
        if(parser[version])
            return parser[version];
        else if(version === "*")
            return null;
        else
            return getParser(parser, version.replace(parserReg, "*"));
    };
    return load;
})();
ccs._parser = cc.Class.extend({
    ctor: function(){
        this.parsers = {};
    },
    _dirnameReg: /\S*\//,
    _dirname: function(path){
        var arr = path.match(this._dirnameReg);
        return (arr && arr[0]) ? arr[0] : "";
    },
    getClass: function(json){
        return json["classname"];
    },
    getNodeJson: function(json){
        return json["widgetTree"];
    },
    parse: function(file, json, resourcePath){
        resourcePath = resourcePath || this._dirname(file);
        this.pretreatment(json, resourcePath);
        var node = this.parseNode(this.getNodeJson(json), resourcePath, file);
        node && this.deferred(json, resourcePath, node, file);
        return node;
    },
    pretreatment: function(json, resourcePath, file){},
    deferred: function(json, resourcePath, node, file){},
    parseNode: function(json, resourcePath){
        var parser = this.parsers[this.getClass(json)];
        var widget = null;
        if(parser)
            widget = parser.call(this, json, resourcePath);
        else
            cc.log("Can't find the parser : %s", this.getClass(json));
        return widget;
    },
    registerParser: function(widget, parse){
        this.parsers[widget] = parse;
    }
});
ccs.load = function(file, path){
    var object = {
        node: null,
        action: null
    };
    object.node = ccs._load(file, null, path);
    object.action = ccs._load(file, "action", path);
    if(object.action && object.action.tag === -1 && object.node)
        object.action.tag = object.node.tag;
    return object;
};
ccs.load.validate = {};
ccs.loadWithVisibleSize = function(file, path){
    var object = ccs.load(file, path);
    var size = cc.director.getVisibleSize();
    if(object.node && size){
        object.node.setContentSize(size.width, size.height);
        ccui.helper.doLayout(object.node);
    }
    return object;
};
ccs.actionTimelineCache = {
    createAction: function(file){
        return ccs._load(file, "action");
    }
};
ccs.csLoader = {
    createNode: function(file){
        return ccs._load(file);
    }
};
cc.loader.register(["json"], {
    load : function(realUrl, url, res, cb){
        cc.loader.loadJson(realUrl, function(error, data){
            var path = cc.path;
            if(data && data["Content"] && data["Content"]["Content"]["UsedResources"]){
                var UsedResources = data["Content"]["Content"]["UsedResources"],
                    dirname = path.dirname(url),
                    list = [],
                    tmpUrl, normalUrl;
                for(var i=0; i<UsedResources.length; i++){
                    tmpUrl = path.join(dirname, UsedResources[i]);
                    normalUrl = path._normalize(tmpUrl);
                    if(!ccs.load.validate[normalUrl]){
                        ccs.load.validate[normalUrl] = true;
                        list.push(tmpUrl);
                    }
                }
                cc.loader.load(list, function(){
                    cb(error, data);
                });
            }else{
                cb(error, data);
            }
        });
    }
});
(function(load, baseParser){
    var Parser = baseParser.extend({
        getNodeJson: function(json){
            return json["action"];
        },
        parseNode: function(json, resourcePath, file){
            if(!json)
                return null;
            var self = this,
                action = new ccs.ActionTimeline();
            action.setDuration(json["duration"]);
            action.setTimeSpeed(json["speed"] || 1);
            var timelines = json["timelines"];
            timelines.forEach(function(timeline){
                var parser = self.parsers[timeline["frameType"]];
                var frame;
                if(parser)
                    frame = parser.call(self, timeline, resourcePath);
                else
                    cc.log("parser does not exist : %s", timeline["frameType"]);
                if(frame)
                    action.addTimeline(frame);
                if(timeline["frameType"] === "ColorFrame"){
                    action.addTimeline(
                        self.parsers["AlphaFrame"].call(self, timeline, resourcePath)
                    );
                }
            });
            return action;
        }
    });
    var parser = new Parser();
    var frameList = [
        {
            name: "PositionFrame",
            handle: function(options){
                var frame = new ccs.PositionFrame();
                var x = options["x"];
                var y = options["y"];
                frame.setPosition(cc.p(x,y));
                return frame;
            }
        },
        {
            name: "VisibleFrame",
            handle: function(options){
                var frame = new ccs.VisibleFrame();
                var visible = options["value"];
                frame.setVisible(visible);
                return frame;
            }
        },
        {
            name: "ScaleFrame",
            handle: function(options){
                var frame = new ccs.ScaleFrame();
                var scalex = options["x"];
                var scaley = options["y"];
                frame.setScaleX(scalex);
                frame.setScaleY(scaley);
                return frame;
            }
        },
        {
            name: "RotationFrame",
            handle: function(options){
                var frame = new ccs.RotationFrame();
                var rotation = options["rotation"];
                frame.setRotation(rotation);
                return frame;
            }
        },
        {
            name: "SkewFrame",
            handle: function(options){
                var frame = new ccs.SkewFrame();
                var skewx = options["x"];
                var skewy = options["y"];
                frame.setSkewX(skewx);
                frame.setSkewY(skewy);
                return frame;
            }
        },
        {
            name: "RotationSkewFrame",
            handle: function(options){
                var frame = new ccs.RotationSkewFrame();
                var skewx = options["x"];
                var skewy = options["y"];
                frame.setSkewX(skewx);
                frame.setSkewY(skewy);
                return frame;
            }
        },
        {
            name: "AnchorFrame",
            handle: function(options){
                var frame = new ccs.AnchorPointFrame();
                var anchorx = options["x"];
                var anchory = options["y"];
                frame.setAnchorPoint(cc.p(anchorx, anchory));
                return frame;
            }
        },
        {
            name: "InnerActionFrame",
            handle: function(options){
                var frame = new ccs.InnerActionFrame();
                var type = options["innerActionType"];
                var startFrame = options["startFrame"];
                frame.setInnerActionType(type);
                frame.setStartFrameIndex(startFrame);
                return frame;
            }
        },
        {
            name: "ColorFrame",
            handle: function(options){
                var frame = new ccs.ColorFrame();
                var red   = options["red"];
                var green = options["green"];
                var blue  = options["blue"];
                frame.setColor(cc.color(red, green, blue));
                var alphaFrame = new ccs.AlphaFrame();
                var alpha = options["alpha"];
                alphaFrame.setAlpha(alpha);
                return frame;
            }
        },
        {
            name: "AlphaFrame",
            handle: function(options){
                var frame = new ccs.AlphaFrame();
                var alpha = options["alpha"];
                frame.setAlpha(alpha);
                return frame;
            }
        },
        {
            name: "TextureFrame",
            handle: function(options){
                var frame = new ccs.TextureFrame();
                var texture = options["value"];
                if(texture != null) {
                    var path = texture;
                    var spriteFrame = cc.spriteFrameCache.getSpriteFrame(path);
                    if(spriteFrame == null){
                        var jsonPath = ccs.csLoader.getJsonPath();
                        path = jsonPath + texture;
                    }
                    frame.setTextureName(path);
                }
                return frame;
            }
        },
        {
            name: "EventFrame",
            handle: function(options){
                var frame = new ccs.EventFrame();
                var evnt = options["value"];
                if(evnt != null)
                    frame.setEvent(evnt);
                return frame;
            }
        },
        {
            name: "ZOrderFrame",
            handle: function(options){
                var frame = new ccs.ZOrderFrame();
                var zorder = options["value"];
                frame.setZOrder(zorder);
                return frame;
            }
        }
    ];
    frameList.forEach(function(item){
        parser.registerParser(item.name, function(options, resourcePath){
            var timeline = new ccs.Timeline();
            timeline.setActionTag(options["actionTag"]);
            var frames = options["frames"];
            if(frames && frames.length){
                frames.forEach(function(frameData){
                    var frame = item.handle(frameData);
                    frame.setFrameIndex(frameData["frameIndex"]);
                    frame.setTween(frameData["tween"]);
                    timeline.addFrame(frame);
                });
            }
            return timeline;
        });
    });
    load.registerParser("action", "*", parser);
})(ccs._load, ccs._parser);
(function(load, baseParser){
    var Parser = baseParser.extend({
        getNodeJson: function(json){
            return json["Content"]["Content"]["Animation"];
        },
        parseNode: function(json, resourcePath, file){
            if(!json)
                return null;
            var self = this,
                action = new ccs.ActionTimeline();
            action.setDuration(json["Duration"]);
            action.setTimeSpeed(json["Speed"] || 1);
            var timelines = json["Timelines"];
            timelines.forEach(function(timeline){
                var parser = self.parsers[timeline["Property"]];
                var frame;
                if(parser)
                    frame = parser.call(self, timeline, resourcePath);
                else
                    cc.log("parser does not exist : %s", timeline["Property"]);
                if(frame)
                    action.addTimeline(frame);
            });
            return action;
        },
        deferred: function(json, resourcePath, action, file){
            var animationlist = json["Content"]["Content"]["AnimationList"];
            var length = animationlist ? animationlist.length : 0;
            for (var i = 0; i < length; i++){
                var animationdata = animationlist[i];
                var info = { name: null, startIndex: null, endIndex: null };
                info.name = animationdata["Name"];
                info.startIndex = animationdata["StartIndex"];
                info.endIndex = animationdata["EndIndex"];
                action.addAnimationInfo(info);
            }
        }
    });
    var parser = new Parser();
    var frameList = [
        {
            name: "Position",
            handle: function(options){
                var frame = new ccs.PositionFrame();
                var x = options["X"];
                var y = options["Y"];
                frame.setPosition(cc.p(x,y));
                return frame;
            }
        },
        {
            name: "VisibleForFrame",
            handle: function(options){
                var frame = new ccs.VisibleFrame();
                var visible = options["Value"];
                frame.setVisible(visible);
                return frame;
            }
        },
        {
            name: "Scale",
            handle: function(options){
                var frame = new ccs.ScaleFrame();
                var scalex = options["X"];
                var scaley = options["Y"];
                frame.setScaleX(scalex);
                frame.setScaleY(scaley);
                return frame;
            }
        },
        {
            name: "Rotation",
            handle: function(options){
                var frame = new ccs.RotationFrame();
                var rotation = options["Rotation"] || options["Value"] || 0;
                frame.setRotation(rotation);
                return frame;
            }
        },
        {
            name: "Skew",
            handle: function(options){
                var frame = new ccs.SkewFrame();
                var skewx = options["X"];
                var skewy = options["Y"];
                frame.setSkewX(skewx);
                frame.setSkewY(skewy);
                return frame;
            }
        },
        {
            name: "RotationSkew",
            handle: function(options){
                var frame = new ccs.RotationSkewFrame();
                var skewx = options["X"];
                var skewy = options["Y"];
                frame.setSkewX(skewx);
                frame.setSkewY(skewy);
                return frame;
            }
        },
        {
            name: "Anchor",
            handle: function(options){
                var frame = new ccs.AnchorPointFrame();
                var anchorx = options["X"];
                var anchory = options["Y"];
                frame.setAnchorPoint(cc.p(anchorx, anchory));
                return frame;
            }
        },{
            name: "AnchorPoint",
            handle: function(options){
                var frame = new ccs.AnchorPointFrame();
                var anchorx = options["X"];
                var anchory = options["Y"];
                frame.setAnchorPoint(cc.p(anchorx, anchory));
                return frame;
            }
        },{
            name: "InnerAction",
            handle: function(options){
                var frame = new ccs.InnerActionFrame();
                var type = options["InnerActionType"];
                var startFrame = options["StartFrame"];
                frame.setInnerActionType(type);
                frame.setStartFrameIndex(startFrame);
                return frame;
            }
        },
        {
            name: "CColor",
            handle: function(options){
                var frame = new ccs.ColorFrame();
                var color = options["Color"];
                if(!color) color = {};
                color["R"] = color["R"] === undefined ? 255 : color["R"];
                color["G"] = color["G"] === undefined ? 255 : color["G"];
                color["B"] = color["B"] === undefined ? 255 : color["B"];
                frame.setColor(cc.color(color["R"], color["G"], color["B"]));
                return frame;
            }
        },
        {
            name: "Alpha",
            handle: function(options){
                var frame = new ccs.AlphaFrame();
                var alpha = options["Value"];
                frame.setAlpha(alpha);
                return frame;
            }
        },
        {
            name: "FileData",
            handle: function(options, resourcePath){
                var frame, texture, plist, path, spriteFrame;
                frame = new ccs.TextureFrame();
                texture = options["TextureFile"];
                if(texture != null) {
                    plist = texture["Plist"];
                    path = texture["Path"];
                    spriteFrame = cc.spriteFrameCache.getSpriteFrame(path);
                    if(!spriteFrame && plist){
                        if(cc.loader.getRes(resourcePath + plist)){
                            cc.spriteFrameCache.addSpriteFrames(resourcePath + plist);
                            spriteFrame = cc.spriteFrameCache.getSpriteFrame(path);
                        }else{
                            cc.log("%s need to be preloaded", resourcePath + plist);
                        }
                    }
                    if(spriteFrame == null){
                        path = resourcePath + path;
                    }
                    frame.setTextureName(path);
                }
                return frame;
            }
        },
        {
            name: "FrameEvent",
            handle: function(options){
                var frame = new ccs.EventFrame();
                var evnt = options["Value"];
                if(evnt != null)
                    frame.setEvent(evnt);
                return frame;
            }
        },
        {
            name: "ZOrder",
            handle: function(options){
                var frame = new ccs.ZOrderFrame();
                var zorder = options["Value"];
                frame.setZOrder(zorder);
                return frame;
            }
        },
        {
            name: "ActionValue",
            handle: function (options) {
                var frame = new ccs.InnerActionFrame();
                var innerActionType = options["InnerActionType"];
                var currentAnimationFrame = options["CurrentAniamtionName"];
                var singleFrameIndex = options["SingleFrameIndex"];
                var frameIndex = options["FrameIndex"];
                if(frameIndex !== undefined)
                    frame.setFrameIndex(frameIndex);
                frame.setInnerActionType(ccs.InnerActionType[innerActionType]);
                frame.setSingleFrameIndex(singleFrameIndex);
                frame.setEnterWithName(true);
                if (currentAnimationFrame)
                     frame.setAnimationName(currentAnimationFrame);
                return frame;
            }
        },
        {
            name: "BlendFunc",
            handle: function(options){
                var frame = new ccs.BlendFuncFrame();
                var blendFunc = options["BlendFunc"];
                if(blendFunc && blendFunc["Src"] !== undefined && blendFunc["Dst"] !== undefined)
                    frame.setBlendFunc(new cc.BlendFunc(blendFunc["Src"], blendFunc["Dst"]));
                return frame;
            }
        }
    ];
    var loadEasingDataWithFlatBuffers = function(frame, options){
        var type = options["Type"];
        frame.setTweenType(type);
        var points = options["Points"];
        var result = [];
        if(points){
            points.forEach(function(p){
                result.push(p["X"]);
                result.push(p["Y"]);
            });
            frame.setEasingParams(result);
        }
    };
    frameList.forEach(function(item){
        parser.registerParser(item.name, function(options, resourcePath){
            var timeline = new ccs.Timeline();
            timeline.setActionTag(options["ActionTag"]);
            var frames = options["Frames"];
            if(frames && frames.length){
                frames.forEach(function(frameData){
                    var frame = item.handle(frameData, resourcePath);
                    frame.setFrameIndex(frameData["FrameIndex"]);
                    var tween = frameData["Tween"] != null ? frameData["Tween"] : true;
                    frame.setTween(tween);
                    var easingData = frameData["EasingData"];
                    if(easingData)
                        loadEasingDataWithFlatBuffers(frame, easingData);
                    timeline.addFrame(frame);
                });
            }
            return timeline;
        });
    });
    load.registerParser("action", "2.*", parser);
})(ccs._load, ccs._parser);
(function(load, baseParser){
    var Parser = baseParser.extend({
        getNodeJson: function(json){
            return json;
        },
        parseNode: function(json, resourcePath){
            var parser = this.parsers[this.getClass(json)];
            var node = null;
            if(parser)
                node = parser.call(this, json, resourcePath);
            else
                cc.log("Can't find the parser : %s", this.getClass(json));
            return node;
        },
        deferred: function(json, resourcePath, node, file){
            ccs.triggerManager.parse(json["Triggers"]||[]);
            if(ccs.sceneReader)
                ccs.sceneReader._node = node;
        },
        setPropertyFromJsonDict: function(node, json){
            var x = (cc.isUndefined(json["x"]))?0:json["x"];
            var y = (cc.isUndefined(json["y"]))?0:json["y"];
            node.setPosition(x, y);
            var bVisible = Boolean((cc.isUndefined(json["visible"]))?1:json["visible"]);
            node.setVisible(bVisible);
            var nTag = (cc.isUndefined(json["objecttag"]))?-1:json["objecttag"];
            node.setTag(nTag);
            var nZorder = (cc.isUndefined(json["zorder"]))?0:json["zorder"];
            node.setLocalZOrder(nZorder);
            var fScaleX = (cc.isUndefined(json["scalex"]))?1:json["scalex"];
            var fScaleY = (cc.isUndefined(json["scaley"]))?1:json["scaley"];
            node.setScaleX(fScaleX);
            node.setScaleY(fScaleY);
            var fRotationZ = (cc.isUndefined(json["rotation"]))?0:json["rotation"];
            node.setRotation(fRotationZ);
            var sName = json["name"] || "";
            node.setName(sName);
        }
    });
    var parser = new Parser();
    parser.parseChild = function(node, objects, resourcePath){
        for (var i = 0; i < objects.length; i++) {
            var child,
                options = objects[i];
            if(options)
                child = this.parseNode(options, resourcePath);
            if(child)
                node.addChild(child);
        }
    };
    var componentsParser = {
        "CCSprite": function(node, component, resourcePath){
            var child = new cc.Sprite();
            loadTexture(component["fileData"], resourcePath, function(path, type){
                if(type === 0)
                    child.setTexture(path);
                else if(type === 1){
                    var spriteFrame = cc.spriteFrameCache.getSpriteFrame(path);
                    child.setSpriteFrame(spriteFrame);
                }
            });
            var render = new ccs.ComRender(child, "CCSprite");
            node.addComponent(render);
            return render;
        },
        "CCTMXTiledMap": function(node, component, resourcePath){
            var child = null;
            loadTexture(component["fileData"], resourcePath, function(path, type){
                if(type === 0)
                    child = new cc.TMXTiledMap(path);
            });
            var render = new ccs.ComRender(child, "CCTMXTiledMap");
            node.addComponent(render);
            return render;
        },
        "CCParticleSystemQuad": function(node, component, resourcePath){
            var child = null;
            loadTexture(component["fileData"], resourcePath, function(path, type){
                if(type === 0)
                    child = new cc.ParticleSystem(path);
                else
                    cc.log("unknown resourcetype on CCParticleSystemQuad!");
                child.setPosition(0, 0);
            });
            var render = new ccs.ComRender(child, "CCParticleSystemQuad");
            node.addComponent(render);
            return render;
        },
        "CCArmature": function(node, component, resourcePath){
            var child = null;
            loadTexture(component["fileData"], resourcePath, function(path, type){
                if(type === 0){
                    var jsonDict = cc.loader.getRes(path);
                    if (!jsonDict) cc.log("Please load the resource [%s] first!", path);
                    var armature_data = jsonDict["armature_data"];
                    var subData = armature_data[0];
                    var name = subData["name"];
                    ccs.armatureDataManager.addArmatureFileInfo(path);
                    child = new ccs.Armature(name);
                }
            });
            if(child){
                var render = new ccs.ComRender(child, "CCArmature");
                node.addComponent(render);
                var actionName = component["selectedactionname"];
                if (actionName && child.getAnimation())
                    child.getAnimation().play(actionName);
                return render;
            }
        },
        "CCComAudio": function(node, component, resourcePath){
            var audio = null;
            loadTexture(component["fileData"], resourcePath, function(path, type){
                if(type === 0){
                    audio = new ccs.ComAudio();
                    audio.preloadEffect(path);
                    var name = component["name"];
                    if(name)
                        audio.setName(name);
                    node.addComponent(audio);
                }
            });
        },
        "CCComAttribute": function(node, component, resourcePath){
            var attribute = null;
            loadTexture(component["fileData"], resourcePath, function(path, type){
                if(type === 0){
                    attribute = new ccs.ComAttribute();
                    if (path !== "")
                        attribute.parse(path);
                    node.addComponent(attribute);
                }else
                    cc.log("unknown resourcetype on CCComAttribute!");
            });
            return attribute;
        },
        "CCBackgroundAudio": function(node, component, resourcePath){
            var audio = null;
            loadTexture(component["fileData"], resourcePath, function(path, type){
                if(type === 0){
                    audio = new ccs.ComAudio();
                    audio.preloadBackgroundMusic(path);
                    audio.setFile(path);var bLoop = Boolean(component["loop"] || 0);
                    audio.setLoop(bLoop);
                    var name = component["name"];
                    if(name)
                        audio.setName(name);
                    node.addComponent(audio);
                    audio.playBackgroundMusic(path, bLoop);
                }
            });
        },
        "GUIComponent": function(node, component, resourcePath){
            var widget = null;
            loadTexture(component["fileData"], resourcePath, function(path, type){
                widget = ccs._load(path, "ccui");
            });
            var render = new ccs.ComRender(widget, "GUIComponent");
            node.addComponent(render);
            return render;
        },
        "CCScene": function(){}
    };
    var loadedPlist = {};
    var loadTexture = function(json, resourcePath, cb){
        if(json != null){
            var path = json["path"];
            var type = json["resourceType"];
            var plist = json["plist"];
            if(!path)
                return;
            if(plist){
                if(cc.loader.getRes(resourcePath + plist)){
                    loadedPlist[resourcePath + plist] = true;
                    cc.spriteFrameCache.addSpriteFrames(resourcePath + plist);
                }else{
                    if(!loadedPlist[resourcePath + plist])
                        cc.log("%s need to be preloaded", resourcePath + plist);
                }
            }
            if(type !== 0)
                cb(path, type);
            else
                cb(resourcePath + path, type);
        }
    };
    parser.parseComponents = function(node, json, resourcePath){
        if(!node || !json)
            return;
        json.forEach(function(component){
            var parser = componentsParser[component["classname"]];
            var render = null;
            if(parser)
                render = parser(node, component, resourcePath);
            else
                cc.log("Can't find the component parser : %s", component["classname"]);
            var name = component["name"];
            if(render && name){
                render.setName(name);
            }
        });
    };
    parser.registerParser("CCNode", function(options, resourcePath){
        var node = new cc.Node();
        this.setPropertyFromJsonDict(node, options);
        this.parseChild.call(this, node, options["gameobjects"], resourcePath);
        this.parseComponents(node, options["components"], resourcePath);
        var size = options["CanvasSize"];
        if (size)
            node.setContentSize(cc.size(size["_width"], size["_height"]));
        return node;
    });
    load.registerParser("scene", "*", parser);
})(ccs._load, ccs._parser);
(function(load, baseParser){
    var loadedPlist = {};
    var Parser = baseParser.extend({
        getNodeJson: function(json){
            return json["nodeTree"];
        },
        addSpriteFrame: function(plists, pngs, resourcePath){
            if(!plists || !pngs || plists.length !== pngs.length)
                return;
            for (var i = 0; i < plists.length; i++) {
                var plist = resourcePath + plists[i];
                if(!cc.loader.getRes(plist) && !loadedPlist[plist])
                    cc.log("%s need to be preloaded", plist);
                else
                    loadedPlist[plist] = true;
                cc.spriteFrameCache.addSpriteFrames(
                    plist,
                    resourcePath + pngs[i]
                );
            }
        },
        pretreatment: function(json, resourcePath, file){
            this.addSpriteFrame(json["textures"], json["texturesPng"], resourcePath);
        }
    });
    var parser = new Parser();
    parser.generalAttributes = function(node, options){
        var width         = options["width"]        !=null ? options["width"] : 0;
        var height        = options["height"]       !=null ? options["height"] : 0;
        var x             = options["x"]            !=null ? options["x"] : 0;
        var y             = options["y"]            !=null ? options["y"] : 0;
        var scalex        = options["scaleX"]       !=null ? options["scaleX"] : 1;
        var scaley        = options["scaleY"]       !=null ? options["scaleY"] : 1;
        var rotation      = options["rotation"]     !=null ? options["rotation"] : 0;
        var rotationSkewX = options["rotationSkewX"]!=null ? options["rotationSkewX"] : 0;
        var rotationSkewY = options["rotationSkewY"]!=null ? options["rotationSkewY"] : 0;
        var skewx         = options["skewX"]        !=null ? options["skewX"] : 0;
        var skewy         = options["skewY"]        !=null ? options["skewY"] : 0;
        var anchorx       = options["anchorPointX"] !=null ? options["anchorPointX"] : 0.5;
        var anchory       = options["anchorPointY"] !=null ? options["anchorPointY"] : 0.5;
        var alpha         = options["opacity"]      !=null ? options["opacity"] : 255;
        var red           = options["colorR"]       !=null ? options["colorR"] : 255;
        var green         = options["colorG"]       !=null ? options["colorG"] : 255;
        var blue          = options["colorB"]       !=null ? options["colorB"] : 255;
        var zorder        = options["colorR"]       !=null ? options["colorR"] : 0;
        var tag           = options["tag"]          !=null ? options["tag"] : 0;
        var actionTag     = options["actionTag"]    !=null ? options["actionTag"] : 0;
        var visible       = options["visible"]      !=null ? options["visible"] : true;
        if(x != 0 || y != 0)
            node.setPosition(cc.p(x, y));
        if(scalex != 1)
            node.setScaleX(scalex);
        if(scaley != 1)
            node.setScaleY(scaley);
        if (rotation != 0)
            node.setRotation(rotation);
        if(rotationSkewX != 0)
            node.setRotationX(rotationSkewX);
        if(rotationSkewY != 0)
            node.setRotationY(rotationSkewY);
        if(skewx != 0)
            node.setSkewX(skewx);
        if(skewy != 0)
            node.setSkewY(skewy);
        if(anchorx != 0.5 || anchory != 0.5)
            node.setAnchorPoint(cc.p(anchorx, anchory));
        if(width != 0 || height != 0)
            node.setContentSize(cc.size(width, height));
        if(zorder != 0)
            node.setLocalZOrder(zorder);
        if(visible != true)
            node.setVisible(visible);
        if(alpha != 255)
        {
            node.setOpacity(alpha);
        }
        if(red != 255 || green != 255 || blue != 255)
        {
            node.setColor(cc.color(red, green, blue));
        }
        node.setTag(tag);
        node.setUserObject(new ccs.ActionTimelineData(actionTag));
    };
    parser.parseComponent = function(node, options){
        if(!options) return;
        for (var i = 0; i < options.length; ++i){
            var dic = options[i];
            var component = this.loadComponent(dic);
            if (component){
                node.addComponent(component);
            }
        }
    };
    parser.parseChild = function(parse, widget, options, resourcePath){
        var children = options["children"];
        for (var i = 0; i < children.length; i++) {
            var child = this.parseNode(children[i], resourcePath);
            if(child){
                if(widget instanceof ccui.PageView){
                    if(child instanceof ccui.Layout)
                        widget.addPage(child);
                } else {
                    if(widget instanceof ccui.ListView){
                        if(child instanceof ccui.Widget)
                            widget.pushBackCustomItem(child);
                    } else {
                        if(!(widget instanceof ccui.Layout) && child instanceof ccui.Widget) {
                            if(child.getPositionType() === ccui.Widget.POSITION_PERCENT) {
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
    };
    parser.initNode = function(options){
        var node = new cc.Node();
        this.generalAttributes(node, options);
        return node;
    };
    parser.initSubGraph = function(options){
        var filePath = options["fileName"];
        var node;
        if (filePath && "" !== filePath){
            node = this.createNode(filePath);
        }else{
            node = new ccs.Node();
        }
        this.generalAttributes(node, options);
        return node;
    };
    parser.initSprite = function(options, resourcePath){
        var path = options["fileName"];
        var sprite;
        if(path != null){
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(path);
            if(!spriteFrame){
                path = resourcePath + path;
                sprite = new ccs.Sprite(path);
            }else{
                sprite = ccs.Sprite.createWithSpriteFrame(spriteFrame);
            }
            if(!sprite){
                sprite = new cc.Sprite();
                cc.log("filePath is empty. Create a sprite with no texture");
            }
        }else{
            sprite = new ccs.Sprite();
        }
        this.generalAttributes(sprite, options);
        var flipX = options["flipX"];
        var flipY = options["flipY"];
        if(flipX != false)
            sprite.setFlippedX(flipX);
        if(flipY != false)
            sprite.setFlippedY(flipY);
        return sprite;
    };
    parser.initParticle = function(options, resourcePath){
        var filePath = options["plistFile"];
        var num = options["tmxFile"];
        var particle = new cc.ParticleSystemQuad(filePath);
        particle.setTotalParticles(num);
        this.generalAttributes(particle, options);
        return particle;
    };
    parser.initTMXTiledMap = function(options, resourcePath){
        var tmxFile = options["tmxFile"];
        var tmxString = options["tmxString"];
        var path = options["resourcePath"];
        var tmx = null;
        if (tmxFile && "" !== tmxFile){
            tmx = new cc.TMXTiledMap(tmxFile);
        }else if (tmxString && "" !== tmxString && path && "" !== path){
            tmx = new cc.TMXTiledMap(tmxString, path);
        }
        return tmx;
    };
    var uiParser = load.getParser("ccui")["*"];
    parser.initWidget = function(options, resourcePath){
        var type = options["classname"];
        var parser = uiParser.parsers[type];
        if(!parser)
            return cc.log("%s parser is not found", type);
        var node = parser.call(uiParser, options, resourcePath);
        if(node){
            var rotationSkewX = options["rotationSkewX"];
            var rotationSkewY = options["rotationSkewY"];
            var skewx         = options["skewX"];
            var skewy         = options["skewY"];
            if(rotationSkewX != 0)
                node.setRotationX(rotationSkewX);
            if(rotationSkewY != 0)
                node.setRotationY(rotationSkewY);
            if(skewx != 0)
                node.setSkewX(skewx);
            if(skewy != 0)
                node.setSkewY(skewy);
            var actionTag = options["actionTag"];
            node.setUserObject(new ccs.ActionTimelineData(actionTag));
        }
        return node;
    };
    var register = [
        {name: "Node", handle: parser.initNode},
        {name: "SubGraph", handle: parser.initSubGraph},
        {name: "Sprite", handle: parser.initSprite},
        {name: "Particle", handle: parser.initParticle},
        {name: "TMXTiledMap", handle: parser.initTMXTiledMap},
        {name: "Widget", handle: parser.initWidget},
        {name: "Panel", handle: parser.initWidget},
        {name: "Button", handle: parser.initWidget},
        {name: "CheckBox", handle: parser.initWidget},
        {name: "ImageView", handle: parser.initWidget},
        {name: "LabelAtlas", handle: parser.initWidget},
        {name: "LabelBMFont", handle: parser.initWidget},
        {name: "Label", handle: parser.initWidget},
        {name: "ListView", handle: parser.initWidget},
        {name: "LoadingBar", handle: parser.initWidget},
        {name: "PageView", handle: parser.initWidget},
        {name: "ScrollView", handle: parser.initWidget},
        {name: "Slider", handle: parser.initWidget},
        {name: "TextField", handle: parser.initWidget}
    ];
    register.forEach(function(item){
        parser.registerParser(item.name, function(options, parse, resourcePath){
            var node = item.handle.call(this, options["options"]);
            this.parseComponent(node, options["components"]);
            this.parseChild(parse, node, options, resourcePath);
            return node;
        });
    });
    load.registerParser("timeline", "*", parser);
})(ccs._load, ccs._parser);
(function(load, baseParser){
    var DEBUG = false;
    var Parser = baseParser.extend({
        parse: function(file, json, path){
            var resourcePath;
            if(path !== undefined)
                resourcePath = path;
            else
                resourcePath = this._dirname(file);
            this.pretreatment(json, resourcePath, file);
            var node = this.parseNode(this.getNodeJson(json), resourcePath);
            this.deferred(json, resourcePath, node, file);
            return node;
        },
        getNodeJson: function(json){
            var content = json["Content"];
            if(content["ObjectData"])
                return content["ObjectData"];
            return content["Content"]["ObjectData"];
        },
        getClass: function(json){
            return json["ctype"];
        }
    });
    var parser = new Parser();
    var getParam = function(value, dValue){
        if(value === undefined)
            return dValue;
        else
            return value;
    };
    parser.generalAttributes = function(node, json){
        if(json["Name"] != null)
            node.setName(json["Name"]);
        var position = json["Position"];
        if(position != null && (position["X"] != null || position["Y"] != null))
            node.setPosition(cc.p(position["X"]||0, position["Y"]||0));
        var scale = json["Scale"];
        if(scale != null){
            if(scale["ScaleX"] != null)
                node.setScaleX(scale["ScaleX"]);
            if(scale["ScaleY"] != null)
                node.setScaleY(scale["ScaleY"]);
        }
        var rotationSkewX = json["RotationSkewX"];
        if (rotationSkewX != null)
            node.setRotationX(rotationSkewX);
        var rotationSkewY = json["RotationSkewY"];
        if (json["RotationSkewY"] != null)
            node.setRotationY(rotationSkewY);
        var anchor = json["AnchorPoint"];
        if(anchor != null){
            if(anchor["ScaleX"] == null)
                anchor["ScaleX"] = 0;
            if(anchor["ScaleY"] == null)
                anchor["ScaleY"] = 0;
            if(anchor["ScaleX"] != 0.5 || anchor["ScaleY"] != 0.5)
                node.setAnchorPoint(cc.p(anchor["ScaleX"], anchor["ScaleY"]));
        }
        if (json["ZOrder"] != null)
            node.setLocalZOrder(json["ZOrder"]);
        var visible = getParam(json["VisibleForFrame"], true);
        node.setVisible(visible);
        var size = json["Size"];
        if(size)
            setContentSize(node, size);
        if (json["Alpha"] != null)
            node.setOpacity(json["Alpha"]);
        node.setTag(json["Tag"] || 0);
        var actionTag = json["ActionTag"] || 0;
        var extensionData = new ccs.ComExtensionData();
        var customProperty = json["UserData"];
        if(customProperty !== undefined)
            extensionData.setCustomProperty(customProperty);
        extensionData.setActionTag(actionTag);
        if (node.getComponent("ComExtensionData"))
            node.removeComponent("ComExtensionData");
        node.addComponent(extensionData);
        node.setCascadeColorEnabled(true);
        node.setCascadeOpacityEnabled(true);
        setLayoutComponent(node, json);
    };
    parser.parseChild = function(node, children, resourcePath){
        if(!node || !children) return;
        for (var i = 0; i < children.length; i++) {
            var child = this.parseNode(children[i], resourcePath);
            if(child){
                if(node instanceof ccui.PageView){
                    if(child instanceof ccui.Layout)
                        node.addPage(child);
                } else {
                    if(node instanceof ccui.ListView){
                        if(child instanceof ccui.Widget)
                            node.pushBackCustomItem(child);
                    } else {
                        if(!(node instanceof ccui.Layout) && child instanceof ccui.Widget) {
                            if(child.getPositionType() === ccui.Widget.POSITION_PERCENT) {
                                var position = child.getPositionPercent();
                                var anchor = node.getAnchorPoint();
                                child.setPositionPercent(cc.p(position.x + anchor.x, position.y + anchor.y));
                            }
                        }
                        node.addChild(child);
                    }
                }
            }
        }
    };
    parser.initSingleNode = function(json){
        var node = new cc.Node();
        this.generalAttributes(node, json);
        var color = json["CColor"];
        if(color != null)
            node.setColor(getColor(color));
        return node;
    };
    parser.initSprite = function(json, resourcePath){
        var node =  new cc.Sprite();
        loadTexture(json["FileData"], resourcePath, function(path, type){
            if(type === 0)
                node.setTexture(path);
            else if(type === 1){
                var spriteFrame = cc.spriteFrameCache.getSpriteFrame(path);
                if(spriteFrame)
                    node.setSpriteFrame(spriteFrame);
            }
        });
        var blendData = json["BlendFunc"];
        if(json["BlendFunc"]) {
            var blendFunc = cc.BlendFunc.ALPHA_PREMULTIPLIED;
            if (blendData["Src"] !== undefined)
                blendFunc.src = blendData["Src"];
            if (blendData["Dst"] !== undefined)
                blendFunc.dst = blendData["Dst"];
            node.setBlendFunc(blendFunc);
        }
        if(json["FlipX"])
            node.setFlippedX(true);
        if(json["FlipY"])
            node.setFlippedY(true);
        this.generalAttributes(node, json);
        var color = json["CColor"];
        if(color != null)
            node.setColor(getColor(color));
        return node;
    };
    parser.initParticle = function(json, resourcePath){
        var node,
            self = this;
        loadTexture(json["FileData"], resourcePath, function(path, type){
            if(!cc.loader.getRes(path))
                cc.log("%s need to be preloaded", path);
            node = new cc.ParticleSystem(path);
            self.generalAttributes(node, json);
            node.setPositionType(cc.ParticleSystem.TYPE_GROUPED);
            !cc.sys.isNative && node.setDrawMode(cc.ParticleSystem.TEXTURE_MODE);
            var blendData = json["BlendFunc"];
            if(json["BlendFunc"]){
                var blendFunc = cc.BlendFunc.ALPHA_PREMULTIPLIED;
                if(blendData["Src"] !== undefined)
                    blendFunc.src = blendData["Src"];
                if(blendData["Dst"] !== undefined)
                    blendFunc.dst = blendData["Dst"];
                node.setBlendFunc(blendFunc);
            }
        });
        return node;
    };
    parser.widgetAttributes = function (widget, json, enableContent) {
        widget.setCascadeColorEnabled(true);
        widget.setCascadeOpacityEnabled(true);
        widget.setUnifySizeEnabled(false);
        widget.ignoreContentAdaptWithSize(false);
        !enableContent && setContentSize(widget, json["Size"]);
        var name = json["Name"];
        if (name)
            widget.setName(name);
        var actionTag = json["ActionTag"] || 0;
        widget.setActionTag(actionTag);
        var extensionData = new ccs.ComExtensionData();
        var customProperty = json["UserData"];
        if(customProperty !== undefined)
            extensionData.setCustomProperty(customProperty);
        extensionData.setActionTag(actionTag);
        if (widget.getComponent("ComExtensionData"))
            widget.removeComponent("ComExtensionData");
        widget.addComponent(extensionData);
        var rotationSkewX = json["RotationSkewX"];
        if (rotationSkewX)
            widget.setRotationX(rotationSkewX);
        var rotationSkewY = json["RotationSkewY"];
        if (rotationSkewY)
            widget.setRotationY(rotationSkewY);
        var flipX = json["FlipX"];
        if (flipX)
            widget.setFlippedX(true);
        var flipY = json["FlipY"];
        if (flipY)
            widget.setFlippedY(true);
        var zOrder = json["zOrder"];
        if (zOrder != null)
            widget.setLocalZOrder(zOrder);
        var visible = getParam(json["VisibleForFrame"], true);
        widget.setVisible(visible);
        var alpha = json["Alpha"];
        if (alpha != null)
            widget.setOpacity(alpha);
        widget.setTag(json["Tag"] || 0);
        var touchEnabled = json["TouchEnable"] || false;
        widget.setTouchEnabled(touchEnabled);
        var callBackType = json["CallBackType"];
        if (callBackType != null)
            widget.setCallbackType(callBackType);
        var callBackName = json["CallBackName"];
        if (callBackName)
            widget.setCallbackName(callBackName);
        var position = json["Position"];
        if (position != null)
            widget.setPosition(position["X"] || 0, position["Y"] || 0);
        var scale = json["Scale"];
        if (scale != null) {
            var scaleX = getParam(scale["ScaleX"], 1);
            var scaleY = getParam(scale["ScaleY"], 1);
            widget.setScaleX(scaleX);
            widget.setScaleY(scaleY);
        }
        var anchorPoint = json["AnchorPoint"];
        if (anchorPoint != null)
            widget.setAnchorPoint(anchorPoint["ScaleX"] || 0, anchorPoint["ScaleY"] || 0);
        var color = json["CColor"];
        if (color != null)
            widget.setColor(getColor(color));
        setLayoutComponent(widget, json);
        bindCallback(widget, json);
    };
    var bindCallback = function(widget, json){
        var callBackType = json["CallBackType"];
        var callBackName = json["CallBackName"];
        var callBack = function(e){
            if(typeof widget[callBackName] === "function")
                widget[callBackName](e);
        };
        if(callBackType === "Click"){
            widget.addClickEventListener(callBack);
        }else if(callBackType === "Touch"){
            widget.addTouchEventListener(callBack);
        }else if(callBackType === "Event"){
            widget.addCCSEventListener(callBack);
        }
    };
    var setLayoutComponent = function(widget, json){
        var layoutComponent = ccui.LayoutComponent.bindLayoutComponent(widget);
        if(!layoutComponent)
            return;
        var positionXPercentEnabled = json["PositionPercentXEnable"] || json["PositionPercentXEnabled"] || false;
        var positionYPercentEnabled = json["PositionPercentYEnable"] || json["PositionPercentYEnabled"] || false;
        var positionXPercent = 0,
            positionYPercent = 0,
            PrePosition = json["PrePosition"];
        if (PrePosition != null) {
            positionXPercent = PrePosition["X"] || 0;
            positionYPercent = PrePosition["Y"] || 0;
        }
        var sizeXPercentEnable = json["PercentWidthEnable"] || json["PercentWidthEnabled"]  || false;
        var sizeYPercentEnable = json["PercentHeightEnable"]|| json["PercentHeightEnabled"]  || false;
        var sizeXPercent = 0,
            sizeYPercent = 0,
            PreSize = json["PreSize"];
        if (PrePosition != null) {
            sizeXPercent = PreSize["X"] || 0;
            sizeYPercent = PreSize["Y"] || 0;
        }
        var stretchHorizontalEnabled = json["StretchWidthEnable"] || false;
        var stretchVerticalEnabled = json["StretchHeightEnable"] || false;
        var horizontalEdge = json["HorizontalEdge"];// = ccui.LayoutComponent.horizontalEdge.LEFT;
        var verticalEdge = json["VerticalEdge"];
        var leftMargin = json["LeftMargin"] || 0;
        var rightMargin = json["RightMargin"] || 0;
        var topMargin = json["TopMargin"] || 0;
        var bottomMargin = json["BottomMargin"] || 0;
        layoutComponent.setPositionPercentXEnabled(positionXPercentEnabled);
        layoutComponent.setPositionPercentYEnabled(positionYPercentEnabled);
        layoutComponent.setPositionPercentX(positionXPercent);
        layoutComponent.setPositionPercentY(positionYPercent);
        layoutComponent.setPercentWidthEnabled(sizeXPercentEnable);
        layoutComponent.setPercentHeightEnabled(sizeYPercentEnable);
        layoutComponent.setPercentWidth(sizeXPercent);
        layoutComponent.setPercentHeight(sizeYPercent);
        layoutComponent.setPercentWidthEnabled(sizeXPercentEnable || sizeYPercentEnable);
        layoutComponent.setStretchWidthEnabled(stretchHorizontalEnabled);
        layoutComponent.setStretchHeightEnabled(stretchVerticalEnabled);
        var horizontalEdgeType = ccui.LayoutComponent.horizontalEdge.NONE;
        if (horizontalEdge === "LeftEdge") {
            horizontalEdgeType = ccui.LayoutComponent.horizontalEdge.LEFT;
        } else if (horizontalEdge === "RightEdge") {
            horizontalEdgeType = ccui.LayoutComponent.horizontalEdge.RIGHT;
        } else if (horizontalEdge === "BothEdge") {
            horizontalEdgeType = ccui.LayoutComponent.horizontalEdge.CENTER;
        }
        layoutComponent.setHorizontalEdge(horizontalEdgeType);
        var verticalEdgeType = ccui.LayoutComponent.verticalEdge.NONE;
        if (verticalEdge === "TopEdge") {
            verticalEdgeType = ccui.LayoutComponent.verticalEdge.TOP;
        } else if (verticalEdge === "BottomEdge") {
            verticalEdgeType = ccui.LayoutComponent.verticalEdge.BOTTOM;
        } else if (verticalEdge === "BothEdge") {
            verticalEdgeType = ccui.LayoutComponent.verticalEdge.CENTER;
        }
        layoutComponent.setVerticalEdge(verticalEdgeType);
        layoutComponent.setTopMargin(topMargin);
        layoutComponent.setBottomMargin(bottomMargin);
        layoutComponent.setLeftMargin(leftMargin);
        layoutComponent.setRightMargin(rightMargin);
        layoutComponent.setVerticalEdge(verticalEdgeType);
        layoutComponent.setTopMargin(topMargin);
        layoutComponent.setBottomMargin(bottomMargin);
        layoutComponent.setLeftMargin(leftMargin);
        layoutComponent.setRightMargin(rightMargin);
    };
    var setLayoutBackground = function(layout, single, first, end){
        if( layout.getBackGroundColorType() === 2 ){
            first = first || {};
            end = end || {};
            layout.setBackGroundColor(getColor(first), getColor(end));
        }else{
            single = single || {};
            layout.setBackGroundColor(getColor(single));
        }
    };
    var setLayoutBackgroundVector = function(widget, vector){
        var x = vector["ScaleX"] || 0;
        var y = vector["ScaleY"] || 0;
        widget.setBackGroundColorVector(cc.p(x, y));
    };
    parser.initPanel = function(json, resourcePath){
        var widget = new ccui.Layout();
        this.widgetAttributes(widget, json);
        var clipEnabled = json["ClipAble"] || false;
        if(clipEnabled != null)
            widget.setClippingEnabled(clipEnabled);
        var colorType = getParam(json["ComboBoxIndex"], 0);
        widget.setBackGroundColorType(colorType);
        var bgColorOpacity = getParam(json["BackColorAlpha"], 255);
        if(bgColorOpacity != null)
            widget.setBackGroundColorOpacity(bgColorOpacity);
        var backGroundScale9Enabled = json["Scale9Enable"];
        if(backGroundScale9Enabled != null)
            widget.setBackGroundImageScale9Enabled(backGroundScale9Enabled);
        var opacity = getParam(json["Alpha"], 255);
        widget.setOpacity(opacity);
        loadTexture(json["FileData"], resourcePath, function(path, type){
            widget.setBackGroundImage(path, type);
        });
        if(backGroundScale9Enabled){
            var scale9OriginX = json["Scale9OriginX"] || 0;
            var scale9OriginY = json["Scale9OriginY"] || 0;
            var scale9Width = json["Scale9Width"] || 0;
            var scale9Height = json["Scale9Height"] || 0;
            widget.setBackGroundImageCapInsets(cc.rect(
                scale9OriginX, scale9OriginY, scale9Width, scale9Height
            ));
            setContentSize(widget, json["Size"]);
        }else{
            if (!widget.isIgnoreContentAdaptWithSize()){
                setContentSize(widget, json["Size"]);
            }
        }
        setLayoutBackground(widget, json["SingleColor"], json["FirstColor"], json["EndColor"]);
        setLayoutBackgroundVector(widget, json["ColorVector"]);
        return widget;
    };
    parser.initText = function(json, resourcePath){
        var widget = new ccui.Text();
        var touchScaleEnabled = json["TouchScaleChangeAble"];
        if(touchScaleEnabled != null)
            widget.setTouchScaleChangeEnabled(touchScaleEnabled);
        var text = json["LabelText"];
        if(text != null)
            widget.setString(text);
        var fontSize = json["FontSize"];
        if(fontSize != null)
            widget.setFontSize(fontSize);
        var fontName = json["FontName"];
        if(fontName != null)
            widget.setFontName(fontName);
        var areaWidth = json["AreaWidth"];
        var areaHeight = json["areaHeight"];
        if(areaWidth && areaHeight)
            widget.setTextAreaSize(cc.size(areaWidth, areaHeight));
        var h_alignment = json["HorizontalAlignmentType"] || "HT_Left";
        switch(h_alignment){
            case "HT_Right":
                h_alignment = 2; break;
            case "HT_Center":
                h_alignment = 1; break;
            case "HT_Left":
            default:
                h_alignment = 0;
        }
        widget.setTextHorizontalAlignment(h_alignment);
        var v_alignment = json["VerticalAlignmentType"] || "VT_Top";
        switch(v_alignment){
            case "VT_Bottom":
                v_alignment = 2; break;
            case "VT_Center":
                v_alignment = 1; break;
            case "VT_Top":
            default:
                v_alignment = 0;
        }
        widget.setTextVerticalAlignment(v_alignment);
        var fontResource = json["FontResource"];
        if(fontResource != null){
            var path = fontResource["Path"];
            if(path != null){
                if (cc.sys.isNative) {
                    fontName = cc.path.join(cc.loader.resPath, resourcePath, path);
                } else {
                    fontName = path.match(/([^\/]+)\.(\S+)/);
                    fontName = fontName ? fontName[1] : "";
                }
                widget.setFontName(fontName);
            }
        }
        if(json["OutlineEnabled"] && json["OutlineColor"] && widget.enableOutline)
            widget.enableOutline(getColor(json["OutlineColor"]), getParam(json["OutlineSize"], 1));
        if(json["ShadowEnabled"] && json["ShadowColor"] && widget.enableShadow)
            widget.enableShadow(
                getColor(json["ShadowColor"]),
                cc.size(getParam(json["ShadowOffsetX"], 2), getParam(json["ShadowOffsetY"], -2)),
                json["ShadowBlurRadius"] || 0
            );
        var isCustomSize = json["IsCustomSize"];
        if(isCustomSize != null)
            widget.ignoreContentAdaptWithSize(!isCustomSize);
        widget.setUnifySizeEnabled(false);
        var color = json["CColor"];
        json["CColor"] = null;
        widget.setTextColor(getColor(color));
        this.widgetAttributes(widget, json, widget.isIgnoreContentAdaptWithSize());
        json["CColor"] = color;
        return widget;
    };
    parser.initButton = function(json, resourcePath){
        var widget = new ccui.Button();
        loadTexture(json["NormalFileData"], resourcePath, function(path, type){
            widget.loadTextureNormal(path, type);
        });
        loadTexture(json["PressedFileData"], resourcePath, function(path, type){
            widget.loadTexturePressed(path, type);
        });
        loadTexture(json["DisabledFileData"], resourcePath, function(path, type){
            widget.loadTextureDisabled(path, type);
        });
        var scale9Enabled = getParam(json["Scale9Enable"], false);
        if(scale9Enabled) {
            widget.setScale9Enabled(scale9Enabled);
        }
        var text = json["ButtonText"];
        if(text != null)
            widget.setTitleText(text);
        var fontSize = json["FontSize"];
        if(fontSize != null)
            widget.setTitleFontSize(fontSize);
        var fontName = json["FontName"];
        if(fontName != null)
            widget.setTitleFontName(fontName);
        var textColor = json["TextColor"];
        if(textColor != null)
            widget.setTitleColor(getColor(textColor));
        var displaystate = getParam(json["DisplayState"], true);
        widget.setBright(displaystate);
        widget.setEnabled(displaystate);
        var fontResource = json["FontResource"];
        if(fontResource != null){
            var path = fontResource["Path"];
            if(path != null){
                if (cc.sys.isNative) {
                    fontName = cc.path.join(cc.loader.resPath, resourcePath, path);
                } else {
                    fontName = path.match(/([^\/]+)\.(\S+)/);
                    fontName = fontName ? fontName[1] : "";
                }
                widget.setTitleFontName(fontName);
            }
        }
        var label = widget.getTitleRenderer();
        if(label && json["ShadowEnabled"] && json["ShadowColor"] && label.enableShadow){
            label.enableShadow(
                getColor(json["ShadowColor"]),
                cc.size(getParam(json["ShadowOffsetX"], 2), getParam(json["ShadowOffsetY"], -2)),
                json["ShadowBlurRadius"] || 0
            );
        }
        if(label && json["OutlineEnabled"] && json["OutlineColor"] && label.enableStroke)
            label.enableStroke(getColor(json["OutlineColor"]), getParam(json["OutlineSize"], 1));
        this.widgetAttributes(widget, json);
        if(scale9Enabled) {
            widget.setUnifySizeEnabled(false);
            widget.ignoreContentAdaptWithSize(false);
            var capInsets = cc.rect(
                    json["Scale9OriginX"] || 0,
                    json["Scale9OriginY"] || 0,
                    json["Scale9Width"] || 0,
                    json["Scale9Height"] || 0
            );
            widget.setCapInsets(capInsets);
        }
        setContentSize(widget, json["Size"]);
        return widget;
    };
    parser.initCheckBox = function(json, resourcePath){
        var widget = new ccui.CheckBox();
        this.widgetAttributes(widget, json);
        var dataList = [
            {name: "NormalBackFileData", handle: widget.loadTextureBackGround},
            {name: "PressedBackFileData", handle: widget.loadTextureBackGroundSelected},
            {name: "NodeNormalFileData", handle: widget.loadTextureFrontCross},
            {name: "DisableBackFileData", handle: widget.loadTextureBackGroundDisabled},
            {name: "NodeDisableFileData", handle: widget.loadTextureFrontCrossDisabled}
        ];
        dataList.forEach(function(item){
            loadTexture(json[item.name], resourcePath, function(path, type){
                item.handle.call(widget, path, type);
            });
        });
        var selectedState = getParam(json["CheckedState"], false);
        widget.setSelected(selectedState);
        var displaystate = getParam(json["DisplayState"], true);
        widget.setBright(displaystate);
        widget.setEnabled(displaystate);
        return widget;
    };
    parser.initScrollView = function(json, resourcePath){
        var widget = new ccui.ScrollView();
        this.widgetAttributes(widget, json);
        loadTexture(json["FileData"], resourcePath, function(path, type){
            widget.setBackGroundImage(path, type);
        });
        var clipEnabled = json["ClipAble"] || false;
        widget.setClippingEnabled(clipEnabled);
        var colorType = getParam(json["ComboBoxIndex"], 0);
        widget.setBackGroundColorType(colorType);
        var bgColorOpacity = json["BackColorAlpha"];
        if(bgColorOpacity != null)
            widget.setBackGroundColorOpacity(bgColorOpacity);
        var backGroundScale9Enabled = json["Scale9Enable"];
        if(backGroundScale9Enabled){
            widget.setBackGroundImageScale9Enabled(true);
            var scale9OriginX = json["Scale9OriginX"] || 0;
            var scale9OriginY = json["Scale9OriginY"] || 0;
            var scale9Width = json["Scale9Width"] || 0;
            var scale9Height = json["Scale9Height"] || 0;
            widget.setBackGroundImageCapInsets(cc.rect(
                scale9OriginX, scale9OriginY, scale9Width, scale9Height
            ));
            setContentSize(widget, json["Size"]);
        }else if(!widget.isIgnoreContentAdaptWithSize()){
            setContentSize(widget, json["Size"]);
        }
        setLayoutBackground(widget, json["SingleColor"], json["FirstColor"], json["EndColor"]);
        setLayoutBackgroundVector(widget, json["ColorVector"]);
        var innerNodeSize = json["InnerNodeSize"];
        var innerSize = cc.size(
            innerNodeSize["Width"] || 0,
            innerNodeSize["Height"] || 0
        );
        widget.setInnerContainerSize(innerSize);
        var direction = 0;
        if(json["ScrollDirectionType"] === "Vertical") direction = 1;
        if(json["ScrollDirectionType"] === "Horizontal") direction = 2;
        if(json["ScrollDirectionType"] === "Vertical_Horizontal") direction = 3;
        widget.setDirection(direction);
        var bounceEnabled = getParam(json["IsBounceEnabled"], false);
        widget.setBounceEnabled(bounceEnabled);
        return widget;
    };
    parser.initImageView = function(json, resourcePath){
        var widget = new ccui.ImageView();
        loadTexture(json["FileData"], resourcePath, function(path, type){
            widget.loadTexture(path, type);
        });
        loadTexture(json["ImageFileData"], resourcePath, function(path, type){
            widget.loadTexture(path, type);
        });
        var scale9Enabled = json["Scale9Enable"];
        if(scale9Enabled){
            widget.setScale9Enabled(true);
            widget.setUnifySizeEnabled(false);
            widget.ignoreContentAdaptWithSize(false);
            var scale9OriginX = json["Scale9OriginX"] || 0;
            var scale9OriginY = json["Scale9OriginY"] || 0;
            var scale9Width = json["Scale9Width"] || 0;
            var scale9Height = json["Scale9Height"] || 0;
            widget.setCapInsets(cc.rect(
                scale9OriginX ,
                scale9OriginY,
                scale9Width,
                scale9Height
            ));
        } else
            setContentSize(widget, json["Size"]);
        this.widgetAttributes(widget, json);
        return widget;
    };
    parser.initLoadingBar = function(json, resourcePath){
        var widget = new ccui.LoadingBar();
        this.widgetAttributes(widget, json);
        loadTexture(json["ImageFileData"], resourcePath, function(path, type){
            widget.loadTexture(path, type);
        });
        var direction = json["ProgressType"] === "Right_To_Left" ? 1 : 0;
        widget.setDirection(direction);
        var percent = getParam(json["ProgressInfo"], 80);
        if(percent != null)
            widget.setPercent(percent);
        return widget;
    };
    parser.initSlider = function(json, resourcePath){
        var widget = new ccui.Slider();
        var loader = cc.loader;
        this.widgetAttributes(widget, json);
        var textureList = [
            {name: "BackGroundData", handle: widget.loadBarTexture},
            {name: "BallNormalData", handle: widget.loadSlidBallTextureNormal},
            {name: "BallPressedData", handle: widget.loadSlidBallTexturePressed},
            {name: "BallDisabledData", handle: widget.loadSlidBallTextureDisabled},
            {name: "ProgressBarData", handle: widget.loadProgressBarTexture}
        ];
        textureList.forEach(function(item){
            loadTexture(json[item.name], resourcePath, function(path, type){
                if(type === 0 && !loader.getRes(path))
                    cc.log("%s need to be preloaded", path);
                item.handle.call(widget, path, type);
            });
        });
        var percent = json["PercentInfo"] || 0;
        widget.setPercent(percent);
        var displaystate = getParam(json["DisplayState"], true);
        widget.setBright(displaystate);
        widget.setEnabled(displaystate);
        return widget;
    };
    parser.initPageView = function(json, resourcePath){
        var widget = new ccui.PageView();
        this.widgetAttributes(widget, json);
        loadTexture(json["FileData"], resourcePath, function(path, type){
            widget.setBackGroundImage(path, type);
        });
        var clipEnabled = json["ClipAble"] || false;
        widget.setClippingEnabled(clipEnabled);
        var backGroundScale9Enabled = json["Scale9Enable"];
        if(backGroundScale9Enabled){
            widget.setBackGroundImageScale9Enabled(true);
            var scale9OriginX = json["Scale9OriginX"] || 0;
            var scale9OriginY = json["Scale9OriginY"] || 0;
            var scale9Width = json["Scale9Width"] || 0;
            var scale9Height = json["Scale9Height"] || 0;
            widget.setBackGroundImageCapInsets(cc.rect(
                scale9OriginX,
                scale9OriginY,
                scale9Width,
                scale9Height
            ));
        }
        var colorType = getParam(json["ComboBoxIndex"], 0);
        widget.setBackGroundColorType(colorType);
        setLayoutBackground(widget, json["SingleColor"], json["FirstColor"], json["EndColor"]);
        setLayoutBackgroundVector(widget, json["ColorVector"]);
        var bgColorOpacity = json["BackColorAlpha"];
        if(bgColorOpacity != null)
            widget.setBackGroundColorOpacity(bgColorOpacity);
        setContentSize(widget, json["Size"]);
        return widget;
    };
    parser.initListView = function(json, resourcePath){
        var widget = new ccui.ListView();
        this.widgetAttributes(widget, json);
        loadTexture(json["FileData"], resourcePath, function(path, type){
            widget.setBackGroundImage(path, type);
        });
        var clipEnabled = json["ClipAble"] || false;
        widget.setClippingEnabled(clipEnabled);
        var colorType = getParam(json["ComboBoxIndex"], 0);
        widget.setBackGroundColorType(colorType);
        var bgColorOpacity = getParam(json["BackColorAlpha"], 255);
        var backGroundScale9Enabled = json["Scale9Enable"];
        if(backGroundScale9Enabled){
            widget.setBackGroundImageScale9Enabled(true);
            var scale9OriginX = json["Scale9OriginX"] || 0;
            var scale9OriginY = json["Scale9OriginY"] || 0;
            var scale9Width = json["Scale9Width"] || 0;
            var scale9Height = json["Scale9Height"] || 0;
            widget.setBackGroundImageCapInsets(cc.rect(
                scale9OriginX,
                scale9OriginY,
                scale9Width,
                scale9Height
            ));
        }
        var directionType = getParam(json["DirectionType"], ccui.ListView.DIR_HORIZONTAL);
        var verticalType = getParam(json["VerticalType"], "Align_Left");
        var horizontalType = getParam(json["HorizontalType"], "Align_Top");
        if(!directionType){
            widget.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
            if(verticalType === "Align_Bottom")
                widget.setGravity(ccui.ListView.GRAVITY_BOTTOM);
            else if(verticalType === "Align_VerticalCenter")
                widget.setGravity(ccui.ListView.GRAVITY_CENTER_VERTICAL);
            else
                widget.setGravity(ccui.ListView.GRAVITY_TOP);
        }else if(directionType === "Vertical"){
            widget.setDirection(ccui.ScrollView.DIR_VERTICAL);
            if (horizontalType === "")
                widget.setGravity(ccui.ListView.GRAVITY_LEFT);
            else if (horizontalType === "Align_Right")
                widget.setGravity(ccui.ListView.GRAVITY_RIGHT);
            else if (horizontalType === "Align_HorizontalCenter")
                widget.setGravity(ccui.ListView.GRAVITY_CENTER_HORIZONTAL);
        }
        var bounceEnabled = getParam(json["IsBounceEnabled"], false);
        widget.setBounceEnabled(bounceEnabled);
        var itemMargin = json["ItemMargin"] || 0;
        widget.setItemsMargin(itemMargin);
        var innerSize = json["InnerNodeSize"];
        if(innerSize != null)
            widget.setInnerContainerSize(cc.size(innerSize["Widget"]||0, innerSize["Height"]||0));
        setLayoutBackground(widget, json["SingleColor"], json["FirstColor"], json["EndColor"]);
        setLayoutBackgroundVector(widget, json["ColorVector"]);
        if(bgColorOpacity != null)
            widget.setBackGroundColorOpacity(bgColorOpacity);
        setContentSize(widget, json["Size"]);
        return widget;
    };
    parser.initTextAtlas = function(json, resourcePath){
        var widget = new ccui.TextAtlas();
        var stringValue = json["LabelText"];
        var itemWidth = json["CharWidth"];
        var itemHeight = json["CharHeight"];
        var startCharMap = json["StartChar"];
        loadTexture(json["LabelAtlasFileImage_CNB"], resourcePath, function(path, type){
            if(!cc.loader.getRes(path))
                cc.log("%s need to be preloaded", path);
            if(type === 0){
                widget.setProperty(stringValue, path, itemWidth, itemHeight, startCharMap);
            }
        });
        this.widgetAttributes(widget, json);
        return widget;
    };
    parser.initTextBMFont = function(json, resourcePath){
        var widget = new ccui.TextBMFont();
        this.widgetAttributes(widget, json);
        var text = json["LabelText"];
        widget.setString(text);
        loadTexture(json["LabelBMFontFile_CNB"], resourcePath, function(path, type){
            if(!cc.loader.getRes(path))
                cc.log("%s need to be pre loaded", path);
            widget.setFntFile(path);
        });
        widget.ignoreContentAdaptWithSize(true);
        return widget;
    };
    parser.initTextField = function(json, resourcePath){
        var widget = new ccui.TextField();
        var passwordEnabled = json["PasswordEnable"];
        if(passwordEnabled){
            widget.setPasswordEnabled(true);
            var passwordStyleText = json["PasswordStyleText"] || "*";
            widget.setPasswordStyleText(passwordStyleText);
        }
        var placeHolder = json["PlaceHolderText"];
        if(placeHolder != null)
            widget.setPlaceHolder(placeHolder);
        var fontSize = json["FontSize"];
        if(fontSize != null)
            widget.setFontSize(fontSize);
        var fontName = json["FontName"];
        if(fontName != null)
            widget.setFontName(fontName);
        var maxLengthEnabled = json["MaxLengthEnable"];
        if(maxLengthEnabled){
            widget.setMaxLengthEnabled(true);
            var maxLength = json["MaxLengthText"] || 0;
            widget.setMaxLength(maxLength);
        }
        this.widgetAttributes(widget, json);
        var text = json["LabelText"];
        if(text != null)
            widget.setString(text);
        var fontResource = json["FontResource"];
        if(fontResource != null){
            var path = fontResource["Path"];
            if(path != null){
                if (cc.sys.isNative) {
                    fontName = cc.path.join(cc.loader.resPath, resourcePath, path);
                } else {
                    fontName = path.match(/([^\/]+)\.(\S+)/);
                    fontName = fontName ? fontName[1] : "";
                }
                widget.setFontName(fontName);
            }
        }
        widget.setUnifySizeEnabled(false);
        widget.ignoreContentAdaptWithSize(false);
        var color = json["CColor"];
        if(color != null)
            widget.setTextColor(getColor(color));
        if (!widget.isIgnoreContentAdaptWithSize()){
            setContentSize(widget, json["Size"]);
            if (cc.sys.isNative)
                widget.getVirtualRenderer().setLineBreakWithoutSpace(true);
        }
        return widget;
    };
    parser.initSimpleAudio = function(json, resourcePath){
        var node = new ccs.ComAudio();
        var loop = json["Loop"] || false;
        node.setLoop(loop);
        loadTexture(json["FileData"], resourcePath, function(path, type){
            node.setFile(path);
        });
    };
    parser.initGameMap = function(json, resourcePath){
        var node = null;
        loadTexture(json["FileData"], resourcePath, function(path, type){
            if(type === 0)
                node = new cc.TMXTiledMap(path);
            parser.generalAttributes(node, json);
        });
        return node;
    };
    parser.initProjectNode = function(json, resourcePath){
        var projectFile = json["FileData"];
        if(projectFile != null && projectFile["Path"]){
            var file = resourcePath + projectFile["Path"];
            if(cc.loader.getRes(file)){
                var obj = ccs.load(file, resourcePath);
                parser.generalAttributes(obj.node, json);
                if(obj.action && obj.node){
                    obj.action.tag = obj.node.tag;
                    var InnerActionSpeed = json["InnerActionSpeed"];
                    if(InnerActionSpeed !== undefined)
                        obj.action.setTimeSpeed(InnerActionSpeed);
                    obj.node.runAction(obj.action);
                    obj.action.gotoFrameAndPause(0);
                }
                return obj.node;
            } else
                cc.log("%s need to be preloaded", file);
        }
    };
    var getFileName = function(name){
        if(!name) return "";
        var arr = name.match(/([^\/]+)\.[^\/]+$/);
        if(arr && arr[1])
            return arr[1];
        else
            return "";
    };
    parser.initArmature = function(json, resourcePath){
        var node = new ccs.Armature();
        var isLoop = json["IsLoop"];
        var isAutoPlay = json["IsAutoPlay"];
        var currentAnimationName = json["CurrentAnimationName"];
        loadTexture(json["FileData"], resourcePath, function(path, type){
            var plists, pngs;
            var armJson = cc.loader.getRes(path);
            if(!armJson)
                cc.log("%s need to be preloaded", path);
            else{
                plists = armJson["config_file_path"];
                pngs = armJson["config_png_path"];
                plists.forEach(function(plist, index){
                    if(pngs[index])
                        cc.spriteFrameCache.addSpriteFrames(plist, pngs[index]);
                });
            }
            ccs.armatureDataManager.addArmatureFileInfo(path);
            node.init(getFileName(path));
            if(isAutoPlay)
                node.getAnimation().play(currentAnimationName, -1, isLoop);
            else{
                node.getAnimation().play(currentAnimationName);
                node.getAnimation().gotoAndPause(0);
            }
        });
        delete json["AnchorPoint"];
        delete json["Size"];
        parser.generalAttributes(node, json);
        node.setColor(getColor(json["CColor"]));
        return node;
    };
    parser.initBoneNode = function(json, resourcePath){
        var node = new ccs.BoneNode();
        var length = json["Length"];
        if(length !== undefined)
            node.setDebugDrawLength(length);
        var blendFunc = json["BlendFunc"];
        if(blendFunc && blendFunc["Src"] !== undefined && blendFunc["Dst"] !== undefined)
            node.setBlendFunc(new cc.BlendFunc(blendFunc["Src"], blendFunc["Dst"]));
        parser.generalAttributes(node, json);
        var color = json["CColor"];
        if(color && (color["R"] !== undefined || color["G"] !== undefined || color["B"] !== undefined))
            node.setColor(getColor(color));
        return node;
    };
    parser.initSkeletonNode = function(json){
        var node = new ccs.SkeletonNode();
        parser.generalAttributes(node, json);
        var color = json["CColor"];
        if(color && (color["R"] !== undefined || color["G"] !== undefined || color["B"] !== undefined))
            node.setColor(getColor(color));
        return node;
    };
    var loadedPlist = {};
    var loadTexture = function(json, resourcePath, cb){
        if(json != null){
            var path = json["Path"];
            var type;
            if(json["Type"] === "Default" || json["Type"] === "Normal")
                type = 0;
            else
                type = 1;
            var plist = json["Plist"];
            if(plist){
                if(cc.loader.getRes(resourcePath + plist)){
                    loadedPlist[resourcePath + plist] = true;
                    cc.spriteFrameCache.addSpriteFrames(resourcePath + plist);
                }else{
                    if(!loadedPlist[resourcePath + plist] && !cc.spriteFrameCache.getSpriteFrame(path))
                        cc.log("%s need to be preloaded", resourcePath + plist);
                }
            }
            if(type !== 0){
                if(cc.spriteFrameCache.getSpriteFrame(path))
                    cb(path, type);
                else
                    cc.log("failed to get spriteFrame: %s", path);
            }else
                cb(resourcePath + path, type);
        }
    };
    var getColor = function(json){
        if(!json) return;
        var r = json["R"] != null ? json["R"] : 255;
        var g = json["G"] != null ? json["G"] : 255;
        var b = json["B"] != null ? json["B"] : 255;
        var a = json["A"] != null ? json["A"] : 255;
        return cc.color(r, g, b, a);
    };
    var setContentSize = function(node, size){
        var x = size["X"] || 0;
        var y = size["Y"] || 0;
        if(size)
            node.setContentSize(cc.size(x, y));
    };
    var register = [
        {name: "SingleNodeObjectData", handle: parser.initSingleNode},
        {name: "NodeObjectData", handle: parser.initSingleNode},
        {name: "LayerObjectData", handle: parser.initSingleNode},
        {name: "GameNodeObjectData", handle: parser.initSingleNode},
        {name: "GameLayerObjectData", handle: parser.initSingleNode},
        {name: "SpriteObjectData", handle: parser.initSprite},
        {name: "ParticleObjectData", handle: parser.initParticle},
        {name: "PanelObjectData", handle: parser.initPanel},
        {name: "TextObjectData", handle: parser.initText},
        {name: "ButtonObjectData", handle: parser.initButton},
        {name: "CheckBoxObjectData", handle: parser.initCheckBox},
        {name: "ScrollViewObjectData", handle: parser.initScrollView},
        {name: "ImageViewObjectData", handle: parser.initImageView},
        {name: "LoadingBarObjectData", handle: parser.initLoadingBar},
        {name: "SliderObjectData", handle: parser.initSlider},
        {name: "PageViewObjectData", handle: parser.initPageView},
        {name: "ListViewObjectData", handle: parser.initListView},
        {name: "TextAtlasObjectData", handle: parser.initTextAtlas},
        {name: "TextBMFontObjectData", handle: parser.initTextBMFont},
        {name: "TextFieldObjectData", handle: parser.initTextField},
        {name: "SimpleAudioObjectData", handle: parser.initSimpleAudio},
        {name: "GameMapObjectData", handle: parser.initGameMap},
        {name: "ProjectNodeObjectData", handle: parser.initProjectNode},
        {name: "ArmatureNodeObjectData", handle: parser.initArmature},
        {name: "BoneNodeObjectData", handle: parser.initBoneNode},
        {name: "SkeletonNodeObjectData", handle: parser.initSkeletonNode}
    ];
    register.forEach(function(item){
        parser.registerParser(item.name, function(options, resourcePath){
            var node = item.handle.call(this, options, resourcePath);
            this.parseChild(node, options["Children"], resourcePath);
            DEBUG && node && (node.__parserName = item.name);
            return node;
        });
    });
    load.registerParser("timeline", "2.*", parser);
})(ccs._load, ccs._parser);
(function(load, baseParser){
    var Parser = baseParser.extend({
        addSpriteFrame: function(textures, resourcePath){
            if(!textures) return;
            for (var i = 0; i < textures.length; i++) {
                cc.spriteFrameCache.addSpriteFrames(resourcePath + textures[i]);
            }
        },
        pretreatment: function(json, resourcePath){
            this.addSpriteFrame(json["textures"], resourcePath);
        },
        deferred: function(json, resourcePath, node, file){
            if(node){
                ccs.actionManager.initWithDictionary(file, json["animation"], node);
                node.setContentSize(cc.size(json["designWidth"], json["designHeight"]));
            }
        }
    });
    var parser = new Parser();
    parser.generalAttributes = function(widget, options){
        var ignoreSizeExsit = options["ignoreSize"];
        if(ignoreSizeExsit != null)
            widget.ignoreContentAdaptWithSize(ignoreSizeExsit);
        if (options["sizeType"])
        {
            widget.setSizeType(options["sizeType"]);
        }
        if (options["positionType"])
        {
            widget.setPositionType(options["positionType"]);
        }
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
        var sx = options["scaleX"]!=null ? options["scaleX"] : 1;
        widget.setScaleX(sx);
        var sy = options["scaleY"]!=null ? options["scaleY"] : 1;
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
    };
    parser.colorAttributes = function(widget, options){
        var op = options["opacity"];
        if(op != null)
            widget.setOpacity(op);
        var colorR = options["colorR"];
        var colorG = options["colorG"];
        var colorB = options["colorB"];
        widget.setColor(cc.color((colorR == null) ? 255 : colorR, (colorG == null) ? 255 : colorG, (colorB == null) ? 255 : colorB));
        widget.setFlippedX(options["flipX"]);
        widget.setFlippedY(options["flipY"]);
    };
    parser.anchorPointAttributes = function(widget, options){
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
    };
    parser.parseChild = function(widget, options, resourcePath){
        var children = options["children"];
        for (var i = 0; i < children.length; i++) {
            var child = this.parseNode(children[i], resourcePath);
            if(child){
                if(widget instanceof ccui.PageView)
                    widget.addPage(child);
                else {
                    if(widget instanceof ccui.ListView){
                        widget.pushBackCustomItem(child);
                    } else {
                        if(!(widget instanceof ccui.Layout)) {
                            if(child.getPositionType() === ccui.Widget.POSITION_PERCENT) {
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
    };
    var getPath = function(res, type, path, cb){
        if(path){
            if(type === 0)
                cb(res + path, type);
            else
                cb(path, type);
        }
    };
    parser.LayoutAttributes = function(widget, options, resourcePath){
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
        widget.setSize(cc.size(w, h));
        widget.setClippingEnabled(options["clipAble"]);
        var backGroundScale9Enable = options["backGroundScale9Enable"];
        widget.setBackGroundImageScale9Enabled(backGroundScale9Enable);
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
        widget.setBackGroundColorVector(cc.p(bgcv1, bgcv2));
        var co = options["bgColorOpacity"];
        var colorType = options["colorType"];
        widget.setBackGroundColorType(colorType);
        widget.setBackGroundColor(cc.color(scr, scg, scb), cc.color(ecr, ecg, ecb));
        widget.setBackGroundColor(cc.color(cr, cg, cb));
        widget.setBackGroundColorOpacity(co);
        var imageFileNameDic = options["backGroundImageData"];
        if(imageFileNameDic){
            getPath(resourcePath, imageFileNameDic["resourceType"], imageFileNameDic["path"], function(path, type){
                widget.setBackGroundImage(path, type);
            });
        }
        if (backGroundScale9Enable){
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            widget.setBackGroundImageCapInsets(cc.rect(cx, cy, cw, ch));
        }
        if (options["layoutType"])
        {
            widget.setLayoutType(options["layoutType"]);
        }
    };
    parser.ButtonAttributes = function(widget, options, resourcePath){
        var button = widget;
        var scale9Enable = options["scale9Enable"];
        button.setScale9Enabled(scale9Enable);
        var normalDic = options["normalData"];
        getPath(resourcePath, normalDic["resourceType"], normalDic["path"], function(path, type){
            button.loadTextureNormal(path, type);
        });
        var pressedDic = options["pressedData"];
        getPath(resourcePath, pressedDic["resourceType"], pressedDic["path"], function(path, type){
            button.loadTexturePressed(path, type);
        });
        var disabledDic = options["disabledData"];
        getPath(resourcePath, disabledDic["resourceType"], disabledDic["path"], function(path, type){
            button.loadTextureDisabled(path, type);
        });
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
        var cri = cr!==null?options["textColorR"]:255;
        var cgi = cg!==null?options["textColorG"]:255;
        var cbi = cb!==null?options["textColorB"]:255;
        button.setTitleColor(cc.color(cri,cgi,cbi));
        var fs = options["fontSize"];
        if (fs != null)
            button.setTitleFontSize(options["fontSize"]);
        var fn = options["fontName"];
        if (fn)
            button.setTitleFontName(options["fontName"]);
    };
    parser.CheckBoxAttributes = function(widget, options, resourcePath){
        var backGroundDic = options["backGroundBoxData"];
        getPath(resourcePath, backGroundDic["resourceType"], backGroundDic["path"], function(path, type){
            widget.loadTextureBackGround(path, type);
        });
        var backGroundSelectedDic = options["backGroundBoxSelectedData"];
        getPath(
            resourcePath,
            backGroundSelectedDic["resourceType"] || backGroundDic["resourceType"],
            backGroundSelectedDic["path"] || backGroundDic["path"],
            function(path, type){
            widget.loadTextureBackGroundSelected(path, type);
        });
        var frontCrossDic = options["frontCrossData"];
        getPath(resourcePath, frontCrossDic["resourceType"], frontCrossDic["path"], function(path, type){
            widget.loadTextureFrontCross(path, type);
        });
        var backGroundDisabledDic = options["backGroundBoxDisabledData"];
        getPath(
            resourcePath,
            backGroundDisabledDic["resourceType"] || frontCrossDic["resourceType"],
            backGroundDisabledDic["path"] || frontCrossDic["path"],
            function(path, type){
            widget.loadTextureBackGroundDisabled(path, type);
        });
        var frontCrossDisabledDic = options["frontCrossDisabledData"];
        getPath(resourcePath, frontCrossDisabledDic["resourceType"], frontCrossDisabledDic["path"], function(path, type){
            widget.loadTextureFrontCrossDisabled(path, type);
        });
        if (options["selectedState"])
            widget.setSelected(options["selectedState"]);
    };
    parser.ImageViewAttributes = function(widget, options, resourcePath){
        var imageFileNameDic = options["fileNameData"]
        getPath(resourcePath, imageFileNameDic["resourceType"], imageFileNameDic["path"], function(path, type){
            widget.loadTexture(path, type);
        });
        var scale9EnableExist = options["scale9Enable"];
        var scale9Enable = false;
        if (scale9EnableExist){
            scale9Enable = options["scale9Enable"];
        }
        widget.setScale9Enabled(scale9Enable);
        if (scale9Enable){
            var sw = options["scale9Width"];
            var sh = options["scale9Height"];
            if (sw && sh)
            {
                var swf = options["scale9Width"];
                var shf = options["scale9Height"];
                widget.setSize(cc.size(swf, shf));
            }
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            widget.setCapInsets(cc.rect(cx, cy, cw, ch));
        }
    };
    parser.TextAtlasAttributes = function(widget, options, resourcePath){
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
                    var tp_c = resourcePath;
                    var cmfPath = cmftDic["path"];
                    var cmf_tp = tp_c + cmfPath;
                    widget.setProperty(sv, cmf_tp, iw, ih, scm);
                    break;
                case 1:
                    cc.log("Wrong res type of LabelAtlas!");
                    break;
                default:
                    break;
            }
        }
    };
    parser.TextBMFontAttributes = function(widget, options, resourcePath){
        var cmftDic = options["fileNameData"];
        var cmfType = cmftDic["resourceType"];
        switch (cmfType) {
            case 0:
                var tp_c = resourcePath;
                var cmfPath = cmftDic["path"];
                var cmf_tp = tp_c + cmfPath;
                widget.setFntFile(cmf_tp);
                break;
            case 1:
                cc.log("Wrong res type of LabelAtlas!");
                break;
            default:
                break;
        }
        var text = options["text"];
        widget.setString(text);
    };
    var regTTF = /\.ttf$/;
    parser.TextAttributes = function(widget, options, resourcePath){
        var touchScaleChangeAble = options["touchScaleEnable"];
        widget.setTouchScaleChangeEnabled(touchScaleChangeAble);
        var text = options["text"];
        widget.setString(text);
        var fs = options["fontSize"];
        if (fs != null){
            widget.setFontSize(options["fontSize"]);
        }
        var fn = options["fontName"];
        if (fn != null){
            if(cc.sys.isNative){
                if(regTTF.test(fn)){
                    widget.setFontName(cc.path.join(cc.loader.resPath, resourcePath, fn));
                }else{
                    widget.setFontName(fn);
                }
            }else{
                widget.setFontName(fn.replace(regTTF, ''));
            }
        }
        var aw = options["areaWidth"];
        var ah = options["areaHeight"];
        if (aw != null && ah != null){
            var size = cc.size(options["areaWidth"], options["areaHeight"]);
            widget.setTextAreaSize(size);
        }
        var ha = options["hAlignment"];
        if (ha != null){
            widget.setTextHorizontalAlignment(options["hAlignment"]);
        }
        var va = options["vAlignment"];
        if (va != null){
            widget.setTextVerticalAlignment(options["vAlignment"]);
        }
    };
    parser.ListViewAttributes = function(widget, options, resoutcePath){
        parser.ScrollViewAttributes(widget, options,resoutcePath);
        var direction = options["direction"];
        widget.setDirection(direction);
        var gravity = options["gravity"];
        widget.setGravity(gravity);
        var itemMargin = options["itemMargin"];
        widget.setItemsMargin(itemMargin);
    };
    parser.LoadingBarAttributes = function(widget, options, resourcePath){
        var imageFileNameDic = options["textureData"];
        getPath(resourcePath, imageFileNameDic["resourceType"], imageFileNameDic["path"], function(path, type){
            widget.loadTexture(path, type);
        });
        var scale9Enable = options["scale9Enable"];
        widget.setScale9Enabled(scale9Enable);
        if (scale9Enable){
            var cx = options["capInsetsX"];
            var cy = options["capInsetsY"];
            var cw = options["capInsetsWidth"];
            var ch = options["capInsetsHeight"];
            widget.setCapInsets(cc.rect(cx, cy, cw, ch));
            var width = options["width"];
            var height = options["height"];
            widget.setSize(cc.size(width, height));
        }
        widget.setDirection(options["direction"]);
        widget.setPercent(options["percent"]);
    };
    parser.PageViewAttributes = parser.LayoutAttributes;
    parser.ScrollViewAttributes = function(widget, options, resoutcePath){
        parser.LayoutAttributes(widget, options,resoutcePath);
        var innerWidth = options["innerWidth"]!=null ? options["innerWidth"] : 200;
        var innerHeight = options["innerHeight"]!=null ? options["innerHeight"] : 200;
        widget.setInnerContainerSize(cc.size(innerWidth, innerHeight));
        var direction = options["direction"]!=null ? options["direction"] : 1;
        widget.setDirection(direction);
        widget.setBounceEnabled(options["bounceEnable"]);
    };
    parser.SliderAttributes = function(widget, options, resourcePath){
        var slider = widget;
        var barTextureScale9Enable = options["scale9Enable"];
        slider.setScale9Enabled(barTextureScale9Enable);
        var bt = options["barFileName"];
        var barLength = options["length"];
        var imageFileNameDic = options["barFileNameData"];
        var imageFileType = imageFileNameDic["resourceType"];
        var imageFileName = imageFileNameDic["path"];
        if(bt != null){
            if(barTextureScale9Enable){
                getPath(resourcePath, imageFileType, imageFileName, function(path, type){
                    slider.loadBarTexture(path, type);
                });
                slider.setSize(cc.size(barLength, slider.getContentSize().height));
            }
        }else{
            getPath(resourcePath, imageFileType, imageFileName, function(path, type){
                slider.loadBarTexture(path, type);
            });
        }
        var normalDic = options["ballNormalData"];
        getPath(resourcePath, normalDic["resourceType"], normalDic["path"], function(path, type){
            slider.loadSlidBallTextureNormal(path, type);
        });
        var pressedDic = options["ballPressedData"];
        getPath(
            resourcePath,
            pressedDic["resourceType"] || normalDic["resourceType"],
            pressedDic["path"] || normalDic["path"],
            function(path, type){
                slider.loadSlidBallTexturePressed(path, type);
        });
        var disabledDic = options["ballDisabledData"];
        getPath(resourcePath, disabledDic["resourceType"], disabledDic["path"], function(path, type){
            slider.loadSlidBallTextureDisabled(path, type);
        });
        var progressBarDic = options["progressBarData"];
        getPath(resourcePath, progressBarDic["resourceType"], progressBarDic["path"], function(path, type){
            slider.loadProgressBarTexture(path, type);
        });
    };
    parser.TextFieldAttributes = function(widget, options, resourcePath){
        var ph = options["placeHolder"];
        if(ph)
            widget.setPlaceHolder(ph);
        widget.setString(options["text"]||"");
        var fs = options["fontSize1"];
        if(fs)
            widget.setFontSize(fs);
        var fn = options["fontName"];
        if (fn != null){
            if(cc.sys.isNative){
                if(regTTF.test(fn)){
                    widget.setFontName(cc.path.join(cc.loader.resPath, resourcePath, fn));
                }else{
                    widget.setFontName(fn);
                }
            }else{
                widget.setFontName(fn.replace(regTTF, ''));
            }
        }
        var tsw = options["touchSizeWidth"];
        var tsh = options["touchSizeHeight"];
        if(tsw!=null && tsh!=null)
            widget.setTouchSize(tsw, tsh);
        var dw = options["width"];
        var dh = options["height"];
        if(dw > 0 || dh > 0){
        }
        var maxLengthEnable = options["maxLengthEnable"];
        widget.setMaxLengthEnabled(maxLengthEnable);
        if(maxLengthEnable){
            var maxLength = options["maxLength"];
            widget.setMaxLength(maxLength);
        }
        var passwordEnable = options["passwordEnable"];
        widget.setPasswordEnabled(passwordEnable);
        if(passwordEnable)
            widget.setPasswordStyleText(options["passwordStyleText"]);
        var aw = options["areaWidth"];
        var ah = options["areaHeight"];
        if(aw && ah){
            var size = cc.size(aw, ah);
            widget.setTextAreaSize(size);
        }
        var ha = options["hAlignment"];
        if(ha)
            widget.setTextHorizontalAlignment(ha);
        var va = options["vAlignment"];
        if(va)
            widget.setTextVerticalAlignment(va);
    };
    var register = [
        {name: "Panel", object: ccui.Layout, handle: parser.LayoutAttributes},
        {name: "Button", object: ccui.Button, handle: parser.ButtonAttributes},
        {name: "CheckBox", object: ccui.CheckBox, handle: parser.CheckBoxAttributes},
        {name: "ImageView", object: ccui.ImageView, handle: parser.ImageViewAttributes},
        {name: "LabelAtlas", object: ccui.TextAtlas, handle: parser.TextAtlasAttributes},
        {name: "LabelBMFont", object: ccui.TextBMFont, handle: parser.TextBMFontAttributes},
        {name: "Label", object: ccui.Text, handle: parser.TextAttributes},
        {name: "ListView", object: ccui.ListView, handle: parser.ListViewAttributes},
        {name: "LoadingBar", object: ccui.LoadingBar, handle: parser.LoadingBarAttributes},
        {name: "PageView", object: ccui.PageView, handle: parser.PageViewAttributes},
        {name: "ScrollView", object: ccui.ScrollView, handle: parser.ScrollViewAttributes},
        {name: "Slider", object: ccui.Slider, handle: parser.SliderAttributes},
        {name: "TextField", object: ccui.TextField, handle: parser.TextFieldAttributes}
    ];
    register.forEach(function(item){
        parser.registerParser(item.name, function(options, resourcePath){
            var widget = new item.object;
            var uiOptions = options["options"];
            parser.generalAttributes(widget, uiOptions);
            item.handle(widget, uiOptions, resourcePath);
            parser.colorAttributes(widget, uiOptions);
            parser.anchorPointAttributes(widget, uiOptions);
            parser.parseChild.call(this, widget, options, resourcePath);
            return widget;
        });
    });
    load.registerParser("ccui", "*", parser);
})(ccs._load, ccs._parser);
(function(){
    ccs.uiReader = {
        _fileDesignSizes: {},
        widgetFromJsonFile: function(file){
            var json = cc.loader.getRes(file);
            if(json)
                this._fileDesignSizes[file] = cc.size(json["designWidth"]||0, json["designHeight"]||0);
            var version = json["Version"] || json["version"];
            var versionNum = ccs.uiReader.getVersionInteger(version);
            if(!version || versionNum >= 1700){
                cc.warn("Not supported file types, Please try use the ccs.load");
                return null;
            }
            return ccs._load(file, "ccui");
        },
        registerTypeAndCallBack: function(classType, ins, object, callback){
            var parser = ccs._load.getParser("ccui")["*"];
            var func = callback.bind(object);
            parser.registerParser(classType, function(options, resourcePath){
                var widget = new ins();
                var uiOptions = options["options"];
                object.setPropsFromJsonDictionary && object.setPropsFromJsonDictionary(widget, uiOptions);
                this.generalAttributes(widget, uiOptions);
                var customProperty = uiOptions["customProperty"];
                if(customProperty)
                    customProperty = JSON.parse(customProperty);
                else
                    customProperty = {};
                func(classType, widget, customProperty);
                this.colorAttributes(widget, uiOptions);
                this.anchorPointAttributes(widget, uiOptions);
                this.parseChild.call(this, widget, options, resourcePath);
                return widget;
            });
        },
        getVersionInteger: function(version){
            if(!version || typeof version !== "string") return 0;
            var arr = version.split(".");
            if (arr.length !== 4)
                return 0;
            var num = 0;
            arr.forEach(function(n, i){
                num += n * Math.pow(10, 3 - i);
            });
            return num;
        },
        storeFileDesignSize: function (fileName, size) {
            this._fileDesignSizes[fileName] = size;
        },
        getFileDesignSize: function (fileName) {
            return this._fileDesignSizes[fileName];
        },
        getFilePath: function(){
            return this._filePath;
        },
        setFilePath: function(path){
            this._filePath = path;
        },
        getParseObjectMap: function(){
            return ccs._load.getParser("ccui")["*"]["parsers"];
        },
        getParseCallBackMap: function(){
            return ccs._load.getParser("ccui")["*"]["parsers"];
        },
        clear: function(){}
    };
    var parser = ccs._load.getParser("ccui")["*"];
    ccs.imageViewReader  = {setPropsFromJsonDictionary: parser.ImageViewAttributes};
    ccs.buttonReader     = {setPropsFromJsonDictionary: parser.ButtonAttributes};
    ccs.checkBoxReader   = {setPropsFromJsonDictionary: parser.CheckBoxAttributes};
    ccs.labelAtlasReader = {setPropsFromJsonDictionary: parser.TextAtlasAttributes};
    ccs.labelBMFontReader= {setPropsFromJsonDictionary: parser.TextBMFontAttributes};
    ccs.labelReader      = {setPropsFromJsonDictionary: parser.TextAttributes};
    ccs.layoutReader     = {setPropsFromJsonDictionary: parser.LayoutAttributes};
    ccs.listViewReader   = {setPropsFromJsonDictionary: parser.ListViewAttributes};
    ccs.loadingBarReader = {setPropsFromJsonDictionary: parser.LoadingBarAttributes};
    ccs.pageViewReader   = {setPropsFromJsonDictionary: parser.PageViewAttributes};
    ccs.scrollViewReader = {setPropsFromJsonDictionary: parser.ScrollViewAttributes};
    ccs.sliderReader     = {setPropsFromJsonDictionary: parser.SliderAttributes};
    ccs.textFieldReader  = {setPropsFromJsonDictionary: parser.TextFieldAttributes};
})();
(function(){
    ccs.sceneReader = {
        _node: null,
        createNodeWithSceneFile: function(file){
            var node = ccs._load(file, "scene");
            this._node = node;
            return node;
        },
        getNodeByTag: function(tag){
            if (this._node == null)
                return null;
            if (this._node.getTag() === tag)
                return this._node;
            return this._nodeByTag(this._node, tag);
        },
        _nodeByTag: function (parent, tag) {
            if (parent == null)
                return null;
            var retNode = null;
            var children = parent.getChildren();
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child && child.getTag() === tag) {
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
        version: function(){
            return "*";
        },
        setTarget: function(){},
        clear: function(){
            ccs.triggerManager.removeAll();
            cc.audioEngine.end();
        }
    };
})();
