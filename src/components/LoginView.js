import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as config from '../config/config';
import { apiPath } from '../lib/apiPath'
import Error from './error';

const LoginView = (props) => {
	const [email, setEmail ] = useState('test@email.com')
	const [password, setPassword ] = useState('password')
	const [users, setUsers] = useState(null)
	const [admin, setAdmin] = useState(props.admin)


	const getUsers = () => {
		if(!props.authenticated) return;

		console.log("LoginView.getUsers()")
		// console.log(`  authenticated: ${this.props.authenticated}`)

		axios.get(apiPath('GET','user')).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get user details.');
			}

			console.log('GET USERS')
			// console.log(response.data)
			const users = response.data
			console.log(users)

			console.log('--------------------------------------------')
			setUsers( users );
			console.log("Query Running RESET 1")
		}).catch((error) => {
			Error.message(error)
			console.log("Query Running RESET 2")
		});
	}

	//===========================================================================
	//Functions
	const handleChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		switch(name){
			case 'email': setEmail(value); break
			case 'password': setPassword(value); break
		}
		//this.setState({ [name]: value });
	}

	const handleLogin = (event) => {
		event.preventDefault();  // IMPORTANT.

		axios.post(apiPath('POST','user', 'login'), {
			email: email,
			password: password,
		}).then(props.handleLogin)
			.catch((error) => {
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

		axios.post(apiPath('POST','user', 'logout'))
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

	//===========================================================================
	//Render functions
	const renderForm = () => {
		if(config.debugLevel > 1) console.log("  renderForm()")
		return (
			<form className="form-inline">
				<div className="form-group">
					<label>Email</label>
					<input className="leftMargin form-control" type="text" name="email" value={email} onChange={handleChange} />
				</div><p />
				<div className="form-group">
					<label>Password</label>
					<input className="leftMargin form-control" type="password" name="password" autoComplete="off" value={password} onChange={handleChange} />
				</div><p />
				<button type="submit" className="btn btn-primary" onClick={handleLogin} >Login</button>
			</form>
		);
	}

	const setAccount = (id) => { props.setAccountId(id) }

	const handleSelection = (selectedUser) => {
		console.log(`------------------- handleSelection(${selectedUser})`)
		setEmail(selectedUser)
	}

	const getAPIPathId = props?.user?.id ? apiPath('GET', 'user', props.user.id) : 'ID NOT SET'
	// // User logged in.
	const renderStatus = () => {
		if(config.debugLevel > 1) console.log("  renderStatus()")
		const user = props.user;
		const renAccountsData = user.accounts.map((data, idx) =>
			<li key={idx}><button onClick={setAccount.bind(this, data.id)}>Select Account (accountId: {data.id})</button></li>
		);
		return (
			<div>
				<span>Welcome {props.user.firstName} {props.user.lastName}!</span><p />
				<span>Accounts (count: {props.user.accounts.length})</span><br/>
					<code>{getAPIPathId}</code><p/>
					{(user.accounts == null || user.accounts.length === 0)?<i>No Account Registered for User</i>:''}
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
		if(!admin || users == null || users.length === 0)
			return (<div></div>)

		// console.log(users)
		const renUserData = users.map((data, idx) =>
			<li key={idx}><button onClick={handleSelection.bind(this, data.email)}> {data.email}</button> - {data.firstName} {data.lastName} (role: {data.role})</li>
		);

		return (
			<div className="panel-body">
				<label>Users</label><br/>
				<code>{apiPath('GET', 'user')}</code><br/>
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
		console.log(props)
	},[])

	//per Render
	useEffect(() => {
		console.log("%cLoginView - render()", 'color: yellow')
	})

	// on change... props.admin
	useEffect(() => {
		// console.log('*** admin *** ' + props.admin)
		setAdmin(props.admin)
		if(props.admin) {
			getUsers()
		}
	},[props.admin])

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