import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { bindActionCreators } from 'redux';

import { Field, reduxForm, formValueSelector } from 'redux-form';

import { RadioButton } from 'material-ui/RadioButton';
import MenuItem from 'material-ui/MenuItem';
import { AutoComplete as MUIAutoComplete } from 'material-ui';
import {
  AutoComplete,
  Checkbox,
  DatePicker,
  TimePicker,
  RadioButtonGroup,
  SelectField,
  Slider,
  TextField,
  Toggle,
} from 'redux-form-material-ui';

import { Row, Col, Glyphicon } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';

// import { QueryResultadoList } from './mensagensGraph';
// import { addMensagem, search, clear } from './mensagensActions';

// validation functions
const required = value => (value == null ? 'Required' : undefined);
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid email' : undefined;
const tooManyPizzas = value => (value > 15 ? 'Are you mad?' : undefined);

class MensagemForm extends Component {
  /*
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.search();
  }
  */

  componentDidMount() {
    this.refs.dsc_titulo // the Field
      .getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
      .getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
      .focus(); // on TextField
  }

  render() {
    const { handleSubmit, pristine, numPizzas, reset, submitting } = this.props;
    return (
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
              floatingLabelText="Informe o Título"
              validate={required}
              ref="dsc_titulo"
              withRef
              fullWidth
              // value={this.props.dsc_titulo}
              // onChange={this.props.changeTitulo}
            />
            <Glyphicon glyph="search" style={{ color: 'blue' }} onClick={this.props.search} />
            <Glyphicon glyph="refresh" style={{ color: 'black' }} onClick={this.props.clear} />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={3}>
            <Field
              name="dt_envio"
              component={DatePicker}
              format={null}
              floatingLabelText="Data de envio"
              validate={required}
              ref="dt_envio"
              autoOk
              fullWidth
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={3}>
            <Field
              name="hr_envio"
              component={TimePicker}
              format={null}
              defaultValue={null} // TimePicker requires an object,
              // and redux-form defaults to ''
              floatingLabelText="Hora de envio"
              validate={required}
              ref="hr_envio"
              autoOk
              fullWidth
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Field
              name="dsc_subtitulo"
              component={TextField}
              floatingLabelText="Informe o Subtítulo"
              validate={required}
              //validate={[required, email]}
              ref="dsc_subtitulo"
              withRef
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
            <div>How many pizzas do you want?</div>
            <div>{numPizzas}</div>
            <div>
              <Field
                name="pizzas"
                component={Slider}
                defaultValue={0}
                format={null}
                min={0}
                max={20}
                step={1}
                warn={tooManyPizzas}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Destinatários</div>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <FlatButton
              onClick={this.props.handleAdd}
              icon={<Glyphicon glyph="plus" style={{ color: 'white' }} />}
              label="Agendar Mensagem"
              labelStyle={{ color: 'white' }}
              fullWidth
              backgroundColor="#a4c639"
              hoverColor="#8AA62F"
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6}>
            <button type="submit" disabled={submitting}>
              Submit
            </button>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <button type="button" disabled={pristine || submitting} onClick={reset}>
              Clear
            </button>
          </Col>
        </Row>
      </form>
    );
  }
}

const selector = formValueSelector('MensagemForm');

const mapStateToProps = state => ({ numPizzas: selector(state, 'pizzas') });
MensagemForm = connect(mapStateToProps)(MensagemForm);

MensagemForm = reduxForm({
  form: 'MensagemForm',
  initialValues: {
    dsc_titulo: 'bla bla bla',
    delivery: 'delivery',
    name: 'Jane Doe',
    cheese: 'Cheddar',
    pizzas: 5,
  },
})(MensagemForm);

export default MensagemForm;

/*
const mapStateToProps = state => ({ listMensagens: state.mensagens.listMensagens });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ markAsSend, markAsUnsend, remove }, dispatch);
var conn = connect(mapStateToProps, mapDispatchToProps)(MensagensList);
// export default connect(mapStateToProps, mapDispatchToProps)(MensagensList);
export default compose(QueryResultadoList)(conn);
*/
// const mapDispatchToProps = dispatch =>
//    bindActionCreators({ handleSubmit, pristine, reset, submitting }, dispatch);
// const mapDispatchToProps = dispatch => bindActionCreators({ addMensagem, search, clear }, dispatch);
// MensagemForm = connect(mapStateToProps, mapDispatchToProps)(MensagemForm);

/*
<div>
  <Field name="delivery" component={RadioButtonGroup}>
    <RadioButton value="pickup" label="Pickup" />
    <RadioButton value="delivery" label="Delivery" />
  </Field>
</div>
<div>How many pizzas do you want?</div>
<div>{numPizzas}</div>
<div>
  <Field
    name="pizzas"
    component={Slider}
    defaultValue={0}
    format={null}
    min={0}
    max={20}
    step={1}
    warn={tooManyPizzas}
  />
</div>
<div>
  <Field
    name="driver"
    component={SelectField}
    hintText="Driver"
    floatingLabelText="Driver"
    validate={required}>
      <MenuItem value="alice@redux-pizza.com" primaryText="Alice" />
      <MenuItem value="bob@redux-pizza.com" primaryText="Bob" />
      <MenuItem value="carl@redux-pizza.com" primaryText="Carl" />
  </Field>
</div>
<div>
  <Field name="thinCrust" component={Toggle} label="Thin Crust" labelPosition="right" />
</div>
<div>
  <Field name="pepperoni" component={Checkbox} label="Pepperoni" />
</div>
<div>
  <Field name="mushrooms" component={Checkbox} label="Mushrooms" />
</div>
<div>
  <Field name="peppers" component={Checkbox} label="Peppers" />
</div>
<div>
  <Field
    name="notes"
    component={TextField}
    hintText="Notes"
    floatingLabelText="Notes"
    multiLine
    rows={2}
  />
</div>
<div>
  <Field
    name="cheese"
    component={AutoComplete}
    floatingLabelText="Cheese"
    openOnFocus
    filter={MUIAutoComplete.fuzzyFilter}
    dataSource={['Cheddar', 'Mozzarella', 'Parmesan', 'Provolone']}
  />
</div>
<div>
  <Field
    name="referral"
    component={AutoComplete}
    floatingLabelText="How did you find us?"
    openOnFocus
    filter={MUIAutoComplete.fuzzyFilter}
    dataSourceConfig={{ text: 'name', value: 'id' }}
    dataSource={[
      { id: 0, name: 'Facebook' },
      { id: 1, name: 'Yelp' },
      { id: 2, name: 'TV Ad' },
      { id: 3, name: 'Friend' },
      { id: 4, name: 'Other' },
    ]}
  />
</div>
*/
