import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { compose } from 'react-apollo';
import Loader from 'halogen/PulseLoader';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import { QueryVoto, mutationVota } from './usuarioVotacaoGraphql';
import confirm from '../../generic/confirm';

class UsuarioVotacao extends Component {
  onPress = (votacao) => {
    confirm(`Você tem certeza que deseja deseja votar em: ${votacao.dscResposta}`).then(
      () => {
        this.vota(votacao);
      },
      () => {
        console.log('cancel!');
      },
    );
  };

  botaoResultado = (votacao) => {
    console.log(votacao);
    if (votacao.datFimVotacao.length > 0 || votacao.flgMostraResultadoEmTempoReal) {
      const link = `/votacao/resultado/${votacao.codVotacao}`;

      return (
        <Link to={link}>
          <RaisedButton label="Resultado">
            <i className="material-icons">assessment</i>
          </RaisedButton>
        </Link>
      );
    }
  };

  vota = (votacao) => {
    console.log(this.props);
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

    if (votacao.dscResposta) {
      return (
        <Paper className="paperVotacoes" zDepth={2} rounded>
          <div className="statusVotacaoFechada" />
          <div className="txtPerguntaVotacoes">
            {votacao.dscPergunta}
          </div>
          <div className="divRespostasVotacoes">
            Seu voto: {votacao.dscResposta}
          </div>
          <br />
          {this.botaoResultado(votacao)}
          <br />
          {votacao.dentroVigenciaVotacao}
          <br />
        </Paper>
      );
    }

    return (
      <Paper className="paperVotacoes" zDepth={2} rounded>
        <div className="statusVotacaoAberta" />
        <div className="txtPerguntaVotacoes">
          {votacao.dscPergunta}
        </div>
        <div className="divRespostasVotacoes">
          {this.renderBotoesVotacao(this.props.rows)}
        </div>
        <br />
        {votacao.dentroVigenciaVotacao}
        <br />
        {this.botaoResultado(votacao)}
      </Paper>
    );
  }

  renderBotoesVotacao = (rows) => {
    if (this.props.votacao.dentroVigenciaVotacao === 'Votação em andamento.') {
      return rows.map(resp =>
        (<RaisedButton
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
      return <Loader color="#00BCD4" size="16px" margin="4px" />;
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
