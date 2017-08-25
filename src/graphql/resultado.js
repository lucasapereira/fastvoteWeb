import { gql, graphql } from 'react-apollo';

const query = gql`
  query Feed($codVotacao: Int) {
    resultVotacao(codvotacao: $codVotacao) {
      nodes {
        codVotacao
        dscVotacao
        dscPergunta
        codResposta
        dscResposta
        multi
      }
    }
  }
`;

const queryOptions = {
  options(props) {
    return {
      variables: {
        type: (props.params && props.params.type && props.params.type.toUpperCase()) || 'TOP',
        codVotacao: props.match.params.codVotacao,
      },
    };
  },
};

export const QueryResultadoList = graphql(query, queryOptions);
