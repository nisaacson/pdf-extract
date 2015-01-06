MOCHA=node_modules/.bin/mocha
ESLINT?=node_modules/.bin/eslint

test: lint
	$(MOCHA) --reporter spec
electronic:
	$(MOCHA) $(shell find test -name "*electronic-test.js") --test --reporter spec
searchable:
	$(MOCHA) $(shell find test -name "*searchable-test.js") --test --reporter spec

ocr:
	$(MOCHA) $(shell find test -name "*ocr-test.js") --test --reporter spec


lint:
	@echo "\n-----> running eslint against repo"
	@$(ESLINT) .
	@echo "       lint passes"

.PHONY: test
