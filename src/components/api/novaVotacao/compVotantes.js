import React, { Component } from 'react';
import Grid from '../../generic/grid';
import MyLoader from '../../generic/myLoader';

import { compose } from 'react-apollo';

import { QueryResultadoList } from './compVotantesGraph';

class CompVotantes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items_grid: 5000,
    };
  }

  state: {
    items_grid: number,
  };

  colunas = [
    {
      key: 'codUsuario',
      name: 'Cod',
      filterable: true,
      sortable: true,
    },
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

  /*
- colocar interrogacoes com instrucoes de preenchimento dos campos
- arrumar paginatio para qd na aparece
*/

  maskRowsUpdated = (updated) => {
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
