/**
 * Module which extracts the text out of an electronic pdf file
 * This module can handle multi-page pdf files
 */
var fs = require('fs');
var async = require('async');

var rimraf = require('rimraf');
var sys = require('sys');
var events = require('events');

var split = require('./split.js');
var searchable = require('./searchable.js');
var pathhash = require('pathhash');


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
  var single_page_pdf_file_paths = [];
  fs.exists(pdf_path, function (exists) {
    var err;
    if (!exists) {
      err = 'no file exists at the path you specified: ' + pdf_path
      self.emit('error', { error: err, pdf_path: pdf_path});
      return
    }
    pathhash(pdf_path, function (err, hash) {
      if (err) {
        err = 'error hashing file at the path you specified: ' + pdf_path + '. ' + err;
        self.emit('error', { error: err, pdf_path: pdf_path});
        return
      }
      // split the pdf into single page pdf files
      split(pdf_path, function (err, output) {
        if (err) {
          self.emit('error', { error: err, pdf_path: pdf_path});
          return
        }


        if (!output) {
          err = 'failed to split pdf file into distinct pages';
          self.emit('error', { error: err, pdf_path: pdf_path});
          return
        }
        split_output = output;
        if (!split_output.hasOwnProperty('files') || split_output.files.length == 0) {
          err = 'no pages where found in your pdf document';
          self.emit('error', { error: err, pdf_path: pdf_path});
          return
        }
        self.emit('log', 'finished splitting pages for file at path ' + pdf_path);
        var files = split_output.files;
        var index = 0;
        async.forEachSeries(
          files,
          // extract the text for each page
          function (file, cb) {
            index++;
            searchable(file.file_path, function (err, extract) {
              text_pages.push(extract);
              var file_path = file.file_path
              single_page_pdf_file_paths.push(file.file_path);
              self.emit('page', { hash: hash, text: extract, index: index, pdf_path: pdf_path});
              cb();
            });
          },
          function (err) {
            if (!err) {
              self.emit('complete', { hash: hash, text_pages: text_pages, pdf_path: pdf_path, single_page_pdf_file_paths: single_page_pdf_file_paths});
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
  });
}