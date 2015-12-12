#!/usr/bin/env node

var rs = require('./');
var argv = require('./argv');
var server = require('./server');

var fs = require('fs');
var path = require('path');

require("babel/register");

if(fs.existsSync(path.resolve('.babelrc'))) {
	argv.babel = JSON.parse(fs.readFileSync(path.resolve('.babelrc')), 'utf8');
}

if(argv['write-server']) {
	var serverSrc = fs.readFileSync(__dirname + '/server.js', 'utf8')
		.replace('var argv = require(\'./argv\');\n', '')
		.replace('./', '@quarterto/react-server')
		.replace('argv._[0]', JSON.stringify(argv._[0]))
		.replace('argv', JSON.stringify(argv));

	fs.writeFileSync(path.resolve(argv.writeServer), serverSrc);
	cp.execSync('npm install --save-dev @quarterto/promise-server');
} else if(argv.build) {
	process.env['BABEL_ENV'] = 'production';
	rs.build(argv._[0], argv)
		.on('error', e => {throw e})
		.pipe(argv.o ? fs.createWriteStream(argv.o) : process.stdout);
} else {
	server(argv._[0], argv);
}

