!function(){var a=!1,b=cc.sys,c={common:{multichannel:!0,webAudio:cc.sys._supportWebAudio,auto:!0}};c[b.BROWSER_TYPE_IE]={multichannel:!0,webAudio:cc.sys._supportWebAudio,auto:!0,emptied:!0},c[b.BROWSER_TYPE_ANDROID]={multichannel:!1,webAudio:!1,auto:!1},c[b.BROWSER_TYPE_CHROME]={multichannel:!0,webAudio:!0,auto:!1},c[b.BROWSER_TYPE_FIREFOX]={multichannel:!0,webAudio:!0,auto:!0},c[b.BROWSER_TYPE_UC]={multichannel:!0,webAudio:!1,auto:!1},c[b.BROWSER_TYPE_QQ]={multichannel:!1,webAudio:!1,auto:!0},c[b.BROWSER_TYPE_OUPENG]={multichannel:!1,webAudio:!1,auto:!1,replay:!0,emptied:!0},c[b.BROWSER_TYPE_WECHAT]={multichannel:!1,webAudio:!1,auto:!1,replay:!0,emptied:!0},c[b.BROWSER_TYPE_360]={multichannel:!1,webAudio:!1,auto:!0},c[b.BROWSER_TYPE_MIUI]={multichannel:!1,webAudio:!1,auto:!0},c[b.BROWSER_TYPE_LIEBAO]={multichannel:!1,webAudio:!1,auto:!1,replay:!0,emptied:!0},c[b.BROWSER_TYPE_SOUGOU]={multichannel:!1,webAudio:!1,auto:!1,replay:!0,emptied:!0},c[b.BROWSER_TYPE_BAIDU]={multichannel:!1,webAudio:!1,auto:!1,replay:!0,emptied:!0},c[b.BROWSER_TYPE_BAIDU_APP]={multichannel:!1,webAudio:!1,auto:!1,replay:!0,emptied:!0},c[b.BROWSER_TYPE_SAFARI]={multichannel:!0,webAudio:!0,auto:!1,webAudioCallback:function(a){document.createElement("audio").src=a}};var d,e;try{var f=navigator.userAgent.toLowerCase();switch(b.browserType){case b.BROWSER_TYPE_IE:e=f.match(/(msie |rv:)([\d.]+)/);break;case b.BROWSER_TYPE_FIREFOX:e=f.match(/(firefox\/|rv:)([\d.]+)/);break;case b.BROWSER_TYPE_CHROME:e=f.match(/chrome\/([\d.]+)/);break;case b.BROWSER_TYPE_BAIDU:e=f.match(/baidubrowser\/([\d.]+)/);break;case b.BROWSER_TYPE_UC:e=f.match(/ucbrowser\/([\d.]+)/);break;case b.BROWSER_TYPE_QQ:e=f.match(/qqbrowser\/([\d.]+)/);break;case b.BROWSER_TYPE_OUPENG:e=f.match(/oupeng\/([\d.]+)/);break;case b.BROWSER_TYPE_WECHAT:e=f.match(/micromessenger\/([\d.]+)/);break;case b.BROWSER_TYPE_SAFARI:e=f.match(/safari\/([\d.]+)/);break;case b.BROWSER_TYPE_MIUI:e=f.match(/miuibrowser\/([\d.]+)/)}d=e?e[1]:""}catch(g){console.log(g)}if(d)switch(b.browserType){case b.BROWSER_TYPE_CHROME:parseInt(d)<30&&(c[b.BROWSER_TYPE_CHROME]={multichannel:!1,webAudio:!0,auto:!1});break;case b.BROWSER_TYPE_MIUI:d=d.match(/\d+/g),(d[0]<2||2==d[0]&&0==d[1]&&d[2]<=1)&&(c[b.BROWSER_TYPE_MIUI].auto=!1)}cc.__audioSupport=cc.sys.isMobile?cc.sys.os!=cc.sys.OS_IOS?c[b.browserType]||c.common:c[b.BROWSER_TYPE_SAFARI]:cc.sys.browserType!=cc.sys.BROWSER_TYPE_IE?c.common:c[b.BROWSER_TYPE_IE],a&&setTimeout(function(){cc.log("browse type: "+b.browserType),cc.log("browse version: "+d),cc.log("multichannel: "+cc.__audioSupport.multichannel),cc.log("webAudio: "+cc.__audioSupport.webAudio),cc.log("auto: "+cc.__audioSupport.auto)},0)}(),cc.Audio=cc.Class.extend({volume:1,loop:!1,src:null,_touch:!1,_playing:!1,_AUDIO_TYPE:"AUDIO",_pause:!1,_buffer:null,_currentSource:null,_startTime:null,_currentTime:null,_context:null,_volume:null,_ignoreEnded:!1,_element:null,ctor:function(a,b,c){a&&(this._context=a),b&&(this._volume=b),a&&b&&(this._AUDIO_TYPE="WEBAUDIO"),this.src=c},_setBufferCallback:null,setBuffer:function(a){if(a){var b=this._playing;this._AUDIO_TYPE="WEBAUDIO",this._buffer&&this._buffer!=a&&this.getPlaying()&&this.stop(),this._buffer=a,b&&this.play(),this._volume.gain.value=this.volume,this._setBufferCallback&&this._setBufferCallback(a)}},_setElementCallback:null,setElement:function(a){if(a){var b=this._playing;this._AUDIO_TYPE="AUDIO",this._element&&this._element!=a&&this.getPlaying()&&this.stop(),this._element=a,b&&this.play(),a.volume=this.volume,a.loop=this.loop,this._setElementCallback&&this._setElementCallback(a)}},play:function(a,b){this._playing=!0,this.loop=void 0===b?this.loop:b,"AUDIO"===this._AUDIO_TYPE?this._playOfAudio(a):this._playOfWebAudio(a)},getPlaying:function(){if(!this._playing)return this._playing;if("AUDIO"===this._AUDIO_TYPE){var a=this._element;return!a||this._pause?(this._playing=!1,!1):a.ended?(this._playing=!1,!1):!0}var b=this._currentSource;return this._playing||b?null==b.playbackState?this._playing:this._currentTime+this._context.currentTime-this._startTime<this._currentSource.buffer.duration:!0},_playOfWebAudio:function(a){var b=this._currentSource;if(this._buffer){if(!this._pause&&b){if(!(0===this._context.currentTime||this._currentTime+this._context.currentTime-this._startTime>this._currentSource.buffer.duration))return;this._stopOfWebAudio()}var c=this._context.createBufferSource();if(c.buffer=this._buffer,c.connect(this._volume),c.loop=this.loop,this._startTime=this._context.currentTime,this._currentTime=0,c.start)c.start(0,a||0);else if(c.noteGrainOn){var d=c.buffer.duration;this.loop?c.noteGrainOn(0,a,d):c.noteGrainOn(0,a,d-a)}else c.noteOn(0);this._currentSource=c;var e=this;c.onended=function(){e._ignoreEnded?e._ignoreEnded=!1:e._playing=!1}}},_playOfAudio:function(){var a=this._element;a&&(a.loop=this.loop,a.play())},stop:function(){this._playing=!1,"AUDIO"===this._AUDIO_TYPE?this._stopOfAudio():this._stopOfWebAudio()},_stopOfWebAudio:function(){var a=this._currentSource;this._ignoreEnded=!0,a&&(a.stop(0),this._currentSource=null)},_stopOfAudio:function(){var a=this._element;a&&(a.pause(),a.duration&&1/0!=a.duration&&(a.currentTime=0))},pause:function(){this._playing=!1,this._pause=!0,"AUDIO"===this._AUDIO_TYPE?this._pauseOfAudio():this._pauseOfWebAudio()},_pauseOfWebAudio:function(){this._currentTime+=this._context.currentTime-this._startTime;var a=this._currentSource;a&&a.stop(0)},_pauseOfAudio:function(){var a=this._element;a&&a.pause()},resume:function(){this._pause&&("AUDIO"===this._AUDIO_TYPE?this._resumeOfAudio():this._resumeOfWebAudio(),this._pause=!1,this._playing=!0)},_resumeOfWebAudio:function(){var a=this._currentSource;if(a){this._startTime=this._context.currentTime;var b=this._currentTime%a.buffer.duration;this._playOfWebAudio(b)}},_resumeOfAudio:function(){var a=this._element;a&&a.play()},setVolume:function(a){a>1&&(a=1),0>a&&(a=0),this.volume=a,"AUDIO"===this._AUDIO_TYPE?this._element&&(this._element.volume=a):this._volume&&(this._volume.gain.value=a)},getVolume:function(){return this.volume},cloneNode:function(){var a,b;if("AUDIO"===this._AUDIO_TYPE){a=new cc.Audio;var c=document.createElement("audio");c.src=this.src,a.setElement(c)}else{var d=this._context.createGain();d.gain.value=1,d.connect(this._context.destination),a=new cc.Audio(this._context,d,this.src),this._buffer?a.setBuffer(this._buffer):(b=this,this._setBufferCallback=function(c){a.setBuffer(c),b._setBufferCallback=null})}return a._AUDIO_TYPE=this._AUDIO_TYPE,a}}),function(a){var b=a.webAudio,c=a.multichannel,d=a.auto,e=[];!function(){var a=document.createElement("audio");if(a.canPlayType){var b=a.canPlayType('audio/ogg; codecs="vorbis"');b&&""!==b&&e.push(".ogg");var c=a.canPlayType("audio/mpeg");c&&""!==c&&e.push(".mp3");var d=a.canPlayType('audio/wav; codecs="1"');d&&""!==d&&e.push(".wav");var f=a.canPlayType("audio/mp4");f&&""!==f&&e.push(".mp4");var g=a.canPlayType("audio/x-m4a");g&&""!==g&&e.push(".m4a")}}();try{if(b)var f=new(window.AudioContext||window.webkitAudioContext||window.mozAudioContext)}catch(g){b=!1,cc.log("browser don't support webAudio")}var h={cache:{},load:function(a,c,d,g){if(0===e.length)return g("can not support audio!");var i,j=cc.path.extname(a),k=[j];for(i=0;i<e.length;i++)j!==e[i]&&k.push(e[i]);var l;if(h.cache[c])return g(null,h.cache[c]);if(b){var m=f.createGain();m.gain.value=1,m.connect(f.destination),l=new cc.Audio(f,m,a)}else l=new cc.Audio(null,null,a);this.loadAudioFromExtList(a,k,l,g),h.cache[c]=l},loadAudioFromExtList:function(c,d,g,i){if(0===d.length){var j="can not found the resource of audio! Last match url is : ";return j+=c.replace(/\.(.*)?$/,"("),e.forEach(function(a){j+=a+"|"}),j=j.replace(/\|$/,")"),i(j)}if(c=cc.path.changeExtname(c,d.splice(0,1)),b){a.webAudioCallback&&a.webAudioCallback(c);var k=new XMLHttpRequest;k.open("GET",c,!0),k.responseType="arraybuffer",k.onload=function(){f.decodeAudioData(k.response,function(a){g.setBuffer(a),i(null,g)},function(){h.loadAudioFromExtList(c,d,g,i)})},k.send()}else{var l=document.createElement("audio"),m=!1,n=!1,o=setTimeout(function(){0==l.readyState?r():(n=!0,i("audio load timeout : "+c,g))},1e4),p=function(){m||(g.setElement(l),l.removeEventListener("canplaythrough",p,!1),l.removeEventListener("error",q,!1),l.removeEventListener("emptied",r,!1),!n&&i(null,g),m=!0,clearTimeout(o))},q=function(){m&&(l.removeEventListener("canplaythrough",p,!1),l.removeEventListener("error",q,!1),l.removeEventListener("emptied",r,!1),!n&&h.loadAudioFromExtList(c,d,g,i),m=!0,clearTimeout(o))},r=function(){n=!0,p(),i(null,g)};cc._addEventListener(l,"canplaythrough",p,!1),cc._addEventListener(l,"error",q,!1),a.emptied&&cc._addEventListener(l,"emptied",r,!1),l.src=c,l.load()}}};if(cc.loader.register(["mp3","ogg","wav","mp4","m4a"],h),cc.audioEngine={_currMusic:null,_musicVolume:1,willPlayMusic:function(){return!1},playMusic:function(a,b){var c=this._currMusic;c&&c.src!==a&&c.getPlaying()&&c.stop();var d=h.cache[a];d||(cc.loader.load(a),d=h.cache[a]),d.play(0,b),d.setVolume(this._musicVolume),this._currMusic=d},stopMusic:function(a){var b=this._currMusic;b&&(b.stop(),a&&cc.loader.release(b.src))},pauseMusic:function(){var a=this._currMusic;a&&a.pause()},resumeMusic:function(){var a=this._currMusic;a&&a.resume()},rewindMusic:function(){var a=this._currMusic;a&&(a.stop(),a.play())},getMusicVolume:function(){return this._musicVolume},setMusicVolume:function(a){a-=0,isNaN(a)&&(a=1),a>1&&(a=1),0>a&&(a=0),this._musicVolume=a;var b=this._currMusic;b&&b.setVolume(a)},isMusicPlaying:function(){var a=this._currMusic;return a?a.getPlaying():!1},_audioPool:{},_maxAudioInstance:5,_effectVolume:1,playEffect:function(a,d){if(!c)return null;var e=this._audioPool[a];e||(e=this._audioPool[a]=[]);var f;for(f=0;f<e.length&&e[f].getPlaying();f++);if(e[f])g=e[f],g.setVolume(this._effectVolume),g.play(0,d);else if(!b&&f>this._maxAudioInstance)cc.log("Error: %s greater than %d",a,this._maxAudioInstance);else{var g=h.cache[a];g||(cc.loader.load(a),g=h.cache[a]),g=g.cloneNode(),g.setVolume(this._effectVolume),g.loop=d||!1,g.play(),e.push(g)}return g},setEffectsVolume:function(a){a-=0,isNaN(a)&&(a=1),a>1&&(a=1),0>a&&(a=0),this._effectVolume=a;var b=this._audioPool;for(var c in b){var d=b[c];if(Array.isArray(d))for(var e=0;e<d.length;e++)d[e].setVolume(a)}},getEffectsVolume:function(){return this._effectVolume},pauseEffect:function(a){a&&a.pause()},pauseAllEffects:function(){var a=this._audioPool;for(var b in a)for(var c=a[b],d=0;d<a[b].length;d++)c[d].getPlaying()&&c[d].pause()},resumeEffect:function(a){a&&a.resume()},resumeAllEffects:function(){var a=this._audioPool;for(var b in a)for(var c=a[b],d=0;d<a[b].length;d++)c[d].resume()},stopEffect:function(a){a&&a.stop()},stopAllEffects:function(){var a=this._audioPool;for(var b in a)for(var c=a[b],d=0;d<a[b].length;d++)c[d].stop()},unloadEffect:function(a){if(a){cc.loader.release(a);var b=this._audioPool[a];b&&(b.length=0),delete this._audioPool[a],delete h.cache[a]}},end:function(){this.stopMusic(),this.stopAllEffects()},_pauseCache:[],_pausePlaying:function(){var a=this._currMusic;a&&a.getPlaying()&&(a.pause(),this._pauseCache.push(a));var b=this._audioPool;for(var c in b)for(var d=b[c],e=0;e<b[c].length;e++)d[e].getPlaying()&&(d[e].pause(),this._pauseCache.push(d[e]))},_resumePlaying:function(){for(var a=this._pauseCache,b=0;b<a.length;b++)a[b].resume();a.length=0}},!d){var i=function(){var b=cc.audioEngine._currMusic;b&&b._touch===!1&&b._playing&&b.getPlaying()&&(b._touch=!0,b.play(0,b.loop),!a.replay&&cc._canvas.removeEventListener("touchstart",i))};setTimeout(function(){cc._canvas&&cc._canvas.addEventListener("touchstart",i,!1)},150)}cc.eventManager.addCustomListener(cc.game.EVENT_HIDE,function(){cc.audioEngine._pausePlaying()}),cc.eventManager.addCustomListener(cc.game.EVENT_SHOW,function(){cc.audioEngine._resumePlaying()})}(cc.__audioSupport);