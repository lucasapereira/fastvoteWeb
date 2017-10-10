import React, { Component } from 'react';

import MensagensList from './mensagensList';
import MensagemForm from './mensagemForm';

class Mensagens extends Component {
  render() {
    return (
      <div className="container">
        <div className="baseContentWhite">
          <div className="pageTitle">Envio de Mensagens</div>
          <MensagemForm />
          <div className="pageTitle">Mensagens Cadastradas</div>
          <MensagensList />
        </div>
      </div>
    );
  }
}

export default Mensagens;
