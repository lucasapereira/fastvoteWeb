import React, { Component } from 'react';
import { compose } from 'react-apollo';
import AlertContainer from 'react-alert';
import MaterialUiForm from './formNovoUsuario';
import MyLoader from '../../generic/myLoader';
import { mutationAtualiza } from '../../../graphql/atualizaUsuarioVotacao';

import { QueryResultadoList } from '../../../graphql/allUsuariosQuePodemVotar';
import { checkBoxToScreen, screenToGraphql } from '../../generic/List';
import { getStorage } from '../../generic/storage';

class UpdateUsuarioScreen extends Component {
  callMutationUsuario = values => {
    values.codpessoajuridica = getStorage('cod_pessoa_juridica');
    values.coddadosadicionaisarray = screenToGraphql(values, 'coddadosadicionaisarray');
    values.vlrpeso = values.vlrpeso.replace(',', '.');
    values.numcpfpessoa = values.numcpfpessoa.replace(/\D/g, '');
    values.numtelefone = values.numtelefone.replace(/\D/g, '');

    this.props
      .atualizaUsuarioVotacao({
        variables: {
          numcpfpessoa: values.numcpfpessoa,
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
        this.props.history.push('/frontend/gestaoUsuario/listaUsuario');
      })
      .catch(e => {
        this.msg.error('Erro ao realizar a operação');
        console.error(e);
      });
  };
  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro: {this.props.error.message}</div>;
    }

    const initialValues = checkBoxToScreen(this.props.rows[0], this.props.rows[0].dadosAdicionais);

    return (
      <div>
        <MaterialUiForm
          initialValues={initialValues}
          callMutationUsuario={this.callMutationUsuario}
        />

        <AlertContainer ref={a => (this.msg = a)} />
      </div>
    );
  }
}

export default compose(QueryResultadoList, mutationAtualiza)(UpdateUsuarioScreen);
