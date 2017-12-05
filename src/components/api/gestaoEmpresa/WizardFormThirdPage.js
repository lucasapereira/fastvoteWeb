import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import validate from './validate';
import { renderTextField } from '../../generic/forms/myTextField';
import { required } from '../../generic/validations';

import { renderCnpjTextField } from '../../generic/forms/myCnpjMaskedInput';

const WizardFormThirdPage = props => {
  const { handleSubmit, pristine, reset, submitting, previousPage } = props;
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
            name="nompessoajuridica"
            component={renderTextField}
            label="Nome do estabelecimento"
            validate={[required]}
            fullWidth
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={4}>
          <Field
            name="vlrcnpj"
            component={renderCnpjTextField}
            label="CNPJ"
            validate={[required]}
            fullWidth
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={4}>
          <Field
            name="sglpessoajuridica"
            component={renderTextField}
            label="Sigla"
            validate={[required]}
            fullWidth
          />
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
              label="Enviar"
              labelStyle={{ color: 'white' }}
              fullWidth
              backgroundColor="#a4c639"
              hoverColor="#8AA62F"
            />
          </Col>

          <Col xs={12} md={6}>
            <FlatButton
              disabled={pristine || submitting}
              onClick={previousPage}
              icon={<Glyphicon glyph="repeat" style={{ color: 'gray' }} />}
              label="Voltar"
              labelStyle={{ color: 'gray' }}
              fullWidth
              backgroundColor="#E6E6E6"
              hoverColor="#BDBDBD"
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
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(WizardFormThirdPage);
