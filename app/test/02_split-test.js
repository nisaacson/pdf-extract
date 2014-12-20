var inspect = require('eyespect').inspector({maxLength:20000});
var path = require('path');
var should = require('should');
var assert = require('assert')
var fs = require('fs');
var async = require('async');
var split = require('../lib/split.js');

describe('02 Split Test', function() {
  it('should split multi-page pdf in single page pdf files', function(done) {
    this.timeout(10*1000);
    this.slow(2*1000);
    var file_name = 'multipage_searchable.pdf';
    var relative_path = path.join('test_data',file_name);
    var pdf_path = path.join(__dirname, relative_path);
    split(pdf_path, function (err, output) {
      should.not.exist(err);
      should.exist(output);
      output.should.have.property('folder');
      output.should.have.property('files');
      var files = output.files;
      files.length.should.equal(8, 'wrong number of pages after splitting searchable pdf with name: ' + file_name);
      // make sure each file entry in files exists
      async.forEach(
        files,
        function (file, cb) {
          file.should.have.property('file_name');
          file.should.have.property('file_path');
          fs.exists(file.file_path, function (exists) {
            assert.ok(exists, 'file does not exist like it should at path: ' + file.file_path);
            cb();
          });
        },
        function (err) {
          should.not.exist(err);
          done();
        }
      );
    });
  });

  it('should split single page pdf into a new single page pdf files', function(done) {
    this.timeout(10*1000);
    this.slow(2*1000);
    var file_name = 'single_page_searchable.pdf';
    var relative_path = path.join('test_data',file_name);
    var pdf_path = path.join(__dirname, relative_path);
    split(pdf_path, function (err, output) {
      should.not.exist(err);
      should.exist(output);
      output.should.have.property('folder');
      output.should.have.property('files');
      var files = output.files;
      files.length.should.equal(1, 'wrong number of pages after splitting searchable pdf with name: ' + file_name);
      // make sure each file entry in files exists
      async.forEach(
        files,
        function (file, cb) {
          file.should.have.property('file_name');
          file.should.have.property('file_path');
          fs.exists(file.file_path, function (exists) {
            assert.ok(exists, 'file does not exist like it should at path: ' + file.file_path);
            cb();
          });
        },
        function (err) {
          should.not.exist(err);
          done();
        }
      );
    });
  });
});