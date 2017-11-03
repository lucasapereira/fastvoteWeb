import React, { Component } from 'react';
import ListaUsuario from './listaUsuario';
import { getStorage } from '../../../components/generic/storage';

class ListaUsuarioScreen extends Component {
  render() {
    return (
      <div className="container">
        <ListaUsuario codPessoaJuridica={getStorage('cod_pessoa_juridica')} />
      </div>
    );
  }
}

export default ListaUsuarioScreen;
