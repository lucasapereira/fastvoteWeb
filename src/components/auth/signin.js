import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { signinUser, getEmpresas, limpaTela } from '../../actions';
import { connect } from 'react-redux';
import { TextField, SelectField } from 'redux-form-material-ui';
import { MenuItem } from 'material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import authSchema from '../../jsonschemas/authSchema.json';
import { required, cpf } from '../generic/validations';
import { Link } from 'react-router-dom';
import MyLoader from '../generic/myLoader';

const Validator = require('jsonschema').Validator;

const validate = (values) => {
  const errors = {};

  const v = new Validator();
  const results = v.validate(values, authSchema);

  results.errors.map((error) => {
    errors[error.argument] = error.name;
    return null;
  });
  return errors;
};

class Signin extends Component {
  redirectToMainPage(props) {
    if (props.authenticated) {
      props.history.push('/usuario/listvotacao');
    }
  }

  componentWillMount() {
    this.redirectToMainPage(this.props);
  }

  componentDidMount() {
    this.refs.cpfField
      .getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
      .getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
      .focus(); // on TextField
  }

  componentWillReceiveProps(nextProps) {
    this.redirectToMainPage(nextProps);

    if (nextProps.cpf_error) {
      this.refs.cpfField // the Field
        .getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
        .getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
        .focus(); // on TextField
    }

    if (nextProps.limpa_tela) {
      nextProps.reset();
      nextProps.limpaTela(false);
    }
  }

  limpaTela = () => {
    this.props.reset();
    this.props.limpaTela(true);

    //
  };

  onSubmit = (values) => {
    console.log(this.props.empresasAuth);
    console.log(values);
    if (values.empresas) {
      this.props.signinUser(values, () => {});
    } else if (this.props.empresasAuth.length > 0) {
      values.empresas = this.props.empresasAuth[0].cod_usuario_representacao;
      this.props.signinUser(values, () => {});
    }
  };

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          {this.props.errorMessage}
        </div>
      );
    }
  }

  getEmpresas = (values) => {
    if (!_.isEmpty(this.props.cpf) && !this.props.limpa_tela && !cpf(this.props.cpf)) {
      this.props.getEmpresas(values);
    }
  };

  renderEmpresas = () =>
    this.props.empresasAuth.map(empresa =>
      (<MenuItem
        value={empresa.cod_usuario_representacao}
        primaryText={empresa.sgl_pessoa_juridica}
        key={empresa.cod_usuario_representacao}
      />),
    );

  renderSelect = () => {
    if (this.props.empresasAuth && this.props.empresasAuth.length > 1) {
      return (
        <Field
          name="empresas"
          component={SelectField}
          hintText="Selecione a empresa"
          validate={required}
          withRef
          ref="empresasField"
        >
          {this.renderEmpresas()}
        </Field>
      );
    }
  };

  render() {
    const { handleSubmit, pristine, submitting, empresasAuth } = this.props;

    let error = false;

    if (!empresasAuth.length > 0) {
      error = true;
    }

    if (this.props.loading) {
      return <MyLoader />;
    }

    return (
      <div className="container">
        <form className="form-horizontal" onSubmit={handleSubmit(this.onSubmit)}>
          <div>
            <Field
              name="cpf"
              component={TextField}
              hintText="CPF"
              floatingLabelText="CPF"
              onBlur={this.getEmpresas}
              withRef
              ref="cpfField"
              maxLength="11"
              validate={[required, cpf]}
            />
          </div>
          <div>
            <Field
              name="senha"
              ref="senhaField"
              withRef
              component={TextField}
              hintText="Senha"
              floatingLabelText="Senha"
              type="password"
              validate={required}
            />
          </div>
          {this.renderSelect()}
          <div>
            {this.renderAlert()}
          </div>
          <div>
            <RaisedButton
              type="submit"
              label="Login"
              disabled={pristine || submitting || error}
              primary
            />
            <RaisedButton
              type="button"
              label="Limpar"
              disabled={submitting}
              onClick={this.limpaTela}
            />
          </div>
          <br />
          <Link to={'/auth/esquecisenha'}>
            <b>Primeiro Acesso</b>
          </Link>
          <br />
          <Link to={'/auth/esquecisenha'}>
            <b>Esqueci minha senha</b>
          </Link>
        </form>
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
  };
}

// Decorate with connect to read form values
const selector = formValueSelector('signin'); // <-- same as form name
Signin = connect((state) => {
  // or together as a group
  const { senha, cpf, empresas } = selector(state, 'senha', 'cpf', 'empresas');
  return {
    senha,
    cpf,
    empresas,
  };
})(Signin);

export default reduxForm(
  {
    form: 'signin',
    validate,
  },
  validate,
)(
  connect(mapStateToProps, {
    signinUser,
    getEmpresas,
    limpaTela,
  })(Signin),
);
