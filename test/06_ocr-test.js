var inspect = require('eyes').inspector({maxLength:20000});
var path = require('path');
var should = require('should');
var fs = require('fs');
var ocr = require('../lib/ocr.js');

describe('OCR Test', function() {
  it('should extract text from tif file via tesseract ocr', function(done) {
    this.timeout(10*1000);
    var file_name = 'single_page_raw.tif';
    var relative_path = path.join('test_data',file_name);
    var tif_path = path.join(__dirname, relative_path);
    fs.exists(tif_path, function (exists) {
      exists.should.be.true;
      ocr(tif_path, function (err, extract) {
        should.not.exist(err);
        should.exist(extract);
        extract.length.should.be.above(20, 'wrong ocr output');
        done();
      });
    });
  });

  it('should ocr tif file using custom language file', function(done) {
    this.timeout(10*1000);
    var file_name = 'single_page_raw.tif';
    var relative_path = path.join('test_data',file_name);
    var tif_path = path.join(__dirname, relative_path);
    fs.exists(tif_path, function (exists) {
      exists.should.be.true;
      var options = [
        'psm 1',
        '-l dia',
        'alphanumeric'
      ]
      ocr(tif_path, options, function (err, extract) {
        should.not.exist(err);
        should.exist(extract);
        extract.length.should.be.above(20, 'wrong ocr output');
        done();
      });
    });
  });

});

