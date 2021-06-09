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

//Override
export const productionTest = false

if(debugLevel) console.log(`productionTest: ${productionTest}, NODE_ENV: ${process.env.NODE_ENV}`)

//Setup Server URL
console.log(process.env)
var THIS_SERVER_URL = LOCAL_SERVER_URL
if(process.env.NODE_ENV === 'production' || productionTest) {
	THIS_SERVER_URL = HEROKU_SERVER_URL
}
export const SERVER_URL = THIS_SERVER_URL
