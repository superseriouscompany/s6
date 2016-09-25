var expect  = require('expect');
var async   = require('async');
var Bot     = require('tinybot');
var slub    = require('tinybot').slub;
var debug   = require('debug')('s6:test');
var secrets = require('../secrets');

var token = secrets.token;

describe('s6', function() {
  before(function(cb){
    slub.serve(6969, function(err) {
      if( err ) { return cb(err); }
      var bot = new Bot(token, 'C2EVDHF5L', 'http://localhost:6969');
      bot.start(cb);
      bot.addTrait(require('../traits/s6'));
    });
  })

  it('works', function(cb) {
    this.timeout(process.env.NODE_ENV || 10000);

    var conversation = [
      {
        type: 'message',
        subtype: 'file_share',
        file: {
          id: 'abc123',
          name: 'janky.jpg',
          url_private: 'http://i.imgur.com/0PXKJKD.jpg'
        }
      },
      {
        type: 'reaction_added',
        item: {
          file: 'abc123'
        },
        reaction: 'satellite_antenna'
      },
      { response: 'https://image.superseriouscompany.com/janky.jpg' }
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
