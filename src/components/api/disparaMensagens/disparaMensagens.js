import React, { Component } from 'react';
import { connect } from 'react-redux';

import DisparaMensagemList from './disparaMensagemList';
import DisparaMensagemForm from './disparaMensagemForm';

class DisparaMensagem extends Component {
  render() {
    return (
      <div className="container">
        <div className="baseContentWhite">
          <div className="pageTitle">Mensagens Cadastradas</div>
          <DisparaMensagemList
          // codPessoaJuridica={this.state.codPessoaJuridica}
          // activeCheckboxes={this.state.activeCheckboxes}
          // renderButtonVariosSelection={this.renderButtonVariosSelection}
          // setUsuarioPodeVotar={this.setUsuarioPodeVotar}
          // renderButtonVariosSelectionDisabled={this.renderButtonVariosSelectionDisabled}
          />

          <div className="pageTitle">Envio de Mensagens</div>
          <DisparaMensagemForm />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(DisparaMensagem);
// export default compose(MutationGravaVotacao)(DisparaMensagem);
