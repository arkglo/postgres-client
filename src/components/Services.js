import React, { useState, useEffect } from 'react';
import axios from 'axios'

import { apiPath } from '../lib/apiPath'

import Error from './error'

//============================================================
const Services = (props) => {
	//Declare our states
	const [services, setServices ] = useState(null)

	//------------------------------------------------------------
	// Functions
	const getServices = async () => {
		console.log("Services.getServices()")

		await axios.get(apiPath('GET','services')).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get user details.');
			}

			// console.log(response.data)
			const services = response.data.data
			console.log(services)
			setServices(services)
		}).catch((error) => {
			Error.message(error)
		});
	}

	const createService = async (title, price) => {
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
	const handleSubmit = (event) => {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		createService("Website", 0.00)
		createService("Gift Registry", 10.00)
		createService("RSVP", 15.20)
		setTimeout(() => { getServices() }, 500)
	}


	//===========================================================================
	//Render functions
	const render = () => {
		console.log("%cServices - render()", 'color: yellow')

		//AllThemes
		let allServicesLength = 0
		let servicesList = null
		if (services != null) {
			allServicesLength = services.length
			servicesList = services.map((data, idx) =>
				<li key={idx}>{data.id} - {data.title} - ${data.price}</li>
			)
		}

		let testInitialise = null
		if (allServicesLength === 0) {
			testInitialise = <button type="submit" className="btn btn-primary" onClick={handleSubmit} >Initialise with Test Data</button>
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
		)
	}

	//===========================================================================
	//REACT Effects

	// OnMount
	useEffect(() => {
		console.log('***Services MOUNT ***')
		//console.log(props)
		getServices()
	},[props])

	//per Render
	// useEffect(() => { console.log("%cServices - render()", 'color: blue') })

	//===========================================================================
	//Start the actual Render....
	return ( <div>{render()}</div>)
}

export default Services