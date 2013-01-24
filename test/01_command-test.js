var inspect = require('eyespect').inspector({maxLength:20000});
var should = require('should');
var async = require('async');
var exec = require('child_process').exec;

describe('01 Command Test', function() {
  it('should have ghostscript (gs) binary on path', function(done) {
    var cmd = 'which gs';
    var child = exec(cmd, function (err, stdout, stderr) {
      should.not.exist(err, 'ghostscript not available. You will not be able to perform ocr and extract text from pdfs with scanned image. To get convert install GhostScript on your system');
      stderr.length.should.equal(0);
      should.exist(stdout);
      stdout.length.should.be.above(8);
      done();
    });
  });
  it('should have pdftotext binary on path', function(done) {
    var cmd = 'which pdftotext';
    var child = exec(cmd, function (err, stdout, stderr) {
      should.not.exist(err, 'pdftotext not available. You will not be able to extract text from electronic searchable pdf files without the pdftotext library installed on your system');
      stderr.length.should.equal(0);
      should.exist(stdout);
      stdout.length.should.be.above(8);
      done();
    });
  });

  it('should have tesseract binary on path', function(done) {
    var cmd = 'which tesseract';
    var child = exec(cmd, function (err, stdout, stderr) {
      should.not.exist(err, 'tesseract not available. You will not be able to perform ocr and extract from pdfs with scanned images.');
      stderr.length.should.equal(0);
      should.exist(stdout);
      stdout.length.should.be.above(8);
      done();
    });
  });

});