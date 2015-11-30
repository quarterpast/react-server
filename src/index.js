var browserify = require('browserify');
var watchify = require('watchify');
var path = require('path');

exports.middleware = [
	require('@quarterto/promise-server-react').withWrapHtml((html, title) => `<!doctype html>
		<html lang="en">
			<head>
				<meta charset="utf-8">
				<title>${title}</title>
			</head>
			<body>
				<main>${html}</main>
				<script src="/bundle.js"></script>
			</body>
		</html>
	`)
];

function createBundle(resolved, options = {}) {
	return browserify(__dirname + '/client.js', Object.assign(options, {basedir: process.cwd()}, watchify.args))
		.transform('browserify-replace', {replace: [{from: /__ROUTES__/, to: `'${resolved}'`}]})
		.transform('babelify');
}

exports.build = (routerPath, options = {}) => {
	var resolved = path.resolve(routerPath);
	var bundle = createBundle(resolved, options)
	
	bundle.on('log', console.error);

	return bundle.bundle();
};

exports.routeBundler = (routerPath, options = {}) => {
	var resolved = path.resolve(routerPath);
	var routes = require(resolved);

	var bundle = watchify(createBundle(resolved, options))
		.plugin('livereactload');

	bundle.bundle()
		.on('error', e => {throw e})
		.on('data', () => {});

	bundle.on('log', console.log);

	routes.add({
		'/bundle.js'(req) {
			return {
				body: bundle.bundle(),
				headers: {'content-type': 'application/javascript'}
			};
		}
	});

	return routes;
};
