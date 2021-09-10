// For editing one user's details. Can edit password as well.
import React, { Component } from 'react';
import axios from 'axios';
import { apiPath } from '../lib/apiPath'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Error from './error';

export default class UserEditView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			firstName: '',
			lastName: '',
			dob: '',
			addressLine1: '',
			addressPostCode: '',
			addressCity: '',
			password: '',
			password2: '',
			role: '',
			dobObject: null
		};

		console.log(props)

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
	}

	componentDidMount(){
		console.log("UserEditView.componentDidMount()")

		axios.get(apiPath('GET','user', this.props.user.id)).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get user details.');
			}
			const user = response.data.data
			console.log(user)
			
			let DOB = null
			if ( user.dob !== "" ) {
				const dateArray = user.dob.split("/");
				DOB = new Date( dateArray[2]+"-"+dateArray[1]+"-"+dateArray[0]);
			}
			this.setState({
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				dob: user.dob,
				addressLine1: user.addressLine1,
				addressPostCode: user.addressPostCode,
				addressCity: user.addressCity,
				password: '',  // Empty means no change.
				password2: '',
				role: user.role,
				dobObject: DOB
			})
		}).catch((error) => {
			Error.message(error.response)
		})
	}

	handleChange(event) {
		const target = event.target;
		let value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		if(name === "role") value = value ? "admin" : "user" 
		// console.log(`name: ${name}, value: ${value}`)
		this.setState({
			[name]: value
		});
	}

	handleSubmit(event) {
		event.preventDefault();  // IMPORTANT.
		console.log("------------------- handleSubmit()")
		var req = {}

		// only add new fields if changed and valid
		if (this.state.password) {
			if (this.state.password.length < 6) {
				return console.error('Password is too short.');
			}
			if (this.state.password !== this.state.password2) {
				return console.error('Passwords do not match.');
			}
			req.password = this.state.password;
		}

		if(this.state.email !== this.props.user.email && this.state.email.length > 0) { 
			req.email = this.state.email
		}
		if(this.state.firstName !== this.props.user.firstName && this.state.firstName.length > 0) { 
			req.firstName = this.state.firstName
		}
		if(this.state.dob !== this.props.user.dob && this.state.dob.length > 0) {
			req.dob = this.state.dob;
		}
		if(this.state.addressLine1 !== this.props.user.addressLine1 && this.state.addressLine1.length > 0) { 
			req.addressLine1 = this.state.addressLine1
		}
		if(this.state.addressPostCode !== this.props.user.addressPostCode && this.state.addressPostCode.length > 0) { 
			req.addressPostCode = this.state.addressPostCode
		}
		if(this.state.addressCity !== this.props.user.addressCity && this.state.addressCity.length > 0) { 
			req.addressCity = this.state.addressCity
		}
		if(this.state.lastName !== this.props.user.lastName && this.state.lastName.length > 0) { 
			req.lastName = this.state.lastName
		}
		if(this.state.role !== this.props.user.role && this.state.role.length > 0) { 
			req.role = this.state.role
		}

		axios.put(apiPath('PUT','user', this.props.user.id), req).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to update user.');
			}
			console.log('Updated user details!');
		}).catch((error) => {
			Error.message(error.response)
		});
	}
	handleDateChange(newDate) {
		const dobString = newDate === null ? '' : new Intl.DateTimeFormat('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}).format(newDate)
		this.setState({ dob: dobString, dobObject: newDate});
	}

	handleRemove(event, userID) {
		event.preventDefault();
		console.log("------------------- handleRemove()")
		confirmAlert({
			title: 'Confirm',
			message: 'Are you VERY sure you want to delete the User?',
			buttons: [
				{
					label: "Yes",
					onClick: () => {
						axios.delete(apiPath('DELETE','user', this.props.user.id)).then((response) => {
							if (response.status !== 200) {
								return console.warn('Failed to remove user.');
							}
							console.log('Successfully deleted user.');
							this.props.handleLogout()
						}).catch((error) => {
							Error.message(error.response)
						});
					}
				},
				{
					label: "No",
					
				}
			]
		});
	}

	render() {
		const thisAdmin = this.state.role === "admin"

		return (
			<div className="panel panel-default">
				<div className="panel-heading">User Edit</div>
				<div className="panel-body">

					<form className="form">
					
					<div className="form-group">
							<label>Email</label>
							<input className="form-control" type="text" name="email" value={this.state.email} onChange={this.handleChange} />
						</div>
					
						<div className="form-group">
							<label>First Name</label>
							<input className="form-control" type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
						</div>
					
						<div className="form-group">
							<label>Last Name</label>
							<input className="form-control" type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
						</div>

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
						
						<div className="form-group">
							<label>Password (leave empty if you do not want to change)</label>
							<input className="form-control" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
						</div>

						<div className="form-group">
							<label>Confirm password</label>
							<input className="form-control" type="password" name="password2" value={this.state.password2} onChange={this.handleChange} />
						</div>

						<div className="form-group">
							<label>Admin</label>
							<input style={{ width: '34px' }} className="form-control" type="checkbox" name="role" checked={thisAdmin} onChange={this.handleChange} /><br/>
						</div>

						<div className="btn-group">
							<button className="btn btn-primary" onClick={ this.handleSubmit } >Update</button>
						</div>
						<div className="btn-group">
							<button className="btn btn-danger" onClick={ this.handleRemove } >Remove</button>
						</div>
					</form>
				</div>
			</div>
			);
	}
}