process.env.DEBUG = "actions-on-google:*";
let DialogflowApp = require( "actions-on-google" ).DialogflowApp;
let Utils = require( "./main/utils.js" );
let Constants = require( "./main/constants.js" );
let GoogleActionsRouter = require('./main/GoogleActionsRouter').GoogleActionsRouter;
let {MemoryHandler, WelcomeHandler} = require("./handlers");

let useSentimentAnalysis = process.env.USE_SENTIMENT_ANALYSIS == "true"

exports.voiceAgent = (request, response) => {
	let lang = request.body.lang;
	// let lang = request.body.queryResult.languageCode;
	console.log(request.body);
	console.log("Language is:", lang);
	if(typeof lang == "undefined"){
		lang = "nl";
		console.log("Language is:", lang);
	}
	
	const app = new DialogflowApp( {
		request,
		response
	} );

	let router = new GoogleActionsRouter();
	// router.addRouteHandler(new WelcomeHandler(lang));
	router.addRouteHandler(new MemoryHandler(lang));
	
	console.log("Complete Map", router.getMap());
	router.handleRequest(app);
};
