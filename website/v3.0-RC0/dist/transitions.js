cc.SCENE_FADE=4208917214;cc.TransitionEaseScene=cc.Class.extend({easeActionWithAction:function(){}});cc.TRANSITION_ORIENTATION_LEFT_OVER=0;cc.TRANSITION_ORIENTATION_RIGHT_OVER=1;cc.TRANSITION_ORIENTATION_UP_OVER=0;cc.TRANSITION_ORIENTATION_DOWN_OVER=1;
cc.TransitionScene=cc.Scene.extend({_inScene:null,_outScene:null,_duration:null,_isInSceneOnTop:!1,_isSendCleanupToScene:!1,_className:"TransitionScene",ctor:function(a,c){cc.Scene.prototype.ctor.call(this);void 0!==a&&void 0!==c&&this.initWithDuration(a,c)},_setNewScene:function(a){this.unschedule(this._setNewScene);a=cc.director;this._isSendCleanupToScene=a.isSendCleanupToScene();a.runScene(this._inScene);cc.eventManager.setEnabled(!0);this._outScene.visible=!0},_sceneOrder:function(){this._isInSceneOnTop=
!0},draw:function(){this._isInSceneOnTop?(this._outScene.visit(),this._inScene.visit()):(this._inScene.visit(),this._outScene.visit())},onEnter:function(){cc.Node.prototype.onEnter.call(this);cc.eventManager.setEnabled(!1);this._outScene.onExitTransitionDidStart();this._inScene.onEnter()},onExit:function(){cc.Node.prototype.onExit.call(this);cc.eventManager.setEnabled(!0);this._outScene.onExit();this._inScene.onEnterTransitionDidFinish()},cleanup:function(){cc.Node.prototype.cleanup.call(this);this._isSendCleanupToScene&&
this._outScene.cleanup()},initWithDuration:function(a,c){if(!c)throw"cc.TransitionScene.initWithDuration(): Argument scene must be non-nil";if(this.init()){this._duration=a;this.attr({x:0,y:0,anchorX:0,anchorY:0});this._inScene=c;this._outScene=cc.director.getRunningScene();this._outScene||(this._outScene=cc.Scene.create(),this._outScene.init());if(this._inScene==this._outScene)throw"cc.TransitionScene.initWithDuration(): Incoming scene must be different from the outgoing scene";this._sceneOrder();
return!0}return!1},finish:function(){this._inScene.attr({visible:!0,x:0,y:0,scale:1,rotation:0});cc._renderType===cc._RENDER_TYPE_WEBGL&&this._inScene.getCamera().restore();this._outScene.attr({visible:!1,x:0,y:0,scale:1,rotation:0});cc._renderType===cc._RENDER_TYPE_WEBGL&&this._outScene.getCamera().restore();this.schedule(this._setNewScene,0)},hideOutShowIn:function(){this._inScene.visible=!0;this._outScene.visible=!1}});cc.TransitionScene.create=function(a,c){return new cc.TransitionScene(a,c)};
cc.TransitionSceneOriented=cc.TransitionScene.extend({_orientation:0,initWithDuration:function(a,c,b){cc.TransitionScene.prototype.initWithDuration.call(this,a,c)&&(this._orientation=b);return!0}});cc.TransitionSceneOriented.create=function(a,c,b){var d=new cc.TransitionSceneOriented;d.initWithDuration(a,c,b);return d};
cc.TransitionRotoZoom=cc.TransitionScene.extend({onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);this._inScene.attr({scale:0.001,anchorX:0.5,anchorY:0.5});this._outScene.attr({scale:1,anchorX:0.5,anchorY:0.5});var a=cc.Sequence.create(cc.Spawn.create(cc.ScaleBy.create(this._duration/2,0.001),cc.RotateBy.create(this._duration/2,720)),cc.DelayTime.create(this._duration/2));this._outScene.runAction(a);this._inScene.runAction(cc.Sequence.create(a.reverse(),cc.CallFunc.create(this.finish,
this)))}});cc.TransitionRotoZoom.create=function(a,c){var b=new cc.TransitionRotoZoom;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionJumpZoom=cc.TransitionScene.extend({onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a=cc.director.getWinSize();this._inScene.attr({scale:0.5,x:a.width,y:0,anchorX:0.5,anchorY:0.5});this._outScene.anchorX=0.5;this._outScene.anchorY=0.5;var c=cc.JumpBy.create(this._duration/4,cc.p(-a.width,0),a.width/4,2),b=cc.ScaleTo.create(this._duration/4,1),a=cc.ScaleTo.create(this._duration/4,0.5),a=cc.Sequence.create(a,c),c=cc.Sequence.create(c,b),b=cc.DelayTime.create(this._duration/
2);this._outScene.runAction(a);this._inScene.runAction(cc.Sequence.create(b,c,cc.CallFunc.create(this.finish,this)))}});cc.TransitionJumpZoom.create=function(a,c){var b=new cc.TransitionJumpZoom;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionMoveInL=cc.TransitionScene.extend({onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);this.initScenes();var a=this.action();this._inScene.runAction(cc.Sequence.create(this.easeActionWithAction(a),cc.CallFunc.create(this.finish,this)))},initScenes:function(){this._inScene.setPosition(-cc.director.getWinSize().width,0)},action:function(){return cc.MoveTo.create(this._duration,cc.p(0,0))},easeActionWithAction:function(a){return cc.EaseOut.create(a,2)}});
cc.TransitionMoveInL.create=function(a,c){var b=new cc.TransitionMoveInL;return null!=b&&b.initWithDuration(a,c)?b:null};cc.TransitionMoveInR=cc.TransitionMoveInL.extend({initScenes:function(){this._inScene.setPosition(cc.director.getWinSize().width,0)}});cc.TransitionMoveInR.create=function(a,c){var b=new cc.TransitionMoveInR;return null!=b&&b.initWithDuration(a,c)?b:null};cc.TransitionMoveInT=cc.TransitionMoveInL.extend({initScenes:function(){this._inScene.setPosition(0,cc.director.getWinSize().height)}});
cc.TransitionMoveInT.create=function(a,c){var b=new cc.TransitionMoveInT;return null!=b&&b.initWithDuration(a,c)?b:null};cc.TransitionMoveInB=cc.TransitionMoveInL.extend({initScenes:function(){this._inScene.setPosition(0,-cc.director.getWinSize().height)}});cc.TransitionMoveInB.create=function(a,c){var b=new cc.TransitionMoveInB;return null!=b&&b.initWithDuration(a,c)?b:null};cc.ADJUST_FACTOR=0.5;
cc.TransitionSlideInL=cc.TransitionScene.extend({_sceneOrder:function(){this._isInSceneOnTop=!1},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);this.initScenes();var a=this.action(),c=this.action(),a=this.easeActionWithAction(a),c=cc.Sequence.create(this.easeActionWithAction(c),cc.CallFunc.create(this.finish,this));this._inScene.runAction(a);this._outScene.runAction(c)},initScenes:function(){this._inScene.setPosition(-cc.director.getWinSize().width+cc.ADJUST_FACTOR,0)},action:function(){return cc.MoveBy.create(this._duration,
cc.p(cc.director.getWinSize().width-cc.ADJUST_FACTOR,0))},easeActionWithAction:function(a){return cc.EaseOut.create(a,2)}});cc.TransitionSlideInL.create=function(a,c){var b=new cc.TransitionSlideInL;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionSlideInR=cc.TransitionSlideInL.extend({_sceneOrder:function(){this._isInSceneOnTop=!0},initScenes:function(){this._inScene.setPosition(cc.director.getWinSize().width-cc.ADJUST_FACTOR,0)},action:function(){return cc.MoveBy.create(this._duration,cc.p(-(cc.director.getWinSize().width-cc.ADJUST_FACTOR),0))}});cc.TransitionSlideInR.create=function(a,c){var b=new cc.TransitionSlideInR;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionSlideInB=cc.TransitionSlideInL.extend({_sceneOrder:function(){this._isInSceneOnTop=!1},initScenes:function(){this._inScene.setPosition(0,cc.director.getWinSize().height-cc.ADJUST_FACTOR)},action:function(){return cc.MoveBy.create(this._duration,cc.p(0,-(cc.director.getWinSize().height-cc.ADJUST_FACTOR)))}});cc.TransitionSlideInB.create=function(a,c){var b=new cc.TransitionSlideInB;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionSlideInT=cc.TransitionSlideInL.extend({_sceneOrder:function(){this._isInSceneOnTop=!0},initScenes:function(){this._inScene.setPosition(0,-(cc.director.getWinSize().height-cc.ADJUST_FACTOR))},action:function(){return cc.MoveBy.create(this._duration,cc.p(0,cc.director.getWinSize().height-cc.ADJUST_FACTOR))}});cc.TransitionSlideInT.create=function(a,c){var b=new cc.TransitionSlideInT;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionShrinkGrow=cc.TransitionScene.extend({onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);this._inScene.attr({scale:0.001,anchorX:2/3,anchorY:0.5});this._outScene.attr({scale:1,anchorX:1/3,anchorY:0.5});var a=cc.ScaleTo.create(this._duration,0.01),c=cc.ScaleTo.create(this._duration,1);this._inScene.runAction(this.easeActionWithAction(c));this._outScene.runAction(cc.Sequence.create(this.easeActionWithAction(a),cc.CallFunc.create(this.finish,this)))},easeActionWithAction:function(a){return cc.EaseOut.create(a,
2)}});cc.TransitionShrinkGrow.create=function(a,c){var b=new cc.TransitionShrinkGrow;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionFlipX=cc.TransitionSceneOriented.extend({onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,c;this._inScene.visible=!1;var b;this._orientation===cc.TRANSITION_ORIENTATION_RIGHT_OVER?(a=90,b=270,c=90):(a=-90,b=90,c=-90);a=cc.Sequence.create(cc.DelayTime.create(this._duration/2),cc.Show.create(),cc.OrbitCamera.create(this._duration/2,1,0,b,a,0,0),cc.CallFunc.create(this.finish,this));c=cc.Sequence.create(cc.OrbitCamera.create(this._duration/2,1,0,0,c,0,0),cc.Hide.create(),
cc.DelayTime.create(this._duration/2));this._inScene.runAction(a);this._outScene.runAction(c)}});cc.TransitionFlipX.create=function(a,c,b){null==b&&(b=cc.TRANSITION_ORIENTATION_RIGHT_OVER);var d=new cc.TransitionFlipX;d.initWithDuration(a,c,b);return d};
cc.TransitionFlipY=cc.TransitionSceneOriented.extend({onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,c;this._inScene.visible=!1;var b;this._orientation==cc.TRANSITION_ORIENTATION_UP_OVER?(a=90,b=270,c=90):(a=-90,b=90,c=-90);a=cc.Sequence.create(cc.DelayTime.create(this._duration/2),cc.Show.create(),cc.OrbitCamera.create(this._duration/2,1,0,b,a,90,0),cc.CallFunc.create(this.finish,this));c=cc.Sequence.create(cc.OrbitCamera.create(this._duration/2,1,0,0,c,90,0),cc.Hide.create(),
cc.DelayTime.create(this._duration/2));this._inScene.runAction(a);this._outScene.runAction(c)}});cc.TransitionFlipY.create=function(a,c,b){null==b&&(b=cc.TRANSITION_ORIENTATION_UP_OVER);var d=new cc.TransitionFlipY;d.initWithDuration(a,c,b);return d};
cc.TransitionFlipAngular=cc.TransitionSceneOriented.extend({onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,c;this._inScene.visible=!1;var b;this._orientation===cc.TRANSITION_ORIENTATION_RIGHT_OVER?(a=90,b=270,c=90):(a=-90,b=90,c=-90);a=cc.Sequence.create(cc.DelayTime.create(this._duration/2),cc.Show.create(),cc.OrbitCamera.create(this._duration/2,1,0,b,a,-45,0),cc.CallFunc.create(this.finish,this));c=cc.Sequence.create(cc.OrbitCamera.create(this._duration/2,1,0,0,c,45,0),
cc.Hide.create(),cc.DelayTime.create(this._duration/2));this._inScene.runAction(a);this._outScene.runAction(c)}});cc.TransitionFlipAngular.create=function(a,c,b){null==b&&(b=cc.TRANSITION_ORIENTATION_RIGHT_OVER);var d=new cc.TransitionFlipAngular;d.initWithDuration(a,c,b);return d};
cc.TransitionZoomFlipX=cc.TransitionSceneOriented.extend({onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,c;this._inScene.visible=!1;var b;this._orientation===cc.TRANSITION_ORIENTATION_RIGHT_OVER?(a=90,b=270,c=90):(a=-90,b=90,c=-90);a=cc.Sequence.create(cc.DelayTime.create(this._duration/2),cc.Spawn.create(cc.OrbitCamera.create(this._duration/2,1,0,b,a,0,0),cc.ScaleTo.create(this._duration/2,1),cc.Show.create()),cc.CallFunc.create(this.finish,this));c=cc.Sequence.create(cc.Spawn.create(cc.OrbitCamera.create(this._duration/
2,1,0,0,c,0,0),cc.ScaleTo.create(this._duration/2,0.5)),cc.Hide.create(),cc.DelayTime.create(this._duration/2));this._inScene.scale=0.5;this._inScene.runAction(a);this._outScene.runAction(c)}});cc.TransitionZoomFlipX.create=function(a,c,b){null==b&&(b=cc.TRANSITION_ORIENTATION_RIGHT_OVER);var d=new cc.TransitionZoomFlipX;d.initWithDuration(a,c,b);return d};
cc.TransitionZoomFlipY=cc.TransitionSceneOriented.extend({onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,c;this._inScene.visible=!1;var b;this._orientation===cc.TRANSITION_ORIENTATION_UP_OVER?(a=90,b=270,c=90):(a=-90,b=90,c=-90);a=cc.Sequence.create(cc.DelayTime.create(this._duration/2),cc.Spawn.create(cc.OrbitCamera.create(this._duration/2,1,0,b,a,90,0),cc.ScaleTo.create(this._duration/2,1),cc.Show.create()),cc.CallFunc.create(this.finish,this));c=cc.Sequence.create(cc.Spawn.create(cc.OrbitCamera.create(this._duration/
2,1,0,0,c,90,0),cc.ScaleTo.create(this._duration/2,0.5)),cc.Hide.create(),cc.DelayTime.create(this._duration/2));this._inScene.scale=0.5;this._inScene.runAction(a);this._outScene.runAction(c)}});cc.TransitionZoomFlipY.create=function(a,c,b){null==b&&(b=cc.TRANSITION_ORIENTATION_UP_OVER);var d=new cc.TransitionZoomFlipY;d.initWithDuration(a,c,b);return d};
cc.TransitionZoomFlipAngular=cc.TransitionSceneOriented.extend({onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a,c;this._inScene.visible=!1;var b;this._orientation===cc.TRANSITION_ORIENTATION_RIGHT_OVER?(a=90,b=270,c=90):(a=-90,b=90,c=-90);a=cc.Sequence.create(cc.DelayTime.create(this._duration/2),cc.Spawn.create(cc.OrbitCamera.create(this._duration/2,1,0,b,a,-45,0),cc.ScaleTo.create(this._duration/2,1),cc.Show.create()),cc.Show.create(),cc.CallFunc.create(this.finish,this));
c=cc.Sequence.create(cc.Spawn.create(cc.OrbitCamera.create(this._duration/2,1,0,0,c,45,0),cc.ScaleTo.create(this._duration/2,0.5)),cc.Hide.create(),cc.DelayTime.create(this._duration/2));this._inScene.scale=0.5;this._inScene.runAction(a);this._outScene.runAction(c)}});cc.TransitionZoomFlipAngular.create=function(a,c,b){null==b&&(b=cc.TRANSITION_ORIENTATION_RIGHT_OVER);var d=new cc.TransitionZoomFlipAngular;d.initWithDuration(a,c,b);return d};
cc.TransitionFade=cc.TransitionScene.extend({_color:null,ctor:function(){cc.TransitionScene.prototype.ctor.call(this);this._color=cc.color()},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a=cc.LayerColor.create(this._color);this._inScene.visible=!1;this.addChild(a,2,cc.SCENE_FADE);var a=this.getChildByTag(cc.SCENE_FADE),c=cc.Sequence.create(cc.FadeIn.create(this._duration/2),cc.CallFunc.create(this.hideOutShowIn,this),cc.FadeOut.create(this._duration/2),cc.CallFunc.create(this.finish,
this));a.runAction(c)},onExit:function(){cc.TransitionScene.prototype.onExit.call(this);this.removeChildByTag(cc.SCENE_FADE,!1)},initWithDuration:function(a,c,b){b=b||cc.color.BLACK;cc.TransitionScene.prototype.initWithDuration.call(this,a,c)&&(this._color.r=b.r,this._color.g=b.g,this._color.b=b.b,this._color.a=0);return!0}});cc.TransitionFade.create=function(a,c,b){var d=new cc.TransitionFade;d.initWithDuration(a,c,b);return d};
cc.TransitionCrossFade=cc.TransitionScene.extend({onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a=cc.color(0,0,0,0),c=cc.director.getWinSize(),a=cc.LayerColor.create(a),b=cc.RenderTexture.create(c.width,c.height);if(null!=b){b.sprite.anchorX=0.5;b.sprite.anchorY=0.5;b.attr({x:c.width/2,y:c.height/2,anchorX:0.5,anchorY:0.5});b.begin();this._inScene.visit();b.end();var d=cc.RenderTexture.create(c.width,c.height);d.setPosition(c.width/2,c.height/2);d.sprite.anchorX=d.anchorX=
0.5;d.sprite.anchorY=d.anchorY=0.5;d.begin();this._outScene.visit();d.end();b.sprite.setBlendFunc(cc.ONE,cc.ONE);d.sprite.setBlendFunc(cc.SRC_ALPHA,cc.ONE_MINUS_SRC_ALPHA);a.addChild(b);a.addChild(d);b.sprite.opacity=255;d.sprite.opacity=255;c=cc.Sequence.create(cc.FadeTo.create(this._duration,0),cc.CallFunc.create(this.hideOutShowIn,this),cc.CallFunc.create(this.finish,this));d.sprite.runAction(c);this.addChild(a,2,cc.SCENE_FADE)}},onExit:function(){this.removeChildByTag(cc.SCENE_FADE,!1);cc.TransitionScene.prototype.onExit.call(this)},
draw:function(){}});cc.TransitionCrossFade.create=function(a,c){var b=new cc.TransitionCrossFade;b.initWithDuration(a,c);return b};
cc.TransitionTurnOffTiles=cc.TransitionScene.extend({_sceneOrder:function(){this._isInSceneOnTop=!1},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a=cc.director.getWinSize(),a=cc.TurnOffTiles.create(this._duration,cc.size(0|12*(a.width/a.height),12)),a=this.easeActionWithAction(a);this._outScene.runAction(cc.Sequence.create(a,cc.CallFunc.create(this.finish,this),cc.StopGrid.create()))},easeActionWithAction:function(a){return a}});
cc.TransitionTurnOffTiles.create=function(a,c){var b=new cc.TransitionTurnOffTiles;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionSplitCols=cc.TransitionScene.extend({onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);this._inScene.visible=!1;var a=this.action(),a=cc.Sequence.create(a,cc.CallFunc.create(this.hideOutShowIn,this),a.reverse());this.runAction(cc.Sequence.create(this.easeActionWithAction(a),cc.CallFunc.create(this.finish,this),cc.StopGrid.create()))},easeActionWithAction:function(a){return cc.EaseInOut.create(a,3)},action:function(){return cc.SplitCols.create(this._duration/2,3)}});
cc.TransitionSplitCols.create=function(a,c){var b=new cc.TransitionSplitCols;return null!=b&&b.initWithDuration(a,c)?b:null};cc.TransitionSplitRows=cc.TransitionSplitCols.extend({action:function(){return cc.SplitRows.create(this._duration/2,3)}});cc.TransitionSplitRows.create=function(a,c){var b=new cc.TransitionSplitRows;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionFadeTR=cc.TransitionScene.extend({_sceneOrder:function(){this._isInSceneOnTop=!1},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a=cc.director.getWinSize(),a=this.actionWithSize(cc.size(0|12*(a.width/a.height),12));this._outScene.runAction(cc.Sequence.create(this.easeActionWithAction(a),cc.CallFunc.create(this.finish,this),cc.StopGrid.create()))},easeActionWithAction:function(a){return a},actionWithSize:function(a){return cc.FadeOutTRTiles.create(this._duration,
a)}});cc.TransitionFadeTR.create=function(a,c){var b=new cc.TransitionFadeTR;return null!=b&&b.initWithDuration(a,c)?b:null};cc.TransitionFadeBL=cc.TransitionFadeTR.extend({actionWithSize:function(a){return cc.FadeOutBLTiles.create(this._duration,a)}});cc.TransitionFadeBL.create=function(a,c){var b=new cc.TransitionFadeBL;return null!=b&&b.initWithDuration(a,c)?b:null};cc.TransitionFadeUp=cc.TransitionFadeTR.extend({actionWithSize:function(a){return cc.FadeOutUpTiles.create(this._duration,a)}});
cc.TransitionFadeUp.create=function(a,c){var b=new cc.TransitionFadeUp;return null!=b&&b.initWithDuration(a,c)?b:null};cc.TransitionFadeDown=cc.TransitionFadeTR.extend({actionWithSize:function(a){return cc.FadeOutDownTiles.create(this._duration,a)}});cc.TransitionFadeDown.create=function(a,c){var b=new cc.TransitionFadeDown;return null!=b&&b.initWithDuration(a,c)?b:null};cc.SCENE_RADIAL=49153;
cc.TransitionProgress=cc.TransitionScene.extend({_to:0,_from:0,_sceneToBeModified:null,_className:"TransitionProgress",_setAttrs:function(a,c,b){a.attr({x:c,y:b,anchorX:0.5,anchorY:0.5})},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);this._setupTransition();var a=cc.director.getWinSize(),c=cc.RenderTexture.create(a.width,a.height);c.sprite.anchorX=0.5;c.sprite.anchorY=0.5;this._setAttrs(c,a.width/2,a.height/2);c.clear(0,0,0,1);c.begin();this._sceneToBeModified.visit();c.end();
this._sceneToBeModified==this._outScene&&this.hideOutShowIn();a=this._progressTimerNodeWithRenderTexture(c);c=cc.Sequence.create(cc.ProgressFromTo.create(this._duration,this._from,this._to),cc.CallFunc.create(this.finish,this));a.runAction(c);this.addChild(a,2,cc.SCENE_RADIAL)},onExit:function(){this.removeChildByTag(cc.SCENE_RADIAL,!0);cc.TransitionScene.prototype.onExit.call(this)},_setupTransition:function(){this._sceneToBeModified=this._outScene;this._from=100;this._to=0},_progressTimerNodeWithRenderTexture:function(a){cc.log("cc.TransitionProgress._progressTimerNodeWithRenderTexture(): should be overridden in subclass");
return null},_sceneOrder:function(){this._isInSceneOnTop=!1}});cc.TransitionProgress.create=function(a,c){var b=new cc.TransitionProgress;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionProgressRadialCCW=cc.TransitionProgress.extend({_progressTimerNodeWithRenderTexture:function(a){var c=cc.director.getWinSize();a=cc.ProgressTimer.create(a.sprite);cc._renderType===cc._RENDER_TYPE_WEBGL&&(a.sprite.flippedY=!0);a.type=cc.ProgressTimer.TYPE_RADIAL;a.reverseDir=!1;a.percentage=100;this._setAttrs(a,c.width/2,c.height/2);return a}});cc.TransitionProgressRadialCCW.create=function(a,c){var b=new cc.TransitionProgressRadialCCW;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionProgressRadialCW=cc.TransitionProgress.extend({_progressTimerNodeWithRenderTexture:function(a){var c=cc.director.getWinSize();a=cc.ProgressTimer.create(a.sprite);cc._renderType===cc._RENDER_TYPE_WEBGL&&(a.sprite.flippedY=!0);a.type=cc.ProgressTimer.TYPE_RADIAL;a.reverseDir=!0;a.percentage=100;this._setAttrs(a,c.width/2,c.height/2);return a}});cc.TransitionProgressRadialCW.create=function(a,c){var b=new cc.TransitionProgressRadialCW;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionProgressHorizontal=cc.TransitionProgress.extend({_progressTimerNodeWithRenderTexture:function(a){var c=cc.director.getWinSize();a=cc.ProgressTimer.create(a.sprite);cc._renderType===cc._RENDER_TYPE_WEBGL&&(a.sprite.flippedY=!0);a.type=cc.ProgressTimer.TYPE_BAR;a.midPoint=cc.p(1,0);a.barChangeRate=cc.p(1,0);a.percentage=100;this._setAttrs(a,c.width/2,c.height/2);return a}});
cc.TransitionProgressHorizontal.create=function(a,c){var b=new cc.TransitionProgressHorizontal;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionProgressVertical=cc.TransitionProgress.extend({_progressTimerNodeWithRenderTexture:function(a){var c=cc.director.getWinSize();a=cc.ProgressTimer.create(a.sprite);cc._renderType===cc._RENDER_TYPE_WEBGL&&(a.sprite.flippedY=!0);a.type=cc.ProgressTimer.TYPE_BAR;a.midPoint=cc.p(0,0);a.barChangeRate=cc.p(0,1);a.percentage=100;this._setAttrs(a,c.width/2,c.height/2);return a}});
cc.TransitionProgressVertical.create=function(a,c){var b=new cc.TransitionProgressVertical;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionProgressInOut=cc.TransitionProgress.extend({_progressTimerNodeWithRenderTexture:function(a){var c=cc.director.getWinSize();a=cc.ProgressTimer.create(a.sprite);cc._renderType===cc._RENDER_TYPE_WEBGL&&(a.sprite.flippedY=!0);a.type=cc.ProgressTimer.TYPE_BAR;a.midPoint=cc.p(0.5,0.5);a.barChangeRate=cc.p(1,1);a.percentage=0;this._setAttrs(a,c.width/2,c.height/2);return a},_sceneOrder:function(){this._isInSceneOnTop=!1},_setupTransition:function(){this._sceneToBeModified=this._inScene;this._from=
0;this._to=100}});cc.TransitionProgressInOut.create=function(a,c){var b=new cc.TransitionProgressInOut;return null!=b&&b.initWithDuration(a,c)?b:null};
cc.TransitionProgressOutIn=cc.TransitionProgress.extend({_progressTimerNodeWithRenderTexture:function(a){var c=cc.director.getWinSize();a=cc.ProgressTimer.create(a.sprite);cc._renderType===cc._RENDER_TYPE_WEBGL&&(a.sprite.flippedY=!0);a.type=cc.ProgressTimer.TYPE_BAR;a.midPoint=cc.p(0.5,0.5);a.barChangeRate=cc.p(1,1);a.percentage=100;this._setAttrs(a,c.width/2,c.height/2);return a}});
cc.TransitionProgressOutIn.create=function(a,c){var b=new cc.TransitionProgressOutIn;return null!=b&&b.initWithDuration(a,c)?b:null};cc.TransitionPageTurn=cc.TransitionScene.extend({_back:!0,_className:"TransitionPageTurn",initWithDuration:function(a,c,b){this._back=b;cc.TransitionScene.prototype.initWithDuration.call(this,a,c);return!0},actionWithSize:function(a){return this._back?cc.ReverseTime.create(cc.PageTurn3D.create(this._duration,a)):cc.PageTurn3D.create(this._duration,a)},onEnter:function(){cc.TransitionScene.prototype.onEnter.call(this);var a=cc.director.getWinSize(),c;a.width>a.height?(a=16,c=12):(a=12,c=16);a=this.actionWithSize(cc.size(a,
c));this._back?(this._inScene.visible=!1,this._inScene.runAction(cc.Sequence.create(cc.Show.create(),a,cc.CallFunc.create(this.finish,this),cc.StopGrid.create()))):this._outScene.runAction(cc.Sequence.create(a,cc.CallFunc.create(this.finish,this),cc.StopGrid.create()))},_sceneOrder:function(){this._isInSceneOnTop=this._back}});cc.TransitionPageTurn.create=function(a,c,b){var d=new cc.TransitionPageTurn;d.initWithDuration(a,c,b);return d};