import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';

import { Row, Col, Glyphicon } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';

import areIntlLocalesSupported from 'intl-locales-supported';

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

let DateTimeFormat;
/**
 * Use the native Intl.DateTimeFormat if available, or a polyfill if not.
 */
/*
 if (areIntlLocalesSupported(['pt', 'pt-BR'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/pt');
  require('intl/locale-data/jsonp/pt-BR');
}
*/

class MensagemForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      arrUsers: [],
    };
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

  disableDates = date => {
    const time = new Date();
    time.setDate(time.getDate() - 1);

    return date < time;
  };

  render() {
    const {
      handleSubmit,
      //pristine,
      reset,
      submitting,
      checkDadosAdicionais,
      //arrayUsuarios,
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
              locale="pt-br"
              shouldDisableDate={this.disableDates}
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
          <Col xs={12} md={6}>
            <div className="pageSubTitleCadVotacao">Formas de Envio</div>
            <Field name="apppush" component={renderCheckbox} label="Aplicativo" />

            <Field name="webpush" component={renderCheckbox} label="Web" />
            <Field name="email" component={renderCheckbox} label="E-Mail" />
          </Col>

          <Col xs={12} md={6}>
            <div className="pageSubTitleCadVotacao">Filtro Dados Adicionais</div>
            <div className="divSubItemFormVotacao2">
              <CheckBoxDadosAdicionais
                name="checkDadosAdicionais"
                codPessoaJuridica={getStorage('cod_pessoa_juridica')}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Destinatários</div>
            <div className="divContainerGridUsuarios">
              <UsuariosByDadosAdicionais
                name="arrayUsuarios"
                codPessoaJuridica={getStorage('cod_pessoa_juridica')}
                activeCheckboxes={arrayCheck}
                setSelectedIndexes={this.setSelectedIndexes}
                validate={[required]}
              />
            </div>
          </Col>
        </Row>

        <div className="divGridButtons">
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
