cc.SpriteBatchNode=cc.Node.extend({_blendFunc:null,_descendants:null,_className:"SpriteBatchNode",ctor:function(a,b){cc.Node.prototype.ctor.call(this),this._descendants=[],this._blendFunc=new cc.BlendFunc(cc.BLEND_SRC,cc.BLEND_DST);var c;b=b||cc.SpriteBatchNode.DEFAULT_CAPACITY,cc.isString(a)?(c=cc.textureCache.getTextureForKey(a),c||(c=cc.textureCache.addImage(a))):a instanceof cc.Texture2D&&(c=a),c&&this.initWithTexture(c,b)},addSpriteWithoutQuad:function(a,b,c){if(cc.assert(a,cc._LogInfos.SpriteBatchNode_addSpriteWithoutQuad_2),!(a instanceof cc.Sprite))return cc.log(cc._LogInfos.SpriteBatchNode_addSpriteWithoutQuad),null;a.atlasIndex=b;var d,e=0,f=this._descendants;if(f&&f.length>0)for(e=0,d=f.length;d>e;e++){var g=f[e];if(g&&g.atlasIndex>=b)break}return f.splice(e,0,a),cc.Node.prototype.addChild.call(this,a,b,c),this.reorderBatch(!1),this},getTextureAtlas:function(){return this._renderCmd.getTextureAtlas()},setTextureAtlas:function(a){this._renderCmd.getTextureAtlas(a)},getDescendants:function(){return this._descendants},initWithFile:function(a,b){var c=cc.textureCache.getTextureForKey(a);return c||(c=cc.textureCache.addImage(a)),this.initWithTexture(c,b)},_setNodeDirtyForCache:function(){this._renderCmd&&this._renderCmd._setNodeDirtyForCache&&this._renderCmd._setNodeDirtyForCache()},init:function(a,b){var c=cc.textureCache.getTextureForKey(a);return c||(c=cc.textureCache.addImage(a)),this.initWithTexture(c,b)},increaseAtlasCapacity:function(){this._renderCmd.increaseAtlasCapacity()},removeChildAtIndex:function(a,b){this.removeChild(this._children[a],b)},rebuildIndexInOrder:function(a,b){var c=a.children;if(c&&c.length>0)for(var d=0;d<c.length;d++){var e=c[d];e&&e.zIndex<0&&(b=this.rebuildIndexInOrder(e,b))}if(!a===this&&(a.atlasIndex=b,b++),c&&c.length>0)for(d=0;d<c.length;d++)e=c[d],e&&e.zIndex>=0&&(b=this.rebuildIndexInOrder(e,b));return b},highestAtlasIndexInChild:function(a){var b=a.children;return b&&0!==b.length?this.highestAtlasIndexInChild(b[b.length-1]):a.atlasIndex},lowestAtlasIndexInChild:function(a){var b=a.children;return b&&0!==b.length?this.lowestAtlasIndexInChild(b[b.length-1]):a.atlasIndex},atlasIndexForChild:function(a,b){var c=a.parent,d=c.children,e=d.indexOf(a),f=c===this,g=null;return e>0&&e<cc.UINT_MAX&&(g=d[e-1]),f?0===e?0:this.highestAtlasIndexInChild(g)+1:0===e?0>b?c.atlasIndex:c.atlasIndex+1:g.zIndex<0&&0>b||g.zIndex>=0&&b>=0?this.highestAtlasIndexInChild(g)+1:c.atlasIndex+1},reorderBatch:function(a){this._reorderChildDirty=a},setBlendFunc:function(a,b){void 0===b?this._blendFunc=a:this._blendFunc={src:a,dst:b}},getBlendFunc:function(){return new cc.BlendFunc(this._blendFunc.src,this._blendFunc.dst)},reorderChild:function(a,b){return cc.assert(a,cc._LogInfos.SpriteBatchNode_reorderChild_2),-1===this._children.indexOf(a)?void cc.log(cc._LogInfos.SpriteBatchNode_reorderChild):void(b!==a.zIndex&&cc.Node.prototype.reorderChild.call(this,a,b))},removeChild:function(a,b){if(null!=a){if(-1===this._children.indexOf(a))return void cc.log(cc._LogInfos.SpriteBatchNode_removeChild);this.removeSpriteFromAtlas(a),cc.Node.prototype.removeChild.call(this,a,b)}},updateQuadFromSprite:function(a,b){return cc.assert(a,cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite_2),a instanceof cc.Sprite?(this._renderCmd.checkAtlasCapacity(),a.batchNode=this,a.atlasIndex=b,a.dirty=!0,void a.updateTransform()):void cc.log(cc._LogInfos.CCSpriteBatchNode_updateQuadFromSprite)},insertQuadFromSprite:function(a,b){return cc.assert(a,cc._LogInfos.CCSpriteBatchNode_insertQuadFromSprite_2),a instanceof cc.Sprite?(this._renderCmd.insertQuad(a,b),a.batchNode=this,a.atlasIndex=b,a.dirty=!0,a.updateTransform(),void this._renderCmd.cutting(a,b)):void cc.log(cc._LogInfos.CCSpriteBatchNode_insertQuadFromSprite)},initWithTexture:function(a,b){return this._children.length=0,this._descendants.length=0,b=b||cc.SpriteBatchNode.DEFAULT_CAPACITY,this._renderCmd.initWithTexture(a,b),!0},insertChild:function(a,b){a.batchNode=this,a.atlasIndex=b,a.dirty=!0,this._renderCmd.insertQuad(a,b),this._descendants.splice(b,0,a);var c=b+1,d=this._descendants;if(d&&d.length>0)for(;c<d.length;c++)d[c].atlasIndex++;var e,f,g=a.children;if(g)for(c=0,f=g.length||0;f>c;c++)if(e=g[c]){var h=this.atlasIndexForChild(e,e.zIndex);this.insertChild(e,h)}},appendChild:function(a){this._reorderChildDirty=!0,a.batchNode=this,a.dirty=!0,this._descendants.push(a);var b=this._descendants.length-1;a.atlasIndex=b,this._renderCmd.insertQuad(a,b);for(var c=a.children,d=0,e=c.length||0;e>d;d++)this.appendChild(c[d])},removeSpriteFromAtlas:function(a){this._renderCmd.removeQuadAtIndex(a.atlasIndex),a.batchNode=null;var b=this._descendants,c=b.indexOf(a);if(-1!==c){b.splice(c,1);for(var d=b.length;d>c;++c){var e=b[c];e.atlasIndex--}}var f=a.children;if(f)for(var g=0,h=f.length||0;h>g;g++)f[g]&&this.removeSpriteFromAtlas(f[g])},getTexture:function(){return this._renderCmd.getTexture()},setTexture:function(a){this._renderCmd.setTexture(a)},addChild:function(a,b,c){cc.assert(null!=a,cc._LogInfos.CCSpriteBatchNode_addChild_3),this._renderCmd.isValidChild(a)&&(b=null==b?a.zIndex:b,c=null==c?a.tag:c,cc.Node.prototype.addChild.call(this,a,b,c),this.appendChild(a))},removeAllChildren:function(a){var b=this._descendants;if(b&&b.length>0)for(var c=0,d=b.length;d>c;c++)b[c]&&(b[c].batchNode=null);cc.Node.prototype.removeAllChildren.call(this,a),this._descendants.length=0,this._renderCmd.removeAllQuads()},sortAllChildren:function(){if(this._reorderChildDirty){var a,b,c=this._children,d=0,e=c.length;for(a=1;e>a;a++){var f=c[a];for(d=a-1,b=c[d];d>=0&&(f._localZOrder<b._localZOrder||f._localZOrder===b._localZOrder&&f.arrivalOrder<b.arrivalOrder);)c[d+1]=b,d-=1,b=c[d];c[d+1]=f}c.length>0&&(this._arrayMakeObjectsPerformSelector(c,cc.Node._stateCallbackType.sortAllChildren),this._renderCmd.updateChildrenAtlasIndex(c)),this._reorderChildDirty=!1}},_createRenderCmd:function(){return cc._renderType===cc._RENDER_TYPE_CANVAS?new cc.SpriteBatchNode.CanvasRenderCmd(this):new cc.SpriteBatchNode.WebGLRenderCmd(this)}});var _p=cc.SpriteBatchNode.prototype;cc.defineGetterSetter(_p,"texture",_p.getTexture,_p.setTexture),cc.defineGetterSetter(_p,"textureAtlas",_p.getTextureAtlas,_p.setTextureAtlas),_p.descendants,cc.defineGetterSetter(_p,"descendants",_p.getDescendants),cc.SpriteBatchNode.DEFAULT_CAPACITY=29,cc.SpriteBatchNode.create=function(a,b){return new cc.SpriteBatchNode(a,b)},cc.SpriteBatchNode.createWithTexture=cc.SpriteBatchNode.create,function(){cc.SpriteBatchNode.CanvasRenderCmd=function(a){cc.Node.CanvasRenderCmd.call(this,a),this._texture=null,this._originalTexture=null};var a=cc.SpriteBatchNode.CanvasRenderCmd.prototype=Object.create(cc.Node.CanvasRenderCmd.prototype);a.constructor=cc.SpriteBatchNode.CanvasRenderCmd,a.checkAtlasCapacity=function(){},a.isValidChild=function(a){return a instanceof cc.Sprite?!0:(cc.log(cc._LogInfos.Sprite_addChild_4),!1)},a.initWithTexture=function(a,b){this._originalTexture=a,this._texture=a},a.insertQuad=function(a,b){},a.increaseAtlasCapacity=function(){},a.removeQuadAtIndex=function(){},a.removeAllQuads=function(){},a.getTexture=function(){return this._texture},a.setTexture=function(a){this._texture=a;for(var b=this._node._children,c=0;c<b.length;c++)b[c].setTexture(a)},a.updateChildrenAtlasIndex=function(a){this._node._descendants.length=0;for(var b=0,c=a.length;c>b;b++)this._updateAtlasIndex(a[b])},a._updateAtlasIndex=function(a){var b,c=this._node._descendants,d=a.children,e=d.length;for(b=0;e>b&&d[b]._localZOrder<0;b++)c.push(d[b]);for(c.push(a);e>b;b++)c.push(d[b])},a.getTextureAtlas=function(){},a.setTextureAtlas=function(a){},a.cutting=function(a,b){var c=this._node;c._children.splice(b,0,a)}}();