import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import AlertContainer from 'react-alert';
import WizardFormFirstPage from './WizardFormFirstPage';
import WizardFormSecondPage from './WizardFormSecondPage';
import WizardFormThirdPage from './WizardFormThirdPage';
import { getStorage } from '../../generic/storage';

import { mutationCria } from '../../../graphql/criaAdministradorVotacao';

class WizardForm extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.state = {
      page: 1,
    };
  }
  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  submit = values => {
    console.log(values);

    values.codpessoajuridica = getStorage('cod_pessoa_juridica');
    values.numcpfpessoa = values.numcpfpessoa.replace(/\D/g, '');
    values.vlrcnpj = values.vlrcnpj.replace(/\D/g, '');

    values.numtelefone = values.numtelefone.replace(/\D/g, '');

    if (typeof values.vlrpeso === 'string') {
      values.vlrpeso = values.vlrpeso.replace(',', '.');
    }

    this.props
      .criaAdministradorVotacao({
        variables: {
          numcpfpessoa: values.numcpfpessoa,
          nomcompletopessoa: values.nomcompletopessoa,
          dscemail: values.dscemail,
          codpessoajuridica: values.codpessoajuridica,
          numtelefone: values.numtelefone,
          vlrpeso: 1,
          vlrsenha: values.vlrsenha,
          datnascimentopessoa: values.datnascimentopessoa,
          sglsexo: values.sglsexo,

          vlrcnpj: values.vlrcnpj,
          sglpessoajuridica: values.sglpessoajuridica,

          numcep: values.numcep,
          dsclogradouro: values.dsclogradouro,
          dsccomplemento: values.dsccomplemento,
          dscbairro: values.dscbairro,
          dsclocalidade: values.dsclocalidade,
          dscuf: values.dscuf,
          dsclatitude: values.dsclatitude,
          dsclongitude: values.dsclongitude,
          dscnumero: values.dscnumero,
        },
      })
      .then(() => {
        this.props.history.push('/frontend/gestaoUsuario/listaUsuario');
      })
      .catch(e => {
        this.msg.error('Erro ao realizar a operação');
        console.error(e);
      });
  };

  render() {
    const { page } = this.state;
    return (
      <div>
        {page === 1 && <WizardFormFirstPage onSubmit={this.nextPage} />}
        {page === 2 && (
          <WizardFormSecondPage previousPage={this.previousPage} onSubmit={this.nextPage} />
        )}
        {page === 3 && (
          <WizardFormThirdPage previousPage={this.previousPage} onSubmit={this.submit} />
        )}
        <AlertContainer ref={a => (this.msg = a)} />
      </div>
    );
  }
}

WizardForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default compose(mutationCria)(WizardForm);
