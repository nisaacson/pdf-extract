MOCHA=node_modules/.bin/mocha
test:
	$(MOCHA) --reporter spec
electronic:
	$(MOCHA) $(shell find test -name "*electronic-test.js") --test --reporter spec
searchable:
	$(MOCHA) $(shell find test -name "*searchable-test.js") --test --reporter spec

ocr:
	$(MOCHA) $(shell find test -name "*ocr-test.js") --test --reporter spec

.PHONY: test
