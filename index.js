var Tinybot = require('tinybot');

var token = process.env.SLACK_BOT_TOKEN;
if( !token ) {
  return console.error("Please provide SLACK_BOT_TOKEN");
}

var bot = new Tinybot(token, process.env.CHANNEL || '#general');

bot.start(function(err) {
  if( err ) { throw err; }


  bot.addTrait(require('./traits/s6'));
})
