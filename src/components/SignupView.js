import React, { Component } from 'react';
import axios from 'axios';

import { apiPath } from '../lib/apiPath'

//------------------------------------------------------------
function initialState() {
	return {
		firstName: '',
		lastName: '',
		partnerFirstName: '',
		partnerLastName: '',
		email: '',
		password: '',
		password2: '',
	};
}

//============================================================
export default class SignupView extends Component {
	constructor(props) {
		super(props);
		this.state = initialState();
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCreateTestUser = this.handleCreateTestUser.bind(this);
	}

	//------------------------------------------------------------
	handleChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}

	//------------------------------------------------------------
	handleSubmit(event) {
		event.preventDefault();  // IMPORTANT.
		if (!this.state.password || this.state.password.length < 6) {
			//return console.error('Password too short.');
			console.log('Password too short')
			return
		}
		if (this.state.password !== this.state.password2) {
			// return console.error('Passwords do not match.');
			console.log('Password do not match')
			return
		}

		axios.post(apiPath('account'), {
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			partnerFirstName: this.state.partnerFirstName,
			partnerLastName: this.state.partnerLastName,
			email: this.state.email,
			password: this.state.password,
		}).then((response) => {
			if (response.status !== 201) {
				return console.warn('Failed to create account.');
			}
			console.log('Created new user!')
			this.props.handleLogout()
		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.error(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
		})
	}

	createAccount(account) {
		axios.post(apiPath('account'), account).then((response) => {
			if (response.status !== 201) {
				return console.warn('Failed to create account.');
			}
			console.log(`Created account [${account.firstName} ${account.lastName}]!`)
		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.error(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
		})
	}

	//------------------------------------------------------------
	handleCreateTestUser(event) {
		event.preventDefault();  // IMPORTANT.
		console.log(`handleCreateTestUser: ${event.target.id}`)
		// console.log(event)
		switch (event.target.id) {
			case 'TestAccount-1':
				this.createAccount({
					firstName: "John",
					lastName: "Smith",
					partnerFirstName: "Jane",
					partnerLastName: "Doe",
					email: "test@email.com",
					password: "password",
					websitePassword: "testPassword",
					gifts: { "gifts": [1, 2] }
				})
				break;
			case 'TestAccount-2':
				this.createAccount({
					firstName: "Arthur",
					lastName: "Pendragon",
					partnerFirstName: "Guinevere",
					partnerLastName: "Pendragon",
					email: "arthur@email.com",
					password: "password",
					gifts: { "gifts": [1, 2] }
				})
				break;
			case 'TestAccount-3':
				this.createAccount({
					firstName: "Lewis",
					lastName: "Hamilton",
					partnerFirstName: "Valtteri",
					partnerLastName: "Bottas",
					email: "f1@email.com",
					password: "password"
				})
				break;
			default:
				console.log("Unknown");
				break;
		}
		// const that = this.props.
		setTimeout(() => { this.props.handleReset() }, 1000)
	}

	//------------------------------------------------------------
	render() {
		return (
			<>
				<div className="panel panel-default">
					<div className="panel-heading">Signup</div>
					<div className="panel-body">
						<form className="form">

							<div className="form-group">
								<label>First Name</label>
								<input className="form-control" type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
							</div>

							<div className="form-group">
								<label>Last Name</label>
								<input className="form-control" type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
							</div>

							<div className="form-group">
								<label>Partner First Name</label>
								<input className="form-control" type="text" name="partnerFirstName" value={this.state.partnerFirstName} onChange={this.handleChange} />
							</div>

							<div className="form-group">
								<label>Partner Last Name</label>
								<input className="form-control" type="text" name="partnerLastName" value={this.state.partnerLastName} onChange={this.handleChange} />
							</div>

							<div className="form-group">
								<label>Email</label>
								<input className="form-control" type="text" name="email" value={this.state.email} onChange={this.handleChange} />
							</div>

							<div className="form-group">
								<label>Password</label>
								<input className="form-control" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
							</div>

							<div className="form-group">
								<label>Confirm password</label>
								<input className="form-control" type="password" name="password2" value={this.state.password2} onChange={this.handleChange} />
							</div>

							<button type="submit" className="btn btn-success" onClick={this.handleSubmit} >Sign up</button>
						</form>
					</div>
				</div>
				<div className="panel panel-default">
					<div className="panel-heading">PreConfigured Test data</div>
					<div className="panel-body">
						<li><button type="submit" className="btn btn-primary" onClick={this.handleCreateTestUser} id="TestAccount-1" >Create 'John Smith'</button></li>
						<li><button type="submit" className="btn btn-primary" onClick={this.handleCreateTestUser} id="TestAccount-2" >Create 'Arthur Pendragon'</button></li>
						<li><button type="submit" className="btn btn-primary" onClick={this.handleCreateTestUser} id="TestAccount-3" >Create 'Lewis Hamilton'</button></li>
					</div>
				</div>
			</>
		);
	}
}