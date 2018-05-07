process.env.DEBUG = 'actions-on-google:*';
let Prompts = require( "./main/prompts" ).languages;

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let sprintf = require( "sprintf-js" ).sprintf;
let voiceAgent = require('./index.js').voiceAgent;

app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json({
    type: 'application/json'
}));
app.use(express.static('public'));


// Create an instance of ApiAiAssistant
app.post('/', voiceAgent);

// Start the server
let server = app.listen(app.get('port'), function() {
    console.log()
    console.log('App listening on port %s', server.address().port);
    console.log('Press Ctrl+C to quit.');
    console.log(process.env.USE_SENTIMENT_ANALYSIS == "true" ? "using sentiment analysis": "Not using sentiment ana");
});

