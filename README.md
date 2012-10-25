# Node PDF
Node PDF is a set of tools that takes in PDF files and converts them to usable formats for data processing. The library supports both extracting text from searchable pdf files as well as performing OCR on pdfs which are just scanned images of text

## Dependencies

### Searchable PDF Extract
For electronic pdf files with actual text in them, this module uses the *pdftotext* library to extract the text. Therefore you need to have *pdftotext* available on your path

On OSX you can get the pdftotext utility via the xpdf forumula in Homebrew 
`brew install xpdf`
Check that pdftotext is available
`which pdftotext`

### OCR
For the OCR to work, you need to have the tesseract-ocr binaries available on your path. If you only need to handle ASCII characters, the accuracy of the OCR process can be increased by limiting the tesseract output. To do this copy the included *alphanumeric* file into the *tess-data* folder on your system. 

For OS-X with tesseract install via homebrew
`brew install tesseract`
```
cd <root of this project>
cp "lib/alphanumeric" "/usr/local/Cellar/tesseract/3.01/share/tessdata/configs/alphanumeric"
```


## Usage
## Tests
To test that your system satisfies the needed dependencies and that module is functioning correctly execute the command
`npm test`
