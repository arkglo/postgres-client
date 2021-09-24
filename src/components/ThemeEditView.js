// For editing one user's details. Can edit password as well.
import React, { Component } from 'react';
import axios from 'axios';
import * as config from '../config/config';
import { apiPath } from '../lib/apiPath'
import styles from '../css/mystyles.module.css'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
			"heroImageUrl": '',
			"secondImageUrl": '',
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
			allThemes: null,
			ceremonyObject: null,
			receptionObject: null
		};

		// console.log("Props:")
		// console.log(props)
		this.handleCreate = this.handleCreate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.handleCreateTheme = this.handleCreateTheme.bind(this);
		this.handleCeremonyDateChange = this.handleCeremonyDateChange.bind(this);
		this.handleReceptionDateChange = this.handleReceptionDateChange.bind(this);
	}

	componentDidMount() {
		console.log(`ThemeEditView.componentDidMount(${this.props.themeId})`)
		this.getThemes()
	}

	getThemes() {
		console.log(`ThemeEditView.getThemes(${this.props.themeId})`)

		//Get All themes
		axios.get(apiPath('GET', 'theme')).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get theme details.');
			}
			this.setState({ allThemes: response.data.data })

			//Get just the theme we want
			if (this.props.themeId == null) return;

			return axios.get(apiPath('GET', '/accounts/theme', this.props.accountId))
		}).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get theme details.');
			}

			const theme = response.data.data
			let CDT, RDT = null
			if ( theme.ceremonyDateTime != null && theme.ceremonyDateTime !== "" ) {
				debugger
				const dateTimeArray = theme.ceremonyDateTime.split(" ");
				const dateArray = dateTimeArray[0].split("/");
				CDT = new Date( dateArray[2]+"-"+dateArray[1]+"-"+dateArray[0]+" "+dateTimeArray[1]);
			}
			if ( theme.receptionDateTime != null && theme.receptionDateTime !== "" ) {
				const dateTimeArray = theme.receptionDateTime.split(" ");
				const dateArray = dateTimeArray[0].split("/");
				RDT = new Date( dateArray[2]+"-"+dateArray[1]+"-"+dateArray[0]+" "+dateTimeArray[1]);
			}
			this.setState({
				id: theme.id,
				colour1: theme.colour1,
				colour2: theme.colour2,
				font: theme.font,
				heroImageUrl: theme.heroImageUrl,
				secondImageUrl: theme.secondImageUrl,
				names: theme.names,
				byLine: theme.byLine,
				message: theme.message,
				ceremonyEnabled: theme.ceremonyEnabled,
				ceremonyMessage: theme.ceremonyMessage,
				ceremonyDateTime: theme.ceremonyDateTime,
				receptionEnabled: theme.receptionEnabled,
				receptionMessage: theme.receptionMessage,
				receptionDateTime: theme.receptionDateTime,
				ceremonyObject: CDT,
				receptionObject: RDT
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
		this.check("heroImageUrl", req, oldTheme)
		this.check("secondImageUrl", req, oldTheme)
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
			let CDT, RDT = null;
			if ( newTheme.ceremonyDateTime != null && newTheme.ceremonyDateTime !== "" ) {
				const dateTimeArray = newTheme.ceremonyDateTime.split(" ");
				const dateArray = dateTimeArray[0].split("/");
				CDT = new Date( dateArray[2]+"-"+dateArray[1]+"-"+dateArray[0]+" "+dateTimeArray[1]);
			}
			if ( newTheme.receptionDateTime != null && newTheme.receptionDateTime !== "" ) {
				const dateTimeArray = newTheme.receptionDateTime.split(" ");
				const dateArray = dateTimeArray[0].split("/");
				RDT = new Date( dateArray[2]+"-"+dateArray[1]+"-"+dateArray[0]+" "+dateTimeArray[1]);
			}
			this.setState({
				id: newTheme.id,
				colour1: newTheme.colour1,
				colour2: newTheme.colour2,
				font: newTheme.font,
				heroImageUrl: newTheme.heroImageUrl,
				secondImageUrl: newTheme.secondImageUrl,
				names: newTheme.names,
				byLine: newTheme.byLine,
				message: newTheme.message,
				ceremonyEnabled: newTheme.ceremonyEnabled,
				ceremonyMessage: newTheme.ceremonyMessage,
				ceremonyDateTime: newTheme.ceremonyDateTime,
				receptionEnabled: newTheme.receptionEnabled,
				receptionMessage: newTheme.receptionMessage,
				receptionDateTime: newTheme.receptionDateTime,
				ceremonyObject: CDT,
				receptionObject: RDT
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

		axios.post(apiPath('POST', 'theme'), req).then((response) => {
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

		axios.put(apiPath('PUT', 'theme', this.props.themeId), req).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to update theme.');
			}
			console.log('Updated theme details!')
			this.getThemes()
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
						axios.delete(apiPath('DELETE', 'theme', this.props.themeId)).then((response) => {
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

		axios.post(apiPath('POST', 'theme'), theme).then((response) => {
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
	handleCeremonyDateChange(newDate) {
		const DateString = newDate === null ? '' : new Intl.DateTimeFormat('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}).format(newDate)
		const TimeString = newDate === null ? '' : new Intl.DateTimeFormat('en-GB', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false}).format(newDate)
		const ceremonyString = DateString +" "+ TimeString;
		this.setState({ ceremonyDateTime: ceremonyString, ceremonyObject: newDate});
	}
	handleReceptionDateChange(newDate) {
		const DateString = newDate === null ? '' : new Intl.DateTimeFormat('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}).format(newDate)
		const TimeString = newDate === null ? '' : new Intl.DateTimeFormat('en-GB', {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}).format(newDate)
		const receptionString = DateString +" "+ TimeString;
		this.setState({ receptionDateTime: receptionString, receptionObject: newDate});
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
					font: this.state.font || "TestFont",
					heroImageUrl: this.state.heroImageUrl || "test_image.jpg",
					secondImageUrl: this.state.secondImageUrl || "test2_image.jpg",
					names: this.state.names || "TestNames",
					byLine: this.state.byLine || "TestByLine",
					message: this.state.message || "TestMessage"
				}
				break;
			case 'TestTheme-2':
				thisTheme = {
					accountID: this.props.accountId,
					colour1: "#f6ae13",
					colour2: "#2e3484",
					font: this.state.font || "TestFont2",
					heroImageUrl: this.state.heroImageUrl || "test_image2.jpg",
					secondImageUrl: this.state.secondImageUrl || "test2_image2.jpg",
					names: this.state.names || "TestNames2",
					byLine: this.state.byLine || "TestByLine2",
					message: this.state.message || "TestMessage2"
				}
				break;
			case 'TestTheme-3':
				thisTheme = {
					accountID: this.props.accountId,
					colour1: "#646464",
					colour2: "#000000",
					font: this.state.font || "TestFont3",
					heroImageUrl: this.state.heroImageUrl || "test_image3.jpg",
					secondImageUrl: this.state.secondImageUrl || "test2_image3.jpg",
					names: this.state.names || "TestNames3",
					byLine: this.state.byLine || "TestByLine3",
					message: this.state.message || "TestMessage3",
					ceremonyEnabled: true,
					ceremonyMessage: "ceremonyMessage3",
					ceremonyDateTime: "2021-03-17T13:37:16.991Z"
				}
				break;
			default:
				console.log("Unknown");
				return;
		}

		if (this.checkThemeExists(thisTheme.names) === -1) {
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

	addDiv = (divType, field, state = undefined, extraState = undefined, extraCallback = undefined) => {
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
			case "datepicker":
				typeField = <DatePicker style={{ width: 'unset' }} type={divType} name={field} disabled={disabledState}
																dateFormat="dd/MM/yyyy"
																selected={extraState}
																onSelect={extraCallback} //when day is clicked
																onChange={extraCallback} //only when value has changed
															/>
				break
			case "datetimepicker":
				typeField = <DatePicker style={{ width: 'unset' }} type={divType} name={field} disabled={disabledState}
																dateFormat="dd/MM/yyyy hh:mm:ss"
																showTimeSelect
																timeIntervals={5}
																selected={extraState}
																onSelect={extraCallback} //when day is clicked
																onChange={extraCallback} //only when value has changed
															/>
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

	renderPreview() {
		const font = {
			fontFamily: this.state.font,
			color: this.state.colour1,
		}

		const h1Overide = {
			...font,
			fontSize: '1.5em',
			textAlign: 'left',
			fontWeight: 'bold'
		}

		const h2Overide = {
			...font,
			fontSize: '0.9em',
			textAlign: 'left',
			fontWeight: 'lighter',
			fontStyle: 'italic',
		}

		const messageOveride = {
			...font,
			fontSize: '1em',
			width: '100%',
		}


		let ceremony = null
		if (this.state.ceremonyEnabled) {
			ceremony = <div><b>Ceremony</b><br />{this.state.ceremonyMessage}<br />{this.state.ceremonyDateTime}</div>
		}

		let reception = null
		if (this.state.receptionEnabled) {
			reception = <div><b>Reception</b><br />{this.state.receptionMessage}<br />{this.state.receptionDateTime}</div>
		}

		return (
			<div>
				<h4 className='text-primary'> Preview:</h4>
				<div className="panel-body" style={{ margin: '10px 50px', width: '80%', border: '1px solid #6c757d', borderRadius: '20px', backgroundColor: this.state.colour2 }} >
					<img style={{ maxWidth: '80%', objectFit: 'contain', display: 'block', margin: 'auto' }} src={this.state?.heroImageUrl} alt='Hero Theme URL' />
					<img style={{ maxWidth: '80%', objectFit: 'contain', display: 'block', margin: 'auto' }} src={this.state?.secondImageUrl} alt='Second Theme URL' />
					<h1 style={h1Overide}>{this.state.names}</h1>
					<div style={h2Overide}>{this.state.byLine}</div>
					<div style={messageOveride}>{this.state.message}</div><p />
					<table style={{ width: '100%' }}>
						<tbody>
							<tr>
								<td>
									<div style={messageOveride}>{ceremony}</div>
								</td>
								<td>
									<div style={messageOveride}>{reception}</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		)
	}

	renderCreateThemes() {
		//Create theme (admin only)
		if (this.props.admin) {
			return (
				<div className="panel panel-default">
					<div className="panel-heading">PreConfigured Theme data</div>
					<div className="panel-body">
						<li><button type="submit" className="btn btn-primary" onClick={this.handleCreateTheme} id="TestTheme-1" >Create Theme-1</button></li>
						<li><button type="submit" className="btn btn-primary" onClick={this.handleCreateTheme} id="TestTheme-2" >Create Theme-2</button></li>
						<li><button type="submit" className="btn btn-primary" onClick={this.handleCreateTheme} id="TestTheme-3" >Create Theme-3</button></li>
					</div>
				</div>
			)
		}
		else
			return
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

		const themePreview = this.renderPreview()

		//AllThemes
		const colorBox = {
			display: 'inline-block',
			width: '20px', height: '20px',
			verticalAlign: 'middle',
		}
		const colorBoxExample = {
			display: 'inline-block',
			width: '100px', height: '20px',
			verticalAlign: 'middle',
			textAlign: 'center',
		}
		let allThemesLength = 0
		let themeList = null
		if (this.state.allThemes != null) {
			allThemesLength = this.state.allThemes.length
			themeList = this.state.allThemes.map((data, idx) =>
				<li key={idx}>
					<button onClick={this.setTheme.bind(this, data.id)}>Select Theme {data.id}</button> - '{data.names}' {' '}
					<div style={{ ...colorBox, backgroundColor: data.colour1 }} />
					<div style={{ ...colorBox, backgroundColor: data.colour2 }} />{' - '}
					<div style={{ ...colorBoxExample, backgroundColor: data.colour2, color: data.colour1 }}>{data.names}</div>
				</li>
			)
		}

		let createTheme = this.renderCreateThemes()

		//Now render
		return (
			<>
				<div className="panel panel-default">
					<div className="panel-heading">Theme Edit (<i>themeID: {this.props.themeId}</i>)<br />
						<div className={styles.blue}>The Theme View provides the Theme setup and selection for the current account</div><p />
						<code>GET {apiPath('GET', 'theme', this.props.themeId, false)}</code> {'<'} <i>themeId</i><br />
						<code>GET {apiPath('GET', '/accounts/theme', this.props.accountId, false)}</code> {'<'} <i>accountId</i> - suggested option
					</div>
					<div className="panel-body">

						<form className="form">
							{this.addDiv("color", "colour1")}
							{this.addDiv("color", "colour2")}
							{this.addDiv("text", "font")}
							{this.addDiv("text", "heroImageUrl")}
							{this.addDiv("text", "secondImageUrl")}
							{this.addDiv("text", "names")}
							{this.addDiv("text", "byLine")}
							{this.addDiv("text", "message")}
							{this.addDiv("checkbox", "ceremonyEnabled")}
							{this.addDiv("text", "ceremonyMessage", this.state.ceremonyEnabled)}
							{this.addDiv("datetimepicker", "ceremonyDateTime", this.state.ceremonyEnabled, this.state.ceremonyObject, this.handleCeremonyDateChange)}
							{this.addDiv("checkbox", "receptionEnabled")}
							{this.addDiv("text", "receptionMessage", this.state.receptionEnabled)}
							{this.addDiv("datetimepicker", "receptionDateTime", this.state.receptionEnabled, this.state.receptionObject, this.handleReceptionDateChange)}

							{buttons}
							<div className="btn-group">
								<button className="btn btn-danger" onClick={this.handleRemove} >Remove</button>
							</div>
						</form>
					</div>
				</div>
				<div className="panel panel-default">
					<div className="panel-heading">All Available Themes (<i>{allThemesLength}</i>)<br />
						<code>GET {apiPath('GET', 'theme', null, false)}</code>
					</div>
					<div className="panel-body">
						Update Account({this.props.accountId}) to use a pre-existing theme:<p />
						{themeList}
					</div>
				</div>
				{createTheme}
				{themePreview}
			</>
		);
	}
}