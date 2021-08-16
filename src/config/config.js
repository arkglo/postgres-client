export const debugLevel = 2

// Paths
const LOCAL_SERVER_URL = "http://localhost:8080"
export const HEROKU_SERVER_URL = "https://tl-pg-server.herokuapp.com"
export const SERVER_PATH = "/api"

// End Points
export const ACCOUNT_ENDPOINT = "/accounts"
export const USER_ENDPOINT = "/users"
export const THEME_ENDPOINT = "/themes"
export const SERVICES_ENDPOINT = "/services"
export const PAYMENT_ENDPOINT = "/payment"
export const MYGIFTS_ENDPOINT = "/myGifts"
export const GIFTS_ENDPOINT = "/gifts"
export const GIFTSDS_ENDPOINT = "/giftDataStore"
export const STRIPE_ENDPOINT = "/create-checkout-session"
export const LOGS_ENDPOINT = "/logs"

//Override
export let productionTest = true
if(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
	//Actually running locally - full dev
	productionTest = false
}

if(debugLevel) {
	console.clear()
	console.log(`debugLevel: ${debugLevel}`)
	console.log(`productionTest: ${productionTest}, NODE_ENV: ${process.env.NODE_ENV}`)
	console.log(`Running from : ${window.location.href}`)
}

//Setup Server URL
console.log(process.env)
var THIS_SERVER_URL = LOCAL_SERVER_URL
if(process.env.NODE_ENV === 'production' || productionTest) {
	THIS_SERVER_URL = HEROKU_SERVER_URL
}
export const SERVER_URL = THIS_SERVER_URL
