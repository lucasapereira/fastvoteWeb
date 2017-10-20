import { gql, graphql } from 'react-apollo';

const query = gql`
  query Feed($codusuariorepresentacao: Int, $offseta: Int, $limita: Int) {
    allVotacoesUsuarios(
      codusuariorepresentacao: $codusuariorepresentacao
      offseta: $offseta
      limita: $limita
    ) {
      nodes {
        totalCount
        codVotacao
        dscVotacao
        datInicioVotacao
        datFimVotacao
        sglPessoaJuridica
        dscPergunta
        dscResposta
        dentroVigenciaVotacao
        flgMostraResultadoEmTempoReal
      }
    }
  }
`;

const queryOptions = {
  options(props) {
    return {
      variables: {
        type: (props.params && props.params.type && props.params.type.toUpperCase()) || 'TOP',
        codpessoa: props.cod_pessoa,
        codusuariorepresentacao: props.urep,
        offseta: 0,
        limita: 5,
      },
      fetchPolicy: 'network-only',
    };
  },
  props(props) {
    // { data: { loading, allTbVotacaos, fetchMore, refetch } } = props;
    let rows = [];

    let totalCount = 20;

    const dados = props.data.allVotacoesUsuarios;
    const loading = props.data.loading;
    const refetch = props.data.refetch;
    const fetchMore = props.data.fetchMore;
    const error = props.data.error;

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
          datFimVotacaoDate: linhas.datFimVotacao ? new Date(linhas.datFimVotacao) : '',
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
            limita: ITEMS_PER_PAGE || 5,
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

export const QueryVotacaoList = graphql(query, queryOptions);
