var inspect = require('eyes').inspector({maxLength:20000});
var path = require('path');
var should = require('should');
var fs = require('fs');
var async = require('async');

var searchable = require('../lib/searchable.js');

describe('03 Searchable Test', function() {
  it('should extract text from electronic searchable pdf', function(done) {
    this.timeout(10*1000);
    var file_name = 'single_page_searchable.pdf';
    var relative_path = path.join('test_data',file_name);
    var pdf_path = path.join(__dirname, relative_path);
    searchable(pdf_path, function (err, extract) {
      should.not.exist(err);
      should.exist(extract);
      extract.length.should.be.above(20, 'wrong extract output');
      done();
    });
  });
});
