// For editing one user's details. Can edit password as well.
import React, { Component } from 'react';
import axios from 'axios';
import * as config from '../config';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Error from './error';

export default class UserEditView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      password2: '',
    };

    console.log(props)

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.subPath = "users"
  }

  componentDidMount(){
    console.log("UserEditView.componentDidMount()")

    axios.get(config.apiPath('user')).then((response) => {
      if (response.status !== 200) {
        return console.warn('Failed to get user details.');
      }

      // console.log(response.data)
      const user = response.data
      this.setState({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: '',  // Empty means no change.
        password2: '',
      });
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

  handleSubmit(event) {
    event.preventDefault();  // IMPORTANT.
    console.log("------------------- handleSubmit()")
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

    if(this.state.email !== this.props.user.email && this.state.email.length > 0) { 
      req.email = this.state.email
    }
    if(this.state.firstName !== this.props.user.firstName && this.state.firstName.length > 0) { 
      req.firstName = this.state.firstName
    }
    if(this.state.lastName !== this.props.user.lastName && this.state.lastName.length > 0) { 
      req.lastName = this.state.lastName
    }

    axios.put(config.apiPath('user'), req).then((response) => {
      if (response.status !== 200) {
        return console.warn('Failed to update user.');
      }
      console.log('Updated user details!');
    }).catch((error) => {
      Error.message(error.response)
    });
  }

  handleRemove(event, userID) {
    event.preventDefault();
    console.log("------------------- handleRemove()")
    confirmAlert({
      title: 'Confirm',
      message: 'Are you VERY sure you want to delete yourself?',
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios.delete(config.apiPath('user', this.props.user.id)).then((response) => {
              if (response.status !== 200) {
                return console.warn('Failed to remove user.');
              }
              console.log('Successfully deleted user.');
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
        <div className="panel-heading">User Edit</div>
        <div className="panel-body">

          <form className="form">
          
          <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="text" name="email" value={this.state.email} onChange={this.handleChange} />
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
              <label>Password (leave empty if you do not want to change)</label>
              <input className="form-control" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <label>Confirm password</label>
              <input className="form-control" type="password" name="password2" value={this.state.password2} onChange={this.handleChange} />
            </div>

            <div className="btn-group">
              <button className="btn btn-primary" onClick={ this.handleSubmit } >Update</button>
            </div>
            <div className="btn-group">
              <button className="btn btn-danger" onClick={ this.handleRemove } >Remove</button>
            </div>
          </form>
        </div>
      </div>
      );
  }
}