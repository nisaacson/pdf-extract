var inspect = require('eyes').inspector({maxLength:20000});
var path = require('path');
var should = require('should');
var fs = require('fs');
var async = require('async');

var searchable = require('../lib/searchable.js');

var get_desired_text = function(text_file_name, callback) {
  var relative_path = path.join('test_data',text_file_name);
  var text_file_path = path.join(__dirname, relative_path);
  fs.readFile(text_file_path, 'utf8', function (err, reply) {
    should.not.exist(err);
    should.exist(reply);
    return callback(err, reply);
  });
}
describe('Searchable Test', function() {
  it('should extract text from electronic searchable pdf', function(done) {
    this.timeout(10*1000);
    var file_name = 'single_page_searchable.pdf';
    var relative_path = path.join('test_data',file_name);
    var pdf_path = path.join(__dirname, relative_path);
    searchable(pdf_path, function (err, extract) {
      should.not.exist(err);
      should.exist(extract);
      // make sure the output matches our expectations
      get_desired_text('single_page_searchable.txt', function (err, desired_extract) {
        extract.should.eql(desired_extract, 'wrong extract output');
        done();
      });
    });
  });
});

