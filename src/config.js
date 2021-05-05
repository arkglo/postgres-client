const LOCAL_SERVER_URL = "http://localhost:8080"
export const SERVER_PATH = "/api"
export const ACCOUNT_ENDPOINT = "/accounts"
export const USER_ENDPOINT = "/users"
export const HEROKU_SERVER_URL = "https://tl-pg-server.herokuapp.com" // 35744

//Override
const productionTest = false;

var THIS_SERVER_URL = LOCAL_SERVER_URL
if(process.env.NODE_ENV === 'production' || productionTest) {
	THIS_SERVER_URL = HEROKU_SERVER_URL
}

export const SERVER_URL = THIS_SERVER_URL