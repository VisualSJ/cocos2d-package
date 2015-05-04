(function(){
    cc.TMXLayer.WebGLRenderCmd = function(renderableObject){
        cc.SpriteBatchNode.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
    };
    var proto = cc.TMXLayer.WebGLRenderCmd.prototype = Object.create(cc.SpriteBatchNode.WebGLRenderCmd.prototype);
    proto.constructor = cc.TMXLayer.WebGLRenderCmd;
    proto._updateCacheContext = function(){};
    proto.initImageSize = function(){
        var node = this._node;
        node.tileset.imageSize = this._textureAtlas.texture.getContentSizeInPixels();
        this._textureAtlas.texture.setAliasTexParameters();
    };
    proto._reusedTileWithRect = function(rect){
        var node = this._node;
        if (!node._reusedTile) {
            node._reusedTile = new cc.Sprite();
            node._reusedTile.initWithTexture(node.texture, rect, false);
            node._reusedTile.batchNode = node;
        } else {
            node._reusedTile.batchNode = null;
            node._reusedTile.setTextureRect(rect, false);
            node._reusedTile.batchNode = node;
        }
        return node._reusedTile;
    };
})();
