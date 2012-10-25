/**
 * Converts a pdf file at a given path to a tiff file with
 * the GraphicsMagick command "convert"
 */
var inspect = require('eyes').inspector({maxLength:2000000});
var temp = require('temp');
var path = require('path');
var exec = require('child_process').exec
var spawn = require('child_process').spawn;
var fs = require('fs');
var pdf_convert_quality = 400; // default to density 400 for the convert command


/**
 * @param tif_path path to the single page file on disk containing a scanned image of text
 * @param {Arrray} outputs is an optional object that can contain flags to pass
 *   to the tesseract command
 * @return {String} extract the extracted ocr text output
 * @return callback(<maybe error>, stdout)
 */
exports = module.exports = function convert(input_path, quality, callback) {
  // options is an optional parameter
  if (!callback || typeof callback != "function") {
    callback = quality;   // callback must be the second parameter
    quality = undefined;  // no option passed
  }

  fs.exists(input_path, function (exists) {
    if (!exists) { return callback('error, no file exists at the path you specified: ' + input_path); }
    // get a temp output path

    var output_path = temp.path({prefix: 'tif_output', suffix:'.tif'});
    // var output_path = path.join(__dirname,'test/test_data/single_page_raw.tif');
    var params = [

      // '-depth 8',
      // '-background white',
      // '-flatten +matte',
      // '-density '+pdf_convert_quality,
      input_path,
      output_path
    ];
    if (quality) {
      if (typeof(quality) !== 'string' && typeof(quality) !== 'number') {
        return callback('error, pdf quality option must be a string, you passed a ' + typeof(quality));
      }
      pdf_convert_quality = quality;
    }
    var cmd = 'convert -depth 8 -background white -flatten +matte -density '+pdf_convert_quality+' "'+ input_path +'"  "' + output_path+'"';
    var child = exec(cmd, function (err, stderr, stdout) {
      if (err) {
        return callback(err);
      }
      if (stderr) {
        return callback(stderr); }
      return callback(null, output_path);
    });
  });
}

