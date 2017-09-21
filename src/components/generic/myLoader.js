import React, { Component } from 'react';
import Loader from 'halogen/ClipLoader';

export default class MyLoader extends Component {
  render() {
    return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Loader color="#4DAF7C" size="32px" margin="4px" />
      </div>
    );
  }
}
