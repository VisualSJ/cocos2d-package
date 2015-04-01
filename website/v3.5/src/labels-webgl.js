(function(){
    cc.LabelAtlas.WebGLRenderCmd = function(renderable){
        cc.AtlasNode.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
    };
    var proto = cc.LabelAtlas.WebGLRenderCmd.prototype = Object.create(cc.AtlasNode.WebGLRenderCmd.prototype);
    proto.constructor = cc.LabelAtlas.WebGLRenderCmd;
    proto.setCascade = function(){
        var node = this._node;
        node._cascadeOpacityEnabled = true;
        node._cascadeColorEnabled = true;
    };
    proto.rendering = function(ctx){
        cc.AtlasNode.WebGLRenderCmd.prototype.rendering.call(this, ctx);
        if (cc.LABELATLAS_DEBUG_DRAW) {
            var s = this._node.getContentSize();
            var vertices = [cc.p(0, 0), cc.p(s.width, 0),
                cc.p(s.width, s.height), cc.p(0, s.height)];
            cc._drawingUtil.drawPoly(vertices, 4, true);
        }
    };
    proto.updateAtlasValues = function(){
        var node = this._node;
        var locString = node._string;
        var n = locString.length;
        var locTextureAtlas = this._textureAtlas;
        var texture = locTextureAtlas.texture;
        var textureWide = texture.pixelsWidth;
        var textureHigh = texture.pixelsHeight;
        var itemWidthInPixels = node._itemWidth;
        var itemHeightInPixels = node._itemHeight;
        if (!node._ignoreContentScaleFactor) {
            itemWidthInPixels = node._itemWidth * cc.contentScaleFactor();
            itemHeightInPixels = node._itemHeight * cc.contentScaleFactor();
        }
        if (n > locTextureAtlas.getCapacity())
            cc.log("cc.LabelAtlas._updateAtlasValues(): Invalid String length");
        var quads = locTextureAtlas.quads;
        var locDisplayedColor = this._displayedColor;
        var curColor = {r: locDisplayedColor.r, g: locDisplayedColor.g, b: locDisplayedColor.b, a: node._displayedOpacity};
        var locItemWidth = node._itemWidth;
        for (var i = 0; i < n; i++) {
            var a = locString.charCodeAt(i) - node._mapStartChar.charCodeAt(0);
            var row = a % node._itemsPerRow;
            var col = 0 | (a / node._itemsPerRow);
            var left, right, top, bottom;
            if (cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL) {
                left = (2 * row * itemWidthInPixels + 1) / (2 * textureWide);
                right = left + (itemWidthInPixels * 2 - 2) / (2 * textureWide);
                top = (2 * col * itemHeightInPixels + 1) / (2 * textureHigh);
                bottom = top + (itemHeightInPixels * 2 - 2) / (2 * textureHigh);
            } else {
                left = row * itemWidthInPixels / textureWide;
                right = left + itemWidthInPixels / textureWide;
                top = col * itemHeightInPixels / textureHigh;
                bottom = top + itemHeightInPixels / textureHigh;
            }
            var quad = quads[i];
            var locQuadTL = quad.tl, locQuadTR = quad.tr, locQuadBL = quad.bl, locQuadBR = quad.br;
            locQuadTL.texCoords.u = left;
            locQuadTL.texCoords.v = top;
            locQuadTR.texCoords.u = right;
            locQuadTR.texCoords.v = top;
            locQuadBL.texCoords.u = left;
            locQuadBL.texCoords.v = bottom;
            locQuadBR.texCoords.u = right;
            locQuadBR.texCoords.v = bottom;
            locQuadBL.vertices.x = (i * locItemWidth);
            locQuadBL.vertices.y = 0;
            locQuadBL.vertices.z = 0.0;
            locQuadBR.vertices.x = (i * locItemWidth + locItemWidth);
            locQuadBR.vertices.y = 0;
            locQuadBR.vertices.z = 0.0;
            locQuadTL.vertices.x = i * locItemWidth;
            locQuadTL.vertices.y = node._itemHeight;
            locQuadTL.vertices.z = 0.0;
            locQuadTR.vertices.x = i * locItemWidth + locItemWidth;
            locQuadTR.vertices.y = node._itemHeight;
            locQuadTR.vertices.z = 0.0;
            locQuadTL.colors = curColor;
            locQuadTR.colors = curColor;
            locQuadBL.colors = curColor;
            locQuadBR.colors = curColor;
        }
        if (n > 0) {
            locTextureAtlas.dirty = true;
            var totalQuads = locTextureAtlas.totalQuads;
            if (n > totalQuads)
                locTextureAtlas.increaseTotalQuadsWith(n - totalQuads);
        }
    };
    proto.setString = function(label){
        var len = label.length;
        if (len > this._textureAtlas.totalQuads)
            this._textureAtlas.resizeCapacity(len);
    };
    proto._addChild = function(){};
})();
(function(){
    cc.LabelBMFont.WebGLRenderCmd = function(renderableObject){
        cc.SpriteBatchNode.WebGLRenderCmd.call(this, renderableObject);
        this._needDraw = true;
    };
    var proto = cc.LabelBMFont.WebGLRenderCmd.prototype = Object.create(cc.SpriteBatchNode.WebGLRenderCmd.prototype);
    proto.constructor = cc.LabelBMFont.WebGLRenderCmd;
    proto._updateCharTexture = function(fontChar, rect, key){
        fontChar.setTextureRect(rect, false);
        fontChar.visible = true;
    };
    proto._updateFntFileTexture = function(){};
    proto._changeTextureColor = function(){};
    proto._updateChildrenDisplayedOpacity = function(locChild){
        locChild.updateDisplayedOpacity(this._displayedOpacity);
    };
    proto._updateChildrenDisplayedColor = function(locChild){
        locChild.updateDisplayedColor(this._displayedColor);
    };
    proto._initBatchTexture = function(){
        var node  = this._node;
        var locTexture = node.textureAtlas.texture;
        node._opacityModifyRGB = locTexture.hasPremultipliedAlpha();
        var reusedChar = node._reusedChar = new cc.Sprite();
        reusedChar.initWithTexture(locTexture, cc.rect(0, 0, 0, 0), false);
        reusedChar.batchNode = node;
    };
    proto.rendering = function(ctx){
        cc.SpriteBatchNode.WebGLRenderCmd.prototype.rendering.call(this, ctx);
        var node = this._node;
        if (cc.LABELBMFONT_DEBUG_DRAW) {
            var size = node.getContentSize();
            var pos = cc.p(0 | ( -this._anchorPointInPoints.x), 0 | ( -this._anchorPointInPoints.y));
            var vertices = [cc.p(pos.x, pos.y), cc.p(pos.x + size.width, pos.y), cc.p(pos.x + size.width, pos.y + size.height), cc.p(pos.x, pos.y + size.height)];
            cc._drawingUtil.setDrawColor(0, 255, 0, 255);
            cc._drawingUtil.drawPoly(vertices, 4, true);
        }
    };
    proto._updateCharColorAndOpacity = function(){};
})();
