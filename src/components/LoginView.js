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

	componentDidMount(){
		if(this.user && this.user.accounts) {
			this.props.setAccountId(this.props.user.accounts[0].id);
		}
	}

	//===========================================================================
	//Functions
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

		axios.post(config.apiPath('user','login'), {
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
		
		axios.post(config.apiPath('user', 'logout'))
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

	//===========================================================================
	//Render
	renderForm() {
		return (
			<form className="form-inline">
				<div className="form-group">
					<label>Email</label>
					<input className="leftMargin form-control" type="text" name="email" value={this.state.email} onChange={this.handleChange} />
				</div><p />
				<div className="form-group">
					<label>Password</label>
					<input className="leftMargin form-control" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
				</div><p/>
				<button type="submit" className="btn btn-primary" onClick={this.handleLogin} >Login</button>
			</form>
		);
	}

	setAccount = (id) => { this.props.setAccountId(id) }

	// User logged in.
	renderStatus() {
		const user = this.props.user;
		const renAccountsData = user.accounts.map((data,idx) => 
			<li key={idx}><button onClick={this.setAccount.bind(this, data.id)}>Select Account {data.id}</button></li>
		);
		return (
			<div>
				<span>Welcome {this.props.user.firstName} {this.props.user.lastName}!</span><p />
				<span>Accounts({this.props.user.accounts.length})</span><p />
				<span>
				<ul>
				{renAccountsData}
				</ul>
				</span>
				<p />
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