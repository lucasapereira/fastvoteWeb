import React from 'react';

import { Field, reduxForm, getFormValues, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import { geolocated } from 'react-geolocated';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import { required, cpf, email } from '../../generic/validations';

import validate from './validate';
import renderField from './renderField';
import ApiCep from '../../../services/ApiServices';
import Map from './mapContainer';
import { renderTextField } from '../../generic/forms/myTextField';
const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
};

const renderError = ({ meta: { touched, error } }) =>
  touched && error ? <span>{error}</span> : false;

class WizardFormSecondPage extends React.Component {
  state = {
    valueSelected: 'nao',
  };

  handleDados = e => {
    // Pegando o CEP
    const cep = e.target.value;
    // Consultando a API
    ApiCep.SearchCep(cep).then(res => {
      let dsclogradouro = res.data.logradouro;
      let dscbairro = res.data.bairro;
      let dsclocalidade = res.data.localidade;
      let dscuf = res.data.uf;

      this.props.change('dsclogradouro', dsclogradouro);
      this.props.change('dscbairro', dscbairro);
      this.props.change('dsclocalidade', dsclocalidade);
      this.props.change('dscuf', dscuf);
    });
  };

  /*eslint-disable*/
  setTipoLocalizacao = (e, value) => {
    this.setState({ valueSelected: value });
    if (value === 'sim') {
      this.props.change('dsclatitude', this.props.coords.latitude);
      this.props.change('dsclongitude', this.props.coords.longitude);
    }
  };
  /*eslint-enable*/
  retornaGeolocalizacao = () => {
    if (this.props.coords) {
      return (
        <div>
          Deseja utilizar a sua localização atual como a localização do estabelecimento?
          <RadioButtonGroup
            name="shipSpeed"
            valueSelected={this.state.valueSelected}
            onChange={this.setTipoLocalizacao}>
            <RadioButton value="sim" label="Sim" style={styles.radioButton} />
            <RadioButton value="nao" label="Não" style={styles.radioButton} />
          </RadioButtonGroup>
        </div>
      );
    }
  };

  mapClicked = latLng => {
    this.props.change('dsclatitude', latLng.lat());
    this.props.change('dsclongitude', latLng.lng());
  };

  renderMap = () => {
    if (this.state.valueSelected === 'nao') {
      return (
        <div>
          <Row>
            <Col xs={12}>
              Clique com o botão direito no mouse para obter latitude e longitude.
              <Map
                coords={this.props.coords}
                mapClicked={this.mapClicked}
                centerEndereco={this.center}
              />
            </Col>
          </Row>
        </div>
      );
    }
  };
  render() {
    const { handleSubmit, pristine, reset, submitting, previousPage } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12}>
            <div className="pageSubTitleCadVotacao">Endereço</div>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Field
              name="numcep"
              component={renderTextField}
              label="Cep"
              validate={[required]}
              fullWidth
              onBlur={this.handleDados}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              name="dscuf"
              component={renderTextField}
              label="Estado"
              validate={[required]}
              fullWidth
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              name="dsclocalidade"
              component={renderTextField}
              label="Cidade"
              validate={[required]}
              fullWidth
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Field
              onChange={this.onChange}
              name="dscbairro"
              component={renderTextField}
              label="Bairro"
              validate={[required]}
              fullWidth
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              name="dsclogradouro"
              component={renderTextField}
              label="Logradouro"
              validate={[required]}
              fullWidth
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              name="dscnumero"
              component={renderTextField}
              label="Número"
              validate={[required]}
              fullWidth
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              name="dsccomplemento"
              component={renderTextField}
              label="Complemento"
              validate={[required]}
              fullWidth
            />
          </Col>
        </Row>

        {this.retornaGeolocalizacao()}

        <Row>
          <Col xs={12}>
            <Field
              name="dsclatitude"
              component={renderTextField}
              label="Latitude"
              validate={[required]}
              fullWidth
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              name="dsclongitude"
              component={renderTextField}
              label="Longitude"
              validate={[required]}
              fullWidth
            />
          </Col>
        </Row>
        {this.renderMap()}

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
                onClick={previousPage}
                icon={<Glyphicon glyph="repeat" style={{ color: 'gray' }} />}
                label="Voltar"
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

const SegundaPagina = reduxForm({
  form: 'wizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(WizardFormSecondPage);

const selector = formValueSelector('wizard');

connect(state => ({
  values: selector(state, 'rua', 'fieldValue2', 'fieldValue3'),
}))(SegundaPagina);

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: 10000,
})(SegundaPagina);
