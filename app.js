var Twitter = require("twitter");
var five = require("johnny-five");
var arduino = new five.Board();

var clientTwitter = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

arduino.on("ready", function() {
  var moisture = new five.Sensor("A0");
  moisture.scale(0,100);
  var lampe = new five.Pin(7);
  lampe.low();

  clientTwitter.stream('statuses/filter', {track: '@simplonnatacha'}, function(stream) {
    stream.on('data', function(tweet) {
      console.log(tweet.text);
      var motifWesh = new RegExp("wesh");

      if(motifWesh.test(tweet.text)){
        // Retweet
        clientTwitter.post('statuses/update', {status: "Je suis Natacha, mon taux d'humidité est de " + moisture.value},  function(error, tweet, response){
          if(error) throw error;
          console.log(tweet);  // Tweet body.
        });
      }

      var motifArrosage = new RegExp("arrosage");
      if(motifArrosage.test(tweet.text)){
        // Arrosage
        lampe.high();
      }
      var motifEteindre = new RegExp("éteindre");
      if (motifEteindre.test(tweet.text)) {
        // Eteindre
        lampe.low();
      }
    });
  });

});
