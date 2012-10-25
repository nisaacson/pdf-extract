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
var inspect = require('eyes').inspector({maxLength:20000});
var path = require('path');
var temp = require('temp');
var exec = require('child_process').exec;
var fs = require('fs');
var walk = require('walk');
var async = require('async');
var rimraf = require('rimraf');

var raw = require('./lib/raw');
var electronic = require('./lib/electronic');

/**
 * To process a pdf, pass in the absolute path to the pdf file on disk
 *
 * @return {Array} text_pages is an array of strings, where each string is the
 * extracted text for the matching page index in the pdf document
 * @return callback(<error if exists>, text_pages)
 */
module.exports = function(pdf_path, options, callback) {
  if (!pdf_path) {
    return callback('error, you must pass a path to pdf file as the first parameter', null);
  }
  if (!options) {
    return callback('no options supplied. You must supply an options object with the type field set', null);
  }
  if (!options.hasOwnProperty('type') || ! options.type) {
    return callback('error, you must specify the type of extraction you wish to perform in the options object. Allowed values are "ocr" or "text"', null);
  }
  if (!callback) {
    return callback('error, no callback provided');
  }
  fs.exists(pdf_path, function (exists) {
    if (!exists) {
      return callback('error, no file exists at the path you specified for the first paramter: ' + pdf_path, null);
    }
    if (options.type === 'ocr') {
      delete options.type;
      return raw(pdf_path, options, callback);
    }
    else if (options.type === 'text') {
      delete options.type;
      return electronic(pdf_path, options, callback);
    }
    else {
      return callback('error, unknown extraction type passed as second paramater. Allowed values are "ocr" or "text"', null);
    }
  });
}