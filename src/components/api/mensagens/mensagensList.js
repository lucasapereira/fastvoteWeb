import React, { Component } from 'react';
import { compose } from 'react-apollo';

import { Glyphicon } from 'react-bootstrap';

import Grid from '../../generic/grid';
import MyLoader from '../../generic/myLoader';

import { ListMensagemGraphql } from '../../../graphql/allTbMensagems';

class Formatter extends Component {
  render() {
    let icon = this.props.value ? (
      <Glyphicon glyph="ok" style={{ color: 'green' }} />
    ) : (
      <Glyphicon glyph="remove" style={{ color: 'red' }} />
    );

    return <div style={{ textAlign: 'center' }}>{icon}</div>;
  }
}

class MensagensList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items_grid: 5000,
    };
  }

  colunas = [
    {
      key: 'codMensagem',
      name: 'COD',
      filterable: true,
      sortable: true,
    },
    {
      key: 'codPessoaJuridica',
      name: 'CODPJ',
      filterable: true,
      sortable: true,
    },
    {
      key: 'titulo',
      name: 'Título',
      filterable: true,
      sortable: true,
    },
    {
      key: 'subtitulo',
      name: 'Subtitulo',
      filterable: true,
      sortable: true,
    },
    {
      key: 'mensagem',
      name: 'Mensagem',
      filterable: true,
      sortable: true,
    },

    {
      key: 'flgEnviaemail',
      name: 'MAIL',
      formatter: Formatter,
    },
    {
      key: 'flgEnviawebpush',
      name: 'WEB',
      formatter: Formatter,
    },
    {
      key: 'flgEnviaapppush',
      name: 'APP',
      formatter: Formatter,
    },

    {
      key: 'flgEnviado',
      name: 'Enviado',
      formatter: Formatter,
    },
    {
      key: 'flgErroEnvio',
      name: 'Err Envio',
      formatter: Formatter,
    },
  ];

  /*
  maskRowsUpdated = updated => {
    let newPeso = updated.vlrPeso;

    if (isNaN(newPeso)) {
      newPeso = 1;
    }

    return { vlrPeso: parseFloat(newPeso) };
  };

  renderButtonVariosSelection = selectedRows => {
    this.setUsuarioPodeVotar(selectedRows);

    const botaoSalvar = () => (
      <Row>
        <Col xs={12} sm={8} />
        <Col xs={12} sm={4}>
          <FlatButton
            onClick={this.handleAdd}
            icon={<Glyphicon glyph="plus" style={{ color: 'white' }} />}
            label="Adicionar Votação"
            labelStyle={{ color: 'white' }}
            fullWidth
            backgroundColor="#a4c639"
            hoverColor="#8AA62F"
          />
        </Col>
      </Row>
    );

    return <span>{botaoSalvar(selectedRows.codVotacao)}</span>;
  };

  renderButtonVariosSelectionDisabled = () => (
    <Row>
      <Col xs={12} sm={8} />
      <Col xs={12} sm={4}>
        <FlatButton
          icon={<Glyphicon glyph="plus" />}
          label="Adicionar Votação"
          fullWidth
          disabled
          backgroundColor="#E1E1E1"
        />
      </Col>
    </Row>
  );
  */

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    return (
      <Grid
        colunas={this.colunas}
        rows={this.props.rows}
        items_grid={this.state.items_grid}
        // renderButtonVariosSelection={this.props.renderButtonVariosSelection}
        loading={this.props.loading}
        // maskRowsUpdated={this.maskRowsUpdated}
        // renderButtonVariosSelectionDisabled={this.props.renderButtonVariosSelectionDisabled}
      />
    );
  }
}

export default compose(ListMensagemGraphql)(MensagensList);
