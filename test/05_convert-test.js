var inspect = require('eyespect').inspector({maxLength:20000});
var path = require('path');
var should = require('should');
var assert = require('assert');
var fs = require('fs');
var async = require('async');

var convert = require('../lib/convert.js');

var get_desired_text = function(text_file_name, callback) {
  var relative_path = path.join('test_data',text_file_name);
  var text_file_path = path.join(__dirname, relative_path);
  fs.readFile(text_file_path, 'utf8', function (err, reply) {
    should.not.exist(err);
    should.exist(reply);
    return callback(err, reply);
  });
}
describe('05 Convert Test', function() {
  it('should convert raw single page pdf to tif file', function(done) {
    return done();
    this.timeout(10*1000);
    var file_name = 'single_page_raw.pdf';
    var relative_path = path.join('test_data',file_name);
    var pdf_path = path.join(__dirname, relative_path);
    fs.exists(pdf_path, function (exists) {
      assert.ok(exists, 'file does not exist like it should at path: ' + pdf_path);
      convert(pdf_path, function (err, tif_path) {
        should.not.exist(err);
        should.exist(tif_path);
        fs.exists(tif_path, function (exists) {
          assert.ok(exists, 'til file does not exist like it should at path: ' + tif_path);
          done();
        });
      });
    });
  });
});
