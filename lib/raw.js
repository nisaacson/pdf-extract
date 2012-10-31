/**
 * Module which extracts the text out of an electronic pdf file
 * This module can handle multi-page pdf files

 */
var inspect = require('eyes').inspector({maxLength:20000});
var sys = require('sys');
var events = require('events');
var fs = require('fs');
var async = require('async');
var split = require('./split.js');
var convert = require('./convert.js');
var ocr = require('./ocr.js');
var rimraf = require('rimraf');

/**
 * @param pdf_path path to the pdf file on disk
 *
 * @return {Array} text_pages an array of the extracted text where
 *   each entry is the text for the page at the given index
 * @return callback(<maybe error>, text_pages)
 */
function Raw(){
  if(false === (this instanceof Raw)) {
    return new Raw();
  }
}
sys.inherits(Raw, events.EventEmitter);
module.exports = Raw;

Raw.prototype.process = function(pdf_path, options) {
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
      if (err) {
        self.emit('error', { error: err, pdf_path: pdf_path});
        return;
      }
      if (!output) {
        err = 'no files returned from split';
        self.emit('error', { error: err, pdf_path: pdf_path});
        return;
      }
      
      split_output = output;
      var pdf_files = output.files;
      if (!pdf_files || pdf_files.length == 0) {
        err = 'error, no pages where found in your pdf document';
        self.emit('error', { error: err, pdf_path: pdf_path});
        return;
      }
      var index = 0;
      var num_pages = pdf_files.length
      async.forEachSeries(
        pdf_files,
        // extract the text for each page via ocr
        function (pdf_file, cb) {
          var quality = 300;
          if (options.hasOwnProperty('quality') && options.quality) {
            quality = options.quality;
          }
          convert(pdf_file.file_path, quality, function (err, tif_path) {
            if (err) { return cb(err); }
            ocr(tif_path, function (err, extract) {
              fs.unlink(tif_path, function (tif_cleanup_err, reply) {
                if (tif_cleanup_err) {
                  err += ', error removing temporary tif file: "'+tif_cleanup_err+'"';
                }
                if (err) { return cb(err); }
                if (err) { return cb(err); }
                index++;
                inspect('page ' + index + ' of ' +num_pages + ' complete');
                self.emit('page', { text: extract, index: index, num_pages: num_pages, pdf_path: pdf_path});
                text_pages.push(extract);
                cb();
              });
            });
          });
        },
        function (err) {
          if (!err) {
            self.emit('complete', { text_pages: text_pages, pdf_path: pdf_path});
            return;
          }
          self.emit('error', { error: err, pdf_path: pdf_path});
          if (!split_output || !split_output.folder) { return }
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
