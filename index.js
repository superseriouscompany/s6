var Tinybot = require('tinybot');
var secrets = require('./secrets.json');

var bot = new Tinybot(secrets.token, 'C2EVDHF5L');

bot.start(function(err) {
  if( err ) { throw err; }


  bot.addTrait(require('./traits/s6'));
})
