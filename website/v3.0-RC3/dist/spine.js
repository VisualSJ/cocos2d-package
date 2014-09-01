var sp=sp||{};sp.VERTEX_INDEX={X1:0,Y1:1,X2:2,Y2:3,X3:4,Y3:5,X4:6,Y4:7};sp.ATTACHMENT_TYPE={REGION:0,BOUNDING_BOX:1,REGION_SEQUENCE:2};
sp.Skeleton=cc.Node.extend({_skeleton:null,_rootBone:null,_timeScale:1,_debugSlots:!1,_debugBones:!1,_premultipliedAlpha:!1,_ownsSkeletonData:null,_atlas:null,_blendFunc:null,ctor:function(a,b,c){cc.Node.prototype.ctor.call(this);this._blendFunc={src:cc.BLEND_SRC,dst:cc.BLEND_DST};0===arguments.length?this.init():this.initWithArgs(a,b,c)},init:function(){cc.Node.prototype.init.call(this);this.setOpacityModifyRGB(!0);this._blendFunc.src=cc.ONE;this._blendFunc.dst=cc.ONE_MINUS_SRC_ALPHA;cc._renderType===
cc._RENDER_TYPE_WEBGL&&this.setShaderProgram(cc.shaderCache.programForKey(cc.SHADER_POSITION_TEXTURECOLOR));this.scheduleUpdate()},setDebugSolots:function(a){this._debugSlots=a},setDebugBones:function(a){this._debugBones=a},setTimeScale:function(a){this._timeScale=a},initWithArgs:function(a,b,c){if("string"==typeof a){if("string"==typeof b){var d=cc.loader.getRes(b);sp._atlasLoader.setAtlasFile(b);b=new spine.Atlas(d,sp._atlasLoader)}c=c||1/cc.director.getContentScaleFactor();d=new spine.AtlasAttachmentLoader(b);
d=new spine.SkeletonJson(d);d.scale=c;a=cc.loader.getRes(a);a=d.readSkeletonData(a);b.dispose(d);c=!0}else c=b;this.setSkeletonData(a,c);this.init()},boundingBox:function(){for(var a=cc.FLT_MAX,b=cc.FLT_MAX,c=cc.FLT_MIN,d=cc.FLT_MIN,e=this.getScaleX(),f=this.getScaleY(),g=[],h=this._skeleton.slots,l=sp.VERTEX_INDEX,k=0,n=h.length;k<n;++k){var m=h[k];m.attachment&&m.attachment.type==sp.ATTACHMENT_TYPE.REGION&&(sp._regionAttachment_computeWorldVertices(m.attachment,m.skeleton.x,m.skeleton.y,m.bone,
g),a=Math.min(a,g[l.X1]*e,g[l.X4]*e,g[l.X2]*e,g[l.X3]*e),b=Math.min(b,g[l.Y1]*f,g[l.Y4]*f,g[l.Y2]*f,g[l.Y3]*f),c=Math.max(c,g[l.X1]*e,g[l.X4]*e,g[l.X2]*e,g[l.X3]*e),d=Math.max(d,g[l.Y1]*f,g[l.Y4]*f,g[l.Y2]*f,g[l.Y3]*f))}e=this.getPosition();return cc.rect(e.x+a,e.y+b,c-a,d-b)},updateWorldTransform:function(){this._skeleton.updateWorldTransform()},setToSetupPose:function(){this._skeleton.setToSetupPose()},setBonesToSetupPose:function(){this._skeleton.setBonesToSetupPose()},setSlotsToSetupPose:function(){this._skeleton.setSlotsToSetupPose()},
findBone:function(a){return this._skeleton.findBone(a)},findSlot:function(a){return this._skeleton.findSlot(a)},setSkin:function(a){return this._skeleton.setSkinByName(a)},getAttachment:function(a,b){return this._skeleton.getAttachmentBySlotName(a,b)},setAttachment:function(a,b){this._skeleton.setAttachment(a,b)},setOpacityModifyRGB:function(a){this._premultipliedAlpha=a},isOpacityModifyRGB:function(){return this._premultipliedAlpha},setSkeletonData:function(a,b){this._skeleton=new spine.Skeleton(a);
this._rootBone=this._skeleton.getRootBone();this._ownsSkeletonData=b;if(cc._renderType===cc._RENDER_TYPE_CANVAS)for(var c=this._skeleton,d,e,f=0,g=c.drawOrder.length;f<g;f++){var h=c.drawOrder[f];d=h.attachment;d instanceof spine.RegionAttachment&&(d=d.rendererObject,e=cc.rect(d.x,d.y,d.width,d.height),d=cc.Sprite.create(d.page._texture,e,d.rotate),this.addChild(d,-1),h.currentSprite=d)}},getTextureAtlas:function(a){return a.rendererObject.page.rendererObject},getBlendFunc:function(){return this._blendFunc},
setBlendFunc:function(a,b){var c=this._blendFunc;void 0===b?(c.src=a.src,c.dst=a.dst):(c.src=a,c.dst=b)},update:function(a){this._skeleton.update(a);if(cc._renderType===cc._RENDER_TYPE_CANVAS){this._skeleton.updateWorldTransform();a=this._skeleton.drawOrder;for(var b=0,c=a.length;b<c;b++){var d=a[b],e=d.attachment,f=d.currentSprite;if(e instanceof spine.RegionAttachment){if(!f){var g=e.rendererObject,h=cc.rect(g.x,g.y,g.width,g.height),g=cc.Sprite.create(g.page._texture,h,g.rotate);this.addChild(g,
-1);d.currentSprite=g}f.setVisible(!0);f.setBlendFunc(cc.BLEND_SRC,d.data.additiveBlending?cc.ONE:cc.BLEND_DST);g=d.bone;f.setPosition(g.worldX+e.x*g.m00+e.y*g.m01,g.worldY+e.x*g.m10+e.y*g.m11);f.setScale(g.worldScaleX,g.worldScaleY);f.setRotation(-(d.bone.worldRotation+e.rotation))}else f&&f.setVisible(!1)}}},draw:null,_drawForWebGL:function(){cc.nodeDrawSetup(this);var a=this.getColor(),b=this._skeleton;b.r=a.r/255;b.g=a.g/255;b.b=a.b/255;b.a=this.getOpacity()/255;this._premultipliedAlpha&&(b.r*=
b.a,b.g*=b.a,b.b*=b.a);var c,d,e,f,g,h=new cc.V3F_C4B_T2F_Quad,l=this._blendFunc,a=0;for(g=b.slots.length;a<g;a++)if(f=b.drawOrder[a],f.attachment&&f.attachment.type==sp.ATTACHMENT_TYPE.REGION){e=f.attachment;var k=this.getTextureAtlas(e);f.data.additiveBlending!=c?(d&&(d.drawQuads(),d.removeAllQuads()),c=!c,cc.glBlendFunc(l.src,c?cc.ONE:l.dst)):k!=d&&d&&(d.drawQuads(),d.removeAllQuads());d=k;k=d.getTotalQuads();if(d.getCapacity()==k&&(d.drawQuads(),d.removeAllQuads(),!d.resizeCapacity(2*d.getCapacity())))return;
sp._regionAttachment_updateQuad(e,f,h,this._premultipliedAlpha);d.updateQuad(h,k)}d&&(d.drawQuads(),d.removeAllQuads());c=cc._drawingUtil;if(this._debugSlots){c.setDrawColor(0,0,255,255);c.setLineWidth(1);a=0;for(g=b.slots.length;a<g;a++)f=b.drawOrder[a],f.attachment&&f.attachment.type==sp.ATTACHMENT_TYPE.REGION&&(e=f.attachment,h=new cc.V3F_C4B_T2F_Quad,sp._regionAttachment_updateQuad(e,f,h),d=[],d.push(cc.p(h.bl.vertices.x,h.bl.vertices.y)),d.push(cc.p(h.br.vertices.x,h.br.vertices.y)),d.push(cc.p(h.tr.vertices.x,
h.tr.vertices.y)),d.push(cc.p(h.tl.vertices.x,h.tl.vertices.y)),c.drawPoly(d,4,!0))}if(this._debugBones){c.setLineWidth(2);c.setDrawColor(255,0,0,255);a=0;for(g=b.bones.length;a<g;a++)h=b.bones[a],d=h.data.length*h.m00+h.worldX,e=h.data.length*h.m10+h.worldY,c.drawLine(cc.p(h.worldX,h.worldY),cc.p(d,e));c.setPointSize(4);c.setDrawColor(0,0,255,255);a=0;for(g=b.bones.length;a<g;a++)h=b.bones[a],c.drawPoint(cc.p(h.worldX,h.worldY)),0==a&&c.setDrawColor(0,255,0,255)}},_drawForCanvas:function(){if(this._debugSlots||
this._debugBones){var a=this._skeleton,b,c,d,e,f=cc._drawingUtil;if(this._debugSlots){f.setDrawColor(0,0,255,255);f.setLineWidth(1);var g=[];d=0;for(e=a.slots.length;d<e;d++)c=a.drawOrder[d],c.attachment&&c.attachment.type==sp.ATTACHMENT_TYPE.REGION&&(b=c.attachment,sp._regionAttachment_updateSlotForCanvas(b,c,g),f.drawPoly(g,4,!0))}if(this._debugBones){f.setLineWidth(2);f.setDrawColor(255,0,0,255);d=0;for(e=a.bones.length;d<e;d++)b=a.bones[d],c=b.data.length*b.m00+b.worldX,g=b.data.length*b.m10+
b.worldY,f.drawLine(cc.p(b.worldX,b.worldY),cc.p(c,g));f.setPointSize(4);f.setDrawColor(0,0,255,255);d=0;for(e=a.bones.length;d<e;d++)b=a.bones[d],f.drawPoint(cc.p(b.worldX,b.worldY)),0===d&&f.setDrawColor(0,255,0,255)}}}});sp.Skeleton.prototype.draw=cc._renderType===cc._RENDER_TYPE_WEBGL?sp.Skeleton.prototype._drawForWebGL:sp.Skeleton.prototype._drawForCanvas;sp.Skeleton.create=function(a,b,c){return new sp.Skeleton(a,b,c)};var spine=spine||{};spine.BoneData=function(a,b){this.name=a;this.parent=b};spine.BoneData.prototype={length:0,x:0,y:0,rotation:0,scaleX:1,scaleY:1,inheritScale:!0,inheritRotation:!0};spine.SlotData=function(a,b){this.name=a;this.boneData=b;this.r=this.g=this.b=this.a=1};spine.SlotData.prototype={r:1,g:1,b:1,a:1,attachmentName:null,additiveBlending:!1};spine.Bone=function(a,b){this.data=a;this.parent=b;this.setToSetupPose()};spine.Bone.yDown=!1;
spine.Bone.prototype={x:0,y:0,rotation:0,scaleX:1,scaleY:1,m00:0,m01:0,worldX:0,m10:0,m11:0,worldY:0,worldRotation:0,worldScaleX:1,worldScaleY:1,updateWorldTransform:function(a,b){var c=this.parent;null!=c?(this.worldX=this.x*c.m00+this.y*c.m01+c.worldX,this.worldY=this.x*c.m10+this.y*c.m11+c.worldY,this.data.inheritScale?(this.worldScaleX=c.worldScaleX*this.scaleX,this.worldScaleY=c.worldScaleY*this.scaleY):(this.worldScaleX=this.scaleX,this.worldScaleY=this.scaleY),this.worldRotation=this.data.inheritRotation?
c.worldRotation+this.rotation:this.rotation):(this.worldX=a?-this.x:this.x,this.worldY=b!=spine.Bone.yDown?-this.y:this.y,this.worldScaleX=this.scaleX,this.worldScaleY=this.scaleY,this.worldRotation=this.rotation);var d=this.worldRotation*Math.PI/180,c=Math.cos(d),d=Math.sin(d);this.m00=c*this.worldScaleX;this.m10=d*this.worldScaleX;this.m01=-d*this.worldScaleY;this.m11=c*this.worldScaleY;a&&(this.m00=-this.m00,this.m01=-this.m01);b!=spine.Bone.yDown&&(this.m10=-this.m10,this.m11=-this.m11)},setToSetupPose:function(){var a=
this.data;this.x=a.x;this.y=a.y;this.rotation=a.rotation;this.scaleX=a.scaleX;this.scaleY=a.scaleY}};spine.Slot=function(a,b,c){this.data=a;this.skeleton=b;this.bone=c;this.setToSetupPose()};
spine.Slot.prototype={r:1,g:1,b:1,a:1,_attachmentTime:0,attachment:null,setAttachment:function(a){this.attachment=a;this._attachmentTime=this.skeleton.time},setAttachmentTime:function(a){this._attachmentTime=this.skeleton.time-a},getAttachmentTime:function(){return this.skeleton.time-this._attachmentTime},setToSetupPose:function(){var a=this.data;this.r=a.r;this.g=a.g;this.b=a.b;this.a=a.a;for(var b=this.skeleton.data.slots,c=0,d=b.length;c<d;c++)if(b[c]==a){this.setAttachment(!a.attachmentName?null:
this.skeleton.getAttachmentBySlotIndex(c,a.attachmentName));break}}};spine.Skin=function(a){this.name=a;this.attachments={}};spine.Skin.prototype={addAttachment:function(a,b,c){this.attachments[a+":"+b]=c},getAttachment:function(a,b){return this.attachments[a+":"+b]},_attachAll:function(a,b){console.log(b.attachments);for(var c in b.attachments){var d=c.indexOf(":"),e=parseInt(c.substring(0,d)),f=c.substring(d+1),d=a.slots[e];d.attachment&&d.attachment.name==f&&(e=this.getAttachment(e,f))&&d.setAttachment(e)}}};
spine.Animation=function(a,b,c){this.name=a;this.timelines=b;this.duration=c};spine.Animation.prototype={apply:function(a,b,c,d,e){d&&0!=this.duration&&(c%=this.duration,b%=this.duration);d=this.timelines;for(var f=0,g=d.length;f<g;f++)d[f].apply(a,b,c,e,1)},mix:function(a,b,c,d,e,f){d&&0!=this.duration&&(c%=this.duration,b%=this.duration);d=this.timelines;for(var g=0,h=d.length;g<h;g++)d[g].apply(a,b,c,e,f)}};
spine.binarySearch=function(a,b,c){var d=0,e=Math.floor(a.length/c)-2;if(0==e)return c;for(var f=e>>>1;;){a[(f+1)*c]<=b?d=f+1:e=f;if(d==e)return(d+1)*c;f=d+e>>>1}};spine.linearSearch=function(a,b,c){for(var d=0,e=a.length-c;d<=e;d+=c)if(a[d]>b)return d;return-1};spine.Curves=function(a){this.curves=[];this.curves.length=6*(a-1)};
spine.Curves.prototype={setLinear:function(a){this.curves[6*a]=0},setStepped:function(a){this.curves[6*a]=-1},setCurve:function(a,b,c,d,e){var f=0.1*0.1,g=0.1*f,h=3*0.1,l=3*f,f=6*f,k=6*g,n=2*-b+d,m=2*-c+e;d=3*(b-d)+1;e=3*(c-e)+1;a*=6;var q=this.curves;q[a]=b*h+n*l+d*g;q[a+1]=c*h+m*l+e*g;q[a+2]=n*f+d*k;q[a+3]=m*f+e*k;q[a+4]=d*k;q[a+5]=e*k},getCurvePercent:function(a,b){b=0>b?0:1<b?1:b;var c=6*a,d=this.curves,e=d[c];if(!e)return b;if(-1==e)return 0;for(var f=d[c+1],g=d[c+2],h=d[c+3],l=d[c+4],k=d[c+
5],c=e,d=f,n=8;;){if(c>=b)return e=c-e,f=d-f,f+(d-f)*(b-e)/(c-e);if(0==n)break;n--;e+=g;f+=h;g+=l;h+=k;c+=e;d+=f}return d+(1-d)*(b-c)/(1-c)}};spine.RotateTimeline=function(a){this.curves=new spine.Curves(a);this.frames=[];this.frames.length=2*a};
spine.RotateTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/2},setFrame:function(a,b,c){a*=2;this.frames[a]=b;this.frames[a+1]=c},apply:function(a,b,c,d,e){b=this.frames;if(!(c<b[0])){a=a.bones[this.boneIndex];if(c>=b[b.length-2])b=a.data.rotation+b[b.length-1]-a.rotation;else{var f=spine.binarySearch(b,c,2);d=b[f-1];var g=b[f];c=1-(c-g)/(b[f-2]-g);c=this.curves.getCurvePercent(f/2-1,c);for(b=b[f+1]-d;180<b;)b-=360;for(;-180>b;)b+=360;b=a.data.rotation+(d+b*c)-a.rotation}for(;180<
b;)b-=360;for(;-180>b;)b+=360;a.rotation+=b*e}}};spine.TranslateTimeline=function(a){this.curves=new spine.Curves(a);this.frames=[];this.frames.length=3*a};
spine.TranslateTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/3},setFrame:function(a,b,c,d){a*=3;this.frames[a]=b;this.frames[a+1]=c;this.frames[a+2]=d},apply:function(a,b,c,d,e){b=this.frames;if(!(c<b[0]))if(a=a.bones[this.boneIndex],c>=b[b.length-3])a.x+=(a.data.x+b[b.length-2]-a.x)*e,a.y+=(a.data.y+b[b.length-1]-a.y)*e;else{d=spine.binarySearch(b,c,3);var f=b[d-2],g=b[d-1],h=b[d];c=1-(c-h)/(b[d+-3]-h);c=this.curves.getCurvePercent(d/3-1,c);a.x+=(a.data.x+f+(b[d+
1]-f)*c-a.x)*e;a.y+=(a.data.y+g+(b[d+2]-g)*c-a.y)*e}}};spine.ScaleTimeline=function(a){this.curves=new spine.Curves(a);this.frames=[];this.frames.length=3*a};
spine.ScaleTimeline.prototype={boneIndex:0,getFrameCount:function(){return this.frames.length/3},setFrame:function(a,b,c,d){a*=3;this.frames[a]=b;this.frames[a+1]=c;this.frames[a+2]=d},apply:function(a,b,c,d,e){b=this.frames;if(!(c<b[0]))if(a=a.bones[this.boneIndex],c>=b[b.length-3])a.scaleX+=(a.data.scaleX-1+b[b.length-2]-a.scaleX)*e,a.scaleY+=(a.data.scaleY-1+b[b.length-1]-a.scaleY)*e;else{d=spine.binarySearch(b,c,3);var f=b[d-2],g=b[d-1],h=b[d];c=1-(c-h)/(b[d+-3]-h);c=this.curves.getCurvePercent(d/
3-1,c);a.scaleX+=(a.data.scaleX-1+f+(b[d+1]-f)*c-a.scaleX)*e;a.scaleY+=(a.data.scaleY-1+g+(b[d+2]-g)*c-a.scaleY)*e}}};spine.ColorTimeline=function(a){this.curves=new spine.Curves(a);this.frames=[];this.frames.length=5*a};
spine.ColorTimeline.prototype={slotIndex:0,getFrameCount:function(){return this.frames.length/5},setFrame:function(a,b,c,d,e,f){a*=5;this.frames[a]=b;this.frames[a+1]=c;this.frames[a+2]=d;this.frames[a+3]=e;this.frames[a+4]=f},apply:function(a,b,c,d,e){b=this.frames;if(!(c<b[0]))if(a=a.slots[this.slotIndex],c>=b[b.length-5])e=b.length-1,a.r=b[e-3],a.g=b[e-2],a.b=b[e-1],a.a=b[e];else{d=spine.binarySearch(b,c,5);var f=b[d-4],g=b[d-3],h=b[d-2],l=b[d-1],k=b[d];c=1-(c-k)/(b[d-5]-k);c=this.curves.getCurvePercent(d/
5-1,c);f+=(b[d+1]-f)*c;g+=(b[d+2]-g)*c;h+=(b[d+3]-h)*c;b=l+(b[d+4]-l)*c;1>e?(a.r+=(f-a.r)*e,a.g+=(g-a.g)*e,a.b+=(h-a.b)*e,a.a+=(b-a.a)*e):(a.r=f,a.g=g,a.b=h,a.a=b)}}};spine.AttachmentTimeline=function(a){this.curves=new spine.Curves(a);this.frames=[];this.frames.length=a;this.attachmentNames=[];this.attachmentNames.length=a};
spine.AttachmentTimeline.prototype={slotIndex:0,getFrameCount:function(){return this.frames.length},setFrame:function(a,b,c){this.frames[a]=b;this.attachmentNames[a]=c},apply:function(a,b,c,d,e){b=this.frames;c<b[0]||(c=c>=b[b.length-1]?b.length-1:spine.binarySearch(b,c,1)-1,c=this.attachmentNames[c],a.slots[this.slotIndex].setAttachment(!c?null:a.getAttachmentBySlotIndex(this.slotIndex,c)))}};spine.EventTimeline=function(a){this.frames=[];this.frames.length=a;this.events=[];this.events.length=a};
spine.EventTimeline.prototype={getFrameCount:function(){return this.frames.length},setFrame:function(a,b,c){this.frames[a]=b;this.events[a]=c},apply:function(a,b,c,d,e){if(d){var f=this.frames,g=f.length;if(b>c)this.apply(a,b,Number.MAX_VALUE,d,e),b=-1;else if(b>=f[g-1])return;if(!(c<f[0])){if(b<f[0])a=0;else{a=spine.binarySearch(f,b,1);for(b=f[a];0<a&&f[a-1]==b;)a--}for(b=this.events;a<g&&c>=f[a];a++)d.push(b[a])}}}};
spine.DrawOrderTimeline=function(a){this.frames=[];this.frames.length=a;this.drawOrders=[];this.drawOrders.length=a};
spine.DrawOrderTimeline.prototype={getFrameCount:function(){return this.frames.length},setFrame:function(a,b,c){this.frames[a]=b;this.drawOrders[a]=c},apply:function(a,b,c,d,e){b=this.frames;if(!(c<b[0]))if(d=c>=b[b.length-1]?b.length-1:spine.binarySearch(b,c,1)-1,c=a.drawOrder,b=a.slots,d=this.drawOrders[d]){e=0;for(f=d.length;e<f;e++)c[e]=a.slots[d[e]]}else{e=0;for(var f=b.length;e<f;e++)c[e]=b[e]}}};
spine.SkeletonData=function(){this.bones=[];this.slots=[];this.skins=[];this.events=[];this.animations=[]};
spine.SkeletonData.prototype={defaultSkin:null,findBone:function(a){for(var b=this.bones,c=0,d=b.length;c<d;c++)if(b[c].name==a)return b[c];return null},findBoneIndex:function(a){for(var b=this.bones,c=0,d=b.length;c<d;c++)if(b[c].name==a)return c;return-1},findSlot:function(a){for(var b=this.slots,c=0,d=b.length;c<d;c++)if(b[c].name==a)return b[c];return null},findSlotIndex:function(a){for(var b=this.slots,c=0,d=b.length;c<d;c++)if(b[c].name==a)return c;return-1},findSkin:function(a){for(var b=this.skins,
c=0,d=b.length;c<d;c++)if(b[c].name==a)return b[c];return null},findEvent:function(a){for(var b=this.events,c=0,d=b.length;c<d;c++)if(b[c].name==a)return b[c];return null},findAnimation:function(a){for(var b=this.animations,c=0,d=b.length;c<d;c++)if(b[c].name==a)return b[c];return null}};
spine.Skeleton=function(a){this.data=a;this.bones=[];for(var b=0,c=a.bones.length;b<c;b++){var d=a.bones[b],e=!d.parent?null:this.bones[a.bones.indexOf(d.parent)];this.bones.push(new spine.Bone(d,e))}this.slots=[];this.drawOrder=[];b=0;for(c=a.slots.length;b<c;b++)d=a.slots[b],e=this.bones[a.bones.indexOf(d.boneData)],d=new spine.Slot(d,this,e),this.slots.push(d),this.drawOrder.push(d)};
spine.Skeleton.prototype={x:0,y:0,skin:null,r:1,g:1,b:1,a:1,time:0,flipX:!1,flipY:!1,updateWorldTransform:function(){for(var a=this.flipX,b=this.flipY,c=this.bones,d=0,e=c.length;d<e;d++)c[d].updateWorldTransform(a,b)},setToSetupPose:function(){this.setBonesToSetupPose();this.setSlotsToSetupPose()},setBonesToSetupPose:function(){for(var a=this.bones,b=0,c=a.length;b<c;b++)a[b].setToSetupPose()},setSlotsToSetupPose:function(){for(var a=this.slots,b=0,c=a.length;b<c;b++)a[b].setToSetupPose(b)},getRootBone:function(){return 0==
this.bones.length?null:this.bones[0]},findBone:function(a){for(var b=this.bones,c=0,d=b.length;c<d;c++)if(b[c].data.name==a)return b[c];return null},findBoneIndex:function(a){for(var b=this.bones,c=0,d=b.length;c<d;c++)if(b[c].data.name==a)return c;return-1},findSlot:function(a){for(var b=this.slots,c=0,d=b.length;c<d;c++)if(b[c].data.name==a)return b[c];return null},findSlotIndex:function(a){for(var b=this.slots,c=0,d=b.length;c<d;c++)if(b[c].data.name==a)return c;return-1},setSkinByName:function(a){var b=
this.data.findSkin(a);if(!b)throw"Skin not found: "+a;this.setSkin(b)},setSkin:function(a){this.skin&&a&&a._attachAll(this,this.skin);this.skin=a},getAttachmentBySlotName:function(a,b){return this.getAttachmentBySlotIndex(this.data.findSlotIndex(a),b)},getAttachmentBySlotIndex:function(a,b){if(this.skin){var c=this.skin.getAttachment(a,b);if(c)return c}return this.data.defaultSkin?this.data.defaultSkin.getAttachment(a,b):null},setAttachment:function(a,b){for(var c=this.slots,d=0,e=c.length;d<e;d++){var f=
c[d];if(f.data.name==a){c=null;if(b&&(c=this.getAttachment(d,b),!c))throw"Attachment not found: "+b+", for slot: "+a;f.setAttachment(c);return}}throw"Slot not found: "+a;},update:function(a){this.time+=a}};spine.EventData=function(a){this.name=a};spine.EventData.prototype={intValue:0,floatValue:0,stringValue:null};spine.Event=function(a){this.data=a};spine.Event.prototype={intValue:0,floatValue:0,stringValue:null};spine.AttachmentType={region:0,boundingbox:1};
spine.RegionAttachment=function(a){this.name=a;this.offset=[];this.offset.length=8;this.uvs=[];this.uvs.length=8;this.type=spine.AttachmentType.region};
spine.RegionAttachment.prototype={type:spine.AttachmentType.region,x:0,y:0,rotation:0,scaleX:1,scaleY:1,width:0,height:0,rendererObject:null,regionOffsetX:0,regionOffsetY:0,regionWidth:0,regionHeight:0,regionOriginalWidth:0,regionOriginalHeight:0,setUVs:function(a,b,c,d,e){var f=this.uvs;e?(f[2]=a,f[3]=d,f[4]=a,f[5]=b,f[6]=c,f[7]=b,f[0]=c,f[1]=d):(f[0]=a,f[1]=d,f[2]=a,f[3]=b,f[4]=c,f[5]=b,f[6]=c,f[7]=d)},updateOffset:function(){var a=this.width/this.regionOriginalWidth*this.scaleX,b=this.height/this.regionOriginalHeight*
this.scaleY,c=-this.width/2*this.scaleX+this.regionOffsetX*a,d=-this.height/2*this.scaleY+this.regionOffsetY*b,e=c+this.regionWidth*a,a=d+this.regionHeight*b,b=this.rotation*Math.PI/180,f=Math.cos(b),g=Math.sin(b),b=c*f+this.x,c=c*g,h=d*f+this.y,d=d*g,l=e*f+this.x,e=e*g,f=a*f+this.y,a=a*g,g=this.offset;g[0]=b-d;g[1]=h+c;g[2]=b-a;g[3]=f+c;g[4]=l-a;g[5]=f+e;g[6]=l-d;g[7]=h+e},computeVertices:function(a,b,c,d){a+=c.worldX;b+=c.worldY;var e=c.m00,f=c.m01,g=c.m10;c=c.m11;var h=this.offset;d[0]=h[0]*e+
h[1]*f+a;d[1]=h[0]*g+h[1]*c+b;d[2]=h[2]*e+h[3]*f+a;d[3]=h[2]*g+h[3]*c+b;d[4]=h[4]*e+h[5]*f+a;d[5]=h[4]*g+h[5]*c+b;d[6]=h[6]*e+h[7]*f+a;d[7]=h[6]*g+h[7]*c+b}};spine.BoundingBoxAttachment=function(a){this.name=a;this.vertices=[];this.type=spine.AttachmentType.boundingBox};
spine.BoundingBoxAttachment.prototype={type:spine.AttachmentType.boundingBox,computeWorldVertices:function(a,b,c,d){a+=c.worldX;b+=c.worldY;var e=c.m00,f=c.m01,g=c.m10;c=c.m11;for(var h=this.vertices,l=0,k=h.length;l<k;l+=2){var n=h[l],m=h[l+1];d[l]=n*e+m*f+a;d[l+1]=n*g+m*c+b}}};spine.AnimationStateData=function(a){this.skeletonData=a;this.animationToMixTime={}};
spine.AnimationStateData.prototype={defaultMix:0,setMixByName:function(a,b,c){var d=this.skeletonData.findAnimation(a);if(!d)throw"Animation not found: "+a;a=this.skeletonData.findAnimation(b);if(!a)throw"Animation not found: "+b;this.setMix(d,a,c)},setMix:function(a,b,c){this.animationToMixTime[a.name+":"+b.name]=c},getMix:function(a,b){var c=this.animationToMixTime[a.name+":"+b.name];return c?c:this.defaultMix}};spine.TrackEntry=function(){};
spine.TrackEntry.prototype={next:null,previous:null,animation:null,loop:!1,delay:0,time:0,lastTime:-1,endTime:0,timeScale:1,mixTime:0,mixDuration:0,onStart:null,onEnd:null,onComplete:null,onEvent:null};spine.AnimationState=function(a){this.data=a;this.tracks=[];this.events=[]};
spine.AnimationState.prototype={onStart:null,onEnd:null,onComplete:null,onEvent:null,timeScale:1,update:function(a){a*=this.timeScale;for(var b=0;b<this.tracks.length;b++){var c=this.tracks[b];if(c){var d=a*c.timeScale;c.time+=d;c.previous&&(c.previous.time+=d,c.mixTime+=d);(d=c.next)?c.lastTime>=d.delay&&this.setCurrent(b,d):!c.loop&&c.lastTime>=c.endTime&&this.clearTrack(b)}}},apply:function(a){for(var b=0;b<this.tracks.length;b++){var c=this.tracks[b];if(c){this.events.length=0;var d=c.time,e=
c.lastTime,f=c.endTime,g=c.loop;!g&&d>f&&(d=f);var h=c.previous;if(h){var l=h.time;!h.loop&&l>h.endTime&&(l=h.endTime);h.animation.apply(a,l,l,h.loop,null);h=c.mixTime/c.mixDuration;1<=h&&(h=1,c.previous=null);c.animation.mix(a,c.lastTime,d,g,this.events,h)}else c.animation.apply(a,c.lastTime,d,g,this.events);h=0;for(l=this.events.length;h<l;h++){var k=this.events[h];if(null!=c.onEvent)c.onEvent(b,k);if(null!=this.onEvent)this.onEvent(b,k)}if(g?e%f>d%f:e<f&&d>=f){d=Math.floor(d/f);if(c.onComplete)c.onComplete(b,
d);if(this.onComplete)this.onComplete(b,d)}c.lastTime=c.time}}},clearTracks:function(){for(var a=0,b=this.tracks.length;a<b;a++)this.clearTrack(a);this.tracks.length=0},clearTrack:function(a){if(!(a>=this.tracks.length)){var b=this.tracks[a];if(b){if(null!=b.onEnd)b.onEnd(a);if(null!=this.onEnd)this.onEnd(a);this.tracks[a]=null}}},_expandToIndex:function(a){if(a<this.tracks.length)return this.tracks[a];for(;a>=this.tracks.length;)this.tracks.push(null);return null},setCurrent:function(a,b){var c=
this._expandToIndex(a);if(c){var d=c.previous;c.previous=null;if(null!=c.onEnd)c.onEnd(a);if(null!=this.onEnd)this.onEnd(a);b.mixDuration=this.data.getMix(c.animation,b.animation);0<b.mixDuration&&(b.mixTime=0,b.previous=d&&0.5>c.mixTime/c.mixDuration?d:c)}this.tracks[a]=b;if(null!=b.onStart)b.onStart(a);if(null!=this.onStart)this.onStart(a)},setAnimationByName:function(a,b,c){var d=this.data.skeletonData.findAnimation(b);if(!d)throw"Animation not found: "+b;return this.setAnimation(a,d,c)},setAnimation:function(a,
b,c){var d=new spine.TrackEntry;d.animation=b;d.loop=c;d.endTime=b.duration;this.setCurrent(a,d);return d},addAnimationByName:function(a,b,c,d){var e=this.data.skeletonData.findAnimation(b);if(!e)throw"Animation not found: "+b;return this.addAnimation(a,e,c,d)},addAnimation:function(a,b,c,d){var e=new spine.TrackEntry;e.animation=b;e.loop=c;e.endTime=b.duration;if(c=this._expandToIndex(a)){for(;c.next;)c=c.next;c.next=e}else this.tracks[a]=e;0>=d&&(d=c?d+(c.endTime-this.data.getMix(c.animation,b)):
0);e.delay=d;return e},getCurrent:function(a){return a>=this.tracks.length?null:this.tracks[a]}};spine.SkeletonJson=function(a){this.attachmentLoader=a};
spine.SkeletonJson.prototype={scale:1,readSkeletonData:function(a){for(var b=new spine.SkeletonData,c=a.bones,d=0,e=c.length;d<e;d++){var f=c[d],g=null;if(f.parent&&(g=b.findBone(f.parent),!g))throw"Parent bone not found: "+f.parent;g=new spine.BoneData(f.name,g);g.length=(f.length||0)*this.scale;g.x=(f.x||0)*this.scale;g.y=(f.y||0)*this.scale;g.rotation=f.rotation||0;g.scaleX=f.scaleX||1;g.scaleY=f.scaleY||1;g.inheritScale=!f.inheritScale||"true"==f.inheritScale;g.inheritRotation=!f.inheritRotation||
"true"==f.inheritRotation;b.bones.push(g)}c=a.slots;d=0;for(e=c.length;d<e;d++){f=c[d];g=b.findBone(f.bone);if(!g)throw"Slot bone not found: "+f.bone;var g=new spine.SlotData(f.name,g),h=f.color;h&&(g.r=spine.SkeletonJson.toColor(h,0),g.g=spine.SkeletonJson.toColor(h,1),g.b=spine.SkeletonJson.toColor(h,2),g.a=spine.SkeletonJson.toColor(h,3));g.attachmentName=f.attachment;g.additiveBlending=f.additive&&"true"==f.additive;b.slots.push(g)}var d=a.skins,l;for(l in d)if(d.hasOwnProperty(l)){var e=d[l],
g=new spine.Skin(l),k;for(k in e)if(e.hasOwnProperty(k)){var c=b.findSlotIndex(k),f=e[k],n;for(n in f)f.hasOwnProperty(n)&&(h=this.readAttachment(g,n,f[n]),null!=h&&g.addAttachment(c,n,h))}b.skins.push(g);"default"==g.name&&(b.defaultSkin=g)}l=a.events;for(var m in l)l.hasOwnProperty(m)&&(k=l[m],n=new spine.EventData(m),n.intValue=k["int"]||0,n.floatValue=k["float"]||0,n.stringValue=k.string||null,b.events.push(n));a=a.animations;for(var q in a)a.hasOwnProperty(q)&&this.readAnimation(q,a[q],b);return b},
readAttachment:function(a,b,c){b=c.name||b;var d=spine.AttachmentType[c.type||"region"];a=this.attachmentLoader.newAttachment(a,d,b);if(d==spine.AttachmentType.region)a.x=(c.x||0)*this.scale,a.y=(c.y||0)*this.scale,a.scaleX=c.scaleX||1,a.scaleY=c.scaleY||1,a.rotation=c.rotation||0,a.width=(c.width||32)*this.scale,a.height=(c.height||32)*this.scale,a.updateOffset();else if(d==spine.AttachmentType.boundingBox){c=c.vertices;d=0;for(b=c.length;d<b;d++)a.vertices.push(c[d]*this.scale)}return a},readAnimation:function(a,
b,c){var d=[],e=0,f=b.bones,g;for(g in f)if(f.hasOwnProperty(g)){var h=c.findBoneIndex(g);if(-1==h)throw"Bone not found: "+g;var l=f[g],k;for(k in l)if(l.hasOwnProperty(k)){var n=l[k];if("rotate"==k){var m=new spine.RotateTimeline(n.length);m.boneIndex=h;for(var q=0,r=0,t=n.length;r<t;r++){var p=n[r];m.setFrame(q,p.time,p.angle);spine.SkeletonJson.readCurve(m,q,p);q++}d.push(m);e=Math.max(e,m.frames[2*m.getFrameCount()-2])}else if("translate"==k||"scale"==k){var u=1;"scale"==k?m=new spine.ScaleTimeline(n.length):
(m=new spine.TranslateTimeline(n.length),u=this.scale);m.boneIndex=h;r=q=0;for(t=n.length;r<t;r++)p=n[r],m.setFrame(q,p.time,(p.x||0)*u,(p.y||0)*u),spine.SkeletonJson.readCurve(m,q,p),q++;d.push(m);e=Math.max(e,m.frames[3*m.getFrameCount()-3])}else throw"Invalid timeline type for a bone: "+k+" ("+g+")";}}g=b.slots;for(var s in g)if(g.hasOwnProperty(s))for(k in h=g[s],f=c.findSlotIndex(s),h)if(h.hasOwnProperty(k))if(n=h[k],"color"==k){m=new spine.ColorTimeline(n.length);m.slotIndex=f;r=q=0;for(t=n.length;r<
t;r++){var p=n[r],v=p.color,l=spine.SkeletonJson.toColor(v,0),u=spine.SkeletonJson.toColor(v,1),w=spine.SkeletonJson.toColor(v,2),v=spine.SkeletonJson.toColor(v,3);m.setFrame(q,p.time,l,u,w,v);spine.SkeletonJson.readCurve(m,q,p);q++}d.push(m);e=Math.max(e,m.frames[5*m.getFrameCount()-5])}else if("attachment"==k){m=new spine.AttachmentTimeline(n.length);m.slotIndex=f;r=q=0;for(t=n.length;r<t;r++)p=n[r],m.setFrame(q++,p.time,p.name);d.push(m);e=Math.max(e,m.frames[m.getFrameCount()-1])}else throw"Invalid timeline type for a slot: "+
k+" ("+s+")";if(f=b.events){m=new spine.EventTimeline(f.length);r=q=0;for(t=f.length;r<t;r++){k=f[r];n=c.findEvent(k.name);if(!n)throw"Event not found: "+k.name;p=new spine.Event(n);p.intValue=k.hasOwnProperty("int")?k["int"]:n.intValue;p.floatValue=k.hasOwnProperty("float")?k["float"]:n.floatValue;p.stringValue=k.hasOwnProperty("string")?k.string:n.stringValue;m.setFrame(q++,k.time,p)}d.push(m);e=Math.max(e,m.frames[m.getFrameCount()-1])}if(b=b.draworder){m=new spine.DrawOrderTimeline(b.length);
k=c.slots.length;r=q=0;for(t=b.length;r<t;r++){n=b[r];p=null;if(n.offsets){p=[];p.length=k;for(s=k-1;0<=s;s--)p[s]=-1;g=n.offsets;h=[];h.length=k-g.length;s=u=l=0;for(w=g.length;s<w;s++){v=g[s];f=c.findSlotIndex(v.slot);if(-1==f)throw"Slot not found: "+v.slot;for(;l!=f;)h[u++]=l++;p[l+v.offset]=l++}for(;l<k;)h[u++]=l++;for(s=k-1;0<=s;s--)-1==p[s]&&(p[s]=h[--u])}m.setFrame(q++,n.time,p)}d.push(m);e=Math.max(e,m.frames[m.getFrameCount()-1])}c.animations.push(new spine.Animation(a,d,e))}};
spine.SkeletonJson.readCurve=function(a,b,c){(c=c.curve)&&("stepped"==c?a.curves.setStepped(b):c instanceof Array&&a.curves.setCurve(b,c[0],c[1],c[2],c[3]))};spine.SkeletonJson.toColor=function(a,b){if(8!=a.length)throw"Color hexidecimal length must be 8, recieved: "+a;return parseInt(a.substring(2*b,2*b+2),16)/255};
spine.Atlas=function(a,b){this.textureLoader=b;this.pages=[];this.regions=[];var c=new spine.AtlasReader(a),d=[];d.length=4;for(var e=null;;){var f=c.readLine();if(null==f)break;f=c.trim(f);if(0==f.length)e=null;else if(e){var g=new spine.AtlasRegion;g.name=f;g.page=e;g.rotate="true"==c.readValue();c.readTuple(d);var f=parseInt(d[0]),h=parseInt(d[1]);c.readTuple(d);var l=parseInt(d[0]),k=parseInt(d[1]);g.u=f/e.width;g.v=h/e.height;g.rotate?(g.u2=(f+k)/e.width,g.v2=(h+l)/e.height):(g.u2=(f+l)/e.width,
g.v2=(h+k)/e.height);g.x=f;g.y=h;g.width=Math.abs(l);g.height=Math.abs(k);4==c.readTuple(d)&&(g.splits=[parseInt(d[0]),parseInt(d[1]),parseInt(d[2]),parseInt(d[3])],4==c.readTuple(d)&&(g.pads=[parseInt(d[0]),parseInt(d[1]),parseInt(d[2]),parseInt(d[3])],c.readTuple(d)));g.originalWidth=parseInt(d[0]);g.originalHeight=parseInt(d[1]);c.readTuple(d);g.offsetX=parseInt(d[0]);g.offsetY=parseInt(d[1]);g.index=parseInt(c.readValue());this.regions.push(g)}else e=new spine.AtlasPage,e.name=f,e.format=spine.Atlas.Format[c.readValue()],
c.readTuple(d),e.minFilter=spine.Atlas.TextureFilter[d[0]],e.magFilter=spine.Atlas.TextureFilter[d[1]],g=c.readValue(),e.uWrap=spine.Atlas.TextureWrap.clampToEdge,e.vWrap=spine.Atlas.TextureWrap.clampToEdge,"x"==g?e.uWrap=spine.Atlas.TextureWrap.repeat:"y"==g?e.vWrap=spine.Atlas.TextureWrap.repeat:"xy"==g&&(e.uWrap=e.vWrap=spine.Atlas.TextureWrap.repeat),b.load(e,f,this),this.pages.push(e)}};
spine.Atlas.prototype={findRegion:function(a){for(var b=this.regions,c=0,d=b.length;c<d;c++)if(b[c].name==a)return b[c];return null},dispose:function(){for(var a=this.pages,b=0,c=a.length;b<c;b++)this.textureLoader.unload(a[b].rendererObject)},updateUVs:function(a){for(var b=this.regions,c=0,d=b.length;c<d;c++){var e=b[c];e.page==a&&(e.u=e.x/a.width,e.v=e.y/a.height,e.rotate?(e.u2=(e.x+e.height)/a.width,e.v2=(e.y+e.width)/a.height):(e.u2=(e.x+e.width)/a.width,e.v2=(e.y+e.height)/a.height))}}};
spine.Atlas.Format={Alpha:0,Intensity:1,LuminanceAlpha:2,RGB565:3,RGBA4444:4,RGB888:5,RGBA8888:6};spine.Atlas.TextureFilter={Nearest:0,Linear:1,MipMap:2,MipMapNearestNearest:3,MipMapLinearNearest:4,MipMapNearestLinear:5,MipMapLinearLinear:6};spine.Atlas.TextureWrap={mirroredRepeat:0,clampToEdge:1,repeat:2};spine.AtlasPage=function(){};spine.AtlasPage.prototype={name:null,format:null,minFilter:null,magFilter:null,uWrap:null,vWrap:null,rendererObject:null,width:0,height:0};spine.AtlasRegion=function(){};
spine.AtlasRegion.prototype={page:null,name:null,x:0,y:0,width:0,height:0,u:0,v:0,u2:0,v2:0,offsetX:0,offsetY:0,originalWidth:0,originalHeight:0,index:0,rotate:!1,splits:null,pads:null};spine.AtlasReader=function(a){this.lines=a.split(/\r\n|\r|\n/)};
spine.AtlasReader.prototype={index:0,trim:function(a){return a.replace(/^\s+|\s+$/g,"")},readLine:function(){return this.index>=this.lines.length?null:this.lines[this.index++]},readValue:function(){var a=this.readLine(),b=a.indexOf(":");if(-1==b)throw"Invalid line: "+a;return this.trim(a.substring(b+1))},readTuple:function(a){var b=this.readLine(),c=b.indexOf(":");if(-1==c)throw"Invalid line: "+b;for(var d=0,c=c+1;3>d;d++){var e=b.indexOf(",",c);if(-1==e){if(0==d)throw"Invalid line: "+b;break}a[d]=
this.trim(b.substr(c,e-c));c=e+1}a[d]=this.trim(b.substring(c));return d+1}};spine.AtlasAttachmentLoader=function(a){this.atlas=a};
spine.AtlasAttachmentLoader.prototype={newAttachment:function(a,b,c){switch(b){case spine.AttachmentType.boundingbox:return new spine.BoundingBoxAttachment(c);case spine.AttachmentType.region:a=this.atlas.findRegion(c);if(!a)throw"Region not found in atlas: "+c+" ("+b+")";b=new spine.RegionAttachment(c);b.rendererObject=a;b.setUVs(a.u,a.v,a.u2,a.v2,a.rotate);b.regionOffsetX=a.offsetX;b.regionOffsetY=a.offsetY;b.regionWidth=a.width;b.regionHeight=a.height;b.regionOriginalWidth=a.originalWidth;b.regionOriginalHeight=
a.originalHeight;return b}throw"Unknown attachment type: "+b;}};spine.SkeletonBounds=function(){this.polygonPool=[];this.polygons=[];this.boundingBoxes=[]};
spine.SkeletonBounds.prototype={minX:0,minY:0,maxX:0,maxY:0,update:function(a,b){for(var c=a.slots,d=c.length,e=a.x,f=a.y,g=this.boundingBoxes,h=this.polygonPool,l=this.polygons,k=g.length=0,n=l.length;k<n;k++)h.push(l[k]);for(k=l.length=0;k<d;k++){var n=c[k],m=n.attachment;if(m.type==spine.AttachmentType.boundingBox){g.push(m);var q=h.length,r;0<q?(r=h[q-1],h.splice(q-1,1)):r=[];l.push(r);r.length=m.vertices.length;m.computeWorldVertices(e,f,n.bone,r)}}b&&this.aabbCompute()},aabbCompute:function(){for(var a=
this.polygons,b=Number.MAX_VALUE,c=Number.MAX_VALUE,d=Number.MIN_VALUE,e=Number.MIN_VALUE,f=0,g=a.length;f<g;f++)for(var h=a[f],l=0,k=h.length;l<k;l+=2)var n=h[l],m=h[l+1],b=Math.min(b,n),c=Math.min(c,m),d=Math.max(d,n),e=Math.max(e,m);this.minX=b;this.minY=c;this.maxX=d;this.maxY=e},aabbContainsPoint:function(a,b){return a>=this.minX&&a<=this.maxX&&b>=this.minY&&b<=this.maxY},aabbIntersectsSegment:function(a,b,c,d){var e=this.minX,f=this.minY,g=this.maxX,h=this.maxY;if(a<=e&&c<=e||b<=f&&d<=f||a>=
g&&c>=g||b>=h&&d>=h)return!1;c=(d-b)/(c-a);d=c*(e-a)+b;if(d>f&&d<h)return!0;d=c*(g-a)+b;if(d>f&&d<h)return!0;f=(f-b)/c+a;if(f>e&&f<g)return!0;f=(h-b)/c+a;return f>e&&f<g?!0:!1},aabbIntersectsSkeleton:function(a){return this.minX<a.maxX&&this.maxX>a.minX&&this.minY<a.maxY&&this.maxY>a.minY},containsPoint:function(a,b){for(var c=this.polygons,d=0,e=c.length;d<e;d++)if(this.polygonContainsPoint(c[d],a,b))return this.boundingBoxes[d];return null},intersectsSegment:function(a,b,c,d){for(var e=this.polygons,
f=0,g=e.length;f<g;f++)if(e[f].intersectsSegment(a,b,c,d))return this.boundingBoxes[f];return null},polygonContainsPoint:function(a,b,c){for(var d=a.length,e=d-2,f=!1,g=0;g<d;g+=2){var h=a[g+1],l=a[e+1];if(h<c&&l>=c||l<c&&h>=c){var k=a[g];k+(c-h)/(l-h)*(a[e]-k)<b&&(f=!f)}e=g}return f},intersectsSegment:function(a,b,c,d,e){for(var f=a.length,g=b-d,h=c-e,l=b*e-c*d,k=a[f-2],n=a[f-1],m=0;m<f;m+=2){var q=a[m],r=a[m+1],t=k*r-n*q,p=k-q,u=n-r,s=g*u-h*p,p=(l*p-g*t)/s;if((p>=k&&p<=q||p>=q&&p<=k)&&(p>=b&&p<=
d||p>=d&&p<=b))if(k=(l*u-h*t)/s,(k>=n&&k<=r||k>=r&&k<=n)&&(k>=c&&k<=e||k>=e&&k<=c))return!0;k=q;n=r}return!1},getPolygon:function(a){a=this.boundingBoxes.indexOf(a);return-1==a?null:this.polygons[a]},getWidth:function(){return this.maxX-this.minX},getHeight:function(){return this.maxY-this.minY}};sp._atlasPage_createTexture_webGL=function(a,b){var c=cc.textureCache.addImage(b);a.rendererObject=cc.TextureAtlas.create(c,128);a.width=c.getPixelsWide();a.height=c.getPixelsHigh()};sp._atlasPage_createTexture_canvas=function(a,b){a._texture=cc.textureCache.addImage(b)};sp._atlasPage_disposeTexture=function(a){a.rendererObject.release()};
sp._atlasLoader={spAtlasFile:null,setAtlasFile:function(a){this.spAtlasFile=a},load:function(a,b,c){b=cc.path.join(cc.path.dirname(this.spAtlasFile),b);cc._renderType===cc._RENDER_TYPE_WEBGL?sp._atlasPage_createTexture_webGL(a,b):sp._atlasPage_createTexture_canvas(a,b)},unload:function(a){}};
sp._regionAttachment_computeWorldVertices=function(a,b,c,d,e){a=a.offset;b+=d.worldX;c+=d.worldY;var f=sp.VERTEX_INDEX;e[f.X1]=a[f.X1]*d.m00+a[f.Y1]*d.m01+b;e[f.Y1]=a[f.X1]*d.m10+a[f.Y1]*d.m11+c;e[f.X2]=a[f.X2]*d.m00+a[f.Y2]*d.m01+b;e[f.Y2]=a[f.X2]*d.m10+a[f.Y2]*d.m11+c;e[f.X3]=a[f.X3]*d.m00+a[f.Y3]*d.m01+b;e[f.Y3]=a[f.X3]*d.m10+a[f.Y3]*d.m11+c;e[f.X4]=a[f.X4]*d.m00+a[f.Y4]*d.m01+b;e[f.Y4]=a[f.X4]*d.m10+a[f.Y4]*d.m11+c};
sp._regionAttachment_updateQuad=function(a,b,c,d){var e={};a.computeVertices(b.skeleton.x,b.skeleton.y,b.bone,e);var f=255*b.skeleton.r*b.r,g=255*b.skeleton.g*b.g,h=255*b.skeleton.b*b.b;b=b.skeleton.a*b.a;d&&(f*=b,g*=b,h*=b);c.bl.colors.r=c.tl.colors.r=c.tr.colors.r=c.br.colors.r=f;c.bl.colors.g=c.tl.colors.g=c.tr.colors.g=c.br.colors.g=g;c.bl.colors.b=c.tl.colors.b=c.tr.colors.b=c.br.colors.b=h;c.bl.colors.a=c.tl.colors.a=c.tr.colors.a=c.br.colors.a=255*b;d=sp.VERTEX_INDEX;c.bl.vertices.x=e[d.X1];
c.bl.vertices.y=e[d.Y1];c.tl.vertices.x=e[d.X2];c.tl.vertices.y=e[d.Y2];c.tr.vertices.x=e[d.X3];c.tr.vertices.y=e[d.Y3];c.br.vertices.x=e[d.X4];c.br.vertices.y=e[d.Y4];c.bl.texCoords.u=a.uvs[d.X1];c.bl.texCoords.v=a.uvs[d.Y1];c.tl.texCoords.u=a.uvs[d.X2];c.tl.texCoords.v=a.uvs[d.Y2];c.tr.texCoords.u=a.uvs[d.X3];c.tr.texCoords.v=a.uvs[d.Y3];c.br.texCoords.u=a.uvs[d.X4];c.br.texCoords.v=a.uvs[d.Y4]};
sp._regionAttachment_updateSlotForCanvas=function(a,b,c){if(c){var d={};a.computeVertices(b.skeleton.x,b.skeleton.y,b.bone,d);a=sp.VERTEX_INDEX;c.length=0;c.push(cc.p(d[a.X1],d[a.Y1]));c.push(cc.p(d[a.X4],d[a.Y4]));c.push(cc.p(d[a.X3],d[a.Y3]));c.push(cc.p(d[a.X2],d[a.Y2]))}};sp.ANIMATION_EVENT_TYPE={START:0,END:1,COMPLETE:2,EVENT:3};
sp.SkeletonAnimation=sp.Skeleton.extend({_state:null,_target:null,_callback:null,init:function(){sp.Skeleton.prototype.init.call(this);this.setAnimationStateData(new spine.AnimationStateData(this._skeleton.data))},setAnimationStateData:function(a){a=new spine.AnimationState(a);a.onStart=this._onAnimationStateStart.bind(this);a.onComplete=this._onAnimationStateComplete.bind(this);a.onEnd=this._onAnimationStateEnd.bind(this);a.onEvent=this._onAnimationStateEvent.bind(this);this._state=a},setMix:function(a,
b,c){this._state.data.setMixByName(a,b,c)},setAnimationListener:function(a,b){this._target=a;this._callback=b},setAnimation:function(a,b,c){var d=this._skeleton.data.findAnimation(b);return!d?(cc.log("Spine: Animation not found: "+b),null):this._state.setAnimation(a,d,c)},addAnimation:function(a,b,c,d){var e=this._skeleton.data.findAnimation(b);return!e?(cc.log("Spine: Animation not found:"+b),null):this._state.addAnimation(a,e,c,d)},getCurrent:function(a){return this._state.getCurrent(a)},clearTracks:function(){this._state.clearTracks()},
clearTrack:function(a){this._state.clearTrack(a)},update:function(a){this._super(a);a*=this._timeScale;this._state.update(a);this._state.apply(this._skeleton);this._skeleton.updateWorldTransform()},_onAnimationStateStart:function(a){this._animationStateCallback(a,sp.ANIMATION_EVENT_TYPE.START,null,0)},_onAnimationStateEnd:function(a){this._animationStateCallback(a,sp.ANIMATION_EVENT_TYPE.END,null,0)},_onAnimationStateComplete:function(a,b){this._animationStateCallback(a,sp.ANIMATION_EVENT_TYPE.COMPLETE,
null,b)},_onAnimationStateEvent:function(a,b){this._animationStateCallback(a,sp.ANIMATION_EVENT_TYPE.EVENT,b,0)},_animationStateCallback:function(a,b,c,d){this._target&&this._callback&&this._callback.call(this._target,this,a,b,c,d)}});sp.SkeletonAnimation.create=function(a,b,c){return new sp.SkeletonAnimation(a,b,c)};