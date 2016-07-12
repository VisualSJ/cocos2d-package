var defaultVersion = 'v3.12';

var removeClass = function(DOM, CLASS){
    DOM.className = DOM.className.replace(" " + CLASS, "");
};
var addClass = function(DOM, CLASS){
    removeClass(DOM, CLASS);
    DOM.className += " " + CLASS;
};

/**
 * Program module
 * @namespace
 */
var pagePG = {};

pagePG.express = true;
pagePG.ModuleDiv = document.getElementById("custom");
pagePG.ModuleList = null;
pagePG.ModuleButtonList = null;
pagePG.ModuleCheckList = null;
pagePG.SizeDivList = {
    dist: document.getElementById("cSize"),
    src: document.getElementById("uSize")
};

pagePG.prevClickModuleName = "";
pagePG.prevClickChangeModule = [];

/**
 * Mode label button event
 * @function
 */
pagePG.ModeButton = function(){

    var tmp;
    var modeLabel = document.getElementById("mode");
    tmp = modeLabel.getElementsByTagName("span");
    var Default = tmp[0].parentNode;
    var Full = tmp[1].parentNode;
    var Custom = tmp[2].parentNode;

    Default.addEventListener("click", function(){
        removeClass(tmp[1], "checked");
        removeClass(tmp[2], "checked");
        addClass(tmp[0], "checked");
        pagePG.express = true;
        if(module && hiddenList && _sort){
            pagePG.Init();
            addClass(pagePG.ModuleDiv, "custom");
        }
    });
    Full.addEventListener("click", function(){
        removeClass(tmp[0], "checked");
        removeClass(tmp[2], "checked");
        addClass(tmp[1], "checked");
        pagePG.express = false;
        if(module && hiddenList && _sort){
            pagePG.SelectAll();
            addClass(pagePG.ModuleDiv, "custom");
        }
    });
    Custom.addEventListener("click", function(){
        removeClass(tmp[0], "checked");
        removeClass(tmp[1], "checked");
        addClass(tmp[2], "checked");
        pagePG.express = false;
        if(module && hiddenList && _sort){
            pagePG.MiniSize();
            removeClass(pagePG.ModuleDiv, "custom");
        }
    });
};


/**
 * Load module list
 * @function
 */
pagePG.LoadList = function(){
    var version = window.location.href.split('?')[1];
    if (version == undefined) version = 'ver=' + defaultVersion;
    var paramArr = version.split('&');

    paramArr = paramArr.map(function (_param) {
        return _param.split('=');
    });

    paramArr.forEach(function (_param) {
        if (_param[0] == 'ver') {
            //show version
            document.getElementById('version').innerHTML = _param[1];

            //load module.js
            var scp = document.createElement('script');
            defaultVersion = _param[1];
            scp.src = _param[1] + '/module.js';
            document.body.appendChild(scp);

            scp.addEventListener("load", function(){
                if(module && hiddenList && _sort){
                    pagePG.Init();
                    pagePG.ModeButton();
                }
            });
        }
    });
};

/**
 * Init the html
 * @function
 */
pagePG.Init = function(){
    var tbody = pagePG.ModuleDiv.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    var createHtml = function(result){
        var tr = document.createElement('tr');
        if(hiddenList[result.name]){
            tr.style.display = 'none';
        }

        var td = document.createElement('td');

        //checked button
        var span = document.createElement('span');
        span.id = result.name;
        span.className = 'mark';
        td.appendChild(span);

        //default checked
        if (result.name == 'core' || result.checked != 0) {
            span.className += ' checked';
            result.checked = 1;
        }

        //change module name
        if(result.name == 'actions3d'){
            td.innerHTML += 'effects';
        }else if(result.name == 'debugger'){
            td.innerHTML += 'log';
        }else if(result.name == "core-webgl"){
            td.innerHTML += "webgl";
        }else{
            td.innerHTML += result.name;
        }
        tr.appendChild(td);

        //info td
        td = document.createElement('td');
        td.innerHTML = result.info || 'Unknow';
        tr.appendChild(td);

        tbody.appendChild(tr);
    };

    pagePG.ModuleCheckList = {};
    //Create core <tr>
    var i;
    for(i=0; i<module["info"].length; i++){
        if (module["info"][i].name == "core"){
            createHtml(module["info"][i]);
            pagePG.ModuleCheckList["core"] = 1;
            break;
        }
    }
    //Other module <tr>
    for(i=0; i<_sort.length; i++){

        var name = _sort[i];
        if (name != "core"){
            for(var j=0; j<module["info"].length; j++){
                if(module["info"][j]["name"] == name){
                    var result = module["info"][j];
                    createHtml(result);
                    pagePG.ModuleCheckList[result["name"]] = result["checked"];
                }
            }
        }
    }

    pagePG.BindEvent();
    pagePG.readSize();
};

/**
 * Bind event
 * @function
 */
pagePG.BindEvent = function(){
    var spanList = pagePG.ModuleDiv.getElementsByTagName("span");
    pagePG.ModuleButtonList = Array.prototype.map.call(spanList, function(item){
        return item.parentNode;
    });
    pagePG.ModuleButtonList.forEach(function(item, i){

        item.addEventListener("click", function(){

            var name = spanList[i].id;

            if(pagePG.ModuleCheckList[name] === 0){
                pagePG.prevClickModuleName = name;
            }else{
                if(name === pagePG.prevClickModuleName){
                    pagePG.prevClickChangeModule.forEach(function(item){
                        if(pagePG.ModuleCheckList[item] === 1){

                            removeClass(document.getElementById(item), "checked");
                            pagePG.ModuleCheckList[item] = 0;
                        }
                    });
                    pagePG.prevClickModuleName = "";
                }
            }
            pagePG.prevClickChangeModule = [];

            pagePG.ChangeChecked(name, spanList, i);

            pagePG.changeWebGL();

            pagePG.readSize();
        });
    });
};

/**
 * change webgl
 */
pagePG.changeWebGL = function(){
    var ml = pagePG.ModuleCheckList;

    if(ml["webgl"] != null){
        if(ml["webgl"]){
            for(var p in ml){
                if(ml[p + "-webgl"] !== undefined){
                    if(ml[p]){
                        ml[p + "-webgl"] = 1;
                        pagePG.checkRule(p + "-webgl", 1);
                    }else{
                        ml[p + "-webgl"] = 0;
                        pagePG.checkRule(p + "-webgl", 0);
                    }
                }

            }
        }else{
            for(var p in ml){
                if(ml[p + "-webgl"] !== undefined){
                    ml[p + "-webgl"] = 0;
                    pagePG.checkRule(p + "-webgl", 0);
                }
            }
        }
    }
};

/**
 * show size
 */
pagePG.readSize = function(){
    var p;
    var dist = 0;
    var src = 0;

    for(p in pagePG.ModuleCheckList){
        if(pagePG.ModuleCheckList[p]){

            for(var i=0; i<module["info"].length; i++){
                var item = module["info"][i];
                if(item['name'] === p){
                    dist += parseFloat(item['minSize']);
                    src += parseFloat(item['maxSize']);
                    break;
                }
            }
        }
    }
    pagePG.SizeDivList.dist.innerHTML = (dist | 0) + "KB";
    pagePG.SizeDivList.src.innerHTML = (src | 0) + "KB";
};

/**
 * Change module checked
 * @function
 *
 * @param {String} name
 * @param [spanList=]
 * @param {number} [i=]
 */
pagePG.ChangeChecked = function(name, spanList, i){
    if(!spanList){
        i = 0;
        spanList = [document.getElementById(name)];
    }
    var pml = pagePG.ModuleCheckList;
    if(pml[name] === 0){
        addClass(spanList[i], "checked");
        pml[name] = 1;
        pagePG.checkRule(name, 1);
    }else if(pml[name] === 1){
        removeClass(spanList[i], "checked");
        pml[name] = 0;
        pagePG.checkRule(name, 0);
    }else{
        console.log(name + " is not exists.");
    }
};

/**
 * Check module rule
 * @function
 *
 * @param {string} name
 * @param {number} mode
 */
pagePG.checkRule = function(name, mode){
    var i, m;

    for(i=0; i<pagePG.prevClickChangeModule.length; i++){
        if(pagePG.prevClickChangeModule[i] == name){
            return;
        }
    }

    //Find dependencies
    if(mode){
        for(i=0; i<module["info"].length; i++){
            if(module["info"][i]["name"] === name){
                m = module["info"][i];
                break;
            }
        }
        m["rule"].forEach(function(item){
            if(pagePG.ModuleCheckList[item] === 0){
                pagePG.ChangeChecked(item);
                if(pagePG.prevClickChangeModule.every(function(item2){
                    return item2 != item;
                })){
                    pagePG.prevClickChangeModule.push(item);
                }
            }
        });

    }
    //To find module that dependencies this module
    else{
        for(i=0; i<module["info"].length; i++){
            m = module["info"][i];
            for(var j=0; j<m["rule"].length; j++){
                if(m["rule"][j] == name){
                    if(pagePG.ModuleCheckList[m["name"]] === 1){
                        pagePG.ChangeChecked(m["name"]);
                    }
                }
            }
        }
    }
};

pagePG.checkDrop = false;
/**
 * Select list
 * @function
 */
pagePG.setDropdown = function(){
    var drop = document.getElementById('dropdown');

    var _ver = drop.getElementsByTagName('ul')[0];

    drop.onclick = function () {
        if (pagePG.checkDrop) {
            pagePG.checkDrop = false;
            _ver.style.display = 'none';
        }
        else {
            pagePG.checkDrop = true;
            _ver.style.display = 'block';
        }
    };
};

/**
 * Compressed button
 * @function
 */
pagePG.Compressed = function(){
    var _tr2 = document.getElementById('compress').getElementsByTagName('tr');
    for(var i=0;i<_tr2.length;i++){
        _tr2[i].onclick = function(){
            var _span2 = this.getElementsByTagName('span')[0];
            _span2.className = _span2.className.replace(' checked', '');
            _span2.className += ' checked';

            for(var j=0;j<_tr2.length;j++){
                if(_tr2[j] != this){
                    var _span2 = _tr2[j].getElementsByTagName('span')[0];
                    _span2.className = _span2.className.replace(' checked', '');
                }
            }
        };
    }
};

/**
 * Select all module
 * @function
 */
pagePG.SelectAll = function(){
    var p;

    for(p in pagePG.ModuleCheckList){
        pagePG.ModuleCheckList[p] = 1;
        addClass(document.getElementById(p), "checked");
    }
    pagePG.readSize();

};

/**
 * Only core
 * @function
 */
pagePG.MiniSize = function(){
    for(p in pagePG.ModuleCheckList){
        if(p == "core"){
            pagePG.ModuleCheckList[p] = 1;
            addClass(document.getElementById(p), "checked");
        }else{
            pagePG.ModuleCheckList[p] = 0;
            removeClass(document.getElementById(p), "checked");
        }
    }
    pagePG.readSize();
};

pagePG.LoadList();
pagePG.setDropdown();
pagePG.Compressed();

var Load = function(_a){
    var _com = /checked/.test(document.getElementById("Compressor").className);

    var _s = 'download?ver=' + defaultVersion + '&com=' + _com + '&express=' + pagePG.express.toString() + '&file=';

    _sort.forEach(function(item){
        if(item !== "webgl" && pagePG.ModuleCheckList[item] === 1){
            _s += item + ',';
        }
    });
    _s = _s.substr(0, _s.length - 1);
    _a.href = _s;
};