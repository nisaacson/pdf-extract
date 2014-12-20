/**
 * Tests ocr extraction for a multi-page raw scan pdf file
 */
var assert = require('assert');
var inspect = require('eyespect').inspector({maxLength:20000});
var path = require('path');
var should = require('should');
var fs = require('fs');
var async = require('async');

var pdf = require('../main.js');
var pathHash = require('pathhash');

var get_desired_text = function(text_file_name, callback) {
  var relative_path = path.join('test_data',text_file_name);
  var text_file_path = path.join(__dirname, relative_path);
  fs.readFile(text_file_path, 'utf8', function (err, reply) {
    should.not.exist(err);
    should.exist(reply);
    return callback(err, reply);
  });
}
describe('07 Multipage raw test', function() {
  var file_name = 'multipage_raw.pdf';
  var relative_path = path.join('test_data',file_name);
  var pdf_path = path.join(__dirname, relative_path);
  var options = {
    type: 'ocr',
    clean: false // keep the temporary single page pdf files
  };

  var hash;
  before(function(done) {
    pathHash(pdf_path, function (err, reply) {
      should.not.exist(err, 'error getting sha1 hash of pdf file at path: ' + pdf_path + '. ' + err);
      should.exist(reply, 'error getting sha1 hash of pdf file at path: ' + pdf_path + '. No hash returned from hashDataAtPath');
      hash = reply;
      done();
    });
  });

  it('should extract array of text pages from multipage raw scan pdf', function(done) {
    console.log('\nPlease be patient, this test make take a minute or more to complete');
    this.timeout(240*1000);
    this.slow(120*1000);
    var processor = pdf(pdf_path, options, function (err) {
      should.not.exist(err);
    });
    processor.on('complete', function(data) {
      data.should.have.property('text_pages');
      data.should.have.property('pdf_path');
      data.should.have.property('single_page_pdf_file_paths');
      data.text_pages.length.should.eql(2, 'wrong number of pages after extracting from mulitpage searchable pdf with name: ' + file_name);

      assert.ok(page_event_fired, 'no "page" event fired');
      async.forEach(
        data.single_page_pdf_file_paths,
        function (file_path, cb) {
          fs.exists(file_path, function (exists) {
            assert.ok(exists,'no single page pdf file exists at the path: ' + file_path);
            cb();
          });
        },
        function (err) {
          should.not.exist(err, 'error in raw processing: ' + err);
          done();
        }
      );
    });
    processor.on('log', function(data) {
      inspect(data, 'log data');
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

  it('should ocr raw scan using custom language in ocr_flags', function (done) {
    this.timeout(240*1000);
    this.slow(120*1000);
    var ocr_flags = [
      '-psm 1',
      '-l dia',
      'alphanumeric'
    ];

    inspect('Please be patient, this test make take a minute or more to complete');

    options.ocr_flags = ocr_flags;
    var processor = pdf(pdf_path, options, function (err) {
      should.not.exist(err);
    });
    processor.on('error', function (err){
      should.not.exist(err);
      assert.ok(false, 'error during raw processing');
    });
    processor.on('log', function(data) {
      inspect(data, 'log event');
    });

    processor.on('complete', function (data) {
      data.should.have.property('text_pages');
      data.should.have.property('hash');
      data.should.have.property('pdf_path');
      data.should.have.property('single_page_pdf_file_paths');
      if (hash !== data.hash) {
        return;
      }
      data.text_pages.length.should.eql(2, 'wrong number of pages after extracting from mulitpage searchable pdf with name: ' + file_name);
      async.forEach(
        data.single_page_pdf_file_paths,
        function (file_path, cb) {
          fs.exists(file_path, function (exists) {
            assert.ok(exists, 'single page pdf file not found at path: ' + file_path);
            cb();
          });
        },
        function (err) {
          should.not.exist(err, 'error in raw processing: ' + err);
          done();
        }
      );
    });
  });
});
