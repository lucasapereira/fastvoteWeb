import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
const query = gql`
  query Feed($codpessoajuridica: Int) {
    allTbMensagems(
      orderBy: DAT_ENVIO_DESC
      condition: { codPessoaJuridica: $codpessoajuridica, flgDelete: false }
    ) {
      nodes {
        codMensagem
        codPessoaJuridica
        titulo
        subtitulo
        mensagem
        flgEnviawebpush
        flgEnviaapppush
        flgEnviaemail
        datEnvio
        flgEnviado
        flgErroEnvio
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
      },
      fetchPolicy: 'network-only',
    };
  },
  props(props) {
    const { data: { error, loading, allTbMensagems, fetchMore, refetch } } = props;

    let rows = [];

    const dados = props.data.allTbMensagems;

    if (dados) {
      if (dados.nodes) {
        rows = dados.nodes.map(linhas => ({
          codMensagem: linhas.codMensagem,
          codPessoaJuridica: linhas.codPessoaJuridica,
          titulo: linhas.titulo,
          subtitulo: linhas.subtitulo,
          mensagem: linhas.mensagem,
          flgEnviawebpush: linhas.flgEnviawebpush,
          flgEnviaapppush: linhas.flgEnviaapppush,
          flgEnviaemail: linhas.flgEnviaemail,
          datEnvio: linhas.datEnvio ? new Date(linhas.datEnvio).toLocaleString() : '',
          flgEnviado: linhas.flgEnviado,
          flgErroEnvio: linhas.flgErroEnvio,
        }));
      }
    }

    return {
      allTbMensagems,
      loading,
      refetch,
      error,
      rows,
      loadMoreEntries(codpessoajuridica) {
        return fetchMore({
          // query: ... (you can specify a different query. FEED_QUERY is used by default)
          variables: {
            // We are able to figure out which offset to use because it matches
            // the feed length, but we could also use state, or the previouss
            // variables to calculate this (see the cursor example below)

            codpessoajuridica,
          },
          updateQuery: (previous, next) => ({
            ...next.fetchMoreResult,
          }),
        });
      },
    };
  },
};

export const ListMensagemGraphql = graphql(query, queryOptions);
