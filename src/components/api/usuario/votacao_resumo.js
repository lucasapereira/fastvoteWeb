import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Modal, Button } from 'react-bootstrap';

import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
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

    const contentState = convertFromRaw(JSON.parse(resumo));
    let html = stateToHTML(contentState);

    if (html === '<p><br></p>') {
      html = '<p>O resumo não foi cadastrado.</p>';
    }

    return (
      <Modal show={this.props.modalIsOpen} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">Resumo da Votação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content" dangerouslySetInnerHTML={{ __html: html }} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

export default compose(QueryResultadoVotacaoPessoa)(VotacaoResumo);
