/**
 * Module which extracts the text out of an electronic pdf file
 * This module can handle multi-page pdf files
 */
var fs = require('fs');
var async = require('async');
var split = require('./split.js');
var searchable = require('./searchable.js');

/**
 * @param pdf_path path to the pdf file on disk
 *
 * @return {Array} text_pages an array of the extracted text where
 *   each entry is the text for the page at the given index
 * @return callback(<maybe error>, text_pages)
 */
module.exports = function(pdf_path, callback) {
  var text_pages = [];
  fs.exists(pdf_path, function (exists) {
    if (!exists) { return callback('no file exists at the path you specified: ' + pdf_path); }
    // split the pdf into single page pdf files
    split(pdf_path, function (err, files) {
      if (err) { return callback(err); }
      if (!files || files.length == 0) {
        return callback('error, no pages where found in your pdf document at path: ' + pdf_path);
      }
      async.forEach(
        files,
        // extract the text for each page
        function (file, cb) {
          searchable(file.file_path, function (err, extract) {
            text_pages.push(extract);
            cb();
          });
        },
        function (err) {
          if (err) { return callback(err); }
          return callback(null, text_pages);
        }
      );
    });
  });
}
