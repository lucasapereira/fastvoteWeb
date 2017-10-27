import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
const dadosAdicionais = gql`
  query Feed($codVotacao: Int) {
    allTbDadosAdicionais(orderBy: PRIMARY_KEY_ASC) {
      edges {
        node {
          codDadosAdicionais
          dscDadosAdicionais
        }
      }
    }
  }
`;

export const allUsuariosQuePodemVotar = gql`
  query Feed($codpessoajuridica: Int) {
    allUsuariosQuePodemVotar(codpessoajuridica: $codpessoajuridica) {
      edges {
        node {
          codUsuario
          nomCompletoPessoa
          vlrPeso
          codDadosAdicionais
          dscDadosAdicionais
        }
      }
    }
  }
`;

export const allUsuariosQuePodemVotarOptions = {
  options(props) {
    return {
      variables: {
        type: (props.params && props.params.type && props.params.type.toUpperCase()) || 'TOP',
        codpessoajuridica: props.match.params.codpessoajuridica,
        // codDadosAdicionaisArray: props.match.params.codDadosAdicionaisArray,
      },
      fetchPolicy: 'network-only',
    };
  },
};

export const ResultDadosAdicionais = graphql(dadosAdicionais);

const mutationGravaVotacao = gql`
  mutation createVotacao(
    $dscvotacao: String
    $codpessoajuridica: Int
    $dscpergunta: String
    $dscresumo: String
    $votacaousuarioarray: [String]
    $dscrespostaarray: [String]
    $dscarquivoarray: [String]
  ) {
    createVotacao(
      input: {
        dscresumo: $dscresumo
        dscvotacao: $dscvotacao
        codpessoajuridica: $codpessoajuridica
        dscpergunta: $dscpergunta
        votacaousuarioarray: $votacaousuarioarray
        dscrespostaarray: $dscrespostaarray
        dscarquivoarray: $dscarquivoarray
      }
    ) {
      clientMutationId
      boolean
    }
  }
`;

const mutationGravaVotacaoOptions = {
  name: 'gravaVotacao',
  options(props) {
    return {
      name: 'gravaVotacao',
    };
  },
};

export const MutationGravaVotacao = graphql(mutationGravaVotacao, mutationGravaVotacaoOptions);
