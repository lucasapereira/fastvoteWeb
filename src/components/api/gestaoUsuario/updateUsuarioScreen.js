import React, { Component } from 'react';
import { compose } from 'react-apollo';
import MaterialUiForm from './formNovoUsuario';
import MyLoader from '../../generic/myLoader';
import { QueryResultadoList } from '../../../graphql/allUsuariosQuePodemVotar';

class UpdateUsuarioScreen extends Component {
  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro: {this.props.error.message}</div>;
    }
    console.log(this.props);
    console.log(this.props.rows[0]);
    return <MaterialUiForm initialValues={this.props.rows[0]} />;
  }
}

export default compose(QueryResultadoList)(UpdateUsuarioScreen);
