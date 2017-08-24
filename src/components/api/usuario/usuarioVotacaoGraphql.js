import { gql, graphql } from 'react-apollo';

const query = gql`
  query Feed($codVotacao: Int) {
    allTbRespostas(
      orderBy: PRIMARY_KEY_ASC
      condition: { flgBloqueado: false, codVotacao: $codVotacao }
    ) {
      totalCount
      nodes {
        codResposta
        codVotacao
        dscResposta
      }
    }
  }
`;

const queryOptions = {
  options(props) {
    return {
      variables: {
        type: (props.params && props.params.type && props.params.type.toUpperCase()) || 'TOP',
        codVotacao: props.votacao.codVotacao,
      },
    };
  },
  props(props) {
    // { data: { loading, allTbVotacaos, fetchMore, refetch } } = props;
    let rows = [];

    let totalCount = 10;

    const dados = props.data.allTbRespostas;
    const loading = props.data.loading;
    const refetch = props.data.refetch;
    const fetchMore = props.data.fetchMore;
    const error = props.data.error;

    if (dados) {
      totalCount = dados.totalCount;
      if (dados.nodes) {
        rows = dados.nodes.map(linhas => ({
          codResposta: linhas.codResposta,
          codVotacao: linhas.codVotacao,
          dscResposta: linhas.dscResposta,
        }));
      }
    }
    return {
      error,
      rows,
      loading,
      refetch,
      fetchMore,
      totalCount,
    };
  },
};

export const QueryVoto = graphql(query, queryOptions);

const mutationVotas = gql`
  mutation vota($codUsuarioRepresentacao: Int!, $codVotacao: Int!, $codResposta: Int!) {
    createTbVoto(
      input: {
        tbVoto: {
          codUsuarioRepresentacao: $codUsuarioRepresentacao
          codVotacao: $codVotacao
          codResposta: $codResposta
        }
      }
    ) {
      tbVoto {
        codUsuarioRepresentacao
      }
    }
  }
`;

const mutationVotaOptions = {
  name: 'vota',
  options(props) {
    return {
      name: 'vota',
    };
  },
};

export const mutationVota = graphql(mutationVotas, mutationVotaOptions);
