var Tinybot = require('tinybot');
var secrets = require('./secrets.json');

var bot = new Tinybot(secrets.token);

bot.start(function(err) {
  if( err ) { throw err; }


  bot.addTrait(require('./traits/slack2s3'));
})
