import { gql, graphql } from 'react-apollo';
import { getStorage } from '../components/generic/storage';

const query = gql`
  query Feed($offset: Int, $limit: Int, $codPessoaJuridica: Int) {
    allTbVotacaos(
      orderBy: COD_VOTACAO_ASC
      offset: $offset
      first: $limit
      condition: { flgBloqueado: false, codPessoaJuridica: $codPessoaJuridica }
    ) {
      totalCount
      nodes {
        codVotacao
        dscVotacao
        datInicioVotacao
        datFimVotacao
        dscPergunta
        flgMostraResultadoEmTempoReal
        tbPessoaJuridica: tbPessoaJuridicaByCodPessoaJuridica {
          sglPessoaJuridica
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
        offset: 0,
        limit: 20,
        codPessoaJuridica: getStorage('cod_pessoa_juridica'),
      },
      fetchPolicy: 'network-only',
    };
  },
  props({ data: { loading, allTbVotacaos, fetchMore, refetch } }) {
    let rows = [];

    let totalCount = 10;

    if (allTbVotacaos) {
      totalCount = allTbVotacaos.totalCount;
      if (allTbVotacaos.nodes) {
        rows = allTbVotacaos.nodes.map(linhas => ({
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
          sglPessoaJuridica: linhas.tbPessoaJuridica.sglPessoaJuridica,
          flgMostraResultadoEmTempoReal: linhas.flgMostraResultadoEmTempoReal,
          textoMostraResultadoEmTempoReal: linhas.flgMostraResultadoEmTempoReal ? 'Sim' : 'Não',
        }));
      }
    }
    return {
      rows,
      loading,
      refetch,
      totalCount,
      loadMoreEntries(offset, ITEMS_PER_PAGE = null) {
        console.log(offset, ITEMS_PER_PAGE);
        return fetchMore({
          // query: ... (you can specify a different query. FEED_QUERY is used by default)
          variables: {
            // We are able to figure out which offset to use because it matches
            // the feed length, but we could also use state, or the previouss
            // variables to calculate this (see the cursor example below)
            offset,
            limit: ITEMS_PER_PAGE || 20,
          },
          updateQuery: (previous, next) => ({
            ...next.fetchMoreResult,
          }),
        });
      },
    };
  },
};

const mutationFinalizaVotacao = gql`
  mutation finalizaVotacao($codVotacao: Int!, $datFimVotacao: Datetime) {
    updateTbVotacaoByCodVotacao(
      input: { codVotacao: $codVotacao, tbVotacaoPatch: { datFimVotacao: $datFimVotacao } }
    ) {
      tbVotacao {
        datFimVotacao
      }
    }
  }
`;

const mutationFinalizaVotacaoOptions = {
  name: 'finalizaVotacao',
  options(props) {
    return {
      name: 'finalizaVotacao',
      variables: {
        codVotacao: props.codVotacao,
        datFimVotacao: props.datFimVotacao,
      },
    };
  },
};

const mutationIniciaVotacao = gql`
  mutation iniciaVotacao($codVotacao: Int!, $datInicioVotacao: Datetime) {
    updateTbVotacaoByCodVotacao(
      input: { codVotacao: $codVotacao, tbVotacaoPatch: { datInicioVotacao: $datInicioVotacao } }
    ) {
      tbVotacao {
        datFimVotacao
      }
    }
  }
`;

const mutationIniciaVotacaoOptions = {
  name: 'iniciaVotacao',
  options(props) {
    return {
      variables: {
        codVotacao: props.codVotacao,
        datInicioVotacao: props.datInicioVotacao,
      },
    };
  },
};

const mutationApagaVotacao = gql`
  mutation apagaVotacao($codVotacao: Int!) {
    updateTbVotacaoByCodVotacao(
      input: { codVotacao: $codVotacao, tbVotacaoPatch: { flgBloqueado: true } }
    ) {
      tbVotacao {
        datFimVotacao
      }
    }
  }
`;

const mutationApagaVotacaoOptions = {
  name: 'apagaVotacao',
  options(props) {
    return {
      variables: {
        codVotacao: props.codVotacao,
      },
    };
  },
};

const mutationMostraResultadoEmTempoReal = gql`
  mutation mostraResultadoEmTempoReal($codVotacao: Int!, $flgMostraResultadoEmTempoReal: Boolean) {
    updateTbVotacaoByCodVotacao(
      input: {
        codVotacao: $codVotacao
        tbVotacaoPatch: { flgMostraResultadoEmTempoReal: $flgMostraResultadoEmTempoReal }
      }
    ) {
      tbVotacao {
        datFimVotacao
      }
    }
  }
`;

const mutationMostraResultadoEmTempoRealOptions = {
  name: 'mostraResultadoEmTempoReal',
  options(props) {
    return {
      variables: {
        codVotacao: props.codVotacao,
        flgMostraResultadoEmTempoReal: props.flgMostraResultadoEmTempoReal,
      },
    };
  },
};

export const QueryVotacaoList = graphql(query, queryOptions);
export const MutationIniciaVotacao = graphql(mutationIniciaVotacao, mutationIniciaVotacaoOptions);
export const MutationFinalizaVotacao = graphql(
  mutationFinalizaVotacao,
  mutationFinalizaVotacaoOptions,
);
export const MutationApagaVotacao = graphql(mutationApagaVotacao, mutationApagaVotacaoOptions);
export const MutationMostraResultadoEmTempoReal = graphql(
  mutationMostraResultadoEmTempoReal,
  mutationMostraResultadoEmTempoRealOptions,
);
