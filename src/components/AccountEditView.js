// For editing one user's details. Can edit password as well.
import React, { Component } from 'react';
import axios from 'axios';
import * as config from '../config/config';
import { apiPath } from '../lib/apiPath'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Error from './error';

export default class AccountEditView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: -1,
      role: '',
      firstName: '',
      lastName: '',
      email: '',
      id: -1,
      partnerFirstName: '',
      partnerLastName: '',
      eventDate: '',
      websiteLink: '',
      themeID: '',
      gifts: ''
    };

    // console.log("Props:")
    // console.log(props)

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }//constructor

  componentDidMount() {
    // console.log(`AccountEditView.componentDidMount(${this.props.accountId})`)

    axios.get(apiPath('GET','account',this.props.accountId)).then((response) => {
      if (response.status !== 200) {
        return console.warn('Failed to get account details.');
      }

      const account = response.data
      this.setState({
        role: account.role,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        partnerFirstName: account.partnerFirstName,
        partnerLastName: account.partnerLastName,
        eventDate: account.eventDate,
        websiteLink: account.websiteLink,
        id: account.id,
        userID: account.userID,
      })
      this.setState({account: account})
      this.props.setThemeId(account.themeID)
      if(config.debugLevel > 1) console.log(account)
    }).catch((error) => {
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
  }

  updateReq(req, key) {
    if(this.state[key] !== this.state.account[key] && this.state[key].length > 0) {
      req[key] = this.state[key]
    }
  }

  handleSubmit(event) { //Perfomr Account Update
    event.preventDefault();  // IMPORTANT.
    console.log("------------------- handleSubmit() Update")
    var req = {}

    // only add new fields if changed and valid
    if (this.state.password) {
      if (this.state.password.length < 6) {
        return console.error('Password is too short.');
      }
      if (this.state.password !== this.state.password2) {
        return console.error('Passwords do not match.');
      }
      req.password = this.state.password;
    }

    console.log(this.state) // new
    console.log(this.state.account) // old
    const oldAccount = this.state.account

    this.updateReq(req, 'email')
    this.updateReq(req, 'firstName')
    this.updateReq(req, 'lastName')
    this.updateReq(req, 'partnerFirstName')
    this.updateReq(req, 'partnerLastName')
    this.updateReq(req, 'eventDate')
    this.updateReq(req, 'websiteLink')
    req.userID = this.state.userID

    if(config.debugLevel > 1) {
      console.log('Call Account UPDATE')
      console.log(req)
    }

    axios.put(apiPath('PUT','account', this.props.accountId), req).then((response) => {
      if (response.status !== 200) {
        return console.warn('Failed to update account.');
      }
      console.log('Updated account details!');
    }).catch((error) => {
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
            axios.delete(apiPath('DELETE','account', this.props.accountId)).then((response) => {
              if (response.status !== 200) {
                return console.warn('Failed to remove account.');
              }
              console.log('Successfully deleted account.');
              this.props.handleLogout()
            }).catch((error) => {
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

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Account Edit (<i>{this.props.accountId}</i>)<br/>
					<code>{apiPath('GET', 'account', this.props.accountId)}</code></div>
        <div className="panel-body">

          <form className="form">

            <div className="form-group">
              <label>Role</label>
              <input className="form-control" type="text" name="role" value={this.state.role} onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <label>First Name</label>
              <input className="form-control" type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input className="form-control" type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="text" name="email" value={this.state.email} onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <label>Partner FirstName</label>
              <input className="form-control" type="text" name="partnerFirstName" value={this.state.partnerFirstName} onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <label>Partner LastName</label>
              <input className="form-control" type="text" name="partnerLastName" value={this.state.partnerLastName} onChange={this.handleChange} />
            </div>

            <div className="btn-group">
              <button className="btn btn-primary" onClick={this.handleSubmit} >Update</button>
            </div>
            <div className="btn-group">
              <button className="btn btn-danger" onClick={this.handleRemove} >Remove</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}