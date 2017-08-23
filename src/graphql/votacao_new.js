import { gql, graphql } from 'react-apollo';

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

const dadosAdicionaisOptions = {
  options(props) {
    return {
      ResultDadosAdicionais: [
        {
          codDadosAdicionais: 1,
          dscDadosAdicionais: 'Bloco AAAA',
        },
        {
          codDadosAdicionais: 2,
          dscDadosAdicionais: 'Bloco BBBB',
        },
      ],
    };
  },
};

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

export const ResultDadosAdicionais = graphql(dadosAdicionais, dadosAdicionaisOptions);

const mutationGravaVotacao = gql`
  mutation createVotacao(
    $dscvotacao: String
    $codpessoajuridica: Int
    $dscpergunta: String
    $votacaousuarioarray: [String]
    $dscrespostaarray: [String]
  ) {
    createVotacao(
      input: {
        dscvotacao: $dscvotacao
        codpessoajuridica: $codpessoajuridica
        dscpergunta: $dscpergunta
        votacaousuarioarray: $votacaousuarioarray
        dscrespostaarray: $dscrespostaarray
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
