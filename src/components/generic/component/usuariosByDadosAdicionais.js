import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Field } from 'redux-form';

import MyLoader from '../../generic/myLoader';
import SimpleGrid from '../../generic/simpleGrid';

import { QueryResultadoList } from '../../../graphql/allUsuariosQuePodemVotar';

class UsuariosByDadosAdicionais extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndexes: [] };
  }

  setSelectedIndexes = selectedIndexes => {
    let arrayIdsCheck = [];

    if (selectedIndexes.length) {
      selectedIndexes.map(index => {
        arrayIdsCheck.push(this.props.rows[index].id);
      });
    }
    this.setState({
      selectedIndexes,
    });

    this.props.setSelectedIndexes(arrayIdsCheck);
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
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
      <div>
        <label>{label}</label>
        <div>
          <input {...input} placeholder={label} type={type} />
          {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
      </div>
    );

    return (
      <div>
        <Field
          name={this.props.name}
          type="hidden"
          component={renderField}
          validate={this.props.validate}
        />

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

export default compose(QueryResultadoList)(UsuariosByDadosAdicionais);
