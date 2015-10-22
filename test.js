var {middleware, routeBundler} = require('./');
var server = require('@quarterto/promise-server');
var http = require('http');

var routePath = './test-routes.js';

http.createServer(server([routeBundler(routePath), ...middleware], {})).listen(3002);
