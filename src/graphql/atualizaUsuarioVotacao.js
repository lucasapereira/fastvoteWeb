import { gql, graphql } from 'react-apollo';

const mutation = gql`
  mutation atualizaUsuarioVotacao(
    $codusuariorepresentacao: Int
    $nomcompletopessoa: String
    $numcpfpessoa: String
    $dscemail: String
    $codpessoajuridica: Int
    $numtelefone: String
    $coddadosadicionaisarray: [Int]
    $vlrpeso: Float
    $datnascimentopessoa: Datetime
    $sglsexo: String
  ) {
    atualizaUsuarioVotacao(
      input: {
        codusuariorepresentacao: $codusuariorepresentacao
        nomcompletopessoa: $nomcompletopessoa
        numcpfpessoa: $numcpfpessoa
        dscemail: $dscemail
        codpessoajuridica: $codpessoajuridica
        numtelefone: $numtelefone
        coddadosadicionaisarray: $coddadosadicionaisarray
        vlrpeso: $vlrpeso
        datnascimentopessoa: $datnascimentopessoa
        sglsexo: $sglsexo
      }
    ) {
      boolean
    }
  }
`;

const mutationOptions = {
  name: 'atualizaUsuarioVotacao',
  options(props) {
    let codUsuarioRepresentacao = null;
    if (props.match.params.codUsuarioRepresentacao) {
      codUsuarioRepresentacao = props.match.params.codUsuarioRepresentacao;
    }
    return {
      name: 'atualizaUsuarioVotacao',
      variables: {
        codusuariorepresentacao: codUsuarioRepresentacao,
        nomcompletopessoa: props.nomcompletopessoa,
        numcpfpesspa: props.numcpfpessoa,
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

export const mutationAtualiza = graphql(mutation, mutationOptions);
