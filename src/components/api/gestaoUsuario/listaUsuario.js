import React, { Component } from 'react';
import AlertContainer from 'react-alert';
import { compose } from 'react-apollo';
import { Row, Col, Glyphicon, Modal, Button } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import MyLoader from '../../generic/myLoader';
import Grid from '../../generic/grid';
import { QueryResultadoList } from '../novaVotacao/compVotantesGraph';
import { MutationApaga } from './listaUsuarioGraphQl';
import { getStorage } from '../../generic/storage';
class ListaUsuario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items_grid: 5000,
    };
  }
  colunas = [
    {
      key: 'nomCompletoPessoa',
      name: 'Nome Usuário',
      filterable: true,
      sortable: true,
    },
    {
      key: 'vlrPeso',
      name: 'Peso',
      filterable: true,
      sortable: true,
      editable: false,
    },
    {
      key: 'numTelefone',
      name: 'Telefone',
      filterable: true,
      sortable: false,
    },
    {
      key: 'dscEmail',
      name: 'E-mail',
      filterable: true,
      sortable: true,
      editable: false,
    },
    {
      key: 'dadosAdicionais',
      name: 'Dados Adicionais',
      filterable: true,
      sortable: true,
      editable: false,
    },
  ];

  apagaVotacao = async (cols, pageSelected) => {
    try {
      await cols.map(async row => {
        await this.props.apaga({
          variables: {
            codUsuarioRepresentacao: row,
          },
        });
        await this.props.loadMoreEntries(
          this.props.codPessoaJuridica,
          null,
          pageSelected * this.state.items_grid,
          this.state.items_grid
        );
      });
    } catch (e) {
      this.msg.error('Erro ao realizar a operação');
    }
  };

  renderButtonsOneSelection = (row, pageSelected) => {
    const botaoAtualiza = codUsuarioRepresentacao => {
      const link = `/frontend/gestaoUsuario/updateUsuario/${codUsuarioRepresentacao}`;

      return (
        <Link to={link}>
          <FlatButton
            icon={<Glyphicon glyph="pencil" />}
            label="Atualiza"
            fullWidth
            // backgroundColor="#a4c639"
            // hoverColor="#8AA62F"
          />
        </Link>
      );
    };

    return (
      <div className="divGridButtons2">
        <Row>
          <Col xs={12} sm={4}>
            {botaoAtualiza(row.codUsuarioRepresentacao)}
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

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    return (
      <div className="divContainerGridUsuarios">
        <Row>
          <Col xs={12}>
            <div className="pageTitle">Gestão de Usuários</div>
          </Col>
        </Row>
        <div className="divisor" />
        <Row>
          <Col xs={12}>
            <Grid
              colunas={this.colunas}
              rows={this.props.rows}
              items_grid={this.state.items_grid}
              buttonNovo="/frontend/gestaoUsuario/novoUsuario"
              renderButtonVariosSelection={this.state.renderButtonVariosSelection}
              loading={this.props.loading}
              maskRowsUpdated={this.maskRowsUpdated}
              renderButtonVariosSelectionDisabled={this.props.renderButtonVariosSelectionDisabled}
              apaga={this.apagaVotacao}
              renderButtonsOneSelection={this.renderButtonsOneSelection}
            />
            <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default compose(QueryResultadoList, MutationApaga)(ListaUsuario);
