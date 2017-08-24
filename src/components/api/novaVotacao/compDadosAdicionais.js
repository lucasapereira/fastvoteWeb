import React, { Component } from 'react';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';

import { compose } from 'react-apollo';

import { QueryResultadoList } from './compDadosAdicionaisGraph';

import MyLoader from '../../generic/myLoader';

class CompDadosAdicionais extends Component {
  render() {
    let descricao = '';

    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro!!!</div>;
    }

    if (this.props.data && this.props.data.allTbPjDadosadicionais) {
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
