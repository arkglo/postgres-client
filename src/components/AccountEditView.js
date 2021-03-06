// For editing one user's details. Can edit password as well.
import React, { Component } from 'react';
import axios from 'axios';
import * as config from '../config/config';
import { apiPath } from '../lib/apiPath'
import styles from '../css/mystyles.module.css'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Dropdown from 'react-dropdown';
import "react-dropdown/style.css";

import Error from './error';

export default class AccountEditView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: -1,
			userID: -1,
			role: '',
			firstName: '',
			lastName: '',
			email: '',
			partnerFirstName: '',
			partnerLastName: '',
			eventDate: '',
			websiteLink: '',
			requiresPassword: false,
			websitePassword: '',
			websitePassword2: '',
			themeID: '',
			gifts: '',
			showStripe: false,
			dob: '',
			addressLine1: '',
			addressPostCode: '',
			addressCity: '',
			stripeBankHolderFirstName: '',
			stripeBankHolderLastName: '',
			stripeRoute: '110000000',
			stripeBankNumber: '000123456789',
			dobObject: null,
			linkColor: { color: '#333333' },
			linkTooltip: "",
			changePassword: false
		};

		// console.log("Props:")
		// console.log(props)

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.updateWeblinkState = this.updateWeblinkState.bind(this);
		this.handleToggleStripe = this.handleToggleStripe.bind(this);
		this.handleStripeAccount = this.handleStripeAccount.bind(this);
		this.handleStripeUpdateAccount = this.handleStripeUpdateAccount.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
	}//constructor

	componentDidMount() {
		console.log(`AccountEditView.componentDidMount(${this.props.accountId})`)

		axios.get(apiPath('GET', 'account', this.props.accountId)).then((response) => {
			if (response.status !== 200) {
				this.props.toastError(false, null, response)
				return console.warn('Failed to get account details.');
			}

			const account = response.data.data
			// console.log(response.data)
			console.log("the account data is:")
			console.log(account)
			this.setState({
				role: account.role,
				state: account.state,
				firstName: account.firstName,
				lastName: account.lastName,
				email: account.email,
				partnerFirstName: account.partnerFirstName,
				partnerLastName: account.partnerLastName,
				eventDate: account.eventDate,
				websiteLink: account.websiteLink,
				requiresPassword: account.requiresPassword,
				id: account.id,
				userID: account.userID,
				stripeBankHolderFirstName: account.firstName,
				stripeBankHolderLastName: account.lastName,
				dob: '21/11/1973',
				addressLine1: '260 Tinakori Road',
				addressPostCode: '6011',
				addressCity: 'Wellington',
				stripeRoute: '110000000',
				stripeBankNumber: '000123456789',
				dobObject: new Date("1973-11-21")
			});
			if( account.requiresPassword ) {
				this.setState({
					websitePassword: "********************************",
					websitePassword2: "",
				});
			}
			this.setState({ account: account })
			this.props.setThemeID(account.themeID)
			this.props.setMyGiftsID(account.myGiftsID)
			if (config.debugLevel > 1) console.log(account)
		}).catch((error) => {
			this.props.toastError(true, error, null)
			Error.message(error.response)
		});
	}

	handleChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});

		if( name === "websiteLink" ) {
			if (this.state.account !== null && this.state.account["websiteLink"] === value) {
				this.updateWeblinkState(null);
			}
			else {
				const urlExtra = 'checkLink/'+ value;
				axios.get(apiPath('GET', 'account', urlExtra)).then((response) => {
					if (response.status === 200) {
						if (response.data.data.available) {
							this.updateWeblinkState(true);
						}
						else {
							this.updateWeblinkState(false);
						}
					}
				}).catch((error) => {
					this.updateWeblinkState(null);
				});
			}
		}
	}
	updateWeblinkState(state) {
		if(state == null)
			this.setState(() => ({ linkColor: { color: "#333333" }, linkTooltip: "" }));
		else {
			if( state )
				this.setState(() => ({ linkColor: { color: "green" }, linkTooltip: "This link is allowed, it is not in current use." }));
			else
				this.setState(() => ({ linkColor: { color: "red" }, linkTooltip: "This link is NOT allowed, it is in current use." }));
		}
	}

	updateReq(req, key) {
		if ((this.state.account == null || this.state[key] !== this.state.account[key]) && this.state[key].length > 0) {
			req[key] = this.state[key]
		}
	}

	handleSubmit(event) { //Perform Account Update
		event.preventDefault();	// IMPORTANT.
		console.log("------------------- handleSubmit() Update")
		var req = {}

		// only add new fields if changed and valid
		if (this.state.changePassword) {
			if (this.state.websitePassword.length > 0 && this.state.websitePassword.length < 6) {
				return console.error('Password is too short.');
			}
			if (this.state.websitePassword !== this.state.websitePassword2) {
				return console.error('Passwords do not match.');
			}
			req.websitePassword = this.state.websitePassword;
		}

		console.log(this.state) // new
		console.log(this.state.account) // old

		this.updateReq(req, 'email')
		this.updateReq(req, 'firstName')
		this.updateReq(req, 'lastName')
		this.updateReq(req, 'partnerFirstName')
		this.updateReq(req, 'partnerLastName')
		this.updateReq(req, 'eventDate')
		this.updateReq(req, 'websiteLink')
		this.updateReq(req, 'state')
		req.userID = this.state.userID

		if (config.debugLevel > 1) {
			console.log('Call Account UPDATE')
			console.log(req)
		}

		axios.put(apiPath('PUT', 'account', this.props.accountId), req).then((response) => {
			if (response.status !== 200) {
				this.props.toastError(false, null, response)
				return console.warn('Failed to update account.');
			}
			this.setState({ changePassword: false });
			console.log('Updated account details!');
		}).catch((error) => {
			this.props.toastError(true, error, null)
			Error.message(error.response)
		});
	}

	handleRemove(event, accountID) {
		event.preventDefault();
		console.log("------------------- handleRemove()")
		confirmAlert({
			title: 'Confirm',
			message: 'Are you VERY sure you want to delete the Account?',
			buttons: [
				{
					label: "Yes",
					onClick: () => {
						axios.delete(apiPath('DELETE', 'account', this.props.accountId)).then((response) => {
							if (response.status !== 200) {
								this.props.toastError(false, null, response)
								return console.warn('Failed to remove account.');
							}
							console.log('Successfully deleted account.');
							this.props.handleLogout()
						}).catch((error) => {
							this.props.toastError(true, error, null)
							Error.message(error.response)
						});
					}
				},
				{
					label: "No",

				}
			]
		});
	}

	handleToggleStripe(event) {
		event.preventDefault();
		console.log("------------------- handleToggleStripe()")
		this.setState(({ showStripe }) => ({ showStripe: !showStripe }));
	}

	handleStripeAccount(event, accountID) {
		event.preventDefault();
		console.log("------------------- handleStripeAccount()")
		confirmAlert({
			title: 'Confirm',
			message: 'Are you sure you want to create a stripe Account?',
			buttons: [
				{
					label: "Yes",
					onClick: () => {
						if (this.state.stripeBankHolderFirstName !== "" && this.state.stripeBankHolderLastName !== "" && this.state.dob !== "" &&
							this.state.addressLine1 !== "" && this.state.addressPostCode !== "" && this.state.addressCity !== "" &&
							this.state.stripeRoute !== "" && this.state.stripeBankNumber !== "") {
							axios.post(apiPath('POST', '/accounts/stripe', this.props.accountId), {
								country: "US",
								currency: "usd",
								firstName: this.state.stripeBankHolderFirstName,
								lastName: this.state.stripeBankHolderLastName,
								dob: this.state.dob,
								addressLine1: this.state.addressLine1,
								addressPostCode: this.state.addressPostCode,
								addressCity: this.state.addressCity,
								routing: this.state.stripeRoute,
								account: this.state.stripeBankNumber,
							}).then((response) => {
								if (response.status !== 200) {
									this.props.toastError(false, null, response)
									return console.warn('Failed to create stripe account.');
								}
								console.log('Successfully created stripe account.');
								this.props.handleLogout()
							}).catch((error) => {
								this.props.toastError(true, error, null)
								Error.message(error.response)
							});
						}
					}
				},
				{
					label: "No",

				}
			]
		});
	}

	handleStripeUpdateAccount(event, accountID) {
		event.preventDefault();
		console.log("------------------- handleStripeUpdateAccount()")
		confirmAlert({
			title: 'Confirm',
			message: 'Are you sure you want to create a stripe Account?',
			buttons: [
				{
					label: "Yes",
					onClick: () => {
						if (this.state.stripeBankHolderFirstName !== "" && this.state.stripeBankHolderLastName !== "" && this.state.dob !== "" &&
							this.state.addressLine1 !== "" && this.state.addressPostCode !== "" && this.state.addressCity !== "" &&
							this.state.stripeRoute !== "" && this.state.stripeBankNumber !== "") {
							// country: "NZ",
							// currency: "nzd",
							axios.put(apiPath('PUT', '/accounts/stripe', this.props.accountId), {
								country: "US",
								currency: "usd",
								firstName: this.state.stripeBankHolderFirstName,
								lastName: this.state.stripeBankHolderLastName,
								dob: this.state.dob,
								addressLine1: this.state.addressLine1,
								addressPostCode: this.state.addressPostCode,
								addressCity: this.state.addressCity,
								routing: this.state.stripeRoute,
								account: this.state.stripeBankNumber,
							}).then((response) => {
								if (response.status !== 200) {
									this.props.toastError(false, null, response)
									return console.warn('Failed to create stripe account.');
								}
								console.log('Successfully created stripe account.');
								this.props.handleLogout()
							}).catch((error) => {
								this.props.toastError(true, error, null)
								Error.message(error.response)
							});
						}
					}
				},
				{
					label: "No",

				}
			]
		});
	}
	handleDateChange(newDate) {
		const dobString = newDate === null ? '' : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(newDate)
		this.setState({ dob: dobString, dobObject: newDate });
	}

	render() {
		const stripeText = this.state.showStripe ? "Hide Stripe Account" : "Show Stripe Account";
		const stripeFields = this.state.showStripe ? (
			<div className="panel-body">
				<div>
					<span style={{ 'color': 'darkmagenta', 'fontSize': 'x-large' }}><b>Bank Account Details</b></span><br />
					Required to setup a Stripe account, <b><i>Not Stored in Database</i></b><p />
				</div>
				<form className="form">

					<div style={{ display: 'flex' }}>
						<div className="form-group" style={{ 'marginRight': '15px' }} >
							<label>Account Holder's First Name</label>
							<input className="form-control" type="text" name="stripeBankHolderFirstName" value={this.state.stripeBankHolderFirstName} onChange={this.handleChange} />
						</div>

						<div className="form-group" style={{ 'marginRight': '15px' }} >
							<label>Account Holder's Last Name</label>
							<input className="form-control" type="text" name="stripeBankHolderLastName" value={this.state.stripeBankHolderLastName} onChange={this.handleChange} />
						</div>

						<div className="form-group">
							<label>Date of Birth</label>
							<DatePicker
								dateFormat="dd/MM/yyyy"
								selected={this.state.dobObject}
								onSelect={this.handleDateChange} //when day is clicked
								onChange={this.handleDateChange} //only when value has changed
							/>
						</div>
					</div>

					<div className="form-group">
						<label>Address Line 1</label>
						<input className="form-control" type="text" name="addressLine1" value={this.state.addressLine1} onChange={this.handleChange} />
					</div>

					<div style={{ display: 'flex' }}>
						<div className="form-group">
							<label>Address Postal Code</label>
							<input style={{ width: 'unset' }} className="form-control" type="text" name="addressPostCode" value={this.state.addressPostCode} onChange={this.handleChange} />
						</div>

						<div style={{ 'marginLeft': '15px', 'width': '100%' }} className="form-group">
							<label>Address City</label>
							<input className="form-control" type="text" name="addressCity" value={this.state.addressCity} onChange={this.handleChange} />
						</div>
					</div>

					<div style={{ display: 'flex' }}>
						<div className="form-group">
							<label>Routing Number</label>
							<input style={{ width: 'unset' }} className="form-control" type="text" name="stripeRoute" value={this.state.stripeRoute} onChange={this.handleChange} />
						</div>

						<div style={{ 'marginLeft': '15px', 'width': '100%' }} className="form-group">
							<label>Bank Account Number</label>
							<input className="form-control" type="text" name="stripeBankNumber" value={this.state.stripeBankNumber} onChange={this.handleChange} />
						</div>
					</div>

				</form>
				<div className="btn-group">
					<button className="btn btn-primary" onClick={this.handleStripeAccount} >Create Stripe Account</button>
					<button className="btn btn-primary" onClick={this.handleStripeUpdateAccount} >Update Stripe Account</button>
				</div>
			</div>
		) : <div></div>;

		//state Drop down
		const dropDownOptions = ['intial', 'ready', 'live', 'complete', 'closed']
		const defaultOption = dropDownOptions[0]

		const changePasswordLabel = this.state.requiresPassword ? "Change Website Password" : "Set Website Password"
		const passwordFields = this.state.changePassword ? (
			<div>
				<div className="form-group">
				<label>Password</label>
				<input className="form-control" type="password" name="websitePassword" value={this.state.websitePassword} onChange={this.handleChange} />
			</div>

			<div className="form-group">
				<label>Confirm password</label>
				<input className="form-control" type="password" name="websitePassword2" value={this.state.websitePassword2} onChange={this.handleChange} />
			</div>
		</div>
		) : <div></div>;

		return (
			<div className="panel panel-default">
				<div className="panel-heading">Account Edit (<i>accountID: {this.props.accountId}</i>)<br />
					<div className={styles.blue}>The Account View provides the Account Entry Fields<br />Note: <i>these are combined with the User fields</i></div><p />
					<code>GET {apiPath('GET', 'account', this.props.accountId)}</code></div>
				<div className="panel-body">

					<form className="form">

						<div className="form-group">
							<label>Role</label>
							<input className="form-control" type="text" name="role" value={this.state.role} onChange={this.handleChange} />
						</div>

						<div className="form-group">
							<div title={'state: [ ' + dropDownOptions.toString() + ' ]'}>
								<label>State</label>
								<Dropdown options={dropDownOptions} onChange={(e) => this.setState({ state: e.value })} value={defaultOption} placeholder="Select an option" />
							</div>
						</div>


						<div className="form-group">
							<label>First Name</label> (User field)
							<input className="form-control" type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
						</div>

						<div className="form-group">
							<label>Last Name</label> (User field)
							<input className="form-control" type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
						</div>

						<div style={{ 'width': '100%' }} className="form-group">
							<label>Email</label> (User field)
							<input className="form-control" type="text" name="email" value={this.state.email} onChange={this.handleChange} />
						</div>

						<div className="form-group">
							<label>Partner FirstName</label> (Account field)
							<input className="form-control" type="text" name="partnerFirstName" value={this.state.partnerFirstName} onChange={this.handleChange} />
						</div>

						<div className="form-group">
							<label>Partner LastName</label> (Account field)
							<input className="form-control" type="text" name="partnerLastName" value={this.state.partnerLastName} onChange={this.handleChange} />
						</div>

						<div className="form-group" style={this.state.linkColor} title={this.state.linkTooltip}>
							<label>Website Link</label>
							<input className="form-control" type="text" name="websiteLink" value={this.state.websiteLink} onChange={this.handleChange} />
						</div>

						<div className="form-group">
							<label>{changePasswordLabel}</label>
							<input style={{ width: '25px' }} className="form-control" type="checkbox" name="changePassword" checked={this.state.changePassword} onChange={this.handleChange} /><br/>
						</div>
						{passwordFields}

						<div className="btn-group">
							<button className="btn btn-primary" onClick={this.handleSubmit} >Update</button>
							<button className="btn btn-danger" onClick={this.handleRemove} >Remove</button>
							<button className="btn btn-warning" onClick={this.handleToggleStripe} >{stripeText}</button>
						</div><br />
						UPDATE: <code>PUT {apiPath('PUT', 'account', this.props.accountId, false)}</code>
					</form>
				</div>
				<div>
					{stripeFields}
				</div>
			</div>
		);
	}
}