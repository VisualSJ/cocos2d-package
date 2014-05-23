// globals
var director = null;
var winSize = null;

var PLATFORM_JSB = 1 << 0;
var PLATFORM_HTML5 = 1 << 1;
var PLATFORM_HTML5_WEBGL = 1 << 2;
var PLATFORM_JSB_AND_WEBGL =  PLATFORM_JSB | PLATFORM_HTML5_WEBGL;
var PLATFORM_ALL = PLATFORM_JSB | PLATFORM_HTML5 | PLATFORM_HTML5_WEBGL;

// automation vars
var autoTestEnabled = autoTestEnabled || false;
var autoTestCurrentTestName = autoTestCurrentTestName || "N/A";

var TestScene = cc.Scene.extend({
    ctor:function (bPortrait) {
        this._super();
        this.init();

        var label = cc.LabelTTF.create("Main Menu", "Arial", 20);
        var menuItem = cc.MenuItemLabel.create(label, this.onMainMenuCallback, this);

        var menu = cc.Menu.create(menuItem);
        menu.x = 0;
        menu.y = 0;
        menuItem.x = winSize.width - 70;
        menuItem.y = 25;

        if(!window.sidebar){
            this.addChild(menu, 1);
        }
    },
    onMainMenuCallback:function () {
        var scene = cc.Scene.create();
        var layer = new TestScene();
        scene.addChild(layer);
        var transition = cc.TransitionProgressRadialCCW.create(0.5,scene);
        cc.director.runScene(transition);
    }

});

var testNames = [
    {
        title:"ActionManager Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new ActionManagerTestScene();
        }
    },
    {
        title:"Actions Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new ActionsTestScene();
        }
    },
    {
        title:"Box2D Test",
        resource:g_box2d,
        platforms: PLATFORM_HTML5,
        testScene:function () {
            return new Box2DTestScene();
        }
    },
    {
        title:"Chipmunk Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new ChipmunkTestScene();
        }
    },
    //"BugsTest",
    {
        title:"Click and Move Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new ClickAndMoveTestScene();
        }
    },
    {
        title:"ClippingNode Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new ClippingNodeTestScene();
        }
    },
    {
        title:"CocosDenshion Test",
        resource:g_cocosdeshion,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new CocosDenshionTestScene();
        }
    },
    {
        title:"CocoStudio Test",
        resource:g_cocoStudio,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new CocoStudioTestScene();
        }
    },
    {
        title:"CurrentLanguage Test",
        platforms: PLATFORM_HTML5,
        testScene:function () {
            return new CurrentLanguageTestScene();
        }
    },
    //"CurlTest",
    {
        title:"DrawPrimitives Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new DrawPrimitivesTestScene();
        }
    },
    {
        title:"EaseActions Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new EaseActionsTestScene();
        }
    },
    {
        title:"Event Manager Test",
        resource:g_eventDispatcher,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new EventDispatcherTestScene();
        }
    },
    {
        title:"Event Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new EventTestScene();
        }
    },
    {
        title:"Extensions Test",
        resource:g_extensions,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new ExtensionsTestScene();
        }
    },
    {
        title:"Effects Test",
        platforms: PLATFORM_JSB_AND_WEBGL,
        testScene:function () {
            return new EffectsTestScene();
        }
    },
    {
        title:"Effects Advanced Test",
        platforms: PLATFORM_JSB_AND_WEBGL,
        testScene:function () {
            return new EffectAdvanceScene();
        }
    },
    {
        title:"Font Test",
        resource:g_fonts,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new FontTestScene();
        }
    },
    {
        title:"UI Test",
        resource:g_ui,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new GUITestScene();
        }
    },
    //"HiResTest",
    {
        title:"Interval Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new IntervalTestScene();
        }
    },
    {
        title:"Label Test",
        resource:g_label,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new LabelTestScene();
        }
    },
    {
        title:"Layer Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new LayerTestScene();
        }
    },
    {
        title:"Loader Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new LoaderTestScene();
        }
    },
    {
        title:"Menu Test",
        resource:g_menu,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new MenuTestScene();
        }
    },
    {
        title:"MotionStreak Test",
        platforms: PLATFORM_JSB_AND_WEBGL,
        testScene:function () {
            return new MotionStreakTestScene();
        }
    },
    {
        title:"Node Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new NodeTestScene();
        }
    },
    {
        title:"OpenGL Test",
        resource:g_opengl_resources,
        platforms: PLATFORM_HTML5_WEBGL,
        testScene:function () {
            return new OpenGLTestScene();
        }
    },
    {
        title:"Parallax Test",
        resource:g_parallax,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new ParallaxTestScene();
        }
    },
    {
        title:"Particle Test",
        platforms: PLATFORM_ALL,
        resource:g_particle,
        testScene:function () {
            return new ParticleTestScene();
        }
    },
    {
        title:"Path Tests",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new PathTestScene();
        }
    },
    {
        title:"Performance Test",
        platforms: PLATFORM_ALL,
        resource:g_performace,
        testScene:function () {
            return new PerformanceTestScene();
        }
    },
    {
        title:"ProgressActions Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new ProgressActionsTestScene();
        }
    },
    {
        title:"RenderTexture Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new RenderTextureTestScene();
        }
    },
    {
        title:"RotateWorld Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new RotateWorldTestScene();
        }
    },
    {
        title:"Scene Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new SceneTestScene();
        }
    },
    {
        title:"Scheduler Test",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new SchedulerTestScene();
        }
    },
    {
        title:"Spine Test",
        resource: g_spine,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new SpineTestScene();
        }
    },
    {
        title:"Sprite Test",
        resource:g_sprites,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new SpriteTestScene();
        }
    },
    {
        title:"Scale9Sprite Test",
        resource:g_s9s_blocks,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new S9SpriteTestScene();
        }
    },
    {
        title:"TextInput Test",
        platforms: PLATFORM_HTML5,
        testScene:function () {
            return new TextInputTestScene();
        }
    },
    //"Texture2DTest",
    {
        title:"TextureCache Test",
        platforms: PLATFORM_HTML5,
        testScene:function () {
            return new TextureCacheTestScene();
        }
    },
    {
        title:"TileMap Test",
        resource:g_tilemaps,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new TileMapTestScene();
        }
    },
    {
        title:"Touches Test",
        resource:g_touches,
        platforms: PLATFORM_HTML5,
        testScene:function () {
            return new TouchesTestScene();
        }
    },
    {
        title:"Transitions Test",
        resource:g_transitions,
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new TransitionsTestScene();
        }
    },
    {
        title:"Unit Tests",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new UnitTestScene();
        }
    },
    {
        title:"Sys Tests",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new SysTestScene();
        }
    },
    {
        title:"cocos2d JS Presentation",
        platforms: PLATFORM_JSB,
        testScene:function () {
            return new PresentationScene();
        }
    },
    {
        title:"XMLHttpRequest",
        platforms: PLATFORM_ALL,
        testScene:function () {
            return new XHRTestScene();
        }
    }

    //"UserDefaultTest",
    //"ZwoptexTest",
];