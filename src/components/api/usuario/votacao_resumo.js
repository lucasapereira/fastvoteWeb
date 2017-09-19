import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Modal, Button } from 'react-bootstrap';
import { QueryResultadoVotacaoPessoa } from './votacao_resumo_graphql';
import MyLoader from '../../generic/myLoader';

class VotacaoResumo extends Component {
  render = () => {
    if (this.props.data.error) {
      return <div>Houve um erro. Tente novamente.</div>;
    }
    if (this.props.data.loading) {
      return <MyLoader />;
    }

    let resumo = this.props.data.allTbVotacaos.nodes[0].dscResumo;

    if (!resumo) {
      resumo = 'Resumo não cadastrado.';
    }

    return (
      <Modal show={this.props.modalIsOpen} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">Resumo da Votação</Modal.Title>
        </Modal.Header>
        <Modal.Body>{resumo}</Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

export default compose(QueryResultadoVotacaoPessoa)(VotacaoResumo);
