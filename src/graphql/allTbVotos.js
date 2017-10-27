import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
const query = gql`
  query Feed($codVotacao: Int) {
    allTbVotos(condition: { codVotacao: $codVotacao }) {
      totalCount
    }
  }
`;

const queryOptions = {
  options(props) {
    let codVotacao;
    if (props.codVotacao) {
      codVotacao = props.codVotacao;
    } else if (props.votacao) {
      codVotacao = props.votacao.codVotacao;
    } else if (props.match) {
      codVotacao = props.match.params.codVotacao;
    }
    return {
      variables: {
        type: (props.params && props.params.type && props.params.type.toUpperCase()) || 'TOP',
        codVotacao,
        dscResposta: props.dscResposta,
      },
      fetchPolicy: 'network-only',
      pollInterval: 5000,
    };
  },
};

export const QueryAlTbVotos = graphql(query, queryOptions);
