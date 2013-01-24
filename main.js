/**
 * @title Node PDF main.js
 * Node PDF allows you to convert pdf files into raw text. The library supports
 * text extraction from electronic searchable pdfs.
 *
 * In addition, the library supports OCR text extract from pdfs which just
 * contain scanned images via the tesseract-ocr engine
 *
 * Multi-page pdfs are supported for both searchable and image pdfs.
 * The library returns an array of strings where the string at a given
 * index in the output array cooresponds the page in the input pdf document
 *
 * @author Noah Isaacson
 * @date 2012-10-26
 */
var path = require('path');
var temp = require('temp');
var exec = require('child_process').exec;
var fs = require('fs');
var walk = require('walk');
var async = require('async');
var rimraf = require('rimraf');

var Raw = require('./lib/raw');
var Electronic = require('./lib/electronic');

/**
 * To process a pdf, pass in the absolute path to the pdf file on disk

 * @param {Object} params should have the following fields set
 * @param {String} params.pdf_path the absolute path to the pdf file on disk
 * @param {Boolean} params.clean true if you want the temporary single page pdfs
 * @param {Boolean} options.type must be either "ocr" or "text"
 *
 * @return {Array} text_pages is an array of strings, where each string is the
 * extracted text for the matching page index in the pdf document
 * @return {Processor} a processor object which will emit events as they occur
 */
module.exports = function(pdf_path, options, cb) {
  var err;
  var processor = new Raw();
  if (!'pdf_path') {
    err = 'you must supply a pdf path as the first parameter'
    return cb(err);
  }
  if (!options) {
    err =  'no options supplied. You must supply an options object with the "type" field set'
    return cb(err);
  }
  if (!options.hasOwnProperty('type') || ! options.type) {
    err  ='error, you must specify the type of extraction you wish to perform in the options object. Allowed values are "ocr" or "text"';
    return cb(err);
  }
  if (options.type === 'ocr') {
    processor = new Raw();
  }
  else if (options.type === 'text') {
    processor = new Electronic();
  }
  else {
    err  ='error, you must specify the type of extraction you wish to perform in the options object. Allowed values are "ocr" or "text"';
    return cb(err);;
  }
  fs.exists(pdf_path, function (exists) {
    if (!exists) {
      err = 'no file exists at the path you specified';
      return cb(err);
    }
    processor.process(pdf_path, options);
    cb();
  });
  return processor;
}
