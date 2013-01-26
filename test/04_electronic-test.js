/**
 * Tests extraction for a multi-page searchable pdf file
 */
var inspect = require('eyespect').inspector({maxLength:20000});
var path = require('path');
var should = require('should');
var assert = require('assert');
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
describe('04 Multipage searchable test', function() {
  it('should extract array of text pages from multipage  searchable pdf', function(done) {
    this.timeout(10*1000);
    this.slow(2*1000);
    var file_name = 'multipage_searchable.pdf';
    var relative_path = path.join('test_data',file_name);
    var pdf_path = path.join(__dirname, relative_path);
    var options = {
      type: 'text',
    };
    var processor = pdf(pdf_path, options, function (err) {
      should.not.exist(err);
    });

    processor.on('complete', function(data) {
      data.should.have.property('text_pages');
      data.should.have.property('single_page_pdf_file_paths');
      data.single_page_pdf_file_paths.length.should.equal(8,'wrong number of single_page_pdf_file_paths returned');
      data.should.have.property('pdf_path');
      data.text_pages.length.should.equal(8, 'wrong number of pages after extracting from mulitpage searchable pdf with name: ' + file_name);
      assert.ok(page_event_fired, 'never received a "page" event like we should have');
      for (var index in data.text_pages) {
        var page = data.text_pages[index];
        page.length.should.be.above(0, 'no text on page at index: ' + index);
      }

      done();
    });
    var page_event_fired = false;
    processor.on('error', function(data) {
      false.should.be.true('error occurred during processing');
    });
    processor.on('page', function(data) {
      page_event_fired = true;
      data.should.have.property('index');
      data.should.have.property('pdf_path');
      data.should.have.property('text');
      data.pdf_path.should.eql(pdf_path);
      data.text.length.should.above(0);
    });
  });
});
