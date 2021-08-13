import React, { Component } from 'react';
import axios from 'axios';

import { apiPath } from '../lib/apiPath'

//------------------------------------------------------------
function initialState() {
	return {
		payment: null,
	};
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
		}
		).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to create payment.');
			}
			
			var url = response?.data?.url ?? null
			console.log(`url=`+url)
			window.location=url

		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.error(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
		})
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
		}
		).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to create payment.');
			}
			
			var url = response?.data?.url ?? null
			console.log(`url=`+url)
			window.location=url

		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.error(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
		})
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
		}
		).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to create refund.');
			}
			
			var url = response?.data?.url ?? null
			console.log(`url=`+url)
			if (url !== null) {
				window.location=url
			}

		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.error(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
		})
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
		}
		).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to create refund.');
			}
			
			var url = response?.data?.url ?? null
			console.log(`url=`+url)
			if (url !== null) {
				window.location=url
			}

		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.error(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
		})
	};


	//------------------------------------------------------------
	handlePayServiceSubmit(event) {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		let service=[{id:1, quantity:1, value:0},{id: 2, quantity:1, value:1520}];
		this.sendServicePayment(service);
	}

	//------------------------------------------------------------
	handlePaymentSubmit(event) {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		let gifts=[
			{id:12, quantity:1, value:2999},
			{id:15, quantity:6, value:999}
		]
		this.sendGiftPayment(gifts);
	}

	//------------------------------------------------------------
	handlePartPaymentSubmit(event) {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.
		let gifts=[
			{id:62, quantity:1, value:200000, partial:true}
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
			</div>
		);
	}
}