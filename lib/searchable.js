/**
 * Module which extracts text from electronic searchable pdf files.
 * Requires the "pdftotext" binary be installed on the system and accessible in the
 * current path
 */
var path = require('path');
var temp = require('temp');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');
var walk = require('walk');
var async = require('async');
var rimraf = require('rimraf');

/**
 * @param pdf_path path to the single page searchable pdf file on disk
 * This function buffers all the output from stdout and sends it back as a string.
 * Since we only handle single pages of pdf text here the amount of text is small
 * and therefore we don't need to use a stream
 *
 * @return {ReadStream} the entire output from stdout
 * @return callback(<maybe error>, stdout)
 */
module.exports = function(pdf_path, callback) {
  confirm_file_exists(pdf_path, function (err) {
    if (err) { return callback(err); }
    var child = spawn('pdftotext', ['-layout', pdf_path, '-']);
    var stdout = child.stdout;
    var stderr = child.stderr;
    var output = '';
    stdout.setEncoding('utf8');
    stderr.setEncoding('utf8');
    stderr.on('data', function(data) {
      return callback(data, null);
    });
    // buffer the stdout output
    stdout.on('data', function(data) {
      output += data;
    });
    stdout.on('close', function(data) {
      return callback(null, output);
    });
  });
}


/**
 * Non-recursive find of all the files in a given directory that end with *.pdf
 * @return {Array} files is an array of the absolute paths to the single
 * page pdf files. Each entry in this array is an object with fields
 * <file_name> and <file_path> set
 * @return callback(<maybe error>, files)
 */
function get_pdfs_in_directory(directory_path, callback) {
  var file_paths = [];
  var files = null;
  var walker = walk.walk(directory_path, { followLinks: false});
  walker.on('file', function(root, stat, next) {
    if (stat.name.match(/\.pdf$/i)) {
      var file_path = path.join(directory_path, stat.name);
      file_paths.push({file_path: file_path, file_name: stat.name});
      next();
    }
  });
  walker.on('end', function() {
    return callback(null, file_paths);
  });
}

/**
 * Cleanup any single page pdfs on error
 */
function cleanup_directory(directory_path, callback) {
  // only remove the folder at directory_path if it exists
  fs.exists(directory_path, function (exists) {
    if (!exists) {
      return callback();
    }
    rimraf(directory_path, callback);
  });
}

/**
 * @param {String} file_path absolute path to file on disk
 * @return {Function} callback() if file does exist
 * callback(<error message>) if file does not exists
 */
function confirm_file_exists(file_path, callback) {
  fs.exists(file_path, function (exists) {
    if (!exists) {
      return callback('no file at path: ' + file_path);
    }
    return callback();
  });
};