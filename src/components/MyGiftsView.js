// For editing one user's details. Can edit password as well.
import React, { Component } from 'react';
import axios from 'axios';
import * as config from '../config/config';
import { apiPath } from '../lib/apiPath'
import styles from '../css/mystyles.module.css'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Error from './error';

export default class MyGiftsView extends Component {
	constructor(props) {
		super(props);
		console.log(`MyGiftsView.constructor()`)
		this.state = {
			"id": 1,
			"title": '',
			"message": '',
			"imageUrl": '', // https://www.newzealand.com/assets/Tourism-NZ/Christchurch-Canterbury/8bb86abcfd/img-1536307813-4242-957-p-C4D67668-0642-F5C5-BC3A684C8BB1F331-2544003__aWxvdmVrZWxseQo_FocalPointCropWzI0MCw0ODAsNTAsNTMsNzUsImpwZyIsNjUsMi41XQ.jpg
			myGifts: null,
			theme: null,
			"font": '',
			"colour1": '',
			"colour2": '',
		};

		// console.log("Props:")
		// console.log(props)
		this.handleCreate = this.handleCreate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount() {
		console.log(`MyGiftsView.componentDidMount(${this.props.myGiftsId})`)
		this.getMyGifts()
		this.getThemes()
	}

	getMyGifts() {
		console.log(`MyGiftsView.getMyGifts(${this.props.myGiftsId})`)
		if(this.props.myGiftsId === null) {
			console.log("  No myGifts - skip GET - ste Default test data")

			//Set test data
			this.setState({
				title: 'OurGift Registry',
				message: 'We’re just happy to share this special moment with you all, but if you’d like to give us a gift please check out our registry below.',
				imageUrl: 'https://www.telegraph.co.uk/content/dam/Travel/2019/September/nz.jpg'
			})
			return
		}

		//Get this myGifts
		axios.get(apiPath('GET','myGifts', this.props.myGiftsId)).then((response) => {

			if (response.status !== 200) {
				return console.warn('Failed to get myGifts details.');
			}

			const myGifts = response.data.data
			this.setState({
				id: myGifts.id,
				title: myGifts.title,
				message: myGifts.message,
				imageUrl: myGifts.imageUrl
			})
			this.setState({ myGifts: myGifts })
			if (config.debugLevel > 1) console.log(myGifts)
		}).catch((error) => {
			Error.message(error.response)
		});
	}

	
	getThemes() {
		console.log(`MyGiftsView.getThemes(${this.props.themeId})`)

		//Get this Theme
		axios.get(apiPath('GET','theme', this.props.themeId)).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get theme details.');
			}

			const theme = response.data.data
			this.setState({ 
				theme: theme,
				font: theme?.font ?? null,
				colour1: theme?.colour1 ?? "#000000",
				colour2: theme?.colour2 ?? "#00ff00",
			})
			

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
		const oldMyGifts = this.state.myGifts
		var req = {}
		this.check("title", req, oldMyGifts)
		this.check("message", req, oldMyGifts)
		this.check("imageUrl", req, oldMyGifts)

		req.id = this.state.id

		return req
	}// createChangeReqObject

	handleCreate(event) {
		event.preventDefault();  // IMPORTANT.
		console.log("------------------- handleCreate()")
		const req = this.createChangeReqObject()
		req.accountID = this.props.accountId

		const count = Object.keys(req).length;
		if (config.debugLevel > 1) {
			console.log('Call myGifts POST')
			console.log(`Number to update: ${count}`)
			console.log(req)
		}

		if (count <= 1) {
			console.warn("Nothing to post, bail")
			return;
		}

		axios.post(apiPath('POST','myGifts'), req).then((response) => {
			if (response.status !== 201) {
				return console.warn('Failed to create myGifts.');
			}
			console.log('Created a new myGifts');
		}).catch((error) => {
			console.log(error)
			Error.message(error.response)
		});
	}// handleCreate

	handleSubmit(event) {
		event.preventDefault();  // IMPORTANT.
		console.log("------------------- handleSubmit()")

		if (this.props.myGiftsId == null) {
			console.log("No myGifts to Update");
			return;
		}

		const req = this.createChangeReqObject()

		const count = Object.keys(req).length;
		if (config.debugLevel > 1) {
			console.log('Call myGifts UPDATE')
			console.log(`Number to update: ${count}`)
			console.log(req)
		}

		if (count <= 1) {
			console.warn("Nothing to update, skip calling api")
			return;
		}

		axios.put(apiPath('PUT','myGifts', this.props.myGiftsId), req).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to update myGifts.');
			}
			console.log('Updated myGifts details!');
		}).catch((error) => {
			Error.message(error.response)
		});
	}// handleSubmit

	handleRemove(event, myGiftsId) {
		event.preventDefault();
		console.log("------------------- handleRemove()")
		confirmAlert({
			title: 'Confirm',
			message: 'Are you VERY sure you want to delete the myGifts?',
			buttons: [
				{
					label: "Yes",
					onClick: () => {
						axios.delete(apiPath('DELETE','myGifts', this.props.myGiftsId)).then((response) => {
							if (response.status !== 200) {
								return console.warn('Failed to remove myGifts.');
							}
							console.log('Successfully deleted myGifts.');
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


	createMyGift(myGifts) {
		console.log("MyGiftsView.createMyGift()")

		axios.post(apiPath('POST','myGifts'), myGifts).then((response) => {
			if (response.status !== 201) {
				return console.warn('Failed to create myGifts.');
			}
			console.log(`Created account [${myGifts.title}]!`)
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
	handleCreateMyGifts(event) {
		event.preventDefault();  // IMPORTANT.
		console.log(`handleCreateMyGifts: ${event.target.id}`)
		// console.log(event)
		let thisMyGifts = {}
		switch (event.target.id) {
			case 'TestMyGifts-1':
				thisMyGifts = {
					accountID: this.props.accountId,
					title: "title1",
					message: "message1",
					imageUrl: "test_image.jpg"
				}
				break;
			default:
				console.log("Unknown");
				return;
		}

		this.createMyGift(thisMyGifts)
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
		console.log(`%cMyGiftsView - render(myGiftsId ${this.props.myGiftsId})`, 'color: yellow')

		var buttons
		if (this.props.myGiftsId == null) {
			buttons = <div className="btn-group">
				<button className="btn btn-success" onClick={this.handleCreate} >Create</button>
			</div>
		}
		else {
			buttons = <div className="btn-group">
				<button className="btn btn-primary" onClick={this.handleSubmit} >Update</button>
			</div>
		}

		const h1Overide = {
			fontFamily: this.state.font,
			color: this.state.colour1,
			backgroundColor: this.state.colour2,
			fontSize: '2em',
			textAlign: 'center'
		}

		const messageOveride = {
			fontFamily: this.state.font,
			color: this.state.colour1,
			fontSize: '1.5em',
			
		}

		//Now render
		return (
			<>
				<div className="panel panel-default">
					<div className="panel-heading">MyGifts Edit (<i>myGiftsID: {this.props.myGiftsId}</i>)<br />
						<div className={styles.blue}>The MyGifts's View provides the Gifts Introduction as defined by the User and demonstrates the active theme</div><p/>
						<code>GET {apiPath('GET', 'myGifts', this.props.myGiftsId, false)}</code> {'<'} <i>myGiftsId</i><br/>
						<code>GET {apiPath('GET', '/accounts/myGifts', this.props.accountId, false)}</code> {'<'} <i>accountId</i> - suggested option<br/>
					</div>
					<div className="panel-body">

						<form className="form">
							{this.addDiv("text", "title")}
							{this.addDiv("text", "message")}
							{this.addDiv("text", "imageUrl")}

							{buttons}
							<div className="btn-group">
								<button className="btn btn-danger" onClick={this.handleRemove} >Remove</button>
							</div>
						</form>
					</div>
					<div className="panel-body"  style={{border:'1px solid #6c757d', borderRadius: '20px', margin:'10px 50px'}}>
						<img style={{width: '100%', maxHeight: '100px', objectFit: 'cover'}} src={this.state.imageUrl} alt='myGifts URL'/> 
						<h1 style={h1Overide}>{this.state.title}</h1>
						<span style={messageOveride}>{this.state.message}</span><br/>
					</div>
				</div>
			</>
		);
	}
}