import React, { Component } from 'react'
import { Button, ButtonGroup, Container, FormControl, Row, Col } from 'react-bootstrap'
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
		type: null,
		extra: null,
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

		switch (t.title) {
			case 'endpoint':
				this.setState({
					endpoint: t.value,
					error: null,
					extra: null,
				})
				break
			case 'type':
				// this.setState({ requestType: t.value })
				if (t.value === 'GET') {
					this.setState({
						requestType: t.value,
						showId: false,
						id: null,
						error: null,
						type: t.value,
					})
				}
				else if (t.value === 'GETID') {
					this.setState({
						requestType: 'GET',
						showId: true,
						error: null,
						type: t.value,
					})
				}
				else if (t.value === 'DELETE') {
					this.setState({
						requestType: t.value,
						showId: true,
						error: null,
						type: t.value,
					})
				}
				break
			case 'access':
				this.setState({
					extra: t.value === 'all' ? null : `access=${t.value}`,
				})
				break
			default:
				console.log(`Unkown details ${t}`)
				break
		}

		// console.log(this.state)
	}

	//------------------------------------------------------------
	handleSubmit(event) {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		console.log("Admin.handleSubmit()")

		if (!this.state.requestType || !this.state.endpoint) {
			console.log('API NOT SET ... skip request')
			return
		}

		if (config.debugLevel > 1) console.log(this.state)

		if (this.state.requestType === 'GET') {
			let extra = this.state.id ?? ''
			if (this.state.extra) extra += `?${this.state.extra}`
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
					data: data,
					error: null,
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
		if (this.state.requestType === 'DELETE') {
			let extra = this.state.id ?? ''
			if (this.state.extra) extra += `?${this.state.extra}`
			axios.delete(apiPath('GET', this.state.endpoint, extra)).then((response) => {
				console.log('API STATUS: ' + response.status)
				if (response.status !== 200) {
					console.log(response)
					return console.warn('Failed to remove item');
				}

				// console.log(response.data)
				const data = response.data
				if (config.debugLevel > 1) console.log(data)
				this.setState({
					data: data,
					error: null,
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
		else {
			console.warn(`Unknown request: ${this.state.requestType}`)
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
			padding: '2px 10px',
			borderRadius: '3px',
			margin: '10px',
			display: 'inline-block',
			verticalAlign: 'middle',
		}
		return (
			<div style={errorStyle}>
				
					<strong>{err.code ?? '404'}</strong> {err.function ?? 'Error'}<br />
					<small>{err.message}</small>
			</div>
		)
	}

	//------------------------------------------------------------
	renderEndpoints = () => {
		if (config.debugLevel > 1) console.log("  renderForm()")

		const darkerButton = { backgroundColor: '#a0a0a075' }
		let giftOptions = null;
		const access = this.setState.access
		if (this.state.endpoint === 'gifts') {
			giftOptions = <ButtonGroup aria-label='Gift options'>
				<Button style={darkerButton} variant='secondary' title='access' active={access === null} value='all' onClick={this.handleClick}>All</Button>
				<Button style={darkerButton} variant='secondary' title='access' active={access === 'public'} value='public' onClick={this.handleClick}>Public</Button>
				<Button style={darkerButton} variant='secondary' title='access' active={access === 'private'} value='private' onClick={this.handleClick}>Private</Button>
			</ButtonGroup>
		}

		const ep = this.state.endpoint
		const ty = this.state.type
		return (
			<>
				<ButtonGroup aria-label="Endpoints">
					<Button variant='primary' title='endpoint' value='user' active={ep === 'user'} onClick={this.handleClick}>Users</Button>
					<Button variant='primary' title='endpoint' value='account' active={ep === 'account'} onClick={this.handleClick}>Accounts</Button>
					<Button variant='primary' title='endpoint' value='theme' active={ep === 'theme'} onClick={this.handleClick}>Themes</Button>
					<Button variant='primary' title='endpoint' value='myGifts' active={ep === 'myGifts'} onClick={this.handleClick}>myGifts</Button>
					<Button variant='primary' title='endpoint' value='gifts' active={ep === 'gifts'} onClick={this.handleClick}>Gifts</Button>
					<Button variant='primary' title='endpoint' value='services' active={ep === 'services'} onClick={this.handleClick}>Services</Button>
				</ButtonGroup><br />
				<ButtonGroup aria-label='REST Calls'>
					<Button variant='info' title='type' value='GET' active={ty === 'GET'} onClick={this.handleClick}>GET all</Button>
					<Button variant='info' title='type' value='GETID' active={ty === 'GETID'} onClick={this.handleClick}>GET:id</Button>
					<Button variant='danger' title='type' value='DELETE' active={ty === 'DELETE'} onClick={this.handleClick}>DELETE</Button>
					{this.state.showId &&
						<FormControl inline='true' style={{width:'unset'}}
							type="number"
							placeholder="ID"
							aria-label="Input group example"
							aria-describedby="btnGroupAddon"
							onChange={this.handleChange}
						/>}
				</ButtonGroup>
				{giftOptions}
			</>
		)
		//interpunt U+00B7
	}

	//------------------------------------------------------------
	generateURL() {
		let type = this.state.requestType ?? `(TYPE NOT SET)`
		let api = '(ENDPOINT NOT SET)'
		let extra = this.state.id ?? ''
		if (this.state.extra) extra += `?${this.state.extra}`
		if (this.state.endpoint) {
			// if (this.state.id) {
			api = apiPath(type, this.state.endpoint, extra, false)
			// }
			// else { api = apiPath(type, this.state.endpoint, this.state.id) }
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
					<Container fluid>
						<Row>
							<Col>
								<span className="navbar-brand">Admin</span>
							</Col>
							<Col>
								{endPoints}<p />
								{url}<p />
								<button type="submit" className="btn btn-success" onClick={this.handleSubmit}>Submit</button>
								{errorToast}
							</Col>
						</Row>
					</Container>
				</div>


				<div className="panel-body">
					<ReactJson style={jsonStyle} src={myJsonObject} />
				</div>
			</div>
		)
	}
}