import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';
import axios from 'axios';
import Grid from '../../generic/grid';
import { authOptions } from '../../generic/myAxios';
import Lock from 'material-ui/svg-icons/action/lock';
import LockOpen from 'material-ui/svg-icons/action/lock-open';
import MyLoader from '../../generic/myLoader';
import AlertContainer from 'react-alert';

import {
  QueryVotacaoList,
  MutationIniciaVotacao,
  MutationFinalizaVotacao,
  MutationApagaVotacao,
  MutationMostraResultadoEmTempoReal,
} from '../../../graphql/votacao';

class VotacaoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items_grid: 20,
    };
  }

  state: {
    items_grid: number,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.rows.length > 0) {
      this.setState({
        rows: nextProps.rows,
      });
    }
  }

  setItensGrid = (qtd, selected) => {
    this.props.loadMoreEntries(selected * qtd, qtd);
    this.setState({
      items_grid: qtd,
    });
  };

  colunas = [
    {
      key: 'dscVotacao',
      name: 'Nome',
      filterable: true,
      sortable: true,
    },
    {
      key: 'dscPergunta',
      name: 'Pergunta',
      filterable: true,
      sortable: true,
    },
    {
      key: 'datInicioVotacao',
      name: 'Início',
      filterable: true,
      sortable: true,
    },
    {
      key: 'datFimVotacao',
      name: 'Fim',
      filterable: true,
      sortable: true,
    },
    {
      key: 'textoMostraResultadoEmTempoReal',
      name: 'Mostra resultado em tempo real',
      filterable: true,
      sortable: true,
    },
  ];

  enviaPushInicioFimVotacao = (row, acao) =>
    axios.get(
      `/votacao/enviaPushInicioFimVotacao?cod_votacao=${row.codVotacao}&dsc_pergunta=${row.dscPergunta}&acao=${acao}`,
      authOptions(),
    );

  apagaVotacao = async (cols, pageSelected) => {
    try {
      await cols.map(async (row) => {
        await this.props.apagaVotacao({
          variables: {
            codVotacao: row,
          },
        });
      });
      await this.props.loadMoreEntries(pageSelected * this.state.items_grid, this.state.items_grid);
    } catch (e) {
      this.msg.error('Erro ao realizar a operação');
    }
  };

  renderButtonsOneSelection = (row, pageSelected) => {
    const handleInicia = () => {
      const tzoffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);

      this.props
        .iniciaVotacao({
          variables: {
            codVotacao: row.codVotacao,
            datInicioVotacao: localISOTime,
          },
        })
        .then(() => {
          this.props.loadMoreEntries(pageSelected * this.state.items_grid, this.state.items_grid);
          this.enviaPushInicioFimVotacao(row, 'inicia');
        })
        .catch(() => {
          this.msg.error('Erro ao realizar a operação');
        });
    };
    const handleFinaliza = () => {
      const tzoffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
      this.props
        .finalizaVotacao({
          variables: {
            codVotacao: row.codVotacao,
            datFimVotacao: localISOTime,
          },
        })
        .then(() => {
          this.props.loadMoreEntries(pageSelected * this.state.items_grid, this.state.items_grid);
          this.enviaPushInicioFimVotacao(row, 'finaliza');
        })
        .catch(() => {
          this.msg.error('Erro ao realizar a operação');
        });
    };

    const handleMostraResultadoEmTempoReal = () => {
      this.props
        .mostraResultadoEmTempoReal({
          variables: {
            codVotacao: row.codVotacao,
            flgMostraResultadoEmTempoReal: !row.flgMostraResultadoEmTempoReal,
          },
        })
        .then(() => {
          this.props.loadMoreEntries(pageSelected * this.state.items_grid, this.state.items_grid);
        })
        .catch(() => {
          this.msg.error('Erro ao realizar a operação');
        });
    };

    const botaoResultado = (codVotacao) => {
      const link = `/votacao/resultado/${codVotacao}`;

      return (
        <Link to={link}>
          <RaisedButton label="Resultado">
            <i className="material-icons">assessment</i>
          </RaisedButton>
        </Link>
      );
    };

    const botaoInicia = (
      <span>
        <RaisedButton onClick={handleInicia} label="Inicia">
          <i
            className="material-icons"
            style={{
              color: 'blue',
            }}
          >
            schedule
          </i>
        </RaisedButton>
      </span>
    );

    const botaoFinaliza = (
      <span>
        <RaisedButton onClick={handleFinaliza} label="Finaliza">
          <i
            className="material-icons"
            style={{
              color: 'red',
            }}
          >
            schedule
          </i>
        </RaisedButton>
      </span>
    );

    const botaoMostraResultadoEmTempoReal = (flgMostraResultadoEmTempoReal) => {
      if (flgMostraResultadoEmTempoReal) {
        return (
          <span>
            <RaisedButton
              icon={<Lock />}
              onClick={handleMostraResultadoEmTempoReal}
              label="Esconde Resultados"
            />
          </span>
        );
      }
      return (
        <span>
          <RaisedButton
            icon={<LockOpen />}
            onClick={handleMostraResultadoEmTempoReal}
            label="Mostra Resultados"
          />
        </span>
      );
    };

    let mostraBotaoResultado = false;
    let mostraBotaoInicializa = false;
    let mostraBotaoFinaliza = false;

    // if (row.flgMostraResultadoEmTempoReal || row.datFimVotacao) {
    mostraBotaoResultado = true;
    // }

    if (!row.datInicioVotacao) {
      mostraBotaoInicializa = true;
    }

    if (row.datInicioVotacao && !row.datFimVotacao) {
      mostraBotaoFinaliza = true;
    }

    return (
      <span>
        {mostraBotaoResultado ? botaoResultado(row.codVotacao) : null}
        {mostraBotaoInicializa ? botaoInicia : null}
        {mostraBotaoFinaliza ? botaoFinaliza : null}
        {botaoMostraResultadoEmTempoReal(row.flgMostraResultadoEmTempoReal)}
      </span>
    );
  };

  handlePageClick = ({ selected }) => {
    this.props.loadMoreEntries(selected * this.state.items_grid, this.state.items_grid);
  };

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    return (
      <div className="container">
        <div className="baseContent">
          <Grid
            colunas={this.colunas}
            rows={this.props.rows}
            apaga={this.apagaVotacao}
            items_grid={this.state.items_grid}
            setItensGrid={this.setItensGrid}
            buttonNovo="/votacao/nova"
            titulo="Votações"
            handlePageClick={this.handlePageClick}
            totalCount={this.props.totalCount}
            renderButtonsOneSelection={this.renderButtonsOneSelection}
            loading={this.props.loading}
          />
          <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
        </div>
      </div>
    );
  }
}

export default compose(
  MutationIniciaVotacao,
  MutationFinalizaVotacao,
  MutationApagaVotacao,
  MutationMostraResultadoEmTempoReal,
  QueryVotacaoList,
)(VotacaoList);
