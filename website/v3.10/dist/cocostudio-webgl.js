!function(){ccs.Skin.WebGLRenderCmd=function(a){cc.Sprite.WebGLRenderCmd.call(this,a)};var a=ccs.Skin.WebGLRenderCmd.prototype=Object.create(cc.Sprite.WebGLRenderCmd.prototype);cc.inject(ccs.Skin.RenderCmd,a),a.constructor=ccs.Skin.WebGLRenderCmd,a.updateTransform=function(){var a=this._node,b=this._quad;if(a._visible){var c=this.getNodeToParentTransform(),d=a._rect,e=a._offsetPosition.x,f=a._offsetPosition.y,g=e+d.width,h=f+d.height,i=c.tx,j=c.ty,k=c.a,l=c.b,m=c.d,n=-c.c,o=e*k-f*n+i,p=e*l+f*m+j,q=g*k-f*n+i,r=g*l+f*m+j,s=g*k-h*n+i,t=g*l+h*m+j,u=e*k-h*n+i,v=e*l+h*m+j,w=a._vertexZ;cc.SPRITEBATCHNODE_RENDER_SUBPIXEL||(o=0|o,p=0|p,q=0|q,r=0|r,s=0|s,t=0|t,u=0|u,v=0|v),this.SET_VERTEX3F(b.bl.vertices,o,p,w),this.SET_VERTEX3F(b.br.vertices,q,r,w),this.SET_VERTEX3F(b.tl.vertices,u,v,w),this.SET_VERTEX3F(b.tr.vertices,s,t,w)}else b.br.vertices=b.tl.vertices=b.tr.vertices=b.bl.vertices={x:0,y:0,z:0};a.textureAtlas&&a.textureAtlas.updateQuad(b,a.textureAtlas.getTotalQuads()),this._quadDirty=!0},a.SET_VERTEX3F=function(a,b,c,d){a.x=b,a.y=c,a.z=d},a.rendering=function(a){var b=this._node;if(b._textureLoaded){var c=a||cc._renderContext,d=b._texture;if(d&&d._textureLoaded&&(this._shaderProgram.use(),this._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4(),cc.glBlendFunc(b._blendFunc.src,b._blendFunc.dst),cc.glBindTexture2DN(0,d),cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX),c.bindBuffer(c.ARRAY_BUFFER,this._quadWebBuffer),this._quadDirty&&(c.bufferData(c.ARRAY_BUFFER,this._quad.arrayBuffer,c.DYNAMIC_DRAW),this._quadDirty=!1),c.vertexAttribPointer(0,3,c.FLOAT,!1,24,0),c.vertexAttribPointer(1,4,c.UNSIGNED_BYTE,!0,24,12),c.vertexAttribPointer(2,2,c.FLOAT,!1,24,16),c.drawArrays(c.TRIANGLE_STRIP,0,4)),cc.g_NumberOfDraws++,0!==cc.SPRITE_DEBUG_DRAW||b._showNode)if(1===cc.SPRITE_DEBUG_DRAW||b._showNode){var e=this._quad,f=[cc.p(e.tl.vertices.x,e.tl.vertices.y),cc.p(e.bl.vertices.x,e.bl.vertices.y),cc.p(e.br.vertices.x,e.br.vertices.y),cc.p(e.tr.vertices.x,e.tr.vertices.y)];cc._drawingUtil.drawPoly(f,4,!0)}else if(2===cc.SPRITE_DEBUG_DRAW){var g=b.getTextureRect(),h=b.getOffsetPosition(),i=[cc.p(h.x,h.y),cc.p(h.x+g.width,h.y),cc.p(h.x+g.width,h.y+g.height),cc.p(h.x,h.y+g.height)];cc._drawingUtil.drawPoly(i,4,!0)}}}}(),function(){ccs.Armature.WebGLRenderCmd=function(a){cc.Node.WebGLRenderCmd.call(this,a),this._needDraw=!0,this._realAnchorPointInPoints=new cc.Point(0,0)};var a=ccs.Armature.WebGLRenderCmd.prototype=Object.create(cc.Node.WebGLRenderCmd.prototype);cc.inject(ccs.Armature.RenderCmd,a),a.constructor=ccs.Armature.WebGLRenderCmd,a.rendering=function(a,b){var c=this._node;b||(cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW),cc.kmGLPushMatrix(),cc.kmGLLoadMatrix(this._stackMatrix));for(var d=c._children,e=cc.BlendFunc.ALPHA_PREMULTIPLIED,f=cc.BlendFunc.ALPHA_NON_PREMULTIPLIED,g=0,h=d.length;h>g;g++){var i=d[g];if(i&&i.getDisplayRenderNode){var j=i.getDisplayRenderNode();if(null===j)continue;switch(j.setShaderProgram(this._shaderProgram),i.getDisplayRenderNodeType()){case ccs.DISPLAY_TYPE_SPRITE:if(j instanceof ccs.Skin){this._updateColorAndOpacity(j._renderCmd,i),j.updateTransform();var k=i.getBlendFunc();k.src!==e.src||k.dst!==e.dst?j.setBlendFunc(i.getBlendFunc()):c._blendFunc.src!==e.src||c._blendFunc.dst!==e.dst||j.getTexture().hasPremultipliedAlpha()?j.setBlendFunc(c._blendFunc):j.setBlendFunc(f),j._renderCmd.rendering(a)}break;case ccs.DISPLAY_TYPE_ARMATURE:j._renderCmd.rendering(a,!0);break;default:j._renderCmd.transform(),j._renderCmd.rendering(a)}}else i instanceof cc.Node&&(i.setShaderProgram(this._shaderProgram),i._renderCmd.transform(),i._renderCmd.rendering&&i._renderCmd.rendering(a))}b||cc.kmGLPopMatrix()},a.initShaderCache=function(){this._shaderProgram=cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR)},a.setShaderProgram=function(a){this._shaderProgram=a},a._updateColorAndOpacity=function(a,b){var c=b._renderCmd._displayedColor,d=b._renderCmd._displayedOpacity,e=cc.Node._dirtyFlags,f=a._dirtyFlag,g=f&e.colorDirty,h=f&e.opacityDirty;g&&a._updateDisplayColor(c),h&&a._updateDisplayOpacity(d),(g||h)&&a._updateColor()},a.updateChildPosition=function(a,b,c,d,e){var f=this._node;b.updateTransform();var g=c.getBlendFunc();g.src!==d.src||g.dst!==d.dst?b.setBlendFunc(c.getBlendFunc()):f._blendFunc.src!==d.src||node_blendFunc.dst!==d.dst||b.getTexture().hasPremultipliedAlpha()?b.setBlendFunc(f._blendFunc):b.setBlendFunc(e),b.rendering(a)},a.updateStatus=function(){var a=cc.Node._dirtyFlags,b=this._dirtyFlag,c=b&a.colorDirty,d=b&a.opacityDirty;c&&this._updateDisplayColor(),d&&this._updateDisplayOpacity(),(c||d)&&this._updateColor(),b&a.orderDirty&&(this._dirtyFlag=this._dirtyFlag&a.orderDirty^this._dirtyFlag),this.transform(this.getParentRenderCmd(),!0)},a.visit=function(a){var b=this._node;if(b._visible){var c=cc.current_stack;c.stack.push(c.top),this.updateStatus(a),c.top=this._stackMatrix,b.sortAllChildren(),cc.renderer.pushRenderCommand(this),this._dirtyFlag=0,c.top=c.stack.pop()}}}();