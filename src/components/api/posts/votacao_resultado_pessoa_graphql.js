import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
const query = gql`
  query Feed($codVotacao: Int, $offseta: Int, $limita: Int) {
    relatorioVotos(codvotacao: $codVotacao, offseta: $offseta, limita: $limita) {
      nodes {
        totalCount
        datHoraVoto
        dscVotacao
        datInicioVotacao
        datFimVotacao
        sglPessoaJuridica
        dscPergunta
        dscResposta
        vlrPeso
        nomCompletoPessoa
        numCpfPessoa
        numTelefone
        dscEmail
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
        offseta: props.offset,
        limita: props.limit,
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
          numCpfPessoa: `******${linhas.numCpfPessoa.substring(6)}`,
          numTelefone: `********${linhas.numTelefone.substring(8)}`,
          dscEmail: `**********${linhas.dscEmail.substring(10)}`,
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
