import axios from 'axios';

const serv = process.env.REACT_APP_DBSERVER;

export default {
	iotdata: {
		getDevices: () =>
			axios.post(serv+'/api/iotdata/device').then(res => res.data),
		getValues: (data) => 
			axios.post(serv+'/api/iotdata/find', { data }).then(res => res.data),
		getMeasurements: (device) => 
			axios.post(serv+'/api/iotdata/measure', {device}).then(res => res.data)
	}
}