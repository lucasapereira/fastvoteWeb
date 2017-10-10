import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Field, reduxForm, formValueSelector } from 'redux-form';

import { TextField, DatePicker, TimePicker } from 'redux-form-material-ui';

import TextFieldUi from 'material-ui/TextField';
import DatePickerUi from 'material-ui/DatePicker';
import TimePickerUi from 'material-ui/TimePicker';

import { Row, Col, Glyphicon } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';

import {
  changeTitulo,
  changeData,
  changeHora,
  changeSubtitulo,
  addMensagem,
  search,
  clear,
} from './mensagensActions';

// validation functions
const required = value => (value == null ? 'Required' : undefined);
/*
const email = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined);
const tooManyPizzas = value => (value > 15 ? 'Are you mad?' : undefined);
*/

class MensagemForm extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.search();
  }

  /*
  keyHandler(e) {
    const { add, search, clear } = this.props;
    if (e.key === 'Enter') {
      e.shiftKey ? search() : add(description);
    } else if (e.key === 'Escape') {
      clear();
    }
  }
  */

  render() {
    const {
      handleSubmit,
      pristine,
      numPizzas,
      reset,
      submitting,
      addMensagem,
      search,
    } = this.props;
    // const { add, search, description } = this.props

    let form = (
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Título e configuração de envio</div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Field
              name="dsc_titulo"
              component={TextField}
              floatingLabelText={'Adicione um Titulo'}
              validate={required}
              ref="dsc_titulo"
              // withRef
              fullWidth
              // value={this.props.dsc_titulo}
              // onChange={this.props.changeTitulo}
            />
            <Glyphicon glyph="search" style={{ color: 'blue' }} onClick={this.props.search} />
            <Glyphicon glyph="refresh" style={{ color: 'black' }} onClick={this.props.clear} />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Field
              name="dsc_subtitulo"
              component={TextField}
              floatingLabelText={'Adicione um Subtitulo'}
              validate={required}
              ref="dsc_subtitulo"
              // withRef
              fullWidth
              // value={this.props.dsc_subtitulo}
              // onChange={this.props.changeSubtitulo}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Mensagem</div>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Destinatários</div>
          </Col>
        </Row>

        <Row>
          <FlatButton
            onClick={this.props.handleAdd}
            icon={<Glyphicon glyph="plus" style={{ color: 'white' }} />}
            label="Agendar Mensagem"
            labelStyle={{ color: 'white' }}
            fullWidth
            backgroundColor="#a4c639"
            hoverColor="#8AA62F"
          />
        </Row>
      </form>
    );

    /*
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
          
          
          
          */
    /*
    let form2 = (
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Título e configuração de envio</div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <TextFieldUi
              name="dsc_titulo"
              floatingLabelText="Adicione um Titulo"
              fullWidth
              value={this.props.dsc_titulo}
              onChange={this.props.changeTitulo}
            />
            <Glyphicon glyph="search" style={{ color: 'blue' }} onClick={this.props.search} />
            <Glyphicon glyph="refresh" style={{ color: 'black' }} onClick={this.props.clear} />
          </Col>
          <Col xs={12} md={3}>
            <DatePickerUi
              name="dt_envio"
              floatingLabelText="Data de envio"
              fullWidth
              autoOk
              // formatDate="DD/MM/YYYY"
              value={this.props.dt_envio}
              onChange={this.props.changeData}
            />
          </Col>
          <Col xs={12} md={3}>
            <TimePickerUi
              name="hr_envio"
              floatingLabelText="Hora de envio"
              fullWidth
              autoOk
              format="24hr"
              value={this.props.hr_envio}
              onChange={this.props.changeHora}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <TextFieldUi
              name="dsc_subtitulo"
              floatingLabelText="Adicione um Subtitulo"
              fullWidth
              value={this.props.dsc_subtitulo}
              onChange={this.props.changeSubtitulo}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Mensagem</div>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Destinatários</div>
          </Col>
        </Row>

        <Row>
          <FlatButton
            // onClick={() => addMensagem(description)}
            onClick={addMensagem}
            icon={<Glyphicon glyph="plus" style={{ color: 'white' }} />}
            label="Agendar Mensagem"
            labelStyle={{ color: 'white' }}
            fullWidth
            backgroundColor="#a4c639"
            hoverColor="#8AA62F"
          />
        </Row>
      </form>
    );
    */

    return form;

    // <div className="pageSubTitleCadVotacao">Mensagem </div>
    // <RichEditorExample onChange={this.onChange} editorState={this.state.editorState} />
  }
}

/*
// Conectando form com o redux
const mapStateToProps = state => ({
  dsc_titulo: state.mensagens.dsc_titulo,
  dt_envio: state.mensagens.dt_envio,
  hr_envio: state.mensagens.hr_envio,
  dsc_subtitulo: state.mensagens.dsc_subtitulo,
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeTitulo,
      changeData,
      changeHora,
      changeSubtitulo,
      addMensagem,
      search,
      clear,
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(MensagemForm);
*/

// import { compose } from 'react-apollo';
// import { QueryResultadoList } from './mensagensGraph';

/* REDUX FORM MATERIAL UI */
const selector = formValueSelector('MensagemForm');

MensagemForm = connect(state => ({
  dsc_titulo: selector(state, 'dsc_titulo'),
  // dt_envio: selector(state, 'dt_envio'),
  // hr_envio: selector(state, 'hr_envio'),
  dsc_subtitulo: selector(state, 'dsc_subtitulo'),
}))(MensagemForm);

MensagemForm = reduxForm({
  form: 'MensagemForm',
  initialValues: {
    dsc_titulo: '',
    // dt_envio: '',
    // hr_envio: '',
    dsc_subtitulo: '',
  },
})(MensagemForm);

export default MensagemForm;

/*
this.props.dscTitulo

dscTitulo={this.state.dsc_titulo}
dtEnvio={this.state.dt_envio}
hrEnvio={this.state.hr_envio}
dscSubtitulo={this.state.dsc_subtitulo}
*/
