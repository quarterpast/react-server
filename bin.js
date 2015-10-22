#!/usr/bin/env node

var rs = require('./');
var server = require('@quarterto/promise-server');
var http = require('http');
var argv = require('minimist')(process.argv.slice(2));

require("babel/register");

var port = argv.p || argv.port || 3000;

http.createServer(server([
	rs.routeBundler(argv._[0]),
].concat(rs.middleware), {}))
.listen(port, console.log.bind(console, 'listening on', port));
