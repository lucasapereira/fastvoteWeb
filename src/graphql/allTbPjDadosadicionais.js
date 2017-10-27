import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
const query = gql`
  query Feed($codpessoajuridica: Int) {
    allTbPjDadosadicionais(condition: { codPessoaJuridica: $codpessoajuridica }) {
      nodes {
        codPessoaJuridica
        codDadosAdicionais
        tbDadosAdicionaiByCodDadosAdicionais {
          dscDadosAdicionais
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
      },
      fetchPolicy: 'network-only',
    };
  },
};

export const QueryResultadoList = graphql(query, queryOptions);
