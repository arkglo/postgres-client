import React, { Component } from 'react';
import axios from 'axios';

import * as config from '../config';

export default class LoginView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: '<first name>',
			lastName: '<last name>',
			email: 'test@email.com',
			password: 'password',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}

	handleLogin(event) {
		event.preventDefault();  // IMPORTANT.
		axios.post(config.SERVER_URL + config.SERVER_PATH + config.USER_ENDPOINT + '/login', {
			email: this.state.email,
			password: this.state.password,
		}).then(this.props.handleLogin)
			.catch((error) => {
				var data = error?.response?.data ?? null
				if (data) {
					console.warn(`${data.function}() - ${data.message}`)
				}
				else {
					console.log(error)
				}
			});
	}

	handleLogout(event) {
		event.preventDefault();
		axios.post(config.SERVER_URL + config.SERVER_PATH + config.USER_ENDPOINT + '/logout')
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

	renderForm() {
		return (
			<form className="form-inline">
				<div className="form-group">
					<label>Email</label>
					<input className="form-control" type="text" name="email" value={this.state.email} onChange={this.handleChange} />
				</div>
				<div className="form-group">
					<label>Password</label>
					<input className="form-control" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
				</div>
				<button type="submit" className="btn btn-primary" onClick={this.handleLogin} >Login</button>
			</form>
		);
	}

	// User logged in.
	renderStatus() {
		return (
			<div>
				<span>Welcome {this.props.user.firstName} {this.props.user.lastName}!</span><p/>
				<button type="submit"
					className="btn btn-primary"
					onClick={this.handleLogout}>
					Logout
				</button>
			</div>
		);
	}

	render() {
		var view;
		if (this.props.user) {
			view = this.renderStatus();
		} else {
			view = this.renderForm();
		}
		return (
			<div className="panel panel-default">
				<div className="panel-heading">User</div>
				<div className="panel-body">{view}</div>
			</div>
		);
	}
}