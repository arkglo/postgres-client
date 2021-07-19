import React, { Component } from 'react'
import { Button, ButtonGroup, FormControl } from 'react-bootstrap'
import ReactJson from 'react-json-view'
import axios from 'axios'
import * as config from '../config/config'

import { apiPath } from '../lib/apiPath'

import Error from './error';

//------------------------------------------------------------
function initialState() {
	return {
		endpoint: null,
		requestType: null,
		data: null,
		showId: false,
		id: null,
		error: null,
	};
}

//============================================================
export default class Admin extends Component {
	constructor(props) {
		super(props);
		this.state = initialState()
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	componentDidMount() {
		console.log("Admin.componentDidMount()")
		// this.getServices()
	}

	getData() {
		console.log("Admin.getData()")

		axios.get(apiPath('GET', 'services')).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get user details.');
			}

			// console.log(response.data)
			const services = response.data
			console.log(services)
			this.setState({
				services: services
			});
		}).catch((error) => {
			Error.message(error)
		});
	}

	handleChange(event) {
		// console.log(`CHANGE: ${event.target.value}`)
		this.setState({ id: event.target.value, error: null })
	}

	handleClick(event) {
		const t = event.target
		console.log('CLICK: ' + t)
		// console.log(t)

		if (t.title === 'endpoint') {
			this.setState({ 
				endpoint: t.value, 
				error: null })
		}
		else if (t.title === 'type') {
			this.setState({ requestType: t.value })

			if (t.value === 'GET') {
				this.setState({
					requestType: t.value,
					showId: false,
					id: null,
					error: null,
				})
			}
			else if (t.value === 'GETID') {
				this.setState({
					requestType: 'GET',
					showId: true,
					error: null,
				})
			}
		}
		// console.log(this.state)
	}

	//------------------------------------------------------------
	handleSubmit(event) {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.

		if (!this.state.requestType || !this.state.endpoint) {
			console.log('API NOT SET ... skip request')
			return
		}

		if (this.state.requestType === 'GET') {
			const extra = this.state.id ?? null
			axios.get(apiPath('GET', this.state.endpoint, extra)).then((response) => {
				console.log('API STATUS: ' + response.status)
				if (response.status !== 200) {
					console.log(response)
					return console.warn('Failed to get data');
				}

				// console.log(response.data)
				const data = response.data
				if (config.debugLevel > 1) console.log(data)
				this.setState({
					data: data
				});
			}).catch((error) => {
				this.setState({
					data: null,
					error: {
						code: error.response.status,
						function: error.response.data.function ?? null,
						message: error.response.data.message ?? null
					}
				})
				// console.log(error.response ?? 'no repsonse')
			});
		}
	}

	//------------------------------------------------------------
	renderError = () => {
		if (config.debugLevel > 0) console.log("  renderError()")
		if (!this.state.error) {
			console.log('    SKIP')
			return
		}
		const err = this.state.error

		const errorStyle = {
			backgroundColor: '#ffd4d4',
			border: '1px solid #ddd',
			padding: '5px',
			borderRadius: '3px',
			margin: '10px',
			display: 'inline-block',
		}
		return (
			<div style={errorStyle}>
				<div className="panel-heading">
					<strong>{err.code ?? '404'}</strong> {err.function ?? 'Error'}<br />
					<small>{err.message}</small>
				</div>
			</div>
		)
	}

	//------------------------------------------------------------
	renderEndpoints = () => {
		if (config.debugLevel > 1) console.log("  renderForm()")
		return (
			<>
				<ButtonGroup aria-label="Endpoints">
					<Button variant='primary' title='endpoint' value='user' onClick={this.handleClick}>Users</Button>
					<Button variant='primary' title='endpoint' value='account' onClick={this.handleClick}>Accounts</Button>
					<Button variant='primary' title='endpoint' value='theme' onClick={this.handleClick}>Themes</Button>
					<Button variant='primary' title='endpoint' value='myGifts' onClick={this.handleClick}>myGifts</Button>
					<Button variant='primary' title='endpoint' value='services' onClick={this.handleClick}>Services</Button>
				</ButtonGroup><br />
				<ButtonGroup aria-label='REST Calls'>
					<Button variant='info' title='type' value='GET' onClick={this.handleClick}>GET all</Button>
					<Button variant='info' title='type' value='GETID' onClick={this.handleClick}>GET:id</Button>
					{this.state.showId &&
						<FormControl inline
							type="number"
							placeholder="ID"
							aria-label="Input group example"
							aria-describedby="btnGroupAddon"
							onChange={this.handleChange}
						/>}
				</ButtonGroup>

			</>
		)
		//interpunt U+00B7
	}

	//------------------------------------------------------------
	generateURL() {
		let type = this.state.requestType ?? `(TYPE NOT SET)`
		let api = '(ENDPOINT NOT SET)'
		if (this.state.endpoint) {
			if (this.state.id) { api = apiPath(type, this.state.endpoint, this.state.id) }
			else { api = apiPath(type, this.state.endpoint, this.state.id) }
		}
		
		return <code> {type} {api}</code>
	}
	
	//------------------------------------------------------------
	render() {
		console.log("%cServices - render()", 'color: yellow')

		//The button groups
		const endPoints = this.renderEndpoints()

		//Data to display
		const myJsonObject = this.state.data ?? {}


		//URL display
		const url = this.generateURL()
		const jsonStyle = {
			backgroundColor: '#f5f5f5',
			border: '1px solid #ddd',
			padding: '10px 15px',
			borderRadius: '3px',
		}

		const errorToast = this.renderError()

		//And Render...
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<span className="navbar-brand">Admin</span>
					{endPoints}<p />
					{url}<p />
					<button type="submit" className="btn btn-success" onClick={this.handleSubmit}>Submit</button>
					{errorToast}
				</div>


				<div className="panel-body">
					<ReactJson style={jsonStyle} src={myJsonObject} />
				</div>
			</div>
		)
	}
}