'use strict';

const Express = require('express');

const App = Express();

App.get('/download', require('./controller/download'));

App.use(Express.static('./website'));

var server = App.listen(3010, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});