import React, { Component } from 'react';
import axios from 'axios';
import { Switch, Redirect, Route, BrowserRouter as Router } from "react-router-dom";

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
import MyGiftsView from "./components/MyGiftsView";
import GiftsView from "./components/GiftsView";
import GiftsAvailable from "./components/GiftsAvailable";
import Services from "./components/Services";
import Payment from "./components/Payment";
import Message from "./components/Message";
import Admin from "./components/Admin";

import Error from './components/error';
import Wrapper from './components/wrapper';
import GoodPayment from './components/GoodPayment';
import BadPayment from './components/BadPayment';
import ResetPassword from './components/ResetPassword';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "animate.css/animate.min.css";

// NOTE: Needed for making ajax calls to a different port or address.
axios.defaults.withCredentials = true;

// console.log("APP")
export const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest}
		debugger
		render={props =>
			localStorage.getItem("authToken") ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: "/login",
						state: { from: props.location }
					}}
				/>
			)
		}
	/>
);


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			account: null,
			mainView: null,
			accountId: -1,
			themeId: -1,
			myGiftsId: -1,
			viewType: 'checkAuth',
			admin: false,
			authenticated: false,
			resetToken: null,
		};

		// Show functions. For navigation and setting state.mainView.
		this.showSignup = this.showSignup.bind(this);
		this.showUserEdit = this.showUserEdit.bind(this);
		this.showAccountEdit = this.showAccountEdit.bind(this);
		this.showThemeEdit = this.showThemeEdit.bind(this);
		this.showMyGiftsEdit = this.showMyGiftsEdit.bind(this);
		this.showGiftsAvailable = this.showGiftsAvailable.bind(this);
		this.showGiftsEdit = this.showGiftsEdit.bind(this);
		this.showServices = this.showServices.bind(this);
		this.showPayment = this.showPayment.bind(this);
		this.showMessage = this.showMessage.bind(this);
		this.showAdmin = this.showAdmin.bind(this);

		// Handlers for child components.
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleReset = this.handleReset.bind(this);

		this.setAccountId = this.setAccountId.bind(this);
		this.setThemeID = this.setThemeID.bind(this);
		this.setMyGiftsID = this.setMyGiftsID.bind(this);
		this.updateToThisThemeId = this.updateToThisThemeId.bind(this)
	}

	componentDidMount() {
		console.log(`App.componentDidMount()`)

		if (process.env.NODE_ENV === 'production')
			document.title = "TL-PG-Client"
		else if (config.productionTest)
			document.title = "[TEST] TL-PG-Client"
		else
			document.title = "[LOCAL] TL-PG-Client"

		this.checkAuth()
	}

	checkAuth() {
		// Check auth. This is for Remember Me.
		axios.get(apiPath('GET', 'user', 'checkauth')).then((response) => {
			// if(config.debugLevel > 1) console.log(response.data.data)
			console.log(response)
			if (response.status === 200) {
				console.log(`checkAuth - %cSucceeded`, 'color:lightgreen')
				const data = response.data.data

				const admin = data?.role ? (data?.role === 'admin') : false
				// console.log(`admin: ${admin}`)
				this.setState({
					user: data,
					admin: admin,
					authenticated: true,
					accountId: data?.activeAccountID ?? -1
				})

				const message = <div>
					Welcome back "{data.firstName} {data.lastName}"<br />
					AccountId: {this.state.accountId}
				</div>

				this.toastThis(message, 'info', 1000)
			}
			this.setState({ viewType: '' })
		}).catch(error => {
			console.log(`checkAuth: ${error}`)
			// console.log(`  • Check Production vs Development Endpoints`)
			this.setState({ viewType: '' })
			return
		})
	}

	toastThis(message, type, timeout = 2000, options) { //timeout= false no timeout
		let theme = toast.TYPE.DEFAULT
		switch (type) {
			case 'dark': theme = toast.TYPE.DARK; break
			case 'error': theme = toast.TYPE.ERROR; break
			case 'info': theme = toast.TYPE.INFO; break
			case 'success': theme = toast.TYPE.SUCCESS; break
			case 'warning': theme = toast.TYPE.WARNING; break
			default: theme = toast.TYPE.DEFAULT
		}
		let toastOptions = { type: theme, autoClose: timeout };
		toast(message, { ...toastOptions, ...options });
	}

	showError = (err) => {
		console.warn('Error:')
		console.log(err ?? 'no response')
		const message = <>
			<strong>{err.status ?? '404'}</strong> {err.function ?? 'Error'}<br />
			<small>{err.message}</small>
		</>
		this.toastThis(message, err.type ?? 'error', err.timeout ?? false)
	}

	// Handler for LoginView.
	handleLogin(response) {
		if (config.debugLevel) console.log(response)
		if (response.status !== 200) {
			return console.warn('Login failed');
		}
		console.log('Logged in as ' + response.data.data.firstName + ' ' + response.data.data.lastName);

		if (config.debugLevel > 1) console.log(response.data.data)
		const admin = response.data.data?.role ? (response.data.data?.role === 'admin') : false
		console.log(`  admin: ${admin}`)
		this.setState({
			user: response.data.data,
			mainView: null,
			admin: admin,
			authenticated: true
		})
		const message = <div>Logged in:  "{this.state.user.firstName} {this.state.user.lastName}"</div>
		this.toastThis(message, 'info', 1000)

		this.setState({ viewType: '' })
	}

	setAccountId(thisId) {
		console.log(`setAccountId(${thisId})`)
		this.setState({ accountId: thisId })
		if (thisId === -1) {
			this.setThemeID(-1)
			this.setMyGiftsID(-1)
		}
	}
	setThemeID(thisId) { this.setState({ themeId: thisId }) }
	setMyGiftsID(thisId) {
		this.setState({ myGiftsId: thisId })
		if (this.state.viewType === 'MyGiftsView')
			this.showMyGiftsEdit()
	}

	updateToThisThemeId(thisId) {
		console.log(`updateToThisThemeId - accountId: ${this.state.accountId}, theme: ${thisId})`)
		axios.put(apiPath('PUT', 'account', this.state.accountId), { themeID: thisId }).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to update account.');
			}
			console.log('Updated account details!');
			this.setThemeID(thisId)
			this.showThemeEdit()
		}).catch((error) => {
			Error.message(error.response)
		});
	}

	//Set the state viewType after 500ms, allows other state handling to complete
	resetViewType(viewType = '') {
		setTimeout(() => { this.setState({ viewType: viewType }) }, 500)
	}

	//Reset state to default
	resetState() {
		this.setState({
			user: null,
			mainView: null,
			accountId: -1,
			themeId: -1,
			myGiftsId: -1,
			viewType: 'checkAuth',
			admin: false,
			authenticated: false
		});
	}

	// Handler for Logout
	handleLogout(response) {
		if ((response !== null && response !== undefined) && response.status !== 200) {
			return console.warn('Logout failed');
		}

		const message = <div>Logged out:  "{this.state.user.firstName} {this.state.user.lastName}"</div>
		this.toastThis(message, 'info', 1000)

		console.log('Logged out')
		this.resetState()
		this.resetViewType()
	}

	// Handler for Reset
	handleReset() {
		console.log('Reset')
		this.resetState()
		this.resetViewType()
	}

	// Navigation
	showSignup() {
		this.setState({
			mainView: (<SignupView
				handleLogout={this.handleLogout}
				handleReset={this.handleReset}
				toastThis={this.toastThis}
			/>),
			viewType: 'SignupView',
		});
	}

	// User Edit
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
				showError={this.showError}
				toastThis={this.toastThis}
				admin={this.state.admin}
			/>),
			viewType: 'UserEditView',
		});
	}

	// Account Edit
	showAccountEdit() {
		if (!this.state.user) {
			// return this.toast.error('Not logged in');
			return console.warn('Not Logged in')
		}
		this.setState({
			mainView: (<AccountEditView
				accountId={this.state.accountId}
				setThemeID={this.setThemeID}
				setMyGiftsID={this.setMyGiftsID}
				handleLogout={this.handleLogout}
			/>),
			viewType: 'AccountEditView',
		});
	}

	// Theme Edit
	showThemeEdit() {
		if (!this.state.user) {
			// return this.toast.error('Not logged in');
			return console.warn('Not Logged in')
		}
		this.setState({
			mainView: (<ThemeEditView
				accountId={this.state.accountId}
				themeId={this.state.themeId}
				updateToThisThemeId={this.updateToThisThemeId}
				setThemeID={this.setThemeID}
				admin={this.state.admin}
			/>),
			viewType: 'ThemeEditView',
		});
	}


	// myGifts Edit
	showMyGiftsEdit() {
		if (!this.state.user) {
			// return this.toast.error('Not logged in');
			return console.warn('Not Logged in')
		}
		this.setState({
			mainView: (<MyGiftsView
				accountId={this.state.accountId}
				themeId={this.state.themeId}
				myGiftsId={this.state.myGiftsId}
				setMyGiftsID={this.setMyGiftsID}
				admin={this.state.admin}
			/>),
			viewType: 'MyGiftsView',
		});
	}

	// Gifts Edit
	showGiftsEdit() {
		if (!this.state.user) {
			// return this.toast.error('Not logged in');
			return console.warn('Not Logged in')
		}
		this.setState({
			mainView: (<GiftsView
				accountId={this.state.accountId}
				themeId={this.state.themeId}
				myGiftsId={this.state.myGiftsId}
				admin={this.state.admin}
			/>),
			viewType: 'GiftsView',
		});
	}


	// Gifts Available
	showGiftsAvailable() {
		if (!this.state.user) {
			// return this.toast.error('Not logged in');
			return console.warn('Not Logged in')
		}
		this.setState({
			mainView: (<GiftsAvailable
				accountId={this.state.accountId}
				themeId={this.state.themeId}
				myGiftsId={this.state.myGiftsId}
				admin={this.state.admin}
			/>),
			viewType: 'GiftsAvailable',
		});
	}

	loginViewRender() {
		return (<LoginView
			handleLogin={this.handleLogin}
			handleLogout={this.handleLogout}
			setAccountId={this.setAccountId}
			user={this.state.user}
			showError={this.showError}
			toastThis={this.toastThis}
			authenticated={this.state.authenticated}
			viewType={this.state.viewType}
			admin={this.state.admin}
		/>)
	}

	showServices() {
		this.setState({
			mainView: <Services />,
			viewType: 'Services',
		})
	}

	showPayment() {
		this.setState({
			mainView: (<Payment
				toastThis={this.toastThis}
				accountId={this.state.accountId}
			/>),
			viewType: 'Payment',
		})
	}

	showMessage() {
		this.setState({
			mainView: (<Message
				toastThis={this.toastThis}
				accountId={this.state.accountId}
			/>),
			viewType: 'Message',
		})
	}

	showAdmin() {
		this.setState({
			mainView: (<Admin
				toastThis={this.toastThis}
				showError={this.showError}
			/>),
			viewType: 'Admin'
		})
	}

	render() {
		console.log(`%cApp - render('${this.state.viewType}')`, 'color: yellow')
		let loginView = null;
		const validLoginView = ['', 'SignupView', 'UserEditView']
		if (validLoginView.includes(this.state.viewType)) {
			loginView = this.loginViewRender()
		}

		return (
			<Router>
				<Switch>
					<Route exact path="/resetPassword" component={ResetPassword} />
					<Route exact path="/success" component={GoodPayment} />
					<Route exact path="/canceled" component={BadPayment} />
					<Route path="/" >
						<Wrapper className="container">
							<NavBar
								handleReset={this.handleReset}
								showSignup={this.showSignup}
								showUserEdit={this.showUserEdit}
								showAccountEdit={this.showAccountEdit}
								showThemeEdit={this.showThemeEdit}
								showMyGiftsEdit={this.showMyGiftsEdit}
								showGiftsAvailable={this.showGiftsAvailable}
								showGiftsEdit={this.showGiftsEdit}
								showServices={this.showServices}
								showPayment={this.showPayment}
								showMessage={this.showMessage}
								showAdmin={this.showAdmin}
								handleLogout={this.handleLogout}
								accountId={this.state.accountId}
								themeId={this.state.themeId}
								myGiftsId={this.state.myGiftsId}
								viewType={this.state.viewType}
								admin={this.state.admin}
								user={this.state.user}>
							</NavBar>

							{loginView}

							{this.state.mainView}
						</Wrapper>
					</Route>
				</Switch>
				<ToastContainer
					position="top-center"
					autoClose={2000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</Router>
		);
	}
}

export default App;
