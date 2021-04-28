import React, { Component } from 'react';
import axios from 'axios';

//import logo from './logo.svg';
import './App.css';
import * as config from './config';

// Our components.
import SignupView from "./components/SignupView";
import LoginView from "./components/LoginView";
import UserEditView from "./components/UserEditView";

// NOTE: Needed for making ajax calls to a different port or address.
axios.defaults.withCredentials = true;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			mainView: null,
		};

		// Check auth. This is for Remember Me.
		axios.post(config.SERVER_URL + config.SERVER_PATH + '/users/checkauth').then((response) => {
			if (!response.data.success) {
				return;
			}
			this.setState({ user: response.data.user });
		});

		// Show functions. For navigation and setting state.mainView.
		this.showSignup = this.showSignup.bind(this);
		this.showUserEdit = this.showUserEdit.bind(this);

		// Handlers for child components.
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
	}

	// Handler for LoginView.
	handleLogin(response) {
		console.log(response)
		if (response.status !== 200) {
			return console.error('Login failed');
		}
		console.log('Logged in as ' + response.data.data.firstName + ' ' + response.data.data.lastName);
		this.setState({
			user: response.data.data,
			mainView: null,
		});
	}

	// Handler for LoginView.
	handleLogout(response) {
		if (!response.data.success) {
			console.log(response.data);
			// return this.toast.error('Logout failed');
			console.log('Logout Failed!')
		}
		this.setState({
			user: null,
			mainView: null,
		});
	}

	// Navigation.
	showSignup() {
		this.setState({
			mainView: (<SignupView/>),
		});
	}

	showUserEdit() {
		if (!this.state.user) {
			// return this.toast.error('Not logged in');
			return console.log('Not Logged in')
		}
		this.setState({
			mainView: (<UserEditView
				user={this.state.user}
			/>),
		});
	}

	render() {
		return (
			<div className="container">
				<nav className="navbar navbar-default myNav">
					<span className="navbar-brand">Test</span>
					<div className="btn-group" role="group">
						<button type="button" name="signup"
							className="btn btn-default navbar-btn"
							onClick={this.showSignup}>
							Signup
            </button>
						<button type="button" name="user_edit"
							className="btn btn-default navbar-btn"
							onClick={this.showUserEdit}>
							User edit
            </button>
					</div>
				</nav>
				<LoginView
					handleLogin={this.handleLogin}
					handleLogout={this.handleLogout}
					user={this.state.user}
					toast={this.toast}
				/>
				{ this.state.mainView}
			</div>
		);
	}
}

export default App;


