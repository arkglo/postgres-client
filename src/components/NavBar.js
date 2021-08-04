import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap'
import styles from '../css/mystyles.module.css'

import axios from 'axios';
import { apiPath } from '../lib/apiPath'


export default class NavBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	handleLogout = (event) => {
		event.preventDefault();

		axios.post(apiPath('POST', 'user', 'logout'))
			.then(this.props.handleLogout)
			.catch((error) => {
				var data = error?.response?.data ?? null
				if (data) {
					console.error(`${data.function}() - ${data.message}`)
				}
				else {
					console.log(error)
				}
			})
	}

	render() {
		const accountLabel = (this.props.accountId === -1) ? "" : `(accountId:${this.props.accountId})`
		const themeLabel = (this.props.themeId === -1) ? "" : `(themeId:${this.props.themeId})`
		const myGiftsLabel = (this.props.myGiftsId === -1) ? "" : (this.props.myGiftsId !== null) ? `(myGiftsId:${this.props.myGiftsId})` : `(No myGifts)`
		const title = this.props.admin ? <span style={{ color: 'red' }} title='Admin User'>Test</span> : 'Test'

		const accountSelectText = 'Select an Account to access menu option'
		const accountEditSelectText = 'Select an Account and Edit the account to access menu option'
		const adminButton = this.props.admin ?
			<Button type="button" name="services_edit"
				//className="btn btn-warning navbar-btn"
				variant='warning'
				disabled={this.props.accountId === -1}
				onClick={this.props.showAdmin}
				title={this.props.accountId === -1 ? accountSelectText : 'Admin'}>
				Admin
			</Button> : ""

		const logoutView = !this.props.user ? null : <Button type="submit" variant='btn-secondary' onClick={this.handleLogout}>Logout</Button>

		console.log(styles.sticky)
		const vt = this.props.viewType
		return (
			<nav className={styles.sticky} >
				<span className="navbar-brand">{title}</span>
				<span className="navbar-text">({vt})</span>
				<ButtonGroup style={{ verticalAlign: 'middle', marginTop: '10px' }} aria-label="NavBar">
					<Button type="button" name="reset"
						// className="btn btn-secondary navbar-btn"
						variant='dark'
						onClick={this.props.handleReset}>
						Reset
					</Button>
					{logoutView}
					<Button type="button" name="signup"
						//className="btn btn-default navbar-btn"
						variant='primary'
						onClick={this.props.showSignup}
						active={vt === 'SignupView'}>
						Signup
					</Button>
					<Button type="button" name="user_edit"
						//className="btn btn-default navbar-btn"
						disabled={this.props.user === null}
						onClick={this.props.showUserEdit}
						title='Available when logged in'
						active={vt === 'UserEditView'}>
						User edit
					</Button>
					<Button type="button" name="account_edit"
						//className="btn btn-default navbar-btn"
						disabled={this.props.accountId === -1}
						onClick={this.props.showAccountEdit}
						title={this.props.accountId === -1 ? accountSelectText : 'Account Edit'}
						active={vt === 'AccountEditView'}>
						Account {accountLabel}
					</Button>
					<Button type="button" name="theme_edit"
						//className="btn btn-default navbar-btn"
						disabled={this.props.themeId === -1}
						onClick={this.props.showThemeEdit}
						title={this.props.themeId === -1 ? accountEditSelectText : 'Theme Edit'}
						active={vt === 'ThemeEditView'}>
						Theme {themeLabel}
					</Button>
					<Button type="button" name="mygifts_edit"
						//className="btn btn-default navbar-btn"
						disabled={this.props.myGiftsId === -1}
						onClick={this.props.showMyGiftsEdit}
						title={this.props.myGiftsId === -1 ? accountEditSelectText : 'MyGifts Edit'}
						active={vt === 'MyGiftsView'}>
						My Gifts {myGiftsLabel}
					</Button>
					<Button type="button" name="gifts_available"
						//className="btn btn-default navbar-btn"
						disabled={this.props.accountId === -1}
						onClick={this.props.showGiftsAvailable}
						title={this.props.accountId === -1 ? accountSelectText : 'Gifts Edit'}
						active={vt === 'GiftsAvailable'}>
						Gifts Available
					</Button>
					<Button type="button" name="gifts_edit"
						//className="btn btn-default navbar-btn"
						disabled={this.props.accountId === -1}
						onClick={this.props.showGiftsEdit}
						title={this.props.accountId === -1 ? accountSelectText : 'Gifts Edit'}
						active={vt === 'GiftsView'}>
						Gifts Status
					</Button>
					<Button type="button" name="services_edit"
						//className="btn btn-default navbar-btn"
						onClick={this.props.showServices}
						active={vt === 'Services'}>
						Sevices
					</Button>
					{adminButton}

					<Button type="button" name="services_edit"
						//className="btn btn-secondary navbar-btn"
						onClick={() => window.open('https://tl-pg-server.herokuapp.com/docs/', '_blank')}>
						Help
					</Button>
				</ButtonGroup>
			</nav>
		)
	}
}