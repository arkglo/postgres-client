// For editing one user's details. Can edit password as well.
import React, { Component } from 'react';
import axios from 'axios';
import * as config from '../config/config';
import { apiPath } from '../lib/apiPath'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Error from './error';

export default class ThemeEditView extends Component {
	constructor(props) {
		super(props);
		console.log(`ThemeEditView.constructor()`)
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
			theme: null,
			allThemes: null
		};

		// console.log("Props:")
		// console.log(props)
		this.handleCreate = this.handleCreate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.handleCreateTheme = this.handleCreateTheme.bind(this);
	}

	componentDidMount() {
		console.log(`ThemeEditView.componentDidMount(${this.props.themeId})`)
		this.getThemes()
	}

	getThemes() {
		console.log(`ThemeEditView.getThemes(${this.props.themeId})`)

		//Get All themes
		axios.get(apiPath('GET','theme')).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get theme details.');
			}
			this.setState({ allThemes: response.data })

			//Get just the theme we want
			if (this.props.themeId == null) return;

			return axios.get(apiPath('GET','theme', this.props.themeId))
		}).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get theme details.');
			}

			const theme = response.data
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
				receptionDateTime: theme.receptionDateTime
			})
			this.setState({ theme: theme })
			if (config.debugLevel > 1) console.log(theme)
		}).catch((error) => {
			Error.message(error.response)
		});
	}

	handleChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.type === 'color' ? target.name.split('-')[1] : target.name;
		// console.log("Change: " + name + ", new Value: " + value)
		this.setState({
			[name]: value
		});
	}

	check(key, req, oldData) {
		const value = this.state[key];
		let length = typeof (value === 'boolean') ? 1 : value.length
		//const previous = oldData == null ? "null" : oldData[key]
		//console.log(`check: ${key}, this.state: ${value}, ${typeof (value)}:${length}, oldData: ${previous}`)

		if (length > 0 && (oldData == null || value !== oldData[key])) {
			console.log(`check ${key} updated - new value: ${value}`)
			req[key] = value
		}
	}

	createChangeReqObject() {
		// only add new fields if changed and valid
		const oldTheme = this.state.theme
		var req = {}
		this.check("colour1", req, oldTheme)
		this.check("colour2", req, oldTheme)
		this.check("font", req, oldTheme)
		this.check("imageUrl", req, oldTheme)
		this.check("names", req, oldTheme)
		this.check("byLine", req, oldTheme)
		this.check("message", req, oldTheme)
		this.check("ceremonyEnabled", req, oldTheme)
		this.check("ceremonyMessage", req, oldTheme)
		this.check("ceremonyDateTime", req, oldTheme)
		this.check("receptionEnabled", req, oldTheme)
		this.check("receptionMessage", req, oldTheme)
		this.check("receptionDateTime", req, oldTheme)

		req.id = this.state.id

		return req
	}// createChangeReqObject

	checkThemeExists(name) {
		//checks if there is already a them with the same theme.names === name
		// return -1 if not found, otherwise return the index
		return this.state.allThemes.findIndex(theme => theme.names === name)
	}

	setTheme = (id) => {
		console.log(`setTheme to ${id}`)
		console.log(this.state.allThemes)

		const newThemeIndex = this.state.allThemes.findIndex((thisItem) => thisItem.id === id)
		console.log(`newThemeIndex to ${newThemeIndex}`)
		if (newThemeIndex !== -1) {
			const newTheme = this.state.allThemes[newThemeIndex]
			console.log(newTheme)

			// console.log(`this.state.accountId ${this.props.accountId}`)
			this.setState({
				id: newTheme.id,
				colour1: newTheme.colour1,
				colour2: newTheme.colour2,
				font: newTheme.font,
				imageUrl: newTheme.imageUrl,
				names: newTheme.names,
				byLine: newTheme.byLine,
				message: newTheme.message,
				ceremonyEnabled: newTheme.ceremonyEnabled,
				ceremonyMessage: newTheme.ceremonyMessage,
				ceremonyDateTime: newTheme.ceremonyDateTime,
				receptionEnabled: newTheme.receptionEnabled,
				receptionMessage: newTheme.receptionMessage,
				receptionDateTime: newTheme.receptionDateTime,
			})
			this.props.updateToThisThemeId(newTheme.id)
		}
	}


	handleCreate(event) {
		event.preventDefault();  // IMPORTANT.
		console.log("------------------- handleCreate()")
		const req = this.createChangeReqObject()
		req.accountID = this.props.accountId

		const count = Object.keys(req).length;
		if (config.debugLevel > 1) {
			console.log('Call Theme POST')
			console.log(`Number to update: ${count}`)
			console.log(req)
		}

		if (count <= 1) {
			console.warn("Nothing to post, bail")
			return;
		}

		axios.post(apiPath('POST','theme'), req).then((response) => {
			if (response.status !== 201) {
				return console.warn('Failed to create theme.');
			}
			console.log('Created a new theme');
		}).catch((error) => {
			console.log(error)
			Error.message(error.response)
		});
	}// handleCreate

	handleSubmit(event) {
		event.preventDefault();  // IMPORTANT.
		console.log("------------------- handleSubmit()")

		if (this.props.themeId == null) {
			console.log("No Theme to Update");
			return;
		}

		const req = this.createChangeReqObject()

		const count = Object.keys(req).length;
		if (config.debugLevel > 1) {
			console.log('Call Theme UPDATE')
			console.log(`Number to update: ${count}`)
			console.log(req)
		}

		if (count <= 1) {
			console.warn("Nothing to update, skip calling api")
			return;
		}

		axios.put(apiPath('PUT','theme', this.props.themeId), req).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to update theme.');
			}
			console.log('Updated theme details!');
		}).catch((error) => {
			Error.message(error.response)
		});
	}// handleSubmit

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
						axios.delete(apiPath('DELETE','theme', this.props.themeId)).then((response) => {
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


	createTheme(theme) {
		console.log("ThemeEditView.createTheme()")

		axios.post(apiPath('POST','theme'), theme).then((response) => {
			if (response.status !== 201) {
				return console.warn('Failed to create theme.');
			}
			console.log(`Created account [${theme.names}]!`)
		}).catch((error) => {
			var data = error?.response?.data ?? null
			if (data) {
				console.error(`${data.function}() - ${data.message}`)
			}
			else {
				console.log(error)
			}
		})
	}

	//------------------------------------------------------------
	//Allow basic creation of some test content
	handleCreateTheme(event) {
		event.preventDefault();  // IMPORTANT.
		console.log(`handleCreateTheme: ${event.target.id}`)
		// console.log(event)
		let thisTheme = {}
		switch (event.target.id) {
			case 'TestTheme-1':
				thisTheme = {
					accountID: this.props.accountId,
					colour1: "#5678D4",
					colour2: "#D4B256",
					font: "TestFont",
					imageUrl: "test_image.jpg",
					names: "TestNames",
					byLine: "TestByLine",
					message: "TestMessage"
				}
				break;
			case 'TestTheme-2':
				thisTheme = {
					accountID: this.props.accountId,
					colour1: "#f6ae13",
					colour2: "#2e3484",
					font: "TestFont2",
					imageUrl: "test_image2.jpg",
					names: "TestNames2",
					byLine: "TestByLine2",
					message: "TestMessage2"
				}
				break;
			case 'TestTheme-3':
				thisTheme = {
					accountID: this.props.accountId,
					colour1: "#646464",
					colour2: "#000000",
					font: "TestFont3",
					imageUrl: "test_image3.jpg",
					names: "TestNames3",
					byLine: "TestByLine3",
					message: "TestMessage3",
					ceremonyEnabled: true,
					ceremonyMessage: "ceremonyMessage3",
					ceremonyDateTime: "2021-03-17T13:37:16.991Z"
				}
				break;
			default:
				console.log("Unknown");
				return;
		}

		if(this.checkThemeExists(thisTheme.names) === -1){
			this.createTheme(thisTheme)
		}
		else {
			console.log(`Theme (${thisTheme.names}) already exists - skipping calling create`)
		}
	}

	capitalize = (s) => {
		if (typeof s !== 'string') return s //''
		return s.charAt(0).toUpperCase() + s.slice(1)
	}

	addDiv = (divType, field, state = undefined) => {
		let thisValue = this.state[field]
		if (divType === "text" && thisValue === null) thisValue = ""
		//console.log(`${divType} ${field}: [${thisValue}]`)

		let disabledState = false
		if (state !== undefined) {
			disabledState = !state
		}

		let typeField = ""


		switch (divType) {
			case "checkbox":
				typeField = <input style={{ width: '34px' }} className="form-control" type={divType} name={field} checked={thisValue} onChange={this.handleChange} />
				break
			case "text":
				typeField = <input className="form-control" type={divType} name={field} value={thisValue} disabled={disabledState} onChange={this.handleChange} />
				break
			case "color":
				const fieldName = "color-" + field
				typeField =
					<div>
						<input style={{ display: 'inline-block', width: '42px', height: '34px' }} className="form-control" type={divType} name={fieldName} value={thisValue} onChange={this.handleChange} />
						<input style={{ display: 'inline-block', width: "auto" }} className="form-control" type='text' name={field} value={thisValue} disabled={disabledState} onChange={this.handleChange} />
					</div>
				break
			default:
				typeField = <input className="form-control" type={divType} name={field} value={thisValue} disabled={disabledState} onChange={this.handleChange} />
				break
		}

		//console.log(typeField)
		return (
			<div className="form-group">
				<label>{this.capitalize(field)}</label>
				{typeField}
			</div>
		)
	}

	render() {
		console.log(`%cThemeEditView - render(themeId ${this.props.themeId})`, 'color: yellow')

		var buttons
		if (this.props.themeId == null) {
			buttons = <div className="btn-group">
				<button className="btn btn-success" onClick={this.handleCreate} >Create</button>
			</div>
		}
		else {
			buttons = <div className="btn-group">
				<button className="btn btn-primary" onClick={this.handleSubmit} >Update</button>
			</div>
		}

		//AllThemes
		let allThemesLength = 0
		let themeList = null
		if (this.state.allThemes != null) {
			allThemesLength = this.state.allThemes.length
			themeList = this.state.allThemes.map((data, idx) =>
				<li key={idx}><button onClick={this.setTheme.bind(this, data.id)}>Select Theme {data.id}</button> - '{data.names}'</li>
			)
		}

		//Now render
		return (
			<>
				<div className="panel panel-default">
					<div className="panel-heading">Theme Edit (<i>{this.props.themeId}</i>)<br />
						<code>{apiPath('GET', 'theme', this.props.themeId, false)}</code></div>
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

							{buttons}
							<div className="btn-group">
								<button className="btn btn-danger" onClick={this.handleRemove} >Remove</button>
							</div>
						</form>
					</div>
				</div>
				<div className="panel panel-default">
					<div className="panel-heading">All Available Themes (<i>{allThemesLength}</i>)<br />
						<code>{apiPath('GET', 'theme', null, false)}</code>
					</div>
					<div className="panel-body">
						Update Account({this.props.accountId}) to use a pre-existing theme:<p/>
						{themeList}
					</div>
				</div>
				<div className="panel panel-default">
					<div className="panel-heading">PreConfigured Theme data</div>
					<div className="panel-body">
						<li><button type="submit" className="btn btn-primary" onClick={this.handleCreateTheme} id="TestTheme-1" >Create Theme-1</button></li>
						<li><button type="submit" className="btn btn-primary" onClick={this.handleCreateTheme} id="TestTheme-2" >Create Theme-2</button></li>
						<li><button type="submit" className="btn btn-primary" onClick={this.handleCreateTheme} id="TestTheme-3" >Create Theme-3</button></li>
					</div>
				</div>
			</>
		);
	}
}