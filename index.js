var Tinybot = require('tinybot');
var secrets = require('./secrets.json');

var bot = new Tinybot(secrets.token);

bot.start(function(err) {
  if( err ) { throw err; }

  bot.on('message', function(message) {
    console.log(message);
  })

  // bot.hearsOnce({text: 'hello'}, function() {
  //   bot.say('Noice', '#marvinandme');
  // })
})
