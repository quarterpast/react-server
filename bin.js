#!/usr/bin/env node

var rs = require('./');
var fs = require('fs');
var server = require('@quarterto/promise-server');
var http = require('http');
var argv = require('minimist')(process.argv.slice(2), {
	boolean: ['build']
});

require("babel/register");

if(argv.build) {
	rs.build(argv._[0])
		.on('error', e => {throw e})
		.pipe(argv.o ? fs.createWriteStream(argv.o) : process.stdout);
} else {
	var port = argv.p || argv.port || 3000;

	http.createServer(server([
		rs.routeBundler(argv._[0]),
	].concat(rs.middleware), {}))
	.listen(port, console.log.bind(console, 'listening on', port));
}


