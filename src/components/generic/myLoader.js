// colocar tudo do loader aqui para criar loader personalizado (possivelmente colocando tela opaca)
import React, { Component } from 'react';
import Loader from 'halogen/PulseLoader';

export default class MyLoader extends Component {
  render() {
    return (
      <div>
        <Loader color="#00BCD4" size="16px" margin="4px" />;
      </div>
    );
  }
}
