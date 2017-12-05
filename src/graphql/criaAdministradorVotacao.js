import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
const mutation = gql`
  mutation criaAdministradorVotacao(
    $nomcompletopessoa: String
    $numcpfpessoa: String
    $dscemail: String
    $numtelefone: String
    $vlrpeso: Float
    $vlrsenha: String
    $datnascimentopessoa: Datetime
    $sglsexo: String
    $vlrcnpj: String
    $nompessoajuridica: String
    $sglpessoajuridica: String
    $numcep: String
    $dsclogradouro: String
    $dsccomplemento: String
    $dscbairro: String
    $dsclocalidade: String
    $dscuf: String
    $dsclatitude: String
    $dsclongitude: String
    $dscnumero: String
  ) {
    criaAdministradorVotacao(
      input: {
        nomcompletopessoa: $nomcompletopessoa
        numcpfpessoa: $numcpfpessoa
        dscemail: $dscemail
        numtelefone: $numtelefone
        vlrpeso: $vlrpeso
        vlrsenha: $vlrsenha
        datnascimentopessoa: $datnascimentopessoa
        sglsexo: $sglsexo
        vlrcnpj: $vlrcnpj
        nompessoajuridica: $nompessoajuridica
        sglpessoajuridica: $sglpessoajuridica
        numcep: $numcep
        dsclogradouro: $dsclogradouro
        dsccomplemento: $dsccomplemento
        dscbairro: $dscbairro
        dsclocalidade: $dsclocalidade
        dscuf: $dscuf
        dsclatitude: $dsclatitude
        dsclongitude: $dsclongitude
        dscnumero: $dscnumero
      }
    ) {
      boolean
    }
  }
`;

const mutationOptions = {
  name: 'criaAdministradorVotacao',
  options(props) {
    return {
      name: 'criaAdministradorVotacao',
      variables: {
        nomcompletopessoa: props.nomcompletopessoa,
        numcpfpessoa: props.numcpfpessoa,
        dscemail: props.dscemail,
        numtelefone: props.numtelefone,
        vlrpeso: props.vlrpeso,
        vlrsenha: props.vlrsenha,
        datnascimentopessoa: props.datnascimentopessoa,
        sglsexo: props.sglsexo,

        vlrcnpj: props.vlrcnpj,
        nompessoajuridica: props.nompessoajuridica,
        sglpessoajuridica: props.sglpessoajuridica,

        numcep: props.numcep,
        dsclogradouro: props.dsclogradouro,
        dsccomplemento: props.dsccomplemento,
        dscbairro: props.dscbairro,
        dsclocalidade: props.dsclocalidade,
        dscuf: props.dscuf,
        dsclatitude: props.dsclatitude,
        dsclongitude: props.dsclongitude,
        dscnumero: props.dscnumero,
      },
    };
  },
};

export const mutationCria = graphql(mutation, mutationOptions);
