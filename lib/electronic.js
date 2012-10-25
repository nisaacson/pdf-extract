/**
 * Module which extracts the text out of an electronic pdf file
 * This module can handle multi-page pdf files
 */
var fs = require('fs');
var async = require('async');
var split = require('./split.js');
var searchable = require('./searchable.js');
var rimraf = require('rimraf');
var sys = require('sys');
var events = require('events');

function Electronic(){
  if(false === (this instanceof Electronic)) {
    return new Electronic();
  }
}
sys.inherits(Electronic, events.EventEmitter);
module.exports = Electronic;


/**
 * @param pdf_path path to the pdf file on disk
 *
 * @return {Array} text_pages an array of the extracted text where
 *   each entry is the text for the page at the given index
 * @return callback(<maybe error>, text_pages)
 */
Electronic.prototype.process = function(pdf_path, options) {
  var self = this;
  var text_pages = [];
  var split_output;
  fs.exists(pdf_path, function (exists) {
    if (!exists) {
      var err = 'no file exists at the path you specified: ' + pdf_path
      self.emit('error', { error: err, pdf_path: pdf_path});
      return
    }
    // split the pdf into single page pdf files
    split(pdf_path, function (err, output) {
      split_output = output;
      var files = split_output.files
      if (err) {
        self.emit('error', { error: err, pdf_path: pdf_path});
        return
      }
        
      if (!files || files.length == 0) {
        err = 'no pages where found in your pdf document';
        self.emit('error', { error: err, pdf_path: pdf_path});
        return
      }
      var index = 0;
      async.forEach(
        files,
        // extract the text for each page
        function (file, cb) {
          index++;
          searchable(file.file_path, function (err, extract) {
            text_pages.push(extract);
            self.emit('page', { text: extract, index: index, pdf_path: pdf_path});
            cb();
          });
        },
        function (err) {
          if (!err) {
            self.emit('complete', { text_pages: text_pages, pdf_path: pdf_path});
            return;
          }
          self.emit('error', { error: err, pdf_path: pdf_path});
          if (!split_output || ! split_output.folder) { return }
          fs.exists(split_output.folder, function (exists) {
            if (!exists) { return }
            var remove_cb = function() {}
            rimraf(split_output.folder, remove_cb);
          });
        }
      );
    });
  });
}
