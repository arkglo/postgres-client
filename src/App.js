import React, { Component } from 'react';
import axios from 'axios';

import * as config from './config/config';
import { apiPath } from './lib/apiPath'

// Top NavBar component
import NavBar from "./components/NavBar"
// Main View Components
import SignupView from "./components/SignupView";
import LoginView from "./components/LoginView";
import UserEditView from "./components/UserEditView";
import AccountEditView from "./components/AccountEditView";
import ThemeEditView from "./components/ThemeEditView";

// NOTE: Needed for making ajax calls to a different port or address.
axios.defaults.withCredentials = true;

// console.log("APP")

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			account: null,
			mainView: null,
			accountId: -1,
			themeId: -1,
		};

		// Check auth. This is for Remember Me.
		axios.post(apiPath('user', 'checkauth')).then((response) => {
			if (!response.data.success) {
				return;
			}
			this.setState({ user: response.data.user });
		}).catch(error => console.log(`checkAuth Error: ${error} - check Productions vs Development Endpoints`));

		// Show functions. For navigation and setting state.mainView.
		this.showSignup = this.showSignup.bind(this);
		this.showUserEdit = this.showUserEdit.bind(this);
		this.showAccountEdit = this.showAccountEdit.bind(this);
		this.showThemeEdit = this.showThemeEdit.bind(this);

		// Handlers for child components.
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);

		this.setAccountId = this.setAccountId.bind(this);
		this.setThemeId = this.setThemeId.bind(this);
	}

	componentDidMount() {
		if (process.env.NODE_ENV === 'production')
			document.title = "TL-PG-CLient"
		else if (config.productionTest)
			document.title = "[TEST] TL-PG-CLient"
		else
			document.title = "[LOCAL] TL-PG-CLient"
	}

	// Handler for LoginView.
	handleLogin(response) {
		if (config.debugLevel) console.log(response)
		if (response.status !== 200) {
			return console.warn('Login failed');
		}
		console.log('Logged in as ' + response.data.data.firstName + ' ' + response.data.data.lastName);
		if (config.debugLevel > 1) console.log(response.data.data)
		this.setState({
			user: response.data.data,
			mainView: null
		});
	}

	setAccountId(thisId) {
		this.setState({ accountId: thisId })
		if (thisId === -1) {
			this.setThemeId(-1)
		}
	}
	setThemeId(thisId) { this.setState({ themeId: thisId }) }

	// Handler for LoginView.
	handleLogout(response) {
		console.log("here 1: ")
		console.log(response)
		if ((response !== null && response !== undefined) && response.status !== 200) {
			return console.warn('Logout failed');
		}
		console.log('Logged out')
		this.setState({
			user: null,
			mainView: null,
			accountId: -1,
			themeId: -1,
		});
	}

	// Navigation.
	showSignup() {
		this.setState({
			mainView: (<SignupView
				handleLogout={this.handleLogout}
			/>),
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
				themeId={this.state.themeId}
				handleLogout={this.handleLogout}
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
				setThemeId={this.setThemeId}
				handleLogout={this.handleLogout}
			/>),
		});
	}

	showThemeEdit() {
		if (!this.state.user) {
			// return this.toast.error('Not logged in');
			return console.warn('Not Logged in')
		}
		this.setState({
			mainView: (<ThemeEditView
				accountId={this.state.accountId}
				themeId={this.state.themeId}
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
					showThemeEdit={this.showThemeEdit}
					accountId={this.state.accountId}
					themeId={this.state.themeId}>
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


