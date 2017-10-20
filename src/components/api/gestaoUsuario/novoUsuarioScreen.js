import React, { Component } from 'react';
import { compose } from 'react-apollo';
import MaterialUiForm from './formNovoUsuario';
import { mutationCria } from '../../../graphql/criaUsuarioVotacao';
import { getStorage } from '../../generic/storage';

class NovoUsuarioScreen extends Component {
  callMutationUsuario = values => {
    values.codpessoajuridica = getStorage('cod_pessoa_juridica');
    console.log(values);

    this.props
      .criaUsuarioVotacao({
        variables: {
          nomcompletopessoa: values.nomcompletopessoa,
          dscemail: values.dscemail,
          codpessoajuridica: values.codpessoajuridica,
          numtelefone: values.numtelefone,
          coddadosadicionaisarray: values.coddadosadicionaisarray,
          vlrpeso: values.vlrpeso,
          vlrsenha: values.vlrsenha,
          datnascimentopessoa: values.datnascimentopessoa,
          sglsexo: values.sglsexo,
        },
      })
      .then(() => {
        console.log('deu bom');
      })
      .catch(e => {
        console.log(e);
      });
  };
  render() {
    return <MaterialUiForm callMutationUsuario={this.callMutationUsuario} />;
  }
}

export default compose(mutationCria)(NovoUsuarioScreen);
