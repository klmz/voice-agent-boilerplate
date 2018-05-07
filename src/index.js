process.env.DEBUG = "actions-on-google:*";
import { DialogflowApp } from "actions-on-google"
import Utils from "./main/utils";
import Contstants from "./main/constants";
import GoogleActionsRouter from  "./main/GoogleActionsRouter";
import {MemoryHandler, WelcomeHandler} from "./handlers";

let useSentimentAnalysis = process.env.USE_SENTIMENT_ANALYSIS == "true"

const voiceAgent = (request, response) => {
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

export default voiceAgent;
