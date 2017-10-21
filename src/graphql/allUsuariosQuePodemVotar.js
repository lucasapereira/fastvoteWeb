import { gql, graphql } from 'react-apollo';

const query = gql`
  query Feed($codpessoajuridica: Int, $coddadosadicionaisarray: [Int]) {
    allUsuariosQuePodemVotar(
      codpessoajuridica: $codpessoajuridica
      coddadosadicionaisarray: $coddadosadicionaisarray
    ) {
      edges {
        node {
          codUsuarioRepresentacao
          nomCompletoPessoa
          vlrPeso
          dscEmail
          numTelefone
          sglSexo
          datNascimentoPessoa
          dadosAdicionais
        }
      }
    }
  }
`;

const queryOptions = {
  options(props) {
    return {
      variables: {
        type: (props.params && props.params.type && props.params.type.toUpperCase()) || 'TOP',
        codpessoajuridica: props.codPessoaJuridica,
        coddadosadicionaisarray: props.activeCheckboxes,
      },
      fetchPolicy: 'network-only',
    };
  },
  props(props) {
    const { data: { error, loading, allUsuariosQuePodemVotar, fetchMore, refetch } } = props;

    let rows = [];

    const dados = props.data.allUsuariosQuePodemVotar;

    if (dados) {
      if (dados.edges) {
        rows = dados.edges.map(linhas => ({
          id: linhas.node.codUsuarioRepresentacao,
          key: linhas.node.codUsuarioRepresentacao,
          codUsuarioRepresentacao: linhas.node.codUsuarioRepresentacao,
          nomCompletoPessoa: linhas.node.nomCompletoPessoa,
          vlrPeso: linhas.node.vlrPeso,
          dscEmail: linhas.node.vlrPeso,
          numTelefone: linhas.node.numTelefone,
          sglSexo: linhas.node.sglSexo,
          datNascimentoPessoa: linhas.node.datNascimentoPessoa,
          dadosAdicionais: linhas.node.dadosAdicionais,
        }));
      }
    }

    return {
      allUsuariosQuePodemVotar,
      loading,
      refetch,
      error,
      rows,
      loadMoreEntries(codpessoajuridica, coddadosadicionaisarray) {
        return fetchMore({
          // query: ... (you can specify a different query. FEED_QUERY is used by default)
          variables: {
            // We are able to figure out which offset to use because it matches
            // the feed length, but we could also use state, or the previouss
            // variables to calculate this (see the cursor example below)

            codpessoajuridica,
            coddadosadicionaisarray,
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
