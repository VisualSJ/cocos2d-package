cc.ProtectedNode = cc.NodeRGBA.extend({_protectedChildren: null, _reorderProtectedChildDirty: !1, _insertProtectedChild: function (a, b) {
    this._reorderProtectedChildDirty = !0;
    this._protectedChildren.push(a);
    a._setLocalZOrder(b)
}, ctor: function () {
    cc.NodeRGBA.prototype.ctor.call(this);
    this._protectedChildren = []
}, addProtectedChild: function (a, b, c) {
    cc.assert(null != a, "child must be non-nil");
    cc.assert(!a.parent, "child already added. It can't be added again");
    b = b || a.getLocalZOrder();
    c && a.setTag(c);
    this._insertProtectedChild(a,
        b);
    a.setParent(this);
    a.setOrderOfArrival(cc.s_globalOrderOfArrival);
    if (this._running && (a.onEnter(), this._isTransitionFinished))a.onEnterTransitionDidFinish();
    this._cascadeColorEnabled && this._enableCascadeColor();
    this._cascadeOpacityEnabled && this._enableCascadeOpacity()
}, getProtectedChildByTag: function (a) {
    cc.assert(a != cc.NODE_TAG_INVALID, "Invalid tag");
    for (var b = this._protectedChildren, c = 0, d = b.length; c < d; c++)if (b.getTag() == a)return b[c];
    return null
}, removeProtectedChild: function (a, b) {
    null == b && (b = !0);
    var c = this._protectedChildren;
    if (0 !== c.length) {
        var d = c.indexOf(a);
        -1 < d && (this._running && (a.onExitTransitionDidStart(), a.onExit()), b && a.cleanup(), a.setParent(null), c.splice(d, 1))
    }
}, removeProtectedChildByTag: function (a, b) {
    cc.assert(a != cc.NODE_TAG_INVALID, "Invalid tag");
    null == b && (b = !0);
    var c = this.getProtectedChildByTag(a);
    null == c ? cc.log("cocos2d: removeChildByTag(tag \x3d %d): child not found!", a) : this.removeProtectedChild(c, b)
}, removeAllProtectedChildren: function () {
    this.removeAllProtectedChildrenWithCleanup(!0)
},
    removeAllProtectedChildrenWithCleanup: function (a) {
        null == a && (a = !0);
        for (var b = this._protectedChildren, c = 0, d = b.length; c < d; c++) {
            var e = b[c];
            this._running && (e.onExitTransitionDidStart(), e.onExit());
            a && e.cleanup();
            e.setParent(null)
        }
        b.length = 0
    }, reorderProtectedChild: function (a, b) {
        cc.assert(null != a, "Child must be non-nil");
        this._reorderProtectedChildDirty = !0;
        a.setOrderOfArrival(cc.s_globalOrderOfArrival++);
        a._setLocalZOrder(b)
    }, sortAllProtectedChildren: function () {
        if (this._reorderProtectedChildDirty) {
            var a =
                this._protectedChildren, b = a.length, c, d, e;
            for (c = 1; c < b; c++) {
                e = a[c];
                for (d = c - 1; 0 <= d;) {
                    if (e._localZOrder < a[d]._localZOrder)a[d + 1] = a[d]; else if (e._localZOrder === a[d]._localZOrder && e.arrivalOrder < a[d].arrivalOrder)a[d + 1] = a[d]; else break;
                    d--
                }
                a[d + 1] = e
            }
            this._reorderProtectedChildDirty = !1
        }
    }, visit: null, _visitForCanvas: function (a) {
        if (this._visible) {
            a = a || cc._renderContext;
            var b, c, d = this._children, e, f = this._protectedChildren, g = this._children.length, h = f.length;
            a.save();
            this.transform(a);
            this.sortAllChildren();
            this.sortAllProtectedChildren();
            for (b = 0; b < g; b++)if (e = d[b], 0 > e._localZOrder)e.visit(a); else break;
            for (c = 0; c < h; c++)if (e = f[c], 0 > e._localZOrder)e.visit(a); else break;
            for (this.draw(a); b < g; b++)d[b] && d[b].visit(a);
            for (; c < h; c++)f[b] && f[b].visit(a);
            this._cacheDirty = !1;
            this.arrivalOrder = 0;
            a.restore()
        }
    }, _visitForWebGL: function () {
        if (this._visible) {
            var a = cc._renderContext, b, c = cc.current_stack, d;
            c.stack.push(c.top);
            cc.kmMat4Assign(this._stackMatrix, c.top);
            c.top = this._stackMatrix;
            var e = this.grid;
            e && e._active && e.beforeDraw();
            this.transform();
            var f =
                this._children, g = this._protectedChildren, h = f.length, k = g.length;
            this.sortAllChildren();
            this.sortAllProtectedChildren();
            for (b = 0; b < h; b++)if (f[b] && 0 > f[b]._localZOrder)f[b].visit(); else break;
            for (d = 0; d < k; d++)if (g[d] && 0 > g[d]._localZOrder)g[d].visit(); else break;
            for (this.draw(a); b < h; b++)f[b] && f[b].visit();
            for (; d < k; d++)g[d] && g[d].visit();
            this.arrivalOrder = 0;
            e && e._active && e.afterDraw(this);
            c.top = c.stack.pop()
        }
    }, cleanup: function () {
        cc.Node.prototype.cleanup.call(this);
        for (var a = this._protectedChildren, b = 0, c =
            a.length; b < c; b++)a[b].cleanup()
    }, onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        for (var a = this._protectedChildren, b = 0, c = a.length; b < c; b++)a[b].onEnter()
    }, onEnterTransitionDidFinish: function () {
        cc.Node.prototype.onEnterTransitionDidFinish.call(this);
        for (var a = this._protectedChildren, b = 0, c = a.length; b < c; b++)a[b].onEnterTransitionDidFinish()
    }, onExit: function () {
        cc.Node.prototype.onExit.call(this);
        for (var a = this._protectedChildren, b = 0, c = a.length; b < c; b++)a[b].onExit()
    }, onExitTransitionDidStart: function () {
        cc.Node.prototype.onExitTransitionDidStart.call(this);
        for (var a = this._protectedChildren, b = 0, c = a.length; b < c; b++)a[b].onExitTransitionDidStart()
    }, updateDisplayedOpacity: function (a) {
        this._displayedOpacity = this._realOpacity * a / 255;
        this._updateColor();
        if (this._cascadeOpacityEnabled) {
            var b, c = this._children, d = this._displayedOpacity;
            a = 0;
            for (b = c.length; a < b; a++)c[a].updateDisplayedOpacity && c[a].updateDisplayedOpacity(d);
            c = this._protectedChildren;
            a = 0;
            for (b = c.length; a < b; a++)c[a].updateDisplayedOpacity && c[a].updateDisplayedOpacity(d)
        }
    }, updateDisplayedColor: function (a) {
        var b =
            this._displayedColor, c = this._realColor;
        b.r = c.r * a.r / 255;
        b.g = c.g * a.g / 255;
        b.b = c.b * a.b / 255;
        this._updateColor();
        if (this._cascadeColorEnabled) {
            var d = this._children;
            a = 0;
            for (c = d.length; a < c; a++)d[a].updateDisplayedColor && d[a].updateDisplayedColor(b);
            d = this._protectedChildren;
            a = 0;
            for (c = d.length; a < c; a++)d[a].updateDisplayedColor && d[a].updateDisplayedColor(b)
        }
    }, disableCascadeColor: function () {
        var a = cc.color.WHITE, b, c, d = this._children;
        b = 0;
        for (c = d.length; b < c; b++)d[b].updateDisplayedColor(a);
        d = this._protectedChildren;
        b = 0;
        for (c = d.length; b < c; b++)d[b].updateDisplayedColor(a)
    }});
cc.ProtectedNode.prototype.visit = cc._renderType === cc._RENDER_TYPE_CANVAS ? cc.ProtectedNode.prototype._visitForCanvas : cc.ProtectedNode.prototype._visitForWebGL;
cc.ProtectedNode.create = function () {
    return new cc.ProtectedNode
};
var ccui = ccui || {};
ccui.Class = ccui.Class || cc.Class;
ccui.Class.extend = ccui.Class.extend || cc.Class.extend;
ccui.Node = ccui.Node || cc.Node;
ccui.Node.extend = ccui.Node.extend || cc.Node.extend;
ccui.NodeRGBA = ccui.NodeRGBA || cc.NodeRGBA;
ccui.NodeRGBA.extend = ccui.NodeRGBA.extend || cc.NodeRGBA.extend;
ccui.ProtectedNode = ccui.ProtectedNode || cc.ProtectedNode;
ccui.ProtectedNode.extend = ccui.ProtectedNode.extend || cc.ProtectedNode.extend;
ccui.cocosGUIVersion = "CocosGUI v1.0.0.0";
ccui.Widget = cc.ProtectedNode.extend({_enabled: !0, _bright: !0, _touchEnabled: !1, _brightStyle: null, _updateEnabled: !1, _touchBeganPosition: null, _touchMovePosition: null, _touchEndPosition: null, _touchEventListener: null, _touchEventSelector: null, _name: "default", _widgetType: null, _actionTag: 0, _size: cc.size(0, 0), _customSize: null, _layoutParameterDictionary: null, _layoutParameterType: 0, _focused: !1, _focusEnabled: !0, _ignoreSize: !1, _affectByClipping: !1, _sizeType: null, _sizePercent: null, positionType: null, _positionPercent: null,
    _reorderWidgetChildDirty: !1, _hitted: !1, _nodes: null, _touchListener: null, _color: null, _className: "Widget", _flippedX: !1, _flippedY: !1, _opacity: 255, _highlight: !1, _touchEventCallback: null, ctor: function () {
        cc.ProtectedNode.prototype.ctor.call(this);
        this._brightStyle = ccui.Widget.BRIGHT_STYLE_NONE;
        this._touchBeganPosition = cc.p(0, 0);
        this._touchMovePosition = cc.p(0, 0);
        this._touchEndPosition = cc.p(0, 0);
        this._widgetType = ccui.Widget.TYPE_WIDGET;
        this._size = cc.size(0, 0);
        this._customSize = cc.size(0, 0);
        this._layoutParameterDictionary =
        {};
        this._sizeType = ccui.Widget.SIZE_ABSOLUTE;
        this._sizePercent = cc.p(0, 0);
        this.positionType = ccui.Widget.POSITION_ABSOLUTE;
        this._positionPercent = cc.p(0, 0);
        this._nodes = [];
        this._color = cc.color(255, 255, 255, 255);
        this._layoutParameterType = ccui.LayoutParameter.NONE;
        this.init()
    }, init: function () {
        return cc.ProtectedNode.prototype.init.call(this) ? (this._layoutParameterDictionary = {}, this.initRenderer(), this.setBright(!0), this.onFocusChanged = this.onFocusChange.bind(this), this.onNextFocusedWidget = null, this.setAnchorPoint(cc.p(0.5,
            0.5)), this.ignoreContentAdaptWithSize(!0), this.setCascadeColorEnabled(!0), this.setCascadeOpacityEnabled(!0), !0) : !1
    }, onEnter: function () {
        this.updateSizeAndPosition();
        cc.ProtectedNode.prototype.onEnter.call(this)
    }, onExit: function () {
        this.unscheduleUpdate();
        cc.ProtectedNode.prototype.onExit.call(this)
    }, visit: function (a) {
        this._visible && (this.adaptRenderers(), cc.ProtectedNode.prototype.visit.call(this, a))
    }, getWidgetParent: function () {
        var a = this.getParent();
        return a instanceof ccui.Widget ? a : null
    }, _updateContentSizeWithTextureSize: function (a) {
        var b =
            this._size;
        this._ignoreSize ? (b.width = a.width, b.height = a.height) : (b.width = this._customSize.width, b.height = this._customSize.height);
        this.onSizeChanged()
    }, _isAncestorsEnabled: function () {
        var a = this._getAncensterWidget(this);
        return null == a ? !0 : a && !a.isEnabled() ? !1 : a._isAncestorsEnabled()
    }, _getAncensterWidget: function (a) {
        if (null == a)return null;
        a = a.getParent();
        return null == a ? null : a instanceof ccui.Widget ? a : this._getAncensterWidget(a.getParent())
    }, _isAncestorsVisible: function (a) {
        return null == a ? !0 : (a = a.getParent()) && !a.isVisible() ? !1 : this._isAncestorsVisible(a)
    }, _cleanupWidget: function () {
        this._eventDispatcher.removeEventListener(this._touchListener);
        this._focusedWidget == this && (this._focusedWidget = null)
    }, setEnabled: function (a) {
        this._enabled = a
    }, initRenderer: function () {
    }, addNode: function (a, b, c) {
        a instanceof ccui.Widget ? cc.log("Please use addChild to add a Widget.") : (cc.Node.prototype.addChild.call(this, a, b, c), this._nodes.push(a))
    }, getNodeByTag: function (a) {
        for (var b = this._nodes, c = 0; c < b.length; c++) {
            var d = b[c];
            if (d &&
                d.getTag() == a)return d
        }
        return null
    }, getNodes: function () {
        return this._nodes
    }, removeNode: function (a, b) {
        cc.Node.prototype.removeChild.call(this, a);
        cc.arrayRemoveObject(this._nodes, a)
    }, removeNodeByTag: function (a, b) {
        var c = this.getNodeByTag(a);
        c ? this.removeNode(c) : cc.log("cocos2d: removeNodeByTag(tag \x3d %d): child not found!", a)
    }, removeAllNodes: function () {
        for (var a = 0; a < this._nodes.length; a++)cc.Node.prototype.removeChild.call(this, this._nodes[a]);
        this._nodes.length = 0
    }, setSize: function (a) {
        var b = this._customSize.width =
            a.width;
        a = this._customSize.height = a.height;
        this._ignoreSize && (b = this.width, a = this.height);
        this._size.width = b;
        this._size.height = a;
        this._running && ((a = this.getWidgetParent()) ? (b = a.width, a = a.height) : (b = this._parent.width, a = this._parent.height), this._sizePercent.x = 0 < b ? this._customSize.width / b : 0, this._sizePercent.y = 0 < a ? this._customSize.height / a : 0);
        this.onSizeChanged()
    }, _setWidth: function (a) {
        a = this._customSize.width = a;
        this._ignoreSize && (a = this.width);
        this._size.width = a;
        this._running && (a = (a = this.getWidgetParent()) ?
            a.width : this._parent.width, this._sizePercent.x = 0 < a ? this._customSize.width / a : 0);
        this.onSizeChanged()
    }, _setHeight: function (a) {
        a = this._customSize.height = a;
        this._ignoreSize && (a = this.height);
        this._size.height = a;
        this._running && (a = (a = this.getWidgetParent()) ? a.height : this._parent.height, this._sizePercent.y = 0 < a ? this._customSize.height / a : 0);
        this.onSizeChanged()
    }, setSizePercent: function (a) {
        this._sizePercent.x = a.x;
        this._sizePercent.y = a.y;
        var b = this._customSize.width, c = this._customSize.height;
        this._running && ((c =
            this.getWidgetParent()) ? (b = c.width * a.x, c = c.height * a.y) : (b = this._parent.width * a.x, c = this._parent.height * a.y));
        this._ignoreSize || (this._size.width = b, this._size.height = c);
        this._customSize.width = b;
        this._customSize.height = c;
        this.onSizeChanged()
    }, _setWidthPercent: function (a) {
        this._sizePercent.x = a;
        var b = this._customSize.width;
        this._running && (b = this.getWidgetParent(), b = (b ? b.width : this._parent.width) * a);
        this._ignoreSize || (this._size.width = b);
        this._customSize.width = b;
        this.onSizeChanged()
    }, _setHeightPercent: function (a) {
        this._sizePercent.y =
            a;
        var b = this._customSize.height;
        this._running && (b = this.getWidgetParent(), b = (b ? b.height : this._parent.height) * a);
        this._ignoreSize || (this._size.height = b);
        this._customSize.height = b;
        this.onSizeChanged()
    }, updateSizeAndPosition: function (a) {
        a || (a = (a = this.getWidgetParent()) ? a.getLayoutSize() : this._parent.getContentSize());
        var b;
        switch (this._sizeType) {
            case ccui.Widget.SIZE_ABSOLUTE:
                b = this._ignoreSize ? this.getContentSize() : this._customSize;
                this._size.width = b.width;
                this._size.height = b.height;
                var c = b = 0;
                0 < a.width &&
                (b = this._customSize.width / a.width);
                0 < a.height && (c = this._customSize.height / a.height);
                this._sizePercent.x = b;
                this._sizePercent.y = c;
                break;
            case ccui.Widget.SIZE_PERCENT:
                c = cc.size(a.width * this._sizePercent.x, a.height * this._sizePercent.y), b = this._ignoreSize ? this.getVirtualRendererSize() : c, this._size.width = b.width, this._size.height = b.height, this._customSize.width = c.width, this._customSize.height = c.height
        }
        this.onSizeChanged();
        b = this.getPosition();
        switch (this.positionType) {
            case ccui.Widget.POSITION_ABSOLUTE:
                0 >=
                a.width || 0 >= a.height ? (this._positionPercent.x = 0, this._positionPercent.y = 0) : (this._positionPercent.x = b.x / a.width, this._positionPercent.y = b.y / a.height);
                break;
            case ccui.Widget.POSITION_PERCENT:
                b = cc.p(a.width * this._positionPercent.x, a.height * this._positionPercent.y)
        }
        this.setPosition(b)
    }, setSizeType: function (a) {
        this._sizeType = a
    }, getSizeType: function () {
        return this._sizeType
    }, ignoreContentAdaptWithSize: function (a) {
        this._ignoreSize != a && (a = (this._ignoreSize = a) ? this.getContentSize() : this._customSize, this._size.width =
            a.width, this._size.height = a.height, this.onSizeChanged())
    }, isIgnoreContentAdaptWithSize: function () {
        return this._ignoreSize
    }, getSize: function () {
        return cc.size(this._size)
    }, getCustomSize: function () {
        return cc.size(this._customSize)
    }, getLayoutSize: function () {
        return cc.size(this._size)
    }, getSizePercent: function () {
        return cc.p(this._sizePercent)
    }, _getWidthPercent: function () {
        return this._sizePercent.x
    }, _getHeightPercent: function () {
        return this._sizePercent.y
    }, getWorldPosition: function () {
        return this.convertToWorldSpace(cc.p(this._anchorPoint.x *
            this._contentSize.width, this._anchorPoint.y * this._contentSize.height))
    }, getVirtualRenderer: function () {
        return this
    }, getVirtualRendererSize: function () {
        return cc.size(this._contentSize)
    }, onSizeChanged: function () {
        this.setContentSize(this._size);
        for (var a = this.getChildren(), b = 0, c = a.length; b < c; b++) {
            var d = a[b];
            d instanceof ccui.Widget && d.updateSizeAndPosition()
        }
    }, getContentSize: function () {
        return this._size
    }, _getWidth: function () {
        return this._size.width
    }, _getHeight: function () {
        return this._size.height
    }, setTouchEnabled: function (a) {
        this._touchEnabled !==
        a && ((this._touchEnabled = a) ? (this._touchListener = cc.EventListener.create({event: cc.EventListener.TOUCH_ONE_BY_ONE, swallowTouches: !0, onTouchBegan: this.onTouchBegan.bind(this), onTouchMoved: this.onTouchMoved.bind(this), onTouchEnded: this.onTouchEnded.bind(this)}), cc.eventManager.addListener(this._touchListener, this)) : cc.eventManager.removeListener(this._touchListener))
    }, isTouchEnabled: function () {
        return this._touchEnabled
    }, isHighlighted: function () {
        return this._highlight
    }, setHighlighted: function (a) {
        if (a !=
            this._highlight)if (this._highlight = a, this._bright)this._highlight ? this.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT) : this.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL); else this.onPressStateChangedToDisabled()
    }, setUpdateEnabled: function (a) {
        this._updateEnabled != a && ((this._updateEnabled = a) ? this.scheduleUpdate() : this.unscheduleUpdate())
    }, isUpdateEnabled: function () {
        return this._updateEnabled
    }, isFocused: function () {
        return this._focused
    }, setFocused: function (a) {
        if (this._focused = a)this._focusedWidget =
            this
    }, isFocusEnabled: function () {
        return this._focusEnabled
    }, setFocusEnabled: function (a) {
        this._focused = a
    }, findNextFocusedWidget: function (a, b) {
        if (null == this.onNextFocusedWidget || null == this.onNextFocusedWidget(a)) {
            var c = b instanceof ccui.Layout;
            if (this.isFocused() || c) {
                var d = this.getParent();
                return null == d ? c ? b.findNextFocusedWidget(a, b) : b : d.findNextFocusedWidget(a, b)
            }
            return b
        }
        c = this.onNextFocusedWidget(a);
        this.dispatchFocusEvent(this, c);
        return c
    }, requestFocus: function () {
        this != this._focusedWidget && this.dispatchFocusEvent(this._focusedWidget,
            this)
    }, getCurrentFocusedWidget: function () {
        return this._focusedWidget
    }, enableDpadNavigation: function (a) {
    }, onFocusChanged: null, onNextFocusedWidget: null, interceptTouchEvent: function (a, b, c) {
        var d = this.getWidgetParent();
        d && d.interceptTouchEvent(a, b, c)
    }, onFocusChange: function (a, b) {
        a && a.setFocused(!1);
        b && b.setFocused(!0)
    }, dispatchFocusEvent: function (a, b) {
        a && !a.isFocused() && (a = this._focusedWidget);
        if (b != a) {
            if (b && b.onFocusChanged)b.onFocusChanged(a, b);
            if (a && b.onFocusChanged)a.onFocusChanged(a, b);
            cc.eventManager.dispatchEvent(new cc.EventFocus(a,
                b))
        }
    }, setBright: function (a) {
        if (this._bright = a)this._brightStyle = ccui.Widget.BRIGHT_STYLE_NONE, this.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL); else this.onPressStateChangedToDisabled()
    }, setBrightStyle: function (a) {
        if (this._brightStyle != a)switch (this._brightStyle = a = a || ccui.Widget.BRIGHT_STYLE_NORMAL, this._brightStyle) {
            case ccui.Widget.BRIGHT_STYLE_NORMAL:
                this.onPressStateChangedToNormal();
                break;
            case ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT:
                this.onPressStateChangedToPressed()
        }
    }, onPressStateChangedToNormal: function () {
    },
    onPressStateChangedToPressed: function () {
    }, onPressStateChangedToDisabled: function () {
    }, didNotSelectSelf: function () {
    }, onTouchBegan: function (a, b) {
        this._hitted = !1;
        if (this.isVisible() && this.isEnabled() && this._isAncestorsEnabled() && this._isAncestorsVisible(this)) {
            var c = a.getLocation();
            this._touchBeganPosition.x = c.x;
            this._touchBeganPosition.y = c.y;
            this.hitTest(this._touchBeganPosition) && this.isClippingParentContainsPoint(this._touchBeganPosition) && (this._hitted = !0)
        }
        if (!this._hitted)return!1;
        this.setHighlighted(!0);
        (c = this.getWidgetParent()) && c.interceptTouchEvent(ccui.Widget.TOUCH_BAGAN, this, a);
        this.pushDownEvent();
        return!0
    }, onTouchMoved: function (a, b) {
        var c = a.getLocation();
        this._touchMovePosition.x = c.x;
        this._touchMovePosition.y = c.y;
        this.setHighlighted(this.hitTest(c));
        (c = this.getWidgetParent()) && c.interceptTouchEvent(ccui.Widget.TOUCH_MOVED, this, a);
        this.moveEvent()
    }, onTouchEnded: function (a, b) {
        var c = a.getLocation();
        this._touchEndPosition.x = c.x;
        this._touchEndPosition.y = c.y;
        (c = this.getWidgetParent()) && c.interceptTouchEvent(ccui.Widget.TOUCH_ENDED,
            this, a);
        c = this._highlight;
        this.setHighlighted(!1);
        c ? this.releaseUpEvent() : this.cancelUpEvent()
    }, onTouchCancelled: function (a) {
        this.setHighlighted(!1);
        this.cancelUpEvent()
    }, onTouchLongClicked: function (a) {
        this.longClickEvent()
    }, pushDownEvent: function () {
        this._touchEventCallback && this._touchEventCallback(this, ccui.Widget.TOUCH_BAGAN);
        this._touchEventListener && this._touchEventSelector && this._touchEventSelector.call(this._touchEventListener, this, ccui.Widget.TOUCH_BEGAN)
    }, moveEvent: function () {
        this._touchEventCallback &&
        this._touchEventCallback(this, ccui.Widget.TOUCH_MOVED);
        this._touchEventListener && this._touchEventSelector && this._touchEventSelector.call(this._touchEventListener, this, ccui.Widget.TOUCH_MOVED)
    }, releaseUpEvent: function () {
        this._touchEventCallback && this._touchEventCallback(this, ccui.Widget.TOUCH_ENDED);
        this._touchEventListener && this._touchEventSelector && this._touchEventSelector.call(this._touchEventListener, this, ccui.Widget.TOUCH_ENDED)
    }, cancelUpEvent: function () {
        this._touchEventCallback && this._touchEventCallback(this,
            ccui.Widget.TOUCH_CANCELED);
        this._touchEventListener && this._touchEventSelector && this._touchEventSelector.call(this._touchEventListener, this, ccui.Widget.TOUCH_CANCELED)
    }, longClickEvent: function () {
    }, addTouchEventListener: function (a, b) {
        void 0 === b ? this._touchEventCallback = a : (this._touchEventSelector = a, this._touchEventListener = b)
    }, hitTest: function (a) {
        var b = cc.rect(0, 0, this._contentSize.width, this._contentSize.height);
        return cc.rectContainsPoint(b, this.convertToNodeSpace(a))
    }, isClippingParentContainsPoint: function (a) {
        this._affectByClipping = !1;
        for (var b = this.getParent(), c = null; b;) {
            if (b instanceof ccui.Layout && b.isClippingEnabled()) {
                this._affectByClipping = !0;
                c = b;
                break
            }
            b = b.getParent()
        }
        return!this._affectByClipping ? !0 : c ? c.hitTest(a) ? c.isClippingParentContainsPoint(a) : !1 : !0
    }, clippingParentAreaContainPoint: function (a) {
        cc.log("clippingParentAreaContainPoint is deprecated. Please use isClippingParentContainsPoint instead.");
        this.isClippingParentContainsPoint(a)
    }, checkChildInfo: function (a, b, c) {
        var d = this.getWidgetParent();
        d && d.checkChildInfo(a,
            b, c)
    }, setPosition: function (a, b) {
        if (this._running) {
            var c = this.getWidgetParent();
            c && (c = c.getSize(), 0 >= c.width || 0 >= c.height ? (this._positionPercent.x = 0, this._positionPercent.y = 0) : b ? (this._positionPercent.x = a / c.width, this._positionPercent.y = b / c.height) : (this._positionPercent.x = a.x / c.width, this._positionPercent.y = a.y / c.height))
        }
        cc.Node.prototype.setPosition.call(this, a, b)
    }, setPositionX: function (a) {
        if (this._running) {
            var b = this.getWidgetParent();
            b && (b = b.width, this._positionPercent.x = 0 >= b ? 0 : a / b)
        }
        cc.Node.prototype.setPositionX.call(this,
            a)
    }, setPositionY: function (a) {
        if (this._running) {
            var b = this.getWidgetParent();
            b && (b = b.height, this._positionPercent.y = 0 >= b ? 0 : a / b)
        }
        cc.Node.prototype.setPositionY.call(this, a)
    }, setPositionPercent: function (a) {
        this._positionPercent = a;
        if (this._running && (a = this.getWidgetParent()))a = a.getSize(), this.setPosition(a.width * this._positionPercent.x, a.height * this._positionPercent.y)
    }, _setXPercent: function (a) {
        this._positionPercent.x = a;
        if (this._running) {
            var b = this.getWidgetParent();
            b && this.setPositionX(b.width * a)
        }
    },
    _setYPercent: function (a) {
        this._positionPercent.y = a;
        if (this._running) {
            var b = this.getWidgetParent();
            b && this.setPositionY(b.height * a)
        }
    }, updateAnchorPoint: function () {
        this.setAnchorPoint(this.getAnchorPoint())
    }, getPositionPercent: function () {
        return cc.p(this._positionPercent)
    }, _getXPercent: function () {
        return this._positionPercent.x
    }, _getYPercent: function () {
        return this._positionPercent.y
    }, setPositionType: function (a) {
        this.positionType = a
    }, getPositionType: function () {
        return this.positionType
    }, setFlippedX: function (a) {
        this._flippedX =
            a;
        this.updateFlippedX()
    }, isFlippedX: function () {
        return this._flippedX
    }, setFlippedY: function (a) {
        this._flippedY = a;
        this.updateFlippedY()
    }, isFlippedY: function () {
        return this._flippedY
    }, updateFlippedX: function () {
    }, updateFlippedY: function () {
    }, adaptRenderers: function () {
    }, isBright: function () {
        return this._bright
    }, isEnabled: function () {
        return this._enabled
    }, getLeftBoundary: function () {
        return this.getPositionX() - this._getAnchorX() * this._size.width
    }, getBottomBoundary: function () {
        return this.getPositionY() - this._getAnchorY() *
            this._size.height
    }, getRightBoundary: function () {
        return this.getLeftBoundary() + this._size.width
    }, getTopBoundary: function () {
        return this.getBottomBoundary() + this._size.height
    }, getTouchStartPos: function () {
        cc.log("getTouchStartPos is deprecated. Please use getTouchBeganPosition instead.");
        return this.getTouchBeganPosition()
    }, getTouchBeganPosition: function () {
        return cc.p(this._touchBeganPosition)
    }, getTouchMovePos: function () {
        cc.log("getTouchMovePos is deprecated. Please use getTouchMovePosition instead.");
        return this.getTouchMovePosition()
    }, getTouchMovePosition: function () {
        return cc.p(this._touchMovePosition)
    }, getTouchEndPos: function () {
        cc.log("getTouchEndPos is deprecated. Please use getTouchEndPosition instead.");
        return this.getTouchEndPosition()
    }, getTouchEndPosition: function () {
        return cc.p(this._touchEndPosition)
    }, setName: function (a) {
        this._name = a
    }, getName: function () {
        return this._name
    }, getWidgetType: function () {
        return this._widgetType
    }, setLayoutParameter: function (a) {
        a && (this._layoutParameterDictionary[a.getLayoutType()] =
            a, this._layoutParameterType = a.getLayoutType())
    }, getLayoutParameter: function (a) {
        a = a || this._layoutParameterType;
        return this._layoutParameterDictionary[a]
    }, getDescription: function () {
        return"Widget"
    }, clone: function () {
        var a = this.createCloneInstance();
        a.copyProperties(this);
        a.copyClonedWidgetChildren(this);
        return a
    }, createCloneInstance: function () {
        return ccui.Widget.create()
    }, copyClonedWidgetChildren: function (a) {
        a = a.getChildren();
        for (var b = 0; b < a.length; b++) {
            var c = a[b];
            c instanceof ccui.Widget && this.addChild(c.clone())
        }
    },
    copySpecialProperties: function (a) {
    }, copyProperties: function (a) {
        this.setEnabled(a.isEnabled());
        this.setVisible(a.isVisible());
        this.setBright(a.isBright());
        this.setTouchEnabled(a.isTouchEnabled());
        this.setLocalZOrder(a.getLocalZOrder());
        this.setUpdateEnabled(a.isUpdateEnabled());
        this.setTag(a.getTag());
        this.setName(a.getName());
        this.setActionTag(a.getActionTag());
        this._ignoreSize.width = a._ignoreSize.width;
        this._ignoreSize.height = a._ignoreSize.height;
        this._size.width = a._size.width;
        this._size.height =
            a._size.height;
        this._customSize.width = a._customSize.width;
        this._customSize.height = a._customSize.height;
        this.copySpecialProperties(a);
        this._sizeType = a.getSizeType();
        this._sizePercent.x = a._sizePercent.x;
        this._sizePercent.y = a._sizePercent.y;
        this.positionType = a.positionType;
        this._positionPercent.x = a._positionPercent.x;
        this._positionPercent.y = a._positionPercent.y;
        this.setPosition(a.getPosition());
        this.setAnchorPoint(a.getAnchorPoint());
        this.setScaleX(a.getScaleX());
        this.setScaleY(a.getScaleY());
        this.setRotation(a.getRotation());
        this.setRotationX(a.getRotationX());
        this.setRotationY(a.getRotationY());
        this.setFlippedX(a.isFlippedX());
        this.setFlippedY(a.isFlippedY());
        this.setColor(a.getColor());
        this.setOpacity(a.getOpacity());
        this._touchEventCallback = a._touchEventCallback;
        this._touchEventListener = a._touchEventListener;
        this._touchEventSelector = a._touchEventSelector;
        this._focused = a._focused;
        this._focusEnabled = a._focusEnabled;
        for (var b in a._layoutParameterDictionary) {
            var c = a._layoutParameterDictionary[b];
            c && this.setLayoutParameter(c.clone())
        }
        this.onSizeChanged()
    },
    setActionTag: function (a) {
        this._actionTag = a
    }, getActionTag: function () {
        return this._actionTag
    }, getColor: function () {
        return cc.color(this._color.r, this._color.g, this._color.b, this._color.a)
    }, setOpacity: function (a) {
        a !== this._color.a && (this._color.a = a, this.updateTextureOpacity(a))
    }, getOpacity: function () {
        return this._displayedOpacity
    }, updateTextureOpacity: function (a) {
        for (var b in this._children) {
            var c = this._children[b];
            c && c.RGBAProtocol && c.setOpacity(a)
        }
    }, updateColorToRenderer: function (a) {
        a.RGBAProtocol &&
        a.setColor(this._color)
    }, updateOpacityToRenderer: function (a) {
        a.RGBAProtocol && a.setOpacity(this._color.a)
    }, updateRGBAToRenderer: function (a) {
        a.setColor(this._color);
        a.setOpacity(this._opacity)
    }});
var _p = ccui.Widget.prototype;
cc.defineGetterSetter(_p, "xPercent", _p._getXPercent, _p._setXPercent);
cc.defineGetterSetter(_p, "yPercent", _p._getYPercent, _p._setYPercent);
cc.defineGetterSetter(_p, "widthPercent", _p._getWidthPercent, _p._setWidthPercent);
cc.defineGetterSetter(_p, "heightPercent", _p._getHeightPercent, _p._setHeightPercent);
cc.defineGetterSetter(_p, "widgetParent", _p.getWidgetParent);
cc.defineGetterSetter(_p, "enabled", _p.isEnabled, _p.setEnabled);
cc.defineGetterSetter(_p, "focused", _p.isFocused, _p.setFocused);
cc.defineGetterSetter(_p, "sizeType", _p.getSizeType, _p.setSizeType);
cc.defineGetterSetter(_p, "widgetType", _p.getWidgetType);
cc.defineGetterSetter(_p, "touchEnabled", _p.isTouchEnabled, _p.setTouchEnabled);
cc.defineGetterSetter(_p, "updateEnabled", _p.isUpdateEnabled, _p.setUpdateEnabled);
cc.defineGetterSetter(_p, "bright", _p.isBright, _p.setBright);
cc.defineGetterSetter(_p, "name", _p.getName, _p.setName);
cc.defineGetterSetter(_p, "actionTag", _p.getActionTag, _p.setActionTag);
cc.defineGetterSetter(_p, "opacity", _p.getOpacity, _p.setOpacity);
_p = null;
ccui.Widget.create = function () {
    return new ccui.Widget
};
ccui.Widget.BRIGHT_STYLE_NONE = -1;
ccui.Widget.BRIGHT_STYLE_NORMAL = 0;
ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT = 1;
ccui.Widget.TYPE_WIDGET = 0;
ccui.Widget.TYPE_CONTAINER = 1;
ccui.Widget.LEFT = 0;
ccui.Widget.RIGHT = 1;
ccui.Widget.UP = 0;
ccui.Widget.DOWN = 1;
ccui.Widget.LOCAL_TEXTURE = 0;
ccui.Widget.PLIST_TEXTURE = 1;
ccui.Widget.TOUCH_BEGAN = 0;
ccui.Widget.TOUCH_MOVED = 1;
ccui.Widget.TOUCH_ENDED = 2;
ccui.Widget.TOUCH_CANCELED = 3;
ccui.Widget.SIZE_ABSOLUTE = 0;
ccui.Widget.SIZE_PERCENT = 1;
ccui.Widget.POSITION_ABSOLUTE = 0;
ccui.Widget.POSITION_PERCENT = 1;
cc.EventFocus = cc.Event.extend({_widgetGetFocus: null, _widgetLoseFocus: null, ctor: function (a, b) {
    this._widgetGetFocus = b;
    this._widgetLoseFocus = a
}});
ccui.Layout = ccui.Widget.extend({_clippingEnabled: !1, _backGroundScale9Enabled: null, _backGroundImage: null, _backGroundImageFileName: null, _backGroundImageCapInsets: null, _colorType: null, _bgImageTexType: ccui.Widget.LOCAL_TEXTURE, _colorRender: null, _gradientRender: null, _color: null, _startColor: null, _endColor: null, _alongVector: null, _opacity: 255, _backGroundImageTextureSize: null, _layoutType: null, _doLayoutDirty: !0, _clippingRectDirty: !0, _clippingType: null, _clippingStencil: null, _handleScissor: !1, _scissorRectDirty: !1,
    _clippingRect: null, _clippingParent: null, _className: "Layout", _backGroundImageColor: null, _finalPositionX: 0, _finalPositionY: 0, _currentStencilEnabled: 0, _currentStencilWriteMask: 0, _currentStencilFunc: 0, _currentStencilRef: 0, _currentStencilValueMask: 0, _currentStencilFail: 0, _currentStencilPassDepthFail: 0, _currentStencilPassDepthPass: 0, _currentDepthWriteMask: 0, _currentAlphaTestEnabled: 0, _currentAlphaTestFunc: 0, _currentAlphaTestRef: 0, _backGroundImageOpacity: 0, _mask_layer_le: 0, _loopFocus: !1, _passFocusToChild: !1,
    _isFocusPassing: !1, ctor: function () {
        this._layoutType = ccui.Layout.ABSOLUTE;
        this._widgetType = ccui.Widget.TYPE_CONTAINER;
        this._clippingType = ccui.Layout.CLIPPING_STENCIL;
        this._colorType = ccui.Layout.BG_COLOR_NONE;
        ccui.Widget.prototype.ctor.call(this);
        this._backGroundImageCapInsets = cc.rect(0, 0, 0, 0);
        this._color = cc.color(255, 255, 255, 255);
        this._startColor = cc.color(255, 255, 255, 255);
        this._endColor = cc.color(255, 255, 255, 255);
        this._alongVector = cc.p(0, -1);
        this._backGroundImageTextureSize = cc.size(0, 0);
        this._clippingRect =
            cc.rect(0, 0, 0, 0);
        this._backGroundImageColor = cc.color(255, 255, 255, 255)
    }, onEnter: function () {
        ccui.Widget.prototype.onEnter.call(this);
        if (this._clippingStencil)this._clippingStencil.onEnter();
        this._clippingRectDirty = this._doLayoutDirty = !0
    }, onExit: function () {
        ccui.Widget.prototype.onExit.call(this);
        if (this._clippingStencil)this._clippingStencil.onExit()
    }, setLoopFocus: function (a) {
        this._loopFocus = a
    }, isLoopFocus: function () {
        return this._loopFocus
    }, setPassFocusToChild: function (a) {
        this._passFocusToChild = a
    }, isPassFocusToChild: function () {
        return this._passFocusToChild
    },
    findNextFocusedWidget: function (a, b) {
        if (this._isFocusPassing || this.isFocused()) {
            var c = this.getParent();
            this._isFocusPassing = !1;
            if (this._passFocusToChild) {
                var d = this._passFocusToChild(a, b);
                return d instanceof ccui.Layout && c ? (c._isFocusPassing = !0, c.findNextFocusedWidget(a, this)) : d
            }
            if (null == c)return this;
            c._isFocusPassing = !0;
            return c.findNextFocusedWidget(a, this)
        }
        if (b.isFocused() || b instanceof ccui.Layout)if (this._layoutType == ccui.Layout.LINEAR_HORIZONTAL)switch (a) {
            case ccui.Widget.LEFT:
                return this._getPreviousFocusedWidget(a,
                    b);
            case ccui.Widget.RIGHT:
                return this._getNextFocusedWidget(a, b);
            case ccui.Widget.DOWN:
            case ccui.Widget.UP:
                return this._isLastWidgetInContainer(this, a) ? this._isWidgetAncestorSupportLoopFocus(b, a) ? this.findNextFocusedWidget(a, this) : b : this.findNextFocusedWidget(a, this);
            default:
                return cc.assert(0, "Invalid Focus Direction"), b
        } else if (this._layoutType == ccui.Layout.LINEAR_VERTICAL)switch (a) {
            case ccui.Widget.LEFT:
            case ccui.Widget.RIGHT:
                return this._isLastWidgetInContainer(this, a) ? this._isWidgetAncestorSupportLoopFocus(b,
                    a) ? this.findNextFocusedWidget(a, this) : b : this.findNextFocusedWidget(a, this);
            case ccui.Widget.DOWN:
                return this._getNextFocusedWidget(a, b);
            case ccui.Widget.UP:
                return this._getPreviousFocusedWidget(a, b);
            default:
                return cc.assert(0, "Invalid Focus Direction"), b
        } else return cc.assert(0, "Un Supported Layout type, please use VBox and HBox instead!!!"), b; else return b
    }, onPassFocusToChild: null, init: function () {
        return ccui.Widget.prototype.init.call(this) ? (this.ignoreContentAdaptWithSize(!1), this.setSize(cc.size(0,
            0)), this.setAnchorPoint(0, 0), this.onPassFocusToChild = this._findNearestChildWidgetIndex.bind(this), !0) : !1
    }, __stencilDraw: function (a) {
        a = a || cc._renderContext;
        for (var b = this._clippingStencil, c = cc.view.getScaleX(), d = cc.view.getScaleY(), e = 0; e < b._buffer.length; e++) {
            var f = b._buffer[e].verts, g = f[0];
            a.beginPath();
            a.moveTo(g.x * c, -g.y * d);
            for (var g = 1, h = f.length; g < h; g++)a.lineTo(f[g].x * c, -f[g].y * d)
        }
    }, addChild: function (a, b, c) {
        a instanceof ccui.Widget && this.supplyTheLayoutParameterLackToChild(a);
        ccui.Widget.prototype.addChild.call(this,
            a, b, c);
        this._doLayoutDirty = !0
    }, removeChild: function (a, b) {
        ccui.Widget.prototype.removeChild.call(this, a, b);
        this._doLayoutDirty = !0
    }, removeAllChildren: function (a) {
        ccui.Widget.prototype.removeAllChildren.call(this, a);
        this._doLayoutDirty = !0
    }, removeAllChildrenWithCleanup: function (a) {
        ccui.Widget.prototype.removeAllChildrenWithCleanup(a);
        this._doLayoutDirty = !0
    }, isClippingEnabled: function () {
        return this._clippingEnabled
    }, visit: function (a) {
        if (this._visible)if (this.adaptRenderers(), this._doLayout(), this._clippingEnabled)switch (this._clippingType) {
            case ccui.Layout.CLIPPING_STENCIL:
                this.stencilClippingVisit(a);
                break;
            case ccui.Layout.CLIPPING_SCISSOR:
                this.scissorClippingVisit(a)
        } else ccui.Widget.prototype.visit.call(this, a)
    }, sortAllChildren: function () {
        ccui.Widget.prototype.sortAllChildren.call(this);
        this._doLayout()
    }, stencilClippingVisit: null, _stencilClippingVisitForWebGL: function (a) {
        var b = a || cc._renderContext;
        if (this._clippingStencil && this._clippingStencil.isVisible())if (ccui.Layout._layer = -1, ccui.Layout._layer + 1 == cc.stencilBits)ccui.Layout._visit_once = !0, ccui.Layout._visit_once && (cc.log("Nesting more than " +
            cc.stencilBits + "stencils is not supported. Everything will be drawn without stencil for this node and its childs."), ccui.Layout._visit_once = !1), cc.Node.prototype.visit.call(this, a); else {
            ccui.Layout._layer++;
            var c = 1 << ccui.Layout._layer, d = c | c - 1;
            a = b.isEnabled(b.STENCIL_TEST);
            var e = b.getParameter(b.STENCIL_WRITEMASK), f = b.getParameter(b.STENCIL_FUNC), g = b.getParameter(b.STENCIL_REF), h = b.getParameter(b.STENCIL_VALUE_MASK), k = b.getParameter(b.STENCIL_FAIL), m = b.getParameter(b.STENCIL_PASS_DEPTH_FAIL), l = b.getParameter(b.STENCIL_PASS_DEPTH_PASS);
            b.enable(b.STENCIL_TEST);
            b.stencilMask(c);
            var p = b.getParameter(b.DEPTH_WRITEMASK);
            b.depthMask(!1);
            b.stencilFunc(b.NEVER, c, c);
            b.stencilOp(b.ZERO, b.KEEP, b.KEEP);
            cc._drawingUtil.drawSolidRect(cc.p(0, 0), cc.pFromSize(cc.director.getWinSize()), cc.color(255, 255, 255, 255));
            b.stencilFunc(b.NEVER, c, c);
            b.stencilOp(b.REPLACE, b.KEEP, b.KEEP);
            cc.kmGLPushMatrix();
            this.transform();
            this._clippingStencil.visit();
            b.depthMask(p);
            b.stencilFunc(b.EQUAL, d, d);
            b.stencilOp(b.KEEP, b.KEEP, b.KEEP);
            d = c = 0;
            this.sortAllChildren();
            this.sortAllProtectedChildren();
            for (var p = this._children, q = this._protectedChildren, r = p.length, s = q.length, n; c < r; c++)if ((n = p[c]) && 0 > n.getLocalZOrder())n.visit(); else break;
            for (; d < s; d++)if ((n = q[d]) && 0 > n.getLocalZOrder())n.visit(); else break;
            for (this.draw(); c < r; c++)p[c].visit();
            for (; d < s; d++)q[d].visit();
            b.stencilFunc(f, g, h);
            b.stencilOp(k, m, l);
            b.stencilMask(e);
            a || b.disable(b.STENCIL_TEST);
            ccui.Layout._layer--;
            cc.kmGLPopMatrix()
        }
    }, _stencilClippingVisitForCanvas: function (a) {
        if (this._clippingStencil && this._clippingStencil.isVisible()) {
            a =
                a || cc._renderContext;
            if (this._cangodhelpme() || this._clippingStencil instanceof cc.Sprite) {
                var b = a.canvas, c = ccui.Layout._getSharedCache();
                c.width = b.width;
                c.height = b.height;
                c.getContext("2d").drawImage(b, 0, 0);
                a.save();
                cc.Node.prototype.visit.call(this, a);
                a.globalCompositeOperation = "destination-in";
                this.transform(a);
                this._clippingStencil.visit();
                a.restore();
                a.save();
                a.setTransform(1, 0, 0, 1, 0, 0);
                a.globalCompositeOperation = "destination-over";
                a.drawImage(c, 0, 0)
            } else {
                var c = this._children, d;
                a.save();
                this.transform(a);
                this._clippingStencil.visit(a);
                a.clip();
                this._cangodhelpme(!0);
                this.sortAllChildren();
                this.sortAllProtectedChildren();
                for (var e, f = this._protectedChildren, g = c.length, h = f.length, b = 0; b < g; b++)if ((d = c[b]) && 0 > d._localZOrder)d.visit(a); else break;
                for (e = 0; e < h; e++)if ((d = f[e]) && 0 > d._localZOrder)d.visit(a); else break;
                for (; b < g; b++)c[b].visit(a);
                for (; e < h; e++)f[e].visit(a);
                this._cangodhelpme(!1)
            }
            a.restore()
        }
    }, _godhelpme: !1, _cangodhelpme: function (a) {
        if (!0 === a || !1 === a)cc.ClippingNode.prototype._godhelpme = a;
        return cc.ClippingNode.prototype._godhelpme
    },
    scissorClippingVisit: null, _scissorClippingVisitForWebGL: function (a) {
        var b = this.getClippingRect();
        a = a || cc._renderContext;
        this._handleScissor && a.enable(a.SCISSOR_TEST);
        cc.view.setScissorInPoints(b.x, b.y, b.width, b.height);
        cc.Node.prototype.visit.call(this);
        this._handleScissor && a.disable(a.SCISSOR_TEST)
    }, setClippingEnabled: function (a) {
        if (a != this._clippingEnabled)switch (this._clippingEnabled = a, this._clippingType) {
            case ccui.Layout.CLIPPING_STENCIL:
                if (a) {
                    this._clippingStencil = cc.DrawNode.create();
                    cc._renderType ===
                    cc._RENDER_TYPE_CANVAS && (this._clippingStencil.draw = this.__stencilDraw.bind(this));
                    if (this._running)this._clippingStencil.onEnter();
                    this.setStencilClippingSize(this._contentSize)
                } else {
                    if (this._running)this._clippingStencil.onExit();
                    this._clippingStencil = null
                }
        }
    }, setClippingType: function (a) {
        if (a != this._clippingType) {
            var b = this.isClippingEnabled();
            this.setClippingEnabled(!1);
            this._clippingType = a;
            this.setClippingEnabled(b)
        }
    }, getClippingType: function () {
        return this._clippingType
    }, setStencilClippingSize: function (a) {
        if (this._clippingEnabled &&
            this._clippingType == ccui.Layout.CLIPPING_STENCIL) {
            var b = [];
            b[0] = cc.p(0, 0);
            b[1] = cc.p(a.width, 0);
            b[2] = cc.p(a.width, a.height);
            b[3] = cc.p(0, a.height);
            a = cc.color.GREEN;
            this._clippingStencil.clear();
            this._clippingStencil.drawPoly(b, 4, a, 0, a)
        }
    }, rendererVisitCallBack: function () {
        this._doLayout()
    }, getClippingRect: function () {
        if (this._clippingRectDirty) {
            var a = this.convertToWorldSpace(cc.p(0, 0)), b = this.nodeToWorldTransform(), c = this._contentSize.width * b.a, b = this._contentSize.height * b.d, d;
            d = this;
            for (var e = !1; d;)if ((d =
                d.getParent()) && d instanceof ccui.Layout && d.isClippingEnabled())if (e || (this._clippingParent = d, e = !0), d._clippingType == ccui.Layout.CLIPPING_SCISSOR) {
                this._handleScissor = !1;
                break
            }
            if (this._clippingParent) {
                d = this._clippingParent.getClippingRect();
                var e = a.x - c * this._anchorPoint.x, f = a.y - b * this._anchorPoint.y, g = c, h = b, k = a.x - d.x;
                0 > k && (e = d.x, g += k);
                c = a.x + c - (d.x + d.width);
                0 < c && (g -= c);
                c = a.y + b - (d.y + d.height);
                0 < c && (h -= c);
                a = a.y - d.y;
                0 > a && (f = d.x, h += a);
                0 > g && (g = 0);
                0 > h && (h = 0);
                this._clippingRect.x = e;
                this._clippingRect.y =
                    f;
                this._clippingRect.width = g;
                this._clippingRect.height = h
            } else this._clippingRect.x = a.x - c * this._anchorPoint.x, this._clippingRect.y = a.y - b * this._anchorPoint.y, this._clippingRect.width = c, this._clippingRect.height = b;
            this._clippingRectDirty = !1
        }
        return this._clippingRect
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this.setStencilClippingSize(this._contentSize);
        this._clippingRectDirty = this._doLayoutDirty = !0;
        this._backGroundImage && (this._backGroundImage.setPosition(0.5 * this._contentSize.width,
                0.5 * this._contentSize.height), this._backGroundScale9Enabled && this._backGroundImage instanceof cc.Scale9Sprite && this._backGroundImage.setPreferredSize(this._contentSize));
        this._colorRender && this._colorRender.setContentSize(this._contentSize);
        this._gradientRender && this._gradientRender.setContentSize(this._contentSize)
    }, setBackGroundImageScale9Enabled: function (a) {
        this._backGroundScale9Enabled != a && (this.removeProtectedChild(this._backGroundImage), this._backGroundImage = null, this._backGroundScale9Enabled =
            a, this.addBackGroundImage(), this.setBackGroundImage(this._backGroundImageFileName, this._bgImageTexType), this.setBackGroundImageCapInsets(this._backGroundImageCapInsets))
    }, isBackGroundImageScale9Enabled: function () {
        return this._backGroundScale9Enabled
    }, setBackGroundImage: function (a, b) {
        if (a) {
            b = b || ccui.Widget.LOCAL_TEXTURE;
            null == this._backGroundImage && this.addBackGroundImage();
            this._backGroundImageFileName = a;
            this._bgImageTexType = b;
            if (this._backGroundScale9Enabled) {
                var c = this._backGroundImage;
                switch (this._bgImageTexType) {
                    case ccui.Widget.LOCAL_TEXTURE:
                        c.initWithFile(a);
                        break;
                    case ccui.Widget.PLIST_TEXTURE:
                        c.initWithSpriteFrameName(a)
                }
                c.setPreferredSize(this._contentSize)
            } else switch (c = this._backGroundImage, this._bgImageTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    c.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    c.setSpriteFrame(a)
            }
            this._backGroundImageTextureSize = this._backGroundImage.getContentSize();
            this._backGroundImage.setPosition(this._contentSize.width / 2, this._contentSize.height / 2);
            this._updateBackGroundImageColor()
        }
    }, setBackGroundImageCapInsets: function (a) {
        this._backGroundImageCapInsets =
            a;
        this._backGroundScale9Enabled && this._backGroundImage.setCapInsets(a)
    }, getBackGroundImageCapInsets: function () {
        return this._backGroundImageCapInsets
    }, supplyTheLayoutParameterLackToChild: function (a) {
        if (a)switch (this._layoutType) {
            case ccui.Layout.LINEAR_HORIZONTAL:
            case ccui.Layout.LINEAR_VERTICAL:
                var b = a.getLayoutParameter(ccui.LayoutParameter.LINEAR);
                b || a.setLayoutParameter(ccui.LinearLayoutParameter.create());
                break;
            case ccui.Layout.RELATIVE:
                (b = a.getLayoutParameter(ccui.LayoutParameter.RELATIVE)) ||
                a.setLayoutParameter(ccui.RelativeLayoutParameter.create())
        }
    }, addBackGroundImage: function () {
        this._backGroundScale9Enabled ? (this._backGroundImage = cc.Scale9Sprite.create(), this._backGroundImage.setPreferredSize(this._contentSize)) : this._backGroundImage = cc.Sprite.create();
        this.addProtectedChild(this._backGroundImage, ccui.Layout.BACKGROUND_IMAGE_ZORDER, -1);
        this._backGroundImage.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
    }, removeBackGroundImage: function () {
        this._backGroundImage && (this.removeProtectedChild(this._backGroundImage),
            this._backGroundImage = null, this._backGroundImageFileName = "", this._backGroundImageTextureSize = cc.size(0, 0))
    }, setBackGroundColorType: function (a) {
        if (this._colorType != a) {
            switch (this._colorType) {
                case ccui.Layout.BG_COLOR_NONE:
                    this._colorRender && (this.removeProtectedChild(this._colorRender), this._colorRender = null);
                    this._gradientRender && (this.removeProtectedChild(this._gradientRender), this._gradientRender = null);
                    break;
                case ccui.Layout.BG_COLOR_SOLID:
                    this._colorRender && (this.removeProtectedChild(this._colorRender),
                        this._colorRender = null);
                    break;
                case ccui.Layout.BG_COLOR_GRADIENT:
                    this._gradientRender && (this.removeProtectedChild(this._gradientRender), this._gradientRender = null)
            }
            this._colorType = a;
            switch (this._colorType) {
                case ccui.Layout.BG_COLOR_SOLID:
                    this._colorRender = cc.LayerColor.create();
                    this._colorRender.setContentSize(this._contentSize);
                    this._colorRender.setOpacity(this._opacity);
                    this._colorRender.setColor(this._color);
                    this.addProtectedChild(this._colorRender, ccui.Layout.BACKGROUND_RENDERER_ZORDER, -1);
                    break;
                case ccui.Layout.BG_COLOR_GRADIENT:
                    this._gradientRender = cc.LayerGradient.create(cc.color(255, 0, 0, 255), cc.color(0, 255, 0, 255)), this._gradientRender.setContentSize(this._contentSize), this._gradientRender.setOpacity(this._opacity), this._gradientRender.setStartColor(this._startColor), this._gradientRender.setEndColor(this._endColor), this._gradientRender.setVector(this._alongVector), this.addProtectedChild(this._gradientRender, ccui.Layout.BACKGROUND_RENDERER_ZORDER, -1)
            }
        }
    }, getBackGroundColorType: function () {
        return this._colorType
    },
    setBackGroundColor: function (a, b) {
        b ? (this._startColor.r = a.r, this._startColor.g = a.g, this._startColor.b = a.b, this._gradientRender && this._gradientRender.setStartColor(a), this._endColor = b, this._gradientRender && this._gradientRender.setEndColor(b)) : (this._color.r = a.r, this._color.g = a.g, this._color.b = a.b, this._colorRender && this._colorRender.setColor(a))
    }, getBackGroundColor: function () {
        var a = this._color;
        return cc.color(a.r, a.g, a.b, a.a)
    }, getBackGroundStartColor: function () {
        var a = this._startColor;
        return cc.color(a.r,
            a.g, a.b, a.a)
    }, getBackGroundEndColor: function () {
        var a = this._endColor;
        return cc.color(a.r, a.g, a.b, a.a)
    }, setBackGroundColorOpacity: function (a) {
        this._opacity = a;
        switch (this._colorType) {
            case ccui.Layout.BG_COLOR_SOLID:
                this._colorRender.setOpacity(a);
                break;
            case ccui.Layout.BG_COLOR_GRADIENT:
                this._gradientRender.setOpacity(a)
        }
    }, getBackGroundColorOpacity: function () {
        return this._opacity
    }, setBackGroundColorVector: function (a) {
        this._alongVector.x = a.x;
        this._alongVector.y = a.y;
        this._gradientRender && this._gradientRender.setVector(a)
    },
    getBackGroundColorVector: function () {
        return this._alongVector
    }, setBackGroundImageColor: function (a) {
        this._backGroundImageColor.r = a.r;
        this._backGroundImageColor.g = a.g;
        this._backGroundImageColor.b = a.b;
        this._updateBackGroundImageColor()
    }, setBackGroundImageOpacity: function (a) {
        this._backGroundImageColor.a = a;
        this.getBackGroundImageColor()
    }, getBackGroundImageColor: function () {
        var a = this._backGroundImageColor;
        return cc.color(a.r, a.g, a.b, a.a)
    }, getBackGroundImageOpacity: function () {
        return this._backGroundImageColor.a
    },
    _updateBackGroundImageColor: function () {
        this._backGroundImage && this._backGroundImage.setColor(this._backGroundImageColor)
    }, getBackGroundImageTextureSize: function () {
        return this._backGroundImageTextureSize
    }, setLayoutType: function (a) {
        this._layoutType = a;
        a = this._children;
        for (var b = null, c = 0; c < a.length; c++)b = a[c], b instanceof ccui.Widget && this.supplyTheLayoutParameterLackToChild(b);
        this._doLayoutDirty = !0
    }, getLayoutType: function () {
        return this._layoutType
    }, requestDoLayout: function () {
        this._doLayoutDirty = !0
    },
    _doLayout: function () {
        if (this._doLayoutDirty) {
            var a = this._createLayoutManager();
            a && a._doLayout(this);
            this._doLayoutDirty = !1
        }
    }, _createLayoutManager: function () {
        var a = null;
        switch (this._layoutType) {
            case ccui.Layout.LINEAR_VERTICAL:
                a = ccui.LinearVerticalLayoutManager.create();
                break;
            case ccui.Layout.LINEAR_HORIZONTAL:
                a = ccui.LinearHorizontalLayoutManager.create();
                break;
            case ccui.Layout.RELATIVE:
                a = ccui.RelativeLayoutManager.create()
        }
        return a
    }, _getLayoutContentSize: function () {
        return this.getContentSize()
    }, _getLayoutElements: function () {
        return this.getChildren()
    },
    _onBeforeVisitStencil: function () {
    }, _drawFullScreenQuadClearStencil: function () {
    }, _onAfterDrawStencil: function () {
    }, _onAfterVisitStencil: function () {
    }, _onAfterVisitScissor: function () {
    }, _onAfterVisitScissor: function () {
    }, _updateBackGroundImageOpacity: function () {
        this._backGroundImage && this._backGroundImage.setOpacity(this._backGroundImageOpacity)
    }, _updateBackGroundImageRGBA: function () {
        this._backGroundImage && (this._backGroundImage.setColor(this._backGroundImageColor), this._backGroundImage.setOpacity(this._backGroundImageOpacity))
    },
    _getLayoutAccumulatedSize: function () {
        for (var a = this.getChildren(), b = cc.size(0, 0), c = 0, d, e = 0, f = a.length; e < f; e++)if (d = a[e], null != d && d instanceof ccui.Layout)d = d._getLayoutAccumulatedSize(), b.width += d.width, b.height += d.height; else if (d instanceof ccui.Widget) {
            c++;
            var g = w.getLayoutParameter().getMargin();
            d = w.getContentSize();
            b.width += d.width + 0.5 * (g.right + g.left);
            b.height += d.height + 0.5 * (g.top + g.bottom)
        }
        a = this.getLayoutType();
        a == ccui.Layout.LINEAR_HORIZONTAL && (b.height -= b.height / c * (c - 1));
        a == ccui.Layout.LINEAR_VERTICAL &&
        (b.width -= b.width / c * (c - 1));
        return b
    }, _findNearestChildWidgetIndex: function (a, b) {
        if (null == b || b == this)return this._findFirstFocusEnabledWidgetIndex();
        var c = 0, d = this.getChildren(), e = d.length, f, g = cc.FLT_MAX, h = 0;
        if (a == ccui.Widget.LEFT || a == ccui.Widget.RIGHT || a == ccui.Widget.DOWN || a == ccui.Widget.UP) {
            for (f = this._getWorldCenterPoint(b); c < e;) {
                var k = d[c];
                k && (k instanceof ccui.Widget && k.isFocusEnabled()) && (k = k instanceof ccui.Layout ? k._calculateNearestDistance(b) : cc.pLength(cc.pSub(this._getWorldCenterPoint(k),
                    f)), k < g && (h = c, g = k));
                c++
            }
            return h
        }
        cc.assert(0, "invalid focus direction!");
        return 0
    }, _findFarestChildWidgetIndex: function (a, b) {
        if (null == b || b == this)return this._findFirstFocusEnabledWidgetIndex();
        var c = 0, d = this.getChildren().size(), e = -cc.FLT_MAX, f = 0;
        if (a == ccui.Widget.LEFT || a == ccui.Widget.RIGHT || a == ccui.Widget.DOWN || a == ccui.Widget.UP) {
            for (var g = this._getWorldCenterPoint(b); c < d;) {
                if (w && w instanceof ccui.Widget && w.isFocusEnabled()) {
                    var h = w instanceof ccui.Layout ? w._calculateFarestDistance(b) : cc.pLength(cc.pSub(this._getWorldCenterPoint(w),
                        g));
                    h > e && (f = c, e = h)
                }
                c++
            }
            return f
        }
        cc.assert(0, "invalid focus direction!!!");
        return 0
    }, _calculateNearestDistance: function (a) {
        for (var b = cc.FLT_MAX, c = this._getWorldCenterPoint(a), d = this._children, e = 0, f = d.length; e < f; e++) {
            var g = d[e];
            if (g instanceof ccui.Layout)g = g._calculateNearestDistance(a); else if (g instanceof ccui.Widget && g.isFocusEnabled())g = cc.pLength(cc.pSub(this._getWorldCenterPoint(g), c)); else continue;
            g < b && (b = g)
        }
        return b
    }, _calculateFarestDistance: function (a) {
        for (var b = -cc.FLT_MAX, c = this._getWorldCenterPoint(a),
                 d = this._children, e = 0, f = d.length; e < f; e++) {
            var g = d[e];
            if (g instanceof ccui.Layout)g = g._calculateFarestDistance(a); else if (g instanceof ccui.Widget && g.isFocusEnabled())g = this._getWorldCenterPoint(w), g = cc.pLength(cc.pSub(g, c)); else continue;
            g > b && (b = g)
        }
        return b
    }, _findProperSearchingFunctor: function (a, b) {
        if (null != b) {
            var c = this._getWorldCenterPoint(b), d = this._getWorldCenterPoint(this._findFirstNonLayoutWidget());
            a == ccui.Widget.LEFT ? this.onPassFocusToChild = c.x > d.x ? this._findNearestChildWidgetIndex.bind(this) :
                this._findFarestChildWidgetIndex.bind(this) : a == ccui.Widget.RIGHT ? this.onPassFocusToChild = c.x > d.x ? this._findFarestChildWidgetIndex.bind(this) : this._findNearestChildWidgetIndex.bind(this) : a == ccui.Widget.DOWN ? this.onPassFocusToChild = c.y > d.y ? this._findNearestChildWidgetIndex.bind(this) : this._findFarestChildWidgetIndex.bind(this) : a == ccui.Widget.UP ? this.onPassFocusToChild = c.y < d.y ? this._findNearestChildWidgetIndex.bind(this) : this._findFarestChildWidgetIndex.bind(this) : cc.assert(0, "invalid direction!")
        }
    },
    _findFirstNonLayoutWidget: function () {
        for (var a = this._children, b = 0, c = a.length; b < c; b++) {
            var d = a[b];
            if (d instanceof ccui.Layout) {
                if (d = d._findFirstNonLayoutWidget())return d
            } else if (d instanceof cc.Widget)return d
        }
        return null
    }, _findFirstFocusEnabledWidgetIndex: function () {
        for (var a = 0, b = this.getChildren(), c = b.length; a < c;) {
            var d = b[a];
            if (d && d instanceof ccui.Widget && d.isFocusEnabled())return a;
            a++
        }
        return 0
    }, _findFocusEnabledChildWidgetByIndex: function (a) {
        var b = this._getChildWidgetByIndex(a);
        return b ? b.isFocusEnabled() ?
            b : this._findFocusEnabledChildWidgetByIndex(a + 1) : null
    }, _getWorldCenterPoint: function (a) {
        var b = a instanceof ccui.Layout ? a._getLayoutAccumulatedSize() : a.getContentSize();
        return a.convertToWorldSpace(cc.p(b.width / 2, b.height / 2))
    }, _getNextFocusedWidget: function (a, b) {
        var c = null, c = this._children, d = c.indexOf(b), d = d + 1;
        if (d < c.length) {
            if (c = this._getChildWidgetByIndex(d)) {
                if (c.isFocusEnabled()) {
                    if (c instanceof ccui.Layout)return c._isFocusPassing = !0, c.findNextFocusedWidget(a, c);
                    this.dispatchFocusEvent(b, c);
                    return c
                }
                return this._getNextFocusedWidget(a,
                    c)
            }
            return b
        }
        if (this._loopFocus) {
            if (this._checkFocusEnabledChild()) {
                c = this._getChildWidgetByIndex(0);
                if (c.isFocusEnabled()) {
                    if (c instanceof ccui.Layout)return c._isFocusPassing = !0, c.findNextFocusedWidget(a, c);
                    this.dispatchFocusEvent(b, c);
                    return c
                }
                return this._getNextFocusedWidget(a, c)
            }
            return b instanceof ccui.Layout ? b : this._focusedWidget
        }
        return this._isLastWidgetInContainer(b, a) ? this._isWidgetAncestorSupportLoopFocus(this, a) ? this.findNextFocusedWidget(a, this) : b instanceof ccui.Layout ? b : this._focusedWidget :
            this.findNextFocusedWidget(a, this)
    }, _getPreviousFocusedWidget: function (a, b) {
        var c = null, c = this._children, d = c.indexOf(b), d = d - 1;
        if (0 <= d) {
            c = this._getChildWidgetByIndex(d);
            if (c.isFocusEnabled()) {
                if (c instanceof ccui.Layout)return c._isFocusPassing = !0, c.findNextFocusedWidget(a, c);
                this.dispatchFocusEvent(b, c);
                return c
            }
            return this._getPreviousFocusedWidget(a, c)
        }
        if (this._loopFocus) {
            if (this._checkFocusEnabledChild()) {
                d = c.length - 1;
                c = this._getChildWidgetByIndex(d);
                if (c.isFocusEnabled()) {
                    if (c instanceof ccui.Layout)return c._isFocusPassing = !0, c.findNextFocusedWidget(a, c);
                    this.dispatchFocusEvent(b, c);
                    return c
                }
                return this._getPreviousFocusedWidget(a, c)
            }
            return b instanceof ccui.Layout ? b : this._focusedWidget
        }
        return this._isLastWidgetInContainer(b, a) ? this._isWidgetAncestorSupportLoopFocus(this, a) ? this.findNextFocusedWidget(a, this) : b instanceof ccui.Layout ? b : this._focusedWidget : this.findNextFocusedWidget(a, this)
    }, _getChildWidgetByIndex: function (a) {
        for (var b = this._children, c = b.length, d = 0, e = a; a < c;) {
            var f = b[a];
            if (f && f instanceof ccui.Widget)return f;
            d++;
            a++
        }
        for (a = 0; a < e;) {
            if ((c = b[a]) && c instanceof ccui.Widget)return c;
            d++;
            a++
        }
        return null
    }, _isLastWidgetInContainer: function (a, b) {
        var c = a.getParent();
        if (c instanceof ccui.Layout)return!0;
        var d = c.getChildren(), e = d.indexOf(a);
        if (c.getLayoutType() == ccui.Layout.LINEAR_HORIZONTAL) {
            if (b == ccui.Widget.LEFT)return 0 == e ? 1 * this._isLastWidgetInContainer(c, b) : !1;
            if (b == ccui.Widget.RIGHT)return e == d.length - 1 ? 1 * this._isLastWidgetInContainer(c, b) : !1;
            if (b == ccui.Widget.DOWN || b == ccui.Widget.UP)return this._isLastWidgetInContainer(c,
                b)
        } else if (c.getLayoutType() == ccui.Layout.LINEAR_VERTICAL) {
            if (b == ccui.Widget.UP)return 0 == e ? 1 * this._isLastWidgetInContainer(c, b) : !1;
            if (b == ccui.Widget.DOWN)return e == d.length - 1 ? 1 * this._isLastWidgetInContainer(c, b) : !1;
            if (b == ccui.Widget.LEFT || b == ccui.Widget.RIGHT)return this._isLastWidgetInContainer(c, b)
        } else cc.assert(0, "invalid layout Type");
        return!1
    }, _isWidgetAncestorSupportLoopFocus: function (a, b) {
        var c = a.getParent();
        if (null == c)return!1;
        if (c.isLoopFocus()) {
            var d = c.getLayoutType();
            if (d == ccui.Layout.LINEAR_HORIZONTAL)return b ==
                ccui.Widget.LEFT || b == ccui.Widget.RIGHT ? !0 : this._isWidgetAncestorSupportLoopFocus(c, b);
            if (d == ccui.Layout.LINEAR_VERTICAL)return b == ccui.Widget.DOWN || b == ccui.Widget.UP ? !0 : this._isWidgetAncestorSupportLoopFocus(c, b);
            cc.assert(0, "invalid layout type")
        } else return this._isWidgetAncestorSupportLoopFocus(c, b)
    }, _passFocusToChild: function (a, b) {
        if (this._checkFocusEnabledChild()) {
            var c = this.getCurrentFocusedWidget();
            this._findProperSearchingFunctor(a, c);
            c = this.onPassFocusToChild(a, c);
            c = this._getChildWidgetByIndex(c);
            if (c instanceof ccui.Layout)return c._isFocusPassing = !0, c.findNextFocusedWidget(a, c);
            this.dispatchFocusEvent(b, c);
            return c
        }
        return this
    }, _checkFocusEnabledChild: function () {
        for (var a = this._children, b = 0, c = a.length; b < c; b++) {
            var d = a[b];
            if (d && d instanceof ccui.Widget && d.isFocusEnabled())return!0
        }
        return!1
    }, getDescription: function () {
        return"Layout"
    }, createCloneInstance: function () {
        return ccui.Layout.create()
    }, copyClonedWidgetChildren: function (a) {
        ccui.Widget.prototype.copyClonedWidgetChildren.call(this, a)
    },
    copySpecialProperties: function (a) {
        this.setBackGroundImageScale9Enabled(a._backGroundScale9Enabled);
        this.setBackGroundImage(a._backGroundImageFileName, a._bgImageTexType);
        this.setBackGroundImageCapInsets(a._backGroundImageCapInsets);
        this.setBackGroundColorType(a._colorType);
        this.setBackGroundColor(a._color);
        this.setBackGroundColor(a._startColor, a._endColor);
        this.setBackGroundColorOpacity(a._opacity);
        this.setBackGroundColorVector(a._alongVector);
        this.setLayoutType(a._layoutType);
        this.setClippingEnabled(a._clippingEnabled);
        this.setClippingType(a._clippingType);
        this._loopFocus = a._loopFocus;
        this._passFocusToChild = a._passFocusToChild
    }});
ccui.Layout._init_once = null;
ccui.Layout._visit_once = null;
ccui.Layout._layer = null;
ccui.Layout._sharedCache = null;
cc._renderType == cc._RENDER_TYPE_WEBGL ? (ccui.Layout.prototype.stencilClippingVisit = ccui.Layout.prototype._stencilClippingVisitForWebGL, ccui.Layout.prototype.scissorClippingVisit = ccui.Layout.prototype._scissorClippingVisitForWebGL) : (ccui.Layout.prototype.stencilClippingVisit = ccui.Layout.prototype._stencilClippingVisitForCanvas, ccui.Layout.prototype.scissorClippingVisit = ccui.Layout.prototype._stencilClippingVisitForCanvas);
ccui.Layout._getSharedCache = function () {
    return cc.ClippingNode._sharedCache || (cc.ClippingNode._sharedCache = cc.newElement("canvas"))
};
_p = ccui.Layout.prototype;
cc.defineGetterSetter(_p, "clippingEnabled", _p.isClippingEnabled, _p.setClippingEnabled);
cc.defineGetterSetter(_p, "clippingType", null, _p.setClippingType);
cc.defineGetterSetter(_p, "layoutType", _p.getLayoutType, _p.setLayoutType);
_p = null;
ccui.Layout.create = function () {
    return new ccui.Layout
};
ccui.Layout.BG_COLOR_NONE = 0;
ccui.Layout.BG_COLOR_SOLID = 1;
ccui.Layout.BG_COLOR_GRADIENT = 2;
ccui.Layout.ABSOLUTE = 0;
ccui.Layout.LINEAR_VERTICAL = 1;
ccui.Layout.LINEAR_HORIZONTAL = 2;
ccui.Layout.RELATIVE = 3;
ccui.Layout.CLIPPING_STENCIL = 0;
ccui.Layout.CLIPPING_SCISSOR = 1;
ccui.Layout.BACKGROUND_IMAGE_ZORDER = -2;
ccui.Layout.BACKGROUND_RENDERER_ZORDER = -2;
ccui.Margin = ccui.Class.extend({left: 0, top: 0, right: 0, bottom: 0, ctor: function (a, b, c, d) {
    a && void 0 === b && (this.left = a.left, this.top = a.top, this.right = a.right, this.bottom = a.bottom);
    void 0 !== d && (this.left = a, this.top = b, this.right = c, this.bottom = d)
}, setMargin: function (a, b, c, d) {
    this.left = a;
    this.top = b;
    this.right = c;
    this.bottom = d
}, equals: function (a) {
    return this.left == a.left && this.top == a.top && this.right == a.right && this.bottom == a.bottom
}});
ccui.MarginZero = function () {
    return new ccui.Margin(0, 0, 0, 0)
};
ccui.LayoutParameter = ccui.Class.extend({_margin: null, _layoutParameterType: null, ctor: function () {
    this._margin = new ccui.Margin;
    this._layoutParameterType = ccui.LayoutParameter.NONE
}, setMargin: function (a, b, c, d) {
    "object" === typeof a ? (this._margin.left = a.left, this._margin.top = a.top, this._margin.right = a.right, this._margin.bottom = a.bottom) : (this._margin.left = a, this._margin.top = b, this._margin.right = c, this._margin.bottom = d)
}, getMargin: function () {
    return this._margin
}, getLayoutType: function () {
    return this._layoutParameterType
},
    clone: function () {
        var a = this.createCloneInstance();
        a.copyProperties(this);
        return a
    }, createCloneInstance: function () {
        return ccui.LayoutParameter.create()
    }, copyProperties: function (a) {
        this._margin = a._margin
    }});
ccui.LayoutParameter.create = function () {
    return new ccui.LayoutParameter
};
ccui.LayoutParameter.NONE = 0;
ccui.LayoutParameter.LINEAR = 1;
ccui.LayoutParameter.RELATIVE = 2;
ccui.LinearLayoutParameter = ccui.LayoutParameter.extend({_linearGravity: null, ctor: function () {
    ccui.LayoutParameter.prototype.ctor.call(this);
    this._linearGravity = ccui.LinearLayoutParameter.NONE;
    this._layoutParameterType = ccui.LayoutParameter.LINEAR
}, setGravity: function (a) {
    this._linearGravity = a
}, getGravity: function () {
    return this._linearGravity
}, createCloneInstance: function () {
    return ccui.LinearLayoutParameter.create()
}, copyProperties: function (a) {
    ccui.LayoutParameter.prototype.copyProperties.call(this, a);
    a && (this.setAlign(a._relativeAlign), this.setRelativeName(a._relativeLayoutName), this.setRelativeToWidgetName(a._relativeWidgetName), this.setGravity(a._linearGravity))
}});
ccui.LinearLayoutParameter.create = function () {
    return new ccui.LinearLayoutParameter
};
ccui.LinearLayoutParameter.NONE = 0;
ccui.LinearLayoutParameter.LEFT = 1;
ccui.LinearLayoutParameter.TOP = 2;
ccui.LinearLayoutParameter.RIGHT = 3;
ccui.LinearLayoutParameter.BOTTOM = 4;
ccui.LinearLayoutParameter.CENTER_VERTICAL = 5;
ccui.LinearLayoutParameter.CENTER_HORIZONTAL = 6;
ccui.RelativeLayoutParameter = ccui.LayoutParameter.extend({_relativeAlign: null, _relativeWidgetName: "", _relativeLayoutName: "", _put: !1, ctor: function () {
    ccui.LayoutParameter.prototype.ctor.call(this);
    this._relativeAlign = ccui.RelativeLayoutParameter.NONE;
    this._relativeLayoutName = this._relativeWidgetName = "";
    this._put = !1;
    this._layoutParameterType = ccui.LayoutParameter.RELATIVE
}, setAlign: function (a) {
    this._relativeAlign = a
}, getAlign: function () {
    return this._relativeAlign
}, setRelativeToWidgetName: function (a) {
    this._relativeWidgetName =
        a
}, getRelativeToWidgetName: function () {
    return this._relativeWidgetName
}, setRelativeName: function (a) {
    this._relativeLayoutName = a
}, getRelativeName: function () {
    return this._relativeLayoutName
}, createCloneInstance: function () {
    return ccui.RelativeLayoutParameter.create()
}, copyProperties: function (a) {
    ccui.LayoutParameter.prototype.copyProperties.call(this, a);
    this.setAlign(a._relativeAlign);
    this.setRelativeToWidgetName(a._relativeWidgetName);
    this.setRelativeName(a._relativeLayoutName)
}});
ccui.RelativeLayoutParameter.create = function () {
    return new ccui.RelativeLayoutParameter
};
ccui.RelativeLayoutParameter.NONE = 0;
ccui.RelativeLayoutParameter.PARENT_TOP_LEFT = 1;
ccui.RelativeLayoutParameter.PARENT_TOP_CENTER_HORIZONTAL = 2;
ccui.RelativeLayoutParameter.PARENT_TOP_RIGHT = 3;
ccui.RelativeLayoutParameter.PARENT_LEFT_CENTER_VERTICAL = 4;
ccui.RelativeLayoutParameter.CENTER_IN_PARENT = 5;
ccui.RelativeLayoutParameter.PARENT_RIGHT_CENTER_VERTICAL = 6;
ccui.RelativeLayoutParameter.PARENT_LEFT_BOTTOM = 7;
ccui.RelativeLayoutParameter.PARENT_BOTTOM_CENTER_HORIZONTAL = 8;
ccui.RelativeLayoutParameter.PARENT_RIGHT_BOTTOM = 9;
ccui.RelativeLayoutParameter.LOCATION_ABOVE_LEFTALIGN = 10;
ccui.RelativeLayoutParameter.LOCATION_ABOVE_CENTER = 11;
ccui.RelativeLayoutParameter.LOCATION_ABOVE_RIGHTALIGN = 12;
ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_TOPALIGN = 13;
ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_CENTER = 14;
ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_BOTTOMALIGN = 15;
ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_TOPALIGN = 16;
ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_CENTER = 17;
ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_BOTTOMALIGN = 18;
ccui.RelativeLayoutParameter.LOCATION_BELOW_LEFTALIGN = 19;
ccui.RelativeLayoutParameter.LOCATION_BELOW_CENTER = 20;
ccui.RelativeLayoutParameter.LOCATION_BELOW_RIGHTALIGN = 21;
ccui.LINEAR_GRAVITY_NONE = 0;
ccui.LINEAR_GRAVITY_LEFT = 1;
ccui.LINEAR_GRAVITY_TOP = 2;
ccui.LINEAR_GRAVITY_RIGHT = 3;
ccui.LINEAR_GRAVITY_BOTTOM = 4;
ccui.LINEAR_GRAVITY_CENTER_VERTICAL = 5;
ccui.LINEAR_GRAVITY_CENTER_HORIZONTAL = 6;
ccui.RELATIVE_ALIGN_NONE = 0;
ccui.RELATIVE_ALIGN_PARENT_TOP_LEFT = 1;
ccui.RELATIVE_ALIGN_PARENT_TOP_CENTER_HORIZONTAL = 2;
ccui.RELATIVE_ALIGN_PARENT_TOP_RIGHT = 3;
ccui.RELATIVE_ALIGN_PARENT_LEFT_CENTER_VERTICAL = 4;
ccui.RELATIVE_ALIGN_PARENT_CENTER = 5;
ccui.RELATIVE_ALIGN_PARENT_RIGHT_CENTER_VERTICAL = 6;
ccui.RELATIVE_ALIGN_PARENT_LEFT_BOTTOM = 7;
ccui.RELATIVE_ALIGN_PARENT_BOTTOM_CENTER_HORIZONTAL = 8;
ccui.RELATIVE_ALIGN_PARENT_RIGHT_BOTTOM = 9;
ccui.RELATIVE_ALIGN_LOCATION_ABOVE_LEFT = 10;
ccui.RELATIVE_ALIGN_LOCATION_ABOVE_CENTER = 11;
ccui.RELATIVE_ALIGN_LOCATION_ABOVE_RIGHT = 12;
ccui.RELATIVE_ALIGN_LOCATION_LEFT_TOP = 13;
ccui.RELATIVE_ALIGN_LOCATION_LEFT_CENTER = 14;
ccui.RELATIVE_ALIGN_LOCATION_LEFT_BOTTOM = 15;
ccui.RELATIVE_ALIGN_LOCATION_RIGHT_TOP = 16;
ccui.RELATIVE_ALIGN_LOCATION_RIGHT_CENTER = 17;
ccui.RELATIVE_ALIGN_LOCATION_RIGHT_BOTTOM = 18;
ccui.RELATIVE_ALIGN_LOCATION_BELOW_TOP = 19;
ccui.RELATIVE_ALIGN_LOCATION_BELOW_CENTER = 20;
ccui.RELATIVE_ALIGN_LOCATION_BELOW_BOTTOM = 21;
ccui.LayoutManager = ccui.Class.extend({_doLayout: function (a) {
}});
ccui.LinearVerticalLayoutManager = ccui.LayoutManager.extend({_doLayout: function (a) {
    var b = a._getLayoutContentSize();
    a = a._getLayoutElements();
    for (var c = b.height, d = 0, e = a.length; d < e; d++) {
        var f = a[d];
        if (f) {
            var g = f.getLayoutParameter();
            if (g) {
                var h = g.getGravity(), k = f.getAnchorPoint(), m = f.getContentSize(), l = k.x * m.width, c = c - (1 - k.y) * m.height;
                switch (h) {
                    case ccui.LinearLayoutParameter.RIGHT:
                        l = b.width - (1 - k.x) * m.width;
                        break;
                    case ccui.LinearLayoutParameter.CENTER_HORIZONTAL:
                        l = b.width / 2 - m.width * (0.5 - k.x)
                }
                g = g.getMargin();
                l += g.left;
                c -= g.top;
                f.setPosition(l, c);
                c = f.getPositionY() - f.getAnchorPoint().y * f.getContentSize().height - g.bottom
            }
        }
    }
}});
ccui.LinearVerticalLayoutManager.create = function () {
    return new ccui.LinearVerticalLayoutManager
};
ccui.LinearHorizontalLayoutManager = ccui.LayoutManager.extend({_doLayout: function (a) {
    var b = a._getLayoutContentSize();
    a = a._getLayoutElements();
    for (var c = 0, d = 0, e = a.length; d < e; d++) {
        var f = a[d];
        if (f) {
            var g = f.getLayoutParameter();
            if (g) {
                var h = g.getGravity(), k = f.getAnchorPoint(), m = f.getSize(), c = c + k.x * m.width, l = b.height - (1 - k.y) * m.height;
                switch (h) {
                    case ccui.LinearLayoutParameter.BOTTOM:
                        l = k.y * m.height;
                        break;
                    case ccui.LinearLayoutParameter.CENTER_VERTICAL:
                        l = b.height / 2 - m.height * (0.5 - k.y)
                }
                g = g.getMargin();
                c += g.left;
                l -= g.top;
                f.setPosition(c, l);
                c = f.getRightBoundary() + g.right
            }
        }
    }
}});
ccui.LinearHorizontalLayoutManager.create = function () {
    return new ccui.LinearHorizontalLayoutManager
};
ccui.RelativeLayoutManager = ccui.LayoutManager.extend({_unlayoutChildCount: null, _widgetChildren: null, _widget: null, _finalPositionX: 0, _finalPositionY: 0, _relativeWidgetLP: null, _doLayout: function (a) {
    for (var b = this._widgetChildren = this._getAllWidgets(a); 0 < this._unlayoutChildCount;) {
        for (var c = 0, d = b.length; c < d; c++) {
            this._widget = b[c];
            var e = this._widget.getLayoutParameter();
            e && !e._put && this._caculateFinalPositionWithRelativeWidget(a) && (this._caculateFinalPositionWithRelativeAlign(), this._widget.setPosition(this._finalPositionX,
                this._finalPositionY), e._put = !0)
        }
        this._unlayoutChildCount--
    }
    this._widgetChildren.length = 0
}, _getAllWidgets: function (a) {
    a = a._getLayoutElements();
    for (var b = [], c = 0, d = a.length; c < d; c++) {
        var e = a[c];
        e && (e.getLayoutParameter()._put = !1, this._unlayoutChildCount++, b.push(e))
    }
    return b
}, _getRelativeWidget: function (a) {
    var b = null;
    if ((a = a.getLayoutParameter().getRelativeToWidgetName()) && 0 != a.length)for (var c = this._widgetChildren, d = 0, e = c.length; d < e; d++) {
        var f = c[d];
        if (f) {
            var g = f.getLayoutParameter();
            if (g && g.getRelativeName() ==
                a) {
                b = f;
                this._relativeWidgetLP = g;
                break
            }
        }
    }
    return b
}, _caculateFinalPositionWithRelativeWidget: function (a) {
    var b = this._widget, c = b.getAnchorPoint(), d = b.getContentSize();
    this._finalPositionY = this._finalPositionX = 0;
    var e = this._getRelativeWidget(b), b = b.getLayoutParameter().getAlign();
    a = a._getLayoutContentSize();
    switch (b) {
        case ccui.RelativeLayoutParameter.NONE:
        case ccui.RelativeLayoutParameter.PARENT_TOP_LEFT:
            this._finalPositionX = c.x * d.width;
            this._finalPositionY = a.height - (1 - c.y) * d.height;
            break;
        case ccui.RelativeLayoutParameter.PARENT_TOP_CENTER_HORIZONTAL:
            this._finalPositionX =
                0.5 * a.width - d.width * (0.5 - c.x);
            this._finalPositionY = a.height - (1 - c.y) * d.height;
            break;
        case ccui.RelativeLayoutParameter.PARENT_TOP_RIGHT:
            this._finalPositionX = a.width - (1 - c.x) * d.width;
            this._finalPositionY = a.height - (1 - c.y) * d.height;
            break;
        case ccui.RelativeLayoutParameter.PARENT_LEFT_CENTER_VERTICAL:
            this._finalPositionX = c.x * d.width;
            this._finalPositionY = 0.5 * a.height - d.height * (0.5 - c.y);
            break;
        case ccui.RelativeLayoutParameter.CENTER_IN_PARENT:
            this._finalPositionX = 0.5 * a.width - d.width * (0.5 - c.x);
            this._finalPositionY =
                0.5 * a.height - d.height * (0.5 - c.y);
            break;
        case ccui.RelativeLayoutParameter.PARENT_RIGHT_CENTER_VERTICAL:
            this._finalPositionX = a.width - (1 - c.x) * d.width;
            this._finalPositionY = 0.5 * a.height - d.height * (0.5 - c.y);
            break;
        case ccui.RelativeLayoutParameter.PARENT_LEFT_BOTTOM:
            this._finalPositionX = c.x * d.width;
            this._finalPositionY = c.y * d.height;
            break;
        case ccui.RelativeLayoutParameter.PARENT_BOTTOM_CENTER_HORIZONTAL:
            this._finalPositionX = 0.5 * a.width - d.width * (0.5 - c.x);
            this._finalPositionY = c.y * d.height;
            break;
        case ccui.RelativeLayoutParameter.PARENT_RIGHT_BOTTOM:
            this._finalPositionX =
                a.width - (1 - c.x) * d.width;
            this._finalPositionY = c.y * d.height;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_ABOVE_LEFTALIGN:
            if (e) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return!1;
                var b = e.getTopBoundary(), f = e.getLeftBoundary();
                this._finalPositionY = b + c.y * d.height;
                this._finalPositionX = f + c.x * d.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_ABOVE_CENTER:
            if (e) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return!1;
                a = e.getContentSize();
                b = e.getTopBoundary();
                this._finalPositionY =
                    b + c.y * d.height;
                this._finalPositionX = e.getLeftBoundary() + 0.5 * a.width + c.x * d.width - 0.5 * d.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_ABOVE_RIGHTALIGN:
            if (e) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return!1;
                b = e.getTopBoundary();
                f = e.getRightBoundary();
                this._finalPositionY = b + c.y * d.height;
                this._finalPositionX = f - (1 - c.x) * d.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_TOPALIGN:
            if (e) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return!1;
                b = e.getTopBoundary();
                f = e.getLeftBoundary();
                this._finalPositionY = b - (1 - c.y) * d.height;
                this._finalPositionX = f - (1 - c.x) * d.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_CENTER:
            if (e) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return!1;
                a = e.getContentSize();
                f = e.getLeftBoundary();
                this._finalPositionX = f - (1 - c.x) * d.width;
                this._finalPositionY = e.getBottomBoundary() + 0.5 * a.height + c.y * d.height - 0.5 * d.height
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_BOTTOMALIGN:
            if (e) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return!1;
                b = e.getBottomBoundary();
                f = e.getLeftBoundary();
                this._finalPositionY = b + c.y * d.height;
                this._finalPositionX = f - (1 - c.x) * d.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_TOPALIGN:
            if (e) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return!1;
                b = e.getTopBoundary();
                f = e.getRightBoundary();
                this._finalPositionY = b - (1 - c.y) * d.height;
                this._finalPositionX = f + c.x * d.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_CENTER:
            if (e) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return!1;
                a = e.getContentSize();
                f = e.getRightBoundary();
                this._finalPositionX = f + c.x * d.width;
                this._finalPositionY = e.getBottomBoundary() + 0.5 * a.height + c.y * d.height - 0.5 * d.height
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_BOTTOMALIGN:
            if (e) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return!1;
                b = e.getBottomBoundary();
                f = e.getRightBoundary();
                this._finalPositionY = b + c.y * d.height;
                this._finalPositionX = f + c.x * d.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_BELOW_LEFTALIGN:
            if (e) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return!1;
                b = e.getBottomBoundary();
                f = e.getLeftBoundary();
                this._finalPositionY = b - (1 - c.y) * d.height;
                this._finalPositionX = f + c.x * d.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_BELOW_CENTER:
            if (e) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return!1;
                a = e.getContentSize();
                b = e.getBottomBoundary();
                this._finalPositionY = b - (1 - c.y) * d.height;
                this._finalPositionX = e.getLeftBoundary() + 0.5 * a.width + c.x * d.width - 0.5 * d.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_BELOW_RIGHTALIGN:
            if (e) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return!1;
                b = e.getBottomBoundary();
                f = e.getRightBoundary();
                this._finalPositionY = b - (1 - c.y) * d.height;
                this._finalPositionX = f - (1 - c.x) * d.width
            }
    }
    return!0
}, _caculateFinalPositionWithRelativeAlign: function () {
    var a = this._widget.getLayoutParameter(), b = a.getMargin();
    switch (a.getAlign()) {
        case ccui.RelativeLayoutParameter.NONE:
        case ccui.RelativeLayoutParameter.PARENT_TOP_LEFT:
            this._finalPositionX += b.left;
            this._finalPositionY -= b.top;
            break;
        case ccui.RelativeLayoutParameter.PARENT_TOP_CENTER_HORIZONTAL:
            this._finalPositionY -=
                b.top;
            break;
        case ccui.RelativeLayoutParameter.PARENT_TOP_RIGHT:
            this._finalPositionX -= b.right;
            this._finalPositionY -= b.top;
            break;
        case ccui.RelativeLayoutParameter.PARENT_LEFT_CENTER_VERTICAL:
            this._finalPositionX += b.left;
            break;
        case ccui.RelativeLayoutParameter.PARENT_RIGHT_CENTER_VERTICAL:
            this._finalPositionX -= b.right;
            break;
        case ccui.RelativeLayoutParameter.PARENT_LEFT_BOTTOM:
            this._finalPositionX += b.left;
            this._finalPositionY += b.bottom;
            break;
        case ccui.RelativeLayoutParameter.PARENT_BOTTOM_CENTER_HORIZONTAL:
            this._finalPositionY +=
                b.bottom;
            break;
        case ccui.RelativeLayoutParameter.PARENT_RIGHT_BOTTOM:
            this._finalPositionX -= b.right;
            this._finalPositionY += b.bottom;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_ABOVE_LEFTALIGN:
            this._finalPositionY += b.bottom;
            this._finalPositionX += b.left;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_ABOVE_RIGHTALIGN:
            this._finalPositionY += b.bottom;
            this._finalPositionX -= b.right;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_ABOVE_CENTER:
            this._finalPositionY += b.bottom;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_TOPALIGN:
            this._finalPositionX -=
                b.right;
            this._finalPositionY -= b.top;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_BOTTOMALIGN:
            this._finalPositionX -= b.right;
            this._finalPositionY += b.bottom;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_CENTER:
            this._finalPositionX -= b.right;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_TOPALIGN:
            this._finalPositionX += b.left;
            this._finalPositionY -= b.top;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_BOTTOMALIGN:
            this._finalPositionX += b.left;
            this._finalPositionY +=
                b.bottom;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_CENTER:
            this._finalPositionX += b.left;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_BELOW_LEFTALIGN:
            this._finalPositionY -= b.top;
            this._finalPositionX += b.left;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_BELOW_RIGHTALIGN:
            this._finalPositionY -= b.top;
            this._finalPositionX -= b.right;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_BELOW_CENTER:
            this._finalPositionY -= b.top
    }
}});
ccui.RelativeLayoutManager.create = function () {
    return new ccui.RelativeLayoutManager
};
ccui.HBox = ccui.Layout.extend({init: function () {
    return ccui.Layout.prototype.init.call(this) ? (this.setLayoutType(ccui.Layout.LINEAR_HORIZONTAL), !0) : !1
}, initWithSize: function (a) {
    return this.init() ? (this.setSize(a), !0) : !1
}});
ccui.HBox.create = function (a) {
    var b = new ccui.HBox;
    return a ? b.initWithSize() ? b : null : b
};
ccui.RelativeBox = ccui.Layout.extend({init: function () {
    return ccui.Layout.prototype.init.call(this) ? (this.setLayoutType(ccui.Layout.RELATIVE), !0) : !1
}, initWithSize: function (a) {
    return this.init() ? (this.setSize(a), !0) : !1
}});
ccui.RelativeBox.create = function (a) {
    var b = new ccui.RelativeBox;
    return a ? b.initWithSize() ? b : null : b
};
ccui.VBox = ccui.Layout.extend({init: function () {
    return ccui.Layout.prototype.init.call(this) ? (this.setLayoutType(ccui.Layout.VERTICAL), !0) : !1
}, initWithSize: function (a) {
    return this.init() ? (this.setSize(a), !0) : !1
}});
ccui.VBox.create = function (a) {
    var b = new ccui.VBox;
    return a ? b.initWithSize() ? b : null : b
};
ccui.helper = {seekWidgetByTag: function (a, b) {
    if (!a)return null;
    if (a.getTag() == b)return a;
    for (var c = a.getChildren(), d = c.length, e = 0; e < d; e++) {
        var f = ccui.helper.seekWidgetByTag(c[e], b);
        if (null != f)return f
    }
    return null
}, seekWidgetByName: function (a, b) {
    if (!a)return null;
    if (a.getName() == b)return a;
    for (var c = a.getChildren(), d = c.length, e = 0; e < d; e++) {
        var f = ccui.helper.seekWidgetByName(c[e], b);
        if (null != f)return f
    }
    return null
}, seekWidgetByRelativeName: function (a, b) {
    if (!a)return null;
    for (var c = a.getChildren(), d = c.length,
             e = 0; e < d; e++) {
        var f = c[e], g = f.getLayoutParameter(ccui.LayoutParameter.RELATIVE);
        if (g && g.getRelativeName() == b)return f
    }
    return null
}, seekActionWidgetByActionTag: function (a, b) {
    if (!a)return null;
    if (a.getActionTag() == b)return a;
    for (var c = a.getChildren(), d = 0; d < c.length; d++) {
        var e = ccui.helper.seekActionWidgetByActionTag(c[d], b);
        if (null != e)return e
    }
    return null
}};
ccui.Button = ccui.Widget.extend({_buttonNormalRenderer: null, _buttonClickedRenderer: null, _buttonDisableRenderer: null, _titleRenderer: null, _normalFileName: "", _clickedFileName: "", _disabledFileName: "", _prevIgnoreSize: !0, _scale9Enabled: !1, _capInsetsNormal: null, _capInsetsPressed: null, _capInsetsDisabled: null, _normalTexType: ccui.Widget.LOCAL_TEXTURE, _pressedTexType: ccui.Widget.LOCAL_TEXTURE, _disabledTexType: ccui.Widget.LOCAL_TEXTURE, _normalTextureSize: null, _pressedTextureSize: null, _disabledTextureSize: null,
    pressedActionEnabled: !1, _titleColor: null, _normalTextureScaleXInSize: 1, _normalTextureScaleYInSize: 1, _pressedTextureScaleXInSize: 1, _pressedTextureScaleYInSize: 1, _normalTextureLoaded: !1, _pressedTextureLoaded: !1, _disabledTextureLoaded: !1, _cascadeOpacityEnabled: !0, _className: "Button", _normalTextureAdaptDirty: !0, _pressedTextureAdaptDirty: !0, _disabledTextureAdaptDirty: !0, _fontName: "Thonburi", _fontSize: 12, _type: 0, ctor: function () {
        this._capInsetsNormal = cc.rect(0, 0, 0, 0);
        this._capInsetsPressed = cc.rect(0, 0, 0,
            0);
        this._capInsetsDisabled = cc.rect(0, 0, 0, 0);
        var a = this._size;
        this._normalTextureSize = cc.size(a.width, a.height);
        this._pressedTextureSize = cc.size(a.width, a.height);
        this._disabledTextureSize = cc.size(a.width, a.height);
        this._titleColor = cc.color.WHITE;
        ccui.Widget.prototype.ctor.call(this)
    }, init: function (a, b, c, d) {
        if (ccui.Widget.prototype.init.call(this)) {
            this.setTouchEnabled(!0);
            if (void 0 === a)return!0;
            this.loadTextures(a, b, c, d)
        }
        return!1
    }, initRenderer: function () {
        this._buttonNormalRenderer = cc.Sprite.create();
        this._buttonClickedRenderer = cc.Sprite.create();
        this._buttonDisableRenderer = cc.Sprite.create();
        this._titleRenderer = cc.LabelTTF.create("");
        this.addProtectedChild(this._buttonNormalRenderer, ccui.Button.NORMAL_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._buttonClickedRenderer, ccui.Button.PRESSED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._buttonDisableRenderer, ccui.Button.DISABLED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._titleRenderer, ccui.Button.TITLE_RENDERER_ZORDER, -1)
    }, setScale9Enabled: function (a) {
        this._scale9Enabled !=
        a && (this._brightStyle = ccui.Widget.BRIGHT_STYLE_NONE, this._scale9Enabled = a, this.removeProtectedChild(this._buttonNormalRenderer), this.removeProtectedChild(this._buttonClickedRenderer), this.removeProtectedChild(this._buttonDisableRenderer), this._scale9Enabled ? (this._buttonNormalRenderer = cc.Scale9Sprite.create(), this._buttonClickedRenderer = cc.Scale9Sprite.create(), this._buttonDisableRenderer = cc.Scale9Sprite.create()) : (this._buttonNormalRenderer = cc.Sprite.create(), this._buttonClickedRenderer = cc.Sprite.create(),
            this._buttonDisableRenderer = cc.Sprite.create()), this.loadTextureNormal(this._normalFileName, this._normalTexType), this.loadTexturePressed(this._clickedFileName, this._pressedTexType), this.loadTextureDisabled(this._disabledFileName, this._disabledTexType), this.addProtectedChild(this._buttonNormalRenderer, ccui.Button.NORMAL_RENDERER_ZORDER, -1), this.addProtectedChild(this._buttonClickedRenderer, ccui.Button.PRESSED_RENDERER_ZORDER, -1), this.addProtectedChild(this._buttonDisableRenderer, ccui.Button.DISABLED_RENDERER_ZORDER,
            -1), this._scale9Enabled ? (a = this._ignoreSize, this.ignoreContentAdaptWithSize(!1), this._prevIgnoreSize = a) : this.ignoreContentAdaptWithSize(this._prevIgnoreSize), this.setCapInsetsNormalRenderer(this._capInsetsNormal), this.setCapInsetsPressedRenderer(this._capInsetsPressed), this.setCapInsetsDisabledRenderer(this._capInsetsDisabled), this.setBright(this._bright))
    }, isScale9Enabled: function () {
        return this._scale9Enabled
    }, ignoreContentAdaptWithSize: function (a) {
        if (!this._scale9Enabled || this._scale9Enabled && !a)ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this,
            a), this._prevIgnoreSize = a
    }, getVirtualRendererSize: function () {
        return this._normalTextureSize
    }, loadTextures: function (a, b, c, d) {
        this.loadTextureNormal(a, d);
        this.loadTexturePressed(b, d);
        this.loadTextureDisabled(c, d)
    }, loadTextureNormal: function (a, b) {
        if (a) {
            b = b || ccui.Widget.LOCAL_TEXTURE;
            this._normalFileName = a;
            this._normalTexType = b;
            if (this._scale9Enabled) {
                var c = this._buttonNormalRenderer;
                switch (this._normalTexType) {
                    case ccui.Widget.LOCAL_TEXTURE:
                        c.initWithFile(a);
                        break;
                    case ccui.Widget.PLIST_TEXTURE:
                        c.initWithSpriteFrameName(a)
                }
                c.setCapInsets(this._capInsetsNormal)
            } else switch (c =
                this._buttonNormalRenderer, this._normalTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    c.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    c.setSpriteFrame(a)
            }
            this._normalTextureSize = this._buttonNormalRenderer.getContentSize();
            this.updateFlippedX();
            this.updateFlippedY();
            this._buttonNormalRenderer.setColor(this.getColor());
            this._buttonNormalRenderer.setOpacity(this.getOpacity());
            this._updateContentSizeWithTextureSize(this._normalTextureSize);
            this._normalTextureAdaptDirty = this._normalTextureLoaded = !0
        }
    }, loadTexturePressed: function (a, b) {
        if (a) {
            b = b || ccui.Widget.LOCAL_TEXTURE;
            this._clickedFileName = a;
            this._pressedTexType = b;
            if (this._scale9Enabled) {
                var c = this._buttonClickedRenderer;
                switch (this._pressedTexType) {
                    case ccui.Widget.LOCAL_TEXTURE:
                        c.initWithFile(a);
                        break;
                    case ccui.Widget.PLIST_TEXTURE:
                        c.initWithSpriteFrameName(a)
                }
                c.setCapInsets(this._capInsetsPressed)
            } else switch (c = this._buttonClickedRenderer, this._pressedTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    c.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    c.setSpriteFrame(a)
            }
            this._pressedTextureSize =
                this._buttonClickedRenderer.getContentSize();
            this.updateFlippedX();
            this.updateFlippedY();
            this._buttonDisableRenderer.setColor(this.getColor());
            this._buttonDisableRenderer.setOpacity(this.getOpacity());
            this._pressedTextureAdaptDirty = this._pressedTextureLoaded = !0
        }
    }, loadTextureDisabled: function (a, b) {
        if (a) {
            b = b || ccui.Widget.LOCAL_TEXTURE;
            this._disabledFileName = a;
            this._disabledTexType = b;
            if (this._scale9Enabled) {
                var c = this._buttonDisableRenderer;
                switch (this._disabledTexType) {
                    case ccui.Widget.LOCAL_TEXTURE:
                        c.initWithFile(a);
                        break;
                    case ccui.Widget.PLIST_TEXTURE:
                        c.initWithSpriteFrameName(a)
                }
                c.setCapInsets(this._capInsetsDisabled)
            } else switch (c = this._buttonDisableRenderer, this._disabledTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    c.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    c.setSpriteFrame(a)
            }
            this._disabledTextureSize = this._buttonDisableRenderer.getContentSize();
            this.updateFlippedX();
            this.updateFlippedY();
            this._buttonDisableRenderer.setColor(this.getColor());
            this._buttonDisableRenderer.setOpacity(this.getOpacity());
            this._disabledTextureAdaptDirty = this._disabledTextureLoaded = !0
        }
    }, setCapInsets: function (a) {
        this.setCapInsetsNormalRenderer(a);
        this.setCapInsetsPressedRenderer(a);
        this.setCapInsetsDisabledRenderer(a)
    }, setCapInsetsNormalRenderer: function (a) {
        this._capInsetsNormal = a;
        this._scale9Enabled && this._buttonNormalRenderer.setCapInsets(a)
    }, getCapInsetsNormalRenderer: function () {
        return this._capInsetsNormal
    }, setCapInsetsPressedRenderer: function (a) {
        this._capInsetsPressed = a;
        this._scale9Enabled && this._buttonClickedRenderer.setCapInsets(a)
    },
    getCapInsetsPressedRenderer: function () {
        return this._capInsetsPressed
    }, setCapInsetsDisabledRenderer: function (a) {
        this._capInsetsDisabled = a;
        this._scale9Enabled && this._buttonDisableRenderer.setCapInsets(a)
    }, getCapInsetsDisabledRenderer: function () {
        return this._capInsetsDisabled
    }, onPressStateChangedToNormal: function () {
        this._buttonNormalRenderer.setVisible(!0);
        this._buttonClickedRenderer.setVisible(!1);
        this._buttonDisableRenderer.setVisible(!1);
        if (this._pressedTextureLoaded) {
            if (this.pressedActionEnabled) {
                this._buttonNormalRenderer.stopAllActions();
                this._buttonClickedRenderer.stopAllActions();
                var a = cc.ScaleTo.create(0.05, this._normalTextureScaleXInSize, this._normalTextureScaleYInSize);
                this._buttonNormalRenderer.runAction(a);
                this._buttonClickedRenderer.setScale(this._pressedTextureScaleXInSize, this._pressedTextureScaleYInSize)
            }
        } else this._scale9Enabled ? this.updateTexturesRGBA() : (this._buttonNormalRenderer.stopAllActions(), this._buttonNormalRenderer.setScale(this._normalTextureScaleXInSize, this._normalTextureScaleYInSize))
    }, onPressStateChangedToPressed: function () {
        if (this._pressedTextureLoaded) {
            if (this._buttonNormalRenderer.setVisible(!1),
                this._buttonClickedRenderer.setVisible(!0), this._buttonDisableRenderer.setVisible(!1), this.pressedActionEnabled) {
                this._buttonNormalRenderer.stopAllActions();
                this._buttonClickedRenderer.stopAllActions();
                var a = cc.ScaleTo.create(0.05, this._pressedTextureScaleXInSize + 0.1, this._pressedTextureScaleYInSize + 0.1);
                this._buttonClickedRenderer.runAction(a);
                this._buttonNormalRenderer.setScale(this._pressedTextureScaleXInSize + 0.1, this._pressedTextureScaleYInSize + 0.1)
            }
        } else this._buttonNormalRenderer.setVisible(!0),
            this._buttonClickedRenderer.setVisible(!0), this._buttonDisableRenderer.setVisible(!1), this._scale9Enabled ? this._buttonNormalRenderer.setColor(cc.Color.GRAY) : (this._buttonNormalRenderer.stopAllActions(), this._buttonNormalRenderer.setScale(this._normalTextureScaleXInSize + 0.1, this._normalTextureScaleYInSize + 0.1))
    }, onPressStateChangedToDisabled: function () {
        this._buttonNormalRenderer.setVisible(!1);
        this._buttonClickedRenderer.setVisible(!1);
        this._buttonDisableRenderer.setVisible(!0);
        this._buttonNormalRenderer.setScale(this._normalTextureScaleXInSize,
            this._normalTextureScaleYInSize);
        this._buttonClickedRenderer.setScale(this._pressedTextureScaleXInSize, this._pressedTextureScaleYInSize)
    }, setFlippedX: function (a) {
        this._titleRenderer.setFlippedX(a);
        this._scale9Enabled || (this._buttonNormalRenderer.setFlippedX(a), this._buttonClickedRenderer.setFlippedX(a), this._buttonDisableRenderer.setFlippedX(a))
    }, setFlipY: function (a) {
        this._titleRenderer.setFlippedY(a);
        this._scale9Enabled || (this._buttonNormalRenderer.setFlippedY(a), this._buttonClickedRenderer.setFlippedY(a),
            this._buttonDisableRenderer.setFlippedY(a))
    }, isFlippedX: function () {
        return this._scale9Enabled ? !1 : this._buttonNormalRenderer.isFlippedX()
    }, isFlippedY: function () {
        return this._scale9Enabled ? !1 : this._buttonNormalRenderer.isFlippedY()
    }, updateFlippedX: function () {
        var a = this._flippedX ? -1 : 1;
        this._titleRenderer.setScaleX(a);
        this._scale9Enabled ? (this._buttonNormalRenderer.setScaleX(a), this._buttonClickedRenderer.setScaleX(a), this._buttonDisableRenderer.setScaleX(a)) : (this._buttonNormalRenderer.setFlippedX(this._flippedX),
            this._buttonClickedRenderer.setFlippedX(this._flippedX), this._buttonDisableRenderer.setFlippedX(this._flippedX))
    }, updateFlippedY: function () {
        var a = this._flippedY ? -1 : 1;
        this._titleRenderer.setScaleY(a);
        this._scale9Enabled ? (this._buttonNormalRenderer.setScaleY(a), this._buttonClickedRenderer.setScaleY(a), this._buttonDisableRenderer.setScaleY(a)) : (this._buttonNormalRenderer.setFlippedY(this._flippedY), this._buttonClickedRenderer.setFlippedY(this._flippedY), this._buttonDisableRenderer.setFlippedY(this._flippedY))
    },
    updateTexturesRGBA: function () {
        this._buttonNormalRenderer.setColor(this.getColor());
        this._buttonClickedRenderer.setColor(this.getColor());
        this._buttonDisableRenderer.setColor(this.getColor());
        this._buttonNormalRenderer.setOpacity(this.getOpacity());
        this._buttonClickedRenderer.setOpacity(this.getOpacity());
        this._buttonDisableRenderer.setOpacity(this.getOpacity())
    }, setAnchorPoint: function (a, b) {
        void 0 === b ? (ccui.Widget.prototype.setAnchorPoint.call(this, a), this._buttonNormalRenderer.setAnchorPoint(a),
            this._buttonClickedRenderer.setAnchorPoint(a), this._buttonDisableRenderer.setAnchorPoint(a)) : (ccui.Widget.prototype.setAnchorPoint.call(this, a, b), this._buttonNormalRenderer.setAnchorPoint(a, b), this._buttonClickedRenderer.setAnchorPoint(a, b), this._buttonDisableRenderer.setAnchorPoint(a, b));
        this._titleRenderer.setPosition(this._size.width * (0.5 - this._anchorPoint.x), this._size.height * (0.5 - this._anchorPoint.y))
    }, _setAnchorX: function (a) {
        ccui.Widget.prototype._setAnchorX.call(this, a);
        this._buttonNormalRenderer._setAnchorX(a);
        this._buttonClickedRenderer._setAnchorX(a);
        this._buttonDisableRenderer._setAnchorX(a);
        this._titleRenderer.setPositionX(this._size.width * (0.5 - this._anchorPoint.x))
    }, _setAnchorY: function (a) {
        ccui.Widget.prototype._setAnchorY.call(this, a);
        this._buttonNormalRenderer._setAnchorY(a);
        this._buttonClickedRenderer._setAnchorY(a);
        this._buttonDisableRenderer._setAnchorY(a);
        this._titleRenderer.setPositionY(this._size.height * (0.5 - this._anchorPoint.y))
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this.updateTitleLocation();
        this.normalTextureScaleChangedWithSize();
        this.pressedTextureScaleChangedWithSize();
        this.disabledTextureScaleChangedWithSize()
    }, getContentSize: function () {
        return this._normalTextureSize
    }, _getWidth: function () {
        return this._scale9Enabled ? this._size.width : this._normalTextureSize.width
    }, _getHeight: function () {
        return this._scale9Enabled ? this._size.height : this._normalTextureSize.height
    }, getVirtualRenderer: function () {
        if (this._bright)switch (this._brightStyle) {
            case ccui.Widget.BRIGHT_STYLE_NORMAL:
                return this._buttonNormalRenderer;
            case ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT:
                return this._buttonClickedRenderer;
            default:
                return null
        } else return this._buttonDisableRenderer
    }, normalTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._scale9Enabled || (this._buttonNormalRenderer.setScale(1), this._normalTextureScaleXInSize = this._normalTextureScaleYInSize = 1); else if (this._scale9Enabled)this._buttonNormalRenderer.setPreferredSize(this._size), this._normalTextureScaleXInSize = this._normalTextureScaleYInSize = 1; else {
            var a = this._normalTextureSize;
            if (0 >= a.width || 0 >= a.height) {
                this._buttonNormalRenderer.setScale(1);
                return
            }
            var b = this._size.width / a.width, a = this._size.height / a.height;
            this._buttonNormalRenderer.setScaleX(b);
            this._buttonNormalRenderer.setScaleY(a);
            this._normalTextureScaleXInSize = b;
            this._normalTextureScaleYInSize = a
        }
        this._buttonNormalRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
    }, pressedTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._scale9Enabled || (this._buttonClickedRenderer.setScale(1),
            this._pressedTextureScaleXInSize = this._pressedTextureScaleYInSize = 1); else if (this._scale9Enabled)this._buttonClickedRenderer.setPreferredSize(this._size), this._pressedTextureScaleXInSize = this._pressedTextureScaleYInSize = 1; else {
            var a = this._pressedTextureSize;
            if (0 >= a.width || 0 >= a.height) {
                this._buttonClickedRenderer.setScale(1);
                return
            }
            var b = this._size.width / a.width, a = this._size.height / a.height;
            this._buttonClickedRenderer.setScaleX(b);
            this._buttonClickedRenderer.setScaleY(a);
            this._pressedTextureScaleXInSize =
                b;
            this._pressedTextureScaleYInSize = a
        }
        this._buttonClickedRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
    }, disabledTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._scale9Enabled || this._buttonDisableRenderer.setScale(1); else if (this._scale9Enabled)this._buttonDisableRenderer.setPreferredSize(this._size); else {
            var a = this._disabledTextureSize;
            if (0 >= a.width || 0 >= a.height) {
                this._buttonDisableRenderer.setScale(1);
                return
            }
            var b = this._size.height / a.height;
            this._buttonDisableRenderer.setScaleX(this._size.width /
                a.width);
            this._buttonDisableRenderer.setScaleY(b)
        }
        this._buttonDisableRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
    }, adaptRenderers: function () {
        this._normalTextureAdaptDirty && (this.normalTextureScaleChangedWithSize(), this._normalTextureAdaptDirty = !1);
        this._pressedTextureAdaptDirty && (this.pressedTextureScaleChangedWithSize(), this._pressedTextureAdaptDirty = !1);
        this._disabledTextureAdaptDirty && (this.disabledTextureScaleChangedWithSize(), this._disabledTextureAdaptDirty = !1)
    },
    updateTitleLocation: function () {
        this._titleRenderer.setPosition(0.5 * this._contentSize.width, 0.5 * this._contentSize.height)
    }, setPressedActionEnabled: function (a) {
        this.pressedActionEnabled = a
    }, setTitleText: function (a) {
        this._titleRenderer.setString(a)
    }, getTitleText: function () {
        return this._titleRenderer.getString()
    }, setTitleColor: function (a) {
        this._titleColor.r = a.r;
        this._titleColor.g = a.g;
        this._titleColor.b = a.b;
        this._titleRenderer.updateDisplayedColor(a)
    }, getTitleColor: function () {
        return this._titleRenderer.getColor()
    },
    setTitleFontSize: function (a) {
        this._titleRenderer.setFontSize(a)
    }, getTitleFontSize: function () {
        return this._titleRenderer.getFontSize()
    }, setTitleFontName: function (a) {
        this._titleRenderer.setFontName(a)
    }, getTitleFontName: function () {
        return this._titleRenderer.getFontName()
    }, _setTitleFont: function (a) {
        this._titleRenderer.font = a
    }, _getTitleFont: function () {
        return this._titleRenderer.font
    }, updateTextureColor: function () {
        this.updateColorToRenderer(this._buttonNormalRenderer);
        this.updateColorToRenderer(this._buttonClickedRenderer);
        this.updateColorToRenderer(this._buttonDisableRenderer)
    }, getDescription: function () {
        return"Button"
    }, createCloneInstance: function () {
        return ccui.Button.create()
    }, copySpecialProperties: function (a) {
        this._prevIgnoreSize = a._prevIgnoreSize;
        this.setScale9Enabled(a._scale9Enabled);
        this.loadTextureNormal(a._normalFileName, a._normalTexType);
        this.loadTexturePressed(a._clickedFileName, a._pressedTexType);
        this.loadTextureDisabled(a._disabledFileName, a._disabledTexType);
        this.setCapInsetsNormalRenderer(a._capInsetsNormal);
        this.setCapInsetsPressedRenderer(a._capInsetsPressed);
        this.setCapInsetsDisabledRenderer(a._capInsetsDisabled);
        this.setTitleText(a.getTitleText());
        this.setTitleFontName(a.getTitleFontName());
        this.setTitleFontSize(a.getTitleFontSize());
        this.setTitleColor(a.getTitleColor());
        this.setPressedActionEnabled(a.pressedActionEnabled)
    }});
_p = ccui.Button.prototype;
cc.defineGetterSetter(_p, "titleText", _p.getTitleText, _p.setTitleText);
cc.defineGetterSetter(_p, "titleFont", _p._getTitleFont, _p._setTitleFont);
cc.defineGetterSetter(_p, "titleFontSize", _p.getTitleFontSize, _p.setTitleFontSize);
cc.defineGetterSetter(_p, "titleFontName", _p.getTitleFontName, _p.setTitleFontName);
cc.defineGetterSetter(_p, "titleColor", _p.getTitleColor, _p.setTitleColor);
_p = null;
ccui.Button.create = function (a, b, c, d) {
    var e = new ccui.Button;
    if (void 0 === a)return e;
    e.init(a, b, c, d)
};
ccui.Button.NORMAL_RENDERER_ZORDER = -2;
ccui.Button.PRESSED_RENDERER_ZORDER = -2;
ccui.Button.DISABLED_RENDERER_ZORDER = -2;
ccui.Button.TITLE_RENDERER_ZORDER = -1;
ccui.Button.SYSTEM = 0;
ccui.Button.TTF = 1;
ccui.CheckBox = ccui.Widget.extend({_backGroundBoxRenderer: null, _backGroundSelectedBoxRenderer: null, _frontCrossRenderer: null, _backGroundBoxDisabledRenderer: null, _frontCrossDisabledRenderer: null, _isSelected: !0, _checkBoxEventListener: null, _checkBoxEventSelector: null, _checkBoxEventCallback: null, _backGroundTexType: ccui.Widget.LOCAL_TEXTURE, _backGroundSelectedTexType: ccui.Widget.LOCAL_TEXTURE, _frontCrossTexType: ccui.Widget.LOCAL_TEXTURE, _backGroundDisabledTexType: ccui.Widget.LOCAL_TEXTURE, _frontCrossDisabledTexType: ccui.Widget.LOCAL_TEXTURE,
    _backGroundFileName: "", _backGroundSelectedFileName: "", _frontCrossFileName: "", _backGroundDisabledFileName: "", _frontCrossDisabledFileName: "", _className: "CheckBox", _backGroundBoxRendererAdaptDirty: !0, _backGroundSelectedBoxRendererAdaptDirty: !0, _frontCrossRendererAdaptDirty: !0, _backGroundBoxDisabledRendererAdaptDirty: !0, _frontCrossDisabledRendererAdaptDirty: !0, ctor: function () {
        ccui.Widget.prototype.ctor.call(this)
    }, init: function (a, b, c, d, e, f) {
        return ccui.Widget.prototype.init.call(this) ? (this._isSelected = !0, this.setTouchEnabled(!0), void 0 === a && this.loadTextures(a, b, c, d, e, f), !0) : !1
    }, initRenderer: function () {
        this._backGroundBoxRenderer = cc.Sprite.create();
        this._backGroundSelectedBoxRenderer = cc.Sprite.create();
        this._frontCrossRenderer = cc.Sprite.create();
        this._backGroundBoxDisabledRenderer = cc.Sprite.create();
        this._frontCrossDisabledRenderer = cc.Sprite.create();
        this.addProtectedChild(this._backGroundBoxRenderer, ccui.CheckBox.BOX_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._backGroundSelectedBoxRenderer,
            ccui.CheckBox.BOX_SELECTED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._frontCrossRenderer, ccui.CheckBox.FRONT_CROSS_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._backGroundBoxDisabledRenderer, ccui.CheckBox.BOX_DISABLED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._frontCrossDisabledRenderer, ccui.CheckBox.FRONT_CROSS_DISABLED_RENDERER_ZORDER, -1);
        window.test = [this._backGroundBoxRenderer, this._backGroundSelectedBoxRenderer, this._frontCrossRenderer, this._backGroundBoxDisabledRenderer, this._frontCrossDisabledRenderer];
        window.a = this
    }, loadTextures: function (a, b, c, d, e, f) {
        this.loadTextureBackGround(a, f);
        this.loadTextureBackGroundSelected(b, f);
        this.loadTextureFrontCross(c, f);
        this.loadTextureBackGroundDisabled(d, f);
        this.loadTextureFrontCrossDisabled(e, f)
    }, loadTextureBackGround: function (a, b) {
        if (a) {
            b = b || ccui.Widget.LOCAL_TEXTURE;
            this._backGroundFileName = a;
            this._backGroundTexType = b;
            var c = this._backGroundBoxRenderer;
            switch (this._backGroundTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    c.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    c.setSpriteFrame(a)
            }
            this.backGroundTextureScaleChangedWithSize();
            c.textureLoaded() || (this._backGroundBoxRenderer.setContentSize(this._customSize), c.addLoadedEventListener(function () {
                this.backGroundTextureScaleChangedWithSize()
            }, this));
            this.updateFlippedX();
            this.updateFlippedY();
            this._backGroundBoxRenderer.setColor(this.getColor());
            this._backGroundBoxRenderer.setOpacity(this.getOpacity());
            this._updateContentSizeWithTextureSize(this._backGroundBoxRenderer.getContentSize());
            this._backGroundBoxRendererAdaptDirty = !0
        }
    }, loadTextureBackGroundSelected: function (a, b) {
        if (a) {
            b =
                b || ccui.Widget.LOCAL_TEXTURE;
            this._backGroundSelectedFileName = a;
            this._backGroundSelectedTexType = b;
            switch (this._backGroundSelectedTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    this._backGroundSelectedBoxRenderer.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    this._backGroundSelectedBoxRenderer.setSpriteFrame(a)
            }
            this.updateFlippedX();
            this.updateFlippedY();
            this._backGroundSelectedBoxRenderer.setColor(this.getColor());
            this._backGroundSelectedBoxRenderer.setOpacity(this.getOpacity());
            this._backGroundSelectedBoxRendererAdaptDirty = !0
        }
    }, loadTextureFrontCross: function (a, b) {
        if (a) {
            b = b || ccui.Widget.LOCAL_TEXTURE;
            this._frontCrossFileName = a;
            this._frontCrossTexType = b;
            switch (this._frontCrossTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    this._frontCrossRenderer.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    this._frontCrossRenderer.setSpriteFrame(a)
            }
            this.updateFlippedX();
            this.updateFlippedY();
            this._frontCrossRenderer.setColor(this.getColor());
            this._frontCrossRenderer.setOpacity(this.getOpacity());
            this._frontCrossRendererAdaptDirty = !0
        }
    },
    loadTextureBackGroundDisabled: function (a, b) {
        if (a) {
            b = b || ccui.Widget.LOCAL_TEXTURE;
            this._backGroundDisabledFileName = a;
            this._backGroundDisabledTexType = b;
            switch (this._backGroundDisabledTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    this._backGroundBoxDisabledRenderer.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    this._backGroundBoxDisabledRenderer.setSpriteFrame(a)
            }
            this.updateFlippedX();
            this.updateFlippedY();
            this._backGroundBoxDisabledRenderer.setColor(this.getColor());
            this._backGroundBoxDisabledRenderer.setOpacity(this.getOpacity());
            this._backGroundBoxDisabledRendererAdaptDirty = !0
        }
    }, loadTextureFrontCrossDisabled: function (a, b) {
        if (a) {
            b = b || ccui.Widget.LOCAL_TEXTURE;
            this._frontCrossDisabledFileName = a;
            this._frontCrossDisabledTexType = b;
            switch (this._frontCrossDisabledTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    this._frontCrossDisabledRenderer.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    this._frontCrossDisabledRenderer.setSpriteFrame(a)
            }
            this.updateFlippedX();
            this.updateFlippedY();
            this._frontCrossDisabledRenderer.setColor(this.getColor());
            this._frontCrossDisabledRenderer.setOpacity(this.getOpacity());
            this._frontCrossDisabledRendererAdaptDirty = !0
        }
    }, onPressStateChangedToNormal: function () {
        this._backGroundBoxRenderer.setVisible(!0);
        this._backGroundSelectedBoxRenderer.setVisible(!1);
        this._backGroundBoxDisabledRenderer.setVisible(!1);
        this._frontCrossDisabledRenderer.setVisible(!1)
    }, onPressStateChangedToPressed: function () {
        this._backGroundBoxRenderer.setVisible(!1);
        this._backGroundSelectedBoxRenderer.setVisible(!0);
        this._backGroundBoxDisabledRenderer.setVisible(!1);
        this._frontCrossDisabledRenderer.setVisible(!1)
    }, onPressStateChangedToDisabled: function () {
        this._backGroundBoxRenderer.setVisible(!1);
        this._backGroundSelectedBoxRenderer.setVisible(!1);
        this._backGroundBoxDisabledRenderer.setVisible(!0);
        this._frontCrossRenderer.setVisible(!1);
        this._isSelected && this._frontCrossDisabledRenderer.setVisible(!0)
    }, setSelectedState: function (a) {
        a != this._isSelected && (this._isSelected = a, this._frontCrossRenderer.setVisible(this._isSelected))
    }, getSelectedState: function () {
        return this._isSelected
    },
    selectedEvent: function () {
        this._checkBoxEventCallback && this._checkBoxEventCallback(this, ccui.CheckBox.EVENT_SELECTED);
        this._checkBoxEventListener && this._checkBoxEventSelector && this._checkBoxEventSelector.call(this._checkBoxEventListener, this, ccui.CheckBox.EVENT_SELECTED)
    }, unSelectedEvent: function () {
        this._checkBoxEventCallback && this._checkBoxEventCallback(this, ccui.CheckBox.EVENT_UNSELECTED);
        this._checkBoxEventListener && this._checkBoxEventSelector && this._checkBoxEventSelector.call(this._checkBoxEventListener,
            this, ccui.CheckBox.EVENT_UNSELECTED)
    }, releaseUpEvent: function () {
        ccui.Widget.prototype.releaseUpEvent.call(this);
        this._isSelected ? (this.setSelectedState(!1), this.unSelectedEvent()) : (this.setSelectedState(!0), this.selectedEvent())
    }, addEventListenerCheckBox: function (a, b) {
        this._checkBoxEventSelector = a;
        this._checkBoxEventListener = b
    }, addEventListener: function (a) {
        this._checkBoxEventCallback = a
    }, getVirtualRendererSize: function () {
        return this._backGroundBoxRenderer.getContentSize()
    }, updateFlippedX: function () {
        this._backGroundBoxRenderer.setFlippedX(this._flippedX);
        this._backGroundSelectedBoxRenderer.setFlippedX(this._flippedX);
        this._frontCrossRenderer.setFlippedX(this._flippedX);
        this._backGroundBoxDisabledRenderer.setFlippedX(this._flippedX);
        this._frontCrossDisabledRenderer.setFlippedX(this._flippedX)
    }, updateFlippedY: function () {
        this._backGroundBoxRenderer.setFlippedY(this._flippedY);
        this._backGroundSelectedBoxRenderer.setFlippedY(this._flippedY);
        this._frontCrossRenderer.setFlippedY(this._flippedY);
        this._backGroundBoxDisabledRenderer.setFlippedY(this._flippedY);
        this._frontCrossDisabledRenderer.setFlippedY(this._flippedY)
    }, setAnchorPoint: function (a, b) {
        void 0 === b ? (ccui.Widget.prototype.setAnchorPoint.call(this, a), this._backGroundBoxRenderer.setAnchorPoint(a), this._backGroundSelectedBoxRenderer.setAnchorPoint(a), this._backGroundBoxDisabledRenderer.setAnchorPoint(a), this._frontCrossRenderer.setAnchorPoint(a), this._frontCrossDisabledRenderer.setAnchorPoint(a)) : (ccui.Widget.prototype.setAnchorPoint.call(this, a, b), this._backGroundBoxRenderer.setAnchorPoint(a, b),
            this._backGroundSelectedBoxRenderer.setAnchorPoint(a, b), this._backGroundBoxDisabledRenderer.setAnchorPoint(a, b), this._frontCrossRenderer.setAnchorPoint(a, b), this._frontCrossDisabledRenderer.setAnchorPoint(a, b))
    }, _setAnchorX: function (a) {
        ccui.Widget.prototype._setAnchorX.call(this, a);
        this._backGroundBoxRenderer._setAnchorX(a);
        this._backGroundSelectedBoxRenderer._setAnchorX(a);
        this._backGroundBoxDisabledRenderer._setAnchorX(a);
        this._frontCrossRenderer._setAnchorX(a);
        this._frontCrossDisabledRenderer._setAnchorX(a)
    },
    _setAnchorY: function (a) {
        ccui.Widget.prototype._setAnchorY.call(this, a);
        this._backGroundBoxRenderer._setAnchorY(a);
        this._backGroundSelectedBoxRenderer._setAnchorY(a);
        this._backGroundBoxDisabledRenderer._setAnchorY(a);
        this._frontCrossRenderer._setAnchorY(a);
        this._frontCrossDisabledRenderer._setAnchorY(a)
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this._frontCrossDisabledRendererAdaptDirty = this._backGroundBoxDisabledRendererAdaptDirty = this._frontCrossRendererAdaptDirty =
            this._backGroundSelectedBoxRendererAdaptDirty = this._backGroundBoxRendererAdaptDirty = !0
    }, getContentSize: function () {
        return this._backGroundBoxRenderer.getContentSize()
    }, _getWidth: function () {
        return this._backGroundBoxRenderer._getWidth()
    }, _getHeight: function () {
        return this._backGroundBoxRenderer._getHeight()
    }, getVirtualRenderer: function () {
        return this._backGroundBoxRenderer
    }, backGroundTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._backGroundBoxRenderer.setScale(1); else {
            var a = this._backGroundBoxRenderer.getContentSize();
            if (0 >= a.width || 0 >= a.height) {
                this._backGroundBoxRenderer.setScale(1);
                return
            }
            var b = this._size.height / a.height;
            this._backGroundBoxRenderer.setScaleX(this._size.width / a.width);
            this._backGroundBoxRenderer.setScaleY(b)
        }
        a = this._contentSize.width / 2;
        b = this._contentSize.height / 2;
        this._backGroundBoxRenderer.setPosition(a, b);
        this._backGroundSelectedBoxRenderer.setPosition(a, b);
        this._frontCrossRenderer.setPosition(a, b);
        this._backGroundBoxDisabledRenderer.setPosition(a, b);
        this._frontCrossDisabledRenderer.setPosition(a,
            b)
    }, backGroundSelectedTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._backGroundSelectedBoxRenderer.setScale(1); else {
            var a = this._backGroundSelectedBoxRenderer.getContentSize();
            if (0 >= a.width || 0 >= a.height)this._backGroundSelectedBoxRenderer.setScale(1); else {
                var b = this._size.height / a.height;
                this._backGroundSelectedBoxRenderer.setScaleX(this._size.width / a.width);
                this._backGroundSelectedBoxRenderer.setScaleY(b)
            }
        }
    }, frontCrossTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._frontCrossRenderer.setScale(1);
        else {
            var a = this._frontCrossRenderer.getContentSize();
            if (0 >= a.width || 0 >= a.height)this._frontCrossRenderer.setScale(1); else {
                var b = this._size.height / a.height;
                this._frontCrossRenderer.setScaleX(this._size.width / a.width);
                this._frontCrossRenderer.setScaleY(b)
            }
        }
    }, backGroundDisabledTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._backGroundBoxDisabledRenderer.setScale(1); else {
            var a = this._backGroundBoxDisabledRenderer.getContentSize();
            if (0 >= a.width || 0 >= a.height)this._backGroundBoxDisabledRenderer.setScale(1);
            else {
                var b = this._size.height / a.height;
                this._backGroundBoxDisabledRenderer.setScaleX(this._size.width / a.width);
                this._backGroundBoxDisabledRenderer.setScaleY(b)
            }
        }
    }, frontCrossDisabledTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._frontCrossDisabledRenderer.setScale(1); else {
            var a = this._frontCrossDisabledRenderer.getContentSize();
            if (0 >= a.width || 0 >= a.height)this._frontCrossDisabledRenderer.setScale(1); else {
                var b = this._size.height / a.height;
                this._frontCrossDisabledRenderer.setScaleX(this._size.width /
                    a.width);
                this._frontCrossDisabledRenderer.setScaleY(b)
            }
        }
    }, updateTextureColor: function () {
        this.updateColorToRenderer(this._backGroundBoxRenderer);
        this.updateColorToRenderer(this._backGroundSelectedBoxRenderer);
        this.updateColorToRenderer(this._frontCrossRenderer);
        this.updateColorToRenderer(this._backGroundBoxDisabledRenderer);
        this.updateColorToRenderer(this._frontCrossDisabledRenderer)
    }, updateTextureOpacity: function () {
        this.updateOpacityToRenderer(this._backGroundBoxRenderer);
        this.updateOpacityToRenderer(this._backGroundSelectedBoxRenderer);
        this.updateOpacityToRenderer(this._frontCrossRenderer);
        this.updateOpacityToRenderer(this._backGroundBoxDisabledRenderer);
        this.updateOpacityToRenderer(this._frontCrossDisabledRenderer)
    }, getDescription: function () {
        return"CheckBox"
    }, createCloneInstance: function () {
        return ccui.CheckBox.create()
    }, copySpecialProperties: function (a) {
        a instanceof ccui.CheckBox && (this.loadTextureBackGround(a._backGroundFileName, a._backGroundTexType), this.loadTextureBackGroundSelected(a._backGroundSelectedFileName, a._backGroundSelectedTexType),
            this.loadTextureFrontCross(a._frontCrossFileName, a._frontCrossTexType), this.loadTextureBackGroundDisabled(a._backGroundDisabledFileName, a._backGroundDisabledTexType), this.loadTextureFrontCrossDisabled(a._frontCrossDisabledFileName, a._frontCrossDisabledTexType), this.setSelectedState(a._isSelected), this._checkBoxEventListener = a._checkBoxEventListener, this._checkBoxEventSelector = a._checkBoxEventSelector, this._checkBoxEventCallback = a._checkBoxEventCallback)
    }, adaptRenderers: function () {
        this._backGroundBoxRendererAdaptDirty &&
        (this.backGroundTextureScaleChangedWithSize(), this._backGroundBoxRendererAdaptDirty = !1);
        this._backGroundSelectedBoxRendererAdaptDirty && (this.backGroundSelectedTextureScaleChangedWithSize(), this._backGroundSelectedBoxRendererAdaptDirty = !1);
        this._frontCrossRendererAdaptDirty && (this.frontCrossTextureScaleChangedWithSize(), this._frontCrossRendererAdaptDirty = !1);
        this._backGroundBoxDisabledRendererAdaptDirty && (this.backGroundDisabledTextureScaleChangedWithSize(), this._backGroundBoxDisabledRendererAdaptDirty = !1);
        this._frontCrossDisabledRendererAdaptDirty && (this.frontCrossDisabledTextureScaleChangedWithSize(), this._frontCrossDisabledRendererAdaptDirty = !1)
    }});
_p = ccui.CheckBox.prototype;
cc.defineGetterSetter(_p, "selected", _p.getSelectedState, _p.setSelectedState);
_p = null;
ccui.CheckBox.create = function (a, b, c, d, e, f) {
    var g = new ccui.CheckBox;
    void 0 === a ? g.init() : g.init(a, b, c, d, e, f);
    return g
};
ccui.CheckBox.EVENT_SELECTED = 0;
ccui.CheckBox.EVENT_UNSELECTED = 1;
ccui.CheckBox.BOX_RENDERER_ZORDER = -1;
ccui.CheckBox.BOX_SELECTED_RENDERER_ZORDER = -1;
ccui.CheckBox.BOX_DISABLED_RENDERER_ZORDER = -1;
ccui.CheckBox.FRONT_CROSS_RENDERER_ZORDER = -1;
ccui.CheckBox.FRONT_CROSS_DISABLED_RENDERER_ZORDER = -1;
ccui.ImageView = ccui.Widget.extend({_scale9Enabled: !1, _prevIgnoreSize: !0, _capInsets: null, _imageRenderer: null, _textureFile: "", _imageTexType: ccui.Widget.LOCAL_TEXTURE, _imageTextureSize: null, _className: "ImageView", _imageRendererAdaptDirty: !0, ctor: function () {
    this._capInsets = cc.rect(0, 0, 0, 0);
    this._imageTextureSize = cc.size(this._size.width, this._size.height);
    ccui.Widget.prototype.ctor.call(this)
}, init: function (a, b) {
    ccui.Widget.prototype.init.call(this);
    void 0 !== a && this.loadTexture(a, b);
    return!0
}, initRenderer: function () {
    this._imageRenderer =
        cc.Sprite.create();
    this.addProtectedChild(this._imageRenderer, ccui.ImageView.RENDERER_ZORDER, -1)
}, loadTexture: function (a, b) {
    if (a) {
        b = b || ccui.Widget.LOCAL_TEXTURE;
        this._textureFile = a;
        this._imageTexType = b;
        var c = this._imageRenderer;
        switch (this._imageTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._scale9Enabled ? (c.initWithFile(a), c.setCapInsets(this._capInsets)) : c.setTexture(a);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._scale9Enabled ? (c.initWithSpriteFrameName(a), c.setCapInsets(this._capInsets)) : c.setSpriteFrame(a)
        }
        this._imageTextureSize =
            c.getContentSize();
        this.updateFlippedX();
        this.updateFlippedY();
        c.setColor(this.getColor());
        c.setOpacity(this.getOpacity());
        this._updateContentSizeWithTextureSize(this._imageTextureSize);
        this._imageRendererAdaptDirty = !0
    }
}, setTextureRect: function (a) {
    this._scale9Enabled || this._imageRenderer.setTextureRect(a)
}, updateFlippedX: function () {
    this._scale9Enabled ? this._imageRenderer.setScaleX(this._flippedX ? -1 : 1) : this._imageRenderer.setFlippedX(this._flippedX)
}, updateFlippedY: function () {
    this._scale9Enabled ? this._imageRenderer.setScaleY(this._flippedY ?
        -1 : 1) : this._imageRenderer.setFlippedY(this._flippedY)
}, adaptRenderers: function () {
    this._imageRendererAdaptDirty && (this.imageTextureScaleChangedWithSize(), this._imageRendererAdaptDirty = !1)
}, setScale9Enabled: function (a) {
    this._scale9Enabled != a && (this._scale9Enabled = a, this.removeProtectedChild(this._imageRenderer), this._imageRenderer = null, this._imageRenderer = this._scale9Enabled ? cc.Scale9Sprite.create() : cc.Sprite.create(), this.loadTexture(this._textureFile, this._imageTexType), this.addProtectedChild(this._imageRenderer,
        ccui.ImageView.RENDERER_ZORDER, -1), this._scale9Enabled ? (a = this._ignoreSize, this.ignoreContentAdaptWithSize(!1), this._prevIgnoreSize = a) : this.ignoreContentAdaptWithSize(this._prevIgnoreSize), this.setCapInsets(this._capInsets))
}, isScale9Enabled: function () {
    return this._scale9Enabled
}, ignoreContentAdaptWithSize: function (a) {
    if (!this._scale9Enabled || this._scale9Enabled && !a)ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, a), this._prevIgnoreSize = a
}, setCapInsets: function (a) {
    this._capInsets = a;
    this._scale9Enabled &&
    this._imageRenderer.setCapInsets(a)
}, getCapInsets: function () {
    return this._capInsets
}, setAnchorPoint: function (a, b) {
    void 0 === b ? (ccui.Widget.prototype.setAnchorPoint.call(this, a), this._imageRenderer.setAnchorPoint(a)) : (ccui.Widget.prototype.setAnchorPoint.call(this, a, b), this._imageRenderer.setAnchorPoint(a, b))
}, _setAnchorX: function (a) {
    ccui.Widget.prototype._setAnchorX.call(this, a);
    this._imageRenderer._setAnchorX(a)
}, _setAnchorY: function (a) {
    ccui.Widget.prototype._setAnchorY.call(this, a);
    this._imageRenderer._setAnchorY(a)
},
    onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this._imageRendererAdaptDirty = !0
    }, getContentSize: function () {
        return this._imageTextureSize
    }, _getWidth: function () {
        return this._imageTextureSize.width
    }, _getHeight: function () {
        return this._imageTextureSize.height
    }, getVirtualRenderer: function () {
        return this._imageRenderer
    }, imageTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._scale9Enabled || this._imageRenderer.setScale(1); else if (this._scale9Enabled)this._imageRenderer.setPreferredSize(this._size);
        else {
            var a = this._imageRenderer.getContentSize();
            if (0 >= a.width || 0 >= a.height) {
                this._imageRenderer.setScale(1);
                return
            }
            this._imageRenderer.setScaleX(this._size.width / a.width);
            this._imageRenderer.setScaleY(this._size.height / a.height)
        }
        this._imageRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
    }, updateTextureColor: function () {
        this.updateColorToRenderer(this._imageRenderer)
    }, updateTextureOpacity: function () {
        this.updateOpacityToRenderer(this._imageRenderer)
    }, getDescription: function () {
        return"ImageView"
    },
    getVirtualRendererSize: function () {
    }, createCloneInstance: function () {
        return ccui.ImageView.create()
    }, copySpecialProperties: function (a) {
        a instanceof ccui.ImageView && (this._prevIgnoreSize = a._prevIgnoreSize, this.setScale9Enabled(a._scale9Enabled), this.loadTexture(a._textureFile, a._imageTexType), this.setCapInsets(a._capInsets))
    }});
ccui.ImageView.create = function (a, b) {
    var c = new ccui.ImageView;
    void 0 !== a && c.init(a, b);
    return c
};
ccui.ImageView.RENDERER_ZORDER = -1;
ccui.LoadingBar = ccui.Widget.extend({_direction: null, _percent: 100, _totalLength: 0, _barRenderer: null, _renderBarTexType: ccui.Widget.LOCAL_TEXTURE, _barRendererTextureSize: null, _scale9Enabled: !1, _prevIgnoreSize: !0, _capInsets: null, _textureFile: "", _isTextureLoaded: !1, _className: "LoadingBar", _barRendererAdaptDirty: !0, ctor: function () {
    this._direction = ccui.LoadingBar.TYPE_LEFT;
    this._barRendererTextureSize = cc.size(0, 0);
    this._capInsets = cc.rect(0, 0, 0, 0);
    ccui.Widget.prototype.ctor.call(this)
}, initRenderer: function () {
    this._barRenderer =
        cc.Sprite.create();
    cc.Node.prototype.addChild.call(this, this._barRenderer, ccui.LoadingBar.RENDERER_ZORDER, -1);
    this._barRenderer.setAnchorPoint(0, 0.5)
}, setDirection: function (a) {
    if (this._direction != a)switch (this._direction = a, this._direction) {
        case ccui.LoadingBar.TYPE_LEFT:
            this._barRenderer.setAnchorPoint(0, 0.5);
            this._barRenderer.setPosition(0.5 * -this._totalLength, 0);
            this._scale9Enabled || this._barRenderer.setFlippedX(!1);
            break;
        case ccui.LoadingBar.TYPE_RIGHT:
            this._barRenderer.setAnchorPoint(1, 0.5), this._barRenderer.setPosition(0.5 *
                this._totalLength, 0), this._scale9Enabled || this._barRenderer.setFlippedX(!0)
    }
}, getDirection: function () {
    return this._direction
}, loadTexture: function (a, b) {
    if (a) {
        this._renderBarTexType = b = b || ccui.Widget.LOCAL_TEXTURE;
        this._textureFile = a;
        var c = this._barRenderer;
        switch (this._renderBarTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._scale9Enabled ? (c.initWithFile(a), c.setCapInsets(this._capInsets)) : c.setTexture(a);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._scale9Enabled ? (c.initWithSpriteFrameName(a), c.setCapInsets(this._capInsets)) :
                    c.setSpriteFrame(a)
        }
        c.setColor(this.getColor());
        c.setOpacity(this.getOpacity());
        var d = c.getContentSize();
        this._barRendererTextureSize.width = d.width;
        this._barRendererTextureSize.height = d.height;
        switch (this._direction) {
            case ccui.LoadingBar.TYPE_LEFT:
                c.setAnchorPoint(0, 0.5);
                this._scale9Enabled || c.setFlippedX(!1);
                break;
            case ccui.LoadingBar.TYPE_RIGHT:
                c.setAnchorPoint(1, 0.5), this._scale9Enabled || c.setFlippedX(!0)
        }
        this.barRendererScaleChangedWithSize();
        this._updateContentSizeWithTextureSize(this._barRendererTextureSize);
        this._barRendererAdaptDirty = !0
    }
}, setScale9Enabled: function (a) {
    this._scale9Enabled != a && (this._scale9Enabled = a, this.removeProtectedChild(this._barRenderer), this._barRenderer = this._scale9Enabled ? cc.Scale9Sprite.create() : cc.Sprite.create(), this.loadTexture(this._textureFile, this._renderBarTexType), this.addProtectedChild(this._barRenderer, ccui.LoadingBar.RENDERER_ZORDER, -1), this._scale9Enabled ? (a = this._ignoreSize, this.ignoreContentAdaptWithSize(!1), this._prevIgnoreSize = a) : this.ignoreContentAdaptWithSize(this._prevIgnoreSize),
        this.setCapInsets(this._capInsets), this.setPercent(this._percent))
}, isScale9Enabled: function () {
    return this._scale9Enabled
}, setCapInsets: function (a) {
    this._capInsets = a;
    this._scale9Enabled && this._barRenderer.setCapInsets(a)
}, getCapInsets: function () {
    return this._capInsets
}, setPercent: function (a) {
    if (!(0 > a || 100 < a) && !(0 >= this._totalLength))if (this._percent = a, a = this._percent / 100, this._scale9Enabled)this.setScale9Scale(); else {
        var b = this._barRenderer.getTextureRect();
        this._barRenderer.setTextureRect(cc.rect(b.x,
            b.y, this._barRendererTextureSize.width * a, this._barRendererTextureSize.height))
    }
}, getPercent: function () {
    return this._percent
}, onSizeChanged: function () {
    ccui.Widget.prototype.onSizeChanged.call(this);
    this._barRendererAdaptDirty = !0
}, ignoreContentAdaptWithSize: function (a) {
    if (!this._scale9Enabled || this._scale9Enabled && !a)ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, a), this._prevIgnoreSize = a
}, getVirtualRendererSize: function () {
    return this._barRendererTextureSize
}, getContentSize: function () {
    return this._barRendererTextureSize
},
    _getWidth: function () {
        return this._barRendererTextureSize.width
    }, _getHeight: function () {
        return this._barRendererTextureSize.height
    }, getVirtualRenderer: function () {
        return this._barRenderer
    }, barRendererScaleChangedWithSize: function () {
        var a = this._barRenderer;
        if (this._ignoreSize)this._scale9Enabled || (this._totalLength = this._barRendererTextureSize.width, a.setScale(1)); else if (this._totalLength = this._size.width, this._scale9Enabled)this.setScale9Scale(); else {
            var b = this._barRendererTextureSize;
            if (0 >= b.width ||
                0 >= b.height) {
                a.setScale(1);
                return
            }
            var c = this._size.height / b.height;
            a.setScaleX(this._size.width / b.width);
            a.setScaleY(c)
        }
        switch (this._direction) {
            case ccui.LoadingBar.TYPE_LEFT:
                a.setPosition(0, 0.5 * this._contentSize.height);
                break;
            case ccui.LoadingBar.TYPE_RIGHT:
                a.setPosition(this._totalLength, 0.5 * this._contentSize.height)
        }
    }, adaptRenderers: function () {
        this._barRendererAdaptDirty && (this.barRendererScaleChangedWithSize(), this._barRendererAdaptDirty = !1)
    }, setScale9Scale: function () {
        this._barRenderer.setPreferredSize(cc.size(this._percent /
            100 * this._totalLength, this._size.height))
    }, updateTextureColor: function () {
        this.updateColorToRenderer(this._barRenderer)
    }, updateTextureOpacity: function () {
        this.updateOpacityToRenderer(this._barRenderer)
    }, getDescription: function () {
        return"LoadingBar"
    }, createCloneInstance: function () {
        return ccui.LoadingBar.create()
    }, copySpecialProperties: function (a) {
        a instanceof ccui.LoadingBar && (this._prevIgnoreSize = a._prevIgnoreSize, this.setScale9Enabled(a._scale9Enabled), this.loadTexture(a._textureFile, a._renderBarTexType),
            this.setCapInsets(a._capInsets), this.setPercent(a._percent), this.setDirection(a._direction))
    }});
_p = ccui.LoadingBar.prototype;
cc.defineGetterSetter(_p, "direction", _p.getDirection, _p.setDirection);
cc.defineGetterSetter(_p, "percent", _p.getPercent, _p.setPercent);
_p = null;
ccui.LoadingBar.create = function (a, b) {
    var c = new ccui.LoadingBar;
    void 0 !== a && c.loadTexture(a);
    void 0 !== b && c.setPercent(b);
    return c
};
ccui.LoadingBar.TYPE_LEFT = 0;
ccui.LoadingBar.TYPE_RIGHT = 1;
ccui.LoadingBar.RENDERER_ZORDER = -1;
ccui.Slider = ccui.Widget.extend({_barRenderer: null, _progressBarRenderer: null, _progressBarTextureSize: null, _slidBallNormalRenderer: null, _slidBallPressedRenderer: null, _slidBallDisabledRenderer: null, _slidBallRenderer: null, _barLength: 0, _percent: 0, _scale9Enabled: !1, _prevIgnoreSize: !0, _textureFile: "", _progressBarTextureFile: "", _slidBallNormalTextureFile: "", _slidBallPressedTextureFile: "", _slidBallDisabledTextureFile: "", _capInsetsBarRenderer: null, _capInsetsProgressBarRenderer: null, _sliderEventListener: null,
    _sliderEventSelector: null, _barTexType: ccui.Widget.LOCAL_TEXTURE, _progressBarTexType: ccui.Widget.LOCAL_TEXTURE, _ballNTexType: ccui.Widget.LOCAL_TEXTURE, _ballPTexType: ccui.Widget.LOCAL_TEXTURE, _ballDTexType: ccui.Widget.LOCAL_TEXTURE, _isTextureLoaded: !1, _className: "Slider", _barRendererAdaptDirty: !0, _progressBarRendererDirty: !0, ctor: function () {
        this._progressBarTextureSize = cc.size(0, 0);
        this._capInsetsBarRenderer = cc.rect(0, 0, 0, 0);
        this._capInsetsProgressBarRenderer = cc.rect(0, 0, 0, 0);
        ccui.Widget.prototype.ctor.call(this)
    },
    init: function () {
        return ccui.Widget.prototype.init.call(this) ? !0 : !1
    }, initRenderer: function () {
        this._barRenderer = cc.Sprite.create();
        this._progressBarRenderer = cc.Sprite.create();
        this._progressBarRenderer.setAnchorPoint(0, 0.5);
        this.addProtectedChild(this._barRenderer, ccui.Slider.BASEBAR_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._progressBarRenderer, ccui.Slider.PROGRESSBAR_RENDERER_ZORDER, -1);
        this._slidBallNormalRenderer = cc.Sprite.create();
        this._slidBallPressedRenderer = cc.Sprite.create();
        this._slidBallPressedRenderer.setVisible(!1);
        this._slidBallDisabledRenderer = cc.Sprite.create();
        this._slidBallDisabledRenderer.setVisible(!1);
        this._slidBallRenderer = cc.Node.create();
        this._slidBallRenderer.addChild(this._slidBallNormalRenderer);
        this._slidBallRenderer.addChild(this._slidBallPressedRenderer);
        this._slidBallRenderer.addChild(this._slidBallDisabledRenderer);
        this.addProtectedChild(this._slidBallRenderer, ccui.Slider.BALL_RENDERER_ZORDER, -1)
    }, loadBarTexture: function (a, b) {
        if (a) {
            b = b || ccui.Widget.LOCAL_TEXTURE;
            this._textureFile = a;
            this._barTexType =
                b;
            var c = this._barRenderer;
            switch (this._barTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    this._scale9Enabled ? c.initWithFile(a) : c.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    this._scale9Enabled ? c.initWithSpriteFrameName(a) : c.setSpriteFrame(a)
            }
            c.setColor(this.getColor());
            c.setOpacity(this.getOpacity());
            this._progressBarRendererDirty = this._barRendererAdaptDirty = !0;
            this._updateContentSizeWithTextureSize(this._barRenderer.getContentSize())
        }
    }, loadProgressBarTexture: function (a, b) {
        if (a) {
            b = b || ccui.Widget.LOCAL_TEXTURE;
            this._progressBarTextureFile = a;
            this._progressBarTexType = b;
            var c = this._progressBarRenderer;
            switch (this._progressBarTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    this._scale9Enabled ? c.initWithFile(a) : c.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    this._scale9Enabled ? c.initWithSpriteFrameName(a) : c.setSpriteFrame(a)
            }
            this._progressBarRenderer.setColor(this.getColor());
            this._progressBarRenderer.setOpacity(this.getOpacity());
            this._progressBarRenderer.setAnchorPoint(cc.p(0, 0.5));
            c = this._progressBarRenderer.getContentSize();
            this._progressBarTextureSize = {width: c.width, height: c.height};
            this._progressBarRendererDirty = !0
        }
    }, setScale9Enabled: function (a) {
        this._scale9Enabled != a && (this._scale9Enabled = a, this.removeProtectedChild(this._barRenderer, !0), this.removeProtectedChild(this._progressBarRenderer, !0), this._progressBarRenderer = this._barRenderer = null, this._scale9Enabled ? (this._barRenderer = cc.Scale9Sprite.create(), this._progressBarRenderer = cc.Scale9Sprite.create()) : (this._barRenderer = cc.Sprite.create(), this._progressBarRenderer =
            cc.Sprite.create()), this.loadBarTexture(this._textureFile, this._barTexType), this.loadProgressBarTexture(this._progressBarTextureFile, this._progressBarTexType), this.addProtectedChild(this._barRenderer, ccui.Slider.BASEBAR_RENDERER_ZORDER, -1), this.addProtectedChild(this._progressBarRenderer, ccui.Slider.PROGRESSBAR_RENDERER_ZORDER, -1), this._scale9Enabled ? (a = this._ignoreSize, this.ignoreContentAdaptWithSize(!1), this._prevIgnoreSize = a) : this.ignoreContentAdaptWithSize(this._prevIgnoreSize), this.setCapInsetsBarRenderer(this._capInsetsBarRenderer),
            this.setCapInsetProgressBarRenderer(this._capInsetsProgressBarRenderer))
    }, isScale9Enabled: function () {
        return this._scale9Enabled
    }, ignoreContentAdaptWithSize: function (a) {
        if (!this._scale9Enabled || this._scale9Enabled && !a)ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, a), this._prevIgnoreSize = a
    }, setCapInsets: function (a) {
        this.setCapInsetsBarRenderer(a);
        this.setCapInsetProgressBarRenderer(a)
    }, setCapInsetsBarRenderer: function (a) {
        this._capInsetsBarRenderer = a;
        this._scale9Enabled && this._barRenderer.setCapInsets(a)
    },
    getCapInsetsBarRenderer: function () {
        return this._capInsetsBarRenderer
    }, setCapInsetProgressBarRenderer: function (a) {
        this._capInsetsProgressBarRenderer = a;
        this._scale9Enabled && this._progressBarRenderer.setCapInsets(a)
    }, getCapInsetsProgressBarRebderer: function () {
        return this._capInsetsProgressBarRenderer
    }, loadSlidBallTextures: function (a, b, c, d) {
        this.loadSlidBallTextureNormal(a, d);
        this.loadSlidBallTexturePressed(b, d);
        this.loadSlidBallTextureDisabled(c, d)
    }, loadSlidBallTextureNormal: function (a, b) {
        if (a) {
            b = b ||
                ccui.Widget.LOCAL_TEXTURE;
            this._slidBallNormalTextureFile = a;
            this._ballNTexType = b;
            switch (this._ballNTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    this._slidBallNormalRenderer.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    this._slidBallNormalRenderer.setSpriteFrame(a)
            }
            this._slidBallNormalRenderer.setColor(this.getColor());
            this._slidBallNormalRenderer.setOpacity(this.getOpacity())
        }
    }, loadSlidBallTexturePressed: function (a, b) {
        if (a) {
            b = b || ccui.Widget.LOCAL_TEXTURE;
            this._slidBallPressedTextureFile = a;
            this._ballPTexType =
                b;
            switch (this._ballPTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    this._slidBallPressedRenderer.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    this._slidBallPressedRenderer.setSpriteFrame(a)
            }
            this._slidBallPressedRenderer.setColor(this.getColor());
            this._slidBallPressedRenderer.setOpacity(this.getOpacity())
        }
    }, loadSlidBallTextureDisabled: function (a, b) {
        if (a) {
            b = b || ccui.Widget.LOCAL_TEXTURE;
            this._slidBallDisabledTextureFile = a;
            this._ballDTexType = b;
            switch (this._ballDTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    this._slidBallDisabledRenderer.setTexture(a);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    this._slidBallDisabledRenderer.setSpriteFrame(a)
            }
            this._slidBallDisabledRenderer.setColor(this.getColor());
            this._slidBallDisabledRenderer.setOpacity(this.getOpacity())
        }
    }, setPercent: function (a) {
        100 < a && (a = 100);
        0 > a && (a = 0);
        this._percent = a;
        a = this._barLength * (a / 100);
        this._slidBallRenderer.setPosition(cc.p(a, this._contentSize.height / 2));
        if (this._scale9Enabled)this._progressBarRenderer.setPreferredSize(cc.size(a, this._progressBarTextureSize.height)); else {
            var b = this._progressBarRenderer,
                c = b.getTextureRect();
            b.setTextureRect(cc.rect(c.x, c.y, a, c.height), b.isTextureRectRotated())
        }
    }, hitTest: function (a) {
        a = this._slidBallNormalRenderer.convertToNodeSpace(a);
        var b = this._slidBallNormalRenderer.getContentSize(), b = cc.rect(0, 0, b.width, b.height);
        return cc.rectContainsPoint(b, a)
    }, onTouchBegan: function (a, b) {
        var c = ccui.Widget.prototype.onTouchBegan.call(this, a, b);
        if (this._hitted) {
            var d = this.convertToNodeSpace(this._touchBeganPosition);
            this.setPercent(this.getPercentWithBallPos(d.x));
            this.percentChangedEvent()
        }
        return c
    },
    onTouchMoved: function (a, b) {
        var c = a.getLocation(), c = this.convertToNodeSpace(c);
        this.setPercent(this.getPercentWithBallPos(c.x));
        this.percentChangedEvent()
    }, onTouchEnded: function (a, b) {
        ccui.Widget.prototype.onTouchEnded.call(this, a, b)
    }, onTouchCancelled: function (a, b) {
        ccui.Widget.prototype.onTouchCancelled.call(this, a, b)
    }, getPercentWithBallPos: function (a) {
        return 100 * (a / this._barLength)
    }, addEventListenerSlider: function (a, b) {
        this._sliderEventSelector = a;
        this._sliderEventListener = b
    }, addEventListener: function (a) {
        this._eventCallback =
            a
    }, percentChangedEvent: function () {
        this._sliderEventListener && this._sliderEventSelector && this._sliderEventSelector.call(this._sliderEventListener, this, ccui.Slider.EVENT_PERCENT_CHANGED);
        this._eventCallback && this._eventCallback(ccui.Slider.EVENT_PERCENT_CHANGED)
    }, getPercent: function () {
        return this._percent
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this._progressBarRendererDirty = this._barRendererAdaptDirty = !0
    }, adaptRenderers: function () {
        this._barRendererAdaptDirty && (this.barRendererScaleChangedWithSize(),
            this._barRendererAdaptDirty = !1);
        this._progressBarRendererDirty && (this.progressBarRendererScaleChangedWithSize(), this._progressBarRendererDirty = !1)
    }, getVirtualRendererSize: function () {
        return this._barRenderer.getContentSize()
    }, getVirtualRenderer: function () {
        return this._barRenderer
    }, barRendererScaleChangedWithSize: function () {
        if (this._ignoreSize)this._barRenderer.setScale(1), this._barLength = this._contentSize.width; else if (this._barLength = this._contentSize.width, this._scale9Enabled)this._barRenderer.setPreferredSize(this._contentSize);
        else {
            var a = this._barRenderer.getContentSize();
            if (0 >= a.width || 0 >= a.height) {
                this._barRenderer.setScale(1);
                return
            }
            var b = this._contentSize.height / a.height;
            this._barRenderer.setScaleX(this._contentSize.width / a.width);
            this._barRenderer.setScaleY(b)
        }
        this._barRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2);
        this.setPercent(this._percent)
    }, progressBarRendererScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            if (!this._scale9Enabled) {
                var a = this._progressBarTextureSize, b = this._contentSize.width /
                    a.width, a = this._contentSize.height / a.height;
                this._progressBarRenderer.setScaleX(b);
                this._progressBarRenderer.setScaleY(a)
            }
        } else if (this._scale9Enabled)this._progressBarRenderer.setPreferredSize(this._contentSize), this._progressBarTextureSize = this._progressBarRenderer.getContentSize(); else {
            a = this._progressBarTextureSize;
            if (0 >= a.width || 0 >= a.height) {
                this._progressBarRenderer.setScale(1);
                return
            }
            b = this._contentSize.width / a.width;
            a = this._contentSize.height / a.height;
            this._progressBarRenderer.setScaleX(b);
            this._progressBarRenderer.setScaleY(a)
        }
        this._progressBarRenderer.setPosition(0, this._contentSize.height / 2);
        this.setPercent(this._percent)
    }, getContentSize: function () {
        var a = this._barRenderer.getContentSize();
        return cc.size(a.width, a.height)
    }, _getWidth: function () {
        return this._barRenderer._getWidth()
    }, _getHeight: function () {
        return this._barRenderer._getHeight()
    }, onPressStateChangedToNormal: function () {
        this._slidBallNormalRenderer.setVisible(!0);
        this._slidBallPressedRenderer.setVisible(!1);
        this._slidBallDisabledRenderer.setVisible(!1)
    },
    onPressStateChangedToPressed: function () {
        this._slidBallNormalRenderer.setVisible(!1);
        this._slidBallPressedRenderer.setVisible(!0);
        this._slidBallDisabledRenderer.setVisible(!1)
    }, onPressStateChangedToDisabled: function () {
        this._slidBallNormalRenderer.setVisible(!1);
        this._slidBallPressedRenderer.setVisible(!1);
        this._slidBallDisabledRenderer.setVisible(!0)
    }, getDescription: function () {
        return"Slider"
    }, createCloneInstance: function () {
        return ccui.Slider.create()
    }, copySpecialProperties: function (a) {
        this._prevIgnoreSize =
            a._prevIgnoreSize;
        this.setScale9Enabled(a._scale9Enabled);
        this.loadBarTexture(a._textureFile, a._barTexType);
        this.loadProgressBarTexture(a._progressBarTextureFile, a._progressBarTexType);
        this.loadSlidBallTextureNormal(a._slidBallNormalTextureFile, a._ballNTexType);
        this.loadSlidBallTexturePressed(a._slidBallPressedTextureFile, a._ballPTexType);
        this.loadSlidBallTextureDisabled(a._slidBallDisabledTextureFile, a._ballDTexType);
        this.setPercent(a.getPercent());
        this._sliderEventListener = a._sliderEventListener;
        this._sliderEventSelector = a._sliderEventSelector;
        this._eventCallback = a._eventCallback
    }, updateTextureColor: function () {
        this.updateColorToRenderer(this._barRenderer);
        this.updateColorToRenderer(this._progressBarRenderer);
        this.updateColorToRenderer(this._slidBallNormalRenderer);
        this.updateColorToRenderer(this._slidBallPressedRenderer);
        this.updateColorToRenderer(this._slidBallDisabledRenderer)
    }, updateTextureOpacity: function () {
        this.updateOpacityToRenderer(this._barRenderer);
        this.updateOpacityToRenderer(this._progressBarRenderer);
        this.updateOpacityToRenderer(this._slidBallNormalRenderer);
        this.updateOpacityToRenderer(this._slidBallPressedRenderer);
        this.updateOpacityToRenderer(this._slidBallDisabledRenderer)
    }});
_p = ccui.Slider.prototype;
cc.defineGetterSetter(_p, "percent", _p.getPercent, _p.setPercent);
_p = null;
ccui.Slider.create = function () {
    var a = new ccui.Slider;
    return a && a.init() ? a : null
};
ccui.Slider.EVENT_PERCENT_CHANGED = 0;
ccui.Slider.BASEBAR_RENDERER_ZORDER = -3;
ccui.Slider.PROGRESSBAR_RENDERER_ZORDER = -2;
ccui.Slider.BALL_RENDERER_ZORDER = -1;
ccui.Text = ccui.Widget.extend({_touchScaleChangeEnabled: !1, _normalScaleValueX: 1, _normalScaleValueY: 1, _fontName: "Thonburi", _fontSize: 10, _onSelectedScaleOffset: 0.5, _labelRenderer: "", _textAreaSize: null, _textVerticalAlignment: 0, _textHorizontalAlignment: 0, _className: "Text", _type: null, _labelRendererAdaptDirty: !0, ctor: function () {
    this._type = ccui.Text.Type.SYSTEM;
    this._textAreaSize = cc.size(0, 0);
    ccui.Widget.prototype.ctor.call(this)
}, init: function (a, b, c) {
    return ccui.Widget.prototype.init.call(this) ? (0 < arguments.length &&
        (this.setString(a), this.setFontName(b), this.setFontSize(c)), !0) : !1
}, initRenderer: function () {
    this._labelRenderer = cc.LabelTTF.create();
    cc.Node.prototype.addChild.call(this, this._labelRenderer, ccui.Text.RENDERER_ZORDER, -1)
}, setText: function (a) {
    cc.log("Please use the setString");
    this.setString(a)
}, setString: function (a) {
    this._labelRenderer.setString(a);
    this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
    this._labelRendererAdaptDirty = !0
}, getStringValue: function () {
    cc.log("Please use the getString");
    return this._labelRenderer.getString()
}, getString: function () {
    return this._labelRenderer.getString()
}, getStringLength: function () {
    return this._labelRenderer.getStringLength()
}, setFontSize: function (a) {
    this._fontSize = a;
    this._labelRenderer.setFontSize(a);
    this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
    this._labelRendererAdaptDirty = !0
}, getFontSize: function () {
    return this._fontSize
}, setFontName: function (a) {
    this._fontName = a;
    this._labelRenderer.setFontName(a);
    this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
    this._labelRendererAdaptDirty = !0
}, setTextAreaSize: function (a) {
    this._labelRenderer.setDimensions(a);
    this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
    this._labelRendererAdaptDirty = !0
}, getTextAreaSize: function () {
    return this._labelRenderer.getDimensions()
}, setTextHorizontalAlignment: function (a) {
    this._labelRenderer.setHorizontalAlignment(a);
    this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
    this._labelRendererAdaptDirty = !0
}, getTextHorizontalAlignment: function () {
    return this._labelRenderer.getHorizontalAlignment()
},
    setTextVerticalAlignment: function (a) {
        this._labelRenderer.setVerticalAlignment(a);
        this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
        this._labelRendererAdaptDirty = !0
    }, getTextVerticalAlignment: function () {
        return this._labelRenderer.getVerticalAlignment()
    }, setTouchScaleChangeEnabled: function (a) {
        this._touchScaleChangeEnabled = a
    }, isTouchScaleChangeEnabled: function () {
        return this._touchScaleChangeEnabled
    }, onPressStateChangedToNormal: function () {
        this._touchScaleChangeEnabled && (this._labelRenderer.setScaleX(this._normalScaleValueX),
            this._labelRenderer.setScaleY(this._normalScaleValueY))
    }, onPressStateChangedToPressed: function () {
        this._touchScaleChangeEnabled && (this._labelRenderer.setScaleX(this._normalScaleValueX + this._onSelectedScaleOffset), this._labelRenderer.setScaleY(this._normalScaleValueY + this._onSelectedScaleOffset))
    }, onPressStateChangedToDisabled: function () {
    }, updateFlippedX: function () {
        this._flippedX ? this._labelRenderer.setScaleX(-1) : this._labelRenderer.setScaleX(1)
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this._labelRendererAdaptDirty = !0
    }, adaptRenderers: function () {
        this._labelRendererAdaptDirty && (this.labelScaleChangedWithSize(), this._labelRendererAdaptDirty = !1)
    }, getVirtualRendererSize: function () {
        return this._labelRenderer.getContentSize()
    }, getVirtualRenderer: function () {
        return this._labelRenderer
    }, labelScaleChangedWithSize: function () {
        if (this._ignoreSize)this._labelRenderer.setScale(1), this._normalScaleValueX = this._normalScaleValueY = 1; else {
            this._labelRenderer.setDimensions(cc.size(this._contentSize.width,
                this._contentSize.height));
            var a = this._labelRenderer.getContentSize();
            if (0 >= a.width || 0 >= a.height) {
                this._labelRenderer.setScale(1);
                return
            }
            var b = this._contentSize.width / a.width, a = this._contentSize.height / a.height;
            this._labelRenderer.setScaleX(b);
            this._labelRenderer.setScaleY(a);
            this._normalScaleValueX = b;
            this._normalScaleValueY = a
        }
        this._labelRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
    }, getDescription: function () {
        return"Label"
    }, enableShadow: function (a, b, c) {
        this._labelRenderer.enableShadow(a,
            b, c)
    }, enableOutline: function (a, b) {
        this._labelRenderer.enableOutline(a, b)
    }, enableGlow: function (a) {
        this._type == ccui.Text.Type.TTF && this._labelRenderer.enableGlow(a)
    }, disableEffect: function () {
        this._labelRenderer.disableEffect()
    }, createCloneInstance: function () {
        return ccui.Text.create()
    }, getFontName: function () {
        return this._fontName
    }, getType: function () {
        return this._type
    }, _setFont: function (a) {
        var b = cc.LabelTTF._fontStyleRE.exec(a);
        b && (this._fontSize = parseInt(b[1]), this._fontName = b[2], this._labelRenderer._setFont(a),
            this.labelScaleChangedWithSize())
    }, _getFont: function () {
        return this._labelRenderer._getFont()
    }, _setBoundingWidth: function (a) {
        this._textAreaSize.width = a;
        this._labelRenderer._setBoundingWidth(a);
        this.labelScaleChangedWithSize()
    }, _setBoundingHeight: function (a) {
        this._textAreaSize.height = a;
        this._labelRenderer._setBoundingHeight(a);
        this.labelScaleChangedWithSize()
    }, _getBoundingWidth: function () {
        return this._textAreaSize.width
    }, _getBoundingHeight: function () {
        return this._textAreaSize.height
    }, copySpecialProperties: function (a) {
        a instanceof
        a && (this.setFontName(a._fontName), this.setFontSize(a.getFontSize()), this.setString(a.getString()), this.setTouchScaleChangeEnabled(a.touchScaleEnabled), this.setTextAreaSize(a._textAreaSize), this.setTextHorizontalAlignment(a._labelRenderer.getHorizontalAlignment()), this.setTextVerticalAlignment(a._labelRenderer.getVerticalAlignment()))
    }});
_p = ccui.Text.prototype;
cc.defineGetterSetter(_p, "boundingWidth", _p._getBoundingWidth, _p._setBoundingWidth);
cc.defineGetterSetter(_p, "boundingHeight", _p._getBoundingHeight, _p._setBoundingHeight);
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
cc.defineGetterSetter(_p, "stringLength", _p.getStringLength);
cc.defineGetterSetter(_p, "font", _p._getFont, _p._setFont);
cc.defineGetterSetter(_p, "fontSize", _p.getFontSize, _p.setFontSize);
cc.defineGetterSetter(_p, "fontName", _p.getFontName, _p.setFontName);
cc.defineGetterSetter(_p, "textAlign", _p.getTextHorizontalAlignment, _p.setTextHorizontalAlignment);
cc.defineGetterSetter(_p, "verticalAlign", _p.getTextVerticalAlignment, _p.setTextVerticalAlignment);
_p = null;
ccui.Label = ccui.Text.create = function (a, b, c) {
    var d = new ccui.Text;
    if (0 < arguments.length) {
        if (d && d.init(a, b, c))return d
    } else if (d && d.init())return d;
    return null
};
ccui.Text.RENDERER_ZORDER = -1;
ccui.Text.Type = {SYSTEM: 0, TTF: 1};
ccui.TextAtlas = ccui.Widget.extend({_labelAtlasRenderer: null, _stringValue: "", _charMapFileName: "", _itemWidth: 0, _itemHeight: 0, _startCharMap: "", _className: "TextAtlas", _labelAtlasRendererAdaptDirty: null, ctor: function () {
    ccui.Widget.prototype.ctor.call(this)
}, initRenderer: function () {
    this._labelAtlasRenderer = new cc.LabelAtlas;
    this._labelAtlasRenderer.setAnchorPoint(cc.p(0.5, 0.5));
    this.addProtectedChild(this._labelAtlasRenderer, ccui.TextAtlas.RENDERER_ZORDER, -1)
}, setProperty: function (a, b, c, d, e) {
    this._stringValue =
        a;
    this._charMapFileName = b;
    this._itemWidth = c;
    this._itemHeight = d;
    this._startCharMap = e;
    this._labelAtlasRenderer.initWithString(a, this._charMapFileName, this._itemWidth, this._itemHeight, this._startCharMap[0]);
    this._updateContentSizeWithTextureSize(this._labelAtlasRenderer.getContentSize());
    this._labelAtlasRendererAdaptDirty = !0
}, setString: function (a) {
    this._stringValue = a;
    this._labelAtlasRenderer.setString(a);
    this._updateContentSizeWithTextureSize(this._labelAtlasRenderer.getContentSize());
    this._labelAtlasRendererAdaptDirty = !0
}, setStringValue: function (a) {
    cc.log("Please use the setString");
    this.setString(a)
}, getStringValue: function () {
    cc.log("Please use the getString");
    return this.getString()
}, getString: function () {
    return this._labelAtlasRenderer.getString()
}, getStringLength: function () {
    return this._labelAtlasRenderer.getStringLength()
}, onSizeChanged: function () {
    ccui.Widget.prototype.onSizeChanged.call(this);
    this._labelAtlasRendererAdaptDirty = !0
}, adaptRenderers: function () {
    this._labelAtlasRendererAdaptDirty && (this.labelAtlasScaleChangedWithSize(),
        this._labelAtlasRendererAdaptDirty = !1)
}, getVirtualRendererSize: function () {
    return this._labelAtlasRenderer.getContentSize()
}, getVirtualRenderer: function () {
    return this._labelAtlasRenderer
}, labelAtlasScaleChangedWithSize: function () {
    if (this._ignoreSize)this._labelAtlasRenderer.setScale(1); else {
        var a = this._labelAtlasRenderer.getContentSize();
        if (0 >= a.width || 0 >= a.height) {
            this._labelAtlasRenderer.setScale(1);
            return
        }
        var b = this._size.height / a.height;
        this._labelAtlasRenderer.setScaleX(this._size.width / a.width);
        this._labelAtlasRenderer.setScaleY(b)
    }
    this._labelAtlasRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
}, getDescription: function () {
    return"LabelAtlas"
}, createCloneInstance: function () {
    return ccui.TextAtlas.create()
}, copySpecialProperties: function (a) {
    a && this.setProperty(a._stringValue, a._charMapFileName, a._itemWidth, a._itemHeight, a._startCharMap)
}});
_p = ccui.TextAtlas.prototype;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
_p = null;
ccui.TextAtlas.create = function (a, b, c, d, e) {
    var f = new ccui.TextAtlas;
    return f && f.init() ? (0 < arguments.length && f.setProperty(a, b, c, d, e), f) : null
};
ccui.TextAtlas.RENDERER_ZORDER = -1;
ccui.LabelBMFont = ccui.TextBMFont = ccui.Widget.extend({_labelBMFontRenderer: null, _fntFileHasInit: !1, _fntFileName: "", _stringValue: "", _className: "TextBMFont", _labelBMFontRendererAdaptDirty: !0, ctor: function () {
    ccui.Widget.prototype.ctor.call(this)
}, initRenderer: function () {
    this._labelBMFontRenderer = cc.LabelBMFont.create();
    this.addProtectedChild(this._labelBMFontRenderer, ccui.TextBMFont.RENDERER_ZORDER, -1)
}, setFntFile: function (a) {
    a && (this._fntFileName = a, this._labelBMFontRenderer.initWithString("", a), this.updateAnchorPoint(),
        this.labelBMFontScaleChangedWithSize(), this._labelBMFontRenderer.textureLoaded() || this._labelBMFontRenderer.addLoadedEventListener(function () {
        this.labelBMFontScaleChangedWithSize()
    }, this), this._labelBMFontRenderer.setColor(this.getColor()), this._labelBMFontRenderer.setOpacity(this.getOpacity()), this._fntFileHasInit = !0, this.setString(this._stringValue))
}, setText: function (a) {
    cc.log("Please use the setString");
    this.setString(a)
}, setString: function (a) {
    this._stringValue = a;
    this._fntFileHasInit && (this._labelBMFontRenderer.setString(a),
        this._updateContentSizeWithTextureSize(this._labelBMFontRenderer.getContentSize()), this._labelBMFontRendererAdaptDirty = !0)
}, getString: function () {
    return this._stringValue
}, getStringLength: function () {
    return this._labelBMFontRenderer.getStringLength()
}, onSizeChanged: function () {
    ccui.Widget.prototype.onSizeChanged.call(this);
    this._labelBMFontRendererAdaptDirty = !0
}, adaptRenderers: function () {
    this._labelBMFontRendererAdaptDirty && (this.labelBMFontScaleChangedWithSize(), this._labelBMFontRendererAdaptDirty = !1)
}, getVirtualRendererSize: function () {
    return this._labelBMFontRenderer.getContentSize()
}, getVirtualRenderer: function () {
    return this._labelBMFontRenderer
}, labelBMFontScaleChangedWithSize: function () {
    if (this._ignoreSize)this._labelBMFontRenderer.setScale(1); else {
        var a = this._labelBMFontRenderer.getContentSize();
        if (0 >= a.width || 0 >= a.height) {
            this._labelBMFontRenderer.setScale(1);
            return
        }
        var b = this._size.height / a.height;
        this._labelBMFontRenderer.setScaleX(this._size.width / a.width);
        this._labelBMFontRenderer.setScaleY(b)
    }
    this._labelBMFontRenderer.setPosition(this._contentSize.width /
        2, this._contentSize.height / 2)
}, getDescription: function () {
    return"LabelBMFont"
}});
_p = ccui.TextBMFont.prototype;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setStringValue);
_p = null;
ccui.TextBMFont.create = function (a, b) {
    var c = new ccui.TextBMFont;
    return c && c.init() ? (b && a && (c.setFntFile(b), c.setString(a)), c) : null
};
ccui.TextBMFont.RENDERER_ZORDER = -1;
ccui.UICCTextField = cc.TextFieldTTF.extend({maxLengthEnabled: !1, maxLength: 0, passwordEnabled: !1, _passwordStyleText: "", _attachWithIME: !1, _detachWithIME: !1, _insertText: !1, _deleteBackward: !1, _className: "UICCTextField", _textFieldRendererAdaptDirty: !0, ctor: function () {
    cc.TextFieldTTF.prototype.ctor.call(this);
    this.maxLengthEnabled = !1;
    this.maxLength = 0;
    this.passwordEnabled = !1;
    this._passwordStyleText = "*";
    this._deleteBackward = this._insertText = this._detachWithIME = this._attachWithIME = !1
}, onEnter: function () {
    cc.TextFieldTTF.prototype.setDelegate.call(this,
        this)
}, onTextFieldAttachWithIME: function (a) {
    this.setAttachWithIME(!0);
    return!1
}, onTextFieldInsertText: function (a, b, c) {
    if (1 == c && "\n" == b)return!1;
    this.setInsertText(!0);
    return this.maxLengthEnabled && cc.TextFieldTTF.prototype.getCharCount.call(this) >= this.maxLength ? !0 : !1
}, onTextFieldDeleteBackward: function (a, b, c) {
    this.setDeleteBackward(!0);
    return!1
}, onTextFieldDetachWithIME: function (a) {
    this.setDetachWithIME(!0);
    return!1
}, insertText: function (a, b) {
    "\n" != a && this.maxLengthEnabled && this.getString().length >=
        this.maxLength ? this.passwordEnabled && this.setPasswordText(this.getString()) : (cc.TextFieldTTF.prototype.insertText.call(this, a, b), this.passwordEnabled && 0 < cc.TextFieldTTF.prototype.getCharCount.call(this) && this.setPasswordText(this.getString()))
}, deleteBackward: function () {
    cc.TextFieldTTF.prototype.deleteBackward.call(this);
    0 < cc.TextFieldTTF.prototype.getCharCount.call(this) && this.passwordEnabled && this.setPasswordText(this._inputText)
}, openIME: function () {
    cc.TextFieldTTF.prototype.attachWithIME.call(this)
},
    closeIME: function () {
        cc.TextFieldTTF.prototype.detachWithIME.call(this)
    }, setMaxLengthEnabled: function (a) {
        this.maxLengthEnabled = a
    }, isMaxLengthEnabled: function () {
        return this.maxLengthEnabled
    }, setMaxLength: function (a) {
        this.maxLength = a
    }, getMaxLength: function () {
        return this.maxLength
    }, getCharCount: function () {
        return cc.TextFieldTTF.prototype.getCharCount.call(this)
    }, setPasswordEnabled: function (a) {
        this.passwordEnabled = a
    }, isPasswordEnabled: function () {
        return this.passwordEnabled
    }, setPasswordStyleText: function (a) {
        if (!(1 <
            a.length)) {
            var b = a.charCodeAt(0);
            33 > b || 126 < b || (this._passwordStyleText = a)
        }
    }, setPasswordText: function (a) {
        var b = "", c = a.length;
        a = c;
        this.maxLengthEnabled && c > this.maxLength && (a = this.maxLength);
        for (c = 0; c < a; ++c)b += this._passwordStyleText;
        cc.LabelTTF.prototype.setString.call(this, b)
    }, setAttachWithIME: function (a) {
        this._attachWithIME = a
    }, getAttachWithIME: function () {
        return this._attachWithIME
    }, setDetachWithIME: function (a) {
        this._detachWithIME = a
    }, getDetachWithIME: function () {
        return this._detachWithIME
    }, setInsertText: function (a) {
        this._insertText =
            a
    }, getInsertText: function () {
        return this._insertText
    }, setDeleteBackward: function (a) {
        this._deleteBackward = a
    }, getDeleteBackward: function () {
        return this._deleteBackward
    }, init: function () {
        return ccui.Widget.prototype.init.call(this) ? (this.setTouchEnabled(!0), !0) : !1
    }, onDraw: function (a) {
        return!1
    }});
ccui.UICCTextField.create = function (a, b, c) {
    var d = new ccui.UICCTextField;
    return d && d.initWithString("", b, c) ? (a && d.setPlaceHolder(a), d) : null
};
ccui.TextField = ccui.Widget.extend({_textFieldRender: null, _touchWidth: 0, _touchHeight: 0, _useTouchArea: !1, _textFieldEventListener: null, _textFieldEventSelector: null, _attachWithIMEListener: null, _detachWithIMEListener: null, _insertTextListener: null, _deleteBackwardListener: null, _attachWithIMESelector: null, _detachWithIMESelector: null, _insertTextSelector: null, _deleteBackwardSelector: null, _passwordStyleText: "", _textFieldRendererAdaptDirty: !0, ctor: function () {
    ccui.Widget.prototype.ctor.call(this)
}, init: function () {
    return ccui.Widget.prototype.init.call(this) ?
        (this.setTouchEnabled(!0), !0) : !1
}, onEnter: function () {
    ccui.Widget.prototype.onEnter.call(this);
    this.setUpdateEnabled(!0)
}, onExit: function () {
    this.setUpdateEnabled(!1);
    ccui.Layout.prototype.onExit.call(this)
}, initRenderer: function () {
    this._textFieldRender = ccui.UICCTextField.create("input words here", "Thonburi", 20);
    this.addProtectedChild(this._textFieldRender, ccui.TextField.RENDERER_ZORDER, -1)
}, setTouchSize: function (a) {
    this._touchWidth = a.width;
    this._touchHeight = a.height
}, setTouchAreaEnabled: function (a) {
    this._useTouchArea =
        a
}, adaptRenderers: function () {
    this._textFieldRendererAdaptDirty && (this.textfieldRendererScaleChangedWithSize(), this._textFieldRendererAdaptDirty = !1)
}, hitTest: function (a) {
    if (this._useTouchArea) {
        a = this.convertToNodeSpace(a);
        var b = cc.rect(-this._touchWidth * this._anchorPoint.x, -this._touchHeight * this._anchorPoint.y, this._touchWidth, this._touchHeight);
        if (a.x >= b.origin.x && a.x <= b.origin.x + b.size.width && a.y >= b.origin.y && a.y <= b.origin.y + b.size.height)return!0
    } else return ccui.Widget.prototype.hitTest.call(this,
        a);
    return!1
}, getTouchSize: function () {
    return cc.size(this._touchWidth, this._touchHeight)
}, setText: function (a) {
    cc.log("Please use the setString");
    this.setString(a)
}, setString: function (a) {
    a && (a = String(a), this.isMaxLengthEnabled() && (a = a.substr(0, this.getMaxLength())), this.isPasswordEnabled() ? (this._textFieldRender.setPasswordText(a), this._textFieldRender.setString(""), this._textFieldRender.insertText(a, a.length)) : this._textFieldRender.setString(a), this._textFieldRendererAdaptDirty = !0, this._updateContentSizeWithTextureSize(this._textFieldRender.getContentSize()))
},
    setPlaceHolder: function (a) {
        this._textFieldRender.setPlaceHolder(a);
        this._textFieldRendererAdaptDirty = !0;
        this._updateContentSizeWithTextureSize(this._textFieldRender.getContentSize())
    }, getPlaceHolder: function () {
        return this._textFieldRender.getPlaceHolder()
    }, _setFont: function (a) {
        this._textFieldRender._setFont(a);
        this._textFieldRendererAdaptDirty = !0
    }, _getFont: function () {
        return this._textFieldRender._getFont()
    }, setFontSize: function (a) {
        this._textFieldRender.setFontSize(a);
        this._textFieldRendererAdaptDirty = !0;
        this._updateContentSizeWithTextureSize(this._textFieldRender.getContentSize())
    }, getFontSize: function () {
        return this._textFieldRender.getSystemFontSize()
    }, setFontName: function (a) {
        this._textFieldRender.setFontName(a);
        this._textFieldRendererAdaptDirty = !0;
        this._updateContentSizeWithTextureSize(this._textFieldRender.getContentSize())
    }, getFontName: function () {
        return this._textFieldRender.getSystemFontName()
    }, didNotSelectSelf: function () {
        this._textFieldRender.detachWithIME()
    }, getStringValue: function () {
        cc.log("Please use the getString");
        return this.getString()
    }, getString: function () {
        return this._textFieldRender.getString()
    }, getStringLength: function () {
        return this._textFieldRender.getStringLength()
    }, onTouchBegan: function (a, b) {
        var c = this, d = ccui.Widget.prototype.onTouchBegan.call(c, a, b);
        c._hitted && setTimeout(function () {
            c._textFieldRender.attachWithIME()
        }, 0);
        return d
    }, setMaxLengthEnabled: function (a) {
        this._textFieldRender.setMaxLengthEnabled(a)
    }, isMaxLengthEnabled: function () {
        return this._textFieldRender.isMaxLengthEnabled()
    }, setMaxLength: function (a) {
        this._textFieldRender.setMaxLength(a);
        this.setString(this.getString())
    }, getMaxLength: function () {
        return this._textFieldRender.getMaxLength()
    }, setPasswordEnabled: function (a) {
        this._textFieldRender.setPasswordEnabled(a)
    }, isPasswordEnabled: function () {
        return this._textFieldRender.isPasswordEnabled()
    }, setPasswordStyleText: function (a) {
        this._textFieldRender.setPasswordStyleText(a);
        this._passwordStyleText = a;
        this.setString(this.getString())
    }, getPasswordStyleText: function () {
        return this._passwordStyleText
    }, update: function (a) {
        this.getAttachWithIME() &&
        (this.attachWithIMEEvent(), this.setAttachWithIME(!1));
        this.getDetachWithIME() && (this.detachWithIMEEvent(), this.setDetachWithIME(!1));
        this.getInsertText() && (this.insertTextEvent(), this.setInsertText(!1), this._textFieldRendererAdaptDirty = !0, this._updateContentSizeWithTextureSize(this._textFieldRender.getContentSize()));
        this.getDeleteBackward() && (this.deleteBackwardEvent(), this.setDeleteBackward(!1), this._textFieldRendererAdaptDirty = !0, this._updateContentSizeWithTextureSize(this._textFieldRender.getContentSize()))
    },
    getAttachWithIME: function () {
        return this._textFieldRender.getAttachWithIME()
    }, setAttachWithIME: function (a) {
        this._textFieldRender.setAttachWithIME(a)
    }, getDetachWithIME: function () {
        return this._textFieldRender.getDetachWithIME()
    }, setDetachWithIME: function (a) {
        this._textFieldRender.setDetachWithIME(a)
    }, getInsertText: function () {
        return this._textFieldRender.getInsertText()
    }, setInsertText: function (a) {
        this._textFieldRender.setInsertText(a)
    }, getDeleteBackward: function () {
        return this._textFieldRender.getDeleteBackward()
    },
    setDeleteBackward: function (a) {
        this._textFieldRender.setDeleteBackward(a)
    }, attachWithIMEEvent: function () {
        this._textFieldEventListener && this._textFieldEventSelector && this._textFieldEventSelector.call(this._textFieldEventListener, this, ccui.TextField.EVENT_ATTACH_WITH_ME);
        this._eventCallback && this._eventCallback(this, 0)
    }, detachWithIMEEvent: function () {
        this._textFieldEventListener && this._textFieldEventSelector && this._textFieldEventSelector.call(this._textFieldEventListener, this, ccui.TextField.EVENT_DETACH_WITH_ME);
        this._eventCallback && this._eventCallback(this, 1)
    }, insertTextEvent: function () {
        this._textFieldEventListener && this._textFieldEventSelector && this._textFieldEventSelector.call(this._textFieldEventListener, this, ccui.TextField.EVENT_INSERT_TEXT);
        this._eventCallback && this._eventCallback(this, 2)
    }, deleteBackwardEvent: function () {
        this._textFieldEventListener && this._textFieldEventSelector && this._textFieldEventSelector.call(this._textFieldEventListener, this, ccui.TextField.EVENT_DELETE_BACKWARD);
        this._eventCallback &&
        this._eventCallback(this, 3)
    }, addEventListenerTextField: function (a, b) {
        this._textFieldEventSelector = a;
        this._textFieldEventListener = b
    }, setAnchorPoint: function (a, b) {
        void 0 === b ? (ccui.Widget.prototype.setAnchorPoint.call(this, a), this._textFieldRender.setAnchorPoint(a)) : (ccui.Widget.prototype.setAnchorPoint.call(this, a, b), this._textFieldRender.setAnchorPoint(a, b))
    }, _setAnchorX: function (a) {
        ccui.Widget.prototype._setAnchorX.call(this, a);
        this._textFieldRender._setAnchorX(a)
    }, _setAnchorY: function (a) {
        ccui.Widget.prototype._setAnchorY.call(this,
            a);
        this._textFieldRender._setAnchorY(a)
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this._textFieldRendererAdaptDirty = !0
    }, textfieldRendererScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            this._textFieldRender.setScale(1);
            var a = this.getContentSize();
            this._size.width = a.width;
            this._size.height = a.height
        } else {
            a = this.getContentSize();
            if (0 >= a.width || 0 >= a.height) {
                this._textFieldRender.setScale(1);
                return
            }
            var b = this._size.height / a.height;
            this._textFieldRender.setScaleX(this._size.width /
                a.width);
            this._textFieldRender.setScaleY(b)
        }
        this._textFieldRender.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
    }, getContentSize: function () {
        return this._textFieldRender.getContentSize()
    }, _getWidth: function () {
        return this._textFieldRender._getWidth()
    }, _getHeight: function () {
        return this._textFieldRender._getHeight()
    }, getVirtualRenderer: function () {
        return this._textFieldRender
    }, updateTextureColor: function () {
        this.updateColorToRenderer(this._textFieldRender)
    }, updateTextureOpacity: function () {
        this.updateOpacityToRenderer(this._textFieldRender)
    },
    getDescription: function () {
        return"TextField"
    }, attachWithIME: function () {
        this._textFieldRender.attachWithIME()
    }, createCloneInstance: function () {
        return ccui.TextField.create()
    }, copySpecialProperties: function (a) {
        this.setString(a._textFieldRender.getString());
        this.setPlaceHolder(a.getString());
        this.setFontSize(a._textFieldRender.getFontSize());
        this.setFontName(a._textFieldRender.getFontName());
        this.setMaxLengthEnabled(a.isMaxLengthEnabled());
        this.setMaxLength(a.getMaxLength());
        this.setPasswordEnabled(a.isPasswordEnabled());
        this.setPasswordStyleText(a._passwordStyleText);
        this.setAttachWithIME(a.getAttachWithIME());
        this.setDetachWithIME(a.getDetachWithIME());
        this.setInsertText(a.getInsertText());
        this.setDeleteBackward(a.getDeleteBackward())
    }});
ccui.TextField.create = function (a, b, c) {
    var d = new ccui.TextField;
    return d && d.init() ? (a && (b && c) && (d.setPlaceHolder(a), d.setFontName(b), d.setFontSize(c)), d) : null
};
_p = ccui.TextField.prototype;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
cc.defineGetterSetter(_p, "placeHolder", _p.getPlaceHolder, _p.setPlaceHolder);
cc.defineGetterSetter(_p, "font", _p._getFont, _p._setFont);
cc.defineGetterSetter(_p, "fontSize", _p.getFontSize, _p.setFontSize);
cc.defineGetterSetter(_p, "fontName", _p.getFontName, _p.setFontName);
cc.defineGetterSetter(_p, "maxLengthEnabled", _p.isMaxLengthEnabled, _p.setMaxLengthEnabled);
cc.defineGetterSetter(_p, "maxLength", _p.getMaxLength, _p.setMaxLength);
cc.defineGetterSetter(_p, "passwordEnabled", _p.isPasswordEnabled, _p.setPasswordEnabled);
_p = null;
ccui.TextField.create = function () {
    return new ccui.TextField
};
ccui.TextField.EVENT_ATTACH_WITH_ME = 0;
ccui.TextField.EVENT_DETACH_WITH_ME = 1;
ccui.TextField.EVENT_INSERT_TEXT = 2;
ccui.TextField.EVENT_DELETE_BACKWARD = 3;
ccui.TextField.RENDERER_ZORDER = -1;
ccui.RichElement = ccui.Class.extend({type: 0, tag: 0, color: null, ctor: function () {
    this.tag = this.type = 0;
    this.color = cc.color(255, 255, 255, 255)
}, init: function (a, b, c) {
    this.tag = a;
    this.color.r = b.r;
    this.color.g = b.g;
    this.color.b = b.b;
    this.color.a = c
}});
ccui.RichElementText = ccui.RichElement.extend({text: "", fontName: "", fontSize: 0, ctor: function () {
    ccui.RichElement.prototype.ctor.call(this);
    this.type = ccui.RichElement.TEXT;
    this.fontName = this.text = "";
    this.fontSize = 0
}, init: function (a, b, c, d, e, f) {
    ccui.RichElement.prototype.init.call(this, a, b, c);
    this.text = d;
    this.fontName = e;
    this.fontSize = f
}});
ccui.RichElementText.create = function (a, b, c, d, e, f) {
    var g = new ccui.RichElementText;
    g.init(a, b, c, d, e, f);
    return g
};
ccui.RichElementImage = ccui.RichElement.extend({filePath: "", textureRect: null, textureType: 0, ctor: function () {
    ccui.RichElement.prototype.ctor.call(this);
    this.type = ccui.RichElement.IMAGE;
    this.filePath = "";
    this.textureRect = cc.rect(0, 0, 0, 0);
    this.textureType = 0
}, init: function (a, b, c, d) {
    ccui.RichElement.prototype.init.call(this, a, b, c);
    this.filePath = d
}});
ccui.RichElementImage.create = function (a, b, c, d) {
    var e = new ccui.RichElementImage;
    e.init(a, b, c, d);
    return e
};
ccui.RichElementCustomNode = ccui.RichElement.extend({customNode: null, ctor: function () {
    ccui.RichElement.prototype.ctor.call(this);
    this.type = ccui.RichElement.CUSTOM;
    this.customNode = null
}, init: function (a, b, c, d) {
    ccui.RichElement.prototype.init.call(this, a, b, c);
    this.customNode = d
}});
ccui.RichElementCustomNode.create = function (a, b, c, d) {
    var e = new ccui.RichElementCustomNode;
    e.init(a, b, c, d);
    return e
};
ccui.RichText = ccui.Widget.extend({_formatTextDirty: !1, _richElements: null, _elementRenders: null, _leftSpaceWidth: 0, _verticalSpace: 0, _elementRenderersContainer: null, ctor: function () {
    ccui.Widget.prototype.ctor.call(this);
    this._formatTextDirty = !1;
    this._richElements = [];
    this._elementRenders = [];
    this._verticalSpace = this._leftSpaceWidth = 0
}, initRenderer: function () {
    this._elementRenderersContainer = cc.Node.create();
    this._elementRenderersContainer.setAnchorPoint(0.5, 0.5);
    this.addProtectedChild(this._elementRenderersContainer,
        0, -1)
}, insertElement: function (a, b) {
    this._richElements.splice(b, 0, a);
    this._formatTextDirty = !0
}, pushBackElement: function (a) {
    this._richElements.push(a);
    this._formatTextDirty = !0
}, removeElement: function (a) {
    "number" === typeof a ? this._richElements.splice(a, 1) : cc.arrayRemoveObject(this._richElements, a);
    this._formatTextDirty = !0
}, formatText: function () {
    if (this._formatTextDirty) {
        this._elementRenderersContainer.removeAllChildren();
        this._elementRenders.length = 0;
        var a, b, c = this._richElements;
        if (this._ignoreSize) {
            this.addNewLine();
            for (a = 0; a < c.length; a++) {
                b = c[a];
                var d = null;
                switch (b.type) {
                    case ccui.RichElement.TEXT:
                        d = cc.LabelTTF.create(b.text, b.fontName, b.fontSize);
                        break;
                    case ccui.RichElement.IMAGE:
                        d = cc.Sprite.create(b.filePath);
                        break;
                    case ccui.RichElement.CUSTOM:
                        d = b.customNode
                }
                d.setColor(b.color);
                d.setOpacity(b.color.a);
                this.pushToContainer(d)
            }
        } else {
            this.addNewLine();
            for (a = 0; a < c.length; a++)switch (b = c[a], b.type) {
                case ccui.RichElement.TEXT:
                    this.handleTextRenderer(b.text, b.fontName, b.fontSize, b.color);
                    break;
                case ccui.RichElement.IMAGE:
                    this.handleImageRenderer(b.filePath,
                        b.color, b.color.a);
                    break;
                case ccui.RichElement.CUSTOM:
                    this.handleCustomRenderer(b.customNode)
            }
        }
        this.formatRenderers();
        this._formatTextDirty = !1
    }
}, handleTextRenderer: function (a, b, c, d) {
    var e = cc.LabelTTF.create(a, b, c), f = e.getContentSize().width;
    this._leftSpaceWidth -= f;
    0 > this._leftSpaceWidth ? (e = a.length * (1 - -this._leftSpaceWidth / f), f = a.substr(0, e), a = a.substr(e, a.length - 1), 0 < e && (e = cc.LabelTTF.create(f.substr(0, e), b, c), e.setColor(d), e.setOpacity(d.a), this.pushToContainer(e)), this.addNewLine(), this.handleTextRenderer(a,
        b, c, d)) : (e.setColor(d), e.setOpacity(d.a), this.pushToContainer(e))
}, handleImageRenderer: function (a, b, c) {
    a = cc.Sprite.create(a);
    this.handleCustomRenderer(a)
}, handleCustomRenderer: function (a) {
    var b = a.getContentSize();
    this._leftSpaceWidth -= b.width;
    0 > this._leftSpaceWidth ? (this.addNewLine(), this.pushToContainer(a), this._leftSpaceWidth -= b.width) : this.pushToContainer(a)
}, addNewLine: function () {
    this._leftSpaceWidth = this._customSize.width;
    this._elementRenders.push([])
}, formatRenderers: function () {
    var a = 0, b = this._elementRenderersContainer,
        c = this._elementRenders;
    if (this._ignoreSize) {
        for (var d = 0, e = c[0], f = 0, g = 0; g < e.length; g++) {
            var h = e[g];
            h.setAnchorPoint(cc.p(0, 0));
            h.setPosition(cc.p(f, 0));
            b.addChild(h, 1, g);
            c = h.getContentSize();
            d += c.width;
            a = Math.max(a, c.height);
            f += c.width
        }
        b.setContentSize(cc.size(d, a))
    } else {
        for (var d = [], k = 0; k < c.length; k++) {
            e = c[k];
            for (g = f = 0; g < e.length; g++)h = e[g], f = Math.max(h.getContentSize().height, f);
            d[k] = f;
            a += d[k]
        }
        a = this._customSize.height;
        for (k = 0; k < c.length; k++) {
            e = c[k];
            f = 0;
            a -= d[k] + this._verticalSpace;
            for (g = 0; g < e.length; g++)h =
                e[g], h.setAnchorPoint(cc.p(0, 0)), h.setPosition(cc.p(f, a)), b.addChild(h, 1, 10 * k + g), f += h.getContentSize().width
        }
        b.setContentSize(this._size)
    }
    this._elementRenders.length = 0;
    this._ignoreSize ? (e = this.getVirtualRendererSize(), this._size.width = e.width, this._size.height = e.height) : (this._size.width = this._customSize.width, this._size.height = this._customSize.height);
    this._updateContentSizeWithTextureSize(this._size);
    b.setPosition(0.5 * this._contentSize.width, 0.5 * this._contentSize.height)
}, pushToContainer: function (a) {
    0 >=
    this._elementRenders.length || this._elementRenders[this._elementRenders.length - 1].push(a)
}, visit: function (a) {
    this._enabled && (this.formatText(), ccui.Widget.prototype.visit.call(this, a))
}, setVerticalSpace: function (a) {
    this._verticalSpace = a
}, setAnchorPoint: function (a) {
    ccui.Widget.prototype.setAnchorPoint.call(this, a);
    this._elementRenderersContainer.setAnchorPoint(a)
}, getVirtualRendererSize: function () {
    return this._elementRenderersContainer.getContentSize()
}, getContentSize: function () {
    return this._elementRenderersContainer.getContentSize()
},
    ignoreContentAdaptWithSize: function (a) {
        this._ignoreSize != a && (this._formatTextDirty = !0, ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, a))
    }, getDescription: function () {
        return"RichText"
    }});
ccui.RichText.create = function () {
    return new ccui.RichText
};
ccui.RichElement.TEXT = 0;
ccui.RichElement.IMAGE = 1;
ccui.RichElement.CUSTOM = 2;
ccui.ScrollView = ccui.Layout.extend({_innerContainer: null, direction: null, _autoScrollDir: null, _topBoundary: 0, _bottomBoundary: 0, _leftBoundary: 0, _rightBoundary: 0, _bounceTopBoundary: 0, _bounceBottomBoundary: 0, _bounceLeftBoundary: 0, _bounceRightBoundary: 0, _autoScroll: !1, _autoScrollAddUpTime: 0, _autoScrollOriginalSpeed: 0, _autoScrollAcceleration: 0, _isAutoScrollSpeedAttenuated: !1, _needCheckAutoScrollDestination: !1, _autoScrollDestination: null, _bePressed: !1, _slidTime: 0, _moveChildPoint: null, _childFocusCancelOffset: 0,
    _leftBounceNeeded: !1, _topBounceNeeded: !1, _rightBounceNeeded: !1, _bottomBounceNeeded: !1, bounceEnabled: !1, _bouncing: !1, _bounceDir: null, _bounceOriginalSpeed: 0, inertiaScrollEnabled: !1, _scrollViewEventListener: null, _scrollViewEventSelector: null, _className: "ScrollView", _eventCallback: null, ctor: function () {
        ccui.Layout.prototype.ctor.call(this);
        this.direction = ccui.ScrollView.DIR_NONE;
        this._autoScrollDir = cc.p(0, 0);
        this._bounceRightBoundary = this._bounceLeftBoundary = this._bounceBottomBoundary = this._bounceTopBoundary =
            this._rightBoundary = this._leftBoundary = this._bottomBoundary = this._topBoundary = 0;
        this._autoScroll = !1;
        this._autoScrollOriginalSpeed = this._autoScrollAddUpTime = 0;
        this._autoScrollAcceleration = -1E3;
        this._needCheckAutoScrollDestination = this._isAutoScrollSpeedAttenuated = !1;
        this._autoScrollDestination = cc.p(0, 0);
        this._bePressed = !1;
        this._slidTime = 0;
        this._moveChildPoint = cc.p(0, 0);
        this._childFocusCancelOffset = 5;
        this._bouncing = this.bounceEnabled = this._bottomBounceNeeded = this._rightBounceNeeded = this._topBounceNeeded =
            this._leftBounceNeeded = !1;
        this._bounceDir = cc.p(0, 0);
        this._bounceOriginalSpeed = 0;
        this.inertiaScrollEnabled = !0;
        this._scrollViewEventSelector = this._scrollViewEventListener = null
    }, init: function () {
        return ccui.Layout.prototype.init.call(this) ? (this.setClippingEnabled(!0), this._innerContainer.setTouchEnabled(!1), !0) : !1
    }, onEnter: function () {
        ccui.Layout.prototype.onEnter.call(this);
        this.scheduleUpdate(!0)
    }, findNextFocusedWidget: function (a, b) {
        return this.getLayoutType() == ccui.Layout.LINEAR_VERTICAL || this.getLayoutType() ==
            ccui.Layout.LINEAR_HORIZONTAL ? this._innerContainer.findNextFocusedWidget(a, b) : ccui.Widget.prototype.findNextFocusedWidget.call(this, a, b)
    }, initRenderer: function () {
        ccui.Layout.prototype.initRenderer.call(this);
        this._innerContainer = ccui.Layout.create();
        this.addProtectedChild(this._innerContainer, 1, 1)
    }, onSizeChanged: function () {
        ccui.Layout.prototype.onSizeChanged.call(this);
        var a = this._contentSize;
        this._topBoundary = a.height;
        this._rightBoundary = a.width;
        var b = a.width / 3, c = a.height / 3;
        this._bounceTopBoundary =
            a.height - c;
        this._bounceBottomBoundary = c;
        this._bounceLeftBoundary = b;
        this._bounceRightBoundary = this._contentSize.width - b;
        c = this._innerContainer.getContentSize();
        b = c.height;
        c = Math.max(c.width, a.width);
        b = Math.max(b, a.height);
        this._innerContainer.setContentSize(cc.size(c, b));
        this._innerContainer.setPosition(0, a.height - this._innerContainer.getContentSize().height)
    }, setInnerContainerSize: function (a) {
        var b = this._contentSize, c = b.width, d = b.height, e = this._innerContainer.getContentSize();
        a.width < b.width ? cc.log("Inner width \x3c\x3d scrollview width, it will be force sized!") :
            c = a.width;
        a.height < b.height ? cc.log("Inner height \x3c\x3d scrollview height, it will be force sized!") : d = a.height;
        this._innerContainer.setSize(cc.size(c, d));
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                a = this._innerContainer.getContentSize();
                e = e.height - a.height;
                this.scrollChildren(0, e);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                this._innerContainer.getRightBoundary() <= b.width && (a = this._innerContainer.getContentSize(), e = e.width - a.width, this.scrollChildren(e, 0));
                break;
            case ccui.ScrollView.DIR_BOTH:
                a =
                    this._innerContainer.getContentSize(), c = e.height - a.height, d = 0, this._innerContainer.getRightBoundary() <= b.width && (d = e.width - a.width), this.scrollChildren(d, c)
        }
        e = this._innerContainer;
        a = e.getContentSize();
        c = e.getPosition();
        d = e.getAnchorPoint();
        0 < e.getLeftBoundary() && e.setPosition(d.x * a.width, c.y);
        e.getRightBoundary() < b.width && e.setPosition(b.width - (1 - d.x) * a.width, c.y);
        0 < c.y && e.setPosition(c.x, d.y * a.height);
        e.getTopBoundary() < b.height && e.setPosition(c.x, b.height - (1 - d.y) * a.height)
    }, _setInnerWidth: function (a) {
        var b =
            this._contentSize.width, c = b, d = this._innerContainer, e = d.width;
        a < b ? cc.log("Inner width \x3c\x3d scrollview width, it will be force sized!") : c = a;
        d.width = c;
        switch (this.direction) {
            case ccui.ScrollView.DIR_HORIZONTAL:
            case ccui.ScrollView.DIR_BOTH:
                d.getRightBoundary() <= b && this.scrollChildren(e - d.width, 0)
        }
        a = d.anchorX;
        0 < d.getLeftBoundary() && (d.x = a * c);
        d.getRightBoundary() < b && (d.x = b - (1 - a) * c)
    }, _setInnerHeight: function (a) {
        var b = this._contentSize.height, c = b, d = this._innerContainer, e = d.height;
        a < b ? cc.log("Inner height \x3c\x3d scrollview height, it will be force sized!") :
            c = a;
        d.height = c;
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
            case ccui.ScrollView.DIR_BOTH:
                this.scrollChildren(0, e - c)
        }
        a = d.anchorY;
        0 < d.getLeftBoundary() && (d.y = a * c);
        d.getRightBoundary() < b && (d.y = b - (1 - a) * c)
    }, getInnerContainerSize: function () {
        return this._innerContainer.getContentSize()
    }, _getInnerWidth: function () {
        return this._innerContainer.width
    }, _getInnerHeight: function () {
        return this._innerContainer.height
    }, addChild: function (a, b, c) {
        if (!a)return!1;
        b = b || a.getLocalZOrder();
        c = c || a.getTag();
        return this._innerContainer.addChild(a,
            b, c)
    }, removeAllChildren: function () {
        this.removeAllChildrenWithCleanup(!0)
    }, removeAllChildrenWithCleanup: function (a) {
        this._innerContainer.removeAllChildrenWithCleanup(a)
    }, removeChild: function (a, b) {
        return this._innerContainer.removeChild(a, b)
    }, getChildren: function () {
        return this._innerContainer.getChildren()
    }, getChildrenCount: function () {
        return this._innerContainer.getChildrenCount()
    }, getChildByTag: function (a) {
        return this._innerContainer.getChildByTag(a)
    }, getChildByName: function (a) {
        return this._innerContainer.getChildByName(a)
    },
    addNode: function (a, b, c) {
        this._innerContainer.addNode(a, b, c)
    }, getNodeByTag: function (a) {
        return this._innerContainer.getNodeByTag(a)
    }, getNodes: function () {
        return this._innerContainer.getNodes()
    }, removeNode: function (a) {
        this._innerContainer.removeNode(a)
    }, removeNodeByTag: function (a) {
        this._innerContainer.removeNodeByTag(a)
    }, removeAllNodes: function () {
        this._innerContainer.removeAllNodes()
    }, moveChildren: function (a, b) {
        var c = this._innerContainer.getPosition();
        this._moveChildPoint.x = c.x + a;
        this._moveChildPoint.y =
            c.y + b;
        this._innerContainer.setPosition(this._moveChildPoint)
    }, autoScrollChildren: function (a) {
        var b = this._autoScrollAddUpTime;
        this._autoScrollAddUpTime += a;
        if (this._isAutoScrollSpeedAttenuated)0 >= this._autoScrollOriginalSpeed + this._autoScrollAcceleration * this._autoScrollAddUpTime ? (this.stopAutoScrollChildren(), this.checkNeedBounce()) : (b = (this._autoScrollOriginalSpeed + 0.5 * this._autoScrollAcceleration * (2 * b + a)) * a, this.scrollChildren(b * this._autoScrollDir.x, b * this._autoScrollDir.y) || (this.stopAutoScrollChildren(),
            this.checkNeedBounce())); else if (this._needCheckAutoScrollDestination) {
            var b = this._autoScrollDir.x * a * this._autoScrollOriginalSpeed, c = this._autoScrollDir.y * a * this._autoScrollOriginalSpeed;
            a = this.checkCustomScrollDestination(b, c);
            b = this.scrollChildren(b, c);
            if (!a || !b)this.stopAutoScrollChildren(), this.checkNeedBounce()
        } else this.scrollChildren(this._autoScrollDir.x * a * this._autoScrollOriginalSpeed, this._autoScrollDir.y * a * this._autoScrollOriginalSpeed) || (this.stopAutoScrollChildren(), this.checkNeedBounce())
    },
    bounceChildren: function (a) {
        var b = this._bounceOriginalSpeed, c = this._bounceDir;
        0 >= b && this.stopBounceChildren();
        this.bounceScrollChildren(c.x * a * b, c.y * a * b) || this.stopBounceChildren()
    }, checkNeedBounce: function () {
        if (!this.bounceEnabled)return!1;
        this.checkBounceBoundary();
        if (this._topBounceNeeded || this._bottomBounceNeeded || this._leftBounceNeeded || this._rightBounceNeeded) {
            var a, b;
            this._topBounceNeeded && this._leftBounceNeeded ? (a = cc.pSub(cc.p(0, this._contentSize.height), cc.p(this._innerContainer.getLeftBoundary(),
                this._innerContainer.getTopBoundary())), b = cc.pLength(a) / 0.2, this._bounceDir = cc.pNormalize(a), this.startBounceChildren(b)) : this._topBounceNeeded && this._rightBounceNeeded ? (a = cc.pSub(cc.p(this._contentSize.width, this._contentSize.height), cc.p(this._innerContainer.getRightBoundary(), this._innerContainer.getTopBoundary())), b = cc.pLength(a) / 0.2, this._bounceDir = cc.pNormalize(a), this.startBounceChildren(b)) : this._bottomBounceNeeded && this._leftBounceNeeded ? (a = cc.pSub(cc.p(0, 0), cc.p(this._innerContainer.getLeftBoundary(),
                this._innerContainer.getBottomBoundary())), b = cc.pLength(a) / 0.2, this._bounceDir = cc.pNormalize(a), this.startBounceChildren(b)) : this._bottomBounceNeeded && this._rightBounceNeeded ? (a = cc.pSub(cc.p(this._contentSize.width, 0), cc.p(this._innerContainer.getRightBoundary(), this._innerContainer.getBottomBoundary())), b = cc.pLength(a) / 0.2, this._bounceDir = cc.pNormalize(a), this.startBounceChildren(b)) : this._topBounceNeeded ? (a = cc.pSub(cc.p(0, this._contentSize.height), cc.p(0, this._innerContainer.getTopBoundary())),
                b = cc.pLength(a) / 0.2, this._bounceDir = cc.pNormalize(a), this.startBounceChildren(b)) : this._bottomBounceNeeded ? (a = cc.pSub(cc.p(0, 0), cc.p(0, this._innerContainer.getBottomBoundary())), b = cc.pLength(a) / 0.2, this._bounceDir = cc.pNormalize(a), this.startBounceChildren(b)) : this._leftBounceNeeded ? (a = cc.pSub(cc.p(0, 0), cc.p(this._innerContainer.getLeftBoundary(), 0)), b = cc.pLength(a) / 0.2, this._bounceDir = cc.pNormalize(a), this.startBounceChildren(b)) : this._rightBounceNeeded && (a = cc.pSub(cc.p(this._contentSize.width, 0),
                cc.p(this._innerContainer.getRightBoundary(), 0)), b = cc.pLength(a) / 0.2, this._bounceDir = cc.pNormalize(a), this.startBounceChildren(b));
            return!0
        }
        return!1
    }, checkBounceBoundary: function () {
        this._innerContainer.getBottomBoundary() > this._bottomBoundary ? (this.scrollToBottomEvent(), this._bottomBounceNeeded = !0) : this._bottomBounceNeeded = !1;
        this._innerContainer.getTopBoundary() < this._topBoundary ? (this.scrollToTopEvent(), this._topBounceNeeded = !0) : this._topBounceNeeded = !1;
        this._innerContainer.getRightBoundary() < this._rightBoundary ?
            (this.scrollToRightEvent(), this._rightBounceNeeded = !0) : this._rightBounceNeeded = !1;
        this._innerContainer.getLeftBoundary() > this._leftBoundary ? (this.scrollToLeftEvent(), this._leftBounceNeeded = !0) : this._leftBounceNeeded = !1
    }, startBounceChildren: function (a) {
        this._bounceOriginalSpeed = a;
        this._bouncing = !0
    }, stopBounceChildren: function () {
        this._bouncing = !1;
        this._bounceOriginalSpeed = 0;
        this._bottomBounceNeeded = this._topBounceNeeded = this._rightBounceNeeded = this._leftBounceNeeded = !1
    }, startAutoScrollChildrenWithOriginalSpeed: function (a, b, c, d) {
        this.stopAutoScrollChildren();
        this._autoScrollDir = a;
        this._isAutoScrollSpeedAttenuated = c;
        this._autoScrollOriginalSpeed = b;
        this._autoScroll = !0;
        this._autoScrollAcceleration = d
    }, startAutoScrollChildrenWithDestination: function (a, b, c) {
        this._needCheckAutoScrollDestination = !1;
        this._autoScrollDestination = a;
        var d = cc.pSub(a, this._innerContainer.getPosition());
        a = cc.pNormalize(d);
        var e = 0, f = -1E3, d = cc.pLength(d);
        c ? (f = -(2 * d) / (b * b), e = 2 * d / b) : (this._needCheckAutoScrollDestination = !0, e = d / b);
        this.startAutoScrollChildrenWithOriginalSpeed(a,
            e, c, f)
    }, jumpToDestination: function (a, b) {
        void 0 !== a.x && (b = a.y, a = a.x);
        var c = a, d = b;
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                0 >= b && (d = Math.max(b, this._contentSize.height - this._innerContainer.getContentSize().height));
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                0 >= a && (c = Math.max(a, this._contentSize.width - this._innerContainer.getContentSize().width));
                break;
            case ccui.ScrollView.DIR_BOTH:
                0 >= b && (d = Math.max(b, this._contentSize.height - this._innerContainer.getContentSize().height)), 0 >= a && (c = Math.max(a,
                        this._contentSize.width - this._innerContainer.getContentSize().width))
        }
        this._innerContainer.setPosition(c, d)
    }, stopAutoScrollChildren: function () {
        this._autoScroll = !1;
        this._autoScrollAddUpTime = this._autoScrollOriginalSpeed = 0
    }, bounceScrollChildren: function (a, b) {
        var c = !0, d, e, f;
        0 < a && 0 < b ? (d = a, e = b, f = this._innerContainer.getRightBoundary(), f + d >= this._rightBoundary && (d = this._rightBoundary - f, this.bounceRightEvent(), c = !1), f = this._innerContainer.getTopBoundary(), f + b >= this._topBoundary && (e = this._topBoundary - f, this.bounceTopEvent(),
            c = !1), this.moveChildren(d, e)) : 0 > a && 0 < b ? (d = a, e = b, f = this._innerContainer.getLeftBoundary(), f + d <= this._leftBoundary && (d = this._leftBoundary - f, this.bounceLeftEvent(), c = !1), f = this._innerContainer.getTopBoundary(), f + b >= this._topBoundary && (e = this._topBoundary - f, this.bounceTopEvent(), c = !1), this.moveChildren(d, e)) : 0 > a && 0 > b ? (d = a, e = b, f = this._innerContainer.getLeftBoundary(), f + d <= this._leftBoundary && (d = this._leftBoundary - f, this.bounceLeftEvent(), c = !1), f = this._innerContainer.getBottomBoundary(), f + b <= this._bottomBoundary &&
            (e = this._bottomBoundary - f, this.bounceBottomEvent(), c = !1), this.moveChildren(d, e)) : 0 < a && 0 > b ? (d = a, e = b, f = this._innerContainer.getRightBoundary(), f + d >= this._rightBoundary && (d = this._rightBoundary - f, this.bounceRightEvent(), c = !1), f = this._innerContainer.getBottomBoundary(), f + b <= this._bottomBoundary && (e = this._bottomBoundary - f, this.bounceBottomEvent(), c = !1), this.moveChildren(d, e)) : 0 == a && 0 < b ? (e = b, f = this._innerContainer.getTopBoundary(), f + b >= this._topBoundary && (e = this._topBoundary - f, this.bounceTopEvent(), c = !1),
            this.moveChildren(0, e)) : 0 == a && 0 > b ? (e = b, f = this._innerContainer.getBottomBoundary(), f + b <= this._bottomBoundary && (e = this._bottomBoundary - f, this.bounceBottomEvent(), c = !1), this.moveChildren(0, e)) : 0 < a && 0 == b ? (d = a, f = this._innerContainer.getRightBoundary(), f + d >= this._rightBoundary && (d = this._rightBoundary - f, this.bounceRightEvent(), c = !1), this.moveChildren(d, 0)) : 0 > a && 0 == b && (d = a, e = this._innerContainer.getLeftBoundary(), e + d <= this._leftBoundary && (d = this._leftBoundary - e, this.bounceLeftEvent(), c = !1), this.moveChildren(d,
            0));
        return c
    }, checkCustomScrollDestination: function (a, b) {
        var c = !0, d;
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                0 < this._autoScrollDir.y ? (d = this._innerContainer.getBottomBoundary(), d + b >= this._autoScrollDestination.y && (c = !1)) : (d = this._innerContainer.getBottomBoundary(), d + b <= this._autoScrollDestination.y && (c = !1));
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                0 < this._autoScrollDir.x ? (d = this._innerContainer.getLeftBoundary(), d + a >= this._autoScrollDestination.x && (c = !1)) : (d = this._innerContainer.getLeftBoundary(),
                    d + a <= this._autoScrollDestination.x && (c = !1));
                break;
            case ccui.ScrollView.DIR_BOTH:
                0 < a && 0 < b ? (d = this._innerContainer.getLeftBoundary(), d + a >= this._autoScrollDestination.x && (c = !1), d = this._innerContainer.getBottomBoundary(), d + b >= this._autoScrollDestination.y && (c = !1)) : 0 > a && 0 < b ? (d = this._innerContainer.getRightBoundary(), d + a <= this._autoScrollDestination.x && (c = !1), d = this._innerContainer.getBottomBoundary(), d + b >= this._autoScrollDestination.y && (c = !1)) : 0 > a && 0 > b ? (d = this._innerContainer.getRightBoundary(), d + a <= this._autoScrollDestination.x &&
                    (c = !1), d = this._innerContainer.getTopBoundary(), d + b <= this._autoScrollDestination.y && (c = !1)) : 0 < a && 0 > b ? (d = this._innerContainer.getLeftBoundary(), d + a >= this._autoScrollDestination.x && (c = !1), d = this._innerContainer.getTopBoundary(), d + b <= this._autoScrollDestination.y && (c = !1)) : 0 == a && 0 < b ? (d = this._innerContainer.getBottomBoundary(), d + b >= this._autoScrollDestination.y && (c = !1)) : 0 > a && 0 == b ? (d = this._innerContainer.getRightBoundary(), d + a <= this._autoScrollDestination.x && (c = !1)) : 0 == a && 0 > b ? (d = this._innerContainer.getTopBoundary(),
                    d + b <= this._autoScrollDestination.y && (c = !1)) : 0 < a && 0 == b && (d = this._innerContainer.getLeftBoundary(), d + a >= this._autoScrollDestination.x && (c = !1))
        }
        return c
    }, getCurAutoScrollDistance: function (a) {
        this._autoScrollOriginalSpeed -= this._autoScrollAcceleration * a;
        return this._autoScrollOriginalSpeed * a
    }, scrollChildren: function (a, b) {
        var c = !0;
        this.scrollingEvent();
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                c = this.scrollChildrenVertical(a, b);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                c = this.scrollChildrenHorizontal(a,
                    b);
                break;
            case ccui.ScrollView.DIR_BOTH:
                c = this.scrollChildrenBoth(a, b)
        }
        return c
    }, scrollChildrenVertical: function (a, b) {
        var c = b, d = !0, e;
        this.bounceEnabled ? (e = this._innerContainer.getBottomBoundary(), e + b >= this._bounceBottomBoundary && (c = this._bounceBottomBoundary - e, this.scrollToBottomEvent(), d = !1), e = this._innerContainer.getTopBoundary(), e + b <= this._bounceTopBoundary && (c = this._bounceTopBoundary - e, this.scrollToTopEvent(), d = !1)) : (e = this._innerContainer.getBottomBoundary(), e + b >= this._bottomBoundary && (c = this._bottomBoundary -
            e, this.scrollToBottomEvent(), d = !1), e = this._innerContainer.getTopBoundary(), e + b <= this._topBoundary && (c = this._topBoundary - e, this.scrollToTopEvent(), d = !1));
        this.moveChildren(0, c);
        return d
    }, scrollChildrenHorizontal: function (a, b) {
        var c = !0, d = a, e;
        this.bounceEnabled ? (e = this._innerContainer.getRightBoundary(), e + a <= this._bounceRightBoundary && (d = this._bounceRightBoundary - e, this.scrollToRightEvent(), c = !1), e = this._innerContainer.getLeftBoundary(), e + a >= this._bounceLeftBoundary && (d = this._bounceLeftBoundary - e, this.scrollToLeftEvent(),
            c = !1)) : (e = this._innerContainer.getRightBoundary(), e + a <= this._rightBoundary && (d = this._rightBoundary - e, this.scrollToRightEvent(), c = !1), e = this._innerContainer.getLeftBoundary(), e + a >= this._leftBoundary && (d = this._leftBoundary - e, this.scrollToLeftEvent(), c = !1));
        this.moveChildren(d, 0);
        return c
    }, scrollChildrenBoth: function (a, b) {
        var c = !0, d = a, e = b, f;
        this.bounceEnabled ? 0 < a && 0 < b ? (f = this._innerContainer.getLeftBoundary(), f + a >= this._bounceLeftBoundary && (d = this._bounceLeftBoundary - f, this.scrollToLeftEvent(), c = !1),
            f = this._innerContainer.getBottomBoundary(), f + b >= this._bounceBottomBoundary && (e = this._bounceBottomBoundary - f, this.scrollToBottomEvent(), c = !1)) : 0 > a && 0 < b ? (f = this._innerContainer.getRightBoundary(), f + a <= this._bounceRightBoundary && (d = this._bounceRightBoundary - f, this.scrollToRightEvent(), c = !1), f = this._innerContainer.getBottomBoundary(), f + b >= this._bounceBottomBoundary && (e = this._bounceBottomBoundary - f, this.scrollToBottomEvent(), c = !1)) : 0 > a && 0 > b ? (f = this._innerContainer.getRightBoundary(), f + a <= this._bounceRightBoundary &&
            (d = this._bounceRightBoundary - f, this.scrollToRightEvent(), c = !1), f = this._innerContainer.getTopBoundary(), f + b <= this._bounceTopBoundary && (e = this._bounceTopBoundary - f, this.scrollToTopEvent(), c = !1)) : 0 < a && 0 > b ? (f = this._innerContainer.getLeftBoundary(), f + a >= this._bounceLeftBoundary && (d = this._bounceLeftBoundary - f, this.scrollToLeftEvent(), c = !1), f = this._innerContainer.getTopBoundary(), f + b <= this._bounceTopBoundary && (e = this._bounceTopBoundary - f, this.scrollToTopEvent(), c = !1)) : 0 == a && 0 < b ? (f = this._innerContainer.getBottomBoundary(),
            f + b >= this._bounceBottomBoundary && (e = this._bounceBottomBoundary - f, this.scrollToBottomEvent(), c = !1)) : 0 > a && 0 == b ? (f = this._innerContainer.getRightBoundary(), f + a <= this._bounceRightBoundary && (d = this._bounceRightBoundary - f, this.scrollToRightEvent(), c = !1)) : 0 == a && 0 > b ? (f = this._innerContainer.getTopBoundary(), f + b <= this._bounceTopBoundary && (e = this._bounceTopBoundary - f, this.scrollToTopEvent(), c = !1)) : 0 < a && 0 == b && (f = this._innerContainer.getLeftBoundary(), f + a >= this._bounceLeftBoundary && (d = this._bounceLeftBoundary -
            f, this.scrollToLeftEvent(), c = !1)) : 0 < a && 0 < b ? (f = this._innerContainer.getLeftBoundary(), f + a >= this._leftBoundary && (d = this._leftBoundary - f, this.scrollToLeftEvent(), c = !1), f = this._innerContainer.getBottomBoundary(), f + b >= this._bottomBoundary && (e = this._bottomBoundary - f, this.scrollToBottomEvent(), c = !1)) : 0 > a && 0 < b ? (f = this._innerContainer.getRightBoundary(), f + a <= this._rightBoundary && (d = this._rightBoundary - f, this.scrollToRightEvent(), c = !1), f = this._innerContainer.getBottomBoundary(), f + b >= this._bottomBoundary && (e =
            this._bottomBoundary - f, this.scrollToBottomEvent(), c = !1)) : 0 > a && 0 > b ? (f = this._innerContainer.getRightBoundary(), f + a <= this._rightBoundary && (d = this._rightBoundary - f, this.scrollToRightEvent(), c = !1), f = this._innerContainer.getTopBoundary(), f + b <= this._topBoundary && (e = this._topBoundary - f, this.scrollToTopEvent(), c = !1)) : 0 < a && 0 > b ? (f = this._innerContainer.getLeftBoundary(), f + a >= this._leftBoundary && (d = this._leftBoundary - f, this.scrollToLeftEvent(), c = !1), f = this._innerContainer.getTopBoundary(), f + b <= this._topBoundary &&
            (e = this._topBoundary - f, this.scrollToTopEvent(), c = !1)) : 0 == a && 0 < b ? (f = this._innerContainer.getBottomBoundary(), f + b >= this._bottomBoundary && (e = this._bottomBoundary - f, this.scrollToBottomEvent(), c = !1)) : 0 > a && 0 == b ? (f = this._innerContainer.getRightBoundary(), f + a <= this._rightBoundary && (d = this._rightBoundary - f, this.scrollToRightEvent(), c = !1)) : 0 == a && 0 > b ? (f = this._innerContainer.getTopBoundary(), f + b <= this._topBoundary && (e = this._topBoundary - f, this.scrollToTopEvent(), c = !1)) : 0 < a && 0 == b && (f = this._innerContainer.getLeftBoundary(),
            f + a >= this._leftBoundary && (d = this._leftBoundary - f, this.scrollToLeftEvent(), c = !1));
        this.moveChildren(d, e);
        return c
    }, scrollToBottom: function (a, b) {
        this.startAutoScrollChildrenWithDestination(cc.p(this._innerContainer.getPositionX(), 0), a, b)
    }, scrollToTop: function (a, b) {
        this.startAutoScrollChildrenWithDestination(cc.p(this._innerContainer.getPositionX(), this._contentSize.height - this._innerContainer.getContentSize().height), a, b)
    }, scrollToLeft: function (a, b) {
        this.startAutoScrollChildrenWithDestination(cc.p(0,
            this._innerContainer.getPositionY()), a, b)
    }, scrollToRight: function (a, b) {
        this.startAutoScrollChildrenWithDestination(cc.p(this._contentSize.width - this._innerContainer.getContentSize().width, this._innerContainer.getPositionY()), a, b)
    }, scrollToTopLeft: function (a, b) {
        this.direction != ccui.ScrollView.DIR_BOTH ? cc.log("Scroll direction is not both!") : this.startAutoScrollChildrenWithDestination(cc.p(0, this._contentSize.height - this._innerContainer.getContentSize().height), a, b)
    }, scrollToTopRight: function (a, b) {
        if (this.direction !=
            ccui.ScrollView.DIR_BOTH)cc.log("Scroll direction is not both!"); else {
            var c = this._innerContainer.getContentSize();
            this.startAutoScrollChildrenWithDestination(cc.p(this._contentSize.width - c.width, this._contentSize.height - c.height), a, b)
        }
    }, scrollToBottomLeft: function (a, b) {
        this.direction != ccui.ScrollView.DIR_BOTH ? cc.log("Scroll direction is not both!") : this.startAutoScrollChildrenWithDestination(cc.p(0, 0), a, b)
    }, scrollToBottomRight: function (a, b) {
        this.direction != ccui.ScrollView.DIR_BOTH ? cc.log("Scroll direction is not both!") :
            this.startAutoScrollChildrenWithDestination(cc.p(this._contentSize.width - this._innerContainer.getContentSize().width, 0), a, b)
    }, scrollToPercentVertical: function (a, b, c) {
        var d = this._contentSize.height - this._innerContainer.getContentSize().height, e = -d;
        this.startAutoScrollChildrenWithDestination(cc.p(this._innerContainer.getPositionX(), d + a * e / 100), b, c)
    }, scrollToPercentHorizontal: function (a, b, c) {
        var d = this._innerContainer.getContentSize().width - this._contentSize.width;
        this.startAutoScrollChildrenWithDestination(cc.p(-(a *
            d / 100), this._innerContainer.getPositionY()), b, c)
    }, scrollToPercentBothDirection: function (a, b, c) {
        if (this.direction == ccui.ScrollView.DIR_BOTH) {
            var d = this._contentSize.height - this._innerContainer.getContentSize().height, e = -d, f = this._innerContainer.getContentSize().width - this._contentSize.width;
            this.startAutoScrollChildrenWithDestination(cc.p(-(a.x * f / 100), d + a.y * e / 100), b, c)
        }
    }, jumpToBottom: function () {
        this.jumpToDestination(this._innerContainer.getPositionX(), 0)
    }, jumpToTop: function () {
        this.jumpToDestination(this._innerContainer.getPositionX(),
                this._contentSize.height - this._innerContainer.getContentSize().height)
    }, jumpToLeft: function () {
        this.jumpToDestination(0, this._innerContainer.getPositionY())
    }, jumpToRight: function () {
        this.jumpToDestination(this._contentSize.width - this._innerContainer.getContentSize().width, this._innerContainer.getPositionY())
    }, jumpToTopLeft: function () {
        this.direction != ccui.ScrollView.DIR_BOTH ? cc.log("Scroll direction is not both!") : this.jumpToDestination(0, this._contentSize.height - this._innerContainer.getContentSize().height)
    },
    jumpToTopRight: function () {
        if (this.direction != ccui.ScrollView.DIR_BOTH)cc.log("Scroll direction is not both!"); else {
            var a = this._innerContainer.getContentSize();
            this.jumpToDestination(this._contentSize.width - a.width, this._contentSize.height - a.height)
        }
    }, jumpToBottomLeft: function () {
        this.direction != ccui.ScrollView.DIR_BOTH ? cc.log("Scroll direction is not both!") : this.jumpToDestination(0, 0)
    }, jumpToBottomRight: function () {
        this.direction != ccui.ScrollView.DIR_BOTH ? cc.log("Scroll direction is not both!") : this.jumpToDestination(this._contentSize.width -
            this._innerContainer.getContentSize().width, 0)
    }, jumpToPercentVertical: function (a) {
        var b = this._contentSize.height - this._innerContainer.getContentSize().height, c = -b;
        this.jumpToDestination(this._innerContainer.getPositionX(), b + a * c / 100)
    }, jumpToPercentHorizontal: function (a) {
        var b = this._innerContainer.getContentSize().width - this._contentSize.width;
        this.jumpToDestination(-(a * b / 100), this._innerContainer.getPositionY())
    }, jumpToPercentBothDirection: function (a) {
        if (this.direction == ccui.ScrollView.DIR_BOTH) {
            var b =
                this._innerContainer.getContentSize(), c = this._contentSize.height - b.height;
            this.jumpToDestination(-(a.x * (b.width - this._contentSize.width) / 100), c + a.y * -c / 100)
        }
    }, startRecordSlidAction: function () {
        this._autoScroll && this.stopAutoScrollChildren();
        this._bouncing && this.stopBounceChildren();
        this._slidTime = 0
    }, endRecordSlidAction: function () {
        if (!this.checkNeedBounce() && this.inertiaScrollEnabled && !(0.016 >= this._slidTime)) {
            var a = 0, b;
            switch (this.direction) {
                case ccui.ScrollView.DIR_VERTICAL:
                    a = this._touchEndPosition.y -
                        this._touchBeganPosition.y;
                    b = 0 > a ? ccui.ScrollView.SCROLLDIR_DOWN : ccui.ScrollView.SCROLLDIR_UP;
                    break;
                case ccui.ScrollView.DIR_HORIZONTAL:
                    a = this._touchEndPosition.x - this._touchBeganPosition.x;
                    b = 0 > a ? ccui.ScrollView.SCROLLDIR_LEFT : ccui.ScrollView.SCROLLDIR_RIGHT;
                    break;
                case ccui.ScrollView.DIR_BOTH:
                    b = cc.pSub(this._touchEndPosition, this._touchBeganPosition), a = cc.pLength(b), b = cc.pNormalize(b)
            }
            a = Math.min(Math.abs(a) / this._slidTime, ccui.ScrollView.AUTO_SCROLL_MAX_SPEED);
            this.startAutoScrollChildrenWithOriginalSpeed(b,
                a, !0, -1E3);
            this._slidTime = 0
        }
    }, handlePressLogic: function (a) {
        this.startRecordSlidAction();
        this._bePressed = !0
    }, handleMoveLogic: function (a) {
        a = cc.pSub(a.getLocation(), a.getPreviousLocation());
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                this.scrollChildren(0, a.y);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                this.scrollChildren(a.x, 0);
                break;
            case ccui.ScrollView.DIR_BOTH:
                this.scrollChildren(a.x, a.y)
        }
    }, handleReleaseLogic: function (a) {
        this.endRecordSlidAction();
        this._bePressed = !1
    }, onTouchBegan: function (a, b) {
        var c = ccui.Layout.prototype.onTouchBegan.call(this, a, b);
        this._hitted && this.handlePressLogic(a);
        return c
    }, onTouchMoved: function (a, b) {
        ccui.Layout.prototype.onTouchMoved.call(this, a, b);
        this.handleMoveLogic(a)
    }, onTouchEnded: function (a, b) {
        ccui.Layout.prototype.onTouchEnded.call(this, a, b);
        this.handleReleaseLogic(a)
    }, onTouchCancelled: function (a, b) {
        ccui.Layout.prototype.onTouchCancelled.call(this, a, b)
    }, update: function (a) {
        this._autoScroll && this.autoScrollChildren(a);
        this._bouncing && this.bounceChildren(a);
        this.recordSlidTime(a)
    }, recordSlidTime: function (a) {
        this._bePressed && (this._slidTime += a)
    }, interceptTouchEvent: function (a, b, c) {
        var d = c.getLocation();
        switch (a) {
            case ccui.Widget.TOUCH_BAGAN:
                this._touchBeganPosition.x = d.x;
                this._touchBeganPosition.y = d.y;
                this.handlePressLogic(c);
                break;
            case ccui.Widget.TOUCH_MOVED:
                cc.pLength(cc.pSub(b.getTouchBeganPosition(), d)) > this._childFocusCancelOffset && (b.setHighlighted(!1), this._touchMovePosition.x = d.x, this._touchMovePosition.y = d.y, this.handleMoveLogic(c));
                break;
            case ccui.Widget.TOUCH_CANCELED:
            case ccui.Widget.TOUCH_ENDED:
                this._touchEndPosition.x =
                    d.x, this._touchEndPosition.y = d.y, this.handleReleaseLogic(c)
        }
    }, scrollToTopEvent: function () {
        this._scrollViewEventListener && this._scrollViewEventSelector && this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_SCROLL_TO_TOP);
        this._eventCallback && this._eventCallback(this, ccui.ScrollView.EVENT_SCROLL_TO_TOP)
    }, scrollToBottomEvent: function () {
        this._scrollViewEventListener && this._scrollViewEventSelector && this._scrollViewEventSelector.call(this._scrollViewEventListener,
            this, ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM);
        this._eventCallback && this._eventCallback(this, ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM)
    }, scrollToLeftEvent: function () {
        this._scrollViewEventListener && this._scrollViewEventSelector && this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_SCROLL_TO_LEFT);
        this._eventCallback && this._eventCallback(this, ccui.ScrollView.EVENT_SCROLL_TO_LEFT)
    }, scrollToRightEvent: function () {
        this._scrollViewEventListener && this._scrollViewEventSelector &&
        this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_SCROLL_TO_RIGHT);
        this._eventCallback && this._eventCallback(this, ccui.ScrollView.EVENT_SCROLL_TO_RIGHT)
    }, scrollingEvent: function () {
        this._scrollViewEventListener && this._scrollViewEventSelector && this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_SCROLLING);
        this._eventCallback && this._eventCallback(this, ccui.ScrollView.EVENT_SCROLLING)
    }, bounceTopEvent: function () {
        this._scrollViewEventListener &&
        this._scrollViewEventSelector && this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_BOUNCE_TOP);
        this._eventCallback && this._eventCallback(this, ccui.ScrollView.EVENT_BOUNCE_TOP)
    }, bounceBottomEvent: function () {
        this._scrollViewEventListener && this._scrollViewEventSelector && this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_BOUNCE_BOTTOM);
        this._eventCallback && this._eventCallback(this, ccui.ScrollView.EVENT_BOUNCE_BOTTOM)
    }, bounceLeftEvent: function () {
        this._scrollViewEventListener &&
        this._scrollViewEventSelector && this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_BOUNCE_LEFT);
        this._eventCallback && this._eventCallback(this, ccui.ScrollView.EVENT_BOUNCE_LEFT)
    }, bounceRightEvent: function () {
        this._scrollViewEventListener && this._scrollViewEventSelector && this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_BOUNCE_RIGHT);
        this._eventCallback && this._eventCallback(this, ccui.ScrollView.EVENT_BOUNCE_RIGHT)
    }, addEventListenerScrollView: function (a, b) {
        this._scrollViewEventSelector = a;
        this._scrollViewEventListener = b
    }, addEventListener: function (a) {
        this._eventCallback = a
    }, setDirection: function (a) {
        this.direction = a
    }, getDirection: function () {
        return this.direction
    }, setBounceEnabled: function (a) {
        this.bounceEnabled = a
    }, isBounceEnabled: function () {
        return this.bounceEnabled
    }, setInertiaScrollEnabled: function (a) {
        this.inertiaScrollEnabled = a
    }, isInertiaScrollEnabled: function () {
        return this.inertiaScrollEnabled
    }, getInnerContainer: function () {
        return this._innerContainer
    },
    setLayoutType: function (a) {
        this._innerContainer.setLayoutType(a)
    }, getLayoutType: function () {
        return this._innerContainer.getLayoutType()
    }, _doLayout: function () {
        this._doLayoutDirty && (this._doLayoutDirty = !1)
    }, getDescription: function () {
        return"ScrollView"
    }, createCloneInstance: function () {
        return ccui.ScrollView.create()
    }, copyClonedWidgetChildren: function (a) {
        ccui.Layout.prototype.copyClonedWidgetChildren.call(this, a)
    }, copySpecialProperties: function (a) {
        a instanceof ccui.ScrollView && (ccui.Layout.prototype.copySpecialProperties.call(this,
            a), this.setInnerContainerSize(a.getInnerContainerSize()), this.setDirection(a.direction), this.setBounceEnabled(a.bounceEnabled), this.setInertiaScrollEnabled(a.inertiaScrollEnabled), this._scrollViewEventListener = a._scrollViewEventListener, this._scrollViewEventSelector = a._scrollViewEventSelector, this._eventCallback = a._eventCallback)
    }});
_p = ccui.ScrollView.prototype;
cc.defineGetterSetter(_p, "innerWidth", _p._getInnerWidth, _p._setInnerWidth);
cc.defineGetterSetter(_p, "innerHeight", _p._getInnerHeight, _p._setInnerHeight);
_p = null;
ccui.ScrollView.create = function () {
    return new ccui.ScrollView
};
ccui.ScrollView.DIR_NONE = 0;
ccui.ScrollView.DIR_VERTICAL = 1;
ccui.ScrollView.DIR_HORIZONTAL = 2;
ccui.ScrollView.DIR_BOTH = 3;
ccui.ScrollView.EVENT_SCROLL_TO_TOP = 0;
ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM = 1;
ccui.ScrollView.EVENT_SCROLL_TO_LEFT = 2;
ccui.ScrollView.EVENT_SCROLL_TO_RIGHT = 3;
ccui.ScrollView.EVENT_SCROLLING = 4;
ccui.ScrollView.EVENT_BOUNCE_TOP = 5;
ccui.ScrollView.EVENT_BOUNCE_BOTTOM = 6;
ccui.ScrollView.EVENT_BOUNCE_LEFT = 7;
ccui.ScrollView.EVENT_BOUNCE_RIGHT = 8;
ccui.ScrollView.AUTO_SCROLL_MAX_SPEED = 1E3;
ccui.ScrollView.SCROLLDIR_UP = cc.p(0, 1);
ccui.ScrollView.SCROLLDIR_DOWN = cc.p(0, -1);
ccui.ScrollView.SCROLLDIR_LEFT = cc.p(-1, 0);
ccui.ScrollView.SCROLLDIR_RIGHT = cc.p(1, 0);
ccui.ListView = ccui.ScrollView.extend({_model: null, _items: null, _gravity: null, _itemsMargin: 0, _listViewEventListener: null, _listViewEventSelector: null, _curSelectedIndex: 0, _refreshViewDirty: !0, _className: "ListView", ctor: function () {
    ccui.ScrollView.prototype.ctor.call(this);
    this._model = null;
    this._items = [];
    this._gravity = ccui.ListView.GRAVITY_CENTER_HORIZONTAL;
    this._itemsMargin = 0;
    this._listViewEventSelector = this._listViewEventListener = null;
    this._curSelectedIndex = 0;
    this._refreshViewDirty = !0
}, init: function () {
    return ccui.ScrollView.prototype.init.call(this) ?
        (this.setLayoutType(ccui.Layout.LINEAR_VERTICAL), !0) : !1
}, setItemModel: function (a) {
    a && (this._model = a)
}, updateInnerContainerSize: function () {
    switch (this.direction) {
        case ccui.ScrollView.DIR_VERTICAL:
            for (var a = this._items.length, b = (a - 1) * this._itemsMargin, c = 0; c < a; c++)var d = this._items[c], b = b + d.getContentSize().height;
            a = this._contentSize.width;
            this.setInnerContainerSize(cc.size(a, b));
            break;
        case ccui.ScrollView.DIR_HORIZONTAL:
            a = this._items.length;
            b = (a - 1) * this._itemsMargin;
            for (c = 0; c < a; c++)d = this._items[c],
                b += d.getContentSize().width;
            a = this._contentSize.height;
            this.setInnerContainerSize(cc.size(b, a))
    }
}, remedyLayoutParameter: function (a) {
    if (a)switch (this.direction) {
        case ccui.ScrollView.DIR_VERTICAL:
            var b = a.getLayoutParameter();
            if (b)switch (0 == this.getIndex(a) ? b.setMargin(ccui.MarginZero()) : b.setMargin(new ccui.Margin(0, this._itemsMargin, 0, 0)), this._gravity) {
                case ccui.ListView.GRAVITY_LEFT:
                    b.setGravity(ccui.LinearLayoutParameter.LEFT);
                    break;
                case ccui.ListView.GRAVITY_RIGHT:
                    b.setGravity(ccui.LinearLayoutParameter.RIGHT);
                    break;
                case ccui.ListView.GRAVITY_CENTER_HORIZONTAL:
                    b.setGravity(ccui.LinearLayoutParameter.CENTER_HORIZONTAL)
            } else {
                b = ccui.LinearLayoutParameter.create();
                switch (this._gravity) {
                    case ccui.ListView.GRAVITY_LEFT:
                        b.setGravity(ccui.LinearLayoutParameter.LEFT);
                        break;
                    case ccui.ListView.GRAVITY_RIGHT:
                        b.setGravity(ccui.LinearLayoutParameter.RIGHT);
                        break;
                    case ccui.ListView.GRAVITY_CENTER_HORIZONTAL:
                        b.setGravity(ccui.LinearLayoutParameter.CENTER_HORIZONTAL)
                }
                0 == this.getIndex(a) ? b.setMargin(ccui.MarginZero()) : b.setMargin(new ccui.Margin(0,
                    this._itemsMargin, 0, 0));
                a.setLayoutParameter(b)
            }
            break;
        case ccui.ScrollView.DIR_HORIZONTAL:
            if (b = a.getLayoutParameter())switch (0 == this.getIndex(a) ? b.setMargin(ccui.MarginZero()) : b.setMargin(new ccui.Margin(this._itemsMargin, 0, 0, 0)), this._gravity) {
                case ccui.ListView.GRAVITY_TOP:
                    b.setGravity(ccui.LinearLayoutParameter.TOP);
                    break;
                case ccui.ListView.GRAVITY_BOTTOM:
                    b.setGravity(ccui.LinearLayoutParameter.BOTTOM);
                    break;
                case ccui.ListView.GRAVITY_CENTER_VERTICAL:
                    b.setGravity(ccui.LinearLayoutParameter.CENTER_VERTICAL)
            } else {
                b =
                    ccui.LinearLayoutParameter.create();
                switch (this._gravity) {
                    case ccui.ListView.GRAVITY_TOP:
                        b.setGravity(ccui.LinearLayoutParameter.TOP);
                        break;
                    case ccui.ListView.GRAVITY_BOTTOM:
                        b.setGravity(ccui.LinearLayoutParameter.BOTTOM);
                        break;
                    case ccui.ListView.GRAVITY_CENTER_VERTICAL:
                        b.setGravity(ccui.LinearLayoutParameter.CENTER_VERTICAL)
                }
                0 == this.getIndex(a) ? b.setMargin(ccui.MarginZero()) : b.setMargin(new ccui.Margin(this._itemsMargin, 0, 0, 0));
                a.setLayoutParameter(b)
            }
    }
}, pushBackDefaultItem: function () {
    if (this._model) {
        var a =
            this._model.clone();
        this.remedyLayoutParameter(a);
        this.addChild(a);
        this._refreshViewDirty = !0
    }
}, insertDefaultItem: function (a) {
    if (this._model) {
        var b = this._model.clone();
        this._items.splice(a, 0, b);
        ccui.ScrollView.prototype.addChild.call(this, b);
        this.remedyLayoutParameter(b);
        this._refreshViewDirty = !0
    }
}, pushBackCustomItem: function (a) {
    this.remedyLayoutParameter(a);
    this.addChild(a);
    this._refreshViewDirty = !0
}, addChild: function (a, b, c) {
    a && (b = b || a.getLocalZOrder(), c = c || a.getTag(), ccui.ScrollView.prototype.addChild.call(this,
        a, b, c), this._items.push(a))
}, removeChild: function (a, b) {
    if (a) {
        var c = this._items.indexOf(a);
        -1 < c && this._items.splice(c, 1);
        ccui.ScrollView.prototype.removeChild.call(this, a, b)
    }
}, removeAllChildren: function () {
    this.removeAllChildrenWithCleanup(!0)
}, removeAllChildrenWithCleanup: function (a) {
    ccui.ScrollView.prototype.removeAllChildrenWithCleanup.call(this, a);
    this._items = []
}, insertCustomItem: function (a, b) {
    this._items.splice(b, 0, a);
    ccui.ScrollView.prototype.addChild.call(this, a);
    this.remedyLayoutParameter(a);
    this._refreshViewDirty = !0
}, removeItem: function (a) {
    if (a = this.getItem(a))this.removeChild(a), this._refreshViewDirty = !0
}, removeLastItem: function () {
    this.removeItem(this._items.length - 1)
}, removeAllItems: function () {
    this.removeAllChildren()
}, getItem: function (a) {
    return 0 > a || a >= this._items.length ? null : this._items[a]
}, getItems: function () {
    return this._items
}, getIndex: function (a) {
    return this._items.indexOf(a)
}, setGravity: function (a) {
    this._gravity != a && (this._gravity = a, this._refreshViewDirty = !0)
}, setItemsMargin: function (a) {
    this._itemsMargin !=
    a && (this._itemsMargin = a, this._refreshViewDirty = !0)
}, getItemsMargin: function () {
    return this._itemsMargin
}, setDirection: function (a) {
    switch (a) {
        case ccui.ScrollView.DIR_VERTICAL:
            this.setLayoutType(ccui.Layout.LINEAR_VERTICAL);
            break;
        case ccui.ScrollView.DIR_HORIZONTAL:
            this.setLayoutType(ccui.Layout.LINEAR_HORIZONTAL);
            break;
        case ccui.ScrollView.DIR_BOTH:
            return;
        default:
            return
    }
    ccui.ScrollView.prototype.setDirection.call(this, a)
}, requestRefreshView: function () {
    this._refreshViewDirty = !0
}, refreshView: function () {
    for (var a =
        0; a < this._items.length; a++) {
        var b = this._items[a];
        b.setLocalZOrder(a);
        this.remedyLayoutParameter(b)
    }
    this.updateInnerContainerSize()
}, _doLayout: function () {
    ccui.Layout.prototype._doLayout.call(this);
    this._refreshViewDirty && (this.refreshView(), this._refreshViewDirty = !1)
}, addEventListenerListView: function (a, b) {
    this._listViewEventListener = b;
    this._listViewEventSelector = a
}, addEventListener: function (a) {
    this._eventCallback = a
}, selectedItemEvent: function (a) {
    a = a == ccui.Widget.TOUCH_BAGAN ? ccui.ListView.ON_SELECTED_ITEM_START :
        ccui.ListView.ON_SELECTED_ITEM_END;
    this._listViewEventListener && this._listViewEventSelector && this._listViewEventSelector.call(this._listViewEventListener, this, a);
    this._eventCallback && this._eventCallback(this, a)
}, interceptTouchEvent: function (a, b, c) {
    ccui.ScrollView.prototype.interceptTouchEvent.call(this, a, b, c);
    if (1 != a) {
        for (c = b; c;) {
            if (c && c.getParent() == this._innerContainer) {
                this._curSelectedIndex = this.getIndex(c);
                break
            }
            c = c.getParent()
        }
        b.isHighlighted() && this.selectedItemEvent(a)
    }
}, getCurSelectedIndex: function () {
    return this._curSelectedIndex
},
    onSizeChanged: function () {
        ccui.ScrollView.prototype.onSizeChanged.call(this);
        this._refreshViewDirty = !0
    }, getDescription: function () {
        return"ListView"
    }, createCloneInstance: function () {
        return ccui.ListView.create()
    }, copyClonedWidgetChildren: function (a) {
        a = a.getItems();
        for (var b = 0; b < a.length; b++)this.pushBackCustomItem(a[b].clone())
    }, copySpecialProperties: function (a) {
        ccui.ScrollView.prototype.copySpecialProperties.call(this, a);
        this.setItemModel(a._model);
        this.setItemsMargin(a._itemsMargin);
        this.setGravity(a._gravity);
        this._listViewEventListener = a._listViewEventListener;
        this._listViewEventSelector = a._listViewEventSelector;
        this._eventCallback = a._eventCallback
    }});
ccui.ListView.create = function () {
    return new ccui.ListView
};
ccui.ListView.EVENT_SELECTED_ITEM = 0;
ccui.ListView.ON_SELECTED_ITEM_START = 0;
ccui.ListView.ON_SELECTED_ITEM_END = 1;
ccui.ListView.GRAVITY_LEFT = 0;
ccui.ListView.GRAVITY_RIGHT = 1;
ccui.ListView.GRAVITY_CENTER_HORIZONTAL = 2;
ccui.ListView.GRAVITY_TOP = 3;
ccui.ListView.GRAVITY_BOTTOM = 4;
ccui.ListView.GRAVITY_CENTER_VERTICAL = 5;
ccui.PageView = ccui.Layout.extend({_curPageIdx: 0, _pages: null, _touchMoveDirection: null, _touchStartLocation: 0, _touchMoveStartLocation: 0, _movePagePoint: null, _leftBoundaryChild: null, _rightBoundaryChild: null, _leftBoundary: 0, _rightBoundary: 0, _isAutoScrolling: !1, _autoScrollDistance: 0, _autoScrollSpeed: 0, _autoScrollDirection: 0, _childFocusCancelOffset: 0, _pageViewEventListener: null, _pageViewEventSelector: null, _className: "PageView", _eventCallback: null, ctor: function () {
    ccui.Layout.prototype.ctor.call(this);
    this._curPageIdx =
        0;
    this._pages = [];
    this._touchMoveDirection = ccui.PageView.TOUCH_DIR_LEFT;
    this._touchMoveStartLocation = this._touchStartLocation = 0;
    this._rightBoundaryChild = this._leftBoundaryChild = this._movePagePoint = null;
    this._rightBoundary = this._leftBoundary = 0;
    this._isAutoScrolling = !1;
    this._autoScrollDirection = this._autoScrollSpeed = this._autoScrollDistance = 0;
    this._childFocusCancelOffset = 5;
    this._pageViewEventSelector = this._pageViewEventListener = null
}, init: function () {
    return ccui.Layout.prototype.init.call(this) ? (this.setClippingEnabled(!0),
        !0) : !1
}, onEnter: function () {
    ccui.Layout.prototype.onEnter.call(this);
    this.scheduleUpdate(!0)
}, addWidgetToPage: function (a, b, c) {
    if (a && !(0 > b)) {
        var d = this.getPageCount();
        b >= d ? c && (b > d && cc.log("pageIdx is %d, it will be added as page id [%d]", b, d), b = this.createPage(), b.addChild(a), this.addPage(b)) : (b = this._pages[b]) && b.addChild(a)
    }
}, createPage: function () {
    var a = ccui.Layout.create();
    a.setContentSize(this.getContentSize());
    return a
}, addPage: function (a) {
    a && -1 == this._pages.indexOf(a) && (this.addProtectedChild(a),
        this._pages.push(a), this._doLayoutDirty = !0)
}, insertPage: function (a, b) {
    if (!(0 > b || !a || -1 != this._pages.indexOf(a))) {
        var c = this.getPageCount();
        b >= c ? this.addPage(a) : (this._pages[b] = a, this.addProtectedChild(a));
        this._doLayoutDirty = !0
    }
}, removePage: function (a) {
    a && (this.removeProtectedChild(a), a = this._pages.indexOf(a), -1 < a && this._pages.splice(a, 1), this._doLayoutDirty = !0)
}, removePageAtIndex: function (a) {
    0 > a || a >= this._pages.length || (a = this._pages[a]) && this.removePage(a)
}, removeAllPages: function () {
    for (var a = this._pages,
             b = 0, c = a.length; b < c; b++)this.removeProtectedChild(a[b]);
    this._pages.length = 0
}, updateBoundaryPages: function () {
    0 >= this._pages.length ? this._rightBoundaryChild = this._leftBoundaryChild = null : (this._leftBoundaryChild = this._pages[0], this._rightBoundaryChild = this._pages[this._pages.length - 1])
}, getPageCount: function () {
    return this._pages.length
}, getPositionXByIndex: function (a) {
    return this.getSize().width * (a - this._curPageIdx)
}, onSizeChanged: function () {
    ccui.Layout.prototype.onSizeChanged.call(this);
    this._rightBoundary =
        this.getContentSize().width;
    this._doLayoutDirty = !0
}, updateAllPagesSize: function () {
    for (var a = this.getContentSize(), b = this._pages, c = 0, d = b.length; c < d; c++)b[c].setContentSize(a)
}, updateAllPagesPosition: function () {
    var a = this.getPageCount();
    if (0 >= a)this._curPageIdx = 0; else {
        this._curPageIdx >= a && (this._curPageIdx = a - 1);
        for (var b = this.getContentSize().width, c = this._pages, d = 0; d < a; d++)c[d].setPosition(cc.p((d - this._curPageIdx) * b, 0))
    }
}, scrollToPage: function (a) {
    0 > a || a >= this._pages.length || (this._curPageIdx = a, this._autoScrollDistance = -this._pages[a].getPosition().x, this._autoScrollSpeed = Math.abs(this._autoScrollDistance) / 0.2, this._autoScrollDirection = 0 < this._autoScrollDistance ? 1 : 0, this._isAutoScrolling = !0)
}, update: function (a) {
    this._isAutoScrolling && this.autoScroll(a)
}, autoScroll: function (a) {
    switch (this._autoScrollDirection) {
        case 0:
            a *= this._autoScrollSpeed;
            0 <= this._autoScrollDistance + a ? (a = -this._autoScrollDistance, this._autoScrollDistance = 0, this._isAutoScrolling = !1) : this._autoScrollDistance += a;
            this.scrollPages(-a);
            this._isAutoScrolling ||
            this.pageTurningEvent();
            break;
        case 1:
            a *= this._autoScrollSpeed, 0 >= this._autoScrollDistance - a ? (a = this._autoScrollDistance, this._autoScrollDistance = 0, this._isAutoScrolling = !1) : this._autoScrollDistance -= a, this.scrollPages(a), this._isAutoScrolling || this.pageTurningEvent()
    }
}, onTouchBegan: function (a, b) {
    var c = ccui.Layout.prototype.onTouchBegan.call(this, a, b);
    this._hitted && this.handlePressLogic(a);
    return c
}, onTouchMoved: function (a, b) {
    this.handleMoveLogic(a);
    var c = this.getWidgetParent();
    c && c.interceptTouchEvent(ccui.Widget.TOUCH_MOVED,
        this, a);
    this.moveEvent()
}, onTouchEnded: function (a, b) {
    ccui.Layout.prototype.onTouchEnded.call(this, a, b);
    this.handleReleaseLogic(a)
}, onTouchCancelled: function (a, b) {
    ccui.Layout.prototype.onTouchCancelled.call(this, a, b);
    this.handleReleaseLogic(a)
}, _doLayout: function () {
    this._doLayoutDirty && (this.updateAllPagesPosition(), this.updateAllPagesSize(), this.updateBoundaryPages(), this._doLayoutDirty = !1)
}, movePages: function (a) {
    for (var b = this._pages, c = b.length, d = 0; d < c; d++) {
        var e = b[d], f = e.getPosition();
        e.setPosition(f.x +
            a, f.y)
    }
}, scrollPages: function (a) {
    if (0 >= this._pages.length || !this._leftBoundaryChild || !this._rightBoundaryChild)return!1;
    var b = a;
    switch (this._touchMoveDirection) {
        case ccui.PageView.TOUCH_DIR_LEFT:
            if (this._rightBoundaryChild.getRightBoundary() + a <= this._rightBoundary)return b = this._rightBoundary - this._rightBoundaryChild.getRightBoundary(), this.movePages(b), !1;
            break;
        case ccui.PageView.TOUCH_DIR_RIGHT:
            if (this._leftBoundaryChild.getLeftBoundary() + a >= this._leftBoundary)return b = this._leftBoundary - this._leftBoundaryChild.getLeftBoundary(),
                this.movePages(b), !1
    }
    this.movePages(b);
    return!0
}, handlePressLogic: function (a) {
}, handleMoveLogic: function (a) {
    a = a.getLocation().x - a.getPreviousLocation().x;
    0 > a ? this._touchMoveDirection = ccui.PageView.TOUCH_DIR_LEFT : 0 < a && (this._touchMoveDirection = ccui.PageView.TOUCH_DIR_RIGHT);
    this.scrollPages(a)
}, handleReleaseLogic: function (a) {
    if (!(0 >= this._pages.length) && (a = this._pages[this._curPageIdx])) {
        var b = a.getPosition();
        a = this._pages.length;
        var b = b.x, c = this.getSize().width / 2;
        b <= -c ? this._curPageIdx >= a - 1 ? this.scrollPages(-b) :
            this.scrollToPage(this._curPageIdx + 1) : b >= c ? 0 >= this._curPageIdx ? this.scrollPages(-b) : this.scrollToPage(this._curPageIdx - 1) : this.scrollToPage(this._curPageIdx)
    }
}, interceptTouchEvent: function (a, b, c) {
    switch (a) {
        case 0:
            this.handlePressLogic(c);
            break;
        case 1:
            a = 0;
            a = Math.abs(b.getTouchBeganPosition().x - c.x);
            a > this._childFocusCancelOffset && (b.setFocused(!1), this.handleMoveLogic(c));
            break;
        case 2:
            this.handleReleaseLogic(c)
    }
}, pageTurningEvent: function () {
    this._pageViewEventListener && this._pageViewEventSelector &&
    this._pageViewEventSelector.call(this._pageViewEventListener, this, ccui.PageView.EVENT_TURNING);
    this._eventCallback && this._eventCallback(this, ccui.PageView.EVENT_TURNING)
}, addEventListenerPageView: function (a, b) {
    this._pageViewEventSelector = a;
    this._pageViewEventListener = b
}, addEventListener: function (a) {
    this._eventCallback = a
}, getCurPageIndex: function () {
    return this._curPageIdx
}, getPages: function () {
    return this._pages
}, getPage: function (a) {
    return 0 > a || a >= this.getPages().size() ? null : this._pages[a]
}, getDescription: function () {
    return"PageView"
},
    createCloneInstance: function () {
        return ccui.PageView.create()
    }, copyClonedWidgetChildren: function (a) {
        a = a.getPages();
        for (var b = 0; b < a.length; b++)this.addPage(a[b].clone())
    }, copySpecialProperties: function (a) {
        ccui.Layout.prototype.copySpecialProperties.call(this, a);
        this._eventCallback = a._eventCallback;
        this._pageViewEventListener = a._pageViewEventListener;
        this._pageViewEventSelector = a._pageViewEventSelector
    }});
ccui.PageView.create = function () {
    var a = new ccui.PageView;
    return a && a.init() ? a : null
};
ccui.PageView.EVENT_TURNING = 0;
ccui.PageView.TOUCH_DIR_LEFT = 0;
ccui.PageView.TOUCH_DIR_RIGHT = 1;