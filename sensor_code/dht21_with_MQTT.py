#!/usr/bin/python
import sys
import re
import datetime
import Adafruit_DHT
import paho.mqtt.client as paho

broker="<broker>"
publishChannel="<publish channel>"
requestChannel="<request channel>"

#Will use channel pmptest to send measurements and channel pmprequest to listen send requests

#Callback
def on_message(client, userdata, msg):
	#print("Received message: "+str(msg.payload)+" to topic: "+str(msg.topic))

	timestamp = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

	humidity, temperature = Adafruit_DHT.read_retry(Adafruit_DHT.DHT22, 4)

	if (re.search("ALL|TEMP", str(msg.payload))):
		if (temperature < 100 and temperature > -100):
			message = '{{"device":"DHT21.temperature", "value":{:0.1f}, "unit":"C", "time": "{}" }}'\
				.format(temperature, timestamp)
			client.publish(publishChannel, message) 

	if (re.search("ALL|HUMI", str(msg.payload))):
		if (humidity < 100 and humidity > 0):
			message = '{{"device":"DHT21.humidity", "value":{:0.1f}, "unit":"%", "time": "{}" }}'\
				.format(humidity, timestamp)
			client.publish(publishChannel, message) 


def on_connect(client, userdata, flags, rc):
	print("Connected with result code "+str(rc))
	client.subscribe(requestChannel)


client = paho.Client("Client-1")
client.on_message=on_message
client.on_connect=on_connect

##
print("Connecting to broker ",broker)
client.connect(broker, 1883, 60)
client.publish(publishChannel, "Client-1 on")


try:
	client.loop_forever()
except:
	print("Something wrong")

client.disconnect()

