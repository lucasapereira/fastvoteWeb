import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { getStorage } from '../components/generic/storage';
const query = gql`
  query Feed($codUsuarioRepresentacao: Int) {
    allTbMsgUsuarios(
      condition: { codUsuarioRepresentacao: $codUsuarioRepresentacao, flgDelete: false }
    ) {
      nodes {
        tbMensagemByCodMensagem {
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
  }
`;

const queryOptions = {
  options(props) {
    return {
      variables: {
        type: (props.params && props.params.type && props.params.type.toUpperCase()) || 'TOP',
        codUsuarioRepresentacao: getStorage('cod_usuario_representacao'),
      },
    };
  },
  props(props) {
    const { data: { error, loading, allTbMsgUsuarios, fetchMore, refetch } } = props;

    let rows = [];

    const dados = props.data.allTbMsgUsuarios;

    if (dados) {
      if (dados.nodes) {
        rows = dados.nodes.map(linhas => ({
          codMensagem: linhas.tbMensagemByCodMensagem.codMensagem,
          codPessoaJuridica: linhas.tbMensagemByCodMensagem.codPessoaJuridica,
          titulo: linhas.tbMensagemByCodMensagem.titulo,
          subtitulo: linhas.tbMensagemByCodMensagem.subtitulo,
          mensagem: linhas.tbMensagemByCodMensagem.mensagem,
          flgEnviawebpush: linhas.tbMensagemByCodMensagem.flgEnviawebpush,
          flgEnviaapppush: linhas.tbMensagemByCodMensagem.flgEnviaapppush,
          flgEnviaemail: linhas.tbMensagemByCodMensagem.flgEnviaemail,
          datEnvio: linhas.tbMensagemByCodMensagem.datEnvio
            ? new Date(linhas.tbMensagemByCodMensagem.datEnvio).toLocaleString()
            : '',
          flgEnviado: linhas.tbMensagemByCodMensagem.flgEnviado,
          flgErroEnvio: linhas.tbMensagemByCodMensagem.flgErroEnvio,
        }));
      }
    }

    return {
      allTbMsgUsuarios,
      loading,
      refetch,
      error,
      rows,
      loadMoreEntries() {
        return fetchMore({
          // query: ... (you can specify a different query. FEED_QUERY is used by default)

          updateQuery: (previous, next) => ({
            ...next.fetchMoreResult,
          }),
        });
      },
    };
  },
};

export const ListMensagemGraphql = graphql(query, queryOptions);
