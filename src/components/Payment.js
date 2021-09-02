import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';

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
		payment: null,
		selectedButton: -1,
		giftNumber: '',
		orderNumber: '',
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
		this.handlePaymentSubmit = this.handlePaymentSubmit.bind(this);
		this.handlePartPaymentSubmit = this.handlePartPaymentSubmit.bind(this);
		this.handleRefundGiftSubmit = this.handleRefundGiftSubmit.bind(this);
		this.handleRefundGiftSection = this.handleRefundGiftSection.bind(this);
		this.handleRefundOrderSection = this.handleRefundOrderSection.bind(this);
		this.handleRefundOrderSubmit = this.handleRefundOrderSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		//toast("componentDidMount!", {transition:bounce});
		console.log("Payment.componentDidMount()")
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


	//------------------------------------------------------------
	handlePayServiceSubmit(event) {
		this.setState({selectedButton: 0})
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		//let service=[{id:1, quantity:1, value:0},{id: 2, quantity:1, value:10.00}];
		let service=[{id:1, quantity:1, value:0}];
		this.sendServicePayment(service);
	}

	//------------------------------------------------------------
	handlePaymentSubmit(event) {
		this.setState({selectedButton: 1})
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		let gifts=[
			{id:1, quantity:1, value:120.00},
			{id:2, quantity:1, value:9.99}
		]
		this.sendGiftPayment(gifts);
	}

	//------------------------------------------------------------
	handlePartPaymentSubmit(event) {
		this.setState({selectedButton: 2})
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		let gifts=[
			{id:62, quantity:1, value:2000.00, partial:true}
		]
		this.sendGiftPayment(gifts);
	}

	//------------------------------------------------------------
	handleRefundGiftSection(event) {
		this.setState({selectedButton: 3})
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
	}
	handleRefundGiftSubmit(event) {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		this.requestRefundByGiftId(this.state.giftNumber);
	}

	//------------------------------------------------------------
	handleRefundOrderSection(event) {
		this.setState({selectedButton: 4})
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
	}
	handleChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
  }
	handleRefundOrderSubmit(event) {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		let thisOrderNumber = this.state.orderNumber;
		console.log("thisOrderNumber="+thisOrderNumber)
		this.requestRefundByOrderNumber(thisOrderNumber);
	}

	clearLowerSection() {
		this.setState({lower: null})
	}


	//------------------------------------------------------------
	render() {
		console.log("%cPayment - render()", 'color: blue')
		const payServiceButton = <button type="submit" className="btn btn-primary" onClick={this.handlePayServiceSubmit} >Pay For Service</button>
		const payButton = <button type="submit" className="btn btn-primary" onClick={this.handlePaymentSubmit} >Purchase Gift</button>
		const partPayButton = <button type="submit" className="btn btn-primary" onClick={this.handlePartPaymentSubmit} >Make Partial Payment</button>
		const girfRefundButton = <button type="submit" className="btn btn-primary" onClick={this.handleRefundGiftSection} >Request Refund by gift id</button>
		const orderRefundButton = <button type="submit" className="btn btn-primary" onClick={this.handleRefundOrderSection} >Request Refund by order number</button>

		const giftNumberSection = <div className="form-group">
		<label>Gift Number</label><input className="form-control" type="text" name="giftNumber" value={this.state.giftNumber} onChange={this.handleChange} />
		<button type="submit" className="btn btn-primary" onClick={this.handleRefundGiftSubmit} >Submit Refund Request</button></div>
		const orderNumberSection = <div className="form-group">
		<label>Order Number</label><input className="form-control" type="text" name="orderNumber" value={this.state.orderNumber} onChange={this.handleChange} />
		<button type="submit" className="btn btn-primary" onClick={this.handleRefundOrderSubmit} >Submit Refund Request</button></div>

return (
			<div className="panel panel-default">
				<div className="panel-heading">Payment</div>

			<div className="panel-body">
				{payServiceButton}
				{payButton}
				{partPayButton}
				{girfRefundButton}
				{orderRefundButton}
			</div>

			<div className="panel-body">
				{ this.state.selectedButton === 3 && giftNumberSection }
				{ this.state.selectedButton === 4 && orderNumberSection }
			</div>
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