let sprintf = require( "sprintf-js" ).sprintf;
class RouteHandler{
	constructor(language){
		this.language = language;
	}
	addToMap(map) {
		let routes = this.getRoutes();
		for (let [ key, value ] of routes.entries()) {
			map.set( key, value );
		}
		return map;
	};

	getRoutes() {
		throw new Error( "Implement get routes for this handler." );
	};

	tell(app, msg){
		app.tell(sprintf("<speak>%s</speak>", msg));
	}

	ask(app, msg){
		app.ask(sprintf("<speak>%s</speak>", msg));
	}
}
exports.RouteHandler = RouteHandler;
