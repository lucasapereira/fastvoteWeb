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

  setCols = value => {
    //const selectedRows = this.state.selectedIndexes.map(index => filteredRows[index]);

    let arrColsReturn = [];

    const schemaCols = value.map(index => {
      if (this.arrayCols[index]) {
        arrColsReturn.push(this.arrayCols[index]);
      }
      return true;
    });

    return arrColsReturn;
  };

  maskRowsUpdated = updated => {
    let newPeso = updated.vlrPeso;

    if (isNaN(newPeso)) {
      newPeso = 1;
    }

    return { vlrPeso: parseFloat(newPeso) };
  };

  render() {
    if (this.props.showCols) {
      this.colunas = this.setCols(this.props.showCols);
    } else {
      this.colunas = this.arrayCols;
    }

    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    let arrayCheck = [];

    if (this.props.dadosAdicionais) {
      console.log(
        'DADOS ADD DENTRO:',
        this.props.dadosAdicionais.length,
        this.props.dadosAdicionais
      );

      arrayCheck = this.props.dadosAdicionais.map(item => console.log('ITEM DENTRO:', item));
    }

    /*
    let arrColsReturn = [];
    
        const schemaCols = value.map(index => {
          if (this.arrayCols[index]) {
            arrColsReturn.push(this.arrayCols[index]);
          }
          return true;
        });
    
        return arrColsReturn;
    */

    // console.log('EM UsuariosByDadosAdicionais - DadosAdicionais: ', this.props.dadosAdicionais);

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

export default compose(QueryResultadoList)(UsuariosByDadosAdicionais);
