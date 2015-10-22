var route = require('boulevard').withFourOhFour(req => ({
	body: `${req.url} not found`,
	status: 404
}));
var React = require('react');

module.exports = route({
	'/'() {
		return <h1>It's working!</h1>;
	}
});
