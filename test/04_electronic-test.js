/**
 * Tests extraction for a multi-page searchable pdf file
 */
var inspect = require('eyes').inspector({maxLength:20000});
var path = require('path');
var should = require('should');
var fs = require('fs');
var async = require('async');

var pdf = require('../main.js');

var get_desired_text = function(text_file_name, callback) {
  var relative_path = path.join('test_data',text_file_name);
  var text_file_path = path.join(__dirname, relative_path);
  fs.readFile(text_file_path, 'utf8', function (err, reply) {
    should.not.exist(err);
    should.exist(reply);
    return callback(err, reply);
  });
}
describe('Multipage searchable test', function() {
  it('should extract array of text pages from multipage  searchable pdf', function(done) {
    this.timeout(10*1000);
    var file_name = 'multipage_searchable.pdf';
    var relative_path = path.join('test_data',file_name);
    var pdf_path = path.join(__dirname, relative_path);
    pdf(pdf_path, 'text', function (err, text_pages) {
      should.not.exist(err);
      should.exist(text_pages);
      text_pages.length.should.equal(8, 'wrong number of pages after extracting from mulitpage searchable pdf with name: ' + file_name);
      done();
    });
  });
});

