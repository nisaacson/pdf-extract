/**
 * Module which splits multi-pag pdfs into single pages
 * Requires the pdftk binary be installed on the system and accessible in the
 * current path
 */
var path = require('path')
var temp = require('temp')
var exec = require('child_process').exec
var fs = require('fs')
var walk = require('walk')
var errs = require('errs')

module.exports = function(pdf_path, callback) {
  confirm_file_exists(pdf_path, function (err) {
    if (err) { return callback(err) }

    var output_dir = temp.path({}, 'pdf_pages')
    fs.mkdir(output_dir, function(err) {
      if (err) { return callback(err, null) }
      // name the files with the upload id and a digit string
      // example: "507c3e55c786e2aa6f000005-page00001.pdf"
      var output_name = 'page%05d.pdf"'
      var output_path = path.join(output_dir, output_name)
      var cmd = 'pdftk "' + pdf_path + '" burst output "' + output_path
      exec(cmd, function (err, stdout, stderr) {
        if (err) {
          err = errs.merge({
            message: 'an error occurred while splitting pdf into single pages with the pdftk burst command',
            command: cmd,
            stdout: stdout,
            stderr: stderr
          })
          return callback(err, null)
        }
        remove_doc_data(function (err) {
          if (err) { return callback(err) }
          return get_pdfs_in_directory(output_dir, callback)
        })
      })
    })
  })
}



function get_pdfs_in_directory(directory_path, callback) {
  var file_paths = []
  var walker = walk.walk(directory_path, { followLinks: false})
  walker.on('file', function(root, stat, next) {
    if (stat.name.match(/\.pdf$/i)) {
      var file_path = path.join(directory_path, stat.name)
      file_paths.push({file_path: file_path, file_name: stat.name})
    }
    next()
  })


  walker.on('end', function() {
    file_paths.sort(function (a, b) {
      if (a.file_name < b.file_name) {
        return -1
      }
      if (a.file_name === b.file_name) {
        return 0
      }
      return 1
    })
    var output = {
      folder: directory_path,
      files: file_paths
    }
    return callback(null, output)
  })
}


function confirm_file_exists(file_path, callback) {
  fs.exists(file_path, function (exists) {
    if (!exists) {
      return callback('no file at path: ' + file_path)
    }
    return callback()
  })
}

function remove_doc_data(callback) {
  var folder = path.join(__dirname, '..')
  var doc_data_path = path.join(folder, 'doc_data.txt')
  fs.exists(doc_data_path, function (exists) {
    if (!exists) {
      return callback()
    }
    fs.unlink(doc_data_path, callback)
  })
}
