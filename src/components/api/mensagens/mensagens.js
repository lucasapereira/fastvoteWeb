import React, { Component } from 'react';
import { connect } from 'react-redux';

import MensagensList from './mensagensList';
import MensagemForm from './mensagemForm';

class Mensagens extends Component {
  render() {
    return (
      <div className="container">
        <div className="baseContentWhite">
          <div className="pageTitle">Mensagens Cadastradas</div>
          <MensagensList
          // codPessoaJuridica={this.state.codPessoaJuridica}
          // activeCheckboxes={this.state.activeCheckboxes}
          // renderButtonVariosSelection={this.renderButtonVariosSelection}
          // setUsuarioPodeVotar={this.setUsuarioPodeVotar}
          // renderButtonVariosSelectionDisabled={this.renderButtonVariosSelectionDisabled}
          />

          <div className="pageTitle">Envio de Mensagens</div>
          <MensagemForm />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Mensagens);
// export default compose(MutationGravaVotacao)(Mensagens);
