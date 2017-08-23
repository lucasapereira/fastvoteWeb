import { gql, graphql } from 'react-apollo';

const query = gql`
  query Feed($nompessoajuridica: String) {
    allEmpresasPorNome(nompessoajuridica: $nompessoajuridica) {
      nodes {
        codPessoaJuridica
        nomPessoaJuridica
      }
    }
  }
`;

const queryOptions = {
  options(props) {
    return {
      variables: {
        type: (props.params && props.params.type && props.params.type.toUpperCase()) || 'TOP',
        offset: 0,
        limit: 20,
        nompessoajuridica: 'em',
      },
      fetchPolicy: 'network-only',
    };
  },
  props(props) {
    const { data: { error, loading, allEmpresasPorNome, fetchMore, refetch } } = props;
    return {
      allEmpresasPorNome,
      loading,
      refetch,
      error,
      loadMoreEntries(nompessoajuridica) {
        return fetchMore({
          // query: ... (you can specify a different query. FEED_QUERY is used by default)
          variables: {
            // We are able to figure out which offset to use because it matches
            // the feed length, but we could also use state, or the previouss
            // variables to calculate this (see the cursor example below)

            nompessoajuridica,
          },
          updateQuery: (previous, next) => ({
            ...next.fetchMoreResult,
          }),
        });
      },
    };
  },
};

export const QueryResultadoList = graphql(query, queryOptions);
