import React, { Component } from 'react';
import axios from 'axios';

//import logo from './logo.svg';
import './App.css';
import * as config from './config';

// Top NavBar component
import NavBar from "./components/NavBar"
// Main View Components
import SignupView from "./components/SignupView";
import LoginView from "./components/LoginView";
import UserEditView from "./components/UserEditView";
import AccountEditView from "./components/AccountEditView";

// NOTE: Needed for making ajax calls to a different port or address.
axios.defaults.withCredentials = true;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			account: null,
			mainView: null,
			accountId: -1,
		};

		// Check auth. This is for Remember Me.
		axios.post(config.apiPath('user','checkauth')).then((response) => {
			if (!response.data.success) {
				return;
			}
			this.setState({ user: response.data.user });
		});

		// Show functions. For navigation and setting state.mainView.
		this.showSignup = this.showSignup.bind(this);
		this.showUserEdit = this.showUserEdit.bind(this);
		this.showAccountEdit = this.showAccountEdit.bind(this);

		// Handlers for child components.
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);

		this.setAccountId = this.setAccountId.bind(this);
	}

	// Handler for LoginView.
	handleLogin(response) {
		if(config.debugLevel) console.log(response)
		if (response.status !== 200) {
			return console.warn('Login failed');
		}
		console.log('Logged in as ' + response.data.data.firstName + ' ' + response.data.data.lastName);
		if(config.debugLevel > 1) console.log(response.data.data)
		this.setState({
			user: response.data.data,
			mainView: null
		});
	}

	setAccountId(thisId) {
		this.setState({
			accountId: thisId
		})
	}

	// Handler for LoginView.
	handleLogout(response) {
		if (response.status !== 200) {
			return console.warn('Logout failed');
		}
		console.log('Logged out')
		this.setState({
			user: null,
			mainView: null,
			accountId: -1,
		});
	}

	// Navigation.
	showSignup() {
		this.setState({
			mainView: (<SignupView />),
		});
	}

	showUserEdit() {
		if (!this.state.user) {
			// return this.toast.error('Not logged in');
			return console.warn('Not Logged in')
		}
		this.setState({
			mainView: (<UserEditView
				user={this.state.user}
			/>),
		});
	}

	showAccountEdit() {
		if (!this.state.user) {
			// return this.toast.error('Not logged in');
			return console.warn('Not Logged in')
		}
		this.setState({
			mainView: (<AccountEditView
				accountId={this.state.accountId}
			/>),
		});
	}

	render() {
		return (
			<div className="container">
				<NavBar
					showSignup={this.showSignup}
					showUserEdit={this.showUserEdit}
					showAccountEdit={this.showAccountEdit}
					accountId={this.state.accountId}>
				</NavBar>

				<LoginView
					handleLogin={this.handleLogin}
					handleLogout={this.handleLogout}
					setAccountId={this.setAccountId}
					user={this.state.user}
					toast={this.toast}
				/>
				{ this.state.mainView}
			</div>
		);
	}
}

export default App;


