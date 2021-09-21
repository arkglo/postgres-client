import React, { Component } from 'react';
import axios from 'axios';

import { apiPath } from '../lib/apiPath'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//------------------------------------------------------------
function initialState() {
	return {
		firstName: '',
		lastName: '',
		dob: '',
		addressLine1: '',
		addressPostCode: '',
		addressCity: '',
		partnerFirstName: '',
		partnerLastName: '',
		email: '',
		password: '',
		password2: '',
		dobObject: null
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
		this.handleDateChange = this.handleDateChange.bind(this);
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

			axios.post(apiPath('POST','account'), {
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			dob: this.state.dob,
			addressLine1: this.state.addressLine1,
			addressPostCode: this.state.addressPostCode,
			addressCity: this.state.addressCity,
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
		axios.post(apiPath('POST','account'), account).then((response) => {
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
					dob: "13/09/1938",
					addressLine1: "Palace of Westminster",
					addressPostCode: "SW1A 0AA",
					addressCity: "London",
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
					dob: "05/04/1954",
					addressLine1: "Stonehenge",
					addressPostCode: "SP4 7DE",
					addressCity: "Salisbury ",
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
					dob: "07/01/1985",
					addressLine1: "32 St James’s Street",
					addressPostCode: "SW1A 1HD",
					addressCity: "London",
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
	handleDateChange(newDate) {
		const dobString = newDate === null ? '' : new Intl.DateTimeFormat('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}).format(newDate)
		this.setState({ dob: dobString, dobObject: newDate});
	}

	//------------------------------------------------------------
	render() {

		let params = <></>
		params = <div>{params}&nbsp;&nbsp;&nbsp;firstName: {'\''}{this.state.firstName}{'\''}<br /></div>
		params = <div>{params}&nbsp;&nbsp;&nbsp;lastName: {'\''}{this.state.lastName}{'\''}<br /></div>
		params = <div>{params}&nbsp;&nbsp;&nbsp;dob: {'\''}{this.state.dob}{'\''}<br /></div>
		params = <div>{params}&nbsp;&nbsp;&nbsp;addressLine1:{'\''}{this.state.addressLine1}{'\''}<br /></div>
		params = <div>{params}&nbsp;&nbsp;&nbsp;addressPostCode: {'\''}{this.state.addressPostCode}{'\''}<br /></div>
		params = <div>{params}&nbsp;&nbsp;&nbsp;addressCity: {'\''}{this.state.addressCity}{'\''}<br /></div>
		params = <div>{params}&nbsp;&nbsp;&nbsp;partnerFirstName: {'\''}{this.state.partnerFirstName}{'\''}<br /></div>
		params = <div>{params}&nbsp;&nbsp;&nbsp;partnerLastName: {'\''}{this.state.partnerLastName}{'\''}<br /></div>
		params = <div>{params}&nbsp;&nbsp;&nbsp;email: {'\''}{this.state.email}{'\''}<br /></div>
		params = <div>{params}&nbsp;&nbsp;&nbsp;password: {'\''}{this.state.password}{'\''}<br /></div>
		params = <code>{'{'}<br />{params}{'}'}</code>

		return (
			<>
				<div className="panel panel-default">
					<div className="panel-heading">Signup</div>
					<div className="panel-body">
						<form className="form">

							<h4>Required for Account setup</h4>
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

							<h4>Additional fields required for Stripe Custom Account setup</h4>
							<div className="form-group">
								<label>Date Of Birth</label>
								<DatePicker
									dateFormat="dd/MM/yyyy"
									selected={this.state.dobObject}
									onSelect={this.handleDateChange} //when day is clicked
									onChange={this.handleDateChange} //only when value has changed
								/>
							</div>

							<div className="form-group">
								<label>Address Line 1</label>
								<input className="form-control" type="text" name="addressLine1" value={this.state.addressLine1} onChange={this.handleChange} />
							</div>

							<div style={{display: 'flex'}}>
								<div className="form-group">
									<label>Address Postal Code</label>
									<input style={{ width: 'unset' }} className="form-control" type="text" name="addressPostCode" value={this.state.addressPostCode} onChange={this.handleChange} />
								</div>

								<div style={{ 'marginLeft': '15px', 'width': '100%'}} className="form-group">
									<label>Address City</label>
									<input className="form-control" type="text" name="addressCity" value={this.state.addressCity} onChange={this.handleChange} />
								</div>
							</div>

							<code>POST {apiPath('POST', 'user')}<br/></code>{params}<br/>
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