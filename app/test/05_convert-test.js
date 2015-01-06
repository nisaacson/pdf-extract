var path = require('path')
var should = require('should')
var assert = require('assert')
var fs = require('fs')
var convert = require('../lib/convert.js')

describe.skip('05 Convert Test', function() {
  this.timeout('10s')
  this.slow('2s')
  it('should convert raw single page pdf to tif file', function(done) {
    var file_name = 'single_page_raw.pdf'
    var relative_path = path.join('test_data', file_name)
    var pdf_path = path.join(__dirname, relative_path)
    fs.exists(pdf_path, function (exists) {
      assert.ok(exists, 'file does not exist like it should at path: ' + pdf_path)
      convert(pdf_path, function (err, tif_path) {
        should.not.exist(err)
        should.exist(tif_path)
        fs.exists(tif_path, function (exists) {
          assert.ok(exists, 'til file does not exist like it should at path: ' + tif_path)
          done()
        })
      })
    })
  })
})
