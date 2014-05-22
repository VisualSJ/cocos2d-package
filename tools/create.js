var path = require("path");
var fs = require("fs");
var cp = require("child_process");

var name = process.argv[2] || 'modules';

var app = {
    _num: 0,
    _dir: __dirname,
    _list: {},
    _xml: '',
    _readJson: function (file) {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    },
    init: function () {
        var _moduleFile = path.join(app._dir, './moduleConfig.json');
        app._list = app._readJson(_moduleFile);
        app.sorting();
        app.createXml();
        app.merge();
    },
    sorting: function () {
        //合并CCBoot到core
        app._list.module.core = [app._list.bootFile].concat(app._list.module.core);
        app._list = app._list.module;

        //分离CCDebugger
//        app._list['debugger'] = ['CCDebugger.js'];
//        app._list['core'] = app._list['core'].filter(function (_file) {
//            return _file != 'CCDebugger.js';
//        });

        //去除依赖关系
        for (var p in app._list) {
            if (Array.isArray(app._list[p])) {
                app._list[p] = app._list[p].filter(function (_file) {
                    return /\.js$/.test(_file);
                });

                if (app._list[p].length == 0) {
                    delete app._list[p];
                    continue;
                }

                app._num++;
            } else {
                delete app._list[p];
            }
        }
    },
    createXml: function () {
        app._xml += '<?xml version="1.0"?>\n';
        app._xml += '<project name="Javascript compress project" basedir="." default="module">\n';
        app._xml += '  <taskdef name="jscomp" classname="com.google.javascript.jscomp.ant.CompileTask" classpath="./compiler/compiler.jar"/>\n';
        app._xml += '  <target name="module">\n';
        var _t = app._list;
        for (var p in _t) {
            //压缩版本
            app._xml += '    <jscomp compilationLevel="simple" warning="quiet" debug="false" output="./' + name + '/dist/' + p + '.js">\n';
            app._xml += '      <sources dir="/">\n';
            _t[p].forEach(function (_file) {
                app._xml += '        <file name="' + path.join(app._dir, '../../cocos2d-js/frameworks/cocos2d-html5', _file) + '" />\n';
            });
            app._xml += '      </sources>\n';
            app._xml += '    </jscomp>\n';
            //非压缩版本
            app._xml += '    <jscomp compilationLevel="whitespace" warning="quiet" debug="true" output="./' + name + '/src/' + p + '.js">\n';
            app._xml += '      <sources dir="/">\n';
            _t[p].forEach(function (_file) {
                app._xml += '        <file name="' + path.join(app._dir, '../../cocos2d-js/frameworks/cocos2d-html5', _file) + '" />\n';
            });
            app._xml += '      </sources>\n';
            app._xml += '    </jscomp>\n';

        }
        app._xml += '  </target>\n';
        app._xml += '</project>';


        fs.writeFileSync('./build.xml', app._xml);

    },
    merge: function () {

        cp.exec('ant', function () {

            console.log('Success ant. The total number of files : %d', app._num);

            app.createJSON();

        });
    },
    createJSON: function () {

        var _module = {
            info: []
        };

        //获取文件大小
        app._sort.forEach(function (_file) {
            if(fs.existsSync('./' + name + '/dist/' + _file + '.js')){
                var _stat = fs.statSync('./' + name + '/dist/' + _file + '.js');
                _module.info.push({
                    name: _file,
                    size: ((_stat.size / 1000) | 0 ).toString() + 'KB',
                    checked: 0
                });
            }
        });

        //提取依赖关系
        var _moduleConfig = app._readJson(path.join(app._dir, './moduleConfig.json')).module;

        _module.info.forEach(function (_info, i) {
            console.log(_info)
            var _a = _moduleConfig[_info.name]
            if (_a) {
                _a = _a.filter(function (_t) {
                    return !/\.js$/.test(_t);
                });
                _module.info[i].rule = _a;
            } else {
                _module.info[i].rule = [];
            }
            _module.info[i].info = app._info[_info.name] || 'Unknow';
//            if(_info.name=='debugger') _module.info[i].rule.push('core')
        });


        fs.writeFileSync('./' + name + '/module.js', "var module=" + JSON.stringify(_module));

    },
    _sort: [
        "core-webgl",
        "core",
        "core-extensions",
        "webgl",
        "debugger",
        "actions",
        "labels",
        "audio",
        "menus",
        "transitions",
        "ccui",
        "shape-nodes",
        "clipping-nodes",
        "particle",
        "progress-timer",
        "actions3d",
        "tilemap",
        "parallax",
        "render-texture",
        "text-input",
        "gui",
        "editbox",
        "cocostudio",
        "ccbreader",
        "box2d",
        "chipmunk",
        "socketio",
        "pluginx",
        "motion-streak",

        "kazmath",
        "shaders",
        "node-grid",
        "effects",
        "compression",
        "physics"
    ],
    _info: {
        "core-extensions": "Cocos2d Core extensions",
        "core-webgl": "Cocos2d WebGL support",
        "webgl": "Cocos2d WebGL renderer",
        "core": 'Engine core modules, includes Director, Node, Scene, Layer, Sprite, LabelTTF, EventManger, Scheduler and Texture2D. The default render is canvas.',
        "debugger": 'Log system and debug informations',
        "kazmath": 'Math lib for webgl',
        "shaders": 'Shaders',
        "render-texture": 'RenderTexture node for custom rendering',
        "labels": 'Label nodes including LabelBMFont, LabelAtlas',
        "motion-streak": 'MotionStreak which can manage a ribbon based on its motion',
        "node-grid": 'Base node of effects',
        "shape-nodes": 'DrawNode can be used to render lines, polygons, curves, etc',
        "clipping-nodes": 'ClippingNode can clip hosted nodes with shape or texture as stencil',
        "effects": 'Some effects',
        "actions": 'Configurable actions for animating nodes with position, scale, etc',
        "actions3d": 'Effects that can be applied to nodes, like page turn, shake, wave, etc',
        "progress-timer": 'ProgressTimer node which can transform a node into a progression bar',
        "transitions": 'Scene transition effects',
        "compression": 'Compression of tilemap and particle',
        "particle": 'ParticleSystem node and built in particle effects',
        "text-input": 'Nodes for simple text inputing',
        "menus": 'Menu and MenuItem nodes for creating game menu',
        "tilemap": 'TMX file parser for creating tile map layers',
        "parallax": 'Parallax effect which can be applied to layers',
        "audio": 'Audio system',
        "gui": 'Another GUI extension with a set of useful widgets',
        "ccbreader": 'CocosBuilder editor support',
        "editbox": 'Edit Box for more complex text inputing',
        "ccui": 'Cocos UI widgets with layout support',
        "cocostudio": 'CocoStudio editor support',
        "pluginx": 'Social network API plugins',
        "physics": 'Physics node for Box2d and Chipmunk',
        "socketio": 'ScoketIO library support',
        "box2d": 'Built in box2d physics engine support',
        "chipmunk": 'Built in Chipmunk physics engine support'
    }
};

app.init();