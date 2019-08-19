import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MqttMessage from '../scripts/MqttMessage';

const URL = process.env.REACT_APP_WSHOST;

class Messages extends Component {
  state = {
    messages: [],
  };

  ws = new WebSocket(URL);

  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected');
    };

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data);
      this.addMessage(message);
    };

    this.ws.onclose = () => {
      console.log('disconnected');
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }

  addMessage = message =>
    this.setState(state => ({ messages: [message, ...state.messages] }));

  render() {
    return (
      <div>
        <Link to="/find">Vanhojen haku</Link>
        {this.state.messages.map((message, index) =>
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

export default Messages;