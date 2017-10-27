import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';

import { compose } from 'react-apollo';
import { Field } from 'redux-form';

import MyLoader from '../../generic/myLoader';
import SimpleGrid from '../../generic/simpleGrid';

import { QueryResultadoList } from '../../../graphql/allUsuariosQuePodemVotar';

// const { Toolbar, Data: { Selectors } } = require('react-data-grid-addons');
// const EmptyRowsView = () => <div>Não foi encontrado nenhum registro.</div>;

class UsuariosByDadosAdicionais extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndexes: [] };
  }

  setSelectedIndexes = selectedIndexes => {
    this.setState({
      selectedIndexes,
    });
  };

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

  render() {
    let arrayIdsCheck = [];

    if (this.state.selectedIndexes.length) {
      this.state.selectedIndexes.map(index => {
        arrayIdsCheck.push(this.props.rows[index].id);
      });
    }

    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    const renderField = ({ input, type, itens }) => (
      <div>
        <input {...input} type={type} value={itens} />
      </div>
    );

    return (
      <div>
        <Field name={this.props.name} type="text" itens={arrayIdsCheck} component={renderField} />
        <SimpleGrid
          rowKey="id"
          columns={this.arrayCols}
          selectedIndexes={this.state.selectedIndexes}
          setSelectedIndexes={this.setSelectedIndexes}
          rows={this.setRows(this.props.rows)}
        />
      </div>
    );
  }
}

/*
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
         */
export default compose(QueryResultadoList)(UsuariosByDadosAdicionais);
