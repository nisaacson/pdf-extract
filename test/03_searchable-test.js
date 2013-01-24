var inspect = require('eyespect').inspector({maxLength:20000});
var path = require('path');
var should = require('should');
var fs = require('fs');
var assert = require('assert');
var async = require('async');
var pathhash = require('pathhash');
var pdf = require('../main');

describe('03 Searchable Test', function() {
  var file_name = 'single_page_searchable.pdf';
  var relative_path = path.join('test_data',file_name);
  var pdf_path = path.join(__dirname, relative_path);
  var hash;
  before(function(done) {
    pathhash(pdf_path, function (err, reply) {
      should.not.exist(err, 'error getting sha1 hash of pdf file at path: ' + pdf_path + '. ' + err);
      should.exist(reply, 'error getting sha1 hash of pdf file at path: ' + pdf_path + '. No hash returned from hashDataAtPath');
      hash = reply;
      done();
    });
  });
  it('should return an error when not passing a type for a searchable pdf', function(done) {
    this.timeout(10*1000);
    this.slow(5*1000);
    var options = {
    }
    pdf(pdf_path, options, function (err, extract) {
      should.exist(err,'error should be returned');
      should.not.exist(extract);
      done();
    });
  });

  it('should extract text from electronic searchable pdf', function(done) {
    this.timeout(10*1000);
    this.slow(5*1000);
    var options = {
      type: 'text'
    }
    var processor = pdf(pdf_path, options, function (err) {
      should.not.exist(err);
    });

    processor.on('error', function (err) {
      should.not.exist(err);
      assert.ok(false, 'error during processing');

    });
    processor.on('complete', function (data) {
      data.should.have.property('text_pages');
      data.should.have.property('hash');
      if (data.hash !== hash) {
        return;
      }
      data.text_pages.length.should.eql(1);
      data.text_pages[0].length.should.be.above(20);
      done();
    });
  });
});
