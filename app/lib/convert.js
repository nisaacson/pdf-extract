/**
 * Converts a pdf file at a given path to a tiff file with
 * the GraphicsMagick command "convert"
 */
var temp = require('temp')
var exec = require('child_process').exec
var errs = require('errs')
var fs = require('fs')


module.exports = function convert(input_path, quality, callback) {
  // options is an optional parameter
  if (!callback || typeof callback !== "function") {
    callback = quality   // callback must be the second parameter
    quality = null
  }

  fs.exists(input_path, function (exists) {
    if (!exists) { return callback('error, no file exists at the path you specified: ' + input_path) }
    // get a temp output path

    var output_path = temp.path({prefix: 'tif_output', suffix: '.tif'})
    // var output_path = path.join(__dirname,'test/test_data/single_page_raw.tif')
    if (quality) {
      if (typeof quality !== 'string' && typeof quality !== 'number') {
        return callback('error, pdf quality option must be a string, you passed a ' + typeof quality)
      }
    }
    var cmd = 'gs -sDEVICE=tiffgray -r720x720 -g6120x7920 -sCompression=lzw -o "' + output_path + '" "' + input_path + '"'
    // var cmd = 'convert -depth 8 -background white -flatten +matte -density '+pdf_convert_quality+' "'+ input_path +'"  "' + output_path+'"'
    exec(cmd, function (err, stderr, stdout) {
      if (err) {
        err = errs.merge(err, { stdout: stdout, stderr: stderr, command: cmd})
        return callback(err)
      }
      return callback(null, output_path)
    })
  })
}
