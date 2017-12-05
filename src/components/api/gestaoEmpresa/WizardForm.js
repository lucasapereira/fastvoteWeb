import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WizardFormFirstPage from './WizardFormFirstPage';
import WizardFormSecondPage from './WizardFormSecondPage';
import WizardFormThirdPage from './WizardFormThirdPage';
import { getStorage } from '../../generic/storage';

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
    values.numtelefone = values.numtelefone.replace(/\D/g, '');

    if (typeof values.vlrpeso === 'string') {
      values.vlrpeso = values.vlrpeso.replace(',', '.');
    }

    this.props
      .criaUsuarioVotacao({
        variables: {
          numcpfpessoa: values.numcpfpessoa,
          nomcompletopessoa: values.nomcompletopessoa,
          dscemail: values.dscemail,
          codpessoajuridica: values.codpessoajuridica,
          numtelefone: values.numtelefone,
          coddadosadicionaisarray: values.coddadosadicionaisarray,
          vlrpeso: values.vlrpeso,
          vlrsenha: values.vlrsenha,
          datnascimentopessoa: values.datnascimentopessoa,
          sglsexo: values.sglsexo,
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
      </div>
    );
  }
}

WizardForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default WizardForm;
