import React, { Component } from 'react';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import Loader from 'halogen/PulseLoader';

import { compose } from 'react-apollo';

import { QueryResultadoList } from './compDadosAdicionaisGraph';

class CompDadosAdicionais extends Component {
  render() {
    let descricao = '';

    if (this.props.loading) {
      return <Loader color="#00BCD4" size="26px" margin="4px" />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    if (this.props.codPessoaJuridica) {
      descricao = this.props.data.allTbPjDadosadicionais.nodes.map((row) => {
        const arrDescricao = [];

        arrDescricao.push(
          <Paper>
            <ListItem
              leftCheckbox={
                <Checkbox
                  onCheck={() => this.props.handleCheck(row.codDadosAdicionais)}
                  checked={this.props.activeCheckboxes.includes(row.codDadosAdicionais)}
                />
              }
              primaryText={`${row.codDadosAdicionais} - ${row.tbDadosAdicionaiByCodDadosAdicionais
                .dscDadosAdicionais}`}
              secondaryText="Allow notifications"
            />
          </Paper>,
        );

        return arrDescricao;
      });
    }

    return (
      <List>
        <Subheader>Informações Adicionais</Subheader>
        {descricao}
      </List>
    );
  }
}

export default compose(QueryResultadoList)(CompDadosAdicionais);
