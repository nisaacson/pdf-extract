test:
	mocha --reporter spec
electronic:
	mocha $(shell find test -name "*electronic-test.js") --test --reporter spec
searchable:
	mocha $(shell find test -name "*searchable-test.js") --test --reporter spec

ocr:
	mocha $(shell find test -name "*ocr-test.js") --test --reporter spec

.PHONY: test
