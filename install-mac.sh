#!/bin/bash
# can skip pdftk install step per https://github.com/nisaacson/pdf-extract/pull/26
brew install poppler
brew install gs
brew install tesseract
cd /usr/local/Cellar/tesseract/*/share/tessdata/
cp "$OLDPWD/node_modules/pdf-extract/share/eng.traineddata" eng.traineddata
cp "$OLDPWD/node_modules/pdf-extract/share/dia.traineddata" dia.traineddata
cp "$OLDPWD/node_modules/pdf-extract/share/configs/alphanumeric" configs/alphanumeric
cd -
