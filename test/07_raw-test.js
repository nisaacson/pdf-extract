/**
 * Tests ocr extraction for a multi-page raw scan pdf file
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
describe('Multipage raw test', function() {
  it('should extract array of text pages from multipage raw scan pdf', function(done) {
    console.log();
    inspect('Please be patient, this make take a minute or more to complete');
    this.timeout(120*1000);
    var file_name = 'multipage_raw.pdf';
    var relative_path = path.join('test_data',file_name);
    var pdf_path = path.join(__dirname, relative_path);
    var options = {
      type: 'ocr',
      clean: false // keep the temporary single page pdf files
    };
    var complete_callback = function(err, text_pages) {
      should.not.exist(err);
      should.exist(text_pages);
      text_pages.length.should.equal(2, 'wrong number of pages after extracting from mulitpage searchable pdf with name: ' + file_name);
      for (var index in text_pages) {
        var page = text_pages[index];
        page.length.should.be.above(0, 'no text on page at index: ' + index);
      }
    }
    var processor = pdf(pdf_path, options, complete_callback);
    processor.on('complete', function(data) {
      data.should.have.property('text_pages');
      data.should.have.property('pdf_path');
      data.should.have.property('single_page_pdf_file_paths');
      data.text_pages.length.should.eql(2, 'wrong number of pages after extracting from mulitpage searchable pdf with name: ' + file_name);
      page_event_fired.should.be.true;
      async.forEach(
        data.single_page_pdf_file_paths,
        function (file_path, cb) {
          fs.exists(file_path, function (exists) {
            exists.should.be.true;
            cb();
          });
        },
        function (err) {
          should.not.exist(err, 'error in raw processing: ' + err);
          done();
        }
      );
    });
    var page_event_fired = false;
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

