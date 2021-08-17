import React, { Component } from 'react';
import axios from 'axios';

import { apiPath } from '../lib/apiPath'

import Error from './error';

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
		this.handleSubmit = this.handleSubmit.bind(this);
		// this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		console.log("Services.componentDidMount()")
		this.getServices()
	}

	getServices() {
		console.log("Services.getServices()")

		axios.get(apiPath('GET','services')).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get user details.');
			}

			// console.log(response.data)
			const services = response.data.data
			console.log(services)
			this.setState({
				services: services
			});
		}).catch((error) => {
			Error.message(error)
		});
	}

	async createService(title, price) {
		await axios.post(apiPath('POST','services'), {
			title: title,
			price: price
		}).then((response) => {
			if (response.status !== 201) {
				return console.warn('Failed to create service.');
			}
			console.log(`Created service [${title}]!`)
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
	handleSubmit(event) {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		this.createService("Website", 0.00)
		this.createService("Gift Registry", 10.00)
		this.createService("RSVP", 15.20)
		setTimeout(() => { this.getServices() }, 500)
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

		let testInitialise = null
		if (allServicesLength === 0) {
			testInitialise = <button type="submit" className="btn btn-primary" onClick={this.handleSubmit} >Initialise with Test Data</button>
		}

		return (
			<div className="panel panel-default">
				<div className="panel-heading">Services ({allServicesLength})</div>
				<code>GET {apiPath('GET', 'services')}</code>

				<div className="panel-body">
					{servicesList}
					{testInitialise}
				</div>
			</div>
		);
	}
}