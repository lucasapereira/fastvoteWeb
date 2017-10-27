import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';

import { compose } from 'react-apollo';
import { Field } from 'redux-form';

// import Grid from '../../generic/grid';
import MyLoader from '../../generic/myLoader';

import { QueryResultadoList } from '../../../graphql/allUsuariosQuePodemVotar';

// const { Toolbar, Data: { Selectors } } = require('react-data-grid-addons');
// const EmptyRowsView = () => <div>Não foi encontrado nenhum registro.</div>;

class UsuariosByDadosAdicionais extends Component {
  constructor(props) {
    super(props);

    /*this._columns = [
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
    ];*/

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

    console.log('PROOOOOPS', this.props);
    this.state = { rows, selectedIndexes: [] };
  }

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

  /*
  if (checkDadosAdicionais) {
      checkDadosAdicionais.map((value, key) => {
        if (!value) {
          arrayCheck.filter(x => x !== key);
        } else {
          arrayCheck = [...arrayCheck, key];
        }
      });
    }
  */

  onRowsSelected = rows => {
    console.log('selected ITEM', rows[0].row.id);

    // let selectedItem = this.state.selectedIndexes.concat(rows[0].row.id);
    /*let selectedItem = this.state.selectedIndexes.concat(
      rows.map(r => {
        console.log('AAA SIM', r.row.id);
        return r.row.id; //r.rowIdx;
      })
    );*/
    let selectedItem = [];

    this.state.selectedIndexes.map((value, key) => {
      console.log('MAP ARRAY SELECTED', value, key);
      /*
      if (!value) {
        arrayCheck.filter(x => x !== key);
      } else {
        arrayCheck = [...arrayCheck, key];
      }
      */
    });

    console.log('selected ARRAY', selectedItem);

    this.setState({ selectedIndexes: selectedItem });
  };

  onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    this.setState({
      selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1),
    });
  };

  render() {
    const rowText = this.state.selectedIndexes.length === 1 ? 'row' : 'rows';

    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    const renderField = ({ input, label, type, itens }) => (
      <div>
        <label>{label}</label>
        <div>
          <input {...input} type={type} value={itens} />
        </div>
      </div>
    );

    return (
      <div>
        <Field
          name={this.props.name}
          type="text"
          itens={this.state.selectedIndexes.length}
          component={renderField}
          label="label text input"
        />
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
      </div>
    );
  }
}

export default compose(QueryResultadoList)(UsuariosByDadosAdicionais);
