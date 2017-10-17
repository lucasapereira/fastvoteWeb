import React, { Component } from 'react';
import { compose } from 'react-apollo';
import MaterialUiForm from './formNovoUsuario';
import { mutationCria } from '../../../graphql/criaUsuarioVotacao';
import { getStorage } from '../../generic/storage';

class NovoUsuarioScreen extends Component {
  callMutationUsuario = values => {
    console.log('screen', values);
    values.codPessoaJuridica = getStorage('cod_pessoa_juridica');

    this.props.criaUsuarioVotacao(values);
  };
  render() {
    return <MaterialUiForm callMutationUsuario={this.callMutationUsuario} />;
  }
}

export default compose(mutationCria)(NovoUsuarioScreen);
