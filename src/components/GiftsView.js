// For editing one user's details. Can edit password as well.
import React, { Component } from 'react';
import { Button, ButtonGroup, ProgressBar } from 'react-bootstrap'
import axios from 'axios';
import * as config from '../config/config';
import { apiPath } from '../lib/apiPath'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Error from './error';
import styles from '../css/mystyles.module.css'

export default class GiftsView extends Component {
	constructor(props) {
		super(props);
		console.log(`GiftsView.constructor()`)
		this.state = {
			"id": 1,
			"title": '',
			"message": '',
			"imageUrl": '', // https://www.newzealand.com/assets/Tourism-NZ/Christchurch-Canterbury/8bb86abcfd/img-1536307813-4242-957-p-C4D67668-0642-F5C5-BC3A684C8BB1F331-2544003__aWxvdmVrZWxseQo_FocalPointCropWzI0MCw0ODAsNTAsNTMsNzUsImpwZyIsNjUsMi41XQ.jpg
			theme: null,
			gift: null, 				// currently selected gift
			gifts: null, 				// all the gifts of the current Account
			publicGifts: null,	// all available public gifts 
			"font": '',
			"colour1": '',
			"colour2": '',
			type: null,
		}

		// console.log("Props:")
		// console.log(props)
		this.handleCreate = this.handleCreate.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleRemove = this.handleRemove.bind(this)
	}

	componentDidMount() {
		console.log(`GiftsView.componentDidMount(${this.props.myGiftsId})`)
		this.getGifts()
		this.getPublicGifts()
		this.getThemes()
	}

	getGifts() {
		console.log(`GiftsView.getGifts(${this.props.accountId})`)
		if (this.props.accountId === null) {
			console.log("  accountId now set - skip GET")

			//Set test data
			this.setState({
				gifts: null,
			})
			return
		}

		//Get this myGifts
		axios.get(apiPath('GET', '/accounts/gifts', this.props.accountId+'?details=true')).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get Account.gifts details.')
			}

			this.setState({ gifts: response.data })
			if (config.debugLevel > 1) console.log(response.data)
		}).catch((error) => {
			Error.message(error.response)
		})
	}

	getPublicGifts() {
		console.log(`GiftsView.getPublicGifts()`)

		//Get this myGifts
		axios.get(apiPath('GET', 'giftDS', '?access=public')).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get gifts details.')
			}

			this.setState({ publicGifts: response.data })
			if (config.debugLevel > 1) console.log(response.data)
		}).catch((error) => {
			Error.message(error.response)
		})
	}

	getThemes() {
		console.log(`GiftsView.getThemes(${this.props.themeId})`)

		//Get this Theme
		axios.get(apiPath('GET', 'theme', this.props.themeId)).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get theme details.')
			}

			const theme = response.data
			this.setState({
				theme: theme,
				font: theme?.font ?? null,
				colour1: theme?.colour1 ?? "#000000",
				colour2: theme?.colour2 ?? "#00ff00",
			})


			if (config.debugLevel > 1) console.log(theme)
		}).catch((error) => {
			Error.message(error.response)
		})
	}

	handleChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.type === 'color' ? target.name.split('-')[1] : target.name;
		// console.log("Change: " + name + ", new Value: " + value)
		let gift = this.state.gift
		gift[name] = value
		this.setState({
			gift: gift
		})
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

	selectGift(gift) {
		if (config.debugLevel > 1) console.log(`GiftsView.selectGift: ${gift}`)
		this.setState({ gift: gift })
	}

	setGiftid = (id) => {
		console.log(`------------------- handleGiftSelection(${id})`)
		this.selectGift(this.state.gifts.find(element => element.id === id))
	}


	setPublicGiftid = (id) => {
		console.log(`------------------- setPublicGiftid(${id})`)
		this.selectGift(this.state.publicGifts.find(element => element.id === id))
	}

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

		axios.post(apiPath('POST', 'myGifts'), req).then((response) => {
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

		axios.put(apiPath('PUT', 'myGifts', this.props.myGiftsId), req).then((response) => {
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
						axios.delete(apiPath('DELETE', 'myGifts', this.props.myGiftsId)).then((response) => {
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

		axios.post(apiPath('POST', 'myGifts'), myGifts).then((response) => {
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
		let thisValue = null
		if (this.state.gift && this.state.gift[field]) thisValue = this.state.gift[field]

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
				typeField = <input style={{ width: '92%', display: 'inline-block' }} className="form-control" type={divType} name={field} value={thisValue} disabled={disabledState} onChange={this.handleChange} />
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
			<div style={{ marginBottom: '2px' }} className="form-group">
				<label style={{display: 'inline-block', width: '8%'}}>{this.capitalize(field)}</label>
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

		// backgroundColor: this.state.colour2,
		const font = {
			fontFamily: this.state.font,
			color: this.state.colour1,

		}
		const h1Overide = {
			...font,
			fontSize: '1.2em',
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

		const styleGroup = {
			...font,
			filter: 'brightness(150%)',
			fontSize: '0.8em',
			textAlign: 'left',
			fontWeight: 'lighter',
		}

		const stylePrice = {
			...font,
			fontSize: '1em',
		}

		const messageOveride = {
			...font,
			fontSize: '1em',
			width: '100%',
		}

		const darkerButton = {
			margin: '2px 0px',
			border: '1px solid #a0a0a0a0',
			padding: '2px 12px',
		}

		let renderGiftsData = ''
		const gifts = this.state.gifts
		let giftsCount = 'No Gifts'
		if (gifts) {
			renderGiftsData = gifts.map((data, idx) =>
				<li key={idx}><Button style={darkerButton} variant='secondary' onClick={this.setGiftid.bind(this, data.id)}> {data.title}</Button> - [{data.id}]:{data.access}</li>
			)
			giftsCount = <><b>{gifts.length}</b> gifts</>
		}


		let renderPublicGiftsData = ''
		const publicGifts = this.state.publicGifts
		let publicGiftCount = 'No Public Gifts'
		if (publicGifts) {
			renderPublicGiftsData = publicGifts.map((data, idx) =>
				<li key={idx}><Button style={darkerButton} variant='secondary' onClick={this.setPublicGiftid.bind(this, data.id)}> {data.title}</Button> - [{data.id}]</li>
			)
			publicGiftCount = <><b>{publicGifts.length}</b> public gifts</>
		}

		const giftOptions = <ButtonGroup aria-label='Gift options'>
			<Button style={styles.darkerButton} variant='secondary' title='access' value='all' onClick={this.handleAccessClick}>All</Button>
			<Button style={styles.darkerButton} variant='secondary' title='access' value='public' onClick={this.handleAccessClick}>Public</Button>
			<Button style={styles.darkerButton} variant='secondary' title='access' value='private' onClick={this.handleAccessClick}>Private</Button>
		</ButtonGroup>

		const gift = this.state.gift
		let giftView = ''
		if (gift) {
			console.log(gift)
			let ctext = ''
			let pbar = ''
			if(gift.group) {
				pbar = <ProgressBar style={{ height: '10px', marginBottom: 'unset' }} animated={true} now={gift.paid / gift.price * 100} />
				ctext = <div style={styleGroup}>Group Gift: ${gift.paid.toFixed()} gifted</div>
			}

			giftView = <div className="panel-body" style={{ margin:'auto', width: '33%', border: '1px solid #6c757d', borderRadius: '20px' }}>
				<img style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain', display: 'block', margin: 'auto' }} src={this.state?.gift?.image} alt='Gifts URL' />
				<table style={{ width: '100%' }}>
					<tbody>
						<tr>
							<td>
								<h1 style={h1Overide}>{gift.title}</h1>
								<div style={h2Overide}>{gift.type}</div>
								<div style={h2Overide}>From: {gift.from}</div>
							</td>
							<td>
								<div style={stylePrice}>${gift.price.toFixed(2)}</div>
							</td>
						</tr>
					</tbody>
				</table>
				<span style={messageOveride}>{gift.message}</span><br />
				{pbar}
				{ctext}
			</div>
		}

		//Now render
		return (
			<>
				<div className="panel panel-default">
					<div className="panel-heading">MyGifts Edit (<i>myGiftsID: {this.props.myGiftsId}</i>)<p />
						<code>GET {apiPath('GET', '/accounts/gifts', this.props.accountId, false)}</code> {'<'} <i>accountId</i><br />
						Gifts assigned to Account ({this.props.accountId}): {giftsCount}
						<ul>
							{renderGiftsData}
						</ul><p />
						<code>GET {apiPath('GET', '/giftDataStore', '?access=public', false)}</code><br />
						Available Public Gifts: {publicGiftCount}
						<ul>
							{renderPublicGiftsData}
						</ul>
					</div>
					<div className="panel-body">

						<form className="form">
							{this.addDiv("text", "type")}
							{this.addDiv("text", "status")}
							{this.addDiv("text", "title")}
							{this.addDiv("text", "from")}
							{this.addDiv("text", "message")}
							{this.addDiv("text", "image")}
							{this.addDiv("text", "price")}
							{this.addDiv("text", "paid")}
							{this.addDiv("text", "notes")}
							<table style={{width:'100%'}}>
								<tbody>
									<tr>
										<td style={{width: '20%'}}>{this.addDiv("checkbox", "access")}</td>
										<td style={{width: '20%'}}>{this.addDiv("checkbox", "group")}</td>
										<td style={{width: '20%'}}>{this.addDiv("checkbox", "main")}</td>
										<td style={{width: '20%'}}>{this.addDiv("checkbox", "openContributions")}</td>
									</tr>
								</tbody>
							</table>
							<p/>
							{buttons}
							<div className="btn-group">
								<button className="btn btn-danger" onClick={this.handleRemove} >Remove</button>
							</div>
						</form>
					</div>
					{giftView}
				</div>
			</>
		);
	}
}