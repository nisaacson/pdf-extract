/**
 * Module which extracts text from electronic searchable pdf files.
 * Requires the "pdftotext" binary be installed on the system and accessible in the
 * current path
 */
var spawn = require('child_process').spawn
var fs = require('fs')
var errs = require('errs')

module.exports = function(pdf_path, options, callback) {
  if(options === null) { options = {} }
  if(options.layout === null) { options.layout = true }
  confirm_file_exists(pdf_path, function (err) {
    if (err) { return callback(err) }
    var child = spawn('pdftotext', (options.layout ? ['-layout'] : []).concat([pdf_path, '-']))
    var stdout = ''
    var stderr = ''
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', function(data) {
      stderr += data
    })
    // buffer the stdout output
    child.stdout.on('data', function(data) {
      stdout += data
    })
    child.on('exit', function(code) {
      if (code !== 0) {
        err = errs.create({message: 'pdftotext failed', stdout: stdout, stderr: stderr})
      }
      return callback(null, stdout)
    })
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
