import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Field } from 'redux-form';

import { required } from '../../generic/validations';
import { renderTextField } from '../../generic/forms/myTextField';

import MyLoader from '../../generic/myLoader';
import SimpleGrid from '../../generic/simpleGrid';

import { QueryResultadoList } from '../../../graphql/allUsuariosQuePodemVotar';

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

    console.log('array id checks users', arrayIdsCheck);
    console.log('array id checks users', this.state);

    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    /*
    const renderField = ({ input, type, itens }) => {
      console.log('HIDDEN', input.value);

      return (
        <div>
          <input {...input} type={type} value={itens} />
        </div>
      );
    };
    <Field name={this.props.name} type="text" itens={arrayIdsCheck} component={renderField} />
    */

    /*
  <Field
          name={this.props.name}
          component={renderTextField}
          label="arr users"
          validate={[required]}
          fullWidth

          // material UI
          //value={this.state.value}
          //onChange={this.handleChange}
        />
         */
    return (
      <div>
        <Field
          name={this.props.name}
          component="input"
          type="text"
          placeholder="Last Name"
          value={arrayIdsCheck}
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
