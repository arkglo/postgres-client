import React, { Component } from 'react';
import axios from 'axios';
import * as config from '../config/config';
import { apiPath } from '../lib/apiPath'

import { ToastContainer, toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "animate.css/animate.min.css";

const drop = cssTransition({
	enter: "animate__animated animate__slideInDown",
	exit: "animate__animated animate__hinge"
});

function passwordError(message, runOnClose) {
	let toastOptions = {
		position: "top-center",
		autoClose: 10000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		transition:drop
	};
	if( runOnClose !== undefined || runOnClose !== null || runOnClose !== "" ) {
		toastOptions.onClose = runOnClose
	}
	const niceMessage = <div>{message}<br/><br/>The token has now become INVALID you must request a new one.</div>
	toast.error( niceMessage, toastOptions );
}


//============================================================
export default class ResetPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			"password": ""
		}
		this.sendReset = this.sendReset.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.returnToNormal = this.returnToNormal.bind(this);
		this.returnToNormalButton = this.returnToNormalButton.bind(this);
	}

	getQueryVariable(variable) {
		var query = this.props.location.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split('=');
				if (decodeURIComponent(pair[0]) === variable) {
						return decodeURIComponent(pair[1]);
				}
		}
		console.log('Query variable %s not found', variable);
		return null;
	}

	getToken() {
		return this.getQueryVariable("token");
	}

	getEmail() {
		return this.getQueryVariable("email");
	}

	componentDidMount() {
		console.log("ResetPassword.componentDidMount()")
	}


	//------------------------------------------------------------
	sendReset(event)  {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.

		axios.post(apiPath('POST','user', 'resetPassword'), {
			email: this.getEmail(),
			token: this.getToken(),
			password: this.state.password,
		}).then( (response) => {
			if (config.debugLevel) console.log(response)
			if (response.status !== 200) {
				console.warn('Reset Request failed');
				passwordError('Reset Request failed', this.returnToNormal);
			}
			else {
				console.log('Password Reset');
				this.returnToNormal(event);
			}
		}).catch((error) => {
			this.props.toastError(true, error, null);
		});
	}

	returnToNormalButton(event)  {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		this.returnToNormal();
	}

	returnToNormal()  {
		const currentLocation = window.location.toString();
		var point = currentLocation.indexOf("/resetPassword")
		if( point !== -1 )
			window.location = currentLocation.slice(0, point)
		else
			window.location = "http://localhost:3000/billy";
	}

	handleChange(event) {
		const target = event.target
		const value = target.type === 'checkbox' ? target.checked : target.value
		const name = target.type === 'color' ? target.name.split('-')[1] : target.name
		// console.log("Change: " + name + ", new Value: " + value)
		this.setState({
			[name]: value
		})
	}

	//------------------------------------------------------------
	render() {
		console.log("%cResetPassword - render()", 'color: yellow')
		let summaryHeader = <div>Your token is <strong>{this.getToken()}</strong><br/>For the email address <strong>{this.getEmail()}</strong><br/></div>
		let resetPasswordSection = <div>
																	<form className="form-inline">
																		<p style={{'margin': '17px', 'fontWeight': '700'}} >Enter new password</p>
																		<div className="form-group">
																			<label>Password</label>
																			<input className="leftMargin form-control" type="password" name="password" autoComplete="off" value={this.state.password} onChange={this.handleChange} />
																		</div><p />
																		<code>POST {apiPath('POST', 'user', `resetPassword`, false)}<br/>
																		{"{"}<br/>
																		··email={this.getEmail()}<br/>
																		··token={this.getToken()}<br/>
																		··password={this.state.password}<br/>
																		{"}"}</code><p/>
																		<button type="submit" className="btn btn-primary" onClick={this.sendReset} >Reset Password</button>
																	</form>
																	<p />
																	<div className="btn-group">
																		<button className="btn btn-warning" onClick={this.returnToNormalButton} >Cancel</button>
																	</div>
																</div>

		return (
			<div className="panel panel-default">
				<div className="panel-heading">Reset Password</div>

				<div className="panel-body">
					{summaryHeader}
					{resetPasswordSection}
				</div>
				<ToastContainer />
			</div>
		);
	}
}