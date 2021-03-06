import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';

import { apiPath } from '../lib/apiPath'
import Error from './error';

import { ToastContainer, toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "animate.css/animate.min.css";

const zoom = cssTransition({
  enter: "animate__animated animate__zoomInDown",
  exit: "animate__animated animate__zoomOutDown"
});

//------------------------------------------------------------
function initialState() {
	return {
		summaryData: null,
	};
}

function purchaseSuccess(message, runOnClose) {
	let toastOptions = {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		transition:zoom
	};
	if( runOnClose !== undefined || runOnClose !== null || runOnClose !== "" ) {
		toastOptions.onClose = runOnClose
	}

	toast.success( message, toastOptions );
}

//============================================================
export default class GoodPayment extends Component {
	constructor(props) {
		super(props);
		this.state = initialState();
	}

	getQueryVariable(variable) {
		var query = this.props.location.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split('=');
				if (decodeURIComponent(pair[0]) === variable) {
						return decodeURIComponent(pair[1]);
				}
		}
		console.log('Query variable %s not found', variable);
		return null;
	}

	getOrderNumber() {
		return this.getQueryVariable("orderNumber");
	}

	getSessionId() {
		return this.getQueryVariable("session_id");
	}

	componentDidMount() {
		console.log("GoodPayment.componentDidMount()")
		purchaseSuccess(<div>Order Number <strong>{this.getOrderNumber()}</strong></div>);
		this.getCheckoutInformation()
	}


	//------------------------------------------------------------
	formatItem(item) {
		if (item != null ) {
			const value = item.price.unit_amount/100;
			return "<table><tbody>" +
				"<tr><td><b>Description:</b></td><td>"+ item.description +"</td></tr>" +
				"<tr><td><b>Price:</b></td><td>"+ ((value) === 0 ? "free": value) +"</td></tr>" +
				"<tr><td><b>Quantiy:</b></td><td>"+ item.quantity +"</td></tr>" +
				"</tbody></table>";
		}
		return "";
	}
	formatData(listItems) {
		let details = "<table><tbody>";
		for (var i = 0; i < listItems.length; i++) {
			const item = listItems[i];
			details += "<tr>" + this.formatItem(item) + "</tr>";
		}
		details += "</tbody></table>"
		return "<div><br/>" + details + "<br/></div>";
	}
	getCheckoutInformation() {
		// What was it we were ordering that failed ?
		axios.get(apiPath('GET', '/payment/items', this.getSessionId())).then((response) => {
			if (response.status !== 200) {
				this.props.toastError(false, null, response)
				return console.warn('Failed to get order details.')
			}
			const checkoutData = response.data.data;
			const checkoutDataString = JSON.stringify(checkoutData);
			console.log('checkoutDataString = ' + checkoutDataString)
			if( checkoutData != null && checkoutData.object === "list" ) {
				let OrderDetails = "<br/>You purchased the following:" + this.formatData(checkoutData.data) + "</div>";
				this.setState({
					summaryData: <div>{ ReactHtmlParser(OrderDetails) }</div>
				});
			}
		
		}).catch((error) => {
			this.props.toastError(true, error, null)
			Error.message(error.response)
		});
	}

	returnToNormal(event)  {
		//Setup some initial data
		event.preventDefault();  // IMPORTANT.

		const currentLocation = window.location.toString();
		var point = currentLocation.indexOf("/success")
		if( point !== -1 )
			window.location = currentLocation.slice(0, point)
		else
			window.location = "http://localhost:3000/billy";
	}

	//------------------------------------------------------------
	render() {
		console.log("%cPayment - render()", 'color: blue')
		let summaryHeader = <div>Your order number is <strong>{this.getOrderNumber()}</strong><br/><div>Your session number is <b>{this.getSessionId()}</b></div></div>
		let okButton = <button type="submit" className="btn btn-primary" onClick={this.returnToNormal} >OK</button>

		return (
			<div className="panel panel-default">
				<div className="panel-heading">Payment Complete</div>

				<div className="panel-body">
					{summaryHeader}
					{this.state.summaryData}
					{okButton}
				</div>
			<ToastContainer/>
			</div>
		);
	}
}