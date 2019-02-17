const fs = require('fs');
const toWav = require('audiobuffer-to-wav');
const AudioContext = require('web-audio-api').AudioContext;
const stream = require('youtube-audio-stream')
const url = 'https://www.youtube.com/watch?v=fdCDQIyXGnw'
const decoder = require('lame').Decoder
const speaker = require('speaker')
var header = require('waveheader');
var AudioBuffer = require('audiobuffer')
const Writable = require('web-audio-stream/writable')
const context = require('audio-context')
var FileWriter = require('wav').FileWriter;
var toArray = require('stream-to-array')
var Houndify = require('houndify');


var outputFileStream = new FileWriter('./test.wav', {
  sampleRate: 44100,
  channels: 2
});

//stream(url).pipe(decoder()).pipe(outputFileStream)

//ffmpeg -i 111.mp3 -acodec pcm_s16le -ac 1 -ar 16000 out.wav



Houndify.decodeAudioData(audio, function(err, result) {
  voiceRequest = initVoiceRequest(audio.sampleRate);
  voiceRequest.write(audio.audioData);
  voiceRequest.end();
});




      function initVoiceRequest(sampleRate) {
        responseElt.parentNode.hidden = true;
        infoElt.parentNode.hidden = true;
        
        var voiceRequest = new Houndify.VoiceRequest({
          //Your Houndify Client ID
          clientId: "pWElPNgB3E5pnA7zGxQrMw==",

          //For testing environment you might want to authenticate on frontend without Node.js server. 
          //In that case you may pass in your Houndify Client Key instead of "authURL".
          clientKey: "YMXcyD0c62IXwkuO1Jrht1UFWKeBgkfjwwiMMYg0PwYHOqK__deZMSMBpK1oxux",

          //Otherwise you need to create an endpoint on your server
          //for handling the authentication.
          //See SDK's server-side method HoundifyExpress.createAuthenticationHandler().
          // authURL: "/houndifyAuth",

          //REQUEST INFO JSON
          //See https://houndify.com/reference/RequestInfo
          requestInfo: { 
            UserID: "test_user",
            Latitude: 37.388309, 
            Longitude: -121.973968
          },

          //Pass the current ConversationState stored from previous queries
          //See https://www.houndify.com/docs#conversation-state
          conversationState: conversationState,

          //Sample rate of input audio
          sampleRate: sampleRate,

          //Enable Voice Activity Detection
          //Default: true
          enableVAD: true,
          
          //Partial transcript, response and error handlers
          onTranscriptionUpdate: onTranscriptionUpdate,
          onResponse: function(response, info) {
            recorder.stop();
            onResponse(response, info);
          },
          onError: function(err, info) {
            recorder.stop();
            onError(err, info);
          }
        });

        return voiceRequest;
      }


//.pipe(outputFileStream)


// stream(url).pipe(decoder()).pipe(new speaker())

// const audioContext = new AudioContext();


// audioContext.decodeAudioData(stream(url).pipe(decoder()), buffer => {
//     let wav = toWav(buffer); 
//     var chunk = new Uint8Array(wav);
//     console.log(chunk); 
//     fs.appendFile('bb.wav', new Buffer(chunk), function (err) {
//     });

// });


// stream(url)
// .pipe(decoder())
// .pipe(new speaker())


// var getAudio = function (req, res) {
//   var requestUrl = 'http://youtube.com/watch?v=' + req.params.videoId
//   try {
//     youtubeStream(requestUrl).pipe(res)
//   } catch (exception) {
//     res.status(500).send(exception)
//   }
// }

