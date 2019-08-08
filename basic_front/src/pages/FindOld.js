import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import fi from 'date-fns/locale/fi';
import api from '../api';
import InlineError from '../scripts/InlineError';
import DrawLineGraph from '../scripts/DrawLineGraph';

import "react-datepicker/dist/react-datepicker.css";
registerLocale('fi', fi);
setDefaultLocale('fi');

// Error checking
export const ValidateForm = ( data ) => {
	const errors = {};
	if(!data.device) errors.device = "Laite on pakollinen tieto";
	if(data.startDate.getTime() > data.endDate.getTime()) errors.date 
		= "Alkupäivän on oltava ennen loppumispäivämäärää";
	return errors;
}

class FindOld extends Component {
	state = {
		devices: [],
		values: [],
		data: {
			device: "",
			startDate: new Date(),
			endDate: new Date()
		},
		errors: {}
	}

	componentDidMount = () => this.onInit();

	onInit = () => {
		api.iotdata.getDevices()
			.then(devices => this.setState(devices))
	};

	onSubmit = (e) => {
		e.preventDefault();
		const { data } = this.state;
		const errors = ValidateForm(data);
		this.setState( { errors });
		if (Object.keys(errors).length === 0){
			api.iotdata.getValues(data)
				.then(values => this.setState(values))
		};
	};

	handleChange = e => {
		const { data } = this.state;
		this.setState({ 
			data: {...data, device: e.target.value }
		});
	};

	handleStartDateChange = date => {
		const { data } = this.state;
		this.setState({
			data: {...data, startDate: date }
		});
	};

	handleEndDateChange = date => {
		const { data } = this.state;
		this.setState({
			data: {...data, endDate: date }
		});
	};

	render() {
		const { devices, data, errors, values } = this.state;

		return (
			<div><h3>Vanhojen haku</h3><br /><br />
				<form onSubmit={this.onSubmit}>

				Valitse laite: <br />
					<select value={data.device} onChange={this.handleChange}>
						<option key="1" value="" />
						{devices && devices.map(val => (
							<option key={val} value={val}>{val}</option>
						))}
					</select>
					<br />
					{ errors.device && <InlineError text={ errors.device } /> }
					<br />

				Valitse päivämäärät: <br />
				<DatePicker 
					showTimeSelect
					timeFormat="HH:mm:ss"
					timeCaption="time"
					dateFormat="dd.MM.yyyy HH:mm:ss"
					selected={ data.startDate }
					selectsStart
					startDate={ data.startDate }
					endDate={ data.endDate }
					onChange={ this.handleStartDateChange }
				/>
				<DatePicker
					showTimeSelect
					timeFormat="HH:mm:ss"
					timeCaption="time"
					dateFormat="dd.MM.yyyy HH:mm:ss"
					selected={ data.endDate }
					selectsEnd
					startDate={ data.startDate }
					endDate={ data.endDate }
					onChange={ this.handleEndDateChange }
					minDate={ data.startDate }
				/><br />
				{ errors.date && <InlineError text={ errors.date } /> }
				<br />

				<input type="submit" value="Hae" /><br />
				</form>
				{ values.length!==0 && <DrawLineGraph values={ values } />}
				<br /><Link to="/">Takaisin viesteihin</Link>
			</div>
		);
	}

}

export default FindOld;