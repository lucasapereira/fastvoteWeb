import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton } from 'material-ui/RadioButton';
import { renderTextField } from '../../generic/forms/myTextField';
import { required, cpf, email } from '../../generic/validations';
import validate from './validate';
import renderField from './renderField';
import { renderCpfTextField } from '../../generic/forms/myCpfMaskedInput';
import { renderTelefoneTextField } from '../../generic/forms/myTelefoneMaskedInput';
import { renderRadioGroup } from '../../generic/forms/myRadioGroup';
import { renderDatePicker } from '../../generic/forms/myDatePicker';

const WizardFormFirstPage = props => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
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
            component={renderCpfTextField}
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
              label="Proximo"
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
  form: 'wizard', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(WizardFormFirstPage);
