// For editing one user's details. Can edit password as well.
import React, { Component } from 'react';
import axios from 'axios';
import { apiPath } from '../lib/apiPath'

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
			password: '',
			password2: '',
			role: '',
			user: this.props.user,
			dobObject: null
		};

		console.log(props)

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount(){
		console.log("UserEditView.componentDidMount()")
		this.getUserDetails()
	}

	getUserDetails() {
		axios.get(apiPath('GET','user', this.props.user.id)).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get user details.');
			}
			const user = response.data.data
			console.log(user)
			
			this.setState({
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				password: '',  // Empty means no change.
				password2: '',
				role: user.role
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

		if(this.state.email !== this.state.user.email && this.state.email.length > 0) { 
			req.email = this.state.email
		}
		if(this.state.firstName !== this.state.user.firstName && this.state.firstName.length > 0) { 
			req.firstName = this.state.firstName
		}
		if(this.state.lastName !== this.state.user.lastName && this.state.lastName.length > 0) { 
			req.lastName = this.state.lastName
		}
		if(this.state.role !== this.state.user.role && this.state.role.length > 0) { 
			req.role = this.state.role
		}

		axios.put(apiPath('PUT','user', this.props.user.id), req).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to update user.')
			}
			console.log('Updated user details!')
			this.props.toastThis(<div>Updated user details</div>, 'success', 1000)
			this.setState({user: {...this.state.user, ...req}}) // update original structure, so if we change anything else it will be caught
			console.log('state.user updated')
			this.getUserDetails()
		}).catch((error) => {
			this.props.showError({
				status: error.response.status ?? 404,
				function: error.response.data.function ?? null,
				message: error.response.data.message ?? null,
				timeout: 2000,
			})
			Error.message(error.response)
		})
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
		console.log(`%cApp - render('UserEditView: ${this.props?.user?.id}')`, 'color: yellow')
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
						</div><br />
						<code>PUT {apiPath('PUT', 'user', null, false)}</code>
					</form>
				</div>
			</div>
			);
	}
}