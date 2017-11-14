import React, { Component } from 'react';
import { compose } from 'react-apollo';
import AlertContainer from 'react-alert';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import MaterialUiForm from './formNovoUsuario';
import { mutationCria } from '../../../graphql/criaUsuarioVotacao';
import { getStorage } from '../../generic/storage';
import { screenToGraphql } from '../../generic/List';

class NovoUsuarioScreen extends Component {
  callMutationUsuario = values => {
    values.codpessoajuridica = getStorage('cod_pessoa_juridica');
    values.coddadosadicionaisarray = screenToGraphql(values, 'coddadosadicionaisarray');
    values.numcpfpessoa = values.numcpfpessoa.replace(/\D/g, '');
    values.numtelefone = values.numtelefone.replace(/\D/g, '');

    if (typeof values.vlrpeso === 'string') {
      values.vlrpeso = values.vlrpeso.replace(',', '.');
    }

    this.props
      .criaUsuarioVotacao({
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
    return (
      <div className="container">
        <div>
          <Row>
            <Col xs={12}>
              <div className="pageTitle">Cadastro de Usuário</div>
            </Col>
          </Row>
          <div className="divisor" />
          <Row>
            <Col xs={12}>
              <MaterialUiForm callMutationUsuario={this.callMutationUsuario} />
              <AlertContainer ref={a => (this.msg = a)} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default compose(mutationCria)(NovoUsuarioScreen);
