module.exports = require('minimist')(process.argv.slice(2), {
	boolean: ['build'],
	alias: {
		port: 'p'
	},
	default: {
		port: process.env.PORT || 3000
	}
});
