const express = require('express');
const mqtt = require('mqtt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const iotData = require('./src/models/Iotdata');
const message = require('./src/routes/iotdata');

//Just for sending data to front

dotenv.config();
const app = express();
const port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

// ----------------------------------------------
// MONGO CONNECTION
const mongoOptions = {
  "useNewUrlParser": true
};

mongoose.connect(process.env.MONGODB_URL, mongoOptions);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));

// ----------------------------------------------
// ROUTING REQUESTS
app.use('/api/iotdata', message);

//Any other request respond 404
app.get('*', (req,res) => {
	res.status(404).json({ error: "unknown page"})
});

// -----------------------------------------------
//MQTT connection to get data
const client = mqtt.connect(process.env.MQTT_HOST);
let i = 0;

function pub_index(){
	let today = new Date();
	const rtime = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+
		" "+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	console.log("Reqid: "+i + " " + rtime)
	let topic = "devices:ALL requestid:"+i;
	client.publish(process.env.MQTT_REQUEST_TOPIC, topic);
 	i++;
};

client.on('connect',  () => {
	console.log('Connected');
	client.subscribe(process.env.MQTT_RESULT_TOPIC);
	setInterval(function(){pub_index()},60000);
	/*(async function sendRequest() {
		let i = 0;
    	while (true) {
        	await new Promise(resolve => setTimeout(resolve, 60000));
        	let today = new Date();
        	let topic = "devices:ALL requestid:"+i;
        	i++;
        	const rtime = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+
				" "+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			console.log("Reqid: "+i + " " + rtime)
        	client.publish(process.env.MQTT_REQUEST_TOPIC, topic);
    	}
	})();*/
});

// Waiting for messages to arrive and store to mongo
client.on('message', function (topic, message) {

	//console.log(message.toString());
	try {
		let newIot = JSON.parse(message.toString());

		if (newIot.device!==undefined && 
			newIot.unit!==undefined && 
			newIot.value!==undefined &&
			newIot.measurement!==undefined){

			//console.log(newIot);
			newIot.topic = topic;
			const iotRow = new iotData(newIot);

			// saving data to database
			iotRow.save((err, newRecord) => {
				if(err) {
					console.log(err);
				};
				if(!newRecord) {
					console.log("Something wrong");
				};
			})
		}
	} catch {
		console.log("No valid JSON. Message: "+message.toString());
	}
  // message is Buffer
});


app.listen(port, () => console.log(`Running on port ${port}`));