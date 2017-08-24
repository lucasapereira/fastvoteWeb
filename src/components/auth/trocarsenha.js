import React from 'react';
import ReactPasswordStrength from 'react-password-strength';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import { required } from '../generic/validations';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { authError, trocarSenha, setSenhaTrocadaComSucesso } from '../../actions';
import MyLoader from '../generic/myLoader';

const inputProps = {
  placeholder: 'Nova Senha',
  id: 'inputPassword',
  autoFocus: true,
  className: 'another-input-prop-class-name',
  autoComplete: 'off',
};

class TrocarSenha extends React.Component {
  constructor() {
    super();

    this.state = {
      passLength: 0,
      password: '',
    };
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          {this.props.errorMessage}
        </div>
      );
    }
  }

  componentDidMount() {
    this.refs.antigaSenhaField
      .getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
      .getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
      .focus(); // on TextField
  }

  changeCallback = (state) => {
    this.setState({
      passLength: state.password.length,
      password: state.password,
      isValid: state.isValid,
    });
  };
  onSubmit = (values) => {
    if (!this.state.isValid) {
      this.props.authError('Nova senha inválida.');
    } else if (this.state.password !== values.senhaNova2) {
      this.props.authError('Senhas diferentes.');
    } else {
      this.props.trocarSenha(values.senhaAntiga, values.senhaNova2);
    }
  };

  clear = () => {
    this.props.setSenhaTrocadaComSucesso(false);
    this.refs.passComponent.clear();
    this.props.reset();
  };

  renderMsgTrocouSenha = () =>
    (<Dialog title="Senha trocada com sucesso." modal open={this.props.senhaTrocadaComSucesso}>
      <FlatButton label="Ok" primary onClick={this.clear} />,
    </Dialog>);

  render = () => {
    const { handleSubmit, pristine, submitting } = this.props;

    if (this.props.loading) {
      return <MyLoader />;
    }

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div>
          <Field
            name="senhaAntiga"
            ref="antigaSenhaField"
            withRef
            component={TextField}
            hintText="Senha Antiga"
            floatingLabelText="Senha Antiga"
            type="password"
            validate={required}
          />
        </div>
        <ReactPasswordStrength
          ref="passComponent"
          withRef
          minLength={6}
          minScore={2}
          scoreWords={['fraca', 'média', 'boa', 'forte', 'excelente']}
          inputProps={inputProps}
          changeCallback={this.changeCallback}
          tooShortWord="fraca"
        />
        <div />
        <div>
          <Field
            name="senhaNova2"
            ref="senhaNova2Field"
            withRef
            component={TextField}
            hintText="Repita sua senha"
            floatingLabelText="Senha Nova"
            type="password"
            validate={required}
          />
        </div>

        <div>
          {this.renderAlert()}
          {this.renderMsgTrocouSenha()}
        </div>

        <div>
          <RaisedButton
            type="submit"
            label="Trocar Senha"
            disabled={pristine || submitting}
            primary
          />
          <RaisedButton type="button" label="Limpar" disabled={submitting} onClick={this.clear} />
        </div>
      </form>
    );
  };
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
  };
}

export default reduxForm({
  form: 'trocarsenha', // a unique identifier for this form
})(
  connect(mapStateToProps, {
    authError,
    trocarSenha,
    setSenhaTrocadaComSucesso,
  })(TrocarSenha),
);
