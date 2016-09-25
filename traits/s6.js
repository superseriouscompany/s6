var AWS       = require('aws-sdk');
var URL       = require('url');
var https     = require('https');
var secrets   = require('../secrets.json');
var token     = secrets.token;

AWS.config.update({
  accessKeyId: secrets.accessKey,
  secretAccessKey: secrets.secretKey
})
var s3 = new AWS.S3();

var files = {};

module.exports = function(bot) {
  bot.on('message', function(message) {
    if( message.subtype != 'file_share' || !message.file ) { return; }
    files[message.file.id] = message.file;
  })

  bot.hears({type: 'reaction_added', reaction: 'satellite_antenna'}, function(message) {
    if( !message.item || !message.item.file ) { return; }

    var file = files[message.item.file];
    if( !file ) { return console.warn("No file", message.item); }

    if( file.s3Url ) { return bot.say(file.s3Url); }

    upload({
      file: file
    }, function(err, url) {
      if( err ) { return console.error(err); }
      file.s3Url = url;
      bot.say(url);
    })
  })
}

module.exports.upload = upload;

function upload(message, cb) {
  if( !message || !message.file || !message.file.url_private || !message.file.name ) {
    return cb(new Error("Invalid message"));
  }

  var url = URL.parse(message.file.url_private);
  https.get({
    hostname: url.hostname,
    path: url.path,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }, function(stream) {
    var key = message.file.name.replace(' ', '%20');
    var params = {Bucket: 'image.superseriouscompany.com', Key: key, Body: stream, ACL: 'public-read', ContentType: 'image/png'}
    s3.upload(params, function(err, data) {
      if( err ) { return cb(err); }

      return cb(null, `https://image.superseriouscompany.com/${key}`);
    })
  })
}
