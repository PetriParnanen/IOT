import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
//import { scaleTime } from 'd3-scale';
//import { timeHour } from 'd3-time';

/*const getTicks = (data) => {
	if (!data || !data.length ) {return [];}
  
  	const domain = [new Date(data[0].time), new Date(data[data.length - 1].time)];
	const scale = scaleTime().domain(domain).range([0, 100]);
  	const ticks = scale.ticks(10);
  
  	return ticks.map(entry => +entry);
};*/

/*const getTicksData = (data, ticks) => {
	if (!data || !data.length ) {return [];}
  	const dataMap = new Map(data.map((i) => [i.time, i]));
  	ticks.forEach(function (item, index, array) {
  		if(!dataMap.has(item)) {
    		data.push({time: item});
    	}
	});
  	return data;
};*/

class DrawLineGraph extends Component {

	formatXAxis = (tick) => {
		let options = { hour12: false };
		return new Date(tick).toLocaleString('fi-FI', options);
	};

	render() {
		const { values } = this.props;
		//const domain = [new Date(values[0].time), new Date(values[values.length - 1].time)];

		//const ticksArr = getTicks(values);
    	//const completeData = getTicksData(values, ticksArr);

		return (
			<div>
			<h3>Graph</h3>
			<LineChart width={800} height={300} data={values} 
				margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
    			<Line type="monotone" dataKey="value" stroke="#8884d8" 
    				dot={false} activeDot={false} />
    			<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    			<XAxis dataKey="time" tickFormatter={this.formatXAxis} 
    				/>
    			<YAxis unit={values[0].unit} />
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