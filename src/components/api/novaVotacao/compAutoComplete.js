import React, { Component } from 'react';
import Loader from 'halogen/PulseLoader';
import AutoComplete from 'material-ui/AutoComplete';
import { compose } from 'react-apollo';

import { QueryResultadoList } from './compAutoCompleteGraph';

const dataSourceConfig = {
  text: 'nomPessoaJuridica',
  value: 'codPessoaJuridica',
  key: 'codPessoaJuridica',
};

class CompAutoComplete extends Component {
  handleUpdateInput = (textoDigitado) => {
    this.props.loadMoreEntries(textoDigitado);
  };

  render() {
    if (this.props.loading) {
      return <Loader color="#00BCD4" size="26px" margin="4px" />;
    }

    if (this.props.error) {
      return <div>Erro</div>;
    }

    let dataSource = [];

    if (this.props.allEmpresasPorNome.nodes) {
      dataSource = this.props.allEmpresasPorNome.nodes;
    }
    return (
      <div>
        <AutoComplete
          hintText="Digite o nome da empresa"
          dataSourceConfig={dataSourceConfig}
          dataSource={dataSource}
          onUpdateInput={this.handleUpdateInput}
          floatingLabelText="Digite o nome da empresa"
          onNewRequest={this.props.setPessoaJuridica}
          errorText={this.props.errorMessage}
        />
      </div>
    );
  }
}

export default compose(QueryResultadoList)(CompAutoComplete);
