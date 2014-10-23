cc.PointObject = cc.Class.extend({
    _ratio:null,
    _offset:null,
    _child:null,
    ctor: function(ratio, offset){
        this.initWithCCPoint(ratio, offset);
    },
    getRatio:function () {
        return this._ratio;
    },
    setRatio:function (value) {
        this._ratio = value;
    },
    getOffset:function () {
        return this._offset;
    },
    setOffset:function (value) {
        this._offset = value;
    },
    getChild:function () {
        return this._child;
    },
    setChild:function (value) {
        this._child = value;
    },
    initWithCCPoint:function (ratio, offset) {
        this._ratio = ratio;
        this._offset = offset;
        this._child = null;
        return true;
    }
});
cc.PointObject.create = function (ratio, offset) {
    return new cc.PointObject(ratio, offset);
};
cc.ParallaxNode = cc.Node.extend({
	parallaxArray:null,
    _lastPosition:null,
    _className:"ParallaxNode",
    getParallaxArray:function () {
        return this.parallaxArray;
    },
    setParallaxArray:function (value) {
        this.parallaxArray = value;
    },
    ctor:function () {
        cc.Node.prototype.ctor.call(this);
        this.parallaxArray = [];
        this._lastPosition = cc.p(-100, -100);
    },
    addChild:function (child, z, ratio, offset) {
        if (arguments.length === 3) {
            cc.log("ParallaxNode: use addChild(child, z, ratio, offset) instead");
            return;
        }
        if(!child)
            throw "cc.ParallaxNode.addChild(): child should be non-null";
        var obj = new cc.PointObject(ratio, offset);
        obj.setChild(child);
        this.parallaxArray.push(obj);
	    child.setPosition(this._position.x * ratio.x + offset.x, this._position.y * ratio.y + offset.y);
        cc.Node.prototype.addChild.call(this, child, z, child.tag);
    },
    removeChild:function (child, cleanup) {
        var locParallaxArray = this.parallaxArray;
        for (var i = 0; i < locParallaxArray.length; i++) {
            var point = locParallaxArray[i];
            if (point.getChild() == child) {
                locParallaxArray.splice(i, 1);
                break;
            }
        }
        cc.Node.prototype.removeChild.call(this, child, cleanup);
    },
    removeAllChildren:function (cleanup) {
        this.parallaxArray.length = 0;
        cc.Node.prototype.removeAllChildren.call(this, cleanup);
    },
    visit:function () {
        var pos = this._absolutePosition();
        if (!cc.pointEqualToPoint(pos, this._lastPosition)) {
            var locParallaxArray = this.parallaxArray;
            for (var i = 0, len = locParallaxArray.length; i < len; i++) {
                var point = locParallaxArray[i];
	            var child = point.getChild();
	            child.setPosition(-pos.x + pos.x * point.getRatio().x + point.getOffset().x,
	                               -pos.y + pos.y * point.getRatio().y + point.getOffset().y);
            }
            this._lastPosition = pos;
        }
        cc.Node.prototype.visit.call(this);
    },
    _absolutePosition:function () {
        var ret = this._position;
        var cn = this;
        while (cn.parent != null) {
            cn = cn.parent;
            ret = cc.pAdd(ret, cn.getPosition());
        }
        return ret;
    },
    _transformForRenderer:function () {
        var pos = this._absolutePosition();
        if (!cc.pointEqualToPoint(pos, this._lastPosition)) {
            var locParallaxArray = this.parallaxArray;
            for (var i = 0, len = locParallaxArray.length; i < len; i++) {
                var point = locParallaxArray[i];
                var child = point.getChild();
                child.setPosition(-pos.x + pos.x * point.getRatio().x + point.getOffset().x,
                    -pos.y + pos.y * point.getRatio().y + point.getOffset().y);
            }
            this._lastPosition = pos;
        }
        cc.Node.prototype._transformForRenderer.call(this);
    }
});
cc.ParallaxNode.create = function () {
    return new cc.ParallaxNode();
};
