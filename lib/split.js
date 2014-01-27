/**
 * Module which splits multi-pag pdfs into single pages
 * Requires the pdftk binary be installed on the system and accessible in the
 * current path
 */
var path = require('path');
var temp = require('temp');
var exec = require('child_process').exec;
var fs = require('fs');
var walk = require('walk');
var async = require('async');
var rimraf = require('rimraf');

/**
 * @param pdf_path path to the pdf file on disk
 *
 * @see get_pdfs_in_directory
 * @return {Object} an object with the fields "folder" and "files" set
 *   files is an array of the absolute paths to the single page pdf files.
 *
 *   Each entry in this array is an object with fields
 *    <file_name> and <file_path> set
 *
 * @return callback(<maybe error>, output_paths)
 */
module.exports = function(pdf_path, callback) {
  confirm_file_exists(pdf_path, function (err) {
    if (err) { return callback(err); }

    var output_dir = temp.path({},'pdf_pages');
    fs.mkdir(output_dir, function(err) {
      if (err) { return callback(err, null); }
      // name the files with the upload id and a digit string
      // example: "507c3e55c786e2aa6f000005-page00001.pdf"
      var output_name = 'page%05d.pdf"';
      var output_path = path.join(output_dir, output_name);
      var cmd = 'pdftk "'+pdf_path+'" burst output "'+ output_path;
      var child = exec(cmd, function (err, stdout, stderr) {
        if (err) {
          var output_err = {
            message: 'an error occurred while splitting pdf into single pages with the pdftk burst command',
            error: err
          }
          callback(output_err, null);
          return;
        }
        remove_doc_data(function (err, reply) {
          if (err) { return callback(err); }
          return get_pdfs_in_directory(output_dir, callback);
        });
      });
    });
  });
}



/**
 * Non-recursive find of all the files in a given directory that end with *.pdf
 * @return {Object} output an object with the fields "folder" and "files" set
 *   files is an array of the absolute paths to the single page pdf files.
 *
 *   Each entry in this array is an object with fields
 *    <file_name> and <file_path> set
 *
 * @return callback(<maybe error>, output)
 */
function get_pdfs_in_directory(directory_path, callback) {
  var file_paths = [];
  var files = null;
  var walker = walk.walk(directory_path, { followLinks: false});
  walker.on('file', function(root, stat, next) {
    if (stat.name.match(/\.pdf$/i)) {
      var file_path = path.join(directory_path, stat.name);
      file_paths.push({file_path: file_path, file_name: stat.name});
    }
    next();
  });


  walker.on('end', function() {
    file_paths.sort(function (a,b) {
      if (a.file_name < b.file_name) {
        return -1;
      }
      if (a.file_name == b.file_name) {
        return 0;
      }
      return 1;
    });
    var output = {
      folder: directory_path,
      files: file_paths
    }
    return callback(null, output);
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

/**
 * pdftk creates a file called doc_data.txt during the burst split process.
 * This file is not needed so remove it now
 */
function remove_doc_data(callback) {
  var folder = path.join(__dirname, '..');
  var doc_data_path = path.join(folder, 'doc_data.txt');
  fs.exists(doc_data_path, function (exists) {
    if (!exists) {
      return callback();
    }
    fs.unlink(doc_data_path, callback);
  });
}
