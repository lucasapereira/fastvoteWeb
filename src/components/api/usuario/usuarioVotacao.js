import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import { compose } from 'react-apollo';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Icon from 'react-icon';
import { Table, Row, Col, ProgressBar } from 'react-bootstrap';

import { QueryVoto, mutationVota } from './usuarioVotacaoGraphql';
import confirm from '../../generic/confirm';
import MyLoader from '../../generic/myLoader';

class UsuarioVotacao extends Component {
  onPress = (votacao) => {
    confirm(`${votacao.dscResposta}`).then(
      () => {
        this.vota(votacao);
      },
      () => {
        console.log('cancel!');
      },
    );
  };

  getStatusVotacao = (votacao) => {
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

  renderLabelResultado = (votacao) => {
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
          <tr>
            <td colSpan="3">O Resultado será disponibilizado ao fim da votação.</td>
          </tr>
        );
      }
    }

    // mostra resultado na table
    if (stringResp === true) {
      // const qtdResp = rows.length;

      let countItemResp = 1;
      stringResp = rows.map((row) => {
        const arrResp = [];
        const now = countItemResp * 20;

        arrResp.push(
          <tr>
            <td width="10%" align="center">
              {countItemResp++}
            </td>
            <td width="40%">
              {row.dscResposta}
            </td>
            <td width="50%">
              <ProgressBar bsStyle="success" now={now} label={`${now}%`} />
            </td>
          </tr>,
        );

        return arrResp;
      });
    }

    return (
      <fieldset>
        <legend className="fieldSetResultadoLegend">
          {labelResultado}
        </legend>

        <Table striped bordered condensed hover>
          <tbody>
            {stringResp}
          </tbody>
        </Table>
      </fieldset>
    );
  };

  renderResultado = (votacao) => {
    Icon.setDefaultFontPrefix('glyphicon');
    let botaoResultado = (
      <FlatButton
        backgroundColor="#e8e8e8"
        label="Detalhes"
        fullWidth
        disabled
        primary
        icon={<Icon glyph="stats" />}
      />
    );

    if (votacao.datFimVotacao.length > 0 || votacao.flgMostraResultadoEmTempoReal) {
      const link = `/votacao/resultado/${votacao.codVotacao}`;

      botaoResultado = (
        <Link to={link}>
          <FlatButton
            backgroundColor="#a4c639"
            hoverColor="#8AA62F"
            label="Detalhes"
            fullWidth
            labelStyle={{ color: '#FFFFFF' }}
            primary
            icon={<Icon glyph="stats" style={{ color: '#FFFFFF' }} />}
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
          </Col>
        </Row>
      </div>
    );
  };

  vota = (votacao) => {
    this.props
      .vota({
        variables: {
          codResposta: votacao.codResposta,
          codUsuarioRepresentacao: parseInt(this.props.urep, 10),
          codVotacao: votacao.codVotacao,
        },
      })
      .then(({ data }) => {
        this.props.refetchLista();
      })
      .catch((error) => {
        console.log('there was an error sending the query', error);
      });
  };

  renderVotacao() {
    const { votacao } = this.props;

    let classStatus = 'statusVotacaoNaoIniciada';
    let labelTxtStatus = 'Não Iniciada';
    let flgFinalizada = false;

    const flgStatus = this.getStatusVotacao(votacao);

    if (flgStatus === 1) {
      classStatus = 'statusVotacaoAberta';
      labelTxtStatus = 'Aberta';
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
          <span className="txtVotacaoExecutada">
            {votacao.dscResposta}
          </span>
        </span>
      );
    } else {
      // Se nao votou e fechou aparece texto
      const labelResp = flgFinalizada
        ? <span className="labelVotoNaoComputado">Voto não computado</span>
        : (<span>
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
        </span>);

      labelTxtResposta = (
        <span>
          {labelResp}
        </span>
      );
    }

    return (
      <Paper className="paperVotacao" zDepth={2} rounded>
        <div className="labelStatus">
          Status: <span className={classStatus}>{labelTxtStatus}</span>
        </div>
        <div className="txtPerguntaVotacoes">
          {votacao.dscPergunta}
        </div>
        <div className="divRespostasVotacoes">
          {labelTxtResposta}
        </div>
        <br />
        {this.renderResultado(votacao)}
      </Paper>
    );
  }

  renderBotoesVotacao = (rows, mobile = false) => {
    let style = { margin: 10 };
    let flgFull = false;

    if (mobile) {
      style = { marginTop: 5, marginBottom: 5 };
      flgFull = true;
    }

    if (this.props.votacao.dentroVigenciaVotacao === 'Votação em andamento.') {
      return rows.map(resp =>
        (<RaisedButton
          backgroundColor="#66b682"
          labelColor="#FFFFFF"
          type="button"
          style={style}
          fullWidth={flgFull}
          label={resp.dscResposta}
          key={resp.codResposta}
          onClick={() => this.onPress(resp)}
        />),
      );
    }
  };

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return (
        <div>
          Erro: {this.props.error.message}
        </div>
      );
    }
    return (
      <div>
        {this.renderVotacao()}
      </div>
    );
  }
}

UsuarioVotacao.propTypes = {
  urep: PropTypes.string.isRequired,
};

export default compose(QueryVoto, mutationVota)(withRouter(UsuarioVotacao));
