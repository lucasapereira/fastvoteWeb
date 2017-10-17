import { gql, graphql } from 'react-apollo';

const mutation = gql`
  mutation criaUsuarioVotacao(
    $nomCompletoPessoa: String
    $numCpfPessoa: String
    $dscEmail: String
    $codPessoaJuridica: Int
    $numTelefone: String
    $codDadosAdicionaisArray: [Int]
    $vlrPeso: Float
    $vlrSenha: String
    $datNascimentoPessoa: Datetime
    $sglSexo: String
  ) {
    criaUsuarioVotacao(
      input: {
        nomcompletopessoa: $nomCompletoPessoa
        numcpfpessoa: $numCpfPessoa
        dscemail: $dscEmail
        codpessoajuridica: $codPessoaJuridica
        numtelefone: $numTelefone
        coddadosadicionaisarray: $codDadosAdicionaisArray
        vlrpeso: $vlrPeso
        vlrsenha: $vlrSenha
        datnascimentopessoa: $datNascimentoPessoa
        sglsexo: $sglSexo
      }
    ) {
      clientMutationId
      boolean
    }
  }
`;

const mutationOptions = {
  name: 'criaUsuarioVotacao',
  options(props) {
    return {
      variables: {
        nomCompletoPessoa: props.nomCompletoPessoa,
        numCpfPessoa: props.numCpfPessoa,
        dscEmail: props.dscEmail,
        codPessoaJuridica: props.codPessoaJuridica,
        numTelefone: props.numTelefone,
        codDadosAdicionaisArray: props.codDadosAdicionaisArray,
        vlrPeso: props.vlrPeso,
        vlrSenha: props.vlrSenha,
        datNascimentoPessoa: props.datNascimentoPessoa,
        sglSexo: props.sglSexo,
      },
    };
  },
};

export const mutationCria = graphql(mutation, mutationOptions);
