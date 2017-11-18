import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Modal, Button } from 'react-bootstrap';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import AlertContainer from 'react-alert';

import axios from 'axios';
import { QueryResultadoVotacaoPessoa } from './votacao_resumo_graphql';
import MyLoader from '../../generic/myLoader';
import { authOptions } from '../../generic/myAxios';

const FileDownload = require('react-file-download');

class VotacaoResumo extends Component {
  alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'dark',
    time: 5000,
    transition: 'scale',
  };

  download = file => {
    const aOptions = authOptions();
    const novoOptions = {
      ...aOptions,
      responseType: 'blob',
      headers: {
        ...aOptions.headers,
        Accept: file.dscType,
      },
    };
    axios
      .get(`/votacao/getArquivoVotacao?filename=${file.dscArquivo}`, novoOptions)
      .then(response => {
        if (response.data) {
          FileDownload(response.data, file.nomArquivo, file.dscType);
        } else {
          this.msg.error('Erro ao fazer download do arquivo.');
        }
      })
      .catch(e => {
        console.log(e);

        this.msg.error('Erro ao fazer download do arquivo.');
      });
  };

  showFiles = () => {
    const a = this.props.data.allTbVotacaos.nodes[0].tbVotacaoImagemsByCodVotacao.nodes.map(
      file => {
        return (
          <span key={file.dscArquivo + 'span'}>
            <a onClick={() => this.download(file)} key={file.dscArquivo}>
              {file.nomArquivo}
            </a>
            <br />
          </span>
        );
      }
    );

    if (a.length > 0) {
      return a;
    }

    return <span>Nenhum arquivo cadastrado.</span>;
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
          <div>
            <div style={{ fontSize: '120%', color: '#C0C0C0', fontWeight: 'bold' }}>Anexos:</div>
            {this.showFiles()}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Fechar</Button>
        </Modal.Footer>
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
      </Modal>
    );
  };
}

export default compose(QueryResultadoVotacaoPessoa)(VotacaoResumo);
