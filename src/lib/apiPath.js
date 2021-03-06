import * as config from '../config/config';

export const apiPath = (type, endpoint, extra = null, debug = true) => {
	//config.SERVER_URL + config.SERVER_PATH + config.USER_ENDPOINT + '/login'
	if (endpoint === 'user') endpoint = config.USER_ENDPOINT
	else if (endpoint === 'account') endpoint = config.ACCOUNT_ENDPOINT
	else if (endpoint === 'theme') endpoint = config.THEME_ENDPOINT
	else if (endpoint === 'services') endpoint = config.SERVICES_ENDPOINT
	else if (endpoint === 'payment') endpoint = config.PAYMENT_ENDPOINT
	else if (endpoint === 'message') endpoint = config.MESSAGE_ENDPOINT
	else if (endpoint === 'myGifts') endpoint = config.MYGIFTS_ENDPOINT
	else if (endpoint === 'gifts') endpoint = config.GIFTS_ENDPOINT
	else if (endpoint === 'giftDS') endpoint = config.GIFTSDS_ENDPOINT  // giftDS short for giftDataStore
	else if (endpoint === 'logs') endpoint = config.LOGS_ENDPOINT  // giftDS short for giftDataStore

	let apiCall = config.SERVER_URL + config.SERVER_PATH + endpoint
	if (extra) apiCall += '/' + extra
	if (config.debugLevel && debug) console.log(`apiPath: %c${type} %c[${apiCall}]`, 'font-weight: bold; color: white', '')
	return apiCall;
}
