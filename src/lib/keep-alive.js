import * as config from '../config/config';

// keepAlive.js
const fetch = require('node-fetch');

// globals
const interval = 60 * 1000; // interval 60 seconds
//const interval = 25*60*1000; // interval in milliseconds - {25mins x 60s x 1000}ms

var wakeURL = "http://localhost:8080"
if (process.env.NODE_ENV === 'production' || config.productionTest) {
	wakeURL = "https://tl-pg-server.herokuapp.com/users"
}

(function wake() {
	//let handler: ReturnType<typeof setTimeout> = 0
	try {
		// const wakeHandler = 
		setInterval(() => {
			console.log(`wake: ${wakeURL}`)
			fetch(wakeURL).then((res) => {
				console.log(`response-ok: ${res.ok}, status: ${res.status}`)
			}).catch((err) => {
				console.error(`Error occured: ${err}`)
			})
		}, interval);

	} catch (err) {
		console.error('Error occured: retrying...' + err);
		//clearInterval(wakeHandler); // if you uncomment wakeHandler is unknown
		return setTimeout(() => wake(), 60000);
	};
})();
