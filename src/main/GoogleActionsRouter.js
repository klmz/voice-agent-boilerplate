export default class GoogleActionsRouter{
	constructor(actionmap){
		if (actionmap === null || typeof actionmap === "undefined") {
			this.actionMap = new Map();
		}
		this.routeHandlers = [];
	}
	addRouteHandler(routeHandler) {
		this.routeHandlers.push( routeHandler );
	};

	cloneInternalMap () {
		let map = new Map();
		for (let [ key, value ] in this.actionMap) {
			map.set( key, value );
		}
		return map;
	};

	getMap () {
		let map = this.cloneInternalMap();

		for (let handler of this.routeHandlers) {
			handler.addToMap( map );
		}

		return map;
	};
	handleRequest(app) {
		console.log(this.getMap() );
		app.handleRequest( this.getMap() );
	};
}

