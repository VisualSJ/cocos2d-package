!function(){cc.ClippingNode.WebGLRenderCmd=function(a){cc.Node.WebGLRenderCmd.call(this,a),this._needDraw=!1,this._beforeVisitCmd=new cc.CustomRenderCmd(this,this._onBeforeVisit),this._afterDrawStencilCmd=new cc.CustomRenderCmd(this,this._onAfterDrawStencil),this._afterVisitCmd=new cc.CustomRenderCmd(this,this._onAfterVisit),this._currentStencilEnabled=null,this._mask_layer_le=null};var a=cc.ClippingNode.WebGLRenderCmd.prototype=Object.create(cc.Node.WebGLRenderCmd.prototype);a.constructor=cc.ClippingNode.WebGLRenderCmd,cc.ClippingNode.WebGLRenderCmd._init_once=null,cc.ClippingNode.WebGLRenderCmd._visit_once=null,cc.ClippingNode.WebGLRenderCmd._layer=-1,a.initStencilBits=function(){cc.ClippingNode.WebGLRenderCmd._init_once=!0,cc.ClippingNode.WebGLRenderCmd._init_once&&(cc.stencilBits=cc._renderContext.getParameter(cc._renderContext.STENCIL_BITS),cc.stencilBits<=0&&cc.log("Stencil buffer is not enabled."),cc.ClippingNode.WebGLRenderCmd._init_once=!1)},a.transform=function(a,b){var c=this._node;this.originTransform(a,b),c._stencil&&c._stencil._renderCmd.transform(this,b)},a.visit=function(a){var b=this._node;if(b._visible){if(b._parent&&b._parent._renderCmd&&(this._curLevel=b._parent._renderCmd._curLevel+1),cc.stencilBits<1)return void this.originVisit(a);if(!b._stencil||!b._stencil.visible)return void(b.inverted&&this.originVisit(a));if(cc.ClippingNode.WebGLRenderCmd._layer+1===cc.stencilBits)return cc.ClippingNode.WebGLRenderCmd._visit_once=!0,cc.ClippingNode.WebGLRenderCmd._visit_once&&(cc.log("Nesting more than "+cc.stencilBits+"stencils is not supported. Everything will be drawn without stencil for this node and its children."),cc.ClippingNode.WebGLRenderCmd._visit_once=!1),void this.originVisit(a);cc.renderer.pushRenderCommand(this._beforeVisitCmd);var c=cc.current_stack;c.stack.push(c.top),this._syncStatus(a),c.top=this._stackMatrix,b._stencil._renderCmd.visit(this),cc.renderer.pushRenderCommand(this._afterDrawStencilCmd);var d=b._children;if(d&&d.length>0){var e=d.length;b.sortAllChildren();for(var f=0;e>f;f++)d[f]._renderCmd.visit(this)}cc.renderer.pushRenderCommand(this._afterVisitCmd),this._dirtyFlag=0,c.top=c.stack.pop()}},a.setStencil=function(a){var b=this._node;b._stencil&&(b._stencil._parent=null),b._stencil=a,b._stencil&&(b._stencil._parent=b)},a._onBeforeVisit=function(a){var b=a||cc._renderContext,c=this._node;cc.ClippingNode.WebGLRenderCmd._layer++;var d=1<<cc.ClippingNode.WebGLRenderCmd._layer,e=d-1;if(this._mask_layer_le=d|e,this._currentStencilEnabled=b.isEnabled(b.STENCIL_TEST),b.clear(b.DEPTH_BUFFER_BIT),b.enable(b.STENCIL_TEST),b.depthMask(!1),b.stencilFunc(b.NEVER,d,d),b.stencilOp(b.REPLACE,b.KEEP,b.KEEP),b.stencilMask(d),b.clear(b.STENCIL_BUFFER_BIT),c.alphaThreshold<1){var f=cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLORALPHATEST);cc.glUseProgram(f.getProgram()),f.setUniformLocationWith1f(cc.UNIFORM_ALPHA_TEST_VALUE_S,c.alphaThreshold),f.setUniformLocationWithMatrix4fv(cc.UNIFORM_MVMATRIX_S,cc.renderer.mat4Identity.mat),cc.setProgram(c._stencil,f)}},a._onAfterDrawStencil=function(a){var b=a||cc._renderContext;b.depthMask(!0),b.stencilFunc(this._node.inverted?b.NOTEQUAL:b.EQUAL,this._mask_layer_le,this._mask_layer_le),b.stencilOp(b.KEEP,b.KEEP,b.KEEP)},a._onAfterVisit=function(a){var b=a||cc._renderContext;if(cc.ClippingNode.WebGLRenderCmd._layer--,this._currentStencilEnabled){var c=1<<cc.ClippingNode.WebGLRenderCmd._layer,d=c-1,e=c|d;b.stencilMask(c),b.stencilFunc(b.EQUAL,e,e)}else b.disable(b.STENCIL_TEST)}}();