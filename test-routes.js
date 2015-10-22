var route = require('boulevard');
var React = require('react');

module.exports = route({
	'/'() {
		return <h1>It's awesome!</h1>;
	}
});
