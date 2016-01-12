var browserify = require('browserify');
var watchify = require('watchify');
var path = require('path');
var from = require('from');
var through = require('through2');
var addStream = require('add-stream');

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
	return browserify(resolved, Object.assign(options, {
		paths: [path.resolve(__dirname, '../node_modules')],
		basedir: process.cwd(),
		cache: {}, packageCache: {}
	}))
		.transform(file => file === resolved ? addStream(from([
			`;require(${JSON.stringify(__dirname + '/client.js')})(
				module.exports
				${options.clientOptions ? `, require(${JSON.stringify(options.clientOptions)})` : ''}
			);`
		])) : through())
		.transform('babelify', Object.assign({stage: 0}, process.env.NODE_ENV === 'production' ? {} : {
			"plugins": [
				"react-transform"
			],
			"extra": {
				"react-transform": {
					"transforms": [{
						"transform": "livereactload/babel-transform",
						"imports": ["react"]
					}, {
						"transform": "react-transform-catch-errors",
						"imports": ["react", "redbox-noreact"]
					}]
				}
			}
		}, options.babel));
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

	function drainBundle() {
		return bundle.bundle()
		.on('error', e => console.error(e))
		.on('data', () => {});
	}

	bundle.on('log', console.log);
	bundle.on('update', drainBundle);
	drainBundle().on('error', () => process.exit(1));

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
