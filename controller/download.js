var fs = require('fs');
var path = require('path');

var prevTime = new Date(0);
var htmlCache = "";

module.exports = function (request, response) {

    var currentTime = new Date();

    if(currentTime - 1000 > prevTime){

        var files = request.query["file"],
            version = request.query["ver"],
            compressed = request.query["com"];

        if(files)
            files = files.split(",");
        else
            files = [];

        var fileStr = "";
        var header = "/*\n  Cocos2d-JS " + version + "\n  ";
        files.forEach(function(file){
            header += file + " | ";
            console.log(path.join(__dirname, '../website/' + version + '/', compressed == 'true' ? 'dist' : 'src', file + '.js'));
            fileStr += fs.readFileSync(path.join(__dirname, '../website/' + version + '/', compressed == 'true' ? 'dist' : 'src', file + '.js'));
        });
        header = header.replace(/ \| $/, "");
        header += "\n*/\n\n";
        prevTime = currentTime;

        htmlCache = header + fileStr;
    }

    response.setHeader("Content-Type", "application/javascript");
    response.end(htmlCache);
};