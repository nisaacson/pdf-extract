# Node PDF
[![Build Status](https://travis-ci.org/nisaacson/pdf-extract.png)](https://travis-ci.org/nisaacson/pdf-extract)

Node PDF is a set of tools that takes in PDF files and converts them to usable formats for data processing. The library supports both extracting text from searchable pdf files as well as performing OCR on pdfs which are just scanned images of text

## Installation
`npm install pdf-extract`
After the library is installed you will need the following binaries accessible on your path to process pdfs.

- pdftk
- pdftotext
- convert
- tesseract


### pdftk
pdftk splits multi-page pdf into single pages.
On OSX you can install via the installer available here
[http://www.pdflabs.com/docs/install-pdftk/](http://www.pdflabs.com/docs/install-pdftk/)

On Ubuntu you can install via aptitude
`sudo apt-get install pdftk`

### pdftotext - Searchable PDF Extract
For electronic pdf files with actual text in them, this module uses the *pdftotext* library to extract the text. Therefore you need to have *pdftotext* available on your path

#### OSX
On OSX you can get the pdftotext utility via the xpdf forumula in Homebrew 
`brew install xpdf`

#### Ubuntu
On Ubuntu you can install the needed binary via the **poppler-utils** library
`apt-get install poppler-utils`

### convert pdf to tif processing
The tesseract ocr software needs tif files as input. This library uses the convert command from GraphicsMagick to perform the conversion from pdf to tif

#### OSX
On OSX you can install via homebrew
`brew install gm`

#### Ubuntu
On Ubuntu you can install via aptitude
`sudo apt-get install graphicsmagick`

### tesseract - OCR Extract
For the OCR to work, you need to have the tesseract-ocr binaries available on your path. If you only need to handle ASCII characters, the accuracy of the OCR process can be increased by limiting the tesseract output. To do this copy the included *alphanumeric* file into the *tess-data* folder on your system. 

#### OSX
On OSX you use the excellent package manager homebrew to install tesseract
`brew install tesseract`

After tesseract is installed you need to install the alphanumeric config and an updated trained data file
```
cd <root of this project>
cp "./share/eng.traineddata" "/usr/local/Cellar/tesseract/3.01/share/tessdata/eng.traineddata"
cp "lib/alphanumeric" "/usr/local/Cellar/tesseract/3.01/share/tessdata/configs/alphanumeric"
```

#### Ubuntu
On Ubuntu you can install tesseract via aptitude
```
sudo apt-get install tesseract-ocr
```
After tesseract is installed you need to install the alphanumeric config and an updated trained data file.
```
cd <root of this project>
cp "./share/eng.traineddata" "/usr/local/share/tesseract-ocr/tessdata/eng.traineddata"
cp "lib/alphanumeric" "/usr/local/local/share/tessdata/configs/alphanumeric"
```
Note that on some systems tesseract will installed its shared files to `usr/share/tessdata`. Substitute this folder into the two commands above as needed
```
cd <root of this project>
cp "./share/eng.traineddata" "/usr/share/tesseract-ocr/tessdata/eng.traineddata"
cp "lib/alphanumeric" "/usr/local/share/tessdata/configs/alphanumeric"
```

## Usage

### OCR Extract from scanned image
Extract from a pdf file which contains a scanned image and no searchable text 
```
var inspect = require('eyes').inspector({maxLength:20000});
var pdf_extract = require('pdf-extract');
var absolute_path_to_pdf = '~/Downloads/sample.pdf'
var options = {
  type: 'ocr' // perform ocr to get the text within the scanned image
}
pdf_extract(absolute_path_to_pdf, options, function(err, text_pages) {
  if (err) {
    return callback(err);
  }
  inspect(text_pages, 'ocr output');
  callback(null, text_pages);
});
```

### Text extract from searchable pdf
Extract from a pdf file which contains actual searchable text 
```
var inspect = require('eyes').inspector({maxLength:20000});
var pdf_extract = require('pdf-extract');
var absolute_path_to_pdf = '~/Downloads/electronic.pdf'
var options = {
  type: 'text'  // extract the actual text in the pdf file
}
pdf_extract(absolute_path_to_pdf, options, function(err, text_pages) {
  if (err) {
    return callback(err);
  }
  inspect(text_pages, 'extracted text pages');
  callback(null, text_pages);
});
```

## Tests
To test that your system satisfies the needed dependencies and that module is functioning correctly execute the command in the pdf-extract module folder
```
cd <project_root>/node_modules/pdf-extract
npm test
```

