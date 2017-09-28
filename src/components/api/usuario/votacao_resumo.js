import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Modal, Button } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import axios from 'axios';
import { QueryResultadoVotacaoPessoa } from './votacao_resumo_graphql';
import MyLoader from '../../generic/myLoader';
import { authOptions } from '../../generic/myAxios';

const FileDownload = require('react-file-download');

class VotacaoResumo extends Component {
  download = () => {
    axios
      .get('/votacao/getArquivoVotacao?filename=16c1a6f3eb4136a329852389750025b2', authOptions())
      .then(response => {
        console.log(response);
        if (response.data) {
          FileDownload(response.data, 'about_blank.pdf');
        } else {
          //  this.msg.error('Erro ao fazer upload do arquivo.');
        }
      })
      .catch(e => {
        console.log(e);

        //this.msg.error('Erro ao fazer upload do arquivo.');
      });
  };

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

          <FlatButton
            onClick={() => {
              this.download();
            }}
            label="Adicionar arquivos"
            labelStyle={{ color: 'white' }}
            fullWidth
            backgroundColor="#a4c639"
            hoverColor="#8AA62F"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };
}

export default compose(QueryResultadoVotacaoPessoa)(VotacaoResumo);
