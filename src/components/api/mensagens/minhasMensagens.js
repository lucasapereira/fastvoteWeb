import React, { Component } from 'react';

import FlatButton from 'material-ui/FlatButton';
import { Row, Col, Glyphicon } from 'react-bootstrap';

import Grid from '../../generic/grid';
import MyLoader from '../../generic/myLoader';

class MinhasMensagens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items_grid: 5000,
    };
  }

  colunas = [
    {
      key: 'titulo',
      name: 'Título',
      filterable: true,
      sortable: true,
      resizable: true,
    },
    {
      key: 'subtitulo',
      name: 'Subtitulo',
      filterable: true,
      sortable: true,
      resizable: true,
    },
    {
      key: 'mensagem',
      name: 'Mensagem',
      filterable: true,
      sortable: true,
      resizable: true,
    },
    {
      key: 'datEnvio',
      name: 'Envio',
      filterable: true,
      sortable: true,
      resizable: true,
    },
  ];

  renderButtonVariosSelection = selectedRows => {
    if (this.props.setMensagensSelected) {
      this.props.setMensagensSelected(selectedRows);
    }

    return (
      <Row>
        <Col xs={12} sm={8} />
        <Col xs={12} sm={4}>
          <FlatButton
            onClick={this.props.delMensagem}
            icon={<Glyphicon glyph="remove" style={{ color: 'red' }} />}
            label="Excluir Selecionadas"
            labelStyle={{ color: 'red' }}
            fullWidth
          />
        </Col>
      </Row>
    );
  };

  renderButtonVariosSelectionDisabled = () => {
    return (
      <Row>
        <Col xs={12} sm={8} />
        <Col xs={12} sm={4}>
          <FlatButton
            icon={<Glyphicon glyph="remove" />}
            label="Excluir Selecionadas"
            fullWidth
            disabled
          />
        </Col>
      </Row>
    );
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
        <Grid
          colunas={this.colunas}
          rows={this.props.rows}
          loading={this.props.loading}
          items_grid={this.state.items_grid}
          renderButtonVariosSelection={this.renderButtonVariosSelection}
          renderButtonVariosSelectionDisabled={this.renderButtonVariosSelectionDisabled}
        />
      </div>
    );
  }
}

export default MinhasMensagens;
