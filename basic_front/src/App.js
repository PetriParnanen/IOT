import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import Messages from './pages/Messages';
import FindOld from './pages/FindOld';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">IOT front</h1>
        </header>
        <Route path="/" exact component={Messages} />
        <Route path="/find" exact component={FindOld} />
      </div>
    )
  }
}

export default App;