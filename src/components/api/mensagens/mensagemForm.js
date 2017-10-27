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
import { renderEditor } from '../../generic/forms/myEditor';

import CheckBoxDadosAdicionais from '../../generic/component/checkBoxDadosAdicionais';
import UsuariosByDadosAdicionais from '../../../components/generic/component/usuariosByDadosAdicionais';
// '../../ gestaoUsuario/UsuariosByDadosAdicionais'

import { getStorage } from '../../generic/storage';

// import { QueryResultadoCreate } from './mensagensCreateGraph';
// import { addMensagem, search, clear } from './mensagensActions';

class MensagemForm extends Component {
<<<<<<< HEAD
  /*
  setUsuarioArrUsuario = array => {
    this.setState({
      this.props.usuarios: array ,
    });
  };
  */

  render() {
    const {
      handleSubmit,
      pristine,
      reset,
      submitting,
      checkDadosAdicionais,
      usuarios,
    } = this.props;
=======
  render() {
    const { handleSubmit, pristine, reset, submitting, dadosAdicionais } = this.props;
>>>>>>> eac1122d24abb44438174ce899d053dc690b710e

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
            <Glyphicon glyph="search" style={{ color: 'blue' }} onClick={this.props.search} />
            <Glyphicon glyph="refresh" style={{ color: 'black' }} onClick={this.props.clear} />
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
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Destinatários</div>

            <CheckBoxDadosAdicionais
              name="checkDadosAdicionais"
              codPessoaJuridica={getStorage('cod_pessoa_juridica')}
            />

            <Field
              name="usuarios"
              component={renderEditor}
              label="aaa"
              validate={[required]}
              fullWidth
            />

            <UsuariosByDadosAdicionais
              name="arrUsuarios"
              codPessoaJuridica={getStorage('cod_pessoa_juridica')}
<<<<<<< HEAD
              activeCheckboxes={arrayCheck}
=======
              showCols={[0]}
              dadosAdicionais={dadosAdicionais}
>>>>>>> eac1122d24abb44438174ce899d053dc690b710e
              //renderButtonVariosSelection={this.renderButtonVariosSelection}
              //setUsuarioPodeVotar={this.setUsuarioPodeVotar}
              //renderButtonVariosSelectionDisabled={this.renderButtonVariosSelectionDisabled}
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
<<<<<<< HEAD
  const checkDadosAdicionais = selector(state, 'checkDadosAdicionais');
  const usuarios = selector(state, 'usuarios');

  return {
    checkDadosAdicionais,
    usuarios,
=======
  const dadosAdicionais = selector(state, 'dadosAdicionais');
  return {
    dadosAdicionais,
>>>>>>> eac1122d24abb44438174ce899d053dc690b710e
  };
})(MensagemForm);

export default MensagemForm;

/*
// const selector = formValueSelector('MensagemForm');

// const mapStateToProps = state => ({ numPizzas: selector(state, 'pizzas') });
const mapDispatchToProps = dispatch => bindActionCreators({ addMensagem, search, clear }, dispatch);
MensagemForm = connect(mapDispatchToProps)(MensagemForm);

MensagemForm = reduxForm({
  form: 'MensagemForm', // a unique identifier for this form
})(MensagemForm);

export default MensagemForm;

import { bindActionCreators } from 'redux';


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
