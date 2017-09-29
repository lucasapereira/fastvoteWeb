import { gql, graphql } from 'react-apollo';

const query = gql`
  query Feed($codVotacao: Int) {
    allTbVotacaos(orderBy: PRIMARY_KEY_ASC, condition: { codVotacao: $codVotacao }) {
      nodes {
        dscResumo
        tbVotacaoImagemsByCodVotacao {
          nodes {
            dscArquivo
            nomArquivo
            dscType
          }
        }
      }
    }
  }
`;

const queryOptions = {
  options(props) {
    return {
      variables: {
        codVotacao: props.codVotacao,
      },
    };
  },
};

export const QueryResultadoVotacaoPessoa = graphql(query, queryOptions);
