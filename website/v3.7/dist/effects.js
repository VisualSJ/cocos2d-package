cc.GridBase=cc.Class.extend({_active:!1,_reuseGrid:0,_gridSize:null,_texture:null,_step:null,_grabber:null,_isTextureFlipped:!1,_shaderProgram:null,_directorProjection:0,_dirty:!1,ctor:function(a,b,c){cc._checkWebGLRenderMode(),this._active=!1,this._reuseGrid=0,this._gridSize=null,this._texture=null,this._step=cc.p(0,0),this._grabber=null,this._isTextureFlipped=!1,this._shaderProgram=null,this._directorProjection=0,this._dirty=!1,void 0!==a&&this.initWithSize(a,b,c)},isActive:function(){return this._active},setActive:function(a){if(this._active=a,!a){var b=cc.director,c=b.getProjection();b.setProjection(c)}},getReuseGrid:function(){return this._reuseGrid},setReuseGrid:function(a){this._reuseGrid=a},getGridSize:function(){return cc.size(this._gridSize.width,this._gridSize.height)},setGridSize:function(a){this._gridSize.width=parseInt(a.width),this._gridSize.height=parseInt(a.height)},getStep:function(){return cc.p(this._step.x,this._step.y)},setStep:function(a){this._step.x=a.x,this._step.y=a.y},isTextureFlipped:function(){return this._isTextureFlipped},setTextureFlipped:function(a){this._isTextureFlipped!==a&&(this._isTextureFlipped=a,this.calculateVertexPoints())},initWithSize:function(a,b,c){if(!b){var d=cc.director,e=d.getWinSizeInPixels(),f=cc.NextPOT(e.width),g=cc.NextPOT(e.height),h=new Uint8Array(f*g*4);if(!h)return cc.log("cocos2d: CCGrid: not enough memory."),!1;if(b=new cc.Texture2D,b.initWithData(h,cc.Texture2D.PIXEL_FORMAT_RGBA8888,f,g,e),!b)return cc.log("cocos2d: CCGrid: error creating texture"),!1}return c=c||!1,this._active=!1,this._reuseGrid=0,this._gridSize=a,this._texture=b,this._isTextureFlipped=c,this._step.x=this._texture.width/a.width,this._step.y=this._texture.height/a.height,this._grabber=new cc.Grabber,this._grabber?(this._grabber.grab(this._texture),this._shaderProgram=cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURE),this.calculateVertexPoints(),!0):!1},beforeDraw:function(){this._directorProjection=cc.director.getProjection(),this._grabber.beforeRender(this._texture)},afterDraw:function(a){if(this._grabber.afterRender(this._texture),a&&a.getCamera().isDirty()){var b=a.getAnchorPointInPoints(),c=a._renderCmd._stackMatrix,d=cc.math.Matrix4.createByTranslation(b.x,b.y,0);c.multiply(d),a._camera._locateForRenderer(c),d=cc.math.Matrix4.createByTranslation(-b.x,-b.y,0,d),c.multiply(d)}cc.glBindTexture2D(this._texture),this.beforeBlit(),this.blit(a),this.afterBlit()},beforeBlit:function(){},afterBlit:function(){},blit:function(){cc.log("cc.GridBase.blit(): Shall be overridden in subclass.")},reuse:function(){cc.log("cc.GridBase.reuse(): Shall be overridden in subclass.")},calculateVertexPoints:function(){cc.log("cc.GridBase.calculateVertexPoints(): Shall be overridden in subclass.")},set2DProjection:function(){var a=cc.director.getWinSizeInPixels(),b=cc._renderContext;b.viewport(0,0,a.width,a.height),cc.kmGLMatrixMode(cc.KM_GL_PROJECTION),cc.kmGLLoadIdentity();var c=cc.math.Matrix4.createOrthographicProjection(0,a.width,0,a.height,-1,1);cc.kmGLMultMatrix(c),cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW),cc.kmGLLoadIdentity(),cc.setProjectionMatrixDirty()}}),cc.GridBase.create=function(a,b,c){return new cc.GridBase(a,b,c)},cc.Grid3D=cc.GridBase.extend({_texCoordinates:null,_vertices:null,_originalVertices:null,_indices:null,_texCoordinateBuffer:null,_verticesBuffer:null,_indicesBuffer:null,_needDepthTestForBlit:!1,_oldDepthTestValue:!1,_oldDepthWriteValue:!1,ctor:function(a,b,c){cc.GridBase.prototype.ctor.call(this),this._texCoordinates=null,this._vertices=null,this._originalVertices=null,this._indices=null,this._texCoordinateBuffer=null,this._verticesBuffer=null,this._indicesBuffer=null,void 0!==a&&this.initWithSize(a,b,c)},vertex:function(a){return this.getVertex(a)},getVertex:function(a){(a.x!==(0|a.x)||a.y!==(0|a.y))&&cc.log("cc.Grid3D.vertex() : Numbers must be integers");var b=0|3*(a.x*(this._gridSize.height+1)+a.y),c=this._vertices;return new cc.Vertex3F(c[b],c[b+1],c[b+2])},originalVertex:function(a){return this.getOriginalVertex(a)},getOriginalVertex:function(a){(a.x!==(0|a.x)||a.y!==(0|a.y))&&cc.log("cc.Grid3D.originalVertex() : Numbers must be integers");var b=0|3*(a.x*(this._gridSize.height+1)+a.y),c=this._originalVertices;return new cc.Vertex3F(c[b],c[b+1],c[b+2])},setVertex:function(a,b){(a.x!==(0|a.x)||a.y!==(0|a.y))&&cc.log("cc.Grid3D.setVertex() : Numbers must be integers");var c=0|3*(a.x*(this._gridSize.height+1)+a.y),d=this._vertices;d[c]=b.x,d[c+1]=b.y,d[c+2]=b.z,this._dirty=!0},beforeBlit:function(){if(this._needDepthTestForBlit){var a=cc._renderContext;this._oldDepthTestValue=a.isEnabled(a.DEPTH_TEST),this._oldDepthWriteValue=a.getParameter(a.DEPTH_WRITEMASK),a.enable(a.DEPTH_TEST),a.depthMask(!0)}},afterBlit:function(){if(this._needDepthTestForBlit){var a=cc._renderContext;this._oldDepthTestValue?a.enable(a.DEPTH_TEST):a.disable(a.DEPTH_TEST),a.depthMask(this._oldDepthWriteValue)}},blit:function(a){var b=this._gridSize.width*this._gridSize.height;cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION|cc.VERTEX_ATTRIB_FLAG_TEX_COORDS),this._shaderProgram.use(),this._shaderProgram._setUniformForMVPMatrixWithMat4(a._renderCmd._stackMatrix);var c=cc._renderContext,d=this._dirty;c.bindBuffer(c.ARRAY_BUFFER,this._verticesBuffer),d&&c.bufferData(c.ARRAY_BUFFER,this._vertices,c.DYNAMIC_DRAW),c.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION,3,c.FLOAT,!1,0,0),c.bindBuffer(c.ARRAY_BUFFER,this._texCoordinateBuffer),d&&c.bufferData(c.ARRAY_BUFFER,this._texCoordinates,c.DYNAMIC_DRAW),c.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS,2,c.FLOAT,!1,0,0),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,this._indicesBuffer),d&&c.bufferData(c.ELEMENT_ARRAY_BUFFER,this._indices,c.STATIC_DRAW),c.drawElements(c.TRIANGLES,6*b,c.UNSIGNED_SHORT,0),d&&(this._dirty=!1),cc.incrementGLDraws(1)},reuse:function(){if(this._reuseGrid>0){for(var a=this._originalVertices,b=this._vertices,c=0,d=this._vertices.length;d>c;c++)a[c]=b[c];--this._reuseGrid}},calculateVertexPoints:function(){var a=cc._renderContext,b=this._texture.pixelsWidth,c=this._texture.pixelsHeight,d=this._texture.getContentSizeInPixels().height,e=this._gridSize,f=(e.width+1)*(e.height+1);this._vertices=new Float32Array(3*f),this._texCoordinates=new Float32Array(2*f),this._indices=new Uint16Array(e.width*e.height*6),this._verticesBuffer&&a.deleteBuffer(this._verticesBuffer),this._verticesBuffer=a.createBuffer(),this._texCoordinateBuffer&&a.deleteBuffer(this._texCoordinateBuffer),this._texCoordinateBuffer=a.createBuffer(),this._indicesBuffer&&a.deleteBuffer(this._indicesBuffer),this._indicesBuffer=a.createBuffer();var g,h,i,j=this._indices,k=this._texCoordinates,l=this._isTextureFlipped,m=this._vertices;for(g=0;g<e.width;++g)for(h=0;h<e.height;++h){var n=h*e.width+g,o=g*this._step.x,p=o+this._step.x,q=h*this._step.y,r=q+this._step.y,s=g*(e.height+1)+h,t=(g+1)*(e.height+1)+h,u=(g+1)*(e.height+1)+(h+1),v=g*(e.height+1)+(h+1);j[6*n]=s,j[6*n+1]=t,j[6*n+2]=v,j[6*n+3]=t,j[6*n+4]=u,j[6*n+5]=v;var w=[3*s,3*t,3*u,3*v],x={x:o,y:q,z:0},y={x:p,y:q,z:0},z={x:p,y:r,z:0},A={x:o,y:r,z:0},B=[x,y,z,A],C=[2*s,2*t,2*u,2*v],D=[cc.p(o,q),cc.p(p,q),cc.p(p,r),cc.p(o,r)];for(i=0;4>i;++i)m[w[i]]=B[i].x,m[w[i]+1]=B[i].y,m[w[i]+2]=B[i].z,k[C[i]]=D[i].x/b,l?k[C[i]+1]=(d-D[i].y)/c:k[C[i]+1]=D[i].y/c}this._originalVertices=new Float32Array(this._vertices),a.bindBuffer(a.ARRAY_BUFFER,this._verticesBuffer),a.bufferData(a.ARRAY_BUFFER,this._vertices,a.DYNAMIC_DRAW),a.bindBuffer(a.ARRAY_BUFFER,this._texCoordinateBuffer),a.bufferData(a.ARRAY_BUFFER,this._texCoordinates,a.DYNAMIC_DRAW),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this._indicesBuffer),a.bufferData(a.ELEMENT_ARRAY_BUFFER,this._indices,a.STATIC_DRAW),this._dirty=!0},setNeedDepthTestForBlit:function(a){this._needDepthTestForBlit=a},getNeedDepthTestForBlit:function(){return this._needDepthTestForBlit}}),cc.Grid3D.create=function(a,b,c){return new cc.Grid3D(a,b,c)},cc.TiledGrid3D=cc.GridBase.extend({_texCoordinates:null,_vertices:null,_originalVertices:null,_indices:null,_texCoordinateBuffer:null,_verticesBuffer:null,_indicesBuffer:null,ctor:function(a,b,c){cc.GridBase.prototype.ctor.call(this),this._texCoordinates=null,this._vertices=null,this._originalVertices=null,this._indices=null,this._texCoordinateBuffer=null,this._verticesBuffer=null,this._indicesBuffer=null,void 0!==a&&this.initWithSize(a,b,c)},tile:function(a){return this.getTile(a)},getTile:function(a){(a.x!==(0|a.x)||a.y!==(0|a.y))&&cc.log("cc.TiledGrid3D.tile() : Numbers must be integers");var b=4*(this._gridSize.height*a.x+a.y)*3,c=this._vertices;return new cc.Quad3(new cc.Vertex3F(c[b],c[b+1],c[b+2]),new cc.Vertex3F(c[b+3],c[b+4],c[b+5]),new cc.Vertex3F(c[b+6],c[b+7],c[b+8]),new cc.Vertex3F(c[b+9],c[b+10],c[b+11]))},getOriginalTile:function(a){(a.x!==(0|a.x)||a.y!==(0|a.y))&&cc.log("cc.TiledGrid3D.originalTile() : Numbers must be integers");var b=4*(this._gridSize.height*a.x+a.y)*3,c=this._originalVertices;return new cc.Quad3(new cc.Vertex3F(c[b],c[b+1],c[b+2]),new cc.Vertex3F(c[b+3],c[b+4],c[b+5]),new cc.Vertex3F(c[b+6],c[b+7],c[b+8]),new cc.Vertex3F(c[b+9],c[b+10],c[b+11]))},originalTile:function(a){return this.getOriginalTile(a)},setTile:function(a,b){(a.x!==(0|a.x)||a.y!==(0|a.y))&&cc.log("cc.TiledGrid3D.setTile() : Numbers must be integers");var c=12*(this._gridSize.height*a.x+a.y),d=this._vertices;d[c]=b.bl.x,d[c+1]=b.bl.y,d[c+2]=b.bl.z,d[c+3]=b.br.x,d[c+4]=b.br.y,d[c+5]=b.br.z,d[c+6]=b.tl.x,d[c+7]=b.tl.y,d[c+8]=b.tl.z,d[c+9]=b.tr.x,d[c+10]=b.tr.y,d[c+11]=b.tr.z,this._dirty=!0},blit:function(a){var b=this._gridSize.width*this._gridSize.height;this._shaderProgram.use(),this._shaderProgram._setUniformForMVPMatrixWithMat4(a._renderCmd._stackMatrix);var c=cc._renderContext,d=this._dirty;cc.glEnableVertexAttribs(cc.VERTEX_ATTRIB_FLAG_POSITION|cc.VERTEX_ATTRIB_FLAG_TEX_COORDS),c.bindBuffer(c.ARRAY_BUFFER,this._verticesBuffer),d&&c.bufferData(c.ARRAY_BUFFER,this._vertices,c.DYNAMIC_DRAW),c.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION,3,c.FLOAT,!1,0,this._vertices),c.bindBuffer(c.ARRAY_BUFFER,this._texCoordinateBuffer),d&&c.bufferData(c.ARRAY_BUFFER,this._texCoordinates,c.DYNAMIC_DRAW),c.vertexAttribPointer(cc.VERTEX_ATTRIB_TEX_COORDS,2,c.FLOAT,!1,0,this._texCoordinates),c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,this._indicesBuffer),d&&c.bufferData(c.ELEMENT_ARRAY_BUFFER,this._indices,c.STATIC_DRAW),c.drawElements(c.TRIANGLES,6*b,c.UNSIGNED_SHORT,0),d&&(this._dirty=!1),cc.incrementGLDraws(1)},reuse:function(){if(this._reuseGrid>0){for(var a=this._vertices,b=this._originalVertices,c=0;c<a.length;c++)b[c]=a[c];--this._reuseGrid}},calculateVertexPoints:function(){var a=this._texture.pixelsWidth,b=this._texture.pixelsHeight,c=this._texture.getContentSizeInPixels().height,d=this._gridSize,e=d.width*d.height;this._vertices=new Float32Array(12*e),this._texCoordinates=new Float32Array(8*e),this._indices=new Uint16Array(6*e);var f=cc._renderContext;this._verticesBuffer&&f.deleteBuffer(this._verticesBuffer),this._verticesBuffer=f.createBuffer(),this._texCoordinateBuffer&&f.deleteBuffer(this._texCoordinateBuffer),this._texCoordinateBuffer=f.createBuffer(),this._indicesBuffer&&f.deleteBuffer(this._indicesBuffer),this._indicesBuffer=f.createBuffer();var g,h,i=0,j=this._step,k=this._vertices,l=this._texCoordinates,m=this._isTextureFlipped;for(g=0;g<d.width;g++)for(h=0;h<d.height;h++){var n=g*j.x,o=n+j.x,p=h*j.y,q=p+j.y;k[12*i]=n,k[12*i+1]=p,k[12*i+2]=0,k[12*i+3]=o,k[12*i+4]=p,k[12*i+5]=0,k[12*i+6]=n,k[12*i+7]=q,k[12*i+8]=0,k[12*i+9]=o,k[12*i+10]=q,k[12*i+11]=0;var r=p,s=q;m&&(r=c-p,s=c-q),l[8*i]=n/a,l[8*i+1]=r/b,l[8*i+2]=o/a,l[8*i+3]=r/b,l[8*i+4]=n/a,l[8*i+5]=s/b,l[8*i+6]=o/a,l[8*i+7]=s/b,i++}var t=this._indices;for(g=0;e>g;g++)t[6*g+0]=4*g+0,t[6*g+1]=4*g+1,t[6*g+2]=4*g+2,t[6*g+3]=4*g+1,t[6*g+4]=4*g+2,t[6*g+5]=4*g+3;this._originalVertices=new Float32Array(this._vertices),f.bindBuffer(f.ARRAY_BUFFER,this._verticesBuffer),f.bufferData(f.ARRAY_BUFFER,this._vertices,f.DYNAMIC_DRAW),f.bindBuffer(f.ARRAY_BUFFER,this._texCoordinateBuffer),f.bufferData(f.ARRAY_BUFFER,this._texCoordinates,f.DYNAMIC_DRAW),f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,this._indicesBuffer),f.bufferData(f.ELEMENT_ARRAY_BUFFER,this._indices,f.DYNAMIC_DRAW),this._dirty=!0}}),cc.TiledGrid3D.create=function(a,b,c){return new cc.TiledGrid3D(a,b,c)},cc.Grabber=cc.Class.extend({_FBO:null,_oldFBO:null,_oldClearColor:null,_gl:null,ctor:function(){cc._checkWebGLRenderMode(),this._gl=cc._renderContext,this._oldClearColor=[0,0,0,0],this._oldFBO=null,this._FBO=this._gl.createFramebuffer()},grab:function(a){var b=this._gl;this._oldFBO=b.getParameter(b.FRAMEBUFFER_BINDING),b.bindFramebuffer(b.FRAMEBUFFER,this._FBO),b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,a._webTextureObj,0);var c=b.checkFramebufferStatus(b.FRAMEBUFFER);c!==b.FRAMEBUFFER_COMPLETE&&cc.log("Frame Grabber: could not attach texture to frmaebuffer"),b.bindFramebuffer(b.FRAMEBUFFER,this._oldFBO)},beforeRender:function(a){var b=this._gl;this._oldFBO=b.getParameter(b.FRAMEBUFFER_BINDING),b.bindFramebuffer(b.FRAMEBUFFER,this._FBO),this._oldClearColor=b.getParameter(b.COLOR_CLEAR_VALUE),b.clearColor(0,0,0,0),b.clear(b.COLOR_BUFFER_BIT|b.DEPTH_BUFFER_BIT)},afterRender:function(a){var b=this._gl;b.bindFramebuffer(b.FRAMEBUFFER,this._oldFBO),b.colorMask(!0,!0,!0,!0)},destroy:function(){this._gl.deleteFramebuffer(this._FBO)}});