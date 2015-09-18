var module = {
    "info": [
        {
        "name": "core-extensions",
        "checked": 0,
        "maxSize": "46.6KB",
        "minSize": "24.6KB",
        "rule": ["core"],
        "info": "Cocos2d Core extensions"
    }, {
        "name": "core",
        "checked": 1,
        "maxSize": "522.4KB",
        "minSize": "295.2KB",
        "rule": [],
        "info": "Engine core modules, includes Director, Node, Scene, Layer, Sprite, LabelTTF, EventManger, Scheduler and Texture2D. The default render is canvas"
    }, {
        "name": "webgl",
        "checked": 0,
        "maxSize": "0KB",
        "minSize": "0KB",
        "rule": [],
        "info": "Cocos2d WebGL support"
    }, {
        "name": "debugger",
        "checked": 1,
        "maxSize": "19.8KB",
        "minSize": "17.2KB",
        "rule": ["core"],
        "info": "Log system and debug informations"
    }, {
        "name": "kazmath",
        "checked": 0,
        "maxSize": "65.7KB",
        "minSize": "31.1KB",
        "rule": ["core", "webgl"],
        "info": "Math lib for webgl"
    }, {
        "name": "shaders",
        "checked": 0,
        "maxSize": "38.4KB",
        "minSize": "25.7KB",
        "rule": ["core", "webgl", "kazmath"],
        "info": "Shaders"
    }, {
        "name": "render-texture",
        "checked": 0,
        "maxSize": "7.6KB",
        "minSize": "4.6KB",
        "rule": ["core"],
        "info": "RenderTexture node for custom rendering"
    }, {
        "name": "labels",
        "checked": 0,
        "maxSize": "35.7KB",
        "minSize": "16.6KB",
        "rule": ["core", "core-extensions", "sprite-batch-node"],
        "info": "Label nodes including LabelBMFont, LabelAtlas"
    }, {
        "name": "motion-streak",
        "checked": 0,
        "maxSize": "12.4KB",
        "minSize": "6.6KB",
        "rule": ["core", "webgl", "shaders", "kazmath", "labels"],
        "info": "MotionStreak which can manage a ribbon based on its motion"
    }, {
        "name": "node-grid",
        "checked": 0,
        "maxSize": "4.0KB",
        "minSize": "2.2KB",
        "rule": ["core", "webgl"],
        "info": "Base node of effects"
    }, {
        "name": "shape-nodes",
        "checked": 0,
        "maxSize": "34.9KB",
        "minSize": "17.4KB",
        "rule": ["core"],
        "info": "DrawNode can be used to render lines, polygons, curves, etc"
    }, {
        "name": "clipping-nodes",
        "checked": 0,
        "maxSize": "9.0KB",
        "minSize": "5.1KB",
        "rule": ["core", "shape-nodes"],
        "info": "ClippingNode can clip hosted nodes with shape or texture as stencil"
    }, {
        "name": "effects",
        "checked": 0,
        "maxSize": "23.9KB",
        "minSize": "13.6KB",
        "rule": ["core", "webgl", "node-grid"],
        "info": "Some effects"
    }, {
        "name": "actions",
        "checked": 1,
        "maxSize": "128.0KB",
        "minSize": "76.7KB",
        "rule": ["core"],
        "info": "Configurable actions for animating nodes with position, scale, etc"
    }, {
        "name": "actions3d",
        "checked": 0,
        "maxSize": "48.2KB",
        "minSize": "24.1KB",
        "rule": ["core", "webgl", "kazmath", "shaders", "actions", "effects", "render-texture"],
        "info": "Effects that can be applied to nodes, like page turn, shake, wave, etc"
    }, {
        "name": "progress-timer",
        "checked": 0,
        "maxSize": "15.6KB",
        "minSize": "8.1KB",
        "rule": ["core", "actions"],
        "info": "ProgressTimer node which can transform a node into a progression bar"
    }, {
        "name": "transitions",
        "checked": 0,
        "maxSize": "39.7KB",
        "minSize": "26.1KB",
        "rule": ["core", "actions", "render-texture", "progress-timer"],
        "info": "Scene transition effects"
    }, {
        "name": "compression",
        "checked": 0,
        "maxSize": "41.5KB",
        "minSize": "31.6KB",
        "rule": ["core"],
        "info": "Compression of tilemap and particle"
    }, {
        "name": "particle",
        "checked": 0,
        "maxSize": "118.4KB",
        "minSize": "63.3KB",
        "rule": ["core", "compression"],
        "info": "ParticleSystem node and built in particle effects"
    }, {
        "name": "text-input",
        "checked": 0,
        "maxSize": "18.0KB",
        "minSize": "10.6KB",
        "rule": ["core"],
        "info": "Nodes for simple text inputing"
    }, {
        "name": "menus",
        "checked": 1,
        "maxSize": "37.7KB",
        "minSize": "19.2KB",
        "rule": ["core", "actions"],
        "info": "Menu and MenuItem nodes for creating game menu"
    }, {
        "name": "tilemap",
        "checked": 0,
        "maxSize": "66.1KB",
        "minSize": "36.1KB",
        "rule": ["core", "compression", "sprite-batch-node"],
        "info": "TMX file parser for creating tile map layers"
    }, {
        "name": "parallax",
        "checked": 0,
        "maxSize": "5.0KB",
        "minSize": "3.2KB",
        "rule": ["core"],
        "info": "Parallax effect which can be applied to layers"
    }, {
        "name": "audio",
        "checked": 1,
        "maxSize": "26.0KB",
        "minSize": "12.5KB",
        "rule": ["core"],
        "info": "Audio system"
    }, {
        "name": "gui",
        "checked": 0,
        "maxSize": "167.4KB",
        "minSize": "96.1KB",
        "rule": ["core", "clipping-nodes", "render-texture", "actions", "progress-timer", "sprite-batch-node"],
        "info": "Another GUI extension with a set of useful widgets"
    }, {
        "name": "ccbreader",
        "checked": 0,
        "maxSize": "136.7KB",
        "minSize": "69.0KB",
        "rule": ["core", "audio", "gui", "menus", "particle", "actions", "labels"],
        "info": "CocosBuilder editor support"
    }, {
        "name": "editbox",
        "checked": 0,
        "maxSize": "28.4KB",
        "minSize": "17.5KB",
        "rule": ["core", "gui"],
        "info": "Edit Box for more complex text inputing"
    }, {
        "name": "ccui",
        "checked": 0,
        "maxSize": "449.8KB",
        "minSize": "256.5KB",
        "rule": ["core", "gui", "actions", "labels", "text-input", "clipping-nodes", "sprite-batch-node"],
        "info": "Cocos UI widgets with layout support"
    }, {
        "name": "cocostudio",
        "checked": 0,
        "maxSize": "420.2KB",
        "minSize": "214.4KB",
        "rule": ["core", "tilemap", "particle", "shape-nodes", "ccui"],
        "info": "CocoStudio editor support"
    }, {
        "name": "pluginx",
        "checked": 0,
        "maxSize": "3.4KB",
        "minSize": "1.9KB",
        "rule": ["core"],
        "info": "Social network API plugins"
    }, {
        "name": "physics",
        "checked": 0,
        "maxSize": "14.0KB",
        "minSize": "6.4KB",
        "rule": ["core", "shape-nodes"],
        "info": "Physics node for Box2d and Chipmunk"
    }, {
        "name": "socketio",
        "checked": 0,
        "maxSize": "91.5KB",
        "minSize": "65.2KB",
        "rule": [],
        "info": "ScoketIO library support"
    }, {
        "name": "gaf",
        "checked": 0,
        "maxSize": "79.5KB",
        "minSize": "47.6KB",
        "rule": ["core"],
        "info": "Gaf library support"
    }, {
        "name": "box2d",
        "checked": 0,
        "maxSize": "454.2KB",
        "minSize": "233.1KB",
        "rule": ["core", "physics"],
        "info": "Built in box2d physics engine support"
    }, {
        "name": "chipmunk",
        "checked": 0,
        "maxSize": "101.1KB",
        "minSize": "59.5KB",
        "rule": ["core", "physics"],
        "info": "Built in Chipmunk physics engine support"
    }, {
        "name": "spine",
        "checked": 0,
        "maxSize": "120.1KB",
        "minSize": "55.7KB",
        "rule": ["core"],
        "info": "The spine support library"
    }, {
        "name": "ccpool",
        "checked": 0,
        "maxSize": "2.2KB",
        "minSize": "1.1KB",
        "rule": ["core"],
        "info": "Sprite recycling pool"
    }, {
        "name": "sprite-batch-node",
        "checked": 0,
        "maxSize": "14.5KB",
        "minSize": "7.7KB",
        "rule": ["core"],
        "info": "A type of sprite that can host sprites using the same texture and enable texture batching to improve performance"
    }, {
        "name": "core-webgl",
        "checked": 0,
        "maxSize": "68.0KB",
        "minSize": "36.5KB",
        "rule": ["core", "shaders", "core-extensions"],
        "info": "Unknown"
    }, {
        "name": "clipping-nodes-webgl",
        "checked": 0,
        "maxSize": "7.3KB",
        "minSize": "4.8KB",
        "rule": [],
        "info": "Unknown"
    }, {
        "name": "core-extensions-webgl",
        "checked": 0,
        "maxSize": "4.3KB",
        "minSize": "2.7KB",
        "rule": [],
        "info": "Unknown"
    }, {
        "name": "sprite-batch-node-webgl",
        "checked": 0,
        "maxSize": "6.7KB",
        "minSize": "3.4KB",
        "rule": [],
        "info": "Unknown"
    }, {
        "name": "labels-webgl",
        "checked": 0,
        "maxSize": "7.1KB",
        "minSize": "3.5KB",
        "rule": [],
        "info": "Unknown"
    }, {
        "name": "particle-webgl",
        "checked": 0,
        "maxSize": "13.3KB",
        "minSize": "6.9KB",
        "rule": [],
        "info": "Unknown"
    }, {
        "name": "physics-webgl",
        "checked": 0,
        "maxSize": "2.7KB",
        "minSize": "1.7KB",
        "rule": [],
        "info": "Unknown"
    }, {
        "name": "progress-timer-webgl",
        "checked": 0,
        "maxSize": "15.3KB",
        "minSize": "7.9KB",
        "rule": [],
        "info": "Unknown"
    }, {
        "name": "render-texture-webgl",
        "checked": 0,
        "maxSize": "11.0KB",
        "minSize": "6.0KB",
        "rule": [],
        "info": "Unknown"
    }, {
        "name": "shape-nodes-webgl",
        "checked": 0,
        "maxSize": "0.7KB",
        "minSize": "0.5KB",
        "rule": [],
        "info": "Unknown"
    }, {
        "name": "tilemap-webgl",
        "checked": 0,
        "maxSize": "1.1KB",
        "minSize": "0.7KB",
        "rule": [],
        "info": "Unknown"
    }, {
        "name": "cocostudio-webgl",
        "checked": 0,
        "maxSize": "10.1KB",
        "minSize": "4.9KB",
        "rule": [],
        "info": "Unknown"
    }, {
        "name": "spine-webgl",
        "checked": 0,
        "maxSize": "9.7KB",
        "minSize": "4.6KB",
        "rule": [],
        "info": "Unknown"
    }, {
        "name": "gui-webgl",
        "checked": 0,
        "maxSize": "6.8KB",
        "minSize": "3.8KB",
        "rule": [],
        "info": "Unknown"
    }, {"name": "gaf-webgl", "checked": 0, "maxSize": "3.8KB", "minSize": "2.0KB", "rule": [], "info": "Unknown"}]
};
var hiddenList = {
    "core-extensions": 1,
    "kazmath": 1,
    "shaders": 1,
    "node-grid": 1,
    "compression": 1,
    "effects": 1,
    "physics": 1,
    "core-webgl": 1,
    "clipping-node-webgl": 1,
    "core-extensions-webgl": 1,
    "sprite-batch-node-webgl": 1,
    "labels-webgl": 1,
    "particle-webgl": 1,
    "physics-webgl": 1,
    "progress-timer-webgl": 1,
    "render-texture-webgl": 1,
    "shape-nodes-webgl": 1,
    "tilemap-webgl": 1,
    "cocostudio-webgl": 1,
    "spine-webgl": 1,
    "clipping-nodes-webgl": 1,
    "gui-webgl": 1,
    "gaf-webgl": 1
};
var _sort = ["core", "core-webgl", "webgl", "core-extensions", "core-extensions-webgl", "debugger", "actions", "audio", "menus", "kazmath", "shaders", "render-texture", "render-texture-webgl", "sprite-batch-node", "sprite-batch-node-webgl", "labels", "labels-webgl", "motion-streak", "node-grid", "shape-nodes", "shape-nodes-webgl", "clipping-nodes", "clipping-nodes-webgl", "effects", "actions3d", "progress-timer", "progress-timer-webgl", "transitions", "compression", "particle", "particle-webgl", "text-input", "tilemap", "tilemap-webgl", "parallax", "gui", "gui-webgl", "ccbreader", "editbox", "ccui", "cocostudio", "cocostudio-webgl", "ccpool", "pluginx", "physics", "physics-webgl", "socketio", "gaf", "box2d", "chipmunk", "spine", "spine-webgl", "gaf-webgl"];