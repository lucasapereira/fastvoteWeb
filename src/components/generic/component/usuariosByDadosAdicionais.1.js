import React, { Component } from 'react';
import { compose } from 'react-apollo';

import { Field } from 'redux-form';
import { ReactDataGrid } from 'react-data-grid';

// import Grid from '../../generic/grid';
import MyLoader from '../../generic/myLoader';

import { QueryResultadoList } from '../../../graphql/allUsuariosQuePodemVotar';

// const { Toolbar, Data: { Selectors } } = require('react-data-grid-addons');
// const EmptyRowsView = () => <div>Não foi encontrado nenhum registro.</div>;

class UsuariosByDadosAdicionais extends Component {
  constructor(props) {
    super(props);

    this._columns = [
      {
        key: 'id',
        name: 'ID',
      },
      {
        key: 'title',
        name: 'Title',
      },
      {
        key: 'count',
        name: 'Count',
      },
    ];

    let rows = [];
    for (let i = 1; i < 1000; i++) {
      rows.push({
        id: i,
        title: 'Title ' + i,
        count: i * 1000,
      });
    }
    this.state = { rows, selectedIndexes: [] };
    /*
    this.state = {
      items_grid: 5000,
      selectedIndexes: [],
      rows: [],
    };
    */
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

  rowGetter = i => {
    return this.state.rows[i];
  };

  onRowsSelected = rows => {
    this.setState({ selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx)) });
  };

  onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    this.setState({
      selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1),
    });
  };

  // getRows = () => Selectors.getRows(this.state);

  render() {
    const rowText = this.state.selectedIndexes.length === 1 ? 'row' : 'rows';

    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    //   console.log('ROOOOOOOOWS', this.props.name);
    /*
    console.log('ROWS: ', this.props.rows);
    console.log('PROPS: ', this.props);
    console.log('activeCheckboxes', this.props.activeCheckboxes);
    */
    /*
    const renderField = ({ input, label, type }) => (
      <div>
        <label>{label}</label>
        <div>
          <input {...input} type={type} />
        </div>
      </div>
    );

    <Field
    name={this.props.name}
    type="text"
    component={renderField}
    label="label text input"
  />
  */
    return (
      <div>
        <span>
          {this.state.selectedIndexes.length} {rowText} selected
        </span>
        <ReactDataGrid
          rowKey="id"
          columns={this._columns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={500}
          rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected: this.onRowsSelected,
            onRowsDeselected: this.onRowsDeselected,
            selectBy: {
              indexes: this.state.selectedIndexes,
            },
          }}
        />
        );
      </div>
    );
  }
}

/*

<ReactDataGrid
          columns={this.arrayCols}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={500}
        />


<Grid
          colunas={this.arrayCols}
          rows={this.setRows(this.props.rows)}
          items_grid={this.state.items_grid}
          loading={this.props.loading}
          // renderButtonVariosSelection={this.props.renderButtonVariosSelection}
          // renderButtonVariosSelectionDisabled={this.props.renderButtonVariosSelectionDisabled}
        />
*/

export default compose(QueryResultadoList)(UsuariosByDadosAdicionais);
