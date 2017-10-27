import React, { Component } from 'react';
import { compose } from 'react-apollo';
import Grid from '../../generic/grid';
import MyLoader from '../../generic/myLoader';

import { QueryResultadoList } from '../../../graphql/allUsuariosQuePodemVotar';

class UsuariosByDadosAdicionais extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items_grid: 5000,
    };
  }

  arrayCols = [
    {
      key: 'nomcompletopessoa',
      name: 'Nome Usuário',
      filterable: true,
      sortable: true,
    },
    {
      key: 'dadosadicionaisstr',
      name: 'Dados Adicionais',
      filterable: true,
      sortable: true,
    },
  ];

  setRows = arrayDataRows => {
    let arrayReturn = [];
    let strDadosAdicionais = '';

    if (arrayDataRows) {
      arrayReturn = arrayDataRows.map(index => {
        strDadosAdicionais = index.dadosAdicionais.map(item => {
          return item.split(';')[1] + ', ';
        });

        return {
          id: index.id,
          nomcompletopessoa: index.nomcompletopessoa,
          // vlrpeso: index.vlrpeso,
          dadosadicionaisstr: strDadosAdicionais,
        };
      });
    }

    return arrayReturn;
  };

  // https://github.com/adazzle/react-data-grid/issues/744
  // http://adazzle.github.io/react-data-grid/examples.html#/row-select
  // https://jsfiddle.net/f6mbnb8z/5/

  // http://react-redux-grid.herokuapp.com/

  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    console.log('ROWS: ', this.props.rows);
    console.log('PROPS: ', this.props);
    console.log('activeCheckboxes', this.props.activeCheckboxes);

    /*
    onRowsSelected(rows) {
      this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))});
    },
    
    onRowsDeselected(rows) {
      let rowIndexes = rows.map(r => r.rowIdx);
      this.setState({selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 )});
    },
    */

    return (
      <Grid
        colunas={this.arrayCols}
        rows={this.setRows(this.props.rows)}
        items_grid={this.state.items_grid}
        loading={this.props.loading}
        // renderButtonVariosSelection={this.props.renderButtonVariosSelection}
        // renderButtonVariosSelectionDisabled={this.props.renderButtonVariosSelectionDisabled}
      />
    );
  }
}

export default compose(QueryResultadoList)(UsuariosByDadosAdicionais);
