import React from 'react';

import { Field, reduxForm } from 'redux-form';

import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import { RadioButton } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
// import Checkbox from 'material-ui/Checkbox';
import DadosAdicionaisListCheckBox from './dadosadicionaisListCheckbox';
import asyncValidate from './asyncValidate';

import { required, cpf, email, telefone } from '../../generic/validations';

import { renderTextField } from '../../generic/forms/myTextField';
import { renderRadioGroup } from '../../generic/forms/myRadioGroup';
import { renderDatePicker } from '../../generic/forms/myDatePicker';

import { getStorage } from '../../generic/storage';
// import { renderCheckbox } from '../../generic/forms/myCheckbox';

const MaterialUiForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props;

  const submit = values => {
    props.callMutationUsuario(values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="container">
      <Paper className="paperLogin" zDepth={2} rounded>
        <div className="divTopoLogin">Criação de usuário</div>
        <div className="divFormLogin">
          <div>
            <Field
              name="nomcompletopessoa"
              component={renderTextField}
              label="Nome"
              validate={[required]}
            />
          </div>

          <div>
            <Field
              name="numcpfpessoa"
              component={renderTextField}
              label="CPF"
              validate={[required, cpf]}
            />
          </div>
          <div>
            <Field
              name="dscemail"
              component={renderTextField}
              label="E-mail"
              validate={[required, email]}
            />
          </div>
          <div>
            <Field name="numtelefone" component={renderTextField} label="Telefone" />
          </div>
          <div>
            <Field name="sglsexo" component={renderRadioGroup}>
              <RadioButton value="M" label="Masculino" />
              <RadioButton value="F" label="Feminino" />
            </Field>
          </div>

          <div>
            <Field name="vlrpeso" component={renderTextField} label="Peso na Votação" />
          </div>
          <div>
            <Field
              name="datnascimentopessoa"
              component={renderDatePicker}
              label="Data de nascimento"
            />
          </div>
          <div>
            <DadosAdicionaisListCheckBox codPessoaJuridica={getStorage('cod_pessoa_juridica')} />
          </div>
          <div>
            <RaisedButton type="submit" disabled={pristine || submitting} label="Criar" />

            <RaisedButton
              type="button"
              disabled={pristine || submitting}
              onClick={reset}
              label="Limpar"
            />
          </div>
        </div>
      </Paper>
    </form>
  );
};

export default reduxForm({
  form: 'MaterialUiForm', // a unique identifier for this form
})(MaterialUiForm);
