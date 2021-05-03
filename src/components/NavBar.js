import React, { Component } from 'react';

export default class NavBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		const accountLabel = (this.props.accountId===-1)?"":<span className='navbar-brand'>Account: {this.props.accountId}</span>
		return (
			<nav className="navbar navbar-default myNav">
				<span className="navbar-brand">Test</span>
				<div className="btn-group" role="group">
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
						disabled={this.props.accountId===-1}
						onClick={this.props.showAccountEdit}>
						Account edit
						</button>
						{accountLabel}
				</div>
			</nav>
		);
	}
}