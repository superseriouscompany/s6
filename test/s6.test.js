var expect  = require('expect');
var async   = require('async');
var Bot     = require('tinybot');
var slub    = require('tinybot').slub;
var debug   = require('debug')('s6:test');
var secrets = require('../secrets');

var token = secrets.token;

describe('s6', function() {
  var bot;
  before(function(cb){
    slub.serve(6969, function(err) {
      if( err ) { return cb(err); }
      bot = new Bot(token, 'C2EVDHF5L', 'http://localhost:6969');
      bot.start(cb);
      bot.addTrait(require('../traits/slack2s3'));
    });
  })

  it('works', function(cb) {
    var conversation = [
      { text: 'hello' },
      { response: 'dope' }
    ]

    expectConversation(conversation, cb);
  })

})

function expectConversation(conversation, cb) {
  async.series(conversation.map(function(message) {
    return function(cb) {
      if( !!message.response ) {
        return slub.socket.shouldReceive(message.response, cb);
      }

      slub.socket.send(message);
      cb();
    }
  }), cb);
}
