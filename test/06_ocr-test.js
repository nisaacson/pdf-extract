var inspect = require('eyes').inspector({maxLength:20000});
var path = require('path');
var should = require('should');
var fs = require('fs');
var ocr = require('../lib/ocr.js');

var get_desired_text = function(text_file_name, callback) {
  var relative_path = path.join('test_data',text_file_name);
  var text_file_path = path.join(__dirname, relative_path);
  fs.readFile(text_file_path, 'utf8', function (err, reply) {
    should.not.exist(err);
    should.exist(reply);
    return callback(err, reply);
  });
}
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
        get_desired_text('single_page_raw.txt', function (err, desired_extract) {
          extract.should.eql(desired_extract, 'wrong ocr output');
          done();
        });
      });
    });
  });
});

