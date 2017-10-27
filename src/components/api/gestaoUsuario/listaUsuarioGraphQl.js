import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const mutationApaga = gql`
  mutation apaga($codUsuarioRepresentacao: Int!) {
    updateTbUsuarioRepresentacaoByCodUsuarioRepresentacao(
      input: {
        codUsuarioRepresentacao: $codUsuarioRepresentacao
        tbUsuarioRepresentacaoPatch: { flgBloqueado: true }
      }
    ) {
      tbUsuarioRepresentacao {
        codUsuarioRepresentacao
      }
    }
  }
`;

const mutationApagaOptions = {
  name: 'apaga',
  options(props) {
    return {
      variables: {
        codUsuarioRepresentacao: props.codUsuarioRepresentacao,
      },
    };
  },
};

export const MutationApaga = graphql(mutationApaga, mutationApagaOptions);
