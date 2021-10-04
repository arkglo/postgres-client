import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as config from '../config/config';
import { apiPath } from '../lib/apiPath'
import ReactJson from 'react-json-view'
import Error from './error';

const LoginView = (props) => {
	const [email, setEmail] = useState('test@email.com')
	const [password, setPassword] = useState('password')
	const [users, setUsers] = useState(null)
	const [admin, setAdmin] = useState(props.admin)
	const [resetPassword, setShowReset] = useState(false)
	const [emailReset, setEmailReset ] = useState('test@email.com')
	const [resetLink, setResetLink ] = useState('')
	const [data, setData ] = useState(null)


	const getUsers = useCallback(() => {
		if (!props.authenticated) return;

		console.log("LoginView.getUsers()")
		// console.log(`  authenticated: ${this.props.authenticated}`)

		axios.get(apiPath('GET', 'user')).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get user details.');
			}

			console.log('GET USERS')
			// console.log(response.data)
			const users = response.data.data
			console.log(users)

			console.log('--------------------------------------------')
			setUsers(users);
			console.log("Query Running RESET 1")
		}).catch((error) => {
			Error.message(error)
			console.log("Query Running RESET 2")
		});
	}, [props.authenticated])

	//===========================================================================
	//Functions
	const handleChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		switch (name) {
			case 'email': setEmail(value); break
			case 'emailReset': setEmailReset(value); break
			case 'password': setPassword(value); break
			default: console.log(`  handleChange() Unknown name: ${name}`); break
		}
		//this.setState({ [name]: value });
	}

	const handleLogin = (event) => {
		event.preventDefault();  // IMPORTANT.
		setData(null);

		axios.post(apiPath('POST', 'user', 'login'), {
			email: email,
			password: password,
		}).then(props.handleLogin)
			.catch((error) => {
				props.showError({
					status: error.response.status ?? 404,
					function: error.response.data.function ?? null,
					message: error.response.data.message ?? null,
					timeout: 2000,
				})

				var data = error?.response?.data ?? null
				if (data) {
					console.warn(`${data.function}() - ${data.message}`)
				}
				else {
					console.log(error)
				}
			})
	}
	const handleResetRequest = (event) => {
		event.preventDefault();  // IMPORTANT.
		setResetLink("");
		setData(null);

		axios.post(apiPath('POST','user', 'resetRequest'), {
			email: email,
		}).then( (response) => {
			if (config.debugLevel) console.log(response)
			if (response.status !== 200) {
				return console.warn('Reset Request failed');
			}
			console.log('Reset Request token for ' + response.data.data.email + ' is ' + response.data.data.resetToken);
			if (config.debugLevel > 1) console.log(response.data.data)

			setResetLink( response.data.data.resetToken );
		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.warn(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
		});
	}
	const handleListAccounts = (event) => {
		event.preventDefault();  // IMPORTANT.
		
		setResetLink("");
		setData(null);

		axios.get(apiPath('GET','account', 'active')).then( (response) => {
			if (config.debugLevel) console.log(response)
			if (response.status !== 200) {
				return console.warn('Reset Request failed');
			}
			if (config.debugLevel > 1) console.log(response.data.data)

			setData( response.data.data );
		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.warn(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
		});
	}

	const handleLogout = (event) => {
		event.preventDefault();
		setData(null);

		axios.post(apiPath('POST', 'user', 'logout'))
			.then(props.handleLogout)
			.catch((error) => {
				var data = error?.response?.data ?? null
				if (data) {
					console.error(`${data.function}() - ${data.message}`)
				}
				else {
					console.log(error)
				}
			});
	}

	const handleToggleResetRequest = (event) => {
		event.preventDefault();
		setData(null);
		setShowReset(!resetPassword)
	}

	//===========================================================================
	//Render functions
	const renderForm = () => {
		if (config.debugLevel > 1) console.log("  renderForm()")

		let upperSection = null
		let resetPasswordSection = null
		let resetLinkSection = null
		if( !resetPassword ) {
			upperSection = <div>
												<form className="form-inline">
													<div className="form-group">
														<label>Email</label>
														<input className="leftMargin form-control" type="text" name="email" value={email} onChange={handleChange} />
													</div><p />
													<div className="form-group">
														<label>Password</label>
														<input className="leftMargin form-control" type="password" name="password" autoComplete="off" value={password} onChange={handleChange} />
													</div><p />
													<code>POST {apiPath('POST', 'user', `login`, false)}<br/>
													{"{"}<br/>
													··email={email}<br/>
													··password={password}<br/>
													{"}"}</code><p/>
													<button type="submit" className="btn btn-primary" onClick={handleLogin} >Login</button>
												</form>
												<p />
												<div className="btn-group">
													<button className="btn btn-warning" onClick={handleToggleResetRequest} >Forgot Password</button>
												</div>
											</div>
		}
		else {
			resetPasswordSection = <div>
																<div className="btn-group">
																	<button className="btn btn-warning" onClick={handleToggleResetRequest} >Show Login</button>
																</div>
																<form className="form-inline">
																	<p style={{'margin': '17px', 'fontWeight': '800'}} >Reset Password </p>
																	<div className="form-group">
																		<label>Email</label>
																		<input className="leftMargin form-control" type="text" name="emailReset" value={emailReset} onChange={handleChange} />
																	</div><p />
																	<code>POST {apiPath('POST', 'user', `resetRequest`, false)}<br/>
																	{"{"}<br/>
																	··email={emailReset}<br/>
																	{"}"}</code><p/>
																	<button type="submit" className="btn btn-primary" onClick={handleResetRequest} >Request Password Reset</button>
																</form>
															</div>
		}
		if( resetLink != null && resetLink !== "" ) {
			const resetLinkUrl = "/resetPassword?token="+encodeURIComponent(resetLink)+"&email="+emailReset;
			resetLinkSection = <div><br/><p>The link that the client should send to the email address is:- <a href={resetLinkUrl}>{resetLink}</a></p></div>
		}
		
		const myJsonObject = data ?? {}
		const hideGettingBody = data == null ? {display: "none"} : {display: "block"}
		const jsonStyle = {
			backgroundColor: '#f5f5f5',
			border: '1px solid #ddd',
			padding: '10px 15px',
			borderRadius: '3px',
		}
		const listActiviveUsers = <div>
																<form className="form-inline">
																	<p/>
																	<button type="submit" className="btn btn-primary" onClick={handleListAccounts} >List Active Accounts</button><br/>
																	<code>GET {apiPath('GET', 'account', `active`, false)}</code><p/>
																</form>
																<div className="panel-body" style={hideGettingBody}>
																	<ReactJson style={jsonStyle} src={myJsonObject} />
																</div>
															</div>

		return (
			<div>
					{upperSection}
					{resetPasswordSection}
					{resetLinkSection}
					{listActiviveUsers}
			</div>
		);
		//interpunt U+00B7
	}

	const setAccount = (id) => {
		axios.post(apiPath('POST', '/accounts/set', id), {}).then(props.setAccountId(id))
			.catch((error) => {
				var data = error?.response?.data ?? null
				if (data) {
					console.warn(`${data.function}() - ${data.message}`)
				}
				else {
					console.log(error)
				}
			})
	}

	const handleSelection = (selectedUser) => {
		console.log(`------------------- handleSelection(${selectedUser})`)
		setEmail(selectedUser)
	}

	const getAPIPathId = props?.user?.id ? apiPath('GET', 'user', props.user.id) : 'ID NOT SET'
	// // User logged in.
	const renderStatus = () => {
		if (config.debugLevel > 1) console.log("  renderStatus()")
		const user = props.user;
		const renAccountsData = user.accounts.map((data, idx) =>
			<li key={idx}><button onClick={setAccount.bind(this, data.id)}>Select Account (accountId: {data.id})</button></li>
		);
		const admin = props.admin ? '(Admin User)' : ''


		return (
			<div>
				<span>Welcome {props.user.firstName} {props.user.lastName}! {admin}</span><p />
				<span>Accounts (count: {props.user.accounts.length})</span><br />
				<code>GET {getAPIPathId}</code><p />
				{(user.accounts == null || user.accounts.length === 0) ? <i>No Account Registered for User</i> : ''}
				Select an Account to set the session to that account, as a user may have mulitple accounts<br />
				<code>POST {apiPath('POST', '/accounts/set', '<accountID>')}</code><p />
				<span>
					<ul>
						{renAccountsData}
					</ul>
				</span>
				<p />
				<button type="submit"
					className="btn btn-primary"
					onClick={handleLogout}>
					Logout
				</button>
			</div>
		);
	}

	//Render the User list - Return from GET
	const renderUsers = () => {
		// console.log("***************** renderUsers")
		if (!admin || users == null || users.length === 0)
			return (<div></div>)

		// console.log(users)
		const renUserData = users.map((data, idx) =>
			<li key={idx}><button onClick={handleSelection.bind(this, data.email)}> {data.email}</button> - {data.firstName} {data.lastName} (role: {data.role})</li>
		);

		return (
			<div className="panel-body">
				<label>Users</label><br />
				<code>GET {apiPath('GET', 'user')}</code><br />
				Available users:
				<ul>
					{renUserData}
				</ul>
			</div>
		)
	}


	//===========================================================================
	//REACT Effects

	// OneMount
	useEffect(() => {
		console.log('*** LoginView MOUNT ***')
		//console.log(props)
	}, [props])

	//per Render
	useEffect(() => {
		console.log("%cLoginView - render()", 'color: yellow')
	})

	// on change... props.admin
	useEffect(() => {
		// console.log('*** admin *** ' + props.admin)
		setAdmin(props.admin)
		if (props.admin) {
			getUsers()
		}
	}, [getUsers, props.admin])

	//===========================================================================
	//Start the actual Render....
	const view = props.user ? renderStatus() : renderForm()
	const showUsers = renderUsers()

	return (
		<div className="panel panel-default">
			<div className="panel-heading">User</div>
			<div className="panel-body">{view}</div>
			{showUsers}
		</div>
	)
}

export default LoginView