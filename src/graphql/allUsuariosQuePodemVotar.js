import { gql, graphql } from 'react-apollo';
import { getStorage } from '../components/generic/storage';
const query = gql`
  query Feed(
    $codpessoajuridica: Int
    $coddadosadicionaisarray: [Int]
    $codusuariorepresentacao: Int
  ) {
    allUsuariosQuePodemVotar(
      codpessoajuridica: $codpessoajuridica
      coddadosadicionaisarray: $coddadosadicionaisarray
      codusuariorepresentacao: $codusuariorepresentacao
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
    let codUsuarioRepresentacao = null;
    if (props.match.params.codUsuarioRepresentacao) {
      codUsuarioRepresentacao = props.match.params.codUsuarioRepresentacao;
    }
    return {
      variables: {
        type: (props.params && props.params.type && props.params.type.toUpperCase()) || 'TOP',
        codpessoajuridica: getStorage('cod_pessoa_juridica'),
        coddadosadicionaisarray: props.activeCheckboxes,
        codusuariorepresentacao: codUsuarioRepresentacao,
      },
      fetchPolicy: 'network-only',
    };
  },
  props(props) {
    const { data: { error, loading, fetchMore, refetch } } = props;

    let rows = [];

    const dados = props.data.allUsuariosQuePodemVotar;

    if (dados) {
      if (dados.edges) {
        rows = dados.edges.map(linhas => ({
          id: linhas.node.codUsuarioRepresentacao,
          key: linhas.node.codUsuarioRepresentacao,
          codUsuarioRepresentacao: linhas.node.codUsuarioRepresentacao,
          nomcompletopessoa: linhas.node.nomCompletoPessoa,
          vlrpeso: linhas.node.vlrPeso,
          dscemail: linhas.node.dscEmail,
          numtelefone: linhas.node.numTelefone,
          sglsexo: linhas.node.sglSexo,
          datnascimentopessoa: new Date(linhas.node.datNascimentoPessoa),
          dadosAdicionais: linhas.node.dadosAdicionais,
        }));
      }
    }

    return {
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
