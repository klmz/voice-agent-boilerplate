import fetch from "node-fetch";
import Prompts from "./prompts";
import Constants from "./constants.js" ;
import trim from "trim";
import sprintf from "sprintf-js";

export const getRandomNumber = function (min, max) {
	return Math.floor( Math.random() * (max - min + 1) ) + min;
};

export const  getRandomPrompt = function (arr) {
	return arr[ getRandomNumber( 0, arr.length - 1 ) ];
};


const calculateLevenshtein = function (a, b) {
	if (a.length === 0) {
		return b.length;
	}
	if (b.length === 0) {
		return a.length;
	}

	let matrix = [];

	// increment along the first column of each row
	let i;
	for (i = 0; i <= b.length; i++) {
		matrix[ i ] = [ i ];
	}

	// increment each column in the first row
	let j;
	for (j = 0; j <= a.length; j++) {
		matrix[ 0 ][ j ] = j;
	}

	// Fill in the rest of the matrix
	for (i = 1; i <= b.length; i++) {
		for (j = 1; j <= a.length; j++) {
			if (b.charAt( i - 1 ) == a.charAt( j - 1 )) {
				matrix[ i ][ j ] = matrix[ i - 1 ][ j - 1 ];
			} else {
				matrix[ i ][ j ] = Math.min( matrix[ i - 1 ][ j - 1 ] + 1, // substitution
					Math.min( matrix[ i ][ j - 1 ] + 1, // insertion
						matrix[ i - 1 ][ j ] + 1 ) ); // deletion
			}
		}
	}

	return matrix[ b.length ][ a.length ];
};

export const getClosest = function (query, options) {
	let maxDistance = 1000;
	let pick = null;
	for (let i = 0; i < options.length; i++) {
		let d = calculateLevenshtein( query, options[ i ] );
		if (d < maxDistance) {
			maxDistance = d;
			pick = options[ i ];
		}
	}
	//Check if the picked word is at least somewhat
	if(maxDistance > query.length/2) {
		console.log("The picked word was to different. I heard "+query+", and picked "+pick);
		return null;
	}
	return pick;
};

//Reduce a generic list to a summation with correct interpunction and couple words.
export const listToSentence = function (lang, arr, itemHandler, finalCoupler) {
	if (!itemHandler) {
		itemHandler = a => a;
	}
	if (!finalCoupler) {
		if (arr.length <= 3) {
			finalCoupler = Prompts[lang].DEFAULT_COUPLE_WORD;
		} else {
			finalCoupler = getRandomPrompt( Prompts[lang].FINALLY_COUPLE_WORDS );
		}
	}
	let content = arr.reduce( function (sentence, item, i, array) {
		let part = itemHandler( item, i, array );
		let n = array.length;
		let coupleWord = ", ";

		if (i === n - 1) { //Last item
			coupleWord = "";
		} else if (i === n - 2) { //Second to last item
			coupleWord = finalCoupler;
		}

		return sentence + part + coupleWord;
	}, "" );
	// return sprintf( "<speak> %s </speak>", content );
	return content;
};


function checkResponse(app, lang='en') {
	console.log( "[LOG]      Made function" );
	return function (res) {
		if (res.status >= 200 && res.status < 300) {
			return Promise.resolve( res );
		} else {
			if (res[ 0 ] && res[ 0 ].errorCode) {
				switch (res[ 0 ].errorCode) {
					case Constants.errorCodes.INVALID_SESSION_ID:
						//Retry account linking
						app.tell( "Your account is unlinked, please reset it." );
						return Promise.resolve();
					default:
						return Promise.reject( new Error( "Something went wrong, the Post told me: " + res[ 0 ].message ) );
				}
			} else {
				switch (res.status) {
					case 401:
						app.tell( Prompts[lang].SALESFORCE_TOKEN_EXPIRED );
						return Promise.resolve();
					default:
						return Promise.reject( new Error( "Something went wrong, the Post told me: " + res.message ) );
				}
			}
		}
	};
}

export const get = function (app, endpoint) {
	return fetch( endpoint, {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + app.getUser().accessToken
		}
	} )
		.then( checkResponse( app ) )
		.then( function (res) {
			return res.json();
		} )
		.catch( function (error) {
			console.error( error );
			app.tell( "Something went wrong" );
		} );
};

export const post = function (app, endpoint, data) {
	return fetch( endpoint, {
		method: "POST",
		headers: {
			"Authorization": "Bearer " + app.getUser().accessToken,
			"Content-Type": "application/json"
		},
		body: JSON.stringify( data )
	} );
};

export class TimedOutPromiseResult{
	constructor(isTimedOut, result){
		this.isTimedOut = isTimedOut;
		this.result = result;
	}

	getResult(defaultValue){
		let res = this.result;
		return new Promise(function(resolve, reject) {
			if(res === null && typeof defaultValue === "undefined"){
				reject(new Error("There was not result, the promise was probably expired."));
			}else if(res === null){
				res = defaultValue;
			}
			resolve(res);
		});
	}
}

export const promiseWithTimeout = function(promise, timeout){
	let isTimedOut = false;
	let timeoutPromise = new Promise(function(resolve, reject){
		setTimeout(function(){
			isTimedOut = true;
			resolve(new TimedOutPromiseResult(isTimedOut, null));
		}, timeout);
	});
	let wrappedPromise = new Promise(function(resolve, reject){
		promise.then(function(res){
			isTimedOut = false;
			resolve(new TimedOutPromiseResult(isTimedOut, res));
		});
	});
	return Promise.race([wrappedPromise, timeoutPromise]);
};

export const fakePromise = function(timeout){
	return new Promise(function(resolve, reject){
		setTimeout(function(){
			resolve();
		}, timeout)
	})
};

export const ordinalToNumber = function (ordinal) {
	if(ordinal === null) return 1;

	ordinal = trim( ordinal.toString() );
	switch (ordinal) {
		case "first":
			return 1;
		case "second":
			return 2;
		case "third":
			return 3;
		case "fourth":
			return 4;
		case "fifth":
			return 5;
		case "sixth":
			return 6;
		default:
			return ordinal;
	}
};
