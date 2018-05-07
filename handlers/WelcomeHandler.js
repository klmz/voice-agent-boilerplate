let RouteHandler = require( "./RouteHandler" ).RouteHandler;
let Constants = require( "../main/constants" );
let Utils = require( "../main/utils.js" );
let Prompts = require( "../main/prompts" ).languages;
let sprintf = require( "sprintf-js" ).sprintf;

class WelcomeHandler extends RouteHandler {
	constructor(language) {
		super(language);

	}

	getRoutes() {
		let map = new Map();
		map.set( Constants.intents.WELCOME, this.welcomeHandler.bind(this)  );
		return map;
	};

	//Handle the welcome intent
	welcomeHandler(app) {
		let c = Utils.getRandomPrompt( Prompts[this.language].WELCOME_PROMPTS );
		app.ask( c );
	}

	generalFallbackHandler(app) {
		console.log('Fallbackhandler');
		console.log(app.data);
		if(app.data.fallbackCount === null) app.data.fallbackCount = 0;
		app.data.fallbackCount = parseInt( app.data.fallbackCount, 10 );
		app.data.fallbackCount++;
		if (app.data.fallbackCount > 3) {
			app.tell( Prompts[this.language].FINAL_FALLBACK );
		} else {
			app.ask( Utils.getRandomPrompt( Prompts[this.language].FALLBACKS ) );
		}
	}

	signInHandler(app) {
		if (app.getSignInStatus() === app.SignInStatus.OK) {
			let accessToken = app.getUser().accessToken;
			app.ask( Prompts[this.language].RELINKED_ACCOUNT );
		} else {
			app.tell( "meeeh" );
		}
	}

}

exports.WelcomeHandler = WelcomeHandler;
