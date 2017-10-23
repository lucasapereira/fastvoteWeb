import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import { compose } from 'react-apollo';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { Table, Row, Col, Glyphicon } from 'react-bootstrap';
import DetalheVotacao from './detalheVotacao';
import VotacaoResumo from './votacao_resumo';

import { QueryVoto, mutationVota } from './usuarioVotacaoGraphql';
import confirm from '../../generic/confirm';
import MyLoader from '../../generic/myLoader';

import Countdown from '../../generic/countDown';
import QtdVotos from './qtdVotos';

class UsuarioVotacao extends Component {
  state = {
    modalIsOpen: false,
  };
  onPress = votacao => {
    confirm(`${votacao.dscResposta}`).then(
      () => {
        this.vota(votacao);
      },
      () => {}
    );
  };

  getStatusVotacao = votacao => {
    let codStatus = 0; // Fechada

    if (votacao.dentroVigenciaVotacao === 'Votação em andamento.') {
      codStatus = 1; // Aberta
    } else if (votacao.dentroVigenciaVotacao === 'Votação já finalizada.') {
      codStatus = 2; // Finalizada
    }

    // RETURN
    // 0 - Fechada
    // 1 - Aberta
    // 2 - Finalizada
    return codStatus;
  };

  renderLabelResultado = votacao => {
    const { rows } = this.props;

    const flgStatus = this.getStatusVotacao(votacao);

    // Inicializa com votação fechada
    let labelResultado = 'Resultado indisponível';
    let stringResp = (
      <tr>
        <td colSpan="3">Votação não iniciada.</td>
      </tr>
    );

    // Organiza labels
    if (flgStatus === 2) {
      // Finalizada
      labelResultado = 'Resultado Final';
      stringResp = true;
    } else if (flgStatus === 1) {
      // Aberta
      if (votacao.flgMostraResultadoEmTempoReal) {
        labelResultado = 'Resultado Parcial';
        stringResp = true;
      } else {
        labelResultado = 'Resultado indisponível';
        stringResp = (
          <tbody>
            <tr>
              <td colSpan="3">O Resultado será disponibilizado ao fim da votação.</td>
            </tr>
          </tbody>
        );
      }
    }

    // mostra resultado na table
    if (stringResp === true) {
      stringResp = (
        <DetalheVotacao rows={rows} votacao={votacao} dscResposta={votacao.dscResposta} />
      );
      // const qtdResp = rows.length;
    }

    return (
      <fieldset>
        <legend className="fieldSetResultadoLegend">{labelResultado}</legend>

        <Table striped bordered condensed hover>
          {stringResp}
        </Table>
      </fieldset>
    );
  };
  renderResultado = votacao => {
    let botaoResultado = (
      <FlatButton
        backgroundColor="#e8e8e8"
        label="Detalhes"
        fullWidth
        disabled
        primary
        icon={<Glyphicon glyph="stats" style={{ color: '#C0C0C0' }} />}
      />
    );

    let botaoResumo = (
      <RaisedButton
        label="Resumo"
        fullWidth
        primary
        onClick={this.openModal}
        style={{ marginTop: 5 }}
      />
    );

    if (votacao.datFimVotacao.length > 0 || votacao.flgMostraResultadoEmTempoReal) {
      const link = `/frontend/votacao/resultado/${votacao.codVotacao}`;

      botaoResultado = (
        <Link to={link}>
          <FlatButton
            backgroundColor="#a4c639"
            hoverColor="#8AA62F"
            label="Detalhes"
            fullWidth
            labelStyle={{ color: '#FFFFFF' }}
            primary
            icon={<Glyphicon glyph="stats" style={{ color: '#FFFFFF' }} />}
          />
        </Link>
      );
    }

    return (
      <div className="divResultado">
        <Row className="show-grid">
          <Col xs={12} sm={9} md={10}>
            {this.renderLabelResultado(votacao)}
          </Col>
          <Col xs={12} sm={3} md={2} className="btnDetalheResultado">
            {botaoResultado}
            {botaoResumo}
          </Col>
        </Row>
      </div>
    );
  };

  vota = votacao => {
    this.props
      .vota({
        variables: {
          codResposta: votacao.codResposta,
          codUsuarioRepresentacao: parseInt(this.props.urep, 10),
          codVotacao: votacao.codVotacao,
        },
      })
      .then(() => {
        this.props.refetchLista();
      })
      .catch(error => {
        console.log('there was an error sending the query', error);
      });
  };

  handleFinish = () => {
    console.log('Skynet has become self-aware!');
  };
  renderCountDown = votacao => {
    const dateAgora = new Date();
    const flgStatus = this.getStatusVotacao(votacao);
    if (votacao.datFimVotacaoDate && votacao.datFimVotacaoDate > dateAgora && flgStatus === 1) {
      console.log('entrei aki', votacao);
      return (
        <Countdown
          targetDate={votacao.datFimVotacaoDate}
          startDelay={2000}
          interval={1000}
          timeSeparator={':'}
          onFinished={this.handleFinish}
        />
      );
    }
  };

  renderVotacao() {
    const { votacao } = this.props;
    console.log(votacao);

    let classStatus = 'statusVotacaoNaoIniciada';
    let labelTxtStatus = 'Não Iniciada';
    let flgFinalizada = false;

    const flgStatus = this.getStatusVotacao(votacao);

    if (flgStatus === 1) {
      classStatus = 'statusVotacaoAberta';

      if (votacao.datFimVotacao) {
        labelTxtStatus = `Data/Hora do fim da votação: ${votacao.datFimVotacao}Aberta`;
      } else {
        labelTxtStatus = `Aberta`;
      }
    } else if (flgStatus === 2) {
      flgFinalizada = true;
      classStatus = 'statusVotacaoFechada';
      labelTxtStatus = 'Finalizada';
    }

    let labelTxtResposta = 'Voto não computado';

    // se ja votou aparece resposta, se nao mostra os botoes
    if (votacao.dscResposta) {
      labelTxtResposta = (
        <span>
          <span className="labelVotacaoExecutada">Seu voto: </span>
          <span className="txtVotacaoExecutada">{votacao.dscResposta}</span>
        </span>
      );
    } else {
      // Se nao votou e fechou aparece texto
      const labelResp = flgFinalizada ? (
        <span className="labelVotoNaoComputado">Voto não computado</span>
      ) : (
        <span>
          <Row>
            <Col xsHidden sm={12}>
              {this.renderBotoesVotacao(this.props.rows)}
            </Col>
          </Row>
          <Row>
            <Col xs={12} smHidden mdHidden lgHidden>
              {this.renderBotoesVotacao(this.props.rows, true)}
            </Col>
          </Row>
        </span>
      );

      labelTxtResposta = <span>{labelResp}</span>;
    }

    return (
      <Paper className="paperVotacao" zDepth={2} rounded>
        <div className="labelStatus">
          <QtdVotos codVotacao={votacao.codVotacao} />
          {this.renderCountDown(votacao)}
          <span className={classStatus}>{labelTxtStatus}</span>
        </div>
        <div className="txtPerguntaVotacoes">{votacao.dscPergunta}</div>
        <div className="divRespostasVotacoes">{labelTxtResposta}</div>
        <br />
        {this.renderResultado(votacao)}
      </Paper>
    );
  }

  openModal = i => {
    this.setState({
      modalIsOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
    });
  };

  renderBotoesVotacao = (rows, mobile = false) => {
    let style = { margin: 10 };
    let flgFull = false;

    if (mobile) {
      style = { marginTop: 5, marginBottom: 5 };
      flgFull = true;
    }

    if (this.props.votacao.dentroVigenciaVotacao === 'Votação em andamento.') {
      return rows.map(resp => (
        <RaisedButton
          backgroundColor="#66b682"
          labelColor="#FFFFFF"
          type="button"
          style={style}
          fullWidth={flgFull}
          label={resp.dscResposta}
          key={resp.codResposta}
          onClick={() => this.onPress(resp)}
        />
      ));
    }
  };

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro: {this.props.error.message}</div>;
    }
    return (
      <div>
        {this.renderVotacao()}
        <VotacaoResumo
          codVotacao={this.props.votacao.codVotacao}
          modalIsOpen={this.state.modalIsOpen}
          closeModal={this.closeModal}
        />
      </div>
    );
  }
}

UsuarioVotacao.propTypes = {
  urep: PropTypes.string.isRequired,
};

export default compose(QueryVoto, mutationVota)(withRouter(UsuarioVotacao));
