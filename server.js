var rs = require('./');
var argv = require('./argv');
var http = require('http');
var server = require('@quarterto/promise-server');

module.exports = function(entry, opts) {
	require("babel/register");

	var port = opts.port || 3000;

	http.createServer(server([
		rs.routeBundler(entry, opts),
	].concat(rs.middleware), {}))
	.listen(port, console.log.bind(console, 'listening on', port));
};

if(require.main === module) module.exports(argv._[0], argv);

