import React, { Component } from 'react';
import axios from 'axios';

import { apiPath } from '../lib/apiPath'
import Error from './error';

import { ToastContainer, toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "animate.css/animate.min.css";

const bounce = cssTransition({
  enter: "animate__animated animate__bounceIn",
  exit: "animate__animated animate__bounceOut"
});
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
		this.handleRefundOrderSubmit = this.handleRefundOrderSubmit.bind(this);
		// this.handleChange = this.handleChange.bind(this);
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
			if( url !== null )
				redirectingToPurchase("Redirecting to purchase page...", url);

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
			if( url !== null )
				redirectingToPurchase("Redirecting to purchase page...", url);

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
		console.log(`Payment.requestRefundByOrderNumber(${this.props.accountId})`)
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
		console.log(`Payment.requestRefundByGiftId(${this.props.accountId})`)
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
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		let service=[{id:1, quantity:1, value:0},{id: 2, quantity:1, value:10.00}];
		this.sendServicePayment(service);
	}

	//------------------------------------------------------------
	handlePaymentSubmit(event) {
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
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		let gifts=[
			{id:62, quantity:1, value:2000.00, partial:true}
		]
		this.sendGiftPayment(gifts);
	}

	//------------------------------------------------------------
	handleRefundGiftSubmit(event) {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		let giftNumber = 12;
		this.requestRefundByGiftId(giftNumber);
	}

	//------------------------------------------------------------
	handleRefundOrderSubmit(event) {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		var min = 1;
   	var max = 9999999999999999;
   	var rand =  min + (Math.random() * (max-min));
		let orderumber = "pi_"+rand;
		this.requestRefundByOrderNumber(orderumber);
	}


	//------------------------------------------------------------
	render() {
		console.log("%cPayment - render()", 'color: blue')
		let payServiceButton = <button type="submit" className="btn btn-primary" onClick={this.handlePayServiceSubmit} >Pay For Service</button>
		let payButton = <button type="submit" className="btn btn-primary" onClick={this.handlePaymentSubmit} >Purchase Gift</button>
		let partPayButton = <button type="submit" className="btn btn-primary" onClick={this.handlePartPaymentSubmit} >Make Partial Payment</button>
		let girfRefundButton = <button type="submit" className="btn btn-primary" onClick={this.handleRefundGiftSubmit} >Request Refund by gift id</button>
		let orderRefundButton = <button type="submit" className="btn btn-primary" onClick={this.handleRefundOrderSubmit} >Request Refund by order number</button>

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