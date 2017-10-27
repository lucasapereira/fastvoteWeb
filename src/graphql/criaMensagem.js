import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
const mutationGravaMensagem = gql`
  mutation criaMensagem(
    $dathormsg: Datetime
    $apppush: Boolean
    $webpush: Boolean
    $email: Boolean
    $codpessoajuridica: Int
    $title: String
    $subtitle: String
    $body: String
    $codusuarioarray: [Int]
  ) {
    criaMensagem(
      input: {
        dathormsg: $dathormsg
        apppush: $apppush
        webpush: $webpush
        email: $email
        codpessoajuridica: $codpessoajuridica
        title: $title
        subtitle: $subtitle
        body: $body
        codusuarioarray: $codusuarioarray
      }
    ) {
      clientMutationId
      boolean
    }
  }
`;

const mutationGravaMensagemOptions = {
  name: 'criaMensagem',
  options(props) {
    console.log('Dentro do mensagensCreateGraph: ', props);
    return {
      name: 'criaMensagem',
      variables: {
        dathormsg: props.dathormsg,
        apppush: props.apppush,
        webpush: props.webpush,
        email: props.email,
        codpessoajuridica: props.codpessoajuridica,
        title: props.title,
        subtitle: props.subtitle,
        body: props.body,
        codusuarioarray: props.codusuarioarray,
      },
    };
  },
};

/*
const mutationOptions = {
  name: 'criaUsuarioVotacao',
  options(props) {
    return {
      name: 'criaUsuarioVotacao',
      variables: {
        nomcompletopessoa: props.nomcompletopessoa,
        numcpfpesspa: props.numcpfpesspa,
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
*/

export const GravaMensagemGraphql = graphql(mutationGravaMensagem, mutationGravaMensagemOptions);
