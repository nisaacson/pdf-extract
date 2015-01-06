var path = require('path')
var should = require('should')
var assert = require('assert')
var fs = require('fs')
var ocr = require('../lib/ocr.js')
var inspect = require('eyespect').inspector()

describe('06 OCR Test', function() {

  this.timeout('100s')
  this.slow('20s')

  it('should extract text from tif file via tesseract ocr', function(done) {
    var file_name = 'single_page_raw.tif'
    var relative_path = path.join('test_data', file_name)
    var tif_path = path.join(__dirname, relative_path)
    fs.exists(tif_path, function (exists) {
      assert.ok(exists, 'tif file does not exist like it should at path: ' + tif_path)
      ocr(tif_path, function (err, extract) {
        should.not.exist(err)
        should.exist(extract)
        extract.length.should.be.above(20, 'wrong ocr output')
        done()
      })
    })
  })

  it.only('should ocr tif file using custom language file', function(done) {
    var file_name = 'single_page_raw.tif'
    var relative_path = path.join('test_data', file_name)
    var tif_path = path.join(__dirname, relative_path)
    fs.exists(tif_path, function (exists) {
      assert.ok(exists, 'tif file does not exist like it should at path: ' + tif_path)
      var options = [
        '-psm 1',
        '-l dia',
        'alphanumeric'
      ]
      ocr(tif_path, options, function (err, extract) {
        should.not.exist(err)
        should.exist(extract)
        inspect(extract, 'extracted text')

        var asciiOnly = /[ -~]/.test(extract)
        inspect(asciiOnly, 'ascii only')
        asciiOnly.should.be.true
        extract.length.should.be.above(20, 'wrong ocr output')
        done()
      })
    })
  })

})
