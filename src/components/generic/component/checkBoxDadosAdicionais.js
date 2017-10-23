import React, { Component } from 'react';
import { compose } from 'react-apollo';
import ListArrayCheckbox from '../../generic/ListArray';

import MyLoader from '../myLoader';
import { QueryResultadoList } from '../../../graphql/allTbPjDadosadicionais';

class CheckBoxDadosAdicionais extends Component {
  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.data.allTbPjDadosadicionais) {
      let arrayData = this.props.data.allTbPjDadosadicionais.nodes.map(item => {
        return {
          key: item.codDadosAdicionais,
          value: item.tbDadosAdicionaiByCodDadosAdicionais.dscDadosAdicionais,
        };
      });

      return (
        <div>
          <ListArrayCheckbox name={this.props.name} arrayData={arrayData} />
        </div>
      );
    }

    return <div>Dados Adicionais não encontrados...</div>;
  }
}

export default compose(QueryResultadoList)(CheckBoxDadosAdicionais);
