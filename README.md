# Node PDF
Node PDF is a set of tools that takes in PDF files and converts them to usable formats for data processing. The library supports both extracting text from searchable pdf files as well as performing OCR on pdfs which are just scanned images of text

[![Build Status](https://travis-ci.org/nisaacson/pdf-extract.png)](https://travis-ci.org/nisaacson/pdf-extract)

## Installation

To begin install the module.

`npm install pdf-extract`

After the library is installed you will need the following binaries accessible on your path to process pdfs.

- pdftk
    - pdftk splits multi-page pdf into single pages.
- pdftotext
    - pdftotext is used to extract text out of searchable pdf documents
- ghostscript
    - ghostscript is an ocr preprocessor which convert pdfs to tif files for input into tesseract
- tesseract
    - tesseract performs the actual ocr on your scanned images


### OSX
To begin on OSX, first make sure you have the homebrew package manager installed.

**pdftk** is not available in Homebrew. However a gui install is available here.
[http://www.pdflabs.com/docs/install-pdftk/](http://www.pdflabs.com/docs/install-pdftk/)

**pdftotext** is included as part of the **poppler** utilities library. **poppler** can be installed via homebrew

``` bash
brew install poppler
```

**ghostscript** can be install via homebrew
``` bash
brew install gs
```

**tesseract** can be installed via homebrew as well

``` bash
brew install tesseract
```

After tesseract is installed you need to install the alphanumeric config and an updated trained data file
``` bash
cd <root of this module>
cp "./share/eng.traineddata" "/usr/local/Cellar/tesseract/3.02.02_3/share/tessdata/eng.traineddata"
cp "./share/dia.traineddata" "/usr/local/Cellar/tesseract/3.02.02_3/share/tessdata/dia.traineddata"
cp "./share/configs/alphanumeric" "/usr/local/Cellar/tesseract/3.02.02_3/share/tessdata/configs/alphanumeric"
```

### Ubuntu
**pdftk** can be installed directly via apt-get
```bash
apt-get install pdftk
```

**pdftotext** is included in the **poppler-utils** library. To installer poppler-utils execute
``` bash
apt-get install poppler-utils
```

**ghostscript** can be install via apt-get
``` bash
apt-get install ghostscript
```

**tesseract** can be installed via apt-get. Note that unlike the osx install the package is called **tesseract-ocr** on Ubuntu, not **tesseract**
``` bash
apt-get install tesseract-ocr
```

For the OCR to work, you need to have the tesseract-ocr binaries available on your path. If you only need to handle ASCII characters, the accuracy of the OCR process can be increased by limiting the tesseract output. To do this copy the *alphanumeric* file included with this pdf-extract module into the *tess-data* folder on your system. Also the eng.traineddata included with the standard tesseract-ocr package is out of date. This pdf-extract module provides an up-to-date version which you should copy into the appropriate location on your system
``` bash
cd <root of this module>
cp "./share/eng.traineddata" "/usr/share/tesseract-ocr/tessdata/eng.traineddata"
cp "./share/configs/alphanumeric" "/usr/share/tesseract-ocr/tessdata/configs/alphanumeric"
```


### SmartOS
**pdftk** can be installed directly via apt-get
``` bash
apt-get install pdftk
```

**pdftotext** is included in the **poppler-utils** library. To installer poppler-utils execute
``` bash
apt-get install poppler-utils
```

**ghostscript** can be install via pkgin. Note you may need to update the pkgin repo to include the additional sources provided by Joyent. Check [http://www.perkin.org.uk/posts/9000-packages-for-smartos-and-illumos.html](http://www.perkin.org.uk/posts/9000-packages-for-smartos-and-illumos.html) for details
``` bash
pkgin install ghostscript
```

**tesseract** can be must be manually downloaded and compiled. You must also install leptonica before installing tesseract. At the time of this writing leptonica is available from [http://www.leptonica.com/download.html](http://www.leptonica.com/download.html), with the latest version tarball available from [http://www.leptonica.com/source/leptonica-1.69.tar.gz](http://www.leptonica.com/source/leptonica-1.69.tar.gz)
``` bash
pkgin install autoconf
wget http://www.leptonica.com/source/leptonica-1.69.tar.gz
tar -xvzf leptonica-1.69.tar.gz
cd leptonica-1.69
./configure
make
[sudo] make install
```
After installing leptonic move on to tesseract. Tesseract is available from [https://code.google.com/p/tesseract-ocr/downloads/list](https://code.google.com/p/tesseract-ocr/downloads/list) with the latest version available from [https://code.google.com/p/tesseract-ocr/downloads/detail?name=tesseract-ocr-3.02.02.tar.gz&can=2&q=](https://code.google.com/p/tesseract-ocr/downloads/detail?name=tesseract-ocr-3.02.02.tar.gz&can=2&q=)
``` bash
wget https://code.google.com/p/tesseract-ocr/downloads/detail?name=tesseract-ocr-3.02.02.tar.gz&can=2&q=
tar -xvzf tesseract-ocr-3.02.02.tar.gz
cd tesseract-ocr
./configure
make
[sudo] make install
```

### Windows

#### Using Chocolatey

Install [Chocolatey](https://chocolatey.org) and run:

```sh
choco install pdftk xpdf-utils ghostscript tesseract
```

#### Manually

Important! You will have to add some variables to the PATH of your machine. You do this by right clicking your computer in file explorer, select Properties, select Advanced System Settings, Environment Variables. You can then add **the folder that contains the executables** to the path variable.

**pdftk** can be installed using the PDFtk Server installer found here: https://www.pdflabs.com/tools/pdftk-server/
It should autmatically add itself to the PATH, if not, the default install location is *"C:\Program Files (x86)\PDFtk Server\bin\"*

**pdftotext** can be installed using the recompiled poppler utils for windows, which have been collected and bundled here: http://manifestwebdesign.com/2013/01/09/xpdf-and-poppler-utils-on-windows/
Unpack these in a folder, (example: *"C:\poppler-utils"*) and add this to the PATH.

**ghostscript** for Windows can be found at: http://www.ghostscript.com/download/gsdnld.html
Make sure you download the General Public License and the correct version (32/64bit).
Install it and go to the installation folder (default: *"C:\Program Files\gs\gs9.19"*) and go into the **bin** folder.
Rename the *gswin64c* to *gs*, and add the bin folder to your PATH.

**tesseract** can be build, but you can also download an older version which seems to work fine. Downloads at: https://sourceforge.net/projects/tesseract-ocr-alt/files/
Version tested is *tesseract-ocr-setup-3.02.02.exe*, the default install location is *"C:\Program Files (x86)\Tesseract-OCR"* and is also added to the PATH.
Note, this is only when you've checked that it will install for everyone on the machine.

Everything should work after all this! If not, try restarting to make sure the PATH variables are correctly used.
**This setup was tested on a Windows 10 Pro N 64bit machine.**


## Usage

### OCR Extract from scanned image
Extract from a pdf file which contains a scanned image and no searchable text
``` javascript
const path = require("path")
const pdf_extract = require('pdf-extract')

console.log("Usage: node thisfile.js the/path/tothe.pdf")
const absolute_path_to_pdf = path.resolve(process.argv[2])
if (absolute_path_to_pdf.includes(" ")) throw new Error("will fail for paths w spaces like "+absolute_path_to_pdf)

const options = {
  type: 'ocr', // perform ocr to get the text within the scanned image
  ocr_flags: ['--psm 1'], // automatically detect page orientation
}
const processor = pdf_extract(absolute_path_to_pdf, options, ()=>console.log("Starting…"))
processor.on('complete', data => callback(null, data))
processor.on('error', callback)
function callback (error, data) { error ? console.error(error) : console.log(data.text_pages[0]) }
```



### Text extract from searchable pdf
Extract from a pdf file which contains actual searchable text
``` javascript
const path = require("path")
const pdf_extract = require('./main.js')

console.log("Usage: node thisfile.js the/path/tothe.pdf")
const absolute_path_to_pdf = path.resolve(process.argv[2])
if (absolute_path_to_pdf.includes(" ")) throw new Error("will fail for paths w spaces like "+absolute_path_to_pdf)

const options = {
  type: 'text', // extract searchable text from PDF
  ocr_flags: ['--psm 1'], // automatically detect page orientation
  enc: 'UTF-8',  // optional, encoding to use for the text output
  mode: 'layout' // optional, mode to use when reading the pdf
}
const processor = pdf_extract(absolute_path_to_pdf, options, ()=>console.log("Starting…"))
processor.on('complete', data => callback(null, data))
processor.on('error', callback)
function callback (error, data) { error ? console.error(error) : console.log(data.text_pages[0]) }
```
#### Options
At a minimum you must specific the type of pdf extract you wish to perform

**clean**
When the system performs extracts text from a multi-page pdf, it first splits the pdf into single pages. This are written to disk before the ocr occurs. For some applications these single page files can be useful. If you need to work with the single page pdf files after the ocr is complete, set the **clean** option to **false** as show below. Note that the single page pdf files are written to the system appropriate temp directory, so if you must copy the files to a more permanent location yourself after the ocr process completes
``` javascript
var options = {
  type: 'ocr' // (required), perform ocr to get the text within the scanned image
  enc: 'UTF-8' // optional, only applies to 'text' type
  mode: 'layout' // optional, only applies to 'text' type. Available modes are 'layout', 'simple', 'table' or 'lineprinter'. Default is 'layout'
  clean: false // keep the single page pdfs created during the ocr process
  ocr_flags: [
    '-psm 1',       // automatically detect page orientation
    '-l dia',       // use a custom language file
    'alphanumeric'  // only output ascii characters
  ]
}
```


### Events
When processing, the module will emit various events as they occurr

**page**
Emitted when a page has completed processing. The data passed with this event looks like
``` javascript
var data = {
  hash: <sha1 hash of the input pdf file here>
  text: <extracted text here>,
  index: 2,
  num_pages: 4,
  pdf_path: "~/Downloads/input_pdf_file.pdf",
  single_page_pdf_path: "/tmp/temp_pdf_file2.pdf"
}
```

**error**
Emitted when an error occurs during processing. After this event is emitted processing will stop.
The data passed with this event looks like
```
var data = {
  error: 'no file exists at the path you specified',
  pdf_path: "~/Downloads/input_pdf_file.pdf",
}
```

**complete**
Emitted when all pages have completed processing and the pdf extraction is complete
```
var data = {
  hash: <sha1 hash of the input pdf file here>
  text_pages: <Array of Strings, one per page>,
  pdf_path: "~/Downloads/input_pdf_file.pdf",
  single_page_pdf_file_paths: [
    "/tmp/temp_pdf_file1.pdf",
    "/tmp/temp_pdf_file2.pdf",
    "/tmp/temp_pdf_file3.pdf",
    "/tmp/temp_pdf_file4.pdf",
  ]
}
```

**log**
To avoid spamming process.stdout, log events are emitted instead.

## Tests
To test that your system satisfies the needed dependencies and that module is functioning correctly execute the command in the pdf-extract module folder
```
cd <project_root>/node_modules/pdf-extract
npm test
```
