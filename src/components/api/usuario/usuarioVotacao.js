import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import { compose } from 'react-apollo';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Icon from 'react-icon';
import { Grid, Row, Col } from 'react-bootstrap';

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

  renderLabelResultado = (votacao) => {
    // Icon.setDefaultFontPrefix('glyphicon');
    const { rows } = this.props;

    // mostra se votacao esta finalizada ou se ha resultado em tempo real
    if (votacao.datFimVotacao.length || votacao.flgMostraResultadoEmTempoReal) {
      const qtdResp = rows.length;

      /*
      descricao = this.props.data.allTbPjDadosadicionais.nodes.map((row) => {
        const arrDescricao = [];

        arrDescricao.push(
          <Paper>
            <ListItem
              leftCheckbox={
                <Checkbox
                  onCheck={() => this.props.handleCheck(row.codDadosAdicionais)}
                  checked={this.props.activeCheckboxes.includes(row.codDadosAdicionais)}
                />
              }
              primaryText={`${row.codDadosAdicionais} - ${row.tbDadosAdicionaiByCodDadosAdicionais
                .dscDadosAdicionais}`}
              secondaryText="Allow notifications"
            />
          </Paper>,
        );

        return arrDescricao;
      });
      */

      const stringResp = rows.map((row) => {
        const arrResp = [];

        arrResp.push(
          <div>
            {`${row.dscResposta} - 20%`}
          </div>,
        );

        return arrResp;
      });

      console.log('VOTA VOTA', votacao, stringResp);

      return (
        <span className="spanResultado">
          RESULTADO stats {stringResp} Respostas
        </span>
      );
    }
  };

  botaoResultado = (votacao) => {
    Icon.setDefaultFontPrefix('glyphicon');
    let botaoResultado = (
      <FlatButton
        label="Detalhes"
        backgroundColor="#e8e8e8"
        primary
        disabled
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
            // fullWidth
            labelStyle={{ color: '#FFFFFF' }}
            primary
            icon={<Icon glyph="stats" style={{ color: '#FFFFFF' }} />}
          />
        </Link>
      );
    }

    return (
      <div className="divResultado">
        <Row className="show-grid teste">
          <Col xs={12} sm={9} className="teste">
            {this.renderLabelResultado(votacao)}
          </Col>
          <Col xs={12} sm={3} className="teste">
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

    if (votacao.dentroVigenciaVotacao === 'Votação em andamento.') {
      classStatus = 'statusVotacaoAberta';
      labelTxtStatus = 'Aberta';
    } else if (votacao.dentroVigenciaVotacao === 'Votação já finalizada.') {
      flgFinalizada = true;
      classStatus = 'statusVotacaoFechada';
      labelTxtStatus = 'Fechada';
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
        : this.renderBotoesVotacao(this.props.rows);

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
        {this.botaoResultado(votacao)}
      </Paper>
    );
  }

  renderBotoesVotacao = (rows) => {
    if (this.props.votacao.dentroVigenciaVotacao === 'Votação em andamento.') {
      return rows.map(resp =>
        (<RaisedButton
          backgroundColor="#66b682"
          labelColor="#FFFFFF"
          style={{ margin: 10 }}
          type="button"
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
