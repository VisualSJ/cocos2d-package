(function(){
    var DEBUG = false;
    var sys = cc.sys;
    var version = sys.browserVersion;
    var supportWebAudio = !!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
    var support = {ONLY_ONE: false, WEB_AUDIO: supportWebAudio, DELAY_CREATE_CTX: false, ONE_SOURCE: false };
    if (sys.browserType === sys.BROWSER_TYPE_FIREFOX) {
        support.DELAY_CREATE_CTX = true;
        support.USE_LOADER_EVENT = 'canplay';
    }
    if (sys.os === sys.OS_ANDROID) {
        if (sys.browserType === sys.BROWSER_TYPE_UC) {
            support.ONE_SOURCE = true;
        }
    }
    window.__audioSupport = support;
    if(DEBUG){
        setTimeout(function(){
            cc.log("browse type: " + sys.browserType);
            cc.log("browse version: " + version);
            cc.log("MULTI_CHANNEL: " + window.__audioSupport.MULTI_CHANNEL);
            cc.log("WEB_AUDIO: " + window.__audioSupport.WEB_AUDIO);
            cc.log("AUTOPLAY: " + window.__audioSupport.AUTOPLAY);
        }, 0);
    }
})();
cc.Audio = cc.Class.extend({
    src: null,
    _element: null,
    _AUDIO_TYPE: "AUDIO",
    ctor: function(url){
        this.src = url;
    },
    setBuffer: function (buffer) {
        this._AUDIO_TYPE = "WEBAUDIO";
        this._element = new cc.Audio.WebAudio(buffer);
    },
    setElement: function (element) {
        this._AUDIO_TYPE = "AUDIO";
        this._element = element;
        element.addEventListener('ended', function () {
            if (!element.loop) {
                element.paused = true;
            }
        });
    },
    play: function (offset, loop) {
        if (!this._element) return;
        this._element.loop = loop;
        this._element.play();
        if (this._AUDIO_TYPE === 'AUDIO' && this._element.paused) {
            this.stop();
            cc.Audio.touchPlayList.push({ loop: loop, offset: offset, audio: this._element });
        }
        if (cc.Audio.bindTouch === false) {
            cc.Audio.bindTouch = true;
            cc.game.canvas.addEventListener('touchstart', cc.Audio.touchStart);
        }
    },
    getPlaying: function () {
        if (!this._element) return true;
        return !this._element.paused;
    },
    stop: function () {
        if (!this._element) return;
        this._element.pause();
        try{
            this._element.currentTime = 0;
        } catch (err) {}
    },
    pause: function () {
        if (!this._element) return;
        this._element.pause();
    },
    resume: function () {
        if (!this._element) return;
        this._element.play();
    },
    setVolume: function (volume) {
        if (!this._element) return;
        this._element.volume = volume;
    },
    getVolume: function () {
        if (!this._element) return;
        return this._element.volume;
    },
    cloneNode: function () {
        var audio = new cc.Audio(this.src);
        if (this._AUDIO_TYPE === "AUDIO") {
            var elem = document.createElement("audio");
            var sources = elem.getElementsByTagName('source');
            for (var i=0; i<sources.length; i++) {
                elem.appendChild(sources[i]);
            }
            elem.src = this.src;
            audio.setElement(elem);
        } else {
            audio.setBuffer(this._element.buffer);
        }
        return audio;
    }
});
cc.Audio.touchPlayList = [
];
cc.Audio.bindTouch = false;
cc.Audio.touchStart = function () {
    var list = cc.Audio.touchPlayList;
    var item = null;
    while (item = list.pop()) {
        item.audio.loop = !!item.loop;
        item.audio.play(item.offset);
    }
};
cc.Audio.WebAudio = function (buffer) {
    this.buffer = buffer;
    this.context = cc.Audio._context;
    var volume = this.context['createGain']();
    volume['gain'].value = 1;
    volume['connect'](this.context['destination']);
    this._volume = volume;
    this._loop = false;
    this._startTime = -1;
    this._currentSource = null;
    this.playedLength = 0;
    this._currextTimer = null;
};
cc.Audio.WebAudio.prototype = {
    constructor: cc.Audio.WebAudio,
    get paused () {
        if (this._currentSource && this._currentSource.loop)
            return false;
        if (this._startTime === -1)
            return true;
        return this.context.currentTime - this._startTime > this.buffer.duration;
    },
    set paused (bool) {},
    get loop () { return this._loop; },
    set loop (bool) { return this._loop = bool; },
    get volume () { return this._volume['gain'].value; },
    set volume (num) { return this._volume['gain'].value = num; },
    get currentTime () { return this.playedLength; },
    set currentTime (num) { return this.playedLength = num; },
    play: function (offset) {
        if (this._currentSource && !this.paused) {
            this._currentSource.stop(0);
            this.playedLength = 0;
        }
        var audio = this.context["createBufferSource"]();
        audio.buffer = this.buffer;
        audio["connect"](this._volume);
        audio.loop = this._loop;
        this._startTime = this.context.currentTime;
        offset = offset || this.playedLength;
        var duration = this.buffer.duration;
        if (!this._loop) {
            if (audio.start)
                audio.start(0, offset, duration - offset);
            else if (audio["notoGrainOn"])
                audio["noteGrainOn"](0, offset, duration - offset);
            else
                audio["noteOn"](0, offset, duration - offset);
        } else {
            if (audio.start)
                audio.start(0);
            else if (audio["notoGrainOn"])
                audio["noteGrainOn"](0);
            else
                audio["noteOn"](0);
        }
        this._currentSource = audio;
        if (this.context.currentTime === 0) {
            var self = this;
            clearTimeout(this._currextTimer);
            this._currextTimer = setTimeout(function () {
                if (self.context.currentTime === 0) {
                    cc.Audio.touchPlayList.push({
                        offset: offset,
                        audio: self
                    });
                }
            }, 10);
        }
    },
    pause: function () {
        this.playedLength = this.context.currentTime - this._startTime;
        this.playedLength %= this.buffer.duration;
        var audio = this._currentSource;
        this._currentSource = null;
        this._startTime = -1;
        if (audio)
            audio.stop(0);
    }
};
(function(polyfill){
    var SWA = polyfill.WEB_AUDIO, SWB = polyfill.ONLY_ONE;
    var support = [];
    (function(){
        var audio = document.createElement("audio");
        if(audio.canPlayType) {
            var ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
            if (ogg && ogg !== "") support.push(".ogg");
            var mp3 = audio.canPlayType("audio/mpeg");
            if (mp3 && mp3 !== "") support.push(".mp3");
            var wav = audio.canPlayType('audio/wav; codecs="1"');
            if (wav && wav !== "") support.push(".wav");
            var mp4 = audio.canPlayType("audio/mp4");
            if (mp4 && mp4 !== "") support.push(".mp4");
            var m4a = audio.canPlayType("audio/x-m4a");
            if (m4a && m4a !== "") support.push(".m4a");
        }
    })();
    try{
        if(SWA){
            var context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
            cc.Audio._context = context;
            if(polyfill.DELAY_CREATE_CTX)
                setTimeout(function(){
                    context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
                    cc.Audio._context = context;
                }, 0);
        }
    }catch(error){
        SWA = false;
        cc.log("browser don't support web audio");
    }
    var loader = {
        cache: {},
        useWebAudio: false,
        loadBuffer: function (url, cb) {
            if (!SWA) return;
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            request.onload = function () {
                context["decodeAudioData"](request.response, function(buffer){
                    cb(null, buffer);
                }, function(){
                    cb('decode error - ' + url);
                });
            };
            request.onerror = function(){
                cb('request error - ' + url);
            };
            request.send();
        },
        load: function(realUrl, url, res, cb){
            if(support.length === 0)
                return cb("can not support audio!");
            var audio = cc.loader.getRes(url);
            if (audio)
                return cb(null, audio);
            var i;
            if(cc.loader.audioPath)
                realUrl = cc.path.join(cc.loader.audioPath, realUrl);
            var extname = cc.path.extname(realUrl);
            var typeList = [extname];
            for(i=0; i<support.length; i++){
                if(extname !== support[i]){
                    typeList.push(support[i]);
                }
            }
            audio = new cc.Audio(realUrl);
            cc.loader.cache[url] = audio;
            this.loadAudioFromExtList(realUrl, typeList, audio, cb);
            return audio;
        },
        loadAudioFromExtList: function(realUrl, typeList, audio, cb){
            if(typeList.length === 0){
                var ERRSTR = "can not found the resource of audio! Last match url is : ";
                ERRSTR += realUrl.replace(/\.(.*)?$/, "(");
                support.forEach(function(ext){
                    ERRSTR += ext + "|";
                });
                ERRSTR = ERRSTR.replace(/\|$/, ")");
                return cb({status:520, errorMessage:ERRSTR}, null);
            }
            if (SWA && this.useWebAudio) {
                this.loadBuffer(realUrl, function (error, buffer) {
                    if (error)
                        cc.log(error);
                    if (buffer)
                        audio.setBuffer(buffer);
                    cb(null, audio);
                });
                return;
            }
            var num = polyfill.ONE_SOURCE ? 1 : typeList.length;
            var dom = document.createElement('audio');
            for (var i=0; i<num; i++) {
                var source = document.createElement('source');
                source.src = cc.path.changeExtname(realUrl, typeList[i]);
                dom.appendChild(source);
            }
            audio.setElement(dom);
            var timer = setTimeout(function(){
                if (dom.readyState === 0) {
                    failure();
                } else {
                    success();
                }
            }, 8000);
            var success = function () {
                dom.removeEventListener("canplaythrough", success, false);
                dom.removeEventListener("error", failure, false);
                dom.removeEventListener("emptied", success, false);
                if (polyfill.USE_LOADER_EVENT)
                    dom.removeEventListener(polyfill.USE_LOADER_EVENT, success, false);
                clearTimeout(timer);
                cb(null, audio);
            };
            var failure = function () {
                cc.log('load audio failure - ' + realUrl);
                success();
            };
            dom.addEventListener("canplaythrough", success, false);
            dom.addEventListener("error", failure, false);
            if(polyfill.USE_LOADER_EVENT)
                dom.addEventListener(polyfill.USE_LOADER_EVENT, success, false);
        }
    };
    cc.loader.register(["mp3", "ogg", "wav", "mp4", "m4a"], loader);
    cc.audioEngine = {
        _currMusic: null,
        _musicVolume: 1,
        features: polyfill,
        willPlayMusic: function(){return false;},
        playMusic: function(url, loop){
            var bgMusic = this._currMusic;
            if (bgMusic && bgMusic.getPlaying()) {
                bgMusic.stop();
            }
            var audio = cc.loader.getRes(url);
            if (!audio) {
                cc.loader.load(url);
                audio = cc.loader.getRes(url);
            }
            audio.setVolume(this._musicVolume);
            audio.play(0, loop || false);
            this._currMusic = audio;
        },
        stopMusic: function(releaseData){
            var audio = this._currMusic;
            if (audio) {
                audio.stop();
                this._currMusic = null;
                if (releaseData)
                    cc.loader.release(audio.src);
            }
        },
        pauseMusic: function(){
            var audio = this._currMusic;
            if (audio)
                audio.pause();
        },
        resumeMusic: function(){
            var audio = this._currMusic;
            if (audio)
                audio.resume();
        },
        rewindMusic: function(){
            var audio = this._currMusic;
            if (audio){
                audio.stop();
                audio.play();
            }
        },
        getMusicVolume: function(){
            return this._musicVolume;
        },
        setMusicVolume: function(volume){
            volume = volume - 0;
            if (isNaN(volume)) volume = 1;
            if (volume > 1) volume = 1;
            if (volume < 0) volume = 0;
            this._musicVolume = volume;
            var audio = this._currMusic;
            if (audio) {
                audio.setVolume(volume);
            }
        },
        isMusicPlaying: function(){
            var audio = this._currMusic;
            if (audio) {
                return audio.getPlaying();
            } else {
                return false;
            }
        },
        _audioPool: {},
        _maxAudioInstance: 10,
        _effectVolume: 1,
        playEffect: function(url, loop){
            if (SWB && this._currMusic && this._currMusic.getPlaying()) {
                cc.log('Browser is only allowed to play one audio');
                return null;
            }
            var effectList = this._audioPool[url];
            if (!effectList) {
                effectList = this._audioPool[url] = [];
            }
            var i;
            for (i = 0; i < effectList.length; i++) {
                if (!effectList[i].getPlaying()) {
                    break;
                }
            }
            if (!SWA && i > this._maxAudioInstance) {
                var first = effectList.shift();
                first.stop();
                effectList.push(first);
                i = effectList.length - 1;
            }
            var audio;
            if (effectList[i]) {
                audio = effectList[i];
                audio.setVolume(this._effectVolume);
                audio.play(0, loop || false);
                return audio;
            }
            audio = cc.loader.getRes(url);
            if (audio && SWA && audio._AUDIO_TYPE === 'AUDIO') {
                cc.loader.release(url);
                audio = null;
            }
            if (audio) {
                if (SWA && audio._AUDIO_TYPE === 'AUDIO') {
                    loader.loadBuffer(url, function (error, buffer) {
                        audio.setBuffer(buffer);
                        audio.setVolume(cc.audioEngine._effectVolume);
                        if (!audio.getPlaying())
                            audio.play(0, loop || false);
                    });
                } else {
                    audio = audio.cloneNode();
                    audio.setVolume(this._effectVolume);
                    audio.play(0, loop || false);
                    effectList.push(audio);
                    return audio;
                }
            }
            loader.useWebAudio = true;
            cc.loader.load(url, function (audio) {
                audio = cc.loader.getRes(url);
                audio = audio.cloneNode();
                audio.setVolume(cc.audioEngine._effectVolume);
                audio.play(0, loop || false);
                effectList.push(audio);
            });
            loader.useWebAudio = false;
            return audio;
        },
        setEffectsVolume: function(volume){
            volume = volume - 0;
            if(isNaN(volume)) volume = 1;
            if(volume > 1) volume = 1;
            if(volume < 0) volume = 0;
            this._effectVolume = volume;
            var audioPool = this._audioPool;
            for(var p in audioPool){
                var audioList = audioPool[p];
                if(Array.isArray(audioList))
                    for(var i=0; i<audioList.length; i++){
                        audioList[i].setVolume(volume);
                    }
            }
        },
        getEffectsVolume: function(){
            return this._effectVolume;
        },
        pauseEffect: function(audio){
            if(audio){
                audio.pause();
            }
        },
        pauseAllEffects: function(){
            var ap = this._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<ap[p].length; i++){
                    if(list[i].getPlaying()){
                        list[i].pause();
                    }
                }
            }
        },
        resumeEffect: function(audio){
            if(audio)
                audio.resume();
        },
        resumeAllEffects: function(){
            var ap = this._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<ap[p].length; i++){
                    list[i].resume();
                }
            }
        },
        stopEffect: function(audio){
            if(audio) {
                audio.stop();
            }
        },
        stopAllEffects: function(){
            var ap = this._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<list.length; i++){
                    list[i].stop();
                }
                list.length = 0;
            }
        },
        unloadEffect: function(url){
            if(!url){
                return;
            }
            cc.loader.release(url);
            var pool = this._audioPool[url];
            if(pool) pool.length = 0;
            delete this._audioPool[url];
        },
        end: function(){
            this.stopMusic();
            this.stopAllEffects();
        },
        _pauseCache: [],
        _pausePlaying: function(){
            var bgMusic = this._currMusic;
            if(bgMusic && bgMusic.getPlaying()){
                bgMusic.pause();
                this._pauseCache.push(bgMusic);
            }
            var ap = this._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<ap[p].length; i++){
                    if(list[i].getPlaying()){
                        list[i].pause();
                        this._pauseCache.push(list[i]);
                    }
                }
            }
        },
        _resumePlaying: function(){
            var list = this._pauseCache;
            for(var i=0; i<list.length; i++){
                list[i].resume();
            }
            list.length = 0;
        }
    };
})(window.__audioSupport);
