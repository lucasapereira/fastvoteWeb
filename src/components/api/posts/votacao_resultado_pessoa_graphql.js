import { gql, graphql } from 'react-apollo';

const query = gql`
  query Feed($codVotacao: Int) {
    relatorioVotos(codvotacao: $codVotacao) {
      nodes {
        totalCount
        codVotacao
        datHoraVoto
        dscVotacao
        datInicioVotacao
        datFimVotacao
        sglPessoaJuridica
        dscPergunta
        dscResposta
        vlrPeso
        nomCompletoPessoa
      }
    }
  }
`;

const queryOptions = {
  options(props) {
    return {
      variables: {
        type: (props.params && props.params.type && props.params.type.toUpperCase()) || 'TOP',
        codVotacao: props.codVotacao,
      },
    };
  },

  props(props) {
    const { data: { error, loading, fetchMore, refetch } } = props;
    let rows = [];
    let totalCount = 0;

    const dados = props.data.relatorioVotos;

    if (dados) {
      if (dados.nodes) {
        if (dados.nodes[0]) {
          totalCount = dados.nodes[0].totalCount;
        }
      }

      if (dados.nodes) {
        rows = dados.nodes.map(linhas => ({
          id: linhas.codVotacao,
          key: linhas.codVotacao,
          codVotacao: linhas.codVotacao,
          dscVotacao: linhas.dscVotacao ? linhas.dscVotacao : '',
          datFimVotacao: linhas.datFimVotacao
            ? new Date(linhas.datFimVotacao).toLocaleString()
            : '',
          datInicioVotacao: linhas.datInicioVotacao
            ? new Date(linhas.datInicioVotacao).toLocaleString()
            : '',
          dscPergunta: linhas.dscPergunta ? linhas.dscPergunta : '',
          sglPessoaJuridica: linhas.sglPessoaJuridica,
          dscResposta: linhas.dscResposta ? linhas.dscResposta : '',
          dentroVigenciaVotacao: linhas.dentroVigenciaVotacao,
          flgMostraResultadoEmTempoReal: linhas.flgMostraResultadoEmTempoReal,
          textoMostraResultadoEmTempoReal: linhas.flgMostraResultadoEmTempoReal ? 'Sim' : 'Não',
          totalCount: linhas.totalCount,
          datHoraVoto: linhas.datHoraVoto ? new Date(linhas.datHoraVoto).toLocaleString() : '',
          vlrPeso: linhas.vlrPeso,
          nomCompletoPessoa: linhas.nomCompletoPessoa,
        }));
      }
    }

    return {
      error,
      rows,
      loading,
      refetch,
      totalCount,
      loadMoreEntries(offset, ITEMS_PER_PAGE = null) {
        return fetchMore({
          // query: ... (you can specify a different query. FEED_QUERY is used by default)
          variables: {
            // We are able to figure out which offset to use because it matches
            // the feed length, but we could also use state, or the previouss
            // variables to calculate this (see the cursor example below)
            offseta: offset,
            limita: ITEMS_PER_PAGE || 20,
            codpessoa: props.ownProps.cod_pessoa,
            codusuariorepresentacao: props.ownProps.urep,
          },
          updateQuery: (previous, next) => ({
            ...next.fetchMoreResult,
          }),
        });
      },
    };
  },
};

export const QueryResultadoVotacaoPessoa = graphql(query, queryOptions);
