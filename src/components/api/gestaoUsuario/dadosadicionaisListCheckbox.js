import React from 'react';
import { compose } from 'react-apollo';
import { ListCheckbox } from '../../generic/List';

import MyLoader from '../../generic/myLoader';
import { QueryResultadoList } from '../novaVotacao/compDadosAdicionaisGraph';

class DadosAdicionaisListCheckBox extends React.Component {
  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.data.allTbPjDadosadicionais) {
      const array = this.props.data.allTbPjDadosadicionais.nodes.map(item => {
        return {
          key: item.codDadosAdicionais,
          value: item.tbDadosAdicionaiByCodDadosAdicionais.dscDadosAdicionais,
        };
      });
      return <div>{ListCheckbox(array)}</div>;
    }
    return <div>allTbPjDadosadicionais</div>;
  }
}

export default compose(QueryResultadoList)(DadosAdicionaisListCheckBox);
