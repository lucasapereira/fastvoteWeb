import React from 'react';
import VotacaoList from './listVotacao';
import { getStorage } from '../../generic/storage';

const ListVotacaoScreen = (props) => {
  const codUsuarioRepresentacao = getStorage('cod_usuario_representacao');
  const codPessoa = getStorage('cod_pessoa');

  return (
    <div className="container">
      <div className="baseContent">
        <VotacaoList urep={codUsuarioRepresentacao} cod_pessoa={codPessoa} screenProps={props} />
      </div>
    </div>
  );
};

export default ListVotacaoScreen;
