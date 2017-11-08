import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { getStorage } from '../components/generic/storage';

const mutationApaga = gql`
  mutation updateTbMsgUsuarioByCodMensagemAndCodUsuario(
    $codmensagem: Int!
    $codUsuarioRepresentacao: Int!
  ) {
    updateTbMsgUsuarioByCodMensagemAndCodUsuario(
      input: {
        codMensagem: $codmensagem
        codUsuarioRepresentacao: $codUsuarioRepresentacao
        tbMsgUsuarioPatch: { flgDelete: true }
      }
    ) {
      clientMutationId
    }
  }
`;

const mutationApagaOptions = {
  name: 'apaga',
  options(props) {
    return {
      variables: {
        codmensagem: props.codmensagem,
        codUsuarioRepresentacao: getStorage('cod_usuario_representacao'),
      },
    };
  },
};

export const ApagaMensagemGraphql = graphql(mutationApaga, mutationApagaOptions);
