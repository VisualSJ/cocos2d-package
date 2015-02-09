!function(){cc.ProtectedNode.WebGLRenderCmd=function(a){cc.Node.WebGLRenderCmd.call(this,a)};var a=cc.ProtectedNode.WebGLRenderCmd.prototype=Object.create(cc.Node.WebGLRenderCmd.prototype);cc.inject(cc.ProtectedNode.RenderCmd,a),a.constructor=cc.ProtectedNode.WebGLRenderCmd,a.visit=function(a){var b=this._node;if(b._visible){var c,d,e=cc.current_stack;e.stack.push(e.top),this._syncStatus(a),e.top=this._stackMatrix;var f=b.grid;f&&f._active&&f.beforeDraw();var g=b._children,h=b._protectedChildren,i=g.length,j=h.length;b.sortAllChildren(),b.sortAllProtectedChildren();var k;for(c=0;i>c&&(g[c]&&g[c]._localZOrder<0);c++)g[c].visit(this);for(d=0;j>d&&(k=h[d],k&&k._localZOrder<0);d++)this._changeProtectedChild(k),k.visit(this);for(cc.renderer.pushRenderCommand(this);i>c;c++)g[c]&&g[c].visit(this);for(;j>d;d++)k=h[d],k&&(this._changeProtectedChild(k),k.visit(this));f&&f._active&&f.afterDraw(b),this._dirtyFlag=0,e.top=e.stack.pop()}},a.transform=function(a,b){var c=this._node,d=this._transform4x4,e=this._stackMatrix,f=a?a._stackMatrix:cc.current_stack.top,g=c.getNodeToParentTransform();c._changePosition&&c._changePosition(),this._dirtyFlag=this._dirtyFlag&cc.Node._dirtyFlags.transformDirty^this._dirtyFlag;var h=d.mat;if(h[0]=g.a,h[4]=g.c,h[12]=g.tx,h[1]=g.b,h[5]=g.d,h[13]=g.ty,h[14]=c._vertexZ,cc.kmMat4Multiply(e,f,d),null!=c._camera&&(null==c.grid||!c.grid.isActive())){var i=this._anchorPointInPoints.x,j=this._anchorPointInPoints.y,k=0!==i||0!==j;if(k){cc.SPRITEBATCHNODE_RENDER_SUBPIXEL||(i=0|i,j=0|j);var l=new cc.kmMat4;cc.kmMat4Translation(l,i,j,0),cc.kmMat4Multiply(e,e,l),c._camera._locateForRenderer(e),cc.kmMat4Translation(l,-i,-j,0),cc.kmMat4Multiply(e,e,l)}else c._camera._locateForRenderer(e)}var m,n,o=c._children;if(b&&o&&0!==o.length)for(m=0,n=o.length;n>m;m++)o[m]._renderCmd.transform(this,b);if(o=c._protectedChildren,b&&o&&0!==o.length)for(m=0,n=o.length;n>m;m++)o[m]._renderCmd.transform(this,b)}}(),function(){ccui.Scale9Sprite.WebGLRenderCmd=function(a){cc.Node.WebGLRenderCmd.call(this,a),this._cachedParent=null,this._cacheDirty=!1};var a=ccui.Scale9Sprite.WebGLRenderCmd.prototype=Object.create(cc.Node.WebGLRenderCmd.prototype);a.constructor=ccui.Scale9Sprite.WebGLRenderCmd,a.visit=function(a){var b=this._node;b._visible&&(b._positionsAreDirty&&(b._updatePositions(),b._positionsAreDirty=!1,b._scale9Dirty=!0),cc.Node.WebGLRenderCmd.prototype.visit.call(this,a))},a.transform=function(a,b){var c=this._node;cc.Node.WebGLRenderCmd.prototype.transform.call(this,a,b),c._positionsAreDirty&&(c._updatePositions(),c._positionsAreDirty=!1,c._scale9Dirty=!0)},a._updateDisplayColor=function(a){cc.Node.WebGLRenderCmd.prototype._updateDisplayColor.call(this,a);var b=this._node._scale9Image;if(b)for(var c=b.getChildren(),d=0;d<c.length;d++){var e=c[d];e&&(e._renderCmd._updateDisplayColor(a),e._renderCmd._updateColor())}},a._updateDisplayOpacity=function(a){cc.Node.WebGLRenderCmd.prototype._updateDisplayOpacity.call(this,a);var b=this._node._scale9Image;if(b)for(var c=b.getChildren(),d=0;d<c.length;d++){var e=c[d];e&&(e._renderCmd._updateDisplayOpacity(a),e._renderCmd._updateColor())}},a.setState=function(a){var b=this._node._scale9Image;null!=b&&(a===ccui.Scale9Sprite.state.NORMAL?b.setShaderProgram(cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR)):a===ccui.Scale9Sprite.state.GRAY&&b.setShaderProgram(ccui.Scale9Sprite.WebGLRenderCmd._getGrayShaderProgram()))},ccui.Scale9Sprite.WebGLRenderCmd._grayShaderProgram=null,ccui.Scale9Sprite.WebGLRenderCmd._getGrayShaderProgram=function(){var a=ccui.Scale9Sprite.WebGLRenderCmd._grayShaderProgram;return a?a:(a=new cc.GLProgram,a.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT,ccui.Scale9Sprite.WebGLRenderCmd._grayShaderFragment),a.addAttribute(cc.ATTRIBUTE_NAME_POSITION,cc.VERTEX_ATTRIB_POSITION),a.addAttribute(cc.ATTRIBUTE_NAME_COLOR,cc.VERTEX_ATTRIB_COLOR),a.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD,cc.VERTEX_ATTRIB_TEX_COORDS),a.link(),a.updateUniforms(),ccui.Scale9Sprite.WebGLRenderCmd._grayShaderProgram=a,a)},ccui.Scale9Sprite.WebGLRenderCmd._grayShaderFragment="precision lowp float;\nvarying vec4 v_fragmentColor; \nvarying vec2 v_texCoord; \nvoid main() \n{ \n    vec4 c = texture2D(CC_Texture0, v_texCoord); \n    gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b); \n     gl_FragColor.w = c.w ; \n}"}(),function(){ccui.Layout.WebGLRenderCmd=function(a){ccui.ProtectedNode.WebGLRenderCmd.call(this,a),this._needDraw=!1,this._currentStencilEnabled=0,this._currentStencilWriteMask=0,this._currentStencilFunc=0,this._currentStencilRef=0,this._currentStencilValueMask=0,this._currentStencilFail=0,this._currentStencilPassDepthFail=0,this._currentStencilPassDepthPass=0,this._currentDepthWriteMask=!1,this._mask_layer_le=0,this._beforeVisitCmdStencil=new cc.CustomRenderCmd(this,this._onBeforeVisitStencil),this._afterDrawStencilCmd=new cc.CustomRenderCmd(this,this._onAfterDrawStencil),this._afterVisitCmdStencil=new cc.CustomRenderCmd(this,this._onAfterVisitStencil),this._beforeVisitCmdScissor=new cc.CustomRenderCmd(this,this._onBeforeVisitScissor),this._afterVisitCmdScissor=new cc.CustomRenderCmd(this,this._onAfterVisitScissor)};var a=ccui.Layout.WebGLRenderCmd.prototype=Object.create(ccui.ProtectedNode.WebGLRenderCmd.prototype);a.constructor=ccui.Layout.WebGLRenderCmd,a.visit=function(a){var b=this._node;if(b._visible)if(b._adaptRenderers(),b._doLayout(),b._clippingEnabled)switch(b._clippingType){case ccui.Layout.CLIPPING_STENCIL:this.stencilClippingVisit(a);break;case ccui.Layout.CLIPPING_SCISSOR:this.scissorClippingVisit(a)}else ccui.Widget.WebGLRenderCmd.prototype.visit.call(this,a)},a._onBeforeVisitStencil=function(a){var b=a||cc._renderContext;ccui.Layout.WebGLRenderCmd._layer++;var c=1<<ccui.Layout.WebGLRenderCmd._layer,d=c-1;this._mask_layer_le=c|d,this._currentStencilEnabled=b.isEnabled(b.STENCIL_TEST),this._currentStencilWriteMask=b.getParameter(b.STENCIL_WRITEMASK),this._currentStencilFunc=b.getParameter(b.STENCIL_FUNC),this._currentStencilRef=b.getParameter(b.STENCIL_REF),this._currentStencilValueMask=b.getParameter(b.STENCIL_VALUE_MASK),this._currentStencilFail=b.getParameter(b.STENCIL_FAIL),this._currentStencilPassDepthFail=b.getParameter(b.STENCIL_PASS_DEPTH_FAIL),this._currentStencilPassDepthPass=b.getParameter(b.STENCIL_PASS_DEPTH_PASS),b.enable(b.STENCIL_TEST),b.stencilMask(c),this._currentDepthWriteMask=b.getParameter(b.DEPTH_WRITEMASK),b.depthMask(!1),b.stencilFunc(b.NEVER,c,c),b.stencilOp(b.ZERO,b.KEEP,b.KEEP),this._drawFullScreenQuadClearStencil(),b.stencilFunc(b.NEVER,c,c),b.stencilOp(b.REPLACE,b.KEEP,b.KEEP)},a._onAfterDrawStencil=function(a){var b=a||cc._renderContext;b.depthMask(this._currentDepthWriteMask),b.stencilFunc(b.EQUAL,this._mask_layer_le,this._mask_layer_le),b.stencilOp(b.KEEP,b.KEEP,b.KEEP)},a._onAfterVisitStencil=function(a){var b=a||cc._renderContext;b.stencilFunc(this._currentStencilFunc,this._currentStencilRef,this._currentStencilValueMask),b.stencilOp(this._currentStencilFail,this._currentStencilPassDepthFail,this._currentStencilPassDepthPass),b.stencilMask(this._currentStencilWriteMask),this._currentStencilEnabled||b.disable(b.STENCIL_TEST),ccui.Layout.WebGLRenderCmd._layer--},a._onBeforeVisitScissor=function(a){var b=this._getClippingRect(),c=a||cc._renderContext;c.enable(c.SCISSOR_TEST),cc.view.setScissorInPoints(b.x,b.y,b.width,b.height)},a._onAfterVisitScissor=function(a){var b=a||cc._renderContext;b.disable(b.SCISSOR_TEST)},a._drawFullScreenQuadClearStencil=function(){cc.kmGLMatrixMode(cc.KM_GL_PROJECTION),cc.kmGLPushMatrix(),cc.kmGLLoadIdentity(),cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW),cc.kmGLPushMatrix(),cc.kmGLLoadIdentity(),cc._drawingUtil.drawSolidRect(cc.p(-1,-1),cc.p(1,1),cc.color(255,255,255,255)),cc.kmGLMatrixMode(cc.KM_GL_PROJECTION),cc.kmGLPopMatrix(),cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW),cc.kmGLPopMatrix()},a.rebindStencilRendering=function(){},a.transform=function(a,b){var c=this._node;ccui.ProtectedNode.WebGLRenderCmd.prototype.transform.call(this,a,b),c._clippingStencil&&c._clippingStencil._renderCmd.transform(this,b)},a.stencilClippingVisit=function(a){var b=this._node;if(b._clippingStencil&&b._clippingStencil.isVisible()){if(ccui.Layout.WebGLRenderCmd._layer+1==cc.stencilBits)return ccui.Layout.WebGLRenderCmd._visit_once=!0,ccui.Layout.WebGLRenderCmd._visit_once&&(cc.log("Nesting more than "+cc.stencilBits+"stencils is not supported. Everything will be drawn without stencil for this node and its childs."),ccui.Layout.WebGLRenderCmd._visit_once=!1),void cc.Node.prototype.visit.call(b,a);cc.renderer.pushRenderCommand(this._beforeVisitCmdStencil);var c=cc.current_stack;c.stack.push(c.top),this._syncStatus(a),this._dirtyFlag=0,c.top=this._stackMatrix,b._clippingStencil.visit(this),cc.renderer.pushRenderCommand(this._afterDrawStencilCmd);var d=0,e=0;b.sortAllChildren(),b.sortAllProtectedChildren();for(var f,g=b._children,h=b._protectedChildren,i=g.length,j=h.length;i>d&&(f=g[d],f&&f.getLocalZOrder()<0);d++)f.visit(this);for(;j>e&&(f=h[e],f&&f.getLocalZOrder()<0);e++)f.visit(this);for(;i>d;d++)g[d].visit(this);for(;j>e;e++)h[e].visit(this);cc.renderer.pushRenderCommand(this._afterVisitCmdStencil),c.top=c.stack.pop()}},a.scissorClippingVisit=function(a){cc.renderer.pushRenderCommand(this._beforeVisitCmdScissor),cc.ProtectedNode.prototype.visit.call(this._node,a),cc.renderer.pushRenderCommand(this._afterVisitCmdScissor)},ccui.Layout.WebGLRenderCmd._layer=-1,ccui.Layout.WebGLRenderCmd._visit_once=null}();