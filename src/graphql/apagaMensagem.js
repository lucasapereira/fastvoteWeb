import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const mutationApaga = gql`
  mutation updateTbMensagemByCodMensagem($codmensagem: Int!) {
    updateTbMensagemByCodMensagem(
      input: { codMensagem: $codmensagem, tbMensagemPatch: { flgDelete: true } }
    ) {
      clientMutationId
    }
  }
`;

const mutationApagaOptions = {
  name: 'apaga',
  options(props) {
    console.log('dentro do ApagaMensagem Graphql', props);
    return {
      variables: {
        codmensagem: props.codmensagem,
      },
    };
  },
};

export const ApagaMensagemGraphql = graphql(mutationApaga, mutationApagaOptions);