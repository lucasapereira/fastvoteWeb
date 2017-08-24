import React, { Component } from 'react';

import { compose } from 'react-apollo';
import UsuarioVotacao from './usuarioVotacao';
import { QueryVotacaoList } from './listVotacaoGraphql';

import MyLoader from '../../generic/myLoader';

class VotacaoList extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.location.reload) {
      this.props.refetch();
    }
  }

  renderVotacoes = () =>
    this.props.rows.map(votacao =>
      <UsuarioVotacao votacao={votacao} urep={this.props.urep} refetchLista={this.props.refetch} />,
    );

  render = () => {
    if (this.props.loading) {
      return <MyLoader />;
    }

    return (
      <div>
        {this.renderVotacoes()}
      </div>
    );
  };
}

export default compose(QueryVotacaoList)(VotacaoList);
