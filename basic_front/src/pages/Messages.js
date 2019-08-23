import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { subscribe } from 'mqtt-react';
import MqttMessage from '../scripts/MqttMessage';

const topic = process.env.REACT_APP_TOPIC;

class Messages extends Component {
  state = {
    messages: [],
  }

  /*
  ws = new WebSocket(URL);
  */

  //client = new Mqtt.connect(process.env.REACT_APP_WSHOST);

  /*componentDidMount() {

    this.client.on('connect') = () => {
      console.log('connected');
      this.client.subscribe(process.env.REACT_APP_TOPIC)
      // on connecting, do nothing but log it to the console
    };

    this.client.on('message') = (topic, message) => {
      // on receiving a message, add it to the list of messages
      const parsedMessage = JSON.parse(message);
      if(parsedMessage.device!==undefined &&
        parsedMessage.unit!==undefined &&
        parsedMessage.value!==undefined &&
        parsedMessage.measurement!==undefined &&)
      this.addMessage(parsedMessage);
    };

    this.client.on('disconnect') = () => {
      console.log('disconnected');
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }

  addMessage = message =>
    this.setState(state => ({ messages: [message, ...state.messages] }));
  */

  render() {

    console.log(this.props.data);

    return (
      <div>
        <Link to="/find">Vanhojen haku</Link>
        {this.props.data.map((message, index) =>
          <MqttMessage
            key={index}
            device={message.device}
            value={message.value}
            unit={message.unit}
            measurement={message.measurement}
          />,
        )}
      </div>
    )
  }
}

export default subscribe({ topic })(Messages);