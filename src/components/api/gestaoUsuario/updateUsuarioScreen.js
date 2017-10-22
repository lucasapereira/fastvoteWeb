import React, { Component } from 'react';
import { compose } from 'react-apollo';
import MaterialUiForm from './formNovoUsuario';
import MyLoader from '../../generic/myLoader';
import { QueryResultadoList } from '../../../graphql/allUsuariosQuePodemVotar';
import { checkBoxToScreen } from '../../generic/List';

class UpdateUsuarioScreen extends Component {
  render() {
    if (this.props.loading) {
      return <MyLoader />;
    }

    if (this.props.error) {
      return <div>Erro: {this.props.error.message}</div>;
    }

    const initialValues = checkBoxToScreen(this.props.rows[0], this.props.rows[0].dadosAdicionais);

    return <MaterialUiForm initialValues={initialValues} />;
  }
}

export default compose(QueryResultadoList)(UpdateUsuarioScreen);
