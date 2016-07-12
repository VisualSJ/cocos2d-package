(function(){
    cc.LabelAtlas.WebGLRenderCmd = function(renderable){
        cc.AtlasNode.WebGLRenderCmd.call(this, renderable);
        this._needDraw = true;
    };
    var proto = cc.LabelAtlas.WebGLRenderCmd.prototype = Object.create(cc.AtlasNode.WebGLRenderCmd.prototype);
    proto.constructor = cc.LabelAtlas.WebGLRenderCmd;
    proto._updateColor = function () {
        if (this._colorF32Array) {
            var locDisplayedColor = this._displayedColor;
            var a = this._displayedOpacity / 255;
            if (this._node._opacityModifyRGB) {
                this._colorF32Array[0] = locDisplayedColor.r * a / 255;
                this._colorF32Array[1] = locDisplayedColor.g * a / 255;
                this._colorF32Array[2] = locDisplayedColor.b * a / 255;
                this._colorF32Array[3] = a;
            }
            else {
                this._colorF32Array[0] = locDisplayedColor.r / 255;
                this._colorF32Array[1] = locDisplayedColor.g / 255;
                this._colorF32Array[2] = locDisplayedColor.b / 255;
                this._colorF32Array[3] = a;
            }
        }
    };
    proto.setCascade = function(){
        var node = this._node;
        node._cascadeOpacityEnabled = true;
        node._cascadeColorEnabled = true;
    };
    proto.rendering = function(ctx){
        cc.AtlasNode.WebGLRenderCmd.prototype.rendering.call(this, ctx);
        if (cc.LABELATLAS_DEBUG_DRAW) {
            var node = this._node;
            var s = node.getContentSize();
            var locRect = node.getBoundingBoxToWorld();
            var posX = locRect.x,
                posY = locRect.y;
                s.width = locRect.width;
                s.height = locRect.height;
            var vertices = [cc.p(posX, posY), cc.p(posX+ s.width, posY),
                cc.p(s.width+posX, s.height+posY), cc.p(posX, posY+s.height)];
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
        var locItemWidth = node._itemWidth;
        var locItemHeight = node._itemHeight;
        for (var i = 0, cr = -1; i < n; i++) {
            var a = locString.charCodeAt(i) - node._mapStartChar.charCodeAt(0);
            var row = a % node._itemsPerRow;
            var col = 0 | (a / node._itemsPerRow);
            if(row < 0 || col < 0)
                continue;
            if(row*locItemWidth + locItemWidth > textureWide || col*locItemHeight + locItemHeight > textureHigh)
                continue;
            cr++;
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
            locQuadBL.vertices.x = (cr * locItemWidth);
            locQuadBL.vertices.y = 0;
            locQuadBL.vertices.z = 0.0;
            locQuadBR.vertices.x = (cr * locItemWidth + locItemWidth);
            locQuadBR.vertices.y = 0;
            locQuadBR.vertices.z = 0.0;
            locQuadTL.vertices.x = cr * locItemWidth;
            locQuadTL.vertices.y = node._itemHeight;
            locQuadTL.vertices.z = 0.0;
            locQuadTR.vertices.x = cr * locItemWidth + locItemWidth;
            locQuadTR.vertices.y = node._itemHeight;
            locQuadTR.vertices.z = 0.0;
        }
        this._updateColor();
        this.updateContentSize(i, cr+1);
        if (n > 0) {
            locTextureAtlas.dirty = true;
            var totalQuads = locTextureAtlas.totalQuads;
            if (n > totalQuads)
                locTextureAtlas.increaseTotalQuadsWith(n - totalQuads);
        }
    };
    proto.updateContentSize = function(i, cr){
        var node = this._node,
            contentSize = node._contentSize;
        if(i !== cr && i*node._itemWidth === contentSize.width && node._itemHeight === contentSize.height){
            node.setContentSize(cr * node._itemWidth, node._itemHeight);
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
        cc.Node.WebGLRenderCmd.call(this, renderableObject);
    };
    var proto = cc.LabelBMFont.WebGLRenderCmd.prototype = Object.create(cc.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.LabelBMFont.WebGLRenderCmd;
    proto.setTexture = function (texture) {
        this._node.setOpacityModifyRGB(this._node._texture.hasPremultipliedAlpha());
    };
    proto._updateCharTexture = function(fontChar, rect, key){
        fontChar.setTextureRect(rect, false);
        fontChar.visible = true;
    };
    proto._changeTextureColor = function(){};
    proto._updateCharColorAndOpacity = function(){};
})();
