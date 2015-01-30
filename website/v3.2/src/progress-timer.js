cc.ProgressTimer = cc.Node.extend({
    _type:null,
    _percentage:0.0,
    _sprite:null,
    _midPoint:null,
    _barChangeRate:null,
    _reverseDirection:false,
    _className:"ProgressTimer",
    ctor: function(sprite){
        cc.Node.prototype.ctor.call(this);
        this._type = cc.ProgressTimer.TYPE_RADIAL;
        this._percentage = 0.0;
        this._midPoint = cc.p(0, 0);
        this._barChangeRate = cc.p(0, 0);
        this._reverseDirection = false;
        this._sprite = null;
        sprite && this.initWithSprite(sprite);
    },
    getMidpoint:function () {
        return cc.p(this._midPoint.x, this._midPoint.y);
    },
    setMidpoint:function (mpoint) {
        this._midPoint = cc.pClamp(mpoint, cc.p(0, 0), cc.p(1, 1));
    },
    getBarChangeRate:function () {
        return cc.p(this._barChangeRate.x, this._barChangeRate.y);
    },
    setBarChangeRate:function (barChangeRate) {
        this._barChangeRate = cc.pClamp(barChangeRate, cc.p(0, 0), cc.p(1, 1));
    },
    getType:function () {
        return this._type;
    },
    getPercentage:function () {
        return this._percentage;
    },
    getSprite:function () {
        return this._sprite;
    },
    setPercentage:function (percentage) {
        if (this._percentage != percentage) {
            this._percentage = cc.clampf(percentage, 0, 100);
            this._renderCmd._updateProgress();
        }
    },
    setOpacityModifyRGB:function (bValue) {
    },
    isOpacityModifyRGB:function () {
        return false;
    },
    isReverseDirection:function () {
        return this._reverseDirection;
    },
    setColor:function (color) {
        this._sprite.color = color;
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty);
    },
    setOpacity:function (opacity) {
        this._sprite.opacity = opacity;
        this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty);
    },
    getColor:function () {
        return this._sprite.color;
    },
    getOpacity:function () {
        return this._sprite.opacity;
    },
    setReverseProgress: function(reverse){
        if (this._reverseDirection !== reverse){
            this._reverseDirection = reverse;
            this._renderCmd.releaseData();
        }
    },
    setSprite: function(sprite){
        if (this._sprite != sprite) {
            this._sprite = sprite;
            if(sprite)
                this.setContentSize(sprite.width,sprite.height);
            else
                this.setContentSize(0,0);
            this._renderCmd.releaseData();
        }
    },
    setType: function(type){
        if (type !== this._type){
            this._type = type;
            this._renderCmd.releaseData();
        }
    },
    setReverseDirection: function(reverse){
        if (this._reverseDirection !== reverse){
            this._reverseDirection = reverse;
            this._renderCmd.releaseData();
        }
    },
    initWithSprite: function(sprite){
        this.percentage = 0;
        this.setAnchorPoint(0.5,0.5);
        this._type = cc.ProgressTimer.TYPE_RADIAL;
        this._reverseDirection = false;
        this.midPoint = cc.p(0.5, 0.5);
        this.barChangeRate = cc.p(1, 1);
        this.setSprite(sprite);
        this._renderCmd.initCmd();
        return true;
    },
    _createRenderCmd: function(){
        if(cc._renderType === cc._RENDER_TYPE_CANVAS)
            return new cc.ProgressTimer.CanvasRenderCmd(this);
        else
            return new cc.ProgressTimer.WebGLRenderCmd(this);
    }
});
var _p = cc.ProgressTimer.prototype;
_p.midPoint;
cc.defineGetterSetter(_p, "midPoint", _p.getMidpoint, _p.setMidpoint);
_p.barChangeRate;
cc.defineGetterSetter(_p, "barChangeRate", _p.getBarChangeRate, _p.setBarChangeRate);
_p.type;
cc.defineGetterSetter(_p, "type", _p.getType, _p.setType);
_p.percentage;
cc.defineGetterSetter(_p, "percentage", _p.getPercentage, _p.setPercentage);
_p.sprite;
cc.defineGetterSetter(_p, "sprite", _p.getSprite, _p.setSprite);
_p.reverseDir;
cc.defineGetterSetter(_p, "reverseDir", _p.isReverseDirection, _p.setReverseDirection);
cc.ProgressTimer.create = function (sprite) {
    return new cc.ProgressTimer(sprite);
};
cc.ProgressTimer.TEXTURE_COORDS_COUNT = 4;
cc.ProgressTimer.TEXTURE_COORDS = 0x4b;
cc.ProgressTimer.TYPE_RADIAL = 0;
cc.ProgressTimer.TYPE_BAR = 1;
(function(){
    cc.ProgressTimer.CanvasRenderCmd = function(renderableObject){
        cc.Node.CanvasRenderCmd.call(this, renderableObject);
        this._needDraw = true;
        this._PI180 = Math.PI / 180;
        this._barRect = cc.rect(0, 0, 0, 0);
        this._origin = cc.p(0, 0);
        this._radius = 0;
        this._startAngle = 270;
        this._endAngle = 270;
        this._counterClockWise = false;
    };
    var proto = cc.ProgressTimer.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    proto.constructor = cc.ProgressTimer.CanvasRenderCmd;
    proto.rendering = function (ctx, scaleX, scaleY) {
        var wrapper = ctx || cc._renderContext,context = wrapper.getContext(), node = this._node, locSprite = node._sprite;
        var locTextureCoord = locSprite._renderCmd._textureCoord, alpha = locSprite._renderCmd._displayedOpacity / 255;
        if (locTextureCoord.width === 0 || locTextureCoord.height === 0)
            return;
        if (!locSprite._texture || !locTextureCoord.validRect || alpha === 0)
            return;
        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        wrapper.setCompositeOperation(locSprite._blendFuncStr);
        wrapper.setGlobalAlpha(alpha);
        var locRect = locSprite._rect, locOffsetPosition = locSprite._offsetPosition;
        var locX = locOffsetPosition.x,
            locY = -locOffsetPosition.y - locRect.height,
            locWidth = locRect.width,
            locHeight = locRect.height;
        wrapper.save();
        if (locSprite._flippedX) {
            locX = -locX - locWidth;
            context.scale(-1, 1);
        }
        if (locSprite._flippedY) {
            locY = locOffsetPosition.y;
            context.scale(1, -1);
        }
        if (node._type == cc.ProgressTimer.TYPE_BAR) {
            var locBarRect = this._barRect;
            context.beginPath();
            context.rect(locBarRect.x * scaleX, locBarRect.y * scaleY, locBarRect.width * scaleX, locBarRect.height * scaleY);
            context.clip();
            context.closePath();
        } else if (node._type == cc.ProgressTimer.TYPE_RADIAL) {
            var locOriginX = this._origin.x * scaleX;
            var locOriginY = this._origin.y * scaleY;
            context.beginPath();
            context.arc(locOriginX, locOriginY, this._radius * scaleY, this._PI180 * this._startAngle, this._PI180 * this._endAngle, this._counterClockWise);
            context.lineTo(locOriginX, locOriginY);
            context.clip();
            context.closePath();
        }
        var image = locSprite._texture.getHtmlElementObj();
        if (locSprite._colorized) {
            context.drawImage(image,
                0, 0, locTextureCoord.width, locTextureCoord.height,
                locX * scaleX, locY * scaleY, locWidth * scaleX, locHeight * scaleY);
        } else {
            context.drawImage(image,
                locTextureCoord.renderX, locTextureCoord.renderY, locTextureCoord.width, locTextureCoord.height,
                locX * scaleX, locY * scaleY, locWidth * scaleX, locHeight * scaleY);
        }
        wrapper.restore();
        cc.g_NumberOfDraws++;
    };
    proto.releaseData = function(){};
    proto.initCmd = function(){};
    proto._updateProgress = function(){
        var node = this._node;
        var locSprite = node._sprite;
        var sw = locSprite.width, sh = locSprite.height;
        var locMidPoint = node._midPoint;
        if (node._type == cc.ProgressTimer.TYPE_RADIAL) {
            this._radius = Math.round(Math.sqrt(sw * sw + sh * sh));
            var locStartAngle, locEndAngle, locCounterClockWise = false, locOrigin = this._origin;
            locOrigin.x = sw * locMidPoint.x;
            locOrigin.y = -sh * locMidPoint.y;
            if (node._reverseDirection) {
                locEndAngle = 270;
                locStartAngle = 270 - 3.6 * node._percentage;
            } else {
                locStartAngle = -90;
                locEndAngle = -90 + 3.6 * node._percentage;
            }
            if (locSprite._flippedX) {
                locOrigin.x -= sw * (node._midPoint.x * 2);
                locStartAngle = -locStartAngle;
                locEndAngle = -locEndAngle;
                locStartAngle -= 180;
                locEndAngle -= 180;
                locCounterClockWise = !locCounterClockWise;
            }
            if (locSprite._flippedY) {
                locOrigin.y += sh * (node._midPoint.y * 2);
                locCounterClockWise = !locCounterClockWise;
                locStartAngle = -locStartAngle;
                locEndAngle = -locEndAngle;
            }
            this._startAngle = locStartAngle;
            this._endAngle = locEndAngle;
            this._counterClockWise = locCounterClockWise;
        } else {
            var locBarChangeRate = node._barChangeRate;
            var percentageF = node._percentage / 100;
            var locBarRect = this._barRect;
            var drewSize = cc.size((sw * (1 - locBarChangeRate.x)), (sh * (1 - locBarChangeRate.y)));
            var drawingSize = cc.size((sw - drewSize.width) * percentageF, (sh - drewSize.height) * percentageF);
            var currentDrawSize = cc.size(drewSize.width + drawingSize.width, drewSize.height + drawingSize.height);
            var startPoint = cc.p(sw * locMidPoint.x, sh * locMidPoint.y);
            var needToLeft = startPoint.x - currentDrawSize.width / 2;
            if ((locMidPoint.x > 0.5) && (currentDrawSize.width / 2 >= sw - startPoint.x))
                needToLeft = sw - currentDrawSize.width;
            var needToTop = startPoint.y - currentDrawSize.height / 2;
            if ((locMidPoint.y > 0.5) && (currentDrawSize.height / 2 >= sh - startPoint.y))
                needToTop = sh - currentDrawSize.height;
            locBarRect.x = 0;
            var flipXNeed = 1;
            if (locSprite._flippedX) {
                locBarRect.x -= currentDrawSize.width;
                flipXNeed = -1;
            }
            if (needToLeft > 0)
                locBarRect.x += needToLeft * flipXNeed;
            locBarRect.y = 0;
            var flipYNeed = 1;
            if (locSprite._flippedY) {
                locBarRect.y += currentDrawSize.height;
                flipYNeed = -1;
            }
            if (needToTop > 0)
                locBarRect.y -= needToTop * flipYNeed;
            locBarRect.width = currentDrawSize.width;
            locBarRect.height = -currentDrawSize.height;
        }
    };
    proto._updateColor = function(){};
    proto._syncStatus = function (parentCmd) {
        var node = this._node;
        if(!node._sprite)
            return;
        var flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        var parentNode = parentCmd ? parentCmd._node : null;
        if(parentNode && parentNode._cascadeColorEnabled && (parentCmd._dirtyFlag & flags.colorDirty))
            locFlag |= flags.colorDirty;
        if(parentNode && parentNode._cascadeOpacityEnabled && (parentCmd._dirtyFlag & flags.opacityDirty))
            locFlag |= flags.opacityDirty;
        if(parentCmd && (parentCmd._dirtyFlag & flags.transformDirty))
            locFlag |= flags.transformDirty;
        this._dirtyFlag = locFlag;
        var spriteCmd = node._sprite._renderCmd;
        var spriteFlag = spriteCmd._dirtyFlag;
        var colorDirty = spriteFlag & flags.colorDirty,
            opacityDirty = spriteFlag & flags.opacityDirty;
        if (colorDirty){
            spriteCmd._syncDisplayColor();
        }
        if (opacityDirty){
            spriteCmd._syncDisplayOpacity();
        }
        if (locFlag & flags.transformDirty) {
            this.transform(parentCmd);
        }
    };
    proto.updateStatus = function () {
        var node = this._node;
        if(!node._sprite)
            return;
        var flags = cc.Node._dirtyFlags, locFlag = this._dirtyFlag;
        var spriteCmd = node._sprite._renderCmd;
        var spriteFlag = spriteCmd._dirtyFlag;
        var colorDirty = spriteFlag & flags.colorDirty,
            opacityDirty = spriteFlag & flags.opacityDirty;
        if(colorDirty){
            spriteCmd._updateDisplayColor();
        }
        if(opacityDirty){
            spriteCmd._updateDisplayOpacity();
        }
        if(locFlag & flags.transformDirty){
            this.transform(this.getParentRenderCmd(), true);
        }
        this._dirtyFlag = 0;
    };
})();
cc.ProgressTo = cc.ActionInterval.extend({
    _to:0,
    _from:0,
    ctor: function(duration, percent){
        cc.ActionInterval.prototype.ctor.call(this);
        this._to = 0;
        this._from = 0;
		percent !== undefined && this.initWithDuration(duration, percent);
    },
    initWithDuration:function (duration, percent) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._to = percent;
            return true;
        }
        return false;
    },
    clone:function(){
        var action = new cc.ProgressTo();
        action.initWithDuration(this._duration, this._to);
        return action;
    },
    reverse: function(){
        cc.log("cc.ProgressTo.reverse(): reverse hasn't been supported.");
        return null;
    },
    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._from = target.percentage;
    },
    update:function (time) {
        if (this.target  instanceof cc.ProgressTimer)
            this.target.percentage = this._from + (this._to - this._from) * time;
    }
});
cc.progressTo = function (duration, percent) {
    return new cc.ProgressTo(duration, percent);
};
cc.ProgressTo.create = cc.progressTo;
cc.ProgressFromTo = cc.ActionInterval.extend({
    _to:0,
    _from:0,
    ctor:function(duration, fromPercentage, toPercentage){
        cc.ActionInterval.prototype.ctor.call(this);
        this._to = 0;
        this._from = 0;
		toPercentage !== undefined && this.initWithDuration(duration, fromPercentage, toPercentage);
    },
    initWithDuration:function (duration, fromPercentage, toPercentage) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._to = toPercentage;
            this._from = fromPercentage;
            return true;
        }
        return false;
    },
    clone:function(){
        var action = new cc.ProgressFromTo();
        action.initWithDuration(this._duration, this._from, this._to);
        return action;
    },
    reverse:function () {
        return cc.progressFromTo(this._duration, this._to, this._from);
    },
    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
    },
    update:function (time) {
        if (this.target  instanceof cc.ProgressTimer)
            this.target.percentage = this._from + (this._to - this._from) * time;
    }
});
cc.progressFromTo = function (duration, fromPercentage, toPercentage) {
    return new cc.ProgressFromTo(duration, fromPercentage, toPercentage);
};
cc.ProgressFromTo.create = cc.progressFromTo;
