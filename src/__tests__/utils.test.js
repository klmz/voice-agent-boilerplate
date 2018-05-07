let Utils = require('../main/utils.js');

describe('Reduce to sentence', () => {
    it('Array.lengh = 1', () => {
        let arr = [1];
        expect(Utils.listToSentence(arr, null, ' and ')).toBe('1.');
    })
    it('Array.lengh = 2', () => {
        let arr = [1, 2];
        expect(Utils.listToSentence(arr, null, ' and ')).toBe('1 and 2.');
    })
    it('Array.lengh = 3', () => {
        let arr = [1, 2, 3];
        expect(Utils.listToSentence(arr, null, ' and ')).toBe('1, 2 and 3.');
    })
    it('ItemHandler test', () => {
        let arr = [1, 2, 3];
        expect(Utils.listToSentence(arr, a => `(${a + 1})`, ' and ')).toBe('(2), (3) and (4).');
    })
});

describe("Test timeoutpromise", ()=>{
	it("If a timeout expires the timeout should be detected",()=>{
		let result = {
			"company": "PostNL",
			"city": "Den haag"
		};
		let promise = new Promise(function(resolve, reject){
			setTimeout(function(){
				resolve(result);
			},1000)
		});
		return Utils.promiseWithTimeout(promise, 10)
			.then(function(timeoutResult){
				expect(timeoutResult).toBeInstanceOf(Utils.TimedOutPromiseResult);
				expect(timeoutResult.isTimedOut).toBe(true);
			})
		});

	it("If a promise resolves on time the result should be filled",()=>{
		let result = {
			"company": "PostNL",
			"city": "Den haag"
		};
		let promise = new Promise(function(resolve, reject){
			setTimeout(function(){
				resolve(result);
			},10)
		});
		return Utils.promiseWithTimeout(promise, 1000)
			.then(function(timeoutResult){
				expect(timeoutResult).toBeInstanceOf(Utils.TimedOutPromiseResult);
				expect(timeoutResult.isTimedOut).toBe(false);
				return timeoutResult.getResult().then(res =>{
					expect(res).toEqual(result);
				})

			})
	});

	it("If levensthein distance is higher than threshold ignore the result", () =>{
		let senders = [
			"bol.com",
			"coolblue",
			"zalando",
		];
		expect(Utils.getClosest("bol.com",senders)).toBe("bol.com");
		expect(Utils.getClosest("boolclue",senders)).toBe("coolblue");
		expect(Utils.getClosest("walando",senders)).toBe("zalando");
		expect(Utils.getClosest("walbpdq",senders)).toBe(null);
		expect(Utils.getClosest("Soul on the",senders)).toBe(null);
		// expect(Utils.getClosest("",senders)).toBe();
	});
});
