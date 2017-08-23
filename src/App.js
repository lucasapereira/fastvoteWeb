import React, { Component } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { routeTo } from './rotas';

class App extends Component {
  render() {
    return (
      <div>
        {routeTo()}
      </div>
    );
  }
}

export default App;
