import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GetAll from "./GetAll.js";
import GetOne from "./GetOne.js";
import Post from "./Post.js";
import Put from "./Put.js";
import Delete from "./Delete.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
          <GetAll />
        </div>
        <div>
          <GetOne />
        </div>
        <div>
          <Post />
        </div>
        <div>
          <Put />
        </div>
        <div>
          <Delete />
        </div>
      </div>
    );
  }
}

export default App;
