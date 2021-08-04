// For editing one user's details. Can edit password as well.
import React, { Component } from 'react';
import { Button, ProgressBar, Dropdown, DropdownButton } from 'react-bootstrap'
import axios from 'axios';
import * as config from '../config/config';
import { apiPath } from '../lib/apiPath'
import styles from '../css/mystyles.module.css'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Error from './error';

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
			oldGift: null, 			// currently selected gift
			gifts: null, 				// all the gifts of the current Account
			publicGifts: null,	// all available public gifts 
			"font": '',
			"colour1": '',
			"colour2": '',
			type: null,
			createDS: false,
		}

		// console.log("Props:")
		// console.log(props)
		//Gifts
		this.handleChange = this.handleChange.bind(this)

		this.handleNew = this.handleNew.bind(this)
		this.handleCreate = this.handleCreate.bind(this)

		//GiftDataStore
		this.handleNewGDS = this.handleNewGDS.bind(this)
		this.handleCreateGDS = this.handleCreateGDS.bind(this)
		this.handleSubmitGDS = this.handleSubmitGDS.bind(this)
		this.handleRemoveGDS = this.handleRemoveGDS.bind(this)

		this.handleDropDownClick = this.handleDropDownClick.bind(this)
	}

	componentDidMount() {
		console.log(`GiftsView.componentDidMount(${this.props.myGiftsId})`)
		this.refreshContent()
		this.getThemes()
	}

	//--------------------------------------
	refreshContent() {
		this.getPrivateGifts()
		this.getPublicGifts()
	}

	getPrivateGifts() {
		console.log(`GiftsView.getPrivateGifts(${this.props.accountId})`)
		if (this.props.accountId === null) {
			console.log("  accountId not set - skip GET")

			//Set test data
			this.setState({
				gifts: null,
			})
			return
		}

		//Get this myGifts
		axios.get(apiPath('GET', '/accounts/gifts', this.props.accountId + '?details=true&access=private')).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to get Account.gifts details.')
			}

			this.setState({ gifts: response.data })
			if (config.debugLevel > 1) {
				console.log('getPrivateGifts =>')
				console.log(response.data)
			}

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
			if (config.debugLevel > 1) {
				console.log('getPublicGifts =>')
				console.log(response.data)
			}
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

	handleDropDownClick(value, event) {
		event.preventDefault();  // IMPORTANT.
		console.log(`GiftsView.handleDropDownClick()`)
		// console.log(event.target)

		const field = event.target.name
		// console.log(`  field: ${field}`)
		// console.log(`  value: ${value}`)

		let gift = { ...this.state.gift }
		if (field === 'status')
			gift.status = value
		else if (field === 'type')
			gift.giftDataStore.type = value

		this.setState({ gift: gift })
		// console.log('AFTER')
		// console.log(this.state.gift)
	}

	handleChange(event) {
		const target = event.target
		if (target.type !== 'checkbox') event.preventDefault()  // IMPORTANT.

		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.type === 'color' ? target.name.split('-')[1] : target.name;
		console.log("Change: " + name + ", new Value: " + value)

		if (this.state.gift === null) {
			this.handleNewGDS()
			return
		}

		let gift = this.state.gift
		switch (name) {
			case 'access': gift.giftDataStore[name] = value ? 'public' : 'private'
				break
			case 'type':
			case 'title':
			case 'from':
			case 'message':
			case 'image':
				gift.giftDataStore[name] = value
				break
			case 'price':
				gift.giftDataStore[name] = (typeof (value) === 'string') ? parseInt(value) : value
				break
			default:
				gift[name] = value
				break
		}

		this.setState({ gift: gift })
	}

	check(key, req, object, dataStore = false) {
		const value = object[key];
		let length = typeof (value) === 'string' ? value.length : 1
		const oldObject = dataStore ? this.state.oldGift?.giftDataStore : this.state.oldGift
		//const previous = oldData == null ? "null" : oldData[key]
		console.log(`check: ${key}, this.state: ${value}, ${typeof (value)}:${length}, oldObject: ${oldObject[key]}`)

		if (length > 0 && (oldObject === null || value !== oldObject[key])) {
			console.log(`check ${key} updated - new value: ${value}`)
			req[key] = value
		}
	}

	createGiftChangeReqObject() {
		// only add new fields if changed and valid
		const gift = this.state.gift
		var req = {}
		this.check("giftID", req, gift)
		this.check("group", req, gift)
		this.check("main", req, gift)
		this.check("openContributions", req, gift)
		this.check("notes", req, gift)
		this.check("paid", req, gift)
		this.check("status", req, gift)

		req.id = gift.id

		return req
	}// createGiftChangeReqObject

	createGiftDSChangeReqObject() {
		// only add new fields if changed and valid
		const giftDS = this.state.gift?.giftDataStore
		var req = {}
		this.check("access", req, giftDS, true)
		this.check("type", req, giftDS, true)
		this.check("title", req, giftDS, true)
		this.check("from", req, giftDS, true)
		this.check("price", req, giftDS, true)
		this.check("image", req, giftDS, true)
		this.check("message", req, giftDS, true)

		req.id = giftDS.id

		return req
	}// createGiftDSChangeReqObject

	createDefaultEmptyGift() {
		return {
			id: -1,
			giftID: -1,
			group: false,
			main: false,
			openContributions: false,
			notes: null,
			paid: 0,
			status: 'available',
			giftDataStore: {
				access: 'public',
				type: 'item',
				id: -1,
				title: null,
				from: null,
				price: 0,
				image: null,
				message: null,
			},
		}
	}

	selectGift(gift) {
		if (config.debugLevel > 1) console.log(`GiftsView.selectGift: ${gift}`)
		// this.setState({ gift: gift, oldGift: { ...gift } }) // spread operator doesn't work for the dub structure giftDataStore, that remains a pointer
		this.setState({ gift: gift, oldGift: JSON.parse(JSON.stringify(gift)) }) // pare/stringify not elegant but it works
	}

	setGiftid = (id) => {
		console.log(`------------------- setGiftid(${id})`)
		this.setState({ createDS: false })
		this.selectGift(this.state.gifts.find(element => element.id === id))
	}

	setPublicGiftid = (id) => {
		console.log(`------------------- setPublicGiftid(${id})`)

		const publicGift = this.state.publicGifts.find(element => element.id === id)
		if (!publicGift) {
			console.log('  ERROR public gift not found')
			return
		}
		//need to create an empty/default gift structure
		const gift = this.createDefaultEmptyGift()
		gift.giftID = publicGift.id
		gift.giftDataStore = publicGift
		this.setState({ createDS: false })
		this.selectGift(gift)
	}


	//===========================================
	handleNewGDS(event) { //Create a GiftDS Entry
		if (event) event.preventDefault();  // IMPORTANT.
		const gift = this.createDefaultEmptyGift()
		this.setState({ createDS: true })
		this.selectGift(gift)
	}

	//-------------------------------------- Create - POST a GiftDataStore Item
	handleCreateGDS(event) { //Create a Gift Entry
		event.preventDefault()  // IMPORTANT.
		console.log("------------------- handleCreateGDS()")

		const giftDS = this.state?.gift?.giftDataStore
		console.log(giftDS)
		if (!(giftDS?.title)) {
			console.log('  Requires a GiftDataStore entry to create')
			return
		}

		const req = this.createGiftDSChangeReqObject()
		req.access = giftDS?.access // ensure these are set
		req.type = giftDS?.type // ensure these are set
		req.accountID = this.props.accountId

		const count = Object.keys(req).length
		if (config.debugLevel > 0) {
			console.log('Call GiftDataStore POST')
			console.log(`Number to update: ${count}`)
			console.log(req)
		}

		if (count <= 1) {
			console.warn("Nothing to post, bail")
			return
		}

		axios.post(apiPath('POST', 'giftDS'), req).then((response) => {
			if (response.status !== 201) {
				return console.warn('Failed to create GiftDataStore Entry.')
			}
			console.log('Created a new GiftDataStore Entry')
			this.refreshContent()
		}).catch((error) => {
			console.log(error)
			Error.message(error.response)
		})
	}// handleCreateGDS


	//-------------------------------------- Submit - UPDATE of GiftDataStore entry
	handleSubmitGDS(event) {
		event.preventDefault();  // IMPORTANT.
		console.log("------------------- handleSubmitGDS()")

		if (!this.state?.gift?.giftDatStore?.id == null) {
			console.log("No GiftDatStore Entry to Update")
			return
		}

		const req = this.createGiftDSChangeReqObject()

		const count = Object.keys(req).length;
		if (config.debugLevel > 1) {
			console.log('Call myGifts UPDATE')
			console.log(`Number to update: ${count}`)
			console.log(req)
		}

		if (count <= 1) {
			console.warn("Nothing to update, skip calling api")
			return
		}

		axios.put(apiPath('PUT', 'giftDS', req.id), req).then((response) => {
			if (response.status !== 200) {
				return console.warn('Failed to update Gift.')
			}
			console.log('Updated Gift details!')
			this.forceUpdate()
		}).catch((error) => {
			Error.message(error.response)
		})
	}// handleSubmitGDS


	handleRemoveGDS(event) {
		event.preventDefault();
		console.log("------------------- handleRemoveGDS()")

		if (!this.state?.gift?.giftDatStore?.id) {
			console.log("No GiftDataStore Entry to Delete")
			return
		}
		const id = this.state.gift.giftDataStore.id

		confirmAlert({
			title: 'Confirm',
			message: `Are you VERY sure you want to delete this giftDataStore(${id}) Entry?`,
			buttons: [
				{
					label: "Yes",
					onClick: () => {
						axios.delete(apiPath('DELETE', 'giftDS', id)).then((response) => {
							if (response.status !== 200) {
								return console.warn('Failed to remove Gift.');
							}
							console.log(`Successfully deleted Gift(${id})`)
							this.refreshContent()
						}).catch((error) => {
							Error.message(error.response)
						})
					}
				},
				{
					label: "No",
				}
			]
		})
	}// handleRemoveGDS


	//===========================================
	handleNew(event) { //Create a Gift Entry
		event.preventDefault();  // IMPORTANT.
		const gift = this.createDefaultEmptyGift()
		this.selectGift(gift)
	}

	//-------------------------------------- Create - POST a Gift
	handleCreate(event) { //Create a Gift Entry
		event.preventDefault()  // IMPORTANT.
		console.log("------------------- handleCreate()")

		const gift = this.state.gift
		// if (!(gift?.id > -1)) {
		// 	console.log('  Requires a valid Gift AND GiftDataStore entry to create')
		// 	console.log(`  invalid gift: ${gift?.id}`)
		// 	return
		// }

		if (!(gift?.giftDataStore?.id > -1)) {
			console.log('  Requires a valid Gift AND GiftDataStore entry to create')
			console.log(`  invalid giftDataStore: ${gift?.giftData?.id}`)
			return
		}

		const req = this.createGiftChangeReqObject()
		req.accountID = this.props.accountId
		req.status = gift.status
		req.giftID = gift.giftDataStore.id

		const count = Object.keys(req).length
		if (config.debugLevel > 0) {
			console.log('Call Gift POST')
			console.log(`Number to update: ${count}`)
			console.log(req)
		}

		if (count <= 1) {
			console.warn("Nothing to post, bail")
			return
		}

		axios.post(apiPath('POST', 'gifts'), req).then((response) => {
			if (response.status !== 201) {
				return console.warn('Failed to create Gift.');
			}
			console.log('Created a new Gift');
		}).catch((error) => {
			console.log(error)
			Error.message(error.response)
		})
	}// handleCreate




	//------------------------------------------------------------
	capitalize = (s) => {
		if (typeof s !== 'string') return s //''
		return s.charAt(0).toUpperCase() + s.slice(1)
	}

	addDiv = (divType, field, state = undefined) => {
		let thisValue = null
		if (this.state.gift) {
			if (this.state.gift[field]) thisValue = this.state.gift[field]
			else if (this.state.gift.giftDataStore && this.state.gift.giftDataStore[field]) thisValue = this.state.gift.giftDataStore[field]
		}

		if (divType === "text" && thisValue === null) thisValue = ""
		// console.log(`  ${divType} ${field}: [${thisValue}]`)

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
			case "dropdown":
				if (field === 'status') {
					typeField = <DropdownButton style={{ display: 'inline-block' }} variant='secondary' title={thisValue ?? 'Status'} id="dropdownStatus" disabled={disabledState} >
						<Dropdown.Item style={{ display: 'block', margin: '2px 5px' }} name="status" onSelect={this.handleDropDownClick} eventKey="available">Available</Dropdown.Item>
						<Dropdown.Item style={{ display: 'block', margin: '2px 5px' }} name="status" onSelect={this.handleDropDownClick} eventKey="partialpaid">Partially Paid</Dropdown.Item>
						<Dropdown.Item style={{ display: 'block', margin: '2px 5px' }} name="status" onSelect={this.handleDropDownClick} eventKey="fullypaid">Fully Paid</Dropdown.Item>
						<Dropdown.Item style={{ display: 'block', margin: '2px 5px' }} name="status" onSelect={this.handleDropDownClick} eventKey="removed">Removed</Dropdown.Item>
					</DropdownButton>
				}
				else if (field === 'type') {
					typeField = <DropdownButton style={{ display: 'inline-block' }} variant='secondary' title={thisValue ?? 'Type'} id="dropdownStatus" disabled={disabledState} >
						<Dropdown.Item style={{ display: 'block', margin: '2px 5px' }} name="type" onSelect={this.handleDropDownClick} eventKey="item">Item</Dropdown.Item>
						<Dropdown.Item style={{ display: 'block', margin: '2px 5px' }} name="type" onSelect={this.handleDropDownClick} eventKey="experience">Experience</Dropdown.Item>
						<Dropdown.Item style={{ display: 'block', margin: '2px 5px' }} name="type" onSelect={this.handleDropDownClick} eventKey="cashfund">Cash Fund</Dropdown.Item>
						<Dropdown.Item style={{ display: 'block', margin: '2px 5px' }} name="type" onSelect={this.handleDropDownClick} eventKey="charity">Charity</Dropdown.Item>
					</DropdownButton>
				}
				break
			default:
				typeField = <input className="form-control" type={divType} name={field} value={thisValue} disabled={disabledState} onChange={this.handleChange} />
				break
		}

		//console.log(typeField)
		return (
			<div style={{ marginBottom: '2px' }} className="form-group">
				<label style={{ display: 'inline-block', width: '8%' }}>{this.capitalize(field)}</label>
				{typeField}
			</div>
		)
	}

	//=================================================================
	render() {
		console.log(`%cGiftsView - render(myGiftsId ${this.props.myGiftsId})`, 'color: yellow')
		const gift = this.state.gift
		console.log(gift)

		const admin = this.props.admin ?? false
		const allowToUpdate = admin || this.gifts?.giftDataStore?.access === 'private'
		// console.log(`  admin: ${admin}`)
		// console.log(`  allowToUpdate: ${allowToUpdate}`)
		// console.log(`  createDS: ${this.state.createDS}`)
		const giftDSButtons = <div className="btn-group">
			<button className="btn btn-success" onClick={this.handleNewGDS} >New</button>
			<button className="btn btn-success" onClick={this.handleCreateGDS} disabled={!this.state.createDS}>Create</button>
			<button className="btn btn-primary" onClick={this.handleSubmitGDS} disabled={!allowToUpdate || this.state.createDS}>Update</button>
			<button className="btn btn-danger" onClick={this.handleRemoveGDS} disabled={!allowToUpdate}>Remove</button>
		</div>

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

		const gifts = this.state.gifts
		let renderGiftsData = ''
		let giftsCount = 'No Gifts'
		if (gifts) {
			renderGiftsData = gifts.map((data, idx) =>
				<li key={idx}><Button style={darkerButton} variant='secondary' onClick={this.setGiftid.bind(this, data.id)}> {data.giftDataStore.title}</Button> - [gift.id:{data.id}, giftDataStore.id{data.giftDataStore.id}]</li>
			)
			giftsCount = <><b>{gifts.length}</b> gifts</>
		}

		let renderPublicGiftsData = ''
		const publicGifts = this.state.publicGifts
		let publicGiftCount = 'No Public Gifts'
		if (publicGifts) {
			renderPublicGiftsData = publicGifts.map((data, idx) =>
				<li key={idx}><Button style={darkerButton} variant='secondary' onClick={this.setPublicGiftid.bind(this, data.id)}> {data.title}</Button> - [giftDataStore.id{data.id}]</li>
			)
			publicGiftCount = <><b>{publicGifts.length}</b> public gifts</>
		}

		const AccessText = gift?.giftDataStore?.access === 'public' ? '- This item is public item (pre-defined item) user cannot update the item details' :
			gift?.giftDataStore?.access === 'private' ? '- This item is private item (user created) user can update the item details' : ''

		let giftView = ''
		if (gift) {
			let ctext = ''
			let pbar = ''
			if (gift.group) {
				pbar = <ProgressBar style={{ height: '10px', marginBottom: 'unset' }} animated={true} now={gift.paid / gift.giftDataStore.price * 100} />
				ctext = <div style={styleGroup}>Group Gift: ${gift.paid.toFixed()} gifted</div>
			}

			giftView = <div>
				<h4 className='text-primary'> Gift Preview:</h4><div className="panel-body" style={{ margin: 'auto', width: '33%', border: '1px solid #6c757d', borderRadius: '20px' }}>
					<img style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain', display: 'block', margin: 'auto' }} src={this.state?.gift?.giftDataStore?.image} alt='Gifts URL' />
					<table style={{ width: '100%' }}>
						<tbody>
							<tr>
								<td>
									<h1 style={h1Overide}>{gift.giftDataStore.title}</h1>
									<div style={h2Overide}>{gift.giftDataStore.type}</div>
									<div style={h2Overide}>From: {gift.giftDataStore.from}</div>
								</td>
								<td>
									<div style={stylePrice}>${gift.giftDataStore.price.toFixed(2)}</div>
								</td>
							</tr>
						</tbody>
					</table>
					<span style={messageOveride}>{gift.giftDataStore.message}</span><br />
					{pbar}
					{ctext}
				</div>
			</div>
		}

		//Now render
		return (
			<>
				<div className="panel panel-default">
					<div className="panel-heading"><h4 className='text-primary'>Gifts Available</h4> (<i>giftDataStore</i>)<p />
						<div className={styles.blue}>The Gifts Availble View provides access to the aviailable gifts</div><p />
						These are the <b>Private</b> Gifts associated with this account:<br />
						<code>GET {apiPath('GET', '/accounts/gifts', this.props.accountId + '?details=true&access=private', false)}</code> {'<'} <i>accountId</i><br />
						Gifts assigned to Account ({this.props.accountId}): {giftsCount}
						<ul>
							{renderGiftsData}
						</ul><p />
						These are the <b>Public</b> available gifts<br />
						<code>GET {apiPath('GET', '/giftDataStore', '?access=public', false)}</code><br />
						Available Public Gifts: {publicGiftCount}
						<ul>
							{renderPublicGiftsData}
						</ul>
					</div>
					<div className="panel-body">


						<form className="form">
							<h4 className='text-primary'>GiftDataStore</h4>
							<div>giftDataStore ID: {gift?.giftDataStore?.id}</div>
							<div style={{ marginBottom: '2px' }} className="form-group">
								<label style={{ display: 'inline-block', width: '8%' }}>Access</label>
								<input style={{ display: 'inline-block', width: '34px', verticalAlign: 'middle' }} className="form-control" type='checkbox' name='access' checked={gift?.giftDataStore?.access === 'public'} onChange={this.handleChange} disabled={!admin} />{' '}
								<div style={{ display: 'inline-block' }}>{gift?.giftDataStore?.access ?? 'Not Set'} <i>{AccessText}</i></div>
							</div>
							{this.addDiv("dropdown", "type", allowToUpdate)}
							{this.addDiv("text", "title", allowToUpdate)}
							{this.addDiv("text", "from", allowToUpdate)}
							{this.addDiv("text", "message", allowToUpdate)}
							{this.addDiv("text", "image", allowToUpdate)}
							{this.addDiv("text", "price", allowToUpdate)}
							{giftDSButtons}

						</form>
					</div>
					{giftView}
				</div>
			</>
		);
	}
}