import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';

import { Link } from 'react-router-dom';
import { compose } from 'react-apollo';
import axios from 'axios';
import Checkbox from 'material-ui/Checkbox';

import AlertContainer from 'react-alert';
import { Row, Col, Glyphicon, Modal, Button } from 'react-bootstrap';

import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import areIntlLocalesSupported from 'intl-locales-supported';

import Grid from '../../generic/grid';
import { authOptions } from '../../generic/myAxios';
import MyLoader from '../../generic/myLoader';
import { getStorage } from '../../generic/storage';

import {
  QueryVotacaoList,
  MutationInicializaFinalizaVotacao,
  MutationApagaVotacao,
  MutationMostraResultadoEmTempoReal,
} from '../../../graphql/votacao';

let DateTimeFormat;

/**
 * Use the native Intl.DateTimeFormat if available, or a polyfill if not.
 */
if (areIntlLocalesSupported(['pt', 'pt-BR'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/pt');
  require('intl/locale-data/jsonp/pt-BR');
}

class VotacaoList extends Component {
  constructor(props) {
    super(props);
    const newDateObj = new Date();

    const dateAcao = new Date(newDateObj.getTime() + 1 * 60000);

    this.state = {
      items_grid: 20,
      showModalFinaliza: false,
      showModalInicializa: false,
      checkedAppPush: true,
      checkedWebPush: true,
      checkedEmail: true,
      agindo: false,

      dateAcao,
    };
  }

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
          onClick={() => showModal(true)}
          icon={<Glyphicon glyph="time" style={{ color: 'green' }} />}
          label="Inicia"
          fullWidth
          // backgroundColor="#a4c639"
          // hoverColor="#8AA62F"
        />
      </span>
    );

    const showModal = isInicio => {
      const newDateObj = new Date();
      const minDate = new Date(newDateObj.getTime() + 1 * 60000);
      const dateAcao = new Date(newDateObj.getTime() + 1 * 60000);
      this.setState({
        showModalFinaliza: !isInicio,
        showModalInicializa: isInicio,
        minDate,
        dateAcao,
        selectedRow: row,
        selectedPage: pageSelected,
      });
    };

    const botaoFinaliza = (
      <span>
        <FlatButton
          onClick={() => showModal(false)}
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

  isMenorQueAgora = (event, time) => {
    if (this.state.minDateFinalizacao.getTime() >= time.getTime()) {
      this.msg.error('Data de finalização deve ser maior que a hora atual.');

      this.setState({
        dateFinalizacao: this.state.minDateFinalizacao,
      });
    } else {
      this.setState({
        dateFinalizacao: time,
      });
    }
  };

  closeModal = () => {
    this.setState({
      showModalFinaliza: false,
      showModalInicializa: false,
    });
  };

  handleInicializaFinaliza = () => {
    this.setState({
      agindo: true,
    });
    const tzoffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = new Date(this.state.dateAcao - tzoffset).toISOString().slice(0, -1);

    let title = '';
    let subtitle = '';
    let body = '';

    if (this.state.showModalInicializa) {
      title = 'Inicio da votação';
      subtitle = 'Inicio da votação';
      body = 'Inicio da votação';
    } else {
      title = 'Fim da votação';
      subtitle = 'Fim da votação';
      body = 'Fim da votação';
    }

    this.props
      .inicializaFinalizaVotacao({
        variables: {
          codVotacao: this.state.selectedRow.codVotacao,
          datiniciofimvotacao: localISOTime,
          apppush: this.state.checkedAppPush,
          webpush: this.state.checkedWebPush,
          email: this.state.checkedEmail,
          isinicio: this.state.showModalInicializa,
          title,
          subtitle,
          body,
          codpessoajuridica: getStorage('cod_pessoa_juridica'),
        },
      })
      .then(() => {
        this.props.loadMoreEntries(
          this.state.pageSelected * this.state.items_grid,
          this.state.items_grid
        );

        this.setState({
          agindo: false,
        });
        this.closeModal();
      })
      .catch(e => {
        console.log(e);
        this.msg.error('Erro ao realizar a operação');
      });
  };

  updateCheckAppPush = (event, test) => {
    this.setState({
      checkedAppPush: test,
    });
  };
  updateCheckWebPush = (event, test) => {
    this.setState({
      checkedWebPush: test,
    });
  };
  updateCheckEmail = (event, test) => {
    this.setState({
      checkedEmail: test,
    });
  };

  renderModal = () => {
    if (this.props.loading || this.state.agindo) {
      return <MyLoader />;
    }

    return (
      <Modal
        show={this.state.showModalFinaliza || this.state.showModalInicializa}
        onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">
            {this.state.showModalInicializa ? 'Inicializa Votação' : 'Finaliza Votação'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePicker
            hintText="Dia"
            DateTimeFormat={DateTimeFormat}
            locale="pt-br"
            minDate={this.state.minDate}
            value={this.state.dateAcao}
            onChange={this.isMenorQueAgora}
          />
          <TimePicker
            format="24hr"
            hintText="Hora"
            onChange={this.isMenorQueAgora}
            value={this.state.dateAcao}
          />
          <Checkbox
            label="App Push"
            checked={this.state.checkedAppPush}
            onCheck={this.updateCheckAppPush}
          />
          <Checkbox
            label="Web Push"
            checked={this.state.checkedWebPush}
            onCheck={this.updateCheckWebPush}
          />
          <Checkbox
            label="E-mail"
            checked={this.state.checkedEmail}
            onCheck={this.updateCheckEmail}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeModal}>Fechar</Button>
          <Button onClick={this.handleInicializaFinaliza}>
            {this.state.showModalInicializa ? 'Inicializa' : 'Finaliza'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
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
          {this.renderModal()}
          <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
        </div>
      </div>
    );
  }
}

export default compose(
  MutationInicializaFinalizaVotacao,
  MutationApagaVotacao,
  MutationMostraResultadoEmTempoReal,
  QueryVotacaoList
)(VotacaoList);
