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

    let styleVotos = qtdVotos
      ? { color: '#000000', fontSize: '120%' }
      : { color: '#c0c0c0', fontSize: '120%' };

    return (
      <span>
        Votos: <span style={styleVotos}>{qtdVotos}</span>
      </span>
    );
  };
}

export default compose(QueryAlTbVotos)(QtdVotos);
