import React, { Component } from 'react';
import axios from 'axios';

import { apiPath } from '../lib/apiPath'

//------------------------------------------------------------
function initialState() {
	return {
		services: null,
	};
}

//============================================================
export default class Services extends Component {
	constructor(props) {
		super(props);
		this.state = initialState();
		// this.handleSubmit = this.handleSubmit.bind(this);
		// this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		console.log("Services.componentDidMount()")

		axios.get(apiPath('services')).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get user details.');
			}

			// console.log(response.data)
			const services = response.data
			console.log(services)
			this.setState( {
				services: services
			});
		}).catch((error) => {
			Error.message(error)
		});
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

	//------------------------------------------------------------
	render() {
		console.log("%cServices - render()", 'color: yellow')

		//AllThemes
		let allServicesLength = 0
		let servicesList = null
		if (this.state.services != null) {
			allServicesLength = this.state.services.length
			servicesList = this.state.services.map((data, idx) =>
				<li key={idx}>{data.id} - {data.title} - ${data.price}</li>
			)
		}

		return (
			<div className="panel panel-default">
				<div className="panel-heading">Services ({allServicesLength})</div>
				<div className="panel-body">
					{servicesList}
				</div>
			</div>
		);
	}
}