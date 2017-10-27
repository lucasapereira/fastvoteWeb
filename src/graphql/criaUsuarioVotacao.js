import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
const mutation = gql`
  mutation criaUsuarioVotacao(
    $nomcompletopessoa: String
    $numcpfpessoa: String
    $dscemail: String
    $codpessoajuridica: Int
    $numtelefone: String
    $coddadosadicionaisarray: [Int]
    $vlrpeso: Float
    $vlrsenha: String
    $datnascimentopessoa: Datetime
    $sglsexo: String
  ) {
    criaUsuarioVotacao(
      input: {
        nomcompletopessoa: $nomcompletopessoa
        numcpfpessoa: $numcpfpessoa
        dscemail: $dscemail
        codpessoajuridica: $codpessoajuridica
        numtelefone: $numtelefone
        coddadosadicionaisarray: $coddadosadicionaisarray
        vlrpeso: $vlrpeso
        vlrsenha: $vlrsenha
        datnascimentopessoa: $datnascimentopessoa
        sglsexo: $sglsexo
      }
    ) {
      boolean
    }
  }
`;

const mutationOptions = {
  name: 'criaUsuarioVotacao',
  options(props) {
    return {
      name: 'criaUsuarioVotacao',
      variables: {
        nomcompletopessoa: props.nomcompletopessoa,
        numcpfpessoa: props.numcpfpessoa,
        dscemail: props.dscemail,
        codpessoajuridica: props.codpessoajuridica,
        numtelefone: props.numtelefone,
        coddadosadicionaisarray: props.coddadosadicionaisarray,
        vlrpeso: props.vlrpeso,
        vlrsenha: props.vlrsenha,
        datnascimentopessoa: props.datnascimentopessoa,
        sglsexo: props.sglsexo,
      },
    };
  },
};

export const mutationCria = graphql(mutation, mutationOptions);
