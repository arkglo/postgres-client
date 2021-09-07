import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import ReactJson from 'react-json-view'
import * as config from '../config/config'

import { apiPath } from '../lib/apiPath'

import { ToastContainer, toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "animate.css/animate.min.css";

const zoom = cssTransition({
  enter: "animate__animated animate__zoomInDown",
  exit: "animate__animated animate__zoomOutDown"
});
const drop = cssTransition({
	enter: "animate__animated animate__slideInDown",
	exit: "animate__animated animate__hinge"
});


//------------------------------------------------------------
function initialState() {
	return {
		data: null,
		selectedButton: -1,
		giftId: -1,
		giftValue: 0,
		giftNumber: '',
		orderNumber: '',
		paymentIntentId: '',
		getNumber: -1,
	};
}

function purchaseError(message) {
	toast.error( message, {
		transition:drop
	});
}
 
function redirectingToPurchase(message, url) {
	let toastOptions = {
		transition:zoom
	};
	if( url !== undefined || url !== null || url !== "" ) {
		toastOptions.onClose = () => {window.location = url;}
	}
	toast.info( message, toastOptions);
}

//============================================================
export default class Payment extends Component {
	constructor(props) {
		super(props);
		this.state = initialState();
		this.handlePayServiceSubmit = this.handlePayServiceSubmit.bind(this);
		this.handlePaymentSection = this.handlePaymentSection.bind(this);
		this.handlePaymentSubmit = this.handlePaymentSubmit.bind(this);
		this.handlePartPaymentSection = this.handlePartPaymentSection.bind(this);
		this.handlePartPaymentSubmit = this.handlePartPaymentSubmit.bind(this);

		this.handleRefundGiftSection = this.handleRefundGiftSection.bind(this);
		this.handleRefundGiftSubmit = this.handleRefundGiftSubmit.bind(this);
		this.handleRefundOrderSection = this.handleRefundOrderSection.bind(this);
		this.handleRefundOrderSubmit = this.handleRefundOrderSubmit.bind(this);
		this.handleRefundPaymentSection = this.handleRefundPaymentSection.bind(this);
		this.handleRefundPaymentSubmit = this.handleRefundPaymentSubmit.bind(this);

		this.handleGetPaymentsSection = this.handleGetPaymentsSection.bind(this);
		this.handleGetPaidSection = this.handleGetPaidSection.bind(this);
		this.handleGetRefundsSection = this.handleGetRefundsSection.bind(this);
		
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		//toast("componentDidMount!", {transition:bounce});
		console.log("Payment.componentDidMount()")
		this.setState({getNumber: this.props.accountId});
	}

	sendServicePayment(service) {
		console.log(`Payment.sendServicePayment(${this.props.accountId})`)
		if (this.props.accountId === null) {
			console.log("  accountId not set - skip sendServicePayment")
			return
		}

		axios.post(apiPath('POST','/payment/service/'), {
			accountID: this.props.accountId,
			items: service
		}).then((response) => {
			if (response.status !== 200) {
				purchaseError("Failed to create purchase");
				return console.warn('Failed to create payment.');
			}
			var serverResponce = response?.data?.data ?? null;
			
			const url = serverResponce?.url ?? null
			if( url !== null ) {
				redirectingToPurchase("Redirecting to purchase page...", url);
			}
			else {
				var orderId = serverResponce?.orderId ?? null
				if( orderId !== null ) {
					redirectingToPurchase(<div>{ ReactHtmlParser("Your purchase was free &#128512;<br/>Order Number is <b>"+orderId+"</b>") }</div>);
				}
			}

		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.error(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
			purchaseError("Purchase Failed");
		});
	};

	sendGiftPayment(gifts) {
		console.log(`Payment.sendGiftPayment(${this.props.accountId})`)
		if (this.props.accountId === null) {
			console.log("  accountId not set - skip sendGiftPayment")
			return
		}

		axios.post(apiPath('POST','/payment/gifts/'), {
			accountID: this.props.accountId,
			items: gifts
		}).then((response) => {
			if (response.status !== 200) {
				purchaseError("Failed to create purchase");
				return console.warn('Failed to create payment.');
			}
			var serverResponce = response?.data?.data ?? null;

			var url = serverResponce?.url ?? null
			if( url !== null ) {
				redirectingToPurchase("Redirecting to purchase page...", url);
			}
			else {
				var orderId = serverResponce?.orderId ?? null
				if( orderId !== null ) {
					redirectingToPurchase(<div>{ ReactHtmlParser("Your purchase was free &#128512;<br/>Order Number is <b>"+orderId+"</b>") }</div>);
				}
			}

		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.error(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
			purchaseError("Purchase Failed");
		});
	};

	requestRefundByOrderNumber(orderId) {
		console.log(`Payment.requestRefundByOrderNumber(${this.props.accountId} ${orderId})`)
		if (this.props.accountId === null) {
			console.log("  accountId not set - skip requestRefundByOrderNumber")
			return
		}

		axios.post(apiPath('POST','/payment/refundOrder/'), {
			accountID: this.props.accountId,
			orderNumber: orderId
		}	).then((response) => {
			if (response.status !== 200) {
				purchaseError("Failed to create refund");
				return console.warn('Failed to create refund.');
			}
			
			redirectingToPurchase("Refunded")

		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.error(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
			purchaseError("Refund Failed");
		});
	};

	requestRefundByGiftId(giftId) {
		console.log(`Payment.requestRefundByGiftId(${this.props.accountId} ${giftId})`)
		if (this.props.accountId === null) {
			console.log("  accountId not set - skip requestRefundByGiftId")
			return
		}

		axios.post(apiPath('POST','/payment/refundGift'), {
			accountID: this.props.accountId,
			giftNumber: giftId
		}).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to create refund.');
			}
			
			redirectingToPurchase("Refunded")

		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.error(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
			purchaseError("Refund Failed");
		});
	};

	requestRefundByPaymentId(paymentId) {
		console.log(`Payment.requestRefundByPaymentId(${this.props.accountId} ${paymentId})`)
		if (this.props.accountId === null) {
			console.log("  accountId not set - skip requestRefundByPaymentId")
			return
		}

		axios.post(apiPath('POST','/payment/refundPayment'), {
			accountID: this.props.accountId,
			giftNumber: paymentId
		}).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to create refund.');
			}
			
			redirectingToPurchase("Refunded")

		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.error(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
			purchaseError("Refund Failed");
		});
	};


	//------------------------------------------------------------
	handlePayServiceSubmit(event) {
		event.preventDefault();  // IMPORTANT.
		this.setState({selectedButton: 0})
		//Setup some initial data
		const service=[{id:1, quantity:1, value:0},{id: 2, quantity:1, value:10.00}];
		//const service=[{id:1, quantity:1, value:0}];
		this.sendServicePayment(service);
	}

	//------------------------------------------------------------
	handlePaymentSection(event) {
		event.preventDefault();  // IMPORTANT.
		if( this.state.selectedButton !== 1 ) {
			this.setState({giftId: 1})
			this.setState({giftValue: 120.00})
		}
		this.setState({selectedButton: 1})
	}
	handlePaymentSubmit(event) {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		// let gifts=[
		// 	{id:1, quantity:1, value:120.00},
		// 	{id:2, quantity:1, value:9.99}
		// ]
		if (this.state.giftId !== -1 && this.state.giftValue !== 0) {
			const gifts=[
				{id:this.state.giftId, quantity:1, value:this.state.giftValue}
			]
			this.sendGiftPayment(gifts);
		}
	}

	//------------------------------------------------------------
	handlePartPaymentSection(event) {
		event.preventDefault();  // IMPORTANT.
		if( this.state.selectedButton !== 2 ) {
			this.setState({giftId: 3})
			this.setState({giftValue: 15500.00})
		}
		this.setState({selectedButton: 2})
	}
	handlePartPaymentSubmit(event) {
		event.preventDefault();  // IMPORTANT.
		if (this.state.giftId !== -1 && this.state.giftValue !== 0) {
			const gifts=[
				{id:this.state.giftId, quantity:1, value:this.state.giftValue, partial:true}
			]
			this.sendGiftPayment(gifts);
		}
	}

	//------------------------------------------------------------
	handleRefundGiftSection(event) {
		event.preventDefault();  // IMPORTANT.
		this.setState({selectedButton: 3})
	}
	handleRefundGiftSubmit(event) {
		event.preventDefault();  // IMPORTANT.
		this.requestRefundByGiftId(this.state.giftNumber);
	}

	//------------------------------------------------------------
	handleRefundOrderSection(event) {
		event.preventDefault();  // IMPORTANT.
		this.setState({selectedButton: 4})
	}
	handleRefundOrderSubmit(event) {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		this.requestRefundByOrderNumber(this.state.orderNumber);
	}

	//------------------------------------------------------------
	handleRefundPaymentSection(event) {
		event.preventDefault();  // IMPORTANT.
		this.setState({selectedButton: 5})
	}
	handleRefundPaymentSubmit(event) {
		event.preventDefault();  // IMPORTANT.
		this.requestRefundByPaymentId(this.state.paymentIntentId);
	}
	
	//------------------------------------------------------------
	handleGetPaymentsSection(event) {
		event.preventDefault();  // IMPORTANT.
		this.setState({selectedButton: 6})
		//Setup some data
		console.log(`Payment.getAccountPayments(${this.props.accountId})`)
		if (this.props.accountId === null) {
			console.log("  accountId not set - skip handleGetPaymentsSection")
			return
		}

		axios.get(apiPath('GET','/payment/account', this.props.accountId)).then((response) => {
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
	//------------------------------------------------------------
	handleGetPaidSection(event) {
		event.preventDefault();  // IMPORTANT.
		this.setState({selectedButton: 7})
		//Setup some data
		console.log(`Payment.getAccountPaidPayments(${this.props.accountId})`)
		if (this.props.accountId === null) {
			console.log("  accountId not set - skip handleGetPaidSection")
			return
		}

		axios.get(apiPath('GET','/payment/account/paid', this.props.accountId)).then((response) => {
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
	//------------------------------------------------------------
	handleGetRefundsSection(event) {
		event.preventDefault();  // IMPORTANT.
		this.setState({selectedButton: 8})
		//Setup some data
		console.log(`Payment.getAccountRefundPayments(${this.props.accountId})`)
		if (this.props.accountId === null) {
			console.log("  accountId not set - skip handleGetPaymentsSection")
			return
		}

		axios.get(apiPath('GET','/payment/account/refund', this.props.accountId)).then((response) => {
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


	renderPaymentSection = () => {
		const payServiceButton = <button type="submit" className="btn btn-primary" onClick={this.handlePayServiceSubmit} >Pay For Service</button>
		const payButton = <button type="submit" className="btn btn-primary" onClick={this.handlePaymentSection} >Purchase Gift</button>
		const paySection = <div className="form-group">
			<label>Gift id</label><input style={{ width: 'unset' }} className="form-control" type="number" name="giftId" value={this.state.giftId} onChange={this.handleChange} />
			<label>Gift value</label><input style={{ width: 'unset' }} className="form-control" type="number" name="giftValue" value={this.state.giftValue} onChange={this.handleChange} />
			<button type="submit" className="btn btn-primary" onClick={this.handlePaymentSubmit} >Submit Payment</button></div>
		const partPayButton = <button type="submit" className="btn btn-primary" onClick={this.handlePartPaymentSection} >Make Partial Payment</button>
		const partPaySection = <div className="form-group">
			<label>Gift id</label><input style={{ width: 'unset' }} className="form-control" type="number" name="giftId" value={this.state.giftId} onChange={this.handleChange} />
			<label>Gift value</label><input style={{ width: 'unset' }} className="form-control" type="number" name="giftValue" value={this.state.giftValue} onChange={this.handleChange} />
			<button type="submit" className="btn btn-primary" onClick={this.handlePartPaymentSubmit} >Submit Partial Payment</button></div>
		const hidePaymentBody = !(this.state.selectedButton === 1 || this.state.selectedButton === 2) ? {display: "none"} : {display: "block"}
		return (
			<div class="panel panel-default">
				<div className="panel-heading">Making Payment</div>

				<div className="panel-body">
					{payServiceButton}
					{payButton}
					{partPayButton}
				</div>
				<div className="panel-body" style={hidePaymentBody}>
					{ this.state.selectedButton === 1 && paySection }
					{ this.state.selectedButton === 2 && partPaySection }
				</div>
			</div>
		)
	}

	renderRefundSection = () => {
		const giftRefundButton = <button type="submit" className="btn btn-primary" onClick={this.handleRefundGiftSection} >Request Refund by gift id</button>
		const orderRefundButton = <button type="submit" className="btn btn-primary" onClick={this.handleRefundOrderSection} >Request Refund by order number</button>
		const paymentRefundButton = <button type="submit" className="btn btn-primary" onClick={this.handleRefundPaymentSection} >Request Refund by paymentIntent id</button>
		const giftNumberSection = <div className="form-group">
			<label>Gift Number</label><input style={{ width: 'unset' }} className="form-control" type="number" name="giftNumber" value={this.state.giftNumber} onChange={this.handleChange} />
			<button type="submit" className="btn btn-primary" onClick={this.handleRefundGiftSubmit} >Submit Refund Request</button></div>
		const orderNumberSection = <div className="form-group">
			<label>Order Number</label><input style={{ width: 'unset' }} className="form-control" type="text" name="orderNumber" value={this.state.orderNumber} onChange={this.handleChange} />
			<button type="submit" className="btn btn-primary" onClick={this.handleRefundOrderSubmit} >Submit Refund Request</button></div>
		const paymentNumberSection = <div className="form-group">
			<label>Payment Intent id</label><input style={{ width: 'unset' }} className="form-control" type="text" name="paymentIntentId" value={this.state.paymentIntentId} onChange={this.handleChange} />
			<button type="submit" className="btn btn-primary" onClick={this.handleRefundPaymentSubmit} >Submit Refund Request</button></div>
		const hideRefundBody = !(this.state.selectedButton === 3 || this.state.selectedButton === 4 || this.state.selectedButton === 5) ? {display: "none"} : {display: "block"}
		return (
			<div class="panel panel-default">
				<div className="panel-heading">Refunding Payments</div>
				<div className="panel-body">
					{giftRefundButton}
					{orderRefundButton}
					{paymentRefundButton}
				</div>
				<div className="panel-body" style={hideRefundBody}>
					{ this.state.selectedButton === 3 && giftNumberSection }
					{ this.state.selectedButton === 4 && orderNumberSection }
					{ this.state.selectedButton === 5 && paymentNumberSection }
				</div>
			</div>
		)
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

		const paymentsButton = <button type="submit" className="btn btn-primary" onClick={this.handleGetPaymentsSection} >Get Payments For Account</button>
		const paidButton = <button type="submit" className="btn btn-primary" onClick={this.handleGetPaidSection} >Get Paid/Partial Paid For Account</button>
		const refundsButton = <button type="submit" className="btn btn-primary" onClick={this.handleGetRefundsSection} >Get Refunds For Account</button>

		const accountNumberSection = <div className="form-group">
			<label>Account Number</label><input style={{ width: 'unset' }} className="form-control" type="number" name="getNumber" value={this.state.getNumber} onChange={this.handleChange} />
			</div>
		/*const accountNumberSection = <ButtonGroup aria-label='REST Calls'>
			<Button variant='info' type="submit" title='type' onClick={this.handleGetPaymentsSection} >Get Payments For Account</Button>
			<Button variant='info' type="submit" title='type' onClick={this.handleGetPaidSection} >Get Paid/Partial Paid For Account</Button>
			<Button variant='danger'type="submit" title='type' onClick={this.handleGetRefundsSection} >Get Refunds For Account</Button>
			<br/>
			<FormControl inline='true' style={{ width: 'unset' }}
					type="number"
					placeholder="ID"
					aria-label="Input group example"
					aria-describedby="btnGroupAddon"
					onChange={this.handleChange}
				/>
		</ButtonGroup>*/

		const hideGettingBody = !(this.state.selectedButton === 6 || this.state.selectedButton === 7 || this.state.selectedButton === 8) ? {display: "none"} : {display: "block"}
		return (
			<div class="panel panel-default">
				<div className="panel-heading">Getting Payment Details</div>
				<div className="panel-body">
					{paymentsButton}
					{paidButton}
					{refundsButton}
					<br/>
					{accountNumberSection}
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

		const paySection = this.renderPaymentSection()
		const refundSection = this.renderRefundSection();
		const querySection = this.renderQuerySection();
		return (
			<div className="panel panel-default">
				{paySection}
				<br />
				{refundSection}
				<br />
				{querySection}

				<ToastContainer
					position="top-center"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</div>
		);
	}
}