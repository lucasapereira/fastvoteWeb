import React, { Component } from 'react';
import Subheader from 'material-ui/Subheader';
import Loader from 'halogen/PulseLoader';
import Grid from '../../generic/grid';

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

  maskRowsUpdated = (updated) => {
    let newPeso = updated.vlrPeso;

    if (isNaN(newPeso)) {
      newPeso = 1;
    }

    return { vlrPeso: parseFloat(newPeso) };
  };

  render() {
    if (this.props.loading) {
      return <Loader color="#00BCD4" size="26px" margin="4px" />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    return (
      <div>
        <Subheader>Usuários Disponíveis para Votação</Subheader>
        <Grid
          colunas={this.colunas}
          rows={this.props.rows}
          items_grid={this.state.items_grid}
          titulo="Usuários que podem votar"
          renderButtonVariosSelection={this.props.renderButtonVariosSelection}
          loading={this.props.loading}
          maskRowsUpdated={this.maskRowsUpdated}
        />
      </div>
    );
  }
}

export default compose(QueryResultadoList)(CompVotantes);
