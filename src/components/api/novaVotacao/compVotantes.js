import React, { Component } from 'react';
import { compose } from 'react-apollo';
import Grid from '../../generic/grid';
import MyLoader from '../../generic/myLoader';

import { QueryResultadoList } from './compVotantesGraph';

class CompVotantes extends Component {
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
      editable: true,
    },
  ];

  maskRowsUpdated = updated => {
    let newPeso = updated.vlrPeso;

    if (isNaN(newPeso)) {
      newPeso = 1;
    }

    return { vlrPeso: parseFloat(newPeso) };
  };

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
        renderButtonVariosSelection={this.props.renderButtonVariosSelection}
        loading={this.props.loading}
        maskRowsUpdated={this.maskRowsUpdated}
        renderButtonVariosSelectionDisabled={this.props.renderButtonVariosSelectionDisabled}
      />
    );
  }
}

export default compose(QueryResultadoList)(CompVotantes);
