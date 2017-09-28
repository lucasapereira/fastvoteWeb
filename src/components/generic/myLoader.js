import React, { Component } from 'react';
var Spinner = require('react-spinkit');

export default class MyLoader extends Component {
  render() {
    return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Spinner name="ball-clip-rotate" color="#4DAF7C" size="32px" />
      </div>
    );
  }
}
