all: lib/index.js lib/client.js

lib/%.js: src/%.js
	@mkdir -p $(@D)
	node_modules/.bin/babel $< > $@
