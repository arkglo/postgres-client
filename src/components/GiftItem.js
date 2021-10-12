import React, { useState, useEffect, useCallback } from 'react'
import { ProgressBar } from 'react-bootstrap'

const GiftItem = (props) => {
	const [gift, setGift] = useState(props.gift)
	const [theme, setTheme] = useState(props.theme)

	useEffect(() => { setGift(props.gift) }, [props.gift ])
	useEffect(() => { setTheme(props.theme) }, [props.theme ])

	const font = {
		fontFamily: theme.font,
		color: theme.colour1,

	}

	const sizeFactor = 1.2

	const h1Overide = {
		...font,
		fontSize: (1.2 * sizeFactor) + 'em',
		textAlign: 'left',
		fontWeight: 'bold'
	}

	const h2Overide = {
		...font,
		fontSize: (0.9 * sizeFactor) + 'em',
		textAlign: 'left',
		fontWeight: 'lighter',
		fontStyle: 'italic',
	}

	const styleGroup = {
		...font,
		filter: 'brightness(150%)',
		fontSize: (0.8 * sizeFactor) + 'em',
		textAlign: 'left',
		fontWeight: 'lighter',
	}

	const stylePrice = {
		...font,
		fontSize: (1 * sizeFactor) + 'em',
	}

	const messageOveride = {
		...font,
		fontSize: (1 * sizeFactor) + 'em',
		width: '100%',
	}

	let ctext = ''
	let pbar = ''
	if (gift.group) {
		pbar = <ProgressBar style={{ height: '10px', marginBottom: 'unset' }} animated={true} now={parseFloat(gift.paid) / parseFloat(gift.price) * 100} />
		ctext = <div style={styleGroup}>Group Gift: ${parseFloat(gift?.paid ?? 0).toFixed(2)} gifted</div>
	}
	const imageBorder = '1px solid ' + theme.colour1
	console.log(`ABC render: ${gift.group}`);

	return (
		<div>
			<h4 className='text-primary'> Gift Preview:</h4>
			<div className="panel-body" style={{ margin: 'auto', width: '33%', border: '1px solid #6c757d', borderRadius: '20px', backgroundColor: theme.colour2 }}>
				<img style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain', display: 'block', margin: 'auto', border: imageBorder }} src={gift?.image} alt='Gifts URL' />
				<table style={{ width: '100%' }}>
					<tbody>
						<tr>
							<td>
								<h1 style={h1Overide}>{gift.title}</h1>
								<div style={h2Overide}>{gift.type}</div>
								<div style={h2Overide}>From: {gift.from}</div>
							</td>
							<td>
								<div style={stylePrice}>${parseFloat(gift.price).toFixed(2)}</div>
							</td>
						</tr>
					</tbody>
				</table>
				<span style={messageOveride}>{gift.message}</span><br />
				{pbar}
				{ctext}
			</div>
		</div>
	)
}

export default GiftItem