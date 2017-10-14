import React, { Component } from 'react';
import AlertContainer from 'react-alert';
import { compose } from 'react-apollo';
import MyLoader from '../../generic/myLoader';
import Grid from '../../generic/grid';
import { QueryResultadoList } from '../novaVotacao/compVotantesGraph';

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
      editable: true,
    },
  ];
  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    return (
      <div className="gridUsuarios">
        <Grid
          colunas={this.colunas}
          rows={this.props.rows}
          items_grid={this.state.items_grid}
          renderButtonVariosSelection={this.props.renderButtonVariosSelection}
          loading={this.props.loading}
          maskRowsUpdated={this.maskRowsUpdated}
          renderButtonVariosSelectionDisabled={this.props.renderButtonVariosSelectionDisabled}
        />
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
      </div>
    );
  }
}

export default compose(QueryResultadoList)(ListaUsuario);
