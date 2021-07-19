import React, { Component } from 'react';
import styles from '../css/mystyles.module.css'

export default class NavBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		const accountLabel = (this.props.accountId === -1) ? "" : `(accountId:${this.props.accountId})`
		const themeLabel = (this.props.themeId === -1) ? "" : `(themeId:${this.props.themeId})`
		const myGiftsLabel = (this.props.myGiftsId === -1) ? "" : (this.props.myGiftsId !== null) ? `(myGiftsId:${this.props.myGiftsId})` : `(No myGifts)`
		const title = this.props.admin ? <span style={{color:'red'}} title='Admin User'>Test</span> : 'Test'

		const adminButton = this.props.admin ? 
			<button type="button" name="services_edit"
				className="btn btn-warning navbar-btn"
				onClick={this.props.showAdmin}>
					Admin
			</button> : ""

		console.log(styles.sticky)
		return (
			<nav className={styles.sticky}>
				<span className="navbar-brand">{title}</span>
				<span className="navbar-text">({this.props.viewType})</span>
				<div className="btn-group" role="group">
					<button type="button" name="reset"
						className="btn btn-default navbar-btn"
						onClick={this.props.handleReset}>
						Reset
						</button>
					<button type="button" name="signup"
						className="btn btn-default navbar-btn"
						onClick={this.props.showSignup}>
						Signup
						</button>
					<button type="button" name="user_edit"
						className="btn btn-default navbar-btn"
						onClick={this.props.showUserEdit}>
						User edit
						</button>
					<button type="button" name="account_edit"
						className="btn btn-default navbar-btn"
						disabled={this.props.accountId === -1}
						onClick={this.props.showAccountEdit}>
						Account {accountLabel}
						</button>
						<button type="button" name="theme_edit"
						className="btn btn-default navbar-btn"
						disabled={this.props.themeId === -1}
						onClick={this.props.showThemeEdit}>
						Theme {themeLabel}
						</button>
					<button type="button" name="theme_edit"
						className="btn btn-default navbar-btn"
						disabled={this.props.myGiftsId === -1}
						onClick={this.props.showMyGiftsEdit}>
						My Gifts {myGiftsLabel}
						</button>
					<button type="button" name="services_edit"
						className="btn btn-default navbar-btn"
						onClick={this.props.showServices}>
						Sevices
						</button>
					{adminButton}

					<button type="button" name="services_edit"
						className="btn btn-secondary navbar-btn"
						onClick={()=> window.open('https://tl-pg-server.herokuapp.com/docs/', '_blank')}>
						Help
						</button>
				</div>
			</nav>
		);
	}
}