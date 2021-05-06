import React, { Component } from 'react';
import axios from 'axios';

import * as config from '../config';

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

		axios.post(config.apiPath('account'), {
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
	render() {
		return (
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

						<button type="submit" className="btn btn-primary" onClick={this.handleSubmit} >Sign up</button>
					</form>
				</div>
			</div>
		);
	}
}