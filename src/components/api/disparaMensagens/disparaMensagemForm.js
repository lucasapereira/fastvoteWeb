import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';

import { TextField, DatePicker, TimePicker } from 'redux-form-material-ui';

import { Row, Col, Modal, Button, Tooltip, OverlayTrigger, Glyphicon } from 'react-bootstrap';

// validation functions
const required = value => (value == null ? 'Required' : undefined);
/*
const email = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined);
const tooManyPizzas = value => (value > 15 ? 'Are you mad?' : undefined);
*/

class DisparaMensagemForm extends Component {
  render() {
    const { handleSubmit, pristine, numPizzas, reset, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Título e configuração de envio </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} style={{ borderColor: 'red' }}>
            <Field
              name="dsc_titulo"
              component={TextField}
              floatingLabelText={'Título'}
              hintText={'Name'}
              validate={required}
              ref="dsc_titulo"
              withRef
              fullWidth
            />
          </Col>
          <Col xs={12} md={3}>
            <Field
              name="dt_envio"
              floatingLabelText={'Data de envio'}
              component={DatePicker}
              format={null}
              validate={required}
              fullWidth
            />
          </Col>
          <Col xs={12} md={3}>
            <Field
              name="hr_envio"
              floatingLabelText={'Hora de envio'}
              component={TimePicker}
              format={null} //"24hr"
              defaultValue={null} // TimePicker requires an object,
              // and redux-form defaults to ''
              validate={required}
              fullWidth
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Field
              name="dsc_subtitulo"
              component={TextField}
              floatingLabelText={'Subtítulo'}
              validate={required}
              ref="dsc_subtitulo"
              withRef
              fullWidth
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Mensagem </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Destinatários </div>
          </Col>
        </Row>
      </form>
    );
    // <div className="pageSubTitleCadVotacao">Mensagem </div>
    // <RichEditorExample onChange={this.onChange} editorState={this.state.editorState} />
  }
}

const selector = formValueSelector('example');

DisparaMensagemForm = connect(state => ({
  dsc_titulo: selector(state, 'dsc_titulo'),
  dsc_subtitulo: selector(state, 'dsc_subtitulo'),
}))(DisparaMensagemForm);

DisparaMensagemForm = reduxForm({
  form: 'example',
  initialValues: {
    dsc_titulo: 'aaaaaaaaaaaaaa',
    dsc_subtitulo: 'bbbbbbb',
  },
})(DisparaMensagemForm);

export default DisparaMensagemForm;
