import React, { Component } from 'react';

import { compose } from 'react-apollo';
import Loader from 'halogen/PulseLoader';
import UsuarioVotacao from './usuarioVotacao';
import { QueryVotacaoList } from './listVotacaoGraphql';

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
      return <Loader color="#00BCD4" size="16px" margin="4px" />;
    }

    return (
      <div>
        {this.renderVotacoes()}
      </div>
    );
  };
}

export default compose(QueryVotacaoList)(VotacaoList);
