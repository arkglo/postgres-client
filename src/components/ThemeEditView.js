// For editing one user's details. Can edit password as well.
import React, { Component } from 'react';
import axios from 'axios';
import * as config from '../config';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Error from './error';

export default class AccountEditView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "id": 1,
      "colour1": '',
      "colour2": '',
      "font": '',
      "imageUrl": '',
      "names": null,
      "byLine": null,
      "message": null,
      "ceremonyEnabled": false,
      "ceremonyMessage": null,
      "ceremonyDateTime": null,
      "receptionEnabled": false,
      "receptionMessage": null,
      "receptionDateTime": null,
    };

    // "createdAt": "2021-05-12T12:50:53.521Z",
    // "updatedAt": "2021-05-12T12:50:53.521Z"

    // console.log("Props:")
    // console.log(props)

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidMount() {
    console.log(`ThemeEditView.componentDidMount(${this.props.themeId})`)

    axios.get(config.apiPath('theme',this.props.themeId)).then((response) => {
      if (response.status !== 200) {
        return console.warn('Failed to get account details.');
      }

      const theme = response.data
      console.log("Colour1: " + theme.colour1)
      console.log(typeof(theme.colour1))
      this.setState({
        id: theme.id,
        colour1: theme.colour1,
        colour2: theme.colour2,
        font: theme.font,
        imageUrl: theme.imageUrl,
        names: theme.names,
        byLine: theme.byLine,
        message: theme.message,
        ceremonyEnabled: theme.ceremonyEnabled,
        ceremonyMessage: theme.ceremonyMessage,
        ceremonyDateTime: theme.ceremonyDateTime,
        receptionEnabled: theme.receptionEnabled,
        receptionMessage: theme.receptionMessage,
        receptionDateTime: theme.receptionDateTime,
      })
      this.setState({theme: theme})
      if(config.debugLevel > 1) console.log(theme)
    }).catch((error) => {
      Error.message(error.response)
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.type === 'color' ? target.name.split('-')[1] : target.name;
    console.log("chnage: " + value+ ", name: " + name)
    this.setState({
      [name]: value
    });
  }

  check(key, req, oldData) {
    if (this.state[key] !== oldData[key] && this.state[key].length > 0) {
      req[key] = this.state[key]
    }
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

    //console.log(this.state) // new
    //console.log(this.state.account) // old
    const oldTheme = this.state.theme

    this.check("colour1", req, oldTheme);
    this.check("colour2", req, oldTheme);
    this.check("font", req, oldTheme);
    this.check("imageUrl", req, oldTheme);
    this.check("names", req, oldTheme);
    this.check("byLine", req, oldTheme);
    this.check("message", req, oldTheme);
    this.check("ceremonyEnabled", req, oldTheme);
    this.check("ceremonyMessage", req, oldTheme);
    this.check("ceremonyDateTime", req, oldTheme);
    this.check("receptionEnabled", req, oldTheme);
    this.check("receptionMessage", req, oldTheme);
    this.check("receptionDateTime", req, oldTheme);

    req.id = this.state.id

    if(config.debugLevel > 1) {
      console.log('Call Theme UPDATE')
      console.log(req)
    }

    axios.put(config.apiPath('theme', this.props.themeId), req).then((response) => {
      if (response.status !== 200) {
        return console.warn('Failed to update theme.');
      }
      console.log('Updated theme details!');
    }).catch((error) => {
      Error.message(error.response)
    });
  }

  handleRemove(event, themeId) {
    event.preventDefault();
    console.log("------------------- handleRemove()")
    confirmAlert({
      title: 'Confirm',
      message: 'Are you VERY sure you want to delete the Theme?',
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios.delete(config.apiPath('theme', this.props.themeId)).then((response) => {
              if (response.status !== 200) {
                return console.warn('Failed to remove theme.');
              }
              console.log('Successfully deleted theme.');
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

  capitalize = (s) => {
    if (typeof s !== 'string') return s //''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  addDiv = (divType, field, state = undefined) => {
    let thisValue = this.state[field]
    if(divType === "text" && thisValue === null) thisValue = ""
    //console.log(`${divType} ${field}: [${thisValue}]`)

    let disabledState = false
    if(state !== undefined) {
      disabledState = !state
    }

    let typeField=""


    switch(divType) {
      case "checkbox":
        typeField=<input style={{width: '34px'}} className="form-control" type={divType} name={field} defaultChecked={thisValue} onChange={this.handleChange} />
        break
      case "text":
        typeField = <input className="form-control" type={divType} name={field} value={thisValue} disabled={disabledState} onChange={this.handleChange} />
        break
      case "color":
        const fieldName = "color-" + field
        typeField = 
        <div>
          <input style={{display: 'inline-block', width: '42px', height: '34px'}} className="form-control" type={divType} name={fieldName} value={thisValue} onChange={this.handleChange}/>
          <input style={{display: 'inline-block', width: "auto"}}  className="form-control" type='text' name={field} value={thisValue} disabled={disabledState} onChange={this.handleChange} />
        </div>
        break
      default:
        typeField = <input className="form-control" type={divType} name={field} value={thisValue} disabled={disabledState} onChange={this.handleChange} />
        break
    }

    // console.log(typeField)
    return (
      <div className="form-group">
        <label>{this.capitalize(field)}</label>
        {typeField}
      </div>
    )
  }

  render() {
    console.log("%cThemeEditView - render()", 'color: yellow')
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Theme Edit (<i>{this.props.themeId}</i>)</div>
        <div className="panel-body">

          <form className="form">
            {this.addDiv("color", "colour1")}
            {this.addDiv("color", "colour2")}
            {this.addDiv("text", "font")}
            {this.addDiv("text", "imageUrl")}
            {this.addDiv("text", "names")}
            {this.addDiv("text", "byLine")}
            {this.addDiv("text", "message")}
            {this.addDiv("checkbox", "ceremonyEnabled")}
            {this.addDiv("text", "ceremonyMessage", this.state.ceremonyEnabled)}
            {this.addDiv("text", "ceremonyDateTime", this.state.ceremonyEnabled)}
            {this.addDiv("checkbox", "receptionEnabled")}
            {this.addDiv("text", "receptionMessage", this.state.receptionEnabled)}
            {this.addDiv("text", "receptionDateTime", this.state.receptionEnabled)}

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