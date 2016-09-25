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

module.exports = function(bot) {
  bot.on('message', function(message) {
    console.log(message);
  })

  bot.hearsOnce({text: 'hello'}, function() {
    bot.say('dope');
  })
}

module.exports.upload = function upload(message, cb) {
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
