const express = require('express');
const mqtt = require('mqtt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const iotData = require('./src/models/Iotdata');
const message = require('./src/routes/iotdata');

//Just for sending data to front
//const webSocket = require('ws');

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


// -----------------------------------------------
// WEBSOCKET TO SEND DATA TO CLIENTS
/*const wss = new webSocket.Server({ port: 3030 });

wss.on('connection', () => {
	console.log("websocket connection");
});*/

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
	let topic = "devices:ALL requestid:"+i;
	client.publish(process.env.MQTT_REQUEST_TOPIC, topic);
 	i++;
};

client.on('connect',  () => {
	console.log('Connected');
	client.subscribe(process.env.MQTT_RESULT_TOPIC);
	setInterval(function(){pub_index()},60000);
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

			// Sending data to websocket clients
			/*wss.clients.forEach( wsclient => {
				if (wsclient.readyState == webSocket.OPEN){
					wsclient.send(JSON.stringify(newIot));
				}
			});*/

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

//asking requests only from here. Measurements don't send data unless asked
/* (async function sendRequest() {
	let i = 0;
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 60000));
        let topic = "devices:ALL requestid:"+i;
        i++;

        client.publish(process.env.MQTT_REQUEST_TOPIC, topic);
    }
})(); */

app.listen(port, () => console.log(`Running on port ${port}`));