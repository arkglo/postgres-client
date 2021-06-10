import * as config from '../config/config';

export const apiPath = (endpoint, extra = null, debug = true) => {
	//config.SERVER_URL + config.SERVER_PATH + config.USER_ENDPOINT + '/login'
	if(endpoint === 'user') endpoint = config.USER_ENDPOINT
	else if(endpoint === 'account') endpoint = config.ACCOUNT_ENDPOINT
	else if(endpoint === 'theme') endpoint = config.THEME_ENDPOINT
	else if(endpoint === 'services') endpoint = config.SERVICES_ENDPOINT

	let apiCall = config.SERVER_URL + config.SERVER_PATH + endpoint
	if(extra) apiCall += '/' + extra
	if(config.debugLevel && debug) console.log(`apiPath: [${apiCall}]`)
	return apiCall;
}