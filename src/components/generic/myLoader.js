import React, { Component } from 'react';
import Loader from 'halogen/PulseLoader';

export default class MyLoader extends Component {
  render() {
    return (
      <div>
        <Loader color="#FF0000" size="16px" margin="4px" />
      </div>
    );
  }
}
