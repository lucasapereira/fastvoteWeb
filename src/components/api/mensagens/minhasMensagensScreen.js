import React, { Component } from 'react';
import { compose } from 'react-apollo';

import { Row, Col } from 'react-bootstrap';
import AlertContainer from 'react-alert';

import MinhasMensagens from './minhasMensagens';

import confirm from '../../generic/confirm';

import { ApagaMensagemGraphql } from '../../../graphql/arquivaMensagemUsuario';
import { ListMensagemGraphql } from '../../../graphql/allTbMensagensPorUsuario';

class Mensagens extends Component {
  selectedIdsRows = [];

  setMensagensSelected = rows => {
    let arraySel = rows.map((value, key) => {
      return value.codMensagem;
    });

    this.selectedIdsRows = arraySel;
  };

  confirmationDelMensagem = () => {
    confirm('Você tem certeza que deseja excluir a(s) mensagem(ns) selecionada(s)?').then(
      () => {
        this.deletaMensagem();
      },
      () => {}
    );
  };

  deletaMensagem = () => {
    try {
      this.selectedIdsRows.map(async row => {
        await this.props.apaga({
          variables: {
            codmensagem: row,
            //codpessoajuridica: codPJ,
          },
        });

        this.props.refetch();
      });
    } catch (e) {
      this.msg.error('Erro ao realizar a operação');
      console.error(e);
    }
  };

  render() {
    let showScreen = () => {
      return (
        <div>
          <Row>
            <Col xs={12}>
              <div className="pageTitle">Mensagens</div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <MinhasMensagens
                delMensagem={this.confirmationDelMensagem}
                setMensagensSelected={this.setMensagensSelected}
                rows={this.props.rows}
              />
            </Col>
          </Row>
        </div>
      );
    };

    return (
      <div className="container">
        <div className="baseContentWhite">{showScreen()}</div>
        <AlertContainer ref={a => (this.msg = a)} />
      </div>
    );
  }
}

export default compose(ApagaMensagemGraphql, ListMensagemGraphql)(Mensagens);
