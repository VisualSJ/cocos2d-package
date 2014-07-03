cc.ProtectedNode = cc.NodeRGBA.extend({_protectedChildren: null, _reorderProtectedChildDirty: false, _insertProtectedChild: function (child, z) {
    this._reorderProtectedChildDirty = true;
    this._protectedChildren.push(child);
    child._setLocalZOrder(z)
}, ctor: function () {
    cc.NodeRGBA.prototype.ctor.call(this);
    this._protectedChildren = []
}, addProtectedChild: function (child, localZOrder, tag) {
    cc.assert(child != null, "child must be non-nil");
    cc.assert(!child.parent, "child already added. It can't be added again");
    localZOrder = localZOrder ||
        child.getLocalZOrder();
    if (tag)child.setTag(tag);
    this._insertProtectedChild(child, localZOrder);
    child.setParent(this);
    child.setOrderOfArrival(cc.s_globalOrderOfArrival);
    if (this._running) {
        child.onEnter();
        if (this._isTransitionFinished)child.onEnterTransitionDidFinish()
    }
    if (this._cascadeColorEnabled)this._enableCascadeColor();
    if (this._cascadeOpacityEnabled)this._enableCascadeOpacity()
}, getProtectedChildByTag: function (tag) {
    cc.assert(tag != cc.NODE_TAG_INVALID, "Invalid tag");
    var locChildren = this._protectedChildren;
    for (var i = 0, len = locChildren.length; i < len; i++)if (locChildren.getTag() == tag)return locChildren[i];
    return null
}, removeProtectedChild: function (child, cleanup) {
    if (cleanup == null)cleanup = true;
    var locChildren = this._protectedChildren;
    if (locChildren.length === 0)return;
    var idx = locChildren.indexOf(child);
    if (idx > -1) {
        if (this._running) {
            child.onExitTransitionDidStart();
            child.onExit()
        }
        if (cleanup)child.cleanup();
        child.setParent(null);
        locChildren.splice(idx, 1)
    }
}, removeProtectedChildByTag: function (tag, cleanup) {
    cc.assert(tag !=
        cc.NODE_TAG_INVALID, "Invalid tag");
    if (cleanup == null)cleanup = true;
    var child = this.getProtectedChildByTag(tag);
    if (child == null)cc.log("cocos2d: removeChildByTag(tag \x3d %d): child not found!", tag); else this.removeProtectedChild(child, cleanup)
}, removeAllProtectedChildren: function () {
    this.removeAllProtectedChildrenWithCleanup(true)
}, removeAllProtectedChildrenWithCleanup: function (cleanup) {
    if (cleanup == null)cleanup = true;
    var locChildren = this._protectedChildren;
    for (var i = 0, len = locChildren.length; i < len; i++) {
        var child =
            locChildren[i];
        if (this._running) {
            child.onExitTransitionDidStart();
            child.onExit()
        }
        if (cleanup)child.cleanup();
        child.setParent(null)
    }
    locChildren.length = 0
}, reorderProtectedChild: function (child, localZOrder) {
    cc.assert(child != null, "Child must be non-nil");
    this._reorderProtectedChildDirty = true;
    child.setOrderOfArrival(cc.s_globalOrderOfArrival++);
    child._setLocalZOrder(localZOrder)
}, sortAllProtectedChildren: function () {
    if (this._reorderProtectedChildDirty) {
        var _children = this._protectedChildren;
        var len = _children.length,
            i, j, tmp;
        for (i = 1; i < len; i++) {
            tmp = _children[i];
            j = i - 1;
            while (j >= 0) {
                if (tmp._localZOrder < _children[j]._localZOrder)_children[j + 1] = _children[j]; else if (tmp._localZOrder === _children[j]._localZOrder && tmp.arrivalOrder < _children[j].arrivalOrder)_children[j + 1] = _children[j]; else break;
                j--
            }
            _children[j + 1] = tmp
        }
        this._reorderProtectedChildDirty = false
    }
}, visit: null, _visitForCanvas: function (ctx) {
    var _t = this;
    if (!_t._visible)return;
    var context = ctx || cc._renderContext, i, j;
    var children = _t._children, child;
    var locChildren = _t._children,
        locProtectedChildren = this._protectedChildren;
    var childLen = locChildren.length, pLen = locProtectedChildren.length;
    context.save();
    _t.transform(context);
    _t.sortAllChildren();
    _t.sortAllProtectedChildren();
    for (i = 0; i < childLen; i++) {
        child = children[i];
        if (child._localZOrder < 0)child.visit(context); else break
    }
    for (j = 0; j < pLen; j++) {
        child = locProtectedChildren[j];
        if (child._localZOrder < 0)child.visit(context); else break
    }
    _t.draw(context);
    for (; i < childLen; i++)children[i] && children[i].visit(context);
    for (; j < pLen; j++)locProtectedChildren[i] &&
    locProtectedChildren[i].visit(context);
    this._cacheDirty = false;
    _t.arrivalOrder = 0;
    context.restore()
}, _visitForWebGL: function () {
    var _t = this;
    if (!_t._visible)return;
    var context = cc._renderContext, i, currentStack = cc.current_stack, j;
    currentStack.stack.push(currentStack.top);
    cc.kmMat4Assign(_t._stackMatrix, currentStack.top);
    currentStack.top = _t._stackMatrix;
    var locGrid = _t.grid;
    if (locGrid && locGrid._active)locGrid.beforeDraw();
    _t.transform();
    var locChildren = _t._children, locProtectedChildren = this._protectedChildren;
    var childLen = locChildren.length, pLen = locProtectedChildren.length;
    _t.sortAllChildren();
    _t.sortAllProtectedChildren();
    for (i = 0; i < childLen; i++)if (locChildren[i] && locChildren[i]._localZOrder < 0)locChildren[i].visit(); else break;
    for (j = 0; j < pLen; j++)if (locProtectedChildren[j] && locProtectedChildren[j]._localZOrder < 0)locProtectedChildren[j].visit(); else break;
    _t.draw(context);
    for (; i < childLen; i++)if (locChildren[i])locChildren[i].visit();
    for (; j < pLen; j++)if (locProtectedChildren[j])locProtectedChildren[j].visit();
    _t.arrivalOrder = 0;
    if (locGrid && locGrid._active)locGrid.afterDraw(_t);
    currentStack.top = currentStack.stack.pop()
}, cleanup: function () {
    cc.Node.prototype.cleanup.call(this);
    var locChildren = this._protectedChildren;
    for (var i = 0, len = locChildren.length; i < len; i++)locChildren[i].cleanup()
}, onEnter: function () {
    cc.Node.prototype.onEnter.call(this);
    var locChildren = this._protectedChildren;
    for (var i = 0, len = locChildren.length; i < len; i++)locChildren[i].onEnter()
}, onEnterTransitionDidFinish: function () {
    cc.Node.prototype.onEnterTransitionDidFinish.call(this);
    var locChildren = this._protectedChildren;
    for (var i = 0, len = locChildren.length; i < len; i++)locChildren[i].onEnterTransitionDidFinish()
}, onExit: function () {
    cc.Node.prototype.onExit.call(this);
    var locChildren = this._protectedChildren;
    for (var i = 0, len = locChildren.length; i < len; i++)locChildren[i].onExit()
}, onExitTransitionDidStart: function () {
    cc.Node.prototype.onExitTransitionDidStart.call(this);
    var locChildren = this._protectedChildren;
    for (var i = 0, len = locChildren.length; i < len; i++)locChildren[i].onExitTransitionDidStart()
},
    updateDisplayedOpacity: function (parentOpacity) {
        this._displayedOpacity = this._realOpacity * parentOpacity / 255;
        this._updateColor();
        if (this._cascadeOpacityEnabled) {
            var i, len, locChildren = this._children, _opacity = this._displayedOpacity;
            for (i = 0, len = locChildren.length; i < len; i++)if (locChildren[i].updateDisplayedOpacity)locChildren[i].updateDisplayedOpacity(_opacity);
            locChildren = this._protectedChildren;
            for (i = 0, len = locChildren.length; i < len; i++)if (locChildren[i].updateDisplayedOpacity)locChildren[i].updateDisplayedOpacity(_opacity)
        }
    },
    updateDisplayedColor: function (parentColor) {
        var displayedColor = this._displayedColor, realColor = this._realColor;
        displayedColor.r = realColor.r * parentColor.r / 255;
        displayedColor.g = realColor.g * parentColor.g / 255;
        displayedColor.b = realColor.b * parentColor.b / 255;
        this._updateColor();
        if (this._cascadeColorEnabled) {
            var i, len, locChildren = this._children;
            for (i = 0, len = locChildren.length; i < len; i++)if (locChildren[i].updateDisplayedColor)locChildren[i].updateDisplayedColor(displayedColor);
            locChildren = this._protectedChildren;
            for (i = 0, len = locChildren.length; i < len; i++)if (locChildren[i].updateDisplayedColor)locChildren[i].updateDisplayedColor(displayedColor)
        }
    }, disableCascadeColor: function () {
        var white = cc.color.WHITE;
        var i, len, locChildren = this._children;
        for (i = 0, len = locChildren.length; i < len; i++)locChildren[i].updateDisplayedColor(white);
        locChildren = this._protectedChildren;
        for (i = 0, len = locChildren.length; i < len; i++)locChildren[i].updateDisplayedColor(white)
    }});
if (cc._renderType === cc._RENDER_TYPE_CANVAS)cc.ProtectedNode.prototype.visit = cc.ProtectedNode.prototype._visitForCanvas; else cc.ProtectedNode.prototype.visit = cc.ProtectedNode.prototype._visitForWebGL;
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
ccui.Widget = cc.ProtectedNode.extend({_enabled: true, _bright: true, _touchEnabled: false, _brightStyle: null, _updateEnabled: false, _touchBeganPosition: null, _touchMovePosition: null, _touchEndPosition: null, _touchEventListener: null, _touchEventSelector: null, _name: "default", _widgetType: null, _actionTag: 0, _size: cc.size(0, 0), _customSize: null, _layoutParameterDictionary: null, _layoutParameterType: 0, _focused: false, _focusEnabled: true, _ignoreSize: false, _affectByClipping: false, _sizeType: null, _sizePercent: null, positionType: null,
    _positionPercent: null, _reorderWidgetChildDirty: false, _hitted: false, _nodes: null, _touchListener: null, _color: null, _className: "Widget", _flippedX: false, _flippedY: false, _opacity: 255, _highlight: false, _touchEventCallback: null, ctor: function () {
        cc.ProtectedNode.prototype.ctor.call(this);
        this._brightStyle = ccui.Widget.BRIGHT_STYLE_NONE;
        this._touchBeganPosition = cc.p(0, 0);
        this._touchMovePosition = cc.p(0, 0);
        this._touchEndPosition = cc.p(0, 0);
        this._widgetType = ccui.Widget.TYPE_WIDGET;
        this._size = cc.size(0, 0);
        this._customSize =
            cc.size(0, 0);
        this._layoutParameterDictionary = {};
        this._sizeType = ccui.Widget.SIZE_ABSOLUTE;
        this._sizePercent = cc.p(0, 0);
        this.positionType = ccui.Widget.POSITION_ABSOLUTE;
        this._positionPercent = cc.p(0, 0);
        this._nodes = [];
        this._color = cc.color(255, 255, 255, 255);
        this._layoutParameterType = ccui.LayoutParameter.NONE;
        this.init()
    }, init: function () {
        if (cc.ProtectedNode.prototype.init.call(this)) {
            this._layoutParameterDictionary = {};
            this.initRenderer();
            this.setBright(true);
            this.onFocusChanged = this.onFocusChange.bind(this);
            this.onNextFocusedWidget = null;
            this.setAnchorPoint(cc.p(0.5, 0.5));
            this.ignoreContentAdaptWithSize(true);
            this.setCascadeColorEnabled(true);
            this.setCascadeOpacityEnabled(true);
            return true
        }
        return false
    }, onEnter: function () {
        this.updateSizeAndPosition();
        cc.ProtectedNode.prototype.onEnter.call(this)
    }, onExit: function () {
        this.unscheduleUpdate();
        cc.ProtectedNode.prototype.onExit.call(this)
    }, visit: function (ctx) {
        if (this._visible) {
            this.adaptRenderers();
            cc.ProtectedNode.prototype.visit.call(this, ctx)
        }
    }, getWidgetParent: function () {
        var widget =
            this.getParent();
        if (widget instanceof ccui.Widget)return widget;
        return null
    }, _updateContentSizeWithTextureSize: function (size) {
        var locSize = this._size;
        if (this._ignoreSize) {
            locSize.width = size.width;
            locSize.height = size.height
        } else {
            locSize.width = this._customSize.width;
            locSize.height = this._customSize.height
        }
        this.onSizeChanged()
    }, _isAncestorsEnabled: function () {
        var parentWidget = this._getAncensterWidget(this);
        if (parentWidget == null)return true;
        if (parentWidget && !parentWidget.isEnabled())return false;
        return parentWidget._isAncestorsEnabled()
    },
    _getAncensterWidget: function (node) {
        if (null == node)return null;
        var parent = node.getParent();
        if (null == parent)return null;
        if (parent instanceof ccui.Widget)return parent; else return this._getAncensterWidget(parent.getParent())
    }, _isAncestorsVisible: function (node) {
        if (null == node)return true;
        var parent = node.getParent();
        if (parent && !parent.isVisible())return false;
        return this._isAncestorsVisible(parent)
    }, _cleanupWidget: function () {
        this._eventDispatcher.removeEventListener(this._touchListener);
        if (this._focusedWidget ==
            this)this._focusedWidget = null
    }, setEnabled: function (enabled) {
        this._enabled = enabled
    }, initRenderer: function () {
    }, addNode: function (node, zOrder, tag) {
        if (node instanceof ccui.Widget) {
            cc.log("Please use addChild to add a Widget.");
            return
        }
        cc.Node.prototype.addChild.call(this, node, zOrder, tag);
        this._nodes.push(node)
    }, getNodeByTag: function (tag) {
        var _nodes = this._nodes;
        for (var i = 0; i < _nodes.length; i++) {
            var node = _nodes[i];
            if (node && node.getTag() == tag)return node
        }
        return null
    }, getNodes: function () {
        return this._nodes
    },
    removeNode: function (node, cleanup) {
        cc.Node.prototype.removeChild.call(this, node);
        cc.arrayRemoveObject(this._nodes, node)
    }, removeNodeByTag: function (tag, cleanup) {
        var node = this.getNodeByTag(tag);
        if (!node)cc.log("cocos2d: removeNodeByTag(tag \x3d %d): child not found!", tag); else this.removeNode(node)
    }, removeAllNodes: function () {
        for (var i = 0; i < this._nodes.length; i++) {
            var node = this._nodes[i];
            cc.Node.prototype.removeChild.call(this, node)
        }
        this._nodes.length = 0
    }, setSize: function (size) {
        var locW = this._customSize.width =
            size.width;
        var locH = this._customSize.height = size.height;
        if (this._ignoreSize) {
            locW = this.width;
            locH = this.height
        }
        this._size.width = locW;
        this._size.height = locH;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                locW = widgetParent.width;
                locH = widgetParent.height
            } else {
                locW = this._parent.width;
                locH = this._parent.height
            }
            this._sizePercent.x = locW > 0 ? this._customSize.width / locW : 0;
            this._sizePercent.y = locH > 0 ? this._customSize.height / locH : 0
        }
        this.onSizeChanged()
    }, _setWidth: function (w) {
        var locW =
            this._customSize.width = w;
        this._ignoreSize && (locW = this.width);
        this._size.width = locW;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            locW = widgetParent ? widgetParent.width : this._parent.width;
            this._sizePercent.x = locW > 0 ? this._customSize.width / locW : 0
        }
        this.onSizeChanged()
    }, _setHeight: function (h) {
        var locH = this._customSize.height = h;
        this._ignoreSize && (locH = this.height);
        this._size.height = locH;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            locH = widgetParent ? widgetParent.height : this._parent.height;
            this._sizePercent.y = locH > 0 ? this._customSize.height / locH : 0
        }
        this.onSizeChanged()
    }, setSizePercent: function (percent) {
        this._sizePercent.x = percent.x;
        this._sizePercent.y = percent.y;
        var width = this._customSize.width, height = this._customSize.height;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                width = widgetParent.width * percent.x;
                height = widgetParent.height * percent.y
            } else {
                width = this._parent.width * percent.x;
                height = this._parent.height * percent.y
            }
        }
        if (!this._ignoreSize) {
            this._size.width =
                width;
            this._size.height = height
        }
        this._customSize.width = width;
        this._customSize.height = height;
        this.onSizeChanged()
    }, _setWidthPercent: function (percent) {
        this._sizePercent.x = percent;
        var width = this._customSize.width;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            width = (widgetParent ? widgetParent.width : this._parent.width) * percent
        }
        this._ignoreSize || (this._size.width = width);
        this._customSize.width = width;
        this.onSizeChanged()
    }, _setHeightPercent: function (percent) {
        this._sizePercent.y = percent;
        var height =
            this._customSize.height;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            height = (widgetParent ? widgetParent.height : this._parent.height) * percent
        }
        this._ignoreSize || (this._size.height = height);
        this._customSize.height = height;
        this.onSizeChanged()
    }, updateSizeAndPosition: function (parentSize) {
        if (!parentSize) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent)parentSize = widgetParent.getLayoutSize(); else parentSize = this._parent.getContentSize()
        }
        var locSize;
        switch (this._sizeType) {
            case ccui.Widget.SIZE_ABSOLUTE:
                locSize =
                    this._ignoreSize ? this.getContentSize() : this._customSize;
                this._size.width = locSize.width;
                this._size.height = locSize.height;
                var spx = 0, spy = 0;
                if (parentSize.width > 0)spx = this._customSize.width / parentSize.width;
                if (parentSize.height > 0)spy = this._customSize.height / parentSize.height;
                this._sizePercent.x = spx;
                this._sizePercent.y = spy;
                break;
            case ccui.Widget.SIZE_PERCENT:
                var cSize = cc.size(parentSize.width * this._sizePercent.x, parentSize.height * this._sizePercent.y);
                locSize = this._ignoreSize ? this.getVirtualRendererSize() :
                    cSize;
                this._size.width = locSize.width;
                this._size.height = locSize.height;
                this._customSize.width = cSize.width;
                this._customSize.height = cSize.height;
                break;
            default:
                break
        }
        this.onSizeChanged();
        var absPos = this.getPosition();
        switch (this.positionType) {
            case ccui.Widget.POSITION_ABSOLUTE:
                if (parentSize.width <= 0 || parentSize.height <= 0) {
                    this._positionPercent.x = 0;
                    this._positionPercent.y = 0
                } else {
                    this._positionPercent.x = absPos.x / parentSize.width;
                    this._positionPercent.y = absPos.y / parentSize.height
                }
                break;
            case ccui.Widget.POSITION_PERCENT:
                absPos =
                    cc.p(parentSize.width * this._positionPercent.x, parentSize.height * this._positionPercent.y);
                break;
            default:
                break
        }
        this.setPosition(absPos)
    }, setSizeType: function (type) {
        this._sizeType = type
    }, getSizeType: function () {
        return this._sizeType
    }, ignoreContentAdaptWithSize: function (ignore) {
        if (this._ignoreSize == ignore)return;
        this._ignoreSize = ignore;
        var locSize = this._ignoreSize ? this.getContentSize() : this._customSize;
        this._size.width = locSize.width;
        this._size.height = locSize.height;
        this.onSizeChanged()
    }, isIgnoreContentAdaptWithSize: function () {
        return this._ignoreSize
    },
    getSize: function () {
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
        return this.convertToWorldSpace(cc.p(this._anchorPoint.x * this._contentSize.width, this._anchorPoint.y * this._contentSize.height))
    }, getVirtualRenderer: function () {
        return this
    },
    getVirtualRendererSize: function () {
        return cc.size(this._contentSize)
    }, onSizeChanged: function () {
        this.setContentSize(this._size);
        var locChildren = this.getChildren();
        for (var i = 0, len = locChildren.length; i < len; i++) {
            var child = locChildren[i];
            if (child instanceof ccui.Widget)child.updateSizeAndPosition()
        }
    }, getContentSize: function () {
        return this._size
    }, _getWidth: function () {
        return this._size.width
    }, _getHeight: function () {
        return this._size.height
    }, setTouchEnabled: function (enable) {
        if (this._touchEnabled === enable)return;
        this._touchEnabled = enable;
        if (this._touchEnabled) {
            this._touchListener = cc.EventListener.create({event: cc.EventListener.TOUCH_ONE_BY_ONE, swallowTouches: true, onTouchBegan: this.onTouchBegan.bind(this), onTouchMoved: this.onTouchMoved.bind(this), onTouchEnded: this.onTouchEnded.bind(this)});
            cc.eventManager.addListener(this._touchListener, this)
        } else cc.eventManager.removeListener(this._touchListener)
    }, isTouchEnabled: function () {
        return this._touchEnabled
    }, isHighlighted: function () {
        return this._highlight
    }, setHighlighted: function (highlight) {
        if (highlight ==
            this._highlight)return;
        this._highlight = highlight;
        if (this._bright)if (this._highlight)this.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT); else this.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL); else this.onPressStateChangedToDisabled()
    }, setUpdateEnabled: function (enable) {
        if (this._updateEnabled == enable)return;
        this._updateEnabled = enable;
        if (enable)this.scheduleUpdate(); else this.unscheduleUpdate()
    }, isUpdateEnabled: function () {
        return this._updateEnabled
    }, isFocused: function () {
        return this._focused
    },
    setFocused: function (focus) {
        this._focused = focus;
        if (focus)this._focusedWidget = this
    }, isFocusEnabled: function () {
        return this._focusEnabled
    }, setFocusEnabled: function (enable) {
        this._focused = enable
    }, findNextFocusedWidget: function (direction, current) {
        if (null == this.onNextFocusedWidget || null == this.onNextFocusedWidget(direction)) {
            var isLayout = current instanceof ccui.Layout;
            if (this.isFocused() || isLayout) {
                var layout = this.getParent();
                if (null == layout) {
                    if (isLayout)return current.findNextFocusedWidget(direction, current);
                    return current
                } else return layout.findNextFocusedWidget(direction, current)
            } else return current
        } else {
            var getFocusWidget = this.onNextFocusedWidget(direction);
            this.dispatchFocusEvent(this, getFocusWidget);
            return getFocusWidget
        }
    }, requestFocus: function () {
        if (this == this._focusedWidget)return;
        this.dispatchFocusEvent(this._focusedWidget, this)
    }, getCurrentFocusedWidget: function () {
        return this._focusedWidget
    }, enableDpadNavigation: function (enable) {
    }, onFocusChanged: null, onNextFocusedWidget: null, interceptTouchEvent: function (eventType, sender, touch) {
        var widgetParent = this.getWidgetParent();
        if (widgetParent)widgetParent.interceptTouchEvent(eventType, sender, touch)
    }, onFocusChange: function (widgetLostFocus, widgetGetFocus) {
        if (widgetLostFocus)widgetLostFocus.setFocused(false);
        if (widgetGetFocus)widgetGetFocus.setFocused(true)
    }, dispatchFocusEvent: function (widgetLostFocus, widgetGetFocus) {
        if (widgetLostFocus && !widgetLostFocus.isFocused())widgetLostFocus = this._focusedWidget;
        if (widgetGetFocus != widgetLostFocus) {
            if (widgetGetFocus && widgetGetFocus.onFocusChanged)widgetGetFocus.onFocusChanged(widgetLostFocus,
                widgetGetFocus);
            if (widgetLostFocus && widgetGetFocus.onFocusChanged)widgetLostFocus.onFocusChanged(widgetLostFocus, widgetGetFocus);
            cc.eventManager.dispatchEvent(new cc.EventFocus(widgetLostFocus, widgetGetFocus))
        }
    }, setBright: function (bright) {
        this._bright = bright;
        if (this._bright) {
            this._brightStyle = ccui.Widget.BRIGHT_STYLE_NONE;
            this.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL)
        } else this.onPressStateChangedToDisabled()
    }, setBrightStyle: function (style) {
        if (this._brightStyle == style)return;
        style = style || ccui.Widget.BRIGHT_STYLE_NORMAL;
        this._brightStyle = style;
        switch (this._brightStyle) {
            case ccui.Widget.BRIGHT_STYLE_NORMAL:
                this.onPressStateChangedToNormal();
                break;
            case ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT:
                this.onPressStateChangedToPressed();
                break;
            default:
                break
        }
    }, onPressStateChangedToNormal: function () {
    }, onPressStateChangedToPressed: function () {
    }, onPressStateChangedToDisabled: function () {
    }, didNotSelectSelf: function () {
    }, onTouchBegan: function (touch, event) {
        this._hitted = false;
        if (this.isVisible() && this.isEnabled() && this._isAncestorsEnabled() &&
            this._isAncestorsVisible(this)) {
            var touchPoint = touch.getLocation();
            this._touchBeganPosition.x = touchPoint.x;
            this._touchBeganPosition.y = touchPoint.y;
            if (this.hitTest(this._touchBeganPosition) && this.isClippingParentContainsPoint(this._touchBeganPosition))this._hitted = true
        }
        if (!this._hitted)return false;
        this.setHighlighted(true);
        var widgetParent = this.getWidgetParent();
        if (widgetParent)widgetParent.interceptTouchEvent(ccui.Widget.TOUCH_BAGAN, this, touch);
        this.pushDownEvent();
        return true
    }, onTouchMoved: function (touch, event) {
        var touchPoint = touch.getLocation();
        this._touchMovePosition.x = touchPoint.x;
        this._touchMovePosition.y = touchPoint.y;
        this.setHighlighted(this.hitTest(touchPoint));
        var widgetParent = this.getWidgetParent();
        if (widgetParent)widgetParent.interceptTouchEvent(ccui.Widget.TOUCH_MOVED, this, touch);
        this.moveEvent()
    }, onTouchEnded: function (touch, event) {
        var touchPoint = touch.getLocation();
        this._touchEndPosition.x = touchPoint.x;
        this._touchEndPosition.y = touchPoint.y;
        var widgetParent = this.getWidgetParent();
        if (widgetParent)widgetParent.interceptTouchEvent(ccui.Widget.TOUCH_ENDED,
            this, touch);
        var highlight = this._highlight;
        this.setHighlighted(false);
        if (highlight)this.releaseUpEvent(); else this.cancelUpEvent()
    }, onTouchCancelled: function (touchPoint) {
        this.setHighlighted(false);
        this.cancelUpEvent()
    }, onTouchLongClicked: function (touchPoint) {
        this.longClickEvent()
    }, pushDownEvent: function () {
        if (this._touchEventCallback)this._touchEventCallback(this, ccui.Widget.TOUCH_BAGAN);
        if (this._touchEventListener && this._touchEventSelector)this._touchEventSelector.call(this._touchEventListener, this,
            ccui.Widget.TOUCH_BEGAN)
    }, moveEvent: function () {
        if (this._touchEventCallback)this._touchEventCallback(this, ccui.Widget.TOUCH_MOVED);
        if (this._touchEventListener && this._touchEventSelector)this._touchEventSelector.call(this._touchEventListener, this, ccui.Widget.TOUCH_MOVED)
    }, releaseUpEvent: function () {
        if (this._touchEventCallback)this._touchEventCallback(this, ccui.Widget.TOUCH_ENDED);
        if (this._touchEventListener && this._touchEventSelector)this._touchEventSelector.call(this._touchEventListener, this, ccui.Widget.TOUCH_ENDED)
    },
    cancelUpEvent: function () {
        if (this._touchEventCallback)this._touchEventCallback(this, ccui.Widget.TOUCH_CANCELED);
        if (this._touchEventListener && this._touchEventSelector)this._touchEventSelector.call(this._touchEventListener, this, ccui.Widget.TOUCH_CANCELED)
    }, longClickEvent: function () {
    }, addTouchEventListener: function (selector, target) {
        if (target === undefined)this._touchEventCallback = selector; else {
            this._touchEventSelector = selector;
            this._touchEventListener = target
        }
    }, hitTest: function (pt) {
        var bb = cc.rect(0, 0, this._contentSize.width,
            this._contentSize.height);
        return cc.rectContainsPoint(bb, this.convertToNodeSpace(pt))
    }, isClippingParentContainsPoint: function (pt) {
        this._affectByClipping = false;
        var parent = this.getParent();
        var clippingParent = null;
        while (parent) {
            if (parent instanceof ccui.Layout)if (parent.isClippingEnabled()) {
                this._affectByClipping = true;
                clippingParent = parent;
                break
            }
            parent = parent.getParent()
        }
        if (!this._affectByClipping)return true;
        if (clippingParent) {
            if (clippingParent.hitTest(pt))return clippingParent.isClippingParentContainsPoint(pt);
            return false
        }
        return true
    }, clippingParentAreaContainPoint: function (pt) {
        cc.log("clippingParentAreaContainPoint is deprecated. Please use isClippingParentContainsPoint instead.");
        this.isClippingParentContainsPoint(pt)
    }, checkChildInfo: function (handleState, sender, touchPoint) {
        var widgetParent = this.getWidgetParent();
        if (widgetParent)widgetParent.checkChildInfo(handleState, sender, touchPoint)
    }, setPosition: function (pos, posY) {
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                var pSize =
                    widgetParent.getSize();
                if (pSize.width <= 0 || pSize.height <= 0) {
                    this._positionPercent.x = 0;
                    this._positionPercent.y = 0
                } else if (posY) {
                    this._positionPercent.x = pos / pSize.width;
                    this._positionPercent.y = posY / pSize.height
                } else {
                    this._positionPercent.x = pos.x / pSize.width;
                    this._positionPercent.y = pos.y / pSize.height
                }
            }
        }
        cc.Node.prototype.setPosition.call(this, pos, posY)
    }, setPositionX: function (x) {
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                var pw = widgetParent.width;
                if (pw <= 0)this._positionPercent.x =
                    0; else this._positionPercent.x = x / pw
            }
        }
        cc.Node.prototype.setPositionX.call(this, x)
    }, setPositionY: function (y) {
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                var ph = widgetParent.height;
                if (ph <= 0)this._positionPercent.y = 0; else this._positionPercent.y = y / ph
            }
        }
        cc.Node.prototype.setPositionY.call(this, y)
    }, setPositionPercent: function (percent) {
        this._positionPercent = percent;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                var parentSize = widgetParent.getSize();
                this.setPosition(parentSize.width * this._positionPercent.x, parentSize.height * this._positionPercent.y)
            }
        }
    }, _setXPercent: function (percent) {
        this._positionPercent.x = percent;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent)this.setPositionX(widgetParent.width * percent)
        }
    }, _setYPercent: function (percent) {
        this._positionPercent.y = percent;
        if (this._running) {
            var widgetParent = this.getWidgetParent();
            if (widgetParent)this.setPositionY(widgetParent.height * percent)
        }
    }, updateAnchorPoint: function () {
        this.setAnchorPoint(this.getAnchorPoint())
    },
    getPositionPercent: function () {
        return cc.p(this._positionPercent)
    }, _getXPercent: function () {
        return this._positionPercent.x
    }, _getYPercent: function () {
        return this._positionPercent.y
    }, setPositionType: function (type) {
        this.positionType = type
    }, getPositionType: function () {
        return this.positionType
    }, setFlippedX: function (flipX) {
        this._flippedX = flipX;
        this.updateFlippedX()
    }, isFlippedX: function () {
        return this._flippedX
    }, setFlippedY: function (flipY) {
        this._flippedY = flipY;
        this.updateFlippedY()
    }, isFlippedY: function () {
        return this._flippedY
    },
    updateFlippedX: function () {
    }, updateFlippedY: function () {
    }, adaptRenderers: function () {
    }, isBright: function () {
        return this._bright
    }, isEnabled: function () {
        return this._enabled
    }, getLeftBoundary: function () {
        return this.getPositionX() - this._getAnchorX() * this._size.width
    }, getBottomBoundary: function () {
        return this.getPositionY() - this._getAnchorY() * this._size.height
    }, getRightBoundary: function () {
        return this.getLeftBoundary() + this._size.width
    }, getTopBoundary: function () {
        return this.getBottomBoundary() + this._size.height
    },
    getTouchStartPos: function () {
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
    }, setName: function (name) {
        this._name = name
    }, getName: function () {
        return this._name
    }, getWidgetType: function () {
        return this._widgetType
    }, setLayoutParameter: function (parameter) {
        if (!parameter)return;
        this._layoutParameterDictionary[parameter.getLayoutType()] = parameter;
        this._layoutParameterType = parameter.getLayoutType()
    }, getLayoutParameter: function (type) {
        type = type || this._layoutParameterType;
        return this._layoutParameterDictionary[type]
    },
    getDescription: function () {
        return"Widget"
    }, clone: function () {
        var clonedWidget = this.createCloneInstance();
        clonedWidget.copyProperties(this);
        clonedWidget.copyClonedWidgetChildren(this);
        return clonedWidget
    }, createCloneInstance: function () {
        return ccui.Widget.create()
    }, copyClonedWidgetChildren: function (model) {
        var widgetChildren = model.getChildren();
        for (var i = 0; i < widgetChildren.length; i++) {
            var locChild = widgetChildren[i];
            if (locChild instanceof ccui.Widget)this.addChild(locChild.clone())
        }
    }, copySpecialProperties: function (model) {
    },
    copyProperties: function (widget) {
        this.setEnabled(widget.isEnabled());
        this.setVisible(widget.isVisible());
        this.setBright(widget.isBright());
        this.setTouchEnabled(widget.isTouchEnabled());
        this.setLocalZOrder(widget.getLocalZOrder());
        this.setUpdateEnabled(widget.isUpdateEnabled());
        this.setTag(widget.getTag());
        this.setName(widget.getName());
        this.setActionTag(widget.getActionTag());
        this._ignoreSize.width = widget._ignoreSize.width;
        this._ignoreSize.height = widget._ignoreSize.height;
        this._size.width = widget._size.width;
        this._size.height = widget._size.height;
        this._customSize.width = widget._customSize.width;
        this._customSize.height = widget._customSize.height;
        this.copySpecialProperties(widget);
        this._sizeType = widget.getSizeType();
        this._sizePercent.x = widget._sizePercent.x;
        this._sizePercent.y = widget._sizePercent.y;
        this.positionType = widget.positionType;
        this._positionPercent.x = widget._positionPercent.x;
        this._positionPercent.y = widget._positionPercent.y;
        this.setPosition(widget.getPosition());
        this.setAnchorPoint(widget.getAnchorPoint());
        this.setScaleX(widget.getScaleX());
        this.setScaleY(widget.getScaleY());
        this.setRotation(widget.getRotation());
        this.setRotationX(widget.getRotationX());
        this.setRotationY(widget.getRotationY());
        this.setFlippedX(widget.isFlippedX());
        this.setFlippedY(widget.isFlippedY());
        this.setColor(widget.getColor());
        this.setOpacity(widget.getOpacity());
        this._touchEventCallback = widget._touchEventCallback;
        this._touchEventListener = widget._touchEventListener;
        this._touchEventSelector = widget._touchEventSelector;
        this._focused =
            widget._focused;
        this._focusEnabled = widget._focusEnabled;
        for (var key in widget._layoutParameterDictionary) {
            var parameter = widget._layoutParameterDictionary[key];
            if (parameter)this.setLayoutParameter(parameter.clone())
        }
        this.onSizeChanged()
    }, setActionTag: function (tag) {
        this._actionTag = tag
    }, getActionTag: function () {
        return this._actionTag
    }, getColor: function () {
        return cc.color(this._color.r, this._color.g, this._color.b, this._color.a)
    }, setOpacity: function (opacity) {
        if (opacity === this._color.a)return;
        this._color.a =
            opacity;
        this.updateTextureOpacity(opacity)
    }, getOpacity: function () {
        return this._displayedOpacity
    }, updateTextureOpacity: function (opacity) {
        for (var p in this._children) {
            var item = this._children[p];
            if (item && item.RGBAProtocol)item.setOpacity(opacity)
        }
    }, updateColorToRenderer: function (renderer) {
        if (renderer.RGBAProtocol)renderer.setColor(this._color)
    }, updateOpacityToRenderer: function (renderer) {
        if (renderer.RGBAProtocol)renderer.setOpacity(this._color.a)
    }, updateRGBAToRenderer: function (renderer) {
        renderer.setColor(this._color);
        renderer.setOpacity(this._opacity)
    }});
var _p = ccui.Widget.prototype;
_p.xPercent;
cc.defineGetterSetter(_p, "xPercent", _p._getXPercent, _p._setXPercent);
_p.yPercent;
cc.defineGetterSetter(_p, "yPercent", _p._getYPercent, _p._setYPercent);
_p.widthPercent;
cc.defineGetterSetter(_p, "widthPercent", _p._getWidthPercent, _p._setWidthPercent);
_p.heightPercent;
cc.defineGetterSetter(_p, "heightPercent", _p._getHeightPercent, _p._setHeightPercent);
_p.widgetParent;
cc.defineGetterSetter(_p, "widgetParent", _p.getWidgetParent);
_p.enabled;
cc.defineGetterSetter(_p, "enabled", _p.isEnabled, _p.setEnabled);
_p.focused;
cc.defineGetterSetter(_p, "focused", _p.isFocused, _p.setFocused);
_p.sizeType;
cc.defineGetterSetter(_p, "sizeType", _p.getSizeType, _p.setSizeType);
_p.widgetType;
cc.defineGetterSetter(_p, "widgetType", _p.getWidgetType);
_p.touchEnabled;
cc.defineGetterSetter(_p, "touchEnabled", _p.isTouchEnabled, _p.setTouchEnabled);
_p.updateEnabled;
cc.defineGetterSetter(_p, "updateEnabled", _p.isUpdateEnabled, _p.setUpdateEnabled);
_p.bright;
cc.defineGetterSetter(_p, "bright", _p.isBright, _p.setBright);
_p.name;
cc.defineGetterSetter(_p, "name", _p.getName, _p.setName);
_p.actionTag;
cc.defineGetterSetter(_p, "actionTag", _p.getActionTag, _p.setActionTag);
_p.opacity;
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
cc.EventFocus = cc.Event.extend({_widgetGetFocus: null, _widgetLoseFocus: null, ctor: function (widgetLoseFocus, widgetGetFocus) {
    this._widgetGetFocus = widgetGetFocus;
    this._widgetLoseFocus = widgetLoseFocus
}});
ccui.Layout = ccui.Widget.extend({_clippingEnabled: false, _backGroundScale9Enabled: null, _backGroundImage: null, _backGroundImageFileName: null, _backGroundImageCapInsets: null, _colorType: null, _bgImageTexType: ccui.Widget.LOCAL_TEXTURE, _colorRender: null, _gradientRender: null, _color: null, _startColor: null, _endColor: null, _alongVector: null, _opacity: 255, _backGroundImageTextureSize: null, _layoutType: null, _doLayoutDirty: true, _clippingRectDirty: true, _clippingType: null, _clippingStencil: null, _handleScissor: false, _scissorRectDirty: false,
    _clippingRect: null, _clippingParent: null, _className: "Layout", _backGroundImageColor: null, _finalPositionX: 0, _finalPositionY: 0, _currentStencilEnabled: 0, _currentStencilWriteMask: 0, _currentStencilFunc: 0, _currentStencilRef: 0, _currentStencilValueMask: 0, _currentStencilFail: 0, _currentStencilPassDepthFail: 0, _currentStencilPassDepthPass: 0, _currentDepthWriteMask: 0, _currentAlphaTestEnabled: 0, _currentAlphaTestFunc: 0, _currentAlphaTestRef: 0, _backGroundImageOpacity: 0, _mask_layer_le: 0, _loopFocus: false, _passFocusToChild: false,
    _isFocusPassing: false, ctor: function () {
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
        this._doLayoutDirty = true;
        this._clippingRectDirty = true
    }, onExit: function () {
        ccui.Widget.prototype.onExit.call(this);
        if (this._clippingStencil)this._clippingStencil.onExit()
    }, setLoopFocus: function (loop) {
        this._loopFocus = loop
    }, isLoopFocus: function () {
        return this._loopFocus
    }, setPassFocusToChild: function (pass) {
        this._passFocusToChild =
            pass
    }, isPassFocusToChild: function () {
        return this._passFocusToChild
    }, findNextFocusedWidget: function (direction, current) {
        if (this._isFocusPassing || this.isFocused()) {
            var parent = this.getParent();
            this._isFocusPassing = false;
            if (this._passFocusToChild) {
                var w = this._passFocusToChild(direction, current);
                if (w instanceof ccui.Layout && parent) {
                    parent._isFocusPassing = true;
                    return parent.findNextFocusedWidget(direction, this)
                }
                return w
            }
            if (null == parent)return this;
            parent._isFocusPassing = true;
            return parent.findNextFocusedWidget(direction,
                this)
        } else if (current.isFocused() || current instanceof ccui.Layout)if (this._layoutType == ccui.Layout.LINEAR_HORIZONTAL)switch (direction) {
            case ccui.Widget.LEFT:
                return this._getPreviousFocusedWidget(direction, current);
                break;
            case ccui.Widget.RIGHT:
                return this._getNextFocusedWidget(direction, current);
                break;
            case ccui.Widget.DOWN:
            case ccui.Widget.UP:
                if (this._isLastWidgetInContainer(this, direction)) {
                    if (this._isWidgetAncestorSupportLoopFocus(current, direction))return this.findNextFocusedWidget(direction, this);
                    return current
                } else return this.findNextFocusedWidget(direction, this);
                break;
            default:
                cc.assert(0, "Invalid Focus Direction");
                return current
        } else if (this._layoutType == ccui.Layout.LINEAR_VERTICAL)switch (direction) {
            case ccui.Widget.LEFT:
            case ccui.Widget.RIGHT:
                if (this._isLastWidgetInContainer(this, direction)) {
                    if (this._isWidgetAncestorSupportLoopFocus(current, direction))return this.findNextFocusedWidget(direction, this);
                    return current
                } else return this.findNextFocusedWidget(direction, this);
                break;
            case ccui.Widget.DOWN:
                return this._getNextFocusedWidget(direction,
                    current);
                break;
            case ccui.Widget.UP:
                return this._getPreviousFocusedWidget(direction, current);
                break;
            default:
                cc.assert(0, "Invalid Focus Direction");
                return current
        } else {
            cc.assert(0, "Un Supported Layout type, please use VBox and HBox instead!!!");
            return current
        } else return current
    }, onPassFocusToChild: null, init: function () {
        if (ccui.Widget.prototype.init.call(this)) {
            this.ignoreContentAdaptWithSize(false);
            this.setSize(cc.size(0, 0));
            this.setAnchorPoint(0, 0);
            this.onPassFocusToChild = this._findNearestChildWidgetIndex.bind(this);
            return true
        }
        return false
    }, __stencilDraw: function (ctx) {
        var locContext = ctx || cc._renderContext;
        var stencil = this._clippingStencil;
        var locEGL_ScaleX = cc.view.getScaleX(), locEGL_ScaleY = cc.view.getScaleY();
        for (var i = 0; i < stencil._buffer.length; i++) {
            var element = stencil._buffer[i];
            var vertices = element.verts;
            var firstPoint = vertices[0];
            locContext.beginPath();
            locContext.moveTo(firstPoint.x * locEGL_ScaleX, -firstPoint.y * locEGL_ScaleY);
            for (var j = 1, len = vertices.length; j < len; j++)locContext.lineTo(vertices[j].x * locEGL_ScaleX,
                    -vertices[j].y * locEGL_ScaleY)
        }
    }, addChild: function (widget, zOrder, tag) {
        if (widget instanceof ccui.Widget)this.supplyTheLayoutParameterLackToChild(widget);
        ccui.Widget.prototype.addChild.call(this, widget, zOrder, tag);
        this._doLayoutDirty = true
    }, removeChild: function (widget, cleanup) {
        ccui.Widget.prototype.removeChild.call(this, widget, cleanup);
        this._doLayoutDirty = true
    }, removeAllChildren: function (cleanup) {
        ccui.Widget.prototype.removeAllChildren.call(this, cleanup);
        this._doLayoutDirty = true
    }, removeAllChildrenWithCleanup: function (cleanup) {
        ccui.Widget.prototype.removeAllChildrenWithCleanup(cleanup);
        this._doLayoutDirty = true
    }, isClippingEnabled: function () {
        return this._clippingEnabled
    }, visit: function (ctx) {
        if (!this._visible)return;
        this.adaptRenderers();
        this._doLayout();
        if (this._clippingEnabled)switch (this._clippingType) {
            case ccui.Layout.CLIPPING_STENCIL:
                this.stencilClippingVisit(ctx);
                break;
            case ccui.Layout.CLIPPING_SCISSOR:
                this.scissorClippingVisit(ctx);
                break;
            default:
                break
        } else ccui.Widget.prototype.visit.call(this, ctx)
    }, sortAllChildren: function () {
        ccui.Widget.prototype.sortAllChildren.call(this);
        this._doLayout()
    }, stencilClippingVisit: null, _stencilClippingVisitForWebGL: function (ctx) {
        var gl = ctx || cc._renderContext;
        if (!this._clippingStencil || !this._clippingStencil.isVisible())return;
        ccui.Layout._layer = -1;
        if (ccui.Layout._layer + 1 == cc.stencilBits) {
            ccui.Layout._visit_once = true;
            if (ccui.Layout._visit_once) {
                cc.log("Nesting more than " + cc.stencilBits + "stencils is not supported. Everything will be drawn without stencil for this node and its childs.");
                ccui.Layout._visit_once = false
            }
            cc.Node.prototype.visit.call(this,
                ctx);
            return
        }
        ccui.Layout._layer++;
        var mask_layer = 1 << ccui.Layout._layer;
        var mask_layer_l = mask_layer - 1;
        var mask_layer_le = mask_layer | mask_layer_l;
        var currentStencilEnabled = gl.isEnabled(gl.STENCIL_TEST);
        var currentStencilWriteMask = gl.getParameter(gl.STENCIL_WRITEMASK);
        var currentStencilFunc = gl.getParameter(gl.STENCIL_FUNC);
        var currentStencilRef = gl.getParameter(gl.STENCIL_REF);
        var currentStencilValueMask = gl.getParameter(gl.STENCIL_VALUE_MASK);
        var currentStencilFail = gl.getParameter(gl.STENCIL_FAIL);
        var currentStencilPassDepthFail =
            gl.getParameter(gl.STENCIL_PASS_DEPTH_FAIL);
        var currentStencilPassDepthPass = gl.getParameter(gl.STENCIL_PASS_DEPTH_PASS);
        gl.enable(gl.STENCIL_TEST);
        gl.stencilMask(mask_layer);
        var currentDepthWriteMask = gl.getParameter(gl.DEPTH_WRITEMASK);
        gl.depthMask(false);
        gl.stencilFunc(gl.NEVER, mask_layer, mask_layer);
        gl.stencilOp(gl.ZERO, gl.KEEP, gl.KEEP);
        cc._drawingUtil.drawSolidRect(cc.p(0, 0), cc.pFromSize(cc.director.getWinSize()), cc.color(255, 255, 255, 255));
        gl.stencilFunc(gl.NEVER, mask_layer, mask_layer);
        gl.stencilOp(gl.REPLACE,
            gl.KEEP, gl.KEEP);
        cc.kmGLPushMatrix();
        this.transform();
        this._clippingStencil.visit();
        gl.depthMask(currentDepthWriteMask);
        gl.stencilFunc(gl.EQUAL, mask_layer_le, mask_layer_le);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        var i = 0;
        var j = 0;
        this.sortAllChildren();
        this.sortAllProtectedChildren();
        var locChildren = this._children, locProtectChildren = this._protectedChildren;
        var iLen = locChildren.length, jLen = locProtectChildren.length, child;
        for (; i < iLen; i++) {
            child = locChildren[i];
            if (child && child.getLocalZOrder() < 0)child.visit();
            else break
        }
        for (; j < jLen; j++) {
            child = locProtectChildren[j];
            if (child && child.getLocalZOrder() < 0)child.visit(); else break
        }
        this.draw();
        for (; i < iLen; i++)locChildren[i].visit();
        for (; j < jLen; j++)locProtectChildren[j].visit();
        gl.stencilFunc(currentStencilFunc, currentStencilRef, currentStencilValueMask);
        gl.stencilOp(currentStencilFail, currentStencilPassDepthFail, currentStencilPassDepthPass);
        gl.stencilMask(currentStencilWriteMask);
        if (!currentStencilEnabled)gl.disable(gl.STENCIL_TEST);
        ccui.Layout._layer--;
        cc.kmGLPopMatrix()
    },
    _stencilClippingVisitForCanvas: function (ctx) {
        if (!this._clippingStencil || !this._clippingStencil.isVisible())return;
        var context = ctx || cc._renderContext;
        if (this._cangodhelpme() || this._clippingStencil instanceof cc.Sprite) {
            var canvas = context.canvas;
            var locCache = ccui.Layout._getSharedCache();
            locCache.width = canvas.width;
            locCache.height = canvas.height;
            var locCacheCtx = locCache.getContext("2d");
            locCacheCtx.drawImage(canvas, 0, 0);
            context.save();
            cc.Node.prototype.visit.call(this, context);
            context.globalCompositeOperation =
                "destination-in";
            this.transform(context);
            this._clippingStencil.visit();
            context.restore();
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.globalCompositeOperation = "destination-over";
            context.drawImage(locCache, 0, 0);
            context.restore()
        } else {
            var i, children = this._children, locChild;
            context.save();
            this.transform(context);
            this._clippingStencil.visit(context);
            context.clip();
            this._cangodhelpme(true);
            this.sortAllChildren();
            this.sortAllProtectedChildren();
            var j, locProtectChildren = this._protectedChildren;
            var iLen = children.length, jLen = locProtectChildren.length;
            for (i = 0; i < iLen; i++) {
                locChild = children[i];
                if (locChild && locChild._localZOrder < 0)locChild.visit(context); else break
            }
            for (j = 0; j < jLen; j++) {
                locChild = locProtectChildren[j];
                if (locChild && locChild._localZOrder < 0)locChild.visit(context); else break
            }
            for (; i < iLen; i++)children[i].visit(context);
            for (; j < jLen; j++)locProtectChildren[j].visit(context);
            this._cangodhelpme(false);
            context.restore()
        }
    }, _godhelpme: false, _cangodhelpme: function (godhelpme) {
        if (godhelpme === true ||
            godhelpme === false)cc.ClippingNode.prototype._godhelpme = godhelpme;
        return cc.ClippingNode.prototype._godhelpme
    }, scissorClippingVisit: null, _scissorClippingVisitForWebGL: function (ctx) {
        var clippingRect = this.getClippingRect();
        var gl = ctx || cc._renderContext;
        if (this._handleScissor)gl.enable(gl.SCISSOR_TEST);
        cc.view.setScissorInPoints(clippingRect.x, clippingRect.y, clippingRect.width, clippingRect.height);
        cc.Node.prototype.visit.call(this);
        if (this._handleScissor)gl.disable(gl.SCISSOR_TEST)
    }, setClippingEnabled: function (able) {
        if (able ==
            this._clippingEnabled)return;
        this._clippingEnabled = able;
        switch (this._clippingType) {
            case ccui.Layout.CLIPPING_STENCIL:
                if (able) {
                    this._clippingStencil = cc.DrawNode.create();
                    if (cc._renderType === cc._RENDER_TYPE_CANVAS)this._clippingStencil.draw = this.__stencilDraw.bind(this);
                    if (this._running)this._clippingStencil.onEnter();
                    this.setStencilClippingSize(this._contentSize)
                } else {
                    if (this._running)this._clippingStencil.onExit();
                    this._clippingStencil = null
                }
                break;
            default:
                break
        }
    }, setClippingType: function (type) {
        if (type ==
            this._clippingType)return;
        var clippingEnabled = this.isClippingEnabled();
        this.setClippingEnabled(false);
        this._clippingType = type;
        this.setClippingEnabled(clippingEnabled)
    }, getClippingType: function () {
        return this._clippingType
    }, setStencilClippingSize: function (size) {
        if (this._clippingEnabled && this._clippingType == ccui.Layout.CLIPPING_STENCIL) {
            var rect = [];
            rect[0] = cc.p(0, 0);
            rect[1] = cc.p(size.width, 0);
            rect[2] = cc.p(size.width, size.height);
            rect[3] = cc.p(0, size.height);
            var green = cc.color.GREEN;
            this._clippingStencil.clear();
            this._clippingStencil.drawPoly(rect, 4, green, 0, green)
        }
    }, rendererVisitCallBack: function () {
        this._doLayout()
    }, getClippingRect: function () {
        if (this._clippingRectDirty) {
            var worldPos = this.convertToWorldSpace(cc.p(0, 0));
            var t = this.nodeToWorldTransform();
            var scissorWidth = this._contentSize.width * t.a;
            var scissorHeight = this._contentSize.height * t.d;
            var parentClippingRect;
            var parent = this;
            var firstClippingParentFounded = false;
            while (parent) {
                parent = parent.getParent();
                if (parent && parent instanceof ccui.Layout)if (parent.isClippingEnabled()) {
                    if (!firstClippingParentFounded) {
                        this._clippingParent =
                            parent;
                        firstClippingParentFounded = true
                    }
                    if (parent._clippingType == ccui.Layout.CLIPPING_SCISSOR) {
                        this._handleScissor = false;
                        break
                    }
                }
            }
            if (this._clippingParent) {
                parentClippingRect = this._clippingParent.getClippingRect();
                var finalX = worldPos.x - scissorWidth * this._anchorPoint.x;
                var finalY = worldPos.y - scissorHeight * this._anchorPoint.y;
                var finalWidth = scissorWidth;
                var finalHeight = scissorHeight;
                var leftOffset = worldPos.x - parentClippingRect.x;
                if (leftOffset < 0) {
                    finalX = parentClippingRect.x;
                    finalWidth += leftOffset
                }
                var rightOffset =
                    worldPos.x + scissorWidth - (parentClippingRect.x + parentClippingRect.width);
                if (rightOffset > 0)finalWidth -= rightOffset;
                var topOffset = worldPos.y + scissorHeight - (parentClippingRect.y + parentClippingRect.height);
                if (topOffset > 0)finalHeight -= topOffset;
                var bottomOffset = worldPos.y - parentClippingRect.y;
                if (bottomOffset < 0) {
                    finalY = parentClippingRect.x;
                    finalHeight += bottomOffset
                }
                if (finalWidth < 0)finalWidth = 0;
                if (finalHeight < 0)finalHeight = 0;
                this._clippingRect.x = finalX;
                this._clippingRect.y = finalY;
                this._clippingRect.width =
                    finalWidth;
                this._clippingRect.height = finalHeight
            } else {
                this._clippingRect.x = worldPos.x - scissorWidth * this._anchorPoint.x;
                this._clippingRect.y = worldPos.y - scissorHeight * this._anchorPoint.y;
                this._clippingRect.width = scissorWidth;
                this._clippingRect.height = scissorHeight
            }
            this._clippingRectDirty = false
        }
        return this._clippingRect
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this.setStencilClippingSize(this._contentSize);
        this._doLayoutDirty = true;
        this._clippingRectDirty = true;
        if (this._backGroundImage) {
            this._backGroundImage.setPosition(this._contentSize.width *
                0.5, this._contentSize.height * 0.5);
            if (this._backGroundScale9Enabled)if (this._backGroundImage instanceof cc.Scale9Sprite)this._backGroundImage.setPreferredSize(this._contentSize)
        }
        if (this._colorRender)this._colorRender.setContentSize(this._contentSize);
        if (this._gradientRender)this._gradientRender.setContentSize(this._contentSize)
    }, setBackGroundImageScale9Enabled: function (able) {
        if (this._backGroundScale9Enabled == able)return;
        this.removeProtectedChild(this._backGroundImage);
        this._backGroundImage = null;
        this._backGroundScale9Enabled =
            able;
        this.addBackGroundImage();
        this.setBackGroundImage(this._backGroundImageFileName, this._bgImageTexType);
        this.setBackGroundImageCapInsets(this._backGroundImageCapInsets)
    }, isBackGroundImageScale9Enabled: function () {
        return this._backGroundScale9Enabled
    }, setBackGroundImage: function (fileName, texType) {
        if (!fileName)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        if (this._backGroundImage == null)this.addBackGroundImage();
        this._backGroundImageFileName = fileName;
        this._bgImageTexType = texType;
        if (this._backGroundScale9Enabled) {
            var bgiScale9 =
                this._backGroundImage;
            switch (this._bgImageTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    bgiScale9.initWithFile(fileName);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    bgiScale9.initWithSpriteFrameName(fileName);
                    break;
                default:
                    break
            }
            bgiScale9.setPreferredSize(this._contentSize)
        } else {
            var sprite = this._backGroundImage;
            switch (this._bgImageTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    sprite.setTexture(fileName);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    sprite.setSpriteFrame(fileName);
                    break;
                default:
                    break
            }
        }
        this._backGroundImageTextureSize =
            this._backGroundImage.getContentSize();
        this._backGroundImage.setPosition(this._contentSize.width / 2, this._contentSize.height / 2);
        this._updateBackGroundImageColor()
    }, setBackGroundImageCapInsets: function (capInsets) {
        this._backGroundImageCapInsets = capInsets;
        if (this._backGroundScale9Enabled)this._backGroundImage.setCapInsets(capInsets)
    }, getBackGroundImageCapInsets: function () {
        return this._backGroundImageCapInsets
    }, supplyTheLayoutParameterLackToChild: function (locChild) {
        if (!locChild)return;
        switch (this._layoutType) {
            case ccui.Layout.ABSOLUTE:
                break;
            case ccui.Layout.LINEAR_HORIZONTAL:
            case ccui.Layout.LINEAR_VERTICAL:
                var layoutParameter = locChild.getLayoutParameter(ccui.LayoutParameter.LINEAR);
                if (!layoutParameter)locChild.setLayoutParameter(ccui.LinearLayoutParameter.create());
                break;
            case ccui.Layout.RELATIVE:
                var layoutParameter = locChild.getLayoutParameter(ccui.LayoutParameter.RELATIVE);
                if (!layoutParameter)locChild.setLayoutParameter(ccui.RelativeLayoutParameter.create());
                break;
            default:
                break
        }
    }, addBackGroundImage: function () {
        if (this._backGroundScale9Enabled) {
            this._backGroundImage =
                cc.Scale9Sprite.create();
            this._backGroundImage.setPreferredSize(this._contentSize)
        } else this._backGroundImage = cc.Sprite.create();
        this.addProtectedChild(this._backGroundImage, ccui.Layout.BACKGROUND_IMAGE_ZORDER, -1);
        this._backGroundImage.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
    }, removeBackGroundImage: function () {
        if (!this._backGroundImage)return;
        this.removeProtectedChild(this._backGroundImage);
        this._backGroundImage = null;
        this._backGroundImageFileName = "";
        this._backGroundImageTextureSize =
            cc.size(0, 0)
    }, setBackGroundColorType: function (type) {
        if (this._colorType == type)return;
        switch (this._colorType) {
            case ccui.Layout.BG_COLOR_NONE:
                if (this._colorRender) {
                    this.removeProtectedChild(this._colorRender);
                    this._colorRender = null
                }
                if (this._gradientRender) {
                    this.removeProtectedChild(this._gradientRender);
                    this._gradientRender = null
                }
                break;
            case ccui.Layout.BG_COLOR_SOLID:
                if (this._colorRender) {
                    this.removeProtectedChild(this._colorRender);
                    this._colorRender = null
                }
                break;
            case ccui.Layout.BG_COLOR_GRADIENT:
                if (this._gradientRender) {
                    this.removeProtectedChild(this._gradientRender);
                    this._gradientRender = null
                }
                break;
            default:
                break
        }
        this._colorType = type;
        switch (this._colorType) {
            case ccui.Layout.BG_COLOR_NONE:
                break;
            case ccui.Layout.BG_COLOR_SOLID:
                this._colorRender = cc.LayerColor.create();
                this._colorRender.setContentSize(this._contentSize);
                this._colorRender.setOpacity(this._opacity);
                this._colorRender.setColor(this._color);
                this.addProtectedChild(this._colorRender, ccui.Layout.BACKGROUND_RENDERER_ZORDER, -1);
                break;
            case ccui.Layout.BG_COLOR_GRADIENT:
                this._gradientRender = cc.LayerGradient.create(cc.color(255,
                    0, 0, 255), cc.color(0, 255, 0, 255));
                this._gradientRender.setContentSize(this._contentSize);
                this._gradientRender.setOpacity(this._opacity);
                this._gradientRender.setStartColor(this._startColor);
                this._gradientRender.setEndColor(this._endColor);
                this._gradientRender.setVector(this._alongVector);
                this.addProtectedChild(this._gradientRender, ccui.Layout.BACKGROUND_RENDERER_ZORDER, -1);
                break;
            default:
                break
        }
    }, getBackGroundColorType: function () {
        return this._colorType
    }, setBackGroundColor: function (color, endColor) {
        if (!endColor) {
            this._color.r =
                color.r;
            this._color.g = color.g;
            this._color.b = color.b;
            if (this._colorRender)this._colorRender.setColor(color)
        } else {
            this._startColor.r = color.r;
            this._startColor.g = color.g;
            this._startColor.b = color.b;
            if (this._gradientRender)this._gradientRender.setStartColor(color);
            this._endColor = endColor;
            if (this._gradientRender)this._gradientRender.setEndColor(endColor)
        }
    }, getBackGroundColor: function () {
        var tmpColor = this._color;
        return cc.color(tmpColor.r, tmpColor.g, tmpColor.b, tmpColor.a)
    }, getBackGroundStartColor: function () {
        var tmpColor =
            this._startColor;
        return cc.color(tmpColor.r, tmpColor.g, tmpColor.b, tmpColor.a)
    }, getBackGroundEndColor: function () {
        var tmpColor = this._endColor;
        return cc.color(tmpColor.r, tmpColor.g, tmpColor.b, tmpColor.a)
    }, setBackGroundColorOpacity: function (opacity) {
        this._opacity = opacity;
        switch (this._colorType) {
            case ccui.Layout.BG_COLOR_NONE:
                break;
            case ccui.Layout.BG_COLOR_SOLID:
                this._colorRender.setOpacity(opacity);
                break;
            case ccui.Layout.BG_COLOR_GRADIENT:
                this._gradientRender.setOpacity(opacity);
                break;
            default:
                break
        }
    },
    getBackGroundColorOpacity: function () {
        return this._opacity
    }, setBackGroundColorVector: function (vector) {
        this._alongVector.x = vector.x;
        this._alongVector.y = vector.y;
        if (this._gradientRender)this._gradientRender.setVector(vector)
    }, getBackGroundColorVector: function () {
        return this._alongVector
    }, setBackGroundImageColor: function (color) {
        this._backGroundImageColor.r = color.r;
        this._backGroundImageColor.g = color.g;
        this._backGroundImageColor.b = color.b;
        this._updateBackGroundImageColor()
    }, setBackGroundImageOpacity: function (opacity) {
        this._backGroundImageColor.a =
            opacity;
        this.getBackGroundImageColor()
    }, getBackGroundImageColor: function () {
        var color = this._backGroundImageColor;
        return cc.color(color.r, color.g, color.b, color.a)
    }, getBackGroundImageOpacity: function () {
        return this._backGroundImageColor.a
    }, _updateBackGroundImageColor: function () {
        if (this._backGroundImage)this._backGroundImage.setColor(this._backGroundImageColor)
    }, getBackGroundImageTextureSize: function () {
        return this._backGroundImageTextureSize
    }, setLayoutType: function (type) {
        this._layoutType = type;
        var layoutChildrenArray =
            this._children;
        var locChild = null;
        for (var i = 0; i < layoutChildrenArray.length; i++) {
            locChild = layoutChildrenArray[i];
            if (locChild instanceof ccui.Widget)this.supplyTheLayoutParameterLackToChild(locChild)
        }
        this._doLayoutDirty = true
    }, getLayoutType: function () {
        return this._layoutType
    }, requestDoLayout: function () {
        this._doLayoutDirty = true
    }, _doLayout: function () {
        if (!this._doLayoutDirty)return;
        var executant = this._createLayoutManager();
        if (executant)executant._doLayout(this);
        this._doLayoutDirty = false
    }, _createLayoutManager: function () {
        var layoutMgr =
            null;
        switch (this._layoutType) {
            case ccui.Layout.LINEAR_VERTICAL:
                layoutMgr = ccui.LinearVerticalLayoutManager.create();
                break;
            case ccui.Layout.LINEAR_HORIZONTAL:
                layoutMgr = ccui.LinearHorizontalLayoutManager.create();
                break;
            case ccui.Layout.RELATIVE:
                layoutMgr = ccui.RelativeLayoutManager.create();
                break
        }
        return layoutMgr
    }, _getLayoutContentSize: function () {
        return this.getContentSize()
    }, _getLayoutElements: function () {
        return this.getChildren()
    }, _onBeforeVisitStencil: function () {
    }, _drawFullScreenQuadClearStencil: function () {
    },
    _onAfterDrawStencil: function () {
    }, _onAfterVisitStencil: function () {
    }, _onAfterVisitScissor: function () {
    }, _onAfterVisitScissor: function () {
    }, _updateBackGroundImageOpacity: function () {
        if (this._backGroundImage)this._backGroundImage.setOpacity(this._backGroundImageOpacity)
    }, _updateBackGroundImageRGBA: function () {
        if (this._backGroundImage) {
            this._backGroundImage.setColor(this._backGroundImageColor);
            this._backGroundImage.setOpacity(this._backGroundImageOpacity)
        }
    }, _getLayoutAccumulatedSize: function () {
        var children =
            this.getChildren();
        var layoutSize = cc.size(0, 0);
        var widgetCount = 0, locSize;
        for (var i = 0, len = children.length; i < len; i++) {
            var layout = children[i];
            if (null != layout && layout instanceof ccui.Layout) {
                locSize = layout._getLayoutAccumulatedSize();
                layoutSize.width += locSize.width;
                layoutSize.height += locSize.height
            } else if (layout instanceof ccui.Widget) {
                widgetCount++;
                var m = w.getLayoutParameter().getMargin();
                locSize = w.getContentSize();
                layoutSize.width += locSize.width + (m.right + m.left) * 0.5;
                layoutSize.height += locSize.height +
                    (m.top + m.bottom) * 0.5
            }
        }
        var type = this.getLayoutType();
        if (type == ccui.Layout.LINEAR_HORIZONTAL)layoutSize.height = layoutSize.height - layoutSize.height / widgetCount * (widgetCount - 1);
        if (type == ccui.Layout.LINEAR_VERTICAL)layoutSize.width = layoutSize.width - layoutSize.width / widgetCount * (widgetCount - 1);
        return layoutSize
    }, _findNearestChildWidgetIndex: function (direction, baseWidget) {
        if (baseWidget == null || baseWidget == this)return this._findFirstFocusEnabledWidgetIndex();
        var index = 0, locChildren = this.getChildren();
        var count =
            locChildren.length;
        var widgetPosition;
        var distance = cc.FLT_MAX, found = 0;
        if (direction == ccui.Widget.LEFT || direction == ccui.Widget.RIGHT || direction == ccui.Widget.DOWN || direction == ccui.Widget.UP) {
            widgetPosition = this._getWorldCenterPoint(baseWidget);
            while (index < count) {
                var w = locChildren[index];
                if (w && w instanceof ccui.Widget && w.isFocusEnabled()) {
                    var length = w instanceof ccui.Layout ? w._calculateNearestDistance(baseWidget) : cc.pLength(cc.pSub(this._getWorldCenterPoint(w), widgetPosition));
                    if (length < distance) {
                        found =
                            index;
                        distance = length
                    }
                }
                index++
            }
            return found
        }
        cc.assert(0, "invalid focus direction!");
        return 0
    }, _findFarestChildWidgetIndex: function (direction, baseWidget) {
        if (baseWidget == null || baseWidget == this)return this._findFirstFocusEnabledWidgetIndex();
        var index = 0;
        var count = this.getChildren().size();
        var distance = -cc.FLT_MAX;
        var found = 0;
        if (direction == ccui.Widget.LEFT || direction == ccui.Widget.RIGHT || direction == ccui.Widget.DOWN || direction == ccui.Widget.UP) {
            var widgetPosition = this._getWorldCenterPoint(baseWidget);
            while (index <
                count) {
                if (w && w instanceof ccui.Widget && w.isFocusEnabled()) {
                    var length = w instanceof ccui.Layout ? w._calculateFarestDistance(baseWidget) : cc.pLength(cc.pSub(this._getWorldCenterPoint(w), widgetPosition));
                    if (length > distance) {
                        found = index;
                        distance = length
                    }
                }
                index++
            }
            return found
        }
        cc.assert(0, "invalid focus direction!!!");
        return 0
    }, _calculateNearestDistance: function (baseWidget) {
        var distance = cc.FLT_MAX;
        var widgetPosition = this._getWorldCenterPoint(baseWidget);
        var locChildren = this._children;
        for (var i = 0, len = locChildren.length; i <
            len; i++) {
            var widget = locChildren[i];
            var length;
            if (widget instanceof ccui.Layout)length = widget._calculateNearestDistance(baseWidget); else if (widget instanceof ccui.Widget && widget.isFocusEnabled())length = cc.pLength(cc.pSub(this._getWorldCenterPoint(widget), widgetPosition)); else continue;
            if (length < distance)distance = length
        }
        return distance
    }, _calculateFarestDistance: function (baseWidget) {
        var distance = -cc.FLT_MAX;
        var widgetPosition = this._getWorldCenterPoint(baseWidget);
        var locChildren = this._children;
        for (var i =
            0, len = locChildren.length; i < len; i++) {
            var layout = locChildren[i];
            var length;
            if (layout instanceof ccui.Layout)length = layout._calculateFarestDistance(baseWidget); else if (layout instanceof ccui.Widget && layout.isFocusEnabled()) {
                var wPosition = this._getWorldCenterPoint(w);
                length = cc.pLength(cc.pSub(wPosition, widgetPosition))
            } else continue;
            if (length > distance)distance = length
        }
        return distance
    }, _findProperSearchingFunctor: function (direction, baseWidget) {
        if (baseWidget == null)return;
        var previousWidgetPosition = this._getWorldCenterPoint(baseWidget);
        var widgetPosition = this._getWorldCenterPoint(this._findFirstNonLayoutWidget());
        if (direction == ccui.Widget.LEFT)if (previousWidgetPosition.x > widgetPosition.x)this.onPassFocusToChild = this._findNearestChildWidgetIndex.bind(this); else this.onPassFocusToChild = this._findFarestChildWidgetIndex.bind(this); else if (direction == ccui.Widget.RIGHT)if (previousWidgetPosition.x > widgetPosition.x)this.onPassFocusToChild = this._findFarestChildWidgetIndex.bind(this); else this.onPassFocusToChild = this._findNearestChildWidgetIndex.bind(this);
        else if (direction == ccui.Widget.DOWN)if (previousWidgetPosition.y > widgetPosition.y)this.onPassFocusToChild = this._findNearestChildWidgetIndex.bind(this); else this.onPassFocusToChild = this._findFarestChildWidgetIndex.bind(this); else if (direction == ccui.Widget.UP)if (previousWidgetPosition.y < widgetPosition.y)this.onPassFocusToChild = this._findNearestChildWidgetIndex.bind(this); else this.onPassFocusToChild = this._findFarestChildWidgetIndex.bind(this); else cc.assert(0, "invalid direction!")
    }, _findFirstNonLayoutWidget: function () {
        var locChildren =
            this._children;
        for (var i = 0, len = locChildren.length; i < len; i++) {
            var child = locChildren[i];
            if (child instanceof ccui.Layout) {
                var widget = child._findFirstNonLayoutWidget();
                if (widget)return widget
            } else if (child instanceof cc.Widget)return child
        }
        return null
    }, _findFirstFocusEnabledWidgetIndex: function () {
        var index = 0, locChildren = this.getChildren();
        var count = locChildren.length;
        while (index < count) {
            var w = locChildren[index];
            if (w && w instanceof ccui.Widget && w.isFocusEnabled())return index;
            index++
        }
        return 0
    }, _findFocusEnabledChildWidgetByIndex: function (index) {
        var widget =
            this._getChildWidgetByIndex(index);
        if (widget) {
            if (widget.isFocusEnabled())return widget;
            index = index + 1;
            return this._findFocusEnabledChildWidgetByIndex(index)
        }
        return null
    }, _getWorldCenterPoint: function (widget) {
        var widgetSize = widget instanceof ccui.Layout ? widget._getLayoutAccumulatedSize() : widget.getContentSize();
        return widget.convertToWorldSpace(cc.p(widgetSize.width / 2, widgetSize.height / 2))
    }, _getNextFocusedWidget: function (direction, current) {
        var nextWidget = null, locChildren = this._children;
        var previousWidgetPos =
            locChildren.indexOf(current);
        previousWidgetPos = previousWidgetPos + 1;
        if (previousWidgetPos < locChildren.length) {
            nextWidget = this._getChildWidgetByIndex(previousWidgetPos);
            if (nextWidget)if (nextWidget.isFocusEnabled())if (nextWidget instanceof ccui.Layout) {
                nextWidget._isFocusPassing = true;
                return nextWidget.findNextFocusedWidget(direction, nextWidget)
            } else {
                this.dispatchFocusEvent(current, nextWidget);
                return nextWidget
            } else return this._getNextFocusedWidget(direction, nextWidget); else return current
        } else if (this._loopFocus)if (this._checkFocusEnabledChild()) {
            previousWidgetPos =
                0;
            nextWidget = this._getChildWidgetByIndex(previousWidgetPos);
            if (nextWidget.isFocusEnabled())if (nextWidget instanceof ccui.Layout) {
                nextWidget._isFocusPassing = true;
                return nextWidget.findNextFocusedWidget(direction, nextWidget)
            } else {
                this.dispatchFocusEvent(current, nextWidget);
                return nextWidget
            } else return this._getNextFocusedWidget(direction, nextWidget)
        } else if (current instanceof ccui.Layout)return current; else return this._focusedWidget; else if (this._isLastWidgetInContainer(current, direction)) {
            if (this._isWidgetAncestorSupportLoopFocus(this,
                direction))return this.findNextFocusedWidget(direction, this);
            if (current instanceof ccui.Layout)return current; else return this._focusedWidget
        } else return this.findNextFocusedWidget(direction, this)
    }, _getPreviousFocusedWidget: function (direction, current) {
        var nextWidget = null, locChildren = this._children;
        var previousWidgetPos = locChildren.indexOf(current);
        previousWidgetPos = previousWidgetPos - 1;
        if (previousWidgetPos >= 0) {
            nextWidget = this._getChildWidgetByIndex(previousWidgetPos);
            if (nextWidget.isFocusEnabled()) {
                if (nextWidget instanceof
                    ccui.Layout) {
                    nextWidget._isFocusPassing = true;
                    return nextWidget.findNextFocusedWidget(direction, nextWidget)
                }
                this.dispatchFocusEvent(current, nextWidget);
                return nextWidget
            } else return this._getPreviousFocusedWidget(direction, nextWidget)
        } else if (this._loopFocus)if (this._checkFocusEnabledChild()) {
            previousWidgetPos = locChildren.length - 1;
            nextWidget = this._getChildWidgetByIndex(previousWidgetPos);
            if (nextWidget.isFocusEnabled())if (nextWidget instanceof ccui.Layout) {
                nextWidget._isFocusPassing = true;
                return nextWidget.findNextFocusedWidget(direction,
                    nextWidget)
            } else {
                this.dispatchFocusEvent(current, nextWidget);
                return nextWidget
            } else return this._getPreviousFocusedWidget(direction, nextWidget)
        } else if (current instanceof ccui.Layout)return current; else return this._focusedWidget; else if (this._isLastWidgetInContainer(current, direction)) {
            if (this._isWidgetAncestorSupportLoopFocus(this, direction))return this.findNextFocusedWidget(direction, this);
            if (current instanceof ccui.Layout)return current; else return this._focusedWidget
        } else return this.findNextFocusedWidget(direction,
            this)
    }, _getChildWidgetByIndex: function (index) {
        var locChildren = this._children;
        var size = locChildren.length;
        var count = 0, oldIndex = index;
        while (index < size) {
            var firstChild = locChildren[index];
            if (firstChild && firstChild instanceof ccui.Widget)return firstChild;
            count++;
            index++
        }
        var begin = 0;
        while (begin < oldIndex) {
            var child = locChildren[begin];
            if (child && child instanceof ccui.Widget)return child;
            count++;
            begin++
        }
        return null
    }, _isLastWidgetInContainer: function (widget, direction) {
        var parent = widget.getParent();
        if (parent instanceof
            ccui.Layout)return true;
        var container = parent.getChildren();
        var index = container.indexOf(widget);
        if (parent.getLayoutType() == ccui.Layout.LINEAR_HORIZONTAL) {
            if (direction == ccui.Widget.LEFT)if (index == 0)return true * this._isLastWidgetInContainer(parent, direction); else return false;
            if (direction == ccui.Widget.RIGHT)if (index == container.length - 1)return true * this._isLastWidgetInContainer(parent, direction); else return false;
            if (direction == ccui.Widget.DOWN)return this._isLastWidgetInContainer(parent, direction);
            if (direction ==
                ccui.Widget.UP)return this._isLastWidgetInContainer(parent, direction)
        } else if (parent.getLayoutType() == ccui.Layout.LINEAR_VERTICAL) {
            if (direction == ccui.Widget.UP)if (index == 0)return true * this._isLastWidgetInContainer(parent, direction); else return false;
            if (direction == ccui.Widget.DOWN)if (index == container.length - 1)return true * this._isLastWidgetInContainer(parent, direction); else return false;
            if (direction == ccui.Widget.LEFT)return this._isLastWidgetInContainer(parent, direction);
            if (direction == ccui.Widget.RIGHT)return this._isLastWidgetInContainer(parent,
                direction)
        } else {
            cc.assert(0, "invalid layout Type");
            return false
        }
        return false
    }, _isWidgetAncestorSupportLoopFocus: function (widget, direction) {
        var parent = widget.getParent();
        if (parent == null)return false;
        if (parent.isLoopFocus()) {
            var layoutType = parent.getLayoutType();
            if (layoutType == ccui.Layout.LINEAR_HORIZONTAL)if (direction == ccui.Widget.LEFT || direction == ccui.Widget.RIGHT)return true; else return this._isWidgetAncestorSupportLoopFocus(parent, direction);
            if (layoutType == ccui.Layout.LINEAR_VERTICAL)if (direction ==
                ccui.Widget.DOWN || direction == ccui.Widget.UP)return true; else return this._isWidgetAncestorSupportLoopFocus(parent, direction); else cc.assert(0, "invalid layout type")
        } else return this._isWidgetAncestorSupportLoopFocus(parent, direction)
    }, _passFocusToChild: function (direction, current) {
        if (this._checkFocusEnabledChild()) {
            var previousWidget = this.getCurrentFocusedWidget();
            this._findProperSearchingFunctor(direction, previousWidget);
            var index = this.onPassFocusToChild(direction, previousWidget);
            var widget = this._getChildWidgetByIndex(index);
            if (widget instanceof ccui.Layout) {
                widget._isFocusPassing = true;
                return widget.findNextFocusedWidget(direction, widget)
            } else {
                this.dispatchFocusEvent(current, widget);
                return widget
            }
        } else return this
    }, _checkFocusEnabledChild: function () {
        var locChildren = this._children;
        for (var i = 0, len = locChildren.length; i < len; i++) {
            var widget = locChildren[i];
            if (widget && widget instanceof ccui.Widget && widget.isFocusEnabled())return true
        }
        return false
    }, getDescription: function () {
        return"Layout"
    }, createCloneInstance: function () {
        return ccui.Layout.create()
    },
    copyClonedWidgetChildren: function (model) {
        ccui.Widget.prototype.copyClonedWidgetChildren.call(this, model)
    }, copySpecialProperties: function (layout) {
        this.setBackGroundImageScale9Enabled(layout._backGroundScale9Enabled);
        this.setBackGroundImage(layout._backGroundImageFileName, layout._bgImageTexType);
        this.setBackGroundImageCapInsets(layout._backGroundImageCapInsets);
        this.setBackGroundColorType(layout._colorType);
        this.setBackGroundColor(layout._color);
        this.setBackGroundColor(layout._startColor, layout._endColor);
        this.setBackGroundColorOpacity(layout._opacity);
        this.setBackGroundColorVector(layout._alongVector);
        this.setLayoutType(layout._layoutType);
        this.setClippingEnabled(layout._clippingEnabled);
        this.setClippingType(layout._clippingType);
        this._loopFocus = layout._loopFocus;
        this._passFocusToChild = layout._passFocusToChild
    }});
ccui.Layout._init_once = null;
ccui.Layout._visit_once = null;
ccui.Layout._layer = null;
ccui.Layout._sharedCache = null;
if (cc._renderType == cc._RENDER_TYPE_WEBGL) {
    ccui.Layout.prototype.stencilClippingVisit = ccui.Layout.prototype._stencilClippingVisitForWebGL;
    ccui.Layout.prototype.scissorClippingVisit = ccui.Layout.prototype._scissorClippingVisitForWebGL
} else {
    ccui.Layout.prototype.stencilClippingVisit = ccui.Layout.prototype._stencilClippingVisitForCanvas;
    ccui.Layout.prototype.scissorClippingVisit = ccui.Layout.prototype._stencilClippingVisitForCanvas
}
ccui.Layout._getSharedCache = function () {
    return cc.ClippingNode._sharedCache || (cc.ClippingNode._sharedCache = cc.newElement("canvas"))
};
var _p = ccui.Layout.prototype;
_p.clippingEnabled;
cc.defineGetterSetter(_p, "clippingEnabled", _p.isClippingEnabled, _p.setClippingEnabled);
_p.clippingType;
cc.defineGetterSetter(_p, "clippingType", null, _p.setClippingType);
_p.layoutType;
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
ccui.Margin = ccui.Class.extend({left: 0, top: 0, right: 0, bottom: 0, ctor: function (margin, top, right, bottom) {
    if (margin && top === undefined) {
        this.left = margin.left;
        this.top = margin.top;
        this.right = margin.right;
        this.bottom = margin.bottom
    }
    if (bottom !== undefined) {
        this.left = margin;
        this.top = top;
        this.right = right;
        this.bottom = bottom
    }
}, setMargin: function (l, t, r, b) {
    this.left = l;
    this.top = t;
    this.right = r;
    this.bottom = b
}, equals: function (target) {
    return this.left == target.left && this.top == target.top && this.right == target.right && this.bottom ==
        target.bottom
}});
ccui.MarginZero = function () {
    return new ccui.Margin(0, 0, 0, 0)
};
ccui.LayoutParameter = ccui.Class.extend({_margin: null, _layoutParameterType: null, ctor: function () {
    this._margin = new ccui.Margin;
    this._layoutParameterType = ccui.LayoutParameter.NONE
}, setMargin: function (margin) {
    if (typeof margin === "object") {
        this._margin.left = margin.left;
        this._margin.top = margin.top;
        this._margin.right = margin.right;
        this._margin.bottom = margin.bottom
    } else {
        this._margin.left = arguments[0];
        this._margin.top = arguments[1];
        this._margin.right = arguments[2];
        this._margin.bottom = arguments[3]
    }
}, getMargin: function () {
    return this._margin
},
    getLayoutType: function () {
        return this._layoutParameterType
    }, clone: function () {
        var parameter = this.createCloneInstance();
        parameter.copyProperties(this);
        return parameter
    }, createCloneInstance: function () {
        return ccui.LayoutParameter.create()
    }, copyProperties: function (model) {
        this._margin = model._margin
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
}, setGravity: function (gravity) {
    this._linearGravity = gravity
}, getGravity: function () {
    return this._linearGravity
}, createCloneInstance: function () {
    return ccui.LinearLayoutParameter.create()
}, copyProperties: function (model) {
    ccui.LayoutParameter.prototype.copyProperties.call(this,
        model);
    var parameter = model;
    if (parameter) {
        this.setAlign(parameter._relativeAlign);
        this.setRelativeName(parameter._relativeLayoutName);
        this.setRelativeToWidgetName(parameter._relativeWidgetName);
        this.setGravity(model._linearGravity)
    }
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
ccui.RelativeLayoutParameter = ccui.LayoutParameter.extend({_relativeAlign: null, _relativeWidgetName: "", _relativeLayoutName: "", _put: false, ctor: function () {
    ccui.LayoutParameter.prototype.ctor.call(this);
    this._relativeAlign = ccui.RelativeLayoutParameter.NONE;
    this._relativeWidgetName = "";
    this._relativeLayoutName = "";
    this._put = false;
    this._layoutParameterType = ccui.LayoutParameter.RELATIVE
}, setAlign: function (align) {
    this._relativeAlign = align
}, getAlign: function () {
    return this._relativeAlign
}, setRelativeToWidgetName: function (name) {
    this._relativeWidgetName =
        name
}, getRelativeToWidgetName: function () {
    return this._relativeWidgetName
}, setRelativeName: function (name) {
    this._relativeLayoutName = name
}, getRelativeName: function () {
    return this._relativeLayoutName
}, createCloneInstance: function () {
    return ccui.RelativeLayoutParameter.create()
}, copyProperties: function (model) {
    ccui.LayoutParameter.prototype.copyProperties.call(this, model);
    this.setAlign(model._relativeAlign);
    this.setRelativeToWidgetName(model._relativeWidgetName);
    this.setRelativeName(model._relativeLayoutName)
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
ccui.LayoutManager = ccui.Class.extend({_doLayout: function (layout) {
}});
ccui.LinearVerticalLayoutManager = ccui.LayoutManager.extend({_doLayout: function (layout) {
    var layoutSize = layout._getLayoutContentSize();
    var container = layout._getLayoutElements();
    var topBoundary = layoutSize.height;
    for (var i = 0, len = container.length; i < len; i++) {
        var child = container[i];
        if (child) {
            var layoutParameter = child.getLayoutParameter();
            if (layoutParameter) {
                var childGravity = layoutParameter.getGravity();
                var ap = child.getAnchorPoint();
                var cs = child.getContentSize();
                var finalPosX = ap.x * cs.width;
                var finalPosY =
                    topBoundary - (1 - ap.y) * cs.height;
                switch (childGravity) {
                    case ccui.LinearLayoutParameter.NONE:
                    case ccui.LinearLayoutParameter.LEFT:
                        break;
                    case ccui.LinearLayoutParameter.RIGHT:
                        finalPosX = layoutSize.width - (1 - ap.x) * cs.width;
                        break;
                    case ccui.LinearLayoutParameter.CENTER_HORIZONTAL:
                        finalPosX = layoutSize.width / 2 - cs.width * (0.5 - ap.x);
                        break;
                    default:
                        break
                }
                var mg = layoutParameter.getMargin();
                finalPosX += mg.left;
                finalPosY -= mg.top;
                child.setPosition(finalPosX, finalPosY);
                topBoundary = child.getPositionY() - child.getAnchorPoint().y *
                    child.getContentSize().height - mg.bottom
            }
        }
    }
}});
ccui.LinearVerticalLayoutManager.create = function () {
    return new ccui.LinearVerticalLayoutManager
};
ccui.LinearHorizontalLayoutManager = ccui.LayoutManager.extend({_doLayout: function (layout) {
    var layoutSize = layout._getLayoutContentSize();
    var container = layout._getLayoutElements();
    var leftBoundary = 0;
    for (var i = 0, len = container.length; i < len; i++) {
        var child = container[i];
        if (child) {
            var layoutParameter = child.getLayoutParameter();
            if (layoutParameter) {
                var childGravity = layoutParameter.getGravity();
                var ap = child.getAnchorPoint();
                var cs = child.getSize();
                var finalPosX = leftBoundary + ap.x * cs.width;
                var finalPosY = layoutSize.height -
                    (1 - ap.y) * cs.height;
                switch (childGravity) {
                    case ccui.LinearLayoutParameter.NONE:
                    case ccui.LinearLayoutParameter.TOP:
                        break;
                    case ccui.LinearLayoutParameter.BOTTOM:
                        finalPosY = ap.y * cs.height;
                        break;
                    case ccui.LinearLayoutParameter.CENTER_VERTICAL:
                        finalPosY = layoutSize.height / 2 - cs.height * (0.5 - ap.y);
                        break;
                    default:
                        break
                }
                var mg = layoutParameter.getMargin();
                finalPosX += mg.left;
                finalPosY -= mg.top;
                child.setPosition(finalPosX, finalPosY);
                leftBoundary = child.getRightBoundary() + mg.right
            }
        }
    }
}});
ccui.LinearHorizontalLayoutManager.create = function () {
    return new ccui.LinearHorizontalLayoutManager
};
ccui.RelativeLayoutManager = ccui.LayoutManager.extend({_unlayoutChildCount: null, _widgetChildren: null, _widget: null, _finalPositionX: 0, _finalPositionY: 0, _relativeWidgetLP: null, _doLayout: function (layout) {
    this._widgetChildren = this._getAllWidgets(layout);
    var locChildren = this._widgetChildren;
    while (this._unlayoutChildCount > 0) {
        for (var i = 0, len = locChildren.length; i < len; i++) {
            this._widget = locChildren[i];
            var layoutParameter = this._widget.getLayoutParameter();
            if (layoutParameter) {
                if (layoutParameter._put)continue;
                var ret =
                    this._caculateFinalPositionWithRelativeWidget(layout);
                if (!ret)continue;
                this._caculateFinalPositionWithRelativeAlign();
                this._widget.setPosition(this._finalPositionX, this._finalPositionY);
                layoutParameter._put = true
            }
        }
        this._unlayoutChildCount--
    }
    this._widgetChildren.length = 0
}, _getAllWidgets: function (layout) {
    var container = layout._getLayoutElements();
    var widgetChildren = [];
    for (var i = 0, len = container.length; i < len; i++) {
        var child = container[i];
        if (child) {
            var layoutParameter = child.getLayoutParameter();
            layoutParameter._put =
                false;
            this._unlayoutChildCount++;
            widgetChildren.push(child)
        }
    }
    return widgetChildren
}, _getRelativeWidget: function (widget) {
    var relativeWidget = null;
    var layoutParameter = widget.getLayoutParameter();
    var relativeName = layoutParameter.getRelativeToWidgetName();
    if (relativeName && relativeName.length != 0) {
        var locChildren = this._widgetChildren;
        for (var i = 0, len = locChildren.length; i < len; i++) {
            var child = locChildren[i];
            if (child) {
                var rlayoutParameter = child.getLayoutParameter();
                if (rlayoutParameter && rlayoutParameter.getRelativeName() ==
                    relativeName) {
                    relativeWidget = child;
                    this._relativeWidgetLP = rlayoutParameter;
                    break
                }
            }
        }
    }
    return relativeWidget
}, _caculateFinalPositionWithRelativeWidget: function (layout) {
    var locWidget = this._widget;
    var ap = locWidget.getAnchorPoint();
    var cs = locWidget.getContentSize();
    this._finalPositionX = 0;
    this._finalPositionY = 0;
    var relativeWidget = this._getRelativeWidget(locWidget);
    var layoutParameter = locWidget.getLayoutParameter();
    var align = layoutParameter.getAlign();
    var layoutSize = layout._getLayoutContentSize();
    switch (align) {
        case ccui.RelativeLayoutParameter.NONE:
        case ccui.RelativeLayoutParameter.PARENT_TOP_LEFT:
            this._finalPositionX =
                ap.x * cs.width;
            this._finalPositionY = layoutSize.height - (1 - ap.y) * cs.height;
            break;
        case ccui.RelativeLayoutParameter.PARENT_TOP_CENTER_HORIZONTAL:
            this._finalPositionX = layoutSize.width * 0.5 - cs.width * (0.5 - ap.x);
            this._finalPositionY = layoutSize.height - (1 - ap.y) * cs.height;
            break;
        case ccui.RelativeLayoutParameter.PARENT_TOP_RIGHT:
            this._finalPositionX = layoutSize.width - (1 - ap.x) * cs.width;
            this._finalPositionY = layoutSize.height - (1 - ap.y) * cs.height;
            break;
        case ccui.RelativeLayoutParameter.PARENT_LEFT_CENTER_VERTICAL:
            this._finalPositionX =
                ap.x * cs.width;
            this._finalPositionY = layoutSize.height * 0.5 - cs.height * (0.5 - ap.y);
            break;
        case ccui.RelativeLayoutParameter.CENTER_IN_PARENT:
            this._finalPositionX = layoutSize.width * 0.5 - cs.width * (0.5 - ap.x);
            this._finalPositionY = layoutSize.height * 0.5 - cs.height * (0.5 - ap.y);
            break;
        case ccui.RelativeLayoutParameter.PARENT_RIGHT_CENTER_VERTICAL:
            this._finalPositionX = layoutSize.width - (1 - ap.x) * cs.width;
            this._finalPositionY = layoutSize.height * 0.5 - cs.height * (0.5 - ap.y);
            break;
        case ccui.RelativeLayoutParameter.PARENT_LEFT_BOTTOM:
            this._finalPositionX =
                ap.x * cs.width;
            this._finalPositionY = ap.y * cs.height;
            break;
        case ccui.RelativeLayoutParameter.PARENT_BOTTOM_CENTER_HORIZONTAL:
            this._finalPositionX = layoutSize.width * 0.5 - cs.width * (0.5 - ap.x);
            this._finalPositionY = ap.y * cs.height;
            break;
        case ccui.RelativeLayoutParameter.PARENT_RIGHT_BOTTOM:
            this._finalPositionX = layoutSize.width - (1 - ap.x) * cs.width;
            this._finalPositionY = ap.y * cs.height;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_ABOVE_LEFTALIGN:
            if (relativeWidget) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return false;
                var locationTop = relativeWidget.getTopBoundary();
                var locationLeft = relativeWidget.getLeftBoundary();
                this._finalPositionY = locationTop + ap.y * cs.height;
                this._finalPositionX = locationLeft + ap.x * cs.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_ABOVE_CENTER:
            if (relativeWidget) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return false;
                var rbs = relativeWidget.getContentSize();
                var locationTop = relativeWidget.getTopBoundary();
                this._finalPositionY = locationTop + ap.y * cs.height;
                this._finalPositionX =
                    relativeWidget.getLeftBoundary() + rbs.width * 0.5 + ap.x * cs.width - cs.width * 0.5
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_ABOVE_RIGHTALIGN:
            if (relativeWidget) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return false;
                var locationTop = relativeWidget.getTopBoundary();
                var locationRight = relativeWidget.getRightBoundary();
                this._finalPositionY = locationTop + ap.y * cs.height;
                this._finalPositionX = locationRight - (1 - ap.x) * cs.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_TOPALIGN:
            if (relativeWidget) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return false;
                var locationTop = relativeWidget.getTopBoundary();
                var locationLeft = relativeWidget.getLeftBoundary();
                this._finalPositionY = locationTop - (1 - ap.y) * cs.height;
                this._finalPositionX = locationLeft - (1 - ap.x) * cs.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_CENTER:
            if (relativeWidget) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return false;
                var rbs = relativeWidget.getContentSize();
                var locationLeft = relativeWidget.getLeftBoundary();
                this._finalPositionX =
                    locationLeft - (1 - ap.x) * cs.width;
                this._finalPositionY = relativeWidget.getBottomBoundary() + rbs.height * 0.5 + ap.y * cs.height - cs.height * 0.5
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_BOTTOMALIGN:
            if (relativeWidget) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return false;
                var locationBottom = relativeWidget.getBottomBoundary();
                var locationLeft = relativeWidget.getLeftBoundary();
                this._finalPositionY = locationBottom + ap.y * cs.height;
                this._finalPositionX = locationLeft - (1 - ap.x) * cs.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_TOPALIGN:
            if (relativeWidget) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return false;
                var locationTop = relativeWidget.getTopBoundary();
                var locationRight = relativeWidget.getRightBoundary();
                this._finalPositionY = locationTop - (1 - ap.y) * cs.height;
                this._finalPositionX = locationRight + ap.x * cs.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_CENTER:
            if (relativeWidget) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return false;
                var rbs = relativeWidget.getContentSize();
                var locationRight = relativeWidget.getRightBoundary();
                this._finalPositionX = locationRight + ap.x * cs.width;
                this._finalPositionY = relativeWidget.getBottomBoundary() + rbs.height * 0.5 + ap.y * cs.height - cs.height * 0.5
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_BOTTOMALIGN:
            if (relativeWidget) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return false;
                var locationBottom = relativeWidget.getBottomBoundary();
                var locationRight = relativeWidget.getRightBoundary();
                this._finalPositionY = locationBottom + ap.y * cs.height;
                this._finalPositionX = locationRight + ap.x * cs.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_BELOW_LEFTALIGN:
            if (relativeWidget) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return false;
                var locationBottom = relativeWidget.getBottomBoundary();
                var locationLeft = relativeWidget.getLeftBoundary();
                this._finalPositionY = locationBottom - (1 - ap.y) * cs.height;
                this._finalPositionX = locationLeft + ap.x * cs.width
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_BELOW_CENTER:
            if (relativeWidget) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return false;
                var rbs = relativeWidget.getContentSize();
                var locationBottom = relativeWidget.getBottomBoundary();
                this._finalPositionY = locationBottom - (1 - ap.y) * cs.height;
                this._finalPositionX = relativeWidget.getLeftBoundary() + rbs.width * 0.5 + ap.x * cs.width - cs.width * 0.5
            }
            break;
        case ccui.RelativeLayoutParameter.LOCATION_BELOW_RIGHTALIGN:
            if (relativeWidget) {
                if (this._relativeWidgetLP && !this._relativeWidgetLP._put)return false;
                var locationBottom = relativeWidget.getBottomBoundary();
                var locationRight =
                    relativeWidget.getRightBoundary();
                this._finalPositionY = locationBottom - (1 - ap.y) * cs.height;
                this._finalPositionX = locationRight - (1 - ap.x) * cs.width
            }
            break;
        default:
            break
    }
    return true
}, _caculateFinalPositionWithRelativeAlign: function () {
    var layoutParameter = this._widget.getLayoutParameter();
    var mg = layoutParameter.getMargin();
    var align = layoutParameter.getAlign();
    switch (align) {
        case ccui.RelativeLayoutParameter.NONE:
        case ccui.RelativeLayoutParameter.PARENT_TOP_LEFT:
            this._finalPositionX += mg.left;
            this._finalPositionY -=
                mg.top;
            break;
        case ccui.RelativeLayoutParameter.PARENT_TOP_CENTER_HORIZONTAL:
            this._finalPositionY -= mg.top;
            break;
        case ccui.RelativeLayoutParameter.PARENT_TOP_RIGHT:
            this._finalPositionX -= mg.right;
            this._finalPositionY -= mg.top;
            break;
        case ccui.RelativeLayoutParameter.PARENT_LEFT_CENTER_VERTICAL:
            this._finalPositionX += mg.left;
            break;
        case ccui.RelativeLayoutParameter.CENTER_IN_PARENT:
            break;
        case ccui.RelativeLayoutParameter.PARENT_RIGHT_CENTER_VERTICAL:
            this._finalPositionX -= mg.right;
            break;
        case ccui.RelativeLayoutParameter.PARENT_LEFT_BOTTOM:
            this._finalPositionX +=
                mg.left;
            this._finalPositionY += mg.bottom;
            break;
        case ccui.RelativeLayoutParameter.PARENT_BOTTOM_CENTER_HORIZONTAL:
            this._finalPositionY += mg.bottom;
            break;
        case ccui.RelativeLayoutParameter.PARENT_RIGHT_BOTTOM:
            this._finalPositionX -= mg.right;
            this._finalPositionY += mg.bottom;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_ABOVE_LEFTALIGN:
            this._finalPositionY += mg.bottom;
            this._finalPositionX += mg.left;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_ABOVE_RIGHTALIGN:
            this._finalPositionY += mg.bottom;
            this._finalPositionX -=
                mg.right;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_ABOVE_CENTER:
            this._finalPositionY += mg.bottom;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_TOPALIGN:
            this._finalPositionX -= mg.right;
            this._finalPositionY -= mg.top;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_BOTTOMALIGN:
            this._finalPositionX -= mg.right;
            this._finalPositionY += mg.bottom;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_LEFT_OF_CENTER:
            this._finalPositionX -= mg.right;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_TOPALIGN:
            this._finalPositionX +=
                mg.left;
            this._finalPositionY -= mg.top;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_BOTTOMALIGN:
            this._finalPositionX += mg.left;
            this._finalPositionY += mg.bottom;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_RIGHT_OF_CENTER:
            this._finalPositionX += mg.left;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_BELOW_LEFTALIGN:
            this._finalPositionY -= mg.top;
            this._finalPositionX += mg.left;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_BELOW_RIGHTALIGN:
            this._finalPositionY -= mg.top;
            this._finalPositionX -=
                mg.right;
            break;
        case ccui.RelativeLayoutParameter.LOCATION_BELOW_CENTER:
            this._finalPositionY -= mg.top;
            break;
        default:
            break
    }
}});
ccui.RelativeLayoutManager.create = function () {
    return new ccui.RelativeLayoutManager
};
ccui.HBox = ccui.Layout.extend({init: function () {
    if (ccui.Layout.prototype.init.call(this)) {
        this.setLayoutType(ccui.Layout.LINEAR_HORIZONTAL);
        return true
    }
    return false
}, initWithSize: function (size) {
    if (this.init()) {
        this.setSize(size);
        return true
    }
    return false
}});
ccui.HBox.create = function (size) {
    var widget = new ccui.HBox;
    if (size) {
        if (widget.initWithSize())return widget;
        return null
    }
    return widget
};
ccui.RelativeBox = ccui.Layout.extend({init: function () {
    if (ccui.Layout.prototype.init.call(this)) {
        this.setLayoutType(ccui.Layout.RELATIVE);
        return true
    }
    return false
}, initWithSize: function (size) {
    if (this.init()) {
        this.setSize(size);
        return true
    }
    return false
}});
ccui.RelativeBox.create = function (size) {
    var widget = new ccui.RelativeBox;
    if (size) {
        if (widget.initWithSize())return widget;
        return null
    }
    return widget
};
ccui.VBox = ccui.Layout.extend({init: function () {
    if (ccui.Layout.prototype.init.call(this)) {
        this.setLayoutType(ccui.Layout.VERTICAL);
        return true
    }
    return false
}, initWithSize: function (size) {
    if (this.init()) {
        this.setSize(size);
        return true
    }
    return false
}});
ccui.VBox.create = function (size) {
    var widget = new ccui.VBox;
    if (size) {
        if (widget.initWithSize())return widget;
        return null
    }
    return widget
};
ccui.helper = {seekWidgetByTag: function (root, tag) {
    if (!root)return null;
    if (root.getTag() == tag)return root;
    var arrayRootChildren = root.getChildren();
    var length = arrayRootChildren.length;
    for (var i = 0; i < length; i++) {
        var child = arrayRootChildren[i];
        var res = this.seekWidgetByTag(child, tag);
        if (res != null)return res
    }
    return null
}, seekWidgetByName: function (root, name) {
    if (!root)return null;
    if (root.getName() == name)return root;
    var arrayRootChildren = root.getChildren();
    var length = arrayRootChildren.length;
    for (var i = 0; i < length; i++) {
        var child =
            arrayRootChildren[i];
        var res = this.seekWidgetByName(child, name);
        if (res != null)return res
    }
    return null
}, seekWidgetByRelativeName: function (root, name) {
    if (!root)return null;
    var arrayRootChildren = root.getChildren();
    var length = arrayRootChildren.length;
    for (var i = 0; i < length; i++) {
        var child = arrayRootChildren[i];
        var layoutParameter = child.getLayoutParameter(ccui.LayoutParameter.RELATIVE);
        if (layoutParameter && layoutParameter.getRelativeName() == name)return child
    }
    return null
}, seekActionWidgetByActionTag: function (root, tag) {
    if (!root)return null;
    if (root.getActionTag() == tag)return root;
    var arrayRootChildren = root.getChildren();
    for (var i = 0; i < arrayRootChildren.length; i++) {
        var child = arrayRootChildren[i];
        var res = this.seekActionWidgetByActionTag(child, tag);
        if (res != null)return res
    }
    return null
}};
ccui.Button = ccui.Widget.extend({_buttonNormalRenderer: null, _buttonClickedRenderer: null, _buttonDisableRenderer: null, _titleRenderer: null, _normalFileName: "", _clickedFileName: "", _disabledFileName: "", _prevIgnoreSize: true, _scale9Enabled: false, _capInsetsNormal: null, _capInsetsPressed: null, _capInsetsDisabled: null, _normalTexType: ccui.Widget.LOCAL_TEXTURE, _pressedTexType: ccui.Widget.LOCAL_TEXTURE, _disabledTexType: ccui.Widget.LOCAL_TEXTURE, _normalTextureSize: null, _pressedTextureSize: null, _disabledTextureSize: null,
    pressedActionEnabled: false, _titleColor: null, _normalTextureScaleXInSize: 1, _normalTextureScaleYInSize: 1, _pressedTextureScaleXInSize: 1, _pressedTextureScaleYInSize: 1, _normalTextureLoaded: false, _pressedTextureLoaded: false, _disabledTextureLoaded: false, _cascadeOpacityEnabled: true, _className: "Button", _normalTextureAdaptDirty: true, _pressedTextureAdaptDirty: true, _disabledTextureAdaptDirty: true, _fontName: "Thonburi", _fontSize: 12, _type: 0, ctor: function () {
        this._capInsetsNormal = cc.rect(0, 0, 0, 0);
        this._capInsetsPressed =
            cc.rect(0, 0, 0, 0);
        this._capInsetsDisabled = cc.rect(0, 0, 0, 0);
        var locSize = this._size;
        this._normalTextureSize = cc.size(locSize.width, locSize.height);
        this._pressedTextureSize = cc.size(locSize.width, locSize.height);
        this._disabledTextureSize = cc.size(locSize.width, locSize.height);
        this._titleColor = cc.color.WHITE;
        ccui.Widget.prototype.ctor.call(this)
    }, init: function (normalImage, selectedImage, disableImage, texType) {
        if (ccui.Widget.prototype.init.call(this)) {
            this.setTouchEnabled(true);
            if (normalImage === undefined)return true;
            this.loadTextures(normalImage, selectedImage, disableImage, texType)
        }
        return false
    }, initRenderer: function () {
        this._buttonNormalRenderer = cc.Sprite.create();
        this._buttonClickedRenderer = cc.Sprite.create();
        this._buttonDisableRenderer = cc.Sprite.create();
        this._titleRenderer = cc.LabelTTF.create("");
        this.addProtectedChild(this._buttonNormalRenderer, ccui.Button.NORMAL_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._buttonClickedRenderer, ccui.Button.PRESSED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._buttonDisableRenderer,
            ccui.Button.DISABLED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._titleRenderer, ccui.Button.TITLE_RENDERER_ZORDER, -1)
    }, setScale9Enabled: function (able) {
        if (this._scale9Enabled == able)return;
        this._brightStyle = ccui.Widget.BRIGHT_STYLE_NONE;
        this._scale9Enabled = able;
        this.removeProtectedChild(this._buttonNormalRenderer);
        this.removeProtectedChild(this._buttonClickedRenderer);
        this.removeProtectedChild(this._buttonDisableRenderer);
        if (this._scale9Enabled) {
            this._buttonNormalRenderer = cc.Scale9Sprite.create();
            this._buttonClickedRenderer = cc.Scale9Sprite.create();
            this._buttonDisableRenderer = cc.Scale9Sprite.create()
        } else {
            this._buttonNormalRenderer = cc.Sprite.create();
            this._buttonClickedRenderer = cc.Sprite.create();
            this._buttonDisableRenderer = cc.Sprite.create()
        }
        this.loadTextureNormal(this._normalFileName, this._normalTexType);
        this.loadTexturePressed(this._clickedFileName, this._pressedTexType);
        this.loadTextureDisabled(this._disabledFileName, this._disabledTexType);
        this.addProtectedChild(this._buttonNormalRenderer,
            ccui.Button.NORMAL_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._buttonClickedRenderer, ccui.Button.PRESSED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._buttonDisableRenderer, ccui.Button.DISABLED_RENDERER_ZORDER, -1);
        if (this._scale9Enabled) {
            var ignoreBefore = this._ignoreSize;
            this.ignoreContentAdaptWithSize(false);
            this._prevIgnoreSize = ignoreBefore
        } else this.ignoreContentAdaptWithSize(this._prevIgnoreSize);
        this.setCapInsetsNormalRenderer(this._capInsetsNormal);
        this.setCapInsetsPressedRenderer(this._capInsetsPressed);
        this.setCapInsetsDisabledRenderer(this._capInsetsDisabled);
        this.setBright(this._bright)
    }, isScale9Enabled: function () {
        return this._scale9Enabled
    }, ignoreContentAdaptWithSize: function (ignore) {
        if (!this._scale9Enabled || this._scale9Enabled && !ignore) {
            ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, ignore);
            this._prevIgnoreSize = ignore
        }
    }, getVirtualRendererSize: function () {
        return this._normalTextureSize
    }, loadTextures: function (normal, selected, disabled, texType) {
        this.loadTextureNormal(normal, texType);
        this.loadTexturePressed(selected, texType);
        this.loadTextureDisabled(disabled, texType)
    }, loadTextureNormal: function (normal, texType) {
        if (!normal)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._normalFileName = normal;
        this._normalTexType = texType;
        if (this._scale9Enabled) {
            var normalRendererScale9 = this._buttonNormalRenderer;
            switch (this._normalTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    normalRendererScale9.initWithFile(normal);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    normalRendererScale9.initWithSpriteFrameName(normal);
                    break;
                default:
                    break
            }
            normalRendererScale9.setCapInsets(this._capInsetsNormal)
        } else {
            var normalRenderer = this._buttonNormalRenderer;
            switch (this._normalTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    normalRenderer.setTexture(normal);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    normalRenderer.setSpriteFrame(normal);
                    break;
                default:
                    break
            }
        }
        this._normalTextureSize = this._buttonNormalRenderer.getContentSize();
        this.updateFlippedX();
        this.updateFlippedY();
        this._buttonNormalRenderer.setColor(this.getColor());
        this._buttonNormalRenderer.setOpacity(this.getOpacity());
        this._updateContentSizeWithTextureSize(this._normalTextureSize);
        this._normalTextureLoaded = true;
        this._normalTextureAdaptDirty = true
    }, loadTexturePressed: function (selected, texType) {
        if (!selected)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._clickedFileName = selected;
        this._pressedTexType = texType;
        if (this._scale9Enabled) {
            var clickedRendererScale9 = this._buttonClickedRenderer;
            switch (this._pressedTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    clickedRendererScale9.initWithFile(selected);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    clickedRendererScale9.initWithSpriteFrameName(selected);
                    break;
                default:
                    break
            }
            clickedRendererScale9.setCapInsets(this._capInsetsPressed)
        } else {
            var clickedRenderer = this._buttonClickedRenderer;
            switch (this._pressedTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    clickedRenderer.setTexture(selected);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    clickedRenderer.setSpriteFrame(selected);
                    break;
                default:
                    break
            }
        }
        this._pressedTextureSize = this._buttonClickedRenderer.getContentSize();
        this.updateFlippedX();
        this.updateFlippedY();
        this._buttonDisableRenderer.setColor(this.getColor());
        this._buttonDisableRenderer.setOpacity(this.getOpacity());
        this._pressedTextureLoaded = true;
        this._pressedTextureAdaptDirty = true
    }, loadTextureDisabled: function (disabled, texType) {
        if (!disabled)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._disabledFileName = disabled;
        this._disabledTexType = texType;
        if (this._scale9Enabled) {
            var disabledScale9 = this._buttonDisableRenderer;
            switch (this._disabledTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    disabledScale9.initWithFile(disabled);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    disabledScale9.initWithSpriteFrameName(disabled);
                    break;
                default:
                    break
            }
            disabledScale9.setCapInsets(this._capInsetsDisabled)
        } else {
            var disabledRenderer = this._buttonDisableRenderer;
            switch (this._disabledTexType) {
                case ccui.Widget.LOCAL_TEXTURE:
                    disabledRenderer.setTexture(disabled);
                    break;
                case ccui.Widget.PLIST_TEXTURE:
                    disabledRenderer.setSpriteFrame(disabled);
                    break;
                default:
                    break
            }
        }
        this._disabledTextureSize = this._buttonDisableRenderer.getContentSize();
        this.updateFlippedX();
        this.updateFlippedY();
        this._buttonDisableRenderer.setColor(this.getColor());
        this._buttonDisableRenderer.setOpacity(this.getOpacity());
        this._disabledTextureLoaded = true;
        this._disabledTextureAdaptDirty = true
    }, setCapInsets: function (capInsets) {
        this.setCapInsetsNormalRenderer(capInsets);
        this.setCapInsetsPressedRenderer(capInsets);
        this.setCapInsetsDisabledRenderer(capInsets)
    }, setCapInsetsNormalRenderer: function (capInsets) {
        this._capInsetsNormal = capInsets;
        if (!this._scale9Enabled)return;
        this._buttonNormalRenderer.setCapInsets(capInsets)
    }, getCapInsetsNormalRenderer: function () {
        return this._capInsetsNormal
    }, setCapInsetsPressedRenderer: function (capInsets) {
        this._capInsetsPressed =
            capInsets;
        if (!this._scale9Enabled)return;
        this._buttonClickedRenderer.setCapInsets(capInsets)
    }, getCapInsetsPressedRenderer: function () {
        return this._capInsetsPressed
    }, setCapInsetsDisabledRenderer: function (capInsets) {
        this._capInsetsDisabled = capInsets;
        if (!this._scale9Enabled)return;
        this._buttonDisableRenderer.setCapInsets(capInsets)
    }, getCapInsetsDisabledRenderer: function () {
        return this._capInsetsDisabled
    }, onPressStateChangedToNormal: function () {
        this._buttonNormalRenderer.setVisible(true);
        this._buttonClickedRenderer.setVisible(false);
        this._buttonDisableRenderer.setVisible(false);
        if (this._pressedTextureLoaded) {
            if (this.pressedActionEnabled) {
                this._buttonNormalRenderer.stopAllActions();
                this._buttonClickedRenderer.stopAllActions();
                var zoomAction = cc.ScaleTo.create(0.05, this._normalTextureScaleXInSize, this._normalTextureScaleYInSize);
                this._buttonNormalRenderer.runAction(zoomAction);
                this._buttonClickedRenderer.setScale(this._pressedTextureScaleXInSize, this._pressedTextureScaleYInSize)
            }
        } else if (this._scale9Enabled)this.updateTexturesRGBA();
        else {
            this._buttonNormalRenderer.stopAllActions();
            this._buttonNormalRenderer.setScale(this._normalTextureScaleXInSize, this._normalTextureScaleYInSize)
        }
    }, onPressStateChangedToPressed: function () {
        if (this._pressedTextureLoaded) {
            this._buttonNormalRenderer.setVisible(false);
            this._buttonClickedRenderer.setVisible(true);
            this._buttonDisableRenderer.setVisible(false);
            if (this.pressedActionEnabled) {
                this._buttonNormalRenderer.stopAllActions();
                this._buttonClickedRenderer.stopAllActions();
                var zoomAction = cc.ScaleTo.create(0.05,
                        this._pressedTextureScaleXInSize + 0.1, this._pressedTextureScaleYInSize + 0.1);
                this._buttonClickedRenderer.runAction(zoomAction);
                this._buttonNormalRenderer.setScale(this._pressedTextureScaleXInSize + 0.1, this._pressedTextureScaleYInSize + 0.1)
            }
        } else {
            this._buttonNormalRenderer.setVisible(true);
            this._buttonClickedRenderer.setVisible(true);
            this._buttonDisableRenderer.setVisible(false);
            if (this._scale9Enabled)this._buttonNormalRenderer.setColor(cc.Color.GRAY); else {
                this._buttonNormalRenderer.stopAllActions();
                this._buttonNormalRenderer.setScale(this._normalTextureScaleXInSize +
                    0.1, this._normalTextureScaleYInSize + 0.1)
            }
        }
    }, onPressStateChangedToDisabled: function () {
        this._buttonNormalRenderer.setVisible(false);
        this._buttonClickedRenderer.setVisible(false);
        this._buttonDisableRenderer.setVisible(true);
        this._buttonNormalRenderer.setScale(this._normalTextureScaleXInSize, this._normalTextureScaleYInSize);
        this._buttonClickedRenderer.setScale(this._pressedTextureScaleXInSize, this._pressedTextureScaleYInSize)
    }, setFlippedX: function (flippedX) {
        this._titleRenderer.setFlippedX(flippedX);
        if (this._scale9Enabled)return;
        this._buttonNormalRenderer.setFlippedX(flippedX);
        this._buttonClickedRenderer.setFlippedX(flippedX);
        this._buttonDisableRenderer.setFlippedX(flippedX)
    }, setFlipY: function (flippedY) {
        this._titleRenderer.setFlippedY(flippedY);
        if (this._scale9Enabled)return;
        this._buttonNormalRenderer.setFlippedY(flippedY);
        this._buttonClickedRenderer.setFlippedY(flippedY);
        this._buttonDisableRenderer.setFlippedY(flippedY)
    }, isFlippedX: function () {
        if (this._scale9Enabled)return false;
        return this._buttonNormalRenderer.isFlippedX()
    },
    isFlippedY: function () {
        if (this._scale9Enabled)return false;
        return this._buttonNormalRenderer.isFlippedY()
    }, updateFlippedX: function () {
        var flip = this._flippedX ? -1 : 1;
        this._titleRenderer.setScaleX(flip);
        if (this._scale9Enabled) {
            this._buttonNormalRenderer.setScaleX(flip);
            this._buttonClickedRenderer.setScaleX(flip);
            this._buttonDisableRenderer.setScaleX(flip)
        } else {
            this._buttonNormalRenderer.setFlippedX(this._flippedX);
            this._buttonClickedRenderer.setFlippedX(this._flippedX);
            this._buttonDisableRenderer.setFlippedX(this._flippedX)
        }
    },
    updateFlippedY: function () {
        var flip = this._flippedY ? -1 : 1;
        this._titleRenderer.setScaleY(flip);
        if (this._scale9Enabled) {
            this._buttonNormalRenderer.setScaleY(flip);
            this._buttonClickedRenderer.setScaleY(flip);
            this._buttonDisableRenderer.setScaleY(flip)
        } else {
            this._buttonNormalRenderer.setFlippedY(this._flippedY);
            this._buttonClickedRenderer.setFlippedY(this._flippedY);
            this._buttonDisableRenderer.setFlippedY(this._flippedY)
        }
    }, updateTexturesRGBA: function () {
        this._buttonNormalRenderer.setColor(this.getColor());
        this._buttonClickedRenderer.setColor(this.getColor());
        this._buttonDisableRenderer.setColor(this.getColor());
        this._buttonNormalRenderer.setOpacity(this.getOpacity());
        this._buttonClickedRenderer.setOpacity(this.getOpacity());
        this._buttonDisableRenderer.setOpacity(this.getOpacity())
    }, setAnchorPoint: function (point, y) {
        if (y === undefined) {
            ccui.Widget.prototype.setAnchorPoint.call(this, point);
            this._buttonNormalRenderer.setAnchorPoint(point);
            this._buttonClickedRenderer.setAnchorPoint(point);
            this._buttonDisableRenderer.setAnchorPoint(point)
        } else {
            ccui.Widget.prototype.setAnchorPoint.call(this,
                point, y);
            this._buttonNormalRenderer.setAnchorPoint(point, y);
            this._buttonClickedRenderer.setAnchorPoint(point, y);
            this._buttonDisableRenderer.setAnchorPoint(point, y)
        }
        this._titleRenderer.setPosition(this._size.width * (0.5 - this._anchorPoint.x), this._size.height * (0.5 - this._anchorPoint.y))
    }, _setAnchorX: function (value) {
        ccui.Widget.prototype._setAnchorX.call(this, value);
        this._buttonNormalRenderer._setAnchorX(value);
        this._buttonClickedRenderer._setAnchorX(value);
        this._buttonDisableRenderer._setAnchorX(value);
        this._titleRenderer.setPositionX(this._size.width * (0.5 - this._anchorPoint.x))
    }, _setAnchorY: function (value) {
        ccui.Widget.prototype._setAnchorY.call(this, value);
        this._buttonNormalRenderer._setAnchorY(value);
        this._buttonClickedRenderer._setAnchorY(value);
        this._buttonDisableRenderer._setAnchorY(value);
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
        if (this._ignoreSize) {
            if (!this._scale9Enabled) {
                this._buttonNormalRenderer.setScale(1);
                this._normalTextureScaleXInSize = this._normalTextureScaleYInSize = 1
            }
        } else if (this._scale9Enabled) {
            this._buttonNormalRenderer.setPreferredSize(this._size);
            this._normalTextureScaleXInSize = this._normalTextureScaleYInSize = 1
        } else {
            var textureSize = this._normalTextureSize;
            if (textureSize.width <= 0 || textureSize.height <= 0) {
                this._buttonNormalRenderer.setScale(1);
                return
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._buttonNormalRenderer.setScaleX(scaleX);
            this._buttonNormalRenderer.setScaleY(scaleY);
            this._normalTextureScaleXInSize = scaleX;
            this._normalTextureScaleYInSize = scaleY
        }
        this._buttonNormalRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
    }, pressedTextureScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            if (!this._scale9Enabled) {
                this._buttonClickedRenderer.setScale(1);
                this._pressedTextureScaleXInSize =
                    this._pressedTextureScaleYInSize = 1
            }
        } else if (this._scale9Enabled) {
            this._buttonClickedRenderer.setPreferredSize(this._size);
            this._pressedTextureScaleXInSize = this._pressedTextureScaleYInSize = 1
        } else {
            var textureSize = this._pressedTextureSize;
            if (textureSize.width <= 0 || textureSize.height <= 0) {
                this._buttonClickedRenderer.setScale(1);
                return
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._buttonClickedRenderer.setScaleX(scaleX);
            this._buttonClickedRenderer.setScaleY(scaleY);
            this._pressedTextureScaleXInSize = scaleX;
            this._pressedTextureScaleYInSize = scaleY
        }
        this._buttonClickedRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
    }, disabledTextureScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            if (!this._scale9Enabled)this._buttonDisableRenderer.setScale(1)
        } else if (this._scale9Enabled)this._buttonDisableRenderer.setPreferredSize(this._size); else {
            var textureSize = this._disabledTextureSize;
            if (textureSize.width <= 0 || textureSize.height <= 0) {
                this._buttonDisableRenderer.setScale(1);
                return
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._buttonDisableRenderer.setScaleX(scaleX);
            this._buttonDisableRenderer.setScaleY(scaleY)
        }
        this._buttonDisableRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
    }, adaptRenderers: function () {
        if (this._normalTextureAdaptDirty) {
            this.normalTextureScaleChangedWithSize();
            this._normalTextureAdaptDirty = false
        }
        if (this._pressedTextureAdaptDirty) {
            this.pressedTextureScaleChangedWithSize();
            this._pressedTextureAdaptDirty = false
        }
        if (this._disabledTextureAdaptDirty) {
            this.disabledTextureScaleChangedWithSize();
            this._disabledTextureAdaptDirty = false
        }
    }, updateTitleLocation: function () {
        this._titleRenderer.setPosition(this._contentSize.width * 0.5, this._contentSize.height * 0.5)
    }, setPressedActionEnabled: function (enabled) {
        this.pressedActionEnabled = enabled
    }, setTitleText: function (text) {
        this._titleRenderer.setString(text)
    }, getTitleText: function () {
        return this._titleRenderer.getString()
    }, setTitleColor: function (color) {
        this._titleColor.r =
            color.r;
        this._titleColor.g = color.g;
        this._titleColor.b = color.b;
        this._titleRenderer.updateDisplayedColor(color)
    }, getTitleColor: function () {
        return this._titleRenderer.getColor()
    }, setTitleFontSize: function (size) {
        this._titleRenderer.setFontSize(size)
    }, getTitleFontSize: function () {
        return this._titleRenderer.getFontSize()
    }, setTitleFontName: function (fontName) {
        this._titleRenderer.setFontName(fontName)
    }, getTitleFontName: function () {
        return this._titleRenderer.getFontName()
    }, _setTitleFont: function (font) {
        this._titleRenderer.font =
            font
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
    }, copySpecialProperties: function (uiButton) {
        this._prevIgnoreSize = uiButton._prevIgnoreSize;
        this.setScale9Enabled(uiButton._scale9Enabled);
        this.loadTextureNormal(uiButton._normalFileName,
            uiButton._normalTexType);
        this.loadTexturePressed(uiButton._clickedFileName, uiButton._pressedTexType);
        this.loadTextureDisabled(uiButton._disabledFileName, uiButton._disabledTexType);
        this.setCapInsetsNormalRenderer(uiButton._capInsetsNormal);
        this.setCapInsetsPressedRenderer(uiButton._capInsetsPressed);
        this.setCapInsetsDisabledRenderer(uiButton._capInsetsDisabled);
        this.setTitleText(uiButton.getTitleText());
        this.setTitleFontName(uiButton.getTitleFontName());
        this.setTitleFontSize(uiButton.getTitleFontSize());
        this.setTitleColor(uiButton.getTitleColor());
        this.setPressedActionEnabled(uiButton.pressedActionEnabled)
    }});
var _p = ccui.Button.prototype;
_p.titleText;
cc.defineGetterSetter(_p, "titleText", _p.getTitleText, _p.setTitleText);
_p.titleFont;
cc.defineGetterSetter(_p, "titleFont", _p._getTitleFont, _p._setTitleFont);
_p.titleFontSize;
cc.defineGetterSetter(_p, "titleFontSize", _p.getTitleFontSize, _p.setTitleFontSize);
_p.titleFontName;
cc.defineGetterSetter(_p, "titleFontName", _p.getTitleFontName, _p.setTitleFontName);
_p.titleColor;
cc.defineGetterSetter(_p, "titleColor", _p.getTitleColor, _p.setTitleColor);
_p = null;
ccui.Button.create = function (normalImage, selectedImage, disableImage, texType) {
    var btn = new ccui.Button;
    if (normalImage === undefined)return btn;
    btn.init(normalImage, selectedImage, disableImage, texType)
};
ccui.Button.NORMAL_RENDERER_ZORDER = -2;
ccui.Button.PRESSED_RENDERER_ZORDER = -2;
ccui.Button.DISABLED_RENDERER_ZORDER = -2;
ccui.Button.TITLE_RENDERER_ZORDER = -1;
ccui.Button.SYSTEM = 0;
ccui.Button.TTF = 1;
ccui.CheckBox = ccui.Widget.extend({_backGroundBoxRenderer: null, _backGroundSelectedBoxRenderer: null, _frontCrossRenderer: null, _backGroundBoxDisabledRenderer: null, _frontCrossDisabledRenderer: null, _isSelected: true, _checkBoxEventListener: null, _checkBoxEventSelector: null, _checkBoxEventCallback: null, _backGroundTexType: ccui.Widget.LOCAL_TEXTURE, _backGroundSelectedTexType: ccui.Widget.LOCAL_TEXTURE, _frontCrossTexType: ccui.Widget.LOCAL_TEXTURE, _backGroundDisabledTexType: ccui.Widget.LOCAL_TEXTURE, _frontCrossDisabledTexType: ccui.Widget.LOCAL_TEXTURE,
    _backGroundFileName: "", _backGroundSelectedFileName: "", _frontCrossFileName: "", _backGroundDisabledFileName: "", _frontCrossDisabledFileName: "", _className: "CheckBox", _backGroundBoxRendererAdaptDirty: true, _backGroundSelectedBoxRendererAdaptDirty: true, _frontCrossRendererAdaptDirty: true, _backGroundBoxDisabledRendererAdaptDirty: true, _frontCrossDisabledRendererAdaptDirty: true, ctor: function () {
        ccui.Widget.prototype.ctor.call(this)
    }, init: function (backGround, backGroundSeleted, cross, backGroundDisabled, frontCrossDisabled, texType) {
        if (ccui.Widget.prototype.init.call(this)) {
            this._isSelected = true;
            this.setTouchEnabled(true);
            if (backGround === undefined)this.loadTextures(backGround, backGroundSeleted, cross, backGroundDisabled, frontCrossDisabled, texType);
            return true
        }
        return false
    }, initRenderer: function () {
        this._backGroundBoxRenderer = cc.Sprite.create();
        this._backGroundSelectedBoxRenderer = cc.Sprite.create();
        this._frontCrossRenderer = cc.Sprite.create();
        this._backGroundBoxDisabledRenderer = cc.Sprite.create();
        this._frontCrossDisabledRenderer =
            cc.Sprite.create();
        this.addProtectedChild(this._backGroundBoxRenderer, ccui.CheckBox.BOX_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._backGroundSelectedBoxRenderer, ccui.CheckBox.BOX_SELECTED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._frontCrossRenderer, ccui.CheckBox.FRONT_CROSS_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._backGroundBoxDisabledRenderer, ccui.CheckBox.BOX_DISABLED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._frontCrossDisabledRenderer, ccui.CheckBox.FRONT_CROSS_DISABLED_RENDERER_ZORDER,
            -1);
        window.test = [this._backGroundBoxRenderer, this._backGroundSelectedBoxRenderer, this._frontCrossRenderer, this._backGroundBoxDisabledRenderer, this._frontCrossDisabledRenderer];
        window.a = this
    }, loadTextures: function (backGround, backGroundSelected, cross, backGroundDisabled, frontCrossDisabled, texType) {
        this.loadTextureBackGround(backGround, texType);
        this.loadTextureBackGroundSelected(backGroundSelected, texType);
        this.loadTextureFrontCross(cross, texType);
        this.loadTextureBackGroundDisabled(backGroundDisabled,
            texType);
        this.loadTextureFrontCrossDisabled(frontCrossDisabled, texType)
    }, loadTextureBackGround: function (backGround, texType) {
        if (!backGround)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._backGroundFileName = backGround;
        this._backGroundTexType = texType;
        var bgBoxRenderer = this._backGroundBoxRenderer;
        switch (this._backGroundTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                bgBoxRenderer.setTexture(backGround);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                bgBoxRenderer.setSpriteFrame(backGround);
                break;
            default:
                break
        }
        this.backGroundTextureScaleChangedWithSize();
        if (!bgBoxRenderer.textureLoaded()) {
            this._backGroundBoxRenderer.setContentSize(this._customSize);
            bgBoxRenderer.addLoadedEventListener(function () {
                this.backGroundTextureScaleChangedWithSize()
            }, this)
        }
        this.updateFlippedX();
        this.updateFlippedY();
        this._backGroundBoxRenderer.setColor(this.getColor());
        this._backGroundBoxRenderer.setOpacity(this.getOpacity());
        this._updateContentSizeWithTextureSize(this._backGroundBoxRenderer.getContentSize());
        this._backGroundBoxRendererAdaptDirty = true
    }, loadTextureBackGroundSelected: function (backGroundSelected, texType) {
        if (!backGroundSelected)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._backGroundSelectedFileName = backGroundSelected;
        this._backGroundSelectedTexType = texType;
        switch (this._backGroundSelectedTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._backGroundSelectedBoxRenderer.setTexture(backGroundSelected);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._backGroundSelectedBoxRenderer.setSpriteFrame(backGroundSelected);
                break;
            default:
                break
        }
        this.updateFlippedX();
        this.updateFlippedY();
        this._backGroundSelectedBoxRenderer.setColor(this.getColor());
        this._backGroundSelectedBoxRenderer.setOpacity(this.getOpacity());
        this._backGroundSelectedBoxRendererAdaptDirty = true
    }, loadTextureFrontCross: function (cross, texType) {
        if (!cross)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._frontCrossFileName = cross;
        this._frontCrossTexType = texType;
        switch (this._frontCrossTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._frontCrossRenderer.setTexture(cross);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._frontCrossRenderer.setSpriteFrame(cross);
                break;
            default:
                break
        }
        this.updateFlippedX();
        this.updateFlippedY();
        this._frontCrossRenderer.setColor(this.getColor());
        this._frontCrossRenderer.setOpacity(this.getOpacity());
        this._frontCrossRendererAdaptDirty = true
    }, loadTextureBackGroundDisabled: function (backGroundDisabled, texType) {
        if (!backGroundDisabled)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._backGroundDisabledFileName = backGroundDisabled;
        this._backGroundDisabledTexType = texType;
        switch (this._backGroundDisabledTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._backGroundBoxDisabledRenderer.setTexture(backGroundDisabled);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._backGroundBoxDisabledRenderer.setSpriteFrame(backGroundDisabled);
                break;
            default:
                break
        }
        this.updateFlippedX();
        this.updateFlippedY();
        this._backGroundBoxDisabledRenderer.setColor(this.getColor());
        this._backGroundBoxDisabledRenderer.setOpacity(this.getOpacity());
        this._backGroundBoxDisabledRendererAdaptDirty = true
    }, loadTextureFrontCrossDisabled: function (frontCrossDisabled, texType) {
        if (!frontCrossDisabled)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._frontCrossDisabledFileName =
            frontCrossDisabled;
        this._frontCrossDisabledTexType = texType;
        switch (this._frontCrossDisabledTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._frontCrossDisabledRenderer.setTexture(frontCrossDisabled);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._frontCrossDisabledRenderer.setSpriteFrame(frontCrossDisabled);
                break;
            default:
                break
        }
        this.updateFlippedX();
        this.updateFlippedY();
        this._frontCrossDisabledRenderer.setColor(this.getColor());
        this._frontCrossDisabledRenderer.setOpacity(this.getOpacity());
        this._frontCrossDisabledRendererAdaptDirty =
            true
    }, onPressStateChangedToNormal: function () {
        this._backGroundBoxRenderer.setVisible(true);
        this._backGroundSelectedBoxRenderer.setVisible(false);
        this._backGroundBoxDisabledRenderer.setVisible(false);
        this._frontCrossDisabledRenderer.setVisible(false)
    }, onPressStateChangedToPressed: function () {
        this._backGroundBoxRenderer.setVisible(false);
        this._backGroundSelectedBoxRenderer.setVisible(true);
        this._backGroundBoxDisabledRenderer.setVisible(false);
        this._frontCrossDisabledRenderer.setVisible(false)
    }, onPressStateChangedToDisabled: function () {
        this._backGroundBoxRenderer.setVisible(false);
        this._backGroundSelectedBoxRenderer.setVisible(false);
        this._backGroundBoxDisabledRenderer.setVisible(true);
        this._frontCrossRenderer.setVisible(false);
        if (this._isSelected)this._frontCrossDisabledRenderer.setVisible(true)
    }, setSelectedState: function (selected) {
        if (selected == this._isSelected)return;
        this._isSelected = selected;
        this._frontCrossRenderer.setVisible(this._isSelected)
    }, getSelectedState: function () {
        return this._isSelected
    }, selectedEvent: function () {
        if (this._checkBoxEventCallback)this._checkBoxEventCallback(this,
            ccui.CheckBox.EVENT_SELECTED);
        if (this._checkBoxEventListener && this._checkBoxEventSelector)this._checkBoxEventSelector.call(this._checkBoxEventListener, this, ccui.CheckBox.EVENT_SELECTED)
    }, unSelectedEvent: function () {
        if (this._checkBoxEventCallback)this._checkBoxEventCallback(this, ccui.CheckBox.EVENT_UNSELECTED);
        if (this._checkBoxEventListener && this._checkBoxEventSelector)this._checkBoxEventSelector.call(this._checkBoxEventListener, this, ccui.CheckBox.EVENT_UNSELECTED)
    }, releaseUpEvent: function () {
        ccui.Widget.prototype.releaseUpEvent.call(this);
        if (this._isSelected) {
            this.setSelectedState(false);
            this.unSelectedEvent()
        } else {
            this.setSelectedState(true);
            this.selectedEvent()
        }
    }, addEventListenerCheckBox: function (selector, target) {
        this._checkBoxEventSelector = selector;
        this._checkBoxEventListener = target
    }, addEventListener: function (callback) {
        this._checkBoxEventCallback = callback
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
    },
    setAnchorPoint: function (point, y) {
        if (y === undefined) {
            ccui.Widget.prototype.setAnchorPoint.call(this, point);
            this._backGroundBoxRenderer.setAnchorPoint(point);
            this._backGroundSelectedBoxRenderer.setAnchorPoint(point);
            this._backGroundBoxDisabledRenderer.setAnchorPoint(point);
            this._frontCrossRenderer.setAnchorPoint(point);
            this._frontCrossDisabledRenderer.setAnchorPoint(point)
        } else {
            ccui.Widget.prototype.setAnchorPoint.call(this, point, y);
            this._backGroundBoxRenderer.setAnchorPoint(point, y);
            this._backGroundSelectedBoxRenderer.setAnchorPoint(point,
                y);
            this._backGroundBoxDisabledRenderer.setAnchorPoint(point, y);
            this._frontCrossRenderer.setAnchorPoint(point, y);
            this._frontCrossDisabledRenderer.setAnchorPoint(point, y)
        }
    }, _setAnchorX: function (value) {
        ccui.Widget.prototype._setAnchorX.call(this, value);
        this._backGroundBoxRenderer._setAnchorX(value);
        this._backGroundSelectedBoxRenderer._setAnchorX(value);
        this._backGroundBoxDisabledRenderer._setAnchorX(value);
        this._frontCrossRenderer._setAnchorX(value);
        this._frontCrossDisabledRenderer._setAnchorX(value)
    },
    _setAnchorY: function (value) {
        ccui.Widget.prototype._setAnchorY.call(this, value);
        this._backGroundBoxRenderer._setAnchorY(value);
        this._backGroundSelectedBoxRenderer._setAnchorY(value);
        this._backGroundBoxDisabledRenderer._setAnchorY(value);
        this._frontCrossRenderer._setAnchorY(value);
        this._frontCrossDisabledRenderer._setAnchorY(value)
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this._backGroundBoxRendererAdaptDirty = true;
        this._backGroundSelectedBoxRendererAdaptDirty = true;
        this._frontCrossRendererAdaptDirty =
            true;
        this._backGroundBoxDisabledRendererAdaptDirty = true;
        this._frontCrossDisabledRendererAdaptDirty = true
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
            var textureSize =
                this._backGroundBoxRenderer.getContentSize();
            if (textureSize.width <= 0 || textureSize.height <= 0) {
                this._backGroundBoxRenderer.setScale(1);
                return
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._backGroundBoxRenderer.setScaleX(scaleX);
            this._backGroundBoxRenderer.setScaleY(scaleY)
        }
        var x = this._contentSize.width / 2;
        var y = this._contentSize.height / 2;
        this._backGroundBoxRenderer.setPosition(x, y);
        this._backGroundSelectedBoxRenderer.setPosition(x, y);
        this._frontCrossRenderer.setPosition(x,
            y);
        this._backGroundBoxDisabledRenderer.setPosition(x, y);
        this._frontCrossDisabledRenderer.setPosition(x, y)
    }, backGroundSelectedTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._backGroundSelectedBoxRenderer.setScale(1); else {
            var textureSize = this._backGroundSelectedBoxRenderer.getContentSize();
            if (textureSize.width <= 0 || textureSize.height <= 0) {
                this._backGroundSelectedBoxRenderer.setScale(1);
                return
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._backGroundSelectedBoxRenderer.setScaleX(scaleX);
            this._backGroundSelectedBoxRenderer.setScaleY(scaleY)
        }
    }, frontCrossTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._frontCrossRenderer.setScale(1); else {
            var textureSize = this._frontCrossRenderer.getContentSize();
            if (textureSize.width <= 0 || textureSize.height <= 0) {
                this._frontCrossRenderer.setScale(1);
                return
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._frontCrossRenderer.setScaleX(scaleX);
            this._frontCrossRenderer.setScaleY(scaleY)
        }
    }, backGroundDisabledTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._backGroundBoxDisabledRenderer.setScale(1); else {
            var textureSize = this._backGroundBoxDisabledRenderer.getContentSize();
            if (textureSize.width <= 0 || textureSize.height <= 0) {
                this._backGroundBoxDisabledRenderer.setScale(1);
                return
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._backGroundBoxDisabledRenderer.setScaleX(scaleX);
            this._backGroundBoxDisabledRenderer.setScaleY(scaleY)
        }
    },
    frontCrossDisabledTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)this._frontCrossDisabledRenderer.setScale(1); else {
            var textureSize = this._frontCrossDisabledRenderer.getContentSize();
            if (textureSize.width <= 0 || textureSize.height <= 0) {
                this._frontCrossDisabledRenderer.setScale(1);
                return
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._frontCrossDisabledRenderer.setScaleX(scaleX);
            this._frontCrossDisabledRenderer.setScaleY(scaleY)
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
    }, copySpecialProperties: function (uiCheckBox) {
        if (uiCheckBox instanceof ccui.CheckBox) {
            this.loadTextureBackGround(uiCheckBox._backGroundFileName, uiCheckBox._backGroundTexType);
            this.loadTextureBackGroundSelected(uiCheckBox._backGroundSelectedFileName, uiCheckBox._backGroundSelectedTexType);
            this.loadTextureFrontCross(uiCheckBox._frontCrossFileName,
                uiCheckBox._frontCrossTexType);
            this.loadTextureBackGroundDisabled(uiCheckBox._backGroundDisabledFileName, uiCheckBox._backGroundDisabledTexType);
            this.loadTextureFrontCrossDisabled(uiCheckBox._frontCrossDisabledFileName, uiCheckBox._frontCrossDisabledTexType);
            this.setSelectedState(uiCheckBox._isSelected);
            this._checkBoxEventListener = uiCheckBox._checkBoxEventListener;
            this._checkBoxEventSelector = uiCheckBox._checkBoxEventSelector;
            this._checkBoxEventCallback = uiCheckBox._checkBoxEventCallback
        }
    }, adaptRenderers: function () {
        if (this._backGroundBoxRendererAdaptDirty) {
            this.backGroundTextureScaleChangedWithSize();
            this._backGroundBoxRendererAdaptDirty = false
        }
        if (this._backGroundSelectedBoxRendererAdaptDirty) {
            this.backGroundSelectedTextureScaleChangedWithSize();
            this._backGroundSelectedBoxRendererAdaptDirty = false
        }
        if (this._frontCrossRendererAdaptDirty) {
            this.frontCrossTextureScaleChangedWithSize();
            this._frontCrossRendererAdaptDirty = false
        }
        if (this._backGroundBoxDisabledRendererAdaptDirty) {
            this.backGroundDisabledTextureScaleChangedWithSize();
            this._backGroundBoxDisabledRendererAdaptDirty = false
        }
        if (this._frontCrossDisabledRendererAdaptDirty) {
            this.frontCrossDisabledTextureScaleChangedWithSize();
            this._frontCrossDisabledRendererAdaptDirty = false
        }
    }});
var _p = ccui.CheckBox.prototype;
_p.selected;
cc.defineGetterSetter(_p, "selected", _p.getSelectedState, _p.setSelectedState);
_p = null;
ccui.CheckBox.create = function (backGround, backGroundSeleted, cross, backGroundDisabled, frontCrossDisabled, texType) {
    var widget = new ccui.CheckBox;
    if (backGround === undefined)widget.init(); else widget.init(backGround, backGroundSeleted, cross, backGroundDisabled, frontCrossDisabled, texType);
    return widget
};
ccui.CheckBox.EVENT_SELECTED = 0;
ccui.CheckBox.EVENT_UNSELECTED = 1;
ccui.CheckBox.BOX_RENDERER_ZORDER = -1;
ccui.CheckBox.BOX_SELECTED_RENDERER_ZORDER = -1;
ccui.CheckBox.BOX_DISABLED_RENDERER_ZORDER = -1;
ccui.CheckBox.FRONT_CROSS_RENDERER_ZORDER = -1;
ccui.CheckBox.FRONT_CROSS_DISABLED_RENDERER_ZORDER = -1;
ccui.ImageView = ccui.Widget.extend({_scale9Enabled: false, _prevIgnoreSize: true, _capInsets: null, _imageRenderer: null, _textureFile: "", _imageTexType: ccui.Widget.LOCAL_TEXTURE, _imageTextureSize: null, _className: "ImageView", _imageRendererAdaptDirty: true, ctor: function () {
    this._capInsets = cc.rect(0, 0, 0, 0);
    this._imageTextureSize = cc.size(this._size.width, this._size.height);
    ccui.Widget.prototype.ctor.call(this)
}, init: function (imageFileName, texType) {
    ccui.Widget.prototype.init.call(this);
    if (imageFileName !== undefined)this.loadTexture(imageFileName,
        texType);
    return true
}, initRenderer: function () {
    this._imageRenderer = cc.Sprite.create();
    this.addProtectedChild(this._imageRenderer, ccui.ImageView.RENDERER_ZORDER, -1)
}, loadTexture: function (fileName, texType) {
    if (!fileName)return;
    texType = texType || ccui.Widget.LOCAL_TEXTURE;
    this._textureFile = fileName;
    this._imageTexType = texType;
    var imageRenderer = this._imageRenderer;
    switch (this._imageTexType) {
        case ccui.Widget.LOCAL_TEXTURE:
            if (this._scale9Enabled) {
                imageRenderer.initWithFile(fileName);
                imageRenderer.setCapInsets(this._capInsets)
            } else imageRenderer.setTexture(fileName);
            break;
        case ccui.Widget.PLIST_TEXTURE:
            if (this._scale9Enabled) {
                imageRenderer.initWithSpriteFrameName(fileName);
                imageRenderer.setCapInsets(this._capInsets)
            } else imageRenderer.setSpriteFrame(fileName);
            break;
        default:
            break
    }
    this._imageTextureSize = imageRenderer.getContentSize();
    this.updateFlippedX();
    this.updateFlippedY();
    imageRenderer.setColor(this.getColor());
    imageRenderer.setOpacity(this.getOpacity());
    this._updateContentSizeWithTextureSize(this._imageTextureSize);
    this._imageRendererAdaptDirty = true
}, setTextureRect: function (rect) {
    if (!this._scale9Enabled)this._imageRenderer.setTextureRect(rect)
},
    updateFlippedX: function () {
        if (this._scale9Enabled)this._imageRenderer.setScaleX(this._flippedX ? -1 : 1); else this._imageRenderer.setFlippedX(this._flippedX)
    }, updateFlippedY: function () {
        if (this._scale9Enabled)this._imageRenderer.setScaleY(this._flippedY ? -1 : 1); else this._imageRenderer.setFlippedY(this._flippedY)
    }, adaptRenderers: function () {
        if (this._imageRendererAdaptDirty) {
            this.imageTextureScaleChangedWithSize();
            this._imageRendererAdaptDirty = false
        }
    }, setScale9Enabled: function (able) {
        if (this._scale9Enabled ==
            able)return;
        this._scale9Enabled = able;
        this.removeProtectedChild(this._imageRenderer);
        this._imageRenderer = null;
        if (this._scale9Enabled)this._imageRenderer = cc.Scale9Sprite.create(); else this._imageRenderer = cc.Sprite.create();
        this.loadTexture(this._textureFile, this._imageTexType);
        this.addProtectedChild(this._imageRenderer, ccui.ImageView.RENDERER_ZORDER, -1);
        if (this._scale9Enabled) {
            var ignoreBefore = this._ignoreSize;
            this.ignoreContentAdaptWithSize(false);
            this._prevIgnoreSize = ignoreBefore
        } else this.ignoreContentAdaptWithSize(this._prevIgnoreSize);
        this.setCapInsets(this._capInsets)
    }, isScale9Enabled: function () {
        return this._scale9Enabled
    }, ignoreContentAdaptWithSize: function (ignore) {
        if (!this._scale9Enabled || this._scale9Enabled && !ignore) {
            ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, ignore);
            this._prevIgnoreSize = ignore
        }
    }, setCapInsets: function (capInsets) {
        this._capInsets = capInsets;
        if (!this._scale9Enabled)return;
        this._imageRenderer.setCapInsets(capInsets)
    }, getCapInsets: function () {
        return this._capInsets
    }, setAnchorPoint: function (point, y) {
        if (y ===
            undefined) {
            ccui.Widget.prototype.setAnchorPoint.call(this, point);
            this._imageRenderer.setAnchorPoint(point)
        } else {
            ccui.Widget.prototype.setAnchorPoint.call(this, point, y);
            this._imageRenderer.setAnchorPoint(point, y)
        }
    }, _setAnchorX: function (value) {
        ccui.Widget.prototype._setAnchorX.call(this, value);
        this._imageRenderer._setAnchorX(value)
    }, _setAnchorY: function (value) {
        ccui.Widget.prototype._setAnchorY.call(this, value);
        this._imageRenderer._setAnchorY(value)
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this._imageRendererAdaptDirty = true
    }, getContentSize: function () {
        return this._imageTextureSize
    }, _getWidth: function () {
        return this._imageTextureSize.width
    }, _getHeight: function () {
        return this._imageTextureSize.height
    }, getVirtualRenderer: function () {
        return this._imageRenderer
    }, imageTextureScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            if (!this._scale9Enabled)this._imageRenderer.setScale(1)
        } else if (this._scale9Enabled)this._imageRenderer.setPreferredSize(this._size); else {
            var textureSize = this._imageRenderer.getContentSize();
            if (textureSize.width <= 0 || textureSize.height <= 0) {
                this._imageRenderer.setScale(1);
                return
            }
            this._imageRenderer.setScaleX(this._size.width / textureSize.width);
            this._imageRenderer.setScaleY(this._size.height / textureSize.height)
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
    }, copySpecialProperties: function (imageView) {
        if (imageView instanceof ccui.ImageView) {
            this._prevIgnoreSize = imageView._prevIgnoreSize;
            this.setScale9Enabled(imageView._scale9Enabled);
            this.loadTexture(imageView._textureFile, imageView._imageTexType);
            this.setCapInsets(imageView._capInsets)
        }
    }});
ccui.ImageView.create = function (imageFileName, texType) {
    var imageView = new ccui.ImageView;
    if (imageFileName !== undefined)imageView.init(imageFileName, texType);
    return imageView
};
ccui.ImageView.RENDERER_ZORDER = -1;
ccui.LoadingBar = ccui.Widget.extend({_direction: null, _percent: 100, _totalLength: 0, _barRenderer: null, _renderBarTexType: ccui.Widget.LOCAL_TEXTURE, _barRendererTextureSize: null, _scale9Enabled: false, _prevIgnoreSize: true, _capInsets: null, _textureFile: "", _isTextureLoaded: false, _className: "LoadingBar", _barRendererAdaptDirty: true, ctor: function () {
    this._direction = ccui.LoadingBar.TYPE_LEFT;
    this._barRendererTextureSize = cc.size(0, 0);
    this._capInsets = cc.rect(0, 0, 0, 0);
    ccui.Widget.prototype.ctor.call(this)
}, initRenderer: function () {
    this._barRenderer =
        cc.Sprite.create();
    cc.Node.prototype.addChild.call(this, this._barRenderer, ccui.LoadingBar.RENDERER_ZORDER, -1);
    this._barRenderer.setAnchorPoint(0, 0.5)
}, setDirection: function (dir) {
    if (this._direction == dir)return;
    this._direction = dir;
    switch (this._direction) {
        case ccui.LoadingBar.TYPE_LEFT:
            this._barRenderer.setAnchorPoint(0, 0.5);
            this._barRenderer.setPosition(-this._totalLength * 0.5, 0);
            if (!this._scale9Enabled)this._barRenderer.setFlippedX(false);
            break;
        case ccui.LoadingBar.TYPE_RIGHT:
            this._barRenderer.setAnchorPoint(1,
                0.5);
            this._barRenderer.setPosition(this._totalLength * 0.5, 0);
            if (!this._scale9Enabled)this._barRenderer.setFlippedX(true);
            break
    }
}, getDirection: function () {
    return this._direction
}, loadTexture: function (texture, texType) {
    if (!texture)return;
    texType = texType || ccui.Widget.LOCAL_TEXTURE;
    this._renderBarTexType = texType;
    this._textureFile = texture;
    var barRenderer = this._barRenderer;
    switch (this._renderBarTexType) {
        case ccui.Widget.LOCAL_TEXTURE:
            if (this._scale9Enabled) {
                barRenderer.initWithFile(texture);
                barRenderer.setCapInsets(this._capInsets)
            } else barRenderer.setTexture(texture);
            break;
        case ccui.Widget.PLIST_TEXTURE:
            if (this._scale9Enabled) {
                barRenderer.initWithSpriteFrameName(texture);
                barRenderer.setCapInsets(this._capInsets)
            } else barRenderer.setSpriteFrame(texture);
            break;
        default:
            break
    }
    barRenderer.setColor(this.getColor());
    barRenderer.setOpacity(this.getOpacity());
    var bz = barRenderer.getContentSize();
    this._barRendererTextureSize.width = bz.width;
    this._barRendererTextureSize.height = bz.height;
    switch (this._direction) {
        case ccui.LoadingBar.TYPE_LEFT:
            barRenderer.setAnchorPoint(0, 0.5);
            if (!this._scale9Enabled)barRenderer.setFlippedX(false);
            break;
        case ccui.LoadingBar.TYPE_RIGHT:
            barRenderer.setAnchorPoint(1, 0.5);
            if (!this._scale9Enabled)barRenderer.setFlippedX(true);
            break
    }
    this.barRendererScaleChangedWithSize();
    this._updateContentSizeWithTextureSize(this._barRendererTextureSize);
    this._barRendererAdaptDirty = true
}, setScale9Enabled: function (enabled) {
    if (this._scale9Enabled == enabled)return;
    this._scale9Enabled = enabled;
    this.removeProtectedChild(this._barRenderer);
    this._barRenderer = this._scale9Enabled ?
        cc.Scale9Sprite.create() : cc.Sprite.create();
    this.loadTexture(this._textureFile, this._renderBarTexType);
    this.addProtectedChild(this._barRenderer, ccui.LoadingBar.RENDERER_ZORDER, -1);
    if (this._scale9Enabled) {
        var ignoreBefore = this._ignoreSize;
        this.ignoreContentAdaptWithSize(false);
        this._prevIgnoreSize = ignoreBefore
    } else this.ignoreContentAdaptWithSize(this._prevIgnoreSize);
    this.setCapInsets(this._capInsets);
    this.setPercent(this._percent)
}, isScale9Enabled: function () {
    return this._scale9Enabled
}, setCapInsets: function (capInsets) {
    this._capInsets =
        capInsets;
    if (this._scale9Enabled)this._barRenderer.setCapInsets(capInsets)
}, getCapInsets: function () {
    return this._capInsets
}, setPercent: function (percent) {
    if (percent < 0 || percent > 100)return;
    if (this._totalLength <= 0)return;
    this._percent = percent;
    var res = this._percent / 100;
    if (this._scale9Enabled)this.setScale9Scale(); else {
        var spriteRenderer = this._barRenderer;
        var rect = spriteRenderer.getTextureRect();
        this._barRenderer.setTextureRect(cc.rect(rect.x, rect.y, this._barRendererTextureSize.width * res, this._barRendererTextureSize.height))
    }
},
    getPercent: function () {
        return this._percent
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this._barRendererAdaptDirty = true
    }, ignoreContentAdaptWithSize: function (ignore) {
        if (!this._scale9Enabled || this._scale9Enabled && !ignore) {
            ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, ignore);
            this._prevIgnoreSize = ignore
        }
    }, getVirtualRendererSize: function () {
        return this._barRendererTextureSize
    }, getContentSize: function () {
        return this._barRendererTextureSize
    }, _getWidth: function () {
        return this._barRendererTextureSize.width
    },
    _getHeight: function () {
        return this._barRendererTextureSize.height
    }, getVirtualRenderer: function () {
        return this._barRenderer
    }, barRendererScaleChangedWithSize: function () {
        var locBarRender = this._barRenderer;
        if (this._ignoreSize) {
            if (!this._scale9Enabled) {
                this._totalLength = this._barRendererTextureSize.width;
                locBarRender.setScale(1)
            }
        } else {
            this._totalLength = this._size.width;
            if (this._scale9Enabled)this.setScale9Scale(); else {
                var textureSize = this._barRendererTextureSize;
                if (textureSize.width <= 0 || textureSize.height <=
                    0) {
                    locBarRender.setScale(1);
                    return
                }
                var scaleX = this._size.width / textureSize.width;
                var scaleY = this._size.height / textureSize.height;
                locBarRender.setScaleX(scaleX);
                locBarRender.setScaleY(scaleY)
            }
        }
        switch (this._direction) {
            case ccui.LoadingBar.TYPE_LEFT:
                locBarRender.setPosition(0, this._contentSize.height * 0.5);
                break;
            case ccui.LoadingBar.TYPE_RIGHT:
                locBarRender.setPosition(this._totalLength, this._contentSize.height * 0.5);
                break;
            default:
                break
        }
    }, adaptRenderers: function () {
        if (this._barRendererAdaptDirty) {
            this.barRendererScaleChangedWithSize();
            this._barRendererAdaptDirty = false
        }
    }, setScale9Scale: function () {
        var width = this._percent / 100 * this._totalLength;
        this._barRenderer.setPreferredSize(cc.size(width, this._size.height))
    }, updateTextureColor: function () {
        this.updateColorToRenderer(this._barRenderer)
    }, updateTextureOpacity: function () {
        this.updateOpacityToRenderer(this._barRenderer)
    }, getDescription: function () {
        return"LoadingBar"
    }, createCloneInstance: function () {
        return ccui.LoadingBar.create()
    }, copySpecialProperties: function (loadingBar) {
        if (loadingBar instanceof
            ccui.LoadingBar) {
            this._prevIgnoreSize = loadingBar._prevIgnoreSize;
            this.setScale9Enabled(loadingBar._scale9Enabled);
            this.loadTexture(loadingBar._textureFile, loadingBar._renderBarTexType);
            this.setCapInsets(loadingBar._capInsets);
            this.setPercent(loadingBar._percent);
            this.setDirection(loadingBar._direction)
        }
    }});
var _p = ccui.LoadingBar.prototype;
_p.direction;
cc.defineGetterSetter(_p, "direction", _p.getDirection, _p.setDirection);
_p.percent;
cc.defineGetterSetter(_p, "percent", _p.getPercent, _p.setPercent);
_p = null;
ccui.LoadingBar.create = function (textureName, percentage) {
    var loadingBar = new ccui.LoadingBar;
    if (textureName !== undefined)loadingBar.loadTexture(textureName);
    if (percentage !== undefined)loadingBar.setPercent(percentage);
    return loadingBar
};
ccui.LoadingBar.TYPE_LEFT = 0;
ccui.LoadingBar.TYPE_RIGHT = 1;
ccui.LoadingBar.RENDERER_ZORDER = -1;
ccui.Slider = ccui.Widget.extend({_barRenderer: null, _progressBarRenderer: null, _progressBarTextureSize: null, _slidBallNormalRenderer: null, _slidBallPressedRenderer: null, _slidBallDisabledRenderer: null, _slidBallRenderer: null, _barLength: 0, _percent: 0, _scale9Enabled: false, _prevIgnoreSize: true, _textureFile: "", _progressBarTextureFile: "", _slidBallNormalTextureFile: "", _slidBallPressedTextureFile: "", _slidBallDisabledTextureFile: "", _capInsetsBarRenderer: null, _capInsetsProgressBarRenderer: null, _sliderEventListener: null,
    _sliderEventSelector: null, _barTexType: ccui.Widget.LOCAL_TEXTURE, _progressBarTexType: ccui.Widget.LOCAL_TEXTURE, _ballNTexType: ccui.Widget.LOCAL_TEXTURE, _ballPTexType: ccui.Widget.LOCAL_TEXTURE, _ballDTexType: ccui.Widget.LOCAL_TEXTURE, _isTextureLoaded: false, _className: "Slider", _barRendererAdaptDirty: true, _progressBarRendererDirty: true, ctor: function () {
        this._progressBarTextureSize = cc.size(0, 0);
        this._capInsetsBarRenderer = cc.rect(0, 0, 0, 0);
        this._capInsetsProgressBarRenderer = cc.rect(0, 0, 0, 0);
        ccui.Widget.prototype.ctor.call(this)
    },
    init: function () {
        if (ccui.Widget.prototype.init.call(this))return true;
        return false
    }, initRenderer: function () {
        this._barRenderer = cc.Sprite.create();
        this._progressBarRenderer = cc.Sprite.create();
        this._progressBarRenderer.setAnchorPoint(0, 0.5);
        this.addProtectedChild(this._barRenderer, ccui.Slider.BASEBAR_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._progressBarRenderer, ccui.Slider.PROGRESSBAR_RENDERER_ZORDER, -1);
        this._slidBallNormalRenderer = cc.Sprite.create();
        this._slidBallPressedRenderer = cc.Sprite.create();
        this._slidBallPressedRenderer.setVisible(false);
        this._slidBallDisabledRenderer = cc.Sprite.create();
        this._slidBallDisabledRenderer.setVisible(false);
        this._slidBallRenderer = cc.Node.create();
        this._slidBallRenderer.addChild(this._slidBallNormalRenderer);
        this._slidBallRenderer.addChild(this._slidBallPressedRenderer);
        this._slidBallRenderer.addChild(this._slidBallDisabledRenderer);
        this.addProtectedChild(this._slidBallRenderer, ccui.Slider.BALL_RENDERER_ZORDER, -1)
    }, loadBarTexture: function (fileName, texType) {
        if (!fileName)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._textureFile = fileName;
        this._barTexType = texType;
        var barRenderer = this._barRenderer;
        switch (this._barTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                if (this._scale9Enabled)barRenderer.initWithFile(fileName); else barRenderer.setTexture(fileName);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                if (this._scale9Enabled)barRenderer.initWithSpriteFrameName(fileName); else barRenderer.setSpriteFrame(fileName);
                break;
            default:
                break
        }
        barRenderer.setColor(this.getColor());
        barRenderer.setOpacity(this.getOpacity());
        this._barRendererAdaptDirty = true;
        this._progressBarRendererDirty = true;
        this._updateContentSizeWithTextureSize(this._barRenderer.getContentSize())
    }, loadProgressBarTexture: function (fileName, texType) {
        if (!fileName)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._progressBarTextureFile = fileName;
        this._progressBarTexType = texType;
        var progressBarRenderer = this._progressBarRenderer;
        switch (this._progressBarTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                if (this._scale9Enabled)progressBarRenderer.initWithFile(fileName);
                else progressBarRenderer.setTexture(fileName);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                if (this._scale9Enabled)progressBarRenderer.initWithSpriteFrameName(fileName); else progressBarRenderer.setSpriteFrame(fileName);
                break;
            default:
                break
        }
        this._progressBarRenderer.setColor(this.getColor());
        this._progressBarRenderer.setOpacity(this.getOpacity());
        this._progressBarRenderer.setAnchorPoint(cc.p(0, 0.5));
        var tz = this._progressBarRenderer.getContentSize();
        this._progressBarTextureSize = {width: tz.width, height: tz.height};
        this._progressBarRendererDirty = true
    }, setScale9Enabled: function (able) {
        if (this._scale9Enabled == able)return;
        this._scale9Enabled = able;
        this.removeProtectedChild(this._barRenderer, true);
        this.removeProtectedChild(this._progressBarRenderer, true);
        this._barRenderer = null;
        this._progressBarRenderer = null;
        if (this._scale9Enabled) {
            this._barRenderer = cc.Scale9Sprite.create();
            this._progressBarRenderer = cc.Scale9Sprite.create()
        } else {
            this._barRenderer = cc.Sprite.create();
            this._progressBarRenderer = cc.Sprite.create()
        }
        this.loadBarTexture(this._textureFile,
            this._barTexType);
        this.loadProgressBarTexture(this._progressBarTextureFile, this._progressBarTexType);
        this.addProtectedChild(this._barRenderer, ccui.Slider.BASEBAR_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._progressBarRenderer, ccui.Slider.PROGRESSBAR_RENDERER_ZORDER, -1);
        if (this._scale9Enabled) {
            var ignoreBefore = this._ignoreSize;
            this.ignoreContentAdaptWithSize(false);
            this._prevIgnoreSize = ignoreBefore
        } else this.ignoreContentAdaptWithSize(this._prevIgnoreSize);
        this.setCapInsetsBarRenderer(this._capInsetsBarRenderer);
        this.setCapInsetProgressBarRenderer(this._capInsetsProgressBarRenderer)
    }, isScale9Enabled: function () {
        return this._scale9Enabled
    }, ignoreContentAdaptWithSize: function (ignore) {
        if (!this._scale9Enabled || this._scale9Enabled && !ignore) {
            ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, ignore);
            this._prevIgnoreSize = ignore
        }
    }, setCapInsets: function (capInsets) {
        this.setCapInsetsBarRenderer(capInsets);
        this.setCapInsetProgressBarRenderer(capInsets)
    }, setCapInsetsBarRenderer: function (capInsets) {
        this._capInsetsBarRenderer =
            capInsets;
        if (!this._scale9Enabled)return;
        this._barRenderer.setCapInsets(capInsets)
    }, getCapInsetsBarRenderer: function () {
        return this._capInsetsBarRenderer
    }, setCapInsetProgressBarRenderer: function (capInsets) {
        this._capInsetsProgressBarRenderer = capInsets;
        if (!this._scale9Enabled)return;
        this._progressBarRenderer.setCapInsets(capInsets)
    }, getCapInsetsProgressBarRebderer: function () {
        return this._capInsetsProgressBarRenderer
    }, loadSlidBallTextures: function (normal, pressed, disabled, texType) {
        this.loadSlidBallTextureNormal(normal,
            texType);
        this.loadSlidBallTexturePressed(pressed, texType);
        this.loadSlidBallTextureDisabled(disabled, texType)
    }, loadSlidBallTextureNormal: function (normal, texType) {
        if (!normal)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._slidBallNormalTextureFile = normal;
        this._ballNTexType = texType;
        switch (this._ballNTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._slidBallNormalRenderer.setTexture(normal);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._slidBallNormalRenderer.setSpriteFrame(normal);
                break;
            default:
                break
        }
        this._slidBallNormalRenderer.setColor(this.getColor());
        this._slidBallNormalRenderer.setOpacity(this.getOpacity())
    }, loadSlidBallTexturePressed: function (pressed, texType) {
        if (!pressed)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._slidBallPressedTextureFile = pressed;
        this._ballPTexType = texType;
        switch (this._ballPTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._slidBallPressedRenderer.setTexture(pressed);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._slidBallPressedRenderer.setSpriteFrame(pressed);
                break;
            default:
                break
        }
        this._slidBallPressedRenderer.setColor(this.getColor());
        this._slidBallPressedRenderer.setOpacity(this.getOpacity())
    }, loadSlidBallTextureDisabled: function (disabled, texType) {
        if (!disabled)return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._slidBallDisabledTextureFile = disabled;
        this._ballDTexType = texType;
        switch (this._ballDTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._slidBallDisabledRenderer.setTexture(disabled);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._slidBallDisabledRenderer.setSpriteFrame(disabled);
                break;
            default:
                break
        }
        this._slidBallDisabledRenderer.setColor(this.getColor());
        this._slidBallDisabledRenderer.setOpacity(this.getOpacity())
    }, setPercent: function (percent) {
        if (percent > 100)percent = 100;
        if (percent < 0)percent = 0;
        this._percent = percent;
        var res = percent / 100;
        var dis = this._barLength * res;
        this._slidBallRenderer.setPosition(cc.p(dis, this._contentSize.height / 2));
        if (this._scale9Enabled)this._progressBarRenderer.setPreferredSize(cc.size(dis, this._progressBarTextureSize.height)); else {
            var spriteRenderer = this._progressBarRenderer;
            var rect = spriteRenderer.getTextureRect();
            spriteRenderer.setTextureRect(cc.rect(rect.x,
                rect.y, dis, rect.height), spriteRenderer.isTextureRectRotated())
        }
    }, hitTest: function (pt) {
        var nsp = this._slidBallNormalRenderer.convertToNodeSpace(pt);
        var ballSize = this._slidBallNormalRenderer.getContentSize();
        var ballRect = cc.rect(0, 0, ballSize.width, ballSize.height);
        return cc.rectContainsPoint(ballRect, nsp)
    }, onTouchBegan: function (touch, event) {
        var pass = ccui.Widget.prototype.onTouchBegan.call(this, touch, event);
        if (this._hitted) {
            var nsp = this.convertToNodeSpace(this._touchBeganPosition);
            this.setPercent(this.getPercentWithBallPos(nsp.x));
            this.percentChangedEvent()
        }
        return pass
    }, onTouchMoved: function (touch, event) {
        var touchPoint = touch.getLocation();
        var nsp = this.convertToNodeSpace(touchPoint);
        this.setPercent(this.getPercentWithBallPos(nsp.x));
        this.percentChangedEvent()
    }, onTouchEnded: function (touch, event) {
        ccui.Widget.prototype.onTouchEnded.call(this, touch, event)
    }, onTouchCancelled: function (touch, event) {
        ccui.Widget.prototype.onTouchCancelled.call(this, touch, event)
    }, getPercentWithBallPos: function (px) {
        return px / this._barLength * 100
    }, addEventListenerSlider: function (selector, target) {
        this._sliderEventSelector = selector;
        this._sliderEventListener = target
    }, addEventListener: function (callback) {
        this._eventCallback = callback
    }, percentChangedEvent: function () {
        if (this._sliderEventListener && this._sliderEventSelector)this._sliderEventSelector.call(this._sliderEventListener, this, ccui.Slider.EVENT_PERCENT_CHANGED);
        if (this._eventCallback)this._eventCallback(ccui.Slider.EVENT_PERCENT_CHANGED)
    }, getPercent: function () {
        return this._percent
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this._barRendererAdaptDirty = true;
        this._progressBarRendererDirty = true
    }, adaptRenderers: function () {
        if (this._barRendererAdaptDirty) {
            this.barRendererScaleChangedWithSize();
            this._barRendererAdaptDirty = false
        }
        if (this._progressBarRendererDirty) {
            this.progressBarRendererScaleChangedWithSize();
            this._progressBarRendererDirty = false
        }
    }, getVirtualRendererSize: function () {
        return this._barRenderer.getContentSize()
    }, getVirtualRenderer: function () {
        return this._barRenderer
    }, barRendererScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            this._barRenderer.setScale(1);
            this._barLength = this._contentSize.width
        } else {
            this._barLength = this._contentSize.width;
            if (this._scale9Enabled)this._barRenderer.setPreferredSize(this._contentSize); else {
                var btextureSize = this._barRenderer.getContentSize();
                if (btextureSize.width <= 0 || btextureSize.height <= 0) {
                    this._barRenderer.setScale(1);
                    return
                }
                var bscaleX = this._contentSize.width / btextureSize.width;
                var bscaleY = this._contentSize.height / btextureSize.height;
                this._barRenderer.setScaleX(bscaleX);
                this._barRenderer.setScaleY(bscaleY)
            }
        }
        this._barRenderer.setPosition(this._contentSize.width /
            2, this._contentSize.height / 2);
        this.setPercent(this._percent)
    }, progressBarRendererScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            if (!this._scale9Enabled) {
                var ptextureSize = this._progressBarTextureSize;
                var pscaleX = this._contentSize.width / ptextureSize.width;
                var pscaleY = this._contentSize.height / ptextureSize.height;
                this._progressBarRenderer.setScaleX(pscaleX);
                this._progressBarRenderer.setScaleY(pscaleY)
            }
        } else if (this._scale9Enabled) {
            this._progressBarRenderer.setPreferredSize(this._contentSize);
            this._progressBarTextureSize =
                this._progressBarRenderer.getContentSize()
        } else {
            var ptextureSize = this._progressBarTextureSize;
            if (ptextureSize.width <= 0 || ptextureSize.height <= 0) {
                this._progressBarRenderer.setScale(1);
                return
            }
            var pscaleX = this._contentSize.width / ptextureSize.width;
            var pscaleY = this._contentSize.height / ptextureSize.height;
            this._progressBarRenderer.setScaleX(pscaleX);
            this._progressBarRenderer.setScaleY(pscaleY)
        }
        this._progressBarRenderer.setPosition(0, this._contentSize.height / 2);
        this.setPercent(this._percent)
    }, getContentSize: function () {
        var locContentSize =
            this._barRenderer.getContentSize();
        return cc.size(locContentSize.width, locContentSize.height)
    }, _getWidth: function () {
        return this._barRenderer._getWidth()
    }, _getHeight: function () {
        return this._barRenderer._getHeight()
    }, onPressStateChangedToNormal: function () {
        this._slidBallNormalRenderer.setVisible(true);
        this._slidBallPressedRenderer.setVisible(false);
        this._slidBallDisabledRenderer.setVisible(false)
    }, onPressStateChangedToPressed: function () {
        this._slidBallNormalRenderer.setVisible(false);
        this._slidBallPressedRenderer.setVisible(true);
        this._slidBallDisabledRenderer.setVisible(false)
    }, onPressStateChangedToDisabled: function () {
        this._slidBallNormalRenderer.setVisible(false);
        this._slidBallPressedRenderer.setVisible(false);
        this._slidBallDisabledRenderer.setVisible(true)
    }, getDescription: function () {
        return"Slider"
    }, createCloneInstance: function () {
        return ccui.Slider.create()
    }, copySpecialProperties: function (slider) {
        this._prevIgnoreSize = slider._prevIgnoreSize;
        this.setScale9Enabled(slider._scale9Enabled);
        this.loadBarTexture(slider._textureFile,
            slider._barTexType);
        this.loadProgressBarTexture(slider._progressBarTextureFile, slider._progressBarTexType);
        this.loadSlidBallTextureNormal(slider._slidBallNormalTextureFile, slider._ballNTexType);
        this.loadSlidBallTexturePressed(slider._slidBallPressedTextureFile, slider._ballPTexType);
        this.loadSlidBallTextureDisabled(slider._slidBallDisabledTextureFile, slider._ballDTexType);
        this.setPercent(slider.getPercent());
        this._sliderEventListener = slider._sliderEventListener;
        this._sliderEventSelector = slider._sliderEventSelector;
        this._eventCallback = slider._eventCallback
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
var _p = ccui.Slider.prototype;
_p.percent;
cc.defineGetterSetter(_p, "percent", _p.getPercent, _p.setPercent);
_p = null;
ccui.Slider.create = function () {
    var widget = new ccui.Slider;
    if (widget && widget.init())return widget;
    return null
};
ccui.Slider.EVENT_PERCENT_CHANGED = 0;
ccui.Slider.BASEBAR_RENDERER_ZORDER = -3;
ccui.Slider.PROGRESSBAR_RENDERER_ZORDER = -2;
ccui.Slider.BALL_RENDERER_ZORDER = -1;
ccui.Text = ccui.Widget.extend({_touchScaleChangeEnabled: false, _normalScaleValueX: 1, _normalScaleValueY: 1, _fontName: "Thonburi", _fontSize: 10, _onSelectedScaleOffset: 0.5, _labelRenderer: "", _textAreaSize: null, _textVerticalAlignment: 0, _textHorizontalAlignment: 0, _className: "Text", _type: null, _labelRendererAdaptDirty: true, ctor: function () {
    this._type = ccui.Text.Type.SYSTEM;
    this._textAreaSize = cc.size(0, 0);
    ccui.Widget.prototype.ctor.call(this)
}, init: function (textContent, fontName, fontSize) {
    if (ccui.Widget.prototype.init.call(this)) {
        if (arguments.length >
            0) {
            this.setString(textContent);
            this.setFontName(fontName);
            this.setFontSize(fontSize)
        }
        return true
    }
    return false
}, initRenderer: function () {
    this._labelRenderer = cc.LabelTTF.create();
    cc.Node.prototype.addChild.call(this, this._labelRenderer, ccui.Text.RENDERER_ZORDER, -1)
}, setText: function (text) {
    cc.log("Please use the setString");
    this.setString(text)
}, setString: function (text) {
    this._labelRenderer.setString(text);
    this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
    this._labelRendererAdaptDirty =
        true
}, getStringValue: function () {
    cc.log("Please use the getString");
    return this._labelRenderer.getString()
}, getString: function () {
    return this._labelRenderer.getString()
}, getStringLength: function () {
    return this._labelRenderer.getStringLength()
}, setFontSize: function (size) {
    this._fontSize = size;
    this._labelRenderer.setFontSize(size);
    this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
    this._labelRendererAdaptDirty = true
}, getFontSize: function () {
    return this._fontSize
}, setFontName: function (name) {
    this._fontName =
        name;
    this._labelRenderer.setFontName(name);
    this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
    this._labelRendererAdaptDirty = true
}, setTextAreaSize: function (size) {
    this._labelRenderer.setDimensions(size);
    this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
    this._labelRendererAdaptDirty = true
}, getTextAreaSize: function () {
    return this._labelRenderer.getDimensions()
}, setTextHorizontalAlignment: function (alignment) {
    this._labelRenderer.setHorizontalAlignment(alignment);
    this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
    this._labelRendererAdaptDirty = true
}, getTextHorizontalAlignment: function () {
    return this._labelRenderer.getHorizontalAlignment()
}, setTextVerticalAlignment: function (alignment) {
    this._labelRenderer.setVerticalAlignment(alignment);
    this._updateContentSizeWithTextureSize(this._labelRenderer.getContentSize());
    this._labelRendererAdaptDirty = true
}, getTextVerticalAlignment: function () {
    return this._labelRenderer.getVerticalAlignment()
},
    setTouchScaleChangeEnabled: function (enable) {
        this._touchScaleChangeEnabled = enable
    }, isTouchScaleChangeEnabled: function () {
        return this._touchScaleChangeEnabled
    }, onPressStateChangedToNormal: function () {
        if (!this._touchScaleChangeEnabled)return;
        this._labelRenderer.setScaleX(this._normalScaleValueX);
        this._labelRenderer.setScaleY(this._normalScaleValueY)
    }, onPressStateChangedToPressed: function () {
        if (!this._touchScaleChangeEnabled)return;
        this._labelRenderer.setScaleX(this._normalScaleValueX + this._onSelectedScaleOffset);
        this._labelRenderer.setScaleY(this._normalScaleValueY + this._onSelectedScaleOffset)
    }, onPressStateChangedToDisabled: function () {
    }, updateFlippedX: function () {
        if (this._flippedX)this._labelRenderer.setScaleX(-1); else this._labelRenderer.setScaleX(1)
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this._labelRendererAdaptDirty = true
    }, adaptRenderers: function () {
        if (this._labelRendererAdaptDirty) {
            this.labelScaleChangedWithSize();
            this._labelRendererAdaptDirty = false
        }
    }, getVirtualRendererSize: function () {
        return this._labelRenderer.getContentSize()
    },
    getVirtualRenderer: function () {
        return this._labelRenderer
    }, labelScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            this._labelRenderer.setScale(1);
            this._normalScaleValueX = this._normalScaleValueY = 1
        } else {
            this._labelRenderer.setDimensions(cc.size(this._contentSize.width, this._contentSize.height));
            var textureSize = this._labelRenderer.getContentSize();
            if (textureSize.width <= 0 || textureSize.height <= 0) {
                this._labelRenderer.setScale(1);
                return
            }
            var scaleX = this._contentSize.width / textureSize.width;
            var scaleY = this._contentSize.height /
                textureSize.height;
            this._labelRenderer.setScaleX(scaleX);
            this._labelRenderer.setScaleY(scaleY);
            this._normalScaleValueX = scaleX;
            this._normalScaleValueY = scaleY
        }
        this._labelRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
    }, getDescription: function () {
        return"Label"
    }, enableShadow: function (shadowColor, offset, blurRadius) {
        this._labelRenderer.enableShadow(shadowColor, offset, blurRadius)
    }, enableOutline: function (outlineColor, outlineSize) {
        this._labelRenderer.enableOutline(outlineColor, outlineSize)
    },
    enableGlow: function (glowColor) {
        if (this._type == ccui.Text.Type.TTF)this._labelRenderer.enableGlow(glowColor)
    }, disableEffect: function () {
        this._labelRenderer.disableEffect()
    }, createCloneInstance: function () {
        return ccui.Text.create()
    }, getFontName: function () {
        return this._fontName
    }, getType: function () {
        return this._type
    }, _setFont: function (font) {
        var res = cc.LabelTTF._fontStyleRE.exec(font);
        if (res) {
            this._fontSize = parseInt(res[1]);
            this._fontName = res[2];
            this._labelRenderer._setFont(font);
            this.labelScaleChangedWithSize()
        }
    },
    _getFont: function () {
        return this._labelRenderer._getFont()
    }, _setBoundingWidth: function (value) {
        this._textAreaSize.width = value;
        this._labelRenderer._setBoundingWidth(value);
        this.labelScaleChangedWithSize()
    }, _setBoundingHeight: function (value) {
        this._textAreaSize.height = value;
        this._labelRenderer._setBoundingHeight(value);
        this.labelScaleChangedWithSize()
    }, _getBoundingWidth: function () {
        return this._textAreaSize.width
    }, _getBoundingHeight: function () {
        return this._textAreaSize.height
    }, copySpecialProperties: function (uiLabel) {
        if (uiLabel instanceof
            uiLabel) {
            this.setFontName(uiLabel._fontName);
            this.setFontSize(uiLabel.getFontSize());
            this.setString(uiLabel.getString());
            this.setTouchScaleChangeEnabled(uiLabel.touchScaleEnabled);
            this.setTextAreaSize(uiLabel._textAreaSize);
            this.setTextHorizontalAlignment(uiLabel._labelRenderer.getHorizontalAlignment());
            this.setTextVerticalAlignment(uiLabel._labelRenderer.getVerticalAlignment())
        }
    }});
var _p = ccui.Text.prototype;
_p.boundingWidth;
cc.defineGetterSetter(_p, "boundingWidth", _p._getBoundingWidth, _p._setBoundingWidth);
_p.boundingHeight;
cc.defineGetterSetter(_p, "boundingHeight", _p._getBoundingHeight, _p._setBoundingHeight);
_p.string;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
_p.stringLength;
cc.defineGetterSetter(_p, "stringLength", _p.getStringLength);
_p.font;
cc.defineGetterSetter(_p, "font", _p._getFont, _p._setFont);
_p.fontSize;
cc.defineGetterSetter(_p, "fontSize", _p.getFontSize, _p.setFontSize);
_p.fontName;
cc.defineGetterSetter(_p, "fontName", _p.getFontName, _p.setFontName);
_p.textAlign;
cc.defineGetterSetter(_p, "textAlign", _p.getTextHorizontalAlignment, _p.setTextHorizontalAlignment);
_p.verticalAlign;
cc.defineGetterSetter(_p, "verticalAlign", _p.getTextVerticalAlignment, _p.setTextVerticalAlignment);
_p = null;
ccui.Label = ccui.Text.create = function (textContent, fontName, fontSize) {
    var widget = new ccui.Text;
    if (arguments.length > 0) {
        if (widget && widget.init(textContent, fontName, fontSize))return widget
    } else if (widget && widget.init())return widget;
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
}, setProperty: function (stringValue, charMapFile, itemWidth, itemHeight, startCharMap) {
    this._stringValue = stringValue;
    this._charMapFileName = charMapFile;
    this._itemWidth = itemWidth;
    this._itemHeight = itemHeight;
    this._startCharMap = startCharMap;
    this._labelAtlasRenderer.initWithString(stringValue, this._charMapFileName, this._itemWidth, this._itemHeight, this._startCharMap[0]);
    this._updateContentSizeWithTextureSize(this._labelAtlasRenderer.getContentSize());
    this._labelAtlasRendererAdaptDirty = true
}, setString: function (value) {
    this._stringValue = value;
    this._labelAtlasRenderer.setString(value);
    this._updateContentSizeWithTextureSize(this._labelAtlasRenderer.getContentSize());
    this._labelAtlasRendererAdaptDirty = true
}, setStringValue: function (value) {
    cc.log("Please use the setString");
    this.setString(value)
}, getStringValue: function () {
    cc.log("Please use the getString");
    return this.getString()
}, getString: function () {
    return this._labelAtlasRenderer.getString()
}, getStringLength: function () {
    return this._labelAtlasRenderer.getStringLength()
}, onSizeChanged: function () {
    ccui.Widget.prototype.onSizeChanged.call(this);
    this._labelAtlasRendererAdaptDirty = true
}, adaptRenderers: function () {
    if (this._labelAtlasRendererAdaptDirty) {
        this.labelAtlasScaleChangedWithSize();
        this._labelAtlasRendererAdaptDirty = false
    }
}, getVirtualRendererSize: function () {
    return this._labelAtlasRenderer.getContentSize()
}, getVirtualRenderer: function () {
    return this._labelAtlasRenderer
}, labelAtlasScaleChangedWithSize: function () {
    if (this._ignoreSize)this._labelAtlasRenderer.setScale(1); else {
        var textureSize = this._labelAtlasRenderer.getContentSize();
        if (textureSize.width <=
            0 || textureSize.height <= 0) {
            this._labelAtlasRenderer.setScale(1);
            return
        }
        var scaleX = this._size.width / textureSize.width;
        var scaleY = this._size.height / textureSize.height;
        this._labelAtlasRenderer.setScaleX(scaleX);
        this._labelAtlasRenderer.setScaleY(scaleY)
    }
    this._labelAtlasRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
}, getDescription: function () {
    return"LabelAtlas"
}, createCloneInstance: function () {
    return ccui.TextAtlas.create()
}, copySpecialProperties: function (labelAtlas) {
    if (labelAtlas)this.setProperty(labelAtlas._stringValue,
        labelAtlas._charMapFileName, labelAtlas._itemWidth, labelAtlas._itemHeight, labelAtlas._startCharMap)
}});
var _p = ccui.TextAtlas.prototype;
_p.string;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
_p = null;
ccui.TextAtlas.create = function (stringValue, charMapFile, itemWidth, itemHeight, startCharMap) {
    var widget = new ccui.TextAtlas;
    if (widget && widget.init()) {
        if (arguments.length > 0)widget.setProperty(stringValue, charMapFile, itemWidth, itemHeight, startCharMap);
        return widget
    }
    return null
};
ccui.TextAtlas.RENDERER_ZORDER = -1;
ccui.LabelBMFont = ccui.TextBMFont = ccui.Widget.extend({_labelBMFontRenderer: null, _fntFileHasInit: false, _fntFileName: "", _stringValue: "", _className: "TextBMFont", _labelBMFontRendererAdaptDirty: true, ctor: function () {
    ccui.Widget.prototype.ctor.call(this)
}, initRenderer: function () {
    this._labelBMFontRenderer = cc.LabelBMFont.create();
    this.addProtectedChild(this._labelBMFontRenderer, ccui.TextBMFont.RENDERER_ZORDER, -1)
}, setFntFile: function (fileName) {
    if (!fileName)return;
    this._fntFileName = fileName;
    this._labelBMFontRenderer.initWithString("",
        fileName);
    this.updateAnchorPoint();
    this.labelBMFontScaleChangedWithSize();
    if (!this._labelBMFontRenderer.textureLoaded())this._labelBMFontRenderer.addLoadedEventListener(function () {
        this.labelBMFontScaleChangedWithSize()
    }, this);
    this._labelBMFontRenderer.setColor(this.getColor());
    this._labelBMFontRenderer.setOpacity(this.getOpacity());
    this._fntFileHasInit = true;
    this.setString(this._stringValue)
}, setText: function (value) {
    cc.log("Please use the setString");
    this.setString(value)
}, setString: function (value) {
    this._stringValue =
        value;
    if (!this._fntFileHasInit)return;
    this._labelBMFontRenderer.setString(value);
    this._updateContentSizeWithTextureSize(this._labelBMFontRenderer.getContentSize());
    this._labelBMFontRendererAdaptDirty = true
}, getString: function () {
    return this._stringValue
}, getStringLength: function () {
    return this._labelBMFontRenderer.getStringLength()
}, onSizeChanged: function () {
    ccui.Widget.prototype.onSizeChanged.call(this);
    this._labelBMFontRendererAdaptDirty = true
}, adaptRenderers: function () {
    if (this._labelBMFontRendererAdaptDirty) {
        this.labelBMFontScaleChangedWithSize();
        this._labelBMFontRendererAdaptDirty = false
    }
}, getVirtualRendererSize: function () {
    return this._labelBMFontRenderer.getContentSize()
}, getVirtualRenderer: function () {
    return this._labelBMFontRenderer
}, labelBMFontScaleChangedWithSize: function () {
    if (this._ignoreSize)this._labelBMFontRenderer.setScale(1); else {
        var textureSize = this._labelBMFontRenderer.getContentSize();
        if (textureSize.width <= 0 || textureSize.height <= 0) {
            this._labelBMFontRenderer.setScale(1);
            return
        }
        var scaleX = this._size.width / textureSize.width;
        var scaleY =
            this._size.height / textureSize.height;
        this._labelBMFontRenderer.setScaleX(scaleX);
        this._labelBMFontRenderer.setScaleY(scaleY)
    }
    this._labelBMFontRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2)
}, getDescription: function () {
    return"LabelBMFont"
}});
var _p = ccui.TextBMFont.prototype;
_p.string;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setStringValue);
_p = null;
ccui.TextBMFont.create = function (text, filename) {
    var widget = new ccui.TextBMFont;
    if (widget && widget.init()) {
        if (filename && text) {
            widget.setFntFile(filename);
            widget.setString(text)
        }
        return widget
    }
    return null
};
ccui.TextBMFont.RENDERER_ZORDER = -1;
ccui.UICCTextField = cc.TextFieldTTF.extend({maxLengthEnabled: false, maxLength: 0, passwordEnabled: false, _passwordStyleText: "", _attachWithIME: false, _detachWithIME: false, _insertText: false, _deleteBackward: false, _className: "UICCTextField", _textFieldRendererAdaptDirty: true, ctor: function () {
    cc.TextFieldTTF.prototype.ctor.call(this);
    this.maxLengthEnabled = false;
    this.maxLength = 0;
    this.passwordEnabled = false;
    this._passwordStyleText = "*";
    this._attachWithIME = false;
    this._detachWithIME = false;
    this._insertText = false;
    this._deleteBackward =
        false
}, onEnter: function () {
    cc.TextFieldTTF.prototype.setDelegate.call(this, this)
}, onTextFieldAttachWithIME: function (sender) {
    this.setAttachWithIME(true);
    return false
}, onTextFieldInsertText: function (sender, text, len) {
    if (len == 1 && text == "\n")return false;
    this.setInsertText(true);
    if (this.maxLengthEnabled)if (cc.TextFieldTTF.prototype.getCharCount.call(this) >= this.maxLength)return true;
    return false
}, onTextFieldDeleteBackward: function (sender, delText, nLen) {
    this.setDeleteBackward(true);
    return false
}, onTextFieldDetachWithIME: function (sender) {
    this.setDetachWithIME(true);
    return false
}, insertText: function (text, len) {
    var input_text = text;
    if (text != "\n")if (this.maxLengthEnabled) {
        var text_count = this.getString().length;
        if (text_count >= this.maxLength) {
            if (this.passwordEnabled)this.setPasswordText(this.getString());
            return
        }
    }
    cc.TextFieldTTF.prototype.insertText.call(this, input_text, len);
    if (this.passwordEnabled)if (cc.TextFieldTTF.prototype.getCharCount.call(this) > 0)this.setPasswordText(this.getString())
}, deleteBackward: function () {
    cc.TextFieldTTF.prototype.deleteBackward.call(this);
    if (cc.TextFieldTTF.prototype.getCharCount.call(this) > 0)if (this.passwordEnabled)this.setPasswordText(this._inputText)
}, openIME: function () {
    cc.TextFieldTTF.prototype.attachWithIME.call(this)
}, closeIME: function () {
    cc.TextFieldTTF.prototype.detachWithIME.call(this)
}, setMaxLengthEnabled: function (enable) {
    this.maxLengthEnabled = enable
}, isMaxLengthEnabled: function () {
    return this.maxLengthEnabled
}, setMaxLength: function (length) {
    this.maxLength = length
}, getMaxLength: function () {
    return this.maxLength
}, getCharCount: function () {
    return cc.TextFieldTTF.prototype.getCharCount.call(this)
},
    setPasswordEnabled: function (enable) {
        this.passwordEnabled = enable
    }, isPasswordEnabled: function () {
        return this.passwordEnabled
    }, setPasswordStyleText: function (styleText) {
        if (styleText.length > 1)return;
        var header = styleText.charCodeAt(0);
        if (header < 33 || header > 126)return;
        this._passwordStyleText = styleText
    }, setPasswordText: function (text) {
        var tempStr = "";
        var text_count = text.length;
        var max = text_count;
        if (this.maxLengthEnabled)if (text_count > this.maxLength)max = this.maxLength;
        for (var i = 0; i < max; ++i)tempStr += this._passwordStyleText;
        cc.LabelTTF.prototype.setString.call(this, tempStr)
    }, setAttachWithIME: function (attach) {
        this._attachWithIME = attach
    }, getAttachWithIME: function () {
        return this._attachWithIME
    }, setDetachWithIME: function (detach) {
        this._detachWithIME = detach
    }, getDetachWithIME: function () {
        return this._detachWithIME
    }, setInsertText: function (insert) {
        this._insertText = insert
    }, getInsertText: function () {
        return this._insertText
    }, setDeleteBackward: function (deleteBackward) {
        this._deleteBackward = deleteBackward
    }, getDeleteBackward: function () {
        return this._deleteBackward
    },
    init: function () {
        if (ccui.Widget.prototype.init.call(this)) {
            this.setTouchEnabled(true);
            return true
        }
        return false
    }, onDraw: function (sender) {
        return false
    }});
ccui.UICCTextField.create = function (placeholder, fontName, fontSize) {
    var ret = new ccui.UICCTextField;
    if (ret && ret.initWithString("", fontName, fontSize)) {
        if (placeholder)ret.setPlaceHolder(placeholder);
        return ret
    }
    return null
};
ccui.TextField = ccui.Widget.extend({_textFieldRender: null, _touchWidth: 0, _touchHeight: 0, _useTouchArea: false, _textFieldEventListener: null, _textFieldEventSelector: null, _attachWithIMEListener: null, _detachWithIMEListener: null, _insertTextListener: null, _deleteBackwardListener: null, _attachWithIMESelector: null, _detachWithIMESelector: null, _insertTextSelector: null, _deleteBackwardSelector: null, _passwordStyleText: "", _textFieldRendererAdaptDirty: true, ctor: function () {
    ccui.Widget.prototype.ctor.call(this)
}, init: function () {
    if (ccui.Widget.prototype.init.call(this)) {
        this.setTouchEnabled(true);
        return true
    }
    return false
}, onEnter: function () {
    ccui.Widget.prototype.onEnter.call(this);
    this.setUpdateEnabled(true)
}, onExit: function () {
    this.setUpdateEnabled(false);
    ccui.Layout.prototype.onExit.call(this)
}, initRenderer: function () {
    this._textFieldRender = ccui.UICCTextField.create("input words here", "Thonburi", 20);
    this.addProtectedChild(this._textFieldRender, ccui.TextField.RENDERER_ZORDER, -1)
}, setTouchSize: function (size) {
    this._touchWidth = size.width;
    this._touchHeight = size.height
}, setTouchAreaEnabled: function (enable) {
    this._useTouchArea =
        enable
}, adaptRenderers: function () {
    if (this._textFieldRendererAdaptDirty) {
        this.textfieldRendererScaleChangedWithSize();
        this._textFieldRendererAdaptDirty = false
    }
}, hitTest: function (pt) {
    if (this._useTouchArea) {
        var nsp = this.convertToNodeSpace(pt);
        var bb = cc.rect(-this._touchWidth * this._anchorPoint.x, -this._touchHeight * this._anchorPoint.y, this._touchWidth, this._touchHeight);
        if (nsp.x >= bb.origin.x && nsp.x <= bb.origin.x + bb.size.width && nsp.y >= bb.origin.y && nsp.y <= bb.origin.y + bb.size.height)return true
    } else return ccui.Widget.prototype.hitTest.call(this,
        pt);
    return false
}, getTouchSize: function () {
    return cc.size(this._touchWidth, this._touchHeight)
}, setText: function (text) {
    cc.log("Please use the setString");
    this.setString(text)
}, setString: function (text) {
    if (!text)return;
    text = String(text);
    if (this.isMaxLengthEnabled())text = text.substr(0, this.getMaxLength());
    if (this.isPasswordEnabled()) {
        this._textFieldRender.setPasswordText(text);
        this._textFieldRender.setString("");
        this._textFieldRender.insertText(text, text.length)
    } else this._textFieldRender.setString(text);
    this._textFieldRendererAdaptDirty = true;
    this._updateContentSizeWithTextureSize(this._textFieldRender.getContentSize())
}, setPlaceHolder: function (value) {
    this._textFieldRender.setPlaceHolder(value);
    this._textFieldRendererAdaptDirty = true;
    this._updateContentSizeWithTextureSize(this._textFieldRender.getContentSize())
}, getPlaceHolder: function () {
    return this._textFieldRender.getPlaceHolder()
}, _setFont: function (font) {
    this._textFieldRender._setFont(font);
    this._textFieldRendererAdaptDirty = true
}, _getFont: function () {
    return this._textFieldRender._getFont()
},
    setFontSize: function (size) {
        this._textFieldRender.setFontSize(size);
        this._textFieldRendererAdaptDirty = true;
        this._updateContentSizeWithTextureSize(this._textFieldRender.getContentSize())
    }, getFontSize: function () {
        return this._textFieldRender.getSystemFontSize()
    }, setFontName: function (name) {
        this._textFieldRender.setFontName(name);
        this._textFieldRendererAdaptDirty = true;
        this._updateContentSizeWithTextureSize(this._textFieldRender.getContentSize())
    }, getFontName: function () {
        return this._textFieldRender.getSystemFontName()
    },
    didNotSelectSelf: function () {
        this._textFieldRender.detachWithIME()
    }, getStringValue: function () {
        cc.log("Please use the getString");
        return this.getString()
    }, getString: function () {
        return this._textFieldRender.getString()
    }, getStringLength: function () {
        return this._textFieldRender.getStringLength()
    }, onTouchBegan: function (touchPoint, unusedEvent) {
        var self = this;
        var pass = ccui.Widget.prototype.onTouchBegan.call(self, touchPoint, unusedEvent);
        if (self._hitted)setTimeout(function () {
                self._textFieldRender.attachWithIME()
            },
            0);
        return pass
    }, setMaxLengthEnabled: function (enable) {
        this._textFieldRender.setMaxLengthEnabled(enable)
    }, isMaxLengthEnabled: function () {
        return this._textFieldRender.isMaxLengthEnabled()
    }, setMaxLength: function (length) {
        this._textFieldRender.setMaxLength(length);
        this.setString(this.getString())
    }, getMaxLength: function () {
        return this._textFieldRender.getMaxLength()
    }, setPasswordEnabled: function (enable) {
        this._textFieldRender.setPasswordEnabled(enable)
    }, isPasswordEnabled: function () {
        return this._textFieldRender.isPasswordEnabled()
    },
    setPasswordStyleText: function (styleText) {
        this._textFieldRender.setPasswordStyleText(styleText);
        this._passwordStyleText = styleText;
        this.setString(this.getString())
    }, getPasswordStyleText: function () {
        return this._passwordStyleText
    }, update: function (dt) {
        if (this.getAttachWithIME()) {
            this.attachWithIMEEvent();
            this.setAttachWithIME(false)
        }
        if (this.getDetachWithIME()) {
            this.detachWithIMEEvent();
            this.setDetachWithIME(false)
        }
        if (this.getInsertText()) {
            this.insertTextEvent();
            this.setInsertText(false);
            this._textFieldRendererAdaptDirty =
                true;
            this._updateContentSizeWithTextureSize(this._textFieldRender.getContentSize())
        }
        if (this.getDeleteBackward()) {
            this.deleteBackwardEvent();
            this.setDeleteBackward(false);
            this._textFieldRendererAdaptDirty = true;
            this._updateContentSizeWithTextureSize(this._textFieldRender.getContentSize())
        }
    }, getAttachWithIME: function () {
        return this._textFieldRender.getAttachWithIME()
    }, setAttachWithIME: function (attach) {
        this._textFieldRender.setAttachWithIME(attach)
    }, getDetachWithIME: function () {
        return this._textFieldRender.getDetachWithIME()
    },
    setDetachWithIME: function (detach) {
        this._textFieldRender.setDetachWithIME(detach)
    }, getInsertText: function () {
        return this._textFieldRender.getInsertText()
    }, setInsertText: function (insertText) {
        this._textFieldRender.setInsertText(insertText)
    }, getDeleteBackward: function () {
        return this._textFieldRender.getDeleteBackward()
    }, setDeleteBackward: function (deleteBackward) {
        this._textFieldRender.setDeleteBackward(deleteBackward)
    }, attachWithIMEEvent: function () {
        if (this._textFieldEventListener && this._textFieldEventSelector)this._textFieldEventSelector.call(this._textFieldEventListener,
            this, ccui.TextField.EVENT_ATTACH_WITH_ME);
        if (this._eventCallback)this._eventCallback(this, 0)
    }, detachWithIMEEvent: function () {
        if (this._textFieldEventListener && this._textFieldEventSelector)this._textFieldEventSelector.call(this._textFieldEventListener, this, ccui.TextField.EVENT_DETACH_WITH_ME);
        if (this._eventCallback)this._eventCallback(this, 1)
    }, insertTextEvent: function () {
        if (this._textFieldEventListener && this._textFieldEventSelector)this._textFieldEventSelector.call(this._textFieldEventListener, this, ccui.TextField.EVENT_INSERT_TEXT);
        if (this._eventCallback)this._eventCallback(this, 2)
    }, deleteBackwardEvent: function () {
        if (this._textFieldEventListener && this._textFieldEventSelector)this._textFieldEventSelector.call(this._textFieldEventListener, this, ccui.TextField.EVENT_DELETE_BACKWARD);
        if (this._eventCallback)this._eventCallback(this, 3)
    }, addEventListenerTextField: function (selector, target) {
        this._textFieldEventSelector = selector;
        this._textFieldEventListener = target
    }, setAnchorPoint: function (point, y) {
        if (y === undefined) {
            ccui.Widget.prototype.setAnchorPoint.call(this,
                point);
            this._textFieldRender.setAnchorPoint(point)
        } else {
            ccui.Widget.prototype.setAnchorPoint.call(this, point, y);
            this._textFieldRender.setAnchorPoint(point, y)
        }
    }, _setAnchorX: function (value) {
        ccui.Widget.prototype._setAnchorX.call(this, value);
        this._textFieldRender._setAnchorX(value)
    }, _setAnchorY: function (value) {
        ccui.Widget.prototype._setAnchorY.call(this, value);
        this._textFieldRender._setAnchorY(value)
    }, onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this._textFieldRendererAdaptDirty =
            true
    }, textfieldRendererScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            this._textFieldRender.setScale(1);
            var rendererSize = this.getContentSize();
            this._size.width = rendererSize.width;
            this._size.height = rendererSize.height
        } else {
            var textureSize = this.getContentSize();
            if (textureSize.width <= 0 || textureSize.height <= 0) {
                this._textFieldRender.setScale(1);
                return
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._textFieldRender.setScaleX(scaleX);
            this._textFieldRender.setScaleY(scaleY)
        }
        this._textFieldRender.setPosition(this._contentSize.width /
            2, this._contentSize.height / 2)
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
    }, getDescription: function () {
        return"TextField"
    },
    attachWithIME: function () {
        this._textFieldRender.attachWithIME()
    }, createCloneInstance: function () {
        return ccui.TextField.create()
    }, copySpecialProperties: function (textField) {
        this.setString(textField._textFieldRender.getString());
        this.setPlaceHolder(textField.getString());
        this.setFontSize(textField._textFieldRender.getFontSize());
        this.setFontName(textField._textFieldRender.getFontName());
        this.setMaxLengthEnabled(textField.isMaxLengthEnabled());
        this.setMaxLength(textField.getMaxLength());
        this.setPasswordEnabled(textField.isPasswordEnabled());
        this.setPasswordStyleText(textField._passwordStyleText);
        this.setAttachWithIME(textField.getAttachWithIME());
        this.setDetachWithIME(textField.getDetachWithIME());
        this.setInsertText(textField.getInsertText());
        this.setDeleteBackward(textField.getDeleteBackward())
    }});
ccui.TextField.create = function (placeholder, fontName, fontSize) {
    var widget = new ccui.TextField;
    if (widget && widget.init()) {
        if (placeholder && fontName && fontSize) {
            widget.setPlaceHolder(placeholder);
            widget.setFontName(fontName);
            widget.setFontSize(fontSize)
        }
        return widget
    }
    return null
};
var _p = ccui.TextField.prototype;
_p.string;
cc.defineGetterSetter(_p, "string", _p.getString, _p.setString);
_p.placeHolder;
cc.defineGetterSetter(_p, "placeHolder", _p.getPlaceHolder, _p.setPlaceHolder);
_p.font;
cc.defineGetterSetter(_p, "font", _p._getFont, _p._setFont);
_p.fontSize;
cc.defineGetterSetter(_p, "fontSize", _p.getFontSize, _p.setFontSize);
_p.fontName;
cc.defineGetterSetter(_p, "fontName", _p.getFontName, _p.setFontName);
_p.maxLengthEnabled;
cc.defineGetterSetter(_p, "maxLengthEnabled", _p.isMaxLengthEnabled, _p.setMaxLengthEnabled);
_p.maxLength;
cc.defineGetterSetter(_p, "maxLength", _p.getMaxLength, _p.setMaxLength);
_p.passwordEnabled;
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
    this.type = 0;
    this.tag = 0;
    this.color = cc.color(255, 255, 255, 255)
}, init: function (tag, color, opacity) {
    this.tag = tag;
    this.color.r = color.r;
    this.color.g = color.g;
    this.color.b = color.b;
    this.color.a = opacity
}});
ccui.RichElementText = ccui.RichElement.extend({text: "", fontName: "", fontSize: 0, ctor: function () {
    ccui.RichElement.prototype.ctor.call(this);
    this.type = ccui.RichElement.TEXT;
    this.text = "";
    this.fontName = "";
    this.fontSize = 0
}, init: function (tag, color, opacity, text, fontName, fontSize) {
    ccui.RichElement.prototype.init.call(this, tag, color, opacity);
    this.text = text;
    this.fontName = fontName;
    this.fontSize = fontSize
}});
ccui.RichElementText.create = function (tag, color, opacity, text, fontName, fontSize) {
    var element = new ccui.RichElementText;
    element.init(tag, color, opacity, text, fontName, fontSize);
    return element
};
ccui.RichElementImage = ccui.RichElement.extend({filePath: "", textureRect: null, textureType: 0, ctor: function () {
    ccui.RichElement.prototype.ctor.call(this);
    this.type = ccui.RichElement.IMAGE;
    this.filePath = "";
    this.textureRect = cc.rect(0, 0, 0, 0);
    this.textureType = 0
}, init: function (tag, color, opacity, filePath) {
    ccui.RichElement.prototype.init.call(this, tag, color, opacity);
    this.filePath = filePath
}});
ccui.RichElementImage.create = function (tag, color, opacity, filePath) {
    var element = new ccui.RichElementImage;
    element.init(tag, color, opacity, filePath);
    return element
};
ccui.RichElementCustomNode = ccui.RichElement.extend({customNode: null, ctor: function () {
    ccui.RichElement.prototype.ctor.call(this);
    this.type = ccui.RichElement.CUSTOM;
    this.customNode = null
}, init: function (tag, color, opacity, customNode) {
    ccui.RichElement.prototype.init.call(this, tag, color, opacity);
    this.customNode = customNode
}});
ccui.RichElementCustomNode.create = function (tag, color, opacity, customNode) {
    var element = new ccui.RichElementCustomNode;
    element.init(tag, color, opacity, customNode);
    return element
};
ccui.RichText = ccui.Widget.extend({_formatTextDirty: false, _richElements: null, _elementRenders: null, _leftSpaceWidth: 0, _verticalSpace: 0, _elementRenderersContainer: null, ctor: function () {
    ccui.Widget.prototype.ctor.call(this);
    this._formatTextDirty = false;
    this._richElements = [];
    this._elementRenders = [];
    this._leftSpaceWidth = 0;
    this._verticalSpace = 0
}, initRenderer: function () {
    this._elementRenderersContainer = cc.Node.create();
    this._elementRenderersContainer.setAnchorPoint(0.5, 0.5);
    this.addProtectedChild(this._elementRenderersContainer,
        0, -1)
}, insertElement: function (element, index) {
    this._richElements.splice(index, 0, element);
    this._formatTextDirty = true
}, pushBackElement: function (element) {
    this._richElements.push(element);
    this._formatTextDirty = true
}, removeElement: function (element) {
    if (typeof element === "number")this._richElements.splice(element, 1); else cc.arrayRemoveObject(this._richElements, element);
    this._formatTextDirty = true
}, formatText: function () {
    if (this._formatTextDirty) {
        this._elementRenderersContainer.removeAllChildren();
        this._elementRenders.length =
            0;
        var i, element, locRichElements = this._richElements;
        if (this._ignoreSize) {
            this.addNewLine();
            for (i = 0; i < locRichElements.length; i++) {
                element = locRichElements[i];
                var elementRenderer = null;
                switch (element.type) {
                    case ccui.RichElement.TEXT:
                        elementRenderer = cc.LabelTTF.create(element.text, element.fontName, element.fontSize);
                        break;
                    case ccui.RichElement.IMAGE:
                        elementRenderer = cc.Sprite.create(element.filePath);
                        break;
                    case ccui.RichElement.CUSTOM:
                        elementRenderer = element.customNode;
                        break;
                    default:
                        break
                }
                elementRenderer.setColor(element.color);
                elementRenderer.setOpacity(element.color.a);
                this.pushToContainer(elementRenderer)
            }
        } else {
            this.addNewLine();
            for (i = 0; i < locRichElements.length; i++) {
                element = locRichElements[i];
                switch (element.type) {
                    case ccui.RichElement.TEXT:
                        this.handleTextRenderer(element.text, element.fontName, element.fontSize, element.color);
                        break;
                    case ccui.RichElement.IMAGE:
                        this.handleImageRenderer(element.filePath, element.color, element.color.a);
                        break;
                    case ccui.RichElement.CUSTOM:
                        this.handleCustomRenderer(element.customNode);
                        break;
                    default:
                        break
                }
            }
        }
        this.formatRenderers();
        this._formatTextDirty = false
    }
}, handleTextRenderer: function (text, fontName, fontSize, color) {
    var textRenderer = cc.LabelTTF.create(text, fontName, fontSize);
    var textRendererWidth = textRenderer.getContentSize().width;
    this._leftSpaceWidth -= textRendererWidth;
    if (this._leftSpaceWidth < 0) {
        var overstepPercent = -this._leftSpaceWidth / textRendererWidth;
        var curText = text;
        var stringLength = curText.length;
        var leftLength = stringLength * (1 - overstepPercent);
        var leftWords = curText.substr(0, leftLength);
        var cutWords = curText.substr(leftLength,
                curText.length - 1);
        if (leftLength > 0) {
            var leftRenderer = cc.LabelTTF.create(leftWords.substr(0, leftLength), fontName, fontSize);
            leftRenderer.setColor(color);
            leftRenderer.setOpacity(color.a);
            this.pushToContainer(leftRenderer)
        }
        this.addNewLine();
        this.handleTextRenderer(cutWords, fontName, fontSize, color)
    } else {
        textRenderer.setColor(color);
        textRenderer.setOpacity(color.a);
        this.pushToContainer(textRenderer)
    }
}, handleImageRenderer: function (filePath, color, opacity) {
    var imageRenderer = cc.Sprite.create(filePath);
    this.handleCustomRenderer(imageRenderer)
},
    handleCustomRenderer: function (renderer) {
        var imgSize = renderer.getContentSize();
        this._leftSpaceWidth -= imgSize.width;
        if (this._leftSpaceWidth < 0) {
            this.addNewLine();
            this.pushToContainer(renderer);
            this._leftSpaceWidth -= imgSize.width
        } else this.pushToContainer(renderer)
    }, addNewLine: function () {
        this._leftSpaceWidth = this._customSize.width;
        this._elementRenders.push([])
    }, formatRenderers: function () {
        var newContentSizeHeight = 0, locRenderersContainer = this._elementRenderersContainer;
        var locElementRenders = this._elementRenders;
        if (this._ignoreSize) {
            var newContentSizeWidth = 0;
            var row = locElementRenders[0];
            var nextPosX = 0;
            for (var j = 0; j < row.length; j++) {
                var l = row[j];
                l.setAnchorPoint(cc.p(0, 0));
                l.setPosition(cc.p(nextPosX, 0));
                locRenderersContainer.addChild(l, 1, j);
                var iSize = l.getContentSize();
                newContentSizeWidth += iSize.width;
                newContentSizeHeight = Math.max(newContentSizeHeight, iSize.height);
                nextPosX += iSize.width
            }
            locRenderersContainer.setContentSize(cc.size(newContentSizeWidth, newContentSizeHeight))
        } else {
            var maxHeights = [];
            for (var i =
                0; i < locElementRenders.length; i++) {
                var row = locElementRenders[i];
                var maxHeight = 0;
                for (var j = 0; j < row.length; j++) {
                    var l = row[j];
                    maxHeight = Math.max(l.getContentSize().height, maxHeight)
                }
                maxHeights[i] = maxHeight;
                newContentSizeHeight += maxHeights[i]
            }
            var nextPosY = this._customSize.height;
            for (var i = 0; i < locElementRenders.length; i++) {
                var row = locElementRenders[i];
                var nextPosX = 0;
                nextPosY -= maxHeights[i] + this._verticalSpace;
                for (var j = 0; j < row.length; j++) {
                    var l = row[j];
                    l.setAnchorPoint(cc.p(0, 0));
                    l.setPosition(cc.p(nextPosX,
                        nextPosY));
                    locRenderersContainer.addChild(l, 1, i * 10 + j);
                    nextPosX += l.getContentSize().width
                }
            }
            locRenderersContainer.setContentSize(this._size)
        }
        this._elementRenders.length = 0;
        if (this._ignoreSize) {
            var s = this.getVirtualRendererSize();
            this._size.width = s.width;
            this._size.height = s.height
        } else {
            this._size.width = this._customSize.width;
            this._size.height = this._customSize.height
        }
        this._updateContentSizeWithTextureSize(this._size);
        locRenderersContainer.setPosition(this._contentSize.width * 0.5, this._contentSize.height *
            0.5)
    }, pushToContainer: function (renderer) {
        if (this._elementRenders.length <= 0)return;
        this._elementRenders[this._elementRenders.length - 1].push(renderer)
    }, visit: function (ctx) {
        if (this._enabled) {
            this.formatText();
            ccui.Widget.prototype.visit.call(this, ctx)
        }
    }, setVerticalSpace: function (space) {
        this._verticalSpace = space
    }, setAnchorPoint: function (pt) {
        ccui.Widget.prototype.setAnchorPoint.call(this, pt);
        this._elementRenderersContainer.setAnchorPoint(pt)
    }, getVirtualRendererSize: function () {
        return this._elementRenderersContainer.getContentSize()
    },
    getContentSize: function () {
        return this._elementRenderersContainer.getContentSize()
    }, ignoreContentAdaptWithSize: function (ignore) {
        if (this._ignoreSize != ignore) {
            this._formatTextDirty = true;
            ccui.Widget.prototype.ignoreContentAdaptWithSize.call(this, ignore)
        }
    }, getDescription: function () {
        return"RichText"
    }});
ccui.RichText.create = function () {
    return new ccui.RichText
};
ccui.RichElement.TEXT = 0;
ccui.RichElement.IMAGE = 1;
ccui.RichElement.CUSTOM = 2;
ccui.ScrollView = ccui.Layout.extend({_innerContainer: null, direction: null, _autoScrollDir: null, _topBoundary: 0, _bottomBoundary: 0, _leftBoundary: 0, _rightBoundary: 0, _bounceTopBoundary: 0, _bounceBottomBoundary: 0, _bounceLeftBoundary: 0, _bounceRightBoundary: 0, _autoScroll: false, _autoScrollAddUpTime: 0, _autoScrollOriginalSpeed: 0, _autoScrollAcceleration: 0, _isAutoScrollSpeedAttenuated: false, _needCheckAutoScrollDestination: false, _autoScrollDestination: null, _bePressed: false, _slidTime: 0, _moveChildPoint: null, _childFocusCancelOffset: 0,
    _leftBounceNeeded: false, _topBounceNeeded: false, _rightBounceNeeded: false, _bottomBounceNeeded: false, bounceEnabled: false, _bouncing: false, _bounceDir: null, _bounceOriginalSpeed: 0, inertiaScrollEnabled: false, _scrollViewEventListener: null, _scrollViewEventSelector: null, _className: "ScrollView", _eventCallback: null, ctor: function () {
        ccui.Layout.prototype.ctor.call(this);
        this.direction = ccui.ScrollView.DIR_NONE;
        this._autoScrollDir = cc.p(0, 0);
        this._topBoundary = 0;
        this._bottomBoundary = 0;
        this._leftBoundary = 0;
        this._rightBoundary =
            0;
        this._bounceTopBoundary = 0;
        this._bounceBottomBoundary = 0;
        this._bounceLeftBoundary = 0;
        this._bounceRightBoundary = 0;
        this._autoScroll = false;
        this._autoScrollAddUpTime = 0;
        this._autoScrollOriginalSpeed = 0;
        this._autoScrollAcceleration = -1E3;
        this._isAutoScrollSpeedAttenuated = false;
        this._needCheckAutoScrollDestination = false;
        this._autoScrollDestination = cc.p(0, 0);
        this._bePressed = false;
        this._slidTime = 0;
        this._moveChildPoint = cc.p(0, 0);
        this._childFocusCancelOffset = 5;
        this._leftBounceNeeded = false;
        this._topBounceNeeded =
            false;
        this._rightBounceNeeded = false;
        this._bottomBounceNeeded = false;
        this.bounceEnabled = false;
        this._bouncing = false;
        this._bounceDir = cc.p(0, 0);
        this._bounceOriginalSpeed = 0;
        this.inertiaScrollEnabled = true;
        this._scrollViewEventListener = null;
        this._scrollViewEventSelector = null
    }, init: function () {
        if (ccui.Layout.prototype.init.call(this)) {
            this.setClippingEnabled(true);
            this._innerContainer.setTouchEnabled(false);
            return true
        }
        return false
    }, onEnter: function () {
        ccui.Layout.prototype.onEnter.call(this);
        this.scheduleUpdate(true)
    },
    findNextFocusedWidget: function (direction, current) {
        if (this.getLayoutType() == ccui.Layout.LINEAR_VERTICAL || this.getLayoutType() == ccui.Layout.LINEAR_HORIZONTAL)return this._innerContainer.findNextFocusedWidget(direction, current); else return ccui.Widget.prototype.findNextFocusedWidget.call(this, direction, current)
    }, initRenderer: function () {
        ccui.Layout.prototype.initRenderer.call(this);
        this._innerContainer = ccui.Layout.create();
        this.addProtectedChild(this._innerContainer, 1, 1)
    }, onSizeChanged: function () {
        ccui.Layout.prototype.onSizeChanged.call(this);
        var locSize = this._contentSize;
        this._topBoundary = locSize.height;
        this._rightBoundary = locSize.width;
        var bounceBoundaryParameterX = locSize.width / 3;
        var bounceBoundaryParameterY = locSize.height / 3;
        this._bounceTopBoundary = locSize.height - bounceBoundaryParameterY;
        this._bounceBottomBoundary = bounceBoundaryParameterY;
        this._bounceLeftBoundary = bounceBoundaryParameterX;
        this._bounceRightBoundary = this._contentSize.width - bounceBoundaryParameterX;
        var innerSize = this._innerContainer.getContentSize();
        var orginInnerSizeWidth =
            innerSize.width;
        var orginInnerSizeHeight = innerSize.height;
        var innerSizeWidth = Math.max(orginInnerSizeWidth, locSize.width);
        var innerSizeHeight = Math.max(orginInnerSizeHeight, locSize.height);
        this._innerContainer.setContentSize(cc.size(innerSizeWidth, innerSizeHeight));
        this._innerContainer.setPosition(0, locSize.height - this._innerContainer.getContentSize().height)
    }, setInnerContainerSize: function (size) {
        var locSize = this._contentSize;
        var innerSizeWidth = locSize.width;
        var innerSizeHeight = locSize.height;
        var originalInnerSize =
            this._innerContainer.getContentSize();
        if (size.width < locSize.width)cc.log("Inner width \x3c\x3d scrollview width, it will be force sized!"); else innerSizeWidth = size.width;
        if (size.height < locSize.height)cc.log("Inner height \x3c\x3d scrollview height, it will be force sized!"); else innerSizeHeight = size.height;
        this._innerContainer.setSize(cc.size(innerSizeWidth, innerSizeHeight));
        var newInnerSize, offset;
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                newInnerSize = this._innerContainer.getContentSize();
                offset = originalInnerSize.height - newInnerSize.height;
                this.scrollChildren(0, offset);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                if (this._innerContainer.getRightBoundary() <= locSize.width) {
                    newInnerSize = this._innerContainer.getContentSize();
                    offset = originalInnerSize.width - newInnerSize.width;
                    this.scrollChildren(offset, 0)
                }
                break;
            case ccui.ScrollView.DIR_BOTH:
                newInnerSize = this._innerContainer.getContentSize();
                var offsetY = originalInnerSize.height - newInnerSize.height;
                var offsetX = 0;
                if (this._innerContainer.getRightBoundary() <=
                    locSize.width)offsetX = originalInnerSize.width - newInnerSize.width;
                this.scrollChildren(offsetX, offsetY);
                break;
            default:
                break
        }
        var innerContainer = this._innerContainer;
        var innerSize = innerContainer.getContentSize();
        var innerPos = innerContainer.getPosition();
        var innerAP = innerContainer.getAnchorPoint();
        if (innerContainer.getLeftBoundary() > 0)innerContainer.setPosition(innerAP.x * innerSize.width, innerPos.y);
        if (innerContainer.getRightBoundary() < locSize.width)innerContainer.setPosition(locSize.width - (1 - innerAP.x) *
            innerSize.width, innerPos.y);
        if (innerPos.y > 0)innerContainer.setPosition(innerPos.x, innerAP.y * innerSize.height);
        if (innerContainer.getTopBoundary() < locSize.height)innerContainer.setPosition(innerPos.x, locSize.height - (1 - innerAP.y) * innerSize.height)
    }, _setInnerWidth: function (width) {
        var locW = this._contentSize.width, innerWidth = locW, container = this._innerContainer, oldInnerWidth = container.width;
        if (width < locW)cc.log("Inner width \x3c\x3d scrollview width, it will be force sized!"); else innerWidth = width;
        container.width =
            innerWidth;
        switch (this.direction) {
            case ccui.ScrollView.DIR_HORIZONTAL:
            case ccui.ScrollView.DIR_BOTH:
                if (container.getRightBoundary() <= locW) {
                    var newInnerWidth = container.width;
                    var offset = oldInnerWidth - newInnerWidth;
                    this.scrollChildren(offset, 0)
                }
                break
        }
        var innerAX = container.anchorX;
        if (container.getLeftBoundary() > 0)container.x = innerAX * innerWidth;
        if (container.getRightBoundary() < locW)container.x = locW - (1 - innerAX) * innerWidth
    }, _setInnerHeight: function (height) {
        var locH = this._contentSize.height, innerHeight = locH,
            container = this._innerContainer, oldInnerHeight = container.height;
        if (height < locH)cc.log("Inner height \x3c\x3d scrollview height, it will be force sized!"); else innerHeight = height;
        container.height = innerHeight;
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
            case ccui.ScrollView.DIR_BOTH:
                var newInnerHeight = innerHeight;
                var offset = oldInnerHeight - newInnerHeight;
                this.scrollChildren(0, offset);
                break
        }
        var innerAY = container.anchorY;
        if (container.getLeftBoundary() > 0)container.y = innerAY * innerHeight;
        if (container.getRightBoundary() <
            locH)container.y = locH - (1 - innerAY) * innerHeight
    }, getInnerContainerSize: function () {
        return this._innerContainer.getContentSize()
    }, _getInnerWidth: function () {
        return this._innerContainer.width
    }, _getInnerHeight: function () {
        return this._innerContainer.height
    }, addChild: function (widget, zOrder, tag) {
        if (!widget)return false;
        zOrder = zOrder || widget.getLocalZOrder();
        tag = tag || widget.getTag();
        return this._innerContainer.addChild(widget, zOrder, tag)
    }, removeAllChildren: function () {
        this.removeAllChildrenWithCleanup(true)
    },
    removeAllChildrenWithCleanup: function (cleanup) {
        this._innerContainer.removeAllChildrenWithCleanup(cleanup)
    }, removeChild: function (child, cleanup) {
        return this._innerContainer.removeChild(child, cleanup)
    }, getChildren: function () {
        return this._innerContainer.getChildren()
    }, getChildrenCount: function () {
        return this._innerContainer.getChildrenCount()
    }, getChildByTag: function (tag) {
        return this._innerContainer.getChildByTag(tag)
    }, getChildByName: function (name) {
        return this._innerContainer.getChildByName(name)
    }, addNode: function (node, zOrder, tag) {
        this._innerContainer.addNode(node, zOrder, tag)
    }, getNodeByTag: function (tag) {
        return this._innerContainer.getNodeByTag(tag)
    }, getNodes: function () {
        return this._innerContainer.getNodes()
    }, removeNode: function (node) {
        this._innerContainer.removeNode(node)
    }, removeNodeByTag: function (tag) {
        this._innerContainer.removeNodeByTag(tag)
    }, removeAllNodes: function () {
        this._innerContainer.removeAllNodes()
    }, moveChildren: function (offsetX, offsetY) {
        var pos = this._innerContainer.getPosition();
        this._moveChildPoint.x =
            pos.x + offsetX;
        this._moveChildPoint.y = pos.y + offsetY;
        this._innerContainer.setPosition(this._moveChildPoint)
    }, autoScrollChildren: function (dt) {
        var lastTime = this._autoScrollAddUpTime;
        this._autoScrollAddUpTime += dt;
        if (this._isAutoScrollSpeedAttenuated) {
            var nowSpeed = this._autoScrollOriginalSpeed + this._autoScrollAcceleration * this._autoScrollAddUpTime;
            if (nowSpeed <= 0) {
                this.stopAutoScrollChildren();
                this.checkNeedBounce()
            } else {
                var timeParam = lastTime * 2 + dt;
                var offset = (this._autoScrollOriginalSpeed + this._autoScrollAcceleration *
                    timeParam * 0.5) * dt;
                var offsetX = offset * this._autoScrollDir.x;
                var offsetY = offset * this._autoScrollDir.y;
                if (!this.scrollChildren(offsetX, offsetY)) {
                    this.stopAutoScrollChildren();
                    this.checkNeedBounce()
                }
            }
        } else if (this._needCheckAutoScrollDestination) {
            var xOffset = this._autoScrollDir.x * dt * this._autoScrollOriginalSpeed;
            var yOffset = this._autoScrollDir.y * dt * this._autoScrollOriginalSpeed;
            var notDone = this.checkCustomScrollDestination(xOffset, yOffset);
            var scrollCheck = this.scrollChildren(xOffset, yOffset);
            if (!notDone || !scrollCheck) {
                this.stopAutoScrollChildren();
                this.checkNeedBounce()
            }
        } else if (!this.scrollChildren(this._autoScrollDir.x * dt * this._autoScrollOriginalSpeed, this._autoScrollDir.y * dt * this._autoScrollOriginalSpeed)) {
            this.stopAutoScrollChildren();
            this.checkNeedBounce()
        }
    }, bounceChildren: function (dt) {
        var locSpeed = this._bounceOriginalSpeed;
        var locBounceDir = this._bounceDir;
        if (locSpeed <= 0)this.stopBounceChildren();
        if (!this.bounceScrollChildren(locBounceDir.x * dt * locSpeed, locBounceDir.y * dt * locSpeed))this.stopBounceChildren()
    },
    checkNeedBounce: function () {
        if (!this.bounceEnabled)return false;
        this.checkBounceBoundary();
        if (this._topBounceNeeded || this._bottomBounceNeeded || this._leftBounceNeeded || this._rightBounceNeeded) {
            var scrollVector, orSpeed;
            if (this._topBounceNeeded && this._leftBounceNeeded) {
                scrollVector = cc.pSub(cc.p(0, this._contentSize.height), cc.p(this._innerContainer.getLeftBoundary(), this._innerContainer.getTopBoundary()));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this.startBounceChildren(orSpeed)
            } else if (this._topBounceNeeded &&
                this._rightBounceNeeded) {
                scrollVector = cc.pSub(cc.p(this._contentSize.width, this._contentSize.height), cc.p(this._innerContainer.getRightBoundary(), this._innerContainer.getTopBoundary()));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this.startBounceChildren(orSpeed)
            } else if (this._bottomBounceNeeded && this._leftBounceNeeded) {
                scrollVector = cc.pSub(cc.p(0, 0), cc.p(this._innerContainer.getLeftBoundary(), this._innerContainer.getBottomBoundary()));
                orSpeed = cc.pLength(scrollVector) /
                    0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this.startBounceChildren(orSpeed)
            } else if (this._bottomBounceNeeded && this._rightBounceNeeded) {
                scrollVector = cc.pSub(cc.p(this._contentSize.width, 0), cc.p(this._innerContainer.getRightBoundary(), this._innerContainer.getBottomBoundary()));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this.startBounceChildren(orSpeed)
            } else if (this._topBounceNeeded) {
                scrollVector = cc.pSub(cc.p(0, this._contentSize.height), cc.p(0, this._innerContainer.getTopBoundary()));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this.startBounceChildren(orSpeed)
            } else if (this._bottomBounceNeeded) {
                scrollVector = cc.pSub(cc.p(0, 0), cc.p(0, this._innerContainer.getBottomBoundary()));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this.startBounceChildren(orSpeed)
            } else if (this._leftBounceNeeded) {
                scrollVector = cc.pSub(cc.p(0, 0), cc.p(this._innerContainer.getLeftBoundary(), 0));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir =
                    cc.pNormalize(scrollVector);
                this.startBounceChildren(orSpeed)
            } else if (this._rightBounceNeeded) {
                scrollVector = cc.pSub(cc.p(this._contentSize.width, 0), cc.p(this._innerContainer.getRightBoundary(), 0));
                orSpeed = cc.pLength(scrollVector) / 0.2;
                this._bounceDir = cc.pNormalize(scrollVector);
                this.startBounceChildren(orSpeed)
            }
            return true
        }
        return false
    }, checkBounceBoundary: function () {
        var icBottomPos = this._innerContainer.getBottomBoundary();
        if (icBottomPos > this._bottomBoundary) {
            this.scrollToBottomEvent();
            this._bottomBounceNeeded =
                true
        } else this._bottomBounceNeeded = false;
        var icTopPos = this._innerContainer.getTopBoundary();
        if (icTopPos < this._topBoundary) {
            this.scrollToTopEvent();
            this._topBounceNeeded = true
        } else this._topBounceNeeded = false;
        var icRightPos = this._innerContainer.getRightBoundary();
        if (icRightPos < this._rightBoundary) {
            this.scrollToRightEvent();
            this._rightBounceNeeded = true
        } else this._rightBounceNeeded = false;
        var icLeftPos = this._innerContainer.getLeftBoundary();
        if (icLeftPos > this._leftBoundary) {
            this.scrollToLeftEvent();
            this._leftBounceNeeded =
                true
        } else this._leftBounceNeeded = false
    }, startBounceChildren: function (v) {
        this._bounceOriginalSpeed = v;
        this._bouncing = true
    }, stopBounceChildren: function () {
        this._bouncing = false;
        this._bounceOriginalSpeed = 0;
        this._leftBounceNeeded = false;
        this._rightBounceNeeded = false;
        this._topBounceNeeded = false;
        this._bottomBounceNeeded = false
    }, startAutoScrollChildrenWithOriginalSpeed: function (dir, v, attenuated, acceleration) {
        this.stopAutoScrollChildren();
        this._autoScrollDir = dir;
        this._isAutoScrollSpeedAttenuated = attenuated;
        this._autoScrollOriginalSpeed =
            v;
        this._autoScroll = true;
        this._autoScrollAcceleration = acceleration
    }, startAutoScrollChildrenWithDestination: function (des, time, attenuated) {
        this._needCheckAutoScrollDestination = false;
        this._autoScrollDestination = des;
        var dis = cc.pSub(des, this._innerContainer.getPosition());
        var dir = cc.pNormalize(dis);
        var orSpeed = 0;
        var acceleration = -1E3;
        var disLength = cc.pLength(dis);
        if (attenuated) {
            acceleration = -(2 * disLength) / (time * time);
            orSpeed = 2 * disLength / time
        } else {
            this._needCheckAutoScrollDestination = true;
            orSpeed = disLength /
                time
        }
        this.startAutoScrollChildrenWithOriginalSpeed(dir, orSpeed, attenuated, acceleration)
    }, jumpToDestination: function (dstX, dstY) {
        if (dstX.x !== undefined) {
            dstY = dstX.y;
            dstX = dstX.x
        }
        var finalOffsetX = dstX;
        var finalOffsetY = dstY;
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                if (dstY <= 0)finalOffsetY = Math.max(dstY, this._contentSize.height - this._innerContainer.getContentSize().height);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                if (dstX <= 0)finalOffsetX = Math.max(dstX, this._contentSize.width - this._innerContainer.getContentSize().width);
                break;
            case ccui.ScrollView.DIR_BOTH:
                if (dstY <= 0)finalOffsetY = Math.max(dstY, this._contentSize.height - this._innerContainer.getContentSize().height);
                if (dstX <= 0)finalOffsetX = Math.max(dstX, this._contentSize.width - this._innerContainer.getContentSize().width);
                break;
            default:
                break
        }
        this._innerContainer.setPosition(finalOffsetX, finalOffsetY)
    }, stopAutoScrollChildren: function () {
        this._autoScroll = false;
        this._autoScrollOriginalSpeed = 0;
        this._autoScrollAddUpTime = 0
    }, bounceScrollChildren: function (touchOffsetX, touchOffsetY) {
        var scrollEnabled =
            true;
        var realOffsetX, realOffsetY, icRightPos, icTopPos, icBottomPos;
        if (touchOffsetX > 0 && touchOffsetY > 0) {
            realOffsetX = touchOffsetX;
            realOffsetY = touchOffsetY;
            icRightPos = this._innerContainer.getRightBoundary();
            if (icRightPos + realOffsetX >= this._rightBoundary) {
                realOffsetX = this._rightBoundary - icRightPos;
                this.bounceRightEvent();
                scrollEnabled = false
            }
            icTopPos = this._innerContainer.getTopBoundary();
            if (icTopPos + touchOffsetY >= this._topBoundary) {
                realOffsetY = this._topBoundary - icTopPos;
                this.bounceTopEvent();
                scrollEnabled =
                    false
            }
            this.moveChildren(realOffsetX, realOffsetY)
        } else if (touchOffsetX < 0 && touchOffsetY > 0) {
            realOffsetX = touchOffsetX;
            realOffsetY = touchOffsetY;
            icLefrPos = this._innerContainer.getLeftBoundary();
            if (icLefrPos + realOffsetX <= this._leftBoundary) {
                realOffsetX = this._leftBoundary - icLefrPos;
                this.bounceLeftEvent();
                scrollEnabled = false
            }
            icTopPos = this._innerContainer.getTopBoundary();
            if (icTopPos + touchOffsetY >= this._topBoundary) {
                realOffsetY = this._topBoundary - icTopPos;
                this.bounceTopEvent();
                scrollEnabled = false
            }
            this.moveChildren(realOffsetX,
                realOffsetY)
        } else if (touchOffsetX < 0 && touchOffsetY < 0) {
            realOffsetX = touchOffsetX;
            realOffsetY = touchOffsetY;
            var icLefrPos = this._innerContainer.getLeftBoundary();
            if (icLefrPos + realOffsetX <= this._leftBoundary) {
                realOffsetX = this._leftBoundary - icLefrPos;
                this.bounceLeftEvent();
                scrollEnabled = false
            }
            icBottomPos = this._innerContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY <= this._bottomBoundary) {
                realOffsetY = this._bottomBoundary - icBottomPos;
                this.bounceBottomEvent();
                scrollEnabled = false
            }
            this.moveChildren(realOffsetX,
                realOffsetY)
        } else if (touchOffsetX > 0 && touchOffsetY < 0) {
            realOffsetX = touchOffsetX;
            realOffsetY = touchOffsetY;
            icRightPos = this._innerContainer.getRightBoundary();
            if (icRightPos + realOffsetX >= this._rightBoundary) {
                realOffsetX = this._rightBoundary - icRightPos;
                this.bounceRightEvent();
                scrollEnabled = false
            }
            icBottomPos = this._innerContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY <= this._bottomBoundary) {
                realOffsetY = this._bottomBoundary - icBottomPos;
                this.bounceBottomEvent();
                scrollEnabled = false
            }
            this.moveChildren(realOffsetX,
                realOffsetY)
        } else if (touchOffsetX == 0 && touchOffsetY > 0) {
            realOffsetY = touchOffsetY;
            icTopPos = this._innerContainer.getTopBoundary();
            if (icTopPos + touchOffsetY >= this._topBoundary) {
                realOffsetY = this._topBoundary - icTopPos;
                this.bounceTopEvent();
                scrollEnabled = false
            }
            this.moveChildren(0, realOffsetY)
        } else if (touchOffsetX == 0 && touchOffsetY < 0) {
            realOffsetY = touchOffsetY;
            icBottomPos = this._innerContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY <= this._bottomBoundary) {
                realOffsetY = this._bottomBoundary - icBottomPos;
                this.bounceBottomEvent();
                scrollEnabled = false
            }
            this.moveChildren(0, realOffsetY)
        } else if (touchOffsetX > 0 && touchOffsetY == 0) {
            realOffsetX = touchOffsetX;
            icRightPos = this._innerContainer.getRightBoundary();
            if (icRightPos + realOffsetX >= this._rightBoundary) {
                realOffsetX = this._rightBoundary - icRightPos;
                this.bounceRightEvent();
                scrollEnabled = false
            }
            this.moveChildren(realOffsetX, 0)
        } else if (touchOffsetX < 0 && touchOffsetY == 0) {
            realOffsetX = touchOffsetX;
            var icLeftPos = this._innerContainer.getLeftBoundary();
            if (icLeftPos + realOffsetX <= this._leftBoundary) {
                realOffsetX =
                    this._leftBoundary - icLeftPos;
                this.bounceLeftEvent();
                scrollEnabled = false
            }
            this.moveChildren(realOffsetX, 0)
        }
        return scrollEnabled
    }, checkCustomScrollDestination: function (touchOffsetX, touchOffsetY) {
        var scrollEnabled = true;
        var icBottomPos, icLeftPos, icRightPos, icTopPos;
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                if (this._autoScrollDir.y > 0) {
                    icBottomPos = this._innerContainer.getBottomBoundary();
                    if (icBottomPos + touchOffsetY >= this._autoScrollDestination.y) {
                        touchOffsetY = this._autoScrollDestination.y -
                            icBottomPos;
                        scrollEnabled = false
                    }
                } else {
                    icBottomPos = this._innerContainer.getBottomBoundary();
                    if (icBottomPos + touchOffsetY <= this._autoScrollDestination.y) {
                        touchOffsetY = this._autoScrollDestination.y - icBottomPos;
                        scrollEnabled = false
                    }
                }
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                if (this._autoScrollDir.x > 0) {
                    icLeftPos = this._innerContainer.getLeftBoundary();
                    if (icLeftPos + touchOffsetX >= this._autoScrollDestination.x) {
                        touchOffsetX = this._autoScrollDestination.x - icLeftPos;
                        scrollEnabled = false
                    }
                } else {
                    icLeftPos = this._innerContainer.getLeftBoundary();
                    if (icLeftPos + touchOffsetX <= this._autoScrollDestination.x) {
                        touchOffsetX = this._autoScrollDestination.x - icLeftPos;
                        scrollEnabled = false
                    }
                }
                break;
            case ccui.ScrollView.DIR_BOTH:
                if (touchOffsetX > 0 && touchOffsetY > 0) {
                    icLeftPos = this._innerContainer.getLeftBoundary();
                    if (icLeftPos + touchOffsetX >= this._autoScrollDestination.x) {
                        touchOffsetX = this._autoScrollDestination.x - icLeftPos;
                        scrollEnabled = false
                    }
                    icBottomPos = this._innerContainer.getBottomBoundary();
                    if (icBottomPos + touchOffsetY >= this._autoScrollDestination.y) {
                        touchOffsetY =
                            this._autoScrollDestination.y - icBottomPos;
                        scrollEnabled = false
                    }
                } else if (touchOffsetX < 0 && touchOffsetY > 0) {
                    icRightPos = this._innerContainer.getRightBoundary();
                    if (icRightPos + touchOffsetX <= this._autoScrollDestination.x) {
                        touchOffsetX = this._autoScrollDestination.x - icRightPos;
                        scrollEnabled = false
                    }
                    icBottomPos = this._innerContainer.getBottomBoundary();
                    if (icBottomPos + touchOffsetY >= this._autoScrollDestination.y) {
                        touchOffsetY = this._autoScrollDestination.y - icBottomPos;
                        scrollEnabled = false
                    }
                } else if (touchOffsetX < 0 && touchOffsetY <
                    0) {
                    icRightPos = this._innerContainer.getRightBoundary();
                    if (icRightPos + touchOffsetX <= this._autoScrollDestination.x) {
                        touchOffsetX = this._autoScrollDestination.x - icRightPos;
                        scrollEnabled = false
                    }
                    icTopPos = this._innerContainer.getTopBoundary();
                    if (icTopPos + touchOffsetY <= this._autoScrollDestination.y) {
                        touchOffsetY = this._autoScrollDestination.y - icTopPos;
                        scrollEnabled = false
                    }
                } else if (touchOffsetX > 0 && touchOffsetY < 0) {
                    icLeftPos = this._innerContainer.getLeftBoundary();
                    if (icLeftPos + touchOffsetX >= this._autoScrollDestination.x) {
                        touchOffsetX =
                            this._autoScrollDestination.x - icLeftPos;
                        scrollEnabled = false
                    }
                    icTopPos = this._innerContainer.getTopBoundary();
                    if (icTopPos + touchOffsetY <= this._autoScrollDestination.y) {
                        touchOffsetY = this._autoScrollDestination.y - icTopPos;
                        scrollEnabled = false
                    }
                } else if (touchOffsetX == 0 && touchOffsetY > 0) {
                    icBottomPos = this._innerContainer.getBottomBoundary();
                    if (icBottomPos + touchOffsetY >= this._autoScrollDestination.y) {
                        touchOffsetY = this._autoScrollDestination.y - icBottomPos;
                        scrollEnabled = false
                    }
                } else if (touchOffsetX < 0 && touchOffsetY ==
                    0) {
                    icRightPos = this._innerContainer.getRightBoundary();
                    if (icRightPos + touchOffsetX <= this._autoScrollDestination.x) {
                        touchOffsetX = this._autoScrollDestination.x - icRightPos;
                        scrollEnabled = false
                    }
                } else if (touchOffsetX == 0 && touchOffsetY < 0) {
                    icTopPos = this._innerContainer.getTopBoundary();
                    if (icTopPos + touchOffsetY <= this._autoScrollDestination.y) {
                        touchOffsetY = this._autoScrollDestination.y - icTopPos;
                        scrollEnabled = false
                    }
                } else if (touchOffsetX > 0 && touchOffsetY == 0) {
                    icLeftPos = this._innerContainer.getLeftBoundary();
                    if (icLeftPos +
                        touchOffsetX >= this._autoScrollDestination.x) {
                        touchOffsetX = this._autoScrollDestination.x - icLeftPos;
                        scrollEnabled = false
                    }
                }
                break;
            default:
                break
        }
        return scrollEnabled
    }, getCurAutoScrollDistance: function (dt) {
        this._autoScrollOriginalSpeed -= this._autoScrollAcceleration * dt;
        return this._autoScrollOriginalSpeed * dt
    }, scrollChildren: function (touchOffsetX, touchOffsetY) {
        var scrollEnabled = true;
        this.scrollingEvent();
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                scrollEnabled = this.scrollChildrenVertical(touchOffsetX,
                    touchOffsetY);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                scrollEnabled = this.scrollChildrenHorizontal(touchOffsetX, touchOffsetY);
                break;
            case ccui.ScrollView.DIR_BOTH:
                scrollEnabled = this.scrollChildrenBoth(touchOffsetX, touchOffsetY);
                break;
            default:
                break
        }
        return scrollEnabled
    }, scrollChildrenVertical: function (touchOffsetX, touchOffsetY) {
        var realOffset = touchOffsetY;
        var scrollEnabled = true;
        var icBottomPos, icTopPos;
        if (this.bounceEnabled) {
            icBottomPos = this._innerContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY >=
                this._bounceBottomBoundary) {
                realOffset = this._bounceBottomBoundary - icBottomPos;
                this.scrollToBottomEvent();
                scrollEnabled = false
            }
            icTopPos = this._innerContainer.getTopBoundary();
            if (icTopPos + touchOffsetY <= this._bounceTopBoundary) {
                realOffset = this._bounceTopBoundary - icTopPos;
                this.scrollToTopEvent();
                scrollEnabled = false
            }
        } else {
            icBottomPos = this._innerContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY >= this._bottomBoundary) {
                realOffset = this._bottomBoundary - icBottomPos;
                this.scrollToBottomEvent();
                scrollEnabled =
                    false
            }
            icTopPos = this._innerContainer.getTopBoundary();
            if (icTopPos + touchOffsetY <= this._topBoundary) {
                realOffset = this._topBoundary - icTopPos;
                this.scrollToTopEvent();
                scrollEnabled = false
            }
        }
        this.moveChildren(0, realOffset);
        return scrollEnabled
    }, scrollChildrenHorizontal: function (touchOffsetX, touchOffestY) {
        var scrollEnabled = true;
        var realOffset = touchOffsetX;
        var icRightPos, icLeftPos;
        if (this.bounceEnabled) {
            icRightPos = this._innerContainer.getRightBoundary();
            if (icRightPos + touchOffsetX <= this._bounceRightBoundary) {
                realOffset =
                    this._bounceRightBoundary - icRightPos;
                this.scrollToRightEvent();
                scrollEnabled = false
            }
            icLeftPos = this._innerContainer.getLeftBoundary();
            if (icLeftPos + touchOffsetX >= this._bounceLeftBoundary) {
                realOffset = this._bounceLeftBoundary - icLeftPos;
                this.scrollToLeftEvent();
                scrollEnabled = false
            }
        } else {
            icRightPos = this._innerContainer.getRightBoundary();
            if (icRightPos + touchOffsetX <= this._rightBoundary) {
                realOffset = this._rightBoundary - icRightPos;
                this.scrollToRightEvent();
                scrollEnabled = false
            }
            icLeftPos = this._innerContainer.getLeftBoundary();
            if (icLeftPos + touchOffsetX >= this._leftBoundary) {
                realOffset = this._leftBoundary - icLeftPos;
                this.scrollToLeftEvent();
                scrollEnabled = false
            }
        }
        this.moveChildren(realOffset, 0);
        return scrollEnabled
    }, scrollChildrenBoth: function (touchOffsetX, touchOffsetY) {
        var scrollEnabled = true;
        var realOffsetX = touchOffsetX;
        var realOffsetY = touchOffsetY;
        var icLeftPos, icBottomPos, icRightPos, icTopPos;
        if (this.bounceEnabled)if (touchOffsetX > 0 && touchOffsetY > 0) {
            icLeftPos = this._innerContainer.getLeftBoundary();
            if (icLeftPos + touchOffsetX >=
                this._bounceLeftBoundary) {
                realOffsetX = this._bounceLeftBoundary - icLeftPos;
                this.scrollToLeftEvent();
                scrollEnabled = false
            }
            icBottomPos = this._innerContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY >= this._bounceBottomBoundary) {
                realOffsetY = this._bounceBottomBoundary - icBottomPos;
                this.scrollToBottomEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX < 0 && touchOffsetY > 0) {
            icRightPos = this._innerContainer.getRightBoundary();
            if (icRightPos + touchOffsetX <= this._bounceRightBoundary) {
                realOffsetX = this._bounceRightBoundary -
                    icRightPos;
                this.scrollToRightEvent();
                scrollEnabled = false
            }
            icBottomPos = this._innerContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY >= this._bounceBottomBoundary) {
                realOffsetY = this._bounceBottomBoundary - icBottomPos;
                this.scrollToBottomEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX < 0 && touchOffsetY < 0) {
            icRightPos = this._innerContainer.getRightBoundary();
            if (icRightPos + touchOffsetX <= this._bounceRightBoundary) {
                realOffsetX = this._bounceRightBoundary - icRightPos;
                this.scrollToRightEvent();
                scrollEnabled =
                    false
            }
            icTopPos = this._innerContainer.getTopBoundary();
            if (icTopPos + touchOffsetY <= this._bounceTopBoundary) {
                realOffsetY = this._bounceTopBoundary - icTopPos;
                this.scrollToTopEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX > 0 && touchOffsetY < 0) {
            icLeftPos = this._innerContainer.getLeftBoundary();
            if (icLeftPos + touchOffsetX >= this._bounceLeftBoundary) {
                realOffsetX = this._bounceLeftBoundary - icLeftPos;
                this.scrollToLeftEvent();
                scrollEnabled = false
            }
            icTopPos = this._innerContainer.getTopBoundary();
            if (icTopPos + touchOffsetY <=
                this._bounceTopBoundary) {
                realOffsetY = this._bounceTopBoundary - icTopPos;
                this.scrollToTopEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX == 0 && touchOffsetY > 0) {
            icBottomPos = this._innerContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY >= this._bounceBottomBoundary) {
                realOffsetY = this._bounceBottomBoundary - icBottomPos;
                this.scrollToBottomEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX < 0 && touchOffsetY == 0) {
            icRightPos = this._innerContainer.getRightBoundary();
            if (icRightPos + touchOffsetX <= this._bounceRightBoundary) {
                realOffsetX =
                    this._bounceRightBoundary - icRightPos;
                this.scrollToRightEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX == 0 && touchOffsetY < 0) {
            icTopPos = this._innerContainer.getTopBoundary();
            if (icTopPos + touchOffsetY <= this._bounceTopBoundary) {
                realOffsetY = this._bounceTopBoundary - icTopPos;
                this.scrollToTopEvent();
                scrollEnabled = false
            }
        } else {
            if (touchOffsetX > 0 && touchOffsetY == 0) {
                icLeftPos = this._innerContainer.getLeftBoundary();
                if (icLeftPos + touchOffsetX >= this._bounceLeftBoundary) {
                    realOffsetX = this._bounceLeftBoundary - icLeftPos;
                    this.scrollToLeftEvent();
                    scrollEnabled = false
                }
            }
        } else if (touchOffsetX > 0 && touchOffsetY > 0) {
            icLeftPos = this._innerContainer.getLeftBoundary();
            if (icLeftPos + touchOffsetX >= this._leftBoundary) {
                realOffsetX = this._leftBoundary - icLeftPos;
                this.scrollToLeftEvent();
                scrollEnabled = false
            }
            icBottomPos = this._innerContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY >= this._bottomBoundary) {
                realOffsetY = this._bottomBoundary - icBottomPos;
                this.scrollToBottomEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX < 0 && touchOffsetY >
            0) {
            icRightPos = this._innerContainer.getRightBoundary();
            if (icRightPos + touchOffsetX <= this._rightBoundary) {
                realOffsetX = this._rightBoundary - icRightPos;
                this.scrollToRightEvent();
                scrollEnabled = false
            }
            icBottomPos = this._innerContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY >= this._bottomBoundary) {
                realOffsetY = this._bottomBoundary - icBottomPos;
                this.scrollToBottomEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX < 0 && touchOffsetY < 0) {
            icRightPos = this._innerContainer.getRightBoundary();
            if (icRightPos + touchOffsetX <=
                this._rightBoundary) {
                realOffsetX = this._rightBoundary - icRightPos;
                this.scrollToRightEvent();
                scrollEnabled = false
            }
            icTopPos = this._innerContainer.getTopBoundary();
            if (icTopPos + touchOffsetY <= this._topBoundary) {
                realOffsetY = this._topBoundary - icTopPos;
                this.scrollToTopEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX > 0 && touchOffsetY < 0) {
            icLeftPos = this._innerContainer.getLeftBoundary();
            if (icLeftPos + touchOffsetX >= this._leftBoundary) {
                realOffsetX = this._leftBoundary - icLeftPos;
                this.scrollToLeftEvent();
                scrollEnabled =
                    false
            }
            icTopPos = this._innerContainer.getTopBoundary();
            if (icTopPos + touchOffsetY <= this._topBoundary) {
                realOffsetY = this._topBoundary - icTopPos;
                this.scrollToTopEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX == 0 && touchOffsetY > 0) {
            icBottomPos = this._innerContainer.getBottomBoundary();
            if (icBottomPos + touchOffsetY >= this._bottomBoundary) {
                realOffsetY = this._bottomBoundary - icBottomPos;
                this.scrollToBottomEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX < 0 && touchOffsetY == 0) {
            icRightPos = this._innerContainer.getRightBoundary();
            if (icRightPos + touchOffsetX <= this._rightBoundary) {
                realOffsetX = this._rightBoundary - icRightPos;
                this.scrollToRightEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX == 0 && touchOffsetY < 0) {
            icTopPos = this._innerContainer.getTopBoundary();
            if (icTopPos + touchOffsetY <= this._topBoundary) {
                realOffsetY = this._topBoundary - icTopPos;
                this.scrollToTopEvent();
                scrollEnabled = false
            }
        } else if (touchOffsetX > 0 && touchOffsetY == 0) {
            icLeftPos = this._innerContainer.getLeftBoundary();
            if (icLeftPos + touchOffsetX >= this._leftBoundary) {
                realOffsetX =
                    this._leftBoundary - icLeftPos;
                this.scrollToLeftEvent();
                scrollEnabled = false
            }
        }
        this.moveChildren(realOffsetX, realOffsetY);
        return scrollEnabled
    }, scrollToBottom: function (time, attenuated) {
        this.startAutoScrollChildrenWithDestination(cc.p(this._innerContainer.getPositionX(), 0), time, attenuated)
    }, scrollToTop: function (time, attenuated) {
        this.startAutoScrollChildrenWithDestination(cc.p(this._innerContainer.getPositionX(), this._contentSize.height - this._innerContainer.getContentSize().height), time, attenuated)
    }, scrollToLeft: function (time, attenuated) {
        this.startAutoScrollChildrenWithDestination(cc.p(0, this._innerContainer.getPositionY()), time, attenuated)
    }, scrollToRight: function (time, attenuated) {
        this.startAutoScrollChildrenWithDestination(cc.p(this._contentSize.width - this._innerContainer.getContentSize().width, this._innerContainer.getPositionY()), time, attenuated)
    }, scrollToTopLeft: function (time, attenuated) {
        if (this.direction != ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return
        }
        this.startAutoScrollChildrenWithDestination(cc.p(0,
                this._contentSize.height - this._innerContainer.getContentSize().height), time, attenuated)
    }, scrollToTopRight: function (time, attenuated) {
        if (this.direction != ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return
        }
        var inSize = this._innerContainer.getContentSize();
        this.startAutoScrollChildrenWithDestination(cc.p(this._contentSize.width - inSize.width, this._contentSize.height - inSize.height), time, attenuated)
    }, scrollToBottomLeft: function (time, attenuated) {
        if (this.direction != ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return
        }
        this.startAutoScrollChildrenWithDestination(cc.p(0, 0), time, attenuated)
    }, scrollToBottomRight: function (time, attenuated) {
        if (this.direction != ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return
        }
        this.startAutoScrollChildrenWithDestination(cc.p(this._contentSize.width - this._innerContainer.getContentSize().width, 0), time, attenuated)
    }, scrollToPercentVertical: function (percent, time, attenuated) {
        var minY = this._contentSize.height - this._innerContainer.getContentSize().height;
        var h = -minY;
        this.startAutoScrollChildrenWithDestination(cc.p(this._innerContainer.getPositionX(), minY + percent * h / 100), time, attenuated)
    }, scrollToPercentHorizontal: function (percent, time, attenuated) {
        var w = this._innerContainer.getContentSize().width - this._contentSize.width;
        this.startAutoScrollChildrenWithDestination(cc.p(-(percent * w / 100), this._innerContainer.getPositionY()), time, attenuated)
    }, scrollToPercentBothDirection: function (percent, time, attenuated) {
        if (this.direction != ccui.ScrollView.DIR_BOTH)return;
        var minY =
            this._contentSize.height - this._innerContainer.getContentSize().height;
        var h = -minY;
        var w = this._innerContainer.getContentSize().width - this._contentSize.width;
        this.startAutoScrollChildrenWithDestination(cc.p(-(percent.x * w / 100), minY + percent.y * h / 100), time, attenuated)
    }, jumpToBottom: function () {
        this.jumpToDestination(this._innerContainer.getPositionX(), 0)
    }, jumpToTop: function () {
        this.jumpToDestination(this._innerContainer.getPositionX(), this._contentSize.height - this._innerContainer.getContentSize().height)
    },
    jumpToLeft: function () {
        this.jumpToDestination(0, this._innerContainer.getPositionY())
    }, jumpToRight: function () {
        this.jumpToDestination(this._contentSize.width - this._innerContainer.getContentSize().width, this._innerContainer.getPositionY())
    }, jumpToTopLeft: function () {
        if (this.direction != ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return
        }
        this.jumpToDestination(0, this._contentSize.height - this._innerContainer.getContentSize().height)
    }, jumpToTopRight: function () {
        if (this.direction != ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return
        }
        var inSize = this._innerContainer.getContentSize();
        this.jumpToDestination(this._contentSize.width - inSize.width, this._contentSize.height - inSize.height)
    }, jumpToBottomLeft: function () {
        if (this.direction != ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return
        }
        this.jumpToDestination(0, 0)
    }, jumpToBottomRight: function () {
        if (this.direction != ccui.ScrollView.DIR_BOTH) {
            cc.log("Scroll direction is not both!");
            return
        }
        this.jumpToDestination(this._contentSize.width - this._innerContainer.getContentSize().width,
            0)
    }, jumpToPercentVertical: function (percent) {
        var minY = this._contentSize.height - this._innerContainer.getContentSize().height;
        var h = -minY;
        this.jumpToDestination(this._innerContainer.getPositionX(), minY + percent * h / 100)
    }, jumpToPercentHorizontal: function (percent) {
        var w = this._innerContainer.getContentSize().width - this._contentSize.width;
        this.jumpToDestination(-(percent * w / 100), this._innerContainer.getPositionY())
    }, jumpToPercentBothDirection: function (percent) {
        if (this.direction != ccui.ScrollView.DIR_BOTH)return;
        var inSize = this._innerContainer.getContentSize();
        var minY = this._contentSize.height - inSize.height;
        var h = -minY;
        var w = inSize.width - this._contentSize.width;
        this.jumpToDestination(-(percent.x * w / 100), minY + percent.y * h / 100)
    }, startRecordSlidAction: function () {
        if (this._autoScroll)this.stopAutoScrollChildren();
        if (this._bouncing)this.stopBounceChildren();
        this._slidTime = 0
    }, endRecordSlidAction: function () {
        if (!this.checkNeedBounce() && this.inertiaScrollEnabled) {
            if (this._slidTime <= 0.016)return;
            var totalDis = 0;
            var dir;
            switch (this.direction) {
                case ccui.ScrollView.DIR_VERTICAL:
                    totalDis = this._touchEndPosition.y - this._touchBeganPosition.y;
                    dir = totalDis < 0 ? ccui.ScrollView.SCROLLDIR_DOWN : ccui.ScrollView.SCROLLDIR_UP;
                    break;
                case ccui.ScrollView.DIR_HORIZONTAL:
                    totalDis = this._touchEndPosition.x - this._touchBeganPosition.x;
                    dir = totalDis < 0 ? ccui.ScrollView.SCROLLDIR_LEFT : ccui.ScrollView.SCROLLDIR_RIGHT;
                    break;
                case ccui.ScrollView.DIR_BOTH:
                    var subVector = cc.pSub(this._touchEndPosition, this._touchBeganPosition);
                    totalDis = cc.pLength(subVector);
                    dir = cc.pNormalize(subVector);
                    break;
                default:
                    break
            }
            var orSpeed = Math.min(Math.abs(totalDis) / this._slidTime, ccui.ScrollView.AUTO_SCROLL_MAX_SPEED);
            this.startAutoScrollChildrenWithOriginalSpeed(dir, orSpeed, true, -1E3);
            this._slidTime = 0
        }
    }, handlePressLogic: function (touch) {
        this.startRecordSlidAction();
        this._bePressed = true
    }, handleMoveLogic: function (touch) {
        var delta = cc.pSub(touch.getLocation(), touch.getPreviousLocation());
        switch (this.direction) {
            case ccui.ScrollView.DIR_VERTICAL:
                this.scrollChildren(0, delta.y);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                this.scrollChildren(delta.x, 0);
                break;
            case ccui.ScrollView.DIR_BOTH:
                this.scrollChildren(delta.x, delta.y);
                break;
            default:
                break
        }
    }, handleReleaseLogic: function (touch) {
        this.endRecordSlidAction();
        this._bePressed = false
    }, onTouchBegan: function (touch, event) {
        var pass = ccui.Layout.prototype.onTouchBegan.call(this, touch, event);
        if (this._hitted)this.handlePressLogic(touch);
        return pass
    }, onTouchMoved: function (touch, event) {
        ccui.Layout.prototype.onTouchMoved.call(this, touch, event);
        this.handleMoveLogic(touch)
    }, onTouchEnded: function (touch, event) {
        ccui.Layout.prototype.onTouchEnded.call(this, touch, event);
        this.handleReleaseLogic(touch)
    }, onTouchCancelled: function (touch, event) {
        ccui.Layout.prototype.onTouchCancelled.call(this, touch, event)
    }, update: function (dt) {
        if (this._autoScroll)this.autoScrollChildren(dt);
        if (this._bouncing)this.bounceChildren(dt);
        this.recordSlidTime(dt)
    }, recordSlidTime: function (dt) {
        if (this._bePressed)this._slidTime += dt
    }, interceptTouchEvent: function (event, sender, touch) {
        var touchPoint =
            touch.getLocation();
        switch (event) {
            case ccui.Widget.TOUCH_BAGAN:
                this._touchBeganPosition.x = touchPoint.x;
                this._touchBeganPosition.y = touchPoint.y;
                this.handlePressLogic(touch);
                break;
            case ccui.Widget.TOUCH_MOVED:
                var offset = cc.pLength(cc.pSub(sender.getTouchBeganPosition(), touchPoint));
                if (offset > this._childFocusCancelOffset) {
                    sender.setHighlighted(false);
                    this._touchMovePosition.x = touchPoint.x;
                    this._touchMovePosition.y = touchPoint.y;
                    this.handleMoveLogic(touch)
                }
                break;
            case ccui.Widget.TOUCH_CANCELED:
            case ccui.Widget.TOUCH_ENDED:
                this._touchEndPosition.x =
                    touchPoint.x;
                this._touchEndPosition.y = touchPoint.y;
                this.handleReleaseLogic(touch);
                break
        }
    }, scrollToTopEvent: function () {
        if (this._scrollViewEventListener && this._scrollViewEventSelector)this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_SCROLL_TO_TOP);
        if (this._eventCallback)this._eventCallback(this, ccui.ScrollView.EVENT_SCROLL_TO_TOP)
    }, scrollToBottomEvent: function () {
        if (this._scrollViewEventListener && this._scrollViewEventSelector)this._scrollViewEventSelector.call(this._scrollViewEventListener,
            this, ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM);
        if (this._eventCallback)this._eventCallback(this, ccui.ScrollView.EVENT_SCROLL_TO_BOTTOM)
    }, scrollToLeftEvent: function () {
        if (this._scrollViewEventListener && this._scrollViewEventSelector)this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_SCROLL_TO_LEFT);
        if (this._eventCallback)this._eventCallback(this, ccui.ScrollView.EVENT_SCROLL_TO_LEFT)
    }, scrollToRightEvent: function () {
        if (this._scrollViewEventListener && this._scrollViewEventSelector)this._scrollViewEventSelector.call(this._scrollViewEventListener,
            this, ccui.ScrollView.EVENT_SCROLL_TO_RIGHT);
        if (this._eventCallback)this._eventCallback(this, ccui.ScrollView.EVENT_SCROLL_TO_RIGHT)
    }, scrollingEvent: function () {
        if (this._scrollViewEventListener && this._scrollViewEventSelector)this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_SCROLLING);
        if (this._eventCallback)this._eventCallback(this, ccui.ScrollView.EVENT_SCROLLING)
    }, bounceTopEvent: function () {
        if (this._scrollViewEventListener && this._scrollViewEventSelector)this._scrollViewEventSelector.call(this._scrollViewEventListener,
            this, ccui.ScrollView.EVENT_BOUNCE_TOP);
        if (this._eventCallback)this._eventCallback(this, ccui.ScrollView.EVENT_BOUNCE_TOP)
    }, bounceBottomEvent: function () {
        if (this._scrollViewEventListener && this._scrollViewEventSelector)this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_BOUNCE_BOTTOM);
        if (this._eventCallback)this._eventCallback(this, ccui.ScrollView.EVENT_BOUNCE_BOTTOM)
    }, bounceLeftEvent: function () {
        if (this._scrollViewEventListener && this._scrollViewEventSelector)this._scrollViewEventSelector.call(this._scrollViewEventListener,
            this, ccui.ScrollView.EVENT_BOUNCE_LEFT);
        if (this._eventCallback)this._eventCallback(this, ccui.ScrollView.EVENT_BOUNCE_LEFT)
    }, bounceRightEvent: function () {
        if (this._scrollViewEventListener && this._scrollViewEventSelector)this._scrollViewEventSelector.call(this._scrollViewEventListener, this, ccui.ScrollView.EVENT_BOUNCE_RIGHT);
        if (this._eventCallback)this._eventCallback(this, ccui.ScrollView.EVENT_BOUNCE_RIGHT)
    }, addEventListenerScrollView: function (selector, target) {
        this._scrollViewEventSelector = selector;
        this._scrollViewEventListener =
            target
    }, addEventListener: function (callback) {
        this._eventCallback = callback
    }, setDirection: function (dir) {
        this.direction = dir
    }, getDirection: function () {
        return this.direction
    }, setBounceEnabled: function (enabled) {
        this.bounceEnabled = enabled
    }, isBounceEnabled: function () {
        return this.bounceEnabled
    }, setInertiaScrollEnabled: function (enabled) {
        this.inertiaScrollEnabled = enabled
    }, isInertiaScrollEnabled: function () {
        return this.inertiaScrollEnabled
    }, getInnerContainer: function () {
        return this._innerContainer
    }, setLayoutType: function (type) {
        this._innerContainer.setLayoutType(type)
    },
    getLayoutType: function () {
        return this._innerContainer.getLayoutType()
    }, _doLayout: function () {
        if (!this._doLayoutDirty)return;
        this._doLayoutDirty = false
    }, getDescription: function () {
        return"ScrollView"
    }, createCloneInstance: function () {
        return ccui.ScrollView.create()
    }, copyClonedWidgetChildren: function (model) {
        ccui.Layout.prototype.copyClonedWidgetChildren.call(this, model)
    }, copySpecialProperties: function (scrollView) {
        if (scrollView instanceof ccui.ScrollView) {
            ccui.Layout.prototype.copySpecialProperties.call(this,
                scrollView);
            this.setInnerContainerSize(scrollView.getInnerContainerSize());
            this.setDirection(scrollView.direction);
            this.setBounceEnabled(scrollView.bounceEnabled);
            this.setInertiaScrollEnabled(scrollView.inertiaScrollEnabled);
            this._scrollViewEventListener = scrollView._scrollViewEventListener;
            this._scrollViewEventSelector = scrollView._scrollViewEventSelector;
            this._eventCallback = scrollView._eventCallback
        }
    }});
var _p = ccui.ScrollView.prototype;
_p.innerWidth;
cc.defineGetterSetter(_p, "innerWidth", _p._getInnerWidth, _p._setInnerWidth);
_p.innerHeight;
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
ccui.ListView = ccui.ScrollView.extend({_model: null, _items: null, _gravity: null, _itemsMargin: 0, _listViewEventListener: null, _listViewEventSelector: null, _curSelectedIndex: 0, _refreshViewDirty: true, _className: "ListView", ctor: function () {
    ccui.ScrollView.prototype.ctor.call(this);
    this._model = null;
    this._items = [];
    this._gravity = ccui.ListView.GRAVITY_CENTER_HORIZONTAL;
    this._itemsMargin = 0;
    this._listViewEventListener = null;
    this._listViewEventSelector = null;
    this._curSelectedIndex = 0;
    this._refreshViewDirty = true
}, init: function () {
    if (ccui.ScrollView.prototype.init.call(this)) {
        this.setLayoutType(ccui.Layout.LINEAR_VERTICAL);
        return true
    }
    return false
}, setItemModel: function (model) {
    if (!model)return;
    this._model = model
}, updateInnerContainerSize: function () {
    switch (this.direction) {
        case ccui.ScrollView.DIR_VERTICAL:
            var length = this._items.length;
            var totalHeight = (length - 1) * this._itemsMargin;
            for (var i = 0; i < length; i++) {
                var item = this._items[i];
                totalHeight += item.getContentSize().height
            }
            var finalWidth = this._contentSize.width;
            var finalHeight = totalHeight;
            this.setInnerContainerSize(cc.size(finalWidth, finalHeight));
            break;
        case ccui.ScrollView.DIR_HORIZONTAL:
            var length =
                this._items.length;
            var totalWidth = (length - 1) * this._itemsMargin;
            for (var i = 0; i < length; i++) {
                var item = this._items[i];
                totalWidth += item.getContentSize().width
            }
            var finalWidth = totalWidth;
            var finalHeight = this._contentSize.height;
            this.setInnerContainerSize(cc.size(finalWidth, finalHeight));
            break;
        default:
            break
    }
}, remedyLayoutParameter: function (item) {
    if (!item)return;
    switch (this.direction) {
        case ccui.ScrollView.DIR_VERTICAL:
            var llp = item.getLayoutParameter();
            if (!llp) {
                var defaultLp = ccui.LinearLayoutParameter.create();
                switch (this._gravity) {
                    case ccui.ListView.GRAVITY_LEFT:
                        defaultLp.setGravity(ccui.LinearLayoutParameter.LEFT);
                        break;
                    case ccui.ListView.GRAVITY_RIGHT:
                        defaultLp.setGravity(ccui.LinearLayoutParameter.RIGHT);
                        break;
                    case ccui.ListView.GRAVITY_CENTER_HORIZONTAL:
                        defaultLp.setGravity(ccui.LinearLayoutParameter.CENTER_HORIZONTAL);
                        break;
                    default:
                        break
                }
                if (this.getIndex(item) == 0)defaultLp.setMargin(ccui.MarginZero()); else defaultLp.setMargin(new ccui.Margin(0, this._itemsMargin, 0, 0));
                item.setLayoutParameter(defaultLp)
            } else {
                if (this.getIndex(item) ==
                    0)llp.setMargin(ccui.MarginZero()); else llp.setMargin(new ccui.Margin(0, this._itemsMargin, 0, 0));
                switch (this._gravity) {
                    case ccui.ListView.GRAVITY_LEFT:
                        llp.setGravity(ccui.LinearLayoutParameter.LEFT);
                        break;
                    case ccui.ListView.GRAVITY_RIGHT:
                        llp.setGravity(ccui.LinearLayoutParameter.RIGHT);
                        break;
                    case ccui.ListView.GRAVITY_CENTER_HORIZONTAL:
                        llp.setGravity(ccui.LinearLayoutParameter.CENTER_HORIZONTAL);
                        break;
                    default:
                        break
                }
            }
            break;
        case ccui.ScrollView.DIR_HORIZONTAL:
            var llp = item.getLayoutParameter();
            if (!llp) {
                var defaultLp =
                    ccui.LinearLayoutParameter.create();
                switch (this._gravity) {
                    case ccui.ListView.GRAVITY_TOP:
                        defaultLp.setGravity(ccui.LinearLayoutParameter.TOP);
                        break;
                    case ccui.ListView.GRAVITY_BOTTOM:
                        defaultLp.setGravity(ccui.LinearLayoutParameter.BOTTOM);
                        break;
                    case ccui.ListView.GRAVITY_CENTER_VERTICAL:
                        defaultLp.setGravity(ccui.LinearLayoutParameter.CENTER_VERTICAL);
                        break;
                    default:
                        break
                }
                if (this.getIndex(item) == 0)defaultLp.setMargin(ccui.MarginZero()); else defaultLp.setMargin(new ccui.Margin(this._itemsMargin, 0, 0, 0));
                item.setLayoutParameter(defaultLp)
            } else {
                if (this.getIndex(item) == 0)llp.setMargin(ccui.MarginZero()); else llp.setMargin(new ccui.Margin(this._itemsMargin, 0, 0, 0));
                switch (this._gravity) {
                    case ccui.ListView.GRAVITY_TOP:
                        llp.setGravity(ccui.LinearLayoutParameter.TOP);
                        break;
                    case ccui.ListView.GRAVITY_BOTTOM:
                        llp.setGravity(ccui.LinearLayoutParameter.BOTTOM);
                        break;
                    case ccui.ListView.GRAVITY_CENTER_VERTICAL:
                        llp.setGravity(ccui.LinearLayoutParameter.CENTER_VERTICAL);
                        break;
                    default:
                        break
                }
            }
            break;
        default:
            break
    }
},
    pushBackDefaultItem: function () {
        if (!this._model)return;
        var newItem = this._model.clone();
        this.remedyLayoutParameter(newItem);
        this.addChild(newItem);
        this._refreshViewDirty = true
    }, insertDefaultItem: function (index) {
        if (!this._model)return;
        var newItem = this._model.clone();
        this._items.splice(index, 0, newItem);
        ccui.ScrollView.prototype.addChild.call(this, newItem);
        this.remedyLayoutParameter(newItem);
        this._refreshViewDirty = true
    }, pushBackCustomItem: function (item) {
        this.remedyLayoutParameter(item);
        this.addChild(item);
        this._refreshViewDirty = true
    }, addChild: function (widget, zOrder, tag) {
        if (widget) {
            zOrder = zOrder || widget.getLocalZOrder();
            tag = tag || widget.getTag();
            ccui.ScrollView.prototype.addChild.call(this, widget, zOrder, tag);
            this._items.push(widget)
        }
    }, removeChild: function (widget, cleaup) {
        if (widget) {
            var index = this._items.indexOf(widget);
            if (index > -1)this._items.splice(index, 1);
            ccui.ScrollView.prototype.removeChild.call(this, widget, cleaup)
        }
    }, removeAllChildren: function () {
        this.removeAllChildrenWithCleanup(true)
    }, removeAllChildrenWithCleanup: function (cleanup) {
        ccui.ScrollView.prototype.removeAllChildrenWithCleanup.call(this,
            cleanup);
        this._items = []
    }, insertCustomItem: function (item, index) {
        this._items.splice(index, 0, item);
        ccui.ScrollView.prototype.addChild.call(this, item);
        this.remedyLayoutParameter(item);
        this._refreshViewDirty = true
    }, removeItem: function (index) {
        var item = this.getItem(index);
        if (!item)return;
        this.removeChild(item);
        this._refreshViewDirty = true
    }, removeLastItem: function () {
        this.removeItem(this._items.length - 1)
    }, removeAllItems: function () {
        this.removeAllChildren()
    }, getItem: function (index) {
        if (index < 0 || index >= this._items.length)return null;
        return this._items[index]
    }, getItems: function () {
        return this._items
    }, getIndex: function (item) {
        return this._items.indexOf(item)
    }, setGravity: function (gravity) {
        if (this._gravity == gravity)return;
        this._gravity = gravity;
        this._refreshViewDirty = true
    }, setItemsMargin: function (margin) {
        if (this._itemsMargin == margin)return;
        this._itemsMargin = margin;
        this._refreshViewDirty = true
    }, getItemsMargin: function () {
        return this._itemsMargin
    }, setDirection: function (dir) {
        switch (dir) {
            case ccui.ScrollView.DIR_VERTICAL:
                this.setLayoutType(ccui.Layout.LINEAR_VERTICAL);
                break;
            case ccui.ScrollView.DIR_HORIZONTAL:
                this.setLayoutType(ccui.Layout.LINEAR_HORIZONTAL);
                break;
            case ccui.ScrollView.DIR_BOTH:
                return;
            default:
                return;
                break
        }
        ccui.ScrollView.prototype.setDirection.call(this, dir)
    }, requestRefreshView: function () {
        this._refreshViewDirty = true
    }, refreshView: function () {
        for (var i = 0; i < this._items.length; i++) {
            var item = this._items[i];
            item.setLocalZOrder(i);
            this.remedyLayoutParameter(item)
        }
        this.updateInnerContainerSize()
    }, _doLayout: function () {
        ccui.Layout.prototype._doLayout.call(this);
        if (this._refreshViewDirty) {
            this.refreshView();
            this._refreshViewDirty = false
        }
    }, addEventListenerListView: function (selector, target) {
        this._listViewEventListener = target;
        this._listViewEventSelector = selector
    }, addEventListener: function (callback) {
        this._eventCallback = callback
    }, selectedItemEvent: function (event) {
        var eventEnum = event == ccui.Widget.TOUCH_BAGAN ? ccui.ListView.ON_SELECTED_ITEM_START : ccui.ListView.ON_SELECTED_ITEM_END;
        if (this._listViewEventListener && this._listViewEventSelector)this._listViewEventSelector.call(this._listViewEventListener,
            this, eventEnum);
        if (this._eventCallback)this._eventCallback(this, eventEnum)
    }, interceptTouchEvent: function (handleState, sender, touchPoint) {
        ccui.ScrollView.prototype.interceptTouchEvent.call(this, handleState, sender, touchPoint);
        if (handleState != 1) {
            var parent = sender;
            while (parent) {
                if (parent && parent.getParent() == this._innerContainer) {
                    this._curSelectedIndex = this.getIndex(parent);
                    break
                }
                parent = parent.getParent()
            }
            if (sender.isHighlighted())this.selectedItemEvent(handleState)
        }
    }, getCurSelectedIndex: function () {
        return this._curSelectedIndex
    },
    onSizeChanged: function () {
        ccui.ScrollView.prototype.onSizeChanged.call(this);
        this._refreshViewDirty = true
    }, getDescription: function () {
        return"ListView"
    }, createCloneInstance: function () {
        return ccui.ListView.create()
    }, copyClonedWidgetChildren: function (model) {
        var arrayItems = model.getItems();
        for (var i = 0; i < arrayItems.length; i++) {
            var item = arrayItems[i];
            this.pushBackCustomItem(item.clone())
        }
    }, copySpecialProperties: function (listView) {
        ccui.ScrollView.prototype.copySpecialProperties.call(this, listView);
        this.setItemModel(listView._model);
        this.setItemsMargin(listView._itemsMargin);
        this.setGravity(listView._gravity);
        this._listViewEventListener = listView._listViewEventListener;
        this._listViewEventSelector = listView._listViewEventSelector;
        this._eventCallback = listView._eventCallback
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
ccui.PageView = ccui.Layout.extend({_curPageIdx: 0, _pages: null, _touchMoveDirection: null, _touchStartLocation: 0, _touchMoveStartLocation: 0, _movePagePoint: null, _leftBoundaryChild: null, _rightBoundaryChild: null, _leftBoundary: 0, _rightBoundary: 0, _isAutoScrolling: false, _autoScrollDistance: 0, _autoScrollSpeed: 0, _autoScrollDirection: 0, _childFocusCancelOffset: 0, _pageViewEventListener: null, _pageViewEventSelector: null, _className: "PageView", _eventCallback: null, ctor: function () {
    ccui.Layout.prototype.ctor.call(this);
    this._curPageIdx =
        0;
    this._pages = [];
    this._touchMoveDirection = ccui.PageView.TOUCH_DIR_LEFT;
    this._touchStartLocation = 0;
    this._touchMoveStartLocation = 0;
    this._movePagePoint = null;
    this._leftBoundaryChild = null;
    this._rightBoundaryChild = null;
    this._leftBoundary = 0;
    this._rightBoundary = 0;
    this._isAutoScrolling = false;
    this._autoScrollDistance = 0;
    this._autoScrollSpeed = 0;
    this._autoScrollDirection = 0;
    this._childFocusCancelOffset = 5;
    this._pageViewEventListener = null;
    this._pageViewEventSelector = null
}, init: function () {
    if (ccui.Layout.prototype.init.call(this)) {
        this.setClippingEnabled(true);
        return true
    }
    return false
}, onEnter: function () {
    ccui.Layout.prototype.onEnter.call(this);
    this.scheduleUpdate(true)
}, addWidgetToPage: function (widget, pageIdx, forceCreate) {
    if (!widget || pageIdx < 0)return;
    var pageCount = this.getPageCount();
    if (pageIdx >= pageCount) {
        if (forceCreate) {
            if (pageIdx > pageCount)cc.log("pageIdx is %d, it will be added as page id [%d]", pageIdx, pageCount);
            var newPage = this.createPage();
            newPage.addChild(widget);
            this.addPage(newPage)
        }
    } else {
        var page = this._pages[pageIdx];
        if (page)page.addChild(widget)
    }
},
    createPage: function () {
        var newPage = ccui.Layout.create();
        newPage.setContentSize(this.getContentSize());
        return newPage
    }, addPage: function (page) {
        if (!page || this._pages.indexOf(page) != -1)return;
        this.addProtectedChild(page);
        this._pages.push(page);
        this._doLayoutDirty = true
    }, insertPage: function (page, idx) {
        if (idx < 0 || !page || this._pages.indexOf(page) != -1)return;
        var pageCount = this.getPageCount();
        if (idx >= pageCount)this.addPage(page); else {
            this._pages[idx] = page;
            this.addProtectedChild(page)
        }
        this._doLayoutDirty = true
    },
    removePage: function (page) {
        if (!page)return;
        this.removeProtectedChild(page);
        var index = this._pages.indexOf(page);
        if (index > -1)this._pages.splice(index, 1);
        this._doLayoutDirty = true
    }, removePageAtIndex: function (index) {
        if (index < 0 || index >= this._pages.length)return;
        var page = this._pages[index];
        if (page)this.removePage(page)
    }, removeAllPages: function () {
        var locPages = this._pages;
        for (var i = 0, len = locPages.length; i < len; i++)this.removeProtectedChild(locPages[i]);
        this._pages.length = 0
    }, updateBoundaryPages: function () {
        if (this._pages.length <=
            0) {
            this._leftBoundaryChild = null;
            this._rightBoundaryChild = null;
            return
        }
        this._leftBoundaryChild = this._pages[0];
        this._rightBoundaryChild = this._pages[this._pages.length - 1]
    }, getPageCount: function () {
        return this._pages.length
    }, getPositionXByIndex: function (idx) {
        return this.getSize().width * (idx - this._curPageIdx)
    }, onSizeChanged: function () {
        ccui.Layout.prototype.onSizeChanged.call(this);
        this._rightBoundary = this.getContentSize().width;
        this._doLayoutDirty = true
    }, updateAllPagesSize: function () {
        var selfSize = this.getContentSize();
        var locPages = this._pages;
        for (var i = 0, len = locPages.length; i < len; i++)locPages[i].setContentSize(selfSize)
    }, updateAllPagesPosition: function () {
        var pageCount = this.getPageCount();
        if (pageCount <= 0) {
            this._curPageIdx = 0;
            return
        }
        if (this._curPageIdx >= pageCount)this._curPageIdx = pageCount - 1;
        var pageWidth = this.getContentSize().width;
        var locPages = this._pages;
        for (var i = 0; i < pageCount; i++)locPages[i].setPosition(cc.p((i - this._curPageIdx) * pageWidth, 0))
    }, scrollToPage: function (idx) {
        if (idx < 0 || idx >= this._pages.length)return;
        this._curPageIdx = idx;
        var curPage = this._pages[idx];
        this._autoScrollDistance = -curPage.getPosition().x;
        this._autoScrollSpeed = Math.abs(this._autoScrollDistance) / 0.2;
        this._autoScrollDirection = this._autoScrollDistance > 0 ? 1 : 0;
        this._isAutoScrolling = true
    }, update: function (dt) {
        if (this._isAutoScrolling)this.autoScroll(dt)
    }, autoScroll: function (dt) {
        var step;
        switch (this._autoScrollDirection) {
            case 0:
                step = this._autoScrollSpeed * dt;
                if (this._autoScrollDistance + step >= 0) {
                    step = -this._autoScrollDistance;
                    this._autoScrollDistance =
                        0;
                    this._isAutoScrolling = false
                } else this._autoScrollDistance += step;
                this.scrollPages(-step);
                if (!this._isAutoScrolling)this.pageTurningEvent();
                break;
                break;
            case 1:
                step = this._autoScrollSpeed * dt;
                if (this._autoScrollDistance - step <= 0) {
                    step = this._autoScrollDistance;
                    this._autoScrollDistance = 0;
                    this._isAutoScrolling = false
                } else this._autoScrollDistance -= step;
                this.scrollPages(step);
                if (!this._isAutoScrolling)this.pageTurningEvent();
                break;
            default:
                break
        }
    }, onTouchBegan: function (touch, event) {
        var pass = ccui.Layout.prototype.onTouchBegan.call(this,
            touch, event);
        if (this._hitted)this.handlePressLogic(touch);
        return pass
    }, onTouchMoved: function (touch, event) {
        this.handleMoveLogic(touch);
        var widgetParent = this.getWidgetParent();
        if (widgetParent)widgetParent.interceptTouchEvent(ccui.Widget.TOUCH_MOVED, this, touch);
        this.moveEvent()
    }, onTouchEnded: function (touch, event) {
        ccui.Layout.prototype.onTouchEnded.call(this, touch, event);
        this.handleReleaseLogic(touch)
    }, onTouchCancelled: function (touch, event) {
        ccui.Layout.prototype.onTouchCancelled.call(this, touch, event);
        this.handleReleaseLogic(touch)
    }, _doLayout: function () {
        if (!this._doLayoutDirty)return;
        this.updateAllPagesPosition();
        this.updateAllPagesSize();
        this.updateBoundaryPages();
        this._doLayoutDirty = false
    }, movePages: function (offset) {
        var arrayPages = this._pages;
        var length = arrayPages.length;
        for (var i = 0; i < length; i++) {
            var child = arrayPages[i];
            var pos = child.getPosition();
            child.setPosition(pos.x + offset, pos.y)
        }
    }, scrollPages: function (touchOffset) {
        if (this._pages.length <= 0)return false;
        if (!this._leftBoundaryChild || !this._rightBoundaryChild)return false;
        var realOffset = touchOffset;
        switch (this._touchMoveDirection) {
            case ccui.PageView.TOUCH_DIR_LEFT:
                if (this._rightBoundaryChild.getRightBoundary() + touchOffset <= this._rightBoundary) {
                    realOffset = this._rightBoundary - this._rightBoundaryChild.getRightBoundary();
                    this.movePages(realOffset);
                    return false
                }
                break;
            case ccui.PageView.TOUCH_DIR_RIGHT:
                if (this._leftBoundaryChild.getLeftBoundary() + touchOffset >= this._leftBoundary) {
                    realOffset = this._leftBoundary - this._leftBoundaryChild.getLeftBoundary();
                    this.movePages(realOffset);
                    return false
                }
                break;
            default:
                break
        }
        this.movePages(realOffset);
        return true
    }, handlePressLogic: function (touchPoint) {
    }, handleMoveLogic: function (touch) {
        var offset = touch.getLocation().x - touch.getPreviousLocation().x;
        if (offset < 0)this._touchMoveDirection = ccui.PageView.TOUCH_DIR_LEFT; else if (offset > 0)this._touchMoveDirection = ccui.PageView.TOUCH_DIR_RIGHT;
        this.scrollPages(offset)
    }, handleReleaseLogic: function (touchPoint) {
        if (this._pages.length <= 0)return;
        var curPage = this._pages[this._curPageIdx];
        if (curPage) {
            var curPagePos =
                curPage.getPosition();
            var pageCount = this._pages.length;
            var curPageLocation = curPagePos.x;
            var pageWidth = this.getSize().width;
            var boundary = pageWidth / 2;
            if (curPageLocation <= -boundary)if (this._curPageIdx >= pageCount - 1)this.scrollPages(-curPageLocation); else this.scrollToPage(this._curPageIdx + 1); else if (curPageLocation >= boundary)if (this._curPageIdx <= 0)this.scrollPages(-curPageLocation); else this.scrollToPage(this._curPageIdx - 1); else this.scrollToPage(this._curPageIdx)
        }
    }, interceptTouchEvent: function (handleState, sender, touchPoint) {
        switch (handleState) {
            case 0:
                this.handlePressLogic(touchPoint);
                break;
            case 1:
                var offset = 0;
                offset = Math.abs(sender.getTouchBeganPosition().x - touchPoint.x);
                if (offset > this._childFocusCancelOffset) {
                    sender.setFocused(false);
                    this.handleMoveLogic(touchPoint)
                }
                break;
            case 2:
                this.handleReleaseLogic(touchPoint);
                break;
            case 3:
                break
        }
    }, pageTurningEvent: function () {
        if (this._pageViewEventListener && this._pageViewEventSelector)this._pageViewEventSelector.call(this._pageViewEventListener, this, ccui.PageView.EVENT_TURNING);
        if (this._eventCallback)this._eventCallback(this, ccui.PageView.EVENT_TURNING)
    }, addEventListenerPageView: function (selector, target) {
        this._pageViewEventSelector = selector;
        this._pageViewEventListener = target
    }, addEventListener: function (callback) {
        this._eventCallback = callback
    }, getCurPageIndex: function () {
        return this._curPageIdx
    }, getPages: function () {
        return this._pages
    }, getPage: function (index) {
        if (index < 0 || index >= this.getPages().size())return null;
        return this._pages[index]
    }, getDescription: function () {
        return"PageView"
    },
    createCloneInstance: function () {
        return ccui.PageView.create()
    }, copyClonedWidgetChildren: function (model) {
        var arrayPages = model.getPages();
        for (var i = 0; i < arrayPages.length; i++) {
            var page = arrayPages[i];
            this.addPage(page.clone())
        }
    }, copySpecialProperties: function (pageView) {
        ccui.Layout.prototype.copySpecialProperties.call(this, pageView);
        this._eventCallback = pageView._eventCallback;
        this._pageViewEventListener = pageView._pageViewEventListener;
        this._pageViewEventSelector = pageView._pageViewEventSelector
    }});
ccui.PageView.create = function () {
    var widget = new ccui.PageView;
    if (widget && widget.init())return widget;
    return null
};
ccui.PageView.EVENT_TURNING = 0;
ccui.PageView.TOUCH_DIR_LEFT = 0;
ccui.PageView.TOUCH_DIR_RIGHT = 1;