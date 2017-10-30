import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';

import { Row, Col, Glyphicon } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';

// import asyncValidate from './asyncValidate';
import { required } from '../../generic/validations';

import { renderTextField } from '../../generic/forms/myTextField';
import { renderDatePicker } from '../../generic/forms/myDatePicker';
import { renderTimePicker } from '../../generic/forms/myTimePicker';
import { renderCheckbox } from '../../generic/forms/myCheckbox';
import { renderEditor } from '../../generic/forms/myEditor';

import CheckBoxDadosAdicionais from '../../generic/component/checkBoxDadosAdicionais';
import UsuariosByDadosAdicionais from '../../generic/component/usuariosByDadosAdicionais';

import { getStorage } from '../../generic/storage';

class MensagemForm extends Component {
  constructor(props) {
    super(props);
    this.state = { arrUsers: [] };
  }

  setArrUsers = array => {
    this.setState({
      arrUsers: array,
    });
  };

  setSelectedIndexes = selectedIndexes => {
    this.props.change('arrayUsuarios', selectedIndexes);

    this.setState({
      selectedIndexes,
    });
  };

  render() {
    const {
      handleSubmit,
      pristine,
      reset,
      submitting,
      checkDadosAdicionais,
      arrayUsuarios,
    } = this.props;

    let arrayCheck = [];

    if (checkDadosAdicionais) {
      checkDadosAdicionais.map((value, key) => {
        if (!value) {
          arrayCheck.filter(x => x !== key);
        } else {
          arrayCheck = [...arrayCheck, key];
        }
      });
    }

    return (
      <form onSubmit={handleSubmit(this.props.addMensagem)}>
        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Título e configuração de envio</div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Field
              name="title"
              component={renderTextField}
              label="Informe o Título"
              validate={[required]}
              fullWidth
            />
          </Col>
          <Col xs={12} md={3}>
            <Field
              name="dt_envio"
              component={renderDatePicker}
              label="Data de envio"
              validate={[required]}
              fullWidth
              autoOk
            />
          </Col>
          <Col xs={12} md={3}>
            <Field
              name="hr_envio"
              component={renderTimePicker}
              label="Hora de envio"
              validate={[required]}
              fullWidth
              autoOk
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Field
              name="subtitle"
              component={renderTextField}
              label="Informe o Subtítulo"
              validate={[required]}
              fullWidth
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Mensagem</div>

            <Field
              name="body"
              component={renderEditor}
              label="Informe o Conteúdo da Mensagem"
              validate={[required]}
              fullWidth
              multiLine
              rows={2}
              rowsMax={4}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Formas de Envio</div>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={4}>
            <Field
              name="apppush"
              component={renderCheckbox}
              label="Aplicativo"
              // validate={[required]}
              fullWidth
            />
          </Col>
          <Col xs={12} md={4}>
            <Field name="webpush" component={renderCheckbox} label="Web" />
          </Col>
          <Col xs={12} md={4}>
            <Field name="email" component={renderCheckbox} label="E-Mail" />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Destinatários</div>

            <CheckBoxDadosAdicionais
              name="checkDadosAdicionais"
              codPessoaJuridica={getStorage('cod_pessoa_juridica')}
            />

            <UsuariosByDadosAdicionais
              name="arrayUsuarios"
              codPessoaJuridica={getStorage('cod_pessoa_juridica')}
              activeCheckboxes={arrayCheck}
              setSelectedIndexes={this.setSelectedIndexes}
              validate={[required]}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6}>
            <FlatButton
              type="submit"
              disabled={submitting}
              icon={<Glyphicon glyph="plus" style={{ color: 'white' }} />}
              label="Agendar Mensagem"
              labelStyle={{ color: 'white' }}
              fullWidth
              backgroundColor="#a4c639"
              hoverColor="#8AA62F"
            />
          </Col>

          <Col xs={12} md={6}>
            <FlatButton
              disabled={submitting}
              onClick={reset}
              icon={<Glyphicon glyph="repeat" style={{ color: 'gray' }} />}
              label="Clear"
              labelStyle={{ color: 'gray' }}
              fullWidth
              backgroundColor="#E6E6E6"
              hoverColor="#BDBDBD"
            />
          </Col>
        </Row>
      </form>
    );
  }
}

// Decorate with redux-form
MensagemForm = reduxForm({
  form: 'MensagemForm', // a unique identifier for this form
})(MensagemForm);

// Decorate with connect to read form values
const selector = formValueSelector('MensagemForm'); // <-- same as form name
MensagemForm = connect(state => {
  // can select values individually
  const checkDadosAdicionais = selector(state, 'checkDadosAdicionais');
  const arrayUsuarios = selector(state, 'arrayUsuarios');

  return {
    checkDadosAdicionais,
    arrayUsuarios,
  };
})(MensagemForm);

export default MensagemForm;
