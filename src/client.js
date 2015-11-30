var spey = require('speyside');
var promiseServer = require('@quarterto/promise-server');
var ReactDOM = require('react-dom');

module.exports = function(routes) {
	spey.createServer(promiseServer(routes, {
		handleResult(result) {
			ReactDOM.render(result, document.querySelector('main'));
		},
		handleError(err) {
			document.querySelector('main').innerHTML = '<pre>' + err.stack + '</pre>';
		}
	})).listen();
};
