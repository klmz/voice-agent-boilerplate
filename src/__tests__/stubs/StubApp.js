// const readline = require('readline');

// const rl = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout
// });

class StubApp{
	constructor(){
		this.lines=[];
	}
	tell(msg){
		let line = "[ASSISTANT tells]"+msg;
		console.log(line);
		this.lines.push(line);
	}

	ask(msg){
		let line = "[ASSISTANT asks]"+msg;
		console.log(line);
		this.lines.push(line);
	// 	rl.question("[ASSISTANT asks]"+msg, (answer) => {
	// 		console.log(`Thank you for your valuable feedback: ${answer}`);
	// 		rl.close();
	// 	});
	}

	getArgument(){
		return "This is a compliment";
	}
	getLines(){
		return this.lines;
	}

	getUser(){
		return {
			accessToken: "Aasdfasdfsdf"
		}
	}
}

exports.StubApp = StubApp;
