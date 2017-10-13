import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { routeTo } from './rotas';

// teste commit

class App extends Component {
  componentDidMount() {
    const ele = document.getElementById('ipl-progress-indicator');
    if (ele) {
      setTimeout(() => {
        ele.classList.add('available');
        setTimeout(() => {
          ele.outerHTML = '';
        }, 1000);
      }, 500);
    }
  }
  render() {
    return <div>{routeTo()}</div>;
  }
}

export default App;
