import React, { Component } from 'react';
import axios from 'axios';
import ReactJson from 'react-json-view'
import * as config from '../config/config'

import { apiPath } from '../lib/apiPath'

import { cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "animate.css/animate.min.css";

const zoom = cssTransition({
  enter: "animate__animated animate__zoomInDown",
  exit: "animate__animated animate__zoomOutDown"
});
const drop = cssTransition({
	enter: "animate__animated animate__slideInDown",
	exit: "animate__animated animate__hinge"
});


//------------------------------------------------------------
function initialState() {
	return {
		data: null,
		status: 0,
		websiteLink: '',
		websitePassword: 'testPassword',
		loggedIn: false
	};
}

//============================================================
export default class Guest extends Component {
	constructor(props) {
		super(props);
		this.state = initialState();

		this.handleCheckLink = this.handleCheckLink.bind(this);
		this.handleListAccounts = this.handleListAccounts.bind(this)
		this.handleLoginWithoutPassword = this.handleLoginWithoutPassword.bind(this);
		this.handleLoginWithPassword = this.handleLoginWithPassword.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		console.log("Guest.componentDidMount()")
		if( this.props.accountId != null && this.props.accountId !== -1) {
			this.setState({loggedIn: true})
		}
	}

	loginSuccess(message) {
		this.props.toastThis(message, 'success', 2000, { transition: zoom })
	}

	loginError(message) {
		console.log(message)
		if( this.props.accountId !== -1) {
			this.props.handleReset()
		}
		this.props.toastThis(message, 'error', 2000, { transition: drop })
	}

	//------------------------------------------------------------
	handleLoginWithPassword(event) {
		event.preventDefault();  // IMPORTANT.

		//Setup some data
		const websiteLink = this.state.websiteLink;
		const websitePassword = this.state.websitePassword;
		console.log(`Guest.handleLoginWithPassword(${websiteLink})`)

		axios.post(apiPath('POST','/users/guestLogin'),{
			link: websiteLink,
			password: websitePassword
		}).then((response) => {
			console.log('API STATUS: ' + response.status)
			// console.log(response.data)
			const data = response.data.data
			if (response.status !== 200) {
				this.setState({
					loggedIn: false,
					status: response.status,
					data: data ?? null,
					error: {
						status: response.status,
						function: response.data.function ?? null,
						message: response.data.message ?? null
					}
				})
				console.log('Error:')
				console.log(response)
				return console.warn('Failed to get data');
			}

			if (config.debugLevel > 1) console.log(data)
			this.loginSuccess(response.data.message)
			this.setState({
				loggedIn: true,
				status: response.status,
				data: data,
				error: null,
			})
			this.props.handleGuestLogin(data)
		}).catch((error) => {
			this.loginError(error.response?.data?.message ?? "unknown")
			this.setState({
				loggedIn: false,
				status: error.response?.status ?? -1,
				data: error.response?.data ?? "unknown",
				error: {
					status: error.response?.status ?? -1,
					function: error.response?.data?.function ?? null,
					message: error.response?.data?.message ?? null
				}
			})
			// console.log(error.response ?? 'no repsonse')
		});
	}

	handleLoginWithoutPassword(event) {
		event.preventDefault();  // IMPORTANT.

		//Setup some data
		const websiteLink = this.state.websiteLink;
		// const password = this.state.websitePassword;
		console.log(`Guest.handleLoginWithoutPassword(${websiteLink})`)

		axios.post(apiPath('POST','/users/guestLogin'),{
			link: websiteLink
		}).then((response) => {
			console.log('API STATUS: ' + response.status)
			// console.log(response.data)
			const data = response.data.data
			if (response.status !== 200) {
				this.setState({
					loggedIn: false,
					status: response.status,
					data: data ?? null,
					error: {
						status: response.status,
						function: response.data.function ?? null,
						message: response.data.message ?? null
					}
				})
				console.log('Error:')
				console.log(response)
				return console.warn('Failed to get data');
			}

			if (config.debugLevel > 1) console.log(data)
			this.loginSuccess(response.data.message)
			this.setState({
				loggedIn: true,
				status: response.status,
				data: data,
				error: null,
			})
			this.props.handleGuestLogin(data)
		}).catch((error) => {
			this.loginError(error.response?.data?.message ?? "unknown")
			this.setState({
				loggedIn: false,
				status: error.response?.status ?? -1,
				data: error.response?.data ?? "unknown",
				error: {
					status: error.response?.status ?? -1,
					function: error.response?.data?.function ?? null,
					message: error.response?.data?.message ?? null
				}
			})
			// console.log(error.response ?? 'no repsonse')
		});
	}

	handleListAccounts(event) {
		event.preventDefault();  // IMPORTANT.
		this.setState({data: null})

		axios.get(apiPath('GET','account', 'active')).then( (response) => {
			if (config.debugLevel) console.log(response)
			this.setState({
				status: response.status,
				data: response.data.data,
				error: null,
			})
			if (response.status !== 200) {
				return console.warn('Reset Request failed');
			}
			if (config.debugLevel > 1) console.log(response.data.data)
		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.warn(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
		});
	}

	handleCheckLink(event) {
		event.preventDefault();  // IMPORTANT.
		this.setState({data: null})

		//Setup some data
		const websiteLink = this.state.websiteLink;
		const urlExtra = 'checkLink/'+ websiteLink;

		axios.get(apiPath('GET','account', urlExtra)).then( (response) => {
			if (config.debugLevel) console.log(response)
			this.setState({
				status: response.status,
				data: response.data.data,
				error: null,
			})
			if (response.status !== 200) {
				return console.warn('Reset Request failed');
			}
			if (config.debugLevel > 1) console.log(response.data.data)
		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.warn(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
		});
	}

	handleChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
  }

	handleLogout(event) {
		event.preventDefault();

		axios.post(apiPath('POST', 'user', 'logout'))
			.then(this.props.handleLogout)
			.catch((error) => {
				var data = error?.response?.data ?? null
				if (data) {
					console.error(`${data.function}() - ${data.message}`)
				}
				else {
					console.log(error)
				}
			});
	}

	renderQuerySection = () => {
		const jsonStyle = {
			backgroundColor: '#f5f5f5',
			border: '1px solid #ddd',
			padding: '10px 15px',
			borderRadius: '3px',
		}

		//Data to display=
		const logoutView = <div style={{float: 'right'}} className="btn-group"><button disabled={!this.state.loggedIn} className="btn btn-warning" onClick={this.handleLogout}>Logout</button></div>
		const myJsonObject = this.state.data ?? {}

		const loginWithoutPasswordButton = <div style={{width:"45%"}}><button type="submit" className="btn btn-primary" onClick={this.handleLoginWithoutPassword} >Login without password</button><br/>
																				<code>POST {apiPath('POST', 'user', `guestLogin`, false)}<br/>
																					{"{"}<br/>
																					··link={this.state.websiteLink}<br/>
																					{"}"}</code><p/>
																				</div>

		const loginWithPassword = <div style={{width:"45%"}}><button type="submit" className="btn btn-primary" onClick={this.handleLoginWithPassword} >Login with password</button><br/>
																<code>POST {apiPath('POST', 'user', `guestLogin`, false)}<br/>
																	{"{"}<br/>
																	··link={this.state.websiteLink}<br/>
																	··password={this.state.websitePassword}<br/>
																	{"}"}</code><p/>
																</div>

		const listActiviveUsers = <div style={{width:"45%", 'display': 'flex'}}>
																<form className="form-inline">
																	<p/>
																	<button type="submit" className="btn btn-primary" onClick={this.handleListAccounts} >List Active Accounts</button><br/>
																	<code>GET {apiPath('GET', 'account', `active`, false)}</code><p/>
																</form>
															</div>

		const checkWebsiteLink = <div style={{width:"45%", 'display': 'flex'}}>
																<form className="form-inline">
																	<p/>
																	<button type="submit" className="btn btn-primary" onClick={this.handleCheckLink} >Check If Website Link Available </button><br/>
																	<code>GET {apiPath('GET', 'account', `checkLink`, false)}/{this.state.websiteLink} </code><p/>
																</form>
															</div>

		const hideGettingBody = this.state.data == null  ? {display: "none"} : {display: "block"}
		return (
			<div className="panel panel-default">
				<div className="panel-heading" style={{"width": "100%", display: 'inline-block'}} ><div style={{float: 'left', 'fontSize':'x-large'}}>Guest Logon</div>{logoutView}</div>
				<div className="panel-body">
				<div className="form-group" >
					<label>websiteLink</label>
					<input className="leftMargin form-control" style={{"width": "unset"}} type="text" name="websiteLink" value={this.state.websiteLink} onChange={this.handleChange} />
				</div><p />
				<div className="form-group">
					<label>websitePassword</label>
					<input className="leftMargin form-control" style={{"width": "unset"}} type="password" name="websitePassword" autoComplete="off" value={this.state.websitePassword} onChange={this.handleChange} />
				</div><p />

					<div style={{width:"100%", 'display': 'flex'}}>{loginWithoutPasswordButton}{loginWithPassword}</div>
					<br/>
					<div style={{width:"100%", 'display': 'flex'}}>{listActiviveUsers}{checkWebsiteLink}</div>
				</div>
				<div className="panel-body" style={hideGettingBody}>
					<p className='lead'>Status: <b>{this.state.status}</b></p>
					<ReactJson style={jsonStyle} src={myJsonObject} />
				</div>
			</div>
		)
	}


	//------------------------------------------------------------
	render() {
		console.log("%cPayment - render()", 'color: blue')
		const querySection = this.renderQuerySection();
		return (
			<div className="panel panel-default">
				{querySection}
			</div>
		);
	}
}