cc.CONTROL_EVENT_TOTAL_NUMBER = 9;
cc.CONTROL_EVENT_TOUCH_DOWN = 1 << 0;
cc.CONTROL_EVENT_TOUCH_DRAG_INSIDE = 1 << 1;
cc.CONTROL_EVENT_TOUCH_DRAG_OUTSIDE = 1 << 2;
cc.CONTROL_EVENT_TOUCH_DRAG_ENTER = 1 << 3;
cc.CONTROL_EVENT_TOUCH_DRAG_EXIT = 1 << 4;
cc.CONTROL_EVENT_TOUCH_UP_INSIDE = 1 << 5;
cc.CONTROL_EVENT_TOUCH_UP_OUTSIDE = 1 << 6;
cc.CONTROL_EVENT_TOUCH_CANCEL = 1 << 7;
cc.CONTROL_EVENT_VALUECHANGED = 1 << 8;
cc.CONTROL_STATE_NORMAL = 1 << 0;
cc.CONTROL_STATE_HIGHLIGHTED = 1 << 1;
cc.CONTROL_STATE_DISABLED = 1 << 2;
cc.CONTROL_STATE_SELECTED = 1 << 3;
cc.CONTROL_STATE_INITIAL = 1 << 3;
cc.Control = cc.Layer.extend({
    _isOpacityModifyRGB: false,
    _hasVisibleParents: false,
    _touchListener: null,
    _className: "Control",
    isOpacityModifyRGB: function () {
        return this._isOpacityModifyRGB;
    },
    setOpacityModifyRGB: function (opacityModifyRGB) {
        this._isOpacityModifyRGB = opacityModifyRGB;
        var children = this.getChildren();
        for (var i = 0, len = children.length; i < len; i++) {
            var selNode = children[i];
            if (selNode)
                selNode.setOpacityModifyRGB(opacityModifyRGB);
        }
    },
    _state: cc.CONTROL_STATE_NORMAL,
    getState: function () {
        return this._state;
    },
    _enabled: false,
    _selected: false,
    _highlighted: false,
    _dispatchTable: null,
    setEnabled: function (enabled) {
        this._enabled = enabled;
        this._state = enabled ? cc.CONTROL_STATE_NORMAL : cc.CONTROL_STATE_DISABLED;
        this.needsLayout();
    },
    isEnabled: function () {
        return this._enabled;
    },
    setSelected: function (selected) {
        this._selected = selected;
        this.needsLayout();
    },
    isSelected: function () {
        return this._selected;
    },
    setHighlighted: function (highlighted) {
        this._highlighted = highlighted;
        this.needsLayout();
    },
    isHighlighted: function () {
        return this._highlighted;
    },
    hasVisibleParents: function () {
        var parent = this.getParent();
        for (var c = parent; c != null; c = c.getParent()) {
            if (!c.isVisible())
                return false;
        }
        return true;
    },
    ctor: function () {
        cc.Layer.prototype.ctor.call(this);
        this._dispatchTable = {};
        this._color = cc.color.WHITE;
    },
    init: function () {
        if (cc.Layer.prototype.init.call(this)) {
            this._state = cc.CONTROL_STATE_NORMAL;
            this._enabled = true;
            this._selected = false;
            this._highlighted = false;
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true
            });
            if (this.onTouchBegan)
                listener.onTouchBegan = this.onTouchBegan.bind(this);
            if (this.onTouchMoved)
                listener.onTouchMoved = this.onTouchMoved.bind(this);
            if (this.onTouchEnded)
                listener.onTouchEnded = this.onTouchEnded.bind(this);
            if (this.onTouchCancelled)
                listener.onTouchCancelled = this.onTouchCancelled.bind(this);
            this._touchListener = listener;
            return true;
        } else
            return false;
    },
    onEnter: function () {
        var locListener = this._touchListener;
        if (!locListener._isRegistered())
            cc.eventManager.addListener(locListener, this);
        cc.Node.prototype.onEnter.call(this);
    },
    sendActionsForControlEvents: function (controlEvents) {
        for (var i = 0, len = cc.CONTROL_EVENT_TOTAL_NUMBER; i < len; i++) {
            if ((controlEvents & (1 << i))) {
                var invocationList = this._dispatchListforControlEvent(1 << i);
                for (var j = 0, inLen = invocationList.length; j < inLen; j++) {
                    invocationList[j].invoke(this);
                }
            }
        }
    },
    addTargetWithActionForControlEvents: function (target, action, controlEvents) {
        for (var i = 0, len = cc.CONTROL_EVENT_TOTAL_NUMBER; i < len; i++) {
            if ((controlEvents & (1 << i)))
                this._addTargetWithActionForControlEvent(target, action, 1 << i);
        }
    },
    removeTargetWithActionForControlEvents: function (target, action, controlEvents) {
        for (var i = 0, len = cc.CONTROL_EVENT_TOTAL_NUMBER; i < len; i++) {
            if ((controlEvents & (1 << i)))
                this._removeTargetWithActionForControlEvent(target, action, 1 << i);
        }
    },
    getTouchLocation: function (touch) {
        var touchLocation = touch.getLocation();
        return this.convertToNodeSpace(touchLocation);
    },
    isTouchInside: function (touch) {
        var touchLocation = touch.getLocation();
        touchLocation = this.getParent().convertToNodeSpace(touchLocation);
        return cc.rectContainsPoint(this.getBoundingBox(), touchLocation);
    },
    _invocationWithTargetAndActionForControlEvent: function (target, action, controlEvent) {
        return null;
    },
    _dispatchListforControlEvent: function (controlEvent) {
        controlEvent = controlEvent.toString();
        if (!this._dispatchTable[controlEvent])
            this._dispatchTable[controlEvent] = [];
        return this._dispatchTable[controlEvent];
    },
    _addTargetWithActionForControlEvent: function (target, action, controlEvent) {
        var invocation = new cc.Invocation(target, action, controlEvent);
        var eventInvocationList = this._dispatchListforControlEvent(controlEvent);
        eventInvocationList.push(invocation);
    },
    _removeTargetWithActionForControlEvent: function (target, action, controlEvent) {
        var eventInvocationList = this._dispatchListforControlEvent(controlEvent);
        var bDeleteObjects = true;
        if (!target && !action) {
            eventInvocationList.length = 0;
        } else {
            for (var i = 0; i < eventInvocationList.length;) {
                var invocation = eventInvocationList[i];
                var shouldBeRemoved = true;
                if (target)
                    shouldBeRemoved = (target == invocation.getTarget());
                if (action)
                    shouldBeRemoved = (shouldBeRemoved && (action == invocation.getAction()));
                if (shouldBeRemoved)
                    cc.arrayRemoveObject(eventInvocationList, invocation);
                else
                    i++;
            }
        }
    },
    needsLayout: function () {
    }
});
var _p = cc.Control.prototype;
_p.state;
cc.defineGetterSetter(_p, "state", _p.getState);
_p.enabled;
cc.defineGetterSetter(_p, "enabled", _p.isEnabled, _p.setEnabled);
_p.selected;
cc.defineGetterSetter(_p, "selected", _p.isSelected, _p.setSelected);
_p.highlighted;
cc.defineGetterSetter(_p, "highlighted", _p.isHighlighted, _p.setHighlighted);
_p = null;
cc.Control.create = function () {
    var retControl = new cc.Control();
    if (retControl && retControl.init())
        return retControl;
    return null;
};
cc.CONTROL_ZOOM_ACTION_TAG = 0xCCCB0001;
cc.ControlButton = cc.Control.extend({
    _doesAdjustBackgroundImage: false,
    zoomOnTouchDown: false,
    _preferredSize: null,
    _labelAnchorPoint: null,
    _currentTitle: null,
    _currentTitleColor: null,
    _titleLabel: null,
    _backgroundSprite: null,
    _opacity: 0,
    _isPushed: false,
    _titleDispatchTable: null,
    _titleColorDispatchTable: null,
    _titleLabelDispatchTable: null,
    _backgroundSpriteDispatchTable: null,
    _parentInited: false,
    _marginV: 0,
    _marginH: 0,
    _className: "ControlButton",
    ctor: function (label, backgroundSprite, fontSize) {
        cc.Control.prototype.ctor.call(this);
        this._preferredSize = cc.size(0, 0);
        this._labelAnchorPoint = cc.p(0, 0);
        this._currentTitle = "";
        this._currentTitleColor = cc.color.WHITE;
        this._titleDispatchTable = {};
        this._titleColorDispatchTable = {};
        this._titleLabelDispatchTable = {};
        this._backgroundSpriteDispatchTable = {};
        if(fontSize != undefined)
            this.initWithTitleAndFontNameAndFontSize(label, backgroundSprite, fontSize);
        else if(backgroundSprite != undefined)
            this.initWithLabelAndBackgroundSprite(label, backgroundSprite);
        else if(label != undefined)
            this.initWithBackgroundSprite(label);
        else
            this.init();
    },
    init: function () {
        return this.initWithLabelAndBackgroundSprite(new cc.LabelTTF("", "Arial", 12), new cc.Scale9Sprite());
    },
    needsLayout: function () {
        if (!this._parentInited) {
            return;
        }
        if (this._titleLabel)
            this._titleLabel.setVisible(false);
        if (this._backgroundSprite)
            this._backgroundSprite.setVisible(false);
        this.setLabelAnchorPoint(this._labelAnchorPoint);
        var locState = this._state;
        this._currentTitle = this.getTitleForState(locState);
        this._currentTitleColor = this.getTitleColorForState(locState);
        this._titleLabel = this.getTitleLabelForState(locState);
        var label = this._titleLabel;
        if (label && label.setString)
            label.setString(this._currentTitle);
        if (label)
            label.setColor(this._currentTitleColor);
        var locContentSize = this.getContentSize();
        if (label)
            label.setPosition(locContentSize.width / 2, locContentSize.height / 2);
        this._backgroundSprite = this.getBackgroundSpriteForState(locState);
        var locBackgroundSprite = this._backgroundSprite;
        if (locBackgroundSprite)
            locBackgroundSprite.setPosition(locContentSize.width / 2, locContentSize.height / 2);
        var titleLabelSize = cc.size(0, 0);
        if (label) {
            var boundingBox = label.getBoundingBox();
            titleLabelSize.width = boundingBox.width;
            titleLabelSize.height = boundingBox.height;
        }
        if (this._doesAdjustBackgroundImage) {
            if (locBackgroundSprite)
                locBackgroundSprite.setContentSize(titleLabelSize.width + this._marginH * 2, titleLabelSize.height + this._marginV * 2);
        } else {
            if (locBackgroundSprite) {
                var preferredSize = locBackgroundSprite.getPreferredSize();
                preferredSize = cc.size(preferredSize.width, preferredSize.height);
                if (preferredSize.width <= 0)
                    preferredSize.width = titleLabelSize.width;
                if (preferredSize.height <= 0)
                    preferredSize.height = titleLabelSize.height;
                locBackgroundSprite.setContentSize(preferredSize);
            }
        }
        var rectTitle = label ? label.getBoundingBox() : cc.rect(0, 0, 0, 0);
        var rectBackground = locBackgroundSprite ? locBackgroundSprite.getBoundingBox() : cc.rect(0, 0, 0, 0);
        var maxRect = cc.rectUnion(rectTitle, rectBackground);
        this.setContentSize(maxRect.width, maxRect.height);
        locContentSize = this.getContentSize();
        if (label) {
            label.setPosition(locContentSize.width / 2, locContentSize.height / 2);
            label.setVisible(true);
        }
        if (locBackgroundSprite) {
            locBackgroundSprite.setPosition(locContentSize.width / 2, locContentSize.height / 2);
            locBackgroundSprite.setVisible(true);
        }
    },
    initWithLabelAndBackgroundSprite: function (label, backgroundSprite) {
        if (!label)
            throw "cc.ControlButton.initWithLabelAndBackgroundSprite(): label should be non-null";
        if (!backgroundSprite)
            throw "cc.ControlButton.initWithLabelAndBackgroundSprite(): backgroundSprite should be non-null";
        if (cc.Control.prototype.init.call(this, true)) {
            this._parentInited = true;
            this._titleDispatchTable = {};
            this._titleColorDispatchTable = {};
            this._titleLabelDispatchTable = {};
            this._backgroundSpriteDispatchTable = {};
            this._isPushed = false;
            this.zoomOnTouchDown = true;
            this._currentTitle = null;
            this.setAdjustBackgroundImage(true);
            this.setPreferredSize(cc.size(0, 0));
            this.zoomOnTouchDown = true;
            this.ignoreAnchorPointForPosition(false);
            this.setAnchorPoint(0.5, 0.5);
            this._titleLabel = label;
            this._backgroundSprite = backgroundSprite;
            this.setOpacity(255);
            this.setOpacityModifyRGB(true);
            var tempString = label.getString();
            this.setTitleForState(tempString, cc.CONTROL_STATE_NORMAL);
            this.setTitleColorForState(label.getColor(), cc.CONTROL_STATE_NORMAL);
            this.setTitleLabelForState(label, cc.CONTROL_STATE_NORMAL);
            this.setBackgroundSpriteForState(backgroundSprite, cc.CONTROL_STATE_NORMAL);
            this._state = cc.CONTROL_STATE_NORMAL;
            this._marginH = 24;
            this._marginV = 12;
            this._labelAnchorPoint = cc.p(0.5, 0.5);
            this.setPreferredSize(cc.size(0, 0));
            this.needsLayout();
            return true;
        }//couldn't init the CCControl
        else
            return false;
    },
    initWithTitleAndFontNameAndFontSize: function (title, fontName, fontSize) {
        var label = new cc.LabelTTF(title, fontName, fontSize);
        return this.initWithLabelAndBackgroundSprite(label, new cc.Scale9Sprite());
    },
    initWithBackgroundSprite: function (sprite) {
        var label = new cc.LabelTTF("", "Arial", 30);//
        return this.initWithLabelAndBackgroundSprite(label, sprite);
    },
    doesAdjustBackgroundImage: function () {
        return this._doesAdjustBackgroundImage;
    },
    setAdjustBackgroundImage: function (adjustBackgroundImage) {
        this._doesAdjustBackgroundImage = adjustBackgroundImage;
        this.needsLayout();
    },
    getZoomOnTouchDown: function () {
        return this.zoomOnTouchDown;
    },
    setZoomOnTouchDown: function (zoomOnTouchDown) {
        return this.zoomOnTouchDown = zoomOnTouchDown;
    },
    getPreferredSize: function () {
        return this._preferredSize;
    },
    setPreferredSize: function (size) {
        if (size.width === 0 && size.height === 0) {
            this._doesAdjustBackgroundImage = true;
        } else {
            this._doesAdjustBackgroundImage = false;
            var locTable = this._backgroundSpriteDispatchTable;
            for (var itemKey in locTable)
                locTable[itemKey].setPreferredSize(size);
        }
        this._preferredSize = size;
        this.needsLayout();
    },
    getLabelAnchorPoint: function () {
        return this._labelAnchorPoint;
    },
    setLabelAnchorPoint: function (labelAnchorPoint) {
        this._labelAnchorPoint = labelAnchorPoint;
        if (this._titleLabel)
            this._titleLabel.setAnchorPoint(labelAnchorPoint);
    },
    _getCurrentTitle: function () {
        return this._currentTitle;
    },
    _getCurrentTitleColor: function () {
        return this._currentTitleColor;
    },
    getOpacity: function () {
        return this._opacity;
    },
    setOpacity: function (opacity) {
        cc.Control.prototype.setOpacity.call(this, opacity);
        var locTable = this._backgroundSpriteDispatchTable;
        for (var itemKey in locTable)
            locTable[itemKey].setOpacity(opacity);
    },
    setColor: function (color) {
        cc.Control.prototype.setColor.call(this, color);
        var locTable = this._backgroundSpriteDispatchTable;
        for (var key in locTable)
            locTable[key].setColor(color);
    },
    getColor: function () {
        var locRealColor = this._realColor;
        return cc.color(locRealColor.r, locRealColor.g, locRealColor.b, locRealColor.a);
    },
    isPushed: function () {
        return this._isPushed;
    },
    _getVerticalMargin: function () {
        return this._marginV;
    },
    _getHorizontalOrigin: function () {
        return this._marginH;
    },
    setMargins: function (marginH, marginV) {
        this._marginV = marginV;
        this._marginH = marginH;
        this.needsLayout();
    },
    setEnabled: function (enabled) {
        cc.Control.prototype.setEnabled.call(this, enabled);
        this.needsLayout();
    },
    setSelected: function (enabled) {
        cc.Control.prototype.setSelected.call(this, enabled);
        this.needsLayout();
    },
    setHighlighted: function (enabled) {
        this._state = enabled ? cc.CONTROL_STATE_HIGHLIGHTED : cc.CONTROL_STATE_NORMAL;
        cc.Control.prototype.setHighlighted.call(this, enabled);
        var action = this.getActionByTag(cc.CONTROL_ZOOM_ACTION_TAG);
        if (action)
            this.stopAction(action);
        if (this.zoomOnTouchDown) {
            var scaleValue = (this.isHighlighted() && this.isEnabled() && !this.isSelected()) ? 1.1 : 1.0;
            var zoomAction = cc.scaleTo(0.05, scaleValue);
            zoomAction.setTag(cc.CONTROL_ZOOM_ACTION_TAG);
            this.runAction(zoomAction);
        }
    },
    onTouchBegan: function (touch, event) {
        if (!this.isTouchInside(touch) || !this.isEnabled() || !this.isVisible() || !this.hasVisibleParents())
            return false;
        this._isPushed = true;
        this.setHighlighted(true);
        this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_DOWN);
        return true;
    },
    onTouchMoved: function (touch, event) {
        if (!this._enabled || !this._isPushed || this._selected) {
            if (this._highlighted)
                this.setHighlighted(false);
            return;
        }
        var isTouchMoveInside = this.isTouchInside(touch);
        if (isTouchMoveInside && !this._highlighted) {
            this.setHighlighted(true);
            this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_DRAG_ENTER);
        } else if (isTouchMoveInside && this._highlighted) {
            this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_DRAG_INSIDE);
        } else if (!isTouchMoveInside && this._highlighted) {
            this.setHighlighted(false);
            this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_DRAG_EXIT);
        } else if (!isTouchMoveInside && !this._highlighted) {
            this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_DRAG_OUTSIDE);
        }
    },
    onTouchEnded: function (touch, event) {
        this._isPushed = false;
        this.setHighlighted(false);
        if (this.isTouchInside(touch)) {
            this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        } else {
            this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_UP_OUTSIDE);
        }
    },
    onTouchCancelled: function (touch, event) {
        this._isPushed = false;
        this.setHighlighted(false);
        this.sendActionsForControlEvents(cc.CONTROL_EVENT_TOUCH_CANCEL);
    },
    getTitleForState: function (state) {
        var locTable = this._titleDispatchTable;
        if (locTable) {
            if (locTable[state])
                return locTable[state];
            return locTable[cc.CONTROL_STATE_NORMAL];
        }
        return "";
    },
    setTitleForState: function (title, state) {
        this._titleDispatchTable[state] = title || "";
        if (this.getState() == state)
            this.needsLayout();
    },
    getTitleColorForState: function (state) {
        var colorObject = this._titleColorDispatchTable[state];
        if (colorObject)
            return colorObject;
        colorObject = this._titleColorDispatchTable[cc.CONTROL_STATE_NORMAL];
        if (colorObject)
            return colorObject;
        return cc.color.WHITE;
    },
    setTitleColorForState: function (color, state) {
        this._titleColorDispatchTable[state] = color;
        if (this.getState() == state)
            this.needsLayout();
    },
    getTitleLabelForState: function (state) {
        var locTable = this._titleLabelDispatchTable;
        if (locTable[state])
            return locTable[state];
        return locTable[cc.CONTROL_STATE_NORMAL];
    },
    setTitleLabelForState: function (titleLabel, state) {
        var locTable = this._titleLabelDispatchTable;
        if (locTable[state]) {
            var previousLabel = locTable[state];
            if (previousLabel)
                this.removeChild(previousLabel, true);
        }
        locTable[state] = titleLabel;
        titleLabel.setVisible(false);
        titleLabel.setAnchorPoint(0.5, 0.5);
        this.addChild(titleLabel, 1);
        if (this.getState() == state)
            this.needsLayout();
    },
    setTitleTTFForState: function (fntFile, state) {
        var title = this.getTitleForState(state);
        if (!title)
            title = "";
        this.setTitleLabelForState(new cc.LabelTTF(title, fntFile, 12), state);
    },
    getTitleTTFForState: function (state) {
        var labelTTF = this.getTitleLabelForState(state);
        if ((labelTTF != null) && (labelTTF instanceof  cc.LabelTTF)) {
            return labelTTF.getFontName();
        } else {
            return "";
        }
    },
    setTitleTTFSizeForState: function (size, state) {
        var labelTTF = this.getTitleLabelForState(state);
        if ((labelTTF != null) && (labelTTF instanceof  cc.LabelTTF)) {
            labelTTF.setFontSize(size);
        }
    },
    getTitleTTFSizeForState: function (state) {
        var labelTTF = this.getTitleLabelForState(state);
        if ((labelTTF != null) && (labelTTF instanceof  cc.LabelTTF)) {
            return labelTTF.getFontSize();
        }
        return 0;
    },
    setTitleBMFontForState: function (fntFile, state) {
        var title = this.getTitleForState(state);
        if (!title)
            title = "";
        this.setTitleLabelForState(new cc.LabelBMFont(title, fntFile), state);
    },
    getTitleBMFontForState: function (state) {
        var labelBMFont = this.getTitleLabelForState(state);
        if ((labelBMFont != null) && (labelBMFont instanceof  cc.LabelBMFont)) {
            return labelBMFont.getFntFile();
        }
        return "";
    },
    getBackgroundSpriteForState: function (state) {
        var locTable = this._backgroundSpriteDispatchTable;
        if (locTable[state]) {
            return locTable[state];
        }
        return locTable[cc.CONTROL_STATE_NORMAL];
    },
    setBackgroundSpriteForState: function (sprite, state) {
        var locTable = this._backgroundSpriteDispatchTable;
        if (locTable[state]) {
            var previousSprite = locTable[state];
            if (previousSprite)
                this.removeChild(previousSprite, true);
        }
        locTable[state] = sprite;
        sprite.setVisible(false);
        sprite.setAnchorPoint(0.5, 0.5);
        this.addChild(sprite);
        var locPreferredSize = this._preferredSize;
        if (locPreferredSize.width !== 0 || locPreferredSize.height !== 0) {
            sprite.setPreferredSize(locPreferredSize);
        }
        if (this._state === state)
            this.needsLayout();
    },
    setBackgroundSpriteFrameForState: function (spriteFrame, state) {
        var sprite = cc.Scale9Sprite.createWithSpriteFrame(spriteFrame);
        this.setBackgroundSpriteForState(sprite, state);
    }
});
var _p = cc.ControlButton.prototype;
_p.adjustBackground;
cc.defineGetterSetter(_p, "adjustBackground", _p.getAdjustBackgroundImage, _p.setAdjustBackgroundImage);
_p.preferredSize;
cc.defineGetterSetter(_p, "preferredSize", _p.getPreferredSize, _p.setPreferredSize);
_p.labelAnchor;
cc.defineGetterSetter(_p, "labelAnchor", _p.getLabelAnchorPoint, _p.setLabelAnchorPoint);
_p = null;
cc.ControlButton.create = function (label, backgroundSprite, fontSize) {
    return new cc.ControlButton(label, backgroundSprite, fontSize);
};
cc.RGBA = function(r,g,b,a){
    this.r = r ;
    this.g = g ;
    this.b = b ;
    this.a = a ;
};
cc.HSV = function(h,s,v){
    this.h = h ;
    this.s = s ;
    this.v = v ;
};
cc.ControlUtils = {};
cc.ControlUtils.addSpriteToTargetWithPosAndAnchor = function(spriteName,target,pos,anchor){
    var sprite = new cc.Sprite("#" + spriteName);
    if (!sprite)
        return null;
    sprite.setPosition(pos);
    sprite.setAnchorPoint(anchor);
    target.addChild(sprite);
    return sprite;
};
cc.ControlUtils.HSVfromRGB = function(rgbaValue){
    var out = new cc.HSV();
    var min, max, delta;
    min = rgbaValue.r < rgbaValue.g ? rgbaValue.r : rgbaValue.g;
    min = min  < rgbaValue.b ? min  : rgbaValue.b;
    max = rgbaValue.r > rgbaValue.g ? rgbaValue.r : rgbaValue.g;
    max = max  > rgbaValue.b ? max  : rgbaValue.b;
    out.v = max;
    delta = max - min;
    if( max > 0.0 ){
        out.s = (delta / max);
    } else {
        out.s = 0.0;
        out.h = -1;
        return out;
    }
    if( rgbaValue.r >= max ){
        out.h = ( rgbaValue.g - rgbaValue.b ) / delta;
    } else {
        if( rgbaValue.g >= max )
            out.h = 2.0 + ( rgbaValue.b - rgbaValue.r ) / delta;
        else
            out.h = 4.0 + ( rgbaValue.r - rgbaValue.g ) / delta;
    }
    out.h *= 60.0;
    if( out.h < 0.0 )
        out.h += 360.0;
    return out;
};
cc.ControlUtils.RGBfromHSV = function(hsvValue){
    var hh, p, q, t, ff;
    var i;
    var out = new cc.RGBA();
    out.a = 1;
    if (hsvValue.s <= 0.0){
        if (!hsvValue.h){
            out.r = hsvValue.v;
            out.g = hsvValue.v;
            out.b = hsvValue.v;
            return out;
        }
        out.r = 0.0;
        out.g = 0.0;
        out.b = 0.0;
        return out;
    }
    hh = hsvValue.h;
    if(hh >= 360.0)
        hh = 0.0;
    hh /= 60.0;
    i = 0 | hh;
    ff = hh - i;
    p = hsvValue.v * (1.0 - hsvValue.s);
    q = hsvValue.v * (1.0 - (hsvValue.s * ff));
    t = hsvValue.v * (1.0 - (hsvValue.s * (1.0 - ff)));
    switch(i) {
        case 0:
            out.r = hsvValue.v;
            out.g = t;
            out.b = p;
            break;
        case 1:
            out.r = q;
            out.g = hsvValue.v;
            out.b = p;
            break;
        case 2:
            out.r = p;
            out.g = hsvValue.v;
            out.b = t;
            break;
        case 3:
            out.r = p;
            out.g = q;
            out.b = hsvValue.v;
            break;
        case 4:
            out.r = t;
            out.g = p;
            out.b = hsvValue.v;
            break;
        default:
            out.r = hsvValue.v;
            out.g = p;
            out.b = q;
            break;
    }
    return out;
};
cc.ControlUtils.CCRectUnion = function(rect1, rect2){
    return cc.rectUnion(rect1,rect2);
};
cc.Invocation = cc.Class.extend({
    _action:null,
    _target:null,
    _controlEvent:null,
    ctor:function(target,action,controlEvent){
        this._target=target;
        this._action=action;
        this._controlEvent=controlEvent;
    },
    getAction:function(){
       return this._action;
    },
    getTarget:function(){
       return this._target ;
    },
    getControlEvent:function(){
       return this._controlEvent;
    },
    invoke:function(sender){
        if (this._target && this._action) {
            if (cc.isString(this._action)) {
                this._target[this._action](sender, this._controlEvent);
            } else{
                this._action.call(this._target, sender, this._controlEvent);
            }
        }
    }
});
cc.Scale9Sprite = cc.Node.extend({
    _spriteRect: null,
    _capInsetsInternal: null,
    _positionsAreDirty: false,
    _scale9Image: null,
    _topLeft: null,
    _top: null,
    _topRight: null,
    _left: null,
    _centre: null,
    _right: null,
    _bottomLeft: null,
    _bottom: null,
    _bottomRight: null,
    _scale9Dirty: true,
    _opacityModifyRGB: false,
    _originalSize: null,
    _preferredSize: null,
    _opacity: 0,
    _color: null,
    _capInsets: null,
    _insetLeft: 0,
    _insetTop: 0,
    _insetRight: 0,
    _insetBottom: 0,
    _spritesGenerated: false,
    _spriteFrameRotated: false,
    _textureLoaded:false,
    _className:"Scale9Sprite",
    _flippedX: false,
    _flippedY: false,
    textureLoaded:function(){
        return this._textureLoaded;
    },
    addLoadedEventListener:function(callback, target){
        this.addEventListener("load", callback, target);
    },
    _updateCapInset: function () {
        var insets, locInsetLeft = this._insetLeft, locInsetTop = this._insetTop, locInsetRight = this._insetRight;
        var locSpriteRect = this._spriteRect, locInsetBottom = this._insetBottom;
        if (locInsetLeft === 0 && locInsetTop === 0 && locInsetRight === 0 && locInsetBottom === 0) {
            insets = cc.rect(0, 0, 0, 0);
        } else {
            insets = this._spriteFrameRotated ? cc.rect(locInsetBottom, locInsetLeft,
                    locSpriteRect.width - locInsetRight - locInsetLeft,
                    locSpriteRect.height - locInsetTop - locInsetBottom) :
                cc.rect(locInsetLeft, locInsetTop,
                        locSpriteRect.width - locInsetLeft - locInsetRight,
                        locSpriteRect.height - locInsetTop - locInsetBottom);
        }
        this.setCapInsets(insets);
    },
    _updatePositions: function () {
        if (!((this._topLeft) && (this._topRight) && (this._bottomRight) &&
            (this._bottomLeft) && (this._centre))) {
            return;
        }
        var size = this._contentSize;
        var locTopLeft = this._topLeft, locTopRight = this._topRight, locBottomRight = this._bottomRight, locBottomLeft = this._bottomLeft;
        var locCenter = this._centre, locCenterContentSize = this._centre.getContentSize();
        var locTopLeftContentSize = locTopLeft.getContentSize();
        var locBottomLeftContentSize = locBottomLeft.getContentSize();
        var sizableWidth = size.width - locTopLeftContentSize.width - locTopRight.getContentSize().width;
        var sizableHeight = size.height - locTopLeftContentSize.height - locBottomRight.getContentSize().height;
        var horizontalScale = sizableWidth / locCenterContentSize.width;
        var verticalScale = sizableHeight / locCenterContentSize.height;
        var rescaledWidth = locCenterContentSize.width * horizontalScale;
        var rescaledHeight = locCenterContentSize.height * verticalScale;
        var leftWidth = locBottomLeftContentSize.width;
        var bottomHeight = locBottomLeftContentSize.height;
        if (cc._renderType == cc._RENDER_TYPE_WEBGL) {
            var roundedRescaledWidth = Math.round(rescaledWidth);
            if (rescaledWidth != roundedRescaledWidth) {
                rescaledWidth = roundedRescaledWidth;
                horizontalScale = rescaledWidth / locCenterContentSize.width;
            }
            var roundedRescaledHeight = Math.round(rescaledHeight);
            if (rescaledHeight != roundedRescaledHeight) {
                rescaledHeight = roundedRescaledHeight;
                verticalScale = rescaledHeight / locCenterContentSize.height;
            }
        }
        locCenter.setScaleX(horizontalScale);
        locCenter.setScaleY(verticalScale);
        var locLeft = this._left, locRight = this._right, locTop = this._top, locBottom = this._bottom;
        var tempAP = cc.p(0, 0);
        locBottomLeft.setAnchorPoint(tempAP);
        locBottomRight.setAnchorPoint(tempAP);
        locTopLeft.setAnchorPoint(tempAP);
        locTopRight.setAnchorPoint(tempAP);
        locLeft.setAnchorPoint(tempAP);
        locRight.setAnchorPoint(tempAP);
        locTop.setAnchorPoint(tempAP);
        locBottom.setAnchorPoint(tempAP);
        locCenter.setAnchorPoint(tempAP);
        locBottomLeft.setPosition(0, 0);
        locBottomRight.setPosition(leftWidth + rescaledWidth, 0);
        locTopLeft.setPosition(0, bottomHeight + rescaledHeight);
        locTopRight.setPosition(leftWidth + rescaledWidth, bottomHeight + rescaledHeight);
        locLeft.setPosition(0, bottomHeight);
        locLeft.setScaleY(verticalScale);
        locRight.setPosition(leftWidth + rescaledWidth, bottomHeight);
        locRight.setScaleY(verticalScale);
        locBottom.setPosition(leftWidth, 0);
        locBottom.setScaleX(horizontalScale);
        locTop.setPosition(leftWidth, bottomHeight + rescaledHeight);
        locTop.setScaleX(horizontalScale);
        locCenter.setPosition(leftWidth, bottomHeight);
    },
    ctor: function (file, rect, capInsets) {
        cc.Node.prototype.ctor.call(this);
        this._spriteRect = cc.rect(0, 0, 0, 0);
        this._capInsetsInternal = cc.rect(0, 0, 0, 0);
        this._originalSize = cc.size(0, 0);
        this._preferredSize = cc.size(0, 0);
        this._capInsets = cc.rect(0, 0, 0, 0);
        if(file != undefined){
            if(file instanceof cc.SpriteFrame)
                this.initWithSpriteFrame(file, rect);
            else{
                var frame = cc.spriteFrameCache.getSpriteFrame(file);
                if(frame != null)
                    this.initWithSpriteFrame(frame, rect);
                else
                    this.initWithFile(file, rect, capInsets);
            }
        }else{
            this.init();
        }
    },
    getSprite: function () {
        return this._scale9Image;
    },
    getOriginalSize: function () {
        return cc.size(this._originalSize);
    },
    getPreferredSize: function () {
        return cc.size(this._preferredSize);
    },
    _getPreferredWidth: function () {
        return this._preferredSize.width;
    },
    _getPreferredHeight: function () {
        return this._preferredSize.height;
    },
    setPreferredSize: function (preferredSize) {
        this.setContentSize(preferredSize);
        this._preferredSize = preferredSize;
        if (this._positionsAreDirty) {
            this._updatePositions();
            this._positionsAreDirty = false;
            this._scale9Dirty = true;
        }
    },
    _setPreferredWidth: function (value) {
        this._setWidth(value);
        this._preferredSize.width = value;
    },
    _setPreferredHeight: function (value) {
        this._setHeight(value);
        this._preferredSize.height = value;
    },
    setOpacity: function (opacity) {
        if(!this._scale9Image)
            return;
        cc.Node.prototype.setOpacity.call(this, opacity);
        var scaleChildren = this._scale9Image.getChildren();
        for (var i = 0; i < scaleChildren.length; i++) {
            var selChild = scaleChildren[i];
            if (selChild)
                selChild.setOpacity(opacity);
        }
        this._scale9Dirty = true;
    },
    setColor: function (color) {
        if(!this._scale9Image)
            return;
        cc.Node.prototype.setColor.call(this, color);
        var scaleChildren = this._scale9Image.getChildren();
        for (var i = 0; i < scaleChildren.length; i++) {
            var selChild = scaleChildren[i];
            if (selChild)
                selChild.setColor(color);
        }
        this._scale9Dirty = true;
    },
    getCapInsets: function () {
        return cc.rect(this._capInsets);
    },
    setCapInsets: function (capInsets) {
        if(!this._scale9Image)
            return;
        var contentSize = this._contentSize;
        var tempWidth = contentSize.width, tempHeight = contentSize.height;
        this.updateWithBatchNode(this._scale9Image, this._spriteRect, this._spriteFrameRotated, capInsets);
        this.setContentSize(tempWidth, tempHeight);
    },
    getInsetLeft: function () {
        return this._insetLeft;
    },
    setInsetLeft: function (insetLeft) {
        this._insetLeft = insetLeft;
        this._updateCapInset();
    },
    getInsetTop: function () {
        return this._insetTop;
    },
    setInsetTop: function (insetTop) {
        this._insetTop = insetTop;
        this._updateCapInset();
    },
    getInsetRight: function () {
        return this._insetRight;
    },
    setInsetRight: function (insetRight) {
        this._insetRight = insetRight;
        this._updateCapInset();
    },
    getInsetBottom: function () {
        return this._insetBottom;
    },
    setInsetBottom: function (insetBottom) {
        this._insetBottom = insetBottom;
        this._updateCapInset();
    },
    setContentSize: function (size, height) {
        cc.Node.prototype.setContentSize.call(this, size, height);
        this._positionsAreDirty = true;
    },
    _setWidth: function (value) {
        cc.Node.prototype._setWidth.call(this, value);
        this._positionsAreDirty = true;
    },
    _setHeight: function (value) {
        cc.Node.prototype._setHeight.call(this, value);
        this._positionsAreDirty = true;
    },
    init: function () {
        return this.initWithBatchNode(null, cc.rect(0, 0, 0, 0), false, cc.rect(0, 0, 0, 0));
    },
    initWithBatchNode: function (batchNode, rect, rotated, capInsets) {
        if (capInsets === undefined) {
            capInsets = rotated;
            rotated = false;
        }
        if (batchNode)
            this.updateWithBatchNode(batchNode, rect, rotated, capInsets);
        this.setCascadeColorEnabled(true);
        this.setCascadeOpacityEnabled(true);
        this.setAnchorPoint(0.5, 0.5);
        this._positionsAreDirty = true;
        return true;
    },
    initWithFile: function (file, rect, capInsets) {
        if (file instanceof cc.Rect) {
            file = arguments[1];
            capInsets = arguments[0];
            rect = cc.rect(0, 0, 0, 0);
        } else {
            rect = rect || cc.rect(0, 0, 0, 0);
            capInsets = capInsets || cc.rect(0, 0, 0, 0);
        }
        if(!file)
            throw "cc.Scale9Sprite.initWithFile(): file should be non-null";
        var texture = cc.textureCache.getTextureForKey(file);
        if (!texture) {
            texture = cc.textureCache.addImage(file);
        }
        var locLoaded = texture.isLoaded();
        this._textureLoaded = locLoaded;
        if(!locLoaded){
            texture.addEventListener("load", function(sender){
                var preferredSize = this._preferredSize;
                preferredSize = cc.size(preferredSize.width, preferredSize.height);
                var size  = sender.getContentSize();
                this.updateWithBatchNode(this._scale9Image, cc.rect(0,0,size.width,size.height), false, this._capInsets);
                this.setPreferredSize(preferredSize);
                this._positionsAreDirty = true;
                this.dispatchEvent("load");
            }, this);
        }
        return this.initWithBatchNode(new cc.SpriteBatchNode(file, 9), rect, false, capInsets);
    },
    initWithSpriteFrame: function (spriteFrame, capInsets) {
        if(!spriteFrame || !spriteFrame.getTexture())
            throw "cc.Scale9Sprite.initWithSpriteFrame(): spriteFrame should be non-null and its texture should be non-null";
        capInsets = capInsets || cc.rect(0, 0, 0, 0);
        var locLoaded = spriteFrame.textureLoaded();
        this._textureLoaded = locLoaded;
        if(!locLoaded){
            spriteFrame.addEventListener("load", function(sender){
                var preferredSize = this._preferredSize;
                preferredSize = cc.size(preferredSize.width, preferredSize.height);
                this.updateWithBatchNode(this._scale9Image, sender.getRect(), cc._renderType == cc._RENDER_TYPE_WEBGL && sender.isRotated(), this._capInsets);
                this.setPreferredSize(preferredSize);
                this._positionsAreDirty = true;
                this.dispatchEvent("load");
            },this);
        }
        var batchNode = new cc.SpriteBatchNode(spriteFrame.getTexture(), 9);
        return this.initWithBatchNode(batchNode, spriteFrame.getRect(), cc._renderType == cc._RENDER_TYPE_WEBGL && spriteFrame.isRotated(), capInsets);
    },
    initWithSpriteFrameName: function (spriteFrameName, capInsets) {
        if(!spriteFrameName)
            throw "cc.Scale9Sprite.initWithSpriteFrameName(): spriteFrameName should be non-null";
        capInsets = capInsets || cc.rect(0, 0, 0, 0);
        var frame = cc.spriteFrameCache.getSpriteFrame(spriteFrameName);
        if (frame == null) {
            cc.log("cc.Scale9Sprite.initWithSpriteFrameName(): can't find the sprite frame by spriteFrameName");
            return false;
        }
        return this.initWithSpriteFrame(frame, capInsets);
    },
    resizableSpriteWithCapInsets: function (capInsets) {
        var pReturn = new cc.Scale9Sprite();
        if (pReturn && pReturn.initWithBatchNode(this._scale9Image, this._spriteRect, false, capInsets))
            return pReturn;
        return null;
    },
    setOpacityModifyRGB: function (value) {
        if(!this._scale9Image)
            return;
        this._opacityModifyRGB = value;
        var scaleChildren = this._scale9Image.getChildren();
        if (scaleChildren) {
            for (var i = 0, len = scaleChildren.length; i < len; i++)
                scaleChildren[i].setOpacityModifyRGB(value);
        }
    },
    isOpacityModifyRGB: function () {
        return this._opacityModifyRGB;
    },
    updateWithBatchNode: function (batchNode, originalRect, rotated, capInsets) {
        var opacity = this.getOpacity();
        var color = this.getColor();
        var rect = cc.rect(originalRect.x, originalRect.y, originalRect.width, originalRect.height);
        this.removeAllChildren(true);
        if (this._scale9Image != batchNode)
            this._scale9Image = batchNode;
        if(!this._scale9Image)
            return false;
        var tmpTexture = batchNode.getTexture();
        var locLoaded = tmpTexture.isLoaded();
        this._textureLoaded = locLoaded;
        if(!locLoaded){
            tmpTexture.addEventListener("load", function(sender){
                this._positionsAreDirty = true;
                this.dispatchEvent("load");
            },this);
            return true;
        }
        var locScale9Image = this._scale9Image;
        locScale9Image.removeAllChildren(true);
        var locCapInsets = this._capInsets;
        locCapInsets.x = capInsets.x;
        locCapInsets.y = capInsets.y;
        locCapInsets.width = capInsets.width;
        locCapInsets.height = capInsets.height;
        this._spriteFrameRotated = rotated;
        var selTexture = locScale9Image.getTexture();
        if (cc._rectEqualToZero(rect)) {
            var textureSize = selTexture.getContentSize();
            rect = cc.rect(0, 0, textureSize.width, textureSize.height);
        }
        this._spriteRect = rect;
        var locSpriteRect = this._spriteRect;
        locSpriteRect.x = rect.x;
        locSpriteRect.y = rect.y;
        locSpriteRect.width = rect.width;
        locSpriteRect.height = rect.height;
        this._originalSize.width = rect.width;
        this._originalSize.height = rect.height;
        var locPreferredSize = this._preferredSize;
        if(locPreferredSize.width === 0 && locPreferredSize.height === 0){
            locPreferredSize.width = rect.width;
            locPreferredSize.height = rect.height;
        }
        var locCapInsetsInternal = this._capInsetsInternal;
        if(capInsets){
            locCapInsetsInternal.x = capInsets.x;
            locCapInsetsInternal.y = capInsets.y;
            locCapInsetsInternal.width = capInsets.width;
            locCapInsetsInternal.height = capInsets.height;
        }
        var w = rect.width, h = rect.height;
        if (cc._rectEqualToZero(locCapInsetsInternal)) {
            locCapInsetsInternal.x = w / 3;
            locCapInsetsInternal.y = h / 3;
            locCapInsetsInternal.width = w / 3;
            locCapInsetsInternal.height = h / 3;
        }
        var left_w = locCapInsetsInternal.x, center_w = locCapInsetsInternal.width, right_w = w - (left_w + center_w);
        var top_h = locCapInsetsInternal.y, center_h = locCapInsetsInternal.height, bottom_h = h - (top_h + center_h);
        var x = 0.0, y = 0.0;
        var lefttopbounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, left_w + 0.5 | 0, top_h + 0.5 | 0);
        x += left_w;
        var centertopbounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, center_w + 0.5 | 0, top_h + 0.5 | 0);
        x += center_w;
        var righttopbounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, right_w + 0.5 | 0, top_h + 0.5 | 0);
        x = 0.0;
        y = 0.0;
        y += top_h;
        var leftcenterbounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, left_w + 0.5 | 0, center_h + 0.5 | 0);
        x += left_w;
        var centerbounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, center_w + 0.5 | 0, center_h + 0.5 | 0);
        x += center_w;
        var rightcenterbounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, right_w + 0.5 | 0, center_h + 0.5 | 0);
        x = 0.0;
        y = 0.0;
        y += top_h;
        y += center_h;
        var leftbottombounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, left_w + 0.5 | 0, bottom_h + 0.5 | 0);
        x += left_w;
        var centerbottombounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, center_w + 0.5 | 0, bottom_h + 0.5 | 0);
        x += center_w;
        var rightbottombounds = cc.rect(x + 0.5 | 0, y + 0.5 | 0, right_w + 0.5 | 0, bottom_h + 0.5 | 0);
        var t = cc.affineTransformMakeIdentity();
        if (!rotated) {
            t = cc.affineTransformTranslate(t, rect.x, rect.y);
            cc._rectApplyAffineTransformIn(centerbounds, t);
            cc._rectApplyAffineTransformIn(rightbottombounds, t);
            cc._rectApplyAffineTransformIn(leftbottombounds, t);
            cc._rectApplyAffineTransformIn(righttopbounds, t);
            cc._rectApplyAffineTransformIn(lefttopbounds, t);
            cc._rectApplyAffineTransformIn(rightcenterbounds, t);
            cc._rectApplyAffineTransformIn(leftcenterbounds, t);
            cc._rectApplyAffineTransformIn(centerbottombounds, t);
            cc._rectApplyAffineTransformIn(centertopbounds, t);
            this._centre = new cc.Sprite();
            this._centre.initWithTexture(selTexture, centerbounds);
            locScale9Image.addChild(this._centre, 0, cc.Scale9Sprite.POSITIONS_CENTRE);
            this._top = new cc.Sprite();
            this._top.initWithTexture(selTexture, centertopbounds);
            locScale9Image.addChild(this._top, 1, cc.Scale9Sprite.POSITIONS_TOP);
            this._bottom = new cc.Sprite();
            this._bottom.initWithTexture(selTexture, centerbottombounds);
            locScale9Image.addChild(this._bottom, 1, cc.Scale9Sprite.POSITIONS_BOTTOM);
            this._left = new cc.Sprite();
            this._left.initWithTexture(selTexture, leftcenterbounds);
            locScale9Image.addChild(this._left, 1, cc.Scale9Sprite.POSITIONS_LEFT);
            this._right = new cc.Sprite();
            this._right.initWithTexture(selTexture, rightcenterbounds);
            locScale9Image.addChild(this._right, 1, cc.Scale9Sprite.POSITIONS_RIGHT);
            this._topLeft = new cc.Sprite();
            this._topLeft.initWithTexture(selTexture, lefttopbounds);
            locScale9Image.addChild(this._topLeft, 2, cc.Scale9Sprite.POSITIONS_TOPLEFT);
            this._topRight = new cc.Sprite();
            this._topRight.initWithTexture(selTexture, righttopbounds);
            locScale9Image.addChild(this._topRight, 2, cc.Scale9Sprite.POSITIONS_TOPRIGHT);
            this._bottomLeft = new cc.Sprite();
            this._bottomLeft.initWithTexture(selTexture, leftbottombounds);
            locScale9Image.addChild(this._bottomLeft, 2, cc.Scale9Sprite.POSITIONS_BOTTOMLEFT);
            this._bottomRight = new cc.Sprite();
            this._bottomRight.initWithTexture(selTexture, rightbottombounds);
            locScale9Image.addChild(this._bottomRight, 2, cc.Scale9Sprite.POSITIONS_BOTTOMRIGHT);
        } else {
            var rotatedcenterbounds = centerbounds;
            var rotatedrightbottombounds = rightbottombounds;
            var rotatedleftbottombounds = leftbottombounds;
            var rotatedrighttopbounds = righttopbounds;
            var rotatedlefttopbounds = lefttopbounds;
            var rotatedrightcenterbounds = rightcenterbounds;
            var rotatedleftcenterbounds = leftcenterbounds;
            var rotatedcenterbottombounds = centerbottombounds;
            var rotatedcentertopbounds = centertopbounds;
            t = cc.affineTransformTranslate(t, rect.height + rect.x, rect.y);
            t = cc.affineTransformRotate(t, 1.57079633);
            centerbounds = cc.rectApplyAffineTransform(centerbounds, t);
            rightbottombounds = cc.rectApplyAffineTransform(rightbottombounds, t);
            leftbottombounds = cc.rectApplyAffineTransform(leftbottombounds, t);
            righttopbounds = cc.rectApplyAffineTransform(righttopbounds, t);
            lefttopbounds = cc.rectApplyAffineTransform(lefttopbounds, t);
            rightcenterbounds = cc.rectApplyAffineTransform(rightcenterbounds, t);
            leftcenterbounds = cc.rectApplyAffineTransform(leftcenterbounds, t);
            centerbottombounds = cc.rectApplyAffineTransform(centerbottombounds, t);
            centertopbounds = cc.rectApplyAffineTransform(centertopbounds, t);
            rotatedcenterbounds.x = centerbounds.x;
            rotatedcenterbounds.y = centerbounds.y;
            rotatedrightbottombounds.x = rightbottombounds.x;
            rotatedrightbottombounds.y = rightbottombounds.y;
            rotatedleftbottombounds.x = leftbottombounds.x;
            rotatedleftbottombounds.y = leftbottombounds.y;
            rotatedrighttopbounds.x = righttopbounds.x;
            rotatedrighttopbounds.y = righttopbounds.y;
            rotatedlefttopbounds.x = lefttopbounds.x;
            rotatedlefttopbounds.y = lefttopbounds.y;
            rotatedrightcenterbounds.x = rightcenterbounds.x;
            rotatedrightcenterbounds.y = rightcenterbounds.y;
            rotatedleftcenterbounds.x = leftcenterbounds.x;
            rotatedleftcenterbounds.y = leftcenterbounds.y;
            rotatedcenterbottombounds.x = centerbottombounds.x;
            rotatedcenterbottombounds.y = centerbottombounds.y;
            rotatedcentertopbounds.x = centertopbounds.x;
            rotatedcentertopbounds.y = centertopbounds.y;
            this._centre = new cc.Sprite();
            this._centre.initWithTexture(selTexture, rotatedcenterbounds, true);
            locScale9Image.addChild(this._centre, 0, cc.Scale9Sprite.POSITIONS_CENTRE);
            this._top = new cc.Sprite();
            this._top.initWithTexture(selTexture, rotatedcentertopbounds, true);
            locScale9Image.addChild(this._top, 1, cc.Scale9Sprite.POSITIONS_TOP);
            this._bottom = new cc.Sprite();
            this._bottom.initWithTexture(selTexture, rotatedcenterbottombounds, true);
            locScale9Image.addChild(this._bottom, 1, cc.Scale9Sprite.POSITIONS_BOTTOM);
            this._left = new cc.Sprite();
            this._left.initWithTexture(selTexture, rotatedleftcenterbounds, true);
            locScale9Image.addChild(this._left, 1, cc.Scale9Sprite.POSITIONS_LEFT);
            this._right = new cc.Sprite();
            this._right.initWithTexture(selTexture, rotatedrightcenterbounds, true);
            locScale9Image.addChild(this._right, 1, cc.Scale9Sprite.POSITIONS_RIGHT);
            this._topLeft = new cc.Sprite();
            this._topLeft.initWithTexture(selTexture, rotatedlefttopbounds, true);
            locScale9Image.addChild(this._topLeft, 2, cc.Scale9Sprite.POSITIONS_TOPLEFT);
            this._topRight = new cc.Sprite();
            this._topRight.initWithTexture(selTexture, rotatedrighttopbounds, true);
            locScale9Image.addChild(this._topRight, 2, cc.Scale9Sprite.POSITIONS_TOPRIGHT);
            this._bottomLeft = new cc.Sprite();
            this._bottomLeft.initWithTexture(selTexture, rotatedleftbottombounds, true);
            locScale9Image.addChild(this._bottomLeft, 2, cc.Scale9Sprite.POSITIONS_BOTTOMLEFT);
            this._bottomRight = new cc.Sprite();
            this._bottomRight.initWithTexture(selTexture, rotatedrightbottombounds, true);
            locScale9Image.addChild(this._bottomRight, 2, cc.Scale9Sprite.POSITIONS_BOTTOMRIGHT);
        }
        this.setContentSize(rect.width, rect.height);
        if(cc._renderType === cc._RENDER_TYPE_WEBGL)
            this.addChild(locScale9Image);
        if (this._spritesGenerated) {
            this.setOpacity(opacity);
            this.setColor(color);
        }
        this._spritesGenerated = true;
        return true;
    },
    setSpriteFrame: function (spriteFrame) {
        var batchNode = new cc.SpriteBatchNode(spriteFrame.getTexture(), 9);
        var locLoaded = spriteFrame.textureLoaded();
        this._textureLoaded = locLoaded;
        if(!locLoaded){
            spriteFrame.addEventListener("load", function(sender){
                var preferredSize = this._preferredSize;
                preferredSize = cc.size(preferredSize.width, preferredSize.height);
                this.updateWithBatchNode(this._scale9Image, sender.getRect(), cc._renderType == cc._RENDER_TYPE_WEBGL && sender.isRotated(), this._capInsets);
                this.setPreferredSize(preferredSize);
                this._positionsAreDirty = true;
                this.dispatchEvent("load");
            },this);
        }
        this.updateWithBatchNode(batchNode, spriteFrame.getRect(), cc._renderType == cc._RENDER_TYPE_WEBGL && spriteFrame.isRotated(), cc.rect(0, 0, 0, 0));
        this._insetLeft = 0;
        this._insetTop = 0;
        this._insetRight = 0;
        this._insetBottom = 0;
    },
    setState: function(state){
        this._renderCmd.setState(state);
    },
    setFlippedX: function(flippedX){
        var realScale = this.getScaleX();
        this._flippedX = flippedX;
        this.setScaleX(realScale);
    },
    isFlippedX: function(){
        return this._flippedX;
    },
    setFlippedY:function(flippedY){
        var realScale = this.getScaleY();
        this._flippedY = flippedY;
        this.setScaleY(realScale);
    },
    isFlippedY:function(){
        return this._flippedY;
    },
    setScaleX: function (scaleX) {
        if (this._flippedX)
            scaleX = scaleX * -1;
        cc.Node.prototype.setScaleX.call(this, scaleX);
    },
    setScaleY: function (scaleY) {
        if (this._flippedY)
            scaleY = scaleY * -1;
        cc.Node.prototype.setScaleY.call(this, scaleY);
    },
    setScale: function (scaleX, scaleY) {
        if(scaleY === undefined)
            scaleY = scaleX;
        this.setScaleX(scaleX);
        this.setScaleY(scaleY);
    },
    getScaleX: function () {
        var originalScale = cc.Node.prototype.getScaleX.call(this);
        if (this._flippedX)
            originalScale = originalScale * -1.0;
        return originalScale;
    },
    getScaleY: function () {
        var originalScale = cc.Node.prototype.getScaleY.call(this);
        if (this._flippedY)
            originalScale = originalScale * -1.0;
        return originalScale;
    },
    getScale: function () {
        if(this.getScaleX() !== this.getScaleY())
            cc.log("Scale9Sprite#scale. ScaleX != ScaleY. Don't know which one to return");
        return this.getScaleX();
    },
    _createRenderCmd: function(){
        if(cc._renderType === cc._RENDER_TYPE_CANVAS)
            return new cc.Scale9Sprite.CanvasRenderCmd(this);
        else
            return new cc.Scale9Sprite.WebGLRenderCmd(this);
    }
});
var _p = cc.Scale9Sprite.prototype;
cc.EventHelper.prototype.apply(_p);
_p.preferredSize;
cc.defineGetterSetter(_p, "preferredSize", _p.getPreferredSize, _p.setPreferredSize);
_p.capInsets;
cc.defineGetterSetter(_p, "capInsets", _p.getCapInsets, _p.setCapInsets);
_p.insetLeft;
cc.defineGetterSetter(_p, "insetLeft", _p.getInsetLeft, _p.setInsetLeft);
_p.insetTop;
cc.defineGetterSetter(_p, "insetTop", _p.getInsetTop, _p.setInsetTop);
_p.insetRight;
cc.defineGetterSetter(_p, "insetRight", _p.getInsetRight, _p.setInsetRight);
_p.insetBottom;
cc.defineGetterSetter(_p, "insetBottom", _p.getInsetBottom, _p.setInsetBottom);
_p = null;
cc.Scale9Sprite.create = function (file, rect, capInsets) {
    return new cc.Scale9Sprite(file, rect, capInsets);
};
cc.Scale9Sprite.createWithSpriteFrame = function (spriteFrame, capInsets) {
    return new cc.Scale9Sprite(spriteFrame, capInsets);
};
cc.Scale9Sprite.createWithSpriteFrameName = function (spriteFrameName, capInsets) {
    return new cc.Scale9Sprite(spriteFrameName, capInsets);
};
cc.Scale9Sprite.POSITIONS_CENTRE = 0;
cc.Scale9Sprite.POSITIONS_TOP = 1;
cc.Scale9Sprite.POSITIONS_LEFT = 2;
cc.Scale9Sprite.POSITIONS_RIGHT = 3;
cc.Scale9Sprite.POSITIONS_BOTTOM = 4;
cc.Scale9Sprite.POSITIONS_TOPRIGHT = 5;
cc.Scale9Sprite.POSITIONS_TOPLEFT = 6;
cc.Scale9Sprite.POSITIONS_BOTTOMRIGHT = 7;
cc.Scale9Sprite.state = {NORMAL: 0, GRAY: 1};
(function() {
    cc.Scale9Sprite.CanvasRenderCmd = function (renderable) {
        cc.Node.CanvasRenderCmd.call(this, renderable);
        this._cachedParent = null;
        this._cacheDirty = false;
        this._state = cc.Scale9Sprite.state.NORMAL;
        var node = this._node;
        var locCacheCanvas = this._cacheCanvas = cc.newElement('canvas');
        locCacheCanvas.width = 1;
        locCacheCanvas.height = 1;
        this._cacheContext = new cc.CanvasContextWrapper(locCacheCanvas.getContext("2d"));
        var locTexture = this._cacheTexture = new cc.Texture2D();
        locTexture.initWithElement(locCacheCanvas);
        locTexture.handleLoadedTexture();
        this._cacheSprite = new cc.Sprite(locTexture);
        this._cacheSprite.setAnchorPoint(0,0);
        node.addChild(this._cacheSprite);
    };
    var proto = cc.Scale9Sprite.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    proto.constructor = cc.Scale9Sprite.CanvasRenderCmd;
    proto.visit = function(parentCmd){
        var node = this._node;
        if(!node._visible)
            return;
        if (node._positionsAreDirty) {
            node._updatePositions();
            node._positionsAreDirty = false;
            node._scale9Dirty = true;
        }
        node._scale9Dirty = false;
        this._cacheScale9Sprite();
        cc.Node.CanvasRenderCmd.prototype.visit.call(this, parentCmd);
    };
    proto.transform = function(parentCmd){
        var node = this._node;
        cc.Node.CanvasRenderCmd.prototype.transform.call(this, parentCmd);
        if (node._positionsAreDirty) {
            node._updatePositions();
            node._positionsAreDirty = false;
            node._scale9Dirty = true;
        }
        this._cacheScale9Sprite();
        var children = node._children;
        for(var i=0; i<children.length; i++){
            children[i].transform(this);
        }
    };
    proto._updateDisplayColor = function(parentColor){
        cc.Node.CanvasRenderCmd.prototype._updateDisplayColor.call(this, parentColor);
        var scale9Image = this._node._scale9Image;
        if(scale9Image){
            var scaleChildren = scale9Image.getChildren();
            for (var i = 0; i < scaleChildren.length; i++) {
                var selChild = scaleChildren[i];
                if (selChild)
                    selChild._renderCmd._updateDisplayColor(parentColor);
            }
            this._cacheScale9Sprite();
        }
    };
    proto._cacheScale9Sprite = function(){
        var node = this._node;
        if(!node._scale9Image)
            return;
        var locScaleFactor = cc.contentScaleFactor();
        var size = node._contentSize;
        var sizeInPixels = cc.size(size.width * locScaleFactor, size.height * locScaleFactor);
        var locCanvas = this._cacheCanvas, wrapper = this._cacheContext, locContext = wrapper.getContext();
        var contentSizeChanged = false;
        if(locCanvas.width != sizeInPixels.width || locCanvas.height != sizeInPixels.height){
            locCanvas.width = sizeInPixels.width;
            locCanvas.height = sizeInPixels.height;
            contentSizeChanged = true;
        }
        cc.renderer._turnToCacheMode(node.__instanceId);
        node._scale9Image.visit();
        var selTexture = node._scale9Image.getTexture();
        if(selTexture && this._state === cc.Scale9Sprite.state.GRAY)
            selTexture._switchToGray(true);
        locContext.setTransform(1, 0, 0, 1, 0, 0);
        locContext.clearRect(0, 0, sizeInPixels.width, sizeInPixels.height);
        cc.renderer._renderingToCacheCanvas(wrapper, node.__instanceId, locScaleFactor, locScaleFactor);
        if(selTexture && this._state === cc.Scale9Sprite.state.GRAY)
            selTexture._switchToGray(false);
        if(contentSizeChanged)
            this._cacheSprite.setTextureRect(cc.rect(0,0, size.width, size.height));
        if(!this._cacheSprite.getParent())
            node.addChild(this._cacheSprite, -1);
    };
    proto.setState = function(state){
        var locScale9Image = this._node._scale9Image;
        if(!locScale9Image)
            return;
        this._state = state;
        this._cacheScale9Sprite();
    };
})();
cc.Spacer = cc.Layer.extend({});
cc.Spacer.verticalSpacer = function (space) {
    var pRet = new cc.Spacer();
    pRet.init();
    pRet.setContentSize(0, space);
    return pRet;
};
cc.Spacer.horizontalSpacer = function (space) {
    var pRet = new cc.Spacer();
    pRet.init();
    pRet.setContentSize(space, 0);
    return pRet;
};
cc.MenuPassive = cc.Layer.extend({
    _color:null,
    _opacity:0,
    _className:"MenuPassive",
    ctor:function () {
    },
    getColor:function () {
        var locColor = this._color;
        return cc.color(locColor.r, locColor.g, locColor.b, locColor.a);
    },
    setColor:function (color) {
        var locColor = this._color;
        locColor.r = color.r;
        locColor.g = color.g;
        locColor.b = color.b;
        if (this._children && this._children.length > 0) {
            for (var i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    this._children[i].setColor(color);
                }
            }
        }
        if (color.a !== undefined && !color.a_undefined) {
            this.setOpacity(color.a);
        }
    },
    getOpacity:function () {
        return this._opacity;
    },
    setOpacity:function (opacity) {
        this._opacity = opacity;
        if (this._children && this._children.length > 0) {
            for (var i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    this._children[i].setOpacity(opacity);
                }
            }
        }
        this._color.a = opacity;
    },
    initWithItems:function (item, args) {
        if (this.init()) {
            var winSize = cc.director.getWinSize();
            this.ignoreAnchorPointForPosition(true);
            this.setAnchorPoint(0.5, 0.5);
            this.setContentSize(winSize);
            this.setPosition(winSize.width / 2, winSize.height / 2);
            var z = 0;
            if (item) {
                this.addChild(item, z);
                for (var i = 0; i < args.length; i++) {
                    if (args[i]) {
                        z++;
                        this.addChild(args[i], z);
                    }
                }
            }
            return true;
        }
        return false;
    },
    alignItemsVertically:function () {
        this.alignItemsVerticallyWithPadding(cc.DEFAULT_PADDING);
    },
    alignItemsVerticallyWithPadding:function (padding) {
        var height = -padding;
        var i;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    height += this._children[i].getContentSize().height * this._children[i].getScaleY() + padding;
                }
            }
        }
        var width = 0;
        var y = height / 2.0;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    width = Math.max(width, this._children[i].getContentSize().width);
                    this._children[i].setPosition(0, y - this._children[i].getContentSize().height * this._children[i].getScaleY() / 2.0);
                    y -= this._children[i].getContentSize().height * this._children[i].getScaleY() + padding;
                }
            }
        }
        this.setContentSize(width, height);
    },
    alignItemsHorizontally:function () {
        this.alignItemsHorizontallyWithPadding(cc.DEFAULT_PADDING);
    },
    alignItemsHorizontallyWithPadding:function (padding) {
        var width = -padding;
        var i;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    width += this._children[i].getContentSize().width * this._children[i].getScaleX() + padding;
                }
            }
        }
        var height = 0;
        var x = -width / 2.0;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    height = Math.max(height, this._children[i].getContentSize().height);
                    this._children[i].setPosition(x + this._children[i].getContentSize().width * this._children[i].getScaleX() / 2.0, 0);
                    x += this._children[i].getContentSize().width * this._children[i].getScaleX() + padding;
                }
            }
        }
        this.setContentSize(width, height);
    },
    alignItemsInColumns:function (columns) {
        var rows = [];
        var i;
        for (i = 1; i < arguments.length; i++) {
            rows.push(arguments[i]);
        }
        var height = -5;
        var row = 0;
        var rowHeight = 0;
        var columnsOccupied = 0;
        var rowColumns;
        var tmp;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    if(row >= rows.length){
                        cc.log("cc.MenuPassive.alignItemsInColumns(): invalid row index");
                        continue;
                    }
                    rowColumns = rows[row];
                    if(!rowColumns) {
                        cc.log("cc.MenuPassive.alignItemsInColumns(): can not have zero columns on a row");
                        continue;
                    }
                    tmp = this._children[i].getContentSize().height;
                    rowHeight = 0 | ((rowHeight >= tmp || (tmp == null)) ? rowHeight : tmp);
                    ++columnsOccupied;
                    if (columnsOccupied >= rowColumns) {
                        height += rowHeight + 5;
                        columnsOccupied = 0;
                        rowHeight = 0;
                        ++row;
                    }
                }
            }
        }
        var winSize = cc.director.getWinSize();
        row = 0;
        rowHeight = 0;
        rowColumns = 0;
        var w = 0.0;
        var x = 0.0;
        var y = (height / 2);
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    if (rowColumns == 0) {
                        rowColumns = rows[row];
                        w = winSize.width / (1 + rowColumns);
                        x = w;
                    }
                    tmp = this._children[i].getContentSize().height;
                    rowHeight = 0 | ((rowHeight >= tmp || (tmp == null)) ? rowHeight : tmp);
                    this._children[i].setPosition(x - winSize.width / 2,
                        y - this._children[i].getContentSize().height / 2);
                    x += w;
                    ++columnsOccupied;
                    if (columnsOccupied >= rowColumns) {
                        y -= rowHeight + 5;
                        columnsOccupied = 0;
                        rowColumns = 0;
                        rowHeight = 0;
                        ++row;
                    }
                }
            }
        }
    },
    alignItemsInRows:function (rows) {
        var columns = [];
        var i;
        for (i = 1; i < arguments.length; i++) {
            columns.push(arguments[i]);
        }
        var columnWidths = [];
        var columnHeights = [];
        var width = -10;
        var columnHeight = -5;
        var column = 0;
        var columnWidth = 0;
        var rowsOccupied = 0;
        var columnRows;
        var tmp;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    if(column >= columns.length){
                        cc.log("cc.MenuPassive.alignItemsInRows(): invalid row index");
                        continue;
                    }
                    columnRows = columns[column];
                    if(!columnRows) {
                        cc.log("cc.MenuPassive.alignItemsInColumns(): can't have zero rows on a column");
                        continue;
                    }
                    tmp = this._children[i].getContentSize().width;
                    columnWidth = 0 | ((columnWidth >= tmp || (tmp == null)) ? columnWidth : tmp);
                    columnHeight += 0 | (this._children[i].getContentSize().height + 5);
                    ++rowsOccupied;
                    if (rowsOccupied >= columnRows) {
                        columnWidths.push(columnWidth);
                        columnHeights.push(columnHeight);
                        width += columnWidth + 10;
                        rowsOccupied = 0;
                        columnWidth = 0;
                        columnHeight = -5;
                        ++column;
                    }
                }
            }
        }
        var winSize = cc.director.getWinSize();
        column = 0;
        columnWidth = 0;
        columnRows = null;
        var x = (-width / 2);
        var y = 0.0;
        if (this._children && this._children.length > 0) {
            for (i = 0; i < this._children.length; i++) {
                if (this._children[i]) {
                    if (columnRows == null) {
                        columnRows = columns[column];
                        y = columnHeights[column];
                    }
                    tmp = this._children[i].getContentSize().width;
                    columnWidth = 0 | ((columnWidth >= tmp || (tmp == null)) ? columnWidth : tmp);
                    this._children[i].setPosition(x + columnWidths[column] / 2, y - winSize.height / 2);
                    y -= this._children[i].getContentSize().height + 10;
                    ++rowsOccupied;
                    if (rowsOccupied >= columnRows) {
                        x += columnWidth + 5;
                        rowsOccupied = 0;
                        columnRows = 0;
                        columnWidth = 0;
                        ++column;
                    }
                }
            }
        }
    },
    setOpacityModifyRGB:function (bValue) {
    },
    isOpacityModifyRGB:function () {
        return false;
    }
});
cc.MenuPassive.create = function (item) {
    if (!item) {
        item = null;
    }
    var argArr = [];
    for (var i = 1; i < arguments.length; i++) {
        argArr.push(arguments[i]);
    }
    var pRet = new cc.MenuPassive();
    if (pRet && pRet.initWithItems(item, argArr)) {
        return pRet;
    }
    return null;
};
cc.MenuPassive.createWithItem = function (item) {
    return cc.MenuPassive.create(item, null);
};
cc.ControlSaturationBrightnessPicker = cc.Control.extend({
    _saturation:0,
    _brightness:0,
    _background:null,
    _overlay:null,
    _shadow:null,
    _slider:null,
    _startPos:null,
    _boxPos:0,
    _boxSize:0,
    _className:"ControlSaturationBrightnessPicker",
    ctor:function (target, pos) {
        cc.Control.prototype.ctor.call(this);
        pos && this.initWithTargetAndPos(target, pos);
    },
    getSaturation:function () {
        return this._saturation;
    },
    getBrightness:function () {
        return this._brightness;
    },
    getBackground:function () {
        return this._background;
    },
    getOverlay:function () {
        return this._brightness;
    },
    getShadow:function () {
        return this._shadow;
    },
    getSlider:function () {
        return this._slider;
    },
    getStartPos:function () {
        return this._startPos;
    },
    initWithTargetAndPos:function (target, pos) {
        if (cc.Control.prototype.init.call(this)) {
            this._background = cc.ControlUtils.addSpriteToTargetWithPosAndAnchor("colourPickerBackground.png", target, pos, cc.p(0.0, 0.0));
            this._overlay = cc.ControlUtils.addSpriteToTargetWithPosAndAnchor("colourPickerOverlay.png", target, pos, cc.p(0.0, 0.0));
            this._shadow = cc.ControlUtils.addSpriteToTargetWithPosAndAnchor("colourPickerShadow.png", target, pos, cc.p(0.0, 0.0));
            this._slider = cc.ControlUtils.addSpriteToTargetWithPosAndAnchor("colourPicker.png", target, pos, cc.p(0.5, 0.5));
            this._startPos = pos;
            this._boxPos = 35;
            this._boxSize = this._background.getContentSize().width / 2;
            return true;
        } else
            return false;
    },
    setEnabled:function (enabled) {
        cc.Control.prototype.setEnabled.call(this, enabled);
        if (this._slider) {
            this._slider.setOpacity(enabled ? 255 : 128);
        }
    },
    updateWithHSV:function (hsv) {
        var hsvTemp = new cc.HSV();
        hsvTemp.s = 1;
        hsvTemp.h = hsv.h;
        hsvTemp.v = 1;
        var rgb = cc.ControlUtils.RGBfromHSV(hsvTemp);
        this._background.setColor(cc.color(0 | (rgb.r * 255), 0 | (rgb.g * 255), 0 | (rgb.b * 255)));
    },
    updateDraggerWithHSV:function (hsv) {
        var pos = cc.p(this._startPos.x + this._boxPos + (this._boxSize * (1 - hsv.s)),
            this._startPos.y + this._boxPos + (this._boxSize * hsv.v));
        this._updateSliderPosition(pos);
    },
    _updateSliderPosition:function (sliderPosition) {
        var centerX = this._startPos.x + this._background.getBoundingBox().width * 0.5;
        var centerY = this._startPos.y + this._background.getBoundingBox().height * 0.5;
        var dx = sliderPosition.x - centerX;
        var dy = sliderPosition.y - centerY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var angle = Math.atan2(dy, dx);
        var limit = this._background.getBoundingBox().width * 0.5;
        if (dist > limit) {
            sliderPosition.x = centerX + limit * Math.cos(angle);
            sliderPosition.y = centerY + limit * Math.sin(angle);
        }
        this._slider.setPosition(sliderPosition);
        if (sliderPosition.x < this._startPos.x + this._boxPos)
            sliderPosition.x = this._startPos.x + this._boxPos;
        else if (sliderPosition.x > this._startPos.x + this._boxPos + this._boxSize - 1)
            sliderPosition.x = this._startPos.x + this._boxPos + this._boxSize - 1;
        if (sliderPosition.y < this._startPos.y + this._boxPos)
            sliderPosition.y = this._startPos.y + this._boxPos;
        else if (sliderPosition.y > this._startPos.y + this._boxPos + this._boxSize)
            sliderPosition.y = this._startPos.y + this._boxPos + this._boxSize;
        this._saturation = 1.0 - Math.abs((this._startPos.x + this._boxPos - sliderPosition.x) / this._boxSize);
        this._brightness = Math.abs((this._startPos.y + this._boxPos - sliderPosition.y) / this._boxSize);
    },
    _checkSliderPosition:function (location) {
        var centerX = this._startPos.x + this._background.getBoundingBox().width * 0.5;
        var centerY = this._startPos.y + this._background.getBoundingBox().height * 0.5;
        var dx = location.x - centerX;
        var dy = location.y - centerY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= this._background.getBoundingBox().width * 0.5) {
            this._updateSliderPosition(location);
            this.sendActionsForControlEvents(cc.CONTROL_EVENT_VALUECHANGED);
            return true;
        }
        return false;
    },
    onTouchBegan:function (touch, event) {
        if (!this.isEnabled() || !this.isVisible())        {
            return false;
        }
        var touchLocation = this.getTouchLocation(touch);
        return this._checkSliderPosition(touchLocation);
    },
    onTouchMoved:function (touch, event) {
        var touchLocation = this.getTouchLocation(touch);
        this._checkSliderPosition(touchLocation);
    }
});
var _p = cc.ControlSaturationBrightnessPicker.prototype;
_p.saturation;
cc.defineGetterSetter(_p, "saturation", _p.getSaturation);
_p.brightness;
cc.defineGetterSetter(_p, "brightness", _p.getBrightness);
_p.background;
cc.defineGetterSetter(_p, "background", _p.getBackground);
_p.overlay;
cc.defineGetterSetter(_p, "overlay", _p.getOverlay);
_p.shadow;
cc.defineGetterSetter(_p, "shadow", _p.getShadow);
_p.slider;
cc.defineGetterSetter(_p, "slider", _p.getSlider);
_p.startPos;
cc.defineGetterSetter(_p, "startPos", _p.getStartPos);
_p = null;
cc.ControlSaturationBrightnessPicker.create = function (target, pos) {
    return new cc.ControlSaturationBrightnessPicker(target, pos);
};
cc.ControlHuePicker = cc.Control.extend({
    _hue:0,
    _huePercentage:0,
    _background:null,
    _slider:null,
    _startPos:null,
    _className:"ControlHuePicker",
    ctor:function(target, pos) {
        cc.Control.prototype.ctor.call(this);
        pos && this.initWithTargetAndPos(target, pos);
    },
    getHue:function () {
        return this._hue;
    },
    setHue:function (hueValue) {
        this._hue = hueValue;
        this.setHuePercentage(this._hue / 360.0);
    },
    getHuePercentage:function () {
        return this._huePercentage;
    },
    setHuePercentage:function (hueValueInPercent) {
        this._huePercentage = hueValueInPercent;
        this._hue = this._huePercentage * 360.0;
        var backgroundBox = this._background.getBoundingBox();
        var centerX = this._startPos.x + backgroundBox.width * 0.5;
        var centerY = this._startPos.y + backgroundBox.height * 0.5;
        var limit = backgroundBox.width * 0.5 - 15.0;
        var angleDeg = this._huePercentage * 360.0 - 180.0;
        var angle = cc.degreesToRadians(angleDeg);
        var x = centerX + limit * Math.cos(angle);
        var y = centerY + limit * Math.sin(angle);
        this._slider.setPosition(x, y);
    },
    setEnabled:function (enabled) {
        cc.Control.prototype.setEnabled.call(this, enabled);
        if (this._slider) {
            this._slider.setOpacity(enabled ? 255 : 128);
        }
    },
    getBackground:function () {
        return this._background;
    },
    getSlider:function () {
        return this._slider;
    },
    getStartPos:function () {
        return this._startPos;
    },
    initWithTargetAndPos:function (target, pos) {
        if (cc.Control.prototype.init.call(this)) {
            this._background = cc.ControlUtils.addSpriteToTargetWithPosAndAnchor("huePickerBackground.png", target, pos, cc.p(0.0, 0.0));
            this._slider = cc.ControlUtils.addSpriteToTargetWithPosAndAnchor("colourPicker.png", target, pos, cc.p(0.5, 0.5));
            this._slider.setPosition(pos.x, pos.y + this._background.getBoundingBox().height * 0.5);
            this._startPos = pos;
            this._hue = 0.0;
            this._huePercentage = 0.0;
            return true;
        } else
            return false;
    },
    _updateSliderPosition:function (location) {
        var backgroundBox = this._background.getBoundingBox();
        var centerX = this._startPos.x + backgroundBox.width * 0.5;
        var centerY = this._startPos.y + backgroundBox.height * 0.5;
        var dx = location.x - centerX;
        var dy = location.y - centerY;
        var angle = Math.atan2(dy, dx);
        var angleDeg = cc.radiansToDegrees(angle) + 180.0;
        this.setHue(angleDeg);
        this.sendActionsForControlEvents(cc.CONTROL_EVENT_VALUECHANGED);
    },
    _checkSliderPosition:function (location) {
        var distance = Math.sqrt(Math.pow(location.x + 10, 2) + Math.pow(location.y, 2));
        if (80 > distance && distance > 59)        {
            this._updateSliderPosition(location);
            return true;
        }
        return false;
    },
    onTouchBegan:function (touch, event) {
        if (!this.isEnabled() || !this.isVisible())        {
            return false;
        }
        var touchLocation = this.getTouchLocation(touch);
        return this._checkSliderPosition(touchLocation);
    },
    onTouchMoved:function (touch, event) {
        var touchLocation = this.getTouchLocation(touch);
        this._checkSliderPosition(touchLocation);
    }
});
var _p = cc.ControlHuePicker.prototype;
_p.hue;
cc.defineGetterSetter(_p, "hue", _p.getHue, _p.setHue);
_p.huePercent;
cc.defineGetterSetter(_p, "huePercent", _p.getHuePercentage, _p.setHuePercentage);
_p.background;
cc.defineGetterSetter(_p, "background", _p.getBackground);
_p.slider;
cc.defineGetterSetter(_p, "slider", _p.getSlider);
_p.startPos;
cc.defineGetterSetter(_p, "startPos", _p.getStartPos);
_p = null;
cc.ControlHuePicker.create = function (target, pos) {
    return new cc.ControlHuePicker(target, pos);
};
cc.ControlColourPicker = cc.Control.extend({
    _hsv:null,
    _colourPicker:null,
    _huePicker:null,
    _background:null,
    _className:"ControlColourPicker",
    ctor:function () {
        cc.Control.prototype.ctor.call(this);
        this.init();
    },
    hueSliderValueChanged:function (sender, controlEvent) {
        this._hsv.h = sender.getHue();
        var rgb = cc.ControlUtils.RGBfromHSV(this._hsv);
        cc.Control.prototype.setColor.call(this,cc.color(0 | (rgb.r * 255), 0 | (rgb.g * 255), 0 | (rgb.b * 255)));
        this.sendActionsForControlEvents(cc.CONTROL_EVENT_VALUECHANGED);
        this._updateControlPicker();
    },
    colourSliderValueChanged:function (sender, controlEvent) {
        this._hsv.s = sender.getSaturation();
        this._hsv.v = sender.getBrightness();
        var rgb = cc.ControlUtils.RGBfromHSV(this._hsv);
        cc.Control.prototype.setColor.call(this,cc.color(0 | (rgb.r * 255), 0 | (rgb.g * 255), 0 | (rgb.b * 255)));
        this.sendActionsForControlEvents(cc.CONTROL_EVENT_VALUECHANGED);
    },
    setColor:function (color) {
        cc.Control.prototype.setColor.call(this,color);
        var rgba = new cc.RGBA();
        rgba.r = color.r / 255.0;
        rgba.g = color.g / 255.0;
        rgba.b = color.b / 255.0;
        rgba.a = 1.0;
        this._hsv = cc.ControlUtils.HSVfromRGB(rgba);
        this._updateHueAndControlPicker();
    },
    getBackground:function () {
        return this._background;
    },
    init:function () {
        if (cc.Control.prototype.init.call(this)) {
            cc.spriteFrameCache.addSpriteFrames(res.CCControlColourPickerSpriteSheet_plist);
            var spriteSheet = new cc.SpriteBatchNode(res.CCControlColourPickerSpriteSheet_png);
            this.addChild(spriteSheet);
            this._hsv = new cc.HSV(0, 0, 0);
            this._background = cc.ControlUtils.addSpriteToTargetWithPosAndAnchor("menuColourPanelBackground.png", spriteSheet, cc.p(0,0), cc.p(0.5, 0.5));
            var backgroundPointZero = cc.pSub(this._background.getPosition(),
                cc.p(this._background.getContentSize().width / 2, this._background.getContentSize().height / 2));
            var hueShift = 8;
            var colourShift = 28;
            this._huePicker = new cc.ControlHuePicker(spriteSheet, cc.p(backgroundPointZero.x + hueShift, backgroundPointZero.y + hueShift));
            this._colourPicker = new cc.ControlSaturationBrightnessPicker(spriteSheet, cc.p(backgroundPointZero.x + colourShift, backgroundPointZero.y + colourShift));
            this._huePicker.addTargetWithActionForControlEvents(this, this.hueSliderValueChanged, cc.CONTROL_EVENT_VALUECHANGED);
            this._colourPicker.addTargetWithActionForControlEvents(this, this.colourSliderValueChanged, cc.CONTROL_EVENT_VALUECHANGED);
            this._updateHueAndControlPicker();
            this.addChild(this._huePicker);
            this.addChild(this._colourPicker);
            this.setContentSize(this._background.getContentSize());
            return true;
        }
        else
            return false;
    },
    _updateControlPicker:function () {
        this._huePicker.setHue(this._hsv.h);
        this._colourPicker.updateWithHSV(this._hsv);
    },
    _updateHueAndControlPicker:function () {
        this._huePicker.setHue(this._hsv.h);
        this._colourPicker.updateWithHSV(this._hsv);
        this._colourPicker.updateDraggerWithHSV(this._hsv);
    },
    setEnabled:function (enabled) {
        cc.Control.prototype.setEnabled.call(this, enabled);
        if (this._huePicker != null) {
            this._huePicker.setEnabled(enabled);
        }
        if (this._colourPicker) {
            this._colourPicker.setEnabled(enabled);
        }
    },
    onTouchBegan:function () {
        return false;
    }
});
var _p = cc.ControlColourPicker.prototype;
_p.background;
cc.defineGetterSetter(_p, "background", _p.getBackground);
_p = null;
cc.ControlColourPicker.create = function () {
    return new cc.ControlColourPicker();
};
var res = res || {};
res.CCControlColourPickerSpriteSheet_plist = res.CCControlColourPickerSpriteSheet_plist || "res/extensions/CCControlColourPickerSpriteSheet.plist";
res.CCControlColourPickerSpriteSheet_png = res.CCControlColourPickerSpriteSheet_png || "res/extensions/CCControlColourPickerSpriteSheet.png";
cc.SLIDER_MARGIN_H = 24;
cc.SLIDER_MARGIN_V = 8;
cc.ControlSlider = cc.Control.extend({
    _value:0,
    _minimumValue:0,
    _maximumValue:0,
    _minimumAllowedValue:0,
    _maximumAllowedValue:0,
    _thumbSprite:null,
    _progressSprite:null,
    _backgroundSprite:null,
    _className:"ControlSlider",
    ctor:function (bgFile, progressFile, thumbFile) {
        cc.Control.prototype.ctor.call(this);
        if (thumbFile != undefined) {
            var bgSprite = new cc.Sprite(bgFile);
            var progressSprite = new cc.Sprite(progressFile);
            var thumbSprite = new cc.Sprite(thumbFile);
            this.initWithSprites(bgSprite, progressSprite, thumbSprite);
        }
    },
    getValue:function () {
        return this._value;
    },
    setValue:function (value) {
        value = Math.max(value, this._minimumValue);
        value = Math.min(value, this._maximumValue);
        this._value = value;
        this.needsLayout();
        this.sendActionsForControlEvents(cc.CONTROL_EVENT_VALUECHANGED);
    },
    getMinimumValue:function () {
        return this._minimumValue;
    },
    setMinimumValue:function (minimumValue) {
        this._minimumValue = minimumValue;
        this._minimumAllowedValue = minimumValue;
        if (this._minimumValue >= this._maximumValue)
            this._maximumValue = this._minimumValue + 1.0;
        this.setValue(this._value);
    },
    getMaximumValue:function () {
        return this._maximumValue;
    },
    setMaximumValue:function (maximumValue) {
        this._maximumValue = maximumValue;
        this._maximumAllowedValue = maximumValue;
        if (this._maximumValue <= this._minimumValue)
            this._minimumValue = this._maximumValue - 1.0;
        this.setValue(this._value);
    },
    isTouchInside:function (touch) {
        var touchLocation = touch.getLocation();
        touchLocation = this.getParent().convertToNodeSpace(touchLocation);
        var rect = this.getBoundingBox();
        rect.width += this._thumbSprite.getContentSize().width;
        rect.x -= this._thumbSprite.getContentSize().width / 2;
        return cc.rectContainsPoint(rect, touchLocation);
    },
    locationFromTouch:function (touch) {
        var touchLocation = touch.getLocation();
        touchLocation = this.convertToNodeSpace(touchLocation);
        if (touchLocation.x < 0) {
            touchLocation.x = 0;
        } else if (touchLocation.x > this._backgroundSprite.getContentSize().width) {
            touchLocation.x = this._backgroundSprite.getContentSize().width;
        }
        return touchLocation;
    },
    getMinimumAllowedValue:function () {
        return this._minimumAllowedValue;
    },
    setMinimumAllowedValue:function (val) {
        this._minimumAllowedValue = val;
    },
    getMaximumAllowedValue:function () {
        return this._maximumAllowedValue;
    },
    setMaximumAllowedValue:function (val) {
        this._maximumAllowedValue = val;
    },
    getThumbSprite:function () {
        return this._thumbSprite;
    },
    getProgressSprite:function () {
        return this._progressSprite;
    },
    getBackgroundSprite:function () {
        return this._backgroundSprite;
    },
    initWithSprites:function (backgroundSprite, progressSprite, thumbSprite) {
        if (cc.Control.prototype.init.call(this)) {
            this.ignoreAnchorPointForPosition(false);
            this._backgroundSprite = backgroundSprite;
            this._progressSprite = progressSprite;
            this._thumbSprite = thumbSprite;
            var maxRect = cc.ControlUtils.CCRectUnion(backgroundSprite.getBoundingBox(), thumbSprite.getBoundingBox());
            this.setContentSize(maxRect.width, maxRect.height);
            this._backgroundSprite.setAnchorPoint(0.5, 0.5);
            this._backgroundSprite.setPosition(maxRect.width / 2, maxRect.height / 2);
            this.addChild(this._backgroundSprite);
            this._progressSprite.setAnchorPoint(0.0, 0.5);
            this._progressSprite.setPosition(0, maxRect.height / 2);
            this.addChild(this._progressSprite);
            this._thumbSprite.setPosition(0, maxRect.height / 2);
            this.addChild(this._thumbSprite);
            this._minimumValue = 0.0;
            this._maximumValue = 1.0;
            this.setValue(this._minimumValue);
            return true;
        } else
            return false;
    },
    setEnabled:function (enabled) {
        cc.Control.prototype.setEnabled.call(this, enabled);
        if (this._thumbSprite) {
            this._thumbSprite.setOpacity(enabled ? 255 : 128);
        }
    },
    sliderBegan:function (location) {
        this.setSelected(true);
        this._thumbSprite.setColor(cc.color.GRAY);
        this.setValue(this.valueForLocation(location));
    },
    sliderMoved:function (location) {
        this.setValue(this.valueForLocation(location));
    },
    sliderEnded:function (location) {
        if (this.isSelected()) {
            this.setValue(this.valueForLocation(this._thumbSprite.getPosition()));
        }
        this._thumbSprite.setColor(cc.color.WHITE);
        this.setSelected(false);
    },
    getTouchLocationInControl:function (touch) {
        var touchLocation = touch.getLocation();
        touchLocation = this.convertToNodeSpace(touchLocation);
        if (touchLocation.x < 0) {
            touchLocation.x = 0;
        } else if (touchLocation.x > this._backgroundSprite.getContentSize().width + cc.SLIDER_MARGIN_H) {
            touchLocation.x = this._backgroundSprite.getContentSize().width + cc.SLIDER_MARGIN_H;
        }
        return touchLocation;
    },
    onTouchBegan:function (touch, event) {
        if (!this.isTouchInside(touch)|| !this.isEnabled() || !this.isVisible())
            return false;
        var location = this.locationFromTouch(touch);
        this.sliderBegan(location);
        return true;
    },
    onTouchMoved:function (touch, event) {
        var location = this.locationFromTouch(touch);
        this.sliderMoved(location);
    },
    onTouchEnded:function (touch, event) {
        this.sliderEnded(cc.p(0,0));
    },
    needsLayout:function(){
        var percent = (this._value - this._minimumValue) / (this._maximumValue - this._minimumValue);
        this._thumbSprite.setPositionX(percent * this._backgroundSprite.getContentSize().width);
        var textureRect = this._progressSprite.getTextureRect();
        textureRect = cc.rect(textureRect.x, textureRect.y, this._thumbSprite.getPositionX(), textureRect.height);
        this._progressSprite.setTextureRect(textureRect, this._progressSprite.isTextureRectRotated());
        this._thumbSprite._renderCmd.transform(this._renderCmd);
    },
    valueForLocation:function (location) {
        var percent = location.x / this._backgroundSprite.getContentSize().width;
        return Math.max(Math.min(this._minimumValue + percent * (this._maximumValue - this._minimumValue), this._maximumAllowedValue), this._minimumAllowedValue);
    }
});
var _p = cc.ControlSlider.prototype;
_p.value;
cc.defineGetterSetter(_p, "value", _p.getValue, _p.setValue);
_p.minValue;
cc.defineGetterSetter(_p, "minValue", _p.getMinimumValue, _p.setMinimumValue);
_p.maxValue;
cc.defineGetterSetter(_p, "maxValue", _p.getMaximumValue, _p.setMaximumValue);
_p.minAllowedValue;
cc.defineGetterSetter(_p, "minAllowedValue", _p.getMinimumAllowedValue, _p.setMinimumAllowedValue);
_p.maxAllowedValue;
cc.defineGetterSetter(_p, "maxAllowedValue", _p.getMaximumAllowedValue, _p.setMaximumAllowedValue);
_p.thumbSprite;
cc.defineGetterSetter(_p, "thumbSprite", _p.getThumbSprite);
_p.progressSprite;
cc.defineGetterSetter(_p, "progressSprite", _p.getProgressSprite);
_p.backgroundSprite;
cc.defineGetterSetter(_p, "backgroundSprite", _p.getBackgroundSprite);
_p = null;
cc.ControlSlider.create = function (bgFile, progressFile, thumbFile) {
    return new cc.ControlSlider(bgFile, progressFile, thumbFile);
};
cc.ControlSwitch = cc.Control.extend({
    _switchSprite:null,
    _initialTouchXPosition:0,
    _moved:false,
    _on:false,
    _className:"ControlSwitch",
    ctor:function (maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel) {
        cc.Control.prototype.ctor.call(this);
        offLabel && this.initWithMaskSprite(maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel);
    },
    initWithMaskSprite:function (maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel) {
        if(!maskSprite)
            throw "cc.ControlSwitch.initWithMaskSprite(): maskSprite should be non-null.";
        if(!onSprite)
            throw "cc.ControlSwitch.initWithMaskSprite(): onSprite should be non-null.";
        if(!offSprite)
            throw "cc.ControlSwitch.initWithMaskSprite(): offSprite should be non-null.";
        if(!thumbSprite)
            throw "cc.ControlSwitch.initWithMaskSprite(): thumbSprite should be non-null.";
        if (this.init()) {
            this._on = true;
            this._switchSprite = new cc.ControlSwitchSprite();
            this._switchSprite.initWithMaskSprite(maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel);
            this._switchSprite.setPosition(this._switchSprite.getContentSize().width / 2, this._switchSprite.getContentSize().height / 2);
            this.addChild(this._switchSprite);
            this.ignoreAnchorPointForPosition(false);
            this.setAnchorPoint(0.5, 0.5);
            this.setContentSize(this._switchSprite.getContentSize());
            return true;
        }
        return false;
    },
    setOn:function (isOn, animated) {
        animated = animated || false;
        this._on = isOn;
        var xPosition = (this._on) ? this._switchSprite.getOnPosition() : this._switchSprite.getOffPosition();
        if(animated){
            this._switchSprite.runAction(new cc.ActionTween(0.2, "sliderXPosition", this._switchSprite.getSliderXPosition(),xPosition));
        }else{
            this._switchSprite.setSliderXPosition(xPosition);
        }
        this.sendActionsForControlEvents(cc.CONTROL_EVENT_VALUECHANGED);
    },
    isOn:function () {
        return this._on;
    },
    hasMoved:function () {
        return this._moved;
    },
    setEnabled:function (enabled) {
        this._enabled = enabled;
        this._switchSprite.setOpacity((enabled) ? 255 : 128);
    },
    locationFromTouch:function (touch) {
        var touchLocation = touch.getLocation();
        touchLocation = this.convertToNodeSpace(touchLocation);
        return touchLocation;
    },
    onTouchBegan:function (touch, event) {
        if (!this.isTouchInside(touch)  || !this.isEnabled()|| !this.isVisible()) {
            return false;
        }
        this._moved = false;
        var location = this.locationFromTouch(touch);
        this._initialTouchXPosition = location.x - this._switchSprite.getSliderXPosition();
        this._switchSprite.getThumbSprite().setColor(cc.color.GRAY);
        this._switchSprite.needsLayout();
        return true;
    },
    onTouchMoved:function (touch, event) {
        var location = this.locationFromTouch(touch);
        location = cc.p(location.x - this._initialTouchXPosition, 0);
        this._moved = true;
        this._switchSprite.setSliderXPosition(location.x);
    },
    onTouchEnded:function (touch, event) {
        var location = this.locationFromTouch(touch);
        this._switchSprite.getThumbSprite().setColor(cc.color.WHITE);
        if (this.hasMoved()) {
            this.setOn(!(location.x < this._switchSprite.getContentSize().width / 2), true);
        } else {
            this.setOn(!this._on, true);
        }
    },
    onTouchCancelled:function (touch, event) {
        var location = this.locationFromTouch(touch);
        this._switchSprite.getThumbSprite().setColor(cc.color.WHITE);
        if (this.hasMoved()) {
            this.setOn(!(location.x < this._switchSprite.getContentSize().width / 2), true);
        } else {
            this.setOn(!this._on, true);
        }
    }
});
cc.ControlSwitch.create = function (maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel) {
    return new cc.ControlSwitch(maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel);
};
cc.ControlSwitchSprite = cc.Sprite.extend({
    _sliderXPosition:0,
    _onPosition:0,
    _offPosition:0,
    _textureLocation:0,
    _maskLocation:0,
    _maskSize:null,
    _onSprite:null,
    _offSprite:null,
    _thumbSprite:null,
    _onLabel:null,
    _offLabel:null,
    _clipper:null,
    _stencil:null,
    _backRT:null,
    ctor:function () {
        cc.Sprite.prototype.ctor.call(this);
        this._sliderXPosition = 0;
        this._onPosition = 0;
        this._offPosition = 0;
        this._maskLocation = 0;
        this._maskSize = cc.size(0, 0);
        this._onSprite = null;
        this._offSprite = null;
        this._thumbSprite = null;
        this._onLabel = null;
        this._offLabel = null;
    },
    initWithMaskSprite:function (maskSprite, onSprite, offSprite, thumbSprite, onLabel, offLabel) {
        if (cc.Sprite.prototype.init.call(this)) {
            this.setSpriteFrame(maskSprite.displayFrame());
            this._onPosition = 0;
            this._offPosition = -onSprite.getContentSize().width + thumbSprite.getContentSize().width / 2;
            this._sliderXPosition = this._onPosition;
            this.setOnSprite(onSprite);
            this.setOffSprite(offSprite);
            this.setThumbSprite(thumbSprite);
            this.setOnLabel(onLabel);
            this.setOffLabel(offLabel);
            this._stencil = maskSprite;
            var maskSize = this._maskSize = this._stencil.getContentSize();
            this._stencil.setPosition(0, 0);
            this._clipper = new cc.ClippingNode();
            this._clipper.setAnchorPoint(0.5, 0.5);
            this._clipper.setPosition(maskSize.width / 2, maskSize.height / 2);
            this._clipper.setStencil(this._stencil);
            this.addChild(this._clipper);
            this._clipper.addChild(onSprite);
            this._clipper.addChild(offSprite);
            this._clipper.addChild(onLabel);
            this._clipper.addChild(offLabel);
            this.addChild(this._thumbSprite);
            this.needsLayout();
            return true;
        }
        return false;
    },
    needsLayout:function () {
        var maskSize = this._maskSize;
        this._onSprite.setPosition(
            this._onSprite.getContentSize().width / 2 + this._sliderXPosition - maskSize.width / 2,
            this._onSprite.getContentSize().height / 2 - maskSize.height / 2
        );
        this._offSprite.setPosition(
            this._onSprite.getContentSize().width + this._offSprite.getContentSize().width / 2 + this._sliderXPosition - maskSize.width / 2,
            this._offSprite.getContentSize().height / 2 - maskSize.height / 2
        );
        if (this._onLabel) {
            this._onLabel.setPosition(
                this._onSprite.getPositionX() - this._thumbSprite.getContentSize().width / 6,
                this._onSprite.getContentSize().height / 2 - maskSize.height / 2
            );
        }
        if (this._offLabel) {
            this._offLabel.setPosition(
                this._offSprite.getPositionX() + this._thumbSprite.getContentSize().width / 6,
                this._offSprite.getContentSize().height / 2 - maskSize.height / 2
            );
        }
        this._thumbSprite.setPosition(
            this._onSprite.getContentSize().width + this._sliderXPosition,
            this._maskSize.height / 2
        );
    },
    setSliderXPosition:function (sliderXPosition) {
        if (sliderXPosition <= this._offPosition) {
            sliderXPosition = this._offPosition;
        } else if (sliderXPosition >= this._onPosition) {
            sliderXPosition = this._onPosition;
        }
        this._sliderXPosition = sliderXPosition;
        this.needsLayout();
    },
    getSliderXPosition:function () {
        return this._sliderXPosition;
    },
    _getOnSideWidth:function () {
        return this._onSprite.getContentSize().width;
    },
    _getOffSideWidth:function () {
        return this._offSprite.getContentSize().height;
    },
    updateTweenAction:function (value, key) {
        if (key === "sliderXPosition")
            this.setSliderXPosition(value);
    },
    setOnPosition:function (onPosition) {
        this._onPosition = onPosition;
    },
    getOnPosition:function () {
        return this._onPosition;
    },
    setOffPosition:function (offPosition) {
        this._offPosition = offPosition;
    },
    getOffPosition:function () {
        return this._offPosition;
    },
    setMaskTexture:function (maskTexture) {
        this._stencil.setTexture(maskTexture);
    },
    getMaskTexture:function () {
        return this._stencil.getTexture();
    },
    setTextureLocation:function (textureLocation) {
        this._textureLocation = textureLocation;
    },
    getTextureLocation:function () {
        return this._textureLocation;
    },
    setMaskLocation:function (maskLocation) {
        this._maskLocation = maskLocation;
    },
    getMaskLocation:function () {
        return this._maskLocation;
    },
    setOnSprite:function (onSprite) {
        this._onSprite = onSprite;
    },
    getOnSprite:function () {
        return this._onSprite;
    },
    setOffSprite:function (offSprite) {
        this._offSprite = offSprite;
    },
    getOffSprite:function () {
        return this._offSprite;
    },
    setThumbSprite:function (thumbSprite) {
        this._thumbSprite = thumbSprite;
    },
    getThumbSprite:function () {
        return this._thumbSprite;
    },
    setOnLabel:function (onLabel) {
        this._onLabel = onLabel;
    },
    getOnLabel:function () {
        return this._onLabel;
    },
    setOffLabel:function (offLabel) {
        this._offLabel = offLabel;
    },
    getOffLabel:function () {
        return this._offLabel;
    }
});
var _p = cc.ControlSwitchSprite.prototype;
_p.sliderX;
cc.defineGetterSetter(_p, "sliderX", _p.getSliderXPosition, _p.setSliderXPosition);
_p.onPos;
cc.defineGetterSetter(_p, "onPos", _p.getOnPosition, _p.setOnPosition);
_p.offPos;
cc.defineGetterSetter(_p, "offPos", _p.getOffPosition, _p.setOffPosition);
_p.maskTexture;
cc.defineGetterSetter(_p, "maskTexture", _p.getMaskTexture, _p.setMaskTexture);
_p.maskPos;
cc.defineGetterSetter(_p, "maskPos", _p.getMaskLocation, _p.setMaskLocation);
_p.onSprite;
cc.defineGetterSetter(_p, "onSprite", _p.getOnSprite, _p.setOnSprite);
_p.offSprite;
cc.defineGetterSetter(_p, "offSprite", _p.getOffSprite, _p.setOffSprite);
_p.thumbSprite;
cc.defineGetterSetter(_p, "thumbSprite", _p.getThumbSprite, _p.setThumbSprite);
_p.onLabel;
cc.defineGetterSetter(_p, "onLabel", _p.getOnLabel, _p.setOnLabel);
_p.offLabel;
cc.defineGetterSetter(_p, "offLabel", _p.getOffLabel, _p.setOffLabel);
_p.onSideWidth;
cc.defineGetterSetter(_p, "onSideWidth", _p._getOnSideWidth);
_p.offSideWidth;
cc.defineGetterSetter(_p, "offSideWidth", _p._getOffSideWidth);
_p = null;
cc.CONTROL_STEPPER_PARTMINUS = 0;
cc.CONTROL_STEPPER_PARTPLUS = 1;
cc.CONTROL_STEPPER_PARTNONE = 2;
cc.CONTROL_STEPPER_LABELCOLOR_ENABLED = cc.color(55, 55, 55);
cc.CONTROL_STEPPER_LABELCOLOR_DISABLED = cc.color(147, 147, 147);
cc.CONTROL_STEPPER_LABELFONT = "CourierNewPSMT";
cc.AUTOREPEAT_DELTATIME = 0.15;
cc.AUTOREPEAT_INCREASETIME_INCREMENT = 12;
cc.ControlStepper = cc.Control.extend({
    _minusSprite:null,
    _plusSprite:null,
    _minusLabel:null,
    _plusLabel:null,
    _value:0,
    _continuous:false,
    _autorepeat:false,
    _wraps:false,
    _minimumValue:0,
    _maximumValue:0,
    _stepValue:0,
    _touchInsideFlag:false,
    _touchedPart:cc.CONTROL_STEPPER_PARTNONE,
    _autorepeatCount:0,
    _className:"ControlStepper",
    ctor:function (minusSprite, plusSprite) {
        cc.Control.prototype.ctor.call(this);
        this._minusSprite = null;
        this._plusSprite = null;
        this._minusLabel = null;
        this._plusLabel = null;
        this._value = 0;
        this._continuous = false;
        this._autorepeat = false;
        this._wraps = false;
        this._minimumValue = 0;
        this._maximumValue = 0;
        this._stepValue = 0;
        this._touchInsideFlag = false;
        this._touchedPart = cc.CONTROL_STEPPER_PARTNONE;
        this._autorepeatCount = 0;
        plusSprite && this.initWithMinusSpriteAndPlusSprite(minusSprite, plusSprite);
    },
    initWithMinusSpriteAndPlusSprite:function (minusSprite, plusSprite) {
        if(!minusSprite)
            throw "cc.ControlStepper.initWithMinusSpriteAndPlusSprite(): Minus sprite should be non-null.";
        if(!plusSprite)
            throw "cc.ControlStepper.initWithMinusSpriteAndPlusSprite(): Plus sprite should be non-null.";
        if (this.init()) {
            this._autorepeat = true;
            this._continuous = true;
            this._minimumValue = 0;
            this._maximumValue = 100;
            this._value = 0;
            this._stepValue = 1;
            this._wraps = false;
            this.ignoreAnchorPointForPosition(false);
            this.setMinusSprite(minusSprite);
            this._minusSprite.setPosition(minusSprite.getContentSize().width / 2, minusSprite.getContentSize().height / 2);
            this.addChild(this._minusSprite);
            this.setMinusLabel(new cc.LabelTTF("-", cc.CONTROL_STEPPER_LABELFONT, 40, cc.size(40, 40), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER));
            this._minusLabel.setColor(cc.CONTROL_STEPPER_LABELCOLOR_DISABLED);
            this._minusLabel.setPosition(this._minusSprite.getContentSize().width / 2, this._minusSprite.getContentSize().height / 2);
            this._minusSprite.addChild(this._minusLabel);
            this.setPlusSprite(plusSprite);
            this._plusSprite.setPosition(minusSprite.getContentSize().width + plusSprite.getContentSize().width / 2,
                minusSprite.getContentSize().height / 2);
            this.addChild(this._plusSprite);
            this.setPlusLabel(new cc.LabelTTF("+", cc.CONTROL_STEPPER_LABELFONT, 40, cc.size(40, 40), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER));
            this._plusLabel.setColor(cc.CONTROL_STEPPER_LABELCOLOR_ENABLED);
            this._plusLabel.setPosition(this._plusSprite.getContentSize().width / 2, this._plusSprite.getContentSize().height / 2);
            this._plusSprite.addChild(this._plusLabel);
            var maxRect = cc.ControlUtils.CCRectUnion(this._minusSprite.getBoundingBox(), this._plusSprite.getBoundingBox());
            this.setContentSize(this._minusSprite.getContentSize().width + this._plusSprite.getContentSize().height, maxRect.height);
            return true;
        }
        return false;
    },
    setWraps: function (wraps) {
        this._wraps = wraps;
        if (this._wraps) {
            this._minusLabel.setColor(cc.CONTROL_STEPPER_LABELCOLOR_ENABLED);
            this._plusLabel.setColor(cc.CONTROL_STEPPER_LABELCOLOR_ENABLED);
        }
        this.setValue(this._value);
    },
	getWraps: function () {
		return this._wraps;
	},
    setMinimumValue:function (minimumValue) {
        if (minimumValue >= this._maximumValue)
            throw "cc.ControlStepper.setMinimumValue(): minimumValue should be numerically less than maximumValue.";
        this._minimumValue = minimumValue;
        this.setValue(this._value);
    },
	getMinimumValue: function () {
		return this._minimumValue;
	},
    setMaximumValue:function (maximumValue) {
        if (maximumValue <= this._minimumValue)
            throw "cc.ControlStepper.setMaximumValue(): maximumValue should be numerically less than maximumValue.";
        this._maximumValue = maximumValue;
        this.setValue(this._value);
    },
	getMaximumValue: function () {
		return this._maximumValue;
	},
    setValue:function (value) {
        this.setValueWithSendingEvent(value, true);
    },
    getValue:function () {
        return this._value;
    },
    setStepValue:function (stepValue) {
        if (stepValue <= 0)
            throw "cc.ControlStepper.setMaximumValue(): stepValue should be numerically greater than 0.";
        this._stepValue = stepValue;
    },
	getStepValue:function () {
		return this._stepValue;
	},
    isContinuous:function () {
        return this._continuous;
    },
    setValueWithSendingEvent:function (value, send) {
        if (value < this._minimumValue) {
            value = this._wraps ? this._maximumValue : this._minimumValue;
        } else if (value > this._maximumValue) {
            value = this._wraps ? this._minimumValue : this._maximumValue;
        }
        this._value = value;
        if (!this._wraps) {
            this._minusLabel.setColor((value == this._minimumValue) ? cc.CONTROL_STEPPER_LABELCOLOR_DISABLED : cc.CONTROL_STEPPER_LABELCOLOR_ENABLED);
            this._plusLabel.setColor((value == this._maximumValue) ? cc.CONTROL_STEPPER_LABELCOLOR_DISABLED : cc.CONTROL_STEPPER_LABELCOLOR_ENABLED);
        }
        if (send) {
            this.sendActionsForControlEvents(cc.CONTROL_EVENT_VALUECHANGED);
        }
    },
    startAutorepeat:function () {
        this._autorepeatCount = -1;
        this.schedule(this.update, cc.AUTOREPEAT_DELTATIME, cc.REPEAT_FOREVER, cc.AUTOREPEAT_DELTATIME * 3);
    },
    stopAutorepeat:function () {
        this.unschedule(this.update);
    },
    update:function (dt) {
        this._autorepeatCount++;
        if ((this._autorepeatCount < cc.AUTOREPEAT_INCREASETIME_INCREMENT) && (this._autorepeatCount % 3) != 0)
            return;
        if (this._touchedPart == cc.CONTROL_STEPPER_PARTMINUS) {
            this.setValueWithSendingEvent(this._value - this._stepValue, this._continuous);
        } else if (this._touchedPart == cc.CONTROL_STEPPER_PARTPLUS) {
            this.setValueWithSendingEvent(this._value + this._stepValue, this._continuous);
        }
    },
    updateLayoutUsingTouchLocation:function (location) {
        if (location.x < this._minusSprite.getContentSize().width
            && this._value > this._minimumValue) {
            this._touchedPart = cc.CONTROL_STEPPER_PARTMINUS;
            this._minusSprite.setColor(cc.color.GRAY);
            this._plusSprite.setColor(cc.color.WHITE);
        } else if (location.x >= this._minusSprite.getContentSize().width
            && this._value < this._maximumValue) {
            this._touchedPart = cc.CONTROL_STEPPER_PARTPLUS;
            this._minusSprite.setColor(cc.color.WHITE);
            this._plusSprite.setColor(cc.color.GRAY);
        } else {
            this._touchedPart = cc.CONTROL_STEPPER_PARTNONE;
            this._minusSprite.setColor(cc.color.WHITE);
            this._plusSprite.setColor(cc.color.WHITE);
        }
    },
    onTouchBegan:function (touch, event) {
        if (!this.isTouchInside(touch) || !this.isEnabled() || !this.isVisible()) {
            return false;
        }
        var location = this.getTouchLocation(touch);
        this.updateLayoutUsingTouchLocation(location);
        this._touchInsideFlag = true;
        if (this._autorepeat) {
            this.startAutorepeat();
        }
        return true;
    },
    onTouchMoved:function (touch, event) {
        if (this.isTouchInside(touch)) {
            var location = this.getTouchLocation(touch);
            this.updateLayoutUsingTouchLocation(location);
            if (!this._touchInsideFlag) {
                this._touchInsideFlag = true;
                if (this._autorepeat) {
                    this.startAutorepeat();
                }
            }
        } else {
            this._touchInsideFlag = false;
            this._touchedPart = cc.CONTROL_STEPPER_PARTNONE;
            this._minusSprite.setColor(cc.color.WHITE);
            this._plusSprite.setColor(cc.color.WHITE);
            if (this._autorepeat) {
                this.stopAutorepeat();
            }
        }
    },
    onTouchEnded:function (touch, event) {
        this._minusSprite.setColor(cc.color.WHITE);
        this._plusSprite.setColor(cc.color.WHITE);
        if (this._autorepeat) {
            this.stopAutorepeat();
        }
        if (this.isTouchInside(touch)) {
            var location = this.getTouchLocation(touch);
            this.setValue(this._value + ((location.x < this._minusSprite.getContentSize().width) ? (0.0 - this._stepValue) : this._stepValue));
        }
    },
    setMinusSprite:function (sprite) {
        this._minusSprite = sprite;
    },
    getMinusSprite:function () {
        return this._minusSprite;
    },
    setPlusSprite:function (sprite) {
        this._plusSprite = sprite;
    },
    getPlusSprite:function () {
        return this._plusSprite;
    },
    setMinusLabel:function (sprite) {
        this._minusLabel = sprite;
    },
    getMinusLabel:function () {
        return this._minusLabel;
    },
    setPlusLabel:function (sprite) {
        this._plusLabel = sprite;
    },
    getPlusLabel:function () {
        return this._plusLabel;
    }
});
var _p = cc.ControlStepper.prototype;
_p.wraps;
cc.defineGetterSetter(_p, "wraps", _p.getWraps, _p.setWraps);
_p.value;
cc.defineGetterSetter(_p, "value", _p.getValue, _p.setValue);
_p.minValue;
cc.defineGetterSetter(_p, "minValue", _p.getMinimumValue, _p.setMinimumValue);
_p.maxValue;
cc.defineGetterSetter(_p, "maxValue", _p.getMaximumValue, _p.setMaximumValue);
_p.stepValue;
cc.defineGetterSetter(_p, "stepValue", _p.getStepValue, _p.setStepValue);
_p.continuous;
cc.defineGetterSetter(_p, "continuous", _p.isContinuous);
_p.minusSprite;
cc.defineGetterSetter(_p, "minusSprite", _p.getMinusSprite, _p.setMinusSprite);
_p.plusSprite;
cc.defineGetterSetter(_p, "plusSprite", _p.getPlusSprite, _p.setPlusSprite);
_p.minusLabel;
cc.defineGetterSetter(_p, "minusLabel", _p.getMinusLabel, _p.setMinusLabel);
_p.plusLabel;
cc.defineGetterSetter(_p, "plusLabel", _p.getPlusLabel, _p.setPlusLabel);
_p = null;
cc.ControlStepper.create = function (minusSprite, plusSprite) {
    return new cc.ControlStepper(minusSprite, plusSprite);
};
cc.ControlPotentiometer = cc.Control.extend({
    _thumbSprite:null,
    _progressTimer:null,
    _previousLocation:null,
    _value:0,
    _minimumValue:0,
    _maximumValue:1,
    _className:"ControlPotentiometer",
    ctor:function (backgroundFile, progressFile, thumbFile) {
        cc.Control.prototype.ctor.call(this);
        if (thumbFile != undefined) {
            var backgroundSprite = new cc.Sprite(backgroundFile);
            var thumbSprite = new cc.Sprite(thumbFile);
            var progressTimer = new cc.ProgressTimer(new cc.Sprite(progressFile));
            this.initWithTrackSprite_ProgressTimer_ThumbSprite(backgroundSprite, progressTimer, thumbSprite);
        }
    },
    initWithTrackSprite_ProgressTimer_ThumbSprite:function (trackSprite, progressTimer, thumbSprite) {
        if (this.init()) {
            this.setProgressTimer(progressTimer);
            this.setThumbSprite(thumbSprite);
            this._thumbSprite.setPosition(progressTimer.getPosition());
            this.addChild(thumbSprite, 2);
            this.addChild(progressTimer, 1);
            this.addChild(trackSprite);
            this.setContentSize(trackSprite.getContentSize());
            this._minimumValue = 0.0;
            this._maximumValue = 1.0;
            this.setValue(this._minimumValue);
            return true;
        }
        return false;
    },
    setEnabled:function (enabled) {
        this.setEnabled(enabled);
        if (this._thumbSprite != NULL) {
            this._thumbSprite.setOpacity((enabled) ? 255 : 128);
        }
    },
    setValue:function (value) {
        if (value < this._minimumValue) {
            value = this._minimumValue;
        }
        if (value > this._maximumValue) {
            value = this._maximumValue;
        }
        this._value = value;
        var percent = (value - this._minimumValue) / (this._maximumValue - this._minimumValue);
        this._progressTimer.setPercentage(percent * 100.0);
        this._thumbSprite.setRotation(percent * 360.0);
        this.sendActionsForControlEvents(cc.CONTROL_EVENT_VALUECHANGED);
    },
    getValue:function () {
        return this._value;
    },
    setMinimumValue:function (minimumValue) {
        this._minimumValue = minimumValue;
        if (this._minimumValue >= this._maximumValue) {
            this._maximumValue = this._minimumValue + 1.0;
        }
        this.setValue(this._maximumValue);
    },
    getMinimumValue:function () {
        return this._minimumValue;
    },
    setMaximumValue:function (maximumValue) {
        this._maximumValue = maximumValue;
        if (this._maximumValue <= this._minimumValue) {
            this._minimumValue = this._maximumValue - 1.0;
        }
        this.setValue(this._minimumValue);
    },
    getMaximumValue:function () {
        return this._maximumValue;
    },
    isTouchInside:function (touch) {
        var touchLocation = this.getTouchLocation(touch);
        var distance = this.distanceBetweenPointAndPoint(this._progressTimer.getPosition(), touchLocation);
        return distance < Math.min(this.getContentSize().width / 2, this.getContentSize().height / 2);
    },
    onTouchBegan:function (touch, event) {
        if (!this.isTouchInside(touch) || !this.isEnabled() || !this.isVisible()) {
            return false;
        }
        this._previousLocation = this.getTouchLocation(touch);
        this.potentiometerBegan(this._previousLocation);
        return true;
    },
    onTouchMoved:function (touch, event) {
        var location = this.getTouchLocation(touch);
        this.potentiometerMoved(location);
    },
    onTouchEnded:function (touch, event) {
        this.potentiometerEnded(cc.p(0, 0));
    },
    distanceBetweenPointAndPoint:function (point1, point2) {
        var dx = point1.x - point2.x;
        var dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
    angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint:function (beginLineA, endLineA, beginLineB, endLineB) {
        var a = endLineA.x - beginLineA.x;
        var b = endLineA.y - beginLineA.y;
        var c = endLineB.x - beginLineB.x;
        var d = endLineB.y - beginLineB.y;
        var atanA = Math.atan2(a, b);
        var atanB = Math.atan2(c, d);
        return (atanA - atanB) * 180 / Math.PI;
    },
    potentiometerBegan:function (location) {
        this.setSelected(true);
        this.getThumbSprite().setColor(cc.color.GRAY);
    },
    potentiometerMoved:function (location) {
        var angle = this.angleInDegreesBetweenLineFromPoint_toPoint_toLineFromPoint_toPoint(this._progressTimer.getPosition(), location, this._progressTimer.getPosition(), this._previousLocation);
        if (angle > 180) {
            angle -= 360;
        }
        else if (angle < -180) {
            angle += 360;
        }
        this.setValue(this._value + angle / 360.0 * (this._maximumValue - this._minimumValue));
        this._previousLocation = location;
    },
    potentiometerEnded:function (location) {
        this.getThumbSprite().setColor(cc.color.WHITE);
        this.setSelected(false);
    },
    setThumbSprite:function (sprite) {
        this._thumbSprite = sprite;
    },
    getThumbSprite:function () {
        return this._thumbSprite;
    },
    setProgressTimer:function (sprite) {
        this._progressTimer = sprite;
    },
    getProgressTimer:function () {
        return this._progressTimer;
    },
    setPreviousLocation:function (point) {
        this._previousLocation = point;
    },
    getPreviousLocation:function () {
        return this._previousLocation;
    }
});
var _p = cc.ControlPotentiometer.prototype;
_p.value;
cc.defineGetterSetter(_p, "value", _p.getValue, _p.setValue);
_p.minValue;
cc.defineGetterSetter(_p, "minValue", _p.getMinimumValue, _p.setMinimumValue);
_p.maxValue;
cc.defineGetterSetter(_p, "maxValue", _p.getMaximumValue, _p.setMaximumValue);
_p.progressTimer;
cc.defineGetterSetter(_p, "progressTimer", _p.getProgressTimer, _p.setProgressTimer);
_p.thumbSprite;
cc.defineGetterSetter(_p, "thumbSprite", _p.getThumbSprite, _p.setThumbSprite);
_p.prevLocation;
cc.defineGetterSetter(_p, "prevLocation", _p.getPreviousLocation, _p.setPreviousLocation);
_p = null;
cc.ControlPotentiometer.create = function (backgroundFile, progressFile, thumbFile) {
    return new cc.ControlPotentiometer(backgroundFile, progressFile, thumbFile);
};
cc.SCROLLVIEW_DIRECTION_NONE = -1;
cc.SCROLLVIEW_DIRECTION_HORIZONTAL = 0;
cc.SCROLLVIEW_DIRECTION_VERTICAL = 1;
cc.SCROLLVIEW_DIRECTION_BOTH = 2;
var SCROLL_DEACCEL_RATE = 0.95;
var SCROLL_DEACCEL_DIST = 1.0;
var BOUNCE_DURATION = 0.15;
var INSET_RATIO = 0.2;
var MOVE_INCH = 7.0/160.0;
var BOUNCE_BACK_FACTOR = 0.35;
cc.convertDistanceFromPointToInch = function(pointDis){
    var eglViewer = cc.view;
    var factor = (eglViewer.getScaleX() + eglViewer.getScaleY())/2;
    return (pointDis * factor) / 160;
};
cc.ScrollViewDelegate = cc.Class.extend({
    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    }
});
cc.ScrollView = cc.Layer.extend({
    _zoomScale:0,
    _minZoomScale:0,
    _maxZoomScale:0,
    _delegate:null,
    _direction:cc.SCROLLVIEW_DIRECTION_BOTH,
    _dragging:false,
    _contentOffset:null,
    _container:null,
    _touchMoved:false,
    _maxInset:null,
    _minInset:null,
    _bounceable:false,
    _clippingToBounds:false,
    _scrollDistance:null,
    _touchPoint:null,
    _touchLength:0,
    _touches:null,
    _viewSize:null,
    _minScale:0,
    _maxScale:0,
    _parentScissorRect:null,
    _scissorRestored:false,
    _tmpViewRect:null,
    _touchListener: null,
    _className:"ScrollView",
    ctor:function (size, container) {
        cc.Layer.prototype.ctor.call(this);
        this._contentOffset = cc.p(0,0);
        this._maxInset = cc.p(0, 0);
        this._minInset = cc.p(0, 0);
        this._scrollDistance = cc.p(0, 0);
        this._touchPoint = cc.p(0, 0);
        this._touches = [];
        this._viewSize = cc.size(0, 0);
        this._parentScissorRect = new cc.Rect(0,0,0,0);
        this._tmpViewRect = new cc.Rect(0,0,0,0);
        if(container != undefined)
            this.initWithViewSize(size, container);
        else
            this.initWithViewSize(cc.size(200, 200), null);
    },
    init:function () {
        return this.initWithViewSize(cc.size(200, 200), null);
    },
    initWithViewSize:function (size, container) {
        var pZero = cc.p(0,0);
        if (cc.Layer.prototype.init.call(this)) {
            this._container = container;
            if (!this._container) {
                this._container = new cc.Layer();
                this._container.ignoreAnchorPointForPosition(false);
                this._container.setAnchorPoint(pZero);
            }
            this.setViewSize(size);
            this.setTouchEnabled(true);
            this._touches.length = 0;
            this._delegate = null;
            this._bounceable = true;
            this._clippingToBounds = true;
            this._direction = cc.SCROLLVIEW_DIRECTION_BOTH;
            this._container.setPosition(pZero);
            this._touchLength = 0.0;
            this.addChild(this._container);
            this._minScale = this._maxScale = 1.0;
            return true;
        }
        return false;
    },
    setContentOffset: function (offset, animated) {
        if (animated) {
            this.setContentOffsetInDuration(offset, BOUNCE_DURATION);
            return;
        }
        if (!this._bounceable) {
            var minOffset = this.minContainerOffset();
            var maxOffset = this.maxContainerOffset();
            offset.x = Math.max(minOffset.x, Math.min(maxOffset.x, offset.x));
            offset.y = Math.max(minOffset.y, Math.min(maxOffset.y, offset.y));
        }
        this._container.setPosition(offset);
        var locDelegate = this._delegate;
        if (locDelegate != null && locDelegate.scrollViewDidScroll) {
            locDelegate.scrollViewDidScroll(this);
        }
    },
    getContentOffset:function () {
        var locPos = this._container.getPosition();
        return cc.p(locPos.x, locPos.y);
    },
    setContentOffsetInDuration:function (offset, dt) {
        var scroll = cc.moveTo(dt, offset);
        var expire = cc.callFunc(this._stoppedAnimatedScroll, this);
        this._container.runAction(cc.sequence(scroll, expire));
        this.schedule(this._performedAnimatedScroll);
    },
    setZoomScale: function (scale, animated) {
        if (animated) {
            this.setZoomScaleInDuration(scale, BOUNCE_DURATION);
            return;
        }
        var locContainer = this._container;
        if (locContainer.getScale() != scale) {
            var oldCenter, newCenter;
            var center;
            if (this._touchLength == 0.0) {
                var locViewSize = this._viewSize;
                center = cc.p(locViewSize.width * 0.5, locViewSize.height * 0.5);
                center = this.convertToWorldSpace(center);
            } else
                center = this._touchPoint;
            oldCenter = locContainer.convertToNodeSpace(center);
            locContainer.setScale(Math.max(this._minScale, Math.min(this._maxScale, scale)));
            newCenter = locContainer.convertToWorldSpace(oldCenter);
            var offset = cc.pSub(center, newCenter);
            if (this._delegate && this._delegate.scrollViewDidZoom)
                this._delegate.scrollViewDidZoom(this);
            this.setContentOffset(cc.pAdd(locContainer.getPosition(), offset));
        }
    },
    getZoomScale:function () {
        return this._container.getScale();
    },
    setZoomScaleInDuration:function (s, dt) {
        if (dt > 0) {
            var locScale = this._container.getScale();
            if (locScale != s) {
                var scaleAction = cc.actionTween(dt, "zoomScale", locScale, s);
                this.runAction(scaleAction);
            }
        } else {
            this.setZoomScale(s);
        }
    },
    minContainerOffset:function () {
        var locContainer = this._container;
        var locContentSize = locContainer.getContentSize(), locViewSize = this._viewSize;
        return cc.p(locViewSize.width - locContentSize.width * locContainer.getScaleX(),
            locViewSize.height - locContentSize.height * locContainer.getScaleY());
    },
    maxContainerOffset:function () {
        return cc.p(0.0, 0.0);
    },
    isNodeVisible:function (node) {
        var offset = this.getContentOffset();
        var size = this.getViewSize();
        var scale = this.getZoomScale();
        var viewRect = cc.rect(-offset.x / scale, -offset.y / scale, size.width / scale, size.height / scale);
        return cc.rectIntersectsRect(viewRect, node.getBoundingBox());
    },
    pause:function (sender) {
        this._container.pause();
        var selChildren = this._container.getChildren();
        for (var i = 0; i < selChildren.length; i++) {
            selChildren[i].pause();
        }
        this._super();
    },
    resume:function (sender) {
        var selChildren = this._container.getChildren();
        for (var i = 0, len = selChildren.length; i < len; i++) {
            selChildren[i].resume();
        }
        this._container.resume();
        this._super();
    },
    isDragging:function () {
        return this._dragging;
    },
    isTouchMoved:function () {
        return this._touchMoved;
    },
    isBounceable:function () {
        return this._bounceable;
    },
    setBounceable:function (bounceable) {
        this._bounceable = bounceable;
    },
    getViewSize:function () {
        return this._viewSize;
    },
    setViewSize:function (size) {
        this._viewSize = size;
        cc.Node.prototype.setContentSize.call(this,size);
    },
    getContainer:function () {
        return this._container;
    },
    setContainer:function (container) {
        if (!container)
            return;
        this.removeAllChildren(true);
        this._container = container;
        container.ignoreAnchorPointForPosition(false);
        container.setAnchorPoint(0, 0);
        this.addChild(container);
        this.setViewSize(this._viewSize);
    },
    getDirection:function () {
        return this._direction;
    },
    setDirection:function (direction) {
        this._direction = direction;
    },
    getDelegate:function () {
        return this._delegate;
    },
    setDelegate:function (delegate) {
        this._delegate = delegate;
    },
    onTouchBegan:function (touch, event) {
        if (!this.isVisible())
            return false;
        var frame = this._getViewRect();
        var locContainer = this._container;
        var locPoint = locContainer.convertToWorldSpace(locContainer.convertTouchToNodeSpace(touch));
        var locTouches = this._touches;
        if (locTouches.length > 2 || this._touchMoved || !cc.rectContainsPoint(frame, locPoint))
            return false;
        locTouches.push(touch);
        if (locTouches.length === 1) {
            this._touchPoint = this.convertTouchToNodeSpace(touch);
            this._touchMoved = false;
            this._dragging = true;
            this._scrollDistance.x = 0;
            this._scrollDistance.y = 0;
            this._touchLength = 0.0;
        } else if (locTouches.length == 2) {
            this._touchPoint = cc.pMidpoint(this.convertTouchToNodeSpace(locTouches[0]),
                this.convertTouchToNodeSpace(locTouches[1]));
            this._touchLength = cc.pDistance(locContainer.convertTouchToNodeSpace(locTouches[0]),
                locContainer.convertTouchToNodeSpace(locTouches[1]));
            this._dragging = false;
        }
        return true;
    },
    onTouchMoved:function (touch, event) {
        if (!this.isVisible())
            return;
        this.setNodeDirty();
        if (this._touches.length === 1 && this._dragging) {
            this._touchMoved = true;
            var frame = this._getViewRect();
            var newPoint = this.convertTouchToNodeSpace(touch);
            var moveDistance = cc.pSub(newPoint, this._touchPoint);
            var dis = 0.0, locDirection = this._direction, pos;
            if (locDirection === cc.SCROLLVIEW_DIRECTION_VERTICAL){
                dis = moveDistance.y;
                pos = this._container.getPositionY();
                if (!(this.minContainerOffset().y <= pos && pos <= this.maxContainerOffset().y))
                    moveDistance.y *= BOUNCE_BACK_FACTOR;
            } else if (locDirection === cc.SCROLLVIEW_DIRECTION_HORIZONTAL){
                dis = moveDistance.x;
                pos = this._container.getPositionX();
                if (!(this.minContainerOffset().x <= pos && pos <= this.maxContainerOffset().x))
                    moveDistance.x *= BOUNCE_BACK_FACTOR;
            }else {
                dis = Math.sqrt(moveDistance.x * moveDistance.x + moveDistance.y * moveDistance.y);
                pos = this._container.getPositionY();
                var _minOffset = this.minContainerOffset(), _maxOffset = this.maxContainerOffset();
                if (!(_minOffset.y <= pos && pos <= _maxOffset.y))
                    moveDistance.y *= BOUNCE_BACK_FACTOR;
                pos = this._container.getPositionX();
                if (!(_minOffset.x <= pos && pos <= _maxOffset.x))
                    moveDistance.x *= BOUNCE_BACK_FACTOR;
            }
            if (!this._touchMoved && Math.abs(cc.convertDistanceFromPointToInch(dis)) < MOVE_INCH ){
                return;
            }
            if (!this._touchMoved){
                moveDistance.x = 0;
                moveDistance.y = 0;
            }
            this._touchPoint = newPoint;
            this._touchMoved = true;
            if (this._dragging) {
                switch (locDirection) {
                    case cc.SCROLLVIEW_DIRECTION_VERTICAL:
                        moveDistance.x = 0.0;
                        break;
                    case cc.SCROLLVIEW_DIRECTION_HORIZONTAL:
                        moveDistance.y = 0.0;
                        break;
                    default:
                        break;
                }
                var locPosition = this._container.getPosition();
                var newX = locPosition.x + moveDistance.x;
                var newY = locPosition.y + moveDistance.y;
                this._scrollDistance = moveDistance;
                this.setContentOffset(cc.p(newX, newY));
            }
        } else if (this._touches.length === 2 && !this._dragging) {
            var len = cc.pDistance(this._container.convertTouchToNodeSpace(this._touches[0]),
                this._container.convertTouchToNodeSpace(this._touches[1]));
            this.setZoomScale(this.getZoomScale() * len / this._touchLength);
        }
    },
    onTouchEnded:function (touch, event) {
        if (!this.isVisible())
            return;
        if (this._touches.length == 1 && this._touchMoved)
            this.schedule(this._deaccelerateScrolling);
        this._touches.length = 0;
        this._dragging = false;
        this._touchMoved = false;
    },
    onTouchCancelled:function (touch, event) {
        if (!this.isVisible())
            return;
        this._touches.length = 0;
        this._dragging = false;
        this._touchMoved = false;
    },
    setContentSize: function (size, height) {
        if (this.getContainer() != null) {
            if(height === undefined)
                this.getContainer().setContentSize(size);
            else
                this.getContainer().setContentSize(size, height);
            this.updateInset();
        }
    },
	_setWidth: function (value) {
		var container = this.getContainer();
		if (container != null) {
			container._setWidth(value);
			this.updateInset();
		}
	},
	_setHeight: function (value) {
		var container = this.getContainer();
		if (container != null) {
			container._setHeight(value);
			this.updateInset();
		}
	},
    getContentSize:function () {
        return this._container.getContentSize();
    },
    updateInset:function () {
        if (this.getContainer() != null) {
            var locViewSize = this._viewSize;
            var tempOffset = this.maxContainerOffset();
            this._maxInset.x = tempOffset.x + locViewSize.width * INSET_RATIO;
            this._maxInset.y = tempOffset.y + locViewSize.height * INSET_RATIO;
            tempOffset = this.minContainerOffset();
            this._minInset.x = tempOffset.x - locViewSize.width * INSET_RATIO;
            this._minInset.y = tempOffset.y - locViewSize.height * INSET_RATIO;
        }
    },
    isClippingToBounds:function () {
        return this._clippingToBounds;
    },
    setClippingToBounds:function (clippingToBounds) {
        this._clippingToBounds = clippingToBounds;
    },
    visit:function (parentCmd) {
        if (!this.isVisible())
            return;
        this._renderCmd.visit(parentCmd);
    },
    addChild:function (child, zOrder, tag) {
        if (!child)
            throw new Error("child must not nil!");
        zOrder = zOrder || child.getLocalZOrder();
        tag = tag || child.getTag();
        if (this._container != child) {
            this._container.addChild(child, zOrder, tag);
        } else {
            cc.Layer.prototype.addChild.call(this, child, zOrder, tag);
        }
    },
    isTouchEnabled: function(){
        return this._touchListener != null;
    },
    setTouchEnabled:function (e) {
        if(this._touchListener)
            cc.eventManager.removeListener(this._touchListener);
        this._touchListener = null;
        if (!e) {
            this._dragging = false;
            this._touchMoved = false;
            this._touches.length = 0;
        } else {
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE
            });
            if(this.onTouchBegan)
                listener.onTouchBegan = this.onTouchBegan.bind(this);
            if(this.onTouchMoved)
                listener.onTouchMoved = this.onTouchMoved.bind(this);
            if(this.onTouchEnded)
                listener.onTouchEnded = this.onTouchEnded.bind(this);
            if(this.onTouchCancelled)
                listener.onTouchCancelled = this.onTouchCancelled.bind(this);
            this._touchListener = listener;
            cc.eventManager.addListener(listener, this);
        }
    },
    _initWithViewSize:function (size) {
        return null;
    },
    _relocateContainer:function (animated) {
        var min = this.minContainerOffset();
        var max = this.maxContainerOffset();
        var locDirection = this._direction;
        var oldPoint = this._container.getPosition();
        var newX = oldPoint.x;
        var newY = oldPoint.y;
        if (locDirection === cc.SCROLLVIEW_DIRECTION_BOTH || locDirection === cc.SCROLLVIEW_DIRECTION_HORIZONTAL) {
            newX = Math.max(newX, min.x);
            newX = Math.min(newX, max.x);
        }
        if (locDirection == cc.SCROLLVIEW_DIRECTION_BOTH || locDirection == cc.SCROLLVIEW_DIRECTION_VERTICAL) {
            newY = Math.min(newY, max.y);
            newY = Math.max(newY, min.y);
        }
        if (newY != oldPoint.y || newX != oldPoint.x) {
            this.setContentOffset(cc.p(newX, newY), animated);
        }
    },
    _deaccelerateScrolling:function (dt) {
        if (this._dragging) {
            this.unschedule(this._deaccelerateScrolling);
            return;
        }
        var maxInset, minInset;
        var oldPosition = this._container.getPosition();
        var locScrollDistance = this._scrollDistance;
        this._container.setPosition(oldPosition.x + locScrollDistance.x , oldPosition.y + locScrollDistance.y);
        if (this._bounceable) {
            maxInset = this._maxInset;
            minInset = this._minInset;
        } else {
            maxInset = this.maxContainerOffset();
            minInset = this.minContainerOffset();
        }
        var newX = this._container.getPositionX();
        var newY = this._container.getPositionY();
        locScrollDistance.x = locScrollDistance.x * SCROLL_DEACCEL_RATE;
        locScrollDistance.y = locScrollDistance.y * SCROLL_DEACCEL_RATE;
        this.setContentOffset(cc.p(newX, newY));
        if ((Math.abs(locScrollDistance.x) <= SCROLL_DEACCEL_DIST &&
            Math.abs(locScrollDistance.y) <= SCROLL_DEACCEL_DIST) ||
            newY > maxInset.y || newY < minInset.y ||
            newX > maxInset.x || newX < minInset.x ||
            newX == maxInset.x || newX == minInset.x ||
            newY == maxInset.y || newY == minInset.y) {
            this.unschedule(this._deaccelerateScrolling);
            this._relocateContainer(true);
        }
    },
    _performedAnimatedScroll:function (dt) {
        if (this._dragging) {
            this.unschedule(this._performedAnimatedScroll);
            return;
        }
        if (this._delegate && this._delegate.scrollViewDidScroll)
            this._delegate.scrollViewDidScroll(this);
    },
    _stoppedAnimatedScroll:function (node) {
        this.unschedule(this._performedAnimatedScroll);
        if (this._delegate && this._delegate.scrollViewDidScroll) {
            this._delegate.scrollViewDidScroll(this);
        }
    },
    _handleZoom:function () {
    },
    _getViewRect:function(){
        var screenPos = this.convertToWorldSpace(cc.p(0,0));
        var locViewSize = this._viewSize;
        var scaleX = this.getScaleX();
        var scaleY = this.getScaleY();
        for (var p = this._parent; p != null; p = p.getParent()) {
            scaleX *= p.getScaleX();
            scaleY *= p.getScaleY();
        }
        if (scaleX < 0) {
            screenPos.x += locViewSize.width * scaleX;
            scaleX = -scaleX;
        }
        if (scaleY < 0) {
            screenPos.y += locViewSize.height * scaleY;
            scaleY = -scaleY;
        }
        var locViewRect = this._tmpViewRect;
        locViewRect.x = screenPos.x;
        locViewRect.y = screenPos.y;
        locViewRect.width = locViewSize.width * scaleX;
        locViewRect.height = locViewSize.height * scaleY;
        return locViewRect;
    },
    _createRenderCmd: function(){
        if (cc._renderType === cc._RENDER_TYPE_CANVAS) {
            return new cc.ScrollView.CanvasRenderCmd(this);
        } else {
            return new cc.ScrollView.WebGLRenderCmd(this);
        }
    }
});
var _p = cc.ScrollView.prototype;
_p.minOffset;
cc.defineGetterSetter(_p, "minOffset", _p.minContainerOffset);
_p.maxOffset;
cc.defineGetterSetter(_p, "maxOffset", _p.maxContainerOffset);
_p.bounceable;
cc.defineGetterSetter(_p, "bounceable", _p.isBounceable, _p.setBounceable);
_p.viewSize;
cc.defineGetterSetter(_p, "viewSize", _p.getViewSize, _p.setViewSize);
_p.container;
cc.defineGetterSetter(_p, "container", _p.getContainer, _p.setContainer);
_p.direction;
cc.defineGetterSetter(_p, "direction", _p.getDirection, _p.setDirection);
_p.delegate;
cc.defineGetterSetter(_p, "delegate", _p.getDelegate, _p.setDelegate);
_p.clippingToBounds;
cc.defineGetterSetter(_p, "clippingToBounds", _p.isClippingToBounds, _p.setClippingToBounds);
_p = null;
cc.ScrollView.create = function (size, container) {
    return new cc.ScrollView(size, container);
};
(function() {
    cc.ScrollView.CanvasRenderCmd = function(renderable){
        cc.Layer.CanvasRenderCmd.call(this, renderable);
        this._needDraw = false;
        this.startCmd = new cc.CustomRenderCmd(this, this._startCmd);
        this.endCmd = new cc.CustomRenderCmd(this, this._endCmd);
    };
    var proto = cc.ScrollView.CanvasRenderCmd.prototype = Object.create(cc.Layer.CanvasRenderCmd.prototype);
    proto.constructor = cc.ScrollView.CanvasRenderCmd;
    proto._startCmd = function(ctx, scaleX, scaleY){
        var node = this._node;
        var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
        wrapper.save();
        if (node._clippingToBounds) {
            this._scissorRestored = false;
            wrapper.setTransform(this._worldTransform, scaleX, scaleY);
            var locScaleX = node.getScaleX(), locScaleY = node.getScaleY();
            var getWidth = (node._viewSize.width * locScaleX) * scaleX;
            var getHeight = (node._viewSize.height * locScaleY) * scaleY;
            context.beginPath();
            context.rect(0, 0, getWidth, -getHeight);
            context.closePath();
            context.clip();
        }
    };
    proto._endCmd = function(wrapper){
        wrapper = wrapper || cc._renderContext;
        wrapper.restore();
    };
    proto.visit = function(parentCmd){
        var node = this._node;
        var i, locChildren = node._children, childrenLen;
        this.transform(parentCmd);
        cc.renderer.pushRenderCommand(this.startCmd);
        if (locChildren && locChildren.length > 0) {
            childrenLen = locChildren.length;
            node.sortAllChildren();
            for (i = 0; i < childrenLen; i++) {
                locChildren[i]._renderCmd.visit(this);
            }
        }
        cc.renderer.pushRenderCommand(this.endCmd);
    };
})();
cc.SortableObject = cc.Class.extend({
    setObjectID:function (objectId) {
    },
    getObjectID:function () {
        return 0;
    }
});
cc.SortedObject = cc.SortableObject.extend({
    _objectID:0,
    ctor:function () {
        this._objectID = 0;
    },
    setObjectID:function (objectID) {
        this._objectID = objectID;
    },
    getObjectID:function () {
        return this._objectID;
    }
});
var _compareObject = function (val1, val2) {
    return (val1.getObjectID() - val2.getObjectID());
};
cc.ArrayForObjectSorting = cc.Class.extend({
    _saveObjectArr:null,
    ctor:function () {
        this._saveObjectArr = [];
    },
    insertSortedObject:function (addObject) {
        if(!addObject)
            throw "cc.ArrayForObjectSorting.insertSortedObject(): addObject should be non-null.";
        var idx = this.indexOfSortedObject(addObject);
        this.insertObject(addObject, idx);
    },
    removeSortedObject:function (delObject) {
        if (this.count() == 0) {
            return;
        }
        var idx = this.indexOfSortedObject(delObject);
        if (idx < this.count() && idx != cc.INVALID_INDEX) {
            var foundObj = this.objectAtIndex(idx);
            if (foundObj.getObjectID() == delObject.getObjectID()) {
                this.removeObjectAtIndex(idx);
            }
        }
    },
    setObjectID_ofSortedObject:function (tag, setObject) {
        var idx = this.indexOfSortedObject(setObject);
        if (idx < this.count() && idx != cc.INVALID_INDEX) {
            var foundObj = this.objectAtIndex(idx);
            if (foundObj.getObjectID() == setObject.getObjectID()) {
                this.removeObjectAtIndex(idx);
                foundObj.setObjectID(tag);
                this.insertSortedObject(foundObj);
            }
        }
    },
    objectWithObjectID:function (tag) {
        if (this.count() == 0) {
            return null;
        }
        var foundObj = new cc.SortedObject();
        foundObj.setObjectID(tag);
        var idx = this.indexOfSortedObject(foundObj);
        if (idx < this.count() && idx != cc.INVALID_INDEX) {
            foundObj = this.objectAtIndex(idx);
            if (foundObj.getObjectID() != tag)
                foundObj = null;
        }
        return foundObj;
    },
    getObjectWithObjectID:function (tag) {
        return null;
    },
    indexOfSortedObject:function (idxObj) {
        var idx = 0;
        if (idxObj) {
            var uPrevObjectID = 0;
            var uOfSortObjectID = idxObj.getObjectID();
            var locObjectArr = this._saveObjectArr;
            for (var i = 0; i < locObjectArr.length; i++) {
                var pSortableObj = locObjectArr[i];
                var curObjectID = pSortableObj.getObjectID();
                if ((uOfSortObjectID == curObjectID) ||
                    (uOfSortObjectID >= uPrevObjectID && uOfSortObjectID < curObjectID)) {
                    break;
                }
                uPrevObjectID = curObjectID;
                idx++;
            }
        } else {
            idx = cc.INVALID_INDEX;
        }
        return idx;
    },
    count:function () {
        return this._saveObjectArr.length;
    },
    lastObject:function () {
        var locObjectArr = this._saveObjectArr;
        if (locObjectArr.length == 0)
            return null;
        return locObjectArr[locObjectArr.length - 1];
    },
    objectAtIndex:function (idx) {
        return this._saveObjectArr[idx];
    },
    addObject:function (addObj) {
        this._saveObjectArr.push(addObj);
        this._saveObjectArr.sort(_compareObject);
    },
    removeObjectAtIndex:function (idx) {
        this._saveObjectArr.splice(idx, 1);
        this._saveObjectArr.sort(_compareObject);
    },
    insertObject:function (addObj, idx) {
        this._saveObjectArr.splice(idx, 0, addObj);
        this._saveObjectArr.sort(_compareObject);
    }
});
cc.TABLEVIEW_FILL_TOPDOWN = 0;
cc.TABLEVIEW_FILL_BOTTOMUP = 1;
cc.TableViewCell = cc.Node.extend({
    _idx:0,
    _className:"TableViewCell",
    getIdx:function () {
        return this._idx;
    },
    setIdx:function (idx) {
        this._idx = idx;
    },
    reset:function () {
        this._idx = cc.INVALID_INDEX;
    },
    setObjectID:function (idx) {
        this._idx = idx;
    },
    getObjectID:function () {
        return this._idx;
    }
});
var _p = cc.TableViewCell.prototype;
_p.objectId;
cc.defineGetterSetter(_p, "objectId", _p.getObjectID, _p.setObjectID);
_p = null;
cc.TableViewDelegate = cc.ScrollViewDelegate.extend({
    tableCellTouched:function (table, cell) {
    },
    tableCellHighlight:function(table, cell){
    },
    tableCellUnhighlight:function(table, cell){
    },
    tableCellWillRecycle:function(table, cell){
    }
});
cc.TableViewDataSource = cc.Class.extend({
    tableCellSizeForIndex:function(table, idx){
        return this.cellSizeForTable(table);
    },
    cellSizeForTable:function (table) {
        return cc.size(0,0);
    },
    tableCellAtIndex:function (table, idx) {
        return null;
    },
    numberOfCellsInTableView:function (table) {
        return 0;
    }
});
cc.TableView = cc.ScrollView.extend({
    _vOrdering:null,
    _indices:null,
    _cellsFreed:null,
    _dataSource:null,
    _tableViewDelegate:null,
    _oldDirection:null,
    _cellsPositions:null,
    _touchedCell:null,
    ctor:function (dataSource, size, container) {
        cc.ScrollView.prototype.ctor.call(this);
        this._oldDirection = cc.SCROLLVIEW_DIRECTION_NONE;
        this._cellsPositions = [];
        this.initWithViewSize(size, container);
        this.setDataSource(dataSource);
        this._updateCellPositions();
        this._updateContentSize();
    },
    __indexFromOffset:function (offset) {
        var low = 0;
        var high = this._dataSource.numberOfCellsInTableView(this) - 1;
        var search;
        switch (this.getDirection()) {
            case cc.SCROLLVIEW_DIRECTION_HORIZONTAL:
                search = offset.x;
                break;
            default:
                search = offset.y;
                break;
        }
        var locCellsPositions = this._cellsPositions;
        while (high >= low){
            var index = 0|(low + (high - low) / 2);
            var cellStart = locCellsPositions[index];
            var cellEnd = locCellsPositions[index + 1];
            if (search >= cellStart && search <= cellEnd){
                return index;
            } else if (search < cellStart){
                high = index - 1;
            }else {
                low = index + 1;
            }
        }
        if (low <= 0)
            return 0;
        return -1;
    },
    _indexFromOffset:function (offset) {
        var locOffset = {x: offset.x, y: offset.y};
        var locDataSource = this._dataSource;
        var maxIdx = locDataSource.numberOfCellsInTableView(this) - 1;
        if (this._vOrdering === cc.TABLEVIEW_FILL_TOPDOWN)
            locOffset.y = this.getContainer().getContentSize().height - locOffset.y;
        var index = this.__indexFromOffset(locOffset);
        if (index != -1) {
            index = Math.max(0, index);
            if (index > maxIdx)
                index = cc.INVALID_INDEX;
        }
        return index;
    },
    __offsetFromIndex:function (index) {
        var offset;
        switch (this.getDirection()) {
            case cc.SCROLLVIEW_DIRECTION_HORIZONTAL:
                offset = cc.p(this._cellsPositions[index], 0);
                break;
            default:
                offset = cc.p(0, this._cellsPositions[index]);
                break;
        }
        return offset;
    },
    _offsetFromIndex:function (index) {
        var offset = this.__offsetFromIndex(index);
        var cellSize = this._dataSource.tableCellSizeForIndex(this, index);
        if (this._vOrdering === cc.TABLEVIEW_FILL_TOPDOWN)
            offset.y = this.getContainer().getContentSize().height - offset.y - cellSize.height;
        return offset;
    },
    _updateCellPositions:function(){
        var cellsCount = this._dataSource.numberOfCellsInTableView(this);
        var locCellsPositions = this._cellsPositions;
        if (cellsCount > 0){
            var currentPos = 0;
            var cellSize, locDataSource = this._dataSource;
            for (var i=0; i < cellsCount; i++) {
                locCellsPositions[i] = currentPos;
                cellSize = locDataSource.tableCellSizeForIndex(this, i);
                switch (this.getDirection()) {
                    case cc.SCROLLVIEW_DIRECTION_HORIZONTAL:
                        currentPos += cellSize.width;
                        break;
                    default:
                        currentPos += cellSize.height;
                        break;
                }
            }
            this._cellsPositions[cellsCount] = currentPos;//1 extra value allows us to get right/bottom of the last cell
        }
    },
    _updateContentSize:function () {
        var size = cc.size(0, 0);
        var cellsCount = this._dataSource.numberOfCellsInTableView(this);
        if(cellsCount > 0){
            var maxPosition = this._cellsPositions[cellsCount];
            switch (this.getDirection()) {
                case cc.SCROLLVIEW_DIRECTION_HORIZONTAL:
                    size = cc.size(maxPosition, this._viewSize.height);
                    break;
                default:
                    size = cc.size(this._viewSize.width, maxPosition);
                    break;
            }
        }
        this.setContentSize(size);
        if (this._oldDirection != this._direction) {
            if (this._direction == cc.SCROLLVIEW_DIRECTION_HORIZONTAL) {
                this.setContentOffset(cc.p(0, 0));
            } else {
                this.setContentOffset(cc.p(0, this.minContainerOffset().y));
            }
            this._oldDirection = this._direction;
        }
    },
    _moveCellOutOfSight:function (cell) {
        if(this._tableViewDelegate && this._tableViewDelegate.tableCellWillRecycle)
            this._tableViewDelegate.tableCellWillRecycle(this, cell);
        this._cellsFreed.addObject(cell);
        this._cellsUsed.removeSortedObject(cell);
        cc.arrayRemoveObject(this._indices, cell.getIdx());
        cell.reset();
        if (cell.getParent() == this.getContainer()) {
            this.getContainer().removeChild(cell, true);
        }
    },
    _setIndexForCell:function (index, cell) {
        cell.setAnchorPoint(0, 0);
        cell.setPosition(this._offsetFromIndex(index));
        cell.setIdx(index);
    },
    _addCellIfNecessary:function (cell) {
        if (cell.getParent() != this.getContainer()) {
            this.getContainer().addChild(cell);
        }
        this._cellsUsed.insertSortedObject(cell);
        var locIndices = this._indices, addIdx = cell.getIdx();
        if(locIndices.indexOf(addIdx) == -1){
            locIndices.push(addIdx);
            locIndices.sort(function(a,b){return a-b;});
        }
    },
    getDataSource:function () {
        return this._dataSource;
    },
    setDataSource:function (source) {
        this._dataSource = source;
    },
    getDelegate:function () {
        return this._tableViewDelegate;
    },
    setDelegate:function (delegate) {
        this._tableViewDelegate = delegate;
    },
    setVerticalFillOrder:function (fillOrder) {
        if (this._vOrdering != fillOrder) {
            this._vOrdering = fillOrder;
            if (this._cellsUsed.count() > 0) {
                this.reloadData();
            }
        }
    },
    getVerticalFillOrder:function () {
        return this._vOrdering;
    },
    initWithViewSize:function (size, container) {
        if (cc.ScrollView.prototype.initWithViewSize.call(this, size, container)) {
            this._cellsUsed = new cc.ArrayForObjectSorting();
            this._cellsFreed = new cc.ArrayForObjectSorting();
            this._indices = [];
            this._tableViewDelegate = null;
            this._vOrdering = cc.TABLEVIEW_FILL_BOTTOMUP;
            this.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
            cc.ScrollView.prototype.setDelegate.call(this, this);
            return true;
        }
        return false;
    },
    updateCellAtIndex:function (idx) {
        if (idx == cc.INVALID_INDEX || idx > this._dataSource.numberOfCellsInTableView(this) - 1)
            return;
        var cell = this.cellAtIndex(idx);
        if (cell)
            this._moveCellOutOfSight(cell);
        cell = this._dataSource.tableCellAtIndex(this, idx);
        this._setIndexForCell(idx, cell);
        this._addCellIfNecessary(cell);
    },
    insertCellAtIndex:function (idx) {
        if (idx == cc.INVALID_INDEX || idx > this._dataSource.numberOfCellsInTableView(this) - 1)
            return;
        var newIdx, locCellsUsed = this._cellsUsed;
        var cell = locCellsUsed.objectWithObjectID(idx);
        if (cell) {
            newIdx = locCellsUsed.indexOfSortedObject(cell);
            for (var i = newIdx; i < locCellsUsed.count(); i++) {
                cell = locCellsUsed.objectAtIndex(i);
                this._setIndexForCell(cell.getIdx() + 1, cell);
            }
        }
        cell = this._dataSource.tableCellAtIndex(this, idx);
        this._setIndexForCell(idx, cell);
        this._addCellIfNecessary(cell);
        this._updateCellPositions();
        this._updateContentSize();
    },
    removeCellAtIndex:function (idx) {
        if (idx == cc.INVALID_INDEX || idx > this._dataSource.numberOfCellsInTableView(this) - 1)
            return;
        var cell = this.cellAtIndex(idx);
        if (!cell)
            return;
        var locCellsUsed = this._cellsUsed;
        var newIdx = locCellsUsed.indexOfSortedObject(cell);
        this._moveCellOutOfSight(cell);
        cc.arrayRemoveObject(this._indices, idx);
        this._updateCellPositions();
        for (var i = locCellsUsed.count() - 1; i > newIdx; i--) {
            cell = locCellsUsed.objectAtIndex(i);
            this._setIndexForCell(cell.getIdx() - 1, cell);
        }
    },
    reloadData:function () {
        this._oldDirection = cc.SCROLLVIEW_DIRECTION_NONE;
        var locCellsUsed = this._cellsUsed, locCellsFreed = this._cellsFreed, locContainer = this.getContainer();
        for (var i = 0, len = locCellsUsed.count(); i < len; i++) {
            var cell = locCellsUsed.objectAtIndex(i);
            if(this._tableViewDelegate && this._tableViewDelegate.tableCellWillRecycle)
                this._tableViewDelegate.tableCellWillRecycle(this, cell);
            locCellsFreed.addObject(cell);
            cell.reset();
            if (cell.getParent() == locContainer)
                locContainer.removeChild(cell, true);
        }
        this._indices = [];
        this._cellsUsed = new cc.ArrayForObjectSorting();
        this._updateCellPositions();
        this._updateContentSize();
        if (this._dataSource.numberOfCellsInTableView(this) > 0)
            this.scrollViewDidScroll(this);
    },
    dequeueCell:function () {
        if (this._cellsFreed.count() === 0) {
            return null;
        } else {
            var cell = this._cellsFreed.objectAtIndex(0);
            this._cellsFreed.removeObjectAtIndex(0);
            return cell;
        }
    },
    cellAtIndex:function (idx) {
        var i = this._indices.indexOf(idx);
        if (i == -1)
            return null;
        return this._cellsUsed.objectWithObjectID(idx);
    },
    scrollViewDidScroll:function (view) {
        var locDataSource = this._dataSource;
        var countOfItems = locDataSource.numberOfCellsInTableView(this);
        if (0 === countOfItems)
            return;
        if (this._tableViewDelegate != null && this._tableViewDelegate.scrollViewDidScroll)
            this._tableViewDelegate.scrollViewDidScroll(this);
        var  idx = 0, locViewSize = this._viewSize, locContainer = this.getContainer();
        var offset = this.getContentOffset();
        offset.x *= -1;
        offset.y *= -1;
        var maxIdx = Math.max(countOfItems-1, 0);
        if (this._vOrdering === cc.TABLEVIEW_FILL_TOPDOWN)
            offset.y = offset.y + locViewSize.height/locContainer.getScaleY();
        var startIdx = this._indexFromOffset(offset);
        if (startIdx === cc.INVALID_INDEX)
            startIdx = countOfItems - 1;
        if (this._vOrdering === cc.TABLEVIEW_FILL_TOPDOWN)
            offset.y -= locViewSize.height/locContainer.getScaleY();
        else
            offset.y += locViewSize.height/locContainer.getScaleY();
        offset.x += locViewSize.width/locContainer.getScaleX();
        var endIdx = this._indexFromOffset(offset);
        if (endIdx === cc.INVALID_INDEX)
            endIdx = countOfItems - 1;
        var cell, locCellsUsed = this._cellsUsed;
        if (locCellsUsed.count() > 0) {
            cell = locCellsUsed.objectAtIndex(0);
            idx = cell.getIdx();
            while (idx < startIdx) {
                this._moveCellOutOfSight(cell);
                if (locCellsUsed.count() > 0) {
                    cell = locCellsUsed.objectAtIndex(0);
                    idx = cell.getIdx();
                } else
                    break;
            }
        }
        if (locCellsUsed.count() > 0) {
            cell = locCellsUsed.lastObject();
            idx = cell.getIdx();
            while (idx <= maxIdx && idx > endIdx) {
                this._moveCellOutOfSight(cell);
                if (locCellsUsed.count() > 0) {
                    cell = locCellsUsed.lastObject();
                    idx = cell.getIdx();
                } else
                    break;
            }
        }
        var locIndices = this._indices;
        for (var i = startIdx; i <= endIdx; i++) {
            if (locIndices.indexOf(i) != -1)
                continue;
            this.updateCellAtIndex(i);
        }
    },
    scrollViewDidZoom:function (view) {
    },
    onTouchEnded:function (touch, event) {
        if (!this.isVisible())
            return;
        if (this._touchedCell){
            var bb = this.getBoundingBox();
            var tmpOrigin = cc.p(bb.x, bb.y);
            tmpOrigin = this._parent.convertToWorldSpace(tmpOrigin);
            bb.x = tmpOrigin.x;
            bb.y = tmpOrigin.y;
            var locTableViewDelegate = this._tableViewDelegate;
            if (cc.rectContainsPoint(bb, touch.getLocation()) && locTableViewDelegate != null){
                if(locTableViewDelegate.tableCellUnhighlight)
                    locTableViewDelegate.tableCellUnhighlight(this, this._touchedCell);
                if(locTableViewDelegate.tableCellTouched)
                    locTableViewDelegate.tableCellTouched(this, this._touchedCell);
            }
            this._touchedCell = null;
        }
        cc.ScrollView.prototype.onTouchEnded.call(this, touch, event);
    },
    onTouchBegan:function(touch, event){
        if (!this.isVisible())
            return false;
        var touchResult = cc.ScrollView.prototype.onTouchBegan.call(this, touch, event);
        if(this._touches.length === 1) {
            var index, point;
            point = this.getContainer().convertTouchToNodeSpace(touch);
            index = this._indexFromOffset(point);
            if (index === cc.INVALID_INDEX)
                this._touchedCell = null;
            else
                this._touchedCell  = this.cellAtIndex(index);
            if (this._touchedCell && this._tableViewDelegate != null && this._tableViewDelegate.tableCellHighlight)
                this._tableViewDelegate.tableCellHighlight(this, this._touchedCell);
        } else if(this._touchedCell) {
            if(this._tableViewDelegate != null && this._tableViewDelegate.tableCellUnhighlight)
                this._tableViewDelegate.tableCellUnhighlight(this, this._touchedCell);
            this._touchedCell = null;
        }
        return touchResult;
    },
    onTouchMoved: function(touch, event){
        cc.ScrollView.prototype.onTouchMoved.call(this, touch, event);
        if (this._touchedCell && this.isTouchMoved()) {
            if(this._tableViewDelegate != null && this._tableViewDelegate.tableCellUnhighlight)
                this._tableViewDelegate.tableCellUnhighlight(this, this._touchedCell);
            this._touchedCell = null;
        }
    },
    onTouchCancelled: function(touch, event){
        cc.ScrollView.prototype.onTouchCancelled.call(this, touch, event);
        if (this._touchedCell) {
            if(this._tableViewDelegate != null && this._tableViewDelegate.tableCellUnhighlight)
                this._tableViewDelegate.tableCellUnhighlight(this, this._touchedCell);
            this._touchedCell = null;
        }
    }
});
var _p = cc.TableView.prototype;
_p.dataSource;
cc.defineGetterSetter(_p, "dataSource", _p.getDataSource, _p.setDataSource);
_p.delegate;
cc.defineGetterSetter(_p, "delegate", _p.getDelegate, _p.setDelegate);
_p.verticalFillOrder;
cc.defineGetterSetter(_p, "verticalFillOrder", _p.getVerticalFillOrder, _p.setVerticalFillOrder);
_p = null;
cc.TableView.create = function (dataSource, size, container) {
    return new cc.TableView(dataSource, size, container);
};
