import React from 'react';

import { Field, reduxForm } from 'redux-form';

import { RadioButton } from 'material-ui/RadioButton';
// import Checkbox from 'material-ui/Checkbox';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';

import DadosAdicionaisListCheckBox from './dadosadicionaisListCheckbox';

import { required, cpf, email, telefone } from '../../generic/validations';

import { renderTelefoneTextField } from '../../generic/forms/myTelefoneMaskedInput';

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
      <Row>
        <Col xs={12}>
          <div className="pageSubTitleCadVotacao">Dados Básicos</div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            name="nomcompletopessoa"
            component={renderTextField}
            label="Nome"
            validate={[required]}
            fullWidth
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={4}>
          <Field
            name="numcpfpessoa"
            component={renderTextField}
            label="CPF"
            validate={[required, cpf]}
            fullWidth
          />
        </Col>
        <Col xs={12} md={8}>
          <Field
            name="dscemail"
            component={renderTextField}
            label="E-mail"
            validate={[required, email]}
            fullWidth
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={4}>
          <Field
            name="numtelefone"
            component={renderTelefoneTextField}
            label="Telefone"
            fullWidth
          />
        </Col>
        <Col xs={12} md={4}>
          <Field name="vlrpeso" component={renderTextField} label="Peso na Votação" fullWidth />
        </Col>
        <Col xs={12} md={4}>
          <Field
            name="datnascimentopessoa"
            component={renderDatePicker}
            label="Data de nascimento"
            fullWidth
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6}>
          <div className="pageSubTitleCadVotacao">Sexo</div>
          <Field name="sglsexo" component={renderRadioGroup}>
            <RadioButton value="M" label="Masculino" />
            <RadioButton value="F" label="Feminino" />
          </Field>
        </Col>
        <Col xs={12} md={6}>
          <div className="pageSubTitleCadVotacao">Dados Adicionais</div>
          <DadosAdicionaisListCheckBox codPessoaJuridica={getStorage('cod_pessoa_juridica')} />
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <hr />
        </Col>
      </Row>

      <div className="divGridButtons">
        <Row>
          <Col xs={12} md={6}>
            <FlatButton
              type="submit"
              disabled={pristine || submitting}
              icon={<Glyphicon glyph="plus" style={{ color: 'white' }} />}
              label="Salvar"
              labelStyle={{ color: 'white' }}
              fullWidth
              backgroundColor="#a4c639"
              hoverColor="#8AA62F"
            />
          </Col>
          <Col xs={12} md={6}>
            <FlatButton
              disabled={pristine || submitting}
              onClick={reset}
              icon={<Glyphicon glyph="repeat" style={{ color: 'gray' }} />}
              label="Limpar"
              labelStyle={{ color: 'gray' }}
              fullWidth
              backgroundColor="#E6E6E6"
              hoverColor="#BDBDBD"
            />
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'MaterialUiForm', // a unique identifier for this form
})(MaterialUiForm);
