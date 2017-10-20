import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { QueryAlTbVotos } from '../../../graphql/allTbVotos';
import MyLoader from '../../generic/myLoader';

class QtdVotos extends Component {
  render = () => {
    if (this.props.data.error) {
      return <div>Houve um erro. Tente novamente.</div>;
    }
    if (this.props.data.loading) {
      return <MyLoader />;
    }

    let qtdVotos = this.props.data.allTbVotos.totalCount;

    return <spam>Quantidade de votos: {qtdVotos}</spam>;
  };
}

export default compose(QueryAlTbVotos)(QtdVotos);
