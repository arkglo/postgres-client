import React, { Component } from 'react';
import axios from 'axios';
import ReactJson from 'react-json-view'
import * as config from '../config/config'

import { apiPath } from '../lib/apiPath'


//------------------------------------------------------------
function initialState() {
	return {
		data: null,
		selectedButton: -1,
		orderNumber: '',
		accountNumber: 1
	};
}

//============================================================
export default class Message extends Component {
	constructor(props) {
		super(props);
		this.state = initialState();

		this.handleAccountMessageSection = this.handleAccountMessageSection.bind(this);
		this.handleOrderMessagesSection = this.handleOrderMessagesSection.bind(this);
		this.handleAccountMessageSubmit = this.handleAccountMessageSubmit.bind(this);
		this.handleOrderMessagesSubmit = this.handleOrderMessagesSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		console.log("Payment.componentDidMount()")
		this.setState({accountNumber: this.props.accountId});
	}
	
	//------------------------------------------------------------
	handleAccountMessageSection(event) {
		event.preventDefault();  // IMPORTANT.
		this.setState({selectedButton: 6})
	}
	handleAccountMessageSubmit(event) {
		event.preventDefault();  // IMPORTANT.

		//Setup some data
		const accNumber = this.state.accountNumber;
		console.log(`Payment.getAccountMessages(${accNumber})`)
		if (this.props.accountId === null) {
			console.log("  accountId not set - skip handleAccountMessageSection")
			return
		}

		axios.get(apiPath('GET','/accounts/messages', accNumber)).then((response) => {
			console.log('API STATUS: ' + response.status)
			// console.log(response.data)
			const data = response.data.data
			if (response.status !== 200) {
				this.setState({
					status: response.status,
					data: data ?? null,
					error: {
						status: response.status,
						function: response.data.function ?? null,
						message: response.data.message ?? null
					}
				})
				console.log('Error:')
				console.log(response)
				return console.warn('Failed to get data');
			}

			if (config.debugLevel > 1) console.log(data)
			this.setState({
				status: response.status,
				data: data,
				error: null,
			})
		}).catch((error) => {
			console.log('Error.catch():')
			console.log(error.response)
			this.setState({
				data: null,
				error: {
					status: error.response?.status ?? -1,
					function: error.response?.data?.function ?? null,
					message: error.response?.data?.message ?? null
				}
			})
			// console.log(error.response ?? 'no repsonse')
		});
	}

	handleOrderMessagesSection(event) {
		event.preventDefault();  // IMPORTANT.
		this.setState({selectedButton: 7})
	}
	handleOrderMessagesSubmit(event) {
		event.preventDefault();  // IMPORTANT.

		//Setup some data
		const orderNumber = this.state.orderNumber;
		console.log(`Payment.getMessages(${orderNumber})`)

		axios.get(apiPath('GET','/message/order', orderNumber)).then((response) => {
			console.log('API STATUS: ' + response.status)
			// console.log(response.data)
			const data = response.data.data
			if (response.status !== 200) {
				this.setState({
					status: response.status,
					data: data ?? null,
					error: {
						status: response.status,
						function: response.data.function ?? null,
						message: response.data.message ?? null
					}
				})
				console.log('Error:')
				console.log(response)
				return console.warn('Failed to get data');
			}

			if (config.debugLevel > 1) console.log(data)
			this.setState({
				status: response.status,
				data: data,
				error: null,
			})
		}).catch((error) => {
			console.log('Error.catch():')
			console.log(error.response)
			this.setState({
				data: null,
				error: {
					status: error.response?.status ?? -1,
					function: error.response?.data?.function ?? null,
					message: error.response?.data?.message ?? null
				}
			})
			// console.log(error.response ?? 'no repsonse')
		});
	}

	handleChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
  }

	clearLowerSection() {
		this.setState({lower: null})
	}

	renderQuerySection = () => {
		const jsonStyle = {
			backgroundColor: '#f5f5f5',
			border: '1px solid #ddd',
			padding: '10px 15px',
			borderRadius: '3px',
		}

		//Data to display
		const myJsonObject = this.state.data ?? {}
		if( this.state.getNumber == null ) {
			this.setState({getNumber: this.props.accountId})
		}

		const messageAccountButton = <button type="submit" className="btn btn-primary" onClick={this.handleAccountMessageSection} >Get Messages For Account</button>
		const messageOrderButton = <button type="submit" className="btn btn-primary" onClick={this.handleOrderMessagesSection} >Get Message For Order</button>

		let accountNumberSection = null
		if( this.state.selectedButton === 6 )
			accountNumberSection = <div className="form-group">
				<label>Account Number</label><input style={{ width: 'unset' }} className="form-control" type="number" name="accountNumber" value={this.state.accountNumber} onChange={this.handleChange} />
				<button type="submit" className="btn btn-primary" onClick={this.handleAccountMessageSubmit} >Send Request</button>
				</div>

		let orderNumberSection = null
		if( this.state.selectedButton === 7 )
			orderNumberSection = <div className="form-group">
				<label>Order Number</label><input style={{ width: 'unset' }} className="form-control" type="text" name="orderNumber" value={this.state.orderNumber} onChange={this.handleChange} />
				<button type="submit" className="btn btn-primary" onClick={this.handleOrderMessagesSubmit} >Send Request</button>
				</div>

		const hideGettingBody = !(this.state.selectedButton >= 6 && this.state.selectedButton <= 9) ? {display: "none"} : {display: "block"}
		return (
			<div className="panel panel-default">
				<div className="panel-heading">Get Message Details</div>
				<div className="panel-body">
					{messageAccountButton}
					{messageOrderButton}
					<br/>
					{accountNumberSection}
					{orderNumberSection}
				</div>
				<div className="panel-body" style={hideGettingBody}>
					<p className='lead'>Status: <b>{this.state.status}</b></p>
					<ReactJson style={jsonStyle} src={myJsonObject} />
				</div>
			</div>
		)
	}


	//------------------------------------------------------------
	render() {
		console.log("%cPayment - render()", 'color: blue')
		const querySection = this.renderQuerySection();
		return (
			<div className="panel panel-default">
				{querySection}
			</div>
		);
	}
}