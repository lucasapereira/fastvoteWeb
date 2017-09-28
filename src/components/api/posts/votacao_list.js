import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';

import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';
import axios from 'axios';
import Grid from '../../generic/grid';
import { authOptions } from '../../generic/myAxios';
import MyLoader from '../../generic/myLoader';
import AlertContainer from 'react-alert';
import { Row, Col, Glyphicon } from 'react-bootstrap';

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
      authOptions()
    );

  apagaVotacao = async (cols, pageSelected) => {
    try {
      await cols.map(async row => {
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

    const botaoResultado = codVotacao => {
      const link = `/frontend/votacao/resultado/${codVotacao}`;

      return (
        <Link to={link}>
          <FlatButton
            icon={<Glyphicon glyph="stats" />}
            label="Resultado"
            fullWidth
            // backgroundColor="#a4c639"
            // hoverColor="#8AA62F"
          />
        </Link>
      );
    };

    const botaoInicia = (
      <span>
        <FlatButton
          onClick={handleInicia}
          icon={<Glyphicon glyph="time" style={{ color: 'green' }} />}
          label="Inicia"
          fullWidth
          // backgroundColor="#a4c639"
          // hoverColor="#8AA62F"
        />
      </span>
    );

    const botaoFinaliza = (
      <span>
        <FlatButton
          onClick={handleFinaliza}
          icon={<Glyphicon glyph="time" style={{ color: 'red' }} />}
          label="Finaliza"
          fullWidth
          // backgroundColor="#a4c639"
          // hoverColor="#8AA62F"
        />
      </span>
    );

    const botaoMostraResultadoEmTempoReal = flgMostraResultadoEmTempoReal => {
      let label = 'Mostra Resultados';
      let icon = 'eye-open';

      if (flgMostraResultadoEmTempoReal) {
        label = 'Esconde Resultados';
        icon = 'eye-close';
      }

      return (
        <span>
          <FlatButton
            onClick={handleMostraResultadoEmTempoReal}
            icon={<Glyphicon glyph={icon} />}
            label={label}
            fullWidth
            // backgroundColor="#a4c639"
            // hoverColor="#8AA62F"
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
      <div className="divGridButtons2">
        <Row>
          <Col xs={12} sm={4}>
            {mostraBotaoResultado ? botaoResultado(row.codVotacao) : null}
          </Col>
          <Col xs={12} sm={4}>
            {mostraBotaoInicializa ? botaoInicia : null}
            {mostraBotaoFinaliza ? botaoFinaliza : null}
          </Col>
          <Col xs={12} sm={4}>
            {botaoMostraResultadoEmTempoReal(row.flgMostraResultadoEmTempoReal)}
          </Col>
        </Row>
      </div>
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
        <div className="baseContentWhite">
          <div className="pageTitle">Votações Cadastradas</div>
          <Grid
            colunas={this.colunas}
            rows={this.props.rows}
            apaga={this.apagaVotacao}
            items_grid={this.state.items_grid}
            setItensGrid={this.setItensGrid}
            buttonNovo="/frontend/votacao/nova"
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
  QueryVotacaoList
)(VotacaoList);
