var path = require('path')
var should = require('should')
var assert = require('assert')
var pdf = require('../main.js')

describe('04 Multipage searchable test', function() {
  this.timeout('10s')
  this.slow('2s')
  it('should extract array of text pages from multipage  searchable pdf', function(done) {
    var file_name = 'multipage_searchable.pdf'
    var relative_path = path.join('test_data', file_name)
    var pdf_path = path.join(__dirname, relative_path)
    var options = {
      type: 'text'
    }
    var processor = pdf(pdf_path, options, function (err) {
      should.not.exist(err)
    })

    processor.on('complete', function(data) {
      data.should.have.property('text_pages')
      data.should.have.property('single_page_pdf_file_paths')
      data.single_page_pdf_file_paths.length.should.equal(8, 'wrong number of single_page_pdf_file_paths returned')
      data.should.have.property('pdf_path')
      data.text_pages.length.should.equal(8, 'wrong number of pages after extracting from mulitpage searchable pdf with name: ' + file_name)
      assert.ok(page_event_fired, 'never received a "page" event like we should have')
      data.text_pages.forEach(function(page, index) {
        page.length.should.be.above(0, 'no text on page at index: ' + index)
      })

      done()
    })
    var page_event_fired = false
    processor.on('error', function() {
      throw new Error('error occurred during processing')
    })
    processor.on('page', function(data) {
      page_event_fired = true
      data.should.have.property('index')
      data.should.have.property('pdf_path')
      data.should.have.property('text')
      data.pdf_path.should.eql(pdf_path)
      data.text.length.should.above(0)
    })
  })
})
