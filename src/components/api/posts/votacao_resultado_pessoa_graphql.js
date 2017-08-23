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
      fetchPolicy: 'network-only',
    };
  },
};

export const QueryResultadoVotacaoPessoa = graphql(query, queryOptions);
