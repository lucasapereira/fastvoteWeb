import { gql, graphql } from 'react-apollo';

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
