cc.LabelAtlas = cc.AtlasNode.extend({
    _string: null,
    _mapStartChar: null,
    _textureLoaded: false,
    _className: "LabelAtlas",
    ctor: function (strText, charMapFile, itemWidth, itemHeight, startCharMap) {
        cc.AtlasNode.prototype.ctor.call(this);
        this._renderCmd.setCascade();
        charMapFile && cc.LabelAtlas.prototype.initWithString.call(this, strText, charMapFile, itemWidth, itemHeight, startCharMap);
    },
    _createRenderCmd: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_WEBGL)
            return new cc.LabelAtlas.WebGLRenderCmd(this);
        else
            return new cc.LabelAtlas.CanvasRenderCmd(this);
    },
    textureLoaded: function () {
        return this._textureLoaded;
    },
    addLoadedEventListener: function (callback, target) {
        this.addEventListener("load", callback, target);
    },
    initWithString: function (strText, charMapFile, itemWidth, itemHeight, startCharMap) {
        var label = strText + "", textureFilename, width, height, startChar;
        if (itemWidth === undefined) {
            var dict = cc.loader.getRes(charMapFile);
            if (parseInt(dict["version"], 10) !== 1) {
                cc.log("cc.LabelAtlas.initWithString(): Unsupported version. Upgrade cocos2d version");
                return false;
            }
            textureFilename = cc.path.changeBasename(charMapFile, dict["textureFilename"]);
            var locScaleFactor = cc.contentScaleFactor();
            width = parseInt(dict["itemWidth"], 10) / locScaleFactor;
            height = parseInt(dict["itemHeight"], 10) / locScaleFactor;
            startChar = String.fromCharCode(parseInt(dict["firstChar"], 10));
        } else {
            textureFilename = charMapFile;
            width = itemWidth || 0;
            height = itemHeight || 0;
            startChar = startCharMap || " ";
        }
        var texture = null;
        if (textureFilename instanceof cc.Texture2D)
            texture = textureFilename;
        else
            texture = cc.textureCache.addImage(textureFilename);
        var locLoaded = texture.isLoaded();
        this._textureLoaded = locLoaded;
        if (!locLoaded) {
            this._string = label;
            texture.addEventListener("load", function (sender) {
                this.initWithTexture(texture, width, height, label.length);
                this.string = this._string;
                this.setColor(this._renderCmd._displayedColor);
                this.dispatchEvent("load");
            }, this);
        }
        if (this.initWithTexture(texture, width, height, label.length)) {
            this._mapStartChar = startChar;
            this.string = label;
            return true;
        }
        return false;
    },
    setColor: function (color3) {
        cc.AtlasNode.prototype.setColor.call(this, color3);
        this._renderCmd.updateAtlasValues();
    },
    getString: function () {
        return this._string;
    },
    addChild: function(child, localZOrder, tag){
        this._renderCmd._addChild(child);
        cc.Node.prototype.addChild.call(this, child, localZOrder, tag);
    },
    updateAtlasValues: function(){
        this._renderCmd.updateAtlasValues();
    },
    setString: function(label){
        label = String(label);
        var len = label.length;
        this._string = label;
        this.setContentSize(len * this._itemWidth, this._itemHeight);
        this._renderCmd.setString(label);
        this._renderCmd.updateAtlasValues();
        this.quadsToDraw = len;
    }
});
(function(){
    var proto = cc.LabelAtlas.prototype;
    cc.defineGetterSetter(proto, "opacity", proto.getOpacity, proto.setOpacity);
    cc.defineGetterSetter(proto, "color", proto.getColor, proto.setColor);
    proto.string;
    cc.defineGetterSetter(proto, "string", proto.getString, proto.setString);
})();
cc.LabelAtlas.create = function (strText, charMapFile, itemWidth, itemHeight, startCharMap) {
    return new cc.LabelAtlas(strText, charMapFile, itemWidth, itemHeight, startCharMap);
};
(function(){
    cc.LabelAtlas.CanvasRenderCmd = function(renderableObject){
        cc.AtlasNode.CanvasRenderCmd.call(this, renderableObject);
        this._needDraw = false;
    };
    var proto = cc.LabelAtlas.CanvasRenderCmd.prototype = Object.create(cc.AtlasNode.CanvasRenderCmd.prototype);
    proto.constructor = cc.LabelAtlas.CanvasRenderCmd;
    proto.setCascade = function(){
        var node = this._node;
        node._cascadeOpacityEnabled = true;
        node._cascadeColorEnabled = false;
    };
    proto.updateAtlasValues = function(){
        var node = this._node;
        var locString = node._string || "";
        var n = locString.length;
        var texture = this._textureToRender;
        var locItemWidth = node._itemWidth , locItemHeight = node._itemHeight;
        for (var i = 0, cr = -1; i < n; i++) {
            var a = locString.charCodeAt(i) - node._mapStartChar.charCodeAt(0);
            var row = parseInt(a % node._itemsPerRow, 10);
            var col = parseInt(a / node._itemsPerRow, 10);
            if(row < 0 || col < 0)
                continue;
            var rect = cc.rect(row * locItemWidth, col * locItemHeight, locItemWidth, locItemHeight);
            var textureContent = texture._contentSize;
            if(rect.x < 0 || rect.y < 0 || rect.x + rect.width > textureContent.width || rect.y + rect.height > textureContent.height)
                continue;
            cr++;
            var c = locString.charCodeAt(i);
            var fontChar = node.getChildByTag(i);
            if (!fontChar) {
                fontChar = new cc.Sprite();
                if (c === 32) {
                    fontChar.init();
                    fontChar.setTextureRect(cc.rect(0, 0, 10, 10), false, cc.size(0, 0));
                } else
                    fontChar.initWithTexture(texture, rect);
                cc.Node.prototype.addChild.call(node, fontChar, 0, i);
            } else {
                if (c === 32) {
                    fontChar.init();
                    fontChar.setTextureRect(cc.rect(0, 0, 10, 10), false, cc.size(0, 0));
                } else {
                    fontChar.initWithTexture(texture, rect);
                    fontChar.visible = true;
                }
            }
            fontChar.setPosition(cr * locItemWidth + locItemWidth / 2, locItemHeight / 2);
        }
        this.updateContentSize(i, cr+1);
    };
    proto.updateContentSize = function(i, cr){
        var node = this._node,
            contentSize = node._contentSize;
        if(i !== cr && i*node._itemWidth === contentSize.width && node._itemHeight === contentSize.height){
            node.setContentSize(cr * node._itemWidth, node._itemHeight);
        }
    };
    proto.setString = function(label){
        var node = this._node;
        if (node._children) {
            var locChildren = node._children;
            var len = locChildren.length;
            for (var i = 0; i < len; i++) {
                var child = locChildren[i];
                if (child && !child._lateChild)
                    child.visible = false;
            }
        }
    };
    proto._addChild = function(){
        child._lateChild = true;
    };
})();
cc.LabelBMFont = cc.SpriteBatchNode.extend({
    _opacityModifyRGB: false,
    _string: "",
    _config: null,
    _fntFile: "",
    _initialString: "",
    _alignment: cc.TEXT_ALIGNMENT_CENTER,
    _width: -1,
    _lineBreakWithoutSpaces: false,
    _imageOffset: null,
    _textureLoaded: false,
    _className: "LabelBMFont",
    _createRenderCmd: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_WEBGL)
            return new cc.LabelBMFont.WebGLRenderCmd(this);
        else
            return new cc.LabelBMFont.CanvasRenderCmd(this);
    },
    _setString: function (newString, needUpdateLabel) {
        if (!needUpdateLabel) {
            this._string = newString;
        } else {
            this._initialString = newString;
        }
        var locChildren = this._children;
        if (locChildren) {
            for (var i = 0; i < locChildren.length; i++) {
                var selNode = locChildren[i];
                if (selNode)
                    selNode.setVisible(false);
            }
        }
        if (this._textureLoaded) {
            this.createFontChars();
            if (needUpdateLabel)
                this.updateLabel();
        }
    },
    ctor: function (str, fntFile, width, alignment, imageOffset) {
        cc.SpriteBatchNode.prototype.ctor.call(this);
        this._imageOffset = cc.p(0, 0);
        this._cascadeColorEnabled = true;
        this._cascadeOpacityEnabled = true;
        this.initWithString(str, fntFile, width, alignment, imageOffset);
    },
    textureLoaded: function () {
        return this._textureLoaded;
    },
    addLoadedEventListener: function (callback, target) {
        this.addEventListener("load", callback, target);
    },
    isOpacityModifyRGB: function () {
        return this._opacityModifyRGB;
    },
    setOpacityModifyRGB: function (opacityModifyRGB) {
        this._opacityModifyRGB = opacityModifyRGB;
        var locChildren = this._children;
        if (locChildren) {
            for (var i = 0; i < locChildren.length; i++) {
                var node = locChildren[i];
                if (node)
                    node.opacityModifyRGB = this._opacityModifyRGB;
            }
        }
    },
    _changeTextureColor: function () {
        this._renderCmd._changeTextureColor();
    },
    /**
     * Initialization of the node, please do not call this function by yourself, you should pass the parameters to constructor to initialize it .
     */
    init: function () {
        return this.initWithString(null, null, null, null, null);
    },
    initWithString: function (str, fntFile, width, alignment, imageOffset) {
        var self = this, theString = str || "";
        if (self._config)
            cc.log("cc.LabelBMFont.initWithString(): re-init is no longer supported");
        var texture;
        if (fntFile) {
            var newConf = cc.loader.getRes(fntFile);
            if (!newConf) {
                cc.log("cc.LabelBMFont.initWithString(): Impossible to create font. Please check file");
                return false;
            }
            self._config = newConf;
            self._fntFile = fntFile;
            texture = cc.textureCache.addImage(newConf.atlasName);
            var locIsLoaded = texture.isLoaded();
            self._textureLoaded = locIsLoaded;
            if (!locIsLoaded) {
                texture.addEventListener("load", function (sender) {
                    var self1 = this;
                    self1._textureLoaded = true;
                    self1.initWithTexture(sender, self1._initialString.length);
                    self1.setString(self1._initialString, true);
                    self1.dispatchEvent("load");
                }, self);
            }
        } else {
            texture = new cc.Texture2D();
            var image = new Image();
            texture.initWithElement(image);
            self._textureLoaded = false;
        }
        if (self.initWithTexture(texture, theString.length)) {
            self._alignment = alignment || cc.TEXT_ALIGNMENT_LEFT;
            self._imageOffset = imageOffset || cc.p(0, 0);
            self._width = (width === undefined) ? -1 : width;
            self._realOpacity = 255;
            self._realColor = cc.color(255, 255, 255, 255);
            self._contentSize.width = 0;
            self._contentSize.height = 0;
            self.setAnchorPoint(0.5, 0.5);
            self.setString(theString, true);
            return true;
        }
        return false;
    },
    createFontChars: function () {
        var self = this;
        var cmd = this._renderCmd;
        var locTexture = cmd._texture || this._texture;
        var nextFontPositionX = 0;
        var tmpSize = cc.size(0, 0);
        var longestLine = 0;
        var quantityOfLines = 1;
        var locStr = self._string;
        var stringLen = locStr ? locStr.length : 0;
        if (stringLen === 0)
            return;
        var i, locCfg = self._config, locKerningDict = locCfg.kerningDict,
            locCommonH = locCfg.commonHeight, locFontDict = locCfg.fontDefDictionary;
        for (i = 0; i < stringLen - 1; i++) {
            if (locStr.charCodeAt(i) === 10) quantityOfLines++;
        }
        var totalHeight = locCommonH * quantityOfLines;
        var nextFontPositionY = -(locCommonH - locCommonH * quantityOfLines);
        var prev = -1;
        var fontDef;
        for (i = 0; i < stringLen; i++) {
            var key = locStr.charCodeAt(i);
            if (key === 0) continue;
            if (key === 10) {
                nextFontPositionX = 0;
                nextFontPositionY -= locCfg.commonHeight;
                continue;
            }
            var kerningAmount = locKerningDict[(prev << 16) | (key & 0xffff)] || 0;
            fontDef = locFontDict[key];
            if (!fontDef) {
                cc.log("cocos2d: LabelBMFont: character not found " + locStr[i]);
                fontDef = {
                    rect: {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    },
                    xOffset: 0,
                    yOffset: 0,
                    xAdvance: 0
                };
            }
            var rect = cc.rect(fontDef.rect.x, fontDef.rect.y, fontDef.rect.width, fontDef.rect.height);
            rect = cc.rectPixelsToPoints(rect);
            rect.x += self._imageOffset.x;
            rect.y += self._imageOffset.y;
            var fontChar = self.getChildByTag(i);
            if (!fontChar) {
                fontChar = new cc.Sprite();
                fontChar.initWithTexture(locTexture, rect, false);
                fontChar._newTextureWhenChangeColor = true;
                this.addChild(fontChar, 0, i);
            } else {
                cmd._updateCharTexture(fontChar, rect, key);
            }
            fontChar.opacityModifyRGB = this._opacityModifyRGB;
            cmd._updateCharColorAndOpacity(fontChar);
            var yOffset = locCfg.commonHeight - fontDef.yOffset;
            var fontPos = cc.p(nextFontPositionX + fontDef.xOffset + fontDef.rect.width * 0.5 + kerningAmount,
                nextFontPositionY + yOffset - rect.height * 0.5 * cc.contentScaleFactor());
            fontChar.setPosition(cc.pointPixelsToPoints(fontPos));
            nextFontPositionX += fontDef.xAdvance + kerningAmount;
            prev = key;
            if (longestLine < nextFontPositionX)
                longestLine = nextFontPositionX;
        }
        if(fontDef && fontDef.xAdvance < fontDef.rect.width)
            tmpSize.width = longestLine - fontDef.xAdvance + fontDef.rect.width;
        else
            tmpSize.width = longestLine;
        tmpSize.height = totalHeight;
        self.setContentSize(cc.sizePixelsToPoints(tmpSize));
    },
    updateString: function (fromUpdate) {
        var self = this;
        var locChildren = self._children;
        if (locChildren) {
            for (var i = 0, li = locChildren.length; i < li; i++) {
                var node = locChildren[i];
                if (node) node.visible = false;
            }
        }
        if (self._config)
            self.createFontChars();
        if (!fromUpdate)
            self.updateLabel();
    },
    getString: function () {
        return this._initialString;
    },
    setString: function (newString, needUpdateLabel) {
        newString = String(newString);
        if (needUpdateLabel == null)
            needUpdateLabel = true;
        if (newString == null || !cc.isString(newString))
            newString = newString + "";
        this._initialString = newString;
        this._setString(newString, needUpdateLabel);
    },
    _setStringForSetter: function (newString) {
        this.setString(newString, false);
    },
    setCString: function (label) {
        this.setString(label, true);
    },
    _getCharsWidth:function (startIndex, endIndex) {
        if (endIndex <= 0)
        {
            return 0;
        }
        var curTextFirstSprite = this.getChildByTag(startIndex);
        var curTextLastSprite = this.getChildByTag(startIndex + endIndex);
        return this._getLetterPosXLeft(curTextLastSprite) - this._getLetterPosXLeft(curTextFirstSprite);
    },
    _checkWarp:function (strArr, i, maxWidth, initStringWrapNum) {
        var self = this;
        var text = strArr[i];
        var curLength = 0;
        for (var strArrIndex = 0; strArrIndex < i; strArrIndex++)
        {
            curLength += strArr[strArrIndex].length;
        }
        curLength = curLength + i - initStringWrapNum;
        var allWidth = self._getCharsWidth(curLength, strArr[i].length - 1);
        if (allWidth > maxWidth && text.length > 1) {
            var fuzzyLen = text.length * ( maxWidth / allWidth ) | 0;
            var tmpText = text.substr(fuzzyLen);
            var width = allWidth - this._getCharsWidth(curLength + fuzzyLen, tmpText.length - 1);
            var sLine;
            var pushNum = 0;
            var checkWhile = 0;
            while (width > maxWidth && checkWhile++ < 100) {
                fuzzyLen *= maxWidth / width;
                fuzzyLen = fuzzyLen | 0;
                tmpText = text.substr(fuzzyLen);
                width = allWidth - this._getCharsWidth(curLength + fuzzyLen, tmpText.length - 1);
            }
            checkWhile = 0;
            while (width < maxWidth && checkWhile++ < 100) {
                if (tmpText) {
                    var exec = cc.LabelTTF._wordRex.exec(tmpText);
                    pushNum = exec ? exec[0].length : 1;
                    sLine = tmpText;
                }
                if (self._lineBreakWithoutSpaces) {
                    pushNum = 0;
                }
                fuzzyLen = fuzzyLen + pushNum;
                tmpText = text.substr(fuzzyLen);
                width = allWidth - this._getCharsWidth(curLength + fuzzyLen, tmpText.length - 1);
            }
            fuzzyLen -= pushNum;
            if (fuzzyLen === 0) {
                fuzzyLen = 1;
                sLine = sLine.substr(1);
            }
            var sText = text.substr(0, fuzzyLen), result;
            if (cc.LabelTTF.wrapInspection) {
                if (cc.LabelTTF._symbolRex.test(sLine || tmpText)) {
                    result = cc.LabelTTF._lastWordRex.exec(sText);
                    pushNum = result ? result[0].length : 0;
                    if (self._lineBreakWithoutSpaces) {
                        pushNum = 0;
                    }
                    fuzzyLen -= pushNum;
                    sLine = text.substr(fuzzyLen);
                    sText = text.substr(0, fuzzyLen);
                }
            }
            if (cc.LabelTTF._firsrEnglish.test(sLine)) {
                result = cc.LabelTTF._lastEnglish.exec(sText);
                if (result && sText !== result[0]) {
                    pushNum = result[0].length;
                    if (self._lineBreakWithoutSpaces) {
                        pushNum = 0;
                    }
                    fuzzyLen -= pushNum;
                    sLine = text.substr(fuzzyLen);
                    sText = text.substr(0, fuzzyLen);
                }
            }
            strArr[i] = sLine || tmpText;
            strArr.splice(i, 0, sText);
        }
    },
    updateLabel: function () {
        var self = this;
        self.string = self._initialString;
        var i, j, characterSprite;
        if (self._width > 0) {
            var stringArr = self.string.split('\n');
            var wrapString = "";
            var newWrapNum = 0;
            var oldArrLength = 0;
            for (i = 0; i < stringArr.length; i++) {
                oldArrLength = stringArr.length;
                this._checkWarp(stringArr, i, self._width * this._scaleX, newWrapNum);
                if (oldArrLength < stringArr.length) {
                    newWrapNum++;
                }
                if (i > 0)
                {
                    wrapString += "\n";
                }
                wrapString += stringArr[i];
            }
            wrapString = wrapString + String.fromCharCode(0);
            self._setString(wrapString, false);
        }
        if (self._alignment !== cc.TEXT_ALIGNMENT_LEFT) {
            i = 0;
            var lineNumber = 0;
            var strlen = self._string.length;
            var last_line = [];
            for (var ctr = 0; ctr < strlen; ctr++) {
                if (self._string[ctr].charCodeAt(0) === 10 || self._string[ctr].charCodeAt(0) === 0) {
                    var lineWidth = 0;
                    var line_length = last_line.length;
                    if (line_length === 0) {
                        lineNumber++;
                        continue;
                    }
                    var index = i + line_length - 1 + lineNumber;
                    if (index < 0) continue;
                    var lastChar = self.getChildByTag(index);
                    if (lastChar == null)
                        continue;
                    lineWidth = lastChar.getPositionX() + lastChar._getWidth() / 2;
                    var shift = 0;
                    switch (self._alignment) {
                        case cc.TEXT_ALIGNMENT_CENTER:
                            shift = self.width / 2 - lineWidth / 2;
                            break;
                        case cc.TEXT_ALIGNMENT_RIGHT:
                            shift = self.width - lineWidth;
                            break;
                        default:
                            break;
                    }
                    if (shift !== 0) {
                        for (j = 0; j < line_length; j++) {
                            index = i + j + lineNumber;
                            if (index < 0) continue;
                            characterSprite = self.getChildByTag(index);
                            if (characterSprite)
                                characterSprite.x += shift;
                        }
                    }
                    i += line_length;
                    lineNumber++;
                    last_line.length = 0;
                    continue;
                }
                last_line.push(self._string[i]);
            }
        }
    },
    setAlignment: function (alignment) {
        this._alignment = alignment;
        this.updateLabel();
    },
    _getAlignment: function () {
        return this._alignment;
    },
    setBoundingWidth: function (width) {
        this._width = width;
        this.updateLabel();
    },
    _getBoundingWidth: function () {
        return this._width;
    },
    setLineBreakWithoutSpace: function (breakWithoutSpace) {
        this._lineBreakWithoutSpaces = breakWithoutSpace;
        this.updateLabel();
    },
    setScale: function (scale, scaleY) {
        cc.Node.prototype.setScale.call(this, scale, scaleY);
        this.updateLabel();
    },
    setScaleX: function (scaleX) {
        cc.Node.prototype.setScaleX.call(this, scaleX);
        this.updateLabel();
    },
    setScaleY: function (scaleY) {
        cc.Node.prototype.setScaleY.call(this, scaleY);
        this.updateLabel();
    },
    setFntFile: function (fntFile) {
        var self = this;
        if (fntFile != null && fntFile !== self._fntFile) {
            var newConf = cc.loader.getRes(fntFile);
            if (!newConf) {
                cc.log("cc.LabelBMFont.setFntFile() : Impossible to create font. Please check file");
                return;
            }
            self._fntFile = fntFile;
            self._config = newConf;
            var texture = cc.textureCache.addImage(newConf.atlasName);
            var locIsLoaded = texture.isLoaded();
            self._textureLoaded = locIsLoaded;
            if (!locIsLoaded) {
                texture.addEventListener("load", function (sender) {
                    var self1 = this;
                    self1._textureLoaded = true;
                    self1.setTexture(sender);
                    self1.createFontChars();
                    self1._changeTextureColor();
                    self1.updateLabel();
                    self1.dispatchEvent("load");
                }, self);
            } else {
                self.setTexture(texture);
                self.createFontChars();
            }
        }
    },
    getFntFile: function () {
        return this._fntFile;
    },
    setTexture: function(texture){
        this._texture = texture;
        this._renderCmd.setTexture(texture);
    },
    setAnchorPoint: function (point, y) {
        cc.Node.prototype.setAnchorPoint.call(this, point, y);
        this.updateLabel();
    },
    _setAnchorX: function (x) {
        cc.Node.prototype._setAnchorX.call(this, x);
        this.updateLabel();
    },
    _setAnchorY: function (y) {
        cc.Node.prototype._setAnchorY.call(this, y);
        this.updateLabel();
    },
    _atlasNameFromFntFile: function (fntFile) {},
    _kerningAmountForFirst: function (first, second) {
        var ret = 0;
        var key = (first << 16) | (second & 0xffff);
        if (this._configuration.kerningDictionary) {
            var element = this._configuration.kerningDictionary[key.toString()];
            if (element)
                ret = element.amount;
        }
        return ret;
    },
    _getLetterPosXLeft: function (sp) {
        return sp.getPositionX() * this._scaleX - (sp._getWidth() * this._scaleX * sp._getAnchorX());
    },
    _getLetterPosXRight: function (sp) {
        return sp.getPositionX() * this._scaleX + (sp._getWidth() * this._scaleX * sp._getAnchorX());
    },
    _isspace_unicode: function(ch){
        ch = ch.charCodeAt(0);
        return  ((ch >= 9 && ch <= 13) || ch === 32 || ch === 133 || ch === 160 || ch === 5760
            || (ch >= 8192 && ch <= 8202) || ch === 8232 || ch === 8233 || ch === 8239
            || ch === 8287 || ch === 12288)
    },
    _utf8_trim_ws: function(str){
        var len = str.length;
        if (len <= 0)
            return;
        var last_index = len - 1;
        if (this._isspace_unicode(str[last_index])) {
            for (var i = last_index - 1; i >= 0; --i) {
                if (this._isspace_unicode(str[i])) {
                    last_index = i;
                }
                else {
                    break;
                }
            }
            this._utf8_trim_from(str, last_index);
        }
    },
    _utf8_trim_from: function(str, index){
        var len = str.length;
        if (index >= len || index < 0)
            return;
        str.splice(index, len);
    }
});
(function(){
    var p = cc.LabelBMFont.prototype;
    cc.EventHelper.prototype.apply(p);
    p.string;
    cc.defineGetterSetter(p, "string", p.getString, p._setStringForSetter);
    p.boundingWidth;
    cc.defineGetterSetter(p, "boundingWidth", p._getBoundingWidth, p.setBoundingWidth);
    p.textAlign;
    cc.defineGetterSetter(p, "textAlign", p._getAlignment, p.setAlignment);
    cc.defineGetterSetter(p, "texture", p.getTexture, p.setTexture);
})();
cc.LabelBMFont.create = function (str, fntFile, width, alignment, imageOffset) {
    return new cc.LabelBMFont(str, fntFile, width, alignment, imageOffset);
};
var _fntLoader = {
    INFO_EXP: /info [^\n]*(\n|$)/gi,
    COMMON_EXP: /common [^\n]*(\n|$)/gi,
    PAGE_EXP: /page [^\n]*(\n|$)/gi,
    CHAR_EXP: /char [^\n]*(\n|$)/gi,
    KERNING_EXP: /kerning [^\n]*(\n|$)/gi,
    ITEM_EXP: /\w+=[^ \r\n]+/gi,
    INT_EXP: /^[\-]?\d+$/,
    _parseStrToObj: function (str) {
        var arr = str.match(this.ITEM_EXP);
        var obj = {};
        if (arr) {
            for (var i = 0, li = arr.length; i < li; i++) {
                var tempStr = arr[i];
                var index = tempStr.indexOf("=");
                var key = tempStr.substring(0, index);
                var value = tempStr.substring(index + 1);
                if (value.match(this.INT_EXP)) value = parseInt(value);
                else if (value[0] === '"') value = value.substring(1, value.length - 1);
                obj[key] = value;
            }
        }
        return obj;
    },
    parseFnt: function (fntStr, url) {
        var self = this, fnt = {};
        var infoObj = self._parseStrToObj(fntStr.match(self.INFO_EXP)[0]);
        var paddingArr = infoObj["padding"].split(",");
        var padding = {
            left: parseInt(paddingArr[0]),
            top: parseInt(paddingArr[1]),
            right: parseInt(paddingArr[2]),
            bottom: parseInt(paddingArr[3])
        };
        var commonObj = self._parseStrToObj(fntStr.match(self.COMMON_EXP)[0]);
        fnt.commonHeight = commonObj["lineHeight"];
        if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            var texSize = cc.configuration.getMaxTextureSize();
            if (commonObj["scaleW"] > texSize.width || commonObj["scaleH"] > texSize.height)
                cc.log("cc.LabelBMFont._parseCommonArguments(): page can't be larger than supported");
        }
        if (commonObj["pages"] !== 1) cc.log("cc.LabelBMFont._parseCommonArguments(): only supports 1 page");
        var pageObj = self._parseStrToObj(fntStr.match(self.PAGE_EXP)[0]);
        if (pageObj["id"] !== 0) cc.log("cc.LabelBMFont._parseImageFileName() : file could not be found");
        fnt.atlasName = cc.path.changeBasename(url, pageObj["file"]);
        var charLines = fntStr.match(self.CHAR_EXP);
        var fontDefDictionary = fnt.fontDefDictionary = {};
        for (var i = 0, li = charLines.length; i < li; i++) {
            var charObj = self._parseStrToObj(charLines[i]);
            var charId = charObj["id"];
            fontDefDictionary[charId] = {
                rect: {x: charObj["x"], y: charObj["y"], width: charObj["width"], height: charObj["height"]},
                xOffset: charObj["xoffset"],
                yOffset: charObj["yoffset"],
                xAdvance: charObj["xadvance"]
            };
        }
        var kerningDict = fnt.kerningDict = {};
        var kerningLines = fntStr.match(self.KERNING_EXP);
        if (kerningLines) {
            for (var i = 0, li = kerningLines.length; i < li; i++) {
                var kerningObj = self._parseStrToObj(kerningLines[i]);
                kerningDict[(kerningObj["first"] << 16) | (kerningObj["second"] & 0xffff)] = kerningObj["amount"];
            }
        }
        return fnt;
    },
    load: function (realUrl, url, res, cb) {
        var self = this;
        cc.loader.loadTxt(realUrl, function (err, txt) {
            if (err) return cb(err);
            cb(null, self.parseFnt(txt, url));
        });
    }
};
cc.loader.register(["fnt"], _fntLoader);
(function(){
    cc.LabelBMFont.CanvasRenderCmd = function(renderableObject){
        cc.Node.CanvasRenderCmd.call(this, renderableObject);
    };
    var proto = cc.LabelBMFont.CanvasRenderCmd.prototype = Object.create(cc.Node.CanvasRenderCmd.prototype);
    proto.constructor = cc.LabelBMFont.CanvasRenderCmd;
    proto._updateCharTexture = function(fontChar, rect, key){
        if (key === 32) {
            fontChar.setTextureRect(rect, false, cc.size(0, 0));
        } else {
            fontChar.setTextureRect(rect, false);
            fontChar.visible = true;
        }
    };
    proto._updateCharColorAndOpacity = function(fontChar){
        fontChar._displayedColor = this._displayedColor;
        fontChar._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.colorDirty);
        fontChar._displayedOpacity = this._displayedOpacity;
        fontChar._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty);
    };
    proto.setTexture = function (texture) {
        var node = this._node;
        var locChildren = node._children;
        var locDisplayedColor = this._displayedColor;
        for (var i = 0; i < locChildren.length; i++) {
            var selChild = locChildren[i];
            var cm = selChild._renderCmd;
            var childDColor = cm._displayedColor;
            if (node._texture !== cm._texture && (childDColor.r !== locDisplayedColor.r ||
                childDColor.g !== locDisplayedColor.g || childDColor.b !== locDisplayedColor.b))
                continue;
            selChild.texture = texture;
        }
        node._texture = texture;
    };
    proto._changeTextureColor = function(){
        var node = this._node;
        var texture = node._texture,
            contentSize = texture.getContentSize();
        var oTexture = node._texture,
            oElement = oTexture.getHtmlElementObj();
        var disColor = this._displayedColor;
        var textureRect = cc.rect(0, 0, oElement.width, oElement.height);
        if (texture && contentSize.width > 0) {
            if(!oElement)
                return;
            var textureToRender = oTexture._generateColorTexture(disColor.r, disColor.g, disColor.b, textureRect);
            node.setTexture(textureToRender);
        }
    };
    proto._updateChildrenDisplayedOpacity = function(locChild){
        cc.Node.prototype.updateDisplayedOpacity.call(locChild, this._displayedOpacity);
    };
    proto._updateChildrenDisplayedColor = function(locChild){
        cc.Node.prototype.updateDisplayedColor.call(locChild, this._displayedColor);
    };
})();
