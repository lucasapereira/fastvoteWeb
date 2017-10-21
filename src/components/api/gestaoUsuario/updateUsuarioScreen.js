import React, { Component } from 'react';
import { compose } from 'react-apollo';
import MaterialUiForm from './formNovoUsuario';
import { QueryResultadoList } from '../../../graphql/allUsuariosQuePodemVotar';
import { getStorage } from '../../generic/storage';

class UpdateUsuarioScreen extends Component {
  render() {
    return <MaterialUiForm />;
  }
}

export default compose(QueryResultadoList)(UpdateUsuarioScreen);
