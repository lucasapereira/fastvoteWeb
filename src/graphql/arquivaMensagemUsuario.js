import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { getStorage } from '../components/generic/storage';

const mutationApaga = gql`
  mutation updateTbMsgUsuarioByCodMensagemAndCodUsuario($codmensagem: Int!, $codUsuario: Int!) {
    updateTbMsgUsuarioByCodMensagemAndCodUsuario(
      input: {
        codMensagem: $codmensagem
        codUsuario: $codUsuario
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
        codUsuario: getStorage('cod_usuario'),
      },
    };
  },
};

export const ApagaMensagemGraphql = graphql(mutationApaga, mutationApagaOptions);
