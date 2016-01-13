var spey = require('speyside');
var promiseServer = require('@quarterto/promise-server');
var ReactDOM = require('react-dom');
var defaults = require('lodash.defaults');
var reactTitle = require('@quarterto/react-title');

module.exports = function(routes, options) {
	spey.createServer(promiseServer(routes, defaults(options || {}, {
		handleResult(result) {
			var component = ReactDOM.render(result, document.querySelector('main'));
			document.title = reactTitle(result, component);
		},
		handleError(req) {
			return function(err) {
				console.error(err);
				document.querySelector('main').innerHTML = '<pre>' + err.stack + '</pre>';
			};
		}
	}))).listen();
};
