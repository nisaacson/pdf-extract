var crypto = require('crypto');
var fs = require('fs');
function hashDataAtPath(filePath, cb) {
  var readStream = fs.createReadStream(filePath);
  hash_data_from_stream(readStream, cb);
}
function hash_data_from_stream(readStream, callback) {
  var sha1_hash;
  var shasum = crypto.createHash('sha1');
  readStream.on('data', function (data) {
    shasum.update(data);
  });
  readStream.on('close', function (data) {
    sha1_hash = shasum.digest('hex');
    return callback(null, sha1_hash);
  });
  readStream.on('error', function (err) {
    return callback(err, null);
  });
}

module.exports = hashDataAtPath;