import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

class DrawLineGraph extends Component {

	formatXAxis = (tick) => {
		let options = { hour12: false };
		return new Date(tick).toLocaleString('fi-FI', options);
	};

	render() {
		const { values } = this.props;

		return (
			<div>
			<h3>Graph</h3>
			<LineChart width={800} height={300} data={values} 
				margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
    			<Line type="monotone" dataKey="value" stroke="#8884d8" 
    				dot={false} activeDot={false} />
    			<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    			<XAxis dataKey="createdAt" tickFormatter={this.formatXAxis} />
    			<YAxis unit={values[0].unit}/>
    			<Tooltip labelFormatter={this.formatXAxis} />
  			</LineChart>
			</div>
		)
	}
};

DrawLineGraph.propTypes = {
	values: PropTypes.instanceOf(Array).isRequired
};

export default DrawLineGraph;