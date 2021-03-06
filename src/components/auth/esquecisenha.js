import React from 'react';
import Recaptcha from 'react-recaptcha';
import { required, email, cpf } from '../generic/validations';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import { TextField } from 'redux-form-material-ui';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { esqueciSenha, setSenhaTrocadaComSucesso, getEmail } from '../../actions';
import MyLoader from '../generic/myLoader';
import Paper from 'material-ui/Paper';
import _ from 'lodash';

// site key
const sitekey = '6LerwiwUAAAAAN_S41XhiuIPWwcvEcy9KPsroZ1T';

class EsqueciSenha extends React.Component {
  state = {
    recaptchaResponse: '',
  };

  verifyCallback = response => {
    this.setState({
      recaptchaResponse: response,
    });
  };

  // define a variable to store the recaptcha instance
  recaptchaInstance;

  renderAlert() {
    if (this.props.errorMessage) {
      return <div className="alert alert-danger">{this.props.errorMessage}</div>;
    }
  }
  limpaTela = () => {
    this.props.setSenhaTrocadaComSucesso(false);
    this.props.reset();
    this.recaptchaInstance.reset();
  };

  redireciona = () => {
    this.props.history.push('/frontend/usuario/listvotacao');
  };

  limpaERedireciona = () => {
    this.limpaTela();
    this.redireciona();
  };

  renderMsgTrocouSenha = () => (
    <Dialog
      title="Foi enviado um e-mail com a senha."
      modal
      open={this.props.senhaTrocadaComSucesso}>
      <FlatButton label="Ok" primary onClick={this.limpaERedireciona} />
    </Dialog>
  );
  onSubmit = values => {
    this.props.esqueciSenha(values.email, this.state.recaptchaResponse, values.cpf);
  };

  getEmail = values => {
    if (!_.isEmpty(this.props.cpf) && !this.props.limpa_tela && !cpf(this.props.cpf)) {
      this.props.getEmail(values);
    }
  };
  render() {
    const { handleSubmit, pristine, submitting } = this.props;

    if (this.props.loading) {
      return <MyLoader />;
    }

    if (!this.props.cpf && this.props.email.length > 0) {
      this.props.setSenhaTrocadaComSucesso(false);
    }

    return (
      <div className="container">
        <Paper className="paperLogin" zDepth={2} rounded>
          <div className="divTopoLogin">Recuperar Senha</div>
          <div className="divFormLogin">
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <div>
                <div>
                  <Field
                    name="cpf"
                    component={TextField}
                    hintText="CPF"
                    floatingLabelText="CPF"
                    onBlur={this.getEmail}
                    withRef
                    ref="cpfField"
                    maxLength="11"
                    validate={[required, cpf]}
                  />
                </div>
                <div style={{ marginTop: 8, marginBottom: 8 }}>{this.props.email}</div>
                <Field
                  name="email"
                  component={TextField}
                  hintText="e-mail"
                  floatingLabelText="e-mail"
                  withRef
                  ref="emailField"
                  validate={[required, email]}
                />

                <Recaptcha
                  ref={e => (this.recaptchaInstance = e)}
                  sitekey={sitekey}
                  size="compact"
                  render="explicit"
                  verifyCallback={this.verifyCallback}
                  onloadCallback={this.callback}
                  expiredCallback={this.expiredCallback}
                  hl="pt-BR"
                />
                <br />
                <div>
                  {this.renderAlert()}
                  {this.renderMsgTrocouSenha()}
                </div>
                <div className="divBottomFormLogin">
                  <RaisedButton
                    type="submit"
                    label="Recuperar Senha"
                    disabled={pristine || submitting}
                    primary
                  />
                  <RaisedButton
                    type="button"
                    label="Limpar"
                    disabled={submitting}
                    onClick={this.limpaTela}
                  />
                </div>
              </div>
            </form>
          </div>
        </Paper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    limpa_tela: state.auth.limpa_tela,
    errorMessage: state.auth.error,
    authenticated: state.auth.authenticated,
    cpf_error: state.auth.cpf_error,
    empresasAuth: state.auth.empresas,
    loading: state.auth.loading,
    senhaTrocadaComSucesso: state.auth.senhaTrocadaComSucesso,
    email: state.auth.email,
  };
}

const selector = formValueSelector('esquecisenha'); // <-- same as form name
EsqueciSenha = connect(state => {
  // or together as a group
  /* eslint no-shadow:0 */
  const cpf = selector(state, 'cpf');
  return {
    cpf,
  };
})(EsqueciSenha);

export default reduxForm({
  form: 'esquecisenha', // a unique identifier for this form
})(
  connect(mapStateToProps, {
    esqueciSenha,
    setSenhaTrocadaComSucesso,
    getEmail,
  })(EsqueciSenha)
);
