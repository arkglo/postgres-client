export const debugLevel = 2

// Paths
const LOCAL_SERVER_URL = "http://localhost:8080"
export const HEROKU_SERVER_URL = "https://tl-pg-server.herokuapp.com"
export const SERVER_PATH = "/api"

// End Points
export const ACCOUNT_ENDPOINT = "/accounts"
export const USER_ENDPOINT = "/users"

//Override
const productionTest = false

//Setup Server URL
var THIS_SERVER_URL = LOCAL_SERVER_URL
if(process.env.NODE_ENV === 'production' || productionTest) {
	THIS_SERVER_URL = HEROKU_SERVER_URL
}
export const SERVER_URL = THIS_SERVER_URL


export const apiPath = (endpoint, extra = null) => {
	//config.SERVER_URL + config.SERVER_PATH + config.USER_ENDPOINT + '/login'
	if(endpoint === 'user') endpoint = USER_ENDPOINT
	else if(endpoint === 'account') endpoint = ACCOUNT_ENDPOINT

	let apiCall = SERVER_URL + SERVER_PATH + endpoint
	if(extra) apiCall += '/' + extra
	if(debugLevel) console.log(`apiPath: [${apiCall}]`)
	return apiCall;
}